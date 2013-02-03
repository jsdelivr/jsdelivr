/* highlighteditables-plugin.js is part of Aloha Editor project http://aloha-editor.org
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
define('highlighteditables/highlighteditables-plugin',
['aloha', 'jquery', 'aloha/plugin'],
function(Aloha, jQuery, Plugin) {
	

	var
		GENTICS = window.GENTICS;

	return Plugin.create('highlighteditables', {

		/**
		 * default button configuration
		 */
		config: [ 'highlight' ],

		init: function () {

			// remember refernce to this class for callback
			var that = this,
				config;

			// highlight editables as long as the mouse is moving
			GENTICS.Utils.Position.addMouseMoveCallback(function () {
				var i,
					editable;

				for ( i = 0; i < Aloha.editables.length; i++) {
					editable = Aloha.editables[i];
					config = that.getEditableConfig( editable.obj );

					if ( !Aloha.activeEditable && !editable.isDisabled() && config == 'highlight' ) {
						editable.obj.addClass('aloha-editable-highlight');
					}
				}
			});

			// fade editable borders when mouse stops moving
			GENTICS.Utils.Position.addMouseStopCallback(function () {
				that.fade();
			});

			// mark active Editable with a css class
			Aloha.bind(
					"aloha-editable-activated",
					function (jEvent, aEvent) {
						that.fade();
					}
			);

		},
		/**
		 * fades all highlighted editables
		 */
		fade: function () {
			var
				i, editable,
				animateEnd = function () {
					jQuery(this).css('outline', '');
				};
			for ( i = 0; i < Aloha.editables.length; i++) {
				editable = Aloha.editables[i].obj;
				if (editable.hasClass('aloha-editable-highlight')) {
					editable.css('outline', editable.css('outlineColor') + ' ' + editable.css('outlineStyle') + ' ' + editable.css('outlineWidth'))
						.removeClass('aloha-editable-highlight')
						.animate({
							outlineWidth : '0px'
						}, 300, 'swing', animateEnd);
				}
			}
		}

	});
});
