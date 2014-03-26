YUI.add('gallery-yql-rest-client', function(Y) {

/**
 * This module is a REST client.
 * @module gallery-yql-rest-client
 */

(function (Y) {
    'use strict';
    
    var _lang = Y.Lang,
        
        _each = Y.each,
        _execute = Y.YQL.execute,
        _getResult = _execute.getResult,
        _isArray = _lang.isArray,
        _isObject = _lang.isObject,
        _quotedString,
        _stringify = Y.QueryString.stringify;
    
    /**
     * @class YQLRESTClient
     * @static
     */
    Y.YQLRESTClient = {
        /**
         * Sends a REST request.
         * @method request
         * @param {Object} params Request parameters object.
         * <dl>
         *     <dt>
         *         accept
         *     </dt>
         *     <dd>
         *         Specifies the type of content to send in the response using
         *         the Accept HTTP header.  This tells YQL what kind of data
         *         format you want returned, as well as how to parse it.
         *     </dd>
         *     <dt>
         *         content
         *     </dt>
         *     <dd>
         *         The body content of a POST or PUT request.  This can be an
         *         object or a string.  If an object is used, contentType is
         *         assumed to be application/x-www-form-urlencoded.
         *     </dd>
         *     <dt>
         *         contentType
         *     </dt>
         *     <dd>
         *         Specifies the content-type of the body content of a POST or
         *         PUT request.
         *     </dd>
         *     <dt>
         *         fallbackCharsets
         *     </dt>
         *     <dd>
         *         Overrides the list of fallback character sets, which is set
         *         to "utf-8, iso-8859-1" by default, for decoding the returned
         *         response. YQL attempts to decode the response using the
         *         character sets listed here when the response either does not
         *         specify the character set or specifies an incorrect character
         *         set that results in a failed decoding.  This value may be an
         *         array of strings or one string with comma separated values.
         *     </dd>
         *     <dt>
         *         forceCharset
         *     </dt>
         *     <dd>
         *         Forces YQL to use the character set specified. Using this
         *         overrides both the character set specified by the response
         *         and the fallback character sets. 
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
         *         Set this value to 'new' to get "lossless" JSON when making a
         *         REST call to a Web service.  jsonCompat: 'new' must also be
         *         set in the yqlParams object.
         *     </dd>
         *     <dt>
         *         matrix
         *     </dt>
         *     <dd>
         *         Adds matrix parameters to the request. 
         *     </dd>
         *     <dt>
         *         method
         *     </dt>
         *     <dd>
         *         The HTTP method to use.  Must be one of 'DELETE', 'GET',
         *         'HEAD', 'POST' or 'PUT'.
         *     </dd>
         *     <dt>
         *         paths
         *     </dt>
         *     <dd>
         *         Array of paths to append to the url.
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
         *         Specifies the request timeout in milliseconds. This is useful
         *         when you want to cancel requests that take longer than
         *         expected. 
         *     </dd>
         *     <dt>
         *         url
         *     </dt>
         *     <dd>
         *         Provides a URL endpoint to query.
         *     </dd>
         * </dl>
         * @param {Function} callbackFunction The response object is the only
         * parameter.
         * @param {Object} yqlParams (optional) Passes through to Y.YQL.
         * @param {Object} yqlOpts (optional) Passes through to Y.YQL.
         */
        request: function (params, callbackFunction, yqlParams, yqlOpts) {
            params = params || {};
            
            var accept = params.accept,
                code = [],
                content = params.content,
                contentType = params.contentType,
                fallbackCharsets = params.fallbackCharsets,
                forceCharset = params.forceCharset,
                headers = params.headers,
                jsonCompat = params.jsonCompat,
                matrix = params.matrix,
                method = params.method,
                paths = params.paths,
                query = params.query,
                timeout = params.timeout,
                url = params.url;
            
            if (!method || !url) {
                throw 'Request requires a url and a method.';
            }
            
            code.push('response.object = y.rest("' + _quotedString(params.url) + '")');
            
            if (accept) {
                code.push('accept("' + _quotedString(accept) + '")');
            }
            
            if (_isObject(content)) {
                content = _stringify(content);
                contentType = 'application/x-www-form-urlencoded';
            }
            
            if (contentType) {
                code.push('contentType("' + _quotedString(contentType) + '")');
            }
            
            if (fallbackCharsets) {
                code.push('fallbackCharset("' + _quotedString(_isArray(fallbackCharsets) ? fallbackCharsets.join(',') : fallbackCharsets) + '")');
            }
            
            if (forceCharset) {
                code.push('forceCharset("' + _quotedString(forceCharset) + '")');
            }
            
            if (headers) {
                _each(headers, function (value, key) {
                    code.push('header("' + _quotedString(key) + '", "' + _quotedString(value) + '")');
                });
            }
            
            if (jsonCompat) {
                code.push('jsonCompat("' + _quotedString(jsonCompat) + '")');
            }
            
            if (matrix) {
                _each(matrix, function (value, key) {
                    code.push('matrix("' + _quotedString(key) + '", "' + _quotedString(value) + '")');
                });
            }
            
            if (paths) {
                _each(paths, function (value) {
                    code.push('path("' + _quotedString(value) + '")');
                });
            }
            
            if (query) {
                _each(query, function (value, key) {
                    code.push('query("' + _quotedString(key) + '", "' + _quotedString(value) + '")');
                });
            }
            
            if (timeout) {
                code.push('timeout("' + _quotedString(timeout) + '")');
            }
            
            switch (method) {
                case 'delete':
                    method = 'del';
                    // fall through
                case 'get':
                case 'head':
                    code.push(method + '()');
                    break;
                case 'post':
                case 'put':
                    code.push(method + '("' + _quotedString(content) + '")');
                    break;
                default:
                    throw 'Unknown method.';
            }
            
            _execute(code.join('.') + ';', function (result) {
                callbackFunction(_getResult(result));
            }, yqlParams, yqlOpts);
        }
    };
    
    /**
     * Escapes " characters.
     * @method _quotedString
     * @param {String} string
     * @private
     * @returns {String}
     */
    _quotedString = function (string) {
        return String(string || '').replace(/"/g, '\\"');
    };
}(Y));


}, 'gallery-2012.06.20-20-07' ,{requires:['gallery-yql-execute', 'querystring-stringify'], skinnable:false});
