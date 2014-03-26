YUI.add('gallery-bt-device', function (Y, NAME) {

/*global screen */
/**
 * Provide information about browser and device by Y.UA.
 *
 * @module gallery-bt-device
 * @static
 */

/**
 * The Y.Bottle.Device class is static, and provides device information
 *
 * @class Device
 * @namespace Bottle
 */
var positionFixedSupport = null,
    touchSupport = null,

    scrollBase,

    Device = {

    /**
     * The name of current device, should be: iphone , ipad, ipod, android, null
     * @static
     * @type string
     * @property Name
     */
    Name: null,

    /**
     * The name of current OS, should be: Android, Apple, null
     * @static
     * @type string
     * @property OS
     */
    OS: null,

    /**
     * The version of current OS
     * @static
     * @type string
     * @property OS_Version
     */
    OS_Version: 0,

    /**
     * The name of current browser, will be: webkit, ie, safari, firefox, chrome
     * @static
     * @type string
     * @property Browser
     */
    Borwser: null,

    /**
     * get current Device touch support status
     * @static
     * @method getTouchSupport
     * @return {Boolean}
     */
    getTouchSupport: function () {
        return touchSupport;
    },

    /**
     * get current Device touch support status
     * @static
     * @method getTouchSupport
     * @return {Boolean}
     */
    getPositionFixedSupport: function () {
        var positionFixedParent,
            py;
        if (positionFixedSupport !== null) {
            return positionFixedSupport;
        }

        if (Y.UA.chrome >= 4 || Y.UA.android >= 2.2 || Y.UA.ios >= 5) {
            return (positionFixedSupport = true);
        }

        positionFixedParent = Y.one('.bt_posfixed') || Y.one('body').appendChild('<div class="bt_posfixed"><div><span></span></div></div>');
        py = positionFixedParent.one('div').set('scrollTop', '30px').one('span').getY();
        positionFixedParent.remove();

        return (positionFixedSupport = (py === 1));
    },

    /**
     * get current Device Width in pixel
     * @static
     * @method getDeviceWidth
     * @return {Number} an integer
     */
    getDeviceWidth: function () {
        return screen.width;
    },

    /**
     * get current Device Height in pixel
     * @static
     * @method getDeviceHeight
     * @return {Number} an integer
     */
    getDeviceHeight: function () {
        return screen.height;
    },

    /**
     * get current Browser Width in pixel
     * @static
     * @method getBrowserWidth
     * @return {Number} an integer
     */
    getBrowserWidth: function () {
        return window.innerWidth || document.documentElement.clientWidth;
    },

    /**
     * get current Browser Height in pixel
     * @static
     * @method getBrowserHeight
     * @return {Number} an integer
     */
    getBrowserHeight: function () {
        return window.innerHeight || document.documentElement.clientHeight;
    },

    /**
     * get current Browser scrolling base element
     * @static
     * @method getScrollBase
     * @return {Node} browser scrolling element
     */
    getScrollBase: function () {
        return scrollBase;
    },

    /**
     * get current Browser scrolling position Y
     * @static
     * @method getScrollY
     * @return {Number} browser scrolling position
     */
    getScrollY: function () {
        return touchSupport ? scrollBase.get('scrollTop') : Y.DOM.docScrollY();
    },

    /**
     * make browser scroll to position X, Y
     * @static
     * @method scrollTo
     * @param X {Number} scroll to X position
     * @param Y {Number} scroll to Y position
     */
    scrollTo: function (X, Y) {
         if (touchSupport) {
             scrollBase.set('scrollLeft', X).set('scrollTop', Y);
         } else {
             window.scrollTo(X, Y);
         }
    }
};

touchSupport = (
    ((Y.config.win && ('ontouchstart' in Y.config.win))
    || (Y.config.win && ('msPointerEnabled' in Y.config.win.navigator))
    ) && !(Y.UA.chrome && Y.UA.chrome < 6)
);

scrollBase = touchSupport ? Y.one('body') : Y.one('html');

//init data
if (Y.UA.iphone) {
    Device.Name = 'iphone';
    Device.OS = 'Apple';
    Device.OS_Version = Y.UA.iphone;
    Device.Browser = 'safari';
    Device.B_Version = Y.UA.safari;
} else if (Y.UA.ipad) {
    Device.Name = 'ipad';
    Device.OS = 'Apple';
    Device.OS_Version = Y.UA.ipad;
    Device.Browser = 'safari';
    Device.B_Version = Y.UA.safari;
} else if (Y.UA.ipod) {
    Device.Name = 'ipad';
    Device.OS = 'Apple';
    Device.OS_Version = Y.UA.ipod;
    Device.Browser = 'safari';
    Device.B_Version = Y.UA.safari;
} else if (Y.UA.mobile === 'Android') {
    Device.Name = 'android';
    Device.OS = 'android';
    Device.OS_Version = Y.UA.android;
    Device.Browser = 'webkit';
    Device.B_Version = Y.UA.webkit;
} else if (Y.UA.ie) {
    Device.Browser = 'ie';
    Device.B_Version = Y.UA.ie;
} else if (Y.UA.gecko) {
    Device.Browser = 'firefox';
    Device.B_Version = Y.UA.gecko;
} else if (Y.UA.chrome) {
    Device.Browser = 'chrome';
    Device.B_Version = 'chrome';
}

Y.namespace('Bottle').Device = Device;


}, 'gallery-2013.04.10-22-48', {"requires": ["node-screen"]});
