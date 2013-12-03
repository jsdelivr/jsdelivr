// ==UserScript==
// @name        JSL - AJAX plugin
// @namespace   http://userscripts.org/users/23652
// @description An AJAX extension for JSL
// @include     *
// @version     1.0.21
// @grant       GM_xmlhttpRequest
// ==/UserScript==

/* CHANGELOG

1.0.21 (10/6/2013)
    - fixed bug with .clear()

1.0.2 (10/6/2013)
    - added a new option: async
        false (default) ==> synchronous, but non-freezing requests (sequential)
            waits for previous request to finish before starting a new one
        true ==> sends all requests immediately when they are added to the queue
    - fixed delay issue.
        the next request would get run on the 'onprogress' & 'onreadystatechange' events
        instead of when they actually load fully
    - added a .clear() method
        it may be called on any ajax instance like JSL.ajax(...).clear()
        it can even simply be called as JSL.ajax().clear()
        it will clear ALL requests at the moment

1.0.1 (10/3/2013)
    - fixed small bug with passing a url array
    - fixed bug not allowing HEAD requests to be recognized

1.0.0 (10/1/2013)
    - created

*/

(function (undefined) {

    'use strict'; // use strict mode in ECMAScript-5

    var queue = [],               // the request queue
        blank = function () {},   // blank function to use as default callback
        xhrInProgress = false,    // boolean to know if we should load the next request
        xhrCleared = false;       // boolean to know if the xhr has been cleared and if
                                      // we should execute any of the callbacks

    var core = {
        // object
        'hasOwnProperty' : Object.prototype.hasOwnProperty
    };

    function copyObject(o) {
        var key, value, newO = {};

        for (key in o) {
            value = o[key];

            if (core.hasOwnProperty.call(o, key) && value != null) {
                newO[key] = value;
            }
        }

        return newO;
    }

    function toDataString(o) {
        var key, value, dataString = '';

        for (key in o) {
            value = o[key];

            if (core.hasOwnProperty.call(o, key) && value != null) {
                dataString += key + '=' + encodeURIComponent(value) + '&';
            }
        }

        return dataString.slice(0, -1);
    }

    function xhr() {
        var req = queue[0], // get the object which is first in the queue
            xhrObj = {}, key;

        function handleEvents(type, resp, event) {
            var event = event || {}, newResp, context;
                req.delay = req.delay > 15 ? req.delay : 15; // don't want to mess up callbacks

            if (xhrCleared === true) {
                return;
            }

            if (req[type] !== blank) {
                // define a new response object to give to the user
                newResp = {
                    lengthComputable : resp.lengthComputable || event.lengthComputable || null,
                    loaded : resp.loaded || event.loaded || null,
                    readyState : resp.readyState,
                    responseHeaders : resp.responseHeaders ||
                        ( typeof resp.getAllResponseHeaders === 'function' ? resp.getAllResponseHeaders() : null) || '',
                    responseText : resp.responseText,
                    status : resp.status,
                    statusText : resp.statusText,
                    total : resp.total || event.total || null,
                    url : resp.finalUrl || req.url,
                };

                // allow new requests to be run if our request is done
                if (type === 'onerror' || type === 'onload') {
                    xhrInProgress = false;

                    // run the next in queue, if any
                    window.setTimeout(xhr, req.delay);
                }

                // run the callback
                context = req.context || newResp;
                req[type].call(context, newResp);
            }
        }

        if ( req && (xhrInProgress === false || req.async === true) && queue.length > 0) {
            // make it so no other requests get run while we
            // run this one, if async isn't enabled
            xhrInProgress = true;

            // remove the first item in the queue if it is going to be run
            queue.shift();

            if (typeof GM_xmlhttpRequest === 'function') {
                if (req.method.toUpperCase() === 'GET' && req.data !== '') {
                    req.url += '?' + req.data;
                    req.data = '';
                }

                GM_xmlhttpRequest({
                    'data' : req.data,
                    'headers' : req.headers,
                    'method' : req.method,
                    'onerror' : function (resp) {
                        handleEvents('onerror', resp);
                    },
                    'onload' : function (resp) {
                        handleEvents('onload', resp);
                    },
                    'onreadystatechange' : function (resp) {
                        handleEvents('onreadystatechange', resp);
                    },
                    'onprogress' : function (resp) {
                        handleEvents('onprogress', resp);
                    },
                    'url' : req.url,
                });
            } else if (typeof XMLHttpRequest === 'function' || typeof ActiveXObject === 'function') {
                xhrObj = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

                // set events
                xhrObj.onload = function (resp) {
                    handleEvents('onload', xhrObj);
                };
                xhrObj.onerror = function (resp) {
                    handleEvents('onerror', xhrObj);
                };
                xhrObj.onprogress = function (resp) {
                    handleEvents('onprogress', xhrObj, resp);
                };

                if (req.mimeType !== '') {
                    xhrObj.overrideMimeType(req.mimeType);
                }

                // add headers
                for (key in req.headers) {
                    xhrObj.setRequestHeader( key, req.headers[key] );
                }

                xhrObj.open(req.method, req.url, true);
                xhrObj.send( (req.data || null) );
            }
        }
    }

    function init(url, settings) {
        var urls = [],
            realSettings = { // defaults
                async : false,
                data : '',
                headers : {},
                method : 'GET',
                mimeType : '',
                onload : blank,
                onerror : blank,
                onprogress : blank,
                onreadystatechange : blank,
                delay : 0
            },
            key, value;

        if (typeof url === 'string') {
            urls.push(url);
        } else if (JSL.typeOf(url) === 'array') {
            urls = urls.concat(url);
        }

        if (JSL.typeOf(settings) === 'object') {
            for (key in settings) {
                value = settings[key];

                switch (key) {
                    case 'async': {
                        if (typeof value === 'boolean') {
                            realSettings[key] = value;
                        }
                        break;
                    }
                    case 'context': {
                        if (value != null) {
                            realSettings[key] = value;
                        }
                        break;
                    }
                    case 'data': {
                        if (typeof value === 'string') {
                            realSettings[key] = value;
                        } else if (JSL.typeOf(value) === 'object') {
                            realSettings[key] = toDataString(value);
                        }
                        break;
                    }
                    case 'delay': {
                        if (typeof value === 'number' && value > 0) {
                            realSettings[key] = value;
                        }
                        break;
                    }
                    case 'headers': {
                        if (JSL.typeOf(value) === 'object') {
                            realSettings[key] = toDataString(value);
                        }
                        break;
                    }
                    case 'method': {
                        if ( typeof value === 'string' && /get|post|head/i.test(value) ) {
                            realSettings[key] = value.toUpperCase();
                        }
                        break;
                    }
                    case 'mimeType': {
                        if (typeof value === 'string') {
                            realSettings[key] = value;
                        }
                        break;
                    }
                    case 'onload': case 'onerror': case 'onreadystatechange': case 'onprogress': {
                        if (typeof value === 'function') {
                            realSettings[key] = value;
                        }
                        break;
                    }
                }
            }
        }

        // add an object to the queue for each url
        if (urls.length > 0) {
            JSL.each(urls, function (url) {
                var newO = copyObject(realSettings);
                newO.url = url;
                queue.push(newO);
            });

            // enable ajax if it was cleared earlier
            xhrCleared = false;

            // run the xhr function
            // it will determine whether or not a request needs to be sent
            xhr();
        }
    }

    init.prototype = {
        constructor: init,

        clear : function() {
            queue.length = 0;
            xhrInProgress = false;
            xhrCleared = true;
        },

        get length() {
            return queue.length;
        }
    };

    JSL.extend({
        ajax : function (url, settings) {
            return new init(url, settings);
        }
    });

}());