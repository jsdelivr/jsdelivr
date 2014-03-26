YUI.add('gallery-data-storage', function(Y) {

	/**
     * The data-storage module provides a lightweight mechanism for storing data associated with Y.Node and Y.NodeList
     * instances or arbitrary JavaScript objects.  This module is inspired by and derived from the jQuery library
     * (<a href="http://jquery.com/">jQuery</a>).  Currently, it supports almost everything the jQuery code supports
     * with the big exception being events for the getting and settings of data.
     *
     * @module gallery-data-storage
     */

	var expando = "yui" + (new Date()).getTime(),
		uuid = 0,
	
	Data = {
		/**
	     * This is the main caching mechanism.  The cache is keyed by the
	     * object which has data stored in it and is only used for Y.Node instances.
	     *
	     * @property cache
	     * @type Object
	     * @static
	     * @public
	     */
		cache: {},
		
		/**
	     * This key is used on Y.Node instances to store the cache key and on used
	     * on all other objects to store the data directly.
	     *
	     * @property expando
	     * @type String
	     * @static
	     * @public
	     */
		expando: expando,
		
		/**
         * This method handles both getting and setting data against an object.
         * It can be invoked in one of four ways:
         * <ul>
         * 		<li>data(elem) - get all data associated with elem</li>
         * 		<li>data(elem, name { String }) - get data keyed by "name" associated with elem</li>
         * 		<li>data(elem, name { Object }) - set data associated with elem</li>
         * 		<li>data(elem, name, data) - set data keyed by "name" assoicated with elem</li>
         * </ul>
         * 
         * Depending on which way it is invoked, it will perform one of those four operations.
         *
         * @method data
         * @param elem { Y.Node | Object } the object to store data against
         * @param name { Object } see uses above as this argument can have different meanings (optional)
         * @param data { Object } if setting named data, the data to store (optional)
         * @return {Object} the data being retrieved or the data that is set
         * @static
         * @public
         */
		data: function (elem, name, data) {

			var id = elem[Data.expando],
				cache = Data.cache,
				thisCache,
				isNode = elem instanceof Y.Node;
			
			// If we haven't initialized this element and we're trying to get data,
			// then there isn't any, so just return.
			if (!id && typeof name === "string" && data === undefined) {
				return;
			}
			
			// Get the data from the object directly
			if (!isNode) {
				cache = elem;
				id = Data.expando;
							
			// Compute a unique ID for the element
			} else if (!id) {
				elem[expando] = id = ++uuid;
			}
			
			// Avoid generating a new cache unless none exists and we want to manipulate it.
			if (typeof name === "object") {
				cache[id] = Y.aggregate({}, name);
			
			} else if (!cache[id]) {
				cache[id] = {};
			}
			
			thisCache = cache[id];
			
			// Prevent overriding the named cache with undefined values.
			if (data !== undefined) {
				thisCache[name] = data;
			}
			
			return typeof name === "string" ? thisCache[name] : thisCache;
		},
		
		/**
         * This method handles removing the data associated with an object, either by
         * removing it from the cache or removing it from the store on the object itself.
         * It can be invoked in one of two ways:
         * <ul>
         * 		<li>removeData(elem) - remove all associated with elem</li>
         * 		<li>removeData(elem, name) - remove data keyed by "name" associated with elem</li>
         * </ul>
         * 
         * Depending on which way it is invoked, it will perform one of those operations.
         *
         * @method removeData
         * @param elem { Y.Node | Object } the object to store data against
         * @param name { String } the keyed portion of data to remove (optional)
         * @static
         * @public
         */
		removeData: function (elem, name) {

			var id = elem[Data.expando],
				cache = Data.cache,
				isNode = elem instanceof Y.Node,
				thisCache = isNode ? cache[id] : id;
			
			// If we want to remove a specific section of the element's data.
			if (name) {
				if (thisCache) {
					// Remove the section of cache data.
					delete thisCache[name];
					
					// If we've removed all the data, remove the element's cache.
					if (!Y.Object.size(thisCache))  {
						Data.removeData(elem);
					}
				}
			
			// Otherwise, we want to remove all of the element's data
			} else {
				delete elem[Data.expando];
				
				// Completely remove the data cache
				if (isNode) {
					delete cache[id];
				}
			}
		}
	};
	
	/**
	 * A dummy class used to augment the Y.Node class.  This class exposes
	 * methods that allow for data to be stored, retrieved and deleted natively
	 * on Y.Node instances.
	 * 
	 * @class NodeDataExt
	 * @constructor
	 */
	var NodeDataExt = function () {};
	
	NodeDataExt.prototype = {
		
		/**
         * This method is a proxy for the Y.DataStorage.data, which will get/set
         * the data associated with this node instance.
         * It can be invoked in one of four ways:
         * <ul>
         * 		<li>data() - get all data associated with this node</li>
         * 		<li>data(key { String }) - get data keyed by "key" associated with this node</li>
         * 		<li>data(key { Object }) - set data associated with this node</li>
         * 		<li>data(key, value) - set data keyed by "key" assoicated with this node</li>
         * </ul>
         * 
         * Depending on which way it is invoked, it will perform one of those four operations.
         *
         * @method data
         * @param key { Object } see uses above as this argument can have different meanings (optional)
         * @param value { Object } if setting named data, the data to store (optional)
         * @return { Object } the data being retrieved if getting data, otherwise the Node instance
         * @static
         * @public
         */
		data: function(key, value) {
			if (typeof key === "undefined") {
				return Data.data(this);
			
			} else if (typeof key === "object") {
				Data.data(this, key);
				return this;
			}
			
			var parts = key.split("."), data;
			parts[1] = parts[1] ? "." + parts[1] : "";
			
			if (value === undefined) {
				data = Data.data(this, key);
				
				return data === undefined && parts[1] ?
						this.data(parts[0]) :
						data;
			} else {
				Data.data(this, key, value);
				return this;
			}
		},
		
		/**
         * This method is a proxy for the Y.DataStorage.removeData, which will remove
         * the data associated with this node instance.
         * It can be invoked in one of two ways:
         * <ul>
         * 		<li>removeData() - remove all associated with this node</li>
         * 		<li>removeData(key) - remove data keyed by "key" associated with this node</li>
         * </ul>
         * 
         * Depending on which way it is invoked, it will perform one of those operations.
         *
         * @method removeData
         * @param name { String } the keyed portion of data to remove (optional)
         * @return { Y.Node } the Y.Node instance
         * @public
         */
		removeData: function(key) {
			Data.removeData(this, key);
			return this;
		}
	};
	
	Y.augment(Y.Node, NodeDataExt);

	/**
	 * A dummy class used to augment the Y.NodeList class.  This class exposes
	 * methods that allow for data to be stored, retrieved and deleted natively
	 * on Y.NodeList instances.
	 * 
	 * @class NodeListDataExt
	 * @constructor
	 */	
	var NodeListDataExt = function () {};
	
	NodeListDataExt.prototype = {
		
		/**
         * This method is a proxy for the Y.DataStorage.data, which will get/set
         * the data associated with these nodes.
         * It can be invoked in one of four ways:
         * <ul>
         * 		<li>data() - get all data associated with the first node</li>
         * 		<li>data(key { String }) - get data keyed by "key" associated the first node</li>
         * 		<li>data(key { Object }) - set data associated with each node in the list</li>
         * 		<li>data(key, value) - set data keyed by "key" assoicated with each node in the list</li>
         * </ul>
         * 
         * Depending on which way it is invoked, it will perform one of those four operations.
         *
         * @method data
         * @param key { Object } see uses above as this argument can have different meanings (optional)
         * @param value { Object } if setting named data, the data to store (optional)
         * @return { Object } the data being retrieved if getting data, otherwise the NodeList instance
         * @static
         * @public
         */
		data: function(key, value) {
			if (typeof key === "undefined") {
				return Data.data(this.item(0));
			
			} else if (typeof key === "object") {
				this.each(function () {
					this.data(key);
				});
				return this;
			}
			
			var parts = key.split("."), data;
			parts[1] = parts[1] ? "." + parts[1] : "";
			
			if (value === undefined) {
				data = Data.data(this.item(0), key);
				
				return data === undefined && parts[1] ?
						this.data(parts[0]) :
						data;
			} else {
				this.each(function () {
					this.data(key, value);
				});
				return this;
			}
		},
		
		/**
         * This method is a proxy for the Y.DataStorage.removeData, which will remove
         * the data associated with these nodes.
         * It can be invoked in one of two ways:
         * <ul>
         * 		<li>removeData() - remove all associated with each node in the list</li>
         * 		<li>removeData(key) - remove data keyed by "key" associated with each node in the list</li>
         * </ul>
         * 
         * Depending on which way it is invoked, it will perform one of those operations.
         *
         * @method removeData
         * @param name { String } the keyed portion of data to remove (optional)
         * @return { Y.NodeList } the Y.NodeList instance
         * @public
         */
		removeData: function(key) {
			this.each(function () {
				this.removeData(key);
			});
			return this;
		}
	};

	Y.augment(Y.NodeList, NodeListDataExt);
	
	Y.DataStorage = Data;


}, 'gallery-2010.03.16-20' ,{requires:['node']});
