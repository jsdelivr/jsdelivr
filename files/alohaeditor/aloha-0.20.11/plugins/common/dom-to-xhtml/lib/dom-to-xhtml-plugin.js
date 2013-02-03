/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
/**
 * The dom-to-xhtml plugin extends the serialization method of the
 * Aloha.Editable.getContent() instance method to generate valid XHTML
 * (in so far as the DOM of the editables itself is valid).
 */
define(
['aloha', 'aloha/jquery', 'aloha/plugin', 'dom-to-xhtml/dom-to-xhtml'],
function( Aloha, $, Plugin, domToXhtml) {
	

	return Plugin.create('dom-to-xhtml', {
		/**
		 * Called by the plugin-manager on intialization.
		 *
		 * @Override
		 */
		init: function () {
			Aloha.Editable.setContentSerializer(function(editableElement){
				return domToXhtml.contentsToXhtml(editableElement);
			});
		}
	});
});
