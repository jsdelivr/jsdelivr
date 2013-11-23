/**
 * Eve.js <evejs.com> - v0.8.4 February 18, 2013
 *
 *	   A JavaScript meta-framework for scoped event delegation.
 *
 * Copyright (c) 2012 Michelle Steigerwalt, http://evejs.com/
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function(ns) {

var _registry = {}, _scopes = {}, _attachments = {}, _extensions = {},
    _debugging = [], _debugAll = false, _framework, _dom;

//Detects the current JavaScript framework.
function detectFramework() {

	if (_framework) return _framework;

	var fws = ['jQuery', 'MooTools', 'YUI', 'Prototype', 'dojo'];
	for (var i = 0; i<= fws.length; i++) {
		if (window[fws[i]]) {
			Eve.setFramework(fws[i]);
			return fws[i];
		}
	} console.error("Eve doesn't support your JavaScript framework.");

};

//Either matches the chosen JS framework to the passed guess, or returns the
//current framework.
function using(guess) {
	var fw = _framework || detectFramework();
	return (guess) ? (_framework == guess.toLowerCase()) : _framework;
};

function dbug(name, message) {
		if (!window.console) { return; }
		var debug = _debugAll;
		if (!_debugAll) {
			debug = false;
			for (var i = 0; i<_debugging.length; i++) {
				if (_debugging[i]==name) debug = true;
			}
		}
		if (!debug) { return; }
		while (name.length<10) { name=name+' '; }
		name = name.substring(0, 10)+" - ";
		console.info(name, message);
};

function bindToScope(fun, obj, reg, name) {

	for (var k in Scope) obj[k] = Scope[k];
	for (k in _extensions) obj[k] = _extensions[k];

	if (using("YUI")) {
		YUI().use('node', function(Y) {
			_dom  = Y.one;
			reg[name] = fun.apply(obj);
		});
	} else if (using("dojo")) {
		require(["dojo/NodeList-dom", "dojo/NodeList-traverse"], function(dom){
			_dom  = dom;
			reg[name] = fun.apply(obj);
		});
	} else {
		reg[name] = fun.apply(obj);
	}

};

//The primary Eve API.
ns.Eve = {

	setFramework: function(fw) {
		_framework = (fw+"").toLowerCase();
		if (_framework=='jquery') $ = jQuery; //No-conflict compat.
	},

	debug: function(moduleName) {
		if (moduleName) {
			_debugging.push(moduleName);
		} else {
			_debugAll = true;
		}
	},

	register: function(name, obj) {
		dbug(name, "registered");
		if (_registry[name]) {
			throw new Error("Module already exists: "+name);
		}
		_registry[name] = obj;
		return this;
	},

	extend: function(key, fun) {
		_extensions[key] = fun;
	},

	scope: function(ns, fun) {
		if (_scopes[ns]) {
			console.warn("Duplicate namespace: "+ns);
		}
		bindToScope(fun, {
			name: ns,
			namespace: ns
		}, _scopes, ns);
	},

	attach: function(moduleName, namespace) {
		var fun, args = [], i=0;
		for (i;i<arguments.length;i++) args[args.length] = arguments[i];
		fun = function() { _registry[moduleName].apply(this, args.slice(2)); }
		dbug(moduleName, "attached to "+namespace);
		//We're delegating off the window, so there's no need to reattach for
		//multiple instances of a single given module.
		if (_attachments[moduleName+namespace]) {
			return false;
		}
		if (!_registry[moduleName]) {
			console.warn("Module not found: "+moduleName);
			return false;
		}
		var mod = bindToScope(fun, {
			namespace:namespace,
			name:moduleName
		}, _attachments, moduleName+namespace);
		return true;
	}

};

var Scope = {

	listen: function(selector, event, handler) {

		//There's a special hell for putting optional parameters at the
		//beginning.  A special and awesome hell.
		if (!handler) {
			handler = event;
			event = selector;
			selector = '';
		}
		selector = selector || '';

		//If listen is happening in the context of a triggered event handler,
		//we only want to delegate to the current event namespace.
		var scope = (this.event) ? this.find() : document.body;

		var name = this.name,
			sel	 = (this.namespace+' '+selector).trim(),
			obj  = { };
			for (var k in this) if (this.hasOwnProperty(k))	obj[k] = this[k];
			function fun(e,t) {
				dbug(name, sel+':'+event);
				obj.event = e;
				if (using("MooTools")) { e.target = t; }
				if (using("jQuery"))   { e.target = e.currentTarget; }
				if (using("dojo"))     { e.target = e.explicitOriginalTarget; }
				handler.apply(obj, arguments);
			};

		//JavaScript framework development is so much easier when you let some
		//other framework do most of the work.
		if (using("jQuery")) {
			$(scope).delegate(sel, event, fun);
		} else if (using('MooTools')) {
			//I really hate the MooTools event delegation syntax.
			$(scope).addEvent(event+':relay('+sel+')', fun);
		} else if (using("YUI")) {
			_dom(scope).delegate(event, fun, sel);
		} else if (using("Prototype")) {
			$(scope).on(event, sel, fun);
		} else if (using("dojo")) {
			require(["dojo/on"], function(on){
				on(scope, sel+':'+event, fun);
			});
		}

	},

	find: function(sel) {
		var scope, ns = this.namespace;
		if (!sel || typeof(sel)=='string') { sel = (sel || '').trim(); }
		//Scope to the particular instance of the DOM module active in this
		//event.
		var t  = (this.event) ? this.event.target : document.body;
		if (using('jQuery')) t = jQuery(t);
		if (_dom) t = _dom(t);
		var map = {
			jQuery: ['is', 'parents', 'find'],
			MooTools: ['match', 'getParent', 'getElements'],
			Prototype: ['match', 'up', 'select'],
			YUI: ['test', 'ancestor', 'all'],
			dojo: ['', 'closest', 'query']
		};
		for (var fw in map) {
			if (!using(fw)) continue;
			var m = map[fw], match = m[0], up = m[1], all = m[2];
			if (!using('dojo')&&t[match](ns)) return t;
			scope  = (this.event) ? t[up](ns) : t;
			return (this.event) ? scope[all](sel) : scope[all](ns+' '+sel);
		}
	},

	first: function(sel,result) {
		result = (arguments.length==2) ? result : this.find(sel);
		if (using('YUI')) result = result.getDOMNodes();
		return result[0];
	},

	//Yo dawg...
	scope: function(ns, fun) {
		Eve.scope(this.namespace+' '+ns, fun);
	},

	attach: function(moduleName, ns) {
		Eve.attach(moduleName, this.namespace+' '+(ns||''));
	}

};

})(this);
if (this.module) this.module.exports = this.Eve;
