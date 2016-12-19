( function( factory ) {
    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( [
            "jquery"
        ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
}( function( $ ) {
    "use strict";

    $.widget( "ui.pinpad", $.ui.pinpad, {

        _bindInputEvents: function() {
            this._super();
            this._on( this.outputElement, {
                keydown: function( event ) {
                    this._findButtons( event.keyCode ).filter( ":enabled" )
                        .addClass( "ui-state-active" );
                },
                keyup: function( event ) {
                    this._findButtons( event.keyCode ).filter( ":enabled" )
                        .removeClass( "ui-state-active" );
                }
            } );
        },

        _open: function( event ) {
            this.ppDiv.find( "button.ui-state-active" ).removeClass( "ui-state-active" );
            this._super( event );
        }

    } );
} ) );