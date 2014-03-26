YUI.add('gallery-itsanodepromise', function (Y, NAME) {

'use strict';
/**
 *
 * This module adds some static methods to the Y.Node class that can be used to controll node-availabilities.<br />
 *
 * @module gallery-itsanodepromise
 * @extends Node
 * @class Y.Node
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var YNode = Y.Node,
    Lang = Y.Lang,
    YArray = Y.Array,
    // To check DOMNodeRemoved-event, the browser must support 'mutation events'. To check this:
    supportsMutationEvents = document.implementation.hasFeature("MutationEvents", "2.0"),
    NODECHECK_TIMER = 250, // ms to repeately check for the node's existance. Only for browsers without supportsMutationEvents
    AVAILABLE_AGAIN = 'availableagain',
    UNAVAILABLE_AGAIN = 'unavailableagain',
    CONTENTREADY_AGAIN = 'contentreadyagain';

// To make these 4 methods static, we must declare their functions first and then add them to the prototype.
// We cannot declare the prototypefunctions directly, for it would become instance-methods instead of static.

/**
 * When this method is set for a nodeid, then the node will fire the next events over and over again:
 * <ul>
 *    <li>availableagain</li>
 *    <li>contentreadyagain</li>
 *    <li>unavailableagain</li>
 * </ul>
 * The reason why you need to subscribe all node you want, is because the 'unavailable'-event isn't supported by all browsers. For browsers who
 * don't support this event (IE<9), a timer will check its unavailability. This has a performance-hit.
 * <br />
 * <br />
 * <b>Important notes:</b>
 * <br />
 * 1. Use this method with care! Once called, you introduce dom-monitoring which causes a true performancehit.
 * 2. Only nodes that are re-inserted as a String have these events multiple times. Y.Node instances that are inserted are <u>not affected</u>
 *
 * @method fireAvailabilities
 * @static
 * @param nodeid {String} Node-selector by id. You must include the #
 * @since 0.2
*/
YNode.fireAvailabilities = function(nodeid) {
    /**
      * Fired when node gets available again. The same as the 'available'-event except that availableagain repeats fireing when the node
      * gets inserted into the dom multiple times.
      *
      * @event Y.availableagain
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.Node} the targetnode
      * @param e.type {String} eventtype
      *
    **/
    /**
      * Fired when node gets contentready again. The same as the 'contentready'-event except that availableagain repeats fireing when the node
      * gets inserted into the dom multiple times.
      *
      * @event Y.contentreadyagain
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.Node} the targetnode
      * @param e.type {String} eventtype
      *
    **/
    /**
      * Fired when node gets unavailable again. The unavailableagain repeats fireing every time the node gets removed from the dom.
      *
      * @event Y.unavailableagain
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.Node} the targetnode
      * @param e.type {String} eventtype
      *
    **/
    var instance = this,
        loopingEvents;

    if (!instance._loopingEvents) {
        instance._loopingEvents = {};
    }
    loopingEvents = instance._loopingEvents;
    if (!loopingEvents[nodeid]) {
        // creating looping-events for this nodeid
        loopingEvents[nodeid] = function() {
            instance.availablePromise(nodeid).then(
                function(node) {
                    Y.fire(AVAILABLE_AGAIN, {target: node, type: AVAILABLE_AGAIN});
                    instance.unavailablePromise(nodeid).then(
                        function(node) {
                            Y.fire(UNAVAILABLE_AGAIN, {target: node, type: UNAVAILABLE_AGAIN});
                            loopingEvents[nodeid]();
                        }
                    );
                }
            );
            instance.contentreadyPromise(nodeid).then(
                function(node) {
                    Y.fire(CONTENTREADY_AGAIN, {target: node, type: CONTENTREADY_AGAIN});
                }
            );
        };
        // calling for the first time = initialize:
        loopingEvents[nodeid]();
    }
};

/**
 * Promise that will be resolved once a node is available in the DOM.
 * Exactly the same as when listened to Y.on('available'), except you get a Promise in return.
 *
 * @method availablePromise
 * @static
 * @param selector {String} Node-selector
 * @param [timeout] {int} Timeout in ms, after which the promise will be rejected.
 *         If omitted, the Promise will never be rejected and can only be fulfilled once the node is available.
 * @return {Y.Promise} promised response --> resolve(Y.Node) OR reject(reason).
 * @since 0.1
*/
YNode.availablePromise = function (selector, timeout) {
    var instance = this;
    return new Y.Promise(function (resolve, reject) {
        var resolved = false,
            subscription = Y.once('available', function () {
                resolve(Y.one(selector));
                resolved = true;
/*jshint expr:true */
                timer && timer.cancel();
/*jshint expr:false */
            }, selector),
            timer = timeout && Y.later(timeout, null, function () {
                if (!resolved) {
                    reject(new Error(selector + ' was not available within ' + timeout + ' ms'));
                    subscription.detach.call(instance);
                }
            });
    });
};

/**
 * Promise that will be resolved once a node's content is ready.
 * Exactly the same as when listened to Y.on('contentready'), except you get a Promise in return.
 *
 * @method contentreadyPromise
 * @static
 * @param selector {String} Node-selector.
 * @param [timeout] {int} Timeout in ms, after which the promise will be rejected.
 *         If omitted, the Promise will never be rejected and can only be fulfilled once the node's content is ready.
 * @return {Y.Promise} promised response --> resolve(Y.Node) OR reject(reason).
 * @since 0.1
*/
YNode.contentreadyPromise = function(selector, timeout) {
    var instance = this;
    return new Y.Promise(function (resolve, reject) {
        var resolved = false,
            subscription = Y.once('available', function () {
                resolve(Y.one(selector));
                resolved = true;
/*jshint expr:true */
                timer && timer.cancel();
/*jshint expr:false */
            }, selector),
            timer = timeout && Y.later(timeout, null, function () {
                if (!resolved) {
                    reject(new Error(selector + ' was not ready within ' + timeout + ' ms'));
                    subscription.detach.call(instance);
                }
            });
    });
};

/**
 * Hides the node using a transition.
 * Animates the hiding of the node using either the default
 * transition effect ('fadeOut'), or the given named effect.
 * @method hidePromise
 * @param {String} name A named Transition effect to use as the show effect.
 * @param {Object} config Options to use with the transition.
 * @return {Y.Promise} resolved promise when ready hiding, returning the Node-instance in the promise-callback --> resolve(node)
 */
/**
 * Shows the node using a transition.
 * Animates the showing of the node using either the default
 * transition effect ('fadeIn'), or the given named effect.
 * @method hidePromise
 * @param {String} name A named Transition effect to use as the show effect.
 * @param {Object} config Options to use with the transition.
 * @return {Y.Promise} resolved promise when ready showing, returning the Node-instance in the promise-callback --> resolve(node)
 */
YArray.each(
    ['show', 'hide'],
    function(type) {
        YNode.prototype[type+'Promise'] = function (name, config) {
            var instance = this;
/*jshint expr:true */
            Lang.isObject(name) && (config=name) && (name=null) && console.log('reshift name to config');
            config && (!config.duration || (config.duration===0)) && (config=null) && console.log('making config null');
/*jshint expr:false */
            return Y.usePromise('transition').then(
                function() {
                    return new Y.Promise(function (resolve) {
                        instance[type](name || true, config, function() {
                            instance.setStyle('opacity', (type==='hide') ? 0 : 1);
                            resolve(instance);
                        });
                    });
                },
                function(err) {
                    Y.soon(function () {
                        throw err;
                    });
                }
            );
        };
    }
);

/**
 * Promise that will be resolved once a node is NOT in the DOM.
 * That is, when it is not in the DOM already, or when it is removed (using the 'DOMNodeRemoved'-event).
 * <br />
 * <b>Cautious:</b>Once called, you introduce a true performancehit until the promise gets fulfilled.
 *
 * @method unavailablePromise
 * @static
 * @param nodeid {String} Node-selector by id. You must include the #
 * @param [options] {object}
 * @param [options.afteravailable=false] {Boolean} Only fulfills after the node is first available and then gets unavailable again.
 *                          This is usefull to get an unavailablePromise but the node has to be inserted in the dom first.
 * @param [options.timeout] {int} Timeout in ms, after which the promise will be rejected.
 *                          If omitted, the Promise will never be rejected and can only be fulfilled once the node is removed.
 * @param [options.intervalNonNative] {int} Interval in ms, for checking the node's removal in browsers that don't support supportsMutationEvents.
 *                          If omitted, the Interval is set to 250ms.
 * @return {Y.Promise} promised response --> resolve(nodeid {String}) OR reject(reason)
 * @since 0.1
*/
YNode.unavailablePromise = function(nodeid, options) {
    var instance = this,
        optionsWithoutAfterAvailable, promise;

    options = options || {};
    if (options.afteravailable) {
        optionsWithoutAfterAvailable = Y.merge(options);
        delete optionsWithoutAfterAvailable.afteravailable;
        return this.availablePromise(nodeid, options.timeout).then(
            Y.bind(instance.unavailablePromise, instance, nodeid, optionsWithoutAfterAvailable)
        );
    }
    else {
        promise = new Y.Promise(function (resolve, reject) {
            var continousNodeCheck, unavailableListener,
                timeout = options && options.timeout,
                intervalNonNative = options && options.intervalNonNative;
            if (!Y.one(nodeid)) {
                resolve(nodeid);
            }
            else {
                if (supportsMutationEvents) {
                    unavailableListener = Y.after(
                        'DOMNodeRemoved',
                        function() {
                            // Even if supportsMutationEvents exists, a parentnode could be removed by which the
                            // eventlistener doesn't catch the removal of nodeid. Therefore we always need to check with Y.one
                            // We need to check asynchroniously for node's existance --> otherwise Y.one() reutrns true even is node is removed!
                            Y.soon(
                                function() {
                                    if (!Y.one(nodeid)) {
                                        unavailableListener.detach();
                                        resolve(nodeid);
                                    }
                                }
                            );
                        }
                    );
                }
                // now support for MutationEvents (IE<9) --> we need to check by timer continiously
                else {
                    continousNodeCheck = Y.later(intervalNonNative || NODECHECK_TIMER, null, function() {
                        if (!Y.one(nodeid)) {
                            continousNodeCheck.cancel();
                            resolve(nodeid);
                        }
                    }, null, true);
                }
                if (timeout) {
                    Y.later(timeout, null, function() {
                        var errormessage = 'node ' + nodeid + ' was not removed within ' + timeout + ' ms';
                        // if no MutationEvents are supported, then do a final check for the nodes existance
                        if (!supportsMutationEvents && !Y.one(nodeid)) {
                            resolve(nodeid);
                        }
                        else {
                            reject(new Error(errormessage));
                        }
/*jshint expr:true */
                        unavailableListener && (promise.getStatus()==='pending') && unavailableListener.detach();
/*jshint expr:false */
                    });
                }
            }
        });
        return promise;
    }
};

// Adding support for the DONNodeRemoved event if browser supports it:
if (supportsMutationEvents) {
    Y.mix(Y.Node.DOM_EVENTS, {
        DOMNodeRemoved: true
    });
}

Y.Node.prototype.availablePromise = YNode.availablePromise;
Y.Node.prototype.contentreadyPromise = YNode.contentreadyPromise;
Y.Node.prototype.unavailablePromise = YNode.unavailablePromise;

}, '@VERSION@', {
    "requires": [
        "yui-base",
        "yui-later",
        "event-base",
        "event-custom",
        "node-base",
        "node-style",
        "timers",
        "promise",
        "gallery-itsamodulesloadedpromise"
    ]
});
