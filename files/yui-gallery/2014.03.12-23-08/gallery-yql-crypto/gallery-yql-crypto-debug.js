YUI.add('gallery-yql-crypto', function(Y) {

/**
 * This module provides convenient client side access to YQL's crypto functions.
 * @module gallery-yql-crypto
 */

(function (Y) {
    'use strict';
    
    var _base64Decode = Y.Base64.decode,
        _execute = Y.YQL.execute,
        _getResult = _execute.getResult,
        _hash,
        _hmac,
        _bind = Y.bind,
        _toHex;
    
    _hash = function (hash, b64, string, callbackFunction, params, opts) {
        _execute('response.object = y.crypto.encode' + hash + '("' + String(string || '').replace(/"/g, '\\"') + '");', function (result) {
            if (b64) {
                callbackFunction(_getResult(result));
            } else {
                callbackFunction(_toHex(_base64Decode(_getResult(result))));
            }
        }, params, opts);
    };
    
    _hmac = function (hash, b64, string, secret, callbackFunction, params, opts) {
        _execute('response.object = y.crypto.encode' + hash + '("' + String(secret || '').replace(/"/g, '\\"') + '", "' + String(string || '').replace(/"/g, '\\"') + '");', function (result) {
            if (b64) {
                callbackFunction(_getResult(result));
            } else {
                callbackFunction(_toHex(_base64Decode(_getResult(result))));
            }
        }, params, opts);
    };
    
    _toHex = function (string) {
        var hex = '',
            i,
            length,
            value;

        for (i = 0, length = string.length; i < length; i += 1) {
            value = string.charCodeAt(i).toString(16);

            if (value.length < 2) {
                value = '0' + value;
            }

            hex += value;
        }
        
        return hex;
    };
    
    /**
     * @class YQLCrypto
     * @static
     */
    Y.YQLCrypto = {
        /**
         * This method wraps the YQL execute data table which executes inline
         * Javascript on the YQL server.  YQL Server side Javascript
         * documentation is here:
         * http://developer.yahoo.com/yql/guide/yql-javascript-objects.html
         * @method execute
         * @param {String} code Javascript code to execute on the YQL server. 
         * @param {Function} callbackFunction Passes through to Y.YQL.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        execute: _execute,
        /**
         * Generates a sha1 hash-based message authentication code.
         * The result is expressed as a hex value.
         * @method hmacSha1
         * @param {String} string The message to hash.
         * @param {String} secret The secret key.
         * @param {Function} callbackFunction  The result value is the only
         * parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        hmacSha1: _bind(_hmac, null, 'HmacSHA1', false),
        /**
         * Generates a sha1 hash-based message authentication code.
         * The result is expressed as a base 64 encoded value.
         * @method hmacSha1_b64
         * @param {String} string The message to hash.
         * @param {String} secret The secret key.
         * @param {Function} callbackFunction  The result value is the only
         * parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        hmacSha1_b64: _bind(_hmac, null, 'HmacSHA1', true),
        /**
         * Generates a sha256 hash-based message authentication code.
         * The result is expressed as a hex value.
         * @method hmacSha256
         * @param {String} string The message to hash.
         * @param {String} secret The secret key.
         * @param {Function} callbackFunction  The result value is the only
         * parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        hmacSha256: _bind(_hmac, null, 'HmacSHA256', false),
        /**
         * Generates a sha256 hash-based message authentication code.
         * The result is expressed as a base 64 encoded value.
         * @method hmacSha256_b64
         * @param {String} string The message to hash.
         * @param {String} secret The secret key.
         * @param {Function} callbackFunction  The result value is the only
         * parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        hmacSha256_b64: _bind(_hmac, null, 'HmacSHA256', true),
        /**
         * Generates an md5 hash.
         * The result is expressed as a hex value.
         * @method md5
         * @param {String} string The message to hash.
         * @param {Function} callbackFunction  The result value is the only
         * parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        md5: _bind(_hash, null, 'Md5', false),
        /**
         * Generates an md5 hash.
         * The result is expressed as a base 64 encoded value.
         * @method md5_b64
         * @param {String} string The message to hash.
         * @param {Function} callbackFunction  The result value is the only
         * parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        md5_b64: _bind(_hash, null, 'Md5', true),
        /**
         * Generates a sha1 hash.
         * The result is expressed as a hex value.
         * @method sha1
         * @param {String} string The message to hash.
         * @param {Function} callbackFunction  The result value is the only
         * parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        sha1: _bind(_hash, null, 'Sha', false),
        /**
         * Generates a sha1 hash.
         * The result is expressed as a base 64 encoded value.
         * @method sha1_b64
         * @param {String} string The message to hash.
         * @param {Function} callbackFunction  The result value is the only
         * parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        sha1_b64: _bind(_hash, null, 'Sha', true),
        /**
         * Generates a universally unique identifier.
         * @method uuid
         * @param {Function} callbackFunction  The result value is the only
         * parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        uuid: function (callbackFunction, params, opts) {
            _execute('response.object = y.crypto.uuid();', function (result) {
                callbackFunction(_getResult(result));
            }, params, opts);
        }
    };
}(Y));


}, 'gallery-2012.06.20-20-07' ,{requires:['gallery-base64', 'gallery-yql-execute'], skinnable:false});
