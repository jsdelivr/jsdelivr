/*
* Metro JS for jQuery
* http://drewgreenwell.com/ 
* For details and usage info see: http://drewgreenwell.com/projects/metrojs

Copyright (C) 2012, Drew Greenwell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function () {
jQuery.fn.metrojs = {};


/* Preload Images */
// Usage: jQuery(['img1.jpg','img2.jpg']).metrojs.preloadImages(function(){ ... });
// Callback function gets called after all images are preloaded
jQuery.fn.metrojs.preloadImages = function (callback) {
    var checklist = jQuery(this).toArray();
    var $img = jQuery("<img style='display:none;'>").appendTo("body");
    jQuery(this).each(function () {
        $img.attr({ src: this }).load(function () {
            var src = jQuery(this).attr('src');
            for (var i = 0; i < checklist.length; i++) {
                if (checklist[i] == element) { checklist.splice(i, 1); }
            }
            if (checklist.length == 0) { callback(); }
        });
    });
    $img.remove();
};    jQuery.fn.liveTile = function (method) {
        if (pubMethods[method]) {
            var args = [];
            for (var i = 1; i <= arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
            return pubMethods[method].apply(this, args);
        } else if (typeof method === 'object' || !method) {
            return pubMethods.init.apply(this, arguments);
        } else {
            jQuery.error('Method ' + method + ' does not exist on jQuery.liveTile');
        }
    };
    jQuery.fn.liveTile.State = {
        RUNNING: "running",
        STOPPED: "stopped"
    };
    jQuery.fn.liveTile.defaults = {
        mode: 'slide',                          // 'slide', 'flip', 'flip-list'
        speed: 500,                             // how fast should animations be performed, in milliseconds
        initDelay: -1,                          // how long to wait before the initial animation
        delay: 5000,                            // how long to wait between animations 
        stops: "100%",                          // how much of the back tile should 'slide' reveal before starting a delay
        stack: false,                           // should tiles in slide mode appear stacked (e.g Me tile) 
        direction: 'vertical',                  // which direction should animations be performed(horizontal | vertical)
        tileCssSelector: '>div,>li',            // The selector used by slide, flip, and flip-list mode to choose the front and back containers
        listTileCssSelector: '>div,>p,>img,>a', // The selector used by flip-tile mode to choose the front and back containers.2
        imageCssSelector: '>img,>a>img',        // the selector used to choose a an image to apply a src or background to
        ignoreDataAttributes: false,            // should data attributes be ignored
        pauseOnHover: false,                    // should tile animations be paused on hover in and restarted on hover out
        repeatCount: -1,                        // number of times to repeat the animation        
        animationComplete: function (tileData, $front, $back) {
        },
        preloadImages: false,                   // should the images arrays be preloaded
        fadeSlideSwap: false,                   // fade any image swaps on slides (e.g. mode: 'slide', stops:'50%', frontImages: ['img1.jpg', 'img2.jpg'])
        appendBack: true,                       // appends the .last tile if one doesnt exist (slide and flip only)
        triggerDelay: function (idx) {          // used by flip-list to decide how random the tile flipping should be
            return Math.random() * 3000;
        },
        alwaysTrigger: false,                   // used by flip-list to decide if all tiles are triggered every time
        frontImages: null,                      // a list of images to use for the front
        frontIsRandom: true,                    // should images be chosen at random or in order
        frontIsBackgroundImage: false,          // set the src attribute or css background-image property
        frontIsInGrid: false,                   // only chooses one item for each iteration in flip-list
        backImages: null,                       // a list of images to use for the back
        backIsRandom: true,                     // should images be chosen at random or in order
        backIsBackgroundImage: false,           // set the src attribute or css background-image property
        backIsInInGrid: false,                  // only chooses one item for each iteration in flip-list
        flipListOnHover: false,                 // should items in flip-list flip and stop when hovered
        useModernizr: (typeof (window.Modernizr) != "undefined"), // checks to see if modernizer is already in use
        useHardwareAccel: true,                 // should css animations, transitions and transforms be used when available
        $front: null,                           // the jQuery element to use as the front face of the tile; this will bypass tileCssSelector
        $back: null                            // the jQuery element to use as the back face of the tile; this will bypass tileCssSelector
    };

    var privMethods = {
        //a shuffle method to provide more randomness than sort
        //credit: http://javascript.about.com/library/blshuffle.htm
        //*avoiding prototype for sharepoint compatability
        shuffleArray: function (array) {
            var s = [];
            while (array.length) s.push(array.splice(Math.random() * array.length, 1));
            while (s.length) array.push(s.pop());
            return array;
        },
        setTimer: function (func, interval) {
            return setInterval(func, interval);
        },
        stopTimer: function (handle) {
            clearInterval(handle);
            return null;
        },
        setExtraProperties: function ($ele, imageObj) {
            if (typeof (imageObj.alt) != "undefined")
                $ele.attr("alt", imageObj.alt);
            var $parent = $ele.parent();
            if (typeof (imageObj.href) != "undefined" && $parent[0].tagName == "A") {
                $parent.attr("href", imageObj.href);
                if (typeof (imageObj.target) != "undefined")
                    $parent.attr("target", imageObj.target);
                if (typeof (imageObj.onclick) != "undefined") {
                    $parent.attr("onclick", imageObj.onclick);
                    $ele.attr("onclick", "");
                }
            } else {
                if (typeof (imageObj.onclick) != "undefined")
                    $ele.attr("onclick", imageObj.onclick);
            }
        },
        // changes the src or background image property of an image in a flip-list
        handleListItemSwap: function ($cont, image, isBgroundImg, stgs) {
            var $img = $cont.find(stgs.imageCssSelector);
            if (!isBgroundImg) {
                $img.attr("src", image.src);
            } else {
                $img.css({ backgroundImage: "url('" + image.src + "')" });
            }
            privMethods.setExtraProperties($img, image);
        },
        handleSlide: function (isSlidingUp, $cont, swapFrontSource, stgs, index) {
            if (!isSlidingUp && swapFrontSource) {
                var image;
                var $img = $cont.find(stgs.imageCssSelector);
                image = stgs.frontImages[index];
                if (stgs.fadeSlideSwap == true) {
                    $img.fadeOut(function () {
                        $img.attr("src", image.src);
                        privMethods.setExtraProperties($img, image);
                        $img.fadeIn();
                    });
                } else {
                    $img.attr("src", image.src);
                    privMethods.setExtraProperties($img, image);
                }
            }

        },
        // fired if an image swap is needed. gets the image and applies properties
        handleSwap: function ($cont, isFront, stgs, index) {
            var image = privMethods.getImage(isFront, stgs, index);
            var $img = $cont.find(stgs.imageCssSelector);
            $img.attr("src", image.src);
            privMethods.setExtraProperties($img, image);
        },
        // get an image from the frontImages or backImages array
        getImage: function (isFront, stgs, index) {
            var imgs = (isFront) ? stgs.frontImages : stgs.backImages;
            var image;
            image = imgs[Math.min(index, imgs.length - 1)];
            return image;
        }
    };
    var pubMethods = {
        init: function (options) {
            // Setup the public options for the livetile
            var stgs = {};
            jQuery.extend(stgs, jQuery.fn.liveTile.defaults, options);

            //is there at least one item in the front images list?
            var swapFrontSource = (typeof (stgs.frontImages) == 'object' && (stgs.frontImages instanceof Array) && stgs.frontImages.length > 0);
            //is there at least one item in the back images list?
            var swapBackSource = (typeof (stgs.backImages) == 'object' && (stgs.backImages instanceof Array) && stgs.backImages.length > 0);
            var canTransform = false;
            var canTransition = false;
            var canTransform3d = false;
            var canAnimate = false;
            var canFlip3d = stgs.useHardwareAccel;
            if (stgs.useHardwareAccel == true) {
                if (stgs.useModernizr == false) {
                    //determine if the browser supports the neccessary accelerated features
                    if (typeof (window.MetroModernizr) != "undefined") {
                        canTransform = window.MetroModernizr.canTransform;
                        canTransition = window.MetroModernizr.canTransition;
                        canTransform3d = window.MetroModernizr.canTransform3d;
                        canAnimate = window.MetroModernizr.canAnimate;
                    } else {
                        window.MetroModernizr = {};
                        /***** check for browser capabilities credit: modernizr-1.7 *****/
                        var mod = 'metromodernizr';
                        var docElement = document.documentElement;
                        var docHead = document.head || document.getElementsByTagName('head')[0];
                        var modElem = document.createElement(mod);
                        var m_style = modElem.style;
                        var prefixes = ' -webkit- -moz- -o- -ms- -khtml- '.split(' ');
                        var domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
                        var test_props = function (props, callback) {
                            for (var i in props) {
                                if (m_style[props[i]] !== undefined && (!callback || callback(props[i], modElem))) {
                                    return true;
                                }
                            }
                        };
                        var test_props_all = function (prop, callback) {

                            var uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1),
							props = (prop + ' ' + domPrefixes.join(uc_prop + ' ') + uc_prop).split(' ');

                            return !!test_props(props, callback);
                        };
                        var test_3d = function () {
                            var ret = !!test_props(['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']);
                            if (ret && 'webkitPerspective' in docElement.style) {
                                // Webkit allows this media query to succeed only if the feature is enabled.    
                                // '@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d),(modernizr){ ... }'
                                ret = testMediaQuery('@media (' + prefixes.join('transform-3d),(') + 'metromodernizr)');
                            }
                            return ret;
                        };
                        var testMediaQuery = function (mq) {
                            var st = document.createElement('style'),
						div = document.createElement('div'),
						ret;
                            st.textContent = mq + '{#metromodernizr{height:3px}}';
                            docHead.appendChild(st);
                            div.id = 'metromodernizr';
                            docElement.appendChild(div);
                            ret = div.offsetHeight === 3;
                            st.parentNode.removeChild(st);
                            div.parentNode.removeChild(div);
                            return !!ret;
                        };
                        canTransform = !!test_props(['transformProperty', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform']);
                        canTransition = test_props_all('transitionProperty');
                        canTransform3d = test_3d();
                        canAnimate = test_props_all('animationName');
                        window.MetroModernizr.canTransform = canTransform;
                        window.MetroModernizr.canTransition = canTransition;
                        window.MetroModernizr.canTransform3d = canTransform3d;
                        window.MetroModernizr.canAnimate = canAnimate;
                        docElement = null;
                        docHead = null;
                        modElem = null;
                        m_style = null;
                    }
                } else {
                    canTransform = jQuery("html").hasClass("csstransforms");
                    canTransition = jQuery("html").hasClass("csstransitions");
                    canTransform3d = jQuery("html").hasClass("csstransforms3d");
                    canAnimate = jQuery("html").hasClass("cssanimations");
                }
            }
            canFlip3d = canFlip3d && canAnimate && canTransform && canTransform3d;
            /****** end capabilities check ******/
            if (stgs.preloadImages) {
                if (swapFrontSource)
                    jQuery(stgs.frontImages).metrojs.preloadImages(function () { });
                if (swapBackSource)
                    jQuery(stgs.backImages).metrojs.preloadImages(function () { });
            }
            return jQuery(this).each(function (tileIndex) {
                var $this = jQuery(this);
                $this.slideTimer = null;
                var tdata = {}; //an object to store settings for later access
                tdata.state = $this.slideTimer == null ? jQuery.fn.liveTile.State.STOPPED : jQuery.fn.liveTile.State.RUNNING;
                tdata.speed = (!stgs.ignoreDataAttributes && typeof ($this.data("speed")) != "undefined") ? $this.data("speed") : stgs.speed;
                tdata.delay = (!stgs.ignoreDataAttributes && typeof ($this.data("delay")) != "undefined") ? $this.data("delay") : stgs.delay;
                if (tdata.delay < -1)
                    tdata.delay = stgs.triggerDelay(tileIndex);
                else if (tdata.delay < 0)
                    tdata.delay = 3500 + (Math.random() * 4501);
                tdata.stops = (!stgs.ignoreDataAttributes && typeof ($this.data("stops")) != "undefined") ? $this.data("stops") : stgs.stops;
                tdata.stack = (!stgs.ignoreDataAttributes && typeof ($this.data("stack")) != "undefined") ? $this.data("stack") : stgs.mode;
                tdata.mode = (!stgs.ignoreDataAttributes && typeof ($this.data("mode")) != "undefined") ? $this.data("mode") : stgs.mode;
                tdata.direction = (!stgs.ignoreDataAttributes && typeof ($this.data("direction")) != "undefined") ? $this.data("direction") : stgs.direction;
                tdata.useHwAccel = (!stgs.ignoreDataAttributes && typeof ($this.data("ha")) != "undefined") ? $this.data("ha") : stgs.useHardwareAccel;
                tdata.initDelay = (!stgs.ignoreDataAttributes && typeof ($this.data("initdelay")) != "undefined") ? $this.data("initdelay") : (stgs.initDelay < 0) ? tdata.delay : stgs.initDelay;
                tdata.repeatCount = (!stgs.ignoreDataAttributes && typeof ($this.data("repeat")) != "undefined") ? $this.data("repeat") : stgs.repeatCount;                
                tdata.hasRun = false; // init delay flag
                tdata.isReversed = false;
                tdata.loopCount = 0;
                tdata.slideIndex = 0;
                //convert stops if needed
                tdata.stops = (typeof (stgs.stops) == 'object' && (stgs.stops instanceof Array)) ? stgs.stops : ('' + tdata.stops).split(',');
                //add the mode to the tile if it's not already there.
                $this.addClass(tdata.mode);
                var $tileContainer = $this.find(stgs.tileCssSelector);
                var $firstContainer = null;
                if (stgs.$front != null && stgs.$front.length > 0) {
                    $firstContainer = (tdata.mode == "flip-list") ? null : (tdata.mode == 'slide') ?
									    stgs.$front.addClass('slide-front') :
									    stgs.$front.addClass('flip-front');
                } else {
                    $firstContainer = (tdata.mode == "flip-list") ? null : (tdata.mode == 'slide') ?
									    $tileContainer.first().addClass('slide-front') :
									    $tileContainer.first().addClass('flip-front');
                }
                var lClass = (tdata.mode == 'slide') ? 'slide-back' : 'flip-back';
                var $scndContainer = null;
                if (stgs.$back != null && stgs.$back.length > 0) {
                    $scndContainer = (tdata.mode == "flip-list") ? null : stgs.$back.addClass(lClass);
                } else {
                    $scndContainer = (tdata.mode == "flip-list") ? null : ($tileContainer.length > 1) ?
								$tileContainer.last().addClass(lClass) :
								(stgs.appendBack == true) ?
								jQuery('<div class="' + lClass + '"></div>').appendTo($this) :
								jQuery('<div></div>');
                }
                var height = $this.height();
                var width = $this.width();
                var margin = (tdata.direction == "vertical") ? height / 2 : width / 2;
                

                var staticCount = 0;
                var staticIndexBack = 0;
                var staticIndexFront = 0;
                var doAnimations = false;
                var flistData = []; // an array to cache flip list selectors
                var frontRandomBag = [];
                var prevFrontIndex = -1;
                var backRandomBag = [];
                var prevBackIndex = -1;
                /* Mouse over and out functions*/

                if (stgs.pauseOnHover) {
                    $this.find(stgs.tileCssSelector).hover(
					function () {
					    tdata.stopTimer(false);
					},
					function () {
					    tdata.setTimer();
					});
                }
                // prep tiles
                if (tdata.mode == 'flip-list') {
                    $this.find(stgs.tileCssSelector).each(function () {
                        var $li = jQuery(this);
                        var $front = stgs.$front != null ? stgs.$front : $li.find(stgs.listTileCssSelector).first().addClass("flip-front");
                        if ($li.find(stgs.listTileCssSelector).length == 1 && stgs.appendBack == true) {
                            $li.append("<div></div>");
                        }
                        var $back = stgs.$back != null ? stgs.$back : $li.find(stgs.listTileCssSelector).last().addClass("flip-back").css({ marginTop: "0px" });
                        if (canFlip3d && tdata.useHwAccel) {
                            $li.addClass("ha");
                            $front.addClass("ha").data("tile", { animating: false });
                            $back.addClass("ha").data("tile", { animating: false });
                            if (stgs.flipListOnHover == true) {
                                $front.bind("mouseout.liveTile", null, function () {
                                    $this.flipListItem(false, $li, $back, $front);
                                });
                                $back.bind("mouseout.liveTile", null, function () {
                                    $this.flipListItem(true, $li, $front, $back);
                                });
                            }
                        } else {
                            if (stgs.flipListOnHover == true) {
                                $front.bind("mouseout.liveTile", function () {
                                    $this.flipListItem(true, $li, $front, $back);
                                });
                                $back.bind("mouseout.liveTile", function () {
                                    $this.flipListItem(false, $li, $back, $front);
                                });
                            }
                        }
                    });
                } else if (tdata.mode == 'slide') {
                    if (tdata.stack == true) {
                        if (tdata.direction == "vertical") {
                            $scndContainer.css({ top: -height + 'px' });
                        } else {
                            $scndContainer.css({ left: -width + 'px' });
                        }
                    }
                    if (canTransition && tdata.useHwAccel) {
                        $this.addClass("ha");
                        $firstContainer.addClass("ha").data("tile", { animating: false });
                    }
                } else if (tdata.mode == 'flip') {
                    if (canFlip3d && tdata.useHwAccel) {
                        $this.addClass("ha");
                        $firstContainer.addClass("ha").data("tile", { animating: false });
                        $scndContainer.addClass("ha").data("tile", { animating: false });
                    } else {
                        var fCss = (tdata.direction == "vertical") ?
							   { height: '0px', width: width + 'px', marginTop: margin + 'px', opacity: '0'} :
							   { height: '100%', width: '0px !important', marginLeft: margin + 'px', opacity: '0' };
                        var fCss2 = (tdata.direction == "vertical") ?
								{ height: '100%', width: '100%', marginTop: '0px', opacity: '1'} :
								{ height: '100%', width: '100%', marginLeft: '0px', opacity: '1' };
                        $scndContainer.css(fCss);
                        $firstContainer.css(fCss2);
                        //temp fix                       
                        // TODO: debug and remove instances of jQuery.browser for compatibility with jq 1.8+
                        if (tdata.repeatCount > -1 && jQuery.browser.msie) {
                            tdata.repeatCount += 1;
                        }
                        //                        if (tdata.direction == "horizontal")
                        //                            $scndContainer.css({ marginLeft: $scndContainer.width() / 2 + 'px', width: '0px' });
                        //                        else
                        //                            $scndContainer.css({ marginTop: $scndContainer.height() / 2 + 'px', height: '0px' });
                    }
                }


                //slide animation
                $this.slide = function (callback) {
                    if (typeof (callback) == "undefined" || callback == null)
                        callback = null;
                    if (tdata.repeatCount > -1) {                        
                        if (tdata.loopCount > tdata.repeatCount) {                            
                            tdata.stopTimer(false);
                            tdata.loopCount = 0;
                            tdata.hasRun = false;
                            $this.data("LiveTile", tdata);
                            return;
                        }
                    }
                    if (!doAnimations)
                        return;
                    var clojIsReversed = tdata.isReversed;
                    var fData = $firstContainer.data("tile");
                    var stop = jQuery.trim(tdata.stops[tdata.slideIndex]);
                    var pxIdx = stop.indexOf('px');
                    var offset = 0;
                    var amount = 0
                    var metric = (tdata.direction == "vertical") ? height : width;
                    var prop = (tdata.direction == "vertical") ? "top" : "left";
                    if (pxIdx > 0) {
                        amount = parseInt(stop.substring(0, pxIdx));
                        offset = (amount - metric) + 'px';
                    } else {
                        //is a percentage
                        amount = parseInt(stop.replace('%', ''));
                        offset = (amount - 100) + '%';
                    }
                    if (canTransition && tdata.useHwAccel) {
                        if (typeof (fData.animated) != "undefined" && fData.animated == true)
                            return;
                        fData.animated = true;
                        var css = {
                            WebkitTransitionProperty: prop, WebkitTransitionDuration: tdata.speed + 'ms',
                            MozTransitionProperty: prop, MozTransitionDuration: tdata.speed + 'ms',
                            OTransitionProperty: prop, OTransitionDuration: tdata.speed + 'ms',
                            msTransitionProperty: prop, msTransitionDuration: tdata.speed + 'ms',
                            KhtmlTransitionProperty: prop, KhtmlTransitionDuration: tdata.speed + 'ms',
                            TransitionProperty: prop, TransitionDuration: tdata.speed + 'ms'
                        };
                        if (tdata.direction == "vertical") {
                            css.top = (clojIsReversed && tdata.stops.length == 1) ? "0px" : stop;
                        } else {
                            css.left = (clojIsReversed && tdata.stops.length == 1) ? "0px" : stop;
                        }
                        $firstContainer.css(css);
                        if (tdata.stack == true) {
                            if (tdata.direction == "vertical") {
                                css.top = (clojIsReversed && tdata.stops.length == 1) ? -metric + 'px' : offset;
                            } else {
                                css.left = (clojIsReversed && tdata.stops.length == 1) ? -metric + 'px' : offset;
                            }
                            $scndContainer.css(css);
                        }
                        window.setTimeout(function () {
                            var index = staticCount;
                            if (swapFrontSource && stgs.frontIsRandom) {
                                //make sure the random bag is ready
                                if (frontRandomBag.length == 0) {
                                    for (var i = 0; i < stgs.frontImages.length; i++) {
                                        //make sure there's not an immediate repeat
                                        if (i != prevBackIndex || stgs.frontImages.length == 1)
                                            frontRandomBag[i] = i;
                                    }
                                    frontRandomBag = privMethods.shuffleArray(frontRandomBag);
                                }
                                index = frontRandomBag.pop();
                                prevFrontIndex = index;
                            }
                            privMethods.handleSlide(clojIsReversed, $firstContainer, swapFrontSource, stgs, index);
                            fData.animated = false;
                            $firstContainer.data("tile", fData);
                            if (!clojIsReversed && swapFrontSource) {
                                staticCount += 1;
                                if (staticCount >= stgs.frontImages.length)
                                    staticCount = 0;
                            }
                            stgs.animationComplete(tdata, $firstContainer, $scndContainer);
                            if (callback != null)
                                callback();
                        }, tdata.speed);
                    } else {
                        if ($firstContainer.is(':animated')) {
                            return;
                        }
                        var uCss = (tdata.direction == "vertical") ?
									{ top: (clojIsReversed && tdata.stops.length == 1) ? "0px" : stop} :
									{ left: (clojIsReversed && tdata.stops.length == 1) ? "0px" : stop };
                        var dCss = (tdata.direction == "vertical") ?
									{ top: (clojIsReversed && tdata.stops.length == 1) ? -metric + 'px' : offset} :
									{ left: (clojIsReversed && tdata.stops.length == 1) ? -metric + 'px' : offset };

                        $firstContainer.animate(uCss, tdata.speed, function () {
                            var index = staticCount;
                            if (swapFrontSource && stgs.frontIsRandom) {
                                //make sure the random bag is ready
                                if (frontRandomBag.length == 0) {
                                    for (var i = 0; i < stgs.frontImages.length; i++) {
                                        //make sure there's not an immediate repeat
                                        if (i != prevBackIndex || stgs.frontImages.length == 1)
                                            frontRandomBag[i] = i;
                                    }
                                    frontRandomBag = privMethods.shuffleArray(frontRandomBag);
                                }
                                index = frontRandomBag.pop();
                                prevFrontIndex = index;
                            }
                            privMethods.handleSlide(clojIsReversed, $firstContainer, swapFrontSource, stgs, index);
                            if (!clojIsReversed && swapFrontSource) {
                                staticCount += 1;
                                if (staticCount >= stgs.frontImages.length)
                                    staticCount = 0;
                            }
                            stgs.animationComplete(tdata, $firstContainer, $scndContainer);
                            if (callback != null)
                                callback();
                        });
                        if (tdata.stack == true) {
                            $scndContainer.animate(dCss, tdata.speed, function () { });
                        }
                    }
                    //increment slide count
                    tdata.slideIndex += 1;
                    if (tdata.slideIndex >= tdata.stops.length) {
                        tdata.slideIndex = 0;
                        tdata.isReversed = !tdata.isReversed;
                        tdata.loopCount += 1;
                    }
                };


                //flip mode
                $this.flip = function (callback) {
                    if (typeof (callback) == "undefined" || callback == null)
                        callback = null;
                    if (tdata.repeatCount > -1) {
                        if (tdata.loopCount > tdata.repeatCount) {
                            tdata.stopTimer(false);
                            tdata.loopCount = 0;
                            // TODO: debug and remove instances of jQuery.browser for compatibility with jq 1.8+
                            if (jQuery.browser.msie) /* straighten out issue with loopcount in IE */
                                tdata.loopCount += 1;
                            tdata.hasRun = false;
                            $this.data("LiveTile", tdata);
                            return;
                        } else {
                            tdata.loopCount += 1;
                        }
                    }
                    if (canFlip3d && tdata.useHwAccel) {
                        var spd = (tdata.speed * 2); // accelerated flip speeds are calculated on 1/2 rotation rather than 1/4 rotation like jQuery animate
                        var duration = spd + 'ms';
                        var aniFName = (tdata.direction == "vertical") ? 'flipfront180' : 'flipfrontY180';
                        var aniBName = (tdata.direction == "vertical") ? 'flipback180' : 'flipbackY180';
                        var data = $firstContainer.data("tile");
                        if (typeof (data.animated) != "undefined" && data.animated == true) {
                            return;
                        }
                        data.animated = true;
                        if (doAnimations) {
                            if (tdata.isReversed) {
                                var uCss = {
                                    WebkitAnimationPlayState: 'running', WebkitAnimationName: aniBName, WebkitAnimationDuration: duration,
                                    MozAnimationPlayState: 'running', MozAnimationName: aniBName, MozAnimationDuration: duration,
                                    OAnimationPlayState: 'running', OAnimationName: aniBName, OAnimationDuration: duration,
                                    msAnimationPlayState: 'running', msAnimationName: aniBName, msAnimationDuration: duration,
                                    AnimationPlayState: 'running', AnimationName: aniBName, AnimationDuration: duration
                                };
                                $firstContainer.css(uCss).data("tile", data);
                                uCss.WebkitAnimationName = aniFName;
                                uCss.MozAnimationName = aniFName;
                                uCss.msAnimationName = aniFName;
                                uCss.OAnimationName = aniFName;
                                uCss.AnimationName = aniFName;
                                $scndContainer.css(uCss).data("tile", data);
                                window.setTimeout(function () {
                                    if (swapBackSource) { // change the source image when the animation is finished
                                        var isRandom = stgs.backIsRandom;
                                        var index = staticIndexBack;
                                        if (isRandom) {
                                            //make sure the random bag is ready
                                            if (backRandomBag.length == 0) {
                                                for (var i = 0; i < stgs.backImages.length; i++) {
                                                    //make sure there's not an immediate repeat
                                                    if (i != prevBackIndex || stgs.backImages.length == 1)
                                                        backRandomBag[i] = i;
                                                }
                                                backRandomBag = privMethods.shuffleArray(backRandomBag);
                                            }
                                            index = backRandomBag.pop();
                                            prevBackIndex = index;
                                        }
                                        privMethods.handleSwap($scndContainer, false, stgs, index);
                                        staticIndexBack += 1;
                                        if (staticIndexBack >= stgs.backImages.length) {
                                            staticIndexBack = 0;
                                        }
                                    }
                                    stgs.animationComplete(tdata, $firstContainer, $scndContainer);
                                    if (callback != null)
                                        callback();
                                    data.animated = false;
                                    $firstContainer.data("tile", data);
                                    $scndContainer.data("tile", data);
                                }, spd);
                            } else {
                                var dCss = { WebkitAnimationPlayState: 'running', WebkitAnimationName: aniFName, WebkitAnimationDuration: duration,
                                    MozAnimationPlayState: 'running', MozAnimationName: aniFName, MozAnimationDuration: duration,
                                    OAnimationPlayState: 'running', OAnimationName: aniFName, OAnimationDuration: duration,
                                    msAnimationPlayState: 'running', msAnimationName: aniFName, msAnimationDuration: duration,
                                    AnimationPlayState: 'running', AnimationName: aniFName, AnimationDuration: duration
                                };
                                $firstContainer.css(dCss).data("tile", data);
                                dCss.WebkitAnimationName = aniBName;
                                dCss.MozAnimationName = aniBName;
                                dCss.msAnimationName = aniBName;
                                dCss.OAnimationName = aniBName;
                                dCss.AnimationName = aniBName;
                                $scndContainer.css(dCss).data("tile", data);
                                window.setTimeout(function () {
                                    if (swapFrontSource) {
                                        // change the source image when the animation is finished
                                        var isRandom = stgs.frontIsRandom;
                                        var index = staticIndexFront;
                                        if (isRandom) {
                                            //make sure the random bag is ready
                                            if (frontRandomBag.length == 0) {
                                                for (var i = 0; i < stgs.frontImages.length; i++) {
                                                    //make sure there's not an immediate repeat
                                                    if (i != prevBackIndex || stgs.frontImages.length == 1)
                                                        frontRandomBag[i] = i;
                                                }
                                                frontRandomBag = privMethods.shuffleArray(frontRandomBag);
                                            }
                                            index = frontRandomBag.pop();
                                            prevFrontIndex = index;
                                        }
                                        privMethods.handleSwap($firstContainer, true, stgs, index);
                                        staticIndexFront += 1;
                                        if (staticIndexFront >= stgs.frontImages.length) {
                                            staticIndexFront = 0;
                                        }
                                    }
                                    stgs.animationComplete(tdata, $scndContainer, $firstContainer);
                                    if (callback != null) {
                                        callback();
                                    }
                                    data.animated = false;
                                    $firstContainer.data("tile", data);
                                    $scndContainer.data("tile", data);
                                }, spd);
                            }
                        }
                        //an interval isnt needed
                        tdata.isReversed = !tdata.isReversed;
                    } else {

                        //crossbrowser single tile flip illusion (works best with images)
                        if (tdata.isReversed) {
                            var upCss = (tdata.direction == "vertical") ?
							   { height: '0px', width: '100%', marginTop: margin + 'px', opacity: '0'} :
							   { height: '100%', width: '0px', marginLeft: margin + 'px', opacity: '0' };
                            var upCss2 = (tdata.direction == "vertical") ?
								{ height: '100%', width: '100%', marginTop: '0px', opacity: '1'} :
								{ height: '100%', width: '100%', marginLeft: '0px', opacity: '1' };

                            $firstContainer.stop().animate(upCss, { duration: tdata.speed });
                            window.setTimeout(function () {
                                $scndContainer.stop().animate(upCss2, { duration: tdata.speed });
                                if (swapFrontSource) {
                                    var isRandom = stgs.frontIsRandom;
                                    var index = staticIndexFront;
                                    if (isRandom) {
                                        //make sure the random bag is ready
                                        if (frontRandomBag.length == 0) {
                                            for (var i = 0; i < stgs.frontImages.length; i++) {
                                                //make sure there's not an immediate repeat
                                                if (i != prevFrontIndex || stgs.frontImages.length == 1)
                                                    frontRandomBag[i] = i;
                                            }
                                            frontRandomBag = privMethods.shuffleArray(frontRandomBag);
                                        }
                                        index = frontRandomBag.pop();
                                        prevFrontIndex = index;
                                    }
                                    privMethods.handleSwap($firstContainer, true, stgs, index);
                                    staticIndexFront += 1;
                                    if (staticIndexFront >= stgs.frontImages.length) {
                                        staticIndexFront = 0;
                                    }
                                }
                                tdata.isReversed = !tdata.isReversed;
                                stgs.animationComplete(tdata, $scndContainer, $firstContainer);
                                if (callback != null)
                                    callback();
                            }, tdata.speed);
                        } else {
                            var dwnCss = (tdata.direction == "vertical") ?
							   { height: '0px', width: '100%', marginTop: margin + 'px', opacity: '0'} :
							   { height: '100%', width: '0px', marginLeft: margin + 'px', opacity: '0' };
                            var dwnCss2 = (tdata.direction == "vertical") ?
								{ height: '100%', width: '100%', marginTop: '0px', opacity: '1'} :
								{ height: '100%', width: '100%', marginLeft: '0px', opacity: '1' };
                            $scndContainer.stop().animate(dwnCss, { duration: tdata.speed });
                            window.setTimeout(function () {
                                $firstContainer.stop().animate(dwnCss2, { duration: tdata.speed });
                                if (swapBackSource) {
                                    var isRandom = stgs.backIsRandom;
                                    var index = staticIndexBack;
                                    if (isRandom) {
                                        //make sure the random bag is ready
                                        if (backRandomBag.length == 0) {
                                            for (var i = 0; i < stgs.backImages.length; i++) {
                                                //make sure there's not an immediate repeat
                                                if (i != prevBackIndex || stgs.backImages.length == 1)
                                                    backRandomBag[i] = i;
                                            }
                                            backRandomBag = privMethods.shuffleArray(backRandomBag);
                                        }
                                        index = backRandomBag.pop();
                                        prevBackIndex = index;
                                    }
                                    privMethods.handleSwap($scndContainer, false, stgs, index);
                                    staticIndexBack += 1;
                                    if (staticIndexBack >= stgs.backImages.length) {
                                        staticIndexBack = 0;
                                    }
                                }
                                tdata.isReversed = !tdata.isReversed;
                                stgs.animationComplete(tdata, $firstContainer, $scndContainer);
                                if (callback != null)
                                    callback();
                            }, tdata.speed);
                        }
                    }
                };
                // flip arbitrary number of items and swap sources accordingly
                $this.flipList = function (callback) {
                    if (typeof (callback) == "undefined" || callback == null)
                        callback = null;
                    if (tdata.repeatCount > -1) {
                        if (tdata.loopCount > tdata.repeatCount) {
                            tdata.stopTimer(false);
                            tdata.loopCount = 0;
                            tdata.hasRun = false;
                            $this.data("LiveTile", tdata);
                            return;
                        } else {
                            tdata.loopCount += 1;
                        }
                    }
                    var fBag = [];  // two bags to make sure we don't duplicate images
                    var bBag = [];
                    var $tiles = $this.find(stgs.tileCssSelector);
                    //in case we want to pick one image per loop
                    var fStaticRndm = 0;
                    if (swapFrontSource) {
                        if (frontRandomBag.length == 0) {
                            for (var i = 0; i < stgs.frontImages.length; i++) {
                                if (i != prevFrontIndex || stgs.frontImages.length == 1)
                                    frontRandomBag[i] = i;
                            }
                            frontRandomBag = privMethods.shuffleArray(frontRandomBag);
                        }
                        fStaticRndm = frontRandomBag.pop();
                        prevFrontIndex = fStaticRndm;
                    }
                    var bStaticRndm = 0;
                    if (swapBackSource) {
                        if (backRandomBag.length == 0) {
                            for (var i = 0; i < stgs.backImages.length; i++) {
                                if (i != prevBackIndex || stgs.backImages.length == 1)
                                    backRandomBag[i] = i;
                            }
                            backRandomBag = privMethods.shuffleArray(backRandomBag);
                        }
                        bStaticRndm = backRandomBag.pop();
                        prevBackIndex = bStaticRndm;
                    }
                    $tiles.each(function (idx) {
                        var $t = jQuery(this);
                        if (flistData.length < idx + 1) {
                            // cache the selector
                            var data = {};
                            data.$front = $t.find(stgs.listTileCssSelector).first();
                            data.$back = $t.find(stgs.listTileCssSelector).last();
                            data.isReversed = false;
                            flistData[idx] = data;
                        }
                        var $front = flistData[idx].$front;
                        var $back = flistData[idx].$back;

                        var tDelay = stgs.triggerDelay(idx);
                        var triggerSpeed = (tDelay > 0) ? (tdata.speed + tDelay) : tdata.speed;
                        var trigger = (stgs.alwaysTrigger == false) ? ((Math.random() * 351) > 150 ? true : false) : true;
                        var newImage;
                        if (flistData[idx].isReversed) {
                            if (trigger) {
                                window.setTimeout(function () {
                                    flistData[idx].isReversed = false;
                                    if (!swapFrontSource) {
                                        $this.flipListItem(true, $t, $front, $back);
                                    } else {
                                        var isRandom = stgs.frontIsRandom;
                                        var isInGrid = stgs.frontIsInGrid;
                                        var isBground = stgs.frontIsBackgroundImage;
                                        var frontImages = stgs.frontImages;
                                        if (isRandom && !isInGrid) {
                                            //make sure the random bag is ready
                                            if (fBag.length == 0) {
                                                for (var i = 0; i < stgs.frontImages.length; i++) {
                                                    fBag[i] = i;
                                                }
                                                fBag = privMethods.shuffleArray(fBag);
                                            }
                                            newImage = frontImages[fBag.pop()];
                                        } else {
                                            if (!isInGrid) {
                                                newImage = frontImages[Math.min(idx, frontImages.length)];
                                            } else {
                                                newImage = frontImages[Math.min(fStaticRndm, frontImages.length)];
                                            }
                                        }
                                        $this.flipListItem(true, $t, $front, $back, newImage, isBground);
                                    }
                                }, triggerSpeed);
                            }
                        } else {
                            if (trigger) {
                                window.setTimeout(function () {
                                    flistData[idx].isReversed = true;
                                    if (!swapBackSource) {
                                        $this.flipListItem(false, $t, $back, $front);
                                    } else {
                                        var isRandom = stgs.backIsRandom;
                                        var isInGrid = stgs.backIsInGrid;
                                        var isBground = stgs.backIsBackgroundImage;
                                        var backImages = stgs.backImages;
                                        if (isRandom && !isInGrid) {
                                            //make sure the random bag is ready
                                            if (bBag.length == 0) {
                                                for (var i = 0; i < stgs.backImages.length; i++) {
                                                    bBag[i] = i;
                                                }
                                                bBag = privMethods.shuffleArray(bBag);
                                            }
                                            newImage = backImages[bBag.pop()];
                                        } else {
                                            if (!isInGrid) {
                                                newImage = backImages[Math.min(idx, backImages.length)];
                                            } else {
                                                newImage = backImages[Math.min(bStaticRndm, backImages.length)];
                                            }
                                        }
                                        $this.flipListItem(false, $t, $back, $front, newImage, isBground);
                                    }
                                }, triggerSpeed);
                            }
                        }
                    });
                    window.setTimeout(function () {
                        tdata.isReversed = !tdata.isReversed;
                    }, tdata.speed);

                };

                //does the actual animation of a flip list item 
                $this.flipListItem = function (isFront, $itm, $front, $back, newSrc, isBgroundImg) {

                    var dir = (!stgs.ignoreDataAttributes && typeof ($itm.data("direction")) != "undefined") ? $itm.data("direction") : tdata.direction;
                    if (canFlip3d && tdata.useHwAccel) {
                        // avoid any z-index flickering from reversing an animation too early                
                        isBgroundImg = isFront ? stgs.frontIsBackgroundImage : stgs.backIsBackgroundImage;
                        var animating = isFront ? $front.data("tile").animating : $back.data("tile").animating;
                        if (animating == true) {
                            return;
                        }
                        var spd = (tdata.speed * 2);
                        var duration = spd + 'ms';
                        var aniFName = (dir == "vertical") ? 'flipfront180' : 'flipfrontY180';
                        var aniBName = (dir == "vertical") ? 'flipback180' : 'flipbackY180';
                        var fCss = {
                            WebkitAnimationPlayState: 'running', WebkitAnimationName: aniBName, WebkitAnimationDuration: duration,
                            MozAnimationPlayState: 'running', MozAnimationName: aniBName, MozAnimationDuration: duration,
                            msAnimationPlayState: 'running', msAnimationName: aniBName, msAnimationDuration: duration,
                            OAnimationPlayState: 'running', OAnimationName: aniBName, OAnimationDuration: duration,
                            AnimationPlayState: 'running', AnimationName: aniBName, AnimationDuration: duration
                        };
                        var bCss = {
                            WebkitAnimationPlayState: 'running', WebkitAnimationName: aniFName, WebkitAnimationDuration: duration,
                            MozAnimationPlayState: 'running', MozAnimationName: aniFName, MozAnimationDuration: duration,
                            msAnimationPlayState: 'running', msAnimationName: aniFName, msAnimationDuration: duration,
                            OAnimationPlayState: 'running', OAnimationName: aniFName, OAnimationDuration: duration,
                            AnimationPlayState: 'running', AnimationName: aniFName, AnimationDuration: duration
                        };
                        $front.css(fCss).data("tile").animating = true;
                        $back.css(bCss).data("tile").animating = true;
                        window.setTimeout(function () {
                            if (typeof (newSrc) != "undefined") {
                                privMethods.handleListItemSwap($front, newSrc, isBgroundImg, stgs);
                            }
                            $front.data("tile").animating = false;
                            $back.data("tile").animating = false;
                        }, 0); // once the animation is half through it can be reversed

                    } else {
                        var height = $itm.height();
                        var width = $itm.width();
                        var margin = (dir == "vertical") ? height / 2 : width / 2;
                        var uCss = (dir == "vertical") ?
							{ height: '0px', width: '100%', marginTop: margin + 'px', opacity: 0} :
							{ height: '100%', width: '0px', marginLeft: margin + 'px', opacity: 0 };
                        var dCss = (dir == "vertical") ?
							{ height: '100%', width: '100%', marginTop: '0px', opacity: 1} :
							{ height: '100%', width: '100%', marginLeft: '0px', opacity: 1 };
                        $front.stop().animate(uCss, { duration: tdata.speed });
                        window.setTimeout(function () {
                            $back.stop().animate(dCss, { duration: tdata.speed });
                            if (typeof (newSrc) != "undefined") {
                                privMethods.handleListItemSwap($front, newSrc, isBgroundImg, stgs);
                            }
                        }, tdata.speed);
                    }
                };

                /* Delay the tile action*/
                tdata.doAction = function () {
                    var action = null;
                    tdata.stopTimer(false);
                    switch (tdata.mode) {
                        case 'slide':
                            action = $this.slide;
                            break;
                        case 'flip':
                            action = $this.flip;
                            break;
                        case 'flip-list':
                            action = $this.flipList;
                            break;
                    }
                    var callBack = function () {
                        tdata.setTimer();
                    };
                    if (action != null) {
                        doAnimations = true;
                        action(callBack);
                    }
                };
                tdata.setTimer = function () {
                    var action = null;
                    switch (tdata.mode) {
                        case 'slide':
                            action = $this.slide;
                            break;
                        case 'flip':
                            action = $this.flip;
                            break;
                        case 'flip-list':
                            action = $this.flipList;
                            break;
                    }

                    if (action != null) {
                        if (tdata.hasRun == false) {
                            window.setTimeout(function () {
                                doAnimations = true;
                                action();
                                tdata.setTimer();
                            }, tdata.initDelay);
                        } else {
                            if ($this.slideTimer != null)
                                $this.slideTimer = privMethods.stopTimer($this.slideTimer);
                            $this.slideTimer = privMethods.setTimer(function () { doAnimations = true; action(); }, tdata.speed + tdata.delay);
                        }
                    }
                    tdata.hasRun = true;
                };

                tdata.stopTimer = function (restart) {
                    $this.slideTimer = privMethods.stopTimer($this.slideTimer);
                    doAnimations = false;

                    if (typeof (restart) != "undefined" && restart == true) {
                        tdata.setTimer();
                    }
                };
                $this.data("LiveTile", tdata);
                tdata.setTimer();
            });
        },
        animate: function () {
            jQuery(this).each(function () {
                var tData = jQuery(this).data("LiveTile");
                tData.doAction();
            });
        },
        destroy: function () {
            jQuery(this).each(function () {
                var $t = jQuery(this);
                $t.unbind(".liveTile");
                var $tile = jQuery(this).data("LiveTile");
                if ($tile != null) {
                    $tile.stopTimer(false);
                    $t.removeData("LiveTile");
                    $t.removeData("ha");
                    $t.removeData("tile");
                    delete $tile;
                    delete $t.slide;
                    delete $t.flip;
                    delete $t.flipList;
                    delete $t.liveTile;
                }

            });
        },
        stop: function (restart) {
            jQuery(this).each(function () {
                var $tile = jQuery(this).data("LiveTile");
                $tile.stopTimer(restart);
                $tile.loopCount = 0;
                $tile.hasRun = false;
            });
        },
        pause: function () {
            jQuery(this).each(function () {
                jQuery(this).data("LiveTile").stopTimer();
            });
        },
        play: function () {
            jQuery(this).each(function () {
                jQuery(this).data("LiveTile").setTimer();
            });
        }
    };jQuery.fn.metrojs.theme = {};
jQuery.fn.metrojs.theme.loadDefaultTheme = function (stgs) {
    if (typeof (stgs) == "undefined" || stgs == null) {
        stgs = jQuery.fn.metrojs.theme.defaults;
    } else {
        var stg = jQuery.fn.metrojs.theme.defaults;
        jQuery.extend(stg, stgs);
        stgs = stg;
    }
    //get theme from local storage or set base theme
    var hasLocalStorage = typeof (window.localStorage) != "undefined";
    var hasKeyAndValue = function (key) {
        return (typeof (window.localStorage[key]) != "undefined" && window.localStorage[key] != null);
    };
    if (stgs.applyTheme == true) {
        if (hasLocalStorage && (!hasKeyAndValue("Metro.JS.AccentColor") || !hasKeyAndValue("Metro.JS.BaseAccentColor"))) {
            //base theme
            window.localStorage["Metro.JS.AccentColor"] = stgs.accentColor;
            window.localStorage["Metro.JS.BaseAccentColor"] = stgs.baseTheme;
            jQuery(stgs.accentCssSelector).addClass(stgs.accentColor).data("accent", stgs.accentColor);
            jQuery(stgs.baseThemeCssSelector).addClass(stgs.baseTheme);
            if (typeof (stgs.loaded == "function"))
                stgs.loaded(stgs.baseTheme, stgs.accentColor);
            //preload light theme image
            if (typeof (stgs.preloadAltBaseTheme) != "undefined" && stgs.preloadAltBaseTheme)
                jQuery([(stgs.baseTheme == 'dark') ? stgs.metroLightUrl : stgs.metroDarkUrl]).metrojs.preloadImages(function () { });
        } else {
            if (hasLocalStorage) {
                stgs.accentColor = window.localStorage["Metro.JS.AccentColor"];
                stgs.baseTheme = window.localStorage["Metro.JS.BaseAccentColor"];
                jQuery(stgs.accentCssSelector).addClass(stgs.accentColor).data("accent", stgs.accentColor);
                jQuery(stgs.baseThemeCssSelector).addClass(stgs.baseTheme);
                if (typeof (stgs.loaded == "function"))
                    stgs.loaded(stgs.baseTheme, stgs.accentColor);
            } else {
                jQuery(stgs.accentCssSelector).addClass(stgs.accentColor).data("accent", stgs.accentColor);
                jQuery(stgs.baseThemeCssSelector).addClass(stgs.baseTheme);
                if (typeof (stgs.loaded == "function"))
                    stgs.loaded(stgs.baseTheme, stgs.accentColor);
                //preload light theme image
                if (typeof (stgs.preloadAltBaseTheme) != "undefined" && stgs.preloadAltBaseTheme)
                    jQuery([(stgs.baseTheme == 'dark') ? stgs.metroLightUrl : stgs.metroDarkUrl]).metrojs.preloadImages(function () { });
            }
        }
    }
};
jQuery.fn.metrojs.theme.applyTheme = function (tColor, aColor, stgs) {
    if (typeof (stgs) == "undefined" || stgs == null) {
        stgs = jQuery.fn.metrojs.theme.defaults;
    } else {
        var stg = jQuery.fn.metrojs.theme.defaults;
        jQuery.extend(stg, stgs);
        stgs = stg;
    }

    if (typeof (tColor) != "undefined" && tColor != null) {
        if (typeof (window.localStorage) != "undefined") {
            window.localStorage["Metro.JS.BaseAccentColor"] = tColor;
        }
        var $theme = jQuery(stgs.baseThemeCssSelector);
        if ($theme.length > 0) {
            if (tColor == "dark")
                $theme.addClass("dark").removeClass("light");
            else if (tColor == "light")
                $theme.addClass("light").removeClass("dark");
        }
    }
    if (typeof (aColor) != "undefined" && aColor != null) {
        if (typeof (window.localStorage) != "undefined") {
            window.localStorage["Metro.JS.AccentColor"] = aColor;
        }
        var $accent = jQuery(stgs.accentCssSelector);
        if ($accent.length > 0) {
            var themeset = false;
            $accent.each(function () {
                jQuery(this).addClass(aColor);
                var dAccent = jQuery(this).data("accent");
                if (dAccent != aColor) {
                    var cleanClass = jQuery(this).attr("class").replace(dAccent, "");
                    cleanClass = cleanClass.replace(/(\s)+/, ' ');
                    jQuery(this).attr("class", cleanClass);
                    jQuery(this).data("accent", aColor);
                    themeset = true;
                }
            });
            if (themeset && typeof (stgs.accentPicked) == "function")
                stgs.accentPicked(aColor);
        }
    }
};

// default options for theme
jQuery.fn.metrojs.theme.defaults = {
    baseThemeCssSelector: 'body',                           // selector to place dark or light class after load or selection
    accentCssSelector: '.tiles',                            // selector to place accent color class after load or selection
    accentColor: 'blue',                                    // the default accent color. options are blue, brown, green, lime, magenta, mango, pink, purple, red, teal
    baseTheme: 'dark'                                      // the default theme color. options are dark, light
};jQuery.fn.applicationBar = function (options) {
    /* Setup the public options for the applicationBar  */
    var stgs = typeof (jQuery.fn.metrojs.theme) != "undefined" ? jQuery.fn.metrojs.theme.defaults : {};
    jQuery.extend(stgs, jQuery.fn.applicationBar.defaults, options);
    if (typeof (jQuery.fn.metrojs.theme) != "undefined")
        jQuery.fn.metrojs.theme.loadDefaultTheme(stgs);
    //this should really only run once but we can support multiple application bars
    jQuery(this).each(function () {
    
        var $this = jQuery(this);
        
        //unfortunately we have to sniff out mobile browsers because of the inconsistent implementation of position:fixed
        //most desktop methods return false positives on a mobile
        if (navigator.userAgent.match(/(Android|webOS|iPhone|iPod|BlackBerry|PIE|IEMobile)/i)) {
            $this.css({ position: 'absolute', bottom: '0px' });
        }
        
        $this.animateAppBar = function (isExpanded) {
            var hgt = isExpanded ? stgs.collapseHeight : stgs.expandHeight;
            if (isExpanded)
                $this.removeClass("expanded");
            else
                if (!$this.hasClass("expanded"))
                    $this.addClass("expanded");
            $this.stop().animate({ height: hgt }, { duration: stgs.duration });
        };
        
        $this.find("a.etc").click(function () {
            $this.animateAppBar($this.hasClass("expanded"));
        });

        if (stgs.bindKeyboard == true) {
            jQuery(document.documentElement).keyup(function (event) {
                // handle cursor keys
                if (event.keyCode == 38) {
                    // expand
                    if (!$this.hasClass("expanded")) {
                        $this.animateAppBar(false);
                    }
                } else if (event.keyCode == 40) {
                    // collapse
                    if ($this.hasClass("expanded")) {
                        $this.animateAppBar(true);
                    }
                }
            });
        }

        if (typeof (jQuery.fn.metrojs.theme) != "undefined") {
            $this.find(".theme-options>li>a").click(function () {
                var accent = jQuery(this).attr("class").replace("accent", "").replace(" ", "");
                jQuery.fn.metrojs.theme.applyTheme(null, accent, stgs);
            });

            $this.find(".base-theme-options>li>a").click(function () {
                var accent = jQuery(this).attr("class").replace("accent", '').replace(' ', '');
                jQuery.fn.metrojs.theme.applyTheme(accent, null, stgs);
                if (typeof (stgs.themePicked) == "function")
                    stgs.themePicked(accent);
            });
        }

    });
};

// default options for applicationBar, the theme defaults are merged with this object when the applicationBar function is called
jQuery.fn.applicationBar.defaults = {
    applyTheme: true,                                       // should the theme be loaded from local storage and applied to the page
    themePicked: function (tColor) { },                     // called when a new theme is chosen. the chosen theme (dark | light)
    accentPicked: function (aColor) { },                    // called when a new accent is chosen. the chosen theme (blue, mango, purple, etc.)
    loaded: function (tColor, aColor) { },                  // called if applyTheme is true onload when a theme has been loaded from local storage or overridden by options
    duration: 500,                                          // how fast should animation be performed, in milliseconds
    expandHeight: "320px",                                  // height the application bar to expand to when opened
    collapseHeight: "60px",                                 // height the application bar will collapse back to when closed
    bindKeyboard: true,                                     // should up and down keys on keyborad be bound to the application bar
    metroLightUrl: 'images/metroIcons_light.jpg',  // the url for the metro light icons (only needed if preload 'preloadAltBaseTheme' is true)
    metroDarkUrl: 'images/metroIcons.jpg',         // the url for the metro dark icons (only needed if preload 'preloadAltBaseTheme' is true)
    preloadAltBaseTheme: false                              // should the applicationBar icons be pre loaded for the alternate theme to enable fast theme switching
};﻿})();