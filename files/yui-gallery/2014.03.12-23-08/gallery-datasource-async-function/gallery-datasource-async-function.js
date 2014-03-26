YUI.add('gallery-datasource-async-function', function (Y, NAME) {

"use strict";

/**
 * @module gallery-datasource-async-function
 */

/**********************************************************************
 * <p>Data source that calls an asynchronous function.</p>
 *
 * @main gallery-datasource-async-function
 * @class AsyncFunction
 * @namespace DataSource
 * @extends DataSource.Local
 * @constructor
 * @param config {Object}
 */
function AsyncFunctionDataSource()
{
	AsyncFunctionDataSource.superclass.constructor.apply(this, arguments);
}

AsyncFunctionDataSource.NAME = "asyncFunctionDataSource";

AsyncFunctionDataSource.ATTRS =
{
	/**
	 * <p>The function that will be called to retrieve the data.  This
	 * function is called with the DataSource as the scope and arguments
	 * (callback,request,ds,e).  The function must invoke callback, passing
	 * (error,response).</p>
	 *
	 * @attribute source
	 * @type {Function}
	 */
	source:
	{
		validator: Y.Lang.isFunction
	}
};

Y.extend(AsyncFunctionDataSource, Y.DataSource.Local,
{
	/**
	 * Passes request to source. Fires <code>data</code> event when
	 * response is received asynchronously.
	 *
	 * @method _defRequestFn
	 * @param e {Event.Facade} Event Facade
	 * @param e.tId {Number} Unique transaction ID
	 * @param e.request {Object} The request
	 * @param e.callback {Object} The callback object
	 * @param e.callback.success {Function} Success handler
	 * @param e.callback.failure {Function} Failure handler
	 * @param e.cfg {Object} Configuration object
	 * @protected
	 */
	_defRequestFn: function(e)
	{
		var fn = this.get("source"),
			payload = e.details[0];

		function callback(error, response)		// NodeJS signature
		{
			if (error)
			{
				payload.error = error;
			}
			else if (response.data && response.meta)
			{
				payload.data = response.data;
				payload.meta = response.meta;
			}
			else
			{
				payload.data = response;
			}

			this.fire('data', payload);
		}

		if (fn)
		{
			try
			{
				fn.call(this, Y.bind(callback, this), e.request, this, e);
			}
			catch (ex)
			{
				payload.error = ex;
				this.fire('data', payload);
			}
		}
		else
		{
			payload.error = new Error('Function was not configured for AsyncFunctionDataSource');
			this.fire('data', payload);
		}

		return e.tId;
	}
});

Y.DataSource.AsyncFunction = AsyncFunctionDataSource;


}, 'gallery-2013.10.24-18-05', {"requires": ["datasource-local"]});
