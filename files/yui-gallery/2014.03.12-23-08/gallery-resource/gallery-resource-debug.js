YUI.add('gallery-resource', function(Y) {

	/**
	 * Resource ??? A RESTful wrapper around Y.io
	 * 
	 * Oddnut Software
	 * Copyright (c) 2009-2011 Eric Ferraiuolo - http://eric.ferraiuolo.name
	 * YUI BSD License - http://developer.yahoo.com/yui/license.html
	 */
	
	var Resource,
		RESOURCE = 'resource',
		
		URI = 'uri',
		HEADERS = 'headers',
		TIMEOUT = 'timeout',
		ENTITY_TRANSLATORS = 'entityTranslators',
		
		E_REQUEST = 'request',
		E_RESPONSE = 'response',
		E_SUCCESS = 'success',
		E_FAILURE = 'failure',
		
		HEAD = 'HEAD',
		OPTIONS = 'OPTIONS',
		GET = 'GET',
		POST = 'POST',
		PUT = 'PUT',
		DELETE = 'DELETE',
		
		isString = Y.Lang.isString,
		isObject = Y.Lang.isObject,
		isNumber = Y.Lang.isNumber,
		isFunction = Y.Lang.isFunction;
		
	// *** Constructor *** //
	
	Resource = function (config) {
		
		Resource.superclass.constructor.apply(this, arguments);
	};
	
	// *** Static *** //
	
	Y.mix(Resource, {
		
		NAME : RESOURCE,
		
		ATTRS : {
			
			uri					: { validator: isString },
			headers				: { validator: isObject },
			timeout				: { validator: isNumber },
			entityTranslators	: { validator: isObject }
			
		},
		
		ENTITY_TRANSLATORS : {
			
			JSON	: {
				contentType	: 'application/json; charset=UTF-8',
				serialize	: Y.JSON.stringify,
				deserialize	: function(r){
					if (r.responseText) {
						return Y.JSON.parse(r.responseText);
					}
				}
			},
			
			FORM	: {
				contentType	: 'application/x-www-form-urlencoded; charset=UTF-8',
				serialize	: Y.QueryString.stringify,
				deserialize	: null
			}
			
		},
		
		NO_ENTITY_METHODS : [GET, HEAD, DELETE],
		
		isNoEntityMethod : function (method) {
			
			return Y.Array.indexOf(Resource.NO_ENTITY_METHODS, method.toUpperCase()) >= 0 ;
		}
		
	});
	
	// *** Prototype *** //
	
	Y.extend(Resource, Y.Base, {
		
		// *** Instance Members *** //
		
		_request : null,
		
		// *** Lifecycle Methods *** //
		
		initializer : function (config) {
			
			if ( ! this.get(URI)) {
				Y.error('A Resource needs to be configured with: uri');
			}
			
			config = config || {};
			
			this.publish(E_REQUEST, { defaultFn: this._defRequestFn });
			this.publish(E_RESPONSE);
			this.publish(E_SUCCESS);
			this.publish(E_FAILURE);
			
			Y.each(Resource.ENTITY_TRANSLATORS, Y.bind(this.registerEntityTranslator, this));	// default translators
			Y.each(config[ENTITY_TRANSLATORS], Y.bind(this.registerEntityTranslator, this));	// instance translators
		},
		
		destructor : function () {
			
			this._request = null;
		},
		
		// *** Public Methods *** //
		
		registerEntityTranslator : function (translator) {
			
			var transObj = {};
			
			if (translator && translator.contentType) {
				transObj[translator.contentType.split(';')[0]] = translator;
				this.set(ENTITY_TRANSLATORS, Y.merge(this.get(ENTITY_TRANSLATORS), transObj));
			}
		},
		
		unregisterEntityTranslator : function (contentType) {
			
			var translators = this.get(ENTITY_TRANSLATORS);
			
			if (contentType) {
				delete translators[contentType.split(';')[0]];
				this.set(ENTITY_TRANSLATORS, translators);
			}
		},
		
		getEntityTranslator : function (contentType) {
			
			return ( contentType ? this.get(ENTITY_TRANSLATORS)[contentType.split(';')[0]] : null );
		},
		
		sendRequest : function (config) {
			
			var uri = this.get(URI),
				defHeaders = this.get(HEADERS),
				defTimeout = this.get(TIMEOUT),
				method, headers, timeout, entity;
			
			config = config || {};
			method = config.method ? config.method.toUpperCase() : GET;
			headers = Y.merge(defHeaders, config.headers);
			timeout = config.timeout || defTimeout;
			
			if (Resource.isNoEntityMethod(method)) {
				delete headers['Content-Type'];
			} else {
				entity = config.entity;
			}
			
			this._request = null;
			
			this.fire(E_REQUEST, {
				uri		: uri,
				headers	: headers,
				timeout	: timeout,
				method	: method,
				params	: config.params,
				entity	: entity,
				on		: config.on
			});
			
			return this._request;
		},
				
		// *** Private Methods *** //
		
		_defRequestFn : function (e) {
			
			var methodRequest = e.method.toLowerCase()+'Request';
			
			this.publish(methodRequest, { defaultFn: this._sendRequest });
			this.fire(methodRequest, {
				uri		: e.uri,
				headers	: e.headers,
				timeout	: e.timeout,
				method	: e.method,
				params	: e.params,
				entity	: e.entity,
				on		: e.on
			});
		},
		
		_sendRequest : function (e) {
			
			var uri = e.uri,
				method = e.method,
				headers = e.headers,
				timeout = e.timeout,
				on = e.on,
				params, entity, translator;
			
			if (isObject(e.params)) {
				
				params = Y.clone(e.params, true);
				
				uri = Y.substitute(uri, params, function(k, v){
					delete params[k];
					return v;
				});
				
				if (Y.Object.size(params) > 0) {
					uri += uri.indexOf('?') < 0 ? '?' : '';
					uri += uri[uri.length-1] !== '?' && uri[uri.length-1] !== '&' ? '&' : '';
					uri += Y.QueryString.stringify(params);
				}
				
			}
			
			entity = e.entity;
			translator = this.getEntityTranslator(headers['Content-Type']);
			if (entity && translator && translator.serialize) {
				try {
					entity = translator.serialize(entity);
				} catch (err) {}
			}
			
			this._request = Y.io(uri, {
				method		: method,
				headers		: headers,
				data		: entity,
				timeout		: timeout,
				context		: this,
				on			: {
					complete	: this._onComplete,
					success		: this._onSuccess,
					failure		: this._onFailure
				},
				'arguments'	: {
					resource	: this,
					request		: {
						method	: e.method,	// method
						params	: e.params,	// original params
						entity	: e.entity	// original entity
					},
					on			: on
				}
			});
		},
		
		_onComplete : function (txId, r, args) {
			
			var methodResponse = args.request.method.toLowerCase()+'Response',
				payLoad = { txId: txId, request: args.request, response: r };
			
			this.getEvent(E_RESPONSE).applyConfig({ defaultFn: function(e){
				this.publish(methodResponse, { defaultFn: function(e){
					if (args.on && isFunction(args.on.response)) {
						args.on.response(payLoad);
					}
				}}).fire(payLoad);
			}}, true);
			
			this.fire(E_RESPONSE, payLoad);
		},
		
		_onSuccess : function (txId, r, args) {
			
			var methodSuccess = args.request.method.toLowerCase()+'Success',
				translator = this.getEntityTranslator(r.getResponseHeader('Content-Type')),
				entity, payLoad;
			
			if (r && translator && translator.deserialize) {
				try {
					entity = translator.deserialize(r);
				} catch (err) {
					Y.error(err);
				}
			}
			
			payLoad = { txId: txId, request: args.request, response: r, entity: entity };
			
			this.getEvent(E_SUCCESS).applyConfig({ defaultFn: function(e){
				this.publish(methodSuccess, { defaultFn: function(e){
					if (args.on && isFunction(args.on.success)) {
						args.on.success(payLoad);
					}
				}}).fire(payLoad);
			}}, true);
			
			this.fire(E_SUCCESS, payLoad);
		},
		
		_onFailure : function (txId, r, args) {
			
			var methodFailure = args.request.method.toLowerCase()+'Failure',
				payLoad = { txId: txId, request: args.request, response: r };
			
			this.getEvent(E_FAILURE).applyConfig({ defaultFn: function(e){
				this.publish(methodFailure, { defaultFn: function(e){
					if (args.on && isFunction(args.on.failure)) {
						args.on.failure(payLoad);
					}
				}}).fire(payLoad);
			}}, true);
			
			this.fire(E_FAILURE, payLoad);
		}
		
	});
	
	Y.each([HEAD, OPTIONS, GET, POST, PUT, DELETE], function(method){
		Resource.prototype[method] = function(config){
			if (isFunction(config)) {
				config = { on: { success: config } };
			}
			return this.sendRequest(Y.merge(config, { method: method }));
		};
	});
	
	Y.Resource = Resource;


}, 'gallery-2011.05.04-20-03' ,{requires:['base-base', 'io-base', 'querystring-stringify-simple', 'substitute', 'json']});
