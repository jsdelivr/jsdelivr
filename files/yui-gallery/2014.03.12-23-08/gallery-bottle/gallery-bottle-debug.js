YUI.add('gallery-bottle', function (Y, NAME) {

/**
 * The bottle module collects all UI components, and provides initialize functions.
 *
 * @module gallery-bottle
 */

/**
 * Bottle is the base namespace for all Bottle Classes or statuc methods
 *
 * @class Bottle
 */

//handle body width and height
var BOTTLE_INIT = 'btInit',
    BOTTLE_READY = 'btReady',
    BOTTLE_NATIVE = 'btNative',
    BOTTLE_FIXED = 'btFixed',
    BOTTLE_FOCUS = 'btFocus',
    BOTTLE_SWITCHER = 'btSwitcher',
    BOTTLE_SWITCHER_ACTIVE = 'btActive',

    MATCH_HTML_COMMENT = /^<!--([\s\S]+)-->$/,

    SYNC_SCREEN = 'btSyncScreen',
    SYNC_CONTENT = 'btSyncContent',
    htmlbody = Y.all('html, body'),
    body = htmlbody.item(1),
    btRoot = Y.one('.btRoot') || body.appendChild(Y.Node.create('<div class="btRoot"></div>')),
    inited = body.hasClass(BOTTLE_INIT),
    hideURL = false,
    styles = {
        hidden: {overflow: 'hidden'},
        scroll: {
            overflow: 'auto',
            overflowX: 'hidden'
        }
    },

    nativeScrollPositions = [
    ],

    flags = {
        nativeScroll: true,
        positionFixed: false
    },

    resetBodySize = function (resize) {
        var I = nativeScrollPositions.length - 1,
            S, H;

        if (hideURL && !resize) {
            window.scrollTo(0, 1);
        }

        if (I >= 0) {
            S = nativeScrollPositions[I];
        }

        H = {
            width: Y.Bottle.Device.getBrowserWidth()
        };

        if (flags.nativeScroll) {
            if (S) {
                H.height = Math.max(S.node ? S.node.get('offsetHeight') : S.height, Y.Bottle.Device.getBrowserHeight());
            }
        } else {
            H.height = Y.Bottle.Device.getBrowserHeight();
        }

        body.setStyles(H);
    },

    handleResize = function (force) {
        var scCurrent = Y.Bottle.ShortCut.getCurrent(),
            overlayCurrent = Y.Bottle.Overlay.getCurrent(),
            page = Y.Bottle.Page.getCurrent();

        if (page) {
            resetBodySize(true);
            page.resize();
        } else {
            Y.fire(SYNC_SCREEN);
        }

        if (scCurrent) {
            scCurrent.scResize(force === true);
        }

        if (overlayCurrent) {
            overlayCurrent.olResize(force === true);
        }
    },

    initWidgets = function(css, Cls, Root, param) {
        Root.all(css).each(function (srcNode) {
            new Cls(Y.merge({
                srcNode: srcNode,
                render: true
            }, param));
        });
    },
    
    switcher = function(e) {
        var t = e.currentTarget,
            ani = (t.getAttribute('data-auto') === "false") ? false : true;
            act = true;

        if (t.hasClass(BOTTLE_SWITCHER_ACTIVE)) {
            if (ani) {
                t.removeClass(BOTTLE_SWITCHER_ACTIVE);
            }
            act = false;
        } else {
            if (ani) {
                t.addClass(BOTTLE_SWITCHER_ACTIVE);
            }
        }
        Y.publish(BOTTLE_SWITCHER);
        Y.fire(BOTTLE_SWITCHER, {event: e, action: act});
    },

    /**
     * Initialize bottle UI library , create instances with supported data-roles.
     *
     * @method init
     * @param hideURL {Boolean|Node} auto hide URL Bar when bottle inited or
              orientation changed. If a Node is provided, try to initialize
              Bottle widgets for this Node.
     */
    init = function (initCfg) {
        var pageNode = Y.one('[data-role=page]'),
            initNode = Y.instanceOf(initCfg, Y.Node),
            initRoot = initNode ? initCfg : body,
            pageWidget;

        hideURL = (initCfg === true);

        if (inited && !initNode) {
            return;
        }

        if (!initNode) {
            if (pageNode) {
                htmlbody.setStyles(styles.hidden);
            }

            body.addClass(BOTTLE_INIT);
            inited = true;
        }

        initWidgets('[data-role=viewer]', Y.Bottle.Viewer, initRoot, {axis: 'x'});
        initWidgets('[data-role=photogrid]', Y.Bottle.PhotoGrid, initRoot);
        initWidgets('[data-role=carousel]', Y.Bottle.Carousel, initRoot, {axis: 'x'});
        initWidgets('[data-role=slidetab]', Y.Bottle.SlideTab, initRoot);
        initWidgets('[data-role=loader]', Y.Bottle.Loader, initRoot);

        if (pageNode && !initNode) {
            resetBodySize();

            pageWidget = new Y.Bottle.Page({srcNode: pageNode, render: true});
            pageWidget.resize();

            if (pageWidget.get('nativeScroll')) {
                if (Y.Bottle.Device.getPositionFixedSupport()) {
                    flags.positionFixed = true;
                    body.addClass(BOTTLE_FIXED);
                }
                if (Y.UA.ie > 9) {
                    styles.scroll.overflowX = '';
                    styles.scroll.height = 'auto';
                }
                htmlbody.setStyles(styles.scroll);
                body.addClass(BOTTLE_NATIVE);
                Y.publish(BOTTLE_NATIVE, {fireOnce: true});
                Y.fire(BOTTLE_NATIVE);
                Y.publish(SYNC_SCREEN);
            } else {
                flags.nativeScroll = false;
                resetBodySize();
            }
        }

        initRoot.all('[data-role=shortcut]').each(function (shortcutNode) {
            new Y.Bottle.ShortCut({
                srcNode: shortcutNode,
                visible: false,
                disabled: true,
                render: btRoot
            });
        });

        initRoot.all('[data-role=overlay]').each(function (overlayNode) {
            new Y.Bottle.Overlay({
                srcNode: overlayNode,
                visible: false,
                disabled: true,
                render: btRoot
            });
        });

        if (initNode) {
            return;
        }

        Y.on((Y.UA.mobile === 'Apple') ? 'orientationchange' : 'resize', handleResize, window);
        Y.on(SYNC_CONTENT, handleResize);

        body.delegate('focus', function () {
            body.addClass(BOTTLE_FOCUS);
        }, 'input, select, textarea');


        body.delegate('blur', function () {
            body.removeClass(BOTTLE_FOCUS);
            handleResize(true);
        }, 'input, select, textarea');

        body.delegate('click', switcher, '.btSwitcher');

        body.addClass(BOTTLE_READY).removeClass('btHideSCO').removeClass('btInPlace').removeClass('btHideAll');
        Y.publish(BOTTLE_READY, {fireOnce: true});
        Y.publish(SYNC_CONTENT);
        Y.fire(BOTTLE_READY);
    },

    /**
     * check the node content, if the content is wrapped with <!-- --> , then unwrap it then init() it.
     *
     * @method lazyLoad
     * @param node {Node} do lazy load on this Node
     */
    lazyLoad = function (O) {
        var H = O.getHTML();
        if (H.match(MATCH_HTML_COMMENT)) {
            O.setHTML(H.replace(MATCH_HTML_COMMENT, '$1'));
            Y.Bottle.init(O);
        }
    },

    /**
     * get a flag value
     *
     * @method get
     * @param name {String} the flag name
     */
    get = function (A) {
        return flags[A];
    };

Y.namespace('Bottle').init = init;
Y.namespace('Bottle').get = get;
Y.namespace('Bottle').lazyLoad = lazyLoad;
Y.namespace('Bottle').nativeScrollPositions = nativeScrollPositions;


}, 'gallery-2013.04.10-22-48', {
    "skinnable": "true",
    "requires": [
        "gallery-bt-shortcut",
        "gallery-bt-overlay",
        "gallery-bt-photogrid",
        "gallery-bt-slidetab",
        "gallery-bt-carousel",
        "gallery-bt-loader",
        "gallery-bt-viewer"
    ]
});
