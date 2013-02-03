/* sidebarattributeeditor.js is part of Aloha Editor project http://aloha-editor.org
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
define([ 'jquery', 'block/blockmanager', 'aloha/sidebar', 'block/editormanager', 'util/class'],
	function (jQuery, BlockManager, Sidebar, EditorManager, Class) {
	

	/**
	 * The Sidebar Attribute Editor is the connector which listens on Aloha Blocks and
	 * updates the sidebar accordingly. It builds the editors for the sidebar, initializes
	 * them with initial values and updates the block attributes as soon as a value changes.
	 *
	 * @name block.sidebarattributeeditor
	 * @class Sidebar attribute editor singleton
	 */
	return new (Class.extend(
	/** @lends block.sidebarattributeeditor */
	{

		_sidebar: null,

		/**
		 * Initialize the sidebar attribute editor and bind events
		 */
		init: function() {
			this._sidebar = Sidebar.right.show();

			BlockManager.bind('block-selection-change', this._onBlockSelectionChange, this);
		},

		/**
		 * @param {Array} selectedBlocks
		 */
		_onBlockSelectionChange: function(selectedBlocks) {
			var that = this;
			if (!this._sidebar) {
				return;
			}
			// TODO: Clearing the whole sidebar might not be what we want; instead we might only want
			// to clear certain panels.
			// that._sidebar.container.find('.aloha-sidebar-panels').children().remove();
			// that._sidebar.panels = {};

			jQuery.each(selectedBlocks, function() {
				var schema = this.getSchema(),
					block = this,
					editors = [];

				if (!schema) {
					// If no schema returned, we do not want to add panels.
					return;
				}

				that._sidebar.addPanel({
					title: block.getTitle(),
					expanded: true,
					onInit: function() {
						var $form = jQuery('<form />');
						$form.submit(function() {
							// Disable form submission
							return false;
						});
						jQuery.each(schema, function(attributeName, definition) {
							var editor = EditorManager.createEditor(definition);

							// Editor -> Block binding
							editor.bind('change', function(value) {
								block.attr(attributeName, value);
							});

							// Block -> Editor binding
							block.bind('change', function() {
								editor.setValue(block.attr(attributeName));
							})

							$form.append(editor.render());

							// Set initial value Block -> Editor
							editor.setValue(block.attr(attributeName));

							editors.push(editor);
						});
						this.setContent($form);
					},

					deactivate: function() {
						// On deactivating the panel, we need to tell each editor to deactivate itself,
						// so it can throw another change event if the value has been modified.
						jQuery.each(editors, function(index, editor) {
							editor._deactivate();
						});

						// This code is from the superclass
						this.isActive = false;
						// TODO check if this is needed in current block implementation
						// this.content.parent('li').hide();
						this.effectiveElement = null;
					}
				});
			});
		}
	}))();
});
