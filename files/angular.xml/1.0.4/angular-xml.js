(function(ng) {

  function MicrosoftXMLDOMParser($window) {
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

  function XMLDOMParser($window) {
    this.parser = new $window.DOMParser();
  }

  XMLDOMParser.prototype.parse = function (input) {
    return this.parser.parseFromString(input, 'text/xml');
  };

  function parserFactory($window) {
    if ($window.DOMParser) {
      return new XMLDOMParser($window);
    } else if ($window.ActiveXObject) {
      return new MicrosoftXMLDOMParser($window);
    } else {
      throw new Error('Cannot parser XML in this environment.');
    }
  }

  function xmlHttpInterceptorFactory($q, xmlFilter) {
    function responseHandler(response) {
      if (response && response.headers('content-type') === 'application/xml') {
        response.xml = xmlFilter(response.data);
        return response;
      } else {
        return $q.when(response);
      }
    }
    return {
      response: responseHandler
    };
  }

  function configProvider($provide) {
    $provide.factory('xmlHttpInterceptor', ['$q', 'xmlFilter', xmlHttpInterceptorFactory]);
  }

  function filterFactory(xmlParser) {
    return function (input) {
      var xmlDoc = xmlParser.parse(input);
      return ng.element(xmlDoc);
    };
  }

  if (ng) {
    ng
      .module('xml', [])
      .config(['$provide', configProvider])
      .factory('xmlParser', ['$window', parserFactory])
      .filter('xml', ['xmlParser', filterFactory]);
  }

}(angular));

