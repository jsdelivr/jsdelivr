angular.module('ng-image-delay', [])
  .directive('ngDelaySrc', function() {
    return {
      restrict: 'A',
      priority: 99,
      link: function(scope, element, attr) {
        attr.$observe('ngDelaySrc', function(value) {
          if (document.getElementsByTagName('html')[0].getAttribute('data-delay-start') !== null ||
            /MSIE 8/.test(navigator.userAgent)) {
            attr.$set('src', value);
            element.prop('src', value);
          } else {
            attr.$set('data-delay-src', value);
          }
        });
        element.bind('error', function() {
            attr.$set('data-delay-error', 'true');
        });
      }
    };
});