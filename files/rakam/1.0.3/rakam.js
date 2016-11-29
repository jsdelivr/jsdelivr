(function umd(require){
  if ('object' == typeof exports) {
    module.exports = require('1');
  } else if ('function' == typeof define && define.amd) {
    define(function(){ return require('1'); });
  } else {
    this['rakam'] = require('1');
  }
})((function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
/* jshint expr:true */

var Rakam = require('./rakam');

var old = window.rakam || {};
var instance = new Rakam();
instance._q = old._q || [];

// export the instance
module.exports = instance;
}, {"./rakam":2}],
2: [function(require, module, exports) {
var Cookie = require('./cookie');
var JSON = require('json'); // jshint ignore:line
var language = require('./language');
var localStorage = require('./localstorage');  // jshint ignore:line
//var md5 = require('JavaScript-MD5');
var object = require('object');
var Request = require('./xhr');
var UUID = require('./uuid');
var version = require('./version');
var User = require('./user');
var ifvisible = require('../node_modules/ifvisible.js/src/ifvisible.min.js');
var type = require('./type');

var log = function (s) {
    console.log('[Rakam] ' + s);
};

var indexOf;
if (!Array.prototype.indexOf) {
    indexOf = function (obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
} else {
    indexOf = Array.prototype.indexOf;
}

var API_VERSION = 1;
var DEFAULT_OPTIONS = {
    apiEndpoint: 'app.rakam.io',
    eventEndpointPath: '/event/batch',
    cookieExpiration: 365 * 10,
    cookieName: 'rakam_id',
    domain: undefined,
    includeUtm: false,
    trackForms: false,
    language: language.language,
    optOut: false,
    platform: 'Web',
    savedMaxCount: 1000,
    saveEvents: true,
    sessionTimeout: 30 * 60 * 1000,
    unsentKey: 'rakam_unsent',
    uploadBatchSize: 100,
    batchEvents: false,
    eventUploadThreshold: 30,
    eventUploadPeriodMillis: 30 * 1000 // 30s
};
var LocalStorageKeys = {
    LAST_ID: 'rakam_lastEventId',
    LAST_EVENT_TIME: 'rakam_lastEventTime',
    SESSION_ID: 'rakam_sessionId',
    RETURNING_SESSION: 'rakam_returning'
};

/*
 * Rakam API
 */
var Rakam = function () {
    this._unsentEvents = [];
    this.options = object.merge({}, DEFAULT_OPTIONS);
};


Rakam.prototype._eventId = 0;
Rakam.prototype._returningUser = false;
Rakam.prototype._sending = false;
Rakam.prototype._lastEventTime = null;
Rakam.prototype._sessionId = null;
Rakam.prototype._newSession = false;

/**
 * Initializes Rakam.
 * apiKey The API Key for your app
 * opt_userId An identifier for this user
 * opt_config Configuration options
 *   - saveEvents (boolean) Whether to save events to local storage. Defaults to true.
 *   - includeUtm (boolean) Whether to send utm parameters with events. Defaults to false.
 */
Rakam.prototype.init = function (apiKey, opt_userId, opt_config, callback) {
    try {
        if (!apiKey) {
            throw new Error("apiKey is null");
        }
        this.options.apiKey = apiKey;

        var user = new User();
        user.init(this.options);
        this.User = function () {
            return user;
        };

        if (opt_config) {
            this.options.apiEndpoint = opt_config.apiEndpoint || this.options.apiEndpoint;

            if (opt_config.saveEvents !== undefined) {
                this.options.saveEvents = !!opt_config.saveEvents;
            }
            if (opt_config.domain !== undefined) {
                this.options.domain = opt_config.domain;
            }
            if (opt_config.includeUtm !== undefined) {
                this.options.includeUtm = !!opt_config.includeUtm;
            }
            if (opt_config.trackClicks !== undefined) {
                this.options.trackClicks = !!opt_config.trackClicks;
            }
            if (opt_config.trackForms !== undefined) {
                this.options.trackForms = !!opt_config.trackForms;
            }
            if (opt_config.batchEvents !== undefined) {
                this.options.batchEvents = !!opt_config.batchEvents;
            }
            this.options.platform = opt_config.platform || this.options.platform;
            this.options.language = opt_config.language || this.options.language;
            this.options.sessionTimeout = opt_config.sessionTimeout || this.options.sessionTimeout;
            this.options.uploadBatchSize = opt_config.uploadBatchSize || this.options.uploadBatchSize;
            this.options.eventUploadThreshold = opt_config.eventUploadThreshold || this.options.eventUploadThreshold;
            this.options.savedMaxCount = opt_config.savedMaxCount || this.options.savedMaxCount;
            this.options.eventUploadPeriodMillis = opt_config.eventUploadPeriodMillis || this.options.eventUploadPeriodMillis;
            this.options.superProperties = opt_config.superProperties || [];
        }

        Cookie.options({
            expirationDays: this.options.cookieExpiration,
            domain: this.options.domain
        });
        this.options.domain = Cookie.options().domain;

        _loadCookieData(this);

        if ((opt_config && opt_config.deviceId !== undefined && opt_config.deviceId !== null && opt_config.deviceId) || this.options.deviceId) {
            this.options.deviceId = this.options.deviceId;
        } else {
            this.deviceIdCreatedAt = new Date();
            this.options.deviceId = UUID();
        }

        _saveCookieData(this);

        log('initialized with apiKey=' + apiKey);

        if (this.options.saveEvents) {
            var savedUnsentEventsString = localStorage.getItem(this.options.unsentKey);
            if (savedUnsentEventsString) {
                try {
                    this._unsentEvents = JSON.parse(savedUnsentEventsString);
                } catch (e) {
                    log(e);
                }
            }
        }

        this._sendEventsIfReady();

        if (this.options.includeUtm) {
            this._initUtmData();
        }

        if (this.options.trackForms) {
            this._initTrackForms();
        }

        if (this.options.trackClicks) {
            this._initTrackClicks();
        }

        this._lastEventTime = parseInt(localStorage.getItem(LocalStorageKeys.LAST_EVENT_TIME)) || null;
        this._sessionId = parseInt(localStorage.getItem(LocalStorageKeys.SESSION_ID)) || null;

        this._eventId = localStorage.getItem(LocalStorageKeys.LAST_ID) || 0;
        var now = new Date().getTime();
        if (!this._sessionId || !this._lastEventTime || now - this._lastEventTime > this.options.sessionTimeout) {
            if (this._sessionId !== null || this.options.userId !== null) {
                localStorage.setItem(LocalStorageKeys.RETURNING_SESSION, true);
                this._returningUser = true;
            }
            this._sessionId = now;
            Cookie.remove('_rakam_time');
            localStorage.setItem(LocalStorageKeys.SESSION_ID, this._sessionId);
        } else {
            this._returningUser = localStorage.getItem(LocalStorageKeys.RETURNING_SESSION) === 'true';
        }
        this._lastEventTime = now;
        localStorage.setItem(LocalStorageKeys.LAST_EVENT_TIME, this._lastEventTime);
    } catch (e) {
        log(e);
    }

    this.setUserId(opt_userId);

    if (callback && typeof(callback) === 'function') {
        setTimeout(function () {
            callback();
        }, 1);
    }
};

Rakam.prototype.onEvent = function (callback) {
    this.options.eventCallbacks = this.options.eventCallbacks || [];
    this.options.eventCallbacks.push(callback);
};


var transformValue = function (attribute, value, type) {
    if (type !== null) {
        type = type.toLowerCase();
    }
    if (type === 'long' || type === 'time' || type === 'timestamp' || type === 'date') {
        value = parseInt(value);
        if (isNaN(value) || !isFinite(value)) {
            log("ignoring " + attribute + ": the value must be a number");
            value = null;
        }
    } else if (type === 'double') {
        value = parseFloat(value);
        if (isNaN(value) || !isFinite(value)) {
            log("ignoring " + attribute + ": the value is not double");
            value = null;
        }
    } else if (type === 'boolean') {
        if (type === "true" || type === "1") {
            value = true;
        } else if (type === "false" || type === "0") {
            value = false;
        } else {
            log("ignoring " + attribute + ": the value is not boolean");
            value = null;
        }
    }
    return value;
};

Rakam.prototype.logInlinedEvent = function (collection, extraProperties, callback) {

    var getAllElementsWithAttribute = function (attribute) {
        if (document.querySelectorAll) {
            return document.querySelectorAll('[rakam-event-attribute]');
        }
        var matchingElements = [];
        var allElements = document.getElementsByTagName('*');
        for (var i = 0, n = allElements.length; i < n; i++) {
            if (allElements[i].getAttribute(attribute) !== null) {
                matchingElements.push(allElements[i]);
            }
        }
        return matchingElements;
    };

    var properties = extraProperties || {};
    var elements = getAllElementsWithAttribute('rakam-event-attribute');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var attribute = element.getAttribute('rakam-event-attribute');
        var value = element.getAttribute('rakam-event-attribute-value');
        var type = element.getAttribute('rakam-event-attribute-type');
        if (value === null) {
            if (element.tagName === 'INPUT') {
                value = element.value;
            } else if (element.tagName === 'SELECT') {
                var option = element.options[element.selectedIndex];
                if (option.value !== null && option.value !== "") {
                    var attr = element.getAttribute('rakam-attribute-value');

                    if (attr !== "value") {
                        value = option.value;
                    } else {
                        value = option.text;
                    }
                }
            } else if (element.innerText) {
                value = element.innerText.replace(/^\s+|\s+$/g, '');
            } else {
                log('Could find value of DOM element.', element);
            }
        }
        if (value !== null && value !== '') {
            properties[attribute] = transformValue(attribute, value, type);
        }

    }
    this.logEvent(collection, properties, callback);
};

Rakam.prototype.isReturningUser = function () {
    return this._returningUser;
};

var gapMillis = 0;
var startTime = (new Date()).getTime();
var idleTime;

Rakam.prototype.startTimer = function (saveOnClose) {

    startTime = (new Date()).getTime();

    ifvisible.on("idle", function () {
        idleTime = (new Date()).getTime();
    });

    ifvisible.on("wakeup", function () {
        gapMillis += (new Date()).getTime() - idleTime;
        idleTime = null;
    });

    if (saveOnClose) {
        var func;
        if (window.onbeforeunload !== null) {
            func = window.onbeforeunload;
        }
        var _this = this;
        window.onbeforeunload = function (e) {
            Cookie.set("_rakam_time", _this.getTimeOnPage());

            if (func) {
                func(e);
            }
        };
    }
};

Rakam.prototype.getTimeOnPage = function () {
    return ((idleTime > 0 ? idleTime : (new Date()).getTime()) - startTime - gapMillis) / 1000;
};

Rakam.prototype.getTimeOnPreviousPage = function () {
    return Cookie.get('_rakam_time');
};

Rakam.prototype.nextEventId = function () {
    this._eventId++;
    return this._eventId;
};

// returns true if sendEvents called immediately
Rakam.prototype._sendEventsIfReady = function (callback) {
    if (this._unsentEvents.length === 0) {
        return false;
    }

    if (!this.options.batchEvents) {
        this.sendEvents(callback);
        return true;
    }

    if (this._unsentEvents.length >= this.options.eventUploadThreshold) {
        this.sendEvents(callback);
        return true;
    }

    setTimeout(this.sendEvents.bind(this), this.options.eventUploadPeriodMillis);
    return false;
};

var _loadCookieData = function (scope) {
    var cookieData = Cookie.get(scope.options.cookieName);
    if (cookieData) {
        if (cookieData.deviceId) {
            scope.options.deviceId = cookieData.deviceId;
        }
        if (cookieData.userId) {
            scope.options.userId = cookieData.userId;
        }
        if (cookieData.superProps) {
            scope.options.superProperties = cookieData.superProps;
        }
        if (cookieData.optOut !== undefined) {
            scope.options.optOut = cookieData.optOut;
        }
        if (cookieData.deviceIdCreatedAt !== undefined) {
            scope.deviceIdCreatedAt = new Date(parseInt(cookieData.deviceIdCreatedAt));
        }
    }
};

var _saveCookieData = function (scope) {
    Cookie.set(scope.options.cookieName, {
        deviceId: scope.options.deviceId,
        deviceIdCreatedAt: scope.deviceIdCreatedAt ? scope.deviceIdCreatedAt.getTime() : undefined,
        userId: scope.options.userId,
        superProps: scope.options.superProperties,
        optOut: scope.options.optOut
    });
};

Rakam._getUtmParam = function (name, query) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(query);
    return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, " "));
};

