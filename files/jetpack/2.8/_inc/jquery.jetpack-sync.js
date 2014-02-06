jQuery( document ).ready( function($) {
	var update = function( cooldown ) {
		var self = $( '.jetpack_sync_reindex_control' );

		self
			.find( '.jetpack_sync_reindex_control_action' )
			.attr( 'disabled', true );

		self
			.find( '.jetpack_sync_reindex_control_status' )
			.html( '&hellip;' );

		if ( 'DONE' == self.data( 'status' ) ) {
			var data = { action:'jetpack-sync-reindex-trigger' };
		} else {
			var data = { action:'jetpack-sync-reindex-status' };
		}

		$.getJSON(
			ajaxurl,
			data,
			function( response ) {
				var self = $( '.jetpack_sync_reindex_control' );
				var strings = self.data( 'strings' );
				var status = strings[response.status]['status'];

				if ( 'INDEXING' == response.status ) {
					status += ' (' + Math.floor( 100 * response.posts.imported / response.posts.total ) + '%)';
				}

				self
					.data( 'status', response.status );

				self
					.find( '.jetpack_sync_reindex_control_action' )
					.val( strings[response.status]['action'] );

				self
					.find( '.jetpack_sync_reindex_control_status' )
					.text( status );

				setTimeout( function() {
					$( '.jetpack_sync_reindex_control' )
						.find( '.jetpack_sync_reindex_control_action' )
						.attr( 'disabled', false );
				}, cooldown );
			}
		);
	};

	$( '.jetpack_sync_reindex_control' )
		.find( '.jetpack_sync_reindex_control_action' )
		.live( 'click', function( event ) {
			event.preventDefault();
			update( 5000 );
		} );

	update( 1000 );
} );
