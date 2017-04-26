/*!
 * The MIT License (MIT)
 * 
 * Copyright (c) 2017 Kelvin Wu
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Wargamer", [], factory);
	else if(typeof exports === 'object')
		exports["Wargamer"] = factory();
	else
		root["Wargamer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 31);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagent = __webpack_require__(26);

var _superagent2 = _interopRequireDefault(_superagent);

var _APIError = __webpack_require__(14);

var _APIError2 = _interopRequireDefault(_APIError);

var _APIResponse = __webpack_require__(19);

var _APIResponse2 = _interopRequireDefault(_APIResponse);

var _Authentication = __webpack_require__(17);

var _Authentication2 = _interopRequireDefault(_Authentication);

var _Cache = __webpack_require__(11);

var _Cache2 = _interopRequireDefault(_Cache);

var _RequestError = __webpack_require__(9);

var _RequestError2 = _interopRequireDefault(_RequestError);

var _hashCode = __webpack_require__(20);

var _hashCode2 = _interopRequireDefault(_hashCode);

var _mapValues = __webpack_require__(21);

var _mapValues2 = _interopRequireDefault(_mapValues);

var _sortObjectByKey = __webpack_require__(22);

var _sortObjectByKey2 = _interopRequireDefault(_sortObjectByKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The options available to use on a client constructor.
 * @typedef {Object} ClientOptions
 * @property {string} realm - The realm/region this client is for.
 * @property {string} applicationId - The application ID of this client.
 * @property {string} [accessToken=null] - The access token for this client,
 *   if it will be using one.
 * @param {string} [language=null] - The default localization language
 *   to use for API responses.
 * @param {?number} [options.cacheTimeToLive=600000] - The time to live in
 *   milliseconds for the client's data cache entries. `null` if no there is
 *   no TTL.
 */

/**
 * The options available to use when making a single request.
 * @typedef {Object} RequestOptions
 * @property {string} [type] - The API to send this request to. One of: `wot`,
 *   `wotb`, `wotx`, `wows`, `wowp`, `wgn`.
 * @property {string} [realm] - The realm/region to use for the request.
 *   One of: `ru`, `eu`, `na`, `kr`, `asia`, `xbox`, `ps4`.
 */

/**
 * Mapping between realms and their TLDs.
 * @type {Object}
 * @constant
 * @private
 */
var REALM_TLD = {
  ru: 'ru',
  eu: 'eu',
  na: 'com',
  kr: 'kr',
  asia: 'asia',
  xbox: 'xbox',
  ps4: 'ps4'
};

/**
 * Functions which generate the base URIs for various APIs.
 * @type {Object}
 * @constant
 * @private
 */
var BASE_URI = {
  wot: function wot(realm) {
    return 'https://api.worldoftanks.' + REALM_TLD[realm] + '/wot';
  },
  wotb: function wotb(realm) {
    return 'https://api.wotblitz.' + REALM_TLD[realm] + '/wotb';
  },
  wotx: function wotx(realm) {
    return 'https://api-' + REALM_TLD[realm] + '-console.worldoftanks.com/wotx';
  },
  wows: function wows(realm) {
    return 'https://api.worldofwarships.' + REALM_TLD[realm] + '/wows';
  },
  wowp: function wowp(realm) {
    return 'https://api.worldofwarplanes.' + REALM_TLD[realm] + '/wowp';
  },
  wgn: function wgn(realm) {
    return 'https://api.worldoftanks.' + REALM_TLD[realm] + '/wgn';
  }
};

/**
 * Returns the base URI for a given realm and API type.
 * @param {string} realm - The realm/region of the server.
 * @param {string} type - The desired API.
 * @returns {string} The base URI for the API that was specified.
 * @throws {Error} Thrown if the given `realm` or `type` don't exist.
 * @private
 */
var getBaseUri = function getBaseUri(realm, type) {
  if (!REALM_TLD[realm] || !BASE_URI[type]) {
    throw new Error('Unknown realm or type given.');
  }

  return BASE_URI[type](realm);
};

/**
 * @classdesc The base API client.
 */

