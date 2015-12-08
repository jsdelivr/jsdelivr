/*
* Pick-a-Color JS v1.1.8
* Copyright 2013 Lauren Sperber and Broadstreet Ads
* https://github.com/lauren/pick-a-color/blob/master/LICENSE
*/
;(function ($) {
    "use strict";

    $.fn.pickAColor = function (options) {

      // capabilities

      var supportsTouch = 'ontouchstart' in window,
          smallScreen = (parseInt($(window).width(),10) < 767) ? true : false,
          supportsLocalStorage = 'localStorage' in window && window.localStorage !== null &&
            typeof JSON === 'object', // don't use LS if JSON is not available
          isIELT10 = document.all && !window.atob, // OH NOES!

          startEvent    = supportsTouch ? "touchstart.pickAColor"  : "mousedown.pickAColor",
          moveEvent     = supportsTouch ? "touchmove.pickAColor"   : "mousemove.pickAColor",
          endEvent      = supportsTouch ? "touchend.pickAColor"    : "mouseup.pickAColor",
          clickEvent    = supportsTouch ? "touchend.pickAColor"    : "click.pickAColor",
          dragEvent     = "dragging.pickAColor",
          endDragEvent  = "endDrag.pickAColor";

      // settings

      var settings = $.extend({
        showSpectrum          : true,
        showSavedColors       : true,
        saveColorsPerElement  : false,
        fadeMenuToggle        : true,
        showAdvanced          : true,
        showBasicColors       : true,
        showHexInput          : true,
        allowBlank            : false,
        basicColors           : {
          white     : 'fff',
          red       : 'f00',
          orange    : 'f60',
          yellow    : 'ff0',
          green     : '008000',
          blue      : '00f',
          purple    : '800080',
          black     : '000'
        }
      }, options);

      // override showBasicColors showAdvanced isn't shown      
      if (!settings.showAdvanced && !settings.showBasicColors) {
        settings.showBasicColors = true;
      }

      var useTabs = (settings.showSavedColors && settings.showAdvanced) ||
        (settings.showBasicColors && settings.showSavedColors) ||
        (settings.showBasicColors && settings.showAdvanced);

      // so much markup

      var markupAfterInput = function () {
        var $markup = $("<div>").addClass("btn-group"),
            $dropdownButton = $("<button type='button'>").addClass("btn color-dropdown dropdown-toggle"),
            $dropdownColorPreview = $("<span>").addClass("color-preview current-color"),
            $dropdownCaret = $("<span>").addClass("caret"),
            $dropdownContainer = $("<div>").addClass("color-menu dropdown-menu");
        if (!settings.showHexInput) {
          $dropdownButton.addClass("no-hex");
          $dropdownContainer.addClass("no-hex");
        }
        $markup.append($dropdownButton.append($dropdownColorPreview).append($dropdownCaret));
        if (!useTabs && !settings.showSpectrum) {
          $dropdownContainer.addClass("small");
        }
        if (useTabs) {
          var $tabContainer = $("<div>").addClass("color-menu-tabs"),
              savedColorsClass = settings.showBasicColors ? "savedColors-tab tab" : "savedColors-tab tab tab-active";
          if (settings.showBasicColors) {
            $tabContainer.append($("<span>").addClass("basicColors-tab tab tab-active").
              append($("<a>").text("Basic Colors"))); 
          }
          if (settings.showSavedColors) {
            $tabContainer.append($("<span>").addClass(savedColorsClass).append($("<a>").text("Saved Colors")));
          }
          if (settings.showAdvanced) {
            $tabContainer.append($("<span>").addClass("advanced-tab tab").
            append($("<a>").text("Advanced")));
          }
          $dropdownContainer.append($tabContainer);
        }

        if (settings.showBasicColors) {
          var $basicColors = $("<div>").addClass("basicColors-content active-content");
          if (settings.showSpectrum) {
            $basicColors.append($("<h6>").addClass("color-menu-instructions").
              text("Tap spectrum or drag band to change color"));
          }
          var $listContainer = $("<ul>").addClass("basic-colors-list");
          $.each(settings.basicColors, function (index,value) {
            var $thisColor = $("<li>").addClass("color-item"),
                $thisLink = $("<a>").addClass(index + " color-link"),
                $colorPreview =  $("<span>").addClass("color-preview " + index),
                $colorLabel = $("<span>").addClass("color-label").text(index);

              $thisLink.append($colorPreview, $colorLabel);
              $colorPreview.append();
              if (value[0] !== '#') {
                value = '#'+value;
              }
              $colorPreview.css('background-color', value);

            if (settings.showSpectrum) {
              var $thisSpectrum = $("<span>").addClass("color-box spectrum-" + index);
              if (isIELT10) {
                $.each([0,1], function (i) {
                  if (value !== "fff" && index !== "000")
                  $thisSpectrum.append($("<span>").addClass(index + "-spectrum-" + i +
                  " ie-spectrum"));
                });
              }
              var $thisHighlightBand = $("<span>").addClass("highlight-band");
              $.each([0,1,2], function () {
                $thisHighlightBand.append($("<span>").addClass("highlight-band-stripe"));
              });
              $thisLink.append($thisSpectrum.append($thisHighlightBand));
            }
            $listContainer.append($thisColor.append($thisLink));
          });
          $dropdownContainer.append($basicColors.append($listContainer));
        }

        if (settings.showSavedColors) {
          var savedColorsActiveClass = settings.showBasicColors ? 'inactive-content' : 'active-content',
            $savedColors = $("<div>").addClass("savedColors-content").addClass(savedColorsActiveClass);
            $savedColors.append($("<p>").addClass("saved-colors-instructions").
            text("Type in a color or use the spectrums to lighten or darken an existing color."));
          $dropdownContainer.append($savedColors);
        }

        if (settings.showAdvanced) {
          var advancedColorsActiveClass = settings.showBasicColors || settings.showSavedColors ? 'inactive-content' : 'active-content';
          var $advanced = $("<div>").addClass("advanced-content").addClass(advancedColorsActiveClass).
                append($("<h6>").addClass("advanced-instructions").text("Tap spectrum or drag band to change color")),
              $advancedList = $("<ul>").addClass("advanced-list"),
              $hueItem = $("<li>").addClass("hue-item"),
              $hueContent = $("<span>").addClass("hue-text").
                text("Hue: ").append($("<span>").addClass("hue-value").text("0"));
          var $hueSpectrum = $("<span>").addClass("color-box spectrum-hue");
          if (isIELT10) {
            $.each([0,1,2,3,4,5,6], function (i) {
              $hueSpectrum.append($("<span>").addClass("hue-spectrum-" + i +
              " ie-spectrum hue"));
            });
          }
          var $hueHighlightBand = $("<span>").addClass("highlight-band");
          $.each([0,1,2], function () {
            $hueHighlightBand.append($("<span>").addClass("highlight-band-stripe"));
          });
          $advancedList.append($hueItem.append($hueContent).append($hueSpectrum.append($hueHighlightBand)));
          var $lightnessItem = $("<li>").addClass("lightness-item"),
              $lightnessSpectrum = $("<span>").addClass("color-box spectrum-lightness"),
              $lightnessContent = $("<span>").addClass("lightness-text").
            text("Lightness: ").append($("<span>").addClass("lightness-value").text("50%"));
          if (isIELT10) {
            $.each([0,1], function (i) {
              $lightnessSpectrum.append($("<span>").addClass("lightness-spectrum-" + i +
              " ie-spectrum"));
            });
          }
          var $lightnessHighlightBand = $("<span>").addClass("highlight-band");
          $.each([0,1,2], function () {
            $lightnessHighlightBand.append($("<span>").addClass("highlight-band-stripe"));
          });
          $advancedList.append($lightnessItem.
            append($lightnessContent).append($lightnessSpectrum.append($lightnessHighlightBand)));
          var $saturationItem = $("<li>").addClass("saturation-item"),
              $saturationSpectrum = $("<span>").addClass("color-box spectrum-saturation");
          if (isIELT10) {
            $.each([0,1], function (i) {
              $saturationSpectrum.append($("<span>").addClass("saturation-spectrum-" + i +
              " ie-spectrum"));
            });
          }
          var $saturationHighlightBand = $("<span>").addClass("highlight-band");
          $.each([0,1,2], function () {
            $saturationHighlightBand.append($("<span>").addClass("highlight-band-stripe"));
          });
          var $saturationContent = $("<span>").addClass("saturation-text").
            text("Saturation: ").append($("<span>").addClass("saturation-value").text("100%"));
          $advancedList.append($saturationItem.append($saturationContent).append($saturationSpectrum.
            append($saturationHighlightBand)));
          var $previewItem = $("<li>").addClass("preview-item").append($("<span>").
              addClass("preview-text").text("Preview")),
            $preview = $("<span>").addClass("color-preview advanced").
              append("<button class='color-select btn btn-mini advanced' type='button'>Select</button>");
          $advancedList.append($previewItem.append($preview));
          $dropdownContainer.append($advanced.append($advancedList));
        }
        $markup.append($dropdownContainer);
        return $markup;
      };

      var myColorVars = {};

      var myStyleVars = {
          rowsInDropdown     : 8,
          maxColsInDropdown  : 2
      };
      
      if (settings.showSavedColors) { // if we're saving colors...
        var allSavedColors = []; // make an array for all saved colors
        if (supportsLocalStorage && localStorage.allSavedColors) { // look for them in LS
          allSavedColors = JSON.parse(localStorage.allSavedColors);
          // if there's a saved_colors cookie...
        } else if (document.cookie.match("pickAColorSavedColors-allSavedColors=")) {
          var theseCookies = document.cookie.split(";"); // split cookies into an array...

          $.each(theseCookies, function (index) { // find the savedColors cookie!
            if (theseCookies[index].match("pickAColorSavedColors-allSavedColors=")) {
              allSavedColors = theseCookies[index].split("=")[1].split(",");
            }

          });
        }
      }


      // methods

      var methods = {

        initialize: function (index) {
          var $thisEl = $(this),
              $thisParent,
              myId,
              defaultColor;
          
          // if there's no name on the input field, create one, then use it as the myID
          if (!$thisEl.attr("name")) {
            $thisEl.attr("name","pick-a-color-" + index);
          }
          myId = $thisEl.attr("name");
          
          // enforce .pick-a-color class on input
          $thisEl.addClass("pick-a-color");
          
          // convert default color to valid hex value
          if (settings.allowBlank) {
            // convert to Hex only if the field init value is not blank
            if (!$thisEl.val().match(/^\s+$|^$/)) {
              myColorVars.defaultColor = tinycolor($thisEl.val()).toHex();
              myColorVars.typedColor = myColorVars.defaultColor;
              $thisEl.val(myColorVars.defaultColor);
            }
          } else {
            myColorVars.defaultColor = tinycolor($thisEl.val()).toHex();
            myColorVars.typedColor = myColorVars.defaultColor;
            $thisEl.val(myColorVars.defaultColor);
          }
          
          // wrap initializing input field with unique div and add hex symbol and post-input markup
          $($thisEl).wrap('<div class="input-prepend input-append pick-a-color-markup" id="' + myId + '">');
          $thisParent = $($thisEl.parent());
          if (settings.showHexInput) {
            $thisParent.prepend('<span class="hex-pound add-on">#</span>').append(markupAfterInput());
          } else {
            $thisParent.append(markupAfterInput());
          }
          
          // hide input for noinput option
          if (!settings.showHexInput) {
            $thisEl.attr("type","hidden");
          }
        },

        updatePreview: function ($thisEl) {
          if (!settings.allowBlank) {
            myColorVars.typedColor = tinycolor($thisEl.val()).toHex();
            $thisEl.siblings(".btn-group").find(".current-color").css("background-color",
              "#" + myColorVars.typedColor);
          } else {
            myColorVars.typedColor = $thisEl.val().match(/^\s+$|^$/) ? '' : tinycolor($thisEl.val()).toHex();
            if (myColorVars.typedColor === '') {
              $thisEl.siblings(".btn-group").find(".current-color").css("background",
                "none");
            } else {
              $thisEl.siblings(".btn-group").find(".current-color").css("background-color",
                "#" + myColorVars.typedColor);
            }
          }
        },

        // must be called with apply and an arguments array like [{thisEvent}]
        pressPreviewButton: function () {
          var thisEvent = arguments[0].thisEvent;
          thisEvent.stopPropagation();
          methods.toggleDropdown(thisEvent.target);
        },

        openDropdown: function (button,menu) {
          $(".color-menu").each(function () { // check all the other color menus...
            var $thisEl = $(this);

            if ($thisEl.css("display") === "block") { // if one is open,
              // find its color preview button
              var thisColorPreviewButton = $thisEl.parents(".btn-group");
              methods.closeDropdown(thisColorPreviewButton,$thisEl); // close it
            }
          });

          if (settings.fadeMenuToggle && !supportsTouch) { //fades look terrible in mobile
            $(menu).fadeIn("fast");
          } else {
            $(menu).show();
          }

          $(button).addClass("open");
        },

        closeDropdown: function (button,menu) {
          if (settings.fadeMenuToggle && !supportsTouch) { //fades look terrible in mobile
            $(menu).fadeOut("fast");
          } else {
            $(menu).css("display","none");
          }

          $(button).removeClass("open");
        },

        // can only be called with apply. requires an arguments array like:
        // [{button, menu}]
        closeDropdownIfOpen: function () {
          var button = arguments[0].button,
              menu = arguments[0].menu;
          if (menu.css("display") === "block") {
            methods.closeDropdown(button,menu);
          }
        },

        toggleDropdown: function (element) {
          var $container = $(element).parents(".pick-a-color-markup"),
              $button = $container.find(".btn-group"),
              $menu = $container.find(".color-menu");
          if ($menu.css("display") === "none") {
            methods.openDropdown($button,$menu);
          } else {
            methods.closeDropdown($button,$menu);
          }
        },

        tabbable: function () {
          var $this_el = $(this),
              $myContainer = $this_el.parents(".pick-a-color-markup");

          $this_el.click(function () {
            var $this_el = $(this),
            // interpret the associated content class from the tab class and get that content div
                contentClass = $this_el.attr("class").split(" ")[0].split("-")[0] + "-content",
                myContent = $this_el.parents(".dropdown-menu").find("." + contentClass);

            if (!$this_el.hasClass("tab-active")) { // make all active tabs inactive
              $myContainer.find(".tab-active").removeClass("tab-active");
              // toggle visibility of active content
              $myContainer.find(".active-content").
                removeClass("active-content").addClass("inactive-content");
              $this_el.addClass("tab-active"); // make current tab and content active
              $(myContent).addClass("active-content").removeClass("inactive-content");
            }
          });
        },

        // takes a color and the current position of the color band,
        // returns the value by which the color should be multiplied to
        // get the color currently being highlighted by the band

        getColorMultiplier: function (spectrumType,position,tab) {
          // position of the color band as a percentage of the width of the color box
          var spectrumWidth = (tab === "basic") ? parseInt($(".color-box").first().width(),10) :
            parseInt($(".advanced-list").find(".color-box").first().width(),10);
          if (spectrumWidth === 0) { // in case the width isn't set correctly
            if (tab === "basic") {
              spectrumWidth = supportsTouch ? 160 : 200;
            } else {
              spectrumWidth = supportsTouch ? 160 : 300;
            }
          }
          var halfSpectrumWidth = spectrumWidth / 2,
              percentOfBox = position / spectrumWidth;

          // for spectrums that lighten and darken, recalculate percent of box relative
          // to the half of spectrum the highlight band is currently in
          if (spectrumType === "bidirectional") {
            return (percentOfBox <= 0.5) ?
              (1 - (position / halfSpectrumWidth)) / 2 :
              -((position - halfSpectrumWidth) / halfSpectrumWidth) / 2;
            // now that we're treating each half as an individual spectrum, both are darkenRight
          } else {
            return (spectrumType === "darkenRight") ? -(percentOfBox / 2) : (percentOfBox / 2);
          }

        },

        // modifyHSLLightness based on ligten/darken in LESS
        // https://github.com/cloudhead/less.js/blob/master/dist/less-1.3.3.js#L1763

        modifyHSLLightness: function (HSL,multiplier) {
          var hsl = HSL;
          hsl.l += multiplier;
          hsl.l = Math.min(Math.max(0,hsl.l),1);
          return tinycolor(hsl).toHslString();
        },

        // defines the area within which an element can be moved
        getMoveableArea: function ($element) {
          var dimensions = {},
              $elParent = $element.parent(),
              myWidth = $element.outerWidth(),
              parentWidth = $elParent.width(), // don't include borders for parent width
              parentLocation = $elParent.offset();
          dimensions.minX = parentLocation.left;
          dimensions.maxX = parentWidth - myWidth; //subtract myWidth to avoid pushing out of parent
          return dimensions;
        },

        moveHighlightBand: function ($highlightBand, moveableArea, e) {
          var hbWidth = $(".highlight-band").first().outerWidth(),
              threeFourthsHBWidth = hbWidth * 0.75,
              mouseX = supportsTouch ? e.originalEvent.pageX : e.pageX, // find the mouse!
              // mouse position relative to width of highlight-band
              newPosition = mouseX - moveableArea.minX - threeFourthsHBWidth;

          // don't move beyond moveable area
          newPosition = Math.max(0,(Math.min(newPosition,moveableArea.maxX)));
          $highlightBand.css("position", "absolute");
          $highlightBand.css("left", newPosition);
        },

        horizontallyDraggable: function () {
          $(this).on(startEvent, function (event) {
            event.preventDefault();
            var $this_el = $(event.delegateTarget);
            $this_el.css("cursor","-webkit-grabbing");
            $this_el.css("cursor","-moz-grabbing");
            var dimensions = methods.getMoveableArea($this_el);

            $(document).on(moveEvent, function (e) {
              $this_el.trigger(dragEvent);
              methods.moveHighlightBand($this_el, dimensions, e);
            }).on(endEvent, function(event) {
              $(document).off(moveEvent); // for desktop
              $(document).off(dragEvent);
              $this_el.css("cursor","-webkit-grab");
              $this_el.css("cursor","-moz-grab");
              $this_el.trigger(endDragEvent);
              $(document).off(endEvent);
            });
          }).on(endEvent, function(event) {
            event.stopPropagation();
            $(document).off(moveEvent); // for mobile
            $(document).off(dragEvent);
          });
        },

        modifyHighlightBand: function ($highlightBand,colorMultiplier,spectrumType) {
          var darkGrayHSL = { h: 0, s:0, l: 0.05 },
              bwMidHSL = { h: 0, s:0, l: 0.5 },
              // change to color of band is opposite of change to color of spectrum
              hbColorMultiplier = -colorMultiplier,
              hbsColorMultiplier = hbColorMultiplier * 10, // needs to be either black or white
              $hbStripes = $highlightBand.find(".highlight-band-stripe"),
              newBandColor = (spectrumType === "lightenRight") ?
                methods.modifyHSLLightness(bwMidHSL,hbColorMultiplier) :
                methods.modifyHSLLightness(darkGrayHSL,hbColorMultiplier);
          $highlightBand.css("border-color", newBandColor);
          $hbStripes.css("background-color", newBandColor);
        },

        // must be called with apply and expects an arguments array like
        // [{type: "basic"}] or [{type: "advanced", hsl: {h,s,l}}]
        calculateHighlightedColor: function () {
          var $thisEl = $(this),
              $thisParent = $thisEl.parent(),
              hbWidth = $(".highlight-band").first().outerWidth(),
              halfHBWidth = hbWidth / 2,
              tab = arguments[0].type,
              spectrumType,
              colorHsl,
              currentHue,
              currentSaturation,
              $advancedPreview,
              $saturationSpectrum,
              $hueSpectrum,
              $lightnessValue;

          if (tab === "basic") {
            // get the class of the parent color box and slice off "spectrum"
            var colorName = $thisParent.attr("class").split("-")[2],
                colorHex = settings.basicColors[colorName];
            colorHsl = tinycolor(colorHex).toHsl();
            switch(colorHex) {
              case "fff":
                spectrumType = "darkenRight";
                break;
              case "000":
                spectrumType = "lightenRight";
                break;
              default:
                spectrumType = "bidirectional";
            }
          } else {
            // re-set current L value to 0.5 because the color multiplier ligtens
            // and darkens against the baseline value
            var $advancedContainer = $thisEl.parents(".advanced-list");
            currentSaturation = arguments[0].hsl.s;
            $hueSpectrum = $advancedContainer.find(".spectrum-hue");
            currentHue = arguments[0].hsl.h;
            $saturationSpectrum = $advancedContainer.find(".spectrum-saturation");
            $lightnessValue = $advancedContainer.find(".lightness-value");
            $advancedPreview = $advancedContainer.find(".color-preview");
            colorHsl = {"h": arguments[0].hsl.h, "l": 0.5, "s": arguments[0].hsl.s};
            spectrumType = "bidirectional";
          }

          // midpoint of the current left position of the color band
          var highlightBandLocation = parseInt($thisEl.css("left"),10) + halfHBWidth,
              colorMultiplier = methods.getColorMultiplier(spectrumType,highlightBandLocation,tab),
              highlightedColor = methods.modifyHSLLightness(colorHsl,colorMultiplier),
              highlightedHex = "#" + tinycolor(highlightedColor).toHex(),
              highlightedLightnessString = highlightedColor.split("(")[1].split(")")[0].split(",")[2],
              highlightedLightness = (parseInt(highlightedLightnessString.split("%")[0], 10)) / 100;

          if (tab === "basic") {
            $thisParent.siblings(".color-preview").css("background-color",highlightedHex);
            // replace the color label with a 'select' button
            $thisParent.prev('.color-label').replaceWith(
              '<button class="color-select btn btn-mini" type="button">Select</button>');
            if (spectrumType !== "darkenRight") {
              methods.modifyHighlightBand($thisEl,colorMultiplier,spectrumType);
            }
          } else {
            $advancedPreview.css("background-color",highlightedHex);
            $lightnessValue.text(highlightedLightnessString);
            methods.updateSaturationStyles($saturationSpectrum,currentHue,highlightedLightness);
            methods.updateHueStyles($hueSpectrum,currentSaturation,highlightedLightness);
            methods.modifyHighlightBand($(".advanced-content .highlight-band"),colorMultiplier,spectrumType);
          }

          return (tab === "basic") ? tinycolor(highlightedColor).toHex() : highlightedLightness;
        },

        updateSavedColorPreview: function (elements) {
          $.each(elements, function (index) {
            var $this_el = $(elements[index]),
                thisColor = $this_el.attr("class");
            $this_el.find(".color-preview").css("background-color",thisColor);
          });
        },

        updateSavedColorMarkup: function ($savedColorsContent,mySavedColors) {
          mySavedColors = mySavedColors ? mySavedColors : allSavedColors;
          if (settings.showSavedColors && mySavedColors.length > 0) {

            if (!settings.saveColorsPerElement) {
              $savedColorsContent = $(".savedColors-content");
              mySavedColors = allSavedColors;
            }

            var maxSavedColors = myStyleVars.rowsInDropdown * myStyleVars.maxColsInDropdown;
            mySavedColors = mySavedColors.slice(0,maxSavedColors);

            var $col0 = $("<ul>").addClass("saved-color-col 0"),
                $col1 = $("<ul>").addClass("saved-color-col 1");

            $.each(mySavedColors, function (index,value) {
              var $this_li = $("<li>").addClass("color-item"),
                  $this_link = $("<a>").addClass(value);
              $this_link.append($("<span>").addClass("color-preview"));
              $this_link.append($("<span>").addClass("color-label").text(value));
              $this_li.append($this_link);
              if (index % 2 === 0) {
                $col0.append($this_li);
              } else {
                $col1.append($this_li);
              }
            });

            $savedColorsContent.html($col0);
            $savedColorsContent.append($col1);

            var savedColorLinks = $($savedColorsContent).find("a");
            methods.updateSavedColorPreview(savedColorLinks);

          }
        },

        setSavedColorsCookie: function (savedColors,savedColorsDataAttr) {
          var now = new Date(),
              tenYearsInMilliseconds = 315360000000,
              expiresOn = new Date(now.getTime() + tenYearsInMilliseconds);
          expiresOn = expiresOn.toGMTString();

          if (typeof savedColorsDataAttr === "undefined") {
            document.cookie = "pickAColorSavedColors-allSavedColors=" + savedColors +
              ";expires=" + expiresOn;
          } else {
            document.cookie = "pickAColorSavedColors-" + savedColorsDataAttr + "=" +
              savedColors + "; expires=" + expiresOn;
          }
        },

        saveColorsToLocalStorage: function (savedColors,savedColorsDataAttr) {
          if (supportsLocalStorage) {
            // if there is no data attribute, save to allSavedColors
            if (typeof savedColorsDataAttr === "undefined") {
              try {
                localStorage.allSavedColors = JSON.stringify(savedColors);
              }
              catch(e) {
                localStorage.clear();
              }
            } else { // otherwise save to a data attr-specific item
              try {
                localStorage["pickAColorSavedColors-" + savedColorsDataAttr] =
                  JSON.stringify(savedColors);
              }
              catch(e) {
                localStorage.clear();
              }
            }
          } else {
            methods.setSavedColorsCookie(savedColors,savedColorsDataAttr);
          }
        },

        removeFromArray: function (array, item) {
          if ($.inArray(item,array) !== -1) { // make sure it's in there
            array.splice($.inArray(item,array),1);
          }
        },

        updateSavedColors: function (color,savedColors,savedColorsDataAttr) {
          methods.removeFromArray(savedColors,color);
          savedColors.unshift(color);
          methods.saveColorsToLocalStorage(savedColors,savedColorsDataAttr);
        },

        // when settings.saveColorsPerElement, colors are saved to both mySavedColors and
        // allSavedColors so they will be avail to color pickers with no savedColorsDataAttr
        addToSavedColors: function (color,mySavedColorsInfo,$mySavedColorsContent) {
          if (settings.showSavedColors && color !== undefined) { // make sure we're saving colors
            if (color[0] != "#") {
              color = "#" + color;
            }
            methods.updateSavedColors(color,allSavedColors);
            if (settings.saveColorsPerElement) { // if we're saving colors per element...
              var mySavedColors = mySavedColorsInfo.colors,
                  dataAttr = mySavedColorsInfo.dataAttr;
              methods.updateSavedColors(color,mySavedColors,dataAttr);
              methods.updateSavedColorMarkup($mySavedColorsContent,mySavedColors);
            } else { // if not saving per element, update markup with allSavedColors
              methods.updateSavedColorMarkup($mySavedColorsContent,allSavedColors);
            }
          }
        },

        // handles selecting a color from the basic menu of colors.
        // must be called with apply and relies on an arguments array like:
        // [{els, savedColorsInfo}]
        selectFromBasicColors: function () {
          var selectedColor = $(this).find("span:first").css("background-color"),
              myElements = arguments[0].els,
              mySavedColorsInfo = arguments[0].savedColorsInfo;
          selectedColor = tinycolor(selectedColor).toHex();
          $(myElements.thisEl).val(selectedColor);
          $(myElements.thisEl).trigger("change");
          methods.updatePreview(myElements.thisEl);
          methods.addToSavedColors(selectedColor,mySavedColorsInfo,myElements.savedColorsContent);
          methods.closeDropdown(myElements.colorPreviewButton,myElements.colorMenu); // close the dropdown
        },

        // handles user clicking or tapping on spectrum to select a color.
        // must be called with apply and relies on an arguments array like:
        // [{thisEvent, savedColorsInfo, els, mostRecentClick}]
        tapSpectrum: function () {
          var thisEvent = arguments[0].thisEvent,
              mySavedColorsInfo = arguments[0].savedColorsInfo,
              myElements = arguments[0].els,
              mostRecentClick = arguments[0].mostRecentClick;
          thisEvent.stopPropagation(); // stop this click from closing the dropdown
          var $highlightBand = $(this).find(".highlight-band"),
              dimensions = methods.getMoveableArea($highlightBand);
          if (supportsTouch) {
            methods.moveHighlightBand($highlightBand, dimensions, mostRecentClick);
          } else {
            methods.moveHighlightBand($highlightBand, dimensions, thisEvent);
          }
          var highlightedColor = methods.calculateHighlightedColor.apply($highlightBand, [{type: "basic"}]);
          methods.addToSavedColors(highlightedColor,mySavedColorsInfo,myElements.savedColorsContent);
          // update touch instructions
          myElements.touchInstructions.html("Press 'select' to choose this color");
        },

        // bind to mousedown/touchstart, execute provied function if the top of the
        // window has not moved when there is a mouseup/touchend
        // must be called with apply and an arguments array like:
        // [{thisFunction, theseArguments}]
        executeUnlessScrolled: function () {
          var thisFunction = arguments[0].thisFunction,
              theseArguments = arguments[0].theseArguments,
              windowTopPosition,
              mostRecentClick;
          $(this).on(startEvent, function (e) {
            windowTopPosition = $(window).scrollTop(); // save to see if user is scrolling in mobile
            mostRecentClick = e;
          }).on(clickEvent, function (event) {
            var distance = windowTopPosition - $(window).scrollTop();
            if (supportsTouch && (Math.abs(distance) > 0)) {
              return false;
            } else {
              theseArguments.thisEvent = event; //add the click event to the arguments object
              theseArguments.mostRecentClick = mostRecentClick; //add start event to the arguments object
              thisFunction.apply($(this), [theseArguments]);
            }
          });
        },

        updateSaturationStyles: function (spectrum, hue, lightness) {
          var lightnessString = (lightness * 100).toString() + "%",
              start = "#" + tinycolor("hsl(" + hue + ",0%," + lightnessString).toHex(),
              mid = "#" + tinycolor("hsl(" + hue + ",50%," + lightnessString).toHex(),
              end = "#" + tinycolor("hsl(" + hue + ",100%," + lightnessString).toHex(),
              fullSpectrumString = "",
              standard = $.each(["-webkit-linear-gradient","-o-linear-gradient"], function(index,value) {
                fullSpectrumString += "background-image: " + value + "(left, " + start + " 0%, " + mid + " 50%, " + end + " 100%);";
              }),
              ieSpectrum0 = "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + start + "', endColorstr='" +
              mid + "', GradientType=1)",
              ieSpectrum1 = "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + mid + "', endColorstr='" +
              end + "', GradientType=1)";
            fullSpectrumString =
              "background-image: -moz-linear-gradient(left center, " + start + " 0%, " + mid + " 50%, " + end + " 100%);" +
              "background-image: linear-gradient(to right, " + start + " 0%, " + mid + " 50%, " + end + " 100%); " +
              "background-image: -webkit-gradient(linear, left top, right top," +
                "color-stop(0, " + start + ")," + "color-stop(0.5, " + mid + ")," + "color-stop(1, " + end + "));" +
              fullSpectrumString;
          if (isIELT10) {
            var $spectrum0 = $(spectrum).find(".saturation-spectrum-0");
            var $spectrum1 = $(spectrum).find(".saturation-spectrum-1");
            $spectrum0.css("filter",ieSpectrum0);
            $spectrum1.css("filter",ieSpectrum1);
          } else {
            spectrum.attr("style",fullSpectrumString);
          }
        },

        updateLightnessStyles: function (spectrum, hue, saturation) {
          var saturationString = (saturation * 100).toString() + "%",
              start = "#" + tinycolor("hsl(" + hue + "," + saturationString + ",100%)").toHex(),
              mid = "#" + tinycolor("hsl(" + hue + "," + saturationString + ",50%)").toHex(),
              end = "#" + tinycolor("hsl(" + hue + "," + saturationString + ",0%)").toHex(),
              fullSpectrumString = "",
              standard = $.each(["-webkit-linear-gradient","-o-linear-gradient"], function(index, value) {
                fullSpectrumString += "background-image: " + value + "(left, " + start + " 0%, " + mid + " 50%, "
                + end + " 100%);";
              }),
              ieSpectrum0 = "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + start + "', endColorstr='" +
              mid + "', GradientType=1)",
              ieSpectrum1 = "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + mid + "', endColorstr='" +
              end + "', GradientType=1)";
          fullSpectrumString =
            "background-image: -moz-linear-gradient(left center, " + start + " 0%, " + mid + " 50%, " + end + " 100%); " +
            "background-image: linear-gradient(to right, " + start + " 0%, " + mid + " 50%, " + end + " 100%); " +
            "background-image: -webkit-gradient(linear, left top, right top," +
            " color-stop(0, " + start + ")," + " color-stop(0.5, " + mid + ")," + " color-stop(1, " + end + ")); " +
            fullSpectrumString;
          if (isIELT10) {
            var $spectrum0 = $(spectrum).find(".lightness-spectrum-0");
            var $spectrum1 = $(spectrum).find(".lightness-spectrum-1");
            $spectrum0.css("filter",ieSpectrum0);
            $spectrum1.css("filter",ieSpectrum1);
          } else {
            spectrum.attr("style",fullSpectrumString);
          }
        },

        updateHueStyles: function (spectrum, saturation, lightness) {
          var saturationString = (saturation * 100).toString() + "%",
              lightnessString = (lightness * 100).toString() + "%",
              color1 = "#" + tinycolor("hsl(0," + saturationString + "," + lightnessString + ")").toHex(),
              color2 = "#" + tinycolor("hsl(60," + saturationString + "," + lightnessString + ")").toHex(),
              color3 = "#" + tinycolor("hsl(120," + saturationString + "," + lightnessString + ")").toHex(),
              color4 = "#" + tinycolor("hsl(180," + saturationString + "," + lightnessString + ")").toHex(),
              color5 = "#" + tinycolor("hsl(240," + saturationString + "," + lightnessString + ")").toHex(),
              color6 = "#" + tinycolor("hsl(300," + saturationString + "," + lightnessString + ")").toHex(),
              color7 = "#" + tinycolor("hsl(0," + saturationString + "," + lightnessString + ")").toHex(),
              ieSpectrum0 = "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + color1 + "', endColorstr='" +
              color2 + "', GradientType=1)",
              ieSpectrum1 = "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + color2 + "', endColorstr='" +
              color3 + "', GradientType=1)",
              ieSpectrum2 = "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + color3 + "', endColorstr='" +
              color4 + "', GradientType=1)",
              ieSpectrum3 = "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + color4 + "', endColorstr='" +
              color5 + "', GradientType=1)",
              ieSpectrum4 = "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + color5 + "', endColorstr='" +
              color6 + "', GradientType=1)",
              ieSpectrum5 = "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + color6 + "', endColorstr='" +
              color7 + "', GradientType=1)",
              fullSpectrumString = "",
              standard = $.each(["-webkit-linear-gradient","-o-linear-gradient"], function(index,value) {
                fullSpectrumString += "background-image: " + value + "(left, " + color1 + " 0%, " + color2 + " 17%, " +
                  color3 + " 24%, " + color4 + " 51%, " + color5 + " 68%, " + color6 + " 85%, " + color7 + " 100%);";
            });
          fullSpectrumString += "background-image: -webkit-gradient(linear, left top, right top," +
            "color-stop(0%, " + color1 + ")," + "color-stop(17%, " + color2 + ")," + "color-stop(34%, " + color3 + ")," +
            "color-stop(51%, " + color4 + ")," + "color-stop(68%, " + color5 + ")," + "color-stop(85%, " + color6 + ")," +
            "color-stop(100%, " + color7 + "));" + 
            "background-image: linear-gradient(to right, " + color1 + " 0%, " + color2 + " 17%, " + color3 + " 24%," + 
            color4 + " 51%," + color5 + " 68%," + color6 + " 85%," + color7 + " 100%); " +
            "background-image: -moz-linear-gradient(left center, " +
            color1 + " 0%, " + color2 + " 17%, " + color3 + " 24%, " + color4 + " 51%, " + color5 + " 68%, " +
            color6 + " 85%, " + color7 + " 100%);";
          if (isIELT10) {
            var $spectrum0 = $(spectrum).find(".hue-spectrum-0"),
                $spectrum1 = $(spectrum).find(".hue-spectrum-1"),
                $spectrum2 = $(spectrum).find(".hue-spectrum-2"),
                $spectrum3 = $(spectrum).find(".hue-spectrum-3"),
                $spectrum4 = $(spectrum).find(".hue-spectrum-4"),
                $spectrum5 = $(spectrum).find(".hue-spectrum-5");
            $spectrum0.css("filter",ieSpectrum0);
            $spectrum1.css("filter",ieSpectrum1);
            $spectrum2.css("filter",ieSpectrum2);
            $spectrum3.css("filter",ieSpectrum3);
            $spectrum4.css("filter",ieSpectrum4);
            $spectrum5.css("filter",ieSpectrum5);
          } else {
            spectrum.attr("style",fullSpectrumString);
            
          }
        },

        // takes the position of a highlight band on the hue spectrum and finds highlighted hue
        // and updates the background of the lightness and saturation spectrums
        // relies on apply and an arguments array like [{h, s, l}]

        getHighlightedHue: function () {
          var $thisEl = $(this),
              hbWidth = $thisEl.outerWidth(),
              halfHBWidth = hbWidth / 2,
              position = parseInt($thisEl.css("left"),10) + halfHBWidth,
              $advancedContainer = $thisEl.parents(".advanced-list"),
              $advancedPreview = $advancedContainer.find(".color-preview"),
              $lightnessSpectrum = $advancedContainer.find(".spectrum-lightness"),
              $saturationSpectrum = $advancedContainer.find(".spectrum-saturation"),
              spectrumWidth = parseInt($advancedContainer.find(".color-box").first().width(),10),
              $hueValue = $advancedContainer.find(".hue-value"),
              currentLightness = arguments[0].l,
              currentSaturation = arguments[0].s,
              saturationString = (currentSaturation * 100).toString() + "%",
              lightnessString = (currentLightness * 100).toString() + "%";

          if (spectrumWidth === 0) { // in case the width isn't set correctly
            spectrumWidth = supportsTouch ? 160 : 300;
          }

          var hue = Math.floor((position/spectrumWidth) * 360),
              color = "hsl(" + hue + "," + saturationString + "," + lightnessString + ")";
          color = "#" + tinycolor(color).toHex();

          $advancedPreview.css("background-color",color);
          $hueValue.text(hue);
          methods.updateLightnessStyles($lightnessSpectrum,hue,currentSaturation);
          methods.updateSaturationStyles($saturationSpectrum,hue,currentLightness);
          return hue;
        },

        // relies on apply and an arguments array like [{h, s, l}]

        getHighlightedSaturation: function () {
          var $thisEl = $(this),
              hbWidth = $thisEl.outerWidth(),
              halfHBWidth = hbWidth / 2,
              position = parseInt($thisEl.css("left"),10) + halfHBWidth,
              $advancedContainer = $thisEl.parents(".advanced-list"),
              $advancedPreview = $advancedContainer.find(".color-preview"),
              $lightnessSpectrum = $advancedContainer.find(".spectrum-lightness"),
              $hueSpectrum = $advancedContainer.find(".spectrum-hue"),
              $saturationValue = $advancedContainer.find(".saturation-value"),
              spectrumWidth = parseInt($advancedContainer.find(".color-box").first().width(),10),
              currentLightness = arguments[0].l,
              lightnessString = (currentLightness * 100).toString() + "%",
              currentHue = arguments[0].h;

          if (spectrumWidth === 0) { // in case the width isn't set correctly
            spectrumWidth = supportsTouch ? 160 : 300;
          }

          var saturation = position/spectrumWidth,
              saturationString = Math.round((saturation * 100)).toString() + "%",
              color = "hsl(" + currentHue + "," + saturationString + "," + lightnessString + ")";
          color = "#" + tinycolor(color).toHex();

          $advancedPreview.css("background-color",color);
          $saturationValue.text(saturationString);
          methods.updateLightnessStyles($lightnessSpectrum,currentHue,saturation);
          methods.updateHueStyles($hueSpectrum,saturation,currentLightness);
          return saturation;
        },

        updateAdvancedInstructions: function (instructionsEl) {
          instructionsEl.html("Press the color preview to choose this color");
        }

      };

      return this.each(function (index) {

        methods.initialize.apply(this,[index]);
        
        // commonly used DOM elements for each color picker
        var myElements = {
          thisEl: $(this),
          thisWrapper: $(this).parent(),
          colorTextInput: $(this).find("input"),
          colorMenuLinks: $(this).parent().find(".color-menu li a"),
          colorPreviewButton: $(this).parent().find(".btn-group"),
          colorMenu: $(this).parent().find(".color-menu"),
          colorSpectrums: $(this).parent().find(".color-box"),
          basicSpectrums: $(this).parent().find(".basicColors-content .color-box"),
          touchInstructions: $(this).parent().find(".color-menu-instructions"),
          advancedInstructions: $(this).parent().find(".advanced-instructions"),
          highlightBands: $(this).parent().find(".highlight-band"),
          basicHighlightBands: $(this).parent().find(".basicColors-content .highlight-band")
        };

        var mostRecentClick, // for storing click events when needed
            windowTopPosition, // for storing the position of the top of the window when needed
            advancedStatus,
            mySavedColorsInfo;

        if (useTabs) {
          myElements.tabs = myElements.thisWrapper.find(".tab");
        }

        if (settings.showSavedColors) {
          myElements.savedColorsContent = myElements.thisWrapper.find(".savedColors-content");
          if (settings.saveColorsPerElement) { // when saving colors for each color picker...
            mySavedColorsInfo = {
              colors: [],
              dataObj: $(this).data()
            };
            $.each(mySavedColorsInfo.dataObj, function (key) {
              mySavedColorsInfo.dataAttr = key;
            });

            // get this picker's colors from local storage if possible
            if (supportsLocalStorage && localStorage["pickAColorSavedColors-" +
              mySavedColorsInfo.dataAttr]) {
              mySavedColorsInfo.colors = JSON.parse(localStorage["pickAColorSavedColors-" +
                mySavedColorsInfo.dataAttr]);

            // otherwise, get them from cookies
            } else if (document.cookie.match("pickAColorSavedColors-" +
              mySavedColorsInfo.dataAttr)) {
              var theseCookies = document.cookie.split(";"); // an array of cookies...
              for (var i=0; i < theseCookies.length; i++) {
                if (theseCookies[i].match(mySavedColorsInfo.dataAttr)) {
                  mySavedColorsInfo.colors = theseCookies[i].split("=")[1].split(",");
                }
              }

            } else { // if no data-attr specific colors are in local storage OR cookies...
              mySavedColorsInfo.colors = allSavedColors; // use mySavedColors
            }
          }
        }
        if (settings.showAdvanced) {
          advancedStatus = {
            h: 0,
            s: 1,
            l: 0.5
          };

          myElements.advancedSpectrums = myElements.thisWrapper.find(".advanced-list").find(".color-box");
          myElements.advancedHighlightBands = myElements.thisWrapper.find(".advanced-list").find(".highlight-band");
          myElements.hueSpectrum = myElements.thisWrapper.find(".spectrum-hue");
          myElements.lightnessSpectrum = myElements.thisWrapper.find(".spectrum-lightness");
          myElements.saturationSpectrum = myElements.thisWrapper.find(".spectrum-saturation");
          myElements.hueHighlightBand = myElements.thisWrapper.find(".spectrum-hue .highlight-band");
          myElements.lightnessHighlightBand = myElements.thisWrapper.find(".spectrum-lightness .highlight-band");
          myElements.saturationHighlightBand = myElements.thisWrapper.find(".spectrum-saturation .highlight-band");
          myElements.advancedPreview = myElements.thisWrapper.find(".advanced-content .color-preview");
        }

        // add the default color to saved colors
        methods.addToSavedColors(myColorVars.defaultColor,mySavedColorsInfo,myElements.savedColorsContent);
        methods.updatePreview(myElements.thisEl);

        //input field focus: clear content
        // input field blur: update preview, restore previous content if no value entered

        myElements.thisEl.focus(function () {
          var $thisEl = $(this);
          myColorVars.typedColor = $thisEl.val(); // update with the current
          if (!settings.allowBlank) {
            $thisEl.val(""); //clear the field on focus
          }
          methods.toggleDropdown(myElements.colorPreviewButton,myElements.ColorMenu);
        }).blur(function () {
          var $thisEl = $(this);
          myColorVars.newValue = $thisEl.val(); // on blur, check the field's value
          // if the field is empty, put the original value back in the field
          if (myColorVars.newValue.match(/^\s+$|^$/)) {
            if (!settings.allowBlank) {
              $thisEl.val(myColorVars.typedColor);
            }
          } else { // otherwise...
            myColorVars.newValue = tinycolor(myColorVars.newValue).toHex(); // convert to hex
            $thisEl.val(myColorVars.newValue); // put the new value in the field
            // save to saved colors
            methods.addToSavedColors(myColorVars.newValue,mySavedColorsInfo,myElements.savedColorsContent);
          }
          methods.updatePreview($thisEl); // update preview
        });

        // toggle visibility of dropdown menu when you click or press the preview button
        methods.executeUnlessScrolled.apply(myElements.colorPreviewButton,
          [{"thisFunction": methods.pressPreviewButton, "theseArguments" : {}}]);

        // any touch or click outside of a dropdown should close all dropdowns
        methods.executeUnlessScrolled.apply($(document), [{"thisFunction": methods.closeDropdownIfOpen,
          "theseArguments": {"button": myElements.colorPreviewButton, "menu": myElements.colorMenu}}]);

        // prevent click/touchend to color-menu or color-text input from closing dropdown

        myElements.colorMenu.on(clickEvent, function (e) {
          e.stopPropagation();
        });
        myElements.thisEl.on(clickEvent, function(e) {
          e.stopPropagation();
        });

        // update field and close menu when selecting from basic dropdown
        methods.executeUnlessScrolled.apply(myElements.colorMenuLinks, [{"thisFunction": methods.selectFromBasicColors,
          "theseArguments": {"els": myElements, "savedColorsInfo": mySavedColorsInfo}}]);

        if (useTabs) { // make tabs tabbable
          methods.tabbable.apply(myElements.tabs);
        }

        if (settings.showSpectrum || settings.showAdvanced) {
          methods.horizontallyDraggable.apply(myElements.highlightBands);
        }

        // for using the light/dark spectrums

        if (settings.showSpectrum) {

          // move the highlight band when you click on a spectrum

          methods.executeUnlessScrolled.apply(myElements.basicSpectrums, [{"thisFunction": methods.tapSpectrum,
            "theseArguments": {"savedColorsInfo": mySavedColorsInfo, "els": myElements}}]);

          $(myElements.basicHighlightBands).on(dragEvent,function (event) {
            var $thisEl = event.target;
            methods.calculateHighlightedColor.apply(this, [{type: "basic"}]);
          }).on(endDragEvent, function (event) {
            var $thisEl = event.delegateTarget;
            var finalColor = methods.calculateHighlightedColor.apply($thisEl, [{type: "basic"}]);
            methods.addToSavedColors(finalColor,mySavedColorsInfo,myElements.savedColorsContent);
          });

        }

        if (settings.showAdvanced) {

          // for dragging advanced sliders


          $(myElements.hueHighlightBand).on(dragEvent, function(event) {
            advancedStatus.h = methods.getHighlightedHue.apply(this, [advancedStatus]);
          });

          $(myElements.lightnessHighlightBand).on(dragEvent, function() {
            methods.calculateHighlightedColor.apply(this, [{"type": "advanced", "hsl": advancedStatus}]);
          }).on(endEvent, function () {
            advancedStatus.l = methods.calculateHighlightedColor.apply(this, [{"type": "advanced", "hsl": advancedStatus}]);
          });

          $(myElements.saturationHighlightBand).on(dragEvent, function() {
            methods.getHighlightedSaturation.apply(this, [advancedStatus]);
          }).on(endDragEvent, function () {
            advancedStatus.s = methods.getHighlightedSaturation.apply(this, [advancedStatus]);
          });

          $(myElements.advancedHighlightBand).on(endDragEvent, function () {
            methods.updateAdvancedInstructions(myElements.advancedInstructions);
          });

          // for clicking/tapping advanced sliders

          $(myElements.lightnessSpectrum).click( function (event) {
            event.stopPropagation(); // stop this click from closing the dropdown
            var $highlightBand = $(this).find(".highlight-band"),
                dimensions = methods.getMoveableArea($highlightBand);
            methods.moveHighlightBand($highlightBand, dimensions, event);
            advancedStatus.l = methods.calculateHighlightedColor.apply($highlightBand, [{"type": "advanced", "hsl": advancedStatus}]);
          });

          $(myElements.hueSpectrum).click( function (event) {
            event.stopPropagation(); // stop this click from closing the dropdown
            var $highlightBand = $(this).find(".highlight-band"),
                dimensions = methods.getMoveableArea($highlightBand);
            methods.moveHighlightBand($highlightBand, dimensions, event);
            advancedStatus.h = methods.getHighlightedHue.apply($highlightBand, [advancedStatus]);
          });

          $(myElements.saturationSpectrum).click( function (event) {
            event.stopPropagation(); // stop this click from closing the dropdown
            var $highlightBand = $(this).find(".highlight-band"),
                dimensions = methods.getMoveableArea($highlightBand);
            methods.moveHighlightBand($highlightBand, dimensions, event);
            advancedStatus.s = methods.getHighlightedSaturation.apply($highlightBand, [advancedStatus]);
          });

          $(myElements.advancedSpectrums).click( function () {
            methods.updateAdvancedInstructions(myElements.advancedInstructions);
          });

          //for clicking advanced color preview

          $(myElements.advancedPreview).click( function () {
            var selectedColor = tinycolor($(this).css("background-color")).toHex();
            $(myElements.thisEl).val(selectedColor);
            $(myElements.thisEl).trigger("change");
            methods.updatePreview(myElements.thisEl);
            methods.addToSavedColors(selectedColor,mySavedColorsInfo,myElements.savedColorsContent);
            methods.closeDropdown(myElements.colorPreviewButton,myElements.colorMenu); // close the dropdown
          });
        }


        // for using saved colors

        if (settings.showSavedColors) {

          // make the links in saved colors work
          $(myElements.savedColorsContent).click( function (event) {
            var $thisEl = $(event.target);

            // make sure click happened on a link or span
            if ($thisEl.is("SPAN") || $thisEl.is("A")) {
              //grab the color the link's class or span's parent link's class
              var selectedColor = $thisEl.is("SPAN") ?
                $thisEl.parent().attr("class").split("#")[1] :
                $thisEl.attr("class").split("#")[1];
              $(myElements.thisEl).val(selectedColor);
              $(myElements.thisEl).trigger("change");
              methods.updatePreview(myElements.thisEl);
              methods.closeDropdown(myElements.colorPreviewButton,myElements.colorMenu);
              methods.addToSavedColors(selectedColor,mySavedColorsInfo,myElements.savedColorsContent);
            }
          });

          // update saved color markup with content from localStorage or cookies, if available
          if (!settings.saveColorsPerElement) {
            methods.updateSavedColorMarkup(myElements.savedColorsContent,allSavedColors);
          } else if (settings.saveColorsPerElement) {
            methods.updateSavedColorMarkup(myElements.savedColorsContent,mySavedColorsInfo.colors);
          }
        }



      });

    };

})(jQuery);
