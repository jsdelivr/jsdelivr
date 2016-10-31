// ---- Angular Pressure ----

// Copyright (c) 2016
// Licensed under the MIT Software License
//
// 
//

(function (angular, Pressure) {
  'use strict';

  // Checking to make sure Pressure and Angular are defined

  if (typeof angular === 'undefined') {
    throw Error("angular-pressure: AngularJS (angular) is undefined but is necessary.");
  }
  if (typeof Pressure === 'undefined') {
    throw Error("angular-pressure: PressureJS (Pressure) is undefined but is necessary.");
  }

  /**
   * Mapping of the pressure event names with the Angular attribute directive
   * names. Follows the form: <directiveName>:<eventName>.
   *
   * @type {Array}
   */
  var pressureTypes = [
    {
      directive: 'psForceTouchStart',
      event: 'start'
    },
    {
      directive: 'psForceTouchEnd',
      event: 'end'
    },
    {
      directive: 'psForceTouch',
      event: 'change'
    },
    {
      directive: 'psForceTouchStartDeepPress',
      event: 'startDeepPress'
    },
    {
      directive: 'psForceTouchEndDeepPress',
      event: 'endDeepPress'
    },
    {
      directive: 'psForceTouchUnsupported',
      event: 'unsupported'
    }
  ];
  

  // ---- Module Definition ----

  /**
   * @module psForceTouchEvents
   * @description Angular.js module for adding Pressure.js event listeners to HTML
   * elements using attribute directives
   * @requires angular
   * @requires pressure
   */
  var NAME = 'psForceTouchEvents';
  var psForceTouchEvents = angular.module('psForceTouchEvents', []);

  /**
   * Provides a common interface for configuring global manager and recognizer
   * options. Allows things like pressure forece / duration etc to be defaulted globally and
   * overridden on a per-directive basis as needed.
   *
   * @return {Object} functions to add manager and recognizer options.
   */
  psForceTouchEvents.provider(NAME, function(){
    var self = this;
    self.$get = function(){
      return {};
    };
  });

  /**
   * Iterates through each pressure type mapping and creates a directive for
   * each of the
   *
   * @param  {String} type Mapping in the form of <directiveName>:<eventName>
   * @return None
   */
     
  angular.forEach(pressureTypes, function (type) {
    
     psForceTouchEvents.directive(type.directive, ['$parse', '$window', NAME, function ($parse, $window, defaultEvents) {
        return {
          restrict: 'A',
          scope: false,        
          compile: function($element, attr) {
            if (!Pressure || !$window.addEventListener) {
              throw Error(NAME+": window.Pressure or window.addEventListener not found, can't add event " + type.directive);
            }           
            // We expose the powerful $event object on the scope that provides access to the Window,
            // etc. that isn't protected by the fast paths in $parse.  We explicitly request better
            // checks at the cost of speed since event handler expressions are not executed as
            // frequently as regular change detection.
            var fn = $parse(attr[type.directive], /* interceptorFn */ null, /* expensiveChecks */ true);
            return function psEventHandler(scope, element) {
              var settings = {};
              var options = {};
              var defaultOptions = {polyfill: true};
              
              settings[type.event] = function () {
                var handlerScope = {};
                switch (arguments.length) {
                  case 2:
                    arguments[1].element = $element;
                    handlerScope = { 'force': arguments[0], '$event': arguments[1] };
                    break;
                  case 1:
                    arguments[0].element = $element;
                    handlerScope = { '$event': arguments[0] };
                    break;
                }
              	var callback = function() {
                  fn(scope, handlerScope);
                };
                scope.$apply(callback);
              };
              if (attr.psForceTouchOptions) {
                var options = scope.$eval(attr.psForceTouchOptions);
              }
              // angular.merge remplaced by for a better compatibility angular.extend
              options = angular.extend(defaultOptions, options);
              
              angular.forEach(element, function (el) {
                // todo get options
                Pressure.set(el, settings, options);
              });
            };
          }
        };
      }]);
  });
})(angular, Pressure);