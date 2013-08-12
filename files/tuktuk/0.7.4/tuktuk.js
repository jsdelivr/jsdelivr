/*
TukTuk - Simple (but powerful) RWD Framework
http://tuktuk.tapquo.com
Copyright (c) 2011-2013 Tapquo S.L. - Licensed GPLv3, Commercial

@namespace  Tuktuk
@author     Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
*/


(function() {
  var TukTuk,
    __slice = [].slice;

  window.TukTuk = TukTuk = {};

  TukTuk.VERSION = "0.7";

  TukTuk.dom = function() {
    var args;

    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (typeof $$ !== "undefined" && $$ !== null) {
      return $$.apply(null, args);
    } else {
      return $.apply(null, args);
    }
  };

  TukTuk.ready = TukTuk.dom().ready;

}).call(this);

(function() {
  TukTuk.Box = (function(tk) {
    var box, hide, lock, show;

    lock = void 0;
    box = void 0;
    show = function(box_id) {
      box = tk.dom("[data-tuktuk=boxes] #" + box_id).first();
      box.addClass("active");
      return this;
    };
    hide = function() {
      box.removeClass("active");
      return this;
    };
    return {
      _Instance: (function() {
        tk.dom("[data-tuktuk=boxes] aside.absolute").each(function(index, element) {
          var modal;

          modal = tk.dom(element);
          return modal.html("<div>" + modal.html() + "</div>");
        });
        tk.dom("[data-tuktuk=boxes] [data-box=close]").on("click", function() {
          return TukTuk.Box.hide();
        });
        return tk.dom("[data-tuktuk-box]").on("click", function() {
          return TukTuk.Box.show(tk.dom(this).attr('data-tuktuk-box'));
        });
      })(),
      show: show,
      hide: hide
    };
  })(TukTuk);

}).call(this);

(function() {
  TukTuk.Events = (function(tk) {
    return {
      init: (function() {
        return TukTuk.dom("[data-control=checkbox]").on("change", function(event) {
          var checked, el, input;

          event.preventDefault();
          el = TukTuk.dom(this);
          input = el.find("input");
          checked = input[0].checked;
          input.val(checked.toString());
          el.removeClass("checked");
          if (checked) {
            return el.addClass("checked");
          }
        });
      })()
    };
  })(TukTuk);

}).call(this);

(function() {
  var hidebar;

  hidebar = function() {
    var browser, browserRegex, hideURLbar, isMobile;

    browser = navigator.userAgent;
    browserRegex = /(Android|BlackBerry|IEMobile|Nokia|iP(ad|hone|od)|Opera M(obi|ini))/;
    isMobile = false;
    if (browser.match(browserRegex)) {
      hideURLbar = function() {
        return window.scrollTo(0, 1);
      };
      isMobile = true;
      return addEventListener("load", (function() {
        return setTimeout(hideURLbar, 0);
      }), false);
    }
  };

}).call(this);

(function() {
  var __slice = [].slice;

  if (!window.TukTuk) {
    window.TukTuk = {
      dom: function() {
        var args;

        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (typeof $$ !== "undefined" && $$ !== null) {
          return $$.apply(null, args);
        } else {
          return $.apply(null, args);
        }
      }
    };
  }

  window.TukTuk.Modal = (function(tk) {
    var hide, loading, lock, modal, show;

    lock = void 0;
    modal = void 0;
    /*
        @todo: Describe method
    */

    show = function(modal_id) {
      lock.addClass("active").show();
      this._hideAnyModal();
      modal = tk.dom("[data-tuktuk=modal]#" + modal_id).addClass("active");
      return this;
    };
    /*
        @todo: Describe method
    */

    hide = function() {
      lock.removeClass("active");
      if (modal != null) {
        modal.removeClass("active");
      }
      setTimeout(function() {
        return lock.attr("data-loading", "false").hide();
      }, 250);
      return this;
    };
    /*
        @loading: Describe method
    */

    loading = function(text) {
      this._hideAnyModal();
      lock.attr("data-loading", "true").addClass("active").show();
      return this;
    };
    return {
      _hideAnyModal: function() {
        return tk.dom("[data-tuktuk=modal]").removeClass("active");
      },
      _Instance: (function() {
        tk.dom("[data-tuktuk=modal].side").each(function(index, element) {
          modal = tk.dom(element);
          return modal.html("<div>" + modal.html() + "</div>");
        });
        tk.dom("[data-tuktuk=modal] [data-modal=close]").on("click", function() {
          return TukTuk.Modal.hide();
        });
        tk.dom("[data-tuktuk-modal]").on("click", function() {
          return TukTuk.Modal.show(tk.dom(this).attr('data-tuktuk-modal'));
        });
        tk.dom(document.body).append("<div data-tuktuk=\"lock\" data-loading=\"false\">\n  <div class=\"loading\">\n    <div class=\"container\">\n        <span class=\"top\"></span>\n        <span class=\"right\"></span>\n        <span class=\"bottom\"></span>\n        <span class=\"left\"></span>\n    </div>\n  </div>\n</div>");
        return lock = tk.dom("[data-tuktuk=lock]").first();
      })(),
      show: show,
      hide: hide,
      loading: loading
    };
  })(TukTuk);

}).call(this);
