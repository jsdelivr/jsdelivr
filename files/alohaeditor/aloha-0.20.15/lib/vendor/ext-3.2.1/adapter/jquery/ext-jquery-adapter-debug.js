/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright © 2010-2011 Gentics Software GmbH, aloha@gentics.com
* Contributors http://aloha-editor.org/contribution.php 
* Licensed unter the terms of http://www.aloha-editor.org/license.html
*//*
* Aloha Editor is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.*
*
* Aloha Editor is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/*!
 * Ext JS Library 3.2.1
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
// for old browsers
window.undefined = undefined;

/**
 * @class Ext
 * Ext core utilities and functions.
 * @singleton
 */

Ext = {
    /**
     * The version of the framework
     * @type String
     */
    version : '3.2.1',
    versionDetail : {
        major: 3,
        minor: 2,
        patch: 1
    }
};

/**
 * Copies all the properties of config to obj.
 * @param {Object} obj The receiver of the properties
 * @param {Object} config The source of the properties
 * @param {Object} defaults A different object that will also be applied for default values
 * @return {Object} returns obj
 * @member Ext apply
 */
Ext.apply = function(o, c, defaults){
    // no "this" reference for friendly out of scope calls
    if(defaults){
        Ext.apply(o, defaults);
    }
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};

(function(){
    var idSeed = 0,
        toString = Object.prototype.toString,
        ua = navigator.userAgent.toLowerCase(),
        check = function(r){
            return r.test(ua);
        },
        DOC = document,
        isStrict = DOC.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && check(/msie 7/),
        isIE8 = isIE && check(/msie 8/),
        isIE6 = isIE && !isIE7 && !isIE8,
        isGecko = !isWebKit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol);

    // remove css image flicker
    if(isIE6){
        try{
            DOC.execCommand("BackgroundImageCache", false, true);
        }catch(e){}
    }

    Ext.apply(Ext, {
        /**
         * URL to a blank file used by Ext when in secure mode for iframe src and onReady src to prevent
         * the IE insecure content warning (<tt>'about:blank'</tt>, except for IE in secure mode, which is <tt>'javascript:""'</tt>).
         * @type String
         */
        SSL_SECURE_URL : isSecure && isIE ? 'javascript:""' : 'about:blank',
        /**
         * True if the browser is in strict (standards-compliant) mode, as opposed to quirks mode
         * @type Boolean
         */
        isStrict : isStrict,
        /**
         * True if the page is running over SSL
         * @type Boolean
         */
        isSecure : isSecure,
        /**
         * True when the document is fully initialized and ready for action
         * @type Boolean
         */
        isReady : false,

        /**
         * True if the {@link Ext.Fx} Class is available
         * @type Boolean
         * @property enableFx
         */

        /**
         * True to automatically uncache orphaned Ext.Elements periodically (defaults to true)
         * @type Boolean
         */
        enableGarbageCollector : true,

        /**
         * True to automatically purge event listeners during garbageCollection (defaults to false).
         * @type Boolean
         */
        enableListenerCollection : false,

        /**
         * EXPERIMENTAL - True to cascade listener removal to child elements when an element is removed.
         * Currently not optimized for performance.
         * @type Boolean
         */
        enableNestedListenerRemoval : false,

        /**
         * Indicates whether to use native browser parsing for JSON methods.
         * This option is ignored if the browser does not support native JSON methods.
         * <b>Note: Native JSON methods will not work with objects that have functions.
         * Also, property names must be quoted, otherwise the data will not parse.</b> (Defaults to false)
         * @type Boolean
         */
        USE_NATIVE_JSON : false,

        /**
         * Copies all the properties of config to obj if they don't already exist.
         * @param {Object} obj The receiver of the properties
         * @param {Object} config The source of the properties
         * @return {Object} returns obj
         */
        applyIf : function(o, c){
            if(o){
                for(var p in c){
                    if(!Ext.isDefined(o[p])){
                        o[p] = c[p];
                    }
                }
            }
            return o;
        },

        /**
         * Generates unique ids. If the element already has an id, it is unchanged
         * @param {Mixed} el (optional) The element to generate an id for
         * @param {String} prefix (optional) Id prefix (defaults "ext-gen")
         * @return {String} The generated Id.
         */
        id : function(el, prefix){
            el = Ext.getDom(el, true) || {};
            if (!el.id) {
                el.id = (prefix || "ext-gen") + (++idSeed);
            }
            return el.id;
        },

        /**
         * <p>Extends one class to create a subclass and optionally overrides members with the passed literal. This method
         * also adds the function "override()" to the subclass that can be used to override members of the class.</p>
         * For example, to create a subclass of Ext GridPanel:
         * <pre><code>
MyGridPanel = Ext.extend(Ext.grid.GridPanel, {
    constructor: function(config) {

//      Create configuration for this Grid.
        var store = new Ext.data.Store({...});
        var colModel = new Ext.grid.ColumnModel({...});

//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
        config = Ext.apply({
            store: store,
            colModel: colModel
        }, config);

        MyGridPanel.superclass.constructor.call(this, config);

//      Your postprocessing here
    },

    yourMethod: function() {
        // etc.
    }
});
</code></pre>
         *
         * <p>This function also supports a 3-argument call in which the subclass's constructor is
         * passed as an argument. In this form, the parameters are as follows:</p>
         * <div class="mdetail-params"><ul>
         * <li><code>subclass</code> : Function <div class="sub-desc">The subclass constructor.</div></li>
         * <li><code>superclass</code> : Function <div class="sub-desc">The constructor of class being extended</div></li>
         * <li><code>overrides</code> : Object <div class="sub-desc">A literal with members which are copied into the subclass's
         * prototype, and are therefore shared among all instances of the new class.</div></li>
         * </ul></div>
         *
         * @param {Function} superclass The constructor of class being extended.
         * @param {Object} overrides <p>A literal with members which are copied into the subclass's
         * prototype, and are therefore shared between all instances of the new class.</p>
         * <p>This may contain a special member named <tt><b>constructor</b></tt>. This is used
         * to define the constructor of the new class, and is returned. If this property is
         * <i>not</i> specified, a constructor is generated and returned which just calls the
         * superclass's constructor passing on its parameters.</p>
         * <p><b>It is essential that you call the superclass constructor in any provided constructor. See example code.</b></p>
         * @return {Function} The subclass constructor from the <code>overrides</code> parameter, or a generated one if not provided.
         */
        extend : function(){
            // inline overrides
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function(sb, sp, overrides){
                if(typeof sp == 'object'){
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
                }
                var F = function(){},
                    sbp,
                    spp = sp.prototype;

                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == oc){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    Ext.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function(){
                    return spp;
                });
                sbp.override = io;
                Ext.override(sb, overrides);
                sb.extend = function(o){return Ext.extend(sb, o);};
                return sb;
            };
        }(),

        /**
         * Adds a list of functions to the prototype of an existing class, overwriting any existing methods with the same name.
         * Usage:<pre><code>
Ext.override(MyClass, {
    newMethod1: function(){
        // etc.
    },
    newMethod2: function(foo){
        // etc.
    }
});
</code></pre>
         * @param {Object} origclass The class to override
         * @param {Object} overrides The list of functions to add to origClass.  This should be specified as an object literal
         * containing one or more methods.
         * @method override
         */
        override : function(origclass, overrides){
            if(overrides){
                var p = origclass.prototype;
                Ext.apply(p, overrides);
                if(Ext.isIE && overrides.hasOwnProperty('toString')){
                    p.toString = overrides.toString;
                }
            }
        },

        /**
         * Creates namespaces to be used for scoping variables and classes so that they are not global.
         * Specifying the last node of a namespace implicitly creates all other nodes. Usage:
         * <pre><code>
Ext.namespace('Company', 'Company.data');
Ext.namespace('Company.data'); // equivalent and preferable to above syntax
Company.Widget = function() { ... }
Company.data.CustomStore = function(config) { ... }
</code></pre>
         * @param {String} namespace1
         * @param {String} namespace2
         * @param {String} etc
         * @return {Object} The namespace object. (If multiple arguments are passed, this will be the last namespace created)
         * @method namespace
         */
        namespace : function(){
            var o, d;
            Ext.each(arguments, function(v) {
                d = v.split(".");
                o = window[d[0]] = window[d[0]] || {};
                Ext.each(d.slice(1), function(v2){
                    o = o[v2] = o[v2] || {};
                });
            });
            return o;
        },

        /**
         * Takes an object and converts it to an encoded URL. e.g. Ext.urlEncode({foo: 1, bar: 2}); would return "foo=1&bar=2".  Optionally, property values can be arrays, instead of keys and the resulting string that's returned will contain a name/value pair for each array value.
         * @param {Object} o
         * @param {String} pre (optional) A prefix to add to the url encoded string
         * @return {String}
         */
        urlEncode : function(o, pre){
            var empty,
                buf = [],
                e = encodeURIComponent;

            Ext.iterate(o, function(key, item){
                empty = Ext.isEmpty(item);
                Ext.each(empty ? key : item, function(val){
                    buf.push('&', e(key), '=', (!Ext.isEmpty(val) && (val != key || !empty)) ? (Ext.isDate(val) ? Ext.encode(val).replace(/"/g, '') : e(val)) : '');
                });
            });
            if(!pre){
                buf.shift();
                pre = '';
            }
            return pre + buf.join('');
        },

        /**
         * Takes an encoded URL and and converts it to an object. Example: <pre><code>
Ext.urlDecode("foo=1&bar=2"); // returns {foo: "1", bar: "2"}
Ext.urlDecode("foo=1&bar=2&bar=3&bar=4", false); // returns {foo: "1", bar: ["2", "3", "4"]}
</code></pre>
         * @param {String} string
         * @param {Boolean} overwrite (optional) Items of the same name will overwrite previous values instead of creating an an array (Defaults to false).
         * @return {Object} A literal with members
         */
        urlDecode : function(string, overwrite){
            if(Ext.isEmpty(string)){
                return {};
            }
            var obj = {},
                pairs = string.split('&'),
                d = decodeURIComponent,
                name,
                value;
            Ext.each(pairs, function(pair) {
                pair = pair.split('=');
                name = d(pair[0]);
                value = d(pair[1]);
                obj[name] = overwrite || !obj[name] ? value :
                            [].concat(obj[name]).concat(value);
            });
            return obj;
        },

        /**
         * Appends content to the query string of a URL, handling logic for whether to place
         * a question mark or ampersand.
         * @param {String} url The URL to append to.
         * @param {String} s The content to append to the URL.
         * @return (String) The resulting URL
         */
        urlAppend : function(url, s){
            if(!Ext.isEmpty(s)){
                return url + (url.indexOf('?') === -1 ? '?' : '&') + s;
            }
            return url;
        },

        /**
         * Converts any iterable (numeric indices and a length property) into a true array
         * Don't use this on strings. IE doesn't support "abc"[0] which this implementation depends on.
         * For strings, use this instead: "abc".match(/./g) => [a,b,c];
         * @param {Iterable} the iterable object to be turned into a true Array.
         * @return (Array) array
         */
         toArray : function(){
             return isIE ?
                 function(a, i, j, res){
                     res = [];
                     for(var x = 0, len = a.length; x < len; x++) {
                         res.push(a[x]);
                     }
                     return res.slice(i || 0, j || res.length);
                 } :
                 function(a, i, j){
                     return Array.prototype.slice.call(a, i || 0, j || a.length);
                 }
         }(),

        isIterable : function(v){
            //check for array or arguments
            if(Ext.isArray(v) || v.callee){
                return true;
            }
            //check for node list type
            if(/NodeList|HTMLCollection/.test(toString.call(v))){
                return true;
            }
            //NodeList has an item and length property
            //IXMLDOMNodeList has nextNode method, needs to be checked first.
            return ((typeof v.nextNode != 'undefined' || v.item) && Ext.isNumber(v.length));
        },

        /**
         * Iterates an array calling the supplied function.
         * @param {Array/NodeList/Mixed} array The array to be iterated. If this
         * argument is not really an array, the supplied function is called once.
         * @param {Function} fn The function to be called with each item. If the
         * supplied function returns false, iteration stops and this method returns
         * the current <code>index</code>. This function is called with
         * the following arguments:
         * <div class="mdetail-params"><ul>
         * <li><code>item</code> : <i>Mixed</i>
         * <div class="sub-desc">The item at the current <code>index</code>
         * in the passed <code>array</code></div></li>
         * <li><code>index</code> : <i>Number</i>
         * <div class="sub-desc">The current index within the array</div></li>
         * <li><code>allItems</code> : <i>Array</i>
         * <div class="sub-desc">The <code>array</code> passed as the first
         * argument to <code>Ext.each</code>.</div></li>
         * </ul></div>
         * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed.
         * Defaults to the <code>item</code> at the current <code>index</code>
         * within the passed <code>array</code>.
         * @return See description for the fn parameter.
         */
        each : function(array, fn, scope){
            if(Ext.isEmpty(array, true)){
                return;
            }
            if(!Ext.isIterable(array) || Ext.isPrimitive(array)){
                array = [array];
            }
            for(var i = 0, len = array.length; i < len; i++){
                if(fn.call(scope || array[i], array[i], i, array) === false){
                    return i;
                };
            }
        },

        /**
         * Iterates either the elements in an array, or each of the properties in an object.
         * <b>Note</b>: If you are only iterating arrays, it is better to call {@link #each}.
         * @param {Object/Array} object The object or array to be iterated
         * @param {Function} fn The function to be called for each iteration.
         * The iteration will stop if the supplied function returns false, or
         * all array elements / object properties have been covered. The signature
         * varies depending on the type of object being interated:
         * <div class="mdetail-params"><ul>
         * <li>Arrays : <tt>(Object item, Number index, Array allItems)</tt>
         * <div class="sub-desc">
         * When iterating an array, the supplied function is called with each item.</div></li>
         * <li>Objects : <tt>(String key, Object value, Object)</tt>
         * <div class="sub-desc">
         * When iterating an object, the supplied function is called with each key-value pair in
         * the object, and the iterated object</div></li>
         * </ul></div>
         * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed. Defaults to
         * the <code>object</code> being iterated.
         */
        iterate : function(obj, fn, scope){
            if(Ext.isEmpty(obj)){
                return;
            }
            if(Ext.isIterable(obj)){
                Ext.each(obj, fn, scope);
                return;
            }else if(typeof obj == 'object'){
                for(var prop in obj){
                    if(obj.hasOwnProperty(prop)){
                        if(fn.call(scope || obj, prop, obj[prop], obj) === false){
                            return;
                        };
                    }
                }
            }
        },

        /**
         * Return the dom node for the passed String (id), dom node, or Ext.Element.
         * Optional 'strict' flag is needed for IE since it can return 'name' and
         * 'id' elements by using getElementById.
         * Here are some examples:
         * <pre><code>
// gets dom node based on id
var elDom = Ext.getDom('elId');
// gets dom node based on the dom node
var elDom1 = Ext.getDom(elDom);

// If we don&#39;t know if we are working with an
// Ext.Element or a dom node use Ext.getDom
function(el){
    var dom = Ext.getDom(el);
    // do something with the dom node
}
         * </code></pre>
         * <b>Note</b>: the dom node to be found actually needs to exist (be rendered, etc)
         * when this method is called to be successful.
         * @param {Mixed} el
         * @return HTMLElement
         */
        getDom : function(el, strict){
            if(!el || !DOC){
                return null;
            }
            if (el.dom){
                return el.dom;
            } else {
                if (typeof el == 'string') {
                    var e = DOC.getElementById(el);
                    // IE returns elements with the 'name' and 'id' attribute.
                    // we do a strict check to return the element with only the id attribute
                    if (e && isIE && strict) {
                        if (el == e.getAttribute('id')) {
                            return e;
                        } else {
                            return null;
                        }
                    }
                    return e;
                } else {
                    return el;
                }
            }
        },

        /**
         * Returns the current document body as an {@link Ext.Element}.
         * @return Ext.Element The document body
         */
        getBody : function(){
            return Ext.get(DOC.body || DOC.documentElement);
        },

        /**
         * Removes a DOM node from the document.
         */
        /**
         * <p>Removes this element from the document, removes all DOM event listeners, and deletes the cache reference.
         * All DOM event listeners are removed from this element. If {@link Ext#enableNestedListenerRemoval} is
         * <code>true</code>, then DOM event listeners are also removed from all child nodes. The body node
         * will be ignored if passed in.</p>
         * @param {HTMLElement} node The node to remove
         */
        removeNode : isIE && !isIE8 ? function(){
            var d;
            return function(n){
                if(n && n.tagName != 'BODY'){
                    (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(n, true) : Ext.EventManager.removeAll(n);
                    d = d || DOC.createElement('div');
                    d.appendChild(n);
                    d.innerHTML = '';
                    delete Ext.elCache[n.id];
                }
            }
        }() : function(n){
            if(n && n.parentNode && n.tagName != 'BODY'){
                (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(n, true) : Ext.EventManager.removeAll(n);
                n.parentNode.removeChild(n);
                delete Ext.elCache[n.id];
            }
        },

        /**
         * <p>Returns true if the passed value is empty.</p>
         * <p>The value is deemed to be empty if it is<div class="mdetail-params"><ul>
         * <li>null</li>
         * <li>undefined</li>
         * <li>an empty array</li>
         * <li>a zero length string (Unless the <tt>allowBlank</tt> parameter is <tt>true</tt>)</li>
         * </ul></div>
         * @param {Mixed} value The value to test
         * @param {Boolean} allowBlank (optional) true to allow empty strings (defaults to false)
         * @return {Boolean}
         */
        isEmpty : function(v, allowBlank){
            return v === null || v === undefined || ((Ext.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
        },

        /**
         * Returns true if the passed value is a JavaScript array, otherwise false.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isArray : function(v){
            return toString.apply(v) === '[object Array]';
        },

        /**
         * Returns true if the passed object is a JavaScript date object, otherwise false.
         * @param {Object} object The object to test
         * @return {Boolean}
         */
        isDate : function(v){
            return toString.apply(v) === '[object Date]';
        },

        /**
         * Returns true if the passed value is a JavaScript Object, otherwise false.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isObject : function(v){
            return !!v && Object.prototype.toString.call(v) === '[object Object]';
        },

        /**
         * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isPrimitive : function(v){
            return Ext.isString(v) || Ext.isNumber(v) || Ext.isBoolean(v);
        },

        /**
         * Returns true if the passed value is a JavaScript Function, otherwise false.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isFunction : function(v){
            return toString.apply(v) === '[object Function]';
        },

        /**
         * Returns true if the passed value is a number. Returns false for non-finite numbers.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isNumber : function(v){
            return typeof v === 'number' && isFinite(v);
        },

        /**
         * Returns true if the passed value is a string.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isString : function(v){
            return typeof v === 'string';
        },

        /**
         * Returns true if the passed value is a boolean.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isBoolean : function(v){
            return typeof v === 'boolean';
        },

        /**
         * Returns true if the passed value is an HTMLElement
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isElement : function(v) {
            return v ? !!v.tagName : false;
        },

        /**
         * Returns true if the passed value is not undefined.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isDefined : function(v){
            return typeof v !== 'undefined';
        },

        /**
         * True if the detected browser is Opera.
         * @type Boolean
         */
        isOpera : isOpera,
        /**
         * True if the detected browser uses WebKit.
         * @type Boolean
         */
        isWebKit : isWebKit,
        /**
         * True if the detected browser is Chrome.
         * @type Boolean
         */
        isChrome : isChrome,
        /**
         * True if the detected browser is Safari.
         * @type Boolean
         */
        isSafari : isSafari,
        /**
         * True if the detected browser is Safari 3.x.
         * @type Boolean
         */
        isSafari3 : isSafari3,
        /**
         * True if the detected browser is Safari 4.x.
         * @type Boolean
         */
        isSafari4 : isSafari4,
        /**
         * True if the detected browser is Safari 2.x.
         * @type Boolean
         */
        isSafari2 : isSafari2,
        /**
         * True if the detected browser is Internet Explorer.
         * @type Boolean
         */
        isIE : isIE,
        /**
         * True if the detected browser is Internet Explorer 6.x.
         * @type Boolean
         */
        isIE6 : isIE6,
        /**
         * True if the detected browser is Internet Explorer 7.x.
         * @type Boolean
         */
        isIE7 : isIE7,
        /**
         * True if the detected browser is Internet Explorer 8.x.
         * @type Boolean
         */
        isIE8 : isIE8,
        /**
         * True if the detected browser uses the Gecko layout engine (e.g. Mozilla, Firefox).
         * @type Boolean
         */
        isGecko : isGecko,
        /**
         * True if the detected browser uses a pre-Gecko 1.9 layout engine (e.g. Firefox 2.x).
         * @type Boolean
         */
        isGecko2 : isGecko2,
        /**
         * True if the detected browser uses a Gecko 1.9+ layout engine (e.g. Firefox 3.x).
         * @type Boolean
         */
        isGecko3 : isGecko3,
        /**
         * True if the detected browser is Internet Explorer running in non-strict mode.
         * @type Boolean
         */
        isBorderBox : isBorderBox,
        /**
         * True if the detected platform is Linux.
         * @type Boolean
         */
        isLinux : isLinux,
        /**
         * True if the detected platform is Windows.
         * @type Boolean
         */
        isWindows : isWindows,
        /**
         * True if the detected platform is Mac OS.
         * @type Boolean
         */
        isMac : isMac,
        /**
         * True if the detected platform is Adobe Air.
         * @type Boolean
         */
        isAir : isAir
    });

    /**
     * Creates namespaces to be used for scoping variables and classes so that they are not global.
     * Specifying the last node of a namespace implicitly creates all other nodes. Usage:
     * <pre><code>
Ext.namespace('Company', 'Company.data');
Ext.namespace('Company.data'); // equivalent and preferable to above syntax
Company.Widget = function() { ... }
Company.data.CustomStore = function(config) { ... }
</code></pre>
     * @param {String} namespace1
     * @param {String} namespace2
     * @param {String} etc
     * @return {Object} The namespace object. (If multiple arguments are passed, this will be the last namespace created)
     * @method ns
     */
    Ext.ns = Ext.namespace;
})();

Ext.ns("Ext.util", "Ext.lib", "Ext.data");

Ext.elCache = {};

/**
 * @class Function
 * These functions are available on every Function object (any JavaScript function).
 */
Ext.apply(Function.prototype, {
     /**
     * Creates an interceptor function. The passed function is called before the original one. If it returns false,
     * the original one is not called. The resulting function returns the results of the original function.
     * The passed function is called with the parameters of the original function. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

sayHi('Fred'); // alerts "Hi, Fred"

// create a new function that validates input without
// directly modifying the original function:
var sayHiToFriend = sayHi.createInterceptor(function(name){
    return name == 'Brian';
});

sayHiToFriend('Fred');  // no alert
sayHiToFriend('Brian'); // alerts "Hi, Brian"
</code></pre>
     * @param {Function} fcn The function to call before the original
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the passed function is executed.
     * <b>If omitted, defaults to the scope in which the original function is called or the browser window.</b>
     * @return {Function} The new function
     */
    createInterceptor : function(fcn, scope){
        var method = this;
        return !Ext.isFunction(fcn) ?
                this :
                function() {
                    var me = this,
                        args = arguments;
                    fcn.target = me;
                    fcn.method = method;
                    return (fcn.apply(scope || me || window, args) !== false) ?
                            method.apply(me || window, args) :
                            null;
                };
    },

     /**
     * Creates a callback that passes arguments[0], arguments[1], arguments[2], ...
     * Call directly on any function. Example: <code>myFunction.createCallback(arg1, arg2)</code>
     * Will create a function that is bound to those 2 args. <b>If a specific scope is required in the
     * callback, use {@link #createDelegate} instead.</b> The function returned by createCallback always
     * executes in the window scope.
     * <p>This method is required when you want to pass arguments to a callback function.  If no arguments
     * are needed, you can simply pass a reference to the function as a callback (e.g., callback: myFn).
     * However, if you tried to pass a function with arguments (e.g., callback: myFn(arg1, arg2)) the function
     * would simply execute immediately when the code is parsed. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

// clicking the button alerts "Hi, Fred"
new Ext.Button({
    text: 'Say Hi',
    renderTo: Ext.getBody(),
    handler: sayHi.createCallback('Fred')
});
</code></pre>
     * @return {Function} The new function
    */
    createCallback : function(/*args...*/){
        // make args available, in function below
        var args = arguments,
            method = this;
        return function() {
            return method.apply(window, args);
        };
    },

    /**
     * Creates a delegate (callback) that sets the scope to obj.
     * Call directly on any function. Example: <code>this.myFunction.createDelegate(this, [arg1, arg2])</code>
     * Will create a function that is automatically scoped to obj so that the <tt>this</tt> variable inside the
     * callback points to obj. Example usage:
     * <pre><code>
var sayHi = function(name){
    // Note this use of "this.text" here.  This function expects to
    // execute within a scope that contains a text property.  In this
    // example, the "this" variable is pointing to the btn object that
    // was passed in createDelegate below.
    alert('Hi, ' + name + '. You clicked the "' + this.text + '" button.');
}

var btn = new Ext.Button({
    text: 'Say Hi',
    renderTo: Ext.getBody()
});

// This callback will execute in the scope of the
// button instance. Clicking the button alerts
// "Hi, Fred. You clicked the "Say Hi" button."
btn.on('click', sayHi.createDelegate(btn, ['Fred']));
</code></pre>
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the function is executed.
     * <b>If omitted, defaults to the browser window.</b>
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position
     * @return {Function} The new function
     */
    createDelegate : function(obj, args, appendArgs){
        var method = this;
        return function() {
            var callArgs = args || arguments;
            if (appendArgs === true){
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }else if (Ext.isNumber(appendArgs)){
                callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
                var applyArgs = [appendArgs, 0].concat(args); // create method call params
                Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
            }
            return method.apply(obj || window, callArgs);
        };
    },

    /**
     * Calls this function after the number of millseconds specified, optionally in a specific scope. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

// executes immediately:
sayHi('Fred');

// executes after 2 seconds:
sayHi.defer(2000, this, ['Fred']);

// this syntax is sometimes useful for deferring
// execution of an anonymous function:
(function(){
    alert('Anonymous');
}).defer(100);
</code></pre>
     * @param {Number} millis The number of milliseconds for the setTimeout call (if less than or equal to 0 the function is executed immediately)
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the function is executed.
     * <b>If omitted, defaults to the browser window.</b>
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position
     * @return {Number} The timeout id that can be used with clearTimeout
     */
    defer : function(millis, obj, args, appendArgs){
        var fn = this.createDelegate(obj, args, appendArgs);
        if(millis > 0){
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    }
});

/**
 * @class String
 * These functions are available on every String object.
 */
Ext.applyIf(String, {
    /**
     * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
     * token must be unique, and must increment in the format {0}, {1}, etc.  Example usage:
     * <pre><code>
var cls = 'my-class', text = 'Some text';
var s = String.format('&lt;div class="{0}">{1}&lt;/div>', cls, text);
// s now contains the string: '&lt;div class="my-class">Some text&lt;/div>'
     * </code></pre>
     * @param {String} string The tokenized string to be formatted
     * @param {String} value1 The value to replace token {0}
     * @param {String} value2 Etc...
     * @return {String} The formatted string
     * @static
     */
    format : function(format){
        var args = Ext.toArray(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    }
});

/**
 * @class Array
 */
Ext.applyIf(Array.prototype, {
    /**
     * Checks whether or not the specified object exists in the array.
     * @param {Object} o The object to check for
     * @param {Number} from (Optional) The index at which to begin the search
     * @return {Number} The index of o in the array (or -1 if it is not found)
     */
    indexOf : function(o, from){
        var len = this.length;
        from = from || 0;
        from += (from < 0) ? len : 0;
        for (; from < len; ++from){
            if(this[from] === o){
                return from;
            }
        }
        return -1;
    },

    /**
     * Removes the specified object from the array.  If the object is not found nothing happens.
     * @param {Object} o The object to remove
     * @return {Array} this array
     */
    remove : function(o){
        var index = this.indexOf(o);
        if(index != -1){
            this.splice(index, 1);
        }
        return this;
    }
});
/**
 * @class Ext
 */

Ext.ns("Ext.grid", "Ext.list", "Ext.dd", "Ext.tree", "Ext.form", "Ext.menu",
       "Ext.state", "Ext.layout", "Ext.app", "Ext.ux", "Ext.chart", "Ext.direct");
    /**
     * Namespace alloted for extensions to the framework.
     * @property ux
     * @type Object
     */

Ext.apply(Ext, function(){
    var E = Ext,
        idSeed = 0,
        scrollWidth = null;

    return {
        /**
        * A reusable empty function
        * @property
        * @type Function
        */
        emptyFn : function(){},

        /**
         * URL to a 1x1 transparent gif image used by Ext to create inline icons with CSS background images.
         * In older versions of IE, this defaults to "http://extjs.com/s.gif" and you should change this to a URL on your server.
         * For other browsers it uses an inline data URL.
         * @type String
         */
        BLANK_IMAGE_URL : Ext.isIE6 || Ext.isIE7 || Ext.isAir ?
                            'http:/' + '/www.extjs.com/s.gif' :
                            'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',

        extendX : function(supr, fn){
            return Ext.extend(supr, fn(supr.prototype));
        },

        /**
         * Returns the current HTML document object as an {@link Ext.Element}.
         * @return Ext.Element The document
         */
        getDoc : function(){
            return Ext.get(document);
        },

        /**
         * Utility method for validating that a value is numeric, returning the specified default value if it is not.
         * @param {Mixed} value Should be a number, but any type will be handled appropriately
         * @param {Number} defaultValue The value to return if the original value is non-numeric
         * @return {Number} Value, if numeric, else defaultValue
         */
        num : function(v, defaultValue){
            v = Number(Ext.isEmpty(v) || Ext.isArray(v) || typeof v == 'boolean' || (typeof v == 'string' && v.trim().length == 0) ? NaN : v);
            return isNaN(v) ? defaultValue : v;
        },

        /**
         * <p>Utility method for returning a default value if the passed value is empty.</p>
         * <p>The value is deemed to be empty if it is<div class="mdetail-params"><ul>
         * <li>null</li>
         * <li>undefined</li>
         * <li>an empty array</li>
         * <li>a zero length string (Unless the <tt>allowBlank</tt> parameter is <tt>true</tt>)</li>
         * </ul></div>
         * @param {Mixed} value The value to test
         * @param {Mixed} defaultValue The value to return if the original value is empty
         * @param {Boolean} allowBlank (optional) true to allow zero length strings to qualify as non-empty (defaults to false)
         * @return {Mixed} value, if non-empty, else defaultValue
         */
        value : function(v, defaultValue, allowBlank){
            return Ext.isEmpty(v, allowBlank) ? defaultValue : v;
        },

        /**
         * Escapes the passed string for use in a regular expression
         * @param {String} str
         * @return {String}
         */
        escapeRe : function(s) {
            return s.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
        },

        sequence : function(o, name, fn, scope){
            o[name] = o[name].createSequence(fn, scope);
        },

        /**
         * Applies event listeners to elements by selectors when the document is ready.
         * The event name is specified with an <tt>&#64;</tt> suffix.
         * <pre><code>
Ext.addBehaviors({
    // add a listener for click on all anchors in element with id foo
    '#foo a&#64;click' : function(e, t){
        // do something
    },

    // add the same listener to multiple selectors (separated by comma BEFORE the &#64;)
    '#foo a, #bar span.some-class&#64;mouseover' : function(){
        // do something
    }
});
         * </code></pre>
         * @param {Object} obj The list of behaviors to apply
         */
        addBehaviors : function(o){
            if(!Ext.isReady){
                Ext.onReady(function(){
                    Ext.addBehaviors(o);
                });
            } else {
                var cache = {}, // simple cache for applying multiple behaviors to same selector does query multiple times
                    parts,
                    b,
                    s;
                for (b in o) {
                    if ((parts = b.split('@'))[1]) { // for Object prototype breakers
                        s = parts[0];
                        if(!cache[s]){
                            cache[s] = Ext.select(s);
                        }
                        cache[s].on(parts[1], o[b]);
                    }
                }
                cache = null;
            }
        },

        /**
         * Utility method for getting the width of the browser scrollbar. This can differ depending on
         * operating system settings, such as the theme or font size.
         * @param {Boolean} force (optional) true to force a recalculation of the value.
         * @return {Number} The width of the scrollbar.
         */
        getScrollBarWidth: function(force){
            if(!Ext.isReady){
                return 0;
            }

            if(force === true || scrollWidth === null){
                    // Append our div, do our calculation and then remove it
                var div = Ext.getBody().createChild('<div class="x-hide-offsets" style="width:100px;height:50px;overflow:hidden;"><div style="height:200px;"></div></div>'),
                    child = div.child('div', true);
                var w1 = child.offsetWidth;
                div.setStyle('overflow', (Ext.isWebKit || Ext.isGecko) ? 'auto' : 'scroll');
                var w2 = child.offsetWidth;
                div.remove();
                // Need to add 2 to ensure we leave enough space
                scrollWidth = w1 - w2 + 2;
            }
            return scrollWidth;
        },


        // deprecated
        combine : function(){
            var as = arguments, l = as.length, r = [];
            for(var i = 0; i < l; i++){
                var a = as[i];
                if(Ext.isArray(a)){
                    r = r.concat(a);
                }else if(a.length !== undefined && !a.substr){
                    r = r.concat(Array.prototype.slice.call(a, 0));
                }else{
                    r.push(a);
                }
            }
            return r;
        },

        /**
         * Copies a set of named properties fom the source object to the destination object.
         * <p>example:<pre><code>
ImageComponent = Ext.extend(Ext.BoxComponent, {
    initComponent: function() {
        this.autoEl = { tag: 'img' };
        MyComponent.superclass.initComponent.apply(this, arguments);
        this.initialBox = Ext.copyTo({}, this.initialConfig, 'x,y,width,height');
    }
});
         * </code></pre>
         * @param {Object} dest The destination object.
         * @param {Object} source The source object.
         * @param {Array/String} names Either an Array of property names, or a comma-delimited list
         * of property names to copy.
         * @return {Object} The modified object.
        */
        copyTo : function(dest, source, names){
            if(typeof names == 'string'){
                names = names.split(/[,;\s]/);
            }
            Ext.each(names, function(name){
                if(source.hasOwnProperty(name)){
                    dest[name] = source[name];
                }
            }, this);
            return dest;
        },

        /**
         * Attempts to destroy any objects passed to it by removing all event listeners, removing them from the
         * DOM (if applicable) and calling their destroy functions (if available).  This method is primarily
         * intended for arguments of type {@link Ext.Element} and {@link Ext.Component}, but any subclass of
         * {@link Ext.util.Observable} can be passed in.  Any number of elements and/or components can be
         * passed into this function in a single call as separate arguments.
         * @param {Mixed} arg1 An {@link Ext.Element}, {@link Ext.Component}, or an Array of either of these to destroy
         * @param {Mixed} arg2 (optional)
         * @param {Mixed} etc... (optional)
         */
        destroy : function(){
            Ext.each(arguments, function(arg){
                if(arg){
                    if(Ext.isArray(arg)){
                        this.destroy.apply(this, arg);
                    }else if(typeof arg.destroy == 'function'){
                        arg.destroy();
                    }else if(arg.dom){
                        arg.remove();
                    }
                }
            }, this);
        },

        /**
         * Attempts to destroy and then remove a set of named properties of the passed object.
         * @param {Object} o The object (most likely a Component) who's properties you wish to destroy.
         * @param {Mixed} arg1 The name of the property to destroy and remove from the object.
         * @param {Mixed} etc... More property names to destroy and remove.
         */
        destroyMembers : function(o, arg1, arg2, etc){
            for(var i = 1, a = arguments, len = a.length; i < len; i++) {
                Ext.destroy(o[a[i]]);
                delete o[a[i]];
            }
        },

        /**
         * Creates a copy of the passed Array with falsy values removed.
         * @param {Array/NodeList} arr The Array from which to remove falsy values.
         * @return {Array} The new, compressed Array.
         */
        clean : function(arr){
            var ret = [];
            Ext.each(arr, function(v){
                if(!!v){
                    ret.push(v);
                }
            });
            return ret;
        },

        /**
         * Creates a copy of the passed Array, filtered to contain only unique values.
         * @param {Array} arr The Array to filter
         * @return {Array} The new Array containing unique values.
         */
        unique : function(arr){
            var ret = [],
                collect = {};

            Ext.each(arr, function(v) {
                if(!collect[v]){
                    ret.push(v);
                }
                collect[v] = true;
            });
            return ret;
        },

        /**
         * Recursively flattens into 1-d Array. Injects Arrays inline.
         * @param {Array} arr The array to flatten
         * @return {Array} The new, flattened array.
         */
        flatten : function(arr){
            var worker = [];
            function rFlatten(a) {
                Ext.each(a, function(v) {
                    if(Ext.isArray(v)){
                        rFlatten(v);
                    }else{
                        worker.push(v);
                    }
                });
                return worker;
            }
            return rFlatten(arr);
        },

        /**
         * Returns the minimum value in the Array.
         * @param {Array|NodeList} arr The Array from which to select the minimum value.
         * @param {Function} comp (optional) a function to perform the comparision which determines minimization.
         *                   If omitted the "<" operator will be used. Note: gt = 1; eq = 0; lt = -1
         * @return {Object} The minimum value in the Array.
         */
        min : function(arr, comp){
            var ret = arr[0];
            comp = comp || function(a,b){ return a < b ? -1 : 1; };
            Ext.each(arr, function(v) {
                ret = comp(ret, v) == -1 ? ret : v;
            });
            return ret;
        },

        /**
         * Returns the maximum value in the Array
         * @param {Array|NodeList} arr The Array from which to select the maximum value.
         * @param {Function} comp (optional) a function to perform the comparision which determines maximization.
         *                   If omitted the ">" operator will be used. Note: gt = 1; eq = 0; lt = -1
         * @return {Object} The maximum value in the Array.
         */
        max : function(arr, comp){
            var ret = arr[0];
            comp = comp || function(a,b){ return a > b ? 1 : -1; };
            Ext.each(arr, function(v) {
                ret = comp(ret, v) == 1 ? ret : v;
            });
            return ret;
        },

        /**
         * Calculates the mean of the Array
         * @param {Array} arr The Array to calculate the mean value of.
         * @return {Number} The mean.
         */
        mean : function(arr){
           return arr.length > 0 ? Ext.sum(arr) / arr.length : undefined;
        },

        /**
         * Calculates the sum of the Array
         * @param {Array} arr The Array to calculate the sum value of.
         * @return {Number} The sum.
         */
        sum : function(arr){
           var ret = 0;
           Ext.each(arr, function(v) {
               ret += v;
           });
           return ret;
        },

        /**
         * Partitions the set into two sets: a true set and a false set.
         * Example:
         * Example2:
         * <pre><code>
// Example 1:
Ext.partition([true, false, true, true, false]); // [[true, true, true], [false, false]]

// Example 2:
Ext.partition(
    Ext.query("p"),
    function(val){
        return val.className == "class1"
    }
);
// true are those paragraph elements with a className of "class1",
// false set are those that do not have that className.
         * </code></pre>
         * @param {Array|NodeList} arr The array to partition
         * @param {Function} truth (optional) a function to determine truth.  If this is omitted the element
         *                   itself must be able to be evaluated for its truthfulness.
         * @return {Array} [true<Array>,false<Array>]
         */
        partition : function(arr, truth){
            var ret = [[],[]];
            Ext.each(arr, function(v, i, a) {
                ret[ (truth && truth(v, i, a)) || (!truth && v) ? 0 : 1].push(v);
            });
            return ret;
        },

        /**
         * Invokes a method on each item in an Array.
         * <pre><code>
// Example:
Ext.invoke(Ext.query("p"), "getAttribute", "id");
// [el1.getAttribute("id"), el2.getAttribute("id"), ..., elN.getAttribute("id")]
         * </code></pre>
         * @param {Array|NodeList} arr The Array of items to invoke the method on.
         * @param {String} methodName The method name to invoke.
         * @param {...*} args Arguments to send into the method invocation.
         * @return {Array} The results of invoking the method on each item in the array.
         */
        invoke : function(arr, methodName){
            var ret = [],
                args = Array.prototype.slice.call(arguments, 2);
            Ext.each(arr, function(v,i) {
                if (v && typeof v[methodName] == 'function') {
                    ret.push(v[methodName].apply(v, args));
                } else {
                    ret.push(undefined);
                }
            });
            return ret;
        },

        /**
         * Plucks the value of a property from each item in the Array
         * <pre><code>
// Example:
Ext.pluck(Ext.query("p"), "className"); // [el1.className, el2.className, ..., elN.className]
         * </code></pre>
         * @param {Array|NodeList} arr The Array of items to pluck the value from.
         * @param {String} prop The property name to pluck from each element.
         * @return {Array} The value from each item in the Array.
         */
        pluck : function(arr, prop){
            var ret = [];
            Ext.each(arr, function(v) {
                ret.push( v[prop] );
            });
            return ret;
        },

        /**
         * <p>Zips N sets together.</p>
         * <pre><code>
// Example 1:
Ext.zip([1,2,3],[4,5,6]); // [[1,4],[2,5],[3,6]]
// Example 2:
Ext.zip(
    [ "+", "-", "+"],
    [  12,  10,  22],
    [  43,  15,  96],
    function(a, b, c){
        return "$" + a + "" + b + "." + c
    }
); // ["$+12.43", "$-10.15", "$+22.96"]
         * </code></pre>
         * @param {Arrays|NodeLists} arr This argument may be repeated. Array(s) to contribute values.
         * @param {Function} zipper (optional) The last item in the argument list. This will drive how the items are zipped together.
         * @return {Array} The zipped set.
         */
        zip : function(){
            var parts = Ext.partition(arguments, function( val ){ return typeof val != 'function'; }),
                arrs = parts[0],
                fn = parts[1][0],
                len = Ext.max(Ext.pluck(arrs, "length")),
                ret = [];

            for (var i = 0; i < len; i++) {
                ret[i] = [];
                if(fn){
                    ret[i] = fn.apply(fn, Ext.pluck(arrs, i));
                }else{
                    for (var j = 0, aLen = arrs.length; j < aLen; j++){
                        ret[i].push( arrs[j][i] );
                    }
                }
            }
            return ret;
        },

        /**
         * This is shorthand reference to {@link Ext.ComponentMgr#get}.
         * Looks up an existing {@link Ext.Component Component} by {@link Ext.Component#id id}
         * @param {String} id The component {@link Ext.Component#id id}
         * @return Ext.Component The Component, <tt>undefined</tt> if not found, or <tt>null</tt> if a
         * Class was found.
        */
        getCmp : function(id){
            return Ext.ComponentMgr.get(id);
        },

        /**
         * By default, Ext intelligently decides whether floating elements should be shimmed. If you are using flash,
         * you may want to set this to true.
         * @type Boolean
         */
        useShims: E.isIE6 || (E.isMac && E.isGecko2),

        // inpired by a similar function in mootools library
        /**
         * Returns the type of object that is passed in. If the object passed in is null or undefined it
         * return false otherwise it returns one of the following values:<div class="mdetail-params"><ul>
         * <li><b>string</b>: If the object passed is a string</li>
         * <li><b>number</b>: If the object passed is a number</li>
         * <li><b>boolean</b>: If the object passed is a boolean value</li>
         * <li><b>date</b>: If the object passed is a Date object</li>
         * <li><b>function</b>: If the object passed is a function reference</li>
         * <li><b>object</b>: If the object passed is an object</li>
         * <li><b>array</b>: If the object passed is an array</li>
         * <li><b>regexp</b>: If the object passed is a regular expression</li>
         * <li><b>element</b>: If the object passed is a DOM Element</li>
         * <li><b>nodelist</b>: If the object passed is a DOM NodeList</li>
         * <li><b>textnode</b>: If the object passed is a DOM text node and contains something other than whitespace</li>
         * <li><b>whitespace</b>: If the object passed is a DOM text node and contains only whitespace</li>
         * </ul></div>
         * @param {Mixed} object
         * @return {String}
         */
        type : function(o){
            if(o === undefined || o === null){
                return false;
            }
            if(o.htmlElement){
                return 'element';
            }
            var t = typeof o;
            if(t == 'object' && o.nodeName) {
                switch(o.nodeType) {
                    case 1: return 'element';
                    case 3: return (/\S/).test(o.nodeValue) ? 'textnode' : 'whitespace';
                }
            }
            if(t == 'object' || t == 'function') {
                switch(o.constructor) {
                    case Array: return 'array';
                    case RegExp: return 'regexp';
                    case Date: return 'date';
                }
                if(typeof o.length == 'number' && typeof o.item == 'function') {
                    return 'nodelist';
                }
            }
            return t;
        },

        intercept : function(o, name, fn, scope){
            o[name] = o[name].createInterceptor(fn, scope);
        },

        // internal
        callback : function(cb, scope, args, delay){
            if(typeof cb == 'function'){
                if(delay){
                    cb.defer(delay, scope, args || []);
                }else{
                    cb.apply(scope, args || []);
                }
            }
        }
    };
}());

/**
 * @class Function
 * These functions are available on every Function object (any JavaScript function).
 */
Ext.apply(Function.prototype, {
    /**
     * Create a combined function call sequence of the original function + the passed function.
     * The resulting function returns the results of the original function.
     * The passed fcn is called with the parameters of the original function. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

sayHi('Fred'); // alerts "Hi, Fred"

var sayGoodbye = sayHi.createSequence(function(name){
    alert('Bye, ' + name);
});

sayGoodbye('Fred'); // both alerts show
</code></pre>
     * @param {Function} fcn The function to sequence
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the passed function is executed.
     * <b>If omitted, defaults to the scope in which the original function is called or the browser window.</b>
     * @return {Function} The new function
     */
    createSequence : function(fcn, scope){
        var method = this;
        return (typeof fcn != 'function') ?
                this :
                function(){
                    var retval = method.apply(this || window, arguments);
                    fcn.apply(scope || this || window, arguments);
                    return retval;
                };
    }
});


/**
 * @class String
 * These functions are available as static methods on the JavaScript String object.
 */
Ext.applyIf(String, {

    /**
     * Escapes the passed string for ' and \
     * @param {String} string The string to escape
     * @return {String} The escaped string
     * @static
     */
    escape : function(string) {
        return string.replace(/('|\\)/g, "\\$1");
    },

    /**
     * Pads the left side of a string with a specified character.  This is especially useful
     * for normalizing number and date strings.  Example usage:
     * <pre><code>
var s = String.leftPad('123', 5, '0');
// s now contains the string: '00123'
     * </code></pre>
     * @param {String} string The original string
     * @param {Number} size The total length of the output string
     * @param {String} char (optional) The character with which to pad the original string (defaults to empty string " ")
     * @return {String} The padded string
     * @static
     */
    leftPad : function (val, size, ch) {
        var result = String(val);
        if(!ch) {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result;
    }
});

/**
 * Utility function that allows you to easily switch a string between two alternating values.  The passed value
 * is compared to the current string, and if they are equal, the other value that was passed in is returned.  If
 * they are already different, the first value passed in is returned.  Note that this method returns the new value
 * but does not change the current string.
 * <pre><code>
// alternate sort directions
sort = sort.toggle('ASC', 'DESC');

// instead of conditional logic:
sort = (sort == 'ASC' ? 'DESC' : 'ASC');
</code></pre>
 * @param {String} value The value to compare to the current string
 * @param {String} other The new value to use if the string already equals the first value passed in
 * @return {String} The new value
 */
String.prototype.toggle = function(value, other){
    return this == value ? other : value;
};

/**
 * Trims whitespace from either end of a string, leaving spaces within the string intact.  Example:
 * <pre><code>
var s = '  foo bar  ';
alert('-' + s + '-');         //alerts "- foo bar -"
alert('-' + s.trim() + '-');  //alerts "-foo bar-"
</code></pre>
 * @return {String} The trimmed string
 */
String.prototype.trim = function(){
    var re = /^\s+|\s+$/g;
    return function(){ return this.replace(re, ""); };
}();

// here to prevent dependency on Date.js
/**
 Returns the number of milliseconds between this date and date
 @param {Date} date (optional) Defaults to now
 @return {Number} The diff in milliseconds
 @member Date getElapsed
 */
Date.prototype.getElapsed = function(date) {
    return Math.abs((date || new Date()).getTime()-this.getTime());
};


/**
 * @class Number
 */
Ext.applyIf(Number.prototype, {
    /**
     * Checks whether or not the current number is within a desired range.  If the number is already within the
     * range it is returned, otherwise the min or max value is returned depending on which side of the range is
     * exceeded.  Note that this method returns the constrained value but does not change the current number.
     * @param {Number} min The minimum number in the range
     * @param {Number} max The maximum number in the range
     * @return {Number} The constrained value if outside the range, otherwise the current value
     */
    constrain : function(min, max){
        return Math.min(Math.max(this, min), max);
    }
});
/**
 * @class Ext.util.TaskRunner
 * Provides the ability to execute one or more arbitrary tasks in a multithreaded
 * manner.  Generally, you can use the singleton {@link Ext.TaskMgr} instead, but
 * if needed, you can create separate instances of TaskRunner.  Any number of
 * separate tasks can be started at any time and will run independently of each
 * other. Example usage:
 * <pre><code>
// Start a simple clock task that updates a div once per second
var updateClock = function(){
    Ext.fly('clock').update(new Date().format('g:i:s A'));
} 
var task = {
    run: updateClock,
    interval: 1000 //1 second
}
var runner = new Ext.util.TaskRunner();
runner.start(task);

// equivalent using TaskMgr
Ext.TaskMgr.start({
    run: updateClock,
    interval: 1000
});

 * </code></pre>
 * <p>See the {@link #start} method for details about how to configure a task object.</p>
 * Also see {@link Ext.util.DelayedTask}. 
 * 
 * @constructor
 * @param {Number} interval (optional) The minimum precision in milliseconds supported by this TaskRunner instance
 * (defaults to 10)
 */
Ext.util.TaskRunner = function(interval){
    interval = interval || 10;
    var tasks = [], 
    	removeQueue = [],
    	id = 0,
    	running = false,

    	// private
    	stopThread = function(){
	        running = false;
	        clearInterval(id);
	        id = 0;
	    },

    	// private
    	startThread = function(){
	        if(!running){
	            running = true;
	            id = setInterval(runTasks, interval);
	        }
	    },

    	// private
    	removeTask = function(t){
	        removeQueue.push(t);
	        if(t.onStop){
	            t.onStop.apply(t.scope || t);
	        }
	    },
	    
    	// private
    	runTasks = function(){
	    	var rqLen = removeQueue.length,
	    		now = new Date().getTime();	    			    		
	    
	        if(rqLen > 0){
	            for(var i = 0; i < rqLen; i++){
	                tasks.remove(removeQueue[i]);
	            }
	            removeQueue = [];
	            if(tasks.length < 1){
	                stopThread();
	                return;
	            }
	        }	        
	        for(var i = 0, t, itime, rt, len = tasks.length; i < len; ++i){
	            t = tasks[i];
	            itime = now - t.taskRunTime;
	            if(t.interval <= itime){
	                rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
	                t.taskRunTime = now;
	                if(rt === false || t.taskRunCount === t.repeat){
	                    removeTask(t);
	                    return;
	                }
	            }
	            if(t.duration && t.duration <= (now - t.taskStartTime)){
	                removeTask(t);
	            }
	        }
	    };

    /**
     * Starts a new task.
     * @method start
     * @param {Object} task <p>A config object that supports the following properties:<ul>
     * <li><code>run</code> : Function<div class="sub-desc"><p>The function to execute each time the task is invoked. The
     * function will be called at each interval and passed the <code>args</code> argument if specified, and the
     * current invocation count if not.</p>
     * <p>If a particular scope (<code>this</code> reference) is required, be sure to specify it using the <code>scope</code> argument.</p>
     * <p>Return <code>false</code> from this function to terminate the task.</p></div></li>
     * <li><code>interval</code> : Number<div class="sub-desc">The frequency in milliseconds with which the task
     * should be invoked.</div></li>
     * <li><code>args</code> : Array<div class="sub-desc">(optional) An array of arguments to be passed to the function
     * specified by <code>run</code>. If not specified, the current invocation count is passed.</div></li>
     * <li><code>scope</code> : Object<div class="sub-desc">(optional) The scope (<tt>this</tt> reference) in which to execute the
     * <code>run</code> function. Defaults to the task config object.</div></li>
     * <li><code>duration</code> : Number<div class="sub-desc">(optional) The length of time in milliseconds to invoke
     * the task before stopping automatically (defaults to indefinite).</div></li>
     * <li><code>repeat</code> : Number<div class="sub-desc">(optional) The number of times to invoke the task before
     * stopping automatically (defaults to indefinite).</div></li>
     * </ul></p>
     * <p>Before each invocation, Ext injects the property <code>taskRunCount</code> into the task object so
     * that calculations based on the repeat count can be performed.</p>
     * @return {Object} The task
     */
    this.start = function(task){
        tasks.push(task);
        task.taskStartTime = new Date().getTime();
        task.taskRunTime = 0;
        task.taskRunCount = 0;
        startThread();
        return task;
    };

    /**
     * Stops an existing running task.
     * @method stop
     * @param {Object} task The task to stop
     * @return {Object} The task
     */
    this.stop = function(task){
        removeTask(task);
        return task;
    };

    /**
     * Stops all tasks that are currently running.
     * @method stopAll
     */
    this.stopAll = function(){
        stopThread();
        for(var i = 0, len = tasks.length; i < len; i++){
            if(tasks[i].onStop){
                tasks[i].onStop();
            }
        }
        tasks = [];
        removeQueue = [];
    };
};

/**
 * @class Ext.TaskMgr
 * @extends Ext.util.TaskRunner
 * A static {@link Ext.util.TaskRunner} instance that can be used to start and stop arbitrary tasks.  See
 * {@link Ext.util.TaskRunner} for supported methods and task config properties.
 * <pre><code>
// Start a simple clock task that updates a div once per second
var task = {
    run: function(){
        Ext.fly('clock').update(new Date().format('g:i:s A'));
    },
    interval: 1000 //1 second
}
Ext.TaskMgr.start(task);
</code></pre>
 * <p>See the {@link #start} method for details about how to configure a task object.</p>
 * @singleton
 */
Ext.TaskMgr = new Ext.util.TaskRunner();if(typeof jQuery == "undefined"){
    throw "Unable to load Ext, jQuery not found.";
}

(function(){
var libFlyweight;

Ext.lib.Dom = {
    getViewWidth : function(full){
        // jQuery doesn't report full window size on document query, so max both
        return full ? Math.max(jQuery(document).width(),jQuery(window).width()) : jQuery(window).width();
    },

    getViewHeight : function(full){
        // jQuery doesn't report full window size on document query, so max both
        return full ? Math.max(jQuery(document).height(),jQuery(window).height()) : jQuery(window).height();
    },

    isAncestor : function(p, c){
        var ret = false;

        p = Ext.getDom(p);
        c = Ext.getDom(c);
        if (p && c) {
            if (p.contains) {
                return p.contains(c);
            } else if (p.compareDocumentPosition) {
                return !!(p.compareDocumentPosition(c) & 16);
            } else {
                while (c = c.parentNode) {
                    ret = c == p || ret;
                }
            }
        }
        return ret;
    },

    getRegion : function(el){
        return Ext.lib.Region.getRegion(el);
    },

    //////////////////////////////////////////////////////////////////////////////////////
    // Use of jQuery.offset() removed to promote consistent behavior across libs.
    // JVS 05/23/07
    //////////////////////////////////////////////////////////////////////////////////////

    getY : function(el){
        return this.getXY(el)[1];
    },

    getX : function(el){
        return this.getXY(el)[0];
    },

    getXY : function(el) {
        var p, pe, b, scroll, bd = (document.body || document.documentElement);
        el = Ext.getDom(el);

        if(el == bd){
            return [0, 0];
        }

        if (el.getBoundingClientRect) {
            b = el.getBoundingClientRect();
            scroll = fly(document).getScroll();
            return [Math.round(b.left + scroll.left), Math.round(b.top + scroll.top)];
        }
        var x = 0, y = 0;

        p = el;

        var hasAbsolute = fly(el).getStyle("position") == "absolute";

        while (p) {

            x += p.offsetLeft;
            y += p.offsetTop;

            if (!hasAbsolute && fly(p).getStyle("position") == "absolute") {
                hasAbsolute = true;
            }

            if (Ext.isGecko) {
                pe = fly(p);

                var bt = parseInt(pe.getStyle("borderTopWidth"), 10) || 0;
                var bl = parseInt(pe.getStyle("borderLeftWidth"), 10) || 0;


                x += bl;
                y += bt;


                if (p != el && pe.getStyle('overflow') != 'visible') {
                    x += bl;
                    y += bt;
                }
            }
            p = p.offsetParent;
        }

        if (Ext.isSafari && hasAbsolute) {
            x -= bd.offsetLeft;
            y -= bd.offsetTop;
        }

        if (Ext.isGecko && !hasAbsolute) {
            var dbd = fly(bd);
            x += parseInt(dbd.getStyle("borderLeftWidth"), 10) || 0;
            y += parseInt(dbd.getStyle("borderTopWidth"), 10) || 0;
        }

        p = el.parentNode;
        while (p && p != bd) {
            if (!Ext.isOpera || (p.tagName != 'TR' && fly(p).getStyle("display") != "inline")) {
                x -= p.scrollLeft;
                y -= p.scrollTop;
            }
            p = p.parentNode;
        }
        return [x, y];
    },

    setXY : function(el, xy){
        el = Ext.fly(el, '_setXY');
        el.position();
        var pts = el.translatePoints(xy);
        if(xy[0] !== false){
            el.dom.style.left = pts.left + "px";
        }
        if(xy[1] !== false){
            el.dom.style.top = pts.top + "px";
        }
    },

    setX : function(el, x){
        this.setXY(el, [x, false]);
    },

    setY : function(el, y){
        this.setXY(el, [false, y]);
    }
};

// all lib flyweight calls use their own flyweight to prevent collisions with developer flyweights
function fly(el){
    if(!libFlyweight){
        libFlyweight = new Ext.Element.Flyweight();
    }
    libFlyweight.dom = el;
    return libFlyweight;
}
Ext.lib.Event = {
    getPageX : function(e){
        e = e.browserEvent || e;
        return e.pageX;
    },

    getPageY : function(e){
        e = e.browserEvent || e;
        return e.pageY;
    },

    getXY : function(e){
        e = e.browserEvent || e;
        return [e.pageX, e.pageY];
    },

    getTarget : function(e){
        return e.target;
    },

    // all Ext events will go through event manager which provides scoping
    on : function(el, eventName, fn, scope, override){
        jQuery(el).bind(eventName, fn);
    },

    un : function(el, eventName, fn){
        jQuery(el).unbind(eventName, fn);
    },

    purgeElement : function(el){
        jQuery(el).unbind();
    },

    preventDefault : function(e){
        e = e.browserEvent || e;
        if(e.preventDefault){
            e.preventDefault();
        }else{
            e.returnValue = false;
        }
    },

    stopPropagation : function(e){
        e = e.browserEvent || e;
        if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.cancelBubble = true;
        }
    },

    stopEvent : function(e){
        this.preventDefault(e);
        this.stopPropagation(e);
    },

    onAvailable : function(id, fn, scope){
        var start = new Date();
        var f = function(){
            if(start.getElapsed() > 10000){
                clearInterval(iid);
            }
            var el = document.getElementById(id);
            if(el){
                clearInterval(iid);
                fn.call(scope||window, el);
            }
        };
        var iid = setInterval(f, 50);
    },

    resolveTextNode: Ext.isGecko ? function(node){
        if(!node){
            return;
        }
        var s = HTMLElement.prototype.toString.call(node);
        if(s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]'){
            return;
        }
        return node.nodeType == 3 ? node.parentNode : node;
    } : function(node){
        return node && node.nodeType == 3 ? node.parentNode : node;
    },

    getRelatedTarget: function(ev) {
        ev = ev.browserEvent || ev;
        var t = ev.relatedTarget;
        if (!t) {
            if (ev.type == "mouseout") {
                t = ev.toElement;
            } else if (ev.type == "mouseover") {
                t = ev.fromElement;
            }
        }

        return this.resolveTextNode(t);
    }
};

Ext.lib.Ajax = function(){
    var createComplete = function(cb){
         return function(xhr, status){
            if((status == 'error' || status == 'timeout') && cb.failure){
                cb.failure.call(cb.scope||window, createResponse(cb, xhr));
            }else if(cb.success){
                cb.success.call(cb.scope||window, createResponse(cb, xhr));
            }
         };
    };

    var createResponse = function(cb, xhr){
        var headerObj = {},
            headerStr,
            t,
            s;

        try {
            headerStr = xhr.getAllResponseHeaders();
            Ext.each(headerStr.replace(/\r\n/g, '\n').split('\n'), function(v){
                t = v.indexOf(':');
                if(t >= 0){
                    s = v.substr(0, t).toLowerCase();
                    if(v.charAt(t + 1) == ' '){
                        ++t;
                    }
                    headerObj[s] = v.substr(t + 1);
                }
            });
        } catch(e) {}

        return {
            responseText: xhr.responseText,
            responseXML : xhr.responseXML,
            argument: cb.argument,
            status: xhr.status,
            statusText: xhr.statusText,
            getResponseHeader : function(header){return headerObj[header.toLowerCase()];},
            getAllResponseHeaders : function(){return headerStr}
        };
    };
    return {
        request : function(method, uri, cb, data, options){
            var o = {
                type: method,
                url: uri,
                data: data,
                timeout: cb.timeout,
                complete: createComplete(cb)
            };

            if(options){
                var hs = options.headers;
                if(options.xmlData){
                    o.data = options.xmlData;
                    o.processData = false;
                    o.type = (method ? method : (options.method ? options.method : 'POST'));
                    if (!hs || !hs['Content-Type']){
                        o.contentType = 'text/xml';
                    }
                }else if(options.jsonData){
                    o.data = typeof options.jsonData == 'object' ? Ext.encode(options.jsonData) : options.jsonData;
                    o.processData = false;
                    o.type = (method ? method : (options.method ? options.method : 'POST'));
                    if (!hs || !hs['Content-Type']){
                        o.contentType = 'application/json';
                    }
                }
                if(hs){
                    o.beforeSend = function(xhr){
                        for(var h in hs){
                            if(hs.hasOwnProperty(h)){
                                xhr.setRequestHeader(h, hs[h]);
                            }
                        }
                    }
                }
            }
            jQuery.ajax(o);
        },

        formRequest : function(form, uri, cb, data, isUpload, sslUri){
            jQuery.ajax({
                type: Ext.getDom(form).method ||'POST',
                url: uri,
                data: jQuery(form).serialize()+(data?'&'+data:''),
                timeout: cb.timeout,
                complete: createComplete(cb)
            });
        },

        isCallInProgress : function(trans){
            return false;
        },

        abort : function(trans){
            return false;
        },

        serializeForm : function(form){
            return jQuery(form.dom||form).serialize();
        }
    };
}();

Ext.lib.Anim = function(){
    var createAnim = function(cb, scope){
        var animated = true;
        return {
            stop : function(skipToLast){
                // do nothing
            },

            isAnimated : function(){
                return animated;
            },

            proxyCallback : function(){
                animated = false;
                Ext.callback(cb, scope);
            }
        };
    };
    return {
        scroll : function(el, args, duration, easing, cb, scope){
            // scroll anim not supported so just scroll immediately
            var anim = createAnim(cb, scope);
            el = Ext.getDom(el);
            if(typeof args.scroll.to[0] == 'number'){
                el.scrollLeft = args.scroll.to[0];
            }
            if(typeof args.scroll.to[1] == 'number'){
                el.scrollTop = args.scroll.to[1];
            }
            anim.proxyCallback();
            return anim;
        },

        motion : function(el, args, duration, easing, cb, scope){
            return this.run(el, args, duration, easing, cb, scope);
        },

        color : function(el, args, duration, easing, cb, scope){
            // color anim not supported, so execute callback immediately
            var anim = createAnim(cb, scope);
            anim.proxyCallback();
            return anim;
        },

        run : function(el, args, duration, easing, cb, scope, type){
            var anim = createAnim(cb, scope), e = Ext.fly(el, '_animrun');
            var o = {};
            for(var k in args){
                switch(k){   // jquery doesn't support, so convert
                    case 'points':
                        var by, pts;
                        e.position();
                        if(by = args.points.by){
                            var xy = e.getXY();
                            pts = e.translatePoints([xy[0]+by[0], xy[1]+by[1]]);
                        }else{
                            pts = e.translatePoints(args.points.to);
                        }
                        o.left = pts.left;
                        o.top = pts.top;
                        if(!parseInt(e.getStyle('left'), 10)){ // auto bug
                            e.setLeft(0);
                        }
                        if(!parseInt(e.getStyle('top'), 10)){
                            e.setTop(0);
                        }
                        if(args.points.from){
                            e.setXY(args.points.from);
                        }
                    break;
                    case 'width':
                        o.width = args.width.to;
                        if (args.width.from)
                            e.setWidth(args.width.from);
                    break;
                    case 'height':
                        o.height = args.height.to;
                        if (args.height.from)
                            e.setHeight(args.height.from);
                    break;
                    case 'opacity':
                        o.opacity = args.opacity.to;
                        if (args.opacity.from)
                            e.setOpacity(args.opacity.from);
                    break;
                    case 'left':
                        o.left = args.left.to;
                        if (args.left.from)
                            e.setLeft(args.left.from);
                    break;
                    case 'top':
                        o.top = args.top.to;
                        if (args.top.from)
                            e.setTop(args.top.from);
                    break;
                        // jQuery can't handle callback, scope, and xy arguments, so break here
                    case 'callback':
                    case 'scope':
                    case 'xy':
                    break;

                    default:
                        o[k] = args[k].to;
                        if (args[k].from)
                            e.setStyle(k, args[k].from);
                    break;
                }
            }
            // TODO: find out about easing plug in?
            jQuery(el).animate(o, duration*1000, undefined, anim.proxyCallback);
            return anim;
        }
    };
}();


Ext.lib.Region = function(t, r, b, l) {
    this.top = t;
    this[1] = t;
    this.right = r;
    this.bottom = b;
    this.left = l;
    this[0] = l;
};

Ext.lib.Region.prototype = {
    contains : function(region) {
        return ( region.left   >= this.left   &&
                 region.right  <= this.right  &&
                 region.top    >= this.top    &&
                 region.bottom <= this.bottom    );

    },

    getArea : function() {
        return ( (this.bottom - this.top) * (this.right - this.left) );
    },

    intersect : function(region) {
        var t = Math.max( this.top,    region.top    );
        var r = Math.min( this.right,  region.right  );
        var b = Math.min( this.bottom, region.bottom );
        var l = Math.max( this.left,   region.left   );

        if (b >= t && r >= l) {
            return new Ext.lib.Region(t, r, b, l);
        } else {
            return null;
        }
    },
    union : function(region) {
        var t = Math.min( this.top,    region.top    );
        var r = Math.max( this.right,  region.right  );
        var b = Math.max( this.bottom, region.bottom );
        var l = Math.min( this.left,   region.left   );

        return new Ext.lib.Region(t, r, b, l);
    },

    constrainTo : function(r) {
            this.top = this.top.constrain(r.top, r.bottom);
            this.bottom = this.bottom.constrain(r.top, r.bottom);
            this.left = this.left.constrain(r.left, r.right);
            this.right = this.right.constrain(r.left, r.right);
            return this;
    },

    adjust : function(t, l, b, r){
        this.top += t;
        this.left += l;
        this.right += r;
        this.bottom += b;
        return this;
    }
};

Ext.lib.Region.getRegion = function(el) {
    var p = Ext.lib.Dom.getXY(el);

    var t = p[1];
    var r = p[0] + el.offsetWidth;
    var b = p[1] + el.offsetHeight;
    var l = p[0];

    return new Ext.lib.Region(t, r, b, l);
};

Ext.lib.Point = function(x, y) {
   if (Ext.isArray(x)) {
      y = x[1];
      x = x[0];
   }
    this.x = this.right = this.left = this[0] = x;
    this.y = this.top = this.bottom = this[1] = y;
};

Ext.lib.Point.prototype = new Ext.lib.Region();

// prevent IE leaks
if(Ext.isIE) {
    function fnCleanUp() {
        var p = Function.prototype;
        delete p.createSequence;
        delete p.defer;
        delete p.createDelegate;
        delete p.createCallback;
        delete p.createInterceptor;

        window.detachEvent("onunload", fnCleanUp);
    }
    window.attachEvent("onunload", fnCleanUp);
}
})();
