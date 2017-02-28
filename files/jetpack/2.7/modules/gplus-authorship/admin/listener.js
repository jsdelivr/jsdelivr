jQuery( function( $ ) {

	pm.bind( 'googlePlusSignInMessage', function( message ) {
		if ( 'undefined' != typeof message.error)
			GooglePlusMessageHandler.error( message.error );
		else if ( 'undefined' != typeof message.success && 'undefined' != typeof message.result )
			GooglePlusMessageHandler.success( message.result );
		else
			GooglePlusMessageHandler.unknownMessage( message );
	} );

	var GooglePlusMessageHandler = {

		outputContainer: '#result',

		success: function( result ) {
			$.post( './admin-ajax.php',
				{
					action: 'save_gplus_profile_data',
					name: result.name,
					url: result.url,
					profile_image: result.profile_image,
					id: result.id,
					state: result.state
				}, function() {
					$( GooglePlusMessageHandler.outputContainer ).text( GPlusL10n.connected );
					window.location.href = 'options-general.php?page=sharing&r=' + Math.round( Math.random()*100000 ) + '#gplus';
				}
			);
		},

		error: function( error ) {
			if ( 'unknown' == error ) {
				$( GooglePlusMessageHandler.outputContainer ).text( GPlusL10n.unknownError );
			} else if ( 'access_denied' == error ) {
				$( GooglePlusMessageHandler.outputContainer ).text( GPlusL10n.accessDenied );
			} else {
				$( GooglePlusMessageHandler.outputContainer ).text( error );
			}
		},

		unknownMessage: function( message ) {
			console.log( 'DEBUG: An unknown message was passed via postMessage:' );
			console.log( message );
			GooglePlusMessageHandler.error( 'unknown' );
		},

	};

	$( '#disconnect-gplus' ).click( function() {
		var ays = confirm( 'Are you sure you want to disconnect your Google+ profile? If you have any Publicize accounts connected to this profile they will also be disconnected.' );
			if ( ! ays ) {
				return false;
			}
	} );

} );
