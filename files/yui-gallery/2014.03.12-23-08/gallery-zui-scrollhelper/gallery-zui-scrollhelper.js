YUI.add('gallery-zui-scrollhelper', function (Y, NAME) {

/**
 * ZUI ScrollHelper help you to handle desktop img/a dragging problem in scrollView.
 * Just plug Y.zui.ScrollHelper into a scrollView. If user dragging with Desktop
 * browsers, the scrollView still work well even when user start dragging on an A
 ( or IMG.
 *
 * @module gallery-zui-scrollhelper
 */
/**
 * ScrollHelperPlugin is a ScrollView plugin that help to handle A/IMG dragging bug.
 *
 * @class ScrollHelperPlugin
 * @namespace zui
 * @extends Plugin.Base
 * @constructor
 */
var ScrollHelperPlugin = function () {
        ScrollHelperPlugin.superclass.constructor.apply(this, arguments);
    };

ScrollHelperPlugin.NAME = 'pluginScrollHelper';
ScrollHelperPlugin.NS = 'zsh';
ScrollHelperPlugin.ATTRS = {
    /**
     * Default css selector to help disable browser native dragging
     *
     * @attribute noDragSelector
     * @default 'a, img'
     * @type String
     */
    noDragSelector: {
        value: 'a, img',
        validator: Y.Lang.isString,
        writeOnce: 'initOnly'
    },

    /**
     * Default css selector to help disable click when scrollView was scrolled
     *
     * @attribute noClickSelector
     * @default 'a'
     * @type Boolean
     */
    noClickSelector: {
        value: 'a',
        validator: Y.Lang.isString,
        writeOnce: 'initOnly'
    }
};

Y.namespace('zui').ScrollHelper = Y.extend(ScrollHelperPlugin, Y.Plugin.Base, {
    initializer: function () {
        var host = this.get('host'),
            cnt = host.get('contentBox');

        this._handles.push(new Y.EventHandle([
            cnt.delegate('click', this.handleClick, this.get('noClickSelector'), host),
            cnt.delegate('mousedown', this.handleMouseDown, this.get('noDragSelector'), this)
        ]));
    },
    
    /**
     * internal click event handler
     *
     * @method handleClick
     * @protected
     */
    handleClick: function (E) {
        if (Math.abs(this.lastScrolledAmt) > 2) {
            E.preventDefault();
        }
    },

    /**
     * internal mousedown event handler
     *
     * @method handleMouseDown
     * @protected
     */
    handleMouseDown: function (E) {
        E.preventDefault();
    },

    /**
     * sync scrollView scroll position and height
     *
     * @method syncScroll
     */
    syncScroll: function () {
        var sc = this.get('host');

        sc._uiDimensionsChange();
        if (sc._maxScrollY) {
            sc.scrollTo(null, Math.min(sc.get('scrollY'), sc._maxScrollY));
        }
    }
});


}, 'gallery-2013.02.07-15-27', {"requires": ["scrollview"]});
