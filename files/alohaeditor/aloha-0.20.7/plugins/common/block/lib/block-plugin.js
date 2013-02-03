/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

/**
 * @name block
 * @namespace Block plugin
 */
define([
    'aloha',
	'aloha/plugin',
	'aloha/jquery',
	'aloha/contenthandlermanager',
	'block/blockmanager',
	'block/sidebarattributeeditor',
	'block/block',
	'block/editormanager',
	'block/blockcontenthandler',
	'block/editor',
	'css!block/css/block.css'
], function(Aloha, Plugin, jQuery, ContentHandlerManager, BlockManager, SidebarAttributeEditor, block, EditorManager, BlockContentHandler, editor) {
	

	/**
	 * Register the plugin with unique name
	 */
	var BlockPlugin = Plugin.create( 'block', {
		settings: {},
//		dependencies: [ 'contenthandler' ],

		init: function () {
			var that = this;
			// Register default block types
			BlockManager.registerBlockType('DebugBlock', block.DebugBlock);
			BlockManager.registerBlockType('DefaultBlock', block.DefaultBlock);

			// Register default editors
			EditorManager.register('string', editor.StringEditor);
			EditorManager.register('number', editor.NumberEditor);
			EditorManager.register('url', editor.UrlEditor);
			EditorManager.register('email', editor.EmailEditor);
			
			// register content handler for block plugin
			ContentHandlerManager.register('block', BlockContentHandler);

			BlockManager.registerEventHandlers();

			Aloha.bind('aloha-ready', function() {
				// When Aloha is fully loaded, we initialize the blocks.
				that._createBlocks();
				if (that.settings['sidebarAttributeEditor'] !== false) {
					SidebarAttributeEditor.init();
				}
			});
		},
		_createBlocks: function() {
			var defaultBlockSettings;

			if (!this.settings.defaults) {
				this.settings.defaults = {};
			}
			jQuery.each(this.settings.defaults, function(selector, instanceDefaults) {
				jQuery(selector).alohaBlock(instanceDefaults);
			});
		}
	});

	/**
	 * See (http://jquery.com/).
	 * @name jQuery
	 * @class
	 * See the jQuery Library  (http://jquery.com/) for full details.  This just
	 * documents the function and classes that are added to jQuery by this plug-in.
	 */

	/**
	 * See (http://jquery.com/).
	 * @name jQuery.fn
	 * @class
	 * See the jQuery Library  (http://jquery.com/) for full details.  This just
	 * documents the function and classes that are added to jQuery by this plug-in.
	 */

	/**
	 * Create Aloha blocks from the matched elements
	 * @api
	 * @param {Object} instanceDefaults
	 */
	jQuery.fn.alohaBlock = function(instanceDefaults) {
		instanceDefaults = instanceDefaults || {};
		jQuery(this).each(function(index, element) {
			BlockManager._blockify(element, instanceDefaults);
		});

		// Chain
		return jQuery(this);
	};

	// jQuery.fn.mahaloBlock = TODO
	return BlockPlugin;
});