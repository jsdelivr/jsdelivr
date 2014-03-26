YUI.add('gallery-mathcanvas', function(Y) {

"use strict";

/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Manages all the bounding rectangles for an expression.</p>
 * 
 * <p>Each item contains rect (top,left,bottom,right), midline,
 * font_size(%), func.</p>
 * 
 * @class RectList
 * @namespace MathCanvas
 * @constructor
 */

function RectList()
{
	this.list = [];
}

/**
 * @method width
 * @static
 * @param r {Rect} rectangle
 * @return width
 */
RectList.width = function(r)
{
	return r.right - r.left;
};

/**
 * @method height
 * @static
 * @param r {Rect} rectangle
 * @return height
 */
RectList.height = function(r)
{
	return r.bottom - r.top;
};

/**
 * @method xcenter
 * @static
 * @param r {Rect} rectangle
 * @return horizontal center
 */
RectList.xcenter = function(r)
{
	return Math.floor((r.left + r.right)/2);
};

/**
 * @method ycenter
 * @static
 * @param r {Rect} rectangle
 * @return vertical center
 */
RectList.ycenter = function(r)
{
	return Math.floor((r.top + r.bottom)/2);
};

/**
 * @method area
 * @static
 * @param r {Rect} rectangle
 * @return area
 */
RectList.area = function(r)
{
	return RectList.width(r) * RectList.height(r);
};

/**
 * @method containsPt
 * @static
 * @param r {Rect} rectangle
 * @param xy {point} point
 * @return true if rectangle contains point
 */
RectList.containsPt = function(r, xy)
{
	return (r.left <= xy[0] && xy[0] < r.right &&
			r.top  <= xy[1] && xy[1] < r.bottom);
};

/**
 * @method containsRect
 * @static
 * @param r1 {Rect}
 * @param r2 {Rect}
 * @return true if r1 contains r2
 */
RectList.containsRect = function(r1, r2)
{
	return (r1.left <= r2.left && r2.left <= r2.right && r2.right <= r1.right &&
			r1.top <= r2.top && r2.top <= r2.bottom && r2.bottom <= r1.bottom);
};

/**
 * @method cover
 * @static
 * @param r1 {Rect} rectangle
 * @param r2 {Rect} rectangle
 * @return rectangle convering both input arguments
 */
RectList.cover = function(r1, r2)
{
	var r =
	{
		top:    Math.min(r1.top, r2.top),
		left:   Math.min(r1.left, r2.left),
		bottom: Math.max(r1.bottom, r2.bottom),
		right:  Math.max(r1.right, r2.right)
	};
	return r;
};

RectList.prototype =
{
	/**
	 * @method add
	 * @param r {Rect}
	 * @param midline {int}
	 * @param font_size {int} percentage
	 * @param func {MathFunction}
	 * @return index of inserted item
	 */
	add: function(
		/* rect */			r,
		/* int */			midline,
		/* percentage */	font_size,
		/* MathFunction */	func)
	{
		this.list.push(
		{
			rect:      r,
			midline:   midline,
			font_size: font_size,
			func:      func
		});

		return this.list.length-1;
	},

	/**
	 * @method get
	 * @param index {int}
	 * @return item at index
	 */
	get: function(
		/* int */	index)
	{
		return this.list[ index ];
	},

	/**
	 * @method find
	 * @param f {MathFunction} search target
	 * @return data for specified MathFunction, or null if not found
	 */
	find: function(
		/* MathFunction */	f)
	{
		return Y.Array.find(this.list, function(r)
		{
			return (r.func === f);
		});
	},

	/**
	 * @method findIndex
	 * @param f {MathFunction} search target
	 * @return index of item for specified MathFunction, or -1 if not found
	 */
	findIndex: function(
		/* MathFunction */	f)
	{
		return Y.Array.indexOf(this.list, this.find(f));
	},

	/**
	 * Shift the specified rect and all rects inside it.
	 * 
	 * @method shift
	 * @param index {int}
	 * @param dx {int} horizontal shift
	 * @param dy {int} vertical shift
	 */
	shift: function(
		/* int */	index,
		/* int */	dx,
		/* int */	dy)
	{
		if (dx === 0 && dy === 0)
		{
			return;
		}

		var info = this.list[ index ];
		var orig = Y.clone(info.rect, true);
		info.rect.top    += dy;
		info.rect.left   += dx;
		info.rect.bottom += dy;
		info.rect.right  += dx;
		info.midline     += dy;

		Y.Array.each(this.list, function(info1)
		{
			if (orig.left <= info1.rect.left && info1.rect.right <= orig.right &&
				orig.top <= info1.rect.top && info1.rect.bottom <= orig.bottom)
			{
				info1.rect.top    += dy;
				info1.rect.left   += dx;
				info1.rect.bottom += dy;
				info1.rect.right  += dx;
				info1.midline     += dy;
			}
		});
	},

	/**
	 * Set the midline of the specified rectangle.
	 * 
	 * @method setMidline
	 * @param index {int}
	 * @param y {int} midline
	 */
	setMidline: function(
		/* int */	index,
		/* int */	y)
	{
		this.shift(index, 0, y - this.list[index].midline);
	},

	/**
	 * @method getBounds
	 * @return the bounding rect of all the rects in the list
	 */
	getBounds: function()
	{
		return this.list[ this.list.length-1 ].rect;
	},

	/**
	 * Returns the index of the smallest rectangle that contains both
	 * startPt and currPt.  Returns -1 if there is no such rectangle.  If
	 * startPt is inside the bounding rectangle and currPt is outside, we
	 * return the index of the bounding rectangle.
	 * 	
	 * @method getSelection
	 * @param start_pt {point} point where the drag started
	 * @param curr_pt {point} current cursor location
	 */
	getSelection: function(
		/* point */	start_pt,
		/* point */	curr_pt)
	{
		// Check if start_pt is in the bounding rect.

		var bounds = this.getBounds();
		if (!RectList.containsPt(bounds, start_pt))
		{
			return -1;
		}

		// The bounding rect is the last rect in the list.

		var minArea = 0;
		var result  = this.list.length-1;
		Y.Array.each(this.list, function(info, i)
		{
			var area = RectList.area(info.rect);
			if (RectList.containsPt(info.rect, start_pt) &&
				RectList.containsPt(info.rect, curr_pt) &&
				(minArea === 0 || area < minArea))
			{
				result  = i;
				minArea = area;
			}
		});

		return result;
	},

	/**
	 * Returns the index of the smallest rectangle enclosing the given one.
	 * 
	 * @method getParent
	 * @param index {int}
	 */
	getParent: function(
		/* int */	index)
	{
		var small_rect = this.list[index].rect;
		for (var i=index+1; i<this.list.length; i++)
			{
			var big_rect = this.list[i].rect;
			if (RectList.containsRect(big_rect, small_rect))
				{
				return i;
				}
			}

		// The last element is always the largest, and includes all others.

		return this.list.length-1;
	}
};
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Base class for all functions rendered by MathCanvas.</p>
 * 
 * <p>Derived classes must implement toString() and evaluate().  To override
 * the default rendering which displays the output from toString(), implement
 * prepareToRender() and render().</p>
 * 
 * @class MathFunction
 * @constructor
 */

function MathFunction()
{
	this.parent = null;
}

MathFunction.prototype =
{
	/**
	 * @method getParent
	 * @return {MathFunction} parent function or null
	 */
	getParent: function()
	{
		return this.parent;
	},

	/**
	 * Add the layout information for this object and its descendants to
	 * rect_list.
	 *
	 * @method prepareToRender
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param top_left {point} x,y coordinates of the top left of the bounding box
	 * @param font_size {float} percentage of the base font size
	 * @param rect_list {RectList} layout information
	 * @return {int} index of this items info in rect_list
	 */
	prepareToRender: function(
		/* Context2d */		context,
		/* point */			top_left,
		/* percentage */	font_size,
		/* RectList */		rect_list)
	{
		var s = this.toString();

		var r =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: top_left.y + context.getLineHeight(font_size),
			right:  top_left.x + context.getStringWidth(font_size, s)
		};

		return rect_list.add(r, RectList.ycenter(r), font_size, this);
	},

	/**
	 * Draw this object and its descendants.
	 * 
	 * @method render
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param rect_list {RectList} layout information
	 */
	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		var info = rect_list.find(this);
		context.drawString(info.rect.left, info.midline, info.font_size, this.toString());
	},

	/**
	 * Must be implemented by derived classes.
	 *
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */

	/**
	 * Must be implemented by derived classes.
	 *
	 * @method toString
	 * @return text representation of the function
	 */

	/**
	 * @method parenthesizeForPrint
	 * @protected
	 * @param f {MathFunction}
	 * @return {boolean} true if f needs to parenthesize us
	 */
	parenthesizeForPrint: function(
		/* MathFunction */	f)
	{
		return (this instanceof MathFunctionWithArgs);	// replace with JFunctionData.cpp
	},

	/**
	 * @method parenthesizeForRender
	 * @protected
	 * @param f {MathFunction}
	 * @return {boolean} true if f needs to parenthesize us
	 */
	parenthesizeForRender: function(
		/* MathFunction */	f)
	{
		return (this instanceof MathFunctionWithArgs);	// replace with JFunctionData.cpp
	}
};

// jison utility functions

MathFunction.updateSum = function(
	/* MathFunction */	f1,
	/* MathFunction */	f2)
{
	if (f1 instanceof MathSum)
	{
		f1.appendArg(f2);
		return f1;
	}
	else
	{
		return new MathSum(f1, f2);
	}
};

MathFunction.updateProduct = function(
	/* MathFunction */	f1,
	/* MathFunction */	f2)
{
	if (f1 instanceof MathProduct)
	{
		f1.appendArg(f2);
		return f1;
	}
	else
	{
		return new MathProduct(f1, f2);
	}
};

Y.MathFunction = MathFunction;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Constant value</p>
 * 
 * @namespace MathFunction
 * @class Value
 * @extends MathFunction
 * @constructor
 * @param value {number}
 */

function MathValue(
	/* float */	value)
{
	MathValue.superclass.constructor.call(this);

	var is_string = Y.Lang.isString(value);
	if (is_string &&
		(value.indexOf('.') >= 0 ||
		 (!/x/i.test(value) && /e/i.test(value))))
	{
		this.value = parseFloat(value);
	}
	else if (is_string)
	{
		this.value = parseInt(value);	// do not force base, to allow hex
	}
	else
	{
		this.value = value;
	}
}

