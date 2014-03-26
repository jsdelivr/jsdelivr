YUI.add('gallery-markout', function(Y) {

/*!
 * MarkoutJS - An API for creating DOM nodes in JavaScript
 * 
 * Oddnut Software - http://oddnut.com/markout/
 * Copyright (c) 2009-2011 Eric Ferraiuolo and David Fogel
 * YUI BSD - http://developer.yahoo.com/yui/license.html
 */

var MarkoutNode,

	STYLE			= 'style',
	
	doc				= Y.config.doc,
	
	YLang			= Y.Lang,
	isObject		= YLang.isObject,
	isString		= YLang.isString,
	
	YDOM			= Y.DOM,
	setAttribute	= YDOM.setAttribute,
	setStyles		= YDOM.setStyles;

// *** Markout *** //

(function(global, document){

	var Markout,

		OBJECT			= 'object',
		STRING			= 'string',
		ARRAY_OBJECT	= '[object Array]',
		SPACE			= ' ',
		
		FOR				= 'for',
		HTML_FOR		= 'htmlFor',
		CLASS			= 'class',
		CLASS_NAME		= 'className',
		CUSTOM_ATTRS	= {}, 
		
		domNode			= document.createElement('div'),

		toString		= Object.prototype.toString,
		slice			= Array.prototype.slice,
		owns			= function(o, k){ return o && o.hasOwnProperty && o.hasOwnProperty(k); },
		isObject		= function(o){ return ( o && typeof o === OBJECT ); },
		isString		= function(o){ return typeof o === STRING; },
		isArray			= function(o){ return toString.call(o) === ARRAY_OBJECT; };
	
	Markout = function () {
		
		// make the constructor an optional factory
		var self = this;
		if ( ! (self && self.hasOwnProperty && (self instanceof Markout))) {
			self = new Markout();
		}
		self._init.apply(self, arguments);
		return self;
	};
	
	Markout.prototype = {
	
		// explicity set constructor and allow extension
		constructor : Markout,

		_init : function (container) {

			// check that container is an Element or DocumentFragment Node
			if (container && (container.nodeType === 1 || container.nodeType === 11)) {
				this._node = container;
			} else {
				this._node = document.createDocumentFragment();
			}
		},
		
		toHTML : function () {
			
			var tmpNode;
			
			if (domNode.outerHTML) {
				return this._node.outerHTML;
			} else {
				tmpNode = document.createDocumentFragment();
				tmpNode.appendChild(this._node.cloneNode(true));
				return tmpNode.innerHTML;
			}
		},
				
		node : function () {
			
			return this._node;
		},
		
		getDOMNode : function() {
			
			return this._node;
		},
		
		html : function (html) {
			
			if (isString(html)) {
				this._node.innerHTML = html;
				return this;
			}
			
			return this._node.innerHTML;
		},
		
		el : function () {
			
			var args	= slice.call(arguments, 0),
				element	= args[0],
				attrs	= args[1] && isObject(args[1]) ? args[1] : null,
				text	= ! attrs && args[1] && isString(args[1]) ? args[1] : args[2],
				child;
			
			if ( ! element) { return this; }

			// create a new Element Node or use the one passed
			if (isString(element)) {
				element = document.createElement(element);
			}
			
			// we need something valid here
			if ( ! (element && element.nodeType === 1)) { return this; } // weird? should throw error?
			
			// create a new Markout instance with the element as the container
			child = new this.constructor(element);
			if (attrs) { child.attrs(attrs); }
			if (text) { child.text(text); }
			this._node.appendChild(child._node);
			return child;
		},
		
		attrs : function (attrs) {
			
			attrs = attrs || {};
			
			var CUSTOM_ATTRS	= Markout.CUSTOM_ATTRS,
				node			= this._node,
				attr;
			
			if ( ! node) { return; }
			
			for (attr in attrs) {
				attr = CUSTOM_ATTRS[attr] || attr;
				if (owns(attrs, attr)) {
					node.setAttribute(attr, attrs[attr]);
				}
			}
		},
		
		text : function () {
			
			var args		= slice.call(arguments, 0),
				text		= (isArray(args[0]) ? args[0] : args).join(''),
				textNode	= text ? document.createTextNode(text) : null;
			
			// append the Text Node to the container
			if (textNode) {
				this._node.appendChild(textNode);
			}
			return textNode;
		},
		
		space : function () {
			
			return this.text(SPACE);
		}
		
	};
	
	if ( ! document.documentElement.hasAttribute) { // IE < 8
		CUSTOM_ATTRS[ FOR ]			= HTML_FOR;
		CUSTOM_ATTRS[ CLASS ]		= CLASS_NAME;
	} else { // W3C
		CUSTOM_ATTRS[ HTML_FOR ]	= FOR;
		CUSTOM_ATTRS[ CLASS_NAME ]	= CLASS;
	}
	
	Markout.CUSTOM_ATTRS = CUSTOM_ATTRS;
	
	Markout.addElMethod = function (tag) {
		
		Markout.prototype[tag] = function(){
			var args = slice.call(arguments, 0);
			args.unshift(tag);
			return this.el.apply(this, args);
		};
	};

	(function(){
		
		var addElMethod = Markout.addElMethod,
			tags, i, len;

		tags = (
			'a abbr acronym address area article aside audio ' +
			'b base bdi bdo big blockquote body br button ' +
			'canvas caption cite code col colgroup command ' + 
			'datalist dd del details device dfn div dl dt ' + 
			'em embed ' +
			'fieldset figcaption figure footer form ' +
			'h1 h2 h3 h4 h5 h6 head header hgroup hr ' +
			'i iframe img input ins ' +
			'kbd keygen ' + 
			'label legend li link ' +
			'map mark menu meta meter ' +
			'nav noscript ' +
			'object ol optgroup option ' +
			'p param pre progress ' +
			'q ' +
			'rp rt ruby ' + 
			's samp script section select small source span strong style sub summary sup ' +
			'table tbody td textarea tfoot th thread time title tr track tt ' +
			'ul ' + 
			'var video ' +
			'wbr'
		).split(SPACE);

		for (i = 0, len = tags.length; i < len; i++) {
			addElMethod(tags[i]);
		}

	}());
	
	global.Markout = Markout;

}(Y, doc));

// *** MarkoutNode *** //
	
MarkoutNode = function () {
	
	// make the constructor an optional factory
	var self = this;
	if ( ! Y.instanceOf(self, MarkoutNode)) {
		self = new MarkoutNode();
	}
	self._init.apply(self, arguments);
	return self;
};

Y.extend(MarkoutNode, Y.Markout, {
	
	_init : function (container) {
		
		if (isString(container)) {
			container = Y.Selector.query(container, doc, true);
		} else if (Y.instanceOf(container, Y.Node)) {
			this._ynode = container;
			container = Y.Node.getDOMNode(container);
		}
		
		MarkoutNode.superclass._init.call(this, container);
	},
	
	node : function () {
	
		return ( this._ynode ? this._ynode : this._ynode = Y.one(this._node) );
	},
	
	getNode : function () {
		
		return this.node();
	},
	
	attrs : function (attrs) {
			
		attrs = attrs || {};
		var node = this._node;
		
		Y.each(attrs, function(v, k){
			if (k === STYLE && isObject(v)) {
				setStyles(node, v);
			} else {
				setAttribute(node, k, v);
			}
		});
	}
	
}, { NAME: 'markout' });

// *** Namespace *** //

Y._Markout	= Y.Markout;
Y.Markout	= MarkoutNode;


}, 'gallery-2011.02.02-21-07' ,{requires:['dom-style','selector','node-base']});
