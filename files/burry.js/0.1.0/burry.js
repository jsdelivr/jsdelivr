//    Burry.js Storage v0.1.0

//    (c) 2012 Yiorgis Gozadinos, Crypho AS.
//    Burry.js is distributed under the MIT license.
//    http://github.com/ggozad/burry.js

// AMD/global registrations
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return factory();
        });
    } else {
        // Browser globals
        root.Burry = factory();
    }
}(this, function () {

    // Construct a new Burry store with an optional `namespace` and an optional default `ttl`.
    var Burry = {

        Store: function (ns, default_ttl) {
            var stores = Burry.stores();
            if (ns) {
                this._CACHE_SUFFIX = this._CACHE_SUFFIX + ns;
                this._EXPIRY_KEY = this._EXPIRY_KEY + ns;
                if (stores.indexOf(ns) === -1)
                    stores.push(ns);
            }
            localStorage.setItem('_burry_stores_', JSON.stringify(stores));
            this.default_ttl = default_ttl;
        },

        // Time resolution in minutes
        _EXPIRY_UNITS: 60 * 1000,

        // Calculate the time since Epoch in minutes
        _mEpoch: function () {
            return Math.floor((new Date().getTime())/Burry._EXPIRY_UNITS);
        },

        stores: function () {
            var stores = localStorage.getItem('_burry_stores_');
            if (stores) {
                stores = JSON.parse(stores);
            } else {
                stores = [''];
            }
            return stores;
        },

        // Checks for localStorage & JSON support.
        isSupported: function () {
            // If this has been called before we already know.
            if (Burry._isSupported) return Burry._isSupported;

            try {
                localStorage.setItem('_burry_', '_burry_');
                localStorage.removeItem('_burry_');
            } catch (e) {
                return Burry._isSupported = false;
            }
            if (!JSON) {
                return Burry._isSupported = false;
            }
            return Burry._isSupported = true;
        },

        flushExpired: function () {
            var i, match, key, val, ns,
                remove = [],
                now = Burry._mEpoch();

            for (i=0; i< localStorage.length; i++) {
                key = localStorage.key(i);
                match = key.match(/(.+)-_burry_exp_(.*)/);
                if (match) {
                    val = localStorage.getItem(key);
                    if (val < now) {
                        key = match[1]; ns = match[2];
                        remove.push(key + Burry.Store.prototype._CACHE_SUFFIX + ns);
                        remove.push(key + Burry.Store.prototype._EXPIRY_KEY + ns);
                    }
                }
            }
            for (i=0; i< remove.length; i++) {
                localStorage.removeItem(remove[i]);
            }
        }
    };

    // Instance methods

    Burry.Store.prototype = {

        // Suffix to all keys in the cache
        _CACHE_SUFFIX: '-_burry_',

        // Key used to store expiration data
        _EXPIRY_KEY: '-_burry_exp_',

        // Return the internally used suffixed key.
        _internalKey: function (key) {
            return key + this._CACHE_SUFFIX;
        },

        // Return the internally used suffixed expiration key.
        _expirationKey: function (key) {
            return key + this._EXPIRY_KEY;
        },

        // Check if a key is a valid internal key
        _isInternalKey: function (key) {
            if (key.slice(-this._CACHE_SUFFIX.length) === this._CACHE_SUFFIX)
                return key.slice(0, -this._CACHE_SUFFIX.length);
            return false;
        },

        // Check if a key is a valid expiration key
        _isExpirationKey: function (key) {
            if (key.slice(-this._EXPIRY_KEY.length) === this._EXPIRY_KEY)
                return key.slice(0, -this._EXPIRY_KEY.length);
            return false;
        },

        // Returns in how many minutes after Epoch the key expires,
        // or `undefined` if it does not expire.
        _expiresOn: function (key) {
            var expires = localStorage.getItem(this._expirationKey(key));
            if (expires) {
                return parseInt(expires, 10);
            }
        },

        // Parse the value of a key as an integer.
        _getCounter: function (bkey) {
            var value = localStorage.getItem(bkey);
            if (value === null) return 0;

            return parseInt(value, 10);
        },

        // Returns the value of `key` from the cache, `undefined` if the `key` has
        // expired or is not stored.
        get: function (key) {
            var value = localStorage.getItem(this._internalKey(key));
            if (value === null) {
                return undefined;
            }
            if (this.hasExpired(key)) {
                this.remove(key);
                return undefined;
            }
            try {
                value = JSON.parse(value);
            } catch (e) {
                return undefined;
            }
            return value;
        },

        // Sets a `key`/`value` on the cache. Optionally, sets the expiration in `ttl` minutes.
        set: function (key, value, ttl) {
            var i, bkey, expires = {};
            ttl = ttl || this.default_ttl;
            if (ttl) ttl = parseInt(ttl, 10);
            if (typeof key === undefined || typeof value === undefined) return;
            value = JSON.stringify(value);
            try {
                localStorage.setItem(this._internalKey(key), value);
                if (ttl) {
                    localStorage.setItem(this._expirationKey(key), Burry._mEpoch() + ttl);
                } else {
                    localStorage.removeItem(this._expirationKey(key));
                }
            } catch (e) {
                if (e.name === 'QUOTA_EXCEEDED_ERR' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                    // No space left on localStorage, let's flush expired items and try agagin.
                    Burry.flushExpired();
                    try {
                        localStorage.setItem(this._internalKey(key), value);
                        if (ttl) {
                            localStorage.setItem(this._expirationKey(key), Burry._mEpoch() + ttl);
                        } else {
                            localStorage.removeItem(this._expirationKey(key));
                        }
                    }
                    catch (e) {
                        // Oh well. Let's forget about it.
                    }
                }
            }
        },

        // Sets a `key`/`value` on the cache as does **set** but only if the key does not already exist or has expired.
        add: function (key, value, ttl) {
            if (localStorage.getItem(this._internalKey(key)) === null || this.hasExpired(key)) {
                this.set(key, value, ttl);
            }
        },

        // Sets a `key`/`value` on the cache as does **set** but only if the key already exist and has not expired.
        replace: function (key, value, ttl) {
            if (localStorage.getItem(this._internalKey(key)) !== null && !this.hasExpired(key)) {
                this.set(key, value, ttl);
            }
        },

        // Removes an item from the cache.
        remove: function (key) {
            localStorage.removeItem(this._internalKey(key));
            localStorage.removeItem(this._expirationKey(key));
        },

        // Increments the integer value of `key` by 1
        incr: function (key) {
            var bkey = this._internalKey(key),
                value = this._getCounter(bkey);
            value++;
            localStorage.setItem(bkey, value);
        },

        // Decrements the integer value of `key` by 1
        decr: function (key) {
            var bkey = this._internalKey(key),
                value = this._getCounter(bkey);
            value--;
            localStorage.setItem(bkey, value);
        },

        // Returns whether `key` has expired.
        hasExpired: function (key) {
            var expireson = this._expiresOn(key);
            if (expireson && (expireson < Burry._mEpoch())) {
                return true;
            }
            return false;
        },

        // Returns a list of all the cached keys
        keys: function () {
            var i, bkey, key, results = [];
            for (i=0; i < localStorage.length ; i++) {
                bkey = localStorage.key(i);
                key = this._isInternalKey(bkey);
                if (key) {
                    results.push(key);
                }
            }
            return results;
        },

        // Returns an object with all the expirable keys. The values are the ttl
        // in minutes since Epoch.
        expirableKeys: function () {
            var i, bkey, key, results = {};
            for (i=0; i < localStorage.length ; i++) {
                bkey = localStorage.key(i);
                key = this._isExpirationKey(bkey);
                if (key) {
                    results[key] = parseInt(localStorage.getItem(bkey), 10);
                }
            }
            return results;
        },

        // Removes all Burry items from `localStorage`.
        flush: function () {
            var i, key, remove = [];
            for (i=0; i < localStorage.length ; i++) {
                key = localStorage.key(i);
                if (this._isInternalKey(key) || this._isExpirationKey(key)) {
                    remove.push(key);
                }
            }
            for (i=0; i<remove.length; i++)
                localStorage.removeItem(remove[i]);
        },

        // Removes all expired items.
        flushExpired: function () {
            var expirable = this.expirableKeys(), now = Burry._mEpoch(), key, val;
            for (key in expirable) {
                val = expirable[key];
                if (val < now) this.remove(key);
            }
        }
    };

    return Burry;
}));