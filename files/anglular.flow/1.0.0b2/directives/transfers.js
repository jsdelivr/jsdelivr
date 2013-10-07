angular.module('ngFlow.transfers', ['ngFlow.init'])
.directive('ngFlowTransfers', [function() {
  'use strict';
  return {
    'scope': true,
    'require': '^ngFlowInit',
    'link': function(scope) {
      scope.transfers = scope.$flow.files;
    }
  };
}]);