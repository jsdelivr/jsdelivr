/* ribbon-plugin.js is part of Aloha Editor project http://aloha-editor.org
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
    'jquery',
    'aloha/plugin',
    'ui/menuButton',
    'ui/utils',
    'jqueryui'
], function (
	$,
	Plugin,
	MenuButton,
	Utils
) {
	

	var ribbon = Plugin.create('ribbon', {

		init: function () {
			if (!this.settings.enable &&
				typeof this.settings.enable !== 'undefined') {
				return;
			}

			var that = this;
			this._visible = false;
            this._toolbar = $('<div>', {'class':
				'aloha-ribbon-toolbar ui-menubar ui-widget-header ui-helper-clearfix'});

			var fadeIn = Utils.makeButtonElement({'class': 'aloha-ribbon-in'})
				.button()
				.hide()
				.click(function () {
					that._toolbar.animate({
						'left': 0
					});
					$('body').animate({paddingTop: 30});
					fadeIn.hide();
				})
			    .appendTo(this._toolbar);

			var fadeOut = Utils.makeButtonElement({'class': 'aloha-ribbon-out'})
				.button()
				.click(function () {
					that._toolbar.animate({
						'left': -that._toolbar.outerWidth()
						        + fadeIn.outerWidth()
						        + 10
					});
					$('body').animate({paddingTop: 0});
					fadeIn.show();
				})
				.appendTo(this._toolbar);

			var wrapper = $('<div>', {'class': 'aloha aloha-ribbon'})
				.appendTo('body');

			this._icon = $('<div>').prependTo(this._toolbar);
			this.setIcon('');

			this._toolbar.appendTo(wrapper);

			$('body').css({
				position: 'relative',
				paddingTop: 30
			});
		},

		/**
		 * Sets the icon class for the ribbon icon
		 * @param {String} iconClass CSS class for the icon
		 */
		setIcon: function (iconClass) {
			if (!this._icon) {
				return;
			}
			this._icon.attr('class', 'aloha-ribbon-icon ' + iconClass);
		},

		addButton: function (props) {
			if (!this._toolbar) {
				return;
			}
			props = $.extend({}, props, {'siblingContainer': this._toolbar});
			this._toolbar.append(MenuButton.makeMenuButton(props));
		},

		/**
		 * Shows the Ribbon
		 */
		hide: function () {
			if (!this._toolbar) {
				return;
			}
			this._toolbar.hide();
			this._visible = false;
		},

		/**
		 * Hides the Ribbon
		 */
		show: function () {
			if (!this._toolbar) {
				return;
			}
			this._toolbar.show();
			this._visible = true;
		},

		/**
		 * Check whether the ribbon is visible right now
		 * @return true when the ribbon is visible, false when not
		 */
		isVisible: function () {
			return this._visible;
		}
	});

	return ribbon;
});
