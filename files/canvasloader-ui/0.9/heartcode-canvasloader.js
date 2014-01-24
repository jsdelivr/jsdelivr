/*
* Copyright (c) 2011 Róbert Pataki
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
* 
* ----------------------------------------------------------------------------------------
* 
* Check out my GitHub:	http://github.com/heartcode/
* Send me an email:		heartcode@robertpataki.com
* Follow me on Twitter:	http://twitter.com/#iHeartcode
* Blog:					http://heartcode.robertpataki.com
*/

/**
* CanvasLoader uses the HTML5 canvas element in modern browsers and VML in IE6/7/8 to create and animate the most popular preloader shapes (oval, spiral, rectangle, square and rounded rectangle).<br/><br/>
* It is important to note that CanvasLoader doesn't show up and starts rendering automatically on instantiation. To start rendering and display the loader use the <code>show()</code> method.
* @module CanvasLoader
**/
(function (window) {
	"use strict";
	/**
	* CanvasLoader is a JavaScript UI library that draws and animates circular preloaders using the Canvas HTML object.<br/><br/>
	* A CanvasLoader instance creates two canvas elements which are placed into a placeholder div (the id of the div has to be passed in the constructor). The second canvas is invisible and used for caching purposes only.<br/><br/>
	* If no id is passed in the constructor, the canvas objects are paced in the document directly.
	* @class CanvasLoader
	* @constructor
	* @param id {String} The id of the placeholder div
	* @param opt {Object} Optional parameters<br/><br/>
	* <strong>Possible values of optional parameters:</strong><br/>
	* <ul>
	* <li><strong>id (String):</strong> The id of the CanvasLoader instance</li>
	* <li><strong>safeVML (Boolean):</strong> If set to true, the amount of CanvasLoader shapes are limited in VML mode. It prevents CPU overkilling when rendering loaders with high density. The default value is true.</li>
	**/
	var CanvasLoader = function (id, opt) {
		if (typeof(opt) == "undefined") { opt = {}; }
		this.init(id, opt);
	}, p = CanvasLoader.prototype, engine, engines = ["canvas", "vml"], shapes = ["oval", "spiral", "square", "rect", "roundRect"], cRX = /^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, ie8 = navigator.appVersion.indexOf("MSIE") !== -1 && parseFloat(navigator.appVersion.split("MSIE")[1]) === 8 ? true : false, canSup = !!document.createElement('canvas').getContext, safeDensity = 40, safeVML = true,
	/**
	* Creates a new element with the tag and applies the passed properties on it
	* @method addEl
	* @protected
	* @param tag {String} The tag to be created
	* @param par {String} The DOM element the new element will be appended to
	* @param opt {Object} Additional properties passed to the new DOM element
	* @return {Object} The DOM element
	*/
		addEl = function (tag, par, opt) {
			var el = document.createElement(tag), n;
			for (n in opt) { el[n] = opt[n]; }
			if(typeof(par) !== "undefined") {
				par.appendChild(el);
			}
			return el;
		},
	/**
	* Sets the css properties on the element
	* @method setCSS
	* @protected
	* @param el {Object} The DOM element to be styled
	* @param opt {Object} The style properties
	* @return {Object} The DOM element
	*/
		setCSS = function (el, opt) {
			for (var n in opt) { el.style[n] = opt[n]; }
			return el;
		},
	/**
	* Sets the attributes on the element
	* @method setAttr
	* @protected
	* @param el {Object} The DOM element to add the attributes to
	* @param opt {Object} The attributes
	* @return {Object} The DOM element
	*/
		setAttr = function (el, opt) {
			for (var n in opt) { el.setAttribute(n, opt[n]); }
			return el;
		},
	/**
	* Transforms the cache canvas before drawing
	* @method transCon
	* @protected
	* @param	x {Object} The canvas context to be transformed
	* @param	x {Number} x translation
	* @param	y {Number} y translation
	* @param	r {Number} Rotation radians
	*/
		transCon = function(c, x, y, r) {
			c.save();
			c.translate(x, y);
			c.rotate(r);
			c.translate(-x, -y);
			c.beginPath();
		};
	/** 
	* Initialization method
	* @method init
	* @protected
	* @param id {String} The id of the placeholder div, where the loader will be nested into
	* @param opt {Object} Optional parameters<br/><br/>
	* <strong>Possible values of optional parameters:</strong><br/>
	* <ul>
	* <li><strong>id (String):</strong> The id of the CanvasLoader instance</li>
	* <li><strong>safeVML (Boolean):</strong> If set to true, the amount of CanvasLoader shapes are limited in VML mode. It prevents CPU overkilling when rendering loaders with high density. The default value is true.</li>
	**/
	p.init = function (pId, opt) {
		
		if (typeof(opt.safeVML) === "boolean") { safeVML = opt.safeVML; }
		
		/*
		* Find the containing div by id
		* If the container element cannot be found we use the document body itself
		*/
		try {
			// Look for the parent element
			if (document.getElementById(pId) !== undefined) {
				this.mum = document.getElementById(pId);
			} else {
				this.mum = document.body;
			}
		} catch (error) {
			this.mum = document.body;
		}
		// Creates the parent div of the loader instance
		opt.id = typeof (opt.id) !== "undefined" ? opt.id : "canvasLoader";
		this.cont = addEl("div", this.mum, {id: opt.id});
		if (canSup) {
		// For browsers with Canvas support...
			engine = engines[0];
			// Create the canvas element
			this.can = addEl("canvas", this.cont);
			this.con = this.can.getContext("2d");
			// Create the cache canvas element
			this.cCan = setCSS(addEl("canvas", this.cont), { display: "none" });
			this.cCon = this.cCan.getContext("2d");
		} else {
		// For browsers without Canvas support...
			engine = engines[1];
			// Adds the VML stylesheet
			if (typeof (CanvasLoader.vmlSheet) === "undefined") {
				document.getElementsByTagName("head")[0].appendChild(addEl("style"));
				CanvasLoader.vmlSheet = document.styleSheets[document.styleSheets.length - 1];
				var a = ["group", "oval", "roundrect", "fill"], n;
				for ( var n = 0; n < a.length; ++n ) { CanvasLoader.vmlSheet.addRule(a[n], "behavior:url(#default#VML); position:absolute;"); }
			}
			this.vml = addEl("group", this.cont);
		}
		// Set the RGB color object
		this.setColor(this.color);
		// Draws the shapes on the canvas
		this.draw();
		//Hides the preloader
		setCSS(this.cont, {display: "none"});
	};
/////////////////////////////////////////////////////////////////////////////////////////////
// Property declarations
	/**
	* The div we place the canvas object into
	* @property cont
	* @protected
	* @type Object
	**/
	p.cont = {};
	/**
	* The div we draw the shapes into
	* @property can
	* @protected
	* @type Object
	**/
	p.can = {};
	/**
	* The canvas context
	* @property con
	* @protected
	* @type Object
	**/
	p.con = {};
	/**
	* The canvas we use for caching
	* @property cCan
	* @protected
	* @type Object
	**/
	p.cCan = {};
	/**
	* The context of the cache canvas
	* @property cCon
	* @protected
	* @type Object
	**/
	p.cCon = {};
	/**
	* Adds a timer for the rendering
	* @property timer
	* @protected
	* @type Boolean
	**/
	p.timer = {};
	/**
	* The active shape id for rendering
	* @property activeId
	* @protected
	* @type Number
	**/
	p.activeId = 0;
	/**
	* The diameter of the loader
	* @property diameter
	* @protected
	* @type Number
	* @default 40
	**/
	p.diameter = 40;
	/**
	* Sets the diameter of the loader
	* @method setDiameter
	* @public
	* @param diameter {Number} The default value is 40
	**/
	p.setDiameter = function (diameter) { this.diameter = Math.round(Math.abs(diameter)); this.redraw(); };
	/**
	* Returns the diameter of the loader.
	* @method getDiameter
	* @public
	* @return {Number}
	**/
	p.getDiameter = function () { return this.diameter; };
	/**
	* The color of the loader shapes in RGB
	* @property cRGB
	* @protected
	* @type Object
	**/
	p.cRGB = {};
	/**
	* The color of the loader shapes in HEX
	* @property color
	* @protected
	* @type String
	* @default "#000000"
	**/
	p.color = "#000000";
	/**
	* Sets hexadecimal color of the loader
	* @method setColor
	* @public
	* @param color {String} The default value is '#000000'
	**/
	p.setColor = function (color) { this.color = cRX.test(color) ? color : "#000000"; this.cRGB = this.getRGB(this.color); this.redraw(); };
	/**
	* Returns the loader color in a hexadecimal form
	* @method getColor
	* @public
	* @return {String}
	**/
	p.getColor = function () { return this.color; };
	/**
	* The type of the loader shapes
	* @property shape
	* @protected
	* @type String
	* @default "oval"
	**/
	p.shape = shapes[0];
	/**
	* Sets the type of the loader shapes.<br/>
	* <br/><b>The acceptable values are:</b>
	* <ul>
	* <li>'oval'</li>
	* <li>'spiral'</li>
	* <li>'square'</li>
	* <li>'rect'</li>
	* <li>'roundRect'</li>
	* </ul>
	* @method setShape
	* @public
	* @param shape {String} The default value is 'oval'
	**/
	p.setShape = function (shape) {
		var n;
		for (n in shapes) {
			if (shape === shapes[n]) { this.shape = shape; this.redraw(); break; }
		}
	};
	/**
	* Returns the type of the loader shapes
	* @method getShape
	* @public
	* @return {String}
	**/
	p.getShape = function () { return this.shape; };
	/**
	* The number of shapes drawn on the loader canvas
	* @property density
	* @protected
	* @type Number
	* @default 40
	**/
	p.density = 40;
	/**
	* Sets the number of shapes drawn on the loader canvas
	* @method setDensity
	* @public
	* @param density {Number} The default value is 40
	**/
	p.setDensity = function (density) { 
		if (safeVML && engine === engines[1]) {
			this.density = Math.round(Math.abs(density)) <= safeDensity ? Math.round(Math.abs(density)) : safeDensity;
		} else {
			this.density = Math.round(Math.abs(density));
		}
		if (this.density > 360) { this.density = 360; }
		this.activeId = 0;
		this.redraw();
	};
	/**
	* Returns the number of shapes drawn on the loader canvas
	* @method getDensity
	* @public
	* @return {Number}
	**/
	p.getDensity = function () { return this.density; };
	/**
	* The amount of the modified shapes in percent.
	* @property range
	* @protected
	* @type Number
	**/
	p.range = 1.3;
	/**
	* Sets the amount of the modified shapes in percent.<br/>
	* With this value the user can set what range of the shapes should be scaled and/or faded. The shapes that are out of this range will be scaled and/or faded with a minimum amount only.<br/>
	* This minimum amount is 0.1 which means every shape which is out of the range is scaled and/or faded to 10% of the original values.<br/>
	* The visually acceptable range value should be between 0.4 and 1.5.
	* @method setRange
	* @public
	* @param range {Number} The default value is 1.3
	**/
	p.setRange = function (range) { this.range = Math.abs(range); this.redraw(); };
	/**
	* Returns the modified shape range in percent
	* @method getRange
	* @public
	* @return {Number}
	**/
	p.getRange = function () { return this.range; };
	/**
	* The speed of the loader animation
	* @property speed
	* @protected
	* @type Number
	**/
	p.speed = 2;
	/**
	* Sets the speed of the loader animation.<br/>
	* This value tells the loader how many shapes to skip by each tick.<br/>
	* Using the right combination of the <code>setFPS</code> and the <code>setSpeed</code> methods allows the users to optimize the CPU usage of the loader whilst keeping the animation on a visually pleasing level.
	* @method setSpeed
	* @public
	* @param speed {Number} The default value is 2
	**/
	p.setSpeed = function (speed) { this.speed = Math.round(Math.abs(speed)); };
	/**
	* Returns the speed of the loader animation
	* @method getSpeed
	* @public
	* @return {Number}
	**/
	p.getSpeed = function () { return this.speed; };
	/**
	* The FPS value of the loader animation rendering
	* @property fps
	* @protected
	* @type Number
	**/
	p.fps = 24;
	/**
	* Sets the rendering frequency.<br/>
	* This value tells the loader how many times to refresh and modify the canvas in 1 second.<br/>
	* Using the right combination of the <code>setSpeed</code> and the <code>setFPS</code> methods allows the users to optimize the CPU usage of the loader whilst keeping the animation on a visually pleasing level.
	* @method setFPS
	* @public
	* @param fps {Number} The default value is 24
	**/
	p.setFPS = function (fps) { this.fps = Math.round(Math.abs(fps)); this.reset(); };
	/**
	* Returns the fps of the loader
	* @method getFPS
	* @public
	* @return {Number}
	**/
	p.getFPS = function () { return this.fps; };
// End of Property declarations
/////////////////////////////////////////////////////////////////////////////////////////////	
	/**
	* Return the RGB values of the passed color
	* @method getRGB
	* @protected
	* @param color {String} The HEX color value to be converted to RGB
	*/
	p.getRGB = function (c) {
		c = c.charAt(0) === "#" ? c.substring(1, 7) : c;
		return {r: parseInt(c.substring(0, 2), 16), g: parseInt(c.substring(2, 4), 16), b: parseInt(c.substring(4, 6), 16) };
	};
	/**
	* Draw the shapes on the canvas
	* @method draw
	* @protected
	*/
	p.draw = function () {
		var i = 0, size, w, h, x, y, ang, rads, rad, de = this.density, animBits = Math.round(de * this.range), bitMod, minBitMod = 0, s, g, sh, f, d = 1000, arc = 0, c = this.cCon, di = this.diameter, e = 0.47;
		if (engine === engines[0]) {
			c.clearRect(0, 0, d, d);
			setAttr(this.can, {width: di, height: di});
			setAttr(this.cCan, {width: di, height: di});
			while (i < de) {
				bitMod = i <= animBits ? 1 - ((1 - minBitMod) / animBits * i) : bitMod = minBitMod;
				ang = 270 - 360 / de * i;
				rads = ang / 180 * Math.PI;
				c.fillStyle = "rgba(" + this.cRGB.r + "," + this.cRGB.g + "," + this.cRGB.b + "," + bitMod.toString() + ")";
				switch (this.shape) {
				case shapes[0]:
				case shapes[1]:
					size = di * 0.07;
					x = di * e + Math.cos(rads) * (di * e - size) - di * e;
					y = di * e + Math.sin(rads) * (di * e - size) - di * e;
					c.beginPath();
					if (this.shape === shapes[1]) { c.arc(di * 0.5 + x, di * 0.5 + y, size * bitMod, 0, Math.PI * 2, false); } else { c.arc(di * 0.5 + x, di * 0.5 + y, size, 0, Math.PI * 2, false); }
					break;
				case shapes[2]:
					size = di * 0.12;
					x = Math.cos(rads) * (di * e - size) + di * 0.5;
					y = Math.sin(rads) * (di * e - size) + di * 0.5;
					transCon(c, x, y, rads);
					c.fillRect(x, y - size * 0.5, size, size);
					break;
				case shapes[3]:
				case shapes[4]:
					w = di * 0.3;
					h = w * 0.27;
					x = Math.cos(rads) * (h + (di - h) * 0.13) + di * 0.5;
					y = Math.sin(rads) * (h + (di - h) * 0.13) + di * 0.5;
					transCon(c, x, y, rads);
					if(this.shape === shapes[3]) {
						c.fillRect(x, y - h * 0.5, w, h);
					} else {
						rad = h * 0.55;
						c.moveTo(x + rad, y - h * 0.5);
						c.lineTo(x + w - rad, y - h * 0.5);
						c.quadraticCurveTo(x + w, y - h * 0.5, x + w, y - h * 0.5 + rad);
						c.lineTo(x + w, y - h * 0.5 + h - rad);
						c.quadraticCurveTo(x + w, y - h * 0.5 + h, x + w - rad, y - h * 0.5 + h);
						c.lineTo(x + rad, y - h * 0.5 + h);
						c.quadraticCurveTo(x, y - h * 0.5 + h, x, y - h * 0.5 + h - rad);
						c.lineTo(x, y - h * 0.5 + rad);
						c.quadraticCurveTo(x, y - h * 0.5, x + rad, y - h * 0.5);
					}
					break;
				}
				c.closePath();
				c.fill();
				c.restore();
				++i;
			}
		} else {
			setCSS(this.cont, {width: di, height: di});
			setCSS(this.vml, {width: di, height: di});
			switch (this.shape) {
			case shapes[0]:
			case shapes[1]:
				sh = "oval";
				size = d * 0.14;
				break;
			case shapes[2]:
				sh = "roundrect";
				size = d * 0.12;
				break;
			case shapes[3]:
			case shapes[4]:
				sh = "roundrect";
				size = d * 0.3;
				break;
			}
			w = h = size;
			x = d * 0.5 - h;
			y = -h * 0.5;		
			while (i < de) {
				bitMod = i <= animBits ? 1 - ((1 - minBitMod) / animBits * i) : bitMod = minBitMod;
				ang = 270 - 360 / de * i;
				switch (this.shape) {
				case shapes[1]:
					w = h = size * bitMod;
					x = d * 0.5 - size * 0.5 - size * bitMod * 0.5;
					y = (size - size * bitMod) * 0.5;
					break;
				case shapes[0]:
				case shapes[2]:
					if (ie8) {
						y = 0;
						if(this.shape === shapes[2]) {
							x = d * 0.5 -h * 0.5;
						}
					}
					break;
				case shapes[3]:
				case shapes[4]:
					w = size * 0.95;
					h = w * 0.28;
					if (ie8) {
						x = 0;
						y = d * 0.5 - h * 0.5;
					} else {
						x = d * 0.5 - w;
						y = -h * 0.5;
					}
					arc = this.shape === shapes[4] ? 0.6 : 0; 
					break;
				}
				g = setAttr(setCSS(addEl("group", this.vml), {width: d, height: d, rotation: ang}), {coordsize: d + "," + d, coordorigin: -d * 0.5 + "," + (-d * 0.5)});
				s = setCSS(addEl(sh, g, {stroked: false, arcSize: arc}), { width: w, height: h, top: y, left: x});
				f = addEl("fill", s, {color: this.color, opacity: bitMod});
				++i;
			}
		}
		this.tick(true);
	};
	/**
	* Cleans the canvas
	* @method clean
	* @protected
	*/
	p.clean = function () {
		if (engine === engines[0]) {
			this.con.clearRect(0, 0, 1000, 1000);
		} else {
			var v = this.vml;
			if (v.hasChildNodes()) {
				while (v.childNodes.length >= 1) {
					v.removeChild(v.firstChild);
				}
			}
		}
	};
	/**
	* Redraws the canvas
	* @method redraw
	* @protected
	*/
	p.redraw = function () {
			this.clean();
			this.draw();
	};
	/**
		* Resets the timer
		* @method reset
		* @protected
		*/
		p.reset = function () {
			if (typeof (this.timer) === "number") {
				this.hide();
				this.show();
			}
		};
	/**
	* Renders the loader animation
	* @method tick
	* @protected
	*/
	p.tick = function (init) {
		var c = this.con, di = this.diameter;
		if (!init) { this.activeId += 360 / this.density * this.speed; }
		if (engine === engines[0]) {
			c.clearRect(0, 0, di, di);
			transCon(c, di * 0.5, di * 0.5, this.activeId / 180 * Math.PI);
			c.drawImage(this.cCan, 0, 0, di, di);
			c.restore();
		} else {
			if (this.activeId >= 360) { this.activeId -= 360; }
			setCSS(this.vml, {rotation:this.activeId});
		}
	};
	/**
	* Shows the rendering of the loader animation
	* @method show
	* @public
	*/
	p.show = function () {
		if (typeof (this.timer) !== "number") {
			var t = this;
			this.timer = self.setInterval(function () { t.tick(); }, Math.round(1000 / this.fps));
			setCSS(this.cont, {display: "block"});
		}
	};
	/**
	* Stops the rendering of the loader animation and hides the loader
	* @method hide
	* @public
	*/
	p.hide = function () {
		if (typeof (this.timer) === "number") {
			clearInterval(this.timer);			
			delete this.timer;
			setCSS(this.cont, {display: "none"});
		}
	};
	/**
	* Removes the CanvasLoader instance and all its references
	* @method kill
	* @public
	*/
	p.kill = function () {
		var c = this.cont;
		if (typeof (this.timer) === "number") { this.hide(); }
		if (engine === engines[0]) {
			c.removeChild(this.can);
			c.removeChild(this.cCan);
		} else {
			c.removeChild(this.vml);
		}
		var n;
		for (n in this) { delete this[n]; }
	};
	window.CanvasLoader = CanvasLoader;
}(window));