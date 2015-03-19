/**
 * imageFill.js
 * Author & copyright (c) 2013: John Polacek
 * johnpolacek.com
 * https://twitter.com/johnpolacek
 *
 * Dual MIT & GPL license
 * 
 * Project Page: http://johnpolacek.github.io/imagefill.js
 *
 * The jQuery plugin for making images fill their containers (and be centered)
 * 
 * EXAMPLE
 * Given this html:
 * <div class="container"><img src="myawesomeimage" /></div>
 * $('.container').imageFill(); // image stretches to fill container
 *
 * REQUIRES:
 * imagesLoaded - https://github.com/desandro/imagesloaded
 *
 */
 ;(function($) {

  $.fn.imagefill = function(options) {

    var $container = this,
        $img = $container.find('img').addClass('loading').css({'position':'absolute'}),
        imageAspect = 1/1,
        containersH = 0,
        containersW = 0,
        defaults = {
          runOnce: false,
          throttle : 200  // 5fps
        },
        settings = $.extend({}, defaults, options);

    // make sure container isn't position:static
    var containerPos = $container.css('position');
    $container.css({'overflow':'hidden','position':(containerPos === 'static') ? 'relative' : containerPos});

    // set containerH, containerW
    $container.each(function() {
      containersH += $(this).height();
      containersW += $(this).width();
    });

    // wait for image to load, then fit it inside the container
    $container.imagesLoaded().done(function($img) {
      imageAspect = $img.width() / $img.height();
      $img.removeClass('loading');
      fitImages();
      if (!settings.runOnce) {
        checkSizeChange();
      }
    });

    function fitImages() {

      $container.each(function() {
        var containerW = $(this).width();
        var containerH = $(this).height();
        var containerAspect = containerW/containerH;
        if (containerAspect < imageAspect) {
          // taller
          $(this).find('img').css({
              width: 'auto',
              height: containerH,
              top:0,
              left:-(containerH*imageAspect-containerW)/2
            });
        } else {
          // wider
          $(this).find('img').css({
              width: containerW,
              height: 'auto',
              top:-(containerW/imageAspect-containerH)/2,
              left:0
            });
        }
      });
    }

    function checkSizeChange() {
      var checkW = 0,
          checkH = 0;
      $container.each(function() {
        checkH += $(this).height();
        checkW += $(this).width();
      });
      if (containersH !== checkH || containersW !== checkW) {
        fitImages();
      }
      setTimeout(checkSizeChange, settings.throttle);
    }

    // return for chaining
    return this;
  };

}(jQuery));