YUI.add('gallery-md-spinner', function (Y, NAME) {

/**
* Shows an input box with a set of up/down buttons to change its value.
* @module gallery-md-spinner
* @class Spinner
* @constructor
* @extends Widget
* @uses MakeNode
*/
"use strict";

var Lang = Y.Lang,
    CBX = 'contentBox',
    VALUE = 'value',
    CHANGE = 'Change',
    INPUT = 'input',
    INPUT_ERROR = 'inputError',
    UP = 'up',
    DOWN = 'down',
    UI = 'ui',
    PARSER = 'parser',
    FORMATTER = 'formatter',
    MIN = 'min',
    MAX = 'max',
    WRAPAROUND = 'wraparound',
    WRAPPED = 'wrapped';

Y.Spinner = Y.Base.create(
    'spinner',
    Y.Widget,
    [Y.MakeNode],
    {

        /**
         * Renders the HTML elements of this component.
         * Uses the TEMPLATE static variable to produce the markup.
         * Calls _locateNodes to get the references to the elements created.
         * @method renderUI
         */
        renderUI : function() {
            this.get(CBX).append(this._makeNode());
            this._locateNodes();
        },

        /**
         * Bounding box mouse down handler. Will determine if the mouse down
         * is on one of the spinner buttons, and increment/decrement the value
         * accordingly.
         *
         * The method also sets up a timer, to support the user holding the mouse
         * down on the spinner buttons. The timer is cleared when a mouse up event
         * is detected.
         * @method _afterBoundingBoxMousedown
         * @param ev {EventFacade} Event facade produced by the event handler
         * @private
         */
        _afterBoundingBoxMousedown : function(ev) {
            var node = ev.target,
                dir,
                handled = false,
                value = this.get(VALUE),
                minorStep = this.get("minorStep");

            if (node.hasClass(this._classNames.up)) {
                this.set(VALUE, value + minorStep);
                dir = 1;
                handled = true;
            } else if (node.hasClass(this._classNames.down)) {
                this.set(VALUE, value - minorStep);
                dir = -1;
                handled = true;
            }

            if (handled) {
                this._setMouseDownTimers(dir, minorStep);
            }
        },

        /**
         * Override the default content box value, since we don't want the srcNode
         * to be the content box for spinner.
         * @property _defaultCB
         * @type HTMLElement
         * @private
         */
        _defaultCB : function() {
            return null;
        },

        /**
         * Document mouse up handler. Clears the timers supporting
         * the "mouse held down" behavior.
         * @method _afterDocumentMouseup
         * @private
         */
        _afterDocumentMouseup : function() {
            this._clearMouseDownTimers();
        },

        /**
         * Bounding box Arrow up/down, Page up/down key listener.
         *
         * Increments/Decrement the spinner value, based on the key pressed.
         * @method _onDirectionKey
         * @param ev {EventFacade} as provided by the key listener
         * @private
         */
        _onDirectionKey : function(ev) {

            ev.preventDefault();

            var value = this.get(VALUE),
                minorStep = this.get("minorStep"),
                majorStep = this.get("majorStep");

            switch (ev.charCode) {
                case 38:
                    value += minorStep;
                    break;
                case 40:
                    value -= minorStep;
                    break;
                case 33:
                    value += majorStep;
                    break;
                case 34:
                    value -= majorStep;
                    break;
            }
            this.set(VALUE, value);
        },

        /**
         * Simple change handler, to make sure user does not input an invalid value.
         * If an error is detected, focus will return to the input box and the input box highlighted briefly.
         * @method _afterInputChange
         * @private
         */
        _afterInputChange : function() {
            var inputEl = this._inputNode,
                value = this.get(PARSER)(inputEl.get(VALUE));

            // It validates it to prevent the wraparound method from wrapping it around and masking the input error.
            if (this._validateValue(value)) {
                this.set(VALUE, value);
            } else {
                // this._uiSetValue(this.get(VALUE));
                inputEl.focus();
                inputEl.addClass(this._classNames[INPUT_ERROR]);
                Y.later(1000, this, function () {
                    inputEl.removeClass(this._classNames[INPUT_ERROR]);
                });
            }
        },
        /**
         * Default parser for the user input.  It assumes only integers are expected
         * @method parser
         * @param value {string} value read from the input box
         * @return {integer} parsed value
         */
        parser: function (value) {
            return parseInt(value, 10);
        },
        /**
         * Formats the internal value to be shown to the user
         * @method formatter
         * @param value {integer} value to be shown
         * @return {string} formatted value actually displayed
         */
        formatter: function (value) {
            return value;
        },

        /**
         * Initiates mouse down timers, to increment slider, while mouse button
         * is held down
         * @method _setMouseDownTimers
         * @param dir {1 | -1} Direction, up or down, to change at each tick
         * @param step {number} Amount to change on each tick
         * @private
         */
        _setMouseDownTimers : function(dir, step) {
            this._mouseDownTimer = Y.later(500, this, function() {
                this._mousePressTimer = Y.later(100, this, function() {
                    this.set(VALUE, this.get(VALUE)  + (dir * step));
                }, null, true);
            });
        },
        /**
         * If attribute <a href="#config_wraparound"><code>wraparound</code></a> is true this method is set as a before listener
         * for the <a href="#event_valueChange"><code>valueChange</code></a> event.
         * When one end of the range is reached, it will make it jump to the other end.
         * Changes the newVal property of the event facade, which will be the new value for the attribute.
         * If stepping by more than one, it will advance the value
         * by the remaining amount of the step.
         * Fires the <a href="#event_wrapped"><code>wrapped</code></a> event when the value is wrapped around.
         * @method _wrap
         * @param ev {EventFacade}
         * @private
         */
        /**
         * Fires when one end of the range is reached and the value is folded to the other end.
         * @event wrapped
         * @param prevVal {number} value that triggered the wrapping
         * @param newVal {number} new value after wrapping
         */
        _wrap: function (ev) {
            var max = this.get(MAX),
                min = this.get(MIN),
                value = ev.newVal;
            if (value > max) {
                value -= max - min + 1;
                this.fire(WRAPPED,{prevVal:ev.newVal, newVal: value});
            } else if (value < min) {
                value += max - min + 1;
                this.fire(WRAPPED,{prevVal:ev.newVal, newVal: value});
            }
            ev.newVal = value;
        },
        /**
         * Clears timers used to support the "mouse held down" behavior
         * @method _clearMouseDownTimers
         * @private
         */
        _clearMouseDownTimers : function() {
            if (this._mouseDownTimer) {
                this._mouseDownTimer.cancel();
                this._mouseDownTimer = null;
            }
            if (this._mousePressTimer) {
                this._mousePressTimer.cancel();
                this._mousePressTimer = null;
            }
        },

        /**
         * Updates the value of the input box to reflect
         * the value passed in through the <code>value</code> configuration attribute
         * @method _uiSetValue
         * @param value {integer} new value to be set
         * @param src {string} source of the new value.  If the source is 'ui' the change will be ignored.
         * @private
         */
        _uiSetValue : function(value,src) {
            if (src === UI) {
                return;
            }
            this._inputNode.set(VALUE, this.get(FORMATTER)(value));
        },
        /**
         * Attaches the <a href="#method__wrap"><code>_wrap</code></a> method as a before-event listener
         * when <a href="#config_wraparound"><code>wraparound</code></a> is set.
         * @method _uiSetWraparound
         * @param value {Boolean} value of wraparound attribute
         * @private
         */
        _uiSetWraparound: function (value) {
            if (value) {
                this._wrapListener =  this.on(VALUE + CHANGE, this._wrap, this);
            } else {
                if (this._wrapListener) {
                    this._wrapListener.detach();
                }
            }
        },

        /**
         * value attribute default validator. Verifies that
         * the value being set lies between the min/max value
         * @method _validateValue
         * @param val {number} value to be validated
         * @return {Boolean} true if within bounds
         * @private
         */
        _validateValue: function(val) {
            return val >= this.get(MIN) && val <= this.get(MAX);
        }
    },
    {
        /**
         * MakeNode template for this component
         * @property _TEMPLATE
         * @type String
         * @static
         * @protected
         */
        _TEMPLATE: [
            '<input type="text" title="{s input}" class="{c input}">',
            '<button type="button" title="{s up}" class="{c up}"></button>',
            '<button type="button" title="{s down}" class="{c down}"></button>'
        ].join('\n'),
        /**
         * List of CSS class name suffixes to be generated and used in the template
         * @property _CLASS_NAMES
         * @type [String]
         * @static
         * @protected
         */
        _CLASS_NAMES: [INPUT, UP, DOWN, INPUT_ERROR],
        /**
         * Descriptor of DOM events to be listened to and the methods to handle them
         * @property _EVENTS
         * @type Object
         * @static
         * @protected
         */
        _EVENTS: {
            boundingBox: [
                {
                    type: 'key',
                    fn:'_onDirectionKey',
                    args:((!Y.UA.opera) ? "down:" : "press:") + "38, 40, 33, 34"
                },
                'mousedown'
            ],
            document: 'mouseup',
            input: 'change'
        },
        ATTRS: {
            /**
             * The minimum value for the spinner.
             * @attribute min
             * @type number
             * @default 0
             */
            min : {
                value:0
            },

            /**
             * The maximum value for the spinner.
             * @attribute min
             * @type number
             * @default 100
             */
            max : {
                value:100
            },

            /**
             * The current value of the spinner.
             * @attribute value
             * @type number
             * @default 0
             */
            value : {
                value:0,
                validator: '_validateValue'
            },

            /**
             * Amount to increment/decrement the spinner when the buttons or arrow up/down keys are pressed.
             * @attribute minorStep
             * @type number
             * @default 1
             */
            minorStep : {
                value:1
            },

            /**
             * Amount to increment/decrement the spinner when the page up/down keys are pressed.
             * @attribute majorStep
             * @type number
             * @default 10
             */
            majorStep : {
                value:10
            },

            /**
             * override default ("null"), required for focus()
             * @attribute tabIndex
             * @type integer
             * @default 0
             */
            tabIndex: {
                value: 0
            },

            /**
             * The strings for the spinner UI (used in the tooltip texts)
             * @attribute strings
             * @type hash
             */
            strings: {
                value: {
                    input: "Press the arrow up/down keys for minor increments, page up/down for major increments.",
                    up: "Increment",
                    down: "Decrement"
                }
            },
            /**
             * Function to format the value to be shown to the user
             * @attribute formatter
             * @type function
             * @default this.formatter
             */
            formatter: {
                valueFn: function() {
                    return this.formatter;
                },
                validator: Lang.isFunction
            },
            /**
             * Function to format the value entered by the user
             * @attribute parser
             * @type function
             * @default this.parser
             */
            parser: {
                valueFn: function() {
                    return this.parser;
                },
                validator: Lang.isFunction
            },
            /**
             * Whether the values should wrap around to the other end when one end of the range is reached
             * @attribute wraparound
             * @type Boolean
             * @default false
             */
            wraparound: {
                value: false,
                validator: Lang.isBoolean
            }
        },
        /**
         * Adds the <code>value</code> attribute to the list of attributes whose change needs to be reflected in the UI
         * @property _ATTRS_2_UI
         * @type Object
         * @static
         * @protected
         */
        _ATTRS_2_UI: {
            BIND: [VALUE, WRAPAROUND],
            SYNC: [VALUE, WRAPAROUND]
        },
        /**
         * Tells Widget to read the value from the input box if any existing markup is found
         * @property HTML_PASER
         * @type Object
         * @static
         */
        HTML_PARSER: {
            value: function (srcNode) {
                var val = parseInt(srcNode.get(VALUE),10);
                return Lang.isNumber(val) ? val : null;
            }
        }
    }
);


}, 'gallery-2013.01.23-21-59', {
    "requires": [
        "base-build",
        "event-key",
        "widget",
        "node-focusmanager",
        "gallery-makenode"
    ],
    "skinnable": true
});
