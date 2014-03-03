if (typeof(angular) !== 'undefined') {
  angular
    .module('xml', [])
    .config(['$provide', function ($provide) {
      
      $provide.factory('xmlHttpInterceptor', ['$q', 'xmlFilter', function ($q, xmlFilter) {
        return {
          response: function (response) {
            if (response) {
              response.xml = xmlFilter(response.data);
              return response;
            } else {
              return $q.when(response);
            }
          }
        };
      }]);
      
    }])
    .factory('xmlParser', ['$window', function ($window) {

      function MicrosoftXMLDOMParser() {
        this.parser = new $window.ActiveXObject('Microsoft.XMLDOM');
      }

      MicrosoftXMLDOMParser.prototype.parse = function (input) {
        var parser = this.parser,
            parseError;
        parser.async = false;
        parser.loadXML(input);
        parseError = parser.parseError;
        if (parseError.errorCode === 0) {
          return parser;
        } else {
          throw new Error('Cannot parse XML: ' + parseError.reason);
        }
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

