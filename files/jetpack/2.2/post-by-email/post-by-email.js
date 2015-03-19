jetpack_post_by_email = {
	init: function() {
		jQuery( '#jp-pbe-enable' ).click( jetpack_post_by_email.enable );
		jQuery( '#jp-pbe-regenerate' ).click( jetpack_post_by_email.regenerate );
		jQuery( '#jp-pbe-disable' ).click( jetpack_post_by_email.disable );
	},

	enable: function() {
		jQuery( '#jp-pbe-enable' ).attr( 'disabled', 'disabled' );
		jQuery( '#jp-pbe-error' ).fadeOut();
		jQuery( '#jp-pbe-spinner' ).fadeIn();

		var data = {
			action: 'jetpack_post_by_email_enable'
		};

		jQuery.post( ajaxurl, data, jetpack_post_by_email.handle_enabled );
	},

	handle_enabled: function( response ) {
		var enabled = false;
		var error;
		try {
			error = JSON.parse( response );
		} catch ( e ) {
			enabled = true;
		}

		jQuery( '#jp-pbe-regenerate' ).removeAttr( 'disabled' );
		jQuery( '#jp-pbe-disable' ).removeAttr( 'disabled' );

		if ( enabled ) {
			jQuery( '#jp-pbe-enable' ).fadeOut( 400, function() {
				jQuery( '#jp-pbe-enable' ).removeAttr( 'disabled' );
				jQuery( '#jp-pbe-email' ).val( response );
				jQuery( '#jp-pbe-info' ).fadeIn();
			});
		} else {
			jQuery( '#jp-pbe-error' ).text( error.message );
			jQuery( '#jp-pbe-error' ).fadeIn();
			jQuery( '#jp-pbe-enable' ).removeAttr( 'disabled' );
		}

		jQuery( '#jp-pbe-spinner' ).fadeOut();
	},

	regenerate: function() {
		jQuery( '#jp-pbe-regenerate' ).attr( 'disabled', 'disabled' );
		jQuery( '#jp-pbe-disable' ).attr( 'disabled', 'disabled' );
		jQuery( '#jp-pbe-error' ).fadeOut();
		jQuery( '#jp-pbe-spinner' ).fadeIn();

		var data = {
			action: 'jetpack_post_by_email_regenerate'
		};

		jQuery.post( ajaxurl, data, jetpack_post_by_email.handle_regenerated );
	},
	
	handle_regenerated: function( response ) {
		var regenerated = false;
		var error;
		try {
			error = JSON.parse( response );
		} catch ( e ) {
			regenerated = true;
		}

		if ( regenerated ) {
			jQuery( '#jp-pbe-email-wrapper' ).fadeOut( 400, function() {
				jQuery( '#jp-pbe-email' ).val( response );
				jQuery( '#jp-pbe-email-wrapper' ).fadeIn();
			});
		} else {
			jQuery( '#jp-pbe-error' ).text( error.message );
			jQuery( '#jp-pbe-error' ).fadeIn();
		}

		jQuery( '#jp-pbe-regenerate' ).removeAttr( 'disabled' );
		jQuery( '#jp-pbe-disable' ).removeAttr( 'disabled' );
		jQuery( '#jp-pbe-spinner' ).fadeOut();
	},

	disable: function() {
		jQuery( '#jp-pbe-regenerate' ).attr( 'disabled', 'disabled' );
		jQuery( '#jp-pbe-disable' ).attr( 'disabled', 'disabled' );
		jQuery( '#jp-pbe-error' ).fadeOut();
		jQuery( '#jp-pbe-spinner' ).fadeIn();

		var data = {
			action: 'jetpack_post_by_email_disable'
		};

		jQuery.post( ajaxurl, data, jetpack_post_by_email.handle_disabled );
	},

	handle_disabled: function( response ) {
		var disabled = false;
		var error;
		try {
			error = JSON.parse( response );
		} catch ( e ) {
			disabled = true;
		}

		if ( 'error' != error.response ) {
			disabled = true;
		}

		if ( disabled ) {
			jQuery( '#jp-pbe-enable' ).removeAttr( 'disabled' );
			jQuery( '#jp-pbe-info' ).fadeOut( 400, function() {
				jQuery( '#jp-pbe-regenerate' ).removeAttr( 'disabled' );
				jQuery( '#jp-pbe-disable' ).removeAttr( 'disabled' );
				jQuery( '#jp-pbe-enable' ).fadeIn();
			});
		} else {
			jQuery( '#jp-pbe-regenerate' ).removeAttr( 'disabled' );
			jQuery( '#jp-pbe-disable' ).removeAttr( 'disabled' );

			jQuery( '#jp-pbe-error' ).text( error.message );
			jQuery( '#jp-pbe-error' ).fadeIn();
		}

		jQuery( '#jp-pbe-spinner' ).fadeOut();
	}
};

jQuery( function() { jetpack_post_by_email.init(); } );
