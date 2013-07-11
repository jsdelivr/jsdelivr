/*!
  jQuery rondell plugin
  @name jquery.rondell.js
  @author Sebastian Helzle (sebastian@helzle.net or @sebobo)
  @version 1.0.3
  @date 04/01/2013
  @category jQuery plugin
  @copyright (c) 2009-2013 Sebastian Helzle (www.sebastianhelzle.net)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function($) {
  /* Global rondell plugin properties
  */

  var $document, $window, Rondell, closeLightbox, delayCall, getActiveRondell, getLightbox, lightboxIsVisible, resizeLightbox, resizeTimer, updateLightbox, _base;
  $.rondell || ($.rondell = {
    version: '1.0.3',
    name: 'rondell',
    lightbox: {
      instance: void 0,
      template: $.trim('\
        <div class="rondell-lightbox">\
          <div class="rondell-lightbox-overlay">&nbsp;</div>\
          <div class="rondell-lightbox-content">\
            <div class="rondell-lightbox-inner"/>\
            <div class="rondell-lightbox-close">&Chi;</div>\
            <div class="rondell-lightbox-prev">&nbsp;</div>\
            <div class="rondell-lightbox-position">1</div>\
            <div class="rondell-lightbox-next">&nbsp;</div>\
          </div>\
        </div>')
    },
    defaults: {
      showContainer: true,
      classes: {
        container: "rondell-container",
        initializing: "rondell-initializing",
        themePrefix: "rondell-theme",
        caption: "rondell-caption",
        noScale: "no-scale",
        item: "rondell-item",
        image: "rondell-item-image",
        resizeable: "rondell-item-resizeable",
        small: "rondell-item-small",
        hidden: "rondell-item-hidden",
        loading: "rondell-item-loading",
        hovered: "rondell-item-hovered",
        overlay: "rondell-item-overlay",
        focused: "rondell-item-focused",
        crop: "rondell-item-crop",
        error: "rondell-item-error",
        control: "rondell-control",
        shiftLeft: "rondell-shift-left",
        shiftRight: "rondell-shift-right"
      },
      currentLayer: 0,
      container: null,
      radius: {
        x: 250,
        y: 50
      },
      center: {
        left: 340,
        top: 160
      },
      size: {
        width: null,
        height: null
      },
      visibleItems: 'auto',
      scaling: 2,
      opacityMin: 0.05,
      fadeTime: 300,
      keyDelay: 300,
      zIndex: 1000,
      itemProperties: {
        delay: 100,
        size: {
          width: 150,
          height: 150
        },
        sizeFocused: {
          width: 0,
          height: 0
        }
      },
      lightbox: {
        enabled: true,
        displayReferencedImages: true
      },
      imageFiletypes: ['png', 'jpg', 'jpeg', 'gif', 'bmp'],
      repeating: true,
      wrapIndices: true,
      switchIndices: false,
      alwaysShowCaption: false,
      captionsEnabled: true,
      autoRotation: {
        enabled: false,
        paused: false,
        direction: 0,
        once: false,
        delay: 5000
      },
      controls: {
        enabled: true,
        fadeTime: 400,
        margin: {
          x: 130,
          y: 270
        }
      },
      strings: {
        prev: 'prev',
        next: 'next',
        loadingError: 'An error occured while loading <b>%s</b>',
        more: 'More...'
      },
      mousewheel: {
        enabled: true,
        threshold: 0,
        minTimeBetweenShifts: 500
      },
      touch: {
        enabled: true,
        preventDefaults: true,
        threshold: 100
      },
      randomStart: false,
      funcEase: 'easeInOutQuad',
      theme: 'default',
      preset: '',
      effect: null,
      onAfterShift: null,
      cropThumbnails: false,
      scrollbar: {
        enabled: false,
        orientation: "bottom",
        start: 1,
        end: 100,
        stepSize: 1,
        keepStepOrder: true,
        position: 1,
        padding: 10,
        style: {
          width: "100%",
          height: 20,
          left: "auto",
          right: "auto",
          top: "auto",
          bottom: "auto"
        },
        repeating: false,
        onScroll: void 0,
        scrollOnHover: false,
        scrollOnDrag: true,
        animationDuration: 300,
        easing: "easeInOutQuad",
        classes: {
          container: "rondell-scrollbar",
          control: "rondell-scrollbar-control",
          dragging: "rondell-scrollbar-dragging",
          background: "rondell-scrollbar-background",
          scrollLeft: "rondell-scrollbar-left",
          scrollRight: "rondell-scrollbar-right",
          scrollInner: "rondell-scrollbar-inner"
        }
      }
    }
  });
  /* Add default easing function for rondell to jQuery if missing
  */

  (_base = $.easing).easeInOutQuad || (_base.easeInOutQuad = function(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b;
    } else {
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
  });
  delayCall = function(delay, callback) {
    return setTimeout(callback, delay);
  };
  $window = $(window);
  $document = $(document);
  Rondell = (function() {

    Rondell.rondellCount = 0;

    Rondell.activeRondell = null;

    function Rondell(items, options, numItems, initCallback) {
      var containerWrap, scrollbarContainer;
      if (initCallback == null) {
        initCallback = void 0;
      }
      this.showLightbox = __bind(this.showLightbox, this);

      this.keyDown = __bind(this.keyDown, this);

      this.isFocused = __bind(this.isFocused, this);

      this.onWindowBlur = __bind(this.onWindowBlur, this);

      this.onWindowFocus = __bind(this.onWindowFocus, this);

      this._autoShift = __bind(this._autoShift, this);

      this._autoShiftInit = __bind(this._autoShiftInit, this);

      this.shiftRight = __bind(this.shiftRight, this);

      this.shiftLeft = __bind(this.shiftLeft, this);

      this._refreshControls = __bind(this._refreshControls, this);

      this.getIndexInRange = __bind(this.getIndexInRange, this);

      this.getRelativeItemPosition = __bind(this.getRelativeItemPosition, this);

      this.shiftTo = __bind(this.shiftTo, this);

      this._hover = __bind(this._hover, this);

      this._onTouch = __bind(this._onTouch, this);

      this._onMousewheel = __bind(this._onMousewheel, this);

      this.bindEvents = __bind(this.bindEvents, this);

      this._start = __bind(this._start, this);

      this.onItemInit = __bind(this.onItemInit, this);

      this._loadItem = __bind(this._loadItem, this);

      this._getItem = __bind(this._getItem, this);

      this._onMouseLeaveItem = __bind(this._onMouseLeaveItem, this);

      this._onMouseEnterItem = __bind(this._onMouseEnterItem, this);

      this.fitToContainer = __bind(this.fitToContainer, this);

      this.id = ++Rondell.rondellCount;
      this.items = [];
      this.maxItems = numItems;
      this.loadedItems = 0;
      this.initCallback = initCallback;
      if (this.id === 1) {
        Rondell.activeRondell = this.id;
      }
      if ((options != null ? options.preset : void 0) in $.rondell.presets) {
        $.extend(true, this, $.rondell.defaults, $.rondell.presets[options.preset], options || {});
      } else {
        $.extend(true, this, $.rondell.defaults, options || {});
      }
      $.extend(true, this, {
        _dimensions: {
          computed: false
        },
        _lastKeyEvent: 0,
        _windowFocused: true,
        _focusedIndex: this.currentLayer,
        _itemIndices: {
          0: 0
        },
        autoRotation: {
          _timer: -1
        },
        controls: {
          _lastShift: 0
        },
        touch: {
          _start: void 0,
          _end: void 0
        },
        scrollbar: {
          _instance: null
        }
      });
      this.itemProperties.sizeFocused = {
        width: this.itemProperties.sizeFocused.width || this.itemProperties.size.width * this.scaling,
        height: this.itemProperties.sizeFocused.height || this.itemProperties.size.height * this.scaling
      };
      this.size = {
        width: this.size.width || this.center.left * 2,
        height: this.size.height || this.center.top * 2
      };
      containerWrap = $("<div/>").css(this.size).addClass("" + this.classes.initializing + " " + this.classes.container + " " + this.classes.themePrefix + "-" + this.theme);
      this.container = items.wrapAll(containerWrap).parent().addClass("rondell-instance-" + this.id).data('api', this);
      if (this.showContainer) {
        this.container.parent().show();
      }
      if (this.scrollbar.enabled) {
        scrollbarContainer = $('<div/>');
        this.container.append(scrollbarContainer);
        $.extend(true, this.scrollbar, {
          onScroll: this.shiftTo,
          end: this.maxItems,
          position: this.currentLayer,
          repeating: this.repeating
        });
        this.scrollbar._instance = new $.rondell.RondellScrollbar(scrollbarContainer, this.scrollbar);
      }
    }

    Rondell.prototype.log = function(msg) {
      return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
    };

    Rondell.prototype.equals = function(objA, objB) {
      var key, value;
      for (key in objA) {
        value = objA[key];
        if (objB[key] !== value) {
          return false;
        }
      }
      for (key in objB) {
        value = objB[key];
        if (objA[key] !== value) {
          return false;
        }
      }
      return true;
    };

    Rondell.prototype.funcLeft = function(l, r, i) {
      return r.center.left - r.itemProperties.size.width / 2.0 + Math.sin(l) * r.radius.x;
    };

    Rondell.prototype.funcTop = function(l, r, i) {
      return r.center.top - r.itemProperties.size.height / 2.0 + Math.cos(l) * r.radius.y;
    };

    Rondell.prototype.funcDiff = function(d, r, i) {
      return Math.pow(Math.abs(d) / r.maxItems, 0.5) * Math.PI;
    };

    Rondell.prototype.funcOpacity = function(l, r, i) {
      if (r.visibleItems > 1) {
        return Math.max(0, 1.0 - Math.pow(l / r.visibleItems, 2));
      } else {
        return 0;
      }
    };

    Rondell.prototype.funcSize = function(l, r, i) {
      return 1;
    };

    Rondell.prototype.fitToContainer = function() {
      var newHeight, newWidth, oldHeight, oldWidth, parentContainer;
      parentContainer = this.container.parent();
      newWidth = parentContainer.innerWidth();
      newHeight = parentContainer.innerHeight();
      if (!this._dimensions.computed) {
        oldWidth = this.size.width;
        oldHeight = this.size.height;
        $.extend(true, this._dimensions, {
          computed: true,
          center: {
            left: this.center.left / oldWidth,
            top: this.center.top / oldHeight
          },
          radius: {
            x: this.radius.x / oldWidth,
            y: this.radius.y / oldHeight
          },
          controls: {
            margin: {
              x: this.controls.margin.x / oldWidth,
              y: this.controls.margin.y / oldHeight
            }
          },
          itemProperties: {
            size: {
              width: this.itemProperties.size.width / oldWidth,
              height: this.itemProperties.size.height / oldHeight
            },
            sizeFocused: {
              width: this.itemProperties.sizeFocused.width / oldWidth,
              height: this.itemProperties.sizeFocused.height / oldHeight
            }
          }
        });
      }
      $.extend(true, this, {
        size: {
          width: newWidth,
          height: newHeight
        },
        center: {
          left: this._dimensions.center.left * newWidth,
          top: this._dimensions.center.top * newHeight
        },
        radius: {
          x: this._dimensions.radius.x * newWidth,
          y: this._dimensions.radius.y * newHeight
        },
        controls: {
          margin: {
            x: this._dimensions.controls.margin.x * newWidth,
            y: this._dimensions.controls.margin.y * newHeight
          }
        },
        itemProperties: {
          size: {
            width: this._dimensions.itemProperties.size.width * newWidth,
            height: this._dimensions.itemProperties.size.height * newHeight
          },
          sizeFocused: {
            width: this._dimensions.itemProperties.sizeFocused.width * newWidth,
            height: this._dimensions.itemProperties.sizeFocused.height * newHeight
          }
        }
      });
      this.container.css(this.size);
      return this.shiftTo(this.currentLayer);
    };

    Rondell.prototype._onMouseEnterItem = function(idx) {
      return this._getItem(idx).onMouseEnter();
    };

    Rondell.prototype._onMouseLeaveItem = function(idx) {
      return this._getItem(idx).onMouseLeave();
    };

    Rondell.prototype._getItem = function(idx) {
      return this.items[idx - 1];
    };

    Rondell.prototype._loadItem = function(idx, obj) {
      var item;
      item = new $.rondell.RondellItem(idx, obj, this);
      this.items[idx - 1] = item;
      this._itemIndices[idx] = idx;
      item.init();
      if (++this.loadedItems === this.maxItems) {
        return this._start();
      }
    };

    Rondell.prototype.onItemInit = function(idx) {
      var item;
      item = this._getItem(idx);
      if (idx === this.currentLayer) {
        item.prepareFadeIn();
      } else {
        item.prepareFadeOut();
      }
      return item.runAnimation(true);
    };

    Rondell.prototype._start = function() {
      var controls, _ref;
      if (this.randomStart) {
        this.currentLayer = Math.round(Math.random() * (this.maxItems - 1));
      } else {
        this.currentLayer = Math.max(0, Math.min(this.currentLayer || Math.round(this.maxItems / 2), this.maxItems));
      }
      if (this.visibleItems === "auto") {
        this.visibleItems = Math.max(2, ~~(this.maxItems / 2));
      }
      controls = this.controls;
      if (controls.enabled) {
        this.controls._shiftLeft = $("<a href=\"#/\"/>").addClass("" + this.classes.control + " " + this.classes.shiftLeft).html(this.strings.prev).click(this.shiftLeft).css({
          left: controls.margin.x,
          top: controls.margin.y,
          zIndex: this.zIndex + this.maxItems + 2
        });
        this.controls._shiftRight = $("<a href=\"#/\"/>").addClass("" + this.classes.control + " " + this.classes.shiftRight).html(this.strings.next).click(this.shiftRight).css({
          right: controls.margin.x,
          top: controls.margin.y,
          zIndex: this.zIndex + this.maxItems + 2
        });
        this.container.append(this.controls._shiftLeft, this.controls._shiftRight);
      }
      this.bindEvents();
      this.container.removeClass(this.classes.initializing);
      if (typeof this.initCallback === "function") {
        this.initCallback(this);
      }
      if ((_ref = this._focusedItem) == null) {
        this._focusedItem = this._getItem(this.currentLayer);
      }
      return this.shiftTo(this.currentLayer);
    };

    Rondell.prototype.bindEvents = function() {
      var rondell;
      $document.keydown(this.keyDown);
      $window.blur(this.onWindowBlur).focus(this.onWindowFocus);
      $document.focusout(this.onWindowBlur).focusin(this.onWindowFocus);
      if (this.mousewheel.enabled && ($.fn.mousewheel != null)) {
        this.container.bind("mousewheel.rondell", this._onMousewheel);
      }
      if (this._onMobile()) {
        if (this.touch.enabled) {
          this.container.bind("touchstart.rondell touchmove.rondell touchend.rondell", this._onTouch);
        }
      } else {
        this.container.bind("mouseenter.rondell mouseleave.rondell", this._hover);
      }
      rondell = this;
      return this.container.delegate("." + this.classes.item, "click.rondell", function(e) {
        var item;
        item = $(this).data("item");
        if (rondell._focusedItem.id === item.id) {
          if (rondell.lightbox.enabled) {
            e.preventDefault();
            return rondell.showLightbox();
          }
        } else {
          e.preventDefault();
          if (!item.hidden && item.object.is(":visible")) {
            return rondell.shiftTo(item.currentSlot);
          }
        }
      }).delegate("." + this.classes.item, "mouseenter.rondell mouseleave.rondell", function(e) {
        var item;
        item = $(this).data("item");
        if (e.type === "mouseenter") {
          return rondell._onMouseEnterItem(item.id);
        } else {
          return rondell._onMouseLeaveItem(item.id);
        }
      });
    };

    Rondell.prototype._onMobile = function() {
      /*
            Mobile device detection.
            Check for touch functionality is currently enough.
      */
      return typeof Modernizr !== "undefined" && Modernizr !== null ? Modernizr.touch : void 0;
    };

    Rondell.prototype._onMousewheel = function(e, d, dx, dy) {
      /*
            Allows rondell traveling with mousewheel.
            Requires mousewheel plugin for jQuery.
      */

      var now, selfYCenter, viewportBottom, viewportTop;
      if (!(this.mousewheel.enabled && this.isFocused())) {
        return;
      }
      now = (new Date()).getTime();
      if (now - this.mousewheel._lastShift < this.mousewheel.minTimeBetweenShifts) {
        return;
      }
      viewportTop = $window.scrollTop();
      viewportBottom = viewportTop + $window.height();
      selfYCenter = this.container.offset().top + this.container.outerHeight() / 2;
      if (selfYCenter > viewportTop && selfYCenter < viewportBottom && Math.abs(dx) > this.mousewheel.threshold) {
        e.preventDefault();
        if (dx < 0) {
          this.shiftLeft();
        } else {
          this.shiftRight();
        }
        return this.mousewheel._lastShift = now;
      }
    };

    Rondell.prototype._onTouch = function(e) {
      var changeX, touch;
      if (!this.touch.enabled) {
        return;
      }
      touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      switch (e.type) {
        case "touchstart":
          this.touch._start = {
            x: touch.pageX,
            y: touch.pageY
          };
          break;
        case "touchmove":
          if (this.touch.preventDefaults) {
            e.preventDefault();
          }
          this.touch._end = {
            x: touch.pageX,
            y: touch.pageY
          };
          break;
        case "touchend":
          if (this.touch._start && this.touch._end) {
            changeX = this.touch._end.x - this.touch._start.x;
            if (Math.abs(changeX) > this.touch.threshold) {
              if (changeX > 0) {
                this.shiftLeft();
              } else if (changeX < 0) {
                this.shiftRight();
              }
            }
            this.touch._start = this.touch._end = void 0;
          }
      }
      return true;
    };

    Rondell.prototype._hover = function(e) {
      /*
            Shows/hides rondell controls.
            Starts/pauses autorotation.
            Updates active rondell id.
      */

      var paused;
      paused = this.autoRotation.paused;
      if (e.type === "mouseenter") {
        Rondell.activeRondell = this.id;
        this.hovering = true;
        if (!paused) {
          this.autoRotation.paused = true;
          this._focusedItem.showCaption();
        }
      } else {
        this.hovering = false;
        if (paused && !this.autoRotation.once) {
          this.autoRotation.paused = false;
          this._autoShiftInit();
        }
        if (!this.alwaysShowCaption) {
          this._focusedItem.hideCaption();
        }
      }
      if (this.controls.enabled) {
        return this._refreshControls();
      }
    };

    Rondell.prototype.shiftTo = function(idx, keepOrder) {
      var distance, item, newItem, newItemIndex, relativeIndex, scrollbarIdx, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      if (keepOrder == null) {
        keepOrder = false;
      }
      if (idx == null) {
        return;
      }
      if (!keepOrder && this.switchIndices && idx !== this.currentLayer && this.getIndexInRange(idx) === this._focusedItem.currentSlot) {
        _ref = this.getRelativeItemPosition(idx, true), distance = _ref[0], relativeIndex = _ref[1];
        if (relativeIndex > this.currentLayer) {
          idx++;
        } else {
          idx--;
        }
      }
      idx = this.getIndexInRange(idx);
      newItemIndex = this._itemIndices[idx];
      newItem = this._getItem(newItemIndex);
      if (this.switchIndices) {
        this._itemIndices[idx] = this._focusedItem.id;
        this._itemIndices[this._focusedItem.currentSlot] = newItemIndex;
        newItem.currentSlot = this._focusedItem.currentSlot;
        this._focusedItem.currentSlot = idx;
      }
      this._focusedItem = newItem;
      this.currentLayer = idx;
      this._focusedItem.prepareFadeIn();
      _ref1 = this.items;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        if (item !== this._focusedItem) {
          item.prepareFadeOut();
        }
      }
      _ref2 = this.items;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        item = _ref2[_j];
        item.runAnimation();
      }
      this._autoShiftInit();
      this._refreshControls();
      if (this.lightbox.enabled && lightboxIsVisible()) {
        this.showLightbox();
      }
      if (this.scrollbar.enabled) {
        scrollbarIdx = idx;
        if (idx === this._focusedItem.currentSlot) {
          scrollbarIdx = this._focusedItem.currentSlot + 1;
        }
        this.scrollbar._instance.setPosition(scrollbarIdx, false);
      }
      return typeof this.onAfterShift === "function" ? this.onAfterShift(idx) : void 0;
    };

    Rondell.prototype.getRelativeItemPosition = function(idx, wrapIndices) {
      var distance, relativeIndex;
      if (wrapIndices == null) {
        wrapIndices = this.wrapIndices;
      }
      distance = Math.abs(idx - this.currentLayer);
      relativeIndex = idx;
      if (distance > this.visibleItems && distance > this.maxItems / 2 && this.repeating && wrapIndices) {
        if (idx > this.currentLayer) {
          relativeIndex -= this.maxItems;
        } else {
          relativeIndex += this.maxItems;
        }
        distance = Math.abs(relativeIndex - this.currentLayer);
      }
      return [distance, relativeIndex];
    };

    Rondell.prototype.getIndexInRange = function(idx) {
      if (this.repeating) {
        if (idx < 1) {
          idx += this.maxItems;
        } else if (idx > this.maxItems) {
          idx -= this.maxItems;
        }
      } else {
        if (idx < 1) {
          idx = 1;
        } else if (idx > this.maxItems) {
          idx = this.maxItems;
        }
      }
      return idx;
    };

    Rondell.prototype._refreshControls = function() {
      if (!this.controls.enabled) {
        return;
      }
      this.controls._shiftLeft.stop().fadeTo(this.controls.fadeTime, (this.currentLayer > 1 || this.repeating) && this.hovering ? 1 : 0);
      return this.controls._shiftRight.stop().fadeTo(this.controls.fadeTime, (this.currentLayer < this.maxItems || this.repeating) && this.hovering ? 1 : 0);
    };

    Rondell.prototype.shiftLeft = function(e) {
      if (e != null) {
        e.preventDefault();
      }
      return this.shiftTo(this.currentLayer - 1);
    };

    Rondell.prototype.shiftRight = function(e) {
      if (e != null) {
        e.preventDefault();
      }
      return this.shiftTo(this.currentLayer + 1);
    };

    Rondell.prototype._autoShiftInit = function() {
      var autoRotation;
      autoRotation = this.autoRotation;
      if (this.isActive() && autoRotation.enabled && autoRotation._timer < 0) {
        return autoRotation._timer = window.setTimeout(this._autoShift, autoRotation.delay);
      }
    };

    Rondell.prototype._autoShift = function() {
      this.autoRotation._timer = -1;
      if (this.isActive() && this.isFocused() && !lightboxIsVisible() && !this.autoRotation.paused) {
        if (this.autoRotation.direction) {
          return this.shiftRight();
        } else {
          return this.shiftLeft();
        }
      } else {
        return this._autoShiftInit();
      }
    };

    Rondell.prototype.onWindowFocus = function() {
      return this._windowFocused = true;
    };

    Rondell.prototype.onWindowBlur = function() {
      return this._windowFocused = false;
    };

    Rondell.prototype.isActive = function() {
      return true;
    };

    Rondell.prototype.isFocused = function() {
      return this._windowFocused && Rondell.activeRondell === this.id;
    };

    Rondell.prototype.keyDown = function(e) {
      var keyCode, now;
      if (!(this.isActive() && this.isFocused())) {
        return;
      }
      now = (new Date()).getTime();
      if (this._lastKeyEvent > now - this.keyDelay) {
        return;
      }
      if (this.autoRotation._timer >= 0) {
        window.clearTimeout(this.autoRotation._timer);
        this.autoRotation._timer = -1;
      }
      this._lastKeyEvent = now;
      keyCode = e.which || e.keyCode;
      switch (keyCode) {
        case 37:
          return this.shiftLeft(e);
        case 39:
          return this.shiftRight(e);
        case 27:
          return closeLightbox();
      }
    };

    Rondell.prototype.showLightbox = function() {
      var lightbox, lightboxContent,
        _this = this;
      lightbox = getLightbox();
      lightboxContent = $('.rondell-lightbox-content', lightbox);
      if (!lightboxIsVisible()) {
        lightbox.add(lightboxContent).css('visibility', 'hidden');
      }
      return lightboxContent.stop().fadeTo(100, 0, function() {
        var attr, content, icon, iconCopy, linkTarget, linkUrl, _i, _len, _ref;
        content = $('.rondell-lightbox-inner', lightboxContent).html(_this._focusedItem.object.html());
        $('.rondell-lightbox-position').text("" + _this.currentLayer + " | " + _this.maxItems);
        $("." + _this.classes.overlay, content).style = '';
        if (_this._focusedItem.isLink) {
          linkUrl = _this._focusedItem.object.attr('href');
          linkTarget = _this._focusedItem.object.attr('target');
          $("." + _this.classes.caption, content).append("<a href='" + linkUrl + "' target='" + linkTarget + "'>" + _this.strings.more + "</a>").attr('style', '');
        }
        icon = $("." + _this.classes.image, content);
        if (icon && _this._focusedItem.referencedImage) {
          _ref = ['style', 'width', 'height'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            attr = _ref[_i];
            icon.removeAttr(attr);
          }
          icon[0].src = _this._focusedItem.referencedImage;
        }
        if (icon && !icon[0].complete) {
          iconCopy = $("<img style=\"display:none\"/>");
          lightboxContent.append(_this.iconCopy);
          return iconCopy.one('load', updateLightbox)[0].src = _this._focusedItem.referencedImage;
        } else {
          return setTimeout(updateLightbox, 0);
        }
      });
    };

    return Rondell;

  })();
  getActiveRondell = function() {
    return $(".rondell-instance-" + Rondell.activeRondell).data('api');
  };
  resizeTimer = 0;
  resizeLightbox = function() {
    clearTimeout(resizeTimer);
    if (lightboxIsVisible()) {
      return resizeTimer = setTimeout(updateLightbox, 200);
    }
  };
  lightboxIsVisible = function() {
    var _ref;
    return (_ref = $.rondell.lightbox.instance) != null ? _ref.is(':visible') : void 0;
  };
  closeLightbox = function() {
    if (lightboxIsVisible()) {
      return getLightbox().stop().fadeOut(150);
    }
  };
  getLightbox = function() {
    var lightbox;
    if (!$.rondell.lightbox.instance) {
      lightbox = $.rondell.lightbox.instance = $($.rondell.lightbox.template).appendTo($('body'));
      $('.rondell-lightbox-overlay, .rondell-lightbox-close', lightbox).bind('click.rondell', closeLightbox);
      $('.rondell-lightbox-prev', lightbox).bind('click.rondell', function() {
        return getActiveRondell().shiftLeft();
      });
      $('.rondell-lightbox-next', lightbox).bind('click.rondell', function() {
        return getActiveRondell().shiftRight();
      });
      $window.bind('resize.rondell', resizeLightbox);
      lightbox.bind("mousewheel.rondell", function(e, d, dx, dy) {
        return getActiveRondell()._onMousewheel(e, d, dx, dy);
      });
    }
    return $.rondell.lightbox.instance;
  };
  updateLightbox = function() {
    var $lightbox, $lightboxContent, focusedItem, image, imageDimension, imageHeight, imageWidth, maxHeight, maxWidth, newHeight, newProps, newWidth, winHeight, winWidth, windowPadding;
    $lightbox = getLightbox();
    $lightboxContent = $('.rondell-lightbox-content', $lightbox);
    winWidth = $window.innerWidth();
    winHeight = $window.innerHeight();
    windowPadding = 20;
    focusedItem = getActiveRondell()._focusedItem;
    $lightbox.css('display', 'block');
    image = $('img:first', $lightboxContent);
    if (image.length) {
      if (!focusedItem.lightboxImageWidth) {
        focusedItem.lightboxImageWidth = image[0].width;
        focusedItem.lightboxImageHeight = image[0].height;
      }
      imageWidth = focusedItem.lightboxImageWidth;
      imageHeight = focusedItem.lightboxImageHeight;
      imageDimension = imageWidth / imageHeight;
      maxWidth = winWidth - windowPadding * 2;
      maxHeight = winHeight - windowPadding * 2;
      if (imageWidth > maxWidth) {
        imageWidth = maxWidth;
        imageHeight = imageWidth / imageDimension;
      }
      if (imageHeight > maxHeight) {
        imageHeight = maxHeight;
        imageWidth = imageHeight * imageDimension;
      }
      image.attr('width', imageWidth).attr('height', imageHeight);
    }
    $lightbox.add($lightboxContent).css('visibility', 'visible');
    newWidth = $lightboxContent.outerWidth();
    newHeight = $lightboxContent.outerHeight();
    newProps = {
      marginLeft: -newWidth / 2,
      top: Math.max((winHeight - newHeight) / 2, 20)
    };
    if ($lightboxContent.css('opacity') < 1) {
      $lightboxContent.css(newProps).fadeTo(200, 1);
    } else {
      newProps.opacity = 1;
      $lightboxContent.animate(newProps, 200);
    }
    return $lightbox.stop().fadeTo(150, 1);
  };
  return $.fn.rondell = function(options, callback) {
    var rondell;
    if (options == null) {
      options = {};
    }
    if (callback == null) {
      callback = void 0;
    }
    rondell = new Rondell(this, options, this.length, callback);
    this.each(function(idx) {
      return rondell._loadItem(idx + 1, $(this));
    });
    return rondell;
  };
})(jQuery);

