(function() {
  $(function() {
    return $(".dismissible").click(function() {
      return $(this).hide(150, function() {
        return $(this).remove();
      });
    });
  });

}).call(this);
