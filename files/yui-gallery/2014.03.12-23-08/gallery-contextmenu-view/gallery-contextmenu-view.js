YUI.add('gallery-contextmenu-view', function (Y, NAME) {

/**
 This module includes a Y.View class extension that attaches to an existing "trigger" Node and uses event delegation to listen
 for "contextmenu" requests (i.e. right-click). When the context menu is invoked, a Y.Overlay object is rendered and displayed
 as a popup that includes user-defined menu items that are related to the context where the menu was invoked.

 This view utilizes several attributes and fires several events that users can listen to in order to take specific actions based
 on the "trigger target" node.

 Please refer to the [trigger](#attr_trigger) ATTRIBUTE for more description of the target.node and target.trigger.

 #####Usage
 To configure a bare-bones basic contextmenu, you need to provide the `trigger` and `menuItems` attributes as;

     var cmenu = new Y.ContextMenuView({
        trigger: {
            node:   Y.one(".myExistingContainer"),
            target:  'li'
        },
        menuItems: [ "Add", "Edit", "Delete" ]
    });

 The `menuItems` can be simple entries or Objects, if they are Objects the "label" property will be used to fill the visible Menu
 (See [menuItems](#attr_menuItems)).

 #####Attributes / Events
 An implementer is typically interested in listening to the following ATTRIBUTE "change" events;
 <ul>
   <li>`selectedMenuChange` : which fires when a contextmenu choice is clicked (see <a href="#attr_selectedMenu">selectedMenu</a>)</li>
   <li>`contextTargetChange`: which fires when the user "right-clicks" on the target.node (see <a href="#attr_contextTarget">contextTarget</a>)</li>
 </ul>

 Additionally please refer to the [Events](#events) section for more information on available events.

 @module gallery-contextmenu-view
 @class Y.ContextMenuView
 @constructor
 **/
Y.ContextMenuView = Y.Base.create('contextmenu', Y.View, [],{

    /**
     * Y.View's events static property, where we define a "click" listener on Nodes in the
     * container that are the MenuItem nodes.                    *
     * @property events
     * @type {Object}
     * @public
     */
    events:{
        '.yui3-contextmenu-menuitem' :{
            click: '_selectMenuItem'
        }
    },

    /**
     * Default HTML template for the container's content (the outer DIV) for the Y.Overlay
     * @property template
     * @type {String}
     * @default '<div class="yui3-contextmenu-overlay"></div>'
     * @public
     */
    template: '<div class="yui3-contextmenu-overlay"></div>',

    /**
     * Defines the Overlay's `bodyContent` template, i.e. the popup menu HTML, as a series of DIV's
     * wrapped in an outer DIV
     *
     * @property templateMicro
     * @type {String}
     * @default See Code
     * @public
     */
    templateMicro:  '<div class="<%= this.menuClass %>">'
            + '<% Y.Array.each( this.options, function(m,i){ %>'
            + '<div class="yui3-contextmenu-menuitem <%= this.menuItemClass %>" data-cmenu="<%= i %>">'
            + '<%== (m[this.menuItemText]!==undefined) ? m[this.menuItemText] : m %></div>'
            + '<% },this); %>'
            + '</div>',

    /**
     * A placeholder to hold subscriber EventHandles so they can be destroyed properly
     * @property _subscr
     * @type {Array}
     * @default null
     * @protected
     */
    _subscr: null,

    //_subscrTarget:null,

    /**
     * Sets an increment that the Overlay box will be positioned relative to the e.target "x-coordinate"
     * @property _overlayDX
     * @type {Integer}
     * @default 5
     * @protected
     */
    _overlayDX: 5,

    /**
     * Sets an increment that the Overlay box will be positioned relative to the e.target "y-coordinate"
     * @property _overlayDY
     * @type {Integer}
     * @default 11
     * @protected
     */
    _overlayDY: 11,

    /**
     * Initializer where we define initial handlers to invoke this view and to hide the Overlay
     * @method initializer
     * @protected
     */
    initializer: function(){
        var triggerC = this.get('trigger').node,
            triggerT = this.get('trigger').target;

        this._subscr = [];
        this._subscr.push(
            triggerC.delegate("contextmenu",this._onContextMenu, triggerT, this),
            this.get('overlay').on("mouseleave",this.hideOverlay, this)
        );

        return this;
    },

    /**
     * Clean up listeners and destroys the Overlay
     * @method destructor
     * @protected
     */
    destructor: function(){
        Y.Array.each( this._subscr, function(item){
            if(item && item.detach) {
                item.detach();
            }
        });
        this._subscr = null;

        if(this._subscrTarget) {
            this._subscrTarget.detach();
            this._subscrTarget = null;
        }

        if(this.get('overlay')){
            this.get('overlay').destroy({remove:true});
            this.set('overlay',null);
        }
    },

    /**
     *
     * @method render
     * @protected
     * @returns this
     * @chainable
     */
    render: function(){
        return this;
    },

    /**
     * Displays the View container (i.e. overlay) with the event target from the on "contextmenu"
     *  event
     *
     * @method showOverlay
     * @param e {EventFacade} Passed in event facade for the "contextmenu" event
     * @public
     */
    showOverlay: function(e){
        var offXY = this.get('offsetXY') || [this._overlayDX, this._overlayDY];
        //
        // Position and display the Overlay for the menu
        //
        this.get('overlay').set("xy", [e.pageX + offXY[0], e.pageY + offXY[1]] );
        this.get('overlay').show();

    },

    /**
     * Method that hides the Overlay for this contextmenu and fires the `contextMenuHide` event
     * @method hideOverlay
     * @public
     */
    hideOverlay: function(){
        if(!this.get('overlay')) {
            return;
        }
        this.fire('contextMenuHide');
        this.get('overlay').hide();
    },

    /**
     * Default value setter for attribute `overlay`, creates a Y.Overlay widget to display the menu within
     *
     * @method _valOverlay
     * @return {Y.Overlay}
     * @private
     */
    _valOverlay: function(){
        var cont   = this.get('container') || null,
            overlay, bodyHTML;

        if(!cont) {
            return false;
        }

        cont.empty();

        //
        //  Create the overlay
        //
        overlay = new Y.Overlay({
          srcNode: cont,
          visible: false,
          zIndex: 99,
          constrain: true
        });

        //
        //  Populate the Overlay bodyContent (via template or other means)
        //
        bodyHTML = this._buildOverlayContent();

        if(bodyHTML) {
            overlay.set('bodyContent',bodyHTML);
        }
        overlay.render();

        return overlay;
    },

    /**
     * Method that is used to create the `bodyContent` for the Overlay instance of this popup menu.
     * Can be used via the *old* method of defining ATTR `menuItemTemplate` or the **new** method
     * that uses Y.Template to render the content (See ATTR [menuTemplate](#attr_menuTemplate) for details).
     *
     * @method _buildOverlayContent
     * @return {HTML}
     * @private
     */
    _buildOverlayContent: function() {
        var mtAttr  = this.get('menuTemplate'),
            tmplObj = (mtAttr) ? Y.merge(mtAttr) : null,
            tmplEng = (tmplObj) ? tmplObj.templateEngine : null,
            tmicro  = new Y.Template(tmplEng),
            tmplHTML= (tmplObj) ? tmplObj.template || this.templateMicro : null,
            mtmpl   = this.get('menuItemTemplate'),
            mitems  = this.get('menuItems') || null,
            bodyHTML, menu;

        //
        //  If no menuTemplate is defined, but older menuItemTemplate is ...
        //
        if(!tmplObj && mtmpl && mitems) {
            bodyHTML = "";
            Y.Array.each( mitems, function(item,index){
                menu = Y.Lang.sub(mtmpl,{
                    menuClass:   item.className || "yui3-contextmenu-menuitem",
                    menuIndex:   index,
                    menuContent: (Y.Lang.isString(item)) ? item : item.label || "unknown"
                });
                bodyHTML += menu;
            });


        } else {
        //
        //  Come in here if we will be using Y.Template to process this ...
        //

            // Delete unecessary stuff from our local copy of the template object ...
            delete tmplObj.templateEngine;
            delete tmplObj.template;


            tmplObj.options = tmplObj.options || tmplObj.menuItems || mitems;
            if(!mitems && tmplObj.options) {
                this._set('menuItems',tmplObj.options);
            }

            tmplObj.menuClass = tmplObj.menuClass || 'yui3-contextmenu-menu';
            tmplObj.menuItemClass = tmplObj.menuItemClass || '';
            tmplObj.menuItemText  = tmplObj.menuItemText || 'label';

        //    tmplObj.menuItemValue = tmplObj.menuItemValue || 'value';
        //    tmplObj.menuItemTitle = tmplObj.menuItemTitle || 'title';

            bodyHTML = tmicro.render(tmplHTML,tmplObj);

        }

        return bodyHTML;

    },

    /**
     * Handler for right-click event (actually "contextmenu" event) on `trigger.node`.
     * @method _onContextMenu
     * @param {EventTarget} e Y.Event target object created when "context" menu fires
     * @private
     */
    _onContextMenu: function(e){
        e.preventDefault();
        this._clearDOMSelection();

        //
        // Store the context "trigger" selection, who invoked the contextMenu
        //
        var contextTar = e.currentTarget;
        this._set('contextTarget', contextTar );

        //
        // Display the menu
        //
        this.showOverlay(e);

        this.fire("contextMenuShow",e);
    },

    /**
     * Fired after the "contextmenu" event is initiated and the Menu has been positioned and displayed
     * @event contextMenuShow
     * @param {EventTarget} e
     */


    /**
     * Process a "click" event on the Content Menu's Overlay menuItems
     *
     * @method _selectMenuItem
     * @param {EventTarget} e
     * @private
     */
    _selectMenuItem: function(e){
        var tar = e.target,
            menuData = +(tar.getData('cmenu')),
            menuItems = this.get('menuItems');

        if ( menuItems &&  menuItems.length>0 ){
                this._set('selectedMenu', {
                evt:e,
                menuItem:menuItems[menuData],
                menuIndex:menuData
            });
        }

        this.hideOverlay();
        this.fire("contextMenuHide",e);
        this.fire("select",e);
    },

    /**
     * Fires when a selection is "clicked" from within the pop-up menu
     * (a better approach is to listen on attribute [selectedMenu](#attr_selectedMenu) for "change")
     *
     * @event select
     * @param {EventTarget} e
     **/

    /**
     * Fired after a Menu choice has been selected from the ContexMenu and the menu has been hidden
     * @event contextMenuHide
     * @param {EventTarget} e
     */

    /**
     * Helper method to clear DOM "selected" text or ranges
     * @method _clearDOMSelection
     * @private
     */
    _clearDOMSelection: function(){
        var sel = (Y.config.win.getSelection) ? Y.config.win.getSelection() : (Y.config.doc.selection) ? Y.config.doc.selection : null;
        if ( sel && sel.empty ) {
            sel.empty();    // works on chrome
        }
        if ( sel && sel.removeAllRanges ) {
            sel.removeAllRanges();    // works on FireFox
        }
    }

},{
   ATTRS:{

       /**
        * Container Node where the menu's Overlay will be rendered into.  If not provided, the
        * default will create a container from the [template](#property_template) setting.
        *
        * This is usually only set when the user has a specific Overlay container design they
        * wish to utilize.
        *
        * @attribute container
        * @type {Node}
        * @default Y.Node.create(this.template)
        */
       container:{
           valueFn:   function(){return Y.Node.create(this.template);}
       },

       /**
        * Defines the container element for the "contextmenu" event listener to attach this menu to.
        * <br/><br/>This {Object} must contain the following;<br/>
        * <ul>
        *   <li>`node` {Node} the Node instance that will have a delegated "contextmenu" listener
        attached to it</li>
            <li>`target` {String} A CSS selector for the "target" sub-element (child of trigger.node) that
             will be used for the delegation and will be returned from attribute "contextTarget"</li>
        * </ul>
        *
        *
        * @example
        *       // This will define the trigger node (to accept right-clicks) as a DataTable's THEAD
        *       //  element and the target as the TH nodes.
        *       trigger : {
        *           node:   myDataTable.get('srcNode').one('thead .yui3-datatable-columns'),
        *           target: "th"
        *       }
        *
        *
        * @attribute trigger
        * @type {Object} trigger Container object to listen for "contextmenu" event on
        * @type {Node} trigger.node Container node to listen on (i.e. delegation container) for "contextmenu"
        * @type {String} trigger.target Container filter selector to assign target from container event
        * @default {node:null, target:''}
        */
       trigger: {
           value:  {node:null, target:''},
           writeOnce: true
       },

       /**
        * Set to the returned target within the `trigger.node` container that the "contextmenu" event was initiated on
        * (e.g. for a DataTable this may be a specific TR row within the table body).
        *
        * @attribute contextTarget
        * @type {Node}
        * @default null
        * @readonly
        */
       contextTarget:{
           value:   null,
           readOnly: true
       },

       /**
        * Overrideable HTML template to use for creating each `menuItem` entry in Overlay.
        * Must include "data-cmenu"
        *
        * @attribute menuItemTemplate
        * @type {String}
        * @default '<div class="{menuClass}" data-cmenu="{menuIndex}">{menuContent}</div>'
        */
       menuItemTemplate:{
           value: '<div class="yui3-contextmenu-menuitem {menuClass}" data-cmenu="{menuIndex}">{menuContent}</div>'
       },

       /**
        * Array of "menu" items as either {Strings} or {Objects} to add to the Menu.
        *
        * When {Objects} are included, as a minimum they must include a `label` property that contains the text to display in the menu.
        * @example
        *   menuItems: [ "one", "two", "three", "four" ]
        *   menuItems: [ "Insert", "Update", {label:"Delete", confirm:true}, "... More" ]
        *   menuItems: [ {label:"Foo", value:100}, {label:"Bar", value:105}, {label:"Baz", value:200} ]
        *
        * @attribute menuItems
        * @type {Array}
        * @default []
        */
       menuItems:{
           value:       null,
           validator:   Y.Lang.isArray
       },

       /**
        * Defines a Y.Template structure to process and prepare the Overlay's `bodyContent` HTML.
        * The **REQUIRED** properties within this Object are `template` and `options`.  Implementers
        * can define whatever other properties they like that work with the `template` they define.
        * Optional properties that are recognized include `menuClass`, `menuItemClass` and `menuItemText`.
        *
        * Custom implementers are advised to review the [templateMicro](#property_templateMicro) default
        * property and [_buildOverlayContent](#method__buildOverlayContent) methods carefully.  As a minimum,
        * this View expects the `data-cmenu` HTML attribute to be set on each item and listens for click events
        * on the `yui3-contextmenu-menuitem` CSS class.
        *
        * @example
        *       // Define contents as UL items ... rendered using Template.Micro
        *       menuTemplate:{
        *           template: '<ul class="myCMenu">'
        *                   + '<% Y.Array.each( this.options, function(r,i){ %>'
        *                   + '<li class="<%= this.menuItemClass %>" data-cmenu="<%= i %>" ><%= r.label %></li>'
        *                   + '<% },this); %></ul>',
        *           options: [
        *            { label:'Menu 1', value:'m1' }, { label:'Menu 2', value:'m2' },{ label:'Menu 3', value:'m3' }
        *           ],
        *           menuItemClass:'yui3-contextmenu-menuitem'
        *       }
        *
        * @attribute menuTemplate
        * @type Object
        * @default null
        */
       menuTemplate:{
           valueFn:  function(){ return this.templateMicro; }
       },

       /**
        * Y.Overlay instance used to render the pop-up context menu within
        *
        * **Default:** See [_valOverlay](#method__valOverlay)
        * @attribute overlay
        * @type Y.Overlay
        */
       overlay: {
           valueFn:     '_valOverlay',
           writeOnce:   true,
           validator:   function(v){ return v instanceof Y.Overlay;}
       },

       /**
        * Sets the XY position offset that the Overlay will be positioned to relative to the contextmenu
        * click XY coordinate.
        *
        * @attribute offsetXY
        * @type Array
        * @default [5,11]
        */
       offsetXY: {
           value:       [5,11],
           validator:   Y.Lang.isArray
       },

       /**
        * Set to the "selected" item from the pop-up Overlay menu when clicked by user, where this
        * attribute is set to an object containing the EventTarget of the selection and the resulting
        * menuitem and menuindex that corresponds to the selection.
        *
        * This is set by the method [_selectMenuItem](#method__selectMenuItem).
        *
        * Set to an {Object} with the following properties;
        *   <ul>
        *   <li>`evt` Event target from "click" selection within displayed Overlay</li>
        *   <li>`menuItem` Menuitem object entry selected from `menuItems` array</li>
        *   <li>`menuIndex` Index of current Menuitem object within the [menuItems](#attr_menuItems) attribute array</li>
        *   </ul>
        *
        * @example
        *      // If the 'selectedMenu' was set to the 2nd item from the following menuItems setting ...
        *      myCmenu.set('menuItems',[ {label:"Foo", value:100}, {label:"Bar", value:105}, {label:"Baz", value:200} ]);
        *
        *      // ... user clicks 2nd item,
        *       myCmenu.get('selectedMenu')
        *       // returns {evt:'event stuff object', menuItem:{label:"Bar", value:105}, menuIndex:1 }
        *
        * @attribute selectedMenu
        * @type {Object} obj
        * @readonly
        */
       selectedMenu: {
           value: null,
           readOnly: true
       }
   }
});


}, 'gallery-2013.01.23-21-59', {"skinnable": "true", "requires": ["base-build", "view", "overlay", "event-mouseenter", "template"]});
