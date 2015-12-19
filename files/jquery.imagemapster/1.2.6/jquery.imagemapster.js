/* ImageMapster
   Version: see $.mapster.version

Copyright 2011-2012 James Treworgy
http://www.outsharked.com/imagemapster
https://github.com/jamietre/ImageMapster

A jQuery plugin to enhance image maps.

Versions 1.2.4.067+ include "when.js": http://github.com/cujos/when in the
distribution build.

*/

/*

/// LICENSE (MIT License)
///
/// Permission is hereby granted, free of charge, to any person obtaining
/// a copy of this software and associated documentation files (the
/// "Software"), to deal in the Software without restriction, including
/// without limitation the rights to use, copy, modify, merge, publish,
/// distribute, sublicense, and/or sell copies of the Software, and to
/// permit persons to whom the Software is furnished to do so, subject to
/// the following conditions:
///
/// The above copyright notice and this permission notice shall be
/// included in all copies or substantial portions of the Software.
///
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
/// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
/// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
/// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
/// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
/// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
/// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
///
/// January 19, 2011

*/
/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
* when
* A lightweight CommonJS Promises/A and when() implementation
*
* when is part of the cujo.js family of libraries (http://cujojs.com/)
*
* Licensed under the MIT License at:
* http://www.opensource.org/licenses/mit-license.php
*
* @version 1.2.0
*/

/*lint-ignore-start*/

(function (define) {
    define(function () {
        var freeze, reduceArray, slice, undef;

        //
        // Public API
        //

        when.defer = defer;
        when.reject = reject;
        when.isPromise = isPromise;

        when.all = all;
        when.some = some;
        when.any = any;

        when.map = map;
        when.reduce = reduce;

        when.chain = chain;

        /** Object.freeze */
        freeze = Object.freeze || function (o) { return o; };

        /**
        * Trusted Promise constructor.  A Promise created from this constructor is
        * a trusted when.js promise.  Any other duck-typed promise is considered
        * untrusted.
        *
        * @constructor
        */
        function Promise() { }

        Promise.prototype = freeze({
            always: function (alwaysback, progback) {
                return this.then(alwaysback, alwaysback, progback);
            },

            otherwise: function (errback) {
                return this.then(undef, errback);
            }
        });

        /**
        * Create an already-resolved promise for the supplied value
        * @private
        *
        * @param value anything
        * @return {Promise}
        */
        function resolved(value) {

            var p = new Promise();

            p.then = function (callback) {
                var nextValue;
                try {
                    if (callback) nextValue = callback(value);
                    return promise(nextValue === undef ? value : nextValue);
                } catch (e) {
                    return rejected(e);
                }
            };

            return freeze(p);
        }

        /**
        * Create an already-rejected {@link Promise} with the supplied
        * rejection reason.
        * @private
        *
        * @param reason rejection reason
        * @return {Promise}
        */
        function rejected(reason) {

            var p = new Promise();

            p.then = function (callback, errback) {
                var nextValue;
                try {
                    if (errback) {
                        nextValue = errback(reason);
                        return promise(nextValue === undef ? reason : nextValue)
                    }

                    return rejected(reason);

                } catch (e) {
                    return rejected(e);
                }
            };

            return freeze(p);
        }

        /**
        * Returns a rejected promise for the supplied promiseOrValue. If
        * promiseOrValue is a value, it will be the rejection value of the
        * returned promise.  If promiseOrValue is a promise, its
        * completion value will be the rejected value of the returned promise
        *
        * @param promiseOrValue {*} the rejected value of the returned {@link Promise}
        *
        * @return {Promise} rejected {@link Promise}
        */
        function reject(promiseOrValue) {
            return when(promiseOrValue, function (value) {
                return rejected(value);
            });
        }

        /**
        * Creates a new, CommonJS compliant, Deferred with fully isolated
        * resolver and promise parts, either or both of which may be given out
        * safely to consumers.
        * The Deferred itself has the full API: resolve, reject, progress, and
        * then. The resolver has resolve, reject, and progress.  The promise
        * only has then.
        *
        * @memberOf when
        * @function
        *
        * @returns {Deferred}
        */
        function defer() {
            var deferred, promise, listeners, progressHandlers, _then, _progress, complete;

            listeners = [];
            progressHandlers = [];

            /**
            * Pre-resolution then() that adds the supplied callback, errback, and progback
            * functions to the registered listeners
            *
            * @private
            *
            * @param [callback] {Function} resolution handler
            * @param [errback] {Function} rejection handler
            * @param [progback] {Function} progress handler
            *
            * @throws {Error} if any argument is not null, undefined, or a Function
            */
            _then = function unresolvedThen(callback, errback, progback) {
                var deferred = defer();

                listeners.push(function (promise) {
                    promise.then(callback, errback)
					.then(deferred.resolve, deferred.reject, deferred.progress);
                });

                progback && progressHandlers.push(progback);

                return deferred.promise;
            };

            /**
            * Registers a handler for this {@link Deferred}'s {@link Promise}.  Even though all arguments
            * are optional, each argument that *is* supplied must be null, undefined, or a Function.
            * Any other value will cause an Error to be thrown.
            *
            * @memberOf Promise
            *
            * @param [callback] {Function} resolution handler
            * @param [errback] {Function} rejection handler
            * @param [progback] {Function} progress handler
            *
            * @throws {Error} if any argument is not null, undefined, or a Function
            */
            function then(callback, errback, progback) {
                return _then(callback, errback, progback);
            }

            /**
            * Resolves this {@link Deferred}'s {@link Promise} with val as the
            * resolution value.
            *
            * @memberOf Resolver
            *
            * @param val anything
            */
            function resolve(val) {
                complete(resolved(val));
            }

            /**
            * Rejects this {@link Deferred}'s {@link Promise} with err as the
            * reason.
            *
            * @memberOf Resolver
            *
            * @param err anything
            */
            function reject(err) {
                complete(rejected(err));
            }

            /**
            * @private
            * @param update
            */
            _progress = function (update) {
                var progress, i = 0;
                while (progress = progressHandlers[i++]) progress(update);
            };

            /**
            * Emits a progress update to all progress observers registered with
            * this {@link Deferred}'s {@link Promise}
            *
            * @memberOf Resolver
            *
            * @param update anything
            */
            function progress(update) {
                _progress(update);
            }

            /**
            * Transition from pre-resolution state to post-resolution state, notifying
            * all listeners of the resolution or rejection
            *
            * @private
            *
            * @param completed {Promise} the completed value of this deferred
            */
            complete = function (completed) {
                var listener, i = 0;

                // Replace _then with one that directly notifies with the result.
                _then = completed.then;

                // Replace complete so that this Deferred can only be completed
                // once. Also Replace _progress, so that subsequent attempts to issue
                // progress throw.
                complete = _progress = function alreadyCompleted() {
                    // TODO: Consider silently returning here so that parties who
                    // have a reference to the resolver cannot tell that the promise
                    // has been resolved using try/catch
                    throw new Error("already completed");
                };

                // Free progressHandlers array since we'll never issue progress events
                // for this promise again now that it's completed
                progressHandlers = undef;

                // Notify listeners
                // Traverse all listeners registered directly with this Deferred

                while (listener = listeners[i++]) {
                    listener(completed);
                }

                listeners = [];
            };

            /**
            * The full Deferred object, with both {@link Promise} and {@link Resolver}
            * parts
            * @class Deferred
            * @name Deferred
            */
            deferred = {};

            // Promise and Resolver parts
            // Freeze Promise and Resolver APIs

            promise = new Promise();
            promise.then = deferred.then = then;

            /**
            * The {@link Promise} for this {@link Deferred}
            * @memberOf Deferred
            * @name promise
            * @type {Promise}
            */
            deferred.promise = freeze(promise);

            /**
            * The {@link Resolver} for this {@link Deferred}
            * @memberOf Deferred
            * @name resolver
            * @class Resolver
            */
            deferred.resolver = freeze({
                resolve: (deferred.resolve = resolve),
                reject: (deferred.reject = reject),
                progress: (deferred.progress = progress)
            });

            return deferred;
        }

        /**
        * Determines if promiseOrValue is a promise or not.  Uses the feature
        * test from http://wiki.commonjs.org/wiki/Promises/A to determine if
        * promiseOrValue is a promise.
        *
        * @param promiseOrValue anything
        *
        * @returns {Boolean} true if promiseOrValue is a {@link Promise}
        */
        function isPromise(promiseOrValue) {
            return promiseOrValue && typeof promiseOrValue.then === 'function';
        }

        /**
        * Register an observer for a promise or immediate value.
        *
        * @function
        * @name when
        * @namespace
        *
        * @param promiseOrValue anything
        * @param {Function} [callback] callback to be called when promiseOrValue is
        *   successfully resolved.  If promiseOrValue is an immediate value, callback
        *   will be invoked immediately.
        * @param {Function} [errback] callback to be called when promiseOrValue is
        *   rejected.
        * @param {Function} [progressHandler] callback to be called when progress updates
        *   are issued for promiseOrValue.
        *
        * @returns {Promise} a new {@link Promise} that will complete with the return
        *   value of callback or errback or the completion value of promiseOrValue if
        *   callback and/or errback is not supplied.
        */
        function when(promiseOrValue, callback, errback, progressHandler) {
            // Get a promise for the input promiseOrValue
            // See promise()
            var trustedPromise = promise(promiseOrValue);

            // Register promise handlers
            return trustedPromise.then(callback, errback, progressHandler);
        }

        /**
        * Returns promiseOrValue if promiseOrValue is a {@link Promise}, a new Promise if
        * promiseOrValue is a foreign promise, or a new, already-resolved {@link Promise}
        * whose resolution value is promiseOrValue if promiseOrValue is an immediate value.
        *
        * Note that this function is not safe to export since it will return its
        * input when promiseOrValue is a {@link Promise}
        *
        * @private
        *
        * @param promiseOrValue anything
        *
        * @returns Guaranteed to return a trusted Promise.  If promiseOrValue is a when.js {@link Promise}
        *   returns promiseOrValue, otherwise, returns a new, already-resolved, when.js {@link Promise}
        *   whose resolution value is:
        *   * the resolution value of promiseOrValue if it's a foreign promise, or
        *   * promiseOrValue if it's a value
        */
        function promise(promiseOrValue) {
            var promise, deferred;

            if (promiseOrValue instanceof Promise) {
                // It's a when.js promise, so we trust it
                promise = promiseOrValue;

            } else {
                // It's not a when.js promise.  Check to see if it's a foreign promise
                // or a value.

                deferred = defer();
                if (isPromise(promiseOrValue)) {
                    // It's a compliant promise, but we don't know where it came from,
                    // so we don't trust its implementation entirely.  Introduce a trusted
                    // middleman when.js promise

                    // IMPORTANT: This is the only place when.js should ever call .then() on
                    // an untrusted promise.
                    promiseOrValue.then(deferred.resolve, deferred.reject, deferred.progress);
                    promise = deferred.promise;

                } else {
                    // It's a value, not a promise.  Create an already-resolved promise
                    // for it.
                    deferred.resolve(promiseOrValue);
                    promise = deferred.promise;
                }
            }

            return promise;
        }

        /**
        * Return a promise that will resolve when howMany of the supplied promisesOrValues
        * have resolved. The resolution value of the returned promise will be an array of
        * length howMany containing the resolutions values of the triggering promisesOrValues.
        *
        * @memberOf when
        *
        * @param promisesOrValues {Array} array of anything, may contain a mix
        *      of {@link Promise}s and values
        * @param howMany
        * @param [callback]
        * @param [errback]
        * @param [progressHandler]
        *
        * @returns {Promise}
        */
        function some(promisesOrValues, howMany, callback, errback, progressHandler) {

            checkCallbacks(2, arguments);

            return when(promisesOrValues, function (promisesOrValues) {

                var toResolve, results, ret, deferred, resolver, rejecter, handleProgress, len, i;

                len = promisesOrValues.length >>> 0;

                toResolve = Math.max(0, Math.min(howMany, len));
                results = [];
                deferred = defer();
                ret = when(deferred, callback, errback, progressHandler);

                // Wrapper so that resolver can be replaced
                function resolve(val) {
                    resolver(val);
                }

                // Wrapper so that rejecter can be replaced
                function reject(err) {
                    rejecter(err);
                }

                // Wrapper so that progress can be replaced
                function progress(update) {
                    handleProgress(update);
                }

                function complete() {
                    resolver = rejecter = handleProgress = noop;
                }

                // No items in the input, resolve immediately
                if (!toResolve) {
                    deferred.resolve(results);

                } else {
                    // Resolver for promises.  Captures the value and resolves
                    // the returned promise when toResolve reaches zero.
                    // Overwrites resolver var with a noop once promise has
                    // be resolved to cover case where n < promises.length
                    resolver = function (val) {
                        // This orders the values based on promise resolution order
                        // Another strategy would be to use the original position of
                        // the corresponding promise.
                        results.push(val);

                        if (! --toResolve) {
                            complete();
                            deferred.resolve(results);
                        }
                    };

                    // Rejecter for promises.  Rejects returned promise
                    // immediately, and overwrites rejecter var with a noop
                    // once promise to cover case where n < promises.length.
                    // TODO: Consider rejecting only when N (or promises.length - N?)
                    // promises have been rejected instead of only one?
                    rejecter = function (err) {
                        complete();
                        deferred.reject(err);
                    };

                    handleProgress = deferred.progress;

                    // TODO: Replace while with forEach
                    for (i = 0; i < len; ++i) {
                        if (i in promisesOrValues) {
                            when(promisesOrValues[i], resolve, reject, progress);
                        }
                    }
                }

                return ret;
            });
        }

        /**
        * Return a promise that will resolve only once all the supplied promisesOrValues
        * have resolved. The resolution value of the returned promise will be an array
        * containing the resolution values of each of the promisesOrValues.
        *
        * @memberOf when
        *
        * @param promisesOrValues {Array|Promise} array of anything, may contain a mix
        *      of {@link Promise}s and values
        * @param [callback] {Function}
        * @param [errback] {Function}
        * @param [progressHandler] {Function}
        *
        * @returns {Promise}
        */
        function all(promisesOrValues, callback, errback, progressHandler) {

            checkCallbacks(1, arguments);

            return when(promisesOrValues, function (promisesOrValues) {
                return _reduce(promisesOrValues, reduceIntoArray, []);
            }).then(callback, errback, progressHandler);
        }

        function reduceIntoArray(current, val, i) {
            current[i] = val;
            return current;
        }

        /**
        * Return a promise that will resolve when any one of the supplied promisesOrValues
        * has resolved. The resolution value of the returned promise will be the resolution
        * value of the triggering promiseOrValue.
        *
        * @memberOf when
        *
        * @param promisesOrValues {Array|Promise} array of anything, may contain a mix
        *      of {@link Promise}s and values
        * @param [callback] {Function}
        * @param [errback] {Function}
        * @param [progressHandler] {Function}
        *
        * @returns {Promise}
        */
        function any(promisesOrValues, callback, errback, progressHandler) {

            function unwrapSingleResult(val) {
                return callback ? callback(val[0]) : val[0];
            }

            return some(promisesOrValues, 1, unwrapSingleResult, errback, progressHandler);
        }

        /**
        * Traditional map function, similar to `Array.prototype.map()`, but allows
        * input to contain {@link Promise}s and/or values, and mapFunc may return
        * either a value or a {@link Promise}
        *
        * @memberOf when
        *
        * @param promise {Array|Promise} array of anything, may contain a mix
        *      of {@link Promise}s and values
        * @param mapFunc {Function} mapping function mapFunc(value) which may return
        *      either a {@link Promise} or value
        *
        * @returns {Promise} a {@link Promise} that will resolve to an array containing
        *      the mapped output values.
        */
        function map(promise, mapFunc) {
            return when(promise, function (array) {
                return _map(array, mapFunc);
            });
        }

        /**
        * Private map helper to map an array of promises
        * @private
        *
        * @param promisesOrValues {Array}
        * @param mapFunc {Function}
        * @return {Promise}
        */
        function _map(promisesOrValues, mapFunc) {

            var results, len, i;

            // Since we know the resulting length, we can preallocate the results
            // array to avoid array expansions.
            len = promisesOrValues.length >>> 0;
            results = new Array(len);

            // Since mapFunc may be async, get all invocations of it into flight
            // asap, and then use reduce() to collect all the results
            for (i = 0; i < len; i++) {
                if (i in promisesOrValues)
                    results[i] = when(promisesOrValues[i], mapFunc);
            }

            // Could use all() here, but that would result in another array
            // being allocated, i.e. map() would end up allocating 2 arrays
            // of size len instead of just 1.  Since all() uses reduce()
            // anyway, avoid the additional allocation by calling reduce
            // directly.
            return _reduce(results, reduceIntoArray, results);
        }

        /**
        * Traditional reduce function, similar to `Array.prototype.reduce()`, but
        * input may contain {@link Promise}s and/or values, and reduceFunc
        * may return either a value or a {@link Promise}, *and* initialValue may
        * be a {@link Promise} for the starting value.
        *
        * @memberOf when
        *
        * @param promise {Array|Promise} array of anything, may contain a mix
        *      of {@link Promise}s and values.  May also be a {@link Promise} for
        *      an array.
        * @param reduceFunc {Function} reduce function reduce(currentValue, nextValue, index, total),
        *      where total is the total number of items being reduced, and will be the same
        *      in each call to reduceFunc.
        * @param initialValue starting value, or a {@link Promise} for the starting value
        *
        * @returns {Promise} that will resolve to the final reduced value
        */
        function reduce(promise, reduceFunc, initialValue) {
            var args = slice.call(arguments, 1);
            return when(promise, function (array) {
                return _reduce.apply(undef, [array].concat(args));
            });
        }

        /**
        * Private reduce to reduce an array of promises
        * @private
        *
        * @param promisesOrValues {Array}
        * @param reduceFunc {Function}
        * @param initialValue {*}
        * @return {Promise}
        */
        function _reduce(promisesOrValues, reduceFunc, initialValue) {

            var total, args;

            total = promisesOrValues.length;

            // Skip promisesOrValues, since it will be used as 'this' in the call
            // to the actual reduce engine below.

            // Wrap the supplied reduceFunc with one that handles promises and then
            // delegates to the supplied.

            args = [
			function (current, val, i) {
			    return when(current, function (c) {
			        return when(val, function (value) {
			            return reduceFunc(c, value, i, total);
			        });
			    });
			}
		];

            if (arguments.length > 2) args.push(initialValue);

            return reduceArray.apply(promisesOrValues, args);
        }

        /**
        * Ensure that resolution of promiseOrValue will complete resolver with the completion
        * value of promiseOrValue, or instead with resolveValue if it is provided.
        *
        * @memberOf when
        *
        * @param promiseOrValue
        * @param resolver {Resolver}
        * @param [resolveValue] anything
        *
        * @returns {Promise}
        */
        function chain(promiseOrValue, resolver, resolveValue) {
            var useResolveValue = arguments.length > 2;

            return when(promiseOrValue,
			function (val) {
			    if (useResolveValue) val = resolveValue;
			    resolver.resolve(val);
			    return val;
			},
			function (e) {
			    resolver.reject(e);
			    return rejected(e);
			},
			resolver.progress
		);
        }

        //
        // Utility functions
        //

        /**
        * Helper that checks arrayOfCallbacks to ensure that each element is either
        * a function, or null or undefined.
        *
        * @private
        *
        * @param arrayOfCallbacks {Array} array to check
        * @throws {Error} if any element of arrayOfCallbacks is something other than
        * a Functions, null, or undefined.
        */
        function checkCallbacks(start, arrayOfCallbacks) {
            var arg, i = arrayOfCallbacks.length;
            while (i > start) {
                arg = arrayOfCallbacks[--i];
                if (arg != null && typeof arg != 'function') throw new Error('callback is not a function');
            }
        }

        /**
        * No-Op function used in method replacement
        * @private
        */
        function noop() { }

        slice = [].slice;

        // ES5 reduce implementation if native not available
        // See: http://es5.github.com/#x15.4.4.21 as there are many
        // specifics and edge cases.
        reduceArray = [].reduce ||
		function (reduceFunc /*, initialValue */) {
		    // ES5 dictates that reduce.length === 1

		    // This implementation deviates from ES5 spec in the following ways:
		    // 1. It does not check if reduceFunc is a Callable

		    var arr, args, reduced, len, i;

		    i = 0;
		    arr = Object(this);
		    len = arr.length >>> 0;
		    args = arguments;

		    // If no initialValue, use first item of array (we know length !== 0 here)
		    // and adjust i to start at second item
		    if (args.length <= 1) {
		        // Skip to the first real element in the array
		        for (; ; ) {
		            if (i in arr) {
		                reduced = arr[i++];
		                break;
		            }

		            // If we reached the end of the array without finding any real
		            // elements, it's a TypeError
		            if (++i >= len) {
		                throw new TypeError();
		            }
		        }
		    } else {
		        // If initialValue provided, use it
		        reduced = args[1];
		    }

		    // Do the actual reduce
		    for (; i < len; ++i) {
		        // Skip holes
		        if (i in arr)
		            reduced = reduceFunc(reduced, arr[i], i, arr);
		    }

		    return reduced;
		};

        return when;
    });
})(typeof define == 'function'
	? define
	: function (factory) {
	    typeof module != 'undefined'
		? (module.exports = factory())
		: (jQuery.mapster_when = factory());
	}
// Boilerplate for AMD, Node, and browser global
);
/*lint-ignore-end*//* ImageMapster core */

/*jslint laxbreak: true, evil: true */
/*global jQuery: true, Zepto: true */


(function ($) {
    // all public functions in $.mapster.impl are methods
    $.fn.mapster = function (method) {
        var m = $.mapster.impl;
        if ($.isFunction(m[method])) {
            return m[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return m.bind.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.mapster');
        }
    };

    $.mapster = {
        version: "1.2.6",
        render_defaults: {
            isSelectable: true,
            isDeselectable: true,
            fade: false,
            fadeDuration: 150,
            altImage: null,
            fill: true,
            fillColor: '000000',
            fillColorMask: 'FFFFFF',
            fillOpacity: 0.7,
            highlight: null,
            stroke: false,
            strokeColor: 'ff0000',
            strokeOpacity: 1,
            strokeWidth: 1,
            includeKeys: '',
            alt_image: null // used internally
        },
        defaults: {
            clickNavigate: false,
            wrapClass: null,
            wrapCss: null,
            onGetList: null,
            sortList: false,
            listenToList: false,
            mapKey: '',
            mapValue: '',
            singleSelect: false,
            listKey: 'value',
            listSelectedAttribute: 'selected',
            listSelectedClass: null,
            onClick: null,
            onMouseover: null,
            onMouseout: null,
            mouseoutDelay: 0,
            onStateChange: null,
            boundList: null,
            onConfigured: null,
            configTimeout: 30000,
            noHrefIsMask: true,
            scaleMap: true,
            safeLoad: false,
            areas: []
        },
        shared_defaults: {
            render_highlight: { fade: true },
            render_select: { fade: false },
            staticState: null,
            selected: null
        },
        area_defaults:
        {
            includeKeys: '',
            isMask: false
        },
        canvas_style: {
            position: 'absolute',
            left: 0,
            top: 0,
            padding: 0,
            border: 0
        },
        hasCanvas: null,
        isTouch: null,
        windowLoaded: false,
        map_cache: [],
        hooks: {},
        addHook: function(name,callback) {
            this.hooks[name]=(this.hooks[name]||[]).push(callback);
        },
        callHooks: function(name,context) {
            $.each(this.hooks[name]||[],function(i,e) {
                e.apply(context);
            });
        },
        utils: {
            //            extend: function (target, sources, deep) {
            //                var i,u=this;
            //                $.extend.call(null, [target].concat(sources));
            //                for (i = 0; i < deep.length; i++) {
            //                    u.extend(
            //                }
            //            },
            // return four outer corners, as well as possible places

            // extends the constructor, returns a new object prototype. Does not refer to the
            // original constructor so is protected if the original object is altered. This way you
            // can "extend" an object by replacing it with its subclass.
            subclass: function(BaseClass, constr) {
                var Subclass=function() {
                    var me=this, 
                        args=Array.prototype.slice.call(arguments,0);
                    me.base = BaseClass.prototype;
                    me.base.init = function() {
                        BaseClass.prototype.constructor.apply(me,args);
                    };
                    constr.apply(me,args);
                };
                Subclass.prototype = new BaseClass();
                Subclass.prototype.constructor=Subclass;
                return Subclass;
            },
            asArray: function (obj) {
                return obj.constructor === Array ?
                    obj : this.split(obj);
            },
            // clean split: no padding or empty elements
            split: function (text,cb) {
                var i,el, arr = text.split(',');
                for (i = 0; i < arr.length; i++) {
                    el = $.trim(arr[i]);
                    if (el==='') {
                        arr.splice(i,1);
                    } else {
                        arr[i] = cb ? cb(el):el;
                    }
                }
                return arr;
            },
            // similar to $.extend but does not add properties (only updates), unless the
            // first argument is an empty object, then all properties will be copied
            updateProps: function (_target, _template) {
                var onlyProps,
                    target = _target || {},
                    template = $.isEmptyObject(target) ? _template : _target;

                //if (template) {
                onlyProps = [];
                $.each(template, function (prop) {
                    onlyProps.push(prop);
                });
                //}

                $.each(Array.prototype.slice.call(arguments, 1), function (i, src) {
                    $.each(src || {}, function (prop) {
                        if (!onlyProps || $.inArray(prop, onlyProps) >= 0) {
                            var p = src[prop];

                            if ($.isPlainObject(p)) {
                                // not recursive - only copies 1 level of subobjects, and always merges
                                target[prop] = $.extend(target[prop] || {}, p);
                            } else if (p && p.constructor === Array) {
                                target[prop] = p.slice(0);
                            } else if (typeof p !== 'undefined') {
                                target[prop] = src[prop];
                            }

                        }
                    });
                });
                return target;
            },
            isElement: function (o) {
                return (typeof HTMLElement === "object" ? o instanceof HTMLElement :
                        o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string");
            },
            // finds element of array or object with a property "prop" having value "val"
            // if prop is not defined, then just looks for property with value "val"
            indexOfProp: function (obj, prop, val) {
                var result = obj.constructor === Array ? -1 : null;
                $.each(obj, function (i, e) {
                    if (e && (prop ? e[prop] : e) === val) {
                        result = i;
                        return false;
                    }
                });
                return result;
            },
            // returns "obj" if true or false, or "def" if not true/false
            boolOrDefault: function (obj, def) {
                return this.isBool(obj) ?
                        obj : def || false;
            },
            isBool: function (obj) {
                return typeof obj === "boolean";
            },
            // evaluates "obj", if function, calls it with args
            // (todo - update this to handle variable lenght/more than one arg)
            ifFunction: function (obj, that, args) {
                if ($.isFunction(obj)) {
                    obj.call(that, args);
                }
            },
            size: function(image) {
                var u=$.mapster.utils;
                return { 
                    width: u.imgWidth(image,true),
                    height: u.imgHeight(image,true),
                    complete: function() { return !!this.height && !!this.width;}
                };
            },

            // basic function to set the opacity of an element. 
            // this gets monkey patched by the graphics module when running in IE6-8

            setOpacity: function (el, opacity) {
                el.style.opacity = opacity;
            },

            // fade "el" from opacity "op" to "endOp" over a period of time "duration"
            
            fader: (function () {
                var elements = {},
                        lastKey = 0,
                        fade_func = function (el, op, endOp, duration) {
                            var index, obj, u = $.mapster.utils;
                            if (typeof el === 'number') {
                                obj = elements[el];
                                if (!obj) {
                                    return;
                                }
                            } else {
                                index = u.indexOfProp(elements, null, el);
                                if (index) {
                                    delete elements[index];
                                }
                                elements[++lastKey] = obj = el;
                                el = lastKey;
                            }
                            endOp = endOp || 1;

                            op = (op + (endOp / 10) > endOp - 0.01) ? endOp : op + (endOp / 10);

                            u.setOpacity(obj, op);
                            if (op < endOp) {
                                setTimeout(function () {
                                    fade_func(el, op, endOp, duration);
                                }, duration ? duration / 10 : 15);
                            }
                        };
                return fade_func;
            } ())
        },
        getBoundList: function (opts, key_list) {
            if (!opts.boundList) {
                return null;
            }
            var index, key, result = $(), list = $.mapster.utils.split(key_list);
            opts.boundList.each(function (i,e) {
                for (index = 0; index < list.length; index++) {
                    key = list[index];
                    if ($(e).is('[' + opts.listKey + '="' + key + '"]')) {
                        result = result.add(e);
                    }
                }
            });
            return result;
        },
        // Causes changes to the bound list based on the user action (select or deselect)
        // area: the jQuery area object
        // returns the matching elements from the bound list for the first area passed (normally only one should be passed, but
        // a list can be passed
        setBoundListProperties: function (opts, target, selected) {
            target.each(function (i,e) {
                if (opts.listSelectedClass) {
                    if (selected) {
                        $(e).addClass(opts.listSelectedClass);
                    } else {
                        $(e).removeClass(opts.listSelectedClass);
                    }
                }
                if (opts.listSelectedAttribute) {
                    $(e).attr(opts.listSelectedAttribute, selected);
                }
            });
        },
        getMapDataIndex: function (obj) {
            var img, id;
            switch (obj.tagName && obj.tagName.toLowerCase()) {
                case 'area':
                    id = $(obj).parent().attr('name');
                    img = $("img[usemap='#" + id + "']")[0];
                    break;
                case 'img':
                    img = obj;
                    break;
            }
            return img ?
                this.utils.indexOfProp(this.map_cache, 'image', img) : -1;
        },
        getMapData: function (obj) {
            var index = this.getMapDataIndex(obj.length ? obj[0]:obj);
            if (index >= 0) {
                return index >= 0 ? this.map_cache[index] : null;
            }
        },
        queueCommand: function (map_data, that, command, args) {
            if (!map_data) {
                return false;
            }
            if (!map_data.complete || map_data.currentAction) {
                map_data.commands.push(
                {
                    that: that,
                    command: command,
                    args: args
                });
                return true;
            }
            return false;
        },
        unload: function () {
            this.impl.unload();
            this.utils = null;
            this.impl = null;
            $.fn.mapster = null;
            $.mapster = null;
            $('*').unbind();
        }
    };

    // Config for object prototypes
    // first: use only first object (for things that should not apply to lists)
    /// calls back one of two fuinctions, depending on whether an area was obtained.
    // opts: {
    //    name: 'method name',
    //    key: 'key,
    //    args: 'args'
    //
    //}
    // name: name of method (required)
    // args: arguments to re-call with
    // Iterates through all the objects passed, and determines whether it's an area or an image, and calls the appropriate
    // callback for each. If anything is returned from that callback, the process is stopped and that data return. Otherwise,
    // the object itself is returned.
    var m = $.mapster;
    
    // jQuery's width() and height() are broken on IE9 in some situations. This tries everything. 
    $.each(["width","height"],function(i,e) {
        var capProp = e.substr(0,1).toUpperCase() + e.substr(1);
        // when jqwidth parm is passed, it also checks the jQuery width()/height() property
        // the issue is that jQUery width() can report a valid size before the image is loaded in some browsers
        // without it, we can read zero even when image is loaded in other browsers if its not visible
        // we must still check because stuff like adblock can temporarily block it
        // what a goddamn headache
        m.utils["img"+capProp]=function(img,jqwidth) {
                return (jqwidth ? $(img)[e]() : 0) || 
                    img[e] || img["natural"+capProp] || img["client"+capProp] || img["offset"+capProp];
        };
     
    });    

    m.Method = function (that, func_map, func_area, opts) {
        var me = this;
        me.name = opts.name;
        me.output = that;
        me.input = that;
        me.first = opts.first || false;
        me.args = opts.args ? Array.prototype.slice.call(opts.args, 0) : [];
        me.key = opts.key;
        me.func_map = func_map;
        me.func_area = func_area;
        //$.extend(me, opts);
        me.name = opts.name;
        me.allowAsync = opts.allowAsync || false;
    };
    m.Method.prototype.go = function () {
        var i,  data, ar, len, result, src = this.input,
                area_list = [],
                me = this;
        len = src.length;
        for (i = 0; i < len; i++) {
            data = $.mapster.getMapData(src[i]);
            if (data) {
                if (!me.allowAsync && m.queueCommand(data, me.input, me.name, me.args)) {
                    if (this.first) {
                        result = '';
                    }
                    continue;
                }
                ar = data.getData(src[i].nodeName === 'AREA' ? src[i] : this.key);
                if (ar) {
                    if ($.inArray(ar, area_list) < 0) {
                        area_list.push(ar);
                    }
                } else {
                    result = this.func_map.apply(data, me.args);
                }
                if (this.first || typeof result !== 'undefined') {
                    break;
                }
            }
        }
        // if there were areas, call the area function for each unique group
        $(area_list).each(function (i,e) {
            result = me.func_area.apply(e, me.args);
        });

        if (typeof result !== 'undefined') {
            return result;
        } else {
            return this.output;
        }
    };


    $.mapster.impl = (function () {
        var me = {},
            m = $.mapster,
            u = $.mapster.utils,
            removeMap, addMap;

        addMap = function (map_data) {
            return m.map_cache.push(map_data) - 1;
        };
        removeMap = function (map_data) {
            m.map_cache.splice(map_data.index, 1);
            for (var i = m.map_cache.length - 1; i >= this.index; i--) {
                m.map_cache[i].index--;
            }
        };
        /// return current map_data for an image or area

        // merge new area data into existing area options. used for rebinding.
        function merge_areas(map_data, areas) {
            var ar, index,
                map_areas = map_data.options.areas;
            if (areas) {
                $.each(areas, function (i, e) {
                    if (this) {
                        index = u.indexOfProp(map_areas, "key", this.key);
                        if (index >= 0) {
                            $.extend(map_areas[index], this);
                        }
                        else {
                            map_areas.push(this);
                        }
                        ar = map_data.getDataForKey(this.key);
                        if (ar) {
                            $.extend(ar.options, this);
                        }
                    }
                });
            }
        }
        function merge_options(map_data, options) {
            var temp_opts = u.updateProps({}, options);
            delete temp_opts.areas;

            u.updateProps(map_data.options, temp_opts);

            merge_areas(map_data, options.areas);
            // refresh the area_option template
            u.updateProps(map_data.area_options, map_data.options);
        }
        // Most methods use the "Method" object which handles figuring out whether it's an image or area called and
        // parsing key parameters. The constructor wants:
        // this, the jQuery object
        // a function that is called when an image was passed (with a this context of the MapData)
        // a function that is called when an area was passed (with a this context of the AreaData)
        // options: first = true means only the first member of a jQuery object is handled
        //          key = the key parameters passed
        //          defaultReturn: a value to return other than the jQuery object (if its not chainable)
        //          args: the arguments
        // Returns a comma-separated list of user-selected areas. "staticState" areas are not considered selected for the purposes of this method.
        me.get = function (key) {
            var md = m.getMapData(this);
            if (!(md && md.complete)) {
                throw("Can't access data until binding complete.");
            }

            return (new m.Method(this,
                function () {
                    // map_data return
                    return this.getSelected();
                },
                function () {
                    return this.isSelected();
                },
                { name: 'get',
                    args: arguments,
                    key: key,
                    first: true,
                    allowAsync: true,
                    defaultReturn: ''
                }
            )).go();
        };
        me.data = function (key) {
            return (new m.Method(this,
                null,
                function () {
                    return this;
                },
                { name: 'data',
                    args: arguments,
                    key: key
                }
            )).go();
        };


        // Set or return highlight state.
        //  $(img).mapster('highlight') -- return highlighted area key, or null if none
        //  $(area).mapster('highlight') -- highlight an area
        //  $(img).mapster('highlight','area_key') -- highlight an area
        //  $(img).mapster('highlight',false) -- remove highlight
        me.highlight = function (key) {
            return (new m.Method(this,
                function () {
                    if (key === false) {
                        this.ensureNoHighlight();
                    } else {
                        var id = this.highlightId;
                        return id >= 0 ? this.data[id].key : null;
                    }
                },
                function () {
                    this.highlight();
                },
                { name: 'highlight',
                    args: arguments,
                    key: key,
                    first: true
                }
            )).go();
        };
        // Return the primary keys for an area or group key.
        // $(area).mapster('key')
        // includes all keys (not just primary keys)
        // $(area).mapster('key',true)
        // $(img).mapster('key','group-key')

        // $(img).mapster('key','group-key', true)
        me.keys = function(key,all) {
            var keyList=[], 
                md = m.getMapData(this);

            if (!(md && md.complete)) {
                throw("Can't access data until binding complete.");
            }


            function addUniqueKeys(ad) {
                var areas,keys=[];
                if (!all) {
                    keys.push(ad.key);
                } else {
                    areas=ad.areas();
                    $.each(areas,function(i,e) {
                        keys=keys.concat(e.keys);
                    });
                }
                $.each(keys,function(i,e) {
                    if ($.inArray(e,keyList)<0) {
                        keyList.push(e);                         
                    }
                });
            }

            if (!(md  && md.complete)) {
                return '';
            }
            if (typeof key === 'string') {
                if (all) {
                    addUniqueKeys(md.getDataForKey(key));
                } else {
                    keyList=[md.getKeysForGroup(key)];
                }
            } else {
                all = key;
                this.each(function(i,e) {
                    if (e.nodeName==='AREA') {
                        addUniqueKeys(md.getDataForArea(e));
                    }
                });
            }
            return keyList.join(',');
        

        };
        me.select = function () {
            me.set.call(this, true);
        };
        me.deselect = function () {
            me.set.call(this, false);
        };
        // Select or unselect areas identified by key -- a string, a csv string, or array of strings.
        // if set_bound is true, the bound list will also be updated. Default is true. If neither true nor false,
        // it will be toggled.
        me.set = function (selected, key, options) {
            var lastMap, map_data, opts=options,
                key_list, area_list; // array of unique areas passed

            function setSelection(ar) {
                if (ar) {
                    switch (selected) {
                        case true:
                            ar.addSelection(opts); break;
                        case false:
                            ar.removeSelection(true); break;
                        default:
                            ar.toggleSelection(opts); break;
                    }
                }
            }
            function addArea(ar) {
               if (ar && $.inArray(ar, area_list) < 0) {
                    area_list.push(ar);
                    key_list+=(key_list===''?'':',')+ar.key;
                }
            }
            // Clean up after a group that applied to the same map
            function finishSetForMap(map_data) {
                $.each(area_list, function (i, el) {
                    setSelection(el);
                });
                if (!selected) {
                    map_data.removeSelectionFinish();
                }
                if (map_data.options.boundList) {
                    m.setBoundListProperties(map_data.options, m.getBoundList(map_data.options, key_list), selected);
                }            
            }

            this.filter('img,area').each(function (i,e) {
                var keys;
                map_data = m.getMapData(e);

                if (map_data !== lastMap) {
                    if (lastMap) {
                       finishSetForMap(lastMap);
                    }

                    area_list = [];
                    key_list='';
                }
                
               if (map_data) {
                    keys = '';
                    if (e.nodeName.toUpperCase()==='IMG') {
                        if (!m.queueCommand(map_data, $(e), 'set', [selected, key, opts])) {
                            if (key instanceof Array) {
                                if (key.length) {
                                    keys = key.join(",");
                                }
                            }
                            else {
                                keys = key;
                            }

                            if (keys) {
                                $.each(u.split(keys), function (i,key) {
                                    addArea(map_data.getDataForKey(key.toString()));
                                    lastMap = map_data;
                                });
                            }
                        }
                    } else {
                        opts=key;
                        if (!m.queueCommand(map_data, $(e), 'set', [selected, opts])) {
                            addArea(map_data.getDataForArea(e));
                            lastMap = map_data;
                        }
                    
                    }
                }
            });
            
            if (map_data) {
               finishSetForMap(map_data);
            }

           
            return this;
        };
        me.unbind = function (preserveState) {
            return (new m.Method(this,
                function () {
                    this.clearEvents();
                    this.clearMapData(preserveState);
                    removeMap(this);
                },
                null,
                { name: 'unbind',
                    args: arguments
                }
            )).go();
        };


        // refresh options and update selection information.
        me.rebind = function (options) {
            return (new m.Method(this,
                function () {
                    var me=this;

                    me.complete=false;
                    me.configureOptions(options);
                    me.bindImages(true,function() {
                        me.buildDataset(true);
                        me.complete=true;
                    });
                    //this.redrawSelections();
                },
                null,
                {
                    name: 'rebind',
                    args: arguments
                }
            )).go();
        };
        // get options. nothing or false to get, or "true" to get effective options (versus passed options)
        me.get_options = function (key, effective) {
            var eff = u.isBool(key) ? key : effective; // allow 2nd parm as "effective" when no key
            return (new m.Method(this,
                function () {
                    var opts = $.extend({}, this.options);
                    if (eff) {
                        opts.render_select = u.updateProps(
                            {},
                            m.render_defaults,
                            opts,
                            opts.render_select);

                        opts.render_highlight = u.updateProps(
                            {},
                            m.render_defaults,
                            opts,
                            opts.render_highlight);
                    }
                    return opts;
                },
                function () {
                    return eff ? this.effectiveOptions() : this.options;
                },
                {
                    name: 'get_options',
                    args: arguments,
                    first: true,
                    allowAsync: true,
                    key: key
                }
            )).go();
        };

        // set options - pass an object with options to set,
        me.set_options = function (options) {
            return (new m.Method(this,
                function () {
                    merge_options(this, options);
                },
                null,
                {
                    name: 'set_options',
                    args: arguments
                }
            )).go();
        };
        me.unload = function () {
            var i;
            for (i = m.map_cache.length - 1; i >= 0; i--) {
                if (m.map_cache[i]) {
                    me.unbind.call($(m.map_cache[i].image));
                }
            }
            me.graphics = null;
        };

        me.snapshot = function () {
            return (new m.Method(this,
                function () {
                    $.each(this.data, function (i, e) {
                        e.selected = false;
                    });

                    this.base_canvas = this.graphics.createVisibleCanvas(this);
                    $(this.image).before(this.base_canvas);
                },
                null,
                { name: 'snapshot' }
            )).go();
        };
        // do not queue this function
        me.state = function () {
            var md, result = null;
            $(this).each(function (i,e) {
                if (e.nodeName === 'IMG') {
                    md = m.getMapData(e);
                    if (md) {
                        result = md.state();
                    }
                    return false;
                }
            });
            return result;
        };

        me.bind = function (options) {

            return this.each(function (i,e) {
                var img, map, usemap, map_data;

                // save ref to this image even if we can't access it yet. commands will be queued
                img = $(e);

                // sorry - your image must have border:0, things are too unpredictable otherwise.
                img.css('border', 0);

                map_data = m.getMapData(e);
                // if already bound completely, do a total rebind
                if (map_data) {
                    me.unbind.apply(img);
                    if (!map_data.complete) {
                        // will be queued
                        img.bind();
                        return true;
                    }
                    map_data = null;
                }

                // ensure it's a valid image
                // jQuery bug with Opera, results in full-url#usemap being returned from jQuery's attr.
                // So use raw getAttribute instead.
                usemap = this.getAttribute('usemap');
                map = usemap && $('map[name="' + usemap.substr(1) + '"]');
                if (!(img.is('img') && usemap && map.size() > 0)) {
                    return true;
                }

                if (!map_data) {
                    map_data = new m.MapData(this, options);

                    map_data.index = addMap(map_data);
                    map_data.map = map;
                    map_data.bindImages(true);
                }
            });
        };

        me.init = function (useCanvas) {
            var style, shapes;


            // check for excanvas explicitly - don't be fooled
            m.hasCanvas = (document.namespaces && document.namespaces.g_vml_) ? false :
                $('<canvas></canvas>')[0].getContext ? true : false;

            m.isTouch = 'ontouchstart' in document.documentElement;

            if (!(m.hasCanvas || document.namespaces)) {
                $.fn.mapster = function () {
                    return this;
                };
                return;
            }
            if (!u.isBool($.mapster.defaults.highlight)) {
                m.render_defaults.highlight = !m.isTouch;
            }

            $.extend(m.defaults, m.render_defaults,m.shared_defaults);
            $.extend(m.area_defaults, m.render_defaults,m.shared_defaults);

            // for testing/debugging, use of canvas can be forced by initializing manually with "true" or "false"
            if (u.isBool(useCanvas)) {
                m.hasCanvas = useCanvas;
            }
            if ($.browser.msie && !m.hasCanvas && !document.namespaces.v) {
                document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
                style = document.createStyleSheet();
                shapes = ['shape', 'rect', 'oval', 'circ', 'fill', 'stroke', 'imagedata', 'group', 'textbox'];
                $.each(shapes,
                function (i, el) {
                    style.addRule('v\\:' + el, "behavior: url(#default#VML); antialias:true");
                });
            }

            // for safe load option
            $(window).bind('load', function () {
                m.windowLoaded = true;
                $(m.map_cache).each(function (i,e) {
                    if (!e.complete && e.isReadyToBind()) {
                        e.initialize();
                    }
                });
            });


        };
        me.test = function (obj) {
            return eval(obj);
        };
        return me;
    } ());

    $.mapster.impl.init();
} (jQuery));
/* graphics.js
   Graphics object handles all rendering.
*/
(function ($) {
    var p, m=$.mapster,
        u=m.utils;
    
    /**
     * Implemenation to add each area in an AreaData object to the canvas
     * @param {Graphics} graphics The target graphics object
     * @param {AreaData} areaData The AreaData object (a collection of area elements and metadata)
     * @param {object} options Rendering options to apply when rendering this group of areas
     */
    function addShapeGroupImpl(graphics, areaData, options) {
        var me = graphics,
            md = me.map_data,
            isMask = options.isMask;

        // first get area options. Then override fade for selecting, and finally merge in the 
        // "select" effect options.

        $.each(areaData.areas(), function (i,e) {
            options.isMask = isMask || (e.nohref && md.options.noHrefIsMask);
            me.addShape(e, options);
        });

        // it's faster just to manipulate the passed options isMask property and restore it, than to 
        // copy the object each time
        
        options.isMask=isMask;

    }


    /**
     * An object associated with a particular map_data instance to manage renderin.
     * @param {MapData} map_data The MapData object bound to this instance
     */
    
    m.Graphics = function (map_data) {
        //$(window).unload($.mapster.unload);
        // create graphics functions for canvas and vml browsers. usage:
        // 1) init with map_data, 2) call begin with canvas to be used (these are separate b/c may not require canvas to be specified
        // 3) call add_shape_to for each shape or mask, 4) call render() to finish

        var me = this;
        me.active = false;
        me.canvas = null;
        me.width = 0;
        me.height = 0;
        me.shapes = [];
        me.masks = [];
        me.map_data = map_data;
    };
    
    p = m.Graphics.prototype= {
        constructor: m.Graphics,

        /**
         * Initiate a graphics request for a canvas
         * @param  {Element} canvas The canvas element that is the target of this operation
         * @param  {string} [elementName] The name to assign to the element (VML only)
         */
        
        begin: function(canvas, elementName) {
            var c = $(canvas);

            this.elementName = elementName;
            this.canvas = canvas;

            this.width = c.width();
            this.height = c.height();
            this.shapes = [];
            this.masks = [];
            this.active = true;

        },
        
        /**
         * Add an area to be rendered to this canvas. 
         * @param {MapArea} mapArea The MapArea object to render
         * @param {object} options An object containing any rendering options that should override the
         *                         defaults for the area
         */
        
        addShape: function(mapArea, options) {
            var addto = options.isMask ? this.masks : this.shapes;
            addto.push({ mapArea: mapArea, options: options });
        },

        /**
         * Create a canvas that is sized and styled for the MapData object
         * @param  {MapData} mapData The MapData object that will receive this new canvas
         * @return {Element} A canvas element
         */
        
        createVisibleCanvas: function (mapData) {
            return $(this.createCanvasFor(mapData))
                .addClass('mapster_el')
                .css(m.canvas_style)[0];
        },

        /**
         * Add a group of shapes from an AreaData object to the canvas
         * 
         * @param {AreaData} areaData An AreaData object (a set of area elements)
         * @param {string} mode     The rendering mode, "select" or "highlight". This determines the target 
         *                          canvas and which default options to use.
         * @param {striong} options  Rendering options
         */
        
        addShapeGroup: function (areaData, mode,options) {
            // render includeKeys first - because they could be masks
            var me = this,
                list, name, canvas,
                map_data = this.map_data,
                opts = areaData.effectiveRenderOptions(mode);

            if (options) {
                 $.extend(opts,options);
            }

            if (mode === 'select') {
                name = "static_" + areaData.areaId.toString();
                canvas = map_data.base_canvas;
            } else {
                canvas = map_data.overlay_canvas;
            }

            me.begin(canvas, name);

            if (opts.includeKeys) {
                list = u.split(opts.includeKeys);
                $.each(list, function (i,e) {
                    var areaData = map_data.getDataForKey(e.toString());
                    addShapeGroupImpl(me,areaData, areaData.effectiveRenderOptions(mode));
                });
            }

            addShapeGroupImpl(me,areaData, opts);
            me.render();
            if (opts.fade) {
                
                // fading requires special handling for IE. We must access the fill elements directly. The fader also has to deal with 
                // the "opacity" attribute (not css)

                u.fader(m.hasCanvas ? 
                    canvas : 
                    $(canvas).find('._fill').not('.mapster_mask'),
                0,
                m.hasCanvas ? 
                    1 : 
                    opts.fillOpacity,
                opts.fadeDuration); 
               
            }

        }
    };

    // configure remaining prototype methods for ie or canvas-supporting browser

    if (m.hasCanvas) {

        /**
         * Convert a hex value to decimal
         * @param  {string} hex A hexadecimal string
         * @return {int} Integer represenation of the hex string
         */
        
        p.hex_to_decimal = function (hex) {
            return Math.max(0, Math.min(parseInt(hex, 16), 255));
        };

        p.css3color = function (color, opacity) {
            return 'rgba(' + this.hex_to_decimal(color.substr(0, 2)) + ','
                    + this.hex_to_decimal(color.substr(2, 2)) + ','
                    + this.hex_to_decimal(color.substr(4, 2)) + ',' + opacity + ')';
        };

        p.renderShape = function (context, mapArea, offset) {
            var i,
                c = mapArea.coords(null,offset);

            switch (mapArea.shape) {
                case 'rect':
                    context.rect(c[0], c[1], c[2] - c[0], c[3] - c[1]);
                    break;
                case 'poly':
                    context.moveTo(c[0], c[1]);

                    for (i = 2; i < mapArea.length; i += 2) {
                        context.lineTo(c[i], c[i + 1]);
                    }
                    context.lineTo(c[0], c[1]);
                    break;
                case 'circ':
                case 'circle':
                    context.arc(c[0], c[1], c[2], 0, Math.PI * 2, false);
                    break;
            }
        };

        p.addAltImage = function (context, image, mapArea, options) {
            context.beginPath();

            this.renderShape(context, mapArea);
            context.closePath();
            context.clip();

            context.globalAlpha = options.altImageOpacity || options.fillOpacity;

            context.drawImage(image, 0, 0, mapArea.owner.scaleInfo.width, mapArea.owner.scaleInfo.height);
        };

        p.render = function () {
            // firefox 6.0 context.save() seems to be broken. to work around,  we have to draw the contents on one temp canvas,
            // the mask on another, and merge everything. ugh. fixed in 1.2.2. unfortunately this is a lot more code for masks,
            // but no other way around it that i can see.

            var maskCanvas, maskContext,
                        me = this,
                        hasMasks = me.masks.length,
                        shapeCanvas = me.createCanvasFor(me.map_data),
                        shapeContext = shapeCanvas.getContext('2d'),
                        context = me.canvas.getContext('2d');

            if (hasMasks) {
                maskCanvas = me.createCanvasFor(me.map_data);
                maskContext = maskCanvas.getContext('2d');
                maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

                $.each(me.masks, function (i,e) {
                    maskContext.save();
                    maskContext.beginPath();
                    me.renderShape(maskContext, e.mapArea);
                    maskContext.closePath();
                    maskContext.clip();
                    maskContext.lineWidth = 0;
                    maskContext.fillStyle = '#000';
                    maskContext.fill();
                    maskContext.restore();
                });

            }

            $.each(me.shapes, function (i,s) {
                shapeContext.save();
                if (s.options.fill) {
                    if (s.options.alt_image) {
                        me.addAltImage(shapeContext, s.options.alt_image, s.mapArea, s.options);
                    } else {
                        shapeContext.beginPath();
                        me.renderShape(shapeContext, s.mapArea);
                        shapeContext.closePath();
                        //shapeContext.clip();
                        shapeContext.fillStyle = me.css3color(s.options.fillColor, s.options.fillOpacity);
                        shapeContext.fill();
                    }
                }
                shapeContext.restore();
            });


            // render strokes at end since masks get stroked too

            $.each(me.shapes.concat(me.masks), function (i,s) {
                var offset = s.options.strokeWidth === 1 ? 0.5 : 0;
                // offset applies only when stroke width is 1 and stroke would render between pixels.

                if (s.options.stroke) {
                    shapeContext.save();
                    shapeContext.strokeStyle = me.css3color(s.options.strokeColor, s.options.strokeOpacity);
                    shapeContext.lineWidth = s.options.strokeWidth;

                    shapeContext.beginPath();

                    me.renderShape(shapeContext, s.mapArea, offset);
                    shapeContext.closePath();
                    shapeContext.stroke();
                    shapeContext.restore();
                }
            });

            if (hasMasks) {
                // render the new shapes against the mask

                maskContext.globalCompositeOperation = "source-out";
                maskContext.drawImage(shapeCanvas, 0, 0);

                // flatten into the main canvas
                context.drawImage(maskCanvas, 0, 0);
            } else {
                context.drawImage(shapeCanvas, 0, 0);
            }

            me.active = false;
            return me.canvas;



        };

        // create a canvas mimicing dimensions of an existing element
        p.createCanvasFor = function (md) {
            return $('<canvas width="' + md.scaleInfo.width + '" height="' +md.scaleInfo.height + '"></canvas>')[0];
        };
        p.clearHighlight = function () {
            var c = this.map_data.overlay_canvas;
            c.getContext('2d').clearRect(0, 0, c.width, c.height);
        };
        p.removeSelections = function () {

        };
        // Draw all items from selected_list to a new canvas, then swap with the old one. This is used to delete items when using canvases.
        p.refreshSelections = function () {
            var canvas_temp, map_data = this.map_data;
            // draw new base canvas, then swap with the old one to avoid flickering
            canvas_temp = map_data.base_canvas;

            map_data.base_canvas = this.createVisibleCanvas(map_data);
            $(map_data.base_canvas).hide();
            $(canvas_temp).before(map_data.base_canvas);

            map_data.redrawSelections();

            $(map_data.base_canvas).show();
            $(canvas_temp).remove();
        };

    } else {

        /**
         * Set the opacity of the element. This is an IE<8 specific function for handling VML.
         * When using VML we must override the "setOpacity" utility function (monkey patch ourselves).
         * jQuery does not deal with opacity correctly for VML elements. This deals with that.
         * 
         * @param {Element} el The DOM element
         * @param {double} opacity A value between 0 and 1 inclusive.
         */
        
        u.setOpacity = function(el,opacity) {         
            $(el).each(function(i,e) {
                if (typeof e.opacity !=='undefined') {
                   e.opacity=opacity;
                } else {
                    $(e).css("opacity",opacity);
                }
            });
        };

        p.renderShape = function (mapArea, options, cssclass) {
            var me = this, fill,stroke, e, t_fill, el_name, el_class, template, c = mapArea.coords();
            el_name = me.elementName ? 'name="' + me.elementName + '" ' : '';
            el_class = cssclass ? 'class="' + cssclass + '" ' : '';

            t_fill = '<v:fill color="#' + options.fillColor + '" class="_fill" opacity="' + 
                (options.fill ? 
                    options.fillOpacity :
                    0) + 
                '" /><v:stroke class="_fill" opacity="' + 
                options.strokeOpacity + '"/>';


            stroke = options.stroke ?
                ' strokeweight=' + options.strokeWidth + ' stroked="t" strokecolor="#' + 
                    options.strokeColor + '"' :
                ' stroked="f"';
            
            fill = options.fill ? 
                ' filled="t"' :
                ' filled="f"';

            switch (mapArea.shape) {
                case 'rect':
                    template = '<v:rect ' + el_class + el_name + fill + stroke + 
                        ' style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:' + 
                          c[0] + 'px;top:' + c[1]  + 'px;width:' + (c[2] - c[0]) + 
                          'px;height:' + (c[3] - c[1]) + 'px;">' + t_fill + '</v:rect>';
                    break;
                case 'poly':
                    template = '<v:shape ' + el_class + el_name + fill + stroke + ' coordorigin="0,0" coordsize="' + me.width + ',' + me.height
                                + '" path="m ' + c[0] + ',' + c[1] + ' l ' + c.slice(2).join(',')
                                + ' x e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:0px;left:0px;width:' + me.width + 'px;height:' + me.height + 'px;">' + t_fill + '</v:shape>';
                    break;
                case 'circ':
                case 'circle':
                    template = '<v:oval ' + el_class + el_name + fill + stroke
                                + ' style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:' + (c[0] - c[2]) + 'px;top:' + (c[1] - c[2])
                                + 'px;width:' + (c[2] * 2) + 'px;height:' + (c[2] * 2) + 'px;">' + t_fill + '</v:oval>';
                    break;
            }
            e = $(template);
            $(me.canvas).append(e);

            return e;
        };
        p.render = function () {
            var opts, me = this;

            $.each(this.shapes, function (i,e) {
                me.renderShape(e.mapArea, e.options);
            });

            if (this.masks.length) {
                $.each(this.masks, function (i,e) {
                    opts = u.updateProps({},
                        e.options, {
                            fillOpacity: 1,
                            fillColor: e.options.fillColorMask
                        });
                    me.renderShape(e.mapArea, opts, 'mapster_mask');
                });
            }

            this.active = false;
            return this.canvas;
        };

        p.createCanvasFor = function (md) {
            var w = md.scaleInfo.width,
                h = md.scaleInfo.height;
            return $('<var width="' + w + '" height="' + h 
                + '" style="zoom:1;overflow:hidden;display:block;width:' 
                + w + 'px;height:' + h + 'px;"></var>')[0];
        };

        p.clearHighlight = function () {
            $(this.map_data.overlay_canvas).children().remove();
        };
        // remove single or all selections
        p.removeSelections = function (area_id) {
            if (area_id >= 0) {
                $(this.map_data.base_canvas).find('[name="static_' + area_id.toString() + '"]').remove();
            }
            else {
                $(this.map_data.base_canvas).children().remove();
            }
        };
        p.refreshSelections = function () {
            return null;
        };

    }

} (jQuery));/* mapdata.js
   the MapData object, repesents an instance of a single bound imagemap
*/

(function ($) {

    var p, m = $.mapster, u = m.utils;
    m.MapData = function (image, options) {
        var me = this;

        function queueMouseEvent(delay,area,callback) {
            //var eventId = "id"+area.areaId;
            function cbFinal(areaId) {
                if (me.currentAreaId!==areaId && me.highlightId>=0) {
                    callback();
                }
            }
            if (me.activeAreaEvent) {
                window.clearTimeout(me.activeAreaEvent);
                me.activeAreaEvent=0;
            }
            if (delay<0) {
                return;
            }

            if (area.owner.currentAction || delay) {
                me.activeAreaEvent = window.setTimeout((function() {
                            return function() {
                            queueMouseEvent(0,area,callback);
                        };
                    }(area)),
                    delay || 100);
            } else {
                 cbFinal(area.areaId);
            }
        }


   
        this.image = image;              // (Image)  main map image

        // save the initial style of the image for unbinding. This is problematic, chrome duplicates styles when assigning, and
        // cssText is apparently not universally supported. Need to do something more robust to make unbinding work universally.
        this.imgCssText = image.style.cssText || null;

        this.initializeDefaults();
        this.configureOptions(options);

        /**
         * Mousedown event. This is captured only to prevent browser from drawing an outline around an
         * area when it's clicked.
         * 
         * @param  {EventData} e jQuery event data
         */
        this.mousedown = function (e) {
            if (!$.mapster.hasCanvas) {
                this.blur();
            }
            e.preventDefault();
        };

        /**
         * Mouseover event. Handle highlight rendering and client callback on mouseover
         * 
         * @param  {EventData} e jQuery event data
         * @return {[type]}   [description]
         */
        
        this.mouseover = function (e) {
            var arData = me.getAllDataForArea(this),
                ar=arData.length ? arData[0] : null;

            // mouseover events are ignored entirely while resizing, though we do care about mouseout events
            // and must queue the action to keep things clean.

            if (!ar || ar.isNotRendered() || ar.owner.currentAction) {
                return;
            }

            if (me.currentAreaId === ar.areaId) {
                return;
            }
            if (me.highlightId !== ar.areaId) {
                me.clearEffects();

                ar.highlight();

                if (me.options.showToolTip) {
                    $.each(arData,function(i,e) {
                        if (e.effectiveOptions().toolTip) {
                            e.showTooltip();
                        }
                    });
                }
            }
            me.currentAreaId = ar.areaId;

            if ($.isFunction(me.options.onMouseover)) {
                me.options.onMouseover.call(this,
                {
                    e: e,
                    options:ar.effectiveOptions(),
                    key: ar.key,
                    selected: ar.isSelected()
                });
            }

        };

        this.mouseout = function (e) {
            var newArea,ar = me.getDataForArea(this),
                    opts = me.options;


            if (me.currentAreaId<0 || !ar) {
                return;
            }

            newArea=me.getDataForArea(e.relatedTarget);
            if (newArea === ar) {
                return;
            }
            //me.legacyAreaId = me.currentAreaId;

            me.currentAreaId = -1;
            ar.area=null;

            queueMouseEvent(opts.mouseoutDelay,ar,me.clearEffects);

            if ($.isFunction(opts.onMouseout)) {
                opts.onMouseout.call(this,
                {
                    e: e,
                    options: opts,
                    key: ar.key,
                    selected: ar.isSelected()
                });
            }

        };

        this.clearEffects = function () {
            var opts = me.options;

            //me.legacyAreaId=-1;
            me.ensureNoHighlight();

            if (opts.toolTipClose && $.inArray('area-mouseout', opts.toolTipClose) >= 0 && me.activeToolTip) {
                me.clearTooltip();
            }
        };
        this.click = function (e) {
            var selected, list, list_target, newSelectionState, canChangeState, cbResult, target,
                    that = this,
                    ar = me.getDataForArea(this),
                    opts = me.options;

            function clickArea(ar) {
                var areaOpts;
                canChangeState = (ar.isSelectable() &&
                    (ar.isDeselectable() || !ar.isSelected()));
                if (canChangeState) {
                    newSelectionState = !ar.isSelected();
                } else {
                    newSelectionState = ar.isSelected();
                }

                list_target = m.getBoundList(opts, ar.key);

                if ($.isFunction(opts.onClick)) {
                    cbResult= opts.onClick.call(that,
                    {
                        e: e,
                        listTarget: list_target,
                        key: ar.key,
                        selected: newSelectionState
                    });
                    if (u.isBool(cbResult)) {
                        if (!cbResult) {
                            return false;
                        }
                        target = $(ar.area).attr('href');
                        if (target!=='#') {
                            window.location.href=target;
                            return false;
                        }
                     }
                }

                if (canChangeState) {
                    selected = ar.toggleSelection();
                }

                if (opts.boundList && opts.boundList.length > 0) {
                    m.setBoundListProperties(opts, list_target, ar.isSelected());
                }

                areaOpts = ar.effectiveOptions();
                if (areaOpts.includeKeys) {
                    list = u.split(areaOpts.includeKeys);
                    $.each(list, function (i, e) {
                        var ar = me.getDataForKey(e.toString());
                        if (!ar.options.isMask) {
                            clickArea(ar);
                        }
                    });
                }
            }

            me.mousedown.call(this,e);
            if (opts.clickNavigate && ar.href) {
                window.location.href=ar.href;
                return;
            }

            if (ar && !ar.owner.currentAction) {
                opts = me.options;
                clickArea(ar);
            }

        };
        this.graphics = new m.Graphics(this);

    };
    p = m.MapData.prototype;

    p.configureOptions=function(options) {
        // this is done here instead of the consturc
        this.area_options = u.updateProps({}, // default options for any MapArea
            m.area_defaults,
            options);
        this.options= u.updateProps({}, m.defaults, options);
        this.bindTries = this.options.configTimeout / 200;
    };
    p.initializeDefaults = function () {
        $.extend(this,{
            images: [],               // (Image)  all images associated with this map. this will include a "copy" of the main one
            imageSources: [],         // (string) src for each image
            imageStatus: [],          // (bool)   the loaded status of each indexed image in images
            altImagesXref: {},        // (int)    xref of "render_xxx" to this.images
            map: null,                // ($)      the image map
            base_canvas: null,       // (canvas|var)  where selections are rendered
            overlay_canvas: null,    // (canvas|var)  where highlights are rendered
            imagesLoaded: false,     // (bool)    when all images have finished loading (config can proceed)
            complete: false,         // (bool)    when configuration is complete
            commands: [],            // {}        commands that were run before configuration was completed (b/c images weren't loaded)
            data: [],                // MapData[] area groups
            mapAreas: [],            // MapArea[] list. AreaData entities contain refs to this array, so options are stored with each.
            _xref: {},               // (int)      xref of mapKeys to data[]
            highlightId: -1,        // (int)      the currently highlighted element.
            currentAreaId: -1,
            _tooltip_events: [],     // {}         info on events we bound to a tooltip container, so we can properly unbind them
            scaleInfo: null,         // {}         info about the image size, scaling, defaults
            index: -1,                 // index of this in map_cache - so we have an ID to use for wraper div
            activeAreaEvent: null
        });
    };

    p.isActive = function() {
        return !this.complete || this.currentAction;
    };
    p.state = function () {
        return {
            complete: this.complete,
            resizing: this.currentAction==='resizing',
            zoomed: this.zoomed,
            zoomedArea: this.zoomedArea,
            scaleInfo: this.scaleInfo
        };
    };
    p.isReadyToBind = function () {
        return this.imagesLoaded && (!this.options.safeLoad || m.windowLoaded);
    };
    // bind a new image to a src, capturing load event. Return the new (or existing) image.
    p.addImage = function (img, src, altId) {
        var image, source, me = this,
        getImageIndex=function(img) {
            return $.inArray(img, me.images);
        },

        // fires on image onLoad evens, could mean everything is ready
        load=function() {
            var index = getImageIndex(this);
            if (index>=0) {

                me.imageStatus[index] = true;
                if ($.inArray(false, me.imageStatus) < 0 &&
                            (!me.options.safeLoad || m.windowLoaded)) {
                    me.initialize();
                }
            }
        },
        storeImage=function(image) {
            var index = me.images.push(image) - 1;
            me.imageSources[index] = source;
            me.imageStatus[index] = false;
            if (altId) {
                me.altImagesXref[altId] = index;
            }
        };

        if (!img && !src) { return; }

        image = img;
        // use attr because we want the actual source, not the resolved path the browser will return directly calling image.src
        source = src || $(image).attr('src');
        if (!source) { throw ("Missing image source"); }

        if (!image) {
            image = $('<img class="mapster_el" />').hide()[0];

            //$(this.images[0]).before(image);

            //image = new Image();
            //image.src = source;

            $('body').append(image);
            storeImage(image);
            $(image).bind('onload',load).bind('onerror',function(e) {
                me.imageLoadError.call(me,e);
            });
            $(image).attr('src', source);

        } else {
            storeImage(image);
        }

    };
    // Checks status & updates if it's loaded
    p.isImageLoaded= function (index) {
        var status,img,me=this;
        if (me.imageStatus[index]) { return true; }
        img = me.images[index];
        
        if (typeof img.complete !== 'undefined') {
            status=img.complete;
        } else {
            status=!!u.imgWidth(img);
        }
        // if complete passes, the image is loaded, but may STILL not be available because of stuff like adblock.
        // make sure it is.

        me.imageStatus[index]=status;
        return status;
    };
    // Wait until all images are loaded then call initialize. This is difficult because browsers are incosistent about
    // how or if "onload" works and in how one can actually detect if an image is already loaded. Try to check first,
    // then bind onload event, and finally use a timer to keep checking.
    
    // the "first" parameter means this was the first time it was called

    p.bindImages = function (first,callback) {
        var i,
            me = this,
            loaded=true,
            opts=me.options,
            retry=function() {
                me.bindImages.call(me,false,callback);
            };
            

        if (first) {
            me.complete=false;
            me.triesLeft = me.bindTries;
            me.imagesLoaded=false;
            // reset the images if this is a rebind
            if (me.images.length>2) {
                me.images=me.images.slice(0,2);
                me.imageSources=me.imageSources.slice(0,2);
                me.imageStatus=me.imageStatus.slice(0,2);
                me.altImagesXref={};
            }
            me.altImagesXref={};
            if (me.images.length===0) {
                // add the actual main image
                me.addImage(me.image);
                // will create a duplicate of the main image, we need this to get raw size info
                me.addImage(null,me.image.src);
            }
            // add alt images
            if ($.mapster.hasCanvas) {
                me.addImage(null, opts.render_highlight.altImage || opts.altImage, "highlight");
                me.addImage(null, opts.render_select.altImage || opts.altImage, "select");
            }
        }

        if (me.imagesLoaded) {
            return;
        }

        // check to see if every image has already been loaded
        i=me.images.length;
        while (i-->0) {
            if (!me.isImageLoaded(i)) {
                loaded=false;
                break;
            }
        }
        me.imagesLoaded=loaded;

        if (me.isReadyToBind()) {
            if (callback) {
                callback();
            } else {
                me.initialize();
            }
        } else {
            // to account for failure of onLoad to fire in rare situations
            if (me.triesLeft-- > 0) {
                me.imgTimeout=window.setTimeout(retry, 200);
            } else {
                me.imageLoadError.call(me);
            }
        }
    };
    p.imageLoadError=function(e) {
        clearTimeout(this.imgTimeout);
        this.triesLeft=0;
        var err = e ? 'The image ' + e.target.src + ' failed to load.' : 
        'The images never seemed to finish loading. You may just need to increase the configTimeout if images could take a long time to load.';
        throw err;
    };
    p.altImage = function (mode) {
        return this.images[this.altImagesXref[mode]];
    };
    p.wrapId = function () {
        return 'mapster_wrap_' + this.index;
    };
    p._idFromKey = function (key) {
        return typeof key === "string" && this._xref.hasOwnProperty(key) ?
                    this._xref[key] : -1;
    };
    // getting all selected keys - return comma-separated string
    p.getSelected = function () {
        var result = '';
        $.each(this.data, function (i,e) {
            if (e.isSelected()) {
                result += (result ? ',' : '') + this.key;
            }
        });
        return result;
    };
    // Locate MapArea data from an HTML area. atMost limits it to x keys.
    // Usually you would be using 1 to just get the primary key areas
    p.getAllDataForArea = function (area,atMost) {
        var i,ar, result,
            me=this,
            key = $(area).filter('area').attr(me.options.mapKey);

        if (key) {
            result=[];
            key = u.split(key);

            for (i=0;i<(atMost || key.length);i++) {
                ar = me.data[me._idFromKey(key[i])];
                ar.area=area.length ? area[0]:area;
                // set the actual area moused over/selected
                // TODO: this is a brittle model for capturing which specific area - if this method was not used,
                // ar.area could have old data. fix this.
                result.push(ar);
            }
        }

        return result;
    };
    p.getDataForArea = function(area) {
        var ar=this.getAllDataForArea(area,1);
        return ar ? ar[0] || null : null;
    };
    p.getDataForKey = function (key) {
        return this.data[this._idFromKey(key)];
    };
    // Return the primary keys associated with an area group. If this is a primary key, it will be returned.
    p.getKeysForGroup = function(key) {
        var ar=this.getDataForKey(key);
        
        return !ar ? '':
            ar.isPrimary ? 
                ar.key :
                this.getPrimaryKeysForMapAreas(ar.areas()).join(',');
    };
    // given an array of MapArea object, return an array of its unique primary  keys
    p.getPrimaryKeysForMapAreas=function(areas)
    {
        var keys=[];
        $.each(areas,function(i,e) {
            if ($.inArray(e.keys[0],keys)<0) {
                keys.push(e.keys[0]);
            }
        });
        return keys;
    };
    p.getData = function (obj) {
        if (typeof obj === 'string') {
            return this.getDataForKey(obj);
        } else if (obj && obj.mapster || u.isElement(obj)) {
            return this.getDataForArea(obj);
        } else {
            return null;
        }
    };
    // remove highlight if present, raise event
    p.ensureNoHighlight = function () {
        var ar;
        if (this.highlightId >= 0) {
            this.graphics.clearHighlight();
            ar = this.data[this.highlightId];
            ar.changeState('highlight', false);
            this.setHighlightId(-1);
        }
    };
    p.setHighlightId = function(id) {
        this.highlightId = id;
    };
    p.clearSelections = function () {
        //this.graphics.removeSelections();
        $.each(this.data, function (i,e) {
            if (e.selected) {
                e.removeSelection(true);
             }
        });
        this.removeSelectionFinish();
        
    };

    // rebind based on new area options. This copies info from array "areas" into the data[area_id].area_options property.
    // it returns a list of all selected areas.
    
    /**
     * Set area options from an array of option data.
     * 
     * @param {object[]} areas An array of objects containing area-specific options
     */
    
    p.setAreaOptions = function (areas) {
        var i, area_options, ar;
        areas = areas || [];

        // refer by: map_data.options[map_data.data[x].area_option_id]
        
        for (i = areas.length - 1; i >= 0; i--) {
            area_options = areas[i];
            if (area_options) {
                ar = this.getDataForKey(area_options.key);
                if (ar) {
                    u.updateProps(ar.options, area_options);
                    
                    // TODO: will not deselect areas that were previously selected, so this only works
                    // for an initial bind.
                    
                    if (u.isBool(area_options.selected)) {
                        ar.selected = area_options.selected;
                    }
                }
            }
        }
    };
    // keys: a comma-separated list
    p.drawSelections = function (keys) {
        var i, key_arr = u.asArray(keys);

        for (i = key_arr.length - 1; i >= 0; i--) {
            this.data[key_arr[i]].drawSelection();
        }
    };
    p.redrawSelections = function () {
        $.each(this.data, function (i, e) {
            if (e.isSelectedOrStatic()) {
                e.drawSelection();
            }
        });

    };
    ///called when images are done loading
    p.initialize = function () {
        var imgCopy, base_canvas, overlay_canvas, wrap, parentId, css, i,size,
            img,sort_func, sorted_list,  scale,  
                    me = this,
                    opts = me.options;

        if (me.complete) {
            return;
        }

        img = $(me.image);
        
        parentId = img.parent().attr('id');

        // create a div wrapper only if there's not already a wrapper, otherwise, own it
        if (parentId && parentId.length >= 12 && parentId.substring(0, 12) === "mapster_wrap") {
            wrap = img.parent();
            wrap.attr('id', me.wrapId());
        } else {
            wrap = $('<div id="' + me.wrapId() + '"></div>');

            if (opts.wrapClass) {
                if (opts.wrapClass === true) {
                    wrap.addClass(img[0].className);
                }
                else {
                    wrap.addClass(opts.wrapClass);
                }
            }
        }
        me.wrapper = wrap;
        
        // me.images[1] is the copy of the original image. It should be loaded & at its native size now so we can obtain the true
        // width & height. This is needed to scale the imagemap if not being shown at its native size. It is also needed purely
        // to finish binding in case the original image was not visible. It can be impossible in some browsers to obtain the
        // native size of a hidden image.

        me.scaleInfo = scale = u.scaleMap(me.images[0],me.images[1], opts.scaleMap);
        
        base_canvas = me.graphics.createVisibleCanvas(me);
        overlay_canvas = me.graphics.createVisibleCanvas(me);

        me.base_canvas = base_canvas;
        me.overlay_canvas = overlay_canvas;

        // Now we got what we needed from the copy -clone from the original image again to make sure any other attributes are copied
        imgCopy = $(me.images[1])
            .addClass('mapster_el')
            .addClass(me.images[0].className)
            .attr({id:null, usemap: null});
            
        size=u.size(me.images[0]);
        if (size.complete) {
            imgCopy.css({
                width: size.width,
                height: size.height
            });
        }
 
        me.buildDataset();

        // now that we have processed all the areas, set css for wrapper, scale map if needed

        css = {
            display: 'block',
            position: 'relative',
            padding: 0,
            width: scale.width,
            height: scale.height
        };

        if (opts.wrapCss) {
            $.extend(css, opts.wrapCss);
        }
        // if we were rebinding with an existing wrapper, the image will aready be in it
        if (img.parent()[0] !== me.wrapper[0]) {

            img.before(me.wrapper);
        }

        wrap.css(css);

        // move all generated images into the wrapper for easy removal later

        $(me.images.slice(2)).hide();
        for (i = 1; i < me.images.length; i++) {
            wrap.append(me.images[i]);
        }

        //me.images[1].style.cssText = me.image.style.cssText;

        wrap.append(base_canvas)
                    .append(overlay_canvas)
                    .append(img.css(m.canvas_style));

        // images[0] is the original image with map, images[1] is the copy/background that is visible

        u.setOpacity(me.images[0], 0);
        $(me.images[1]).show();

        u.setOpacity(me.images[1],1);

        if (opts.isSelectable && opts.onGetList) {
            sorted_list = me.data.slice(0);
            if (opts.sortList) {
                if (opts.sortList === "desc") {
                    sort_func = function (a, b) {
                        return a === b ? 0 : (a > b ? -1 : 1);
                    };
                }
                else {
                    sort_func = function (a, b) {
                        return a === b ? 0 : (a < b ? -1 : 1);
                    };
                }

                sorted_list.sort(function (a, b) {
                    a = a.value;
                    b = b.value;
                    return sort_func(a, b);
                });
            }

            me.options.boundList = opts.onGetList.call(me.image, sorted_list);
        }
        
        me.complete=true;
        me.processCommandQueue();
        
        if (opts.onConfigured && typeof opts.onConfigured === 'function') {
            opts.onConfigured.call(img, true);
        }
    };

    // when rebind is true, the MapArea data will not be rebuilt.
    p.buildDataset=function(rebind) {
        var sel,areas,j,area_id,$area,area,curKey,mapArea,key,keys,mapAreaId,group_value,dataItem,href,
            me=this,
            opts=me.options,
            default_group;

        function addAreaData(key, value) {
            var dataItem = new m.AreaData(me, key, value);
            dataItem.areaId = me._xref[key] = me.data.push(dataItem) - 1;
            return dataItem.areaId;
        }

        me._xref = {};
        me.data = [];
        if (!rebind) {
            me.mapAreas=[];
        }

        default_group = !opts.mapKey;
        if (default_group) {
            opts.mapKey = 'data-mapster-key';
        }
        sel = ($.browser.msie && $.browser.version <= 7) ? 'area' :
                    (default_group ? 'area[coords]' : 'area[' + opts.mapKey + ']');
        areas = $(me.map).find(sel).unbind('.mapster');
                    
        for (mapAreaId = 0;mapAreaId<areas.length; mapAreaId++) {
            area_id = 0;
            area = areas[mapAreaId];
            $area = $(area);

            // skip areas with no coords - selector broken for older ie
            if (!area.coords) {
                continue;
            }
            // Create a key if none was assigned by the user

            if (default_group) {
                 curKey=String(mapAreaId);
                $area.attr('data-mapster-key', curKey);
               
            } else {
                curKey = area.getAttribute(opts.mapKey);
            }

            // conditions for which the area will be bound to mouse events
            // only bind to areas that don't have nohref. ie 6&7 cannot detect the presence of nohref, so we have to also not bind if href is missing.

            if (rebind) {
                mapArea = me.mapAreas[$area.data('mapster')-1];
                mapArea.configure(curKey);
            } else {
                mapArea = new m.MapArea(me, area,curKey);
                me.mapAreas.push(mapArea);
            }

            keys = mapArea.keys; // converted to an array by mapArea


            // Iterate through each mapKey assigned to this area
            for (j = keys.length - 1; j >= 0; j--) {
                key = keys[j];

                if (opts.mapValue) {
                    group_value = $area.attr(opts.mapValue);
                }
                if (default_group) {
                    // set an attribute so we can refer to the area by index from the DOM object if no key
                    area_id = addAreaData(me.data.length, group_value);
                    dataItem = me.data[area_id];
                    dataItem.key = key = area_id.toString();
                }
                else {
                    area_id = me._xref[key];
                    if (area_id >= 0) {
                        dataItem = me.data[area_id];
                        if (group_value && !me.data[area_id].value) {
                            dataItem.value = group_value;
                        }
                    }
                    else {
                        area_id = addAreaData(key, group_value);
                        dataItem = me.data[area_id];
                        dataItem.isPrimary=j===0;
                    }
                }
                mapArea.areaDataXref.push(area_id);
                dataItem.areasXref.push(mapAreaId);
            }

            href=$area.attr('href');
            if (href && href!=='#' && !dataItem.href)
            {
                dataItem.href=href;
            }

            if (!mapArea.nohref) {
                $area.bind('mouseover.mapster', me.mouseover)
                    .bind('mouseout.mapster', me.mouseout)
                    .bind('click.mapster', me.click)
                    .bind('mousedown.mapster', me.mousedown);
            }

            // store an ID with each area. 
            $area.data("mapster", mapAreaId+1);
        }

       
        // TODO listenToList
        //            if (opts.listenToList && opts.nitG) {
        //                opts.nitG.bind('click.mapster', event_hooks[map_data.hooks_index].listclick_hook);
        //            }

        // populate areas from config options
        me.setAreaOptions(opts.areas);
        me.redrawSelections();

    };
    p.processCommandQueue=function() {
        
        var cur,me=this;
        while (!me.currentAction && me.commands.length) {
            cur = me.commands[0];
            me.commands.splice(0,1);
            m.impl[cur.command].apply(cur.that, cur.args);
        }
    };
    p.clearEvents = function () {
        $(this.map).find('area')
                    .unbind('.mapster');
        $(this.images)
                    .unbind('.mapster');
    };
    p._clearCanvases = function (preserveState) {
        // remove the canvas elements created
        if (!preserveState) {
            $(this.base_canvas).remove();
        }
        $(this.overlay_canvas).remove();
    };
    p.clearMapData = function (preserveState) {
        var me = this;
        this._clearCanvases(preserveState);

        // release refs to DOM elements
        $.each(this.data, function (i, e) {
            e.reset();
        });
        this.data = null;
        if (!preserveState) {
            // get rid of everything except the original image
            this.image.style.cssText = this.imgCssText;
            $(this.wrapper).before(this.image).remove();

        }
        // release refs

        $.each(this.images, function (i,e) {
            if (me.images[i] !== e.image) {
                me.images[i] = null;
            }
        });
        me.images = [];

        this.image = null;
        u.ifFunction(this.clearTooltip, this);
    };
    // Compelete cleanup process for deslecting items. Called after a batch operation, or by AreaData for single
    // operations not flagged as "partial"
    p.removeSelectionFinish = function () {
        var g = this.graphics;

        g.refreshSelections();
        // do not call ensure_no_highlight- we don't really want to unhilight it, just remove the effect
        g.clearHighlight();
    };
} (jQuery));
/* areadata.js
   AreaData and MapArea protoypes
*/

(function ($) {
    var p, m = $.mapster, u = m.utils;
    m.AreaData = function (owner, key, value) {
        $.extend(this,{
            owner: owner, 
            key: key || '',
            // means this represents the first key in a list of keys (it's the area group that gets highlighted on mouseover)
            isPrimary: true,
            areaId: -1,
            href: '',
            value: value || '',
            options:{},
            // "null" means unchanged. Use "isSelected" method to just test true/false 
            selected: null,       
            // xref to MapArea objects
            areasXref: [],
            // (temporary storage) - the actual area moused over
            area: null,
            // the last options used to render this. Cache so when re-drawing after a remove, changes in options won't
            // break already selected things. 
            optsCache: null
         });
    };
    p = m.AreaData.prototype;

    p.areas = function() {
        var i,result=[];
        for (i=0;i<this.areasXref.length;i++) {
            result.push(this.owner.mapAreas[this.areasXref[i]]);
        }
        return result;
    };
    // return all coordinates for all areas
    p.coords = function(offset) {
        var coords = [];
        $.each(this.areas(), function (i, el) {
            coords = coords.concat(el.coords(offset));
        });
        return coords;
    };
    p.reset = function () {
        $.each(this.areas(), function (i, e) {
            e.reset();
        });
        this.areasXref = [];
        this.options = null;
    };
    // Return the effective selected state of an area, incorporating staticState
    p.isSelectedOrStatic = function () {

        var o = this.effectiveOptions();
        return u.isBool(o.staticState) ? o.staticState :
                    this.isSelected();
    };
    p.isSelected = function () {
        return u.isBool(this.selected) ? this.selected :
            u.isBool(this.owner.area_options.selected) ? this.owner.area_options.selected : false;
    };
    p.isSelectable = function () {
        return u.isBool(this.effectiveOptions().staticState) ? false :
                    (u.isBool(this.owner.options.staticState) ? false : u.boolOrDefault(this.effectiveOptions().isSelectable,true));
    };
    p.isDeselectable = function () {
        return u.isBool(this.effectiveOptions().staticState) ? false :
                    (u.isBool(this.owner.options.staticState) ? false : u.boolOrDefault(this.effectiveOptions().isDeselectable,true));
    };
    p.isNotRendered = function() {
        var area = $(this.area);
        return area.attr('nohref') ||
            !area.attr('href') ||
            this.effectiveOptions().isMask;

    };

    
    p.effectiveOptions = function (override_options) {
        //TODO this isSelectable should cascade already this seems redundant
        var opts = u.updateProps({},
                this.owner.area_options,
                this.options,
                override_options || {},
                {id: this.areaId }
            );
        opts.selected = this.isSelected();
        return opts;
    };
    // Return the options effective for this area for a "render" or "highlight" mode. This should get the default options,
    // merge in the areas-specific options, and then the mode-specific options.
    
    p.effectiveRenderOptions = function (mode, override_options) {
        var allOpts,opts=this.optsCache;
        
        if (!opts || mode==='highlight') {
            allOpts = this.effectiveOptions(override_options);
            opts = u.updateProps({},
                allOpts,
                allOpts["render_" + mode],
                { 
                    alt_image: this.owner.altImage(mode) 
                });
            if (mode!=='highlight') {
                this.optsCache=opts;
            }
        }
        return $.extend({},opts);
    };

    // Fire callback on area state change
    p.changeState = function (state_type, state) {
        if ($.isFunction(this.owner.options.onStateChange)) {
            this.owner.options.onStateChange.call(this.owner.image,
                {
                    key: this.key,
                    state: state_type,
                    selected: state
                });
        }
    };
    // highlight this area, no render causes it to happen internally only
    p.highlight = function (options) {
        var o = this.owner;
        if (this.effectiveOptions().highlight) {
            o.graphics.addShapeGroup(this, "highlight",options);
        }
        o.setHighlightId(this.areaId);
        this.changeState('highlight', true);
    };
    // select this area. if "callEvent" is true then the state change event will be called. (This method can be used
    // during config operations, in which case no event is indicated)
    p.drawSelection = function () {
        this.owner.graphics.addShapeGroup(this, "select");
    };
    p.addSelection = function (options) {
        // need to add the new one first so that the double-opacity effect leaves the current one highlighted for singleSelect
        var o = this.owner;
        if (o.options.singleSelect) {
            o.clearSelections();
        }

        // because areas can overlap - we can't depend on the selection state to tell us anything about the inner areas.
        // don't check if it's already selected
        if (!this.isSelected()) {
            if (options) {
                this.optsCache = $.extend(this.effectiveRenderOptions('select'),options);
            }
            this.drawSelection();
            if (options) {
                this.optsCache=null;
            }
            this.selected = true;
            this.changeState('select', true);
        }

        if (o.options.singleSelect) {
            o.graphics.refreshSelections();
        }
    };
    // Remove a selected area group. If the parameter "partial" is true, then this is a manual operation
    // and the caller mus call "finishRemoveSelection" after multiple "removeSelectionFinish" events
    p.removeSelection = function (partial) {

        //            if (this.selected === false) {
        //                return;
        //            }
        this.selected = false;
        this.changeState('select', false);
        // release information about last area options when deselecting.
        this.optsCache=null;
        this.owner.graphics.removeSelections(this.areaId);

        // Complete selection removal process. This is separated because it's very inefficient to perform the whole
        // process for multiple removals, as the canvas must be totally redrawn at the end of the process.ar.remove
        if (!partial) {
            this.owner.removeSelectionFinish();
        }
    };


    p.toggleSelection = function (options) {
        if (!this.isSelected()) {
            this.addSelection(options);
        }
        else {
            this.removeSelection();
        }
        return this.isSelected();
    };


    // represents an HTML area
    m.MapArea = function (owner,areaEl,keys) {
        if (!owner) {
            return;
        }
        var me = this;
        me.owner = owner;   // a MapData object
        me.area = areaEl;
        me.areaDataXref=[]; // a list of map_data.data[] id's for each areaData object containing this
        me.originalCoords = [];
        $.each(u.split(areaEl.coords), function (i, el) {
            me.originalCoords.push(parseFloat(el));
        });
        me.length = me.originalCoords.length;
        me.shape = areaEl.shape.toLowerCase();
        me.nohref = areaEl.nohref || !areaEl.href;
        me.configure(keys);
    };
    m.MapArea.prototype.configure=function(keys) {
        this.keys = u.split(keys);
    };
    m.MapArea.prototype.reset = function() {
        this.area=null;
    };
    m.MapArea.prototype.coords = function (offset) {
        return $.map(this.originalCoords,function(e) {
            return offset ? e : e+offset;
        });
    };
    // Get effective options for a specific area. Because areas can be part of multiple groups, this is problematic
    // and I have not found a perfect solution yet. When highlighting an area by mouseover, the options should reflect
    // the primary group. When highlighting by association, they should reflect the other area's primary group. Right
    // now this function has no knowledge of context though, so attempting to define different sets of options for 
    // areas depending on group context will not work as expected.
    
    // At this point this function is not used. I am leaving it here until we possibly have a better answer.
    
//     m.MapArea.prototype.effectiveRenderOptions_obsolete = function(mode,keys) {
//         var i,ad,me=this,m=me.owner,opts;
//        
//         if (!me.lastOpts) {
//            opts=u.updateProps({},m.area_options);
// 
//            for (i=this.keys.length-1;i>=0;i--) {
//                ad = m.getDataForKey(this.keys[i]);
//                u.updateProps(opts,
//                               ad.effectiveRenderOptions(mode),
//                               ad.options["render_" + mode],
//                    { alt_image: this.owner.altImage(mode) });
//            }
//
//           me.lastOpts=opts;
//        }
//        return me.lastOpts;
//    };

} (jQuery));
/* areacorners.js
   determine the best place to put a box of dimensions (width,height) given a circle, rect or poly
*/

(function ($) {
    var u=$.mapster.utils;
    u.areaCorners = function (areaEls, width, height) {
        var found, minX, minY, maxX, maxY, bestMinX, bestMaxX, bestMinY, bestMaxY, curX, curY, nest, j,
           iCoords,radius,angle,area,
           coords=[];

        // map the coordinates of any type of shape to a poly and use the logic. simpler than using three different
        // calculation methods. Circles use a 20 degree increment for this estimation.
        
        for (j=0;j<areaEls.length;j++) {
            area=areaEls[j];
            iCoords = u.split(area.coords,parseInt);
            switch(area.shape) {
                case 'circle':
                    curX=iCoords[0];
                    curY=iCoords[1];
                    radius=iCoords[2];
                    coords=[];
                    for (j=0;j<360;j+=20) {
                         angle=j*Math.PI/180;
                         coords.push(curX+radius*Math.cos(angle),curY+radius*Math.sin(angle));
                    }
                    break;
                  case 'rect':
                      coords.push(iCoords[0],iCoords[1],iCoords[2],iCoords[1],iCoords[2],iCoords[3],iCoords[0],iCoords[3]);
                      break;
                  default:
                      coords=coords.concat(iCoords);
                      break;
            }
        }
        
        minX = minY = bestMinX = bestMinY = 999999;
        maxX = maxY = bestMaxX = bestMaxY = -1;

        for (j = coords.length - 2; j >= 0; j -= 2) {
            curX = parseInt(coords[j], 10);
            curY = parseInt(coords[j + 1], 10);
            if (curX < minX) {
                minX = curX;
                bestMaxY = curY;
            }
            if (curX > maxX) {
                maxX = curX;
                bestMinY = curY;
            }
            if (curY < minY) {
                minY = curY;
                bestMaxX = curX;
            }
            if (curY > maxY) {
                maxY = curY;
                bestMinX = curX;
            }

        }
        // try to figure out the best place for the tooltip
        if (width && height) {
            found=false;
            $.each([[bestMaxX - width, minY - height], [bestMinX, minY - height],
                             [minX - width, bestMaxY - height], [minX - width, bestMinY],
                             [maxX,bestMaxY - height], [ maxX,bestMinY],
                             [bestMaxX - width, maxY], [bestMinX, maxY]
                      ],function (i, e) {
                          if (!found && (e[0] > 0 && e[1] > 0)) {
                              nest = e;
                              found=true;
                              return false;
                  }
             });
             // default to lower-right corner if nothing fit inside the boundaries of the image
             if (!found) {
                 nest=[maxX,maxY];
             }
        }
        return { tl: [minX, minY],
            br: [maxX, maxY],
            tt: nest
        };
    };
} (jQuery));
/* scale.js: resize and zoom functionality
   requires areacorners.js, when.js
*/

// options {
//    padding: n,
//    duration: m,
//}
//
(function ($) {
    var when=$.mapster_when,
        m = $.mapster, u = m.utils, p = m.MapArea.prototype;

    m.utils.getScaleInfo = function (eff, actual) {
        var pct;
        if (!actual) {
            pct = 1;
            actual=eff;
        } else {
            pct = eff.width / actual.width || eff.height / actual.height;
            // make sure a float error doesn't muck us up
            if (pct > 0.98 && pct < 1.02) { pct = 1; }
        }
        return {
            scale: (pct !== 1),
            scalePct: pct,
            realWidth: actual.width,
            realHeight: actual.height,
            width: eff.width,
            height: eff.height,
            ratio: eff.width / eff.height
        };
    };
    // Scale a set of AREAs, return old data as an array of objects
    m.utils.scaleMap = function (image, imageRaw, scale) {
        
        // stunningly, jQuery width can return zero even as width does not, seems to happen only
        // with adBlock or maybe other plugins. These must interfere with onload events somehow.


        var vis=u.size(image),raw=u.size(imageRaw);
        if (!raw.complete) {
            throw("Another script, such as an extension, appears to be interfering with image loading. Please let us know about this.");
        }
        if (!vis.complete) {
            vis=raw;
        }
        return this.getScaleInfo(vis, scale ? raw : null);
    };
    
    // options: duration = animation time (zero = no animation)
    
    m.MapData.prototype.resize = function (newWidth, newHeight, effectDuration, callback) {
        var p,promises,
            highlightId, ratio, width, height, duration, opts = {
            callback: callback || effectDuration
        }, newsize, els, me = this;
        
        function sizeCanvas(canvas, w, h) {
            if ($.mapster.hasCanvas) {
                canvas.width = w;
                canvas.height = h;
            } else {
                $(canvas).width(w);
                $(canvas).height(h);
            }
        }
        function cleanupAndNotify() {

            me.currentAction = '';
            
            if ($.isFunction(opts.callback)) {
                opts.callback();
            }
            
            me.processCommandQueue();
        }
        // handle cleanup after the inner elements are resized
        function finishResize() {
            sizeCanvas(me.overlay_canvas, width, height);

            // restore highlight state if it was highlighted before
            if (opts.highlight && highlightId >= 0) {
                var areaData = me.data[highlightId];
                areaData.tempOptions = { fade: false };
                me.getDataForKey(areaData.key).highlight();
                areaData.tempOptions = null;
            }
            sizeCanvas(me.base_canvas, width, height);
            me.redrawSelections();
            cleanupAndNotify();

        }
        function resizeMapData() {
            $(me.image).css(newsize);
            // start calculation at the same time as effect
            me.scaleInfo = u.getScaleInfo({
                    width: width,
                    height: height
                },
                { 
                    width: me.scaleInfo.realWidth,
                    height: me.scaleInfo.realHeight
                });
            $.each(me.data, function (i, e) {
                $.each(e.areas(), function (i, e) {
                    e.resize();
                });
            });
        }

        
        if (typeof newWidth === 'object') {
            opts = newWidth;
        } else {
            opts.width = newWidth;
            opts.height = newHeight;
            opts.duration = effectDuration || 0;
        }
        width = opts.width;
        height = opts.height;
        duration = opts.duration;

        if (me.scaleInfo.width === width && me.scaleInfo.height === height) {
            return;
        }
        highlightId = me.highlightId;

        
        if (!width) {
            ratio = height / me.scaleInfo.realHeight;
            width = Math.round(me.scaleInfo.realWidth * ratio);
        }
        if (!height) {
            ratio = width / me.scaleInfo.realWidth;
            height = Math.round(me.scaleInfo.realHeight * ratio);
        }

        newsize = { 'width': String(width) + 'px', 'height': String(height) + 'px' };
        if (!$.mapster.hasCanvas) {
            $(me.base_canvas).children().remove();
        }

        // resize all the elements that are part of the map except the image itself (which is not visible)
        // but including the div wrapper
        els = $(me.wrapper).find('.mapster_el').add(me.wrapper);

                if (duration) {
            promises = [];
            me.currentAction = 'resizing';
            els.each(function (i, e) {
                p = when.defer();
                promises.push(p);

                $(e).animate(newsize, {
                    duration: duration,
                    complete: p.resolve,
                    easing: "linear"
                });
            });

            p = when.defer();
            promises.push(p);

            // though resizeMapData is not async, it needs to be finished just the same as the animations,
            // so add it to the "to do" list.
            
            when.all(promises).then(finishResize);
            resizeMapData();
            p.resolve();
        } else {
            els.css(newsize);
            resizeMapData();
            finishResize();
            
        }
    };


    m.MapArea = u.subclass(m.MapArea, function () {
        //change the area tag data if needed
        this.base.init();
        if (this.owner.scaleInfo.scale) {
            this.resize();
        }
    });

    p.coords = function (percent, coordOffset) {
        var j, newCoords = [],
                    pct = percent || this.owner.scaleInfo.scalePct,
                    offset = coordOffset || 0;

        if (pct === 1 && coordOffset === 0) {
            return this.originalCoords;
        }

        for (j = 0; j < this.length; j++) {
            //amount = j % 2 === 0 ? xPct : yPct;
            newCoords.push(Math.round(this.originalCoords[j] * pct) + offset);
        }
        return newCoords;
    };
    p.resize = function () {
        this.area.coords = this.coords().join(',');
    };

    p.reset = function () {
        this.area.coords = this.coords(1).join(',');
    };
    
    m.impl.resize = function (width, height, duration) {
        if (!width && !height) {
            return false;
        }
        var x= (new m.Method(this,
                function () {
                    this.resize(width, height, duration);
                },
                null,
                {
                    name: 'resize',
                    args: arguments
                }
            )).go();
        return x;
    };

    m.impl.zoom = function (key, opts) {
        var options = opts || {};

        function zoom(areaData) {
            // this will be MapData object returned by Method

            var scroll, corners, height, width, ratio,
                    diffX, diffY, ratioX, ratioY, offsetX, offsetY, newWidth, newHeight, scrollLeft, scrollTop,
                    padding = options.padding || 0,
                    scrollBarSize = areaData ? 20 : 0,
                    me = this,
                    zoomOut = false;

            if (areaData) {
                // save original state on first zoom operation
                if (!me.zoomed) {
                    me.zoomed = true;
                    me.preZoomWidth = me.scaleInfo.width;
                    me.preZoomHeight = me.scaleInfo.height;
                    me.zoomedArea = areaData;
                    if (options.scroll) {
                        me.wrapper.css({ overflow: 'auto' });
                    }
                }
                corners = $.mapster.utils.areaCorners(areaData.coords(1, 0));
                width = me.wrapper.innerWidth() - scrollBarSize - padding * 2;
                height = me.wrapper.innerHeight() - scrollBarSize - padding * 2;
                diffX = corners.maxX - corners.minX;
                diffY = corners.maxY - corners.minY;
                ratioX = width / diffX;
                ratioY = height / diffY;
                ratio = Math.min(ratioX, ratioY);
                offsetX = (width - diffX * ratio) / 2;
                offsetY = (height - diffY * ratio) / 2;

                newWidth = me.scaleInfo.realWidth * ratio;
                newHeight = me.scaleInfo.realHeight * ratio;
                scrollLeft = (corners.minX) * ratio - padding - offsetX;
                scrollTop = (corners.minY) * ratio - padding - offsetY;
            } else {
                if (!me.zoomed) {
                    return;
                }
                zoomOut = true;
                newWidth = me.preZoomWidth;
                newHeight = me.preZoomHeight;
                scrollLeft = null;
                scrollTop = null;
            }

            this.resize({
                width: newWidth,
                height: newHeight,
                duration: options.duration,
                scroll: scroll,
                scrollLeft: scrollLeft,
                scrollTop: scrollTop,
                // closure so we can be sure values are correct
                callback: (function () {
                    var isZoomOut = zoomOut,
                            scroll = options.scroll,
                            areaD = areaData;
                    return function () {
                        if (isZoomOut) {
                            me.preZoomWidth = null;
                            me.preZoomHeight = null;
                            me.zoomed = false;
                            me.zoomedArea = false;
                            if (scroll) {
                                me.wrapper.css({ overflow: 'inherit' });
                            }
                        } else {
                            // just to be sure it wasn't canceled & restarted
                            me.zoomedArea = areaD;
                        }
                    };
                } ())
            });
        }
        return (new m.Method(this,
                function (opts) {
                    zoom.call(this);
                },
                function () {
                    zoom.call(this.owner, this);
                },
                {
                    name: 'zoom',
                    args: arguments,
                    first: true,
                    key: key
                }
                )).go();


    };
} (jQuery));
/* tooltip.js - tooltip functionality
   requires areacorners.js
*/

(function ($) {
    var m = $.mapster, u = m.utils;
    $.extend(m.defaults, {
        toolTipContainer: '<div style="border: 2px solid black; background: #EEEEEE; position:absolute; width:160px; padding:4px; margin: 4px; -moz-box-shadow: 3px 3px 5px #535353; ' +
        '-webkit-box-shadow: 3px 3px 5px #535353; box-shadow: 3px 3px 5px #535353; -moz-border-radius: 6px 6px 6px 6px; -webkit-border-radius: 6px; ' +
        'border-radius: 6px 6px 6px 6px;"></div>',
        showToolTip: false,
        toolTipFade: true,
        toolTipClose: ['area-mouseout','image-mouseout'],
        onShowToolTip: null,
        onCreateTooltip: null
    });
    $.extend(m.area_defaults, {
        toolTip: null
    });
    m.MapData.prototype.clearTooltip = function () {
        if (this.activeToolTip) {
            this.activeToolTip.stop().remove();
            this.activeToolTip = null;
            this.activeToolTipID = -1;
        }
        $.each(this._tooltip_events, function (i,e) {
            e.object.unbind(e.event);
        });
    };
    // if callback is passed, it will be used as the event handler and a "true" response closes the tooltip
   m.MapData.prototype.bindTooltipClose = function (option, event, obj, callback) {
        var event_name = event + '.mapster-tooltip', me = this;
        if ($.inArray(option, this.options.toolTipClose) >= 0) {
            obj.unbind(event_name)
                .bind(event_name, function (e) {
                    if (!callback || callback.call(this,e)) {
                        me.clearTooltip();
                    }
                });
            this._tooltip_events.push(
            {
                object: obj, 
                event: event_name,
                callback: callback
            });
        }
    };
    // Show tooltip adjacent to DOM element "area"
    m.AreaData.prototype.showTooltip = function () {
        var offset, tooltip, tooltipCss, corners, areaSrc, container,
                        opts = this.effectiveOptions(),
                        md = this.owner,
                        baseOpts = md.options,
                        template = md.options.toolTipContainer;

        // prevent tooltip from being cleared if it was in progress - area is in the same group

        md.cancelClear=true;
        if (md.activeToolTipID === this.areaId) {

            return;
        }

        if (typeof template === 'string') {
            container = $(template);
        } else {
            container = $(template).clone();
        }

        tooltip = container.html(opts.toolTip).hide();

        md.clearTooltip();

        $('body').append(tooltip);

        md.activeToolTip = tooltip;
        md.activeToolTipID = this.areaId;

        u.setOpacity(tooltip[0], 0);
        tooltip.show();
        areaSrc = this.area ? 
            [this.area] :
            $.map(this.areas(),
                function(e) {
                    return e.area;
                });
        corners = u.areaCorners(areaSrc,
                                tooltip.outerWidth(true),
                                tooltip.outerHeight(true));

        // Try to upper-left align it first, if that doesn't work, change the parameters

        offset = $(md.image).offset();
        tooltipCss = { 
            "left":  offset.left+corners.tt[0] + "px",
            "top": offset.top+corners.tt[1] + "px"
        };

        if (parseInt(tooltip.css("z-index"),10)===0 
            || tooltip.css("z-index") === "auto") {
            tooltipCss["z-index"] = 9999;
        }
        tooltip.css(tooltipCss)
            .addClass('mapster_tooltip');

        md.bindTooltipClose('area-click', 'click', $(md.map));
        md.bindTooltipClose('tooltip-click', 'click', tooltip);
        // not working properly- closes too soon sometimes
        md.bindTooltipClose('image-mouseout', 'mouseout', $(md.image), function(e) {
            return (e.relatedTarget.nodeName!=='AREA' && e.relatedTarget!==this);
        });

        if (md.options.toolTipFade) {
            u.fader(tooltip[0], 0, 1, opts.fadeDuration);
        } else {
            u.setOpacity(tooltip[0], 1);
        }

        //"this" will be null unless they passed something to forArea
        u.ifFunction(baseOpts.onShowToolTip, this.area || null,
        {
            toolTip: tooltip,
            areaOptions: opts,
            key: this.key,
            selected: this.isSelected()
        });

    };
    // key is one of: (string) area key: target the area -- will use the largest
    //                (DOM el/jq) area: target specific area
    //                 any falsy value: close the tooltip

    // or you don't care which is used.
    m.impl.tooltip = function (key) {
        return (new m.Method(this,
        function () {
            this.clearTooltip();
        },
        function () {
            if (this.effectiveOptions().toolTip) {
                this.showTooltip();
            }
        },
        { name: 'tooltip',
            args: arguments,
            key: key
        }
    )).go();
    };
} (jQuery));
