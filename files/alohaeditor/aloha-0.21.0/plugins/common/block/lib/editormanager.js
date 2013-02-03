/* editormanager.js is part of Aloha Editor project http://aloha-editor.org
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