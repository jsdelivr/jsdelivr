YUI.add('gallery-test-dom', function (Y, NAME) {

/**
 * YUI Test DOM Assertions - Utility asserts for functional testing
 *
 * @module gallery-test-dom
 */

"use strict";

/**
 * Checks properties of element to determine if it's visible in viewport or not
 * @method isElementVisible
 * @private
 * @param el {Object} DOM element or YUI Node to test visibility on
 * @returns {Boolean} true if element is visible
 * @see  http://stackoverflow.com/a/15203639
 */
function isElementVisible(el) {
    var node = Y.one(el),
        rect = node.get('region');

    return Y.config.doc.elementFromPoint(rect.left,rect.top) === node.getDOMNode();
}

Y.mix(Y.Assert, {
    /**
     * Asserts that a given node is hidden
     * @method isHidden
     * @public
     * @param el {Object} DOM element or YUI Node to test visibility on
     * @param message {string} (optional) Message to display on test failure
     * @throws {Error} ComparisonFailure if element is visible
     */
    isHidden: function (el, message) {
        message = message || "Content should be hidden";

        Y.Assert.isFalse(isElementVisible(el), message);
    },

    /**
     * Asserts that a given node is visible
     * @method isNotHidden
     * @public
     * @param el {Object} DOM element or YUI Node to test visibility on
     * @param message {string} (optional) Message to display on test failure
     * @throws {Error} ComparisonFailure if element is hidden
     */
    isNotHidden: function (el, message) {
        message = message || "Content should not be hidden";

        Y.Assert.isTrue(isElementVisible(el), message);
    },

    /**
     * Asserts that a given node is a specified height
     * @method isHeight
     * @public
     * @param expectedHeight {Number} height to be checked against
     * @param el {Node} YUI Node to test height on
     * @param message {string} (optional) Message to display on test failure
     * @throws {Error} ComparisonFailure if element is not matching height
     */
    isHeight: function (expectedHeight, el, message) {
        var region = el.get("region");

        message = message || "Expected content to have a height of " + expectedHeight;

        Y.Assert.areSame(expectedHeight, region.height, message);
    },

    /**
     * Asserts that a given node is a specified width
     * @method isWidth
     * @public
     * @param expectedWidth {Number} width to be checked against
     * @param el {Node} YUI Node to test width on
     * @param message {string} (optional) Message to display on test failure
     * @throws {Error} ComparisonFailure if element is not matching width
     */
    isWidth: function (expectedWidth, el, message) {
        var region = el.get("region");

        message = message || "Expected content to have a width of " + expectedWidth;

        Y.Assert.areSame(expectedWidth, region.width, message);
    },

    /**
     * Asserts that a given node is centered in viewport
     * @method isCentered
     * @public
     * @param el {Node} YUI Node to test
     * @throws {Error} ComparisonFailure if element is not centered
     */
    isCentered: function (el) {
        var region = el.get("region"),
            viewport = el.get("viewportRegion"),
            // get center of el
            center = [(region.height / 2), (region.width / 2)],
            // get middle point of el on page
            centerPosition = [region.top + center[0], region.left + center[1]],
            // get middle point of viewport region
            viewportCenter = [(viewport.height / 2), (viewport.width / 2)];

         // this checks that the position is within one of the viewport center (allows for rounding differences in browsers)
        Y.Assert.areWithinEpsilon(viewportCenter[0], centerPosition[0], 1);
        Y.Assert.areWithinEpsilon(viewportCenter[1], centerPosition[1], 1);
    },

    /**
     * Asserts that a given node is the focused element on the page
     * @method isFocused
     * @public
     * @param el {Node} YUI Node to test
     * @param message {string} (optional) Message to display on test failure
     * @throws {Error} ComparisonFailure if element is not focused
     * @note this function may incorrectly fail if browser is not focused when test is executed
     */
    isFocused: function (el, message) {
        message = message || "Element '" + el + "' should be focused";

        Y.Assert.areSame(Y.Node.getDOMNode(el), Y.config.doc.activeElement, message);
    },

    /**
     * Asserts that a given node has a class name defined
     * @method hasClass
     * @public
     * @param el {Node} YUI Node to test
     * @param class {String} class name to check for
     * @param message {string} (optional) Message to display on test failure
     * @throws {Error} ComparisonFailure if element does not have class
     */
    hasClass: function (el, classname, message) {
        message = message || "Element '" + el + "' should have class '" + classname + "'";

        Y.Assert.isTrue(el.hasClass(classname), message);
    },

    /**
     * Asserts that a given node does not have a class name
     * @method lacksClass
     * @public
     * @param el {Node} YUI Node to test
     * @param class {String} class name to check for
     * @param message {string} (optional) Message to display on test failure
     * @throws {Error} ComparisonFailure if element has class
     */
    lacksClass: function (el, classname, message) {
        message = message || "Element '" + el + "' should not have class '" + classname + "'";

        Y.Assert.isFalse(el.hasClass(classname), message);
    }
});

}, 'gallery-2013.05.10-00-54', {"requires": ["yui-base", "test", "node", "gallery-test-extras"]});
