YUI.add('gallery-accordion', function(Y) {

/**
 * Provides Accordion widget
 *
 * @module gallery-accordion
 */

(function(){

// Local constants
var Lang = Y.Lang,
    Node = Y.Node,
    Anim = Y.Anim,
    Easing = Y.Easing,
    AccName = "accordion",
    WidgetStdMod = Y.WidgetStdMod,
    QuirksMode = document.compatMode == "BackCompat",
    IEQuirksMode = QuirksMode && Y.UA.ie > 0,
    COLLAPSE_HEIGHT = IEQuirksMode ? 1 : 0,
    getCN = Y.ClassNameManager.getClassName,
    
    C_ITEM = "yui3-accordion-item",
    C_PROXY_VISIBLE = getCN( AccName, "proxyel", "visible" ),
    DRAGGROUP = getCN( AccName, "graggroup" ),

    BEFOREITEMADD = "beforeItemAdd",
    ITEMADDED = "itemAdded",
    ITEMCHOSEN = 'itemChosen',
    BEFOREITEMREMOVE = "beforeItemRemove",
    ITEMREMOVED = "itemRemoved",
    BEFOREITEMERESIZED = "beforeItemResized",
    ITEMERESIZED = "itemResized",

    BEFOREITEMEXPAND  = "beforeItemExpand",
    BEFOREITEMCOLLAPSE = "beforeItemCollapse",
    ITEMEXPANDED = "itemExpanded",
    ITEMCOLLAPSED = "itemCollapsed",

    BEFOREITEMREORDER = "beforeItemReorder",
    BEFOREENDITEMREORDER = "beforeEndItemReorder",
    ITEMREORDERED = "itemReordered",
    
    DEFAULT = "default",
    ANIMATION = "animation",
    ALWAYSVISIBLE = "alwaysVisible",
    EXPANDED = "expanded",
    COLLAPSEOTHERSONEXPAND = "collapseOthersOnExpand",
    ITEMS = "items",
    CONTENT_HEIGHT = "contentHeight",
    ICON_CLOSE = "iconClose",
    ICON_ALWAYSVISIBLE = "iconAlwaysVisible",
    STRETCH = "stretch",
    PX = "px",
    CONTENT_BOX = "contentBox",
    BOUNDING_BOX = "boundingBox",
    SRCNODE = "srcNode",
    RENDERED = "rendered",
    BODYCONTENT = "bodyContent",
    CHILDREN = "children",
    PARENT_NODE = "parentNode",
    NODE = "node",
    DATA = "data";


/**
 * Accordion creates an widget, consists of one or more items, which can be collapsed, expanded,
 * set as always visible and reordered by using Drag&Drop. Collapsing/expanding might be animated.
 *
 * @class Accordion
 * @extends Widget
 */

Y.Accordion = Y.Base.create( AccName, Y.Widget, [], {

    /**
     * Signals the beginning of adding an item to the Accordion.
     *
     * @event beforeItemAdd
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being added</dd>
     *  </dl>
     */


    /**
     * Signals an item has been added to the Accordion.
     *
     * @event itemAdded
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item that has been added</dd>
     *  </dl>
     */


    /**
     * Signals the beginning of removing an item.
     *
     * @event beforeItemRemove
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being removed</dd>
     *  </dl>
     */


    /**
     * Signals an item has been removed from Accordion.
     *
     * @event itemRemoved
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item that has been removed</dd>
     *  </dl>
     */


    /**
     * Signals the beginning of resizing an item.
     *
     * @event beforeItemResized
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being resized</dd>
     *  </dl>
     */


    /**
     * Signals an item has been resized.
     *
     * @event itemResized
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item that has been resized</dd>
     *  </dl>
     */


    /**
     * Signals the beginning of expanding an item
     *
     * @event beforeItemExpand
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being expanded</dd>
     *  </dl>
     */


    /**
     * Signals the beginning of collapsing an item
     *
     * @event beforeItemCollapse
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being collapsed</dd>
     *  </dl>
     */


    /**
     * Signals an item has been expanded
     *
     * @event itemExpanded
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item that has been expanded</dd>
     *  </dl>
     */


    /**
     * Signals an item has been collapsed
     *
     * @event itemCollapsed
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item that has been collapsed</dd>
     *  </dl>
     */


    /**
     * Signals the beginning of reordering an item
     *
     * @event beforeItemReorder
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being reordered</dd>
     *  </dl>
     */


    /**
     * Fires before the end of item reordering
     *
     * @event beforeEndItemReorder
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being reordered</dd>
     *  </dl>
     */


    /**
     * Signals an item has been reordered
     *
     * @event itemReordered
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item that has been reordered</dd>
     *  </dl>
     */


    /**
     * Initializer lifecycle implementation for the Accordion class. Publishes events,
     * initializes internal properties and subscribes for resize event.
     *
     * @method initializer
     * @protected
     * @param config {Object} Configuration object literal for the Accordion
     */
    initializer: function( config ) {
        this._initEvents();

        this.after( "render", Y.bind( this._afterRender, this ) );
    },


    /**
     * Destructor lifecycle implementation for the Accordion class.
     * Removes and destroys all registered items.
     *
     * @method destructor
     * @protected
     */
    destructor: function() {
        var items, item, i, length;

        items = this.get( ITEMS );
        length = items.length;

        for( i = length - 1; i >= 0; i-- ){
            item = items[ i ];

            items.splice( i, 1 );

            this._removeItemHandles( item );

            item.destroy();
        }
    },

    /**
     * Binds an event to Accordion's contentBox.
     *
     * @method _bindItemChosenEvent
     * @protected
     */
    _bindItemChosenEvent: function(itemChosenEvent) {
        var contentBox;

        contentBox = this.get( CONTENT_BOX );
        contentBox.delegate( itemChosenEvent, Y.bind( this._onItemChosenEvent, this ), '.yui3-widget-hd' );
    },

    /**
     * Publishes Accordion's events
     *
     * @method _initEvents
     * @protected
     */
    _initEvents: function(){
        /**
         * Signals that an item has been chosen by user, i.e. there was interaction with this item.
         * The developer may prevent the action which follows (expanding, collapsing, closing, etc.) by preventing the default function, bound to this event.
         *
         * @event itemChosen
         * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
         *  <dl>
         *      <dt>item</dt>
         *          <dd>An <code>AccordionItem</code> item on which user has clicked or pressed key</dd>
         *      <dt>srcIconAlwaysVisible <code>Boolean</code></dt>
         *          <dd>True if user has clicked on 'set as always visible' icon</dd>
         *      <dt>srcIconClose <code>Boolean</code></dt>
         *          <dd>True if user has clicked on 'close' icon</dd>
         *  </dl>
         */
        this.publish( ITEMCHOSEN, {
            defaultFn: this._onItemChosen
        });
    },

    /**
     * Contains items for collapsing
     * @property _forCollapsing
     * @protected
     * @type Object
     */
    _forCollapsing : {},


    /**
     * Contains items for expanding
     * @property _forExpanding
     * @protected
     * @type Object
     */
    _forExpanding : {},


    /**
    * Contains currently running animations
    * @property _animations
    * @protected
    * @type Object
    */
    _animations   : {},


    /**
     * Collection of items handles.
     * Keeps track of each items's event handle, as returned from <code>Y.on</code> or <code>Y.after</code>.
     * @property _itemHandles
     * @private
     * @type Object
     */
    _itemsHandles: {},


    /**
     * Removes all handles, attched to given item
     *
     * @method _removeItemHandles
     * @protected
     * @param item {Y.AccordionItem} The item, which handles to remove
     */
    _removeItemHandles: function( item ){
        var itemHandles, itemHandle;

        itemHandles = this._itemsHandles[ item ];

        for( itemHandle in itemHandles ){
            if( itemHandles.hasOwnProperty( itemHandle ) ){
                itemHandle = itemHandles[ itemHandle ];
                itemHandle.detach();
            }
        }

        delete this._itemsHandles[ item ];
    },

    /**
     * Obtains the precise height of the node provided, including padding and border.
     *
     * @method _getNodeOffsetHeight
     * @protected
     * @param node {Node|HTMLElement} The node to gather the height from
     * @return {Number} The calculated height or zero in case of failure
     */
    _getNodeOffsetHeight: function( node ){
        var height, preciseRegion;

        if( node instanceof Node ){
            if( node.hasMethod( "getBoundingClientRect" ) ){
                preciseRegion = node.invoke( "getBoundingClientRect" );

                if( preciseRegion ){
                    height = preciseRegion.bottom - preciseRegion.top;

                    return height;
                }
            } else {
                height = node.get( "offsetHeight" );
                return Y.Lang.isValue( height ) ? height : 0;
            }
        } else if( node ){
            height = node.offsetHeight;
            return Y.Lang.isValue( height ) ? height : 0;
        }

        return 0;
    },


    /**
     * Updates expand and alwaysVisible properties of given item with the values provided.
     * The properties will be updated only if needed.
     *
     * @method _setItemProperties
     * @protected
     * @param item {Y.AccordionItem} The item, which properties should be updated
     * @param expanding {Boolean} The new value of "expanded" property
     * @param alwaysVisible {Boolean} The new value of "alwaysVisible" property
     */
    _setItemProperties: function( item, expanding, alwaysVisible ){
        var curAlwaysVisible, curExpanded;

        curAlwaysVisible = item.get( ALWAYSVISIBLE );
        curExpanded = item.get( EXPANDED );

        if( expanding != curExpanded ){
            item.set( EXPANDED, expanding, {
                internalCall: true
            });
        }

        if( alwaysVisible !== curAlwaysVisible ){
            item.set( ALWAYSVISIBLE, alwaysVisible, {
                internalCall: true
            });
        }
    },


    /**
     * Updates user interface of an item and marks it as expanded, alwaysVisible or both
     *
     * @method _setItemUI
     * @protected
     * @param item {Y.AccordionItem} The item, which user interface should be updated
     * @param expanding {Boolean} If true, the item will be marked as expanded.
     * If false, the item will be marked as collapsed
     * @param alwaysVisible {Boolean} If true, the item will be marked as always visible.
     * If false, the always visible mark will be removed
     */
    _setItemUI: function( item, expanding, alwaysVisible ){
        item.markAsExpanded( expanding );
        item.markAsAlwaysVisible( alwaysVisible );
    },


    /**
     * Sets listener to resize event
     *
     * @method _afterRender
     * @protected
     * @param e {Event} after render custom event
     */
    _afterRender: function( e ){
        var resizeEvent;

        resizeEvent = this.get( "resizeEvent" );

        this._setUpResizing( resizeEvent );

        this.after( "resizeEventChange", Y.bind( this._afterResizeEventChange, this ) );
    },


    /**
     * Set up resizing with the new value provided
     *
     * @method _afterResizeEventChange
     * @protected
     * @param params {Event} after resizeEventChange custom event
     */
    _afterResizeEventChange: function( params ){
        this._setUpResizing( params.newVal );
    },


    /**
     * Distributes the involved items as result of user interaction on item header.
     * Some items might be stored in the list for collapsing, other in the list for expanding.
     * Finally, invokes <code>_processItems</code> function, except if item has been expanded and
     * user has clicked on always visible icon.
     * If the user clicked on close icon, the item will be closed.
     *
     * @method _onItemChosen
     * @protected
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> item on which user has clicked or pressed key</dd>
     *      <dt>srcIconAlwaysVisible {Boolean}</dt>
     *          <dd>True if user has clicked on 'set as always visible' icon</dd>
     *      <dt>srcIconClose {Boolean}</dt>
     *          <dd>True if user has clicked on 'close' icon</dd>
     *  </dl>
     */
    _onItemChosen: function( event ){
        var toBeExcluded, alwaysVisible, expanded, collapseOthersOnExpand,
            item, srcIconAlwaysVisible, srcIconClose;

        item = event.item;
        srcIconAlwaysVisible = event.srcIconAlwaysVisible;
        srcIconClose = event.srcIconClose;

        toBeExcluded = {};
        collapseOthersOnExpand = this.get( COLLAPSEOTHERSONEXPAND );
        alwaysVisible = item.get( ALWAYSVISIBLE );
        expanded      = item.get( EXPANDED );

        if( srcIconClose ){
            this.removeItem( item );
            return;
        } else if( srcIconAlwaysVisible ){
            if( expanded ){
                alwaysVisible = !alwaysVisible;
                expanded = alwaysVisible ? true : expanded;

                this._setItemProperties( item, expanded, alwaysVisible );
                this._setItemUI( item, expanded, alwaysVisible );

                return;
            } else {
                this._forExpanding[ item ] = {
                    'item': item,
                    alwaysVisible: true
                };

                if( collapseOthersOnExpand ){
                    toBeExcluded[ item ] = {
                        'item': item
                    };

                    this._storeItemsForCollapsing( toBeExcluded );
                }
            }
        } else {
            /*
             * Do the opposite
             */
            if( expanded ){
                this._forCollapsing[ item ] = {
                    'item': item
                };
            } else {
                this._forExpanding[ item ] = {
                    'item': item,
                    'alwaysVisible': alwaysVisible
                };

                if( collapseOthersOnExpand ){
                    toBeExcluded[ item ] = {
                        'item': item
                    };

                    this._storeItemsForCollapsing( toBeExcluded );
                }
            }
        }

        this._processItems();
    },


    /**
     * Helper method to adjust the height of all items, which <code>contentHeight</code> property is set as "stretch".
     * If some item has animation running, it will be stopped before running another one.
     *
     * @method adjustStretchItems
     * @protected
     * @return {Number} The calculated height per strech item
     */
    _adjustStretchItems: function(){
        var items = this.get( ITEMS ), heightPerStretchItem, forExpanding;

        heightPerStretchItem = this._getHeightPerStretchItem();
        forExpanding = this._forExpanding;

        Y.Array.each( items, function( item, index, items ){
            var body, bodyHeight, anim, heightSettings, expanded;

            heightSettings = item.get( CONTENT_HEIGHT );
            expanded      = item.get( EXPANDED );

            if( !forExpanding[ item ] && heightSettings.method === STRETCH && expanded ){
                anim = this._animations[ item ];

                // stop waiting animation
                if( anim ){
                    anim.stop();
                }

                body = item.getStdModNode( WidgetStdMod.BODY );
                bodyHeight = this._getNodeOffsetHeight( body );

                if( heightPerStretchItem < bodyHeight ){
                    this._processCollapsing( item, heightPerStretchItem );
                } else if( heightPerStretchItem > bodyHeight ){
                    this._processExpanding( item, heightPerStretchItem );
                }
            }
        }, this );

        return heightPerStretchItem;
    },

    /**
     * Calculates the height per strech item.
     *
     * @method _getHeightPerStretchItem
     * @protected
     * @return {Number} The calculated height per strech item
     */
    _getHeightPerStretchItem: function(){
        var height, items, stretchCounter = 0;

        items = this.get( ITEMS );
        height = this.get( BOUNDING_BOX ).get( "clientHeight" );

        Y.Array.each( items, function( item, index, items ){
            var collapsed, itemContentHeight, header, heightSettings, headerHeight;

            header = item.getStdModNode( WidgetStdMod.HEADER );
            heightSettings = item.get( CONTENT_HEIGHT );

            headerHeight = this._getNodeOffsetHeight( header );

            height -= headerHeight;
            collapsed = !item.get( EXPANDED );

            if( collapsed ){
                height -= COLLAPSE_HEIGHT;
                return;
            }

            if( heightSettings.method === STRETCH ){
                stretchCounter++;
            } else {
                itemContentHeight = this._getItemContentHeight( item );
                height -= itemContentHeight;
            }
        }, this );

        if( stretchCounter > 0 ){
            height /= stretchCounter;
        }

        if( height < 0 ){
            height = 0;
        }

        return height;
    },


    /**
     * Calculates the height of given item depending on its "contentHeight" property.
     *
     * @method _getItemContentHeight
     * @protected
     * @param item {Y.AccordionItem} The item, which height should be calculated
     * @return {Number} The calculated item's height
     */
    _getItemContentHeight: function( item ){
        var heightSettings, height = 0, body, bodyContent;

        heightSettings = item.get( CONTENT_HEIGHT );

        if( heightSettings.method === "auto" ){
            body = item.getStdModNode( WidgetStdMod.BODY );
            bodyContent = body.get( CHILDREN ).item(0);
            height = bodyContent ? this._getNodeOffsetHeight( bodyContent ) : 0;
        } else if( heightSettings.method === "fixed" ) {
            height = heightSettings.height;
        } else {
            height = this._getHeightPerStretchItem();
        }

        return height;
    },


    /**
     * Stores all items, which are expanded and not set as always visible in list
     * in order to be collapsed later.
     *
     * @method _storeItemsForCollapsing
     * @protected
     * @param itemsToBeExcluded {Object} (optional) Contains one or more <code>Y.AccordionItem</code> instances,
     * which should be not included in the list
     */
    _storeItemsForCollapsing: function( itemsToBeExcluded ){
        var items;

        itemsToBeExcluded = itemsToBeExcluded || {};
        items = this.get( ITEMS );

        Y.Array.each( items, function( item, index, items ){
            var expanded, alwaysVisible;

            expanded = item.get( EXPANDED );
            alwaysVisible = item.get( ALWAYSVISIBLE );

            if( expanded && !alwaysVisible && !itemsToBeExcluded[ item ] ){
                this._forCollapsing[ item ] = {
                    'item': item
                };
            }
        }, this );
    },


    /**
     * Expands an item to given height. This includes also an update to item's user interface
     *
     * @method _expandItem
     * @protected
     * @param item {Y.AccordionItem} The item, which should be expanded.
     * @param height {Number} The height to which we should expand the item
     */
    _expandItem: function( item, height ){
        var alwaysVisible = item.get( ALWAYSVISIBLE );

        this._processExpanding( item, height );
        this._setItemUI( item, true, alwaysVisible );
    },


    /**
     * Expands an item to given height. Depending on the <code>useAnimation</code> setting,
     * the process of expanding might be animated. This setting will be ignored, if <code>forceSkipAnimation</code> param
     * is <code>true</code>.
     *
     * @method _processExpanding
     * @protected
     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance to be expanded
     * @param forceSkipAnimation {Boolean} If true, the animation will be skipped,
     * without taking in consideration Accordion's <code>useAnimation</code> setting
     * @param height {Number} The height to which item should be expanded
     */
    _processExpanding: function( item, height, forceSkipAnimation ){
        var anim, curAnim, animSettings, notifyOthers = false,
            accAnimationSettings, body;

        body = item.getStdModNode( WidgetStdMod.BODY );

        this.fire( BEFOREITEMERESIZED, {
            'item': item
        });

        if( body.get( "clientHeight" ) <= COLLAPSE_HEIGHT ){
            notifyOthers = true;
            this.fire( BEFOREITEMEXPAND, {
                'item': item
            });
        }

        if( !forceSkipAnimation && this.get( "useAnimation" ) ){
            animSettings = item.get( ANIMATION ) || {};

            anim = new Anim( {
                node: body,
                to: {
                    'height': height
                }
            });

            anim.on( "end", Y.bind( this._onExpandComplete, this, item, notifyOthers ) );

            accAnimationSettings = this.get( ANIMATION );

            anim.set( "duration", animSettings.duration || accAnimationSettings.duration );
            anim.set( "easing"  , animSettings.easing   || accAnimationSettings.easing   );

            curAnim = this._animations[ item ];

            if( curAnim ){
                curAnim.stop();
            }

            item.markAsExpanding( true );

            this._animations[ item ] = anim;

            anim.run();
        } else {
            body.setStyle( "height", height + PX );

            this.fire( ITEMERESIZED, {
                'item': item
            });

            if( notifyOthers ){
                this.fire( ITEMEXPANDED, {
                    'item': item
                });
            }
        }
    },


    /**
     * Executes when animated expanding completes
     *
     * @method _onExpandComplete
     * @protected
     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance which has been expanded
     * @param notifyOthers {Boolean} If true, itemExpanded event will be fired
     */
    _onExpandComplete: function( item, notifyOthers ){
        delete this._animations[ item ];

        item.markAsExpanding( false );

        this.fire( ITEMERESIZED, {
            'item': item
        });

        if( notifyOthers ){
            this.fire( ITEMEXPANDED, {
                'item': item
            });
        }
    },


    /**
     * Collapse an item and update its user interface
     *
     * @method _collapseItem
     * @protected
     * @param item {Y.AccordionItem} The item, which should be collapsed
     */
    _collapseItem: function( item ){
        this._processCollapsing( item, COLLAPSE_HEIGHT );
        this._setItemUI( item, false, false );
    },


    /**
     * Collapse an item to given height. Depending on the <code>useAnimation</code> setting,
     * the process of collapsing might be animated. This setting will be ignored, if <code>forceSkipAnimation</code> param
     * is <code>true</code>.
     *
     * @method _processCollapsing
     * @protected
     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance to be collapsed
     * @param height {Number} The height to which item should be collapsed
     * @param forceSkipAnimation {Boolean} If true, the animation will be skipped,
     * without taking in consideration Accordion's <code>useAnimation</code> setting
     */
    _processCollapsing: function( item, height, forceSkipAnimation ){
        var anim, curAnim, animSettings, accAnimationSettings, body,
            notifyOthers = (height === COLLAPSE_HEIGHT);

        body = item.getStdModNode( WidgetStdMod.BODY );


        this.fire( BEFOREITEMERESIZED, {
            'item': item
        });

        if( notifyOthers ){
            this.fire( BEFOREITEMCOLLAPSE, {
                'item': item
            });
        }

        if( !forceSkipAnimation && this.get( "useAnimation" ) ){
            animSettings = item.get( ANIMATION ) || {};

            anim = new Anim( {
                node: body,
                to: {
                    'height': height
                }
            });

            anim.on( "end", Y.bind( this._onCollapseComplete, this, item, notifyOthers ) );

            accAnimationSettings = this.get( ANIMATION );

            anim.set( "duration", animSettings.duration || accAnimationSettings.duration );
            anim.set( "easing"  , animSettings.easing   || accAnimationSettings.easing );

            curAnim = this._animations[ item ];

            if( curAnim ){
                curAnim.stop();
            }

            item.markAsCollapsing( true );

            this._animations[ item ] = anim;

            anim.run();
        } else {
            body.setStyle( "height", height + PX );

            this.fire( ITEMERESIZED, {
                'item': item
            });

            if( notifyOthers ){
                this.fire( ITEMCOLLAPSED, {
                    'item': item
                });
            }
        }
    },


    /**
     * Executes when animated collapsing completes
     *
     * @method _onCollapseComplete
     * @protected
     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance which has been collapsed
     * @param notifyOthers {Boolean} If true, itemCollapsed event will be fired
     */
    _onCollapseComplete: function( item, notifyOthers ){
        delete this._animations[ item ];

        item.markAsCollapsing( false );

        this.fire( ITEMERESIZED, {
            item: item
        });

        if( notifyOthers ){
            this.fire( ITEMCOLLAPSED, {
                'item': item
            });
        }
    },


    /**
     * Make an item draggable. The item can be reordered later.
     *
     * @method _initItemDragDrop
     * @protected
     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance to be set as draggable
     */
    _initItemDragDrop: function( item ){
        var itemHeader, dd, bb, itemBB, ddrop;

        itemHeader = item.getStdModNode( WidgetStdMod.HEADER );

        if( itemHeader.dd ){
            return;
        }

        bb = this.get( BOUNDING_BOX );
        itemBB = item.get( BOUNDING_BOX );

        dd = new Y.DD.Drag({
            node: itemHeader,
            groups: [ DRAGGROUP ]
        }).plug(Y.Plugin.DDProxy, {
            moveOnEnd: false
        }).plug(Y.Plugin.DDConstrained, {
            constrain2node: bb
        });

        ddrop = new Y.DD.Drop({
            node: itemBB,
            groups: [ DRAGGROUP ]
        });

        dd.on   ( "drag:start",   Y.bind( this._onDragStart,  this, dd ) );
        dd.on   ( "drag:end"  ,   Y.bind( this._onDragEnd,    this, dd ) );
        dd.after( "drag:end"  ,   Y.bind( this._afterDragEnd, this, dd ) );
        dd.on   ( "drag:drophit", Y.bind( this._onDropHit,    this, dd ) );
    },


    /**
     * Sets the label of the item being dragged on the drag proxy.
     * Fires beforeItemReorder event - returning false will cancel reordering
     *
     * @method _onDragStart
     * @protected
     * @param dd {Y.DD.Drag} The drag instance of the item
     * @param e {Event} the DD instance's drag:start custom event
     */
    _onDragStart: function( dd, e ){
        var dragNode, item;

        item = this.getItem( dd.get( NODE ).get( PARENT_NODE ) );
        dragNode = dd.get( "dragNode" );

        dragNode.addClass( C_PROXY_VISIBLE );
        dragNode.set( "innerHTML", item.get( "label" ) );

        return this.fire( BEFOREITEMREORDER, { 'item': item } );
    },


    /**
     * Restores HTML structure of the drag proxy.
     * Fires beforeEndItemReorder event - returning false will cancel reordering
     *
     * @method _onDragEnd
     * @protected
     * @param dd {Y.DD.Drag} The drag instance of the item
     * @param e {Event} the DD instance's drag:end custom event
     */
    _onDragEnd: function( dd, e ){
        var dragNode, item;

        dragNode = dd.get( "dragNode" );

        dragNode.removeClass( C_PROXY_VISIBLE );
        dragNode.set( "innerHTML", "" );

        item = this.getItem( dd.get( NODE ).get( PARENT_NODE ) );
        return this.fire( BEFOREENDITEMREORDER, { 'item': item } );
    },


    /**
     * Set drophit to false in dragdrop instance's custom value (if there has been drophit) and fires itemReordered event
     *
     * @method _afterDragEnd
     * @protected
     * @param dd {Y.DD.Drag} The drag instance of the item
     * @param e {Event} the DD instance's drag:end custom event
     */
    _afterDragEnd: function( dd, e ){
        var item, data;

        data = dd.get( DATA );

        if( data.drophit ){
            item = this.getItem( dd.get( NODE ).get( PARENT_NODE ) );

            dd.set( DATA, {
                drophit: false
            } );

            return this.fire( ITEMREORDERED, { 'item': item } );
        }

        return true;
    },


    /**
     * Moves the source item before or after target item.
     *
     * @method _onDropHit
     * @protected
     * @param dd {Y.DD.Drag} The drag instance of the item
     * @param e {Event} the DD instance's drag:drophit custom event
     */
    _onDropHit: function( dd, e) {
        var mineIndex, targetItemIndex, targetItemBB, itemBB, cb,
            goingUp, items, targetItem, item;

        item = this.getItem( dd.get( NODE ).get( PARENT_NODE ) );
        targetItem = this.getItem( e.drop.get( NODE ) );

        if( targetItem === item ){
            return false;
        }

        mineIndex = this.getItemIndex( item );
        targetItemIndex = this.getItemIndex( targetItem );
        targetItemBB = targetItem.get( BOUNDING_BOX );
        itemBB = item.get( BOUNDING_BOX );
        cb = this.get( CONTENT_BOX );
        goingUp = false;
        items = this.get( ITEMS );

        if( targetItemIndex < mineIndex ){
            goingUp = true;
        }

        cb.removeChild( itemBB );

        if( goingUp ){
            cb. insertBefore( itemBB, targetItemBB );
            items.splice( mineIndex, 1 );
            items.splice( targetItemIndex, 0, item );
        } else {
            cb. insertBefore( itemBB, targetItemBB.next( C_ITEM ) );
            items.splice( targetItemIndex + 1, 0, item );
            items.splice( mineIndex, 1 );
        }

        dd.set( DATA, {
            drophit: true
        });

        return true;
    },


    /**
     * Process items as result of user interaction or properties change.
     * This includes four steps:
     * 1. Update the properties of the items
     * 2. Collapse all items stored in the list for collapsing
     * 3. Adjust all stretch items
     * 4. Expand items stored in the list for expanding
     *
     * @method _processItems
     * @protected
     */
    _processItems: function(){
        var forCollapsing, forExpanding, itemCont, heightPerStretchItem,
            height, heightSettings, item;

        forCollapsing = this._forCollapsing;
        forExpanding = this._forExpanding;

        this._setItemsProperties();

        for( item in forCollapsing ){
            if( forCollapsing.hasOwnProperty( item ) ){
                itemCont = forCollapsing[ item ];

                this._collapseItem( itemCont.item );
            }
        }

        heightPerStretchItem = this._adjustStretchItems();

        for( item in forExpanding ){
            if( forExpanding.hasOwnProperty( item ) ){
                itemCont = forExpanding[ item ];
                item = itemCont.item;
                height = heightPerStretchItem;
                heightSettings = item.get( CONTENT_HEIGHT );

                if( heightSettings.method !== STRETCH ){
                    height = this._getItemContentHeight( item );
                }

                this._expandItem( item, height );
            }
        }

        this._forCollapsing = {};
        this._forExpanding = {};
    },


    /**
     * Update properties of items, which were stored in the lists for collapsing or expanding
     *
     * @method _setItemsProperties
     * @protected
     */
    _setItemsProperties: function (){
        var forCollapsing, forExpanding, itemData;

        forCollapsing = this._forCollapsing;
        forExpanding = this._forExpanding;

        for( itemData in forCollapsing ){
            if( forCollapsing.hasOwnProperty( itemData ) ){
                itemData = forCollapsing[ itemData ];
                this._setItemProperties( itemData.item, false, false );
            }
        }

        for( itemData in forExpanding ){
            if( forExpanding.hasOwnProperty( itemData ) ){
                itemData = forExpanding[ itemData ];
                this._setItemProperties( itemData.item, true, itemData.alwaysVisible );
            }
        }
    },


    /**
     * Handles the change of "expand" property of given item
     *
     * @method _afterItemExpand
     * @protected
     * @param params {EventFacade} The event facade for the attribute change
     */
    _afterItemExpand: function( params ){
        var expanded, item, alwaysVisible, collapseOthersOnExpand;

        if( params.internalCall ){
            return;
        }

        expanded = params.newVal;
        item    = params.currentTarget;
        alwaysVisible = item.get( ALWAYSVISIBLE );
        collapseOthersOnExpand = this.get( COLLAPSEOTHERSONEXPAND );

        if( expanded ){
            this._forExpanding[ item ] = {
                'item': item,
                'alwaysVisible': alwaysVisible
            };

            if( collapseOthersOnExpand ){
                this._storeItemsForCollapsing();
            }
        } else {
            this._forCollapsing[ item ] = {
                'item': item
            };
        }

        this._processItems();
    },

    /**
     * Handles the change of "alwaysVisible" property of given item
     *
     * @method _afterItemAlwaysVisible
     * @protected
     * @param params {EventFacade} The event facade for the attribute change
     */
    _afterItemAlwaysVisible: function( params ){
        var item, alwaysVisible, expanded;

        if( params.internalCall ){
            return;
        }

        alwaysVisible = params.newVal;
        item         = params.currentTarget;
        expanded     = item.get( EXPANDED );

        if( alwaysVisible ){
            if( expanded ){
                this._setItemProperties( item, true, true );
                this._setItemUI( item, true, true );
                return;
            } else {
                this._forExpanding[ item ] = {
                    'item': item,
                    'alwaysVisible': true
                };

                this._storeItemsForCollapsing();
            }
        } else {
            if( expanded ){
                this._setItemUI( item, true, false );
                return;
            } else {
                return;
            }
        }

        this._processItems();
    },


    /**
     * Handles the change of "contentHeight" property of given item
     *
     * @method _afterContentHeight
     * @protected
     * @param params {EventFacade} The event facade for the attribute change
     */
    _afterContentHeight: function( params ){
        var item, itemContentHeight, body, bodyHeight, expanded;

        item = params.currentTarget;

        this._adjustStretchItems();

        if( params.newVal.method !== STRETCH ){
            expanded = item.get( EXPANDED );
            itemContentHeight = this._getItemContentHeight( item );

            body = item.getStdModNode( WidgetStdMod.BODY );
            bodyHeight = this._getNodeOffsetHeight( body );

            if( itemContentHeight < bodyHeight ){
                this._processCollapsing( item, itemContentHeight, !expanded );
            } else if( itemContentHeight > bodyHeight ){
                this._processExpanding( item, itemContentHeight, !expanded );
            }
        }
    },


    /**
     * Handles the change of "contentUpdate" property of given item
     *
     * @method _afterContentUpdate
     * @protected
     * @param params {EventFacade} The event facade for the attribute change
     */
    _afterContentUpdate : function( params ){
        var item, body, bodyHeight, expanded, auto, anim;

        item = params.currentTarget;
        auto = item.get( "contentHeight" ).method === "auto";
        expanded = item.get( EXPANDED );

        body = item.getStdModNode( WidgetStdMod.BODY );
        bodyHeight = this._getNodeOffsetHeight( body );

        if( auto && expanded && params.src !== Y.Widget.UI_SRC ){
            Y.later( 0, this, function(){
                var itemContentHeight = this._getItemContentHeight( item );

                if( itemContentHeight !== bodyHeight ){
                    anim = this._animations[ item ];

                    // stop waiting animation
                    if( anim ){
                        anim.stop();
                    }

                    this._adjustStretchItems();

                    if( itemContentHeight < bodyHeight ){
                        this._processCollapsing( item, itemContentHeight, !expanded );
                    } else if( itemContentHeight > bodyHeight ){
                        this._processExpanding( item, itemContentHeight, !expanded );
                    }
                }
            } );
        }
    },


    /**
     * Subscribe for resize event, which could be provided from the browser or from an arbitrary object.
     * For example, if there is LayoutManager in the page, it is preferable to subscribe to its resize event,
     * instead to those, which browser provides.
     *
     * @method _setUpResizing
     * @protected
     * @param value {String|Object} String "default" or object with the following properties:
     *  <dl>
     *      <dt>sourceObject</dt>
     *          <dd>An abbitrary object</dd>
     *      <dt>resizeEvent</dt>
     *          <dd>The name of its resize event</dd>
     *  </dl>
     */
    _setUpResizing: function( value ){
        if( this._resizeEventHandle ){
            this._resizeEventHandle.detach();
        }

        if( value === DEFAULT ){
            this._resizeEventHandle = Y.on( 'windowresize', Y.bind( this._adjustStretchItems, this ) );
        } else {
            this._resizeEventHandle = value.sourceObject.on( value.resizeEvent, Y.bind( this._adjustStretchItems, this ) );
        }
    },


    /**
     * Creates one or more items found in Accordion's <code>contentBox</code>
     *
     * @method renderUI
     * @protected
     */
    renderUI: function(){
        var srcNode, itemsDom, contentBox, srcNodeId;

        srcNode = this.get( SRCNODE );
        contentBox = this.get( CONTENT_BOX );
        srcNodeId = srcNode.get( "id" );

        /*
         * Widget 3.1 workaround - the Id of contentBox is generated by YUI, instead to keep srcNode's Id, so we set it manually
         */
        contentBox.set( "id", srcNodeId );

        itemsDom = srcNode.all( "> ." + C_ITEM );

        itemsDom.each( function( itemNode, index, itemsDom ){
            var newItem;

            if( !this.getItem( itemNode ) ){
                newItem = new Y.AccordionItem({
                    srcNode: itemNode,
                    id : itemNode.get( "id" )
                });

                this.addItem( newItem );
            }
        }, this );
    },


    /**
     * Add listener(s) to <code>itemChosen</code> event in Accordion's content box.
     * If itemChosen is an Array, this function will invoke multiple times _bindItemChosenEvent
     *
     * @method bindUI
     * @protected
     */
    bindUI: function(){
        var i, itemChosenEvent, length;

        itemChosenEvent = this.get( ITEMCHOSEN );

        if( Lang.isArray(itemChosenEvent) ){
            length = itemChosenEvent.length;

            for( i = 0; i < length; i++ ) {
                this._bindItemChosenEvent(itemChosenEvent[i]);
            }
        } else {
            this._bindItemChosenEvent(itemChosenEvent);
        }
    },


    /**
     * Listening for itemChosen event, determines the source (is that iconClose, iconAlwaysVisisble, etc.) and
     * invokes this._onItemChosen for further processing
     *
     * @method _onItemChosenEvent
     * @protected
     *
     * @param e {Event} The itemChosen event
     */
    _onItemChosenEvent: function(e){
        var header, itemNode, item, iconAlwaysVisible,
            iconClose, srcIconAlwaysVisible, srcIconClose;

        header = e.currentTarget;
        itemNode = header.get( PARENT_NODE );
        item = this.getItem( itemNode );
        iconAlwaysVisible = item.get( ICON_ALWAYSVISIBLE );
        iconClose = item.get( ICON_CLOSE );
        srcIconAlwaysVisible = (iconAlwaysVisible === e.target);
        srcIconClose = (iconClose === e.target);

        this.fire( ITEMCHOSEN, {
            item: item,
            srcIconAlwaysVisible: srcIconAlwaysVisible, 
            srcIconClose: srcIconClose
        });
    },


    /**
     * Add an item to Accordion. Items could be added/removed multiple times and they
     * will be rendered in the process of adding, if not.
     * The item will be expanded, collapsed, or set as always visible depending on the
     * settings. Item's properties will be also updated, if they are incomplete.
     * For example, if <code>alwaysVisible</code> is true, but <code>expanded</code>
     * property is false, it will be set to true also.
     *
     * If the second param, <code>parentItem</code> is an <code>Y.AccordionItem</code> instance,
     * registered in Accordion, the item will be added as child of the <code>parentItem</code>
     *
     * @method addItem
     * @param item {Y.AccordionItem} The item to be added in Accordion
     * @param parentItem {Y.AccordionItem} (optional) This item will be the parent of the item being added
     *
     * @return {Boolean} True in case of successfully added item, false otherwise
     */
    addItem: function( item, parentItem ){
        var expanded, alwaysVisible, itemBody, itemBodyContent, itemIndex, items, contentBox,
            itemHandles, itemContentBox, res, children;

        res = this.fire( BEFOREITEMADD, {
            'item': item
        });

        if( !res ){
            return false;
        }

        items = this.get( ITEMS );
        contentBox = this.get( CONTENT_BOX );

        itemContentBox = item.get( CONTENT_BOX );

        if( !itemContentBox.inDoc() ){
            if( parentItem ){
                itemIndex = this.getItemIndex( parentItem );

                if( itemIndex < 0 ){
                    return false;
                }

                items.splice( itemIndex, 0, item );
                contentBox.insertBefore( itemContentBox, parentItem.get( BOUNDING_BOX ) );
            } else {
                items.push( item );
                contentBox.insertBefore( itemContentBox, null );
            }
        } else {
            children = contentBox.get( CHILDREN );

            res = children.some( function( node, index, nodeList ){
                if( node === itemContentBox ){
                    items.splice( index, 0, item );
                    return true;
                } else {
                    return false;
                }
            }, this );

            if( !res ){
                return false;
            }
        }

        itemBody = item.getStdModNode( WidgetStdMod.BODY );
        itemBodyContent = item.get( BODYCONTENT );

        if( !itemBody && !itemBodyContent  ){
            item.set( BODYCONTENT, "" );
        }

        if( !item.get( RENDERED ) ){
            item.render();
        }

        expanded = item.get( EXPANDED );
        alwaysVisible = item.get( ALWAYSVISIBLE );

        expanded = expanded || alwaysVisible;

        if( expanded ){
            this._forExpanding[ item ] = {
                'item': item,
                'alwaysVisible': alwaysVisible
            };
        } else {
            this._forCollapsing[ item ] = {
                'item': item
            };
        }

        this._processItems();

        if( this.get( "reorderItems" ) ){
            this._initItemDragDrop( item );
        }

        itemHandles = this._itemsHandles[ item ];

        if( !itemHandles ){
            itemHandles = {};
        }

        itemHandles = {
            "expandedChange" : item.after( "expandedChange", Y.bind( this._afterItemExpand, this ) ),
            "alwaysVisibleChange" : item.after( "alwaysVisibleChange", Y.bind( this._afterItemAlwaysVisible, this ) ),
            "contentHeightChange" : item.after( "contentHeightChange", Y.bind( this._afterContentHeight, this ) ),
            "contentUpdate" : item.after( "contentUpdate", Y.bind( this._afterContentUpdate, this ) )
        };

        this._itemsHandles[ item ] = itemHandles;

        this.fire( ITEMADDED, {
            'item': item
        });

        return true;
    },


    /**
     * Removes an previously registered item in Accordion
     *
     * @method removeItem
     * @param p_item {Y.AccordionItem|Number} The item to be removed, or its index
     * @return {Y.AccordionItem} The removed item or null if not found
     */
    removeItem: function( p_item ){
        var items, bb, item = null, itemIndex, allowed;

        items = this.get( ITEMS );

        if( Lang.isNumber( p_item ) ){
            itemIndex = p_item;
        } else if( p_item instanceof Y.AccordionItem ){
            itemIndex = this.getItemIndex( p_item );
        } else {
            return null;
        }

        if( itemIndex >= 0 ){
            allowed = this.fire( BEFOREITEMREMOVE, {
                item: p_item
            });

            if( !allowed ){
                return null;
            }

            item = items.splice( itemIndex, 1 )[0];

            this._removeItemHandles( item );

            bb = item.get( BOUNDING_BOX );
            bb.remove();

            this._adjustStretchItems();

            this.fire( ITEMREMOVED, {
                item: p_item
            });
        }

        return item;
    },


    /**
     * Searching for item, previously registered in Accordion
     *
     * @method getItem
     * @param param {Number|Y.Node} If number, this must be item's index.
     * If Node, it should be the value of item's <code>contentBox</code> or <code>boundingBox</code> properties
     *
     * @return {Y.AccordionItem} The found item or null
     */
    getItem: function( param ){
        var items = this.get( ITEMS ), item = null;

        if( Lang.isNumber( param ) ){
            item = items[ param ];
            return (item instanceof Y.AccordionItem) ? item : null;
        } else if( param instanceof Node ){
            Y.Array.some( items, function( tmpItem, index, items ){
                var contentBox = tmpItem.get( CONTENT_BOX );

                /*
                 * Both contentBox and boundingBox point to same node, so it is safe to check only one of them
                 */
                if( contentBox === param ){
                    item = tmpItem;
                    return true;
                } else {
                    return false;
                }
            }, this );
        }

        return item;
    },


    /**
     * Looking for the index of previously registered item
     *
     * @method getItemIndex
     * @param item {Y.AccordionItem} The item which index should be returned
     * @return {Number} Item index or <code>-1</code> if item has been not found
     */
    getItemIndex: function( item ){
        var res = -1, items;

        if( item instanceof Y.AccordionItem ){
            items = this.get( ITEMS );

            Y.Array.some( items, function( tmpItem, index, items ){
                if( tmpItem === item ){
                    res = index;
                    return true;
                } else {
                    return false;
                }
            }, this );
        }

        return res;
    },


    /**
     * Overwrites Y.WidgetStdMod fuction in order to resolve Widget 3.1 issue:<br>
     * If CONTENT_TEMPLATE is null, in renderUI the result of the following code:
     * <code>this.getStdModNode( Y.WidgetStdMod.HEADER );</code> is null.
     * The same is with <code>this.getStdModNode( Y.WidgetStdMod.BODY );</code>.
     *
     * @method _findStdModSection
     * @protected
     * @param {String} section The section for which the render Node is to be found. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
     * @return {Node} The rendered node for the given section, or null if not found.
     */
    _findStdModSection: function(section) {
        return this.get(SRCNODE).one("> ." + Y.WidgetStdMod.SECTION_CLASS_NAMES[section]);
    },

    CONTENT_TEMPLATE : null
}, {
    /**
     *  Static property provides a string to identify the class.
     *
     * @property Accordion.NAME
     * @type String
     * @static
     */
    NAME : AccName,

    /**
     * Static property used to define the default attribute
     * configuration for the Accordion.
     *
     * @property Accordion.ATTRS
     * @type Object
     * @static
     */
    ATTRS : {
        /**
         * @description The event on which Accordion should listen for user interactions.
         * The value can be also 'mousedown', 'mouseup' or ['mouseenter','click'].
         * Mousedown event can be used if drag&drop is not enabled.
         *
         * @attribute itemChosen
         * @default click
         * @type String|Array
         */
        itemChosen: {
            value: "click",
            validator: function( value ) {
                return Lang.isString(value) || Lang.isArray(value);
            }
        },

        /**
         * @description Contains the items, currently added to Accordion
         *
         * @attribute items
         * @readOnly
         * @default []
         * @type Array
         */
        items: {
            value: [],
            readOnly: true,
            validator: Lang.isArray
        },

        /**
         * @attribute resizeEvent
         *
         * @description The event on which Accordion should listen for resizing.
         * The value must be one of these:
         * <ul>
         *     <li> String "default" - the Accordion will subscribe to Y.windowresize event
         *     </li>
         *     <li> An object in the following form:
         *         {
         *             sourceObject: some_javascript_object,
         *             resizeEvent: an_event_to_subscribe
         *         }
         *      </li>
         * </ul>
         * For example, if we are using LayoutManager's instance as sourceObject, we will have to use its "resize" event as resizeEvent
         *
         * @default "default"
         * @type String or Object
         */

        resizeEvent: {
            value: DEFAULT,
            validator: function( value ){
                if( value === DEFAULT ){
                    return true;
                } else if( Lang.isObject(value) ){
                    if( Lang.isValue( value.sourceObject ) && Lang.isValue( value.resizeEvent ) ){
                        return true;
                    }
                }

                return false;
            }
        },

        /**
         * @attribute useAnimation
         * @description Boolean indicating that Accordion should use animation when expanding or collapsing items.
         *
         * @default true
         * @type Boolean
         */
        useAnimation: {
            value: true,
            validator: Lang.isBoolean
        },

        /**
         * @attribute animation
         * @description Animation config values, see Y.Animation
         *
         * @default <code> {
         *    duration: 1,
         *    easing: Easing.easeOutStrong
         *  }
         *  </code>
         *
         * @type Object
         */
        animation: {
            value: {
                duration: 1,
                easing: Easing.easeOutStrong
            },
            validator: function( value ){
                return Lang.isObject( value ) && Lang.isNumber( value.duration ) &&
                    Lang.isFunction( value.easing );
            }
        },

        /**
         * @attribute reorderItems
         * @description Boolean indicating that items can be reordered via drag and drop.<br>
         *
         * Enabling items reordering requires also including the optional drag and drop modules in YUI instance:<br>
         * 'dd-constrain', 'dd-proxy', 'dd-drop', or just 'dd'
         *
         * @default false
         * @type Boolean
         */
        reorderItems: {
            value: false,
            validator: function(value){
                return Lang.isBoolean(value) && !Lang.isUndefined( Y.DD );
            }
        },

        /**
         * @attribute collapseOthersOnExpand
         * @description If true, on item expanding, all other expanded and not set as always visible items, will be collapsed
         * Otherwise, they will stay open
         *
         * @default true
         * @type Boolean
         */
        collapseOthersOnExpand: {
            value: true,
            validator: Lang.isBoolean
        }
    }
});

}());

/**
 * Provides AccordionItem class
 *
 * @module gallery-accordion
 */

(function(){

// Local constants
var Lang = Y.Lang,
    Node = Y.Node,
    JSON = Y.JSON,
    WidgetStdMod = Y.WidgetStdMod,
    AccItemName = "accordion-item",
    getCN = Y.ClassNameManager.getClassName,
    
    C_ICONEXPANDED_EXPANDING = getCN( AccItemName, "iconexpanded", "expanding" ),
    C_ICONEXPANDED_COLLAPSING = getCN( AccItemName, "iconexpanded", "collapsing" ),

    C_ICON = getCN( AccItemName, "icon" ),
    C_LABEL = getCN( AccItemName, "label" ),
    C_ICONALWAYSVISIBLE = getCN( AccItemName, "iconalwaysvisible" ),
    C_ICONSCONTAINER = getCN( AccItemName, "icons" ),
    C_ICONEXPANDED = getCN( AccItemName, "iconexpanded" ),
    C_ICONCLOSE = getCN( AccItemName, "iconclose" ),
    C_ICONCLOSE_HIDDEN = getCN( AccItemName, "iconclose", "hidden" ),

    C_ICONEXPANDED_ON = getCN( AccItemName, "iconexpanded", "on" ),
    C_ICONEXPANDED_OFF = getCN( AccItemName, "iconexpanded", "off" ),

    C_ICONALWAYSVISIBLE_ON = getCN( AccItemName, "iconalwaysvisible", "on" ),
    C_ICONALWAYSVISIBLE_OFF = getCN( AccItemName, "iconalwaysvisible", "off" ),

    C_EXPANDED =  getCN( AccItemName, "expanded" ),
    C_CLOSABLE =  getCN( AccItemName, "closable" ),
    C_ALWAYSVISIBLE =  getCN( AccItemName, "alwaysvisible" ),
    C_CONTENTHEIGHT =  getCN( AccItemName, "contentheight" ),

    TITLE = "title",
    STRINGS = "strings",
    RENDERED = "rendered",
    CLASS_NAME = "className",
    AUTO = "auto",
    STRETCH = "stretch",
    FIXED = "fixed",
    HEADER_SELECTOR = ".yui3-widget-hd",
    DOT = ".",
    HEADER_SELECTOR_SUB = ".yui3-widget-hd " + DOT,
    INNER_HTML = "innerHTML",
    ICONS_CONTAINER = "iconsContainer",
    ICON = "icon",
    NODE_LABEL = "nodeLabel",
    ICON_ALWAYSVISIBLE = "iconAlwaysVisible",
    ICON_EXPANDED = "iconExpanded",
    ICON_CLOSE = "iconClose",
    HREF = "href",
    HREF_VALUE = "#",
    YUICONFIG = "yuiConfig",

    REGEX_TRUE = /^(?:true|yes|1)$/,
    REGEX_AUTO = /^auto\s*/,
    REGEX_STRETCH = /^stretch\s*/,
    REGEX_FIXED = /^fixed-\d+/;

/**
 * Create an AccordionItem widget.
 *
 * @class AccordionItem
 * @extends Widget
 */

Y.AccordionItem = Y.Base.create( AccItemName, Y.Widget, [Y.WidgetStdMod], {
    /**
     * Creates the header content
     *
     * @method _createHeader
     * @protected
     */
    _createHeader: function(){
        var closable, templates, strings,  iconsContainer,
            icon, nodeLabel, iconExpanded, iconAlwaysVisible, iconClose;

        icon = this.get( ICON );
        nodeLabel = this.get( NODE_LABEL );
        iconExpanded = this.get( ICON_EXPANDED );
        iconAlwaysVisible = this.get( ICON_ALWAYSVISIBLE );
        iconClose = this.get( ICON_CLOSE );
        iconsContainer = this.get( ICONS_CONTAINER );

        strings = this.get( STRINGS );
        closable = this.get( "closable" );
        templates = Y.AccordionItem.TEMPLATES;

        if( !icon ){
            icon = Node.create( templates.icon );
            this.set( ICON, icon );
        }

        if( !nodeLabel ){
            nodeLabel = Node.create( templates.label );
            this.set( NODE_LABEL, nodeLabel );
        } else if( !nodeLabel.hasAttribute( HREF ) ){
            nodeLabel.setAttribute( HREF, HREF_VALUE );
        }

        nodeLabel.setContent( this.get( "label" ) );


        if( !iconsContainer ){
            iconsContainer = Node.create( templates.iconsContainer );
            this.set( ICONS_CONTAINER, iconsContainer );
        }

        if( !iconAlwaysVisible ){
            iconAlwaysVisible = Node.create( templates.iconAlwaysVisible );
            iconAlwaysVisible.setAttribute( TITLE, strings.title_always_visible_off );
            this.set( ICON_ALWAYSVISIBLE, iconAlwaysVisible );
        } else if( !iconAlwaysVisible.hasAttribute( HREF ) ){
            iconAlwaysVisible.setAttribute( HREF, HREF_VALUE );
        }


        if( !iconExpanded ){
            iconExpanded = Node.create( templates.iconExpanded );
            iconExpanded.setAttribute( TITLE, strings.title_iconexpanded_off );
            this.set( ICON_EXPANDED, iconExpanded );
        } else if( !iconExpanded.hasAttribute( HREF ) ){
            iconExpanded.setAttribute( HREF, HREF_VALUE );
        }


        if( !iconClose ){
            iconClose = Node.create( templates.iconClose );
            iconClose.setAttribute( TITLE, strings.title_iconclose );
            this.set( ICON_CLOSE, iconClose );
        } else if( !iconClose.hasAttribute( HREF ) ){
            iconClose.setAttribute( HREF, HREF_VALUE );
        }

        if( closable ){
            iconClose.removeClass( C_ICONCLOSE_HIDDEN );
        } else {
            iconClose.addClass( C_ICONCLOSE_HIDDEN );
        }

        this._addHeaderComponents();
    },

    /**
     * Add label and icons in the header. Also, it creates header in if not set from markup
     *
     * @method _addHeaderComponents
     * @protected
     */
    _addHeaderComponents: function(){
        var header, icon, nodeLabel, iconsContainer, iconExpanded,
            iconAlwaysVisible, iconClose;

        icon = this.get( ICON );
        nodeLabel = this.get( NODE_LABEL );
        iconExpanded = this.get( ICON_EXPANDED );
        iconAlwaysVisible = this.get( ICON_ALWAYSVISIBLE );
        iconClose = this.get( ICON_CLOSE );
        iconsContainer = this.get( ICONS_CONTAINER );

        header = this.getStdModNode( WidgetStdMod.HEADER );

        if( !header ){
            header = new Node( document.createDocumentFragment() );
            header.appendChild( icon );
            header.appendChild( nodeLabel );
            header.appendChild( iconsContainer );
            iconsContainer.appendChild( iconAlwaysVisible );
            iconsContainer.appendChild( iconExpanded );
            iconsContainer.appendChild( iconClose );

            this.setStdModContent( WidgetStdMod.HEADER, header, WidgetStdMod.REPLACE );
        } else {
            if( !header.contains( icon ) ){
                if( header.contains( nodeLabel ) ){
                    header.insertBefore( icon, nodeLabel );
                } else {
                    header.appendChild( icon );
                }
            }

            if( !header.contains( nodeLabel ) ){
                header.appendChild( nodeLabel );
            }

            if( !header.contains( iconsContainer ) ){
                header.appendChild( iconsContainer );
            }

            if( !iconsContainer.contains( iconAlwaysVisible ) ){
                iconsContainer.appendChild( iconAlwaysVisible );
            }

            if( !iconsContainer.contains( iconExpanded ) ){
                iconsContainer.appendChild( iconExpanded );
            }

            if( !iconsContainer.contains( iconClose ) ){
                iconsContainer.appendChild( iconClose );
            }
        }
    },


    /**
     * Handles the change of "labelChanged" property. Updates item's UI with the label provided
     *
     * @method _labelChanged
     * @protected
     * @param params {EventFacade} The event facade for the attribute change
     */
    _labelChanged: function( params ){
        var label;

        if( this.get( RENDERED ) ){
            label = this.get( NODE_LABEL );
            label.set( INNER_HTML, params.newVal );
        }
    },


    /**
     * Handles the change of "closableChanged" property. Hides or shows close icon
     *
     * @method _closableChanged
     * @protected
     * @param params {EventFacade} The event facade for the attribute change
     */
    _closableChanged: function( params ){
        var iconClose;

        if( this.get( RENDERED ) ){
            iconClose = this.get( ICON_CLOSE );

            if( params.newVal ){
                iconClose.removeClass( C_ICONCLOSE_HIDDEN );
            } else {
                iconClose.addClass( C_ICONCLOSE_HIDDEN );
            }
        }
    },


    /**
     * Initializer lifecycle implementation for the AccordionItem class.
     *
     * @method initializer
     * @protected
     * @param  config {Object} Configuration object literal for the AccordionItem
     */
    initializer: function( config ) {
        this.after( "labelChange",  Y.bind( this._labelChanged, this ) );
        this.after( "closableChange", Y.bind( this._closableChanged, this ) );
    },


    /**
     * Destructor lifecycle implementation for the AccordionItem class.
     *
     * @method destructor
     * @protected
     */
    destructor : function() {
        // EMPTY
    },


    /**
     * Creates AccordionItem's header.
     *
     * @method renderUI
     * @protected
     */
    renderUI: function(){
        this._createHeader();
    },

    /**
     * Configures/Sets up listeners to bind Widget State to UI/DOM
     *
     * @method bindUI
     * @protected
     */
    bindUI: function(){
        var contentBox = this.get( "contentBox" );

        contentBox.delegate( "click", Y.bind( this._onLinkClick, this ), HEADER_SELECTOR + ' a' );
    },



    /**
     * Prevent default action on clicking the link in the label
     *
     * @method _onLinkClick
     * @protected
     *
     * @param e {Event} The click event
     */
    _onLinkClick: function( e ){
        e.preventDefault();
    },

   /**
    * Marks the item as always visible by adding class to always visible icon.
    * The icon will be updated only if needed.
    *
    * @method markAsAlwaysVisible
    * @param alwaysVisible {Boolean} If true, the item should be marked as always visible.
    * @return {Boolean} Return true if the icon has been updated, false if there was no need to update
    */
    markAsAlwaysVisible: function( alwaysVisible ){
        var iconAlwaysVisisble, strings;

        iconAlwaysVisisble = this.get( ICON_ALWAYSVISIBLE );
        strings = this.get( STRINGS );

        if( alwaysVisible ){
            if( !iconAlwaysVisisble.hasClass( C_ICONALWAYSVISIBLE_ON ) ){
                iconAlwaysVisisble.replaceClass( C_ICONALWAYSVISIBLE_OFF, C_ICONALWAYSVISIBLE_ON );
                iconAlwaysVisisble.set( TITLE, strings.title_always_visible_on );
                return true;
            }
        } else {
            if( iconAlwaysVisisble.hasClass( C_ICONALWAYSVISIBLE_ON ) ){
                iconAlwaysVisisble.replaceClass( C_ICONALWAYSVISIBLE_ON, C_ICONALWAYSVISIBLE_OFF );
                iconAlwaysVisisble.set( TITLE, strings.title_always_visible_off );
                return true;
            }
        }

        return false;
    },


    /**
    * Marks the item as expanded by adding class to expand icon.
    * The icon will be updated only if needed.
    *
    * @method markAsExpanded
    * @param expanded {Boolean} Boolean indicating that item should be marked as expanded.
    * @return {Boolean} Return true if the icon has been updated, false if there was no need to update
    */
    markAsExpanded: function( expanded ){
        var strings, iconExpanded;

        iconExpanded = this.get( ICON_EXPANDED );
        strings = this.get( STRINGS );

        if( expanded ){
            if( !iconExpanded.hasClass( C_ICONEXPANDED_ON ) ){
                iconExpanded.replaceClass( C_ICONEXPANDED_OFF, C_ICONEXPANDED_ON );
                iconExpanded.set( TITLE , strings.title_iconexpanded_on );
                return true;
            }
        } else {
            if( iconExpanded.hasClass( C_ICONEXPANDED_ON ) ){
                iconExpanded.replaceClass( C_ICONEXPANDED_ON, C_ICONEXPANDED_OFF );
                iconExpanded.set( TITLE , strings.title_iconexpanded_off );
                return true;
            }
        }

        return false;
    },


   /**
    * Marks the item as expanding by adding class to expand icon.
    * The method will update icon only if needed.
    *
    * @method markAsExpanding
    * @param expanding {Boolean} Boolean indicating that the item should be marked as expanding.
    * @return {Boolean} Return true if the icon has been updated, false if there was no need to update
    */
    markAsExpanding: function( expanding ){
        var iconExpanded = this.get( ICON_EXPANDED );

        if( expanding ){
            if( !iconExpanded.hasClass( C_ICONEXPANDED_EXPANDING ) ){
                iconExpanded.addClass( C_ICONEXPANDED_EXPANDING );
                return true;
            }
        } else {
            if( iconExpanded.hasClass( C_ICONEXPANDED_EXPANDING ) ){
                iconExpanded.removeClass( C_ICONEXPANDED_EXPANDING );
                return true;
            }
        }

        return false;
    },


   /**
    * Marks the item as collapsing by adding class to expand icon.
    * The method will update icon only if needed.
    *
    * @method markAsCollapsing
    * @param collapsing {Boolean} Boolean indicating that the item should be marked as collapsing.
    * @return {Boolean} Return true if the icon has been updated, false if there was no need to update
    */
    markAsCollapsing: function( collapsing ){
        var iconExpanded = this.get( ICON_EXPANDED );

        if( collapsing ){
            if( !iconExpanded.hasClass( C_ICONEXPANDED_COLLAPSING ) ){
                iconExpanded.addClass( C_ICONEXPANDED_COLLAPSING );
                return true;
            }
        } else {
            if( iconExpanded.hasClass( C_ICONEXPANDED_COLLAPSING ) ){
                iconExpanded.removeClass( C_ICONEXPANDED_COLLAPSING );
                return true;
            }
        }

        return false;
    },


    /**
     * Forces the item to resize as result of direct content manipulation (via 'innerHTML').
     * This method should be invoked if 'contentHeight' property has been set to 'auto'.
     *
     * @method resize
     */
    resize : function(){
        this.fire( "contentUpdate" );
    },


    /**
     * Parses and returns the value of contentHeight property, if set method "fixed".
     * The value must be in this format: fixed-X, where X is integer
     *
     * @method _extractFixedMethodValue
     * @param value {String} The value to be parsed
     * @return {Number} The parsed value or null
     * @protected
     */
    _extractFixedMethodValue: function( value ){
        var i, length, chr, height = null;

        for( i = 6, length = value.length; i < length; i++ ){ // 6 = "fixed-".length
            chr = value.charAt(i);
            chr = parseInt( chr, 10 );

            if( Lang.isNumber( chr ) ){
                height = (height * 10) + chr;
            } else {
                break;
            }
        }

        return height;
    },


    /**
     * Validator applied to the icon attribute. Setting new value is not allowed if Accordion has been rendered.
     *
     * @method _validateIcon
     * @param value {MIXED} the value for the icon attribute
     * @return {Boolean}
     * @protected
     */
    _validateIcon: function( value ) {
        return !this.get(RENDERED) || value;
    },


    /**
     * Validator applied to the nodeLabel attribute. Setting new value is not allowed if Accordion has been rendered.
     *
     * @method _validateNodeLabel
     * @param value {MIXED} the value for the nodeLabel attribute
     * @return {Boolean}
     * @protected
     */
    _validateNodeLabel: function( value ) {
        return !this.get(RENDERED) || value;
    },


    /**
     * Validator applied to the iconsContainer attribute. Setting new value is not allowed if Accordion has been rendered.
     *
     * @method _validateIconsContainer
     * @param value {MIXED} the value for the iconsContainer attribute
     * @return {Boolean}
     * @protected
     */
    _validateIconsContainer: function( value ) {
        return !this.get(RENDERED) || value;
    },


    /**
     * Validator applied to the iconExpanded attribute. Setting new value is not allowed if Accordion has been rendered.
     *
     * @method _validateIconExpanded
     * @param value {MIXED} the value for the iconExpanded attribute
     * @return {Boolean}
     * @protected
     */
    _validateIconExpanded: function( value ) {
        return !this.get(RENDERED) || value;
    },


    /**
     * Validator applied to the iconAlwaysVisible attribute. Setting new value is not allowed if Accordion has been rendered.
     *
     * @method _validateIconAlwaysVisible
     * @param value {MIXED} the value for the iconAlwaysVisible attribute
     * @return {Boolean}
     * @protected
     */
    _validateIconAlwaysVisible: function( value ) {
        return !this.get(RENDERED) || value;
    },


    /**
     * Validator applied to the iconClose attribute. Setting new value is not allowed if Accordion has been rendered.
     *
     * @method _validateIconClose
     * @param value {MIXED} the value for the iconClose attribute
     * @return {Boolean}
     * @protected
     */
    _validateIconClose: function( value ) {
        return !this.get(RENDERED) || value;
    },


    /**
     * Setter applied to the input when updating the icon attribute.  Input can
     * be a Node, raw HTMLElement, or a selector string to locate it.
     *
     * @method _setIcon
     * @param value {Node|HTMLElement|String} The icon element Node or selector
     * @return {Node} The Node if found, null otherwise.
     * @protected
     */
    _setIcon: function( value ){
        return Y.one( value ) || null;
    },


    /**
     * Setter applied to the input when updating the nodeLabel attribute.  Input can
     * be a Node, raw HTMLElement, or a selector string to locate it.
     *
     * @method _setNodeLabel
     * @param value {Node|HTMLElement|String} The nodeLabel element Node or selector
     * @return {Node} The Node if found, null otherwise.
     * @protected
     */
    _setNodeLabel: function( value ){
        return Y.one( value ) || null;
    },


    /**
     * Setter applied to the input when updating the iconsContainer attribute.  Input can
     * be a Node, raw HTMLElement, or a selector string to locate it.
     *
     * @method _setIconsContainer
     * @param value {Node|HTMLElement|String} The iconsContainer element Node or selector
     * @return {Node} The Node if found, null otherwise.
     * @protected
     */
    _setIconsContainer: function( value ){
        return Y.one( value ) || null;
    },


    /**
     * Setter applied to the input when updating the iconExpanded attribute.  Input can
     * be a Node, raw HTMLElement, or a selector string to locate it.
     *
     * @method _setIconExpanded
     * @param value {Node|HTMLElement|String} The iconExpanded element Node or selector
     * @return {Node} The Node if found, null otherwise.
     * @protected
     */
    _setIconExpanded: function( value ){
        return Y.one( value ) || null;
    },


    /**
     * Setter applied to the input when updating the iconAlwaysVisible attribute.  Input can
     * be a Node, raw HTMLElement, or a selector string to locate it.
     *
     * @method _setIconAlwaysVisible
     * @param value {Node|HTMLElement|String} The iconAlwaysVisible element Node or selector
     * @return {Node} The Node if found, null otherwise.
     * @protected
     */
    _setIconAlwaysVisible: function( value ){
        return Y.one( value ) || null;
    },


    /**
     * Setter applied to the input when updating the iconClose attribute.  Input can
     * be a Node, raw HTMLElement, or a selector string to locate it.
     *
     * @method _setIconClose
     * @param value {Node|HTMLElement|String} The iconClose element Node or selector
     * @return {Node} The Node if found, null otherwise.
     * @protected
     */
    _setIconClose: function( value ){
        return Y.one( value ) || null;
    },


    /**
     * Overwrites Widget's _applyParser method in order to parse yuiConfig attribute before entering in HTML_PARSER attributes
     *
     * @method _applyParser
     * @protected
     * @param config {Object} User configuration object (will be populated with values from Node)
    */
    _applyParser : function(config) {
        var srcNode;

        srcNode = this.get( "srcNode" );

        if( srcNode ){
            this._parsedYUIConfig = srcNode.getAttribute( YUICONFIG );

            if( this._parsedYUIConfig ){
                this._parsedYUIConfig = JSON.parse( this._parsedYUIConfig );
            }
        }

        Y.AccordionItem.superclass._applyParser.apply( this, arguments );

        delete this._parsedYUIConfig;
    },


    /**
     * Overwrites Y.WidgetStdMod fuction in order to resolve Widget 3.1 issue:<br>
     * If CONTENT_TEMPLATE is null, in renderUI the result of the following code:
     * <code>this.getStdModNode( Y.WidgetStdMod.HEADER );</code> is null.
     * The same is with <code>this.getStdModNode( Y.WidgetStdMod.BODY );</code>.
     *
     * @method _findStdModSection
     * @protected
     * @param {String} section The section for which the render Node is to be found. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
     * @return {Node} The rendered node for the given section, or null if not found.
     */
    _findStdModSection: function(section) {
        return this.get("srcNode").one("> ." + Y.WidgetStdMod.SECTION_CLASS_NAMES[section]);
    },

    CONTENT_TEMPLATE : null
}, {
    /**
     *  Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME : AccItemName,

    /**
     * Static property used to define the default attribute
     * configuration for the Accordion.
     *
     * @property Accordion.ATTRS
     * @type Object
     * @static
     */
    ATTRS : {

        /**
         * @description The Node, representing item's icon
         *
         * @attribute icon
         * @default null
         * @type Node
         */
        icon: {
            value: null,
            validator: function( value ){
                return this._validateIcon( value );
            },
            setter : function( value ) {
                return this._setIcon( value );
            }
        },

        /**
         * @description The label of item
         *
         * @attribute label
         * @default "&#160;"
         * @type String
         */
        label: {
            value: "&#160;",
            validator: Lang.isString
        },

        /**
         * @description The node, which contains item's label
         *
         * @attribute nodeLabel
         * @default null
         * @type Node
         */
        nodeLabel: {
            value: null,
            validator: function( value ){
                return this._validateNodeLabel( value );
            },
            setter : function( value ) {
                return this._setNodeLabel( value );
            }
        },


        /**
         * @description The container of iconAlwaysVisible, iconExpanded and iconClose
         *
         * @attribute iconsContainer
         * @default null
         * @type Node
         */
        iconsContainer: {
            value: null,
            validator: function( value ){
                return this._validateIconsContainer( value );
            },
            setter : function( value ) {
                return this._setIconsContainer( value );
            }
        },

        /**
         * @description The Node, representing icon expanded
         *
         * @attribute iconExpanded
         * @default null
         * @type Node
         */
        iconExpanded: {
            value: null,
            validator: function( value ){
                return this._validateIconExpanded( value );
            },
            setter : function( value ) {
                return this._setIconExpanded( value );
            }
        },


        /**
         * @description The Node, representing icon always visible
         *
         * @attribute iconAlwaysVisible
         * @default null
         * @type Node
         */
        iconAlwaysVisible: {
            value: null,
            validator: function( value ){
                return this._validateIconAlwaysVisible( value );
            },
            setter : function( value ) {
                return this._setIconAlwaysVisible( value );
            }
        },


        /**
         * @description The Node, representing icon close, or null if the item is not closable
         *
         * @attribute iconClose
         * @default null
         * @type Node
         */
        iconClose: {
            value: null,
            validator: function( value ){
                return this._validateIconClose( value );
            },
            setter : function( value ) {
                return this._setIconClose( value );
            }
        },

        /**
         * @description Get/Set expanded status of the item
         *
         * @attribute expanded
         * @default false
         * @type Boolean
         */
        expanded: {
            value: false,
            validator: Lang.isBoolean
        },

        /**
         * @description Describe the method, which will be used when expanding/collapsing
         * the item. The value should be an object with at least one property ("method"):
         *  <dl>
         *      <dt>method</dt>
         *          <dd>The method can be one of these: "auto", "fixed" and "stretch"</dd>
         *      <dt>height</dt>
         *          <dd>Must be set only if method's value is "fixed"</dd>
         *  </dl>
         *
         * @attribute contentHeight
         * @default auto
         * @type Object
         */
        contentHeight: {
            value: {
                method: AUTO
            },
            validator: function( value ){
                if( Lang.isObject( value ) ){
                    if( value.method === AUTO ){
                        return true;
                    } else if( value.method === STRETCH ){
                        return true;
                    } else if( value.method === FIXED && Lang.isNumber( value.height ) &&
                        value.height >= 0 ){
                        return true;
                    }
                }

                return false;
            }
        },

        /**
         * @description Get/Set always visible status of the item
         *
         * @attribute alwaysVisible
         * @default false
         * @type Boolean
         */
        alwaysVisible: {
            value: false,
            validator: Lang.isBoolean
        },


        /**
         * @description Get/Set the animaton specific settings. By default there are no any settings.
         * If set, they will overwrite Accordion's animation settings
         *
         * @attribute animation
         * @default {}
         * @type Object
         */
        animation: {
            value: {},
            validator: Lang.isObject
        },

        /**
         * @description Provides client side string localization support.
         *
         * @attribute strings
         * @default Object English messages
         * @type Object
         */
        strings: {
            value: {
                title_always_visible_off: "Click to set always visible on",
                title_always_visible_on: "Click to set always visible off",
                title_iconexpanded_off: "Click to expand",
                title_iconexpanded_on: "Click to collapse",
                title_iconclose: "Click to close"
            }
        },

        /**
         * @description Boolean indicating that the item can be closed by user.
         * If true, there will be placed close icon, otherwise not
         *
         * @attribute closable
         * @default false
         * @type Boolean
         */
        closable: {
            value: false,
            validator: Lang.isBoolean
        }
    },


    /**
     * Static Object hash used to capture existing markup for progressive
     * enhancement.  Keys correspond to config attribute names and values
     * are selectors used to inspect the srcNode for an existing node
     * structure.
     *
     * @property HTML_PARSER
     * @type Object
     * @protected
     * @static
     */
    HTML_PARSER : {

        icon: HEADER_SELECTOR_SUB + C_ICON,

        label: function( srcNode ){
            var node, labelSelector, yuiConfig, label;

            yuiConfig = this._parsedYUIConfig;

            if( yuiConfig && Lang.isValue( yuiConfig.label ) ){
                return yuiConfig.label;
            }

            label = srcNode.getAttribute( "data-label" );

            if( label ){
                return label;
            }

            labelSelector = HEADER_SELECTOR_SUB + C_LABEL;
            node = srcNode.one( labelSelector );

            return (node) ? node.get( INNER_HTML ) : null;
        },

        nodeLabel: HEADER_SELECTOR_SUB + C_LABEL,

        iconsContainer: HEADER_SELECTOR_SUB + C_ICONSCONTAINER,

        iconAlwaysVisible: HEADER_SELECTOR_SUB + C_ICONALWAYSVISIBLE,

        iconExpanded: HEADER_SELECTOR_SUB + C_ICONEXPANDED,

        iconClose: HEADER_SELECTOR_SUB + C_ICONCLOSE,

        expanded: function( srcNode ){
            var yuiConfig, expanded;

            yuiConfig = this._parsedYUIConfig;

            if( yuiConfig && Lang.isBoolean( yuiConfig.expanded ) ){
                return yuiConfig.expanded;
            }

            expanded = srcNode.getAttribute( "data-expanded" );

            if( expanded ) {
                return REGEX_TRUE.test( expanded );
            }

            return srcNode.hasClass( C_EXPANDED );
        },

        alwaysVisible: function( srcNode ){
            var yuiConfig, alwaysVisible;

            yuiConfig = this._parsedYUIConfig;

            if( yuiConfig && Lang.isBoolean( yuiConfig.alwaysVisible ) ){
                alwaysVisible = yuiConfig.alwaysVisible;
            } else {
                alwaysVisible = srcNode.getAttribute( "data-alwaysvisible" );

                if( alwaysVisible ) {
                    alwaysVisible = REGEX_TRUE.test( alwaysVisible );
                } else {
                    alwaysVisible = srcNode.hasClass( C_ALWAYSVISIBLE );
                }
            }

            if( alwaysVisible ){
                this.set( "expanded", true, {
                    internalCall: true
                } );
            }

            return alwaysVisible;
        },

        closable: function( srcNode ){
            var yuiConfig, closable;

            yuiConfig = this._parsedYUIConfig;

            if( yuiConfig && Lang.isBoolean( yuiConfig.closable ) ){
                return yuiConfig.closable;
            }

            closable = srcNode.getAttribute( "data-closable" );

            if( closable ) {
                return REGEX_TRUE.test( closable );
            }

            return srcNode.hasClass( C_CLOSABLE );
        },

        contentHeight: function( srcNode ){
            var contentHeightClass, classValue, height = 0, index, yuiConfig,
                contentHeight;

            yuiConfig = this._parsedYUIConfig;

            if( yuiConfig && yuiConfig.contentHeight ){
                return yuiConfig.contentHeight;
            }

            contentHeight = srcNode.getAttribute( "data-contentheight" );

            if( REGEX_AUTO.test( contentHeight ) ){
                return {
                    method: AUTO
                };
            } else if( REGEX_STRETCH.test( contentHeight ) ){
                return {
                    method: STRETCH
                };
            } else if( REGEX_FIXED.test( contentHeight ) ){
                height = this._extractFixedMethodValue( contentHeight );

                return {
                    method: FIXED,
                    height: height
                };
            }


            classValue = srcNode.get( CLASS_NAME );

            contentHeightClass = C_CONTENTHEIGHT + '-';

            index = classValue.indexOf( contentHeightClass, 0);

            if( index >= 0 ){
                index += contentHeightClass.length;

                classValue = classValue.substring( index );

                if( REGEX_AUTO.test( classValue ) ){
                    return {
                        method: AUTO
                    };
                } else if( REGEX_STRETCH.test( classValue ) ){
                    return {
                        method: STRETCH
                    };
                } else if( REGEX_FIXED.test( classValue )  ){
                    height = this._extractFixedMethodValue( classValue );

                    return {
                        method: FIXED,
                        height: height
                    };
                }
            }

            return null;
        }
    },


     /**
      * The template HTML strings for each of header components.
      * e.g.
      * <pre>
      *    {
      *       icon : '&lt;a class="yui3-accordion-item-icon"&gt;&lt;/a&gt;',
      *       label: '&lt;a href="#" class="yui3-accordion-item-label"&gt;&lt;/a&gt;',
      *       iconsContainer: '&lt;div class="yui3-accordion-item-icons"&gt;&lt;/div&gt;',
      *       iconAlwaysVisible: '&lt;a href="#" class="yui3-accordion-item-iconalwaysvisible"&gt;&lt;/a&gt;',
      *       iconExpanded: '&lt;a href="#" class="yui3-accordion-item-iconexpanded"&gt;&lt;/a&gt;',
      *       iconClose: '&lt;a href="#" class="yui3-accordion-item-iconclose yui3-accordion-item-iconclose-hidden"&gt;&lt;/a&gt;'
      *    }
      * </pre>
      * @property WidgetStdMod.TEMPLATES
      * @type Object
      */
    TEMPLATES : {
         icon : '<a class="' + C_ICON + '"></a>',
         label: '<a href="#" class="' + C_LABEL + '"></a>',
         iconsContainer: '<div class="' + C_ICONSCONTAINER + '"></div>',
         iconExpanded: ['<a href="#" class="', C_ICONEXPANDED, ' ', C_ICONEXPANDED_OFF, '"></a>'].join(''),
         iconAlwaysVisible: ['<a href="#" class="', C_ICONALWAYSVISIBLE, ' ',  C_ICONALWAYSVISIBLE_OFF, '"></a>'].join(''),
         iconClose: ['<a href="#" class="', C_ICONCLOSE, ' ', C_ICONCLOSE_HIDDEN, '"></a>'].join('')
    }

});

}());



}, 'gallery-2012.08.15-20-00' ,{requires:['event', 'anim-easing', 'widget', 'widget-stdmod', 'json-parse'], skinnable:true, optional:['dd-constrain', 'dd-proxy', 'dd-drop']});
