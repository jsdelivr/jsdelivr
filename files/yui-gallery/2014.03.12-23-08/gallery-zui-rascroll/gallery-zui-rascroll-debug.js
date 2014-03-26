YUI.add('gallery-zui-rascroll', function (Y, NAME) {

/**
 * The RAScrollPlugin help to handle scrollView behaviors.
 * When a Horizontal scrollView is placed inside a Vertical scrollView,
 * user can do only x or y direction slick.
 *
 * @module gallery-zui-rascroll
 */
var dragging = 0,
    dragStart = false,
    onlyX = false,
/**
 * RAScrollPlugin is a ScrollView plugin that adds right angle flick behaviors.
 *
 * @class RAScrollPlugin
 * @namespace zui
 * @extends Plugin.Base
 * @constructor
 */
    RAScrollPlugin = function () {
        RAScrollPlugin.superclass.constructor.apply(this, arguments);
    };

RAScrollPlugin.NAME = 'pluginRAScroll';
RAScrollPlugin.NS = 'zras';
RAScrollPlugin.ATTRS = {
    /**
     * make the scrollView as horizontal or not.
     *
     * @attribute horizontal
     * @default true
     * @type Boolean
     */
    horizontal: {
        value: true,
        lazyAdd: false,
        validator: Y.Lang.isBoolean,
        setter: function (V) {
            this._hori = V;
            return V;
        }
    },

    /**
     * A boolean decides the right angle behavior should started when other scrollView is also dragged.
     *
     * @attribute cooperation
     * @default false
     * @type Boolean
     */
    cooperation: {
        value: false,
        lazyAdd: false,
        validator: Y.Lang.isBoolean,
        setter: function (V) {
            this._coop = V;
            return V;
        }
    }
};

Y.namespace('zui').RAScroll = Y.extend(RAScrollPlugin, Y.Plugin.Base, {
    initializer: function () {
        this._host = this.get('host');
        this._node = this._host.get('boundingBox');
        this._cnt = this._host.get('contentBox');
        this._start = false;

        if (!this._hori) {
            this._cnt.setStyles({
                overflowX: 'hidden',
                height: 'auto'
            });
        }

        this._handles.push(new Y.EventHandle([
            this._node.on('gesturemovestart', this.handleGestureMoveStart),
            this._node.on('gesturemove', Y.bind(this.handleGestureMove, this)),
            this._cnt.on('gesturemoveend', Y.bind(this.handleGestureMoveEnd, this), {standAlone: true})
        ]));

        this.syncScroll();
    },

    /**
     * internal gesturemovestart event handler
     *
     * @method handleGestureMoveStart
     * @protected
     */
    handleGestureMoveStart: function () {
        dragging++;
    },

    /**
     * internal gesturemove event handler
     *
     * @method handleGestureMove
     * @protected
     */
    handleGestureMove: function (E) {
        if (this._start) {
            return;
        }

        this._start = true;

        if (!dragStart) {
            onlyX = Math.abs(this._host._gesture.startClientX - E.clientX) > Math.abs(this._host._gesture.startClientY - E.clientY);
            dragStart = true;
        }

        if (this._coop && dragging < 2) {
            return;
        }

        if (this._hori ? !onlyX : onlyX) {
            this._host.set('disabled', true);
        } else {
            E.preventDefault();
        }
    },

    /**
     * internal gesturemoveend event handler
     *
     * @method handleGestureMoveEnd
     * @protected
     */
    handleGestureMoveEnd: function () {
        this._start = false;
        dragStart = false;
        dragging = 0;

        if (this._hori ? !onlyX : onlyX) {
            // IOS6 setTimeout bug fix
            if (Y.UA.ipad + Y.UA.iphone + Y.UA.ipod >= 6) {
                this._host.set('disabled', false);
            } else {
                // Use later to make multi scrollview more stable when
                // user finger off
                Y.later(1, this._host, this._host.set, ['disabled', false]);
            }

        }
    },

    /**
     * sync width or height for vertical scroll or horizontal scroll
     *
     * @method syncScroll
     */
    syncScroll: function () {
        if (this._hori) {
            this._node.set('offsetHeight', this._node.get('scrollHeight'));
        } else {
            this.syncWidth();
        }
    },

    /**
     * make the scrollView become vertical scrolling
     *
     * @method syncWidth
     */
    syncWidth: function () {
        var c = this._cnt,
            sw = this._node.get('scrollWidth'),
            pw = this._node.get('offsetWidth'),
            cw = c.get('offsetWidth');

        if (cw && (sw > pw)) {
            c.set('offsetWidth', cw + pw - sw);
        }
    }
});


}, 'gallery-2013.02.07-15-27', {"skinnable": false, "requires": ["scrollview"]});
