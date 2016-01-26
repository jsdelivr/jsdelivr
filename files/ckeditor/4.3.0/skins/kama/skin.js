/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/*
skin.js
=========

In this file we interact with the CKEditor JavaScript API to register the skin
and enable additional skin related features.

The level of complexity of this file depends on the features available in the
skin. There is only one mandatory line of code to be included here, which is
setting CKEDITOR.skin.name. All the rest is optional, but recommended to be
implemented as they make higher quality skins.

For this skin, the following tasks are achieved in this file:

	1. Register the skin.
	2. Register browser specific skin files.
	3. Define the "Chameleon" feature.
	4. Register the skin icons, to have them used on the development version of
	  the skin.
*/

// 1. Register the skin
// ----------------------
// The CKEDITOR.skin.name property must be set to the skin name. This is a
// lower-cased name, which must match the skin folder name as well as the value
// used on config.skin to tell the editor to use the skin.
//
// This is the only mandatory property to be defined in this file.
CKEDITOR.skin.name = 'kama';

// 2. Register browser specific skin files
// -----------------------------------------
// (http://docs.cksource.com/CKEditor_4.x/Skin_SDK/Browser_Hacks)
//
// To help implementing browser specific "hacks" to the skin files and have it
// easy to maintain, it is possible to have dedicated files for such browsers,
// for both the main skin CSS files: editor.css and dialog.css.
//
// The browser files must be named after the main file names, appended by an
// underscore and the browser name (e.g. editor_ie.css, dialog_ie8.css).
//
// The accepted browser names must match the CKEDITOR.env properties. The most
// common names are: ie, opera, webkit and gecko. Check the documentation for
// the complete list:
// http://docs.ckeditor.com/#!/api/CKEDITOR.env
//
// Internet explorer is an expection and the browser version is also accepted
// (ie7, ie8, ie9, ie10), as well as a special name for IE in Quirks mode (iequirks).
//
// The available browser specific files must be set separately for editor.css
// and dialog.css.
CKEDITOR.skin.ua_editor = 'ie,iequirks,ie7,ie8';
CKEDITOR.skin.ua_dialog = 'ie,iequirks,ie7,ie8,opera';


// 3. Define the "Chameleon" feature
// -----------------------------------
// (http://docs.cksource.com/CKEditor_4.x/Skin_SDK/Chameleon)
//
// "Chameleon" is a unique feature available in CKEditor. It makes it possible
// to end users to specify which color to use as the basis for the editor UI.
// It is enough to set config.uiColor to any color value and voila, the UI is
// colored.
//
// The only detail here is that the skin itself must be compatible with the
// Chameleon feature. That's because the skin CSS files are the responsible to
// apply colors in the UI and each skin do that in different way and on
// different places.
//
// Implementing the Chameleon feature requires a bit of JavaScript programming.
// The CKEDITOR.skin.chameleon function must be defined. It must return the CSS
// "template" to be used to change the color of a specific CKEditor instance
// available in the page. When a color change is required, this template is
// appended to the page holding the editor, overriding styles defined in the
// skin files.
//
// The "$color" placeholder can be used in the returned string. It'll be
// replaced with the desired color.
CKEDITOR.skin.chameleon = function( editor, part ) {
	// Use this function just to avoid having to repeat all these rules on
	// several places of our template.
	function getLinearBackground( definition ) {
		return 'background:-moz-linear-gradient(' + definition + ');' + // FF3.6+
			'background:-webkit-linear-gradient(' + definition + ');' + // Chrome10+, Safari5.1+
			'background:-o-linear-gradient(' + definition + ');' + // Opera 11.10+
			'background:-ms-linear-gradient(' + definition + ');' + // IE10+
			'background:linear-gradient(' + definition + ');'; // W3C
	}

	var css;

	// The Chameleon feature is available for each CKEditor instance,
	// independently. Because of this, we need to prefix all CSS selectors with
	// the unique class name of the instance.
	//
	// CKEditor instances have a unique ID, which is used as class name into
	// the outer container of the editor UI (e.g. ".cke_1").
	var cssId = '.' + editor.id;

	// There are two main "parts" that need the be touched by the Chameleon
	// feature: "editor" and "panel".
	//
	// This is the main UI part, representing everything that is loaded in the
	// page that includes the editor instance. Note that the dialog styles are
	// also taken in consideration here.
	if ( part == 'editor' ) {
		css = cssId + ' .cke_inner,' +
			cssId + ' .cke_dialog_tab' +
			'{' +
		    'background-color:$color;' +
				'background:-webkit-gradient(linear,0 -15,0 40,from(#fff),to($color));' +
				getLinearBackground( 'top,#fff -15px,$color 40px' ) +
			'}' +

			cssId + ' .cke_toolgroup' +
			'{' +
				'background:-webkit-gradient(linear,0 0,0 100,from(#fff),to($color));' +
				getLinearBackground( 'top,#fff,$color 100px' ) +
			'}' +

			cssId + ' .cke_combo_button' +
			'{' +
				'background:-webkit-gradient(linear, left bottom, left -100, from(#fff), to($color));' +
				getLinearBackground( 'bottom,#fff,$color 100px' ) +
			'}' +

			cssId + ' .cke_dialog_contents,' +
			cssId + ' .cke_dialog_footer' +
			'{' +
			'background-color:$color !important;' +
			'}' +

			cssId + ' .cke_dialog_tab:hover,' +
			cssId + ' .cke_dialog_tab:active,' +
			cssId + ' .cke_dialog_tab:focus,' +
			cssId + ' .cke_dialog_tab_selected' +
			'{' +
			'background-color:$color;' +
			'background-image:none;' +
			'}' +

			'';


	// The "panel" part is necessary because it represents contents of panels
	// used in the editor, like context-menus or the toolbar combos panels.
	// Those are loaded inside iframes, so this template is used there. Because
	// of this iframe isolation, we don't need to specify the editor id class
	// name in the rules selectors.
	//
	// The menu.css rules are usually the ones to be overriden here, while all
	// the rest is handled by the above "editor" part.
	} else if ( part == 'panel' ) {
		css = '.cke_menubutton_icon' +
			'{' +
				'background-color:$color !important;' +
				'border-color:$color !important;' +
			'}' +

			'.cke_menubutton:hover .cke_menubutton_icon,' +
			'.cke_menubutton:focus .cke_menubutton_icon,' +
			'.cke_menubutton:active .cke_menubutton_icon' +
			'{' +
				'background-color:$color !important;' +
				'border-color:$color !important;' +
			'}' +

			'.cke_menubutton:hover .cke_menubutton_label,' +
			'.cke_menubutton:focus .cke_menubutton_label,' +
			'.cke_menubutton:active .cke_menubutton_label' +
			'{' +
				'background-color:$color !important;' +
			'}' +

			'.cke_menubutton_disabled:hover .cke_menubutton_label,' +
			'.cke_menubutton_disabled:focus .cke_menubutton_label,' +
			'.cke_menubutton_disabled:active .cke_menubutton_label' +
			'{' +
				'background-color: transparent !important;' +
			'}' +

			'.cke_menubutton_disabled:hover .cke_menubutton_icon,' +
			'.cke_menubutton_disabled:focus .cke_menubutton_icon,' +
			'.cke_menubutton_disabled:active .cke_menubutton_icon' +
			'{' +
				'background-color:$color !important;' +
				'border-color:$color !important;' +
			'}' +

			'.cke_menubutton_disabled .cke_menubutton_icon' +
			'{' +
				'background-color:$color !important;' +
				'border-color:$color !important;' +
			'}' +

			'.cke_menuseparator' +
			'{' +
				'background-color:$color !important;' +
			'}' +

			'.cke_menubutton:hover,' +
			'.cke_menubutton:focus,' +
			'.cke_menubutton:active' +
			'{' +
				'background-color:$color !important;' +
			'}';
	}

	return css;
};

