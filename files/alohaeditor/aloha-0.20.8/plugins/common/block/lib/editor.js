/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

/**
 * @name block.editor
 * @namespace Block attribute editors
 */
define(['aloha/jquery', 'aloha/observable'],
function(jQuery, Observable) {
	

	/**
	 * @name block.editor.AbstractEditor
	 * @class An abstract editor
	 */
	var AbstractEditor = Class.extend(Observable,
	/** @lends block.editor.AbstractEditor */
	{
		schema: null,

		/**
		 * @constructor
		 */
		_constructor: function(schema) {
			this.schema = schema;
		},

		/**
		 * Template method to render the editor elements
		 * @return {jQuery}
		 */
		render: function() {
			// Implement in subclass!
		},

		/**
		 * Template method to get the editor values
		 */
		getValue: function() {
			// Implement in subclass!
		},

		/**
		 * We do not throw any change event here, as we need to break the loop "Block" -> "Editor" -> "Block"
		 *
		 * @param {String} value
		 */
		setValue: function(value) {
			// Implement in subclass!
		},

		/**
		 * Destroy the editor elements and unbind events
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
	 * @name block.editor.AbstractFormElementEditor
	 * @class An abstract form editor with label
	 * @extends block.editor.AbstractEditor
	 */
	var AbstractFormElementEditor = AbstractEditor.extend(
	/** @lends block.editor.AbstractFormElementEditor */
	{

		/**
		 * Input element HTML definition
		 * @type String
		 *
		 * @private
		 */
		formInputElementDefinition: null,

		/**
		 * @type jQuery
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
		 * Render the label for the editor
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

			this._$formInputElement.change(function() {
				that.trigger('change', that.getValue());
			});

			return this._$formInputElement;
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
		formInputElementDefinition: '<input type="range" />'
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

	return {
		AbstractEditor: AbstractEditor,
		AbstractFormElementEditor: AbstractFormElementEditor,
		StringEditor: StringEditor,
		NumberEditor: NumberEditor,
		UrlEditor: UrlEditor,
		EmailEditor: EmailEditor
	}
});