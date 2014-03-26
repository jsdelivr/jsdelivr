YUI.add('gallery-linkedlist', function(Y) {

"use strict";

/**
 * @module gallery-linkedlist
 */

/**********************************************************************
 * Item stored by LinkedList.
 * 
 * @class LinkedListItem
 * @method constructor
 * @private
 * @param value {Mixed} value to store
 */

function LinkedListItem(
	/* object */	value)
{
	this.value = value;
	this._prev = this._next = null;
}

LinkedListItem.prototype =
{
	/**
	 * @method prev
	 * @return {LinkedListItem} previous item or null
	 */
	prev: function()
	{
		return this._prev;
	},

	/**
	 * @method next
	 * @return {LinkedListItem} next item or null
	 */
	next: function()
	{
		return this._next;
	}
};

Y.LinkedListItem = LinkedListItem;
/**
 * @module gallery-linkedlist
 */

/**********************************************************************
 * Iterator for LinkedList.  Stable except when the next item is removed by
 * calling list.remove() instead of iter.removeNext().  When items are
 * inserted into an empty list, the pointer remains at the end, not the
 * beginning.
 *
 * @class LinkedListIterator
 * @method constructor
 * @private
 * @param list {LinkedList}
 */

function LinkedListIterator(
	/* LinkedList */    list)
{
	this._list = list;
	this.moveToBeginning();
}

LinkedListIterator.prototype =
{
	/**
	 * @method atBeginning
	 * @return {Boolean} true if at the beginning
	 */
	atBeginning: function()
	{
		return (!this._next || (!this._at_end && !this._next._prev));
	},

	/**
	 * @method atEnd
	 * @return {Boolean} true if at the end
	 */
	atEnd: function()
	{
		return (!this._next || this._at_end);
	},

	/**
	 * Move to the beginning of the list.
	 * 
	 * @method moveToBeginning
	 */
	moveToBeginning: function()
	{
		this._next   = this._list._head;
		this._at_end = !this._next;
	},

	/**
	 * Move to the end of the list.
	 * 
	 * @method moveToEnd
	 */
	moveToEnd: function()
	{
		this._next   = this._list._tail;
		this._at_end = true;
	},

	/**
	 * @method next
	 * @return {Mixed} next value in the list or undefined if at the end
	 */
	next: function()
	{
		if (this._at_end)
		{
			return;
		}

		var result = this._next;
		if (this._next && this._next._next)
		{
			this._next = this._next._next;
		}
		else
		{
			this._at_end = true;
		}

		if (result)
		{
			return result.value;
		}
	},

	/**
	 * @method prev
	 * @return {Mixed} previous value in the list or undefined if at the beginning
	 */
	prev: function()
	{
		var result;
		if (this._at_end)
		{
			this._at_end = false;
			result       = this._next;
		}
		else if (this._next)
		{
			result = this._next._prev;
			if (result)
			{
				this._next = result;
			}
		}

		if (result)
		{
			return result.value;
		}
	},

	/**
	 * Insert the given value at the iteration position.  The inserted item
	 * will be returned by next().
	 * 
	 * @method insert
	 * @param value {Mixed} value to insert
	 * @return {LinkedListItem} inserted item
	 */
	insert: function(
		/* object */	value)
	{
		if (this._at_end || !this._next)
		{
			this._next = this._list.append(value);
		}
		else
		{
			this._next = this._list.insertBefore(value, this._next);
		}

		return this._next;
	},

	/**
	 * Remove the previous item from the list.
	 * 
	 * @method removePrev
	 * @return {LinkedListItem} removed item or undefined if at the end
	 */
	removePrev: function()
	{
		var result;
		if (this._at_end)
		{
			result = this._next;
			if (this._next)
			{
				this._next = this._next._prev;
			}
		}
		else if (this._next)
		{
			result = this._next._prev;
		}

		if (result)
		{
			this._list.remove(result);
			return result;
		}
	},

	/**
	 * Remove the next item from the list.
	 * 
	 * @method removeNext
	 * @return {LinkedListItem} removed item or undefined if at the end
	 */
	removeNext: function()
	{
		var result;
		if (this._next && !this._at_end)
		{
			result = this._next;
			if (this._next && this._next._next)
			{
				this._next = this._next._next;
			}
			else
			{
				this._next   = this._next ? this._next._prev : null;
				this._at_end = true;
			}
		}

		if (result)
		{
			this._list.remove(result);
			return result;
		}
	}
};
/**
 * @module gallery-linkedlist
 */

/**********************************************************************
 * <p>Doubly linked list for storing items.  Supports iteration via
 * LinkedListIterator (returned by this.iterator()) or Y.each().  Also
 * supports all the other operations defined in gallery-funcprog.</p>
 * 
 * <p>Direct indexing into the list is not supported, as a reminder that it
 * is an expensive operation.  Instead, use find() with a function that
 * checks the index.</p>
 * 
 * @main gallery-linkedlist
 * @class LinkedList
 * @constructor
 * @param [list] {Mixed} any scalar or iterable list
 */

function LinkedList(list)
{
	this._head = this._tail = null;

	if (arguments.length > 1)
	{
		list = Y.Array(arguments);
	}
	else if (!Y.Lang.isUndefined(list) && !(list instanceof LinkedList) && !Y.Array.test(list))
	{
		list = Y.Array(list);
	}

	if (!Y.Lang.isUndefined(list))
	{
		Y.each(list, function(value)
		{
			this.append(value);
		},
		this);
	}
}

function wrap(value)
{
	if (value instanceof LinkedListItem)
	{
		this.remove(value);
	}
	else
	{
		value = new LinkedListItem(value);
	}

	return value;
}

LinkedList.prototype =
{
	/**
	 * @method isEmpty
	 * @return {Boolean} true if the list is empty
	 */
	isEmpty: function()
	{
		return (!this._head && !this._tail);
	},

	/**
	 * Warning:  This requires traversing the list!  Use isEmpty() whenever
	 * possible.
	 *
	 * @method size
	 * @return {Number} the number of items in the list
	 */
	size: function()
	{
		var count = 0,
			item  = this._head;

		while (item)
		{
			count++;
			item = item._next;
		}

		return count;
	},

	/**
	 * @method iterator
	 * @return {LinkedListIterator}
	 */
	iterator: function()
	{
		return new LinkedListIterator(this);
	},

	/**
	 * Creates a new, empty LinkedList.
	 *
	 * @method newInstance
	 * @return {LinkedList}
	 */
	newInstance: function()
	{
		return new LinkedList();
	},

	/**
	 * @method head
	 * @return {LinkedListItem} the first item in the list, or null if the list is empty
	 */
	head: function()
	{
		return this._head;
	},

	/**
	 * @method tail
	 * @return {LinkedListItem} the last item in the list, or null if the list is empty
	 */
	tail: function()
	{
		return this._tail;
	},

	/**
	 * @method indexOf
	 * @param needle {Mixed} the item to search for
	 * @return {Number} first index of the needle, or -1 if not found
	 */
	indexOf: function(needle)
	{
		var iter = this.iterator(), i = 0;
		while (!iter.atEnd())
		{
			if (iter.next() === needle)
			{
				return i;
			}
			i++;
		}

		return -1;
	},

	/**
	 * @method lastIndexOf
	 * @param needle {Mixed} the item to search for
	 * @return {Number} last index of the needle, or -1 if not found
	 */
	lastIndexOf: function(needle)
	{
		var iter = this.iterator(), i = this.size();
		iter.moveToEnd();
		while (!iter.atBeginning())
		{
			i--;
			if (iter.prev() === needle)
			{
				return i;
			}
		}

		return -1;
	},

	/**
	 * Clear the list.
	 * 
	 * @method clear
	 */
	clear: function()
	{
		this._head = this._tail = null;
	},

	/**
	 * @method insertBefore
	 * @param value {Mixed} value to insert
	 * @param item {LinkedListItem} existing item
	 * @return {LinkedListItem} inserted item
	 */
	insertBefore: function(
		/* object */	value,
		/* item */		item)
	{
		value = wrap.call(this, value);

		value._prev = item._prev;
		value._next = item;

		if (item._prev)
		{
			item._prev._next = value;
		}
		else
		{
			this._head = value;
		}
		item._prev = value;

		return value;
	},

	/**
	 * @method insertAfter
	 * @param item {LinkedListItem} existing item
	 * @param value {Mixed} value to insert
	 * @return {LinkedListItem} inserted item
	 */
	insertAfter: function(
		/* item */		item,
		/* object */	value)
	{
		value = wrap.call(this, value);

		value._prev = item;
		value._next = item._next;

		if (item._next)
		{
			item._next._prev = value;
		}
		else
		{
			this._tail = value;
		}
		item._next = value;

		return value;
	},

	/**
	 * @method prepend
	 * @param value {Mixed} value to prepend
	 * @return {LinkedListItem} prepended item
	 */
	prepend: function(
		/* object */	value)
	{
		value = wrap.call(this, value);

		if (this.isEmpty())
		{
			this._head = this._tail = value;
		}
		else
		{
			this.insertBefore(value, this._head);
		}

		return value;
	},

	/**
	 * @method append
	 * @param value {Mixed} value to append
	 * @return {LinkedListItem} appended item
	 */
	append: function(
		/* object */	value)
	{
		value = wrap.call(this, value);

		if (this.isEmpty())
		{
			this._head = this._tail = value;
		}
		else
		{
			this.insertAfter(this._tail, value);
		}

		return value;
	},

	/**
	 * Remove the item from the list.
	 * 
	 * @method remove
	 */
	remove: function(
		/* item */	item)
	{
		if (item._prev)
		{
			item._prev._next = item._next;
		}
		else if (item === this._head)
		{
			this._head = item._next;
			if (item._next)
			{
				item._next._prev = null;
			}
		}

		if (item._next)
		{
			item._next._prev = item._prev;
		}
		else if (item === this._tail)
		{
			this._tail = item._prev;
			if (item._prev)
			{
				item._prev._next = null;
			}
		}

		item._prev = item._next = null;
	},

	/**
	 * Reverses the items in place.
	 * 
	 * @method reverse
	 */
	reverse: function()
	{
		var list = new LinkedList();
		var iter = this.iterator();
		while (!iter.atEnd())
		{
			var item = iter.removeNext();
			list.prepend(item);
		}

		this._head = list._head;
		this._tail = list._tail;
	},

	/**
	 * @method toArray
	 * @return {Array}
	 */
	toArray: function()
	{
		var result = [],
			item   = this._head;

		while (item)
		{
			result.push(item.value);
			item = item._next;
		}

		return result;
	}
};

Y.mix(LinkedList, Y.Iterable, false, null, 4);

	/**
	 * Executes the supplied function on each item in the list.  The
	 * function receives the value, the index, and the list itself as
	 * parameters (in that order).
	 *
	 * @method each
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 */

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

Y.LinkedList = LinkedList;


}, 'gallery-2012.05.23-19-56' ,{requires:['gallery-iterable-extras'], optional:['gallery-funcprog']});
