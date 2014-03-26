YUI.add('gallery-event-inserted', function(Y) {

/*
 * Inserted Event.
 *
 * Uses efficient CSS3 Animation to fire insertion events otherwise falls back
 * to DOMNodeInserted.
 *
 * Based on technique described here:
 * http://www.backalleycoder.com/2012/04/25/i-want-a-damnodeinserted/
 */
var VENDOR = ['', 'WebKit', 'Moz', 'O', 'MS'].filter(function(prefix) {
        return Y.config.win[prefix + 'CSSKeyframesRule'];
    })[0],
    Inserted,
    DOMInserted;

// CSS3 Animation Support
Inserted = {
    NAME: 'InsertedNode', // Animation name
    PREFIX: VENDOR ? '-' + VENDOR.toLowerCase() + '-' : VENDOR,
    ANIMATION_START_VENDORS: {
        WebKit: 'webkitAnimationStart',
        O: 'oAnimationStart'
    },
    ANIMATION_START: 'animationstart',
    STYLESHEET: null,

    _init: function() {
        Inserted.ANIMATION_START = Inserted.ANIMATION_START_VENDORS[VENDOR] || Inserted.ANIMATION_START;
        Y.Node.DOM_EVENTS[Inserted.ANIMATION_START] = 1;
        Inserted.STYLESHEET = Y.Node.create('<style type="text/css">@' + Inserted.PREFIX + 'keyframes ' + Inserted.NAME + ' {' +
            'from {clip: rect(1px, auto, auto, auto);} to {clip: rect(0px, auto, auto, auto);}' +
        '}</style>');
        Y.one('head').append(Inserted.STYLESHEET);
    },

    processArgs: function (args, isDelegate) {
        return args.splice(2, 1)[0];
    },

    on: function(node, sub, notifier, filter) {
        var method = filter ? 'delegate' : 'on',
            rule = sub._extra + '{' + Inserted.PREFIX + 'animation-duration: 0.0001s; ' + Inserted.PREFIX + 'animation-name: ' + Inserted.NAME + ' !important;}';

        sub._handle = node[method](Inserted.ANIMATION_START, Y.bind(function(e) {
            if (e._event.animationName === Inserted.NAME) {
                notifier.fire({target: e.target, selector: sub._extra});
            }
        }, this), filter);

        Inserted.STYLESHEET.get('sheet').insertRule(rule, 0);
    },

    delegate: function() {
        this.on.apply(this, arguments);
    },

    detach: function(node, sub, notifier) {
        sub._handle.detach();
    },

    detachDelegate: function() {
        this.detach.apply(this, arguments);
    }
};

// DOMNodeInserted fallback
DOMInserted = {
    SELECTORS: {},

    _init: function() {
        Y.Node.DOM_EVENTS.DOMNodeInserted = 1;
    },
    
    processArgs: function (args, isDelegate) {
        return args.splice(2, 1)[0];
    },

    on: function(node, sub, notifier, filter) {
        var method = filter ? 'delegate' : 'on',
            doc_node = (node.get('document') || node); // Y.all window bug

        // Initialize existing elements on page only once
        if (!DOMInserted.SELECTORS[sub._extra]) {
            DOMInserted.SELECTORS[sub._extra] = true;
            setTimeout(function() {
                doc_node.all(sub._extra).each(function(n) {
                    notifier.fire({target: n});
                });
            }, 0);
        }

        // Delegates don't seem to work for DOMNodeInserted :(
        sub._handle = node[method]('DOMNodeInserted', Y.bind(function(e) {
            if (Y.Selector.test(e.target.getDOMNode(), sub._extra, doc_node.getDOMNode())) {
                notifier.fire({target: e.target, selector: sub._extra});
            }
        }, this), filter);
    },

    delegate: function() {
        this.on.apply(this, arguments);
    },

    detach: function(node, sub, notifier) {
        sub._handle.detach();
    },

    detachDelegate: function() {
        this.detach.apply(this, arguments);
    }
};

// Fallback if CSS3 Animation is not supported
Y.Event.define('inserted', VENDOR ? Inserted : DOMInserted);


}, 'gallery-2012.07.18-13-22' ,{requires:['event', 'node'], skinnable:false});
