(function() {
  var equalizeColumns;

  $(window).on('load resize', function() {
    return equalizeColumns();
  });

  equalizeColumns = function() {
    return $('.row.equalize').each(function() {
      var $row, collapsed, tallest;
      $row = $(this);
      tallest = 0;
      collapsed = false;
      $row.children('*').each(function(i) {
        var $this;
        $this = $(this);
        $this.css('minHeight', '1px');
        collapsed = $this.outerWidth() === $row.outerWidth();
        if (!collapsed) {
          if (!$this.hasClass('equal')) {
            $this.addClass('equal');
          }
          if ($this.outerHeight() > tallest) {
            tallest = $this.outerHeight();
          }
        }
      });
      if (!collapsed) {
        return $row.children('*').css('min-height', tallest);
      }
    });
  };

}).call(this);
