YUI.add('gallery-zui-placeholder', function (Y, NAME) {

/**
 * The Placeholder module provides utilities to enable placeholder
 * support for older browsers
 *
 * @module gallery-zui-placeholder
 */
var isNativeSupport = ('placeholder' in document.createElement('input')),
    txtPlaceHolderInstalled = 'data-phok',
    clsPlaceHolderBlur = 'zui-phblur',
    cntInstall,
    fNull = function () {},
    detachMap = {},

    handleFocus = function (E) {
        E.currentTarget.removeClass(clsPlaceHolderBlur);

        if (E.currentTarget.get('value') === E.currentTarget.getAttribute('placeholder')) {
            E.currentTarget.set('value', '');
        }
    },

    handleBlur = function (E) {
        var v = E.currentTarget.get('value'),
            p = E.currentTarget.getAttribute('placeholder');

        if (p === '') {
            return;
        }

        if (v === '') {
            E.currentTarget.set('value', p);
        }

        if (v === p || v === '') {
            E.currentTarget.addClass(clsPlaceHolderBlur);
        }
    },

    isInstalled = function (O, R) {
        if (O.getAttribute(txtPlaceHolderInstalled) === '1') {
            if (R) {
                O.setAttribute(txtPlaceHolderInstalled, '');
            }
            return true;
        }
        O.setAttribute(txtPlaceHolderInstalled, '1');
    },

    initPH = function (O) {
        // if is already focused, run handleFocus 1 time
        if (O.compareTo(document.activeElement)) {
            handleFocus({currentTarget: O});
        } else {
            handleBlur({currentTarget: O});
        }

        cntInstall += 1;
    },

    installPH = function (O) {
        // only install once
        if (isInstalled(O)) {
            return;
        }

        // if no placeholder, stop
        if (!O.getAttribute('placeholder')) {
            return;
        }

        // handle focus, blur
        O.on('focus', handleFocus);
        O.on('blur', handleBlur);

        initPH(O);
    },

    uninstallPH = function (O) {
        if (!isInstalled(O, 1)) {
            return;
        }

        // if no placeholder, stop
        if (!O.getAttribute('placeholder')) {
            return;
        }

        // remove focus, blur handler
        O.detach('focus', handleFocus);
        O.detach('blur', handleBlur);

        handleFocus({currentTarget: O});
        cntInstall += 1;
    };
/**
 * A static object to access zui placeholder properties and methods
 * @namespace zui
 * @class placeholder
 */
Y.namespace('zui').placeholder = {
    /**
     * whether this browser supports placeholder natively
     * @property isNative
     * @static
     * @type bool
     */
    isNative: isNativeSupport,

    /**
     * A string used to set attribute to indicate this node installed placeholder or not
     * @property txtInstalled
     * @static
     * @final
     * @type string
     */
    txtInstalled: txtPlaceHolderInstalled,


    /**
     * A string used to set classname when this input should show placeholder
     * @property clsBlur
     * @static
     * @final
     * @type string
     */
    clsBlur: clsPlaceHolderBlur,

    /**
     * use this method to install placeholder on nodes
     * @method install
     * @param elements {NodeList || Node || HTMLElement || cssString} Optional.
     *        The elements to install placeholder support
     * @return {Array} An array contains [TotalElements, InstalledElements] when
     *         no native placeholder support. Return undefined when the browser
     *         suppports placeholder natively. Return [0, 0] when can not find nodes
     * @static
     */
    install: isNativeSupport ? fNull : function (R) {
        var nodes = (R && R.each) ? R : Y.all(R || 'input, textarea');

        cntInstall = 0;

        if (!nodes) {
            return [0, 0];
        }
        nodes.each(installPH);

        return [nodes.size(), cntInstall];
    },

    /**
     * use this method to uninstall placeholder on nodes
     * @method uninstall
     * @param elements {NodeList || Node || HTMLElement || cssString} Optional.
     * The elements to remove placeholder support
     * @return {Array} An array contains [TotalElements, UninstalledElements]
     *         when no native placeholder support. Return undefined when the browser
     *         suppports placeholder natively. Return [0, 0] when can not find nodes
     * @static
     */
    uninstall: isNativeSupport ? fNull : function (R) {
        var nodes = (R && R.each) ? R : Y.all(R || 'input, textarea');

        cntInstall = 0;

        if (!nodes) {
            return [0, 0];
        }
        nodes.each(uninstallPH);

        return [nodes.size(), cntInstall];
    },

    /**
     * use this method to install placeholder on node with event delegate
     * @method installDelegate
     * @param element {Node || HTMLElement || cssString} Optional. The parent
     *        element to install placeholder support
     * @param elements {NodeList || Node || HTMLElement || cssString} Optional.
     *        The child elements to handle placeholder
     * @return {Array} An array contains [1, InstalledElements] when no native
     *         placeholder support. Return undefined when the browser suppports
     *         placeholder natively. Return [0, 0] when can not find parent node.
     *         Return [-1, -1] when 'node-event-delegate' not loaded.
     * @static
     */
    installDelegate: isNativeSupport ? fNull : function (P, R) {
        var parent = P ? Y.one(P) : Y.one('body'),
            children = R || 'input, textarea';

        cntInstall = 0;

        if (!parent) {
            return [0, 0];
        }

        if (!parent.delegate) {
            return [-1, -1];
        }

        if (isInstalled(parent)) {
            return [1, 0];
        }

        detachMap[parent.get('id')] = [
            parent.delegate('focus', handleFocus, children),
            parent.delegate('blur', handleFocus, children)
        ];

        parent.all(children).each(initPH);

        return [1, cntInstall];
    },

    /**
     * use this method to uninstall placeholder on node with event delegate
     * @method uninstallDelegate
     * @param element {Node || HTMLElement || cssString} Optional.
     *        The parent element to uninstall placeholder support
     * @param elements {NodeList || Node || HTMLElement || cssString} Optional.
     *        The child elements to unhandle placeholder
     * @return {Array} An array contains [1, UninstalledElements] when no native
     *         placeholder support. Return undefined when the browser suppports
     *         placeholder natively. Return [0, 0] when can not find parent node.
     *         Return [-1, -1] when 'node-event-delegate' not loaded.
     * @static
     */
    uninstallDelegate:  isNativeSupport ? fNull : function (P, R) {
        var parent = P ? Y.one(P) : Y.one('body'),
            id = parent ? parent.get('id') : 0,
            children = R || 'input, textarea',
            detach = 0;

        if (!parent) {
            return [0, 0];
        }

        if (!parent.delegate) {
            return [-1, -1];
        }

        if (!isInstalled(parent, 1)) {
            return [1, 0];
        }

        if (detachMap[id]) {
            parent.detach(detachMap[id][0]);
            parent.detach(detachMap[id][1]);
            delete detachMap[id];
            parent.all(children).each(function (O) {
                detach += 1;
                handleFocus({currentTarget: O});
            });
            return [1, detach];
        }

        return [1, -1];
    }
};


}, 'gallery-2013.02.07-15-27', {"requires": ["node-base", "event-focus"], "optional": ["node-event-delegate"]});
