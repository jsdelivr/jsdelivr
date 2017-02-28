jQuery( function( $ ) {
	function setWidgetMargin( $widget ) {
		if ( $widget.hasClass( 'expanded' ) ) {
			// The expanded widget must be at least 400px wide in order to
			// contain the visibility settings. IE wasn't handling the
			// margin-left value properly.

			if ( $widget.attr( 'style' ) )
				$widget.data( 'original-style', $widget.attr( 'style' ) );

			var currentWidth = $widget.width();

			if ( currentWidth < 400 ) {
				var extra = 400 - currentWidth;
				$widget.css( 'position', 'relative' ).css( 'left', '-' + extra + 'px' ).css( 'width', '400px' );
			}
		}
		else if ( $widget.data( 'original-style' ) ) {
			// Restore any original inline styles when visibility is toggled off.
			$widget.attr( 'style', $widget.data( 'original-style' ) ).data( 'original-style', null );
		}
		else {
			$widget.removeAttr( 'style' );
		}
	}

	$( "a.display-options" ).each( function() {
		var $displayOptionsButton = $( this ),
			$widget = $displayOptionsButton.closest( "div.widget" );
		$displayOptionsButton.insertBefore( $widget.find( "input.widget-control-save" ) );

		// Widgets with no configurable options don't show the Save button's container.
		$displayOptionsButton
			.parent()
				.removeClass( 'widget-control-noform' )
				.find( '.spinner' )
					.remove()
					.css( 'float', 'left' )
					.prependTo( $displayOptionsButton.parent() );

	} );

	$( "div#widgets-right" ).on( "click", "a.add-condition", function( e ) {
		e.preventDefault();
		var $condition = $( this ).closest( "div.condition" ),
			$conditionClone = $condition.clone().insertAfter( $condition );
		$conditionClone.find( "select.conditions-rule-major" ).val( "" );
		$conditionClone.find( "select.conditions-rule-minor" ).html( "" ).attr( "disabled" );
	} ).on( "click", "a.display-options", function ( e ) {
		e.preventDefault();

		var $displayOptionsButton = $( this ),
			$widget = $displayOptionsButton.closest( "div.widget" );

		$widget.find( "div.widget-conditional" ).toggleClass( "widget-conditional-hide" );
		$( this ).toggleClass( "active" );
		$widget.toggleClass( "expanded" );
		setWidgetMargin( $widget );

		if ( $( this ).hasClass( 'active' ) )
			$widget.find( 'input[name=widget-conditions-visible]' ).val( '1' );
		else
			$widget.find( 'input[name=widget-conditions-visible]' ).val( '0' );

	} );

	$( "div#widgets-right" ).on( "click", "a.delete-condition", function( e ) {
		e.preventDefault();

		var $condition = $( this ).closest( "div.condition" );

		if ( $condition.is( ":first-child" ) && $condition.is( ":last-child" ) ) {
			$( this ).closest( "div.widget" ).find( "a.display-options" ).click();
			$condition.find( "select.conditions-rule-major" ).val( "" ).change();
		} else {
			$condition.detach();
		}
	} ).on( "click", "div.widget-top", function() {
		var $widget = $( this ).closest( "div.widget" ),
			$displayOptionsButton = $widget.find( "a.display-options" );

		if ( $displayOptionsButton.hasClass( "active" ) ) {
			$displayOptionsButton.attr( "opened", "true" );
		}

		if ( $displayOptionsButton.attr( "opened" ) ) {
			$displayOptionsButton.removeAttr( "opened" );
			$widget.toggleClass( "expanded" );
			setWidgetMargin( $widget );
		}
	} );

	$( document ).on( "change", "select.conditions-rule-major", function() {
		var $conditionsRuleMajor = $ ( this );
		var $conditionsRuleMinor = $conditionsRuleMajor.siblings( "select.conditions-rule-minor:first" );

		if ( $conditionsRuleMajor.val() ) {
			$conditionsRuleMinor.html( '' ).append( $( '<option/>' ).text( $conditionsRuleMinor.data( 'loading-text' ) ) );

			var data = {
				action: 'widget_conditions_options',
				major: $conditionsRuleMajor.val()
			};

			jQuery.post( ajaxurl, data, function( html ) {
				$conditionsRuleMinor.html( html ).removeAttr( "disabled" );
			} );
		} else {
			$conditionsRuleMajor.siblings( "select.conditions-rule-minor" ).attr( "disabled", "disabled" ).html( "" );
		}
	} );
} );
