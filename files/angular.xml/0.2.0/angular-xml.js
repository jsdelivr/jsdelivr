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
    .factory('xmlParser', ['$window', function ($window) {

      function MicrosoftXMLDOMParser() {
        this.parser = new $window.ActiveXObject('Microsoft.XMLDOM');
      }

      MicrosoftXMLDOMParser.prototype.parse = function (input) {
        this.parser.async = false;
        return this.parser.loadXml(input);
      };

      function XMLDOMParser() {
        this.parser = new $window.DOMParser();
      }

      XMLDOMParser.prototype.parse = function (input) {
        return this.parser.parseFromString(input, 'text/xml');
      };

      if ($window.DOMParser) {
        return new XMLDOMParser();
      } else if ($window.ActiveXObject) {
        return new MicrosoftXMLDOMParser();
      } else {
        throw new Error('Cannot parser XML in this environment.');
      }

    }])
    .filter('xml', ['xmlParser', function (xmlParser) {
      return function (input) {
        var xmlDoc = xmlParser.parse(input);
        return angular.element(xmlDoc);
      };
    }]);
}

