function googlePlusSignInCallback( authResult ) {
	var blogID = jQuery( '#current-blog-id' ).attr( 'data-value' );
	if ( authResult['code'] ) {
		jQuery.ajax( {
			type: 'POST',
			url: 'index.php?page=gplus-authorship&blog_id=' + blogID + '&store_token=' + authResult['code'] + '&state=' + state,
			contentType: 'application/json; charset=utf-8',
			processData: false,

			success: function(result) {
				if ( 'undefined' == typeof result.error ) {
					googlePlusSendToParent( { success: true } );
				} else {
					googlePlusSendToParent( { error: result.error } );
				}
			},

			error: function( result ) {
				if ( 'undefined' != typeof result.error ) {
					googlePlusSendToParent( { error: result.error } );
				} else {
					googlePlusSendToParent( { error: 'unknown' } );
				}
			}
		} );
	} else if ( authResult['error'] ) {
		googlePlusSendToParent( { error: authResult['error'] } );
	} else {
		googlePlusSendToParent( { error: 'unknown' } );
	}
}

 function googlePlusSendToParent( data ) {
 	if ( 'immediate_failed' == data.error )
 		return;
 	pm( {
		target: window.parent,
		type: 'googlePlusSignInMessage',
		data: data,
		origin: '*'
	} );
}