/*! Planetary.js v1.1.1
 *  Copyright (c) 2013 Brandon Tilley
 *
 *  Released under the MIT license
 *  Date: 2014-05-18T17:34:29.344Z
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['d3', 'topojson'], function(d3, topojson) {
      return (root.planetaryjs = factory(d3, topojson, root));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('d3'), require('topojson'));
  } else {
    root.planetaryjs = factory(root.d3, root.topojson, root);
  }
}(this, function(d3, topojson, window) {
  'use strict';

  var originalPlanetaryjs = null;
  if (window) originalPlanetaryjs = window.planetaryjs;
  var plugins = [];

  var doDrawLoop = function(planet, canvas, hooks) {
    d3.timer(function() {
      if (planet.stopped) {
        return true;
      }

      planet.context.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < hooks.onDraw.length; i++) {
        hooks.onDraw[i]();
      }
    });
  };

  var initPlugins = function(planet, localPlugins) {
    // Add the global plugins to the beginning of the local ones
    for (var i = plugins.length - 1; i >= 0; i--) {
      localPlugins.unshift(plugins[i]);
    }

    // Load the default plugins if none have been loaded so far
    if (localPlugins.length === 0) {
      if (planetaryjs.plugins.earth)
        planet.loadPlugin(planetaryjs.plugins.earth());
      if (planetaryjs.plugins.pings)
        planet.loadPlugin(planetaryjs.plugins.pings());
    }

    for (i = 0; i < localPlugins.length; i++) {
      localPlugins[i](planet);
    }
  };

  var runOnInitHooks = function(planet, canvas, hooks) {
    // onInit hooks can be asynchronous if they take a parameter;
    // iterate through them one at a time
    if (hooks.onInit.length) {
      var completed = 0;
      var doNext = function(callback) {
        var next = hooks.onInit[completed];
        if (next.length) {
          next(function() {
            completed++;
            callback();
          });
        } else {
          next();
          completed++;
          setTimeout(callback, 0);
        }
      };
      var check = function() {
        if (completed >= hooks.onInit.length) doDrawLoop(planet, canvas, hooks);
        else doNext(check);
      };
      doNext(check);
    } else {
      doDrawLoop(planet, canvas, hooks);
    }
  };

  var startDraw = function(planet, canvas, localPlugins, hooks) {
    planet.canvas = canvas;
    planet.context = canvas.getContext('2d');

    if (planet.stopped !== true) {
      initPlugins(planet, localPlugins);
    }

    planet.stopped = false;
    runOnInitHooks(planet, canvas, hooks);
  };

  var planetaryjs = {
    plugins: {},

    noConflict: function() {
      window.planetaryjs = originalPlanetaryjs;
      return planetaryjs;
    },

    loadPlugin: function(plugin) {
      plugins.push(plugin);
    },

    planet: function() {
      var localPlugins = [];
      var hooks = {
        onInit: [],
        onDraw: [],
        onStop: []
      };

      var planet = {
        plugins: {},

        draw: function(canvas) {
          startDraw(planet, canvas, localPlugins, hooks);
        },

        onInit: function(fn) {
          hooks.onInit.push(fn);
        },

        onDraw: function(fn) {
          hooks.onDraw.push(fn);
        },

        onStop: function(fn) {
          hooks.onStop.push(fn);
        },

        loadPlugin: function(plugin) {
          localPlugins.push(plugin);
        },

        stop: function() {
          planet.stopped = true;
          for (var i = 0; i < hooks.onStop.length; i++) {
            hooks.onStop[i](planet);
          }
        },

        withSavedContext: function(fn) {
          if (!this.context) {
            throw new Error("No canvas to fetch context for");
          }

          this.context.save();
          fn(this.context);
          this.context.restore();
        }
      };

      planet.projection = d3.geo.orthographic()
        .clipAngle(90);
      planet.path = d3.geo.path().projection(planet.projection);

      return planet;
    }
  };

  return planetaryjs;
}));
