YUI.add('gallery-storage-lite', function (Y, NAME) {

/*global YUI */
/*jslint onevar: true, browser: true, undef: true, bitwise: true, regexp: true, newcap: true, immed: true */

/**
 * Implements a persistent local key/value data store similar to HTML5's
 * localStorage. Should work in IE5+, Firefox 2+, Safari 3.1+, Chrome 4+, and
 * Opera 10.5+.
 *
 * @module gallery-storage-lite
 */

// -- Shorthand ----------------------------------------------------------------
var d           = Y.config.doc,
    w           = Y.config.win,
    JSON        = Y.JSON,
    StorageLite = Y.namespace('StorageLite'),

// -- Private Constants --------------------------------------------------------
DB_NAME           = 'yui_storage_lite',
DB_DISPLAYNAME    = 'YUI StorageLite data',
DB_MAXSIZE        = 1048576,
DB_VERSION        = '1.0',

EVT_READY         = 'ready',

MODE_NOOP         = 0,
MODE_HTML5        = 1,
MODE_GECKO        = 2,
MODE_DB           = 3,
MODE_USERDATA     = 4,

USERDATA_PATH     = 'yui_storage_lite',
USERDATA_NAME     = 'data',

// -- Private Variables --------------------------------------------------------
data = {},
storageDriver,
storageMode;

// -- Implementation -----------------------------------------------------------

// Determine the best available storage mode.
try {
    if (w.localStorage) {
        storageMode = MODE_HTML5;
    } else if (w.globalStorage) {
        storageMode = MODE_GECKO;
    } else if (w.openDatabase && navigator.userAgent.indexOf('Chrome') === -1) {
        storageMode = MODE_DB;
    } else if (Y.UA.ie >= 5) {
        storageMode = MODE_USERDATA;
    } else {
        storageMode = MODE_NOOP;
    }
} catch (ex) {
    storageMode = MODE_NOOP;
}

Y.StorageFullError = function (message) {
    Y.StorageFullError.superclass.constructor.call(message);

    this.name    = 'StorageFullError';
    this.message = message || 'Maximum storage capacity reached';

    if (Y.UA.ie) {
        this.description = this.message;
    }
};

Y.extend(Y.StorageFullError, Error);

/**
 * Provides a persistent local key/value data store similar to HTML5's
 * localStorage.
 *
 * @class StorageLite
 * @static
 */

// -- Public Events ------------------------------------------------------------
Y.augment(StorageLite, Y.EventTarget, true, null, {
    emitFacade : true,
    prefix     : 'storage-lite',
    preventable: false
});

/**
 * Fired when the storage interface is loaded and ready for use.
 *
 * @event storage-lite:ready
 */
StorageLite.publish(EVT_READY, {fireOnce: true});

Y.mix(StorageLite, {
    // -- Public Methods -------------------------------------------------------

    /**
     * Removes all items from the data store.
     *
     * @method clear
     */
    clear: function () {},

    /**
     * Returns the item with the specified key, or <code>null</code> if the item
     * was not found.
     *
     * @method getItem
     * @param {String} key
     * @param {bool} json (optional) <code>true</code> if the item is a JSON
     *     string and should be parsed before being returned
     * @return {Object|null} item or <code>null</code> if not found
     */
    getItem: function (key, json) { return null; },

    /**
     * Returns the number of items in the data store.
     *
     * @method length
     * @return {Number} number of items in the data store
     */
    length: function () { return 0; },

    /**
     * Removes the item with the specified key.
     *
     * @method removeItem
     * @param {String} key
     */
    removeItem: function (key) {},

    /**
     * Stores an item under the specified key. If the key already exists in the
     * data store, it will be replaced.
     *
     * @method setItem
     * @param {String} key
     * @param {Object} value
     * @param {bool} json (optional) <code>true</code> if the item should be
     *     serialized to a JSON string before being stored
     */
    setItem: function (key, value) {}

});

if (storageMode === MODE_HTML5 || storageMode === MODE_GECKO) {

    // Common methods shared by the HTML5 and Gecko implementations.
    Y.mix(StorageLite, {
        length: function () {
            return storageDriver.length;
        },

        removeItem: function (key) {
            storageDriver.removeItem(key);
        },

        setItem: function (key, value, json) {
            storageDriver.setItem(key, json ? JSON.stringify(value) : value);
        }
    }, true);

    if (storageMode === MODE_HTML5) {

        // HTML5 localStorage methods. Currently supported by IE8, Firefox 3.5+,
        // Safari 4+, Chrome 4+, and Opera 10.5+.
        storageDriver = w.localStorage;

        // Mobile Safari in iOS 5 loses track of storageDriver when page is
        // restored from the bfcache. This fixes the reference.
        Y.Node.DOM_EVENTS.pageshow = 1;

        Y.on('pageshow', function () {
            storageDriver = w.localStorage;
        });

        Y.mix(StorageLite, {
            clear: function () {
                storageDriver.clear();
            },

            getItem: function (key, json) {
                try {
                    return json ? JSON.parse(storageDriver.getItem(key)) :
                            storageDriver.getItem(key);
                } catch (ex) {
                    return null;
                }
            }
        }, true);

    } else if (storageMode === MODE_GECKO) {

        // Gecko globalStorage methods. Supported by Firefox 2 and 3.0.
        storageDriver = w.globalStorage[w.location.hostname];

        Y.mix(StorageLite, {
            clear: function () {
                for (var key in storageDriver) {
                    if (storageDriver.hasOwnProperty(key)) {
                        storageDriver.removeItem(key);
                        delete storageDriver[key];
                    }
                }
            },

            getItem: function (key, json) {
                try {
                    return json ? JSON.parse(storageDriver[key].value) :
                            storageDriver[key].value;
                } catch (ex) {
                    return null;
                }
            }
        }, true);

    }

    StorageLite.fire(EVT_READY);

} else if (storageMode === MODE_DB || storageMode === MODE_USERDATA) {

    // Common methods shared by the database and userdata implementations.
    Y.mix(StorageLite, {
        clear: function () {
            data = {};
            StorageLite._save();
        },

        getItem: function (key, json) {
            return data.hasOwnProperty(key) ? data[key] : null;
        },

        length: function () {
            var count = 0, key;

            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    count += 1;
                }
            }

            return count;
        },

        removeItem: function (key) {
            delete data[key];
            StorageLite._save();
        },

        setItem: function (key, value, json) {
            data[key] = value;
            StorageLite._save();
        }

    }, true);

    if (storageMode === MODE_DB) {

        // Database storage methods. Supported by Safari 3.1 and 3.2.
        storageDriver = w.openDatabase(DB_NAME, DB_VERSION, DB_DISPLAYNAME, DB_MAXSIZE);

        Y.mix(StorageLite, {
            _save: function () {
                storageDriver.transaction(function (t) {
                    t.executeSql("REPLACE INTO " + DB_NAME + " (name, value) VALUES ('data', ?)", [JSON.stringify(data)]);
                });
            }
        }, true);

        storageDriver.transaction(function (t) {
            t.executeSql("CREATE TABLE IF NOT EXISTS " + DB_NAME + "(name TEXT PRIMARY KEY, value TEXT NOT NULL)");
            t.executeSql("SELECT value FROM " + DB_NAME + " WHERE name = 'data'", [], function (t, results) {
                if (results.rows.length) {
                    try {
                        data = JSON.parse(results.rows.item(0).value);
                    } catch (ex) {
                        data = {};
                    }
                }

                StorageLite.fire(EVT_READY);
            });
        });

    } else if (storageMode === MODE_USERDATA) {

        // userData storage methods. Supported by IE5, 6, and 7.
        storageDriver = d.createElement('span');
        storageDriver.addBehavior('#default#userData');

        Y.mix(StorageLite, {
            _save: function () {
                var _data = JSON.stringify(data);

                try {
                    storageDriver.setAttribute(USERDATA_NAME, _data);
                    storageDriver.save(USERDATA_PATH);
                } catch (ex) {
                    throw new Y.StorageFullError();
                }
            }
        }, true);

        Y.on('domready', function () {
            d.body.appendChild(storageDriver);
            storageDriver.load(USERDATA_PATH);

            try {
                data = JSON.parse(storageDriver.getAttribute(USERDATA_NAME) || '{}');
            } catch (ex) {
                data = {};
            }

            StorageLite.fire(EVT_READY);
        });

    }

} else {

    // Fire the ready event for browsers that only support the noop mode.
    StorageLite.fire(EVT_READY);

}


}, 'gallery-2013.01.16-21-05', {"requires": ["event-base", "event-custom", "event-custom-complex", "json", "node-base"]});
