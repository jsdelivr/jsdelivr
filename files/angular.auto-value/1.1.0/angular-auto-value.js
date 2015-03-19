(function (ng) {
  function AutoInputValueCtrl($scope, $attrs, $parse) {
    this.$scope = $scope;
    this.$attrs = $attrs;
    if ($attrs.ngModel && $attrs.value) {
      this.val = $attrs.value;
      this.getter = $parse($attrs.ngModel);
      this.setter = this.getter.assign;
      this.update();
    }
  }
  
  AutoInputValueCtrl.prototype.update = function () {
    switch (this.$attrs.type) {
      case "button":
      case "file":
      case "hidden":
      case "image":
      case "reset":
      case "submit":
        break;
      case "checkbox":
        this.updateCheckbox();
        break;
      case "number":
      case "range":
        this.updateNumber();
        break;
      case "radio":
        this.updateRadio();
        break;
      default:
        this.updateText();
    }
  };
  
  AutoInputValueCtrl.prototype.updateText = function () {
    this.setter(this.$scope, this.val);
  };
  
  AutoInputValueCtrl.prototype.updateRadio = function () {
    if (this.$attrs.selected) {
      this.setter(this.$scope, this.val);
    }
  };
  
  AutoInputValueCtrl.prototype.updateCheckbox = function () {
    if (this.$attrs.selected) {
      this.setter(this.$scope, true);
    }
  };
  
  AutoInputValueCtrl.prototype.updateNumber = function () {
    this.setter(this.$scope, parseInt(this.val));
  };
  
  function autoInputValueDirective() {
    return {
      restrict: "E",
      controller: ["$scope", "$attrs", "$parse", AutoInputValueCtrl]
    };
  }
  
  function autoTextareaValueDirective() {
    return {
      restrict: "E",
      controller: [
        "$scope", "$element", "$attrs", "$parse",
        function ($scope, $element, $attrs, $parse) {
          if (!$attrs.ngModel) {
            var val = $element.text(),
                getter = $parse($attrs.ngModel),
                setter = getter.assign;
            return setter($scope, val);
          }
        }
      ]
    };
  }
  
  ng
    .module('auto-value', [])
    .directive('input', autoInputValueDirective)
    .directive('textarea', autoTextareaValueDirective);
}(angular));

