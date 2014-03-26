YUI.add('gallery-iterable-extras', function(Y) {

"use strict";

/**
 * @module gallery-iterable-extras
 */

/**********************************************************************
 * <p>Functional programming support for iterable classes.  The class must
 * implement the `iterator` and `newInstance` methods.</p>
 * 
 * <p>For most methods, the iterator only needs to implement `next` and
 * `atEnd`.  Backwards iterators like `reduceRight` require `prev` and
 * `atBeginning`.</p>
 * 
 * <p>Iterable classes must mix these functions:  `Y.mix(SomeClass,
 * Y.Iterable, false, null, 4);`  Passing false as the third argument
 * allows your class to provide optimized implementations of individual
 * functions.</p>
 * 
 * @main gallery-iterable-extras
 * @class Iterable
 */

Y.Iterable =
{
	/**
	 * Executes the supplied function on each item in the list.  The
	 * function receives the value, the index, and the list itself as
	 * parameters (in that order).
	 *
	 * @method each
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 */
	each: function(f, c)
	{
		var iter = this.iterator(), i = 0;
		while (!iter.atEnd())
		{
			f.call(c, iter.next(), i, this);
			i++;
		}
	},

	/**
	 * Executes the supplied function on each item in the list.  Iteration
	 * stops if the supplied function does not return a truthy value.  The
	 * function receives the value, the index, and the list itself as
	 * parameters (in that order).
	 *
	 * @method every
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Boolean} true if every item in the array returns true from the supplied function, false otherwise
	 */
	every: function(f, c)
	{
		var iter = this.iterator(), i = 0;
		while (!iter.atEnd())
		{
			if (!f.call(c, iter.next(), i, this))
			{
				return false;
			}
			i++;
		}

		return true;
	},

	/**
	 * Executes the supplied function on each item in the list.  Returns a
	 * new list containing the items for which the supplied function
	 * returned a truthy value.  The function receives the value, the
	 * index, and the object itself as parameters (in that order).
	 *
	 * @method filter
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Object} list of items for which the supplied function returned a truthy value (empty if it never returned a truthy value)
	 */
	filter: function(f, c)
	{
		var result = this.newInstance();

		var iter = this.iterator(), i = 0;
		while (!iter.atEnd())
		{
			var item = iter.next();
			if (f.call(c, item, i, this))
			{
				result.append(item);
			}
			i++;
		}

		return result;
	},

	/**
	 * Executes the supplied function on each item in the list, searching
	 * for the first item that matches the supplied function.  The function
	 * receives the value, the index, and the object itself as parameters
	 * (in that order).
	 *
	 * @method find
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Mixed} the first item for which the supplied function returns true, or null if it never returns true
	 */
	find: function(f, c)
	{
		var iter = this.iterator(), i = 0;
		while (!iter.atEnd())
		{
			var item = iter.next();
			if (f.call(c, item, i, this))
			{
				return item;
			}
			i++;
		}

		return null;
	},

	/**
	 * Executes the supplied function on each item in the list and returns
	 * a new list with the results.  The function receives the value, the
	 * index, and the object itself as parameters (in that order).
	 *
	 * @method map
	 * @param f {String} the function to invoke
	 * @param c {Object} optional context object
	 * @return {Object} list of all return values
	 */
	map: function(f, c)
	{
		var result = this.newInstance();

		var iter = this.iterator(), i = 0;
		while (!iter.atEnd())
		{
			result.append(f.call(c, iter.next(), i, this));
			i++;
		}

		return result;
	},

	/**
	 * Partitions an list into two new list, one with the items for which
	 * the supplied function returns true, and one with the items for which
	 * the function returns false.  The function receives the value, the
	 * index, and the object itself as parameters (in that order).
	 *
	 * @method partition
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Object} object with two properties: matches and rejects. Each is a list containing the items that were selected or rejected by the test function (or an empty object if none).
	 */
	partition: function(f, c)
	{
		var result =
		{
			matches: this.newInstance(),
			rejects: this.newInstance()
		};

		var iter = this.iterator(), i = 0;
		while (!iter.atEnd())
		{
			var item = iter.next();
			result[ f.call(c, item, i, this) ? 'matches' : 'rejects' ].append(item);
			i++;
		}

		return result;
	},

	/**
	 * Executes the supplied function on each item in the list, folding the
	 * list into a single value.  The function receives the value returned
	 * by the previous iteration (or the initial value if this is the first
	 * iteration), the value being iterated, the index, and the list itself
	 * as parameters (in that order).  The function must return the updated
	 * value.
	 *
	 * @method reduce
	 * @param init {Mixed} the initial value
	 * @param f {String} the function to invoke
	 * @param c {Object} optional context object
	 * @return {Mixed} final result from iteratively applying the given function to each item in the list
	 */
	reduce: function(init, f, c)
	{
		var result = init;

		var iter = this.iterator(), i = 0;
		while (!iter.atEnd())
		{
			result = f.call(c, result, iter.next(), i, this);
			i++;
		}

		return result;
	},

	/**
	 * Executes the supplied function on each item in the list, starting
	 * from the end and folding the list into a single value.  The function
	 * receives the value returned by the previous iteration (or the
	 * initial value if this is the first iteration), the value being
	 * iterated, the index, and the list itself as parameters (in that
	 * order).  The function must return the updated value.
	 *
	 * @method reduceRight
	 * @param init {Mixed} the initial value
	 * @param f {String} the function to invoke
	 * @param c {Object} optional context object
	 * @return {Mixed} final result from iteratively applying the given function to each item in the list
	 */
	reduceRight: function(init, f, c)
	{
		var result = init;

		var iter = this.iterator(), i = 0;
		while (!iter.atEnd())
		{
			iter.next();
			i++;
		}

		while (!iter.atBeginning())
		{
			i--;
			result = f.call(c, result, iter.prev(), i, this);
		}

		return result;
	},

	/**
	 * Executes the supplied function on each item in the list.  Returns a
	 * new list containing the items for which the supplied function
	 * returned a falsey value.  The function receives the value, the
	 * index, and the object itself as parameters (in that order).
	 *
	 * @method reject
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Object} array or object of items for which the supplied function returned a falsey value (empty if it never returned a falsey value)
	 */
	reject: function(f, c)
	{
		var result = this.newInstance();

		var iter = this.iterator(), i = 0;
		while (!iter.atEnd())
		{
			var item = iter.next();
			if (!f.call(c, item, i, this))
			{
				result.append(item);
			}
			i++;
		}

		return result;
	},

	/**
	 * Executes the supplied function on each item in the list.  Iteration
	 * stops if the supplied function returns a truthy value.  The function
	 * receives the value, the index, and the list itself as parameters
	 * (in that order).
	 *
	 * @method some
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Boolean} true if the function returns a truthy value on any of the items in the array, false otherwise
	 */
	some: function(f, c)
	{
		var iter = this.iterator(), i = 0;
		while (!iter.atEnd())
		{
			if (f.call(c, iter.next(), i, this))
			{
				return true;
			}
			i++;
		}

		return false;
	}
};
/**
 * @module gallery-iterable-extras
 */

/**********************************************************************
 * Iterator for an array.  Useful for any class that manages an array and
 * wants to mix in `Y.Iterable`.  Safe, but not stable, when the array is
 * modified during iteration.
 *
 * @class ArrayIterator
 * @method constructor
 * @param list {Array}
 */

function ArrayIterator(
	/* array */    list)
{
	this._list = list;
	this.moveToBeginning();
}

ArrayIterator.prototype =
{
	/**
	 * @method atBeginning
	 * @return {Boolean} true if at the beginning
	 */
	atBeginning: function()
	{
		return (this._next <= 0);
	},

	/**
	 * @method atEnd
	 * @return {Boolean} true if at the end
	 */
	atEnd: function()
	{
		return (this._next >= this._list.length);
	},

	/**
	 * Move to the beginning of the list.
	 * 
	 * @method moveToBeginning
	 */
	moveToBeginning: function()
	{
		this._next = 0;
	},

	/**
	 * Move to the end of the list.
	 * 
	 * @method moveToEnd
	 */
	moveToEnd: function()
	{
		this._next = this._list.length;
	},

	/**
	 * @method next
	 * @return {Mixed} next value in the list or undefined if at the end
	 */
	next: function()
	{
		if (this._next < this._list.length)
		{
			return this._list[ this._next++ ];
		}
	},

	/**
	 * @method prev
	 * @return {Mixed} previous value in the list or undefined if at the beginning
	 */
	prev: function()
	{
		if (this._next > 0)
		{
			return this._list[ --this._next ];
		}
	}
};

Y.ArrayIterator = ArrayIterator;


}, 'gallery-2012.05.23-19-56' ,{optional:['gallery-funcprog']});
