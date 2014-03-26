YUI.add('gallery-nodelist-extras2', function(Y) {

"use strict";

/**
 * @module gallery-nodelist-extras2
 */

/**
 * <p>Augments Y.NodeList with the same higher-order functions that
 * array-extras adds to Y.Array.</p>
 * 
 * @main gallery-nodelist-extras2
 * @class NodeList~extras2
 */

Y.mix(Y.NodeList.prototype,
{
	/**
	 * Executes the supplied function on each Node in the NodeList.
	 * Iteration stops if the supplied function does not return a truthy
	 * value.  The function receives the Node, the index, and the NodeList
	 * itself as parameters (in that order).
	 *
	 * @method every
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Boolean} true if every item in the array returns true from the supplied function, false otherwise
	 */
	every: function(f, c)
	{
		return Y.Array.every(this._nodes, function(node, index)
		{
			node = Y.one(node);
			return f.call(c || node, node, index, this);
		},
		this);
	},

	/**
	 * Executes the supplied function on each Node in the NodeList,
	 * searching for the first Node that matches the supplied function.
	 * The function receives the Node, the index, and the NodeList itself
	 * as parameters (in that order).
	 *
	 * @method find
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Node} the first Node for which the supplied function returns true, or null if it never returns true
	 */
	find: function(f, c)
	{
		var n = Y.Array.find(this._nodes, function(node, index)
		{
			node = Y.one(node);
			return f.call(c || node, node, index, this);
		},
		this);

		return Y.one(n);
	},

	/**
	 * Executes the supplied function on each Node in the NodeList and
	 * returns a new array with the results.  The function receives the
	 * Node, the index, and the NodeList itself as parameters (in that order).
	 *
	 * @method map
	 * @param f {String} the function to invoke
	 * @param c {Object} optional context object
	 * @return {Array} all return values, mapped according to the item key
	 */
	map: function(f, c)
	{
		return Y.Array.map(this._nodes, function(node, index)
		{
			node = Y.one(node);
			return f.call(c || node, node, index, this);
		},
		this);
	},

	/**
	 * Partitions the NodeList into two new NodeLists, one with the items
	 * for which the supplied function returns true, and one with the
	 * items for which the function returns false.  The function receives
	 * the Node, the index, and the NodeList itself as parameters (in that
	 * order).
	 *
	 * @method partition
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Object} object with two properties: matches and rejects. Each is a NodeList containing the items that were selected or rejected by the test function (or an empty object if none).
	 */
	partition: function(f, c)
	{
		var result =
		{
			matches: new Y.NodeList(),
			rejects: new Y.NodeList()
		};

		Y.Array.each(this._nodes, function(node, index)
		{
			node    = Y.one(node);
			var set = f.call(c || node, node, index, this) ? result.matches : result.rejects;
			set.push(node);
		},
		this);

		return result;
	},

	/**
	 * Executes the supplied function on each Node in the NodeList, folding
	 * the NodeList into a single value.  The function receives the value
	 * returned by the previous iteration (or the initial value if this is
	 * the first iteration), the Node being iterated, the index, and the
	 * NodeList itself as parameters (in that order).  The function must
	 * return the updated value.
	 *
	 * @method reduce
	 * @param init {Mixed} the initial value
	 * @param f {String} the function to invoke
	 * @param c {Object} optional context object
	 * @return {Mixed} final result from iteratively applying the given function to each Node in the NodeList
	 */
	reduce: function(init, f, c)
	{
		return Y.Array.reduce(this._nodes, init, function(acc, node, index)
		{
			node = Y.one(node);
			return f.call(c || node, acc, node, index, this);
		},
		this);
	},

	/**
	 * Executes the supplied function on each Node in the NodeList,
	 * starting at the end and folding the NodeList into a single value.
	 * The function receives the value returned by the previous iteration
	 * (or the initial value if this is the first iteration), the Node
	 * being iterated, the index, and the NodeList itself as parameters (in
	 * that order).  The function must return the updated value.
	 *
	 * @method reduceRight
	 * @param init {Mixed} the initial value
	 * @param f {String} the function to invoke
	 * @param c {Object} optional context object
	 * @return {Mixed} final result from iteratively applying the given function to each Node in the NodeList
	 */
	reduceRight: function(init, f, c)
	{
		return Y.Array.reduceRight(this._nodes, init, function(acc, node, index)
		{
			node = Y.one(node);
			return f.call(c || node, acc, node, index, this);
		},
		this);
	}
});


}, 'gallery-2012.05.23-19-56' ,{requires:['gallery-nodelist-extras','gallery-funcprog']});
