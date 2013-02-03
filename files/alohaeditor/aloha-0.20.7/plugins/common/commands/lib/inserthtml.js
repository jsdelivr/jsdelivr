/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

define(
['aloha/core', 'aloha/jquery', 'aloha/command', 'aloha/selection', 'util/dom', 'aloha/contenthandlermanager', 'aloha/console'],
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
