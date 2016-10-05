(function($) {
  $('.fa-bars').on('click', function clickHandler(e) {
    e.preventDefault();
    $('.magic-container').toggleClass('closed');
  });
})(jQuery);
