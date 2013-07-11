(function (undefined) {
    angular.module('restful', ['ng']).
        factory('$route_restful', function($http, $parse) {

            var forEach = angular.forEach;

            function encodeUriSegment(val) {
                return encodeUriQuery(val, true).
                    replace(/%26/gi, '&').
                    replace(/%3D/gi, '=').
                    replace(/%2B/gi, '+');
            }

            function encodeUriQuery(val, pctEncodeSpaces) {
                return encodeURIComponent(val).
                    replace(/%40/gi, '@').
                    replace(/%3A/gi, ':').
                    replace(/%24/g, '$').
                    replace(/%2C/gi, ',').
                    replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
            }

            function RouteRestfulFactory(template, defaults) {
                this.template = template = template + '#';
                this.defaults = defaults || {};
                this.urlParams = {};
            }

            RouteRestfulFactory.prototype = {
                getUrl: function(params, actionUrl) {
                    var self = this,
                        url = actionUrl || self.template,
                        val,
                        encodedVal;

                    var urlParams = self.urlParams = {};
                    forEach(url.split(/\W/), function(param){
                        if (param && (new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url))) {
                            urlParams[param] = true;
                        }
                    });
                    url = url.replace(/\\:/g, ':');

                    params = params || {};
                    forEach(self.urlParams, function(_, urlParam){
                        val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam];
                        if (angular.isDefined(val) && val !== null) {
                            encodedVal = encodeUriSegment(val);
                            url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), encodedVal + "$1");
                        } else {
                            url = url.replace(new RegExp("(\/?):" + urlParam + "(\\W|$)", "g"), function(match, leadingSlashes, tail) {
                                if (tail.charAt(0) == '/') {
                                    return tail;
                                } else {
                                    return leadingSlashes + tail;
                                }
                            });
                        }
                    });

                    // set the url
                    return (url.replace(/\/?#$/, '').replace(/\/*$/, ''));
                },
                getParams: function(params, actionUrl) {
                    var self = this,
                        url = actionUrl || self.template,
                        val,
                        encodedVal;

                    var urlParams = self.urlParams = {};
                    forEach(url.split(/\W/), function(param){
                        if (param && (new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url))) {
                            urlParams[param] = true;
                        }
                    });
                    url = url.replace(/\\:/g, ':');

                    params = params || {};
                    forEach(self.urlParams, function(_, urlParam){
                        val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam];
                        if (angular.isDefined(val) && val !== null) {
                            encodedVal = encodeUriSegment(val);
                            url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), encodedVal + "$1");
                        } else {
                            url = url.replace(new RegExp("(\/?):" + urlParam + "(\\W|$)", "g"), function(match, leadingSlashes, tail) {
                                if (tail.charAt(0) == '/') {
                                    return tail;
                                } else {
                                    return leadingSlashes + tail;
                                }
                            });
                        }
                    });

                    var paramsReturn;
                    // set params - delegate param encoding to $http
                    forEach(params, function(value, key){
                        if (!self.urlParams[key]) {
                            paramsReturn = paramsReturn || {};
                            paramsReturn[key] = value;
                        }
                    });
                    return paramsReturn;
                }
            };
            return RouteRestfulFactory;
        }).
        factory('$restful', ['$http', '$parse', '$route_restful', function($http, $parse, $route_restful) {

            var noop = angular.noop,
                forEach = angular.forEach,
                extend = angular.extend,
                copy = angular.copy,
                isFunction = angular.isFunction,
                isArray = angular.isArray,
                getter = function(obj, path) {
                    return $parse(path)(obj);
                };

            if( !Array.prototype.hasOwnProperty('has') ){
                Object.defineProperty(Array.prototype, 'has', {
                    value: function(value) {
                        var retorno = false;
                        if( this.length ){
                            for( var i = 0; i < this.length; i++ ){
                                if( this[i] == value ){
                                    retorno = true;
                                    break;
                                }
                            }
                        }
                        return retorno;
                    }
                });
            }

            function RestfulFactory(url, opts) {

                var optDefault = {
                    params:     {},
                    actions:    {},
                    baseURL:    null,
                    only:       null,
                    except:     null
                };

                opts = angular.extend({}, optDefault, opts);
                actions = angular.extend({}, RestfulFactory.$defaultActions, opts.actions);

                if( isArray(opts.only) ){
                    var newActions = {};
                    forEach(actions, function(value, key){
                        if( opts.only.has(key) )
                            newActions[key] = value;
                    });
                    actions = newActions;
                } else if( isArray(opts.except) ) {
                    var newActions = {};
                    forEach(actions, function(value, key){
                        if( !opts.except.has(key) )
                            newActions[key] = value;
                    });
                    actions = newActions;
                }

                var route = new $route_restful(url);

                function extractParams(data, actionParams){
                    var ids = {};
                    actionParams = extend({}, opts.params, actionParams);
                    forEach(actionParams, function(value, key){
                        if (isFunction(value)) { value = value(); }
                        ids[key] = value.charAt && value.charAt(0) == '@' ? getter(data, value.substr(1)) : value;
                    });
                    return ids;
                }

                function Restful(value){
                    copy(value || {}, this);
                    this.$getUrl = function(){
                        return route.getUrl(this);
                    };
                }

                forEach(actions, function(action, name) {
                    action.method = angular.uppercase(action.method);
                    var hasBody = action.method == 'POST' || action.method == 'PUT' || action.method == 'PATCH';
                    Restful[name] = function(a1, a2, a3, a4, a5) {
                        var params = {},
                            data,
                            resources = [],
                            success = noop,
                            error = null,
                            baseURL = opts.baseURL || RestfulFactory.$baseURL,
                            promise;

                        switch(arguments.length) {
                            case 5:
                                error = a5;
                            case 4:
                                success = a4;
                            case 3:
                                if (isFunction(a3)){
                                    if(isFunction(a2)){
                                        success = a2;
                                        error = a3;
                                    } else {
                                        success = a3;
                                    }
                                } else {
                                    resources = a3;
                                }
                            case 2:
                                if(isFunction(a2)){
                                    if(isFunction(a1))
                                        error = a2;
                                    else
                                        success = a2;
                                } else if(isArray(a2)){
                                    resources = a2;
                                } else {
                                    data = a2
                                }
                            case 1:
                                if (isFunction(a1)) success = a1;
                                else if (isArray(a1)) resources = a1;
                                else if (hasBody && !data) data = a1;
                                else params = a1;
                                break;
                            case 0: break;
                            default:
                                throw "Expected between 0-5 arguments [params, data, resources, success, error], got " + arguments.length + " arguments.";
                        }

                        var value = this instanceof Restful ? this : (action.isArray ? [] : new Restful(data));
                        var httpConfig = {},
                            promise;

                        forEach(action, function(value, key) {
                            if (key != 'params' && key != 'isArray' ) {
                                httpConfig[key] = copy(value);
                            }
                        });
                        httpConfig.data = data;
                        var paramsMerge =  extend({}, extractParams(data, action.params || {}), params);

                        httpConfig.url = '';
                        forEach(resources, function(restful, index) {
                            if( restful.hasOwnProperty('$getUrl') ){
                                httpConfig.url = httpConfig.url + restful.$getUrl();
                            }
                        });
                        httpConfig.url = baseURL + httpConfig.url + route.getUrl(paramsMerge, action.url);
                        httpConfig.params = route.getParams(paramsMerge, action.url);
                        if( !httpConfig.headers ){
                            httpConfig.headers = {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            };
                        }


                        function markResolved() { value.$resolved = true; }
                        promise = $http(httpConfig);
                        value.$resolved = false;

                        promise.then(markResolved, markResolved);
                        value.$then = promise.then(function(response) {
                            var data = response.data;
                            var then = value.$then, resolved = value.$resolved;

                            if (data) {
                                if (action.isArray) {
                                    value.length = 0;
                                    forEach(data, function(item) {
                                        var rest = new Restful(item);
                                        rest.$resources = resources;
                                        value.push(rest);
                                    });
                                } else {
                                    copy(data, value);
                                    value.$then = then;
                                    value.$resolved = resolved;
                                    value.$resources = resources;
                                    value.$getUrl = function(){
                                        return route.getUrl(data);
                                    };
                                }
                            }

                            (success||noop)(value, response.headers);

                            response.restful = value;
                            return response;
                        }, error).then;

                        return value;
                    };


                    Restful.prototype['$' + name] = function(a1, a2, a3, a4) {
                        var params = extractParams(this),
                            resources = this.$resources,
                            success = noop,
                            error;

                        switch(arguments.length) {
                            case 4:
                                error = a4;
                            case 3:
                                success = a4;
                            case 2:
                                if (isFunction(a2)) {
                                    if (isFunction(a1)) {
                                        success = a1;
                                        error = a2;
                                    } else {
                                        success = a2;
                                    }
                                } else {
                                    resources = a2;
                                }
                            case 1:
                                if (isFunction(a1)) success = a1;
                                else if (isArray(a1)) resources = a1;
                                else params = a1;
                                break;
                            case 0: break;
                            default:
                                throw "Expected between 0-4 arguments [params, resources, success, error], got " + arguments.length + " arguments.";
                        }
                        var data = hasBody ? this : undefined;
                        Restful[name].call(this, params, data, resources, success, error);
                    };
                });

                Restful.bind = function(additionalParamDefaults){
                    return RestfulFactory(url, extend({}, opts, additionalParamDefaults));
                };

                return Restful;
            };

            RestfulFactory.$defaultActions = {
                'get':      {method:'GET'},
                'query':    {method:'GET', isArray:true},
                'create':   {method:'POST'},
                'update':   {method:'PUT'},
                'destroy':  {method:'DELETE'}
            };

            RestfulFactory.$baseURL = '';

            return RestfulFactory;
        }]);
}());