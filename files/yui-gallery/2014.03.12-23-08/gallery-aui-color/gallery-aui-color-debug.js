YUI.add('gallery-aui-color', function(A) {

var Lang = A.Lang,
	isArray = Lang.isArray,
	isObject = Lang.isObject,
	isString = Lang.isString,

	isDegree = function(value) {
		return value && (value.slice(-3) == 'deg' || value.slice(-1) == '\xb0');
	},

	isPercentage = function(value) {
		return value && value.slice(-1) == '%';
	},

	HSRG = {
		hs: 1,
		rg: 1
	},

	MATH = Math,
	MATH_MAX = MATH.max,
	MATH_MIN = MATH.min,

	REGEX_COMMA_SPACES = /\s*,\s*/,
	REGEX_COLOR = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,

	REGEX_HEX_PREFIX = /^(?=[\da-f]$)/,
	REGEX_TRIM = /^\s+|\s+$/g,

	STR_EMPTY = '';

var Color = {
	constrainTo: function(number, start, end, defaultNumber) {
		var instance = this;

		if (number < start || number > end) {
			number = defaultNumber;
		}

		return number;
	},

	getRGB: A.cached(
		function(color) {
			if (!color || !!((color = String(color)).indexOf('-') + 1)) {
				return new Color.RGB('error');
			}

			if (color == 'none') {
				return new Color.RGB();
			}

			if (!HSRG.hasOwnProperty(color.toLowerCase().substring(0, 2)) && color.charAt(0) != '#') {
				color = Color._toHex(color);
			}

			var red;
			var green;
			var blue;
			var opacity;
			var t;
			var rgb = color.match(REGEX_COLOR);
			var values;

			if (rgb) {
				if (rgb[2]) {
					blue = parseInt(rgb[2].substring(5), 16);
					green = parseInt(rgb[2].substring(3, 5), 16);
					red = parseInt(rgb[2].substring(1, 3), 16);
				}

				if (rgb[3]) {
					blue = parseInt((t = rgb[3].charAt(3)) + t, 16);
					green = parseInt((t = rgb[3].charAt(2)) + t, 16);
					red = parseInt((t = rgb[3].charAt(1)) + t, 16);
				}

				if (rgb[4]) {
					values = rgb[4].split(REGEX_COMMA_SPACES);

					red = parseFloat(values[0]);

					if (isPercentage(values[0])) {
						red *= 2.55;
					}

					green = parseFloat(values[1]);

					if (isPercentage(values[1])) {
						green *= 2.55;
					}

					blue = parseFloat(values[2]);

					if (isPercentage(values[2])) {
						blue *= 2.55;
					}

					if (rgb[1].toLowerCase().slice(0, 4) == 'rgba') {
						opacity = parseFloat(values[3]);
					}

					if (isPercentage(values[3])) {
						opacity /= 100;
					}
				}

				if (rgb[5]) {
					values = rgb[5].split(REGEX_COMMA_SPACES);

					red = parseFloat(values[0]);

					if (isPercentage(values[0])) {
						red *= 2.55;
					}

					green = parseFloat(values[1]);

					if (isPercentage(values[1])) {
						green *= 2.55;
					}

					blue = parseFloat(values[2]);

					if (isPercentage(values[2])) {
						blue *= 2.55;
					}

					if (isDegree(values[0])) {
						red /= 360;
					}

					if (rgb[1].toLowerCase().slice(0, 4) == 'hsba') {
						opacity = parseFloat(values[3]);
					}

					if (isPercentage(values[3])) {
						opacity /= 100;
					}

					return Color.hsb2rgb(red, green, blue, opacity);
				}

				if (rgb[6]) {
					values = rgb[6].split(REGEX_COMMA_SPACES);

					red = parseFloat(values[0]);

					if (isPercentage(values[0])) {
						red *= 2.55;
					}

					green = parseFloat(values[1]);

					if (isPercentage(values[1])) {
						green *= 2.55;
					}

					blue = parseFloat(values[2]);

					if (isPercentage(values[2])) {
						blue *= 2.55;
					}

					if (isDegree(values[0])) {
						red /= 360;
					}

					if (rgb[1].toLowerCase().slice(0, 4) == 'hsla') {
						opacity = parseFloat(values[3]);
					}

					if (isPercentage(values[3])) {
						opacity /= 100;
					}

					return Color.hsb2rgb(red, green, blue, opacity);
				}

				rgb = new Color.RGB(red, green, blue, opacity);

				return rgb;
			}

			return new Color.RGB('error');
		}
	),

	hex2rgb: function(hex) {
		var instance = this;

		hex = String(hex).split('#');

		hex.unshift('#');

		return instance.getRGB(hex.join(''));
	},

	hsb2rgb: function() {
		var instance = this;

		var hsb = instance._getColorArgs('hsbo', arguments);

		hsb[2] /= 2;

		return instance.hsl2rgb.apply(instance, hsb);
	},

	hsv2rgb: function() {
		var instance = this;

		var hsv = instance._getColorArgs('hsv', arguments);

		var h = instance.constrainTo(hsv[0], 0, 1, 0);
		var s = instance.constrainTo(hsv[1], 0, 1, 0);
		var v = instance.constrainTo(hsv[2], 0, 1, 0);

		var r;
		var g;
		var b;

		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);

		switch(i % 6) {
			case 0:
				r = v;
				g = t;
				b = p;
			break;

			case 1:
				r = q;
				g = v;
				b = p;
			break;

			case 2:
				r = p;
				g = v;
				b = t;
			break;

			case 3:
				r = p;
				g = q;
				b = v;
			break;

			case 4:
				r = t;
				g = p;
				b = v;
			break;

			case 5:
				r = v;
				g = p;
				b = q;
			break;
		}

		return new Color.RGB(r * 255, g * 255, b * 255);
	},

	hsl2rgb: function() {
		var instance = this;

		var hsl = instance._getColorArgs('hslo', arguments);

		var h = hsl[0];
		var s = hsl[1];
		var l = hsl[2];
		var o = hsl[3];

		var r, g, b;

		if (s == 0) {
			r = g = b = l; // achromatic
		}
		else {
			var hue2rgb = instance._hue2rgb;

			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;

			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		return new Color.RGB(r * 255, g * 255, b * 255, o);
	},

	rgb2hex: function(red, green, blue) {
		var instance = this;

		var rgb = instance._getColorArgs('rgb', arguments);

		var r = rgb[0];
		var g = rgb[1];
		var b = rgb[2];

		return (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1);
	},

	rgb2hsb: function() {
		var instance = this;

		var obj = instance.rgb2hsv.apply(instance, arguments);

		obj.b = obj.v;

		return obj;
	},

	rgb2hsl: function() {
		var instance = this;

		var rgb = instance._getColorArgs('rgb', arguments);

		var r = rgb[0] / 255;
		var g = rgb[1] / 255;
		var b = rgb[2] / 255;

		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);

		var h;
		var s;
		var l = (max + min) / 2;

		if (max == min) {
			h = s = 0; // achromatic
		}
		else {
			var d = max - min;

			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch(max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
				break;

				case g:
					h = (b - r) / d + 2;
				break;

				case b:
					h = (r - g) / d + 4;
				break;
			}

			h /= 6;
		}

		return {
			h: h,
			s: s,
			l: l,
			toString: Color._hsltoString
		};
	},

	rgb2hsv: function() {
		var instance = this;

		var rgb = instance._getColorArgs('rgb', arguments);

		var r = rgb[0] / 255;
		var g = rgb[1] / 255;
		var b = rgb[2] / 255;

		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);

		var h;
		var s;
		var v = max;

		var d = max - min;

		s = max == 0 ? 0 : d / max;

		if (max == min) {
			h = 0; // achromatic
		}
		else {
			switch(max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
				break;

				case g:
					h = (b - r) / d + 2;
				break;

				case b:
					h = (r - g) / d + 4;
				break;
			}

			h /= 6;
		}

		return {
			h: h,
			s: s,
			v: v,
			toString: Color._hsbtoString
		};
	},

	_getColorArgs: function(type, args) {
		var instance = this;

		var returnData = [];
		var firstArg = args[0];

		if (isArray(firstArg) && firstArg.length) {
			returnData = firstArg;
		}
		else if (isObject(firstArg)) {
			var keys = type.split('');
			var length = keys.length;

			for (var i = 0; i < length; i++) {
				returnData[i] = firstArg[keys[i]];
			}
		}
		else {
			returnData = A.Array(args);
		}

		return returnData;
	},

	_hsbtoString: function() {
		var instance = this;

		return ['hs', (('v' in instance) ? 'v' : 'b'), '(', instance.h, instance.s, instance.b, ')'].join('');
	},

	_hsltoString: function() {
		var instance = this;

		return ['hsl(', instance.h, instance.s, instance.l, ')'].join('');
	},

	_hue2rgb: function(p, q, t) {
		if (t < 0) {
			t += 1;
		}

		if (t > 1) {
			t -= 1;
		}

		if (t < 1/6) {
			return p + (q - p) * 6 * t;
		}

		if (t < 1/2) {
			return q;
		}

		if (t < 2/3) {
			return p + (q - p) * (2/3 - t) * 6;
		}

		return p;
	},

	_toHex: function(color) {
		var instance = this;

		if (A.UA.ie) {
			// http://dean.edwards.name/weblog/2009/10/convert-any-color-value-to-hex-in-msie/
			instance._toHex = A.cached(
				function(color) {
					var docBody;
					var WIN = A.config.win;

					try {
						var docFile = new WIN.ActiveXObject('htmlfile');

						docFile.write('<body>');
						docFile.close();
						docBody = docFile.body;
					} catch(e) {
						docBody = WIN.createPopup().document.body;
					}

					var range = docBody.createTextRange();

					try {
						docBody.style.color = String(color).replace(REGEX_TRIM, STR_EMPTY);

						var value = range.queryCommandValue('ForeColor');

						value = ((value & 255) << 16) | (value & 65280) | ((value & 16711680) >>> 16);

						return '#' + ('000000' + value.toString(16)).slice(-6);
					} catch(e) {
						return 'none';
					}
				}
			);
		}
		else {
			var i = A.config.doc.createElement('i');

			i.title = 'AlloyUI Color Picker';
			i.style.display = 'none';

			A.getBody().append(i);

			instance._toHex = A.cached(
				function(color) {
					i.style.color = color;

					return A.config.doc.defaultView.getComputedStyle(i, STR_EMPTY).getPropertyValue('color');
				}
			);
		}

		return instance._toHex(color);
	}
};

Color.RGB = function(r, g, b, o) {
	var instance = this;

	if (r == 'error') {
		instance.error = 1;
	}
	else if (arguments.length) {
		instance.r = ~~r;
		instance.g = ~~g;
		instance.b = ~~b;

		instance.hex = '#' + Color.rgb2hex(instance);

		if (isFinite(parseFloat(o))) {
			instance.o = o;
		}
	}
};

Color.RGB.prototype = {
	r: -1,
	g: -1,
	b: -1,
	hex: 'none',
	toString: function() {
		var instance = this;

		return instance.hex;
	}
};

A.Color = Color;


}, 'gallery-2010.10.06-18-55' ,{skinnable:false});
