/*! jQuery Dynatree Plugin - v1.2.4 - 2013-02-12
* http://dynatree.googlecode.com/
* Copyright (c) 2013 Martin Wendt; Licensed MIT, GPL */

/* jsHint options*/
// Note: We currently allow eval() to parse the 'data' attribtes, when initializing from HTML.
// TODO: pass jsHint with the options given in grunt.js only.
//       The following should not be required:
/*global alert */
/*jshint nomen:false, smarttabs:true, eqeqeq:false, evil:true, regexp:false */

/*************************************************************************
 *	Debug functions
 */

var _canLog = true;

function _log(mode, msg) {
	/**
	 * Usage: logMsg("%o was toggled", this);
	 */
	if( !_canLog ){
		return;
	}
	// Remove first argument
	var args = Array.prototype.slice.apply(arguments, [1]);
	// Prepend timestamp
	var dt = new Date();
	var tag = dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds()+"."+dt.getMilliseconds();
	args[0] = tag + " - " + args[0];

	try {
		switch( mode ) {
		case "info":
			window.console.info.apply(window.console, args);
			break;
		case "warn":
			window.console.warn.apply(window.console, args);
			break;
		default:
			window.console.log.apply(window.console, args);
			break;
		}
	} catch(e) {
		if( !window.console ){
			_canLog = false; // Permanently disable, when logging is not supported by the browser
		}else if(e.number === -2146827850){
			// fix for IE8, where window.console.log() exists, but does not support .apply()
			window.console.log(args.join(", "));
		}
	}
}

/* Check browser version, since $.browser was removed in jQuery 1.9 */
function _checkBrowser(){
	var matched, browser;
	function uaMatch( ua ) {
		ua = ua.toLowerCase();
		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			 /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			 /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			 /(msie) ([\w.]+)/.exec( ua ) ||
			 ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			 [];
		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	}
	matched = uaMatch( navigator.userAgent );
	browser = {};
	 if ( matched.browser ) {
		 browser[ matched.browser ] = true;
		 browser.version = matched.version;
	 }
	 if ( browser.chrome ) {
		 browser.webkit = true;
	 } else if ( browser.webkit ) {
		 browser.safari = true;
	 }
	 return browser;
}
var BROWSER = jQuery.browser || _checkBrowser();

function logMsg(msg) {
	Array.prototype.unshift.apply(arguments, ["debug"]);
	_log.apply(this, arguments);
}


// Forward declaration
var getDynaTreePersistData = null;



/*************************************************************************
 *	Constants
 */
var DTNodeStatus_Error   = -1;
var DTNodeStatus_Loading = 1;
var DTNodeStatus_Ok      = 0;


