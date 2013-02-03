/*global define: true */
/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

/**
 * @name contenthandler
 * @namespace Content handler plugin
 */
define([
	'aloha',
	'aloha/plugin',
	'jquery',
	'aloha/contenthandlermanager',
	'contenthandler/wordcontenthandler',
	'contenthandler/genericcontenthandler',
	'contenthandler/oembedcontenthandler',
	'contenthandler/sanitizecontenthandler',
	'contenthandler/blockelementcontenthandler'
], function (Aloha,
			 Plugin,
			 jQuery,
			 ContentHandlerManager,
			 WordContentHandler,
			 GenericContentHandler, 
			 OembedContentHandler,
			 SanitizeContentHandler,
			 BlockelementContentHandler) {
	

	/**
	 * Register the plugin with unique name
	 */
	var ContentHandlerPlugin = Plugin.create('contenthandler', {
		settings : {},
		dependencies : [],
		init : function () {
			var contentHandlers = {
					'word': WordContentHandler,
					'generic': GenericContentHandler,
					'sanitize': SanitizeContentHandler,
					'blockelement': BlockelementContentHandler
					//  'oembed' deactivated
				},
				handlerName;

			// Register available content handler
			for (handlerName in contentHandlers) {
				if (contentHandlers.hasOwnProperty(handlerName)) {
					ContentHandlerManager.register(handlerName, contentHandlers[handlerName]);
				}
			}
		}
	});

	return ContentHandlerPlugin;
});