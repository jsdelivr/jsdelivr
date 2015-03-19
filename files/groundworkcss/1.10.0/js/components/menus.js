(function() {
  var $window, navSelector;

  navSelector = $('.nav').length > 0 ? '.nav' : 'nav';

  $window = $(window);

  $(function() {
    var $body, delay, openMenu,
      _this = this;
    $body = $('body');
    delay = void 0;
    openMenu = function($target) {
      $target.parents('li.menu').toggleClass('on');
    };
    $body.on('mouseenter', navSelector + ' > ul > li.menu:not(.disabled)', function(e) {
      if ($window.width() >= 768) {
        clearTimeout(delay);
        $(navSelector + ' > ul > li.menu.on').removeClass('on');
        $(this).addClass('on');
      }
    });
    $body.on('mouseleave', navSelector + ' > ul > li.menu:not(.disabled)', function(e) {
      if ($window.width() >= 768) {
        delay = setTimeout((function() {
          return $(navSelector + ' > ul > li.menu.on').removeClass('on');
        }), 350);
      }
    });
    $body.on('click', navSelector + ' > ul > li.menu:not(.disabled) > a', function(e) {
      var $target;
      $target = $(e.target);
      if (!$target.hasClass('focused')) {
        if (Modernizr.touch || $window.width() < 768) {
          openMenu($target);
        } else {
          $(navSelector + ' > ul > li.menu.on').removeClass('on');
          $target.parents('li.menu').addClass('on');
        }
      } else {
        $target.removeClass('focused');
      }
      e.stopImmediatePropagation();
      return false;
    });
    $body.on('focusin', navSelector + ' > ul > li.menu > a', function(e) {
      var $target;
      $target = $(e.currentTarget);
      $target.addClass('focused');
      openMenu($target);
      e.stopImmediatePropagation();
    });
    $body.on('focusin', navSelector + ' > ul > li.menu:not(.on) > a', function(e) {
      $(navSelector + ' > ul > li.menu.on').removeClass('on');
    });
    $body.on('dropdown', function(e) {
      var $target;
      $target = $(e.target);
      $('.dropdown').not($target).removeClass('on');
      $target[$target.hasClass('on') ? 'removeClass' : 'addClass']('on');
    });
    $body.on('click', '.dropdown', function(e) {
      var $target;
      $target = $(e.currentTarget);
      if (!$target.is('a')) {
        e.stopPropagation();
      }
      if (!$target.hasClass('focused')) {
        $target.trigger('dropdown');
      } else {
        $target.removeClass('focused');
      }
    });
    $body.on('click', function() {
      var $dropdown, $menu;
      $dropdown = $('.dropdown.on');
      if ($dropdown.length) {
        $dropdown.removeClass('on');
      }
      $menu = $(navSelector + '.menu.on');
      if ($menu.length) {
        $menu.removeClass('on');
      }
    });
    $body.on('focus', '.dropdown', function(e) {
      var $target;
      $target = $(e.currentTarget);
      if (!$(e.target).is('a')) {
        if ($target.hasClass('dropdown')) {
          $target.addClass('focused').trigger('dropdown');
        }
      } else {
        e.stopPropagation();
      }
    });
    $body.on('focusout', '.dropdown li:last-child a', function(e) {
      $('.dropdown.on').removeClass('on');
    });
    $body.on('menu-toggle', function(e) {
      var $target;
      $target = $(e.target).parents(navSelector + '.menu');
      $target[$target.hasClass('on') ? 'removeClass' : 'addClass']('on');
    });
    $(navSelector + '.menu').each(function() {
      var $this;
      $this = $(this);
      if (!$this.attr('data-label')) {
        $this.attr('data-label', 'Menu');
      }
      if (!($this.find('.menu-toggle').length > 0)) {
        $this.prepend('<a href="#" class="menu-toggle"><i class="icon-reorder"></i></a>');
      }
    });
    $body.on('click', navSelector + '.menu .menu-toggle', function(e) {
      var $parent, $target;
      $target = $(e.target);
      e.stopPropagation();
      e.preventDefault();
      if ($target.parents('.menu-toggle').length) {
        $parent = $target.parents('.menu-toggle');
        if (!$parent.hasClass('focused')) {
          $parent.trigger('menu-toggle');
        } else {
          $parent.removeClass('focused');
        }
      } else if (!$target.hasClass('focused')) {
        $target.trigger('menu-toggle');
      } else {
        $target.removeClass('focused');
      }
    });
    $body.on('focusin', navSelector + '.menu .menu-toggle', function(e) {
      var $parent, $target;
      $target = $(e.target);
      if ($target.hasClass('menu-toggle')) {
        $target.addClass('focused').trigger('menu-toggle');
      } else if (($parent = $target.parents('.menu-toggle')).length) {
        $parent.addClass('focused').trigger('menu-toggle');
      }
    });
    $body.on('focusout', navSelector + '.menu > ul > li:last-child a', function(e) {
      $(navSelector + '.menu.on').removeClass('on');
    });
  });

  $window.on('resize', function() {
    var selector;
    selector = $(navSelector + ' > ul > li.menu.on');
    if (selector.length > 1) {
      return selector.removeClass('on').first().addClass('on');
    }
  });

}).call(this);
