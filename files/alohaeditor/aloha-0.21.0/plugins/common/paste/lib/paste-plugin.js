/* paste-plugin.js is part of Aloha Editor project http://aloha-editor.org
 *
 * Aloha Editor is a WYSIWYG HTML5 inline editing library and editor. 
 * Copyright (c) 2010-2012 Gentics Software GmbH, Vienna, Austria.
 * Contributors http://aloha-editor.org/contribution.php 
 * 
 * Aloha Editor is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or any later version.
 *
 * Aloha Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * 
 * As an additional permission to the GNU GPL version 2, you may distribute
 * non-source (e.g., minimized or compacted) forms of the Aloha-Editor
 * source code without the copy of the GNU GPL normally required,
 * provided you include this license notice and a URL through which
 * recipients can access the Corresponding Source.
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
[ 'aloha/core', 'aloha/plugin', 'jquery', 'aloha/command',
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

		// set the cursor into the paste div
		Aloha.getSelection().removeAllRanges();
		var newRange = Aloha.createRange();
		newRange.setStart($pasteDiv.get( 0 ), 0);
		newRange.setEnd($pasteDiv.get( 0 ), 0);
		Aloha.getSelection().addRange(newRange);

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
			// set the focus back into the editable,
			// and select the former range
			pasteEditable.obj.focus();
			Aloha.getSelection().removeAllRanges();
			var newRange = Aloha.createRange();
			newRange.setStart(pasteRange.startContainer, pasteRange.startOffset);
			newRange.setEnd(pasteRange.endContainer, pasteRange.endOffset);
			Aloha.getSelection().addRange(newRange);

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
				Aloha.execCommand( 'insertHTML', false, pasteDivContents );
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

					// NOTE: this hack is currently always used, because the other method would somehow
					// lead to incorrect cursor positions after pasting
					if ( that.settings.noclipboardaccess || true ) {
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
			if ( jQuery.browser.msie && (that.settings.noclipboardaccess || true) ) {
				$pasteDiv.bind( 'paste', function ( event ) {
					window.setTimeout( function () {
						getPastedContent();
						Aloha.activeEditable.smartContentChange( event );
					}, 10 );
					event.stopPropagation();
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
