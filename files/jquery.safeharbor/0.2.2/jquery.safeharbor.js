/*!
 * jQuery SafeHarbor Plugin v0.2.2 - 2013-11-24
 * http://ndnhat.github.io/jquery-safeharbor
 * 
 * Copyright 2013 Nhat Nguyen
 * Licensed MIT */
(function ($) {
  'use strict';

  $.safeHarbor = function (options) {
    var hideNotice = function() {
      saveCookie();
      $(this).closest('div').fadeOut();
    };

    var saveCookie = function() {
      if ($.cookie) {
        $.cookie($.safeHarbor.defaults.cookie.name, 'notified', { expires: $.safeHarbor.defaults.cookie.life });
      }
    };

    var closeBtn = null;
    var closeBrnStyles = {float: 'right', margin: '0 12px', cursor: 'pointer'};
    var notice = null;

    options = $.extend(true, $.safeHarbor.defaults, options);

    if (!$.cookie || !$.cookie(options.cookie.name)) {
      closeBtn = $('<span>').css(closeBrnStyles).text('×').on('click', hideNotice);
      notice = $('<div>').addClass(options.cssClass).css(options.styles).html(options.text).append(closeBtn);
      $('body').prepend(notice);
    }

    return notice;
  };

  $.safeHarbor.defaults = {
    text: 'This website requires cookies to function properly. Read more about this in our Privacy Policy.',
    cookie: {
      name: 'safe_harbor',
      life: 10*365
    },
    cssClass: null,
    styles: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      textAlign: 'center',
      padding: '5px 0',
      color: '#eee',
      background: '#444',
      opacity: 0.9,
      zIndex: 5
    }
  };

}(jQuery));