Rakam._getUtmData = function (rawCookie, query) {
    // Translate the utmz cookie format into url query string format.
    var cookie = rawCookie ? '?' + rawCookie.split('.').slice(-1)[0].replace(/\|/g, '&') : '';

    var fetchParam = function (queryName, query, cookieName, cookie) {
        return Rakam._getUtmParam(queryName, query) ||
            Rakam._getUtmParam(cookieName, cookie);
    };

    return {
        utm_source: fetchParam('utm_source', query, 'utmcsr', cookie),
        utm_medium: fetchParam('utm_medium', query, 'utmcmd', cookie),
        utm_campaign: fetchParam('utm_campaign', query, 'utmccn', cookie),
        utm_term: fetchParam('utm_term', query, 'utmctr', cookie),
        utm_content: fetchParam('utm_content', query, 'utmcct', cookie)
    };
};

/**
 * Parse the utm properties out of cookies and query for adding to user properties.
 */
Rakam.prototype._initUtmData = function (queryParams, cookieParams) {
    queryParams = queryParams || location.search;
    cookieParams = cookieParams || Cookie.get('__utmz');
    this._utmProperties = Rakam._getUtmData(cookieParams, queryParams);
};

Rakam.prototype._initTrackForms = function () {
    document.addEventListener('submit', function (event) {
        var targetElement = event.target || event.srcElement;
        var collection = targetElement.getAttribute('rakam-event-form');
        if (targetElement.tagName === 'FORM' && collection) {
            var properties = {};

            var extraAttributes = targetElement.getAttribute("rakam-event-extra");
            if (extraAttributes !== null) {
                for (var key in JSON.parse(extraAttributes)) {
                    if (extraAttributes.hasOwnProperty(key)) {
                        properties[key] = extraAttributes[key];
                    }
                }
            }

            for (var i = 0; i < targetElement.elements.length; i++) {
                var element = targetElement.elements[i];

                var type = element.getAttribute('rakam-event-attribute-type');
                var formElemType;
                if (element.hasAttribute('type')) {
                    formElemType = element.getAttribute('type').toLowerCase();
                }

                if (formElemType === "password") {
                    continue;
                }

                if (type === null && element.tagName === 'INPUT' && formElemType === 'number') {
                    type = "long";
                }

                if (element.hasAttribute("rakam-event-form-element-ignore")) {
                    continue;
                }

                var attribute;
                if (element.hasAttribute("rakam-event-attribute")) {
                    attribute = element.getAttribute("rakam-event-attribute");
                } else {
                    attribute = element.getAttribute("name");
                }


                if (element.hasAttribute("rakam-event-attribute-value")) {
                    properties[attribute] = transformValue(attribute, element.getAttribute('rakam-event-attribute-value'), type);
                } else if (element.tagName === 'SELECT') {
                    properties[attribute] = transformValue(attribute, element.options[element.selectedIndex].value, type);
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    properties[attribute] = transformValue(attribute, element.value, type);
                } else {
                    log("Couldn't get value of form element: " + attribute);
                }

            }

            this.logEvent(collection, properties);
        }
    });
};

