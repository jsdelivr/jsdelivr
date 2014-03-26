YUI.add('gallery-carousel', function(Y) {

/**
 * Carousel provides a widget for browsing among a set of like objects arrayed
 * vertically or horizontally in an overloaded page region.
 *
 * @module carousel
 */

/**
 * Create a Carousel control.
 *
 * The Carousel module provides a widget for browsing among a set of like
 * objects represented pictorially.
 *
 * @class Carousel
 * @extends Widget
 * @param config {Object} Configuration options for the widget
 * @constructor
 */
function Carousel() {
    Carousel.superclass.constructor.apply(this, arguments);
}

// Some useful abbreviations
var getCN = Y.ClassNameManager.getClassName,
    JS    = Y.Lang,
    Node  = Y.Node,
    canGoBackward = false,
    canGoForward  = true,

    // Custom class prefixes
    cpButton         = "button",
    cpButtonDisabled = "button-disabled",
    cpContent = "content",
    cpItem    = "item",
    cpNav     = "nav",
    cpNavItem = "nav-item",

    // Carousel custom events

    /**
     * @event afterScroll
     * @description          fires after the Carousel has scrolled its view
     *                       port.  The index of the first and last visible
     *                       items in the view port are passed back.
     * @param {Event}  ev    The <code>afterScroll</code> event
     * @param {Number} first The index of the first visible item in the view
     *                       port
     * @param {Number} last  The index of the last visible item in the view
     *                       port
     * @type Event.Custom
     */
    AFTERSCROLL_EVENT = "afterScroll",

    /**
     * @event beforeScroll
     * @description          fires before the Carousel scrolls its view port.
     *                       The index of the first and last visible items
     *                       in the view port are passed back.
     * @param {Event}  ev    The <code>afterScroll</code> event
     * @param {Number} first The index of the first visible item in the view
     *                       port
     * @param {Number} last  The index of the last visible item in the view
     *                       port
     * @type Event.Custom
     */
    BEFORESCROLL_EVENT = "beforeScroll",

    /**
     * @event itemAdded
     * @description         fires after an item has been added to the Carousel
     * @param {Event}  ev   The <code>itemAdded</code> event
     * @param {Node}   item The node that will be added
     * @param {Number} pos  The position where the node would be added
     * @type Event.Custom
     */
    ITEMADDED_EVENT = "itemAdded",

    /**
     * @event itemRemoved
     * @description         fires after an item has been removed from the
     *                      Carousel
     * @param {Event}  ev   The <code>itemRemoved</code> event
     * @param {Node}   item The node that will be removed
     * @param {Number} pos  The position from where the node would be removed
     * @type Event.Custom
     */
    ITEMREMOVED_EVENT = "itemRemoved",

    /**
     * @event itemSelected
     * @description        fires when an item has been selected in the Carousel
     * @param {Event}  ev  The <code>itemSelected</code> event
     * @param {Number} pos The index of the selected item
     * @type Event.Custom
     */
    ITEMSELECTED_EVENT = "itemSelected",

    /**
     * @event navStateChanged
     * @description          fires when the state of either one of the
     *                       navigation buttons are changed from enabled to
     *                       disabled or vice versa
     * @param {Event}  ev    The <code>navStateChanged</code> event
     * @param {Object} state The state of previous and next buttons for e.g.,
     *                       { prev: false, next: true } indicating previous
     *                       button is disabled, and next button is enabled
     * @type Event.Custom
     */
    NAVSTATECHANGED_EVENT = "navStateChanged";

/**
 * The identity of the widget.
 *
 * @property Carousel.NAME
 * @type String
 * @default "carousel"
 * @readOnly
 * @protected
 * @static
 */
Carousel.NAME = "carousel";

/**
 * Static property used to define the default attribute configuration of the
 * Widget.
 *
 * @property Carousel.ATTRS
 * @type Object
 * @protected
 * @static
 */
Carousel.ATTRS = {
    /**
     * Set this to time in milli-seconds to have the Carousel automatically
     * scroll the contents after every given milli-second.
     *
     * @attribute autoPlayInterval
     * @type {Number}
     * @default 0
     */
    autoPlayInterval: {
        validator: JS.isNumber,
        value: 0
    },

    /**
     * The element type defining the list of items within the Carousel.
     *
     * @attribute carouselItemEl
     * @type {String}
     * @default "li"
     */
    carouselItemEl: {
        validator: JS.isString,
        value: "li"
    },

    /**
     * Set this to true to hide the Carousel pagination.
     *
     * @attribute hidePagination
     * @type {Boolean}
     * @default false
     */
    hidePagination: {
        validator: JS.isBoolean,
        value: false
    },

    /**
     * Set this to true to have a circular Carousel.
     *
     * @attribute isCircular
     * @type {Boolean}
     * @default false
     */
    isCircular: {
        validator: JS.isBoolean,
        value: false
    },

    /**
     * Set this to true to have the Carousel orient vertical instead of the
     * default horizontal
     *
     * @attribute isVertical
     * @type {Boolean}
     * @default false
     */
    isVertical: {
        setter: "_setVertical",
        validator: JS.isBoolean,
        value: false
    },

    /**
     * Set this to true to use a SELECT menu item for navigation over the
     * default buttons.
     *
     * @attribute useMenuForNav
     * @type {Boolean}
     */
    useMenuForNav: {
        validator: JS.isBoolean,
        value: false
    },

    /**
     * The number of items in the Carousel's view port.
     *
     * @attribute numItems
     * @type {Number}
     * @readOnly
     */
    numItems: {
        value: 0
    },

    /**
     * The number of visible items in the Carousel's view port.
     *
     * @attribute numVisible
     * @type {Number}
     * @default 3
     */
    numVisible: {
        validator: "_validateNumVisible",
        value: 3
    },

    /**
     * The percentage of item to be revealed on each side of the Carousel in
     * the view port.
     *
     * @attribute revealAmount
     * @type {Number}
     * @default 0
     */
    revealAmount: {
        validator: "_validateRevealAmount",
        value: 0
    },

    /**
     * The number of items to scroll by for arrow keys.
     *
     * @attribute scrollIncrement
     * @type {Number}
     * @default 1
     */
    scrollIncrement: {
        validator: JS.isNumber,
        value: 1
    },

    /**
     * The item to be chosen as the selected item in Carousel.
     *
     * @attribute selectedItem
     * @type {Number}
     * @default 0
     */
    selectedItem: {
        validator: JS.isNumber,
        value: 0
    },

    /*
     * The Carousel widget's customization strings.
     */
    strings: {
        value: {
            GOTO_PAGE: "Go to page {page}",
            NEXT_PAGE: "Next Page",
            PREV_PAGE: "Previous Page"
        }
    }
};

Y.Carousel = Y.extend(Carousel, Y.Widget, {
    /**
     * Add an item to the Carousel.
     *
     * @method addItem
     * @param {Node|String} node The item to be added to the Carousel. This can
     *                           be a node instance or the content to be passed
     *                           to Node.create() with the default item
     *                           template.
     * @param {Number} pos An optional position for the item to be added. If
     *                     this is omitted, the item is appended at the end.
     * @return {Boolean} True if the add succeeded; false otherwise
     * @public
     */
    addItem: function (node, pos) {
        var self = this,
            count,
            index,
            item;

        if (JS.isString(node)) {
            item = Node.create(Y.substitute(self.ITEM_TEMPLATE, {
                content: node
            }));
        } else if (JS.isObject(node) && node.constructor.NAME === "node") {
            item = node;
        } else {
            return false;
        }

        /* To calculate the size of a single item. */
        if (!self._vtbl.item.content) {
            self._vtbl.item.content = item;
        }

        if (JS.isUndefined(pos)) {
            self._vtbl.items.push(item);
            index = self._vtbl.items.length - 1;
        } else {
            if (!self._vtbl.items[pos]) {
                self._vtbl.items[pos] = undefined;
            }
            self._vtbl.items.splice(pos, 0, item);
            index = pos;
        }

        count = this.get("numItems");
        self.set("numItems", count + 1);
        self.fire(ITEMADDED_EVENT, { item: item, pos: index });

        return true;
    },

    /**
     * Insert or append multiple items to the Carousel.
     *
     * @method addItems
     * @param {Array} items An array containing the new items and their
     *                      positions (optional).  The item can be a content
     *                      string or a Node.
     *                      E.g., [{content: "<li>item</li>"},
     *                             {content: "<li>item2</li>", pos: 3}]
     * @return {Boolean} True if all items have been successfully added
     * @public
     */
    addItems: function (items) {
        var self = this,
            rv = false,
            item,
            i,
            n;

        if (!JS.isArray(items)) {
            return false;
        }

        rv = true;
        for (i = 0, n = items.length; i < n; ++i) {
            item = items[i].content;
            if (!self.addItem(item, items[i].pos)) {
                rv = false;
            }
        }
        return rv;
    },

    /**
     * Empty the Carousel and hide it.
     *
     * @method clearItems
     * @public
     */
    clearItems: function () {
        var self = this,
            tbl = self._vtbl.items;

        while (tbl.length > 0) {
            self.removeItem(0);
        }
    },

    /**
     * Return the item at index or null if the index is not found.
     *
     * If there are no items at the specified index, this method returns null.
     *
     * @method getItem
     * @param {Number} index The index of the item to be returned
     * @return {Node} The node at index or null if index is not found
     * @deprecated Use getItem instead
     * @public
     */
    getElementForItem: function (index) {
        return this.getItem(index);
    },

    /**
     * Return the Carousel items as an array.
     *
     * The difference between V2 and V3 API is that if there is no item at a
     * particular index, the array position is filled out as null.
     *
     * @method getItems
     * @param {Array} pos The optional positions to be returned
     * @return {Array} The array of items
     * @deprecated Use getItems instead
     * @public
     */
    getElementForItems: function (pos) {
        return this.getItems(pos);
    },

    /**
     * Return the index of the first visible item in the current viewport.
     *
     * @method getFirstVisible
     * @return {Number} Index of the first visible item
     * @public
     */
    getFirstVisible: function () {
        var self         = this,
            numVisible   = self.get("numVisible"),
            selectedItem = self.get("selectedItem");

        return self._getFirstVisible(selectedItem, numVisible);
    },

    /**
     * Return the index of the first visible item on the specified page.
     *
     * @method getFirstVisibleOnPage
     * @param {Number} The page number; page numbers start from zero
     * @return {Number} Index of the first visible item
     * @public
     */
    getFirstVisibleOnPage: function (page) {
        return (page - 1) * this.get("numVisible");
    },

    /**
     * Return the item at index or null if the index is not found.
     *
     * If there are no items at the specified index, this method returns null.
     *
     * @method getItem
     * @param {Number} index The index of the item to be returned
     * @return {Node} The node at index or null if index is not found
     * @public
     */
    getItem: function (index) {
        var self = this;

        if (index < 0 || index > self._vtbl.items.length - 1) {
            return null;
        }

        return JS.isUndefined(self._vtbl.items[index]) ? null
                : self._vtbl.items[index];
    },

    /**
     * Return the Carousel items as an array.
     *
     * The difference between V2 and V3 API is that if there is no item at a
     * particular index, the array position is filled out as null.
     *
     * @method getItems
     * @param {Array} pos The optional positions to be returned
     * @return {Array} The array of items
     * @public
     */
    getItems: function (pos) {
        var self  = this,
            items = [],
            i,
            n;

        if (JS.isUndefined(pos)) { // return everything
            for (i = 0, n = self._vtbl.items.length; i < n; ++i) {
                items[i] = self.getItem(i);
            }
        } else {
            for (i = 0, n = pos.length; i < n; ++i) {
                items[pos[i]] = self.getItem(pos[i]);
            }
        }

        return items;
    },

    /**
     * Return the page number for an item in the Carousel.
     *
     * @method getPageForItem
     * @param {Number} item The item for which the page number should be
     *                      returned
     * @return {Number} The page number
     * @public
     */
    getPageForItem: function (item) {
        return Math.floor(item / this.get("numVisible"));
    },

    /**
     * Return the visible items in the current viewport as an array.
     *
     * @method getVisibleItems
     * @return {Array} The list of visible items in the current viewport
     * @public
     */
    getVisibleItems: function () {
        var self         = this,
            numVisible   = self.get("numVisible"),
            firstVisible = self.getFirstVisible(),
            rv = [],
            i,
            n;

        for (i = firstVisible, n = firstVisible + numVisible; i < n; ++i) {
            rv.push(self._vtbl.items[i]);
        }
        return rv;
    },

    /**
     * Remove the item at index from the Carousel.
     *
     * @method removeItem
     * @param {Number} index Index of the item to be removed
     * @return {Boolean} Return true on success, false otherwise
     * @public
     */
    removeItem: function (index) {
        var self = this,
            item,
            count;

        if (index < 0 || index > self._vtbl.items.length - 1) {
            return false;
        }

        item = self._vtbl.items.splice(index, 1);
        item = JS.isUndefined(item[0]) ? false : item[0];
        if (!item) {
            return false;
        }

        count = self.get("numItems");
        --count;
        self.set("numItems", count);
        this.fire(ITEMREMOVED_EVENT, { item: item, pos: index });

        return true;
    },

    /**
     * Scroll the Carousel by "scrollIncrement" backward.
     *
     * @method scrollBackward
     * @public
     */
    scrollBackward: function () {
        var self = this;
        
        self.scrollTo(self.getFirstVisible() - self.get("scrollIncrement"));
    },

    /**
     * Scroll the Carousel by "scrollIncrement" forward.
     *
     * @method scrollForward
     * @public
     */
    scrollForward: function () {
        var self = this;
        
        self.scrollTo(self.getFirstVisible() + self.get("scrollIncrement"));
    },

    /**
     * Scroll the Carousel by a page backward.
     *
     * @method scrollPageBackward
     * @public
     */
    scrollPageBackward: function () {
        var self = this;
        
        self.scrollTo(self.getFirstVisible() - self.get("numVisible"));
    },

    /**
     * Scroll the Carousel by a page forward.
     *
     * @method scrollPageForward
     * @public
     */
    scrollPageForward: function () {
        var self = this;
        
        self.scrollTo(self.getFirstVisible() + self.get("numVisible"));
    },

    /**
     * Scroll the Carousel to make the item at index visible.
     *
     * @method scrollTo
     * @param {Number} index The index to be scrolled to
     * @public
     */
    scrollTo: function (index) {
        var self       = this,
            isCircular = self.get("isCircular"),
            numItems   = self.get("numItems"),
            numVisible = self.get("numVisible"),
            attr,
            cb,
            first,
            offset;

        index = self._getCorrectedIndex(index); // sanitize the value
        if (isNaN(index)) {
            return;
        }
        
        offset = self._getOffsetForIndex(index);
        cb     = self.get("contentBox");
        attr   = self.get("isVertical") ? "top" : "left";
        first  = self.getFirstVisible();
        self.fire(BEFORESCROLL_EVENT, { first: first,
                last: first + numVisible });
        cb.setStyle(attr, offset);
        first = self.getFirstVisible(); // ask for the "new" first visible
        self.fire(AFTERSCROLL_EVENT, { first: first,
                last: first + numVisible });
        self.set("selectedItem", index); // assume this is what the user want
    },

    /**
     * Scroll the Carousel to the given page.
     *
     * @method scrollToPage
     * @param {Number} page The page to be scrolled to (starts from zero)
     * @public
     */
    scrollToPage: function (page) {
        var self = this;
        
        self.scrollTo(page * self.get("numVisible"));
    },

    /**
     * Start auto scrolling the Carousel after "autoPlayInterval" milliseconds.
     *
     * @method startAutoPlay
     * @public
     */
    startAutoPlay: function () {
        var self = this,
            timer;

        if (JS.isUndefined(self._autoPlayTimer)) {
            timer = self.get("autoPlayInterval");
            if (timer <= 0) {
                return;
            }
            self._isAutoPlayInProgress = true;
            self._autoPlayTimer = setInterval(function () {
                self.scrollPageForward();
            }, timer);
        }
    },

    /**
     * Stop auto scrolling the Carousel.
     *
     * @method stopAutoPlay
     * @public
     */
    stopAutoPlay: function () {
        var self = this;

        if (!JS.isUndefined(self._autoPlayTimer)) {
            clearTimeout(self._autoPlayTimer);
            delete self._autoPlayTimer;
            self._isAutoPlayInProgress = false;
        }
    },

    /* Overridable protected methods. */

    /**
     * Attach event handlers that bind UI to Carousel state.
     *
     * @method bindUI
     * @protected
     */
    bindUI: function () {
        var self = this,
            bb   = self.get("boundingBox");

        self.after("selectedItemChange", self._afterSelectedItemChange);
        self.on(ITEMADDED_EVENT, self._addItemToDom);
        self.on(ITEMREMOVED_EVENT, self._removeItemFromDom);

        /* Handle navigation. */
        if (!self.get("hidePagination")) {
            bb.delegate("click", Y.bind(self._onNavItemClick, self),
                        "." + getCN(Carousel.NAME, cpNavItem) + " > a");
            bb.delegate("click", Y.bind(self._onNavButtonClick, self),
                        "." + getCN(Carousel.NAME, cpButton));
        }

        bb.delegate("click", Y.bind(self._onItemClick, self),
                    "." + getCN(Carousel.NAME, cpItem));
    },

    /**
     * Initialize the lifecycle of the Carousel widget.
     *
     * Initialize internal data structures and create the events to be
     * published.
     *
     * @method initializer
     * @protected
     */
    initializer: function () {
        var self = this;

        self._vtbl = { items: [], item: { content: null, hsz: 0, vsz: 0 } };

        /* Hide the widget initially since it may cause flickering. */
        self.get("boundingBox").addClass(getCN(Carousel.NAME, "loading"));
        self._parseItems();
    },

    /**
     * Render the Carousel widget.
     *
     * @method renderUI
     * @protected
     */
    renderUI: function () {
        var self = this;

        if (self.get("numItems") < 1) {
            self.get("boundingBox").addClass(getCN(Carousel.NAME, "hidden"));
            return;
        }

        if (self._vtbl.item.hsz === 0) {
            self._vtbl.item.hsz = self._getNodeSize(self._vtbl.item.content,
                    "width");
        }
        if (self._vtbl.item.vsz === 0) {
            self._vtbl.item.vsz = self._getNodeSize(self._vtbl.item.content,
                    "height");
        }

        self._renderItems();
        if (!self.get("hidePagination")) {
            self._renderNavigation();
        }
        self._renderContainer();

    },

    /**
     * Set the initial Carousel UI.
     *
     * @method syncUI
     * @protected
     */
    syncUI: function () {
        var self         = this,
            selectedItem = self.get("selectedItem");

        self._uiSetSelectedItem(selectedItem, true);
        if (!self.get("hidePagination")) {
            self._updateNavigation(selectedItem);
        }
    },

    /**
     * Add the Carousel items to the DOM on addItem.
     *
     * @method _addItemToDom
     * @protected
     */
    _addItemToDom: function (arg) {
        var self = this,
            cb   = self.get("contentBox"),
            item,
            node,
            numItems,
            pos;

        item = arg.item;
        pos = arg.pos + 1;      // real position has shifted now

        if (item && !cb.contains(item)) {
            node = self._vtbl.items[pos];
            if (node) {
                cb.insertBefore(item, node);
            } else {
                cb.append(item);
            }
            if (self.get("selectedItem") == pos) {
                numItems = self.get("numItems");
                ++pos;
                pos = pos > numItems - 1 ? numItems - 1 : pos;
                self.set("selectedItem", pos);
            }
            self._redrawUi();
        }
    },

    /**
     * Handle the "selectedItem" change and trigger the appropriate UI changes.
     *
     * @method _afterSelectedItemChange
     * @param {Event} ev The Event Facade containing the old and new states
     * @protected
     */
    _afterSelectedItemChange: function (ev) {
        var self = this;

        self._uiSetSelectedItem(ev.prevVal, false);
        self._uiSetSelectedItem(ev.newVal, true);
        self.fire(ITEMSELECTED_EVENT, { pos: ev.newVal });
        if (!self.get("hidePagination")) {
            self._updateNavigation(ev.newVal);
        }
    },

    /**
     * Return the correct index for the current configuration.
     *
     * @method _getCorrectedIndex
     * @param {Number} index The index of the item to be scrolled to
     * @return The corrected index after sanitizing for out of bounds error
     * @protected
     */
    _getCorrectedIndex: function (index) {
        var self       = this,
            isCircular = self.get("isCircular"),
            numItems   = self.get("numItems"),
            numVisible = self.get("numVisible"),
            sentinel   = numItems - 1,
            firstOfLastPage = 0;

        // Prevent Carousel to scroll beyond its bounds
        if (!isCircular) {
            firstOfLastPage = self.getPageForItem(sentinel) * numVisible;
        }
        
        if (index < 0) {
            if (isCircular) {
                index = firstOfLastPage;
            } else {
                index = 0;
            }
        } else if (index > sentinel) {
            if (isCircular) {
                index = 0;
            } else {
                index = firstOfLastPage;
            }
        }

        return index;
    },

    /**
     * Return the first visible item given the selected item and the number of
     * visible items in the view port.
     *
     * @method _getFirstVisible
     * @param {Number} selectedItem The selected item
     * @param {Number} numVisible The number of visible items in the view port
     * @return The first visible item
     * @protected
     */
    _getFirstVisible: function (selectedItem, numVisible) {
        return selectedItem - (selectedItem % numVisible);
    },

    /**
     * Return the absolute offset for the specified index.
     *
     * @method _getOffsetForIndex
     * @param {Number} index The index for which offset needs to be obtained
     * @return The absolute offset
     * @protected
     */
    _getOffsetForIndex: function (index) {
        var self = this,
            item = self._vtbl.item,
            sz;

        sz = self.get("isVertical") ? item.vsz : item.hsz;
        return -sz * index;
    },

    /**
     * Return the size of the given node including border, padding and margin.
     *
     * @method _getNodeSize
     * @param {Node} node The node for which the size needs to be computed
     * @param {String} which Set to one of height or width
     * @protected
     */
    _getNodeSize: function (node, which) {
        var sz = 0;

        if (node && node.constructor.NAME === "node") {
            if (which === "height") {
                sz = node.get("offsetHeight");
                if (sz === 0) { // height hasn't been computed yet
                    sz = parseInt(node.getStyle("marginTop"), 10)         +
                         parseInt(node.getStyle("paddingTop"), 10)        +
                         parseInt(node.getStyle("borderTopWidth"), 10)    +
                         parseInt(node.getStyle("height"), 10)            +
                         parseInt(node.getStyle("borderBottomWidth"), 10) +
                         parseInt(node.getStyle("paddingBottom"), 10)     +
                         parseInt(node.getStyle("marginBottom"), 10);
                }
            } else if (which == "width") {
                sz = node.get("offsetWidth");
                if (sz === 0) {
                    sz = parseInt(node.getStyle("marginLeft"), 10)        +
                         parseInt(node.getStyle("paddingLeft"), 10)       +
                         parseInt(node.getStyle("borderLeftWidth"), 10)   +
                         parseInt(node.getStyle("width"), 10)             +
                         parseInt(node.getStyle("borderRightWidth"), 10)  +
                         parseInt(node.getStyle("paddingRight"), 10)      +
                         parseInt(node.getStyle("marginRight"), 10);
                }
            }
        }

        return sz;
    },

    /**
     * Handle the item click event.
     *
     * @method _onItemClick
     * @protected
     */
    _onItemClick: function (ev) {
        var self = this,
            bb   = self.get("boundingBox"),
            container,
            el,
            i,
            itemClass,
            items,
            len,
            target;

        target = ev && ev.target ? ev.target : null;
        if (!target) {
            return;
        }

        container = bb.one("." + getCN(Carousel.NAME, cpContent));
        el        = target;
        itemClass = getCN(Carousel.NAME, cpItem);
        
        while (el && el != container) {
            if (el.hasClass(itemClass)) {
                break;
            }
            el = el.get("parentNode");
        }

        if (el) {
            items = self._vtbl.items;
            for (i = 0, len = items.length; i < len; ++i) {
                if (el == items[i]) {
                    self.set("selectedItem", i);
                    break;
                }
            }
        }
    },

    /**
     * Handle the navigation button click event.
     *
     * @method _onNavButtonClick
     * @protected
     */
    _onNavButtonClick: function (ev) {
        var self = this,
            target;

        ev.preventDefault();
        target = ev && ev.target ? ev.target : null;
        if (!target) {
            return;
        }

        if (!target.test(".yui3-carousel-button")) {
            target = target.ancestor();
        }

        if (target.hasClass("yui3-carousel-first-button")) {
            if (canGoBackward) {
                self.scrollPageBackward();
            }
        } else if (target.hasClass("yui3-carousel-next-button")) {
            if (canGoForward) {
                self.scrollPageForward();
            }
        }
    },

    /**
     * Handle the navigation item click event.
     *
     * @method _onNavItemClick
     * @protected
     */
    _onNavItemClick: function (ev) {
        var self = this,
            link,
            target;

        target = ev && ev.target ? ev.target : null;
        if (!target) {
            return;
        }
        ev.preventDefault();

        link = target.get("href");
        if (link) {
            link = parseInt(link.replace(/.*#(.*)$/, "$1"), 10);
            if (JS.isNumber(link)) {
                self.scrollToPage(link - 1);
            }
        }
    },

    /**
     * Parse the Carousel items and fill out the vtbl structure.
     *
     * @method _parseItems
     * @protected
     */
    _parseItems: function () {
        var self = this,
            cb,
            items;

        cb = self.get("contentBox");
        items = cb.all(self.get("carouselItemEl"));
        items.each(function (item, i) {
            if (!self.addItem(item)) {
            }
        }, self);
    },

    /**
     * Redraw the Carousel UI after updates.
     * 
     * @method _redrawUi
     * @protected
     */
    _redrawUi: function () {
        var attr = "left",
            self = this;
         
        self._renderItems();
        self._updateNavigation();
        if (self.get("isVertical")) {
            self._renderContainer();
            attr = "top";
        }
        self.scrollTo(self.get("selectedItem"));
    },

    /**
     * Remove the Carousel items from the DOM on removeItem.
     *
     * @method _removeItemFromDom
     * @protected
     */
    _removeItemFromDom: function (arg) {
        var self = this,
            cb   = self.get("contentBox"),
            item,
            pos;

        item = arg.item;
        pos  = arg.pos;

        if (item && cb.contains(item)) {
            item.remove(true);
            if (self.get("selectedItem") == pos) {
                --pos;
                pos = pos < 0 ? 0 : pos;
                self.set("selectedItem", pos);
            }
            /*
                An item removal would can result in any of the following cases:
                (a) the position of the items would require a change since one
                    of them would be missing now
                (b) the navigation has to be redrawn since the number of items
                    has changed
                (c) the container may have to be redrawn since the height may
                    have changed for a vertical Carousel
            */
            self._redrawUi();
        }
    },

    /**
     * Render the Carousel container.
     *
     * @method _renderContainer
     * @protected
     */
    _renderContainer: function () {
        var self = this,
            bb   = self.get("boundingBox"),
            hidePagination = self.get("hidePagination"),
            numVisible     = self.get("numVisible"),
            revealAmount   = self.get("revealAmount"),
            navsz = 0,
            nav,
            val;

        if (!hidePagination) {
            nav   = bb.one("." + getCN(Carousel.NAME, cpNav));
            navsz = self._getNodeSize(nav, "height");
        }

        if (this.get("isVertical")) {
            val = self._vtbl.item.vsz * numVisible;
            if (revealAmount > 0) {
                val += (val * revealAmount / 100);
            }
            self._uiSetHeight(val + navsz);
            self._uiSetWidth(self._vtbl.item.vsz);
            self._uiSetWidthCB(self._vtbl.item.vsz);
        } else {
            val = self._vtbl.item.hsz * numVisible;
            if (revealAmount > 0) {
                val += (val * revealAmount / 100);
            }
            self._uiSetWidth(val);
            self._uiSetHeight(self._vtbl.item.hsz + navsz);
            self._uiSetHeightCB(self._vtbl.item.hsz);
        }
    },

    /**
     * Render the Carousel items.
     *
     * @method _renderItems
     * @protected
     */
    _renderItems: function () {
        var self = this,
            cb   = self.get("contentBox"),
            attr,
            i,
            itemClass,
            n,
            node,
            size;

        if (self.get("isVertical")) {
            attr = "top";
            size = self._vtbl.item.vsz;
        } else {
            attr = "left";
            size = self._vtbl.item.hsz;
        }

        itemClass = getCN(Carousel.NAME, cpItem);
        for (i = 0, n = self._vtbl.items.length; i < n; ++i) {
            node = self._vtbl.items[i];
            if (node) {
                if (!node.inDoc()) {
                    if (i === 0) {
                        cb.appendChild(node);
                    } else {
                        cb.insertBefore(node, self._vtbl.items[i-1]);
                    }
                }
                node.setStyle(attr, size * i);
                node.addClass(itemClass);
            }
        }
    },

    /**
     * Render the Carousel navigation.
     *
     * @method _renderNavigation
     * @protected
     */
    _renderNavigation: function () {
        // TODO: check useMenuForNav and render a SELECT
        var self  = this,
            bb    = self.get("boundingBox"),
            cb    = self.get("contentBox"),
            items = [],
            i,
            nav,
            numPages,
            s,
            t;

        numPages = Math.ceil(self.get("numItems") / self.get("numVisible"));
        if (numPages < 1) {
            self.set("hidePagination", true);
            return;
        }

        s = self.get("strings.GOTO_PAGE");
        for (i = 1; i <= numPages; ++i) {
            t = Y.substitute(s, { page: i });
            items.push(Y.substitute(self.DEF_NAV_ITEM_TEMPLATE, {
                pagenum: i, label: t
            }));
        }

        self._navBtns = {
            prev: Y.guid(),
            next: Y.guid()
        };

        nav = Node.create(Y.substitute(self.DEF_NAV_TEMPLATE, {
            nav_items: items.join(""),
            nav_prev_btn_id: self.prev,
            nav_prev_btn_text: self.get("strings.PREV_PAGE"),
            nav_next_btn_id: self.next,
            nav_next_btn_text: self.get("strings.NEXT_PAGE")
        }));
        bb.insertBefore(nav, cb);
    },

    /**
     * Set the isVertical configuration attribute.
     *
     * @method _setVertical
     * @param {Boolean} attrVal The value to be set for the attribute
     * @param {String} attrName The attribute name itself
     */
    _setVertical: function (attrVal, attrName) {
        this._uiSetVertical(attrVal);
    },

    /**
     * Sets the height of the bounding box.
     *
     * @method _uiSetHeight
     * @param {String|Number} val
     * @override Widget.prototype._uiSetHeight
     */
    _uiSetHeight: function (val) {
        var self = this;

        if (val) {
            self.get("boundingBox").setStyle("height", val);
        }
    },

    /**
     * Sets the height of the content box.
     *
     * @method _uiSetHeightCB
     * @param {String|Number} val
     */
    _uiSetHeightCB: function (val) {
        var self = this;

        if (val) {
            self.get("contentBox").setStyle("height", val);
        }
    },

    /**
     * Set the appropriate UI for the selected navigation item.
     *
     * @method _uiSetNavItem
     * @protected
     */
    _uiSetNavItem: function (node) {
        var self = this,
            bb,
            clazz;

        if (!node) {
            return;
        }
        bb = self.get("boundingBox");
        clazz = getCN(Carousel.NAME, "nav-item-selected");
        bb.all("." + getCN(Carousel.NAME, cpNavItem)).removeClass(clazz);
        node.addClass(clazz);
    },

    /**
     * Set or clear the "selectedItem" UI.
     *
     * @method _uiSetSelectedItem
     * @param {Number} index The index of the selected item
     * @param {Boolean} flag The boolean indicating whether the selection needs
     *                       to be set or cleared
     * @protected
     */
    _uiSetSelectedItem: function (index, flag) {
        var self = this,
            node = self._vtbl.items[index],
            className = getCN(Carousel.NAME, "selected");

        if (node) {
            if (flag) {
                node.addClass(className);
            } else {
                node.removeClass(className);
            }
        }
    },

    /**
     * Set the Carousel orientation to vertical if isVertical is true.
     *
     * @method _uiSetVertical
     * @param {Boolean} val The value of the isVertical attribute
     */
    _uiSetVertical: function (val) {
        var bb = this.get("boundingBox");

        if (val) {
            bb.addClass(getCN(Carousel.NAME, "vertical"));
        } else {
            bb.addClass(getCN(Carousel.NAME, "horizontal"));
        }
    },

    /**
     * Sets the width of the bounding box.
     *
     * @method _uiSetWidth
     * @param {String|Number} val
     * @override Widget.prototype._uiSetWidth
     */
    _uiSetWidth: function (val) {
        var self = this;

        if (val) {
            self.get("boundingBox").setStyle("width", val);
        }
    },

    /**
     * Sets the width of the content box.
     *
     * @method _uiSetWidthCB
     * @param {String|Number} val
     */
    _uiSetWidthCB: function (val) {
        var self = this;

        if (val) {
            self.get("contentBox").setStyle("width", val);
        }
    },

    /**
     * Update the navigation.
     *
     * @method _updateNavigation
     * @param {Number} selectedItem Optional index of the selected item
     */
    _updateNavigation: function (selectedItem) {
        var self = this,
            bb   = self.get("boundingBox"),
            isCircular = self.get("isCircular"),
            btn,
            currPage,
            i,
            lastPage,
            numPages,
            pageContainer,
            pages,
            s,
            t;

        selectedItem = selectedItem || self.get("selectedItem");
        self._uiSetSelectedItem(selectedItem, true);
        pages = bb.all("." + getCN(Carousel.NAME, cpNavItem));
        
        /*
            Redraw the page bubbles for the _uiSetNavItem to update the
            selected page.
        */
        numPages = Math.ceil(self.get("numItems") / self.get("numVisible"));
        pages.remove();

        pageContainer = bb.one(".yui3-carousel-nav > ul");
        s = self.get("strings.GOTO_PAGE");
        for (i = 1; i <= numPages; ++i) {
            t = Y.substitute(s, { page: i });
            pageContainer.append(Y.substitute(self.DEF_NAV_ITEM_TEMPLATE, {
                pagenum: i, label: t
            }));
        }
        pages = bb.all("." + getCN(Carousel.NAME, cpNavItem));
        
        currPage = self.getPageForItem(selectedItem);
        self._uiSetNavItem(pages.item(currPage));
        lastPage = self.getPageForItem(self.get("numItems") - 1);

        if (lastPage < 0) {
            btn = bb.one("." + getCN(Carousel.NAME, "first", cpButton));
            if (btn) {
                btn.addClass(getCN(Carousel.NAME, "first", cpButtonDisabled));
                canGoBackward = false;
            }
            btn = bb.one("." + getCN(Carousel.NAME, "next", cpButton));
            if (btn) {
                btn.addClass(getCN(Carousel.NAME, cpButtonDisabled));
                canGoForward = false;
            }
        } else if (currPage === 0 && currPage != lastPage) {
            btn = bb.one("." + getCN(Carousel.NAME, "next", cpButton));
            if (btn) {
                btn.removeClass(getCN(Carousel.NAME, cpButtonDisabled));
                canGoForward = true;
            }
            if (!isCircular) {
                btn = bb.one("." + getCN(Carousel.NAME, "first", cpButton));
                if (btn) {
                    btn.addClass(getCN(Carousel.NAME, "first",
                            cpButtonDisabled));
                    canGoBackward = false;
                }
            }
        } else if (currPage !== 0 && currPage == lastPage) {
            btn = bb.one("." + getCN(Carousel.NAME, "first", cpButton));
            if (btn) {
                btn.removeClass(getCN(Carousel.NAME, "first",
                        cpButtonDisabled));
                canGoBackward = true;
            }
            if (!isCircular) {
                btn = bb.one("." + getCN(Carousel.NAME, "next", cpButton));
                if (btn) {
                    btn.addClass(getCN(Carousel.NAME, cpButtonDisabled));
                    canGoForward = false;
                }
            }
        } else if (lastPage > 0) {
            btn = bb.one("." + getCN(Carousel.NAME, "first", cpButton));
            if (btn) {
                btn.removeClass(getCN(Carousel.NAME, "first",
                        cpButtonDisabled));
                canGoBackward = true;
            }
            btn = bb.one("." + getCN(Carousel.NAME, "next", cpButton));
            if (btn) {
                btn.removeClass(getCN(Carousel.NAME, cpButtonDisabled));
                canGoForward = true;
            }
        }
    },

    /**
     * Validate the numVisible attribute configuration.
     *
     * @method _validateNumVisible
     * @param {Number} attrVal The value to be set for the attribute
     * @param {String} attrName The attribute name itself
     */
    _validateNumVisible: function (attrVal, attrName) {
        return attrVal > 0;
    },

    /**
     * Validate the revealAmount attribute configuration.
     *
     * @method _validateRevealAmount
     * @param {Number} attrVal The value to be set for the attribute
     * @param {String} attrName The attribute name itself
     */
    _validateRevealAmount: function (attrVal, attrName) {
        return attrVal >= 0 && attrVal <= 100;
    },

    /**
     * Template for a single Carousel item.
     */
    ITEM_TEMPLATE: "<li class=\"yui3-carousel-item\">{content}</li>",

    /**
     * Template for the Carousel navigation.
     */
    DEF_NAV_TEMPLATE: "<div class=\"yui3-carousel-nav\">" +
        "<ul>{nav_items}</ul>" +
        "<span class=\"yui3-carousel-button yui3-carousel-first-button\">" +
        "<button type=\"button\">" + "{nav_prev_btn_text}</button>" +
        "</span>" +
        "<span class=\"yui3-carousel-button yui3-carousel-next-button\">" +
        "<button type=\"button\">" + "{nav_next_btn_text}</button>" +
        "</span>" +
        "</div>",

    /**
     * Template for a single Carousel navigation item.
     */
    DEF_NAV_ITEM_TEMPLATE: "<li class=\"yui3-carousel-nav-item\">" +
        "<a class=\"yui3-carousel-pager-item\" " +
        "href=\"#{pagenum}\"><em>{label}</em></a></li>",

    /*
     * The navigation buttons.
     */
    _navBtns: null,

    /*
     * The internal virtual table for Carousel.  The "items" is an array of
     * items in the Carousel.  The "item" is an Object having a single Node
     * from the list of items (for calculating the size) and the size of a
     * single Carousel item.
     *
     * The "items" array can be a sparse array.
     */
    _vtbl: null
});


}, 'gallery-2012.06.06-19-59' ,{skinnable:true, requires:['widget']});
