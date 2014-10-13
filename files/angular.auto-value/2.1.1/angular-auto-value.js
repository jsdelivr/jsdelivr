(function (ng) {

  var MILLISECONDS_PER_DAY = 86400000,
      OFFSET_TO_START_WEEK_ON_MONDAY = 1,
      JAN = 0,
      DAYS_PER_WEEK = 7;

  function getFirstDateOfTheYear(date) {
    return new Date(date.getFullYear(), JAN, 1);
  }

  function getFirstDayOfTheYear(date) {
    var firstJan = getFirstDateOfTheYear(date);
    return firstJan.getDay() + OFFSET_TO_START_WEEK_ON_MONDAY;
  }

  function setWeek(date, week) {
    var dayOfTheYear = Math.floor(week * DAYS_PER_WEEK),
        daysSinceFirstJan = dayOfTheYear - getFirstDayOfTheYear(date),
        msSinceFirstJan = daysSinceFirstJan * MILLISECONDS_PER_DAY,
        firstJan = getFirstDateOfTheYear(date),
        ms = firstJan.getTime() + msSinceFirstJan;
    date.setTime(ms);
  }

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

  AutoInputValueCtrl.prototype.set = function (value) {
    this.setter(this.$scope, value);
  };

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
      case "date":
      case "datetime":
      case "datetime-local":
      case "month":
        this.updateDate();
        break;
      case "time":
        this.updateTime();
        break;
      case "week":
        this.updateWeek();
        break;
      default:
        this.updateText();
    }
  };

  AutoInputValueCtrl.prototype.updateText = function () {
    this.set(this.val);
  };

  AutoInputValueCtrl.prototype.updateRadio = function () {
    if (this.$attrs.selected) {
      this.set(this.val);
    }
  };

  AutoInputValueCtrl.prototype.updateCheckbox = function () {
    this.set(this.$attrs.selected);
  };

  AutoInputValueCtrl.prototype.updateNumber = function () {
    this.set(+this.val);
  };

  AutoInputValueCtrl.prototype.updateDate = function () {
    this.set(new Date(this.val));
  };

  AutoInputValueCtrl.prototype.updateTime = function () {
    var date = new Date(),
        time = this.val.split(/[:\.]/);
    date.setHours.apply(date, time);
    this.set(date);
  };

  AutoInputValueCtrl.prototype.updateWeek = function () {
    var val = this.val.split('-W'),
        year = +val[0],
        week = +val[1],
        date = new Date(year, JAN, 1);
    setWeek(date, week);
    this.set(date);
  };

  function autoInputValueDirective() {
    return {
      restrict: "E",
      controller: ["$scope", "$attrs", "$parse", AutoInputValueCtrl]
    };
  }

  function autoValueDirective($parse) {
    function link($scope, $element, $attrs) {
      if ($attrs.ngModel) {
        var val = $element.val(),
            getter = $parse($attrs.ngModel),
            setter = getter.assign;
        setter($scope, val);
      }
    }
    return {
      restrict: "E",
      link: link
    };
  }

  autoValueDirective.$inject = ['$parse'];

  ng
    .module('auto-value', [])
    .directive('input', autoInputValueDirective)
    .directive('select', autoValueDirective)
    .directive('textarea', autoValueDirective);

}(angular));

