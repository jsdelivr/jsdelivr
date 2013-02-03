/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

define(['aloha', 'aloha/jquery', 'aloha/floatingmenu', 'aloha/observable', 'aloha/registry'],
function(Aloha, jQuery, FloatingMenu, Observable, Registry) {
	

	var
		GENTICS = window.GENTICS;

	/**
	 * This is the block manager, which is the central entity for maintaining the lifecycle of blocks.
	 *
	 * @name block.blockmanager
	 * @class Block manager singleton
	 */
	var BlockManager = new (Class.extend(Observable,
	/** @lends block.blockmanager */
	{

		/**
		 * @name block.blockmanager#block-selection-change
		 * @event
		 * @param {Array} selectedBlocks Array of AbstractBlock objects, containing selected blocks. The first element in the array is the innermost block, and the other elements are the parent blocks.
		 */

		/**
		 * @name block.blockmanager#block-delete
		 * @event fired directly before a block is deleted
		 * @param {AbstractBlock} the block to be deleted
		 */

		/**
		 * Default settings for blocks
		 */
		defaults: {
			'aloha-block-type': 'DefaultBlock'
		},

		/**
		 * Registry of block types
		 * @type Registry
		 */
		blockTypes: null,

		/**
		 * Registry of blocks
		 * @type Registry
		 */
		blocks: null,

		/**
		 * Array of currently highlighted blocks
		 * @type Array
		 */
		_highlightedBlocks: null,

		/**
		 * Reference to the currently active block, if any
		 * @type AbstractBlock
		 */
		_activeBlock: null,

		/**************************
		 * SECTION: Initialization
		 **************************/
		/**
		 * Constructor. called immediately.
		 *
		 * @constructor
		 */
		_constructor: function() {
			FloatingMenu.createScope('Aloha.Block');
			this.blockTypes = new Registry();
			this.blocks = new Registry();
			this._highlightedBlocks = {};
		},

		/**
		 * Register initial event handlers. Called from block-plugin when plugin
		 * is loaded.
		 *
		 * @private
		 */
		registerEventHandlers: function() {
			var that = this;
			this._registerEventHandlersForDeactivatingAlohaBlock();
			this._registerEventHandlersForDeterminingCurrentlyActiveBlock();
			this._registerEventHandlersForBlockDeletion();
			this._registerEventHandlersForCutCopyPaste();

			// TODO: not sure if we still need the code below. it is somehow related to caret handling
			Aloha.bind('aloha-selection-changed', function(evt, selection, originalEvent) {
				// the following line is needed to de-select blocks when navigating over them using the mouse cursors.
				// We only want to execute it though, if we are not inside a block, as it would otherwise
				// directly deselect the block we just selected. This is just a hotfix and not the final solution yet.
				if (selection && jQuery(selection.getCommonAncestorContainer()).parents('.aloha-block').length > 0) {
					return;
				}
				that._deactivateHighlightedBlocks();
			});
		},

		/**
		 * Register the event handlers which deactivate aloha blocks when the user clicks outside a block
		 */
		_registerEventHandlersForDeactivatingAlohaBlock: function() {
			var that = this;

			jQuery(document).bind('click', function(event) {
				if (that._highlightedBlocks == {}) return;
				if (jQuery(event.target).closest('.aloha-sidebar-bar, .aloha-block-do-not-deactivate, .aloha-floatingmenu, .aloha-block').length > 0) {
					// If we are inside the sidebar, the floating menu or other elements which should not trigger the block deactivation, we do an early return.
					return;
				}
				that._deactivateHighlightedBlocks();
			});
		},

		/**
		 * Register the event handler which listens to block-selection-change, and
		 * sets _activeBlock accordingly.
		 */
		_registerEventHandlersForDeterminingCurrentlyActiveBlock: function() {
			var that = this;
			this.bind('block-selection-change', function(highlightedBlocks) {
				if (highlightedBlocks.length > 0) {
					that._activeBlock = highlightedBlocks[0];
				} else {
					that._activeBlock = null;
				}
			});
		},

		/**
		 * Implementation of block deletions, both when the block is the only selected element,
		 * and when the block is part of a bigger selection which should be deleted.
		 */
		_registerEventHandlersForBlockDeletion: function() {
			var that = this;

			// This case executes in:
			// - Chrome
			// - Firefox
			// - IE9
			// - IE7+8 for inline blocks and for block-level blocks which are part of a bigger selection
			// it does NOT execute in the following cases:
			// - IE7+8 for block-level blocks which are NOT part of a bigger selection. This case is handled separately below.
			Aloha.bind('aloha-command-will-execute', function(e, data) {
				var commandId = data.commandId;

				// Internet Explorer *magically* sets the range to the "Body" object after deselecting everything. yeah :-D
				var onlyBlockSelected = (Aloha.getSelection().getRangeCount() === 0) // Firefox / Chrome
					|| (Aloha.getSelection().getRangeCount() === 1 && Aloha.getSelection().getRangeAt(0).endContainer === Aloha.getSelection().getRangeAt(0).startContainer && Aloha.getSelection().getRangeAt(0).endContainer === jQuery('body')[0]) // Internet explorer: Inline Elements
					|| (Aloha.getSelection().getRangeCount() === 1 && Aloha.getSelection().getRangeAt(0).endContainer === Aloha.getSelection().getRangeAt(0).startContainer && Aloha.getSelection().getRangeAt(0).startOffset + 1 === Aloha.getSelection().getRangeAt(0).endOffset); // Internet explorer: Block level elements

				if (that._activeBlock && (commandId === 'delete' || commandId === 'forwarddelete') && onlyBlockSelected) {
					// Deletion when a block is currently selected

					// In this case, the default command shall not be executed.
					data.preventDefault = true;
					that._activeBlock.destroy();
				} else if (!that._activeBlock && (commandId === 'delete' || commandId === 'forwarddelete') && Aloha.getSelection().getRangeCount() === 1 && Aloha.getSelection().getRangeAt(0).collapsed === false) {
					// Deletion when a block is inside a bigger selection currently
					// In this case, we check if we find an aloha-block. If yes, we delete it right away as the browser does not delete it correctly by default
					var traverseSelectionTree;
					traverseSelectionTree = function(selectionTree) {
						var el;
						for (var i=0, l=selectionTree.length; i<l; i++) {
							el = selectionTree[i];
							if (el.domobj.nodeType === 1) { // DOM node
								var $el = jQuery(el.domobj);
								if (el.selection === 'full' && $el.is('.aloha-block')) {
									$el.remove();
								} else {
									traverseSelectionTree(el.children);
								}
							}
						}
					};
					traverseSelectionTree(Aloha.Selection.getSelectionTree());
				}
			});

			// - IE7/8 Workaround
			// - deletion of blocks inside block collection
			jQuery(window.document).keydown(function(e) {

				// Pressing DEL or BACKSPACE in a sidebar attribute editor form input
				// causes the destruction of the block;
				// if the keypress comes from a form element do nothing
				if ( typeof e.srcElement !== 'undefined' && typeof e.srcElement.form !== 'undefined' ) {
					return true;
				}

				// If a block is active AND DEL or BACKSPACE key pressed, AND we are not inside a nested editable (FIX for IE7/8)
				if (that._activeBlock && (e.which === 46 || e.which === 8) && that._activeBlock._isInsideNestedEditable === false) {
					// ...and active block is INSIDE editable

					// BROWSER QUIRK WORKAROUND
					// - IE7+IE8 for block-level blocks which are NOT part of a bigger selection.
					// TODO as we're going to remove Ext this browser checks should be made with jQuery
					if ((Ext.isIE8 || Ext.isIE7) && that._activeBlock.$element.parents('.aloha-editable,.aloha-block').first().hasClass('aloha-editable')) {
						that._activeBlock.destroy();
						e.preventDefault();
						return false;
					} else if(that._activeBlock.shouldDestroy()) {
						// .. in this case, the block should be destroyed because it
						// is part of a block collection.

						that._activeBlock.destroy();
						e.preventDefault();
						return false;
					}
				}
			});
		},

		/**
		 * Implementation of cut/copy; selecting the currently active block.
		 *
		 * When pasting, the blockcontenthandler is triggered. This takes care of the pasting process.
		 */
		_registerEventHandlersForCutCopyPaste: function() {
			var that = this,
				currentlyCopying = false,
				currentlyCutting = false,
				selectionBeforeCopying = null;

			jQuery(window.document).keydown(function(e) {
				// IF: Ctrl/Command C pressed -- COPY
				if (that._activeBlock && (e.ctrlKey || e.metaKey) && e.which === 67) {
					currentlyCopying = true;
					//selectionBeforeCopying = new GENTICS.Utils.RangeObject(true);
					that._activeBlock.$element.attr('data-aloha-block-copy-only-block', 'true');
					GENTICS.Utils.Dom.selectDomNode(that._activeBlock.$element[0]);
				}

				// IF: Ctrl/Command X pressed -- CUT
				if (that._activeBlock && (e.ctrlKey || e.metaKey) && e.which === 88) {
					currentlyCutting = true;
					//selectionBeforeCopying = new GENTICS.Utils.RangeObject(true);
					that._activeBlock.$element.attr('data-aloha-block-copy-only-block', 'true');
					GENTICS.Utils.Dom.selectDomNode(that._activeBlock.$element[0]);
				}
			});
			jQuery(window.document).keyup(function(e) {
				// IF: Release of ctrl / command C
				if (!currentlyCutting && currentlyCopying && (e.which === 67 || e.which === 18 || e.which === 91)) {
					currentlyCopying = false;
					that._activeBlock.$element.removeAttr('data-aloha-block-copy-only-block');
					if (selectionBeforeCopying) {
						//selectionBeforeCopying.select();
						selectionBeforeCopying = null;
					}
				}
				// IF: Release of ctrl / command X
				if (currentlyCutting  && (e.which === 67 || e.which === 18 || e.which === 88)) {
					currentlyCutting = false;
				}
			});
		},

		/**
		 * Initialize Block Level Drag/Drop for all editables. We need to do this
		 * inside the Block Manager, as we want all editables to become possible
		 * drop targets for block-level aloha blocks.
		 */
		initializeBlockLevelDragDrop: function() {
			var that = this;
			jQuery.each(Aloha.editables, function(i, editable) {
				that.createBlockLevelSortableForEditableOrBlockCollection(editable.obj);
			});
			Aloha.bind('aloha-editable-created', function(e, editable) {
				that.createBlockLevelSortableForEditableOrBlockCollection(editable.obj);
			});
		},

		/**
		 * We make editables or block collections sortable using jQuery UI here, if we
		 * did not do this before.
		 *
		 * This is an internal method a user should never call!
		 */
		createBlockLevelSortableForEditableOrBlockCollection: function($editableOrBlockCollection) {
			if (!$editableOrBlockCollection.hasClass('aloha-block-blocklevel-sortable')) {

				// We only want to make "block-level" aloha blocks sortable. According to the docs,
				// sortable.cancel should have a CSS selector and if this matches, the element is only
				// a drop target but NOT draggable. However, passing :not(.aloha-block) does not work somehow :-(
				//
				// Thus, we implemented the following alternative:
				// Every "block-level" aloha block drag handle gets a new CSS class, and we only select this as
				// drag handle. As only "block-level" aloha blocks have this CSS class, this will also only make
				// aloha blocks draggable.
				$editableOrBlockCollection.addClass('aloha-block-blocklevel-sortable').sortable({
					revert: 100,
					handle: '.aloha-block-draghandle-blocklevel',
					connectWith: '.aloha-block-blocklevel-sortable' // we want to be able to drag an element to other editables
				});


				// Hack for Internet Explorer 8:
				// If you first click inside an editable, and THEN want to drag a block-level block,
				// it sometimes occurs that the *whole editable* is selected and should be dragged away.
				// This breaks dragging of Aloha Blocks.
				// Bugfix: We disable the "ondragstart" event on every editable.
				// However, as the "ondragstart" is also fired when a nested (inline) editable is moved using drag/drop,
				// we need to allow this case.
				$editableOrBlockCollection.get(0).ondragstart = function (e, ui) {
					if (!ui || !ui.helper || !ui.helper.is('.aloha-block')) {
						// You tried to move something else than an aloha block
						return false;
					}
				};
			}
		},

		/**************************
		 * SECTION: Blockify / Block Access
		 **************************/

		/**
		 * Register the given block type
		 *
		 * @param {String} Identifier
		 * @param {Class} A class that extends block.block.AbstractBlock
		 * @api
		 */
		registerBlockType: function(identifier, blockType) {
			FloatingMenu.createScope('Aloha.Block.' + identifier, 'Aloha.Block');
			this.blockTypes.register(identifier, blockType);
		},

		/**
		 * Blockify a given element with the instance defaults
		 * Directly called when one does jQuery.alohaBlock(instanceDefaults)
		 *
		 * @private
		 */
		_blockify: function(element, instanceDefaults) {
			var attributes, block, $element;
			$element = jQuery(element);

			var tagName = $element[0].tagName.toLowerCase();
			if (tagName !== 'span' && tagName !== 'div') {
				Aloha.Log.error('block/blockmanager', 'Blocks can only be created from <div> or <span> element. You passed ' + tagName + '.');
				return;
			}

			// TODO: check if object is already Block-ified

			attributes = this.getConfig($element, instanceDefaults);

			if (!this.blockTypes.has(attributes['aloha-block-type'])) {
				Aloha.Log.error('block/blockmanager', 'Block Type ' + attributes['aloha-block-type'] + ' not found!');
				return;
			}

			block = new (this.blockTypes.get(attributes['aloha-block-type']))($element);
			block.$element.addClass('aloha-block-' + attributes['aloha-block-type']);
			jQuery.each(attributes, function(k, v) {
				// We use the private API here, as we need to be able to set internal properties as well, and we do not want to trigger renering.
				block._setAttribute(k, v);
			});


			// Register block
			this.blocks.register(block.getId(), block);
		},

		/**
		 * Merges the config from different places, and return the merged config.
		 *
		 * @private
		 */
		getConfig: function(blockElement, instanceDefaults) {
			return jQuery.extend(
				{},
				this.defaults,
				instanceDefaults,
				blockElement.data()
			);
		},

		/**
		 * Get a Block instance by id or DOM node. The DOM node can be either
		 * the DOM node of the wrapping element ($_element), the jQuery object of it,
		 * or the ID string.
		 *
		 * @param {String|DOMNode} idOrDomNode
		 * @return {block.block.AbstractBlock} Block instance
		 * @api
		 */
		getBlock: function(idOrDomNode) {
			var id, domNode;
			if (typeof idOrDomNode === 'object') {
				domNode = jQuery(idOrDomNode);
				if (domNode.hasClass('aloha-block-inner')) {
					// We are at the inner block wrapper, so we have to go up one level,
					// to find the block itself
					domNode = domNode.parent();
				}
				id = domNode.attr('id');
			} else {
				id = idOrDomNode;
			}

			return this.blocks.get(id);
		},

		/**
		 * Unregister (e.g. remove) the given block. Do not call directly,
		 * instead use .destroy() on the block.
		 *
		 * @param {Object|String} blockOrBlockId Block or block id
		 */
		_unregisterBlock: function(blockOrBlockId) {
			var id;
			if (typeof blockOrBlockId === 'object') {
				id = blockOrBlockId.getId();
			} else {
				id = blockOrBlockId;
			}
			this.blocks.unregister(blockOrBlockId);
		},


		/**************************
		 * Internal helpers
		 **************************/

		/**
		 * Deactivate all highlighted blocks
		 *
		 * @private
		 */
		_deactivateHighlightedBlocks: function() {
			jQuery.each(jQuery.extend({}, this._highlightedBlocks), function(id) {
				var block = BlockManager.getBlock(id);
				if (block) {
					block.deactivate();
				}
			});
		},

		/**
		 * Get all highlighted blocks indexed by block id
		 *
		 * @return {Object}
		 */
		_getHighlightedBlocks: function() {
			var _highlightedBlocks = {};
			jQuery.each(this.blocks.getEntries(), function(blockId, block) {
				if (block.isActive()) {
					_highlightedBlocks[blockId] = block;
				}
			});
			return _highlightedBlocks;
		},

		_setHighlighted: function(block) {
			this._highlightedBlocks[block.id] = true;
		},

		_setUnhighlighted: function(block) {
			delete this._highlightedBlocks[block.id];
		}
	}))();

	Aloha.Block = Aloha.Block || {};
	Aloha.Block.BlockManager = BlockManager;

	return BlockManager;
});
