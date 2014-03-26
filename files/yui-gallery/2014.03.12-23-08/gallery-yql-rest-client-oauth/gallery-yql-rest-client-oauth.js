YUI.add('gallery-yql-rest-client-oauth', function(Y) {

/**
 * This module is a REST client supporting OAuth signatures.
 * @module gallery-yql-rest-client-oauth
 */

/**
 * @class YQLRESTClient
 * @static
 */

/**
 * Sends a REST request.
 * @method request
 * @param {Object} params Request parameters object.
 * <dl>
 *     <dt>
 *         accept
 *     </dt>
 *     <dd>
 *         Specifies the type of content to send in the response using the
 *         Accept HTTP header.  This tells YQL what kind of data format you want
 *         returned, as well as how to parse it.
 *     </dd>
 *     <dt>
 *         content
 *     </dt>
 *     <dd>
 *         The body content of a POST or PUT request.  This can be an object or
 *         a string.  If an object is used, contentType is assumed to be
 *         application/x-www-form-urlencoded.
 *     </dd>
 *     <dt>
 *         contentType
 *     </dt>
 *     <dd>
 *         Specifies the content-type of the body content of a POST or PUT
 *         request.
 *     </dd>
 *     <dt>
 *         fallbackCharsets
 *     </dt>
 *     <dd>
 *         Overrides the list of fallback character sets, which is set to
 *         "utf-8, iso-8859-1" by default, for decoding the returned response.
 *         YQL attempts to decode the response using the character sets listed
 *         here when the response either does not specify the character set or
 *         specifies an incorrect character set that results in a failed
 *         decoding.  This value may be an array of strings or one string with
 *         comma separated values.
 *     </dd>
 *     <dt>
 *         forceCharset
 *     </dt>
 *     <dd>
 *         Forces YQL to use the character set specified. Using this overrides
 *         both the character set specified by the response and the fallback
 *         character sets. 
 *     </dd>
 *     <dt>
 *         headers
 *     </dt>
 *     <dd>
 *         Adds HTTP headers to the request.
 *     </dd>
 *     <dt>
 *         jsonCompat
 *     </dt>
 *     <dd>
 *         Set this value to 'new' to get "lossless" JSON when making a REST
 *         call to a Web service.  jsonCompat: 'new' must also be set in the
 *         yqlParams object.
 *     </dd>
 *     <dt>
 *         method
 *     </dt>
 *     <dd>
 *         The HTTP method to use.  Must be one of 'DELETE', 'GET', 'HEAD',
 *         'POST' or 'PUT'.
 *     </dd>
 *     <dt>
 *         oAuth
 *     </dt>
 *     <dd>
 *         oAuth is an object with the following members:
 *         <dl>
 *             <dt>
 *                 consumer
 *             </dt>
 *             <dd>
 *                 an object with two members: key and secret
 *             </dd>
 *             <dt>
 *                 signatureMethod
 *             </dt>
 *             <dd>
 *                 must be either 'HMAC-SHA1' or 'PLAINTEXT'
 *             </dd>
 *             <dt>
 *                 token
 *             </dt>
 *             <dd>
 *                 an optional object with three optional members: key,
 *                 verifier, and secret.
 *             </dd>
 *         </dl>
 *     </dd>
 *     <dt>
 *         query
 *     </dt>
 *     <dd>
 *         Query parameters to add to the request.
 *     </dd>
 *     <dt>
 *         timeout
 *     </dt>
 *     <dd>
 *         Specifies the request timeout in milliseconds. This is useful when
 *         you want to cancel requests that take longer than expected. 
 *     </dd>
 *     <dt>
 *         url
 *     </dt>
 *     <dd>
 *         Provides a URL endpoint to query.  The url scheme and host must be
 *         lower case.  If you are using the default port, there must not be a
 *         port specified in the url.  Querystring parameters must be defined in
 *         the query member and not part of the url string.
 *     </dd>
 * </dl>
 * @param {Function} callbackFunction The response object is the only parameter.
 * @param {Object} yqlParams (optional) Passes through to Y.YQL.
 * @param {Object} yqlOpts (optional) Passes through to Y.YQL.
 */

(function (Y) {
    'use strict';
    
    var _do = Y.Do,
        _DoPrevent = _do.Prevent,
        _yqlRestClient = Y.YQLRESTClient,
    
        _buildAuthorizationHeader,
        _each = Y.each,
        _encode,
        _floor = Math.floor,
        _hmacSha1_b64 = Y.YQLCrypto.hmacSha1_b64,
        _map = Y.Array.map,
        _normalizeParameters,
        _now = Y.Lang.now,
        _random = Math.random,
        _randomString,
        _request = _yqlRestClient.request;
    
    _do.before(function (params, callbackFunction, yqlParams, yqlOpts) {
        params = params || {};
        
        var oAuth = params.oAuth,
            oAuthConsumer,
            oAuthParams = {},
            oAuthSignatureMethod,
            oAuthToken,
            
            buildSecret,
            setAuthorizationHeader;
        
        if (!oAuth) {
            return;
        }
        
        buildSecret = function () {
            return _encode(oAuthConsumer.secret) + '&' + _encode(oAuthToken.secret);
        };
        
        setAuthorizationHeader = function (oAuthSignature) {
            oAuthParams.oauth_signature = oAuthSignature;
            params.headers = params.headers || {};
            params.headers.Authorization = _buildAuthorizationHeader(oAuthParams);
        };
        
        oAuthConsumer = oAuth.consumer || {};
        oAuthParams.oauth_consumer_key = oAuthConsumer.key || '';
        oAuthSignatureMethod = oAuth.signatureMethod;
        oAuthParams.oauth_signature_method = oAuthSignatureMethod;
        oAuthToken = oAuth.token || {};
        oAuthParams.oauth_token = oAuthToken.key || '';
        
        if (oAuthToken.verifier) {
            oAuthParams.oauth_verifier = oAuthToken.verifier;
        }
        
        oAuthParams.oauth_version = '1.0';
        
        switch (oAuthSignatureMethod) {
            case 'HMAC-SHA1':
                oAuthParams.oauth_nonce = _randomString();
                oAuthParams.oauth_timestamp = _floor(_now() / 1000);
                _hmacSha1_b64([
                    _encode(params.method.toUpperCase()),
                    // url scheme and host must be lowercase.
                    // default port numbers must not be included.
                    _encode(params.url),
                    _encode(_normalizeParameters(params.content, oAuthParams, params.query))
                ].join('&'), buildSecret(), function (oAuthSignature) {
                    setAuthorizationHeader(oAuthSignature);
                    _request(params, callbackFunction, yqlParams, yqlOpts);
                }, null, {
                    proto: 'https'
                });
                return new _DoPrevent('asynchronous');
            case 'PLAINTEXT':
                setAuthorizationHeader(buildSecret());
                return;
            default:
                throw 'Unknown OAuth Signature Method';
        }
    }, _yqlRestClient, 'request');
    
    /**
     * Creates the OAuth Authorization Header
     * @method _buildAuthorizationHeader
     * @param {Object} oAuthParams
     * @private
     * @returns {String}
     */
    _buildAuthorizationHeader = function (oAuthParams) {
        var authorizationHeader = [];
        _each(oAuthParams, function (value, key) {
            authorizationHeader.push(_encode(key) + '="' + _encode(value));
        });
        return 'OAuth '+ authorizationHeader.join('",') + '"';
    };
    
    /**
     * Performs the more strict version of URL Encode required by OAuth.
     * @method _encode
     * @param {String} string
     * @private
     * @returns {String}
     */
    _encode = function (string) {
        if (!string) {
            return '';
        }
        
        return encodeURIComponent(string).replace(/(\!)|(\')|(\()|(\))|(\*)/g, function (character) {
            return '%' + character.charCodeAt(0).toString(16).toUpperCase();
        });
    };
    
    /**
     * Performs paramater sorting and normalization required by OAuth.
     * @method _normalizeParameters
     * @param {Object} content Parameters from POST or PUT body content
     * @param {Object} oAuthParams Parameters from OAuth
     * @param {Object} query Parameters from the query string.
     * @private
     * @returns {String}
     */
    _normalizeParameters = function (content, oAuthParams, query) {
        var params = [];
        
        _each([
            content,
            oAuthParams,
            query
        ], function (paramObject) {
            _each(paramObject, function (value, key) {
                params.push([
                    _encode(key),
                    _encode(value)
                ]);
            });
        });
        
        params.sort(function (a, b) {
            if (a[0] < b[0]) {
                return -1;
            }
            if (a[0] > b[0]) {
                return 1;
            }
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return 0;
        });
        
        params = _map(params, function (param) {
            return param.join('=');
        });
        
        return params.join('&');
    };
    
    /**
     * Generates a random string containing digits and upper-case letters.
     * @method _randomString
     * @private
     * @returns {String}
     */
    _randomString = function () {
        return _random().toString(32).substr(2);
    };
}(Y));


}, 'gallery-2012.06.20-20-07' ,{requires:['array-extras', 'event-custom-base', 'gallery-yql-crypto', 'gallery-yql-rest-client'], skinnable:false});
