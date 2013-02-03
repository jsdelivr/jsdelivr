/*!
 * Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */

/**
 * @name block.block
 * @namespace Block models
 */
define(['aloha', 'aloha/jquery', 'block/blockmanager', 'aloha/observable', 'aloha/floatingmenu'],
function(Aloha, jQuery, BlockManager, Observable, FloatingMenu) {
	

	/**
	 * @name block.block.AbstractBlock
	 * @class An abstract block that must be used as a base class for custom blocks
	 */
	var AbstractBlock = Class.extend(Observable,
	/** @lends block.block.AbstractBlock */
	{

		/**
		 * @name block.block.AbstractBlock#change
		 * @event
		 */

		/**
		 * Title for the block, used to display the name in the sidebar.
		 * @type String
		 * @api
		 */
		title: null,

		/**
		 * Id of the assigned element, used to identify a block
		 * @type String
		 */
		id: null,

		/**
		 * The wrapper element around the inner element
		 * @type jQuery
		 */
		// TODO: Rename to $element
		element: null,

		/**
		 * The inner element which is containing the actual user-provided content
		 * @type jQuery
		 */
		$innerElement: null,

		/**
		 * Either "inline" or "block", will be guessed from the original block dom element
		 * @type String
		 */
		_domElementType: null,

		/**
		 * if TRUE, the rendering is currently taking place. Used to prevent recursion
		 * errors.
		 * @type Boolean
		 */
		_currentlyRendering: false,

		/**
		 * set to TRUE once the block is fully initialized and should be rendered.
		 *
		 * @type Boolean
		 */
		_initialized: false,

		/**
		 * @param {jQuery} $innerElement Element that declares the block
		 * @constructor
		 */
		_constructor: function($innerElement) {
			var that = this;
			this.id = GENTICS.Utils.guid();

			this.$innerElement = $innerElement;

			this._domElementType = GENTICS.Utils.Dom.isBlockLevelElement($innerElement[0]) ? 'block' : 'inline';
			$innerElement.wrap('<' + this._getWrapperElementType() + ' />');
			this.element = $innerElement.parent();
			this.element.contentEditable(false);

			this.element.attr('id', this.id);

			this.element.addClass('aloha-block');
			$innerElement.addClass('aloha-block-inner');

			// Register event handlers for activating an Aloha Block
			this.element.bind('click', function(event) {
				that.activate(event.target);
				return false;
			});

			Aloha.bind('aloha-block-selected', function(event,obj) {
				if (that.element.get(0) === obj) {
					that.activate();
				}
			});

			// We need to tell Aloha that we handle the event already;
			// else a selection of block contents will *not* select
			// the block.
			this.element.bind('mousedown', function() {
				Aloha.eventHandled = true;
			}).bind('focus', function() {
				Aloha.eventHandled = true;
			}).bind('dblclick', function() {
				Aloha.eventHandled = true;
			});
			this.init();

			this._registerAsBlockified();
		},

		serialize: function() {
			// TODO: use ALL attributes, not just data-....
			return {
				tag: this.element[0].tagName,
				attributes: this._getAttributes(), // contains data-properties AND about
				classes: this.$innerElement.attr('class') // TODO: filter out aloha-block-active...
			}
		},

		_registerAsBlockified: function() {
			this._initialized = true;
			this.element.trigger('block-initialized');
		},

		/**
		 * Template method to initialize the block
		 * @api
		 */
		init: function() {},

		/**
		 * Get a schema of attributes with
		 *
		 * TODO Document schema format
		 *
		 * @api
		 * @returns {Object}
		 */
		getSchema: function() {
			return null;
		},

		/**
		 * Template Method which should return the block title
		 */
		getTitle: function() {
			return this.title;
		},

		/**
		 * activates the block
		 * will select the block's contents, highlight it, update the floating menu and update the sidebar (if needed)
		 * @param {DOMNode} clickedDomNode The DOM node which has been clicked. Should only be set INTERNALLY, if you call activate() programmatically, DO NOT SET THIS PARAM! We need the DOM node to see whether we clicked inside an embedded editable or not.
		 * @api
		 */
		activate: function(clickedDomNode) {
			var previouslyActiveBlocks = BlockManager.getActiveBlocks(),
				activeBlocks = [];

			delete previouslyActiveBlocks[this.id];

			this._selectBlock(clickedDomNode);

			// Set scope to current block
			FloatingMenu.setScope('Aloha.Block.' + this.attr('block-type'));

			this._highlight();
			activeBlocks.push(this);

			this.element.parents('.aloha-block').each(function() {
				var block = BlockManager.getBlock(this);
				delete previouslyActiveBlocks[block.id];

				block._highlight();
				activeBlocks.push(block);
			});
			jQuery.each(previouslyActiveBlocks, function() {
				this.deactivate();
			});

			BlockManager.trigger('block-selection-change', activeBlocks);

			return false;
		},

		/**
		 * Destroy this block instance completely. Removes the element from the DOM,
		 * unregisters it, and triggers a delete event on the BlockManager.
		 *
		 * @return
		 * @api
		 */
		destroy: function() {
			var that = this;
			BlockManager.trigger('block-delete', this);
			BlockManager._unregisterBlock(this);

			this.unbindAll();

			this.element.fadeOut('fast', function() {
				that.element.remove();
				BlockManager.trigger('block-selection-change', []);
			});
		},

		/**
		 * Activated when the block is clicked
		 */
		_highlight: function() {
			BlockManager._setActive(this);
			this.element.addClass('aloha-block-active');
		},


		_unhighlight: function() {
			BlockManager._setInactive(this);
			this.element.removeClass('aloha-block-active');
		},

		_selectBlock: function(domNode) {
			if (!domNode || jQuery(domNode).is('.aloha-editable') || jQuery(domNode).parents('.aloha-block, .aloha-editable').first().is('.aloha-editable')) {
				// It was clicked on a Aloha-Editable inside a block; so we do not
				// want to select the whole block and do an early return.
				return;
			}

			if (this.element.parents('.aloha-editable').length == 0) {
				// If the block is not inside an editable, there is no need to select it (as it gets highlighted in an ugly way then)
				return;
			}

			GENTICS.Utils.Dom.selectDomNode(this.element[0]);
		},

		/**
		 * Deactive the block
		 */
		deactivate: function() {
			var that = this;
			this._unhighlight();
			this.element.parents('.aloha-block').each(function() {
				that._unhighlight();
			});
			BlockManager.trigger('block-selection-change', []);
			// TODO: remove the current selection here
		},

		/**
		 * @returns {Boolean} True if this block is active
		 */
		isActive: function() {
			return this.element.hasClass('aloha-block-active');
		},

		/**
		 * Get the id of the block
		 * @returns {String}
		 */
		getId: function() {
			return this.id;
		},

		/**
		 * Template method to render contents of the block, must be implemented by specific block type
		 *
		 * The renderer must manually take care of flushing the inner element if it needs that.
		 *
		 * @api
		 */
		render: function() {},

		_renderAndSetContent: function() {
			if (this._currentlyRendering) return;
			if (!this._initialized) return;

			this._currentlyRendering = true;

			var result = this.render(this.$innerElement);

			// Convenience for simple string content
			if (typeof result === 'string') {
				this.$innerElement.html(result);
			}

			this._renderSurroundingElements();

			this._currentlyRendering = false;
		},

		_renderSurroundingElements: function() {
			this.element.empty();
			this.element.append(this.$innerElement);

			this.createEditables(this.$innerElement);

			this.renderToolbar();
		},

		_getWrapperElementType: function() {
			return this._domElementType === 'block' ? 'div' : 'span';
		},

		/**
		 * Create editables from the inner content that was
		 * rendered for this block.
		 *
		 * Override to use a custom implementation and to pass
		 * special configuration to .aloha()
		 *
		 * @param {jQuery} innerElement
		 */
		createEditables: function(innerElement) {
			innerElement.find('.aloha-editable').aloha();
		},

		/**
		 * Render block toolbar elements
		 *
		 * Template method to render custom block UI.
		 */
		renderToolbar: function() {
			this.element.prepend('<span class="aloha-block-draghandle"></span>');
		},

		/**
		 * Get or set one or many attributes
		 *
		 * @api
		 * @param {String|Object} attributeNameOrObject
		 * @param {String} attributeValue
		 * @param {Boolean} Optional. If true, we do not fire change events.
		 */
		attr: function(attributeNameOrObject, attributeValue, suppressEvents) {
			var that = this, attributeChanged = false;

			if (arguments.length >= 2) {
				if (this._getAttribute(attributeNameOrObject) !== attributeValue) {
					attributeChanged = true;
				}
				this._setAttribute(attributeNameOrObject, attributeValue);
			} else if (typeof attributeNameOrObject === 'object') {
				jQuery.each(attributeNameOrObject, function(key, value) {
					if (that._getAttribute(key) !== value) {
						attributeChanged = true;
					}
					that._setAttribute(key, value);
				});
			} else if (typeof attributeNameOrObject === 'string') {
				return this._getAttribute(attributeNameOrObject);
			} else {
				return this._getAttributes();
			}
			if (attributeChanged && !suppressEvents) {
				this._renderAndSetContent();
				this.trigger('change');
			}
			return this;
		},

		_setAttribute: function(name, value) {
			if (name === 'about') {
				this.element.attr('about', value);
			} else {
				this.element.attr('data-' + name, value);
			}
		},

		_getAttribute: function(name) {
			return this._getAttributes()[name];
		},

		_getAttributes: function() {
			var attributes = {};

			// element.data() not always up-to-date, that's why we iterate over the attributes directly.
			jQuery.each(this.element[0].attributes, function(i, attribute) {
				if (attribute.name === 'about') {
					attributes['about'] = attribute.value;
				} else if (attribute.name.substr(0, 5) === 'data-') {
					attributes[attribute.name.substr(5)] = attribute.value;
				}
			});

			return attributes;
		}
	});

	/**
	 * @name block.block.DefaultBlock
	 * @class A default block that renders the initial content
	 * @extends block.block.AbstractBlock
	 */
	var DefaultBlock = AbstractBlock.extend(
	/** @lends block.block.DefaultBlock */
	{
		init: function() {
			this.attr('default-content', this.element.html());
		},
		render: function() {
			return this.attr('default-content');
		}
	});

	/**
	 * @name block.block.DebugBlock
	 * @class A debug block outputs its attributes in a table
	 * @extends block.block.AbstractBlock
	 */
	var DebugBlock = AbstractBlock.extend(
	/** @lends block.block.DebugBlock */
	{
		title: 'Debugging',
		render: function() {
			this.element.css({display: 'block'});
			var renderedAttributes = '<table class="debug-block">';
			jQuery.each(this.attr(), function(k, v) {
				renderedAttributes += '<tr><th>' + k + '</th><td>' + v + '</td></tr>';
			});

			renderedAttributes += '</table>';

			return renderedAttributes;
		}
	});

	return {
		AbstractBlock: AbstractBlock,
		DefaultBlock: DefaultBlock,
		DebugBlock: DebugBlock
	};
});