Rakam.prototype._initTrackClicks = function () {
    document.addEventListener('click', function (event) {
        var targetElement = event.target || event.srcElement;
        var collection = targetElement.getAttribute('rakam-event-track');
        if (targetElement.tagName === 'FORM' && collection) {
            var properties = {};

            var extraAttributes = targetElement.getAttribute("rakam-event-properties");
            if (extraAttributes !== null) {
                for (var key in JSON.parse(extraAttributes)) {
                    if (extraAttributes.hasOwnProperty(key)) {
                        properties[key] = extraAttributes[key];
                    }
                }
            }

            this.logEvent(collection, properties);
        }
    });
};

Rakam.prototype.saveEvents = function () {
    try {
        localStorage.setItem(this.options.unsentKey, JSON.stringify(this._unsentEvents));
    } catch (e) {
        log(e);
    }
};

Rakam.prototype.setDomain = function (domain) {
    try {
        Cookie.options({
            domain: domain
        });
        this.options.domain = Cookie.options().domain;
        _loadCookieData(this);
        _saveCookieData(this);
        log('set domain=' + domain);
    } catch (e) {
        log(e);
    }
};

Rakam.prototype.setUserId = function (userId) {
    try {
        var previousUserId = this.options.userId;
        this.options.userId = (userId !== undefined && userId !== null && ('' + userId)) || null;

        if (userId !== null && userId !== undefined && ((this._eventId > 0 && (previousUserId === null || previousUserId === undefined)) ||
            (previousUserId !== null && previousUserId !== undefined && this.deviceIdCreatedAt !== undefined))) {
            var _this = this;
            this.User()._merge(previousUserId, this.deviceIdCreatedAt, function () {
                _this.deviceIdCreatedAt = undefined;
                _saveCookieData(_this);
            });
        }

        _saveCookieData(this);
        log('set userId=' + userId);
    } catch (e) {
        log(e);
    }
};

Rakam.prototype.setUserProperties = function (parameters) {
    try {
        return new this.User().set(parameters);
    } catch (e) {
        log(e);
    }
};

