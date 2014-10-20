var initialValueModule = angular.module('initialValue', [])
.directive('initialValue', function() {
  return{
    restrict: 'A',
    controller: ['$scope', '$element', '$attrs', '$parse', function($scope, $element, $attrs, $parse){

      var getter, setter, val, tag;
      tag = $element[0].tagName.toLowerCase();

      val = $attrs.initialValue || $element.val();
      if(tag === 'input'){
        if($element.attr('type') === 'checkbox'){
          val = $element[0].checked ? true : undefined;
        } else if($element.attr('type') === 'radio'){
          val = ($element[0].checked || $element.attr('selected') !== undefined) ? $element.val() : undefined;
        } 
      }

      if($attrs.ngModel){
        getter = $parse($attrs.ngModel);
        setter = getter.assign;
        setter($scope, val);
      }
    }]
  };
});

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = initialValueModule;
}
