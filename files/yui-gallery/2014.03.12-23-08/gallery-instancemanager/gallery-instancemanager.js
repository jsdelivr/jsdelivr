YUI.add('gallery-instancemanager', function(Y) {

"use strict";

/**
 * @module gallery-instancemanager
 */

/**********************************************************************
 * <p>Stores instances of JavaScript components.  Allows a constructor or
 * factory method to be passed in place of an instance.  This enables lazy
 * construction on demand.</p>
 * 
 * <p>One use is to create a global repository of JavaScript components
 * attached to DOM id's, e.g., YUI Buttons built on top of HTML
 * buttons.</p>
 * 
 * @main gallery-instancemanager
 * @class InstanceManager
 * @constructor
 */
function InstanceManager()
{
	this._map          = { };
	this._constructors = { };
}

InstanceManager.prototype =
{
	/**
	 * Retrieve an object.
	 * 
	 * @method get
	 * @param id {String} the id of the object to retrieve
	 * @return {Mixed} the stored object, or false if the slot is empty
	 */
	get: function(
		/* string */	id)
	{
		if (this._map[ id ] === null && this._constructors[ id ])
		{
			var c           = this._constructors[ id ];
			var instance    = c.fn.prototype ? Y.Object(c.fn.prototype) : null;
			var obj         = c.fn.apply(instance, c.args);
			this._map[ id ] = Y.Lang.isUndefined(obj) ? instance : obj;
		}

		return this._map[ id ] || false;
	},

	/**
	 * Retrieve an object only if it has already been constructed.
	 * 
	 * @method getIfConstructed
	 * @param id {String} the id of the object to retrieve
	 * @return {Mixed} the stored object, or false if the slot is empty
	 */
	getIfConstructed: function(
		/* string */	id)
	{
		return this._map[ id ] || false;
	},

	/**
	 * Store an object or ctor+args.
	 * 
	 * @method put
	 * @param id {String} the id of the object
	 * @param objOrCtor {Object|Function} the object or the object's constructor or a factory method
	 * @param args {Array} the array of arguments to pass to the constructor
	 * @return {Boolean} false if the id has already been used
	 */
	put: function(
		/* string */	id,
		/* obj/fn */	objOrCtor,
		/* array */		args)
	{
		if (this._map[ id ])
		{
			return false;
		}
		else if (Y.Lang.isFunction(objOrCtor))
		{
			this._constructors[ id ] =
			{
				fn:   objOrCtor,
				args: Y.Lang.isArray(args) ? args : [args]
			};

			this._map[ id ] = null;
			return true;
		}
		else
		{
			this._map[ id ] = objOrCtor;
			return true;
		}
	},

	/**
	 * Remove an object.
	 * 
	 * @method remove
	 * @param id {String} the id of the object
	 * @return {mixed} the object that was removed, or false if the slot was empty
	 */
	remove: function(
		/* string */	id)
	{
		if (this._map[ id ])
		{
			var obj = this._map[ id ];
			delete this._map[ id ];
			return obj;
		}
		else
		{
			return false;
		}
	},

	/**
	 * Remove all objects.
	 * 
	 * @method clear
	 */
	clear: function()
	{
		this._map = {};
	},

	/**
	 * Returns list of all stored keys.
	 * 
	 * @method keys
	 */
	keys: function()
	{
		return Y.Object.keys(this._map);
	},

	/**
	 * Call a function on every object.
	 * 
	 * @method applyToAll
	 * @param behavior {Function|String|Object} the function to call or the name of the function or an object {fn:,scope:}
	 * @param arguments {Array} the arguments to pass to the function
	 * @param skip_unconstructed {boolean} Optional.  Pass <code>true</code> to skip unconstructed slots.
	 */
	applyToAll: function(
		/* string/fn/object */	behavior,
		/* array */				args,
		/* bool */				skip_unconstructed)
	{
		var map        = this._map,
			isFunction = Y.Lang.isFunction(behavior),
			isObject   = Y.Lang.isObject(behavior);

		Y.Object.each(map, function(item, name)
		{
			if (!item && skip_unconstructed)
			{
				return;
			}
			else if (!item)
			{
				item = this.get(name);
			}

			if (isFunction || isObject)
			{
				// apply the function and pass the map item as an argument

				var fn    = isFunction ? behavior : behavior.fn,
					scope = isFunction ? window : behavior.scope;

				fn.apply(scope, [ { key:name, value:item } ].concat( args ) );
			}
			else if (item && Y.Lang.isFunction(item[ behavior ]))
			{
				// the string is the name of a method

				item[ behavior ].apply(item, args);
			}
		},
		this);
	}
};

Y.InstanceManager = InstanceManager;


}, 'gallery-2012.05.16-20-37' );
