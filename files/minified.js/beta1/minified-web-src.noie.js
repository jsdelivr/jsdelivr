/*
 * Minified-web.js - Complete library for JavaScript interaction in less than 4kb
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 * 
 * Contains code based on https://github.com/douglascrockford/JSON-js (also Public Domain).
 *
 * https://github.com/timjansen/minified.js
 */

/*
 * When you read this code, please keep in mind that it is optimized to produce small and gzip'able code
 * after being minimized with Closure (http://closure-compiler.appspot.com). Run-time performance and readability
 * should be acceptable, but are not a primary concern.
 *
 * 
 * Various comment annotations control the builder in parser-src.js / builder-src.js. This file should always work without the builder,
 * but only the builder allows you to remove functions.
 * 
 * Here's a short summary of that the non-documenting tags mean.
 * 
 * Multi-Line Comments:
 * - @id marks the beginning of an optional block. It ends with the next @id block, or the next @stop comment.
 * - @requires defines the ids that the current block depends on. They will always be available.
 * - @configurable the block can be selected in the GUI. If the value is 'default', it is a enabled by default. If it is 'optional', it is not.
 * - @dependency if set, the block is only used as a dependency and won't show up in builder or documentation
 * - @name a name for builder and reference docs
 * - @doc if 'no', the section will not be displayed in reference docs, only in builder
 * - @module the module(s), comma-separated. Can be WEB, UTIL or APP
 * 
 * Single-Line Comments
 * - @cond id defines that the code following after the id will be included if the block id is enabled 
 * - @cond !id include the following line only if the block id is disabled
 * - @condblock id will include all following lines if id is enabled until the next @condend. @condblocks can be nested.
 * - @condend ends a @condblock 
 */

// ==ClosureCompiler==
// @output_file_name minified.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// ==/ClosureCompiler==

/*$
 * @id require
 * @name require()
 * @syntax require(name)
 * @group OPTIONS
 * @module WEB, UTIL, APP
 * Returns a reference to a module. If you do not use an AMD loader to load Minified, just call <var>require()</var> with the
 * argument 'minified' to get a reference to Minified.
 * If you do use an AMD loader, Minified will not define this function and you can use the AMD loader to obtain the
 * reference to Minified.
 * Minified's version of <var>require</var> is very simple and will only support Minified, but <strong>no other libraries</strong>. You can not
 * use it to load other modules, and it will be incompatible with all non-AMD libraries that also define a function
 * of the same name. If you need to work with several libraries, you need a real AMD loader.
 * 
 * @param name the name of the module to request. In Minified's implementation, only 'minified' is supported.
 * @return the reference to Minified if 'minified' had been used as name. <var>undefined</var> otherwise.
 */

/*$
 * @id amdsupport
 * @name AMD support
 * @configurable default
 * @group OPTIONS
 * @doc no
 * @module WEB, UTIL
 * If enabled, Minified will work correctly with AMD frameworks. If not, it will just provide a global 
 * function ##require(), which can be used only to load 'minified'.
 */
if (/^u/.test(typeof define)) { // no AMD support available ? define a minimal version
	var def = {};
	this['define'] = function(name, f) {def[name] = f();};
	this['require'] = function(name) { return def[name]; }; 
}

