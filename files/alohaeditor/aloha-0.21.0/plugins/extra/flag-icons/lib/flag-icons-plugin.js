/* flag-icons-plugin.js is part of Aloha Editor project http://aloha-editor.org
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
 * Provides flag icons that are shared among various plugins.  Plugins that
 * rely on the icon images provided by this plugin should require this plugin
 * to ensure that the images are indeed there.
 *
 * This plugin's require module exports an object containing a single property:
 * the url of the plugins.  This url can be used as the path to 
 * programmatically determine the absolute urls of the icon images.
 *
 * USAGE:
 * require('flag-icons/flag-icons-plugin', function (FlagsIcons) {
 *	   // ...
 *     FlagIcons.path + languageCode;
 *     // ...
 * });
 */
define([], function () {
	'use strict'
	return { path: Aloha.getPluginUrl( 'flag-icons' ) };
} );
