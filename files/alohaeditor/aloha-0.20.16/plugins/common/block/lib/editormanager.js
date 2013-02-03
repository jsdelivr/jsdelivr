/*!
 * Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */

define(
['aloha/registry'],
function(Registry) {
	

	/**
	 * The Editor Manager maps data types to editor classes.
	 *
	 * @name block.editormanager
	 * @class Editor manager singleton
	 */
	return new (Registry.extend(
	/** @lends block.editormanager */
	{
		/**
		 * Create an editor from the given definition. Acts as a factory method
		 * for editors.
		 *
		 * @param {Object} definition
		 */
		createEditor: function(definition) {
			if (!this.has(definition.type)) {
				throw 'Editor for type "' + definition.type + '" not found.';
			}
			var Editor = this.get(definition.type);
			return new Editor(definition);
		}
	}))();
});