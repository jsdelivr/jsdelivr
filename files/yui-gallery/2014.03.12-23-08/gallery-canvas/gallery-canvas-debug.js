YUI.add('gallery-canvas', function(Y) {

"use strict";

/**
 * @module gallery-canvas
 */

function mirror(r, s, name)
{
	r[name] = function()
	{
		return s[name].apply(s, arguments);
	};
}

/**********************************************************************
 * <p>Wrapper for a canvas 2d context.  It exposes the exact same api as
 * the native 2d context, plus some extras, documented below.  Just like
 * Y.Node, use get() and set() to modify attributes.</p>
 * 
 * @main gallery-canvas
 * @class Context2d
 * @namespace Canvas
 * @constructor
 * @param node {Y.Node} the canvas element
 * @param config {Object}
 * @param config.pixelAlign=true {Boolean} Pass true to get thinner, cleaner strokes. Pass false to get the default rendering.
 */
function Context2d(node, config)
{
	this.context = node.invoke('getContext', '2d');
	if (!this.context)
	{
		Y.error('Canvas requires a canvas element.');
	}

	config = config || {};
	this.set('pixelAlign', Y.Lang.isUndefined(config.pixelAlign) ? true : config.pixelAlign);

	// expose all context functions on context

	for (var f in this.context)
	{
		if (Y.Lang.isFunction(this.context[f]) && !this[f])
		{
			mirror(this, this.context, f);
		}
	}
}

Context2d.NAME = "canvas2dcontext";

Context2d.prototype =
{
	/**
	 * Get an attribute.  This accepts all attributes of the context and
	 * the special name "pixelAlign".
	 * 
	 * @method get
	 * @param name {String} the attribute name
	 * @return {Mixed} the attribute value
	 */
	get: function(
		/* string */ name)
	{
		if (name == 'pixelAlign')
		{
			return this.pixel_align;
		}
		else
		{
			return this.context[name];
		}
	},

	/**
	 * Set an attribute.  This accepts all attributes of the context and
	 * the special name "pixelAlign".
	 * 
	 * @method set
	 * @param name {String} the attribute name
	 * @param value {Mixed} the attribute value
	 */
	set: function(
		/* string */	name,
		/* mixed */		value)
	{
		if (name == 'pixelAlign')
		{
			this.pixel_align  = value;
			this.pixel_offset = value ? 0.5 : 0;
		}
		else
		{
			this.context[name] = value;
		}
	},

	moveTo: function(x,y)
	{
		this._x = x;
		this._y = y;
		this.context.moveTo(x + this.pixel_offset, y + this.pixel_offset);
	},

	/**
	 * Move relative to the current pen location (set via moveTo or move).
	 * This only works when the transformation matrix is constant!
	 * 
	 * @method move
	 * @param dx {int}
	 * @param dy {int}
	 */
	move: function(dx,dy)
	{
		this.moveTo(this._x + dx, this._y + dy);
	},

	lineTo: function(x,y)
	{
		this._x = x;
		this._y = y;
		this.context.lineTo(x + this.pixel_offset, y + this.pixel_offset);
	},

	/**
	 * Move relative to the current pen location.
	 * This only works when the transformation matrix is constant!
	 * 
	 * @method line
	 * @param dx {int}
	 * @param dy {int}
	 */
	line: function(dx,dy)
	{
		this.lineTo(this._x + dx, this._y + dy);
	},

	arc: function(x,y)
	{
		x += this.pixel_offset;
		y += this.pixel_offset;
		this.context.arc.apply(this.context, arguments);
	},

	arcTo: function(x1,y1, x2,y2, radius)
	{
		this.context.arcTo(x1 + this.pixel_offset, y1 + this.pixel_offset, x2 + this.pixel_offset, y2 + this.pixel_offset, radius);
	},

	bezierCurveTo: function(cp1x,cp1y, cp2x,cp2y, x,y)
	{
		x += this.pixel_offset;
		y += this.pixel_offset;
		this.context.bezierCurveTo.apply(this.context, arguments);
	},

	quadraticCurveTo: function(cp1x,cp1y, x,y)
	{
		x += this.pixel_offset;
		y += this.pixel_offset;
		this.context.quadraticCurveTo.apply(this.context, arguments);
	},

	/**
	 * Define a rectangle with rounded corners.  You must call stroke(),
	 * fill(), etc. afterwards.
	 * 
	 * @method roundedRect
	 * @param top {int}
	 * @param left {int}
	 * @param bottom {int}
	 * @param right {int}
	 * @param radius {int} radius of rounded corners
	 */
	roundedRect: function(top,left,bottom,right,radius)
	{
		this.beginPath();

		var delta = this.pixel_offset;

		this.moveTo(left + radius, top);
		this.lineTo(right - radius, top);

		this.arcTo(right, top, right, bottom, radius);

		this.moveTo(right, top + radius);
		this.lineTo(right, bottom - radius);

		this.arcTo(right, bottom, left, bottom, radius);

		this.moveTo(right - radius, bottom);
		this.lineTo(left + radius, bottom);

		this.arcTo(left, bottom, left, top, radius);

		this.moveTo(left, bottom - radius);
		this.lineTo(left, top + radius);

		this.arcTo(left, top, right, top, radius);
	},

	/**
	 * Draw a polygon from a set of deltas.  
	 * 
	 * @method poly
	 * @param list {Array} List of deltas (dx,dy).  You can omit values that are zero.
	 */
	poly: function(list)
	{
		Y.Array.each(list, function(pt)
		{
			this.line(pt.dx || 0, pt.dy || 0);
		},
		this);
	}
};

Y.namespace('Canvas');
Y.Canvas.Context2d = Context2d;


}, 'gallery-2012.05.16-20-37' ,{requires:['node-base']});
