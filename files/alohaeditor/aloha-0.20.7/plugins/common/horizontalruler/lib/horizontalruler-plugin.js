/*
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
define(
['aloha', 'aloha/jquery', 'aloha/plugin', 'aloha/floatingmenu', 'i18n!horizontalruler/nls/i18n', 'i18n!aloha/nls/i18n', 'css!horizontalruler/css/horizontalruler.css'],
function(Aloha, jQuery, Plugin, FloatingMenu, i18n, i18nCore) {
	

	var
		GENTICS = window.GENTICS;

	return Plugin.create('horizontalruler', {
		_constructor: function(){
			this._super('horizontalruler');
		},
		languages: ['en'],
		init: function() {
			var that = this;
			var insertButton = new Aloha.ui.Button({
				'name': 'hr',
				'iconClass': 'aloha-button-horizontalruler',
				'size': 'small',
				'onclick': function(element, event) { that.insertHR(); },
				'tooltip': i18n.t('button.addhr.tooltip'),
				'toggle': false
			});
			FloatingMenu.addButton(
				'Aloha.continuoustext',
				insertButton,
				i18nCore.t('floatingmenu.tab.insert'),
				1
			);
			
		},
		insertHR: function(character) {
			var self = this;
			var range = Aloha.Selection.getRangeObject();
			if(Aloha.activeEditable) {
				var hr = jQuery('<hr>');
				GENTICS.Utils.Dom.insertIntoDOM(
					hr,
					range,
					jQuery(Aloha.activeEditable.obj),
					true
				);
				range.select();
			}
		}
	});

});

