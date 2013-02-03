/*!
 * Aloha Editor
 * Author & Copyright (c) 2011 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed under the terms of http://www.aloha-editor.com/license.html
 */

define( [
	'aloha',
	'aloha/jquery',
	'aloha/plugin',
	'aloha/floatingmenu',
	'i18n!wai-lang/nls/i18n',
	'i18n!aloha/nls/i18n',
	'wai-lang/languages',
	'css!wai-lang/css/wai-lang.css'
], function( Aloha, jQuery, Plugin, FloatingMenu, i18n, i18nCore ) {
	

	var WAI_LANG_CLASS = 'aloha-wai-lang',
	    GENTICS = window.GENTICS,
	    addMarkupToSelectionButton,
	    langField;

	return Plugin.create( 'wai-lang', {

		/**
		 * Configure the available languages (i18n) for this plugin
		 */
		languages: [ 'en', 'de' ],

		/**
		 * Default configuration allows spans everywhere
		 */
		config: [ 'span' ],

		/**
		 * the defined object types to be used for this instance
		 */
		objectTypeFilter: [ 'language' ],

		/**
		 * Initialize the plugin:
		 * Initializes UI components, and binds their event listeners.
		 */
		init: function() {
			if ( this.settings.objectTypeFilter ) {
				this.objectTypeFilter = this.settings.objectTypeFilter;
			}

			this.createButtons();
			this.subscribeEvents();
			this.bindInteractions();
		},

		/**
		 * Subscribe for events
		 */
		subscribeEvents: function() {
			var that = this;

			// add the event handler for selection change
			Aloha.bind( 'aloha-selection-changed', function( event, rangeObject ) {
				var config,
				    foundMarkup;

				if ( Aloha.activeEditable ) {
					// show/hide the button according to the configuration
					config = that.getEditableConfig( Aloha.activeEditable.obj );
					if ( jQuery.inArray( 'span', config ) !== -1 ) {
						addMarkupToSelectionButton.setPressed( false );
					} else {
						addMarkupToSelectionButton.setPressed( true );

						// leave if a is not allowed
						return;
					}

					foundMarkup = that.findLangMarkup( rangeObject );
					if ( foundMarkup ) {
						addMarkupToSelectionButton.setPressed( true );
						FloatingMenu.setScope( 'wai-lang' );
						langField.setTargetObject( foundMarkup, 'lang' );
					} else {
						langField.setTargetObject( null );
					}
				}
			} );
		},

		/**
		 * Initialize the buttons:
		 * Places the Wai-Lang UI buttons into the floating menu.
		 */
		createButtons: function() {
			var that = this;

			// Button for adding a language markup to the current selection
			addMarkupToSelectionButton = new Aloha.ui.Button( {
				'name'      : 'wailang',
				'iconClass' : 'aloha-button aloha-button-wai-lang',
				'size'      : 'small',
				'onclick'   : function() {
					that.addRemoveMarkupToSelection();
				},
				'tooltip'   : i18n.t( 'button.add-wai-lang.tooltip' ),
				'toggle'    : true
			} );

			FloatingMenu.addButton(
				'Aloha.continuoustext',
				addMarkupToSelectionButton,
				i18nCore.t( 'floatingmenu.tab.format' ),
				1
			);

			// Add the new scope for the wai languages plugin tab
			FloatingMenu.createScope( 'wai-lang', 'Aloha.continuoustext' );

			langField = new Aloha.ui.AttributeField( {
				'name'       : 'wailangfield',
				'width'      : 320,
				'valueField' : 'id',
				'minChars'   : 1
			} );

			langField.setTemplate(
				'<div class="img-item">' +
					'<img class="typeahead-image" src="{url}" />' +
					'<div class="label-item">{name}</div>' +
				'</div>'
			);

			langField.setObjectTypeFilter( this.objectTypeFilter );

			// add the input field for links
			FloatingMenu.addButton(
				'wai-lang',
				langField,
				i18n.t( 'floatingmenu.tab.wai-lang' ),
				1
			);

			var removeButton = new Aloha.ui.Button( {
				'name'      : 'removewailang',
				'iconClass' : 'aloha-button aloha-button-wai-lang-remove',
				'size'      : 'small',
				'onclick'   : function() {
					that.removeLangMarkup();
				},
				'tooltip'   : i18n.t( 'button.add-wai-lang-remove.tooltip' ),
				'toggle'    : false
			} );

			FloatingMenu.addButton(
				'wai-lang',
				removeButton,
				i18n.t( 'floatingmenu.tab.wai-lang' ),
				1
			);
		},

		/**
		 * Given a range object, finds and returns a Wai-Lang wrapper DOM
		 * element within the range.
		 *
		 * @param {GENTICS.Utils.RangeObject} range
		 * @return {?DOMObject} the dom object found, or false if nothing found
		 */
		findLangMarkup: function( range ) {
			range = range || Aloha.Selection.getRangeObject();
			if ( Aloha.activeEditable ) {
				return range.findMarkup( function() {
					return jQuery( this ).hasClass( WAI_LANG_CLASS )
						|| jQuery( this ).is( '[lang]' );
			    }, Aloha.activeEditable.obj );
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
		findLanguageMarkup: function( range ) {
			range = range || Aloha.Selection.getRangeObject();
			if ( Aloha.activeEditable ) {
				return range.findMarkup( function() {
					return this.nodeName === 'SPAN';
				}, Aloha.activeEditable.obj );
			}
			return null;
		},

		/**
		 *
		 */
		removeLangMarkup: function() {
			var range = Aloha.Selection.getRangeObject(),
			    foundMarkup = this.findLangMarkup( range );

		    if ( foundMarkup ) {
		        // remove the abbr
		        GENTICS.Utils.Dom.removeFromDOM( foundMarkup, range, true );

		        // select the (possibly modified) range
		        range.select();
				FloatingMenu.setScope( 'Aloha.continousText' );
				langField.setTargetObject( null );
				FloatingMenu.doLayout();
		    }
		},

		/**
		 * Parse a all editables for elements that have a lang attribute and
		 * bind an onclick event
		 */
		bindInteractions: function() {
			var that = this;

			// on blur check if lang is empty, if so remove the <a> tag
			langField.addListener( 'blur', function( obj, event ) {
				// @todo check for a valid value -- now it's also possible to insert abcd; but that's not valid
				if ( !this.getValue() ) {
					that.removeMarkup();
				}
			} );

			Aloha.ready( function() {
				that.handleExistingSpans();
			} );
		},

		/**
		 * Find all existing spans and register hotkey hotkeys and make
		 * annotations of languages visible.
		 */
		handleExistingSpans: function() {
			var that = this;

			// Add the Link shortcut to all editables
			jQuery.each( Aloha.editables, function( key, editable ) {
				// Hotkey for adding new language annotations: CTRL+I
				editable.obj.keydown( that.handleKeyDown );
			} );

			jQuery.each( Aloha.editables, function( key, editable ) {
				// Find all spans with lang attributes and add some css and
				// event handlers
				editable.obj.find( 'span[lang]' ).each( function( i ) {
					that.makeVisible( this );
				} );
			} );
		},

		/**
		 * @param {Event} e
		 * @return {?Boolean}
		 */
		handleKeyDown: function( e ) {
			if ( e.metaKey && e.which === 73 ) {
				if ( this.findLangMarkup() ) {
					FloatingMenu.activateTabOfButton( 'wailangfield' );
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
		 * Make the given element visible by adding some styles to it.
		 */
		makeVisible: function( element ) {
			// Make existing spans with language attribute visible
			// Flags can be added via the metaview plugin
			jQuery( element ).css(
				'background-image',
				'url(' + Aloha.getPluginUrl( 'wai-lang' ) + '/img/flags/' +
					jQuery( element ).attr( 'lang' ) + '.png)'
			);
			jQuery( element ).addClass( WAI_LANG_CLASS );
		},

		/**
		 * Format the current selection or if collapsed the current word as
		 * element that should be annotated.
		 */
		formatLanguageSpan: function() {
			if ( Aloha.activeEditable ) {
				var range = Aloha.Selection.getRangeObject();
				if ( this.findLanguageMarkup( range ) ) {
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
			if ( addMarkupToSelectionButton.pressed ) {
				this.removeLangMarkup();
			} else {
				this.addMarkupToSelection( false );
			}
		},

		/**
		 * Retrieves the current selected range, and wraps it with wai-lang
		 * content.
		 */
		addMarkupToSelection: function() {
			var range = Aloha.Selection.getRangeObject();

			// Do not add markup to an area that already contains a markup
			if ( this.findLangMarkup( range ) ) {
				return;
			}

			FloatingMenu.activateTabOfButton( 'wailangfield' );
            FloatingMenu.setScope( 'wai-lang' );

			if ( range.isCollapsed() ) {
				GENTICS.Utils.Dom.extendToWord( range );
			}

			if ( !range.isCollapsed() ) {
				GENTICS.Utils.Dom.addMarkup( range,
					jQuery( '<span class="' + WAI_LANG_CLASS + '"></span>' ),
					false );
			}

			range.select();
			// langField.focus();
		},

		/**
		 * Remove an a tag.
		 */
		removeMarkup: function() {
			var foundMarkup = this.findLangMarkup(),
			    range;

			if ( foundMarkup ) {
				range = Aloha.Selection.getRangeObject();
				GENTICS.Utils.Dom.removeFromDOM( foundMarkup, range, true );

				// select the (possibly modified) range
				range.select();
			}
		},

		/**
		 * Make the given jQuery object (representing an editable) clean for saving
		 * Find all elements with lang attributes and remove the attribute.
		 * @param {jQuery} obj jQuery object to make clean
		 */
		makeClean: function( obj ) {
			obj.find( 'span[lang]' ).each( function() {
				jQuery( this ).removeClass( WAI_LANG_CLASS );
			} );
		}

	} );
} );
