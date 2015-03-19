/*
 * Copyright 2012 Andrey “A.I.” Sitnik <andrey@sitnik.ru>,
 * sponsored by Evil Martians.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

;(function () {
    "use strict";

    var defined = function(variable) {
        return ('undefined' != typeof(variable));
    };

    var self = Visibility;

    var timers = {

      // Run callback every `interval` milliseconds if page is visible and
      // every `hiddenInterval` milliseconds if page is hidden.
      //
      //   Visibility.every(60 * 1000, 5 * 60 * 1000, function () {
      //       checkNewMails();
      //   });
      //
      // You can skip `hiddenInterval` and callback will be called only if
      // page is visible.
      //
      //   Visibility.every(1000, function () {
      //       updateCountdown();
      //   });
      //
      // It is analog of `setInterval(callback, interval)` but use visibility
      // state.
      //
      // It return timer ID, that you can use in `Visibility.stop(id)` to stop
      // timer (`clearInterval` analog).
      // Warning: timer ID is different from interval ID from `setInterval`,
      // so don’t use it in `clearInterval`.
      //
      // On change state from hidden to visible timers will be execute.
      //
      // If you include jQuery Chrono plugin before Visibility.js, you could
      // use Chrono’s syntax sugar in interval arguments:
      //
      //   Visibility.every('second', function () {
      //       updateCountdown();
      //   });
      //   Visibility.every('1 minute', '5 minutes', function () {
      //       checkNewMails();
      //   });
      every: function (interval, hiddenInterval, callback) {
          self._initTimers();

          if ( !defined(callback) ) {
              callback = hiddenInterval;
              hiddenInterval = null;
          }
          self._lastTimer += 1;
          var number = self._lastTimer;
          self._timers[number] = ({
              interval:       interval,
              hiddenInterval: hiddenInterval,
              callback:       callback
          });
          self._runTimer(number, false);

          if ( self.isSupported() ) {
              self._setListener();
          }
          return number;
      },

      // Stop timer from `every` method by it ID (`every` method return it).
      //
      //   slideshow = Visibility.every(5 * 1000, function () {
      //       changeSlide();
      //   });
      //   $('.stopSlideshow').click(function () {
      //       Visibility.stop(slideshow);
      //   });
      stop: function(id) {
          var timer = self._timers[id]
          if ( !defined(timer) ) {
              return false;
          }
          self._stopTimer(id);
          delete self._timers[id];
          return timer;
      },

      // Last timer number.
      _lastTimer: -1,

      // Callbacks and intervals added by `every` method.
      _timers: { },

      // Is setInterval method detected and listener is binded.
      _timersInitialized: false,

      // Initialize variables on page loading.
      _initTimers: function () {
          if ( self._timersInitialized ) {
              return;
          }
          self._timersInitialized = true;

          if ( defined(window.jQuery) && defined(jQuery.every) ) {
              self._setInterval = self._chronoInterval;
          } else {
              self._setInterval = self._originalInterval;
          }
          self.change(function () {
              self._timersStopRun()
          });
      },

      // Set interval directly by `setInterval` function without any syntax
      // sugar.
      _originalInterval: function (callback, interval) {
          return setInterval(callback, interval);
      },

      // Set interval by jQuery Chrono plugin. Add syntax sugar to `interval`
      // and `hiddenInterval` arguments, such as "1 second" and others.
      //
      // It will be automatically set to `_setInterval` on loading if
      // you include jQuery Chrono plugin before Visibility.js.
      _chronoInterval: function (callback, internal) {
          return jQuery.every(internal, callback);
      },

      // Set interval by `setInterval`. Allow to change function for tests or
      // syntax sugar in `interval` arguments.
      //
      // Function will be automatically set in `_init` method (which will be
      // call on script loading). So you must include jQuery Chrono plugin
      // before Visibility.js.
      _setInterval: null,

      // Try to run timer from every method by it’s ID. It will be use
      // `interval` or `hiddenInterval` depending on visibility state.
      // If page is hidden and `hiddenInterval` is null,
      // it will not run timer.
      //
      // Argument `now` say, that timers must be execute now too.
      _runTimer: function (id, now) {
          var interval,
              timer = self._timers[id];
          if ( self.hidden() ) {
              if ( null === timer.hiddenInterval ) {
                  return;
              }
              interval = timer.hiddenInterval;
          } else {
              interval = timer.interval;
          }
          if ( now ) {
              timer.callback.call(window);
          }
          timer.id = self._setInterval(timer.callback, interval);
      },

      // Stop timer from `every` method by it’s ID.
      _stopTimer: function (id) {
          var timer = self._timers[id];
          clearInterval(timer.id);
          delete timer.id;
      },

      // Listener for `visibilitychange` event.
      _timersStopRun: function (event) {
          var isHidden = self.hidden(),
              hiddenBefore = self._hiddenBefore;

          if ( (isHidden && !hiddenBefore) || (!isHidden && hiddenBefore) ) {
              for ( var i in self._timers ) {
                  self._stopTimer(i);
                  self._runTimer(i, !isHidden);
              }
          }
      }

    };

    for ( var prop in timers ) {
        Visibility[prop] = timers[prop];
    }

})();
