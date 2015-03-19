/* global angular */

if (typeof(angular) !== 'undefined') {
  angular
    .module('xml', [])
    .config(['$provide', function ($provide) {
      
      $provide.factory('xmlHttpInterceptor', ['xmlFilter', function (xmlFilter) {
        return function (promise) {
          return promise.then(function (response) {
            response.xml = xmlFilter(response.data);
            return response;
          });
        };
      }]);
      
    }])
    .filter('xml', ['$window', function ($window) {
      return function (input) {
        
        var xmlDoc, parser;
        
        if ($window.DOMParser) {
          parser = new $window.DOMParser();
          xmlDoc = parser.parseFromString(input, 'text/xml');
        } else if ($window.ActiveXObject) {
          // IE
          xmlDoc = new $window.ActiveXObject('Microsoft.XMLDOM');
          xmlDoc.async = false;
          xmlDoc.loadXml(input);
        } else {
          throw new Error('Cannot parse XML in this environment.');
        }

        return angular.element(xmlDoc);
        
      };
    }]);
}

