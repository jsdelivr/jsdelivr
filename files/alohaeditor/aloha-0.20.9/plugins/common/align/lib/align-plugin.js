/*
* Aloha Align Plugin - Allow text alignment in Aloha Editor
* Copyright (C) 2010 by Thomas Lété - http://twitter.com/taoma_k
* Licensed unter the terms of LGPL http://www.gnu.org/copyleft/lesser.html
*
*/

define(
['aloha', 'aloha/plugin', 'aloha/floatingmenu', 'i18n!align/nls/i18n', 'i18n!aloha/nls/i18n', 'aloha/jquery', 'css!align/css/align.css'],
function(Aloha, Plugin, FloatingMenu, i18n, i18nCore, jQuery) {
	

	var
		GENTICS = window.GENTICS;
	
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
				switch(this.lastAlignment)
				{
					case 'right':
						this.alignRightButton.setPressed(false);
						break;

					case 'left':
						this.alignLeftButton.setPressed(false);
						break;

					case 'center':
						this.alignCenterButton.setPressed(false);
						break;

					case 'justify':
						this.alignJustifyButton.setPressed(false);
						break;
				}

				switch(this.alignment)
				{
					case 'right':
						this.alignRightButton.setPressed(true);
						break;

					case 'center':
						this.alignCenterButton.setPressed(true);
						break;

					case 'justify':
						this.alignJustifyButton.setPressed(true);
						break;

					default:
						this.alignLeftButton.setPressed(true);
						this.alignment  = 'left';
						break;
				}
			}

			this.lastAlignment = this.alignment;
		},

		/**
		 * applys a configuration specific for an editable
		 * buttons not available in this configuration are hidden
		 * @param {Object} id of the activated editable
		 * @return void
		 */
		applyButtonConfig: function (obj) {
			
			if (typeof this.settings.alignment === 'undefined') {
				var config = this.config.alignment;
			} else {
				var config = this.settings.alignment;
			}
			
			if ( jQuery.inArray('right', config) != -1) {
				this.alignRightButton.show();
			} else {
				this.alignRightButton.hide();
			}

			if ( jQuery.inArray('left', config) != -1) {
				this.alignLeftButton.show();
			} else {
				this.alignLeftButton.hide();
			}

			if ( jQuery.inArray('center', config) != -1) {
				this.alignCenterButton.show();
			} else {
				this.alignCenterButton.hide();
			}

			if ( jQuery.inArray('justify', config) != -1) {
				this.alignJustifyButton.show();
			} else {
				this.alignJustifyButton.hide();
			}
		},

		createButtons: function () {
		    var that = this;

		    // create a new button
		    this.alignLeftButton = new Aloha.ui.Button({
			  'name' : 'alignLeft',
		      'iconClass' : 'aloha-button-align aloha-button-align-left',
		      'size' : 'small',
		      'onclick' : function () { that.align('left'); },
		      'tooltip' : i18n.t('button.alignleft.tooltip'),
		      'toggle' : true
		    });

		    // add it to the floating menu
		    FloatingMenu.addButton(
		      'Aloha.continuoustext',
		      this.alignLeftButton,
		      i18nCore.t('floatingmenu.tab.format'),
		      1
		    );

		    // create a new button
		    this.alignCenterButton = new Aloha.ui.Button({
		      'name' : 'alignCenter',
		      'iconClass' : 'aloha-button-align aloha-button-align-center',
		      'size' : 'small',
		      'onclick' : function () { that.align('center'); },
		      'tooltip' : i18n.t('button.aligncenter.tooltip'),
		      'toggle' : true
		    });

		    // add it to the floating menu
		    FloatingMenu.addButton(
		      'Aloha.continuoustext',
		      this.alignCenterButton,
		      i18nCore.t('floatingmenu.tab.format'),
		      1
		    );

		    // create a new button
		    this.alignRightButton = new Aloha.ui.Button({
		      'name' : 'alignRight',
		      'iconClass' : 'aloha-button-align aloha-button-align-right',
		      'size' : 'small',
		      'onclick' : function () { that.align('right'); },
		      'tooltip' : i18n.t('button.alignright.tooltip'),
		      'toggle' : true
		    });

		    // add it to the floating menu
		    FloatingMenu.addButton(
		      'Aloha.continuoustext',
		      this.alignRightButton,
		      i18nCore.t('floatingmenu.tab.format'),
		      1
		    );

		    // create a new button
		    this.alignJustifyButton = new Aloha.ui.Button({
		      'name' : 'alignJustify',
		      'iconClass' : 'aloha-button-align aloha-button-align-justify',
		      'size' : 'small',
		      'onclick' : function () { that.align('justify'); },
		      'tooltip' : i18n.t('button.alignjustify.tooltip'),
		      'toggle' : true
		    });

		    // add it to the floating menu
		    FloatingMenu.addButton(
		      'Aloha.continuoustext',
		      this.alignJustifyButton,
		      i18nCore.t('floatingmenu.tab.format'),
		      1
		    );

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

		    // Iterates the whole selectionTree and align
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
						this.alignRightButton.setPressed(false);
						break;

					case 'left':
						this.alignLeftButton.setPressed(false);
						break;

					case 'center':
						this.alignCenterButton.setPressed(false);
						break;

					case 'justify':
						this.alignJustifyButton.setPressed(false);
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
