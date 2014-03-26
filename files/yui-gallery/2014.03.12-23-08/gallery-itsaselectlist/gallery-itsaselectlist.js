YUI.add('gallery-itsaselectlist', function (Y, NAME) {

'use strict';

/**
 * The Itsa Selectlist module.
 *
 * @module gallery-itsaselectlist
 */


/**
 *
 * @class ITSASelectlist
 * @extends Widget
 * @constructor
 *
 * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

// Local constants
var Lang = Y.Lang,
    IE = Y.UA.ie,
    ITSA_CLASSHIDDEN = 'itsa-hidden',
    ITSA_SHIM_TEMPLATE_TITLE = "Selectlist Shim",
    ITSA_SHIM_TEMPLATE = '<iframe frameborder="0" tabindex="-1" class="itsa-shim" title="' + ITSA_SHIM_TEMPLATE_TITLE +
                                           '" src="javascript:false;"></iframe>',
    ITSA_SELECTEDMAIN_TEMPLATE = "<span class='itsa-selectlist-selectedmain' unselectable='on'></span>",
    ITSA_BUTTON_TEMPLATE = "<button type='button' class='yui3-button'></button>",
    ITSA_DOWNBUTTON_TEMPLATE = "<span class='itsa-button-icon itsa-icon-selectdown'></span>",
    ITSA_SELECTBOX_TEMPLATE = "<div class='itsa-selectlist-basediv " + ITSA_CLASSHIDDEN + "'><div class='itsa-selectlist-scrolldiv'>"+
                                                     "<ul class='itsa-selectlist-ullist'></ul></div></div>";

Y.ITSASelectList = Y.Base.create('itsaselectlist', Y.Widget, [], {


// -- Public Static Properties -------------------------------------------------

/**
 * Reference to the editor's instance
 * @property buttonNode
 * @type Y.EditorBase instance
 */

/**
 * Reference to the Y-instance of the host-editor
 * @private
 * @property _selectedMainItemNode
 * @type YUI-instance
 */

/**
 * Reference to the editor's iframe-node
 * @private
 * @property _selectedItemClass
 * @type Y.Node
 */

/**
 * Reference to the editor's container-node, in which the host-editor is rendered.<br>
 * This is in fact editorNode.get('parentNode')
 * @private
 * @property _itemsContainerNode
 * @type Y.Node
 */

/**
 * Reference to the toolbar-node
 * @private
 * @property _itemValues
 * @type Y.Node
 */

/**
 * arraylist of all created eventhandlers within bindUI(). Is used to cleanup during destruction.
 * @private
 * @property _eventhandlers
 * @type Array
 */

        buttonNode : null,
        _selectedMainItemNode : null,
        _selectedItemClass : null,
        _itemsContainerNode : null,
        _itemValues : null, // for internal use: listitems, transformed to String, so we can use selectItemByValue
        _eventhandlers : [],


        /**
         * Sets up the selectlist during initialisation.
         *
         * @method initializer
         * @param {Object} config The config-object.
         * @protected
        */
        initializer : function() {
            var instance = this;
            instance._selectedItemClass = instance.get('hideSelected') ? ITSA_CLASSHIDDEN : 'itsa-selectlist-selected';

        },

        /**
         * Widget's renderUI-method. Creates the Selectlist in the DOM.
         *
         * @method renderUI
        */
        renderUI : function() {
            var instance = this,
                boundingBox = instance.get('boundingBox'),
                className = instance.get('className'),
                iconClassName = instance.get('iconClassName'),
                buttonWidth = instance.get('buttonWidth'),
                listWidth = instance.get('listWidth'),
                btnSize = instance.get('btnSize');
            if ((IE>0) && (IE<7)) {boundingBox.append(ITSA_SHIM_TEMPLATE);}
            instance.buttonNode = Y.Node.create(ITSA_BUTTON_TEMPLATE);
            boundingBox.append(instance.buttonNode);
            instance.buttonNode.setHTML(ITSA_DOWNBUTTON_TEMPLATE);
            instance._selectedMainItemNode = Y.Node.create(ITSA_SELECTEDMAIN_TEMPLATE);
            instance.buttonNode.append(instance._selectedMainItemNode);
            instance._itemsContainerNode = Y.Node.create(ITSA_SELECTBOX_TEMPLATE);
            boundingBox.addClass('itsa-' + (instance.get('listAlignLeft') ? 'left' : 'right') + 'align');
            if (className) {boundingBox.addClass(className);}
            if (iconClassName) {
                instance._selectedMainItemNode.addClass('itsa-button-icon');
                instance._selectedMainItemNode.addClass(iconClassName);
            }
            // must set minWidth instead of width in case of button: otherwise the 2 spans might be positioned underneath each other
            if (buttonWidth) {instance.buttonNode.setStyle('minWidth', buttonWidth+'px');}
            if (listWidth) {instance._itemsContainerNode.setStyle('width', listWidth+'px');}
            if (btnSize===1) {boundingBox.addClass('itsa-buttonsize-small');}
            else {if (btnSize===2) {boundingBox.addClass('itsa-buttonsize-medium');}}
            boundingBox.append(instance._itemsContainerNode);
            instance._itemsChange({newVal: instance.get('items'), fromInit: true});
            // forcing to set the value into defaultItem
            instance.get('value');
        },

        /**
         * Widget's bindUI-method. Binds onclick and clickoutside-events
         *
         * @method bindUI
        */
        bindUI : function() {
            var instance = this,
                boundingBox = instance.get('boundingBox');
            instance._eventhandlers.push(
               boundingBox.on('click', instance._toggleListbox, instance)
            );
            instance._eventhandlers.push(
               boundingBox.on('clickoutside', instance.hideListbox, instance)
            );
            instance._eventhandlers.push(
               instance._itemsContainerNode.delegate('click', instance._itemClick, 'li', instance)
            );
            instance._eventhandlers.push(
               instance.on('disabledChange', instance._disabledChange, instance)
            );
            instance._eventhandlers.push(
                instance.after('itemsChange', function(e) {
                    instance._itemsChange(e);
                    instance.syncUI();
                })
            );
        },

        /**
         *  Widget's syncUI-method. Renders the selectlist items
         *
         * @method syncUI
        */
        syncUI : function() {
            var instance = this,
                items = instance.get('items'),
                defaultItem = instance.get('defaultItem'),
                ullist = instance._itemsContainerNode.one('.itsa-selectlist-ullist'),
                i,
                item,
                startindex = instance.get('index'),
                itemText,
                isDefaultItem,
                defaultItemFound,
                nodeclass,
                newNode;
            ullist.setHTML(''); // clear content
            if (items.length>0) {
                for (i=0; i<items.length; i++) {
                    item = items[i];
                    itemText = Lang.isString(item) ? item : (item.text || '');
                    isDefaultItem = (itemText===defaultItem);
                    if (isDefaultItem || (startindex===i)) {
                        defaultItemFound = true;
                        if (startindex===i) {
                            defaultItem = itemText;
                        }
                        instance.set('index', i, {silent: true});
                    }
                    nodeclass = item.className || '';
                    newNode = Y.Node.create('<li' + ((isDefaultItem || (startindex===i)) ? ' class="'+instance._selectedItemClass+' '+nodeclass+'"' :
                                            ((nodeclass!=='') ? ' class="'+nodeclass+'"' : ''))+'>' + itemText +'</li>');
                    if (item.returnValue) {newNode.setData('returnValue', item.returnValue);}
                    ullist.append(newNode);
                }
                instance._selectedMainItemNode.setHTML(
                    (instance.get('selectionOnButton') && defaultItemFound) ? defaultItem : instance.get('defaultButtonText'));
            }
        },

        /**
         * Internal function that will be called when a user changes the selected item
         *
         * @method _itemClick
         * @private
         * @param {EventFacade} e with e.currentTarget as the selected li-Node
         * @return {eventFacade} Fires a valueChange, or selectChange event.<br>
         * <i>- e.currentTarget: the selected li-Node<br>
         * <i>- e.value: returnvalue of the selected item<br>
         * <i>- e.index: index of the selected item</i>
         *
        */
        _itemClick : function(e) {
            this._selectItem(e.currentTarget, true);
        },

        /**
         * Selects the items at a specified index.<br>
         * When softMatch is set to true, the selected value will return to the default, even when there is no match.<br>
         * When softMatch is false, or not specified, there has to be a match in order to change.
         *
         * @method selectItem
         * @param {Int} index index to be selected
         * @param {Boolean} [softMatch] Optional. When set to true will always make a selectchange, even when the index is out of bound
         * @param {String} [softButtonText] Optional. Text to be appeared on the button in case softMatch is true and there is no match.
         * When not specified, the attribute <i>defaultButtonText</i> will be used
         * @return {eventFacade} Fires a valueChange, NO selectChange event, because there is no userinteraction.<br>
         * <i>- e.currentTarget: the selected li-Node<br>
         * <i>- e.value: returnvalue of the selected item<br>
         * <i>- e.index: index of the selected item</i>
         *
        */
        selectItem : function(index, softMatch, softButtonText, fromSetter) {
            var instance = this,
                nodelist;
            if (!instance.get('disabled') && (typeof index==='number')) {
                nodelist = instance._itemsContainerNode.all('li');
                if ((index>=0) && (index<nodelist.size())) {instance._selectItem(nodelist.item(index), null, fromSetter);}
                else {
                    // no hit: return to default without selection in case of softMatch
                    if (softMatch) {
                        nodelist.removeClass(instance._selectedItemClass);
                        if (instance.get('selectionOnButton')) {
                            instance._selectedMainItemNode.setHTML(softButtonText || instance.get('defaultButtonText'));
                        }
                    }
                }
            }
        },

        /**
         * Selects the items based on the listvalue.<br>
         * When softMatch is set to true, the selected value will return to the default, even when there is no match.<br>
         * When softMatch is false, or not specified, there has to be a match in order to change.
         *
         * @method selectItemByValue
         * @param {String} itemText listitem to be selected
         * @param {Boolean} [softMatch] Optional. When set to true will always make a selectchange, even when the listitem is not available
         * @param {Boolean} [defaultButtonText] Optional. Whether to use the attribute <i>defaultButtonText</i> in case softMatch is true
         * and there is no match. When set to false, <i>itemText</i> will be used when there is no match.
         * @return {eventFacade} Fires a valueChange, NO selectChange event, because there is no userinteraction.<br>
         * <i>- e.currentTarget: the selected li-Node<br>
         * <i>- e.value: returnvalue of the selected item<br>
         * <i>- e.index: index of the selected item</i>
         *
        */
        selectItemByValue : function(itemText, softMatch, defaultButtonText) {
            // by returnvalue
            var instance = this,
                index;
/*jshint expr:true */
            Lang.isValue(itemText) || (itemText='');
/*jshint expr:false */
            index = Y.Array.indexOf(instance._itemValues, itemText.toString().toLowerCase());
            instance.selectItem(index, softMatch, defaultButtonText ? instance.get('defaultButtonText') : itemText);
        },

        /**
         * Does the final itemselection based on the listnode.<br>
         * Will always fire a <b>valueChange event</b>.<br>
         * Will fire a <b>selectChange event</b> only when <i>userInteraction</i> is set to true.
         *
         * @method _selectItem
         * @private
         * @param {Y.Node} node listitem to be selected
         * @param {Boolean} userInteraction Specifies whether the selection is made by userinteraction, or by functioncall.<br>
         * In case of userinteraction,  selectChange will also be fired.
         * @return {eventFacade} Not returnvalue, but event, fired by valueChange, or selectChange.<br>
         * <i>- e.currentTarget: the selected li-Node<br>
         * <i>- e.value: returnvalue of the selected item<br>
         * <i>- e.index: index of the selected item</i>
         *
        */
        _selectItem : function(node, userInteraction, fromSetter) {
            var instance = this,
                previousNode = instance._itemsContainerNode.one('li.'+instance._selectedItemClass),
                selectionOnButton = instance.get('selectionOnButton'),
                nodeHTML, index;
            if (!instance.get('disabled') && node && ((node !== previousNode) || !selectionOnButton)) {
                if (previousNode) {
                    previousNode.removeClass(instance._selectedItemClass);
                }
                nodeHTML = node.getHTML();
                if (selectionOnButton) {
                    node.addClass(instance._selectedItemClass);
                    instance._selectedMainItemNode.setHTML(nodeHTML);
                }
                index = instance._indexOf(node);
/*jshint expr:true */
                fromSetter || !selectionOnButton || instance.set('index', index, {silent: true});
/*jshint expr:false */
                /**
                 * In case of a valuechange, valueChange will be fired.
                 * No matter whether the change is done by userinteraction, or by a functioncall like selectItem()
                 * @event valueChange
                 * @param {EventFacade} e Event object<br>
                 * <i>- e.element: the selected li-Node<br>
                 * <i>- e.value: returnvalue of the selected item<br>
                 * <i>- e.index: index of the selected item</i>
                */
                instance.fire('valueChange', {element: node, value: node.getData('returnValue') || nodeHTML, index: instance._indexOf(node)});
                /**
                 * In case of a valuechange <u>triggered by userinteraction</u>, selectChange will be fired.
                 * This way you can use functioncalls like selectItem() and prevent double programmaction
                 * (which might occur when you listen to the valueChange event)
                 * @event selectChange
                 * @param {EventFacade} e Event object<br>
                 * <i>- e.element: the selected li-Node<br>
                 * <i>- e.value: returnvalue of the selected item<br>
                 * <i>- e.index: index of the selected item</i>
                */
                if (userInteraction) {instance.fire('selectChange',
                                                {element: node, value: node.getData('returnValue') || nodeHTML, index: instance._indexOf(node)});}
            }
        },

        /**
         * Will hide the listitems.
         * Will also fire a <b>hide event</b>.<br>
         * @method hideListbox
         *
        */
        hideListbox : function() {
            var instance = this;
            if (!instance.get('disabled')) {
                /**
                 * In case the listbox is opened, hide-event will be fired.
                 * @event hide
                 * @param {EventFacade} e Event object<br>
                */
                instance.fire('hide');
                instance._itemsContainerNode.toggleClass(ITSA_CLASSHIDDEN, true);
            }
        },

        /**
         * Will show the listitems.
         * Will also fire a <b>show event</b>.<br>
         * @method showListbox
         *
        */
        showListbox : function() {
            var instance = this;
            if (!instance.get('disabled')) {
                /**
                 * In case the listbox is opened, show-event will be fired.
                 * @event show
                 * @param {EventFacade} e Event object<br>
                */
                instance.fire('show');
                instance._itemsContainerNode.toggleClass(ITSA_CLASSHIDDEN, false);
            }
        },

        /**
         * Toggles between shown/hidden listitems.
         *
         * @method _toggleListbox
         * @private
         *
        */
        _toggleListbox : function() {
            var instance = this;
            if (instance._itemsContainerNode.hasClass(ITSA_CLASSHIDDEN)) {instance.showListbox();}
            else {instance.hideListbox();}
        },

        /**
         * Returns the actual selected listitemnode.<br>
         *
         * @method currentSelected
         * @return {Y.Node} the current selected listitemnode, or null if none is selected.
        */
        currentSelected : function() {
            return this._itemsContainerNode.one('li.'+this._selectedItemClass);
        },

        /**
         * Returns the index of the actual selected listitemnode.<br>
         *
         * @method currentIndex
         * @return {Int} index of the current selected listitem, or -1 if none is selected.
         *
        */
        currentIndex : function() {
            return this.get('index');
        },

        /**
         * Returns the index of a listitemnode.<br>
         *
         * @method _indexOf
         * @private
         * @param {Y.Node} node the node to search for.
         * @return {Int} index of a listitem, or -1 if not present.
         *
        */
        _indexOf : function(node) {
            var nodelist = this._itemsContainerNode.one('.itsa-selectlist-ullist').all('li');
            return nodelist.indexOf(node);
        },

        /**
         * Is called after a disabledchange. Does dis/enable the inner-button element<br>
         *
         * @method _disabledChange
         * @private
         * @param {eventFacade} e passed through by widget.disabledChange event
         *
        */
        _disabledChange : function(e) {
            var instance = this;
            instance.buttonNode.toggleClass('yui3-button-disabled', e.newVal);
            instance.hideListbox();
        },

        /**
         * Cleaning up all eventhandlers created by bindUI(). Is called by the destructor.<br>
         *
         * @method _clearMemory
         * @private
         *
        */
        _clearMemory : function() {
            var instance = this;
            Y.Array.each(
                instance._eventhandlers,
                function(item){
                    item.detach();
                }
            );
        },


        /**
         * Needs to be run after 'items' is changed, to setup internal _itemValues
         *
         * @method _itemsChange
         * @private
         *
        */
        _itemsChange : function(e) {
            var instance = this,
                fromInit = e.fromInit,
                currentSelected = !fromInit && instance.get('value'),
                val = e.newVal,
                newindex = null,
                item, i, trueItemValue;
            instance._itemValues = [];
            instance._trueItemValues = [];
            for (i=0; i<val.length; i++) {
                item = val[i];
                // Make sure to fill the array with Strings. User might supply other types like numbers:
                // you don't want to miss the hit when you search the array by value.
                instance._itemValues.push(Lang.isValue(item.returnValue) ? item.returnValue.toString().toLowerCase() : item.toString().toLowerCase());
                // also fill the true values, because the attribute 'value' should keep its type
                trueItemValue = Lang.isValue(item.returnValue) ? item.returnValue : item;
                instance._trueItemValues.push(trueItemValue);
/*jshint expr:true */
                !fromInit && (trueItemValue===currentSelected) && (newindex=i);
/*jshint expr:false */
            }
            instance.set('index', newindex, {silent: true});
        },

        /**
         * Cleaning up.
         *
         * @protected
         * @method destructor
         *
        */
        destructor : function() {
            this._clearMemory();
        }

    }, {
        ATTRS : {

            /**
             * @description The size of the buttons<br>
             * Should be a value 1, 2 or 3 (the higher, the bigger the buttonsize)<br>
             * Default = 2
             * @attribute btnSize
             * @type int
            */
            btnSize : {
                value: 3,
                validator: function(val) {
                    return (Lang.isNumber(val) && (val>0) && (val<4));
                }
            },

            /**
             * @description Defines the defaultbuttontext when a softMatch with no hit has taken place.<br>
             * See <i>selectItem()</i> how to use a softMatch.<br>
             * Default = 'choose...'
             * @attribute defaultButtonText
             * @type String Default='choose...'
            */
            defaultButtonText : {
                value: 'choose...',
                validator: function(val) {
                    return Y.Lang.isString(val);
                }
            },

            /**
             * @description Defines the buttonWidth<br>
             * Default = null, which means automaticly sizeing.
             * @attribute buttonWidth
             * @type Int
            */
            buttonWidth: {
                value: null,
                validator: function(val) {
                    return (Y.Lang.isNumber(val) && (val>=0));
                }
            },

            /**
             * @description Defines the width of the listbox.<br>
             * Default = null, which means automaticly sizeing.
             * @attribute listWidth
             * @type Int
            */
            listWidth: {
                value: null,
                validator: function(val) {
                    return (Y.Lang.isNumber(val) && (val>=0));
                }
            },

            /**
             * @description Whether the listitems should be aligned left or right.
             * Default = true.
             * @attribute listAlignLeft
             * @type Boolean
            */
            listAlignLeft : {
                value: true,
                validator: function(val) {
                    return Y.Lang.isBoolean(val);
                }
            },

            /**
             * @description Additional className that can be added to the boundingBox
             * @attribute className
             * @type String
            */
            className : {
                value: null,
                validator: function(val) {
                    return Y.Lang.isString(val);
                }
            },

            /**
             * @description Additional className that can be added to the selected text on the Button
             * @attribute iconClassName
             * @type String
            */
            iconClassName : {
                value: null,
                validator: function(val) {
                    return Y.Lang.isString(val);
                }
            },

            /**
             * @description Listitems in the selectbox
             * @attribute items
             * @type Array (String | Int | Object)  in case of Object, the object should have the fields: <i>o.text</i> and <i>o.returnValue</i>
            */
            items : {
                value: [],
                validator: function(val) {
                    return Y.Lang.isArray(val);
                }
            },

            /**
             * @description The default listitem to be selected during rendering.<br>
             * Default = null
             * @attribute defaultItem
             * @type String
            */
            defaultItem : {
                value: null,
                validator: function(val) {
                    return Y.Lang.isString(val);
                }
            },

            /**
             * @description The index of the selected item<br>
             * Default = null
             * @attribute index
             * @type Int
            */
            index : {
                value: null,
                validator: function(val) {
                    return (val===null) || (typeof val === 'number');
                },
                setter: function(val) {
                    this.selectItem(val, null, null, true);
                    return val;
                }
            },

            /**
             * @description The value represented by the selected index<br>
             * Default = null
             * @attribute value
             * @type Any
            */
            value : {
                value: null,
                getter: function(val) {
                    var instance = this,
                        current = instance.currentIndex();
                    if ((typeof current!=='number') && (val!==null)) {
                        current = Y.Array.indexOf(instance._itemValues, val.toString().toLowerCase());
/*jshint expr:true */
                        (current>=0) && instance.set('index', current, {silent: true});
/*jshint expr:false */
                    }
                    return (typeof current==='number') ? instance._trueItemValues[current] : null;
                },
                setter: function(val) {
                    return this.selectItemByValue(val);
                }
            },

            /**
             * @description Whether the selection should be displayed on the button.<br>
             * This is normal behaviour. Although in some cases you might not want this. For example when simulating a menubutton with
             * static text and a dropdown with subbuttons<br>
             * Default = true<br>
             * When set to false, the buttontext will always remains the Attribute: <b>defaultButtonText</b>
             * @attribute selectionOnButton
             * @type Boolean
            */
            selectionOnButton : {
                value: true,
                validator: function(val) {
                    return Y.Lang.isBoolean(val);
                }
            },

            /**
             * @description Determines whether to show the selected item in the selectlist,
             * or if it should disappear from the selectlist when selected.<br>
             * Default = false.
             * @attribute hideSelected
             * @type Boolean
            */
            hideSelected : {
                value: false,
                validator: function(val) {
                    return Y.Lang.isBoolean(val);
                },
                setter: function(val) {
                    var instance = this;
                    instance._selectedItemClass = val ? ITSA_CLASSHIDDEN : 'itsa-selectlist-selected';
                    return val;
                }
            }
        },

        HTML_PARSER: {

            defaultItem: function (srcNode) {
                var options = srcNode.all('option'),
                    selected = null;
                options.each(
                    function(node) {
                        if (!selected && (node.getAttribute('selected')==='selected')) {
                            selected = node.getHTML();
                        }
                    }
                );
                return selected;
            },

            items: function(srcNode) {
                var options = srcNode.all('option'),
                    allItems = [];
                options.each(
                    function(node) {
                        allItems.push(
                            {
                                text: node.getHTML(),
                                className: node.getAttribute('class'),
                                returnValue: node.getAttribute('value') || node.getHTML()
                            }
                        );
                    }
                );
                return allItems;
            }
        }

    }
);

}, 'gallery-2014.01.10-22-44', {
    "requires": [
        "yui-base",
        "base-build",
        "node-style",
        "base-base",
        "widget",
        "node-base",
        "cssbutton",
        "event-base",
        "node-event-delegate",
        "event-outside"
    ],
    "skinnable": true
});
