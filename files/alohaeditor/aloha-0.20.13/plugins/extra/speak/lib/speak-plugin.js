/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

define([
    'aloha/plugin',
	'aloha/floatingmenu',
	'i18n!aloha/nls/i18n'
], function ( Plugin, FloatingMenu, i18nCore ) {
	
	
	return Plugin.create('speak', {
		
		init: function () {
			var that = this;
			
			Aloha.require(['speak/speak','css!speak/css/speak.css']);
			
			Aloha.jQuery('body').append('<div id="audio"></div>')
			
			var button = new Aloha.ui.Button({
				name      : 'speak',
				text      : 'Speak',					// that.i18n('button.' + button + '.text'),
				iconClass : 'GENTICS_button_speak',
				size      : 'small',
				onclick   : function() {
					var range = Aloha.getSelection().getRangeAt( 0 );
					speak( Aloha.jQuery(range.startContainer.parentNode).text() );
				}
			});
			FloatingMenu.addButton(
				'Aloha.continuoustext',
				button,
				i18nCore.t('floatingmenu.tab.format'),
				1
			);
		}
	});
	
});

