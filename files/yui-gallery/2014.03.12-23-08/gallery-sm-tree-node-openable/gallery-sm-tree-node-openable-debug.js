YUI.add('gallery-sm-tree-node-openable', function (Y, NAME) {

/**
Provides the `Tree.Node.Openable` class, an extension for `Tree.Node` that
adds methods useful for nodes in trees that use the `Tree.Openable` extension.

@module tree-openable
@submodule tree-node-openable
**/

/**
`Tree.Node` extension that adds methods useful for nodes in trees that use the
`Tree.Openable` extension.

@class Tree.Node.Openable
@constructor
@extensionfor Tree.Node
**/

function NodeOpenable() {}

NodeOpenable.prototype = {
    /**
    Closes this node if it's currently open.

    @method close
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `close` event
            will be suppressed.
    @chainable
    **/
    close: function (options) {
        this.tree.closeNode(this, options);
        return this;
    },

    /**
    Returns `true` if this node is currently open.

    Note: the root node of a tree is always considered to be open.

    @method isOpen
    @return {Boolean} `true` if this node is currently open, `false` otherwise.
    **/
    isOpen: function () {
        return !!this.state.open || this.isRoot();
    },

    /**
    Opens this node if it's currently closed.

    @method open
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `open` event
            will be suppressed.
    @chainable
    **/
    open: function (options) {
        this.tree.openNode(this, options);
        return this;
    },

    /**
    Toggles the open/closed state of this node, closing it if it's currently
    open or opening it if it's currently closed.

    @method toggle
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, events will be
            suppressed.
    @chainable
    **/
    toggle: function (options) {
        this.tree.toggleNode(this, options);
        return this;
    }
};

Y.Tree.Node.Openable = NodeOpenable;


}, 'gallery-2013.02.07-15-27', {"requires": ["gallery-sm-tree-node"]});
