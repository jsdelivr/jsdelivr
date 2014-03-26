YUI.add('gallery-expiration-cache', function(Y) {

/**
 * @module gallery-expiration-cache
 */

/**
 * <p>Cache which drops items based on a user-defined expiration criterion,
 * e.g., age.  By default, expired items are only removed when they are
 * requested.  If you want to "stop the world" and clean out the cache,
 * call clean().</p>
 * 
 * @main gallery-expiration-cache
 * @class ExpirationCache
 * @constructor
 * @param config {Object}
 * @param [config.store] {Object} Data store which implements get,put,remove,clear,keys.  If not specified, a new instance of `Y.InstanceManager` is created.
 * @param [config.meta] {Function} Attaches meta data to an item when it is added to the cache.  It receives the value as an argument.  If not specified, the default is to timestamp the item.
 * @param config.expire {Function} Returns true if the item has expired.  It receives the meta data and the value as arguments.  If a number is specified, it is assumed to be a duration in milliseconds.
 * @param [config.stats] {Boolean} Pass true if you want to collect basic statistics.  Pass a function if you want to control what information is stored for each key.  The function receives the key, the value, and the stat object.
 */
function ExpirationCache(config)
{
	this._store  = config.store || new Y.InstanceManager();
	this._meta   = config.meta  || timestamp;
	this._expire = Y.Lang.isNumber(config.expire) ? Y.rbind(expire, null, config.expire) : config.expire;
	this._stats  = config.stats ? initStats() : null;

	if (Y.Lang.isFunction(config.stats))
	{
		this._stats_key_meta = config.stats;
	}
}

function timestamp()
{
	return new Date().getTime();
}

function expire(timestamp, value, delta)
{
	var elapsed = new Date().getTime() - timestamp;
	return (elapsed > delta);
}

function initStats()
{
	return { gets: 0, keys: {} };
}

function initKeyStats(keys, key)
{
	if (!keys[key])
	{
		keys[key] = { puts: 0, gets: 0 };
	}
}

ExpirationCache.prototype =
{
	/**
	 * Retrieve a value.
	 * 
	 * @method get
	 * @param key {String} the key of the object to retrieve
	 * @return {Mixed} the stored object, or undefined if the slot is empty
	 */
	get: function(
		/* string */	key)
	{
		var obj = this._store.get(key);
		if (obj && this._expire(obj.meta, obj.data))
		{
			this._store.remove(key);
		}
		else if (obj)
		{
			if (this._stats)
			{
				this._stats.gets++;

				initKeyStats(this._stats.keys, key);
				this._stats.keys[key].gets++;
			}

			return obj.data;
		}
	},

	/**
	 * Store a value.
	 * 
	 * @method put
	 * @param key {String} the key of the value
	 * @param value {Object} the value to store
	 * @return {boolean} false if the key has already been used
	 */
	put: function(
		/* string */	key,
		/* obj/fn */	value)
	{
		var obj =
		{
			data: value,
			meta: this._meta(value)
		};

		if (!this._store.put(key, obj))
		{
			return false;
		}

		if (this._stats)
		{
			initKeyStats(this._stats.keys, key);
			this._stats.keys[key].puts++;

			if (this._stats_key_meta)
			{
				this._stats_key_meta(key, value, this._stats.keys[key]);
			}
		}
		return true;
	},

	/**
	 * Store a value.
	 * 
	 * @method replace
	 * @param key {String} the key of the value
	 * @param value {Object} the value to store
	 * @return {Mixed} the original value that was in the slot, or undefined if the slot is empty
	 */
	replace: function(
		/* string */	key,
		/* obj/fn */	value)
	{
		var orig = this.remove(key);
		this.put(key, value);
		return orig;
	},

	/**
	 * Remove an value.
	 * 
	 * @method remove
	 * @param key {String} the key of the value
	 * @return {mixed} the value that was removed, or undefined if the slot was empty
	 */
	remove: function(
		/* string */	key)
	{
		var orig = this._store.remove(key);
		if (orig)
		{
			return orig.data;
		}
	},

	/**
	 * Remove all values.
	 * 
	 * @method clear
	 */
	clear: function()
	{
		this._store.clear();
	},

	/**
	 * Remove all expired values.
	 * 
	 * @method clean
	 */
	clean: function()
	{
		Y.each(this._store.keys(), this.get, this);
	},

	/**
	 * This resets all the values.
	 *
	 * @method dumpStats
	 * @return {Object} the current stats
	 */
	dumpStats: function()
	{
		var stats   = this._stats;
		this._stats = initStats();
		return stats;
	}
};

Y.ExpirationCache = ExpirationCache;


}, 'gallery-2012.05.23-19-56' ,{requires:['gallery-instancemanager']});
