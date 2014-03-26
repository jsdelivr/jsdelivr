YUI.add('gallery-bt-shortcut', function (Y, NAME) {

/**
 * This module provides ShortCut Widget which can show/hide with different transitions or directions.
 *
 * @module gallery-bt-shortcut
 */
var body = Y.one('body'),
    Mask = Y.one('.bt-shortcut-mask') || body.appendChild(Y.Node.create('<div class="bt-shortcut-mask"></div>')),
    WIDTH_CHANGE = 'widthChange',
    HEIGHT_CHANGE = 'heightChange',
    VISIBLE_CHANGE = 'visibleChange',

    fixedPos = Y.Bottle.Device.getPositionFixedSupport(),
    pageWidget,
    pageNode,

    instances = [],
    current,
    next,

    TRANSITIONS = {
        unveil: 1,
        push: 1
    },

    POSITIONS = {
        top: [0, -1, 0.5, 0],
        bottom: [0, 1, 0.5, 1],
        left: [-1, 0, 0, 0.5],
        right: [1, 0, 1, 0.5]
    },

    FULLWH = {
        'true': 1,
        'false': 1
    },

    /**
     * A basic ShortCut widget which support three types of animation. Use
     * show and hide function to display ShortCut. Only one ShortCut will show
     * in the same time.
     *
     * @class ShortCut
     * @param [config] {Object} Object literal with initial attribute values
     * @extends Widget
     * @namespace Bottle
     * @uses WidgetParent
     * @uses WidgetStack
     * @uses Bottle.PushPop
     * @constructor
     */
    ShortCut = Y.Base.create('btshortcut', Y.Widget, [Y.WidgetParent, Y.WidgetStack, Y.Bottle.PushPop], {
        initializer: function () {
            if (!pageWidget) {
                pageWidget = Y.Bottle.Page.getCurrent();
                if (pageWidget) {
                    pageNode = pageWidget.get('boundingBox');
                    pageWidget.set('zIndex', ShortCut.ZINDEX_PAGE);
                }
            }

            instances.push(this);

            /**
             * internal eventhandlers, keep for destructor
             *
             * @property _bscEventHandlers
             * @type EventHandle
             * @private
             */
            this._bscEventHandlers = new Y.EventHandle([
                this.after(WIDTH_CHANGE, this._updatePositionShow),
                this.after(HEIGHT_CHANGE, this._updatePositionShow),
                this.before(VISIBLE_CHANGE, this._beforeShowHide),
                this.after(VISIBLE_CHANGE, this._doShowHide)
            ]);

            this.get('contentBox').setStyle('display', 'block');

            this._updatePositionHide();
            this._updatePositionShow();
        },

        destructor: function () {
            this._bscEventHandlers.detach();
            delete this._bscEventHandlers;
        },

        renderUI: function () {
            this.syncWH();
        },

        /**
         * Resize the ShortCut to adapt the browser width and height.
         *
         * @method scResize
         * @param [force=false] {Boolean} <b>true</b> to forece resize even when ShortCut is not visibile.
         */
        scResize: function (force) {
            var sz = false;
            //reduce syncUI times
            if (!this.get('visible') && !force) {
                return;
            }

            if (force || (this.get('width') !== Y.Bottle.Device.getBrowserWidth()) || (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {
                sz = this._updateFullSize();
            }

            if (force || sz || this.get('showFrom').match(/right|bottom/)) {
                this._updatePositionShow();
            }
        },

        /**
         * handle child full Height or width
         *
         * @method _updateFullSize
         * @protected
         */
        _updateFullSize: function () {
            if (this.get('nativeScroll')) {
                return;
            }
            if (this.get('fullHeight')) {
                this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});
            }
            if (this.get('fullWidth')) {
                this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});
            }
            return true;
        },


        /**
         * get show or hide position of shortcut
         *
         * @method getshowHidePosition
         */
        getShowHidePosition: function (show) {
            var selfDir = show ? 0 : 1,
                NS = this.get('nativeScroll'),
                posData = POSITIONS[this.get('showFrom')];

            return [
                Math.floor(posData[2] * Y.Bottle.Device.getBrowserWidth()
                + (selfDir * posData[0] - posData[2]) * this.get('width')),
                (NS ? 0 : Math.floor(posData[3] * Y.Bottle.Device.getBrowserHeight())
                + (selfDir * posData[1] - (NS ? 0 : posData[3])) * this.get('height'))
                + (Y.Bottle.get('positionFixed' && !NS) ? 0 : Y.Bottle.Device.getScrollY())
            ];
        },

        /**
         * Update showed ShortCut position based on action and showFrom
         *
         * @method _updatePositionShow
         * @protected
         */
        _updatePositionShow: function (E) {
            var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),
                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                noAlign = (E && E.noAlign) ? true : false,
                posData = POSITIONS[pos],
                XY;

            if (!vis) {
                return;
            }

            if (noAlign) {
                return;
            }

            pageNode.setStyles({
                left: -posData[0] * ((E && (E.attrName === 'width')) ? E.newVal : this.get('width')) + 'px',
                top: -posData[1] * ((E && (E.attrName === 'height')) ? E.newVal : this.get('height')) + 'px'
            });

            XY = this.getShowHidePosition(true);
            this.absMove(XY[0], XY[1]);
        },

        /**
         * move the ShortCut to hidden place
         *
         * @method _updatePositionHide
         * @protected
         */
        _updatePositionHide: function (E) {
            var isUnveil = (this.get('action') === 'unveil'),
                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                XY = this.getShowHidePosition(vis || isUnveil);

            this.absMove(XY[0], XY[1]);
        },

        /**
         * Show or hide the mask.
         *
         * @method _displayMask
         * @param show {Boolean} true to display, false to hide.
         * @protected
         */
        _displayMask: function (show) {
            Mask.setStyle('display', show ? 'block' : 'none');
        },

        /**
         * do transition on a node with top and left css properties
         *
         * @method _doTransition
         * @param node {Node} node to do transition
         * @param left {Number} css left in px
         * @param top {Number} css top in px
         * @param [done] {Function} If provided, call this function when transition done
         * @param bottom {Boolean} If true, use bottom attribute to do transition
         * @protected
         */
        _doTransition: function (node, left, top, done, bottom) {
            var that = this,
                tr = Y.merge(this.get('scTrans'), {left: left + 'px'});

            tr[bottom ? 'bottom' : 'top'] = top + 'px';

            Y.later(1, this, function () {
                node.transition(tr, function () {
                    if (done) {
                        done.apply(that);
                    }
                });
            });
        },

        /**
         * handle other Shortcut transition when show or hide
         *
         * @method _beforeShowHide
         * @protected
         */
        _beforeShowHide: function (E) {
            if (!current || !E.newVal || (current === this)) {
                return;
            }

            next = this;
            E.halt();
            current.hide();
        },

        /**
         * handle Shortcut transition when show or hide
         *
         * @method _doneShowHide
         * @protected
         */
        _doneShowHide: function () {
            var show = this.get('visible'),
                mask = this.get('mask'),
                XY;

            if (show && this.get('nativeScroll')) {
                Y.Bottle.Page.getCurrent().resetScroll(this.get('boundingBox'));
                XY = this.getShowHidePosition(true);
                this.absMove(XY[0], XY[1]);
            }

            if (mask) {
                this._displayMask(show);
            }

            this.set('disabled', show ? false : true);
            this.set('zIndex', show ? ShortCut.ZINDEX_SHOW : ShortCut.ZINDEX_HIDE);

            if (next) {
                next.show();
                next = undefined;
            }
        },

        /**
         * handle Shortcut transition when show or hide
         *
         * @method _doShowHide
         * @protected
         */
        _doShowHide: function (E) {
            var show = E.newVal,
                pageDir = show ? -1 : 0,
                posData = POSITIONS[this.get('showFrom')],
                node = this.get('boundingBox'),
                XY;

            if (show) {
                this.enable();
                this._updateFullSize();
                this._updatePositionHide({visible: false});
                current = this;
            } else {
                if (this.get('nativeScroll')) {
                    Y.Bottle.Page.getCurrent().resetScroll();
                }
                this._updatePositionShow({visible: true});
                if (this.get('mask')) {
                    this._displayMask(false);
                }
                current = undefined;
            }
            this.set('zIndex', ShortCut.ZINDEX_HIDE);

            XY = [pageDir * posData[0] * this.get('width'), pageDir * posData[1] * this.get('height')];

            if (fixedPos && pageWidget.get('nativeScroll')) {
                pageWidget.each(function (O) {
                    if (O.get('headerFixed')) {
                        this._doTransition(O.get('headerNode'), XY[0], XY[1]);
                    }
                    if (O.get('footerFixed')) {
                        this._doTransition(O.get('footerNode'), XY[0], -XY[1], null, true);
                    }
                }, this);
            }

            this._doTransition(pageNode, XY[0], XY[1], this._doneShowHide);

            if (this.get('action') !== 'unveil') {
                XY = this.getShowHidePosition(show);
                this._doTransition(node, XY[0], XY[1]);
            }
        }
    }, {
        /**
         * Static property used to define the default attribute configuration.
         *
         * @property ATTRS
         * @protected
         * @type Object
         * @static
         */
        ATTRS: {
            /**
             * The animation action of the shortcut. Should be one of: 'push', 'unveil' .
             *
             * @attribute action
             * @type String
             * @default unveil
             */
            action: {
                value: 'unveil',
                lazyAdd: false,
                validator: function (V) {
                    return TRANSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    if (V !== this.get('action')) {
                        this._updatePositionShow({action: V});
                    }
                    return V;
                }
            },

            /**
             * The shortcut show direction. Should be one of:
             * <dl>
             *  <dt>top</dt><dd>top</dd>
             *  <dt>left</dt><dd>left</dd>
             *  <dt>right</dt><dd>right</dd>
             *  <dt>bottom</dt><dd>bottom</dd>
             * </dl>
             *
             * @attribute showFrom
             * @type String
             * @default left
             */
            showFrom: {
                value: 'left',
                lazyAdd: false,
                validator: function (V) {
                    return POSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    var F,
                        B = this.get('contentBox'),
                        fwh = POSITIONS[V][0];

                    if (V === this.get('showFrom')) {
                        return V;
                    }

                    this._updatePositionShow({showFrom: V});

                    F = B.getData('full-height');
                    if (FULLWH[F]) {
                        this.set('fullHeight', F === 'true');
                    } else {
                        this.set('fullHeight', (fwh !== 0) ? true : false);
                    }

                    F = B.getData('full-width');
                    if (FULLWH[F]) {
                        this.set('fullWidth', F === 'true');
                    } else {
                        this.set('fullWidth', fwh === 0);
                    }

                    return V;
                }
            },

            /**
             * Boolean indicating if ShortCut needs to display mask or not.
             *
             * @attribute mask
             * @type Boolean
             * @default true
             */
            mask: {
                value: true,
                validator: Y.Lang.isBoolean,
                setter: function (V) {
                    if (this.get('visible')) {
                        this._displayMask(V);
                    }

                    return V;
                }
            },

            /**
             * Default transition setting for ShortCut
             *
             * @attribute transition
             * @type Object
             * @default {dutation: 0.5}
             */
            scTrans: {
                value: {
                    duration: 0.5
                }
            },

            /**
             * Boolean indicating if ShortCut needs to adjusting height to match viewport when it shows from left or right.
             *
             * @attribute fullHeight
             * @type Boolean
             * @default true
             */
            fullHeight: {
                validator: Y.Lang.isBoolean,
                lazyAdd: false,
                setter: function (V) {
                    if (V) {
                        this.scResize();
                    }
                    return V;
                }
            },

            /**
             * Boolean indicating if ShortCut needs to adjusting height to match viewport when it shows from top or bottom.
             *
             * @attribute fullWidth
             * @type Boolean
             * @default true
             */
            fullWidth: {
                validator: Y.Lang.isBoolean,
                lazyAdd: false,
                setter: function (V) {
                    if (V) {
                        this.scResize();
                    }
                    return V;
                }
            }
        },

        /**
         * Static property used to define the default HTML parsing rules
         *
         * @property HTML_PARSER
         * @protected
         * @static
         * @type Object
         */
        HTML_PARSER: {
            mask: function (srcNode) {
                return (srcNode.getData('mask') === 'false') ? false : true;
            },

            action: function (srcNode) {
                return srcNode.getData('action');
            },

            showFrom: function (srcNode) {
                return srcNode.getData('show-from');
            },

            scTrans: function (srcNode) {
                try {
                    return Y.JSON.parse(srcNode.getData('cfg-sc-trans'));
                } catch (e) {
                }
            }
        },

        /**
         * Default zindex for Page
         *
         * @property ZINDEX_PAGE
         * @static
         * @type Number
         * @default 100
         */
        ZINDEX_PAGE: 100,

        /**
         * Default zindex for visible ShortCut
         *
         * @property ZINDEX_SHOW
         * @static
         * @type Number
         * @default 200
         */
        ZINDEX_SHOW: 200,

        /**
         * Default zindex for hidden ShortCut
         *
         * @property ZINDEX_HIDE
         * @static
         * @type Number
         * @default 10
         */
        ZINDEX_HIDE: 10,

        /**
         * Get all instances of ShortCut
         *
         * @method getInstances
         * @static
         * @return {Array} all instances of ShortCut
         */
        getInstances: function () {
            return instances;
        },

        /**
         * Get current visilbe ShortCut
         *
         * @method getCurrent
         * @static
         * @return {Object | undefined} current visible ShortCut. If no any visible ShortCut, return undefined.
         */
        getCurrent: function () {
            return current;
        }
    });

Y.Bottle.ShortCut = ShortCut;

// hide shortcut when click mask
Mask.on(Y.Bottle.Device.getTouchSupport() ? 'gesturemoveend' : 'click', function () {
    current.hide();
});

// disable scroll on mask
Mask.on('gesturemovestart', function (E) {
    E.preventDefault();
});


}, 'gallery-2013.04.10-22-48', {"requires": ["gallery-bt-page"]});
