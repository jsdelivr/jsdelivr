YUI.add('gallery-node-optimizations', function(Y) {

"use strict";

/**
 * @module gallery-node-optimizations
 */

/**
 * Optimizations for searching DOM tree.
 *
 * @main gallery-node-optimizations
 * @class Node~optimizations
 */

var tag_class_name_re = /^([a-z]*)\.([-_a-z0-9]+)$/i;
var class_name_re     = /^\.([-_a-z0-9]+)$/i;
var tag_name_re       = /^[a-z]+$/i;

/**
 * Useful when constructing regular expressions that match CSS classes.
 *
 * @property class_re_prefix
 * @static
 * @type {String}
 * @value "(?:^|\\s)(?:"
 */
Y.Node.class_re_prefix = '(?:^|\\s)(?:';

/**
 * Useful when constructing regular expressions that match CSS classes.
 *
 * @property class_re_suffix
 * @static
 * @type {String}
 * @value ")(?:\\s|$)"
 */
Y.Node.class_re_suffix = ')(?:\\s|$)';

/**********************************************************************
 * <p>Patch to speed up search for a single class name or single tag name.
 * To use a regular expression, call getAncestorByClassName().</p>
 * 
 * @method ancestor
 * @param fn {String|Function} selector string or boolean method for testing elements
 * @param test_self {Boolean} pass true to include the element itself in the scan
 * @return {Node}
 */

var orig_ancestor = Y.Node.prototype.ancestor;

Y.Node.prototype.ancestor = function(
	/* string */	fn,
	/* bool */		test_self)
{
	if (Y.Lang.isString(fn))
	{
		var m = class_name_re.exec(fn);
		if (m && m.length)
		{
			return this.getAncestorByClassName(m[1], test_self);
		}

		if (tag_name_re.test(fn))
		{
			return this.getAncestorByTagName(fn, test_self);
		}
	}

	return orig_ancestor.apply(this, arguments);
};

/**********************************************************************
 * <p>Searches for an ancestor by class name.  This is significantly faster
 * than using Y.node.ancestor('.classname'), and it accepts a regular
 * expression.</p>
 * 
 * @method getAncestorByClassName
 * @param class_name {String|Regexp} class to search for
 * @param test_self {Boolean} pass true to include the element itself in the scan
 * @return {Node}
 */

Y.Node.prototype.getAncestorByClassName = function(
	/* string */	class_name,
	/* bool */		test_self)
{
	var e = this._node;
	if (!test_self)
	{
		e = e.parentNode;
	}

	while (e && !Y.DOM.hasClass(e, class_name))
	{
		e = e.parentNode;
		if (!e || !e.tagName)
		{
			return null;
		}
	}
	return Y.one(e);
};

/**********************************************************************
 * <p>Searches for an ancestor by tag name.  This is significantly faster
 * than using Y.node.ancestor('tagname').</p>
 * 
 * @method getAncestorByTagName
 * @param tag_name {String} tag name to search for
 * @param test_self {Boolean} pass true to include the element itself in the scan
 * @return {Node}
 */

Y.Node.prototype.getAncestorByTagName = function(
	/* string */	tag_name,
	/* bool */		test_self)
{
	var e = this._node;
	if (!test_self)
	{
		e = e.parentNode;
	}

	tag_name = tag_name.toLowerCase();
	while (e && e.tagName.toLowerCase() != tag_name)
	{
		e = e.parentNode;
		if (!e || !e.tagName)
		{
			return null;
		}
	}
	return Y.one(e);
};

/*
 * <p>Patch to speed up search for a single class name or single tag name.
 * To use a regular expression, call getElementsByClassName().</p>
 * 
 * @method one
 * @param fn {String|Function} selector string or boolean method for testing elements
 * @return {Node}
 */
/*
var orig_one = Y.Node.prototype.one;

Y.Node.prototype.one = function(selector)
{
	if (Y.Lang.isString(selector))
	{
		if (selector == '*')
		{
			return Y.one(Y.Node.getDOMNode(this).children[0]);
		}

		var m = tag_class_name_re.exec(selector);
		if (m && m.length)
		{
			return this.getFirstElementByClassName(m[2], m[1]);
		}

		if (tag_name_re.test(selector))
		{
			return this.getElementsByTagName(selector).item(0);
		}
	}

	return orig_one.apply(this, arguments);
};
*/
/*
 * <p>Patch to speed up search for a single class name or single tag name.
 * To use a regular expression, call getElementsByClassName().</p>
 * 
 * @method all
 * @param fn {String|Function} selector string or boolean method for testing elements
 * @return {Node}
 */
/*
var orig_all = Y.Node.prototype.all;

Y.Node.prototype.all = function(selector)
{
	if (Y.Lang.isString(selector))
	{
		var m = tag_class_name_re.exec(selector);
		if (m && m.length)
		{
			return this.getElementsByClassName(m[2], m[1]);
		}

		if (tag_name_re.test(selector))
		{
			return this.getElementsByTagName(selector);
		}
	}

	return orig_all.apply(this, arguments);
};
*/
/**********************************************************************
 * <p>Searches for descendants by class name.  Unlike Y.all(), this
 * function accepts a regular expression.</p>
 * 
 * @method getElementsByClassName
 * @param class_name {String|Regexp} class to search for
 * @param tag_name {String} optional tag name to filter by
 * @return {NodeList}
 */

Y.Node.prototype.getElementsByClassName = function(
	/* string */	class_name,
	/* string */	tag_name)
{
	var descendants = Y.Node.getDOMNode(this).getElementsByTagName(tag_name || '*');

	var list = new Y.NodeList();
	for (var i=0; i<descendants.length; i++)
	{
		var e = descendants[i];
		if (Y.DOM.hasClass(e, class_name))
		{
			list.push(e);
		}
	}

	return list;
};

/**********************************************************************
 * <p>Searches for one descendant by class name.  Unlike Y.one(), this
 * function accepts a regular expression.  </p>
 * 
 * @method getFirstElementByClassName
 * @param class_name {String|Regexp} class to search for
 * @param tag_name {String} optional tag name to filter by
 * @return {Node}
 */

Y.Node.prototype.getFirstElementByClassName = function(
	/* string */	class_name,
	/* string */	tag_name)
{
	if (!tag_name || tag_name == '*' || tag_name == 'div')
	{
		// breadth first search

		var list1 = [ Y.Node.getDOMNode(this) ], list2 = [];
		while (list1.length)
		{
			for (var i=0; i<list1.length; i++)
			{
				var root     = list1[i],
					children = root.children || root.childNodes;	// svg elements only have childNodes
				for (var j=0; j<children.length; j++)
				{
					var e = children[j];
					if (Y.DOM.hasClass(e, class_name))
					{
						return Y.one(e);
					}

					list2.push(e);
				}
			}

			list1 = list2;
			list2 = [];
		}
	}
	else
	{
		var descendants = Y.Node.getDOMNode(this).getElementsByTagName(tag_name || '*');

		for (var i=0; i<descendants.length; i++)
		{
			var e = descendants[i];
			if (Y.DOM.hasClass(e, class_name))
			{
				return Y.one(e);
			}
		}
	}

	return null;
};


}, 'gallery-2012.06.27-20-10' ,{requires:['node-base']});
