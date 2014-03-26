YUI.add('gallery-complexnumber', function(Y) {

"use strict";

/**
 * @module gallery-complexnumber
 */

/**********************************************************************
 * Class for representing a complex number.
 * 
 * @class ComplexNumber
 * @constructor
 * @param real=0 {number} the real component
 * @param imag=0 {number} the imaginary component
 */
function ComplexNumber(real, imag)
{
	this.r = real || 0;
	this.i = imag || 0;
}

/**
 * Construct a ComplexNumber from polar coordinates.
 * 
 * @method fromPolar
 * @static
 * @param magnitude {number}
 * @param phase {number}
 * @return ComplexNumber
 */
ComplexNumber.fromPolar = function(magnitude, phase)
{
	return new ComplexNumber(
		magnitude * Math.cos(phase),
		magnitude * Math.sin(phase));
};

ComplexNumber.prototype =
{
	/**
	 * @method real
	 * @return {number} real component
	 */
	real: function()
	{
		return this.r;
	},

	/**
	 * @method imag
	 * @return {number} imaginary component
	 */
	imag: function()
	{
		return this.i;
	},

	/**
	 * @method magnitude
	 * @return {number} length of the vector in the complex plane
	 */
	magnitude: function()
	{
		return Math.sqrt(this.r*this.r + this.i*this.i);
	},

	/**
	 * @method phase
	 * @return {number} angle of the vector (in radians) in the complex plane relative to the positive real axis
	 */
	phase: function()
	{
		return Math.atan2(this.i, this.r);
	},

	/**
	 * Equivalent of += operator.
	 * 
	 * @method add
	 * @param v {number}
	 * @chainable
	 */
	add: function(v)
	{
		failIfConstant(this);

		if (ComplexMath.isComplexNumber(v))
		{
			this.r += v.r;
			this.i += v.i;
		}
		else
		{
			this.r += v;
		}

		return this;
	},

	/**
	 * Equivalent of -= operator.
	 * 
	 * @method subtract
	 * @param v {number}
	 * @chainable
	 */
	subtract: function(v)
	{
		failIfConstant(this);

		if (ComplexMath.isComplexNumber(v))
		{
			this.r -= v.r;
			this.i -= v.i;
		}
		else
		{
			this.r -= v;
		}

		return this;
	},

	/**
	 * Equivalent of *= operator.
	 * 
	 * @method multiply
	 * @param v {number}
	 * @chainable
	 */
	multiply: function(v)
	{
		failIfConstant(this);

		if (ComplexMath.isComplexNumber(v))
		{
			var r = this.r*v.r - this.i*v.i;
			var i = this.r*v.i + this.i*v.r;

			this.r = r;
			this.i = i;
		}
		else
		{
			this.r *= v;
			this.i *= v;
		}

		return this;
	},

	/**
	 * Equivalent of /= operator.
	 * 
	 * @method divide
	 * @chainable
	 * @param v {number}
	 */
	divide: function(v)
	{
		failIfConstant(this);

		if (ComplexMath.isComplexNumber(v))
		{
			var x  = ComplexMath.divide(this, v);
			this.r = x.r;
			this.i = x.i;
		}
		else
		{
			this.r /= v;
			this.i /= v;
		}

		return this;
	},

	/**
	 * Equivalent of unary minus operator.
	 * 
	 * @method negate
	 * @chainable
	 */
	negate: function()
	{
		failIfConstant(this);

		this.r = - this.r;
		this.i = - this.i;

		return this;
	},

	/**
	 * Negates the imaginary part.
	 * 
	 * @method conjugate
	 * @chainable
	 */
	conjugate: function()
	{
		failIfConstant(this);

		this.i = - this.i;

		return this;
	},

	/**
	 * Rotates the number around the origin by the specified angle in radians.
	 * 
	 * @method rotate
	 * @chainable
	 * @param angle {number}
	 */
	rotate: function(
		/* float */	angle)
	{
		failIfConstant(this);

		this.multiply(ComplexNumber.fromPolar(1, angle));

		return this;
	},

	toString: function()
	{
		function i(v)
		{
			return  v ===  1 ?  'i' :
					v === -1 ? '-i' :
					v + 'i';
		}

		if (this.i === 0)
		{
			return this.r.toString();
		}
		else if (this.r === 0)
		{
			return i(this.i);
		}
		else
		{
			return this.r + (this.i > 0 ? '+' : '') + i(this.i);
		}
	}
};

Y.ComplexNumber = ComplexNumber;
/**********************************************************************
 * Support for complex numbers.
 *
 * @module gallery-complexnumber
 * @main gallery-complexnumber
 */

/**
 * This collection of functions provides the complex number equivalent of
 * the built-in JavaScript Math namespace, along with the basic arithmetic
 * operations (since JavaScript does not support operator overloading).
 * 
 * @class ComplexMath
 */

function failIfConstant(v)
{
	if (v === ComplexMath.ZERO || v === ComplexMath.I)
	{
		throw Error('You cannot modify ZERO or I');
	}
}

var ComplexMath =
{
	/**
	 * Zero.
	 * 
	 * @property ZERO
	 * @type {ComplexNumber}
	 * @static
	 * @final
	 */
	ZERO: new ComplexNumber(),

	/**
	 * Square root of -1.
	 * 
	 * @property I
	 * @type {ComplexNumber}
	 * @static
	 * @final
	 */
	I: new ComplexNumber(0,1),

	/**
	 * @method isComplexNumber
	 * @static
	 * @return {boolean} true if the argument is a ComplexNumber
	 */
	isComplexNumber: function(v)
	{
		return ((v instanceof ComplexNumber) ||
				(v.hasOwnProperty("r") && v.hasOwnProperty("i")));
	},

	/**
	 * @method add
	 * @static
	 * @return {number} sum of all the arguments (either passed separately or as an array)
	 */
	add: function()
	{
		var s = new ComplexNumber();
		Y.Array.each(arguments, function(v)
		{
			if (Y.Lang.isArray(v))
			{
				v = ComplexMath.add.apply(this, v);
			}

			s.add(v);
		});

		return s;
	},

	/**
	 * @method addReciprocals
	 * @static
	 * @return {number} sum of the reciprocals of all the arguments (either passed separately or as an array)
	 */
	addReciprocals: function()
	{
		var s = new ComplexNumber();
		Y.Array.each(arguments, function(v)
		{
			if (Y.Lang.isArray(v))
			{
				s.add(ComplexMath.addReciprocals.apply(this, v));
			}
			else
			{
				s.add(ComplexMath.divide(1,v));
			}
		});

		return s;
	},

	/**
	 * @method parallel
	 * @static
	 * @return {number} net value of N impedances in parallel (either passed separately or as an array)
	 */
	parallel: function()
	{
		return ComplexMath.divide(1, ComplexMath.addReciprocals.apply(this, arguments));
	},

	/**
	 * @method subtract
	 * @static
	 * @param v1 {number}
	 * @param v2 {number}
	 * @return {number} v1-v2
	 */
	subtract: function(v1, v2)
	{
		var c1 = ComplexMath.isComplexNumber(v1),
			c2 = ComplexMath.isComplexNumber(v2);
		if (c1 && c2)
		{
			return new ComplexNumber(v1.r-v2.r, v1.i-v2.i);
		}
		else if (c1)
		{
			return new ComplexNumber(v1.r-v2, v1.i);
		}
		else if (c2)
		{
			return new ComplexNumber(v1-v2.r, -v2.i);
		}
		else
		{
			return new ComplexNumber(v1-v2, 0);
		}
	},

	/**
	 * @method multiply
	 * @static
	 * @return {number} product of all the arguments (either passed separately or as an array)
	 */
	multiply: function()
	{
		var s = new ComplexNumber(1, 0);
		Y.Array.each(arguments, function(v)
		{
			if (Y.Lang.isArray(v))
			{
				v = ComplexMath.multiply.apply(this, v);
			}

			s.multiply(v);
		});

		return s;
	},

	/**
	 * @method divide
	 * @static
	 * @param v1 {number}
	 * @param v2 {number}
	 * @return {number} v1/v2
	 */
	divide: function(v1, v2)
	{
		var c1 = ComplexMath.isComplexNumber(v1),
			c2 = ComplexMath.isComplexNumber(v2);
		if (c1 && c2)
		{
			var d = v2.r*v2.r + v2.i*v2.i;
			return new ComplexNumber(
				(v1.r*v2.r + v1.i*v2.i)/d,
				(v1.i*v2.r - v1.r*v2.i)/d);
		}
		else if (c1)
		{
			return new ComplexNumber(v1.r/v2, v1.i/v2);
		}
		else if (c2)
		{
			var d = v2.r*v2.r + v2.i*v2.i;
			return new ComplexNumber((v1*v2.r)/d, (-v1*v2.i)/d);
		}
		else
		{
			return new ComplexNumber(v1/v2, 0);
		}
	},

	/**
	 * @method negative
	 * @static
	 * @param v {number}
	 * @return {number} negative of the argument
	 */
	negative: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return new ComplexNumber(-v.r, -v.i);
		}
		else
		{
			return new ComplexNumber(-v, 0);
		}
	},

	/**
	 * @method abs
	 * @static
	 * @param v {number}
	 * @return {number} absolute value (magnitude) of the argument
	 */
	abs: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return new ComplexNumber(Math.sqrt(v.r*v.r + v.i*v.i), 0);
		}
		else
		{
			return new ComplexNumber(Math.abs(v), 0);
		}
	},

	/**
	 * @method phase
	 * @static
	 * @param v {number}
	 * @return {number} phase of the argument
	 */
	phase: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return new ComplexNumber(Math.atan2(v.i, v.r), 0);
		}
		else
		{
			return new ComplexNumber();
		}
	},

	/**
	 * @method conjugate
	 * @static
	 * @param v {number}
	 * @return {number} complex conjugate of the argument
	 */
	conjugate: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return new ComplexNumber(v.r, -v.i);
		}
		else
		{
			return new ComplexNumber(v, 0);
		}
	},

	/**
	 * @method rotate
	 * @static
	 * @param v {number}
	 * @param a {number} angle in radians
	 * @return {number} phase of the argument
	 */
	rotate: function(v,a)
	{
		return ComplexMath.multiply(v, ComplexNumber.fromPolar(1, a));
	},

	/**
	 * @method acosh
	 * @static
	 * @param v {number}
	 * @return {number} inverse hyperbolic cosine of the argument
	 */
	acosh: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return ComplexMath.log(
				ComplexMath.add(v,
					ComplexMath.multiply(
						ComplexMath.sqrt(new ComplexNumber(v.r+1, v.i)),
						ComplexMath.sqrt(new ComplexNumber(v.r-1, v.i)))));
		}
		else
		{
			return new ComplexNumber(Math.acosh(v), 0);
		}
	},

	/**
	 * @method asinh
	 * @static
	 * @param v {number}
	 * @return {number} inverse hyperbolic sine of the argument
	 */
	asinh: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			var v1 = ComplexMath.multiply(v,v);
			return ComplexMath.log(
				ComplexMath.add(v,
					ComplexMath.sqrt(new ComplexNumber(v1.r+1, v1.i))));
		}
		else
		{
			return new ComplexNumber(Math.asinh(v), 0);
		}
	},

	/**
	 * @method atanh
	 * @static
	 * @param v {number}
	 * @return {number} inverse hyperbolic tangent of the argument
	 */
	atanh: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			var v1 = ComplexMath.subtract(
				ComplexMath.log(new ComplexNumber(1+v.r,  v.i)),
				ComplexMath.log(new ComplexNumber(1-v.r, -v.i)));
			return new ComplexNumber(v1.r/2, v1.i/2);
		}
		else
		{
			return new ComplexNumber(Math.atanh(v), 0);
		}
	},

	/**
	 * @method cos
	 * @static
	 * @param v {number}
	 * @return {number} cosine of the argument
	 */
	cos: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return new ComplexNumber(
				 Math.cos(v.r)*Math.cosh(v.i),
				-Math.sin(v.r)*Math.sinh(v.i));
		}
		else
		{
			return new ComplexNumber(Math.cos(v), 0);
		}
	},

	/**
	 * @method cosh
	 * @static
	 * @param v {number}
	 * @return {number} hyperbolic cosine of the argument
	 */
	cosh: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			var v1 = ComplexMath.add(
				ComplexMath.exp(v),
				ComplexMath.exp(new ComplexNumber(-v.r, -v.i)));
			return new ComplexNumber(v1.r/2, v1.i/2);
		}
		else
		{
			return new ComplexNumber(Math.cosh(v), 0);
		}
	},

	/**
	 * @method exp
	 * @static
	 * @param v {number}
	 * @return {number} e raised to the argument
	 */
	exp: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			var v1 = new ComplexNumber(Math.cos(v.i), Math.sin(v.i));
			v1.multiply(Math.exp(v.r));
			return v1;
		}
		else
		{
			return new ComplexNumber(Math.exp(v), 0);
		}
	},

	/**
	 * @method log
	 * @static
	 * @param v {number}
	 * @return {number} natural logarithm of the argument
	 */
	log: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return new ComplexNumber(Math.log(v.magnitude()), v.phase());
		}
		else
		{
			return new ComplexNumber(Math.log(v), 0);
		}
	},

	/**
	 * @method pow
	 * @static
	 * @param v {number} value
	 * @param e {number} exponent
	 * @return {number} value raised to the exponent
	 */
	pow: function(v, e)
	{
		var c1 = ComplexMath.isComplexNumber(v);
		if ((c1 && v.r === 0 && v.i === 0) || (!c1 && v === 0))
		{
			var c2 = ComplexMath.isComplexNumber(e);
			if ((c2 && e.r === 0 && e.i === 0) || (!c2 && e === 0))
			{
				return new ComplexNumber(1);	// 0 ^ 0
			}
			else
			{
				return new ComplexNumber();		// 0 ^ x, x != 0
			}
		}
		else
		{
			return ComplexMath.exp(ComplexMath.multiply(ComplexMath.log(v), e));
		}
	},

	/**
	 * @method sin
	 * @static
	 * @param v {number}
	 * @return {number} sine of the argument
	 */
	sin: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return new ComplexNumber(
				Math.sin(v.r)*Math.cosh(v.i),
				Math.cos(v.r)*Math.sinh(v.i));
		}
		else
		{
			return new ComplexNumber(Math.sin(v), 0);
		}
	},

	/**
	 * @method sinh
	 * @static
	 * @param v {number}
	 * @return {number} hyperbolic sine of the argument
	 */
	sinh: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			var v1 = ComplexMath.subtract(
				ComplexMath.exp(v),
				ComplexMath.exp(new ComplexNumber(-v.r, -v.i)));
			return new ComplexNumber(v1.r/2, v1.i/2);
		}
		else
		{
			return new ComplexNumber(Math.sinh(v), 0);
		}
	},

	/**
	 * @method sqrt
	 * @static
	 * @param v {number}
	 * @return {number} square root of the argument
	 */
	sqrt: function(v)
	{
		var c = ComplexMath.isComplexNumber(v);
		return ComplexNumber.fromPolar(
			Math.sqrt(c ? v.magnitude() : Math.abs(v)),
			(c ? v.phase() : v < 0 ? Math.PI : 0) / 2);
	},

	/**
	 * @method tan
	 * @static
	 * @param v {number}
	 * @return {number} tangent of the argument
	 */
	tan: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return ComplexMath.divide(ComplexMath.sin(v), ComplexMath.cos(v));
		}
		else
		{
			return new ComplexNumber(Math.tan(v), 0);
		}
	},

	/**
	 * @method tanh
	 * @static
	 * @param v {number}
	 * @return {number} hyperbolic tangent of the argument
	 */
	tanh: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			var e = ComplexMath.exp(new ComplexNumber(2*v.r, 2*v.i));
			return ComplexMath.divide(
				new ComplexNumber(e.r-1, e.i),
				new ComplexNumber(e.r+1, e.i));
		}
		else
		{
			return new ComplexNumber(Math.tanh(v), 0);
		}
	}
};

Y.ComplexMath = ComplexMath;


}, 'gallery-2012.05.16-20-37' ,{requires:['gallery-math']});
