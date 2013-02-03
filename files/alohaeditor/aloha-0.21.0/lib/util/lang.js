/* lang.js is part of Aloha Editor project http://aloha-editor.org
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
// Ensure GENTICS Namespace
GENTICS = window.GENTICS || {};
GENTICS.Utils = GENTICS.Utils || {};

define( 'util/lang', [], function(){} );

// Start Closure
(function(window, undefined) {
	
	var
		jQuery = window.alohaQuery || window.jQuery, $ = jQuery,
		GENTICS = window.GENTICS,
		Class = window.Class,
		console = window.console;

/**
 * Takes over all properties from the 'properties' object to the target object.
 * If a property in 'target' with the same name as a property in 'properties' is already defined it is overridden.
 *
 * Example:
 *
 * var o1 = {a : 1, b : 'hello'};
 * var o2 = {a : 3, c : 'world'};
 *
 * GENTICS.Utils.applyProperties(o1, o2);
 *
 * Will result in an o1 object like this:
 *
 * {a : 3, b: 'hello', c: 'world'}
 *
 * @static
 * @return void
 */
GENTICS.Utils.applyProperties = function (target, properties) {
	var name;
	for (name in properties) {
		if (properties.hasOwnProperty(name)) {
			target[name] = properties[name];
		}
	}
};

/**
 * Generate a unique hexadecimal string with 4 charachters
 * @return {string}
 */
GENTICS.Utils.uniqeString4 = function () {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

/**
 * Generate a unique value represented as a 32 character hexadecimal string,
 * such as 21EC2020-3AEA-1069-A2DD-08002B30309D
 * @return {string}
 */
GENTICS.Utils.guid = function () {
	var S4 = GENTICS.Utils.uniqeString4;
	return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
};

})(window);
