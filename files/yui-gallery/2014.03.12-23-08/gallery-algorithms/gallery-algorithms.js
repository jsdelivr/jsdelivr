YUI.add('gallery-algorithms', function (Y, NAME) {

"use strict";

/**
 * @module gallery-algorithms
 */

/**
 * <p>Useful algorithms not provided by browsers.</p>
 *
 * @main gallery-algorithms
 * @class Array~algorithms
 */

/**********************************************************************
 * <p>Swaps two elements.</p>
 * 
 * @method swap
 * @static
 * @param list {Array} the list on which to operate
 * @param i {int} first index
 * @param j {int} second index
 */
Y.Array.swap = function(list,i,j)
{
	var tmp = list[i];
	list[i] = list[j];
	list[j] = tmp;
};

/**********************************************************************
 * <p>A -1,0,+1 comparator for case-sensitive string comparison.</p>
 * 
 * @method compareStringsCaseSensitive
 * @static
 * @param s1 {String} first string
 * @param s2 {String} second string
 * @return -1 if s1&lt;s2, 0 if s1==s2, +1 if s1&gt;s2
 */
Y.Array.compareStringsCaseSensitive = function(s1, s2)
{
	if (s1 == s2)
		{
		return 0;
		}
	else
		{
		return (s1 < s2 ? -1 : +1);
		}
};

/**********************************************************************
 * <p>A -1,0,+1 comparator for case-insensitive string comparison.</p>
 * 
 * @method compareStringsCaseInsensitive
 * @static
 * @param s1 {String} first string
 * @param s2 {String} second string
 * @return -1 if s1&lt;s2, 0 if s1==s2, +1 if s1&gt;s2
 */
Y.Array.compareStringsCaseInsensitive = function(s1, s2)
{
	return Y.Array.compareStringsCaseSensitive(s1.toLowerCase(), s2.toLowerCase());
};

/*
quick sort history:

	Copyright (c) 2006 John Lindal
	Copyright (c) 2003 Scandinavian Digital Systems AB

	Adapted from http://www.digsys.se

	Freeware: The source code and its methods and algorithms may be
			  used as desired without restrictions.
*/

function qsort1(list,i1,i2,compare)
{
	var n, m, ip, im, pivot, s, b=true;

	if (!compare)
		{
		compare = Y.Array.compareStringsCaseSensitive;
		}

	im=Math.floor((i1+i2)/2); // Note, im may be equal to i1 but never to i2
	n=im;
	ip=n--;
	pivot=list[ip];
	while (n>=i1 && b)
		{
		m=n--;
		b=(compare(pivot, list[m])===0);
		}
	n=im+1; // n may be equal to i2 but not i2+1 (at this point)
	while (n<=i2 && b)
		{
		m=n++;
		b=(compare(pivot, list[m])===0);
		}
	if (b) { return -1; }
	if (compare(list[m], pivot) > 0)
		{
		ip=m;
		pivot=list[ip];
		}
	n=i1;  // Left
	m=i2;  // Right
	while (n<=m)
		{
		while (compare(pivot, list[n]) > 0)
			{
			n++;
			}
		while (compare(pivot, list[m]) <= 0)
			{
			m--;
			}
		if (n<m)
			{
			s=list[m];
			list[m]=list[n];
			list[n]=s;
			m--;
			n++;
			}
		}
	return n;
}

function qsortRange(list,first,last,compare)
{
	var center; // This local var is the only recursive stack space used
	if (first<last)
		{
		center=qsort1(list,first,last,compare);
		if (center!=-1)
			{
			qsortRange(list,first,center-1,compare);
			qsortRange(list,center,last,compare);
			}
		}
}

/**********************************************************************
 * <p>Quick sort the given list.</p>
 * 
 * @method quickSort
 * @static
 * @param list {Array} the list to search (sorted on the compare function)
 * @param compare=Y.Array.compareStringsCaseSensitive {Function} the comparison function
 */
Y.Array.quickSort = function(list,compare)
{
	qsortRange(list, 0, list.length-1, compare);
};

/*
binary search history:

	Dobrica Pavlinusic, dpavlin@rot13.org 2004-09-06
	Matko Andjelinic, matko.andjelinic@gmail.com 2004-09-09 (contributed OO implementation)
*/

/**********************************************************************
 * <p>Binary search.</p>
 * 
 * @method binarySearch
 * @static
 * @param list {Array} the list to search (sorted on the compare function)
 * @param target {Mixed} the object to search for
 * @param [compare=Y.Array.compareStringsCaseSensitive] {Function} the comparison function
 * @return {int} index of matched item or -1 if no match
 */
Y.Array.binarySearch = function(list, target, compare)
{
	if (!list || !list.length || Y.Lang.isUndefined(target))
		{
		return null;
		}

	if (!compare)
		{
		compare = Y.Array.compareStringsCaseSensitive;
		}

	var low  = 0;
	var high = list.length - 1;

	var lastTry;
	while (low <= high)
	{
		var mid  = (low + high) / 2;
		var aTry = (mid < 1) ? 0 : parseInt(mid, 10);

		var c = compare(list[aTry], target);
		if (c < 0)
		{
			low = aTry + 1;
			continue;
		}
		if (c > 0)
		{
			high = aTry - 1;
			continue;
		}

		high    = aTry - 1;
		lastTry = aTry;
	}

	return (Y.Lang.isUndefined(lastTry) ? -1 : lastTry);
};
/**
 * @module gallery-algorithms
 */

if (Y.ArrayList)
{
	/**********************************************************************
	 * Useful algorithms that are not provided by browsers.  Available if
	 * Y.ArrayList (collection) is loaded.
	 * 
	 * @class ArrayList~extras
	 */

	Y.mix(Y.ArrayList,
	{
		/**
		 * <p>Swap two elements.</p>
		 * 
		 * @method swap
		 * @param i {int} first index
		 * @param j {int} second index
		 */
		swap: function(i,j)
		{
			Y.Array.swap(this._items, i,j);
		},

		/**
		 * <p>Set comparison function.</p>
		 * 
		 * @method setComparator
		 * @param compare {Function} the -1,0,+1 comparison function to use when sorting and searching
		 */
		setComparator: function(compare)
		{
			this._compare = compare;
		},

		/**
		 * <p>Quick sort the given list, using the function passed to setComparator().</p>
		 * 
		 * @method quickSort
		 */
		quickSort: function()
		{
			Y.Array.quickSort(this._items, this._compare);
		},

		/**
		 * <p>Binary search, using the function passed to setComparator().</p>
		 * 
		 * @method binarySearch
		 * @param target {Mixed} the object to search for
		 * @return {int} index of matched item or -1 if no match
		 */
		binarySearch: function(target)
		{
			Y.Array.binarySearch(this._items, target, this._compare);
		}
	});
}


}, 'gallery-2013.01.16-21-05', {"optional": ["collection"]});
