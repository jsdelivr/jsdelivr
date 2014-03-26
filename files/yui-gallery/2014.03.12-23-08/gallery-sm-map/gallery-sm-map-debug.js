YUI.add('gallery-sm-map', function (Y, NAME) {

/*jshint es3: true, globalstrict: true, indent: 4 */

/**
Provides the `Y.Map` data structure.

@module gallery-sm-map
@main gallery-sm-map
**/

/**
An ordered hash map data structure with an interface and behavior similar to
(but not exactly the same as) [ECMAScript 6 Maps][es6-maps].

[es6-maps]:http://people.mozilla.org/~jorendorff/es6-draft.html#sec-15.14

@class Map
@constructor
@param {Array[]|Map} [entries] Array or Map of entries to add to this map. If an
    array, then each entry should itself be an array in which the first item is
    the key and the second item is the value for that entry.

@param {Object} [options] Options.

    @param {Boolean} [options.autoStamp=false] If `true`, objects used as keys
        will be automatically stamped with a unique id as the value of the
        property defined by the `objectIdName` option ("_yuid" by default) if
        that property isn't already set. This will result in much faster lookups
        for object keys.

    @param {String} [options.objectIdName="_yuid"] Name of a property whose
        string value should be used as the unique key when present on an object
        that's given as a key. This will significantly speed up lookups of
        object-based keys that define this property.
**/

"use strict";

var emptyObject        = {},
    isNative           = Y.Lang._isNative,
    nativeObjectCreate = isNative(Object.create),
    protoSlice         = Array.prototype.slice,
    sizeIsGetter       = isNative(Object.defineProperty) && Y.UA.ie !== 8;

function YMap(entries, options) {
    // Allow options as only param.
    if (arguments.length === 1 && !('length' in entries)
            && typeof entries.entries !== 'function') {

        options = entries;
        entries = null;
    }

    if (options) {
        this._mapOptions = Y.merge(YMap.prototype._mapOptions, options);
    }

    this.clear();

    if (entries) {
        if (!Y.Lang.isArray(entries)) {
            if (typeof entries.entries === 'function') {
                // It quacks like a map!
                entries = entries.entries();
            } else {
                // Assume it's an array-like object.
                entries = protoSlice.call(entries);
            }
        }

        var entry;

        for (var i = 0, len = entries.length; i < len; ++i) {
            entry = entries[i];
            this.set(entry[0], entry[1]);
        }
    }
}

// In modern browsers, the `size` property is a non-enumerable getter on the
// prototype, as specified in ES6. In older browsers (mainly IE<9), we just
// manually update a plain old instance property.
if (sizeIsGetter) {
    Object.defineProperty(YMap.prototype, 'size', {
        configurable: true,

        get: function () {
            return this._mapKeys.length;
        }
    });
}

Y.mix(YMap.prototype, {
    // -- Public Properties ----------------------------------------------------

    /**
    The number of entries in this map.

    @property {Number} size
    @default 0
    @readOnly
    **/

    // -- Protected Properties -------------------------------------------------

    /**
    Whether or not the internal key index is in need of reindexing.

    Rather than reindexing immediately whenever it becomes necessary, we use
    this flag to allow on-demand indexing the first time an up-to-date index is
    actually needed.

    This makes multiple `remove()` operations significantly faster, at the
    expense of a single reindex operation the next time a key is looked up.

    @property {Boolean} _isIndexStale
    @protected
    **/

    /**
    Internal array of the keys in this map.

    @property {Array} _mapKeys
    @protected
    **/

    /**
    Internal index mapping string keys to their indices in the `_mapKeys` array.

    @property {Object} _mapKeyIndices
    @protected
    **/

    /**
    Internal index mapping object key ids to their indices in the `_mapKeys`
    array. This is separate from `_mapKeyIndices` in order to prevent collisions
    between object key ids and string keys.

    @property {Object} _mapObjectIndices
    @protected
    **/

    /**
    Options that affect the functionality of this map.

    @property {Object} _mapOptions
    @protected
    **/
    _mapOptions: {
        objectIdName: '_yuid'
    },

    /**
    Internal array of the values in this map.

    @property {Array} _mapValues
    @protected
    **/

    // -- Public Methods -------------------------------------------------------

    /**
    Deletes all entries from this map.

    @method clear
    @chainable
    **/
    clear: function () {
        this._mapKeys   = [];
        this._mapValues = [];

        this._reindexMap();
        this._updateMapSize();

        return this;
    },

    /**
    Executes the given _callback_ function on each entry in this map.

    To halt iteration early, return `false` from the callback.

    @method each
    @param {Function} callback Callback function.
        @param {Mixed} callback.value Value being iterated.
        @param {Mixed} callback.key Key being iterated.
        @param {Map} callback.map Reference to this map.
    @param {Object} [thisObj] `this` object to use when calling _callback_.
    @chainable
    @see forEach
    **/
    each: function (callback, thisObj) {
        var entries = this.entries(),
            entry;

        for (var i = 0, len = entries.length; i < len; ++i) {
            entry = entries[i];

            if (callback.call(thisObj, entry[1], entry[0], this) === false) {
                break;
            }
        }

        return this;
    },

    /**
    Returns an array of all the entries in this map. Each entry is an array with
    two items, the first being a key and the second a value associated with that
    key.

    @method entries
    @return {Array} Array of entries.
    **/
    entries: function () {
        var entries   = [],
            mapKeys   = this._mapKeys,
            mapValues = this._mapValues;

        for (var i = 0, len = mapKeys.length; i < len; ++i) {
            entries.push([mapKeys[i], mapValues[i]]);
        }

        return entries;
    },

    /**
    Returns the value associated with the given _key_, or _default_ if the key
    isn't found.

    @method get
    @param {Mixed} key Key to look up.
    @param {Mixed} [defaultValue] Default value to return if _key_ isn't found.
    @return {Mixed} Value associated with the given _key_, or _default_ if the
        key isn't found.
    **/
    get: function (key, defaultValue) {
        var i = this._indexOfKey(key);
        return i < 0 ? defaultValue : this._mapValues[i];
    },

    /**
    Returns `true` if _key_ exists in this map, `false` otherwise.

    @method has
    @param {Mixed} key Key to look up.
    @return {Boolean} `true` if _key_ exists in this map, `false` otherwise.
    **/
    has: function (key) {
        return this._indexOfKey(key) >= 0;
    },

    /**
    Returns an array of all the keys in this map.

    @method keys
    @return {Array} Array of keys.
    **/
    keys: function () {
        return protoSlice.call(this._mapKeys);
    },

    /**
    Merges the entries from one or more other maps or entry arrays into this
    map. Entries in later (rightmost) arguments will take precedence over
    entries in earlier (leftmost) arguments if their keys are the same.

    This method also accepts arrays of entries in lieu of actual Y.Map
    instances, so the following operations have the same result:

        // This...
        map.merge(new Y.Map([['a', 'apple'], ['b', 'bear']]));

        // ...has the same result as this...
        map.merge([['a', 'apple'], ['b', 'bear']]);

    @method merge
    @param {Array[]|Map} maps* One or more maps or entry arrays to merge into
        this map.
    @chainable
    **/
    merge: function () {
        var maps = protoSlice.call(arguments),

            entries,
            entry,
            i,
            len,
            map;

        while ((map = maps.shift())) {
            entries = typeof map.entries === 'function' ? map.entries() : map;

            for (i = 0, len = entries.length; i < len; ++i) {
                entry = entries[i];
                this.set(entry[0], entry[1]);
            }
        }

        return this;
    },

    /**
    Deletes the entry with the given _key_.

    @method remove
    @param {Mixed} key Key to delete.
    @return {Boolean} `true` if the key existed and was deleted, `false`
        otherwise.
    **/
    remove: function (key) {
        var i = this._indexOfKey(key);

        if (i < 0) {
            return false;
        }

        this._removeMapEntry(i);
        this._updateMapSize();

        return true;
    },

    /**
    Sets the value of the entry with the given _key_. If the key already exists,
    its value will be overwritten; otherwise it will be created.

    The _key_ may be any JavaScript value (including both primitives and
    objects), but string keys will allow fast lookups, whereas non-string keys
    may result in slower lookups.

    @method set
    @param {Mixed} key Key to set.
    @param {Mixed} value Value to set.
    @chainable
    **/
    set: function (key, value) {
        var i = this._indexOfKey(key);

        if (i < 0) {
            i = this._mapKeys.length;
        }

        this._mapKeys[i]   = key;
        this._mapValues[i] = value;

        this._indexMapKey(i, key);
        this._updateMapSize();

        return this;
    },

    /**
    Returns an array of all the values in this map.

    @method values
    @return {Array} Array of values.
    **/
    values: function () {
        return protoSlice.call(this._mapValues);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Indexes the given _key_ to enable faster lookups.

    @method _indexMapKey
    @param {Number} index Numerical index of the key in the internal `_mapKeys`
        array.
    @param {Mixed} key Key to index.
    @protected
    **/
    _indexMapKey: function (index, key) {
        var objectIdName = this._mapOptions.objectIdName;

        if (typeof key === 'string') {
            if (nativeObjectCreate || this._isSafeKey(key)) {
                this._mapKeyIndices[key] = index;
            }
        } else if (objectIdName && key && typeof key === 'object') {
            if (!key[objectIdName] && this._mapOptions.autoStamp) {
                try {
                    key[objectIdName] = Y.guid();
                } catch (ex) {}
            }

            if (key[objectIdName]
                    && (nativeObjectCreate || this._isSafeKey(key[objectIdName]))) {

                this._mapObjectIndices[key[objectIdName]] = index;
            }
        }
    },

    /**
    Returns the numerical index of the entry with the given _key_, or `-1` if
    not found.

    This is a very efficient operation with string keys, but may be slower with
    non-string keys.

    @method _indexOfKey
    @param {Mixed} key Key to look up.
    @return {Number} Index of the entry with the given _key_, or `-1` if not
        found.
    @protected
    **/
    _indexOfKey: function (key) {
        var objectIdName = this._mapOptions.objectIdName,
            i;

        // Reindex the map if the index is stale.
        if (this._isIndexStale) {
            this._reindexMap();
        }

        // If the key is a string, do a fast hash lookup for the index.
        if (typeof key === 'string') {
            if (nativeObjectCreate || this._isSafeKey(key)) {
                i = this._mapKeyIndices[key];
                return i >= 0 ? i : -1;
            }

        // If the key is an object but has an objectIdName property, do a fast
        // hash lookup for the index of the object key.
        } else if (objectIdName && key !== null && key[objectIdName]) {
            if (nativeObjectCreate || this._isSafeKey(key[objectIdName])) {
                i = this._mapObjectIndices[key[objectIdName]];

                // Return the index if found. If not, we'll fall back to a slow
                // lookup. Even if the object has an id property, it may not be
                // indexed by that property in this Map.
                if (i >= 0) {
                    return i;
                }
            }
        }

        // Resort to a slow O(n) lookup.
        var keys = this._mapKeys,
            same = this._sameValueZero,
            len;

        for (i = 0, len = keys.length; i < len; ++i) {
            if (same(keys[i], key)) {
                return i;
            }
        }

        return -1;
    },

    /**
    Returns `true` if the given string _key_ is safe to use in environments that
    don't support `Object.create()`.

    @method _isSafeKey
    @param {String} key Key to check.
    @return {Boolean} `true` if the key is safe.
    @protected
    **/
    _isSafeKey: function (key) {
        return !(key === 'prototype' || key in emptyObject);
    },

    /**
    Reindexes all the keys in this map.

    @method _reindexMap
    @protected
    **/
    _reindexMap: function () {
        var mapKeys = this._mapKeys;

        this._mapKeyIndices    = nativeObjectCreate ? Object.create(null) : {};
        this._mapObjectIndices = nativeObjectCreate ? Object.create(null) : {};

        for (var i = 0, len = mapKeys.length; i < len; ++i) {
            this._indexMapKey(i, mapKeys[i]);
        }

        this._isIndexStale = false;
    },

    /**
    Removes the entry at the given _index_ from internal arrays.

    This method does not update the `size` property.

    @method _removeMapEntry
    @param {Number} index Index of the entry to remove.
    @protected
    **/
    _removeMapEntry: function (index) {
        if (index === this._mapKeys.length - 1) {
            this._mapKeys.pop();
            this._mapValues.pop();
        } else {
            this._mapKeys.splice(index, 1);
            this._mapValues.splice(index, 1);

            this._isIndexStale = true;
        }
    },

    /**
    Returns `true` if the two given values are the same value, `false`
    otherwise.

    This is an implementation of the [ES6 SameValueZero][es6-svz] comparison
    algorithm. It's more correct than `===` in that it considers `NaN` to be the
    same as `NaN`.

    Note that `0` and `-0` are considered the same by this algorithm.

    [es6-svz]: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-9.2.4

    @method _sameValueZero
    @param {Mixed} a First value to compare.
    @param {Mixed} b Second value to compare.
    @return {Boolean} `true` if _a_ and _b_ are the same value, `false`
        otherwise.
    @protected
    **/
    _sameValueZero: function (a, b) {
        return a === b || (a !== a && b !== b);
    },

    /**
    Updates the value of the `size` property in old browsers. In ES5 browsers
    this is a noop, since the `size` property is a getter.

    @method _updateMapSize
    @protected
    **/
    _updateMapSize: sizeIsGetter ? function () {} : function () {
        this.size = this._mapKeys.length;
    }
}, true);

/**
Alias for `remove()`.

@method delete
@see remove
**/
YMap.prototype['delete'] = YMap.prototype.remove;

/**
Alias for `each()`.

@method forEach
@see each
**/
YMap.prototype.forEach = YMap.prototype.each;

/**
Returns a JSON-serializable representation of this map.

This is effectively an alias for `entries()`, but could be overridden to
return a customized representation.

@method toJSON
@return {Array} JSON-serializable array of entries in this map.
**/
YMap.prototype.toJSON = YMap.prototype.entries;

Y.Map = YMap;


}, 'gallery-2013.09.04-21-56', {"requires": []});
