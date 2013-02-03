/* formatlesshandler.js is part of Aloha Editor project http://aloha-editor.org
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
define(
['aloha', 'jquery', 'aloha/contenthandlermanager'],
function(Aloha, jQuery, ContentHandlerManager) {
	

	var
		GENTICS = window.GENTICS;

	/**
	 * Register the generic content handler
	 */
	var FormatlessPasteHandler = ContentHandlerManager.createHandler({
		
		/**
		 * Enable/Disable formatless pasting option 
		 */
		enabled: false,

		
		/**
		 * Handle the pasting. Remove all unwanted stuff.
		 * @param content
		 */
		handleContent: function( content ) {
			if ( typeof content === 'string' ){
				content = jQuery( '<div>' + content + '</div>' );
			} else if ( content instanceof jQuery ) {
				content = jQuery( '<div>' ).append(content);
			}
			// If we find an aloha-block inside the pasted content,
			// we do not modify the pasted stuff, as it most probably
			// comes from Aloha and not from other sources, and does
			// not need to be cleaned up.
			if ( content.find('.aloha-block').length > 0 ) {
				return;
			};

			if ( this.enabled ) {
				this.removeFormatting( content );
			}
				
			return content.html();
		},

		/**
		 * Remove formatting
		 * @param jqPasteDiv
		 */
		removeFormatting: function( jqPasteDiv ) {
			var formatting_elements = this.strippedElements;
			// find all formattings we will transform
			jqPasteDiv.find( formatting_elements.join(",")).each(function() {
				jQuery(this).contents().unwrap();
			});
		}
  });

	return FormatlessPasteHandler;
});
