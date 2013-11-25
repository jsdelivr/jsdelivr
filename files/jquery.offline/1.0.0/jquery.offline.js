/*!
 * jQuery Offline
 * Version 1.0.0
 *
 * http://github.com/wycats/jquery-offline
 *
 * Copyright 2010, Yehuda Katz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: Fri Jul 9 10:20:00 2010 -0800
 */

(function($) {

  var prefix = "offline.jquery:",
    mostRecent = null,
    requesting = {};

  // Allow the user to explicitly turn off localStorage
  // before loading this plugin
  if (typeof $.support.localStorage === "undefined") {
    $.support.localStorage = !!window.localStorage;
  }

  // modified getJSON which uses ifModified: true
  function getJSON(url, data, fn) {
    if ($.isFunction(data)) {
      fn = data;
      data = null;
    }

    var requestingKey = url + "?" + $.param(data || {});
    if (requesting[requestingKey]) {
      return false;
    }

    requesting[requestingKey] = true;

    return $.ajax({
      type: "GET",
      url: url,
      data: data,
      success: function(responseData, text) {
        delete requesting[requestingKey];

        // handle lack of response (error callback isn't called in this case)
        if (undefined === responseData) {
          if (!window.navigator.onLine) {
            // requeue the request for the next time we come online
            mostRecent = function() {
              getJSON(url, data, fn);
            };
          }
          return;
        }

        fn(responseData, text);
      },
      error: function() {
        delete requesting[requestingKey];
      },
      dataType: "json",
      ifModified: true
    });
  }

  if ($.support.localStorage) {
    // If localStorage is available, define jQuery.retrieveJSON
    // and jQuery.clearJSON to operate in terms of the offline
    // cache
    // If the user comes online, run the most recent request
    // that was queued due to the user being offline
    $(window).bind("online", function() {
      if (mostRecent) {
        mostRecent();
      }
    });

    // If the user goes offline, hide any loading bar
    // the user may have created
    $(window).bind("offline", function() {
      $.event.trigger("ajaxStop");
    });

    $.retrieveJSON = function(url, data, fn) {
      // allow jQuery.retrieveJSON(url, fn)
      if ($.isFunction(data)) {
        fn = data;
        data = {};
      }

      // remember when this request started so we can report
      // the time when a follow-up Ajax request completes.
      // this is especially important when the user comes
      // back online, since retrieveDate may be minutes,
      // hours or even days before the Ajax request finally
      // completes
      var retrieveDate = new Date;

      // get a String value for the data passed in, and then
      // use it to calculate a cache key
      var param       = $.param(data),
          key         = prefix + url + ":" + param,
          text        = localStorage[key],
          dateString  = localStorage[key + ":date"],
          date        = new Date(Date.parse(dateString));

      function cleanupLocalStorage() {
        // take all date keys and remove the oldest half
        var dateKeys = [];
        for (var i = 0; i < localStorage.length; ++i) {
          var key = localStorage.key(i);
          if (/:date$/.test(key)) {
            dateKeys.push(key);
          }
        }
        dateKeys.sort(function(a, b) {
          var date_a = localStorage[a], date_b = localStorage[b];
          return date_a < date_b ? -1 : (date_a > date_b ? +1 : 0);
        });
        for (var i = 0; i < dateKeys.length / 2; ++i) {
          var key = dateKeys[i];
          delete localStorage[key];
          delete localStorage[key.substr(0, key.length - 5)]; // :date
        }
      }

      // create a function that will make an Ajax request and
      // store the result in the cache. This function will be
      // deferred until later if the user is offline
      function getData() {
        return getJSON(url, data, function(json, status) {
          if ( status == 'notmodified' ) {
            // Just return if the response has a 304 status code
            return false;
          }

          while (true) {
            try {
              localStorage[key] = JSON.stringify(json);
              localStorage[key + ":date"] = new Date;
              break;
            } catch (e) {
                if (e.name == "QUOTA_EXCEEDED_ERR" || e.name ==
                    "NS_ERROR_DOM_QUOTA_REACHED") {
                  cleanupLocalStorage();
                }
            }
          }

          // If this is a follow-up request, create an object
          // containing both the original time of the cached
          // data and the time that the data was originally
          // retrieved from the cache. With this information,
          // users of jQuery Offline can provide the user
          // with improved feedback if the lag is large
          var data = text && { cachedAt: date, retrievedAt: retrieveDate };
          fn(json, status, data);
        });
      }

      // If there is anything in the cache, call the callback
      // right away, with the "cached" status string
      if( text ) {
        var obj = $.parseJSON(text);
        var response = fn( obj, "cached", { cachedAt: date } );
        if( response === false ) {
          var dfd = $.Deferred().promise();
          dfd.done = function(callback) { callback(obj) };
          return dfd;
        }
      }

      // If the user is online, make the Ajax request right away;
      // otherwise, make it the most recent callback so it will
      // get triggered when the user comes online
      if (window.navigator.onLine) {
        return getData();
      } else {
        mostRecent = getData;
      }

      return true;
    };

    // jQuery.clearJSON is simply a wrapper around deleting the
    // localStorage for a URL/data pair
    $.clearJSON = function(url, data) {
      var param = $.param(data || {});
      delete localStorage[prefix + url + ":" + param];
      delete localStorage[prefix + url + ":" + param + ":date"];
    };
  } else {
    // If localStorage is unavailable, just make all requests
    // regular Ajax requests.
    $.retrieveJSON = getJSON;
    $.clearJSON = $.noop;
  }

})(jQuery);
