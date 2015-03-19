(function() {
  $(function() {
    var $body;
    $body = $('body');
    $('.tiles').each(function() {
      var $this;
      $this = $(this);
      $this.find('.tile').attr('role', 'button');
      $this.find('.tile[data-value=' + $this.find('input.value, select.value').val() + ']').addClass('active');
    });
    $body.on('click', '.tiles .tile', function(e) {
      var $this, tiles;
      $this = $(this);
      if (!$this.hasClass('disabled')) {
        tiles = $this.parents('.tiles');
        tiles.find('.tile').removeClass('active');
        tiles.find('input.value, select.value').val($this.data('value')).change();
        $this.addClass('active');
      }
      e.preventDefault();
      return false;
    });
    $body.on('change', '.tiles input.value, .tiles select.value', function() {
      var $this, tiles;
      $this = $(this);
      tiles = $this.parents('.tiles');
      tiles.find('.tile').removeClass('active');
      tiles.find('.tile[data-value=' + $this.val() + ']').addClass('active');
    });
  });

}).call(this);