define('minified', function() {
/*$
 * @stop
 */
// @cond !amdsupport (function() {

	//// GLOBAL VARIABLES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * @const
	 */
	var _window = this;

	/**
	 * @const
	 */
	var _document = document;

	/**
	 * @const
	 * @type {!string}
	 */
	var BACKSLASHB = '\\b';
	/** @const */
	var undef;

	var PUSH = [].push;

    /*$
	 * @id ready_vars
	 * @dependency
     */
    /** @type {!Array.<function()>} */
    var DOMREADY_HANDLER = [];

    /*$
     * @id animation_vars
     * @dependency
     */
     /** @type {!Array.<{c:!function(), t:!number, s:!function()}>} */
	var ANIMATION_HANDLERS = []; // global list of {c: <callback function>, t: <timestamp>, s:<stop function>} currently active

	/** @type {!function()} */
	var REQUEST_ANIMATION_FRAME = _window['requestAnimationFrame'] || function(callback) {
		delay(callback, 33); // 30 fps as fallback
	};

	/*$
	 * @id fadeslide
	 * @requires animate set 
	 * @group ANIMATION
	 * @configurable default
	 * @doc no
	 * @name Support for $$fade and $$slide
	 */
	/*$
	 * @stop
	 */

	//// GLOBAL FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/** @param s {?} */
	function toString(s) { // wrapper for Closure optimization
		return s!=null ? ''+s : '';
	}
	/**
	 * @param s {?}
	 * @param o {string}
	 */
	function isType(s,o) {
		return typeof s == o;
	}
	/** @param s {?} */
	function isString(s) {
		return isType(s, 'string');
	}
	function isFunction(f) {
		return isType(f, 'function') && !f['item']; // item check as work-around webkit bug 14547
	}
	function isObject(f) {
		return isType(f, 'object');
	}
	function isNode(n) {
		return n && n['nodeType'];
	}
	function isList(v) {
		return v && v.length != null && !isString(v) && !isNode(v) && !isFunction(v);
	}
	function eachObj(obj, cb) {
		for (var n in obj)
			if (obj.hasOwnProperty(n))
				cb(n, obj[n]);
		return obj;
	}
	function each(list, cb) {
		for (var i = 0; list && i < list.length; i++)
			cb(list[i], i);
		return list;
	}
	function filter(list, filterFunc) {
		var r = []; 
		each(list, function(node,index) {
			if (filterFunc(node,index))
				r.push(node);
		});
		return r;
	}
	function collect(obj, collectFunc) {
		var result = [];
		each(obj, function (a, b) {
			if (isList(a = collectFunc(a, b))) // caution: extreme variable re-using of 'a'
				each(a, function(rr) { result.push(rr); });
			else if (a != null)
				result.push(a);
		});
		return result;
	}
	function collectObj(obj, collectFunc) { // warning: 1:1 copy of collect(), with one diff... good for gzip..
		var result = [];
		eachObj(obj, function (a, b) {
			if (isList(a = collectFunc(a, b))) // caution: extreme variable re-using of 'a'
				each(a, function(rr) { result.push(rr); });
			else if (a != null)
				result.push(a);
		});
		return result;
	}
	function replace(s, regexp, sub) {
		return toString(s).replace(regexp, sub||'');
	}
	function delay(f, delayMs) {
		_window.setTimeout(f, delayMs||0);
	}
	function extractNumber(v) {
		return parseFloat(replace(v, /^[^\d-]+/));
	}

	function getNaturalHeight(elementList) {
		var q = {'$position': 'absolute', '$visibility': 'hidden', '$display': 'block', '$height': null};
		var oldStyles = elementList['get'](q);
		elementList['set'](q);
		var h = elementList['get']('$height', true);
		elementList['set'](oldStyles);
		return h;
	}

    function now() {
    	return new Date().getTime();
    }

	function callArg(f) {f();}

    // for ready()
    function triggerDomReady() {
		each(DOMREADY_HANDLER, callArg);
		DOMREADY_HANDLER = null;
    }

    function ready(handler) {
    	// @cond debug if (typeof handler != 'function') error("First argument must be a function");
    	if (DOMREADY_HANDLER)
			DOMREADY_HANDLER.push(handler);
		else
			delay(handler);
    }

    function $$(selector) {
		return dollarRaw(selector)[0];
	}

    function EE(elementName, attributes, children, onCreate) {
		// @cond debug if (!elementName) error("EE() requires the element name."); 
		// @cond debug if (/:/.test(elementName)) error("The element name can not create a colon (':').");

		return function() {
			var list = $(_document.createElement(elementName));
			(isList(attributes) || !isObject(attributes)) ? list['add'](attributes) : list['set'](attributes)['add'](children);
			if (onCreate)
				onCreate(list);
			return list; 
		};
	}

    function promise() {
    	var state;           // undefined/null = pending, true = fulfilled, false = rejected
    	var values = [];     // an array of values as arguments for the then() handlers
 		var deferred = [];   // functions to call when set() is invoked

    	var set = function (newState, newValues) {
    		if (state == null) {
	    		state = newState;
	    		values = newValues;
   				delay(function() {
   					each(deferred, callArg);
   				});
    		}
    	};
    	/*$
    	 * @id then
    	 * @group REQUEST
    	 * @name promise.then()
    	 * @syntax promise.then()
    	 * @syntax promise.then(onSuccess)
    	 * @syntax promise.then(onSuccess, onError)
    	 * 
    	 * @module WEB, UTIL
    	 * Registers two callbacks that will be invoked when the ##promise#Promise##'s asynchronous operation finished 
    	 * successfully (<var>onSuccess</var>) or an error occurred (<var>onError</var>). The callbacks will be called after  
    	 * <var>then()</var> returned, from the browser's event loop.
    	 * Minified implements the Promises/A+ specification, allowing interoperability with other Promises frameworks. 
    	 * You can chain <var>then()</var> invocations, as <var>then()</var> returns another Promise object that you can attach to. 
    	 *
    	 * @example Simple handler for an HTTP request. Handles only success and ignores errors.
    	 * <pre>
    	 * $.request('get', '/weather.html')
    	 *     .then(function(txt) {
    	 *        alert('Got response!');
    	 *     });
    	 * </pre>
    	 *
    	 * @example Including an error handler.
    	 * <pre>
    	 * $.request('get', '/weather.html')
    	 *     .then(function(txt) {
    	 *        alert('Got response!');
    	 *     }, function(err) {
    	 *        alert('Error!');
    	 *     }));
    	 * </pre>
    	 *
    	 * @example Chained handler.
    	 * <pre>
    	 * $.request('get', '/weather.do')
    	 *     .then(function(txt) {
    	 *        showWeather(txt);
    	 *     }
    	 *     .then(function() {
    	 *        return $.request('get', '/traffic.do');
    	 *     }
    	 *     .then(function(txt) {
    	 *        showTraffic(txt);
    	 *     }
    	 *     .then(function() {
    	 *        alert('All result displayed');
    	 *     }, function() {
    	 *        alert('An error occurred');
    	 *     });
    	 * </pre>
    	 *
    	 * @param onSuccess optional a callback function to be called when the operation has been completed successfully. The exact arguments it receives depend on the operation.  
    	 *                           If the function returns a ##promise#Promise##, that Promise will be evaluated to determine the state of the promise returned by <var>then()</var>. If it returns any other value, the 
    	 *                           returned Promise will also succeed. If the function throws an error, the returned Promise will be in error state.
    	 *                           Pass <var>null</var> or <var>undefined</var> if you do not need the success handler. 
    	 * @param onError optional a callback function to be called when the operation failed. The exact arguments it receives depend on the operation. If the function returns a ##promise#Promise##, that promise will
    	 *                           be evaluated to determine the state of the Promise returned by <var>then()</var>. If it returns anything else, the returned Promise will 
    	 *                           have success status. If the function throws an error, the returned Promise will be in the error state.
    	 *                           You can pass <var>null</var> or <var>undefined</var> if you do not need the error handler. 
    	 * @return a new ##promise#Promise## object. If you specified a callback for success or error, the new Promises's state will be determined by that callback if it is called.
    	 *         If no callback has been provided and the original Promise changes to that state, the new Promise will change to that state as well.
    	 */   
    	var then = set['then'] = function(onFulfilled, onRejected) {
    		var newPromise = promise();
			var callCallbacks = function() {
	    		try {
	    			var f = (state ? onFulfilled : onRejected);
	    			if (isFunction(f)) {
		   				var r = f.apply(null, values);
		   				if (r && isFunction(r['then']))
		   					r['then'](function(value){newPromise(true,[value]);}, function(value){newPromise(false,[value]);});
		   				else
		   					newPromise(true, [r]);
		   			}
		   			else
		   				newPromise(state, values);
				}
				catch (e) {
					newPromise(false, [e]);
				}
			};
			if (state != null)
				delay(callCallbacks);
			else
				deferred.push(callCallbacks);    		
    		return newPromise;
    	};
    	/*$
    	 * @id always
    	 * @group REQUEST
    	 * @name promise.always()
    	 * @syntax promise.always(callback)
    	 * @module WEB, UTIL
    	 * Registers a callback that will always be called when the ##promise#Promise##'s operation ended, no matter whether the operation succeeded or not.
    	 * This is a convenience function that will call ##then() with the same function for both arguments. It shares all of its semantics.
    	 *
    	 * @example Simple handler for a HTTP request.
    	 * <pre>
    	 * $.request('get', '/weather.html')
    	 *     .always(function() {
    	 *        alert('Got response or error!');
    	 *     });
    	 * </pre>
    	 *
    	 * @param callback a function to be called when the operation has been finished, no matter what its result was. The exact arguments depend on the operation and may
    	 *                 vary depending on whether it succeeded or not. If the function returns a ##promise#Promise##, that Promise will
    	 *                 be evaluated to determine the state of the returned Promise. If provided and it returns regularly, the returned promise will 
    	 *                 have success status. If it throws an error, the returned Promise will be in the error state.
    	 * @return a new ##promise#Promise## object. Its state is determined by the callback.
    	 */
      	set['always'] = function(func) { return then(func, func); };

    	/*$
    	 * @id error
    	 * @group REQUEST
    	 * @name promise.error()
    	 * @syntax promise.error(callback)
    	 * @module WEB, UTIL
    	 * Registers a callback that will be called when the operation failed.
    	 * This is a convenience function that will invoke ##then() with the only the second argument set.  It shares all of its semantics.
    	 *
    	 * @example Simple handler for a HTTP request.
    	 * <pre>
    	 * $.request('get', '/weather.html')
    	 *     .error(function() {
    	 *        alert('Got error!');
    	 *     });
    	 * </pre>
    	 *
    	 * @param callback a function to be called when the operation has failed. The exact arguments depend on the operation. If the function returns a ##promise#Promise##, that Promise will
    	 *                           be evaluated to determine the state of the returned Promise. If it returns regularly, the returned Promise will 
    	 *                           have success status. If it throws an error, the returned Promise will be in error state.
    	 * @return a new ##promise#Promise## object. Its state is determined by the callback.
    	 */  
     	set['error'] = function(func) { return then(0, func); };
    	return set;
    }

    /*$
	 * @id ucode
	 * @dependency
     */

    /*$
     * @stop
     */

	function $(selector, context, childOnly) { 
		// @condblock ready
		// isList(selector) is no joke, older Webkit versions return a function for childNodes...
		return isFunction(selector) ? ready(selector) : new M(dollarRaw(selector, context, childOnly));
		// @condend
		// @cond !ready return new M(dollarRaw(selector, context));
	}

	/*$
	 * @id debug
	 * @group OPTIONS
	 * (TBD) @configurable optional
	 * @doc no
	 * @name Debugging Support
	 */
	function error(msg) {
		if (_window.console) console.log(msg);
		throw Exception("Minified debug error: " + msg);
	}
    // @cond debug MINI['debug'] = true;

    /*$
     * @id dollarraw
     * @requires 
     * @dependency yes
     */
    function dollarRaw(selector, context, childOnly) { 

		function filterElements(list) { // converts into array, makes sure context is respected
			var retList = (function flatten(a) { // flatten list, keep non-lists, remove nulls
				return isList(a) ? collect(a, flatten) : a; 
			})(list);
			if (parent)
				return filter(retList, function(node) {
					var a = node;
					while (a = a.parentNode) {
						if (a === parent)
							return true;
						if (childOnly)
							return false;
					}
					// fall through to return undef
				});
			else
				return retList;
		}

		var parent, steps, dotPos, subSelectors;
		var elements, regexpFilter, useGEbC, className, elementName, reg;

		if (context && (context = dollarRaw(context)).length != 1) // if not exactly one node, iterate through all and concat
			return collect(context, function(ci) { return dollarRaw(selector, ci, childOnly);});
		parent = context && context[0]; // note that context may have changed in the previous two lines!! you can't move this line

		if (!isString(selector))
		    return filterElements(isList(selector) ? selector : [selector]); 








		elements = (parent || _document).querySelectorAll(selector);
		return parent ? filterElements(elements) : elements;
	};

 	/*$
	 * @id length
	 * @group SELECTORS
	 * @requires dollar
	 * @name .length
	 * @syntax length
   	 * @module WEB, UTIL
	 * 
	 * Contains the number of elements in the list.
	 * 
	 * @example
	 * <pre>
	 * var list = $('input');
	 * var myValues = {};
	 * for (var i = 0; i &lt; list.length; i++)
	 *    myValues[list[i].name] = list[i].value;
	 * </pre>
	 */
	// empty, always defined below

	/*$
	 * @id listctor
	 */	
    /** @constructor */
	function M(array) {
		var len = this['length'] = array.length;
		for (var i = 0; i < len; i++)
			this[i] = array[i];
	}

	//// LIST FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	eachObj({
    /*$
     * @id each
     * @group SELECTORS
     * @requires dollar
     * @configurable default
     * @name .each()
     * @syntax each(callback)
     * @module WEB, UTIL
     * Invokes the given function once for each item in the list. The function will be called with the item as first parameter and 
     * the zero-based index as second.
     *
     * @example This goes through all h2 elements of the class 'section' and changes their content:
     * <pre>
     * $('h2.section').each(function(item, index) {
     *     item.innerHTML = 'Section ' + index + ': ' + item.innerHTML;
     * });
     * </pre>
     *
     * @param callback The callback <code>function(item, index)</code> to invoke for each list element. 
     *                 <dl><dt>item</dt><dd>The current list element.</dd><dt>index</dt><dd>The second the zero-based index of the current element.</dd></dl>
     *                 The callback's return value will be ignored.
     * @return the list
     */
	'each': function (callback) {
		return each(this, callback);
	},

	/*$
	 * @id filter
	 * @group SELECTORS
	 * @requires dollar
	 * @configurable default
	 * @name .filter()
	 * @syntax filter(filterFunc)
   	 * @module WEB, UTIL
	 * Creates a new ##list#Minified list## that contains only those items approved by the given callback function. The function is 
	 * called once for each item. 
	 * If the callback function returns true, the item is shallow-copied in the new list, otherwise it will be removed.
	 *
	 * @example Creates a list of all unchecked checkboxes.
	 * <pre>
	 * var list = $('input').filter(function(item) {
	 *     return item.getAttribute('type') == 'checkbox' && item.checked;
	 * });
	 * </pre>
	 * 
	 * @param filterFunc The filter callback <code>function(item, index)</code> that decides which elements to include:
	 *        <dl><dt>item</dt><dd>The current list element.</dd><dt>index</dt><dd>The second the zero-based index of the current element.</dd>
	 *        <dt class="returnValue">(callback return value)</dt><dd><var>true</var> to include the item in the new list, <var>false</var> to omit it.</dd></dl>  
	 * @return the new, filtered ##list#list##
	 */
	'filter': function(filterFunc) {
	    return new M(filter(this, filterFunc));
	},

	/*$ 
     * @id collect 
     * @group SELECTORS 
     * @requires dollar 
     * @configurable default 
     * @name .collect() 
     * @syntax collect(collectFunc) 
   	 * @module WEB, UTIL
     * Creates a new ##list#Minified list## from the current list using the given callback function. 
     * The callback is invoked once for each element of the current list. The callback results will be added to the result list. 
     * The callback can return 
     * <ul> 
     * <li>an array or another list-like object. Its content will be appended to the resulting list.</li> 
     * <li>a regular object which will be appended to the list</li> 
     * <li><var>null</var> (or <var>undefined</var>), which means that no object will be added to the list. 
     * If you need to add <var>null</var> or <var>undefined</var> to the result list, put it into a single-element array.</li> 
     * </ul>
     * 
     * 
     * @example Goes through input elements. If they are text inputs, their value will be added to the list: 
     * <pre> 
     * var texts = $('input').collect(function(input) { 
     *     if (input.getAttribute('type') != null || input.getAttribute('type') == 'text') 
     *         return input.value; 
     *     else 
     *         return null; // ignore 
     * }); 
     * </pre> 
     * 
     * @example Creates a list of all children of the selected list. 
     * <pre> 
     * var childList = $('.mySections').collect(function(node) { 
     *     return node.childNodes; // adds a while list of nodes 
     * }); 
     * </pre> 
     * 
     * @example Goes through selected input elements. For each hit, the innerHTML is added twice, once in lower case and once in upper case: 
     * <pre> 
     * var elements = $('input.myTexts').collect(function(item) { 
     *     return [item.innerHTML.toLowerCase(), item.innerHTML.toUpperCase()]; 
     * }); 
     * </pre> 
     * 
     * @param collectFunc The callback <code>function(item, index)</code> to invoke for each item:
     * <dl><dt>item</dt><dd>The current list element.</dd><dt>index</dt><dd>The second the zero-based index of the current element.</dd>
	 *        <dt class="returnValue">(callback return value)</dt><dd>If the callback returns a list, its elements will be added to 
	 *        the result list. Other objects will also be added. Nulls and <var>undefined</var> will be ignored and be not added to 
	 *        the new result list. </dd></dl>
     * @return the new ##list#list##
     */ 
	'collect': function(collectFunc) { 
    	 return new M(collect(this, collectFunc)); 
     },

     /*$ 
      * @id sub
      * @group SELECTORS 
      * @requires filter 
      * @configurable default 
      * @name .sub() 
      * @syntax sub(startIndex) 
      * @syntax sub(startIndex, endIndex) 
      * @module WEB, UTIL
      * Returns a new ##list#Minified list## containing only the elements in the specified range. If there are no elements in the range,
      * an empty list is returned.
      * Negative indices are supported and will be added to the list's length, thus allowing you to specify ranges at the list's end.
      *
      * @example Adds some text the 3rd to 5th list elements:
      * <pre> 
      * $('#myList li').sub(3, 6).add('Hello');
      * </pre> 
      *
      * @example Clears all elements but the first:
      * <pre> 
      * $('#myList li').sub(1).fill();
      * </pre> 
      *
      * @example Changes the class of the last list element:
      * <pre> 
      * $('#myList li').sub(-1).set('+lastItem');
      * </pre> 
      * 
      * @param startIndex the 0-based position of the sub-list start. If negative, the list's length is added and the position is relative
      *                   to the list's end.
      * @param endIndex optional the 0-based position of the sub-list end. If negative, the list's length is added and the position is relative
      *                   to the list's end. If omitted or null, all elements following the <var>startIndex</var> are included in the result.
      * @return a new ##list#list## containing only the items in the index range. 
      */ 
	'sub': function(startIndex, endIndex) {
		var self = this;
	    var s = (startIndex < 0 ? self['length']+startIndex : startIndex);
	    var e = endIndex >= 0 ? endIndex : self['length'] + (endIndex || 0);
 		return new M(filter(self, function(o, index) { 
 			return index >= s && index < e; 
 		}));
 	},

    /*$ 
     * @id find 
     * @group SELECTORS 
     * @requires
     * @configurable default 
     * @name .find() 
     * @syntax find(findFunc) 
     * @syntax find(element) 
     * @module WEB, UTIL
     * Finds a specific value in the list. There are two ways of calling <var>find()</var>:
     * <ol>
     * <li>With an element as argument. Then <var>find()</var> will search for the first occurrence of that element in the list
     *     and return the index. If it is not found, <var>find()</var> returns <var>undefined</var>.</li>
     * <li>With a callback function. <var>find()</var> will then call the given function for each list element until the function 
     *     returns a value that is not <var>null</var> or <var>undefined</var>. This value will be returned.</li>
     * </ol>
     *
     * @example Determines the position of the element with the id '#wanted' among all li elements:
     * <pre> 
     * var elementIndex = $('li').find($$('#wanted'));
     * </pre> 
     * 
     * @example Goes through the elements to find the first div that has the class 'myClass', and returns this element:
     * <pre> 
     * var myClassElement = $('div').find(function(e) { if ($(e).hasClass('myClass')) return e; });
     * </pre> 
     * 
     * @param findFunc The callback <code>function(item, index)</code> that will be invoked for every list item until it returns a non-null value:
     * <dl><dt>item</dt><dd>The current list element.</dd><dt>index</dt><dd>The second the zero-based index of the current element.</dd>
	 *        <dt class="returnValue">(callback return value)</dt><dd>If the callback returns something other than <var>null</var> or
	 *        <var>undefined</var>, <var>find()</var> will return it directly. Otherwise it will continue. </dd></dl>
     * @param element the element to search for
     * @return if called with an element, either the element's index in the list or <var>undefined</var> if not found. If called with a callback function,
     *         it returns either the value returned by the callback or <var>undefined</var>.
     */ 
	'find': function(findFunc) {
		var self = this, r;
		var f = isFunction(findFunc) ? findFunc : function(obj, index) { if (findFunc === obj) return index; };
		for (var i = 0; i < self.length; i++)
			if ((r = f(self[i], i)) != null)
				return r;
	},

	/*$ 
	 * @id hasclass 
	 * @group SELECTORS 
	 * @requires find
	 * @configurable default 
	 * @name .hasClass() 
	 * @syntax hasClass(className) 
     * @module WEB
	 * Checks whether at least one HTML element in the list has the given CSS class name. 
	 * If yes, the first element that matches is returned. Otherwise the function returns <var>undefined</var>. List elements that do not
	 * have a <var>className</var> property will be ignored.
	 *
	 * @example Checks whether the element 'myElement' has the class 'myClass'. If yes, it sets the text color to red.
	 * <pre>
	 * if($('#myElement').hasClass('myClass'))
	 *     $('#myElement').set('$color', 'red');
	 * </pre>
	 * 
	 * @param className the class to to find
	 * @return the first element that has the given class, or <var>undefined</var> if not found
	 */ 
	'hasClass': function(className) {
		var regexp = new RegExp(BACKSLASHB +  className + BACKSLASHB);
		return this['find'](function(e) { return regexp.test(e.className) ? e : null; });
	},

	/*$
	 * @id remove
	 * @group SELECTORS
	 * @requires dollar
	 * @configurable default
	 * @name .remove()
	 * @syntax remove()
     * @module WEB
	 * Removes all nodes of the list from the DOM tree.
	 * 
	 * @example Removes the element with the id 'myContainer', including all children, from the DOM tree.
	 * <pre>
	 * $('#myContainer').remove(); 
	 * </pre>
	 */
     'remove': function() {
    	each(this, function(obj) {obj.parentNode.removeChild(obj);});
     },

 	/*$
 	 * @id text
 	 * @group SELECTORS
 	 * @requires dollar
 	 * @configurable default
 	 * @name .text()
 	 * @syntax text()
     * @module WEB
 	 * Returns the concatenated text content of all nodes in the list. 
 	 * This is done by going recursively through all elements and their children. The values of text and CDATA nodes
 	 * will be appended to the resulting string.
 	 * 
 	 * Please note that, unlike jQuery's <var>text()</var>, Minified's will not set text content. Use ##fill() to do this.
 	 * 
 	 * @example Returns the text of the element with the id 'myContainer'.
 	 * <pre>
 	 * var content = $('#myContainer').text(); 
 	 * </pre>
 	 */
 	'text': function () {
		function extractString(e) {
			var nodeType = isNode(e);
			if (nodeType == 1)
				return collect(e['childNodes'], extractString);
			else if (nodeType < 5)        // 2 is impossible (attribute), so only 3 (text) and 4 (cdata)..
				return e['data'];
			else 
				return null;
		}
		return collect(this, extractString)['join']('');
	},

  	/*$
 	 * @id get
 	 * @group SELECTORS
 	 * @requires dollar
 	 * @configurable default
 	 * @name .get()
 	 * @syntax get(name)
 	 * @syntax get(name, toNumber)
 	 * @syntax get(list)
 	 * @syntax get(list, toNumber)
 	 * @syntax get(map)
 	 * @syntax get(map, toNumber)
     * @module WEB
 	 * Retrieves properties, attributes and styles from the list's first element. The syntax to request those values is mostly identical with ##set(). You can either
 	 * get a single value if you specify only one name, or get a name->value map when you specify several names using an array or a map.
 	 * 
 	 * @example Retrieves the id, title attribute and the background color of the element '#myElement':
 	 * <pre>
 	 * var id = $('#myElement).get('id'); 
 	 * var title = $('#myElement).get('@title'); 
 	 * var bgColor = $('#myElement).get('$backgroundColor'); 
 	 * </pre>
 	 *
 	 * @example Retrieves the id, title attribute and the background color of the element '#myElement' as a map:
 	 * <pre>
 	 * var m = $('#myElement).get(['id', '@title', '$backgroundColor']); 
 	 * var id = m.id;
 	 * var title = m['@title'];
 	 * var bgColor = m.$backgroundColor;
 	 * </pre>
 	 *
 	 * @example Uses ##get() and ##set() to reposition an element:
 	 * <pre>
 	 * var coords = $('#myElement').get({$top: 0, $left: 0}, true); 
 	 * coords.$top = coords.$top + 10 + 'px';
 	 * coords.$left = coords.$left + 20 + 'px';
 	 * $('#myElement').set(coords);
 	 * </pre>
 	 * Please note that the values of $top and $left in the <var>get()</var> invocation do not matter and will be ignored!
 	 *
 	 * @param name the name of the property, attribute or style. To retrieve a JavaScript property, just use its name without prefix. To get an attribute value,
 	 *             prefix the name with a '@'. A '$' prefix will retrieve a CSS style. The syntax for the CSS styles is camel-case (e.g. "backgroundColor", not "background-color"). 
 	 *             Shorthand properties like "border" or "margin" are not supported. You must use the full name, e.g. "marginTop". Minified will try to determine the effective style
 	 *             and thus will return the value set in style sheets if not overwritten using a regular style.
 	 * 	  	    Using just '$' as name will retrieve the 'className' property of the object, a space-separated list of all CSS classes.
 	 *          The special name '$$' will set the element's style attribute in a browser independent way.
 	 *          '$$fade' returns a value between 0 and 1 that specifies the element's
 	 *          opacity. '$$slide' returns the height of the element in pixels, with a 'px' suffix. Both '$$fade' and '$$slide' will also check the CSS styles 'visibility' and 'display'
 	 *          to determine whether the object is visible at all. If not, they will return 0.
 	 * @param list in order to retrieve more than one value, you can specify several names in an array or list. <var>get()</var> will then return a name->value map of results.
 	 * @param map if you specify an object that is neither list nor string, <var>get()</var> will use it as a map of property names. Each property name will be requested. The values of the properties in 
 	 *                   the map will be ignored. <var>get()</var> will then return a name->value map of results.
 	 * @param toNumber if 'true', <var>get()</var> converts all returned values into numbers. If they are strings, 
 	 *                 <var>get()</var> removes any non-numeric characters before the conversion. This is useful when you request 
 	 *                 a CSS property such as '$marginTop'  that returns a value with a unit suffix, like "21px". <var>get()</var> will convert it 
 	 *                 into a number and return 21. If the returned value is not parsable as a number, <var>NaN</var> will be returned.
 	 * @return if <var>get()</var> was called with a single name, it returns the corresponding value. 
 	 *         If a list or map was given, <var>get()</var> returns a new map with the names as keys and the values as values.
 	 *         Always returns <var>undefined</var> if the list is empty.
 	 */
    'get': function(spec, toNumber) {
    	var self = this, element = self[0];

		if (element) {
			if (isString(spec)) {
				var name = replace(spec, /^[$@]/);
				var s;
				if (spec == '$')
					s = element.className;
				else if (spec == '$$') {
						s = element.getAttribute('style');
				}
				// @condblock fadeslide
				else if (/\$\$/.test(spec) && (element['style']['visibility'] == 'hidden' || element['style']['display'] == 'none')) {
					s = 0;
				}
				else if (spec == '$$fade') {
					s = isNaN(s = 
						  extractNumber(element['style']['opacity']) 
						 ) ? 1 : s;
				}
				else if (spec == '$$slide') {
					s = self['get']('$height');
				}
				// @condend fadeslide
				else if (/^\$/.test(spec)) {
						s = _window.getComputedStyle(element, null).getPropertyValue(replace(name, /[A-Z]/g, function (match) {  return '-' + match.toLowerCase(); }));
				}
				else if (/^@/.test(spec))
					s = element.getAttribute(name);
				else
					s = element[name];
				return toNumber ? extractNumber(s) : s;
			}
			else {
				var r = {};
				(isList(spec) ? each : eachObj)(spec, function(name) {
					r[name] = self['get'](name, toNumber);
				});
				return r;
			}
		}
	},

	/*$
	 * @id set
	 * @group SELECTORS
	 * @requires dollar get
	 * @configurable default
	 * @name .set()
	 * @syntax set(name, value)
	 * @syntax set(properties)
	 * @syntax set(cssClasses)
     * @module WEB
	 * 
	 * Modifies the list's elements by setting their properties, attributes, CSS styles and/or CSS classes. You can either supply a 
	 * single name and value to set only one property, or you can provide an object that contains name/value pairs to describe more than one property.
	 * More complex operations can be accomplished by supplying a function as value. It will then be called for each element that will
	 * be set.
	 *
	 * The name given to <var>set()</var> defines what kind of data you are setting. The following name schemes are supported:
	 * 
	 * <table>
	 * <tr><th>Name Schema</th><th>Example</th><th>Sets what?</th><th>Description</th></tr>
	 * <tr><td>name</td><td>innerHTML</td><td>Property</td><td>A name without prefix of '$' or '@' sets a property of the object.</td></tr>
	 * <tr><td>@name</td><td>@href</td><td>Attribute</td><td>Sets the HTML attribute using setAttribute(). In order to stay compatible with Internet Explorer 7 and earlier, 
	 *             you should not set the attributes '@class' and '@style'. Instead use '$' and '$$' as shown below.</td></tr>
	 * <tr><td>$name</td><td>$fontSize</td><td>CSS Property</td><td>Sets a style using the element's <var>style</var> object.</td></tr>
	 * <tr><td>$</td><td>$</td><td>CSS Classes</td><td>A simple <var>$</var> modifies the element's CSS classes using the object's <var>className</var> property. The value is a 
	 *             space-separated list of class names. If prefixed with '-' the class is removed, a '+' prefix adds the class and a class name without prefix toggles the class.
	 *             The name '$' can also be omitted if <var>set</var> is called with class names as only argument.</td></tr>
	 * <tr><td>$$</td><td>$$</td><td>Style</td><td>Sets the element's style attribute in a browser-independent way.</td></tr>
	 * <tr><td>$$fade</td><td>$$fade</td><td>Fade Effect</td><td>The name '$$fade' sets the opacity of the element in a browser-independent way. The value must be a number
	 *              between 0 and 1. '$$fade' will also automatically control the element's 'visibility' and 'display' styles. If the value is 0,
	 *             the element's visibility will automatically be set to 'hidden'. If the value is larger, the visibility will be set to 
	 *             'visible' and the display style to 'block'. '$$fade' only works with block elements.</td></tr>
	 * <tr><td>$$slide</td><td>$$slide</td><td>Slide Effect</td><td>The name '$$slide' allows a vertical slide-out or slide-in effect. The value must be a number
	 *              between 0 and 1. '$$slide' will also automatically control the element's 'visibility' and 'display' styles. If the value is 0,
	 *             the element's visibility will automatically be set to 'hidden'. If the value is larger, the visibility will be set to 
	 *             'visible' and the display style to 'block'. '$$slide' only works with block elements.</td></tr>
	 * </table>
	 * 
	 * @example Unchecking checkboxes:
	 * <pre>
	 * $('input.checkbox').set('checked', false);
	 * </pre>
	 * 
	 * @example Changing the <var>innerHTML</var property of an element:
	 * <pre>
	 * $('#toc').set('innerHTML', 'Content');
	 * </pre>
	 * 
	 * @example Changing attributes:
	 * <pre>
	 * $('a.someLinks').set('@href', 'http://www.example.com/');
	 * </pre>
	 * 
	 * @example Removing attributes:
	 * <pre>
	 * $('a.someLinks').set('@title', null);
	 * </pre>
	 * 
	 * @example Changing styles:
	 * <pre>
	 * $('.bigText').set('$font-size', 'x-large');
	 * </pre>
	 * 
	 * @example Adding and removing CSS classes:
	 * <pre>
	 * $('.myElem').set('$', '+myClass -otherClass');
	 * </pre>
	 *  
	 * @example Toggling a CSS class:
	 * <pre>
	 * $('.myElem').set('$', 'on');
	 * </pre>
	 * 
	 * @example Shortcut for CSS manipulation:
	 * <pre>
	 * $('.myElem').set('+myClass -otherClass on');
	 * </pre>
	 * 	 
	 * @example Making an element transparent:
	 * <pre>
	 * $('.seeThrough').set('$$fade', 0.5);
	 * </pre>
	 * 	  
	 * @example Making an element visible. Note that $$fade will set the element's display style to 'block' and visibility style to 'visible'.
	 * <pre>
	 * $('.myElem').set('$$fade', 1);
	 * </pre>
	 * 
	 * @example Using a map to change several properties:
	 * <pre>
	 * $('input.checkbox').set({checked: false,
	 *                          'parentNode.@title': 'Check this'});
	 * </pre>
	 * 
	 * @example Changing CSS with a map:
	 * <pre>
	 * $('.importantText').set({$fontSize: 'x-large',
	 *                          $color: 'black',
	 *                          $backgroundColor: 'red',
	 *                          $: '+selected -default'});
	 * </pre>
	 * 
	 * @example You can specify a function as value to modify a value instead of just setting it:
	 * <pre>
	 * $('h2').set('innerHTML', function(oldValue, index) { 
	 *     return 'Chapter ' + index + ': ' + oldValue.toUpperCase(); 
	 * });
	 * </pre>
	 * 
	 * @param name the name of a single property or attribute to modify. If prefixed with '@', it is treated as a DOM element's attribute. 
	 *             A dollar ('$') prefix is a shortcut for CSS styles. A simple dollar ('$') as name modifies CSS classes.
	 *             The special name '$$' allows you to set the <var>style</var> attribute in a browser independent way.
	 *             The special name '$$fade' and '$$slide' create fade and slide effects, and both expect a value between 0 and 1. 
	 *             
	 * 
	 * @param value the value to set. If value is null and name specified an attribute, the attribute will be removed.
	 * If a dollar ('$') has been passed as name, the value can contain space-separated CSS class names. If prefixed with a '+' the class will be added,
	 * with a '-' prefix the class will be removed. Without prefix, the class will be toggled.
	 * If <var>value</var> is a function, the <code>function(oldValue, index, obj)</code> will be invoked for each list element 
	 * to evaluate the new value: 
	 * <dl><dt>oldValue</dt><dd>The old value of the property to be changed, as returned by ##get().
	 * For the CSS style names, this is the computed style of the property </dd>
	 * <dt>index</dt><dd>The list index of the object owning the property</dd>
	 * <dt>obj</dt><dd>The list element owning the property.<dd>
	 * <dt class="returnValue">(callback return value)</dt><dd>The value to be set.</dd></dl>
	 * Functions are not supported by '$'.
	 * @param properties a Object as map containing names as keys and the values to set as map values. See above for the name syntax.
	 * @param cssClasses if <var>set()</var> is invoked with a string as single argument, the name "$" (CSS classes) is used and the argument is the
	 *                   value. See above for CSS syntax.
	 *                   Instead of a string, you can also specify a <code>function(oldValue, index, obj)</code> to modify the existing classes. 
	 * @return the list
	 */
     'set': function (name, value) {
    	 function setAttr(obj, n, v) {
    		 if (v != null)  
    			 obj.setAttribute(n, v);
			 else
				 obj.removeAttribute(n);
    	 }
    	 var self = this, v;
 		 // @cond debug if (name == null) error("First argument must be set!");
    	 if (value !== undef) {
    		 // @cond debug if (!/string/i.test(typeof name)) error('If second argument is given, the first one must be a string specifying the property name");

    		 // @condblock fadeslide
    		 if (name == '$$fade' || name == '$$slide') {
    			 self.set({'$visibility': (v = extractNumber(value)) > 0 ? 'visible' : 'hidden', '$display': 'block'})
    			     .set((name == '$$fade')  ? (
    			    	  {'$opacity': v})
    			        :
    			        {'$height': /px$/.test(value) ? value : function(oldValue, idx, element) { return v * (v && getNaturalHeight($(element)))  + 'px';},
    			         '$overflow': 'hidden'}
 					);
    		 }
    		 else
    			// @condend fadeslide
    			 each(self, function(obj, c) {
    				 var nameClean = replace(name, /^[@$]/);
    				 var className = obj['className'] || '';
    				 var newObj = /^\$/.test(name) ? obj.style : obj;
    				 var newValue = isFunction(value) ? value($(obj).get(name), c, obj) : value;
    				 if (name == '$') {
    					 if (newValue != null) {
    						 each(newValue.split(/\s+/), function(clzz) {
    							 var cName = replace(clzz, /^[+-]/);
    							 var oldClassName = className;
    							 className = replace(className, new RegExp(BACKSLASHB + cName + BACKSLASHB));
    							 if (/^\+/.test(clzz) || (cName==clzz && oldClassName == className)) // for + and toggle-add
    								 className += ' ' + cName;
    						 });
    						 obj['className'] = replace(className, /^\s+|\s+(?=\s|$)/g);
    					 }
    				 }
   				 	 else if (name == '$$') {
							setAttr(obj, 'style', newValue);
					 }
    				 else if (!/^@/.test(name))
    					 newObj[nameClean] = newValue;
    				 else
    					 setAttr(newObj, nameClean, newValue);
    			 });
    	 }
    	 else if (isString(name) || isFunction(name))
    		 self.set('$', name);
    	 else
    		 eachObj(name, function(n,v) { self.set(n, v); });
    	 return self;
     },

	/*$
	 * @id add
	 * @group ELEMENT
	 * @requires dollar
	 * @configurable default
	 * @name .add()
	 * @syntax add(text)
	 * @syntax add(factoryFunction)
	 * @syntax add(list)
	 * @syntax add(node)
     * @module WEB
	 * Adds the given node(s) as content to the list's HTML elements. If a string has been given, it will be added as text node.
	 * If you pass a function, it will be invoked for each list element to create the node to add. This is called a factory function. It can return all 
	 * values allowed by <var>add()</var>, including another function to be called.
	 * If you pass a list or a function returning a list, all its elements will be added using the rules above.
	 *
	 * It is also possible to pass a DOM node, but it will be added <strong>only to the first element of the list</strong>, because DOM
	 * does not allow adding it more than once. You should use a factory function to add DOM elements to more than one list element. ##EE() 
	 * and ##clone() are two simple ways to create factory functions.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="comments">Here is some text.&lt;br/>&lt;/div>
	 * </pre> 
	 * The next line appends a text node to the given 'comment' div:
	 * <pre>
	 * $('#comments').add('Some additional text.');
	 * </pre>
	 * This results in:
	 * <pre>
	 * &lt;div id="comments">Here is some text.&lt;br/>&lt;Some additional text./div>
	 * </pre> 
	 *
	 * @example Using the following HTML: 
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>First list entry&lt;/li>
	 *   &lt;li>Second list entry&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 * The following Javascript adds an element to the list:
	 * <pre>
	 * $('#myList').add(EE('li', 'My extra point');
	 * </pre>
	 * This results in
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>First list entry&lt;/li>
	 *   &lt;li>Second list entry&lt;/li>
	 *   &lt;li>My extra point&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 *
	 * @example Use a list to add several elements at once:
	 * <pre>
	 * $('#comments').add([
	 * 		EE('br'), 
	 *      'Some text', 
	 *      EE('span', {'className': 'highlight'}, 'Some highlighted text')
	 * ]);
	 * </pre>
	 *
	 * @example You can implement functions to create elements depending on the context:
	 * <pre>
	 * $('.chapter').add(function(parent, index) { return EE('h2', 'Chapter number ' + index); });
	 * </pre>
	 *
	 * @param text a string or number to add as text node
	 * @param factoryFunction a <code>function(listItem, listIndex)</code> that will be invoked for each list element to create the nodes: 
	 * <dl><dt>listItem</dt><dd>The list element that will receive the new children.</dd>
	 * <dt>listIndex</dt><dd>The index of the list element that will receive the new children.</dd>
	 * <dt class="returnValue">(callback return value)<dt><dd>The node(s) to be added to the list element.
	 * Can be either a string for a text node, an HTML element or a list containing strings, lists, functions and/or DOM nodes.
	 * If a function is returned or in the list, it will be invoked recursively with the same arguments.</dd></dl>
	 * @param list a list containing text, functions, nodes or more lists. Please note that if you have DOM nodes in this list
	 *             and attempt to add them to more than one element, the result is undefined. You should always use factories
	 *             if you add DOM nodes to more than one element.
	 * @param node a DOM node to add <strong>only to the first element</strong> of the list. 
	 * @return the current list
	 */
	'add': function (children, addFunction) {
		return each(this, function(e, index) {
			var lastAdded;
			(function appendChildren(c) {
				if (isList(c))
					each(c, appendChildren);
				else if (isFunction(c))
					appendChildren(c(e, index));
				else if (c != null) {   // must check null, as 0 is a valid parameter 
					var n = isNode(c) ? c : _document.createTextNode(c);
					if (lastAdded)
						lastAdded.parentNode.insertBefore(n, lastAdded.nextSibling);
					else if (addFunction)
						addFunction(n, e, e.parentNode); 
					else
						e.appendChild(n);
					lastAdded = n;
				}
			})(isNode(children) && index ? null : children);
		});
	},

	/*$
	 * @id fill
	 * @group ELEMENT
	 * @requires dollar add remove
	 * @configurable default
	 * @name .fill()
	 * @syntax fill()
	 * @syntax fill(text)
	 * @syntax fill(factoryFunction)
	 * @syntax fill(list)
	 * @syntax fill(node)
     * @module WEB
	 * Sets the content of the list's HTML elements, replacing old content. If a string has been given, it will be added as text node.
	 * If you pass a function, it will be invoked for each list member to create a node. The function prototype is <code>function(parent, index)</code>. 
	 * It can return all values allowed by <var>fill()</var>, including another function to be called.
	 * If you pass a list or a function returns a list, all its elements will be added using the rules above.
	 *
	 * It is also possible to pass a DOM node, but it will be set <strong>only in the first element of the list</strong>, because DOM
	 * does not allow adding it more than once.
	 *
	 * Call <var>fill()</var> without arguments to remove all children from a node.
	 * 
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="status">Done&lt;/div>
	 * </pre> 
	 * <var>fill()</var> with a simple string replaces the element's content with the text:
	 * <pre>
	 * $('#status').fill('Please Wait..');
	 * </pre>
	 * Results in:
	 * <pre>
	 * &lt;div id="status">Please Wait..&lt;/div>
	 * </pre> 
	 *
	 * @example Pass an Element Factory to replace the old content with that:
	 * <pre>
	 * $('#status').fill(EE('span', {'className': 'bold'}, 'Please Wait...'));
	 * </pre>
	 * With the previous example's HTML, this would create this:
	 * <pre>
	 * &lt;div id="status">&lt;span class='bold'>Please Wait..&lt;/span>&lt;/div>
	 * </pre> 
	 *
	 * @example You can also pass a list of elements and texts:
	 * <pre>
	 * $('#status').fill(['Here', EE('br'), 'are', EE('br'), 'four', EE('br'), 'lines.]);
	 * </pre>
	 *
	 * @example Or a complete structure built using EE:
	 * <pre>
	 * $('#myListContainer').fill([
	 *     EE('h2', 'My List'), 
	 *     EE('ol', [EE('li', 'First Item'), EE('li', 'Second Item'), EE('li', 'Third Item')])
	 * ]);
	 * </pre>
	 *
	 * @example You can write a factory function that re-creates the list for every instance:
	 * <pre>
	 * $('.listContainers').fill(function(e, index) { return [
	 *     EE('h2', 'List Number '+index), 
	 *     EE('ol', [EE('li', 'First Item'), 
	 *     EE('li', 'Second Item'), 
	 *     EE('li', 'Third Item')
	 * ])]});
	 * </pre>
	 *
	 * @example <var>fill()</var> without arguments deletes the content of the list elements:
	 * <pre>
	 * $('.listContainers').fill();
	 * </pre>
	 *
	 * @param text a string to set as text node of the list elements
	 * @param factoryFunction a <code>function(listItem, listIndex)</code> that will be invoked for each list element to create the nodes: 
	 * <dl><dt>listItem</dt><dd>The list element that will receive the new children.</dd>
	 * <dt>listIndex</dt><dd>The index of the list element that will receive the new children.</dd>
	 * <dt class="returnValue">(callback return value)<dt><dd>The node(s) to be added to the list element.
	 * Can be either a string for a text node, an HTML element or a list containing strings, lists, functions and/or DOM nodes.
	 * If a function is returned or in the list, it will be invoked recursively with the same arguments.</dd></dl>

	 * @param list a list containing text, functions, nodes or more list. Please note that if you have DOM nodes in this list
	 *             and attempt to add them to more than one element, the result is <var>undefined</var>. You should always use factories if your
	 *             Minified list contains more than one item.
	 * @param node a DOM node to set <strong>only in the first element</strong> of the list. 

	 * @return the current list
	 */
	'fill': function (children) {
		return each(this, function(e) { $(e.childNodes)['remove'](); }).add(children);
	},

	/*$
	 * @id addbefore
	 * @group ELEMENT
	 * @requires dollar add
	 * @configurable default
	 * @name .addBefore()
	 * @syntax addBefore(text)
	 * @syntax addBefore(factoryFunction)
	 * @syntax addBefore(list)
	 * @syntax addBefore(node)
     * @module WEB
	 * Inserts the given text or element(s) as sibling in front of each HTML element in the list. 
	 * If a string has been given, it will be added as text node.
	 * If you pass a function, it will be invoked for each list element to create the new node, with the arguments <code>function(parent, index)</code>. 
	 * It can return all values allowed by <var>addBefore()</var>, including another function to be called.
	 * If you pass a list or a function returns a list, all its elements will be added using the rules above.
	 *
	 * It is also possible to pass a DOM node, but it will be added <strong>only to the first element of the list</strong>, because DOM
	 * does not allow adding it more than once.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div>
	 *   <div id="mainText">Here is some text</div>
	 * &lt;/div>
	 * </pre>  
	 * addBefore() adds text in front of the selected list items.
	 * <pre>
	 * $('#mainText').addBefore('COMMENT');
	 * </pre>
	 * This results in:
	 * <pre>
	 * &lt;div>
	 *   COMMENT
	 *   &lt;div id="mainText">Here is some text&lt;/div>
	 * &lt;/div>
	 * </pre>  
	 *
	 * @example You can also pass an Element Factory:
	 * <pre>
	 * $('#mainText').addBefore(EE('span', {'className': 'important'}, 'WARNING'));
	 * </pre>
	 * With the previous example's HTML, this would create this HTML:
	 * <pre>
	 * &lt;div>
	 *   &lt;span class="important">WARNING&lt;/span>
	 *   &lt;div id="mainText">Here is some text&lt;/div>
	 * &lt;/div>
	 * </pre> 
	 *
	 * @example Lists of elements and nodes are possible as well.
	 * <pre>
	 * $('#status').addBefore([EE('hr'), 'WARNING']);
	 * </pre>
	 *
	 * @param text a string to add as text node of the list elements
	 * @param factoryFunction a <code>function(listItem, listIndex)</code> that will be invoked for each list element to create the nodes: 
	 * <dl><dt>listItem</dt><dd>The list element that will receive the new children.</dd>
	 * <dt>listIndex</dt><dd>The index of the list element that will receive the new children.</dd>
	 * <dt class="returnValue">(callback return value)<dt><dd>The node(s) to be added to the list element.
	 * Can be either a string for a text node, an HTML element or a list containing strings, lists, functions and/or DOM nodes.
	 * If a function is returned or in the list, it will be invoked recursively with the same arguments.</dd></dl>
	 * @param list a list containing text, functions, nodes or more list. Please note that if you have DOM nodes in this list
	 *             and attempt to add them to more than one element, the result is <var>undefined</var>. You should always use factories if your
	 *             Minified list contains more than one item.
	 * @param node a DOM node to add <strong>only to the first element</strong> of the list. 
	 * @return the current list
	 */
	'addBefore': function (children) {
		return this.add(children, function(newNode, refNode, parent) { parent.insertBefore(newNode, refNode); });
	},

	/*$
	 * @id addafter
	 * @group ELEMENT
	 * @requires dollar add
	 * @configurable default
	 * @name .addAfter()
	 * @syntax addAfter(text)
	 * @syntax addAfter(factoryFunction)
	 * @syntax addAfter(list)
	 * @syntax addAfter(node)
     * @module WEB
	 * Inserts the given text or element(s) as sibling after each HTML element in the list. 
	 * If a string has been given, it will be added as text node.
	 * If you pass a function, it will be invoked for each list element to create the node(s) to add. It can return all values
	 * allowed by <var>addAfter()</var>, including another function to be called.
	 * If you pass a list or a function returns a list, all its elements will be added using the rules above.
	 *
	 * It is also possible to pass a DOM node, but it will be added <strong>only to the first element of the list</strong>, because DOM
	 * does not allow adding it more than once.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div>
	 *   &lt;div id="mainText">Here is some text&lt;/div>
	 * &lt;/div>
	 * </pre>   
	 * Use addAfter() with a simple string to add a text node.
	 * <pre>
	 * $('#mainText').addAfter('Disclaimer: bla bla bla');
	 * </pre>
	 * This results in the following HTML:
	 * <pre>
	 * &lt;div>
	 *   &lt;div id="mainText">Here is some text&lt;/div>
	 *   Disclaimer: bla bla bla
	 * &lt;/div>
	 * </pre>   
	 *
	 * @example You can also pass an Element Factory:
	 * <pre>
	 * $('#mainText').addAfter(EE('span', {'className': 'disclaimer'}, 'Disclaimer: bla bla bla'));
	 * </pre>
	 * With the previous example's HTML, this would create this:
	 * <pre>
	 * &lt;div>
	 *   &lt;div id="mainText">Disclaimer: bla bla bla&lt;/div>
	 *   &lt;span class="disclaimer">WARNING&lt;/span>
	 * &lt;/div>
	 * </pre> 
	 *
	 * @param text a string to add as text node of the list elements
	 * @param factoryFunction a <code>function(listItem, listIndex)</code> that will be invoked for each list element to create the nodes:
	 * <dl><dt>listItem</dt><dd>The list element that will receive the new children.</dd>
	 * <dt>listIndex</dt><dd>The index of the list element that will receive the new children.</dd>
	 * <dt class="returnValue">(callback return value)<dt><dd>The node(s) to be added to the list element.
	 * Can be either a string for a text node, an HTML element or a list containing strings, lists, functions and/or DOM nodes.
	 * If a function is returned or in the list, it will be invoked recursively with the same arguments.</dd></dl>
	 * @param list a list containing text, functions, nodes or more list. Please note that if you have DOM nodes in this list
	 *             and attempt to add them to more than one element, the result is <var>undefined</var>. You should always use factories if your
	 *             Minified list contains more than one item.
	 * @param node a DOM node to add <strong>only to the first element</strong> of the list. 
	 * @return the current list
	 */
	'addAfter': function (children) {
		return this.add(children, function(newNode, refNode, parent) { parent.insertBefore(newNode, refNode.nextSibling); });
	},

	/*$
	 * @id addfront
	 * @group ELEMENT
	 * @requires dollar add
	 * @configurable default
	 * @name .addFront()
	 * @syntax addFront(text)
	 * @syntax addFront(factoryFunction)
	 * @syntax addFront(list)
	 * @syntax addFront(node)
     * @module WEB
	 * Adds the given node(s) as children to the list's HTML elements. Unlike ##add(), the new nodes will be the first children and not the last.
	 * If a string has been given, it will be added as text node.
	 * If you pass a function, it will be invoked for each list element to create node(s) with the arguments <code>function(parent, index)</code>. 
	 * It can return all values allowed by <var>addFront()</var>, including another function to be called.
	 * If you pass a list or a function returns a list, all its elements will be added using the rules above.
	 *
	 * It is also possible to pass a DOM node, but it will be added <strong>only to the first element of the list</strong>, because DOM
	 * does not allow adding it more than once.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="comments">Here is some text.&lt;br/>&lt;/div>
	 * </pre> 
	 * Add a text to the given 'comment' div:
	 * <pre>
	 * $('#comments').addFront('Some additional text. ');
	 * </pre>
	 * This results in:
	 * <pre>
	 * &lt;div id="comments">Some additional text. Here is some text.&lt;br/>&lt;/div>
	 * </pre> 
	 *
	 * @example Using the following HTML: 
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>First list entry&lt;/li>
	 *   &lt;li>Second list entry&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 * The following Javascript adds an element to the list:
	 * <pre>
	 * $('#myList').addFront(EE('li', 'My extra point'));
	 * </pre>
	 * This results in
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>My extra point&lt;/li>
	 *   &lt;li>First list entry&lt;/li>
	 *   &lt;li>Second list entry&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 *
	 * @example Use a list to add several elements at once:
	 * <pre>
	 * $('#comments').addFront([
	 *      EE('br'), 
	 *      'Some text', 
	 *      EE('span', {'className': 'highlight'}, 'Some highlighted text')
	 * ]);
	 * </pre>
	 *
	 * @param text a string to add as text node of the list elements
	 * @param factoryFunction a <code>function(listItem, listIndex)</code> that will be invoked for each list element to create the nodes:
	 * <dl><dt>listItem</dt><dd>The list element that will receive the new children.</dd>
	 * <dt>listIndex</dt><dd>The index of the list element that will receive the new children.</dd>
	 * <dt class="returnValue">(callback return value)<dt><dd>The node(s) to be added to the list element.
	 * Can be either a string for a text node, an HTML element or a list containing strings, lists, functions and/or DOM nodes.
	 * If a function is returned or in the list, it will be invoked recursively with the same arguments.</dd></dl>

	 * @param list a list containing text, functions, nodes or nested lists containing those items. Please note that if you have DOM nodes in this list
	 *             and attempt to add them to more than one element, the result is undefined. 
	 * @param node a DOM node to add <strong>only to the first element</strong> of the list. 
	 * @return the current list
	 */
	'addFront': function (children) {
		return this.add(children, function(newNode, refNode) { refNode.insertBefore(newNode, refNode.firstChild); });
	},

	/*$
	 * @id replace
	 * @group ELEMENT
	 * @requires dollar add
	 * @configurable default
	 * @name .replace()
	 * @syntax replace(text)
	 * @syntax replace(factoryFunction)
	 * @syntax replace(list)
	 * @syntax replace(node)
     * @module WEB
	 * Replaces the list items with the the given node(s) in the DOM tree. 
	 * If a string has been given, it will be set as text node.
	 * If you pass a function, it will be invoked for each list element to create node(s) with the arguments <code>function(parent, index)</code>. 
	 * It can return all values allowed by <var>replace()</var>, including another function to be called.
	 * If you pass a list or a function returns a list, all its elements will be set using the rules above.
	 *
	 * It is also possible to pass a DOM node, but it will replace <strong>only the first element of the list</strong>, because DOM
	 * does not allow adding it more than once.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="comments">
	 *    &lt;div id="commentOne">My old comment.&lt;/div>
	 * &lt;/div>
	 * </pre> 
	 * This replaces the div 'commentOne':
	 * <pre>
	 * $('#commentOne').replace('Some new comment.');
	 * </pre>
	 * The resulting HTML is:
	 * <pre>
	 * &lt;div id="comments">
	 *    Some new comment.
	 * &lt;/div>
	 * </pre> 
	 * Please note that not only the text has changed, but the whole &lt;div> has been replaced. If you only want to replace the element's text content
	 * you should use ##fill() instead of <var>replace()</var>.
	 *
	 * @example Using the following HTML: 
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>First list entry&lt;/li>
	 *   &lt;li>Second list entry&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 * The following example will replace <strong>only the first &lt;li> element</strong>:
	 * <pre>
	 * $('#myList li').sub(0, 1).replace(EE('li', 'My extra point'));
	 * </pre>
	 * This results in
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>My extra point&lt;/li>
	 *   &lt;li>Second list entry&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 *
	 *
	 * @param text a text for the text nodes that replace the list elements
	 * @param factoryFunction a <code>function(listItem, listIndex)</code> that will be invoked for each list element to determine its content: 
	 * <dl><dt>listItem</dt><dd>The list element that will receive the new children.</dd>
	 * <dt>listIndex</dt><dd>The index of the list element that will receive the new children.</dd>
	 * <dt class="returnValue">(callback return value)<dt><dd>The node(s) to be added to the list element.
	 * Can be either a string for a text node, an HTML element or a list containing strings, lists, functions and/or DOM nodes.
	 * If a function is returned or in the list, it will be invoked recursively with the same arguments.</dd></dl>
	 * @param node content to replace <strong>only to the first element</strong> of the list with. The content can be a string for a text node,
	 *              an HTML node or a list containing strings and/or HTML node.
	 * @return the current list
	 */
	'replace': function (children) {
		return this.add(children, function(newNode, refNode, parent) { parent.replaceChild(newNode, refNode); });
	},

	/*$
	 * @id clone
	 * @group ELEMENT
	 * @requires dollar ee
	 * @configurable default
	 * @name .clone()
	 * @syntax clone()
	 * @syntax clone(onCreate)
     * @module WEB
	 * Creates a ##list#Minified list## of strings and Element Factories that return clones of the list's HTML elements. An Element Factory is a function
	 * that creates a Minified list of fresh DOM nodes. You can pass the list to ##add(), ##fill() or similar functions to re-create the cloned nodes.
	 *
	 * <var>clone()</var> is very limited in what it will clone. Only elements, their attributes, text nodes and CDATA will be cloned.
	 * Modifications of the elements, such as event handlers, will not be cloned.
	 *
	 * Please note that id attributes will be automatically skipped by the Element Factory. This allows you to address the element to clone by id
	 * without having to worry about duplicate ids in the result.
	 * 
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="comments">
	 *    &lt;div id="comment1">My comment.&lt;/div>
	 * &lt;/div>
	 * </pre> 
	 * Creating a clone factory:
	 * <pre>
	 * var myCloneFactory = $('#comment1').clone();
	 * </pre>
	 * Creating a clone and adding it below the existing one:
	 * <pre>
	 * $('#comments').add(myCloneFactory);
	 * </pre> 
	 *
 	 * @example Creating an event handler for a clone:
	 * <pre>
	 * var buttonCloner = $('#myButton').clone(function(newButton) {
	 *     newButton.on('click', function() { alert('Cloned button clicked'); });
	 * });
	 * $('#buttonContainer').add(buttonCloner);
	 * </pre> 
	 *
	 * @param onCreate optional A <code>function(elementList)</code> that will be called for each top-level element created by the Element
 	 *                 Factory:
 	 *                 <dl><dt>elementList</dt><dd>The newly created element wrapped in a Minified list. </dd></dl>
 	 *                 The function's return value will be ignored. 
 	 *                 The callback allows you, for example, to add event handlers to the element using ##on().
 	 *                 Please note that the callback will be not be called for cloned text nodes. If you clone
 	 *                 more than one element, <var>onCreate</var> will be invoked for each element. 
	 * @return the list of Element Factory functions and strings to create clones
	 */
	'clone': function (onCreate) {
		return new M(collect(this, function(e) {
			var nodeType = isNode(e);
			if (nodeType == 1) {
				var attrs = {
				};
				each(e['attributes'], function(a) {
					var attrName = a['name'];
					if (attrName != 'id'
						) {
						attrs['@'+attrName] = a['value'];
					}
				});
				return EE(e['tagName'], attrs, $(e['childNodes'])['clone'](), onCreate);
			}
			else if (nodeType < 5)        // 2 is impossible (attribute), so only 3 (text) and 4 (cdata)..
				return e['data'];
			else 
				return null;
		}));
	},

	/*$
	 * @id animate
	 * @group ANIMATION
	 * @requires loop dollar set get
	 * @configurable default
	 * @name .animate()
	 * @syntax animate(properties)
	 * @syntax animate(properties, durationMs)
	 * @syntax animate(properties, durationMs, linearity)
	 * @syntax animate(properties, durationMs, interpolationFunc)
	 * @syntax animate(properties, durationMs, linearity, state)
	 * @syntax animate(properties, durationMs, interpolationFunc, state)
     * @module WEB
	 * Animates the items of the list by modifying their properties, CSS styles and attributes. <var>animate()</var> can work with numbers, strings that contain exactly one
	 * number, and with colors in the CSS notations 'rgb(r,g,b)', '#rrggbb' or '#rgb'.
	 *
	 * When you invoke the function, it will first read all old values from the object and extract their numbers and colors. These start values will be compared to 
	 * the destination values that have been specified in the given properties. Then <var>animate()</var> will create a background task using ##$.loop() that updates the 
	 * specified properties in frequent intervals so that they transition to their destination values.
	 *
	 * The start values will be obtained using ##get(). It is recommended to set the start values using ##set() before you start the animation, even if this is not
	 * always required.
	 *
	 * You can define the kind of transition using the <var>linearity</var> parameter. If you omit it or pass 0, animate's default algorithm will cause a smooth transition
	 * from the start value to the end value. If you pass 1, the transition will be linear, with a sudden start and end of the animation. Any value between 0 and 1 
	 * is also allowed and will give you a transition that is 'somewhat smooth'. 
	 * 
	 * Instead of the <var>linearity</var> function you can also provide your own interpolation <code>function(startValue, endValue, t)</code> which will be
	 * called every time an interpolated value is required. <var>startValue</var> and <var>endValue</var> define the start and end values. <var>t</var>
	 * is a value between 0 and 1 that specifies the state of the transition. The function should return <var>startValue</var> for 0 and 
	 * <var>endValue</var> for 1. For values between 0 and 1, the function should return a transitional value.
	 *
	 * If the start value of a property is a string containing a number, <var>animate()</var> will always ignore all the surrounding text and use the destination value as a template 
	 * for the value to write. This can cause problems if you mix units in CSS. For example, if the start value is '10%' and you specify an end value of '20px', animate
	 * will do an animation from '10px' to '20px'. It is not able to convert units. 
	 *
	 * <var>animate()</var> does not only support strings with units, but any string containing exactly one number. This allows you, among other things, with IE-specific CSS properties.
	 * For example, you can transition from a start value 'alpha(opacity = 0)' to 'alpha(opacity = 100)'. 
	 *
	 * When you animate colors, <var>animate()</var> is able to convert between the three notations rgb(r,g,b), #rrggbb or #rgb. You can use them interchangeably, but you can not 
	 * use color names such as 'red'.
	 *
	 * You can prefix any number, including numbers with units, with "-=" or "+=" in order to specify a value relative to the starting value. The new value will be added
	 * to or substracted from the start value to determine the end value.
	 *
	 * To allow more complex animation, <var>animate()</var> returns a ##promise#Promise## that is fulfulled when the animation has finished. 
	 *
	 * @example Move an element. 
	 * <pre>
	 * $('#myMovingDiv').set({$left: '0px', $top: '0px'})                // start values
	 *                  .animate({$left: '50px', $top: '100px'}, 1000);  // animation
	 * </pre>
	 *
	 * @example Using relative values for animation:
	 * <pre>
	 * $('#myMovingDiv').set({$left: '100px', $top: '100px'})                // start values
	 *                  .animate({$left: '-=50px', $top: '+=100px'}, 1000);  // animation
	 * </pre>
	 * 
	 * @example Change the color of an element:
	 * <pre>
	 * $('#myBlushingDiv').set({$backgroundColor: '#000000'})
	 *                    .animate({$backgroundColor: '#ff0000'}, 1000);
	 * </pre>
	 * 
	 * @example Fade-out effect:
	 * <pre>
	 * $('#myFadingDiv').animate({$$fade: 0}, 1000);
	 * </pre>
	 * 
 	 * @example Slide-in effect:
	 * <pre>
	 * $('#myInvisibleDiv').animate({$$slide: 1}, 1000);
	 * </pre>
	 *
	 * @example Chained animation using ##promise#Promise## callbacks. The element is first moved to the position 200/0, then to 200/200
	 *          and finally moves to 100/100.
	 * <pre>
	 * var div = $('#myMovingDiv').set({$left: '0px', $top: '0px'});
	 * div.animate({$left: '200px', $top: '0px'}, 600, 0)
	 *    .then(function() {
	 *           return div.animate({$left: '200px', $top: '200px'}, 800, 0);
	 *    }).then(function() {
	 *           return div.animate({$left: '100px', $top: '100px'}, 400);
	 *    });
	 * });
	 * </pre>
	 * </pre>
	 *
	 *
	 * @param properties a property map describing the end values of the corresponding properties. The names can use the
	 *                   set() syntax ('@' prefix for attributes, '$' for styles, '$$fade' for fading and '$$slide' for slide effects). 
	 *                   Values must be either numbers, numbers with units (e.g. "2 px") or colors ('rgb(r,g,b)', '#rrggbb' or '#rgb'). 
	 *                   Number values, including those with units, can be prefixed with "+=" or "-=", meaning that the value is relative 
	 *                   to the original value and should be added or subtracted.
	 * @param durationMs optional the duration of the animation in milliseconds. Default: 500ms.
	 * @param linearity optional defines whether the animation should be linear (1), very smooth (0) or something in between. Default: 0.
	 * @param interpolationFunc optional an interpolation <code>function(startValue, endValue, t)</code> which will be
	 *             called every time an interpolated value is required:
	 *             <dl>
	 *             <dt>startValue</dt><dd>The start value of the transition.</dd>
	 *             <dt>endValue</dt><dd>The end value of the transition.</dd>
	 *             <dt>t</dt><dd>A value between 0 and 1 that specifies the state of the transition.</dd>
	 *             <dt class="returnValue">(callback return value)</dt><dd>The value at the time <var>t</var>.</dd>
	 *             </dl> 
	 * @param state optional if set, the animation controller will write information about its state in this object. When <var>animate()</var> returns,
	 *                       there will be a <var>stop()</var> function in the property <var>state.stop</var> that can be used to abort the animation. 
	 *                       The property <var>state.time</var> will be continously updated while the animation is running
	 *                       and contains the number of milliseconds that have passed from the start, allowing you to track the progress of the animation. 
	 *                       If the animation finished, controller writes null into <var>state.time</var>. <var>state.stop</var> will not be 
	 *                       modified and can still be safely invoked even when the animation ended. 
	 * @return a ##promise#Promise## object to monitor the animation's progress. 
	 *         It is fulfilled when the animation ended, and rejected if the animation had been stopped.
	 *         The fulfillment handler will be called as <code>function(list)</code>:
	 *         <dl><dt>list</dt><dd>A reference to the animated list.</dd></dl> 
	 *         The rejection handler is called as <code>function()</code> without arguments. 
	 */
	'animate': function (properties, durationMs, linearity, state) {
		// @cond debug if (!properties || typeof properties == 'string') error('First parameter must be a map of properties (e.g. "{top: 0, left: 0}") ');
		// @cond debug if (linearity && !isFunction(linearity) && (linearity < 0 || linearity > 1)) error('Third parameter must be at least 0 and not larger than 1.');
		// @cond debug var colorRegexp = /^(rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|#\w{3}|#\w{6})\s*$/i;
		var self = this;
		var initState = []; // for each item contains a map {s:{}, e:{}, o} s/e are property name -> startValue of start/end. The item is in o.
		var numRegExp = /-?[\d.]+/;
		var loopStop;
		var prom = promise();
		var interpolate = isFunction(linearity) ? linearity : function(startValue, endValue, t) {
			return startValue + t * (endValue - startValue) * (linearity + (1-linearity) * t * (3 - 2*t)); 
		};
		state = state || {};
		state['time'] = 0;
		state['stop'] = function() { loopStop(); prom(false); };
		durationMs = durationMs || 500;
		linearity = linearity || 0;

		// find start values
		each(self, function(li) {
			var p = {o:$(li), e:{}}; 
			eachObj(p.s = p.o.get(properties), function(name, start) {
				var dest = properties[name];
				if (name == '$$slide') 
					dest = dest*getNaturalHeight(p.o) + 'px';
				p.e[name] = /^[+-]=/.test(dest) ?
						replace(dest.substr(2), numRegExp, extractNumber(start) + extractNumber(replace(dest, /\+?=/))) 
						: dest;
			});
			initState.push(p);
		});

		// start animation
		loopStop = $.loop(function(timePassedMs) { 
			function getColorComponent(colorCode, index) {
				return (/^#/.test(colorCode)) ?
					parseInt(colorCode.length > 6 ? colorCode.substr(1+index*2, 2) : ((colorCode=colorCode.charAt(1+index))+colorCode), 16)
					:
					parseInt(replace(colorCode, /[^\d,]+/g).split(',')[index]);
			}

			state['time'] = timePassedMs;
			if (timePassedMs >= durationMs || timePassedMs < 0) {
				each(initState, function(isi) { // set destination values
					isi.o.set(isi.e);
				});
				loopStop();
				state['time'] = null;
				prom(true, [self]);
			}
			else
				each(initState, function(isi) {
					eachObj(isi.s, function(name, start) {
						var newValue = 'rgb(', end=isi.e[name];
						var t = timePassedMs/durationMs;
						if (/^#|rgb\(/.test(end)) { // color in format '#rgb' or '#rrggbb' or 'rgb(r,g,b)'?
							for (var i = 0; i < 3; i++) 
								newValue += Math.round(interpolate(getColorComponent(start, i), getColorComponent(end, i), t)) + (i < 2 ? ',' : ')');
						}
						else 
							newValue = replace(end, numRegExp, toString(interpolate(extractNumber(start), extractNumber(end), t)));
						isi.o.set(name, newValue);
					});
				});
			});
			return prom;		
		},

		/*$
		 * @id toggle
		 * @group ANIMATION
		 * @requires animate set
		 * @configurable default
		 * @name .toggle()
		 * @syntax toggle(cssClasses)
		 * @syntax toggle(state1, state2)
		 * @syntax toggle(state1, state2, durationMs)
		 * @syntax toggle(state1, state2, durationMs, linearity)
		 * @syntax toggle(state1, state2, durationMs, interpolationFunction)
		 * @module WEB
		 * 
		 * Creates a function that switches between the two given states for the list. The states use the ##set() property syntax. You can also
		 * just pass a string of CSS classes, as you do with <var>set()</var>.
		 *
 	     * If no duration is given, the returned function changes the state immediately using ##set(). If a duration has been passed, the returned function
 	     * uses ##animate() to smoothly transition the state. If the returned function is invoked while an animation is running, it interrupts the 
 	     * animation and returns to the other state.
		 *
		 * @example Creates a toggle function that changes the background color of the page.
		 * <pre>
		 * var light = $('body').set({$backgroundColor: #000}, {$backgroundColor: #fff});
		 * light();      // toggles state to second state
		 * light(false); // sets first state (background color to #000).
		 * light(true);  // sets second state (background color to #fff).
		 * light();      // toggles state to first state
		 * </pre>
		 * 
		 * @example Takes the previous function, but adds it as an onclick event handler that toggles the color.
		 * <pre>
		 * var light = $('body').toggle({$backgroundColor: #000}, {$backgroundColor: #fff});
		 * $('#mySwitch').on('click', light);
		 * </pre>
		 *
		 * @example Using an animated transition by passing a duration:
		 * <pre>
		 * var dimmer = $('body').toggle({$backgroundColor: #000}, {$backgroundColor: #fff}, 500);
		 * $('#mySwitch').on('click', dimmer);
		 * </pre>
		 *
		 * @example Toggling CSS classes using the full syntax:
		 * <pre>
		 * var t = $('#myElement').toggle({$: '-myClass1 -myClass2'}, {$: '+myClass1 +myClass2'});
		 * $('#myController').on('click', t);
		 * </pre>
		 *
		 * @example There is a shortcut for toggling CSS classes. Just list them space-separated in a string:
		 * <pre>
		 * var t = $('#myElement').toggle('myClass1 myClass2');
		 * </pre>
		 * 
		 * @param cssClasses a string containing space-separated CSS class names to toggle. Classes are disabled in the first state
		 *                   and enabled in the second.
		 * @param state1 a property map in ##set() syntax describing the initial state of the properties. The properties will automatically be set when the
		 *                   <var>toggle()</var> function is created. The properties will be set for all elements of the list.
		 * @param state2 a property map describing the second state of the properties. Uses ##set() syntax, like the other state. 
		 * @param durationMs optional if set, the duration of the animation in milliseconds. By default, there is no animation and the 
		 * 					 properties will be changed immediately.
		 * @param linearity optional defines whether the animation should be linear (1), very smooth (0) or something in between. Default: 0. Ignored if durationMs is 0.
		 * @param interpolationFunc optional an interpolation <code>function(startValue, endValue, t)</code> for the animation which will be called every 
		 *     time an interpolated value is required: 
		 *           <dl>
	 	 *             <dt>startValue</dt><dd>The start value of the transition.</dd>
	 	 *             <dt>endValue</dt><dd>The end value of the transition.</dd>
	 	 *           <dt>t</dt><dd>A value between 0 and 1 that specifies the state of the transition.</dd>
	 	 *             <dt class="returnValue">(callback return value)</dt><dd>The value at the time <var>t</var>.</dd>
	 	 *             </dl> 		 
	 	 * @return a toggle function <code>function(newState)</code> that will toggle between the two states, or set a specific state.
		 *             <dl>
		 *             <dt>newState (optional)</dt><dd>If a boolean <var>true</var or <var>false</var> is given, 
		 *             the toggle will set the first or second state, respectively. If called with any other value, or without a value,
		 *             the function toggles to the other state.</dd></dl>
		 */
		'toggle': function(state1, state2, durationMs, linearity) {
			var self = this;
			var animState = {};
			var state = false, regexg = /\b(?=\w)/g;

			return !state2 ?
				self['toggle'](replace(state1, regexg, '-'), replace(state1, regexg, '+')) :			
				self['set'](state1) && 
			    function(newState) {
					if (newState === state) 
						return;
					state = newState===true||newState===false ? newState : !state;

					if (durationMs) 
						self['animate'](state ? state2 : state1, animState['stop'] ? (animState['stop']() || animState['time']) : durationMs, linearity, animState);
					else
						self['set'](state ? state2 : state1); 
				};
		},

		/*$
		 * @id on
		 * @group EVENTS
		 * @requires dollar
		 * @configurable default
		 * @name .on()
		 * @syntax on(names, eventHandler)
		 * @syntax on(names, customFunc, args)
		 * @syntax on(names, customFunc, fThis, args)
		 * @module WEB
		 * Registers the function as event handler for all items in the list.
		 * 
		 * By default, Minified cancels event propagation and the element's default behaviour for all elements that have an event handler. 
		 * You can override this by prefixing the event name with a '|' or by returning a 'true' value in the handler, which will reinstate 
		 * the original JavaScript behaviour.
		 * 
		 * Handlers are called with the original event object as first argument, the index of the source element in the 
		 * list as second argument and 'this' set to the source element of the event (e.g. the button that has been clicked). 
		 * 
		 * Instead of the event objects, you can also pass an array of arguments and a new value for 'this' to the callback. 
		 * When you pass arguments, the handler's return value is always ignored and the event with unnamed prefixes 
		 * will always be cancelled.
		 * 
		 * Event handlers can be unregistered using #off#$.off().
		 * 
		 * @example Adds a handler to all divs which paints the div background color to red when clicked. 
		 * <pre>
		 * $('div').on('click', function() {
		 *    this.style.backgroundColor = 'red';    // 'this' contains the element that caused the event
		 * });
		 * </pre>
		 *
		 * @example Registers a handler to call a method setStatus('running') using an inline function:
		 * <pre>
		 * $('#myButton').on('click', function() {
		 *    myObject.setStatus('running');
		 * });
		 * </pre>
		 * The previous example can bere written like this, using <var>on()</var>'s <var>args</var> and <var>fThis</var> parameters:
		 * <pre>
		 * $('#myButton').on('click', myObject.setStatus, myObject, ['running']);
		 * </pre>
		 *
		 * @example Adds two handlers on an input field. The event names are prefixed with '|' and thus keep their original behaviour: 
		 * <pre>
		 * $('#myInput').on('|keypress |keydown', function() {
		 *    // do something
		 * });
		 * </pre>
		 * 
		 * @param names the space-separated names of the events to register for, e.g. 'click'. Case-sensitive. The 'on' prefix in front of 
		 *             the name must not used. You can register the handler for more than one event by specifying several 
		 *             space-separated event names. If the name is prefixed
		 *             with '|' (pipe), the handler's return value is ignored and the event will be passed through the event's default actions will 
		 *             be executed by the browser. 
		 * @param eventHandler the callback <code>function(event, index)</code> to invoke when the event has been triggered:
		 * 		  <dl>
	 	 *             <dt>event</dt><dd>The original DOM event object.</dd>
	 	 *             <dt>index</dt><dd>The index of the target object in the ##list#Minified list## .</dd>
	 	 *             <dt class="returnValue">(callback return value)</dt><dd>Unless the handler returns <var>true</var> 
	 	 *             or the event name is prefixed by '|', all further processing of the event will be 
		 *                stopped and event bubbling will be disabled.</dd>
	 	 *             </dl>
		 *             'this' is set to the element that caused the event.
		 * @param customFunc a function to be called instead of a regular event handler with the arguments given in <var>args</var>
		 *                   and optionally the 'this' context given using <var>fThis</var>.
		 * @param fThis optional an value for 'this' in the custom callback, as alternative to the event target
		 * @param args optional an array of arguments to pass to the custom callback function instead of the event objects. 
		 *                      If you pass custom arguments, the return value of the handler will always be ignored.
		 * @return the list
		 */
		'on': function (eventName, handler, fThisOrArgs, args) {
			// @cond debug if (!(name && handler)) error("Both parameters to on() are required!"); 
			// @cond debug if (/^on/i.test(name)) error("The event name looks invalid. Don't use an 'on' prefix (e.g. use 'click', not 'onclick'");
			return each(this, function(el, index) {
				each(eventName.split(/\s/), function(namePrefixed) {
					var name = replace(namePrefixed, /\|/);
					var h = function(event) {
						var e = event || _window.event;
						// @cond debug try {
						if ((!handler.apply(args ? fThisOrArgs : e.target, args || fThisOrArgs || [e, index]) || args) && namePrefixed==name) {
								e.preventDefault();
								e.stopPropagation();
						}
						// @cond debug } catch (ex) { error("Error in event handler \""+name+"\": "+ex); }
					};
					(handler['M'] = handler['M'] || []).push({'e':el, 'h':h, 'n': name});
						el.addEventListener(name, h, true); // W3C DOM
				});
			});
		}

 	/*$
 	 * @stop
 	 */
		// @cond !on dummy:null
	}, function(n, v) {M.prototype[n]=v;});

 	//// MINI FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	eachObj({
	/*$
	* @id request
	* @group REQUEST
	* @requires 
	* @configurable default
	* @name $.request()
	* @syntax $.request(method, url)
	* @syntax $.request(method, url, data)
	* @syntax $.request(method, url, data, onSuccess)
	* @syntax $.request(method, url, data, onSuccess, onFailure)
	* @syntax $.request(method, url, data, onSuccess, onFailure, headers)
	* @syntax $.request(method, url, data, onSuccess, onFailure, headers, username, password)
    * @module WEB
	* Initiates a HTTP request to the given URL, using XMLHttpRequest. It returns a ##promise#Promise## object that allows you to obtain the result.
	* 
	* @example Invokes a REST web service and parse the resulting document using JSON:
	* <pre>
	* $.request('get', 'http://service.example.com/weather', {zipcode: 90210})
	*    .then(function(txt) {
	*         var json = $.parseJSON(txt);
	*         $('#weatherResult').fill('Today's forecast is is: ' + json.today.forecast);
	*    })
	*    .error(function(status, statusText, responseText) {
	*         $('#weatherResult').fill('The weather service was not available.');
	*     });
	* </pre>
	* 
	* @example Sending a JSON object to a REST web service:
	* <pre>
	* var myRequest = {         // create a request object that can be serialized via JSON
	*      request: 'register',
	*      entries: [
	*        {name: 'Joe',
	*      	    job: 'Plumber'
	*      }]};
	* 
	* function failureHandler() {
	*   $('#registrationResult').fill('Registration failed');
	* }
	*
	* $.request('post', 'http://service.example.com/directory', $.toJSON(myRequest))
	*     .then(function(txt) {
	*        if (txt == 'OK')
	*             $('#registrationResult').fill('Registration succeeded');
	*        else
	*              failureHandler();
	*        })
	*     .error(failureHandler);
	* </pre>
	*
	* 
	* @param method the HTTP method, e.g. 'get', 'post' or 'head' (rule of thumb: use 'post' for requests that change data 
	*             on the server, and 'get' to request data). Not case sensitive.
	* @param url the server URL to request. May be a relative URL (relative to the document) or an absolute URL. Note that unless you do something 
	*             fancy on the server (keyword to google:  Access-Control-Allow-Origin), you can only call URLs on the server your script originates from.
	* @param data optional data to send in the request, either as POST body or as URL parameters. It can be either an object as map of 
	*             parameters (for all HTTP methods), a string (for all HTTP methods) or a DOM document ('post' only). If the method is 
	*             'post', it will be sent as body, otherwise parameters are appended to the URL. In order to send several parameters with the 
	*             same name, use an array of values in the map. Use null as value for a parameter without value.
	* @param headers optional a map of HTTP headers to add to the request. Note that you should use the proper capitalization for the
	*                header 'Content-Type', if you set it, because otherwise it may be overwritten.
	* @param username optional username to be used for HTTP authentication, together with the password parameter
	* @param password optional password for HTTP authentication
	* @return a ##promise#Promise## containing the request's status. If the request has successfully completed with HTTP status 200, 
	*         the success handler will be called as <code>function(text, xml)</code>:
	*         <dl><dt>text</dt><dd>The response sent by the server as text.</dd>
	*         <dt>xml</dt><dd>If the response was a XML document, the DOM <var>Document</var>. Otherwise null.</a>.</dd></dl>
	*         The failure handler will be called as <code>function(statusCode, statusText, text)</code>:
	*         <dl><dt>statusCode</dt><dd>The HTTP status (never 200; 0 if no HTTP request took place).</dd>
	*         <dt>statusText</dt><dd>The HTTP status text (or null, if the browser threw an exception).</dd>
	*         <dt>text</dt><dd>the response's body text, if there was any, or the exception as string if the browser threw one.</a>.</dd></dl>
	*/
	'request': function (method, url, data, headers, username, password) {
		// @cond debug if (!method) error("request() requires a HTTP method as first argument.");
		// @cond debug if (!url) error("request() requires a url as second argument.");
		// @cond debug if (onSuccess && typeof onSuccess != 'function') error("request()'s fourth argument is optional, but if it is set, it must be a function.");
		// @cond debug if (onFailure && typeof onFailure != 'function') error("request()'s fifth argument is optional, but if it is set, it must be a function.");
		// @cond debug if (username && !password) error("If the user name is set (7th argument), you must also provide a password as 8th argument.");		method = method.toUpperCase();
		/** @const */ var ContentType = 'Content-Type';
		var xhr, body = data, callbackCalled = 0, prom = promise();
		try {
			xhr = new XMLHttpRequest();
			if (data != null) {
				headers = headers || {};
				if (!isString(data) && !isNode(data)) { // if data is parameter map...
					body = collectObj(data, function processParam(paramName, paramValue) {
						if (isList(paramValue))
							return collect(paramValue, function(v) {return processParam(paramName, v);});
						else
							return encodeURIComponent(paramName) + ((paramValue != null) ?  '=' + encodeURIComponent(paramValue) : '');
					}).join('&');
				}

				if (!/post/i.test(method)) {
					url += '?' + body;
					body = null;
				}
				else if (!isNode(data) && !isString(data) && !headers[ContentType])
					headers[ContentType] = 'application/x-www-form-urlencoded';
			}

			xhr.open(method, url, true, username, password);
			eachObj(headers, function(hdrName, hdrValue) {
				xhr.setRequestHeader(hdrName, hdrValue);
			});

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && !callbackCalled++) {
					if (xhr.status == 200) {
						prom(true, [xhr.responseText, xhr.responseXML]);
					}
					else
						prom(false, [xhr.status, xhr.statusText, xhr.responseText]);
				}
			};

			xhr.send(body);
		}
		catch (e) {
			if (!callbackCalled) 
				prom(false, [0, null, toString(e)]);
		}
		return prom;
	},

	/*
	 * JSON Module. Uses browser built-ins or json.org implementation if available. Otherwise its own implementation,
	 * originally based on public domain implementation http://www.JSON.org/json2.js / http://www.JSON.org/js.html.
	 * Extremely simplified code, made variables local, removed all side-effects (especially new properties for String, Date and Number).
	 */

	/*$
    * @id tojson
    * @group JSON
    * @requires ucode 
    * @configurable default
    * @name $.toJSON()
    * @syntax $.toJSON(value)
    * @module WEB
    * Converts the given value into a JSON string. The value may be a map-like object, an array or list, a string, number, boolean or null.
   	* If you build Minified without Internet Explorer compatibility, this is just an alias for <var>JSON.stringify</var>.
	*
    * The following types are supported by the built-in implementation:
    * <ul>
    *   <li>Objects (direct properties will be serialized)</li>
    *   <li>Arrays/Lists (with <var>length</var> property)</li>
    *   <li>Strings</li>
    *   <li>Numbers</li>
    *   <li>Boolean</li>
    *   <li>null</li>
    * </ul>
    * Any other types in your JSON tree, especially Dates, should be converted into Strings by you.
    *
    * @example Converts an object into a JSON object:
    * <pre>
    * var myObj = {name: 'Fruits', roles: ['apple', 'banana', 'orange']};
    * var jsonString = $.toJSON(myObj);
    * </pre>
    * 
    * @param value the value (map-like object, array/list, string, number, boolean or null)
    * @return the JSON string
    */
    'toJSON': _window.JSON && JSON.stringify,

	/*$
	* @id parsejson
	* @group JSON
	* @requires ucode
	* @configurable default
	* @name $.parseJSON()
	* @syntax $.parseJSON(text)
    * @module WEB
	* Parses a string containing JSON and returns the de-serialized object.
	* If the browser's built-in function <var>JSON.parse</var> is defined, which it is in pretty all browsers except 
	* Internet Explorer 7 and earlier, it will be used. This is mainly to prevent possible security problems caused 
	* by the use of <var>eval</var> in the implementation. Only in browsers without
	* <var>JSON.parse</var> Minified's own implementation will be used.
	* 
	* If you use a Minified build without Internet Explorer 7 compatibility, <var>JSON.parse</var> will always be used.
	*
	* @example Parsing a JSON string:
	* <pre>
	* var jsonString = "{name: 'Fruits', roles: ['apple', 'banana', 'orange']}";
	* var myObj = $.parseJSON(jsonString);
	* </pre>
	*
	* @param text the JSON string
	* @return the resulting JavaScript object. <var>Undefined</var> if not valid.
	*/
    'parseJSON': _window.JSON && JSON.parse,

	/*$
    * @id ready
    * @group EVENTS
    * @requires ready_vars ready_init
    * @configurable default
    * @name $.ready()
    * @syntax $.ready(handler)
    * @module WEB
    * Registers a handler to be called as soon as the HTML has been fully loaded. Does not necessarily wait for images and other elements, 
    * only the main HTML document needs to be complete. On older browsers, it is the same as <var>window.onload</var>. 
    * 
    * If you call <var>ready()</var> after the page is completed, the handler is scheduled for invocation in the event loop as soon as possible.
    *
    * @example Registers a handler that sets some text in an element:
    * <pre>
    * $.ready(function() {
    *   $('#someElement').fill('ready() called');
    * });
    * </pre>
    *
    * @param handler the <code>function()</code> to be called when the HTML is ready.
    */
    'ready': ready,

	/*$
     * @id setcookie
     * @group COOKIE
     * @configurable default
     * @name $.setCookie()
     * @syntax $.setCookie(name, value)
     * @syntax $.setCookie(name, value, dateOrDays)
     * @syntax $.setCookie(name, value, dateOrDays, path)
     * @syntax $.setCookie(name, value, dateOrDays, path, domain)
     * @module WEB
     * Creates, updates or deletes a cookie. If there is an an existing cookie
     * of the same name, will be overwritten with the new value and settings.
     * 
     * To delete a cookie, overwrite it with an expiration date in the past. The easiest way to do this is to 
     * use <code>-1</code> as third argument.
     *
     * @example Reads the existing cookie 'numberOfVisits', increases the number and stores it:
     * <pre>
     * var visits = $.getCookie('numberOfVisits');
     * $.setCookie('numberOfVisits', 
     *                      visits ? (parseInt(visits) + 1) : 1,   // if cookie not set, start with 1
     *                      365);                                  // store for 365 days
     * </pre>
     * 
     * @example Deletes the cookie 'numberOfVisits':
     * <pre>
     * $.setCookie('numberOfVisits', '', -1);
     * </pre>
     * 
     * @param name the name of the cookie. This should ideally be an alphanumeric name, as it will not be escaped by Minified and this
     *             guarantees compatibility with all systems.
     *             If it contains a '=', it is guaranteed not to work, because it breaks the cookie syntax. 
     * @param value the value of the cookie. All characters can be used. Non-Alphanumeric other than "*@-_+./" will be escaped using the 
     *              JavaScript <var>escape()</var> function, unless you set the optional <var>dontEscape</var> parameter.
     * @param dateOrDays optional specifies when the cookie expires. Can be either a Date object or a number that specifies the
     *                   amount of days. If not set, the cookie has a session lifetime, which means it will be deleted as soon as the
     *                   browser has been closed. If the number negative or the date in the past, the cookie will be deleted.
     * @param path optional if set, the cookie will be restricted to documents in the given path. Otherwise it is valid
     *                       for the whole domain. This is rarely needed and defaults to '/'.
     * @param domain optional if set, you use it to specify the domain (e.g. example.com) which can read the cookie. If you don't set it,
     *               the domain which hosts the current document is used. This parameter is rarely used, because there are only very
     *               few use cases in which this makes sense.
     * @param dontEscape optional if set, the cookie value is not escaped. Note that without escaping you can not use every possible
     *                    character (e.g. ";" will break the cookie), but it may be needed for interoperability with systems that need
     *                    some non-alphanumeric characters unescaped or use a different escaping algorithm.
     */
    'setCookie': function(name, value, dateOrDays, path, domain, dontEscape) {
		// @cond debug if (!name) error('Cookie name must be set!');
		// @cond debug if (/[^\w\d-_%]/.test(name)) error('Cookie name must not contain non-alphanumeric characters other than underscore and minus. Please escape them using encodeURIComponent().');
    	_document.cookie = name + '=' + (dontEscape ? value : escape(value)) + 
    	    (dateOrDays ? ('; expires='+(isObject(dateOrDays) ? dateOrDays : new Date(now() + dateOrDays * 8.64E7)).toUTCString()) : '') + 
    		'; path=' + (path ? escapeURI(path) : '/') + (domain ? ('; domain=' + escape(domain)) : '');
    },

    /*$
     * @id getcookie
     * @group COOKIE
     * @requires
     * @configurable default
     * @name $.getCookie()
     * @syntax $.getCookie(name)
     * @syntax $.getCookie(name, dontUnescape)
     * @module WEB
     * Tries to find the cookie with the given name and returns it.
     *
     * @example Reads the existing cookie 'numberOfVisits' and displays the number in the element 'myCounter':
     * <pre>
     * var visits = $.getCookie('numberOfVisits');
     * if (!visits)    // check whether cookie set. Null if not
     *     $('#myCounter').set('innerHML', 'Your first visit.');
     * else
     *     $('#myCounter').set('innerHTML', 'Visit No ' + visits);
     * </pre>
     *  
     * @param name the name of the cookie. Should consist of alphanumeric characters, percentage, minus and underscore only, as it will not be escaped. 
     *             You may want to escape the name using <var>encodeURIComponent()</var> for all other characters.
     * @param dontUnescape optional if set and true, the value will be returned unescaped. Use this parameter only if the value has been encoded
     *                     in a special way, and not with the JavaScript <var>encode()</var> method.
     * @return the value of the cookie, or null if not found. Unless <var>dontUnescape</var> has been set, the value has been unescaped
     *         using JavaScript's <code>unescape()</code> function.
     */
    'getCookie': function(name, dontUnescape) {
    	// @cond debug if (!name) error('Cookie name must be set!');
    	// @cond debug if (/[^\w\d-_%]/.test(name)) error('Cookie name must not contain non-alphanumeric characters other than underscore and minus. Please escape them using encodeURIComponent().');
    	var regexp, match = (regexp = new RegExp('(^|;)\\s*'+name+'=([^;]*)').exec(_document.cookie)) && regexp[2];
    	return dontUnescape ? match : match && unescape(match);
    },

	/*$
	* @id loop
	* @group ANIMATION
	* @requires animation_vars 
	* @configurable default
	* @name $.loop()
	* @syntax $.loop(paintCallback)
    * @module WEB
	* Runs an animation loop. The given callback method will be invoked repeatedly to create a new animation frame.
	* In modern browsers, <var>requestAnimationFrame</var> will be used to invoke the callback every time the browser is ready for a new 
	* animation frame. 
	* The exact frequency is determined by the browser and may vary depending on factors such as the time needed to 
	* render the current page, the screen's framerate and whether the page is currently visible to the user. 
	* In older browsers, the callback function will be invoked approximately every 33 milliseconds.
	* 
	* An animation loop runs indefinitely. To stop it, you have two options:
	* <ul><li><var>$.loop()</var> returns a <var>stop()</var> function. If you invoke it, the animation loops ends</li>
	* <li>The animation callback receives the same <var>stop()</var> function as second argument, so the callback can end the animation itself</li>
	* </ul>
	*
	* @example Animates a div by moving along in a circle.
	* <pre>
	*   var myDiv = $$('#myAnimatedDiv');
	*   var rotationsPerMs = 1000;                           // one rotation per second
	*   var radius = 100;
	*   var d = 3000;                                        // duration in ms
	*   $.loop(function(t, stopFunc) {
	*     if (t > d) {                                       // time is up: call stopFunc()!
	*       stopFunc();
	*       return;
	*     }
	* 
	*     var a = 2 * Math.PI * t / rotationsPerMs           // angular position
	*     myDiv.style.left = (radius * Math.cos(a) + ' px';
	*     myDiv.style.top = (radius * Math.sin(a) + ' px';
	*   });
	* </pre>
	*
	* @param paintCallback a callback <code>function(timestamp, stopFunc)</code> to invoke for painting. Parameters given to callback:
	* <dl>
	*            <dt>timestamp</dt><dd>The number of miliseconds since animation start.</dd>
	*            <dt>stop</dt><dd>Call this <code>function()</code> to stop the currently running animation.</dd>
	* </dl>
	* The callback's return value will be ignored.
	* @return a <code>function()</code> that stops the currently running animation. This is the same function that is also given to the callback.
	*/
	'loop': function(paintCallback) { 
        var entry = {c: paintCallback, t: now()};
        entry.s = function() {
    		for (var i = 0; i < ANIMATION_HANDLERS.length; i++) // can't use each() or filter() here, list may be modified during run!!
    			if (ANIMATION_HANDLERS[i] === entry) 
    				ANIMATION_HANDLERS.splice(i--, 1);
        };

        if (ANIMATION_HANDLERS.push(entry) < 2) { // if first handler.. 
			(function raFunc() {
				if (each(ANIMATION_HANDLERS, function(a) {a.c(Math.max(0, now() - a.t), a.s);}).length) // check len after run, in case the callback invoked stop func
					REQUEST_ANIMATION_FRAME(raFunc); 
			})(); 
        } 
        return entry.s; 
    },

	/*$
	 * @id wait
	 * @configurable default
	 * @requires
	 * @name $.wait()
	 * @syntax $.wait()
	 * @syntax $.wait(durationMs)
	 * @module WEB
	 *
	 * Creates a new promise that will be fulfilled as soon as the specified number of milliseconds have passed. This is mainly useful for animation,
	 * because it allows you to chain delays into your animation chain.
	 *
	 * @example Chained animation using ##promise#Promise## callbacks. The element is first moved to the position 200/0, then to 200/200, waits for 50ms 
	 *          and finally moves to 100/100.
	 * <pre>
	 * var div = $('#myMovingDiv').set({$left: '0px', $top: '0px'});
	 * div.animate({$left: '200px', $top: '0px'}, 600, 0)
	 *    .then(function() {
	 *           div.animate({$left: '200px', $top: '200px'}, 800, 0);
	 *    }).then(function() {
	 *    		 return $.wait(50);
	 *    }).then(function() {
	 *           div.animate({$left: '100px', $top: '100px'}, 400);
	 *    });
	 * });
	 * </pre>
	 *
	 *
	 * @param durationMs optional the number of milliseconds to wait. If omitted, the promise will be fulfilled as soon as the browser can run it
	 *                   from the event loop.
	 * @param args optional an array of arguments to pass to the promise handler
	 * @return a ##promise#Promise## object that will be fulfilled when the time is over. It will never fail. The promise argument is the 
	 *         <var>args</var> parameter as given to <var>wait()</var>.
	 */
	'wait': function(durationMs, args) {
		var p = promise();
		delay(function() {p(true, args);}, durationMs);
		return p;
	},

    /*$
	 * @id off
	 * @group EVENTS
	 * @requires on
	 * @configurable default
	 * @name $.off()
	 * @syntax $.off(handler)
     * @module WEB
	 * Removes the given event handler. The call will be ignored if the given handler has not been registered using ##on(). 
	 * If the handler has been registered for more than one element or event, it will be removed from all instances.
	 * 
	 * @example Adds a handler to an element:
	 * <pre>
	 * function myEventHandler() {
	 *    this.style.backgroundColor = 'red';        // 'this' contains the element that caused the event
	 * }
	 * $('#myElement').on('click', myEventHandler);  // add event handler
	 *
	 * window.setInterval(function() {               // after 5s, remove event handler
	 *    $.off(myEventHandler);
	 * }, 5000);
	 * </pre>
	 * 
	 * @param handler the handler to unregister, as given to ##on(). It must be a handler that has previously been registered using ##on().
	 *                If the handler is not registered as event handler, the function does nothing.
     */
	'off': function (handler) {
		// @cond debug if (!handler || !handler['M']) error("No handler given or handler invalid.");
	   	each(handler['M'], function(h) {	
				h['e'].removeEventListener(h['n'], h['h'], true); // W3C DOM
		});
		handler['M'] = null;
	}

 	/*$
 	 * @stop
 	 */
	// @cond !off dummy:null

	}, function(n, v) {$[n]=v;});

	//// GLOBAL INITIALIZATION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*$
	 * @id ready_init
	 * @dependency
     */

    	_document.addEventListener("DOMContentLoaded", triggerDomReady, false);
	/*$
	 @stop
	 */

    // @condblock amdsupport
	return {
	// @condend amdsupport

	// @cond !amdsupport var MINI = {

		/*$
		 * @id dollar
		 * @group SELECTORS
		 * @requires dollarraw 
		 * @dependency yes
		 * @name $()
		 * @syntax $(selector)
		 * @syntax $(selector, context)
		 * @syntax $(selector, context, childOnly)
		 * @syntax $(list)
		 * @syntax $(list, context)
		 * @syntax $(list, context, childOnly)
		 * @syntax $(object)
		 * @syntax $(object, context)
		 * @syntax $(object, context, childOnly)
		 * @syntax $(domreadyFunction)
         * @module WEB
		 * Creates a new ##list#Minified list##, or register a DOMReady-handler. 
		 * The most common usage is with a CSS-like selector. <var$()</var> will then create a list containing all elements of the current HTML
		 * document that fulfill the filter conditions. Alternatively you can also specify a list of objects or a single object. 
		 * Nested lists will automatically be flattened, and nulls will automatically be removed from the resulting list.
		 * 
		 * Additionally, you can specify a second argument to provide a context. Contexts only make sense if you selected only
		 * HTML nodes with the first parameter. Then the context limits the resulting list to include only those nodes 
		 * that are descendants of the context nodes. The context can be either a selector, a list or a single HTML node, and will be 
		 * processed like the first argument. A third arguments allows you to limit the list to 
		 * only those elements that are direct children of the context nodes (so a child of a child would be filtered out).
		 *
		 * 
		 * As a special shortcut, if you pass a function to <var>$()</var>, it will be registered using #ready#$.ready() to be executed 
		 * when the DOM model is complete.
		 *
		 * @example A simple selector to find an element by id.
		 * <pre>
		 * var l0 = $('#myElementId');
		 * </pre>
		 * 	 
		 * @example You can pass a reference to a DOM node to the function to receive a list containing only this node:
		 * <pre>
		 * var l1 = $(document.getElementById('myElementId')); 
		 * </pre>
		 *
		 * @example Lists and arrays will be copied:
		 * <pre>
		 * var l2 = $([elementA, elementB, elementC]); 
		 * </pre>
		 * 	 
		 * @example Lists will be automatically flattened and nulls removed. So this list <var>l3</var> has the same content as <var>l2</var>:
		 * <pre>
		 * var l3 = $([elementA, [elementB, null, elementC], null]); 
		 * </pre>
		 * 	 
		 * @example This is a simple selector to find all elements with the given class.
		 * <pre>
		 * var l4 = $('.myClass');
		 * </pre>
		 * 	 
		 * @example A selector to find all elements with the given name.
		 * <pre>
		 * var l5 = $('input'); // finds all input elements
		 * </pre>
		 * 	 
		 * @example A selector to find all elements with the given name and class.
		 * <pre>
		 * var l6 = $('input.myRadio'); // finds all input elements with class 'myRadio'
		 * </pre>
		 * 	 
		 * @example A selector to find all elements that are descendants of the given element.
		 * <pre>
		 * var l7 = $('#myForm input'); // finds all input elements that are in the element with the id myForm
		 * </pre>
		 * 	 
		 * @example A selector to find all elements that have either CSS class 'a' or class 'b':
		 * <pre>
		 * var l8 = $('.a, .b'); // finds all elements that have either the class a or class b
		 * </pre>
		 * 	 
		 * @example A selector that finds all elements that are descendants of the element myDivision, are inside a .myForm class and are input elements:
		 * <pre>
		 * var l9 = $('#myDivision .myForm input'); 
		 * </pre>
		 * 	 
		 * @example Using contexts to make it easier to specify ancestors:
		 * <pre>
		 * var l10 = $('.myRadio', '#formA, #formB, #formC'); 
		 * </pre>
		 * The result is identical to:
		 * <pre>
		 * var l10 = $('#formA .myRadio, #formB .myRadio, #formC .myRadio'); 
		 * </pre>
		 *  	 
		 * @example Using one of the list functions, ##set(), on the list, and setting the element's text color. '$' at the beginning of the property name sets a CSS value.
		 * <pre>
		 * $('#myElementId').set('$color', 'red');
		 * </pre>
		 *
		 * @example Most list methods return the list you invoked them on, allowing you to chain them:
		 * <pre>
		 * $('#myForm .myRadio').addClass('uncheckedRadio')
		 *                      .set('checked', true)
		 *                      .on('click', function() {
		 *                             $(this).set({@: 'uncheckedRadio');
		 *                      });
		 * </pre>
		 * 
		 * @example Using $() as a #ready#$.ready() shortcut:
		 * <pre>
		 * $(function() {
		 *   // in here you can safely work with the HTML document
		 * });
		 * </pre>
		 * 
		 * @param selector a simple, CSS-like selector for HTML elements. It supports '#id' (lookup by id), '.class' (lookup by class),
		 *             'element' (lookup by elements) and 'element.class' (combined class and element). Use commas to combine several selectors.
		 *             You can also join two or more selectors by space to find elements which are descendants of the previous selectors.
		 *             For example, use 'div' to find all div elements, '.header' to find all elements containing a class name called 'header', and
		 *             'a.popup' for all a elements with the class 'popup'. To find all elements with 'header' or 'footer' class names, 
		 *             write '.header, .footer'. To find all divs elements below the element with the id 'main', use '#main div'.
		 *             The selector "*" will return all elements.
		 * @param list a list to copy. It can be an array, another Minified list, a DOM nodelist or anything else that has a <var>length</var> property and
		 *             allows read access by index. A shallow copy of the list will be returned. Nulls will be automatically removed from the copy. Nested lists 
		 *             will be flattened, so the result only contains nodes.
		 * @param object a object to create a single-element list containing only the object. If the object argument is null, an empty list will be returned.
		 * @param domreadyFunction a function to be registered using #ready#$.ready().
		 * @param context optional an optional selector, node or list of nodes which specifies one or more common ancestor nodes for the selection, using the same syntax variants as the
		 *             first argument. If given, the returned list contains only descendants of the context nodes, all others will be filtered out. 
		 * @param childOnly optional if set, only direct children of the context nodes are included in the list. Children of children will be filtered out. If omitted or not 
		 *             true, all descendants of the context will be included. 
		 * @return the array-like ##list#Minified list## object containing the content specified by the selector. 
		 *             Please note that duplicates (e.g. created using the comma-syntax or several context nodes) will not be removed. If the first argument was a list, 
		 *             the existing order will be kept. If the first argument was a simple selector, the nodes are in document order. If you combined several selectors 
		 *             using commas, only the individual results of the selectors will keep the document order, but will then be joined to form a single list. This list will, 
		 *             not be in document order anymore, unless you use a build without legacy IE support.
		 */
		'$': $,

	    /*$
		 * @id dollardollar
		 * @group SELECTORS
		 * @requires dollarraw
		 * @configurable default
		 * @name $$()
		 * @syntax $$(selector)
		 * @shortcut $$() - It is recommended that you assign MINI.$$ to a variable $$.
         * @module WEB
		 * Returns a DOM object containing the first match of the given selector, or <var>undefined</var> if no match was found. 
		 * <var>$$</var> allows you to easily access an element directly. It is the equivalent to writing "$(selector)[0]".
		 *
		 * Please note that the function <var>$$</var> will not be automatically exported by Minified. You should always import it
		 * using the recommended import statement:
		 * <pre>
		 * var MINI = require('minified'), $ = MINI.$, $$ = MINI.$$, EE = MINI.EE;
		 * </pre>
		 * 
		 * @example Select the checkbox 'myCheckbox':
		 * <pre>
		 * $$('#myCheckbox').checked = true;
		 * </pre>
		 * 
		 * @param selector a simple, CSS-like selector for the element. Uses the full syntax described in #dollar#$(). The most common
		 *                 parameter for this function is the id selector with the syntax "#id".
		 * @return a DOM object of the first match, or <var>undefined</var> if the selector did not return at least one match
		 */
	    '$$': $$,

		/*$
		 * @id ee
		 * @group ELEMENT
		 * @requires dollar set add
		 * @configurable default
		 * @name EE()
		 * @syntax EE(elementName)
		 * @syntax EE(elementName, properties)
		 * @syntax EE(elementName, children)
		 * @syntax EE(elementName, properties, children)
		 * @syntax EE(elementName, properties, children, onCreate)
		 * @shortcut EE() - It is recommended that you assign MINI.EE to a variable EE.
         * @module WEB
		 * Creates a new Element Factory. An Element Factory is a function without arguments that returns a ##list#Minified list##
		 * containing a newly created DOM element, optionally with attributes and children.
		 * Typically it will be used to insert elements into the DOM tree using ##add() or a similar function. 
		 *
		 * Please note that the function <var>EE</var> will not be automatically exported by Minified. You should always import it
		 * using the recommended import statement:
		 * <pre>
		 * var MINI = require('minified'), $ = MINI.$, $$ = MINI.$$, EE = MINI.EE;
		 * </pre>
		 * 
		 * @example Creating a simple factory for a &lt;span> element with some text:
		 * <pre>
		 * var mySpan = EE('span', 'Hello World'); 
		 * </pre>
		 * creates a factory to produce this:
		 * <pre>
		 *  &lt;span>Hello World&lt;/span> 
		 * </pre>
		 * 
		 * @example Adding the 'Hello World; &lt;span> element to all elements with the class '.greeting':
		 * <pre>
		 * $('.greeting').add(EE('span', 'Hello World')); 
		 * 
		 * @example Creating a factory for a &lt;span> element with style and some text:
		 * <pre>
		 * var span2 = EE('span', {'@title': 'Greetings'}, 'Hello World'); 
		 * </pre>
		 * The factory creates this:
		 * <pre>
		 *  &lt;span title="Greetings">Hello World&lt;/span> 
		 * </pre>
		 * 
		 * @example Creating a &lt;form> element with two text fields, labels and a submit button:
		 * <pre>var myForm = EE('form', {'@method': 'post'}, [
		 *     EE('label', {'@for': 'nameInput'}, 'Name:'),
		 *     EE('input', {'@id': 'nameInput', '@type': 'input'}),
		 *     EE('br'),
		 *     EE('label', {'@for': 'ageInput'}, 'Age:'),
		 *     EE('input', {'@id': 'ageInput', '@type': 'input'}),
		 *     EE('br'),
		 *     EE('input', {'@type': 'submit, '@value': 'Join'})
		 * ]); 
		 * </pre>
		 * results in (newlines and indentation added for readability):
		 * <pre>
		 * 	&lt;form method="post>
		 *     &lt;label for="nameInput">Name:&lt;/label>
		 *     &lt;input id="nameInput" type="input"/>
		 *     &lt;br/>
		 *     &lt;label for="ageInput"/>Age:&lt;/label>
		 *     &lt;input id="ageInput" type="input"/>
		 *     &lt;br/>
		 *     &lt;input value="Join" type="submit"/>
		 *  &lt;/form>
		 * </pre>
		 * 
		 * @example If you only want to add an attribute under a certain condition, 
		 * a simple trick is to pass null as value if you do not need it:
		 * <pre>
		 * var myInput = EE('input', {
		 * 				'@id': 'myCheckbox', 
		 * 				'@type': 'checkbox', 
		 * 				'@checked': shouldBeChecked() ? 'checked' : null
		 * 			});
		 * </pre>
		 * 
		 * @example You can set styles directly using a $ prefix for the name:
		 * <pre>
		 * var myStylesSpan = EE('span', {$color: "red", $fontWeight: "bold"}, "I'm styled");
		 * </pre>
		 * 
		 * @example To add event handlers, use the fourth argument:
		 * <pre>
		 * var myStylesSpan = EE('input', {'@name': "myInput"}, null, function(e) {
		 *     e.on('change', inputChanged);
		 * });
		 * </pre>
		 * 
		 * @param elementName the element name to create (e.g. 'div')
		 * @param properties optional an object which contains a map of attributes and other values. Uses the ##set() syntax: 
		 * 					 Attribute values are prefixed with '@', CSS styles with '$' and regular properties can be set without prefix.
		 *                   If the attribute value is null, the attribute will omitted (styles and properties can be set to null). 
		 *                   In order to stay compatible with Internet Explorer 7 and earlier, you should not set the 
		 *                   attributes '@class' and '@style'. Instead set the property 'className' instead of '@class' and set 
		 *                   styles using the '$' syntax.
		 * @param children optional  a node or a list of nodes to be added as children. Strings will be converted to text nodes. 
		 *                         Functions will be invoked and their return value will be used. Lists can be 
		 *                         nested and will then automatically be flattened. Null elements in lists will be ignored. 
		 *                         The syntax is exactly like ##add().
		 * @param onCreate optional a <code>function(elementList)</code> that will be called each time an element had been created. 
		 *                 <dl><dt>elementList</dt><dd>The newly created element wrapped in a Minified list.  </dd></dl>
		 *                 The function's return value will be ignored. 
		 *                 The callback allows you, for example, to add event handlers to the element using ##on().
		 * @return a Element Factory function, which returns a Minified list containing the DOM HTMLElement that has been created or modified as only element
		 */
		'EE': EE

	 	/*$
	 	 * @stop
	 	 */
		// @cond !ee dummy:null
	};
	// @cond !amdsupport _window['require'] = function(n) { if (n == 'minified') return MINI; };

