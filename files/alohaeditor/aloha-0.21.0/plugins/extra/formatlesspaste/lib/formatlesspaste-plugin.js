/* formatlesspaste-plugin.js is part of Aloha Editor project http://aloha-editor.org
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
	'aloha/plugin',
	'jquery',
	'ui/ui', 
	'ui/toggleButton',
	'formatlesspaste/formatlesshandler',
	'aloha/contenthandlermanager',
	'i18n!formatlesspaste/nls/i18n',
	'i18n!aloha/nls/i18n'
], function(Aloha,
            Plugin,
            jQuery,
            Ui,
            ToggleButton,
            FormatlessPasteHandler,
            ContentHandlerManager,
            i18n,
            i18nCore) {
	

	// Public Methods
	return Plugin.create('formatlesspaste', {
		
		
		/**
		 * Configure Formatless pasting
		 */
		formatlessPasteOption: false, 
		
		/**
		 * Whether to display a button in the floating menu that allows to switch formatless pasting on and off
		 */
		button: true,
		
		//Here we removes the text-level semantic and edit elements (http://dev.w3.org/html5/spec/text-level-semantics.html#usage-summary)
		strippedElements : [
			"a",
			"em",
			"strong",
			"small",
			"s",
			"cite",
			"q",
			"dfn",
			"abbr",
			"time",
			"code",
			"var",
			"samp",
			"kbd",
			"sub",
			"sup",
			"i",
			"b",
			"u",
			"mark",
			"ruby",
			"rt",
			"rp",
			"bdi",
			"bdo",
			"ins",
			"del" 
		],

		/**
		 * Initialize the PastePlugin
		 */
		init: function() {
			var that = this;

			// look for old configuration directly in settings
			if ( typeof this.settings.formatlessPasteOption !== 'undefined') {
				this.formatlessPasteOption = this.settings.formatlessPasteOption;
			}
			
			if ( typeof this.settings.strippedElements !== 'undefined') {
				this.strippedElements = this.settings.strippedElements;
			}
			
			// look for newer config in settings.config
			if (this.settings.config) {
				if (this.settings.config.formatlessPasteOption) {
					this.formatlessPasteOption = this.settings.config.formatlessPasteOption;
				}
				if (this.settings.config.strippedElements) {
					this.strippedElements = this.settings.config.strippedElements;
				}
				if (this.settings.config.button === false) {
					this.button = false;
				}
			}
			
			this.registerFormatlessPasteHandler(); 
			var formatlessPasteHandlerLastState;
			Aloha.bind( 'aloha-editable-activated', function( event, params) {
				var config = that.getEditableConfig( params.editable.obj );
				if (!config) {
					return;
				}

				// make button configuration a bit more tolerant
				if (typeof config.button === 'string') {
					config.button = config.button.toLowerCase();
					if (config.button === 'false' || config.button === '0') {
						// disable button only if 'false' or '0' is specified
						config.button = false;
					} else {
						// otherwise the button will always be shown
						config.button = true;
					}
				}

				// make formatlessPasteOption configuration a bit more tolerant
				if (typeof config.formatlessPasteOption === 'string') {
					config.formatlessPasteOption = config.formatlessPasteOption.toLowerCase();
					if (config.formatlessPasteOption === 'false' || config.formatlessPasteOption === '0') {
						// disable button only if 'false' or '0' is specified
						config.formatlessPasteOption = false;
					} else {
						// otherwise the button will always be shown
						config.formatlessPasteOption = true;
					}
				}
				
				if ( config.strippedElements ) {
					FormatlessPasteHandler.strippedElements = config.strippedElements;
				}
				if (config.formatlessPasteOption === true) {
					that._toggleFormatlessPasteButton.setState(true);
					FormatlessPasteHandler.enabled = true;
				} else if (config.formatlessPasteOption === false) {
					that._toggleFormatlessPasteButton.setState(false);
					FormatlessPasteHandler.enabled = false;
				}
				if ( config.button === false ) {
					that._toggleFormatlessPasteButton.show(false);
				} else {
					that._toggleFormatlessPasteButton.show(true);
				}
			});
		},

		/**
		 * Register Formatless paste handler
		 */
		registerFormatlessPasteHandler: function(){
			ContentHandlerManager.register( 'formatless', FormatlessPasteHandler );
			FormatlessPasteHandler.strippedElements = this.strippedElements;
			// add button to toggle format-less pasting

			this._toggleFormatlessPasteButton = Ui.adopt('toggleFormatlessPaste', ToggleButton, {
				tooltip: i18n.t('button.formatlessPaste.tooltip'),
				icon: 'aloha-icon aloha-icon-formatless-paste',
				scope: 'Aloha.continuoustext',
				click: function () { 
					//toggle the value of allowFormatless
					FormatlessPasteHandler.enabled = !FormatlessPasteHandler.enabled;
				}
			});

			// activate formatless paste button if option is set
			if (this.formatlessPasteOption === true) {
				this._toggleFormatlessPasteButton.setState(true);
				FormatlessPasteHandler.enabled = true;
			}
			
			// hide button by default if configured
			if (this.button === false) {
				this._toggleFormatlessPasteButton.show(false);
			}
		}
	});
});
