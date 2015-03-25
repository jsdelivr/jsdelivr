/*! algoliasearch 3.0.0 | © 2014, 2015 Algolia SAS | github.com/algolia/algoliasearch-client-js */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (global){
var createAlgoliasearch = require(4);
var JSONPRequest = require(5);

global.angular.module('algoliasearch', [])
  .service('algolia', ['$http', '$q', '$timeout', function ($http, $q, $timeout) {
    function request(url, opts) {
      return $q(function(resolve, reject) {
        var timedOut;
        var body = null;

        if (opts.body !== undefined) {
          body = JSON.stringify(opts.body);
        }

        var timeout = $q(function(resolveTimeout) {
          $timeout(function() {
            timedOut = true;
            // will cancel the xhr
            resolveTimeout('test');
            resolve(new Error('Timeout - Could not connect to endpoint ' + url));
          }, opts.timeout);
        });

        $http({
          url: url,
          method: opts.method,
          data: body,
          cache: false,
          timeout: timeout
        }).then(function success(response) {
          resolve({
            statusCode: response.status,
            body: response.data
          });
        }, function error(response) {
          if (timedOut) {
            return;
          }

          // network error
          if (response.status === 0) {
            reject(new Error('Network error'));
            return;
          }

          resolve({
            body: response.data,
            statusCode: response.status
          });
        });
      });
    }

    request.fallback = function(url, opts) {
      return $q(function(resolve, reject) {
        JSONPRequest(url, opts, function JSONPRequestDone(err, content) {
          if (err) {
            reject(err);
            return;
          }

          resolve(content);
        });
      });
    };

    request.reject = function(val) {
      return $q.reject(val);
    };

    request.resolve = function(val) {
      // http://www.bennadel.com/blog/2735-q-when-is-the-missing-q-resolve-method-in-angularjs.htm
      return $q.when(val);
    };

    request.delay = function(ms) {
      return $q(function(resolve/*, reject*/) {
        $timeout(resolve, ms);
      });
    };

    var algoliasearch = createAlgoliasearch(request);
    return {
      Client: function(applicationID, apiKey, options) {
        return algoliasearch(applicationID, apiKey, options);
      }
    };
  }]);

require(6)('algoliasearch.angular');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"4":4,"5":5,"6":6}],3:[function(require,module,exports){
(function (process){
module.exports = AlgoliaSearch;

/*
 * Algolia Search library initialization
 * https://www.algolia.com/
 *
 * @param {string} applicationID - Your applicationID, found in your dashboard
 * @param {string} apiKey - Your API key, found in your dashboard
 * @param {Object} [opts]
 * @param {number} [opts.timeout=2000] - The request timeout set in milliseconds, another request will be issued after this timeout
 * @param {string} [opts.protocol='http:'] - The protocol used to query Algolia Search API.
 *                                        Set to 'https:' to force using https. Default to document.location.protocol in browsers
 * @param {string[]} [opts.hosts=[
 *          this.applicationID + '-1.algolia.' + opts.tld,
 *          this.applicationID + '-2.algolia.' + opts.tld,
 *          this.applicationID + '-3.algolia.' + opts.tld]
 *        ] - The hosts to use for Algolia Search API. It this your responsibility to shuffle the hosts and add a DSN host in it
 * @param {string} [opts.tld='net'] - The tld to use when computing hosts default list
 */
function AlgoliaSearch(applicationID, apiKey, opts, _request) {
  var usage = 'Usage: algoliasearch(applicationID, apiKey, opts)';

  if (!applicationID) {
    throw new Error('Please provide an application ID. ' + usage);
  }

  if (!apiKey) {
    throw new Error('Please provide an API key. ' + usage);
  }

  opts = opts || {};

  // now setting default options
  // could not find a tiny module to do that, let's go manual
  if (opts.timeout === undefined) {
    opts.timeout = 2000;
  }

  if (opts.protocol === undefined) {
    opts.protocol = document && document.location.protocol || 'http:';
  }

  if (opts.hosts === undefined) {
    opts.hosts = []; // filled later on, has dependencies
  }

  if (opts.tld === undefined) {
    opts.tld = 'net';
  }

  // while we advocate for colon-at-the-end values: 'http:' for `opts.protocol`
  // we also accept `http` and `https`. It's a common error.
  if (!/:$/.test(opts.protocol)) {
    opts.protocol = opts.protocol + ':';
  }

  // no hosts given, add defaults
  if (opts.hosts.length === 0) {
    opts.hosts = shuffle([
      applicationID + '-1.algolia.' + opts.tld,
      applicationID + '-2.algolia.' + opts.tld,
      applicationID + '-3.algolia.' + opts.tld
    ]);

    // add default dsn host
    opts.hosts.unshift(applicationID + '-dsn.algolia.' + opts.tld);
  }

  opts.hosts = map(opts.hosts, function prependProtocol(host) {
    return opts.protocol + '//' + host;
  });

  this.applicationID = applicationID;
  this.apiKey = apiKey;
  this.hosts = opts.hosts;

  this.currentHostIndex = 0;
  this.requestTimeout = opts.timeout;
  this.extraHeaders = [];
  this.cache = {};
  this._request = _request;
}

AlgoliaSearch.prototype = {
  /*
   * Delete an index
   *
   * @param indexName the name of index to delete
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer that contains the task ID
   */
  deleteIndex: function(indexName, callback) {
    return this._jsonRequest({ method: 'DELETE',
              url: '/1/indexes/' + encodeURIComponent(indexName),
              callback: callback });
  },
  /**
   * Move an existing index.
   * @param srcIndexName the name of index to copy.
   * @param dstIndexName the new index name that will contains a copy of srcIndexName (destination will be overriten if it already exist).
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer that contains the task ID
   */
  moveIndex: function(srcIndexName, dstIndexName, callback) {
    var postObj = {operation: 'move', destination: dstIndexName};
    return this._jsonRequest({ method: 'POST',
              url: '/1/indexes/' + encodeURIComponent(srcIndexName) + '/operation',
              body: postObj,
              callback: callback });

  },
  /**
   * Copy an existing index.
   * @param srcIndexName the name of index to copy.
   * @param dstIndexName the new index name that will contains a copy of srcIndexName (destination will be overriten if it already exist).
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer that contains the task ID
   */
  copyIndex: function(srcIndexName, dstIndexName, callback) {
    var postObj = {operation: 'copy', destination: dstIndexName};
    return this._jsonRequest({ method: 'POST',
              url: '/1/indexes/' + encodeURIComponent(srcIndexName) + '/operation',
              body: postObj,
              callback: callback });
  },
  /**
   * Return last log entries.
   * @param offset Specify the first entry to retrieve (0-based, 0 is the most recent log entry).
   * @param length Specify the maximum number of entries to retrieve starting at offset. Maximum allowed value: 1000.
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer that contains the task ID
   */
  getLogs: function(offset, length, callback) {
    if (arguments.length === 0 || typeof offset === 'function') {
      // getLogs([cb])
      callback = offset;
      offset = 0;
      length = 10;
    } else if (arguments.length === 1 || typeof length === 'function') {
      // getLogs(1, [cb)]
      callback = length;
      length = 10;
    }

    return this._jsonRequest({ method: 'GET',
              url: '/1/logs?offset=' + offset + '&length=' + length,
              callback: callback });
  },
  /*
   * List all existing indexes (paginated)
   *
   * @param page The page to retrieve, starting at 0.
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with index list
   */
  listIndexes: function(page, callback) {
    var params = '';

    if (page === undefined || typeof page === 'function') {
      callback = page;
    } else {
      params = '?page=' + page;
    }

    return this._jsonRequest({ method: 'GET',
              url: '/1/indexes' + params,
              callback: callback });
  },

  /*
   * Get the index object initialized
   *
   * @param indexName the name of index
   * @param callback the result callback with one argument (the Index instance)
   */
  initIndex: function(indexName) {
    return new this.Index(this, indexName);
  },
  /*
   * List all existing user keys with their associated ACLs
   *
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  listUserKeys: function(callback) {
    return this._jsonRequest({ method: 'GET',
              url: '/1/keys',
              callback: callback });
  },
  /*
   * Get ACL of a user key
   *
   * @param key
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  getUserKeyACL: function(key, callback) {
    return this._jsonRequest({ method: 'GET',
              url: '/1/keys/' + key,
              callback: callback });
  },
  /*
   * Delete an existing user key
   * @param key
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  deleteUserKey: function(key, callback) {
    return this._jsonRequest({ method: 'DELETE',
              url: '/1/keys/' + key,
              callback: callback });
  },
  /*
   * Add an existing user key
   *
   * @param acls the list of ACL for this key. Defined by an array of strings that
   * can contains the following values:
   *   - search: allow to search (https and http)
   *   - addObject: allows to add/update an object in the index (https only)
   *   - deleteObject : allows to delete an existing object (https only)
   *   - deleteIndex : allows to delete index content (https only)
   *   - settings : allows to get index settings (https only)
   *   - editSettings : allows to change index settings (https only)
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  addUserKey: function(acls, callback) {
    return this.addUserKeyWithValidity(acls, {
      validity: 0,
      maxQueriesPerIPPerHour: 0,
      maxHitsPerQuery: 0
    }, callback);
  },
  /*
   * Add an existing user key
   *
   * @param acls the list of ACL for this key. Defined by an array of strings that
   * can contains the following values:
   *   - search: allow to search (https and http)
   *   - addObject: allows to add/update an object in the index (https only)
   *   - deleteObject : allows to delete an existing object (https only)
   *   - deleteIndex : allows to delete index content (https only)
   *   - settings : allows to get index settings (https only)
   *   - editSettings : allows to change index settings (https only)
   * @param params.validity the number of seconds after which the key will be automatically removed (0 means no time limit for this key)
   * @param params.maxQueriesPerIPPerHour Specify the maximum number of API calls allowed from an IP address per hour.
   * @param params.maxHitsPerQuery Specify the maximum number of hits this API key can retrieve in one call.
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  addUserKeyWithValidity: function(acls, params, callback) {
    var aclsObject = {};
    aclsObject.acl = acls;
    aclsObject.validity = params.validity;
    aclsObject.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
    aclsObject.maxHitsPerQuery = params.maxHitsPerQuery;
    return this._jsonRequest({ method: 'POST',
              url: '/1/keys',
              body: aclsObject,
              callback: callback });
  },

  /**
   * Set the extra security tagFilters header
   * @param {string|array} tags The list of tags defining the current security filters
   */
  setSecurityTags: function(tags) {
    if (Object.prototype.toString.call(tags) === '[object Array]') {
      var strTags = [];
      for (var i = 0; i < tags.length; ++i) {
        if (Object.prototype.toString.call(tags[i]) === '[object Array]') {
          var oredTags = [];
          for (var j = 0; j < tags[i].length; ++j) {
            oredTags.push(tags[i][j]);
          }
          strTags.push('(' + oredTags.join(',') + ')');
        } else {
          strTags.push(tags[i]);
        }
      }
      tags = strTags.join(',');
    }
    this.tagFilters = tags;
  },

  /**
   * Set the extra user token header
   * @param {string} userToken The token identifying a uniq user (used to apply rate limits)
   */
  setUserToken: function(userToken) {
    this.userToken = userToken;
  },

  /*
   * Initialize a new batch of search queries
   */
  startQueriesBatch: function() {
    this.batch = [];
  },
  /*
   * Add a search query in the batch
   *
   * @param query the full text query
   * @param args (optional) if set, contains an object with query parameters:
   *  - attributes: an array of object attribute names to retrieve
   *     (if not set all attributes are retrieve)
   *  - attributesToHighlight: an array of object attribute names to highlight
   *     (if not set indexed attributes are highlighted)
   *  - minWordSizefor1Typo: the minimum number of characters to accept one typo.
   *     Defaults to 3.
   *  - minWordSizefor2Typos: the minimum number of characters to accept two typos.
   *     Defaults to 7.
   *  - getRankingInfo: if set, the result hits will contain ranking information in
   *     _rankingInfo attribute
   *  - page: (pagination parameter) page to retrieve (zero base). Defaults to 0.
   *  - hitsPerPage: (pagination parameter) number of hits per page. Defaults to 10.
   */
  addQueryInBatch: function(indexName, query, args) {
    var params = 'query=' + encodeURIComponent(query);
    if (!this._isUndefined(args) && args !== null) {
      params = this._getSearchParams(args, params);
    }
    this.batch.push({ indexName: indexName, params: params });
  },
  /*
   * Clear all queries in cache
   */
  clearCache: function() {
    this.cache = {};
  },
  /*
   * Launch the batch of queries using XMLHttpRequest.
   * (Optimized for browser using a POST query to minimize number of OPTIONS queries)
   *
   * @param callback the function that will receive results
   */
  sendQueriesBatch: function(callback) {
    var as = this;
    var params = {requests: []};

    for (var i = 0; i < as.batch.length; ++i) {
      params.requests.push(as.batch[i]);
    }

    return this._sendQueriesBatch(params, callback);
  },

   /**
   * Set the number of milliseconds a request can take before automatically being terminated.
   *
   * @param {Number} milliseconds
   */
  setRequestTimeout: function(milliseconds) {
    if (milliseconds) {
      this.requestTimeout = parseInt(milliseconds, 10);
    }
  },

  /*
   * Index class constructor.
   * You should not use this method directly but use initIndex() function
   */
  Index: function(algoliasearch, indexName) {
    this.indexName = indexName;
    this.as = algoliasearch;
    this.typeAheadArgs = null;
    this.typeAheadValueOption = null;

    // make sure every index instance has it's own cache
    this.cache = {};
  },
   /**
   * Add an extra field to the HTTP request
   *
   * @param key the header field name
   * @param value the header field value
   */
  setExtraHeader: function(key, value) {
    this.extraHeaders.push({ key: key, value: value});
  },

  _sendQueriesBatch: function(params, callback) {
    return this._jsonRequest({ cache: this.cache,
      method: 'POST',
      url: '/1/indexes/*/queries',
      body: params,
      fallback: {
        method: 'GET',
        url: '/1/indexes/*',
        body: {params: (function() {
          var reqParams = '';
          for (var i = 0; i < params.requests.length; ++i) {
            var q = '/1/indexes/' + encodeURIComponent(params.requests[i].indexName) + '?' + params.requests[i].params;
            reqParams += i + '=' + encodeURIComponent(q) + '&';
          }
          return reqParams;
        }())}
      },
      callback: callback
    });
  },
  /*
   * Wrapper that try all hosts to maximize the quality of service
   */
  _jsonRequest: function(opts) {
    // handle opts.fallback, automatically use fallback (JSONP in browser plugins, wrapped with $plugin-promises)
    // so if an error occurs and max tries => use fallback
    // set tries to 0 again
    // if fallback used and no more tries, return error
    // fallback parameters are in opts.fallback
    // call request.fallback or request accordingly, same promise chain otherwise
    // put callback& params in front if problem
    var cache = opts.cache;
    var cacheID = opts.url;
    var client = this;
    var tries = 0;

    // as we use POST requests to pass parameters (like query='aa'),
    // the cacheID must be different between calls
    if (opts.body !== undefined) {
      cacheID += '_body_' + JSON.stringify(opts.body);
    }

    function doRequest(requester, reqOpts) {
      // handle cache existence
      if (cache && cache[cacheID] !== undefined) {
        return client._request.resolve(cache[cacheID]);
      }

      if (tries >= client.hosts.length) {
        if (!opts.fallback || requester === client._request.fallback) {
          // could not get a response even using the fallback if one was available
          return client._request.reject(new Error(
            'Cannot connect to the AlgoliaSearch API.' +
            ' Send an email to support@algolia.com to report and resolve the issue.'
          ));
        }

        tries = 0;
        reqOpts.method = opts.fallback.method;
        reqOpts.url = opts.fallback.url;
        reqOpts.body = opts.fallback.body;
        reqOpts.timeout = client.requestTimeout * (tries + 1);
        client.currentHostIndex = 0;
        client.forceFallback = true;
        return doRequest(client._request.fallback, reqOpts);
      }

      var url = reqOpts.url;

      url += (url.indexOf('?') === -1 ? '?' : '&') + 'X-Algolia-API-Key=' + client.apiKey;
      url += '&X-Algolia-Application-Id=' + client.applicationID;

      if (client.userToken) {
        url += '&X-Algolia-UserToken=' + encodeURIComponent(client.userToken);
      }

      if (client.tagFilters) {
        url += '&X-Algolia-TagFilters=' + encodeURIComponent(client.tagFilters);
      }

      for (var i = 0; i < client.extraHeaders.length; ++i) {
        url += '&' + client.extraHeaders[i].key + '=' + client.extraHeaders[i].value;
      }

      return requester(client.hosts[client.currentHostIndex] + url, {
        body: reqOpts.body,
        method: reqOpts.method,
        timeout: reqOpts.timeout
      })
      .then(function success(httpResponse) {
        // timeout case, retry immediately
        if (httpResponse instanceof Error) {
          return retryRequest();
        }

        var status =
          // When in browser mode, using XDR or JSONP
          // We rely on our own API response `status`, only
          // provided when an error occurs, we also expect a .message along
          // Otherwise, it could be a `waitTask` status, that's the only
          // case where we have a response.status that's not the http statusCode
          httpResponse && httpResponse.body && httpResponse.body.message && httpResponse.body.status ||

          // this is important to check the request statusCode AFTER the body eventual
          // statusCode because some implementations (jQuery XDomainRequest transport) may
          // send statusCode 200 while we had an error
          httpResponse.statusCode ||

          // When in browser mode, using XDR or JSONP
          // we default to success when no error (no response.status && response.message)
          // If there was a JSON.parse() error then body is null and it fails
          httpResponse && httpResponse.body && 200;

        var ok = status === 200 || status === 201;
        var retry = !ok && Math.floor(status / 100) !== 4 && Math.floor(status / 100) !== 1;

        if (ok && cache) {
          cache[cacheID] = httpResponse.body;
        }

        if (ok) {
          return httpResponse.body;
        }

        if (retry) {
          return retryRequest();
        }

        var unrecoverableError = new Error(
          httpResponse.body && httpResponse.body.message || 'Unknown error'
        );

        return client._request.reject(unrecoverableError);
      }, tryFallback);

      function retryRequest() {
        client.currentHostIndex = ++client.currentHostIndex % client.hosts.length;
        tries += 1;
        reqOpts.timeout = client.requestTimeout * (tries + 1);
        return doRequest(requester, reqOpts);
      }

      function tryFallback() {
        // if we are switching to fallback right now, set tries to maximum
        if (!client.forceFallback) {
          // next time doRequest is called, simulate we tried all hosts
          tries = client.hosts.length;
        } else {
          // we were already using the fallback, but something went wrong (script error)
          client.currentHostIndex = ++client.currentHostIndex % client.hosts.length;
          tries += 1;
        }

        return doRequest(requester, reqOpts);
      }
    }

    // we can use a fallback if forced AND fallback parameters are available
    var useFallback = client.forceFallback && opts.fallback;
    var requestOptions = useFallback ? opts.fallback : opts;

    var promise = doRequest(
      useFallback ? client._request.fallback : client._request, {
        url: requestOptions.url,
        method: requestOptions.method,
        body: requestOptions.body,
        timeout: client.requestTimeout * (tries + 1)
      }
    );

    // either we have a callback
    // either we are using promises
    if (opts.callback) {
      promise.then(function okCb(content) {
        process.nextTick(function() {
          opts.callback(null, content);
        });
      }, function nookCb(err) {
        process.nextTick(function() {
          opts.callback(err);
        });
      });
    } else {
      return promise;
    }
  },

   /*
   * Transform search param object in query string
   */
  _getSearchParams: function(args, params) {
    if (this._isUndefined(args) || args === null) {
      return params;
    }
    for (var key in args) {
      if (key !== null && args.hasOwnProperty(key)) {
        params += params === '' ? '' : '&';
        params += key + '=' + encodeURIComponent(Object.prototype.toString.call(args[key]) === '[object Array]' ? JSON.stringify(args[key]) : args[key]);
      }
    }
    return params;
  },
  _isUndefined: function(obj) {
    return obj === void 0;
  }
};

/*
 * Contains all the functions related to one index
 * You should use AlgoliaSearch.initIndex(indexName) to retrieve this object
 */
AlgoliaSearch.prototype.Index.prototype = {
  /*
   * Clear all queries in cache
   */
  clearCache: function() {
    this.cache = {};
  },
  /*
   * Add an object in this index
   *
   * @param content contains the javascript object to add inside the index
   * @param objectID (optional) an objectID you want to attribute to this object
   * (if the attribute already exist the old object will be overwrite)
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that contains 3 elements: createAt, taskId and objectID
   */
  addObject: function(content, objectID, callback) {
    var indexObj = this;

    if (arguments.length === 1 || typeof objectID === 'function') {
      callback = objectID;
      objectID = undefined;
    }

    return this.as._jsonRequest({
      method: objectID !== undefined ?
        'PUT' : // update or create
        'POST', // create (API generates an objectID)
      url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + // create
        (objectID !== undefined ? '/' + encodeURIComponent(objectID) : ''), // update or create
      body: content,
      callback: callback
    });
  },
  /*
   * Add several objects
   *
   * @param objects contains an array of objects to add
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that updateAt and taskID
   */
  addObjects: function(objects, callback) {
    var indexObj = this;
    var postObj = {requests: []};
    for (var i = 0; i < objects.length; ++i) {
      var request = { action: 'addObject',
              body: objects[i] };
      postObj.requests.push(request);
    }
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
                 body: postObj,
                 callback: callback });
  },
  /*
   * Get an object from this index
   *
   * @param objectID the unique identifier of the object to retrieve
   * @param attrs (optional) if set, contains the array of attribute names to retrieve
   * @param callback (optional) the result callback with two arguments
   *  error: null or Error('message')
   *  content: the object to retrieve or the error message if a failure occured
   */
  getObject: function(objectID, attrs, callback) {
    var indexObj = this;

    if (arguments.length === 1 || typeof attrs === 'function') {
      callback = attrs;
      attrs = undefined;
    }

    var params = '';
    if (attrs !== undefined) {
      params = '?attributes=';
      for (var i = 0; i < attrs.length; ++i) {
        if (i !== 0) {
          params += ',';
        }
        params += attrs[i];
      }
    }

    return this.as._jsonRequest({
      method: 'GET',
      url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(objectID) + params,
      callback: callback
    });
  },

  /*
   * Update partially an object (only update attributes passed in argument)
   *
   * @param partialObject contains the javascript attributes to override, the
   *  object must contains an objectID attribute
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that contains 3 elements: createAt, taskId and objectID
   */
  partialUpdateObject: function(partialObject, callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(partialObject.objectID) + '/partial',
                 body: partialObject,
                 callback: callback });
  },
  /*
   * Partially Override the content of several objects
   *
   * @param objects contains an array of objects to update (each object must contains a objectID attribute)
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that updateAt and taskID
   */
  partialUpdateObjects: function(objects, callback) {
    var indexObj = this;
    var postObj = {requests: []};
    for (var i = 0; i < objects.length; ++i) {
      var request = { action: 'partialUpdateObject',
              objectID: objects[i].objectID,
              body: objects[i] };
      postObj.requests.push(request);
    }
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
                 body: postObj,
                 callback: callback });
  },
  /*
   * Override the content of object
   *
   * @param object contains the javascript object to save, the object must contains an objectID attribute
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that updateAt and taskID
   */
  saveObject: function(object, callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'PUT',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(object.objectID),
                 body: object,
                 callback: callback });
  },
  /*
   * Override the content of several objects
   *
   * @param objects contains an array of objects to update (each object must contains a objectID attribute)
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that updateAt and taskID
   */
  saveObjects: function(objects, callback) {
    var indexObj = this;
    var postObj = {requests: []};
    for (var i = 0; i < objects.length; ++i) {
      var request = { action: 'updateObject',
              objectID: objects[i].objectID,
              body: objects[i] };
      postObj.requests.push(request);
    }
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
                 body: postObj,
                 callback: callback });
  },
  /*
   * Delete an object from the index
   *
   * @param objectID the unique identifier of object to delete
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that contains 3 elements: createAt, taskId and objectID
   */
  deleteObject: function(objectID, callback) {
    if (typeof objectID === 'function' || typeof objectID !== 'string' && typeof objectID !== 'number') {
      var err = new Error('Cannot delete an object without an objectID');
      callback = objectID;
      if (typeof callback === 'function') {
        return callback(err);
      }

      return this.as._request.reject(err);
    }

    var indexObj = this;
    return this.as._jsonRequest({ method: 'DELETE',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(objectID),
                 callback: callback });
  },
  /*
   * Search inside the index using XMLHttpRequest request (Using a POST query to
   * minimize number of OPTIONS queries: Cross-Origin Resource Sharing).
   *
   * @param query the full text query
   * @param args (optional) if set, contains an object with query parameters:
   * - page: (integer) Pagination parameter used to select the page to retrieve.
   *                   Page is zero-based and defaults to 0. Thus, to retrieve the 10th page you need to set page=9
   * - hitsPerPage: (integer) Pagination parameter used to select the number of hits per page. Defaults to 20.
   * - attributesToRetrieve: a string that contains the list of object attributes you want to retrieve (let you minimize the answer size).
   *   Attributes are separated with a comma (for example "name,address").
   *   You can also use an array (for example ["name","address"]).
   *   By default, all attributes are retrieved. You can also use '*' to retrieve all values when an attributesToRetrieve setting is specified for your index.
   * - attributesToHighlight: a string that contains the list of attributes you want to highlight according to the query.
   *   Attributes are separated by a comma. You can also use an array (for example ["name","address"]).
   *   If an attribute has no match for the query, the raw value is returned. By default all indexed text attributes are highlighted.
   *   You can use `*` if you want to highlight all textual attributes. Numerical attributes are not highlighted.
   *   A matchLevel is returned for each highlighted attribute and can contain:
   *      - full: if all the query terms were found in the attribute,
   *      - partial: if only some of the query terms were found,
   *      - none: if none of the query terms were found.
   * - attributesToSnippet: a string that contains the list of attributes to snippet alongside the number of words to return (syntax is `attributeName:nbWords`).
   *    Attributes are separated by a comma (Example: attributesToSnippet=name:10,content:10).
   *    You can also use an array (Example: attributesToSnippet: ['name:10','content:10']). By default no snippet is computed.
   * - minWordSizefor1Typo: the minimum number of characters in a query word to accept one typo in this word. Defaults to 3.
   * - minWordSizefor2Typos: the minimum number of characters in a query word to accept two typos in this word. Defaults to 7.
   * - getRankingInfo: if set to 1, the result hits will contain ranking information in _rankingInfo attribute.
   * - aroundLatLng: search for entries around a given latitude/longitude (specified as two floats separated by a comma).
   *   For example aroundLatLng=47.316669,5.016670).
   *   You can specify the maximum distance in meters with the aroundRadius parameter (in meters) and the precision for ranking with aroundPrecision
   *   (for example if you set aroundPrecision=100, two objects that are distant of less than 100m will be considered as identical for "geo" ranking parameter).
   *   At indexing, you should specify geoloc of an object with the _geoloc attribute (in the form {"_geoloc":{"lat":48.853409, "lng":2.348800}})
   * - insideBoundingBox: search entries inside a given area defined by the two extreme points of a rectangle (defined by 4 floats: p1Lat,p1Lng,p2Lat,p2Lng).
   *   For example insideBoundingBox=47.3165,4.9665,47.3424,5.0201).
   *   At indexing, you should specify geoloc of an object with the _geoloc attribute (in the form {"_geoloc":{"lat":48.853409, "lng":2.348800}})
   * - numericFilters: a string that contains the list of numeric filters you want to apply separated by a comma.
   *   The syntax of one filter is `attributeName` followed by `operand` followed by `value`. Supported operands are `<`, `<=`, `=`, `>` and `>=`.
   *   You can have multiple conditions on one attribute like for example numericFilters=price>100,price<1000.
   *   You can also use an array (for example numericFilters: ["price>100","price<1000"]).
   * - tagFilters: filter the query by a set of tags. You can AND tags by separating them by commas.
   *   To OR tags, you must add parentheses. For example, tags=tag1,(tag2,tag3) means tag1 AND (tag2 OR tag3).
   *   You can also use an array, for example tagFilters: ["tag1",["tag2","tag3"]] means tag1 AND (tag2 OR tag3).
   *   At indexing, tags should be added in the _tags** attribute of objects (for example {"_tags":["tag1","tag2"]}).
   * - facetFilters: filter the query by a list of facets.
   *   Facets are separated by commas and each facet is encoded as `attributeName:value`.
   *   For example: `facetFilters=category:Book,author:John%20Doe`.
   *   You can also use an array (for example `["category:Book","author:John%20Doe"]`).
   * - facets: List of object attributes that you want to use for faceting.
   *   Comma separated list: `"category,author"` or array `['category','author']`
   *   Only attributes that have been added in **attributesForFaceting** index setting can be used in this parameter.
   *   You can also use `*` to perform faceting on all attributes specified in **attributesForFaceting**.
   * - queryType: select how the query words are interpreted, it can be one of the following value:
   *    - prefixAll: all query words are interpreted as prefixes,
   *    - prefixLast: only the last word is interpreted as a prefix (default behavior),
   *    - prefixNone: no query word is interpreted as a prefix. This option is not recommended.
   * - optionalWords: a string that contains the list of words that should be considered as optional when found in the query.
   *   Comma separated and array are accepted.
   * - distinct: If set to 1, enable the distinct feature (disabled by default) if the attributeForDistinct index setting is set.
   *   This feature is similar to the SQL "distinct" keyword: when enabled in a query with the distinct=1 parameter,
   *   all hits containing a duplicate value for the attributeForDistinct attribute are removed from results.
   *   For example, if the chosen attribute is show_name and several hits have the same value for show_name, then only the best
   *   one is kept and others are removed.
   * - restrictSearchableAttributes: List of attributes you want to use for textual search (must be a subset of the attributesToIndex index setting)
   * either comma separated or as an array
   * @param callback the result callback with two arguments:
   *  error: null or Error('message'). If false, the content contains the error.
   *  content: the server answer that contains the list of results.
   */
  search: function(query, args, callback) {
    if (arguments.length === 0 || typeof query === 'function') {
      // .search(), .search(cb)
      callback = query;
      query = '';
    } else if (arguments.length === 1 || typeof args === 'function') {
      // .search(query/args), .search(query, cb)
      callback = args;
      args = undefined;
    }

    // .search(args), careful: typeof null === 'object'
    if (typeof query === 'object' && query !== null) {
      args = query;
      query = undefined;
    } else if (query === undefined || query === null) { // .search(undefined/null)
      query = '';
    }

    var params = '';

    if (query !== undefined) {
      params += 'query=' + encodeURIComponent(query);
    }

    if (args !== undefined) {
      params = this.as._getSearchParams(args, params);
    }

    return this._search(params, callback);
  },

  /*
   * Browse all index content
   *
   * @param page Pagination parameter used to select the page to retrieve.
   *             Page is zero-based and defaults to 0. Thus, to retrieve the 10th page you need to set page=9
   * @param hitsPerPage: Pagination parameter used to select the number of hits per page. Defaults to 1000.
   * @param callback the result callback with two arguments:
   *  error: null or Error('message'). If false, the content contains the error.
   *  content: the server answer that contains the list of results.
   */
  browse: function(page, hitsPerPage, callback) {
    var indexObj = this;

    if (arguments.length === 1 || typeof hitsPerPage === 'function') {
      callback = hitsPerPage;
      hitsPerPage = undefined;
    }

    var params = '?page=' + page;
    if (!this.as._isUndefined(hitsPerPage)) {
      params += '&hitsPerPage=' + hitsPerPage;
    }
    return this.as._jsonRequest({ method: 'GET',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/browse' + params,
                 callback: callback });
  },

  /*
   * Get a Typeahead.js adapter
   * @param searchParams contains an object with query parameters (see search for details)
   */
  ttAdapter: function(params) {
    var self = this;
    return function(query, cb) {
      self.search(query, params, function(err, content) {
        if (err) {
          cb(err);
          return;
        }

        cb(content.hits);
      });
    };
  },

  /*
   * Wait the publication of a task on the server.
   * All server task are asynchronous and you can check with this method that the task is published.
   *
   * @param taskID the id of the task returned by server
   * @param callback the result callback with with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that contains the list of results
   */
  waitTask: function(taskID, callback) {
    // waitTask() must be handled differently from other methods,
    // it's a recursive method using a timeout
    var indexObj = this;

    var promise = this.as._jsonRequest({
      method: 'GET',
      url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/task/' + taskID
    }).then(function success(content) {
      if (content.status !== 'published') {
        return new indexObj.as._request.delay(100).then(function() {
          return indexObj.waitTask(taskID, callback);
        });
      }

      if (callback) {
        process.nextTick(function() {
          callback(null, content);
        });
      } else {
        return content;
      }
    }, function failure(err) {
      if (callback) {
        process.nextTick(function() {
          callback(err);
        });
      } else {
        return err;
      }
    });

    if (!callback) {
      return promise;
    }
  },

  /*
   * This function deletes the index content. Settings and index specific API keys are kept untouched.
   *
   * @param callback (optional) the result callback with two arguments
   *  error: null or Error('message')
   *  content: the settings object or the error message if a failure occured
   */
  clearIndex: function(callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/clear',
                 callback: callback });
  },
  /*
   * Get settings of this index
   *
   * @param callback (optional) the result callback with two arguments
   *  error: null or Error('message')
   *  content: the settings object or the error message if a failure occured
   */
  getSettings: function(callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'GET',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/settings',
                 callback: callback });
  },

  /*
   * Set settings for this index
   *
   * @param settigns the settings object that can contains :
   * - minWordSizefor1Typo: (integer) the minimum number of characters to accept one typo (default = 3).
   * - minWordSizefor2Typos: (integer) the minimum number of characters to accept two typos (default = 7).
   * - hitsPerPage: (integer) the number of hits per page (default = 10).
   * - attributesToRetrieve: (array of strings) default list of attributes to retrieve in objects.
   *   If set to null, all attributes are retrieved.
   * - attributesToHighlight: (array of strings) default list of attributes to highlight.
   *   If set to null, all indexed attributes are highlighted.
   * - attributesToSnippet**: (array of strings) default list of attributes to snippet alongside the number of words to return (syntax is attributeName:nbWords).
   *   By default no snippet is computed. If set to null, no snippet is computed.
   * - attributesToIndex: (array of strings) the list of fields you want to index.
   *   If set to null, all textual and numerical attributes of your objects are indexed, but you should update it to get optimal results.
   *   This parameter has two important uses:
   *     - Limit the attributes to index: For example if you store a binary image in base64, you want to store it and be able to
   *       retrieve it but you don't want to search in the base64 string.
   *     - Control part of the ranking*: (see the ranking parameter for full explanation) Matches in attributes at the beginning of
   *       the list will be considered more important than matches in attributes further down the list.
   *       In one attribute, matching text at the beginning of the attribute will be considered more important than text after, you can disable
   *       this behavior if you add your attribute inside `unordered(AttributeName)`, for example attributesToIndex: ["title", "unordered(text)"].
   * - attributesForFaceting: (array of strings) The list of fields you want to use for faceting.
   *   All strings in the attribute selected for faceting are extracted and added as a facet. If set to null, no attribute is used for faceting.
   * - attributeForDistinct: (string) The attribute name used for the Distinct feature. This feature is similar to the SQL "distinct" keyword: when enabled
   *   in query with the distinct=1 parameter, all hits containing a duplicate value for this attribute are removed from results.
   *   For example, if the chosen attribute is show_name and several hits have the same value for show_name, then only the best one is kept and others are removed.
   * - ranking: (array of strings) controls the way results are sorted.
   *   We have six available criteria:
   *    - typo: sort according to number of typos,
   *    - geo: sort according to decreassing distance when performing a geo-location based search,
   *    - proximity: sort according to the proximity of query words in hits,
   *    - attribute: sort according to the order of attributes defined by attributesToIndex,
   *    - exact:
   *        - if the user query contains one word: sort objects having an attribute that is exactly the query word before others.
   *          For example if you search for the "V" TV show, you want to find it with the "V" query and avoid to have all popular TV
   *          show starting by the v letter before it.
   *        - if the user query contains multiple words: sort according to the number of words that matched exactly (and not as a prefix).
   *    - custom: sort according to a user defined formula set in **customRanking** attribute.
   *   The standard order is ["typo", "geo", "proximity", "attribute", "exact", "custom"]
   * - customRanking: (array of strings) lets you specify part of the ranking.
   *   The syntax of this condition is an array of strings containing attributes prefixed by asc (ascending order) or desc (descending order) operator.
   *   For example `"customRanking" => ["desc(population)", "asc(name)"]`
   * - queryType: Select how the query words are interpreted, it can be one of the following value:
   *   - prefixAll: all query words are interpreted as prefixes,
   *   - prefixLast: only the last word is interpreted as a prefix (default behavior),
   *   - prefixNone: no query word is interpreted as a prefix. This option is not recommended.
   * - highlightPreTag: (string) Specify the string that is inserted before the highlighted parts in the query result (default to "<em>").
   * - highlightPostTag: (string) Specify the string that is inserted after the highlighted parts in the query result (default to "</em>").
   * - optionalWords: (array of strings) Specify a list of words that should be considered as optional when found in the query.
   * @param callback (optional) the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer or the error message if a failure occured
   */
  setSettings: function(settings, callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'PUT',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/settings',
                 body: settings,
                 callback: callback });
  },
  /*
   * List all existing user keys associated to this index
   *
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  listUserKeys: function(callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'GET',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys',
                 callback: callback });
  },
  /*
   * Get ACL of a user key associated to this index
   *
   * @param key
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  getUserKeyACL: function(key, callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'GET',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys/' + key,
                 callback: callback });
  },
  /*
   * Delete an existing user key associated to this index
   *
   * @param key
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  deleteUserKey: function(key, callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'DELETE',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys/' + key,
                 callback: callback });
  },
  /*
   * Add an existing user key associated to this index
   *
   * @param acls the list of ACL for this key. Defined by an array of strings that
   * can contains the following values:
   *   - search: allow to search (https and http)
   *   - addObject: allows to add/update an object in the index (https only)
   *   - deleteObject : allows to delete an existing object (https only)
   *   - deleteIndex : allows to delete index content (https only)
   *   - settings : allows to get index settings (https only)
   *   - editSettings : allows to change index settings (https only)
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  addUserKey: function(acls, callback) {
    var indexObj = this;
    var aclsObject = {};
    aclsObject.acl = acls;
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys',
                 body: aclsObject,
                 callback: callback });
  },
  /*
   * Add an existing user key associated to this index
   *
   * @param acls the list of ACL for this key. Defined by an array of strings that
   * can contains the following values:
   *   - search: allow to search (https and http)
   *   - addObject: allows to add/update an object in the index (https only)
   *   - deleteObject : allows to delete an existing object (https only)
   *   - deleteIndex : allows to delete index content (https only)
   *   - settings : allows to get index settings (https only)
   *   - editSettings : allows to change index settings (https only)
   * @param params.validity the number of seconds after which the key will be automatically removed (0 means no time limit for this key)
   * @param params.maxQueriesPerIPPerHour Specify the maximum number of API calls allowed from an IP address per hour.
   * @param params.maxHitsPerQuery Specify the maximum number of hits this API key can retrieve in one call.
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  addUserKeyWithValidity: function(acls, params, callback) {
    var indexObj = this;
    var aclsObject = {};
    aclsObject.acl = acls;
    aclsObject.validity = params.validity;
    aclsObject.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
    aclsObject.maxHitsPerQuery = params.maxHitsPerQuery;
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys',
                 body: aclsObject,
                 callback: callback });
  },
  ///
  /// Internal methods only after this line
  ///
  _search: function(params, callback) {
    return this.as._jsonRequest({ cache: this.cache,
      method: 'POST',
      url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/query',
      body: {params: params},
      fallback: {
        method: 'GET',
        url: '/1/indexes/' + encodeURIComponent(this.indexName),
        body: {params: params}
      },
      callback: callback
    });
  },

  // internal attributes
  as: null,
  indexName: null,
  typeAheadArgs: null,
  typeAheadValueOption: null
};

// extracted from https://github.com/component/map/blob/master/index.js
// without the crazy toFunction thing
function map(arr, fn){
  var ret = [];
  for (var i = 0; i < arr.length; ++i) {
    ret.push(fn(arr[i], i));
  }
  return ret;
}

// extracted from https://github.com/coolaj86/knuth-shuffle
// not compatible with browserify
function shuffle(array) {
  /*eslint-disable*/
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

}).call(this,require(1))
},{"1":1}],4:[function(require,module,exports){
// this file is a `factory of algoliasearch()`
// Given a `request` param, it will provide you an AlgoliaSearch client
// using this particular request
module.exports = createAlgoliasearch;

function createAlgoliasearch(request) {
  function algoliasearch(applicationID, apiKey, opts) {
    var AlgoliaSearch = require(3);

    return new AlgoliaSearch(applicationID, apiKey, opts, request);
  }

  algoliasearch.version = "3.0.0";

  return algoliasearch;
}

},{"3":3}],5:[function(require,module,exports){
module.exports = JSONPRequest;

var JSONPCounter = 0;

function JSONPRequest(url, opts, cb) {
  if (opts.method !== 'GET') {
    cb(new Error('Method ' + opts.method + ' ' + url + ' is not supported by JSONP.'));
    return;
  }

  var cbCalled = false;
  var timedOut = false;

  JSONPCounter += 1;
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  var cbName = 'algoliaJSONP_' + JSONPCounter;
  var done = false;

  window[cbName] = function(data) {
    try {
      delete window[cbName];
    } catch (e) {
      window[cbName] = undefined;
    }

    if (timedOut) {
      return;
    }

    cbCalled = true;

    clean();

    cb(null, {
      body: data/*,
      // We do not send the statusCode, there's no statusCode in JSONP, it will be
      // computed using data.status && data.message like with XDR
      statusCode*/
    });
  };

  // add callback by hand
  url += '&callback=' + cbName;

  // add body params by hand
  if (opts.body && opts.body.params) {
    url += '&' + opts.body.params;
  }

  var ontimeout = setTimeout(timeout, opts.timeout);

  // script onreadystatechange needed only for
  // <= IE8
  // https://github.com/angular/angular.js/issues/4523
  script.onreadystatechange = readystatechange;
  script.onload = success;
  script.onerror = error;

  script.async = true;
  script.defer = true;
  script.src = url;
  head.appendChild(script);

  function success() {
    if (done || timedOut) {
      return;
    }

    done = true;

    // script loaded but did not call the fn => script loading error
    if (!cbCalled) {
      clean();
      cb(new Error('Failed to load JSONP script'));
    }
  }

  function readystatechange() {
    if (this.readyState === 'loaded' || this.readyState === 'complete') {
      success();
    }
  }

  function clean() {
    clearTimeout(ontimeout);
    script.onload = null;
    script.onreadystatechange = null;
    script.onerror = null;
    head.removeChild(script);

    try {
      delete window[cbName];
      delete window[cbName + '_loaded'];
    } catch (e) {
      window[cbName] = null;
      window[cbName + '_loaded'] = null;
    }
  }

  function timeout() {
    timedOut = true;
    clean();
    cb(new Error('Timeout - Could not connect to endpoint ' + url));
  }

  function error() {
    if (done || timedOut) {
      return;
    }

    clean();
    cb(new Error('Failed to load JSONP script'));
  }
}

},{}],6:[function(require,module,exports){
module.exports = migrationLayer;

// Now onto the V2 related code:
//  If the client is using /latest/$BUILDNAME.min.js, load V2 of the library
//
//  Otherwise, setup a migration layer that will throw on old constructors like
//  new AlgoliaSearch().
//  So that users upgrading from v2 to v3 will have a clear information
//  message on what to do if they did not read the migration guide
function migrationLayer(buildName) {
  var isUsingLatest = require(7);
  var loadV2 = require(8);
  var oldGlobals = require(9);

  if (isUsingLatest(buildName)) {
    loadV2(buildName);
  } else {
    oldGlobals();
  }
}

},{"7":7,"8":8,"9":9}],7:[function(require,module,exports){
// this module helps finding if the current page is using
// the cdn.jsdelivr.net/algoliasearch/latest/$BUILDNAME.min.js version

module.exports = isUsingLatest;

function isUsingLatest(buildName) {
  var toFind = new RegExp('cdn\\.jsdelivr\\.net/algoliasearch/latest/' +
    buildName.replace('.', '\\.') + // algoliasearch, algoliasearch.angular
    '(?:\\.min)?\\.js$'); // [.min].js

  var scripts = document.getElementsByTagName('script');
  var found = false;
  for (var currentScript = 0, nbScripts = scripts.length;
        currentScript < nbScripts;
        currentScript++) {
    if (scripts[currentScript].src && toFind.test(scripts[currentScript].src)) {
      found = true;
      break;
    }
  }

  return found;
}

},{}],8:[function(require,module,exports){
(function (global){
module.exports = loadV2;

function loadV2(buildName) {
  var message =
    'Warning, you are using the `latest` version tag from jsDelivr for the AlgoliaSearch library.\n' +
    'We updated the AlgoliaSearch JavaScript client to V3, using `latest` is no more recommended.\n' +
    'Please read our migration guide at https://github.com/algolia/algoliasearch-client-js/wiki/Migration-guide-from-2.x.x-to-3.x.x';

  if (global.console) {
    if (global.console.warn) {
      global.console.warn(message);
    } else if (global.console.log) {
      global.console.log(message);
    }
  }

  // why \x3c? http://stackoverflow.com/a/236106/147079
  document.write(
    '\x3Cscript src="//cdn.jsdelivr.net/algoliasearch/2.9/' +
    buildName + '.min.js">\x3C/script>'
  );
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
(function (global){
/*global AlgoliaExplainResults:true*/
/*eslint no-unused-vars: [2, {"vars": "local"}]*/

module.exports = oldGlobals;

function oldGlobals() {
  var message =
    'You are trying to use a new version of the AlgoliaSearch JavaScript client with an old notation.' +
    '\nPlease read our migration guide at https://github.com/algolia/algoliasearch-client-js/wiki/Migration-guide-from-2.x.x-to-3.x.x';

  global.AlgoliaSearch = function() {
    throw new Error(message);
  };

  global.AlgoliaSearchHelper = function() {
    throw new Error(message);
  };

  // cannot use window.AlgoliaExplainResults on old IEs, dunno why
  AlgoliaExplainResults = function() {
    throw new Error(message);
  };
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2]);
