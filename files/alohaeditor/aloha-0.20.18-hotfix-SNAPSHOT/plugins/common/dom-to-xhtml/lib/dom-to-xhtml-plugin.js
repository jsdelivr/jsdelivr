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
			var that = this;
			Aloha.Editable.setContentSerializer( function(editableElement) {
				if ( !that.settings.editables && !that.settings.config ) {
					return domToXhtml.contentsToXhtml(editableElement);
				}

				if ( that.settings.editables &&
					that.settings.editables['#'+$(editableElement).attr("id")] == 'dom-to-xhtml' ) {
					return domToXhtml.contentsToXhtml(editableElement);
				} else if ( that.settings.config &&
					that.settings.config == 'dom-to-xhtml' &&
					!that.settings.editables['#'+$(editableElement).attr("id")] ) {
					return domToXhtml.contentsToXhtml(editableElement);
				} else {
					return $(editableElement).html();
				}
			});
		}
	});
});
