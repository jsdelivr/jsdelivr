YUI.add('gallery-colorpicker', function(Y) {

/**
* <p>The Color Picker Widget provides a HTML5 based UI for selecting a color
* from the HSL color space.</p>
* 
* <p><strong>Note:</strong> ColorPicker uses the Canvas element to render the dynamic
* color sliders, as such it <strong>requires HTML5 support</strong>, so <em>Internet Explorer
* versions prior to version 9 will not work with this widget</em>.</p>
*
* <p> To use the Color Picker Widget, simply add a reference to it in your
* <code>use()</code> statement, and then instantiate an instance of the widget
* and render it to a node.</p>
*
* <p>
* <code>
* &#60;script type="text/javascript"&#63;<br/>
*	// Call the 'use' method passing in "gallery-colorpicker". This will load<br/>
*	// the script and CSS for the Color Picker Widget and all of the required<br/>
*	// dependencies
* <br>
*	YUI().use("gallery-colorpicker", function (Y) { <br/>
*		// create an instance of the widget <br/>
*		var colorpicker = new Y.ColorPicker(); <br/>
*		// render the widget into the #picker node<br/>
*		colorpicker.render("#picker");<br/>
*		Y.on('#getcolorbutton',function(ev) {<br/>
*			ev.halt();<br/>
*			var hex = colorpicker.get('hex');<br/>
*			// do something with the hex value....<br/>
*		});<br/>
*	}
* </code>
* </p>
* @module gallery-colorpicker
* @requires node, event, widget, classnamemanager
*/

/**
* The Colors class provides simple color conversion functionality. It currently
* supports HSL to RGB conversions and vice versa. The conversion methods are
* used directly, e.g. <a href="Y.Colors.html#method_hslToRGB"><code>
* Y.Colors.hslToRGB(1.0,1.0,1.0);</code></a>
* @namespace Y
* @class Colors
*/
var Colors = {
	/**
	* Converts RGB values in the range 0-255 to HSL format in the range 0-1.
	* @method rgbToHSL
	* @param {Number} r red component of the color in the range 0-255
	* @param {Number} g green component of the color in the range 0-255
	* @param {Number} b blue component of the color in the range 0-255
	* @public
	* @return {object} the color in HSL format, returned as an object of the
	* form <code>&#123; h: 1.0, s: 0.5, l: 0.5 &#125;</code>. The HSL values are normalised in the
	* range 0-1.
	*/
	rgbToHSL: function (r, g, b) {
		r /= 255; g /= 255; b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b),
			h, s, l = (max + min) / 2, d;

		if (max === min) {
			h = s = 0; // achromatic
		} else {
			d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

		return {h: h, s: s, l: l};
	},
	/**
	* Internal method used for converting for HSL to RGB.
	* @method _hue2rgb
	* @protected
	*/
	_hue2rgb: function (p, q, t) {
		if (t < 0) { t += 1; }
		if (t > 1) { t -= 1; }
		if (t < 1 / 6) { return p + (q - p) * 6 * t; }
		if (t < 1 / 2) { return q; }
		if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
		return p;
	},
	
	/**
	* Converts HSL values in the range 0-1 to RGB format in the range 0-255.
	* @method hslToRGB
	* @param {Number} h hue component of the color in the range 0-1
	* @param {Number} s saturation component of the color in the range 0-1
	* @param {Number} l lightness component of the color in the range 0-1
	* @public
	* @return {object} the color in RGB format, returned as an object of the
	* form <code>&#123; r: 255, g: 0, b: 0 &#125;</code>. The RGB values are normalised in the
	* range 0-255.
	*/
	hslToRGB: function (h, s, l) {
		var r, g, b, q, p;
		if (s === 0) {
			r = g = b = l; // achromatic
		} else {

			q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			p = 2 * l - q;
			r = Colors._hue2rgb(p, q, h + 1 / 3);
			g = Colors._hue2rgb(p, q, h);
			b = Colors._hue2rgb(p, q, h - 1 / 3);
		}

		return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
	}
};
Y.Colors = Colors;

/**
* ColorPicker is a widget that provides a HTML5 based canvas interface to selecting colors
* using the HSL format. It provides a thumb from which to select colors as well as sliders
* and text areas for manually entering values.
* 
* You can retrieve the currently selected color through a variety of properties, allowing
* you to select colors in HSL, RGB and Hex formats.
*
* @namespace Y
* @class ColorPicker
*/
function ColorPicker() {
	ColorPicker.superclass.constructor.apply(this, arguments);
}

ColorPicker.NAME = 'colorpicker';
ColorPicker.CLASSNAME = Y.ClassNameManager.getClassName(ColorPicker.NAME);
ColorPicker.CLASSNAME_SQUARE = Y.ClassNameManager.getClassName(ColorPicker.NAME,'colrsqr');
ColorPicker.CLASSNAME_HBAR = Y.ClassNameManager.getClassName(ColorPicker.NAME,'hbar');
ColorPicker.CLASSNAME_SBAR = Y.ClassNameManager.getClassName(ColorPicker.NAME,'sbar');
ColorPicker.CLASSNAME_LBAR = Y.ClassNameManager.getClassName(ColorPicker.NAME,'lbar');
ColorPicker.CLASSNAME_SWATCH = Y.ClassNameManager.getClassName(ColorPicker.NAME,'swatch');
ColorPicker.CLASSNAME_VALUE = Y.ClassNameManager.getClassName(ColorPicker.NAME,'val');
ColorPicker.CLASSNAME_HVALUE = Y.ClassNameManager.getClassName(ColorPicker.NAME,'hval');
ColorPicker.CLASSNAME_SVALUE = Y.ClassNameManager.getClassName(ColorPicker.NAME,'sval');
ColorPicker.CLASSNAME_LVALUE = Y.ClassNameManager.getClassName(ColorPicker.NAME,'lval');
ColorPicker.CLASSNAME_RVALUE = Y.ClassNameManager.getClassName(ColorPicker.NAME,'rval');
ColorPicker.CLASSNAME_GVALUE = Y.ClassNameManager.getClassName(ColorPicker.NAME,'gval');
ColorPicker.CLASSNAME_BVALUE = Y.ClassNameManager.getClassName(ColorPicker.NAME,'bval');
ColorPicker.CLASSNAME_HEXVALUE = Y.ClassNameManager.getClassName(ColorPicker.NAME,'hexval');

// Configuration attributes
ColorPicker.ATTRS = {
	/**
	* Controls visibility of the Hue, Saturation and Lightness color bars from which colors can be selected.
	* @config showHSLBars
	* @type Boolean
	* @default true
	*/
	showHSLBars: {
		value: true
	},
	/**
	* Controls visibility of the Hue, Saturation and Lightness text boxes, allowing manual selection of specific values.
	* @config showHSL
	* @type Boolean
	* @default true
	*/
	showHSL: {	
		value: true
	},
	/**
	* Controls visibility of the Red, Green and Blue text boxes, allowing manual selection of specific values.
	* @config showRGB
	* @type Boolean
	* @default true
	*/
	showRGB: {
		value: true
	},
	/**
	* Controls visibility of the HEX text box.
	* @config showHEX
	* @type Boolean
	* @default true
	*/
	showHEX: {
		value: true
	},
	/**
	* Controls visibility of the color swatch area which displays the current color.
	* @config showSwatch
	* @type Boolean
	* @default true
	*/
	showSwatch: {
		value: true
	},
	/**
	* The width of the color selector area in pixels
	* @config squareWidth
	* @type Number
	* @default 150
	*/
	squareWidth: {
		value: 150
	},
	/**
	* The height of the color selector area in pixels
	* @config squareHeight
	* @type Number
	* @default 150
	*/
	squareHeight: {
		value: 150
	},
	
	/**
	* The width of the color bars in pixels
	* @config barWidth
	* @type Number
	* @default 20
	*/
	barWidth: {
		value: 20
	},
	/**
	* The height of the color bars in pixels
	* @config barHeight
	* @type Number
	* @default 150
	*/
	barHeight: {
		value: 150
	},
	
	/**
	* The width of the color swatch in pixels
	* @config swatchWidth
	* @type Number
	* @default 110
	*/
	swatchWidth: {
		value: 110
	},
	
	/**
	* The height of the color swatch in pixels
	* @config swatchHeight
	* @type Number
	* @default 34
	*/
	swatchHeight: {
		value: 34
	},
	
	/**
	* Gets or sets the selected color of the picker using HEX notation, e.g. <code>FFFFFF</code>
	* @config hex
	* @type String
	* @default 'FF0000'
	*/
	hex: {
		getter: function () {
			var rgb = this.get('rgb'),
				r = rgb.r.toString(16),
				g = rgb.g.toString(16),
				b = rgb.b.toString(16);
			if (r.length < 2) {
				r = "0" + r;
			}
			if (g.length < 2) {
				g = "0" + g;
			}
			if (b.length < 2) {
				b = "0" + b;
			}
			return r + g + b;
		},
		setter: function (val) {
			// convert hex string back to rgb, then use set('rgb', val);
			if (val.length < 6) {
				return;
			}
			var rComp = val[0] + val[1],
				gComp = val[2] + val[3],
				bComp = val[4] + val[5],
				r = parseInt(rComp, 16),
				g = parseInt(gComp, 16),
				b = parseInt(bComp, 16);
			this.set('rgb', {r: r, g: g, b: b});
		}
	},
	/**
	* Gets or sets the selected color of the picker using RGB object notation, <code>{ r: 255, g: 0, b: 255 }</code>
	* @config rgb
	* @type Object
	* @default {r: 255, g: 0, b: 0}
	*/
	rgb: {
		getter: function () { return Colors.hslToRGB(this.color.h, this.color.s, this.color.l); },
		setter: function (val) {
			val.r = Math.min(val.r, 255);
			val.g = Math.min(val.g, 255);
			val.b = Math.min(val.b, 255);
			
			val.r = Math.max(val.r, 0);
			val.g = Math.max(val.g, 0);
			val.b = Math.max(val.b, 0);
			// set the internal hsl value from the rgb values given
			var hsl = Colors.rgbToHSL(val.r, val.g, val.b);
			this.color = Y.merge(hsl);
			this.update();
		}
	},
	/**
	* Gets or sets the selected color of the picker using HSL integer object notation, <code>{ h: 360, s: 0, l: 100 }</code>.
	* Hue is represented in the range 0 - 360, saturation and lightness are in the range 0 - 100.
	* @config hslInt
	* @type Object
	* @default {h: 0, s: 100, l: 50}
	*/
	hslInt: {
		getter: function () {
			var hsl = Y.merge(this.color);
			hsl.h = Math.round(hsl.h * 360);
			hsl.s = Math.round(hsl.s * 100);
			hsl.l = Math.round(hsl.l * 100);
			return hsl;
		},
		setter: function (val) {
			var hsl = Y.merge(val);
			hsl.h = hsl.h / 360;
			hsl.s = hsl.s / 100;
			hsl.l = hsl.l / 100;
			hsl.h = Math.min(hsl.h, 1.0);
			hsl.s = Math.min(hsl.s, 1.0);
			hsl.l = Math.min(hsl.l, 1.0);
			hsl.h = Math.max(hsl.h, 0.0);
			hsl.s = Math.max(hsl.s, 0.0);
			hsl.l = Math.max(hsl.l, 0.0);
			this.color = hsl;
			this.update();
		}
	},
	/**
	* Gets or sets the selected color of the picker using HSL floating point object notation, <code>{ h: 1.0, s: 0, l: 1.0 }</code>.
	* All values are normalized in the range 0 - 1.
	* @config hsl
	* @type Object
	* @default {h: 0, s: 1, l: 0.5}
	*/
	hsl: {
		getter: function () { return this.color; },
		setter: function (val) {
			val.h = Math.min(val.h, 1.0);
			val.s = Math.min(val.s, 1.0);
			val.l = Math.min(val.l, 1.0);
			val.h = Math.max(val.h, 0.0);
			val.s = Math.max(val.s, 0.0);
			val.l = Math.max(val.l, 0.0);
			this.color = Y.merge(val);
			this.update();
		}
	},
	/**
	* Controls if the color bars should be cached in memory. New color bars are generated as the Hue and Saturation values change,
	* these generated images will be saved in memory if cacheBars is enabled. This may marginally increase performance at the
	* cost of memory usage. Disabled by default.
	* @config cacheBars
	* @type Boolean
	* @default false
	*/
	cacheBars: {
		value: false
	},
	/**
	* Sets the strings used for the labels on the text boxes, the available properties are <code>'hValue', 'sValue', 'lValue',
	* 'rValue', 'gValue', 'bValue', 'hexValue'</code>.
	* @config strings
	* @type Object
	* @default { hValue: 'H', sValue: 'S', lValue: 'L', rValue: 'R', gValue: 'G', bValue: 'B', hexValue: 'Hex' }
	*/
	strings: {
		value: {
			hValue: 'H',
			sValue: 'S',
			lValue: 'L',
			rValue: 'R',
			gValue: 'G',
			bValue: 'B',
			hexValue: 'Hex'
		}
	}
};

Y.extend(ColorPicker, Y.Widget, {
	/**
	* The current color selected by the picker in HSL object format.
	* @property color
	* @protected
	* @type Object
	* @default {h: 0, s: 1.0, l: 0.5}
	*/
	color: {h: 0, s: 1.0, l: 0.5},
	
	/**
	* An in-memory cache of the saturation bar images. Only used if cacheBars is enabled.
	* @property sCachePixels
	* @protected
	* @type Object
	*/
	sCachePixels: {},
	
	/**
	* An in-memory cache of the lightness bar images. Only used if cacheBars is enabled.
	* @property lCachePixels
	* @protected
	* @type Object
	*/
	lCachePixels: {},
	
	/**
	* An in-memory cache of the color selector area. Only used if cacheBars is enabled.
	* @property squareCachePixels
	* @protected
	* @type Object
	*/
	squareCachePixels: {},
	
	/**
	* Horizontal padding between color bars.
	* @property barPaddingX
	* @protected
	* @type Number
	* @default 5
	*/
	barPaddingX: 5,
	
	/**
	* Vertical padding between color bars.
	* @property barPaddingY
	* @protected
	* @type Number
	* @default 5
	*/
	barPaddingY: 5,
	
	renderUI: function () {
		this.contentBox = this.get('contentBox');
		this.contentBox.addClass(this.name);
		
		this.squareCanvas = this.createCanvas(ColorPicker.CLASSNAME_SQUARE, this.get('squareWidth'), this.get('squareHeight'));
		this.squareCanvas.id = "squareCanvas";
		// render the current saturation level to the square canvas, iterating of H and L
		this.renderSquare();
		
		var barWidth, barHeight, rgbColor, hexColor;
		if (this.get('showHSLBars')) {
			barWidth = this.get('barWidth');
			barHeight = this.get('barHeight');
			this.hCanvas = this.createCanvas(ColorPicker.CLASSNAME_HBAR, barWidth + this.barPaddingX * 2, barHeight + this.barPaddingY * 2);
			this.sCanvas = this.createCanvas(ColorPicker.CLASSNAME_SBAR, barWidth + this.barPaddingX * 2, barHeight + this.barPaddingY * 2);
			this.lCanvas = this.createCanvas(ColorPicker.CLASSNAME_LBAR, barWidth + this.barPaddingX * 2, barHeight + this.barPaddingY * 2);
		}
		if (this.get('showSwatch')) {
			this.swatchCanvas = Y.Node.create("<div></div>");
			this.swatchCanvas.addClass(ColorPicker.CLASSNAME_SWATCH);
			this.contentBox.appendChild(this.swatchCanvas);
		}
		if (this.get('showHSL')) {
			this.hVal = this.createValue(ColorPicker.CLASSNAME_HVALUE, this.get('strings.hValue'), this.color.h, 3, 3, 'hslInt', 'h');
			this.sVal = this.createValue(ColorPicker.CLASSNAME_SVALUE, this.get('strings.sValue'), this.color.s, 3, 3, 'hslInt', 's');
			this.lVal = this.createValue(ColorPicker.CLASSNAME_LVALUE, this.get('strings.lValue'), this.color.l, 3, 3, 'hslInt', 'l');
		}
		
		if (this.get('showRGB')) {
			rgbColor = this.get('rgb');
			this.rVal = this.createValue(ColorPicker.CLASSNAME_RVALUE, this.get('strings.rValue'), rgbColor.r, 3, 3, 'rgb', 'r');
			this.gVal = this.createValue(ColorPicker.CLASSNAME_GVALUE, this.get('strings.gValue'), rgbColor.g, 3, 3, 'rgb', 'g');
			this.bVal = this.createValue(ColorPicker.CLASSNAME_BVALUE, this.get('strings.bValue'), rgbColor.b, 3, 3, 'rgb', 'b');
		}
		if (this.get('showHEX')) {				
			hexColor = this.get('hex');
			this.hexVal = this.createValue(ColorPicker.CLASSNAME_HEXVALUE, this.get('strings.hexValue'), hexColor, 6, 6, 'hex', null);
		}
	},
	renderPixels: function (canvas, width, height, paddingX, paddingY, fixedComponent, fixedValue, componentX, componentY, startX, startY, maxX, maxY, reverse) {
		var ctx = canvas.getContext('2d'),
			// create some imagedata to draw into
			pixels = ctx.createImageData(width, height),
			// loop over the canvas modifying appropriate component between start and range values
			// figure out the starting positions
			hsl = {h: 0, s: 0, l: 0},
			componentXInc = (maxX - startX) / width,
			componentYInc = (maxY - startY) / height,
			idx = 0,
			idxInc = 1,
			x,
			y,
			rgb;
			
		hsl[fixedComponent] = fixedValue;
		hsl[componentX] = startX;
		hsl[componentY] = startY;
		
		if (reverse) {
			idxInc = -1;
			idx = pixels.data.length;
		}
		for (y = 0; y < height; y += 1) {
			for (x = 0; x < width; x += 1) {
				rgb = Colors.hslToRGB(hsl.h, hsl.s, hsl.l);
				//var rgb = {r:255, g:255, b:255};
				pixels.data[idx] = rgb.r;
				idx += idxInc;
				pixels.data[idx] = rgb.g;
				idx += idxInc;
				pixels.data[idx] = rgb.b;
				idx += idxInc;
				pixels.data[idx] = 255;
				idx += idxInc;
				hsl[componentX] += componentXInc;
			}
			hsl[componentY] += componentYInc;
			hsl[componentX] = startX;
		}
		ctx.putImageData(pixels, paddingX, paddingY);
		return pixels;
	}, 
	startUpdating: function () {
		this.stopUpdating();
		this.moveListener = Y.on('mousemove', this.onMouseMove, this.get('boundingBox'), this);
		this.mouseUpListener = Y.on('mouseup', this.onMouseUp, document.body, this);
		this.animTimer = Y.later(60, this, this.update, null, true);
	}, 
	stopUpdating: function () {
		if (this.animTimer) {
			this.animTimer.cancel();
			this.animTimer = null;
		}
		if (this.moveListener) {
			this.moveListener.detach();
			this.moveListener = null;
		}
		if (this.mouseUpListener) {
			this.mouseUpListener.detach();
			this.mouseUpListener = null;
		}
	}, 
	onBarMouseDown: function (ev, args) {
		this.trackBar = args.component;
		this.trackBarCanvas = ev.target;
		var offXY = ev.target.getXY(),
			scrollX = ev.target.get('docScrollX'),
			scrollY = ev.target.get('docScrollY'),
			// get position within the square
			x = ev.clientX + scrollX - offXY[0],
			y = ev.clientY + scrollY - offXY[1];
			
		this.barX = x;
		this.barY = y;
		this.startUpdating();
		ev.halt();
	},
	onMouseUp: function (ev) {
		this.trackBar = false;
		this.trackSquare = false;
		this.stopUpdating();
		ev.halt();
	},
	onMouseMove: function (ev) {
		var offXY,
			x,
			y,
			width,
			height,
			scrollX,
			scrollY,
			c;
			
		if (this.trackSquare) {
			c = Y.Node.one(this.squareCanvas);
			offXY = c.getXY();
			scrollX = c.get('docScrollX');
			scrollY = c.get('docScrollY');
			// get position within the square
			x = ev.clientX + scrollX - offXY[0];
			y = ev.clientY + scrollY - offXY[1];
			width = this.get('squareWidth');
			height = this.get('squareHeight');
				
			x = Math.min(width, x);
			y = Math.min(height, y);
			y = Math.max(0, y);
			x = Math.max(0, x);
			this.squareX = x;
			this.squareY = y;
		}
		if (this.trackBar) {
			offXY = this.trackBarCanvas.getXY();
			scrollX = this.trackBarCanvas.get('docScrollX');
			scrollY = this.trackBarCanvas.get('docScrollY');
			// get position within the square
			x = -this.barPaddingX + ev.clientX + scrollX - offXY[0];
			y = -this.barPaddingY + ev.clientY + scrollY - offXY[1];
			width = this.get('barWidth');
			height = this.get('barHeight');
				
			x = Math.min(width, x);
			y = Math.min(height, y);
			y = Math.max(0, y);
			x = Math.max(0, x);
			this.barX = x;
			this.barY = y;
		}
		ev.halt();
	},
	onSquareMouseDown: function (ev) {
		// mousedown inside square, start tracking position
		this.trackSquare = true;
		var offXY = ev.target.getXY(),
			scrollX = ev.target.get('docScrollX'),
			scrollY = ev.target.get('docScrollY'),
			// get position within the square
			x = ev.clientX + scrollX - offXY[0],
			y = ev.clientY + scrollY - offXY[1];
			
		this.squareX = x;
		this.squareY = y;
		this.startUpdating();
		ev.halt();
	},
	updateColor: function () {
		if (!this.get('showHSLBars')) {
			return;
		}
		var barWidth = this.get('barWidth'),
			barHeight = this.get('barHeight'),
			cacheBars = this.get('cacheBars'),
			ctx = this.hCanvas.getContext('2d');
			
		// clear the bars			
		ctx.clearRect(0, 0, barWidth + this.barPaddingX * 2, barHeight + this.barPaddingY * 2);
		ctx = this.sCanvas.getContext('2d');
		ctx.clearRect(0, 0, barWidth + this.barPaddingX * 2, barHeight + this.barPaddingY * 2);
		ctx = this.lCanvas.getContext('2d');
		ctx.clearRect(0, 0, barWidth + this.barPaddingX * 2, barHeight + this.barPaddingY * 2);
		
		if (cacheBars) {
			// render bars using cached pixel arrays if possible (uses more memory)
			if (!this.sCachePixels[this.color.h]) {
				this.sCachePixels[this.color.h] = this.renderPixels(this.sCanvas, barWidth, barHeight, this.barPaddingX, this.barPaddingY, 'h', this.color.h, 'l', 's', 50, 100, 50, 0);
			} else {
				ctx = this.sCanvas.getContext('2d');
				ctx.putImageData(this.sCachePixels[this.color.h], this.barPaddingX, this.barPaddingY);
			}
			if (!this.lCachePixels[this.color.h]) {
				this.lCachePixels[this.color.h] = this.renderPixels(this.lCanvas, barWidth, barHeight, this.barPaddingX, this.barPaddingY, 'h', this.color.h, 's', 'l', 100, 100, 100, 0);
			} else {
				ctx = this.lCanvas.getContext('2d');
				ctx.putImageData(this.lCachePixels[this.color.h], this.barPaddingX, this.barPaddingY);
			}
		} else {
			this.renderPixels(this.sCanvas, barWidth, barHeight, this.barPaddingX, this.barPaddingY, 'h', this.color.h, 'l', 's', 0.5, 1.0, 0.5, 0);
			this.renderPixels(this.lCanvas, barWidth, barHeight, this.barPaddingX, this.barPaddingY, 'h', this.color.h, 's', 'l', 1.0, 1.0, 1.0, 0);
		}
		if (!this.huePixelCache) {
			this.huePixelCache = this.renderPixels(this.hCanvas, barWidth, barHeight, this.barPaddingX, this.barPaddingY, 's', 1.0, 'l', 'h', 0.5, 0, 0.5, 1.0);
		} else {
			ctx = this.hCanvas.getContext('2d');
			ctx.putImageData(this.huePixelCache, this.barPaddingX, this.barPaddingY);
		}
		// now draw on the pointers
	},
	drawThumb: function (canvas, component, baseColor, width, height, max, reverse) {
		var value = this.color[component],
			// render the thumb to the canvas
			ctx = canvas.getContext('2d'),
			// calculate position of thumb within bar
			y = (height / max) * (value),
			col = baseColor,
			rgb;
			
		if (reverse) {
			y = height - y;
		}
		y += this.barPaddingY;
		// calculate colour under thumb
		col[component] = value;
		// invert color
		col.h = col.h - 0.5;
		if (col.h < 0) {
			col.h += 1.0;
		}
		col.s = col.s - 0.5;
		if (col.s < 0) {
			col.s += 1.0;
		}
		col.l = col.l - 0.5;
		if (col.l < 0) {
			col.l += 1.0;
		}
		// now draw a line in that colour at y
		ctx.beginPath();
		ctx.moveTo(this.barPaddingX, y);
		ctx.lineTo(width + this.barPaddingX * 2, y);
		rgb = Colors.hslToRGB(col.h, col.s, col.l);
		ctx.strokeStyle = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
		ctx.lineWidth = 0.5;
		ctx.stroke();
		
		// draw the triangles
		ctx.beginPath();
		
		ctx.moveTo(this.barPaddingX, y);
		ctx.lineTo(0, y - 2.5);
		ctx.lineTo(0, y + 2.5);
		ctx.lineTo(this.barPaddingX, y);
		
		ctx.moveTo(width + this.barPaddingX, y);
		ctx.lineTo(width + this.barPaddingX * 2, y - 2.5);
		ctx.lineTo(width + this.barPaddingX * 2, y + 2.5);
		ctx.lineTo(width + this.barPaddingX, y);
		
		ctx.strokeStyle = "rgb(255, 255, 255)";
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.stroke();
		ctx.fill();
	},
	updateValues: function () {
		// update each of the input boxes
		var rgb = this.get('rgb'), hexColor;
		if (this.get('showSwatch')) {
			this.swatchCanvas.setStyle('background', 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')');
		}
		if (this.get('showHSL')) {
			this.hVal.set('value', Math.round(this.color.h * 360));
			this.sVal.set('value', Math.round(this.color.s * 100));
			this.lVal.set('value', Math.round(this.color.l * 100));
		}
		
		if (this.get('showRGB')) {
			this.rVal.set('value', rgb.r);
			this.gVal.set('value', rgb.g);
			this.bVal.set('value', rgb.b);
		}
		if (this.get('showHEX')) {				
			hexColor = this.get('hex');
			this.hexVal.set('value', hexColor);
		}
	},
	update: function () {
		var width = this.get('squareWidth'), height = this.get('squareHeight'),
			barWidth = this.get('barWidth'), barHeight = this.get('barHeight'),
			h, l, v;
		// calculate hue from position
		if (this.trackSquare) {
			h = (1.0 / width) * this.squareX;
			l = 1.0 - (1.0 / height) * this.squareY;
			this.color.h = h;
			this.color.l = l;
		}
		if (this.trackBar) {
			if (this.trackBar === 'h') {
				h = (1.0 / barHeight) * this.barY;
				this.color.h = h;
			} else {
				v = 1.0 - (1.0 / barHeight) * this.barY;
				this.color[this.trackBar] = v;
			}
		}
		this.renderSquare();
		this.updateValues();
		if (this.get('showHSLBars')) {
			this.updateColor();
			this.drawThumb(this.hCanvas, 'h', {h: this.color.h, s: 1.0, l: 0.5}, barWidth, barHeight, 1.0, false);
			this.drawThumb(this.sCanvas, 's', {h: this.color.h, s: 1.0, l: this.color.l}, barWidth, barHeight, 1.0, true);
			this.drawThumb(this.lCanvas, 'l', {h: this.color.h, s: this.color.s, l: 0.5}, barWidth, barHeight, 1.0, true);
		}
	},
	renderSquare: function () {
		var width = this.get('squareWidth'), height = this.get('squareHeight'),
			ctx = this.squareCanvas.getContext('2d'), radius, x, y;
		if (!this.squareCachePixels[this.color.s]) {
			this.squareCachePixels[this.color.s] = this.renderPixels(this.squareCanvas, width, height, 0, 0, 's', this.color.s, 'h', 'l', 0, 1.0, 1.0, 0);
		} else {
			ctx.putImageData(this.squareCachePixels[this.color.s], 0, 0);
		}
		// draw circle around selected hue/lightness
		ctx.strokeStyle = 'rgb(255, 255, 255)';
		radius = 5;
		x = (this.color.h * (width/1.0));
		y = ((1.0 - this.color.l) * (height/1.0));
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle = 'rgb(0, 0, 0)';
		ctx.arc(x, y, radius + 1, 0, Math.PI * 2, true);
		ctx.stroke();
	},
	createCanvas: function (className, width, height) {
		var div = Y.Node.create("<div class='" + className + "'></div>"),
			canvas = Y.Node.create("<canvas width='" + width + "' height='" + height + "'></canvas>");
		div.appendChild(canvas);
		this.contentBox.appendChild(div);
		return Y.Node.getDOMNode(canvas);
	},
	
	createValue: function (className, label, value, size, maxLength, target, component) {
		var div = Y.Node.create("<div class='" + ColorPicker.CLASSNAME_VALUE + " " + className + "'></div>"),
			input = Y.Node.create("<input type='text' size='" + size + "' maxlength='" + maxLength + "' value='" + value + "'></input>");
			
		label = Y.Node.create("<label>" + label + "</label>");
		div.appendChild(label);
		label.appendChild(input);
		this.contentBox.appendChild(div);
		input.setData('target', target);
		input.setData('component', component);
		return input;
	},
	onInputKeyDown: function (ev) {
		if (ev.charCode === 13 || ev.charCode === 8 || ev.charCode === 127 || ev.charCode === 9) {
			return true;
		}
		var key = String.fromCharCode(ev.charCode),
			input = ev.target,
			target = input.getData('target'),
			regex;
		if (target === 'hex') {
			// allow 0-9a-f
			regex = /[0-9]|[a-f]|[A-F]/;
			if (!regex.test(key)) {
				ev.halt();
				return false;
			}
		} else {
			// only allow 0-9
			regex = /[0-9]/;
			if (!regex.test(key)) {
				ev.halt();
				return false;
			}
		}
	},
	onInputKeyUp: function (ev) {
		// filter out everything except numbers
		// update RGB values 
		// filter it out
		// use data in target object
		var input = ev.target,
			target = input.getData('target'),
			component = input.getData('component'),
		
			inputValue = input.get('value'),
			value;
			
		if (inputValue === '') {
			return;
		}
		
		if (target === 'hex') {
			if (inputValue.length < 6) {
				return;
			}
			// special case, just update the value
			this.set(target, inputValue);
			return;
		}
		
		// get current value using the target
		value = this.get(target);
		value[component] = parseInt(inputValue, 10);
		
		this.set(target, value);
	},
	onInputBlur: function () {
		this.update();
	},
	bindUI: function () {
		Y.on('mousedown', this.onSquareMouseDown, this.squareCanvas, this);
		if (this.get('showHSLBars')) {
			Y.on('mousedown', this.onBarMouseDown, this.hCanvas, this, {component: 'h'});
			Y.on('mousedown', this.onBarMouseDown, this.sCanvas, this, {component: 's'});
			Y.on('mousedown', this.onBarMouseDown, this.lCanvas, this, {component: 'l'});
		}
		Y.delegate('keyup', this.onInputKeyUp, this.contentBox, '.' + ColorPicker.CLASSNAME_VALUE, this);
		Y.delegate('blur', this.onInputBlur, this.contentBox, '.' + ColorPicker.CLASSNAME_VALUE, this);
		Y.delegate('keydown', this.onInputKeyDown, this.contentBox, '.' + ColorPicker.CLASSNAME_VALUE, this);
	},
	syncUI: function () {
		var width = this.get('squareWidth'), height = this.get('squareHeight');
		this.squareX = this.color.h * (width/1.0);
		this.squareY = this.color.l * (height/1.0);
		this.update();
	}
});

Y.ColorPicker = ColorPicker;

/**
* ColorPalette provides a simple interface for storing and reusing selected colors. It can be coupled with the ColorPicker widget to provide
* a simple history of selected colors.
* 
* @namespace Y
* @class ColorPalette
*/
function ColorPalette() {
	ColorPalette.superclass.constructor.apply(this, arguments);
	
	/**
	* An event fired when a color in the palette is clicked upon.
	* @event palette:selected
	* @param {Object} color An object containing the color in RGB and HSL format e.g. <code>&#123; rgb: &#123; r: 255, g: 0, b: 0 &#125;, hsl: &#123; h: 1.0, s: 0.5, l: 1.0 &#125; &#125;</code>
	*/
	this.publish("palette:selected");
}

ColorPalette.NAME = 'colorPalette';

ColorPalette.CLASSNAME_SWATCH = 'cp-swatch';

// Configuration attributes
ColorPalette.ATTRS = {
};

Y.extend(ColorPalette, Y.Widget, {
	/**
	* An array of colors stored in the palette
	* @property colors
	* @type Array
	* @default []
	*/
	colors: [],
	
	/**
	* Returns true if the specified color (in HSL float object format) already exists in the palette
	* @method colorExists
	* @param color {Object} the color to test, in HSL float object format e.g. <code>&#123; h: 1.0, s: 1.0, l: 0.5 &#125;</code>
	* @return {Boolean} true if the color already exists in the palette
	*/
	colorExists: function (color) {
		var i, c;
		for (i = 0; i < this.colors.length; i += 1) {
			c = this.colors[i];
			if (c.h === color.h && c.s === color.s && c.l === color.l) {
				return true;
			}
		}
		return false;
	},
	/**
	* Adds the specified color to the palette if it doesn't already exist.
	* @method addColor
	* @param color {Object} the color to add, in HSL float object format e.g. <code>&#123; h: 1.0, s: 1.0, l: 0.5 &#125;</code>
	*/
	addColor: function (color) {
		if (this.colorExists(color)) {
			// swatch already exists, do nothing
			return;
		}
		var col = Y.merge(color),
			div = Y.Node.create('<div class="' + ColorPalette.CLASSNAME_SWATCH + '"></div>'),
			rgb = Colors.hslToRGB(col.h, col.s, col.l),
			contentBox = this.get('contentBox');
		div.setStyle('background', 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')');
		div.setData('hsl', col);
		contentBox.appendChild(div);
		this.colors.push(col);
	},	
	renderUI: function () {
		
	},
	bindUI: function () {
		Y.delegate('click', this.onSwatchClick, this.get('contentBox'), '.' + ColorPalette.CLASSNAME_SWATCH, this);
	},
	/**
	* Handler for the moment when a swatch in the palette is clicked. This handler fires the 'palette:selected' event.
	* @method onSwatchClick
	* @param {Object} ev the click event.
	* @protected
	*/
	onSwatchClick: function (ev) {
		var swatch = ev.target,
			hsl = swatch.getData('hsl'),
			rgb = Colors.hslToRGB(hsl.h, hsl.s, hsl.l);
		this.fire('palette:selected', {hsl: hsl, rgb: rgb});
	},
	syncUI: function () {
	
	}
});
Y.ColorPalette = ColorPalette;


}, 'gallery-2011.09.28-20-06' ,{requires:['node', 'event', 'widget', 'classnamemanager']});
