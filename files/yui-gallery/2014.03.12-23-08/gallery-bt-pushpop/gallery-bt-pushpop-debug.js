YUI.add('gallery-bt-pushpop', function (Y, NAME) {

/**
 * Provide PushPop widget extension to handle Container push/pop transition.
 *
 * @module gallery-bt-pushpop
 * @static
 */
var RENDERUI = 'renderUI',

    PUSHPOP = 'pushpop',

    HEIGHT_CHANGE = 'heightChange',
    WIDTH_CHANGE = 'widthChange',
    VISIBLE_CHANGE = 'visibleChange',

    ADDCHILD = 'addChild',

    UNDERLAY_CFGS = {
        none: 'none',
        'with': 'with',
        after: 1
    },

    DIRECTIONS = {
        right: [1, 0],
        left: [-1, 0],
        top: [0, -1],
        bottom: [0, 1],
        tr: [1, -1],
        br: [1, 1],
        tl: [-1, -1],
        bl: [-1, 1]
    },

    nodeBody = Y.one('body'),
    pfixed = Y.Bottle.Device.getPositionFixedSupport(),

    moveWidget = function (W, T) {
        W.get('boundingBox').setStyles({
            left: T.left,
            top: T.top
        });
    },

/**
 * PushPop extension that adds push, pop unshift animation and methods to Widget Parent
 *
 * @class PushPop
 * @namespace Bottle
 * @param [config] {Object} User configuration object
 */
PushPop = function () {
    /**
     * internal eventhandlers, keep for destructor
     *
     * @property _bppEventHandlers
     * @type EventHandle
     * @private
     */
    this._bppEventHandlers = new Y.EventHandle([
        Y.after(this._renderUIPushPop, this, RENDERUI),

        this.before(ADDCHILD, this._beforePPAddChild),
        this.after(ADDCHILD, this._afterPPAddChild),
        this.after(WIDTH_CHANGE, this._afterPPWidthChange),
        this.after(HEIGHT_CHANGE, this._afterPPHeightChange),
        this.on('destroy', this._destroyPushPop)
    ]);
};

/**
 * Static property used to define the default attribute configuration.
 *
 * @property ATTRS
 * @protected
 * @type Object
 * @static
 */
PushPop.ATTRS = {
    /**
     * Use native browser scroll
     *
     * @attribute action
     * @type String
     * @default unveil
     */
    nativeScroll: {
        value: true,
        validator: Y.Lang.isBool,
        writeOnce: 'initOnly',
        setter: function (V) {
            var B = this.get('boundingBox');

            if (B) {
                B.toggleClass('btp-nscroll', V);
            }
            return V;
        }
    },

    /**
     * Default child class
     *
     * @attribute defaultChildType
     * @type Object
     * @default Y.Bottle.Container
     */
    defaultChildType: {
        value: Y.Bottle.Container
    },

    /**
     * Default css3 selector to add children when rendering
     *
     * @property childQuery
     * @type String
     * @default '> [data-role=container]'
     */
    childQuery: {
        value: '> [data-role=container]',
        writeOnce: true
    },

    /**
     * Default initial attributes for all children when rendering
     *
     * @property cfgChild
     * @type Object
     * @default {}
     */
    cfgChild: {
        value: {},
        validator: Y.Lang.isObject,
        writeOnce: true
    },

    /**
     * Underlay animation, can be one of:
     * <dl>
     *     <dt>none</dt><dd>no underlay animation
     *     <dt>with</dt><dd>same time with  push/pop animation</dd>
     *     <dt>after</dt><dd>just after push/pop animation ends</dd>
     *     <dt>{Number}</dt><dd>wait N million seconds after push/pop animation ends</dd>
     * </dl>
     *
     * @attribute underlay
     * @type String
     * @default none
     */
    underlay: {
        value: 'none',
        validator: function (V) {
            return UNDERLAY_CFGS[V] || Y.Lang.isNumber(V);
        },
        setter: function (V) {
            return UNDERLAY_CFGS[V];
        }
    },

    /**
     * Default transition setting for push pop
     *
     * @attribute ppTrans
     * @type Object
     * @default {dutation: 0.5}
     */
    ppTrans: {
        value: {
            duration: 0.5
        },
        lazyAdd: false,
        validator: Y.Lang.isObject,
        setter: function (cfg) {
            this._updateTransitions(0, cfg);
            return cfg;
        }
    },

    /**
     * Push direction, can be one of 'right', 'left', 'top', 'bottom', 'tr', 'br', 'tl', 'bl'
     *
     * @attribute pushFrom
     * @type String
     * @default 'right'
     */
    pushFrom: {
        value: 'right',
        lazyAdd: false,
        validator: function (D) {
            return DIRECTIONS[D];
        },
        setter: function (D) {
            this._updateTransitions(D);
            return D;
        }
    }
};

/**
 * Static property used to define the default HTML parsing rules
 *
 * @property HTML_PARSER
 * @protected
 * @static
 * @type Object
 */
PushPop.HTML_PARSER = {
    nativeScroll: function (srcNode) {
        var D = srcNode.getData('native-scroll');

        if (D === 'false') {
            return false;
        }

        if (D === 'true') {
            return true;
        }
        return Y.Bottle.Device.getTouchSupport();
    },
    childQuery: function (srcNode) {
        return srcNode.getData('child-query');
    },
    cfgChild: function (srcNode) {
        try {
            return Y.JSON.parse(srcNode.getData('cfg-child'));
        } catch (e) {
        }
    },
    ppTrans: function (srcNode) {
        try {
            return Y.JSON.parse(srcNode.getData('cfg-pp-trans'));
        } catch (e) {
        }
    },
    pushFrom: function (srcNode) {
        return srcNode.getData('push-from');
    },
    underlay: function (srcNode) {
        return srcNode.getData('underlay');
    }
};

PushPop.prototype = {
    initializer: function () {
        var once;

        if (this.get('visible')) {
            this._addAllChildren();
        } else {
            once = this.after(VISIBLE_CHANGE, function (E) {
                if (E.newVal) {
                    once.detach();
                    this._addAllChildren();
                }
            });
        }
    },

    /**
     * query and get all children then add into this widget
     *
     * @method _addAllChildren
     * @protected
     */
    _addAllChildren: function () {
        var query = this.get('childQuery'),
            cfg = this.get('cfgChild'),
            L;

        if (!query || this._bppAllAdded) {
            return;
        }

        this._bppAllAdded = true;

        this.get('contentBox').all(query).each(function (O) {
            this.add(Y.merge(cfg, {srcNode: O, disabled: true}));
        }, this);

        L = this.item(this.size() - 1);
        if (L) {
            L.enable();
        }
    },

    /**
     * do clean up jobs when destroyed
     *
     * @method _destroyPushPop
     * @private
     */
    _destroyPushPop: function () {
        this._bppEventHandlers.detach();
        delete this._bppEventHandlers;
    },

    /**
     * sync one size (height or width) with all children
     *
     * @method _updateTransitions
     * @param [direction] {String} should be one of 'right', 'left', 'top', 'bottom',
              'tr', 'br', 'tl', 'bl'. If omitted, current 'pushFrom' attribute will be used
     * @param [transition] {Object} transition config. If omitted, current 'ppTrans' attribute will be used
     * @protected
     */
    _updateTransitions: function (direction, transition) {
        var D = direction || this.get('pushFrom'),
            trans = transition || this.get('ppTrans'),
            xy = DIRECTIONS[D];

        this._PUSHPOP_TRANS = Y.merge(trans, {
            left: xy[0] * this.get('width') + 'px',
            top: xy[1] * this.get('height') + 'px'
        });

        this._DONE_TRANS = Y.merge(trans, {
            left: 0,
            top: 0
        });

        this._UNDERLAY_TRANS = Y.merge(trans, {
            left: -xy[0] * this.get('width') + 'px',
            top: -xy[1] * this.get('height') + 'px'
        });
    },

    /**
     * sync one size (height or width) with all children
     *
     * @method _syncOneSize
     * @param sideName {String} should be 'width' or 'height'
     * @protected
     */
    _syncOneSide: function (HW) {
        var hw = this.get(HW);
        this.each(function () {
            this.set(HW, hw);
        });
        this._updateTransitions();
    },

    /**
     * handle child Widget height when self height changed
     *
     * @method _afterPPHeightChange
     * @protected
     */
    _afterPPHeightChange: function () {
        this._syncOneSide('height');
    },

    /**
     * handle child Widget width when self width changed
     *
     * @method _afterPPWidthChange
     * @protected
     */
    _afterPPWidthChange: function () {
        this._syncOneSide('width');
    },

    /**
     * handle add child Widget, if not defaultChildType, cancel add
     *
     * @method _beforePPAddChild
     * @protected
     */
    _beforePPAddChild: function (E) {
        if (Y.instanceOf(E.child, this.get('defaultChildType'))) {
            E.child.set('nativeScroll', this.get('nativeScroll'));
        } else {
            E.halt();
        }
    },

    /**
     * handle child Widget, sync size after add
     *
     * @method _afterPPAddChild
     * @protected
     */
    _afterPPAddChild: function (E) {
        this.sync(E.child);
    },

    /**
     * add proper classname for pushpop
     *
     * @method _renderUIPushPop
     * @protected
     */
    _renderUIPushPop: function () {
        this.get('boundingBox').addClass(Y.Widget.getClassName(PUSHPOP));
    },

    /**
     * Get scroll position for both native scroll or Page Container scrollView.
     *
     * @method getScrollY
     * @return scrollY {Number} the position of vertical scroll
     */
    getScrollY: function () {
        return this.get('nativeScroll') ? Y.Bottle.Device.getScrollY() : this.topScroll().get('scrollY');
    },

    /**
     * Get scroll content height for both native scroll or Page Container scrollView.
     *
     * @method getScrollHeight
     * @return scrollY {Number} the position of vertical scroll
     */
    getScrollHeight: function () {
        return this.get('nativeScroll') ? Y.DOM.docHeight() : this.topScroll()._maxScrollY;
    },

    /**
     * Scroll the page to a position or a Node, works in scrollView mode and native scroll mode.
     *
     * @method scrollTo
     * @param position {Number|Node} the Y position or the Node to scroll into viewport.
     * @param [duration] {Number} ms of the scroll animation.
     * @static
     */
    scrollTo: function (position, duration) {
        var S = this.topScroll(),
            Y;
        if (this.get('nativeScroll')) {
            Y.Bottle.Device.scrollTo(0, position.getY ? position.getY() : position);
        } else {
            if (position.getY) {
                Y = S.get('scrollY');
                S.scrollTo(0, 0, 0);
                position = position.getY() - S.get('boundingBox').getY();
                S.scrollTo(0, Y, 0);
            }
            S.scrollTo(0, position, duration);
        }
    },

    /**
     * When nativeScroll enabled, set page size and simulate original scroll position
     * with new top position; or restore to original page size and scroll position.
     *
     * @method resetScroll
     * @param height {Number|Node} new page height, or new Node element to align with height.
     *        if undefined, restore to original page size and scroll position.
     * @param position {Number} new page position. if undefined, scroll to 0.
     */
    resetScroll: function (height, position) {
        var bb = this.get('boundingBox'),
            S,
            H = (height && height.get) ? height.get('offsetHeight') : height;

        if (height) {
            S = this.getScrollY();
            Y.Bottle.nativeScrollPositions.push({
                height: H,
                pageHeight: nodeBody.getComputedStyle('height'),
                pageScroll: S,
                node: height.get ? height : null
            });
            nodeBody.setStyles({
                overflow: 'hidden',
                height: Math.max(H, Y.Bottle.Device.getBrowserHeight()) + 'px'
            });
            Y.Bottle.Device.scrollTo(0, (position ? position : 0));
            bb.setStyles({
                top: - S + 'px',
                position: pfixed ? 'fixed' : 'relative'
            });
        } else {
            H = Y.Bottle.nativeScrollPositions.pop();
            nodeBody.setStyles({
                overflow: '',
                height: 'auto'
            });
            bb.setStyles({
                top: 0,
                position: ''
            });
            Y.Bottle.Device.scrollTo(0, H.pageScroll);
        }
    },

    /**
     * sync width and height from DOM to widget object
     *
     * @method syncWH
     */
    syncWH: function () {
        var O = this.get('boundingBox'),
            P = this.get('contentBox'),
            W = O.get('offsetWidth') || P.get('offsetWidth'),
            H = O.get('offsetHeight') || P.get('offsetHeight');

        if (!this.get('height') && H && !this.get('nativeScroll')) {
            this.set('height', H);
        }

        if (!this.get('width') && W) {
            this.set('width', W);
        }
    },

    /**
     * sync a widget width and height with self
     *
     * @method sync
     * @param widget {Widget} widget to be synced
     * @chainable
     */
    sync: function (widget) {
        widget.set('width', this.get('width'));
        widget.set('height', this.get('height'));
        return this;
    },

    /**
     * move the widget by setting css top and left only
     *
     * @method absMove
     * @param x {Number} x position
     * @param y {Number} y position
     * @chainable
     */
    absMove: function (x, y) {
        this.get('boundingBox').setStyles({
            top: y + 'px',
            left: x + 'px'
        });
        return this;
    },

    /**
     * get top (last) item
     *
     * @method topItem
     * @return {WidgetChild} the top widget child
     */
    topItem: function () {
        this._addAllChildren();
        return this.item(this.size() - 1);
    },

    /**
     * Update content size and scroll position
     *
     * @method updateContentSize
     * @return updated {Boolean} true when content size updated, false when no child
     */
    updateContentSize: function () {
        var O = this.topItem();

        if (O) {
            O.updateContentSize();
            return true;
        } else {
            return false;
        }
    },

    /**
     * get top (last) scrollView
     *
     * @method topScroll
     * @return {ScrollView|undefined} the scrollview inside top widget child. If scrollview can not be found, return undefined.
     */
    topScroll: function () {
        var top = this.topItem();

        return top ? top.get('scrollView') : undefined;
    },

    /**
     * get child by widget or index
     *
     * @method getChild
     * @param widget {Widget | Integer} the child widget or index of child
     * @return { mixed } the child widget or undefined
     */
    getChild: function (widget) {
        if (Y.instanceOf(widget, this.get('defaultChildType'))) {
            return widget;
        }
        if (Y.Lang.isNumber(widget)) {
            return this.item(widget);
        }
    },

    /**
     * move a child widget to a new position
     *
     * @method moveChild
     * @param widget {Widget | Integer} the child widget or index of child
     * @param transition {Object} transition configuration
     * @param [done] {Boolean | Function} When is true, move the child directly. When is a function, callback the function when transition done.
     * @chainable
     */
    moveChild: function (widget, transition, done) {
        var W = this.getChild(widget),
            that = this;

        if (done === true) {
            moveWidget(W, transition);
        } else {
            if (this.get('visible')) {
                W.get('boundingBox').transition(transition, function () {
                    if (done) {
                        done.apply(that);
                    }
                });
            } else {
                moveWidget(W, transition);
                if (done) {
                    done.apply(that);
                }
            }
        }
        return this;
    },

    /**
     * push a widget into html, overlap on plugged widget
     *
     * @method push
     * @param widget {Widget} widget to be pushed
     * @chainable
     */
    push: function (widget) {
        var index = this.size() - 1,
            underlay = this.get('underlay');

        if (underlay === 'with') {
            this.moveChild(index, this._UNDERLAY_TRANS);
        }

        this.add(widget);
        this.moveChild(widget, this._PUSHPOP_TRANS, true);

        if (Y.Lang.isNumber(underlay)) {
            return this.moveChild(index, this._UNDERLAY_TRANS, function () {
                Y.later(underlay, this, function () {
                    this.moveChild(widget, this._DONE_TRANS, function () {
                        this.item(index).disable();
                    });
                });
            });
        } else {
            return this.moveChild(widget, this._DONE_TRANS, function () {
                this.item(index).disable();
            });
        }
    },

    /**
     * pop current widget off html, and remove the widget from PushPop widget
     *
     * @method pop
     * @param [keep] {Boolean} <b>true</b> means do not destroy the widget. Default to destroy the widget after pop animation.
     * @chainable
     */
    pop: function (keep) {
        var index = this.size() - 1,
            widget = this.item(index),
            w2 = this.item(index - 1),
            underlay = this.get('underlay');

        if (!widget) {
            return this;
        }

        if (w2) {
            w2.enable();
        }

        if (underlay !== 'none') {
            this.moveChild(index - 1, this._UNDERLAY_TRANS, true);
            if ((underlay === 'with') && index) {
                this.moveChild(index - 1, this._DONE_TRANS);
            }
        }

        return this.moveChild(widget, this._PUSHPOP_TRANS, function () {
            widget.remove();
            if (!keep) {
                Y.later(850, null, function() {
                    widget.destroy(true);
                });
            }
            if (index && Y.Lang.isNumber(underlay)) {
                Y.later(underlay, this, function () {
                    this.moveChild(index - 1, this._DONE_TRANS);
                });
            }
        });
    }
};

Y.namespace('Bottle').PushPop = PushPop;


}, 'gallery-2013.04.10-22-48', {"requires": ["base-build", "widget-parent", "gallery-bt-container"]});