Rakam.prototype.getUserId = function () {
    return this.options.userId;
};

Rakam.prototype.getDeviceId = function () {
    return this._eventId > 0 ? this.options.deviceId : null;
};

Rakam.prototype.setOptOut = function (enable) {
    try {
        this.options.optOut = enable;
        _saveCookieData(this);
        log('set optOut=' + enable);
    } catch (e) {
        log(e);
    }
};

Rakam.prototype.setDeviceId = function (deviceId) {
    try {
        if (deviceId) {
            this.options.deviceId = ('' + deviceId);
            console.log(this.options, deviceId);
            _saveCookieData(this);
        }
    } catch (e) {
        log(e);
    }
};

Rakam.prototype.setSuperProperties = function (eventProps, opt_replace) {
    try {
        this.options.superProperties = this.options.superProperties || {};
        for (var property in eventProps) {
            if (eventProps.hasOwnProperty(property)) {
                if (opt_replace === false && this.options.superProperties[property] !== undefined) {
                    continue;
                }
                this.options.superProperties[property] = eventProps[property];
            }
        }

        _saveCookieData(this);
        log('set super properties=' + JSON.stringify(eventProps));
    } catch (e) {
        log(e);
    }
};

Rakam.prototype.setVersionName = function (versionName) {
    try {
        this.options.versionName = versionName;
        log('set versionName=' + versionName);
    } catch (e) {
        log(e);
    }
};

/**
 * Private logEvent method. Keeps apiProperties from being publicly exposed.
 */
Rakam.prototype._logEvent = function (eventType, eventProperties, apiProperties, callback) {
    if (typeof callback !== 'function') {
        callback = null;
    }

    if (!eventType || this.options.optOut) {
        if (callback) {
            callback(0, 'No request sent');
        }
        return;
    }
    try {
        var eventTime = new Date().getTime();
        var eventId = this.nextEventId();
        if (!this._sessionId || !this._lastEventTime || eventTime - this._lastEventTime > this.options.sessionTimeout) {
            this._sessionId = eventTime;
            localStorage.setItem(LocalStorageKeys.SESSION_ID, this._sessionId);
        }
        this._lastEventTime = eventTime;
        localStorage.setItem(LocalStorageKeys.LAST_EVENT_TIME, this._lastEventTime);
        localStorage.setItem(LocalStorageKeys.LAST_ID, eventId);

        apiProperties = apiProperties || {};
        eventProperties = eventProperties || {};

        // Add the utm properties, if any, onto the event properties.
        object.merge(eventProperties, this._utmProperties);

        var event = {
            collection: eventType,
            properties: {
                _device_id: this.options.deviceId,
                _user: this.options.userId,
                // use seconds
                _time: parseInt(eventTime / 1000) * 1000,
                _session_id: this._sessionId || -1,
                _platform: this.options.platform,
                _language: this.options.language
            }
        };

        object.merge(event.properties, this.options.superProperties);
        object.merge(event.properties, apiProperties);
        object.merge(event.properties, eventProperties);

        log('logged eventType=' + eventType + ', properties=' + JSON.stringify(eventProperties));

        this._unsentEvents.push({id: eventId, event: event});

        // Remove old events from the beginning of the array if too many
        // have accumulated. Don't want to kill memory. Default is 1000 events.
        if (this._unsentEvents.length > this.options.savedMaxCount) {
            this._unsentEvents.splice(0, this._unsentEvents.length - this.options.savedMaxCount);
        }

        if (this.options.saveEvents) {
            this.saveEvents();
        }

        if (!this._sendEventsIfReady(callback) && callback) {
            callback(0, 'No request sent');
        }

        return eventId;
    } catch (e) {
        log(e);
    }
};

Rakam.prototype.logEvent = function (eventType, eventProperties, callback) {
    return this._logEvent(eventType, eventProperties, null, callback);
};

/**
 * Remove events in storage with event ids up to and including maxEventId. Does
 * a true filter in case events get out of order or old events are removed.
 */
Rakam.prototype.removeEvents = function (maxEventId, errors) {
    var filteredEvents = [];
    var errorList = errors || [];

    for (var i = 0; i < this._unsentEvents.length; i++) {
        var id = this._unsentEvents[i].id;
        if (errorList.indexOf(id) > -1 || id > maxEventId) {
            filteredEvents.push(this._unsentEvents[i]);
        }
    }
    this._unsentEvents = filteredEvents;
};

Rakam.prototype.sendEvents = function (callback) {
    if (!this._sending && !this.options.optOut && this._unsentEvents.length > 0) {
        this._sending = true;
        var url = ('https:' === window.location.protocol ? 'https' : 'http') + '://' + this.options.apiEndpoint + this.options.eventEndpointPath;

        // Determine how many events to send and track the maximum event id sent in this batch.
        var numEvents = Math.min(this._unsentEvents.length, this.options.uploadBatchSize);
        var maxEventId = this._unsentEvents[numEvents - 1].id;

        this._unsentEvents.slice(0, numEvents);
        var events = this._unsentEvents.slice(0, numEvents).map(function (e) {
            return e.event;
        });
        var upload_time = new Date().getTime();

        var api = {
            "upload_time": upload_time,
            "api_version": API_VERSION,
            "api_key": this.options.apiKey
            //"checksum": md5(API_VERSION + JSON.stringify(events) + upload_time).toUpperCase()
        };

        var scope = this;
        new Request(url, {
            api: api,
            events: events
        }).send(function (status, response, headers) {
            scope._sending = false;

            try {
                if (status === 200 || status === 409) {
                    log('successful upload');

                    scope.removeEvents(maxEventId, status === 409 ? JSON.parse(response) : null);

                    // Update the event cache after the removal of sent events.
                    if (scope.options.saveEvents) {
                        scope.saveEvents();
                    }

                    // Send more events if any queued during previous send.
                    if (!scope._sendEventsIfReady(callback) && callback) {
                        callback(status, response);
                    }

                } else if (status === 413) {
                    log('request too large');
                    // Can't even get this one massive event through. Drop it.
                    if (scope.options.uploadBatchSize === 1) {
                        scope.removeEvents(maxEventId);
                    }

                    // The server complained about the length of the request.
                    // Backoff and try again.
                    scope.options.uploadBatchSize = Math.ceil(numEvents / 2);
                    scope.sendEvents(callback);

                } else if (callback) { // If server turns something like a 400
                    callback(status, response);
                }
            } catch (e) {
                log('failed upload');
            }

            if (scope.options.eventCallbacks) {
                try {
                    for (var i = 0; i < scope.options.eventCallbacks.length; i++) {
                        scope.options.eventCallbacks[i](status, response, headers);
                    }
                } catch (e) {
                    log('callback throwed an exception', e);
                }
            }
        });
    } else if (callback) {
        callback(0, 'No request sent');
    }
};

