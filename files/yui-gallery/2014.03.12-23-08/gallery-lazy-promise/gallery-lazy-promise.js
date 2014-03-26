YUI.add('gallery-lazy-promise', function (Y, NAME) {

/**
@module gallery-lazy-promise
@author Steven Olmsted
*/
(function (Y) {
    'use strict';

    var _Promise = Y.Promise,

        /**
        A LazyPromise acts just like a Promise with the exception that it won't be
        executed until its `then` method is called.
        @class LazyPromise
        @constructor
        @param {Function} fn A function where to insert the logic that resolves this
        promise.  Receives `fulfill` and `reject` functions as parameters.  This
        function is executed the first time the `then` method is called.
        */
        _Class = function (fn) {
            if (!(this instanceof _Class)) {
                return new _Class(fn);
            }

            /**
            A temporary reference to fn.
            @property _fn
            @type Function
            @protected
            */
            this._fn = fn;
        };

    _Class.prototype = {
        /**
        Returns the current status of the operation.  Possible results are
        'pending', 'fulfilled', and 'rejected'.

        @method getStatus
        @return {String}
        **/
        getStatus: function () {
            var promise = this._promise;
            return promise ? promise.getStatus() : 'pending';
        },
        /**
        Schedule execution of a callback to either or both of `fulfill` and
        `reject` resolutions for this promise.  The callbacks are wrapped in a
        new promise and that promise is returned.  Callbacks are guaranteed to
        be called in a future turn of the event loop.

        @method then
        @param {Function} [callback] function to execute if the lazy promise
        resolves successfully.
        @param {Function} [errback] function to execute if the lazy promise
        resolves unsuccessfully.
        @return {Promise} A promise wrapping the resolution of either the
        `resolve` or `reject` callback.
        **/
        then: function (callback, errback) {
            var me = this,
                promise = me._promise;

            if (!promise) {
                promise = new _Promise(function (fulfill, reject) {
                    /**
                    An internal promise instance.
                    @property _promise
                    @type Promise
                    @protected
                    */
                    me._promise = this;

                    me._fn(fulfill, reject);
                    delete me._fn;
                });
            }

            return promise.then(callback, errback);
        }
    };

    Y.LazyPromise = _Class;
}(Y));

}, 'gallery-2013.05.02-22-59', {"requires": ["promise"]});
