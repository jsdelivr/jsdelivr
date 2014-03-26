YUI.add('gallery-log-filter', function(Y) {

"use strict";

/**
 * @module gallery-log-filter
 */

/**********************************************************************
 * <p>Appends filters to the log output.</p>
 * 
 * @main gallery-log-filter
 * @class LogFilter
 */

Y.LogFilter =
{
	/**
	 * Adds a filter that filters out messages other than the given set of
	 * levels.
	 * 
	 * @method addLevelFilter
	 * @static
	 * @param levels {Array} List of log levels to pass through, e.g, `['error','warn']`.
	 */
	addLevelFilter: function(levels)
	{
		var orig_logFn = Y.config.logFn;
		Y.config.logFn = function(msg, cat, src)
		{
			if (Y.Array.indexOf(levels, cat) >= 0)
			{
				orig_logFn.apply(this, arguments);
			}
		};
	},

	/**
	 * Adds a function to filter log messages.
	 * 
	 * @method addFilter
	 * @static
	 * @param filter {Function} Function to apply.  Called with `msg, cat, src`.  Returns `true` to pass the message.
	 */
	addFilter: function(filter)
	{
		var orig_logFn = Y.config.logFn;
		Y.config.logFn = function(msg, cat, src)
		{
			if (filter.call(this, msg, cat, src))
			{
				orig_logFn.apply(this, arguments);
			}
		};
	}
};


}, 'gallery-2012.08.15-20-00' );