Rakam.prototype.onload = function (callback) {
    setTimeout(function () {
        callback();
        log("executed callback", callback);
    }, 1);
};

Rakam.prototype.runQueuedFunctions = function () {
    for (var i = 0; i < this._q.length; i++) {
        var fn = this[this._q[i][0]];
        if (fn && type(fn) === 'function') {
            fn.apply(this, this._q[i].slice(1));
        }
    }
    this._q = []; // clear function queue after running
};


Rakam.prototype.__VERSION__ = version;

module.exports = Rakam;

}, {"./cookie":3,"json":4,"./language":5,"./localstorage":6,"object":7,"./xhr":8,"./uuid":9,"./version":10,"./user":11,"../node_modules/ifvisible.js/src/ifvisible.min.js":12,"./type":13}],
3: [function(require, module, exports) {
/*
 * Cookie data
 */

var Base64 = require('./base64');
var JSON = require('json'); // jshint ignore:line
var topDomain = require('top-domain');


var _options = {
  expirationDays: undefined,
  domain: undefined
};


var reset = function() {
  _options = {};
};


var options = function(opts) {
  if (arguments.length === 0) {
    return _options;
  }

  opts = opts || {};

  _options.expirationDays = opts.expirationDays;

  var domain = (opts.domain !== undefined) ? opts.domain : '.' + topDomain(window.location.href);
  var token = Math.random();
  _options.domain = domain;
  set('rakam_test', token);
  var stored = get('rakam_test');
  if (!stored || stored !== token) {
    domain = null;
  }
  remove('rakam_test');
  _options.domain = domain;
};

var _domainSpecific = function(name) {
  // differentiate between cookies on different domains
  var suffix = '';
  if (_options.domain) {
    suffix = _options.domain.charAt(0) === '.' ? _options.domain.substring(1) : _options.domain;
  }
  return name + suffix;
};


var get = function(name) {
  try {
    var nameEq = _domainSpecific(name) + '=';
    var ca = document.cookie.split(';');
    var value = null;
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEq) === 0) {
        value = c.substring(nameEq.length, c.length);
        break;
      }
    }

    if (value) {
      return JSON.parse(Base64.decode(value));
    }
    return null;
  } catch (e) {
    return null;
  }
};


var set = function(name, value) {
  try {
    _set(_domainSpecific(name), Base64.encode(JSON.stringify(value)), _options);
    return true;
  } catch (e) {
    return false;
  }
};


var _set = function(name, value, opts) {
  var expires = value !== null ? opts.expirationDays : -1 ;
  if (expires) {
    var date = new Date();
    date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
    expires = date;
  }
  var str = name + '=' + value;
  if (expires) {
    str += '; expires=' + expires.toUTCString();
  }
  str += '; path=/';
  if (opts.domain) {
    str += '; domain=' + opts.domain;
  }
  document.cookie = str;
};


var remove = function(name) {
  try {
    _set(_domainSpecific(name), null, _options);
    return true;
  } catch (e) {
    return false;
  }
};


