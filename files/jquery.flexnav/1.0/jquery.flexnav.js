/*
	FlexNav.js 0.9

	Copyright 2013, Jason Weaver http://jasonweaver.name
	Released under http://unlicense.org/

//
*/


(function() {
  var $;

  $ = jQuery;

  $.fn.flexNav = function(options) {
    var $nav, breakpoint, resetMenu, resizer, selector, settings, showMenu;
    settings = $.extend({
      'animationSpeed': 150,
      'buttonSelector': '.menu-button',
      'flexbox': true,
      'hoverIntent': false,
      'hoverIntentTimeout': 150
    }, options);
    $nav = $(this);
    $nav.find("li").each(function() {
      if ($(this).has("ul").length) {
        return $(this).addClass("item-with-ul").find("ul").hide();
      }
    });
    if ($nav.data('breakpoint')) {
      breakpoint = $nav.data('breakpoint');
    }
    showMenu = function() {
      return $(this).find('>ul').addClass('show').stop(true, true).slideDown(settings.animationSpeed);
    };
    resetMenu = function() {
      return $(this).find('>ul').removeClass('show').stop(true, true).slideUp(settings.animationSpeed);
    };
    resizer = function() {
      if ($(window).width() <= breakpoint) {
        $nav.removeClass("lg-screen").addClass("sm-screen");
        $('.one-page li a').on('click', function() {
          return $nav.removeClass('show');
        });
        return $('.item-with-ul').off();
      } else if ($(window).width() > breakpoint) {
        $nav.removeClass("sm-screen").addClass("lg-screen");
        $nav.removeClass('show');
        if (settings.hoverIntent === true) {
          return $('.item-with-ul').hoverIntent({
            over: showMenu,
            out: resetMenu,
            timeout: settings.hoverIntentTimeout
          });
        } else if (settings.hoverIntent === false) {
          return $('.item-with-ul').on('mouseenter', showMenu).on('mouseleave', resetMenu);
        }
      }
    };
    $(settings['buttonSelector']).data('navEl', $nav);
    selector = '.item-with-ul, ' + settings['buttonSelector'];
    $(selector).append('<span class="touch-button"><i class="navicon">&#9660;</i></span>');
    selector = settings['buttonSelector'] + ', ' + settings['buttonSelector'] + ' .touch-button';
    $(selector).on('touchstart click', function(e) {
      var $btnParent, $thisNav, bs;
      e.preventDefault();
      e.stopPropagation();
      console.log('clicked');
      bs = settings['buttonSelector'];
      $btnParent = $(this).is(bs) ? $(this) : $(this).parent(bs);
      $thisNav = $btnParent.data('navEl');
      return $thisNav.toggleClass('show');
    });
    $('.touch-button').on('touchstart click', function(e) {
      var $sub;
      e.preventDefault();
      e.stopPropagation();
      $sub = $(this).parent('.item-with-ul').find('>ul');
      if ($nav.hasClass('lg-screen') === true) {
        $(this).parent('.item-with-ul').siblings().find('ul.show').removeClass('show').hide();
      }
      if ($sub.hasClass('show') === true) {
        return $sub.removeClass('show').slideUp(settings.animationSpeed);
      } else if ($sub.hasClass('show') === false) {
        return $sub.addClass('show').slideDown(settings.animationSpeed);
      }
    });
    $nav.find('.item-with-ul *').focus(function() {
      $(this).parent('.item-with-ul').parent().find(".open").not(this).removeClass("open").hide();
      return $(this).parent('.item-with-ul').find('>ul').addClass("open").show();
    });
    resizer();
    return $(window).on('resize', resizer);
  };

}).call(this);
