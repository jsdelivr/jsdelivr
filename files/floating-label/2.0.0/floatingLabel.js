(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.floatingLabel = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = {
    config: {
        floatingClassName: 'floating',
        delegateEvents: false
    },
    init: function initializeFloatingLabel( opt ) {
        'use strict';

        this._eventsDelegated = false;

        if ( opt instanceof Object ) {
            for ( var option in opt ) {
                if ( window.Object.hasOwnProperty.call( opt, option ) && window.Object.hasOwnProperty.call( this.config, option )) {
                    this.config[ option ] = opt[ option ];
                }
            }
        }

        // Once the DOM is loaded, evaluate the inputs on the page
        if ( window.addEventListener ) {
            window.addEventListener( 'DOMContentLoaded', this.evaluateInputs.bind( this ), false );
        } else {
            document.onreadystatechange = this.evaluateInputs.bind( this );
        }
    },

    /**
     * evaluateInputs - Loop through all the elements currently on the page and display the floating label if needed.
     * @version 1.0.0
     * @example
     * this.evaluateInputs();
     * @return {void}
     */
    evaluateInputs: function evaluateInputs() {
        'use strict';

        var self = this,
            inputs = document.querySelectorAll( 'input[type="text"], input[type="password"], input[type="email"], input[type="search"], input[type="url"], input[type="tel"], input[type="number"], textarea' );

        function showHideLabel( input, label ) {
            if ( input.value.length ) {
                self.addClass( label, self.config.floatingClassName );
            } else {
                self.removeClass( label, self.config.floatingClassName );
            }
        }

        function inputEventHandler( evt ) {
            if ( !evt ) {
                evt = window.event;
            }

            var inputEl = evt.target || evt.srcElement,
                inputID = inputEl.getAttribute( 'id' ),
                labelEl = document.querySelector( 'label[for="' + inputID + '"]' ),
                typeRe = /text|password|url|email|tel|search|number/i;

            if ( !labelEl ) {
              return;
            }

            if ( ( inputEl.nodeName === 'INPUT' && typeRe.test( inputEl.getAttribute( 'type' ))) || inputEl.nodeName === 'TEXTAREA' ) {
                showHideLabel( inputEl, labelEl );
            }
        }

        for ( var input = 0; input < inputs.length; input++ ) {
            if ( ( inputs[ input ] instanceof Element ) && window.Object.hasOwnProperty.call( inputs, input )) {
                var inputEl = inputs[ input ],
                    inputID = inputEl.getAttribute( 'id' ),
                    labelEl = document.querySelector( 'label[for="' + inputID + '"]' );

                if ( !labelEl ) {
                  return;
                }

                showHideLabel( inputEl, labelEl );

                this.removeEventListener( inputEl, 'keyup', inputEventHandler, false );
                this.removeEventListener( inputEl, 'input', inputEventHandler, false );

                if ( !this.config.delegateEvents ) {
                    this.addEventListener( inputEl, 'keyup', inputEventHandler, false );
                    this.addEventListener( inputEl, 'input', inputEventHandler, false );
                }
            }
        }

        if ( this.config.delegateEvents && !this._eventsDelegated ) {
            this.addEventListener( document.body, 'keyup', inputEventHandler, false );
            this.addEventListener( document.body, 'input', inputEventHandler, false );

            this._eventsDelegated = true;
        }
    },

    /**
     * getPreviousSibling - Small function to get the previous sibling of an element. Should be compatible with IE8+
     * @version 1.0.0
     * @example
     * this.getPreviousSibling( el );
     * @param  {element} el - The element to get the previous sibling of
     * @return {element} - The previous sibling element
     */
    getPreviousSibling: function getPreviousSibling( el ) {
        'use strict';

        el = el.previousSibling;

        while ( el && el.nodeType !== 1 ) {
            el = el.previousSibling;
        }

        return el;
    },

    /**
     * addClass - Small function to add a class to an element. Should be compatible with IE8+
     * @version 1.0.0
     * @example
     * this.addClass( this.currentTooltip, 'visible' );
     * @param  {element} el - The element to add the class to
     * @param  {string} className - The class name to add to the element
     * @return {element} - The element that had the class added to it
     * @api private
     */
    addClass: function addClass( el, className ) {
        'use strict';

        if ( el.classList ) {
            el.classList.add( className );
        } else {
            el.className += ' ' + className;
        }

        return el;
    },

    /**
     * removeClass - Small function to remove a class from an element. Should be compatible with IE8+
     * @version 1.0.0
     * @example
     * this.removeClass( this.currentTooltip, 'visible' );
     * @param  {element} el - The element to remove the class from
     * @param  {string} className - The class name to remove from the element
     * @return {element} - The element that had the class removed from it
     * @api private
     */
    removeClass: function removeClass( el, className ) {
        'use strict';

        if ( el ) {
            if ( el.classList ) {
                el.classList.remove( className );
            } else {
                el.className = el.className.replace( new RegExp( '(^|\\b)' + className.split( ' ' ).join( '|' ) + '(\\b|$)', 'gi' ), ' ' );
            }
        }

        return el;
    },

    /**
     * hasClass - Small function to see if an element has a specific class. Should be compatible with IE8+
     * @version 1.0.0
     * @example
     * this.hasClass( this.currentTooltip, 'visible' );
     * @param  {element} el - The element to check the class existence on
     * @param  {string} className - The class to check for
     * @return {boolean} - True or false depending on if the element has the class
     * @api private
     */
    hasClass: function hasClass( el, className ) {
        'use strict';

        if ( el.classList ) {
            return el.classList.contains( className );
        } else {
            return new RegExp( '(^| )' + className + '( |$)', 'gi' ).test( el.className );
        }
    },

    /**
     * addEventListener - Small function to add an event listener. Should be compatible with IE8+
     * @version 1.0.0
     * @example
     * this.addEventListener( document.body, 'click', this.open( this.currentTooltip ));
     * @param  {element} el - The element node that needs to have the event listener added
     * @param  {string} eventName - The event name (sans the "on")
     * @param  {function} handler - The function to be run when the event is triggered
     * @return {element} - The element that had an event bound
     * @api private
     */
    addEventListener: function addEventListener( el, eventName, handler, useCapture ) {
        'use strict';

        if ( !useCapture ) {
            useCapture = false;
        }

        if ( el.addEventListener ) {
            el.addEventListener( eventName, handler, useCapture );

            return el;
        } else {
            if ( eventName === 'focus' ) {
                eventName = 'focusin';
            }

            el.attachEvent( 'on' + eventName, function() {
                handler.call( el );
            });

            return el;
        }
    },

    /**
     * removeEventListener - Small function to remove and event listener. Should be compatible with IE8+
     * @version 1.0.0
     * @example
     * this.removeEventListener( document.body, 'click', this.open( this.currentTooltip ));
     * @param  {element} el - The element node that needs to have the event listener removed
     * @param  {string} eventName - The event name (sans the "on")
     * @param  {function} handler - The function that was to be run when the event is triggered
     * @return {element} - The element that had an event removed
     * @api private
     */
    removeEventListener: function removeEventListener( el, eventName, handler, useCapture ) {
        'use strict';

        if ( !useCapture ) {
            useCapture = false;
        }

        if ( el.removeEventListener ) {
            el.removeEventListener( eventName, handler, useCapture );
        } else {
            if ( eventName === 'focus' ) {
                eventName = 'focusin';
            }

            el.detachEvent( 'on' + eventName, function() {
                handler.call( el );
            });
        }

        return el;
    }
};

},{}]},{},[1])(1)
});
