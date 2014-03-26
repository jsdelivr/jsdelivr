YUI.add('gallery-scroll-beacon', function(Y) {

/**
 * Provides synthetic event to detect beacon element turns into browser viewport.
 *
 * @module scroll-beacon
 */

/**
 * Configurable scroll beacon poll interval in milliseconds.
 *
 * @config Y.config.scrollBeaconInterval
 * @type {Number}
 */
var throttleDelay = Y.config.scrollBeaconInterval || 100,
    EVENT_TYPE = 'beacon:reached';

/**
 * Provides a subscribable event named &quot;beacon:reached&quot;.
 *
 * @event beacon:reached
 * @param type {String} 'beacon:reached'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param o {Object} optional context object
 * @param args 0..n additional arguments that should be provided 
 * to the listener.
 * @return {Event.Handle} the detach handle
 */

Y.Event.define(EVENT_TYPE, {

    _attach: function(node, subscription, notifier, filter) {
        var method = filter ? 'delegate' : 'on';

        if (filter) {
            method = 'delegate';
            if (!Y.Lang.isString(filter)) {
                throw new Error('only string filter is supported');
            }
            subscription._nodeList = node.all(filter);
        } else {
            method = 'on';
            subscription._nodeList = new Y.NodeList(node);
        }

        // 'scroll' and 'resize' event proves to be not good for this case because:
        //  1) 'scroll' might be fired a lot. Then it must be throttled. As a result, sometimes
        //      beacon in & out viewport cannot be detected;
        //  2) Page height & width change doesn't trigger 'scroll' event.
        //
        //  So, let's turn to timer approach.
        //
        subscription['_' + method + 'Handle'] = Y.later(throttleDelay, this, this._checkBeacon, [node, subscription, notifier], true);

        // check it. The beacon might already in viewport.
        this._checkBeacon(node, subscription, notifier);
    },

    _checkBeacon: function(node, subscription, notifier) {
        subscription._nodeList.each(function(targetNode, i) {
            if (Y.DOM.inViewportRegion(Y.Node.getDOMNode(targetNode), false)) {
                if (!subscription._inViewport) {
                    notifier.fire({
                        target: targetNode,
                        currentTarget: node
                    });
                }
                subscription._inViewport = true;
            } else {
                subscription._inViewport = false;
            }
        });
    },

    _detach: function(subscription, method) {
        var handle = subscription['_' + method + 'Handle'];
        if (handle) {
            handle.cancel();
        }
    },

    on: function(node, subscription, notifier) {
        this._attach.apply(this, arguments);
    },

    detach: function(node, subscription) {
        this._detach(subscription, 'on');

    },

    delegate: function(node, subscription, notifier, filter) {
        this._attach.apply(this, arguments);
    },

    detachDelegate: function(node, subscription) {
        this._detach(subscription, 'delegate');
    }
});


}, 'gallery-2012.02.01-21-35' ,{requires:['event','event-custom','event-simulate','node'], skinnable:false});
