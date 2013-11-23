angular.module('ngFlow.btn', ['ngFlow.init'])
.directive('ngFlowBtn', [function() {
  return {
    'restrict': 'EA',
    'scope': false,
    'require': '^ngFlowInit',
    'link': function(scope, element, attrs) {
      var isDirectory = attrs.hasOwnProperty('ngDirectory');
      var isSingleFile = attrs.hasOwnProperty('ngSingleFile');
      scope.$flow.assignBrowse(element, isDirectory, isSingleFile);
    }
  };
}]);