Y.extend(MathValue, MathFunction,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function()
	{
		return this.value;
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return this.value;
	}
});

MathFunction.Value = MathValue;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Variable value</p>
 * 
 * @namespace MathFunction
 * @class Variable
 * @extends MathFunction
 * @constructor
 * @param name {String}
 */

function MathVariable(
	/* string */	name)
{
	MathVariable.superclass.constructor.call(this);
	this.name = name;
}

Y.extend(MathVariable, MathFunction,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		var v = var_list[ this.name ];
		if (Y.Lang.isUndefined(v))
		{
			throw new Error("undefined variable: " + this.name);
		}

		return (v instanceof MathFunction ? v.evaluate(var_list) : v);
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return this.name;
	}
});

MathFunction.Variable = MathVariable;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Pi</p>
 * 
 * @namespace MathFunction
 * @class Pi
 * @extends MathFunction
 * @constructor
 */

function MathPi()
{
	MathPi.superclass.constructor.call(this);
}

Y.extend(MathPi, MathFunction,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function()
	{
		return Math.PI;
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return '\u03c0';
	}
});

MathFunction.Pi = MathPi;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>e</p>
 * 
 * @namespace MathFunction
 * @class E
 * @extends MathFunction
 * @constructor
 */

function MathE()
{
	MathE.superclass.constructor.call(this);
}

Y.extend(MathE, MathFunction,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function()
	{
		return Math.E;
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return 'e';
	}
});

MathFunction.E = MathE;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>i (square root of -1)</p>
 * 
 * @namespace MathFunction
 * @class I
 * @extends MathFunction
 * @constructor
 */

function MathI()
{
	MathI.superclass.constructor.call(this);
}

Y.extend(MathI, MathFunction,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function()
	{
		return Y.ComplexMath.I;
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return 'i';
	}
});

MathFunction.I = MathI;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Function that takes one or more arguments.</p>
 * 
 * @namespace MathFunction
 * @class FunctionWithArgs
 * @extends MathFunction
 * @constructor
 * @param name {String} the name of the function
 * @param args {MathFunction|Array} the arguments
 */

function MathFunctionWithArgs(
	/* string */		name,
	/* MathFunction */	args)
{
	MathFunctionWithArgs.superclass.constructor.call(this);
	this.name = name;

	if (Y.Lang.isArray(args) && Y.Lang.isArray(args[0]))
	{
		args = args[0];
	}

	this.args = [];
	if (Y.Lang.isArray(args))
	{
		for (var i=0; i<args.length; i++)
		{
			this.appendArg(args[i]);
		}
	}
	else
	{
		for (var i=1; i<arguments.length; i++)
		{
			this.appendArg(arguments[i]);
		}
	}
}

Y.extend(MathFunctionWithArgs, MathFunction,
{
	/**
	 * @method getArgCount
	 * @return {int} number of arguments
	 */
	getArgCount: function()
	{
		return this.args.length;
	},

	/**
	 * @method getArg
	 * @return {MathFunction} requested argument, or undefined
	 */
	getArg: function(
		/* int */ index)
	{
		return this.args[index];
	},

	/**
	 * @method appendArg
	 * @param f {MathFunction}
	 */
	appendArg: function(
		/* MathFunction */	f)
	{
		f.parent = this;
		this.args.push(f);
	},

	/**
	 * @method removeArg
	 * @param f {MathFunction}
	 */
	removeArg: function(
		/* MathFunction */	f)
	{
		var i = Y.Array.indexOf(this.args, f);
		if (i >= 0)
		{
			f.parent = null;
			this.args.splice(i,1);
		}
	},

	/**
	 * If origArg is an argument, replaces origArg with newArg.
	 * 
	 * @method replaceArg
	 * @param origArg {MathFunction} original argument
	 * @param newArg {MathFunction} new argument
	 */
	replaceArg: function(
		/* MathFunction */	origArg,
		/* MathFunction */	newArg)
	{
		var i = Y.Array.indexOf(this.args, origArg);
		if (i >= 0)
		{
			origArg.parent = null;
			newArg.parent  = this;
			this.args[i]   = newArg;
		}
	},

	/**
	 * @method evaluateArgs
	 * @protected
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return list of argument values, from calling evaluate()
	 */
	evaluateArgs: function(
		/* map */	var_list)
	{
		return Y.Array.map(this.args, function(arg)
		{
			return arg.evaluate(var_list);
		});
	},

	/**
	 * @method prepareToRender
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param top_left {point} x,y coordinates of the top left of the bounding box
	 * @param font_size {float} percentage of the base font size
	 * @param rect_list {RectList} layout information
	 * @return {int} index of this items info in rect_list
	 */
	prepareToRender: function(
		/* Context2d */		context,
		/* point */			top_left,
		/* percentage */	font_size,
		/* RectList */		rect_list)
	{
		var r =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: top_left.y + context.getLineHeight(font_size),
			right:  top_left.x + context.getStringWidth(font_size, this.name)
		};

		var midline = RectList.ycenter(r);

		// get rectangle for each argument

		var orig_midline = midline;

		var arg_top_left = { x: r.right, y: r.top };
		var sep_width    = context.getStringWidth(font_size, ', ');
		var arg_count    = this.args.length;

		var arg_i = [];
		for (var i=0; i<arg_count; i++)
		{
			var j     = this.args[i].prepareToRender(context, arg_top_left, font_size, rect_list);
			var info  = rect_list.get(j);
			var arg_r = info.rect;

			arg_top_left.x = arg_r.right + sep_width;
			r              = RectList.cover(r, arg_r);

			midline = Math.max(midline, info.midline);
			arg_i.push(j);
		}

		// adjust the argument rectangles so all the midlines are the same
		// (our midline is guaranteed to stay constant)

		if (arg_count > 1 && midline > orig_midline)
		{
			for (var i=0; i<arg_count; i++)
			{
				var j = arg_i[i];
				rect_list.setMidline(j, midline);
				r = RectList.cover(r, rect_list.get(j).rect);
			}
		}

		// Now that the midlines are the same, the height of our rectangle is
		// the height of the parentheses.  We have to shift all the arguments
		// to the right to make space for the left parenthesis.  By shifting
		// the rightmost one first, we avoid overlapping anything.

		var paren_w = context.getParenthesisWidth(r);

		for (var i=0; i<arg_count; i++)
		{
			rect_list.shift(arg_i[i], paren_w, 0);
		}

		// make space for 2 parentheses

		r.right += 2 * paren_w;

		return rect_list.add(r, midline, font_size, this);
	},

	/**
	 * @method render
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param rect_list {RectList} layout information
	 */
	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		var info = rect_list.find(this);
		context.drawString(info.rect.left, info.midline, info.font_size, this.name);

		var r  =
		{
			top:    info.rect.top,
			bottom: info.rect.bottom
		};

		for (var i=0; i<this.args.length; i++)
		{
			this.args[i].render(context, rect_list);

			var info  = rect_list.find(this.args[i]);
			var arg_r = info.rect;
			if (i === 0)
			{
				r.left = arg_r.left;
			}

			if (i < this.args.length-1)
			{
				context.drawString(arg_r.right, info.midline, info.font_size, ',');
			}
			else
			{
				r.right = arg_r.right;
				context.drawParentheses(r);
			}
		}
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return this.name + '(' + this.args.join(',') + ')';
	},

	/**
	 * Print an argument, with parentheses if necessary.
	 * 
	 * @method _printArg
	 * @protected
	 * @param index {number|MathFunction} argument index or MathFunction
	 * @return {string} the string representation of the argument
	 */
	_printArg: function(
		/* int */	index)
	{
		var arg = index instanceof MathFunction ? index : this.args[index];
		if (arg.parenthesizeForPrint(this))
		{
			return '(' + arg + ')';
		}
		else
		{
			return arg.toString();
		}
	}
});

MathFunction.FunctionWithArgs = MathFunctionWithArgs;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Negate a number.</p>
 * 
 * @namespace MathFunction
 * @class Negate
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathNegate(
	/* MathFunction */	f)
{
	MathNegate.superclass.constructor.call(this, "-", f);
}

Y.extend(MathNegate, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.subtract(0, this.args[0].evaluate(var_list));
	},

	/**
	 * @method prepareToRender
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param top_left {point} x,y coordinates of the top left of the bounding box
	 * @param font_size {float} percentage of the base font size
	 * @param rect_list {RectList} layout information
	 * @return {int} index of this items info in rect_list
	 */
	prepareToRender: function(
		/* Context2d */		context,
		/* point */			top_left,
		/* percentage */	font_size,
		/* RectList */		rect_list)
	{
		var arg_top_left = Y.clone(top_left, true);
		arg_top_left.x  += context.getStringWidth(font_size, '-');

		var arg = this.args[0];
		if (arg instanceof MathQuotient)
		{
			arg_top_left.x += context.getStringWidth(font_size, ' ');
		}

		var total_rect =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: top_left.y + context.getLineHeight(font_size),
			right:  arg_top_left.x
		};

		var arg_index = arg.prepareToRender(context, arg_top_left, font_size, rect_list);
		var arg_info  = rect_list.get(arg_index);

		if (arg.parenthesizeForRender(this))
		{
			var paren_width = context.getParenthesisWidth(arg_info.rect);
			rect_list.shift(arg_index, paren_width, 0);
			total_rect.right = arg_info.rect.right + paren_width;
		}

		total_rect = RectList.cover(total_rect, arg_info.rect);

		return rect_list.add(total_rect, arg_info.midline, font_size, this);
	},

	/**
	 * @method render
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param rect_list {RectList} layout information
	 */
	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		var info = rect_list.find(this);
		context.drawString(info.rect.left, info.midline, info.font_size, '-');

		var arg = this.args[0];
		arg.render(context, rect_list);

		if (arg.parenthesizeForRender(this))
		{
			var arg_info = rect_list.find(arg);
			context.drawParentheses(arg_info.rect);
		}
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return '-' + this._printArg(0);
	}
});

MathFunction.Negate = MathNegate;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Sum of values.</p>
 * 
 * @namespace MathFunction
 * @class Sum
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 */

