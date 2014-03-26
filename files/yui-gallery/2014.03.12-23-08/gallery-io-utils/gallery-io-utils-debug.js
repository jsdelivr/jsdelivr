YUI.add('gallery-io-utils', function (Y, NAME) {

/**
Promise based methods for performing IO requests.

@module gallery-io-utils
**/

/**
Method for initiating an ajax call.

@method xhr
@for io
@static
@param {String} uri Qualified path to transaction resource.
@param {Object} [options] Configuration object for the transaction.
@param {String} [options.method=GET] HTTP method verb (e.g., GET or POST).
@param {Object|String} [options.data] This is the name-value string that will be
    sent as the transaction data. If the request is HTTP GET, the data become
    part of querystring. If HTTP POST, the data are sent in the message body.
@param {Object} [options.form] Form serialization configuration object. Its properties
    are:
    * `id` node object or id of HTML form
    * `useDisabled` true to also serialize disabled form field values (defaults
        to false)
@param {Object} [options.headers] Object map of transaction headers to send to
    the server. The object keys are the header names and the values are the
    header values.
@param {Number} [options.timeout] Millisecond threshold for the transaction
    before being automatically aborted.
@return {Promise} Promise for the response object. Contains an extra
    `abort()` method to cancel the request.
**/
Y.io.xhr = function (uri, options) {
    options = options || {};

    return new Y.Promise(function (resolve, reject) {
        var io = Y.io(uri, {
            // reference options directly to avoid insertion of unwanted options
            // into Y.io()
            method: options.method,
            data: options.data,
            headers: options.headers,
            form: options.form,
            timeout: options.timeout,
            on: {
                success: function (id, response) {
                    resolve(response);
                },
                failure: function (id, response) {
                    reject(response);
                }
            }
        });

        // expose abort. It is not a prototype function so it's ok to copy it
        this.abort = io.abort;
    });
};

/**
Initiaites an AJAX call with the HTTP method GET.

@method get
@for io
@static
@param {String} uri Qualified path to transaction resource.
@param {Object} [options] Same configuration options as Y.io.xhr()
@return {Promise} Promise for the response object. Contains an extra
    `abort()` method to cancel the request.
**/
/**
Initiaites an AJAX call with the HTTP method POST.

@method post
@for io
@static
@param {String} uri Qualified path to transaction resource.
@param {Object} [options] Same configuration options as Y.io.xhr()
@return {Promise} Promise for the response object. Contains an extra
    `abort()` method to cancel the request.
**/
/**
Initiaites an AJAX call with the HTTP method PUT.

@method put
@for io
@static
@param {String} uri Qualified path to transaction resource.
@param {Object} [options] Same configuration options as Y.io.xhr()
@return {Promise} Promise for the response object. Contains an extra
    `abort()` method to cancel the request.
**/
/**
Initiaites an AJAX call with the HTTP method DELETE.

@method delete
@for io
@static
@param {String} uri Qualified path to transaction resource.
@param {Object} [options] Same configuration options as Y.io.xhr()
@return {Promise} Promise for the response object. Contains an extra
    `abort()` method to cancel the request.
**/
Y.Array.each(['get', 'post', 'put', 'delete'], function (method) {
    Y.io[method] = function (uri, options) {
        options = options || {};
        options.method = method.toUpperCase();

        return Y.io.xhr(uri, options);
    };
});

/**
Alias for Y.io.delete()

@method DELETE
@for io
@static
@deprecated
**/
/**
Alias for Y.io.delete()

@method del
@for io
@static
**/
Y.io.DELETE = Y.io.del = Y.io['delete'];

/**
Initiaites an AJAX call with the HTTP method POST and sends the data contained
in the specified form element.

@method postForm
@for io
@static
@param {String} uri Qualified path to transaction resource.
@param {String|Node} selector CSS selector or Y.Node instance pointing to a form
    element.
@param {Object} [options] Same configuration options as Y.io.xhr()
@return {Promise} Promise for the response object. Contains an extra
    `abort()` method to cancel the request.
**/
Y.io.postForm = function (uri, selector, options) {
    options = options || {};

    options.method = 'POST';
    options.form = {
        id: Y.one(selector)
    };

    return Y.io.xhr(uri, options);
};

/**
Inserts one or more scripts tags.

@method script
@for io
@static
@param {String|String[]} uri Path or array of paths to the scripts.
@param {Object} [options] Configuration options
@return {Promise} Promise for the response object.
**/
/**
Inserts one or more CSS files into the page.

@method css
@for io
@static
@param {String|String[]} uri Path or array of paths to the CSS files.
@param {Object} [options] Configuration options
@return {Promise} Promise for the response object.
**/
Y.Array.each(['script', 'css'], function (method) {
    Y.io[method] = function (uri, options) {
        return this._transaction(function (resolve, reject) {
            Y.Get[method](uri, options, function (err, transaction) {
                if (err) {
                    reject(err);
                } else {
                    resolve(transaction);
                }
            });
        });
    };
});

/**
Performs a JSONP request. Requires the JSONP module.

@method jsonp
@for io
@static
@param {String} uri The url of the JSONP service with the {callback}
    placeholder where the callback function name typically goes
@param {Object} [options] Configuration options for the request
@param {Number} [options.timeout] Millisecond threshold for the transaction
    before being automatically aborted
@param {Function} [options.format] Preprocessor function to stitch together
    the supplied URL (first argument), the proxy function name (internally
    generated), and any additional arguments passed to JSONPRequest#send()
@return {Promise} Promise for the response object.
**/
Y.io.jsonp = function (uri, options) {
    options = options || {};

    return new Y.Promise(function (resolve, reject) {
        var config = {
            on: {
                success: function (data) {
                    resolve(data);
                },
                failure: reject,
                timeout: reject
            }
        };
        if (options.timeout) {
            config.timeout = options.timeout;
        }
        if (options.format) {
            config.format = options.format;
        }
        Y.jsonp(uri, config);
    });
};

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
    var promise = Y.io.xhr(uri, options);

    return Y.mix(promise.then(function (xhr) {
        return Y.JSON.parse(xhr.responseText);
    }), {
        // pass around the abort function
        abort: promise.abort
    });
};

/**
Performs an AJAX request with the GET HTTP method and parses the response as
JSON notation. Requires the JSON module.

@method getJSON
@for io
@static
@param {String} uri Qualified path to transaction resource.
@param {Object} [options] Same configuration options as Y.io.xhr()
@return {Promise} Promise for the response object. Contains an extra
    `abort()` method to cancel the request.
**/
/**
Performs an AJAX request with the DELETE HTTP method and parses the response as
JSON notation. Requires the JSON module.

@method deleteJSON
@for io
@static
@param {String} uri Qualified path to transaction resource.
@param {Object} [options] Same configuration options as Y.io.xhr()
@return {Promise} Promise for the response object. Contains an extra
    `abort()` method to cancel the request.
**/
Y.Array.each(['get', 'delete'], function (verb) {
    Y.io[verb + 'JSON'] = function (uri, config) {
        config = config || {};
        config.method = verb.toUpperCase();

        return Y.io.json(uri, config);
    };
});

/**
Performs an AJAX request with the POST HTTP method and parses the response as
JSON notation. Requires the JSON module.

@method postJSON
@for io
@static
@param {String} uri Qualified path to transaction resource.
@param {Object|Promise} data Data to send encoded as JSON
@param {Object} [options] Same configuration options as Y.io.xhr()
@return {Promise} Promise for the response object. Contains an extra
    `abort()` method to cancel the request.
**/
/**
Performs an AJAX request with the PUT HTTP method and parses the response as
JSON notation. Requires the JSON module.

@method putJSON
@for io
@static
@param {String} uri Qualified path to transaction resource.
@param {Object|Promise} data Data to send encoded as JSON
@param {Object} [options] Same configuration options as Y.io.xhr()
@return {Promise} Promise for the response object. Contains an extra
    `abort()` method to cancel the request.
**/
Y.Array.each(['post', 'put'], function (verb) {
    Y.io[verb + 'JSON'] = function (uri, data, config) {
        config = config || {};
        config.method = verb.toUpperCase();

        return Y.when(data, function (obj) {
            config.data = Y.JSON.stringify(obj);
            return Y.io.json(uri, config);
        });
    };
});


}, 'gallery-2013.05.29-23-38', {"requires": ["io-base", "promise"]});
