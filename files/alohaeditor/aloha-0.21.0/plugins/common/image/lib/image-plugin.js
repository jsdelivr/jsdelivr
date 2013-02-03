/*global documents: true define: true*/
/*
* Aloha Image Plugin - Allow image manipulation in Aloha Editor
* 
* Author & Copyright (c) 2011 Gentics Software GmbH
* aloha-sales@gentics.com
* Contributors 
*		Johannes Schüth - http://jotschi.de
*		Nicolas karageuzian - http://nka.me/
*		Benjamin Athur Lupton - http://www.balupton.com/
*		Thomas Lete
*		Nils Dehl
*		Christopher Hlubek
*		Edward Tsech
*		Haymo Meran
*
* Licensed under the terms of http://www.aloha-editor.com/license.html
*/

define([
	// js
	'jquery',
	'aloha/plugin',
	'image/image-floatingMenu',
	'i18n!aloha/nls/i18n',
	'i18n!image/nls/i18n',
	'jqueryui',
	'image/vendor/jcrop/jquery.jcrop.min',
	'image/vendor/mousewheel/mousewheel'
], function AlohaImagePlugin(
	aQuery,
	Plugin,
	ImageFloatingMenu,
	i18nCore,
	i18n
){
	
	
	
	var jQuery = aQuery;
	var $ = aQuery;
	var GENTICS = window.GENTICS;
	var Aloha = window.Aloha;
	
	// Attributes manipulation utilities
	// Aloha team may want to factorize, it could be useful for other plugins
	// Prototypes
	String.prototype.toInteger = String.prototype.toInteger || function () {
		return parseInt(String(this).replace(/px$/, '') || 0, 10);
	};
	String.prototype.toFloat = String.prototype.toInteger || function () {
		return parseFloat(String(this).replace(/px$/, '') || 0, 10);
	};
	Number.prototype.toInteger = Number.prototype.toInteger || String.prototype.toInteger;
	Number.prototype.toFloat = Number.prototype.toFloat || String.prototype.toFloat;

	// Insert jQuery Prototypes	
	jQuery.extend(true, jQuery.fn, {
		increase: jQuery.fn.increase || function (attr) {
			var	obj = jQuery(this), value, newValue;
			if (!obj.length) {
				return obj;
			}
			value = obj.css(attr).toFloat();
			newValue = Math.round((value || 1) * 1.2);
			// when value is 2, won't increase
			if (value === newValue) {
				newValue++;
			}
			obj.css(attr, newValue);
			return obj;
		},
		decrease: jQuery.fn.decrease || function (attr) {
			var	obj = jQuery(this), value, newValue;
			// Check
			if (!obj.length) {
				return obj;
			}
			// Calculate
			value = obj.css(attr).toFloat();
			newValue = Math.round((value || 0) * 0.8);
			// Apply
			if (value === newValue && newValue > 0) {
				// when value is 2, won't increase
				newValue--;
			}
			obj.css(attr, newValue);
			// Chain
			return obj;
		}
	});

	// Create and register Image Plugin
	return Plugin.create('image', {

		languages: ['en', 'fr', 'de', 'ru', 'cz'],

		defaultSettings: {
			'maxWidth': 1600,
			'minWidth': 3,
			'maxHeight': 1200,
			'minHeight': 3,
			// This setting will correct manually values that are out of bounds
			'autoCorrectManualInput': true,	 
			// This setting will define a fixed aspect ratio for all resize actions
			'fixedAspectRatio' : false, 
			// When enabled this setting will order the plugin to automatically resize images to given bounds
			'autoResize': false,
			//Image manipulation options - ONLY in default config section
			ui: {
				oneTab		: false, //Place all ui components within one tab
				insert      : true, // Shows an insert button on std floatingMenu scope
				reset		: true, // Reset to default size
				aspectRatioToggle: true, // Toggle button for the aspect ratio 
				align		: true,	// Menu elements to show/hide in menu
				resize		: true,	// Resize buttons
				meta		: true, // Shows field for changing src and title attributes of an image
				margin		: true, // shows button to increase/decrease image margin properties
				crop		: true, // enable/show crop actions on a image
				resizable	: true,	// Resizable ui-drag image
				handles     : 'ne, se, sw, nw'   // set handles for resize
			},
			
			/**
			 * Crop callback is triggered after the user clicked accept to accept his crop
			 * @param image jquery image object reference
			 * @param props cropping properties
			 */
			onCropped: function ($image, props) {
				Aloha.Log.info('Default onCropped invoked', $image, props);
			},
			
			/**
			 * Reset callback is triggered before the internal reset procedure is applied
			 * if this function returns true, then the reset has been handled by the callback
			 * which means that no other reset will be applied
			 * if false is returned the internal reset procedure will be applied
			 * @param image jquery image object reference
			 * @return true if a reset has been applied, false otherwise
			 */
			onReset: function ($image) {
				Aloha.Log.info('Default onReset invoked', $image);
				return false;
			},
			
			/**
			 * Example callback method which gets called while the resize process is beeing executed.
			 */
			onResize: function ($image) {
				Aloha.Log.info('Default onResize invoked', $image);
			},
			
			/**
			 * Resize callback is triggered after the internal resize procedure is applied.  
			 */
			onResized: function ($image) {
				Aloha.Log.info('Default onResized invoked', $image);
			}
		},
		
		/**
		 * Internal callback hook which gets invoked when cropping has been finished
		 */
		_onCropped: function ($image, props) {
			$('#' + this.ui.imgResizeHeightField.getInputId()).val($image.height());
			$('#' + this.ui.imgResizeWidthField.getInputId()).val($image.width());
			
			
			$('body').trigger('aloha-image-cropped', [$image, props]);
			
			// Call the custom onCropped function
			this.onCropped($image, props);
		},

		/**
		 * Internal callback hook which gets invoked when resetting images
		 */
		_onReset: function ($image) {
			
			$('#' + this.ui.imgResizeHeightField.getInputId()).val($image.height());
			$('#' + this.ui.imgResizeWidthField.getInputId()).val($image.width());
			
			// No default behaviour defined besides event triggering
			$('body').trigger('aloha-image-reset', $image);
			
			// Call the custom resize function
			return this.onReset($image);
		},
		
		/**
		 * Internal callback hook which gets invoked while the image is beeing resized
		 */
		_onResize: function ($image) {

			$('#' + this.ui.imgResizeHeightField.getInputId()).val($image.height());
			$('#' + this.ui.imgResizeWidthField.getInputId()).val($image.width());
			
			// No default behaviour defined besides event triggering
			$('body').trigger('aloha-image-resize', $image);
			
			// Call the custom resize function
			this.onResize($image);
		},

		/**
		 * Internal callback hook which gets invoked when the current resizing action has stopped
		 */
		_onResized: function ($image) {
			
			$('#' + this.ui.imgResizeHeightField.getInputId()).val($image.height());
			$('#' + this.ui.imgResizeWidthField.getInputId()).val($image.width());

			$('body').trigger('aloha-image-resized', $image);
			
			// Call the custom resize function
			this.onResized($image);
		},
		
		/**
		 * The image that is currently edited
		 */
		imageObj: null,
		
		/**
		 * The Jcrop API reference
		 * this is needed to be able to destroy the cropping frame later on
		 * the variable is linked to the api object whilst cropping, or set to null otherwise
		 * strange, but done as documented http://deepliquid.com/content/Jcrop_API.html
		 */
		jcAPI: null,
		
		
		/**
		 * State variable for the aspect ratio toggle feature 
		 */
		keepAspectRatio: false,
		
		/**
		 * Variable that will hold the start aspect ratio. This ratio will be used once starResize will be called.  
		 */
		startAspectRatio: false, 
		
		/**
		 * This will contain an image's original properties to be able to undo previous settings
		 *
		 * when an image is clicked for the first time, a new object will be added to the array
		 * {
		 *		obj : [the image object reference],
		 *		src : [the original src url],
		 *		width : [initial width],
		 *		height : [initial height]
		 * }
		 *
		 * when an image is clicked the second time, the array will be checked for the image object
		 * referenct, to prevent for double entries
		 */
		restoreProps: [],

		objectTypeFilter: [],

		/**
		 * Plugin initialization method
		 */
		init: function () {

			var plugin = this;
			
			var imagePluginUrl = Aloha.getPluginUrl('image');
			
			
			
			// Extend the default settings with the custom ones (done by default)
			plugin.startAspectRatio = plugin.settings.fixedAspectRatio; 
			plugin.config = plugin.defaultSettings;
			plugin.settings = jQuery.extend(true, plugin.defaultSettings, plugin.settings);
			
			plugin.initializeUI();
			plugin.bindInteractions();
			plugin.subscribeEvents();

		},

		/**
		* Create buttons
		*/
		initializeUI: function () {
			
			var that = this;

			this.ui = new ImageFloatingMenu();
			this.ui.init(this);
		},
		/**
		 * Bind plugin interactions
		 */
		bindInteractions: function () {
			var	plugin = this;
			
			if (plugin.settings.ui.resizable) {
				try {
					// this will disable mozillas image resizing facilities
					document.execCommand('enableObjectResizing', false, false);
				} catch (e) {
					Aloha.Log.info(e, 'Could not disable enableObjectResizing');
					// this is just for internet explorer, who will not support disabling enableObjectResizing
				}
			}

			if (plugin.settings.ui.meta) {
				// update image object when src changes
				plugin.ui.imgSrcField.addListener('keyup', function (event) {
					plugin.srcChange();
				});

				plugin.ui.imgSrcField.addListener('blur', function (event) {
					// TODO remove image or do something usefull if the user leaves the
					// image without defining a valid image src.
					var img = jQuery(plugin.ui.imgSrcField.getTargetObject());
					if (img.attr('src') === '') {
						img.remove();
					} // image removal when src field is blank
				});
			}
			
			// Override the default method by using the given one
			if (plugin.settings.onCropped && typeof plugin.settings.onCropped === "function") {
				plugin.onCropped = plugin.settings.onCropped;
			}
			
			// Override the default method by using the given one
			if (plugin.settings.onReset && typeof plugin.settings.onReset === "function") {
				plugin.onReset = plugin.settings.onReset;
			}

			// Override the default method by using the given one
			if (plugin.settings.onResized && typeof plugin.settings.onResized === "function") {
				plugin.onResized = plugin.settings.onResized;
			}
			
			// Override the default method by using the given one
			if (plugin.settings.onResize && typeof plugin.settings.onResize === "function") {
				plugin.onResize = this.settings.onResize;
			}
			
		},

		/**
		 * Subscribe to Aloha events and DragAndDropPlugin Event
		 */
		subscribeEvents: function () {
			var	plugin = this;
			var config = this.settings;
			
			jQuery('img').filter(config.globalselector).unbind();
			jQuery('img').filter(config.globalselector).click(function (event) {
				plugin.clickImage(event);
			});

			Aloha.bind('aloha-drop-files-in-editable', function (event, data) {
				var img, len = data.filesObjs.length, fileObj, config;

				while (--len >= 0) {
					fileObj = data.filesObjs[len];
					if (fileObj.file.type.match(/image\//)) {
						config = plugin.getEditableConfig(data.editable);
						// Prepare
						img = jQuery('<img/>');
						img.css({
							"max-width": that.maxWidth,
							"max-height": that.maxHeight
						});
						img.attr('id', fileObj.id);
						if (typeof fileObj.src === 'undefined') {
							img.attr('src', fileObj.data);
							//fileObj.src = fileObj.data ;
						} else {
							img.attr('src', fileObj.src);
						}
						GENTICS.Utils.Dom.insertIntoDOM(img, data.range, jQuery(Aloha.activeEditable.obj));
					}
				}
				
			});
			/*
			 * Add the event handler for selection change
			 */
			Aloha.bind('aloha-selection-changed', function (event, rangeObject, originalEvent) {
				var config, foundMarkup;
				if (originalEvent && originalEvent.target) {
					// Check if the element is currently beeing resized
					if (plugin.settings.ui.resizable && !jQuery(originalEvent.target).hasClass('ui-resizable-handle')) {
						plugin.endResize();
						plugin.imageObj = null;
						Aloha.trigger('aloha-image-unselected');
					}
				}

				if (Aloha.activeEditable !== null) {
					foundMarkup = plugin.findImgMarkup(rangeObject);
					config = plugin.getEditableConfig(Aloha.activeEditable.obj);

					if (typeof config !== 'undefined') {
						plugin.ui._insertImageButton.show();
					} else {
						plugin.ui._insertImageButton.hide();
						return;
					}

					// Enable image specific ui components if the element is an image
					if (foundMarkup) { // TODO : this is always null (below is dead code, moving it to clickImage)
						plugin.ui._insertImageButton.show();
						plugin.ui.setScope();
						if (plugin.settings.ui.meta) {
							plugin.ui.imgSrcField.setTargetObject(foundMarkup, 'src');
							plugin.ui.imgTitleField.setTargetObject(foundMarkup, 'title');
						}
						plugin.ui.imgSrcField.foreground();
						plugin.ui.imgSrcField.focus();
					} else {
						if (plugin.settings.ui.meta) {
							plugin.ui.imgSrcField.setTargetObject(null);
						}
					}
					// TODO this should not be necessary here!
					plugin.ui.doLayout();
				}

			});
			
			Aloha.bind('aloha-editable-created', function (event, editable) {

				try {
					// this will disable mozillas image resizing facilities
					document.execCommand('enableObjectResizing', false, false);
				} catch (e) {
					Aloha.Log.info(e, 'Could not disable enableObjectResizing');
					// this is just for others, who will not support disabling enableObjectResizing
				}

				// Inital click on images will be handled here
				// editable.obj.find('img').attr('_moz_resizing', false);
				// editable.obj.find('img').contentEditable(false);
				editable.obj.delegate('img', 'mouseup', function (event) {
					plugin.clickImage(event);
					event.stopPropagation();
				});
			});

			plugin._subscribeToResizeFieldEvents();

		},
		
		
		/**
		 * Automatically resize the image to fit into defined bounds.
		 */
		autoResize: function() {
			// @todo add an option to do just down scaling and not upscale when image is too small
			// @todo handle ratio mismatches (eg 4:3 is set but image is 16:9 --> image need to be cut)

			var that = this;

			var width = that.imageObj.width();
			var height = that.imageObj.height();
			var resize = false;

			// Only normalize the field values when the image exeeds the definded bounds
			if (width < that.settings.minWidth || 
				width > that.settings.maxWidth || 
				height < that.settings.minHeight || 
				height > that.settings.maxHeight) {
				resize = true;
			}

			if ( resize && width >= height ) {
				that._setNormalizedFieldValues('width');
				that.setSizeByFieldValue();
				return true;
			} else if ( resize && width < height ) {
				that._setNormalizedFieldValues('height');
				that.setSizeByFieldValue();
				return true;
			} else {
				return false;
			}
		},

		/**
		 * Toggle the keep aspect ratio functionallity
		 */
		toggleKeepAspectRatio: function() {

			this.keepAspectRatio = !this.keepAspectRatio;

			this.endResize();
			if (!this.keepAspectRatio) {
				this.startAspectRatio = false;
			} else {
				// If no fixed aspect ratio was given we will calculate a new start 
				// aspect ratio that will be used for the next starResize action.
				if ( typeof this.settings.fixedAspectRatio !== 'number' ) {
					var currentRatio = this.imageObj.width() / this.imageObj.height();
					this.startAspectRatio = currentRatio;
				} else {
					this.startAspectRatio = this.settings.fixedAspectRatio;
				}
			}
			this.startResize();
		},

		/**
		 * Bind interaction events that are invoked on the resize fields
		 */
		_subscribeToResizeFieldEvents: function () {
			var plugin = this;

			/**
			 * Helper function that will update the fields
			 */
			function updateField($field, delta, maxValue, minValue) {

				if (typeof minValue === 'undefined') {
					minValue = 0;
				}

				if (typeof maxValue === 'undefined') {
					maxValue = 8000;
				}

				// If the current value of the field can't be parsed we don't update it
				var oldValue = parseInt($field.val(), 10);
				if (isNaN(oldValue)) {
					$field.css('background-color', 'red');
					return false;
				}

				var newValue = oldValue + delta;
				// Exit if the newValue is above the maxValue limit (only if the user tries to increment) 
				if (delta >= 0 && newValue > maxValue) {

					// Auto correct out of bounds values
					if (plugin.settings.autoCorrectManualInput) {
						$field.val(maxValue);
						return true;
					} else {
						$field.css('background-color', 'red');
						return false;
					}
				 // Exit if the newValue is below the minValue (only if the user tries to decrement)
				 } else if (delta <= 0 && newValue < minValue) {
					
					// Auto correct out of bounds values
					if (plugin.settings.autoCorrectManualInput) {
						$field.val(minValue);
						return true;
					} else {
						$field.css('background-color', 'red');
						return false;
					}
				} else {
					$field.css('background-color', '');
				}
				$field.val(oldValue + delta);
				return true;
			};

			/**
			 * Handle the keyup event on the field
			 */
			function handleKeyUpEventOnField(e) {
				
				// Load the max/min from the data properties of this event
				var minValue = e.data.minValue;
				var maxValue = e.data.maxValue;
				var fieldName = e.data.fieldName;
				
				// Allow backspace and delete
				if (e.keyCode === 8 || e.keyCode === 46) {
					if($(this).val() >= minValue) {
						
						// Check if we are currently in cropping mode
						if (typeof plugin.jcAPI !== 'undefined' && plugin.jcAPI !== null) {
							plugin.setCropAreaByFieldValue();
						} else {
							// 1. Normalize the size
							plugin._setNormalizedFieldValues(fieldName);
							// 2. Set the final size to the image
							plugin.setSizeByFieldValue();
						}
					}
				// 0-9 keys
				} else if (e.keyCode <= 57 && e.keyCode >= 48 || e.keyCode <= 105 && e.keyCode >= 96 ) {
					if ($(this).val() >= minValue) {
						
						// Check if we are currently in cropping mode
						if (typeof plugin.jcAPI !== 'undefined' && plugin.jcAPI !== null) {
							plugin.setCropAreaByFieldValue();
						} else {
							// 1. Normalize the size
							plugin._setNormalizedFieldValues(fieldName);
							// 2. Set the final size to the image
							plugin.setSizeByFieldValue();
						}
					}
				} else {
					var delta = 0;
					if (e.keyCode === 38 || e.keyCode === 107) {
						delta = +1;
					} else if (e.keyCode === 40 || e.keyCode === 109) {
						delta = -1;
					}
					// Handle key combinations 
					if (e.shiftKey || e.metaKey || e.ctrlKey) {
						delta = delta * 10;
					}
					
					// Only resize when field values are ok
					if (updateField($(this), delta, maxValue, minValue)) {
						// Check if we are currently in cropping mode
						if (typeof plugin.jcAPI !== 'undefined' && plugin.jcAPI !== null) {
							plugin.setCropAreaByFieldValue();
						} else {
							// 1. Normalize the size
							plugin._setNormalizedFieldValues(fieldName);
							// 2. Set the final size to the image
							plugin.setSizeByFieldValue();
						}
					}
				}
				
				e.preventDefault();
				return false;
			}

			/**
			 * Handle the mouse wheel event on the field
			 */
			function handleMouseWheelEventOnField(e, delta) {
				var minValue = e.data.minValue;
				var maxValue = e.data.maxValue;
				var fieldName = e.data.fieldName;

				// Handle key combinations 
				if (e.shiftKey || e.metaKey || e.ctrlKey) {
					delta = delta * 10;
				}

				// Only resize when field values are ok
				if (updateField($(this), delta, maxValue, minValue)) {

					// Check if we are currently in cropping mode
					if (typeof plugin.jcAPI !== 'undefined' && plugin.jcAPI !== null) {
						plugin.setCropAreaByFieldValue();
					} else {
						// 1. Normalize the size
						plugin._setNormalizedFieldValues(fieldName);
						// 2. Set the final size to the image
						plugin.setSizeByFieldValue();
					}
				}
		        return false;
			}

			/**
			 * Handle mousewheel,keyup actions on both fields
			 */
			var $heightField = $('#' + plugin.ui.imgResizeHeightField.getInputId());
			var heightEventData = {fieldName: 'height', maxValue: plugin.ui.imgResizeHeightField.maxValue, minValue: plugin.ui.imgResizeHeightField.minValue };
			$heightField.live('keyup', heightEventData, handleKeyUpEventOnField);
			$heightField.live('mousewheel', heightEventData, handleMouseWheelEventOnField);
			
			var $widthField = $('#' + plugin.ui.imgResizeWidthField.getInputId());
			var widthEventData = {fieldName: 'width', maxValue: plugin.ui.imgResizeWidthField.maxValue, minValue: plugin.ui.imgResizeWidthField.minValue};
			$widthField.live('keyup', widthEventData, handleKeyUpEventOnField);
			$widthField.live('mousewheel', widthEventData, handleMouseWheelEventOnField);
			
		},

		
		/**
		 * This helper function will keep the aspect ratio for the field with the given name.
		 *
		 * @param {string} primaryFieldName What should be used as primary option to calculate (can be 'width' or 'height')
		 */
		_setNormalizedFieldValues: function (primaryFieldName) {

			var plugin = this;
			var widthField = jQuery("#" + plugin.ui.imgResizeWidthField.getInputId());
			var heightField = jQuery("#" + plugin.ui.imgResizeHeightField.getInputId());
			var width = widthField.val();
			var height = heightField.val();

			var size = plugin._normalizeSize(width, height, primaryFieldName);

			widthField.val(size.width);
			heightField.val(size.height);
			
		},

		/**
		 * Manually set the given size for the current image
		 */
		setSize: function (width, height) {
			
			var plugin = this;
			plugin.imageObj.width(width);
			plugin.imageObj.height(height);
			var $wrapper = plugin.imageObj.closest('.Aloha_Image_Resize');
			$wrapper.height(height);
			$wrapper.width(width);

			plugin._onResize(plugin.imageObj);
			plugin._onResized(plugin.imageObj);
		},

		/**
		 * This method will handle the mouseUp event on images (eg. within editables). 
		 * It will if enabled activate the resizing action.
		 */
		clickImage: function (e) {

			var plugin = this;
			plugin.endResize(); // removes previous resize handler
			plugin.imageObj = jQuery(e.target);
			var currentImage = plugin.imageObj;
			
			
			plugin.ui.setScope();
			
			var editable = currentImage.closest('.aloha-editable');
			
			// Disabling the content editable. This will disable the resizeHandles in internet explorer
			// already done in resize on a smaller scope, this block next aloha-selection-change event
			// to be thrown
			// editable.contentEditable(false);
			
			//Store the current props of the image
			this.restoreProps.push({
				obj : e.srcElement,
				src : plugin.imageObj.attr('src'),
				width : plugin.imageObj.width(),
				height : plugin.imageObj.height()
			});

			// Update the resize input fields with the new width and height
			$('#' + plugin.ui.imgResizeHeightField.getInputId()).val(plugin.imageObj.height());
			$('#' + plugin.ui.imgResizeWidthField.getInputId()).val(plugin.imageObj.width());
			
			if (plugin.settings.ui.meta) {
				plugin.ui.imgSrcField.setTargetObject(plugin.imageObj, 'src');
				plugin.ui.imgTitleField.setTargetObject(plugin.imageObj, 'title');
			}
			Aloha.Selection.preventSelectionChanged();
			try {
				plugin.ui.imgSrcField.focus();
			} catch(e) {
				// FIXME for some reason execution breaks at this point
			}

			if (plugin.settings.ui.resizable) {
				plugin.startResize();
			}
			
			
			if (plugin.settings.autoResize) {
				plugin.autoResize();
			}
			Aloha.Selection.preventSelectionChangedFlag = false;
			Aloha.trigger('aloha-image-selected');
		},

		/**
		 * This method extracts determins if the range selection contains an image
		 * 
		 * UNUSED as long as clickImage don't change the selection
		 * @see getPluginFocus instead
		 */
		findImgMarkup: function (range) {

			var plugin = this;
			var config = this.config;
			var result, targetObj;

			if (typeof range === 'undefined') {
				range = Aloha.Selection.getRangeObject();
			}

			targetObj = jQuery(range.startContainer);

			try {
				if (Aloha.activeEditable) {
					if ((typeof range.startContainer !== 'undefined' &&
						typeof range.startContainer.childNodes !== 'undefined' &&
						typeof range.startOffset !== 'undefined' &&
						typeof range.startContainer.childNodes[range.startOffset] !== 'undefined' &&
						range.startContainer.childNodes[range.startOffset].nodeName.toLowerCase() === 'img' &&
						range.startOffset + 1 === range.endOffset) ||
						(targetObj.hasClass('Aloha_Image_Resize')))
					{
						result = targetObj.find('img')[0];
						if (! result.css) {
							result.css = '';
						}
						
						if (! result.title) {
							result.title = '';
						}
						
						if (! result.src) {
							result.src = ''; 
						}
						return result;
					}
					else {
						return null;
					}
				}
			} catch (e) {
				Aloha.Log.debug(e, "Error finding img markup.");
			}
			return null;
		},
		/**
		 * Gets the plugin focus target
		 */
		getPluginFocus: function () {
			return this.imageObj;
		},

		/**
		 * This helper function will calculate the new width and height while keeping 
		 * the aspect ratio when the keepAspectRatio flag is set to true. The primarySize 
		 * can be 'width' or 'height'. The function will first try to normalize the opposite size.
		 *
		 * @param {integer} width Target width for the new image size
		 * @param {integer} height Target height for the new image size
		 * @param {integer} primarySize can be 'width' or 'height'
		 * @return Image width and height.
		 */
		_normalizeSize: function( width, height, primarySize ) {
			var that = this;
			// Convert string values to numbers
			width = parseInt(width); 
			height = parseInt(height);

			/**
			 * Inner function that calculates the new height by examining the width 
			 */
			function handleHeight( callHandleWidth ) {
				// Check whether the value is within bounds 
				if ( height > that.settings.maxHeight ) {
					// Throw a notification event
					var eventProps = { 'org': height, 'new': that.settings.maxHeight};
					$('body').trigger('aloha-image-resize-outofbounds', ["height", "max", eventProps]);
					height = that.settings.maxHeight;
				} else if ( height < that.settings.minHeight ) {
					// Throw a notification event
					var eventProps = { 'org': height, 'new': that.settings.minHeight};
					$('body').trigger('aloha-image-resize-outofbounds', ["height", "min", eventProps]);
					height = that.settings.minHeight;
				}

				if ( that.keepAspectRatio ) {
					width = height * aspectRatio;

					// We don't want to invoke handleWidth again. This would mess up our previously calculated width
					if ( callHandleWidth ) {
						handleWidth( false );
					}
				}
			}

			/**
			 * Inner function that calculates the new width by examining the width
			 */
			function handleWidth( callHandleHeight ) {

				// Check whether the value is within bounds 
				if (width > that.settings.maxWidth) {
				
					// Throw a notification event
					var eventProps = { 'org': width, 'new': that.settings.maxWidth};
					$('body').trigger('aloha-image-resize-outofbounds', ["width", "max", eventProps]);
				
					width = that.settings.maxWidth;
				} else if ( width < that.settings.minWidth ) {
					// Throw a notification event
					var eventProps = { 'org': width, 'new': that.settings.minWidth};
					$('body').trigger('aloha-image-resize-outofbounds', ["width", "min", eventProps]);

					width = that.settings.minWidth;
				}

				// Calculate the new height
				if ( that.keepAspectRatio ) {
					height = width / aspectRatio;
				
					// We don't want to invoke handleHeight again. This would mess up our previously calculated height
					if ( callHandleHeight ) {
						handleHeight( false );
					}
				
				}
			
			}

			// use the 4:3 ratio as default value.
			var aspectRatio = 1.33333;

			// if keepAspectRatio is set to true, calculate it from the image size
			if ( that.keepAspectRatio ) {
				aspectRatio = width / height;
			}

			if ( typeof that.startAspectRatio === 'number' ) {
				aspectRatio = that.startAspectRatio;
			}  

			// Determin which size should be handled
			if ( primarySize == 'width' ) {
				handleWidth( true );
			}

			if ( primarySize == 'height' ) {
				handleHeight( true );
			}

			// Floor the values return them
			return { 'width': Math.floor( width ), 'height': Math.floor( height ) };
		},

		/**
		 * Helper function that will set the new image size using the field values
		 */
		setSizeByFieldValue: function () {
			var plugin = this;
			var width =  $('#' + plugin.ui.imgResizeWidthField.getInputId()).val();
			var height = $('#' + plugin.ui.imgResizeHeightField.getInputId()).val();
			plugin.setSize(width, height);
		},
		
		/**
		 * Helper function that will set the new crop area width and height using the field values
		 */
		setCropAreaByFieldValue: function () {
			var plugin = this;
			var currentCropArea = plugin.jcAPI.tellSelect();

			var width =  $('#' + plugin.ui.imgResizeWidthField.getInputId()).val();
			width = parseInt(width, 10);
			var height = $('#' + plugin.ui.imgResizeHeightField.getInputId()).val();
			height = parseInt(height, 10);

			var selection = [currentCropArea['x'], currentCropArea['y'], currentCropArea['x'] + width,currentCropArea['y'] + height];
			plugin.jcAPI.setSelect(selection);
		},

		/**
		* This method will insert a new image dom element into the dom tree
		*/		
		insertImg: function () {
				var range = Aloha.Selection.getRangeObject(),
				config = this.getEditableConfig(Aloha.activeEditable.obj),
				imagePluginUrl = Aloha.getPluginUrl('image'),
				imagestyle, imagetag, newImg;

				if (range.isCollapsed()) {
					// TODO I would suggest to call the srcChange method. So all image src
					// changes are on one single point.
					imagestyle = "max-width: " + config.maxWidth + "; max-height: " + config.maxHeight;
					imagetag = '<img style="' + imagestyle + '" src="' + imagePluginUrl + '/img/blank.jpg" title="" />';
					newImg = jQuery(imagetag);
					// add the click selection handler
					//newImg.click( Aloha.Image.clickImage ); - Using delegate now
					GENTICS.Utils.Dom.insertIntoDOM(newImg, range, jQuery(Aloha.activeEditable.obj));

			} else {
				Aloha.Log.error('img cannot markup a selection');
				// TODO the desired behavior could be me the selected content is
				// replaced by an image.
				// TODO it should be editor's choice, with an NON-Ext Dialog instead of alert

			}
		},

		srcChange: function () {
			// TODO the src changed. I suggest :
			// 1. set an loading image (I suggest set src base64 enc) to show the user
			// we are trying to load an image
			// 2. start a request to get the image
			// 3a. the image is ok change the src
			// 3b. the image is not availbable show an error.
			 this.imageObj.attr('src', this.ui.imgSrcField.getValue()); // (the img tag)
//			 jQuery(img).attr('src', this.imgSrcField.getQueryValue()); // (the query value in the inputfield)
//			 this.imgSrcField.getItem(); // (optinal a selected resource item)
			// TODO additionally implement an srcChange Handler to let implementer
			// customize
		},

		/**
		 * Reposition the crop buttons below the crop area
		 */
		positionCropButtons: function() {
		
			var jt = jQuery('.jcrop-tracker:first'),
				off = jt.offset(),
				jtt = off.top,
				jtl = off.left,
				jth = jt.height(),
				jtw = jt.width();

			var oldLeft = 0,
				oldTop = 0;

			var btns = jQuery('#aloha-CropNResize-btns');
			
			// Hack to hide the buttons when the user just clicked into the image
			if (jtt === 0 && jtl === 0) {
				btns.hide();
			}
			
			// move the icons to the bottom right side
			jtt = parseInt(jtt + jth + 3, 10);
			jtl = parseInt(jtl + (jtw / 2) - (btns.width() / 2) + 10, 10);

			// comparison to old values hinders flickering bug in FF
			if (oldLeft != jtl || oldTop != jtt) {
				btns.offset({top: jtt, left: jtl});
			}

			oldLeft = jtl;
			oldTop = jtt;
		},

		/**
		 * Code imported from CropnResize Plugin
		 *
		 */
		initCropButtons: function() {
			var that = this,
				btns;

			jQuery('body').append(
				'<div id="aloha-CropNResize-btns" display="none">' +
					'<button class="cnr-crop-apply" title="' + i18n.t('Accept') + '"></button>' +
					'<button class="cnr-crop-cancel" title="' + i18n.t('Cancel') + '"></button>' +
				'</div>'
			);

			btns = jQuery('#aloha-CropNResize-btns');
			
			btns.find('.cnr-crop-apply').click(function () {
				that.acceptCrop();
			});
			
			btns.find('.cnr-crop-cancel').click(function () {
				that.endCrop();
			});

			this.interval = setInterval(function () {
				that.positionCropButtons();
			}, 10);
		},

		/**
		 * Destroy crop confirm and cancel buttons
		 */
		destroyCropButtons: function () {
			jQuery('#aloha-CropNResize-btns').remove();
			clearInterval(this.interval);
		},

		/**
		 * Helper function that will disable selectability of elements
		 */
		_disableSelection: function (el) {
			el.find('*').attr('unselectable', 'on')
			       .css({
			        '-moz-user-select':'none',
			        '-webkit-user-select':'none',
			        'user-select':'none'
			       });
			  /*
			       .each(function() {
			        this.onselectstart = function () { return false; };
			       });
			       */
			  
		},

		/**
		 * Initiate a crop action
		 */
		crop: function () {
			var plugin = this;
			var config = this.config;

			plugin.initCropButtons();
			if (plugin.settings.ui.resizable) {
				plugin.endResize();
			}
			
			plugin.jcAPI = jQuery.Jcrop(plugin.imageObj, {
				onSelect : function () {
					plugin._onCropSelect();
					// ugly hack to keep scope :(
					window.setTimeout(function () {
						plugin.ui.setScope();
					}, 10);
				}
			});
			
			plugin._disableSelection($('.jcrop-holder'));
			plugin._disableSelection($('#imageContainer'));
			plugin._disableSelection($('#aloha-CropNResize-btns'));
			$('body').trigger('aloha-image-crop-start', [plugin.imageObj]);
		},

		/**
		 * Internal on crop select method
		 */
		_onCropSelect: function () {
			var plugin = this;

			jQuery('#aloha-CropNResize-btns').fadeIn('slow');

			// Hide the crop buttons when the one of the handles is clicked
			jQuery('.jcrop-handle').mousedown(function () {
				jQuery('#aloha-CropNResize-btns').hide();
			});

			jQuery('.jcrop-tracker').mousedown(function () {
				jQuery('#aloha-CropNResize-btns').hide();
			});

			// Update the width and height field using the intiial active crop area values
			if (typeof plugin.jcAPI !== 'undefined' && plugin.jcAPI !== null) {

				plugin.positionCropButtons();
				var currentCropArea = plugin.jcAPI.tellSelect();
				
				var widthField = jQuery("#" + plugin.ui.imgResizeWidthField.getInputId()).val(currentCropArea['w']);
				var heightField = jQuery("#" + plugin.ui.imgResizeHeightField.getInputId()).val(currentCropArea['h']);
			}
			
		},


		/**
		 * Terminates a crop
		 */
		endCrop: function () {
			if (this.jcAPI) {
				this.jcAPI.destroy();
				this.jcAPI = null;
			}

			this.destroyCropButtons();
			this.ui._imageCropButton.setState(false);

			if (this.settings.ui.resizable) {
				this.startResize();
			}

			if (this.keepAspectRatio) {
				var currentRatio = this.imageObj.width() / this.imageObj.height();
				this.startAspectRatio = currentRatio;
			}
			
			$('body').trigger('aloha-image-crop-stop', [this.imageObj]);
		},

		/**
		 * Accept the current cropping area and apply the crop
		 */
		acceptCrop: function () {
			this._onCropped(this.imageObj, this.jcAPI.tellSelect());
			this.endCrop();
		},

		/**
		 * This method will activate the jquery-ui resize functionality for the current image
		 */
		startResize: function () {
			var plugin = this;
			var currentImageObj = this.imageObj;

			currentImageObj = this.imageObj.css({
				height		: this.imageObj.height(),
				width		: this.imageObj.width(),
				position	: 'relative',
				'max-height': '',
				'max-width'	: ''
			});

			currentImageObj.resizable({
				maxHeight : plugin.settings.maxHeight,
				minHeight : plugin.settings.minHeight,
				maxWidth  : plugin.settings.maxWidth,
				minWidth  : plugin.settings.minWidth,
				aspectRatio : plugin.startAspectRatio,
				handles: plugin.settings.handles,
				grid : plugin.settings.grid,
				resize: function (event, ui) { 
					plugin._onResize(plugin.imageObj);
				},
				stop : function (event, ui) {
					plugin._onResized(plugin.imageObj);
					
					// Workaround to finish cropping
					if (this.enableCrop) {
						window.setTimeout(function () {
							plugin.ui.setScope();
							that.done(event);
						}, 10);
					}
				}

			});

			currentImageObj.css('display', 'inline-block');

			// this will prevent the user from resizing an image
			// using IE's resize handles
			// however I could not manage to hide them completely
			jQuery('.ui-wrapper')
				.attr('contentEditable', false)
				.addClass('aloha-image-box-active Aloha_Image_Resize aloha')
				.css({
					position: 'relative',
					display: 'inline-block',
					'float': plugin.imageObj.css('float')
				})
				.bind('resizestart', function (e) {
					e.preventDefault();
				})
				.bind('mouseup', function (e) {
					e.originalEvent.stopSelectionUpdate = true;
				});
		},

		/**
		 * This method will end resizing and toggle buttons accordingly and remove all markup that has been added for cropping
		 */
		endResize: function () {
			// Find the nearest contenteditable and reenable it since resizing is finished
			if (this.imageObj) {
				var editable = this.imageObj.closest('.aloha-editable');
				//this.imageObj.contentEditable(true);
			}
			
			if (this.imageObj && this.imageObj.is(":ui-resizable")) {
				this.imageObj
					.resizable('destroy')
					.css({
						top	 : 0,
						left : 0
					});
			}
		},
		resetSize: function () {
			var	plugin = this,
				img = new Image();
			img.onload = function () {
				var myimage = plugin.getPluginFocus();
				if (plugin.settings.ui.resizable) {
					plugin.endResize();
				}
				jQuery(myimage).add(myimage.parent()).css({
						'width': img.width + 'px',
						'height': img.height + 'px',
						'max-width': '',
						'max-height': ''
					});
				if (plugin.settings.ui.resizable) {
					plugin.resize();
				}
			};
			img.src = plugin.getPluginFocus().attr('src');
		},
		/**
		 * Reset the image to it's original properties
		 */
		reset: function () {
			if (this.settings.ui.crop) {
				this.endCrop();
			}
			
			if (this.settings.ui.resizable) {
				this.endResize();
			}

			if (this._onReset(this.imageObj)) {
				// the external reset procedure has already performed a reset, so there is no need to apply an internal reset
				return;
			}

			for (var i = 0;i < this.restoreProps.length;i++) {
				// restore from restoreProps if there is a match
				if (this.imageObj.get(0) === this.restoreProps[i].obj) {
					this.imageObj.attr('src', this.restoreProps[i].src);
					this.imageObj.width(this.restoreProps[i].width);
					this.imageObj.height(this.restoreProps[i].height);
					return;
				}
			}
		}
	});

});
