YUI.add('gallery-bt-overlay', function (Y, NAME) {

/*jslint nomen: true*/
/**
 * This module provides Overlay Widget which can show/hide with different transitions or directions.
 *
 * @module gallery-bt-overlay
 */
var body = Y.one('body'),
    Mask = Y.one('.bt-overlay-mask') || body.appendChild(Y.Node.create('<div class="bt-overlay-mask"></div>')),
    WIDTH_CHANGE = 'widthChange',
    HEIGHT_CHANGE = 'heightChange',
    VISIBLE_CHANGE = 'visibleChange',

    hasTouch = Y.Bottle.Device.getTouchSupport(),

    instances = [],
    current,

    POSITIONS = {
        top: [0, -1],
        bottom: [0, 1],
        left: [-1, 0],
        right: [1, 0]
    },

    /**
     * A basic Overlay widget which support three types of animation. Use
     * show and hide function to display Overlay. Only one Overlay will show
     * in the same time.
     *
     * @class Overlay
     * @param [config] {Object} Object literal with initial attribute values
     * @extends Widget
     * @uses WidgetParent
     * @uses WidgetStack
     * @uses Bottle.PushPop
     * @constructor
     * @namespace Bottle
     */
    Overlay = Y.Base.create('btoverlay', Y.Widget, [Y.WidgetParent, Y.WidgetStack, Y.Bottle.PushPop], {
        initializer: function (cfg) {
            var msk = this.get('contentBox').getData('mask');

            instances.push(this);

            if (!cfg.zIndex) {
                this.set('zIndex', 200);
            }

            this.set('mask', (msk ? (msk === 'false') : this.get('fullPage')) ? false : true);

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
                this.after(VISIBLE_CHANGE, this._doShowHide)
            ]);
        },

        destructor: function () {
            this._bscEventHandlers.detach();
            delete this._bscEventHandlers;
        },

        renderUI: function () {
            this.syncWH();
            this._updatePositionHide();
            this._updatePositionShow();
        },

        /**
         * Resize the Overlay to adapt the browser width and height.
         *
         * @method olResize
         * @param [force=false] {Boolean} <b>true</b> to forece resize even when Overlay is not visibile.
         */
        olResize: function (force) {
            if (!this.get('visible') && !force) {
                return;
            }

            //reduce syncUI times
            if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth()) && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {
                return;
            }

            this._updateFullSize();
            this._updatePositionShow();
        },

        /**
         * handle child full Height or width
         *
         * @method _updateFullSize
         * @protected
         */
        _updateFullSize: function () {
            if (this.get('fullPage')) {
                this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});
                if (!this.get('nativeScroll')) {
                    this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});
                }
            }
        },

        /**
         * Update showed Overlay position based on action and showFrom
         *
         * @method _updatePositionShow
         * @protected
         */
        _updatePositionShow: function (E) {
            var vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                noAlign = (E && E.noAlign) ? true : false,
                move = (vis && !noAlign),
                pos = move ? this.getShowHideXY(true) : 0;

            if (move) {
                this.absMove(pos[0], pos[1]);
            }
        },

        /**
         * move the Overlay to hidden place
         *
         * @method _updatePositionHide
         * @protected
         */
        _updatePositionHide: function (E) {
            var vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                pos = vis ? 0 : this.getShowHideXY(false);

            if (!vis) {
                this.absMove(pos[0], pos[1]);
            }
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
         * @protected
         */
        _doTransition: function (node, left, top, done) {
            var that = this;

            Y.later(1, this, function () {
                node.transition(Y.merge(this.get('olTrans'), {
                    left: left + 'px',
                    top: top + 'px'
                }), function () {
                    if (done) {
                        done.apply(that);
                    }
                });
            });
        },

        /**
         * handle Overlay transition when show or hide
         *
         * @method _doneShowHide
         * @protected
         */
        _doneShowHide: function () {
            var show = this.get('visible'),
                mask = this.get('mask');

            if (show && this.get('nativeScroll')) {
                Y.Bottle.Page.getCurrent().resetScroll(this.get('boundingBox'));
                XY = this.getShowHideXY(true);
                this.absMove(XY[0], XY[1]);
            }

            if (mask) {
                this._displayMask(show);
            }

            if (!show) {
                this.disable();
            }
        },

        /**
         * get show position or hide position
         *
         * @method getShowHideXY
         * @return {Array} array of position: [x, y]
         */
        getShowHideXY: function (show) {
            var selfDir = show ? 0 : 1,
                posData = POSITIONS[this.get('showFrom')],
                NS = this.get('nativeScroll'),
                W = Y.Bottle.Device.getBrowserWidth(),
                H = Y.Bottle.Device.getBrowserHeight();

            return [
                selfDir * W * posData[0] + Math.floor((W - this.get('width')) / 2),
                selfDir * H * posData[1] + (NS ? 0 : Math.floor((H - this.get('height')) / 2))
                + (Y.Bottle.get('positionFixed') ? 0 : Y.Bottle.Device.getScrollY())
            ];
        },

        /**
         * handle Overlay transition when show or hide
         *
         * @method _doShowHide
         * @protected
         */
        _doShowHide: function (E) {
            var show = E.newVal,
                finalPos,
                node = this.get('boundingBox');

            if (show && this.enable()) {
                this._updateFullSize();
            }

            if (show) {
                this._updatePositionHide({visible: false});
                current = this;
            } else {
                if (this.get('nativeScroll')) {
                    Y.Bottle.Page.getCurrent().resetScroll();
                }
                this._updatePositionShow({visible: true});
                current = undefined;
            }

            finalPos = this.getShowHideXY(show);

            this._doTransition(node, finalPos[0], finalPos[1], this._doneShowHide);
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
             * The Overlay show direction. Should be one of:
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
                    if (V === this.get('showFrom')) {
                        return V;
                    }
                    this._updatePositionShow({showFrom: V});

                    return V;
                }
            },

            /**
             * Boolean indicating if Overlay needs to display mask or not.
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
             * Default transition setting for Overlay
             *
             * @attribute olTrans
             * @type Object
             * @default {dutation: 0.5}
             */
            olTrans: {
                value: {
                    duration: 0.5
                }
            },

            /**
             * Boolean indicating if Overlay needs to adjusting height to match viewport when it shows from top or bottom.
             *
             * @attribute fullPage
             * @type Boolean
             * @default true
             */
            fullPage: {
                value: true,
                validator: Y.Lang.isBoolean,
                lazyAdd: false,
                setter: function (V) {
                    if (V) {
                        this.olResize();
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
            showFrom: function (srcNode) {
                return srcNode.getData('show-from');
            },

            olTrans: function (srcNode) {
                try {
                    return Y.JSON.parse(srcNode.getData('cfg-ol-trans'));
                } catch (e) {
                }
            },

            fullPage: function (srcNode) {
                return (srcNode.getData('full-page') === 'false') ? false : true;
            }
        },

        /**
         * Get all instances of Overlay
         *
         * @method getInstances
         * @static
         * @return {Array} all instances of Overlay
         */
        getInstances: function () {
            return instances;
        },

        /**
         * Get current visilbe Overlay
         *
         * @method getCurrent
         * @static
         * @return {Object | undefined} current visible Overlay. If no any visible Overlay, return undefined.
         */
        getCurrent: function () {
            return current;
        }
    });

Y.Bottle.Overlay = Overlay;

// hide shortcut when click mask
Mask.on(hasTouch ? 'gesturemoveend' : 'click', function () {
    current.hide();
});

// disable scroll on mask
Mask.on('gesturemovestart', function (E) {
    E.preventDefault();
});


}, 'gallery-2013.04.10-22-48', {"requires": ["widget-position", "widget-stack", "gallery-bt-pushpop"]});
