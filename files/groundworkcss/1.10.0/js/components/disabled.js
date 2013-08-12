(function() {
  $(function() {
    $('.disabled').each(function() {
      var $this;
      $this = $(this);
      $this.attr('tabindex', '-1');
      $this.find('a').attr('tabindex', '-1');
      $this.find('input, select, textarea').addClass('disabled').attr('tabindex', '-1').attr('readonly', 'readyonly');
    });
    $('body').on('click', '.disabled, .disabled *', function(e) {
      e.preventDefault();
      return false;
    });
  });

}).call(this);
