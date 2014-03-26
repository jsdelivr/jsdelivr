YUI.add('gallery-node-extras', function(Y) {

/**
 * An expanded collection of methods for Y.Node
 *
 * @module gallery-node-extras
 * @class Node
 */
var NodePrototype = Y.Node.prototype,
    originalOne = NodePrototype.one,
    originalAll = NodePrototype.all,
    domNode = Y.Node.getDOMNode(Y.config.doc.createElement('div'));

/**
 * Get the text representation of the current Node, including all of it's children
 * @readOnly
 * @config outerHTML
 * @type string
 */
Y.Node.ATTRS.outerHTML = {
    readOnly: true,
    getter: domNode.outerHTML ?
        function() { return this._node.outerHTML; } :
        function() { return Y.Node.create('<div />').append(this.cloneNode(true)).get('innerHTML'); }
};

/**
 * Wraps the content of this Node with new HTML
 * @method wrapInner
 * @for Node
 * @for NodeList
 * @param {string | Y.Node | DOMNode} The HTML Fragment to wrap around the contents of the current node.
 * @chainable
 */
NodePrototype.wrapInner = function(html) {
    var wrapper = Y.Node.create(html),
        container = wrapper.one('*:empty') || wrapper,
        list = this.all('> *');
    if (list.size() > 0) {
        list.each(function(node) {
                    container.append(node);
                });
    } else {
        container.setContent(this.getContent());
        this.setContent('');
    }
    return this.append(wrapper);
};

Y.NodeList.importMethod(NodePrototype, 'wrapInner');

/**
 * Returns a Document Fragment as a Y.Node
 * @method frag
 * @for Node
 * @static
 */
Y.Node.frag = function() {
    return new Y.Node(Y.config.doc.createDocumentFragment());
};

/**
 * Extends existing Y.Node.one to take no argument and return the immediate
 * child of the current node.
 * @method one
 * @for Node
 * @param {string|Y.Node} node The node or selector to search for
 * @return A child node matching the node argument, if defined, or the first
 * child
 */
NodePrototype.one = function(node) {
    node = node || "> *";
    return originalOne.call(this, node);
};

/**
 * Extends existing Y.Node.all to take no argument and return all the immediate
 * children as a NodeList. This essentially makes nodeInstance.all() a synonym
 * for nodeInstane.get('children')
 * @method all
 * @for Node
 * @param Node {string|Y.Node} The selector to be passed to the underlying all
 * implementation
 * @return A NodeList containing all the immediate children, or the children
 * that match the argument selector
 */
NodePrototype.all = function(node) {
    if (node) {
        return originalAll.call(this, node);
    } else {
        return this.get('children');
    }
};

/**
 * Returns a NodeList off all the siblings after this node which match the given selector
 * @method nextAll
 * @param {string} The CSS Selector to filter the siblings against
 */
NodePrototype.nextAll = function(selector) {
    var siblings = this.ancestor().get('children');
    siblings = siblings.slice(siblings.indexOf(this)+1);
    return siblings.filter(selector);
};

/**
 * Returns a NodeList off all the siblings before this node which match the given selector
 * @method prevAll
 * @param {string} The CSS Selector to filter the siblings against
 */
NodePrototype.prevAll = function(selector) {
    var siblings = this.ancestor().get('children');
    // There is a bug in the nodelist-arrays submodule, so I need to call the method directly
    siblings = new Y.NodeList(siblings._nodes.slice(0, siblings.indexOf(this)));
    return siblings.filter(selector);
};

/**
 * Inserts the current node as the first child element of the given node
 * @method prependTo
 * @param {Node} The node to prepend to
 * @chainable 
 */
NodePrototype.prependTo = function(node) {
    Y.one(node).insert(this, 0);
    return this;
};

domNode = undefined;


}, 'gallery-2011.12.14-21-12' ,{requires:['node']});