// Start of local namespace
(function($) {

/*************************************************************************
 *	Common tool functions.
 */

var Class = {
	create: function() {
		return function() {
			this.initialize.apply(this, arguments);
		};
	}
};

// Tool function to get dtnode from the event target:
function getDtNodeFromElement(el) {
	alert("getDtNodeFromElement is deprecated");
	return $.ui.dynatree.getNode(el);
/*
	var iMax = 5;
	while( el && iMax-- ) {
		if(el.dtnode) { return el.dtnode; }
		el = el.parentNode;
	}
	return null;
*/
}

function noop() {
}

/** Compare two dotted version strings (like '10.2.3').
 * @returns {Integer} 0: v1 == v2, -1: v1 < v2, 1: v1 > v2
 */
function versionCompare(v1, v2) {
	var v1parts = ("" + v1).split("."),
		v2parts = ("" + v2).split("."),
		minLength = Math.min(v1parts.length, v2parts.length),
		p1, p2, i;
	// Compare tuple pair-by-pair.
	for(i = 0; i < minLength; i++) {
		// Convert to integer if possible, because "8" > "10".
		p1 = parseInt(v1parts[i], 10);
		p2 = parseInt(v2parts[i], 10);
		if (isNaN(p1)){ p1 = v1parts[i]; }
		if (isNaN(p2)){ p2 = v2parts[i]; }
		if (p1 == p2) {
			continue;
		}else if (p1 > p2) {
			return 1;
		}else if (p1 < p2) {
			return -1;
		}
		// one operand is NaN
		return NaN;
	}
	// The longer tuple is always considered 'greater'
	if (v1parts.length === v2parts.length) {
		return 0;
	}
	return (v1parts.length < v2parts.length) ? -1 : 1;
}


/*************************************************************************
 *	Class DynaTreeNode
 */
var DynaTreeNode = Class.create();

DynaTreeNode.prototype = {
	initialize: function(parent, tree, data) {
		/**
		 * @constructor
		 */
		this.parent = parent;
		this.tree = tree;
		if ( typeof data === "string" ){
			data = { title: data };
		}
		if( !data.key ){
			data.key = "_" + tree._nodeCount++;
		}else{
			data.key = "" + data.key; // issue 371
		}
		this.data = $.extend({}, $.ui.dynatree.nodedatadefaults, data);
		this.li = null; // not yet created
		this.span = null; // not yet created
		this.ul = null; // not yet created
		this.childList = null; // no subnodes yet
		this._isLoading = false; // Lazy content is being loaded
		this.hasSubSel = false;
		this.bExpanded = false;
		this.bSelected = false;

	},

	toString: function() {
		return "DynaTreeNode<" + this.data.key + ">: '" + this.data.title + "'";
	},

	toDict: function(recursive, callback) {
		var dict = $.extend({}, this.data);
		dict.activate = ( this.tree.activeNode === this );
		dict.focus = ( this.tree.focusNode === this );
		dict.expand = this.bExpanded;
		dict.select = this.bSelected;
		if( callback ){
			callback(dict);
		}
		if( recursive && this.childList ) {
			dict.children = [];
			for(var i=0, l=this.childList.length; i<l; i++ ){
				dict.children.push(this.childList[i].toDict(true, callback));
			}
		} else {
			delete dict.children;
		}
		return dict;
	},

	fromDict: function(dict) {
		/**
		 * Update node data. If dict contains 'children', then also replace
		 * the hole sub tree.
		 */
		var children = dict.children;
		if(children === undefined){
			this.data = $.extend(this.data, dict);
			this.render();
			return;
		}
		dict = $.extend({}, dict);
		dict.children = undefined;
		this.data = $.extend(this.data, dict);
		this.removeChildren();
		this.addChild(children);
	},

	_getInnerHtml: function() {
		var tree = this.tree,
			opts = tree.options,
			cache = tree.cache,
			level = this.getLevel(),
			data = this.data,
			res = "",
			imageSrc;
		// connector (expanded, expandable or simple)
		if( level < opts.minExpandLevel ) {
			if(level > 1){
				res += cache.tagConnector;
			}
			// .. else (i.e. for root level) skip expander/connector altogether
		} else if( this.hasChildren() !== false ) {
			res += cache.tagExpander;
		} else {
			res += cache.tagConnector;
		}
		// Checkbox mode
		if( opts.checkbox && data.hideCheckbox !== true && !data.isStatusNode ) {
			res += cache.tagCheckbox;
		}
		// folder or doctype icon
		if ( data.icon ) {
			if (data.icon.charAt(0) === "/"){
				imageSrc = data.icon;
			}else{
				imageSrc = opts.imagePath + data.icon;
			}
			res += "<img src='" + imageSrc + "' alt='' />";
		} else if ( data.icon === false ) {
			// icon == false means 'no icon'
//			noop(); // keep JSLint happy
		} else if ( data.iconClass ) {
			res +=  "<span class='" + " " + data.iconClass +  "'></span>";
		} else {
			// icon == null means 'default icon'
			res += cache.tagNodeIcon;
		}
		// node title
		var nodeTitle = "";
		if ( opts.onCustomRender ){
			nodeTitle = opts.onCustomRender.call(tree, this) || "";
		}
		if(!nodeTitle){
			var tooltip = data.tooltip ? ' title="' + data.tooltip.replace(/\"/g, '&quot;') + '"' : '',
				href = data.href || "#";
			if( opts.noLink || data.noLink ) {
				nodeTitle = '<span style="display:inline-block;" class="' + opts.classNames.title + '"' + tooltip + '>' + data.title + '</span>';
//				this.tree.logDebug("nodeTitle: " + nodeTitle);
			} else {
				nodeTitle = '<a href="' + href + '" class="' + opts.classNames.title + '"' + tooltip + '>' + data.title + '</a>';
			}
		}
		res += nodeTitle;
		return res;
	},


	_fixOrder: function() {
		/**
		 * Make sure, that <li> order matches childList order.
		 */
		var cl = this.childList;
		if( !cl || !this.ul ){
			return;
		}
		var childLI = this.ul.firstChild;
		for(var i=0, l=cl.length-1; i<l; i++) {
			var childNode1 = cl[i];
			var childNode2 = childLI.dtnode;
			if( childNode1 !== childNode2 ) {
				this.tree.logDebug("_fixOrder: mismatch at index " + i + ": " + childNode1 + " != " + childNode2);
				this.ul.insertBefore(childNode1.li, childNode2.li);
			} else {
				childLI = childLI.nextSibling;
			}
		}
	},


	render: function(useEffects, includeInvisible) {
		/**
		 * Create <li><span>..</span> .. </li> tags for this node.
		 *
		 * <li id='KEY' dtnode=NODE> // This div contains the node's span and list of child div's.
		 *   <span class='title'>S S S A</span> // Span contains graphic spans and title <a> tag
		 *   <ul> // only present, when node has children
		 *       <li id='KEY' dtnode=NODE>child1</li>
		 *       <li id='KEY' dtnode=NODE>child2</li>
		 *   </ul>
		 * </li>
		 */
//		this.tree.logDebug("%s.render(%s)", this, useEffects);
		// ---
		var tree = this.tree,
			parent = this.parent,
			data = this.data,
			opts = tree.options,
			cn = opts.classNames,
			isLastSib = this.isLastSibling(),
			firstTime = false;

		if( !parent && !this.ul ) {
			// Root node has only a <ul>
			this.li = this.span = null;
			this.ul = document.createElement("ul");
			if( opts.minExpandLevel > 1 ){
				this.ul.className = cn.container + " " + cn.noConnector;
			}else{
				this.ul.className = cn.container;
			}
		} else if( parent ) {
			// Create <li><span /> </li>
			if( ! this.li ) {
				firstTime = true;
				this.li = document.createElement("li");
				this.li.dtnode = this;
				if( data.key && opts.generateIds ){
					this.li.id = opts.idPrefix + data.key;
				}
				this.span = document.createElement("span");
				this.span.className = cn.title;
				this.li.appendChild(this.span);

				if( !parent.ul ) {
					// This is the parent's first child: create UL tag
					// (Hidden, because it will be
					parent.ul = document.createElement("ul");
					parent.ul.style.display = "none";
					parent.li.appendChild(parent.ul);
//					if( opts.minExpandLevel > this.getLevel() ){
//						parent.ul.className = cn.noConnector;
//					}
				}
				// set node connector images, links and text
//				this.span.innerHTML = this._getInnerHtml();

				parent.ul.appendChild(this.li);
			}
			// set node connector images, links and text
			this.span.innerHTML = this._getInnerHtml();
			// Set classes for current status
			var cnList = [];
			cnList.push(cn.node);
			if( data.isFolder ){
				cnList.push(cn.folder);
			}
			if( this.bExpanded ){
				cnList.push(cn.expanded);
			}
			if( this.hasChildren() !== false ){
				cnList.push(cn.hasChildren);
			}
			if( data.isLazy && this.childList === null ){
				cnList.push(cn.lazy);
			}
			if( isLastSib ){
				cnList.push(cn.lastsib);
			}
			if( this.bSelected ){
				cnList.push(cn.selected);
			}
			if( this.hasSubSel ){
				cnList.push(cn.partsel);
			}
			if( tree.activeNode === this ){
				cnList.push(cn.active);
			}
			if( data.addClass ){
				cnList.push(data.addClass);
			}
			// IE6 doesn't correctly evaluate multiple class names,
			// so we create combined class names that can be used in the CSS
			cnList.push(cn.combinedExpanderPrefix
					+ (this.bExpanded ? "e" : "c")
					+ (data.isLazy && this.childList === null ? "d" : "")
					+ (isLastSib ? "l" : "")
					);
			cnList.push(cn.combinedIconPrefix
					+ (this.bExpanded ? "e" : "c")
					+ (data.isFolder ? "f" : "")
					);
			this.span.className = cnList.join(" ");

			// TODO: we should not set this in the <span> tag also, if we set it here:
			this.li.className = isLastSib ? cn.lastsib : "";

			// Allow tweaking, binding, after node was created for the first time
			if(firstTime && opts.onCreate){
				opts.onCreate.call(tree, this, this.span);
			}
			// Hide children, if node is collapsed
//			this.ul.style.display = ( this.bExpanded || !parent ) ? "" : "none";
			// Allow tweaking after node state was rendered
			if(opts.onRender){
				opts.onRender.call(tree, this, this.span);
			}
		}
		// Visit child nodes
		if( (this.bExpanded || includeInvisible === true) && this.childList ) {
			for(var i=0, l=this.childList.length; i<l; i++) {
				this.childList[i].render(false, includeInvisible);
			}
			// Make sure the tag order matches the child array
			this._fixOrder();
		}
		// Hide children, if node is collapsed
		if( this.ul ) {
			var isHidden = (this.ul.style.display === "none");
			var isExpanded = !!this.bExpanded;
//			logMsg("isHidden:%s", isHidden);
			if( useEffects && opts.fx && (isHidden === isExpanded) ) {
				var duration = opts.fx.duration || 200;
				$(this.ul).animate(opts.fx, duration);
			} else {
				this.ul.style.display = ( this.bExpanded || !parent ) ? "" : "none";
			}
		}
	},
	/** Return '/id1/id2/id3'. */
	getKeyPath: function(excludeSelf) {
		var path = [];
		this.visitParents(function(node){
			if(node.parent){
				path.unshift(node.data.key);
			}
		}, !excludeSelf);
		return "/" + path.join(this.tree.options.keyPathSeparator);
	},

	getParent: function() {
		return this.parent;
	},

	getChildren: function() {
		if(this.hasChildren() === undefined){
			return undefined; // Lazy node: unloaded, currently loading, or load error
		}
		return this.childList;
	},

	/** Check if node has children (returns undefined, if not sure). */
	hasChildren: function() {
		if(this.data.isLazy){
			if(this.childList === null || this.childList === undefined){
				// Not yet loaded
				return undefined;
			}else if(this.childList.length === 0){
				// Loaded, but response was empty
				return false;
			}else if(this.childList.length === 1 && this.childList[0].isStatusNode()){
				// Currently loading or load error
				return undefined;
			}
			return true;
		}
		return !!this.childList;
	},

	isFirstSibling: function() {
		var p = this.parent;
		return !p || p.childList[0] === this;
	},

	isLastSibling: function() {
		var p = this.parent;
		return !p || p.childList[p.childList.length-1] === this;
	},

	isLoading: function() {
		return !!this._isLoading;
	},

	getPrevSibling: function() {
		if( !this.parent ){
			return null;
		}
		var ac = this.parent.childList;
		for(var i=1, l=ac.length; i<l; i++){ // start with 1, so prev(first) = null
			if( ac[i] === this ){
				return ac[i-1];
			}
		}
		return null;
	},

	getNextSibling: function() {
		if( !this.parent ){
			return null;
		}
		var ac = this.parent.childList;
		for(var i=0, l=ac.length-1; i<l; i++){ // up to length-2, so next(last) = null
			if( ac[i] === this ){
				return ac[i+1];
			}
		}
		return null;
	},

	isStatusNode: function() {
		return (this.data.isStatusNode === true);
	},

	isChildOf: function(otherNode) {
		return (this.parent && this.parent === otherNode);
	},

	isDescendantOf: function(otherNode) {
		if(!otherNode){
			return false;
		}
		var p = this.parent;
		while( p ) {
			if( p === otherNode ){
				return true;
			}
			p = p.parent;
		}
		return false;
	},

	countChildren: function() {
		var cl = this.childList;
		if( !cl ){
			return 0;
		}
		var n = cl.length;
		for(var i=0, l=n; i<l; i++){
			var child = cl[i];
			n += child.countChildren();
		}
		return n;
	},

	/**Sort child list by title.
	 * cmd: optional compare function.
	 * deep: optional: pass true to sort all descendant nodes.
	 */
	sortChildren: function(cmp, deep) {
		var cl = this.childList;
		if( !cl ){
			return;
		}
		cmp = cmp || function(a, b) {
//			return a.data.title === b.data.title ? 0 : a.data.title > b.data.title ? 1 : -1;
			var x = a.data.title.toLowerCase(),
				y = b.data.title.toLowerCase();
			return x === y ? 0 : x > y ? 1 : -1;
			};
		cl.sort(cmp);
		if( deep ){
			for(var i=0, l=cl.length; i<l; i++){
				if( cl[i].childList ){
					cl[i].sortChildren(cmp, "$norender$");
				}
			}
		}
		if( deep !== "$norender$" ){
			this.render();
		}
	},

	_setStatusNode: function(data) {
		// Create, modify or remove the status child node (pass 'null', to remove it).
		var firstChild = ( this.childList ? this.childList[0] : null );
		if( !data ) {
			if ( firstChild && firstChild.isStatusNode()) {
				try{
					// I've seen exceptions here with loadKeyPath...
					if(this.ul){
						this.ul.removeChild(firstChild.li);
						firstChild.li = null; // avoid leaks (issue 215)
					}
				}catch(e){}
				if( this.childList.length === 1 ){
					this.childList = [];
				}else{
					this.childList.shift();
				}
			}
		} else if ( firstChild ) {
			data.isStatusNode = true;
			data.key = "_statusNode";
			firstChild.data = data;
			firstChild.render();
		} else {
			data.isStatusNode = true;
			data.key = "_statusNode";
			firstChild = this.addChild(data);
		}
	},

	setLazyNodeStatus: function(lts, opts) {
		var tooltip = (opts && opts.tooltip) ? opts.tooltip : null,
			info = (opts && opts.info) ? " (" + opts.info + ")" : "";
		switch( lts ) {
			case DTNodeStatus_Ok:
				this._setStatusNode(null);
				$(this.span).removeClass(this.tree.options.classNames.nodeLoading);
				this._isLoading = false;
//				this.render();
				if( this.tree.options.autoFocus ) {
					if( this === this.tree.tnRoot && this.childList && this.childList.length > 0) {
						// special case: using ajaxInit
						this.childList[0].focus();
					} else {
						this.focus();
					}
				}
				break;
			case DTNodeStatus_Loading:
				this._isLoading = true;
				$(this.span).addClass(this.tree.options.classNames.nodeLoading);
				// The root is hidden, so we set a temporary status child
				if(!this.parent){
					this._setStatusNode({
						title: this.tree.options.strings.loading + info,
						tooltip: tooltip,
						addClass: this.tree.options.classNames.nodeWait
					});
				}
				break;
			case DTNodeStatus_Error:
				this._isLoading = false;
//				$(this.span).addClass(this.tree.options.classNames.nodeError);
				this._setStatusNode({
					title: this.tree.options.strings.loadError + info,
					tooltip: tooltip,
					addClass: this.tree.options.classNames.nodeError
				});
				break;
			default:
				throw "Bad LazyNodeStatus: '" + lts + "'.";
		}
	},

	_parentList: function(includeRoot, includeSelf) {
		var l = [];
		var dtn = includeSelf ? this : this.parent;
		while( dtn ) {
			if( includeRoot || dtn.parent ){
				l.unshift(dtn);
			}
			dtn = dtn.parent;
		}
		return l;
	},
	getLevel: function() {
		/**
		 * Return node depth. 0: System root node, 1: visible top-level node.
		 */
		var level = 0;
		var dtn = this.parent;
		while( dtn ) {
			level++;
			dtn = dtn.parent;
		}
		return level;
	},

	_getTypeForOuterNodeEvent: function(event) {
		/** Return the inner node span (title, checkbox or expander) if
		 *  event.target points to the outer span.
		 *  This function should fix issue #93:
		 *  FF2 ignores empty spans, when generating events (returning the parent instead).
		 */
		var cns = this.tree.options.classNames;
		var target = event.target;
		// Only process clicks on an outer node span (probably due to a FF2 event handling bug)
		if( target.className.indexOf(cns.node) < 0 ) {
			return null;
		}
		// Event coordinates, relative to outer node span:
		var eventX = event.pageX - target.offsetLeft;
		var eventY = event.pageY - target.offsetTop;

		for(var i=0, l=target.childNodes.length; i<l; i++) {
			var cn = target.childNodes[i];
			var x = cn.offsetLeft - target.offsetLeft;
			var y = cn.offsetTop - target.offsetTop;
			var nx = cn.clientWidth, ny = cn.clientHeight;
//	        alert (cn.className + ": " + x + ", " + y + ", s:" + nx + ", " + ny);
			if( eventX >= x && eventX <= (x+nx) && eventY >= y && eventY <= (y+ny) ) {
//	            alert("HIT "+ cn.className);
				if( cn.className==cns.title ){
					return "title";
				}else if( cn.className==cns.expander ){
					return "expander";
				}else if( cn.className==cns.checkbox ){
					return "checkbox";
				}else if( cn.className==cns.nodeIcon ){
					return "icon";
				}
			}
		}
		return "prefix";
	},

	getEventTargetType: function(event) {
		// Return the part of a node, that a click event occured on.
		// Note: there is no check, if the event was fired on THIS node.
		var tcn = event && event.target ? event.target.className : "",
			cns = this.tree.options.classNames;

		if( tcn === cns.title ){
			return "title";
		}else if( tcn === cns.expander ){
			return "expander";
		}else if( tcn === cns.checkbox ){
			return "checkbox";
		}else if( tcn === cns.nodeIcon ){
			return "icon";
		}else if( tcn === cns.empty || tcn === cns.vline || tcn === cns.connector ){
			return "prefix";
		}else if( tcn.indexOf(cns.node) >= 0 ){
			// FIX issue #93
			return this._getTypeForOuterNodeEvent(event);
		}
		return null;
	},

	isVisible: function() {
		// Return true, if all parents are expanded.
		var parents = this._parentList(true, false);
		for(var i=0, l=parents.length; i<l; i++){
			if( ! parents[i].bExpanded ){ return false; }
		}
		return true;
	},

	makeVisible: function() {
		// Make sure, all parents are expanded
		var parents = this._parentList(true, false);
		for(var i=0, l=parents.length; i<l; i++){
			parents[i]._expand(true);
		}
	},

	focus: function() {
		// TODO: check, if we already have focus
//		this.tree.logDebug("dtnode.focus(): %o", this);
		this.makeVisible();
		try {
			$(this.span).find(">a").focus();
		} catch(e) { }
	},

	isFocused: function() {
		return (this.tree.tnFocused === this);
	},

	_activate: function(flag, fireEvents) {
		// (De)Activate - but not focus - this node.
		this.tree.logDebug("dtnode._activate(%o, fireEvents=%o) - %o", flag, fireEvents, this);
		var opts = this.tree.options;
		if( this.data.isStatusNode ){
			return;
		}
		if ( fireEvents && opts.onQueryActivate && opts.onQueryActivate.call(this.tree, flag, this) === false ){
			return; // Callback returned false
		}
		if( flag ) {
			// Activate
			if( this.tree.activeNode ) {
				if( this.tree.activeNode === this ){
					return;
				}
				this.tree.activeNode.deactivate();
			}
			if( opts.activeVisible ){
				this.makeVisible();
			}
			this.tree.activeNode = this;
			if( opts.persist ){
				$.cookie(opts.cookieId+"-active", this.data.key, opts.cookie);
			}
			this.tree.persistence.activeKey = this.data.key;
			$(this.span).addClass(opts.classNames.active);
			if ( fireEvents && opts.onActivate ){
				opts.onActivate.call(this.tree, this);
			}
		} else {
			// Deactivate
			if( this.tree.activeNode === this ) {
				if ( opts.onQueryActivate && opts.onQueryActivate.call(this.tree, false, this) === false ){
					return; // Callback returned false
				}
				$(this.span).removeClass(opts.classNames.active);
				if( opts.persist ) {
					// Note: we don't pass null, but ''. So the cookie is not deleted.
					// If we pass null, we also have to pass a COPY of opts, because $cookie will override opts.expires (issue 84)
					$.cookie(opts.cookieId+"-active", "", opts.cookie);
				}
				this.tree.persistence.activeKey = null;
				this.tree.activeNode = null;
				if ( fireEvents && opts.onDeactivate ){
					opts.onDeactivate.call(this.tree, this);
				}
			}
		}
	},

	activate: function() {
		// Select - but not focus - this node.
//		this.tree.logDebug("dtnode.activate(): %o", this);
		this._activate(true, true);
	},

	activateSilently: function() {
		this._activate(true, false);
	},

	deactivate: function() {
//		this.tree.logDebug("dtnode.deactivate(): %o", this);
		this._activate(false, true);
	},

	isActive: function() {
		return (this.tree.activeNode === this);
	},

	_userActivate: function() {
		// Handle user click / [space] / [enter], according to clickFolderMode.
		var activate = true;
		var expand = false;
		if ( this.data.isFolder ) {
			switch( this.tree.options.clickFolderMode ) {
			case 2:
				activate = false;
				expand = true;
				break;
			case 3:
				activate = expand = true;
				break;
			}
		}
		if( this.parent === null ) {
			expand = false;
		}
		if( expand ) {
			this.toggleExpand();
			this.focus();
		}
		if( activate ) {
			this.activate();
		}
	},

	_setSubSel: function(hasSubSel) {
		if( hasSubSel ) {
			this.hasSubSel = true;
			$(this.span).addClass(this.tree.options.classNames.partsel);
		} else {
			this.hasSubSel = false;
			$(this.span).removeClass(this.tree.options.classNames.partsel);
		}
	},
	/**
	 * Fix selection and partsel status, of parent nodes, according to current status of
	 * end nodes.
	 */
	_updatePartSelectionState: function() {
//		alert("_updatePartSelectionState " + this);
//		this.tree.logDebug("_updatePartSelectionState() - %o", this);
		var sel;
		// Return `true` or `false` for end nodes and remove part-sel flag
		if( ! this.hasChildren() ){
			sel = (this.bSelected && !this.data.unselectable && !this.data.isStatusNode);
			this._setSubSel(false);
			return sel;
		}
		// Return `true`, `false`, or `undefined` for parent nodes
		var i, l,
			cl = this.childList,
			allSelected = true,
			allDeselected = true;
		for(i=0, l=cl.length; i<l;  i++) {
			var n = cl[i],
				s = n._updatePartSelectionState();
			if( s !== false){
				allDeselected = false;
			}
			if( s !== true){
				allSelected = false;
			}
		}
		if( allSelected ){
			sel = true;
		} else if ( allDeselected ){
			sel = false;
		} else {
			sel = undefined;
		}
		this._setSubSel(sel === undefined);
		this.bSelected = (sel === true);
		return sel;
	},

	/**
	 * Fix selection status, after this node was (de)selected in multi-hier mode.
	 * This includes (de)selecting all children.
	 */
	_fixSelectionState: function() {
//		alert("_fixSelectionState " + this);
//		this.tree.logDebug("_fixSelectionState(%s) - %o", this.bSelected, this);
		var p, i, l;
		if( this.bSelected ) {
			// Select all children
			this.visit(function(node){
				node.parent._setSubSel(true);
				if(!node.data.unselectable){
					node._select(true, false, false);
				}
			});
			// Select parents, if all children are selected
			p = this.parent;
			while( p ) {
				p._setSubSel(true);
				var allChildsSelected = true;
				for(i=0, l=p.childList.length; i<l;  i++) {
					var n = p.childList[i];
					if( !n.bSelected && !n.data.isStatusNode && !n.data.unselectable) {
					// issue 305 proposes this:
//					if( !n.bSelected && !n.data.isStatusNode ) {
						allChildsSelected = false;
						break;
					}
				}
				if( allChildsSelected ){
					p._select(true, false, false);
				}
				p = p.parent;
			}
		} else {
			// Deselect all children
			this._setSubSel(false);
			this.visit(function(node){
				node._setSubSel(false);
				node._select(false, false, false);
			});
			// Deselect parents, and recalc hasSubSel
			p = this.parent;
			while( p ) {
				p._select(false, false, false);
				var isPartSel = false;
				for(i=0, l=p.childList.length; i<l;  i++) {
					if( p.childList[i].bSelected || p.childList[i].hasSubSel ) {
						isPartSel = true;
						break;
					}
				}
				p._setSubSel(isPartSel);
				p = p.parent;
			}
		}
	},

	_select: function(sel, fireEvents, deep) {
		// Select - but not focus - this node.
//		this.tree.logDebug("dtnode._select(%o) - %o", sel, this);
		var opts = this.tree.options;
		if( this.data.isStatusNode ){
			return;
		}
		//
		if( this.bSelected === sel ) {
//			this.tree.logDebug("dtnode._select(%o) IGNORED - %o", sel, this);
			return;
		}
		// Allow event listener to abort selection
		if ( fireEvents && opts.onQuerySelect && opts.onQuerySelect.call(this.tree, sel, this) === false ){
			return; // Callback returned false
		}
		// Force single-selection
		if( opts.selectMode==1 && sel ) {
			this.tree.visit(function(node){
				if( node.bSelected ) {
					// Deselect; assuming that in selectMode:1 there's max. one other selected node
					node._select(false, false, false);
					return false;
				}
			});
		}

		this.bSelected = sel;
//        this.tree._changeNodeList("select", this, sel);

		if( sel ) {
			if( opts.persist ){
				this.tree.persistence.addSelect(this.data.key);
			}
			$(this.span).addClass(opts.classNames.selected);

			if( deep && opts.selectMode === 3 ){
				this._fixSelectionState();
			}
			if ( fireEvents && opts.onSelect ){
				opts.onSelect.call(this.tree, true, this);
			}
		} else {
			if( opts.persist ){
				this.tree.persistence.clearSelect(this.data.key);
			}
			$(this.span).removeClass(opts.classNames.selected);

			if( deep && opts.selectMode === 3 ){
				this._fixSelectionState();
			}
			if ( fireEvents && opts.onSelect ){
				opts.onSelect.call(this.tree, false, this);
			}
		}
	},

	select: function(sel) {
		// Select - but not focus - this node.
//		this.tree.logDebug("dtnode.select(%o) - %o", sel, this);
		if( this.data.unselectable ){
			return this.bSelected;
		}
		return this._select(sel!==false, true, true);
	},

	toggleSelect: function() {
//		this.tree.logDebug("dtnode.toggleSelect() - %o", this);
		return this.select(!this.bSelected);
	},

	isSelected: function() {
		return this.bSelected;
	},

	isLazy: function() {
		return !!this.data.isLazy;
	},

	_loadContent: function() {
		try {
			var opts = this.tree.options;
			this.tree.logDebug("_loadContent: start - %o", this);
			this.setLazyNodeStatus(DTNodeStatus_Loading);
			if( true === opts.onLazyRead.call(this.tree, this) ) {
				// If function returns 'true', we assume that the loading is done:
				this.setLazyNodeStatus(DTNodeStatus_Ok);
				// Otherwise (i.e. if the loading was started as an asynchronous process)
				// the onLazyRead(dtnode) handler is expected to call dtnode.setLazyNodeStatus(DTNodeStatus_Ok/_Error) when done.
				this.tree.logDebug("_loadContent: succeeded - %o", this);
			}
		} catch(e) {
			this.tree.logWarning("_loadContent: failed - %o", e);
			this.setLazyNodeStatus(DTNodeStatus_Error, {tooltip: ""+e});
		}
	},

	_expand: function(bExpand, forceSync) {
		if( this.bExpanded === bExpand ) {
			this.tree.logDebug("dtnode._expand(%o) IGNORED - %o", bExpand, this);
			return;
		}
		this.tree.logDebug("dtnode._expand(%o) - %o", bExpand, this);
		var opts = this.tree.options;
		if( !bExpand && this.getLevel() < opts.minExpandLevel ) {
			this.tree.logDebug("dtnode._expand(%o) prevented collapse - %o", bExpand, this);
			return;
		}
		if ( opts.onQueryExpand && opts.onQueryExpand.call(this.tree, bExpand, this) === false ){
			return; // Callback returned false
		}
		this.bExpanded = bExpand;

		// Persist expand state
		if( opts.persist ) {
			if( bExpand ){
				this.tree.persistence.addExpand(this.data.key);
			}else{
				this.tree.persistence.clearExpand(this.data.key);
			}
		}
		// Do not apply animations in init phase, or before lazy-loading
		var allowEffects = !(this.data.isLazy && this.childList === null)
			&& !this._isLoading
			&& !forceSync;
		this.render(allowEffects);

		// Auto-collapse mode: collapse all siblings
		if( this.bExpanded && this.parent && opts.autoCollapse ) {
			var parents = this._parentList(false, true);
			for(var i=0, l=parents.length; i<l; i++){
				parents[i].collapseSiblings();
			}
		}
		// If the currently active node is now hidden, deactivate it
		if( opts.activeVisible && this.tree.activeNode && ! this.tree.activeNode.isVisible() ) {
			this.tree.activeNode.deactivate();
		}
		// Expanding a lazy node: set 'loading...' and call callback
		if( bExpand && this.data.isLazy && this.childList === null && !this._isLoading ) {
			this._loadContent();
			return;
		}
		if ( opts.onExpand ){
			opts.onExpand.call(this.tree, bExpand, this);
		}
	},

	isExpanded: function() {
		return this.bExpanded;
	},

	expand: function(flag) {
		flag = (flag !== false);
		if( !this.childList && !this.data.isLazy && flag ){
			return; // Prevent expanding empty nodes
		} else if( this.parent === null && !flag ){
			return; // Prevent collapsing the root
		}
		this._expand(flag);
	},

	scheduleAction: function(mode, ms) {
		/** Schedule activity for delayed execution (cancel any pending request).
		 *  scheduleAction('cancel') will cancel the request.
		 */
		if( this.tree.timer ) {
			clearTimeout(this.tree.timer);
			this.tree.logDebug("clearTimeout(%o)", this.tree.timer);
		}
		var self = this; // required for closures
		switch (mode) {
		case "cancel":
			// Simply made sure that timer was cleared
			break;
		case "expand":
			this.tree.timer = setTimeout(function(){
				self.tree.logDebug("setTimeout: trigger expand");
				self.expand(true);
			}, ms);
			break;
		case "activate":
			this.tree.timer = setTimeout(function(){
				self.tree.logDebug("setTimeout: trigger activate");
				self.activate();
			}, ms);
			break;
		default:
			throw "Invalid mode " + mode;
		}
		this.tree.logDebug("setTimeout(%s, %s): %s", mode, ms, this.tree.timer);
	},

	toggleExpand: function() {
		this.expand(!this.bExpanded);
	},

	collapseSiblings: function() {
		if( this.parent === null ){
			return;
		}
		var ac = this.parent.childList;
		for (var i=0, l=ac.length; i<l; i++) {
			if ( ac[i] !== this && ac[i].bExpanded ){
				ac[i]._expand(false);
			}
		}
	},

	_onClick: function(event) {
//		this.tree.logDebug("dtnode.onClick(" + event.type + "): dtnode:" + this + ", button:" + event.button + ", which: " + event.which);
		var targetType = this.getEventTargetType(event);
		if( targetType === "expander" ) {
			// Clicking the expander icon always expands/collapses
			this.toggleExpand();
			this.focus(); // issue 95
		} else if( targetType === "checkbox" ) {
			// Clicking the checkbox always (de)selects
			this.toggleSelect();
			this.focus(); // issue 95
		} else {
			this._userActivate();
			var aTag = this.span.getElementsByTagName("a");
			if(aTag[0]){
				// issue 154, 313
//                if(!($.browser.msie && parseInt($.browser.version, 10) < 9)){
				if(!(BROWSER.msie && parseInt(BROWSER.version, 10) < 9)){
					aTag[0].focus();
				}
			}else{
				// 'noLink' option was set
				return true;
			}
		}
		// Make sure that clicks stop, otherwise <a href='#'> jumps to the top
		event.preventDefault();
	},

	_onDblClick: function(event) {
//		this.tree.logDebug("dtnode.onDblClick(" + event.type + "): dtnode:" + this + ", button:" + event.button + ", which: " + event.which);
	},

	_onKeydown: function(event) {
//		this.tree.logDebug("dtnode.onKeydown(" + event.type + "): dtnode:" + this + ", charCode:" + event.charCode + ", keyCode: " + event.keyCode + ", which: " + event.which);
		var handled = true,
			sib;
//		alert("keyDown" + event.which);

		switch( event.which ) {
			// charCodes:
//			case 43: // '+'
			case 107: // '+'
			case 187: // '+' @ Chrome, Safari
				if( !this.bExpanded ){ this.toggleExpand(); }
				break;
//			case 45: // '-'
			case 109: // '-'
			case 189: // '+' @ Chrome, Safari
				if( this.bExpanded ){ this.toggleExpand(); }
				break;
			//~ case 42: // '*'
				//~ break;
			//~ case 47: // '/'
				//~ break;
			// case 13: // <enter>
				// <enter> on a focused <a> tag seems to generate a click-event.
				// this._userActivate();
				// break;
			case 32: // <space>
				this._userActivate();
				break;
			case 8: // <backspace>
				if( this.parent ){
					this.parent.focus();
				}
				break;
			case 37: // <left>
				if( this.bExpanded ) {
					this.toggleExpand();
					this.focus();
//				} else if( this.parent && (this.tree.options.rootVisible || this.parent.parent) ) {
				} else if( this.parent && this.parent.parent ) {
					this.parent.focus();
				}
				break;
			case 39: // <right>
				if( !this.bExpanded && (this.childList || this.data.isLazy) ) {
					this.toggleExpand();
					this.focus();
				} else if( this.childList ) {
					this.childList[0].focus();
				}
				break;
			case 38: // <up>
				sib = this.getPrevSibling();
				while( sib && sib.bExpanded && sib.childList ){
					sib = sib.childList[sib.childList.length-1];
				}
//				if( !sib && this.parent && (this.tree.options.rootVisible || this.parent.parent) )
				if( !sib && this.parent && this.parent.parent ){
					sib = this.parent;
				}
				if( sib ){
					sib.focus();
				}
				break;
			case 40: // <down>
				if( this.bExpanded && this.childList ) {
					sib = this.childList[0];
				} else {
					var parents = this._parentList(false, true);
					for(var i=parents.length-1; i>=0; i--) {
						sib = parents[i].getNextSibling();
						if( sib ){ break; }
					}
				}
				if( sib ){
					sib.focus();
				}
				break;
			default:
				handled = false;
		}
		// Return false, if handled, to prevent default processing
//		return !handled;
		if(handled){
			event.preventDefault();
		}
	},

	_onKeypress: function(event) {
		// onKeypress is only hooked to allow user callbacks.
		// We don't process it, because IE and Safari don't fire keypress for cursor keys.
//		this.tree.logDebug("dtnode.onKeypress(" + event.type + "): dtnode:" + this + ", charCode:" + event.charCode + ", keyCode: " + event.keyCode + ", which: " + event.which);
	},

	_onFocus: function(event) {
		// Handles blur and focus events.
//		this.tree.logDebug("dtnode._onFocus(%o): %o", event, this);
		var opts = this.tree.options;
		if ( event.type == "blur" || event.type == "focusout" ) {
			if ( opts.onBlur ){
				opts.onBlur.call(this.tree, this);
			}
			if( this.tree.tnFocused ){
				$(this.tree.tnFocused.span).removeClass(opts.classNames.focused);
			}
			this.tree.tnFocused = null;
			if( opts.persist ){
				$.cookie(opts.cookieId+"-focus", "", opts.cookie);
			}
		} else if ( event.type=="focus" || event.type=="focusin") {
			// Fix: sometimes the blur event is not generated
			if( this.tree.tnFocused && this.tree.tnFocused !== this ) {
				this.tree.logDebug("dtnode.onFocus: out of sync: curFocus: %o", this.tree.tnFocused);
				$(this.tree.tnFocused.span).removeClass(opts.classNames.focused);
			}
			this.tree.tnFocused = this;
			if ( opts.onFocus ){
				opts.onFocus.call(this.tree, this);
			}
			$(this.tree.tnFocused.span).addClass(opts.classNames.focused);
			if( opts.persist ){
				$.cookie(opts.cookieId+"-focus", this.data.key, opts.cookie);
			}
		}
		// TODO: return anything?
//		return false;
	},

	visit: function(fn, includeSelf) {
		// Call fn(node) for all child nodes. Stop iteration, if fn() returns false.
		var res = true;
		if( includeSelf === true ) {
			res = fn(this);
			if( res === false || res == "skip" ){
				return res;
			}
		}
		if(this.childList){
			for(var i=0, l=this.childList.length; i<l; i++){
				res = this.childList[i].visit(fn, true);
				if( res === false ){
					break;
				}
			}
		}
		return res;
	},

	visitParents: function(fn, includeSelf) {
		// Visit parent nodes (bottom up)
		if(includeSelf && fn(this) === false){
			return false;
		}
		var p = this.parent;
		while( p ) {
			if(fn(p) === false){
				return false;
			}
			p = p.parent;
		}
		return true;
	},

	remove: function() {
		// Remove this node
//		this.tree.logDebug ("%s.remove()", this);
		if ( this === this.tree.root ){
			throw "Cannot remove system root";
		}
		return this.parent.removeChild(this);
	},

	removeChild: function(tn) {
		// Remove tn from list of direct children.
		var ac = this.childList;
		if( ac.length == 1 ) {
			if( tn !== ac[0] ){
				throw "removeChild: invalid child";
			}
			return this.removeChildren();
		}
		if( tn === this.tree.activeNode ){
			tn.deactivate();
		}
		if( this.tree.options.persist ) {
			if( tn.bSelected ){
				this.tree.persistence.clearSelect(tn.data.key);
			}
			if ( tn.bExpanded ){
				this.tree.persistence.clearExpand(tn.data.key);
			}
		}
		tn.removeChildren(true);
		if(this.ul){
//			$("li", $(this.ul)).remove(); // issue 399
			this.ul.removeChild(tn.li); // issue 402
		}
		for(var i=0, l=ac.length; i<l; i++) {
			if( ac[i] === tn ) {
				this.childList.splice(i, 1);
//				delete tn;  // JSLint complained
				break;
			}
		}
	},

	removeChildren: function(isRecursiveCall, retainPersistence) {
		// Remove all child nodes (more efficiently than recursive remove())
		this.tree.logDebug("%s.removeChildren(%o)", this, isRecursiveCall);
		var tree = this.tree;
		var ac = this.childList;
		if( ac ) {
			for(var i=0, l=ac.length; i<l; i++) {
				var tn = ac[i];
				if ( tn === tree.activeNode && !retainPersistence ){
					tn.deactivate();
				}
				if( this.tree.options.persist && !retainPersistence ) {
					if( tn.bSelected ){
						this.tree.persistence.clearSelect(tn.data.key);
					}
					if ( tn.bExpanded ){
						this.tree.persistence.clearExpand(tn.data.key);
					}
				}
				tn.removeChildren(true, retainPersistence);
				if(this.ul){
//					this.ul.removeChild(tn.li);
					$("li", $(this.ul)).remove(); // issue 231
				}
//				delete tn;  JSLint complained
			}
			// Set to 'null' which is interpreted as 'not yet loaded' for lazy
			// nodes
			this.childList = null;
		}
		if( ! isRecursiveCall ) {
//			this._expand(false);
//			this.isRead = false;
			this._isLoading = false;
			this.render();
		}
	},

	setTitle: function(title) {
		this.fromDict({title: title});
	},

	reload: function(force) {
		throw "Use reloadChildren() instead";
	},

	reloadChildren: function(callback) {
		// Reload lazy content (expansion state is maintained).
		if( this.parent === null ){
			throw "Use tree.reload() instead";
		}else if( ! this.data.isLazy ){
			throw "node.reloadChildren() requires lazy nodes.";
		}
		// appendAjax triggers 'nodeLoaded' event.
		// We listen to this, if a callback was passed to reloadChildren
		if(callback){
			var self = this;
			var eventType = "nodeLoaded.dynatree." + this.tree.$tree.attr("id")
				+ "." + this.data.key;
			this.tree.$tree.bind(eventType, function(e, node, isOk){
				self.tree.$tree.unbind(eventType);
				self.tree.logDebug("loaded %o, %o, %o", e, node, isOk);
				if(node !== self){
					throw "got invalid load event";
				}
				callback.call(self.tree, node, isOk);
			});
		}
		// The expansion state is maintained
		this.removeChildren();
		this._loadContent();
//		if( this.bExpanded ) {
//			// Remove children first, to prevent effects being applied
//			this.removeChildren();
//			// then force re-expand to trigger lazy loading
////			this.expand(false);
////			this.expand(true);
//			this._loadContent();
//		} else {
//			this.removeChildren();
//			this._loadContent();
//		}
	},

	/**
	 * Make sure the node with a given key path is available in the tree.
	 */
	_loadKeyPath: function(keyPath, callback) {
		var tree = this.tree;
		tree.logDebug("%s._loadKeyPath(%s)", this, keyPath);
		if(keyPath === ""){
			throw "Key path must not be empty";
		}
		var segList = keyPath.split(tree.options.keyPathSeparator);
		if(segList[0] === ""){
			throw "Key path must be relative (don't start with '/')";
		}
		var seg = segList.shift();
		if(this.childList){
			for(var i=0, l=this.childList.length; i < l; i++){
				var child = this.childList[i];
				if( child.data.key === seg ){
					if(segList.length === 0) {
						// Found the end node
						callback.call(tree, child, "ok");

					}else if(child.data.isLazy && (child.childList === null || child.childList === undefined)){
						tree.logDebug("%s._loadKeyPath(%s) -> reloading %s...", this, keyPath, child);
						var self = this;
						// Note: this line gives a JSLint warning (Don't make functions within a loop)
						/*jshint loopfunc:true */
						child.reloadChildren(function(node, isOk){
							// After loading, look for direct child with that key
							if(isOk){
								tree.logDebug("%s._loadKeyPath(%s) -> reloaded %s.", node, keyPath, node);
								callback.call(tree, child, "loaded");
								node._loadKeyPath(segList.join(tree.options.keyPathSeparator), callback);
							}else{
								tree.logWarning("%s._loadKeyPath(%s) -> reloadChildren() failed.", self, keyPath);
								callback.call(tree, child, "error");
							}
						});
						// we can ignore it, since it will only be exectuted once, the the loop is ended
						// See also http://stackoverflow.com/questions/3037598/how-to-get-around-the-jslint-error-dont-make-functions-within-a-loop
					} else {
						callback.call(tree, child, "loaded");
						// Look for direct child with that key
						child._loadKeyPath(segList.join(tree.options.keyPathSeparator), callback);
					}
					return;
				}
			}
		}
		// Could not find key
		// Callback params: child: undefined, the segment, isEndNode (segList.length === 0)
		callback.call(tree, undefined, "notfound", seg, segList.length === 0);
		tree.logWarning("Node not found: " + seg);
		return;
	},

	resetLazy: function() {
		// Discard lazy content.
		if( this.parent === null ){
			throw "Use tree.reload() instead";
		}else if( ! this.data.isLazy ){
			throw "node.resetLazy() requires lazy nodes.";
		}
		this.expand(false);
		this.removeChildren();
	},

	_addChildNode: function(dtnode, beforeNode) {
		/**
		 * Internal function to add one single DynatreeNode as a child.
		 *
		 */
		var tree = this.tree,
			opts = tree.options,
			pers = tree.persistence;

//		tree.logDebug("%s._addChildNode(%o)", this, dtnode);

		// --- Update and fix dtnode attributes if necessary
		dtnode.parent = this;
//		if( beforeNode && (beforeNode.parent !== this || beforeNode === dtnode ) )
//			throw "<beforeNode> must be another child of <this>";

		// --- Add dtnode as a child
		if ( this.childList === null ) {
			this.childList = [];
		} else if( ! beforeNode ) {
			// Fix 'lastsib'
			if(this.childList.length > 0) {
				$(this.childList[this.childList.length-1].span).removeClass(opts.classNames.lastsib);
			}
		}
		if( beforeNode ) {
			var iBefore = $.inArray(beforeNode, this.childList);
			if( iBefore < 0 ){
				throw "<beforeNode> must be a child of <this>";
			}
			this.childList.splice(iBefore, 0, dtnode);
		} else {
			// Append node
			this.childList.push(dtnode);
		}

		// --- Handle persistence
		// Initial status is read from cookies, if persistence is active and
		// cookies are already present.
		// Otherwise the status is read from the data attributes and then persisted.
		var isInitializing = tree.isInitializing();
		if( opts.persist && pers.cookiesFound && isInitializing ) {
			// Init status from cookies
//			tree.logDebug("init from cookie, pa=%o, dk=%o", pers.activeKey, dtnode.data.key);
			if( pers.activeKey === dtnode.data.key ){
				tree.activeNode = dtnode;
			}
			if( pers.focusedKey === dtnode.data.key ){
				tree.focusNode = dtnode;
			}
			dtnode.bExpanded = ($.inArray(dtnode.data.key, pers.expandedKeyList) >= 0);
			dtnode.bSelected = ($.inArray(dtnode.data.key, pers.selectedKeyList) >= 0);
//			tree.logDebug("    key=%o, bSelected=%o", dtnode.data.key, dtnode.bSelected);
		} else {
			// Init status from data (Note: we write the cookies after the init phase)
//			tree.logDebug("init from data");
			if( dtnode.data.activate ) {
				tree.activeNode = dtnode;
				if( opts.persist ){
					pers.activeKey = dtnode.data.key;
				}
			}
			if( dtnode.data.focus ) {
				tree.focusNode = dtnode;
				if( opts.persist ){
					pers.focusedKey = dtnode.data.key;
				}
			}
			dtnode.bExpanded = ( dtnode.data.expand === true ); // Collapsed by default
			if( dtnode.bExpanded && opts.persist ){
				pers.addExpand(dtnode.data.key);
			}
			dtnode.bSelected = ( dtnode.data.select === true ); // Deselected by default
/*
			Doesn't work, cause pers.selectedKeyList may be null
			if( dtnode.bSelected && opts.selectMode==1
				&& pers.selectedKeyList && pers.selectedKeyList.length>0 ) {
				tree.logWarning("Ignored multi-selection in single-mode for %o", dtnode);
				dtnode.bSelected = false; // Fixing bad input data (multi selection for mode:1)
			}
*/
			if( dtnode.bSelected && opts.persist ){
				pers.addSelect(dtnode.data.key);
			}
		}

		// Always expand, if it's below minExpandLevel
//		tree.logDebug ("%s._addChildNode(%o), l=%o", this, dtnode, dtnode.getLevel());
		if ( opts.minExpandLevel >= dtnode.getLevel() ) {
//			tree.logDebug ("Force expand for %o", dtnode);
			this.bExpanded = true;
		}

		// In multi-hier mode, update the parents selection state
		// issue #82: only if not initializing, because the children may not exist yet
//		if( !dtnode.data.isStatusNode && opts.selectMode==3 && !isInitializing )
//			dtnode._fixSelectionState();

		// In multi-hier mode, update the parents selection state
		if( dtnode.bSelected && opts.selectMode==3 ) {
			var p = this;
			while( p ) {
				if( !p.hasSubSel ){
					p._setSubSel(true);
				}
				p = p.parent;
			}
		}
		// render this node and the new child
		if ( tree.bEnableUpdate ){
			this.render();
		}
		return dtnode;
	},

	addChild: function(obj, beforeNode) {
		/**
		 * Add a node object as child.
		 *
		 * This should be the only place, where a DynaTreeNode is constructed!
		 * (Except for the root node creation in the tree constructor)
		 *
		 * @param obj A JS object (may be recursive) or an array of those.
		 * @param {DynaTreeNode} beforeNode (optional) sibling node.
		 *
		 * Data format: array of node objects, with optional 'children' attributes.
		 * [
		 *	{ title: "t1", isFolder: true, ... }
		 *	{ title: "t2", isFolder: true, ...,
		 *		children: [
		 *			{title: "t2.1", ..},
		 *			{..}
		 *			]
		 *	}
		 * ]
		 * A simple object is also accepted instead of an array.
		 *
		 */
//		this.tree.logDebug("%s.addChild(%o, %o)", this, obj, beforeNode);
		if(typeof(obj) == "string"){
			throw "Invalid data type for " + obj;
		}else if( !obj || obj.length === 0 ){ // Passed null or undefined or empty array
			return;
		}else if( obj instanceof DynaTreeNode ){
			return this._addChildNode(obj, beforeNode);
		}

		if( !obj.length ){ // Passed a single data object
			obj = [ obj ];
		}
		var prevFlag = this.tree.enableUpdate(false);

		var tnFirst = null;
		for (var i=0, l=obj.length; i<l; i++) {
			var data = obj[i];
			var dtnode = this._addChildNode(new DynaTreeNode(this, this.tree, data), beforeNode);
			if( !tnFirst ){
				tnFirst = dtnode;
			}
			// Add child nodes recursively
			if( data.children ){
				dtnode.addChild(data.children, null);
			}
		}
		this.tree.enableUpdate(prevFlag);
		return tnFirst;
	},

	append: function(obj) {
		this.tree.logWarning("node.append() is deprecated (use node.addChild() instead).");
		return this.addChild(obj, null);
	},

	appendAjax: function(ajaxOptions) {
		var self = this;
		this.removeChildren(false, true);
		this.setLazyNodeStatus(DTNodeStatus_Loading);
		// Debug feature: force a delay, to simulate slow loading...
		if(ajaxOptions.debugLazyDelay){
			var ms = ajaxOptions.debugLazyDelay;
			ajaxOptions.debugLazyDelay = 0;
			this.tree.logInfo("appendAjax: waiting for debugLazyDelay " + ms);
			setTimeout(function(){self.appendAjax(ajaxOptions);}, ms);
			return;
		}
		// Ajax option inheritance: $.ajaxSetup < $.ui.dynatree.prototype.options.ajaxDefaults < tree.options.ajaxDefaults < ajaxOptions
		var orgSuccess = ajaxOptions.success,
			orgError = ajaxOptions.error,
			eventType = "nodeLoaded.dynatree." + this.tree.$tree.attr("id") + "." + this.data.key;
		var options = $.extend({}, this.tree.options.ajaxDefaults, ajaxOptions, {
			success: function(data, textStatus, jqXHR){
				// <this> is the request options
//				self.tree.logDebug("appendAjax().success");
				var prevPhase = self.tree.phase;
				self.tree.phase = "init";
				// postProcess is similar to the standard dataFilter hook,
				// but it is also called for JSONP
				if( options.postProcess ){
					data = options.postProcess.call(this, data, this.dataType);
				}
				// Process ASPX WebMethod JSON object inside "d" property
				// http://code.google.com/p/dynatree/issues/detail?id=202
				else if (data && data.hasOwnProperty("d")) {
				   data = (typeof data.d) == "string" ? $.parseJSON(data.d) : data.d;
				}
				if(!$.isArray(data) || data.length !== 0){
					self.addChild(data, null);
				}
				self.tree.phase = "postInit";
				if( orgSuccess ){
					orgSuccess.call(options, self, data, textStatus);
				}
				self.tree.logDebug("trigger " + eventType);
				self.tree.$tree.trigger(eventType, [self, true]);
				self.tree.phase = prevPhase;
				// This should be the last command, so node._isLoading is true
				// while the callbacks run
				self.setLazyNodeStatus(DTNodeStatus_Ok);
				if($.isArray(data) && data.length === 0){
					// Set to [] which is interpreted as 'no children' for lazy
					// nodes
					self.childList = [];
					self.render();
				}
				},
			error: function(jqXHR, textStatus, errorThrown){
				// <this> is the request options
				self.tree.logWarning("appendAjax failed:", textStatus, ":\n", jqXHR, "\n", errorThrown);
				if( orgError ){
					orgError.call(options, self, jqXHR, textStatus, errorThrown);
				}
				self.tree.$tree.trigger(eventType, [self, false]);
				self.setLazyNodeStatus(DTNodeStatus_Error, {info: textStatus, tooltip: "" + errorThrown});
				}
		});
		$.ajax(options);
	},

	move: function(targetNode, mode) {
		/**Move this node to targetNode.
		 *  mode 'child': append this node as last child of targetNode.
		 *                This is the default. To be compatble with the D'n'd
		 *                hitMode, we also accept 'over'.
		 *  mode 'before': add this node as sibling before targetNode.
		 *  mode 'after': add this node as sibling after targetNode.
		 */
		var pos;
		if(this === targetNode){
			return;
		}
		if( !this.parent  ){
			throw "Cannot move system root";
		}
		if(mode === undefined || mode == "over"){
			mode = "child";
		}
		var prevParent = this.parent;
		var targetParent = (mode === "child") ? targetNode : targetNode.parent;
		if( targetParent.isDescendantOf(this) ){
			throw "Cannot move a node to it's own descendant";
		}
		// Unlink this node from current parent
		if( this.parent.childList.length == 1 ) {
			this.parent.childList = this.parent.data.isLazy ? [] : null;
			this.parent.bExpanded = false;
		} else {
			pos = $.inArray(this, this.parent.childList);
			if( pos < 0 ){
				throw "Internal error";
			}
			this.parent.childList.splice(pos, 1);
		}
		// Remove from source DOM parent
		if(this.parent.ul){
			this.parent.ul.removeChild(this.li);
		}

		// Insert this node to target parent's child list
		this.parent = targetParent;
		if( targetParent.hasChildren() ) {
			switch(mode) {
			case "child":
				// Append to existing target children
				targetParent.childList.push(this);
				break;
			case "before":
				// Insert this node before target node
				pos = $.inArray(targetNode, targetParent.childList);
				if( pos < 0 ){
					throw "Internal error";
				}
				targetParent.childList.splice(pos, 0, this);
				break;
			case "after":
				// Insert this node after target node
				pos = $.inArray(targetNode, targetParent.childList);
				if( pos < 0 ){
					throw "Internal error";
				}
				targetParent.childList.splice(pos+1, 0, this);
				break;
			default:
				throw "Invalid mode " + mode;
			}
		} else {
			targetParent.childList = [ this ];
		}
		// Parent has no <ul> tag yet:
		if( !targetParent.ul ) {
			// This is the parent's first child: create UL tag
			// (Hidden, because it will be
			targetParent.ul = document.createElement("ul");
			targetParent.ul.style.display = "none";
			targetParent.li.appendChild(targetParent.ul);
		}
		// Issue 319: Add to target DOM parent (only if node was already rendered(expanded))
		if(this.li){
			targetParent.ul.appendChild(this.li);
		}

		if( this.tree !== targetNode.tree ) {
			// Fix node.tree for all source nodes
			this.visit(function(node){
				node.tree = targetNode.tree;
			}, null, true);
			throw "Not yet implemented.";
		}
		// TODO: fix selection state
		// TODO: fix active state
		if( !prevParent.isDescendantOf(targetParent)) {
			prevParent.render();
		}
		if( !targetParent.isDescendantOf(prevParent) ) {
			targetParent.render();
		}
//		this.tree.redraw();
/*
		var tree = this.tree;
		var opts = tree.options;
		var pers = tree.persistence;


		// Always expand, if it's below minExpandLevel
//		tree.logDebug ("%s._addChildNode(%o), l=%o", this, dtnode, dtnode.getLevel());
		if ( opts.minExpandLevel >= dtnode.getLevel() ) {
//			tree.logDebug ("Force expand for %o", dtnode);
			this.bExpanded = true;
		}

		// In multi-hier mode, update the parents selection state
		// issue #82: only if not initializing, because the children may not exist yet
//		if( !dtnode.data.isStatusNode && opts.selectMode==3 && !isInitializing )
//			dtnode._fixSelectionState();

		// In multi-hier mode, update the parents selection state
		if( dtnode.bSelected && opts.selectMode==3 ) {
			var p = this;
			while( p ) {
				if( !p.hasSubSel )
					p._setSubSel(true);
				p = p.parent;
			}
		}
		// render this node and the new child
		if ( tree.bEnableUpdate )
			this.render();

		return dtnode;

*/
	},

	// --- end of class
	lastentry: undefined
};

/*************************************************************************
 * class DynaTreeStatus
 */

var DynaTreeStatus = Class.create();


DynaTreeStatus._getTreePersistData = function(cookieId, cookieOpts) {
	// Static member: Return persistence information from cookies
	var ts = new DynaTreeStatus(cookieId, cookieOpts);
	ts.read();
	return ts.toDict();
};
// Make available in global scope
getDynaTreePersistData = DynaTreeStatus._getTreePersistData; // TODO: deprecated


DynaTreeStatus.prototype = {
	// Constructor
	initialize: function(cookieId, cookieOpts) {
//		this._log("DynaTreeStatus: initialize");
		if( cookieId === undefined ){
			cookieId = $.ui.dynatree.prototype.options.cookieId;
		}
		cookieOpts = $.extend({}, $.ui.dynatree.prototype.options.cookie, cookieOpts);

		this.cookieId = cookieId;
		this.cookieOpts = cookieOpts;
		this.cookiesFound = undefined;
		this.activeKey = null;
		this.focusedKey = null;
		this.expandedKeyList = null;
		this.selectedKeyList = null;
	},
	// member functions
	_log: function(msg) {
		//	this.logDebug("_changeNodeList(%o): nodeList:%o, idx:%o", mode, nodeList, idx);
		Array.prototype.unshift.apply(arguments, ["debug"]);
		_log.apply(this, arguments);
	},
	read: function() {
//		this._log("DynaTreeStatus: read");
		// Read or init cookies.
		this.cookiesFound = false;

		var cookie = $.cookie(this.cookieId + "-active");
		this.activeKey = ( cookie === null ) ? "" : cookie;
		if( cookie !== null ){
			this.cookiesFound = true;
		}
		cookie = $.cookie(this.cookieId + "-focus");
		this.focusedKey = ( cookie === null ) ? "" : cookie;
		if( cookie !== null ){
			this.cookiesFound = true;
		}
		cookie = $.cookie(this.cookieId + "-expand");
		this.expandedKeyList = ( cookie === null ) ? [] : cookie.split(",");
		if( cookie !== null ){
			this.cookiesFound = true;
		}
		cookie = $.cookie(this.cookieId + "-select");
		this.selectedKeyList = ( cookie === null ) ? [] : cookie.split(",");
		if( cookie !== null ){
			this.cookiesFound = true;
		}
	},
	write: function() {
//		this._log("DynaTreeStatus: write");
		$.cookie(this.cookieId + "-active", ( this.activeKey === null ) ? "" : this.activeKey, this.cookieOpts);
		$.cookie(this.cookieId + "-focus", ( this.focusedKey === null ) ? "" : this.focusedKey, this.cookieOpts);
		$.cookie(this.cookieId + "-expand", ( this.expandedKeyList === null ) ? "" : this.expandedKeyList.join(","), this.cookieOpts);
		$.cookie(this.cookieId + "-select", ( this.selectedKeyList === null ) ? "" : this.selectedKeyList.join(","), this.cookieOpts);
	},
	addExpand: function(key) {
//		this._log("addExpand(%o)", key);
		if( $.inArray(key, this.expandedKeyList) < 0 ) {
			this.expandedKeyList.push(key);
			$.cookie(this.cookieId + "-expand", this.expandedKeyList.join(","), this.cookieOpts);
		}
	},
	clearExpand: function(key) {
//		this._log("clearExpand(%o)", key);
		var idx = $.inArray(key, this.expandedKeyList);
		if( idx >= 0 ) {
			this.expandedKeyList.splice(idx, 1);
			$.cookie(this.cookieId + "-expand", this.expandedKeyList.join(","), this.cookieOpts);
		}
	},
	addSelect: function(key) {
//		this._log("addSelect(%o)", key);
		if( $.inArray(key, this.selectedKeyList) < 0 ) {
			this.selectedKeyList.push(key);
			$.cookie(this.cookieId + "-select", this.selectedKeyList.join(","), this.cookieOpts);
		}
	},
	clearSelect: function(key) {
//		this._log("clearSelect(%o)", key);
		var idx = $.inArray(key, this.selectedKeyList);
		if( idx >= 0 ) {
			this.selectedKeyList.splice(idx, 1);
			$.cookie(this.cookieId + "-select", this.selectedKeyList.join(","), this.cookieOpts);
		}
	},
	isReloading: function() {
		return this.cookiesFound === true;
	},
	toDict: function() {
		return {
			cookiesFound: this.cookiesFound,
			activeKey: this.activeKey,
			focusedKey: this.activeKey,
			expandedKeyList: this.expandedKeyList,
			selectedKeyList: this.selectedKeyList
		};
	},
	// --- end of class
	lastentry: undefined
};


/*************************************************************************
 * class DynaTree
 */

var DynaTree = Class.create();

// --- Static members ----------------------------------------------------------

DynaTree.version = "$Version:$";

/*
DynaTree._initTree = function() {
};

DynaTree._bind = function() {
};
*/
//--- Class members ------------------------------------------------------------

DynaTree.prototype = {
	// Constructor
//	initialize: function(divContainer, options) {
	initialize: function($widget) {
		// instance members
		this.phase = "init";
		this.$widget = $widget;
		this.options = $widget.options;
		this.$tree = $widget.element;
		this.timer = null;
		// find container element
		this.divTree = this.$tree.get(0);

//		var parentPos = $(this.divTree).parent().offset();
//		this.parentTop = parentPos.top;
//		this.parentLeft = parentPos.left;

		_initDragAndDrop(this);
	},

	// member functions

	_load: function(callback) {
		var $widget = this.$widget;
		var opts = this.options,
			self = this;
		this.bEnableUpdate = true;
		this._nodeCount = 1;
		this.activeNode = null;
		this.focusNode = null;

		// Some deprecation warnings to help with migration
		if( opts.rootVisible !== undefined ){
			this.logWarning("Option 'rootVisible' is no longer supported.");
		}
		if( opts.minExpandLevel < 1 ) {
			this.logWarning("Option 'minExpandLevel' must be >= 1.");
			opts.minExpandLevel = 1;
		}
//		_log("warn", "jQuery.support.boxModel " + jQuery.support.boxModel);

		// If a 'options.classNames' dictionary was passed, still use defaults
		// for undefined classes:
		if( opts.classNames !== $.ui.dynatree.prototype.options.classNames ) {
			opts.classNames = $.extend({}, $.ui.dynatree.prototype.options.classNames, opts.classNames);
		}
		if( opts.ajaxDefaults !== $.ui.dynatree.prototype.options.ajaxDefaults ) {
			opts.ajaxDefaults = $.extend({}, $.ui.dynatree.prototype.options.ajaxDefaults, opts.ajaxDefaults);
		}
		if( opts.dnd !== $.ui.dynatree.prototype.options.dnd ) {
			opts.dnd = $.extend({}, $.ui.dynatree.prototype.options.dnd, opts.dnd);
		}
		// Guess skin path, if not specified
		if(!opts.imagePath) {
			$("script").each( function () {
				var _rexDtLibName = /.*dynatree[^\/]*\.js$/i;
				if( this.src.search(_rexDtLibName) >= 0 ) {
					if( this.src.indexOf("/")>=0 ){ // issue #47
						opts.imagePath = this.src.slice(0, this.src.lastIndexOf("/")) + "/skin/";
					}else{
						opts.imagePath = "skin/";
					}
					self.logDebug("Guessing imagePath from '%s': '%s'", this.src, opts.imagePath);
					return false; // first match
				}
			});
		}

		this.persistence = new DynaTreeStatus(opts.cookieId, opts.cookie);
		if( opts.persist ) {
			if( !$.cookie ){
				_log("warn", "Please include jquery.cookie.js to use persistence.");
			}
			this.persistence.read();
		}
		this.logDebug("DynaTree.persistence: %o", this.persistence.toDict());

		// Cached tag strings
		this.cache = {
			tagEmpty: "<span class='" + opts.classNames.empty + "'></span>",
			tagVline: "<span class='" + opts.classNames.vline + "'></span>",
			tagExpander: "<span class='" + opts.classNames.expander + "'></span>",
			tagConnector: "<span class='" + opts.classNames.connector + "'></span>",
			tagNodeIcon: "<span class='" + opts.classNames.nodeIcon + "'></span>",
			tagCheckbox: "<span class='" + opts.classNames.checkbox + "'></span>",
			lastentry: undefined
		};

		// Clear container, in case it contained some 'waiting' or 'error' text
		// for clients that don't support JS.
		// We don't do this however, if we try to load from an embedded UL element.
		if( opts.children || (opts.initAjax && opts.initAjax.url) || opts.initId ){
			$(this.divTree).empty();
		}
		var $ulInitialize = this.$tree.find(">ul:first").hide();

		// Create the root element
		this.tnRoot = new DynaTreeNode(null, this, {});
		this.tnRoot.bExpanded = true;
		this.tnRoot.render();
		this.divTree.appendChild(this.tnRoot.ul);

		var root = this.tnRoot,
			isReloading = ( opts.persist && this.persistence.isReloading() ),
			isLazy = false,
			prevFlag = this.enableUpdate(false);

		this.logDebug("Dynatree._load(): read tree structure...");

		// Init tree structure
		if( opts.children ) {
			// Read structure from node array
			root.addChild(opts.children);

		} else if( opts.initAjax && opts.initAjax.url ) {
			// Init tree from AJAX request
			isLazy = true;
			root.data.isLazy = true;
			this._reloadAjax(callback);

		} else if( opts.initId ) {
			// Init tree from another UL element
			this._createFromTag(root, $("#"+opts.initId));

		} else {
			// Init tree from the first UL element inside the container <div>
//			var $ul = this.$tree.find(">ul:first").hide();
			this._createFromTag(root, $ulInitialize);
			$ulInitialize.remove();
		}

		this._checkConsistency();
		// Fix part-sel flags
		if(!isLazy && opts.selectMode == 3){
			root._updatePartSelectionState();
		}
		// Render html markup
		this.logDebug("Dynatree._load(): render nodes...");
		this.enableUpdate(prevFlag);

		// bind event handlers
		this.logDebug("Dynatree._load(): bind events...");
		this.$widget.bind();

		// --- Post-load processing
		this.logDebug("Dynatree._load(): postInit...");
		this.phase = "postInit";

		// In persist mode, make sure that cookies are written, even if they are empty
		if( opts.persist ) {
			this.persistence.write();
		}
		// Set focus, if possible (this will also fire an event and write a cookie)
		if( this.focusNode && this.focusNode.isVisible() ) {
			this.logDebug("Focus on init: %o", this.focusNode);
			this.focusNode.focus();
		}
		if( !isLazy ) {
			if( opts.onPostInit ) {
				opts.onPostInit.call(this, isReloading, false);
			}
			if( callback ){
				callback.call(this, "ok");
			}
		}
		this.phase = "idle";
	},

	_reloadAjax: function(callback) {
		// Reload
		var opts = this.options;
		if( ! opts.initAjax || ! opts.initAjax.url ){
			throw "tree.reload() requires 'initAjax' mode.";
		}
		var pers = this.persistence;
		var ajaxOpts = $.extend({}, opts.initAjax);
		// Append cookie info to the request
//		this.logDebug("reloadAjax: key=%o, an.key:%o", pers.activeKey, this.activeNode?this.activeNode.data.key:"?");
		if( ajaxOpts.addActiveKey ){
			ajaxOpts.data.activeKey = pers.activeKey;
		}
		if( ajaxOpts.addFocusedKey ){
			ajaxOpts.data.focusedKey = pers.focusedKey;
		}
		if( ajaxOpts.addExpandedKeyList ){
			ajaxOpts.data.expandedKeyList = pers.expandedKeyList.join(",");
		}
		if( ajaxOpts.addSelectedKeyList ){
			ajaxOpts.data.selectedKeyList = pers.selectedKeyList.join(",");
		}
		// Set up onPostInit callback to be called when Ajax returns
		if( ajaxOpts.success ){
			this.logWarning("initAjax: success callback is ignored; use onPostInit instead.");
		}
		if( ajaxOpts.error ){
			this.logWarning("initAjax: error callback is ignored; use onPostInit instead.");
		}
		var isReloading = pers.isReloading();
		ajaxOpts.success = function(dtnode, data, textStatus) {
			if(opts.selectMode == 3){
				dtnode.tree.tnRoot._updatePartSelectionState();
			}
			if(opts.onPostInit){
				opts.onPostInit.call(dtnode.tree, isReloading, false);
			}
			if(callback){
				callback.call(dtnode.tree, "ok");
			}
		};
		ajaxOpts.error = function(dtnode, XMLHttpRequest, textStatus, errorThrown) {
			if(opts.onPostInit){
				opts.onPostInit.call(dtnode.tree, isReloading, true, XMLHttpRequest, textStatus, errorThrown);
			}
			if(callback){
				callback.call(dtnode.tree, "error", XMLHttpRequest, textStatus, errorThrown);
			}
		};
//		}
		this.logDebug("Dynatree._init(): send Ajax request...");
		this.tnRoot.appendAjax(ajaxOpts);
	},

	toString: function() {
//		return "DynaTree '" + this.options.title + "'";
		return "Dynatree '" + this.$tree.attr("id") + "'";
	},

	toDict: function() {
		return this.tnRoot.toDict(true);
	},

	serializeArray: function(stopOnParents) {
		// Return a JavaScript array of objects, ready to be encoded as a JSON
		// string for selected nodes
		var nodeList = this.getSelectedNodes(stopOnParents),
			name = this.$tree.attr("name") || this.$tree.attr("id"),
			arr = [];
		for(var i=0, l=nodeList.length; i<l; i++){
			arr.push({name: name, value: nodeList[i].data.key});
		}
		return arr;
	},

	getPersistData: function() {
		return this.persistence.toDict();
	},

	logDebug: function(msg) {
		if( this.options.debugLevel >= 2 ) {
			Array.prototype.unshift.apply(arguments, ["debug"]);
			_log.apply(this, arguments);
		}
	},

	logInfo: function(msg) {
		if( this.options.debugLevel >= 1 ) {
			Array.prototype.unshift.apply(arguments, ["info"]);
			_log.apply(this, arguments);
		}
	},

	logWarning: function(msg) {
		Array.prototype.unshift.apply(arguments, ["warn"]);
		_log.apply(this, arguments);
	},

	isInitializing: function() {
		return ( this.phase=="init" || this.phase=="postInit" );
	},
	isReloading: function() {
		return ( this.phase=="init" || this.phase=="postInit" ) && this.options.persist && this.persistence.cookiesFound;
	},
	isUserEvent: function() {
		return ( this.phase=="userEvent" );
	},

	redraw: function() {
//		this.logDebug("dynatree.redraw()...");
		this.tnRoot.render(false, false);
//		this.logDebug("dynatree.redraw() done.");
	},
	renderInvisibleNodes: function() {
		this.tnRoot.render(false, true);
	},
	reload: function(callback) {
		this._load(callback);
	},

	getRoot: function() {
		return this.tnRoot;
	},

	enable: function() {
		this.$widget.enable();
	},

	disable: function() {
		this.$widget.disable();
	},

	getNodeByKey: function(key) {
		// Search the DOM by element ID (assuming this is faster than traversing all nodes).
		// $("#...") has problems, if the key contains '.', so we use getElementById()
		var el = document.getElementById(this.options.idPrefix + key);
		if( el ){
			return el.dtnode ? el.dtnode : null;
		}
		// Not found in the DOM, but still may be in an unrendered part of tree
		var match = null;
		this.visit(function(node){
//			window.console.log("%s", node);
			if(node.data.key === key) {
				match = node;
				return false;
			}
		}, true);
		return match;
	},

	getActiveNode: function() {
		return this.activeNode;
	},

	reactivate: function(setFocus) {
		// Re-fire onQueryActivate and onActivate events.
		var node = this.activeNode;
//		this.logDebug("reactivate %o", node);
		if( node ) {
			this.activeNode = null; // Force re-activating
			node.activate();
			if( setFocus ){
				node.focus();
			}
		}
	},

	getSelectedNodes: function(stopOnParents) {
		var nodeList = [];
		this.tnRoot.visit(function(node){
			if( node.bSelected ) {
				nodeList.push(node);
				if( stopOnParents === true ){
					return "skip"; // stop processing this branch
				}
			}
		});
		return nodeList;
	},

	activateKey: function(key) {
		var dtnode = (key === null) ? null : this.getNodeByKey(key);
		if( !dtnode ) {
			if( this.activeNode ){
				this.activeNode.deactivate();
			}
			this.activeNode = null;
			return null;
		}
		dtnode.focus();
		dtnode.activate();
		return dtnode;
	},

	loadKeyPath: function(keyPath, callback) {
		var segList = keyPath.split(this.options.keyPathSeparator);
		// Remove leading '/'
		if(segList[0] === ""){
			segList.shift();
		}
		// Remove leading system root key
		if(segList[0] == this.tnRoot.data.key){
			this.logDebug("Removed leading root key.");
			segList.shift();
		}
		keyPath = segList.join(this.options.keyPathSeparator);
		return this.tnRoot._loadKeyPath(keyPath, callback);
	},

	selectKey: function(key, select) {
		var dtnode = this.getNodeByKey(key);
		if( !dtnode ){
			return null;
		}
		dtnode.select(select);
		return dtnode;
	},

	enableUpdate: function(bEnable) {
		if ( this.bEnableUpdate==bEnable ){
			return bEnable;
		}
		this.bEnableUpdate = bEnable;
		if ( bEnable ){
			this.redraw();
		}
		return !bEnable; // return previous value
	},

	count: function() {
		return this.tnRoot.countChildren();
	},

	visit: function(fn, includeRoot) {
		return this.tnRoot.visit(fn, includeRoot);
	},

	_createFromTag: function(parentTreeNode, $ulParent) {
		// Convert a <UL>...</UL> list into children of the parent tree node.
		var self = this;
/*
TODO: better?
		this.$lis = $("li:has(a[href])", this.element);
		this.$tabs = this.$lis.map(function() { return $("a", this)[0]; });
 */
		$ulParent.find(">li").each(function() {
			var $li = $(this),
				$liSpan = $li.find(">span:first"),
				$liA = $li.find(">a:first"),
				title,
				href = null,
				target = null,
				tooltip;
			if( $liSpan.length ) {
				// If a <li><span> tag is specified, use it literally.
				title = $liSpan.html();
			} else if( $liA.length ) {
				title = $liA.html();
				href = $liA.attr("href");
				target = $liA.attr("target");
				tooltip = $liA.attr("title");
			} else {
				// If only a <li> tag is specified, use the trimmed string up to
				// the next child <ul> tag.
				title = $li.html();
				var iPos = title.search(/<ul/i);
				if( iPos >= 0 ){
					title = $.trim(title.substring(0, iPos));
				}else{
					title = $.trim(title);
				}
//				self.logDebug("%o", title);
			}
			// Parse node options from ID, title and class attributes
			var data = {
				title: title,
				tooltip: tooltip,
				isFolder: $li.hasClass("folder"),
				isLazy: $li.hasClass("lazy"),
				expand: $li.hasClass("expanded"),
				select: $li.hasClass("selected"),
				activate: $li.hasClass("active"),
				focus: $li.hasClass("focused"),
				noLink: $li.hasClass("noLink")
			};
			if( href ){
				data.href = href;
				data.target = target;
			}
			if( $li.attr("title") ){
				data.tooltip = $li.attr("title"); // overrides <a title='...'>
			}
			if( $li.attr("id") ){
				data.key = "" + $li.attr("id");
			}
			// If a data attribute is present, evaluate as a JavaScript object
			if( $li.attr("data") ) {
				var dataAttr = $.trim($li.attr("data"));
				if( dataAttr ) {
					if( dataAttr.charAt(0) != "{" ){
						dataAttr = "{" + dataAttr + "}";
					}
					try {
						$.extend(data, eval("(" + dataAttr + ")"));
					} catch(e) {
						throw ("Error parsing node data: " + e + "\ndata:\n'" + dataAttr + "'");
					}
				}
			}
			var childNode = parentTreeNode.addChild(data);
			// Recursive reading of child nodes, if LI tag contains an UL tag
			var $ul = $li.find(">ul:first");
			if( $ul.length ) {
				self._createFromTag(childNode, $ul); // must use 'self', because 'this' is the each() context
			}
		});
	},

	_checkConsistency: function() {
//		this.logDebug("tree._checkConsistency() NOT IMPLEMENTED - %o", this);
	},

	_setDndStatus: function(sourceNode, targetNode, helper, hitMode, accept) {
		// hitMode: 'after', 'before', 'over', 'out', 'start', 'stop'
		var $source = sourceNode ? $(sourceNode.span) : null,
			$target = $(targetNode.span);
		if( !this.$dndMarker ) {
			this.$dndMarker = $("<div id='dynatree-drop-marker'></div>")
				.hide()
				.css({"z-index": 1000})
				.prependTo($(this.divTree).parent());

//			logMsg("Creating marker: %o", this.$dndMarker);
		}
/*
		if(hitMode === "start"){
		}
		if(hitMode === "stop"){
//			sourceNode.removeClass("dynatree-drop-target");
		}
*/
		if(hitMode === "after" || hitMode === "before" || hitMode === "over"){
//			$source && $source.addClass("dynatree-drag-source");
//			$target.addClass("dynatree-drop-target");

			var markerOffset = "0 0";

			switch(hitMode){
			case "before":
				this.$dndMarker.removeClass("dynatree-drop-after dynatree-drop-over");
				this.$dndMarker.addClass("dynatree-drop-before");
				markerOffset = "0 -8";
				break;
			case "after":
				this.$dndMarker.removeClass("dynatree-drop-before dynatree-drop-over");
				this.$dndMarker.addClass("dynatree-drop-after");
				markerOffset = "0 8";
				break;
			default:
				this.$dndMarker.removeClass("dynatree-drop-after dynatree-drop-before");
				this.$dndMarker.addClass("dynatree-drop-over");
				$target.addClass("dynatree-drop-target");
				markerOffset = "8 0";
			}
//			logMsg("Creating marker: %o", this.$dndMarker);
//			logMsg("    $target.offset=%o", $target);
//			logMsg("    pos/$target.offset=%o", pos);
//			logMsg("    $target.position=%o", $target.position());
//			logMsg("    $target.offsetParent=%o, ot:%o", $target.offsetParent(), $target.offsetParent().offset());
//			logMsg("    $(this.divTree).offset=%o", $(this.divTree).offset());
//			logMsg("    $(this.divTree).parent=%o", $(this.divTree).parent());
//			var pos = $target.offset();
//			var parentPos = $target.offsetParent().offset();
//			var bodyPos = $target.offsetParent().offset();

			this.$dndMarker
				.show()
				.position({
					my: "left top",
					at: "left top",
					of: $target,
					offset: markerOffset
				});

//			helper.addClass("dynatree-drop-hover");
		} else {
//			$source && $source.removeClass("dynatree-drag-source");
			$target.removeClass("dynatree-drop-target");
			this.$dndMarker.hide();
//			helper.removeClass("dynatree-drop-hover");
		}
		if(hitMode === "after"){
			$target.addClass("dynatree-drop-after");
		} else {
			$target.removeClass("dynatree-drop-after");
		}
		if(hitMode === "before"){
			$target.addClass("dynatree-drop-before");
		} else {
			$target.removeClass("dynatree-drop-before");
		}
		if(accept === true){
			if($source){
				$source.addClass("dynatree-drop-accept");
			}
			$target.addClass("dynatree-drop-accept");
			helper.addClass("dynatree-drop-accept");
		}else{
			if($source){
				$source.removeClass("dynatree-drop-accept");
			}
			$target.removeClass("dynatree-drop-accept");
			helper.removeClass("dynatree-drop-accept");
		}
		if(accept === false){
			if($source){
				$source.addClass("dynatree-drop-reject");
			}
			$target.addClass("dynatree-drop-reject");
			helper.addClass("dynatree-drop-reject");
		}else{
			if($source){
				$source.removeClass("dynatree-drop-reject");
			}
			$target.removeClass("dynatree-drop-reject");
			helper.removeClass("dynatree-drop-reject");
		}
	},

	_onDragEvent: function(eventName, node, otherNode, event, ui, draggable) {
		/**
		 * Handles drag'n'drop functionality.
		 *
		 * A standard jQuery drag-and-drop process may generate these calls:
		 *
		 * draggable helper():
		 *     _onDragEvent("helper", sourceNode, null, event, null, null);
		 * start:
		 *     _onDragEvent("start", sourceNode, null, event, ui, draggable);
		 * drag:
		 *     _onDragEvent("leave", prevTargetNode, sourceNode, event, ui, draggable);
		 *     _onDragEvent("over", targetNode, sourceNode, event, ui, draggable);
		 *     _onDragEvent("enter", targetNode, sourceNode, event, ui, draggable);
		 * stop:
		 *     _onDragEvent("drop", targetNode, sourceNode, event, ui, draggable);
		 *     _onDragEvent("leave", targetNode, sourceNode, event, ui, draggable);
		 *     _onDragEvent("stop", sourceNode, null, event, ui, draggable);
		 */
//		if(eventName !== "over"){
//			this.logDebug("tree._onDragEvent(%s, %o, %o) - %o", eventName, node, otherNode, this);
//		}
		var opts = this.options,
			dnd = this.options.dnd,
			res = null,
			nodeTag = $(node.span),
			hitMode,
			enterResponse;

		switch (eventName) {
		case "helper":
			// Only event and node argument is available
			var $helper = $("<div class='dynatree-drag-helper'><span class='dynatree-drag-helper-img' /></div>")
				.append($(event.target).closest(".dynatree-title").clone());
//			    .append($(event.target).closest('a').clone());
			// issue 244: helper should be child of scrollParent
			$("ul.dynatree-container", node.tree.divTree).append($helper);
//			$(node.tree.divTree).append($helper);
			// Attach node reference to helper object
			$helper.data("dtSourceNode", node);
//			this.logDebug("helper=%o", $helper);
//			this.logDebug("helper.sourceNode=%o", $helper.data("dtSourceNode"));
			res = $helper;
			break;
		case "start":
			if(node.isStatusNode()) {
				res = false;
			} else if(dnd.onDragStart) {
				res = dnd.onDragStart(node);
			}
			if(res === false) {
				this.logDebug("tree.onDragStart() cancelled");
				//draggable._clear();
				// NOTE: the return value seems to be ignored (drag is not canceled, when false is returned)
				ui.helper.trigger("mouseup");
				ui.helper.hide();
			} else {
				nodeTag.addClass("dynatree-drag-source");
			}
			break;
		case "enter":
			res = dnd.onDragEnter ? dnd.onDragEnter(node, otherNode) : null;
			if(!res){
				// convert null, undefined, false to false
				res = false;
			}else{
				res = {
					over: ((res === true) || (res === "over") || $.inArray("over", res) >= 0),
					before: ((res === true) || (res === "before") || $.inArray("before", res) >= 0),
					after: ((res === true) || (res === "after") || $.inArray("after", res) >= 0)
				};
			}
			ui.helper.data("enterResponse", res);
//			this.logDebug("helper.enterResponse: %o", res);
			break;
		case "over":
			enterResponse = ui.helper.data("enterResponse");
			hitMode = null;
			if(enterResponse === false){
				// Don't call onDragOver if onEnter returned false.
				// issue 332
//				break;
			} else if(typeof enterResponse === "string") {
				// Use hitMode from onEnter if provided.
				hitMode = enterResponse;
			} else {
				// Calculate hitMode from relative cursor position.
				var nodeOfs = nodeTag.offset();
//				var relPos = { x: event.clientX - nodeOfs.left,
//							y: event.clientY - nodeOfs.top };
//				nodeOfs.top += this.parentTop;
//				nodeOfs.left += this.parentLeft;
				var relPos = { x: event.pageX - nodeOfs.left,
							   y: event.pageY - nodeOfs.top };
				var relPos2 = { x: relPos.x / nodeTag.width(),
								y: relPos.y / nodeTag.height() };
//				this.logDebug("event.page: %s/%s", event.pageX, event.pageY);
//				this.logDebug("event.client: %s/%s", event.clientX, event.clientY);
//				this.logDebug("nodeOfs: %s/%s", nodeOfs.left, nodeOfs.top);
////				this.logDebug("parent: %s/%s", this.parentLeft, this.parentTop);
//				this.logDebug("relPos: %s/%s", relPos.x, relPos.y);
//				this.logDebug("relPos2: %s/%s", relPos2.x, relPos2.y);
				if( enterResponse.after && relPos2.y > 0.75 ){
					hitMode = "after";
				} else if(!enterResponse.over && enterResponse.after && relPos2.y > 0.5 ){
					hitMode = "after";
				} else if(enterResponse.before && relPos2.y <= 0.25) {
					hitMode = "before";
				} else if(!enterResponse.over && enterResponse.before && relPos2.y <= 0.5) {
					hitMode = "before";
				} else if(enterResponse.over) {
					hitMode = "over";
				}
				// Prevent no-ops like 'before source node'
				// TODO: these are no-ops when moving nodes, but not in copy mode
				if( dnd.preventVoidMoves ){
					if(node === otherNode){
//						this.logDebug("    drop over source node prevented");
						hitMode = null;
					}else if(hitMode === "before" && otherNode && node === otherNode.getNextSibling()){
//						this.logDebug("    drop after source node prevented");
						hitMode = null;
					}else if(hitMode === "after" && otherNode && node === otherNode.getPrevSibling()){
//						this.logDebug("    drop before source node prevented");
						hitMode = null;
					}else if(hitMode === "over" && otherNode
							&& otherNode.parent === node && otherNode.isLastSibling() ){
//						this.logDebug("    drop last child over own parent prevented");
						hitMode = null;
					}
				}
//				this.logDebug("hitMode: %s - %s - %s", hitMode, (node.parent === otherNode), node.isLastSibling());
				ui.helper.data("hitMode", hitMode);
			}
			// Auto-expand node (only when 'over' the node, not 'before', or 'after')
			if(hitMode === "over"
				&& dnd.autoExpandMS && node.hasChildren() !== false && !node.bExpanded) {
				node.scheduleAction("expand", dnd.autoExpandMS);
			}
			if(hitMode && dnd.onDragOver){
				res = dnd.onDragOver(node, otherNode, hitMode);
				if(res === "over" || res === "before" || res === "after") {
					hitMode = res;
				}
			}
			// issue 332
//			this._setDndStatus(otherNode, node, ui.helper, hitMode, res!==false);
			this._setDndStatus(otherNode, node, ui.helper, hitMode, res!==false && hitMode !== null);
			break;
		case "drop":
			// issue 286: don't trigger onDrop, if DnD status is 'reject'
			var isForbidden = ui.helper.hasClass("dynatree-drop-reject");
			hitMode = ui.helper.data("hitMode");
			if(hitMode && dnd.onDrop && !isForbidden){
				dnd.onDrop(node, otherNode, hitMode, ui, draggable);
			}
			break;
		case "leave":
			// Cancel pending expand request
			node.scheduleAction("cancel");
			ui.helper.data("enterResponse", null);
			ui.helper.data("hitMode", null);
			this._setDndStatus(otherNode, node, ui.helper, "out", undefined);
			if(dnd.onDragLeave){
				dnd.onDragLeave(node, otherNode);
			}
			break;
		case "stop":
			nodeTag.removeClass("dynatree-drag-source");
			if(dnd.onDragStop){
				dnd.onDragStop(node);
			}
			break;
		default:
			throw "Unsupported drag event: " + eventName;
		}
		return res;
	},

	cancelDrag: function() {
		 var dd = $.ui.ddmanager.current;
		 if(dd){
			 dd.cancel();
		 }
	},

	// --- end of class
	lastentry: undefined
};

/*************************************************************************
 * Widget $(..).dynatree
 */

$.widget("ui.dynatree", {
/*
	init: function() {
		// ui.core 1.6 renamed init() to _init(): this stub assures backward compatibility
		_log("warn", "ui.dynatree.init() was called; you should upgrade to jquery.ui.core.js v1.8 or higher.");
		return this._init();
	},
 */
	_init: function() {
//		if( parseFloat($.ui.version) < 1.8 ) {
		if(versionCompare($.ui.version, "1.8") < 0){
			// jquery.ui.core 1.8 renamed _init() to _create(): this stub assures backward compatibility
			if(this.options.debugLevel >= 0){
				_log("warn", "ui.dynatree._init() was called; you should upgrade to jquery.ui.core.js v1.8 or higher.");
			}
			return this._create();
		}
		// jquery.ui.core 1.8 still uses _init() to perform "default functionality"
		if(this.options.debugLevel >= 2){
			_log("debug", "ui.dynatree._init() was called; no current default functionality.");
		}
	},

	_create: function() {
		var opts = this.options;
		if(opts.debugLevel >= 1){
			logMsg("Dynatree._create(): version='%s', debugLevel=%o.", $.ui.dynatree.version, this.options.debugLevel);
		}
		// The widget framework supplies this.element and this.options.
		this.options.event += ".dynatree"; // namespace event

		var divTree = this.element.get(0);
/*		// Clear container, in case it contained some 'waiting' or 'error' text
		// for clients that don't support JS
		if( opts.children || (opts.initAjax && opts.initAjax.url) || opts.initId )
			$(divTree).empty();
*/
		// Create the DynaTree object
		this.tree = new DynaTree(this);
		this.tree._load();
		this.tree.logDebug("Dynatree._init(): done.");
	},

	bind: function() {
		// Prevent duplicate binding
		this.unbind();

		var eventNames = "click.dynatree dblclick.dynatree";
		if( this.options.keyboard ){
			// Note: leading ' '!
			eventNames += " keypress.dynatree keydown.dynatree";
		}
		this.element.bind(eventNames, function(event){
			var dtnode = $.ui.dynatree.getNode(event.target);
			if( !dtnode ){
				return true;  // Allow bubbling of other events
			}
			var tree = dtnode.tree;
			var o = tree.options;
			tree.logDebug("event(%s): dtnode: %s", event.type, dtnode);
			var prevPhase = tree.phase;
			tree.phase = "userEvent";
			try {
				switch(event.type) {
				case "click":
					return ( o.onClick && o.onClick.call(tree, dtnode, event)===false ) ? false : dtnode._onClick(event);
				case "dblclick":
					return ( o.onDblClick && o.onDblClick.call(tree, dtnode, event)===false ) ? false : dtnode._onDblClick(event);
				case "keydown":
					return ( o.onKeydown && o.onKeydown.call(tree, dtnode, event)===false ) ? false : dtnode._onKeydown(event);
				case "keypress":
					return ( o.onKeypress && o.onKeypress.call(tree, dtnode, event)===false ) ? false : dtnode._onKeypress(event);
				}
			} catch(e) {
				var _ = null; // issue 117
				tree.logWarning("bind(%o): dtnode: %o, error: %o", event, dtnode, e);
			} finally {
				tree.phase = prevPhase;
			}
		});

		// focus/blur don't bubble, i.e. are not delegated to parent <div> tags,
		// so we use the addEventListener capturing phase.
		// See http://www.howtocreate.co.uk/tutorials/javascript/domevents
		function __focusHandler(event) {
			// Handles blur and focus.
			// Fix event for IE:
			// doesn't pass JSLint:
//			event = arguments[0] = $.event.fix( event || window.event );
			// what jQuery does:
//			var args = jQuery.makeArray( arguments );
//			event = args[0] = jQuery.event.fix( event || window.event );
			event = $.event.fix( event || window.event );
			var dtnode = $.ui.dynatree.getNode(event.target);
			return dtnode ? dtnode._onFocus(event) : false;
		}
		var div = this.tree.divTree;

		if( div.addEventListener ) {
			div.addEventListener("focus", __focusHandler, true);
			div.addEventListener("blur", __focusHandler, true);
		} else {
			div.onfocusin = div.onfocusout = __focusHandler;
		}
		// EVENTS
		// disable click if event is configured to something else
//		if (!(/^click/).test(o.event))
//			this.$tabs.bind("click.tabs", function() { return false; });

	},

	unbind: function() {
		this.element.unbind(".dynatree");
	},

/* TODO: we could handle option changes during runtime here (maybe to re-render, ...)
	setData: function(key, value) {
		this.tree.logDebug("dynatree.setData('" + key + "', '" + value + "')");
	},
*/
	enable: function() {
		this.bind();
		// Call default disable(): remove -disabled from css:
		$.Widget.prototype.enable.apply(this, arguments);
	},

	disable: function() {
		this.unbind();
		// Call default disable(): add -disabled to css:
		$.Widget.prototype.disable.apply(this, arguments);
	},

	// --- getter methods (i.e. NOT returning a reference to $)
	getTree: function() {
		return this.tree;
	},

	getRoot: function() {
		return this.tree.getRoot();
	},

	getActiveNode: function() {
		return this.tree.getActiveNode();
	},

	getSelectedNodes: function() {
		return this.tree.getSelectedNodes();
	},

	// ------------------------------------------------------------------------
	lastentry: undefined
});


// The following methods return a value (thus breaking the jQuery call chain):
if(versionCompare($.ui.version, "1.8") < 0){
//if( parseFloat($.ui.version) < 1.8 ) {
	$.ui.dynatree.getter = "getTree getRoot getActiveNode getSelectedNodes";
}

/*******************************************************************************
 * Tools in ui.dynatree namespace
 */
$.ui.dynatree.version = "$Version:$";

/**
 * Return a DynaTreeNode object for a given DOM element
 */
$.ui.dynatree.getNode = function(el) {
	if(el instanceof DynaTreeNode){
		return el; // el already was a DynaTreeNode
	}
	if(el.selector !== undefined){
		el = el[0]; // el was a jQuery object: use the DOM element
	}
	// TODO: for some reason $el.parents("[dtnode]") does not work (jQuery 1.6.1)
	// maybe, because dtnode is a property, not an attribute
	while( el ) {
		if(el.dtnode) {
			return el.dtnode;
		}
		el = el.parentNode;
	}
	return null;
/*
	var $el = el.selector === undefined ? $(el) : el,
//		parent = $el.closest("[dtnode]"),
//		parent = $el.parents("[dtnode]").first(),
		useProp = (typeof $el.prop == "function"),
		node;
	$el.parents().each(function(){
		node = useProp ? $(this).prop("dtnode") : $(this).attr("dtnode");
		if(node){
			return false;
		}
	});
	return node;
*/
};

/**Return persistence information from cookies.*/
$.ui.dynatree.getPersistData = DynaTreeStatus._getTreePersistData;

/*******************************************************************************
 * Plugin default options:
 */
$.ui.dynatree.prototype.options = {
	title: "Dynatree", // Tree's name (only used for debug output)
	minExpandLevel: 1, // 1: root node is not collapsible
	imagePath: null, // Path to a folder containing icons. Defaults to 'skin/' subdirectory.
	children: null, // Init tree structure from this object array.
	initId: null, // Init tree structure from a <ul> element with this ID.
	initAjax: null, // Ajax options used to initialize the tree strucuture.
	autoFocus: true, // Set focus to first child, when expanding or lazy-loading.
	keyboard: true, // Support keyboard navigation.
	persist: false, // Persist expand-status to a cookie
	autoCollapse: false, // Automatically collapse all siblings, when a node is expanded.
	clickFolderMode: 3, // 1:activate, 2:expand, 3:activate and expand
	activeVisible: true, // Make sure, active nodes are visible (expanded).
	checkbox: false, // Show checkboxes.
	selectMode: 2, // 1:single, 2:multi, 3:multi-hier
	fx: null, // Animations, e.g. null or { height: "toggle", duration: 200 }
	noLink: false, // Use <span> instead of <a> tags for all nodes
	// Low level event handlers: onEvent(dtnode, event): return false, to stop default processing
	onClick: null, // null: generate focus, expand, activate, select events.
	onDblClick: null, // (No default actions.)
	onKeydown: null, // null: generate keyboard navigation (focus, expand, activate).
	onKeypress: null, // (No default actions.)
	onFocus: null, // null: set focus to node.
	onBlur: null, // null: remove focus from node.

	// Pre-event handlers onQueryEvent(flag, dtnode): return false, to stop processing
	onQueryActivate: null, // Callback(flag, dtnode) before a node is (de)activated.
	onQuerySelect: null, // Callback(flag, dtnode) before a node is (de)selected.
	onQueryExpand: null, // Callback(flag, dtnode) before a node is expanded/collpsed.

	// High level event handlers
	onPostInit: null, // Callback(isReloading, isError) when tree was (re)loaded.
	onActivate: null, // Callback(dtnode) when a node is activated.
	onDeactivate: null, // Callback(dtnode) when a node is deactivated.
	onSelect: null, // Callback(flag, dtnode) when a node is (de)selected.
	onExpand: null, // Callback(flag, dtnode) when a node is expanded/collapsed.
	onLazyRead: null, // Callback(dtnode) when a lazy node is expanded for the first time.
	onCustomRender: null, // Callback(dtnode) before a node is rendered. Return a HTML string to override.
	onCreate: null, // Callback(dtnode, nodeSpan) after a node was rendered for the first time.
	onRender: null, // Callback(dtnode, nodeSpan) after a node was rendered.
				// postProcess is similar to the standard dataFilter hook,
				// but it is also called for JSONP
	postProcess: null, // Callback(data, dataType) before an Ajax result is passed to dynatree

	// Drag'n'drop support
	dnd: {
		// Make tree nodes draggable:
		onDragStart: null, // Callback(sourceNode), return true, to enable dnd
		onDragStop: null, // Callback(sourceNode)
//		helper: null,
		// Make tree nodes accept draggables
		autoExpandMS: 1000, // Expand nodes after n milliseconds of hovering.
		preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
		onDragEnter: null, // Callback(targetNode, sourceNode)
		onDragOver: null, // Callback(targetNode, sourceNode, hitMode)
		onDrop: null, // Callback(targetNode, sourceNode, hitMode)
		onDragLeave: null // Callback(targetNode, sourceNode)
	},
	ajaxDefaults: { // Used by initAjax option
		cache: false, // false: Append random '_' argument to the request url to prevent caching.
		timeout: 0, // >0: Make sure we get an ajax error for invalid URLs
		dataType: "json" // Expect json format and pass json object to callbacks.
	},
	strings: {
		loading: "Loading&#8230;",
		loadError: "Load error!"
	},
	generateIds: false, // Generate id attributes like <span id='dynatree-id-KEY'>
	idPrefix: "dynatree-id-", // Used to generate node id's like <span id="dynatree-id-<key>">.
	keyPathSeparator: "/", // Used by node.getKeyPath() and tree.loadKeyPath().
//    cookieId: "dynatree-cookie", // Choose a more unique name, to allow multiple trees.
	cookieId: "dynatree", // Choose a more unique name, to allow multiple trees.
	cookie: {
		expires: null //7, // Days or Date; null: session cookie
//		path: "/", // Defaults to current page
//		domain: "jquery.com",
//		secure: true
	},
	// Class names used, when rendering the HTML markup.
	// Note: if only single entries are passed for options.classNames, all other
	// values are still set to default.
	classNames: {
		container: "dynatree-container",
		node: "dynatree-node",
		folder: "dynatree-folder",
//		document: "dynatree-document",

		empty: "dynatree-empty",
		vline: "dynatree-vline",
		expander: "dynatree-expander",
		connector: "dynatree-connector",
		checkbox: "dynatree-checkbox",
		nodeIcon: "dynatree-icon",
		title: "dynatree-title",
		noConnector: "dynatree-no-connector",

		nodeError: "dynatree-statusnode-error",
		nodeWait: "dynatree-statusnode-wait",
		hidden: "dynatree-hidden",
		combinedExpanderPrefix: "dynatree-exp-",
		combinedIconPrefix: "dynatree-ico-",
		nodeLoading: "dynatree-loading",
//		disabled: "dynatree-disabled",
		hasChildren: "dynatree-has-children",
		active: "dynatree-active",
		selected: "dynatree-selected",
		expanded: "dynatree-expanded",
		lazy: "dynatree-lazy",
		focused: "dynatree-focused",
		partsel: "dynatree-partsel",
		lastsib: "dynatree-lastsib"
	},
	debugLevel: 2, // 0:quiet, 1:normal, 2:debug $REPLACE:	debugLevel: 1,

	// ------------------------------------------------------------------------
	lastentry: undefined
};
//
if(versionCompare($.ui.version, "1.8") < 0){
//if( parseFloat($.ui.version) < 1.8 ) {
	$.ui.dynatree.defaults = $.ui.dynatree.prototype.options;
}

/*******************************************************************************
 * Reserved data attributes for a tree node.
 */
$.ui.dynatree.nodedatadefaults = {
	title: null, // (required) Displayed name of the node (html is allowed here)
	key: null, // May be used with activate(), select(), find(), ...
	isFolder: false, // Use a folder icon. Also the node is expandable but not selectable.
	isLazy: false, // Call onLazyRead(), when the node is expanded for the first time to allow for delayed creation of children.
	tooltip: null, // Show this popup text.
	href: null, // Added to the generated <a> tag.
	icon: null, // Use a custom image (filename relative to tree.options.imagePath). 'null' for default icon, 'false' for no icon.
	addClass: null, // Class name added to the node's span tag.
	noLink: false, // Use <span> instead of <a> tag for this node
	activate: false, // Initial active status.
	focus: false, // Initial focused status.
	expand: false, // Initial expanded status.
	select: false, // Initial selected status.
	hideCheckbox: false, // Suppress checkbox display for this node.
	unselectable: false, // Prevent selection.
//  disabled: false,
	// The following attributes are only valid if passed to some functions:
	children: null, // Array of child nodes.
	// NOTE: we can also add custom attributes here.
	// This may then also be used in the onActivate(), onSelect() or onLazyTree() callbacks.
	// ------------------------------------------------------------------------
	lastentry: undefined
};

/*******************************************************************************
 * Drag and drop support
 */
function _initDragAndDrop(tree) {
	var dnd = tree.options.dnd || null;
	// Register 'connectToDynatree' option with ui.draggable
	if(dnd && (dnd.onDragStart || dnd.onDrop)) {
		_registerDnd();
	}
	// Attach ui.draggable to this Dynatree instance
	if(dnd && dnd.onDragStart ) {
		tree.$tree.draggable({
			addClasses: false,
			appendTo: "body",
			containment: false,
			delay: 0,
			distance: 4,
			revert: false,
			scroll: true, // issue 244: enable scrolling (if ul.dynatree-container)
			scrollSpeed: 7,
			scrollSensitivity: 10,
			// Delegate draggable.start, drag, and stop events to our handler
			connectToDynatree: true,
			// Let source tree create the helper element
			helper: function(event) {
				var sourceNode = $.ui.dynatree.getNode(event.target);
				if(!sourceNode){ // issue 211
					return "<div></div>";
				}
				return sourceNode.tree._onDragEvent("helper", sourceNode, null, event, null, null);
			},
			start: function(event, ui) {
				// See issues 211, 268, 278
//				var sourceNode = $.ui.dynatree.getNode(event.target);
				var sourceNode = ui.helper.data("dtSourceNode");
				return !!sourceNode; // Abort dragging if no Node could be found
			},
			_last: null
		});
	}
	// Attach ui.droppable to this Dynatree instance
	if(dnd && dnd.onDrop) {
		tree.$tree.droppable({
			addClasses: false,
			tolerance: "intersect",
			greedy: false,
			_last: null
		});
	}
}

//--- Extend ui.draggable event handling --------------------------------------
var didRegisterDnd = false;
var _registerDnd = function() {
	if(didRegisterDnd){
		return;
	}
	// Register proxy-functions for draggable.start/drag/stop
	$.ui.plugin.add("draggable", "connectToDynatree", {
		start: function(event, ui) {
			// issue 386
			var draggable = $(this).data("ui-draggable") || $(this).data("draggable"),
				sourceNode = ui.helper.data("dtSourceNode") || null;
//			logMsg("draggable-connectToDynatree.start, %s", sourceNode);
//			logMsg("    this: %o", this);
//			logMsg("    event: %o", event);
//			logMsg("    draggable: %o", draggable);
//			logMsg("    ui: %o", ui);

			if(sourceNode) {
				// Adjust helper offset, so cursor is slightly outside top/left corner
//				draggable.offset.click.top -= event.target.offsetTop;
//				draggable.offset.click.left -= event.target.offsetLeft;
				draggable.offset.click.top = -2;
				draggable.offset.click.left = + 16;
//				logMsg("    draggable2: %o", draggable);
//				logMsg("    draggable.offset.click FIXED: %s/%s", draggable.offset.click.left, draggable.offset.click.top);
				// Trigger onDragStart event
				// TODO: when called as connectTo..., the return value is ignored(?)
				return sourceNode.tree._onDragEvent("start", sourceNode, null, event, ui, draggable);
			}
		},
		drag: function(event, ui) {
			// issue 386
			var draggable = $(this).data("ui-draggable") || $(this).data("draggable"),
				sourceNode = ui.helper.data("dtSourceNode") || null,
				prevTargetNode = ui.helper.data("dtTargetNode") || null,
				targetNode = $.ui.dynatree.getNode(event.target);
//			logMsg("$.ui.dynatree.getNode(%o): %s", event.target, targetNode);
//			logMsg("connectToDynatree.drag: helper: %o", ui.helper[0]);
			if(event.target && !targetNode){
				// We got a drag event, but the targetNode could not be found
				// at the event location. This may happen,
				// 1. if the mouse jumped over the drag helper,
				// 2. or if non-dynatree element is dragged
				// We ignore it:
				var isHelper = $(event.target).closest("div.dynatree-drag-helper,#dynatree-drop-marker").length > 0;
				if(isHelper){
//					logMsg("Drag event over helper: ignored.");
					return;
				}
			}
//			logMsg("draggable-connectToDynatree.drag: targetNode(from event): %s, dtTargetNode: %s", targetNode, ui.helper.data("dtTargetNode"));
			ui.helper.data("dtTargetNode", targetNode);
			// Leaving a tree node
			if(prevTargetNode && prevTargetNode !== targetNode ) {
				prevTargetNode.tree._onDragEvent("leave", prevTargetNode, sourceNode, event, ui, draggable);
			}
			if(targetNode){
				if(!targetNode.tree.options.dnd.onDrop) {
					// not enabled as drop target
//					noop(); // Keep JSLint happy
				} else if(targetNode === prevTargetNode) {
					// Moving over same node
					targetNode.tree._onDragEvent("over", targetNode, sourceNode, event, ui, draggable);
				}else{
					// Entering this node first time
					targetNode.tree._onDragEvent("enter", targetNode, sourceNode, event, ui, draggable);
				}
			}
			// else go ahead with standard event handling
		},
		stop: function(event, ui) {
			// issue 386
			var draggable = $(this).data("ui-draggable") || $(this).data("draggable"),
				sourceNode = ui.helper.data("dtSourceNode") || null,
				targetNode = ui.helper.data("dtTargetNode") || null,
				mouseDownEvent = draggable._mouseDownEvent,
				eventType = event.type,
				dropped = (eventType == "mouseup" && event.which == 1);
			logMsg("draggable-connectToDynatree.stop: targetNode(from event): %s, dtTargetNode: %s", targetNode, ui.helper.data("dtTargetNode"));
//			logMsg("draggable-connectToDynatree.stop, %s", sourceNode);
//			logMsg("    type: %o, downEvent: %o, upEvent: %o", eventType, mouseDownEvent, event);
//			logMsg("    targetNode: %o", targetNode);
			if(!dropped){
				logMsg("Drag was cancelled");
			}
			if(targetNode) {
				if(dropped){
					targetNode.tree._onDragEvent("drop", targetNode, sourceNode, event, ui, draggable);
				}
				targetNode.tree._onDragEvent("leave", targetNode, sourceNode, event, ui, draggable);
			}
			if(sourceNode){
				sourceNode.tree._onDragEvent("stop", sourceNode, null, event, ui, draggable);
			}
		}
	});
	didRegisterDnd = true;
};

// ---------------------------------------------------------------------------
}(jQuery));