// @condblock amdsupport
});
// @condend amdsupport

// @cond !amdsupport })();

/*$
 * @id list
 * @name Minified Lists
 * @module WEB, UTIL
 * 
 * <i>Minified lists</i> are Array-like objects provided by Minified. Like a regular JavaScript array, 
 * they provide a <var>length</var> property and you can access their content using the index operator (<code>a[5]</code>). 
 * However, they do not provide the same methods as JavaScript's native array.
 *
 * Minified lists are usually created using the #dollar#$()</a></code> function. You can
 * also use  <code>$()</code> to convert a JavaScript array into a Minified list, just be aware that <code>$()</code> will
 * remove nulls from the lists and will flatten nested lists.
 * 
 * There is currently no function to convert a Minified list into a JavaScript array. The upcoming Utility module 
 * will provide one though. 
 * 
 * The Minified Web module provides HTML-node oriented functions like ##set() to modify a list of nodes. It also has a 
 * number of helper methods for working with Minified lists:
 * <ul>
 * <li>##collect() creates a new list using the collect function which can 
 *  transform list elements or collect data from them ("map() on steriods")</li>
 * <li>##each() iterates through all list elements</li>
 * <li>##filter() creates a new list that contains only elements that pass the 
 *  filter function's test</li>
 * <li>##find() finds a list element or its position</li>
 * <li>##sub() creates a list that copies the elements from the specified index range </li>
 * </ul>
 */

