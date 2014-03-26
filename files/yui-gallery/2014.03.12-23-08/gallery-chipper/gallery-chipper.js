YUI.add('gallery-chipper', function(Y) {

"use strict";

/**
 * @module gallery-chipper
 */

/**********************************************************************
 * <p>Destroys objects asynchronously.</p>
 * 
 * @main gallery-chipper
 * @class Chipper
 */

var list  = [],
	timer = null;

function spinUp()
{
	if (!timer)
	{
		timer = Y.later(100, null, function()
		{
			if (list.length > 0)
			{
				var obj = list.pop();
				if (Y.Lang.isFunction(obj.destroy))
				{
					obj.destroy();
				}
			}
			else
			{
				timer.cancel();
				timer = null;
			}
		},
		null, true);
	}
}

Y.Chipper =
{
	/**
	 * Throw objects into the chipper.  If an object does not implement
	 * destroy(), it is ignored.
	 * 
	 * @method destroy
	 * @static
	 * @param objs {Object/Array} The object(s) to destroy.
	 */
	destroy: function(
		/* object/array */	objs)
	{
		list = list.concat(objs);
		spinUp();
	}
};


}, 'gallery-2012.05.16-20-37' ,{requires:['yui-later']});
