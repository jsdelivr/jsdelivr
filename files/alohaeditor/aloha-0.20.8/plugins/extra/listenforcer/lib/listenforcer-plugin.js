/*!
 * Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 *
 *
 * Aloha List Enforcer
 * -------------------
 * Enforces a one top-level list per editable policy ;-)
 * This plugin will register editables and enforce lists in them. List enforced
 * editables will be permitted to contain, exactly one top-level element which
 * must be a (OL or a UL) list element.
 */

define( [
	'aloha',
	'aloha/jquery',
	'aloha/plugin',
	'aloha/floatingmenu',
	'aloha/console'
], function( Aloha, jQuery, Plugin, FloatingMenu, console ) {
	

	/**
	 * An internal array of all editables inwhich to enforce lists.
	 *
	 * @private
	 */
	var listEnforcedEditables = [];

	/**
	 * Given an editable which has been configured to enforce lists,
	 * ensures that there is exactly one top-level list in the editable.
	 * If there are no lists, one will be added, using the
	 * placeHolderListString. If there is more than one list, they will be
	 * merged into the first list.
	 *
	 * @private
	 * @param {jQuery} $editable
	 * @param {String} placeHolderListString
	 */
	function enforce ( $editable, placeHolderListString ) {
		// Check if this editable is configured to enforce lists
		if ( jQuery.inArray( $editable[ 0 ], listEnforcedEditables ) === -1 ) {
			return;
		}

		// Remove all temporary <br>s in the editable, which we may have
		// inserted when we activated this editable and found it empty. These
		// <br>s are needed to make the otherwise emty <li> visible (in IE).
		$editable.find( '.GENTICS_temporary' ).remove();

		// Check for the presence of at least one non-empty list. We consider
		// a list to be not empty if it has atleast one item whose contents are
		// more than a single (propping) <br> tag.

		var hasList = false;

		$editable.find( 'li' ).each( function(){
			// nb: jQuery text() method returns the text contents of the
			// element without <br>s being rendered.
			if ( jQuery.trim( jQuery( this ).text() ) !== '' ) {
				hasList = true;
				// Stop looking for lists as soon as we find our first
				// non-empty list
				return false;
			}
		} );

		// If we found no non-empty list, then we add our empty dummy list that
		// the user can work with.
		if ( !hasList ) {
			$editable.html( placeHolderListString );
		}

		// Concatinate all top-level lists into the first, before, thereby
		// merging all top-level lists into one.
		var $lists = $editable.find( '>ul,>ol' ),
		    j = $lists.length,
		    i;
		if ( j > 1 ) {
			var $firstList = jQuery( $lists[0] );
			for ( i = 1; i < j; ++i ) {
				$firstList.append( jQuery( $lists[ i ] ).find( '>li' ) );
				jQuery( $lists[ i ] ).remove();
			}
		}

		// Remove all top-level elements which are not lists
		$editable.find( '>*:not(ul,ol)' ).remove();
	};

	return Plugin.create( 'listenforcer', {

		languages: [ 'en', 'de' ],

		_constructor: function() {
			this._super( 'listenforcer' );
		},

		/**
		 * Initializes the listenforcer plugin:
		 * We read the aloha configuration settings to determine which
		 * editables are to have list enforced in them.
		 * We bind handlers to 3 events (aloha-editable-activated,
		 * aloha-editable-deactivated, and aloha-smart-content-changed) on
		 * which we will process the current active editable and enfore lists
		 * in it.
		 */
		init: function() {
			var that = this,
			    elemsToEnforce = this.settings.editables || [],
				elemToEnforce,
				i,
				j = elemsToEnforce.length;

			// Register all editables that are to enforce lists.
			// The following types of items can be used as jQuery selectors:
			// String, DOMElement, and jQuery
			for ( i = 0; i < j; i++ ) {
				elemToEnforce = elemsToEnforce[ i ];
				if ( typeof elemToEnforce === 'string' ||
						elemToEnforce.nodeName ||
							elemToEnforce instanceof jQuery ) {
					this.addEditableToEnforcementList( jQuery( elemToEnforce )[0] );
				} else {
					console.warn(
						'Aloha List Enforcer Plugin',
						'Object "' + elemToEnforce.toString() + '" can not ' +
						'be used as a jQuery selector with which to register' +
						' an editable to be list enforced.'
					);
				}
			}

			Aloha.bind( 'aloha-editable-activated', function( $event, params ) {
				enforce( params.editable.obj,
					'<ul><li><br class="GENTICS_temporary" /></li></ul>' );
			} );

			Aloha.bind( 'aloha-editable-deactivated', function( $event, params ) {
				enforce( params.editable.obj, '' );
			} );

			Aloha.bind( 'aloha-smart-content-changed', function( $event, params ) {
				// window.console.log( 'Smart content changed event' );
				enforce( params.editable.obj,
					'<ul><li><br class="GENTICS_temporary" /></li></ul>' );
			} );
		},

		/**
		 * Registers the given editable to be list-enforced.
		 *
		 * @param {DOMElement} editable
		 */
		addEditableToEnforcementList: function( editable ) {
			if ( editable ) {
				listEnforcedEditables.push( editable );
			}
		}

	} );
} );