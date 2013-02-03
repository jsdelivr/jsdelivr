/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

/**
 * Paste Plugin
 * ------------
 * The paste plugin intercepts all browser paste events that target aloha-
 * editables, and redirects the events into a hidden div. Once pasting is done
 * into this div, its contents will be processed by registered content handlers
 * before being copied into the active editable, at the current range.
 */

define(
[ 'aloha/core', 'aloha/plugin', 'aloha/jquery', 'aloha/command',
  'aloha/console' ],
function ( Aloha, Plugin, jQuery, Commands, console ) {
	
	
	var GENTICS = window.GENTICS,
	    $window = jQuery( window ),
	    pasteRange = null,
	    pasteEditable = null;
	
	// We need to hide the editable div. We'll use clip:rect for chrome and IE,
	// and width/height for FF
	var $pasteDiv = jQuery( '<div id="pasteContainer" ' +
			'style="position:absolute; clip:rect(0px, 0px, 0px, 0px); ' +
			'width: 1px; height: 1px;"></div>' ).contentEditable( true );
	
	/**
	 * Redirects the paste event into the hidden pasteDiv
	 */
	function redirectPaste () {
		// store the current range
		pasteRange = Aloha.getSelection().getRangeAt( 0 );
		pasteEditable = Aloha.activeEditable;
		
		// store the current scroll position
		$pasteDiv.css( {
			top: $window.scrollTop(),
			left: $window.scrollLeft() - 200
		} );
		
		// empty the pasteDiv
		$pasteDiv.contents().remove();
		
		if ( pasteEditable ) {
			// TODO test in IE!
			pasteEditable.obj.blur();
		}
		
		GENTICS.Utils.Dom.setCursorInto( $pasteDiv.get( 0 ) );
		
		$pasteDiv.focus();
	};

	/**
	 * Gets the pasted content and inserts them into the current active
	 * editable
	 */
	function getPastedContent () {
		var that = this,
		    pasteDivContents;
		
		// insert the content into the editable at the current range
		if ( pasteRange && pasteEditable ) {
			// activate and focus the editable
			// @todo test in IE
			//pasteEditable.activate();
			pasteEditable.obj.click();
			
			pasteDivContents = $pasteDiv.html();
			
			// We need to remove an insidious nbsp that IE inserted into our
			// paste div, otherwise it will result in an empty paragraph being
			// created right before the pasted content, if the pasted content
			// is a paragraph
			if ( jQuery.browser.msie &&
					/^&nbsp;/.test( pasteDivContents ) ) {
				pasteDivContents = pasteDivContents.substring( 6 );
			}
			
			// Detects a situation where we are about to paste into a selection
			// that looks like this: <p> [</p>...
			// The nbsp inside the <p> node was placed there to make the empty
			// paragraph visible in HTML5 conformant rendering engines, like
			// WebKit. Without the white space, such browsers would correctly
			// render an empty <p> as invisible.
			// Note that we do not "prop up" otherwise empty paragraph nodes
			// using a <br />, as WebKit does, because IE does display empty
			// paragraphs which are content-editable and so a <br /> results in
			// 2 lines instead of 1 being shown inside the paragraph.
			// If we detect this situation, we remove the white space so that
			// when we paste a new paragraph into the paragraph, it is not be
			// split, leaving an empty paragraph on top of the pasted content
			// 
			// We use "/^(\s|%A0)$/.test( escape(" instead of
			// "/^(\s|&nbsp;)$/.test( escape(" because it seems that IE
			// transforms non-breaking spaces into atomic tokens
			var startContainer = pasteRange.startContainer;
			if ( startContainer.nodeType == 3 &&
					startContainer.parentNode.nodeName == 'P' &&
						startContainer.parentNode.childNodes.length == 1 &&
							/^(\s|%A0)$/.test( escape( startContainer.data ) ) ) {
				startContainer.data = '';
				pasteRange.startOffset = 0;
				
				// In case ... <p> []</p>
				if ( pasteRange.endContainer == startContainer ) {
					pasteRange.endOffset = 0;
				}
			}
			
			if ( Aloha.queryCommandSupported( 'insertHTML' ) ) {
				Aloha.execCommand( 'insertHTML', false, pasteDivContents,
					pasteRange );
			} else {
				console.error( 'Common.Paste', 'Command "insertHTML" not ' +
					'available. Enable the plugin "common/commands".' );
			}
		}
		
		pasteRange = void 0;
		pasteEditable = void 0;
		
		$pasteDiv.contents().remove();
	};

	// Public Methods
	return Plugin.create( 'paste', {
		
		settings: {},
		
		init: function () {
			var that = this;
			
			jQuery( 'body' ).append( $pasteDiv );
			
			// subscribe to the event aloha-editable-created to redirect paste events
			// into our hidden pasteDiv
			// TODO: move to paste command
			// http://support.mozilla.com/en-US/kb/Granting%20JavaScript%20access%20to%20the%20clipboard
			// https://code.google.com/p/zeroclipboard/
			Aloha.bind( 'aloha-editable-created', function ( event, editable ) {
				// browser-dependent events
				if ( jQuery.browser.msie ) {
					// We will only us the ugly beforepaste hack if we shall
					// not access the clipboard
					if ( that.settings.noclipboardaccess ) {
						editable.obj.bind( 'beforepaste', function ( event ) {
							redirectPaste();
							event.stopPropagation();
						} );
					} else {
						// uses the execCommand for IE
						editable.obj.bind( 'paste', function ( event ) {
							redirectPaste();
							
							var range = document.selection.createRange();
							range.execCommand( 'paste' );
							
							getPastedContent();
							// We manually unset the metaKey property because
							// the smartContentChange method will not process
							// this event if the metaKey property is set
							event.metaKey = void 0;
							
							Aloha.activeEditable.smartContentChange( event );
							event.stopPropagation();
							
							return false;
						} );
					}
				} else {
					editable.obj.bind( 'paste', function ( event ) {
						redirectPaste();
						// We need to accomodate a small amount execution
						// window to ensure that pasted content has actually
						// been inserted
						window.setTimeout( function () {
							getPastedContent();
							Aloha.activeEditable.smartContentChange( event );
						}, 10 );
						
						event.stopPropagation();
					} );
				}
			} );

			// bind a handler to the paste event of the pasteDiv to get the
			// pasted content (but do this only once, not for every editable)
			if ( jQuery.browser.msie && that.settings.noclipboardaccess ) {
				$pasteDiv.bind( 'paste', function ( event ) {
					window.setTimeout( function () {
						getPastedContent();
						Aloha.activeEditable.smartContentChange( event );
						event.stopPropagation();
					}, 10 );
				} );
			}
		},

		/**
		 * Register the given paste handler
		 * @deprecated
		 * @param pasteHandler paste handler to be registered
		 */
		register: function ( pasteHandler ) {
			console.deprecated( 'Plugins.Paste', 'register() for ' +
				'pasteHandler is deprecated. Use the ContentHandler Plugin ' +
				'instead.' );
		}
		
	} );
	
} );
