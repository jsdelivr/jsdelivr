( function( factory ) {
    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( [
            "jquery",
            "jquery-ui"
        ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
}( function( $ ) {
    "use strict";

    $.extend( $.ui.keyCode, {
        NUMPAD_0: 96,
        NUMPAD_1: 97,
        NUMPAD_2: 98,
        NUMPAD_3: 99,
        NUMPAD_4: 100,
        NUMPAD_5: 101,
        NUMPAD_6: 102,
        NUMPAD_7: 103,
        NUMPAD_8: 104,
        NUMPAD_9: 105,
        DECIMAL_POINT: 110
    } );

    $.widget( "ui.pinpad", {

        /**
         * The semantic version number of the released jQuery UI Framework.
         */
        version: "1.4.1",

        /**
         * The HTML element on which the pinpad widget should be bound.
         */
        defaultElement: "<input>",

        /**
         * The options hash of the pinpad widget.
         */
        options: {

            /**
             * Specify the container of the pinpad widget. Must be a valid HTML element or jQuery
             * selector. If no matching DOM element is found during rendering, the widget is
             * inserted directly after the pinpad input.
             */
            appendTo: null,

            /**
             * Specify whether the confirm event is triggered when the pinpad input value length
             * reach its max length.
             */
            autoComplete: false,

            /**
             * Specify additional classes to add to the widget element.
             */
            classes: {
                "ui-pinpad": "ui-corner-all"
            },

            /**
             * Specify whether the correct command of the pinpad widget must clear the input
             * content. If set to true, the correct command clears the pin pad input content,
             * otherwise only the last inserted character is removed.
             */
            clear: false,

            /**
             * Defines the command buttons of this pin pad.
             */
            commands: [
                {
                    position: 0,
                    name: "cancel",
                    options: { icon: "ui-icon-close", iconPosition: "end" }
                },
                {
                    position: 1,
                    name: "correct",
                    options: { icon: "ui-icon-caret-1-w", iconPosition: "end" }
                },
                {
                    position: 2,
                    name: "confirm",
                    options: { icon: "ui-icon-radio-off", iconPosition: "end" }
                }
            ],

            /**
             * Specify whether the pin pad input accept only digits. If set to true, the pinpad
             * input should not accept the decimal point.
             */
            digitOnly: false,

            /**
             * Specify settings for localization.
             */
            display: {
                decPoint: ".",
                cancel: "Cancel",
                correct: "Correct",
                confirm: "Confirm"
            },

            /**
             * If and how to animate the hiding of the pinpad widget.
             */
            hide: true,

            /**
             * Defines the pin pad keys layout.
             */
            keys: [
                "1 2 3",
                "4 5 6",
                "7 8 9",
                "{empty} 0 {dec}"
            ],

            /**
             * Specify the minimum number of characters allowed to enable the confirm command.
             */
            minLength: 0,

            /**
             * Specify the maximum number of characters allowed in the pin pad input.
             */
            maxLength: Number.POSITIVE_INFINITY,

            /**
             * If and how to animate the showing of the pinpad widget.
             */
            show: true,

            // Callbacks
            cancel: null,
            change: null,
            close: null,
            confirm: null,
            keypress: null,
            open: null

        },

        /**
         * Creates the pinpad widget.
         * @private
         */
        _create: function() {
            var inst = this;
            var output = $( inst.options.output );
            var maxLength = inst.element.prop( "maxLength" );
            var container = inst._appendTo();

            inst.element.uniqueId();

            if ( output.length === 0 ) {
                output = inst.element.clone()
                    .attr( "id", inst.element.attr( "id" ) + "_output" )
                    .removeAttr( "maxlength" );
                output.insertAfter( inst.element );
            }
            output
                .addClass( "ui-pinpad-output" )
                .attr( "role", "pinpad-output" );
            $( "label[for='" + inst.element.attr( "id" ) + "']" ).each( function( index, element ) {
                $( element ).attr( "for", output.attr( "id" ) );
            } );
            inst.outputElement = output;

            inst.element.attr( "role", "pinpad-input" );
            inst.element.val( inst._getDefaultValue() );
            inst._addClass( "ui-pinpad-input", "ui-helper-hidden" );

            if ( inst.element.is( ":disabled" ) ) {
                inst.options.disabled = true;
            }

            if ( maxLength > 0 ) {
                maxLength = inst.options.maxLength ?
                    Math.min( inst.options.maxLength, maxLength ) :
                    maxLength;
                inst.options.maxLength = Math.max( inst.options.minLength, maxLength );
            }

            if ( !inst.options.formatter ) {
                inst.options.formatter = $.ui.pinpad.defaultFormatter;
            }

            inst.ppDiv = $( "<div></div>" )
                .appendTo( container.length ? container : document.body )
                .data( "input", inst.element );
            inst._addClass( inst.ppDiv, "ui-pinpad", "ui-widget ui-widget-content" );

            inst._bindInputEvents();
            inst.refresh();

            if ( !container.length ) {
                delete inst.options.appendTo;
                inst._on( document.body, {
                    "pinpadcancel": function( event ) {
                        inst._close( event.originalEvent );
                    },
                    "pinpadconfirm": function( event ) {
                        inst._close( event.originalEvent );
                    }
                } );
                inst._on( inst.outputElement, {
                    "focusin": function( event ) {
                        if ( inst.ppDiv.is( ":hidden" ) ) {
                            inst._open( event );
                        }
                    },
                    "focusout": function( event ) {
                        if ( event.relatedTarget != null ) {
                            var input = $( event.relatedTarget )
                                .closest( ".ui-pinpad" ).data( "input" );
                            if ( !( input && input.attr( "id" ) === inst.element.attr( "id" ) ) ) {
                                inst.cancel();
                            }
                        }
                    }
                } );
                inst._addClass( inst.ppDiv, null, "ui-front" );
                inst._hide( inst.ppDiv, false );
                inst.ppDiv.detach();
            } else {
                inst._addClass( inst.ppDiv, "ui-pinpad-inline" );
            }
        },

        /**
         * Adjusts the pinpad widget position on the screen.
         * @private
         */
        _adjustPosition: function() {
            var div = $( "<div></div>" )
                .css( "position", "absolute" )
                .appendTo( document.body )
                .position( {
                    my: "left top",
                    at: "left bottom",
                    of: this.outputElement
                } );
            this.ppDiv.css( div.css( [ "left", "top" ] ) );
            div.remove();
        },

        /**
         * Returns the jQuery object which contains the HTML element that will contains the pinpad.
         * If the jQuery object length is 0, then the pinpad widget will be appended to the
         * document body element.
         * @returns {jQuery} the pinpad container wrapper.
         * @private
         */
        _appendTo: function() {
            var container = $();
            if ( this.options.appendTo ) {
                container = container.add( this.options.appendTo );
            }
            return container;
        },

        /**
         * Checks if the decimal point key should be enabled.
         * @private
         */
        _checkDecimalKey: function() {
            var value = this.element.val();
            this.ppDiv.find( ".ui-pinpad-key-num-pad-dec" )
                .button( "option", "disabled", this.options.digitOnly || /\./.test( value ) );
        },

        /**
         * Checks and adjusts the state of the confirm command button.
         * @private
         */
        _checkConfirmCommand: function() {
            var value = this.element.val();
            if ( this.element.is( ":enabled" ) ) {
                var confirmCommand = this.ppDiv.find( ".ui-pinpad-command-confirm" );
                var confirmDisabled = confirmCommand.button( "option", "disabled" );
                var invalid = ( value.length < this.options.minLength ) ||
                    ( this.options.autoComplete &&
                    ( value.length < this.options.maxLength ) );
                invalid = invalid || this.element.is( ".ui-pinpad-input-invalid" );
                if ( invalid && !confirmDisabled ) {
                    confirmCommand.button( "disable" );
                } else if ( !invalid && confirmDisabled ) {
                    confirmCommand.button( "enable" );
                }
                if ( !invalid &&
                    this.options.autoComplete &&
                    value.length === this.options.maxLength ) {
                    this.confirm();
                }
            }
        },

        /**
         * Renders the pinpad numeric key buttons.
         * @private
         */
        _drawKeys: function() {
            var inst = this;
            var keys = [];
            var numPad = $( "<div class='ui-pinpad-num-pad'></div>" ).appendTo( this.ppDiv );
            var table = $( "<table></table>" ).appendTo( numPad );
            var firstKeyCode = $.ui.keyCode.NUMPAD_0;
            var row;
            var col;
            var i, j;
            $.each( this.options.keys, function( index, row ) {
                keys.push( row.split( " " ) );
            } );
            for ( i = 0; i < keys.length; i++ ) {
                row = $( "<tr></tr>" ).appendTo( table );
                for ( j = 0; j < keys[ i ].length; j++ ) {
                    var keyId = keys[ i ][ j ];
                    var digit = parseInt( keyId, 10 );
                    col = $( "<td></td>" ).appendTo( row );
                    if ( !isNaN( digit ) ) {
                        $( "<button type='button' class='ui-pinpad-key ui-pinpad-key-num-pad-" +
                            digit + "' data-key-code='" + ( firstKeyCode + digit ) + "' value='" +
                            digit + "'>" + digit + "</button>" ).appendTo( col ).button();
                    } else {
                        if ( /^\{\S+\}$/.test( keyId ) ) {
                            keyId = keyId.match( /^\{(\S+)\}$/ )[ 1 ];
                            if ( keyId === "dec" ) {
                                $( "<button type='button' " +
                                    "class='ui-pinpad-key ui-pinpad-key-num-pad-dec' " +
                                    "data-key-code='" + $.ui.keyCode.DECIMAL_POINT +
                                    "' value='.'>" + this.options.display.decPoint + "</button>" )
                                    .appendTo( col ).button( { disabled: this.options.digitOnly } );
                            } else if ( keyId === "empty" ) {
                                $( "<button type='button' " +
                                    "class='ui-pinpad-key ui-pinpad-key-num-pad-empty' " +
                                    "data-key-code='0'>&nbsp;</button>" )
                                    .appendTo( col ).button();
                            }
                        }
                    }
                }
            }
            this.ppDiv.find( ".ui-pinpad-key" ).each( function( index, element ) {
                var button = $( element );
                button.attr( "tabindex", "0" );
                inst._bindKeyEvents( button );
            } );
        },

        /**
         * Renders the command panel buttons.
         * @private
         */
        _drawCommands: function() {
            var that = this;
            var commands = that.options.commands;
            var commandPanel = $( "<div class='ui-pinpad-command-panel'></div>" )
                .appendTo( this.ppDiv );
            var button;
            var i;
            var count = 4;
            var table = $( "<table></table>" ).appendTo( commandPanel );
            for ( i = 0; i < count; i++ ) {
                var row = $( "<tr></tr>" ).appendTo( table );
                var col = $( "<td></td>" ).appendTo( row );
                button = $( "<button class='ui-pinpad-command' type='button'>&nbsp;</button>" )
                    .appendTo( col ).button();
            }
            $.each( commands, function( index, command ) {
                button = commandPanel.find( "tr:eq(" + command.position + ") .ui-pinpad-command" )
                    .addClass( "ui-pinpad-command-" + command.name )
                    .attr( "name", command.name )
                    .attr( "tabindex", "0" )
                    .button( "option", $.extend( {}, command.options, {
                        label: that.options.display[ command.name ]
                    } ) );
                that._bindCommandEvents( button );
            } );
        },

        /**
         * Updates the command button labels using the provided display object.
         * @param commands
         * @param display
         * @private
         */
        _updateCommands: function( commands, display ) {
            var commandPanel = this.ppDiv.find( ".ui-pinpad-command-panel" );
            $.each( commands, function( index, command ) {
                commandPanel.find( ".ui-pinpad-command-" + command.name )
                    .button( "option", {
                        label: display[ command.name ]
                    } );
            } );
        },

        /**
         * Bind events on the pinpad input and output elements.
         * @private
         */
        _bindInputEvents: function() {
            this._on( this.element, {
                change: function( event ) {
                    this._trigger( "change", event );
                    this._displayValue();
                    this._checkDecimalKey();
                    this._checkConfirmCommand();
                    event.preventDefault();
                }
            } );

            this._on( this.outputElement, {
                keydown: function( event ) {
                    var keyCode = event.keyCode;
                    switch ( keyCode ) {
                        case $.ui.keyCode.HOME:
                        case $.ui.keyCode.END:
                        case $.ui.keyCode.LEFT:
                        case $.ui.keyCode.RIGHT:
                        case $.ui.keyCode.UP:
                        case $.ui.keyCode.DOWN:
                        case $.ui.keyCode.TAB:
                            return;
                        case $.ui.keyCode.BACKSPACE:
                            if ( !this.options.clear ) {
                                this.ppDiv.find( ".ui-pinpad-command-correct" ).click();
                            }
                            break;
                        case $.ui.keyCode.DELETE:
                            if ( this.options.clear ) {
                                this.ppDiv.find( ".ui-pinpad-command-correct" ).click();
                            }
                            break;
                        case $.ui.keyCode.ENTER:
                            this.ppDiv.find( ".ui-pinpad-command-confirm" ).click();
                            break;
                        case $.ui.keyCode.ESCAPE:
                            this.ppDiv.find( ".ui-pinpad-command-cancel" ).click();
                            break;
                        case $.ui.keyCode.DECIMAL_POINT:
                            this.ppDiv.find( ".ui-pinpad-key-num-pad-dec" ).click();
                            break;
                        default:
                            if ( $.ui.pinpad.isDigit( keyCode ) ) {
                                this.ppDiv.find( ".ui-pinpad-key-num-pad-" +
                                    ( keyCode - $.ui.keyCode.NUMPAD_0 ) ).click();
                            }
                    }
                    event.preventDefault();
                }
            } );
        },

        /**
         * Bind events on pinpad key button element.
         * @param button
         * @private
         */
        _bindKeyEvents: function( button ) {
            this._on( button, {
                click: function( event ) {
                    var keyCode = button.data( "keyCode" );
                    var value = this.element.val();
                    if ( ( $.ui.pinpad.isDigit( keyCode ) ||
                        ( $.ui.pinpad.isDecimalPoint( keyCode ) &&
                        value.indexOf( "." ) === -1 ) ) &&
                        value.length < this.options.maxLength &&
                        this._trigger( "keypress", event, { keyCode: keyCode } ) ) {
                        this._insertText( button.val() );
                    }
                }
            } );
        },

        /**
         * Bind events on pinpad command button element.
         * @param button
         * @private
         */
        _bindCommandEvents: function( button ) {
            this._on( button, {
                click: function( event ) {
                    if ( button.is( ".ui-pinpad-command-correct" ) ) {
                        if ( this.options.clear ) {
                            this._clear();
                        } else {
                            this._backspace();
                        }
                    } else {
                        this._trigger( button.attr( "name" ), event );
                    }
                }
            } );
        },

        /**
         * Get the pinpad widget buttons that correspond to the given key code.
         * @param keyCode the key code to match
         * @returns {*|{}} a jQuery object with the set of button elements.
         * @private
         */
        _findButtons: function( keyCode ) {
            var buttons = $();
            switch ( keyCode ) {
                case $.ui.keyCode.BACKSPACE:
                    if ( !this.options.clear ) {
                        buttons = this.ppDiv.find( ".ui-pinpad-command-correct" );
                    }
                    break;
                case $.ui.keyCode.DELETE:
                    if ( this.options.clear ) {
                        buttons = this.ppDiv.find( ".ui-pinpad-command-correct" );
                    }
                    break;
                case $.ui.keyCode.ENTER:
                    buttons = this.ppDiv.find( ".ui-pinpad-command-confirm" );
                    break;
                case $.ui.keyCode.ESCAPE:
                    buttons = this.ppDiv.find( ".ui-pinpad-command-cancel" );
                    break;
                case $.ui.keyCode.DECIMAL_POINT:
                    buttons = this.ppDiv.find( ".ui-pinpad-key-num-pad-dec" );
                    break;
                default:
                    if ( $.ui.pinpad.isDigit( keyCode ) ) {
                        buttons = this.ppDiv.find( ".ui-pinpad-key-num-pad-" +
                            ( keyCode - $.ui.keyCode.NUMPAD_0 ) );
                    }
            }
            return buttons;
        },

        /**
         * Formats the pinpad input value and display the result on the output element.
         * @private
         */
        _displayValue: function() {
            var value = this.element.val();
            var options = this.options;
            var formattedValue = this.options.formatter.format( value, options);
            this.outputElement.val( formattedValue );
        },

        /**
         * Insert the given value of the pressed button.
         * @param value the value to insert.
         * @private
         */
        _insertText: function( value ) {
            var currentValue = this.element.val();
            if ( value == "\b" ) {
                this.value( currentValue.substring( 0, currentValue.length - 1 ) );
            } else {
                this.value( currentValue + value );
                this.outputElement.each( function( index, element ) {
                    if ( element.createTextRange ) {
                        var range = element.createTextRange();
                        range.collapse( false );
                        range.select();
                    } else {
                        element.blur();
                        element.selectionStart = element.selectionEnd = element.value.length;
                        element.focus();
                    }
                } );
            }
        },

        /**
         * Check if the given value can be used as pin pad raw value.
         * @param value the value to check.
         * @returns {boolean} true if the value is valid, otherwise false.
         * @private
         */
        _isValid: function( value ) {
            var valid = false;
            if ( typeof value === "string" ) {
                valid = ( value.length === 0 ) ||
                    ( $.ui.pinpad.isDecimalNumber( value ) &&
                    !( this.options.digitOnly && value.indexOf( "." ) > -1 ) );
            }
            return valid;
        },

        /**
         * Returns the options of this pin pad.
         * @returns {Object} the options of the pin pad.
         * @private
         */
        _getCreateEventData: function() {
            return { options: this.options };
        },

        /**
         * Returns the default value of this pin pad.
         * @returns {string} the default value of the pin pad.
         * @private
         */
        _getDefaultValue: function() {
            var inputVal = this.element.val();
            return inputVal && this._isValid( inputVal ) ? inputVal : "";
        },

        /**
         * Get the raw value of this pin pad.
         * @returns {string} the raw value of this pinpad.
         * @private
         */
        _getValue: function() {
            return this.element.val();
        },

        /**
         * Set the raw value of this pin pad.
         * @param newValue the new value to set.
         * @private
         */
        _setValue: function( newValue ) {
            if ( this._isValid( newValue ) ) {
                if ( this.ppDiv.is( ":hidden" ) ) {
                    this._show( this.ppDiv, this.options.show );
                }
                this.element.val( newValue ).change();
            }
        },

        _setOption: function( key, value ) {
            this._super( key, value );

            if ( key === "display" ) {
                this.ppDiv.find( ".ui-pinpad-key-num-pad-dec" )
                    .button( "option", "label", value.decPoint );
                this._updateCommands( this.options.commands, value );
            }

            this._checkDecimalKey();
            this._checkConfirmCommand();
        },

        /**
         * Update the pinpad to reflect the given disabled state.
         * @param value the disabled state value to set.
         * @private
         */
        _setOptionDisabled: function( value ) {
            var element = this.element,
                output = this.outputElement,
                widget = this.ppDiv;
            this._super( value );

            this._toggleClass( element, "ui-state-disabled", null, value );
            element.prop( "disabled", value );
            this._toggleClass( output, "ui-state-disabled", null, value );
            output.prop( "disabled", value );
            this._toggleClass( widget, "ui-state-disabled", null, value );
            widget.find( "button" ).each( function( index, button ) {
                $( button ).button( "option", "disabled", value );
            } );
            if ( value ) {
                output.blur();
            }
        },

        /**
         * Restore the original state of input.
         * @private
         */
        _destroy: function() {
            this.ppDiv.remove();
            this.outputElement.remove();
            this.element.removeAttr( "role" ).removeUniqueId();
        },

        /**
         * Show the pinpad overlay.
         * @param event the original event which cause the pinpad to be opened.
         * @private
         */
        _open: function( event ) {
            var inst = this;
            inst.ppDiv.appendTo( document.body );
            inst._adjustPosition();
            inst._show( inst.ppDiv, inst.options.show, function() {
                inst._trigger( "open", event );
            } );
        },

        /**
         * Hide the pinpad overlay.
         * @param event the original event which cause the pinpad to be closed.
         * @private
         */
        _close: function( event ) {
            var inst = this;
            inst._hide( inst.ppDiv, inst.options.hide, function() {
                inst._trigger( "close", event );
                inst.outputElement.blur();
                inst.ppDiv.detach();
            } );
        },

        /**
         * Removes the last inserted character.
         * @private
         */
        _backspace: function() {
            var currentValue = this.element.val();
            var length = currentValue.length;
            if ( length > 0 ) {
                this._insertText( "\b" );
            }
        },

        /**
         * Removes all inserted character.
         * @private
         */
        _clear: function() {
            this.value( "" );
        },

        /**
         * Clears the pinpad input content.
         */
        clear: function() {
            this._clear();
        },

        /**
         * Sends a cancel command to this pinpad.
         */
        cancel: function() {
            this.ppDiv.find( ".ui-pinpad-command-cancel" ).click();
        },

        /**
         * Sends a confirm command to this pinpad.
         */
        confirm: function() {
            this.ppDiv.find( ".ui-pinpad-command-confirm" ).click();
        },

        /**
         * Returns the output element where the formatted value is displayed.
         * @returns {Object} the jQuery object containing the unique output DOM element of this
         * pinpad.
         */
        output: function() {
            return this.outputElement;
        },

        /**
         * Render the pinpad with its actual state.
         */
        refresh: function() {
            var element = this.element;
            this.ppDiv.find( "button" ).button( "destroy" );
            this.ppDiv.empty();
            this._drawKeys();
            this._drawCommands();
            if ( element.is( ":disabled" ) ) {
                this.ppDiv.find( "button" ).button( "disable" );
            } else {
                this._checkConfirmCommand();
            }
        },

        /**
         * Get or set the raw value of this pinpad.
         * @param value the new raw value to set if not undefined.
         * @returns {string} the current raw value of this pinpad if value is undefined.
         */
        value: function( value ) {
            if ( value === undefined ) {
                return this._getValue();
            }
            var val = value.toString();
            this._setValue( val.substring( 0, Math.min( val.length, this.options.maxLength ) ) );
        },

        widget: function() {
            return this.ppDiv;
        }

    } );

    $.extend( $.ui.pinpad, {

        defaultFormatter: {

            format: function( value, settings ) {
                return value.replace( ".", settings.display.decPoint );
            }

        },

        regional: {
            en: { display: $.ui.pinpad.prototype.options.display }
        },

        /**
         * Generates a pin pad keys layout in order to have keys set in random position.
         * @returns {Array} the pinpad keys' layout.
         */
        generateRandomKeys: function() {
            var keys = [];
            var digits = [];
            var items = [];
            var i;
            for ( i = 0; i < 10; i++ ) {
                digits.push( i );
            }
            for ( i = digits.length; i > 0; i-- ) {
                var index = Math.floor( Math.random() * i );
                var digit = digits[ index ];
                digits.splice( index, 1 );
                items.push( digit );
                if ( items.length % 3 === 0 ) {
                    keys.push( items.join( " " ) );
                    items = [];
                }
            }
            keys.push( items );
            keys[ keys.length - 1 ] = "{empty} " + keys[ keys.length - 1 ] + " {empty}";
            return keys;
        },

        /**
         * Checks if the given value contains the decimal point.
         * @param value the value to check.
         * @returns {boolean}
         */
        isDecimalNumber: function( value ) {
            return ( /^\d+(\.\d*)?$/ ).test( value );
        },

        /**
         * Checks if the given key code represents the decimal point of the numpad.
         * @param keyCode the key code to check.
         * @returns {boolean} true if the key code represents the decimal point of the numpad,
         * otherwise false.
         */
        isDecimalPoint: function( keyCode ) {
            return keyCode === $.ui.keyCode.DECIMAL_POINT;
        },

        /**
         * Checks if the given key code represents a digit of the numpad.
         * @param keyCode the key code to check
         * @returns {boolean} true if the key code represents a digit of the numpad, otherwise
         * false.
         */
        isDigit: function( keyCode ) {
            return keyCode >= $.ui.keyCode.NUMPAD_0 && keyCode <= $.ui.keyCode.NUMPAD_9;
        }

    } );

    $( window ).on( {
        "mousedown": function( event ) {
            var target = $( event.target );
            if ( target.is( ".ui-pinpad-output" ) ) {
                return;
            }
            var input = target.closest( ".ui-pinpad" ).data( "input" );
            if ( input ) {
                if ( target.is( "button" ) ) {
                    target.addClass( "ui-state-active" );
                }
                event.preventDefault();
            } else {
                $( document.body ).children( ".ui-pinpad" ).each( function( index, element ) {
                    $( element ).data( "input" ).pinpad( "cancel" );
                } );
            }
        },

        "mouseup": function() {
            $( document ).find( ".ui-pinpad button.ui-state-active" )
                .removeClass( "ui-state-active" );
        }
    } );

    return $.ui.pinpad;

} ) );
