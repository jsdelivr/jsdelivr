/*
Copyright 2013 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add('gallery-pathogen-encoder', function (Y, NAME) {

var resolve = Y.Loader.prototype.resolve,

    NAMESPACE       = 'p/',
    GROUP_DELIM     = ';',
    SUB_GROUP_DELIM = '+',
    MODULE_DELIM    = ',',

    FILTER_RE       = /-(min|debug).js/,
    EXTENSION_RE    = /\.(?:js|css)$/,
    GALLERY_RE      = /^(?:yui:)?gallery-([^\/]+)/,
    TYPES           = { js: true, css: true },

    customComboBase,
    maxURLLength,
    galleryVersion;

/**
Build each combo url from the bottom up. There's probably room for optimization
here, but let's keep it simple for now.
@method buildCombo
@param {Array} groups Grouped module meta.
@param {String} comboBase The base of the combo url.
@param {String} comboTail The tail of the combo url (e.g. .debug.js).
@return {String} A combo url.
*/
Y.Loader.prototype.buildCombo = function (groups, comboBase, comboTail) {
    var comboUrl = comboBase,
        currLen  = comboBase.length + comboTail.length,
        currDelim,
        currKey,
        prepend,
        modules,
        token,
        group,
        len,
        i;

    for (i = 0, len = groups.length; i < len; i += 1) {
        group       = groups[i];
        currDelim   = comboUrl === comboBase ? '' : GROUP_DELIM;
        currKey     = group.key;
        modules     = group.modules;

        while (modules.length) {
            prepend = currDelim + currKey;
            prepend = prepend ? prepend + SUB_GROUP_DELIM : MODULE_DELIM;

            // Since modules with custom paths are treated as their own
            // segment, we override the prepend value so that it is only ever
            // set to the group delimiter. TODO: refactor this while loop into
            // one with multiple if-statements to make it easier to read.
            if (group.key.indexOf('path') === 0) {
                prepend = currDelim;
            }

            token = prepend + modules[0];

            if (currLen + token.length < maxURLLength) {
                comboUrl += token;
                currLen  += token.length;
                modules.shift();
            } else {
                return comboUrl + comboTail;
            }

            currDelim = currKey = '';
        }
    }

    comboUrl += comboTail;

    // If no modules were encoded in the combo url.
    if (comboUrl.length === comboBase.length + comboTail.length) {
        comboUrl = null;
    }

    return comboUrl;
};

