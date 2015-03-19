/*!
 * CanJS - 1.1.6
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Wed, 05 Jun 2013 18:02:58 GMT
 * Licensed MIT
 * Includes: can/construct,can/observe,can/observe/compute,can/model,can/view,can/view/ejs,can/control,can/route,can/control/route
 * Download from: http://canjs.com
 */
(function(undefined) {

    // ## util/can.js
    var __m4 = (function() {
        var can = window.can || {};
        if (typeof GLOBALCAN === 'undefined' || GLOBALCAN !== false) {
            window.can = can;
        }

        can.isDeferred = function(obj) {
            var isFunction = this.isFunction;
            // Returns `true` if something looks like a deferred.
            return obj && isFunction(obj.then) && isFunction(obj.pipe);
        };

        var cid = 0;
        can.cid = function(object, name) {
            if (object._cid) {
                return object._cid
            } else {
                return object._cid = (name || "") + (++cid)
            }
        }
        can.VERSION = '@EDGE';
        return can;
    })();

    // ## util/event.js
    var __m6 = (function(can) {

        // event.js
        // ---------
        // _Basic event wrapper._
        can.addEvent = function(event, fn) {
            if (!this.__bindEvents) {
                this.__bindEvents = {};
            }
            var eventName = event.split(".")[0];

            if (!this.__bindEvents[eventName]) {
                this.__bindEvents[eventName] = [];
            }
            this.__bindEvents[eventName].push({
                    handler: fn,
                    name: event
                });
            return this;
        };
        can.removeEvent = function(event, fn) {
            if (!this.__bindEvents) {
                return;
            }
            var i = 0,
                events = this.__bindEvents[event.split(".")[0]],
                ev;
            while (i < events.length) {
                ev = events[i]
                if ((fn && ev.handler === fn) || (!fn && ev.name === event)) {
                    events.splice(i, 1);
                } else {
                    i++;
                }
            }
            return this;
        };
        can.dispatch = function(event) {
            if (!this.__bindEvents) {
                return;
            }

            var eventName = event.type.split(".")[0],
                handlers = (this.__bindEvents[eventName] || []).slice(0),
                self = this,
                args = [event].concat(event.data || []);

            can.each(handlers, function(ev) {
                event.data = args.slice(1);
                ev.handler.apply(self, args);
            });
        }

        return can;

    })(__m4);

    // ## util/fragment.js
    var __m7 = (function(can) {

        // fragment.js
        // ---------
        // _DOM Fragment support._
        var fragmentRE = /^\s*<(\w+)[^>]*>/,
            fragment = function(html, name) {
                if (name === undefined) {
                    name = fragmentRE.test(html) && RegExp.$1;
                }

                if (html && can.isFunction(html.replace)) {
                    // Fix "XHTML"-style tags in all browsers
                    html = html.replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, "<$1></$2>");
                }

                var container = document.createElement('div'),
                    temp = document.createElement('div')

                    // IE's parser will strip any `<tr><td>` tags when `innerHTML`
                    // is called on a `tbody`. To get around this, we construct a 
                    // valid table with a `tbody` that has the `innerHTML` we want. 
                    // Then the container is the `firstChild` of the `tbody`.
                    // [source](http://www.ericvasilik.com/2006/07/code-karma.html).
                    if (name === "tbody" || name === "tfoot" || name === "thead") {
                        temp.innerHTML = "<table>" + html + "</table>";
                        container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild;
                    } else if (name === "tr") {
                        temp.innerHTML = "<table><tbody>" + html + "</tbody></table>";
                        container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild.firstChild;
                    } else if (name === "td" || name === "th") {
                        temp.innerHTML = "<table><tbody><tr>" + html + "</tr></tbody></table>";
                        container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild.firstChild.firstChild;
                    } else if (name === 'option') {
                        temp.innerHTML = "<select>" + html + "</select>";
                        container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild;
                    } else {
                        container.innerHTML = '' + html;
                    }

                    // IE8 barfs if you pass slice a `childNodes` object, so make a copy.
                var tmp = {},
                    children = container.childNodes;
                tmp.length = children.length;
                for (var i = 0; i < children.length; i++) {
                    tmp[i] = children[i];
                }
                return [].slice.call(tmp);
            }

        can.buildFragment = function(html, nodes) {
            var parts = fragment(html),
                frag = document.createDocumentFragment();

            can.each(parts, function(part) {
                frag.appendChild(part);
            })
            return frag;
        };

        return can;
    })(__m4);

    // ## util/deferred.js
    var __m8 = (function(can) {

        // deferred.js
        // ---------
        // _Lightweight, jQuery style deferreds._
        // extend is usually provided by the wrapper but to avoid steal.then calls
        // we define a simple extend here as well
        var extend = function(target, src) {
            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    target[key] = src[key];
                }
            }
        },
            Deferred = function(func) {
                if (!(this instanceof Deferred))
                    return new Deferred();

                this._doneFuncs = [];
                this._failFuncs = [];
                this._resultArgs = null;
                this._status = "";

                // Check for option `function` -- call it with this as context and as first
                // parameter, as specified in jQuery API.
                func && func.call(this, this);
            };

        can.Deferred = Deferred;
        can.when = Deferred.when = function() {
            var args = can.makeArray(arguments);
            if (args.length < 2) {
                var obj = args[0];
                if (obj && (can.isFunction(obj.isResolved) && can.isFunction(obj.isRejected))) {
                    return obj;
                } else {
                    return Deferred().resolve(obj);
                }
            } else {

                var df = Deferred(),
                    done = 0,
                    // Resolve params -- params of each resolve, we need to track them down 
                    // to be able to pass them in the correct order if the master 
                    // needs to be resolved.
                    rp = [];

                can.each(args, function(arg, j) {
                    arg.done(function() {
                        rp[j] = (arguments.length < 2) ? arguments[0] : arguments;
                        if (++done == args.length) {
                            df.resolve.apply(df, rp);
                        }
                    }).fail(function() {
                        df.reject((arguments.length === 1) ? arguments[0] : arguments);
                    });
                });

                return df;

            }
        }

        var resolveFunc = function(type, _status) {
            return function(context) {
                var args = this._resultArgs = (arguments.length > 1) ? arguments[1] : [];
                return this.exec(context, this[type], args, _status);
            }
        },
            doneFunc = function(type, _status) {
                return function() {
                    var self = this;
                    // In Safari, the properties of the `arguments` object are not enumerable, 
                    // so we have to convert arguments to an `Array` that allows `can.each` to loop over them.
                    can.each(Array.prototype.slice.call(arguments), function(v, i, args) {
                        if (!v)
                            return;
                        if (v.constructor === Array) {
                            args.callee.apply(self, v)
                        } else {
                            // Immediately call the `function` if the deferred has been resolved.
                            if (self._status === _status)
                                v.apply(self, self._resultArgs || []);

                            self[type].push(v);
                        }
                    });
                    return this;
                }
            };

        extend(Deferred.prototype, {
                pipe: function(done, fail) {
                    var d = can.Deferred();
                    this.done(function() {
                        d.resolve(done.apply(this, arguments));
                    });

                    this.fail(function() {
                        if (fail) {
                            d.reject(fail.apply(this, arguments));
                        } else {
                            d.reject.apply(d, arguments);
                        }
                    });
                    return d;
                },
                resolveWith: resolveFunc("_doneFuncs", "rs"),
                rejectWith: resolveFunc("_failFuncs", "rj"),
                done: doneFunc("_doneFuncs", "rs"),
                fail: doneFunc("_failFuncs", "rj"),
                always: function() {
                    var args = can.makeArray(arguments);
                    if (args.length && args[0])
                        this.done(args[0]).fail(args[0]);

                    return this;
                },

                then: function() {
                    var args = can.makeArray(arguments);
                    // Fail `function`(s)
                    if (args.length > 1 && args[1])
                        this.fail(args[1]);

                    // Done `function`(s)
                    if (args.length && args[0])
                        this.done(args[0]);

                    return this;
                },

                state: function() {
                    switch (this._status) {
                        case 'rs':
                            return 'resolved';
                        case 'rj':
                            return 'rejected';
                        default:
                            return 'pending';
                    }
                },

                isResolved: function() {
                    return this._status === "rs";
                },

                isRejected: function() {
                    return this._status === "rj";
                },

                reject: function() {
                    return this.rejectWith(this, arguments);
                },

                resolve: function() {
                    return this.resolveWith(this, arguments);
                },

                exec: function(context, dst, args, st) {
                    if (this._status !== "")
                        return this;

                    this._status = st;

                    can.each(dst, function(d) {
                        d.apply(context, args);
                    });

                    return this;
                }
            });

        return can;
    })(__m4);

    // ## util/array/each.js
    var __m9 = (function(can) {
        can.each = function(elements, callback, context) {
            var i = 0,
                key;
            if (elements) {
                if (typeof elements.length === 'number' && elements.pop) {
                    if (elements.attr) {
                        elements.attr('length');
                    }
                    for (key = elements.length; i < key; i++) {
                        if (callback.call(context || elements[i], elements[i], i, elements) === false) {
                            break;
                        }
                    }
                } else if (elements.hasOwnProperty) {
                    for (key in elements) {
                        if (elements.hasOwnProperty(key)) {
                            if (callback.call(context || elements[key], elements[key], key, elements) === false) {
                                break;
                            }
                        }
                    }
                }
            }
            return elements;
        };

        return can;
    })(__m4);

    // ## util/object/isplain/isplain.js
    var __m10 = (function(can) {
        var core_hasOwn = Object.prototype.hasOwnProperty,
            isWindow = function(obj) {
                return obj != null && obj == obj.window;
            },
            isPlainObject = function(obj) {
                // Must be an Object.
                // Because of IE, we also have to check the presence of the constructor property.
                // Make sure that DOM nodes and window objects don't pass through, as well
                if (!obj || (typeof obj !== "object") || obj.nodeType || isWindow(obj)) {
                    return false;
                }

                try {
                    // Not own constructor property must be Object
                    if (obj.constructor && !core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                        return false;
                    }
                } catch (e) {
                    // IE8,9 Will throw exceptions on certain host objects #9897
                    return false;
                }

                // Own properties are enumerated firstly, so to speed up,
                // if last one is own, then all properties are own.

                var key;
                for (key in obj) {}

                return key === undefined || core_hasOwn.call(obj, key);
            }

        can.isPlainObject = isPlainObject;
        return can;
    })(__m4);

    // ## util/mootools/mootools.js
    var __m3 = (function(can) {
        // mootools.js
        // ---------
        // _MooTools node list._
        // Map string helpers.
        can.trim = function(s) {
            return s && s.trim()
        }

        // This extend() function is ruthlessly and shamelessly stolen from
        // jQuery 1.8.2:, lines 291-353.
        var extend = function() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && !can.isFunction(target)) {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            if (length === i) {
                target = this;
                --i;
            }

            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (can.isPlainObject(copy) || (copyIsArray = can.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && can.isArray(src) ? src : [];

                            } else {
                                clone = src && can.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = can.extend(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };

        can.extend = extend;

        // Map array helpers.
        can.makeArray = function(item) {
            // All other libraries return a copy if item is an array.
            // The original Mootools Array.from returned the same item so we need to slightly modify it
            if (item == null) return [];
            try {
                return (Type.isEnumerable(item) && typeof item != 'string') ? Array.prototype.slice.call(item) : [item];
            } catch (ex) {
                // some things like DOMNodeChildCollections don't slice so good.
                // This pains me, but it has to be done.
                var arr = [],
                    i;
                for (i = 0; i < item.length; ++i) {
                    arr.push(item[i]);
                }
                return arr;
            }
        }

        can.isArray = function(arr) {
            return typeOf(arr) === 'array'
        };
        can.inArray = function(item, arr) {
            if (!arr) {
                return -1;
            }
            return Array.prototype.indexOf.call(arr, item);
        }
        can.map = function(arr, fn) {
            return Array.from(arr || []).map(fn);
        }

        // Map object helpers.
        can.param = function(object) {
            return Object.toQueryString(object)
        }
        can.isEmptyObject = function(object) {
            return Object.keys(object).length === 0;
        }
        // Map function helpers.
        can.proxy = function(func) {
            var args = can.makeArray(arguments),
                func = args.shift();

            return func.bind.apply(func, args)
        }
        can.isFunction = function(f) {
            return typeOf(f) == 'function'
        }

        // Make this object so you can bind on it.
        can.bind = function(ev, cb) {

            // If we can bind to it...
            if (this.bind && this.bind !== can.bind) {
                this.bind(ev, cb)
            } else if (this.addEvent) {
                this.addEvent(ev, cb);
            } else if (this.nodeName && this.nodeType == 1) {
                $(this).addEvent(ev, cb)
            } else {
                // Make it bind-able...
                can.addEvent.call(this, ev, cb)
            }
            return this;
        }
        can.unbind = function(ev, cb) {
            // If we can bind to it...
            if (this.unbind && this.unbind !== can.unbind) {
                this.unbind(ev, cb)
            } else if (this.removeEvent) {
                this.removeEvent(ev, cb)
            }
            if (this.nodeName && this.nodeType == 1) {
                $(this).removeEvent(ev, cb)
            } else {
                // Make it bind-able...
                can.removeEvent.call(this, ev, cb)
            }
            return this;
        }
        can.trigger = function(item, event, args, bubble) {
            // Defaults to `true`.
            bubble = (bubble === undefined ? true : bubble);
            args = args || []
            if (item.fireEvent) {
                item = item[0] || item;
                // walk up parents to simulate bubbling .
                while (item) {
                    // Handle walking yourself.
                    if (!event.type) {
                        event = {
                            type: event,
                            target: item
                        }
                    }
                    var events = (item !== window ?
                        can.$(item).retrieve('events')[0] :
                        item.retrieve('events'));
                    if (events && events[event.type]) {
                        events[event.type].keys.each(function(fn) {
                            fn.apply(this, [event].concat(args));
                        }, this);
                    }
                    // If we are bubbling, get parent node.
                    if (bubble && item.parentNode) {
                        item = item.parentNode
                    } else {
                        item = null;
                    }

                }

            } else {
                if (typeof event === 'string') {
                    event = {
                        type: event
                    }
                }
                event.target = event.target || item;
                event.data = args
                can.dispatch.call(item, event)
            }
        }
        can.delegate = function(selector, ev, cb) {
            if (this.delegate) {
                this.delegate(selector, ev, cb)
            } else if (this.addEvent) {
                this.addEvent(ev + ":relay(" + selector + ")", cb)
            } else {
                // make it bind-able ...
            }
            return this;
        }
        can.undelegate = function(selector, ev, cb) {
            if (this.undelegate) {
                this.undelegate(selector, ev, cb)
            } else if (this.removeEvent) {
                this.removeEvent(ev + ":relay(" + selector + ")", cb)
            } else {
                // make it bind-able ...

            }
            return this;
        }
        var optionsMap = {
            type: "method",
            success: undefined,
            error: undefined
        }
        var updateDeferred = function(xhr, d) {
            for (var prop in xhr) {
                if (typeof d[prop] == 'function') {
                    d[prop] = function() {
                        xhr[prop].apply(xhr, arguments)
                    }
                } else {
                    d[prop] = prop[xhr]
                }
            }
        }
        can.ajax = function(options) {
            var d = can.Deferred(),
                requestOptions = can.extend({}, options),
                request;
            // Map jQuery options to MooTools options.

            for (var option in optionsMap) {
                if (requestOptions[option] !== undefined) {
                    requestOptions[optionsMap[option]] = requestOptions[option];
                    delete requestOptions[option]
                }
            }
            // Mootools defaults to 'post', but Can expects a default of 'get'
            requestOptions.method = requestOptions.method || 'get';
            requestOptions.url = requestOptions.url.toString();

            var success = options.onSuccess || options.success,
                error = options.onFailure || options.error;

            requestOptions.onSuccess = function(response, xml) {
                var data = response;
                updateDeferred(request.xhr, d);
                d.resolve(data, "success", request.xhr);
                success && success(data, "success", request.xhr);
            }
            requestOptions.onFailure = function() {
                updateDeferred(request.xhr, d);
                d.reject(request.xhr, "error");
                error(request.xhr, "error");
            }

            if (options.dataType === 'json') {
                request = new Request.JSON(requestOptions);
            } else {
                request = new Request(requestOptions);
            }
            request.send();
            updateDeferred(request.xhr, d);
            return d;

        }
        // Element -- get the wrapped helper.
        can.$ = function(selector) {
            if (selector === window) {
                return window;
            }
            return $$(selector)
        }

        // Add `document` fragment support.
        var old = document.id;
        document.id = function(el) {
            if (el && el.nodeType === 11) {
                return el
            } else {
                return old.apply(document, arguments);
            }
        };
        can.append = function(wrapped, html) {
            if (typeof html === 'string') {
                html = can.buildFragment(html)
            }
            return wrapped.grab(html)
        }
        can.filter = function(wrapped, filter) {
            return wrapped.filter(filter);
        }
        can.data = function(wrapped, key, value) {
            if (value === undefined) {
                return wrapped[0].retrieve(key)
            } else {
                return wrapped.store(key, value)
            }
        }
        can.addClass = function(wrapped, className) {
            return wrapped.addClass(className);
        }
        can.remove = function(wrapped) {
            // We need to remove text nodes ourselves.
            var filtered = wrapped.filter(function(node) {
                if (node.nodeType !== 1) {
                    node.parentNode.removeChild(node);
                } else {
                    return true;
                }
            })
            filtered.destroy();
            return filtered;
        }

        // Destroyed method.
        var destroy = Element.prototype.destroy;
        Element.implement({
                destroy: function() {
                    can.trigger(this, "destroyed", [], false)
                    var elems = this.getElementsByTagName("*");
                    for (var i = 0, elem;
                        (elem = elems[i]) !== undefined; i++) {
                        can.trigger(elem, "destroyed", [], false);
                    }
                    destroy.apply(this, arguments)
                }
            });
        can.get = function(wrapped, index) {
            return wrapped[index];
        }

        // Overwrite to handle IE not having an id.
        // IE barfs if text node.
        var idOf = Slick.uidOf;
        Slick.uidOf = function(node) {
            // for some reason, in IE8, node will be the window but not equal it.
            if (node.nodeType === 1 || node === window || node.document === document) {
                return idOf(node);
            } else {
                return Math.random();
            }
        }

        return can;
    })(__m4, {}, __m6, __m7, __m8, __m9, __m10);

    // ## util/string/string.js
    var __m2 = (function(can) {
        // ##string.js
        // _Miscellaneous string utility functions._  

        // Several of the methods in this plugin use code adapated from Prototype
        // Prototype JavaScript framework, version 1.6.0.1.
        // © 2005-2007 Sam Stephenson
        var strUndHash = /_|-/,
            strColons = /\=\=/,
            strWords = /([A-Z]+)([A-Z][a-z])/g,
            strLowUp = /([a-z\d])([A-Z])/g,
            strDash = /([a-z\d])([A-Z])/g,
            strReplacer = /\{([^\}]+)\}/g,
            strQuote = /"/g,
            strSingleQuote = /'/g,

            // Returns the `prop` property from `obj`.
            // If `add` is true and `prop` doesn't exist in `obj`, create it as an
            // empty object.
            getNext = function(obj, prop, add) {
                var result = obj[prop];

                if (result === undefined && add === true) {
                    result = obj[prop] = {}
                }
                return result
            },

            // Returns `true` if the object can have properties (no `null`s).
            isContainer = function(current) {
                return (/^f|^o/).test(typeof current);
            };

        can.extend(can, {
                // Escapes strings for HTML.

                esc: function(content) {
                    // Convert bad values into empty strings
                    var isInvalid = content === null || content === undefined || (isNaN(content) && ("" + content === 'NaN'));
                    return ("" + (isInvalid ? '' : content))
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(strQuote, '&#34;')
                        .replace(strSingleQuote, "&#39;");
                },


                getObject: function(name, roots, add) {

                    // The parts of the name we are looking up
                    // `['App','Models','Recipe']`
                    var parts = name ? name.split('.') : [],
                        length = parts.length,
                        current,
                        r = 0,
                        i, container, rootsLength;

                    // Make sure roots is an `array`.
                    roots = can.isArray(roots) ? roots : [roots || window];

                    rootsLength = roots.length

                    if (!length) {
                        return roots[0];
                    }

                    // For each root, mark it as current.
                    for (r; r < rootsLength; r++) {
                        current = roots[r];
                        container = undefined;

                        // Walk current to the 2nd to last object or until there
                        // is not a container.
                        for (i = 0; i < length && isContainer(current); i++) {
                            container = current;
                            current = getNext(container, parts[i]);
                        }

                        // If we found property break cycle
                        if (container !== undefined && current !== undefined) {
                            break
                        }
                    }

                    // Remove property from found container
                    if (add === false && current !== undefined) {
                        delete container[parts[i - 1]]
                    }

                    // When adding property add it to the first root
                    if (add === true && current === undefined) {
                        current = roots[0]

                        for (i = 0; i < length && isContainer(current); i++) {
                            current = getNext(current, parts[i], true);
                        }
                    }

                    return current;
                },
                // Capitalizes a string.

                capitalize: function(s, cache) {
                    // Used to make newId.
                    return s.charAt(0).toUpperCase() + s.slice(1);
                },

                // Underscores a string.

                underscore: function(s) {
                    return s
                        .replace(strColons, '/')
                        .replace(strWords, '$1_$2')
                        .replace(strLowUp, '$1_$2')
                        .replace(strDash, '_')
                        .toLowerCase();
                },
                // Micro-templating.

                sub: function(str, data, remove) {
                    var obs = [];

                    str = str || '';

                    obs.push(str.replace(strReplacer, function(whole, inside) {

                                // Convert inside to type.
                                var ob = can.getObject(inside, data, remove === true ? false : undefined);

                                if (ob === undefined) {
                                    obs = null;
                                    return "";
                                }

                                // If a container, push into objs (which will return objects found).
                                if (isContainer(ob) && obs) {
                                    obs.push(ob);
                                    return "";
                                }

                                return "" + ob;
                            }));

                    return obs === null ? obs : (obs.length <= 1 ? obs[0] : obs);
                },

                // These regex's are used throughout the rest of can, so let's make
                // them available.
                replacer: strReplacer,
                undHash: strUndHash
            });
        return can;
    })(__m3);

    // ## construct/construct.js
    var __m1 = (function(can) {

        // ## construct.js
        // `can.Construct`  
        // _This is a modified version of
        // [John Resig's class](http://ejohn.org/blog/simple-javascript-inheritance/).  
        // It provides class level inheritance and callbacks._

        // A private flag used to initialize a new class instance without
        // initializing it's bindings.
        var initializing = 0;


        can.Construct = function() {
            if (arguments.length) {
                return can.Construct.extend.apply(can.Construct, arguments);
            }
        };


        can.extend(can.Construct, {

                newInstance: function() {
                    // Get a raw instance object (`init` is not called).
                    var inst = this.instance(),
                        arg = arguments,
                        args;

                    // Call `setup` if there is a `setup`
                    if (inst.setup) {
                        args = inst.setup.apply(inst, arguments);
                    }

                    // Call `init` if there is an `init`  
                    // If `setup` returned `args`, use those as the arguments
                    if (inst.init) {
                        inst.init.apply(inst, args || arguments);
                    }

                    return inst;
                },
                // Overwrites an object with methods. Used in the `super` plugin.
                // `newProps` - New properties to add.  
                // `oldProps` - Where the old properties might be (used with `super`).  
                // `addTo` - What we are adding to.
                _inherit: function(newProps, oldProps, addTo) {
                    can.extend(addTo || newProps, newProps || {})
                },
                // used for overwriting a single property.
                // this should be used for patching other objects
                // the super plugin overwrites this
                _overwrite: function(what, oldProps, propName, val) {
                    what[propName] = val;
                },
                // Set `defaults` as the merger of the parent `defaults` and this 
                // object's `defaults`. If you overwrite this method, make sure to
                // include option merging logic.

                setup: function(base, fullName) {
                    this.defaults = can.extend(true, {}, base.defaults, this.defaults);
                },
                // Create's a new `class` instance without initializing by setting the
                // `initializing` flag.
                instance: function() {

                    // Prevents running `init`.
                    initializing = 1;

                    var inst = new this();

                    // Allow running `init`.
                    initializing = 0;

                    return inst;
                },
                // Extends classes.

                extend: function(fullName, klass, proto) {
                    // Figure out what was passed and normalize it.
                    if (typeof fullName != 'string') {
                        proto = klass;
                        klass = fullName;
                        fullName = null;
                    }

                    if (!proto) {
                        proto = klass;
                        klass = null;
                    }
                    proto = proto || {};

                    var _super_class = this,
                        _super = this.prototype,
                        name, shortName, namespace, prototype;

                    // Instantiate a base class (but only create the instance,
                    // don't run the init constructor).
                    prototype = this.instance();

                    // Copy the properties over onto the new prototype.
                    can.Construct._inherit(proto, _super, prototype);

                    // The dummy class constructor.

                    function Constructor() {
                        // All construction is actually done in the init method.
                        if (!initializing) {
                            return this.constructor !== Constructor && arguments.length ?
                            // We are being called without `new` or we are extending.
                            arguments.callee.extend.apply(arguments.callee, arguments) :
                            // We are being called with `new`.
                            this.constructor.newInstance.apply(this.constructor, arguments);
                        }
                    }

                    // Copy old stuff onto class (can probably be merged w/ inherit)
                    for (name in _super_class) {
                        if (_super_class.hasOwnProperty(name)) {
                            Constructor[name] = _super_class[name];
                        }
                    }

                    // Copy new static properties on class.
                    can.Construct._inherit(klass, _super_class, Constructor);

                    // Setup namespaces.
                    if (fullName) {

                        var parts = fullName.split('.'),
                            shortName = parts.pop(),
                            current = can.getObject(parts.join('.'), window, true),
                            namespace = current,
                            _fullName = can.underscore(fullName.replace(/\./g, "_")),
                            _shortName = can.underscore(shortName);



                        current[shortName] = Constructor;
                    }

                    // Set things that shouldn't be overwritten.
                    can.extend(Constructor, {
                            constructor: Constructor,
                            prototype: prototype,

                            namespace: namespace,

                            _shortName: _shortName,

                            fullName: fullName,
                            _fullName: _fullName
                        });

                    // Dojo and YUI extend undefined
                    if (shortName !== undefined) {
                        Constructor.shortName = shortName;
                    }

                    // Make sure our prototype looks nice.
                    Constructor.prototype.constructor = Constructor;


                    // Call the class `setup` and `init`
                    var t = [_super_class].concat(can.makeArray(arguments)),
                        args = Constructor.setup.apply(Constructor, t);

                    if (Constructor.init) {
                        Constructor.init.apply(Constructor, args || t);
                    }


                    return Constructor;

                }

            });
        return can.Construct;
    })(__m2);

    // ## util/bind/bind.js
    var __m12 = (function(can) {


        // ## Bind helpers
        can.bindAndSetup = function() {
            // Add the event to this object
            can.addEvent.apply(this, arguments);
            // If not initializing, and the first binding
            // call bindsetup if the function exists.
            if (!this._init) {
                if (!this._bindings) {
                    this._bindings = 1;
                    // setup live-binding
                    this._bindsetup && this._bindsetup();

                } else {
                    this._bindings++;
                }

            }

            return this;
        };

        can.unbindAndTeardown = function(ev, handler) {
            // Remove the event handler
            can.removeEvent.apply(this, arguments);

            this._bindings--;
            // If there are no longer any bindings and
            // there is a bindteardown method, call it.
            if (!this._bindings) {
                this._bindteardown && this._bindteardown();
            }
            return this;
        }

        return can;

    })(__m3);

    // ## observe/observe.js
    var __m11 = (function(can, bind) {
        // ## observe.js  
        // `can.Observe`  
        // _Provides the observable pattern for JavaScript Objects._  
        // Returns `true` if something is an object with properties of its own.
        var canMakeObserve = function(obj) {
            return obj && !can.isDeferred(obj) && (can.isArray(obj) || can.isPlainObject(obj) || (obj instanceof can.Observe));
        },

            // Removes all listeners.
            unhookup = function(items, namespace) {
                return can.each(items, function(item) {
                    if (item && item.unbind) {
                        item.unbind("change" + namespace);
                    }
                });
            },
            // Listens to changes on `child` and "bubbles" the event up.  
            // `child` - The object to listen for changes on.  
            // `prop` - The property name is at on.  
            // `parent` - The parent object of prop.
            // `ob` - (optional) The Observe object constructor
            // `list` - (optional) The observable list constructor
            hookupBubble = function(child, prop, parent, Ob, List) {
                Ob = Ob || Observe;
                List = List || Observe.List;

                // If it's an `array` make a list, otherwise a child.
                if (child instanceof Observe) {
                    // We have an `observe` already...
                    // Make sure it is not listening to this already
                    // It's only listening if it has bindings already.
                    parent._bindings && unhookup([child], parent._cid);
                } else if (can.isArray(child)) {
                    child = new List(child);
                } else {
                    child = new Ob(child);
                }
                // only listen if something is listening to you
                if (parent._bindings) {
                    // Listen to all changes and `batchTrigger` upwards.
                    bindToChildAndBubbleToParent(child, prop, parent)
                }


                return child;
            },
            bindToChildAndBubbleToParent = function(child, prop, parent) {
                child.bind("change" + parent._cid, function() {
                    // `batchTrigger` the type on this...
                    var args = can.makeArray(arguments),
                        ev = args.shift();
                    args[0] = (prop === "*" ? [parent.indexOf(child), args[0]] : [prop, args[0]]).join(".");

                    // track objects dispatched on this observe		
                    ev.triggeredNS = ev.triggeredNS || {};

                    // if it has already been dispatched exit
                    if (ev.triggeredNS[parent._cid]) {
                        return;
                    }

                    ev.triggeredNS[parent._cid] = true;
                    // send change event with modified attr to parent	
                    can.trigger(parent, ev, args);
                    // send modified attr event to parent
                    //can.trigger(parent, args[0], args);
                });
            }
            // An `id` to track events for a given observe.
        observeId = 0,
        // A helper used to serialize an `Observe` or `Observe.List`.  
        // `observe` - The observable.  
        // `how` - To serialize with `attr` or `serialize`.  
        // `where` - To put properties, in an `{}` or `[]`.
        serialize = function(observe, how, where) {
            // Go through each property.
            observe.each(function(val, name) {
                // If the value is an `object`, and has an `attrs` or `serialize` function.
                where[name] = canMakeObserve(val) && can.isFunction(val[how]) ?
                // Call `attrs` or `serialize` to get the original data back.
                val[how]() :
                // Otherwise return the value.
                val;
            });
            return where;
        },
        attrParts = function(attr, keepKey) {
            if (keepKey) {
                return [attr];
            }
            return can.isArray(attr) ? attr : ("" + attr).split(".");
        },
        // Which batch of events this is for -- might not want to send multiple
        // messages on the same batch.  This is mostly for event delegation.
        batchNum = 1,
        // how many times has start been called without a stop
        transactions = 0,
        // an array of events within a transaction
        batchEvents = [],
        stopCallbacks = [],
        makeBindSetup = function(wildcard) {
            return function() {
                var parent = this;
                this._each(function(child, prop) {
                    if (child && child.bind) {
                        bindToChildAndBubbleToParent(child, wildcard || prop, parent)
                    }
                })
            };
        };


        var Observe = can.Map = can.Observe = can.Construct({

                // keep so it can be overwritten
                bind: can.bindAndSetup,
                unbind: can.unbindAndTeardown,
                id: "id",
                canMakeObserve: canMakeObserve,
                // starts collecting events
                // takes a callback for after they are updated
                // how could you hook into after ejs

                startBatch: function(batchStopHandler) {
                    transactions++;
                    batchStopHandler && stopCallbacks.push(batchStopHandler);
                },

                stopBatch: function(force, callStart) {
                    if (force) {
                        transactions = 0;
                    } else {
                        transactions--;
                    }

                    if (transactions == 0) {
                        var items = batchEvents.slice(0),
                            callbacks = stopCallbacks.slice(0);
                        batchEvents = [];
                        stopCallbacks = [];
                        batchNum++;
                        callStart && this.startBatch();
                        can.each(items, function(args) {
                            can.trigger.apply(can, args);
                        });
                        can.each(callbacks, function(cb) {
                            cb();
                        });
                    }
                },

                triggerBatch: function(item, event, args) {
                    // Don't send events if initalizing.
                    if (!item._init) {
                        if (transactions == 0) {
                            return can.trigger(item, event, args);
                        } else {
                            event = typeof event === "string" ? {
                                type: event
                            } :
                                event;
                            event.batchNum = batchNum;
                            batchEvents.push([
                                    item,
                                    event,
                                    args
                                ]);
                        }
                    }
                },

                keys: function(observe) {
                    var keys = [];
                    Observe.__reading && Observe.__reading(observe, '__keys');
                    for (var keyName in observe._data) {
                        keys.push(keyName);
                    }
                    return keys;
                }
            },

            {
                setup: function(obj) {
                    // `_data` is where we keep the properties.
                    this._data = {};

                    // The namespace this `object` uses to listen to events.
                    can.cid(this, ".observe");
                    // Sets all `attrs`.
                    this._init = 1;
                    this.attr(obj);
                    this.bind('change' + this._cid, can.proxy(this._changes, this));
                    delete this._init;
                },
                _bindsetup: makeBindSetup(),
                _bindteardown: function() {
                    var cid = this._cid;
                    this._each(function(child) {
                        unhookup([child], cid)
                    })
                },
                _changes: function(ev, attr, how, newVal, oldVal) {
                    Observe.triggerBatch(this, {
                            type: attr,
                            batchNum: ev.batchNum
                        }, [newVal, oldVal]);
                },
                _triggerChange: function(attr, how, newVal, oldVal) {
                    Observe.triggerBatch(this, "change", can.makeArray(arguments))
                },
                // no live binding iterator
                _each: function(callback) {
                    var data = this.__get();
                    for (var prop in data) {
                        if (data.hasOwnProperty(prop)) {
                            callback(data[prop], prop)
                        }
                    }
                },

                attr: function(attr, val) {
                    // This is super obfuscated for space -- basically, we're checking
                    // if the type of the attribute is not a `number` or a `string`.
                    var type = typeof attr;
                    if (type !== "string" && type !== "number") {
                        return this._attrs(attr, val)
                    } else if (arguments.length === 1) { // If we are getting a value.
                        // Let people know we are reading.
                        Observe.__reading && Observe.__reading(this, attr)
                        return this._get(attr)
                    } else {
                        // Otherwise we are setting.
                        this._set(attr, val);
                        return this;
                    }
                },

                each: function() {
                    Observe.__reading && Observe.__reading(this, '__keys');
                    return can.each.apply(undefined, [this.__get()].concat(can.makeArray(arguments)))
                },

                removeAttr: function(attr) {
                    // Info if this is List or not
                    var isList = this instanceof can.Observe.List,
                        // Convert the `attr` into parts (if nested).
                        parts = attrParts(attr),
                        // The actual property to remove.
                        prop = parts.shift(),
                        // The current value.
                        current = isList ? this[prop] : this._data[prop];

                    // If we have more parts, call `removeAttr` on that part.
                    if (parts.length) {
                        return current.removeAttr(parts)
                    } else {
                        if (isList) {
                            this.splice(prop, 1)
                        } else if (prop in this._data) {
                            // Otherwise, `delete`.
                            delete this._data[prop];
                            // Create the event.
                            if (!(prop in this.constructor.prototype)) {
                                delete this[prop]
                            }
                            // Let others know the number of keys have changed
                            Observe.triggerBatch(this, "__keys");
                            this._triggerChange(prop, "remove", undefined, current);

                        }
                        return current;
                    }
                },
                // Reads a property from the `object`.
                _get: function(attr) {
                    var value = typeof attr === 'string' && !! ~attr.indexOf('.') && this.__get(attr);
                    if (value) {
                        return value;
                    }

                    // break up the attr (`"foo.bar"`) into `["foo","bar"]`
                    var parts = attrParts(attr),
                        // get the value of the first attr name (`"foo"`)
                        current = this.__get(parts.shift());
                    // if there are other attributes to read
                    return parts.length ?
                    // and current has a value
                    current ?
                    // lookup the remaining attrs on current
                    current._get(parts) :
                    // or if there's no current, return undefined
                    undefined :
                    // if there are no more parts, return current
                    current;
                },
                // Reads a property directly if an `attr` is provided, otherwise
                // returns the "real" data object itself.
                __get: function(attr) {
                    return attr ? this._data[attr] : this._data;
                },
                // Sets `attr` prop as value on this object where.
                // `attr` - Is a string of properties or an array  of property values.
                // `value` - The raw value to set.
                _set: function(attr, value, keepKey) {
                    // Convert `attr` to attr parts (if it isn't already).
                    var parts = attrParts(attr, keepKey),
                        // The immediate prop we are setting.
                        prop = parts.shift(),
                        // The current value.
                        current = this.__get(prop);

                    // If we have an `object` and remaining parts.
                    if (canMakeObserve(current) && parts.length) {
                        // That `object` should set it (this might need to call attr).
                        current._set(parts, value)
                    } else if (!parts.length) {
                        // We're in "real" set territory.
                        if (this.__convert) {
                            value = this.__convert(prop, value)
                        }
                        this.__set(prop, value, current)
                    } else {
                        throw "can.Observe: Object does not exist"
                    }
                },
                __set: function(prop, value, current) {

                    // Otherwise, we are setting it on this `object`.
                    // TODO: Check if value is object and transform
                    // are we changing the value.
                    if (value !== current) {
                        // Check if we are adding this for the first time --
                        // if we are, we need to create an `add` event.
                        var changeType = this.__get().hasOwnProperty(prop) ? "set" : "add";

                        // Set the value on data.
                        this.___set(prop,

                            // If we are getting an object.
                            canMakeObserve(value) ?

                            // Hook it up to send event.
                            hookupBubble(value, prop, this) :
                            // Value is normal.
                            value);

                        if (changeType == "add") {
                            // If there is no current value, let others know that
                            // the the number of keys have changed

                            Observe.triggerBatch(this, "__keys", undefined);

                        }
                        // `batchTrigger` the change event.
                        this._triggerChange(prop, changeType, value, current);

                        //Observe.triggerBatch(this, prop, [value, current]);
                        // If we can stop listening to our old value, do it.
                        current && unhookup([current], this._cid);
                    }

                },
                // Directly sets a property on this `object`.
                ___set: function(prop, val) {
                    this._data[prop] = val;
                    // Add property directly for easy writing.
                    // Check if its on the `prototype` so we don't overwrite methods like `attrs`.
                    if (!(prop in this.constructor.prototype)) {
                        this[prop] = val
                    }
                },


                bind: can.bindAndSetup,

                unbind: can.unbindAndTeardown,

                serialize: function() {
                    return serialize(this, 'serialize', {});
                },

                _attrs: function(props, remove) {

                    if (props === undefined) {
                        return serialize(this, 'attr', {})
                    }

                    props = can.extend({}, props);
                    var prop,
                        self = this,
                        newVal;
                    Observe.startBatch();
                    this.each(function(curVal, prop) {
                        newVal = props[prop];

                        // If we are merging...
                        if (newVal === undefined) {
                            remove && self.removeAttr(prop);
                            return;
                        }

                        if (self.__convert) {
                            newVal = self.__convert(prop, newVal)
                        }

                        // if we're dealing with models, want to call _set to let converter run
                        if (newVal instanceof can.Observe) {
                            self.__set(prop, newVal, curVal)
                            // if its an object, let attr merge
                        } else if (canMakeObserve(curVal) && canMakeObserve(newVal) && curVal.attr) {
                            curVal.attr(newVal, remove)
                            // otherwise just set
                        } else if (curVal != newVal) {
                            self.__set(prop, newVal, curVal)
                        }

                        delete props[prop];
                    })
                    // Add remaining props.
                    for (var prop in props) {
                        newVal = props[prop];
                        this._set(prop, newVal, true)
                    }
                    Observe.stopBatch()
                    return this;
                },


                compute: function(prop) {
                    return can.compute(this, prop);
                }
            });
        // Helpers for `observable` lists.
        var splice = [].splice,

            list = Observe(

                {
                    setup: function(instances, options) {
                        this.length = 0;
                        can.cid(this, ".observe")
                        this._init = 1;
                        if (can.isDeferred(instances)) {
                            this.replace(instances)
                        } else {
                            this.push.apply(this, can.makeArray(instances || []));
                        }
                        // this change needs to be ignored
                        this.bind('change' + this._cid, can.proxy(this._changes, this));
                        can.extend(this, options);
                        delete this._init;
                    },
                    _triggerChange: function(attr, how, newVal, oldVal) {

                        Observe.prototype._triggerChange.apply(this, arguments)
                        // `batchTrigger` direct add and remove events...
                        if (!~attr.indexOf('.')) {

                            if (how === 'add') {
                                Observe.triggerBatch(this, how, [newVal, +attr]);
                                Observe.triggerBatch(this, 'length', [this.length]);
                            } else if (how === 'remove') {
                                Observe.triggerBatch(this, how, [oldVal, +attr]);
                                Observe.triggerBatch(this, 'length', [this.length]);
                            } else {
                                Observe.triggerBatch(this, how, [newVal, +attr])
                            }

                        }

                    },
                    __get: function(attr) {
                        return attr ? this[attr] : this;
                    },
                    ___set: function(attr, val) {
                        this[attr] = val;
                        if (+attr >= this.length) {
                            this.length = (+attr + 1)
                        }
                    },
                    _each: function(callback) {
                        var data = this.__get();
                        for (var i = 0; i < data.length; i++) {
                            callback(data[i], i)
                        }
                    },
                    _bindsetup: makeBindSetup("*"),
                    // Returns the serialized form of this list.

                    serialize: function() {
                        return serialize(this, 'serialize', []);
                    },

                    splice: function(index, howMany) {
                        var args = can.makeArray(arguments),
                            i;

                        for (i = 2; i < args.length; i++) {
                            var val = args[i];
                            if (canMakeObserve(val)) {
                                args[i] = hookupBubble(val, "*", this, this.constructor.Observe, this.constructor)
                            }
                        }
                        if (howMany === undefined) {
                            howMany = args[1] = this.length - index;
                        }
                        var removed = splice.apply(this, args);
                        can.Observe.startBatch();
                        if (howMany > 0) {
                            this._triggerChange("" + index, "remove", undefined, removed);
                            unhookup(removed, this._cid);
                        }
                        if (args.length > 2) {
                            this._triggerChange("" + index, "add", args.slice(2), removed);
                        }
                        can.Observe.stopBatch();
                        return removed;
                    },

                    _attrs: function(items, remove) {
                        if (items === undefined) {
                            return serialize(this, 'attr', []);
                        }

                        // Create a copy.
                        items = can.makeArray(items);

                        Observe.startBatch();
                        this._updateAttrs(items, remove);
                        Observe.stopBatch()
                    },

                    _updateAttrs: function(items, remove) {
                        var len = Math.min(items.length, this.length);

                        for (var prop = 0; prop < len; prop++) {
                            var curVal = this[prop],
                                newVal = items[prop];

                            if (canMakeObserve(curVal) && canMakeObserve(newVal)) {
                                curVal.attr(newVal, remove)
                            } else if (curVal != newVal) {
                                this._set(prop, newVal)
                            } else {

                            }
                        }
                        if (items.length > this.length) {
                            // Add in the remaining props.
                            this.push.apply(this, items.slice(this.length));
                        } else if (items.length < this.length && remove) {
                            this.splice(items.length)
                        }
                    }
                }),

            // Converts to an `array` of arguments.
            getArgs = function(args) {
                return args[0] && can.isArray(args[0]) ?
                    args[0] :
                    can.makeArray(args);
            };
        // Create `push`, `pop`, `shift`, and `unshift`
        can.each({

                push: "length",

                unshift: 0
            },
            // Adds a method
            // `name` - The method name.
            // `where` - Where items in the `array` should be added.

            function(where, name) {
                var orig = [][name]
                list.prototype[name] = function() {
                    // Get the items being added.
                    var args = [],
                        // Where we are going to add items.
                        len = where ? this.length : 0,
                        i = arguments.length,
                        res,
                        val,
                        constructor = this.constructor;

                    // Go through and convert anything to an `observe` that needs to be converted.
                    while (i--) {
                        val = arguments[i];
                        args[i] = canMakeObserve(val) ?
                            hookupBubble(val, "*", this, this.constructor.Observe, this.constructor) :
                            val;
                    }

                    // Call the original method.
                    res = orig.apply(this, args);

                    if (!this.comparator || args.length) {

                        this._triggerChange("" + len, "add", args, undefined);
                    }

                    return res;
                }
            });

        can.each({

                pop: "length",

                shift: 0
            },
            // Creates a `remove` type method

            function(where, name) {
                list.prototype[name] = function() {

                    var args = getArgs(arguments),
                        len = where && this.length ? this.length - 1 : 0;

                    var res = [][name].apply(this, args)

                    // Create a change where the args are
                    // `len` - Where these items were removed.
                    // `remove` - Items removed.
                    // `undefined` - The new values (there are none).
                    // `res` - The old, removed values (should these be unbound).
                    this._triggerChange("" + len, "remove", undefined, [res])

                    if (res && res.unbind) {
                        res.unbind("change" + this._cid)
                    }
                    return res;
                }
            });

        can.extend(list.prototype, {

                indexOf: function(item) {
                    this.attr('length')
                    return can.inArray(item, this)
                },


                join: [].join,


                reverse: [].reverse,


                slice: function() {
                    var temp = Array.prototype.slice.apply(this, arguments);
                    return new this.constructor(temp);
                },


                concat: function() {
                    var args = [];
                    can.each(can.makeArray(arguments), function(arg, i) {
                        args[i] = arg instanceof can.Observe.List ? arg.serialize() : arg;
                    });
                    return new this.constructor(Array.prototype.concat.apply(this.serialize(), args));
                },


                forEach: function(cb, thisarg) {
                    can.each(this, cb, thisarg || this);
                },


                replace: function(newList) {
                    if (can.isDeferred(newList)) {
                        newList.then(can.proxy(this.replace, this));
                    } else {
                        this.splice.apply(this, [0, this.length].concat(can.makeArray(newList || [])));
                    }

                    return this;
                }
            });

        can.List = Observe.List = list;
        Observe.setup = function() {
            can.Construct.setup.apply(this, arguments);
            // I would prefer not to do it this way. It should
            // be using the attributes plugin to do this type of conversion.
            this.List = Observe.List({
                    Observe: this
                }, {});
        }
        return Observe;
    })(__m3, __m12, __m1);

    // ## observe/compute/compute.js
    var __m13 = (function(can, bind) {

        // returns the
        // - observes and attr methods are called by func
        // - the value returned by func
        // ex: `{value: 100, observed: [{obs: o, attr: "completed"}]}`
        var getValueAndObserved = function(func, self) {

            var oldReading;
            if (can.Observe) {
                // Set a callback on can.Observe to know
                // when an attr is read.
                // Keep a reference to the old reader
                // if there is one.  This is used
                // for nested live binding.
                oldReading = can.Observe.__reading;
                can.Observe.__reading = function(obj, attr) {
                    // Add the observe and attr that was read
                    // to `observed`
                    observed.push({
                            obj: obj,
                            attr: attr + ""
                        });
                };
            }

            var observed = [],
                // Call the "wrapping" function to get the value. `observed`
                // will have the observe/attribute pairs that were read.
                value = func.call(self);

            // Set back so we are no longer reading.
            if (can.Observe) {
                can.Observe.__reading = oldReading;
            }
            return {
                value: value,
                observed: observed
            };
        },
            // Calls `callback(newVal, oldVal)` everytime an observed property
            // called within `getterSetter` is changed and creates a new result of `getterSetter`.
            // Also returns an object that can teardown all event handlers.
            computeBinder = function(getterSetter, context, callback, computeState) {
                // track what we are observing
                var observing = {},
                    // a flag indicating if this observe/attr pair is already bound
                    matched = true,
                    // the data to return 
                    data = {
                        // we will maintain the value while live-binding is taking place
                        value: undefined,
                        // a teardown method that stops listening
                        teardown: function() {
                            for (var name in observing) {
                                var ob = observing[name];
                                ob.observe.obj.unbind(ob.observe.attr, onchanged);
                                delete observing[name];
                            }
                        }
                    },
                    batchNum;

                // when a property value is changed
                var onchanged = function(ev) {
                    // If the compute is no longer bound (because the same change event led to an unbind)
                    // then do not call getValueAndBind, or we will leak bindings.
                    if (computeState && !computeState.bound) {
                        return;
                    }
                    if (ev.batchNum === undefined || ev.batchNum !== batchNum) {
                        // store the old value
                        var oldValue = data.value,
                            // get the new value
                            newvalue = getValueAndBind();

                        // update the value reference (in case someone reads)
                        data.value = newvalue;
                        // if a change happened
                        if (newvalue !== oldValue) {
                            callback(newvalue, oldValue);
                        }
                        batchNum = batchNum = ev.batchNum;
                    }


                };

                // gets the value returned by `getterSetter` and also binds to any attributes
                // read by the call
                var getValueAndBind = function() {
                    var info = getValueAndObserved(getterSetter, context),
                        newObserveSet = info.observed;

                    var value = info.value;
                    matched = !matched;

                    // go through every attribute read by this observe
                    can.each(newObserveSet, function(ob) {
                        // if the observe/attribute pair is being observed
                        if (observing[ob.obj._cid + "|" + ob.attr]) {
                            // mark at as observed
                            observing[ob.obj._cid + "|" + ob.attr].matched = matched;
                        } else {
                            // otherwise, set the observe/attribute on oldObserved, marking it as being observed
                            observing[ob.obj._cid + "|" + ob.attr] = {
                                matched: matched,
                                observe: ob
                            };
                            ob.obj.bind(ob.attr, onchanged);
                        }
                    });

                    // Iterate through oldObserved, looking for observe/attributes
                    // that are no longer being bound and unbind them
                    for (var name in observing) {
                        var ob = observing[name];
                        if (ob.matched !== matched) {
                            ob.observe.obj.unbind(ob.observe.attr, onchanged);
                            delete observing[name];
                        }
                    }
                    return value;
                };
                // set the initial value
                data.value = getValueAndBind();

                data.isListening = !can.isEmptyObject(observing);
                return data;
            }

            // if no one is listening ... we can not calculate every time

        can.compute = function(getterSetter, context, eventName) {
            if (getterSetter && getterSetter.isComputed) {
                return getterSetter;
            }
            // stores the result of computeBinder
            var computedData,
                // how many listeners to this this compute
                bindings = 0,
                // the computed object
                computed,
                // an object that keeps track if the computed is bound
                // onchanged needs to know this. It's possible a change happens and results in
                // something that unbinds the compute, it needs to not to try to recalculate who it
                // is listening to
                computeState = {
                    bound: false,
                    // true if this compute is calculated from other computes and observes
                    hasDependencies: false
                },
                // The following functions are overwritten depending on how compute() is called
                // a method to setup listening
                on = function() {},
                // a method to teardown listening
                off = function() {},
                // the current cached value (only valid if bound = true)
                value,
                // how to read the value
                get = function() {
                    return value
                },
                // sets the value
                set = function(newVal) {
                    value = newVal;
                },
                // this compute can be a dependency of other computes
                canReadForChangeEvent = true;

            computed = function(newVal) {
                // setting ...
                if (arguments.length) {
                    // save a reference to the old value
                    var old = value;

                    // setter may return a value if 
                    // setter is for a value maintained exclusively by this compute
                    var setVal = set.call(context, newVal, old);

                    // if this has dependencies return the current value
                    if (computed.hasDependencies) {
                        return get.call(context);
                    }

                    if (setVal === undefined) {
                        // it's possible, like with the DOM, setting does not
                        // fire a change event, so we must read
                        value = get.call(context);
                    } else {
                        value = setVal;
                    }
                    // fire the change
                    if (old !== value) {
                        can.Observe.triggerBatch(computed, "change", [value, old]);
                    }
                    return value;
                } else {
                    // Let others know to listen to changes in this compute
                    if (can.Observe.__reading && canReadForChangeEvent) {
                        can.Observe.__reading(computed, 'change');
                    }
                    // if we are bound, use the cached value
                    if (computeState.bound) {
                        return value;
                    } else {
                        return get.call(context);
                    }
                }
            }
            if (typeof getterSetter === "function") {
                set = getterSetter;
                get = getterSetter;
                canReadForChangeEvent = eventName === false ? false : true;
                computed.hasDependencies = false;
                on = function(update) {
                    computedData = computeBinder(getterSetter, context || this, update, computeState);
                    computed.hasDependencies = computedData.isListening
                    value = computedData.value;
                }
                off = function() {
                    computedData.teardown();
                }
            } else if (context) {

                if (typeof context == "string") {
                    // `can.compute(obj, "propertyName", [eventName])`

                    var propertyName = context,
                        isObserve = getterSetter instanceof can.Observe;
                    if (isObserve) {
                        computed.hasDependencies = true;
                    }
                    get = function() {
                        if (isObserve) {
                            return getterSetter.attr(propertyName);
                        } else {
                            return getterSetter[propertyName];
                        }
                    }
                    set = function(newValue) {
                        if (isObserve) {
                            getterSetter.attr(propertyName, newValue)
                        } else {
                            getterSetter[propertyName] = newValue;
                        }
                    }
                    var handler;
                    on = function(update) {
                        handler = function() {
                            update(get(), value)
                        };
                        can.bind.call(getterSetter, eventName || propertyName, handler)

                        // use getValueAndObserved because
                        // we should not be indicating that some parent
                        // reads this property if it happens to be binding on it
                        value = getValueAndObserved(get).value
                    }
                    off = function() {
                        can.unbind.call(getterSetter, eventName || propertyName, handler)
                    }

                } else {
                    // `can.compute(initialValue, setter)`
                    if (typeof context === "function") {
                        value = getterSetter;
                        set = context;
                    } else {
                        // `can.compute(initialValue,{get:, set:, on:, off:})`
                        value = getterSetter;
                        var options = context;
                        get = options.get || get;
                        set = options.set || set;
                        on = options.on || on;
                        off = options.off || off;
                    }

                }



            } else {
                // `can.compute(5)`
                value = getterSetter;
            }

            computed.isComputed = true;

            can.cid(computed, "compute")

            var updater = function(newValue, oldValue) {
                value = newValue;
                // might need a way to look up new and oldVal
                can.Observe.triggerBatch(computed, "change", [newValue, oldValue])
            }

            return can.extend(computed, {
                    _bindsetup: function() {
                        computeState.bound = true;
                        // setup live-binding
                        on.call(this, updater)
                    },
                    _bindteardown: function() {
                        off.call(this, updater)
                        computeState.bound = false;
                    },

                    bind: can.bindAndSetup,

                    unbind: can.unbindAndTeardown
                });
        };
        can.compute.binder = computeBinder;
        return can.compute;
    })(__m3, __m12);

    // ## model/model.js
    var __m14 = (function(can) {

        // ## model.js  
        // `can.Model`  
        // _A `can.Observe` that connects to a RESTful interface._
        // Generic deferred piping function

        var pipe = function(def, model, func) {
            var d = new can.Deferred();
            def.then(function() {
                var args = can.makeArray(arguments);
                args[0] = model[func](args[0]);
                d.resolveWith(d, args);
            }, function() {
                d.rejectWith(this, arguments);
            });

            if (typeof def.abort === 'function') {
                d.abort = function() {
                    return def.abort();
                }
            }

            return d;
        },
            modelNum = 0,
            ignoreHookup = /change.observe\d+/,
            getId = function(inst) {
                // Instead of using attr, use __get for performance.
                // Need to set reading
                can.Observe.__reading && can.Observe.__reading(inst, inst.constructor.id)
                return inst.__get(inst.constructor.id);
            },
            // Ajax `options` generator function
            ajax = function(ajaxOb, data, type, dataType, success, error) {

                var params = {};

                // If we get a string, handle it.
                if (typeof ajaxOb == "string") {
                    // If there's a space, it's probably the type.
                    var parts = ajaxOb.split(/\s+/);
                    params.url = parts.pop();
                    if (parts.length) {
                        params.type = parts.pop();
                    }
                } else {
                    can.extend(params, ajaxOb);
                }

                // If we are a non-array object, copy to a new attrs.
                params.data = typeof data == "object" && !can.isArray(data) ?
                    can.extend(params.data || {}, data) : data;

                // Get the url with any templated values filled out.
                params.url = can.sub(params.url, params.data, true);

                return can.ajax(can.extend({
                            type: type || "post",
                            dataType: dataType || "json",
                            success: success,
                            error: error
                        }, params));
            },
            makeRequest = function(self, type, success, error, method) {
                var args;
                // if we pass an array as `self` it it means we are coming from
                // the queued request, and we're passing already serialized data
                // self's signature will be: [self, serializedData]
                if (can.isArray(self)) {
                    args = self[1];
                    self = self[0];
                } else {
                    args = self.serialize();
                }
                args = [args];
                var deferred,
                    // The model.
                    model = self.constructor,
                    jqXHR;

                // `destroy` does not need data.
                if (type == 'destroy') {
                    args.shift();
                }
                // `update` and `destroy` need the `id`.
                if (type !== 'create') {
                    args.unshift(getId(self));
                }


                jqXHR = model[type].apply(model, args);

                deferred = jqXHR.pipe(function(data) {
                    self[method || type + "d"](data, jqXHR);
                    return self;
                });

                // Hook up `abort`
                if (jqXHR.abort) {
                    deferred.abort = function() {
                        jqXHR.abort();
                    };
                }

                deferred.then(success, error);
                return deferred;
            },

            // This object describes how to make an ajax request for each ajax method.  
            // The available properties are:
            //		`url` - The default url to use as indicated as a property on the model.
            //		`type` - The default http request type
            //		`data` - A method that takes the `arguments` and returns `data` used for ajax.

            ajaxMethods = {

                create: {
                    url: "_shortName",
                    type: "post"
                },

                update: {
                    data: function(id, attrs) {
                        attrs = attrs || {};
                        var identity = this.id;
                        if (attrs[identity] && attrs[identity] !== id) {
                            attrs["new" + can.capitalize(id)] = attrs[identity];
                            delete attrs[identity];
                        }
                        attrs[identity] = id;
                        return attrs;
                    },
                    type: "put"
                },

                destroy: {
                    type: "delete",
                    data: function(id) {
                        var args = {};
                        args.id = args[this.id] = id;
                        return args;
                    }
                },

                findAll: {
                    url: "_shortName"
                },

                findOne: {}
            },
            // Makes an ajax request `function` from a string.
            //		`ajaxMethod` - The `ajaxMethod` object defined above.
            //		`str` - The string the user provided. Ex: `findAll: "/recipes.json"`.
            ajaxMaker = function(ajaxMethod, str) {
                // Return a `function` that serves as the ajax method.
                return function(data) {
                    // If the ajax method has it's own way of getting `data`, use that.
                    data = ajaxMethod.data ?
                        ajaxMethod.data.apply(this, arguments) :
                    // Otherwise use the data passed in.
                    data;
                    // Return the ajax method with `data` and the `type` provided.
                    return ajax(str || this[ajaxMethod.url || "_url"], data, ajaxMethod.type || "get")
                }
            }



        can.Model = can.Observe({
                fullName: "can.Model",
                _reqs: 0,
                setup: function(base) {
                    // create store here if someone wants to use model without inheriting from it
                    this.store = {};
                    can.Observe.setup.apply(this, arguments);
                    // Set default list as model list
                    if (!can.Model) {
                        return;
                    }
                    this.List = ML({
                            Observe: this
                        }, {});
                    var self = this,
                        clean = can.proxy(this._clean, self);


                    // go through ajax methods and set them up
                    can.each(ajaxMethods, function(method, name) {
                        // if an ajax method is not a function, it's either
                        // a string url like findAll: "/recipes" or an
                        // ajax options object like {url: "/recipes"}
                        if (!can.isFunction(self[name])) {
                            // use ajaxMaker to convert that into a function
                            // that returns a deferred with the data
                            self[name] = ajaxMaker(method, self[name]);
                        }
                        // check if there's a make function like makeFindAll
                        // these take deferred function and can do special
                        // behavior with it (like look up data in a store)
                        if (self["make" + can.capitalize(name)]) {
                            // pass the deferred method to the make method to get back
                            // the "findAll" method.
                            var newMethod = self["make" + can.capitalize(name)](self[name]);
                            can.Construct._overwrite(self, base, name, function() {
                                // increment the numer of requests
                                can.Model._reqs++;
                                var def = newMethod.apply(this, arguments);
                                var then = def.then(clean, clean);
                                then.abort = def.abort;

                                // attach abort to our then and return it
                                return then;
                            })
                        }
                    });

                    if (self.fullName == "can.Model" || !self.fullName) {
                        self.fullName = "Model" + (++modelNum);
                    }
                    // Add ajax converters.
                    can.Model._reqs = 0;
                    this._url = this._shortName + "/{" + this.id + "}"
                },
                _ajax: ajaxMaker,
                _makeRequest: makeRequest,
                _clean: function() {
                    can.Model._reqs--;
                    if (!can.Model._reqs) {
                        for (var id in this.store) {
                            if (!this.store[id]._bindings) {
                                delete this.store[id];
                            }
                        }
                    }
                    return arguments[0];
                },

                models: function(instancesRawData, oldList) {
                    // until "end of turn", increment reqs counter so instances will be added to the store
                    can.Model._reqs++;
                    if (!instancesRawData) {
                        return;
                    }

                    if (instancesRawData instanceof this.List) {
                        return instancesRawData;
                    }

                    // Get the list type.
                    var self = this,
                        tmp = [],
                        res = oldList instanceof can.Observe.List ? oldList : new(self.List || ML),
                        // Did we get an `array`?
                        arr = can.isArray(instancesRawData),

                        // Did we get a model list?
                        ml = (instancesRawData instanceof ML),

                        // Get the raw `array` of objects.
                        raw = arr ?

                        // If an `array`, return the `array`.
                        instancesRawData :

                        // Otherwise if a model list.
                        (ml ?

                            // Get the raw objects from the list.
                            instancesRawData.serialize() :

                            // Get the object's data.
                            instancesRawData.data),
                        i = 0;



                    if (res.length) {
                        res.splice(0);
                    }

                    can.each(raw, function(rawPart) {
                        tmp.push(self.model(rawPart));
                    });

                    // We only want one change event so push everything at once
                    res.push.apply(res, tmp);

                    if (!arr) { // Push other stuff onto `array`.
                        can.each(instancesRawData, function(val, prop) {
                            if (prop !== 'data') {
                                res.attr(prop, val);
                            }
                        })
                    }
                    // at "end of turn", clean up the store
                    setTimeout(can.proxy(this._clean, this), 1);
                    return res;
                },

                model: function(attributes) {
                    if (!attributes) {
                        return;
                    }
                    if (attributes instanceof this) {
                        attributes = attributes.serialize();
                    }
                    var id = attributes[this.id],
                        model = (id || id === 0) && this.store[id] ?
                            this.store[id].attr(attributes, this.removeAttr || false) : new this(attributes);
                    if (can.Model._reqs) {
                        this.store[attributes[this.id]] = model;
                    }
                    return model;
                }
            },


            {

                isNew: function() {
                    var id = getId(this);
                    return !(id || id === 0); // If `null` or `undefined`
                },

                save: function(success, error) {
                    return makeRequest(this, this.isNew() ? 'create' : 'update', success, error);
                },

                destroy: function(success, error) {
                    if (this.isNew()) {
                        var self = this;
                        var def = can.Deferred();
                        def.then(success, error);
                        return def.done(function(data) {
                            self.destroyed(data)
                        }).resolve(self);
                    }
                    return makeRequest(this, 'destroy', success, error, 'destroyed');
                },

                _bindsetup: function() {
                    this.constructor.store[this.__get(this.constructor.id)] = this;
                    return can.Observe.prototype._bindsetup.apply(this, arguments);
                },

                _bindteardown: function() {
                    delete this.constructor.store[getId(this)];
                    return can.Observe.prototype._bindteardown.apply(this, arguments)
                },
                // Change `id`.
                ___set: function(prop, val) {
                    can.Observe.prototype.___set.call(this, prop, val)
                    // If we add an `id`, move it to the store.
                    if (prop === this.constructor.id && this._bindings) {
                        this.constructor.store[getId(this)] = this;
                    }
                }
            });

        can.each({
                makeFindAll: "models",
                makeFindOne: "model",
                makeCreate: "model",
                makeUpdate: "model"
            }, function(method, name) {
                can.Model[name] = function(oldMethod) {
                    return function() {
                        var args = can.makeArray(arguments),
                            oldArgs = can.isFunction(args[1]) ? args.splice(0, 1) : args.splice(0, 2),
                            def = pipe(oldMethod.apply(this, oldArgs), this, method);
                        def.then(args[0], args[1]);
                        // return the original promise
                        return def;
                    };
                };
            });

        can.each([

                "created",

                "updated",

                "destroyed"
            ], function(funcName) {
                can.Model.prototype[funcName] = function(attrs) {
                    var stub,
                        constructor = this.constructor;

                    // Update attributes if attributes have been passed
                    stub = attrs && typeof attrs == 'object' && this.attr(attrs.attr ? attrs.attr() : attrs);

                    // triggers change event that bubble's like
                    // handler( 'change','1.destroyed' ). This is used
                    // to remove items on destroyed from Model Lists.
                    // but there should be a better way.
                    can.trigger(this, "change", funcName)


                    // Call event on the instance's Class
                    can.trigger(constructor, funcName, this);
                };
            });

        // Model lists are just like `Observe.List` except that when their items are 
        // destroyed, it automatically gets removed from the list.

        var ML = can.Model.List = can.Observe.List({
                setup: function(params) {
                    if (can.isPlainObject(params) && !can.isArray(params)) {
                        can.Observe.List.prototype.setup.apply(this);
                        this.replace(this.constructor.Observe.findAll(params))
                    } else {
                        can.Observe.List.prototype.setup.apply(this, arguments);
                    }
                },
                _changes: function(ev, attr) {
                    can.Observe.List.prototype._changes.apply(this, arguments);
                    if (/\w+\.destroyed/.test(attr)) {
                        var index = this.indexOf(ev.target);
                        if (index != -1) {
                            this.splice(index, 1);
                        }
                    }
                }
            })

        return can.Model;
    })(__m3, __m11);

    // ## view/view.js
    var __m15 = (function(can) {
        // ## view.js
        // `can.view`  
        // _Templating abstraction._

        var isFunction = can.isFunction,
            makeArray = can.makeArray,
            // Used for hookup `id`s.
            hookupId = 1,

            $view = can.view = can.template = function(view, data, helpers, callback) {
                // If helpers is a `function`, it is actually a callback.
                if (isFunction(helpers)) {
                    callback = helpers;
                    helpers = undefined;
                }

                var pipe = function(result) {
                    return $view.frag(result);
                },
                    // In case we got a callback, we need to convert the can.view.render
                    // result to a document fragment
                    wrapCallback = isFunction(callback) ? function(frag) {
                        callback(pipe(frag));
                    } : null,
                    // Get the result.
                    result = $view.render(view, data, helpers, wrapCallback),
                    deferred = can.Deferred();

                if (isFunction(result)) {
                    return result;
                }

                if (can.isDeferred(result)) {
                    result.then(function(result, data) {
                        deferred.resolve.call(deferred, pipe(result), data);
                    }, function() {
                        deferred.fail.apply(deferred, arguments);
                    });
                    return deferred;
                }

                // Convert it into a dom frag.
                return pipe(result);
            };

        can.extend($view, {
                // creates a frag and hooks it up all at once
                frag: function(result, parentNode) {
                    return $view.hookup($view.fragment(result), parentNode);
                },

                // simply creates a frag
                // this is used internally to create a frag
                // insert it
                // then hook it up
                fragment: function(result) {
                    var frag = can.buildFragment(result, document.body);
                    // If we have an empty frag...
                    if (!frag.childNodes.length) {
                        frag.appendChild(document.createTextNode(''));
                    }
                    return frag;
                },

                // Convert a path like string into something that's ok for an `element` ID.
                toId: function(src) {
                    return can.map(src.toString().split(/\/|\./g), function(part) {
                        // Dont include empty strings in toId functions
                        if (part) {
                            return part;
                        }
                    }).join("_");
                },

                hookup: function(fragment, parentNode) {
                    var hookupEls = [],
                        id,
                        func;

                    // Get all `childNodes`.
                    can.each(fragment.childNodes ? can.makeArray(fragment.childNodes) : fragment, function(node) {
                        if (node.nodeType === 1) {
                            hookupEls.push(node);
                            hookupEls.push.apply(hookupEls, can.makeArray(node.getElementsByTagName('*')));
                        }
                    });

                    // Filter by `data-view-id` attribute.
                    can.each(hookupEls, function(el) {
                        if (el.getAttribute && (id = el.getAttribute('data-view-id')) && (func = $view.hookups[id])) {
                            func(el, parentNode, id);
                            delete $view.hookups[id];
                            el.removeAttribute('data-view-id');
                        }
                    });

                    return fragment;
                },


                hookups: {},


                hook: function(cb) {
                    $view.hookups[++hookupId] = cb;
                    return " data-view-id='" + hookupId + "'";
                },


                cached: {},

                cachedRenderers: {},


                cache: true,


                register: function(info) {
                    this.types["." + info.suffix] = info;
                },

                types: {},


                ext: ".ejs",


                registerScript: function() {},


                preload: function() {},


                render: function(view, data, helpers, callback) {
                    // If helpers is a `function`, it is actually a callback.
                    if (isFunction(helpers)) {
                        callback = helpers;
                        helpers = undefined;
                    }

                    // See if we got passed any deferreds.
                    var deferreds = getDeferreds(data);

                    if (deferreds.length) { // Does data contain any deferreds?
                        // The deferred that resolves into the rendered content...
                        var deferred = new can.Deferred(),
                            dataCopy = can.extend({}, data);

                        // Add the view request to the list of deferreds.
                        deferreds.push(get(view, true))

                        // Wait for the view and all deferreds to finish...
                        can.when.apply(can, deferreds).then(function(resolved) {
                            // Get all the resolved deferreds.
                            var objs = makeArray(arguments),
                                // Renderer is the last index of the data.
                                renderer = objs.pop(),
                                // The result of the template rendering with data.
                                result;

                            // Make data look like the resolved deferreds.
                            if (can.isDeferred(data)) {
                                dataCopy = usefulPart(resolved);
                            } else {
                                // Go through each prop in data again and
                                // replace the defferreds with what they resolved to.
                                for (var prop in data) {
                                    if (can.isDeferred(data[prop])) {
                                        dataCopy[prop] = usefulPart(objs.shift());
                                    }
                                }
                            }

                            // Get the rendered result.
                            result = renderer(dataCopy, helpers);

                            // Resolve with the rendered view.
                            deferred.resolve(result, dataCopy);

                            // If there's a `callback`, call it back with the result.
                            callback && callback(result, dataCopy);
                        }, function() {
                            deferred.reject.apply(deferred, arguments)
                        });
                        // Return the deferred...
                        return deferred;
                    } else {
                        // No deferreds! Render this bad boy.
                        var response,
                            // If there's a `callback` function
                            async = isFunction(callback),
                            // Get the `view` type
                            deferred = get(view, async);

                        // If we are `async`...
                        if (async) {
                            // Return the deferred
                            response = deferred;
                            // And fire callback with the rendered result.
                            deferred.then(function(renderer) {
                                callback(data ? renderer(data, helpers) : renderer);
                            })
                        } else {
                            // if the deferred is resolved, call the cached renderer instead
                            // this is because it's possible, with recursive deferreds to
                            // need to render a view while its deferred is _resolving_.  A _resolving_ deferred
                            // is a deferred that was just resolved and is calling back it's success callbacks.
                            // If a new success handler is called while resoliving, it does not get fired by
                            // jQuery's deferred system.  So instead of adding a new callback
                            // we use the cached renderer.
                            // We also add __view_id on the deferred so we can look up it's cached renderer.
                            // In the future, we might simply store either a deferred or the cached result.
                            if (deferred.state() === "resolved" && deferred.__view_id) {
                                var currentRenderer = $view.cachedRenderers[deferred.__view_id];
                                return data ? currentRenderer(data, helpers) : currentRenderer;
                            } else {
                                // Otherwise, the deferred is complete, so
                                // set response to the result of the rendering.
                                deferred.then(function(renderer) {
                                    response = data ? renderer(data, helpers) : renderer;
                                });
                            }
                        }

                        return response;
                    }
                },


                registerView: function(id, text, type, def) {
                    // Get the renderer function.
                    var func = (type || $view.types[$view.ext]).renderer(id, text);
                    def = def || new can.Deferred();

                    // Cache if we are caching.
                    if ($view.cache) {
                        $view.cached[id] = def;
                        def.__view_id = id;
                        $view.cachedRenderers[id] = func;
                    }

                    // Return the objects for the response's `dataTypes`
                    // (in this case view).
                    return def.resolve(func);
                }
            });

        // Makes sure there's a template, if not, have `steal` provide a warning.
        var checkText = function(text, url) {
            if (!text.length) {

                throw "can.view: No template or empty template:" + url;
            }
        },
            // `Returns a `view` renderer deferred.  
            // `url` - The url to the template.  
            // `async` - If the ajax request should be asynchronous.  
            // Returns a deferred.
            get = function(url, async) {
                var suffix = url.match(/\.[\w\d]+$/),
                    type,
                    // If we are reading a script element for the content of the template,
                    // `el` will be set to that script element.
                    el,
                    // A unique identifier for the view (used for caching).
                    // This is typically derived from the element id or
                    // the url for the template.
                    id,
                    // The ajax request used to retrieve the template content.
                    jqXHR;

                //If the url has a #, we assume we want to use an inline template
                //from a script element and not current page's HTML
                if (url.match(/^#/)) {
                    url = url.substr(1);
                }
                // If we have an inline template, derive the suffix from the `text/???` part.
                // This only supports `<script>` tags.
                if (el = document.getElementById(url)) {
                    suffix = "." + el.type.match(/\/(x\-)?(.+)/)[2];
                }

                // If there is no suffix, add one.
                if (!suffix && !$view.cached[url]) {
                    url += (suffix = $view.ext);
                }

                if (can.isArray(suffix)) {
                    suffix = suffix[0]
                }

                // Convert to a unique and valid id.
                id = $view.toId(url);

                // If an absolute path, use `steal` to get it.
                // You should only be using `//` if you are using `steal`.
                if (url.match(/^\/\//)) {
                    var sub = url.substr(2);
                    url = !window.steal ?
                        sub :
                        steal.config().root.mapJoin("" + steal.id(sub));
                }

                // Set the template engine type.
                type = $view.types[suffix];

                // If it is cached, 
                if ($view.cached[id]) {
                    // Return the cached deferred renderer.
                    return $view.cached[id];

                    // Otherwise if we are getting this from a `<script>` element.
                } else if (el) {
                    // Resolve immediately with the element's `innerHTML`.
                    return $view.registerView(id, el.innerHTML, type);
                } else {
                    // Make an ajax request for text.
                    var d = new can.Deferred();
                    can.ajax({
                            async: async,
                            url: url,
                            dataType: "text",
                            error: function(jqXHR) {
                                checkText("", url);
                                d.reject(jqXHR);
                            },
                            success: function(text) {
                                // Make sure we got some text back.
                                checkText(text, url);
                                $view.registerView(id, text, type, d)
                            }
                        });
                    return d;
                }
            },
            // Gets an `array` of deferreds from an `object`.
            // This only goes one level deep.
            getDeferreds = function(data) {
                var deferreds = [];

                // pull out deferreds
                if (can.isDeferred(data)) {
                    return [data]
                } else {
                    for (var prop in data) {
                        if (can.isDeferred(data[prop])) {
                            deferreds.push(data[prop]);
                        }
                    }
                }
                return deferreds;
            },
            // Gets the useful part of a resolved deferred.
            // This is for `model`s and `can.ajax` that resolve to an `array`.
            usefulPart = function(resolved) {
                return can.isArray(resolved) && resolved[1] === 'success' ? resolved[0] : resolved
            };

        //!steal-pluginify-remove-start
        if (window.steal) {
            steal.type("view js", function(options, success, error) {
                var type = $view.types["." + options.type],
                    id = $view.toId(options.id);

                options.text = "steal('" + (type.plugin || "can/view/" + options.type) + "',function(can){return " + "can.view.preload('" + id + "'," + options.text + ");\n})";
                success();
            })
        }
        //!steal-pluginify-remove-end

        can.extend($view, {
                register: function(info) {
                    this.types["." + info.suffix] = info;

                    //!steal-pluginify-remove-start
                    if (window.steal) {
                        steal.type(info.suffix + " view js", function(options, success, error) {
                            var type = $view.types["." + options.type],
                                id = $view.toId(options.id + '');

                            options.text = type.script(id, options.text)
                            success();
                        })
                    };
                    //!steal-pluginify-remove-end

                    $view[info.suffix] = function(id, text) {
                        if (!text) {
                            // Return a nameless renderer
                            var renderer = function() {
                                return $view.frag(renderer.render.apply(this, arguments));
                            }
                            renderer.render = function() {
                                var renderer = info.renderer(null, id);
                                return renderer.apply(renderer, arguments);
                            }
                            return renderer;
                        }

                        $view.preload(id, info.renderer(id, text));
                        return can.view(id);
                    }
                },
                registerScript: function(type, id, src) {
                    return "can.view.preload('" + id + "'," + $view.types["." + type].script(id, src) + ");";
                },
                preload: function(id, renderer) {
                    $view.cached[id] = new can.Deferred().resolve(function(data, helpers) {
                        return renderer.call(data, data, helpers);
                    });

                    function frag() {
                        return $view.frag(renderer.apply(this, arguments));
                    }
                    // expose the renderer for mustache
                    frag.render = renderer;
                    return frag;
                }

            });

        return can;
    })(__m3);

    // ## view/elements.js
    var __m18 = (function() {

        var elements = {
            tagToContentPropMap: {
                option: "textContent" in document.createElement("option") ? "textContent" : "innerText",
                textarea: "value"
            },

            attrMap: {
                "class": "className",
                "value": "value",
                "innerText": "innerText",
                "textContent": "textContent",
                "checked": true,
                "disabled": true,
                "readonly": true,
                "required": true
            },
            // elements whos default value we should set
            defaultValue: ["input", "textarea"],
            // a map of parent element to child elements
            tagMap: {
                "": "span",
                table: "tbody",
                tr: "td",
                ol: "li",
                ul: "li",
                tbody: "tr",
                thead: "tr",
                tfoot: "tr",
                select: "option",
                optgroup: "option"
            },
            // a tag's parent element
            reverseTagMap: {
                tr: "tbody",
                option: "select",
                td: "tr",
                th: "tr",
                li: "ul"
            },

            getParentNode: function(el, defaultParentNode) {
                return defaultParentNode && el.parentNode.nodeType === 11 ? defaultParentNode : el.parentNode;
            },
            // set an attribute on an element
            setAttr: function(el, attrName, val) {
                var tagName = el.nodeName.toString().toLowerCase(),
                    prop = elements.attrMap[attrName];
                // if this is a special property
                if (prop === true) {
                    el[attrName] = true;
                } else if (prop) {
                    // set the value as true / false
                    el[prop] = val;
                    if (prop === "value" && can.inArray(tagName, elements.defaultValue) >= 0) {
                        el.defaultValue = val;
                    }
                } else {
                    el.setAttribute(attrName, val);
                }
            },
            // gets the value of an attribute
            getAttr: function(el, attrName) {
                // Default to a blank string for IE7/8
                return (elements.attrMap[attrName] && el[elements.attrMap[attrName]] ?
                    el[elements.attrMap[attrName]] :
                    el.getAttribute(attrName)) || '';
            },
            // removes the attribute
            removeAttr: function(el, attrName) {
                if (elements.attrMap[attrName] === true) {
                    el[attrName] = false;
                } else {
                    el.removeAttribute(attrName);
                }
            },
            contentText: function(text) {
                if (typeof text == 'string') {
                    return text;
                }
                // If has no value, return an empty string.
                if (!text && text !== 0) {
                    return '';
                }
                return "" + text;
            }
        };

        return elements;
    })();

    // ## view/scanner.js
    var __m17 = (function(can, elements) {

        var newLine = /(\r|\n)+/g,
            // Escapes characters starting with `\`.
            clean = function(content) {
                return content
                    .split('\\').join("\\\\")
                    .split("\n").join("\\n")
                    .split('"').join('\\"')
                    .split("\t").join("\\t");
            },
            // Returns a tagName to use as a temporary placeholder for live content
            // looks forward ... could be slow, but we only do it when necessary
            getTag = function(tagName, tokens, i) {
                // if a tagName is provided, use that
                if (tagName) {
                    return tagName;
                } else {
                    // otherwise go searching for the next two tokens like "<",TAG
                    while (i < tokens.length) {
                        if (tokens[i] == "<" && elements.reverseTagMap[tokens[i + 1]]) {
                            return elements.reverseTagMap[tokens[i + 1]];
                        }
                        i++;
                    }
                }
                return '';
            },
            bracketNum = function(content) {
                return (--content.split("{").length) - (--content.split("}").length);
            },
            myEval = function(script) {
                eval(script);
            },
            attrReg = /([^\s]+)[\s]*=[\s]*$/,
            // Commands for caching.
            startTxt = 'var ___v1ew = [];',
            finishTxt = "return ___v1ew.join('')",
            put_cmd = "___v1ew.push(",
            insert_cmd = put_cmd,
            // Global controls (used by other functions to know where we are).
            // Are we inside a tag?
            htmlTag = null,
            // Are we within a quote within a tag?
            quote = null,
            // What was the text before the current quote? (used to get the `attr` name)
            beforeQuote = null,
            // Whether a rescan is in progress
            rescan = null,
            // Used to mark where the element is.
            status = function() {
                // `t` - `1`.
                // `h` - `0`.
                // `q` - String `beforeQuote`.
                return quote ? "'" + beforeQuote.match(attrReg)[1] + "'" : (htmlTag ? 1 : 0);
            };

        can.view.Scanner = Scanner = function(options) {
            // Set options on self
            can.extend(this, {
                    text: {},
                    tokens: []
                }, options);

            // Cache a token lookup
            this.tokenReg = [];
            this.tokenSimple = {
                "<": "<",
                ">": ">",
                '"': '"',
                "'": "'"
            };
            this.tokenComplex = [];
            this.tokenMap = {};
            for (var i = 0, token; token = this.tokens[i]; i++) {


                // Save complex mappings (custom regexp)
                if (token[2]) {
                    this.tokenReg.push(token[2]);
                    this.tokenComplex.push({
                            abbr: token[1],
                            re: new RegExp(token[2]),
                            rescan: token[3]
                        });
                }
                // Save simple mappings (string only, no regexp)
                else {
                    this.tokenReg.push(token[1]);
                    this.tokenSimple[token[1]] = token[0];
                }
                this.tokenMap[token[0]] = token[1];
            }

            // Cache the token registry.
            this.tokenReg = new RegExp("(" + this.tokenReg.slice(0).concat(["<", ">", '"', "'"]).join("|") + ")", "g");
        };

        Scanner.prototype = {

            helpers: [

                {
                    name: /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                    fn: function(content) {
                        var quickFunc = /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                            parts = content.match(quickFunc);

                        return "can.proxy(function(__){var " + parts[1] + "=can.$(__);" + parts[2] + "}, this);";
                    }
                }
            ],

            scan: function(source, name) {
                var tokens = [],
                    last = 0,
                    simple = this.tokenSimple,
                    complex = this.tokenComplex;

                source = source.replace(newLine, "\n");
                if (this.transform) {
                    source = this.transform(source);
                }
                source.replace(this.tokenReg, function(whole, part) {
                    // offset is the second to last argument
                    var offset = arguments[arguments.length - 2];

                    // if the next token starts after the last token ends
                    // push what's in between
                    if (offset > last) {
                        tokens.push(source.substring(last, offset));
                    }

                    // push the simple token (if there is one)
                    if (simple[whole]) {
                        tokens.push(whole);
                    }
                    // otherwise lookup complex tokens
                    else {
                        for (var i = 0, token; token = complex[i]; i++) {
                            if (token.re.test(whole)) {
                                tokens.push(token.abbr);
                                // Push a rescan function if one exists
                                if (token.rescan) {
                                    tokens.push(token.rescan(part));
                                }
                                break;
                            }
                        }
                    }

                    // update the position of the last part of the last token
                    last = offset + part.length;
                });

                // if there's something at the end, add it
                if (last < source.length) {
                    tokens.push(source.substr(last));
                }

                var content = '',
                    buff = [startTxt + (this.text.start || '')],
                    // Helper `function` for putting stuff in the view concat.
                    put = function(content, bonus) {
                        buff.push(put_cmd, '"', clean(content), '"' + (bonus || '') + ');');
                    },
                    // A stack used to keep track of how we should end a bracket
                    // `}`.  
                    // Once we have a `<%= %>` with a `leftBracket`,
                    // we store how the file should end here (either `))` or `;`).
                    endStack = [],
                    // The last token, used to remember which tag we are in.
                    lastToken,
                    // The corresponding magic tag.
                    startTag = null,
                    // Was there a magic tag inside an html tag?
                    magicInTag = false,
                    // The current tag name.
                    tagName = '',
                    // stack of tagNames
                    tagNames = [],
                    // Pop from tagNames?
                    popTagName = false,
                    // Declared here.
                    bracketCount,
                    i = 0,
                    token,
                    tmap = this.tokenMap;

                // Reinitialize the tag state goodness.
                htmlTag = quote = beforeQuote = null;

                for (;
                    (token = tokens[i++]) !== undefined;) {
                    if (startTag === null) {
                        switch (token) {
                            case tmap.left:
                            case tmap.escapeLeft:
                            case tmap.returnLeft:
                                magicInTag = htmlTag && 1;
                            case tmap.commentLeft:
                                // A new line -- just add whatever content within a clean.  
                                // Reset everything.
                                startTag = token;
                                if (content.length) {
                                    put(content);
                                }
                                content = '';
                                break;
                            case tmap.escapeFull:
                                // This is a full line escape (a line that contains only whitespace and escaped logic)
                                // Break it up into escape left and right
                                magicInTag = htmlTag && 1;
                                rescan = 1;
                                startTag = tmap.escapeLeft;
                                if (content.length) {
                                    put(content);
                                }
                                rescan = tokens[i++];
                                content = rescan.content || rescan;
                                if (rescan.before) {
                                    put(rescan.before);
                                }
                                tokens.splice(i, 0, tmap.right);
                                break;
                            case tmap.commentFull:
                                // Ignore full line comments.
                                break;
                            case tmap.templateLeft:
                                content += tmap.left;
                                break;
                            case '<':
                                // Make sure we are not in a comment.
                                if (tokens[i].indexOf("!--") !== 0) {
                                    htmlTag = 1;
                                    magicInTag = 0;
                                }
                                content += token;
                                break;
                            case '>':
                                htmlTag = 0;
                                // content.substr(-1) doesn't work in IE7/8
                                var emptyElement = content.substr(content.length - 1) == "/" || content.substr(content.length - 2) == "--";
                                // if there was a magic tag
                                // or it's an element that has text content between its tags, 
                                // but content is not other tags add a hookup
                                // TODO: we should only add `can.EJS.pending()` if there's a magic tag 
                                // within the html tags.
                                if (magicInTag || !popTagName && elements.tagToContentPropMap[tagNames[tagNames.length - 1]]) {
                                    // make sure / of /> is on the left of pending
                                    if (emptyElement) {
                                        put(content.substr(0, content.length - 1), ",can.view.pending(),\"/>\"");
                                    } else {
                                        put(content, ",can.view.pending(),\">\"");
                                    }
                                    content = '';
                                    magicInTag = 0;
                                } else {
                                    content += token;
                                }
                                // if it's a tag like <input/>
                                if (emptyElement || popTagName) {
                                    // remove the current tag in the stack
                                    tagNames.pop();
                                    // set the current tag to the previous parent
                                    tagName = tagNames[tagNames.length - 1];
                                    // Don't pop next time
                                    popTagName = false;
                                }
                                break;
                            case "'":
                            case '"':
                                // If we are in an html tag, finding matching quotes.
                                if (htmlTag) {
                                    // We have a quote and it matches.
                                    if (quote && quote === token) {
                                        // We are exiting the quote.
                                        quote = null;
                                        // Otherwise we are creating a quote.
                                        // TODO: does this handle `\`?
                                    } else if (quote === null) {
                                        quote = token;
                                        beforeQuote = lastToken;
                                    }
                                }
                            default:
                                // Track the current tag
                                if (lastToken === '<') {
                                    tagName = token.split(/\s/)[0];
                                    if (tagName.indexOf("/") === 0 && tagNames[tagNames.length - 1] === tagName.substr(1)) {
                                        // set tagName to the last tagName
                                        // if there are no more tagNames, we'll rely on getTag.
                                        tagName = tagNames[tagNames.length - 1];
                                        popTagName = true;
                                    } else {
                                        tagNames.push(tagName);
                                    }
                                }
                                content += token;
                                break;
                        }
                    } else {
                        // We have a start tag.
                        switch (token) {
                            case tmap.right:
                            case tmap.returnRight:
                                switch (startTag) {
                                    case tmap.left:
                                        // Get the number of `{ minus }`
                                        bracketCount = bracketNum(content);

                                        // We are ending a block.
                                        if (bracketCount == 1) {

                                            // We are starting on.
                                            buff.push(insert_cmd, "can.view.txt(0,'" + getTag(tagName, tokens, i) + "'," + status() + ",this,function(){", startTxt, content);

                                            endStack.push({
                                                    before: "",
                                                    after: finishTxt + "}));\n"
                                                });
                                        } else {

                                            // How are we ending this statement?
                                            last = // If the stack has value and we are ending a block...
                                            endStack.length && bracketCount == -1 ? // Use the last item in the block stack.
                                            endStack.pop() : // Or use the default ending.
                                            {
                                                after: ";"
                                            };

                                            // If we are ending a returning block, 
                                            // add the finish text which returns the result of the
                                            // block.
                                            if (last.before) {
                                                buff.push(last.before);
                                            }
                                            // Add the remaining content.
                                            buff.push(content, ";", last.after);
                                        }
                                        break;
                                    case tmap.escapeLeft:
                                    case tmap.returnLeft:
                                        // We have an extra `{` -> `block`.
                                        // Get the number of `{ minus }`.
                                        bracketCount = bracketNum(content);
                                        // If we have more `{`, it means there is a block.
                                        if (bracketCount) {
                                            // When we return to the same # of `{` vs `}` end with a `doubleParent`.
                                            endStack.push({
                                                    before: finishTxt,
                                                    after: "}));"
                                                });
                                        }

                                        var escaped = startTag === tmap.escapeLeft ? 1 : 0,
                                            commands = {
                                                insert: insert_cmd,
                                                tagName: getTag(tagName, tokens, i),
                                                status: status()
                                            };

                                        for (var ii = 0; ii < this.helpers.length; ii++) {
                                            // Match the helper based on helper
                                            // regex name value
                                            var helper = this.helpers[ii];
                                            if (helper.name.test(content)) {
                                                content = helper.fn(content, commands);

                                                // dont escape partials
                                                if (helper.name.source == /^>[\s]*\w*/.source) {
                                                    escaped = 0;
                                                }
                                                break;
                                            }
                                        }

                                        // Handle special cases
                                        if (typeof content == 'object') {
                                            if (content.raw) {
                                                buff.push(content.raw);
                                            }
                                        } else {
                                            // If we have `<%== a(function(){ %>` then we want
                                            // `can.EJS.text(0,this, function(){ return a(function(){ var _v1ew = [];`.
                                            buff.push(insert_cmd, "can.view.txt(" + escaped + ",'" + tagName + "'," + status() + ",this,function(){ " + (this.text.escape || '') + "return ", content,
                                                // If we have a block.
                                                bracketCount ?
                                                // Start with startTxt `"var _v1ew = [];"`.
                                                startTxt :
                                                // If not, add `doubleParent` to close push and text.
                                                "}));");
                                        }

                                        if (rescan && rescan.after && rescan.after.length) {
                                            put(rescan.after.length);
                                            rescan = null;
                                        }
                                        break;
                                }
                                startTag = null;
                                content = '';
                                break;
                            case tmap.templateLeft:
                                content += tmap.left;
                                break;
                            default:
                                content += token;
                                break;
                        }
                    }
                    lastToken = token;
                }

                // Put it together...
                if (content.length) {
                    // Should be `content.dump` in Ruby.
                    put(content);
                }
                buff.push(";");

                var template = buff.join(''),
                    out = {
                        out: 'with(_VIEW) { with (_CONTEXT) {' + template + " " + finishTxt + "}}"
                    };
                // Use `eval` instead of creating a function, because it is easier to debug.
                myEval.call(out, 'this.fn = (function(_CONTEXT,_VIEW){' + out.out + '});\r\n//@ sourceURL=' + name + ".js");

                return out;
            }
        };

        return Scanner;
    })(__m15, __m18);

    // ## view/node_lists.js
    var __m21 = (function(can) {

        // text node expando test
        var canExpando = true;
        try {
            document.createTextNode('')._ = 0;
        } catch (ex) {
            canExpando = false;
        }

        // a mapping of element ids to nodeList ids
        var nodeMap = {},
            // a mapping of ids to text nodes
            textNodeMap = {},
            // a mapping of nodeList ids to nodeList
            nodeListMap = {},
            expando = "ejs_" + Math.random(),
            _id = 0,
            id = function(node) {
                if (canExpando || node.nodeType !== 3) {
                    if (node[expando]) {
                        return node[expando];
                    } else {
                        return node[expando] = (node.nodeName ? "element_" : "obj_") + (++_id);
                    }
                } else {
                    for (var textNodeID in textNodeMap) {
                        if (textNodeMap[textNodeID] === node) {
                            return textNodeID;
                        }
                    }

                    textNodeMap["text_" + (++_id)] = node;
                    return "text_" + _id;
                }
            },
            // removes a nodeListId from a node's nodeListIds
            removeNodeListId = function(node, nodeListId) {
                var nodeListIds = nodeMap[id(node)];
                if (nodeListIds) {
                    var index = can.inArray(nodeListId, nodeListIds);

                    if (index >= 0) {
                        nodeListIds.splice(index, 1);
                    }
                    if (!nodeListIds.length) {
                        delete nodeMap[id(node)];
                    }
                }
            },
            addNodeListId = function(node, nodeListId) {
                var nodeListIds = nodeMap[id(node)];
                if (!nodeListIds) {
                    nodeListIds = nodeMap[id(node)] = [];
                }
                nodeListIds.push(nodeListId);
            };

        var nodeLists = {
            id: id,
            // replaces the contents of one node list with the nodes in another list
            replace: function(oldNodeList, newNodes) {
                // for each node in the node list
                oldNodeList = can.makeArray(oldNodeList);

                // try every set
                //can.each( oldNodeList, function(node){
                var node = oldNodeList[0]
                // for each nodeList the node is in
                can.each(can.makeArray(nodeMap[id(node)]), function(nodeListId) {

                    // if startNode to endNode is 
                    // within list, replace that list
                    // I think the problem is not the WHOLE part is being 
                    // matched
                    var nodeList = nodeListMap[nodeListId],
                        startIndex = can.inArray(node, nodeList),
                        endIndex = can.inArray(oldNodeList[oldNodeList.length - 1], nodeList);


                    // remove this nodeListId from each node
                    if (startIndex >= 0 && endIndex >= 0) {
                        for (var i = startIndex; i <= endIndex; i++) {
                            var n = nodeList[i];
                            removeNodeListId(n, nodeListId);
                        }
                        // swap in new nodes into the nodeLIst
                        nodeList.splice.apply(nodeList, [startIndex, endIndex - startIndex + 1].concat(newNodes));

                        // tell these new nodes they belong to the nodeList
                        can.each(newNodes, function(node) {
                            addNodeListId(node, nodeListId);
                        });
                    } else {
                        nodeLists.unregister(nodeList);
                    }
                });
                //});
            },
            // registers a list of nodes
            register: function(nodeList) {
                var nLId = id(nodeList);
                nodeListMap[nLId] = nodeList;

                can.each(nodeList, function(node) {
                    addNodeListId(node, nLId);
                });

            },
            // removes mappings
            unregister: function(nodeList) {
                var nLId = id(nodeList);
                can.each(nodeList, function(node) {
                    removeNodeListId(node, nLId);
                });
                delete nodeListMap[nLId];
            },
            nodeMap: nodeMap,
            nodeListMap: nodeListMap
        }
        var ids = function(nodeList) {
            return nodeList.map(function(n) {
                return id(n) + ":" + (n.innerHTML || n.nodeValue)
            })
        }
        return nodeLists;

    })(__m3);

    // ## view/live.js
    var __m20 = (function(can, elements, view, nodeLists) {
        // ## live.js
        // The live module provides live binding for computes
        // and can.Observe.List.
        // Currently, it's API is designed for `can/view/render`, but
        // it could easily be used for other purposes.

        // ### Helper methods
        // #### setup
        // `setup(HTMLElement, bind(data), unbind(data)) -> data`
        // Calls bind right away, but will call unbind
        // if the element is "destroyed" (removed from the DOM).
        var setup = function(el, bind, unbind) {
            var teardown = function() {
                unbind(data)
                can.unbind.call(el, 'destroyed', teardown);
            },
                data = {
                    teardownCheck: function(parent) {
                        if (!parent) {
                            teardown();
                        }
                    }
                }

            can.bind.call(el, 'destroyed', teardown);
            bind(data)
            return data;
        },
            // #### listen
            // Calls setup, but presets bind and unbind to 
            // operate on a compute
            listen = function(el, compute, change) {
                return setup(el, function() {
                    compute.bind("change", change);
                }, function(data) {
                    compute.unbind("change", change);
                    if (data.nodeList) {
                        nodeLists.unregister(data.nodeList);
                    }
                });
            },
            // #### getAttributeParts
            // Breaks up a string like foo='bar' into ["foo","'bar'""]
            getAttributeParts = function(newVal) {
                return (newVal || "").replace(/['"]/g, '').split('=')
            }
            // #### insertElementsAfter
            // Appends elements after the last item in oldElements.
        insertElementsAfter = function(oldElements, newFrag) {
            var last = oldElements[oldElements.length - 1];

            // Insert it in the `document` or `documentFragment`
            if (last.nextSibling) {
                last.parentNode.insertBefore(newFrag, last.nextSibling);
            } else {
                last.parentNode.appendChild(newFrag);
            }
        };

        var live = {
            nodeLists: nodeLists,
            list: function(el, list, func, context, parentNode) {
                // A mapping of the index to an array
                // of elements that represent the item.
                // Each array is registered so child or parent
                // live structures can update the elements
                var nodesMap = [],

                    add = function(ev, items, index) {

                        // Collect new html and mappings
                        var frag = document.createDocumentFragment(),
                            newMappings = [];
                        can.each(items, function(item) {
                            var itemHTML = func.call(context, item),
                                itemFrag = can.view.frag(itemHTML, parentNode);

                            newMappings.push(can.makeArray(itemFrag.childNodes));
                            frag.appendChild(itemFrag);
                        })

                        // Inserting at the end of the list
                        if (!nodesMap[index]) {
                            insertElementsAfter(
                                index == 0 ? [text] :
                                nodesMap[index - 1], frag)
                        } else {
                            var el = nodesMap[index][0];
                            el.parentNode.insertBefore(frag, el)
                        }
                        // register each item
                        can.each(newMappings, function(nodeList) {
                            nodeLists.register(nodeList)
                        });
                        [].splice.apply(nodesMap, [index, 0].concat(newMappings));
                    },
                    remove = function(ev, items, index) {
                        var removedMappings = nodesMap.splice(index, items.length),
                            itemsToRemove = [];

                        can.each(removedMappings, function(nodeList) {
                            // add items that we will remove all at once
                            [].push.apply(itemsToRemove, nodeList)
                            // Update any parent lists to remove these items
                            nodeLists.replace(nodeList, []);
                            // unregister the list
                            nodeLists.unregister(nodeList);

                        });
                        can.remove(can.$(itemsToRemove));
                    },
                    parentNode = elements.getParentNode(el, parentNode),
                    text = document.createTextNode("");

                // Setup binding and teardown to add and remove events
                setup(parentNode, function() {
                    list.bind("add", add).bind("remove", remove)
                }, function() {
                    list.unbind("add", add).unbind("remove", remove);
                    can.each(nodesMap, function(nodeList) {
                        nodeLists.unregister(nodeList);
                    })
                })

                insertElementsAfter([el], text);
                can.remove(can.$(el));
                add({}, list, 0);

            },
            html: function(el, compute, parentNode) {
                var parentNode = elements.getParentNode(el, parentNode),

                    data = listen(parentNode, compute, function(ev, newVal, oldVal) {
                        var attached = nodes[0].parentNode;
                        // update the nodes in the DOM with the new rendered value
                        if (attached) {
                            makeAndPut(newVal);
                        }
                        data.teardownCheck(nodes[0].parentNode);
                    });

                var nodes,
                    makeAndPut = function(val) {
                        // create the fragment, but don't hook it up
                        // we need to insert it into the document first
                        var frag = can.view.frag(val, parentNode),
                            // keep a reference to each node
                            newNodes = can.makeArray(frag.childNodes);
                        // Insert it in the `document` or `documentFragment`
                        insertElementsAfter(nodes || [el], frag)
                        // nodes hasn't been set yet
                        if (!nodes) {
                            can.remove(can.$(el));
                            nodes = newNodes;
                            // set the teardown nodeList
                            data.nodeList = nodes;
                            nodeLists.register(nodes);
                        } else {
                            // Update node Array's to point to new nodes
                            // and then remove the old nodes.
                            // It has to be in this order for Mootools
                            // and IE because somehow, after an element
                            // is removed from the DOM, it loses its
                            // expando values.
                            var nodesToRemove = can.makeArray(nodes);
                            nodeLists.replace(nodes, newNodes);
                            can.remove(can.$(nodesToRemove));
                        }
                    };
                makeAndPut(compute(), [el]);

            },
            text: function(el, compute, parentNode) {
                var parent = elements.getParentNode(el, parentNode);

                // setup listening right away so we don't have to re-calculate value
                var data = listen(el.parentNode !== parent ? el.parentNode : parent, compute, function(ev, newVal, oldVal) {
                    // Sometimes this is 'unknown' in IE and will throw an exception if it is
                    if (typeof node.nodeValue != 'unknown') {
                        node.nodeValue = "" + newVal;
                    }
                    data.teardownCheck(node.parentNode);
                });

                var node = document.createTextNode(compute());

                if (el.parentNode !== parent) {
                    parent = el.parentNode;
                    parent.insertBefore(node, el);
                    parent.removeChild(el);
                } else {
                    parent.insertBefore(node, el);
                    parent.removeChild(el);
                }
            },
            attributes: function(el, compute, currentValue) {
                var setAttrs = function(newVal) {
                    var parts = getAttributeParts(newVal),
                        newAttrName = parts.shift();

                    // Remove if we have a change and used to have an `attrName`.
                    if ((newAttrName != attrName) && attrName) {
                        elements.removeAttr(el, attrName);
                    }
                    // Set if we have a new `attrName`.
                    if (newAttrName) {
                        elements.setAttr(el, newAttrName, parts.join('='));
                        attrName = newAttrName;
                    }
                }

                listen(el, compute, function(ev, newVal) {
                    setAttrs(newVal)
                })
                // current value has been set
                if (arguments.length >= 3) {
                    var attrName = getAttributeParts(currentValue)[0]
                } else {
                    setAttrs(compute())
                }
            },
            attributePlaceholder: '__!!__',
            attributeReplace: /__!!__/g,
            attribute: function(el, attributeName, compute) {
                listen(el, compute, function(ev, newVal) {
                    elements.setAttr(el, attributeName, hook.render());
                })

                var wrapped = can.$(el),
                    hooks;

                // Get the list of hookups or create one for this element.
                // Hooks is a map of attribute names to hookup `data`s.
                // Each hookup data has:
                // `render` - A `function` to render the value of the attribute.
                // `funcs` - A list of hookup `function`s on that attribute.
                // `batchNum` - The last event `batchNum`, used for performance.
                hooks = can.data(wrapped, 'hooks');
                if (!hooks) {
                    can.data(wrapped, 'hooks', hooks = {});
                }

                // Get the attribute value.
                var attr = elements.getAttr(el, attributeName),
                    // Split the attribute value by the template.
                    // Only split out the first __!!__ so if we have multiple hookups in the same attribute, 
                    // they will be put in the right spot on first render
                    parts = attr.split(live.attributePlaceholder),
                    goodParts = [],
                    hook;
                goodParts.push(parts.shift(),
                    parts.join(live.attributePlaceholder));

                // If we already had a hookup for this attribute...
                if (hooks[attributeName]) {
                    // Just add to that attribute's list of `function`s.
                    hooks[attributeName].computes.push(compute);
                } else {
                    // Create the hookup data.
                    hooks[attributeName] = {
                        render: function() {
                            var i = 0,
                                // attr doesn't have a value in IE
                                newAttr = attr ? attr.replace(live.attributeReplace, function() {
                                    return elements.contentText(hook.computes[i++]());
                                }) : elements.contentText(hook.computes[i++]());
                            return newAttr;
                        },
                        computes: [compute],
                        batchNum: undefined
                    };
                }

                // Save the hook for slightly faster performance.
                hook = hooks[attributeName];

                // Insert the value in parts.
                goodParts.splice(1, 0, compute());

                // Set the attribute.
                elements.setAttr(el, attributeName, goodParts.join(""));

            }
        }
        return live;

    })(__m3, __m18, __m15, __m21);

    // ## view/render.js
    var __m19 = (function(can, elements, live) {

        var pendingHookups = [],
            tagChildren = function(tagName) {
                var newTag = elements.tagMap[tagName] || "span";
                if (newTag === "span") {
                    //innerHTML in IE doesn't honor leading whitespace after empty elements
                    return "@@!!@@";
                }
                return "<" + newTag + ">" + tagChildren(newTag) + "</" + newTag + ">";
            },
            contentText = function(input, tag) {

                // If it's a string, return.
                if (typeof input == 'string') {
                    return input;
                }
                // If has no value, return an empty string.
                if (!input && input !== 0) {
                    return '';
                }

                // If it's an object, and it has a hookup method.
                var hook = (input.hookup &&

                    // Make a function call the hookup method.

                    function(el, id) {
                        input.hookup.call(input, el, id);
                    }) ||

                // Or if it's a `function`, just use the input.
                (typeof input == 'function' && input);

                // Finally, if there is a `function` to hookup on some dom,
                // add it to pending hookups.
                if (hook) {
                    if (tag) {
                        return "<" + tag + " " + can.view.hook(hook) + "></" + tag + ">"
                    } else {
                        pendingHookups.push(hook);
                    }

                    return '';
                }

                // Finally, if all else is `false`, `toString()` it.
                return "" + input;
            },
            // Returns escaped/sanatized content for anything other than a live-binding
            contentEscape = function(txt) {
                return (typeof txt == 'string' || typeof txt == 'number') ?
                    can.esc(txt) :
                    contentText(txt);
            };

        var current;

        can.extend(can.view, {
                live: live,
                setupLists: function() {

                    var old = can.view.lists,
                        data;

                    can.view.lists = function(list, renderer) {
                        data = {
                            list: list,
                            renderer: renderer
                        }
                    }
                    return function() {
                        can.view.lists = old;
                        return data;
                    }
                },
                pending: function() {
                    // TODO, make this only run for the right tagName
                    var hooks = pendingHookups.slice(0);
                    lastHookups = hooks;
                    pendingHookups = [];
                    return can.view.hook(function(el) {
                        can.each(hooks, function(fn) {
                            fn(el);
                        });
                    });
                },


                txt: function(escape, tagName, status, self, func) {
                    var listTeardown = can.view.setupLists(),
                        emptyHandler = function() {},
                        unbind = function() {
                            compute.unbind("change", emptyHandler)
                        };

                    var compute = can.compute(func, self, false);
                    // bind to get and temporarily cache the value
                    compute.bind("change", emptyHandler);
                    // call the "wrapping" function and get the binding information
                    var tag = (elements.tagMap[tagName] || "span"),
                        listData = listTeardown(),
                        value = compute();


                    if (listData) {
                        return "<" + tag + can.view.hook(function(el, parentNode) {
                            live.list(el, listData.list, listData.renderer, self, parentNode);
                        }) + "></" + tag + ">";
                    }

                    // If we had no observes just return the value returned by func.
                    if (!compute.hasDependencies) {
                        unbind();
                        return (escape || status !== 0 ? contentEscape : contentText)(value, status === 0 && tag);
                    }

                    // the property (instead of innerHTML elements) to adjust. For
                    // example options should use textContent
                    var contentProp = elements.tagToContentPropMap[tagName];


                    // The magic tag is outside or between tags.
                    if (status === 0 && !contentProp) {
                        // Return an element tag with a hookup in place of the content
                        return "<" + tag + can.view.hook(
                            escape ?
                            // If we are escaping, replace the parentNode with 
                            // a text node who's value is `func`'s return value.

                            function(el, parentNode) {
                                live.text(el, compute, parentNode);
                                unbind();
                            } :
                            // If we are not escaping, replace the parentNode with a
                            // documentFragment created as with `func`'s return value.

                            function(el, parentNode) {
                                live.html(el, compute, parentNode);
                                unbind();
                                //children have to be properly nested HTML for buildFragment to work properly
                            }) + ">" + tagChildren(tag) + "</" + tag + ">";
                        // In a tag, but not in an attribute
                    } else if (status === 1) {
                        // remember the old attr name
                        pendingHookups.push(function(el) {
                            live.attributes(el, compute, compute());
                            unbind();
                        });
                        return compute();
                    } else { // In an attribute...
                        var attributeName = status === 0 ? contentProp : status;
                        // if the magic tag is inside the element, like `<option><% TAG %></option>`,
                        // we add this hookup to the last element (ex: `option`'s) hookups.
                        // Otherwise, the magic tag is in an attribute, just add to the current element's
                        // hookups.
                        (status === 0 ? lastHookups : pendingHookups).push(function(el) {
                            live.attribute(el, attributeName, compute);
                            unbind();
                        });
                        return live.attributePlaceholder;
                    }
                }
            });

        return can;
    })(__m15, __m18, __m20, __m2);

    // ## view/ejs/ejs.js
    var __m16 = (function(can) {
        // ## ejs.js
        // `can.EJS`  
        // _Embedded JavaScript Templates._

        // Helper methods.
        var extend = can.extend,
            EJS = function(options) {
                // Supports calling EJS without the constructor
                // This returns a function that renders the template.
                if (this.constructor != EJS) {
                    var ejs = new EJS(options);
                    return function(data, helpers) {
                        return ejs.render(data, helpers);
                    };
                }
                // If we get a `function` directly, it probably is coming from
                // a `steal`-packaged view.
                if (typeof options == "function") {
                    this.template = {
                        fn: options
                    };
                    return;
                }
                // Set options on self.
                extend(this, options);
                this.template = this.scanner.scan(this.text, this.name);
            };

        can.EJS = EJS;


        EJS.prototype.

        render = function(object, extraHelpers) {
            object = object || {};
            return this.template.fn.call(object, object, new EJS.Helpers(object, extraHelpers || {}));
        };

        extend(EJS.prototype, {

                scanner: new can.view.Scanner({

                        tokens: [
                            ["templateLeft", "<%%"], // Template
                            ["templateRight", "%>"], // Right Template
                            ["returnLeft", "<%=="], // Return Unescaped
                            ["escapeLeft", "<%="], // Return Escaped
                            ["commentLeft", "<%#"], // Comment
                            ["left", "<%"], // Run --- this is hack for now
                            ["right", "%>"], // Right -> All have same FOR Mustache ...
                            ["returnRight", "%>"]
                        ],


                        transform: function(source) {
                            return source.replace(/<%([\s\S]+?)%>/gm, function(whole, part) {
                                var brackets = [],
                                    foundBracketPair,
                                    i;

                                // Look for brackets (for removing self-contained blocks)
                                part.replace(/[{}]/gm, function(bracket, offset) {
                                    brackets.push([bracket, offset]);
                                });

                                // Remove bracket pairs from the list of replacements
                                do {
                                    foundBracketPair = false;
                                    for (i = brackets.length - 2; i >= 0; i--) {
                                        if (brackets[i][0] == '{' && brackets[i + 1][0] == '}') {
                                            brackets.splice(i, 2);
                                            foundBracketPair = true;
                                            break;
                                        }
                                    }
                                } while (foundBracketPair);

                                // Unmatched brackets found, inject EJS tags
                                if (brackets.length >= 2) {
                                    var result = ['<%'],
                                        bracket,
                                        last = 0;
                                    for (i = 0; bracket = brackets[i]; i++) {
                                        result.push(part.substring(last, last = bracket[1]));
                                        if ((bracket[0] == '{' && i < brackets.length - 1) || (bracket[0] == '}' && i > 0)) {
                                            result.push(bracket[0] == '{' ? '{ %><% ' : ' %><% }');
                                        } else {
                                            result.push(bracket[0]);
                                        }
                                        ++last;
                                    }
                                    result.push(part.substring(last), '%>');
                                    return result.join('');
                                }
                                // Otherwise return the original
                                else {
                                    return '<%' + part + '%>';
                                }
                            });
                        }
                    })
            });

        EJS.Helpers = function(data, extras) {
            this._data = data;
            this._extras = extras;
            extend(this, extras);
        };


        EJS.Helpers.prototype = {
            // TODO Deprecated!!
            list: function(list, cb) {

                can.each(list, function(item, i) {
                    cb(item, i, list)
                })
            },
            each: function(list, cb) {
                // Normal arrays don't get live updated
                if (can.isArray(list)) {
                    this.list(list, cb);
                } else {
                    can.view.lists(list, cb);
                }
            }
        };

        // Options for `steal`'s build.
        can.view.register({
                suffix: "ejs",
                // returns a `function` that renders the view.
                script: function(id, src) {
                    return "can.EJS(function(_CONTEXT,_VIEW) { " + new EJS({
                            text: src,
                            name: id
                        }).template.out + " })";
                },
                renderer: function(id, text) {
                    return EJS({
                            text: text,
                            name: id
                        });
                }
            });

        return can;
    })(__m3, __m15, __m2, __m13, __m17, __m19);

    // ## control/control.js
    var __m22 = (function(can) {
        // ## control.js
        // `can.Control`  
        // _Controller_

        // Binds an element, returns a function that unbinds.
        var bind = function(el, ev, callback) {

            can.bind.call(el, ev, callback);

            return function() {
                can.unbind.call(el, ev, callback);
            };
        },
            isFunction = can.isFunction,
            extend = can.extend,
            each = can.each,
            slice = [].slice,
            paramReplacer = /\{([^\}]+)\}/g,
            special = can.getObject("$.event.special", [can]) || {},

            // Binds an element, returns a function that unbinds.
            delegate = function(el, selector, ev, callback) {
                can.delegate.call(el, selector, ev, callback);
                return function() {
                    can.undelegate.call(el, selector, ev, callback);
                };
            },

            // Calls bind or unbind depending if there is a selector.
            binder = function(el, ev, callback, selector) {
                return selector ?
                    delegate(el, can.trim(selector), ev, callback) :
                    bind(el, ev, callback);
            },

            basicProcessor;

        var Control = can.Control = can.Construct(

            {
                // Setup pre-processes which methods are event listeners.

                setup: function() {

                    // Allow contollers to inherit "defaults" from super-classes as it 
                    // done in `can.Construct`
                    can.Construct.setup.apply(this, arguments);

                    // If you didn't provide a name, or are `control`, don't do anything.
                    if (can.Control) {

                        // Cache the underscored names.
                        var control = this,
                            funcName;

                        // Calculate and cache actions.
                        control.actions = {};
                        for (funcName in control.prototype) {
                            if (control._isAction(funcName)) {
                                control.actions[funcName] = control._action(funcName);
                            }
                        }
                    }
                },

                // Moves `this` to the first argument, wraps it with `jQuery` if it's an element
                _shifter: function(context, name) {

                    var method = typeof name == "string" ? context[name] : name;

                    if (!isFunction(method)) {
                        method = context[method];
                    }

                    return function() {
                        context.called = name;
                        return method.apply(context, [this.nodeName ? can.$(this) : this].concat(slice.call(arguments, 0)));
                    };
                },

                // Return `true` if is an action.

                _isAction: function(methodName) {

                    var val = this.prototype[methodName],
                        type = typeof val;
                    // if not the constructor
                    return (methodName !== 'constructor') &&
                    // and is a function or links to a function
                    (type == "function" || (type == "string" && isFunction(this.prototype[val]))) &&
                    // and is in special, a processor, or has a funny character
                    !! (special[methodName] || processors[methodName] || /[^\w]/.test(methodName));
                },
                // Takes a method name and the options passed to a control
                // and tries to return the data necessary to pass to a processor
                // (something that binds things).

                _action: function(methodName, options) {

                    // If we don't have options (a `control` instance), we'll run this 
                    // later.  
                    paramReplacer.lastIndex = 0;
                    if (options || !paramReplacer.test(methodName)) {
                        // If we have options, run sub to replace templates `{}` with a
                        // value from the options or the window
                        var convertedName = options ? can.sub(methodName, [options, window]) : methodName;
                        if (!convertedName) {
                            return null;
                        }
                        // If a `{}` template resolves to an object, `convertedName` will be
                        // an array
                        var arr = can.isArray(convertedName),

                            // Get the name
                            name = arr ? convertedName[1] : convertedName,

                            // Grab the event off the end
                            parts = name.split(/\s+/g),
                            event = parts.pop();

                        return {
                            processor: processors[event] || basicProcessor,
                            parts: [name, parts.join(" "), event],
                            delegate: arr ? convertedName[0] : undefined
                        };
                    }
                },
                // An object of `{eventName : function}` pairs that Control uses to 
                // hook up events auto-magically.

                processors: {},
                // A object of name-value pairs that act as default values for a 
                // control instance
                defaults: {}

            }, {

                // Sets `this.element`, saves the control in `data, binds event
                // handlers.

                setup: function(element, options) {

                    var cls = this.constructor,
                        pluginname = cls.pluginName || cls._fullName,
                        arr;

                    // Want the raw element here.
                    this.element = can.$(element)

                    if (pluginname && pluginname !== 'can_control') {
                        // Set element and `className` on element.
                        this.element.addClass(pluginname);
                    }

                    (arr = can.data(this.element, "controls")) || can.data(this.element, "controls", arr = []);
                    arr.push(this);

                    // Option merging.

                    this.options = extend({}, cls.defaults, options);

                    // Bind all event handlers.
                    this.on();

                    // Gets passed into `init`.

                    return [this.element, this.options];
                },

                on: function(el, selector, eventName, func) {
                    if (!el) {

                        // Adds bindings.
                        this.off();

                        // Go through the cached list of actions and use the processor 
                        // to bind
                        var cls = this.constructor,
                            bindings = this._bindings,
                            actions = cls.actions,
                            element = this.element,
                            destroyCB = can.Control._shifter(this, "destroy"),
                            funcName, ready;

                        for (funcName in actions) {
                            // Only push if we have the action and no option is `undefined`
                            if (actions.hasOwnProperty(funcName) &&
                                (ready = actions[funcName] || cls._action(funcName, this.options))) {
                                bindings.push(ready.processor(ready.delegate || element,
                                        ready.parts[2], ready.parts[1], funcName, this));
                            }
                        }


                        // Setup to be destroyed...  
                        // don't bind because we don't want to remove it.
                        can.bind.call(element, "destroyed", destroyCB);
                        bindings.push(function(el) {
                            can.unbind.call(el, "destroyed", destroyCB);
                        });
                        return bindings.length;
                    }

                    if (typeof el == 'string') {
                        func = eventName;
                        eventName = selector;
                        selector = el;
                        el = this.element;
                    }

                    if (func === undefined) {
                        func = eventName;
                        eventName = selector;
                        selector = null;
                    }

                    if (typeof func == 'string') {
                        func = can.Control._shifter(this, func);
                    }

                    this._bindings.push(binder(el, eventName, func, selector));

                    return this._bindings.length;
                },
                // Unbinds all event handlers on the controller.

                off: function() {
                    var el = this.element[0]
                    each(this._bindings || [], function(value) {
                        value(el);
                    });
                    // Adds bindings.
                    this._bindings = [];
                },
                // Prepares a `control` for garbage collection

                destroy: function() {
                    //Control already destroyed
                    if (this.element === null) {

                        return;
                    }
                    var Class = this.constructor,
                        pluginName = Class.pluginName || Class._fullName,
                        controls;

                    // Unbind bindings.
                    this.off();

                    if (pluginName && pluginName !== 'can_control') {
                        // Remove the `className`.
                        this.element.removeClass(pluginName);
                    }

                    // Remove from `data`.
                    controls = can.data(this.element, "controls");
                    controls.splice(can.inArray(this, controls), 1);

                    can.trigger(this, "destroyed"); // In case we want to know if the `control` is removed.

                    this.element = null;
                }
            });

        var processors = can.Control.processors,
            // Processors do the binding.
            // They return a function that unbinds when called.  
            // The basic processor that binds events.
            basicProcessor = function(el, event, selector, methodName, control) {
                return binder(el, event, can.Control._shifter(control, methodName), selector);
            };

        // Set common events to be processed as a `basicProcessor`
        each(["change", "click", "contextmenu", "dblclick", "keydown", "keyup",
                "keypress", "mousedown", "mousemove", "mouseout", "mouseover",
                "mouseup", "reset", "resize", "scroll", "select", "submit", "focusin",
                "focusout", "mouseenter", "mouseleave",
                // #104 - Add touch events as default processors
                // TOOD feature detect?
                "touchstart", "touchmove", "touchcancel", "touchend", "touchleave"
            ], function(v) {
                processors[v] = basicProcessor;
            });

        return Control;
    })(__m3, __m1);

    // ## util/string/deparam/deparam.js
    var __m24 = (function(can) {

        // ## deparam.js  
        // `can.deparam`  
        // _Takes a string of name value pairs and returns a Object literal that represents those params._
        var digitTest = /^\d+$/,
            keyBreaker = /([^\[\]]+)|(\[\])/g,
            paramTest = /([^?#]*)(#.*)?$/,
            prep = function(str) {
                return decodeURIComponent(str.replace(/\+/g, " "));
            };


        can.extend(can, {

                deparam: function(params) {

                    var data = {},
                        pairs, lastPart;

                    if (params && paramTest.test(params)) {

                        pairs = params.split('&'),

                        can.each(pairs, function(pair) {

                            var parts = pair.split('='),
                                key = prep(parts.shift()),
                                value = prep(parts.join("=")),
                                current = data;

                            if (key) {
                                parts = key.match(keyBreaker);

                                for (var j = 0, l = parts.length - 1; j < l; j++) {
                                    if (!current[parts[j]]) {
                                        // If what we are pointing to looks like an `array`
                                        current[parts[j]] = digitTest.test(parts[j + 1]) || parts[j + 1] == "[]" ? [] : {};
                                    }
                                    current = current[parts[j]];
                                }
                                lastPart = parts.pop();
                                if (lastPart == "[]") {
                                    current.push(value);
                                } else {
                                    current[lastPart] = value;
                                }
                            }
                        });
                    }
                    return data;
                }
            });
        return can;
    })(__m3, __m2);

    // ## route/route.js
    var __m23 = (function(can) {

        // ## route.js  
        // `can.route`  
        // _Helps manage browser history (and client state) by synchronizing the 
        // `window.location.hash` with a `can.Observe`._  
        // Helper methods used for matching routes.
        var
        // `RegExp` used to match route variables of the type ':name'.
        // Any word character or a period is matched.
        matcher = /\:([\w\.]+)/g,
            // Regular expression for identifying &amp;key=value lists.
            paramsMatcher = /^(?:&[^=]+=[^&]*)+/,
            // Converts a JS Object into a list of parameters that can be 
            // inserted into an html element tag.
            makeProps = function(props) {
                var tags = [];
                can.each(props, function(val, name) {
                    tags.push((name === 'className' ? 'class' : name) + '="' +
                        (name === "href" ? val : can.esc(val)) + '"');
                });
                return tags.join(" ");
            },
            // Checks if a route matches the data provided. If any route variable
            // is not present in the data, the route does not match. If all route
            // variables are present in the data, the number of matches is returned 
            // to allow discerning between general and more specific routes. 
            matchesData = function(route, data) {
                var count = 0,
                    i = 0,
                    defaults = {};
                // look at default values, if they match ...
                for (var name in route.defaults) {
                    if (route.defaults[name] === data[name]) {
                        // mark as matched
                        defaults[name] = 1;
                        count++;
                    }
                }
                for (; i < route.names.length; i++) {
                    if (!data.hasOwnProperty(route.names[i])) {
                        return -1;
                    }
                    if (!defaults[route.names[i]]) {
                        count++;
                    }

                }

                return count;
            },
            onready = !0,
            location = window.location,
            wrapQuote = function(str) {
                return (str + '').replace(/([.?*+\^$\[\]\\(){}|\-])/g, "\\$1");
            },
            each = can.each,
            extend = can.extend;

        can.route = function(url, defaults) {
            defaults = defaults || {};
            // Extract the variable names and replace with `RegExp` that will match
            // an atual URL with values.
            var names = [],
                test = url.replace(matcher, function(whole, name, i) {
                    names.push(name);
                    var next = "\\" + (url.substr(i + whole.length, 1) || can.route._querySeparator);
                    // a name without a default value HAS to have a value
                    // a name that has a default value can be empty
                    // The `\\` is for string-escaping giving single `\` for `RegExp` escaping.
                    return "([^" + next + "]" + (defaults[name] ? "*" : "+") + ")";
                });

            // Add route in a form that can be easily figured out.
            can.route.routes[url] = {
                // A regular expression that will match the route when variable values 
                // are present; i.e. for `:page/:type` the `RegExp` is `/([\w\.]*)/([\w\.]*)/` which
                // will match for any value of `:page` and `:type` (word chars or period).
                test: new RegExp("^" + test + "($|" + wrapQuote(can.route._querySeparator) + ")"),
                // The original URL, same as the index for this entry in routes.
                route: url,
                // An `array` of all the variable names in this route.
                names: names,
                // Default values provided for the variables.
                defaults: defaults,
                // The number of parts in the URL separated by `/`.
                length: url.split('/').length
            };
            return can.route;
        };


        extend(can.route, {

                _querySeparator: '&',
                _paramsMatcher: paramsMatcher,


                param: function(data, _setRoute) {
                    // Check if the provided data keys match the names in any routes;
                    // Get the one with the most matches.
                    var route,
                        // Need to have at least 1 match.
                        matches = 0,
                        matchCount,
                        routeName = data.route,
                        propCount = 0;

                    delete data.route;

                    each(data, function() {
                        propCount++;
                    });
                    // Otherwise find route.
                    each(can.route.routes, function(temp, name) {
                        // best route is the first with all defaults matching


                        matchCount = matchesData(temp, data);
                        if (matchCount > matches) {
                            route = temp;
                            matches = matchCount;
                        }
                        if (matchCount >= propCount) {
                            return false;
                        }
                    });
                    // If we have a route name in our `can.route` data, and it's
                    // just as good as what currently matches, use that
                    if (can.route.routes[routeName] && matchesData(can.route.routes[routeName], data) === matches) {
                        route = can.route.routes[routeName];
                    }
                    // If this is match...
                    if (route) {
                        var cpy = extend({}, data),
                            // Create the url by replacing the var names with the provided data.
                            // If the default value is found an empty string is inserted.
                            res = route.route.replace(matcher, function(whole, name) {
                                delete cpy[name];
                                return data[name] === route.defaults[name] ? "" : encodeURIComponent(data[name]);
                            }),
                            after;
                        // Remove matching default values
                        each(route.defaults, function(val, name) {
                            if (cpy[name] === val) {
                                delete cpy[name];
                            }
                        });

                        // The remaining elements of data are added as 
                        // `&amp;` separated parameters to the url.
                        after = can.param(cpy);
                        // if we are paraming for setting the hash
                        // we also want to make sure the route value is updated
                        if (_setRoute) {
                            can.route.attr('route', route.route);
                        }
                        return res + (after ? can.route._querySeparator + after : "");
                    }
                    // If no route was found, there is no hash URL, only paramters.
                    return can.isEmptyObject(data) ? "" : can.route._querySeparator + can.param(data);
                },

                deparam: function(url) {
                    // See if the url matches any routes by testing it against the `route.test` `RegExp`.
                    // By comparing the URL length the most specialized route that matches is used.
                    var route = {
                        length: -1
                    };
                    each(can.route.routes, function(temp, name) {
                        if (temp.test.test(url) && temp.length > route.length) {
                            route = temp;
                        }
                    });
                    // If a route was matched.
                    if (route.length > -1) {

                        var // Since `RegExp` backreferences are used in `route.test` (parens)
                        // the parts will contain the full matched string and each variable (back-referenced) value.
                        parts = url.match(route.test),
                            // Start will contain the full matched string; parts contain the variable values.
                            start = parts.shift(),
                            // The remainder will be the `&amp;key=value` list at the end of the URL.
                            remainder = url.substr(start.length - (parts[parts.length - 1] === can.route._querySeparator ? 1 : 0)),
                            // If there is a remainder and it contains a `&amp;key=value` list deparam it.
                            obj = (remainder && can.route._paramsMatcher.test(remainder)) ? can.deparam(remainder.slice(1)) : {};

                        // Add the default values for this route.
                        obj = extend(true, {}, route.defaults, obj);
                        // Overwrite each of the default values in `obj` with those in 
                        // parts if that part is not empty.
                        each(parts, function(part, i) {
                            if (part && part !== can.route._querySeparator) {
                                obj[route.names[i]] = decodeURIComponent(part);
                            }
                        });
                        obj.route = route.route;
                        return obj;
                    }
                    // If no route was matched, it is parsed as a `&amp;key=value` list.
                    if (url.charAt(0) !== can.route._querySeparator) {
                        url = can.route._querySeparator + url;
                    }
                    return can.route._paramsMatcher.test(url) ? can.deparam(url.slice(1)) : {};
                },

                data: new can.Observe({}),

                routes: {},

                ready: function(val) {
                    if (val === false) {
                        onready = val;
                    }
                    if (val === true || onready === true) {
                        can.route._setup();
                        setState();
                    }
                    return can.route;
                },

                url: function(options, merge) {
                    if (merge) {
                        options = extend({}, curParams, options)
                    }
                    return "#!" + can.route.param(options);
                },

                link: function(name, options, props, merge) {
                    return "<a " + makeProps(
                        extend({
                                href: can.route.url(options, merge)
                            }, props)) + ">" + name + "</a>";
                },

                current: function(options) {
                    return location.hash == "#!" + can.route.param(options)
                },
                _setup: function() {
                    // If the hash changes, update the `can.route.data`.
                    can.bind.call(window, 'hashchange', setState);
                },
                _getHash: function() {
                    return location.href.split(/#!?/)[1] || "";
                },
                _setHash: function(serialized) {
                    var path = (can.route.param(serialized, true));
                    location.hash = "#!" + path;
                    return path;
                }
            });


        // The functions in the following list applied to `can.route` (e.g. `can.route.attr('...')`) will
        // instead act on the `can.route.data` observe.
        each(['bind', 'unbind', 'delegate', 'undelegate', 'attr', 'removeAttr'], function(name) {
            can.route[name] = function() {
                // `delegate` and `undelegate` require
                // the `can/observe/delegate` plugin
                if (!can.route.data[name]) {
                    return;
                }

                return can.route.data[name].apply(can.route.data, arguments);
            }
        })

        var // A ~~throttled~~ debounced function called multiple times will only fire once the
        // timer runs down. Each call resets the timer.
        timer,
            // Intermediate storage for `can.route.data`.
            curParams,
            // Deparameterizes the portion of the hash of interest and assign the
            // values to the `can.route.data` removing existing values no longer in the hash.
            // setState is called typically by hashchange which fires asynchronously
            // So it's possible that someone started changing the data before the 
            // hashchange event fired.  For this reason, it will not set the route data
            // if the data is changing or the hash already matches the hash that was set.
            setState = can.route.setState = function() {
                var hash = can.route._getHash();
                curParams = can.route.deparam(hash);

                // if the hash data is currently changing, or
                // the hash is what we set it to anyway, do NOT change the hash
                if (!changingData || hash !== lastHash) {
                    can.route.attr(curParams, true);
                }
            },
            // The last hash caused by a data change
            lastHash,
            // Are data changes pending that haven't yet updated the hash
            changingData;

        // If the `can.route.data` changes, update the hash.
        // Using `.serialize()` retrieves the raw data contained in the `observable`.
        // This function is ~~throttled~~ debounced so it only updates once even if multiple values changed.
        // This might be able to use batchNum and avoid this.
        can.route.bind("change", function(ev, attr) {
            // indicate that data is changing
            changingData = 1;
            clearTimeout(timer);
            timer = setTimeout(function() {
                // indicate that the hash is set to look like the data
                changingData = 0;
                var serialized = can.route.data.serialize();

                lastHash = can.route._setHash(serialized);
            }, 1);
        });
        // `onready` event...
        can.bind.call(document, "ready", can.route.ready);

        // Libraries other than jQuery don't execute the document `ready` listener
        // if we are already DOM ready
        if ((document.readyState === 'complete' || document.readyState === "interactive") && onready) {
            can.route.ready();
        }

        // extend route to have a similar property 
        // that is often checked in mustache to determine
        // an object's observability
        can.route.constructor.canMakeObserve = can.Observe.canMakeObserve;

        return can.route;
    })(__m3, __m11, __m24);

    // ## control/route/route.js
    var __m25 = (function(can) {

        // ## control/route.js  
        // _Controller route integration._

        can.Control.processors.route = function(el, event, selector, funcName, controller) {
            selector = selector || "";
            can.route(selector);
            var batchNum,
                check = function(ev, attr, how) {
                    if (can.route.attr('route') === (selector) &&
                        (ev.batchNum === undefined || ev.batchNum !== batchNum)) {

                        batchNum = ev.batchNum;

                        var d = can.route.attr();
                        delete d.route;
                        if (can.isFunction(controller[funcName])) {
                            controller[funcName](d);
                        } else {
                            controller[controller[funcName]](d);
                        }

                    }
                };
            can.route.bind('change', check);
            return function() {
                can.route.unbind('change', check);
            };
        };

        return can;
    })(__m3, __m23, __m22);

    window['can'] = __m4;
})();