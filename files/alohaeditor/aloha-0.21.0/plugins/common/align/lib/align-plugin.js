/* align-plugin.js is part of Aloha Editor project http://aloha-editor.org
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
	'aloha/plugin',
	'ui/ui',
	'ui/toggleButton',
	'i18n!align/nls/i18n',
	'i18n!aloha/nls/i18n',
	'jquery'
], function(
	Aloha,
    Plugin,
    Ui,
    ToggleButton,
    i18n,
    i18nCore,
    jQuery
) {
	

	var GENTICS = window.GENTICS;

	/**
	 * register the plugin with unique name
	 */
	 return Plugin.create('align', {
		_constructor: function(){
			this._super('align');
		},

		/**
		 * Configure the available languages
		 */
		languages: ['en', 'fr'],

		/**
		 * Configuration (available align options)
		 */
		config: {
			alignment: ['right','left','center','justify']
		},

		/**
		 * Alignment wanted by the user
		 */
		alignment: '',

		/**
		 * Alignment of the selection before modification
		 */
		lastAlignment: '',

		/**
		 * Initialize the plugin and set initialize flag on true
		 */
		init: function () {
			this.createButtons();

			var that = this;

			// apply specific configuration if an editable has been activated
			Aloha.bind('aloha-editable-activated', function (e, params) {
				that.applyButtonConfig(params.editable.obj);
			});

			// add the event handler for selection change
		    Aloha.bind('aloha-selection-changed', function(event, rangeObject) {
		    	if (Aloha.activeEditable) {
		    		that.buttonPressed(rangeObject);
		    	}
		    });
		},

		buttonPressed: function (rangeObject) {
			var that = this;

			rangeObject.findMarkup(function() {
		        that.alignment = jQuery(this).css('text-align');
		    }, Aloha.activeEditable.obj);

			if(this.alignment != this.lastAlignment)
			{
				// @FIXME: Switching between editables will not work becuase
				//         lastAlignment and alignment are shared across
				//         multiple editables.
				switch(this.lastAlignment)
				{
					case 'right':
						this._alignRightButton.setState(false);
						break;

					case 'left':
						this._alignLeftButton.setState(false);
						break;

					case 'center':
						this._alignCenterButton.setState(false);
						break;

					case 'justify':
						this._alignJustifyButton.setState(false);
						break;
				}

				switch(this.alignment)
				{
					case 'right':
						this._alignRightButton.setState(true);
						break;

					case 'center':
						this._alignCenterButton.setState(true);
						break;

					case 'justify':
						this._alignJustifyButton.setState(true);
						break;

					default:
						this._alignLeftButton.setState(true);
					    this.alignment = 'left';
						break;
				}

				this.lastAlignment = this.alignment;
			}
		},

		/**
		 * applys a configuration specific for an editable
		 * buttons not available in this configuration are hidden
		 * @param {Object} id of the activated editable
		 * @return void
		 */
		applyButtonConfig: function (obj) {
			var config = this.getEditableConfig(obj);

			if ( config && config.alignment && !this.settings.alignment ) {
				config = config;
			} else if ( config[0] && config[0].alignment) {
				config = config[0];
			} else if ( this.settings.alignment ) {
				config.alignment = this.settings.alignment;
			}

			if (typeof config.alignment === 'undefined') {
				config = this.config;
			}

			if ( jQuery.inArray('right', config.alignment) != -1) {
				this._alignRightButton.show(true);
			} else {
				this._alignRightButton.show(false);
			}

			if ( jQuery.inArray('left', config.alignment) != -1) {
				this._alignLeftButton.show(true);
			} else {
				this._alignLeftButton.show(false);
			}

			if ( jQuery.inArray('center', config.alignment) != -1) {
				this._alignCenterButton.show(true);
			} else {
				this._alignCenterButton.show(false);
			}

			if ( jQuery.inArray('justify', config.alignment) != -1) {
				this._alignJustifyButton.show(true);
			} else {
				this._alignJustifyButton.show(false);
			}
		},

		createButtons: function () {
		    var that = this;

			this._alignLeftButton = Ui.adopt("alignLeft", ToggleButton, {
				tooltip: i18n.t('button.alignleft.tooltip'),
				icon: 'aloha-icon aloha-icon-align aloha-icon-align-left',
				scope: 'Aloha.continuoustext',
				click: function(){ that.align('left'); }
			});

			this._alignCenterButton = Ui.adopt("alignCenter", ToggleButton, {
				tooltip: i18n.t('button.aligncenter.tooltip'),
				icon: 'aloha-icon aloha-icon-align aloha-icon-align-center',
				scope: 'Aloha.continuoustext',
				click: function(){ that.align('center'); }
			});

			this._alignRightButton = Ui.adopt("alignRight", ToggleButton, {
				tooltip: i18n.t('button.alignright.tooltip'),
				icon: 'aloha-icon aloha-icon-align aloha-icon-align-right',
				scope: 'Aloha.continuoustext',
				click: function(){ that.align('right'); }
			});

			this._alignJustifyButton = Ui.adopt("alignJustify", ToggleButton, {
				tooltip: i18n.t('button.alignjustify.tooltip'),
				icon: 'aloha-icon aloha-icon-align aloha-icon-align-justify',
				scope: 'Aloha.continuoustext',
				click: function(){ that.align('justify'); }
			});
		},

		/**
		 * Check whether inside a align tag
		 * @param {GENTICS.Utils.RangeObject} range range where to insert the object (at start or end)
		 * @return markup
		 * @hide
		 */
		findAlignMarkup: function ( range ) {

			var that = this;

			if ( typeof range === 'undefined' ) {
		        var range = Aloha.Selection.getRangeObject();
		    }
			if ( Aloha.activeEditable ) {
				return range.findMarkup(function() {
					return jQuery(this).css('text-align') == that.alignment;
			    }, Aloha.activeEditable.obj);
			} else {
				return null;
			}
		},

		/**
		 * Align the selection or remove it
		 */
		align: function ( tempAlignment ) {

			var range = Aloha.Selection.getRangeObject();

			this.lastAlignment = this.alignment;
			this.alignment = tempAlignment;

		    if (Aloha.activeEditable) {
		        if ( this.findAlignMarkup( range ) ) {
		            this.removeAlign();
		        } else {
		        	this.insertAlign();
		        }
		    }
		},

		/**
		 * Align the selection
		 */
		insertAlign: function () {
			var that = this;

			// do not align the range
			if ( this.findAlignMarkup( range ) ) {
					return;
			}
			// current selection or cursor position
			var range = Aloha.Selection.getRangeObject();

			// Check if the parent node is not the main editable node and align
			// OR iterates the whole selectionTree and align
			if (!GENTICS.Utils.Dom.isEditingHost(range.getCommonAncestorContainer()))
				jQuery(range.getCommonAncestorContainer()).css('text-align', this.alignment);
			else
				jQuery.each(Aloha.Selection.getRangeObject().getSelectionTree(), function () {
					if(this.selection !== 'none' && this.domobj.nodeType !== 3) {
						jQuery(this.domobj).css('text-align', that.alignment);
					}
				});

			if(this.alignment != this.lastAlignment)
			{
				switch(this.lastAlignment)
				{
					case 'right':
						this._alignRightButton.setState(false);
						break;

					case 'left':
						this._alignLeftButton.setState(false);
						break;

					case 'center':
						this._alignCenterButton.setState(false);
						break;

					case 'justify':
						this._alignJustifyButton.setState(false);
						break;
				}
			}

		    // select the (possibly modified) range
		    range.select();
		},

		/**
		 * Remove the alignment
		 */
		removeAlign: function () {

		    var range = Aloha.Selection.getRangeObject();

		    if ( this.findAlignMarkup( range ) ) {

		    	// Remove the alignment
		    	range.findMarkup(function() {
		            jQuery(this).css('text-align', '');
		        }, Aloha.activeEditable.obj);

		        // select the (possibly modified) range
		        range.select();
		    }
		}

	});

});
