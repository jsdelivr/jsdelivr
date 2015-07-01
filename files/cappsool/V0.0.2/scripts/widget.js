var cappsool = (function() {

  var hashCode = function (s) {
    return s.split("").reduce(function (a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a
    }, 0);
  }


  var widgetServerId = "";
  var widgetPlatform = "";
  var serverLocation = "";
  var publisherId = "";
  var contentSubject = "";
  var trackingKey = "";
  var cappsoolClassName = 'cappsool-widget';
  var cappsoolId = 'cappsoolId';
  var wasShownEnoughTime = false;
  var wasFullyInViewport = false;
  var currentlyInViewport = false;
  var wasPartiallyInViewport = false;
  var currentlyPartiallyInViewport = false;
  var wasAlmostInViewport = false;
  var currentlyAlmostInViewport = false;
  var suggestedApps = [];
  var filledWidgetElement = null;
  var firstClick = false;
  var firstEngagement = false;
  var widgetConfig = {};
  var activeWidgetUi = null;
  var activeWidgetSubType = null;
  var widgetEventTimeout = null;
  var widgetEventPool = null;
  var shownStoreIds = {};
  var userGuid = '';
  var userGuidClicks = [];
  var retargetedApps = [];
  var cappsoolUrl = "http://server.cappsool.com";
  var movieStartStoreIds = {};
  var globalStaticFilesRoot = "";
  var globalCappsoolHost = "";
  var overrideURL = null;

  var eventTypes = (function eventTypes() {
    return {
      widgetShownPartially: "widgetShownPartially",
      widgetShownCompletely: "widgetShownCompletely",
      widgetSwipeLeft: "widgetSwipeLeft",
      widgetSwipeRight: "widgetSwipeRight",
      widgetEngagement: "widgetEngagement",
      widgetFirstClick: "widgetFirstClick",
      appMovieStart: "appMovieStart",
      appWidgetClick: "appWidgetClick",
      widgetLoadTime: "widgetLoadTime",
      replayVideoClick: "replayVideoClick",
      appShown: "appShown",
      retargetAppClick: "retargetAppClick",
      shareClick : "shareClick"
    }
  }());

  var resetState = function () {
    wasShownEnoughTime = false;
    wasFullyInViewport = false;
    currentlyInViewport = false;
    wasPartiallyInViewport = false;
    currentlyPartiallyInViewport = false;
    wasAlmostInViewport = false;
    currentlyAlmostInViewport = false;
    suggestedApps = [];
    filledWidgetElement = null;
    firstClick = false;
    firstEngagement = false;
    widgetConfig = {};
    activeWidgetUi = null;
    activeWidgetSubType = null;
    widgetEventTimeout = null;
    widgetEventPool = null;
    shownStoreIds = {};
    retargetedApps = [];
    movieStartStoreIds = {};
  }

  var isCurrentlyInViewport = function() {
    return currentlyInViewport;
  }





  var isShownEnoughTime = function() {
    return wasShownEnoughTime;
  }

  var isCurrentlyPartiallyInViewport = function() {
    return currentlyPartiallyInViewport;
  }

  var isCurrentlyAlmostInViewport = function() {
    return currentlyAlmostInViewport;
  }

  var fillWidgetElement = function (contentElem, params) {
    var log = '';
    var s = '';
    for (var i = 0; i < params.slides.length; i++) {
      s = s + params.slides[i].storeUrl + '|';

      // Create retargeted apps array
      if (params.slides[i].retargeted) {
        retargetedApps.push(params.slides[i].storeId);
      }
    }

    var paramsHashCode = hashCode(s);
    var elemHashCode = contentElem.getAttribute("csh");
    log = log + ' apps=' + params.slides.length + ' elem=' + elemHashCode + ' params=' + paramsHashCode + ' ';
    if (elemHashCode === undefined || elemHashCode === null || elemHashCode != paramsHashCode) {
      contentElem.innerHTML = '';
      log = log + ' ready ';
      var success = 0;
      try {
        loadedItems = [];
        for (var i = 0; i < params.slides.length; i++) {
          var urlToLoad = null;
          var isJpgAnimation = false;
          var vd = getUrlToLoad(params.slides[i]);
          if (typeof vd === 'string') {
            urlToLoad = vd;
          } else if (vd) {
            urlToLoad = vd.url;
            isJpgAnimation = true;
          }
          loadedItems.push({
            index : i,
            videoDetails : vd,
            data : params.slides[i],
            urlToLoad : urlToLoad,
            isJpgAnimation : isJpgAnimation,
            coverLoaded : false,
            trailerLoaded : false
          });
        }

        var widgetTypes = {
          'default': espresso,
          espresso: espresso,
          frappe : frappe,
          korto: korto,
          linizio: linizio,
          bombon: bombon
        };

        var widgetTypeMain = widgetConfig.widgetType.split("-")[0].toLowerCase();
        activeWidgetUi = widgetTypes[widgetTypeMain];

        activeWidgetSubType = widgetConfig.widgetType.split("-")[1];
        var singleOffer = params.slides.length == 1;
        if (singleOffer) {
          if (!activeWidgetSubType) {
            activeWidgetSubType = "dailyapp";
          } else if (activeWidgetSubType.indexOf("dailyapp") < 0) {
            activeWidgetSubType = activeWidgetSubType + " dailyapp";
          }
          //E.F. temp - solve UI bug
          if (widgetTypeMain === 'frappe') {
            params.slides.push(params.slides[0]);
          }
        }
        suggestedApps = params.slides;
        filledWidgetElement = contentElem;
        $(contentElem).addClass(activeWidgetSubType || '');


        if(widgetConfig.cssOverride) {
          var cssOverrideId = "cappsoolCssOverride";
          var existingStyle = $('#' + cssOverrideId);
          if (existingStyle && existingStyle.length > 0) {
            existingStyle.html(widgetConfig.cssOverride);
          } else {
            $("<style id='" + cssOverrideId +"'>" + widgetConfig.cssOverride + "</style>").appendTo("head");
          }
        }

        var cappsoolObject = {
          loadedItems : loadedItems,
          logEvent : logEvent,
          suggestedApps : suggestedApps,
          widgetConfig : widgetConfig,
          jpegAnimation : jpegAnimation,
          isCurrentlyInViewport : isCurrentlyInViewport,
          isCurrentlyPartiallyInViewport : isCurrentlyPartiallyInViewport,
          isCurrentlyAlmostInViewport : isCurrentlyAlmostInViewport,
          isShownEnoughTime : isShownEnoughTime
        };
        cappsoolObject.commonWidget = commonWidget(cappsoolObject);
        activeWidgetUi.build(cappsoolObject, contentElem, params);
        success = 1;
      }
      catch (err) {
        log = log + ' ' + err.message + ' ';
        console.log(err);
      }
      if (success > 0) {
        contentElem.setAttribute("csh", paramsHashCode);
        log = log + ' set ';
      }
    }
    $(window).scroll(onScroll);
    onScroll(null);
    setTimeout(onScroll,1); // call one more time since sometimes the first onScroll happens before the widget is rendered
    return log;
  }

  var widgetElement = function (params) {
    var contentElem = document.createElement('div');
    contentElem.className = cappsoolClassName;
    contentElem.id = cappsoolId;
    return contentElem;
  }

  var findCappsoolWidget = function () {
    var res = [];
    var elems = document.getElementsByTagName('*'), i;
    for (i in elems) {
      if ((' ' + elems[i].className + ' ').indexOf(' cappsool-widget ') > -1) {
        res.push(elems[i]);
      }
    }
    return res;
  }

  var replaceContentInContainer = function (widgetId, publisher_Id, subject, host, platform, matchClass, content) {
    serverLocation = host;
    widgetServerId = widgetId;
    widgetPlatform = platform;
    publisherId = publisher_Id;
    contentSubject = subject;
    var log = '';
    var exisitngWidgets = findCappsoolWidget();
    if (exisitngWidgets.length > 0) {

    } else {
      var elems = document.getElementsByTagName('*'), i;
      for (i in elems) {
        if ((' ' + elems[i].className + ' ').indexOf(' ' + matchClass + ' ') > -1) {
          var contentElem = widgetElement(content);
          var addedItem = elems[i].appendChild(contentElem);
          exisitngWidgets.push(addedItem);
          log = log + addedItem.nodeName + ':' + addedItem.className + ' ';
          break;
        }
      }
    }
    log = log + ' numWidgets=' + exisitngWidgets.length + ' ';
    for (var i = 0; i < exisitngWidgets.length; i++) {
      var r = fillWidgetElement(exisitngWidgets[i], content);
      log = log + r;
    }


    return log;
  }



  var onScroll = function (e,overrideFully,overridePartially,overrideAlmost,overrideNotShow) { //Last params are for native integration
    if ($ === undefined) {
      //jquery is not loaded yet
      return;
    }

    if (suggestedApps === undefined || suggestedApps === null || suggestedApps.length == 0) {
      return; // no offer yet
    }

    var s = true;
    if (overrideNotShow){
      s = false; //
    }

    var elem = $('.' + cappsoolClassName);
    if (elem.length > 0) {
      var newIsElementPartiallyInViewport = (isElementPartiallyInViewport(elem, 0) || overridePartially) && s;
      if (!wasPartiallyInViewport) {
        var lastIsElementPartiallyInViewport = wasPartiallyInViewport;

        if (lastIsElementPartiallyInViewport !== newIsElementPartiallyInViewport) {
          if (newIsElementPartiallyInViewport) {
            //console.log("Now Partially in viewport - send event");
            logEvent({}, eventTypes.widgetShownPartially, null, null);
          }
          wasPartiallyInViewport = newIsElementPartiallyInViewport;
        }
      }
      if (newIsElementPartiallyInViewport != currentlyPartiallyInViewport) {
        currentlyPartiallyInViewport = newIsElementPartiallyInViewport;
        if (activeWidgetUi && activeWidgetUi.widgetInViewport) {
          activeWidgetUi.widgetInViewport();
        }
      }

      var verticalMargin = 500;
      if (widgetConfig && widgetConfig.loadCoverMargin) {
        verticalMargin = widgetConfig.loadCoverMargin;
      }
      var newIsElementAlmostInViewport = (isElementPartiallyInViewport(elem, verticalMargin) || overrideAlmost) && s;
      if (!wasAlmostInViewport) {
        var lastIsElementAlmostInViewport = wasAlmostInViewport;

        if (lastIsElementAlmostInViewport !== newIsElementAlmostInViewport) {
          wasAlmostInViewport = newIsElementAlmostInViewport;
        }
      }
      if (newIsElementAlmostInViewport != currentlyAlmostInViewport) {
        currentlyAlmostInViewport = newIsElementAlmostInViewport;
        if (activeWidgetUi && activeWidgetUi.widgetInViewport) {
          activeWidgetUi.widgetInViewport();
        }
      }

      var newIsElementInViewport = (isElementInViewport(elem) || overrideFully) && s;
      if (!wasFullyInViewport) {
        var lastIsElementInViewport = wasFullyInViewport;

        if (lastIsElementInViewport !== newIsElementInViewport) {
          if (newIsElementInViewport) {
            //console.log("Now fully in viewport - send event");
            if (activeWidgetUi && activeWidgetUi.widgetInViewport) {
              activeWidgetUi.widgetInViewport();
            }
          }
          wasFullyInViewport = newIsElementInViewport;
        }
      }

      if (newIsElementInViewport != currentlyInViewport) {
        currentlyInViewport = newIsElementInViewport;
        if (activeWidgetUi && activeWidgetUi.widgetInViewport) {
          activeWidgetUi.widgetInViewport();
        }
      }
      if (newIsElementInViewport && !wasShownEnoughTime) {
        shownTimeCounter.start(false);
      }
      if (!newIsElementInViewport && !newIsElementPartiallyInViewport) {
        shownTimeCounter.stop();
      }

    }
    else {
      //console.log("no widgetId")
    }
  }

  var installCappsool = function (baseUrl) {

    var log = '';
    var a1 = document.getElementsByTagName('head')[0].getElementsByClassName("cappsool-1").length;
    if (a1 <= 0) {
      var script = document.createElement('script');
      script.src = baseUrl + "/scripts/jquery-1.10.1.min.js";
      script.className = "cappsool-1";
      document.getElementsByTagName('head')[0].appendChild(script);
      log = log + '1';
    }

    /*var a2 = document.getElementsByTagName('head')[0].getElementsByClassName("cappsool-2").length;
     if (a2 <= 0) {
     var script = document.createElement('script');
     script.src= baseUrl + "/scripts/idangerous.swiper.js";
     script.className = "cappsool-2";
     document.getElementsByTagName('head')[0].appendChild(script);
     log = log + '2';
     }*/

    var a3 = document.getElementsByTagName('head')[0].getElementsByClassName("cappsool-3").length;
    if (a3 <= 0) {
      var link = document.createElement('link');
      link.href = baseUrl + "/scripts/style.css";
      link.rel = "stylesheet";
      link.className = "cappsool-3";
      document.getElementsByTagName('head')[0].appendChild(link);
      log = log + '3';
    }
    log = log + 'done';
    return log;
  }


  var jpegAnimation = (function () {
    var jpgAnimationTimer = null;
    var videoDetails = null;
    var pos = 0;
    var imageWidth;
    var imageHeight;
    var factorx = 1;
    var factory = 1;

    function isPromoRunning() {
      if (activeWidgetSubType && (activeWidgetSubType.indexOf('cscalculator') > -1)) {
        return ($('.cappsool-widget .cscalculator-wrapper')[0] && $('.cappsool-widget .cscalculator-wrapper').css('display') !== 'none');
      }
      return false;
    };

    function start(vd, elem, image) {
      stop();

      if (!elem) {
        return;
      }
      videoDetails = vd;
      var interval = 1000 / videoDetails.frameRate;
      pos = videoDetails.stopPos || 0;

      imageWidth = image.width;
      imageHeight = image.height;
      factorx = elem.offsetWidth / videoDetails.width;
      factory = elem.offsetHeight / videoDetails.height;

      if (!elem.style.backgroundImage) {
        var img = document.createElement('img');

        $(img).one("load", function() {
          $(elem).css({ 	'position' : 'absolute',
                          'background-image': 'url("' + vd.url + '")' });
          $(elem).hide();
          $(elem).fadeIn(1000);
        }).each(function() {
          if(this.complete) $(this).load();
        });

        img.src = vd.url;
      }

      var fitBackgroundSize = function() {
        // Change the bg size when element size changes - like when orientation changes
        if (videoDetails.elemOffsetWidth !== elem.offsetWidth ||
          videoDetails.elemOffsetHeight !== elem.offsetHeight) {
          videoDetails.elemOffsetWidth = elem.offsetWidth;
          videoDetails.elemOffsetHeight = elem.offsetHeight;
          factorx = elem.offsetWidth / videoDetails.width;
          factory = elem.offsetHeight / videoDetails.height;

          $(elem).css({ 'background-size': '' + factorx * imageWidth + 'px ' + factory * imageHeight + 'px' });
        }
      };
      fitBackgroundSize();

      var self = this;
      var x = videoDetails.stopX || 0;
      var y = videoDetails.stopY || 0;
      elem.style.backgroundPosition = "" + x + "px " + y + "px";
      self.isPlaying = true;
      var promoStopped = false;
      jpgAnimationTimer = setInterval(function () {

        // Don't start trailer until promo(e.g. calculator) ends
        if (promoStopped || !isPromoRunning()) {

          promoStopped = true;
          fitBackgroundSize();

          if ((pos + 1) >= videoDetails.numFrames) {
            self.playRound = self.playRound + 1;
            if (self.onCompleteRound) {
              self.onCompleteRound(self.playRound);
            }
            if (!videoDetails)
              return;
          }
          pos = (pos + 1) % videoDetails.numFrames;
          var row = Math.floor(pos / videoDetails.imagesInLine);
          var col = pos - row * videoDetails.imagesInLine;

          var y = -1 * factory * row * videoDetails.height;
          var x = -1 * factorx * col * videoDetails.width;

          if (videoDetails.saveStopPos) {
            videoDetails.stopPos = pos;
            videoDetails.stopX = x;
            videoDetails.stopY = y;
          }

          elem.style.backgroundPosition = "" + x + "px " + y + "px";
        }
      }, interval);

    }

    function stop() {
      if (jpgAnimationTimer) {
        clearInterval(jpgAnimationTimer);
        jpgAnimationTimer = null;
      }
      this.isPlaying = false;
      videoDetails = null;
      pos = 0;
      this.playRound = 0;
    }


    return {
      start: start,
      stop: stop,
      isPlaying : false,
      playRound : 0
    };
  })();

  var shownTimeCounter = (function () {
    var shownTimeCounterTimer = null;
    var interval = 2000;

    function setInterval(v) {
      interval = v;
    }

    function start(forceShown) {
      if (wasShownEnoughTime)
        return;

      var onShownEnoughTime = function() {
        if (!wasShownEnoughTime) {
          wasShownEnoughTime = true;
          activeWidgetUi.widgetInViewport();
        }
      };

      if (forceShown) {
        stop();
        onShownEnoughTime();
      }
      if (shownTimeCounterTimer)
        return;

      shownTimeCounterTimer = setTimeout(function () {
        onShownEnoughTime();
        shownTimeCounterTimer = null;
      }, interval);

    }

    function stop() {
      if (shownTimeCounterTimer) {
        clearInterval(shownTimeCounterTimer);
        shownTimeCounterTimer = null;
      }
    }


    return {
      start: start,
      stop: stop,
      setInterval : setInterval
    };
  })();

  var shareSubitem = (function() {
    function shareWhatsapp(campaignId) {
      event.stopPropagation();

      var url = globalCappsoolHost + '/' + 'landingpage/' + campaignId;
      var link = "whatsapp://send?text=" + encodeURIComponent("Hey, I think this app may interest you - I loved it.\n") + encodeURIComponent(url);
      window.open(link);
      return false;

    }

    function shareFacebook(campaignId) {
      event.stopPropagation();

      var url = globalCappsoolHost + '/' + 'landingpage/' + campaignId;

      var name = "I like this app";

      window.open(
        'http://m.facebook.com/sharer.php?u=' + encodeURIComponent(url) + '&t=' + name,

        'facebook-share-dialog',
        'width=626,height=436'
      );

      return false;
    }

    function addShareButtons(element, campaignId, item) {
      var item = item;
      var html = '<span class="cappsool-share-whatsapp"></span>' +
        '<span class="cappsool-share-facebook"></span>';
      element.html(html);
      element.find(".cappsool-share-whatsapp").click(function () {
        logEvent(item.data, eventTypes.shareClick, null, null);
        shareWhatsapp(campaignId);
      });
      element.find(".cappsool-share-facebook").click(function () {
        logEvent(item.data, eventTypes.shareClick, null, null);
        shareFacebook(campaignId);
      });
    }
    return {
      addShareButtons : addShareButtons
    };
  })();

  var commonWidget = function (cappsoolObjectInp) {
    var cappsoolObject;
    var coverImagesLoaded = false;
    var wasFullyShown = false;
    var trailerReadyTime = null;
    var inView = false;
    var rootSelector = null;
    var jpgElemActiveSelector = '.slick-active';
    var currentSlide = 0;
    var lastOpenStoreLog = null;
    var enoughTimePassed = false;
    var reportAllApps = false;
    var shouldLoadVideo = true;

    function loadCoverImages() {
      if (coverImagesLoaded) return;
      if (cappsoolObject.isCurrentlyPartiallyInViewport() || cappsoolObject.isCurrentlyAlmostInViewport()) {
        coverImagesLoaded = true;
        var styles = "";
        for (var k = 0; k < cappsoolObject.suggestedApps.length; k++) {
          var v = cappsoolObject.suggestedApps[k];
          var cssStyle = "";
          if (v.coverImageUrl) {
            cssStyle = "background-image: url('"+v.coverImageUrl+"'); background-size: 100% 100%; background-repeat: no-repeat;";
          } else {
            cssStyle = "background-image: url('"+v.smallIconUrl+"'); background-size: 56px 56px; background-repeat: repeat;";
          }

          styles += rootSelector + ' .video[num="' + k + '"] .cover {'+cssStyle+'}';
        }
        var coverStylesId = "cappsoolCoverStyles";
        var existingStyle = $('#' + coverStylesId);
        if (existingStyle && existingStyle.length > 0) {
          existingStyle.html(styles);
        } else {
          $( "<style id='" + coverStylesId + "'>" + styles + "</style>" ).appendTo( "head" );
        }
      }
      $('.slick-track').css('opacity', 1);
    }


    function completeTrailerAnimationRound(round) {
      cappsoolObject.loadedItems[currentSlide].fullPlayed = true;
      startTrailer(-1);
    }

    function trailerLoaded(index) {
      if (index == currentSlide) {
        startTrailer(0);
      }
    }

    /**
     *
     * @param delay - 0:Dont wait, 1000:Wait a sec, -1:Stop
     */
    function startTrailer(delay) {
      if (!shouldLoadVideo) {
        return;
      }
      var toContinue = true;

      cappsoolObject.jpegAnimation.onCompleteRound = completeTrailerAnimationRound;
      var element = cappsoolWidgetElement();

      var item = cappsoolObject.loadedItems[currentSlide];

      if (item.videoDetails) {
        item.videoDetails.saveStopPos = true;
        var videoElem = $(element).find(rootSelector + ' .video[num="' + currentSlide + '"]');
        var jpgElemActive = $(element).find(rootSelector + ' ' + jpgElemActiveSelector + ' .video[num="' + currentSlide + '"] .jpg-animation');

        if (!item.trailerLoaded && !item.trailer) {
          item.trailer = new Image();
          item.trailer.src = item.urlToLoad;
          item.trailer.onload = function () {
            item.trailerLoaded = true;
            trailerLoaded(item.index);
          };
          toContinue = false;
        }

        // On first fully shown - wait a delay before starting the movie
        var readyTimePassed = ((delay <= 0) ? true : false);
        if (!wasFullyShown && cappsoolObject.isCurrentlyInViewport() && cappsoolObject.jpegAnimation.playRound <= 0 && trailerReadyTime === null && !cappsoolObject.jpegAnimation.isPlaying && !readyTimePassed) {
          wasFullyShown = true;
          trailerReadyTime = new Date();
          setTimeout(function () {
            startTrailer(0);
          }, 1000);
          toContinue = false;
        }

        if (toContinue && readyTimePassed) {

          if (delay !== -1 && item.isJpgAnimation && item.trailerLoaded &&
            (cappsoolObject.jpegAnimation.playRound <= 0)) {

            cappsoolObject.jpegAnimation.start(item.videoDetails, jpgElemActive[0], item.trailer);

            if (!(item.videoDetails.stopPos > 0)) {
              cappsoolObject.logEvent(item.data, eventTypes.appMovieStart, null, null);

              videoElem.each(function (k, v) {
                if ($(v).find('.jpg-animation')[0].style.backgroundImage) {
                  $(v).find('.jpg-animation').fadeIn(1000);
                }
                $(v).find('.cover').fadeOut(1000);
                $(v).find('.video-overlay').fadeOut(800);
              });
            }

          } else {
            cappsoolObject.jpegAnimation.stop();
            videoElem.each(function (k, v) {
              var jpgElem = $(v).find('.jpg-animation')[0];

              if (jpgElem && jpgElemActive[0]) {
                if (!jpgElem.style.backgroundImage) {
                  jpgElem.style.backgroundImage = jpgElemActive[0].style.backgroundImage;
                  jpgElem.style.backgroundSize = jpgElemActive[0].style.backgroundSize;
                }
                jpgElem.style.backgroundPosition = jpgElemActive[0].style.backgroundPosition;
              } else {
                //console.log('.jpg-animation not found');
              }

              if ((delay === -1) && item.fullPlayed) {
                $(v).find('.cover').fadeIn(800);
                $(v).find('.cover.loading').hide();
                $(v).find('.video-overlay').fadeIn(600);
                $(jpgElem).fadeOut(800);
              }

            });
          }
        }
      }
    };

    function replayVideo(item) {
      item.fullPlayed = false;
      item.videoDetails.stopPos = 0;
      item.videoDetails.stopX = 0;
      item.videoDetails.stopY = 0;
      cappsoolObject.commonWidget.startTrailer(0);
    }

    var widgetInViewportChanged = function(){
      loadCoverImages();
      if (currentSlide >= 0) {
        if (!wasFullyShown && cappsoolObject.isCurrentlyInViewport()) {
          startTrailer(1000);
          inView = true;
        } else {
          var item = cappsoolObject.loadedItems[currentSlide];

          if (wasFullyShown && !item.fullPlayed && !inView && cappsoolObject.isCurrentlyPartiallyInViewport()) {
            startTrailer(0);
            inView = true;
          } else if (wasFullyShown && item.fullPlayed && !inView && cappsoolObject.isCurrentlyPartiallyInViewport()) {
            replayVideo(item);
            inView = true;
          } else if (wasFullyShown && !item.fullPlayed && inView && !cappsoolObject.isCurrentlyPartiallyInViewport()) {
            startTrailer(-1);
            inView = false;
          } else if (wasFullyShown && item.fullPlayed && inView && !cappsoolObject.isCurrentlyPartiallyInViewport()) {
            inView = false;
          }
        }
      }
      widgetShownEnoughTimeOrEngagement();
    }

    var widgetShownEnoughTimeOrEngagement = function() {
      if (enoughTimePassed)
        return;
      if(cappsoolObject.isShownEnoughTime()) {
        enoughTimePassed = true;
        logEvent({}, eventTypes.widgetShownCompletely, null, null);

        if (reportAllApps) {
          $.each(cappsoolObject.loadedItems, function (k, v) {
            var data = cappsoolObject.loadedItems[k].data;
            logEvent(data, eventTypes.appShown, null, null);
          });
        } else if (currentSlide >= 0 && currentSlide < cappsoolObject.loadedItems.length) {
          var data = cappsoolObject.loadedItems[currentSlide].data;
          logEvent(data, eventTypes.appShown, null, null);
        }
      }
    }

    var setRootSelector = function(sel, jpgElemActiveSel) {
      rootSelector = sel;
      if (jpgElemActiveSel) {
        jpgElemActiveSelector = jpgElemActiveSel;
      }
    }

    var setCurrentSlide = function(cur) {
      currentSlide = cur;
    }

    var setReportAllApps = function(cur) {
      reportAllApps = cur;
    }

    var setShouldLoadVideo = function(cur) {
      shouldLoadVideo = cur;
    }

    var setPromo= function(contentElem, duration) {
      if (activeWidgetSubType && (activeWidgetSubType.indexOf('cscalculator') > -1)) {
        if ($(contentElem).find('.title') && $(contentElem).find('.title').next()) {
          var el = $(contentElem).find('.title').next();
          el.hide();
          el.after('<div class="cscalculator-wrapper"><span class="cscalculating"><span class="first"></span><span class="sec"></span></span><span class="cstext">Calculating...</span></div>');
          var promoInterval = setInterval(function() {
            if (cappsoolObject.isCurrentlyPartiallyInViewport() || cappsoolObject.isCurrentlyInViewport()) {
              clearInterval(promoInterval);
              setTimeout(function() {
                el.show();
                if($('.slick-slider')[0]) {
                  $('.slick-slider').slick('setPosition');
                }
                $(contentElem).find('.cscalculator-wrapper').hide();
              }, duration);
            }
          }, 1000);
        }
      }
    };

    var openStore = function(current, eventType, storeUrl, storeUrlTarget) {
      var avoidMultiLogTimeMilliSec = 10000;
      var item = cappsoolObject.loadedItems[current];
      if (lastOpenStoreLog && lastOpenStoreLog.storeId == item.data.storeId && lastOpenStoreLog.eventType == eventType  && (new Date() - lastOpenStoreLog.time) < avoidMultiLogTimeMilliSec) {
        // such click was just logged
      } else {
        lastOpenStoreLog = {storeId: item.data.storeId, eventType: eventType, time: new Date()};
        cappsoolObject.logEvent(item.data, eventType, null, storeUrl);
      }
      var target = '_top';
      if (storeUrlTarget) {
        target = storeUrlTarget;
      }
      if (window.CappsoolAndroid){
        window.CappsoolAndroid.openURL(storeUrl);
      }
      else{
        window.open(storeUrl, target);
      }
    }

    function setLogoBehavior(logoElem) {
      var clicked = 0;

      var changeColor = function() {
        if(logoElem.css('background-image').indexOf('green') < 0) {
          logoElem.css('background-image', 'url(http://server.cappsool.com/assets/widget/images/logo_green.png)');
        } else {
          logoElem.css('background-image', 'url(http://server.cappsool.com/assets/widget/images/logo_small.png)');
        }
      };

      logoElem.click(function() {
        clicked = clicked + 1;

        if (clicked === 1) {
          // Change logo color
          changeColor();

        } else if (clicked === 2) {

          // Change logo color
          changeColor();
          clicked = 0;

          // Open paid distribution page
          window.open(cappsoolUrl + '/assets/widget/paid-distribution.html');
        }
      });
    }

    var  emojifier = function(input){

      var res = emojione.shortnameToImage(input);
      return res;

    }

    cappsoolObject = cappsoolObjectInp;
    return {
      widgetInViewportChanged : widgetInViewportChanged,
      widgetShownEnoughTimeOrEngagement : widgetShownEnoughTimeOrEngagement,
      setRootSelector : setRootSelector,
      setCurrentSlide : setCurrentSlide,
      setReportAllApps : setReportAllApps,
      setShouldLoadVideo : setShouldLoadVideo,
      startTrailer : startTrailer,
      replayVideo : replayVideo,
      openStore: openStore,
      setLogoBehavior: setLogoBehavior,
      emojifier : emojifier,
      setPromo : setPromo
    };
  };




  function getUrlToLoad(data) {
    if (data.videoDetails) {
      for (var i = 0; i < data.videoDetails.length; i++) {
        var vd = data.videoDetails[i];
        if (vd.key == "jp") {
          return vd;
        }
      }
    }
    return data.videoUrl;
  }



  function logEvent(appDataInput, eventType, loadTime, clickUrl) {

    var appData = {
      app : appDataInput.name ? appDataInput.name : "",
      storeId : appDataInput.storeId ? appDataInput.storeId : "",
      developerId : appDataInput.developerId,
      campaignId : appDataInput.campaignId,
      category : appDataInput.category
    };

    var widgetId = widgetServerId;
    var publisher_Id = publisherId;
    var platform = widgetPlatform;
    var host = serverLocation;
    var subject = contentSubject;
    var time = new Date().getTime() / 1000;

    //console.log(eventType + storeId);

    var data = {
      clientTimestamp: time,
      widgetId: widgetId,
      platform: platform,
      publisherId: publisher_Id,
      subject: subject,
      widgetType: widgetConfig.widgetType,
      userGuid: userGuid,
      eventsArray : []
    };
    data.userAgent = navigator.userAgent;
    data.trackingKey = trackingKey;

    var ev1 = {
      eventType: eventType,
      app: appData.app,
      storeId: appData.storeId,
      developerId: appData.developerId,
      campaignId: appData.campaignId,
      category: appData.category,
      loadTime: loadTime
    }
    if (clickUrl){
      ev1.clickUrl = clickUrl;
    }

    if (isEngagementEvent(eventType)) {
      shownTimeCounter.start(true);
    }

    var addInitialEvent = true;
    if (eventType == eventTypes.appShown) {
      if (shownStoreIds[appData.storeId]) {
        addInitialEvent = false; // dont send this event twice
      } else {
        shownStoreIds[appData.storeId] = true;
      }
    }
    if (eventType == eventTypes.appMovieStart) {
      if (movieStartStoreIds[appData.storeId]) {
        addInitialEvent = false; // dont send this event twice
      } else {
        movieStartStoreIds[appData.storeId] = true;
      }
    }

    if (addInitialEvent) {
      data.eventsArray.push(ev1);
    }


    if (!firstEngagement && isEngagementEvent(eventType)) {
      firstEngagement = true;
      data.eventsArray.push({eventType : eventTypes.widgetEngagement});
    }

    if (eventType == eventTypes.appWidgetClick) {
      if (!firstClick) {
        firstClick = true;
        data.eventsArray.push({eventType : eventTypes.widgetFirstClick});
      }

      if (retargetedApps.indexOf(appData.storeId) > -1) {
        data.eventsArray.push({
          eventType: eventTypes.retargetAppClick,
          app: appData.app,
          storeId: appData.storeId,
          developerId: appData.developerId,
          campaignId: appData.campaignId,
          category: appData.category
        });
      }

      // Add clicks to user cookie
      if (userGuid) {
        var index = userGuidClicks.indexOf(appData.storeId);
        if (index > -1) {
          userGuidClicks.splice(index, 1);
        }
        userGuidClicks.push(appData.storeId);
        updateGuidStr();
      }

    }

    if (isSwipeEvent(eventType)) {
      if (shownStoreIds[appData.storeId]) {
      } else {
        shownStoreIds[appData.storeId] = true;
        data.eventsArray.push({
          eventType: eventTypes.appShown,
          app: appData.app,
          storeId: appData.storeId,
          developerId: appData.developerId,
          campaignId: appData.campaignId,
          category: appData.category
        });
      }
    }

    if (data.eventsArray.length == 0) {
      return;
    }

    if (widgetEventTimeout) {
      clearTimeout(widgetEventTimeout);
    }
    if (widgetEventPool == null) {
      widgetEventPool = data;
    } else {
      for (var i = 0; i < data.eventsArray.length; i++) {
        widgetEventPool.eventsArray.push(data.eventsArray[i]);
      }
    }

    var hasClick = false;
    if (widgetEventPool && widgetEventPool.eventsArray && widgetEventPool.eventsArray.length > 0) {
      for (var i = 0; i < widgetEventPool.eventsArray.length; i++) {
        if (isClickEvent(widgetEventPool.eventsArray[i].eventType)) {
          hasClick = true;
        }
      }
    }

    var reportEventsToServer = function(){
      if (widgetEventPool) {
        var dataToSend = widgetEventPool;
        widgetEventPool = null;
        $.ajax({
          type: "POST",
          url: host + "/api/widgetService/widgetevent",
          data: {json : JSON.stringify(dataToSend)},
          success: function (data) {
            //console.log("log " + eventType + " " + (storeId ? storeId : ''));
          },
          error: function () {
            console.log("log failed");
          }
        });
      }
    };

    if (hasClick) {
      reportEventsToServer();
    } else {
      widgetEventTimeout = setTimeout(reportEventsToServer, 1500);
    }
  }

  function isSwipeEvent(eventType){
    return (eventType == eventTypes.widgetSwipeLeft || eventType == eventTypes.widgetSwipeRight)
  }
  function isClickEvent(eventType){
    return (eventType == eventTypes.appWidgetClick || eventType == eventTypes.shareClick)
  }

  function updateGuidStr() {
    // Concat guid
    var newStr = userGuid;

    // Concat clicks
    for (var i=0; i < userGuidClicks.length; i++) {
      if (/^[a-zA-Z0-9.-]*$/.test(userGuidClicks[i])) {
        if (i === 0) {
          newStr = newStr.concat('?clicks=' + userGuidClicks[i]);
        } else {
          newStr = newStr.concat('+' + userGuidClicks[i]);
        }
      }
    }

    // Update localStorage
    document.getElementsByName('cappsool-iframe')[0].contentWindow.postMessage(newStr, cappsoolUrl);
  }

  function isEngagementEvent(eventType) {
    return (eventType == eventTypes.widgetSwipeLeft || eventType == eventTypes.widgetSwipeRight  ||
    eventType == eventTypes.appWidgetClick || eventType == eventTypes.replayVideoClick || eventType == eventTypes.shareClick);
  }

  function isElementPartiallyInViewport(el, verticalMargin) {
    //special bonus for those using jQuery
    if (typeof jQuery !== 'undefined' && el instanceof jQuery) el = el[0];

    var rect = el.getBoundingClientRect();
    // DOMRect { x: 8, y: 8, width: 100, height: 100, top: 8, right: 108, bottom: 108, left: 8 }
    var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    // http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
    var vertInView = ((rect.top - verticalMargin) <= windowHeight) && ((rect.top + verticalMargin + rect.height) >= 0);
    var horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

    return (vertInView && horInView);
  }


// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el) {
    //special bonus for those using jQuery
    if (typeof jQuery !== 'undefined' && el instanceof jQuery) el = el[0];

    var rect = el.getBoundingClientRect();
    var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    var allowedSides = windowWidth * 0.05;

    return (
    (rect.left + allowedSides >= 0)
    && (rect.top >= 0)
    && ((rect.left + rect.width - allowedSides) <= windowWidth)
    && ((rect.top + rect.height) <= windowHeight)
    );

  }

  function loadNeededIncludesInternal(host, widgetConfig, next) {
    var cssId = 'cappsoolWidgetCss';  // you could encode the css path itself to generate id..
    var slickCssId = 'cappsoolSlickCss';
    var slickJsId = 'cappsoolSlickJs';

    var emojiCssId = 'cappsoolEmojiCss';
    var emojiJsId = 'cappsoolEmojiJs';

    var swiperJsId = 'cappsoolSwiperJs';
    var needSlick = (widgetConfig.widgetType.split("-")[0].toLowerCase() == 'frappe' ||
                     widgetConfig.widgetType.split("-")[0].toLowerCase() == 'bombon');
    var needSwiper = !needSlick && (widgetConfig.widgetType.split("-")[0].toLowerCase() != 'korto');
    var staticFilesRoot = host + '/assets/widget/';
    if (widgetConfig.staticFilesRoot && widgetConfig.staticFilesRoot.length > 0) {
      staticFilesRoot = widgetConfig.staticFilesRoot;
      if (staticFilesRoot.indexOf('http') != 0) {
        if ('https:' == location.protocol) {
          staticFilesRoot = 'https://' + staticFilesRoot;
        } else {
          staticFilesRoot = 'http://' + staticFilesRoot;
        }
      }

    }
    globalCappsoolHost = location.protocol + "//" + location.host;
    if (host && host.length > 0) {
      globalCappsoolHost = host;
    }
    globalStaticFilesRoot = staticFilesRoot;

    var head = document.getElementsByTagName('head')[0];
    if (!document.getElementById(cssId)) {
      var link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = staticFilesRoot + 'scripts/style.css';
      link.media = 'all';
      head.appendChild(link);

    }
    if (needSlick) {
      if (!document.getElementById(slickCssId)) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = slickCssId;
        link.type = 'text/css';
        link.href = ('https:' == location.protocol ? 'https' : 'http') + '://cdn.jsdelivr.net/jquery.slick/1.4.1/slick.css';
        head.appendChild(link);
      }
    }


    if (!document.getElementById(emojiCssId)) {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.id = emojiCssId;
      l.type = 'text/css';
      l.href = ('https:' == location.protocol ? 'https' : 'http') + '://cdn.jsdelivr.net/emojione/1.4.1/assets/css/emojione.min.css';
      head.appendChild(l);
    }

    var loadSlickJs = function(callback) {
      if (needSlick) {
        if (!document.getElementById(slickJsId)) {
          var script = document.createElement('script');
          script.onload = callback;
          script.onerror = callback;
          script.id = slickJsId;
          script.src = ('https:' == location.protocol ? 'https' : 'http') + '://cdn.jsdelivr.net/jquery.slick/1.4.1/slick.min.js';
          document.getElementsByTagName('body')[0].appendChild(script);
        } else {
          callback();
        }
      } else {
        callback();
      }
    }

    var loadEmojiJs = function(callback) {
      if (!document.getElementById(emojiJsId)) {
        var s = document.createElement('script');
        s.onload = callback;
        s.onerror = callback;
        s.id = emojiJsId;
        s.src = ('https:' == location.protocol ? 'https' : 'http') + '://cdn.jsdelivr.net/emojione/1.4.1/lib/js/emojione.min.js';
        document.getElementsByTagName('body')[0].appendChild(s);
      } else {
        callback();
      }
    }

    var loadSwiperJs = function(callback) {
      if (needSwiper) {
        if (!document.getElementById(swiperJsId)) {
          var script = document.createElement('script');
          script.onload = callback;
          script.id = swiperJsId;
          script.src = staticFilesRoot + 'scripts/cs-swiper.js';
          document.getElementsByTagName('body')[0].appendChild(script);
        } else {
          callback();
        }
      } else {
        callback();
      }
    }

    loadSwiperJs(function(){
      loadSlickJs( function(){
        loadEmojiJs(function(){
          next()
        });
      });
    });
  }

  function loadNeededIncludes(host, next) {
    var hasValidJquery = function() {
      if (!window.jQuery)
        return false;
      var ver = $.fn.jquery.split('.');
      return (window.jQuery && (
        (parseInt(ver[0]) > 1)  ||
        ((parseInt(ver[0]) === 1) && (parseInt(ver[1]) >= 7))
      ));
    }




    //load jQuery if it isn't already
    var onjQueryLoad = function() {
      if (window.jQuery && !hasValidJquery()) {
        // There is an older version of jquery on the page which doesnt support slick carousel
        $.noConflict(true);
      }

      if (window.jQuery === undefined) {
        var src = 'https:' == location.protocol ? 'https' : 'http',
         script = document.createElement('script');
        script.onload = next;
        script.src = src + '://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js';
        document.getElementsByTagName('body')[0].appendChild(script);
      } else {
        next();
      }
    }

    //workaround for chrome ios bug
    //var isChromeIos =( /iPhone|iPad|iPod/i.test(navigator.userAgent) && /crios/i.test(navigator.userAgent) );

    // Wait to page only if jQuery is not loaded yet
    if (hasValidJquery()) {
      onjQueryLoad();
    } else {
      if (document.readyState == "complete") {
        onjQueryLoad();
      } else {
        window.onload = onjQueryLoad;
      }
    }
  }

  var espresso = (function () {
    var cappsoolObject = null;
    var currentlyViewedItemIndex = -1;
    var currentTitleTimeout = null;
    var trailerReadyTime = null;


    function getDataFromElem(elem) {
      var k = elem.data("index");
      var vd = cappsoolObject.suggestedApps[k];
      return vd;
    };

    function getIndexFromElem(elem) {
      var k = elem.data("index");
      return k;
    };

    function build(cappsoolObj, element, data) {
      cappsoolObject = cappsoolObj;
      if (data.slides.length == 0) {
        // don't display widget if there is no data
        return;
      }
      $(element).append('<div class="cs-close-btn espresso-wrapper" id="cs-close-btn"></div><div class="widget-head ' + (activeWidgetSubType || '') + '"><span>Recommended apps for you</span></div><div class="swiper-container"><div class="BGimage"><div class="back-slide"><img src="#" alt=""/><div class="animated-jpg"></div><div class="ribbon"><span class="ribbon-text"></span></div></div></div><div class="cs-arrow left"></div><div class="cs-arrow right"></div><div class="top-title widget-title">Title</div><div class="widget-cta"><button>Install Now</button></div><div class="top-title widget-description">Description</div><div class="swiper-wrapper"></div></div>');

      // Set the logo behavior
      cappsoolObject.commonWidget.setLogoBehavior($(element).find('.espresso-wrapper .widget-head'));

      $('#cs-close-btn').click(function () {
        $(element).addClass("hide");
      });
      $.each(data.slides, function (k, v) {
        //v = JSON.parse(JSON.stringify(v));
        var starRatingStr = '';
        if (v.appRating > 0) {
          for (var sr = 1; sr <= 5; sr++) {
            if (sr > Math.ceil(v.appRating)) {
              starRatingStr = starRatingStr + '<span class="rating-star ghost">&nbsp;</span>';
            } else if (sr <= Math.floor(v.appRating)) {
              starRatingStr = starRatingStr + '<span class="rating-star">&nbsp;</span>';
            } else {
              starRatingStr = starRatingStr + '<span class="rating-star half">&nbsp;</span>';
            }
          }
        }
        starRatingStr = '<div>' + starRatingStr + '</div>';
        $(element).find('.swiper-wrapper').append('<div class="swiper-slide" '
        + '" data-index="' + k
        + '" data-url="' + v.storeUrl
        + '"><img src="' + v.smallIconUrl + '" alt=""/><div class="cs-icon-subtitle">' + starRatingStr + '</div><div class="nav"></div></div>');
        //$([v.bg_url]).preload();
      });
      var mySwiper = new Swiper('.swiper-container', {
        centeredSlides: true,
        slidesPerView: 4,
        watchActiveIndex: true,
        grabCursor: true,
        loop: true,
        loopAdditionalSlides: 2,
        loopedSlides: 999,
        onFirstInit: function (e) {
          var elem = $(element).find('.swiper-wrapper .swiper-slide').eq(e.activeIndex);
          var index = getIndexFromElem(elem)
          changeBgImage(element, index);
        },
        onTouchEnd: function (e) {

          var leftSlied = e.touches.diff > 50;
          var rightSlied = e.touches.diff < -50;
          var eve;
          if (leftSlied)
            eve = eventTypes.widgetSwipeLeft;
          else if (rightSlied)
            eve = eventTypes.widgetSwipeRight;

          var elem = $(mySwiper.activeSlide());
          var index = getIndexFromElem(elem);
          var data = getDataFromElem(elem);

          changeBgImage(element, index);
          if (eve) {
            cappsoolObject.logEvent(data, eve, null,null);
          }
        }
      });
      $(element).find('.cs-arrow.left').click(function (e) {
        mySwiper.swipeNext();
        var elem = $(mySwiper.activeSlide());
        var data = getDataFromElem(elem);
        var index = getIndexFromElem(elem)
        changeBgImage(element, index);
        cappsoolObject.logEvent(data, eventTypes.widgetSwipeLeft, null, null);

      });
      $(element).find('.cs-arrow.right').click(function (e) {
        mySwiper.swipePrev();
        var elem = $(mySwiper.activeSlide());
        var data = getDataFromElem(elem);
        var index = getIndexFromElem(elem)
        changeBgImage(element, index);
        cappsoolObject.logEvent(data, eventTypes.widgetSwipeRight, null, null);
      });
      $(element).find('.swiper-slide img').click(function (e) {
        var elem = $(this).parent();
        var data = getDataFromElem(elem);

        cappsoolObject.logEvent(data, eventTypes.appWidgetClick, null, null);
        window.open($(this).parent().data('url'), '_top');
      });
      $(element).find('.swiper-wrapper').click(function (e) {
        if ($(e.target).hasClass('swiper-wrapper')) {
          var elem = $(element).find('.swiper-slide-active');
          var data = getDataFromElem(elem);

          var eventTypeStr = eventTypes.appWidgetClick;
          var ctaButton = $(element).find('.widget-cta button');
          if (ctaButton && ctaButton.length > 0 && ctaButton.is(':visible')) {
            var r = ctaButton[0].getBoundingClientRect();
            if (e.clientX >= r.left && e.clientX < r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
              eventTypeStr = eventTypes.appWidgetClick;
            }
          }
          var url = $(element).find('.swiper-slide-active').data('url');
          cappsoolObject.logEvent(data, eventTypeStr, null, url);
          window.open(url, '_top');

        }
      });
    };

    function completeTrailerAnimationRound(round) {
      startTrailer();
    }

    function trailerLoaded(index) {
      if (index == currentlyViewedItemIndex) {
        startTrailer();
      }
    }

    function widgetInViewport() {
      startTrailer();
    }

    function startTrailer() {
      if (!cappsoolObject.jpegAnimation.onCompleteRound) {
        cappsoolObject.jpegAnimation.onCompleteRound = completeTrailerAnimationRound;
      }
      var element = cappsoolWidgetElement();
      var item = cappsoolObject.loadedItems[currentlyViewedItemIndex];
      var imgParent = $(element).find('.BGimage .back-slide');
      var imgElem = $(element).find('.BGimage .back-slide img');
      var jpgElem = $(element).find('.BGimage .back-slide .animated-jpg');

      var readyTimePassed = false;
      if (cappsoolObject.widgetConfig.showCta) {
        if (cappsoolObject.isCurrentlyInViewport() && cappsoolObject.jpegAnimation.playRound <= 0 && trailerReadyTime === null && !cappsoolObject.jpegAnimation.isPlaying) {
          trailerReadyTime = new Date();
          setTimeout(function () {
            startTrailer();
          }, 1000);
        }
        if (trailerReadyTime) {
          var now = new Date();
          if ((now - trailerReadyTime) >= 990) {
            readyTimePassed = true;
            trailerReadyTime = null;
          }
        }
        if (cappsoolObject.jpegAnimation.isPlaying) {
          readyTimePassed = true;
        }
      } else {
        $('.widget-cta').hide();
      }
      if (item.trailerLoaded && cappsoolObject.isCurrentlyInViewport() && (!cappsoolObject.widgetConfig.showCta || cappsoolObject.jpegAnimation.playRound <= 0 && readyTimePassed)) {
        cappsoolObject.logEvent(item.data, eventTypes.appMovieStart, null, null);
        if (cappsoolObject.widgetConfig.showCta) {
          $('.widget-cta').fadeOut('fast');
        }
        imgParent.removeClass('cappsool-loading');
        imgParent[0].style.backgroundImage = 0;
        imgParent[0].style.backgroundSize = 0;
        if (item.isJpgAnimation) {
          jpgElem.removeClass('hide');
          imgElem.addClass('hide');
          cappsoolObject.jpegAnimation.start(item.videoDetails, jpgElem[0], item.trailer);
        } else {
          imgElem.attr('src', item.trailer.src);
          jpgElem.addClass('hide');
          imgElem.removeClass('hide');
        }
        startTitleAnim(item.data);
      } else {
        cappsoolObject.jpegAnimation.stop();
        jpgElem.addClass('hide');
        imgParent.addClass('cappsool-loading');
        setCoverImage(item.data, imgParent[0]);
        stopTitleTimeOut();
        $('.widget-title').fadeIn('fast');
        if (cappsoolObject.widgetConfig.showCta) {
          $('.widget-cta').show();
        }
        $('.widget-description').hide();
      }
    };


    function setCoverImage(data, elem) {
      if (data.coverImageUrl) {
        elem.style.backgroundImage = "url('" + data.coverImageUrl + "')";
        elem.style.backgroundSize = "100%";
        elem.style.backgroundRepeat = "no-repeat";
      } else {
        elem.style.backgroundImage = "url('" + data.smallIconUrl + "')";
        elem.style.backgroundSize = "56px 56px";
        elem.style.backgroundRepeat = "repeat";
      }
    };

    function changeBgImage(element, index) {
      if (index === undefined || index < 0 || index >= loadedItems.length) {
        return;
      }
      var currentIndexChanged = (currentlyViewedItemIndex != index);
      currentlyViewedItemIndex = index;
      var imgParent = $(element).find('.BGimage .back-slide');
      var imgElem = $(element).find('.BGimage .back-slide img');
      var jpgElem = $(element).find('.BGimage .back-slide .animated-jpg');
      var item = cappsoolObject.loadedItems[index];

      setOverlayElements(element, item.data);

      cappsoolObject.jpegAnimation.stop();
      jpgElem.addClass('hide');
      imgParent.addClass('cappsool-loading');
      setCoverImage(item.data, imgParent[0]);


      if (item.urlToLoad && item.urlToLoad.length > 0) {
        if (currentIndexChanged) {
          cappsoolObject.jpegAnimation.stop();
          jpgElem.addClass('hide');
          imgParent.addClass('cappsool-loading');
          setCoverImage(item.data, imgParent[0]);
          imgElem.attr('src', '');

          if (!item.trailerLoaded) {
            item.trailer = new Image();
            item.trailer.src = item.urlToLoad;
            item.trailer.onload = function () {
              item.trailerLoaded = true;
              trailerLoaded(item.index);
            };
          }

        }
      }

      startTrailer();

    }



    function stopTitleTimeOut() {
      if (currentTitleTimeout) {
        clearTimeout(currentTitleTimeout);
        currentTitleTimeout = null;
      }
    };

    function setOverlayElements(element, data) {
      stopTitleTimeOut();
      var shortName = (data.shortName ? data.shortName : data.name);
      var titleElem = $(element).find('.widget-title');
      if (titleElem && titleElem.length > 0) {
        titleElem[0].innerHTML = shortName;
        titleElem.fadeIn('fast');
      }
      var descElem = $(element).find('.widget-description');
      if (descElem && descElem.length > 0) {
        descElem[0].innerHTML = (data.appDescription ? data.appDescription : '');
        descElem.fadeOut('fast');
      }

      var ribbonElem = $(element).find('.ribbon');
      var ribbonTextElem = $(element).find('.ribbon-text');
      if (ribbonElem.length > 0 && ribbonTextElem.length > 0) {
        for (var i = 0; i < 3; i++) {
          ribbonElem.removeClass('col' + i);
        }
        if (data.ribbonText !== undefined && data.ribbonColor !== undefined && data.ribbonText.length > 0) {
          ribbonElem.addClass('col' + data.ribbonColor);

          ribbonTextElem[0].innerHTML = data.ribbonText;
        } else {
          ribbonTextElem[0].innerHTML = '';
        }
      }
    };

    function startTitleAnim(data) {
      stopTitleTimeOut();
      var shortName = (data.shortName ? data.shortName : data.name);
      currentTitleTimeout = setTimeout(function () {
        var wt = $('.widget-title');
        var wd = $('.widget-description');
        if (wt[0].innerHTML == shortName) {
          wt.fadeOut('fast');
          wd.fadeIn('fast');

          currentTitleTimeout = setTimeout(function () {
            var wt = $('.widget-title');
            var wd = $('.widget-description');
            if (wt[0].innerHTML == shortName) {
              wd.fadeOut('fast');
            }
          }, 4000); // <-- time in milliseconds
        }
      }, 4000); // <-- time in milliseconds

    };

    return {
      build: build,
      widgetInViewport : widgetInViewport
    };
  })();

  var frappe = (function () {
    var cappsoolObject = null;
    var currentSlide = 0;

    function build(cappsoolObj, element, data) {
      cappsoolObject = cappsoolObj;
      if (data.slides.length == 0) {
        // don't display widget if there is no data
        return;
      }
      cappsoolObject.commonWidget.setRootSelector('.frappe-slider');

      var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

      $(element).append('<div class="frappe-wrapper ' + (activeWidgetSubType || '') + '"><div class="title ' + (activeWidgetSubType || '') + '"> <p></p> <div class="logo widget-head"></div></div> <div class="frappe-slider"></div> </div>');

      // Set the logo behavior
      cappsoolObject.commonWidget.setLogoBehavior($(element).find('.frappe-wrapper .logo'));

      $.each(data.slides, function (k, v) {
        var starRatingStr = '';
        if (v.appRating > 0) {
          for (var sr = 1; sr <= 5; sr++) {
            if (sr > Math.ceil(v.appRating)) {
              starRatingStr = starRatingStr + '<span class="rating-star ghost">&nbsp;</span>';
            } else if (sr <= Math.floor(v.appRating)) {
              starRatingStr = starRatingStr + '<span class="rating-star">&nbsp;</span>';
            } else {
              starRatingStr = starRatingStr + '<span class="rating-star half">&nbsp;</span>';
            }
          }
        }
        starRatingStr = '<div>' + starRatingStr + '</div>';

        var users = '';
        var usersToShow = '';
        if (v.appDownloads) {
          var sign = v.appDownloads.slice(-1);
          if (sign === 'K') {
            users = v.appDownloads.substr(0, v.appDownloads.length - 1) * 1000;
            usersToShow = v.appDownloads.substr(0, v.appDownloads.length - 1) + ',000';
          } else if (sign === 'M') {
            users = v.appDownloads.substr(0, v.appDownloads.length - 1) * 1000000;
            usersToShow = v.appDownloads.substr(0, v.appDownloads.length - 1) + ',000,000';
          } else {
            users = v.appDownloads;
            usersToShow = users;
          }
        }

        var overlayStr;
        if (activeWidgetSubType && activeWidgetSubType.indexOf('thumbs') > -1) {
          overlayStr = ' <div class="video-overlay"><div class="question"></div><div class="thumb-wrapper up"><div class="thumb-up"></div></div><p class="thumb-text up"></p><div class="thumb-wrapper down"><div class="thumb-down"></div></div><p class="thumb-text down"></p></div>';
        } else {
          overlayStr = ' <div class="video-overlay"><div class="install"><span class="img"></span><span class="text ' + ((users && users>50000)?'with-users':'') + '">Install Now</span></div>' + (users?(users > 50000?('<span class="users">' + usersToShow + ' users</span>'):''):'') + '<div class="replay"><span class="img"></span><span class="text">Replay Video</span></div></div>';
        }

        var coverLoading = '<div class="cover loading"><div class="cover loading-g"><div class="blockG_1 loading-block-g"> </div> <div class="blockG_2 loading-block-g"></div><div class="blockG_3 loading-block-g"></div> </div></div>';
        var suggestSlide =  '<div> ' +
          '<div class="suggest ' + (activeWidgetSubType || '') + '" num="'+k+'" align="center"> ' +
            '<div class="video" num="'+k+'">'+coverLoading+'<div class="cover"></div><div class="jpg-animation"></div>' + overlayStr + '<div class="ribbon"><span class="ribbon-text"></span></div></div>' +
            '<div class="details" align="left"> ' +
              '<div class="app-image"><img src="' + v.smallIconUrl + '" alt=""/></div> ' +
              '<p class="app-name">' + v.shortName + '</p>' +
              '<p class="app-category">' + v.category + '</p>' +
              '<p class="app-description">' + (v.appDescription? cappsoolObject.commonWidget.emojifier(v.appDescription): v.name.substring(0, 35)) + '</p>' +
              '<div class="app-rating">' + starRatingStr + '</div>' +
              '<a class="install-button '+ (v.platform==='ios'? 'ios-button':'android-button') +'"><span>'+ (v.platform==='ios'? 'GET':'Install') +'</span></a> ' +
              //'<iframe name="cappsool-share-iframe" class="cappsool-share" src="' + globalStaticFilesRoot + 'scripts/share.html?campaignId=' + v.campaignId+ '&server=' + globalCappsoolHost + '"></iframe>' +
            '</div> ' +
          '</div> ' +
        '</div> ';

        var clicked;

        $(element).find('.frappe-slider').append(suggestSlide);

        // Resize description font when overflows
        var descriptionElement = $(element).find('.frappe-slider .suggest[num="'+k+'"] .app-description');
        var buttonElement = $(element).find('.frappe-slider .suggest[num="'+k+'"] .install-button');
        var maxWidth = ((windowWidth < 350 || windowWidth > 600)?'56%':'62%');
        if(descriptionElement[0].getBoundingClientRect().right > (buttonElement[0].getBoundingClientRect().left - ((windowWidth < 600)?(windowWidth/5):150))) {
          if(descriptionElement[0].getBoundingClientRect().right > (buttonElement[0].getBoundingClientRect().left - ((windowWidth < 600)?(windowWidth/7):100))) {
            descriptionElement.css({'max-width': maxWidth});
            descriptionElement.addClass("very-small-text");
          } else {
            descriptionElement.css({'max-width': maxWidth});
            descriptionElement.addClass("small-text");
          }
        }
        $(element).find('.frappe-slider .suggest[num="'+k+'"] .install-button').click(function () {
          clicked= true;
          cappsoolObject.commonWidget.openStore(k, eventTypes.appWidgetClick, v.storeUrl, v.storeUrlTarget);
        });

        var replayed;

        $(element).find('.frappe-slider .video[num="'+k+'"] .video-overlay').click(function () {
          if (!replayed && !clicked) {
            clicked= true;
            cappsoolObject.commonWidget.openStore(k, eventTypes.appWidgetClick, v.storeUrl, v.storeUrlTarget);
          }
          replayed = false;
        });

        if (activeWidgetSubType && activeWidgetSubType.indexOf('thumbs') > -1) {
          $(element).find('.frappe-slider .video[num="'+k+'"] .video-overlay .thumb-down').click(function () {
            var item = cappsoolObject.loadedItems[k];
            $('.frappe-slider').slick('slickNext');
            clicked= true;
          });
        } else {
          $(element).find('.frappe-slider .video[num="'+k+'"] .video-overlay .replay').click(function () {
            var item = cappsoolObject.loadedItems[k];
            cappsoolObject.commonWidget.replayVideo(item);
            cappsoolObject.logEvent(item.data, eventTypes.replayVideoClick, null, null);
            replayed=true;
            clicked= true;
          });
        }

        $(element).find('.frappe-slider .suggest[num="'+k+'"]').click(function () {
          if (!clicked) {
            cappsoolObject.commonWidget.openStore(k, eventTypes.appWidgetClick, v.storeUrl, v.storeUrlTarget);
          }
          clicked= false;
        });

        $(element).find('.frappe-slider .video[num="'+k+'"] .video-overlay').hide();

        var ribbonElem = $(element).find('.frappe-slider .video[num="'+k+'"] .ribbon');
        var ribbonTextElem = $(element).find('.frappe-slider .video[num="'+k+'"] .ribbon-text');
        if (ribbonElem.length > 0 && ribbonTextElem.length > 0) {
          for (var i = 0; i < 3; i++) {
            ribbonElem.removeClass('col' + i);
          }
          if (v.ribbonText !== undefined && v.ribbonColor !== undefined && v.ribbonText.length > 0) {
            ribbonElem.addClass('col' + v.ribbonColor);

            ribbonTextElem[0].innerHTML = v.ribbonText;
          } else {
            ribbonTextElem[0].innerHTML = '';
            ribbonElem.removeClass('ribbon');
          }
        }

      });

      // Load slick carousel scripts

      var centerPadding;
      var swipe = true;
      if (activeWidgetSubType && activeWidgetSubType.indexOf("dailyapp") > -1) {
        centerPadding = '0px';
        swipe = false;
      } else {
        centerPadding = (windowWidth < 360 ? '30px' : (windowWidth < 370 ? '35px' : (windowWidth > 600 ? '70px' : '40px')));
      }

      $('.frappe-slider').slick({
        centerMode: true,
        centerPadding: centerPadding,
        slidesToShow: 1,
        autoplay: false,
        autoplaySpeed:4000,
        speed: 150,
        arrows: false,
        infinite: true,
        swipe: swipe
      });

      window.addEventListener('orientationchange', function() {
        // Fix the slick after UI changes caused by changing orientation
        setTimeout(function() { $('.frappe-slider').slick('setPosition') }, 50);
      });

      currentSlide = 0;
      cappsoolObject.commonWidget.setCurrentSlide(currentSlide);

      var afterTimeOut;

      var onAfterSlideChanges = function(currentSlide) {
        if (!cappsoolObject.loadedItems[currentSlide].fullPlayed) {
          cappsoolObject.commonWidget.startTrailer(0);
        } else {
          cappsoolObject.commonWidget.replayVideo(cappsoolObject.loadedItems[currentSlide]);
        }
      };

      var onBeforeSlideChanges = function() {
          // Pause trailer
          cappsoolObject.commonWidget.startTrailer(-1);
      };

      $('.frappe-slider').on('beforeChange', function(event, slick, curSlide){
        if (cappsoolObject.jpegAnimation.isPlaying ) {
          //beforeTimeOut = setTimeout(function() {onBeforeSlideChanges()}, 0);
          onBeforeSlideChanges();
        }
      });

      $('.frappe-slider').on('afterChange', function(event, slick, curSlide){

        clearTimeout(afterTimeOut);

        if (curSlide !== currentSlide) {
          // Left right events
          var item = cappsoolObject.loadedItems[curSlide];
          if (((curSlide > currentSlide) && !(currentSlide === 0 && curSlide === data.slides.length - 1)) || (curSlide === 0 && currentSlide === data.slides.length - 1)) {
            cappsoolObject.logEvent(item.data, eventTypes.widgetSwipeRight, null, null);
          } else {
            cappsoolObject.logEvent(item.data, eventTypes.widgetSwipeLeft, null, null);
          }

          currentSlide = curSlide;//$('.bombon-slider').slick('slickCurrentSlide');
          cappsoolObject.commonWidget.setCurrentSlide(currentSlide);
        }

        // 1500 ms - Shorter time may give less performance on weak devices
        afterTimeOut = setTimeout(function() {onAfterSlideChanges(currentSlide)}, 1500);
      });

      // Must be put after slick loads
      cappsoolObject.commonWidget.setPromo(element, 4000);
    };


    function widgetInViewport() {
      cappsoolObject.commonWidget.widgetInViewportChanged();
    };

    return {
      build: build,
      widgetInViewport : widgetInViewport
    };
  })();


  var bombon = (function () {
    var cappsoolObject = null;
    var currentSlide = 0;

    function build(cappsoolObj, element, data) {
      cappsoolObject = cappsoolObj;
      if (data.slides.length == 0) {
        // don't display widget if there is no data
        return;
      }
      cappsoolObject.commonWidget.setRootSelector('.bombon-slider', '.slick-center');


      var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

      $(element).append('<div class="bombon-wrapper ' + (activeWidgetSubType || '') + '"><div class="title ' + (activeWidgetSubType || '') + '">  <div class="logo widget-head"></div></div> <div class="bombon-slider"></div> </div>');

      // Set the logo behavior
      cappsoolObject.commonWidget.setLogoBehavior($(element).find('.bombon-wrapper .logo'));

      $.each(data.slides, function (k, v) {
        var starRatingStr = '';
        if (v.appRating > 0) {
          for (var sr = 1; sr <= 5; sr++) {
            if (sr > Math.ceil(v.appRating)) {
              starRatingStr = starRatingStr + '<span class="rating-star ghost">&nbsp;</span>';
            } else if (sr <= Math.floor(v.appRating)) {
              starRatingStr = starRatingStr + '<span class="rating-star">&nbsp;</span>';
            } else {
              starRatingStr = starRatingStr + '<span class="rating-star half">&nbsp;</span>';
            }
          }
        }
        starRatingStr = '<div>' + starRatingStr + '</div>';

        var users = '';
        var usersToShow = '';
        if (v.appDownloads) {
          var sign = v.appDownloads.slice(-1);
          if (sign === 'K') {
            users = v.appDownloads.substr(0, v.appDownloads.length - 1) * 1000;
            usersToShow = v.appDownloads.substr(0, v.appDownloads.length - 1) + ',000';
          } else if (sign === 'M') {
            users = v.appDownloads.substr(0, v.appDownloads.length - 1) * 1000000;
            usersToShow = v.appDownloads.substr(0, v.appDownloads.length - 1) + ',000,000';
          } else {
            users = v.appDownloads;
            usersToShow = users;
          }
        }

        var overlayStr;
        if (activeWidgetSubType && activeWidgetSubType.indexOf('thumbs') > -1) {
          overlayStr = ' <div class="video-overlay"><div class="question"></div><div class="thumb-wrapper up"><div class="thumb-up"></div></div><p class="thumb-text up"></p><div class="thumb-wrapper down"><div class="thumb-down"></div></div><p class="thumb-text down"></p></div>';
        } else {
          overlayStr = ' <div class="video-overlay"><div class="install"><span class="img"></span><span class="text ' + ((users && users>50000)?'with-users':'') + '">Install Now</span></div>' + (users?(users > 50000?('<span class="users">' + usersToShow + ' users</span>'):''):'') + '<div class="replay"><span class="img"></span><span class="text">Replay Video</span></div></div>';
        }

        var coverLoading = '<div class="cover loading"><div class="cover loading-g"><div class="blockG_1 loading-block-g"> </div> <div class="blockG_2 loading-block-g"></div><div class="blockG_3 loading-block-g"></div> </div></div>';
        var suggestSlide =  '<div> ' +
            '<div class="suggest ' + (activeWidgetSubType || '') + '" num="'+k+'" align="center"> ' +
              '<div class="upper-details" align="left"> ' +
                '<div class="app-image"><img src="' + v.smallIconUrl + '" alt=""/></div> ' +
                '<p class="app-name">' + v.shortName + '</p>' +
                '<p class="app-category">' + v.category + '</p>' +
                (v.bestGrossing?'<div class="app-stamp"></div>':'') +
                '<p class="app-description">' + (v.appStory?cappsoolObject.commonWidget.emojifier(v.appStory): '') + '</p>' +
                '<div class="cappsool-share"></div>' +
              '</div>' +
              '<div class="video" num="'+k+'">'+ coverLoading +'<div class="cover"></div><div class="jpg-animation"></div>' + overlayStr + '<div class="ribbon"><span class="ribbon-text"></span></div></div>' +
              '<div class="details" align="left"> ' +
                '<p class="app-call-to-action">' + (v.appDescription?cappsoolObject.commonWidget.emojifier(v.appDescription): v.name.substring(0, 35)) + '</p>' +
                ((users && users > 50000)?('<span class="app-users">' + usersToShow + ' users</span>'):'<div class="app-rating">' + starRatingStr + '</div>') +
                '<a class="install-button '+ (v.platform==='ios'? 'ios-button':'android-button') +'"><span>'+ (v.platform==='ios'? 'Install':'Install') +'</span></a> ' +
              '</div> ' +
            '</div> ' +
          '</div> ';

        var clicked;

        $(element).find('.bombon-slider').append(suggestSlide);

        // Resize description font when overflows
        var descriptionElement = $(element).find('.bombon-slider .suggest[num="'+k+'"] .app-description');
        var buttonElement = $(element).find('.bombon-slider .suggest[num="'+k+'"] .install-button');
        var maxWidth = ((windowWidth < 350 || windowWidth > 600)?'56%':'62%');
        if(descriptionElement[0].getBoundingClientRect().right > (buttonElement[0].getBoundingClientRect().left - ((windowWidth < 600)?(windowWidth/5):150))) {
          if(descriptionElement[0].getBoundingClientRect().right > (buttonElement[0].getBoundingClientRect().left - ((windowWidth < 600)?(windowWidth/7):100))) {
            //descriptionElement.css({'max-width': maxWidth});
            //descriptionElement.addClass("very-small-text");
          } else {
           // descriptionElement.css({'max-width': maxWidth});
           // descriptionElement.addClass("small-text");
          }
        }

        // Set width of first and last slides
        $(element).find('.bombon-slider .suggest[num="0"]').addClass('first-suggest');
        $(element).find('.bombon-slider .suggest[num="' + (data.slides.length - 1) + '"]').addClass('last-suggest');

        $(element).find('.bombon-slider .suggest[num="'+k+'"] .install-button').click(function () {
          clicked= true;
          cappsoolObject.commonWidget.openStore(k, eventTypes.appWidgetClick, v.storeUrl, v.storeUrlTarget);
        });

        shareSubitem.addShareButtons($(element).find('.bombon-slider .suggest[num="'+k+'"] .cappsool-share'), v.campaignId, cappsoolObject.loadedItems[k]);

        var replayed;

        $(element).find('.bombon-slider .video[num="'+k+'"] .video-overlay').click(function () {
          if (!replayed && !clicked) {
            clicked= true;
            cappsoolObject.commonWidget.openStore(k, eventTypes.appWidgetClick, v.storeUrl, v.storeUrlTarget);
          }
          replayed = false;
        });

        if (activeWidgetSubType && activeWidgetSubType.indexOf('thumbs') > -1) {
          $(element).find('.bombon-slider .video[num="'+k+'"] .video-overlay .thumb-down').click(function () {
            var item = cappsoolObject.loadedItems[k];
            $('.bombon-slider').slick('slickNext');
            clicked= true;
          });
        } else {
          $(element).find('.bombon-slider .video[num="'+k+'"] .video-overlay .replay').click(function () {
            var item = cappsoolObject.loadedItems[k];
            cappsoolObject.commonWidget.replayVideo(item);
            cappsoolObject.logEvent(item.data, eventTypes.replayVideoClick, null, null);
            replayed=true;
            clicked= true;
          });
        }

        $(element).find('.bombon-slider .suggest[num="'+k+'"]').click(function () {
          if (!clicked) {
            cappsoolObject.commonWidget.openStore(k, eventTypes.appWidgetClick, v.storeUrl, v.storeUrlTarget);
          }
          clicked= false;
        });

        $(element).find('.bombon-slider .video[num="'+k+'"] .video-overlay').hide();

        var ribbonElem = $(element).find('.bombon-slider .video[num="'+k+'"] .ribbon');
        var ribbonTextElem = $(element).find('.bombon-slider .video[num="'+k+'"] .ribbon-text');
        if (ribbonElem.length > 0 && ribbonTextElem.length > 0) {
          for (var i = 0; i < 3; i++) {
            ribbonElem.removeClass('col' + i);
          }
          if (v.ribbonText !== undefined && v.ribbonColor !== undefined && v.ribbonText.length > 0) {
            ribbonElem.addClass('col' + v.ribbonColor);

            ribbonTextElem[0].innerHTML = v.ribbonText;
          } else {
            ribbonTextElem[0].innerHTML = '';
            ribbonElem.removeClass('ribbon');
          }
        }

      });

      // Load slick carousel scripts

      var centerPadding;
      var swipe = true;
      if (activeWidgetSubType && activeWidgetSubType.indexOf("dailyapp") > -1) {
        centerPadding = '0px';
        swipe = false;
      } else {
        centerPadding = (windowWidth < 360 ? '19px' : (windowWidth < 370 ? '21px' : (windowWidth > 600 ? '38px' : '22px')));
      }

      $('.bombon-slider').slick({
        centerMode: true,
        centerPadding: centerPadding,
        slidesToShow: 1,
        autoplay: false,
        autoplaySpeed:4000,
        speed: 150,
        arrows: false,
        infinite: false,
        swipe: swipe
      });

      // Must be put after slick loads
      cappsoolObject.commonWidget.setPromo(element, 4000);

      window.addEventListener('orientationchange', function() {
        // Fix the slick after UI changes caused by changing orientation
        setTimeout(function() { $('.bombon-slider').slick('setPosition') }, 50);
      });

      currentSlide = 0;
      cappsoolObject.commonWidget.setCurrentSlide(currentSlide);

      var afterTimeOut;

      var onAfterSlideChanges = function(currentSlide) {
        if (!cappsoolObject.loadedItems[currentSlide].fullPlayed) {
          cappsoolObject.commonWidget.startTrailer(0);
        } else {
          cappsoolObject.commonWidget.replayVideo(cappsoolObject.loadedItems[currentSlide]);
        }
      };

      var onBeforeSlideChanges = function() {
          // Pause trailer
          cappsoolObject.commonWidget.startTrailer(-1);
      };

      $('.bombon-slider').on('beforeChange', function(event, slick, curSlide){
        if (cappsoolObject.jpegAnimation.isPlaying ) {
          //beforeTimeOut = setTimeout(function() {onBeforeSlideChanges()}, 500);
          onBeforeSlideChanges();
        }
      });

      $('.bombon-slider').on('afterChange', function(event, slick, curSlide){

        clearTimeout(afterTimeOut);

        if (curSlide !== currentSlide) {
          // Left right events
          var item = cappsoolObject.loadedItems[curSlide];
          if (((curSlide > currentSlide) && !(currentSlide === 0 && curSlide === data.slides.length - 1)) || (curSlide === 0 && currentSlide === data.slides.length - 1)) {
            cappsoolObject.logEvent(item.data, eventTypes.widgetSwipeRight, null, null);
          } else {
            cappsoolObject.logEvent(item.data, eventTypes.widgetSwipeLeft ,null, null);
          }

          currentSlide = curSlide;//$('.bombon-slider').slick('slickCurrentSlide');
          cappsoolObject.commonWidget.setCurrentSlide(currentSlide);
        }

        // 1500 ms - Shorter time may give less performance on weak devices
        afterTimeOut = setTimeout(function() {onAfterSlideChanges(currentSlide)}, 1500);
      });
    };

    function widgetInViewport() {
      cappsoolObject.commonWidget.widgetInViewportChanged();
    };

    return {
      build: build,
      widgetInViewport : widgetInViewport
    };
  })();

  var korto = (function () {
    var cappsoolObject = null;

    function build(cappsoolObj, element, data) {
      cappsoolObject = cappsoolObj;
      if (data.slides.length == 0) {
        // don't display widget if there is no data
        return;
      }

      var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

      $(element).append('<div class="korto-wrapper ' + (activeWidgetSubType || '') + '"><div class="title ' + (activeWidgetSubType || '') + '"> <p></p> <div class="logo widget-head"></div></div> </div>');

      // Set the logo behavior
      cappsoolObject.commonWidget.setLogoBehavior($(element).find('.korto-wrapper .logo'));
      cappsoolObject.commonWidget.setShouldLoadVideo(false);
      cappsoolObject.commonWidget.setCurrentSlide(0);

      var suggests = {};
      var currentSuggest;

      $.each(data.slides, function (k, v) {

        var starRatingStr = '';
        if (v.appRating > 0) {
          for (var sr = 1; sr <= 5; sr++) {
            if (sr > Math.ceil(v.appRating)) {
              starRatingStr = starRatingStr + '<span class="rating-star ghost">&nbsp;</span>';
            } else if (sr <= Math.floor(v.appRating)) {
              starRatingStr = starRatingStr + '<span class="rating-star">&nbsp;</span>';
            } else {
              starRatingStr = starRatingStr + '<span class="rating-star half">&nbsp;</span>';
            }
          }
        }
        starRatingStr = '<div>' + starRatingStr + '</div>';

        var suggestSlide =  '<div> ' +
          '<div class="suggest ' + (activeWidgetSubType || '') + '" align="center"> ' +
          '<div class="details" align="left"> ' +
          '<div class="app-image"><img src="' + v.smallIconUrl + '" alt=""/></div> ' +
          '<p class="app-name">' + v.shortName + '</p>' +
          '<div class="app-rating">' + starRatingStr + '</div>' +
          '<p class="app-category">' + v.category + '</p>' +
          '<p class="app-description">' + (v.appDescription ? cappsoolObject.commonWidget.emojifier(v.appDescription): v.name.substring(0, 35)) + '</p>' +
          '<div class="change-btn">&times</div>' +
          '<a class="install-button '+ (v.platform==='ios'? 'ios-button':'android-button') +'"><span>'+ (v.platform==='ios'? 'GET':'Install') +'</span></a> ' +
          '</div> ' +
          '</div> ' +
          '</div> ';

        suggests[k] = {suggest: suggestSlide, slide: v};

      });

      var clicked = 0;

      var loadApp = function() {
        cappsoolObject.commonWidget.setCurrentSlide(currentSuggest);

        // Resize description font when overflows
        var descriptionElement = $(element).find('.korto-wrapper .suggest .app-description');
        var buttonElement = $(element).find('.korto-wrapper .suggest .install-button');
        var maxWidth = ((windowWidth < 350 || windowWidth > 600)?'56%':'62%');
        if(descriptionElement[0].getBoundingClientRect().right > (buttonElement[0].getBoundingClientRect().left - ((windowWidth < 600)?(windowWidth/5):150))) {
          if(descriptionElement[0].getBoundingClientRect().right > (buttonElement[0].getBoundingClientRect().left - ((windowWidth < 600)?(windowWidth/7):100))) {
            descriptionElement.css({'max-width': maxWidth});
            descriptionElement.addClass("very-small-text");
          } else {
            descriptionElement.css({'max-width': maxWidth});
            descriptionElement.addClass("small-text");
          }
        }

        $(element).find('.korto-wrapper .suggest .change-btn').click(function () {
          clicked= 1;
          changeApp();
        });
        if (data.slides.length == 1) {
          $(element).find('.korto-wrapper .suggest .change-btn').hide();
        } else {
          $(element).find('.korto-wrapper .suggest .change-btn').show();
        }

        $(element).find('.korto-wrapper .suggest .install-button').click(function () {
          clicked= 1;
          cappsoolObject.commonWidget.openStore(currentSuggest, eventTypes.appWidgetClick, suggests[currentSuggest].slide.storeUrl, suggests[currentSuggest].slide.storeUrlTarget);
        });

        $(element).find('.korto-wrapper .suggest').click(function () {
          if (clicked === 0) {
            cappsoolObject.commonWidget.openStore(currentSuggest, eventTypes.appWidgetClick, suggests[currentSuggest].slide.storeUrl, suggests[currentSuggest].slide.storeUrlTarget);
          } else {
            clicked--;
          }
        });
      };

      currentSuggest = 0;
      $(element).find('.korto-wrapper').append(suggests[currentSuggest].suggest);
      loadApp(currentSuggest);

      // Must be put after append
      cappsoolObject.commonWidget.setPromo(element, 4000);

      function changeApp() {

        var item = cappsoolObject.loadedItems[currentSuggest];
        cappsoolObject.logEvent(item.data, eventTypes.widgetSwipeLeft, null, null);

        currentSuggest ++;
        if (!suggests[currentSuggest]) {
          currentSuggest = 0;
        }

        var itemNew = cappsoolObject.loadedItems[currentSuggest];
        cappsoolObject.logEvent(itemNew.data, eventTypes.appShown, null, null);

        $(element).find('.korto-wrapper').find('.suggest').fadeOut("normal", function() {
          $(this).parent().remove();

          setTimeout(function(){
            clicked = 0;
            $(element).find('.korto-wrapper').append(suggests[currentSuggest].suggest);
            $(element).find('.korto-wrapper .suggest').hide();
            $(element).find('.korto-wrapper .suggest').fadeIn("normal");
            loadApp(currentSuggest);
          }, 100);
        });

      };

    };

    function widgetInViewport() {
      cappsoolObject.commonWidget.widgetInViewportChanged();
    };

    return {
      build: build,
      widgetInViewport: widgetInViewport
    };
  })();

  var linizio = (function () {
    var cappsoolObject = null;
    var wasShown = false;
    var dataSlides = null;

    function build(cappsoolObj, element, data) {
      cappsoolObject = cappsoolObj;
      cappsoolObject.commonWidget.setCurrentSlide(-1);
      cappsoolObject.commonWidget.setReportAllApps(true);
      cappsoolObject.commonWidget.setShouldLoadVideo(false);
      dataSlides = data.slides;
      if (data.slides.length == 0) {
        // don't display widget if there is no data
        return;
      }

      var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

      $(element).append('<div class="linizio-wrapper ' + (activeWidgetSubType || '') + '"><div class="title ' + (activeWidgetSubType || '') + '"> <p></p> <div class="logo widget-head"></div></div><div class="details-wrapper"></div> </div>');

      // Set the logo behavior
      cappsoolObject.commonWidget.setLogoBehavior($(element).find('.linizio-wrapper .logo'));

      var wrapperSize = $(element).find('.linizio-wrapper').css('height').split('px')[0];

      var suggests = {};

      var clicked = false;

      var loadApp = function(currentSuggest) {

        // Resize description font when overflows
        var descriptionElement = $(element).find('.linizio-wrapper .suggest[num="' + currentSuggest + '"] .app-description');
        var buttonElement = $(element).find('.linizio-wrapper .suggest[num="' + currentSuggest + '"] .install-button');
        var maxWidth = ((windowWidth < 350 || windowWidth > 600)?'56%':'62%');
        if(descriptionElement[0].getBoundingClientRect().right > (buttonElement[0].getBoundingClientRect().left - ((windowWidth < 600)?(windowWidth/5):150))) {
          if(descriptionElement[0].getBoundingClientRect().right > (buttonElement[0].getBoundingClientRect().left - ((windowWidth < 600)?(windowWidth/7):100))) {
            descriptionElement.css({'max-width': maxWidth});
            descriptionElement.addClass("very-small-text");
          } else {
            descriptionElement.css({'max-width': maxWidth});
            descriptionElement.addClass("small-text");
          }
        }

        // Set the widget wrapper height
        if (currentSuggest > 0) {
          var suggestHeight = $(element).find('.suggest').css('height').split('px')[0]/1 +
                              $(element).find('.suggest').css('padding-top').split('px')[0]/1 +
                              $(element).find('.suggest').css('padding-bottom').split('px')[0]/1;
          $(element).find('.linizio-wrapper').css('height', (wrapperSize/1 + suggestHeight/1 + 1) + 'px');
          wrapperSize = wrapperSize/1 + suggestHeight/1 + 1;
        }

        $(element).find('.linizio-wrapper .suggest[num="' + currentSuggest + '"] .install-button').click(function () {
          clicked= true;
          cappsoolObject.commonWidget.openStore(currentSuggest, eventTypes.appWidgetClick, suggests[currentSuggest].slide.storeUrl, suggests[currentSuggest].slide.storeUrlTarget);
        });

        $(element).find('.linizio-wrapper .suggest[num="' + currentSuggest + '"]').click(function () {
          if (clicked === false) {
            cappsoolObject.commonWidget.openStore(currentSuggest, eventTypes.appWidgetClick, suggests[currentSuggest].slide.storeUrl, suggests[currentSuggest].slide.storeUrlTarget);
          } else {
            clicked = false;
          }
        });
      };

      $.each(data.slides, function (k, v) {

        var starRatingStr = '';
        if (v.appRating > 0) {
          for (var sr = 1; sr <= 5; sr++) {
            if (sr > Math.ceil(v.appRating)) {
              starRatingStr = starRatingStr + '<span class="rating-star ghost">&nbsp;</span>';
            } else if (sr <= Math.floor(v.appRating)) {
              starRatingStr = starRatingStr + '<span class="rating-star">&nbsp;</span>';
            } else {
              starRatingStr = starRatingStr + '<span class="rating-star half">&nbsp;</span>';
            }
          }
        }
        starRatingStr = '<div>' + starRatingStr + '</div>';

        var suggestSlide =  '<div> ' +
          '<div class="suggest ' + (activeWidgetSubType || '') + '" num="' + k + '" align="center"> ' +
          '<div class="details" align="left"> ' +
          '<div class="app-image"><img src="' + v.smallIconUrl + '" alt=""/></div> ' +
          '<p class="app-name">' + v.shortName + '</p>' +
          '<div class="app-rating">' + starRatingStr + '</div>' +
          '<p class="app-category">' + v.category + '</p>' +
          '<p class="app-description">' + (v.appDescription?cappsoolObject.commonWidget.emojifier(v.appDescription): v.name.substring(0, 35)) + '</p>' +
          '<a class="install-button '+ (v.platform==='ios'? 'ios-button':'android-button') +'"><span>'+ (v.platform==='ios'? 'GET':'Install') +'</span></a> ' +
          '</div> ' +
          '</div> ' +
          '</div> ';

        suggests[k] = {suggest: suggestSlide, slide: v};

        $(element).find('.linizio-wrapper .details-wrapper').append(suggestSlide);
        loadApp(k);
      });

      // Must be put after append
      cappsoolObject.commonWidget.setPromo(element, 4000);

    };

    function widgetInViewport() {
      cappsoolObject.commonWidget.widgetInViewportChanged();
    };

    return {
      build: build,
      widgetInViewport: widgetInViewport
    };
  })();

  function extendWidgetConfig() {
    widgetConfig.showCta = true;
    if (widgetConfig.widgetType == 'Default') {
      widgetConfig.showCta = true;
    } else if (widgetConfig.widgetType == 'Default-No-Cta') {
      widgetConfig.showCta = false;
    }
  }

  function cappsoolWidgetElement () {
    var elemArr = $('.cappsool-widget');
    if (elemArr === undefined || elemArr === null || elemArr.length == 0) {
      return null;
    }
    var elem = elemArr[0];
    return elem;
  }

  function waitForCappsoolElement(interval, times, integrationKey, host, callback) {
    var elem = cappsoolWidgetElement();
    if (elem == null) {
      if (times <= 0) {
        return callback(integrationKey, host);
      }
      setTimeout(function(){
        waitForCappsoolElement(interval, times-1, integrationKey, host, callback);
      }, interval);
    } else {
      return callback(integrationKey, host);
    }
  }

  function extractData() {
    var result = {};
    var subject = null;

    if (!subject){
      subject = $('meta[property="article:section"]').attr('content');
    }
    if (!subject){
      subject =  $('meta[property="ob:section"]').attr("content");
    }

    if (!subject) {
      subject = $('#dcPath2').attr('value'); // try to get dcpath subject
    }
    if (!subject) {
      var allScripts = $('script');
      for (var i = 0; i < allScripts.length; i++) {
        var text = allScripts[i].innerText;
        if (text && text.length > 0) {
          var res = text.match(/dcPath2 = '(.*?)';/);
          if (!res) {
            res = text.match(/dcPath = '(.*?)';/);
          }
          if (res && res.length > 1) {
            subject = res[1];
            break;
          }
        }
      }
    }

    if (!subject){
      bodyClass = $('body').attr('class');
      var searchStr = 'color-alt-';
      if (bodyClass && bodyClass.indexOf(searchStr) == 0) {
        subject = bodyClass.substr(searchStr.length, bodyClass.length);
      }
    }
    if (subject) {
      result.subject = subject;
    }

    var keywords = [];
    if (!keywords || keywords.length == 0) {
      var attr = $('meta[name="news_keywords"]').attr('content');
      if (attr) {
        keywords = attr.split(',');
      }
    }
    if (!keywords || keywords.length == 0) {
      keywords = $('meta[property="article:tag"]').map(function(){return $(this).attr('content');}).get();
    }

    if (!keywords || keywords.length == 0) {
      keywords = $('.styles li a').map(function () {return $(this).text();}).get()
    }

    if (keywords && keywords.length > 0) {
      result.keywords = keywords.join();
    }

    var title = $('meta[property="og:title"]').attr('content');
    if (!title) {
      title  = $('meta[property="twitter:title"]').attr('content');
    }
    if (title) {
      result.title = title;
    }

    var age = $('meta[property="cs:age"]').attr('content');
    if (age) {
      result.age = age;
    }
    var gender = $('meta[property="cs:gender"]').attr('content');
    if (gender) {
      result.gender = gender;
    }
    return result;
  }

  function loadInternal(integrationKey, host) {
    var elem = cappsoolWidgetElement();
    if (elem == null) {
      console.log('cannot find cappsool-widget element');
      return;
    }
    var currentUrl = window.location.href;
    if (currentUrl && currentUrl.indexOf('file://') == 0 && currentUrl.indexOf('.app') >= 0) {
      var parts = currentUrl.split("/");
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].indexOf('.app') >= 0) {
          currentUrl = parts[i];
          break;
        }
      }
    }

    if (overrideURL){
      currentUrl = overrideURL;
    }

    // Target the user using localStorage
    var userGuidParam = '';
    $(elem).before('<iframe name="cappsool-iframe" style="visibility:hidden;height:1px" src="' + cappsoolUrl + '/assets/widget/scripts/targeting.html?returnUrl=' + location.origin + '"></iframe>');


    window.addEventListener('message', setUserGuid, false);
    function setUserGuid(e) {
      if (e.origin == cappsoolUrl) {
        if (/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/.test(e.data)) {
          //console.log(e.data);
          userGuid = e.data.split('?')[0];
          //console.log(userGuid);
          // Get data from guidString
          if (e.data.split('?')[1]) {
            if (e.data.split('?')[1].split('clicks=')[1]) {
              var clicksSubStr = e.data.split('?')[1].split('clicks=')[1].split('&')[0];
              if (/^[a-zA-Z0-9\\.\\-\\+]*$/.test(clicksSubStr)) {
                userGuidClicks = clicksSubStr.split('+');
                //console.log(userGuidClicks);
              }
            }
          }
        } else if (e.data === 'optOut') {
          userGuid = 'optOut';
        }
      }
    }

    // Waiting for user guid - limited to 2 seconds
    if (!userGuid) {
      var maxRounds = 4;
      var waitForGuid = setInterval(function() {
        if (maxRounds > 0 && !userGuid) {
          maxRounds--;
        } else {
          clearInterval(waitForGuid);
          if (userGuid) {
            userGuidParam = '&userGuid=' + userGuid;
          }
          performOffer();
        }
      }, 500);
    } else {
      userGuidParam = '&userGuid=' + userGuid;
      performOffer();
    }

    function performOffer() {
        resetState();
        var extractedData = extractData();
        var subjectParam = '';
        for (var k in extractedData) {
          subjectParam += '&' + k + '=' + encodeURIComponent(extractedData[k]);
        }

        var suggestedAppsUrl = host + '/api/widgetService/suggestedapps?integrationKey=' + integrationKey + '&contentUrl=' + encodeURIComponent(currentUrl) + subjectParam + userGuidParam;

        $.ajax({
          url: suggestedAppsUrl,
          data: {clicks: userGuidClicks},
          context: document.body,
          cache: false,
          success: function (data) {
            loadData(data, elem, host)
          }
        });
    }
  }

  function loadData(data,elem,host){
    //elem.innerHTML = JSON.stringify(data);
    serverLocation = host;
    widgetServerId = data.id;
    var widgetData = data.suggestedapps;
    publisherId = data.publisherId;
    contentSubject = data.subject;
    trackingKey = data.trackingKey;
    widgetConfig = data.widgetconfig;

    if ((userGuid !== 'optOut') && (widgetConfig.blockUserTargeting === false) && data.userGuid && data.userGuid != userGuid) {
      // Set the user localStorage
      userGuid = data.userGuid;
      updateGuidStr();

    } else if (!(widgetConfig.blockUserTargeting === false) || userGuid === 'optOut') {
      userGuid='';
      userGuidClicks = [];
    }

    extendWidgetConfig();
    var content = {'slides': widgetData};
    for (var i = 0; i < widgetData.length; i++) {
      widgetPlatform = widgetData[i].platform;
      break;
    }
    if (widgetData && widgetData.length > 0) {
      if (widgetConfig && widgetConfig.shownEnoughTimeInterval) {
        shownTimeCounter.setInterval(widgetConfig.shownEnoughTimeInterval);
      }
      loadNeededIncludesInternal(host, widgetConfig, function(){
        var r = fillWidgetElement(elem, content);
        var loadEnd = (new Date()).getTime();
        logEvent({}, eventTypes.widgetLoadTime, (loadEnd - cappsool.loadStart) / 1000, null);
        if (window.CappsoolAndroid){
          window.CappsoolAndroid.DoneLoad();
        }

      });
    }


    if(widgetConfig && widgetConfig.jsOverride) {
      var f = new Function(widgetConfig.jsOverride);
      f();
    }
  }

  function queryParam( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : decodeURIComponent(results[1]);
  }

  function getIntegrationKeyFromScriptSource(){
    var srcUrl = $('script')
      .filter(function() {
        return this.src.indexOf("widget.js?integrationKey=") >= 0;
      })
      .attr('src');
    var integrationKey = queryParam("integrationKey", srcUrl);
    return integrationKey;
  }

  function isOsSupported(userAgent) {
    if (/iPhone OS [2|3|4|5|6]/.test(userAgent)) {
      return false;
    }
    if (/Android [2|3]/.test(userAgent)) {
      return false;
    }
    return true;
  }

  function load(integrationKey, host,url) {
    if (url){
      overrideURL = url;
    }
    this.loadStart = (new Date()).getTime();
    if (host === undefined || host === null) {
      host = 'http://server.cappsool.com';
      if ('https:' == location.protocol) {
        host = host.replace("http:", "https:");
      }

      var hostFromQueryParam = queryParam('cappsool_server');
      if (hostFromQueryParam) {
        host = hostFromQueryParam;
      }
    }

    if (integrationKey) {
      if (window.cappsoolOnlyOnce) {
        console.log('info: loaded earlier - aborted');
        return;
      }
      window.cappsoolOnlyOnce = true;
    }

    if ('https:' == location.protocol) {
      cappsoolUrl = cappsoolUrl.replace("http:", "https:");
    }

    if( /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
      if (isOsSupported(navigator.userAgent)) {
        loadNeededIncludes(host, function () {
          if (!integrationKey) {
            integrationKey = getIntegrationKeyFromScriptSource();
          }
          if (!integrationKey) return;

          waitForCappsoolElement(100, 10, integrationKey, host, function () {
            loadInternal(integrationKey, host);
          });
        });
      }
    }
  }

  return {
    replaceContentInContainer: replaceContentInContainer,
    installCappsool: installCappsool,
    onScroll : onScroll,
    load: load
  };
}());

cappsool.load();

