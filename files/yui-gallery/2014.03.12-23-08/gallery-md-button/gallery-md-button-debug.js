YUI.add('gallery-md-button', function (Y, NAME) {

/**
 * Provides a better button object
 * @module gallery-md-button
 */
 "use strict";

var Lang = Y.Lang,
    EVENT_PRESS = 'press',
    CALLBACK = 'callback',
    DESELECTED_CALLBACK = 'deselectedCallback',
    SELECTED = 'selected',
    BBX = 'boundingBox',
    CBX = 'contentBox',
    DEFAULT = 'default',
    DISABLED = 'disabled',
    HREF = 'href',
    ICON = 'icon',
    TITLE = 'title',
    VALUE = 'value',
    LABEL = 'label',
    INNER_HTML = 'innerHTML',
    PUSH = 'push',
    SUBMIT = 'submit',
    RESET = 'reset',
    TYPE = 'type',
    LEFT = 'left',
    RIGHT = 'right';

/**
 * The Button class provides a fancier type of button.
 * @class Button
 * @extends Y.Widget
 * @uses Y.MakeNode
 * @constructor
 * @param cfg {object} Configuration Attributes
 */

Y.Button = Y.Base.create(
    'button',
    Y.Widget,
    [Y.MakeNode],
    {

        /**
         * Overrides the boundingBox template to make it an anchor
         * @property BOUNDING_TEMPLATE
         * @type string
         * @default '&lt;a /&gt;'
         * @private
         */
        BOUNDING_TEMPLATE: '<a />',

        /**
         * Overrides the contentBox template to prevent a content box from being drawn
         * @property CONTENT_TEMPLATE
         * @type null
         * @default null
         * @private
         */
        CONTENT_TEMPLATE: null,

        /**
         * Holds the previous value of the className assigned through the <a href="#config_icon"><code>icon</code></a>
         * attribute for easy removal
         * (Eventually it will be dropped, see: http://yuilibrary.com/projects/yui3/ticket/2530486)
         * @property _prevIconClassName
         * @type string
         * @private
         */
        _prevIconClassName:'',


        renderUI: function () {
            this.get(BBX).append(this._makeNode());
            this._locateNodes(LABEL, ICON);
        },


        /**
         * Removes the pressed class.
         * MouseUp is listened to at the document body level since the cursor might have moved
         * away from the pressed button when released.
         * @method _afterDocumentMouseup
         * @private
         */
        _afterDocumentMouseup: function () {
            this.get(BBX).removeClass(this._classNames.pressed);
        },

        /**
         * Adds the pressed class to bounding box
         * @method _afterBoundingBoxMousedown
         * @private
         */
        _afterBoundingBoxMousedown: function () {
            if (!this.get(DISABLED)) {
                this.get(BBX).addClass(this._classNames.pressed);
            }
        },
        /**
         * Sets the title attribute to the bounding box
         * @method _uiSetTitle
         * @param title {String}
         * @private
         */
        _uiSetTitle: function (title) {
            this.get(BBX).set(TITLE, title);
        },
        /**
         * Updates the default class on the bounding box
         * @method _uiSetDefault
         * @param state {boolean}
         * @private
         */
        _uiSetDefault: function (state) {
            var bbx = this.get(BBX);
            if (state) {
                bbx.addClass(this._classNames[DEFAULT]);
                bbx.setAttribute(DEFAULT, DEFAULT);
            } else {
                bbx.removeClass(this._classNames[DEFAULT]);
                bbx.set(DEFAULT, '');
            }
        },
        /**
         * Sets the icon class for the bounding box
         *
         * @method _uiSetIcon
         * @param value {String} class suffix (always prefixed with <code>yui3-button-icon-</code>)
         * @private
         */
        _uiSetIcon: function (value) {
            value = value || 'none';
            var newName = this._classNames[ICON] + '-' + value;
            this.get(BBX).replaceClass(
                this._prevIconClassName,
                newName
            );
            this._prevIconClassName = newName;
        },
        /**
         * Sets the position of the icon relative to the label.
         * Spans for icons are always set at either side,
         * this method changes a classname in the bounding box
         * so that one of them is hidden
         * @method _uiSetIconPosition
         * @param value {String} 'left' or 'right'
         * @private
         */

        _uiSetIconPosition: function (value) {
            var cn = this._classNames;
            this.get(CBX).replaceClass(cn[ICON +(value===LEFT?RIGHT:LEFT)],cn[ICON + value]);
        },

        /**
         * Sets the icon class for the bounding box
         *
         * @method _uiSetLabel
         * @param value {String or null} label to be set or null for none
         * @private
         */
        _uiSetLabel: function (value) {
            if (!value || value === '') {
                this.get(BBX).addClass(this._classNames.noLabel);
            } else {
                this.get(BBX).removeClass(this._classNames.noLabel);
            }
            this._labelNode.setContent(value || '');
        },
        /**
         * Sets the href attribute on the bounding box
         * @method _uiSetHref
         * @param value {String} url of link to be set.
         * @private
         */
        _uiSetHref: function (value) {
            this.get(BBX).set(HREF, value);
        },

        /**
         * Default click event handler
         * @method _afterBoundingBoxClick
         * @param ev {Event Facade}
         * @private
         */
        _afterBoundingBoxClick: function (ev) {
            var href = this.get(HREF);

            if (this.get(DISABLED)) {
                ev.preventDefault();
                return;
            }

            if (!href || href === '#') {
                ev.preventDefault();
            }
            this.fire(EVENT_PRESS, {
                click: ev
            });
        },

        /**
         * Default press callback function
         * @method _defPressFn
         * @param ev {EventFacade}
         * @private
         */
        _defPressFn: function (ev) {
            if (!this.get(DISABLED)) {
                var fn = this.get(CALLBACK) || this._callbackFromType();
                if (fn) {
                    fn.apply(this, ev);
                }
            }
        },

        /**
         * Returns a function based on the type of button. Form buttons such
         *   as Submit and Reset are attached to their parent form if one is
         *   found.  Otherwise null is returned.
         *
         * @method _callbackFromType
         * @private
         * @return Function or null
         */
        _callbackFromType: function () {
            var bbx = this.get(BBX),
                frm = bbx.ancestor('form');

            if (frm) {
                switch (this.get(TYPE)) {
                case SUBMIT:
                    return Y.bind(frm[SUBMIT], frm);
                case RESET:
                    return Y.bind(frm[RESET], frm);
                }
            }
            return null;
        }


    },
    {
        /**
         * Constant for 'push' <a href="#config_type">type</a> button (the default)
         * @property Y.Button.PUSH
         * @type String
         * @default 'push'
         * @static
         */
        PUSH:PUSH,
        /**
         * Constant for 'submit' <a href="#config_type">type</a> button
         * @property Y.Button.SUBMIT
         * @type String
         * @default 'submit'
         * @static
         */
        SUBMIT:SUBMIT,
        /**
         * Constant for 'reset' <a href="#config_type">type</a> button (the default)
         * @property Y.Button.RESET
         * @type String
         * @default 'reset'
         * @static
         */
        RESET:RESET,
        /**
         * Constant to set the <a href="#config_iconPosition">iconPosition</a> to be to the left of the label
         * @property Y.Button.LEFT
         * @type String
         * @default 'left'
         * @static
         */
        LEFT: LEFT,
        /**
         * Constant to set the <a href="#config_iconPosition">iconPosition</a> to be to the right of the label
         * @property Y.Button.RIGHT
         * @type String
         * @default 'right'
         * @static
         */
        RIGHT: RIGHT,
        /**
         * Template to use by the MakeNode extension
         * @property _TEMPLATE
         * @type String
         * @static
         * @protected
         */
        _TEMPLATE: [
            '<span class="{c icon}"></span>',
            '<span class="{c label}">{@ label}</span>'
        ].join('\n'),

        /**
         * Class name suffixes for CSS classNames used in the widget
         * @property Y.Button._CLASS_NAMES
         * @type [Strings]
         * @static
         * @protected
         */
        _CLASS_NAMES: ['pressed', DEFAULT, 'no-label', LABEL, ICON, ICON + LEFT, ICON + RIGHT],
        /**
         * DOM events to be listened to, used by the MakeNode extension
         * @property Y.Button._EVENTS
         * @type Object
         * @static
         * @protected
         */
        _EVENTS: {
            boundingBox: ['click','mousedown'],
            document: 'mouseup'
        },
        _PUBLISH: {
            press: {
                defaultFn: "_defPressFn"
            }
        },
        ATTRS: {
            /**
             * Label to be shown on the button
             * @attribute label
             * @type string
             * @default ''
             */
            label: {
                value: '',
                validator: Lang.isString
            },
            /**
             * Function to be called on button click
             * @attribute callback
             * @type Function
             */
            callback: {
                validator: Lang.isFunction
            },
            /**
             * Button is to be the default button
             * @attribute default
             * @type Boolean
             * @default false
             */
            'default': {
                value: false,
                validator: Lang.isBoolean
            },
            /**
             * Suffix to be added to the <code>yui3-button-icon-</code> class to
             * set on the button
             * @attribute icon
             * @type string or null for none
             * @default null
             */
            icon: {
                value: null,
                validator: function(value) {
                    return Lang.isString(value) || Lang.isNull(value);
                }
            },
            /**
             * Whether the icon should go to the left or to the right of the label
             * @attribute iconPosition
             * @type String ('left' or 'right')
             * @default 'left'
             */
            iconPosition : {
                value : LEFT,
                validator: function (value) {
                    return value === LEFT || value === RIGHT;
                }
            },
            /**
             * href property to set on the button A element
             * @attribute href
             * @default null
             */
            href: {
                value: null
            },
            /**
             * Title (tooltip) to set on the button element
             * @attribute title
             * @type string
             */
            title: {
                value: '',
                validator: Lang.isString
            },
            /**
             * Defines the button type. One of push, submit or reset.  Any value but submit or reset will assume push.
             * @attribute type
             * @type string
             * @default push
             */
            type: {
                value: PUSH,
                validator: Lang.isString,
                lazyAdd: false
            }
        },
        _ATTRS_2_UI: {
            BIND: [LABEL, ICON, TITLE, HREF, DEFAULT, 'iconPosition'],
            SYNC: [LABEL, ICON, TITLE, HREF, DEFAULT, 'iconPosition']
        },
        /**
         * HTML Parser assumes srcNode is either a &lt;button&gt; or
         *   &lt;input type="submit|reset"&gt;
         */
        HTML_PARSER: {

            disabled: function (srcNode) {
                return !!srcNode.get(DISABLED);
            },

            label: function (srcNode) {
                if (srcNode.getAttribute(VALUE)) {
                    return srcNode.getAttribute(VALUE);
                }
                if (srcNode.get(INNER_HTML)) {
                    return srcNode.get(INNER_HTML);
                }

                // default form button labels based on type
                if (srcNode.get('tagName') === 'INPUT') {
                    switch (srcNode.get(TYPE)) {
                    case RESET:
                        return RESET;
                    case SUBMIT:
                        return SUBMIT;
                    }
                }

                return null;
            },

            href: function (srcNode) {
                var href = srcNode.getAttribute(HREF);

                if (href) {
                    return href;
                }

                return null;
            },

            type: function (srcNode) {
                var type = srcNode.getAttribute(TYPE);

                if (type) {
                    return type.toLowerCase();
                }
                return null;
            },

            title: function (srcNode) {
                if (srcNode.getAttribute(TITLE)) {
                    return srcNode.getAttribute(TITLE);
                }
                if (srcNode.getAttribute(VALUE)) {
                    return srcNode.getAttribute(VALUE);
                }
                if (srcNode.get(INNER_HTML)) {
                    return srcNode.get(INNER_HTML);
                }
                return null;
            }

        }
    }
);

/**
 * The ButtonToggle class provides a two-state button
 * @class ButtonToggle
 * @extends Y.Button
 * @constructor
 * @param cfg {object} Configuration attributes
 */

Y.ButtonToggle = Y.Base.create(
    'buttonToggle',
    Y.Button,
    [],
    {
        /**
         * Overrides Button's <a href="Button.html#method__defPressFn">_defPressFn</a>
         * to produce the two-state effect
         * @method _defPressFn
         * @param ev {EventFacade}
         * @private
         */
        _defPressFn : function(ev) {
            if (!this.get(DISABLED)) {
                var newSelected = this.get(SELECTED)?0:1,
                    fn = this.get(newSelected?CALLBACK:DESELECTED_CALLBACK);
                if (fn) {
                    fn.apply(this, ev);
                }
                this.set(SELECTED, newSelected);
                if (!this.ancestor) {
                    if (newSelected) {
                        this.get(BBX).addClass(this._classNames[SELECTED]);
                    } else {
                        this.get(BBX).removeClass(this._classNames[SELECTED]);
                    }
                }
            }
        }
    },
    {
        /**
         * Class name suffixes for CSS classNames used in the widget.
         * Produces the yui3-button-toggle-selected className to be added
         * to the button if not within a ButtonGroup
         * @property Y.ButtonToggle._CLASS_NAMES
         * @type [Strings]
         * @static
         * @protected
         */
         _CLASS_NAMES:[SELECTED],
        ATTRS : {
            /**
             * Function to be called when the toggle is deselected
             * @attribute deselectedCallback
             * @type function or null
             * @default null
             */
            deselectedCallback : {
                value: null,
                validator : function (value) {
                    return Lang.isFunction(value) || Lang.isNull(value);
                }
            }
        }
    }
);



}, 'gallery-2013.01.23-21-59', {"requires": ["base-build", "widget", "gallery-makenode"], "skinnable": true});
