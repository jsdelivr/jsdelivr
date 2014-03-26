YUI.add('gallery-transitionend', function (Y, NAME) {

var testElement = Y.config.doc.createElement('yuitestnode'),
    eventNames =  {
        'transition'       : 'transitionend',
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd',
        'msTransition'     : 'MSTransitionEnd'
    },
    eventName;

function noop() {
}

Y.Object.some(eventNames, function (evtName, styleName) {
    if (styleName in testElement.style) {
        eventName = evtName;
        return true;
    }
});

Y.namespace('support').transitionend = !!eventName;

Y.Event.define('transitionend', {
    on: !eventName ? noop : function (node, subscription, notifier) {
        subscription._handle = Y.Event.attach(eventName, notifier.fire, node._node, notifier);
    },
    detach: function (node, subscription) {
        if (subscription._handle) {
            subscription._handle.detach();
            subscription._handle = null;
        }
    }
});


}, 'gallery-2014.02.13-03-13', {"requires": ["event-base", "event-synthetic"]});
