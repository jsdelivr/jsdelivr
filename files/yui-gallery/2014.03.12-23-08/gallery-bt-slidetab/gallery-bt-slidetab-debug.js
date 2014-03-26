YUI.add('gallery-bt-slidetab', function (Y, NAME) {

/**
 * Provide SlideTab class which can help you to pick a tab to view with a slider.
 *
 * @module gallery-bt-slidetab
 * @static
 */

var LABELWIDTH_CHANGE = 'labelWidthChange',

    PREFIX = 'bst_',

    CLASSES = {
        SLIDE: PREFIX + 'slide',
        INDEX: PREFIX + 'index',
        TAB: PREFIX + 'tab'
    },

/**
 * SlideTab Widget is a Widget provides a slide selector which can help you to pick a tab to view.
 *
 * @class SlideTab
 * @constructor
 * @namespace Bottle
 * @extends Widget
 * @uses WidgetStdMod
 * @uses Bottle.SyncScroll
 * @param [config] {Object} Object literal with initial attribute values

 */
SlideTab = Y.Base.create('btslidetab', Y.Widget, [Y.WidgetStdMod, Y.Bottle.SyncScroll], {
    initializer: function () {
        this.set('syncScrollMethod', this._updateSlide);

        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _bstEventHandlers
         * @type EventHandle
         * @private
         */
        this._bstEventHandlers = new Y.EventHandle([
            this.after(LABELWIDTH_CHANGE, this._updateSlide),
            Y.once('btNative', this._nativeScroll, this)
        ]);
    },

    destructor: function () {
        this._bstEventHandlers.detach();
        delete this._bstEventHandlers;
    },

    renderUI: function () {
        var slideNode = this.get('slideNode'),
            slideParent = Y.Node.create('<div class="bst_slidebox"></div>'),
            scrollView = new Y.ScrollView({
                axis: 'x',
                srcNode: slideNode.replace(slideParent)
            }).plug(Y.zui.RAScroll);

        scrollView.unplug(Y.Plugin.ScrollViewScrollbars);
        scrollView.render(slideParent);
        scrollView.get('boundingBox').setStyles({
            margin: '0 auto',
            width: this._percentWidth() + 'px'
        }).addClass(CLASSES.INDEX);
        scrollView.plug(Y.zui.ScrollSnapper);
        scrollView.pages.on('indexChange', function (E) {
            if (E.newVal > -1) {
                this.set('selectedIndex', E.newVal);
            }
        }, this);
        this.set('scrollView', scrollView);
        this._updateSlide();
    },

    /**
     * toggle internal scrollview to support nativeScroll mode
     *
     * @method _nativeScroll
     * @protected
     */
    _nativeScroll: function () {
        this.get('scrollView')._prevent = {move: false, start: false, end: false};
    },

    /**
     * return computed width by percentage of self.
     *
     * @method _percentWidth
     * @param [percentage] {Number} from 0 to 100. If omitted, default is 100
     * @protected
     */
    _percentWidth: function (P) {
        var V = P || this.get('labelWidth');

        return Math.floor(V * this.get('boundingBox').get('offsetWidth') / 100);
    },

    /**
     * display neighbors of current label or hide them.
     *
     * @method _showNeighbors
     * @param vis {Boolean} show neighbor or not
     * @protected
     */
    _showNeighbors: function (T) {
        var scroll = this.get('scrollView');

        if (scroll) {
            scroll.get('boundingBox').setStyles({
                overflow: T ? 'visible' : 'hidden'
            });
        }
    },

    /**
     * update width of slide control
     *
     * @method _updateSlide
     * @protected
     */
    _updateSlide: function () {
        var scroll = this.get('scrollView'),
            show = this.get('showNeighbors'),
            ttl = scroll.pages.get('total'),
            W = this._percentWidth();

        this.get('labelNode').set('offsetWidth', W);

        if (scroll) {
            if (show) {
                this._showNeighbors(false);
            }
            scroll.set('width', W);
            if (ttl) {
                scroll.pages.scrollTo(scroll.pages.get('index'), -1);
            }
            if (show) {
                this._showNeighbors(true);
            }
        }
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
         * selectd tab index, start from 0.
         *
         * @attribute selectedIndex
         * @type Number
         * @default 0
         */
        selectedIndex: {
            value: 0,
            lazyAdd: false,
            setter: function (V) {
                var ch = this.get('tabNode').get('children'),
                    oldV = this.get('selectedIndex'),
                    old = ch.item(oldV),
                    O = ch.item(V);

                if (O && (old !== O)) {
                    O.addClass('on');
                    Y.Bottle.lazyLoad(O);
                    if (old) {
                        old.removeClass('on');
                    }
                    this.syncScroll();
                    return V * 1;
                }
                return oldV;
            }
        },

        /**
         * Internal scrollview for slide
         *
         * @attribute scrollView
         * @type {Widget}
         */
        scrollView: {
            writeOnce: true
        },

        /**
         * Support lazy load tab contents
         *
         * @attribute lazyLoad
         * @type {Boolean}
         * @default true
         */
        lazyLoad: {
            value: true,
            validator: Y.Lang.isBoolean
        },

        /**
         * Default slider node css selector. After rendered, this attribute will be the Node object.
         *
         * @attribute slideNode
         * @type {String | Node}
         * @default '> ul'
         */
        slideNode: {
            lazyAdd: false,
            writeOnce: true,
            setter: function (V) {
                return this.get('contentBox').one(V).addClass(CLASSES.SLIDE);
            }
        },

        /**
         * Default slider label nodes css selector. After rendered, this attribute will be the NodeList object.
         *
         * @attribute labelNode
         * @type {String | NodeList}
         * @default '> li'
         */
        labelNode: {
            lazyAdd: false,
            writeOnce: true,
            setter: function (V) {
                return this.get('slideNode').all(V);
            }
        },

        /**
         * Set label nodes width by percentage of slideTab automatically. Set to 0 means to keep original width.
         *
         * @attribute labelWidth
         * @type {Number}
         * @default 30
         */
        labelWidth: {
            lazyAdd: false,
            validator: function (V) {
                return (V > 0) && (V <= 100);
            },
            setter: function (V) {
                return V * 1;
            }
        },


        /**
         * Show label neighbors or not
         *
         * @attribute showNeighbors
         * @type {Boolean}
         * @default true
         */
        showNeighbors: {
            lazyAdd: false,
            validator: Y.Lang.isBoolean,
            setter: function (V) {
                this._showNeighbors(V);
                return V;
            }
        },

        /**
         * Default tab container node css selector. After rendered, this attribute will be the Node object.
         *
         * @attribute tabNode
         * @type {String | Node}
         * @default '> ul'
         */
        tabNode: {
            lazyAdd: false,
            writeOnce: true,
            setter: function (V) {
                return this.get('contentBox').one(V).addClass(CLASSES.TAB);
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
        lazyLoad: function (srcNode) {
            return (srcNode.getData('lazy-load') === 'false') ? false : true;
        },
        slideNode: function (srcNode) {
            return srcNode.getData('slide-node') || '> ul';
        },
        labelNode: function (srcNode) {
            return srcNode.getData('label-node') || '> li';
        },
        labelWidth: function (srcNode) {
            return srcNode.getData('label-width') || 30;
        },
        showNeighbors: function (srcNode) {
            return (srcNode.getData('show-neighbors') !== 'false');
        },
        tabNode: function (srcNode) {
            return srcNode.getData('tab-node') || '> div';
        },
        selectedIndex: function (srcNode) {
            return srcNode.getData('selected-index') || 0;
        }
    }
});

Y.namespace('Bottle').SlideTab = SlideTab;


}, 'gallery-2013.04.10-22-48', {
    "requires": [
        "gallery-bt-syncscroll",
        "widget-stdmod",
        "gallery-zui-rascroll",
        "gallery-zui-scrollsnapper"
    ]
});
