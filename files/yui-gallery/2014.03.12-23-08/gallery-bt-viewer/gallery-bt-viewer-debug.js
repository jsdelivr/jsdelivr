YUI.add('gallery-bt-viewer', function (Y, NAME) {

/**
 * Provide Viewer class to place html, text and images.
 *
 * @module gallery-bt-viewer
 * @static
 */

var PREFIX = 'bvi_',

    CLASSES = {
        IMAGE: PREFIX + 'image',
        BOTTON: PREFIX + 'button',
        EXPAND: PREFIX + 'expand'
    },

    HTML_BTN = '<span class="' + CLASSES.BOTTON + '"></span>',

    initImage = function (O) {
        if (O.get('naturalWidth') > O.get('offsetWidth')) {
            O.insert(HTML_BTN, 'before');
        }
    },

    handleClickBtn = function (E) {
        var O = E.currentTarget,
            I = O.next('.' + CLASSES.IMAGE);

        E.preventDefault();
        O.toggleClass(CLASSES.EXPAND);
        I.toggleClass(CLASSES.EXPAND);
        this._uiDimensionsChange();
        this.syncScroll();
    },

/**
 * Viewer is a Widget provides a HTML Viewer interface. When contents or images
   are wider then device, Viewer can be scroll horizontally. And, from beginning,
   all images in Viewer are scaled down to fit the device width, and a 'expand'
   button will be provided for each scaled images.
 *
 * @class Viewer
 * @constructor
 * @namespace Bottle
 * @extends ScrollView
 * @uses Bottle.SyncScroll
 * @uses Y.zui.Attribute
 * @param [config] {Object} Object literal with initial attribute values
 */
Viewer = Y.Base.create('btviewer', Y.ScrollView, [Y.Bottle.SyncScroll, Y.zui.Attribute], {
    initializer: function () {
        try {
            this.setAttrs({flick: false, bounce: 0});
            this.setAttrs(Y.JSON.parse(this.get('contentBox').getData('cfg-scroll')));
        } catch (e) {
        }
        this.set('syncScrollMethod', this._uiDimensionsChange);
    },

    destructor: function () {
        this.unplug(Y.zui.RAScroll);
        this._bviEventHandlers.detach();
        delete this._bviEventHandlers;
    },

    renderUI: function () {
        var cnt = this.get('contentBox'),
            images = this.get('imageNode'),
            that = this;

        this.plug(Y.zui.RAScroll);
        this.unplug(Y.Plugin.ScrollViewScrollbars);

        if (!Y.Bottle.Device.getTouchSupport()) {
            this.plug(Y.zui.ScrollHelper);
        }

        images.addClass(CLASSES.IMAGE);

        images.each(function (O) {
            if (O.get('naturalWidth')) {
                initImage(O);
            } else {
                O.once('load', function (E) {
                    initImage(E.target);
                    that._uiDimensionsChange();
                    that.syncScroll();
                });
            }
        });

        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _bviEventHandlers
         * @type EventHandle
         * @private
         */
        this._bviEventHandlers = new Y.EventHandle([
            cnt.delegate('click', handleClickBtn, '.' + CLASSES.BOTTON, this)
        ]);

        Y.once('btNative', this._nativeScroll, this);

        this._uiDimensionsChange();
        this.syncScroll();
    },

    /**
     * toggle internal scrollview to support nativeScroll mode
     *
     * @method _nativeScroll
     * @protected
     */
    _nativeScroll: function () {
        this._prevent = {move: false, start: false, end: false};
    }
}, {
    /**
     * Static property used to define the default attribute configuration.
     *
     * @property ATTRS
     * @type Object
     * @static
     * @protected
     */
    ATTRS: {
        /**
         * Default image node css selector. After the Widget initialized, the attribute will become the NodeList object.
         *
         * @attribute imageNode
         * @type {{String|NodeList}}
         * @default 'img'
         */
        imageNode: {
            writeOnce: true,
            lazyAdd: false,
            setter: function (V) {
                this._imageCSS = V;
                return this.get('contentBox').all(V);
            }
        }
    },

    /**
     * Static property used to define the default HTML parsing rules
     *
     * @property HTML_PARSER
     * @static
     * @protected
     * @type Object
     */
    HTML_PARSER: {
        imageNode: function (srcNode) {
            return srcNode.getData('image-node') || 'img';
        }
    }
});

Y.namespace('Bottle').Viewer = Viewer;


}, 'gallery-2013.04.10-22-48', {
    "requires": [
        "gallery-bt-syncscroll",
        "gallery-zui-rascroll",
        "gallery-zui-attribute",
        "gallery-zui-scrollhelper"
    ]
});
