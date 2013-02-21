 /**
 * Color v1.0.2
 * Copyright (C) 2012, William Van Rensselaer
 * http://williamvanr.com/projects/
 *
 * Dual Licensed: MIT or GPL Version 2 license
 */

(function( window ) {

var document = window.document,
	Math = window.Math,
	toString = Object.prototype.toString,

	parseInt = window.parseInt,
	parseFloat = window.parseFloat,
	isNaN = window.isNaN,

	random = Math.random,
	floor = Math.floor,

	// Checks if the argument is an array
	isArray = Array.isArray || function( arg ) {
		return toString.call( arg ) === "[object Array]";
	},

	// Check if the browser has rgba support
	rgbaSupport = (function() {
		var testDiv = document.createElement( "div" );
		try {
			testDiv.style.backgroundColor = "rgba(0,0,0,0.5)";
		} catch ( e ) { }
		return /rgba/.test( testDiv.style.backgroundColor )
	})(),

	// Saved colors and gradient
	colors,

	// Animation speeds (milliseconds)
	speeds = {
		slow: 600,
		def: 450,
		fast: 300
	},

	// Gets the current style of an element
	getStyle = window.getComputedStyle ? function( elem, prop ) {
		if ( prop === "borderColor" ) {
			// border color can have multiple values
			prop = "borderTopColor";
		}
		return document.defaultView.getComputedStyle( elem, null ).getPropertyValue( prop.replace( /([A-Z]|^ms)/g, "-$1" ).toLowerCase() );
	} : function( elem, prop ) {
		return elem.currentStyle[prop];
	},

	// Color class
	Color = window.Color = function( color ) {
		// If called as a function
		if ( !( this instanceof Color ) ) {
			return new Color( color );
		}
		this.set( color );
	};

Color.prototype = Color.pt = {
	// Sets the color to a new color or sets a specific part of the color
	set: function( color ) {
		color = Color.parse( color );
		this.r = color[0];
		this.g = color[1];
		this.b = color[2];
		this.a = typeof color[3] === "number" ? color[3] : 1;
		return this;
	},
	// Converts the color to a hexadecimal string
	toHex: function() {
		var range = Color.rgbRange,
			r = range( this.r ).toString( 16 ),
			g = range( this.g ).toString( 16 ),
			b = range( this.b ).toString( 16 );
		return "#" + ( r.length === 1 ? "0" + r : r ) + ( g.length === 1 ? "0" + g : g ) + ( b.length === 1 ? "0" + b : b );
	},
	// Converts the color to a rgb string (ignoring alpha setting)
	toRGB: function() {
		var range = Color.rgbRange;
		return "rgb(" + range( this.r ) + "," + range( this.g ) + "," + range( this.b ) + ")";
	},
	// Converts the color to a rgb/rgba string. (Defaults to rgba unless the browser does not support it)
	toString: function() {
		var range = Color.rgbRange,
			rgb = range( this.r ) + "," + range( this.g ) + "," + range( this.b );
		return rgbaSupport ? "rgba(" + rgb + "," + Color.alphaRange( this.a ) + ")" : "rgb(" + rgb + ")";
	},
	equals: function( o ) {
		return o instanceof Color && o.r === this.r && o.g === this.g && o.b === this.b && o.a === this.a;
	}
};

// Steps-per-second (for animations)
Color.sps = 40;

// Animates color-based css properties of an element
Color.animElem = function( elem, props, time, callback ) {
	if ( elem.style && typeof props === "object" ) {
		var cdata = elem.color_data;
		if ( cdata ) {
			if ( cdata.anim ) {
				return cdata.queue.push( function() {
					Color.animElem( elem, props, time, callback );
				});
			}
		} else {
			cdata = elem.color_data = {
				queue: []
			};
		}
		cdata.anim = true;
		var from = [],
			to = [],
			i, j = 0;
		for ( i in props ) {
			if ( i in elem.style ) {
				from.push( getStyle( elem, i ) );
				to.push( props[i] );
				props[j++] = i;
			}
		}
		this.anim( from, to, function() {
			if ( isArray( this ) ) {
				for ( i = 0; i < this.length; i++ ) {
					elem.style[props[i]] = this[i].toString();
				}
			} else {
				elem.style[props[0]] = this.toString();
			}
		}, time, function() {
			cdata.anim = false;
			if ( typeof callback === "function" ) {
				return callback();
			}
			if ( cdata.queue.length ) {
				return cdata.queue.shift()();
			}
		});
	}
};

// Animates one or more colors to another color or set of the corresponding amount of colors
Color.anim = function( from, to, fn, time, callback ) {
	if ( typeof fn === "function" ) {
		if ( !callback && typeof time === "function" ) {
			callback = time;
		}
		time = time in speeds ? speeds[time] : typeof time === "number" && time > 0 ? time : speeds.def;
		var fromArr = [],
			toArr = [],
			change = [],
			steps = time / ( 1000 / Color.sps ),
			stepTime = time / steps,
			ctx, i, j;
		if ( isArray( from ) && isArray( to ) && from.length === to.length ) {
			for ( i = 0; i < from.length; i++ ) {
				fromArr.push( new Color( from[i] ) );
				toArr.push( Color.parse( to[i] ) );
			}
		} else {
			fromArr[0] = new Color( from );
			toArr[0] = Color.parse( to );
		}
		for ( i = 0; i < fromArr.length; i++ ) {
			change.push([
				( toArr[i][0] - fromArr[i].r ) / steps,
				( toArr[i][1] - fromArr[i].g ) / steps,
				( toArr[i][2] - fromArr[i].b ) / steps,
				( toArr[i][3] - fromArr[i].a ) / steps
			]);
		}
		ctx = fromArr.length === 1 ? fromArr[0] : fromArr;
		i = 0;
		console.log( "from:", from, "to:", to, "fromArr:", fromArr, "toArr:", toArr );
		(function anim() {
			if ( ++i < steps ) {
				for ( j = 0; j < fromArr.length; j++ ) {
					fromArr[j].r += change[j][0];
					fromArr[j].g += change[j][1];
					fromArr[j].b += change[j][2];
					fromArr[j].a += change[j][3];
				}
				if ( fn.call( ctx, i, ctx, stepTime * i ) === false ) {
					return typeof callback === "function" ? callback.call( ctx, false, ctx ) : 0;
				}
				return setTimeout( anim, stepTime );
			} else {
				for ( j = 0; j < fromArr.length; j++ ) {
					fromArr[j].r = toArr[j][0];
					fromArr[j].g = toArr[j][1];
					fromArr[j].b = toArr[j][2];
					fromArr[j].a = toArr[j][3];
				}
				fn.call( ctx, i, ctx, time );
				return typeof callback === "function" ? callback.call( ctx, true, ctx ) : 0;
			}
		})();
	}
};

// Generates a random color
Color.rand = function() {
	return new Color( [floor( random() * 256 ), floor( random() * 256 ), floor( random() * 256 ), 1 - random()] );
};

// Makes sure a value is between 0 and 255
Color.rgbRange = function( num ) {
	if ( typeof num === "number" ) {
		return num < 0 ? 0 : ( num > 255 ? 255 : Math.round( num ) );
	}
	return 255;
};

// Makes sure a value is between 0.0 and 1.0
Color.alphaRange = function( num ) {
	if ( typeof num === "number" ) {
		return num < 0 ? 0 : ( num > 1 ? 1 : num );
	}
	return 1;
};

// Sets or creates a color. (Note: If the color is already defined, it will be set to the new value)
Color.set = function( color, value ) {
	return colors[color] = Color.parse( value );
};

// Sets or creates an animation speed.
Color.setSpeed = function( name, value ) {
	if ( typeof value === "number" ) {
		return speeds[name] = value;
	}
	return false;
};

// Parses a Color object, predefined color, rgb/rgba array, or color string
Color.parse = function( color ) {
	var result;

		// Color instance
	return color instanceof Color ? [color.r, color.g, color.b, color.a] :

		// Predefined color
		color in colors ? colors[color] :

		// RGB/RGBA array
		isArray( color ) && color.length > 2 ? color :

		// 6 byte hex (#FFFFFF)
		( result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec( color ) ) ?
			[parseInt( result[1], 16 ), parseInt( result[2], 16 ), parseInt( result[3], 16 ), 1] :

		// 3 byte hex (#FFF)
		( result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec( color ) ) ?
			[parseInt( result[1] + result[1], 16 ), parseInt( result[2] + result[2], 16 ), parseInt( result[3] + result[3], 16 ), 1] :

		// rgb( r, g, b )
		( result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec( color ) ) ?
			[parseInt( result[1] ), parseInt( result[2] ), parseInt( result[3] ), 1] :

		// rgba( r, g, b, a )
		( result = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*(0?(\.[0-9]*)?|1(\.0?)?)\s*\)/.exec( color ) ) ?
			[parseInt( result[1] ), parseInt( result[2] ), parseInt( result[3] ), parseFloat( result[4] )] :

		// Color could not be determined
		[0, 0, 0, 0];
};

// Preset colors
colors = {
	aqua:           [   0, 255, 255, 1 ],
	azure:          [ 240, 255, 255, 1 ],
	beige:          [ 245, 245, 220, 1 ],
	black:          [   0,   0,   0, 1 ],
	blue:           [   0,   0, 255, 1 ],
	brown:          [ 165,  42,  42, 1 ],
	cyan:           [   0, 255, 255, 1 ],
	darkblue:       [   0,   0, 139, 1 ],
	darkcyan:       [   0, 139, 139, 1 ],
	darkgrey:       [ 169, 169, 169, 1 ],
	darkgreen:      [   0, 100,   0, 1 ],
	darkkhaki:      [ 189, 183, 107, 1 ],
	darkmagenta:    [ 139,   0, 139, 1 ],
	darkolivegreen: [  85, 107,  47, 1 ],
	darkorange:     [ 255, 140,   0, 1 ],
	darkorchid:     [ 153,  50, 204, 1 ],
	darkred:        [ 139,   0,   0, 1 ],
	darksalmon:     [ 233, 150, 122, 1 ],
	darkviolet:     [ 148,   0, 211, 1 ],
	fuchsia:        [ 255,   0, 255, 1 ],
	gold:           [ 255, 215,   0, 1 ],
	green:          [   0, 128,   0, 1 ],
	indigo:         [  75,   0, 130, 1 ],
	khaki:          [ 240, 230, 140, 1 ],
	lightblue:      [ 173, 216, 230, 1 ],
	lightcyan:      [ 224, 255, 255, 1 ],
	lightgreen:     [ 144, 238, 144, 1 ],
	lightgrey:      [ 211, 211, 211, 1 ],
	lightpink:      [ 255, 182, 193, 1 ],
	lightyellow:    [ 255, 255, 224, 1 ],
	lime:           [   0, 255,   0, 1 ],
	magenta:        [ 255,   0, 255, 1 ],
	maroon:         [ 128,   0,   0, 1 ],
	navy:           [   0,   0, 128, 1 ],
	olive:          [ 128, 128,   0, 1 ],
	orange:         [ 255, 165,   0, 1 ],
	pink:           [ 255, 192, 203, 1 ],
	purple:         [ 128,   0, 128, 1 ],
	red:            [ 255,   0,   0, 1 ],
	silver:         [ 192, 192, 192, 1 ],
	violet:         [ 128,   0, 128, 1 ],
	white:          [ 255, 255, 255, 1 ],
	yellow:         [ 255, 255,   0, 1 ]
};

})( window );