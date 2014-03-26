YUI.add('gallery-deferred', function(Y) {

/**
Wraps the execution of synchronous or asynchronous operations, providing a
promise object that can be used to subscribe to the various ways the operation
may terminate.

When the operation completes successfully, call the Deferred's `resolve()`
method, passing any relevant response data for subscribers.  If the operation
encounters an error or is unsuccessful in some way, call `reject()`, again
passing any relevant data for subscribers.

The Deferred object should be shared only with the code resposible for
resolving or rejecting it. Public access for the Deferred is through its
_promise_, which is returned from the Deferred's `promise()` method. While both
Deferred and promise allow subscriptions to the Deferred's state changes, the
promise may be exposed to non-controlling code. It is the preferable interface
for adding subscriptions.

Subscribe to state changes in the Deferred with the promise's
`then(callback, errback)` method.  `then()` wraps the passed callbacks in a
new Deferred and returns the corresponding promise, allowing chaining of
asynchronous or synchronous operations. E.g.
`promise.then(someAsyncFunc).then(anotherAsyncFunc)`

@module deferred
@since 3.7.0
**/
var slice   = [].slice,
    isArray = Y.Lang.isArray;
    
/**
Represents an operation that may be synchronous or asynchronous.  Provides a
standard API for subscribing to the moment that the operation completes either
successfully (`resolve()`) or unsuccessfully (`reject()`).

@class Deferred
@constructor
**/
function Deferred() {
    this._subs = {
        resolve: [],
        reject : []
    };

    this._promise = new Y.Promise(this);

    this._status = 'in progress';

}

Y.mix(Deferred.prototype, {
    /**
    Returns the promise for this Deferred.

    @method promise
    @return {Promise}
    **/
    promise: function (obj) {
        return Y.Lang.isObject(obj) ? Y.mix(obj, this._promise, true) : this._promise;
    },

    /**
    Resolves the Deferred, signaling successful completion of the
    represented operation. All "resolve" subscriptions are executed with
    all arguments passed in. Future "resolve" subscriptions will be
    executed immediately with the same arguments. `reject()` and `notify()`
    are disabled.

    @method resolve
    @param {Any} arg* Any data to pass along to the "resolve" subscribers
    @return {Deferred} the instance
    @chainable
    **/
    resolve: function () {
        this._result = slice.call(arguments);

        this._notify(this._subs.resolve, this.promise(), this._result);

        this._subs = { resolve: [] };

        this._status = 'resolved';

        return this;
    },

    /**
    Resolves the Deferred, signaling *un*successful completion of the
    represented operation. All "reject" subscriptions are executed with
    all arguments passed in. Future "reject" subscriptions will be
    executed immediately with the same arguments. `resolve()` and `notify()`
    are disabled.

    @method reject
    @param {Any} arg* Any data to pass along to the "reject" subscribers
    @return {Deferred} the instance
    @chainable
    **/
    reject: function () {
        this._result = slice.call(arguments);

        this._notify(this._subs.reject, this.promise(), this._result);

        this._subs = { reject: [] };

        this._status = 'rejected';

        return this;
    },

    /**
    Schedule execution of a callback to either or both of "resolve" and
    "reject" resolutions for the Deferred.  The callbacks
    are wrapped in a new Deferred and that Deferred's corresponding promise
    is returned.  This allows operation chaining ala
    `functionA().then(functionB).then(functionC)` where `functionA` returns
    a promise, and `functionB` and `functionC` _may_ return promises.

    @method then
    @param {Function} [callback] function to execute if the Deferred
                resolves successfully
    @param {Function} [errback] function to execute if the Deferred
                resolves unsuccessfully
    @return {Promise} The promise of a new Deferred wrapping the resolution
                of either "resolve" or "reject" callback
    **/
    then: function (callback, errback) {
        var then    = new Y.Deferred(),
            promise = this.promise(),
            resolveSubs = this._subs.resolve || [],
            rejectSubs  = this._subs.reject  || [];

        function wrap(fn, method) {
            return function () {
                var args = slice.call(arguments);

                // Wrapping all callbacks in setTimeout to guarantee
                // asynchronicity. Because setTimeout can cause unnecessary
                // delays that *can* become noticeable in some situations
                // (especially in Node.js), I'm using Y.soon if available.
                // As of today, Y.soon is only available in the gallery as
                // gallery-soon, but maybe it could get promoted to core?
                (Y.soon || setTimeout)(function () {
                    var result = fn.apply(promise, args),
                        resultPromise;

                    if (result && typeof result.promise === 'function') {
                        resultPromise = result.promise();

                        if (resultPromise.getStatus() !== 'in progress') {
                            then[method].apply(then, resultPromise.getResult());
                        } else {
                            result.promise().then(
                                Y.bind(then.resolve, then), // callback
                                Y.bind(then.reject, then)); // errback
                        }
                    } else {
                        then[method].apply(then,
                            (isArray(result) ? result : [result]));
                    }
                }, 0);
            };
        }

        resolveSubs.push((typeof callback === 'function') ?
            wrap(callback, 'resolve') : Y.bind('resolve', then));

        rejectSubs.push((typeof errback === 'function') ?
            wrap(errback, 'reject') : Y.bind('reject', then));

        if (this._status === 'resolved') {
            this.resolve.apply(this, this._result);
        } else if (this._status === 'rejected') {
            this.reject.apply(this, this._result);
        }

        resolveSubs = rejectSubs = null;

        return then.promise();
    },

    /**
    Returns the current status of the Deferred as a string "in progress",
    "resolved", or "rejected".

    @method getStatus
    @return {String}
    **/
    getStatus: function () {
        return this._status;
    },

    /**
    Returns the result of the Deferred.  Use `getStatus()` to test that the
    promise is resolved before calling this.

    @method getResult
    @return {Any[]} Array of values passed to `resolve()` or `reject()`
    **/
    getResult: function () {
        return this._result;
    },

    /**
    Executes an array of callbacks from a specified context, passing a set of
    arguments.

    @method _notify
    @param {Function[]} subs The array of subscriber callbacks
    @param {Object} context The `this` object for the callbacks
    @param {Any[]} args Any arguments to pass the callbacks
    @protected
    **/
    _notify: function (subs, context, args) {
        var i, len;

        if (subs) {
            for (i = 0, len = subs.length; i < len; ++i) {
                subs[i].apply(context, args);
            }
        }
    }

}, true);

Y.Deferred = Deferred;
/**
The public API for a Deferred.  Used to subscribe to the notification events for
resolution or progress of the operation represented by the Deferred.

@class Promise
@constructor
@param {Deferred} deferred The Deferred object that the promise represents
**/
function Promise(deferred) {
    var self = this;
    Y.Array.each(['then', 'promise', 'getStatus', 'getResult'], function (method) {
        self[method] = function () {
            return deferred[method].apply(deferred, arguments);
        };
    });
}
/**
Schedule execution of a callback to either or both of "resolve" and
"reject" resolutions for the associated Deferred.  The callbacks
are wrapped in a new Deferred and that Deferred's corresponding promise
is returned.  This allows operation chaining ala
`functionA().then(functionB).then(functionC)` where `functionA` returns
a promise, and `functionB` and `functionC` _may_ return promises.

@method then
@param {Function} [callback] function to execute if the Deferred
            resolves successfully
@param {Function} [errback] function to execute if the Deferred
            resolves unsuccessfully
@return {Promise} The promise of a new Deferred wrapping the resolution
            of either "resolve" or "reject" callback
**/

/**
Returns this promise.  Meta, or narcissistic?  Useful to test if an object
is a Deferred or Promise when the intention is to call its `then()`,
`getStatus()`, or `getResult()` method.

@method promise
@return {Promise} This.
**/

/**
Returns the current status of the Deferred. Possible results are
"in progress", "resolved", and "rejected".

@method getStatus
@return {String}
**/

/**
Returns the result of the Deferred.  Use `getStatus()` to test that the
promise is resolved before calling this.

@method getResult
@return {Any[]} Array of values passed to `resolve()` or `reject()`
**/

Y.Promise = Promise;

/**
 * Returns a promise for a (possibly) asynchronous call.
 * Calls a given function that receives the new promise as parameter and must call resolve()
 * or reject() at a certain point
 * @method defer
 * @param {Function} fn A function that encloses an async call.
 * @return {Promise} a promise
 * @static
 * @for YUI
 */
Y.defer = function (fn, context) {
	var deferred = new Y.Deferred();
	fn(deferred);
	return deferred.promise();
};

/**
Adds a `Y.when()` method to wrap any number of callbacks or promises in a
Y.Deferred, and return the associated promise that will resolve when all
callbacks and/or promises have completed.  Each callback is passed a Y.Deferred
that it must `resolve()` when it completes.

@module deferred
@submodule deferred-when
**/

/**
Wraps any number of callbacks in a Y.Deferred, and returns the associated
promise that will resolve when all callbacks have completed.  Each callback is
passed a Y.Deferred that it must `resolve()` when that callback completes.

@for YUI
@method when
@param {Function|Promise} operation* Any number of functions or Y.Promise
            objects
@return {Promise}
**/
Y.when = function () {
    var funcs     = slice.call(arguments),
        allDone   = new Y.Deferred(),
        failed    = Y.bind('reject', allDone),
        remaining = funcs.length,
        results   = [];

    function oneDone(i) {
        return function () {
            var args = slice.call(arguments);

            results[i] = args.length > 1 ? args : args[0];

            remaining--;

            if (!remaining && allDone.getStatus() !== 'rejected') {
                allDone.resolve.apply(allDone, results);
            }
        };
    }

    Y.Array.each(funcs, function (fn, i) {
        var finished = oneDone(i),
            deferred;

        // accept promises as well as functions
        if (typeof fn === 'function') {
            deferred = new Y.Deferred();
        
            deferred.then(finished, failed);
            
            // It's up to each passed function to resolve/reject the deferred
            // that is assigned to it.
            fn.call(Y, deferred);

        } else if (fn && typeof fn.then === 'function') {
            fn.then(finished, failed);
        } else {
            remaining--;
            results[i] = fn;
        }
    });

    funcs = null;

    // For some crazy reason, only values, not functions or promises were passed
    // in, so we're done already.
    if (!remaining) {
        allDone.resolve.apply(allDone, results);
    }

    return allDone.promise();
};

/**
A deferred plugin for Node that has methods for dealing with asynchronous calls such as transition()
@class Plugin.NodeDeferred
@constructor
@extends Promise
@param {Object} config An object literal containing plugin configuration
*/
function NodeDeferred(config) {
    this.host = config.host;
    this._config = config;
}
NodeDeferred.prototype.then = function (successFn) {
    return new Y.Deferred().resolve().then(successFn).promise();
};

Y.mix(NodeDeferred, {
    /**
    Plugin namespace
    @property {String} NS
    @default 'deferred'
    @static
    */
    NS: 'deferred',
    
    /**
    Imports a method from Y.Node so that they return instances of this same plugin representing promises
    @method deferMethod
    @param {String} method Name of the method to import from Y.Node
    @static
    */
    deferMethod: function (method) {
        NodeDeferred.prototype[method] = function () {
            var host = this.host,
                args = slice.call(arguments),
                callback,
                next;

            if (typeof args[args.length - 1] === 'function') {
                callback = args.pop();
            }

            next = this.then(function () {
                var deferred = new Y.Deferred();

                host[method].apply(host, args.concat([function () {
                    deferred.resolve.apply(deferred, arguments);
                }]));

                return callback ? deferred.then(callback) : deferred.promise();
            });

            return next.promise(new this.constructor(this._config));
        };
    },
    /**
    Imports a method from Y.Node making it chainable but not returning promises
    @method importMethod
    @param {String} method Name of the method to import from Y.Node
    @static
    */
    importMethod: function(method) {
        NodeDeferred.prototype[method] = function () {
            var args = arguments,
                host = this.host;
            return this.then(function () {
                host[method].apply(host, args);
            });
        };
    }
});

/**
Deferred version of the Node method
@method hide
@return {NodeDeferred}
*/
/**
Deferred version of the Node method
@method load
@return {NodeDeferred}
 */
/**
Deferred version of the Node method
@method show
@return {NodeDeferred}
 */
/**
Deferred version of the Node method
@method transition
@return {NodeDeferred}
 */
/**
Deferred version of the Node method
@method once
@return {NodeDeferred}
 */
/**
Deferred version of the Node method
@method onceAfter
@return {NodeDeferred}
 */
Y.Array.each(['hide', 'load', 'show', 'transition', 'once', 'onceAfter'], NodeDeferred.deferMethod);
/**
Same as the Node method 
@method addClass
@chainable
 */
/**
Same as the Node method 
@method append
@chainable
 */
/**
Same as the Node method 
@method appendTo
@chainable
 */
/**
Same as the Node method 
@method blur
@chainable
 */
/**
Same as the Node method 
@method clearData
@chainable
 */
/**
Same as the Node method 
@method destroy
@chainable
 */
/**
Same as the Node method 
@method empty
@chainable
 */
/**
Same as the Node method 
@method focus
@chainable
 */
/**
Same as the Node method 
@method insert
@chainable
 */
Y.Array.each(['addClass', 'append', 'appendTo', 'blur', 'clearData', 'destroy', 'empty', 'focus', 'insert',
/**
Same as the Node method 
@method insertBefore
@chainable
 */
/**
Same as the Node method 
@method prepend
@chainable
 */
/**
Same as the Node method 
@method remove
@chainable
 */
/**
Same as the Node method 
@method removeAttribute
@chainable
 */
/**
Same as the Node method 
@method removeChild
@chainable
 */
/**
Same as the Node method 
@method removeClass
@chainable
 */
/**
Same as the Node method 
@method replaceChild
@chainable
 */
    'insertBefore', 'prepend', 'remove', 'removeAttribute', 'removeChild', 'removeClass', 'replaceChild',
/**
Same as the Node method 
@method replaceClass
@chainable
 */
/**
Same as the Node method 
@method select
@chainable
 */
/**
Same as the Node method 
@method set
@chainable
 */
/**
Same as the Node method 
@method setAttrs
@chainable
 */
/**
Same as the Node method 
@method setContent
@chainable
 */
/**
Same as the Node method 
@method setData
@chainable
 */
/**
Same as the Node method 
@method setStyle
@chainable
 */
/**
Same as the Node method 
@method setStyles
@chainable
 */
    'replaceClass', 'select', 'set', 'setAttrs', 'setContent', 'setData', 'setStyle', 'setStyles', 
/**
Same as the Node method 
@method setX
@chainable
 */
/**
Same as the Node method 
@method setXY
@chainable
 */
/**
Same as the Node method 
@method setY
@chainable
 */
/**
Same as the Node method 
@method simulate
@chainable
 */
/**
Same as the Node method 
@method swapXY
@chainable
 */
/**
Same as the Node method 
@method toggleClass
@chainable
 */
/**
Same as the Node method 
@method wrap
@chainable
 */
/**
Same as the Node method 
@method unwrap
@chainable
 */
    'setX', 'setXY', 'setY', 'simulate', 'swapXY', 'toggleClass', 'wrap', 'unwrap'], NodeDeferred.importMethod);

if (Y.Node && Y.Plugin) {    
    Y.Plugin.NodeDeferred = NodeDeferred;
}

/**
Represents the promise of an IO transaction being completed
@class Transaction
@constructor
@extends Promise
*/
function Transaction() {
}

Transaction.NAME = 'transaction';


/**
Makes a new GET HTTP request
@method get
@param {String} uri Path to the request resource
@param {Function|Object} config Either a callback for the complete event or a full configuration option
@chainable
*/
/**
Makes a new POST HTTP request
@method post
@param {String} uri Path to the request resource
@param {Function|Object} config Either a callback for the complete event or a full configuration option
@chainable
*/
/**
Makes a new POST HTTP request sending the content of a form
@method postForm
@param {String} uri Path to the request resource
@param {String} id The id of the form to serialize and send in the request
@param {Function|Object} config Either a callback for the complete event or a full configuration option
@chainable
*/
/**
Makes a new GET HTTP request and parses the result as JSON data
@method getJSON
@param {String} uri Path to the request resource
@param {Function|Object} config Either a callback for the complete event or a full configuration option
@chainable
*/
/**
Makes a new JSONP request
@method jsonp
@param {String} uri Path to the jsonp service
@param {Function|Object} config Either a callback for the complete event or a full configuration option
@chainable
*/
if (Y.io) {

    Y.Transaction = Transaction;

    Y.mix(Y.io, {
        
        /**
        Utility function for normalizing an IO configuration object.
        If a function is providad instead of a configuration object, the function is used
        as a 'complete' event handler.
        @method _normalizeConfig
        @for io
        @private
        @static
        */
        _normalizeConfig: function (config, args) {
            if (Y.Lang.isFunction(config)) {
                config = { on: { complete: config } };
            } else {
                config = config || {};
                config.on = config.on || {};
            }
            return Y.merge(config, args);
        },
        /**
        Takes an object with "success" and "failure" properties, such as one
        from a IO configuration, and registers those callbacks as promise handlers
        @method _eventsToCallbacks
        @for io
        @private
        @static  
        @param {Transaction} request
        @param {Object} Object with "success" and/or "failure" properties
        */
        _eventsToCallbacks: function (promise, events) {
            if (events.success || events.failure) {
                promise = promise.then(events.success, events.failure);
            }
            if (events.complete) {
                promise = promise.then(events.complete, events.complete);
            }
            return promise;
        },

        /**
        Add a deferred function to Y.io and add it as a method of Y.Transaction
        @method addMethod
        @for io
        @static
        @param {String} name Name of the method
        @param {Function} fn Method
        */
        addMethod: function (name, fn) {
            Y.io[name] = fn;
            Transaction.prototype[name] = fn;
        },
        
        /**
        Adds multiple methods to Y.io and Y.Transaction from an object
        @method addMethods
        @for io
        @static
        @param {Obejct} methods Key/value pairs of names and functions
        */
        addMethods: function (methods) {
            Y.Object.each(methods, function (fn, name) {
                Y.io.addMethod(name, fn);
            });
        },
        then: function (fn) {
            return new Y.Deferred().resolve().then(fn).promise(new Y.Transaction());
        }
    });

    Y.io.addMethods({
        /**
        Makes an IO request and returns a new Transaction object for it.
        It also normalizes callbacks as event handlers with an EventFacade
        @method _deferIO
        @for io
        @private
        @static
        */
        _deferIO: function (uri, config) {
            var deferred = new Y.Deferred(),
                self = this,
                on = config.on,
                next;

            config.on = {
                success: function (id, response) {
                    if (config.parser) {
                        try {
                            response.data = config.parser(response.responseText);
                        } catch (e) {
                            deferred.reject.apply(deferred, arguments);
                            return;
                        }
                    }
                    deferred.resolve.apply(deferred, arguments);
                },
                failure: function () {
                    deferred.reject.apply(deferred, arguments);
                }
            };

            next = this.then(function () {
                var xhr = Y.io(uri, config),
                    promise = deferred.promise(new self.constructor());

                promise.abort = function () {
                    if (xhr) {
                        xhr.abort();
                    }
                    deferred.reject.apply(deferred, arguments);
                };

                return promise;
            });

            if (on) {
                next = Y.io._eventsToCallbacks(next, on);
            }

            return next.promise(new Y.Transaction());
        },
        /**
        Normalizes the Y.Get API so that it looks the same to the Y.io methods
        @method _deferGet
        @param {String} 
        @for io
        @private
        @static
        */
        _deferGet: function (method, uri, config) {
            var callback,
                next;

            if (Y.Lang.isFunction(config)) {
                callback = config;
                config = {};
            }
            if (!config) {
                config = {};
            }

            next = this.then(function () {
                var deferred = new Y.Deferred();

                Y.Get[method](uri, config, function (err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve();
                    }
                });
                return deferred.promise();
            });

            if (callback) {
                next = next.then(callback, callback);
            }
            if (config.on) {
                next = Y.io._eventsToCallbacks(next, config.on);
            }

            return next.promise(new Y.Transaction());
        },
        
        /**
        Makes a new GET HTTP request
        @method get
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        @for io
        @static
        */
        get: function (uri, config) {
            return this._deferIO(uri, Y.io._normalizeConfig(config, {
                method: 'GET'
            }));
        },
        
        /**
        Makes a new POST HTTP request
        @method post
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        @for io
        @static
        */
        post: function (uri, data, config) {
            return this._deferIO(uri, Y.io._normalizeConfig(config, {
                method: 'POST',
                data: data
            }));
        },

        /**
        Makes a new PUT HTTP request
        @method put
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        @for io
        @static
        */
        put: function (uri, data, config) {
            return this._deferIO(uri, Y.io._normalizeConfig(config, {
                method: 'PUT',
                data: data
            }));
        },

        /**
        Makes a new DELETE HTTP request
        @method del
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        @for io
        @static
        */
        del: function (uri, data, config) {
            return this._deferIO(uri, Y.io._normalizeConfig(config, {
                method: 'DELETE',
                data: data
            }));
        },
        
        /**
        Makes a new POST HTTP request sending the content of a form
        @method postForm
        @for io
        @static
        @param {String} uri Path to the request resource
        @param {String} id The id of the form to serialize and send in the request
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        */
        postForm: function (uri, id, config) {
            return this._deferIO(uri, Y.io._normalizeConfig(config, {
                method: 'POST',
                form: { id: id }
            }));
        },
        /**
        Alias for Y.io.js
        @method script
        @for io
        @static
        */
        script: function () {
            return this.js.apply(this, arguments);
        },
        /**
        Loads a script through Y.Get.script
        All its options persist, but it also accepts an "on" object
        with "success" and "failure" properties like the rest of the Y.io methods
        @method js
        @for io
        @static
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        */
        js: function (uri, config) {
            return this._deferGet('js', uri, config);
        },
        /**
        Loads a stylesheet through Y.Get.css
        All its options persist, but it also accepts an "on" object
        with "success" and "failure" properties like the rest of the Y.io methods
        @method css
        @for io
        @static
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        */
        css: function (uri, config) {
            return this._deferGet('css', uri, config);
        }
    });
    
    if (Y.JSON) {
        /**
        Makes a new GET HTTP request and parses the result as JSON data
        @method getJSON
        @for io
        @static
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        */
        Y.io.addMethod('getJSON', function (uri, config) {
            config = Y.io._normalizeConfig(config);
            config.parser = Y.JSON.parse;
            
            return this._deferIO(uri, config);
        });
    }

    if (Y.jsonp) {
        /**
        Makes a new JSONP request
        @method jsonp
        @for io
        @static
        @param {String} uri Path to the jsonp service
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        */
        Y.io.addMethod('jsonp', function (uri, config) {
            var on, next;
            config = Y.io._normalizeConfig(config);

            on = config.on;

            next = this.then(function () {
                var deferred = new Y.Deferred(),
                    failFn = function () {
                        deferred.reject.apply(deferred, arguments);
                    };
                
                config.on = {
                    success: function (id, response) {
                        deferred.resolve.apply(deferred, arguments);
                    },
                    failure: failFn,
                    timeout: failFn
                };
                
                Y.jsonp(uri, config);

                return deferred.promise();
            });

            if (on) {
                next = Y.io._eventsToCallbacks(next, on);
            }

            return next.promise(new Y.Transaction());
        });
    }
}


}, 'gallery-2012.10.17-20-00' ,{optional:['node','plugin','node-load','transition','io-base','json','jsonp']});
