YUI.add('gallery-dom-node-removeclass', function(Y) {

// shorthands
var Y_DOM = Y.DOM,
    Y_Node = Y.Node;

/**
 * Removes a class name from a given element.
 * @method removeClass         
 * @for DOM
 * @param {HTMLElement} element The DOM element. 
 * @param {String} className the class name or class names 
 * (separated by space) to remove from the class attribute
 */
Y_DOM.removeClass = function (node, className) {
    var regexp = Y_DOM._getRegExp,
        trim = Y.Lang.trim;

    if (className) {
        node.className = trim(node.className.replace(regexp('(?:^|\\s+)(' + trim(className).replace(regexp('\\s+', 'g'), '|') + ')(?=\\s+|$)', 'g'), ' ').replace(regexp('[\\n\\t]|\\s{2,}', 'g'), ' '));
    }                 
};

/* The function above can be broken down into parts for readability as follows:
 * 
 * SPACES = /\s+/g;                    // match one or more spaces
 * MULTISPACE = /[\n\t]|\s{2,}/g;      // match tabs, linebreaks and spaces with length >= 2
 * A = trim(className);                // trim className
 * B = A.replace(SPACES, '|')          // replace spaces by "|" (regexp OR)
 * C = /^|\s+( + B + )\s+|$/g;         // regexp to get any provided class e.g: ^|\s+(foo|bar|baz)\s+|$
 * D = node.className.replace(C, ' '); // replace any className match by a single space
 * E = D.replace(MULTISPACE, ' ');     // replace any multi space or tabs or line breaks by a single space
 * F = trim(E);                        // trim final result
 * return F;                           // return node.className with all className(s) removed
 */

// overrides removeClass methods for Node and NodeList
Y_Node.importMethod(Y_DOM, 'removeClass');
Y.NodeList.importMethod(Y_Node.prototype, 'removeClass');


}, 'gallery-2010.09.01-19-12' ,{requires:['dom','node']});
