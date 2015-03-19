/*
 * Requires jquery.responsiveText.js
*/


(function() {
  $(function() {
    $('.responsive').not('table').each(function(index, object) {
      var $this, compression, max, min, scrollReset, scrollTime;
      $this = $(this);
      compression = 10;
      min = 10;
      max = 200;
      scrollTime = 650;
      scrollReset = 200;
      compression = parseFloat($this.attr('data-compression') || compression);
      min = parseFloat($this.attr('data-min') || min);
      max = parseFloat($this.attr('data-max') || max);
      $(object).responsiveText({
        compressor: compression,
        minSize: min,
        maxSize: max
      });
      $this.hover((function() {
        var difference;
        difference = $this.get(0).scrollWidth - $this.width();
        if (difference > scrollTime) {
          scrollTime = difference;
        }
        if (difference > 0) {
          return $this.stop().animate({
            "text-indent": -difference
          }, scrollTime);
        }
      }), function() {
        return $this.stop().animate({
          "text-indent": 0
        }, scrollReset);
      });
    });
  });

}).call(this);
