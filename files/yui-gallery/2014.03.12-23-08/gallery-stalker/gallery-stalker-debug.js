YUI.add('gallery-stalker', function(Y) {

/**
* <p>Stalker plugin will allow you to keep elements at a fixed position "floating" but at 
* the same time, keeping those elements embeded to the layout of the page. The general idea 
* is that an element can control it's own position within the layout in order to keep its 
* area within the viewport boundaries.
* 
* <p>To use the Stalker Plugin, simply pass a reference to the plugin to a 
* Node instance's <code>plug</code> method.</p>
* 
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
*		//	Call the "use" method, passing in "gallery-stalker".	 This will <br>
*		//	load the script for the Stalker Plugin and all of <br>
*		//	the required dependencies. <br>
* <br>
*		YUI().use("gallery-stalker", function(Y) { <br>
* <br>
*			Y.one('#mytarget').plug(Y.Plugin.Stalker); <br>
* <br>
*		}); <br>
* <br>	
*	&#60;/script&#62; <br>
* </code>
* </p>
* @module gallery-stalker
*/


//	Util shortcuts
var UA = Y.UA,
getClassName = Y.ClassNameManager.getClassName,

//	Frequently used strings
STALKER = "stalker",
HOST = "host",
PX = 'px',

//	CSS class names
CLASS_STALKER = getClassName(STALKER),

//	Utility functions
/**
	* The NodeStalker class is a plugin for a Node instance.The class is used via  
	* the <a href="Node.html#method_plug"><code>plug</code></a> method of Node and 
	* should not be instantiated directly.
	* @namespace Y.Plugin
	* @class NodeStalker
	*/
NodeStalker = function() {

	NodeStalker.superclass.constructor.apply(this, arguments);

};

NodeStalker.NAME = "NodeStalker";
NodeStalker.NS = STALKER;

NodeStalker.ATTRS = {};

Y.extend(NodeStalker, Y.Plugin.Base, {

	//	Protected properties
	/** 
	* @property _root
	* @description Node instance representing the target node to follow.
	* @default null
	* @protected
	* @type Node
	*/
	_root: null,
	_eventHandlers: [],

	//	Public methods
	initializer: function(config) {
		var fn = Y.bind(this.refresh, this);
		if ((this._root = this.get(HOST))) {

			this._root.addClass(CLASS_STALKER);

			// Wire up all event handlers
			this._eventHandlers.push(Y.on('scroll', fn));
			this._eventHandlers.push(Y.on('windowresize', fn));
			
		}
	},

	destructor: function() {
		if (this._root) {
			this._root.removeClass(CLASS_STALKER);
		}
		Y.Array.each(this._eventHandlers,
		function(handle) {
			handle.detach();
		});
	},

	/**
	* @method refresh
	* @description Refreshing the position of the element in every scroll/resize event
	* @public
	*/
	refresh: function() {
		Y.log ('Refreshing the target', 'info', STALKER);
		
		var top = Y.DOM.docScrollY(),
			left = Y.DOM.docScrollX(),
			n = this._root,
			r = n.get('parentNode').getXY(),
			c = ["marginTop", "marginLeft", "borderLeftWidth", "borderTopWidth"];

		// viewport computations
		r[1] = Math.max(0, r[1] - top);
		r[0] = r[0] - left;
		// node size computation
		Y.Array.each(c,
		function(v) {
			r[v] = parseInt(n.getStyle(v), 10) || 0;
		});
		n.setStyles({
			top: r[1] - r.borderTopWidth - r.marginTop,
			left: r[0] - r.borderLeftWidth - r.marginLeft,
			position: 'fixed'
		});
	},

	//	Protected methods
	/**
	* @method _IE6Fix
	* @description Adding a CSS expression to workaround the lack of "position:fixed" in IE6
	* @protected
	* @return {boolean} whether or not is this fix needed
	*/
	_IE6Fix: function() {
		var targetID,
		parentID,
		css;
		if (UA.ie == 6) {
			Y.log('Appliying IE6 fix for static position.', 'info', STALKER);
			targetID = this._root.get('id');
			parentID = this._root.get('parentNode').get('id');
			css = "#" + targetID + " {top:expression((ignore = document.documentElement.scrollTop>document.getElementById('" + parentID + "').offsetTop) ? document.documentElement.scrollTop : document.getElementById('" + parentID + "').offsetTop + 'px' );}";
			// adding CSS to the page
			Y.on('domready',
			function(e) {
				Y.log('Inserting IE6 fix in the page: ' + css, 'info', STALKER);
				// TODO
			});
			return true;
		}
	}

});

Y.namespace('Plugin');

Y.Plugin.NodeStalker = NodeStalker;


}, 'gallery-2010.04.02-17-26' ,{requires:['plugin','node-base','event-resize','event-base','dom-screen', 'classnamemanager']});
