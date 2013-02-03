/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
define(
['aloha/plugin', 'aloha/floatingmenu', 'i18n!metaview/nls/i18n', 'i18n!aloha/nls/i18n', 'aloha/jquery', 'css!metaview/css/metaview.css'],
function(Plugin, FloatingMenu, i18n, i18nCore, jQuery) {
	

	var
		$ = jQuery,
		GENTICS = window.GENTICS,
		Aloha = window.Aloha;

     return Plugin.create('metaview', {
		_constructor: function(){
			this._super('metaview');
		},
		
		/**
		 * Configure the available languages
		 */
		languages: ['en', 'de'],

		
		/**
		 * Initialize the plugin
		 */
		init: function () {
			var that = this;
			
			this.createButtons();
	
			// mark active Editable with a css class
			Aloha.bind(
					"aloha-editable-activated",
					function (jEvent, aEvent) {
						if(jQuery(Aloha.activeEditable.obj).hasClass('aloha-metaview')) {
							that.button.setPressed(true);
						} else {
							that.button.setPressed(false);
						}
					}
			);
		},
		
		buttonClick: function() {
			var that = this;
			if(jQuery(Aloha.activeEditable.obj).hasClass('aloha-metaview')) {
				jQuery(Aloha.activeEditable.obj).removeClass('aloha-metaview');
				that.button.setPressed(false);
			} else {
				jQuery(Aloha.activeEditable.obj).addClass('aloha-metaview');
				that.button.setPressed(true);
			}
		},
		
		/**
		 * Initialize the buttons
		 */
		createButtons: function () {
			var that = this;
	
			that.button = new Aloha.ui.Button({
				'name' : 'meta',
				'iconClass' : 'aloha-button aloha-button-metaview',
				'size' : 'small',
				'onclick' : function () { that.buttonClick(); },
				'tooltip' : i18n.t('button.switch-metaview.tooltip'),
				'toggle' : true
			});
			FloatingMenu.addButton(
				'Aloha.continuoustext',
				that.button,
				i18nCore.t('floatingmenu.tab.format'),
				1
			);			
		}
	});
});