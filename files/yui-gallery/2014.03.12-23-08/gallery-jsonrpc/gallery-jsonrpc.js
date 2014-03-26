YUI.add('gallery-jsonrpc', function(Y) {

/*
var rpc = new Y.JSONRPC({
    url: url,
    methods: ['foo'],
    version: 2,
    preload: true // defaults to false if methods is specified, true otherwise
});
rpc.exec('foo', ['bar', 'baz'], function (response) {});
rpc.foo('bar', 'baz', function (response) {});
rpc.foo('bar', 'baz', { on: { success: function (data) {}, ... } });
*/

var isFunction = Y.Lang.isFunction,
    toArray    = Y.Array;

function JSONRPC(config) {
    var methods = config && config.methods,
        i;

    config = this._config = Y.merge({
        context: this,
        method: 'POST'
    }, config);

    // default preload false if methods are specified, else true.
    if (!('preload' in config)) {
        config.preload = !methods;
    }

    JSONRPC.init.apply(this, arguments);

    if (methods) {
        for (i = methods.length - 1; i >= 0; --i) {
            JSONRPC.addMethod(this, methods[i]);
        }
    }

    if (config.preload) {
        this.loadAPI();
    }
}

Y.JSONRPC = Y.mix(JSONRPC, {

    defaults: {
        version: 2,
        sync: false,
        contentType: 'application/json'
    },

    // Static methods to avoid name collision with the remote API
    addMethod: function (rpc, name, force) {
        if (force || !rpc[name]) {
            rpc[name] = function () {
                var args = toArray(arguments, 0, true),
                    last = args[args.length - 1],
                    callback;
                    
                if (isFunction(last) ||
                    (last && last.on && (last.on.success || last.on.failure))) {
                    callback = args.pop();
                }

                return this.exec(name, args, callback);
            };
        }
    },

    init: function () {
        Y.mix(this._config, JSONRPC.defaults);

        this.publish('dispatch', {
            emitFacade: true,
            defaultFn: JSONRPC._defDispatchFn
        });
    },

    _defDispatchFn: function (e) {
        e.ioConfig.data = Y.JSON.stringify(e.rpcPayload);

        Y.io(e.url, e.ioConfig);
    },

    prototype: {
        exec: function (method, params, callback) {
            var data   = { method: method },
                config = this._config,
                ioConfig = {
                    headers: {
                        'Content-Type': config.contentType + '; charset=utf-8'
                    },
                    method: config.method,
                    sync: config.sync,
                    on: {}
                },
                success, failure;
                
            if (isFunction(callback)) {
                callback = { on: { success: callback } };
            }
            
            Y.aggregate(ioConfig, callback, true);

            if (params) {
                data.params = params;
            }

            if (config.serverParams) {
                Y.mix(data, config.serverParams);
            }

            if (config.version > 1) {
                data.jsonrpc = config.version.toFixed(1);
            }

            if (callback) {
                data.id = Y.guid();
                success = callback.on.success;
                failure = callback.on.failure;

                if (success) {
                    ioConfig.on.success = function (id, response) {
                        var data;
                        try {
                            data = Y.JSON.parse(response.responseText);
                        }
                        catch (e) {
                            data = {
                                error: {
                                    code: -32700,
                                    message: "Parse error"
                                },
                                id: null
                            };
                        }

                        if (data.error) {
                            if (failure) {
                                failure.call(ioConfig.context, data.error);
                            }
                        } else {
                            success.call(ioConfig.context, data.result);
                        }
                    };
                }
            }

            return this.fire('dispatch', {
                url: config.url,
                method: method,
                params: params,
                callback: callback,
                rpcPayload: data,
                ioConfig: ioConfig
            });

        },

        loadAPI: function () {
            var config = this._config;

            Y.io(config.url, {
                headers: {
                    'Content-Type': config.contentType + '; charset=utf-8'
                },
                sync: config.sync,
                on: {
                    success: function (id, response) {
                        var data, i;
                        try {
                            data = Y.JSON.parse(response.responseText);
                        }
                        catch(e) {
                            Y.error("Unable to parse remote API response", e);
                        }

                        if (data.envelope === 'JSON-RPC-1.0') {
                            config.version = 1;
                        }

                        if (data.methods) {
                            for (i = data.methods.length - 1; i >= 0; --i) {
                                JSONRPC.addMethod(this, data.methods[i]);
                            }
                        }

                        this.fire('apiready');
                    },
                    failure: function () {
                        Y.error("Unable to load remote API");
                        this.fire('apierror');
                    }
                },
                context: this
            });

            return this;
        }
    }
}, true);

Y.augment(JSONRPC, Y.EventTarget);

Y.jsonrpc = function (url, method, params, callback, config) {
    if (url && method) {
        // TODO: allow version config
        return new Y.JSONRPC(Y.mix({ url: url, preload: false }, config))
            .exec(method, params, callback);
    }
};

Y.mix(Y.namespace('RPC'), { JSON: Y.JSONRPC, json: Y.jsonrpc});


}, 'gallery-2012.05.09-20-27' ,{requires:['io-base', 'event-custom', 'json']});