function MathSum()
{
	MathMax.superclass.constructor.call(this, "+", new Y.Array(arguments));
}

Y.extend(MathSum, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.add(this.evaluateArgs(var_list));
	},

	/**
	 * @method prepareToRender
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param top_left {point} x,y coordinates of the top left of the bounding box
	 * @param font_size {float} percentage of the base font size
	 * @param rect_list {RectList} layout information
	 * @return {int} index of this items info in rect_list
	 */
	prepareToRender: function(
		/* Context2d */		context,
		/* point */			top_left,
		/* percentage */	font_size,
		/* RectList */		rect_list)
	{
		var arg_top_left = Y.clone(top_left, true);

		var total_rect =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: top_left.y + context.getLineHeight(font_size),
			right:  top_left.x
		};

		var total_midline = RectList.ycenter(total_rect);
		var orig_midline  = total_midline;

		var space_width = context.getStringWidth(font_size, ' ');
		var plus_width  = context.getStringWidth(font_size, '+');
		var minus_width = context.getStringWidth(font_size, '-');

		Y.Array.each(this.args, function(arg, index)
		{
			var f = this;
			if (arg instanceof MathNegate)
			{
				if (index > 0)
				{
					arg_top_left.x += space_width;
				}
				arg_top_left.x += minus_width + space_width;

				f   = arg;
				arg = arg.args[0];
			}
			else if (index > 0)
			{
				arg_top_left.x += plus_width + 2*space_width;
			}

			var arg_index  = arg.prepareToRender(context, arg_top_left, font_size, rect_list);
			var arg_info   = rect_list.get(arg_index);
			arg_top_left.x = arg_info.rect.right;

			if (arg.parenthesizeForRender(f))
			{
				var paren_width = context.getParenthesisWidth(arg_info.rect);
				rect_list.shift(arg_index, paren_width, 0);
				arg_top_left.x  += 2*paren_width;
				total_rect.right = arg_info.rect.right + paren_width;
			}

			total_rect    = RectList.cover(total_rect, arg_info.rect);
			total_midline = Math.max(total_midline, arg_info.midline);
		},
		this);

		// adjust the argument rectangles so all the midlines are the same
		// (ourMidline is guaranteed to stay constant)

		if (this.args.length > 1 && total_midline > orig_midline)
		{
			Y.Array.each(this.args, function(arg)
			{
				if (arg instanceof MathNegate)
				{
					arg = arg.args[0];
				}

				var index = rect_list.findIndex(arg);
				rect_list.setMidline(index, total_midline);
				total_rect = RectList.cover(total_rect, rect_list.get(index).rect);
			});
		}

		return rect_list.add(total_rect, total_midline, font_size, this);
	},

	/**
	 * @method render
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param rect_list {RectList} layout information
	 */
	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		var info        = rect_list.find(this);
		var x           = info.rect.left;
		var space_width = context.getStringWidth(info.font_size, ' ');

		Y.Array.each(this.args, function(arg, index)
		{
			var f = this;
			if (arg instanceof MathNegate)
			{
				context.drawString(x, info.midline, info.font_size, '-');
				f   = arg;
				arg = arg.args[0];
			}
			else if (index > 0)
			{
				context.drawString(x, info.midline, info.font_size, '+');
			}

			arg.render(context, rect_list);

			var arg_info = rect_list.find(arg);
			x            = arg_info.rect.right;

			if (arg.parenthesizeForRender(f))
			{
				context.drawParentheses(arg_info.rect);
				x += context.getParenthesisWidth(arg_info.rect);
			}

			x += space_width;
		},
		this);
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return Y.Array.reduce(this.args, '', function(s, arg, index)
		{
			if (arg instanceof MathNegate)
			{
				s += '-';
				arg = arg.args[0];
			}
			else if (index > 0)
			{
				s += '+';
			}

			return s + this._printArg(arg);
		},
		this);
	}
});

MathFunction.Sum = MathSum;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Product of values.</p>
 * 
 * @namespace MathFunction
 * @class Product
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 */

function MathProduct()
{
	MathMax.superclass.constructor.call(this, "*", new Y.Array(arguments));
}

Y.extend(MathProduct, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.multiply(this.evaluateArgs(var_list));
	},

	/**
	 * @method prepareToRender
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param top_left {point} x,y coordinates of the top left of the bounding box
	 * @param font_size {float} percentage of the base font size
	 * @param rect_list {RectList} layout information
	 * @return {int} index of this items info in rect_list
	 */
	prepareToRender: function(
		/* Context2d */		context,
		/* point */			top_left,
		/* percentage */	font_size,
		/* RectList */		rect_list)
	{
		var arg_top_left = Y.clone(top_left, true);

		var total_rect =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: top_left.y + context.getLineHeight(font_size),
			right:  top_left.x
		};

		var total_midline = RectList.ycenter(total_rect);
		var orig_midline  = total_midline;

		var times_width = context.getStringWidth(font_size, '\u00b7');

		Y.Array.each(this.args, function(arg, index)
		{
			var arg_index  = arg.prepareToRender(context, arg_top_left, font_size, rect_list);
			var arg_info   = rect_list.get(arg_index);
			arg_top_left.x = arg_info.rect.right + times_width;

			if (arg.parenthesizeForRender(this))
			{
				var paren_width = context.getParenthesisWidth(arg_info.rect);
				rect_list.shift(arg_index, paren_width, 0);
				arg_top_left.x  += 2*paren_width;
				total_rect.right = arg_info.rect.right + paren_width;
			}

			total_rect    = RectList.cover(total_rect, arg_info.rect);
			total_midline = Math.max(total_midline, arg_info.midline);
		},
		this);

		// adjust the argument rectangles so all the midlines are the same
		// (ourMidline is guaranteed to stay constant)

		if (this.args.length > 1 && total_midline > orig_midline)
		{
			Y.Array.each(this.args, function(arg)
			{
				var index = rect_list.findIndex(arg);
				rect_list.setMidline(index, total_midline);
				total_rect = RectList.cover(total_rect, rect_list.get(index).rect);
			});
		}

		return rect_list.add(total_rect, total_midline, font_size, this);
	},

	/**
	 * @method render
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param rect_list {RectList} layout information
	 */
	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		var info = rect_list.find(this);
		var x    = info.rect.left;

		var times_width = context.getStringWidth(info.font_size, '\u00b7');

		Y.Array.each(this.args, function(arg, index)
		{
			if (index > 0)
			{
				context.drawString(x, info.midline, info.font_size, '\u00b7');
			}

			arg.render(context, rect_list);

			var arg_info = rect_list.find(arg);
			x            = arg_info.rect.right;

			if (arg.parenthesizeForRender(this))
			{
				context.drawParentheses(arg_info.rect);
				x += context.getParenthesisWidth(arg_info.rect);
			}
		},
		this);
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return Y.Array.reduce(this.args, '', function(s, arg, index)
		{
			if (index > 0)
			{
				s += '*';
			}

			return s + this._printArg(index);
		},
		this);
	}
});

MathFunction.Product = MathProduct;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Quotient of values.</p>
 * 
 * @namespace MathFunction
 * @class Quotient
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param n {MathFunction} numerator
 * @param d {MathFunction} denominator
 */

function MathQuotient(
	/* MathFunction */	n,
	/* MathFunction */	d)
{
	MathQuotient.superclass.constructor.call(this, "/", n, d);
}

Y.extend(MathQuotient, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.divide(this.args[0].evaluate(var_list),
									this.args[1].evaluate(var_list));
	},

	/**
	 * @method prepareToRender
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param top_left {point} x,y coordinates of the top left of the bounding box
	 * @param font_size {float} percentage of the base font size
	 * @param rect_list {RectList} layout information
	 * @return {int} index of this items info in rect_list
	 */
	prepareToRender: function(
		/* Context2d */		context,
		/* point */			top_left,
		/* percentage */	font_size,
		/* RectList */		rect_list)
	{
		var total_rect =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: top_left.y,
			right:  top_left.x
		};

		var space_width = context.getStringWidth(font_size, ' ');

		var arg_top_left = Y.clone(top_left, true);
		arg_top_left.x += space_width;

		// get rectangle for numerator

		var n_arg_index = this.args[0].prepareToRender(context, arg_top_left, font_size, rect_list);
		var n_arg_info  = rect_list.get(n_arg_index);
		arg_top_left.y  = n_arg_info.rect.bottom;
		total_rect      = RectList.cover(total_rect, n_arg_info.rect);

		// create space for division line

		var bar_height    = context.getHorizontalBarHeight();
		var total_midline = arg_top_left.y + bar_height/2;
		arg_top_left.y   += bar_height;

		// get rectangle for denominator

		var d_arg_index = this.args[1].prepareToRender(context, arg_top_left, font_size, rect_list);
		var d_arg_info  = rect_list.get(d_arg_index);
		total_rect      = RectList.cover(total_rect, d_arg_info.rect);

		// align centers of numerator and denominator horizontally
		// (this is guaranteed to leave ourRect constant)

		var dx = (n_arg_info.rect.right - d_arg_info.rect.right)/2;
		if (dx > 0)
		{
			rect_list.shift(d_arg_index, dx, 0);
		}
		else if (dx < 0)
		{
			rect_list.shift(n_arg_index, -dx, 0);
		}

		// add one extra space at the right so division line is wider than arguments

		total_rect.right += space_width;

		return rect_list.add(total_rect, total_midline, font_size, this);
	},

	/**
	 * @method render
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param rect_list {RectList} layout information
	 */
	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		var info = rect_list.find(this);

		var bar_height = context.getHorizontalBarHeight();
		var bar_rect =
		{
			top:    info.midline - bar_height/2,
			left:   info.rect.left,
			bottom: info.midline + bar_height/2,
			right:  info.rect.right
		};

		this.args[0].render(context, rect_list);
		context.drawHorizontalBar(bar_rect);
		this.args[1].render(context, rect_list);
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return this._printArg(0) + '/' + this._printArg(1);
	}
});

MathFunction.Quotient = MathQuotient;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Magnitude (absolute value) of a number.</p>
 * 
 * @namespace MathFunction
 * @class Magnitude
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathMagnitude(
	/* MathFunction */	f)
{
	MathMagnitude.superclass.constructor.call(this, "abs", f);
}

