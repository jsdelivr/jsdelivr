YUI.add('gallery-node-setdir', function(Y) {

var otherDirection = {ltr: 'rtl', rtl: 'ltr'};

// Takes a YUI Node and sets its direction to the value specified.
// Supported input values are "rtl" and "ltr".
//
// A synthetic event called "directionChange" will be fired, but only
// when the actual direction of the node switches. Two parameters will
// be passed to the callback function, the first would be the YUI Node
// and the second the direction set.
Y.Node.addMethod('setDirection', function (node, direction) {
    var that, previousDirection;

    if (direction === "ltr" || direction === "rtl") {

        // FIXME: 'this' doesn't work in certain cases, sometimes
        // leading to a previous node's direction being set. This may be
        // a bug in addMethod.
        that = Y.one(node);

        // This is the best known way to find the actual direction of a node
        // on a page. Note that according to the CSS specification, setting
        // the 'dir' attribute affects the computed value of the 'direction'
        // style.
        previousDirection = that.getStyle("direction");

        // Set the direction anyway, even if the node is already in the
        // direction we want. This is to make sure the expected
        // attributes (especially the classes) are not half-set.
        that.setAttribute("dir", direction);
        that.setStyle("direction", direction);
        that.removeClass(Y.ClassNameManager.getClassName(otherDirection[direction]));
        that.addClass(Y.ClassNameManager.getClassName(direction));

        if (direction !== previousDirection) {
            Y.fire("directionChange", {target: that, dir: direction});
        }
    }
    return that;
});


}, 'gallery-2010.09.22-20-15' ,{requires:['classnamemanager', 'node-base', 'node-style']});
