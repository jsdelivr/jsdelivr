YUI.add('gallery-bt-carousel', function (Y, NAME) {

/**
 * Provide Carousel class to rendering a lot of photo in many kinds of layout
 *
 * @module gallery-bt-carousel
 * @static
 */

var PREFIX = 'bcr_',

    CLASSES = {
        INDEXBOX: PREFIX + 'indexbox',
        INDEXITEM: PREFIX + 'indexitem',
        INDEXON: PREFIX + 'on',
        LEFT: PREFIX + 'btnl',
        RIGHT: PREFIX + 'btnr',
        SHOWBUTTON: PREFIX + 'showbtn',
        BUTTONOFF: PREFIX + 'off'
    },

    HTMLS = {
        INDEXBOX: '<ol class="' + CLASSES.INDEXBOX + '"></ol>',
        INDEXITEM: '<li class="' + CLASSES.INDEXITEM + '"></li>',
        LEFT: '<div class="' + CLASSES.LEFT + '"></li>',
        RIGHT: '<div class="' + CLASSES.RIGHT + '"></li>'
    },

/**
 * Carousel is a Widget which can help you to render a lot of photo in different patterns.
 *
 * @class Carousel
 * @constructor
 * @namespace Bottle
 * @extends ScrollView
 * @uses Bottle.SyncScroll
 * @uses Y.zui.Attribute
 * @param [config] {Object} Object literal with initial attribute values
 */
Carousel = Y.Base.create('btcarousel', Y.ScrollView, [Y.Bottle.SyncScroll, Y.zui.Attribute], {
    initializer: function () {
        this.set('syncScrollMethod', this._updatePages);
        this.plug(Y.zui.RAScroll);
    },

    destructor: function () {
        this.unsync('selectedIndex', this.pages, 'index');
        this.unplug(Y.zui.RAScroll);
        this._bcrEventHandlers.detach();
        delete this._bcrEventHandlers;
    },

    renderUI: function () {
        var parent = this.get('indexNode') || this.get('boundingBox'),
            box = parent.appendChild(HTMLS.INDEXBOX),
            all = this.pages.get('total'),
            index = this.get('contentBox').getData('selected-index') || 0,
            I;

        this._indexes = [];
        for (I=0;I<all;I++) {
            this._indexes.push(box.appendChild(HTMLS.INDEXITEM));
        }

        this.unplug(Y.Plugin.ScrollViewScrollbars);

        if (!Y.Bottle.Device.getTouchSupport()) {
            this.plug(Y.zui.ScrollHelper);
        }

        this._updatePages();
        this.sync('selectedIndex', this.pages, 'index');

        /**
         * left button Node
         *
         * @property leftButton
         * @type Node
         */
        this.leftButton = parent.appendChild(HTMLS.LEFT).setHTML(this.get('textLeft'));

        /**
         * right button Node
         *
         * @property rightButton
         * @type Node
         */
        this.rightButton = parent.appendChild(HTMLS.RIGHT).setHTML(this.get('textRight'));

        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _bcrEventHandlers
         * @type EventHandle
         * @private
         */
        this._bcrEventHandlers = new Y.EventHandle([
            this.leftButton.on('click', this.pages.prev, this.pages),
            this.rightButton.on('click', this.pages.next, this.pages)
        ]);

        Y.once('btNative', this._nativeScroll, this);

        this.set('selectedIndex', index);
        this._updateButtons(index);
    },

    /**
     * toggle internal scrollview to support nativeScroll mode
     *
     * @method _nativeScroll
     * @protected
     */
    _nativeScroll: function () {
        this._prevent = {move: false, start: false, end: false};
    },

    /**
     * udpate left/right buttons status
     *
     * @method _updateButtons
     * @protected
     */
    _updateButtons: function (V) {
        if (this.leftButton) {
            this.leftButton.toggleClass(CLASSES.BUTTONOFF, (V === 0));
            this.rightButton.toggleClass(CLASSES.BUTTONOFF, (V === this.pages.get('total') - 1));
        }
    },
 
    /**
     * udpate page nodes width
     *
     * @method _updatePages
     * @protected
     */
    _updatePages: function () {
        this.get('pageNode').set('offsetWidth', Math.floor(this.get('boundingBox').get('offsetWidth') / this.get('pageItems')));
        this._uiDimensionsChange();
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
         * Default pages node css selector. After the Widget initialized, the attribute will become the NodeList object.
         *
         * @attribute pageNode
         * @type {{String|NodeList}}
         * @default '> li'
         */
        pageNode: {
            value: '> li',
            writeOnce: true,
            lazyAdd: false,
            setter: function (V) {
                this._pageCSS = V;
                return this.get('contentBox').all(V);
            }
        },

        /**
         * Specify how many items in a page.
         *
         * @attribute pageItems
         * @type {{Number}}
         * @default 1
         */
        pageItems: {
            value: 1,
            lazyAdd: false,
            writeOnce: true,
            validator: Y.Lang.isNumber,
            setter: function (V) {
                var v = Math.max(1, Math.floor(V));

                this.plug(Y.zui.ScrollSnapper, {selector: this._pageCSS + ((v > 1) ? (':nth-child(' + v + 'n+1)') : '')});
                return v;
            }
        },

        /**
         * Specify page indicator parent Node. If the Node can not be found or omitted, the indicator will be appended into the boundingBox.
         *
         * @attribute indexNode
         * @type {{String|Node}}
         */
        indexNode: {
            writeOnce: true,
            setter: Y.one
        },

        /**
         * Specify wording for left button
         *
         * @attribute textRight
         * @type {{String}}
         */
        textRight: {
            value: '',
            writeOnce: true
        },

        /**
         * Specify wording for left button
         *
         * @attribute textLeft
         * @type {{String}}
         */
        textLeft: {
            value: '',
            writeOnce: true
        },

        /**
         * Display left button and right button when set to true.
         *
         * @attribute showButtons
         * @type Boolean
         * @default true
         */
        showButtons: {
            value: true,
            lazyAdd: false,
            validator: Y.Lang.isBoolean,
            setter: function (V) {
                this.get('boundingBox').toggleClass(CLASSES.SHOWBUTTON, V);
                return V;
            }
        },

        /**
         * selectd page index, start from 0.
         *
         * @attribute selectedIndex
         * @type Number
         * @default 0
         */
        selectedIndex: {
            setter: function (V) {
                var pages = this._indexes,
                    oldV = this.get('selectedIndex'),
                    old = pages ? pages[oldV] : undefined,
                    O = pages ? pages[V] : undefined;

                if (O && (old !== O)) {
                    if (old) {
                        old.removeClass(CLASSES.INDEXON);
                    }
                    O.addClass(CLASSES.INDEXON);

                    this._updateButtons(V);

                    return V * 1;
                }

                return oldV;
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
        pageItems: function (srcNode) {
            var pi = srcNode.getData('page-items');
            return pi ? pi * 1 : 1;
        },
        pageNode: function (srcNode) {
            try {
                this.setAttrs(Y.JSON.parse(srcNode.getData('cfg-scroll')));
            } catch (e) {
            }
            return srcNode.getData('page-node');
        },
        textLeft: function (srcNode) {
            return srcNode.getData('text-left') || '';
        },
        textRight: function (srcNode) {
            return srcNode.getData('text-right') || '';
        },
        indexNode: function (srcNode) {
            return srcNode.getData('index-node');
        },
        showButtons: function (srcNode) {
            return srcNode.getData('show-buttons') !== 'false';
        }
    }
});

Y.namespace('Bottle').Carousel = Carousel;


}, 'gallery-2013.04.10-22-48', {
    "requires": [
        "gallery-bt-syncscroll",
        "gallery-zui-rascroll",
        "gallery-zui-scrollsnapper",
        "gallery-zui-attribute",
        "gallery-zui-scrollhelper"
    ]
});