module.exports = {
  reset: reset,
  options: options,
  get: get,
  set: set,
  remove: remove

};

}, {"./base64":14,"json":4,"top-domain":15}],
14: [function(require, module, exports) {
/* jshint bitwise: false */
/* global escape, unescape */

var UTF8 = require('./utf8');

/*
 * Base64 encoder/decoder
 * http://www.webtoolkit.info/
 */
var Base64 = {
    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

    encode: function (input) {
        try {
            if (window.btoa && window.atob) {
                return window.btoa(unescape(encodeURIComponent(input)));
            }
        } catch (e) {
            //log(e);
        }
        return Base64._encode(input);
    },

    _encode: function (input) {
        var output = '';
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = UTF8.encode(input);

        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
            Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
        }
        return output;
    },

    decode: function (input) {
        try {
            if (window.btoa && window.atob) {
                return decodeURIComponent(escape(window.atob(input)));
            }
        } catch (e) {
            //log(e);
        }
        return Base64._decode(input);
    },

    _decode: function (input) {
        var output = '';
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

        while (i < input.length) {
            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = UTF8.decode(output);
        return output;
    }
};

module.exports = Base64;

}, {"./utf8":16}],
16: [function(require, module, exports) {
/* jshint bitwise: false */

/*
 * UTF-8 encoder/decoder
 * http://www.webtoolkit.info/
 */
var UTF8 = {
    encode: function (s) {
        var utftext = '';

        for (var n = 0; n < s.length; n++) {
            var c = s.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },

    decode: function (utftext) {
        var s = '';
        var i = 0;
        var c = 0, c1 = 0, c2 = 0;

        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                s += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c1 = utftext.charCodeAt(i+1);
                s += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
                i += 2;
            }
            else {
                c1 = utftext.charCodeAt(i+1);
                c2 = utftext.charCodeAt(i+2);
                s += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
                i += 3;
            }
        }
        return s;
    }
};

module.exports = UTF8;

}, {}],
4: [function(require, module, exports) {

var json = window.JSON || {};
var stringify = json.stringify;
var parse = json.parse;

module.exports = parse && stringify
  ? JSON
  : require('json-fallback');

}, {"json-fallback":17}],
17: [function(require, module, exports) {
/*
    json2.js
    2014-02-04

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

(function () {
    'use strict';

    var JSON = module.exports = {};

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

}, {}],
15: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var parse = require('url').parse;

/**
 * Expose `domain`
 */

module.exports = domain;

/**
 * RegExp
 */

var regexp = /[a-z0-9][a-z0-9\-]*[a-z0-9]\.[a-z\.]{2,6}$/i;

/**
 * Get the top domain.
 * 
 * Official Grammar: http://tools.ietf.org/html/rfc883#page-56
 * Look for tlds with up to 2-6 characters.
 * 
 * Example:
 * 
 *      domain('http://localhost:3000/baz');
 *      // => ''
 *      domain('http://dev:3000/baz');
 *      // => ''
 *      domain('http://127.0.0.1:3000/baz');
 *      // => ''
 *      domain('http://segment.io/baz');
 *      // => 'segment.io'
 * 
 * @param {String} url
 * @return {String}
 * @api public
 */

function domain(url){
  var host = parse(url).hostname;
  var match = host.match(regexp);
  return match ? match[0] : '';
};

}, {"url":18}],
18: [function(require, module, exports) {

/**
 * Parse the given `url`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(url){
  var a = document.createElement('a');
  a.href = url;
  return {
    href: a.href,
    host: a.host || location.host,
    port: ('0' === a.port || '' === a.port) ? port(a.protocol) : a.port,
    hash: a.hash,
    hostname: a.hostname || location.hostname,
    pathname: a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname,
    protocol: !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,
    search: a.search,
    query: a.search.slice(1)
  };
};

/**
 * Check if `url` is absolute.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isAbsolute = function(url){
  return 0 == url.indexOf('//') || !!~url.indexOf('://');
};

/**
 * Check if `url` is relative.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isRelative = function(url){
  return !exports.isAbsolute(url);
};

/**
 * Check if `url` is cross domain.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isCrossDomain = function(url){
  url = exports.parse(url);
  var location = exports.parse(window.location.href);
  return url.hostname !== location.hostname
    || url.port !== location.port
    || url.protocol !== location.protocol;
};

/**
 * Return default port for `protocol`.
 *
 * @param  {String} protocol
 * @return {String}
 * @api private
 */
function port (protocol){
  switch (protocol) {
    case 'http:':
      return 80;
    case 'https:':
      return 443;
    default:
      return location.port;
  }
}

}, {}],
5: [function(require, module, exports) {
var getLanguage = function() {
    return (navigator && ((navigator.languages && navigator.languages[0]) ||
        navigator.language || navigator.userLanguage)) || undefined;
};

module.exports = {
    language: getLanguage()
};

}, {}],
6: [function(require, module, exports) {
/* jshint -W020, unused: false, noempty: false, boss: true */

/*
 * Implement localStorage to support Firefox 2-3 and IE 5-7
 */
var localStorage; // jshint ignore:line

// test that Window.localStorage is available and works
function windowLocalStorageAvailable() {
  var uid = new Date();
  var result;
  try {
    window.localStorage.setItem(uid, uid);
    result = window.localStorage.getItem(uid) === String(uid);
    window.localStorage.removeItem(uid);
    return result;
  } catch (e) {
    // localStorage not available
  }
  return false;
}

if (windowLocalStorageAvailable()) {
  localStorage = window.localStorage;
} else if (window.globalStorage) {
  // Firefox 2-3 use globalStorage
  // See https://developer.mozilla.org/en/dom/storage#globalStorage
  try {
    localStorage = window.globalStorage[window.location.hostname];
  } catch (e) {
    // Something bad happened...
  }
} else {
  // IE 5-7 use userData
  // See http://msdn.microsoft.com/en-us/library/ms531424(v=vs.85).aspx
  var div = document.createElement('div'),
      attrKey = 'localStorage';
  div.style.display = 'none';
  document.getElementsByTagName('head')[0].appendChild(div);
  if (div.addBehavior) {
    div.addBehavior('#default#userdata');
    localStorage = {
      length: 0,
      setItem: function(k, v) {
        div.load(attrKey);
        if (!div.getAttribute(k)) {
          this.length++;
        }
        div.setAttribute(k, v);
        div.save(attrKey);
      },
      getItem: function(k) {
        div.load(attrKey);
        return div.getAttribute(k);
      },
      removeItem: function(k) {
        div.load(attrKey);
        if (div.getAttribute(k)) {
          this.length--;
        }
        div.removeAttribute(k);
        div.save(attrKey);
      },
      clear: function() {
        div.load(attrKey);
        var i = 0;
        var attr;
        while (attr = div.XMLDocument.documentElement.attributes[i++]) {
          div.removeAttribute(attr.name);
        }
        div.save(attrKey);
        this.length = 0;
      },
      key: function(k) {
        div.load(attrKey);
        return div.XMLDocument.documentElement.attributes[k];
      }
    };
    div.load(attrKey);
    localStorage.length = div.XMLDocument.documentElement.attributes.length;
  } else {
    /* Nothing we can do ... */
  }
}
if (!localStorage) {
  localStorage = {
    length: 0,
    setItem: function(k, v) {
    },
    getItem: function(k) {
    },
    removeItem: function(k) {
    },
    clear: function() {
    },
    key: function(k) {
    }
  };
}

module.exports = localStorage;

}, {}],
7: [function(require, module, exports) {

/**
 * HOP ref.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Return own keys in `obj`.
 *
 * @param {Object} obj
 * @return {Array}
 * @api public
 */

exports.keys = Object.keys || function(obj){
  var keys = [];
  for (var key in obj) {
    if (has.call(obj, key)) {
      keys.push(key);
    }
  }
  return keys;
};

/**
 * Return own values in `obj`.
 *
 * @param {Object} obj
 * @return {Array}
 * @api public
 */

exports.values = function(obj){
  var vals = [];
  for (var key in obj) {
    if (has.call(obj, key)) {
      vals.push(obj[key]);
    }
  }
  return vals;
};

/**
 * Merge `b` into `a`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api public
 */

exports.merge = function(a, b){
  for (var key in b) {
    if (has.call(b, key)) {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * Return length of `obj`.
 *
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

exports.length = function(obj){
  return exports.keys(obj).length;
};

/**
 * Check if `obj` is empty.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api public
 */

exports.isEmpty = function(obj){
  return 0 == exports.length(obj);
};
}, {}],
8: [function(require, module, exports) {
var JSON = require('json'); // jshint ignore:line

/*
 * Simple AJAX request object
 */
var Request = function (url, data, headers) {
    this.url = url;
    this.data = data || {};
    this.headers = headers || {};
};

function parseResponseHeaders(headerStr) {
    var headers = {};
    if (!headerStr) {
        return headers;
    }
    var headerPairs = headerStr.split('\u000d\u000a');
    for (var i = 0; i < headerPairs.length; i++) {
        var headerPair = headerPairs[i];
        // Can't use split() here because it does the wrong thing
        // if the header value has the string ": " in it.
        var index = headerPair.indexOf('\u003a\u0020');
        if (index > 0) {
            var key = headerPair.substring(0, index);
            var val = headerPair.substring(index + 2);
            headers[key] = val;
        }
    }
    return headers;
}

Request.prototype.send = function (callback) {
    var isIE = window.XDomainRequest ? true : false;
    if (isIE) {
        var xdr = new window.XDomainRequest();
        xdr.open('POST', this.url, true);
        xdr.onload = function () {
            callback(xdr.responseText);
        };
        xdr.send(JSON.stringify(this.data));
    } else {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = "true";

        xhr.open('POST', this.url, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr.status, xhr.responseText, parseResponseHeaders(xhr.getAllResponseHeaders()));
            }
        };
        xhr.setRequestHeader('Content-Type', 'text/plain');
        
        for (var key in this.headers) {
           if (this.headers.hasOwnProperty(key)) {
               xhr.setRequestHeader(key, this.headers[key]);
           }
        }
        
        xhr.send(JSON.stringify(this.data));
    }
};

module.exports = Request;

}, {"json":4}],
9: [function(require, module, exports) {
/* jshint bitwise: false, laxbreak: true */

/**
 * Taken straight from jed's gist: https://gist.github.com/982883
 *
 * Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
 * where each x is replaced with a random hexadecimal digit from 0 to f, and
 * y is replaced with a random hexadecimal digit from 8 to b.
 */

var uuid = function(a) {
  return a           // if the placeholder was passed, return
      ? (              // a random number from 0 to 15
      a ^            // unless b is 8,
      Math.random()  // in which case
      * 16           // a random number from
      >> a / 4         // 8 to 11
      ).toString(16) // in hexadecimal
      : (              // or otherwise a concatenated string:
      [1e7] +        // 10000000 +
      -1e3 +         // -1000 +
      -4e3 +         // -4000 +
      -8e3 +         // -80000000 +
      -1e11          // -100000000000,
      ).replace(     // replacing
      /[018]/g,    // zeroes, ones, and eights with
      uuid         // random hex digits
  );
};

module.exports = uuid;

}, {}],
10: [function(require, module, exports) {
module.exports = 'undefined';
}, {}],
11: [function(require, module, exports) {
var type = require('./type');
var Request = require('./xhr');

/*
 * Wrapper for a user properties JSON object that supports operations.
 * Note: if a user property is used in multiple operations on the same User object,
 * only the first operation will be saved, and the rest will be ignored.
 */

var API_VERSION = 1;
var log = function (s, opts) {
    console.log('[Rakam] ' + s, opts);
};

var wrapCallback = function (operation, props, callback) {
    return function (status, response, headers) {
        log("Successfully sent " + operation, props);
        if (callback !== undefined) {
            callback(status, response, headers);
        }
    };
};

var getUrl = function (options) {
    return ('https:' === window.location.protocol ? 'https' : 'http') + '://' + options.apiEndpoint + "/user";
};

var User = function () {
};

User.prototype.init = function (options) {
    this.options = options;
};


User.prototype.set = function (properties, callback) {
    new Request(getUrl(this.options) + "/set_properties", {
        api: {
            "api_version": API_VERSION,
            "api_key": this.options.apiKey
        },
        id: this.options.userId,
        properties: properties
    }).send(wrapCallback("set_properties", properties, callback));

    return this;
};

User.prototype._merge = function (previousUserId, createdAt, callback) {
    new Request(getUrl(this.options) + "/merge", {
        api: {
            "api_version": API_VERSION,
            "api_key": this.options.apiKey,
            "upload_time": new Date().getTime()
        },
        anonymous_id: previousUserId,
        id: this.options.userId,
        created_at: createdAt.getTime(),
        merged_at: new Date().getTime()
    }).send(wrapCallback("merge", null, callback));

    return this;
};

User.prototype.setOnce = function (properties, callback) {
    new Request(getUrl(this.options) + "/set_properties_once", {
        api: {
            "api_version": API_VERSION,
            "api_key": this.options.apiKey
        },
        id: this.options.userId,
        properties: properties
    }).send(wrapCallback("set_properties_once", properties, callback));

    return this;
};


User.prototype.increment = function (property, value, callback) {
    new Request(getUrl(this.options) + "/increment_property", {
        api: {
            "api_version": API_VERSION,
            "api_key": this.options.apiKey
        },
        id: this.options.userId,
        property: property,
        value: value
    }).send(wrapCallback("increment_property", property + " by " + value, callback));

    return this;
};

User.prototype.unset = function (properties, callback) {
    new Request(getUrl(this.options) + "/unset_properties", {
        api: {
            "api_version": API_VERSION,
            "api_key": this.options.apiKey
        },
        id: this.options.userId,
        properties: type(properties) === "array" ? properties : [properties]
    }).send(wrapCallback("unset_properties", properties, callback));

    return this;
};

module.exports = User;
}, {"./type":13,"./xhr":8}],
13: [function(require, module, exports) {
/* Taken from: https://github.com/component/type */

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
    switch (toString.call(val)) {
        case '[object Date]': return 'date';
        case '[object RegExp]': return 'regexp';
        case '[object Arguments]': return 'arguments';
        case '[object Array]': return 'array';
        case '[object Error]': return 'error';
    }

    if (val === null) {
        return 'null';
    }
    if (val === undefined) {
        return 'undefined';
    }
    if (val !== val) {
        return 'nan';
    }
    if (val && val.nodeType === 1) {
        return 'element';
    }

    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(val)) {
        return 'buffer';
    }

    val = val.valueOf ? val.valueOf() : Object.prototype.valueOf.apply(val);
    return typeof val;
};
}, {}],
12: [function(require, module, exports) {
(function(){!function(a,b){return"function"==typeof define&&define.amd?define(function(){return b()}):"object"==typeof exports?module.exports=b():a.ifvisible=b()}(this,function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n;return i={},c=document,k=!1,l="active",g=6e4,f=!1,b=function(){var a,b,c,d,e,f,g;return a=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)},e=function(){return a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()},f={},c="__ceGUID",b=function(a,b,d){return a[c]=void 0,a[c]||(a[c]="ifvisible.object.event.identifier"),f[a[c]]||(f[a[c]]={}),f[a[c]][b]||(f[a[c]][b]=[]),f[a[c]][b].push(d)},d=function(a,b,d){var e,g,h,i,j;if(a[c]&&f[a[c]]&&f[a[c]][b]){for(i=f[a[c]][b],j=[],g=0,h=i.length;h>g;g++)e=i[g],j.push(e(d||{}));return j}},g=function(a,b,d){var e,g,h,i,j;if(d){if(a[c]&&f[a[c]]&&f[a[c]][b])for(j=f[a[c]][b],g=h=0,i=j.length;i>h;g=++h)if(e=j[g],e===d)return f[a[c]][b].splice(g,1),e}else if(a[c]&&f[a[c]]&&f[a[c]][b])return delete f[a[c]][b]},{add:b,remove:g,fire:d}}(),a=function(){var a;return a=!1,function(b,c,d){return a||(a=b.addEventListener?function(a,b,c){return a.addEventListener(b,c,!1)}:b.attachEvent?function(a,b,c){return a.attachEvent("on"+b,c,!1)}:function(a,b,c){return a["on"+b]=c}),a(b,c,d)}}(),d=function(a,b){var d;return c.createEventObject?a.fireEvent("on"+b,d):(d=c.createEvent("HTMLEvents"),d.initEvent(b,!0,!0),!a.dispatchEvent(d))},h=function(){var a,b,d,e,f;for(e=void 0,f=3,d=c.createElement("div"),a=d.getElementsByTagName("i"),b=function(){return d.innerHTML="<!--[if gt IE "+ ++f+"]><i></i><![endif]-->",a[0]};b(););return f>4?f:e}(),e=!1,n=void 0,"undefined"!=typeof c.hidden?(e="hidden",n="visibilitychange"):"undefined"!=typeof c.mozHidden?(e="mozHidden",n="mozvisibilitychange"):"undefined"!=typeof c.msHidden?(e="msHidden",n="msvisibilitychange"):"undefined"!=typeof c.webkitHidden&&(e="webkitHidden",n="webkitvisibilitychange"),m=function(){var b,d;return b=!1,d=function(){return clearTimeout(b),"active"!==l&&i.wakeup(),f=+new Date,b=setTimeout(function(){return"active"===l?i.idle():void 0},g)},d(),a(c,"mousemove",d),a(c,"keyup",d),a(window,"scroll",d),i.focus(d),i.wakeup(d)},j=function(){var b;return k?!0:(e===!1?(b="blur",9>h&&(b="focusout"),a(window,b,function(){return i.blur()}),a(window,"focus",function(){return i.focus()})):a(c,n,function(){return c[e]?i.blur():i.focus()},!1),k=!0,m())},i={setIdleDuration:function(a){return g=1e3*a},getIdleDuration:function(){return g},getIdleInfo:function(){var a,b;return a=+new Date,b={},"idle"===l?(b.isIdle=!0,b.idleFor=a-f,b.timeLeft=0,b.timeLeftPer=100):(b.isIdle=!1,b.idleFor=a-f,b.timeLeft=f+g-a,b.timeLeftPer=(100-100*b.timeLeft/g).toFixed(2)),b},focus:function(a){return"function"==typeof a?this.on("focus",a):(l="active",b.fire(this,"focus"),b.fire(this,"wakeup"),b.fire(this,"statusChanged",{status:l}))},blur:function(a){return"function"==typeof a?this.on("blur",a):(l="hidden",b.fire(this,"blur"),b.fire(this,"idle"),b.fire(this,"statusChanged",{status:l}))},idle:function(a){return"function"==typeof a?this.on("idle",a):(l="idle",b.fire(this,"idle"),b.fire(this,"statusChanged",{status:l}))},wakeup:function(a){return"function"==typeof a?this.on("wakeup",a):(l="active",b.fire(this,"wakeup"),b.fire(this,"statusChanged",{status:l}))},on:function(a,c){return j(),b.add(this,a,c)},off:function(a,c){return j(),b.remove(this,a,c)},onEvery:function(a,b){var c,d;return j(),c=!1,b&&(d=setInterval(function(){return"active"===l&&c===!1?b():void 0},1e3*a)),{stop:function(){return clearInterval(d)},pause:function(){return c=!0},resume:function(){return c=!1},code:d,callback:b}},now:function(a){return j(),l===(a||"active")}}})}).call(this);
}, {}]}, {}, {"1":""})
);