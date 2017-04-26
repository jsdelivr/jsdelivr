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

  ng.extend(AutoInputValueCtrl.prototype, {
    update: function () {
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
    },

    updateText: function () {
      this.setter(this.$scope, this.val);
    },

    updateRadio: function () {
      if (this.$attrs.selected) {
        this.setter(this.$scope, this.val);
      }
    },

    updateCheckbox: function () {
      if (this.$attrs.selected) {
        this.setter(this.$scope, true);
      }
    },

    updateNumber: function () {
      this.setter(this.$scope, parseInt(this.val));
    }
  });

  function autoInputValueDirective() {
    return {
      restrict: "E",
      controller: ["$scope", "$attrs", "$parse", AutoInputValueCtrl]
    };
  }

  function autoTextareaValueDirective($parse) {
    return {
      restrict: "E",
      link: function ($scope, $element, $attrs) {
        if ($attrs.ngModel) {
          var val = $element.text(),
              getter = $parse($attrs.ngModel),
              setter = getter.assign;
          return setter($scope, val);
        }
      }
    };
  }

  function autoSelectValueDirective($parse) {
    return {
      restrict: 'E',
      link: function ($scope, $element, $attrs) {
        if ($attrs.ngModel) {
          var getter = $parse($attrs.ngModel),
              setter = getter.assign,
              i, options, option;
          options = $element.find('option');
          for (i=options.length-1; i>-1; i--) {
            option = ng.element(options[i]);
            if (option.attr('selected')) {
              return setter($scope, option.val());
            }
          }
        }
      }
    };
  }

  ng
    .module('auto-value', [])
    .directive('input', autoInputValueDirective)
    .directive('textarea', ['$parse', autoTextareaValueDirective])
    .directive('select', ['$parse', autoSelectValueDirective]);
}(angular));

