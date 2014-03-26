YUI.add('gallery-smart-list', function(Y) {

/**
* <p>
* Smart List will allow you to display a list of elements (not necessarily using UL/LI), and filtering 
* which element should be displayed based on a selector. This component will be the base component for 
* quicksand as well.</p>
* 
* <p>The general idea comes from few javascript components:</p>
* <ul>
* <li>
*   Smart Lists - Prototype Extension (by Benjamin Keen) <br/>
*   http://www.benjaminkeen.com/software/smartlists/prototype/
* </li>   
* <li>
*   Quicksand - jQuery Plugin (by @razorjack) <br/>
*   http://razorjack.net/quicksand/
* </li>
* <li>
*   Few more mosaic components to organize elements using animations.</li>
* </li>
* </ul>
* 
* <p>The plugin was designed as a very basic plugin to handle listing, and on top of it, 
* you can add more features, like Quicksand effects based on YUI Anim, etc.</p>
* 
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
* 		//	Call the "use" method, passing in "gallery-smart-list".  This will <br>
* 		//	load the script and all of the required dependencies. <br>
* <br>
* 		YUI().use("event", "gallery-smart-list", function(Y) { <br>
* <br>
* 			var mylist; <br>
* <br>
*			Y.one("#applications").plug(Y.Plugin.SmartList, {<br>
* 				selector: 'li'<br>
* 			});<br>
* <br>
* 			mylist = Y.one("#applications").smartlist;<br>
* <br>
* 			Y.one ('#displayall').on('click', function (e) {<br>
* 				mylist.set ('filter', '');<br>
* 			});<br>
* <br>
* 			Y.one ('#displayapps').on('click', function (e) {<br>
* 				mylist.set ('filter', 'li[data-type=app]');<br>
* 			});<br>
* <br>
* 			Y.one ('#displayutils').on('click', function (e) {<br>
* 				mylist.set ('filter', 'li[class=util]');<br>
* 			});<br>
* <br>		
* 		}); <br>
* <br>	
* 	&#60;/script&#62; <br>
* </code>
* </p>
*
* @module gallery-smart-list
*/


//	Util shortcuts

var UA = Y.UA,
    
	//	Frequently used strings
    WIDTH 	  = "width",
	HEIGHT 	  = "height",
	PX 	 	  = "px",
	HOST 	  = "host",

	//	Attribute keys
	ATTR_ACTIVE 	 = 'active',
	ATTR_ITEMS 		 = 'items',
	ATTR_ADJUSTMENT  = 'adjustHeight',
	ATTR_FILTER		 = 'filter',
	ATTR_SORT		 = 'sort',
	ATTR_SELECTOR	 = 'selector',
	ATTRS			 = [ATTR_SORT, ATTR_FILTER, ATTR_ADJUSTMENT, ATTR_SELECTOR],
	
	// Aria Attributes
	ARIA_ROLE 	= 'role',
	ARIA_HIDDEN = 'aria-hidden',
	TAB_INDEX 	= 'tabIndex',

	// shorthands
    L = Y.Lang,
    isString = L.isString,
    
    //	Utility functions
	/**
	* The NodeAccordion class is a plugin for a Node instance.  The class is used via  
	* the <a href="Node.html#method_plug"><code>plug</code></a> method of Node and 
	* should not be instantiated directly.
	* @namespace plugin
	* @class NodeAccordion
	*/
	SmartList = function () {
	
	SmartList.superclass.constructor.apply(this, arguments);
	
	};

SmartList.NAME = "SmartList";
SmartList.NS = "smartlist";

SmartList.ATTRS = {
	/**
	* Nodes representing the whole list of items.
	*
	* @attribute items
	* @type Y.NodeList
	*/
	items: {
		readOnly: true,
		getter: function () {
			return this._all;
		}
	},
	
	/**
	* Nodes representing the list of visible items.
	*
	* @attribute active
	* @type Y.NodeList
	*/
	active: {
		readOnly: true,
		getter: function () {
			return this._root.all(this.get (ATTR_SELECTOR));
		}
	},
	
	/**
	* Adjusts the height of container. You can use dynamic, auto or a dimension in px, % or em. 
	* 'auto' -> for automatically adjusting before or after the animation (determined automatically)
	* '120px' -> for a fixed height 
	* '' for keeping the height constant.
	*
	* @attribute adjustHeight
	* @writeOnce
	* @default auto
	* @type string
	*/
	adjustHeight: {
		value: 'auto',
		writeOnce: true,
		validator : isString
	},
	selector: {
		value: 'li',
		writeOnce: true,
		validator : isString
	},
	filter: {
		value: '',
		validator : isString
	},
	sort: {
		value: 'asc', // Sort alphabetically and ascending by default
		validator : function (v) {
            return ((v=='asc') || (v=='desc') || (Y.Lang.isFunction(v)));
        }
	}
	
};


Y.extend(SmartList, Y.Plugin.Base, {

	//	Protected properties

	/** 
	* @property _root
	* @description Node instance representing the root node in the accordion.
	* @default null
	* @protected
	* @type Node
	*/
	_root: null,

	//	Public methods

    initializer: function (config) {
		var _root = this.get(HOST),
			that = this;
		config = config || {};
		if (_root) {

			this._root = _root;
			
			Y.Array.each (ATTRS, function (v) {
				if (config[ATTR_SORT]) {
					that.set (ATTR_SORT, config[ATTR_SORT]);
				}
	    	});
			
			this.sync()._compute();
			
			this.after(ATTR_FILTER+"Change", function(event) {
			    that.refresh();
			});
			
		}
    },

	destructor: function () {
    	this._all = null;
    	this._bench = null;
    	this._root = null;
    },
    
  	//	Protected methods

    _setToFloat: function (n) {
    	var r = n.get('region'),
    		c = ["marginTop", "marginLeft", "borderLeftWidth", "borderTopWidth"];
    	Y.Array.each (c, function (v) {
    		r[v] = parseInt(n.getStyle (v), 10) || 0; // why not to use getComputedStyle
    	});
    	n.setStyles ({top: r.top-r.borderTopWidth-r.marginTop, left: r.left-r.borderLeftWidth-r.marginLeft, position: 'absolute'});
    	return r;
    },	
    
	/**
	* @method _compute
	* @description Applying filter and sort to produce a new list.
	* @protected
	* @param {NodeList} nodes NodeList reference for the elements that should be removed automatically
	*/
	_compute: function (nodes) {
    	var bench = [],
    		regulars = this.get(ATTR_ACTIVE),
    		emerging = [],
    		sort = this.get (ATTR_SORT),
    		query = this.get (ATTR_FILTER),
    		that = this;
    	
    	nodes = nodes || [];
    	
    	// applying filter
    	this.get(ATTR_ITEMS).each (function(n, i) {
    		if (nodes.indexOf(n) < 0) {
    			if (!query || (query === '') || n.test(query)) {
	    			// the filter pass
	    			emerging.push (n);
	    		} else {
	    			bench.push (n);
	    		}
    		}
    	});

		// applying sort ...
    	
    	// setting all the visible items to absolute position
    	regulars._nodes.reverse();
    	regulars.each (this._setToFloat, this);
    	
    	// setting the bench and removing the elements from current view
    	(this._bench._nodes = Y.all(bench)).each (this._disappear, this); // fade out
    	// displaying new elements
    	emerging.reverse();
    	Y.all(emerging).each(function (n, i) {
    		that._root.prepend(n.remove());
    		if ((regulars.indexOf(n) < 0) || that._isHidden(n)) {
    			// setting the item ready to become visible soon if needed
    			n.setStyles({position: 'absolute', top: 100+PX, left: 100+PX, opacity: 0, display: 'block', visibility: 'visible'});
    			// fade-in for new elements
    			that._appear (n, i);
    			// Set ARIA attributes
    			n.set(ARIA_HIDDEN, false).set(TAB_INDEX, 0);
    		} else {
    			// moving the item to the new position
    			that._move (n, i);
    			// Set ARIA attributes
    			n.set(ARIA_HIDDEN, 'true').set(TAB_INDEX, -1);
    		}
    	});
    	
	},

	/**
	* @method _hidden
	* @description Checking if an item is hidden.
	* @protected
	* @param {Node} n Node instance representing an item.
	* @return Boolean if the item is hidden by default
	*/
	_isHidden: function (n) {
		var r = this._root;
		return (!n || !n.ancestor(function(el) { return (r === el); }) || 
				(n.getStyle('display').toLowerCase() == 'none') || 
				(n.getStyle('visibility').toLowerCase() == 'hidden') || 
				(parseInt(n.getStyle('opacity'), 10) === 0));
	},

	_getXY: function (p) {
		return {top: 0, left: 0};
	}, 
	
	/**
	* @method _disappear
	* @description Removing an item from the sight.
	* @protected
	* @param {Node} n Node instance representing an item.
	*/
	_disappear: function (n) {
		var fn = function () {
			n.remove ();
		};
		// for performance, we should hide only those that are visible
		if (!this._isHidden(n)) {
			// fade-out 
			this._animate (n, {
				opacity: 0
			}, fn);
		} else {
			fn.call();
		}
	},
	/**
	* @method _appear
	* @description Showing an item in the current view.
	* @protected
	* @param {Node} n Node instance representing an item.
	* @param {Integer} i Index representing the position of the item.
	*/
	_appear: function (n, i) {
		// setting the surge position
		n.setStyles (this._getXY(i));
		// fade-in 
		this._animate (n, {
			opacity: 1
		}, function () {
			n.setStyles({top: 0, left: 0, position: 'relative'});
		});
	},

	/**
	* @method _move
	* @description Move an item to a new position.
	* @protected
	* @param {Node} n Node instance representing an item.
	* @param {Integer} i Index representing the position of the item.
	*/
	_move: function (n, i) {
		// moving to the new position
		this._animate (n, this._getXY(i), function () {
			n.setStyles({top: 0, left: 0, position: 'relative'});
		});
	},

	/**
	 * @method _animate
	 * @description Using Y.Anim to animate an item.
	 * @protected
	 * @param {String} id Global Unique ID for the animation.
	 * @param {Object} conf Configuration object for the animation.
	 * @param {Function} fn callback function that should be executed after the end of the anim.
	 * @return {Object} Animation handler.
	 */
	_animate: function(n, conf, fn) {
		n.setStyles (conf);
		fn.call();
	},
	
	//	Generic DOM Event handlers
	/**
	* @method clear
	* @description Clear the panel, hiding all the elements.
	* @public
	* @return {object} Plugin reference for chaining
	*/
	clear: function () {
		Y.log(("Hiding all items (this action does not reset order or filter): " + this._root), "info", "SmartList");
		this._compute (this.get(ATTR_ITEMS));
		return this;
	},	
	
	/**
	* @method sync
	* @description Recollecting a new set of elements from the DOM, and setting the corresponding visibility properties for each item.
	* @public
	* @return {object} Plugin reference for chaining
	*/
	sync: function () {
		Y.log("Recollecting a new set of elements from the DOM, and setting the corresponding visibility properties for each item", "info", "SmartList");
		// empty list of items in the bench
		this._bench = Y.all([]);
		// just in case you want to use markup ul>li as a simple markup structure
		this._all = this.get (ATTR_ACTIVE);
		// setting area role & computing current visible list
		this._all.set(ARIA_ROLE, 'presentation').set(TAB_INDEX, 0).toFrag(); 
		return this;
	},
	
	/**
	* @method refresh
	* @description Re-apply filter and sort, and refresh the list.
	* @public
	* @param {NodeList} nodes NodeList reference for the elements that should be removed automatically
	* @return {object} Plugin reference for chaining
	*/
	refresh: function () {
		this._compute ();
		return this;
	},	
	
	/**
	* @method displayItem
	* @description Add a new item to the list. This action will trigger the "filter" action to display the new item if needed.
	* @public
	* @param {Node} n Node reference
	* @return {object} Plugin reference for chaining
	*/
	addItem: function ( n ) {
	    return this.addItems([n]);
	},
	
	/**
	* @method removeItem
	* @description Remove a certain item from the list. This action will trigger the "filter" action to reorganize the items if needed.
	* @public
	* @param {object} n Node reference
	* @return {object} Plugin reference for chaining
	*/
	removeItem: function ( n ) {
		if (this.get(ATTR_ITEMS).indexOf(Y.one(n)) >= 0) {
	    	this._compute (Y.all(n));
	    }
	    return this;
	},
	
	/**
	* @method addItems
	* @description Add a new set of items to the list. This action will trigger the "filter" action to display the items if needed.
	* @public
	* @param {NodeList} nodes NodeList reference
	* @return {object} Plugin reference for chaining
	*/
	addItems: function ( nodes ) {
	    var that = this;
		nodes = Y.all(nodes);
	    nodes.each (function (n) {
	    	that.get(ATTR_ITEMS)._nodes.push (n);
	    });
	    this._compute ();
		return this;
	}

});

Y.namespace('Plugin');

Y.Plugin.SmartList = SmartList;


}, 'gallery-2010.03.11-21' ,{optional:['anim'], requires:['node-base', 'node-style', 'plugin']});
