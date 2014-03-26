YUI.add('gallery-tag', function(Y) {

/**
 * Provides methods for registering mixins with types of Nodes.
 *
 * @module gallery-tag
 */
var Tag = Y.namespace('Tag'),
    registered = {},
    has_attrs = false; // Attribute support is a slower code path

// Helper method to split names on ','
function splitName(name) {
    return name.replace(' ', '').toLowerCase().split(',');
}

/**
 * @method register
 * @description Registers a new tag mixin.
 * @param {string} name N/A
 * @param {object} mixin N/A
 */
Tag.register = function(name, mixin) {
    var parts = splitName(name);

    Y.Array.each(parts, function(part) {
        if (part.indexOf('[') >= 0) {
            has_attrs = true;
        }

        registered[part] = {
            mixin: mixin,
            handle: Y.on('inserted', function(e) {
                e.target.fire('tag:inserted', e);
            }, part)
        };
    });
};

/**
 * @method unregister
 * @description Unregister a tag mixin.
 * @param {string} name N/A
 */
Tag.unregister = function(name) {
    var parts = splitName(name);

    Y.Array.each(parts, function(part) {
        if (registered[part]) {
            registered[part].handle.detach();
            delete registered[part];
        }
    });
};

/**
 * @method registered
 * @description Gets all currently registered tag mixins.
 * @param {string} name N/A
 */
Tag.registered = function(name) {
    return name ? name in registered : Object.keys(registered);
};

/*
 * Helper method to group attributes by common prefix (data- or xxx:)
 * Bug #2532464: YUI doesn't properly camelize data attrs
 */
function groupAttrs(raw) {
    var attrs = {
            data: {},
            grouped: {},
            ungrouped: {}
        },
        prefix = 'data-';

    // Helper to camelize names
    function formatName(name) {
        return name.replace(/-([a-z])/g, function(s, l) {return l.toUpperCase();});
    }

    // Helper to parse ints
    function formatValue(value) {
        var match = /^i:(-?[0-9]+)$/.exec(value);
        if (match) {
            return parseInt(match[1], 10);
        }
        return value;
    }

    Y.Array.each(raw, function(attr) {
        var name = attr.name,
            value = attr.value,
            index = name.indexOf(':'),
            group;

        if (name.indexOf(prefix) === 0) { // data attributes
            name = formatName(name.substr(prefix.length));
            attrs.data[name] = formatValue(value);
        } else if (index >= 0) {    // namespaced attributes (x:y)
            group = name.substr(0, index);
            if (!attrs.grouped[group]) {attrs.grouped[group] = {};}
            name = formatName(name.substr(index + 1));
            attrs.grouped[group][name] = formatValue(value);
        }
        else {
            attrs.ungrouped[name] = formatValue(value);
        }
    });

    return attrs;
}

/**
 * @class TagPlugin
 * @description Plugin added to all Nodes.
 * @param {object} config Configuration.
 */
function TagPlugin(config) {
    TagPlugin.superclass.constructor.apply(this, arguments);
}

TagPlugin.NAME = 'tagPlugin';
TagPlugin.NS = 'tag';

Y.extend(TagPlugin, Y.Plugin.Base, {
    // This function needs to be fast since it gets called on Node creation.
    initializer: function() {
        var host = this.get('host'),
            tag = (host.get('tagName') || '').toLowerCase(),
            mixins = [],
            raw_attrs = host.getDOMNode().attributes,
            attrs;

        if (registered[tag]) {
            mixins.push({obj: registered[tag].mixin});
        }

        if (has_attrs) {
            Y.each(raw_attrs, function(attr) {
                var name = '[' + attr.name + ']';
                if (registered[name]) {
                    mixins.push({obj: registered[name].mixin, attr: attr.name});
                }
            });
        }

        if (mixins.length) {
            // Need to cache host instance since it hasn't fully initialized. Otherwise it's possible
            // to get into an infinite loop of mixins referring to nodes which haven't been cached yet.
            Y.Node._instances[host._yuid] = host;
            attrs = groupAttrs(raw_attrs);

            Y.Array.each(mixins, function(mixin) {
                var config = mixin.attr ? attrs.grouped[mixin.attr] || {} : attrs.data;

                Y.mix(this, mixin.obj);

                if (mixin.obj.created) {
                    mixin.obj.created.call(this, config);
                }
            }, this);
        }
    }
});

Y.Node.plug(TagPlugin);


}, 'gallery-2012.07.25-21-36' ,{requires:['node', 'base', 'plugin', 'gallery-event-inserted'], skinnable:false});
