YUI.add('gallery-delay', function (Y, NAME) {

/**
Create a function that doesn't execute immediately when it is called.
@module gallery-delay
@author solmsted
*/
(function (Y) {
    'use strict';

    var _Promise = Y.Promise,

        _later = Y.later,
        _soon = Y.soon;

    /**
    Pass in a callback function and the amount of time to delay.  Y.delay will
    return a function that will wait an amount of time, then call your callback
    function.  The arguments and execution context of the returned function will
    be passed to the callback function.  The returned function returns a promise
    for the return value of the callback function.  This promise comes with a
    cancel method which will prevent the execution of the callback function if
    called before the callback function is called.  If the amount of time to
    delay is 0, the delay will be as small as possible but your callback
    function will be guaranteed to be called in a future turn of the event loop.
    @for YUI
    @method delay
    @param {Function} callbackFunction The function to delay.
    @param {Number} [delayAmount=0] The approximate amount of time to delay in
    milliseconds.
    @return {Function}
    */
    Y.delay = function (callbackFunction, delayAmount) {
        if (!delayAmount) {
            return function () {
                var args = arguments,
                    me = this;

                return new _Promise(function (fulfill) {
                    this.cancel = _soon(function () {
                        fulfill(callbackFunction.apply(me, args));
                    }).cancel;
                });
            };
        }

        return function () {
            var args = arguments,
                me = this;

            return new _Promise(function (fulfill) {
                this.cancel = _later(delayAmount, null, function () {
                    fulfill(callbackFunction.apply(me, args));
                }).cancel;
            });
        };
    };
}(Y));

}, 'gallery-2013.05.29-23-38', {"requires": ["promise", "yui-later"]});
