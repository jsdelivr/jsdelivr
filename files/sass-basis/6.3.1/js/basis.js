(function ($) {
'use strict';

$ = 'default' in $ ? $['default'] : $;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var BasisDrawer = function () {
  function BasisDrawer() {
    classCallCheck(this, BasisDrawer);

    this.setIdForSubmenu();
    this.setListener();
  }

  createClass(BasisDrawer, [{
    key: 'setListener',
    value: function setListener() {
      var _this = this;

      var btns = $('[data-c="drawer-btn"][aria-controls]');
      btns.each(function (i, e) {
        var btn = $(e);
        var drawer = $('#' + btn.attr('aria-controls'));
        var container = drawer.parent('[data-c="drawer"]');

        container.on('click', function (event) {
          _this.close(btn);
          _this.hidden(drawer);
          _this.close(drawer.find('[data-c="drawer__toggle"]'));
          _this.hidden(drawer.find('[data-c="drawer__submenu"]'));
        });

        drawer.on('click', function (event) {
          event.stopPropagation();
        });

        btn.on('click', function (event) {
          event.preventDefault();
          _this.toggleMenu(btn);
          event.stopPropagation();
        });

        $(window).on('resize', function (event) {
          _this.hidden(drawer);
          _this.close(btn);
        });
      });

      var toggleBtns = $('[data-c="drawer__toggle"][aria-controls]');
      toggleBtns.each(function (i, e) {
        var toggleBtn = $(e);
        var submenu = $('#' + toggleBtn.attr('aria-controls'));
        toggleBtn.on('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          _this.toggleMenu(toggleBtn);
        });
      });
    }
  }, {
    key: 'toggleMenu',
    value: function toggleMenu(btn) {
      var menu = $('#' + btn.attr('aria-controls'));
      if ('false' == btn.attr('aria-expanded')) {
        this.open(btn);
        this.show(menu);
      } else {
        this.close(btn);
        this.hidden(menu);
        this.close(menu.find('[data-c="drawer__toggle"]'));
        this.hidden(menu.find('[data-c="drawer__submenu"]'));
      }
    }
  }, {
    key: 'open',
    value: function open(target) {
      target.attr('aria-expanded', 'true');
    }
  }, {
    key: 'close',
    value: function close(target) {
      target.attr('aria-expanded', 'false');
    }
  }, {
    key: 'show',
    value: function show(target) {
      target.attr('aria-hidden', 'false');
    }
  }, {
    key: 'hidden',
    value: function hidden(target) {
      target.attr('aria-hidden', 'true');
    }
  }, {
    key: 'setIdForSubmenu',
    value: function setIdForSubmenu() {
      $('[data-c="drawer__submenu"][aria-hidden]').each(function (i, e) {
        var random = Math.floor(Math.random() * (9999999 - 1000000) + 1000000);
        var time = new Date().getTime();
        var id = 'drawer-' + time + random;
        var submenu = $(e);
        var toggleBtn = submenu.siblings('[data-c="drawer__toggle"]');
        if (submenu.length && toggleBtn.length) {
          submenu.attr('id', id);
          toggleBtn.attr('aria-controls', '' + id);
        }
      });
    }
  }]);
  return BasisDrawer;
}();

var BasisNavbar = function () {
  function BasisNavbar() {
    classCallCheck(this, BasisNavbar);

    this.items = $('[data-c="navbar__item"][aria-haspopup="true"], [data-c="navbar__subitem"][aria-haspopup="true"]');
    this.setListener();
  }

  createClass(BasisNavbar, [{
    key: 'setListener',
    value: function setListener() {
      var _this = this;

      this.items.each(function (i, e) {
        var item = $(e);
        item.on('mouseover focus', function (event) {
          _this.show(item.children('[data-c="navbar__submenu"]'));
        });

        item.on('mouseleave', function (event) {
          _this.hidden(item.children('[data-c="navbar__submenu"]'));
        });
      });
    }
  }, {
    key: 'show',
    value: function show(submenu) {
      submenu.attr('aria-hidden', 'false');
    }
  }, {
    key: 'hidden',
    value: function hidden(submenu) {
      submenu.attr('aria-hidden', 'true');
    }
  }]);
  return BasisNavbar;
}();

var BasisPageEffect = function () {
  function BasisPageEffect(params) {
    classCallCheck(this, BasisPageEffect);

    this.params = $.extend({
      duration: 200
    }, params);
    this.container = $('[data-c="page-effect"]');
    this.pageOutObject = $('[data-page-effect-link="true"], a[href]:not([target="_blank"], [href^="#"], [href*="javascript"], [href*=".jpg"], [href*=".jpeg"], [href*=".gif"], [href*=".png"], [href*=".mov"], [href*=".swf"], [href*=".mp4"], [href*=".flv"], [href*=".avi"], [href*=".mp3"], [href*=".pdf"], [href*=".zip"], [href^="mailto:"], [data-page-effect-link="false"])');
    this.setListener();
  }

  createClass(BasisPageEffect, [{
    key: 'setListener',
    value: function setListener() {
      var _this = this;

      $(window).on('load', function (event) {
        _this.hide();
      });

      this.pageOutObject.each(function (i, e) {
        var link = $(e);
        link.on('click', function (event) {
          if (event.shiftKey || event.ctrlKey || event.metaKey) {
            return;
          }

          event.preventDefault();
          _this.show();
          var url = link.attr('href');
          _this.moveLocation(url);
        });
      });
    }
  }, {
    key: 'moveLocation',
    value: function moveLocation(url) {
      setTimeout(function () {
        location.href = url;
      }, this.params['duration']);
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.container.attr('aria-hidden', 'true').attr('data-page-effect', 'fadein');
    }
  }, {
    key: 'show',
    value: function show() {
      this.container.attr('aria-hidden', 'false').attr('data-page-effect', 'fadeout');
    }
  }]);
  return BasisPageEffect;
}();

var BasisSelect = function BasisSelect() {
  classCallCheck(this, BasisSelect);

  this.select = $('[data-c="select"]');
  this.select.each(function (i, e) {
    var selectWrapper = $(e);
    var select = selectWrapper.find('select');
    var label = selectWrapper.find('[data-c="select__label"]');
    label.text(select.children('option:selected').val());

    select.on('change', function (event) {
      label.text(select.val());
    });

    select.on('focusin', function (event) {
      selectWrapper.attr('aria-selected', 'true');
    });

    select.on('focusout', function (event) {
      selectWrapper.attr('aria-selected', 'false');
    });
  });
};

new BasisDrawer();

new BasisNavbar();

new BasisPageEffect();

new BasisSelect();

}(jQuery));