var BaseClient = function () {
  /**
   * Constructor.
   * @param {Object} options - The client options.
   * @param {string} options.type - The type of API this client is for.
   * @param {string} options.realm - The realm/region this client is for.
   * @param {string} options.applicationId - The application ID of this client.
   * @param {string} [options.accessToken=null] - The access token for this
   *   client, if it will be using one.
   * @param {string} [options.language=null] - The default localization language
   *   to use for API responses.
   * @param {?number} [options.cacheTimeToLive=600000] - The time to live in
   *   milliseconds for the client's data cache entries. `null` if no there is
   *   no TTL.
   * @throws {TypeError} Thrown if options are not well-formed.
   */
  function BaseClient(options) {
    _classCallCheck(this, BaseClient);

    var type = options.type,
        realm = options.realm,
        applicationId = options.applicationId,
        _options$accessToken = options.accessToken,
        accessToken = _options$accessToken === undefined ? null : _options$accessToken,
        _options$language = options.language,
        language = _options$language === undefined ? null : _options$language,
        _options$cacheTimeToL = options.cacheTimeToLive,
        cacheTimeToLive = _options$cacheTimeToL === undefined ? 600 * 1000 : _options$cacheTimeToL;


    if (typeof realm !== 'string' || !REALM_TLD[realm.toLowerCase()]) {
      throw new TypeError('Must specify a valid realm for the client.');
    } else if (typeof applicationId !== 'string') {
      throw new TypeError('Must specify an application ID for the client.');
    }

    var normalizedRealm = realm.toLowerCase();

    /**
     * The type of API this client is for.
     * @type {string}
     */
    this.type = type;

    /**
     * The realm, i.e. region of this client.
     * @type {string}
     */
    this.realm = normalizedRealm;

    /**
     * The application ID for this client.
     * @type {string}
     */
    this.applicationId = applicationId;

    /**
     * The access token for this client.
     * @type {?string}
     */
    this.accessToken = accessToken;

    /**
     * The default localization language for this client.
     * @type {?string}
     */
    this.language = language;

    /**
     * The client's Authentication module.
     * @type {Authentication}
     */
    this.authentication = new _Authentication2.default(this);

    /**
     * The base API URI for this client.
     * @type {string}
     * @private
     */
    this.baseUri = getBaseUri(normalizedRealm, type);

    /**
     * The API response cache.
     * @type {Cache}
     * @private
     */
    this.cache = new _Cache2.default({ timeToLive: cacheTimeToLive });
  }

  /**
   * Normalizes a given parameter type so the API can consume it.
   * @param {*} parameter - The parameter to normalize.
   * @returns {*} The normalized parameter.
   * @static
   * @private
   */


  _createClass(BaseClient, [{
    key: 'get',


    /**
     * Sends a GET request to the API.
     * @param {string} method - The method to request.
     * @param {Object} [params={}] - The parameters to include in the request.
     * @param {RequestOptions} [options={}] - Options used to override client defaults.
     * @returns {Promise.<APIResponse, Error>} Returns a promise resolving to the
     *   returned API data, or rejecting with an error.
     */
    value: function get(method) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.request(method, params, _extends({}, options, { method: 'GET' }));
    }

    /**
     * Sends a POST request to the API.
     * @param {string} method - The method to request.
     * @param {Object} [params={}] - The parameters to include in the request.
     * @param {RequestOptions} [options={}] - Options used to override client defaults.
     * @returns {Promise.<APIResponse, Error>} Returns a promise resolving to the
     *   returned API data, or rejecting with an error.
     */

  }, {
    key: 'post',
    value: function post(method) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.request(method, params, _extends({}, options, { method: 'POST' }));
    }

    /**
     * Fetches data from an endpoint method.
     * @param {string} apiMethod - The method to request.
     * @param {Object} [params={}] - The parameters to include in the request.
     * @param {RequestOptions} [options={}] - Options used to override client defaults.
     * @returns {Promise.<APIResponse, Error>} Returns a promise resolving to the
     *   returned API data, or rejecting with an error.
     * @private
     */

  }, {
    key: 'request',
    value: function request(apiMethod) {
      var _this = this;

      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return new Promise(function (resolve) {
        var _options$type = options.type,
            type = _options$type === undefined ? _this.type : _options$type,
            _options$realm = options.realm,
            realm = _options$realm === undefined ? _this.realm : _options$realm,
            _options$method = options.method,
            method = _options$method === undefined ? 'GET' : _options$method;


        if (typeof apiMethod !== 'string') {
          throw new TypeError('Expected API method to be a string.');
        }

        var normalizedApiMethod = apiMethod.toLowerCase();
        var normalizedRealm = realm.toLowerCase();

        // construct the request URL
        var baseUrl = normalizedRealm === _this.realm ? _this.baseUri : getBaseUri(normalizedRealm, type);
        var requestUrl = baseUrl + '/' + normalizedApiMethod.replace(/^\/*(.+?)\/*$/, '$1') + '/';

        // construct the payload
        var payload = _extends({
          application_id: _this.applicationId,
          access_token: _this.accessToken,
          language: _this.language
        }, params);

        var normalizedPayload = (0, _mapValues2.default)(payload, _this.constructor.normalizeParameterValue);

        // compute information for the cache

        var application_id = normalizedPayload.application_id,
            rest = _objectWithoutProperties(normalizedPayload, ['application_id']); // eslint-disable-line no-unused-vars


        var cacheKey = (0, _hashCode2.default)('' + requestUrl + JSON.stringify((0, _sortObjectByKey2.default)(rest)));

        var fulfillResponse = function fulfillResponse(response) {
          var _response$body$error = response.body.error,
              error = _response$body$error === undefined ? null : _response$body$error;


          if (error) {
            // Wargaming API error
            throw new _APIError2.default({
              client: _this,
              statusCode: response.status,
              method: normalizedApiMethod,
              error: error
            });
          }

          return new _APIResponse2.default({
            client: _this,
            requestRealm: normalizedRealm,
            method: normalizedApiMethod,
            body: response.body
          });
        };

        var rejectResponse = function rejectResponse(value) {
          // check if this is a HTTP error or a Wargaming error
          if (value instanceof _APIError2.default) {
            throw value;
          }

          var _value$response = value.response,
              error = _value$response.error,
              req = _value$response.req;


          throw new _RequestError2.default({
            message: value.body.error.message,
            client: _this,
            statusCode: error.status,
            url: req.url
          });
        };

        if (method === 'GET') {
          var cached = _this.cache.get(cacheKey);

          if (cached) {
            var response = new _APIResponse2.default({
              client: _this,
              requestRealm: normalizedRealm,
              method: normalizedApiMethod,
              body: cached
            });

            resolve(response);
          }

          var promise = _superagent2.default.get(requestUrl).query(normalizedPayload).then(fulfillResponse).then(function (apiResponse) {
            _this.cache.set(cacheKey, apiResponse.body);

            return apiResponse;
          }).catch(rejectResponse);

          resolve(promise);
        } else if (method === 'POST') {
          var _promise = _superagent2.default.post(requestUrl).type('form').send(normalizedPayload).then(fulfillResponse).catch(rejectResponse);

          resolve(_promise);
        }

        // we should never get here
        throw new Error('Received invalid request method.');
      });
    }
  }], [{
    key: 'normalizeParameterValue',
    value: function normalizeParameterValue(parameter) {
      if (Array.isArray(parameter)) {
        return parameter.join(',');
      } else if (parameter instanceof Date) {
        return parameter.toISOString();
      }

      return parameter;
    }
  }]);

  return BaseClient;
}();

exports.default = BaseClient;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @classdesc A module within an API client.
 */
var ClientModule =
/**
 * Constructor.
 * @param {BaseClient} client - The API client this module belongs to.
 * @param {string} name - The name of the module.
 */
function ClientModule(client, name) {
  _classCallCheck(this, ClientModule);

  /**
   * The API client this module belongs to.
   * @type {BaseClient}
   */
  this.client = client;

  /**
   * The name of the module.
   * @type {string}
   */
  this.name = name;
};

exports.default = ClientModule;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _BaseClient2 = __webpack_require__(0);

var _BaseClient3 = _interopRequireDefault(_BaseClient2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @classdesc The Wargaming.net API client.
 * @extends BaseClient
 */
var Wargaming = function (_BaseClient) {
  _inherits(Wargaming, _BaseClient);

  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  function Wargaming(options) {
    _classCallCheck(this, Wargaming);

    return _possibleConstructorReturn(this, (Wargaming.__proto__ || Object.getPrototypeOf(Wargaming)).call(this, _extends({}, options, { type: 'wgn' })));
  }

  return Wargaming;
}(_BaseClient3.default);

exports.default = Wargaming;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Accounts = __webpack_require__(15);

var _Accounts2 = _interopRequireDefault(_Accounts);

var _BaseClient2 = __webpack_require__(0);

var _BaseClient3 = _interopRequireDefault(_BaseClient2);

var _Tankopedia = __webpack_require__(16);

var _Tankopedia2 = _interopRequireDefault(_Tankopedia);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @classdesc The World of Tanks API client.
 * @extends BaseClient
 */
var WorldOfTanks = function (_BaseClient) {
  _inherits(WorldOfTanks, _BaseClient);

  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  function WorldOfTanks(options) {
    _classCallCheck(this, WorldOfTanks);

    /**
     * The client's Accounts module.
     * @type {Accounts}
     */
    var _this = _possibleConstructorReturn(this, (WorldOfTanks.__proto__ || Object.getPrototypeOf(WorldOfTanks)).call(this, _extends({}, options, { type: 'wot' })));

    _this.accounts = new _Accounts2.default(_this);

    /**
     * The client's Tankopedia module.
     * @type {Tankopedia}
     */
    _this.tankopedia = new _Tankopedia2.default(_this);
    return _this;
  }

  return WorldOfTanks;
}(_BaseClient3.default);

exports.default = WorldOfTanks;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _BaseClient2 = __webpack_require__(0);

var _BaseClient3 = _interopRequireDefault(_BaseClient2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @classdesc The World of Tanks Blitz API client.
 * @extends BaseClient
 */
var WorldOfTanksBlitz = function (_BaseClient) {
  _inherits(WorldOfTanksBlitz, _BaseClient);

  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  function WorldOfTanksBlitz(options) {
    _classCallCheck(this, WorldOfTanksBlitz);

    return _possibleConstructorReturn(this, (WorldOfTanksBlitz.__proto__ || Object.getPrototypeOf(WorldOfTanksBlitz)).call(this, _extends({}, options, { type: 'wotb' })));
  }

  return WorldOfTanksBlitz;
}(_BaseClient3.default);

exports.default = WorldOfTanksBlitz;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _BaseClient2 = __webpack_require__(0);

var _BaseClient3 = _interopRequireDefault(_BaseClient2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @classdesc The World of Tanks Console API client.
 * @extends BaseClient
 */
var WorldOfTanksConsole = function (_BaseClient) {
  _inherits(WorldOfTanksConsole, _BaseClient);

  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  function WorldOfTanksConsole(options) {
    _classCallCheck(this, WorldOfTanksConsole);

    return _possibleConstructorReturn(this, (WorldOfTanksConsole.__proto__ || Object.getPrototypeOf(WorldOfTanksConsole)).call(this, _extends({}, options, { type: 'wotx' })));
  }

  return WorldOfTanksConsole;
}(_BaseClient3.default);

exports.default = WorldOfTanksConsole;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _BaseClient2 = __webpack_require__(0);

var _BaseClient3 = _interopRequireDefault(_BaseClient2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @classdesc The World of Warplanes API client.
 * @extends BaseClient
 */
var WorldOfWarplanes = function (_BaseClient) {
  _inherits(WorldOfWarplanes, _BaseClient);

  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  function WorldOfWarplanes(options) {
    _classCallCheck(this, WorldOfWarplanes);

    return _possibleConstructorReturn(this, (WorldOfWarplanes.__proto__ || Object.getPrototypeOf(WorldOfWarplanes)).call(this, _extends({}, options, { type: 'wowp' })));
  }

  return WorldOfWarplanes;
}(_BaseClient3.default);

exports.default = WorldOfWarplanes;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _BaseClient2 = __webpack_require__(0);

var _BaseClient3 = _interopRequireDefault(_BaseClient2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @classdesc The World of Warships API client.
 * @extends BaseClient
 */
var WorldOfWarships = function (_BaseClient) {
  _inherits(WorldOfWarships, _BaseClient);

  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  function WorldOfWarships(options) {
    _classCallCheck(this, WorldOfWarships);

    return _possibleConstructorReturn(this, (WorldOfWarships.__proto__ || Object.getPrototypeOf(WorldOfWarships)).call(this, _extends({}, options, { type: 'wows' })));
  }

  return WorldOfWarships;
}(_BaseClient3.default);

exports.default = WorldOfWarships;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _es6Error = __webpack_require__(24);

var _es6Error2 = _interopRequireDefault(_es6Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @classdesc Generic API client error encountered during requests.
 * @extends ExtendableError
 */
var RequestError = function (_ExtendableError) {
  _inherits(RequestError, _ExtendableError);

  /**
   * Constructor.
   * @param {Object} options - The constructor options.
   * @param {string} options.message - The error message.
   * @param {BaseClient} options.client - The API client that the error originated
   *   from.
   * @param {number} options.statusCode - The HTTP status code of the request.
   * @param {string} options.url - The URL that the request was for.
   */
  function RequestError(_ref) {
    var message = _ref.message,
        client = _ref.client,
        statusCode = _ref.statusCode,
        url = _ref.url;

    _classCallCheck(this, RequestError);

    /**
     * The API client that the error originated from.
     * @type {BaseClient}
     */
    var _this = _possibleConstructorReturn(this, (RequestError.__proto__ || Object.getPrototypeOf(RequestError)).call(this, message));

    _this.client = client;

    /**
     * The HTTP status code of the request.
     * @type {number}
     */
    _this.statusCode = statusCode;

    /**
     * The URL of the request.
     * @type {string}
     */
    _this.url = url;
    return _this;
  }

  return RequestError;
}(_es6Error2.default);

exports.default = RequestError;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _WorldOfTanks = __webpack_require__(4);

var _WorldOfTanks2 = _interopRequireDefault(_WorldOfTanks);

var _WorldOfTanksBlitz = __webpack_require__(5);

var _WorldOfTanksBlitz2 = _interopRequireDefault(_WorldOfTanksBlitz);

var _WorldOfTanksConsole = __webpack_require__(6);

var _WorldOfTanksConsole2 = _interopRequireDefault(_WorldOfTanksConsole);

var _WorldOfWarships = __webpack_require__(8);

var _WorldOfWarships2 = _interopRequireDefault(_WorldOfWarships);

var _WorldOfWarplanes = __webpack_require__(7);

var _WorldOfWarplanes2 = _interopRequireDefault(_WorldOfWarplanes);

var _Wargaming = __webpack_require__(3);

var _Wargaming2 = _interopRequireDefault(_Wargaming);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @classdesc The Wargamer client.
 */
var Wargamer = function () {
  function Wargamer() {
    _classCallCheck(this, Wargamer);
  }

  _createClass(Wargamer, null, [{
    key: 'WoT',

    /**
     * Constructs a new World of Tanks API client.
     * @param {ClientOptions} options - The client options.
     * @returns {WorldOfTanks} The API client.
     * @static
     */
    value: function WoT(options) {
      return new _WorldOfTanks2.default(options);
    }

    /**
     * Constructs a new World of Tanks Blitz API client.
     * @param {ClientOptions} options - The client options.
     * @returns {WorldOfTanksBlitz} The API client.
     * @static
     */

  }, {
    key: 'WoTB',
    value: function WoTB(options) {
      return new _WorldOfTanksBlitz2.default(options);
    }

    /**
     * Constructs a new World of Tanks Console API client.
     * @param {ClientOptions} options - The client options.
     * @returns {WorldOfTanksConsole} The API client.
     * @static
     */

  }, {
    key: 'WoTX',
    value: function WoTX(options) {
      return new _WorldOfTanksConsole2.default(options);
    }

    /**
     * Constructs a new World of Warships API client.
     * @param {ClientOptions} options - The client options.
     * @returns {WorldOfWarships} The API client.
     * @static
     */

  }, {
    key: 'WoWS',
    value: function WoWS(options) {
      return new _WorldOfWarships2.default(options);
    }

    /**
     * Constructs a new World of Warplanes API client.
     * @param {ClientOptions} options - The client options.
     * @returns {WorldOfWarplanes} The API client.
     * @static
     */

  }, {
    key: 'WoWP',
    value: function WoWP(options) {
      return new _WorldOfWarplanes2.default(options);
    }

    /**
     * Constructs a new Wargaming.net API client.
     * @param {ClientOptions} options - The client options.
     * @returns {Wargaming} The API client.
     * @static
     */

  }, {
    key: 'WGN',
    value: function WGN(options) {
      return new _Wargaming2.default(options);
    }
  }]);

  return Wargamer;
}();

exports.default = Wargamer;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CacheEntry = __webpack_require__(12);

var _CacheEntry2 = _interopRequireDefault(_CacheEntry);

var _CacheMeta = __webpack_require__(13);

var _CacheMeta2 = _interopRequireDefault(_CacheMeta);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Options for the Cache constructor.
 * @typedef {Object} CacheOptions
 * @property {?number} [timeToLive=null] - The time to live in milliseconds for
 *   individual cache entries. `null` if there is no TTL.
 */

/**
 * @classdesc A data cache.
 */
var Cache = function () {
  /**
   * Constructor.
   * @param {CacheOptions} [options={}] - The options for the cache.
   */
  function Cache() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Cache);

    var _options$timeToLive = options.timeToLive,
        timeToLive = _options$timeToLive === undefined ? null : _options$timeToLive;

    /**
     * The TTL for cache entries in milliseconds. `null` if there is no TTL.
     * @type {?number}
     * @private
     */

    this.entryTimeToLive = timeToLive;

    /**
     * The metadata store for the cache.
     * @type {CacheMeta}
     * @private
     */
    this.meta = new _CacheMeta2.default();

    /**
     * The data store for the cache.
     * @type {Map.<string, *>}
     * @private
     */
    this.store = new Map();
  }

  /**
   * The number of keys in the cache.
   * @type {number}
   */


  _createClass(Cache, [{
    key: 'get',


    /**
     * Gets a value from the cache.
     * @param {string} key - The key of the data to get.
     * @returns {*} The cached value, or `undefined` if not found.
     */
    value: function get(key) {
      var got = this.store.get(key);

      if (!got) {
        this.meta.miss();

        return undefined;
      } else if (got.expired) {
        this.meta.expire();

        return undefined;
      }

      this.meta.hit();
      got.touch();

      return got.value;
    }

    /**
     * Sets a value in the cache.
     * @param {string} key - The key of the data to store.
     * @param {*} value - The value to store.
     * @returns {Cache} The instance this method was called on.
     */

  }, {
    key: 'set',
    value: function set(key, value) {
      var entry = new _CacheEntry2.default({ value: value, timeToLive: this.entryTimeToLive });

      this.store.set(key, entry);

      return this;
    }

    /**
     * Deletes a key from the cache.
     * @param {string} key - The key of the data to delete.
     * @returns {Cache} The instance this method was called on.
     */

  }, {
    key: 'delete',
    value: function _delete(key) {
      this.store.delete(key);

      return this;
    }

    /**
     * Clears the entries in the cache.
     * @returns {Cache} The instance this method was called on.
     */

  }, {
    key: 'clear',
    value: function clear() {
      this.store.clear();
      this.meta.clear();

      return this;
    }
  }, {
    key: 'size',
    get: function get() {
      return this.store.size;
    }

    /**
     * The keys in the cache.
     * @type {Array.<string>}
     */

  }, {
    key: 'keys',
    get: function get() {
      return [].concat(_toConsumableArray(this.store.keys()));
    }

    /**
     * `true` if the cache has no keys stored, else `false`. Prunes expired keys
     *   before returning the result.
     * @type {boolean}
     */

  }, {
    key: 'empty',
    get: function get() {
      return this.size === 0;
    }

    /**
     * The metadata for the cache.
     * @type {Object}
     */

  }, {
    key: 'statistics',
    get: function get() {
      return _extends({}, this.meta.serialize(), {
        size: this.size
      });
    }
  }]);

  return Cache;
}();

exports.default = Cache;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @classdesc An entry within a cache.
 */
var CacheEntry = function () {
  /**
   * Constructor.
   * @param {Object} options - The options to configure this entry with.
   * @param {*} options.value - The value of this cache entry.
   * @param {?number} [options.timeToLive=null] - The time to live for this
   *   entry in milliseconds. `null` if there is no TTL.
   */
  function CacheEntry(options) {
    _classCallCheck(this, CacheEntry);

    var value = options.value,
        _options$timeToLive = options.timeToLive,
        timeToLive = _options$timeToLive === undefined ? null : _options$timeToLive;

    /**
     * The value of this cache entry.
     * @type {*}
     */

    this.value = value;

    /**
     * The duration in milliseconds that this entry is valid for.
     * @type {number}
     */
    this.entryTimeToLive = timeToLive;

    /**
     * The time this entry was created.
     * @type {Date}
     */
    this.createdAt = new Date();

    /**
     * The time this entry was last accessed, or `null` if it was never accessed
     *   before.
     * @type {?Date}
     */
    this.accessedAt = null;
  }

  /**
   * Whether or not this entry has exceeded its time to live.
   * @type {boolean}
   */


  _createClass(CacheEntry, [{
    key: "touch",


    /**
     * Updates the last accessed time for this entry.
     */
    value: function touch() {
      this.accessedAt = new Date();
    }
  }, {
    key: "expired",
    get: function get() {
      if (!this.entryTimeToLive) {
        return false;
      }

      var now = new Date();
      var then = this.createdAt;

      return now.getTime() - then.getTime() >= this.entryTimeToLive;
    }
  }]);

  return CacheEntry;
}();

exports.default = CacheEntry;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @classdesc Stores metadata for a cache.
 */
var CacheMeta = function () {
  /**
   * Constructor.
   */
  function CacheMeta() {
    _classCallCheck(this, CacheMeta);

    /**
     * The time this cache was created.
     * @type {Date}
     */
    this.createdAt = new Date();

    /**
     * The time this cache was last accessed. `null` if the cache was never accessed.
     * @type {?Date}
     */
    this.accessedAt = null;

    /**
     * The time this cache was last updated. `null` if the cache was never updated.
     * @type {?Date}
     */
    this.updatedAt = null;

    /**
     * The time this cache was last reset. `null` if the cache was never reset.
     * @type {?Date}
     */
    this.clearedAt = null;

    /**
     * The number of hits on the cache.
     * @type {number}
     */
    this.hits = 0;

    /**
     * The number of misses on the cache.
     * @type {number}
     */
    this.misses = 0;

    /**
     * The number of entries that have expired in the cache.
     * @type {number}
     */
    this.expired = 0;
  }

  /**
   * Records a cache hit.
   * @returns {CacheMeta} The instance this method was called on.
   */


  _createClass(CacheMeta, [{
    key: "hit",
    value: function hit() {
      this.accessedAt = new Date();
      this.hits += 1;

      return this;
    }

    /**
     * Records a cache miss.
     * @returns {CacheMeta} The instance this method was called on.
     */

  }, {
    key: "miss",
    value: function miss() {
      this.accessedAt = new Date();
      this.misses += 1;

      return this;
    }

    /**
     * Records a cache entry expiry.
     * @returns {CacheMeta} The instance this method was called on.
     */

  }, {
    key: "expire",
    value: function expire() {
      this.expired += 1;

      return this;
    }

    /**
     * Resets the current tracked metadata.
     * @returns {CacheMeta} The instance this method was called on.
     */

  }, {
    key: "clear",
    value: function clear() {
      var now = new Date();

      this.updatedAt = now;
      this.clearedAt = now;
      this.hits = 0;
      this.misses = 0;
      this.expired = 0;

      return this;
    }

    /**
     * Returns the stored metadata as an object.
     * @returns {Object} An object containing the stored metadata.
     */

  }, {
    key: "serialize",
    value: function serialize() {
      return {
        createdAt: this.createdAt,
        accessedAt: this.accessedAt,
        updatedAt: this.updatedAt,
        clearedAt: this.clearedAt,
        hits: this.hits,
        misses: this.misses,
        expired: this.expired
      };
    }
  }]);

  return CacheMeta;
}();

exports.default = CacheMeta;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _RequestError2 = __webpack_require__(9);

var _RequestError3 = _interopRequireDefault(_RequestError2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The error object returned from Wargaming API methods.
 * @typedef {Object} WargamingAPIError
 * @property {number} code - The Wargaming API error code.
 * @property {string} message - The wargaming API error message.
 * @property {string} field - The Wargaming API error field.
 * @property {*} value - The Wargaming API error field value.
 * @private
 */

/**
 * @classdesc Error received from Wargaming's API.
 * @extends RequestError
 */
var APIError = function (_RequestError) {
  _inherits(APIError, _RequestError);

  /**
   * Constructor.
   * @param {Object} options - The constructor options.
   * @param {BaseClient} options.client - The API client that the error originated
   *   from.
   * @param {number} options.statusCode - The HTTP status code of the request.
   * @param {string} options.url - The URL that the request was for.
   * @param {string} options.requestRealm - The realm of the API that this error
   *   originated from.
   * @param {string} options.method - The API method that the request was for.
   * @param {WargamingAPIError} options.error - The error object returned from
   *   the API.
   */
  function APIError(_ref) {
    var requestRealm = _ref.requestRealm,
        method = _ref.method,
        error = _ref.error,
        rest = _objectWithoutProperties(_ref, ['requestRealm', 'method', 'error']);

    _classCallCheck(this, APIError);

    var code = error.code,
        message = error.message,
        field = error.field,
        value = error.value;

    /**
     * The realm of the API that this response originated from.
     * @type {string}
     */
    var _this = _possibleConstructorReturn(this, (APIError.__proto__ || Object.getPrototypeOf(APIError)).call(this, _extends({}, rest, {
      message: code + ': ' + message + '. Error field: ' + field + ' => ' + value + '.'
    })));

    _this.requestRealm = requestRealm;

    /**
     * The API method that the request was for.
     * @type {string}
     */
    _this.method = method;

    /**
     * The Wargaming API error code.
     * @type {number}
     */
    _this.code = code;

    /**
     * The message corresponding to the error code.
     * @type {string}
     */
    _this.apiMessage = message;

    /**
     * The field which was flagged in the error.
     * @type {string}
     */
    _this.field = field;

    /**
     * The value of the field which was flagged in the error.
     * @type {*}
     */
    _this.value = value;
    return _this;
  }

  return APIError;
}(_RequestError3.default);

exports.default = APIError;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ClientModule2 = __webpack_require__(1);

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @classdesc Module for the World of Tanks Accounts endpoint.
 * @extends ClientModule
 */
var Accounts = function (_ClientModule) {
  _inherits(Accounts, _ClientModule);

  /**
   * Constructor.
   * @param {BaseClient} client - The API client this module belongs to.
   */
  function Accounts(client) {
    _classCallCheck(this, Accounts);

    return _possibleConstructorReturn(this, (Accounts.__proto__ || Object.getPrototypeOf(Accounts)).call(this, client, 'accounts'));
  }

  /**
   * Searches for player IDs given a nickname. Supports the search types available
   *   on the `account/list` endpoint.
   * @param {string} name - The player's nickname.
   * @param {string} [searchType='exact'] - The search type to use.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<(Array.<Object>|number|null), Error>} A promise resolving
   *   to the returned search results.
   * If `searchType` is `'startswith'`, the resolved value matches the data returned
   *   by the `account/list` endpoint.
   * If `searchType` is `'exact'`, the resolved value is the matching player's ID,
   *   or `null` if no match was found.
   */


  _createClass(Accounts, [{
    key: 'findPlayerId',
    value: function findPlayerId(name) {
      var _this2 = this;

      var searchType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'exact';
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return new Promise(function (resolve) {
        switch (searchType.toLowerCase()) {
          case 'startswith':
            return resolve(_this2.client.get('account/list', { search: name }, options).then(function (response) {
              return response.data;
            }));
          case 'exact':
            return resolve(_this2.client.get('account/list', { search: name }, options).then(function (response) {
              return response.data[0] ? response.data[0].account_id : null;
            }));
          default:
            throw new Error('Invalid search type specified for player search.');
        }
      });
    }
  }]);

  return Accounts;
}(_ClientModule3.default);

exports.default = Accounts;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fuse = __webpack_require__(25);

var _fuse2 = _interopRequireDefault(_fuse);

var _ClientModule2 = __webpack_require__(1);

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _localize = __webpack_require__(18);

var _localize2 = _interopRequireDefault(_localize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @classdesc Module for the World of Tanks Tankopedia endpoint.
 * @extends ClientModule
 */
var Tankopedia = function (_ClientModule) {
  _inherits(Tankopedia, _ClientModule);

  /**
   * Constructor.
   * @param {BaseClient} client - The API client this module belongs to.
   */
  function Tankopedia(client) {
    _classCallCheck(this, Tankopedia);

    /**
     * The module's Fuse object.
     * @type {Fuse}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (Tankopedia.__proto__ || Object.getPrototypeOf(Tankopedia)).call(this, client, 'tankopedia'));

    _this.fuse = new _fuse2.default([], {
      keys: ['name', 'short_name']
    });
    return _this;
  }

  /**
   * Searches for a vehicle by name or ID and returns its entry from the
   *   `encyclopedia/vehicles` endpoint.
   * @param {(number|string)} identifier - The vehicle identifier to use for
   *   lookup. If a number is supplied, it is treated as the vehicle's ID.
   *   If a string is supplied, the identifier is matched against vehicle names
   *   with the closest match being selected.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<?Object, Error>} A promise resolving to the data for the
   *   matched vehicle, or `null` if no vehicles were matched.
   */


  _createClass(Tankopedia, [{
    key: 'findVehicle',
    value: function findVehicle(identifier) {
      var _this2 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return new Promise(function (resolve) {
        if (typeof identifier === 'number') {
          resolve(_this2.client.get('encyclopedia/vehicles', { tank_id: identifier }, options).then(function (response) {
            return response.data[identifier];
          }));
        } else if (typeof identifier === 'string') {
          resolve(_this2.client.get('encyclopedia/vehicles', {
            fields: ['name', 'short_name', 'tank_id']
          }, options).then(function (response) {
            var vehicles = response.data;

            _this2.fuse.set(Object.keys(vehicles).reduce(function (accumulated, next) {
              return [].concat(_toConsumableArray(accumulated), [vehicles[next]]);
            }, []));

            var results = _this2.fuse.search(identifier);

            if (!results.length) {
              return null;
            }

            var _results = _slicedToArray(results, 1),
                tank_id = _results[0].tank_id;

            return _this2.client.get('encyclopedia/vehicles', { tank_id: tank_id }, options).then(function (detailedResponse) {
              return detailedResponse.data[tank_id];
            });
          }));
        }

        throw new TypeError('Expected a string or number as the vehicle identifier.');
      });
    }

    /**
     * Localizes a crew role slug.
     * @param {string} slug - The slug.
     * @param {RequestOptions} [options={}] - The options for the request.
     * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
     *   translated slug, or `undefined` if it couldn't be translated.
     */

  }, {
    key: 'localizeCrewRole',
    value: function localizeCrewRole(slug) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _localize2.default.call(this, {
        method: 'encyclopedia/info',
        type: 'vehicle_crew_roles',
        slug: slug,
        options: options
      });
    }

    /**
     * Localizes a language slug.
     * @param {string} slug - The slug.
     * @param {RequestOptions} [options={}] - The options for the request.
     * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
     *   translated slug, or `undefined` if it couldn't be translated.
     */

  }, {
    key: 'localizeLanguage',
    value: function localizeLanguage(slug) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _localize2.default.call(this, {
        method: 'encyclopedia/info',
        type: 'languages',
        slug: slug,
        options: options
      });
    }

    /**
     * Localizes an achievement section slug. The returned value is the section's
     *   name.
     * @param {string} slug - The slug.
     * @param {RequestOptions} [options={}] - The options for the request.
     * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
     *   translated slug, or `undefined` if it couldn't be translated.
     */

  }, {
    key: 'localizeAchievementSection',
    value: function localizeAchievementSection(slug) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _localize2.default.call(this, {
        method: 'encyclopedia/info',
        type: 'achievement_sections',
        slug: slug,
        options: options
      }).then(function (section) {
        return section && section.name;
      });
    }

    /**
     * Localizes a vehicle type slug.
     * @param {string} slug - The slug.
     * @param {RequestOptions} [options={}] - The options for the request.
     * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
     *   translated slug, or `undefined` if it couldn't be translated.
     */

  }, {
    key: 'localizeVehicleType',
    value: function localizeVehicleType(slug) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _localize2.default.call(this, {
        method: 'encyclopedia/info',
        type: 'vehicle_types',
        slug: slug,
        options: options
      });
    }

    /**
     * Localizes a vehicle nation slug.
     * @param {string} slug - The slug.
     * @param {RequestOptions} [options={}] - The options for the request.
     * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
     *   translated slug, or `undefined` if it couldn't be translated.
     */

  }, {
    key: 'localizeVehicleNation',
    value: function localizeVehicleNation(slug) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _localize2.default.call(this, {
        method: 'encyclopedia/info',
        type: 'vehicle_nations',
        slug: slug,
        options: options
      });
    }
  }]);

  return Tankopedia;
}(_ClientModule3.default);

exports.default = Tankopedia;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ClientModule2 = __webpack_require__(1);

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @classdesc Module for Authentication endpoints.
 * @extends ClientModule
 */
var Authentication = function (_ClientModule) {
  _inherits(Authentication, _ClientModule);

  /**
   * Constructor.
   * @param {BaseClient} client - The API client this module belongs to.
   */
  function Authentication(client) {
    _classCallCheck(this, Authentication);

    return _possibleConstructorReturn(this, (Authentication.__proto__ || Object.getPrototypeOf(Authentication)).call(this, client, 'authentication'));
  }

  /**
   * Sends a request to renew the client's access token. Upon a successful
   *   request, the client's current access token will be updated with the
   *   returned token.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<APIResponse, Error>} Returns the same value as a normal
   *   request if the client's access token is defined, else rejects with a
   *   plain `Error`.
   */


  _createClass(Authentication, [{
    key: 'renewAccessToken',
    value: function renewAccessToken() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new Promise(function (resolve) {
        if (!_this2.client.accessToken) {
          throw new Error('Failed to renew access token: client\'s access token is not set.');
        }

        resolve(_this2.client.post('auth/prolongate', {}, _extends({}, options, {
          type: _this2.client.type === 'wotx' ? 'wotx' : 'wot'
        })).then(function (response) {
          _this2.client.accessToken = response.data.access_token;

          return response;
        }));
      });
    }

    /**
     * Sends a request to invalidate the client's access token. Upon a successful
     *   request, the client's current access token will be set to `null`.
     * @param {RequestOptions} [options={}] - The options for the request.
     * @returns {Promise.<APIResponse, Error>} Returns the same value as a normal
     *   request if the client's access token is defined, else rejects with a
     *   plain `Error`.
     */

  }, {
    key: 'destroyAccessToken',
    value: function destroyAccessToken() {
      var _this3 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new Promise(function (resolve) {
        if (!_this3.client.accessToken) {
          throw new Error('Failed to invalidate access token: client\'s access token is not set.');
        }

        resolve(_this3.client.post('auth/logout', {}, _extends({}, options, {
          type: _this3.client.type === 'wotx' ? 'wotx' : 'wot'
        })).then(function (response) {
          _this3.client.accessToken = null;

          return response;
        }));
      });
    }
  }]);

  return Authentication;
}(_ClientModule3.default);

exports.default = Authentication;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = localize;
/**
 * Localizes a slug using values returned from an API endpoint.
 * @param {Object} params - The function parameters.
 * @param {string} params.method - The API method which returns the localization data.
 * @param {string} params.type - The type of slug being localized.
 * @param {string} params.slug - The slug being localized.
 * @param {RequestOptions} [params.options={}] - The options for the request.
 * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
 *   translated slug, or `undefined` if it couldn't be translated.
 * @this {ClientModule}
 * @private
 */
function localize(_ref) {
  var method = _ref.method,
      type = _ref.type,
      slug = _ref.slug,
      _ref$options = _ref.options,
      options = _ref$options === undefined ? {} : _ref$options;

  return this.client.get(method, {}, options).then(function (response) {
    var translations = response.data[type];

    if (!translations || (typeof translations === 'undefined' ? 'undefined' : _typeof(translations)) !== 'object') {
      throw new Error('Invalid translation type: ' + type + '.');
    }

    return translations[slug];
  });
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @classdesc Wraps a response from the Wargaming API.
 */
var APIResponse = function () {
  /**
   * Constructor.
   * @param {Object} data - The response data.
   * @param {BaseClient} data.client - The API client that the response originated
   *   from.
   * @param {string} data.requestRealm - The realm of the API that this response
   *   originated from.
   * @param {string} data.method - The name of the method that was used to get
   *   this response data.
   * @param {Object} data.body - The parsed JSON data from the API.
   */
  function APIResponse(_ref) {
    var client = _ref.client,
        requestRealm = _ref.requestRealm,
        method = _ref.method,
        body = _ref.body;

    _classCallCheck(this, APIResponse);

    /**
     * The API client that the response originated from.
     * @type {BaseClient}
     */
    this.client = client;

    /**
     * The realm of the API that this response originated from.
     * @type {string}
     */
    this.requestRealm = requestRealm;

    /**
     * The name of the API method that gave this response.
     * @type {string}
     */
    this.method = method;

    /**
     * The response's parsed JSON data.
     * @type {Object}
     */
    this.body = body;
  }

  /**
   * The value of the meta object returned in the response.
   * @type {Object}
   */


  _createClass(APIResponse, [{
    key: "meta",
    get: function get() {
      return this.body.meta;
    }

    /**
     * The value of the data object returned in the response.
     * @type {Object}
     */

  }, {
    key: "data",
    get: function get() {
      return this.body.data;
    }
  }]);

  return APIResponse;
}();

exports.default = APIResponse;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hashCode;
/**
 * JavaScript version of Java's String.hashCode() method.
 * @param {string} string - The string to hash.
 * @return {string} The hashed string.
 * @private
 */
function hashCode(string) {
  var hash = 0;

  if (!string.length) {
    return hash.toString();
  }

  for (var i = 0; i < string.length; ++i) {
    var char = string.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash &= hash;
  }

  return hash.toString();
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mapValues;
/**
 * Identical to `Array.prototype.map()` except for object values.
 * @param {Object} object - The object whose values will be mapped.
 * @param {Function} callback - The callback to map the object values. Gets passed
 *   equivalent parameters as `Array.prototype.map()`.
 * @returns {Object} A new mapped object.
 * @private
 */
function mapValues(object) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (value) {
    return value;
  };

  var keys = Object.keys(object);

  return keys.reduce(function (mapped, nextKey) {
    mapped[nextKey] = callback(object[nextKey], nextKey, object); // eslint-disable-line

    return mapped;
  }, {});
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sortObjectByKey;
/**
 * Consumes an object and produces a new object with the same keys, but inserted
 *   in sorted order.
 * @param {Object} object - The object to sort.
 * @returns {Object} The sorted object.
 * @private
 */
function sortObjectByKey(object) {
  return Object.keys(object).sort().reduce(function (built, next) {
    built[next] = object[next]; // eslint-disable-line no-param-reassign

    return built;
  }, {});
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

var ExtendableError = function (_extendableBuiltin2) {
  _inherits(ExtendableError, _extendableBuiltin2);

  function ExtendableError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, ExtendableError);

    // extending Error is weird and does not propagate `message`
    var _this = _possibleConstructorReturn(this, (ExtendableError.__proto__ || Object.getPrototypeOf(ExtendableError)).call(this, message));

    Object.defineProperty(_this, 'message', {
      configurable: true,
      enumerable: false,
      value: message,
      writable: true
    });

    Object.defineProperty(_this, 'name', {
      configurable: true,
      enumerable: false,
      value: _this.constructor.name,
      writable: true
    });

    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(_this, _this.constructor);
      return _possibleConstructorReturn(_this);
    }

    Object.defineProperty(_this, 'stack', {
      configurable: true,
      enumerable: false,
      value: new Error(message).stack,
      writable: true
    });
    return _this;
  }

  return ExtendableError;
}(_extendableBuiltin(Error));

exports.default = ExtendableError;
module.exports = exports['default'];


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @license
 * Fuse - Lightweight fuzzy-search
 *
 * Copyright (c) 2012-2016 Kirollos Risk <kirollos@gmail.com>.
 * All Rights Reserved. Apache Software License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
;(function (global) {
  'use strict'

  /** @type {function(...*)} */
  function log () {
    console.log.apply(console, arguments)
  }

  var defaultOptions = {
    // The name of the identifier property. If specified, the returned result will be a list
    // of the items' dentifiers, otherwise it will be a list of the items.
    id: null,

    // Indicates whether comparisons should be case sensitive.

    caseSensitive: false,

    // An array of values that should be included from the searcher's output. When this array
    // contains elements, each result in the list will be of the form `{ item: ..., include1: ..., include2: ... }`.
    // Values you can include are `score`, `matchedLocations`
    include: [],

    // Whether to sort the result list, by score
    shouldSort: true,

    // The search function to use
    // Note that the default search function ([[Function]]) must conform to the following API:
    //
    //  @param pattern The pattern string to search
    //  @param options The search option
    //  [[Function]].constructor = function(pattern, options)
    //
    //  @param text: the string to search in for the pattern
    //  @return Object in the form of:
    //    - isMatch: boolean
    //    - score: Int
    //  [[Function]].prototype.search = function(text)
    searchFn: BitapSearcher,

    // Default sort function
    sortFn: function (a, b) {
      return a.score - b.score
    },

    // The get function to use when fetching an object's properties.
    // The default will search nested paths *ie foo.bar.baz*
    getFn: deepValue,

    // List of properties that will be searched. This also supports nested properties.
    keys: [],

    // Will print to the console. Useful for debugging.
    verbose: false,

    // When true, the search algorithm will search individual words **and** the full string,
    // computing the final score as a function of both. Note that when `tokenize` is `true`,
    // the `threshold`, `distance`, and `location` are inconsequential for individual tokens.
    tokenize: false,

    // When true, the result set will only include records that match all tokens. Will only work
    // if `tokenize` is also true.
    matchAllTokens: false,

    // Regex used to separate words when searching. Only applicable when `tokenize` is `true`.
    tokenSeparator: / +/g,

    // Minimum number of characters that must be matched before a result is considered a match
    minMatchCharLength: 1,

    // When true, the algorithm continues searching to the end of the input even if a perfect
    // match is found before the end of the same input.
    findAllMatches: false
  }

  /**
   * @constructor
   * @param {!Array} list
   * @param {!Object<string, *>} options
   */
  function Fuse (list, options) {
    var i
    var len
    var key
    var keys

    this.list = list
    this.options = options = options || {}

    for (key in defaultOptions) {
      if (!defaultOptions.hasOwnProperty(key)) {
        continue;
      }
      // Add boolean type options
      if (typeof defaultOptions[key] === 'boolean') {
        this.options[key] = key in options ? options[key] : defaultOptions[key];
      // Add all other options
      } else {
        this.options[key] = options[key] || defaultOptions[key]
      }
    }
  }

  Fuse.VERSION = '2.6.0'

  /**
   * Sets a new list for Fuse to match against.
   * @param {!Array} list
   * @return {!Array} The newly set list
   * @public
   */
  Fuse.prototype.set = function (list) {
    this.list = list
    return list
  }

  Fuse.prototype.search = function (pattern) {
    if (this.options.verbose) log('\nSearch term:', pattern, '\n')

    this.pattern = pattern
    this.results = []
    this.resultMap = {}
    this._keyMap = null

    this._prepareSearchers()
    this._startSearch()
    this._computeScore()
    this._sort()

    var output = this._format()
    return output
  }

  Fuse.prototype._prepareSearchers = function () {
    var options = this.options
    var pattern = this.pattern
    var searchFn = options.searchFn
    var tokens = pattern.split(options.tokenSeparator)
    var i = 0
    var len = tokens.length

    if (this.options.tokenize) {
      this.tokenSearchers = []
      for (; i < len; i++) {
        this.tokenSearchers.push(new searchFn(tokens[i], options))
      }
    }
    this.fullSeacher = new searchFn(pattern, options)
  }

  Fuse.prototype._startSearch = function () {
    var options = this.options
    var getFn = options.getFn
    var list = this.list
    var listLen = list.length
    var keys = this.options.keys
    var keysLen = keys.length
    var key
    var weight
    var item = null
    var i
    var j

    // Check the first item in the list, if it's a string, then we assume
    // that every item in the list is also a string, and thus it's a flattened array.
    if (typeof list[0] === 'string') {
      // Iterate over every item
      for (i = 0; i < listLen; i++) {
        this._analyze('', list[i], i, i)
      }
    } else {
      this._keyMap = {}
      // Otherwise, the first item is an Object (hopefully), and thus the searching
      // is done on the values of the keys of each item.
      // Iterate over every item
      for (i = 0; i < listLen; i++) {
        item = list[i]
        // Iterate over every key
        for (j = 0; j < keysLen; j++) {
          key = keys[j]
          if (typeof key !== 'string') {
            weight = (1 - key.weight) || 1
            this._keyMap[key.name] = {
              weight: weight
            }
            if (key.weight <= 0 || key.weight > 1) {
              throw new Error('Key weight has to be > 0 and <= 1')
            }
            key = key.name
          } else {
            this._keyMap[key] = {
              weight: 1
            }
          }
          this._analyze(key, getFn(item, key, []), item, i)
        }
      }
    }
  }

  Fuse.prototype._analyze = function (key, text, entity, index) {
    var options = this.options
    var words
    var scores
    var exists = false
    var existingResult
    var averageScore
    var finalScore
    var scoresLen
    var mainSearchResult
    var tokenSearcher
    var termScores
    var word
    var tokenSearchResult
    var hasMatchInText
    var checkTextMatches
    var i
    var j

    // Check if the text can be searched
    if (text === undefined || text === null) {
      return
    }

    scores = []

    var numTextMatches = 0

    if (typeof text === 'string') {
      words = text.split(options.tokenSeparator)

      if (options.verbose) log('---------\nKey:', key)

      if (this.options.tokenize) {
        for (i = 0; i < this.tokenSearchers.length; i++) {
          tokenSearcher = this.tokenSearchers[i]

          if (options.verbose) log('Pattern:', tokenSearcher.pattern)

          termScores = []
          hasMatchInText = false

          for (j = 0; j < words.length; j++) {
            word = words[j]
            tokenSearchResult = tokenSearcher.search(word)
            var obj = {}
            if (tokenSearchResult.isMatch) {
              obj[word] = tokenSearchResult.score
              exists = true
              hasMatchInText = true
              scores.push(tokenSearchResult.score)
            } else {
              obj[word] = 1
              if (!this.options.matchAllTokens) {
                scores.push(1)
              }
            }
            termScores.push(obj)
          }

          if (hasMatchInText) {
            numTextMatches++
          }

          if (options.verbose) log('Token scores:', termScores)
        }

        averageScore = scores[0]
        scoresLen = scores.length
        for (i = 1; i < scoresLen; i++) {
          averageScore += scores[i]
        }
        averageScore = averageScore / scoresLen

        if (options.verbose) log('Token score average:', averageScore)
      }

      mainSearchResult = this.fullSeacher.search(text)
      if (options.verbose) log('Full text score:', mainSearchResult.score)

      finalScore = mainSearchResult.score
      if (averageScore !== undefined) {
        finalScore = (finalScore + averageScore) / 2
      }

      if (options.verbose) log('Score average:', finalScore)

      checkTextMatches = (this.options.tokenize && this.options.matchAllTokens) ? numTextMatches >= this.tokenSearchers.length : true

      if (options.verbose) log('Check Matches', checkTextMatches)

      // If a match is found, add the item to <rawResults>, including its score
      if ((exists || mainSearchResult.isMatch) && checkTextMatches) {
        // Check if the item already exists in our results
        existingResult = this.resultMap[index]

        if (existingResult) {
          // Use the lowest score
          // existingResult.score, bitapResult.score
          existingResult.output.push({
            key: key,
            score: finalScore,
            matchedIndices: mainSearchResult.matchedIndices
          })
        } else {
          // Add it to the raw result list
          this.resultMap[index] = {
            item: entity,
            output: [{
              key: key,
              score: finalScore,
              matchedIndices: mainSearchResult.matchedIndices
            }]
          }

          this.results.push(this.resultMap[index])
        }
      }
    } else if (isArray(text)) {
      for (i = 0; i < text.length; i++) {
        this._analyze(key, text[i], entity, index)
      }
    }
  }

  Fuse.prototype._computeScore = function () {
    var i
    var j
    var keyMap = this._keyMap
    var totalScore
    var output
    var scoreLen
    var score
    var weight
    var results = this.results
    var bestScore
    var nScore

    if (this.options.verbose) log('\n\nComputing score:\n')

    for (i = 0; i < results.length; i++) {
      totalScore = 0
      output = results[i].output
      scoreLen = output.length

      bestScore = 1

      for (j = 0; j < scoreLen; j++) {
        score = output[j].score
        weight = keyMap ? keyMap[output[j].key].weight : 1

        nScore = score * weight

        if (weight !== 1) {
          bestScore = Math.min(bestScore, nScore)
        } else {
          totalScore += nScore
          output[j].nScore = nScore
        }
      }

      if (bestScore === 1) {
        results[i].score = totalScore / scoreLen
      } else {
        results[i].score = bestScore
      }

      if (this.options.verbose) log(results[i])
    }
  }

  Fuse.prototype._sort = function () {
    var options = this.options
    if (options.shouldSort) {
      if (options.verbose) log('\n\nSorting....')
      this.results.sort(options.sortFn)
    }
  }

  Fuse.prototype._format = function () {
    var options = this.options
    var getFn = options.getFn
    var finalOutput = []
    var item
    var i
    var len
    var results = this.results
    var replaceValue
    var getItemAtIndex
    var include = options.include

    if (options.verbose) log('\n\nOutput:\n\n', results)

    // Helper function, here for speed-up, which replaces the item with its value,
    // if the options specifies it,
    replaceValue = options.id ? function (index) {
      results[index].item = getFn(results[index].item, options.id, [])[0]
    } : function () {}

    getItemAtIndex = function (index) {
      var record = results[index]
      var data
      var j
      var output
      var _item
      var _result

      // If `include` has values, put the item in the result
      if (include.length > 0) {
        data = {
          item: record.item
        }
        if (include.indexOf('matches') !== -1) {
          output = record.output
          data.matches = []
          for (j = 0; j < output.length; j++) {
            _item = output[j]
            _result = {
              indices: _item.matchedIndices
            }
            if (_item.key) {
              _result.key = _item.key
            }
            data.matches.push(_result)
          }
        }

        if (include.indexOf('score') !== -1) {
          data.score = results[index].score
        }

      } else {
        data = record.item
      }

      return data
    }

    // From the results, push into a new array only the item identifier (if specified)
    // of the entire item.  This is because we don't want to return the <results>,
    // since it contains other metadata
    for (i = 0, len = results.length; i < len; i++) {
      replaceValue(i)
      item = getItemAtIndex(i)
      finalOutput.push(item)
    }

    return finalOutput
  }

  // Helpers

  function deepValue (obj, path, list) {
    var firstSegment
    var remaining
    var dotIndex
    var value
    var i
    var len

    if (!path) {
      // If there's no path left, we've gotten to the object we care about.
      list.push(obj)
    } else {
      dotIndex = path.indexOf('.')

      if (dotIndex !== -1) {
        firstSegment = path.slice(0, dotIndex)
        remaining = path.slice(dotIndex + 1)
      } else {
        firstSegment = path
      }

      value = obj[firstSegment]
      if (value !== null && value !== undefined) {
        if (!remaining && (typeof value === 'string' || typeof value === 'number')) {
          list.push(value)
        } else if (isArray(value)) {
          // Search each item in the array.
          for (i = 0, len = value.length; i < len; i++) {
            deepValue(value[i], remaining, list)
          }
        } else if (remaining) {
          // An object. Recurse further.
          deepValue(value, remaining, list)
        }
      }
    }

    return list
  }

  function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  /**
   * Adapted from "Diff, Match and Patch", by Google
   *
   *   http://code.google.com/p/google-diff-match-patch/
   *
   * Modified by: Kirollos Risk <kirollos@gmail.com>
   * -----------------------------------------------
   * Details: the algorithm and structure was modified to allow the creation of
   * <Searcher> instances with a <search> method which does the actual
   * bitap search. The <pattern> (the string that is searched for) is only defined
   * once per instance and thus it eliminates redundant re-creation when searching
   * over a list of strings.
   *
   * Licensed under the Apache License, Version 2.0 (the "License")
   * you may not use this file except in compliance with the License.
   *
   * @constructor
   */
  function BitapSearcher (pattern, options) {
    options = options || {}
    this.options = options
    this.options.location = options.location || BitapSearcher.defaultOptions.location
    this.options.distance = 'distance' in options ? options.distance : BitapSearcher.defaultOptions.distance
    this.options.threshold = 'threshold' in options ? options.threshold : BitapSearcher.defaultOptions.threshold
    this.options.maxPatternLength = options.maxPatternLength || BitapSearcher.defaultOptions.maxPatternLength

    this.pattern = options.caseSensitive ? pattern : pattern.toLowerCase()
    this.patternLen = pattern.length

    if (this.patternLen <= this.options.maxPatternLength) {
      this.matchmask = 1 << (this.patternLen - 1)
      this.patternAlphabet = this._calculatePatternAlphabet()
    }
  }

  BitapSearcher.defaultOptions = {
    // Approximately where in the text is the pattern expected to be found?
    location: 0,

    // Determines how close the match must be to the fuzzy location (specified above).
    // An exact letter match which is 'distance' characters away from the fuzzy location
    // would score as a complete mismatch. A distance of '0' requires the match be at
    // the exact location specified, a threshold of '1000' would require a perfect match
    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
    distance: 100,

    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
    // (of both letters and location), a threshold of '1.0' would match anything.
    threshold: 0.6,

    // Machine word size
    maxPatternLength: 32
  }

  /**
   * Initialize the alphabet for the Bitap algorithm.
   * @return {Object} Hash of character locations.
   * @private
   */
  BitapSearcher.prototype._calculatePatternAlphabet = function () {
    var mask = {},
      i = 0

    for (i = 0; i < this.patternLen; i++) {
      mask[this.pattern.charAt(i)] = 0
    }

    for (i = 0; i < this.patternLen; i++) {
      mask[this.pattern.charAt(i)] |= 1 << (this.pattern.length - i - 1)
    }

    return mask
  }

  /**
   * Compute and return the score for a match with `e` errors and `x` location.
   * @param {number} errors Number of errors in match.
   * @param {number} location Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  BitapSearcher.prototype._bitapScore = function (errors, location) {
    var accuracy = errors / this.patternLen,
      proximity = Math.abs(this.options.location - location)

    if (!this.options.distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy
    }
    return accuracy + (proximity / this.options.distance)
  }

  /**
   * Compute and return the result of the search
   * @param {string} text The text to search in
   * @return {{isMatch: boolean, score: number}} Literal containing:
   *                          isMatch - Whether the text is a match or not
   *                          score - Overall score for the match
   * @public
   */
  BitapSearcher.prototype.search = function (text) {
    var options = this.options
    var i
    var j
    var textLen
    var findAllMatches
    var location
    var threshold
    var bestLoc
    var binMin
    var binMid
    var binMax
    var start, finish
    var bitArr
    var lastBitArr
    var charMatch
    var score
    var locations
    var matches
    var isMatched
    var matchMask
    var matchedIndices
    var matchesLen
    var match

    text = options.caseSensitive ? text : text.toLowerCase()

    if (this.pattern === text) {
      // Exact match
      return {
        isMatch: true,
        score: 0,
        matchedIndices: [[0, text.length - 1]]
      }
    }

    // When pattern length is greater than the machine word length, just do a a regex comparison
    if (this.patternLen > options.maxPatternLength) {
      matches = text.match(new RegExp(this.pattern.replace(options.tokenSeparator, '|')))
      isMatched = !!matches

      if (isMatched) {
        matchedIndices = []
        for (i = 0, matchesLen = matches.length; i < matchesLen; i++) {
          match = matches[i]
          matchedIndices.push([text.indexOf(match), match.length - 1])
        }
      }

      return {
        isMatch: isMatched,
        // TODO: revisit this score
        score: isMatched ? 0.5 : 1,
        matchedIndices: matchedIndices
      }
    }

    findAllMatches = options.findAllMatches

    location = options.location
    // Set starting location at beginning text and initialize the alphabet.
    textLen = text.length
    // Highest score beyond which we give up.
    threshold = options.threshold
    // Is there a nearby exact match? (speedup)
    bestLoc = text.indexOf(this.pattern, location)

    // a mask of the matches
    matchMask = []
    for (i = 0; i < textLen; i++) {
      matchMask[i] = 0
    }

    if (bestLoc != -1) {
      threshold = Math.min(this._bitapScore(0, bestLoc), threshold)
      // What about in the other direction? (speed up)
      bestLoc = text.lastIndexOf(this.pattern, location + this.patternLen)

      if (bestLoc != -1) {
        threshold = Math.min(this._bitapScore(0, bestLoc), threshold)
      }
    }

    bestLoc = -1
    score = 1
    locations = []
    binMax = this.patternLen + textLen

    for (i = 0; i < this.patternLen; i++) {
      // Scan for the best match; each iteration allows for one more error.
      // Run a binary search to determine how far from the match location we can stray
      // at this error level.
      binMin = 0
      binMid = binMax
      while (binMin < binMid) {
        if (this._bitapScore(i, location + binMid) <= threshold) {
          binMin = binMid
        } else {
          binMax = binMid
        }
        binMid = Math.floor((binMax - binMin) / 2 + binMin)
      }

      // Use the result from this iteration as the maximum for the next.
      binMax = binMid
      start = Math.max(1, location - binMid + 1)
      if (findAllMatches) {
        finish = textLen;
      } else {
        finish = Math.min(location + binMid, textLen) + this.patternLen
      }

      // Initialize the bit array
      bitArr = Array(finish + 2)

      bitArr[finish + 1] = (1 << i) - 1

      for (j = finish; j >= start; j--) {
        charMatch = this.patternAlphabet[text.charAt(j - 1)]

        if (charMatch) {
          matchMask[j - 1] = 1
        }

        if (i === 0) {
          // First pass: exact match.
          bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch
        } else {
          // Subsequent passes: fuzzy match.
          bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch | (((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1) | lastBitArr[j + 1]
        }
        if (bitArr[j] & this.matchmask) {
          score = this._bitapScore(i, j - 1)

          // This match will almost certainly be better than any existing match.
          // But check anyway.
          if (score <= threshold) {
            // Indeed it is
            threshold = score
            bestLoc = j - 1
            locations.push(bestLoc)

            if (bestLoc > location) {
              // When passing loc, don't exceed our current distance from loc.
              start = Math.max(1, 2 * location - bestLoc)
            } else {
              // Already passed loc, downhill from here on in.
              break
            }
          }
        }
      }

      // No hope for a (better) match at greater error levels.
      if (this._bitapScore(i + 1, location) > threshold) {
        break
      }
      lastBitArr = bitArr
    }

    matchedIndices = this._getMatchedIndices(matchMask)

    // Count exact matches (those with a score of 0) to be "almost" exact
    return {
      isMatch: bestLoc >= 0,
      score: score === 0 ? 0.001 : score,
      matchedIndices: matchedIndices
    }
  }

  BitapSearcher.prototype._getMatchedIndices = function (matchMask) {
    var matchedIndices = []
    var start = -1
    var end = -1
    var i = 0
    var match
    var len = matchMask.length
    for (; i < len; i++) {
      match = matchMask[i]
      if (match && start === -1) {
        start = i
      } else if (!match && start !== -1) {
        end = i - 1
        if ((end - start) + 1 >= this.options.minMatchCharLength) {
            matchedIndices.push([start, end])
        }
        start = -1
      }
    }
    if (matchMask[i - 1]) {
      if ((i-1 - start) + 1 >= this.options.minMatchCharLength) {
        matchedIndices.push([start, i - 1])
      }
    }
    return matchedIndices
  }

  // Export to Common JS Loader
  if (true) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = Fuse
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function () {
      return Fuse
    })
  } else {
    // Browser globals (root is window)
    global.Fuse = Fuse
  }

})(this);


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = __webpack_require__(23);
var RequestBase = __webpack_require__(28);
var isObject = __webpack_require__(2);
var isFunction = __webpack_require__(27);
var ResponseBase = __webpack_require__(29);

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function(method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
}

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only verison of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
      status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD'
      ? this._parseBody(this.text ? this.text : this.xhr.response)
      : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str){
  var parse = request.parse[this.type];
  if(this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;
      }
    } catch(e) {
      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto',
    }
  }

  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + btoa(user + ':' + pass));
    break;

    case 'auto':
      this.username = user;
      this.password = pass;
    break;
  }
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, options){
  if (this._data) {
    throw Error("superagent can't mix .send() and .attach()");
  }

  this._getFormData().append(field, file, options || file.name);
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function(){
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */

Request.prototype._appendQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if (isFunction(this._sort)) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
}

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var data = this._formData || this._data;

  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  }
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // querystring
  this._appendQueryString();

  this._setTimeouts();

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn){
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Check if `fn` is a function.
 *
 * @param {Function} fn
 * @return {Boolean}
 * @api private
 */
var isObject = __webpack_require__(2);

function isFunction(fn) {
  var tag = isObject(fn) ? Object.prototype.toString.call(fn) : '';
  return tag === '[object Function]';
}

module.exports = isFunction;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = __webpack_require__(2);

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout(){
  this._timeout = 0;
  this._responseTimeout = 0;
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, read, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options){
  if (!options || 'object' !== typeof options) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  if ('undefined' !== typeof options.deadline) {
    this._timeout = options.deadline;
  }
  if ('undefined' !== typeof options.response) {
    this._responseTimeout = options.response;
  }
  return this;
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
      self.end(function(err, res){
        if (err) innerReject(err); else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
}

RequestBase.prototype.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
}

RequestBase.prototype.ok = function(cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function(res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};


/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function(name, val) {

  // name should be either a string or an object.
  if (null === name ||  undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function(){
  // This is browser-only functionality. Node side is no-op.
  this._withCredentials = true;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function(){
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};


/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function(data){
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};


/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function(sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function(reason, timeout){
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function() {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self._timeoutError('Timeout of ', self._timeout);
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function(){
      self._timeoutError('Response timeout of ', self._responseTimeout);
    }, this._responseTimeout);
  }
}


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var utils = __webpack_require__(30);

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function(field){
    return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function(header){
    // TODO: moar!
    // TODO: make this a util

    // content-type
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);

    // params
    var params = utils.params(ct);
    for (var key in params) this[key] = params[key];

    this.links = {};

    // links
    try {
        if (header.link) {
            this.links = utils.parseLinks(header.link);
        }
    } catch (err) {
        // ignore
    }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function(status){
    var type = status / 100 | 0;

    // status / class
    this.status = this.statusCode = status;
    this.statusType = type;

    // basics
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;

    // sugar
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {


/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function(str){
  return str.split(/ *, */).reduce(function(obj, str){
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function(header, shouldStripCookie){
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  if (shouldStripCookie) {
    delete header['cookie'];
  }
  return header;
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wargaming = exports.WorldOfWarplanes = exports.WorldOfWarships = exports.WorldOfTanksConsole = exports.WorldOfTanksBlitz = exports.WorldOfTanks = undefined;

var _Wargamer = __webpack_require__(10);

var _Wargamer2 = _interopRequireDefault(_Wargamer);

var _WorldOfTanks = __webpack_require__(4);

var _WorldOfTanks2 = _interopRequireDefault(_WorldOfTanks);

var _WorldOfTanksBlitz = __webpack_require__(5);

var _WorldOfTanksBlitz2 = _interopRequireDefault(_WorldOfTanksBlitz);

var _WorldOfTanksConsole = __webpack_require__(6);

var _WorldOfTanksConsole2 = _interopRequireDefault(_WorldOfTanksConsole);

var _WorldOfWarships = __webpack_require__(8);

var _WorldOfWarships2 = _interopRequireDefault(_WorldOfWarships);

var _WorldOfWarplanes = __webpack_require__(7);

var _WorldOfWarplanes2 = _interopRequireDefault(_WorldOfWarplanes);

var _Wargaming = __webpack_require__(3);

var _Wargaming2 = _interopRequireDefault(_Wargaming);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.WorldOfTanks = _WorldOfTanks2.default;
exports.WorldOfTanksBlitz = _WorldOfTanksBlitz2.default;
exports.WorldOfTanksConsole = _WorldOfTanksConsole2.default;
exports.WorldOfWarships = _WorldOfWarships2.default;
exports.WorldOfWarplanes = _WorldOfWarplanes2.default;
exports.Wargaming = _Wargaming2.default;
exports.default = _Wargamer2.default;

/***/ })
/******/ ]);
});
//# sourceMappingURL=wargamer.js.map