Y.extend(MathMagnitude, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.abs(this.args[0].evaluate(var_list));
	},

	/**
	 * @method prepareToRender
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param top_left {point} x,y coordinates of the top left of the bounding box
	 * @param font_size {float} percentage of the base font size
	 * @param rect_list {RectList} layout information
	 * @return {int} index of this items info in rect_list
	 */
	prepareToRender: function(
		/* Context2d */		context,
		/* point */			top_left,
		/* percentage */	font_size,
		/* RectList */		rect_list)
	{
		var bar_width = context.getVerticalBarWidth();

		var arg       = this.args[0];
		var arg_index = arg.prepareToRender(context, top_left, font_size, rect_list);
		var arg_info  = rect_list.get(arg_index);

		rect_list.shift(arg_index, bar_width, 0);		// make space for leading bar

		var r =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: arg_info.rect.bottom,
			right:  arg_info.rect.right + bar_width
		};

		return rect_list.add(r, arg_info.midline, font_size, this);
	},

	/**
	 * @method render
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param rect_list {RectList} layout information
	 */
	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		var info = rect_list.find(this);
		context.drawVerticalBar(info.rect);

		this.args[0].render(context, rect_list);

		var r  = Y.clone(info.rect, true);
		r.left = r.right - context.getVerticalBarWidth();
		context.drawVerticalBar(r);
	}
});

MathFunction.Magnitude = MathMagnitude;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Phase of a complex number.</p>
 * 
 * @namespace MathFunction
 * @class Phase
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathPhase(
	/* MathFunction */	f)
{
	MathPhase.superclass.constructor.call(this, "phase", f);
}

Y.extend(MathPhase, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.phase(this.args[0].evaluate(var_list));
	}
});

MathFunction.Phase = MathPhase;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Conjugate of a complex number.</p>
 * 
 * @namespace MathFunction
 * @class Conjugate
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathConjugate(
	/* MathFunction */	f)
{
	MathConjugate.superclass.constructor.call(this, "conjugate", f);
}

Y.extend(MathConjugate, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.conjugate(this.args[0].evaluate(var_list));
	},

	/**
	 * @method prepareToRender
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param top_left {point} x,y coordinates of the top left of the bounding box
	 * @param font_size {float} percentage of the base font size
	 * @param rect_list {RectList} layout information
	 * @return {int} index of this items info in rect_list
	 */
	prepareToRender: function(
		/* Context2d */		context,
		/* point */			top_left,
		/* percentage */	font_size,
		/* RectList */		rect_list)
	{
		var bar_height = context.getHorizontalBarHeight();

		var arg_top_left = Y.clone(top_left, true);
		arg_top_left.y  += bar_height;

		var arg_index = this.args[0].prepareToRender(context, arg_top_left, font_size, rect_list);
		var arg_info  = rect_list.get(arg_index);

		var r  = Y.clone(arg_info.rect, true);
		r.top -= bar_height;

		return rect_list.add(r, arg_info.midline, font_size, this);
	},

	/**
	 * @method render
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param rect_list {RectList} layout information
	 */
	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		var info = rect_list.find(this);
		context.drawHorizontalBar(info.rect);
		this.args[0].render(context, rect_list);
	}
});

MathFunction.Conjugate = MathConjugate;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Rotate a complex number around the origin.</p>
 * 
 * @namespace MathFunction
 * @class Rotate
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathRotate(
	/* MathFunction */	f)
{
	MathRotate.superclass.constructor.call(this, "rotate", f);
}

Y.extend(MathRotate, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.rotate(this.args[0].evaluate(var_list),
									this.args[1].evaluate(var_list));
	}
});

MathFunction.Rotate = MathRotate;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Real part of a complex number.</p>
 * 
 * @namespace MathFunction
 * @class RealPart
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathRealPart(
	/* MathFunction */	f)
{
	MathRealPart.superclass.constructor.call(this, "re", f);
}

Y.extend(MathRealPart, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		var value = this.args[0].evaluate(var_list);
		return Y.ComplexMath.isComplexNumber(value) ? value.real() : value;
	}
});

MathFunction.RealPart = MathRealPart;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Imaginary part of a complex number.</p>
 * 
 * @namespace MathFunction
 * @class ImaginaryPart
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathImaginaryPart(
	/* MathFunction */	f)
{
	MathImaginaryPart.superclass.constructor.call(this, "im", f);
}

Y.extend(MathImaginaryPart, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		var value = this.args[0].evaluate(var_list);
		return Y.ComplexMath.isComplexNumber(value) ? value.imag() : 0;
	}
});

MathFunction.ImaginaryPart = MathImaginaryPart;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Minimum.</p>
 * 
 * @namespace MathFunction
 * @class Min
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 */

function MathMin()
{
	MathMin.superclass.constructor.call(this, "min", new Y.Array(arguments));
}

Y.extend(MathMin, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Math.min.apply(null, this.evaluateArgs(var_list));
	}
});

MathFunction.Min = MathMin;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Maximum.</p>
 * 
 * @namespace MathFunction
 * @class Max
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 */

function MathMax()
{
	MathMax.superclass.constructor.call(this, "max", new Y.Array(arguments));
}

Y.extend(MathMax, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Math.max.apply(null, this.evaluateArgs(var_list));
	}
});

MathFunction.Max = MathMax;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Square root.</p>
 * 
 * @namespace MathFunction
 * @class SquareRoot
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathSquareRoot(
	/* MathFunction */	f)
{
	MathSquareRoot.superclass.constructor.call(this, "sqrt", f);
}

Y.extend(MathSquareRoot, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.sqrt(this.args[0].evaluate(var_list));
	},

	/**
	 * @method prepareToRender
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param top_left {point} x,y coordinates of the top left of the bounding box
	 * @param font_size {float} percentage of the base font size
	 * @param rect_list {RectList} layout information
	 * @return {int} index of this items info in rect_list
	 */
	prepareToRender: function(
		/* Context2d */		context,
		/* point */			top_left,
		/* percentage */	font_size,
		/* RectList */		rect_list)
	{
		var arg_index = this.args[0].prepareToRender(context, top_left, font_size, rect_list);
		var arg_info  = rect_list.get(arg_index);
		var arg_h     = RectList.height(arg_info.rect);

		var leading  = 1+Math.round(2.0*arg_h/(4.0*Math.sqrt(3.0)));
		var trailing = 3;
		var extra    = 4;

		rect_list.shift(arg_index, leading, extra);		// make space for square root sign

		var r =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: arg_info.rect.bottom,
			right:  arg_info.rect.right + trailing
		};

		return rect_list.add(r, arg_info.midline, font_size, this);
	},

	/**
	 * @method render
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param rect_list {RectList} layout information
	 */
	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		var info = rect_list.find(this);
		this._drawSquareRoot(context, info.rect);
		this.args[0].render(context, rect_list);
	},

	/**
	 * @method _drawSquareRoot
	 * @private
	 * @param context {Context2d}
	 * @param rect {Object}
	 */
	_drawSquareRoot: function(
		/* Context2d */		context,
		/* rect */			rect)
	{
		var h = RectList.height(rect);
		var x = rect.left;
		var y = rect.top + Math.round(3.0*h/4.0);
		var w = Math.round((h-3)/(4.0*Math.sqrt(3.0)));

		context.beginPath();
		context.moveTo(x,y);
		x += w;
		y  = rect.bottom - 1;
		context.lineTo(x,y);
		x += w;
		y  = rect.top+2;
		context.lineTo(x,y);
		x  = rect.right-1;
		context.lineTo(x,y);
		context.line(0, Math.round(h/8.0));
		context.stroke();
	}
});

MathFunction.SquareRoot = MathSquareRoot;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Exponential.</p>
 * 
 * @namespace MathFunction
 * @class Exponential
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param b {MathFunction} base
 * @param e {MathFunction} exponent
 */

function MathExponential(
	/* MathFunction */	b,
	/* MathFunction */	e)
{
	MathExponential.superclass.constructor.call(this, "^", b, e);
}

Y.extend(MathExponential, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.pow(this.args[0].evaluate(var_list),
								 this.args[1].evaluate(var_list));
	},

	/**
	 * @method prepareToRender
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param top_left {point} x,y coordinates of the top left of the bounding box
	 * @param font_size {float} percentage of the base font size
	 * @param rect_list {RectList} layout information
	 * @return {int} index of this items info in rect_list
	 */
	prepareToRender: function(
		/* Context2d */		context,
		/* point */			top_left,
		/* percentage */	font_size,
		/* RectList */		rect_list)
	{
		var space_width = context.getStringWidth(font_size, ' ');

		var arg_top_left = Y.clone(top_left, true);
		arg_top_left.x += space_width;

		// get rectangle for base

		var b_arg_index = this.args[0].prepareToRender(context, arg_top_left, font_size, rect_list);
		var b_arg_info  = rect_list.get(b_arg_index);
		arg_top_left.x  = b_arg_info.rect.right;

		if (this.args[0].parenthesizeForRender(this))
		{
			var paren_width = context.getParenthesisWidth(b_arg_info.rect);
			rect_list.shift(b_arg_index, paren_width, 0);
			arg_top_left.x += 2*paren_width;
		}

		// get rectangle for exponent

		var e_font_size = context.getSuperSubFontSize(font_size);

		var e_arg_index = this.args[1].prepareToRender(context, arg_top_left, e_font_size, rect_list);
		var e_arg_info  = rect_list.get(e_arg_index);

		// calculate our rectangle

		var total_rect =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: top_left.y + RectList.height(e_arg_info.rect) + context.getSuperscriptHeight(b_arg_info.rect),
			right:  e_arg_info.rect.right
		};

		// shift the base down to the correct position inside ourRect

		if (total_rect.bottom > b_arg_info.rect.bottom)
		{
			rect_list.shift(b_arg_index, 0, total_rect.bottom - b_arg_info.rect.bottom);
		}
		else
		{
			total_rect.bottom = b_arg_info.rect.bottom;
		}

		return rect_list.add(total_rect, b_arg_info.midline, font_size, this);
	},

	/**
	 * @method render
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param rect_list {RectList} layout information
	 */
	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		if (this.args[0].parenthesizeForRender(this))
		{
			var info = rect_list.find(this.args[0]);
			context.drawParentheses(info.rect);
		}

		this.args[0].render(context, rect_list);
		this.args[1].render(context, rect_list);
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return this._printArg(0) + '^' + this._printArg(1);
	}
});

