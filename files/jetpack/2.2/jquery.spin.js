/*
 * Matt Husby https://github.com/matthusby/spin.js
 * Based on the jquery plugin by Bradley Smith
 * https://gist.github.com/1290439
 */

/*
Add spin to the jQuery object
If color is not passed the spinner will be black
You can now create a spinner using any of the variants below:
$("#el").spin(); // Produces default Spinner
$("#el").spin("small"); // Produces a 'small' Spinner
$("#el").spin("large", "white"); // Produces a 'large' Spinner in white (or any valid CSS color).
$("#el").spin({ ... }); // Produces a Spinner using your custom settings.
$("#el").spin("small-right"); // Pin the small spinner to the right edge
$("#el").spin("{small, medium, large}-{left, right, top, bottom}"); // All options for where to pin
$("#el").spin(false); // Kills the spinner.
*/

( function( $ ) {
	$.fn.spin = function( opts, color ) {
		var presets = {
			"small": { lines: 8, length: 2, width: 2, radius: 3, trail: 60, speed: 1.3 },
			"medium": { lines: 8, length: 4, width: 3, radius: 5, trail: 60, speed: 1.3 },
			"large": { lines: 10, length: 6, width: 4, radius: 7, trail: 60, speed: 1.3 }
		};
		if ( Spinner ) {
			return this.each( function() {
				var $this = $( this ),
					data = $this.data();

				if ( data.spinner ) {
					data.spinner.stop();
					delete data.spinner;
				}
				if ( opts !== false ) {
					var spinner_options;
					if ( typeof opts === "string" ) {
						var spinner_base = opts.indexOf( '-' );
						if( spinner_base == -1 ) {
							spinner_base = opts;
						} else {
							spinner_base = opts.substring( 0, spinner_base );
						}
						if ( spinner_base in presets ) {
							spinner_options = presets[spinner_base];
						} else {
							spinner_options = {};
						}
						var padding;
						if ( opts.indexOf( "-right" ) != -1 ) {
							padding = jQuery( this ).css( 'padding-left' );
							if( typeof padding === "undefined" ) {
								padding = 0;
							} else {
								padding = padding.replace( 'px', '' );
							}
							spinner_options.left = jQuery( this ).outerWidth() - ( 2 * ( spinner_options.length + spinner_options.width + spinner_options.radius ) ) - padding - 5;
						}
						if ( opts.indexOf( '-left' ) != -1 ) {
							spinner_options.left = 5;
						}
						if ( opts.indexOf( '-top' ) != -1 ) {
							spinner_options.top = 5;
						}
						if ( opts.indexOf( '-bottom' ) != -1 ) {
							padding = jQuery( this ).css( 'padding-top' );
							if( typeof padding === "undefined" ) {
								padding = 0;
							} else {
								padding = padding.replace( 'px', '' );
							}
							spinner_options.top = jQuery( this ).outerHeight() - ( 2 * ( spinner_options.length + spinner_options.width + spinner_options.radius ) ) - padding - 5;
						}
					}
					if( color ){
						spinner_options.color = color;
					}
					data.spinner = new Spinner( spinner_options ).spin( this );
				}
			});
		} else {
			throw "Spinner class not available.";
		}
	};
})( jQuery );