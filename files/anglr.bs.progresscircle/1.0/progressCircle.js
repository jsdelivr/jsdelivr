//By Kevin Le - http://stackoverflow.com/users/1244013/khnle
//v1.0

angular.module('ui.bootstrap.progresscircle', [])

.constant('progressConfig', {
  elementWidth: 400,
  elementHeight: 400,
  outerCircleWidth: 20,
  innerCircleWidth: 5,
  outerCircleRadius: 100,
  innerCircleRadius: 70,
  labelFont: '30pt Calibri',
  outerCircleBackgroundColor: '#d9d9d9',
  outerCircleForegroundColor: '#428bca',
  innerCircleColor: '#d9d9d9',
  labelColor: '#428bca',
  percentFormat: false,
  displayPercentSign: true,
  max: 60,
  displayMax: true
})

.controller('ProgressCircleController', ['$scope', '$attrs', '$timeout', 'progressConfig', function($scope, $attrs, $timeout, progressConfig) {
//just a place holder for now  
}])

.directive('progressCircle', ['$parse', 'progressConfig', function(parse, progressConfig) {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    controller: 'ProgressCircleController',
    link: function(s, e, a, progressCtrl) {
      
      var width = parse(a.elementWidth)(s) || progressConfig.elementWidth,
          height = parse(a.elementHeight)(s) || progressConfig.elementHeight,
          outerCircleWidth = parse(a.outerCircleWidth)(s) || progressConfig.outerCircleWidth,
          innerCircleWidth = parse(a.innerCircleWidth)(s) || progressConfig.innerCircleWidth,
          outerCircleBackgroundColor = parse(a.outerCircleBackgroundColor)(s) || progressConfig.outerCircleBackgroundColor,
          outerCircleForegroundColor = parse(a.outerCircleForegroundColor)(s) || progressConfig.outerCircleForegroundColor,
          innerCircleColor = parse(a.innerCircleColor)(s) || progressConfig.innerCircleColor,
          labelColor = parse(a.labelColor)(s) || progressConfig.labelColor,
          outerCircleRadius = parse(a.outerCircleRadius)(s) || progressConfig.outerCircleRadius,
          innerCircleRadius = parse(a.innerCircleRadius)(s) || progressConfig.innerCircleRadius,
          labelFont = parse(a.labelFont)(s) || progressConfig.labelFont,
          percentFormat = parse(a.percentFormat)(s) || progressConfig.percentFormat,
          displayPercentSign = parse(a.displayPercentSign)(s) || progressConfig.displayPercentSign,
          max = parse(a.max)(s) || progressConfig.max,
          displayMax = parse(a.displayMax)(s) || progressConfig.displayMax;
          
      var canvas = angular.element('<canvas>').attr({'width': width, 'height': height});
      
      e.replaceWith(canvas);
      
      s.$watch(a.progressCircleModel, function(newValue) {
        // Create the content of the canvas
        var ctx = canvas[0].getContext('2d');
        ctx.clearRect(0, 0, width, height);

        // The "background" circle
        var x = width / 2;
        var y = height / 2;
        ctx.beginPath();
        ctx.arc(x, y, outerCircleRadius, 0, Math.PI * 2, false);
        ctx.lineWidth = outerCircleWidth;
        ctx.strokeStyle = outerCircleBackgroundColor;
        ctx.stroke();

        // The inner circle
        ctx.beginPath();
        ctx.arc(x, y, innerCircleRadius, 0, Math.PI * 2, false);
        ctx.lineWidth = innerCircleWidth;
        ctx.strokeStyle = innerCircleColor;
        ctx.stroke();

        // The inner number
        ctx.font = labelFont;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = labelColor;
        if (percentFormat) {
          if (displayPercentSign) {
            ctx.fillText(newValue.value + ' %', x, y);
          } else {
            ctx.fillText(newValue.value, x, y);
          }
        } else {
          if (displayMax) {
            ctx.fillText(newValue.value + '/' + max, x, y);
          } else {
            ctx.fillText(newValue.value, x, y);
          }
        }

        // The "foreground" circle
        var startAngle = - (Math.PI / 2);
        var endAngle = percentFormat ? ((Math.PI * 2 ) * (newValue.value/100)) - (Math.PI / 2):
          ((Math.PI * 2 ) * (newValue.value/max)) - (Math.PI / 2);
        var anticlockwise = false;
        ctx.beginPath();
        ctx.arc(x, y, outerCircleRadius, startAngle, endAngle, anticlockwise);
        ctx.lineWidth = outerCircleWidth;
        ctx.strokeStyle = outerCircleForegroundColor;
        ctx.stroke();
      }, true);
    }
  };  
}]);

  
