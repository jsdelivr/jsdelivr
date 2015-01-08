/**
 * jQuery Unveil-Effects
 * - Modified version of (http://luis-almeida.github.com/unveil) to detect only when the item is in viewport
 * 
 * - Author: @geedmo
 * - URI: https://github.com/geedmo
 */

!(function($) {

  //-------------------------------
  // Plugin definition
  //-------------------------------

  $.fn.unveilEffect = function(callback, threshold) {
    var $w = $(window), th = threshold || 0, images = this, loaded, inview, source;
    this.one('unveil.effect', callback)
    function unveil() {
      inview = images.filter(function() {
        var $e = $(this), wt = $w.scrollTop(), wb = wt + $w.height(), et = $e.offset().top, eb = et + $e.height();
        return eb >= wt - th && et <= wb + th;
      });
      loaded = inview.trigger("unveil.effect"); images = images.not(loaded);
    }
    $w.scroll(unveil).resize(unveil).load(unveil);
    return this;
  };

  //-------------------------------
  // Defaults can be override
  //-------------------------------


  unveilEffectSettings = $.extend({
    
      transitionDuration: 0.7     // seconds
    , transitionEasing:   "ease-in-out" // css timing
    , selector:           '[data-effect]' // animatable items selector
    , threshold:          100    // px of the appearing elements before run animation

  }, (typeof(unveilEffectSettings) != 'undefined' ? unveilEffectSettings : false));

  //-------------------------------
  // Autorstart on document ready
  //-------------------------------

  $(function() {

    // transition name detection
    $.fn.unveilEffect.transition = (function () {
        var el = document.createElement('bs')

        var transEndEventNames = {
          'WebkitTransition' : '-webkit-transition'
        , 'MozTransition'    : '-moz-transition'
        , 'OTransition'      : '-o-transition'
        , 'transition'       : '-transition'
        }

        for (var name in transEndEventNames) {
          if (el.style[name] !== undefined) {
            return { css: transEndEventNames[name] }
          }
        }
    })();

    // if no transition support, do nothing
    if( ! $.fn.unveilEffect.transition)
        return;

    var animSelector = $(unveilEffectSettings.selector);

    animSelector
      .each(function() {
        var $this = $(this), effectName = $this.data('effect');
        // add effect class and force reflow
        $this.addClass('effect-' + effectName)[0].offsetWidth;
        $this.css($.fn.unveilEffect.transition.css,
                   'all ' + 
                          unveilEffectSettings.transitionDuration + 's ' +
                          unveilEffectSettings.transitionEasing)
      })
      .unveilEffect(function() {
          // activate animation
          $(this).addClass('in')

      }, (- unveilEffectSettings.threshold) )

  })

})(window.jQuery);