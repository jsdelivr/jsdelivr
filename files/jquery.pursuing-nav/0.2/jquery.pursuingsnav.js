/*!
 * Pursuing Nav v0.2 (http://akurganow.github.io/pursuing-nav)
 * Copyright 2013-2014 Alexander Kurganov.
 * Licensed under GPL License (http://www.gnu.org/licenses/gpl.html)
 */

(function($) {
  $.fn.pursuingsnav = function(){
    var userAgent = navigator.userAgent,
        is_pursuing = true,
        is_fixed = false;

    if(/android|iphone|ipad/i.test(userAgent)){
      is_pursuing = false,
      is_fixed = true;
    }

		var element = this,
				height = element.outerHeight(),
				width = element.outerWidth(),
				offsetTop = element.offset().top,
				offsetLeft = element.offset().left,
				stick = height+offsetTop;
				presc = 0,
				delta = 0;

    if(is_pursuing){
      element.css({
        position: 'absolute',
        top: offsetTop
      });

      $(window).scroll(function(){
        var sc = $(document).scrollTop()
            height = element.outerHeight(),
            width = element.outerWidth(),
            offsetTop = element.offset().top,
            offsetLeft = element.offset().left,
            stick = height+offsetTop;
        if(sc>0){
          if(presc<sc){delta = -1}
          else if(presc>sc){delta = 1}
          else{delta = 0};
        }
        if(delta<0){
          if(sc == element.offset().top){
            element.css({
              position: 'absolute',
              top:sc
            });
          }
          else if(sc>stick){
            element.css({
              position: 'absolute',
              top: sc-height
            });
          }

        }
        else if(delta>0){
          stick = height+element.offset().top;
          if(sc <= element.offset().top){
            element.css({
              position: 'fixed',
              top: 0
            });
          }
        }
        presc = sc;
      });
    }
    else if(is_fixed){
      var element = this;
      element.css({
        position: 'fixed',
        top: offsetTop
      });
    }
  };
})(jQuery);
