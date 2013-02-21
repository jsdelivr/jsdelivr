/**
 * Gradient v1.1.0
 * Copyright (C) 2012, William Van Rensselaer
 * http://williamvanr.com/projects/
 *
 * Dual Licensed: MIT or GPL Version 2 license
 */

(function( window ) {

var document = window.document,
	Math = window.Math,
	random = Math.random,
	floor = Math.floor,
	parseInt = window.parseInt,
	parseFloat = window.parseFloat,

	toString = Object.prototype.toString,
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

	// Animation speeds (milliseconds)
	speeds = {
		slow: 600,
		def: 450,
		fast: 300
	},

	// Cached colors and gradient
	colors, gradients = {},

	// Browser-specific gradient type
	// 0: no support
	// 1: linear-gradient( ... )
	// 2: gradient( linear, ... )
	// 3: filter: progid: DXImageTransform.Microsoft.gradient( ... )
	gradientType = 0,

	// Vendor prefix associated with CSS gradient
	prefix = "",

	// Color class
	Color = window.Color = function( color ) {
		// If called as a function
		if ( !( this instanceof Color ) ) {
			return new Color( color );
		}
		this.set( color );
	},

	// Gradient class
	Gradient = window.Gradient = function( grad ) {
		// If called as a function
		if ( !( this instanceof Gradient ) ) {
			return new Gradient( grad );
		}
		this.set( grad );
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
	// Converts the color to a rgb string (ignoring alpha component)
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

// Generates a random color
Color.rand = function() {
	return Color( [floor( random() * 256 ), floor( random() * 256 ), floor( random() * 256 ), 1 - random()] );
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
Color.setSpeed = Gradient.setSpeed = function( name, value ) {
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
			stepTime = ( 1000 / Color.sps ),
			steps = time / stepTime,
			ctx, i, j;
		if ( isArray( from ) && isArray( to ) && from.length === to.length ) {
			for ( i = 0; i < from.length; i++ ) {
				fromArr.push( Color( from[i] ) );
				toArr.push( Color.parse( to[i] ) );
			}
		} else {
			fromArr[0] = Color( from );
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

Gradient.prototype = Gradient.pt = {
	// Sets the gradient
	set: function( grad ) {
		grad = Gradient.parse( grad );
		this.angle = grad[0];
		for ( var i = 1; i < grad.length; i++ ) {
			this[i - 1] = grad[i];
		}
		this.length = i - 1;
		return this;
	},
	// Converts the gradient to its browser-specific string
	toString: function() {
		if ( gradientType ) {
			// linear-gradient( ... )
			if ( gradientType === 1 ) {
				var grad = gradientPrefix + "linear-gradient(" + this.angle + "deg",
					i = 0;
				for ( ; i < this.length; i++ ) {
					grad += "," + this[i][0].toString() + " " + this[i][1] + "%";
				}
				return grad + ")";
			}
			// gradient( linear, ... )
			if ( gradientType === 2 ) {
				var dir = Gradient.angleToDir( this.angle ),
					grad = gradientPrefix + "gradient(linear," + dir.x1 + "% " + dir.y1 + "%," + dir.x2 + "% " + dir.y2 + "%",
					i = 0;
				for ( ; i < this.length; i++ ) {
					grad += ",color-stop(" + this[i][1] + "%," + this[i][0].toString() + ")";
				}
				return grad + ")";
			}
			// IE filter
			return "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + this[0][0].toHex() + "',endColorstr='" +
				this[this.length - 1][0].toHex() + "')";
		}
		return this[0][0].toString();
	}
};

// Returns the gradient type
Gradient.type = function() {
	return gradientType;
};

// Sets or creates a gradient. (Note: If the gradient is already defined, it will be set to the new value)
Gradient.set = function( grad, value ) {
	return gradients[grad] = Gradient.parse( value );
};

// Sets the gradient on the specified DOM element.
Gradient.elem = function( elem, grad ) {
	if ( elem && grad && elem.style ) {
		if ( !( grad instanceof Gradient ) ) {
			grad = Gradient( grad );
		}
		if ( gradientType === 1 || gradientType === 2 ) {
			elem.style.backgroundImage = grad.toString();
		} else if ( gradientType === 3 ) {
			elem.style.filter = grad.toString();
		} else {
			elem.style.backgroundColor = grad.toString();
		}
	}
};

// Animates one or more gradients
Gradient.anim = function( from, to, fn, time, callback ) {
	if ( typeof fn === "function" ) {
		if ( !callback && typeof time === "function" ) {
			callback = time;
		}
		time = time in speeds ? speeds[time] : typeof time === "number" && time > 0 ? time : speeds.def;
		var fromArr = [],
			toArr = [],
			change = [],
			stepTime = ( 1000 / Color.sps ),
			steps = time / stepTime,
			i, j, k, ctx;
		if ( isArray( from ) && isArray( to ) && from.length === to.length ) {
			for ( i = 0; i < from.length; i++ ) {
				fromArr.push( Gradient( from[i] ) );
				toArr.push( Gradient.parse( to[i] ) );
			}
		} else {
			fromArr[0] = Gradient( from );
			toArr[0] = Gradient.parse( to );
		}
		for ( i = 0; i < toArr.length; i++ ) {
			var c = [( toArr[i][0] - fromArr[i].angle ) / steps],
				_to, _from;
			for ( j = 1; j < toArr[i].length; j++ ) {
				_to = toArr[i][j];
				_from = fromArr[i][j - 1];
				c.push([
					[( _to[0].r - _from[0].r ) / steps,
						( _to[0].g - _from[0].g ) / steps ,
						( _to[0].b - _from[0].b ) / steps,
						( _to[0].a - _from[0].a ) / steps],
					( _to[1] - _from[1] ) / steps
				]);
			}
			change.push( c );
		}
		ctx = fromArr.length === 1 ? fromArr[0] : fromArr;
		i = 0;
		(function anim() {
			if ( ++i < steps ) {
				for ( j = 0; j < toArr.length; j++ ) {
					fromArr[j].angle += change[j][0];
					for ( k = 0; k < toArr[j].length - 1; k++ ) {
						fromArr[j][k][0].r += change[j][k + 1][0][0];
						fromArr[j][k][0].g += change[j][k + 1][0][1];
						fromArr[j][k][0].b += change[j][k + 1][0][2];
						fromArr[j][k][0].a += change[j][k + 1][0][3];
						fromArr[j][k][1] += change[j][k + 1][1];
					}
				}
				if ( fn.call( ctx, i, ctx, stepTime * i ) === false ) {
					return typeof callback === "function" ? callback.call( ctx, false, ctx ) : 0;
				}
				return setTimeout( anim, stepTime );
			} else {
				for ( j = 0; j < toArr.length; j++ ) {
					fromArr[j].angle = toArr[j][0];
					for ( k = 0; k < toArr[j].length - 1; k++ ) {
						fromArr[j][k][0].r = toArr[j][k + 1][0].r;
						fromArr[j][k][0].g = toArr[j][k + 1][0].g;
						fromArr[j][k][0].b = toArr[j][k + 1][0].b;
						fromArr[j][k][0].a = toArr[j][k + 1][0].a;
						fromArr[j][k][1] = toArr[j][k + 1][1];
					}
				}
				fn.call( ctx, i, ctx, time );
				return typeof callback === "function" ? callback.call( ctx, false, ctx ) : 0;
			}
		})();
	}
};

// Adds hover and mousedown effects to an element.
Gradient.hoverButton = function( elem, settings ) {
	if ( elem && elem.nodeType ) {
		var props = elem.gradientProps = elem.gradientProps || {};
		if ( settings ) {
			settings.main && Gradient.elem( elem, props.main = Gradient( settings.main ) );
			if ( settings.mouseover ) {
				props.mouseover = Gradient( settings.mouseover );
			}
			if ( settings.mousedown ) {
				props.mousedown = Gradient( settings.mousedown );
			}
			if ( settings.time ) {
				props.time = parseInt( settings.time ) || 0;
			}
		}
	}
};

// Converts an angle (in degrees) to a starting point and ending point percent.
Gradient.angleToDir = function( angle ) {
	if ( typeof angle === "number" ) {
		angle *= 0.017453292519943295; // PI/180 (for conversion to radians)
		var x2 = 50 * Math.cos( angle ) + 50,
			y1 = 50 * Math.sin( angle ) + 50;
		return {
			x1: 100 - x2,
			y1: y1,
			x2: x2,
			y2: 100 - y1
		};
	} else {
		return {
			x1: 50,
			y1: 0,
			x2: 50,
			y2: 100
		}
	}
};

// Converts a direction (i.e. "top left") to an angle
Gradient.dirToAngle = function( dir ) {
	var angle;
	if ( typeof dir === "string" ) {
		if ( dir.indexOf( "deg" ) > 0 ) {
			angle = parseFloat( dir );
		} else {
			switch ( dir ) {
				case "left": return 0;
				case "bottom left": case "left bottom": return 45;
				case "bottom": return 90;
				case "bottom right": case "right bottom": return 135;
				case "right": return 180;
				case "top right": case "right top": return 225;
				case "top left": case "left top": return 315;
				default: return 270;
			}
		}
	} else if ( typeof dir === "number" ) {
		angle = dir % 360;
	}
	return angle || 270;
};

// Parses a gradient string, object, or array, and returns an equivalent gradient array.
Gradient.parse = function( grad ) {
	var gradient = [], i = 1;
	// Gradient object
	if ( grad instanceof Gradient ) {
		gradient.push( grad.angle );
		for ( var i = 0; i < grad.length; i++ ) {
			gradient.push( [Color( grad[i][0] ), grad[i][1]] );
		}
		return gradient;

	// Preset gradient
	} else if ( grad in gradients ) {
		grad = gradients[grad];
		gradient.push( grad[0] );

	// Gradient string
	} else if ( typeof grad === "string" ) {
		grad = grad.split( /\s*,\s*(?![^\(\)]*\))/ );
		gradient.push( Gradient.dirToAngle( grad[0] ) );

	// Could not be determined
	} else {
		gradient.push( 270 );
		grad = [0, "", ""];
	}
	for ( ; i < grad.length; i++ ) {
		if ( isArray( grad[i] ) ) {
			gradient.push( [Color( grad[i][0] ), grad[i][1]] );
		} else {
			if ( /.*%/.test( grad[i] ) ) {
				var stop = grad[i].split( /\s\s*/ ),
					pos = parseFloat( stop[stop.length - 1] );
				stop.splice( stop.length - 1, 1 );
				gradient.push( [Color( stop.join( "" ) ), pos] );
			} else {
				gradient.push( [Color( grad[i] ), Math.round( ( i - 1 ) * 10000 / ( grad.length - 2 ) ) / 100] );
			}
		}
	}
	return gradient;
};

// Test for gradient type
(function() {
	var testEl = document.createElement( "div" ),
		// Vendor prefixes
		prefixes = [ "", "-webkit-", "-moz-", "-o-", "-ms-" ],
		// Structures to test
		main = [
			"linear-gradient(top,#FFF,#000)",
			"gradient(linear,50% 0%,50% 100%,from(#FFF),to(#000))"
		],
		ie = "progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff',endColorstr='#000000')",
		i = 0;
	for ( ; i < prefixes.length; i++ ) {
		try {
			testEl.style.backgroundImage = prefixes[i] + main[0];
			if ( testEl.style.backgroundImage.indexOf( "gradient" ) >= 0 ) {
				gradientPrefix = prefixes[i];
				return gradientType = 1;
			}
			testEl.style.backgroundImage = prefixes[i] + main[1];
			if ( testEl.style.backgroundImage.indexOf( "gradient" ) >= 0 ) {
				gradientPrefix = prefixes[i];
				return gradientType = 2;
			}
		} catch ( e ) { }
	}
	if ( "filter" in testEl.style ) {
		try {
			testEl.style.filter = ie;
		} catch ( e ) { }
		if ( testEl.style.filter.indexOf( "gradient" ) >= 0 ) {
			return gradientType = 3;
		}
	}
})();

// Set hover and mousedown effects
(function() {
	var targ = function( e ) {
			e = e || window.event;
			return e.target || e.srcElement;
		},

		// anim function to reduce redundancy
		_anim = function( elem, from, to, props, anim, callback ) {
			props.animating = anim;
			if ( props.time ) {
				Gradient.anim( from || props.curGrad, to, function( i, grad ) {
					if ( props.animating !== anim ) {
						return false;
					}
					Gradient.elem( elem, props.curGrad = grad );
				}, props.time, callback );
			} else {
				Gradient.elem( elem, to );
			}
		},

		evt = {
			mouseover: function( e ) {
				var target = targ( e ),
					props = target.gradientProps;
				if ( props && props.mouseover ) {
					_anim( target, props.main, props.mouseover, props, 1 );
				}
			},
			mouseout: function( e ) {
				var target = targ( e ),
					props = target.gradientProps;
				if ( props && props.main ) {
					_anim( target, null, props.main, props, 2, function() {
						props.animating = 0;
					});
				}
			},
			mousedown: function( e ) {
				var target = targ( e ),
					props = target.gradientProps;
				if ( props && props.mousedown ) {
					_anim( target, null, props.mousedown, props, 3 );
				}
			},
			mouseup: function( e ) {
				var target = targ( e ),
					props = target.gradientProps;
				if ( props && props.mouseover ) {
					_anim( target, null, props.mouseover, props, 1 );
				}
			}
		},

		i;

	for ( i in evt ) {
		document.addEventListener ? document.addEventListener( i, evt[i], false ) : document.attachEvent( "on" + i, evt[i] );
	}
})();

})( window );