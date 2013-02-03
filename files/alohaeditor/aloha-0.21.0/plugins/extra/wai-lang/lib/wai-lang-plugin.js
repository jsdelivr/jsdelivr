/*global define: true, window: true */
/*!
 * Aloha Editor
 * Author & Copyright (c) 2011 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed under the terms of http://www.aloha-editor.com/license.html
 */

define([
	'aloha',
	'jquery',
	'aloha/plugin',
	'ui/ui',
	'ui/scopes',
	'ui/button',
	'ui/toggleButton',
	'ui/port-helper-attribute-field',
	'i18n!wai-lang/nls/i18n',
	'i18n!aloha/nls/i18n',
	'wai-lang/languages'
], function(
	Aloha,
	jQuery,
	Plugin,
	Ui,
	Scopes,
	Button,
	ToggleButton,
	AttributeField,
	i18n,
	i18nCore
) {
	

	var WAI_LANG_CLASS = 'aloha-wai-lang',
	    GENTICS = window.GENTICS,
	    langField;

	return Plugin.create('wai-lang', {

		/**
		 * Configure the available languages (i18n) for this plugin
		 */
		languages: [ 'en', 'de' ],

		/**
		 * Default configuration allows spans everywhere
		 */
		config: [ 'span' ],

		/**
		 * Define the exact standard of language codes to use (possible values are 'iso639-1' and 'iso639-2', default is 'iso639-1')
		 */
		iso639: 'iso639-1',

		/**
		 * Whether to show flags
		 */
		flags: false,

		/**
		 * the defined object types to be used for this instance
		 */
		objectTypeFilter: [ 'language' ],
		
		/**
		 * HotKeys used for special actions
		*/
		hotKey: {
			insertAnnotation: i18n.t('insertAnnotation', 'ctrl+shift+l')
		},

		/**
		 * Initialize the plugin:
		 * Initializes UI components, and binds their event listeners.
		 */
		init: function () {
			if (this.settings.objectTypeFilter) {
				this.objectTypeFilter = this.settings.objectTypeFilter;
			}
			if (this.settings.hotKey) {
				jQuery.extend(true, this.hotKey, this.settings.hotKey);
			}
			if (this.settings.flags === 'true' || this.settings.flags === true || this.settings.flags === '1' || this.settings.flags === 1) {
				this.flags = true;
			} else {
				this.flags = false;
			}
			if (this.settings.iso639) {
				this.iso639 = this.settings.iso639;
			}

			this.createButtons();
			this.subscribeEvents();
			this.bindInteractions();
		},

		/**
		 * Subscribe for events
		 */
		subscribeEvents: function () {
			var that = this;

			// add the event handler for selection change
			Aloha.bind('aloha-editable-activated', function (event, rangeObject) {
				var config;
				// show/hide the button according to the configuration
				config = that.getEditableConfig( Aloha.activeEditable.obj );
				if ( jQuery.inArray( 'span', config ) !== -1 ) {
					that._wailangButton.show();
				} else {
					that._wailangButton.hide();
					return;
				}
			});

			// add the event handler for selection change
			Aloha.bind( 'aloha-selection-changed', function( event, rangeObject ) {
				var foundMarkup = that._foundLangMarkupAtSelection = that.findLangMarkup(rangeObject);
				if (foundMarkup) {
					that._wailangButton.setState(true);
					Scopes.setScope('wai-lang');
					langField.setTargetObject(foundMarkup, 'lang');
				} else {
					that._wailangButton.setState(false);
					that._foundLangMarkupAtSelection = false;
					langField.setTargetObject(null);
				}
			});
		},

		/**
		 * Initialize the buttons:
		 * Places the Wai-Lang UI buttons into the floating menu.
		 */
		createButtons: function () {
			var that = this;

			this._wailangButton = Ui.adopt("wailang", ToggleButton, {
				tooltip: i18n.t('button.add-wai-lang.tooltip'),
				icon: 'aloha-icon aloha-icon-wai-lang',
				scope: 'Aloha.continuoustext',
				click: function(){
					that.addRemoveMarkupToSelection();
				}
			} );

			Scopes.createScope('wai-lang', 'Aloha.continuoustext');

			langField = AttributeField({
				name: 'wailangfield',
				width: 320,
				valueField: 'id',
				minChars: 1,
				scope: 'wai-lang'
			} );

			if (this.flags) {
				langField.setTemplate(
					'<div class="aloha-wai-lang-img-item">' +
					'<img class="aloha-wai-lang-img" src="{url}" />' +
					'<div class="aloha-wai-lang-label-item">{name} ({id})</div>' +
					'</div>'
				);
			} else {
				langField.setTemplate(
					'<div class="aloha-wai-lang-img-item">' +
					'<div class="aloha-wai-lang-label-item">{name} ({id})</div>' +
					'</div>'
				);
			}

			langField.setObjectTypeFilter(this.objectTypeFilter);

			this._removewailangButton = Ui.adopt('removewailang', Button, {
				tooltip: i18n.t('button.add-wai-lang-remove.tooltip'),
				icon: 'aloha-icon aloha-icon-wai-lang-remove',
				scope: 'wai-lang',
				click: function(){
					that.removeLangMarkup();
				}
			} );
		},

		/**
		 * Given a range object, finds and returns a Wai-Lang wrapper DOM
		 * element within the range.
		 *
		 * @param {GENTICS.Utils.RangeObject} range
		 * @return {?DOMObject} the dom object found, or false if nothing found
		 */
		findLangMarkup: function (range) {
			range = range || Aloha.Selection.getRangeObject();
			if (Aloha.activeEditable) {
				return range.findMarkup(function () {
					return jQuery(this).hasClass(WAI_LANG_CLASS) ||
							jQuery(this).is('[lang]');
			    }, Aloha.activeEditable.obj);
			}
			return null;
		},

		/**
		 * Check whether the range is within a span that contains a lang
		 * attribute.
		 *
		 * @param {GENTICS.Utils.RangeObject} range range where to insert the
		 *									  object (at start or end)
		 * @return {?DOMObject} the dom object found, or false if nothing found
		 * @hide
		 */
		findLanguageMarkup: function (range) {
			range = range || Aloha.Selection.getRangeObject();
			if (Aloha.activeEditable) {
				return range.findMarkup(function () {
					return this.nodeName === 'SPAN';
				}, Aloha.activeEditable.obj);
			}
			return null;
		},

		/**
		 *
		 */
		removeLangMarkup: function () {
			var range = Aloha.Selection.getRangeObject(),
			    foundMarkup = this.findLangMarkup(range);

		    if (foundMarkup) {
		        // remove the abbr
		        GENTICS.Utils.Dom.removeFromDOM(foundMarkup, range, true);

		        // select the (possibly modified) range
		        range.select();
				Scopes.setScope('Aloha.continuoustext');
				langField.setTargetObject(null);
		    }
		},

		/**
		 * Parse a all editables for elements that have a lang attribute and
		 * bind an onclick event
		 */
		bindInteractions: function () {
			var that = this;

			// on blur check if lang is empty, if so remove the <a> tag
			langField.addListener('blur', function (obj, event) {
				// @todo check for a valid value -- now it's also possible to insert abcd; but that's not valid
				if (!this.getValue()) {
					that.removeMarkup();
				}
			});

			Aloha.ready(function () {
				that.handleExistingSpans();
			});
		},

		/**
		 * Find all existing spans and register hotkey hotkeys and make
		 * annotations of languages visible.
		 */
		handleExistingSpans: function () {
			var that = this;

			// Add the Link shortcut to all editables
			jQuery.each(Aloha.editables, function (key, editable) {
				// Hotkey for adding new language annotations: CTRL+I
				editable.obj.bind( 'keydown', that.hotKey.insertAnnotation, function () { that.insertLanguageAnnotation(); });
			} );

			jQuery.each(Aloha.editables, function (key, editable) {
				// Find all spans with lang attributes and add some css and
				// event handlers
				editable.obj.find('span[lang]').each(function (i) {
					that.makeVisible(this);
				});
			});
		},

		/**
		 * @param {Event} e
		 * @return {?Boolean}
		 */
		insertLanguageAnnotation: function() {

			// In IE8 the handleKeyDown will trigger outside of the context 
			// of the wai-lang plugin. In that case we just omitt handling
			// the event. Otherwise a javascript error will occure. 
			if (typeof this.findLangMarkup === 'function') {
				if ( this.findLangMarkup() ) {
					langField.foreground();
					langField.focus();
				} else {
					this.addMarkupToSelection();
				}

				// Prevent from further handling.
				// on a MAC Safari, cursor would jump to location bar.
				// We have to use ESC and then META+I instead.
				return false;
			}
		},

		/**
		 * Make the given element visible by adding the class to it.
		 */
		makeVisible: function (element) {
			var $element = jQuery(element);
			$element.addClass(WAI_LANG_CLASS);
			$element.attr('data-gentics-aloha-repository', 'wai-languages');
			$element.attr('data-gentics-aloha-object-id', $element.attr('lang'));
		},

		/**
		 * Format the current selection or if collapsed the current word as
		 * element that should be annotated.
		 */
		formatLanguageSpan: function () {
			if (Aloha.activeEditable) {
				var range = Aloha.Selection.getRangeObject();
				if (this.findLanguageMarkup(range)) {
					this.removeMarkup();
				} else {
					this.insertMarkup();
				}
			}
		},

		/**
		 * Toggles markup around selection.
		 */
		addRemoveMarkupToSelection: function() {
			if (this._foundLangMarkupAtSelection) {
				this.removeLangMarkup();
			} else {
				this.addMarkupToSelection(false);
			}
		},

		/**
		 * Retrieves the current selected range, and wraps it with wai-lang
		 * content.
		 */
		addMarkupToSelection: function () {
			var range = Aloha.Selection.getRangeObject();

			// Do not add markup to an area that already contains a markup
			if (this.findLangMarkup(range)) {
				return;
			}

			langField.foreground();
			Scopes.setScope( 'wai-lang' );

			if (range.isCollapsed()) {
				GENTICS.Utils.Dom.extendToWord(range);
			}

			if (!range.isCollapsed()) {
				GENTICS.Utils.Dom.addMarkup(range,
					jQuery('<span class="' + WAI_LANG_CLASS + '"></span>'),
					false);
			}

			range.select();
			langField.focus();
		},

		/**
		 * Remove an a tag.
		 */
		removeMarkup: function () {
			var foundMarkup = this.findLangMarkup(),
			    range;

			if (foundMarkup) {
				range = Aloha.Selection.getRangeObject();
				GENTICS.Utils.Dom.removeFromDOM(foundMarkup, range, true);

				// select the (possibly modified) range
				range.select();
			}
		},

		/**
		 * Make the given jQuery object (representing an editable) clean for saving
		 * Find all elements with lang attributes and remove the attribute.
		 * 
		 * It also removes dataattributes attached by the repository.
		 * It adds a xml:lang attribute with the value of the lang attribute.
		 * 
		 * @param {jQuery} obj jQuery object to make clean
		 */
		makeClean: function (obj) {
			obj.find('span[lang]').each(function () {
				jQuery(this).removeClass(WAI_LANG_CLASS);
				jQuery(this).removeAttr("data-gentics-aloha-repository");
				jQuery(this).removeAttr("data-gentics-aloha-object-id");
				jQuery(this).attr("xml:lang", jQuery(this).attr("lang"));
			});
		}

	});
});
