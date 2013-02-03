/* abbr-plugin.js is part of Aloha Editor project http://aloha-editor.org
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
	'ui/toggleButton',
	'ui/button',
	'ui/scopes',
	'ui/port-helper-attribute-field',
	'i18n!abbr/nls/i18n',
	'i18n!aloha/nls/i18n'
], function (
	Aloha,
	jQuery,
	Plugin,
	Ui,
	ToggleButton,
	Button,
	Scopes,
	AttributeField,
	i18n,
	i18nCore
) {
	
	var GENTICS = window.GENTICS;

	/**
	 * register the plugin with unique name
	 */
	return Plugin.create( 'abbr', {
		/**
		 * Configure the available languages
		 */
		languages: [ 'en', 'de' ],

		/**
		 * default button configuration
		 */
		config: [ 'abbr' ],

		/**
		 * Initialize the plugin and set initialize flag on true
		 */
		init: function () {
			this.createButtons();
		    this.subscribeEvents();
		    this.bindInteractions();
		},

		/**
		 * Initialize the buttons
		 */
		createButtons: function () {
		    var me = this;

			this._formatAbbrButton = Ui.adopt("formatAbbr", ToggleButton, {
				tooltip: i18n.t("button.abbr.tooltip"),
				icon: "aloha-icon aloha-icon-abbr",
				scope: 'Aloha.continuoustext',
				click: function(){
					me.formatAbbr();
				}
			});

			this._insertAbbrButton = Ui.adopt("insertAbbr", Button, {
				tooltip: i18n.t('button.addabbr.tooltip'),
				icon: 'aloha-icon aloha-icon-abbr',
				scope: 'Aloha.continuoustext',
				click: function(){
					me.insertAbbr( false );
				}
			});

		    Scopes.createScope('abbr', 'Aloha.continuoustext');

		    this.abbrField = AttributeField({
		    	width: 320,
		    	name: 'abbrText',
		        scope: 'abbr'
		    });
		},

		/**
		 * Parse a all editables for abbreviations
		 * Add the abbr shortcut to all edtiables
		 */
		bindInteractions: function () {
			var me = this;
			
		    // on blur check if abbr title is empty. If so remove the a tag
		    this.abbrField.addListener( 'blur', function ( obj, event ) {
		        if ( this.getValue() == '' ) {
		            me.removeAbbr();
		        }
		    } );

		    // add to all editables the abbr shortcut
		    for ( var i = 0; i < Aloha.editables.length; i++ ) {
		        // CTRL+G
		        Aloha.editables[ i ].obj.keydown( function ( e ) {
		    		if ( e.metaKey && e.which == 71 ) {
				        if ( me.findAbbrMarkup() ) {
							me.abbrField.foreground();
							me.abbrField.focus();
				        } else {
				        	me.insertAbbr();
				        }
						
				        // prevent from further handling
			            // on a MAC Safari cursor would jump to location bar. Use ESC then META+L
				        e.stopPropagation();
				        e.preventDefault();
						
			            return false;
		    		}
		        } );
		    }
		},

		subscribeEvents: function () {
			var me = this;
			var editableConfig = {};

			Aloha.bind('aloha-editable-activated', function () {
				if (!Aloha.activeEditable || !Aloha.activeEditable.obj) {
					return;
				}

				var config = me.getEditableConfig(Aloha.activeEditable.obj);
				editableConfig[
					Aloha.activeEditable.getId()
				] = jQuery.inArray('abbr', config) !== -1;
			});

			Aloha.bind('aloha-editable-destroyed', function () {
				if (!Aloha.activeEditable || !Aloha.activeEditable.obj) {
					return;
				}

				delete editableConfig[Aloha.activeEditable.getId()];
			});

			Aloha.bind('aloha-selection-changed', function (event, range) {
		        if (!Aloha.activeEditable) {
					return;
				}

				if (editableConfig[Aloha.activeEditable.getId()]) {
					me._formatAbbrButton.show();
					me._insertAbbrButton.show();
				} else {
					me._formatAbbrButton.hide();
					me._insertAbbrButton.hide();
					return;
				}

				var foundMarkup = me.findAbbrMarkup(range);
				if (foundMarkup) {
					me._insertAbbrButton.hide();
					me._formatAbbrButton.setState(true);
					Scopes.setScope('abbr');
					me.abbrField.setTargetObject(foundMarkup, 'title');
				} else {
					me._formatAbbrButton.setState(false);
					me.abbrField.setTargetObject(null);
				}
		    });
		},

		/**
		 * Check whether inside a abbr tag
		 * @param {GENTICS.Utils.RangeObject} range range where to insert the object (at start or end)
		 * @return markup
		 * @hide
		 */
		findAbbrMarkup: function ( range ) {
			if ( typeof range == 'undefined' ) {
		        var range = Aloha.Selection.getRangeObject();
		    }
			
			if ( Aloha.activeEditable ) {
			    return range.findMarkup( function() {
			        return this.nodeName.toLowerCase() == 'abbr';
			    }, Aloha.activeEditable.obj );
			} else {
				return null;
			}
		},

		/**
		 * Format the current selection or if collapsed the current word as abbr.
		 * If inside a abbr tag the abbr is removed.
		 */
		formatAbbr: function () {
			var range = Aloha.Selection.getRangeObject();

		    if ( Aloha.activeEditable ) {
		        if ( this.findAbbrMarkup( range ) ) {
		            this.removeAbbr();
		        } else {
		            this.insertAbbr();
		        }
		    }
		},

		/**
		 * Insert a new abbr at the current selection. When the selection is collapsed,
		 * the abbr will have a default abbr text, otherwise the selected text will be
		 * the abbr text.
		 */
		insertAbbr: function ( extendToWord ) {
		    // current selection or cursor position
		    var range = Aloha.Selection.getRangeObject();

		    // do not insert a abbr in a abbr
		    if ( this.findAbbrMarkup( range ) ) {
		        return;
		    }

		    // if selection is collapsed then extend to the word.
		    if ( range.isCollapsed() && extendToWord != false ) {
		        GENTICS.Utils.Dom.extendToWord( range );
		    }
			
		    if ( range.isCollapsed() ) {
		        // insert a abbr with text here
		        var abbrText = i18n.t( 'newabbr.defaulttext' );
		        var newAbbr = jQuery( '<abbr title="">' + abbrText + '</abbr>' );
		        GENTICS.Utils.Dom.insertIntoDOM( newAbbr, range, jQuery( Aloha.activeEditable.obj ) );
		        range.startContainer = range.endContainer = newAbbr.contents().get( 0 );
		        range.startOffset = 0;
		        range.endOffset = abbrText.length;
		    } else {
		        var newAbbr = jQuery( '<abbr title=""></abbr>' );
		        GENTICS.Utils.Dom.addMarkup( range, newAbbr, false );
		    }
			
		    range.select();

			this.abbrField.foreground();
			this.abbrField.focus();
		},

		/**
		 * Remove an a tag.
		 */
		removeAbbr: function () {
		    var range = Aloha.Selection.getRangeObject();
		    var foundMarkup = this.findAbbrMarkup();
		    if ( foundMarkup ) {
		        // remove the abbr
		        GENTICS.Utils.Dom.removeFromDOM( foundMarkup, range, true );
		        // select the (possibly modified) range
		        range.select();
		    }
		},

		/**
		 * Make the given jQuery object (representing an editable) clean for saving
		 * Find all abbrs and remove editing objects
		 * @param obj jQuery object to make clean
		 * @return void
		 */
		makeClean: function ( obj ) {
			// nothing to do...
		},

		/**
		* toString method
		* @return string
		*/
		toString: function () {
			return 'abbr';
		}

	} );
	
} );
