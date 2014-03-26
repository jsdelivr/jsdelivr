YUI.add('gallery-bt-page', function (Y, NAME) {

/**
 *
 * Provides Page widget which changes width and height with viewport.
 *
 * @module gallery-bt-page
 */

var current,
    instances = [];

/**
 * A basic Page Widget, which will automatically adapt the browser width
 * and height. Only one page will show in the same time. Use active
 * function can hide current page and show the other page. It also has
 * header and footer fixed support.
 *
 * @class Page
 * @constructor
 * @namespace Bottle
 * @extends PushPop
 * @uses WidgetParent
 * @uses WidgetStack
 * @uses Bottle.PushPop
 * @param [config] {Object} Object literal with initial attribute values
 */
Y.Bottle.Page = Y.Base.create('btpage', Y.Widget, [Y.WidgetParent, Y.WidgetStack, Y.Bottle.PushPop], {
    initializer: function () {
        instances.push(current = this);

        if (this.get('nativeScroll')) {
            this.get('boundingBox').addClass('btp-native');
        }
    },

    destructor: function () {
        this._bpgEventHandlers.detach();
        delete this._bpgEventHandlers;
    },

    /**
     * Resize the page to adapt the browser width and height. If the page enable the nativeScroll configuration, the widget height will not be touched
     *
     * @method resize
     */
    resize: function () {
        var W = Y.Bottle.Device.getBrowserWidth(),
            H = Y.Bottle.Device.getBrowserHeight();

        //reduce syncUI times
        if ((this.get('width') === W) && (this.get('height') === H)) {
            return;
        }

        if (this.get('nativeScroll')) {
            Y.fire('btSyncScreen');
            return;
        }
        
        this.setAttrs({width: W, height: H});
    }
}, {
    /**
     * Get all instances of Page
     *
     * @method getInstances
     * @static
     * @return {Array} all instances of Page
     */
    getInstances: function () {
        return instances;
    },

    /**
     * Get current visible Page
     *
     * @method getCurrent
     * @static
     * @return {Object | undefined} current visible Page. If no any visible Page, return undefined.
     */
    getCurrent: function () {
        return current;
    },

    /**
     * Run callback function when native scroll end or Page Container scroll end.
     *
     * @method onScroll
     * @param cb {Function} do callback when scroll end
     */
    onScroll: function (cb) {
        if (!cb) {
            return;
        }

        if (Y.Bottle.get('nativeScroll')) {
            Y.on('scroll', cb);
        } else {
            current.topScroll().on('scrollEnd', cb);
        }
    }
});


}, 'gallery-2013.04.10-22-48', {"requires": ["widget-position", "widget-stack", "gallery-bt-pushpop"]});
