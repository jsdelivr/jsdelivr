YUI.add('gallery-itsautils', function (Y, NAME) {

'use strict';
/**
 * The ItsaUtils module.
 *
 * @module gallery-itsautils
 */

var DATEPATTERN = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/,
    REVIVER = function(key, value) {
        return DATEPATTERN.test(value) ? new Date(value) : value;
    },
    MIME_JSON = 'application/json';

/**
 * Parse a JSON string, returning the native JavaScript representation.
 *
 * @param s {string} JSON string data
 * @return {MIXED} the native JavaScript representation of the JSON string
 * @throws SyntaxError
 * @method parse
 * @static
 */
// JavaScript implementation in lieu of native browser support.  Based on
// the json2.js library from http://json.org
Y.JSON.fullparse = function (s) {
    try {
        return this.parse(s, REVIVER);
    }
    catch(err) {
        throw err;
    }
};

// now overrule Y.io.json (which comes from gallery-io-utils) and pass in the REVIVER

/**
Performs an AJAX request and parses the response as JSON notation.
Requires the JSON module.

@method json
@for io
@static
@param {String} uri Qualified path to transaction resource.
@param {Object} [options] Same configuration options as Y.io.xhr()
@return {Promise} Promise for the response object. Contains an extra
    `abort()` method to cancel the request.
**/
Y.io.json = function (uri, options) {
    options = options || {};

    // Force the use of the correct headers
    // Since a JSON response is expected, ask for it with the Accept header
    if (!options.headers) {
        options.headers = {};
    }
    options.headers.Accept = MIME_JSON;

    var promise = Y.io.xhr(uri, options);

    return Y.mix(promise.then(function (xhr) {
        return Y.JSON.parse(xhr.responseText, REVIVER);
    }), {
        // pass around the abort function
        abort: promise.abort
    }, true);
};

Y.JSONPRequest.prototype.send = function () {
        var self   = this,
            args   = Y.Array(arguments, 0, true),
            config = self._config,
            proxy  = self._proxy || Y.guid(),
            url;

        // TODO: support allowCache as time value
        if (config.allowCache) {
            self._proxy = proxy;
        }

        if (self._requests[proxy] === undefined) {
            self._requests[proxy] = 0;
        }
        if (self._timeouts[proxy] === undefined) {
            self._timeouts[proxy] = 0;
        }
        self._requests[proxy]++;

        Y.log('sending ' + proxy);

        args.unshift(self.url, 'YUI.Env.JSONP.' + proxy);
        url = config.format.apply(self, args);

        if (!config.on.success) {
            Y.log("No success handler defined.  Aborting JSONP request.", "warn", "jsonp");
            return self;
        }

        function wrap(fn, isTimeout) {
            return (typeof fn==='function') ?
                function (data) {
                    var execute = true,
                        counter = '_requests',
                        stringifiedData;

// ADDED BY Its Asbreuk ==========================================
// at this point, data is already is an object
// don't know when json.parse got into, we stringify and parse
// for a second time:
//================================================================
if (typeof data === 'object') {
    stringifiedData = Y.JSON.stringify(data);
    try {
        data = Y.JSON.fullparse(stringifiedData);
    }
    catch (err) {
        Y.log("Error fullparsing responsedata", "warn", "jsonp");
    }
}
//================================================================

                    //if (config.allowCache) {
                        // A lot of wrangling to make sure timeouts result in
                        // fewer success callbacks, but the proxy is properly
                        // cleaned up.
                        if (isTimeout) {
                            ++self._timeouts[proxy];
                            --self._requests[proxy];
                            Y.log(proxy + ' timed out - timeouts(' + self._timeouts[proxy] + ') requests(' + self._requests[proxy] + ')');
                        } else {
                            if (!self._requests[proxy]) {
                                execute = false;
                                counter = '_timeouts';
                            }
                            --self[counter][proxy];
                            Y.log(proxy + ' response received - timeouts(' + self._timeouts[proxy] + ') requests(' + self._requests[proxy] + ')');
                        }
                    //}

                    if (!self._requests[proxy] && !self._timeouts[proxy]) {
                        Y.log('deleting ' + proxy);
                        delete YUI.Env.JSONP[proxy];
                    }

                    if (execute) {
                        fn.apply(config.context, [data].concat(config.args));
                    }
                } :
                null;
        }

        // Temporary un-sandboxed function alias
        // TODO: queuing
        YUI.Env.JSONP[proxy] = wrap(config.on.success);

        // Y.Get transactions block each other by design, but can easily
        //  be made non-blocking by just calling execute() on the transaction.
        // https://github.com/yui/yui3/pull/393#issuecomment-11961608
        Y.Get.js(url, {
            onFailure : wrap(config.on.failure),
            onTimeout : wrap(config.on.timeout, true),
            timeout   : config.timeout,
            charset   : config.charset,
            attributes: config.attributes,
            async     : config.async
        }).execute();

        return self;
    };

}, 'gallery-2013.12.20-18-06', {"requires": ["yui-base", "json", "jsonp", "gallery-io-utils"]});
