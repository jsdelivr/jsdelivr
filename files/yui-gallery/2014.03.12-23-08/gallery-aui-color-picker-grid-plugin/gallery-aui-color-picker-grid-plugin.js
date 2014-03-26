YUI.add('gallery-aui-color-picker-grid-plugin', function(A) {

var Lang = A.Lang,
	isString = Lang.isString,

	COLOR_PICKER_GRID = 'colorpickergrid',
	COLOR_PICKER_GRID_NS = 'cpgrid',
	COLOR_PICKER_GRID_PLUGIN = 'ColorPickerGridPlugin',

	getCN = A.ClassNameManager.getClassName,

	ITEM = 'item',

	CSS_COLOR_PICKER_GRID = getCN(COLOR_PICKER_GRID),
	CSS_COLOR_PICKER_GRID_ITEM = getCN(COLOR_PICKER_GRID, ITEM),
	CSS_COLOR_PICKER_GRID_ITEM_CONTENT = getCN(COLOR_PICKER_GRID, ITEM, 'content'),

	STR_EMPTY = '',

	TPL_ITEM_CLOSE = '"></span></span>',
	TPL_ITEM_CONTENT_OPEN = '"><span class="' + CSS_COLOR_PICKER_GRID_ITEM_CONTENT + '" style="background-color:#',
	TPL_ITEM_OPEN = '<span class="' + CSS_COLOR_PICKER_GRID_ITEM + '" data-color="';

var ColorPickerGrid = A.Component.create(
	{
		NAME: COLOR_PICKER_GRID,
		NS: COLOR_PICKER_GRID_NS,
		ATTRS: {
			colors: {
				value: 'websafe',
				setter: '_setColors'
			}
		},

		EXTENDS: A.Plugin.Base,
		prototype: {
			initializer: function() {
				var instance = this;

				var host = instance.get('host');

				host.set('cssClass', CSS_COLOR_PICKER_GRID);

				instance.beforeHostMethod('_renderSliders', instance._preventHostMethod);
				instance.beforeHostMethod('_renderControls', instance._preventHostMethod);

				instance.beforeHostMethod('bindUI', instance._beforeBindUI);

				instance.beforeHostMethod('syncUI', instance._beforeSyncUI);

				instance.afterHostMethod('_renderContainer', instance._afterRenderContainer);

				instance.after('colorsChange', instance._afterColorsChange);
			},

			_afterColorsChange: function(event) {
				var instance = this;

				instance._uiSetColors(event.newVal);
			},

			_afterRenderContainer: function() {
				var instance = this;

				var host = instance.get('host');

				instance._uiSetColors(instance.get('colors'));

				host.after('hexChange', host._updateRGB);
				host.after('rgbChange', host._updateRGB);

				var pickerContainer = host._pickerContainer;

				pickerContainer.delegate(
					'click',
					function(event) {
						host.set('hex', event.currentTarget.attr('data-color'));
					},
					'.' + CSS_COLOR_PICKER_GRID_ITEM
				);
			},

			_beforeBindUI: function() {
				var instance = this;

				var host = instance.get('host');

				host.constructor.superclass.bindUI.apply(host, arguments);

				return instance._preventHostMethod();
			},

			_beforeSyncUI: function() {
				var instance = this;

				var host = instance.get('host');

				host.constructor.superclass.syncUI.apply(host, arguments);

				return instance._preventHostMethod();
			},

			_getHex: function(r, g, b) {
				return (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1);
			},

			_getWebSafeColors: function() {
				var instance = this;

				var red = 0;
				var green = 0;
				var blue = 0;

				var getHex = instance._getHex;

				var palette = [getHex(red, green, blue)];

				for (var i = 0, j = 1; i < 256; i += 51, j++) {
					if (red == 255 && green == 255 && blue == 255) {
						break;
					}

					if (green > 255) {
						red += 51;

						green = i = 0;

						palette[j++] = getHex(red, green, blue);
					}

					if (blue >= 255) {
						green += 51;

						if (green > 255) {
							red += 51;
							green = 0;
						}

						blue = i = 0;

						palette[j++] = getHex(red, green, blue);
					}

					blue += 51;

					palette[j] = getHex(red, green, blue);
				}

				return palette;
			},

			_preventHostMethod: function() {
				var instance = this;

				return new A.Do.Prevent(null, null);
			},

			_setColors: function(value) {
				var instance = this;

				if (value == 'websafe') {
					value = instance._getWebSafeColors();
				}
				else if (!Lang.isArray(value)) {
					value = A.Attribute.INVALID_VALUE;
				}

				return value;
			},

			_uiSetColors: function(value) {
				var instance = this;

				var buffer = [];
				var tplBuffer = [TPL_ITEM_OPEN, STR_EMPTY, TPL_ITEM_CONTENT_OPEN, STR_EMPTY, TPL_ITEM_CLOSE];

				A.each(
					value,
					function(item, index, collection) {
						tplBuffer[1] = tplBuffer[3] = item;

						buffer[index] = tplBuffer.join(STR_EMPTY);
					}
				);

				var pickerContainer = instance.get('host')._pickerContainer;

				pickerContainer.setContent(buffer.join(STR_EMPTY));
			}
		}
	}
);

A.Plugin.ColorPickerGrid = ColorPickerGrid;


}, 'gallery-2010.10.06-18-55' ,{skinnable:true, requires:['gallery-aui-color-picker','plugin']});
