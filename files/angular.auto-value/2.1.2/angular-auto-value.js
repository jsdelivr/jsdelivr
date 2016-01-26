(function (ng) {

  var MILLISECONDS_PER_DAY = 86400000,
      OFFSET_TO_START_WEEK_ON_MONDAY = 1,
      JAN = 0,
      DAYS_PER_WEEK = 7,
      $PARSE = '$parse';

  function getFirstDateOfTheYear(date) {
    return new Date(date.getFullYear(), JAN, 1);
  }

  function getFirstMondayOfTheYear(date) {
    var firstJan = getFirstDateOfTheYear(date);
    return firstJan.getDay() + OFFSET_TO_START_WEEK_ON_MONDAY;
  }

  function setWeek(date, week) {
    var dayOfTheYear = Math.floor(week * DAYS_PER_WEEK),
        daysSinceFirstJan = dayOfTheYear - getFirstMondayOfTheYear(date),
        msSinceFirstJan = daysSinceFirstJan * MILLISECONDS_PER_DAY,
        firstJan = getFirstDateOfTheYear(date),
        ms = firstJan.getTime() + msSinceFirstJan;
    date.setTime(ms);
  }

  function setter(parse, scope, attr) {
    var getter = parse(attr);
    return function (value) {
      getter.assign(scope, value);
    };
  }

  function time(value, set) {
    var date = new Date(),
        time = value.split(/[:\.]/);
    date.setHours.apply(date, time);
    set(date);
  }

  function week(value, set) {
    var val = value.split('-W'),
        year = +val[0],
        week = +val[1],
        date = new Date(year, JAN, 1);
    setWeek(date, week);
    set(date);
  }

  function autoInputValueDirective($parse) {
    function link($scope, $element, $attrs) {
      if (!$attrs.ngModel) return;
      var set = setter($parse, $scope, $attrs.ngModel),
          value = $element.val(),
          selected = $attrs.selected,
          method;
      switch ($attrs.type) {
        case "button":
        case "file":
        case "hidden":
        case "image":
        case "reset":
        case "submit":
          return;
        case "checkbox":
          set(selected);
          break;
        case "number":
        case "range":
          set(+value);
          break;
        case "radio":
          if (selected) set(value);
          break;
        case "date":
        case "datetime":
        case "datetime-local":
        case "month":
          set(new Date(value));
          break;
        case "time":
          time(value, set);
          break;
        case "week":
          week(value, set);
          break;
        default:
          set(value);
      }
    }
    return {
      restrict: "E",
      link: link
    };
  }

  function autoValueDirective($parse) {
    function link($scope, $element, $attrs) {
      if (!$attrs.ngModel) return;
      var val = $element.val(),
          set = setter($parse, $scope, $attrs.ngModel);
      set(val);
    }
    return {
      restrict: "E",
      link: link
    };
  }

  autoValueDirective.$inject = [$PARSE];

  ng
    .module('auto-value', [])
    .directive('input', [$PARSE, autoInputValueDirective])
    .directive('select', autoValueDirective)
    .directive('textarea', autoValueDirective);

}(angular));

