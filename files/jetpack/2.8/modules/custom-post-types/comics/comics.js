jQuery( function ( $ ) {
	/**
	 * Enable front-end uploading of images for Comics users.
	 */
	var Jetpack_Comics = {
		init : function () {
			$( document ).on( 'dragover.jetpack-comics', 'body, #jetpack-comic-drop-zone', this.onDragOver );
			$( document ).on( 'dragleave.jetpack-comics', 'body, #jetpack-comic-drop-zone', this.onDragLeave );
			$( document ).on( 'drop.jetpack-comics', 'body, #jetpack-comic-drop-zone', this.onDrop );

			$( 'body' ).append( $( '<div id="jetpack-comic-drop-zone"><p class="dragging" /><p class="uploading" /></div>' ) );
			$( '#jetpack-comic-drop-zone' )
				.find( '.dragging' )
					.text( Jetpack_Comics_Options.labels.dragging )
				.end()
				.find( '.uploading' )
					.text( Jetpack_Comics_Options.labels.uploading )
					.prepend( $( '<span class="spinner"/>' ) );

			if ( ! ( 'FileReader' in window && 'File' in window ) ) {
				$( '#jetpack-comic-drop-zone .dragging' ).text( Jetpack_Comics_Options.labels.unsupported );
				$( document ).off( 'drop.jetpack-comics' ).on( 'drop.jetpack-comics', 'body, #jetpack-comic-drop-zone', this.onDragLeave );
			}
		},

		/**
	 	 * Only upload image files.
		 */
		filterImageFiles : function ( files ) {
			var validFiles = [];

			for ( var i = 0, _len = files.length; i < _len; i++ ) {
				if ( files[i].type.match( /^image\//i ) ) {
					validFiles.push( files[i] );
				}
			}

			return validFiles;
		},

		dragTimeout : null,

		onDragOver: function ( event ) {
			event.preventDefault();

			clearTimeout( Jetpack_Comics.dragTimeout );

			$( 'body' ).addClass( 'dragging' );
		},

		onDragLeave: function ( event ) {
			clearTimeout( Jetpack_Comics.dragTimeout );

			// In Chrome, the screen flickers because we're moving the drop zone in front of 'body'
			// so the dragover/dragleave events happen frequently.
			Jetpack_Comics.dragTimeout = setTimeout( function () {
				$( 'body' ).removeClass( 'dragging' );
			}, 100 );
		},

		onDrop: function ( event ) {
			event.preventDefault();
			event.stopPropagation();

			// recent chrome bug requires this, see stackoverflow thread: http://bit.ly/13BU7b5
			event.originalEvent.stopPropagation();
			event.originalEvent.preventDefault();

			var files = Jetpack_Comics.filterImageFiles( event.originalEvent.dataTransfer.files );

			$( 'body' ).removeClass( 'dragging' );

			if ( files.length == 0 ) {
				alert( Jetpack_Comics_Options.labels.invalidUpload );
				return;
			}

			$( 'body' ).addClass( 'uploading' );

			var formData = new FormData();

			for ( var i = 0, fl = files.length; i < fl; i++ ) {
				formData.append( 'image_' + i, files[ i ] ); // won't work as image[]
			}

			$( '#jetpack-comic-drop-zone .uploading .spinner' ).spin();

			$.ajax( {
				url: Jetpack_Comics_Options.writeURL + '&nonce=' + Jetpack_Comics_Options.nonce,
				data: formData,
				processData: false,
				contentType: false,
				type: 'POST',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				}
			} )
			.done( function( data ) {
				$( '#jetpack-comic-drop-zone .uploading' ).text( Jetpack_Comics_Options.labels.processing );

				if ( 'url' in data ) {
					document.location.href = data.url;
				}
				else if ( 'error' in data ) {
					alert( data.error );

					$( 'body' ).removeClass( 'uploading' );
				}
			} )
			.fail( function ( req ) {
				alert( Jetpack_Comics_Options.labels.error );
			} );
		}
	};

	Jetpack_Comics.init();
} );
