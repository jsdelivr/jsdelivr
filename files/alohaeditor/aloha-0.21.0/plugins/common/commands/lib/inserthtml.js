/* inserthtml.js is part of Aloha Editor project http://aloha-editor.org
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
['aloha/core', 'jquery', 'aloha/command', 'aloha/selection', 'util/dom', 'aloha/contenthandlermanager', 'aloha/console'],
function(Aloha, jQuery, command, selection, dom, ContentHandlerManager, console) {
	

	// Exported commands
	command.register( 'inserthtml', {
		action: function(value, range) {
			var 
				$editable = jQuery(dom.getEditingHostOf(range.startContainer)),
				cac = range.commonAncestorContainer,
				i,
				selectedRange,
				domNodes = [];
			
			/**
			 * Paste the given object into the current selection.
			 * If inserting fails (because the object is not allowed to be inserted), unwrap the contents and try with that.
			 * @param object object to be pasted
			 */
			function pasteElement(object) {
				var $object = jQuery(object),
					contents;

				// try to insert the element into the DOM with limit the editable host
				// this fails when an element is not allowed to be inserted
				if (!dom.insertIntoDOM($object, range, $editable, false)) {
					
					// if that is not possible, we unwrap the content and insert every child element
					 contents = $object.contents();

					// when a block level element was unwrapped, we at least insert a break
					if (dom.isBlockLevelElement(object) || dom.isListElement(object)) {
						pasteElement(jQuery('<br/>').get(0));
					}

					// and now all children (starting from the back)
					for ( i = contents.length - 1; i >= 0; --i) {
						pasteElement(contents[i]);
					}
				}
			};

			// apply content handler to cleanup inserted data
			//if (typeof Aloha.settings.contentHandler.insertHtml === 'undefined') {
			// just use all registerd content handler or specity Aloha.defaults.contentHandler.insertHtml manually?
			//	Aloha.settings.contentHandler.insertHtml = Aloha.defaults.contentHandler.insertHtml;
			//}
			value = ContentHandlerManager.handleContent( value, { contenthandler: Aloha.settings.contentHandler.insertHtml } );

			// allowed values are string or jQuery objects
			// add value to a container div
			if ( typeof value === 'string' ){
				value = jQuery( '<div>' + value + '</div>' );
			} else if ( value instanceof jQuery ) {
				value = jQuery( '<div>' ).append(value);
			} else {
				throw "INVALID_VALUE_ERR";
			}
			
			// get contents of container div
			domNodes = value.contents();
			
			// check if range starts an ends in same editable host
//			if ( !(dom.inSameEditingHost(range.startContainer, range.endContainer)) ) {
//				throw "INVALID_RANGE_ERR";
//			}
			
			// delete currently selected contents
			dom.removeRange(range);
			
			for ( i = domNodes.length - 1; i >= 0; --i) {
				// insert the elements
				pasteElement(domNodes[i]);
			}

			// Call collapse() on the context object's Selection,
			// with last child's parent as the first argument and one plus its index as the second.
			if (domNodes.length > 0) {
				range = dom.setCursorAfter(domNodes.get(domNodes.length - 1));
			} else {
				// if nothing was pasted, just reselect the old range
				range.select();
			}

			dom.doCleanup({merge:true, removeempty: true}, range, cac);
			//In some cases selecting the range does not work properly 
			//e.g. when pasting from word in an h2 after the first character in IE
			//in these cases we should fail gracefully.
			//TODO check why the selection is failing
			try {
				range.select();
			} catch (e) {
				console.warn('Error:',e);
			}

		}
	});

});
