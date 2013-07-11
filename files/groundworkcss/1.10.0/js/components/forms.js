(function() {
  $(function() {
    var $body;
    $body = $('body');
    $body.on('click', ['.error input', '.error textarea', '.invalid input', '.invalid textarea', 'input.error', 'textarea.error ', 'input.invalid', 'textarea.invalid '].join(','), function() {
      return $(this).focus().select();
    });
    $('.select select').each(function() {
      var $this;
      $this = $(this);
      if ($this.children('option').first().val() === '' && $this.children('option').first().attr('selected')) {
        $this.addClass('unselected');
      } else {
        $this.removeClass('unselected');
      }
    });
    $body.on('change', '.select select', function() {
      var $this;
      $this = $(this);
      if ($this.children('option').first().val() === '' && $this.children('option').first().attr('selected')) {
        $this.addClass('unselected');
      } else {
        $this.removeClass('unselected');
      }
    });
  });

}).call(this);