/*$
 * @id promise
 * @name Promise
 * @module WEB, UTIL
 * 
 * <i>Promises</i> are objects that represent the result of an asynchronous operation. When you start such an operation, using #request#$.request(),
 * ##animate(), or ##wait(), you will get a Promise object that allows you to get the result as soon as the operation is finished.
 * 
 * Minified ships with a <a href="http://promises-aplus.github.io/promises-spec/">Promises/A+</a>-compliant implementation of Promises that should
 * be able to interoperate with most other Promises implementations.
 * 
 * What may be somewhat surprising about this Promises specification is that there is no direct way to find out the state of the operation.
 * There is neither a property nor a function to find out what the result is or whether it is available. Instead, you always have to 
 * register callbacks to find out the result. They will be invoked as soon as the operation is finished. 
 * If the operation already ended when you register the callbacks, the callback will then just be called from the event loop as soon
 * as possible (but never while the ##then() you register them with is still running).<br/>
 * This design forces you to handle the operation result asynchronously and disencourages 'bad' techniques such as polling.
 * 
 * The central method of a Promises, and indeed the only required function in Promises/A+, is ##then(). It allows you to register
 * two callback methods, one for success (called 'fulfillment' in Promises/A+ terminology) and one for failures (called 'rejection' in Promises/A+).
 * 
 * This example shows you how to use <var>then()</var>:
 * <pre>
 * $.request('get', 'http://example.com/weather?zip=90210')
 *  .then(function success(result) {
 *      alert('The weather is ' + result);
 *  }, function error(exception) {
 *  	alert('Something went wrong');
 *  });
 * </pre>
 * 
 * What makes Promises so special is that ##then() itself returns a new Promise, which is based on the Promise <var>then()</var> was called on, but can be
 * modified by the outcome of callbacks. Both arguments to <var>then()</var> are optional, and you can also write the code like this:
 * <pre>
 * $.request('get', 'http://example.com/weather?zip=90210')
 *  .then(function success(result) {
 *      alert('The weather is ' + result);
 *  })
 *  .then(null, function error(exception) {
 *  	alert('Something went wrong');
 *  });
 * </pre>
 * 
 * Because the first ##then() returns a new Promise based on the original Promise, the second <var>then()</var> will handle errors of the request just like
 * the first one did. There is only one subtle difference in the second example: the error handler will not only be called if the request failed, 
 * but also when the request succeded but the success handler threw an exception. That's one of the two differences between the original Promise and 
 * the Promise returned by <var>then()</var>. Any exception thrown in a callback causes the new Promise to be in error state. 
 * 
 * Before I show you the second difference between the original Promise and the new Promise, let me make the example a bit more readable 
 * by using ##error(), which is not part of Promises/A+, but a simple extension by Minified. It just registers the failure callback without
 * forcing you to specify <var>null</var> as first argument: 
 * <pre>
 * $.request('get', 'http://example.com/weather?zip=90210')
 *  .then(function success(result) {
 *      alert('The weather is ' + result);
 *  })
 *  .error(function error(exception) {  // error(callback) is equivalent to then(null, callback)
 *  	alert('Something went wrong');
 *  });
 * </pre>
 * 
 * A very powerful capability of Promises is that you can easily chain them. If a ##then() callback returns a value, the new Promise returned
 * by <var>then()</var> will be marked as success (fulfilled) and this value is the result of the operation. If a callback returns a Promise,
 * the new Promise will assume the state of the returned Promise. You can use the latter to create chains of asynchronous operations,
 * but you still need only a single error handler for all of them and you do not need to nest functions to achieve this:
 * <pre>
 * $.request('get', 'http://example.com/zipcode?location=Beverly+Hills,+CA')
 *  .then(function(resultZip) {
 *      return $.request('get', 'http://example.com/weather', {zip: resultZip});
 *  })
 *  .then(function(resultWeather) {
 *      alert('The weather in Beverly Hills is ' + resultWeather);
 *  })
 *  .error(function(exception) {
 *  	alert('Something went wrong');
 *  });
 * </pre>
 *  
 * Sometimes you want to just be notified of the end of an operation but are not interested in the outcome. For these cases, if you just had
 * the Promises/A+-compliant ##then() method, you would have to register the same callback handler twice. This is not very convenient,
 * especially when you define the handler function inline. Therefore Minified comes with a second small extension, ##always():
 * 
 * <pre>
 * $.request('post', 'http://example.com/pageHit', {pageId: 12345})
 *  .always(function() {   // always(callback) is equivalent to then(callback, callback)
 *      pageCountDone(); 
 *  });
 * </pre>
 * 
 * Please note that the Minified Web module only returns Promises, but it <strong>does not allow you to create Promises</strong> directly. The upcoming
 * Minified App module will allow this though.
 */

