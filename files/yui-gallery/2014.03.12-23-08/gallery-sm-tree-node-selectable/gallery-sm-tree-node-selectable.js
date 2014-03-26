YUI.add('gallery-sm-tree-node-selectable', function (Y, NAME) {

/**
Provides the `Tree.Node.Selectable` class, an extension for `Tree.Node` that
adds methods useful for nodes in trees that use the `Tree.Selectable` extension.

@module tree-selectable
@submodule tree-node-selectable
**/

/**
`Tree.Node` extension that adds methods useful for nodes in trees that use the
`Tree.Selectable` extension.

@class Tree.Node.Selectable
@constructor
@extensionfor Tree.Node
**/

function NodeSelectable() {}

NodeSelectable.prototype = {
    /**
    Returns `true` if this node is currently selected.

    @method isSelected
    @return {Boolean} `true` if this node is currently selected, `false`
        otherwise.
    **/
    isSelected: function () {
        return !!this.state.selected;
    },

    /**
    Selects this node.

    @method select
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `select` event
            will be suppressed.
    @chainable
    **/
    select: function (options) {
        this.tree.selectNode(this, options);
        return this;
    },

    /**
    Unselects this node.

    @method unselect
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `unselect` event
            will be suppressed.
    @chainable
    **/
    unselect: function (options) {
        this.tree.unselectNode(this, options);
        return this;
    }
};

Y.Tree.Node.Selectable = NodeSelectable;


}, 'gallery-2013.02.07-15-27', {"requires": ["gallery-sm-tree-node", "oop"]});
