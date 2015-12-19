/*!
 *  Liquid Slider v2.0.5
 *  http://liquidslider.com
 *  GPL license
 */

// See https://github.com/KevinBatdorf/liquidslider for version updates

/*jslint bitwise: true, browser: true */
/*global $, jQuery */
/*jshint unused:false, curly:false */

// Utility for creating objects in older browsers
if (typeof Object.create !== 'function') {
  Object.create = function(obj) {
    "use strict";
    function F() {}
    F.prototype = obj;
    return new F();
  };
}
(function($, window, document, undefined) {
  "use strict";
  var Slider = {
    //initialize

    makeResponsive: function() {
      var self = this;
      // Adjust widths and add classes to make responsive
      $(self.sliderId + '-wrapper').addClass('ls-responsive').css({
        'max-width': $(self.sliderId + ' .panel:first-child').width(),
        'width': '100%'
      });
      // Update widths
      $(self.sliderId + ' .panel-container').css('width', 100 * self.panelCountTotal + self.pSign);
      $(self.sliderId + ' .panel').css('width', 100 / self.panelCountTotal + self.pSign);

      // Cache the padding for add/removing arrows
      if (self.options.hideArrowsWhenMobile) {
        self.leftWrapperPadding = $(self.sliderId + '-wrapper').css('padding-left');
        self.rightWrapperPadding = (self.$sliderWrap).css('padding-right');
      }
      // Set events and fire on browser resize
      self.responsiveEvents();
      $(window).bind('resize', function() {
        self.responsiveEvents();

        clearTimeout(self.resizingTimeout);
        self.resizingTimeout = setTimeout(function() {
          var height = (self.options.autoHeight) ? self.getHeight() : self.getHeighestPanel(self.nextPanel);
          self.adjustHeight(false, height);
        }, 500);
      });
    },

    responsiveEvents: function() {
      var self = this,
        mobileNavChangeOver = (self.options.hideArrowsThreshold ||
          self.options.mobileUIThreshold ||
          (self.totalNavWidth + 10));
      // Since we are resizing, let's simply test the width
      if ((self.$sliderId).outerWidth() < mobileNavChangeOver) {
        if (self.options.mobileNavigation) {
          (self.navigation).css('display', 'none');
          (self.dropdown).css('display', 'block');
          (self.dropdownSelect).css('display', 'block');
          // Update the navigation
          $(self.sliderId + '-nav-select').val(self.options.mobileNavDefaultText);
        }
        if (self.options.dynamicArrows) {
          if (self.options.hideArrowsWhenMobile) {
            (self.leftArrow).remove().length = 0;
            (self.rightArrow).remove().length = 0;
          } else if (!self.options.dynamicArrowsGraphical) {
            // If using text arrows, let's move them to the top
            (self.leftArrow).css('margin-' + self.options.dynamicTabsPosition, '0');
            (self.rightArrow).css('margin-' + self.options.dynamicTabsPosition, '0');
          }
        }
      } else {
        if (self.options.mobileNavigation) {
          (self.navigation).css('display', 'block');
          (self.dropdown).css('display', 'none');
          (self.dropdownSelect).css('display', 'none');
        }
        if (self.options.dynamicArrows) {
          if (self.options.hideArrowsWhenMobile &&
            (!(self.leftArrow).length || !(self.rightArrow).length)) {
            self.addArrows();
            self.registerArrows();
          }
        } else if (!self.options.dynamicArrowsGraphical) {
          // Reposition the text arrows
          (self.leftArrow).css('margin-' +
            self.options.dynamicTabsPosition, (self.navigation).css('height'));
          (self.rightArrow).css('margin-' +
            self.options.dynamicTabsPosition, (self.navigation).css('height'));
        }
        // While resizing, set the width to 100%
        $(self.sliderId + '-wrapper').css('width', '100%');
      }
      // Update when the select box changes
      if (self.options.mobileNavigation) {
        (self.dropdownSelect).change(function() {
          self.setNextPanel(parseInt($(this).val().split('tab')[1], 10) - 1);
        });
      }
    },

    addNavigation: function(navClass) {
      var self = this,
        dynamicTabsElm = '<' + self.options.navElementTag + ' class="ls-nav"><ul id="' +
          (self.$elem).attr('id') + '-nav-ul"></ul></' + self.options.navElementTag + '>';
      // Add basic frame
      if (self.options.dynamicTabsPosition === 'bottom') {
        (self.$sliderId).after(dynamicTabsElm);
      } else {
        (self.$sliderId).before(dynamicTabsElm);
      }

      // Add responsive navigation
      if (self.options.mobileNavigation) {
        var selectBoxDefault = (self.options.mobileNavDefaultText) ?
          '<option disabled="disabled" selected="selected">' +
          self.options.mobileNavDefaultText + '</option>' :
          null,
          dropDownList = '<div class="ls-select-box"><select id="' +
            (self.$elem).attr('id') + '-nav-select" name="navigation">' +
            selectBoxDefault + '</select></div>';
        // cache elements
        self.navigation = $(self.sliderId + '-nav-ul').before(dropDownList);
        self.dropdown = $(self.sliderId + '-wrapper .ls-select-box');
        self.dropdownSelect = $(self.sliderId + '-nav-select');

        $.each(
          (self.$elem).find(self.options.panelTitleSelector),
          function(n) {
            $((self.$sliderWrap)).find('.ls-select-box select')
              .append('<option value="tab' + (n + 1) + '">' +
              $(this).text() + '</option>');
          }
        );
      }
      // Add standard navigation
      $.each(
        (self.$elem).find(self.options.panelTitleSelector),
        function(n) {
          $((self.$sliderWrap)).find('.ls-nav ul').append('<li class="tab' +
            (n + 1) + '"><a class="' + ( navClass || '') + '" href="#' +
            (n + 1) + '">' + self.getNavInsides(this) + '</a></li>');
          if (!self.options.includeTitle) $(this).remove();
        }
      );
    },

    getNavInsides: function(input) {
      return (this.options.dynamicTabsHtml) ? $(input).html() : $(input).text();
    },

    alignNavigation: function() {
      var self = this,
        arrow = (self.options.dynamicArrowsGraphical) ? '-arrow' : '';
      // Set the alignment, adjusting for margins
      if (self.options.dynamicTabsAlign !== 'center') {
        if (!self.options.responsive) {
          $((self.$sliderWrap)).find('.ls-nav ul').css(
            'margin-' + self.options.dynamicTabsAlign,
            // Finds the width of the arrows and the margin
            $((self.$sliderWrap)).find(
              '.ls-nav-' +
              self.options.dynamicTabsAlign +
              arrow
            ).outerWidth(true) + parseInt((self.$sliderId)
              .css('margin-' + self.options.dynamicTabsAlign), 10)
          );
        }
        $((self.$sliderWrap)).find('.ls-nav ul').css('float', self.options.dynamicTabsAlign);
      }
      self.totalNavWidth = $((self.$sliderWrap)).find('.ls-nav ul').outerWidth(true);
      if (self.options.dynamicTabsAlign === 'center') {
        // Get total width of the navigation tabs and center it
        self.totalNavWidth = 0;
        $((self.$sliderWrap)).find('.ls-nav li a').each(function() {
          self.totalNavWidth += $(this).outerWidth(true);
        });
        $((self.$sliderWrap)).find('.ls-nav ul').css('width', self.totalNavWidth + 1);
      }
    },

    registerNav: function() {
      var self = this;
      (self.$sliderWrap).find('[class^=ls-nav] li').on('click', function() {
        self.setNextPanel(parseInt($(this).attr('class').split('tab')[1], 10) - 1);
        return false;
      });
    },

    addArrows: function(arrowClass) {
      var self = this,
        arrow = (self.options.dynamicArrowsGraphical) ? "-arrow " : ' ';
      (self.$sliderWrap).addClass("arrows");

      if (self.options.dynamicArrowsGraphical) {
        self.options.dynamicArrowLeftText = '';
        self.options.dynamicArrowRightText = '';
      }
      // Build the arrows
      (self.$sliderId).before('<div class="ls-nav-left' + arrow + (arrowClass || '') +
        '"><a href="#">' +
        self.options.dynamicArrowLeftText + '</a></div>');
      (self.$sliderId).after('<div class="ls-nav-right' + arrow + (arrowClass || '') +
        '"><a href="#">' +
        self.options.dynamicArrowRightText + '</a></div>');

      self.leftArrow = $(self.sliderId + '-wrapper [class^=ls-nav-left]')
        .css('visibility', "hidden").addClass('ls-hidden');
      self.rightArrow = $(self.sliderId + '-wrapper [class^=ls-nav-right]')
        .css('visibility', "hidden").addClass('ls-hidden');
      if (!self.options.hoverArrows) self.hideShowArrows(undefined, true, true, false);
    },

    hideShowArrows: function(speed, forceVisibility, showBoth, hideBoth) {
      var self = this,
        fadeOut = (typeof speed !== 'undefined') ? speed : self.options.fadeOutDuration,
        fadeIn = (typeof speed !== 'undefined') ? speed : self.options.fadeInDuration,
        visibility = forceVisibility ? "visible" : "hidden";

      if (!showBoth && (hideBoth || (self.sanatizeNumber(self.nextPanel) === 1))) {
        self.leftArrow.stop().fadeTo(fadeOut, 0, function() {
          $(this).css('visibility', visibility).addClass('ls-hidden');
        });
      } else if (showBoth || self.leftArrow.hasClass('ls-hidden')) {
        self.leftArrow.stop().css('visibility', "visible").fadeTo(fadeIn, 1).removeClass('ls-hidden');
      }
      if (!showBoth && (hideBoth || (self.sanatizeNumber(self.nextPanel) === self.panelCount))) {
        self.rightArrow.stop().fadeTo(fadeOut, 0, function() {
          $(this).css('visibility', visibility).addClass('ls-hidden');
        });
      } else if (showBoth || self.rightArrow.hasClass('ls-hidden')) {
        self.rightArrow.stop().css('visibility', "visible").fadeTo(fadeIn, 1).removeClass('ls-hidden');
      }
    },

    registerArrows: function() {
      var self = this;
      $((self.$sliderWrap).find('[class^=ls-nav-]')).on('click', function() {
        self.setNextPanel($(this).attr('class').split(' ')[0].split('-')[2]);
      });
    },

    registerCrossLinks: function() {
      var self = this;
      // Find cross links
      self.crosslinks = $('[data-liquidslider-ref*=' + (self.sliderId).split('#')[1] + ']');
      (self.crosslinks).on('click', function(e) {
        if (self.options.autoSlide === true)
          self.startAutoSlide(true);
        self.setNextPanel(self.getPanelNumber(($(this).attr('href').split('#')[1]), self.options.panelTitleSelector));
        e.preventDefault();
      });
    },

    registerTouch: function() {
      var self = this;
      $(self.sliderId + ' .panel').swipe(self.options.swipeArgs);
    },

    registerKeyboard: function() {
      var self = this;
      $(document).keydown(function(event) {
        var key = event.keyCode || event.which;
        if (event.target.type !== 'textarea' && event.target.type !== 'textbox') {
          // Off the autoSlider
          if (!self.options.forceAutoSlide)
            $(this).trigger('click');
          if (key === self.options.leftKey)
            self.setNextPanel('right');
          if (key === self.options.rightKey)
            self.setNextPanel('left');
          $.each(self.options.panelKeys, function(index, value) {
            if (key === value) {
              self.setNextPanel(index - 1);
            }
          });
        }
      });
    },

    autoSlide: function() {
      var self = this;
      // Can't set the autoSlide slower than the easing ;-)
      if (self.options.autoSlideInterval < self.options.slideEaseDuration) {
        self.options.autoSlideInterval =
          (self.options.slideEaseDuration > self.options.heightEaseDuration) ?
          self.options.slideEaseDuration : self.options.heightEaseDuration;
      }
      self.autoSlideTimeout = setTimeout(function() {
        // Slide left or right
        self.setNextPanel(self.options.autoSlideDirection);
        self.autoSlide();
      }, self.options.autoSlideInterval);
    },

    stopAutoSlide: function() {
      var self = this;
      self.options.autoSlide = false;
      clearTimeout(self.autoSlideTimeout);
    },

    startAutoSlide: function(reset) {
      var self = this;
      self.options.autoSlide = true;
      if (!reset) self.setNextPanel(self.options.autoSlideDirection);
      self.autoSlide(clearTimeout(self.autoSlideTimeout));
    },

    updateHashTags: function() {
      var self = this,
        filtered = (self.nextPanel === self.panelCount) ? 0 : self.nextPanel;
      window.location.hash = self.getFromPanel(self.options.hashTitleSelector, filtered);
    },

    adjustHeight: function(noAnimation, height, easing, duration) {
      var self = this;
      if (noAnimation || self.useCSS) {
        if (noAnimation) self.configureCSSTransitions('0', '0');
        (self.$sliderId).height(height);
        if (noAnimation) self.configureCSSTransitions();
        return;
      }
      (self.$sliderId).animate({
        'height': height + 'px'
      }, {
        easing: easing || self.options.heightEaseFunction,
        duration: duration || self.options.heightEaseDuration,
        queue: false
      });
    },

    getHeight: function(height) {
      var self = this;
      height = height || self.$panelClass.eq(self.sanatizeNumber(self.nextPanel) - 1).outerHeight(true);
      // If the height in the settings be higher, honor thy
      height = (height < self.options.minHeight) ? self.options.minHeight : height;
      return height;
    },

    addPreloader: function() {
      var self = this;
      $(self.sliderId + '-wrapper').append('<div class="ls-preloader"></div>');
    },

    removePreloader: function() {
      var self = this;
      $(self.sliderId + '-wrapper .ls-preloader').fadeTo('slow', 0, function() {
        $(this).remove();
      });
    },

    init: function(options, elem) {
      var self = this;
      // Cache the element
      self.elem = elem;
      self.$elem = $(elem);

      $('body').removeClass('no-js');

      // Cache the ID and class. This allows for multiple instances with any ID name supplied
      self.sliderId = '#' + (self.$elem).attr('id');
      self.$sliderId = $(self.sliderId);

      // Set the options
      self.options = $.extend({}, $.fn.liquidSlider.options, options);

      // Variable for the % sign if needed (responsive), otherwise px
      self.pSign = (self.options.responsive) ? '%' : 'px';

      if (self.options.responsive) {
        // jQuery or CSS3 ?
        self.determineAnimationType();
      } else {
        // Disable some stuff
        self.options.mobileNavigation = false;
        self.options.hideArrowsWhenMobile = false;
      }

      // If using animate.css, add the class here and disable other options.
      if (self.options.slideEaseFunction === "animate.css") {
        if (!self.useCSS) {
          self.options.slideEaseFunction = "easeInOutExpo";
        } else {
          self.options.continuous = false;
          self.animateCSS = true;
        }
      }
      // Build the tabs and navigation
      self.build();

      // Register events
      self.events();
      // Fix width
      if (!self.options.responsive && self.options.dynamicArrows)
        self.$sliderWrap.width(self.$sliderId.outerWidth(true) +
          self.leftArrow.outerWidth(true) +
          self.rightArrow.outerWidth(true));

      self.loaded = true;

      $(window).bind("load", function() {
        self.options.preload.call(self);
      });
    },

    build: function() {
      var self = this,
        isAbsolute;
      // Wrap the entire slider unless manually there
      if ((self.$sliderId).parent().attr('class') !== 'ls-wrapper') {
        (self.$sliderId).wrap('<div id="' +
          (self.$elem).attr('id') +
          '-wrapper" class="ls-wrapper"></div>');
      }
      // Cache the wrapper
      self.$sliderWrap = $(self.sliderId + '-wrapper');

      if (self.options.preloader) self.addPreloader();

      // Add the .panel class to the individual panels
      $(self.sliderId).children().addClass((self.$elem).attr('id') + '-panel panel');
      self.panelClass = self.sliderId + ' .' + (self.$elem).attr('id') + '-panel:not(.clone)';
      self.$panelClass = $(self.panelClass);

      // Wrap all panels in a div, and wrap inner content in a div (not backwards compatible)
      (self.$panelClass).wrapAll('<div class="panel-container"></div>');
      (self.$panelClass).wrapInner('<div class="panel-wrapper"></div>');
      self.panelContainer = (self.$panelClass).parent();
      self.$panelContainer = self.panelContainer;

      // If using fade transition, add the class here and disable other options.
      if (self.options.slideEaseFunction === "fade") {
        (self.$panelClass).addClass('fade');
        self.options.continuous = false;
        self.fade = true;
      }

      // Build navigation tabs
      if (self.options.dynamicTabs)
        self.addNavigation();
      else
        self.options.mobileNavigation = false;

      // Build navigation arrows or disable features
      if (self.options.dynamicArrows) {
        self.addArrows();
      } else {
        self.options.hoverArrows = false;
        self.options.hideSideArrows = false;
        self.options.hideArrowsWhenMobile = false;
      }
      // Create a container width to allow for a smooth float right. Won't calculate arrows if absolute
      isAbsolute = ((self.$leftArrow) && (self.$leftArrow).css('position') === 'absolute') ? 0 : 1;

      // Set slider width
      self.totalSliderWidth = (self.$sliderId).outerWidth(true) +
        ($(self.$leftArrow).outerWidth(true)) * isAbsolute +
        ($(self.$rightArrow).outerWidth(true)) * isAbsolute;
      $((self.$sliderWrap)).css('width', self.totalSliderWidth);

      // Align navigation tabs
      if (self.options.dynamicTabs) self.alignNavigation();

      if (self.options.hideSideArrows) self.options.continuous = false;

      // Clone panels if continuous is enabled
      if (self.options.continuous) {
        (self.$panelContainer).prepend((self.$panelContainer).children().last().clone().addClass('clone'));
        (self.$panelContainer).append((self.$panelContainer).children().eq(1).clone().addClass('clone'));
      }
      var clonedCount = (self.options.continuous) ? 2 : 0;

      // Count the number of panels and get the combined width
      self.panelCount = $(self.panelClass).length;
      self.panelCountTotal = self.panelCount + clonedCount;
      self.panelWidth = $(self.panelClass).outerWidth();
      self.totalWidth = self.panelCountTotal * self.panelWidth;

      // Apply the width to the panel container
      $(self.sliderId + ' .panel-container').css('width', self.totalWidth);

      //How far should we slide?
      self.slideDistance = (self.options.responsive) ? 100 : $(self.sliderId).outerWidth();
      if (self.useCSS) {
        self.totalWidth = 100 * self.panelCountTotal;
        self.slideDistance = 100 / self.panelCountTotal;
      }
      // Make responsive
      if (self.options.responsive) self.makeResponsive();

      // Apply starting position
      self.prepareTransition(self.getFirstPanel(), true);

      // Update the class
      self.updateClass();
    },

    determineAnimationType: function() {
      var self = this,
        animationstring = 'animation',
        keyframeprefix = '',
        domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
        pfx = '',
        i = 0;
      // Decide whether or not to use CSS transitions or jQuery
      // https://developer.mozilla.org/en-US/docs/CSS/CSS_animations/Detecting_CSS_animation_support
      self.useCSS = false;
      if (self.elem.style.animationName) {
        self.useCSS = true;
      }
      if (self.useCSS === false) {
        for (i = 0; i < domPrefixes.length; i++) {
          if (self.elem.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
            pfx = domPrefixes[i];
            animationstring = pfx + 'Animation';
            keyframeprefix = '-' + pfx.toLowerCase() + '-';
            self.useCSS = true;
            break;
          }
        }
      }
      if (document.documentElement.clientWidth > self.options.useCSSMaxWidth) {
        self.useCSS = false;
      }
    },

    configureCSSTransitions: function(slide, height) {
      var self = this,
        slideTransition,
        heightTransition;
      self.easing = {
        // Penner equations
        easeOutCubic: 'cubic-bezier(.215,.61,.355,1)',
        easeInOutCubic: 'cubic-bezier(.645,.045,.355,1)',
        easeInCirc: 'cubic-bezier(.6,.04,.98,.335)',
        easeOutCirc: 'cubic-bezier(.075,.82,.165,1)',
        easeInOutCirc: 'cubic-bezier(.785,.135,.15,.86)',
        easeInExpo: 'cubic-bezier(.95,.05,.795,.035)',
        easeOutExpo: 'cubic-bezier(.19,1,.22,1)',
        easeInOutExpo: 'cubic-bezier(1,0,0,1)',
        easeInQuad: 'cubic-bezier(.55,.085,.68,.53)',
        easeOutQuad: 'cubic-bezier(.25,.46,.45,.94)',
        easeInOutQuad: 'cubic-bezier(.455,.03,.515,.955)',
        easeInQuart: 'cubic-bezier(.895,.03,.685,.22)',
        easeOutQuart: 'cubic-bezier(.165,.84,.44,1)',
        easeInOutQuart: 'cubic-bezier(.77,0,.175,1)',
        easeInQuint: 'cubic-bezier(.755,.05,.855,.06)',
        easeOutQuint: 'cubic-bezier(.23,1,.32,1)',
        easeInOutQuint: 'cubic-bezier(.86,0,.07,1)',
        easeInSine: 'cubic-bezier(.47,0,.745,.715)',
        easeOutSine: 'cubic-bezier(.39,.575,.565,1)',
        easeInOutSine: 'cubic-bezier(.445,.05,.55,.95)',
        easeInBack: 'cubic-bezier(.6,-.28,.735,.045)',
        easeOutBack: 'cubic-bezier(.175,.885,.32,1.275)',
        easeInOutBack: 'cubic-bezier(.68,-.55,.265,1.55)'
      };
      // Build a CSS class depending on the type of transition
      if (self.useCSS) {
        slideTransition = 'all ' + (slide || self.options.slideEaseDuration) + 'ms ' +
          self.easing[self.options.slideEaseFunction];
        heightTransition = 'all ' + (height || self.options.heightEaseDuration) + 'ms ' +
          self.easing[self.options.heightEaseFunction];
        // Build the width transition rules
        $(self.panelContainer).css({
          '-webkit-transition': slideTransition,
          '-moz-transition': slideTransition,
          '-ms-transition': slideTransition,
          '-o-transition': slideTransition,
          'transition': slideTransition
        });
        // Build the height transition rules
        if (self.options.autoHeight) {
          (self.$sliderId).css({
            '-webkit-transition': heightTransition,
            '-moz-transition': heightTransition,
            '-ms-transition': heightTransition,
            '-o-transition': heightTransition,
            'transition': heightTransition
          });
        }
      }
    },
    
    transitionFade: function() {
      var self = this;
      $(self.panelClass).eq(self.nextPanel)
        .fadeTo(self.options.fadeInDuration, 1.0).css('z-index', 1);
      $(self.panelClass).eq(self.prevPanel)
        .fadeTo(self.options.fadeOutDuration, 0).css('z-index', 0);
      self.callback(self.options.callback, true);
    },

    hover: function() {
      var self = this;

      (self.$sliderWrap).hover(
        function() {
          if (self.options.hoverArrows)
            self.hideShowArrows(self.options.fadeInDuration, true, true, false);

          if (self.options.pauseOnHover)
            clearTimeout(self.autoSlideTimeout);
        },
        function() {
          if (self.options.hoverArrows)
            self.hideShowArrows(self.options.fadeOutnDuration, true, false, true);

          if (self.options.pauseOnHover && self.options.autoSlide)
            self.startAutoSlide();
        }
      );
    },

    events: function() {
      var self = this;

      if (self.options.dynamicArrows) self.registerArrows();
      if (self.options.crossLinks) self.registerCrossLinks();
      if (self.options.dynamicTabs) self.registerNav();
      if (self.options.swipe) self.registerTouch();
      if (self.options.keyboardNavigation) self.registerKeyboard();

      // Click to stop autoSlider
      (self.$sliderWrap).find('*').on('click', function() {
        if (self.options.forceAutoSlide)
          self.startAutoSlide(true);
        else if (self.options.autoSlide)
          self.stopAutoSlide();
      });
      self.hover();
    },

    setNextPanel: function(direction) {
      var self = this;
      if (direction === self.nextPanel)
        return;
      self.prevPanel = self.nextPanel;
      if (self.loaded) {
        if (typeof direction === 'number') {
          self.nextPanel = direction;
        } else {
          // "left" = -1; "right" = 1;
          self.nextPanel += (~~(direction === 'right') || -1);
          // If not continuous, slide back at the last or first panel
          if (!self.options.continuous)
            self.nextPanel = (self.nextPanel < 0) ? self.panelCount - 1 : (self.nextPanel % self.panelCount);
        }
      if (self.fade || self.animateCSS)
        self.prepareTransition(self.nextPanel);
      else
        self.verifyPanel();
      }
    },

    getFirstPanel: function() {
      var self = this,
        output;
      // is there a hash tag?
      if (self.options.hashLinking) {
        output = self.getPanelNumber(window.location.hash, self.options.hashTitleSelector);
        // Default to panel 1 if mistyped
        if (typeof(output) !== 'number') {
          output = 0;
        }
      }
      return (output) ? output : self.options.firstPanelToLoad - 1;
    },

    getPanelNumber: function(input, searchTerm) {
      var self = this,
        title,
        output = input.replace('#', '').toLowerCase();
      // Return the num that matches the panel, or return whats given.
      (self.$panelClass).each(function(i) {
        title = $(this).find(searchTerm).text()
          .toLowerCase().replace(/(^\s+|\s+$)/g, '').replace(/(\s)/g, '-');
        if (title === output) {
          output = i + 1;
        }
      });
      return (parseInt(output, 10) ? parseInt(output, 10) - 1 : output);
    },

    getFromPanel: function(searchTerm, panelNumber) {
      var self = this;
      // Return string that matches selector.
      return self.$panelClass.find(searchTerm).eq(panelNumber)
        .text().replace(/(^\s+|\s+$)/g, '').replace(/(\s)/g, '-', '-')
        .toLowerCase();
    },

    updateClass: function() {
      var self = this;
      if (self.options.dynamicTabs) {
        $((self.$sliderWrap)).find('.tab' + self.sanatizeNumber(self.nextPanel) + ':first a')
          .addClass('current')
          .parent().siblings().children().removeClass('current');
      }
      // Add current class to cross linked Tabs
      if (self.options.crossLinks && self.crosslinks) {
              (self.crosslinks).not(self.nextPanel).removeClass('currentCrossLink');
        (self.crosslinks).each(function() {
          if ($(this).attr('href') === ('#' +
            self.getFromPanel(self.options.panelTitleSelector, self.nextPanel))) {
              $(this).addClass('currentCrossLink');
          }
       });
      }
    },

    sanatizeNumber: function(panel) {
      var self = this;
      // spits out real numbers, 1-based
      if (panel >= self.panelCount) {
        return 1;
      } else if (panel <= -1) {
        return self.panelCount;
      } else {
        return panel + 1;
      }
    },

    finalize: function() {
      var self = this;
      // Adjust the height again
      var height = (self.options.autoHeight) ? self.getHeight() : self.getHeighestPanel(self.nextPanel);
      if (self.options.autoHeight)
        self.adjustHeight(true, height);
      if (self.options.autoSlide) self.autoSlide();
      if (self.options.preloader) self.removePreloader();
      self.onload();
    },

    callback: function(callbackFn, isFade) {
      var self = this;
      if (callbackFn && self.loaded) {
        if (self.useCSS && typeof isFade !== 'undefined') {
          $('.panel-container').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function(e) {
              callbackFn.call(self);
            });
        } else {
          setTimeout(function() {
            callbackFn.call(self);
          }, self.options.slideEaseDuration + 50);
        }
      }
    },

    onload: function() {
      var self = this;
      self.options.onload.call(self);
    },

    prepareTransition: function(nextPanel, noAnimation, noPretransition, noPosttransition) {
      var self = this;
      // Override panel
      self.nextPanel = nextPanel || 0;
      // Option to not update classes, etc
      if (!noPretransition) self.pretransition(self.options.pretransition);
      // stores some variables, then sends to pretransition hook
      self.noAnimation = noAnimation;
      self.noPosttransition = noPosttransition;
      if (!self.loaded)
        self.transition();
      else
        self.options.pretransition.call(self);
    },

    pretransition: function() {
      var self = this,
        marginLeft;
      if (self.options.hashLinking) self.updateHashTags();
      if (self.options.mobileNavigation) self.dropdownSelect.val('tab' + (self.nextPanel + 1));
      if (self.options.hideSideArrows) self.hideShowArrows();
      self.updateClass();
    },

    getTransitionMargin: function() {
      var self = this;
      return -(self.nextPanel * self.slideDistance) -
        (self.slideDistance * ~~(self.options.continuous));
    },

    transition: function() {
      var self = this,
          marginLeft = self.getTransitionMargin();

      if(self.animateCSS && self.loaded) {
        self.transitionOutAnimateCSS();
        return false;
      }

      if ((marginLeft + self.pSign) !== (self.panelContainer).css('margin-left') || (marginLeft !== -100)) {
        if (self.options.autoHeight && !self.animateCSS)
          self.adjustHeight(true, self.getHeight());
        // SLIDE!
        if (self.fade)
          self.transitionFade();
        else if (self.animateCSS)
          self.transitionInAnimateCSS(marginLeft);
        else if (self.useCSS)
          self.transitionCSS(marginLeft, self.noAnimation);
        else
          self.transitionjQuery(marginLeft, self.noAnimation);
      }
      if (!self.noPosttransition) self.callback(self.options.callback);
    },

    transitionOutAnimateCSS: function() {
      var self = this;
      $(self.panelClass).removeClass(self.options.animateIn + ' animated');
      $(self.panelClass).eq(self.prevPanel).addClass('animated ' + self.options.animateOut);
      self.callback(self.transitionInAnimateCSS, undefined);
    },

    transitionInAnimateCSS: function() {
      var self = this;
      if (self.options.autoHeight)
        self.adjustHeight(false, self.getHeight());
      self.transitionCSS(self.getTransitionMargin(), !self.loaded);
      $(self.panelClass).removeClass(self.options.animateOut + ' animated');
      $(self.panelClass).eq(self.nextPanel).addClass('animated ' + self.options.animateIn);
      self.callback(self.options.callback, undefined);
    },

    transitionCSS: function(marginLeft, noAnimation) {
      var self = this;
      if (noAnimation) self.configureCSSTransitions('0', '0');
      (self.panelContainer).css({
        '-webkit-transform': 'translate3d(' + marginLeft + self.pSign + ', 0, 0)',
        '-moz-transform': 'translate3d(' + marginLeft + self.pSign + ', 0, 0)',
        '-ms-transform': 'translate3d(' + marginLeft + self.pSign + ', 0, 0)',
        '-o-transform': 'translate3d(' + marginLeft + self.pSign + ', 0, 0)',
        'transform': 'translate3d(' + marginLeft + self.pSign + ', 0, 0)'
      });
      // Reset transitions
      if (noAnimation)
        self.callback(function() {
          self.configureCSSTransitions();
        });
      else
        self.configureCSSTransitions();
    },

    transitionjQuery: function(marginLeft, noAnimation) {
      var self = this;
      if (noAnimation) {
        (self.panelContainer).css('margin-left', marginLeft + self.pSign);
      } else {
        (self.panelContainer).animate({
          'margin-left': marginLeft + self.pSign
        }, {
          easing: self.options.slideEaseFunction,
          duration: self.options.slideEaseDuration,
          queue: false //,
          //complete: function () {

          //}
        });
      }
    },

    getHeighestPanel: function() {
      var self = this, height, heighest = 0;
      self.$panelClass.each(function() {
        height = $(this).outerHeight(true);
        heighest = (height > heighest) ? height : heighest;
      });
      if (!self.options.autoHeight) return heighest;
    },

    verifyPanel: function() {
      // Basically checks if we need to jump panels
      var self = this,
        clickable = false;

      // Continuous slide required careful clicking
      if (self.options.continuous) {
        // If they click beyond, run it through again.
        if (self.nextPanel > self.panelCount) {
          self.nextPanel = self.panelCount;
          self.setNextPanel(self.panelCount);
        } else if (self.nextPanel < -1) {
          self.nextPanel = -1;
          self.setNextPanel(-1);
        } else if ((!clickable) && ((self.nextPanel === self.panelCount) || (self.nextPanel === -1))) {
          // If on the edge, transport them across
          self.prepareTransition(self.nextPanel);
          self.updateClass();
          clearTimeout(cloneJumper);
          var cloneJumper = setTimeout(function() {
            // But wait first until all is rested
            if (self.nextPanel === self.panelCount) {
              self.prepareTransition(0, true, true, true);
            } else if (self.nextPanel === -1) {
              self.prepareTransition(self.panelCount - 1, true, true, true);
            }
          }, self.options.slideEaseDuration + 50);
        } else {
          clickable = true;
          self.prepareTransition(self.nextPanel);
        }
      } else {
        // Non-continuous just needs to stay in bounds
        if (self.nextPanel === self.panelCount) {
          self.nextPanel = 0;
        } else if (self.nextPanel === -1) {
          self.nextPanel = (self.panelCount - 1);
        }
        self.prepareTransition(self.nextPanel);
      }
    }
  };

  $.fn.liquidSlider = function(options) {
    return this.each(function() {
      var slider = Object.create(Slider);
      slider.init(options, this);
      $.data(this, 'liquidSlider', slider);
    });
  };

  $.fn.liquidSlider.options = {
    autoHeight: true,
    minHeight: 0,
    heightEaseDuration: 1500,
    heightEaseFunction: "easeInOutExpo",

    slideEaseDuration: 1500,
    slideEaseFunction: "easeInOutExpo",
    animateIn: "bounceInRight",
    animateOut: "bounceOutRight",
    continuous: true,
    fadeInDuration: 500,
    fadeOutDuration: 500,

    autoSlide: false,
    autoSlideDirection: 'right',
    autoSlideInterval: 6000,
    forceAutoSlide: false,
    pauseOnHover: false,

    dynamicArrows: true,
    dynamicArrowsGraphical: true,
    dynamicArrowLeftText: "&#171; left",
    dynamicArrowRightText: "right &#187;",
    hideSideArrows: false,
    hideSideArrowsDuration: 750,
    hoverArrows: true,
    hoverArrowDuration: 250,

    dynamicTabs: true,
    dynamicTabsHtml: true,
    includeTitle: true,
    panelTitleSelector: ".title",
    dynamicTabsAlign: "left",
    dynamicTabsPosition: "top",
    navElementTag: "div",

    firstPanelToLoad: 1,
    crossLinks: false,
    hashLinking: false,
    hashTitleSelector: ".title",

    keyboardNavigation: false,
    leftKey: 39,
    rightKey: 37,
    panelKeys: {
      1: 49,
      2: 50,
      3: 51,
      4: 52
    },

    responsive: true,
    mobileNavigation: true,
    mobileNavDefaultText: 'Menu',
    mobileUIThreshold: 0,
    hideArrowsWhenMobile: true,
    hideArrowsThreshold: 0,
    useCSSMaxWidth: 2200,

    preload: function() {
      this.finalize();
    },
    onload: function() {},
    pretransition: function() {
      this.transition();
    },
    callback: function() {},

    preloader: false,
    swipe: true,
    swipeArgs: {
      fallbackToMouseEvents: false,
      allowPageScroll: "vertical",
      swipe: function(e, dir) {
        if (dir === 'up' || dir === 'down')
          return false;
        // Reverse the swipe direction
        this.swipeDir = (dir === 'left') ? 'right' : 'left';
        this.setNextPanel(this.swipeDir);
      }
    }
  };

})(jQuery, window, document);