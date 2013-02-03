/* metaview-plugin.js is part of Aloha Editor project http://aloha-editor.org
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
define([
	'aloha/plugin',
	'ui/ui',
	'ui/toggleButton',
	'flag-icons/flag-icons-plugin',
	'i18n!metaview/nls/i18n',
	'i18n!aloha/nls/i18n',
	'jquery'
], function(
	Plugin,
    Ui,
	ToggleButton,
	FlagIcons,
	i18n,
	i18nCore,
	jQuery
) {
	

	var GENTICS = window.GENTICS,
		Aloha = window.Aloha;

     return Plugin.create('metaview', {
		_constructor: function(){
			this._super('metaview');
		},
		
		config: [ 'metaview' ],
		
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
						var config;
						config = that.getEditableConfig( Aloha.activeEditable.obj );
 						if (jQuery.type(config) === 'array' && jQuery.inArray( 'metaview', config ) !== -1) {
							that._toggleMetaViewButton.show(true);
						} else {
							that._toggleMetaViewButton.show(false);
							return;
						}
						
						if ( /* that.button && */ jQuery(Aloha.activeEditable.obj).hasClass('aloha-metaview')) {
							that._toggleMetaViewButton.setState(true);
						} else {
							that._toggleMetaViewButton.setState(false);
						}
					}
			);
		},
		
		buttonClick: function() {
			if(jQuery(Aloha.activeEditable.obj).hasClass('aloha-metaview')) {
				jQuery(Aloha.activeEditable.obj).removeClass('aloha-metaview');
				this._toggleMetaViewButton.setState(false);
			} else {
				jQuery(Aloha.activeEditable.obj).addClass('aloha-metaview');
				this._toggleMetaViewButton.setState(true);
			}
		},
		
		/**
		 * Initialize the buttons
		 */
		createButtons: function () {
			var that = this;
	
			this._toggleMetaViewButton = Ui.adopt("toggleMetaView", ToggleButton, {
				tooltip : i18n.t('button.switch-metaview.tooltip'),
				icon: 'aloha-icon aloha-icon-metaview',
				scope: 'Aloha.continuoustext',
				click : function () { that.buttonClick(); }
			});
		}
	});
});
