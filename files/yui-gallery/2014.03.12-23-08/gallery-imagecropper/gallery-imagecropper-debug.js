YUI.add('gallery-imagecropper', function(Y) {

'use strict';
/**
 * @description <p>Creates an Image Cropper control.</p>
 * @requires widget, resize, gallery-event-arrow
 * @module gallery-imagecropper
 */

var Lang = Y.Lang,
	isNumber = Lang.isNumber,
	YArray = Y.Array,
	getClassName = Y.ClassNameManager.getClassName,
	IMAGE_CROPPER = 'imagecropper',
	RESIZE = 'resize',
	MASK = 'mask',
	KNOB = 'knob',
	
	_classNames = {
		cropMask: getClassName(IMAGE_CROPPER, MASK),
		resizeKnob: getClassName(IMAGE_CROPPER, RESIZE, KNOB),
		resizeMask: getClassName(IMAGE_CROPPER, RESIZE, MASK)
	},

/**
 * @constructor
 * @class ImageCropper
 * @description <p>Creates an Image Cropper control.</p>
 * @extends Widget
 * @param {Object} config Object literal containing configuration parameters.
*/
/**
 * The identity of the widget.
 *
 * @property ImageCropper.NAME
 * @type String
 * @default 'imagecropper'
 * @readOnly
 * @protected
 * @static
 */
ImageCropper = Y.Base.create('imagecropper', Y.Widget, [], {
	
	CONTENT_TEMPLATE: '<img/>',
	
	_toggleKeys: function (e) {
		if (e.newVal) {
			this._bindArrows();
		} else {
			this._unbindArrows();
		}
	},
	
	_moveResizeKnob: function (e) {
		e.preventDefault(); // prevent scroll in Firefox
		
		var resizeKnob = this.get('resizeKnob'),
			contentBox = this.get('contentBox'),
			
			knobWidth = resizeKnob.get('offsetWidth'),
			knobHeight = resizeKnob.get('offsetHeight'),
		
			tick = e.shiftKey ? this.get('shiftKeyTick') : this.get('keyTick'),
			direction = e.direction,
			
			tickH = direction.indexOf('w') > -1 ? -tick : direction.indexOf('e') > -1 ? tick : 0,
			tickV = direction.indexOf('n') > -1 ? -tick : direction.indexOf('s') > -1 ? tick : 0,
			
			x = resizeKnob.getX() + tickH,
			y = resizeKnob.getY() + tickV,
			
			minX = contentBox.getX(),
			minY = contentBox.getY(),
			
			maxX = minX + contentBox.get('offsetWidth') - knobWidth,
			maxY = minY + contentBox.get('offsetHeight') - knobHeight,
			
			o;
			
		if (x < minX) {
			x = minX;
		} else if (x > maxX) {
			x = maxX;
		}
		if (y < minY) {
			y = minY;
		} else if (y > maxY) {
			y = maxY;
		}
		resizeKnob.setXY([x, y]);
		
		o = {
			width: knobWidth,
			height: knobHeight,
			left: resizeKnob.get('offsetLeft'),
			top: resizeKnob.get('offsetTop'),
			sourceEvent: e.type
		};
		
		o[e.type + 'Event'] = e;
		this.fire('crop:start', o);
		this.fire('crop:crop', o);
		this.fire('crop:end', o);
		
		this._syncResizeMask();
	},
	
	_defCropMaskValueFn: function () {
		return Y.Node.create(ImageCropper.CROP_MASK_TEMPLATE);
	},

	_defResizeKnobValueFn: function () {
		return Y.Node.create(ImageCropper.RESIZE_KNOB_TEMPLATE);
	},

	_defResizeMaskValueFn: function () {
		return Y.Node.create(ImageCropper.RESIZE_MASK_TEMPLATE);
	},

	_renderCropMask: function (boundingBox) {
		var node = this.get('cropMask');
		if (!node.inDoc()) {
			boundingBox.append(node);
		}
	},

	_renderResizeKnob: function (boundingBox) {
		var node = this.get('resizeKnob');
		if (!node.inDoc()) {
			boundingBox.append(node);
		}
		node.setStyle('backgroundImage', 'url(' + this.get('source') + ')');
	},

	_renderResizeMask: function () {
		var node = this.get('resizeMask');
		if (!node.inDoc()) {
			this.get('resizeKnob').append(node);
		}
	},

	_handleSrcChange: function (e) {
		this.get('contentBox').set('src', e.newVal);
		this.get('resizeKnob').setStyle('backgroundImage', 'url(' + e.newVal + ')');
	},
	
	_syncResizeKnob: function () {
		var initialXY = this.get('initialXY');
		
		this.get('resizeKnob').setStyles({
			left: initialXY[0],
			top: initialXY[1],
			width: this.get('initWidth'),
			height: this.get('initHeight')
		});
	},
	
	_syncResizeMask: function () {
		var resizeKnob = this.get('resizeKnob');
		resizeKnob.setStyle('backgroundPosition', (-resizeKnob.get('offsetLeft')) + 'px ' + (-resizeKnob.get('offsetTop')) + 'px');
	},
	
	_syncResizeAttr: function (e) {
		if (this._resize) {
			this._resize.con.set(e.attrName, e.newVal);
		}
	},
	
	_icEventProxy: function (target, ns, eventType) {
		var sourceEvent = ns + ':' + eventType,
			resizeKnob = this.get('resizeKnob');
			
		target.on(sourceEvent, function (e) {
			
			var o = {
				width: resizeKnob.get('offsetWidth'),
				height: resizeKnob.get('offsetHeight'),
				left: resizeKnob.get('offsetLeft'),
				top: resizeKnob.get('offsetTop')
			};
			o[ns + 'Event'] = e;
			
			/**
			* @event resize:start
			* @description Relay of the Resize utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event resize:resize
			* @description Relay of the Resize utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event resize:end
			* @description Relay of the Resize utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event drag:start
			* @description Relay of the Drag utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event drag:resize
			* @description Relay of the Drag utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event drag:end
			* @description Relay of the Drag utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			this.fire(sourceEvent, o);
			
			o.sourceEvent = sourceEvent;
			
			/**
			* @event crop:start
			* @description Fires at the start of a crop operation. Unifies drag:start and and resize:start.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>
			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>
			* <dt>width</dt><dd>The new width of the crop area.</dd>
			* <dt>height</dt><dd>The new height of the crop area.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event crop:crop
			* @description Fires every time the crop area changes. Unifies drag:drag and resize:resize.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>
			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>
			* <dt>width</dt><dd>The new width of the crop area.</dd>
			* <dt>height</dt><dd>The new height of the crop area.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event crop:end
			* @description Fires at the end of a crop operation. Unifies drag:end and resize:end.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>
			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>
			* <dt>width</dt><dd>The new width of the crop area.</dd>
			* <dt>height</dt><dd>The new height of the crop area.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			this.fire('crop:' + (eventType == ns ? 'crop' : eventType), o);
			
		}, this);
	},
	
	_bindArrows: function () {
		this._arrowHandler = this.get('resizeKnob').on('arrow', this._moveResizeKnob, this);
	},
	
	_unbindArrows: function () {
		if (this._arrowHandler) {
			this._arrowHandler.detach();
		}
	},
	
	_bindResize: function (resizeKnob, contentBox) {
		var resize = this._resize = new Y.Resize({
			node: resizeKnob
		});
		resize.on('resize:resize', this._syncResizeMask, this);
		resize.plug(Y.Plugin.ResizeConstrained, {
			constrain: contentBox,
			minHeight: this.get('minHeight'),
			minWidth: this.get('minWidth'),
			preserveRatio: this.get('preserveRatio')
		});
		YArray.each(ImageCropper.RESIZE_EVENTS, Y.bind(this._icEventProxy, this, resize, 'resize'));
	},
	
	_bindDrag: function (resizeKnob, contentBox) {
		var drag = this._drag = new Y.DD.Drag({
			node: resizeKnob,
			handles: [this.get('resizeMask')]
		});
		drag.on('drag:drag', this._syncResizeMask, this);
		drag.plug(Y.Plugin.DDConstrained, {
			constrain2node: contentBox
		});
		YArray.each(ImageCropper.DRAG_EVENTS, Y.bind(this._icEventProxy, this, drag, 'drag'));
	},
	
	initializer: function () {
		this.set('initialXY', this.get('initialXY') || [10, 10]);
		this.set('initWidth', this.get('initWidth'));
		this.set('initHeight', this.get('initHeight'));

		this.after('sourceChange', this._handleSrcChange);
		this.after('useKeysChange', this._toggleKeys);
		
		this._icHandlers = [];
		
		YArray.each(ImageCropper.RESIZE_ATTRS, function (attr) {
			this.after(attr + 'Change', this._syncResizeAttr);
		}, this);
	},
	
	renderUI: function () {
		var boundingBox = this.get('boundingBox');
		
		this._renderCropMask(boundingBox);
		this._renderResizeKnob(boundingBox);
		this._renderResizeMask();
	},
	
	bindUI: function () {
		var contentBox = this.get('contentBox'),
			resizeKnob = this.get('resizeKnob');
			
		this._icHandlers.push(
			resizeKnob.on('focus', this._attachKeyBehavior, this),
			resizeKnob.on('blur', this._detachKeyBehavior, this),
			resizeKnob.on('mousedown', resizeKnob.focus, resizeKnob)
		);
		
		this._bindArrows();
		
		this._bindResize(resizeKnob, contentBox);
		this._bindDrag(resizeKnob, contentBox);
	},
	
	syncUI: function () {
		this.get('contentBox').set('src', this.get('source'));
		
		this._syncResizeKnob();
		this._syncResizeMask();
	},
	
	/**
	 * Returns the coordinates needed to crop the image
	 * 
	 * @method getCropCoords
	 * @return {Object} The top, left, height, width and image url of the image being cropped
	 */
	getCropCoords: function () {
		var resizeKnob = this.get('resizeKnob'),
			result, xy;
		
		if (resizeKnob.inDoc()) {
			result = {
				left: resizeKnob.get('offsetLeft'),
				top: resizeKnob.get('offsetTop'),
				width: resizeKnob.get('offsetWidth'),
				height: resizeKnob.get('offsetHeight')
			};
		} else {
			xy = this.get('initialXY');
			result = {
				left: xy[0],
				top: xy[1],
				width: this.get('initWidth'),
				height: this.get('initHeight')
			};
		}
		result.image = this.get('source');
		
		return result;
	},
	
	/**
	 * Resets the crop element back to it's original position
	 * 
	 * @method reset
	 * @chainable
	 */
	reset: function () {
		var initialXY = this.get('initialXY');
		this.get('resizeKnob').setStyles({
			left: initialXY[0],
			top: initialXY[1],
			width: this.get('initWidth'),
			height: this.get('initHeight')
		});
		this._syncResizeMask();
		return this;
	},
	
	destructor: function () {
		if (this._resize) {
			this._resize.destroy();
		}
		if (this._drag) {
			this._drag.destroy();
		}
		
		YArray.each(this._icHandlers, function (handler) {
			handler.detach();
		});
		this._unbindArrows();
		
		this._drag = this._resize = null;
	}
	
}, {
	
	/**
	 * Template that will contain the ImageCropper's mask.
	 *
	 * @property ImageCropper.CROP_MASK_TEMPLATE
	 * @type {HTML}
	 * @default &lt;div class="[...-mask]">&lt;/div>
	 * @protected
	 * @static
	 */
	CROP_MASK_TEMPLATE: '<div class="' + _classNames.cropMask + '"></div>',
	/**
	 * Template that will contain the ImageCropper's resize node.
	 *
	 * @property ImageCropper.RESIZE_KNOB_TEMPLATE
	 * @type {HTML}
	 * @default &lt;div class="[...-resize-knob]" tabindex="0">&lt;/div>
	 * @protected
	 * @static
	 */
	RESIZE_KNOB_TEMPLATE: '<div class="' + _classNames.resizeKnob + '" tabindex="0"></div>',
	/**
	 * Template that will contain the ImageCropper's resize mask.
	 *
	 * @property ImageCropper.RESIZE_MASK_TEMPLATE
	 * @type {HTML}
	 * @default &lt;div class="[...-resize-mask]">&lt;/div>
	 * @protected
	 * @static
	 */
	RESIZE_MASK_TEMPLATE: '<div class="' + _classNames.resizeMask + '"></div>',
	
	/**
	 * Array of events to relay from the Resize utility to the ImageCropper 
	 *
	 * @property ImageCropper.RESIZE_EVENTS
	 * @type {Array}
	 * @private
	 * @static
	 */
	RESIZE_EVENTS: ['start', 'resize', 'end'],
	/**
	 * Array of attributes to relay from the ImageCropper to the Resize utility 
	 *
	 * @property ImageCropper.RESIZE_ATTRS
	 * @type {Array}
	 * @private
	 * @static
	 */
	RESIZE_ATTRS: ['minWidth', 'minHeight', 'preserveRatio'],
	/**
	 * Array of events to relay from the Drag utility to the ImageCropper 
	 *
	 * @property ImageCropper.DRAG_EVENTS
	 * @type {Array}
	 * @private
	 * @static
	 */
	DRAG_EVENTS: ['start', 'drag', 'end'],
	
	HTML_PARSER: {
		
		source: function (srcNode) {
			return srcNode.get('src');
		},
		
		cropMask: '.' + _classNames.cropMask,
		resizeKnob: '.' + _classNames.resizeKnob,
		resizeMask: '.' + _classNames.resizeMask
		
	},
	
	/**
	 * Static property used to define the default attribute configuration of
	 * the Widget.
	 *
	 * @property ImageCropper.ATTRS
	 * @type {Object}
	 * @protected
	 * @static
	 */
	ATTRS: {
		
		/**
		 * The source attribute of the image we are cropping
		 *
		 * @attribute source
		 * @type {String}
		 */
		source: { value: '' },
		
		/**
		 * The resize mask used to highlight the crop area
		 *
		 * @attribute resizeMask
		 * @type {Node}
		 */
		resizeMask: {
			setter: function (node) {
				node = Y.one(node);
				if (node) {
					node.addClass(_classNames.resizeMask);
				}
				return node;
			},

			valueFn: '_defResizeMaskValueFn'
		},
		
		/**
		 * The resized element
		 *
		 * @attribute resizeKnob
		 * @type {Node}
		 */
		resizeKnob: {
			setter: function (node) {
				node = Y.one(node);
				if (node) {
					node.addClass(_classNames.resizeKnob);
				}
				return node;
			},

			valueFn: '_defResizeKnobValueFn'
		},
		
		/**
		 * Element used to shadow the part of the image we're not cropping
		 *
		 * @attribute cropMask
		 * @type {Node}
		 */
		cropMask: {
			setter: function (node) {
				node = Y.one(node);
				if (node) {
					node.addClass(_classNames.cropMask);
				}
				return node;
			},

			valueFn: '_defCropMaskValueFn'
		},
		
		/**
		 * Array of the XY position that we need to set the crop element to when we build it
		 *
		 * @attribute initialXY
		 * @type {Array}
		 * @default [10, 10]
		 */
		initialXY: {
			validator: Lang.isArray
		},
		
		/**
		 * The pixel tick for the arrow keys
		 *
		 * @attribute keyTick
		 * @type {Number}
		 * @default 1
		 */
		keyTick: {
			value: 1,
			validator: isNumber
		},
		
		/**
		 * The pixel tick for shift + the arrow keys
		 *
		 * @attribute shiftKeyTick
		 * @type {Number}
		 * @default 10
		 */
		shiftKeyTick: {
			value: 10,
			validator: isNumber
		},
		
		/**
		 * Should we use the Arrow keys to position the crop element
		 *
		 * @attribute useKeys
		 * @type {Boolean}
		 * @default true
		 */
		useKeys: {
			value: true,
			validator: Lang.isBoolean
		},
		
		/**
		 * Show the Resize and Drag utilities status
		 *
		 * @attribute status
		 * @type {Boolean}
		 * @readOnly
		 */
		status: {
			readOnly: true,
			getter: function () {
				var resizing = this._resize ? this._resize.get('resizing') : false,
					drag = this._drag ? this._drag.get('dragging') : false;
				return resizing || drag;
			}
		},
		
		/**
		 * MinHeight of the crop area
		 *
		 * @attribute minHeight
		 * @type {Number}
		 * @default 50
		 */
		minHeight: {
			value: 50,
			validator: isNumber
		},
		
		/**
		 * MinWidth of the crop area
		 *
		 * @attribute minWidth
		 * @type {Number}
		 * @default 50
		 */
		minWidth: {
			value: 50,
			validator: isNumber
		},
		
		/**
		 * Set the preserveRatio config option of the Resize Utlility
		 *
		 * @attribute preserveRatio
		 * @type {Boolean}
		 * @default false
		 */
		preserveRatio: {
			value: false,
			validator: Lang.isBoolean
		},
		
		/**
		 * Set the initlal height of the crop area, defaults to minHeight
		 *
		 * @attribute initHeight
		 * @type {Number}
		 */
		initHeight: {
			value: 0,
			validator: isNumber,
			setter: function (value) {
				var minHeight = this.get('minHeight');
				return value < minHeight ? minHeight : value;
			}
		},
		
		/**
		 * Set the initlal width of the crop area, defaults to minWidth
		 *
		 * @attribute initWidth
		 * @type {Number}
		 */
		initWidth: {
			value: 0,
			validator: isNumber,
			setter: function (value) {
				var minWidth = this.get('minWidth');
				return value < minWidth ? minWidth : value;
			}
		}
		
	}
	
});

Y.ImageCropper = ImageCropper;


}, 'gallery-2012.08.15-20-00' ,{requires:['widget','resize','gallery-event-arrow','dd-constrain'], skinnable:true});
