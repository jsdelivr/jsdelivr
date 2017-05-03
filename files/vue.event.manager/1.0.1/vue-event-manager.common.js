/*!
 * vue-event-manager v1.0.1
 * https://github.com/pagekit/vue-event-manager
 * Released under the MIT License.
 */

'use strict';

/**
 * Utility functions.
 */

var isArray = Array.isArray;

function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

function forEach(collection, callback) {
    Object.keys(collection || {}).forEach(function (key) {
        callback.call(null, collection[key], key);
    });
}

/**
 * Array.findIndex() polyfill.
 */
if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {

        value: function value(predicate) {

            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            var o = Object(this);
            var len = o.length >>> 0;
            var thisArg = arguments[1];
            var k = 0;

            while (k < len) {

                var kValue = o[k];

                if (predicate.call(thisArg, kValue, k, o)) {
                    return k;
                }

                k++;
            }

            return -1;
        }

    });
}

/**
 * Event manager class.
 */

var EventManager = function EventManager() {
    this.listeners = {};
};

EventManager.prototype.on = function on (event, callback, priority) {
        var this$1 = this;
        if ( priority === void 0 ) priority = 0;


    var listeners = this.listeners[event] || [], index;

    index = listeners.findIndex(function (listener) { return listener.priority < priority; });

    if (~index) {
        listeners.splice(index, 0, {callback: callback, priority: priority});
    } else {
        listeners.push({callback: callback, priority: priority});
    }

    this.listeners[event] = listeners;

    return function () { return this$1.off(event, callback); };
};

EventManager.prototype.off = function off (event, callback) {

    if (!callback) {
        delete this.listeners[event];
    }

    var listeners = this.listeners[event], index;

    if (listeners && callback) {

        index = listeners.findIndex(function (listener) { return listener.callback === callback; });

        if (~index) {
            listeners.splice(index, 1);
        }
    }
};

EventManager.prototype.trigger = function trigger (event, params, asynch) {
        if ( params === void 0 ) params = [];
        if ( asynch === void 0 ) asynch = false;


    if (!isArray(params)) {
        params = [params];
    }

    return ((this.listeners[event] || []).concat()).reduce(function (result, listener) {

        var callback = function (result) {

            if (result === false) {
                return result;
            }

            if (isArray(result)) {
                params = result;
            }

            return listener.callback.apply(listener.callback, params);
        };

        if (asynch) {
            return result.then(callback);
        }

        return callback(result);

    }, asynch ? Promise.resolve() : undefined);
};

/**
 * Install plugin.
 */

function plugin(Vue) {

    if (plugin.installed) {
        return;
    }

    var Events = new EventManager();

    Vue.mixin({

        init: function init() {
            var this$1 = this;


            var ref = this.$options;
            var events = ref.events;
            var _events = [];

            if (events) {

                forEach(events, function (listeners, event) {
                    forEach(isArray(listeners) ? listeners : [listeners], function (listener) {

                        var priority = 0;

                        if (isObject(listener)) {
                            priority = listener.priority;
                            listener = listener.handler;
                        }

                        _events.push(Events.on(event, listener.bind(this$1), priority));
                    });
                });

                this.$on('hook:beforeDestroy', function () { return _events.forEach(function (off) { return off(); }); });
            }

        }

    });

    Vue.prototype.$events = Events;
    Vue.prototype.$trigger = Events.trigger.bind(Events);
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

module.exports = plugin;
