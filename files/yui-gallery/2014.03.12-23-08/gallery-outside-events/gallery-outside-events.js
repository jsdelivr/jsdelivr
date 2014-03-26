YUI.add('gallery-outside-events', function(Y) {

/**
 * Outside events are synthetic DOM events that fire when a corresponding native
 * or synthetic DOM event occurs outside a bound element.
 *
 * Many common outside events are pre-defined, and new outside events are cinch
 * to define.
 *
 * @module gallery-outside-events
 */

// Outside events are pre-defined for each of these native DOM events
var nativeEvents = [
        'blur', 'change', 'click', 'dblclick', 'focus', 'keydown', 'keypress',
        'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup',
        'select', 'submit'
    ];

/**
 * Defines a new outside event to correspond with the given DOM event.
 *
 * New outside events are named <code><event>outside</code> by default, but may
 * optionally be given any name.
 *
 * @method Y.Event.defineOutside
 * @param {String} event DOM event
 * @param {String} name (optional) custom outside event name
 */
Y.Event.defineOutside = function (event, name) {
    name = name || event + 'outside';
    
    Y.Event.define(name, {
        
        on: function (node, sub, notifier) {
            sub.onHandle = Y.one('doc').on(event, function(e) {
                if (this.isOutside(node, e.target)) {
                    notifier.fire(e);
                }
            }, this);
        },
        
        detach: function (node, sub, notifier) {
            sub.onHandle.detach();
        },
        
        delegate: function (node, sub, notifier, filter) {
            sub.delegateHandle = Y.one('doc').delegate(event, function (e) {
                if (this.isOutside(node, e.target)) {
                    notifier.fire(e);
                }
            }, filter, this);
        },
        
        detachDelegate: function (node, sub, notifier, filter) {
            sub.delegateHandle.detach();
        },
        
        isOutside: function (node, target) {
            return target !== node && !target.ancestor(function (p) {
                    return p === node;
                });
        }
    });
};

// Define outside events for some common native DOM events
Y.each(nativeEvents, function (event) {
    Y.Event.defineOutside(event);
});


}, 'gallery-2010.08.18-17-12' ,{requires:['event-focus', 'event-synthetic']});