/*!
  Presets for jQuery rondell plugin

  @author Sebastian Helzle (sebastian@helzle.net or @sebobo)
  @category jQuery plugin
  @copyright (c) 2009-2013 Sebastian Helzle (www.sebastianhelzle.net)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/

(function($) {
  $.rondell || ($.rondell = {});
  return $.rondell.presets = {
    carousel: {
      autoRotation: {
        enabled: true,
        direction: 1,
        once: false,
        delay: 5000
      },
      radius: {
        x: 240,
        y: 50
      },
      center: {
        left: 340,
        top: 160
      },
      controls: {
        margin: {
          x: 130,
          y: 260
        }
      },
      randomStart: true,
      currentLayer: 1,
      funcSize: function(l, r, i) {
        return 1 / Math.abs(l);
      }
    },
    scroller: {
      repeating: false,
      alwaysShowCaption: true,
      visibleItems: 4,
      theme: "dark",
      lightbox: {
        enabled: false
      },
      itemProperties: {
        delay: 0,
        size: {
          width: 100,
          height: 200
        },
        sizeFocused: {
          width: 300,
          height: 200
        }
      },
      center: {
        left: 400,
        top: 100
      },
      size: {
        width: 800,
        height: 200
      },
      controls: {
        margin: {
          x: 210,
          y: 158
        }
      },
      funcTop: function(l, r, i) {
        return 0;
      },
      funcDiff: function(d, r, i) {
        return Math.abs(d) + 1;
      },
      funcLeft: function(l, r, i) {
        return r.center.left + (l - 0.5) * r.itemProperties.size.width;
      },
      funcOpacity: function(l, r, i) {
        return 0.8;
      }
    },
    pages: {
      radius: {
        x: 0,
        y: 0
      },
      lightbox: {
        enabled: false
      },
      scaling: 1,
      theme: "page",
      visibleItems: 1,
      controls: {
        margin: {
          x: 0,
          y: 0
        }
      },
      strings: {
        prev: ' ',
        next: ' '
      },
      center: {
        left: 200,
        top: 200
      },
      itemProperties: {
        size: {
          width: 400,
          height: 400
        }
      },
      funcTop: function(l, r, i) {
        return r.center.top - r.itemProperties.size.height / 2;
      },
      funcLeft: function(l, r, i) {
        return r.center.left + l * r.itemProperties.size.width;
      },
      funcDiff: function(l, r, i) {
        return Math.abs(l) + 0.5;
      }
    },
    cubic: {
      center: {
        left: 300,
        top: 200
      },
      visibleItems: 5,
      itemProperties: {
        size: {
          width: 350,
          height: 350
        },
        sizeFocused: {
          width: 350,
          height: 350
        }
      },
      controls: {
        margin: {
          x: 70,
          y: 330
        }
      },
      funcTop: function(l, r, i) {
        return r.center.top - r.itemProperties.size.height / 2 + Math.pow(l / 2, 3) * r.radius.x;
      },
      funcLeft: function(l, r, i) {
        return r.center.left - r.itemProperties.size.width / 2 + Math.sin(l) * r.radius.x;
      },
      funcSize: function(l, r, i) {
        return Math.pow((Math.PI - Math.abs(l)) / Math.PI, 3);
      }
    },
    gallery: {
      special: {
        itemPadding: 2
      },
      visibleItems: 5,
      theme: "dark",
      cropThumbnails: true,
      center: {
        top: 145,
        left: 250
      },
      size: {
        height: 400,
        width: 500
      },
      controls: {
        margin: {
          x: 10,
          y: 255
        }
      },
      itemProperties: {
        delay: 0,
        sizeFocused: {
          width: 480,
          height: 280
        },
        size: {
          width: 80,
          height: 100
        }
      },
      funcTop: function(l, r, i) {
        return r.size.height - r.itemProperties.size.height - r.special.itemPadding;
      },
      funcDiff: function(d, r, i) {
        return Math.abs(d) - 0.5;
      },
      funcLeft: function(l, r, i) {
        return r.center.left + (l - 0.5) * (r.itemProperties.size.width + r.special.itemPadding);
      },
      funcOpacity: function(l, r, i) {
        return 0.8;
      }
    },
    thumbGallery: {
      special: {
        columns: 3,
        rows: 3,
        groupSize: 9,
        itemPadding: 5,
        thumbsOffset: {
          x: 500,
          y: 0
        }
      },
      visibleItems: 9,
      wrapIndices: false,
      currentLayer: 1,
      switchIndices: true,
      cropThumbnails: true,
      center: {
        top: 215,
        left: 250
      },
      size: {
        height: 430,
        width: 800
      },
      controls: {
        enabled: false,
        margin: {
          x: 10,
          y: 255
        }
      },
      itemProperties: {
        delay: 40,
        sizeFocused: {
          width: 480,
          height: 420
        },
        size: {
          width: 94,
          height: 126
        }
      },
      scrollbar: {
        enabled: true,
        stepSize: 9,
        start: 2,
        style: {
          width: 292,
          right: 3,
          bottom: 5
        }
      },
      funcDiff: function(d, r, i) {
        return Math.abs(d);
      },
      funcOpacity: function(l, r, i) {
        var currentLayerIndex;
        currentLayerIndex = r.currentLayer > r._focusedItem.currentSlot ? r.currentLayer - 1 : r.currentLayer;
        if (i > r._focusedItem.currentSlot) {
          i--;
        }
        if (Math.floor((i - 1) / r.special.groupSize) === Math.floor((currentLayerIndex - 1) / r.special.groupSize)) {
          return 0.8;
        } else {
          return 0;
        }
      },
      funcTop: function(l, r, i) {
        if (i > r._focusedItem.currentSlot) {
          i--;
        }
        return r.special.thumbsOffset.y + r.special.itemPadding + Math.floor(((i - 1) % r.special.groupSize) / r.special.rows) * (r.itemProperties.size.height + r.special.itemPadding);
      },
      funcLeft: function(l, r, i) {
        var column, currentLayerIndex, groupOffset;
        currentLayerIndex = r.currentLayer > r._focusedItem.currentSlot ? r.currentLayer - 1 : r.currentLayer;
        if (i > r._focusedItem.currentSlot) {
          i--;
        }
        column = ((i - 1) % r.special.groupSize) % r.special.columns;
        groupOffset = Math.floor((i - 1) / r.special.groupSize) - Math.floor((currentLayerIndex - 1) / r.special.groupSize);
        return r.special.thumbsOffset.x + r.special.itemPadding + (column + r.special.columns * groupOffset) * (r.itemProperties.size.width + r.special.itemPadding);
      }
    },
    slider: {
      theme: 'slider',
      visibleItems: 1,
      fadeTime: 1000,
      opacityMin: 0.01,
      autoRotation: {
        enabled: true
      },
      center: {
        top: 150,
        left: 300
      },
      size: {
        height: 300,
        width: 600
      },
      controls: {
        margin: {
          x: -1,
          y: 135
        }
      },
      strings: {
        prev: '<span>&nbsp;</span>',
        next: '<span>&nbsp;</span>'
      },
      itemProperties: {
        sizeFocused: {
          width: 600,
          height: 300
        },
        size: {
          width: 600,
          height: 300
        }
      },
      funcTop: function(l, r, i) {
        return 0;
      },
      funcLeft: function(l, r, i) {
        return 0;
      },
      funcOpacity: function(l, r, i) {
        return 0.02;
      }
    }
  };
})(jQuery);

/*!
  Scrollbar for jQuery rondell plugin
  
  @author Sebastian Helzle (sebastian@helzle.net or @sebobo)
  @category jQuery plugin
  @copyright (c) 2009-2012 Sebastian Helzle (www.sebastianhelzle.net)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function($) {
  $.rondell || ($.rondell = {});
  return $.rondell.RondellScrollbar = (function() {

    function RondellScrollbar(container, options) {
      this.scrollRight = __bind(this.scrollRight, this);

      this.scrollLeft = __bind(this.scrollLeft, this);

      this.onScrollbarClick = __bind(this.onScrollbarClick, this);

      this.onDragStart = __bind(this.onDragStart, this);

      this.onDrag = __bind(this.onDrag, this);

      this.setPosition = __bind(this.setPosition, this);

      this.scrollTo = __bind(this.scrollTo, this);

      this.updatePosition = __bind(this.updatePosition, this);

      this._initControls = __bind(this._initControls, this);
      $.extend(true, this, $.rondell.defaults.scrollbar, options);
      this.container = container.addClass(this.classes.container);
      this._drag = {
        _dragging: false,
        _lastDragEvent: 0
      };
      this.container.addClass("" + this.classes.container + "-" + this.orientation).css(this.style);
      this._initControls();
      this._minX = this.padding + this.scrollLeftControl.outerWidth() + this.scrollControl.outerWidth() / 2;
      this._maxX = this.container.innerWidth() - this.padding - this.scrollRightControl.outerWidth() - this.scrollControl.outerWidth() / 2;
      this.setPosition(this.position, false, true);
    }

    RondellScrollbar.prototype._initControls = function() {
      var scrollControlTemplate;
      scrollControlTemplate = "<div><span class=\"" + this.classes.scrollInner + "\">&nbsp;</span></div>";
      this.scrollLeftControl = $(scrollControlTemplate).addClass(this.classes.scrollLeft).click(this.scrollLeft);
      this.scrollRightControl = $(scrollControlTemplate).addClass(this.classes.scrollRight).click(this.scrollRight);
      this.scrollControl = $("<div class=\"" + this.classes.control + "\">&nbsp;</div>").css("left", this.container.innerWidth() / 2).mousedown(this.onDragStart);
      this.scrollBackground = $("<div class=\"" + this.classes.background + "\"/>");
      this.container.append(this.scrollBackground, this.scrollLeftControl, this.scrollRightControl, this.scrollControl);
      return this.container.add(this.scrollBackground).click(this.onScrollbarClick);
    };

    RondellScrollbar.prototype.updatePosition = function(position, fireCallback) {
      if (fireCallback == null) {
        fireCallback = true;
      }
      if (!position || position === this.position || position < this.start || position > this.end) {
        return;
      }
      this.position = position;
      if (fireCallback) {
        return typeof this.onScroll === "function" ? this.onScroll(position, true) : void 0;
      }
    };

    RondellScrollbar.prototype.scrollTo = function(x, animate, fireCallback) {
      var newPosition, scroller, target;
      if (animate == null) {
        animate = true;
      }
      if (fireCallback == null) {
        fireCallback = true;
      }
      if (x < this._minX || x > this._maxX) {
        return;
      }
      scroller = this.scrollControl.stop(true);
      target = {
        left: x
      };
      if (animate) {
        scroller.animate(target, this.animationDuration, this.easing);
      } else {
        scroller.css(target);
      }
      newPosition = Math.round((x - this._minX) / (this._maxX - this._minX) * (this.end - this.start)) + this.start;
      if (newPosition !== this.position) {
        return this.updatePosition(newPosition, fireCallback);
      }
    };

    RondellScrollbar.prototype.setPosition = function(position, fireCallback, force) {
      var newX;
      if (fireCallback == null) {
        fireCallback = true;
      }
      if (force == null) {
        force = false;
      }
      if (this.repeating) {
        if (position < this.start) {
          position = this.end;
        }
        if (position > this.end) {
          position = this.start;
        }
      }
      if (!force && (position < this.start || position > this.end || position === this.position)) {
        return;
      }
      newX = Math.round((position - this.start) / (this.end - this.start) * (this._maxX - this._minX)) + this._minX;
      return this.scrollTo(newX, true, fireCallback);
    };

    RondellScrollbar.prototype.onDrag = function(e) {
      var newX, _ref;
      e.preventDefault();
      if (!this._drag._dragging) {
        return;
      }
      if (e.type === "mouseup") {
        this._drag._dragging = false;
        this.scrollControl.removeClass(this.classes.dragging);
        return $(window).unbind("mousemove mouseup", this.onDrag);
      } else {
        newX = 0;
        if ((_ref = this.orientation) === "top" || _ref === "bottom") {
          newX = e.pageX - this.container.offset().left;
        } else {
          newX = e.pageY - this.container.offset().top;
        }
        newX = Math.max(this._minX, Math.min(this._maxX, newX));
        return this.scrollTo(newX, false);
      }
    };

    RondellScrollbar.prototype.onDragStart = function(e) {
      e.preventDefault();
      this._drag._dragging = true;
      this.scrollControl.addClass(this.classes.dragging);
      return $(window).bind("mousemove mouseup", this.onDrag);
    };

    RondellScrollbar.prototype.onScrollbarClick = function(e) {
      return this.scrollTo(e.pageX - this.container.offset().left);
    };

    RondellScrollbar.prototype.scrollLeft = function(e) {
      var newPosition;
      e.preventDefault();
      newPosition = this.position - this.stepSize;
      if (this.keepStepOrder && this.stepSize > 1) {
        if (newPosition >= this.start) {
          newPosition -= (newPosition - this.start) % this.stepSize;
        } else if (this.repeating) {
          newPosition = this.start + Math.floor((this.end - this.start) / this.stepSize) * this.stepSize;
        }
      }
      return this.setPosition(newPosition);
    };

    RondellScrollbar.prototype.scrollRight = function(e) {
      var newPosition;
      e.preventDefault();
      newPosition = this.position + this.stepSize;
      if (this.keepStepOrder && this.stepSize > 1) {
        newPosition -= (newPosition - this.start) % this.stepSize;
        if (this.repeating && newPosition > this.end) {
          newPosition = this.start;
        }
      }
      return this.setPosition(newPosition);
    };

    return RondellScrollbar;

  })();
})(jQuery);

/*!
  RondellItem for jQuery rondell plugin

  @author Sebastian Helzle (sebastian@helzle.net or @sebobo)
  @category jQuery plugin
  @copyright (c) 2009-2012 Sebastian Helzle (www.sebastianhelzle.net)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function($) {
  $.rondell || ($.rondell = {});
  return $.rondell.RondellItem = (function() {

    function RondellItem(id, object, rondell) {
      this.id = id;
      this.object = object;
      this.rondell = rondell;
      this.runAnimation = __bind(this.runAnimation, this);

      this.onAnimationFinished = __bind(this.onAnimationFinished, this);

      this.prepareFadeOut = __bind(this.prepareFadeOut, this);

      this.prepareFadeIn = __bind(this.prepareFadeIn, this);

      this.hideCaption = __bind(this.hideCaption, this);

      this.showCaption = __bind(this.showCaption, this);

      this.onMouseLeave = __bind(this.onMouseLeave, this);

      this.onMouseEnter = __bind(this.onMouseEnter, this);

      this.finalize = __bind(this.finalize, this);

      this.onError = __bind(this.onError, this);

      this.onIconLoad = __bind(this.onIconLoad, this);

      this.refreshDimensions = __bind(this.refreshDimensions, this);

      this.init = __bind(this.init, this);

      this.currentSlot = this.id;
      this.focused = false;
      this.hidden = false;
      this.animating = false;
      this.isNew = true;
      this.icon = null;
      this.resizeable = true;
      this.iconCopy = null;
      this.croppedSize = this.rondell.itemProperties.size;
      this.sizeSmall = this.rondell.itemProperties.size;
      this.sizeFocused = this.rondell.itemProperties.sizeFocused;
      this.objectCSSTarget = {};
      this.objectAnimationTarget = {};
      this.lastObjectAnimationTarget = {};
      this.iconAnimationTarget = {};
      this.lastIconAnimationTarget = {};
      this.animationSpeed = this.rondell.fadeTime;
      this.isLink = this.object.is('a');
      this.referencedImage = null;
    }

    RondellItem.prototype.init = function() {
      var filetype, icon, linkType, linkUrl, _i, _len, _ref;
      if (this.object.is('img')) {
        this.object = this.object.wrap("<div/>").parent();
      }
      this.object.addClass("" + this.rondell.classes.item).data('item', this).css({
        opacity: 0,
        width: this.sizeSmall.width,
        height: this.sizeSmall.height,
        left: this.rondell.center.left - this.sizeFocused.width / 2,
        top: this.rondell.center.top - this.sizeFocused.height / 2
      });
      if (this.isLink && this.rondell.lightbox.displayReferencedImages) {
        linkUrl = this.object.attr('href');
        linkType = this._getFiletype(linkUrl);
        _ref = this.rondell.imageFiletypes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filetype = _ref[_i];
          if (!(linkType === filetype)) {
            continue;
          }
          this.referencedImage = linkUrl;
          break;
        }
      }
      icon = this.object.find('img:first');
      if (icon.length) {
        this.icon = icon;
        this.resizeable = !icon.hasClass(this.rondell.classes.noScale);
        this.icon.addClass(this.rondell.classes.image);
        this.object.addClass(this.rondell.classes.loading);
        if (icon.width() > 0 || (icon[0].complete && icon[0].width > 0)) {
          return window.setTimeout(this.onIconLoad, 10);
        } else {
          this.iconCopy = $("<img style=\"display:none\"/>");
          $('body').append(this.iconCopy);
          return this.iconCopy.one('load', this.onIconLoad).one('error', this.onError).attr('src', icon.attr('src'));
        }
      } else {
        return this.finalize();
      }
    };

    RondellItem.prototype._getFiletype = function(filename) {
      return filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
    };

    RondellItem.prototype.refreshDimensions = function() {
      var croppedSize, foHeight, foWidth, focusedSize, iconHeight, iconWidth, itemSize, smHeight, smWidth, _ref, _ref1, _ref2, _ref3, _ref4;
      iconWidth = ((_ref = this.iconCopy) != null ? _ref.width() : void 0) || ((_ref1 = this.iconCopy) != null ? _ref1[0].width : void 0) || this.icon[0].width || this.icon.width();
      iconHeight = ((_ref2 = this.iconCopy) != null ? _ref2.height() : void 0) || ((_ref3 = this.iconCopy) != null ? _ref3[0].height : void 0) || this.icon[0].height || this.icon.height();
      foWidth = smWidth = iconWidth;
      foHeight = smHeight = iconHeight;
      itemSize = this.rondell.itemProperties.size;
      focusedSize = this.rondell.itemProperties.sizeFocused;
      croppedSize = itemSize;
      if ((_ref4 = this.iconCopy) != null) {
        _ref4.remove();
      }
      if (!(iconWidth && iconHeight)) {
        return;
      }
      if (this.resizeable) {
        this.icon.addClass(this.rondell.classes.resizeable);
        smHeight *= itemSize.width / smWidth;
        smWidth = itemSize.width;
        if (smHeight > itemSize.height) {
          smWidth *= itemSize.height / smHeight;
          smHeight = itemSize.height;
        }
        if (this.rondell.cropThumbnails) {
          if (!this.icon.parent().hasClass(this.rondell.classes.crop)) {
            this.icon.wrap($("<div>").addClass(this.rondell.classes.crop));
          }
          croppedSize = {
            width: itemSize.width,
            height: itemSize.width / smWidth * smHeight
          };
          if (croppedSize.height < itemSize.height) {
            croppedSize = {
              width: itemSize.height / croppedSize.height * croppedSize.width,
              height: itemSize.height
            };
          }
          smWidth = itemSize.width;
          smHeight = itemSize.height;
        }
        foHeight *= focusedSize.width / foWidth;
        foWidth = focusedSize.width;
        if (foHeight > focusedSize.height) {
          foWidth *= focusedSize.height / foHeight;
          foHeight = focusedSize.height;
        }
      } else {
        smWidth = itemSize.width;
        smHeight = itemSize.height;
        foWidth = focusedSize.width;
        foHeight = focusedSize.height;
      }
      this.croppedSize = croppedSize;
      this.iconWidth = iconWidth;
      this.iconHeight = iconHeight;
      this.sizeSmall = {
        width: Math.round(smWidth),
        height: Math.round(smHeight)
      };
      return this.sizeFocused = {
        width: Math.round(foWidth),
        height: Math.round(foHeight)
      };
    };

    RondellItem.prototype.onIconLoad = function() {
      this.refreshDimensions();
      return this.finalize();
    };

    RondellItem.prototype.onError = function() {
      var errorString, _ref;
      errorString = this.rondell.strings.loadingError.replace("%s", this.icon.attr("src"));
      this.icon.remove();
      if ((_ref = this.iconCopy) != null) {
        _ref.remove();
      }
      return this.object.removeClass(this.rondell.classes.loading).addClass(this.rondell.classes.error).html("<p>" + errorString + "</p>");
    };

    RondellItem.prototype.finalize = function() {
      var caption, captionContent, captionWrap, _ref, _ref1, _ref2, _ref3;
      this.object.removeClass(this.rondell.classes.loading);
      if (this.rondell.captionsEnabled) {
        captionContent = null;
        if (this.rondell.cropThumbnails) {
          captionContent = (_ref = this.icon) != null ? _ref.closest("." + this.rondell.classes.crop).siblings() : void 0;
        } else {
          captionContent = (_ref1 = this.icon) != null ? _ref1.siblings() : void 0;
        }
        if (!((captionContent != null ? captionContent.length : void 0) || this.icon) && this.object.children().length) {
          captionContent = this.object.children();
        }
        if (!(captionContent != null ? captionContent.length : void 0)) {
          caption = this.object.attr("title") || ((_ref2 = this.icon) != null ? _ref2.attr("title") : void 0) || ((_ref3 = this.icon) != null ? _ref3.attr("alt") : void 0);
          if (caption) {
            captionContent = $("<p>" + caption + "</p>");
            this.object.append(captionContent);
          }
        }
        if (captionContent != null ? captionContent.length : void 0) {
          captionWrap = (captionContent.wrapAll("<div/>")).parent().addClass(this.rondell.classes.caption);
          if (this.icon) {
            this.overlay = captionWrap.addClass(this.rondell.classes.overlay);
          }
        }
      }
      return this.rondell.onItemInit(this.id);
    };

    RondellItem.prototype.onMouseEnter = function() {
      if (!this.animating && !this.hidden && this.object.is(":visible")) {
        return this.object.addClass(this.rondell.itemHoveredClass).stop(true).animate({
          opacity: 1
        }, this.rondell.fadeTime, this.rondell.funcEase);
      }
    };

    RondellItem.prototype.onMouseLeave = function() {
      this.object.removeClass(this.rondell.classes.hovered);
      if (!(this.animating || this.hidden)) {
        return this.object.stop(true).animate({
          opacity: this.objectAnimationTarget.opacity
        }, this.rondell.fadeTime, this.rondell.funcEase);
      }
    };

    RondellItem.prototype.showCaption = function() {
      if (this.rondell.captionsEnabled && (this.overlay != null)) {
        return this.overlay.stop(true).css({
          height: "auto",
          overflow: "auto"
        }).fadeTo(300, 1);
      }
    };

    RondellItem.prototype.hideCaption = function() {
      var _ref;
      if (this.rondell.captionsEnabled && ((_ref = this.overlay) != null ? _ref.is(":visible") : void 0)) {
        return this.overlay.stop(true).css({
          height: this.overlay.height(),
          overflow: "hidden"
        }).fadeTo(200, 0);
      }
    };

    RondellItem.prototype.prepareFadeIn = function() {
      var iconMarginLeft, iconMarginTop, itemFocusedHeight, itemFocusedWidth;
      this.focused = true;
      this.hidden = false;
      itemFocusedWidth = this.sizeFocused.width;
      itemFocusedHeight = this.sizeFocused.height;
      this.lastObjectAnimationTarget = this.objectAnimationTarget;
      this.objectAnimationTarget = {
        width: itemFocusedWidth,
        height: itemFocusedHeight,
        left: this.rondell.center.left - itemFocusedWidth / 2,
        top: this.rondell.center.top - itemFocusedHeight / 2,
        opacity: 1
      };
      this.objectCSSTarget = {
        zIndex: this.rondell.zIndex + this.rondell.maxItems,
        display: "block"
      };
      this.animationSpeed = this.rondell.fadeTime;
      if (this.icon) {
        this.lastIconAnimationTarget = this.iconAnimationTarget;
        iconMarginLeft = 0;
        iconMarginTop = 0;
        if (!this.resizeable) {
          iconMarginTop = (this.rondell.itemProperties.sizeFocused.height - this.iconHeight) / 2;
          iconMarginLeft = (this.rondell.itemProperties.sizeFocused.width - this.iconWidth) / 2;
          this.iconAnimationTarget.marginTop = iconMarginTop;
          this.iconAnimationTarget.marginLeft = iconMarginLeft;
        }
        if (this.rondell.cropThumbnails) {
          return this.iconAnimationTarget = {
            marginTop: iconMarginTop,
            marginLeft: iconMarginLeft,
            width: itemFocusedWidth,
            height: itemFocusedHeight
          };
        }
      }
    };

    RondellItem.prototype.prepareFadeOut = function() {
      var idx, itemHeight, itemWidth, layerDiff, layerDist, layerPos, newTarget, newZ, _ref;
      this.focused = false;
      idx = this.currentSlot;
      _ref = this.rondell.getRelativeItemPosition(idx), layerDist = _ref[0], layerPos = _ref[1];
      layerDiff = this.rondell.funcDiff(layerPos - this.rondell.currentLayer, this.rondell, idx);
      if (layerPos < this.rondell.currentLayer) {
        layerDiff *= -1;
      }
      itemWidth = this.sizeSmall.width * this.rondell.funcSize(layerDiff, this.rondell);
      itemHeight = this.sizeSmall.height * this.rondell.funcSize(layerDiff, this.rondell);
      newZ = this.rondell.zIndex - layerDist;
      this.animationSpeed = this.rondell.fadeTime + this.rondell.itemProperties.delay * layerDist;
      newTarget = {
        width: itemWidth,
        height: itemHeight,
        left: this.rondell.funcLeft(layerDiff, this.rondell, idx) + (this.rondell.itemProperties.size.width - itemWidth) / 2,
        top: this.rondell.funcTop(layerDiff, this.rondell, idx) + (this.rondell.itemProperties.size.height - itemHeight) / 2,
        opacity: 0
      };
      this.objectCSSTarget = {
        zIndex: newZ,
        display: "block"
      };
      if (layerDist <= this.rondell.visibleItems) {
        newTarget.opacity = this.rondell.funcOpacity(layerDiff, this.rondell, idx);
        this.hidden = false;
        if (this.icon) {
          this.lastIconAnimationTarget = this.iconAnimationTarget;
          if (this.rondell.cropThumbnails) {
            this.iconAnimationTarget = {
              marginTop: (this.rondell.itemProperties.size.height - this.croppedSize.height) / 2,
              marginLeft: (this.rondell.itemProperties.size.width - this.croppedSize.width) / 2,
              width: this.croppedSize.width,
              height: this.croppedSize.height
            };
          }
          if (!this.resizeable) {
            this.iconAnimationTarget = {
              marginTop: (this.rondell.itemProperties.size.height - this.iconHeight) / 2,
              marginLeft: (this.rondell.itemProperties.size.width - this.iconWidth) / 2
            };
          }
        }
      } else if (this.hidden) {
        $.extend(this.objectCSSTarget, newTarget);
      }
      this.lastObjectAnimationTarget = this.objectAnimationTarget;
      return this.objectAnimationTarget = newTarget;
    };

    RondellItem.prototype.onAnimationFinished = function() {
      this.animating = false;
      if (this.focused) {
        this.object.addClass(this.rondell.classes.focused);
        if (this.rondell.hovering || this.rondell.alwaysShowCaption || this.rondell._onMobile()) {
          return this.showCaption();
        }
      } else {
        if (this.objectAnimationTarget.opacity < this.rondell.opacityMin) {
          this.hidden = true;
          return this.object.css("display", "none");
        } else {
          this.hidden = false;
          return this.object.css("display", "block");
        }
      }
    };

    RondellItem.prototype.runAnimation = function(force) {
      if (force == null) {
        force = false;
      }
      this.object.css(this.objectCSSTarget);
      if (!this.hidden) {
        if ((force || this.iconAnimationTarget) && this.icon && (this.focused || !this.rondell.equals(this.iconAnimationTarget, this.lastIconAnimationTarget))) {
          this.icon.stop(true).animate(this.iconAnimationTarget, this.animationSpeed, this.rondell.funcEase);
        }
        if ((force || (this.objectAnimationTarget != null)) && (this.focused || !this.rondell.equals(this.objectAnimationTarget, this.lastObjectAnimationTarget))) {
          this.animating = true;
          this.object.stop(true).animate(this.objectAnimationTarget, this.animationSpeed, this.rondell.funcEase, this.onAnimationFinished);
          if (!this.focused) {
            this.object.removeClass(this.rondell.classes.focused);
            return this.hideCaption();
          }
        } else {
          return this.onAnimationFinished();
        }
      }
    };

    return RondellItem;

  })();
})(jQuery);
