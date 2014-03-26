YUI.add('gallery-mojito-rpc', function(Y) {

"use strict";

/**
 * @module gallery-mojito-rpc
 */

/**********************************************************************
 * <p>RPC wrapper for Mojit proxy.  This allows you to use either
 * Y.RPC.JSON or Y.RPC.Mojito interchangeably.  The method in the Mojit
 * proxy receives the parameters as an array in <code>body.params</code>.
 * You can pass this to the model as follows:
 * <code>model.getItems.apply(model,
 * ac.params.getFromBody().params)</code></p>
 *
 * @main gallery-mojito-rpc
 * @class Mojito
 * @namespace RPC
 * @constructor
 * @param config {Object}
 * @param config.url {Object} the mojit proxy (parameter named to match Y.jsonrpc)
 * @param config.methods {Array} (optional) method names, so you don't have to use `exec`
 */

function MojitoRPC(config)
{
	this._mojit_proxy = config.url;

	if (Y.Lang.isArray(config.methods))
	{
		Y.each(config.methods, Y.bind(MojitoRPC.addMethod, null, this));
	}
}

/**
 * Adds the named method to the given rpc object.
 * 
 * @method addMethod
 * @static
 * @param rpc {RPC.Mojito} rpc object
 * @param name {String} name of method
 * @param force {Boolean} pass true to override existing method
 */
MojitoRPC.addMethod = function(rpc, name, force)
{
	if (rpc[name] && !force)
	{
		return;
	}

	rpc[name] = function()
	{
		var args = Y.Array(arguments, 0, true),
			last = args[args.length - 1],
			callback;

		if (Y.Lang.isFunction(last) ||
			(last && last.on && (last.on.success || last.on.failure)))
		{
			callback = args.pop();
		}

		return this.exec(name, args, callback);
	};
};

MojitoRPC.prototype =
{
	/**
	 * Executes the named method via the mojitProxy and invokes the callback
	 * when the result is received.
	 *
	 * @method exec
	 * @async
	 * @param method {String} the name of the function to execute via the mojitProxy
	 * @param params {Array} array of arguments for the method
	 * @param callback {Function|Object} (optional) function to call on success or object specifying {context,on:{success,failure}}
	 */
	exec: function(method, params, callback)
	{
		var p = { params: { body: { params: params } } };

		if (Y.Lang.isFunction(callback))
		{
			callback = { on: { success: callback } };
		}

		this._mojit_proxy.invoke(method, p, function(error, response)
		{
			var result =
			{
				id:     null,
				error:  null,
				result: response
			};

			if (error && callback.on.failure)
			{
				result.error =
				{
					code:    -32000,
					message: error.message
				};
				callback.on.failure.call(callback.context, result);
			}
			else if (!error && callback)
			{
				callback.on.success.call(callback.context, result);
			}
		});
	}
};

var RPC    = Y.namespace('RPC');
RPC.Mojito = MojitoRPC;

/**
 * @method mojito
 * @static
 * @async
 * @param proxy {Object} the mojit proxy
 * @param method {String} the name of the function to execute via the mojitProxy
 * @param params {Array} array of arguments for the method
 * @param callback {Function|Object} (optional) function to call on success or object specifying {context,on:{success,failure}}
 * @param config {Object} config object passed to Y.RPC.Mojito constructo
 */
RPC.mojito = function(proxy, method, params, callback, config)
{
	if (proxy && method)
	{
		return new MojitoRPC(Y.mix({ url: proxy }, config))
			.exec(method, params, callback);
	}
};


}, 'gallery-2012.05.16-20-37' ,{requires:['oop']});
