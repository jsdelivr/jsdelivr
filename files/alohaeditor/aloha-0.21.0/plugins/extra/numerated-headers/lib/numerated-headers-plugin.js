/* numerated-headers-plugin.js is part of Aloha Editor project http://aloha-editor.org
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
	'aloha/core',
	'jquery',
	'aloha/plugin',
	'ui/ui',
	'ui/toggleButton',
	'i18n!numerated-headers/nls/i18n',
	'i18n!aloha/nls/i18n'
], function (
	Aloha,
	$,
	Plugin,
	Ui,
	ToggleButton,
	i18n,
	i18nCore
) {
	

	/**
	 * A cache of editable configuration.
	 * @private
	 * @type {object<string, object>}
	 */
	var editableConfigurations = {};

	Aloha.bind('aloha-editable-destroyed', function (event, editable) {
		delete editableConfigurations[editable.getId()];
	});

	return Plugin.create('numerated-headers', {
		config: {
			numeratedactive: true,
			headingselector: 'h1, h2, h3, h4, h5, h6',
			trailingdot: false
		},

		/**
		 * Initialize the plugin.
		 */
		init: function () {
			var that = this;

			this._formatNumeratedHeadersButton = Ui.adopt('formatNumeratedHeaders',
				ToggleButton, {
					tooltip: i18n.t('button.numeratedHeaders.tooltip'),
					icon: 'aloha-icon aloha-icon-numerated-headers',
					scope: 'Aloha.continuoustext',
					click: function () {
						if (that._formatNumeratedHeadersButton.getState()) {
							that.removeNumerations();
						} else {
							that.createNumeratedHeaders();
						}
					}
				});


			// We need to bind to smart-content-changed event to recognize
			// backspace and delete interactions.
			Aloha.bind('aloha-smart-content-changed', function (event) {
				that.cleanNumerations();
				if (that.showNumbers()) {
					that.createNumeratedHeaders();
				}
			});
			
			// We need to listen to that event, when a block is formatted to
			// header format. smart-content-changed would be not fired in 
			// that case
			Aloha.bind('aloha-format-block', function () {
				that.cleanNumerations();
				if (that.showNumbers()) {
					that.createNumeratedHeaders();
				}
			});

			Aloha.bind('aloha-editable-activated', function (event) {
				if (that.isNumeratingOn()) {
					that._formatNumeratedHeadersButton.show();
					that.initForEditable(Aloha.activeEditable.obj);
				} else {
					that._formatNumeratedHeadersButton.hide();
				}
			});
		},

		/**
		 * Init the toggle button (and numerating) for the current editable,
		 * if not yet done.
		 * If numerating shall be on by default and was not turned on, numbers
		 * will be created.
		 */
		initForEditable: function ($editable) {
			var flag = $editable.attr('aloha-numerated-headers');
			if (flag !== 'true' && flag !== 'false') {
				flag = (true === this.getCurrentConfig().numeratedactive) ? 'true' : 'false';
				$editable.attr('aloha-numerated-headers', flag);
			}

			if (flag === 'true') {
				this.createNumeratedHeaders();
				this._formatNumeratedHeadersButton.setState(true);
			} else {
				this._formatNumeratedHeadersButton.setState(false);
			}
		},

		/**
		 * Get the config for the current editable
		 */
		getCurrentConfig: function () {
			var config = this.getEditableConfig(Aloha.activeEditable.obj);

			// normalize config (set default values)
			if (config.numeratedactive === true || config.numeratedactive === 'true' || config.numeratedactive === '1') {
				config.numeratedactive = true;
			} else {
				config.numeratedactive = false;
			}

			if (typeof config.headingselector !== 'string') {
				config.headingselector = 'h1, h2, h3, h4, h5, h6';
			}
			config.headingselector = $.trim(config.headingselector);

			if (config.trailingdot === true || config.trailingdot === 'true' || config.trailingdot === '1') {
				config.trailingdot = true;
			} else {
				config.trailingdot = false;
			}

			return config;
		},

		/**
		 * Check whether numerating shall be possible in the current editable
		 */
		isNumeratingOn: function () {
			return this.getCurrentConfig().headingselector !== '';
		},

		/**
		 * Check whether numbers shall currently be shown in the current
		 * editable.
		 */
		showNumbers: function () {
			return (
				Aloha.activeEditable &&
				this.isNumeratingOn() &&
				(Aloha.activeEditable.obj.attr('aloha-numerated-headers') === 'true')
			);
		},
		
		/**
		 * Remove all annotations in the current editable.
		 */
		cleanNumerations: function () {
			var active_editable_obj = this.getBaseElement();
			if (!active_editable_obj) {
				return;
			}
			$(active_editable_obj).find('span[role=annotation]').each(function () {
				$(this).remove();
			});
		},

		/**
		 * Removed and disables numeration for the current editable.
		 */
		removeNumerations : function () {
			$(Aloha.activeEditable.obj).attr('aloha-numerated-headers', 'false');
			this.cleanNumerations();
		},

		getBaseElement: function () {
			if (typeof this.baseobjectSelector !== 'undefined') {
				return ($(this.baseobjectSelector).length > 0) ?
						$(this.baseobjectSelector) : null;
			}
			return Aloha.activeEditable ? Aloha.activeEditable.obj : null;
		},

		/*
		* checks if the given Object contains a note Tag that looks like this:
		* <span annotation=''>
		*
		* @param {HTMLElement} obj The DOM object to check.
		*/
		hasNote: function (obj) {
			if (!obj || $(obj).length <= 0) {
				return false;
			}
			return $(obj).find('span[role=annotation]').length > 0;
		},

		/*
		* checks if the given Object has textual content.
		* A possible "<span annotation=''>" tag will be ignored
		*
		* @param {HTMLElement} obj The DOM object to check
		*/
		hasContent: function (obj) {
			if (!obj || 0 === $(obj).length) {
				return false;
			}
			// we have to check the content of this object without the annotation span
			var $objCleaned = $(obj).clone()
			                        .find('span[role=annotation]')
			                        .remove()
			                        .end();
			// check for text, also in other possible sub tags
			return $.trim($objCleaned.text()).length > 0;
		},

		createNumeratedHeaders: function () {
			var active_editable_obj = this.getBaseElement();
			if (!active_editable_obj) {
				return;
			}

			var config = this.getCurrentConfig();
			var headingselector = config.headingselector;
			var headers = active_editable_obj.find(headingselector);

			Aloha.activeEditable.obj.attr('aloha-numerated-headers', 'true');

			if (typeof headers === 'undefined' || headers.length === 0) {
				return;
			}

			// base rank is the lowest rank of all selected headers
			var base_rank = 7;
			var that = this;
			headers.each(function () {
				if (that.hasContent(this)) {
					var current_rank = parseInt(this.nodeName.substr(1), 10);
					if (current_rank < base_rank) {
						base_rank = current_rank;
					}
				}
			});
			if (base_rank > 6) {
				return;
			}
			var prev_rank = null,
				current_annotation = [],
				annotation_pos = 0,
				i;

			// initialize the base annotations
			for (i = 0; i < (6 - base_rank) + 1; i++) {
				current_annotation[i] = 0;
			}

			headers.each(function () {
				// build and count annotation only if there is content in this header
				if (that.hasContent(this)) {

					var current_rank = parseInt(this.nodeName.substr(1), 10);
					if (prev_rank === null && current_rank !== base_rank) {
						// when the first found header has a rank
						// different from the base rank, we omit it
						$(this).find('span[role=annotation]').remove();
						return;
					} else if (prev_rank === null) {
						// increment the main annotation
						current_annotation[annotation_pos]++;
					} else if (current_rank > prev_rank) {
						// starts a sub title
						current_annotation[++annotation_pos]++;
					} else if (current_rank === prev_rank) {
						// continues subtitles
						current_annotation[annotation_pos]++;
					} else if (current_rank < prev_rank) {
						//goes back to a main title
						var current_pos = current_rank - base_rank;
						var j;
						for (j = annotation_pos; j > (current_pos); j--) {
							current_annotation[j] = 0; //reset current sub-annotation
						}
						annotation_pos = current_pos;
						current_annotation[annotation_pos]++;
					}

					prev_rank = current_rank;

					var annotation_result = '', i;
					if (config.trailingdot === true) {
						annotation_result = '';
						for (i = 0; i < current_annotation.length; i++) {
							if (current_annotation[i] !== 0) {
								annotation_result += (current_annotation[i] + '.');
							}
						}
					} else {
						annotation_result = current_annotation[0];
						for (i = 1; i < current_annotation.length; i++) {
							if (current_annotation[i] !== 0) {
								annotation_result += ('.' + current_annotation[i]);
							}
						}
					}

					if (that.hasNote(this)) {
						$(this).find('span[role=annotation]').html(annotation_result);
					} else {
						$(this).prepend('<span role="annotation">' +
							annotation_result + '</span>');
					}
				} else {
					// no Content, so remove the Note, if there is one
					if (that.hasNote(this)) {
						$(this).find('span[role=annotation]').remove();
					}
				}
			});
		}
	});
});