// %REMOVE_START%

// 4. Register the skin icons for development purposes only
// ----------------------------------------------------------
// (http://docs.cksource.com/CKEditor_4.x/Skin_SDK/Icons)
//
// This code is here just to make the skin work fully when using its "source"
// version. Without this, the skin will still work, but its icons will not be
// used (again, on source version only).
//
// This block of code is not necessary on the release version of the skin.
// Because of this it is very important to include it inside the REMOVE_START
// and REMOVE_END comment markers, so the skin builder will properly clean
// things up.
//
// If a required icon is not available here, the plugin defined icon will be
// used instead. This means that a skin is not required to provide all icons.
// Actually, it is not required to provide icons at all.

(function() {
	// The available icons. This list must match the file names (without
	// extension) available inside the "icons" folder.
	var icons = ( 'about,anchor-rtl,anchor,bgcolor,bidiltr,bidirtl,blockquote,' +
		'bold,bulletedlist-rtl,bulletedlist,button,checkbox,copy-rtl,copy,' +
		'creatediv,cut-rtl,cut,docprops-rtl,docprops,find-rtl,find,flash,form,' +
		'hiddenfield,horizontalrule,icons,iframe,image,imagebutton,indent-rtl,' +
		'indent,italic,justifyblock,justifycenter,justifyleft,justifyright,' +
		'link,maximize,newpage-rtl,newpage,numberedlist-rtl,numberedlist,' +
		'outdent-rtl,outdent,pagebreak-rtl,pagebreak,paste-rtl,paste,' +
		'pastefromword-rtl,pastefromword,pastetext-rtl,pastetext,placeholder,preview-rtl,' +
		'preview,print,radio,redo-rtl,redo,removeformat,replace,save,scayt,' +
		'select-rtl,select,selectall,showblocks-rtl,showblocks,smiley,' +
		'source-rtl,source,specialchar,spellchecker,strike,subscript,' +
		'superscript,table,templates-rtl,templates,textarea-rtl,textarea,' +
		'textcolor,textfield,underline,undo-rtl,undo,unlink' ).split( ',' );

	var iconsFolder = CKEDITOR.getUrl( CKEDITOR.skin.path() + 'icons/' );

	for ( var i = 0; i < icons.length; i++ ) {
		CKEDITOR.skin.addIcon( icons[ i ], iconsFolder + icons[ i ] + '.png' );
	}
})();

// %REMOVE_END%

