YUI.add('gallery-inline-xhr', function(Y) {

var SCRIPT_NAME = "inlineXHR",
	cfg = {mode: null, url: null, method: "POST"},
	clientMethods = {},
	spinnerCount = 0,
	EXECUTING = "Executing",
	METHOD = "method",
	RESPONSE_TEXT = "ResponseText",
	UNDEFINED = "undefined",
	BLANK = " ",
	POUND = "#",
	IS_EMPTY = "is empty",
	IN = "in",
	ERROR = "error",
	INFO = "info",
	ALERT = "alert",
	NOT_FOUND = "not found",
	HTML = "HTML",
	CURSOR = "cursor",
	JSON_SYNTAX_ERROR = "JSON syntax error in responseText: ",
	debugLog = function (txt, level) {
		if(level === ERROR && cfg.mode === ALERT){
			window.alert(txt);
		}
	},
	tryYmethod = function (execfunc, args, ioId, o) {
		if(Y[execfunc] === undefined){
			return false;
		}else{
			debugLog(EXECUTING + BLANK + METHOD + " of Y : " + execfunc ,  INFO);
			args.push(ioId,o);
			Y[execfunc].apply(Y,args);
			return true;
		}
	},
	tryPrivMethod = function (execfunc, args, ioId, o) {
		if(clientMethods === undefined){
			return false;
		}
		if(clientMethods[execfunc] !== undefined){
			debugLog(EXECUTING + " private" + BLANK + METHOD + " : " + execfunc ,  INFO);
			args.push(ioId,o);
			clientMethods[execfunc].apply(clientMethods,args);
			return true;
		}else{
			return false;
		}
	},
	notifyError = function (c,t){
		debugLog("Error response received from server: " + c + ": " + t, ERROR);
	},	
	success =  function(ioId, o){
		
		if(o.responseText !== undefined){
			if(o.responseText.length === 0){
				debugLog(RESPONSE_TEXT + BLANK + IS_EMPTY + '.', ERROR);
				return;
			}
			try{
				
				var newObj = Y.JSON.parse(o.responseText),
					eCode,
					eTxt,
					i,
					ob,
					execfunc,
					args;
					
				if(newObj.c !== 200){
					eCode = newObj.c;
					eTxt = newObj.t;
					notifyError(eCode, eTxt);
				}else{
					try{
						for (i in newObj.ff){
							if(newObj.ff.hasOwnProperty(i)){
								ob = newObj.ff[i];
								execfunc = ob.f;
								args = ob.a;
								if(!tryYmethod(execfunc, args, ioId, o)){
									if(!tryPrivMethod(execfunc, args, ioId, o)){
										debugLog(METHOD + " '" + execfunc + "' " + NOT_FOUND + " in Y or " + SCRIPT_NAME, ERROR);
									}
								}
							}
						}
					}catch(ex){
						debugLog(ERROR + BLANK + ex, ERROR);
						return;
					}
				}				
			}catch(ex){
				debugLog(JSON_SYNTAX_ERROR + o.responseText + BLANK + IN + BLANK + SCRIPT_NAME + ' ' + ex, ERROR);
				return;
			}
		}else{
			debugLog(RESPONSE_TEXT + BLANK + UNDEFINED + BLANK + IN + BLANK + SCRIPT_NAME, ERROR);
		}
	},
	incrSpinnerCount = function () {
		spinnerCount ++;
	},
	decrSpinnerCount = function () {
		spinnerCount --;
	},	
	getSpinnerCount = function () {
		return spinnerCount;
	},
	setSpinner = function () {
		incrSpinnerCount();
		Y.one(HTML).setStyle(CURSOR,'wait');
		Y.all('input').each(
		function(n){
			n.setStyle(CURSOR,'wait');
			}
		);
	},
	resetSpinner = function () {
		decrSpinnerCount();
		if(0 === getSpinnerCount()){
			Y.one(HTML).setStyle(CURSOR,'default');
			Y.all('input').each(
			function(n){
				n.setStyle(CURSOR,'default');
				}
			);
		}
	},
	failure = function(ioId, o){
		var s = "Failure for xhr Id: " + ioId + ".\n";
		s += "HTTP status: " + o.status + "\n";
		s += "HTTP headers received: " + o.getAllResponseHeaders() + "\n";
		s += "Status code message: " + o.statusText + ".";
		debugLog(s, ERROR);
	},
	request = function () {
		var i;
		for (i in this){
			if(this.hasOwnProperty(i) && i !== 'request'){
				this[i]();
			}
		}
	},
	load = function (obj) {
		obj = obj || {};

		//add method request to the group object, from the private methods
		if(undefined === obj.request){
			obj.request = request;
		}
		return obj;
	},
	InlineXhr = function () {
		InlineXhr.superclass.constructor.apply(this, arguments);
		
	};

InlineXhr.NAME = SCRIPT_NAME;

Y.extend(InlineXhr, Y.Base, {
	
		register : function (obj, method, data, formId) {
			var instance = this;
			obj = load(obj);
			obj[method] = function () {
				cfg.url = cfg.url ? cfg.url : document.location.href.replace(document.location.hash,'');
				var form = null,
					Yrequest;
				
				if(formId !== undefined){
					form = {id: Y.one(formId),
						useDisabled: false
					};
				}
				Yrequest = Y.io(cfg.url, {
				method: cfg.method,
				data: data + "&ajaxAction=" + method,
				form: form,
				on: {
					success: success,
					failure: failure,
					start: setSpinner,
					complete:resetSpinner,
					end: Y.bind(instance._onEnd, instance)
					},
				arguments: {
					end: method
					}
				});
			};
			return obj;
		},
		/*
		* we might need a counter to prefix fnName
		* with count to avoid doubles
		*/
		_getEndCb : function (fnName) {
			return this._endCallBacks.funcs[fnName];
		},
		_getEndCbArgs : function (fnName) {
			return this._endCallBacks.args[fnName];
		},
		_getEndCbContext : function (fnName) {
			return this._endCallBacks.contexts[fnName];
		},
		/**
		 * Exec the end callBack added to the object for this function name
		 *
		 */
		_onEnd : function () {
			var fnName = arguments[1].end,
			fn = this._getEndCb(fnName),
			args = this._getEndCbArgs(fnName),
			context = this._getEndCbContext(fnName) || this;
			if(Y.Lang.isFunction(fn)){
				this._endCallBacks.results[fnName] = fn.apply(context, args);
			}
		},
		_endCallBacks : {args: {}, funcs: {}, contexts: {}, results: {}},
		
		_clearEndCallBack : function (fnName) {
			this._endCallBacks.contexts[fnName] = null;
			this._endCallBacks.funcs[fnName] = null;
			this._endCallBacks.args[fnName] = null;
			this._endCallBacks.results[fnName] = null;
		},
		/**
		 * Load a storage object with io end event callbacks and arguments
		 * @param fnName, the name of the method invocation this end callback is relative to
		 * @param fn, object the function to execute after the io 'end' event has fired
		 *
		 * We might add  a "once" method, using a flag to signal to
		 * clear the callback storage after the first run.
		 *
		 **/
		after : function (fnName, fn) {
			var args = Y.Array(arguments);
			if(args.length < 2){
				debugLog("Missing mandatory arguments to inlineXHR::after." + fnName, ERROR);
			}
			args.splice(0,2);
			var c = args.shift();
			this._endCallBacks.contexts[fnName] = c;
			this._endCallBacks.funcs[fnName] = fn;
			this._endCallBacks.args[fnName] = args;//pass all remaining args as array
		},
		/**
		 * Return the result, if any, of the 'after' callback relative to the passed function name
		 *
		 * @param {string} the name of the function after which the callback
		 * has produced the requested result
		 **/
		getAfter : function (fnName) {
			var ret = this._endCallBacks.results[fnName];
			this._clearEndCallBack(fnName);
			return ret;
		},
		/**
		 * Send requests and get params in a way to aid to a wizard pattern,
		 * where the client receives instructions from the server about which
		 * params to send to be able to request the next screen.
		 * 
		 * The wizard method is a short form of the following:
		 * 
		 * var requester,fnName ='myFunctionName',action,formID = 'myFormId',tag = 'idForNextStep';
		 * action = xhr.getAfter('create_new_account');
		 * xhr.after(fnName,function(tag){var action = Y.one("#" + tag).get('value')},Y, tag);
		 * xhr.register(requester,fnName,action,'#' + formID).request();
		 *
		 * Instead do:
		 * xhr.wizard({fnName:'myFunctionName', formId: 'myFormId', tag: 'idForNextStep'}).request();
		 * 
		 * The server script (a function, class method or Smarty plugin) named <fnName> displays
		 * a page where a hidden input by id=<tag> has a value containing a string representing
		 * the next switch case, that is meant to be processed by the server script itself.
		 * inlineXHR will send a request with a param named as required. The parameter itself (not it's value)
		 * will be used by the server script to process the request.
		 * The request will contain also the params passed via the form having id = <formID>.
		 * 
		 **/
		wizard : function (oCfg) {
			var fnName = oCfg.fnName,
				tag = oCfg.tag,
				requester,
				action = oCfg.start ? null : this.getAfter(fnName),
				args = [requester, fnName, action],
				formId = oCfg.formId ? POUND + oCfg.formId : null;
				if(formId){
					args.push(formId);
					}
				requester = this.register.apply(this, args);
				if(tag){
					this.after(fnName,function(tag){action = Y.one(POUND + tag).get('value'); return action;}, this, tag);
					}
				return requester;
		},
		header : function (name, header) {
			Y.io.header.apply(Y, arguments);
		},
		usePrivate : function (method, methodName) {
			clientMethods[methodName] = method;
			debugLog("Registering for use private func: " + methodName + " on inlinexhr object.", INFO);
		},
		setConfig : function (config) {
			var i;
			for (i in config){
				if (config.hasOwnProperty(i)){
					if(cfg[i] === undefined){
						debugLog("Wrong configuration parameter passed to xhr object: " + i, ERROR);
					}
					debugLog("Setting : '" + i + "' to '" + config[i] + "'", INFO);
					cfg[i] = config[i];
				}
			}
		},
		startSpinner : function () {
			Y.one(HTML).setStyle(CURSOR,'wait');
		},
		stopSpinner : function () {
			if(0 === getSpinnerCount()){
				Y.one(HTML).setStyle(CURSOR,'default');
			}
		},
		/**
		 * Add all of an object public methods to the xhr clientMethods property
		 * and bind them to the widget
		 * @param {object} widget, the object containing the methods to bind
		 * @param {list} l_filterMethods, optional: a list of methods to bind. Only use this list
		 */
		bind : function (widget, l_filterMethods) {
			var methodName,
				i;
			if(l_filterMethods){
				debugLog("Binding selected methods: " + l_filterMethods, INFO);
				for (i=0; i < l_filterMethods.length;  i++){
					methodName= l_filterMethods[i];
					if(Y.Lang.isFunction(widget[methodName])){
						this.usePrivate(Y.bind(widget[methodName],widget), methodName);
					}else{
						debugLog("Wrong argument passed to inlineXHR::bind: " + methodName, ERROR);
					}
				}
			}else{
				for (i in widget){
					if(0 !== i.indexOf('_')){
						this.usePrivate(widget[i], i);
					}
				}
			}
			if(Y.dump){
				debugLog("Dumping clientMethods: " + Y.dump(clientMethods), INFO);
			}
		}
	});
Y.Base.InlineXhr = InlineXhr;


}, 'gallery-2011.10.27-17-03' ,{optional:['io-form'], requires:['json-parse', 'node', 'io-base', 'base']});
