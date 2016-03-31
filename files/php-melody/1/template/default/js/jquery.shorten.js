jQuery.fn.shorten = function(settings) {
  var config = {
    showChars : 100,
    ellipsesText : "...",
    moreText : "more",
    lessText : "less"
  };

  if (settings) {
    $.extend(config, settings);
  }

  $('.morelink').live('click', function() {
    var $this = $(this);
    if ($this.hasClass('less')) {
      $this.removeClass('less');
      $this.html(config.moreText);
    } else {
      $this.addClass('less');
      $this.html(config.lessText);
    }
    $this.parent().prev().toggle();
    $this.prev().toggle();
    return false;
  });

  return this.each(function() {
    var $this = $(this);

    var content = $this.html();
    if (content.length > config.showChars) {
      var c = content.substr(0, config.showChars);
      var h = content.substr(config.showChars , content.length - config.showChars);
      var html = c + '<p class="moreellipses">' + config.ellipsesText + '&nbsp;</p><p class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="javascript://nop/" class="morelink">' + config.moreText + '</a></p>';
      $this.html(html);
      $(".morecontent span").hide();
    }
  });
};