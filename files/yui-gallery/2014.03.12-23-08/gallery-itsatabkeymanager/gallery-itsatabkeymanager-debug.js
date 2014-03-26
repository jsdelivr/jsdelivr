YUI.add('gallery-itsatabkeymanager', function (Y, NAME) {


'use strict';

/*jshint maxlen:200 */

//==============================================================================
//==============================================================================
 //
// WHILE THE SMUGMUG-FUCUSMANAGER IS NOT IN THE GALLREY, WE NEED TO DEFINE THOSE METHODS HERE
//
// SHOULD BE REMOVED ONCE THE SMUGMUG FOCUSMANAGER IS AVAILABLE IN THE GALLERY
//
//==============================================================================
//==============================================================================
function FocusManager() {
    FocusManager.superclass.constructor.apply(this, arguments);
}

Y.extend(FocusManager, Y.Plugin.Base, {

    keyCodeMap: {
        32: 'space',
        33: 'pgup',
        34: 'pgdown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    },

    preventDefaultMap: {
        down  : 1,
        end   : 1,
        home  : 1,
        left  : 1,
        pgdown: 1,
        pgup  : 1,
        right : 1,
        space : 1,
        up    : 1
    },

    // -- Lifecycle ------------------------------------------------------------
    initializer: function (config) {
        this._host = config.host;

        this._attachEvents();
        this.refresh();
    },

    destructor: function () {
        this._detachEvents();
    },

    // -- Public Methods -------------------------------------------------------

    ascend: function () {
        var container = this._getActiveContainer(),
            host      = this._host,
            parentItem;

        if (container === host) {
            return null;
        }

        parentItem = container.ancestor(this.get('itemSelector'), false, function (node) {
            // Stop ascending if we reach the host.
            return node === host;
        });

        this.set('activeItem', parentItem, {src: 'ascend'});

        return parentItem;
    },

    descend: function () {
        var activeItem                = this.get('activeItem'),
            anchoredContainerSelector = this.get('anchoredContainerSelector'),
            container;

        if (!anchoredContainerSelector || !activeItem) {
            return null;
        }

        container = activeItem.one(anchoredContainerSelector);

        return container ? this.first({container: container}) : null;
    },

    first: function (options) {
        options = options || {};

        // Get the first item that isn't disabled.
        var container        = options.container || this.get('host'),
            disabledSelector = this.get('disabledSelector'),
            itemSelector     = this.get('itemSelector'),
            item             = container.one(this.get('anchoredItemSelector'));

        while (item && disabledSelector && item.test(disabledSelector)) {
            item = item.next(itemSelector);
        }

        if (!options.silent) {
            this.set('activeItem', item, {src: 'first'});
        }

        return item;
    },

    last: function (options) {
        options = options || {};

        var container        = options.container || this._host,
            disabledSelector = this.get('disabledSelector'),
            items            = container.all(this.get('anchoredItemSelector')),
            item             = items.pop();

        while (item && disabledSelector && item.test(disabledSelector)) {
            item = items.pop();
        }

        if (!options.silent) {
            this.set('activeItem', item, {src: 'last'});
        }

        return item;
    },

    next: function (options) {
        options = options || {};

        var activeItem = this.get('activeItem'),
            disabledSelector, itemSelector, nextItem;

        if (!activeItem) {
            return null;
        }

        disabledSelector = this.get('disabledSelector');
        itemSelector     = this.get('itemSelector');
        nextItem         = activeItem.next(itemSelector);

        // Get the next sibling that matches the itemSelector and isn't
        // disabled.
        while (nextItem && disabledSelector && nextItem.test(disabledSelector)) {
            nextItem = nextItem.next(itemSelector);
        }

        if (nextItem) {
            if (!options.silent) {
                this.set('activeItem', nextItem, {src: 'next'});
            }
        } else {
            // If there is no next sibling and the `circular` attribute is
            // truthy, then focus the first item in this container.
            if (this.get('circular')) {
                nextItem = this.first(Y.merge(options, {
                    container: this._getActiveContainer(activeItem)
                }));
            }
        }

        return nextItem || activeItem;
    },

    previous: function (options) {
        options = options || {};

        var activeItem = this.get('activeItem'),
            disabledSelector, itemSelector, prevItem;

        if (!activeItem) {
            return null;
        }

        disabledSelector = this.get('disabledSelector');
        itemSelector     = this.get('itemSelector');
        prevItem         = activeItem.previous(itemSelector);

        // Get the previous sibling that matches the itemSelector and isn't
        // disabled.
        while (prevItem && disabledSelector && prevItem.test(disabledSelector)) {
            prevItem = prevItem.previous(itemSelector);
        }

        if (prevItem) {
            if (!options.silent) {
                this.set('activeItem', prevItem, {src: 'previous'});
            }
        } else {
            // If there is no previous sibling and the `circular` attribute is
            // truthy, then focus the last item in this container.
            prevItem = this.last(Y.merge(options, {
                container: this._getActiveContainer(activeItem)
            }));
        }

        return prevItem || activeItem;
    },

    refresh: function (container) {
        var activeItem       = this.get('activeItem'),
            disabledSelector = this.get('disabledSelector'),
            itemSelector     = this.get(container ? 'anchoredItemSelector' : 'itemSelector');

        if (!Y.one(activeItem)) {
            this.set('activeItem', null);
            activeItem = null;
        }
        (container || this._host).all(itemSelector).each(function (node) {
            if (disabledSelector && node.test(disabledSelector)) {
                node.removeAttribute('tabIndex');
            } else {
                node.set('tabIndex', node === activeItem ? 0 : -1);
            }
        });

        return this;
    },

    _attachEvents: function () {
        var host = this._host;

        this._events = [
            host.on('keydown', this._onKeyDown, this),
            host.after('blur', this._afterBlur, this),
            host.after('focus', this._afterFocus, this),
            this.after('*:focusedChange', this._afterFocusedChange),
            this.after({
                activeItemChange: this._afterActiveItemChange
            })
        ];
    },

    _detachEvents: function () {
        new Y.EventHandle(this._events).detach();
    },

    _getActiveContainer: function (activeItem) {
        var containerSelector = this.get('containerSelector'),
            host              = this._host,
            container;

        if (!containerSelector) {
            return host;
        }

        if (!activeItem) {
            activeItem = this.get('activeItem');
        }

        if (!activeItem) {
            return host;
        }

        container = activeItem.ancestor(containerSelector, false, function (node) {
            // Stop the search if we reach the host node.
            return node === host;
        });

        return container || host;
    },

    _getAnchoredContainerSelector: function (value) {
        if (value) {
            return value;
        }

        var containerSelector = this.get('containerSelector');

        if (containerSelector) {
            return '>' + containerSelector;
        }

        return null;
    },

    _getAnchoredItemSelector: function (value) {
        if (value) {
            return value;
        }

        return '>' + this.get('itemSelector');
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterActiveItemChange: function (e) {
        var newVal  = e.newVal,
            prevVal = e.prevVal;

        if (prevVal) {
            try {
                prevVal.set('tabIndex', -1);
            }
            catch (err) {}
        }
        if (newVal) {
            newVal.set('tabIndex', 0);
            if (this.get('focused')) {
                try {
                    newVal.focus(); // this will lead to come inside the aftersetter one more time unfortunatly
                }
                catch (err) {}
            }
        }
    },

    _afterBlur: function () {
        this._set('focused', false);
    },

    _afterFocus: function (e) {
        this._set('focused', true);
        this._tryFocusNode(e.target);
    },

    _afterFocusedChange: function (e) {
        var target = e.target,
            iswidget = (typeof target.BOUNDING_TEMPLATE === 'string'), // don't want to check instanceof Y.Widget for would need to load widgetmodule
            node;
/*jshint expr:true */
        e.newVal && iswidget && (node=(target._parentNode || target.get('boundingBox'))) && this._tryFocusNode(node);
/*jshint expr:false */
    },

    _tryFocusNode: function (node) {
        if (node !== this._host && node.test(this.get('itemSelector'))) {
            this.set('activeItem', node, {src: 'focus'});
        }
    },

    _onKeyDown: function (e) {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }

        var key    = this.keyCodeMap[e.keyCode] || e.keyCode,
            keys   = this.get('keys'),
            action = keys[key] || keys[e.keyCode];

        if (action) {
            if (this.preventDefaultMap[key]) {
                e.preventDefault();
            }

            if (typeof action === 'string') {
                this[action].call(this);
            } else {
                action.call(this);
            }
        }
    }
}, {
    NAME: 'focusManager',
    NS  : 'focusManager',

    ATTRS: {
        activeItem: {
            valueFn: function () {
                // TODO: Need to be smarter about choosing the default
                // activeItem. Old FocusManager defaults to the first item with
                // tabIndex === 0, if there is one.
                return this.first();
            }
        },

        anchoredContainerSelector: {
            getter: '_getAnchoredContainerSelector'
        },

        anchoredItemSelector: {
            getter: '_getAnchoredItemSelector'
        },

        circular: {
            value: true
        },

        containerSelector: {},

        disabledSelector: {
            value: '[aria-disabled="true"], [aria-hidden="true"], [disabled]'
        },

        focused: {
            readOnly: true,
            value   : false
        },

        itemSelector: {
            value: '*'
        },

        keys: {
            cloneDefaultValue: 'shallow',

            value: {
                down : 'next',
                left : 'ascend',
                right: 'descend',
                up   : 'previous'
            }
        }
    }
});

Y.namespace('Plugin').FocusManager = FocusManager;
//==============================================================================
//==============================================================================
 //
// END OF DEFINITION SMUGMUG FOCUSMANAGER
//
//==============================================================================
//==============================================================================

Y.Node.prototype.displayInDoc = function() {
    var node = this,
        displayed = node.inDoc();
    while (node && displayed) {
        displayed = (node.getStyle('display')!=='none');
/*jshint expr:true */
        displayed && (node = node.get('parentNode'));
/*jshint expr:false */
    }
    return displayed;
};

/**
 * ITSAScrollViewKeyNav Plugin
 *
 *
 * Plugin that <b>extends gallery-sm-focusmanager</b> by navigate with TAB and Shift-TAB.
 * The plugin needs to be done on a container-Node. By default focusing is done with nodes that have the class <b>'.focusable'</b>,
 * but this can be overruled with the attribite 'itemSelector'.
 *
 *
 * @module gallery-itsatabkeymanager
 * @class ITSATabKeyManager
 * @extends Plugin.FocusManager
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

// -- Public Static Properties -------------------------------------------------

var YArray = Y.Array,
    FOCUSED_CLASS = 'itsa-focused',
    DEFAULT_ITEM_SELECTOR = '[data-focusable="true"]',
    PRIMARYBUTTON_CLASS = 'pure-button-primary',
    ITSAFORMELEMENT_FIRSTFOCUS = 'data-initialfocus="true"';


Y.namespace('Plugin').ITSATabKeyManager = Y.Base.create('itsatabkeymanager', Y.Plugin.FocusManager, [], {

        /**
         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready
         *
         * @method initializer
         * @protected
         * @since 0.1
         */
        initializer : function() {
            var instance = this,
                host;

            Y.log('initializer', 'info', 'Itsa-TabKeyManager');
            /**
             * Internal list that holds event-references
             * @property _eventhandlers
             * @private
             * @type Array
             */
            instance._eventhandlers = [];

            /**
             * The plugin's host, which should be a ScrollView-instance
             * @property host
             * @type Y.Node
             */
            instance.host = host = instance.get('host');
            instance._bindUI();
            instance.set('keys', {});
            instance.set('circular', true);
        },

        /**
         * Cleans up bindings and removes plugin
         * @method destructor
         * @protected
         * @since 0.1
        */
        destructor : function() {
            Y.log('destructor', 'info', 'Itsa-TabKeyManager');
            this._clearEventhandlers();
        },

        /**
         * Focuses and returns the first focusable item.
         *
         * @method first
         * @param {Object} [options] Options.
         *   @param {Node} [options.container] Descendant container to restrict the
         *       search to. Defaults to the host node.
         *   @param {Boolean} [options.silent=false] If `true`, the item will be
         *       returned, but will not become the active item.
         * @return {Node|null} Focused node, or `null` if there are no focusable items.
        **/

        first: function (options) {
            options = options || {};
            var instance         = this,
                container        = (options && options.container) || instance.host,
                disabledSelector = instance.get('disabledSelector'),
                itemSelector     = (options && options.selector) || instance.get('itemSelector'),
                item             = container && container.one(itemSelector),
                i                = 0,
                allItems;


            Y.log('first', 'info', 'Itsa-TabKeyManager');
            while (item && ((disabledSelector && item.test(disabledSelector)) || (item.getStyle('visibility')==='hidden') || !item.displayInDoc())) {
                allItems = allItems || (container && container.all(itemSelector));
                item = allItems && ((++i<allItems.size()) ? allItems.item(i) : null);
            }

            if (!options.silent) {
                instance.set('activeItem', item, {src: 'first'});
            }
            return item;

        },

        /**
         * Focus the initial node (first node that should be selected)
         *
         * @method focusInitialItem
         * @since 0.1
         *
        */
        focusInitialItem : function() {
//alert(1);
            var instance = this,
                host = instance.host,
                focusitem, panelheader, panelbody, panelfooter;

            Y.log('Start focusInitialItem', 'info', 'Itsa-TabKeyManager');
            if (host.hasClass(FOCUSED_CLASS)) {
                focusitem = instance.first({silent: true, selector: '['+ITSAFORMELEMENT_FIRSTFOCUS+']'}) ||
                            ((panelbody=host.one('.itsa-panelbody')) ? instance.first({silent: true, container: panelbody}) : null) ||
                            instance.first({silent: true, selector: '.'+PRIMARYBUTTON_CLASS}) ||
                            ((panelfooter=host.one('.itsa-panelfooter')) ? instance.last({silent: true, container: panelfooter}) : null) ||
                            ((panelheader=host.one('.itsa-panelheader')) ? instance.first({silent: true, container: panelheader}) : null) ||
                            instance.first({silent: true});
        // focussing will set the value of attribute 'activeItem'
                if (focusitem) {
                    try {
                        focusitem.focus();
                    }
                    catch (err) {}
                }
            }
        },

        /**
         * Focuses and returns the last focusable item.
         *
         * @method last
         * @param {Object} [options] Options.
         *     @param {Node} [options.container] Descendant container to restrict the
         *         search to. Defaults to the host node.
         *     @param {Boolean} [options.silent=false] If `true`, the item will be
         *         returned, but will not become the active item.
         * @return {Node|null} Focused node, or `null` if there are no focusable items.
        **/
        last: function (options) {
            var instance         = this,
                container        = (options && options.container) || instance.host,
                disabledSelector = instance.get('disabledSelector'),
                allItems         = container && container.all(instance.get('itemSelector')),
                i                = allItems ? (allItems.size() - 1) : 0,
                item             = allItems && allItems.pop();

            Y.log('last', 'info', 'Itsa-TabKeyManager');
            options = options || {};
            try {
                while (item && ((disabledSelector && item.test(disabledSelector)) || (item.getStyle('visibility')==='hidden') || !item.displayInDoc())) {
                    item = (--i>=0) ? allItems.item(i) : null;
                }
            }
            catch (err) {
                item = null;
            }

            if (!options.silent) {
                instance.set('activeItem', item, {src: 'last'});
            }

            return item;
        },

        /**
         * Focuses and returns the next focusable sibling of the current `activeItem`.
         *
         * If there is no focusable next sibling and the `circular` attribute is
        `* false`, the current `activeItem` will be returned.
         *
         * @method next
         * @param {Object} [options] Options.
         *     @param {Boolean} [options.silent=false] If `true`, the item will be
         *         returned, but will not become the active item.
         * @return {Node|null} Focused node, or `null` if there is no `activeItem`.
        **/
        next: function (options) {
            var instance         = this,
                container        = (options && options.container) || instance.host,
                activeItem       = instance.get('activeItem'),
                disabledSelector, nextItem, index, itemSize, allItems;

            Y.log('next', 'info', 'Itsa-TabKeyManager');
            options = options || {};
            if (!activeItem) {
                return instance.first(options);
            }
            disabledSelector = instance.get('disabledSelector');
            allItems = container && container.all(instance.get('itemSelector'));
            itemSize = allItems ? allItems.size() : 0;
            index = allItems && allItems.indexOf(activeItem);
            nextItem = allItems && ((++index<itemSize) ? allItems.item(index) : null);
            // Get the next item that matches the itemSelector and isn't
            // disabled.
            try {
                while (nextItem && ((disabledSelector && nextItem.test(disabledSelector)) || (nextItem.getStyle('visibility')==='hidden') || !nextItem.displayInDoc())) {
                    nextItem = (++index<itemSize) ? allItems.item(index) : null;
                }
            }
            catch (err) {
                nextItem = null;
            }
            if (nextItem) {
                if (!options.silent) {
                    this.set('activeItem', nextItem, {src: 'next'});
                }
            } else {
                // If there is no next item and the `circular` attribute is
                // truthy, then focus the first item in this container.
                if (this.get('circular')) {
                    nextItem = instance.first(options);
                }
            }
            return nextItem || activeItem;
        },

        /**
         * Focuses and returns the previous focusable sibling of the current
         * `activeItem`.
         *
         * If there is no focusable previous sibling and the `circular` attribute is
         * `false`, the current `activeItem` will be returned.
         *
         * @method previous
         * @param {Object} [options] Options.
         *     @param {Boolean} [options.silent=false] If `true`, the item will be
         *         returned, but will not become the active item.
         * @return {Node|null} Focused node, or `null` if there is no `activeItem`.
        **/
        previous: function (options) {
            var instance         = this,
                container        = (options && options.container) || instance.host,
                activeItem       = instance.get('activeItem'),
                disabledSelector, prevItem, index, allItems;

            Y.log('previous', 'info', 'Itsa-TabKeyManager');
            options = options || {};
            if (!activeItem) {
                return instance.first(options);
            }
            disabledSelector = instance.get('disabledSelector');
            allItems = container && container.all(instance.get('itemSelector'));
            index = allItems ? allItems.indexOf(activeItem) : 0;
            prevItem = (--index>=0) ? allItems.item(index) : null;
            // Get the next item that matches the itemSelector and isn't
            // disabled.
            try {
                while (prevItem && ((disabledSelector && prevItem.test(disabledSelector)) || (prevItem.getStyle('visibility')==='hidden') || !prevItem.displayInDoc())) {
                    prevItem = (--index>=0) ? allItems.item(index) : null;
                }
            }
            catch (err) {
                prevItem = null;
            }
            if (prevItem) {
                if (!options.silent) {
                    this.set('activeItem', prevItem, {src: 'previous'});
                }
            } else {
                // If there is no next item and the `circular` attribute is
                // truthy, then focus the first item in this container.
                if (this.get('circular')) {
                    prevItem = instance.last(options);
                }
            }
            return prevItem || activeItem;
        },

        /**
         * Sets the specified Node as the node that should retreive first focus.
         * (=first focus once the container gets focus and no element has focus yet)
         *
         * @method retreiveFocus
         * @param node {Y.Node|String} the Node that should gain first focus. Has to be inside the host (container) and focusable.
         * @since 0.1
        */
        setFirstFocus : function(node) {
            var instance = this,
                container = instance.host,
                nodeisfocusable;

            Y.log('setFirstFocus', 'info', 'Itsa-TabKeyManager');
            if (typeof node === 'string') {
                node = Y.one(node);
            }
            nodeisfocusable = node && instance._nodeIsFocusable(node);
            if (nodeisfocusable) {
/*jshint expr:true */
                container && container.all('['+ITSAFORMELEMENT_FIRSTFOCUS+']').removeAttribute(ITSAFORMELEMENT_FIRSTFOCUS);
/*jshint expr:false */
                node.addAttribute(ITSAFORMELEMENT_FIRSTFOCUS);
            }
        },

        //===============================================================================================
        // private methods
        //===============================================================================================

        /**
         * Binding events
         *
         * @method _bindUI
         * @private
         * @since 0.1
        */
        _bindUI : function() {
            var instance = this,
                host = instance.host;

            Y.log('_bindUI', 'info', 'Itsa-TabKeyManager');
            instance._eventhandlers.push(
                host.on(
                    'keydown',
                    function(e) {
                        if (e.keyCode === 9) { // tab
                            Y.log('tabkey pressed', 'info', 'Itsa-TabKeyManager');
                            e.preventDefault();
                            if (e.shiftKey) {
                                instance.previous();
                            }
                            else {
                                instance.next();
                            }
                        }
                    }
                )
            );
            instance._eventhandlers.push(
                host.after(
                    'click',
                    function(e) {
                        Y.log('onsubscriptor '+e.type, 'info', 'Itsa-TabKeyManager');
                        var node = e.target;
                        if (host.hasClass(FOCUSED_CLASS)) {
                            if ((node.get('tagName')==='BUTTON') && instance._nodeIsFocusable(node)) {
                                try {
                                    node.focus();
                                }
                                catch (err) {}
                            }
                            else {
                                instance._retrieveFocus();
                            }
                        }
                    }
                )
            );
        },

        /**
         * Cleaning up all eventlisteners
         *
         * @method _clearEventhandlers
         * @private
         * @since 0.1
         *
        */
        _clearEventhandlers : function() {
            Y.log('_clearEventhandlers', 'info', 'Itsa-TabKeyManager');
            YArray.each(
                this._eventhandlers,
                function(item){
                    item.detach();
                }
            );
        },

        /**
         * Checks whether a node is focusable within the host-container.
         *
         * @method _nodeIsFocusable
         * @param node {Y.Node} the node to check if it's a focusable node within the host-container.
         * @private
         * @return {Boolean} focusable or not
         * @since 0.1
        */
        _nodeIsFocusable : function(node) {
            var instance            = this,
                container           = instance.host,
                disabledSelector    = instance.get('disabledSelector'),
                itemSelector        = instance.get('itemSelector'),
                nodeInsideContainer = node && container && container.contains(node),
                isFocusable;

            isFocusable = (nodeInsideContainer && node.test(itemSelector) && (node.getStyle('visibility')!=='hidden') && node.displayInDoc() && (!disabledSelector || !node.test(disabledSelector)));
            Y.log('_nodeIsFocusable: '+isFocusable, 'info', 'Itsa-TabKeyManager');
            return isFocusable;
        },

        /**
         * Retreive the focus again on the 'activeItem', or -when none- on the initial Item.
         * Is called when the host-node gets focus.
         *
         * @method _retrieveFocus
         * @private
         * @since 0.1
        */
        _retrieveFocus : function() {
            var instance   = this,
                activeItem = instance.get('activeItem');
            if (instance.host.hasClass(FOCUSED_CLASS)) {
                Y.log('_retrieveFocus', 'info', 'Itsa-TabKeyManager');
                // first check if active item is still in the dom!
                if (!Y.one(activeItem)) {
                    instance.set('activeItem', null);
                    activeItem = null;
                }
                if (activeItem) {
                    try {
                        activeItem.focus();
                    }
                    catch (err) {}
                }
                else {
                    instance.focusInitialItem();
                }
            }
        }

    }, {
        NS : 'itsatabkeymanager',
        ATTRS : {
            /**
             * Non-anchored CSS selector that matches item nodes that should be
             * focusable.
             *
             * @attribute {String} itemSelector
             * @default '.focusable'
            **/
            itemSelector: {
                value: DEFAULT_ITEM_SELECTOR,
                validator:  function(v) {
                    return typeof v === 'string';
                }
            }
        }
    }
);


}, 'gallery-2013.12.20-18-06', {
    "requires": [
        "yui-base",
        "oop",
        "base-base",
        "base-build",
        "event-custom",
        "plugin",
        "node-core",
        "node-style",
        "node-pluginhost",
        "event-focus",
        "selector-css3"
    ]
});
