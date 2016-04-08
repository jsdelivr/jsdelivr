/**
 * jquery.layout.state 1.2
 * $Date: 2014-08-30 08:00:00 (Sat, 30 Aug 2014) $
 *
 * Copyright (c) 2014 
 *   Kevin Dalman (http://allpro.net)
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * @requires: UI Layout 1.4.0 or higher
 * @requires: $.ui.cookie (above)
 *
 * @see: http://groups.google.com/group/jquery-ui-layout
 */

// NOTE: For best readability, view with a fixed-width font and tabs equal to 4-chars
;(function ($) {

if (!$.layout) return;


/**
 *	UI COOKIE UTILITY
 *
 *	A $.cookie OR $.ui.cookie namespace *should be standard*, but until then...
 *	This creates $.ui.cookie so Layout does not need the cookie.jquery.js plugin
 *	NOTE: This utility is REQUIRED by the layout.state plugin
 *
 *	Cookie methods in Layout are created as part of State Management 
 */
if (!$.ui) $.ui = {};
$.ui.cookie = {

	// cookieEnabled is not in DOM specs, but DOES works in all browsers,including IE6
	acceptsCookies: !!navigator.cookieEnabled

,	read: function (name) {
		var
			c	= document.cookie
		,	cs	= c ? c.split(';') : []
		,	pair, data, i
		;
		for (i=0; pair=cs[i]; i++) {
			data = $.trim(pair).split('='); // name=value => [ name, value ]
			if (data[0] == name) // found the layout cookie
				return decodeURIComponent(data[1]);
		}
		return null;
	}

,	write: function (name, val, cookieOpts) {
		var	params	= ""
		,	date	= ""
		,	clear	= false
		,	o		= cookieOpts || {}
		,	x		= o.expires  || null
		,	t		= $.type(x)
		;
		if (t === "date")
			date = x;
		else if (t === "string" && x > 0) {
			x = parseInt(x,10);
			t = "number";
		}
		if (t === "number") {
			date = new Date();
			if (x > 0)
				date.setDate(date.getDate() + x);
			else {
				date.setFullYear(1970);
				clear = true;
			}
		}
		if (date)		params += ";expires="+ date.toUTCString();
		if (o.path)		params += ";path="+ o.path;
		if (o.domain)	params += ";domain="+ o.domain;
		if (o.secure)	params += ";secure";
		document.cookie = name +"="+ (clear ? "" : encodeURIComponent( val )) + params; // write or clear cookie
	}

,	clear: function (name) {
		$.ui.cookie.write(name, "", {expires: -1});
	}

};
// if cookie.jquery.js is not loaded, create an alias to replicate it
// this may be useful to other plugins or code dependent on that plugin
if (!$.cookie) $.cookie = function (k, v, o) {
	var C = $.ui.cookie;
	if (v === null)
		C.clear(k);
	else if (v === undefined)
		return C.read(k);
	else
		C.write(k, v, o);
};



/**
 *	State-management options stored in options.stateManagement, which includes a .cookie hash
 *	Default options saves ALL KEYS for ALL PANES, ie: pane.size, pane.isClosed, pane.isHidden
 *
 *	// STATE/COOKIE OPTIONS
 *	@example $(el).layout({
				stateManagement: {
					enabled:	true
				,	stateKeys:	"east.size,west.size,east.isClosed,west.isClosed"
				,	cookie:		{ name: "appLayout", path: "/" }
				}
			})
 *	@example $(el).layout({ stateManagement__enabled: true }) // enable auto-state-management using cookies
 *	@example $(el).layout({ stateManagement__cookie: { name: "appLayout", path: "/" } })
 *	@example $(el).layout({ stateManagement__cookie__name: "appLayout", stateManagement__cookie__path: "/" })
 *
 *	// STATE/COOKIE METHODS
 *	@example myLayout.saveCookie( "west.isClosed,north.size,south.isHidden", {expires: 7} );
 *	@example myLayout.loadCookie();
 *	@example myLayout.deleteCookie();
 *	@example var JSON = myLayout.readState();	// CURRENT Layout State
 *	@example var JSON = myLayout.readCookie();	// SAVED Layout State (from cookie)
 *	@example var JSON = myLayout.state.stateData;	// LAST LOADED Layout State (cookie saved in layout.state hash)
 *
 *	CUSTOM STATE-MANAGEMENT (eg, saved in a database)
 *	@example var JSON = myLayout.readState( "west.isClosed,north.size,south.isHidden" );
 *	@example myLayout.loadState( JSON );
 */

// tell Layout that the state plugin is available
$.layout.plugins.stateManagement = true;

//	Add State-Management options to layout.defaults
$.layout.defaults.stateManagement = {
	enabled:		false	// true = enable state-management, even if not using cookies
,	autoSave:		true	// Save a state-cookie when page exits?
,	autoLoad:		true	// Load the state-cookie when Layout inits?
,	animateLoad:	true	// animate panes when loading state into an active layout
,	includeChildren: true	// recurse into child layouts to include their state as well
	// List state-data to save - must be pane-specific
,	stateKeys:	"north.size,south.size,east.size,west.size,"+
				"north.isClosed,south.isClosed,east.isClosed,west.isClosed,"+
				"north.isHidden,south.isHidden,east.isHidden,west.isHidden"
,	cookie: {
		name:	""	// If not specified, will use Layout.name, else just "Layout"
	,	domain:	""	// blank = current domain
	,	path:	""	// blank = current page, "/" = entire website
	,	expires: ""	// 'days' to keep cookie - leave blank for 'session cookie'
	,	secure:	false
	}
};

// Set stateManagement as a 'layout-option', NOT a 'pane-option'
$.layout.optionsMap.layout.push("stateManagement");
// Update config so layout does not move options into the pane-default branch (panes)
$.layout.config.optionRootKeys.push("stateManagement");

/*
 *	State Management methods
 */
$.layout.state = {

	/**
	 * Get the current layout state and save it to a cookie
	 *
	 * myLayout.saveCookie( keys, cookieOpts )
	 *
	 * @param {Object}			inst
	 * @param {(string|Array)=}	keys
	 * @param {Object=}			cookieOpts
	 */
	saveCookie: function (inst, keys, cookieOpts) {
		var o	= inst.options
		,	sm	= o.stateManagement
		,	oC	= $.extend(true, {}, sm.cookie, cookieOpts || null)
		,	data = inst.state.stateData = inst.readState( keys || sm.stateKeys ) // read current panes-state
		;
		$.ui.cookie.write( oC.name || o.name || "Layout", $.layout.state.encodeJSON(data), oC );
		return $.extend(true, {}, data); // return COPY of state.stateData data
	}

	/**
	 * Remove the state cookie
	 *
	 * @param {Object}	inst
	 */
,	deleteCookie: function (inst) {
		var o = inst.options;
		$.ui.cookie.clear( o.stateManagement.cookie.name || o.name || "Layout" );
	}

	/**
	 * Read & return data from the cookie - as JSON
	 *
	 * @param {Object}	inst
	 */
,	readCookie: function (inst) {
		var o = inst.options;
		var c = $.ui.cookie.read( o.stateManagement.cookie.name || o.name || "Layout" );
		// convert cookie string back to a hash and return it
		return c ? $.layout.state.decodeJSON(c) : {};
	}

	/**
	 * Get data from the cookie and USE IT to loadState
	 *
	 * @param {Object}	inst
	 */
,	loadCookie: function (inst) {
		var c = $.layout.state.readCookie(inst); // READ the cookie
		if (c && !$.isEmptyObject( c )) {
			inst.state.stateData = $.extend(true, {}, c); // SET state.stateData
			inst.loadState(c); // LOAD the retrieved state
		}
		return c;
	}

	/**
	 * Update layout options from the cookie, if one exists
	 *
	 * @param {Object}		inst
	 * @param {Object=}		stateData
	 * @param {boolean=}	animate
	 */
,	loadState: function (inst, data, opts) {
		if (!$.isPlainObject( data ) || $.isEmptyObject( data )) return;

		// normalize data & cache in the state object
		data = inst.state.stateData = $.layout.transformData( data ); // panes = default subkey

		// add missing/default state-restore options
		var smo = inst.options.stateManagement;
		opts = $.extend({
			animateLoad:		false //smo.animateLoad
		,	includeChildren:	smo.includeChildren
		}, opts );

		if (!inst.state.initialized) {
			/*
			 *	layout NOT initialized, so just update its options
			 */
			// MUST remove pane.children keys before applying to options
			// use a copy so we don't remove keys from original data
			var o = $.extend(true, {}, data);
			//delete o.center; // center has no state-data - only children
			$.each($.layout.config.allPanes, function (idx, pane) {
				if (o[pane]) delete o[pane].children;		   
			 });
			// update CURRENT layout-options with saved state data
			$.extend(true, inst.options, o);
		}
		else {
			/*
			 *	layout already initialized, so modify layout's configuration
			 */
			var noAnimate = !opts.animateLoad
			,	o, c, h, state, open
			;
			$.each($.layout.config.borderPanes, function (idx, pane) {
				o = data[ pane ];
				if (!$.isPlainObject( o )) return; // no key, skip pane

				s	= o.size;
				c	= o.initClosed;
				h	= o.initHidden;
				ar	= o.autoResize
				state	= inst.state[pane];
				open	= state.isVisible;

				// reset autoResize
				if (ar)
					state.autoResize = ar;
				// resize BEFORE opening
				if (!open)
					inst._sizePane(pane, s, false, false, false); // false=skipCallback/noAnimation/forceResize
				// open/close as necessary - DO NOT CHANGE THIS ORDER!
				if (h === true)			inst.hide(pane, noAnimate);
				else if (c === true)	inst.close(pane, false, noAnimate);
				else if (c === false)	inst.open (pane, false, noAnimate);
				else if (h === false)	inst.show (pane, false, noAnimate);
				// resize AFTER any other actions
				if (open)
					inst._sizePane(pane, s, false, false, noAnimate); // animate resize if option passed
			});

			/*
			 *	RECURSE INTO CHILD-LAYOUTS
			 */
			if (opts.includeChildren) {
				var paneStateChildren, childState;
				$.each(inst.children, function (pane, paneChildren) {
					paneStateChildren = data[pane] ? data[pane].children : 0;
					if (paneStateChildren && paneChildren) {
						$.each(paneChildren, function (stateKey, child) {
							childState = paneStateChildren[stateKey];
							if (child && childState)
								child.loadState( childState );
						});
					}
				});
			}
		}
	}

	/**
	 * Get the *current layout state* and return it as a hash
	 *
	 * @param {Object=}		inst	// Layout instance to get state for
	 * @param {object=}		[opts]	// State-Managements override options
	 */
,	readState: function (inst, opts) {
		// backward compatility
		if ($.type(opts) === 'string') opts = { keys: opts };
		if (!opts) opts = {};
		var	sm		= inst.options.stateManagement
		,	ic		= opts.includeChildren
		,	recurse	= ic !== undefined ? ic : sm.includeChildren
		,	keys	= opts.stateKeys || sm.stateKeys
		,	alt		= { isClosed: 'initClosed', isHidden: 'initHidden' }
		,	state	= inst.state
		,	panes	= $.layout.config.allPanes
		,	data	= {}
		,	pair, pane, key, val
		,	ps, pC, child, array, count, branch
		;
		if ($.isArray(keys)) keys = keys.join(",");
		// convert keys to an array and change delimiters from '__' to '.'
		keys = keys.replace(/__/g, ".").split(',');
		// loop keys and create a data hash
		for (var i=0, n=keys.length; i < n; i++) {
			pair = keys[i].split(".");
			pane = pair[0];
			key  = pair[1];
			if ($.inArray(pane, panes) < 0) continue; // bad pane!
			val = state[ pane ][ key ];
			if (val == undefined) continue;
			if (key=="isClosed" && state[pane]["isSliding"])
				val = true; // if sliding, then *really* isClosed
			( data[pane] || (data[pane]={}) )[ alt[key] ? alt[key] : key ] = val;
		}

		// recurse into the child-layouts for each pane
		if (recurse) {
			$.each(panes, function (idx, pane) {
				pC = inst.children[pane];
				ps = state.stateData[pane];
				if ($.isPlainObject( pC ) && !$.isEmptyObject( pC )) {
					// ensure a key exists for this 'pane', eg: branch = data.center
					branch = data[pane] || (data[pane] = {});
					if (!branch.children) branch.children = {};
					$.each( pC, function (key, child) {
						// ONLY read state from an initialize layout
						if ( child.state.initialized )
							branch.children[ key ] = $.layout.state.readState( child );
						// if we have PREVIOUS (onLoad) state for this child-layout, KEEP IT!
						else if ( ps && ps.children && ps.children[ key ] ) {
							branch.children[ key ] = $.extend(true, {}, ps.children[ key ] );
						}
					});
				}
			});
		}

		return data;
	}

	/**
	 *	Stringify a JSON hash so can save in a cookie or db-field
	 */
,	encodeJSON: function (json) {
		var local = window.JSON || {};
		return (local.stringify || stringify)(json);

		function stringify (h) {
			var D=[], i=0, k, v, t // k = key, v = value
			,	a = $.isArray(h)
			;
			for (k in h) {
				v = h[k];
				t = typeof v;
				if (t == 'string')		// STRING - add quotes
					v = '"'+ v +'"';
				else if (t == 'object')	// SUB-KEY - recurse into it
					v = parse(v);
				D[i++] = (!a ? '"'+ k +'":' : '') + v;
			}
			return (a ? '[' : '{') + D.join(',') + (a ? ']' : '}');
		};
	}

	/**
	 *	Convert stringified JSON back to a hash object
	 *	@see		$.parseJSON(), adding in jQuery 1.4.1
	 */
,	decodeJSON: function (str) {
		try { return $.parseJSON ? $.parseJSON(str) : window["eval"]("("+ str +")") || {}; }
		catch (e) { return {}; }
	}


,	_create: function (inst) {
		var s	= $.layout.state
		,	o	= inst.options
		,	sm	= o.stateManagement
		;
		//	ADD State-Management plugin methods to inst
		 $.extend( inst, {
		//	readCookie - update options from cookie - returns hash of cookie data
			readCookie:		function () { return s.readCookie(inst); }
		//	deleteCookie
		,	deleteCookie:	function () { s.deleteCookie(inst); }
		//	saveCookie - optionally pass keys-list and cookie-options (hash)
		,	saveCookie:		function (keys, cookieOpts) { return s.saveCookie(inst, keys, cookieOpts); }
		//	loadCookie - readCookie and use to loadState() - returns hash of cookie data
		,	loadCookie:		function () { return s.loadCookie(inst); }
		//	loadState - pass a hash of state to use to update options
		,	loadState:		function (stateData, opts) { s.loadState(inst, stateData, opts); }
		//	readState - returns hash of current layout-state
		,	readState:		function (keys) { return s.readState(inst, keys); }
		//	add JSON utility methods too...
		,	encodeJSON:		s.encodeJSON
		,	decodeJSON:		s.decodeJSON
		});

		// init state.stateData key, even if plugin is initially disabled
		inst.state.stateData = {};

		// autoLoad MUST BE one of: data-array, data-hash, callback-function, or TRUE
		if ( !sm.autoLoad ) return;

		//	When state-data exists in the autoLoad key USE IT,
		//	even if stateManagement.enabled == false
		if ($.isPlainObject( sm.autoLoad )) {
			if (!$.isEmptyObject( sm.autoLoad )) {
				inst.loadState( sm.autoLoad );
			}
		}
		else if ( sm.enabled ) {
			// update the options from cookie or callback
			// if options is a function, call it to get stateData
			if ($.isFunction( sm.autoLoad )) {
				var d = {};
				try {
					d = sm.autoLoad( inst, inst.state, inst.options, inst.options.name || '' ); // try to get data from fn
				} catch (e) {}
				if (d && $.isPlainObject( d ) && !$.isEmptyObject( d ))
					inst.loadState(d);
			}
			else // any other truthy value will trigger loadCookie
				inst.loadCookie();
		}
	}

,	_unload: function (inst) {
		var sm = inst.options.stateManagement;
		if (sm.enabled && sm.autoSave) {
			// if options is a function, call it to save the stateData
			if ($.isFunction( sm.autoSave )) {
				try {
					sm.autoSave( inst, inst.state, inst.options, inst.options.name || '' ); // try to get data from fn
				} catch (e) {}
			}
			else // any truthy value will trigger saveCookie
				inst.saveCookie();
		}
	}

};

// add state initialization method to Layout's onCreate array of functions
$.layout.onCreate.push( $.layout.state._create );
$.layout.onUnload.push( $.layout.state._unload );

})( jQuery );