
// W3C Geolocation API (Level 1) "Polyfill" Implementation
// This uses freegeoip.org to estimate location from IP address
// by Joshua Bell - http://calormen.com/polyfill

// PUBLIC DOMAIN

(function () {
  "use strict";
  if (!navigator || !window || !document) { return; }

  var GEOIP_SERVICE_JSONP = 'http://freegeoip.net/json/google.com?callback=';
  var SERVICE_THROTTLE_QPS = 1000 / (60 * 60); // 1000/hour
  var POLITENESS_FACTOR = 2;
  var POLL_TIMER_MS = (1000 / SERVICE_THROTTLE_QPS) * POLITENESS_FACTOR;

  var DISTANCE_THRESHOLD_M = 20;
  var EARTH_RADIUS_M = 6.384e6;

  // TODO: Implement user prompt and store preference w/ cookies

  function hasOwnProperty(o, p) {
    return Object.prototype.hasOwnProperty.call(o, p);
  }

  /** @constructor */
  function PositionError(code, message) {
    this.code = code;
    this.message = message;
  }
  PositionError.PERMISSION_DENIED = 1;
  PositionError.POSITION_UNAVAILABLE = 2;
  PositionError.TIMEOUT = 3;
  PositionError.prototype = new Error();

  /** @constructor */
  function Coordinates(data) {
    this.accuracy = EARTH_RADIUS_M * Math.PI;
    this.altitude = null;
    this.altitudeAccuracy = null;
    this.heading = null;
    this.latitude = Number(data.latitude);
    this.longitude = Number(data.longitude);
    this.speed = null;
  }

  /** @constructor */
  function Geoposition(data) {
    this.timestamp = Number(new Date());
    this.coords = new Coordinates(data);
  }

  Geoposition.distance = function(p1, p2) {
    if (p1 === p2) {
      return 0;
    }
    if (!p1 || !p2) {
      return Infinity;
    }
    // c/o http://jsp.vs19.net/lr/sphere-distance.php
    function angle(b1, l1, b2, l2) {
      function d2r(d) { return d * Math.PI / 180; }
      var p1 = Math.cos(d2r(l1 - l2)),
          p2 = Math.cos(d2r(b1 - b2)),
          p3 = Math.cos(d2r(b1 + b2));
      return Math.acos(((p1 * (p2 + p3)) + (p2 - p3)) / 2);
    }
    return EARTH_RADIUS_M * angle(p1.coords.latitude, p1.coords.longitude,
                                  p2.coords.latitude, p2.coords.longitude);
  };

  /** @constructor */
  function GeolocationPolyfill() {

    var cached = null;

    function dispatch(handler, data) {
      if (typeof handler === 'function') {
        setTimeout(function () { handler(data); }, 0);
      } else if (typeof handler === 'object' && handler && 'handleEvent' in handler) {
        handler = handler.handleEvent;
        setTimeout(function () { handler(data); }, 0);
      }
    }

    function acquireLocation(onSuccess, onFailure, enableHighAccuracy) {
      var script = document.createElement('SCRIPT'),
          cbname = '_geoip_callback_' + Math.floor(Math.random() * (1<<30));
      function cleanup() {
        if (script.parentNode) { script.parentNode.removeChild(script); }
        try { delete window[cbname]; } catch (ex) { window[cbname] = (void 0); /*IE8-*/ }
      }
      window[cbname] = function (data) {
        cleanup();
        onSuccess(new Geoposition(data));
      };
      script.onerror = function (e) {
        cleanup();
        onError(e);
      };
      script.src = GEOIP_SERVICE_JSONP + encodeURIComponent(cbname);
      (document.head || document.body || document.documentElement).appendChild(script);
      return cleanup;
    }


    this.getCurrentPosition = function (successCallback, errorCallback, options) {
      if (!successCallback) { throw new TypeError("The successCallback parameter is null."); }

      var maximumAge;
      if (options && hasOwnProperty(options, 'maximumAge') && Number(options.maximumAge) >= 0) {
        maximumAge = Number(options.maximumAge);
      } else {
        maximumAge = 0;
      }

      var timeout;
      if (options && hasOwnProperty(options, 'timeout')) {
        if (Number(options.timeout) >= 0) {
          timeout = Number(options.timeout);
        } else {
          timeout = 0;
        }
      } else {
        timeout = Infinity;
      }

      var enableHighAccuracy;
      if (options && hasOwnProperty(options, 'enableHighAccuracy')) {
        enableHighAccuracy = Boolean(enableHighAccuracy);
      } else {
        enableHighAccuracy = false;
      }

      if (cached && ((Number(new Date()) - cached.timestamp) < maximumAge)) {
        dispatch(successCallback, cached);
        return;
      }

      if (timeout === 0) {
        dispatch(errorCallback, new PositionError(PositionError.TIMEOUT, "Timed out"));
        return;
      }

      var cancelOperation = acquireLocation(onSuccess, onFailure, enableHighAccuracy);

      var timedOut = false, timerId = 0;
      if (isFinite(timeout)) {
        timerId = setTimeout(function () {
          timedOut = true;
          cancelOperation();
          dispatch(errorCallback, new PositionError(PositionError.TIMEOUT, "Timed out"));
        }, timeout);
      }

      function onSuccess(position) {
        cached = position;
        if (!timedOut) {
          if (timerId) { clearTimeout(timerId); }
          dispatch(successCallback, position);
        }
      }

      function onFailure() {
        if (!timedOut) {
          if (timerId) { clearTimeout(timerId); }
          dispatch(errorCallback,new PositionError(PositionError.POSITION_UNAVAILABLE, "Position unavailable"));
        }
      }
    };

    var timers = [], counter = 0;

    this.watchPosition = function (successCallback, errorCallback, options) {
      if (!successCallback) { throw new TypeError("The successCallback parameter is null."); }

      var maximumAge;
      if (options && hasOwnProperty(options, 'maximumAge') && Number(options.maximumAge) >= 0) {
        maximumAge = Number(options.maximumAge);
      } else {
        maximumAge = 0;
      }

      var timeout;
      if (options && hasOwnProperty(options, 'timeout')) {
        if (Number(options.timeout) >= 0) {
          timeout = Number(options.timeout);
        } else {
          timeout = 0;
        }
      } else {
        timeout = Infinity;
      }

      var enableHighAccuracy;
      if (options && hasOwnProperty(options, 'enableHighAccuracy')) {
        enableHighAccuracy = Boolean(enableHighAccuracy);
      } else {
        enableHighAccuracy = false;
      }

      if (cached && ((Number(new Date()) - cached.timestamp) < maximumAge)) {
        dispatch(successCallback, cached);
      }

      var intervalId = setInterval(systemEvent, POLL_TIMER_MS);
      var timerDetails = {
        intervalId: intervalId,
        cleared: false
      };

      var lastPosition = null, timerId = 0;
      acquisitionSteps();
      function acquisitionSteps() {
        var cancelOperation = acquireLocation(onSuccess, onFailure, enableHighAccuracy);

        var timedOut = false;
        if (isFinite(timeout) && !timerId) {
          timerId = setTimeout(function () {
            timedOut = true;
            timerId = 0;
            cancelOperation();
            if (!timerDetails.cleared) {
              dispatch(errorCallback, new PositionError(PositionError.TIMEOUT, "Timed out"));
            }
          }, timeout);
        }

        function onSuccess(position) {
          cached = position;
          if (!timedOut && !timerDetails.cleared) {
            if (timerId) { clearTimeout(timerId); timerId = 0; }

            if (Geoposition.distance(lastPosition, position) >= DISTANCE_THRESHOLD_M) {
              lastPosition = position;
              dispatch(successCallback, position);
            }
          }
        }

        function onFailure() {
          if (!timedOut && !timerDetails.cleared) {
            if (timerId) { clearTimeout(timerId); timerId = 0; }
            dispatch(errorCallback,new PositionError(PositionError.POSITION_UNAVAILABLE, "Position unavailable"));
          }
        }
      }

      function systemEvent() {
        acquisitionSteps();
      }

      var watchId = ++counter;
      timers[watchId] = timerDetails;
      return watchId;
    };

    this.clearWatch = function (watchId) {
      watchId = Number(watchId);
      if (!hasOwnProperty(timers, watchId)) {
        return;
      }

      var timerDetails = timers[watchId];
      delete timers[watchId];
      clearInterval(timerDetails.intervalId);
      timerDetails.cleared = true;
    };
  }

  // Exports
  if (!navigator.geolocation) {
    navigator.geolocation = new GeolocationPolyfill();
    window.PositionError = PositionError;
  }

}());
