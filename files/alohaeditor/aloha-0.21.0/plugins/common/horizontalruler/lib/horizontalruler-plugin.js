/* horizontalruler-plugin.js is part of Aloha Editor project http://aloha-editor.org
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
	'aloha',
	'jquery',
	'aloha/plugin',
	'ui/ui',
	'ui/button',
	'i18n!horizontalruler/nls/i18n',
	'i18n!aloha/nls/i18n'
], function(Aloha,
            jQuery,
			Plugin,
			Ui,
			Button,
			i18n,
			i18nCore) {
	

	var GENTICS = window.GENTICS;

	return Plugin.create('horizontalruler', {
		_constructor: function(){
			this._super('horizontalruler');
		},
		languages: ['en'],
		config: ['hr'],
		init: function() {
			var that = this;

			this._insertHorizontalRuleButton = Ui.adopt("insertHorizontalRule", Button, {
				tooltip: i18n.t('button.addhr.tooltip'),
				iconOnly: true,
				icon: 'aloha-icon-horizontalruler',
				scope: 'Aloha.continuoustext',
				click: function(){
					that.insertHR();
				}
			});

			Aloha.bind( 'aloha-editable-activated', function ( event, rangeObject ) {
				if (Aloha.activeEditable) {
					that.cfg = that.getEditableConfig( Aloha.activeEditable.obj );

					if ( jQuery.inArray( 'hr', that.cfg ) != -1 ) {
						that._insertHorizontalRuleButton.show(true);
		        	} else {
						that._insertHorizontalRuleButton.show(false);
		        		return;
		        	}
				}
			});

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

