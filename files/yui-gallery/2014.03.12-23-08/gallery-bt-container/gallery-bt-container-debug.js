YUI.add('gallery-bt-container', function (Y, NAME) {

/**
 * This module provides Container Widget which can handle scrollView with/without header/footer.
 *
 * @module gallery-bt-container
 */
var HEIGHT_CHANGE = 'heightChange',
    WIDTH_CHANGE = 'widthChange',
    SYNC_CONTENT = 'btSyncContent',
    fixedPos = Y.Bottle.Device.getPositionFixedSupport(),

    handleFixPos = function (header, fixed, nativeScroll) {
        var node,
            pfix = fixed && fixedPos,
            ns = (nativeScroll !== undefined) ? nativeScroll : this.get('nativeScroll'),
            sv = ns ? null : this.get('scrollView');

        node = this.get(header ? 'headerNode' : 'footerNode');

        if (node) {
            if (ns && pfix) {
                node.addClass('btFixed');
            }

            node.setStyles({
                top: (header && ns && pfix) ? 0 : '',
                bottom: (!header && ns && pfix) ? 0 : ''
            });

            if (fixedPos) {
                this.get('scrollNode').setStyle(
                     header
                     ? 'marginTop'
                     : 'marginBottom',
                     (fixed && ns)
                     ? (node.get('offsetHeight') + 'px')
                     : 0);
            }

            if (sv) {
                this.get(fixed ? 'srcNode' : 'scrollNode').insert(node, header ? 0 : undefined);
            }

            this._syncScrollHeight();
        }
    };

/**
 * A class for constructing container instances.
 *
 * @class Container
 * @param [config] {Object} Object literal with initial attribute values
 * @extends Widget
 * @namespace Bottle
 * @uses WidgetChild
 * @uses Y.zui.Attribute
 * @constructor
 */
Y.namespace('Bottle').Container = Y.Base.create('btcontainer', Y.Widget, [Y.WidgetChild, Y.zui.Attribute], {
    initializer: function () {
        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _btcEventHandlers
         * @type EventHandle
         * @private
         */
        this._btcEventHandlers = new Y.EventHandle([
            this.after(HEIGHT_CHANGE, this._syncScrollHeight),
            this.on(WIDTH_CHANGE, this._syncScrollWidth)
        ]);
    },

    destructor: function () {
        this._btcEventHandlers.detach();

        if (this.get('rendered') && !this.get('nativeScroll')) {
            this.get('scrollView').destroy(true);
        }

        delete this._eventHandlers;
    },

    renderUI: function () {
        var ns = this.get('nativeScroll'),
            srcNode = this.get('srcNode'),
            headerNode = this.get('headerNode'),
            bodyNode = this.get('bodyNode'),
            footerNode = this.get('footerNode'),
            scrollNode = ns ? bodyNode : Y.Node.create('<div class="bt-container-scroll"></div>'),
            scrollView = ns ? null : new Y.ScrollView(Y.merge(this.get('cfgScroll'), {
                axis: 'y',
                srcNode: scrollNode
            }));

        this.set('scrollNode', scrollNode);
        this.set('scrollView', scrollView);

        if (ns) {
            this.get('boundingBox').addClass('btFixedScroll');
            this.set_again('headerFixed');
            this.set_again('footerFixed');
            return;
        }

        scrollView.plug(Y.zui.RAScroll, {horizontal: false, cooperation: true});
        if (!Y.Bottle.Device.getTouchSupport()) {
            scrollView.plug(Y.zui.ScrollHelper);
        }

        srcNode.append(scrollNode);
        scrollNode.append(headerNode);
        scrollNode.append(bodyNode);
        scrollNode.append(footerNode);
        scrollView.render();

        if (Y.UA.ie && Y.UA.ie < 8) {
            scrollView.get('boundingBox').insert('<div class="btDummy"></div>', 'before');
        }

        // When HTML_PARSER running, there was no scrollView,
        // so we trigger value setter function again here.
        this.set_again('headerFixed');
        this.set_again('footerFixed');
        this.set_again('translate3D');

        this._syncScrollHeight();
    },

    /**
     * sync width of the scrollView with self
     *
     * @method _syncScrollWidth
     * @private
     */
    _syncScrollWidth: function (E) {
        var scroll = this.get('scrollView');

        if (scroll) {
            scroll.set('width', E.newVal);
        }
    },

    /**
     * Calculate and refresh height of the scrollView.
     *
     * @method _syncScrollHeight
     * @protected
     */
    _syncScrollHeight: function () {
        var nativeScroll = this.get('nativeScroll'),
            height = nativeScroll ? Y.Bottle.Device.getBrowserHeight() : this.get('height'),
            footer,
            P,
            scroll = this.get('scrollView');

        if (!scroll || !height) {
            return;
        }

        Y.later(1, this, function () {
            footer = this.get('footerNode');

            if (this.get('footerFixed')) {
                height -= footer.get('clientHeight');
            } else {
                if (footer && this.get('fullHeight')) {
                    P = footer.previous();
                    P.setStyle('minHeight', (height - P.getY() - footer.get('clientHeight')) + 'px');
                }
            }

            if (!nativeScroll) {
                height -= scroll.get('boundingBox').get('offsetTop');
                scroll.set('height', height);
            }
        });
    },

    /**
     * Update content size and scroll position
     *
     * @method updateContentSize
     * @static
     */
    updateContentSize: function () {
        var s = this.get('scrollView'),
            H, NS;

        if (s) {
            s._uiDimensionsChange();
            if (s && s._maxScrollY) {
                s.scrollTo(s.get('scrollX'), Math.min(s.get('scrollY'), s._maxScrollY));
            }
        } else {
            H = this.get('contentBox').get('scrollHeight');
            NS = this.get('nativeScroll');
            if (!NS || this.get('height')) {
                this.set('height', H);
            }
            if (NS) {
                Y.fire(SYNC_CONTENT);
            }
        }
    },

    /**
     * Change content html and monitoring image loading events
     *
     * @method setContent
     * @param html {String} new html. if null, do not change html
     * @param monitoring {Boolean} if true, monitoring all image loading to update content size
     */
    setContent: function (html, monitoring) {
        var cb = this.get('contentBox'),
            that = this;

        if (html) {
            cb.setHTML(html);
        }

        if (!monitoring) {
            return;
        }

        cb.all('img').each(function (O) {
            if (!O.get('naturalWidth')) {
                O.once('load', function () {
                    that.updateContentSize();
                });
            }
        });
    }
}, {
    /**
     * Static property used to define the default attribute configuration.
     *
     * @property ATTRS
     * @protected
     * @static
     * @type Object
     */
    ATTRS: {
        /**
         * use browser native scroll and css3 position fixed
         *
         * @attribute nativeScroll
         * @type Boolean
         * @default false
         */
        nativeScroll: {
            value: true,
            validator: function (V) {
                return Y.Lang.isBoolean(V) && !this.get('rendered');
            }
        },

        /**
         * header node of the container
         *
         * @attribute headerNode
         * @type Node
         * @writeOnce
         * @default undefined
         */
        headerNode: {
            value: undefined,
            writeOnce: true,
            setter: function (node) {
                var N = Y.one(node);
                if (N) {
                    N.addClass('btHeader');
                    this.set('headerFixed', N.getData('position') === 'fixed');
                    return N;
                }
            }
        },

        /**
         * footer node of the container
         *
         * @attribute footerNode
         * @type Node
         * @writeOnce
         * @default undefined
         */
        footerNode: {
            value: undefined,
            writeOnce: true,
            setter: function (node) {
                var N = Y.one(node);
                if (N) {
                    N.addClass('btFooter');
                    this.set('footerFixed', N.getData('position') === 'fixed');
                    return N;
                }
            }
        },

        /**
         * body node of the container
         *
         * @attribute bodyNode
         * @type Node
         * @writeOnce
         * @default undefined
         */
        bodyNode: {
            writeOnce: true
        },

        /**
         * A new node be created for scrollview. Scroll node contains bodyNode and none 'fixed' headerNode/footerNode.
         *
         * @attribute scrollNode
         * @type Node
         * @writeOnce
         * @default undefined
         */
        scrollNode: {
            writeOnce: true
        },

        /**
         * ScrollView in the container
         *
         * @attribute scrollView
         * @type ScrollView
         * @writeOnce
         * @default undefined
         */
        scrollView: {
            writeOnce: true
        },

        /**
         * Configuration to create internal scrollView
         *
         * @attribute cfgScroll
         * @type Object
         * @writeOnce
         * @default {flick: {minDistance: 10, minVelocity: 0.3}}
         */
        cfgScroll: {
            value: {
                flick: {
                    minDistance: 10,
                    minVelocity: 0.3
                }
            },
            writeOnce: true,
            lazyAdd: false
        },

        /**
         * Boolean indicating if the content size will scale to make the footer can fit to Container buttom.
         *
         * @attribute fullHeight
         * @type Boolean
         * @default true
         */
        fullHeight: {
            value: true,
            validator: Y.Lang.isBoolean
        },
           
        /**
         * Boolean indicating if hardware acceleration in scrollview
         * animation is disabled.
         *
         * @attribute translate3D
         * @type Boolean
         * @default true
         */
        translate3D: {
            value: true,
            validator: Y.Lang.isBoolean,
            setter: function (V) {
                this.get('scrollNode').toggleClass('bt-translate3d', V);
                return V;
            }
        },

        /**
         * Boolean indicating if header is fixed.
         *
         * @attribute headerFixed
         * @type Boolean
         * @default false
         */
        headerFixed: {
            value: false,
            validator: Y.Lang.isBoolean,
            setter: function (fixed) {
                handleFixPos.apply(this, [true, fixed]);
                return fixed;
            }
        },

        /**
         * Boolean indicating if footer is fixed.
         *
         * @attribute footerFixed
         * @type Boolean
         * @default false
         */
        footerFixed: {
            value: false,
            validator: Y.Lang.isBoolean,
            setter: function (fixed) {
                handleFixPos.apply(this, [false, fixed]);
                return fixed;
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
        headerNode: '> [data-role=header]',
        bodyNode: '> [data-role=body]',
        footerNode: '> [data-role=footer]',

        cfgScroll: function (srcNode) {
            try {
                return Y.JSON.parse(srcNode.getData('cfg-scroll'));
            } catch (e) {
            }
        },

        fullHeight: function (srcNode) {
            if (srcNode.getData('full-height') === 'false') {
                return false;
            }
            return true;
        },

        translate3D: function (srcNode) {
            return (srcNode.getData('translate3d') === 'false') ? false : true;
        }
    }
});


}, 'gallery-2013.04.10-22-48', {
    "requires": [
        "scrollview",
        "widget-child",
        "json-parse",
        "gallery-zui-attribute",
        "gallery-zui-rascroll",
        "gallery-zui-scrollhelper",
        "gallery-bt-device"
    ]
});