MathFunction.Exponential = MathExponential;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Logarithm.</p>
 * 
 * @namespace MathFunction
 * @class Logarithm
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param b {MathFunction} base
 * @param v {MathFunction} value
 */

function MathLogarithm(
	/* MathFunction */	b,
	/* MathFunction */	v)
{
	MathLogarithm.superclass.constructor.call(this, "log", b, v);
}

Y.extend(MathLogarithm, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.divide(
			Y.ComplexMath.log(this.args[1].evaluate(var_list)),
			Y.ComplexMath.log(this.args[0].evaluate(var_list)));
	},

	/**
	 * @method prepareToRender
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param top_left {point} x,y coordinates of the top left of the bounding box
	 * @param font_size {float} percentage of the base font size
	 * @param rect_list {RectList} layout information
	 * @return {int} index of this items info in rect_list
	 */
	prepareToRender: function(
		/* Context2d */		context,
		/* point */			top_left,
		/* percentage */	font_size,
		/* RectList */		rect_list)
	{
		var total_rect =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: top_left.y + context.getLineHeight(font_size),
			right:  top_left.x + context.getStringWidth(font_size, 'log')
		};

		var arg_top_left =
		{
			x: total_rect.right,
			y: total_rect.top
		};

		// get rectangle for base

		var b_font_size = context.getSuperSubFontSize(font_size);

		var b_arg_index = this.args[0].prepareToRender(context, arg_top_left, b_font_size, rect_list);
		var b_arg_info  = rect_list.get(b_arg_index);
		arg_top_left.x  = b_arg_info.rect.right;

		// get rectangle for value -- gives our midline

		var v_arg_index = this.args[1].prepareToRender(context, arg_top_left, font_size, rect_list);
		var v_arg_info  = rect_list.get(v_arg_index);
		total_rect      = RectList.cover(total_rect, v_arg_info.rect);

		// shift argument to make space for left parenthesis

		var paren_width = context.getParenthesisWidth(v_arg_info.rect);
		rect_list.shift(v_arg_index, paren_width, 0);

		// we need space for two parentheses

		total_rect.right += 2*paren_width;

		// shift the base down

		rect_list.shift(b_arg_index, 0, v_arg_info.midline - total_rect.top);
		total_rect = RectList.cover(total_rect, b_arg_info.rect);

		return rect_list.add(total_rect, v_arg_info.midline, font_size, this);
	},

	/**
	 * @method render
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param rect_list {RectList} layout information
	 */
	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		var info = rect_list.find(this);
		context.drawString(info.rect.left, info.midline, info.font_size, 'log');

		this.args[0].render(context, rect_list);
		this.args[1].render(context, rect_list);

		var v_info = rect_list.find(this.args[1]);
		context.drawParentheses(v_info.rect);
	}
});

MathFunction.Logarithm = MathLogarithm;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Natural logarithm.</p>
 * 
 * @namespace MathFunction
 * @class NaturalLog
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathNaturalLog(
	/* MathFunction */	f)
{
	MathNaturalLog.superclass.constructor.call(this, "ln", f);
}

Y.extend(MathNaturalLog, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.log(this.args[0].evaluate(var_list));
	}
});

MathFunction.NaturalLog = MathNaturalLog;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Trigonometric sine.</p>
 * 
 * @namespace MathFunction
 * @class Sine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathSine(
	/* MathFunction */	f)
{
	MathSine.superclass.constructor.call(this, "sin", f);
}

Y.extend(MathSine, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.sin(this.args[0].evaluate(var_list));
	}
});

MathFunction.Sine = MathSine;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Trigonometric cosine.</p>
 * 
 * @namespace MathFunction
 * @class Cosine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathCosine(
	/* MathFunction */	f)
{
	MathCosine.superclass.constructor.call(this, "cos", f);
}

Y.extend(MathCosine, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.cos(this.args[0].evaluate(var_list));
	}
});

MathFunction.Cosine = MathCosine;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Trigonometric tangent.</p>
 * 
 * @namespace MathFunction
 * @class Tangent
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathTangent(
	/* MathFunction */	f)
{
	MathTangent.superclass.constructor.call(this, "tan", f);
}

Y.extend(MathTangent, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.tan(this.args[0].evaluate(var_list));
	}
});

MathFunction.Tangent = MathTangent;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Inverse trigonometric sine.</p>
 * 
 * @namespace MathFunction
 * @class Arcsine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathArcsine(
	/* MathFunction */	f)
{
	MathArcsine.superclass.constructor.call(this, "arcsin", f);
}

Y.extend(MathArcsine, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Math.asin(this.args[0].evaluate(var_list));
	}
});

MathFunction.Arcsine = MathArcsine;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Inverse trigonometric cosine.</p>
 * 
 * @namespace MathFunction
 * @class Arccosine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathArccosine(
	/* MathFunction */	f)
{
	MathArccosine.superclass.constructor.call(this, "arccos", f);
}

Y.extend(MathArccosine, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Math.acos(this.args[0].evaluate(var_list));
	}
});

MathFunction.Arccosine = MathArccosine;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Inverse trigonometric cosine.</p>
 * 
 * @namespace MathFunction
 * @class Arctangent
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathArctangent(
	/* MathFunction */	f)
{
	MathArctangent.superclass.constructor.call(this, "arctan", f);
}

Y.extend(MathArctangent, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Math.atan(this.args[0].evaluate(var_list));
	}
});

MathFunction.Arctangent = MathArctangent;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Inverse trigonometric cosine.</p>
 * 
 * @namespace MathFunction
 * @class Arctangent2
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param y {MathFunction}
 * @param x {MathFunction}
 */

function MathArctangent2(
	/* MathFunction */	y,
	/* MathFunction */	x)
{
	MathArctangent2.superclass.constructor.call(this, "arctan2", y, x);
}

Y.extend(MathArctangent2, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Math.atan2(this.args[0].evaluate(var_list),
						  this.args[1].evaluate(var_list));
	}
});

MathFunction.Arctangent2 = MathArctangent2;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Hyperbolic cosine.</p>
 * 
 * @namespace MathFunction
 * @class HyperbolicCosine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathHyperbolicCosine(
	/* MathFunction */	f)
{
	MathHyperbolicCosine.superclass.constructor.call(this, "cosh", f);
}

Y.extend(MathHyperbolicCosine, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.cosh(this.args[0].evaluate(var_list));
	}
});

MathFunction.HyperbolicCosine = MathHyperbolicCosine;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Hyperbolic sine.</p>
 * 
 * @namespace MathFunction
 * @class HyperbolicSine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathHyperbolicSine(
	/* MathFunction */	f)
{
	MathHyperbolicSine.superclass.constructor.call(this, "sinh", f);
}

Y.extend(MathHyperbolicSine, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.sinh(this.args[0].evaluate(var_list));
	}
});

MathFunction.HyperbolicSine = MathHyperbolicSine;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Hyperbolic tangent.</p>
 * 
 * @namespace MathFunction
 * @class HyperbolicTangent
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathHyperbolicTangent(
	/* MathFunction */	f)
{
	MathHyperbolicTangent.superclass.constructor.call(this, "tanh", f);
}

Y.extend(MathHyperbolicTangent, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.tanh(this.args[0].evaluate(var_list));
	}
});

MathFunction.HyperbolicTangent = MathHyperbolicTangent;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Inverse hyperbolic cosine.</p>
 * 
 * @namespace MathFunction
 * @class InverseHyperbolicCosine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathInverseHyperbolicCosine(
	/* MathFunction */	f)
{
	MathInverseHyperbolicCosine.superclass.constructor.call(this, "arccosh", f);
}

Y.extend(MathInverseHyperbolicCosine, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.acosh(this.args[0].evaluate(var_list));
	}
});

MathFunction.InverseHyperbolicCosine = MathInverseHyperbolicCosine;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Inverse hyperbolic sine.</p>
 * 
 * @namespace MathFunction
 * @class InverseHyperbolicSine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathInverseHyperbolicSine(
	/* MathFunction */	f)
{
	MathInverseHyperbolicSine.superclass.constructor.call(this, "arcsinh", f);
}

Y.extend(MathInverseHyperbolicSine, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.asinh(this.args[0].evaluate(var_list));
	}
});

MathFunction.InverseHyperbolicSine = MathInverseHyperbolicSine;
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Inverse hyperbolic tangent.</p>
 * 
 * @namespace MathFunction
 * @class InverseHyperbolicTangent
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathInverseHyperbolicTangent(
	/* MathFunction */	f)
{
	MathInverseHyperbolicTangent.superclass.constructor.call(this, "arctanh", f);
}

Y.extend(MathInverseHyperbolicTangent, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.atanh(this.args[0].evaluate(var_list));
	}
});

