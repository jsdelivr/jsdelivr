var wpPostLikeCount = wpPostLikeCount || {};

(function($) {

	wpPostLikeCount = jQuery.extend( wpPostLikeCount, {
		request: function( options ) {
			return $.ajax( {
				type: 'GET',
				url: wpPostLikeCount.jsonAPIbase + options.path,
				dataType : "jsonp",
				data: options.data,
				success: function( response ) { options.success( response ); },
				error: function( response ) { options.error( response ); }
			} );
		}
	} );

})(jQuery);
