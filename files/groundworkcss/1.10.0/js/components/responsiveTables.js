/*
 * Requires jquery.responsiveText.js
*/


(function() {
  $(function() {
    $('table.responsive').each(function(index, object) {
      var $this, compression, max, min, padding;
      $this = $(this);
      compression = 30;
      min = 8;
      max = 13;
      padding = 0;
      compression = parseFloat($this.attr('data-compression') || compression);
      min = parseFloat($this.attr('data-min') || min);
      max = parseFloat($this.attr('data-max') || max);
      padding = parseFloat($this.attr('data-padding') || padding);
      $(object).responsiveTable({
        compressor: compression,
        minSize: min,
        maxSize: max,
        padding: padding
      });
    });
  });

}).call(this);
