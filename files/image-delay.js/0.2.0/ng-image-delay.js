angular.module('ng-image-delay', [])
  .directive('ngDelaySrc', function() {
    return {
      restrict: 'A',
      priority: 99,
      link: function(scope, element, attr) {
        attr.$observe('ngDelaySrc', function(value) {
          attr.$set('data-delay-src', value);
        });
      }
    };
  });
