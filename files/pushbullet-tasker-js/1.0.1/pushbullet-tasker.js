/**
 * @license
 * pushbullet-tasker.js
 *
 * Versión: 1.0.0
 * Date: 2016-07-22
 *
 * © 2016 Cristian Moncho Ivorra
 * @license https://www.gnu.org/licenses/lgpl-3.0.txt
 */

if ( typeof tk === 'undefined' ) {
    // Enable testing from web browsers
    var tk = {
        local: function () {},
        global: function () {},
        flashLong: console.log,
    };
}

var PB = (function(tk, window, undefined) {
    'use strict';

    var API = {},
        BASE_URL = 'https://api.pushbullet.com/v2/',
        PUSH_URL = BASE_URL + 'pushes',
        UPLOAD_REQUEST_URL = BASE_URL + 'upload-request';

    var HttpStatus = {
        OK: 200,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
    };

    API.debug = getenv('pb_debug', false);
    API.token = getenv('pb_token', null);

    /**
     * Sends a Push Request to Pushbullet.
     *
     * @param {String} type - Type of the push, one of "note", "file", "link".
     * @param {Object} data - Push parameters.
     * @returns {String} The request's response.
     * @throws {Error} The requests has failed.
     */
    function push(type, data) {
        var req = buildRequest('POST', PUSH_URL, {
            'Access-Token': API.token,
        });

        data.type = type;
        req.send(buildFormData(data));

        if ( API.debug ) {
            tk.flashLong(req.responseText);
        }

        if ( req.status !== HttpStatus.OK ) {
            throw new window.Error('Unable to push data: ' + req.status);
        }

        return req.responseText;
    }

    /**
     * Request authorization to upload a file.
     *
     * @param {String} file_name - The name of the file you want to upload.
     * @param {String} file_type - The MIME type of the file.
     * @returns {Object} The upload parameters.
     * @throws {Error} The requests has failed.
     */
    function uploadRequest(file_name, file_type) {
        var req = buildRequest('POST', UPLOAD_REQUEST_URL, {
            'Access-Token': API.token,
        });

        req.send(buildFormData({
            file_name: file_name,
            file_type: file_type,
        }));

        if ( API.debug ) {
            tk.flashLong(req.responseText);
        }

        if ( req.status !== HttpStatus.OK ) {
            throw new window.Error('Unable to request upload URL: ' + req.status);
        }

        return JSON.parse(req.responseText);
    }

    /**
     * Read local file as Blob.
     *
     * @param {String} path - Absolute path.
     * @returns {Blob} File as Blob.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/
     *          XMLHttpRequest/Using_XMLHttpRequest#Handling_binary_data}
     */
    function readFileAsBlob(path) {
        var req = buildRequest('GET', path);
        req.overrideMimeType('text/plain; charset=x-user-defined');
        req.send();

        var res = req.responseText;
        var bytes = new window.Uint8Array(res.length);

        for ( var i = 0, len = res.length; i < len; i++ ) {
            bytes[i] = res.charCodeAt(i);
        }

        return new window.Blob([bytes]);
    }

    /**
     * Upload file to the uploadRequest's given "upload_url".
     *
     * @param {String} file_name - The name of the file you want to upload.
     * @param {String} file_type - The MIME type of the file. 
     * @param {String} file_path - The file absolute path.
     * @returns {String} The public URL pointing to the uploaded file.
     * @throws {Error} The requests has failed.
     */
    function uploadFile(file_name, file_type, file_path) {
        var upload = uploadRequest(file_name, file_type);
        var req = buildRequest('POST', upload.upload_url);

        req.send(buildFormData({
            file: readFileAsBlob(file_path),
        }));

        if ( req.status !== HttpStatus.NO_CONTENT ) {
            throw new window.Error('Unable to upload file: ' + req.status);
        }

        return upload.file_url;
    }

    /**
     * Converts Object to FormData.
     *
     * @param {Object} data - Data to be converted.
     * @returns {FormData} FormData built from the given "data".
     */
    function buildFormData(data) {
        var formData = new window.FormData();

        for ( var key in data ) {
            if ( data.hasOwnProperty(key) ) {
                formData.append(key, data[key]);
            }
        }

        return formData;
    }

    /**
     * Creates a new XMLHttpRequest.
     *
     * @param {String} method - Request method, "GET" or "POST".
     * @param {String} url - Requested URL.
     * @param {Object} headers - Object containing the request headers.
     * @returns {XMLHttpRequest} Initialized request.
     */
    function buildRequest(method, url, headers) {
        var req = new window.XMLHttpRequest();
        req.open(method.toUpperCase(), url, false); /* ensure sync request */
        for ( var key in (headers || {}) ) {
            if ( headers.hasOwnProperty(key) ) {
                req.setRequestHeader(key, headers[key]);
            }
        }
        return req;
    }

    /**
     * Gets values from the current environment. JS-defined variables will
     * have the highest priority, followed by local Tasker variables (e.g.:
     * "pb_token") and, lastly, global Tasker variables (e.g.: "PB_TOKEN").
     *
     * @param {String} varName - Variable name.
     * @param {String} defVal - Default variable value, if not defined.
     * @returns Requested variable value, or "defVal" if not defined.
     * @throws {Error} Variable not defined and no default value given.
     */
    function getenv(varName, defVal) {
        var val;

        // Stops at the first non-undefined value
        [window[varName], tk.local(varName.toLowerCase()),
         tk.global(varName.toUpperCase()), defVal].some(function (el, i) {
            return typeof (val = el) !== 'undefined';
        });

        if ( typeof val === 'undefined' ) {
            throw new window.Error('Undefined variable "' + varName + '"!');
        }

        return val;
    }

    /**
     * Push Note.
     *
     * @param {Object} options - Set/override the Note parameters.
     * @returns Request's response.
     */
    API.pushNote = function (options) {
        options = options || {};
        return push('note', {
            title: options.title || getenv('pb_title', ''),
            body: options.body || getenv('pb_body', ''),
        });
    };

    /**
     * Push Link.
     *
     * @param {Object} options - Set/override the Link parameters.
     * @returns Request's response.
     */
    API.pushLink = function (options) {
        options = options || {};
        return push('link', {
            title: options.title || getenv('pb_title', ''),
            body: options.body || getenv('pb_body', ''),
            url: options.url || getenv('pb_url'),
        });
    };

    /**
     * Push File.
     *
     * @param {Object} options - Set/override the File parameters.
     * @returns Request's response.
     */
    API.pushFile = function (options) {
        options = options || {};
        var file_name = options.file_name || getenv('pb_file_name');
        var file_path = options.file_path || getenv('pb_file_path');
        var file_type = options.file_type || getenv('pb_file_type');
        return push('file', {
            title: options.title || getenv('pb_title', ''),
            body: options.body || getenv('pb_body', ''),
            file_name: file_name,
            file_type: file_type,
            file_url: uploadFile(file_name, file_type, file_path),
        });
    };

    // Auto-push
    var type = getenv('pb_type', null);
    if ( type ) {
        ({
            note: API.pushNote,
            link: API.pushLink,
            file: API.pushFile
        }[type] || function unknownType() {
            throw Error("Unknown type: '" + type + "'!");
        })();
    }

    return API;
})(tk, this);
