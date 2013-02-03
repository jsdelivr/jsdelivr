/*!
 * Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

define([ 'aloha/jquery', 'block/blockmanager', 'aloha/sidebar', 'block/editormanager'],
	function (jQuery, BlockManager, Sidebar, EditorManager) {
	

	/**
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
			var that = this;
			
			//Obsolete: that._initSidebar();
			this._sidebar = Sidebar.right.show();
			
			BlockManager.bind('block-selection-change', this._onBlockSelectionChange, this);
		},
		
		/* Obsolete:
			We no longer need to initialize our own sidebar.
			We will use those that are provided to use by Aloha
				
		_initSidebar: function() {
			return;
			this._sidebar = new Sidebar({
				position: 'right',
				width: 250,
				isOpen: true,
				panels: []
			});
		},
		 */

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
			that._sidebar.container.find('.aloha-sidebar-panels').children().remove();
			that._sidebar.panels = {};

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
						// so it can throw another change event.
						jQuery.each(editors, function(index, editor) {
							editor._deactivate();
						});

						// This code is from the superclass
						this.isActive = false;
						this.content.parent('li').hide();
						this.effectiveElement = null;
					}
				});
			});
		}
	}))();
});
