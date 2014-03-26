YUI.add('gallery-scrollspy', function (Y, NAME) {

/**
A plugin for updating the active element of a list based on the scroll position
of a certain node. Plug it into a scrollable node (usually the body) and set the
`target` attribute to the list.

@class Plugin.ScrollSpy
@constructor
@extends Plugin.ScrollInfo
@param {Object} [config] Object literal containing configuration options
**/
function ScrollSpy() {
    ScrollSpy.superclass.constructor.apply(this, arguments);
}
Y.extend(ScrollSpy, Y.Plugin.ScrollInfo, {
    initializer: function () {
        this.on('scroll', this.refresh, this);
        this.refresh();
    },
    /**
    Recalculates the current active node in the list and resets the active
    CSS class names.

    @method refresh
    **/
    refresh: function () {
        var links = this.get('target').all('a'),
            candidates = links.getAttribute('href'),
            ids = [], i = 0, length = candidates.length,
            topNode,
            activeClass = this.get('activeClass');

        for (; i < length; i++) {
            if (candidates[i].charAt(0) === '#') {
                ids.push(candidates[i]);
            }
        }

        topNode = this.getOnscreenNodes(ids.join(',')).shift();

        if (topNode) {
            topNode = '#' + topNode.get('id');
            links.batch(function (link) {
                var node = link.get('parentNode');
                node.toggleClass(activeClass, link.getAttribute('href') === topNode);
            });
        }
    }
}, {
    /**
    Plugin namespace.

    @property NS
    @type String
    @default 'scrollspy'
    @static
    **/
    NS: 'scrollspy',
    ATTRS: {
        /**
        Number of milliseconds by which ScrollSpy throttles the scroll event.
        Alternatively, provide a `data-delay` attribute in your plugged node.

        @attribute {Number} scrollDelay
        @default 15
        @initOnly
        **/
        scrollDelay: {
            valueFn: function () {
                return parseInt(this.get('host').getData('delay'), 10) || 15;
            },
            initOnly: true
        },
        /**
        The class to apply to the active item in the list.

        @attribute {String} activeClass
        @default 'yui3-menu-active'
        **/
        activeClass: {
            value: Y.ClassNameManager.getClassName('menu', 'active')
        },
        /**
        The target list. Usually a list with a `yui3-menu` class.
        Alternatively, provide a `data-target` attribute in your plugged node.

        @attribute {String|Node} target Node or selector.
        @initOnly
        **/
        target: {
            setter: Y.one,
            valueFn: function () {
                return this.get('host').getData('target');
            },
            initOnly: true
        }
    }
});

Y.Plugin.ScrollSpy = ScrollSpy;


}, 'gallery-2013.05.15-21-12', {"requires": ["node-scroll-info", "classnamemanager"]});
