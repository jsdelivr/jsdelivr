YUI.add('gallery-oauth', function (Y, NAME) {

    /**
    * This module pulls in the oAuth code from googlecode and adds a couple of helper methods
    * to sign a url for standard 2-Legged oAuth
    */
    var BASE = 'http://oauth.googlecode.com/svn/code/javascript/',
        FILES = [ 'oauth', 'sha1' ], LOADED = 0;

    if (!YUI.Env.oauthLoaded) {
        Y.each(FILES, function(v) {
            var url = BASE + v + '.js';
            Y.Get.script(url, {
                onSuccess: function() {
                    LOADED++;
                    if (LOADED === FILES.length) {
                        YUI.Env.oauthLoaded = true;
                        Y.oAuth.fire();
                    }
                }
            });
        });
    }

    Y.namespace('oAuth');

    Y.oAuth = {
        fire: function() {
            Y.each(Y.oAuth._items, function(fn, k) {
                fn();
                delete Y.oAuth._items[k];
            });
        },
        ready: function(fn) {
            if (YUI.Env.oauthLoaded) {
                fn();
            } else {
                Y.oAuth._items.push(fn);
            }
        },
        _items: [],
        signURL: function(key, secret, url) {
            var accessor = {
                consumerSecret: secret,
                tokenSecret: ""
            },
            finalStr = '',
            baseStr = "",
            parameterMap = "",
            theSig = "",
            locString = "",
            item, subitem, paramList,
            message = {
                action: url,
                method: "GET",
                parameters: [
                    [ 'oauth_version', '1.0' ],
                    [ 'oauth_consumer_key', key ]
                ]
            };
         
            OAuth.setTimestampAndNonce(message);
            OAuth.SignatureMethod.sign(message, accessor);
         
            parameterMap = OAuth.getParameterMap(message);
            baseStr = OAuth.decodeForm(OAuth.SignatureMethod.getBaseString(message));           
            
            if (parameterMap.parameters) {
                Y.each(parameterMap.parameters, function(item) {
                    Y.each(item, function(subitem) {
                        if (subitem == "oauth_signature") {
                            theSig = item[1];                    
                        }
                    });
                });
            }
         
            paramList = baseStr[2][0].split("&");
            paramList.push("oauth_signature=" + encodeURIComponent(theSig));
            paramList.sort(function(a,b) {
                if (a[0] < b[0]) { return -1; }
                if (a[0] > b[0]) { return 1; }
                if (a[1] < b[1]) { return  -1; }
                if (a[1] > b[1]) { return 1; }
                return 0;
            });
            
            Y.each(paramList, function(v, k) {
                locString += paramList[k] + '&';                
            });
         
            finalStr = baseStr[1][0] + '?' + locString.slice(0,locString.length - 1);
         
            return finalStr;
        
        }
    };
    
    if (Y.YQLRequest) {
        Y.YQLRequest.prototype._send = Y.YQLRequest.prototype.send;
        Y.YQLRequest.prototype.send = function() {
            if (this._params.key && this._params.secret) {
                if (!this._opts) {
                    this._opts = {};
                }
                this._opts.key = this._params.key;
                this._opts.secret = this._params.secret;
                delete this._params.key;
                delete this._params.secret;
                if (this._params.base) {
                    this._opts.base = this._params.base;
                    delete this._params.base;
                }
                if (Y.Lang.isFunction(this._callback)) {
                    this._callback = {
                        on: {
                            success: this._callback
                        }
                    };
                }
                this._callback.format = Y.bind(function(url, proxy) {
                    var url = Y.oAuth.signURL(this._opts.key, this._opts.secret, (url + '&callback=' + proxy));
                    return url;
                }, this);
            }
            this._send();
        };
    }


}, 'gallery-2012.12.05-21-01', {"requires": ["jsonp"], "supersedes": [], "optional": ["yql"], "skinnable": false});
