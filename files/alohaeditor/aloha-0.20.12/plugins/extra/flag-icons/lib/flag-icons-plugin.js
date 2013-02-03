/*!
* Aloha Editor
* Author & Copyright (c) 2011 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
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
define( function () {
	'use strict'
	return { path: Aloha.getPluginUrl( 'flag-icons' ) };
} );
