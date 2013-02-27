/**
 * Resizeable Iframes.
 *
 * Start listening to resize postMessage events for selected iframes:
 * $( selector ).Jetpack( 'resizeable' );
 * - OR -
 * Jetpack.resizeable( 'on', context );
 *
 * Resize selected iframes:
 * $( selector ).Jetpack( 'resizeable', 'resize', { width: 100, height: 200 } );
 * - OR -
 * Jetpack.resizeable( 'resize', { width: 100, height: 200 }, context );
 *
 * Stop listening to resize postMessage events for selected iframes:
 * $( selector ).Jetpack( 'resizeable', 'off' );
 * - OR -
 * Jetpack.resizeable( 'off', context );
 *
 * Stop listening to all resize postMessage events:
 * Jetpack.resizeable( 'off' );
 */
(function($) {
	var listening     = false, // Are we listening for resize postMessage events
	    sourceOrigins = [],    // What origins are allowed to send resize postMessage events
	    $sources      = false, // What iframe elements are we tracking resize postMessage events from

	    URLtoOrigin,     // Utility to convert URLs into origins
	    setupListener,   // Binds global resize postMessage event handler
	    destroyListener, // Unbinds global resize postMessage event handler

	    methods; // Jetpack.resizeable methods

	// Setup the Jetpack global
	if ( 'undefined' === typeof window.Jetpack ) {
		window.Jetpack = {
			/**
			 * Handles the two different calling methods:
			 * $( selector ).Jetpack( 'namespace', 'method', context ) // here, context is optional and is used to filter the collection
			 * - vs. -
			 * Jetpack.namespace( 'method', context ) // here context defines the collection
			 *
			 * @internal
			 *
			 * Call as: Jetpack.getTarget.call( this, context )
			 *
			 * @param string context: jQuery selector
			 * @return jQuery|undefined object on which to perform operations or undefined when context cannot be determined
			 */
			getTarget: function( context ) {
				if ( this instanceof jQuery ) {
					return context ? this.filter( context ) : this;
				}

				return context ? $( context ) : context;
			}
		};
	}

	// Setup the Jetpack jQuery method
	if ( 'undefined' === typeof $.fn.Jetpack ) {
		/**
		 * Dispatches calls to the correct namespace
		 * 
		 * @param string namespace
		 * @param ...
		 * @return mixed|jQuery (chainable)
		 */
		$.fn.Jetpack = function( namespace ) {
			if ( 'function' === typeof Jetpack[namespace] ) {
				// Send the call to the correct Jetpack.namespace
				return Jetpack[namespace].apply( this, Array.prototype.slice.call( arguments, 1 ) );
			} else {
				$.error( 'Namespace "' + namespace + '" does not exist on jQuery.Jetpack' );
			}
		};
	}

	// Define Jetpack.resizeable() namespace to just always bail if no postMessage
	if ( 'function' !== typeof window.postMessage ) {
		$.extend( window.Jetpack, {
			/**
			 * Defines the Jetpack.resizeable() namespace.
			 * See below for non-trivial definition for browsers with postMessage.
			 */ 
			resizeable: function() {
				$.error( 'Browser does not support window.postMessage' );
			}
		} );

		return;
	}

	/**
	 * Utility to convert URLs into origins
	 *
	 * http://example.com:port/path?query#fragment -> http://example.com:port
	 *
	 * @param string URL
	 * @return string origin
	 */
	URLtoOrigin = function( URL ) {
		if ( ! URL.match( /^https?:\/\// ) ) {
			URL = document.location.href;
		}
		return URL.split( '/' ).slice( 0, 3 ).join( '/' );
	};

	/**
	 * Binds global resize postMessage event handler
	 */
	setupListener = function() {
		listening = true;

		$( window ).on( 'message.JetpackResizeableIframe', function( e ) {
			var event = e.originalEvent,
			    data;

			// Ensure origin is allowed
			if ( -1 === $.inArray( event.origin, sourceOrigins ) ) {
				return;
			}

			// Some browsers send structured data, some send JSON strings
			if ( 'object' === typeof event.data ) {
				data = event.data;
			} else {
				try {
					data = JSON.parse( event.data );
				} catch ( err ) {
					data = false;
				}
			}

			if ( !data ) {
				return;
			}

			// Is it a resize event?
			if ( 'undefined' === typeof data.action || 'resize' !== data.action ) {
				return;
			}

			// Find the correct iframe and resize it
			$sources.filter( function() {
				if ( 'undefined' !== typeof data.name )
					return this.name === data.name;
				else
					return event.source === this.contentWindow;
			} ).first().Jetpack( 'resizeable', 'resize', data );
		} );
	};

	/**
	 * Unbinds global resize postMessage event handler
	 */
	destroyListener = function() {
		listening = false;
		$( window ).off( 'message.JetpackResizeableIframe' );

		sourceOrigins = [];
		$( '.jetpack-resizeable' ).removeClass( 'jetpack-resizeable' );
		$sources = false;
	};

	// Methods for Jetpack.resizeable() namespace
	methods = {
		/**
		 * Start listening for resize postMessage events on the given iframes
		 *
		 * Call statically as: Jetpack.resizeable( 'on', context )
		 * Call as: $( selector ).Jetpack( 'resizeable', 'on', context ) // context optional: used to filter the collectino
		 *
		 * @param string context jQuery selector.
		 * @return jQuery (chainable)
		 */
		on: function( context ) {
			var target = Jetpack.getTarget.call( this, context );

			if ( ! listening ) {
				setupListener();
			}

			target.each( function() {
				sourceOrigins.push( URLtoOrigin( $( this ).attr( 'src' ) ) );
			} ).addClass( 'jetpack-resizeable' );

			$sources = $( '.jetpack-resizeable' );

			return target;
		},

		/**
		 * Stop listening for resize postMessage events on the given iframes
		 *
		 * Call statically as: Jetpack.resizeable( 'off', context )
		 * Call as: $( selector ).Jetpack( 'resizeable', 'off', context ) // context optional: used to filter the collectino
		 *
		 * @param string context jQuery selector
		 * @return jQuery (chainable)
		 */
		off: function( context ) {
			var target = Jetpack.getTarget.call( this, context );

			if ( 'undefined' === typeof target ) {
				destroyListener();

				return target;
			}

			target.each( function() {
				var origin = URLtoOrigin( $( this ).attr( 'src' ) ),
				    pos = $.inArray( origin, sourceOrigins );

				if ( -1 !== pos ) {
					sourceOrigins.splice( pos, 1 );
				}
			} ).removeClass( 'jetpack-resizeable' );

			$sources = $( '.jetpack-resizeable' );

			return target;
		},

		/**
		 * Resize the given iframes
		 *
		 * Call statically as: Jetpack.resizeable( 'resize', dimensions, context )
		 * Call as: $( selector ).Jetpack( 'resizeable', 'resize', dimensions, context ) // context optional: used to filter the collectino
		 *
		 * @param object dimensions in pixels: { width: (int), height: (int) }
		 * @param string context jQuery selector
		 * @return jQuery (chainable)
		 */
		resize: function( dimensions, context ) {
			var target = Jetpack.getTarget.call( this, context );

			$.each( [ 'width', 'height' ], function( i, variable ) {
				var value = 0;
				if ( 'undefined' !== typeof dimensions[variable] ) {
					value = parseInt( dimensions[variable], 10 );
				}

				if ( 0 !== value ) {
					target[variable]( value );
				}
			} );

			return target;
		}
	};

	// Define Jetpack.resizeable() namespace
	$.extend( window.Jetpack, {
		/**
		 * Defines the Jetpack.resizeable() namespace.
		 * See above for trivial definition for browsers with no postMessage.
		 *
		 * @param string method
		 * @param ...
		 * @return mixed|jQuery (chainable)
		 */
		resizeable: function( method ) {
			if ( methods[method] ) {
				// Send the call to the correct Jetpack.resizeable() method
				return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
			} else if ( ! method ) {
				// By default, send to Jetpack.resizeable( 'on' ), which isn't useful in that form but is when called as
				// jQuery( selector ).Jetpack( 'resizeable' )
				return methods.on.apply( this );
			} else {
				$.error( 'Method ' +  method + ' does not exist on Jetpack.resizeable' );
			} 
		}
	} );
})(jQuery);
