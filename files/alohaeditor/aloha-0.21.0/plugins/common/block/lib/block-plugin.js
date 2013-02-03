/* block-plugin.js is part of Aloha Editor project http://aloha-editor.org
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
 * @name block
 * @namespace Block plugin
 */
define([
    'aloha',
	'aloha/plugin',
	'jquery',
	'aloha/contenthandlermanager',
	'block/blockmanager',
	'block/sidebarattributeeditor',
	'block/block',
	'block/editormanager',
	'block/blockcontenthandler',
	'block/editor',
	'jqueryui'
], function(Aloha, Plugin, jQuery, ContentHandlerManager, BlockManager, SidebarAttributeEditor, block, EditorManager, BlockContentHandler, editor) {
	
	/**
	 * Register the 'block' plugin
	 */
	var BlockPlugin = Plugin.create( 'block', {
		settings: {},
//		dependencies: [ 'paste' ],

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
			EditorManager.register('select', editor.SelectEditor);
			EditorManager.register('button', editor.ButtonEditor);

			// register content handler for block plugin
			ContentHandlerManager.register('block', BlockContentHandler);

			BlockManager.registerEventHandlers();
			BlockManager.initializeBlockLevelDragDrop();

			Aloha.bind('aloha-ready', function() {
				// When Aloha is fully loaded, we initialize the blocks.
				that._createBlocks();
				if (that.settings['sidebarAttributeEditor'] !== false) {
					SidebarAttributeEditor.init();
				}
			});
		},

		/**
		 * Create blocks from default settings
		 */
		_createBlocks: function() {
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
