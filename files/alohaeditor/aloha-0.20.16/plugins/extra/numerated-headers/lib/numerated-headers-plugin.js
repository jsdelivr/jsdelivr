/*global define: true, window: true */
/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
define([
	'aloha/jquery',
	'aloha/plugin',
	'aloha/floatingmenu',
	'i18n!numerated-headers/nls/i18n',
	'i18n!aloha/nls/i18n',
	'css!numerated-headers/css/numerated-headers.css'
],

function (jQuery, Plugin, FloatingMenu, i18n, i18nCore) {
	

	var $ = jQuery,
		Aloha = window.Aloha;

	return Plugin.create('numerated-headers', {
		config: {
			numeratedactive: true,
			headingselector: 'h1, h2, h3, h4, h5, h6',
			trailingdot: false
		},

		/**
		 * Initialize the plugin
		 */
		init: function () {
			var that = this;

			// add button to toggle numerated-headers
			this.numeratedHeadersButton = new Aloha.ui.Button({
				'iconClass' : 'aloha-button aloha-button-numerated-headers',
				'size' : 'small',
				'onclick' : function () {
					if (that.numeratedHeadersButton.isPressed()) {
						that.removeNumerations();
					} else {
						that.createNumeratedHeaders();
					}
				},
				'tooltip' : i18n.t('button.numeratedHeaders.tooltip'),
				'toggle' : true /*,
				'pressed' : this.numeratedactive */
			});

			FloatingMenu.addButton(
				'Aloha.continuoustext',
				this.numeratedHeadersButton,
				i18nCore.t('floatingmenu.tab.format'),
				1
			);

			// We need to bind to selection-changed event to recognize backspace and delete interactions
			Aloha.bind('aloha-selection-changed', function (event) {
				if (that.numeratedHeadersButton && that.showNumbers()) {
					that.createNumeratedHeaders();
				}
			});

			Aloha.bind('aloha-editable-activated', function (event) {
				var config = that.getCurrentConfig();

				// hide the button, when numerating is off
				if (that.numeratedHeadersButton) {
					if (that.isNumeratingOn()) {
						that.numeratedHeadersButton.show();
						that.initForEditable();
					} else {
						that.numeratedHeadersButton.hide();
					}
				}
			});
		},

		/**
		 * Init the toggle button (and numerating) for the current editable,
		 * if not yet done.
		 * If numerating shall be on by default and was not turned on, numbers will be created.
		 */
		initForEditable: function () {
			var $editable = jQuery(Aloha.activeEditable.obj);
			var flag = $editable.attr('aloha-numerated-headers');
			if (flag !== 'true' && flag !== 'false') {
				var config = this.getCurrentConfig();
				if (config.numeratedactive === true) {
					flag = 'true';
				} else {
					flag = 'false';
				}
				$editable.attr('aloha-numerated-headers', flag);
			}

			if (flag === 'true') {
				this.createNumeratedHeaders();
				this.numeratedHeadersButton.setPressed(true);
			} else {
				this.numeratedHeadersButton.setPressed(false);
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
			config.headingselector = jQuery.trim(config.headingselector);

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
			var config = this.getCurrentConfig();
			return config.headingselector !== '';
		},

		/**
		 * Check whether numbers shall currently be shown in the current editable
		 */
		showNumbers: function () {
			// don't show numbers if numerating is off
			if (!this.isNumeratingOn()) {
				return false;
			}

			return jQuery(Aloha.activeEditable.obj).attr('aloha-numerated-headers') === 'true';
		},

		removeNumerations : function () {
			var active_editable_obj = this.getBaseElement();

			if (!active_editable_obj) {
				return;
			}

			jQuery(Aloha.activeEditable.obj).attr('aloha-numerated-headers', 'false');
			var headingselector = this.getCurrentConfig().headingselector;

			var headers = active_editable_obj.find(headingselector);
			headers.each(function () {
				jQuery(this).find('span[role=annotation]').each(function () {
					jQuery(this).remove();
				});
			});
		},

		getBaseElement: function () {
			if (typeof this.baseobjectSelector !== 'undefined') {
				if (jQuery(this.baseobjectSelector).length > 0) {
					return jQuery(this.baseobjectSelector);
				} else {
					return false;
				}
			} else {
				if (typeof Aloha.activeEditable === 'undefined' || Aloha.activeEditable === null) {
					return false;
				} else {
					return Aloha.activeEditable.obj;
				}
			}
		},

		/*
		* checks if the given Object contains a note Tag that looks like this:
		* <span annotation=''>
		*
		* @param {Object} obj - The Object to check
		*/
		hasNote: function (obj) {
			if (!obj || !jQuery(obj).length > 0) {
				return false;
			}
			obj = jQuery(obj);

			if (obj.find('span[role=annotation]').length > 0) {
				return true;
			}

			return false;
		},

		/*
		* checks if the given Object has textual content.
		* A possible "<span annotation=''>" tag will be ignored
		*
		* @param {Object} obj - The Object to check
		*/
		hasContent: function (obj) {
			if (!obj || !jQuery(obj).length > 0) {
				return false;
			}
			obj = jQuery(obj);

			// we have to check the content of this object without the annotation span
			var objCleaned = obj.clone().find('span[role=annotation]').remove().end();

			// check for text, also in other possible sub tags
			if (objCleaned.text().trim().length > 0) {
				return true;
			}

			return false;
		},

		createNumeratedHeaders: function () {
			var config = this.getCurrentConfig();
			var headingselector = config.headingselector;
			var active_editable_obj = this.getBaseElement(),
				that = this,
				headers = active_editable_obj.find(headingselector);

			if (!active_editable_obj) {
				return;
			}

			jQuery(Aloha.activeEditable.obj).attr('aloha-numerated-headers', 'true');

			if (typeof headers === "undefined" || headers.length === 0) {
				return;
			}

			// base rank is the lowest rank of all selected headers
			var base_rank = 7;
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
				annotation_pos = 0;

			// initialize the base annotations
			for (var i = 0; i < (6 - base_rank) + 1; i++) {
				current_annotation[i] = 0; 
			}

			headers.each(function () {
				// build and count annotation only if there is content in this header
				if (that.hasContent(this)) {

					var current_rank = parseInt(this.nodeName.substr(1), 10);
					if (prev_rank === null && current_rank !== base_rank) {
						// when the first found header has a rank
						// different from the base rank, we omit it
						jQuery(this).find('span[role=annotation]').remove();
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
						for (var j = annotation_pos; j > (current_pos); j--) {
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
								annotation_result += (current_annotation[i] + ".");
							}
						}
					} else {
						annotation_result = current_annotation[0];
						for (i = 1; i < current_annotation.length; i++) {
							if (current_annotation[i] !== 0) {
								annotation_result += ("." + current_annotation[i]);
							}
						}
					}

					if (that.hasNote(this)) {
						jQuery(this).find('span[role=annotation]').html(annotation_result); 
					} else {
						jQuery(this).prepend("<span role='annotation'>" + annotation_result + "</span> ");
					}
				} else {
					// no Content, so remove the Note, if there is one
					if (that.hasNote(this)) {
						jQuery(this).find('span[role=annotation]').remove();
					}
				}
			});
		}
	});
});
