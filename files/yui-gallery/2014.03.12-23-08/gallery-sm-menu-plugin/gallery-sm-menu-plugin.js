YUI.add('gallery-sm-menu-plugin', function (Y, NAME) {

/**
Provides the `Y.Plugin.Menu` Node plugin.

@module gallery-sm-menu
@submodule gallery-sm-menu-plugin
**/

/**
Node plugin that toggles a dropdown menu when the host node is clicked.

### Example

    YUI().use('menu-plugin', function (Y) {
        var button = Y.one('#button');

        // Plug a dropdown menu into the button.
        button.plug(Y.Plugin.Menu, {
            items: [
                {label: 'Item One'},
                {label: 'Item Two'},
                {label: 'Item Three'}
            ]
        });

        // The menu will automatically be displayed whenever the button is
        // clicked, but you can also toggle it manually.
        button.menu.toggleVisible();
    });

@class Plugin.Menu
@constructor
@extends Menu
@uses Plugin.Base
**/

Y.namespace('Plugin').Menu = Y.Base.create('menuPlugin', Y.Menu, [Y.Plugin.Base], {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        this._host       = config.host;
        this._hostIsBody = this._host === Y.one('body');

        this._attachMenuPluginEvents();
    },

    destructor: function () {
        clearTimeout(this._pluginHideTimeout);
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Repositions this menu so that it is anchored to a specified node, region, or
    set of pixel coordinates.

    The menu will be displayed at the most advantageous position relative to the
    anchor point to ensure that as much of the menu as possible is visible
    within the viewport.

    If no anchor point is specified, the menu will be positioned relative to its
    host node.

    @method reposition
    @param {Node|Number[]|Object} [anchorPoint] Anchor point at which this menu
        should be positioned. The point may be specified as a `Y.Node`
        reference, a region object, or an array of X and Y pixel coordinates.
    @chainable
    **/
    reposition: function (anchorPoint) {
        return Y.Menu.prototype.reposition.call(this, anchorPoint || this._host);
    },

    // -- Protected Methods ----------------------------------------------------
    _attachMenuPluginEvents: function () {
        // Events added to this._menuEvents will be cleaned up by Y.Menu.

        if (this.get('showOnClick')) {
            this.afterHostEvent('click', this._afterHostClick);
        }

        if (this.get('showOnContext')) {
            // If the host node is the <body> element, we need to listen on the
            // document.
            if (this._hostIsBody) {
                this._menuEvents.push(Y.one('doc').on('contextmenu', this._onHostContext, this));
            } else {
                this.onHostEvent('contextmenu', this._onHostContext);
            }
        }

        if (this.get('showOnHover')) {
            this.afterHostEvent({
                blur      : this._afterHostBlur,
                focus     : this._afterHostFocus,
                mouseenter: this._afterHostMouseEnter,
                mouseleave: this._afterHostMouseLeave
            });
        }
    },

    /**
    Returns an efficient test function that can be passed to `Y.Node#ancestor()`
    to test whether a node is this menu's container or its plugin host.

    This is broken out to make overriding easier in subclasses.

    @method _getAncestorTestFn
    @return {Function} Test function.
    @protected
    **/
    _getAncestorTestFn: function () {
        var container = this.get('container'),
            host      = this._host;

        return function (node) {
            return node === container || node === host;
        };
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterHostBlur: function () {
        this.hide();
    },

    _afterHostClick: function () {
        if (!this.rendered) {
            this.render();
        }

        this.toggleVisible({anchorPoint: this._host});
    },

    _afterHostFocus: function () {
        clearTimeout(this._timeouts.menu);

        if (!this.rendered) {
            this.render();
        }

        this.show({anchorPoint: this._host});
    },

    _afterHostMouseEnter: function () {
        clearTimeout(this._timeouts.menu);

        if (!this.rendered) {
            this.render();
        }

        this.show({anchorPoint: this._host});
    },

    _afterHostMouseLeave: function () {
        var self = this;

        this._timeouts.menu = setTimeout(function () {
            self.hide();
        }, 300);
    },

    _onHostContext: function (e) {
        e.preventDefault();

        if (!this.rendered) {
            this.render();
        }

        this.show({anchorPoint: [e.clientX, e.clientY]});
    }
}, {
    NS: 'menu',

    ATTRS: {
        /**
        If `true`, this menu will be shown when the host node is clicked with
        the left mouse button or (in the case of `<button>`, `<input>`, and
        `<a>` elements) activated with the Return key.

        @attribute {Boolean} showOnClick
        @default true
        @initOnly
        **/
        showOnClick: {
            value: true,
            writeOnce: 'initOnly'
        },

        /**
        If `true`, this menu will be shown when the host node's `contextmenu`
        event occurs, which happens when the user takes an action that would
        normally display the browser's context menu (such as right-clicking).

        When `true`, the browser's default context menu will be prevented from
        appearing.

        @attribute {Boolean} showOnContext
        @default false
        @initOnly
        **/
        showOnContext: {
            value: false,
            writeOnce: 'initOnly'
        },

        /**
        If `true`, this menu will be shown when the host node is hovered or
        receives focus instead of only being shown when it's clicked.

        @attribute {Boolean} showOnHover
        @default false
        @initOnly
        **/
        showOnHover: {
            value: false,
            writeOnce: 'initOnly'
        }
    }
});


}, 'gallery-2013.03.27-22-06', {"requires": ["event-focus", "gallery-sm-menu", "node-pluginhost", "plugin"]});
