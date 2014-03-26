YUI.add('gallery-aui-color-picker-base', function(A) {

/**
 * The ColorPicker Utility - Full documentation coming soon.
 *
 * @module aui-color-picker
 */

var Lang = A.Lang,
	isArray = Lang.isArray,
	isObject = Lang.isObject,

	ColorUtil = A.ColorUtil,

	NAME = 'colorpicker',

	getClassName = A.ClassNameManager.getClassName,

	WidgetStdMod = A.WidgetStdMod,

	CSS_CANVAS = getClassName(NAME, 'canvas'),
	CSS_HUE_CANVAS = getClassName(NAME, 'hue-canvas'),
	CSS_CONTAINER = getClassName(NAME, 'container'),
	CSS_CONTROLS_CONTAINER = getClassName(NAME, 'controls'),

	CSS_PANEL = getClassName(NAME, 'panel'),
	CSS_SWATCH_CONTAINER = getClassName(NAME, 'swatch'),
	CSS_SWATCH_CURRENT = getClassName(NAME, 'swatch-current'),
	CSS_SWATCH_ORIGINAL = getClassName(NAME, 'swatch-original'),
	CSS_THUMB_CANVAS = getClassName(NAME, 'thumb'),
	CSS_THUMB_CANVAS_IMAGE = getClassName(NAME, 'thumb-image'),
	CSS_HUE_THUMB = getClassName(NAME, 'hue-thumb'),
	CSS_HUE_THUMB_IMAGE = getClassName(NAME, 'hue-thumb-image'),
	CSS_SLIDER = getClassName(NAME, 'hue', 'slider'),
	CSS_SLIDER_CONTENT = getClassName(NAME, 'hue', 'slider', 'content'),
	CSS_TRIGGER = getClassName(NAME, 'trigger'),

	TPL_CANVAS = '<div class="' + CSS_CANVAS + '"></div>',
	TPL_HUE_CANVAS = '<span class="' + CSS_HUE_CANVAS + '"></span>',
	TPL_SWATCH_CONTAINER = '<div class="' + CSS_SWATCH_CONTAINER + '"></div>',
	TPL_SWATCH_CURRENT = '<div class="' + CSS_SWATCH_CURRENT + '"></div>',
	TPL_SWATCH_ORIGINAL = '<div class="' + CSS_SWATCH_ORIGINAL + '"></div>',
	TPL_THUMB_CANVAS = '<div class="' + CSS_THUMB_CANVAS + '"><div class="' + CSS_THUMB_CANVAS_IMAGE + '"></div></div>',
	TPL_THUMB_HUE = '<span class="' + CSS_HUE_THUMB + '"><span class="' + CSS_HUE_THUMB_IMAGE + '"></span></span>';

/**
 * A base class for ColorPicker, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>ColorPicker utility</li>
 * </ul>
 *
 * Check the list of <a href="ColorPicker.html#configattributes">Configuration Attributes</a> available for
 * ColorPicker.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class ColorPicker
 * @constructor
 * @extends OverlayContext
 */
var ColorPicker = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property ColorPicker.NAME
		 * @type String
		 * @static
		 */
		NAME: NAME,
		/**
		 * Static property used to define the default attribute
		 * configuration for the ColorPicker.
		 *
		 * @property ColorPicker.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			colors: {
				value: {},
				getter: function() {
					var instance = this;

					var rgb = instance.get('rgb');
					var hex = instance.get('hex');

					var colors = {};

					A.mix(colors, rgb);

					colors.hex = hex;

					return colors;
				}
			},
			hex: {
				value: 'FFFFFF',
				getter: function() {
					var instance = this;

					var rgb = instance.get('rgb');

					var hex = rgb.hex;

					if (hex) {
						hex = hex.split('#').join('')
					}
					else {
						hex = ColorUtil.rgb2hex(rgb);
					}

					return hex;
				},
				setter: function(value) {
					var instance = this;

					if (value) {
						var rgb = ColorUtil.getRGB('#' + value);

						value = rgb.hex.split('#').join('');

						instance.set('rgb', rgb);
					}
					else {
						value = A.Attribute.INVALID_VALUE;
					}

					return value;
				}
			},

			hideOn: {
				value: 'click'
			},

			hsv: {
				getter: function(value) {
					var instance = this;

					var rgb = instance.get('rgb');

					return ColorUtil.rgb2hsv(rgb);
				},
				setter: function(value) {
					var instance = this;

					if (isArray(value)) {
						var current = instance.get('hsv');

						var rgb = ColorUtil.hsv2rgb(value);

						instance.set('rgb', rgb);

						current = {
							hue: value[0],
							saturation: value[1],
							value: [2]
						};
					}
					else if (!isObject(value)) {
						value = A.Attribute.INVALID_VALUE;
					}

					return value;
				},
				value: {
					h: 0,
					s: 0,
					v: 0
				}
			},

			showOn: {
				value: 'click'
			},

			pickersize: {
				value: 180
			},

			rgb: {
				value: new ColorUtil.RGB(255, 255, 255),

				setter: function(value) {
					var instance = this;

					var r;
					var g;
					var b;

					var set = true;

					if (isArray(value)) {
						r = value[0];
						g = value[0];
						b = value[0];
					}
					else if (isObject) {
						r = value.r;
						g = value.g;
						b = value.b;
					}
					else {
						value = A.Attribute.INVALID_VALUE;

						set = false;
					}

					if (set) {
						r = ColorUtil.constrainTo(r, 0, 255, 255);
						g = ColorUtil.constrainTo(g, 0, 255, 255);
						b = ColorUtil.constrainTo(b, 0, 255, 255);

						value = new ColorUtil.RGB(r, g, b);
					}

					return value;
				}
			},

			strings: {
				value: {
					R: 'R',
					G: 'G',
					B: 'B',
					H: 'H',
					S: 'S',
					V: 'V',
					HEX: '#',
					DEG: '\u00B0',
					PERCENT: '%'
				}
			},

			triggerParent: {
				value: null
			},

			trigger: {
				lazyAdd: true,
				getter: function(value) {
					var instance = this;

					if (!value) {
						instance._buttonTrigger = new A.ButtonItem(
							{
								cssClass: CSS_TRIGGER,
								icon: 'pencil'
							}
						);

						value = instance._buttonTrigger.get('boundingBox');

						value = new A.NodeList(value);

						instance.set('trigger', value);
					}

					return value;
				}
			}
		},

		EXTENDS: A.OverlayContext,

		prototype: {
			/**
			 * Create the DOM structure for the ColorPicker. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;

				var toolTrigger = instance._buttonTrigger;

				if (toolTrigger && !toolTrigger.get('rendered')) {
					var triggerParent = instance.get('triggerParent');

					if (!triggerParent) {
						triggerParent = instance.get('boundingBox').get('parentNode');
					}

					toolTrigger.render(triggerParent);
				}

				instance._renderContainer();
				instance._renderSliders();
				instance._renderControls();
			},

			/**
			 * Bind the events on the ColorPicker UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				ColorPicker.superclass.bindUI.apply(this, arguments);

				instance._createEvents();

				instance._colorCanvas.on('mousedown', instance._onCanvasMouseDown, instance);

				instance._colorPicker.on('drag:start', instance._onThumbDragStart, instance);

				instance._colorPicker.after('drag:drag', instance._afterThumbDrag, instance);
				instance._hueSlider.after('valueChange', instance._afterValueChange, instance);

				var formNode = instance._colorForm.get('contentBox');

				formNode.delegate('change', A.bind(instance._onFormChange, instance), 'input');

				instance.after('hexChange', instance._updateRGB);
				instance.after('rgbChange', instance._updateRGB);

				instance._colorSwatchOriginal.on('click', instance._restoreRGB, instance);

				instance.after('visibleChange', instance._afterVisibleChangeCP);
			},

			/**
			 * Sync the ColorPicker UI. Lifecycle.
			 *
			 * @method syncUI
			 * @protected
			 */
			syncUI: function() {
				var instance = this;

				instance._updatePickerOffset();

				var rgb = instance.get('rgb');

				instance._updateControls();

				instance._updateOriginalRGB();
			},

			_afterThumbDrag: function(event) {
				var instance = this;

				var value = instance._translateOffset(event.pageX, event.pageY);

				if (!instance._preventDragEvent) {
					instance.fire(
						'colorChange',
						{
							ddEvent: event
						}
					);
				}

				instance._canvasThumbXY = value;
			},

			_afterValueChange: function(event) {
				var instance = this;

				if (event.src != 'controls') {
					instance.fire(
						'colorChange',
						{
							slideEvent: event
						}
					);
				}
			},

			_afterVisibleChangeCP: function(event) {
				var instance = this;

				if (event.newVal) {
					instance.refreshAlign();
					instance._hueSlider.syncUI();
				}

				instance._updateOriginalRGB();
			},

			_convertOffsetToValue: function(x, y) {
				var instance = this;

				if (isArray(x)) {
					return instance._convertOffsetToValue.apply(instance, x);
				}

				var size = instance.get('pickersize');

				x = Math.round(((x * size / 100)));
				y = Math.round((size - (y * size / 100)));

				return [x, y];
			},

			_convertValueToOffset: function(x, y) {
				var instance = this;

				if (isArray(x)) {
					return instance._convertValueToOffset.apply(instance, x);
				}

				x = Math.round(x + instance._offsetXY[0]);
				y = Math.round(y + instance._offsetXY[1]);

				return [x, y];
			},

			_createEvents: function() {
				var instance = this;

				instance.publish(
					'colorChange',
					{
						defaultFn: instance._onColorChange
					}
				);
			},

			_getHuePicker: function() {
				var instance = this;

				var size = instance.get('pickersize');
				var hue = (size - instance._hueSlider.get('value')) / size;

				hue = ColorUtil.constrainTo(hue, 0, 1, 0);

				return (hue === 1) ? 0 : hue;
			},

			_getPickerSize: function() {
				var instance = this;

				if (!instance._pickerSize) {
					var colorCanvas = instance._colorCanvas;
					var pickerSize = colorCanvas.get('offsetWidth');

					if (!pickerSize) {
						pickerSize = colorCanvas.getComputedStyle('width');
					}

					pickerSize = parseInt(pickerSize, 10);

					var width = instance._pickerThumb.get('offsetWidth');

					pickerSize -= width;

					instance._pickerSize = pickerSize;
				}

				return instance._pickerSize;
			},

			_getSaturationPicker: function() {
				var instance = this;

				return instance._canvasThumbXY[0] / instance._getPickerSize();
			},

			_getThumbOffset: function() {
				var instance = this;

				if (!instance._thumbOffset) {
					var pickerThumb = instance._pickerThumb;

					var height = pickerThumb.get('offsetHeight');
					var width = pickerThumb.get('offsetWidth');

					instance._thumbOffset = [Math.floor(width / 2), Math.floor(height / 2)];
				}

				return instance._thumbOffset;
			},

			_getValuePicker: function() {
				var instance = this;

				var size = instance._getPickerSize();

				return ((size - instance._canvasThumbXY[1])) / size;
			},

			_onCanvasMouseDown: function(event) {
				var instance = this;

				instance._setDragStart(event.pageX, event.pageY);

				event.halt();

				instance.fire(
					'colorChange',
					{
						ddEvent: event
					}
				);
			},

			_onColorChange: function(event) {
				var instance = this;

				var hue = instance._getHuePicker();

				var saturation = instance._getSaturationPicker();
				var value = instance._getValuePicker();

				var rgb = ColorUtil.hsv2rgb(hue, saturation, value);

				if (event.src != 'controls') {
					instance.set('rgb', rgb);
				}

				instance._updateControls();

				if (!event.ddEvent) {
					if (!event.slideEvent) {
						instance._updateHue();
						instance._updatePickerThumb();

						hue = instance._getHuePicker();
					}

					var canvasRGB = ColorUtil.hsv2rgb(hue, 1, 1);

					instance._updateCanvas(canvasRGB);
				}

				instance._updateColorSwatch();
			},

			_onFormChange: function(event) {
				var instance = this;

				var input = event.currentTarget;

				var colorKey = input.get('id');

				if (colorKey != 'hex') {
					colorKey = 'rgb.' + colorKey;
				}

				instance.set(colorKey, input.val());
			},

			_onThumbDragStart: function(event) {
				var instance = this;

				instance._updatePickerOffset();
			},

			_renderContainer: function() {
				var instance = this;

				if (!instance._pickerContainer) {
					var container = new A.Panel(
						{
							cssClass: CSS_PANEL,
							icons: [
								{
									icon: 'close',
									id: 'close',
									handler: {
										fn: instance.hide,
										context: instance
									}
								}
							]
						}
					).render(instance.get('contentBox'));

					var bodyNode = container.bodyNode;

					bodyNode.addClass(CSS_CONTAINER);

					instance._pickerContainer = bodyNode;
				}
			},

			_renderControls: function() {
				var instance = this;

				instance._colorSwatch = A.Node.create(TPL_SWATCH_CONTAINER);
				instance._colorSwatchCurrent = A.Node.create(TPL_SWATCH_CURRENT);
				instance._colorSwatchOriginal = A.Node.create(TPL_SWATCH_ORIGINAL);

				instance._colorSwatch.appendChild(instance._colorSwatchCurrent);
				instance._colorSwatch.appendChild(instance._colorSwatchOriginal);

				instance._pickerContainer.appendChild(instance._colorSwatch);

				var strings = instance.get('strings');

				var form = new A.Form(
					{
						labelAlign: 'left'
					}
				).render(instance._pickerContainer);

				form.add(
					[
						{
							id: 'r',
							labelText: strings.R,
							size: 3
						},
						{
							id: 'g',
							labelText: strings.G,
							size: 3
						},
						{
							id: 'b',
							labelText: strings.B,
							size: 3
						},
						{
							id: 'hex',
							labelText: strings.HEX,
							size: 6
						}
					],
					true
				);

				form.get('boundingBox').addClass(CSS_CONTROLS_CONTAINER);

				instance._colorForm = form;
			},

			_renderSliders: function() {
				var instance = this;

				instance._colorCanvas = A.Node.create(TPL_CANVAS);
				instance._pickerThumb = A.Node.create(TPL_THUMB_CANVAS);

				instance._colorCanvas.appendChild(instance._pickerThumb);

				instance._pickerContainer.appendChild(instance._colorCanvas);

				var size = instance.get('pickersize');

				instance._colorPicker = new A.DD.Drag(
					{
						node: instance._pickerThumb
					}
				)
				.plug(
					A.Plugin.DDConstrained,
					{
						constrain2node: instance._colorCanvas
					}
				);

				var slider = new A.Slider(
					{
						axis: 'y',
						min: 0,
						max: size,
						length: instance._colorCanvas.get('offsetHeight')
					}
				);

				slider.RAIL_TEMPLATE = TPL_HUE_CANVAS;
				slider.THUMB_TEMPLATE = TPL_THUMB_HUE;

				slider.get('boundingBox').addClass(CSS_SLIDER);
				slider.get('contentBox').addClass(CSS_SLIDER_CONTENT);

				slider.render(instance._pickerContainer);

				instance._hueSlider = slider;
			},

			_restoreRGB: function(event) {
				var instance = this;

				instance.set('rgb', instance._oldRGB);
				instance._updateHue();
				instance._updatePickerThumb();
				instance._updateColorSwatch();

				instance.fire('colorChange');
			},

			_setDragStart: function(x, y) {
				var instance = this;

				if (isArray(x)) {
					return instance._setDragStart.apply(instance, x);
				}

				var dd = instance._colorPicker;

				dd._dragThreshMet = true;
				dd._fixIEMouseDown();

				A.DD.DDM.activeDrag = dd;

				var xy = dd.get('dragNode').getXY();

				var thumbOffset = instance._getThumbOffset();

				xy[0] += thumbOffset[0];
				xy[1] += thumbOffset[1];

				dd._setStartPosition(xy);
				dd.set('activeHandle', dd.get('dragNode'));

				dd.start();
				dd._alignNode([x, y]);
			},

			_translateOffset: function(x, y) {
				var instance = this;

				var offsetXY = instance._offsetXY;
				var offset = [];

				offset[0] = Math.round(x - offsetXY[0]);
				offset[1] = Math.round(y - offsetXY[1]);

				return offset;
			},

			_updateCanvas: function(rgb) {
				var instance = this;

				rgb = rgb || instance.get('rgb');

				instance._colorCanvas.setStyle('backgroundColor', 'rgb(' + [rgb.r, rgb.g, rgb.b].join(',') + ')');
			},

			_updateColorSwatch: function(rgb) {
				var instance = this;

				rgb = rgb || instance.get('rgb');

				instance._colorSwatchCurrent.setStyle('backgroundColor', 'rgb(' + [rgb.r, rgb.g, rgb.b].join(',') + ')');
			},

			_updateControls: function() {
				var instance = this;

				var colors = instance.get('colors');

				instance._colorForm.set('values', colors);
			},

			_updateHue: function() {
				var instance = this;

				var size = instance.get('pickersize');
				var hue = instance.get('hsv.h');

				hue = size - Math.round(hue * size);

				if (hue === size) {
					hue = 0;
				}

				instance._hueSlider.set(
					'value',
					 hue,
					{
						src: 'controls'
					}
				);
			},

			_updateOriginalColorSwatch: function(rgb) {
				var instance = this;

				rgb = rgb || instance.get('rgb');

				instance._colorSwatchOriginal.setStyle('backgroundColor', 'rgb(' + [rgb.r, rgb.g, rgb.b].join(',') + ')');
			},

			_updateOriginalRGB: function() {
				var instance = this;

				instance._oldRGB = instance.get('rgb');
				instance._updateOriginalColorSwatch(instance._oldRGB);
			},

			_updatePickerOffset: function() {
				var instance = this;

				instance._offsetXY = instance._colorCanvas.getXY();
			},

			_updatePickerThumb: function() {
				var instance = this;

				instance._updatePickerOffset();

				var hsv = instance.get('hsv');

				var size = instance.get('pickersize');

				hsv.s = Math.round(hsv.s * 100);
				var saturation = hsv.s;

				hsv.v = Math.round(hsv.v * 100);
				var value = hsv.v;

				var xy = instance._convertOffsetToValue(saturation, value);

				xy = instance._convertValueToOffset(xy);

				instance._canvasThumbXY = xy;

				var dd = instance._colorPicker;

				instance._preventDragEvent = true;

				dd._setStartPosition(dd.get('dragNode').getXY());
	            dd._alignNode(xy, true);

				instance._preventDragEvent = false;
			},

			_updateRGB: function(event) {
				var instance = this;

				if (event.subAttrName || event.attrName == 'hex') {
					instance.fire(
						'colorChange',
						{
							src: 'controls'
						}
					);
				}
			},

			_canvasThumbXY: [0, 0],
			_offsetXY: [0, 0]
		}
	}
);

A.ColorPicker = ColorPicker;


}, 'gallery-2011.02.09-21-32' ,{requires:['gallery-aui-overlay-context','dd-drag','slider','substitute','gallery-aui-button-item','gallery-aui-color-util','gallery-aui-form-base','gallery-aui-panel'], skinnable:true});
