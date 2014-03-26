YUI.add('gallery-parent-window', function(Y) {

/*global YUI, window */
/**
 * Y.ParentWindow() function for YUI3
 * This utility provides a set of functionalities to interact with the parent window:
 * <ul>
 * <li> Controlling the parent window DOM structure through a Y instance. </li>
 * <li> Sandboxing all YUI driven modules within the iframe instance to avoid polluting the parent window. </li>
 * <li> Supporting multiple versions of YUI running in the same page without messing with the seed files. </li>
 * <li> etc. </li>
 * </ul>
 * Note that CSS modules will not be fetched to avoid polluting the parent window styles, 
 * you will have to handle this use-case manually.
 * 
 * @module gallery-parent-window
 */

/**
 * Generate a new Y instance running on top of the parent window DOM structure 
 * but using the iframe to load required modules.
 * @namespace Y
 * @class ParentWindow
 * @static
 * @param o* Up to four optional configuration objects. This object is stored
 * in YUI.config. See config for the list of supported properties.
 * @return {YUI} Y instance for parent window for chaining
 */

var res = {};
try {
    res.doc = (res.win = window.parent).document;
} catch (e) {
    Y.log('Error trying to access to the parent window property, check the cross domain policy details', 'error', 'gallery-parent-window');
    return;
}

Y.log('Creating new Y instance running on top of the parent window DOM structure', 'info', 'gallery-parent-window');
Y.ParentWindow = function(o2, o3, o4, o5) {
    // adding one more config to force to use the parent window as the base dom structure
    var P = YUI({ win: res.win, doc: res.doc }, o2, o3, o4, o5); 

    // wiring the script tag injection routine to inject JS into the iframe document
    // there is not need to wire the CSS routine, CSS should be injected in the parent window by default
    P.Get.script = function() {
        return Y.Get.script.apply(Y, arguments);
    };

    // returning the parent window Y instance
    return P;
};


}, 'gallery-2010.11.17-21-32' );
