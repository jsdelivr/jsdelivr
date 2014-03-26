YUI.add('gallery-affix', function (Y, NAME) {

/**
A plugin that makes a node stick to a position when it scrolls over a certain
offset. Based on Bootstrap's Affix plugin.

@class Plugin.Affix
@constructor
@param {Object} config Object literal containing configuration options
@param {Object} config.host Node or widget (the boundingBox will be used)
@param {Object|Number} [config.offset] The offset to use. If not found it will
    default to data-offset-top, data-offset-left or data-offset properties on
    the host
@param {Number} [config.offset.left] Left offset to use. At least one of top or
    left should be used
@param {Number} [config.offset.top] Top offset to use.
**/
function Affix(config) {
    var node = config.host,
        offset = config.offset || Math.floor(parseFloat(node.getData('offset'))),
        xy = node.getXY();

    if (Y.Widget && node instanceof Y.Widget) {
        node = node.get('boundingBox');
    }

    /**
    The node that will be fixed.

    @property _node
    @type Node
    @private
    **/
    this._node       = node;
    /**
    The offset option.

    @property _offset
    @type Number
    @private
    **/
    this._offset     = offset;
    /**
    The offset left option.

    @property _offsetLeft
    @type Number
    @private
    **/
    this._offsetLeft = typeof offset.left === 'number' ? offset.left :
                            (node.getData('offset-left') || 0);
    /**
    The offset top option.

    @property _offsetTop
    @type Number
    @private
    **/
    this._offsetTop  = typeof offset.top === 'number' ? offset.top :
                            (node.getData('offset-top') || 0);

  
    /**
    The original left position of the node. Used to calculate if the node is
    over the offset.

    @property _x
    @type Number
    @private
    **/
    this._x = xy[0];
    /**
    The original top position of the node. Used to calculate if the node is
    over the offset.

    @property _y
    @type Number
    @private
    **/
    this._y = xy[1];

    /**
    Event handle for the document's `scroll` event.

    @property _handle
    @type Object
    @private
    **/
    this._handle = Y.on('scroll', Y.throttle(Y.bind(this.refresh, this), 15));
    this.refresh();
}

Y.mix(Affix.prototype, {
    /**
    Fixes or releases the node according to the scroll position.
    Called automatically when scrolling.

    @method refresh
    **/
    refresh: function () {
        var offset = this._offset,
            offsetLeft = this._offsetLeft || offset,
            offsetTop = this._offsetTop || offset,

            // do the math for both directions even though it may be set for
            // only one direction for simplicity
            isOverOffset = (this._y - Y.DOM.docScrollY() < offsetTop) ||
                            (this._x - Y.DOM.docScrollX() < offsetLeft);


        // reset position styles if no offset was provided in that direction
        // because if an inline style was applied it'll break sooner or
        // later because of the changed to "fixed" position
        this._node.setStyles({
            position: isOverOffset ? 'fixed' : '',
            left: isOverOffset && this._offsetLeft ? (offsetLeft + 'px') : '',
            top: isOverOffset && this._offsetTop ? (offsetTop + 'px') : ''
        });
    },
    destroy: function () {
        this._handle.detach();
        this._handle = this._node = null;
    }
});

/**
Plugin namespace

@property NS
@type String
@default "affix"
@static
**/
Affix.NS = 'affix';

Y.namespace('Plugin').Affix = Affix;


}, 'gallery-2013.05.15-21-12', {"requires": ["node-base", "node-screen", "node-style", "node-pluginhost", "yui-throttle", "oop"]});
