(function (ng) {

  function switchSce(ie7Config, $sceProvider) {
    $sceProvider.enabled(!ie7Config.on);
  }

  function fixAnimation(ie7Config, $$asyncCallback, $animate) {
    function async(fn) {
      return fn && $$asyncCallback(fn);
    }

    if (ie7Config.on) {
      $animate.addClass = function (element, className, done) {
        ng.element(element).addClass(className);
        async(done);
      };

      $animate.removeClass = function (element, className, done) {
        ng.element(element).removeClass(className);
        async(done);
      };
    }
  }

  ng
    .module('ie7-support', [])
    .constant('ie7Config', { on: !!document.getElementById('ng-app') })
    .config(['ie7Config', '$sceProvider', switchSce])
    .run(['ie7Config', '$$asyncCallback', '$animate', fixAnimation]);

}(angular));

