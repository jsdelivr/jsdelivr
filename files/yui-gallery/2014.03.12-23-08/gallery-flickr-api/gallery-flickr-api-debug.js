YUI.add('gallery-flickr-api', function(Y) {

/*
*
* Flickr API YUI3 Module
* Module for simplified calling Flickr API methods using YUI3.
*
* http://code.flickr.com
*
*/

/*
* Create Namespace for Transaction Storage
*/
YUI.namespace('flickrAPITransactions');

/*
* Private Properties
*/
var default_uri    = 'http://api.flickr.com/services/rest/',
  constant_params  = {format:'json',clientType:'yui-3-flickrapi-module'},
  callback_prefix  = 'flapicb',
  TRANS            = YUI.flickrAPITransactions,

  onFailure    = function() {
    return true;
  },
  onProgress     = function() {
    return true;
  },
  onTimeout    = function() {
    return true;
  },
  
  com = {
    last_response_id : 0,
    id_map       : {},
    response_map   : {},
    setResponse    : function(id,data) {
        var f    = com;

        f.response_map[id]=data;

        return f.response_map[id];
    },
    setId      : function( yui_id, flickr_id ) {
        var f    = com,
          new_id = flickr_id;

        f.id_map[yui_id] = new_id;

        f.last_response_id = new_id;

        return new_id;
    }
  },

  serializeObject = function(o) {
    var string_out = '';
    for (var i in o) {
        if(o.hasOwnProperty(i)) {
            string_out += i + '=' + o[i] + '&';
        }
    }
    return string_out.substr(0, string_out.length - 1);
  },
  formatCallbackArgs = function( fCallback, oArgs, isSuccess, isSetRequest){
    var f = com, data, args;
    
    if(isSetRequest) {
        try {
            data = Y.JSON.parse(oArgs[1].responseText);
        } catch (ex) {
            Y.log('invalid JSON','error','flickrAPI');
        }
        args = [{params:oArgs[2].params,data:data}].concat(oArgs);
    } else {
        data = (f.response_map[f.id_map[oArgs[0].tId]]) ? f.response_map[f.id_map[oArgs[0].tId]][0] : null;
        args = [{params:oArgs[0].data,data:data}].concat(oArgs);
    }
    
    if(data) {
    
        if(data.stat === 'ok') { //Flickr API is happy
            return fCallback.apply(Y,args);
        } else { //Flickr API is sad
            Y.log(data.message,'error','flickrAPI');
            this.failure.apply(Y,args);
        }
        
    } else {
        this.failure.apply(Y,args);
        
    }
  },
  _get_request = function(uri,params,yui_config) {
        var flickr_response_id = com.last_response_id+1,
          yui_request_id   = Y.Get.script(
            uri + '?' + serializeObject(params) + '&' + 'jsoncallback=YUI.flickrAPITransactions.' + callback_prefix + flickr_response_id + '&' + 'cachebust=' + (new Date()).getTime(),
            yui_config
          );
        
        //Set ids to map
        com.setId(yui_request_id.tId, flickr_response_id);
        
        //Create function
        TRANS[callback_prefix+flickr_response_id] = function(server_arg) {
            var ok = com.setResponse(flickr_response_id,arguments);
            
            if(ok) {
                Y.later(1000,Y,function(){delete TRANS[callback_prefix+flickr_response_id];});
            }
        };
        return yui_request_id;
  },
  _post_request = function(uri,params,yui_config) {
    Y.use('io',function(Y) {
        Y.io(uri, {
            method    : 'POST',
            data    : serializeObject(params),
            timeout   : 30000,
            on      : yui_config,
            'arguments' : {params:params}
        });
    });
  };

Y.flickrAPI = {
    /*
    * Public Methods
    */
    callMethod : function(sMethod, oRequest, oCallback, oYUIGetConf) {
        
        oYUIGetConf  = oYUIGetConf || {};
        oYUIPOSTConf = oYUIGetConf || {};
        oRequest   = oRequest  || {};
        
        var uri = default_uri;
        
        // Merge Local and Global Configs (Local Wins)
        oRequest  = Y.merge(Y.config.flickrAPI, oRequest);
        
        // Get URI
        if(oRequest.flickr_api_uri) {
            uri = oRequest.flickr_api_uri;
            delete oRequest.flickr_api_uri;
        }

        Y.Object.each(oRequest, function(val, key, obj) {
            obj[key] = encodeURIComponent(val);
        });
        
        // Allow method to be filled out in a more obvious place in the interface
        oRequest.method = sMethod;
        
        //Format callback object
        if( Y.Lang.isFunction(oCallback) ) {
            oCallback = { 
                success  : oCallback,
                failure  : onFailure,
                progress : onProgress,
                timeout  : onTimeout
            };
        }
        
        //Merge callback objects
        if( Y.Lang.isObject(oCallback) ) {
            oYUIGetConf = Y.merge(
                oYUIGetConf, {
                    onSuccess  : function() {
                        Y.fire('flickrAPI:success');
                        return formatCallbackArgs.apply( oCallback, [oCallback.success, arguments, 1 /* This value means success! Yay! */] );
                    },
                    onFailure  : function() {
                        if(com.response_map[com.id_map[arguments[0].tId]] !== null){ //null is set if the data was supressed by the module instead of a failure. This otherwise be an object or undefined.
                            Y.log('Your request (ID:'+arguments[0].tId+') has failed.','error','flickrAPI');
                            Y.fire('flickrAPI:failure');
                            return formatCallbackArgs.apply( oCallback, [oCallback.failure, arguments, 0 /* This value means fail! Boo! */] );
                        }
                    },
                    onProgress : function() {
                        Y.fire('flickrAPI:progress');
                        return formatCallbackArgs.apply( oCallback, [oCallback.progress, arguments, null /* This value means nothing since the request has not completed or timed out! MEh! */] );
                    },
                    onTimeout  : function() {
                        Y.log('Your request (ID:'+arguments[0].tId+') has timed out','error','flickrAPI');
                        
                        //Over-ride the callback function and let the implementer know whats up
                        TRANS[callback_prefix + com.id_map[arguments[0].tId]] = function(){Y.log('A response callback was fired but suppressed because of a timeout enforced by configuration.','warn','flickrAPI');};
                        
                        //Set response map property to null so that error event will know not to fire. We don't want this to look like an error
                        com.response_map[com.id_map[arguments[0].tId]] = null;
                        
                        //Stop the YUI Get process
                        Y.Get.abort(arguments[0].tId);
                        
                        //Call the configured callback function
                        Y.fire('flickrAPI:timeout');
                        return formatCallbackArgs.apply( oCallback, [oCallback.timeout, arguments, 0 /* This value means fail! Boo! */] );
                    }
                }
            );
            
            oYUIPOSTConf = Y.merge(
                oYUIPOSTConf, {
                    success  : function() {
                        Y.fire('flickrAPI:success');
                        return formatCallbackArgs.apply( oCallback, [oCallback.success, arguments, 1 /* This value means success! Yay! */, 1] );
                    },
                    failure  : function() {
                        Y.log('Your request (ID:'+arguments[0].tId+') has failed.','error','flickrAPI');
                        Y.fire('flickrAPI:failure');
                        return formatCallbackArgs.apply( oCallback, [oCallback.failure, arguments, 0 /* This value means fail! Boo! */, 1] );
                    },
                    timeout  : function() {
                        Y.log('Your request (ID:'+arguments[0].tId+') has timed out','error','flickrAPI');

                        //Call the configured callback function
                        Y.fire('flickrAPI:timeout');
                        return formatCallbackArgs.apply( oCallback, [oCallback.timeout, arguments, 0 /* This value means fail! Boo! */, 1] );
                    }
                }
            );
        }
        
        oYUIGetConf.scope=Y;
        
        var url_param=Y.merge(
            oYUIGetConf.data,
            constant_params,
            oRequest
          );
        
        oYUIGetConf.data = url_param;
        
        /*
        * Decide if this is a get or post request. A secondary load will pull in additional 
        * dependancies if this is a post
        */
        if (/(?:add|create|delete|edit|mute|post|record|remove|set|submit|unmute|move|sort|hide|block|unblock|insert)[a-zA-Z]*$/.test(url_param.method)) {
            url_param.nojsoncallback=1;
            return _post_request(uri,url_param,oYUIPOSTConf);
        } else {
            return _get_request(uri,url_param,oYUIGetConf);
        }
    }
    
};


}, 'gallery-2011.02.16-20-31' ,{requires:['event','dump','io-xdr','substitute','json-parse']});