/**
Aggregate modules into groups with unique keys. The key is "$name+$version" for
core and gallery groups, and just "$root" for all other groups.
@method aggregateGroups
@param {Array} modules A list of module meta.
@return {Object} Aggregated groups of module meta.
*/
Y.Loader.prototype.aggregateGroups = function (modules) {
    var source = {},
        galleryMatch,
        compressed,
        prefixTree,
        meta,
        name,
        mod,
        key,
        len,
        i;

    // Segment the modules for efficient combo encoding.
    for (i = 0, len = modules.length; i < len; i += 1) {
        mod     = modules[i];
        name    = mod.name;

        // Skip modules that should be loaded singly. This is kind of confusing
        // because it mimics the behavior of the loader (also confusing):
        // https://github.com/ekashida/yui3/blob/632167a36d57da7a884aacf0f4488dd5b8619c7c/src/loader/js/loader.js#L2563
        meta = this.groups && this.groups[mod.group];
        if (meta) {
            if (!meta.combine || mod.fullpath) {
                continue;
            }
        } else if (!this.combine) {
            continue;
        }
        if (!mod.combine && mod.ext) {
            continue;
        }

        // YUI core modules => core group
        if (!mod.group) {
            key = 'c' + SUB_GROUP_DELIM + YUI.version;
        }
        // YUI gallery modules => gallery group
        else if (mod.group === 'gallery') {
            if (!galleryVersion) {
                galleryMatch   = GALLERY_RE.exec(this.groups.gallery.root);
                galleryVersion = galleryMatch && galleryMatch[1];
            }
            name = name.split('gallery-').pop(); // remove prefix
            key  = 'g' + SUB_GROUP_DELIM + galleryVersion;
        }
        // If the module was built the YUI way, then we segment these modules
        // into the `root` group.
        else if (mod.path.indexOf(name + '/' + name) === 0) {
            key = meta.root;

            // Trim '/' from both ends.
            if (key[0] === '/') {
                key = key.slice(1);
            }
            if (key[key.length - 1] === '/') {
                key = key.slice(0, -1);
            }

            key = 'r' + SUB_GROUP_DELIM + key;
        }
        // If the path does not follow the YUI build convention, then we
        // add them to the prefix tree and subsequently segment these modules
        // into the `path` group.
        else {
            // remove file extension
            name = mod.path.split(EXTENSION_RE).shift();

            if (meta && meta.root) {
                name = meta.root + name;
            }

            if (name[0] === '/') {
                name = name.slice(1);
            }

            // If fullpath compression is enabled, add this module's fullpath
            // to the prefix tree for later compression
            if (Y.config.fullpathCompression) {
                prefixTree = prefixTree || new PrefixTree({
                    rootPrefix:     'p+',
                    moduleDelim:    MODULE_DELIM,
                    subgroupDelim:  SUB_GROUP_DELIM,
                    groupDelim:     GROUP_DELIM
                });
                prefixTree.add(name);
                continue;
            }

            // Tag this module as `path` so that we know to include the
            // full path in the combo url later on
            key = 'path' + SUB_GROUP_DELIM + name;
        }

        source[key] = source[key] || [];
        source[key].push(name);

        // If fallback feature is enabled, record the full module name as seen
        if (Y.config.customComboFallback) {
            if (mod.group === 'gallery') {
                name = 'gallery-' + name;
            }
            this.pathogenSeen[name] = true;
        }
    }

    if (prefixTree) {
        compressed = prefixTree.compress();
        for (i = 0, len = compressed.length; i < len; i += 1) {
            key = 'p' + SUB_GROUP_DELIM + compressed[i].root;
            source[key] = source[key] || [];
            source[key].push(compressed[i].name);
        }

        // clean up
        prefixTree.destroy();
        prefixTree = null;
    }

    return source;
};

/**
A class that represents a prefix tree data structure for file paths. The main
purpose of this class is to optimally compress itself when the added paths need
to be serialized.
@class PrefixTree
@constructor
**/
function PrefixTree (config) {
    this.tree = {
        weight: Number.MAX_VALUE,
        path: '/',
        children: {}
    };

    this.rootPrefixLen     = config.rootPrefix.length    || 0;
    this.moduleDelimLen    = config.moduleDelim.length   || 0;
    this.subgroupDelimLen  = config.subgroupDelim.length || 0;
    this.groupDelimLen     = config.groupDelim.length    || 0;
}

