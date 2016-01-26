'use strict';
angular.module('ngFlow.img', ['ngFlow.init'])
.directive('ngFlowImg', [function() {
  return {
    'scope': false,
    'require': '^ngFlowInit',
    'link': function(scope, element, attrs) {
      var file = attrs.ngFlowImg;
      scope.$watch(file, function (file) {
        if (!file) {
          return ;
        }
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file.file);
        fileReader.onload = function (event) {
          scope.$apply(function () {
            attrs.$set('src', event.target.result);
          });
        };
      });
    }
  };
}]);