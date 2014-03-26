YUI.add('gallery-md-accordion', function (Y, NAME) {

/**
* The accordion module creates a control with titles and expandable sections for each
* @module gallery-md-accordion
*/
"use strict";
var Lang = Y.Lang,

    BBX = 'boundingBox',
    BODY = Y.WidgetStdMod.BODY,
    HEADER = Y.WidgetStdMod.HEADER,
    EXPANDED = 'expanded',
    EXPANDING = 'expanding',
    COLLAPSED = 'collapsed',
    COLLAPSING = 'collapsing',
    LABEL = 'label',
    CONTENT = 'content',
    ICON = 'icon',
    STATUS = 'status',
    CLOSE = 'close',
    PANEL_CLOSE = 'panelClose',
    MULTI_EXPAND = 'multiExpand',
    RESIZEABLE = 'resizeable',
    CLOSEABLE = 'closeable',
    UI = 'ui';
/**
 * The AccordionPanel class represents one of the panels within an accordion
 * @class AccordionPanel
 * @extends Widget
 * @uses WidgetChild, WidgetStdMod, MakeNode
 * @constructor
 * @param cfg {object} (optional) configuration attributes
 */

Y.AccordionPanel = Y.Base.create(
    'accordionPanel',
    Y.Widget,
    [Y.WidgetChild,Y.WidgetStdMod,Y.MakeNode],
    {
        /**
         * With the accordion panel container filled with with WidgetStdMod divs
         * it seems like too much to have a separate contentBox
         * @property CONTENT_TEMPLATE
         * @value null
         * @protected
         */
        CONTENT_TEMPLATE: null,
        /**
         * This is an override of WidgetStdMod method to prevent it from re-rendering the
         * three sections again and again and wiping out the resize handles
         * @method _syncUIStdMod
         * @protected
         */
        _syncUIStdMod : function () {
        },

        /**
         * Adds the resizer to the body of the three section StdMod
         * and creates a container for the actual content within
         * @method renderUI
         * @protected
         */

        renderUI: function () {
            this.setStdModContent(BODY,this._makeNode());
            this.setStdModContent(HEADER, this._makeNode(Y.AccordionPanel._HEADER_TEMPLATE));
            this._locateNodes();
        },

        /**
         * Listener for the after Expanded change event, toggles the panel
         * @method _afterExpanded
         * @param ev {EventFacade}
         * @private
         */
        _uiSetExpanded: function(value, src) {
            if (src === UI) {
                return;
            }
            if (value) {
                this.expand();
            } else {
                this.collapse();
            }
        },
        /**
         * Sets the label on the header of this panel
         * @method _uiSetLabel
         * @param value {String} text to be shown
         * @private
         */
        _uiSetLabel: function (value) {
            this._labelNode.setContent(value);
        },
        /**
         * Sets the content on this panel
         * @method _uiSetContent
         * @param value {String | Node} content to be shown
         * @private
         */
        _uiSetContent: function (value) {
            this._bodyNode.setContent(value);
        },
        /**
         * Plugs/unplugs the resize-plugin (if available) in response to the resizeable attribute
         * @method _uiSetResizeable
         * @param value {Boolean} new value for the resizeable attribute
         * @private
         */
        _uiSetResizeable: function (value) {
            var body = this.getStdModNode(BODY);
            if (Y.Plugin.Resize) {
                if (value) {
                    body.plug(Y.Plugin.Resize, {
                        handles:['b']
                    });
                } else {
                    body.unplug(Y.Plugin.Resize);
                }
            }
        },
        /**
         * Sets the close icon visible or not depending on the attribute <code>closeable</code>
         * @method _uiSetCloseable
         * @param value {Boolean} new value for the closeeable attribute
         * @private
         */
        _uiSetCloseable: function (value) {
            if (value) {
                this._closeNode.show();
            } else {
                this._closeNode.hide();
            }
        },
        /**
         * Expands this panel
         * @method expand
         */
        expand: function() {
            var bbx = this.get(BBX),
                cns = this._classNames;
            bbx.replaceClass(cns[COLLAPSED],cns[EXPANDING]);
            this.getStdModNode(BODY).show(true,{},function() {
                bbx.replaceClass(cns[EXPANDING],cns[EXPANDED]);
            });
            this.set(EXPANDED,true,{src:UI});
        },
        /**
         * Collapses this panel
         * @method collapse
         */
        collapse: function () {
            var bbx = this.get(BBX),
                cns = this._classNames;
            bbx.replaceClass(cns[EXPANDED],cns[EXPANDING]);
            this.getStdModNode(BODY).hide(true,{},function() {
                bbx.replaceClass(cns[EXPANDING],cns[COLLAPSED]);
            });
            this.set(EXPANDED,false,{src:UI});
        },
        /**
         * Toggles this panel from expanded to collapsed
         * @method toggle
         */
        toggle: function () {
            this.set(EXPANDED, !this.get(EXPANDED));
        },

        /**
         * Responds to clicks in the header of this panel to toggle it
         * @method _afterHEADERClick
         * @param ev {EventFacade} uses target to make sure it is the
         * header of this accordion and not that of a nested one
         * @private
         */
        _afterHEADERClick: function (ev) {
            if (ev.target === this.getStdModNode(HEADER)) {
                this.toggle();
            }
        },

        /**
         * Convenience method to close this panel.
         * Called when the close icon, if present, is clicked.
         * It fires the <code>panelClose</code> event to signal
         * the container for it to remove the panel
         * from the accordion.
         * @method close
         */
         /**
          * Fired by the panel to signal the accordion to remove this panel.
          * Closure of the panel can be prevented by listening and halting this event.
          * @event panelClose
          */
        close: function () {
            this.fire(PANEL_CLOSE);
        }
    },
    {
        /**
         * Defines the class names used by MakeNode, later stored in this._classNames.
         * @property _CLASS_NAMES
         * @static
         * @protected
         */
        _CLASS_NAMES: [EXPANDED, COLLAPSED, BODY, ICON, LABEL, STATUS, CLOSE, EXPANDING, COLLAPSING],
        /**
         * Defines the template used by MakeNode to build the container for the body
         * @property _TEMPLATE
         * @static
         * @protected
         */
        _TEMPLATE: '<div class="{c body}"></div>',
        /**
         * Defines the template used by MakeNode to build the container for the header
         * @property _HEADER_TEMPLATE
         * @static
         * @protected
         */
         _HEADER_TEMPLATE: '<div class="{c icon}"></div><a href="#" class="{c label}"></a>' +
             '<div class="{c status}"></div><div class="{c close}"></div>',
        /**
         * Defines the UI events to be attached through MakeNode,
         * specifically, click on the headers
         * @property _EVENTS
         * @static
         * @protected
         */
        _EVENTS: {
            // this HEADER is not a constant called HEADER but the string "HEADER"
            HEADER: 'click',
            close: {
                type: 'click',
                fn: 'close'
            }
        },
        /**
         * Defines the attributes that MakeNode should link to _uiSetXxxx methods to reflect them in the UI.
         * @property _ATTRS_2_UI
         * @static
         * @protected
         */
        _ATTRS_2_UI: {
            BIND: [LABEL, CONTENT, EXPANDED, RESIZEABLE, CLOSEABLE],
            SYNC: [LABEL, CONTENT, EXPANDED, RESIZEABLE, CLOSEABLE]
        },
        ATTRS: {
            /**
             * State of this panel
             * @attribute expanded
             * @type Boolean
             * @default false (collapsed)
             */
            expanded: {
                value:false,
                validator: Lang.isBoolean
            },
            /**
             * Text to be shown in the header of this accordion panel
             * @attribute label
             * @type String
             */
            label: {
                value:'',
                validator: Lang.isString
            },
            /**
             * Content to be shown in the body of this accordion panel
             * @attribute content
             * @type String or Node instance
             */
            content: {
                value:''
            },
            /**
             * Allows panels to be resized.
             * Requires the optional resize-plugin module to be loaded.
             * @attribute resizeable
             * @type Boolean
             * @default true
             */
            resizeable: {
                value: true,
                validator: Lang.isBoolean
            },
            /**
             * Allows panels to be closed via an icon in the header.
             * It shows or hides the close icon.
             * Panels can be closedvia programming at any time, regardless of this attribute.
             * @attribute closeable
             * @type Boolean
             * @default true
             */
            closeable: {
                value: true,
                validator: Lang.isBoolean
            }
        }

    }
);

/**
 * A collection of vertically aligned collapsible panels
 * @class Accordion
 * @extends Widget
 * @uses WidgetParent, MakeNode
 */
Y.Accordion = Y.Base.create(
    'accordion',
    Y.Widget,
    [Y.WidgetParent, Y.MakeNode],
    {
        /**
         * Event listener for child expansion/collapse, ensures that only one is expanded
         * at a time if multiExpand is not set.
         * @method _afterThisAccordionPanel:expandedChange
         * @param ev {EventFacade}
         * @private
         */
        '_afterThisAccordionPanel:expandedChange': function (ev) {
            var child = ev.target;
            if (ev.newVal  && !this.get(MULTI_EXPAND)) {
                this.each(function (panel) {
                    if (panel !== child && panel.get(EXPANDED)) {
                        panel.collapse();
                    }
                });
            }
        },
        /**
         * Listens to the <code>panelClose</code> and destroys the panel
         * and removes it from the collection of panels.
         * @method _afterThisAccordionPanel:panelClose
         * @param ev {EventFacade} uses ev.target to locate the panel requesting the close
         * @private
         */

        '_afterThisAccordionPanel:panelClose': function (ev) {
            var panel = ev.target;
            if (this.indexOf(panel) >= 0) {
                this.remove(panel);
                panel.destroy();
            }
        },
        /**
         * Sets the resizeable attribute of all panels to the value set for the whole accordion
         * @method _uiSetResizeable
         * @param value {Boolean} new value of the resizeable attribute
         * @private
         */
        _uiSetResizeable: function (value) {
            this.each(function (panel) {
                panel.set(RESIZEABLE, value);
            });
        },
        /**
         * Sets the closeable attribute of all panels to the value set for the whole accordion
         * @method _uiSetCloseable
         * @param value {Boolean} new value of the closeable attribute
         * @private
         */
        _uiSetCloseable: function (value) {
            this.each(function (panel) {
                panel.set(CLOSEABLE, value);
            });
        }
    },
    {
        /**
         * Defines the attributes that MakeNode should link to _uiSetXxxx methods to reflect them in the UI.
         * @property _ATTRS_2_UI
         * @static
         * @protected
         */
        _ATTRS_2_UI: {
            BIND: [RESIZEABLE, CLOSEABLE],
            SYNC: [RESIZEABLE, CLOSEABLE]
        },
        /**
         * Defines events that are to be associated to listeners by MakeNode.
         * Here it links a couple of events from the items,
         * expandedChange to ensure only one panel is open at a time and
         * panelClose to destroy and remove a panel
         * @property _EVENTS
         * @type Object
         * @static
         * @protected
         */
        _EVENTS: {
            THIS: [
                'accordionPanel:expandedChange',
                'accordionPanel:panelClose'
            ]
        },

        ATTRS: {
            /**
             * Default type of children to create.  Used by WidgetParent.
             * @attribute defaultChildType
             * @type WidgetChild
             * @default AccordionPanel
             * @protected
             */
            defaultChildType: {
                value: 'AccordionPanel'
            },
            /**
             * Whether several panels may be expanded at once.
             * @attribute multiExpand
             * @type Boolean
             * @default true
             */
            multiExpand: {
                value:true,
                validator: Lang.isBoolean
            },
            /**
             * Helper attribute to set all panels resizeable attribute at once.
             * May be overriden in each panel separately.
             * Requires the optional resize-plugin module to be loaded.
             * @attribute resizeable
             * @type Boolean
             * @default true
             */
            resizeable: {
                value: true,
                validator: Lang.isBoolean
            },
                            /**
             * Helper attribute to set all panels closeable attribute at once.
             * May be overriden in each panel separately.
             * @attribute closeable
             * @type Boolean
             * @default true
             */
            closeable: {
                value: true,
                validator: Lang.isBoolean
            }

        }
    }
);



}, 'gallery-2013.01.23-21-59', {
    "requires": [
        "widget",
        "widget-parent",
        "widget-child",
        "widget-stdmod",
        "gallery-makenode"
    ],
    "optional": [
        "resize-plugin",
        "transition"
    ],
    "skinnable": true
});