PrefixTree.prototype = {

    /**
    Adds a path to the prefix tree instance. Calculates the weight of each node
    as paths are added. The weight of a node represents the number of
    characters in the the path value of the node, combined with the number of
    characters in the path value of each of its children's paths (relative to
    the node's path value).
    @method add
    @param {String} fullpath A path
    **/
    add: function (fullpath) {
        var currentNode = this.tree,
            remaining   = fullpath.split('/'),
            traversed   = [],
            remainingPath,
            traversedPath,
            child,
            part;

        while (remaining.length) {
            part  = remaining.shift();
            child = currentNode.children[part];

            traversed.push(part);
            remainingPath = remaining.join('/');

            if (!child) {
                traversedPath = traversed.join('/');

                child = currentNode.children[part] = {
                    path: traversedPath,
                    weight: 0
                };

                // If not leaf node
                if (remainingPath) {
                    child.weight += traversedPath.length + remainingPath.length;

                    // Account for the length of the subgroup delimiter
                    child.weight += this.subgroupDelimLen;

                    child.children = {};
                } else {
                    // Guarantee that leaf nodes will never be roots
                    child.weight = Number.MAX_VALUE;
                }
            } else {
                // Account for the length of the module delimiter
                child.weight += this.moduleDelimLen + remainingPath.length;
            }

            // bubble down
            currentNode = child;
        }

        Y.log('Added ' + currentNode.path, 'debug', 'PrefixTree');
    },

    /**
    Compresses the prefix tree. Uses a depth-first search to find the optimal
    set of roots to serialize all the added paths.
    @method compress
    @return {Array} compressed An array of (root path, module path) pairs that
        represent the the optimal way to serialize the prefix tree.
    **/
    compress: function () {
        var process     = [],
            compressed  = [],
            children,
            root_re,
            leaves,
            weight,
            total,
            child,
            node,
            key,
            i;

        // Start with the root node's children
        for (key in this.tree.children) {
            if (this.tree.children.hasOwnProperty(key)) {
                process.push(this.tree.children[key]);
            }
        }

        Y.log(this.stringify(this.tree), 'debug', 'PrefixTree');

        while (process.length) {
            total    = 0;
            children = [];

            node = process.pop();

            // Account for the length of the root prefix
            weight = this.rootPrefixLen + node.weight;

            // Find the total resulting weight if we use the children of this
            // node as roots
            for (key in node.children) {
                if (node.children.hasOwnProperty(key)) {
                    child = node.children[key];

                    // Account for the length of the initial and subsequent
                    // group delimiters for every additional root
                    total += children.length ?
                             this.groupDelimLen + this.rootPrefixLen :  // ;p+
                             this.rootPrefixLen;                        //  p+

                    total += child.weight;

                    children.push(child);
                }
            }

            Y.log('Weight of the current root "' + node.path + '": ' + weight, 'debug', 'PrefixTree');
            Y.log('Combined weight of child roots: ' + total, 'debug', 'PrefixTree');

            if (weight <= total) {
                // If the weigth of this node is less than or equal to the
                // total weight of its child nodes combined, it means that
                // we'll get better compression by using this node as a root
                Y.log('Established root: "' + node.path + '"', 'debug', 'PrefixTree');

                root_re = new RegExp('^' + node.path + '/');

                // Now that we've decided to use this node as a root, we can
                // determine what the module names should be
                leaves = this.getLeafNodes(node);
                for (i = 0; i < leaves.length; i += 1) {
                    compressed.push({
                        // module name = full path - root
                        name: leaves[i].path.replace(root_re, ''),
                        root: node.path
                    });
                }
            } else {
                // If the weight of this node is greater than the total weight
                // of its child nodes combined, it means that we'll get better
                // compression by using each child node as an individual root.
                Y.log('Scheduling ' + children.length + ' child(ren) of "' + node.path + '" for further processing...', 'debug', 'PrefixTree');
                process = process.concat(children);
            }
        }

        Y.log(this.stringify(compressed), 'debug', 'PrefixTree');

        return compressed;
    },

    /**
    Finds all the leaf nodes of a given node
    @method getLeafNodes
    @param {Object} tree A node in the prefix tree
    @return {Array} All leaf nodes of a particular node
    **/
    getLeafNodes: function (tree) {
        var leaves = [],
            key;

        // base case
        if (!tree.children) {
            leaves.push(tree);
            return leaves;
        }

        for (key in tree.children) {
            if (tree.children.hasOwnProperty(key)) {
                leaves = leaves.concat(
                    this.getLeafNodes(
                        tree.children[key]
                    )
                );
            }
        }

        return leaves;
    },

    /**
    Destroys the instance to free up memory
    @method destroy
    **/
    destroy: function () {
        this.tree = null;
    },

    stringify: function (thing) {
        return JSON && JSON.stringify(thing, null, 4);
    }

};

/**
Sort the aggregated groups, and the modules within them. Minimizes cache misses
in Yahoo's infrastructure by encoding predictable combo urls across browsers
since iterating over an object does not guarantee order.
@method sortAggregatedGroups
@param {Object} groups Aggregated groups.
@return {Array} Sorted groups.
**/
Y.Loader.prototype.sortAggregatedGroups = function (groups) {
    var sorted = [],
        key,
        len,
        i;

    for (key in groups) {
        if (groups.hasOwnProperty(key)) {
            sorted.push({
                key: key,
                modules: groups[key]
            });
        }
    }

    // Sort the groups.
    sorted.sort(function (a, b) {
        return a.key > b.key;
    });

    // Sort the modules.
    for (i = 0, len = sorted.length; i < len; i += 1) {
        sorted[i].modules.sort();
    }

    return sorted;
};

