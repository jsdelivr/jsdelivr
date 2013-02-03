/* editor.js is part of Aloha Editor project http://aloha-editor.org
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
 * @name block.editor
 * @namespace Block attribute editors
 */
define(['jquery', 'aloha/observable', 'util/class'],
function(jQuery, Observable, Class) {
	

	/**
	 * This is the base class for all editors in the sidebar. You need to extend
	 * this class if you need to write your own editor. In most cases, however,
	 * it is sufficent to subclass the AbstractFormElementEditor.
	 *
	 * @name block.editor.AbstractEditor
	 * @class An abstract editor
	 */
	var AbstractEditor = Class.extend(Observable,
	/** @lends block.editor.AbstractEditor */
	{
		/**
		 * Schema of the current element
		 *
		 * @param {Object}
		 * @api
		 */
		schema: null,

		/**
		 * @constructor
		 */
		_constructor: function(schema) {
			this.schema = schema;
		},

		/**
		 * Template method to render the editor elements. Override it
		 * in your subclass! Needs to return the jQuery element which
		 * should be added to the DOM
		 *
		 * @return {jQuery}
		 * @api
		 */
		render: function() {
			// Implement in subclass!
		},

		/**
		 * Template method to get the current editor value
		 *
		 * Override it in your subclass!
		 *
		 * @return {String}
		 * @api
		 */
		getValue: function() {
			// Implement in subclass!
		},

		/**
		 * Method which is called at initialization time, to set the current value.
		 *
		 * Override it in your subclass!
		 *
		 * You should not throw any change event here, as we need to break the loop "Block" -> "Editor" -> "Block"
		 *
		 * @param {String} value
		 * @api
		 */
		setValue: function(value) {
			// Implement in subclass!
		},

		/**
		 * Destroy the editor elements and unbind events
		 * @api
		 */
		destroy: function() {
			// Implement in subclass!
		},

		/**
		 * On deactivating, we still need to trigger a change event if the value has been modified.
		 *
		 * @private
		 */
		_deactivate: function() {
			this.trigger('change', this.getValue());
			this.destroy();
		}
	});

	/**
	 * This is a more specialized FormElementEditor which should be used
	 * for form-based editors.
	 *
	 * @name block.editor.AbstractFormElementEditor
	 * @class An abstract form editor with label
	 * @extends block.editor.AbstractEditor
	 */
	var AbstractFormElementEditor = AbstractEditor.extend(
	/** @lends block.editor.AbstractFormElementEditor */
	{

		/**
		 * Input element HTML definition
		 *
		 * You need to override this in your subclass.
		 *
		 * @type String
		 *
		 * @api
		 */
		formInputElementDefinition: null,

		/**
		 * The jQuery element of the form input element.
		 *
		 * @type {jQuery}
		 */
		_$formInputElement: null,

		/**
		 * Render the label and form element
		 * @return {jQuery}
		 */
		render: function() {
			var $wrapper = jQuery('<div class="aloha-block-editor" />');
			var guid = GENTICS.Utils.guid();
			$wrapper.append(this.renderLabel().attr('id', guid));
			$wrapper.append(this.renderFormElement().attr('id', guid));
			return $wrapper;
		},

		/**
		 * Render the label for the editor, by using the "label" property
		 * from the schema.
		 *
		 * @return {jQuery}
		 */
		renderLabel: function() {
			var element = jQuery('<label />');
			element.html(this.schema.label);
			return element;
		},

		/**
		 * Render the form input element
		 * @return {jQuery}
		 */
		renderFormElement: function() {
			var that = this;
			this._$formInputElement = jQuery(this.formInputElementDefinition);

			this.afterRenderFormElement(this._$formInputElement);

			this._$formInputElement.change(function() {
				that.trigger('change', that.getValue());
			});

			return this._$formInputElement;
		},

		/**
		 * Callback which can be implemented by subclasses to adjust the rendered
		 * form input element
		 *
		 * @param {jQuery} $formElement the form element being rendered
		 * @api
		 */
		afterRenderFormElement: function($formElement) {

		},

		/**
		 * @return {String}
		 */
		getValue: function() {
			return this._$formInputElement.val();
		},

		/**
		 * We do not throw any change event here, as we need to break the loop "Block" -> "Editor" -> "Block"
		 */
		setValue: function(value) {
			this._$formInputElement.val(value);
		},

		/**
		 * Cleanup and remove the input element
		 */
		destroy: function() {
			this._$formInputElement.remove();
		}

	});

	/**
	 * @name block.editor.StringEditor
	 * @class An editor for string input
	 * @extends block.editor.AbstractFormElementEditor
	 */
	var StringEditor = AbstractFormElementEditor.extend(
	/** @lends block.editor.StringEditor */
	{
		formInputElementDefinition: '<input type="text" />'
	});

	/**
	 * @name block.editor.NumberEditor
	 * @class An editor for numbers
	 * @extends block.editor.AbstractFormElementEditor
	 */
	var NumberEditor = AbstractFormElementEditor.extend(
	/** @lends block.editor.NumberEditor */
	{
		// TODO Range should be an option
		formInputElementDefinition: '<input type="range" />',

		afterRenderFormElement: function($formElement) {
			if (!this.schema.range) return;

			if (this.schema.range.min) {
				$formElement.attr('min', this.schema.range.min);
			}

			if (this.schema.range.max) {
				$formElement.attr('max', this.schema.range.max);
			}

			if (this.schema.range.step) {
				$formElement.attr('step', this.schema.range.step);
			}
		}
	});

	/**
	 * @name block.editor.UrlEditor
	 * @class An editor for URLs
	 * @extends block.editor.AbstractFormElementEditor
	 */
	var UrlEditor = AbstractFormElementEditor.extend(
	/** @lends block.editor.UrlEditor */
	{
		formInputElementDefinition: '<input type="url" />'
	});

	/**
	 * @name block.editor.EmailEditor
	 * @class An editor for email addresses
	 * @extends block.editor.AbstractFormElementEditor
	 */
	var EmailEditor = AbstractFormElementEditor.extend(
	/** @lends block.editor.EmailEditor */
	{
		formInputElementDefinition: '<input type="email" />'
	});

	/**
	 * @name block.editor.SelectEditor
	 * @class An editor for select fields
	 * @extends block.editor.AbstractFormElementEditor
	 */
	var SelectEditor = AbstractFormElementEditor.extend(
	/** @lends block.editor.SelectEditor */
	{
		formInputElementDefinition: '<select />',

		afterRenderFormElement: function($formElement) {
			jQuery.each(this.schema.values, function() {
				var el = this;
				$formElement.append(jQuery('<option />').attr('value', el.key).html(el.label));
			});
		}
	});

	/**
	 * @name block.editor.ButtonEditor
	 * @class An editor for buttons, executing a custom supplied callback "callback"
	 * @extends block.editor.AbstractFormElementEditor
	 */
	var ButtonEditor = AbstractFormElementEditor.extend(
	/** @lends block.editor.SelectEditor */
	{
		formInputElementDefinition: '<button />',

		afterRenderFormElement: function($formElement) {
			var that = this;
			$formElement.html(this.schema.buttonLabel);
			$formElement.click(function() {
				that.schema.callback();
			})
		}
	});

	return {
		AbstractEditor: AbstractEditor,
		AbstractFormElementEditor: AbstractFormElementEditor,
		StringEditor: StringEditor,
		NumberEditor: NumberEditor,
		UrlEditor: UrlEditor,
		EmailEditor: EmailEditor,
		SelectEditor: SelectEditor,
		ButtonEditor: ButtonEditor
	}
});
