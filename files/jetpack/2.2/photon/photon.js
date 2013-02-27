(function($){
	/**
	 * For images lacking explicit dimensions and needing them, try to add them.
	 */
	var restore_dims = function() {
		$( 'img[data-recalc-dims]' ).each( function() {
			if ( this.complete ) {
				var width = this.width,
					height = this.height;

				if ( width && width > 0 && height && height > 0 ) {
					$( this ).attr( {
						width: width,
						height: height
					} );

					reset_for_retina( this );
				}
			}
			else {
				$( this ).load( arguments.callee );
			}
		} );
	},

	/**
	 * Modify given image's markup so that devicepx-jetpack.js will act on the image and it won't be reprocessed by this script.
	 */
	reset_for_retina = function( img ) {
		$( img ).removeAttr( 'data-recalc-dims' ).removeAttr( 'scale' );
	};

	/**
	 * Check both when page loads, and when IS is triggered.
	 */
	$( document ).ready( restore_dims );

	if ( "on" in $.fn )
		$( document.body ).on( 'post-load', restore_dims );
	else
		$( document ).delegate( 'body', 'post-load', restore_dims );
})(jQuery);