MathFunction.InverseHyperbolicTangent = MathInverseHyperbolicTangent;
/* Jison generated parser */
var MathParser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expression":3,"e":4,"EOF":5,"NUMBER":6,"E":7,"PI":8,"I":9,"VARIABLE":10,"(":11,")":12,"+":13,"-":14,"*":15,"/":16,"^":17,"ABS":18,"PHASE":19,"CONJUGATE":20,"ROTATE":21,"arglist":22,"RE":23,"IM":24,"MIN":25,"MAX":26,"SQRT":27,"LOG":28,"LOG2":29,"LOG10":30,"LN":31,"ARCSIN":32,"ARCCOS":33,"ARCTAN":34,"ARCTAN2":35,"SIN":36,"COS":37,"TAN":38,"SINH":39,"COSH":40,"TANH":41,"ARCSINH":42,"ARCCOSH":43,"ARCTANH":44,",":45,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"NUMBER",7:"E",8:"PI",9:"I",10:"VARIABLE",11:"(",12:")",13:"+",14:"-",15:"*",16:"/",17:"^",18:"ABS",19:"PHASE",20:"CONJUGATE",21:"ROTATE",23:"RE",24:"IM",25:"MIN",26:"MAX",27:"SQRT",28:"LOG",29:"LOG2",30:"LOG10",31:"LN",32:"ARCSIN",33:"ARCCOS",34:"ARCTAN",35:"ARCTAN2",36:"SIN",37:"COS",38:"TAN",39:"SINH",40:"COSH",41:"TANH",42:"ARCSINH",43:"ARCCOSH",44:"ARCTANH",45:","},
productions_: [0,[3,2],[4,1],[4,1],[4,1],[4,1],[4,1],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,2],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[4,4],[22,1],[22,3]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:return $$[$0-1];
break;
case 2:this.$ = new yy.MathFunction.Value(yytext);
break;
case 3:this.$ = new yy.MathFunction.E();
break;
case 4:this.$ = new yy.MathFunction.Pi();
break;
case 5:this.$ = new yy.MathFunction.I();
break;
case 6:this.$ = new yy.MathFunction.Variable(yytext);
break;
case 7:this.$ = $$[$0-1];
break;
case 8:this.$ = yy.MathFunction.updateSum($$[$0-2], $$[$0]);
break;
case 9:this.$ = yy.MathFunction.updateSum($$[$0-2], new yy.MathFunction.Negate($$[$0]));
break;
case 10:this.$ = yy.MathFunction.updateProduct($$[$0-2], $$[$0]);
break;
case 11:this.$ = new yy.MathFunction.Quotient($$[$0-2], $$[$0]);
break;
case 12:this.$ = new yy.MathFunction.Exponential($$[$0-2], $$[$0]);
break;
case 13:this.$ = new yy.MathFunction.Negate($$[$0]);
break;
case 14:this.$ = new yy.MathFunction.Magnitude($$[$0-1]);
break;
case 15:this.$ = new yy.MathFunction.Phase($$[$0-1]);
break;
case 16:this.$ = new yy.MathFunction.Conjugate($$[$0-1]);
break;
case 17:this.$ = new yy.MathFunction.Rotate($$[$0-1]);
break;
case 18:this.$ = new yy.MathFunction.RealPart($$[$0-1]);
break;
case 19:this.$ = new yy.MathFunction.ImaginaryPart($$[$0-1]);
break;
case 20:this.$ = new yy.MathFunction.Min($$[$0-1]);
break;
case 21:this.$ = new yy.MathFunction.Max($$[$0-1]);
break;
case 22:this.$ = new yy.MathFunction.SquareRoot($$[$0-1]);
break;
case 23:this.$ = new yy.MathFunction.Logarithm($$[$0-1]);
break;
case 24:this.$ = new yy.MathFunction.Logarithm(new yy.MathFunction.Value(2), $$[$0-1]);
break;
case 25:this.$ = new yy.MathFunction.Logarithm(new yy.MathFunction.Value(10), $$[$0-1]);
break;
case 26:this.$ = new yy.MathFunction.NaturalLog($$[$0-1]);
break;
case 27:this.$ = new yy.MathFunction.Arcsine($$[$0-1]);
break;
case 28:this.$ = new yy.MathFunction.Arccosine($$[$0-1]);
break;
case 29:this.$ = new yy.MathFunction.Arctangent($$[$0-1]);
break;
case 30:this.$ = new yy.MathFunction.Arctangent2($$[$0-1]);
break;
case 31:this.$ = new yy.MathFunction.Sine($$[$0-1]);
break;
case 32:this.$ = new yy.MathFunction.Cosine($$[$0-1]);
break;
case 33:this.$ = new yy.MathFunction.Tangent($$[$0-1]);
break;
case 34:this.$ = new yy.MathFunction.HyperbolicSine($$[$0-1]);
break;
case 35:this.$ = new yy.MathFunction.HyperbolicCosine($$[$0-1]);
break;
case 36:this.$ = new yy.MathFunction.HyperbolicTangent($$[$0-1]);
break;
case 37:this.$ = new yy.MathFunction.InverseHyperbolicSine($$[$0-1]);
break;
case 38:this.$ = new yy.MathFunction.InverseHyperbolicCosine($$[$0-1]);
break;
case 39:this.$ = new yy.MathFunction.InverseHyperbolicTangent($$[$0-1]);
break;
case 40:this.$ = [ $$[$0] ];
break;
case 41:this.$ = $$[$0-2].concat($$[$0]);
break;
}
},
table: [{3:1,4:2,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{1:[3]},{5:[1,36],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{5:[2,2],12:[2,2],13:[2,2],14:[2,2],15:[2,2],16:[2,2],17:[2,2],45:[2,2]},{5:[2,3],12:[2,3],13:[2,3],14:[2,3],15:[2,3],16:[2,3],17:[2,3],45:[2,3]},{5:[2,4],12:[2,4],13:[2,4],14:[2,4],15:[2,4],16:[2,4],17:[2,4],45:[2,4]},{5:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[2,5],17:[2,5],45:[2,5]},{5:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[2,6],17:[2,6],45:[2,6]},{4:42,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:43,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{11:[1,44]},{11:[1,45]},{11:[1,46]},{11:[1,47]},{11:[1,48]},{11:[1,49]},{11:[1,50]},{11:[1,51]},{11:[1,52]},{11:[1,53]},{11:[1,54]},{11:[1,55]},{11:[1,56]},{11:[1,57]},{11:[1,58]},{11:[1,59]},{11:[1,60]},{11:[1,61]},{11:[1,62]},{11:[1,63]},{11:[1,64]},{11:[1,65]},{11:[1,66]},{11:[1,67]},{11:[1,68]},{11:[1,69]},{1:[2,1]},{4:70,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:71,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:72,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:73,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:74,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{12:[1,75],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{5:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],17:[2,13],45:[2,13]},{4:76,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:77,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:78,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:80,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],22:79,23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:81,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:82,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:80,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],22:83,23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:80,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],22:84,23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:85,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:80,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],22:86,23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:87,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:88,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:89,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:90,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:91,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:92,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:80,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],22:93,23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:94,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:95,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:96,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:97,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:98,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:99,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:100,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:101,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{4:102,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{5:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[1,39],16:[1,40],17:[1,41],45:[2,8]},{5:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[1,39],16:[1,40],17:[1,41],45:[2,9]},{5:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[2,10],17:[1,41],45:[2,10]},{5:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],17:[1,41],45:[2,11]},{5:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],17:[2,12],45:[2,12]},{5:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[2,7],17:[2,7],45:[2,7]},{12:[1,103],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,104],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,105],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,106],45:[1,107]},{12:[2,40],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41],45:[2,40]},{12:[1,108],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,109],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,110],45:[1,107]},{12:[1,111],45:[1,107]},{12:[1,112],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,113],45:[1,107]},{12:[1,114],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,115],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,116],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,117],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,118],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,119],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,120],45:[1,107]},{12:[1,121],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,122],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,123],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,124],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,125],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,126],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,127],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,128],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{12:[1,129],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41]},{5:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],17:[2,14],45:[2,14]},{5:[2,15],12:[2,15],13:[2,15],14:[2,15],15:[2,15],16:[2,15],17:[2,15],45:[2,15]},{5:[2,16],12:[2,16],13:[2,16],14:[2,16],15:[2,16],16:[2,16],17:[2,16],45:[2,16]},{5:[2,17],12:[2,17],13:[2,17],14:[2,17],15:[2,17],16:[2,17],17:[2,17],45:[2,17]},{4:130,6:[1,3],7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],14:[1,9],18:[1,10],19:[1,11],20:[1,12],21:[1,13],23:[1,14],24:[1,15],25:[1,16],26:[1,17],27:[1,18],28:[1,19],29:[1,20],30:[1,21],31:[1,22],32:[1,23],33:[1,24],34:[1,25],35:[1,26],36:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,31],41:[1,32],42:[1,33],43:[1,34],44:[1,35]},{5:[2,18],12:[2,18],13:[2,18],14:[2,18],15:[2,18],16:[2,18],17:[2,18],45:[2,18]},{5:[2,19],12:[2,19],13:[2,19],14:[2,19],15:[2,19],16:[2,19],17:[2,19],45:[2,19]},{5:[2,20],12:[2,20],13:[2,20],14:[2,20],15:[2,20],16:[2,20],17:[2,20],45:[2,20]},{5:[2,21],12:[2,21],13:[2,21],14:[2,21],15:[2,21],16:[2,21],17:[2,21],45:[2,21]},{5:[2,22],12:[2,22],13:[2,22],14:[2,22],15:[2,22],16:[2,22],17:[2,22],45:[2,22]},{5:[2,23],12:[2,23],13:[2,23],14:[2,23],15:[2,23],16:[2,23],17:[2,23],45:[2,23]},{5:[2,24],12:[2,24],13:[2,24],14:[2,24],15:[2,24],16:[2,24],17:[2,24],45:[2,24]},{5:[2,25],12:[2,25],13:[2,25],14:[2,25],15:[2,25],16:[2,25],17:[2,25],45:[2,25]},{5:[2,26],12:[2,26],13:[2,26],14:[2,26],15:[2,26],16:[2,26],17:[2,26],45:[2,26]},{5:[2,27],12:[2,27],13:[2,27],14:[2,27],15:[2,27],16:[2,27],17:[2,27],45:[2,27]},{5:[2,28],12:[2,28],13:[2,28],14:[2,28],15:[2,28],16:[2,28],17:[2,28],45:[2,28]},{5:[2,29],12:[2,29],13:[2,29],14:[2,29],15:[2,29],16:[2,29],17:[2,29],45:[2,29]},{5:[2,30],12:[2,30],13:[2,30],14:[2,30],15:[2,30],16:[2,30],17:[2,30],45:[2,30]},{5:[2,31],12:[2,31],13:[2,31],14:[2,31],15:[2,31],16:[2,31],17:[2,31],45:[2,31]},{5:[2,32],12:[2,32],13:[2,32],14:[2,32],15:[2,32],16:[2,32],17:[2,32],45:[2,32]},{5:[2,33],12:[2,33],13:[2,33],14:[2,33],15:[2,33],16:[2,33],17:[2,33],45:[2,33]},{5:[2,34],12:[2,34],13:[2,34],14:[2,34],15:[2,34],16:[2,34],17:[2,34],45:[2,34]},{5:[2,35],12:[2,35],13:[2,35],14:[2,35],15:[2,35],16:[2,35],17:[2,35],45:[2,35]},{5:[2,36],12:[2,36],13:[2,36],14:[2,36],15:[2,36],16:[2,36],17:[2,36],45:[2,36]},{5:[2,37],12:[2,37],13:[2,37],14:[2,37],15:[2,37],16:[2,37],17:[2,37],45:[2,37]},{5:[2,38],12:[2,38],13:[2,38],14:[2,38],15:[2,38],16:[2,38],17:[2,38],45:[2,38]},{5:[2,39],12:[2,39],13:[2,39],14:[2,39],15:[2,39],16:[2,39],17:[2,39],45:[2,39]},{12:[2,41],13:[1,37],14:[1,38],15:[1,39],16:[1,40],17:[1,41],45:[2,41]}],
defaultActions: {36:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ');
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:return 6;	/* hex */
break;
case 1:return 6;	/* integer w/ exponent */
break;
case 2:return 6;	/* decimal w/ exponent */
break;
case 3:return 6;	/* decimal w/ exponent */
break;
case 4:return 6;	/* decimal integer */
break;
case 5:return 6;	/* zero */
break;
case 6:return 8;
break;
case 7:return 8;
break;
case 8:return 7;
break;
case 9:return 9;
break;
case 10:return 15;
break;
case 11:return 16;
break;
case 12:return 14;
break;
case 13:return 13;
break;
case 14:return 17;
break;
case 15:return 11;
break;
case 16:return 12;
break;
case 17:return 45;
break;
case 18:return 23;
break;
case 19:return 24;
break;
case 20:return 18;
break;
case 21:return 19;
break;
case 22:return 20;
break;
case 23:return 21;
break;
case 24:return 26;
break;
case 25:return 25;
break;
case 26:return 27;
break;
case 27:return 28;
break;
case 28:return 29;
break;
case 29:return 30;
break;
case 30:return 31;
break;
case 31:return 32;
break;
case 32:return 33;
break;
case 33:return 34;
break;
case 34:return 35;
break;
case 35:return 36;
break;
case 36:return 37;
break;
case 37:return 38;
break;
case 38:return 39;
break;
case 39:return 40;
break;
case 40:return 41;
break;
case 41:return 42;
break;
case 42:return 43;
break;
case 43:return 44;
break;
case 44:return 10;
break;
case 45:/* skip whitespace */
break;
case 46:return 5;
break;
}
};
lexer.rules = [/^0[xX][0-9a-fA-F]+/,/^[0-9]+[eE][-+]?[0-9]+/,/^[0-9]+\.([0-9]+)?([eE][-+]?[0-9]+)?/,/^([0-9]+)?\.[0-9]+([eE][-+]?[0-9]+)?/,/^[1-9][0-9]*/,/^0\b/,/^pi\b/,/^\u03c0/,/^e\b/,/^i\b/,/^\*/,/^\//,/^-/,/^\+/,/^\^/,/^\(/,/^\)/,/^,/,/^re\b/,/^im\b/,/^abs\b/,/^phase\b/,/^conjugate\b/,/^rotate\b/,/^max\b/,/^min\b/,/^sqrt\b/,/^log\b/,/^log2\b/,/^log10\b/,/^ln\b/,/^arcsin\b/,/^arccos\b/,/^arctan\b/,/^arctan2\b/,/^sin\b/,/^cos\b/,/^tan\b/,/^sinh\b/,/^cosh\b/,/^tanh\b/,/^arcsinh\b/,/^arccosh\b/,/^arctanh\b/,/^[^-*/+^(),\s0-9][^-*/+^(),\s]*/,/^\s+/,/^$/];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = MathParser;
exports.parse = function () { return MathParser.parse.apply(MathParser, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}
/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * Displays an arithmetical expression the way you would write it on paper.
 * 
 * @main gallery-mathcanvas
 * @class MathCanvas
 * @extends Widget
 * @constructor
 * @param config {Object} Widget configuration
 */
function MathCanvas(
	/* object */	config)
{
	MathCanvas.superclass.constructor.call(this, config);
}

MathCanvas.NAME = "MathCanvas";

MathCanvas.ATTRS =
{
	/**
	 * The function to display.
	 * 
	 * @attribute func
	 * @type {Y.MathFunction|String}
	 */
	func:
	{
		value: new Y.MathFunction.Value(0),
		setter: function(value)
		{
			return Y.Lang.isString(value) ?
				Y.MathCanvas.Parser.parse(value) : value;
		}
	},

	/**
	 * The font name to use.
	 * 
	 * @attribute fontName
	 * @type {String}
	 */
	fontName:
	{
		value:     'sans-serif',
		validator: Y.Lang.isString
	},

	/**
	 * The font size to use, in em's.
	 * 
	 * @attribute fontSize
	 * @type {number}
	 */
	fontSize:
	{
		value:     1,
		validator: Y.Lang.isNumber
	},

	/**
	 * The minimum width of the canvas.  If the expression is wider, the
	 * width will increase to fit.
	 * 
	 * @attribute minWidth
	 * @type {Integer}
	 */
	minWidth:
	{
		value:     100,
		validator: Y.Lang.isNumber
	},

	/**
	 * The minimum height of the canvas.  If the expression is taller, the
	 * height will increase to fit.
	 * 
	 * @attribute minHeight
	 * @type {Integer}
	 */
	minHeight:
	{
		value:     100,
		validator: Y.Lang.isNumber
	}
};

function setSize(
	/* width/height */	type)
{
	var c = type.charAt(0).toUpperCase() + type.substr(1);
	var v = Math.max(this.get('min'+c), this[ 'render_'+type ]+5);
	this.set(type, v+'px');
	this.canvas.setAttribute(type, v);
}

Y.extend(MathCanvas, Y.Widget,
{
	initializer: function(config)
	{
		this.after('funcChange', function()
		{
			this.selection = -1;
			this._renderExpression();
		});
		this.after('fontNameChange', this._renderExpression);
		this.after('fontSizeChange', this._renderExpression);
		this.after('minWidthChange', this._renderExpression);
		this.after('minHeightChange', this._renderExpression);

		// http://www.thegalaxytabforum.com/index.php?/topic/621-detecting-android-tablets-with-javascript

		var agent    = navigator.userAgent.toLowerCase();
		var platform = navigator.platform;
		// We need to eliminate Symbian, Series 60, Windows Mobile and Blackberry
		// browsers for this quick and dirty check. This can be done with the user agent.
		var otherBrowser = agent.indexOf("series60")   != -1 ||
						   agent.indexOf("symbian")    != -1 ||
						   agent.indexOf("windows ce") != -1 ||
						   agent.indexOf("blackberry") != -1;
		// If the screen orientation is defined we are in a modern mobile OS
		var mobileOS = typeof orientation != 'undefined';
		// If touch events are defined we are in a modern touch screen OS
		var touchOS = 'ontouchstart' in document.documentElement;
		// iPhone and iPad can be reliably identified with the navigator.platform
		// string, which is currently only available on these devices.
		var iOS = platform.indexOf("iPhone") != -1 || platform.indexOf("iPad") != -1;
		// If the user agent string contains "android" then it's Android. If it
		// doesn't but it's not another browser, not an iOS device and we're in
		// a mobile and touch OS then we can be 99% certain that it's Android.
		var android = agent.indexOf("android") != -1 || (!iOS && !otherBrowser && touchOS && mobileOS);

		 // navigator.platform doesn't work for iPhoney
		this.touch = touchOS || agent.indexOf("iphone") != -1;
	},

	renderUI: function()
	{
		var container = this.get('contentBox');

		var w = this.get('minWidth');
		this.set('width', w+'px');

		var h = this.get('minHeight');
		this.set('height', w+'px');

		this.canvas = Y.Node.create(
			'<canvas width="' + w + '" height="' + h + '" tabindex="0"></canvas>');
		if (!this.canvas)
		{
			throw Error("This browser does not support canvas rendering.");
		}

		container.appendChild(this.canvas);

		this.context = new Y.Canvas.Context2d(this.canvas);
		Y.mix(this.context, math_rendering);
		this.context.math_canvas = this;

		this._renderExpression();

		// input (for mobile)

		function buttonRow(list)
		{
			var s = Y.Array.reduce(list, '', function(s, obj)
			{
				return s + Y.Lang.sub('<button type="button" class="keyboard-{value}" value="{value}">{label}</button>',
				{
					value: obj.value || obj,
					label: obj.label || obj
				});
			});

			return '<p>' + s + '</p>';
		}

		if (this.touch || YUI.config.debug_mathcanvas_keyboard)
		{
			this.keyboard = Y.Node.create(
				'<div class="keyboard">' +
					buttonRow([1,2,3,4,5,6,7,8,9,0]) +
					buttonRow(['+', {value:'-',label:'&ndash;'}, {value:'*',label:'&times;'}, '/', '^', '|', ',', 'e', '\u03c0', '.']) +
					'<p class="last">' +
						'<button type="button" class="keyboard-hide" value="hide" title="Hide keyboard">&dArr;</button>' +
						'<button type="button" class="keyboard-eval" value="=" title="Evaluate expression">=</button>' +
						'<button type="button" class="keyboard-delete" value="delete" title="Delete selection">&empty;</button>' +
						'<button type="button" class="keyboard-expand" value="expand" title="Expand selection">&hArr;</button>' +
						'<select class="keyboard-func">' +
							'<option>Functions</option>' +
							'<optgroup>' +
								'<option>abs</option>' +
								'<option>arccos</option>' +
								'<option>arcsin</option>' +
								'<option>arctan</option>' +
								'<option>arctan2</option>' +
								'<option>conjugate</option>' +
								'<option>cos</option>' +
								'<option>cosh</option>' +
								'<option>sinh</option>' +
								'<option>tanh</option>' +
								'<option>imag</option>' +
								'<option>arccosh</option>' +
								'<option>arcsinh</option>' +
								'<option>arctanh</option>' +
								'<option>log</option>' +
								'<option>max</option>' +
								'<option>min</option>' +
								'<option>ln</option>' +
								'<option>phase</option>' +
								'<option>real</option>' +
								'<option>rotate</option>' +
								'<option>sin</option>' +
								'<option>sqrt</option>' +
								'<option>tan</option>' +
							'</optgroup>' +
						'</select>' +
						'<br>' +
						'<select class="keyboard-const">' +
							'<option>Constants</option>' +
							'<optgroup>' +
								'<option>c</option>' +
								'<option>g</option>' +
							'</optgroup>' +
						'</select>' +
					'</p>' +
				'</div>'
			);
			container.appendChild(this.keyboard);

			this.keyboard.setStyle('bottom', (-this.keyboard.get('offsetHeight'))+'px');
		}
	},

	bindUI: function()
	{
		this.canvas.on('mousedown', function(e)
		{
			function select(e)
			{
				var xy = this.canvas.getXY();
				var pt =
				[
					Math.round(e.pageX - xy[0]) - offset[0],
					Math.round(e.pageY - xy[1]) - offset[1]
				];

				this.selection = this.rect_list.getSelection(anchor, pt);
				this._renderExpression();
			}

			var bounds = this.rect_list.getBounds();
			var offset =
			[
				Math.floor((this.canvas.getAttribute('width') - RectList.width(bounds)) / 2),
				Math.floor((this.canvas.getAttribute('height') - RectList.height(bounds)) / 2)
			];

			var xy = this.canvas.getXY();
			var anchor =
			[
				Math.round(e.pageX - xy[0]) - offset[0],
				Math.round(e.pageY - xy[1]) - offset[1]
			];

			select.call(this, e);
			var handler = this.canvas.on('mousemove', select, this);

			Y.one(Y.config.doc).once('mouseup', function(e)
			{
				handler.detach();
				if (this.selection >= 0)
				{
					this.showKeyboard();
				}
				else
				{
					this.hideKeyboard();
				}
			},
			this);
		},
		this);

		this.canvas.on('keydown', function(e)
		{
//			console.log(e.charCode);

			if (e.charCode == 32)
			{
				this.expandSelection();
			}
			else if (e.charCode == 8)
			{
				this.deleteSelection();
			}
		},
		this);

		if (this.keyboard)
		{
			this.keyboard.delegate('click', function(e)
			{
				var op = e.currentTarget.get('value');
				if (op == 'hide')
				{
					this.hideKeyboard();
				}
				else if (op == 'expand')
				{
					this.expandSelection();
				}
				else if (op == 'delete')
				{
					this.deleteSelection();
				}
				else if (op == '=')
				{
					this.fire('evaluate');
					this.hideKeyboard();
				}
			},
			'button', this);

			this.keyboard.one('.keyboard-func').on('change', function(e)
			{
				this.set('selectedIndex', 0);
			});

			this.keyboard.one('.keyboard-const').on('change', function(e)
			{
				this.set('selectedIndex', 0);
			});
		}
	},

	destructor: function()
	{
		this.canvas  = null;
		this.context = null;
	},

	/**
	 * Shows touch keyboard.
	 * 
	 * @method showKeyboard
	 */
	showKeyboard: function()
	{
		if (!this.keyboard)
		{
			return;
		}

		if (this.keyboard_anim)
		{
			this.keyboard_anim.stop();
		}

		this.keyboard_anim = new Y.Anim(
		{
			node: this.keyboard,
			to:
			{
				bottom: 0
			},
			duration: 0.5
		});

		this.keyboard_anim.run();
	},

	/**
	 * Hides touch keyboard.
	 * 
	 * @method hideKeyboard
	 */
	hideKeyboard: function()
	{
		if (!this.keyboard)
		{
			return;
		}

		if (this.keyboard_anim)
		{
			this.keyboard_anim.stop();
		}

		this.keyboard_anim = new Y.Anim(
		{
			node: this.keyboard,
			to:
			{
				bottom: -this.keyboard.get('offsetHeight')
			},
			duration: 0.5
		});

		this.keyboard_anim.run();
	},

	/**
	 * Expands the selection up one level of the parse tree.
	 * 
	 * @method expandSelection
	 */
	expandSelection: function()
	{
		if (this.selection >= 0)
		{
			var p = this.rect_list.get(this.selection).func.getParent();
			if (p)
			{
				this.selection = this.rect_list.findIndex(p);
				this._renderExpression();
			}
		}
	},

	/**
	 * Deletes the selected sub-expression.
	 * 
	 * @method deleteSelection
	 */
	deleteSelection: function()
	{
		if (this.selection >= 0)
		{
			this.deleteFunction(this.rect_list.get(this.selection).func);
		}
	},

	/**
	 * @method deleteFunction
	 * @param f {MathFunction} function to remove from the overall expression
	 */
	deleteFunction: function(
		/* MathFunction */ f)
	{
		var p = f.getParent();
		var s = p;
		if (!p)
		{
			this.selection = 0;
			this.set('func', '0');
			return;
		}
		else if (p.getArgCount() == 1)
		{
			this.deleteFunction(p);
			return;
		}
		else if (p.getArgCount() == 2)
		{
			var s  = (p.getArg(0) == f ? p.getArg(1) : p.getArg(0));
			var p1 = p.getParent();
			if (p1)
			{
				p1.replaceArg(p, s);
			}
			else
			{
				this.selection = -1;
				s.parent       = null;
				this.set('func', s);
			}
		}
		else
		{
			p.removeArg(f);
		}

		this.selection = -1;
		this._renderExpression();	// update rect_list
		this.selection = this.rect_list.findIndex(s);
		this._renderExpression();
	},

	/**
	 * Renders the expression.
	 * 
	 * @method _renderExpression
	 * @protected
	 */
	_renderExpression: function()
	{
		this.context.clearRect(0,0,
			this.canvas.getAttribute('width'),
			this.canvas.getAttribute('height'));

		var f = this.get('func');
		if (!f)
		{
			return;
		}

		this.rect_list = new RectList();

		var top_left = { x:0, y:0 };
		f.prepareToRender(this.context, top_left, 100, this.rect_list);

		var bounds = this.rect_list.getBounds();

		this.render_width  = RectList.width(bounds);
		setSize.call(this, 'width');

		this.render_height = RectList.height(bounds);
		setSize.call(this, 'height');

		this.context.save();
		this.context.translate(
			Math.floor((this.canvas.getAttribute('width') - RectList.width(bounds)) / 2),
			Math.floor((this.canvas.getAttribute('height') - RectList.height(bounds)) / 2));

		if (this.selection >= 0)
		{
			var r = this.rect_list.get(this.selection).rect;
			this.context.save();
			this.context.set('fillStyle', '#99FFFF');
			this.context.fillRect(r.left, r.top, RectList.width(r), RectList.height(r));
			this.context.restore();
		}

		f.render(this.context, this.rect_list);

		this.context.restore();
	}
});

var paren_angle = Math.PI/6;	// 30 degrees

var math_rendering =
{
	drawString: function(
		/* int */			left,
		/* int */			midline,
		/* percentage */	font_size,
		/* string */		s)
	{
		var h = this.getLineHeight(font_size);
		this._setFont(font_size);
		this.set('textBaseline', 'top');
		this.fillText(s, left, Math.floor(midline - h/2));
	},

	getLineHeight: function(
		/* percentage */	font_size)
	{
		return (13 * this.math_canvas.get('fontSize') * font_size/100.0);
	},

	getStringWidth: function(
		/* percentage */	font_size,
		/* string */		text)
	{
		this.save();
		this._setFont(font_size);
		var w = this.measureText(text).width;
		this.restore();
		return w;
	},

	_setFont: function(
		/* percentage */	font_size)
	{
		this.set('font',
			(this.math_canvas.get('fontSize') * font_size/100.0) + 'em ' +
			 this.math_canvas.get('fontName'));
	},

	getSuperSubFontSize: function(
		/* percentage */	font_size)
	{
		var v = font_size * 0.6;
		return Math.max(v, 40);
	},

	getSuperscriptHeight: function(
		/* rect */	r)
	{
		return RectList.height(r)/2;
	},

	getSubscriptDepth: function(
		/* rect */	r)
	{
		return RectList.height(r)/2;
	},

	drawSquareBrackets: function(
		/* rect */	r)
	{
		var h = r.bottom - r.top;
		var w = this.getSquareBracketWidth(r)-2;

		this.moveTo(r.left-2, r.top);
		this.line(-w,0);
		this.line(0,h-1);
		this.line(w,0);
		this.stroke();

		this.moveTo(r.right+1, r.top);
		this.line(w,0);
		this.line(0,h-1);
		this.line(-w,0);
		this.stroke();
	},

	getSquareBracketWidth: function(
		/* rect */	r)
	{
		var h = r.bottom - r.top;
		return Math.round(3+((h-1)/10));
	},

	drawParentheses: function(
		/* rect */	r)
	{
		var h       = r.bottom - r.top;
		var radius  = h/(2.0*Math.sin(paren_angle));
		var radius1 = Math.round(radius);
		var yc      = RectList.ycenter(r);
		var pw      = this.getParenthesisWidth(r);

		this.beginPath();
		this.arc(r.left - pw + radius, yc, radius1, Math.PI-paren_angle, Math.PI+paren_angle, false);
		this.stroke();

		this.beginPath();
		this.arc(r.right + pw - radius, yc, radius1, paren_angle, -paren_angle, true);
		this.stroke();
	},

	getParenthesisWidth: function(
		/* rect */	r)
	{
		var h = r.bottom - r.top;
		return 2+Math.round(0.5 + (h * (1.0 - Math.cos(paren_angle)))/(2.0 * Math.sin(paren_angle)));
	},

	drawVerticalBar: function(
		/* rect */	r)
	{
		this.moveTo(r.left+1, r.top);
		this.lineTo(r.left+1, r.bottom);
		this.stroke();
	},

	getVerticalBarWidth: function()
	{
		return 3;
	},

	drawHorizontalBar: function(
		/* rect */	r)
	{
		var y = r.top+1;
		this.moveTo(r.left, y);
		this.lineTo(r.right-1, y);
		this.stroke();
	},

	getHorizontalBarHeight: function()
	{
		return 3;
	}
};

MathParser.yy.MathFunction = Y.MathFunction;

Y.MathCanvas          = MathCanvas;
Y.MathCanvas.RectList = RectList;
Y.MathCanvas.Parser   = MathParser;

/**********************************************************************
 * Parser used to convert a string expression into Y.MathFunction
 * 
 * @class Parser
 * @namespace MathCanvas
 */

/**
 * Parses a string into a Y.MathFunction.
 * 
 * @method parse
 * @static
 * @param expr {String} expression to parse
 * @return {MathFunction}
 */


}, 'gallery-2012.05.16-20-37' ,{skinnable:true, requires:['widget','collection','node-screen','gallery-complexnumber','gallery-canvas','gallery-node-optimizations','anim-base','array-extras']});
