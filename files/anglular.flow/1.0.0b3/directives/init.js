angular.module('ngFlow.init', ['ngFlow.provider'])
.controller('NgFlowCtrl', ['$scope', '$attrs', '$parse', 'flowFactory',
function ($scope, $attrs, $parse, flowFactory) {
  // create the flow object
  var options = angular.extend({}, $scope.$eval($attrs.ngFlowInit));
  var flow = flowFactory.create(options);

  var events = {
    fileSuccess: ['$file', '$message'],
    fileProgress: ['$file'],
    fileAdded: ['$file', '$event'],
    filesAdded: ['$files', '$event'],
    filesSubmitted: ['$files', '$event'],
    fileRetry: ['$file'],
    fileError: ['$file', '$message'],
    uploadStart: [],
    complete: [],
    progress: [],
    error: ['$message', '$file']
  };

  function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  angular.forEach(events, function (eventArgs, eventName) {
    var attr = 'ng' + capitaliseFirstLetter(eventName);
    if (!$attrs.hasOwnProperty(attr)) {
      return ;
    }
    var fn = $parse($attrs[attr]);
    flow.on(eventName, function() {
      var funcArgs = arguments;
      var args = {};
      angular.forEach(eventArgs, function(value, key) {
        args[value] = funcArgs[key];
      });
      return fn($scope, args);
    });
  });

  flow.on('catchAll', function (event) {
    if ({
      'progress':1, 'filesSubmitted':1, 'fileSuccess': 1, 'fileError': 1
    }[event]) {
      $scope.$apply();
    }
  });
  $scope.$flow = flow;
}])
.directive('ngFlowInit', [function() {
  return {
    scope: true,
    controller: 'NgFlowCtrl'
  };
}]);