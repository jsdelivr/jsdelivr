(function($) {

window.audioshortcode = {

	/**
	 * Prep the audio player once the page is ready, add listeners, etc
	 */
	prep: function( player_id, files, titles, volume, loop ) {
		// check if the player has already been prepped, no-op if it has
		var container = $( '#wp-as-' + player_id + '-container' );
		if ( container.hasClass( 'wp-as-prepped' ) ) {
			return;
		}
		container.addClass( 'wp-as-prepped' );

		// browser doesn't support HTML5 audio, no-op
		if ( ! document.createElement('audio').canPlayType ) {
			return;
		}

		// if the browser removed the script, no-op
		player = $( '#wp-as-' + player_id ).get(0);
		if ( typeof player === 'undefined' ) {
			return;
		}

		this[player_id] = [];
		this[player_id].i = 0;
		this[player_id].files = files;
		this[player_id].titles = titles;
		player.volume = volume;

		var type_map = {
			'mp3':  'mpeg',
			'wav':  'wav',
			'ogg':  'ogg',
			'oga':  'ogg',
			'm4a':  'mp4',
			'aac':  'mp4',
			'webm': 'webm'
		};

		// strip out all the files that can't be played
		for ( var i = this[player_id].files.length-1; i >= 0; i-- ) {
			var extension = this[player_id].files[i].split( '.' ).pop();
			var type = 'audio/' + type_map[extension];
			if ( ! player.canPlayType( type ) ) {
				this.remove_track( player_id, i );
			}
		}

		// bail if there are no more good files
		if ( 0 === this[player_id].files.length ) {
			return;
		}
		player.src = this[player_id].files[0];

		// show the controls if there are still 2+ files remaining
		if ( 1 < this[player_id].files.length ) {
			$( '#wp-as-' + player_id + '-controls' ).show();
		}

		player.addEventListener( 'error', function() {
			audioshortcode.remove_track( player_id, audioshortcode[player_id].i );
			if ( 0 < audioshortcode[player_id].files.length ) {
				audioshortcode[player_id].i--;
				audioshortcode.next_track( player_id, false, loop );
			}
		}, false );

		player.addEventListener( 'ended', function() {
			audioshortcode.next_track( player_id, false, loop );
		}, false );

		player.addEventListener( 'play', function() {
			var i = audioshortcode[player_id].i;
			var titles = audioshortcode[player_id].titles;
			$( '#wp-as-' + player_id + '-playing' ).text( ' ' + titles[i] );
		}, false );

		player.addEventListener( 'pause', function() {
			$( '#wp-as-' + player_id + '-playing' ).text( '' );
		}, false );
	},

	/**
	 * Remove the track and update the player/controls if needed
	 */
	remove_track: function( player_id, index ) {
		this[player_id].files.splice( index, 1 );
		this[player_id].titles.splice( index, 1 );

		// get rid of player/controls if they can't be played
		if ( 0 === this[player_id].files.length ) {
			$( '#wp-as-' + player_id + '-container' ).html( $( '#wp-as-' + player_id + '-nope' ).html() );
			$( '#wp-as-' + player_id + '-controls' ).html( '' );
		} else if ( 1 == this[player_id].files.length ) {
			$( '#wp-as-' + player_id + '-controls' ).html( '' );
		}
	},

	/**
	 * Change the src of the player, load the file, then play it
	 */
	start_track: function( player_id, file ) {
		var player = $( '#wp-as-' + player_id ).get(0);
		player.src = file;
		player.load();
		player.play();
	},

	/**
	 * Play the previous track
	 */
	prev_track: function( player_id ) {
		var player = $( '#wp-as-' + player_id ).get(0);
		var files = this[player_id].files;
		if ( player.paused || 0 === this[player_id].i ) {
			return;
		}

		player.pause();
		if ( 0 < this[player_id].i ) {
			this[player_id].i--;
			this.start_track( player_id, files[this[player_id].i] );
		}
	},

	/**
	 * Play the next track
	 */
	next_track: function( player_id, fromClick, loop ) {
		var player = $( '#wp-as-' + player_id ).get(0);
		var files = this[player_id].files;
		if ( fromClick && ( player.paused || files.length-1 == this[player_id].i ) ) {
			return;
		}

		player.pause();
		if ( files.length-1 > this[player_id].i ) {
			this[player_id].i++;
			this.start_track( player_id, files[this[player_id].i] );
		} else if ( loop ) {
			this[player_id].i = 0;
			this.start_track( player_id, 0 );
		} else {
			this[player_id].i = 0;
			player.src = files[0];
			$( '#wp-as-' + player_id + '-playing' ).text( '' );
		}
	}
};

})(jQuery);
