(function () {
  'use strict';

  angular.module('angularIcons.openIconic', [])
    .provider('OpenIconic', OpenIconic)
    .directive('baOpenIconic', baOpenIconic)
    .config(config)
  ;

  config.$inject = ['$sceDelegateProvider'];

  function config($sceDelegateProvider) {
    var whitelist = $sceDelegateProvider.resourceUrlWhitelist();
    $sceDelegateProvider.resourceUrlWhitelist(whitelist.concat([
      'https://npmcdn.com/angular-icons@1.0.7/dist/icons/open-iconic/**',
      'https://cdn.jsdelivr.net/angular-icons/1.0.7/icons/open-iconic/**',
      'https://unpkg.com/angular-icons@1.0.7/dist/icons/open-iconic/**'
    ]));
  }

  function OpenIconic() {
    // default path
    var assetPath = '';
    var assetCdn = 'unpkg';

    /**
     * Sets the path used to locate the iconic SVG files
     * @param {string} path - the base path used to locate the iconic SVG files
     */
    this.setAssetPath = function (path) {
      assetPath = angular.isString(path) ? path : assetPath;

      // make sure ends with /
      if (assetPath.charAt(assetPath.length - 1) !== '/') {
        assetPath += '/';
      }
    };

    /**
     * Configures which CDN to use
     * @param {string} cdn - options are 'jsdelivr', 'npmcdn' (default 'npmcdn')
     */
    this.setCdn = function (cdn) {
      switch (cdn) {
        case 'jsdelivr':
        case 'npmcdn':
        case 'unpkg':
          assetCdn = cdn;
          break;
        default:
          assetCdn = 'unpkg';
          break;
      }
    };

    /**
     * Service implementation
     * @returns {{}}
     */
    this.$get = function () {
      var service = {
        getAssetPath: getAssetPath
      };

      return service;

      /**
       *
       * @returns {string}
       */
      function getAssetPath() {
        switch (assetCdn) {
          case 'unpkg':
            return 'https://unpkg.com/angular-icons@1.0.7/dist/icons/open-iconic/';
          case 'npmcdn':
            return 'https://npmcdn.com/angular-icons@1.0.7/dist/icons/open-iconic/';
          case 'jsdelivr':
            return 'https://cdn.jsdelivr.net/angular-icons/1.0.7/icons/open-iconic/';
          default:
            return assetPath;
        }
      }
    };
  }

  baOpenIconic.$inject = ['OpenIconic'];

  function baOpenIconic(OpenIconic) {
    var directive = {
      restrict: 'EA',
      replace: true,
      templateUrl: function(element, attrs) {
        return OpenIconic.getAssetPath() + attrs.icon + ".svg";
      },
      scope: {
        icon: '@'
      },
      link: link
    };

    return directive;

    function link(scope, element) {
      element.addClass("open-iconic");
    }
  }

})();
