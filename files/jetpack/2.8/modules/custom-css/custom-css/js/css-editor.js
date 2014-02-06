( function ( $ ) {
	var safe, win, safecssResize, safecssInit;

	safecssResize = function () {
		safe.height( win.height() - safe.offset().top - 250 );
	};

	safecssInit = function() {
		safe = $( '#safecss' );
		win  = $( window );

		postboxes.add_postbox_toggles( 'editcss' );
		safecssResize();

		// Bound on a parent to ensure that this click event executes last.
		$( '#safecssform' ).on( 'click', '#preview', function ( e ) {
			e.preventDefault();

			document.forms["safecssform"].target = "csspreview";
			document.forms["safecssform"].action.value = 'preview';
			document.forms["safecssform"].submit();
			document.forms["safecssform"].target = "";
			document.forms["safecssform"].action.value = 'save';
		} );
	};

	window.onresize = safecssResize;
	addLoadEvent( safecssInit );
} )( jQuery );

jQuery( function ( $ ) {
	$( '.edit-preprocessor' ).bind( 'click', function ( e ) {
		e.preventDefault();

		$( '#preprocessor-select' ).slideDown();
		$( this ).hide();
	} );

	$( '.cancel-preprocessor' ).bind( 'click', function ( e ) {
		e.preventDefault();

		$( '#preprocessor-select' ).slideUp( function () {
			$( '.edit-preprocessor' ).show();
			$( '#preprocessor_choices' ).val( $( '#custom_css_preprocessor' ).val() );
		} );
	} );

	$( '.save-preprocessor' ).bind( 'click', function ( e ) {
		e.preventDefault();

		$( '#preprocessor-select' ).slideUp();
		$( '#preprocessor-display' ).text( $( '#preprocessor_choices option:selected' ).text() );
		$( '#custom_css_preprocessor' ).val( $( '#preprocessor_choices' ).val() ).change();
		$( '.edit-preprocessor' ).show();
	} );

	$( '.edit-css-mode' ).bind( 'click', function ( e ) {
		e.preventDefault();

		$( '#css-mode-select' ).slideDown();
		$( this ).hide();
	} );

	$( '.cancel-css-mode' ).bind( 'click', function ( e ) {
		e.preventDefault();

		$( '#css-mode-select' ).slideUp( function () {
			$( '.edit-css-mode' ).show();
			$( 'input[name=add_to_existing_display][value=' + $( '#add_to_existing' ).val() + ']' ).attr( 'checked', true );
		} );
	} );

	$( '.save-css-mode' ).bind( 'click', function ( e ) {
		e.preventDefault();

		$( '#css-mode-select' ).slideUp();
		$( '#css-mode-display' ).text( $( 'input[name=add_to_existing_display]:checked' ).val() == 'true' ? 'Add-on' : 'Replacement' );
		$( '#add_to_existing' ).val( $( 'input[name=add_to_existing_display]:checked' ).val() );
		$( '.edit-css-mode' ).show();
	} );
} );