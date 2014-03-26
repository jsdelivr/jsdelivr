YUI.add('gallery-inview-event', function (Y, NAME) {

/*jslint plusplus: true, white: true */
/**
Adds a synthetic `inview` event that fires when the node is scrolled into view.
 
Usage:
 
    YUI().use('gallery-inview-event',function (Y) {
            Y.one('#mynode').on('inview',function(){
                Y.one('#mynode').setContent('this node is now in view');
            });
    });
@module gallery-inview-event
**/
/**
Provides the implementation for the synthetic `inview` event.
@class InViewEvent
@static
*/
var InViewEvent = {
    /**
     * My method description.
     * @method _getTop
     * @param {HTMLElement} node which top is to be found from browser x and y;
     * @return {Boolean} y position of node from 0,0 for body;
     */
    '_getTop': function(elm) {
        var y = 0;
        while ( !! elm) {
            y = parseInt(y, 10) + parseInt(elm.offsetTop, 10);
            elm = elm.offsetParent;
        }
        console.log('--->', y);
        return y;
    },
    '_attachedNode': [],
    '_isInitialized': false,
    /**
     * return current scrollY + documentHeight
     * @method _getScroll
     * @return {Number} scrollY + documentHeight
     */
    '_getScroll': function() {
        var that = this;
        try {
            return window.scrollY + that._getViewPortHeight();
        } catch (e) {
            return 100000;
        }
    },
    /**
     * checks current scroll position and fires inview event
     * @method _fireInView
     * @param {Number} current scroll position
     * @return {Undefined}
     */
    '_fireInView': function(scroll) {
        var that = this,
            newAttachedNodeList = [],
            t, i;
        for (i = 0; i < that._attachedNode.length; i++) {
            t = that._attachedNode[i].top;
            if (t < scroll) {
                that._attachedNode[i].notifier.fire();
            } else {
                console.log('not fired', t, scroll);
                newAttachedNodeList.push(that._attachedNode[i]);
            }
        }
        that._attachedNode = newAttachedNodeList;
    },
    /**
     * return ViewPortHeight
     * @method _getViewPortHeight
     * @return {Number} viewPort Height
     */
    '_getViewPortHeight': function() {
        try {
            return document.documentElement.clientHeight || 1200;
        } catch (e) {
            Y.log("your browser does not support document.documentElement", e);
            return 1200;
        }
    },
    /**
     * hooks scroll event on body to check if nodes are in view
     * @method _initialize
     *
     * @return {undefine}
     */
    '_initialize': function() {
        var that = this;
        Y.on('scroll', function() {
            var scroll = that._getScroll();
            that._fireInView(scroll);
        });
    }
},
    ive = InViewEvent;
Y.Event.define("inview", {
    on: function(node, sub, notifier) {
        if (!ive._isInitialized) {
            ive._initialize();
        }
        ive._attachedNode.push({
            "node": node,
            "top": ive._getTop(node._node),
            "notifier": notifier
        });
        ive._fireInView(ive._getViewPortHeight());
    }
});

}, '@VERSION@', {"requires": ["node", "event"]});
