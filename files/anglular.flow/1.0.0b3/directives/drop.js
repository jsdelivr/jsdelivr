angular.module('ngFlow.drop', ['ngFlow.init'])
.directive('ngFlowDrop', ['$timeout', function($timeout) {
  return {
    'scope': false,
    'require': '^ngFlowInit',
    'link': function(scope, element, attrs) {
      scope.$flow.assignDrop(element);
      var dragOverClass = attrs.ngDragOverClass;
      if (dragOverClass) {
        var promise;
        element.bind('dragover', function (event) {
          if (!isFileDrag(event)) {
            return ;
          }
          element.addClass(dragOverClass);
          $timeout.cancel(promise);
          promise = $timeout(function () {
            element.removeClass(dragOverClass);
          }, 100, false);
          event.preventDefault();
        });
      }
      function isFileDrag(dragEvent) {
        var fileDrag = false;
        var dataTransfer = dragEvent.dataTransfer || dragEvent.originalEvent.dataTransfer;
        angular.forEach(dataTransfer && dataTransfer.types, function(val) {
          if (val === 'Files') {
            fileDrag = true;
          }
        });
        return fileDrag;
      }
    }
  };
}]);