/**
Build each combo url from the bottom up. There's probably room for optimization
here, but let's keep it simple for now.
@method customResolve
@param {Array} modules A list of module meta.
@param {String} type Either `js` or `css`.
@return {String} Combo url.
*/
Y.Loader.prototype.customResolve = function (modules, type) {
    var source      = this.aggregateGroups(modules),
        groups      = this.sortAggregatedGroups(source),
        comboUrls   = [],
        comboTail,
        filter,
        match,
        url;

    // Determine the combo tail (e.g., '.debug.js'). Assumption: `filter` is
    // global to the resolve() and should match the filter on loader.
    if (!filter) {
        match     = FILTER_RE.exec(Y.config.loaderPath);
        filter    = match && match[1] || 'raw';
        filter    = (type === 'css' && filter === 'debug') ? 'raw' : 'min';
        comboTail = filter === 'min' ? '' : '.' + filter;
        comboTail = comboTail + '.' + type;
    }

    url = this.buildCombo(groups, customComboBase, comboTail);
    while (url) {
        comboUrls.push(url);
        url = this.buildCombo(groups, customComboBase, comboTail);
    }

    return comboUrls;
};

/**
Determines whether or not we should fallback to default combo urls by checking
to see if Loader re-requests any module that we've already seen.
@method shouldFallback
@param {Object} resolved Resolved module metadata by original `resolve`.
@return {Boolean} Whether or not to fallback.
**/
Y.Loader.prototype.shouldFallback = function (resolved) {
    var modules,
        name,
        type;

    if (this.fallbackMode) {
        return this.fallbackMode;
    }

    for (type in TYPES) {
        if (TYPES.hasOwnProperty(type)) {
            modules = resolved[type + 'Mods'];
            for (i = 0, len = modules.length; i < len; i += 1) {
                name = modules[i].name;

                if (this.pathogenSeen[name]) {
                    Y.log('Detected a request for a module that we have already seen: ' + name, 'warn', NAME);
                    Y.log('Falling back to default combo urls', 'warn', NAME);

                    this.fallbackMode = true;
                    return this.fallbackMode;
                }
            }
        }
    }
};

/**
Wraps Loader's `resolve` method and uses the module metadata returned by it to
encode pathogen urls. Note that we will incur the cost of encoding default
combo urls until we replace the encoding logic in core.
@method resolve
**/
Y.Loader.prototype.resolve = function () {
    var resolved = resolve.apply(this, arguments),
        combine  = this.combine,
        resolvedUrls,
        resolvedMods,
        comboUrls,
        singles,
        urlKey,
        modKey,
        group,
        type,
        url,
        len,
        i;

    // Check to see if anything needs to be combined.
    if (!combine) {
        for (group in this.groups) {
            if (this.groups.hasOwnProperty(group)) {
                if (!combine && group.combine) {
                    combine = group.combine;
                    break;
                }
            }
        }
    }

    // Add the pathogen namespace to the combo base.
    if (Y.config.customComboBase) {
        customComboBase = Y.config.customComboBase + NAMESPACE;
    }

    // Fallback to the default combo url if we need to.
    if (Y.config.customComboFallback) {
        this.pathogenSeen = this.pathogenSeen || {};

        if (this.shouldFallback(resolved)) {
            return resolved;
        }
    }

    if (customComboBase && combine) {
        maxURLLength = this.maxURLLength;

        for (type in TYPES) {
            /*jslint forin: false*/
            if (!TYPES.hasOwnProperty(type)) {
            /*jslint forin: true*/
                continue;
            }

            singles = [];
            urlKey  = type;
            modKey  = type + 'Mods';

            resolved[urlKey] = resolvedUrls = resolved[urlKey] || [];
            resolved[modKey] = resolvedMods = resolved[modKey] || [];

            for (i = 0, len = resolvedUrls.length; i < len; i += 1) {
                url = resolvedUrls[i];
                if (
                    typeof url === 'object' ||
                    (typeof url === 'string' && url.indexOf('/combo?') === -1)
                ) {
                    singles.push(url);
                }
            }

            // Generate custom combo urls.
            comboUrls = this.customResolve(resolvedMods, type);

            if (window.JSON) {
                Y.log('Default encoding resulted in ' + resolved[type].length + ' URLs', 'info', NAME);
                Y.log(JSON.stringify(resolved[type], null, 4), 'info', NAME);
                Y.log('Custom encoding resulted in ' + comboUrls.length + ' URLs', 'info', NAME);
                Y.log(JSON.stringify(comboUrls, null, 4), 'info', NAME);
            }

            resolved[type] = [].concat(comboUrls, singles);
        }
    }

    return resolved;
};

}, '@BETA@', { requires: ['loader-base'] });
