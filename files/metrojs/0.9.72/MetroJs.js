/*!
* Metro JS for jQuery
* http://drewgreenwell.com/ 
* For details and usage info see: http://drewgreenwell.com/projects/metrojs

Copyright (C) 2013, Drew Greenwell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
;(function ($) {
    // the metrojs object contains helper methods and theme settings
    $.fn.metrojs = {
        capabilities: null,
        checkCapabilities: function(stgs, recheck){
            if($.fn.metrojs.capabilities == null || (typeof(recheck) != "undefined" && recheck == true))
                $.fn.metrojs.capabilities = new $.fn.metrojs.MetroModernizr(stgs);
            return  $.fn.metrojs.capabilities;
        }
    };
    var metrojs = $.fn.metrojs;
var MAX_LOOP_COUNT = 99000;
// .liveTile
$.fn.liveTile = function (method) {
    if (pubMethods[method]) {
        var args = [];
        for (var i = 1; i <= arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
        return pubMethods[method].apply(this, args);
    } else if (typeof method === 'object' || !method) {
        return pubMethods.init.apply(this, arguments);
    } else {
        $.error('Method ' + method + ' does not exist on jQuery.liveTile');
        return null;
    }
};


$.fn.liveTile.contentModules = {
    modules: [],
    /* the default module layout
    [
                defaultModules.imageSwap,
        defaultModules.htmlSwap
    ],*/
    addContentModule: function (moduleName, module) {
        if (!(this.modules instanceof Array))
            this.modules = [];
        this.modules.push(module);
    },
    hasContentModule: function (moduleName) {
        if (typeof (moduleName) === "undefined" || !(this.modules instanceof Array))
                return -1;
        for (var i = 0; i < this.modules.length; i++) {
                if (typeof (this.modules[i].moduleName) != "undefined" && this.modules[i].moduleName == moduleName)
                        return i;
        }
            return -1;
    }
};

// default option values for .liveTile
$.fn.liveTile.defaults = {
    mode: 'slide',                          // 'fade', 'slide', 'flip', 'flip-list', carousel
    speed: 500,                             // how fast should animations be performed, in milliseconds
    initDelay: -1,                          // how long to wait before the initial animation
    delay: 5000,                            // how long to wait between animations 
    stops: "100%",                          // how much of the back tile should 'slide' reveal before starting a delay
    stack: false,                           // should tiles in slide mode appear stacked (e.g Me tile) 
    direction: 'vertical',                  // which direction should animations be performed(horizontal | vertical)
    animationDirection: 'forward',          // the direction that carousel mode uses to determine which way to slide in tiles
    tileSelector: '>div,>li,>p,>img,>a',    // the selector used by carousel mode and flip-list to choose tile containers
    tileFaceSelector: '>div,>li,>p,>img,>a',// the selector used to choose the front and back containers
    ignoreDataAttributes: false,            // should data attributes be ignored
    click: null,                            // function ($tile, tdata) { return true; }
    link: '',                               // a url to go to when clicked
    newWindow: false,                       // should the link be opened in a new window
    bounce: false,                          // should the tile shrink when tapped
    bounceDirections: 'all',                // which direction the tile will tile 'all', 'edges, 'corners'
    bounceFollowsMove: true,                // should a tile in bounce state tilt in the direction of the mouse as it moves
    pauseOnHover: false,                    // should tile animations be paused on hover in and restarted on hover out
    pauseOnHoverEvent: 'both',              // pause is called on mouseover, mouseout, or both
    playOnHover: false,                     // should "play" be called on hover
    playOnHoverEvent: 'both',               // play is called on mouseover, mouseout, or both
    onHoverDelay: 0,                        // the amount of time to wait before the onHover event is fired
    repeatCount: -1,                        // number of times to repeat the animation        
    appendBack: true,                       // appends the .last tile if one doesnt exist (slide and flip only)        
    alwaysTrigger: false,                   // should every item in a flip list trigger every time a delay passes 
    flipListOnHover: false,                 // should items in flip-list flip and stop when hovered
    flipListOnHoverEvent: 'mouseout',       // which event should be used to trigger the flip-list faces
    noHAflipOpacity: '1',                   // the opacity level set for the backside of the flip animation on unaccelerated browsers
    haTransFunc: 'ease',                    // the tranisiton-timing function to use in hardware accelerated mode
    noHaTransFunc: 'linear',                // the tranisiton-timing function to use in non hardware accelerated mode
    currentIndex: 0,                        // what is the current stop index for slide mode or slide index for carousel mode
    startNow: true,                         // should the tile immediately start or wait util play or restart has been called
    useModernizr: (typeof (window.Modernizr) !== "undefined"), // checks to see if modernizer is already in use
    useHardwareAccel: true,                 // should css animations, transitions and transforms be used when available
    useTranslate: true,
    faces: {
        $front: null,                        // the jQuery element to use as the front face of the tile; this will bypass tileCssSelector
        $back: null                          // the jQuery element to use as the back face of the tile; this will bypass tileCssSelector
    },
    animationStarting: function (tileData, $front, $back) {
        // returning false will cancel the animation
    },
    animationComplete: function (tileData, $front, $back) {
    },
    triggerDelay: function (idx) {          // used by flip-list to decide how random the tile flipping should be
        return Math.random() * 3000;
    },
    swap: '',                               // which swap modules are active for this tile (image, html)
    swapFront: '-',                         // override the available swap modules for the front face
    swapBack: '-',                          // override the available swap modules for the back face
    contentModules: []
};
// public methods that can be called via .liveTile(method name)
var pubMethods = {
    init: function (options) {
        // Setup the public options for the livetile
        var settings = $.extend({}, $.fn.liveTile.defaults, options);
        // checks for browser feature support to enable hardware acceleration                        
        metrojs.checkCapabilities(settings);
        helperMethods.getBrowserPrefix();
        // setup the default content modules
        if ($.fn.liveTile.contentModules.hasContentModule("image") == -1)
            $.fn.liveTile.contentModules.addContentModule("image", defaultModules.imageSwap);
        if ($.fn.liveTile.contentModules.hasContentModule("html") == -1)
            $.fn.liveTile.contentModules.addContentModule("html", defaultModules.htmlSwap);
        // this is where the magic happens
        return $(this).each(function (tileIndex, ele) {
                var $this = $(ele),
                data = privMethods.initTileData($this, settings);
            // append back tiles and add appropriate classes to prepare tiles
            data.faces = privMethods.prepTile($this, data);
            // action methods
            data.fade = function (count) { privMethods.fade($this, count); };
            data.slide = function (count) { privMethods.slide($this, count); };
            data.carousel = function (count) { privMethods.carousel($this, count); };
            data.flip = function (count) { privMethods.flip($this, count); };
            data.flipList = function (count) { privMethods.flipList($this, count); };
            var actions = {
                fade: data.fade,
                slide: data.slide,
                carousel: data.carousel,
                flip: data.flip,
                'flip-list': data.flipList
            };
            data.doAction = function (count) {
                // get the action for the current mode
                var action = actions[data.mode];
                if (typeof (action) === "function") {
                    action(count);
                    data.hasRun = true;
                }
                // prevent pauseOnHover from resuming a tile that has finished
                if (count == data.timer.repeatCount)
                    data.runEvents = false;
            };

            // create a new tile timer
            data.timer = new $.fn.metrojs.TileTimer(data.delay, data.doAction, data.repeatCount);
            // apply the data
            $this.data("LiveTile", data);
            // handle events
            // only bind pause / play on hover if we are not using a fliplist or flipListOnHover isn't set set
            if (data.mode !== "flip-list" || data.flipListOnHover == false) {
                if (data.pauseOnHover) {
                    privMethods.bindPauseOnHover($this);
                } else if (data.playOnHover) {
                    privMethods.bindPlayOnHover($this, data);
                }
            }
            // add a click / link to the tile
            if (data.link.length > 0 || typeof (data.click) === "function") {
                $this.css({ cursor: 'pointer' }).bind("click.liveTile", function (e) {
                    var proceed = true;
                    if (typeof (data.click) === "function") {
                        proceed = data.click($this, data) || false;
                    }
                    if (proceed && data.link.length > 0) {
                        e.preventDefault();
                        if (data.newWindow)
                            window.open(data.link);
                        else
                            window.location = data.link;
                    }
                });
            }
            // add bounce if set            
            privMethods.bindBounce($this, data);
            // start timer
            if (data.startNow && data.mode != "none") {
                data.runEvents = true;
                data.timer.start(data.initDelay);
            }
        });
    },
    // goto is a future reserved word
    'goto': function (options) {
        var opts, t = typeof (options);
        if (t === "undefined") {
            opts = {
                index: -99, //  same as next
                delay: 0,
                autoAniDirection: false
            };
        }
        if (t === "number" || !isNaN(options)) {
            opts = {
                index: parseInt(options, 10),
                delay: 0
            };
        } else if (t === "string") {
            if (options == "next") {
                opts = {
                    index: -99,
                    delay: 0
                };
            } else if (options.indexOf("prev") === 0) {
                opts = {
                    index: -100,
                    delay: 0
                };
            } else {
                $.error(options + " is not a recognized action for .liveTile(\"goto\")");
                return $(this);
            }
        } else if (t === "object") {
            if (typeof (options.delay) === "undefined") {
                options.delay = 0;
            }
            var ti = typeof (options.index);
            if (ti === "undefined") {
                options.index = 0;
            } else if (ti === "string") {
                if (options.index === "next")
                    options.index = -99;
                else if (options.index.indexOf("prev") === 0)
                    options.index = -100;
            }
            opts = options;
        }
        return $(this).each(function (tileIndex, ele) {
            var $tile = $(ele),
                data = $tile.data("LiveTile"),
                aniData = $tile.data("metrojs.tile"),
                goTo = opts.index;
            if (aniData.animating === true)
                return $(this);
            if (data.mode === "carousel") {
                // get the index based off of the active carousel slide
                var $cur = data.faces.$listTiles.filter(".active");
                var curIdx = data.faces.$listTiles.index($cur);
                // carousel will look for these values as triggers
                if (goTo === -100) { // prev
                    // autoAniDirection determines if a forward or backward animation should be used based on the goTo index
                    if (typeof (opts.autoAniDirection) === "undefined" || opts.autoAniDirection == true)
                        data.tempValues.animationDirection = typeof (opts.animationDirection) === "undefined" ? "backward" : opts.animationDirection;
                    goTo = curIdx === 0 ? data.faces.$listTiles.length - 1 : curIdx - 1;
                } else if (goTo === -99) { // next
                    if (typeof (opts.autoAniDirection) === "undefined" || opts.autoAniDirection == true)
                        data.tempValues.animationDirection = typeof (opts.animationDirection) === "undefined" ? "forward" : opts.animationDirection;
                    goTo = curIdx + 1;
                }
                if (curIdx == goTo) {
                    return;
                }
                if (typeof (opts.direction) !== "undefined") {
                    data.tempValues.direction = opts.direction;
                }
                if (typeof (opts.animationDirection) !== "undefined") {
                    data.tempValues.animationDirection = opts.animationDirection;
                }
                // the index is offset by 1 and incremented on animate
                if (goTo == 0)
                    data.currentIndex = data.faces.$listTiles.length;
                else
                    data.currentIndex = goTo - 1;
            } else // slide mode will use the index directly
                data.currentIndex = goTo;
            // start the timer
            data.runEvents = true;
            data.timer.start(opts.delay >= 0 ? opts.delay : data.delay);
        });
    },
    play: function (options) {
        var opts, t = typeof (options);
        if (t === "undefined") {
            opts = {
                delay: -1
            };
        } else if (t === "number") {
            opts = {
                delay: options
            };
        } else if (t === "object") {
            if (typeof (options.delay) === "undefined") {
                options.delay = -1;
            }
            opts = options;
        }
        return $(this).each(function (tileIndex, ele) {
            var $tile = $(ele),
                data = $tile.data("LiveTile");
            data.runEvents = true;
            if (opts.delay < 0 && !data.hasRun)
                opts.delay = data.initDelay;
            data.timer.start(opts.delay >= 0 ? opts.delay : data.delay);
        });
    },
    animate: function () { // this is really only useful for certain edge cases in slide mode, use 'play' to toggle animations
        return $(this).each(function (tileIndex, ele) {
            var $tile = $(ele),
                data = $tile.data("LiveTile");
            data.doAction();
        });
    },
    stop: function () {
        return $(this).each(function (tileIndex, ele) {
            var $tile = $(ele),
                data = $tile.data("LiveTile");
            data.hasRun = false;
            data.runEvents = false;
            data.timer.stop();
            window.clearTimeout(data.eventTimeout);
            window.clearTimeout(data.flCompleteTimeout);
            window.clearTimeout(data.completeTimeout);
            if (data.mode === "flip-list") {
                data.faces.$listTiles.each(function (idx, li) {
                    var ldata = $(li).data("metrojs.tile");
                    window.clearTimeout(ldata.eventTimeout);
                    window.clearTimeout(ldata.flCompleteTimeout);
                    window.clearTimeout(ldata.completeTimeout);
                });
            }
        });
    },
    pause: function () {
        return $(this).each(function (tileIndex, ele) {
            var $tile = $(ele),
                data = $tile.data("LiveTile");
            data.timer.pause();
            data.runEvents = false;
            window.clearTimeout(data.eventTimeout);
            window.clearTimeout(data.flCompleteTimeout);
            window.clearTimeout(data.completeTimeout);
            if (data.mode === "flip-list") {
                data.faces.$listTiles.each(function (idx, li) {
                    var ldata = $(li).data("metrojs.tile");
                    window.clearTimeout(ldata.eventTimeout);
                    window.clearTimeout(ldata.flCompleteTimeout);
                    window.clearTimeout(ldata.completeTimeout);
                });
            }
        });
    },
    restart: function (options) {
        var opts, t = typeof (options);
        if (t === "undefined") {
            opts = {
                delay: -1
            };
        } else if (t === "number") {
            opts = {
                delay: options
            };
        } else if (t === "object") {
            if (typeof (options.delay) === "undefined") {
                options.delay = -1;
            }
            opts = options;
        }
        return $(this).each(function (tileIndex, ele) {
            var $tile = $(ele),
                data = $tile.data("LiveTile");
            if (opts.delay < 0 && !data.hasRun)
                opts.delay = data.initDelay;
            data.hasRun = false;
            data.runEvents = true;
            data.timer.restart(opts.delay >= 0 ? opts.delay : data.delay);
        });
    },
    rebind: function (options) {
        return $(this).each(function (tileIndex, ele) {
            if (typeof (options) !== "undefined") {
                if (typeof (options.timer) !== "undefined" && options.timer != null) {
                    options.timer.stop();
                }
                options.hasRun = false;
                pubMethods["init"].apply(ele, options);
            } else {
                pubMethods["init"].apply(ele, {});
            }
        });
    },
    destroy: function (options) {
        var t = typeof (options), opts;
        if (t === "undefined") {
            opts = {
                removeCss: false
            };
        } else if (t === "boolean") {
            opts = {
                removeCss: options
            };
        } else if (t === "object") {
            if (typeof (options.removeCss) === "undefined") {
                options.removeCss = false;
            }
            opts = options;
        }
        return $(this).each(function (tileIndex, ele) {
            var $tile = $(ele);
            var data = $tile.data("LiveTile");
            if (typeof (data) === "undefined")
                return;
            $tile.unbind(".liveTile");
            var resetCss = helperMethods.appendStyleProperties({ margin: '', cursor: '' }, ['transform', 'transition'], ['', '']);
            data.timer.stop();
            window.clearTimeout(data.eventTimeout);
            window.clearTimeout(data.flCompleteTimeout);
            window.clearTimeout(data.completeTimeout);
            if (data.faces.$listTiles != null) {
                data.faces.$listTiles.each(function (idx, li) {
                    var $li = $(li);
                    if (data.mode === "flip-list") {
                        var ldata = $li.data("metrojs.tile");
                        window.clearTimeout(ldata.eventTimeout);
                        window.clearTimeout(ldata.flCompleteTimeout);
                        window.clearTimeout(ldata.completeTimeout);
                    } else if (data.mode === "carousel") {
                        var sdata = data.listData[idx];
                        if (sdata.bounce) {
                            privMethods.unbindMsBounce($li, sdata);
                        }
                    }
                    if (opts.removeCss) {
                        $li.removeClass("ha");
                        $li.find(data.tileFaceSelector)
                            .unbind(".liveTile")
                            .removeClass("bounce flip-front flip-back ha slide slide-front slide-back")
                            .css(resetCss);
                    } else {
                        $li.find(data.tileFaceSelector).unbind(".liveTile");
                    }
                    $li.removeData("metrojs.tile");
                }).unbind(".liveTile");
            }
            if (data.faces.$front != null && opts.removeCss) {
                data.faces.$front.removeClass("flip-front flip-back ha slide slide-front slide-back")
                    .css(resetCss);
            }
            if (data.faces.$back != null && opts.removeCss) {
                data.faces.$back.removeClass("flip-front flip-back ha slide slide-front slide-back")
                    .css(resetCss);
            }
            // remove the bounce and hover methods
            // todo: combine all mouse/touch events (down, move, up)
            if (data.bounce) {
                privMethods.unbindMsBounce($tile, data);
            }
            if (data.playOnHover) {
                privMethods.unbindMsPlayOnHover($tile, data);
            }
            if (data.pauseOnhover) {
                privMethods.unbindMsPauseOnHover($tile, data);
            }
            $tile.removeClass("ha");
            $tile.removeData("LiveTile");
            $tile.removeData("metrojs.tile");
            data = null;
        });
    }
};

// private methods that are called by .liveTile
var privMethods = {
    //getDataOrDefault for older versions of jQuery that dont look for 'data-' properties
    dataAtr: function ($ele, name, def) {
        return typeof ($ele.attr('data-' + name)) !== "undefined" ? $ele.attr('data-' + name) : def;
    },
    dataMethod: function ($ele, name, def) {
        return typeof ($ele.data(name)) !== "undefined" ? $ele.data(name) : def;
    },
    getDataOrDefault: null,
    initTileData: function ($tile, stgs) {
        var useData = stgs.ignoreDataAttributes == false,
            tdata = null;
        if (this.getDataOrDefault == null)
            this.getDataOrDefault = metrojs.capabilities.isOldJQuery ? this.dataAtr : this.dataMethod;
        if (useData) {
            tdata = { //an object to store settings for later access                
                speed: this.getDataOrDefault($tile, "speed", stgs.speed),
                delay: this.getDataOrDefault($tile, "delay", stgs.delay),
                stops: this.getDataOrDefault($tile, "stops", stgs.stops),
                stack: this.getDataOrDefault($tile, "stack", stgs.stack),
                mode: this.getDataOrDefault($tile, "mode", stgs.mode),
                direction: this.getDataOrDefault($tile, "direction", stgs.direction),
                useHardwareAccel: this.getDataOrDefault($tile, "ha", stgs.useHardwareAccel),
                repeatCount: this.getDataOrDefault($tile, "repeat", stgs.repeatCount),
                swap: this.getDataOrDefault($tile, "swap", stgs.swap),
                appendBack: this.getDataOrDefault($tile, "appendback", stgs.appendBack),
                currentIndex: this.getDataOrDefault($tile, "start-index", stgs.currentIndex),
                animationDirection: this.getDataOrDefault($tile, "slide-direction", stgs.animationDirection),
                startNow: this.getDataOrDefault($tile, "start-now", stgs.startNow),
                tileSelector: this.getDataOrDefault($tile, "tile-selector", stgs.tileSelector),
                tileFaceSelector: this.getDataOrDefault($tile, "face-selector", stgs.tileFaceSelector),
                bounce: this.getDataOrDefault($tile, "bounce", stgs.bounce),
                bounceDirections: this.getDataOrDefault($tile, "bounce-dir", stgs.bounceDirections),
                bounceFollowsMove: this.getDataOrDefault($tile, "bounce-follows", stgs.bounceFollowsMove),
                click: this.getDataOrDefault($tile, "click", stgs.click),
                link: this.getDataOrDefault($tile, "link", stgs.link),
                newWindow: this.getDataOrDefault($tile, "new-window", stgs.newWindow),
                alwaysTrigger: this.getDataOrDefault($tile, "always-trigger", stgs.alwaysTrigger),
                flipListOnHover: this.getDataOrDefault($tile, "flip-onhover", stgs.flipListOnHover),
                pauseOnHover: this.getDataOrDefault($tile, "pause-onhover", stgs.pauseOnHover),
                playOnHover: this.getDataOrDefault($tile, "play-onhover", stgs.playOnHover),
                onHoverDelay: this.getDataOrDefault($tile, "hover-delay", stgs.onHoverDelay),
                noHAflipOpacity: this.getDataOrDefault($tile, "flip-opacity", stgs.noHAflipOpacity),
                useTranslate: this.getDataOrDefault($tile, "use-translate", stgs.useTranslate),
                runEvents: false,
                isReversed: false,
                loopCount: 0,
                contentModules: [],
                listData: [],
                height: $tile.height(),
                width: $tile.width(),
                tempValues: {}
            };
        } else {
            tdata = $.extend(true,{
                runEvents: false,
                isReversed: false,
                loopCount: 0,
                contentModules: [],
                listData: [],
                height: $tile.height(),
                width: $tile.width(),
                tempValues: {}
            }, stgs);
        }
        tdata.useTranslate = tdata.useTranslate && tdata.useHardwareAccel && metrojs.capabilities.canTransform && metrojs.capabilities.canTransition;
        // set the margin to half of the height or width based on the direction
        tdata.margin = (tdata.direction === "vertical") ? tdata.height / 2 : tdata.width / 2;
        // convert stops if needed
        tdata.stops = (typeof (stgs.stops) === "object" && (stgs.stops instanceof Array)) ? stgs.stops : ("" + tdata.stops).split(",");
        // add a return stop
        if (tdata.stops.length === 1)
            tdata.stops.push("0px");
        // add content modules, start with global swaps            
        var swaps = tdata.swap.replace(' ', '').split(",");
        // get the front and back swap data
        var sf = useData ? this.getDataOrDefault($tile, "swap-front", stgs.swapFront) : stgs.swapFront;
        var sb = useData ? this.getDataOrDefault($tile, "swap-back", stgs.swapBack) : stgs.swapBack;
        // set the data to the global value if its still the default
            tdata.swapFront = sf === '-' ? swaps : sf.replace(' ', '').split(",");
        tdata.swapBack = sb === '-' ? swaps : sb.replace(' ', '').split(",");
        // make sure the swaps includes all front and back swaps
        var i;
        for (i = 0; i < tdata.swapFront.length; i++) {
            if (tdata.swapFront[i].length > 0 && $.inArray(tdata.swapFront[i], swaps) === -1)
                swaps.push(tdata.swapFront[i]);
        }
        for (i = 0; i < tdata.swapBack.length; i++) {
            if (tdata.swapBack[i].length > 0 && $.inArray(tdata.swapBack[i], swaps) === -1)
                swaps.push(tdata.swapBack[i]);
        }
        tdata.swap = swaps;        
        // add all required content modules for the swaps
        for (i = 0; i < swaps.length; i++) {
                if (swaps[i].length > 0) {
                        var moduleIdx = $.fn.liveTile.contentModules.hasContentModule(swaps[i]);
                        if (moduleIdx > -1) {
                                tdata.contentModules.push($.fn.liveTile.contentModules.modules[moduleIdx]);
                        }
                }
        }
        // set the initDelay value to the delay if it's not set
        tdata.initDelay = useData ? this.getDataOrDefault($tile, "initdelay", stgs.initDelay) : stgs.initDelay;
        // if the delay is -1 call the triggerDelay function to get a value
        if (tdata.delay < -1)
            tdata.delay = stgs.triggerDelay(1);
        else if (tdata.delay < 0)
            tdata.delay = 3500 + (Math.random() * 4501);
        // match the delay value if less than 0
        if (tdata.initDelay < 0)
            tdata.initDelay = tdata.delay;
        // merge the objects
        var mergedData = {};
        for (i = 0; i < tdata.contentModules.length; i++)
            $.extend(mergedData, tdata.contentModules[i].data);
        $.extend(mergedData, stgs, tdata);
        // add flip-list / carousel data
        var $tiles;
        if (mergedData.mode === "flip-list") {
            $tiles = $tile.find(mergedData.tileSelector).not(".tile-title");
            $tiles.each(function (idx, ele) {
                var $li = $(ele);
                var ldata = {
                    direction: useData ? privMethods.getDataOrDefault($li, "direction", mergedData.direction) : mergedData.direction,
                    newWindow: useData ? privMethods.getDataOrDefault($li, "new-window", false) : false,
                    link: useData ? privMethods.getDataOrDefault($li, "link", "") : "",
                    faces: { $front: null, $back: null },
                    height: $li.height(),
                    width: $li.width(),
                    isReversed: false
                };
                ldata.margin = ldata.direction === "vertical" ? ldata.height / 2 : ldata.width / 2;
                mergedData.listData.push(ldata);
            });
        } else if (mergedData.mode === "carousel") {
            mergedData.stack = true;
            $tiles = $tile.find(mergedData.tileSelector).not(".tile-title");
            $tiles.each(function (idx, ele) {
                var $slide = $(ele);
                var sdata = {
                    bounce: useData ? privMethods.getDataOrDefault($slide, "bounce", false) : false,
                    bounceDirections: useData ? privMethods.getDataOrDefault($slide, "bounce-dir", "all") : "all",
                    link: useData ? privMethods.getDataOrDefault($slide, "link", "") : "",
                    newWindow: useData ? privMethods.getDataOrDefault($slide, "new-window", false) : false,
                    animationDirection: useData ? privMethods.getDataOrDefault($slide, "ani-direction", "") : "",
                    direction: useData ? privMethods.getDataOrDefault($slide, "direction", "") : ""
                };
                mergedData.listData.push(sdata);
            });
        }
        // get any additional options from the modules
        for (i = 0; i < tdata.contentModules.length; i++){
            if (typeof (mergedData.contentModules[i].initData) === "function")
                mergedData.contentModules[i].initData(mergedData, $tile);
        }
        tdata = null;
        return mergedData;
    },
    prepTile: function ($tile, tdata) {
        //add the mode to the tile if it's not already there.
        $tile.addClass(tdata.mode);
        var ret = {
            $tileFaces: null,     // all possible tile faces in a liveTile in a non list mode
            $listTiles: null,     // all possible tiles in a liveTile in a list mode
            $front: null,         // the front face of a tile in a non list mode
            $back: null          // the back face of a tile in a non list mode
        };
        var rotateDir, frontCss, backCss, tileCss;
        // prepare the tile based on the current mode
        switch (tdata.mode) {
            case "fade":
                // front and back tile faces
                ret.$tileFaces = $tile.find(tdata.tileFaceSelector).not(".tile-title");
                ret.$front = (tdata.faces.$front != null && tdata.faces.$front.length > 0) ?
                               tdata.faces.$front.addClass('fade-front') :
                               ret.$tileFaces.filter(":first").addClass('fade-front');
                // get back face from settings, via selector, or append it if necessary
                if (tdata.faces.$back != null && tdata.faces.$back.length > 0)    // use $back option
                    ret.$back = tdata.faces.$back.addClass('fade-back');
                else if (ret.$tileFaces.length > 1)                             // get the last tile face
                    ret.$back = ret.$tileFaces.filter(":last").addClass('fade-back');
                else if (tdata.appendBack)                                       // append the back tile
                    ret.$back = $('<div class="fade-back"></div>').appendTo($tile);
                else                                                            // just keep an empty placeholder
                    ret.$back = $('<div></div>');
                break;
            case "slide":
                // front and back tile faces
                ret.$tileFaces = $tile.find(tdata.tileFaceSelector).not(".tile-title");
                // get front face from settings or via selector
                ret.$front = (tdata.faces.$front != null && tdata.faces.$front.length > 0) ?
                                tdata.faces.$front.addClass('slide-front') :
                                ret.$tileFaces.filter(":first").addClass('slide-front'); // using :first for pre jQuery 1.4
                // get back face from settings, via selector, or append it if necessary
                if (tdata.faces.$back != null && tdata.faces.$back.length > 0)    // use $back option
                    ret.$back = tdata.faces.$back.addClass('slide-back');
                else if (ret.$tileFaces.length > 1)                             // get the last tile face
                    ret.$back = ret.$tileFaces.filter(":last").addClass('slide-back');
                else if (tdata.appendBack)                                       // append the back tile
                    ret.$back = $('<div class="slide-back"></div>').appendTo($tile);
                else                                                            // just keep an empty placeholder
                    ret.$back = $('<div></div>');
                // stack mode
                if (tdata.stack == true) {
                    var prop,
                        translate;
                    if (tdata.direction === "vertical") {
                        prop = "top",
                        translate = 'translate(0%, -100%) translateZ(0)';
                    } else {
                        prop = "left",
                        translate = 'translate(-100%, 0%) translateZ(0)';
                    }
                    backCss = {};
                    if (tdata.useTranslate)
                        helperMethods.appendStyleProperties(backCss, ['transform'], [translate]);
                    else
                        backCss[prop] = "-100%";
                    ret.$back.css(backCss);
                }
                $tile.data("metrojs.tile", { animating: false });
                if (metrojs.capabilities.canTransition && tdata.useHardwareAccel) {   // hardware accelerated :)                        
                    $tile.addClass("ha");
                    ret.$front.addClass("ha");
                    ret.$back.addClass("ha");
                }
                break;
            case "carousel":
                ret.$listTiles = $tile.find(tdata.tileSelector).not(".tile-title");
                var numberOfSlides = ret.$listTiles.length;
                $tile.data("metrojs.tile", { animating: false });
                tdata.currentIndex = Math.min(tdata.currentIndex, numberOfSlides - 1);
                ret.$listTiles.each(function (idx, ele) {
                    var $slide = $(ele).addClass("slide");
                    var sdata = tdata.listData[idx],
                        aniDir = typeof (sdata.animationDirection) === "string" && sdata.animationDirection.length > 0 ? sdata.animationDirection : tdata.animationDirection,
                        dir = typeof (sdata.direction) === "string" && sdata.direction.length > 0 ? sdata.direction : tdata.direction;
                    if (idx == tdata.currentIndex) {
                        $slide.addClass("active");
                    } else if (aniDir === "forward") {
                        if (dir === "vertical") {
                            tileCss = tdata.useTranslate ? helperMethods.appendStyleProperties({}, ['transform'], ['translate(0%, 100%) translateZ(0)']) :
                                                   { left: '0%', top: '100%' };
                            $slide.css(tileCss);
                        } else {
                            tileCss = tdata.useTranslate ? helperMethods.appendStyleProperties({}, ['transform'], ['translate(100%, 0%) translateZ(0)']) :
                                                   { left: '100%', top: '0%' };
                            $slide.css(tileCss);
                        }
                    } else if (aniDir === "backward") {
                        if (dir === "vertical") {
                            tileCss = tdata.useTranslate ? helperMethods.appendStyleProperties({}, ['transform'], ['translate(0%, -100%) translateZ(0)']) :
                                                   { left: '0%', top: '-100%' };
                            $slide.css(tileCss);
                        } else {
                            tileCss = tdata.useTranslate ? helperMethods.appendStyleProperties({}, ['transform'], ['translate(-100%, 0%) translateZ(0)']) :
                                                   { left: '-100%', top: '0%' };
                            $slide.css(tileCss);
                        }
                    }
                    // link and bounce can be bound per slide
                    // add the click handler and link property
                    privMethods.bindLink($slide, sdata);
                    // add the bounce effect
                    if (tdata.useHardwareAccel && metrojs.capabilities.canTransition)
                        privMethods.bindBounce($slide, sdata);
                    $slide = null;
                    sdata = null;
                });
                // hardware accelerated :)
                if (metrojs.capabilities.canFlip3d && tdata.useHardwareAccel) {
                    $tile.addClass("ha");
                    ret.$listTiles.addClass("ha");
                }
                break;
            case "flip-list":
                // the tile containers inside the list
                ret.$listTiles = $tile.find(tdata.tileSelector).not(".tile-title");
                ret.$listTiles.each(function (idx, ele) {
                    var $li = $(ele).addClass("tile-" + (idx + 1));
                    // add the flip class to the front face
                    var $lFront = $li.find(tdata.tileFaceSelector).filter(":first").addClass("flip-front").css({ margin: "0px" });
                    // append a back tile face if one isnt present
                    if ($li.find(tdata.tileFaceSelector).length === 1 && tdata.appendBack == true)
                        $li.append("<div></div>");
                    // add the flip class to the back face
                    var $lBack = $li.find(tdata.tileFaceSelector).filter(":last").addClass("flip-back").css({ margin: "0px" });
                    // update the tdata object with the faces
                    tdata.listData[idx].faces.$front = $lFront;
                    tdata.listData[idx].faces.$back = $lBack;
                    // set data for overrides and easy access
                    $li.data("metrojs.tile", {
                        animating: false,
                        count: 1,
                        completeTimeout: null,
                        flCompleteTimeout: null,
                        index: idx
                    });
                    var ldata = $li.data("metrojs.tile");
                    // add the hardware accelerated classes
                    if (metrojs.capabilities.canFlip3d && tdata.useHardwareAccel) {   // hardware accelerated :)
                        $li.addClass("ha");
                        $lFront.addClass("ha");
                        $lBack.addClass("ha");
                        rotateDir = tdata.listData[idx].direction === "vertical" ? "rotateX(180deg)" : "rotateY(180deg)";
                        backCss = helperMethods.appendStyleProperties({}, ["transform"], [rotateDir]);
                        $lBack.css(backCss);
                    } else { // not hardware accelerated :(
                        // the front tile face will take up the entire tile
                        frontCss = (tdata.listData[idx].direction === "vertical") ?
				{ height: '100%', width: '100%', marginTop: '0px', opacity: '1' } :
				{ height: '100%', width: '100%', marginLeft: '0px', opacity: '1' };
                        // the back tile face is hidden by default and expanded halfway through a flip
                        backCss = (tdata.listData[idx].direction === "vertical") ?
				{ height: '0px', width: '100%', marginTop: tdata.listData[idx].margin + 'px', opacity: tdata.noHAflipOpacity } :
				{ height: '100%', width: '0px', marginLeft: tdata.listData[idx].margin + 'px', opacity: tdata.noHAflipOpacity };
                        $lFront.css(frontCss);
                        $lBack.css(backCss);
                    }
                    var flipEnded = function () {
                        ldata.count++;
                        if (ldata.count >= MAX_LOOP_COUNT)
                            ldata.count = 1;
                    };
                    if (tdata.flipListOnHover) {
                        var event = tdata.flipListOnHoverEvent + ".liveTile";
                        $lFront.bind(event, function () {
                            privMethods.flip($li, ldata.count, tdata, flipEnded);
                        });
                        $lBack.bind(event, function () {
                            privMethods.flip($li, ldata.count, tdata, flipEnded);
                        });
                    }
                    if (tdata.listData[idx].link.length > 0) {
                        $li.css({ cursor: 'pointer' }).bind("click.liveTile", function () {
                            if (tdata.listData[idx].newWindow)
                                window.open(tdata.listData[idx].link);
                            else
                                window.location = tdata.listData[idx].link;
                        });
                    }
                });
                break;
            case "flip":
                // front and back tile faces
                ret.$tileFaces = $tile.find(tdata.tileFaceSelector).not(".tile-title");
                // get front face from settings or via selector
                ret.$front = (tdata.faces.$front != null && tdata.faces.$front.length > 0) ?
                                tdata.faces.$front.addClass('flip-front') :
                                ret.$tileFaces.filter(":first").addClass('flip-front');
                // get back face from settings, via selector, or append it if necessary
                if (tdata.faces.$back != null && tdata.faces.$back.length > 0) {
                    // use $back option
                    ret.$back = tdata.faces.$back.addClass('flip-back');
                } else if (ret.$tileFaces.length > 1) {
                    // get the last tile face
                    ret.$back = ret.$tileFaces.filter(":last").addClass('flip-back');
                } else if (tdata.appendBack) {
                    // append the back tile
                    ret.$back = $('<div class="flip-back"></div>').appendTo($tile);
                } else {
                    // just keep an empty placeholder
                    ret.$back = $('<div></div>');
                }
                $tile.data("metrojs.tile", { animating: false });
                if (metrojs.capabilities.canFlip3d && tdata.useHardwareAccel) {
                    // hardware accelerated :)
                    $tile.addClass("ha");
                    ret.$front.addClass("ha");
                    ret.$back.addClass("ha");
                    rotateDir = tdata.direction === "vertical" ? "rotateX(180deg)" : "rotateY(180deg)";
                    backCss = helperMethods.appendStyleProperties({}, ["transform"], [rotateDir]);
                    ret.$back.css(backCss);

                } else {
                    // not hardware accelerated :(
                    // the front tile face will take up the entire tile
                    frontCss = (tdata.direction === "vertical") ?
			{ height: '100%', width: '100%', marginTop: '0px', opacity: '1' } :
			{ height: '100%', width: '100%', marginLeft: '0px', opacity: '1' };
                    // the back tile face is hidden by default and expanded halfway through a flip
                    backCss = (tdata.direction === "vertical") ?
			{ height: '0%', width: '100%', marginTop: tdata.margin + 'px', opacity: '0' } :
			{ height: '100%', width: '0%', marginLeft: tdata.margin + 'px', opacity: '0' };
                    ret.$front.css(frontCss);
                    ret.$back.css(backCss);
                }
                break;
        }
        return ret;
    },
    bindPauseOnHover: function ($tile) {
        // stop the tile when hovered and resume after a delay
        (function () {
            var data = $tile.data("LiveTile"),
                isOver = false,
                isPending = false,
                pauseIn = (data.pauseOnHoverEvent == "both" || data.pauseOnHoverEvent == "mouseover" || data.pauseOnHoverEvent == "mouseenter"),
                pauseOut = (data.pauseOnHoverEvent == "both" || data.pauseOnHoverEvent == "mouseout" || data.pauseOnHoverEvent == "mouseleave");
            data.pOnHoverMethods = {
                pause: function () {
                    data.timer.pause();
                    if (data.mode === "flip-list") {
                        data.faces.$listTiles.each(function (idx, li) {
                            window.clearTimeout($(li).data("metrojs.tile").completeTimeout);
                        });
                    }
                },
                over: function (e) {
                    if (isOver || isPending)
                        return;
                    if (data.runEvents) {
                        isPending = true;
                        data.eventTimeout = window.setTimeout(function () {
                            isPending = false;
                            if (pauseOut)
                                isOver = true;
                            data.pOnHoverMethods.pause();
                        }, data.onHoverDelay);
                    }
                },
                out: function (e) {
                    if (isPending) {
                        window.clearTimeout(data.eventTimeout);
                        isPending = false;
                        return;
                    }
                    if (pauseIn) {
                        if (!isOver && !isPending)
                            return;
                        if (data.runEvents)
                            data.timer.start(data.hasRun ? data.delay : data.initDelay);
                    } else {
                        data.pOnHoverMethods.pause();
                    }                  
                    isOver = false;
                }
            };            
            if (!metrojs.capabilities.canTouch) {
                if (pauseIn)
                    $tile.bind("mouseover.liveTile", data.pOnHoverMethods.over);
                if (pauseOut)
                    $tile.bind("mouseout.liveTile", data.pOnHoverMethods.out);
            } else {
                if (window.navigator.msPointerEnabled) { // pointer
                    if (pauseIn)
                        $tile[0].addEventListener('MSPointerOver', data.pOnHoverMethods.over, false);
                    if (pauseOut)
                        $tile[0].addEventListener('MSPointerOut', data.pOnHoverMethods.out, false);
                } else { // touch events
                    if (pauseIn)
                        $tile.bind("touchstart.liveTile", data.pOnHoverMethods.over);
                    if (pauseOut)
                        $tile.bind("touchend.liveTile", data.pOnHoverMethods.out);
                }
            }
        })();
    },
    unbindMsPauseOnHover: function ($tile, data) {
        if (typeof (data.pOnHoverMethods) !== "undefined" && window.navigator.msPointerEnabled) {
            $tile[0].removeEventListener('MSPointerOver', data.pOnHoverMethods.over, false);
            $tile[0].removeEventListener('MSPointerOut', data.pOnHoverMethods.out, false);
        }
    },
    bindPlayOnHover: function ($tile, data) {
        // play the tile immediately when hovered
        (function () {
            var isOver = false,
                isPending = false,
                playIn = (data.playOnHoverEvent == "both" || data.playOnHoverEvent == "mouseover" || data.playOnHoverEvent == "mouseenter"),
                playOut = (data.playOnHoverEvent == "both" || data.playOnHoverEvent == "mouseout" || data.playOnHoverEvent == "mouseleave");
            data.onHoverMethods = {
                over: function (event) {
                    if (isOver || isPending || (data.bounce && data.bounceMethods.down != "no"))
                        return;
                    // if startNow is set use the opposite of isReversed so we're in sync            
                    var rev = (data.mode == "flip") || (data.startNow ? !data.isReversed : data.isReversed);
                    window.clearTimeout(data.eventTimeout);
                    if ((data.runEvents && rev) || !data.hasRun) {
                        isPending = true;
                        data.eventTimeout = window.setTimeout(function () {
                            isPending = false;
                            if(playOut)
                                isOver = true;
                            pubMethods["play"].apply($tile[0], [0]);
                        }, data.onHoverDelay);
                    }
                },
                out: function (event) {
                    if (isPending) {                        
                        window.clearTimeout(data.eventTimeout);
                        isPending = false;
                        return;
                    }
                    if (playIn) {
                        if (!isOver && !isPending) {                            
                            return;
                        }
                    }
                    window.clearTimeout(data.eventTimeout);
                    data.eventTimeout = window.setTimeout(function () {
                        var rev = (data.mode == "flip") || (data.startNow ? data.isReversed : !data.isReversed);
                        if (data.runEvents && rev) {
                            pubMethods["play"].apply($tile[0], [0]);
                        }
                        isOver = false;
                    }, data.speed + 200);
                }
            };            
            if (!metrojs.capabilities.canTouch) {                
                if (playIn)
                    $tile.bind('mouseenter.liveTile', data.onHoverMethods.over);
                if (playOut)
                    $tile.bind('mouseleave.liveTile', data.onHoverMethods.out);                
            } else {
                if (window.navigator.msPointerEnabled) { // pointer
                    if(playIn)
                        $tile[0].addEventListener('MSPointerDown', data.onHoverMethods.over, false);
                    // mouseleave gives a more consistent effect than out when the children are transformed
                    if(playOut)
                        $tile.bind("mouseleave.liveTile", data.onHoverMethods.out);
                } else { // touch events
                    if(playIn)
                        $tile.bind("touchstart.liveTile", data.onHoverMethods.over);
                    if(playOut)
                        $tile.bind("touchend.liveTile", data.onHoverMethods.out);
                }

            }
        })();
    },
    unbindMsPlayOnHover: function ($tile, data) {
        if (typeof (data.onHoverMethods) !== "undefined" && window.navigator.msPointerEnabled) {
            $tile[0].removeEventListener('MSPointerDown', data.onHoverMethods.over, false);
        }
    },
    bindBounce: function ($tile, data) {
        // add bounce
        if (data.bounce) {
            $tile.addClass("bounce");
            $tile.addClass("noselect");
            (function () {
                data.bounceMethods = {
                    down: "no",
                    threshold: 30,
                    zeroPos: { x: 0, y: 0 },
                    eventPos: { x: 0, y: 0 },
                    inTilePos: { x: 0, y: 0 },
                    pointPos: { x: 0, y: 0 },
                    regions: {
                        c: [0, 0],      // center
                        tl: [-1, -1],   // top left
                        tr: [1, -1],    // top right
                        bl: [-1, 1],    // bottom left
                        br: [1, 1],     // bottom right
                        t: [null, -1],  // top
                        r: [1, null],   // right
                        b: [null, 1],   // bottom
                        l: [-1, null]   // left
                    },
                    targets: {
                        all: ['c', 't', 'r', 'b', 'l', 'tl', 'tr', 'bl', 'br'],
                        edges: ['c', 't', 'r', 'b', 'l'],
                        corners: ['c', 'tl', 'tr', 'bl', 'br']
                    },
                    hitTest: function ($el, pos, targetRegions, omegaC) {
                        var regions = data.bounceMethods.regions,
                            checkFor = data.bounceMethods.targets[targetRegions],
                            i = 0,
                            strictMatch = null,
                            looseMatch = null,
                            defResult = { hit: [0, 0], name: 'c' };
                        // scale only for android 2.x and old ie
                        if (metrojs.capabilities.isOldAndroid || !metrojs.capabilities.canTransition)
                            return defResult;
                        if (typeof (checkFor) == "undefined") {
                            if (typeof (targetRegions) === "string")
                                checkFor = targetRegions.split(',');
                            // only default to center if explicitly requested
                            if ($.isArray(checkFor) && $.inArray('c') == -1) {
                                omegaC = 0;
                                defResult = null;
                            }
                        }
                        // check for a matching region
                        var w = $el.width(),
                           h = $el.height(),
                           // center threshold -  maximum amount from center
                           ct = [w * omegaC, h * omegaC],
                           // how far from the center is the point
                           diffX = pos.x - (w * 0.5),
                           diffY = pos.y - (h * 0.5),
                            // if we're beyond the center threshold, set -1 or 1 else 0
                           hit = [
                               diffX > 0 ? (Math.abs(diffX) <= ct[0] ? 0 : 1) : (Math.abs(diffX) <= ct[0] ? 0 : -1),
                               diffY > 0 ? (Math.abs(diffY) <= ct[1] ? 0 : 1) : (Math.abs(diffY) <= ct[1] ? 0 : -1)
                           ];
                        for (; i < checkFor.length; i++) {
                            if (strictMatch != null)
                                return strictMatch;
                            var r = checkFor[i],
                                region = regions[r];
                            if (r == "*") {
                                r = checkFor[i + 1];
                                return { region: regions[r], name: r };
                            }
                            if (hit[0] == region[0] && hit[1] == region[1]) {
                                // found the region with a strict lookup
                                strictMatch = { hit: region, name: r };
                            } else if ((hit[0] == region[0] || region[0] == null) && (hit[1] == region[1] || region[1] == null)) {
                                // found the region with a loose lookup
                                looseMatch = { hit: region, name: r };
                            }
                        }
                        // prefer a strict match
                        if (strictMatch != null)
                            return strictMatch;
                        else if (looseMatch != null)
                            return looseMatch;
                        else // no matches were found, return center
                            return defResult;
                    },
                    bounceDown: function (e) {
                        if (e.target.tagName == "A" && !$(e).is(".bounce"))
                            return;
                        var point = e.originalEvent && e.originalEvent.touches ? e.originalEvent.touches[0] : e,
                            offsetOfTile = $tile.offset(),
                            scrollX = window.pageXOffset,
                            scrollY = window.pageYOffset;
                        data.bounceMethods.pointPos = {
                            x: point.pageX,
                            y: point.pageY
                        };
                        data.bounceMethods.inTilePos = {
                            x: point.pageX - offsetOfTile.left,
                            y: point.pageY - offsetOfTile.top
                        };

                        if (!data.$tileParent) {
                            data.$tileParent = $tile.parent();
                        }
                        var offsetOfParent = data.$tileParent.offset();
                        data.bounceMethods.eventPos = {
                            x: (offsetOfTile.left - offsetOfParent.left) + ($tile.width() / 2),
                            y: (offsetOfTile.top - offsetOfParent.top) + ($tile.height() / 2)
                        };
                        var hit = data.bounceMethods.hitTest($tile, data.bounceMethods.inTilePos, data.bounceDirections, 0.25);
                        if (hit == null)
                            data.bounceMethods.down = "no";
                        else {
                            if (window.navigator.msPointerEnabled) {
                                document.addEventListener('MSPointerUp', data.bounceMethods.bounceUp, false);
                                $tile[0].addEventListener('MSPointerUp', data.bounceMethods.bounceUp, false);
                                document.addEventListener('MSPointerCancel', data.bounceMethods.bounceUp, false);
                                if (data.bounceFollowsMove)
                                    $tile[0].addEventListener('MSPointerMove', data.bounceMethods.bounceMove, false);
                            } else {
                                $(document).bind("mouseup.liveTile, touchend.liveTile, touchcancel.liveTile, dragstart.liveTile", data.bounceMethods.bounceUp);
                                if (data.bounceFollowsMove) {
                                    $tile.bind("touchmove.liveTile", data.bounceMethods.bounceMove);
                                    $tile.bind("mousemove.liveTile", data.bounceMethods.bounceMove);
                                }
                            }
                            var bClass = "bounce-" + hit.name;
                            $tile.addClass(bClass);
                            data.bounceMethods.down = bClass;
                            data.bounceMethods.downPcss = helperMethods.appendStyleProperties({}, ['perspective-origin'], [data.bounceMethods.eventPos.x + "px " + data.bounceMethods.eventPos.y + "px"]);                            
                            data.$tileParent.css(data.bounceMethods.downPcss);
                        }
                    },
                    bounceUp: function () {
                        if (data.bounceMethods.down != "no") {
                            data.bounceMethods.unBounce();
                            if (window.navigator.msPointerEnabled) {
                                document.removeEventListener('MSPointerUp', data.bounceMethods.bounceUp, false);
                                $tile[0].removeEventListener('MSPointerUp', data.bounceMethods.bounceUp, false);
                                document.removeEventListener('MSPointerCancel', data.bounceMethods.bounceUp, false);
                                if (data.bounceFollowsMove)
                                    $tile[0].removeEventListener('MSPointerMove', data.bounceMethods.bounceMove, false);

                            } else
                                $(document).unbind("mouseup.liveTile, touchend.liveTile, touchcancel.liveTile, dragstart.liveTile", data.bounceMethods.bounceUp);
                            if (data.bounceFollowsMove) {
                                $tile.unbind("touchmove.liveTile", data.bounceMethods.bounceMove);
                                $tile.unbind("mousemove.liveTile", data.bounceMethods.bounceMove);
                            }
                        }
                    },// not currently used
                    bounceMove: function (e) {
                        if (data.bounceMethods.down != "no") {
                            var point = e.originalEvent && e.originalEvent.touches ? e.originalEvent.touches[0] : e,
                                x = Math.abs(point.pageX - data.bounceMethods.pointPos.x),
                                y = Math.abs(point.pageY - data.bounceMethods.pointPos.y);
                            if (x > data.bounceMethods.threshold || y > data.bounceMethods.threshold) {
                                var bounceClass = data.bounceMethods.down;
                                data.bounceMethods.bounceDown(e);
                                if (bounceClass != data.bounceMethods.down)
                                    $tile.removeClass(bounceClass);
                            }
                        }
                    },
                    unBounce: function () {
                        $tile.removeClass(data.bounceMethods.down);
                        if (typeof (data.bounceMethods.downPcss) == "object") {
                            var names = ['perspective-origin', 'perspective-origin-x', 'perspective-origin-y'],
                                vals = ['', '', ''];
                            data.bounceMethods.downPcss = helperMethods.appendStyleProperties({}, names, vals);
                            // let the bounce finish and then strip out the perspective
                            window.setTimeout(function () {
                                data.$tileParent.css(data.bounceMethods.downPcss);
                            }, 200);
                        }
                        data.bounceMethods.down = "no";
                        data.bounceMethods.inTilePos = data.bounceMethods.zeroPos;
                        data.bounceMethods.eventPos = data.bounceMethods.zeroPos;
                    }
                };
                // IE 10+
                if (window.navigator.msPointerEnabled) {// touch only -> // && window.navigator.msMaxTouchPoints) {
                    $tile[0].addEventListener('MSPointerDown', data.bounceMethods.bounceDown, false);
                } else if (metrojs.capabilities.canTouch) {
                    // everybody else                    
                    $tile.bind("touchstart.liveTile", data.bounceMethods.bounceDown);

                } else {
                    $tile.bind("mousedown.liveTile", data.bounceMethods.bounceDown);
                }
            })();
        }
    },
    unbindMsBounce: function ($tile, data) {
        if (data.bounce && window.navigator.msPointerEnabled) {// touch only -> // && window.navigator.msMaxTouchPoints) {
            $tile[0].removeEventListener('MSPointerDown', data.bounceMethods.bounceDown, false);
            $tile[0].removeEventListener('MSPointerCancel', data.bounceMethods.bounceUp, false);
            $tile[0].removeEventListener('MSPointerOut', data.bounceMethods.bounceUp, false);
            //$tile[0].removeEventListener('MSPointerMove', data.bounceMethods.bounceMove, false);
        }
    },
    bindLink: function ($tile, data) {
        if (data.link.length > 0) {
            $tile.css({ cursor: 'pointer' }).bind("click.liveTile", function (e) {
                if (e.target.tagName == "A" && !$(e).is(".live-tile,.slide,.flip"))
                    return;
                if (data.newWindow)
                    window.open(data.link);
                else
                    window.location = data.link;
            });
        }
    },
    runContenModules: function (data, $front, $back, index) {
        for (var i = 0; i < data.contentModules.length; i++) {
                var currentModule = data.contentModules[i];
                if (typeof (currentModule.action) == "function")
                        currentModule.action(data, $front, $back, index);
            }
    },
    fade: function ($tile, count, data) {
        var tdata = typeof (data) === "object" ? data : $tile.data("LiveTile"),
            resumeTimer = function () {
                // if the tile should run again start the timer back with the current delay
                if (tdata.timer.repeatCount > 0 || tdata.timer.repeatCount == -1) {
                    if (tdata.timer.count != tdata.timer.repeatCount) {
                        tdata.timer.start(tdata.delay);
                    }
                }
            };

        if (tdata.faces.$front.is(":animated"))
            return;
        tdata.timer.pause();
        var loopCount = tdata.loopCount + 1;
        tdata.isReversed = loopCount % 2 === 0; // the count starts at 1
        var start = tdata.animationStarting.call($tile[0], tdata, tdata.faces.$front, tdata.faces.$back);
        if (typeof (start) != "undefined" && start == false) {
            resumeTimer();
            return;
        }
        tdata.loopCount = loopCount;
        var faded = function () {
            resumeTimer();
            // run content modules and animationComplete callback
            privMethods.runContenModules(tdata, tdata.faces.$front, tdata.faces.$back);
            tdata.animationComplete.call($tile[0], tdata, tdata.faces.$front, tdata.faces.$back);
        };
        if (tdata.isReversed)
            tdata.faces.$front.fadeIn(tdata.speed, tdata.noHaTransFunc, faded);
        else
            tdata.faces.$front.fadeOut(tdata.speed, tdata.noHaTransFunc, faded);
    },
    slide: function ($tile, count, data, stopIndex, callback) {
        var tdata = typeof (data) === "object" ? data : $tile.data("LiveTile"),
            aniData = $tile.data("metrojs.tile");
        if (aniData.animating == true || $tile.is(":animated")) {
            tdata = null;
            aniData = null;
            return;
        }
        var resumeTimer = function () {
            // if the tile should run again start the timer back with the current delay
            if (tdata.timer.repeatCount > 0 || tdata.timer.repeatCount == -1) {
                if (tdata.timer.count != tdata.timer.repeatCount) {
                    tdata.timer.start(tdata.delay);
                }
            }
        };
        if (tdata.mode !== "carousel") {
            tdata.isReversed = tdata.currentIndex % 2 !== 0;  // the count starts at 1
            // carousel mode maintains its own timer
            tdata.timer.pause();
            var start = tdata.animationStarting.call($tile[0], tdata, tdata.faces.$front, tdata.faces.$back);
            if (typeof (start) != "undefined" && start == false) {
                resumeTimer();
                return;
            }
            tdata.loopCount = tdata.loopCount + 1;
        } else {
            // in carousel mode the face that just left the stage is always the $back
            tdata.isReversed = true;
        }
        // get temp values passed in from data methods
        var direction;
        if (typeof (tdata.tempValues.direction) === "string" && tdata.tempValues.direction.length > 0)
            direction = tdata.tempValues.direction;
        else
            direction = tdata.direction;
        tdata.tempValues.direction = null;
        var css = {},
            cssback = {},
            // the stop index is overridden in carousel mode
            stopIdx = typeof (stopIndex) === "undefined" ? tdata.currentIndex : stopIndex,
            stop = $.trim(tdata.stops[Math.min(stopIdx, tdata.stops.length - 1)]),
            pxIdx = stop.indexOf('px'),
            offset = 0,
            amount = 0,
            metric = (direction === "vertical") ? tdata.height : tdata.width,
            tProp = (direction === "vertical") ? "top" : "left",
            stack = tdata.stack == true;
        // when the slide is complete increment the index or call the callback
        var slideFinished = function () {
            if (typeof (callback) === "undefined") {
                tdata.currentIndex = tdata.currentIndex + 1;
                if (tdata.currentIndex > tdata.stops.length - 1) {
                    tdata.currentIndex = 0;
                }
            } else {
                callback();
            }
            if (tdata.mode != "carousel") {
                resumeTimer();
            }
            // run content modules and animationComplete callback            
            privMethods.runContenModules(tdata, tdata.faces.$front, tdata.faces.$back, tdata.currentIndex);
            tdata.animationComplete.call($tile[0], tdata, tdata.faces.$front, tdata.faces.$back);
            tdata = null;
            aniData = null;
        };
        if (pxIdx > 0) {
            amount = parseInt(stop.substring(0, pxIdx), 10);
            offset = (amount - metric) + 'px';
        } else {
            //is a percentage
            amount = parseInt(stop.replace('%', ''), 10);
            offset = (amount - 100) + '%';
        }
        // hardware accelerated :)
        if (metrojs.capabilities.canTransition && tdata.useHardwareAccel) {
            if (typeof (aniData.animating) !== "undefined" && aniData.animating == true)
                return;
            aniData.animating = true;
            var props = ['transition-property', 'transition-duration', 'transition-timing-function'],
                vals = [tdata.useTranslate ? "transform" : tProp, tdata.speed + 'ms', tdata.haTransFunc];
            vals[helperMethods.browserPrefix + 'transition-property'] = helperMethods.browserPrefix + "transform";
            css = helperMethods.appendStyleProperties(css, props, vals);
            cssback = helperMethods.appendStyleProperties(cssback, props, vals);
            var vertical = direction === "vertical",
                prop = vertical ? "top" : "left",
                translateTo;
            if (!tdata.useTranslate) {
                css[prop] = stop;
                if (stack)
                    cssback[prop] = offset;
            } else {
                translateTo = vertical ? "translate(0%, " + stop + ")" : "translate(" + stop + ", 0%)";
                css = helperMethods.appendStyleProperties(css, ['transform'], [translateTo + "translateZ(0)"]);
                if (stack) {
                    translateTo = vertical ? "translate(0%, " + offset + ")" : "translate(" + offset + ", 0%)";
                    cssback = helperMethods.appendStyleProperties(cssback, ['transform'], [translateTo + "translateZ(0)"]);
                }
            }
            tdata.faces.$front.css(css);
            if (stack)
                tdata.faces.$back.css(cssback);
            window.clearTimeout(tdata.completeTimeout);
            tdata.completeTimeout = window.setTimeout(function () {
                aniData.animating = false;
                slideFinished();
            }, tdata.speed);
        } else {
            // not hardware accelerated :(
            css[tProp] = stop;
            cssback[tProp] = offset;
            aniData.animating = true;
            var $front = tdata.faces.$front.stop(),
                $back = tdata.faces.$back.stop();
            $front.animate(css, tdata.speed, tdata.noHaTransFunc, function () {
                aniData.animating = false;
                slideFinished();
            });
            // change the css value to the offset
            if (stack)
                $back.animate(cssback, tdata.speed, tdata.noHaTransFunc, function () { });
        }
    },
    carousel: function ($tile, count) {
        var tdata = $tile.data("LiveTile");
        // dont update css or call slide if animated or if there's only one face
        var aniData = $tile.data("metrojs.tile");
        if (aniData.animating == true || tdata.faces.$listTiles.length <= 1) {
            aniData = null;
            return;
        }
        var resumeTimer = function () {
            if (tdata.timer.repeatCount > 0 || tdata.timer.repeatCount == -1) {
                if (tdata.timer.count != tdata.timer.repeatCount) {
                    tdata.timer.start(tdata.delay);
                }
            }
        };
        // pause the timer and use a per slide delay
        tdata.timer.pause();
        var $cur = tdata.faces.$listTiles.filter(".active"),
            idx = tdata.faces.$listTiles.index($cur),
            goTo = tdata.currentIndex,
            eq = goTo != idx ? goTo : idx,
            nxtIdx = eq + 1 >= tdata.faces.$listTiles.length ? 0 : eq + 1,
            sdata = tdata.listData[nxtIdx];
        if (idx == nxtIdx) {
            aniData = null;
            $cur = null;
            return;
        }
        // get temp values passed in from data methods
        var animationDirection;
        if (typeof (tdata.tempValues.animationDirection) === "string" && tdata.tempValues.animationDirection.length > 0)
            animationDirection = tdata.tempValues.animationDirection;
        else if (typeof (sdata.animationDirection) === "string" && sdata.animationDirection.length > 0) {
            animationDirection = sdata.animationDirection;
        } else
            animationDirection = tdata.animationDirection;
        // the temp value for animation direction is not used in slide so i'm setting it to null
        tdata.tempValues.animationDirection = null;
        var direction;
        if (typeof (tdata.tempValues.direction) === "string" && tdata.tempValues.direction.length > 0) {
            direction = tdata.tempValues.direction;
        } else if (typeof (sdata.direction) === "string" && sdata.direction.length > 0) {
            direction = sdata.direction;
            tdata.tempValues.direction = direction;
        } else {
            direction = tdata.direction;
        }
        var $nxt = tdata.faces.$listTiles.eq(nxtIdx),
            start = tdata.animationStarting.call($tile[0], tdata, $cur, $nxt);
        if (typeof (start) != "undefined" && start == false) {
            resumeTimer();
            return;
        }
        tdata.loopCount = tdata.loopCount + 1;
        var nxtCss = helperMethods.appendStyleProperties({}, ['transition-duration'], ['0s']),
            vertical = direction === "vertical",
            translateTo;
        if (animationDirection === "backward") {
            if (!tdata.useTranslate || !metrojs.capabilities.canTransition) {
                if (vertical) {
                    nxtCss.top = "-100%";
                    nxtCss.left = "0%";
                } else {
                    nxtCss.top = "0%";
                    nxtCss.left = "-100%";
                }
                tdata.stops = ['100%'];
            } else {
                translateTo = vertical ? "translate(0%, -100%)" : "translate(-100%, 0%)";
                nxtCss = helperMethods.appendStyleProperties(nxtCss, ["transform"], [translateTo + " translateZ(0)"]);
                tdata.stops = ['100%'];
            }
            tdata.faces.$front = $cur;
            tdata.faces.$back = $nxt;

        } else {
            if (!tdata.useTranslate || !metrojs.capabilities.canTransition) {
                if (vertical) {
                    nxtCss.top = "100%";
                    nxtCss.left = "0%";
                } else {
                    nxtCss.top = "0%";
                    nxtCss.left = "100%";
                }
            } else {
                translateTo = vertical ? "translate(0%, 100%)" : "translate(100%, 0%)";
                nxtCss = helperMethods.appendStyleProperties(nxtCss, ["transform"], [translateTo + " translateZ(0)"]);
            }
            tdata.faces.$front = $nxt;
            tdata.faces.$back = $cur;
            tdata.stops = ['0%'];
        }
        $nxt.css(nxtCss);
        // the timeout wrapper gives the css call above enough time to finish in case we dynamically set the direction
        window.setTimeout(function () {
            $cur.removeClass("active");
            $nxt.addClass("active");
            privMethods.slide($tile, count, tdata, 0, function () {
                tdata.currentIndex = nxtIdx;
                aniData = null;
                $cur = null;
                $nxt = null;
                resumeTimer();
            });
        }, 150);

    },
    flip: function ($tile, count, data, callback) {
        var aniData = $tile.data("metrojs.tile");
        if (aniData.animating == true) {
            aniData = null;
            return;
        }
        var tdata = typeof (data) === "object" ? data : $tile.data("LiveTile");
        var $front, $back, direction, deg, rotateDir, css,
            raiseEvt = typeof (callback) === "undefined",
            index = 0,
            isReversed,  // the count starts at 1
            resumeTimer = function () {
                // if the tile should run again start the timer back with the current delay
                if (tdata.timer.repeatCount > 0 || tdata.timer.repeatCount == -1) {
                    if (tdata.timer.count != tdata.timer.repeatCount) {
                        tdata.timer.start(tdata.delay);
                    }
                }
            };
        // the timer is only paused if animationComplete is fired
        if (raiseEvt) {
            tdata.timer.pause();
            var loopCount = tdata.loopCount + 1;
            isReversed = loopCount % 2 === 0;
            tdata.isReversed = isReversed;
            $front = tdata.faces.$front;
            $back = tdata.faces.$back;
            var args = isReversed ? [tdata, $back, $front] : [tdata, $front, $back];
            var start = tdata.animationStarting.apply($tile[0], args);
            if (typeof (start) != "undefined" && start == false) {
                resumeTimer();
                return;
            }
            direction = tdata.direction;
            height = tdata.height;
            width = tdata.width;
            margin = tdata.margin;
            tdata.loopCount = loopCount;
        } else {
            isReversed = count % 2 === 0;
            index = aniData.index;
            $front = tdata.listData[index].faces.$front;
            $back = tdata.listData[index].faces.$back;
            tdata.listData[index].isReversed = isReversed;
            direction = tdata.listData[index].direction;
            height = tdata.listData[index].height;
            width = tdata.listData[index].width;
            margin = tdata.listData[index].margin;
        }

        if (metrojs.capabilities.canFlip3d && tdata.useHardwareAccel) { // Hardware accelerated :)
            deg = !isReversed ? "180deg" : "360deg";
            rotateDir = direction === "vertical" ? "rotateX(" + deg + ")" : "rotateY(" + deg + ")";
            css = helperMethods.appendStyleProperties({}, ["transform", "transition"], [rotateDir, "all " + tdata.speed + "ms " + tdata.haTransFunc + " 0s"]);
            var bDeg = !isReversed ? "360deg" : "540deg";
            var bRotateDir = direction === "vertical" ? "rotateX(" + bDeg + ")" : "rotateY(" + bDeg + ")";
            var bCss = helperMethods.appendStyleProperties({}, ["transform", "transition"], [bRotateDir, "all " + tdata.speed + "ms " + tdata.haTransFunc + " 0s"]);
            $front.css(css);
            $back.css(bCss);

            var action = function () {
                aniData.animating = false;
                var resetDir, newCss;
                if (!isReversed) {                    
                    privMethods.runContenModules(tdata, $back, $front, index);
                    if (raiseEvt) {
                        resumeTimer();
                        tdata.animationComplete.call($tile[0], tdata, $back, $front);
                    } else
                        callback(tdata, $back, $front);
                } else {
                    resetDir = direction === "vertical" ? "rotateX(0deg)" : "rotateY(0deg)";
                    newCss = helperMethods.appendStyleProperties({}, ["transform", "transition"], [resetDir, "all 0s " + tdata.haTransFunc + " 0s"]);
                    $front.css(newCss);
                    //call content modules
                    privMethods.runContenModules(tdata, $front, $back, index);
                    if (raiseEvt) {
                        resumeTimer();
                        tdata.animationComplete.call($tile[0], tdata, $front, $back);
                    } else
                        callback(tdata, $front, $back);
                    $front = null;
                    $back = null;
                    tdata = null;
                    aniData = null;
                }
            };
            if (tdata.mode === "flip-list") {
                window.clearTimeout(tdata.listData[index].completeTimeout);
                tdata.listData[index].completeTimeout = window.setTimeout(action, tdata.speed);
            } else {
                window.clearTimeout(tdata.completeTimeout);
                tdata.completeTimeout = window.setTimeout(action, tdata.speed);
            }
        } else { // not Hardware accelerated :(
            var speed = tdata.speed / 2;
            var hideCss = (direction === "vertical") ?
						{ height: '0px', width: '100%', marginTop: margin + 'px', opacity: tdata.noHAflipOpacity } :
						{ height: '100%', width: '0px', marginLeft: margin + 'px', opacity: tdata.noHAflipOpacity };
            var showCss = (direction === "vertical") ?
                        { height: '100%', width: '100%', marginTop: '0px', opacity: '1' } :
                        { height: '100%', width: '100%', marginLeft: '0px', opacity: '1' };
            var noHaAction;
            if (!isReversed) {
                aniData.animating = true;
                $front.stop().animate(hideCss, { duration: speed });
                noHaAction = function () {
                    aniData.animating = false;
                    $back.stop().animate(showCss, {
                        duration: speed,
                        complete: function () {
                            privMethods.runContenModules(tdata, $back, $front, index);
                            if (raiseEvt) {
                                resumeTimer();
                                tdata.animationComplete.call($tile[0], tdata, $back, $front);
                            } else
                                callback(tdata, $back, $front);
                            $front = null;
                            $back = null;
                            tdata = null;
                            aniData = null;
                        }
                    });
                };
                if (tdata.mode === "flip-list") {
                    window.clearTimeout(tdata.listData[aniData.index].completeTimeout);
                    tdata.listData[aniData.index].completeTimeout = window.setTimeout(noHaAction, speed);
                } else {
                    window.clearTimeout(tdata.completeTimeout);
                    tdata.completeTimeout = window.setTimeout(noHaAction, speed);
                }
            } else {
                aniData.animating = true;
                $back.stop().animate(hideCss, { duration: speed });
                noHaAction = function () {
                    aniData.animating = false;
                    $front.stop().animate(showCss, {
                        duration: speed,
                        complete: function () {                            
                            privMethods.runContenModules(tdata, $front, $back, index);
                            if (raiseEvt) {
                                resumeTimer();
                                tdata.animationComplete.call($tile[0], tdata, $front, $back);
                            } else
                                callback(tdata, $front, $back);
                            aniData = null;
                            $front = null;
                            $back = null;
                        }
                    });
                };
                if (tdata.mode === "flip-list") {
                    window.clearTimeout(tdata.listData[aniData.index].completeTimeout);
                    tdata.listData[aniData.index].completeTimeout = window.setTimeout(noHaAction, speed);
                } else {
                    window.clearTimeout(tdata.completeTimeout);
                    tdata.completeTimeout = window.setTimeout(noHaAction, speed);
                }
            }

        }
    },
    flipList: function ($tile, count) {
        var tdata = $tile.data("LiveTile"),
            maxDelay = tdata.speed,
            triggered = false,
            resumeTimer = function () {
                if (tdata.timer.repeatCount > 0 || tdata.timer.repeatCount == -1) {
                    if (tdata.timer.count != tdata.timer.repeatCount) {
                        tdata.timer.start(tdata.delay);
                    }
                }
            };
        tdata.timer.pause();
        var start = tdata.animationStarting.call($tile[0], tdata, null, null);
        if (typeof (start) != "undefined" && start == false) {
            resumeTimer();
            return;
        }
        tdata.loopCount = tdata.loopCount + 1;
        tdata.faces.$listTiles.each(function (idx, ele) {
            var $li = $(ele),
                ldata = $li.data("metrojs.tile"),
                tDelay = tdata.triggerDelay(idx),
                triggerDelay = tdata.speed + Math.max(tDelay, 0),
                trigger = tdata.alwaysTrigger;
            if (!trigger)
                trigger = (Math.random() * 351) > 150 ? true : false;
            if (trigger) {
                triggered = true;
                maxDelay = Math.max(triggerDelay + tdata.speed, maxDelay);
                window.clearTimeout(ldata.flCompleteTimeout);
                ldata.flCompleteTimeout = window.setTimeout(function () {
                    // call the flip method with the merged data, but dont fire animationComplete
                    privMethods.flip($li, ldata.count, tdata, function (data) {
                        ldata.count++;
                        if (ldata.count >= MAX_LOOP_COUNT)
                            ldata.count = 1;
                        $li = null;
                        ldata = null;
                    });
                }, triggerDelay);
            }
        });
        if (triggered) {
            window.clearTimeout(tdata.flCompleteTimeout);
            tdata.flCompleteTimeout = window.setTimeout(function () {
                privMethods.runContenModules(tdata, null, null, -1);
                tdata.animationComplete.call($tile[0], tdata, null, null);
                resumeTimer();
            }, maxDelay + tdata.speed); // add some padding to make sure the final callback finished

        }
    }
};


// methods that can be called more universally
var helperMethods = {
    stylePrefixes: 'Webkit Moz O ms Khtml '.split(' '),
    domPrefixes: '-webkit- -moz- -o- -ms- -khtml- '.split(' '),
    browserPrefix: null,
    // a method to append css3 properties for each browser
    // note: values are identical for each property
    appendStyleProperties: function (obj, names, values) {
        for (var i = 0; i <= names.length - 1; i++) {
            obj[$.trim(this.browserPrefix + names[i])] = values[i];
            obj[$.trim(names[i])] = values[i];
        }
        return obj;
    },
    applyStyleValue: function (obj, name, value) {        
            obj[$.trim(this.browserPrefix + name)] = value;
            obj[name] = value;
        return obj;
    },
    getBrowserPrefix: function () {
        if (this.browserPrefix == null) {
            var prefix = "";
            for (var i = 0; i <= this.domPrefixes.length - 1; i++) {
                if (typeof (document.body.style[this.domPrefixes[i] + "transform"]) != "undefined")
                    prefix = this.domPrefixes[i];
            }
            return this.browserPrefix = prefix;
        }
        return this.browserPrefix;
    },    
    //a shuffle method to provide more randomness than sort
    //credit: http://javascript.about.com/library/blshuffle.htm
    //note: avoiding prototype for sharepoint compatability
    shuffleArray: function (array) {
        var s = [];
        while (array.length) s.push(array.splice(Math.random() * array.length, 1));
        while (s.length) array.push(s.pop());
        return array;
    }
};

var defaultModules = {
        moduleName: 'custom',
    customSwap: {
        data: {
            customDoSwapFront: function () { return false; },
            customDoSwapBack: function () { return false; },
            customGetContent: function (tdata, $front, $back, index) { return null; }
        },
        initData: function (tdata, $ele) {
            var swapData = {};
            swapData.doSwapFront = $.inArray('custom', tdata.swapFront) > -1 && tdata.customDoSwapFront();
            swapData.doSwapBack = $.inArray('custom', tdata.swapBack) > -1 && tdata.customDoSwapBack();
            if (typeof (tdata.customSwap) !== "undefined")
                tdata.customSwap = $.extend(swapData, tdata.customSwap);
            else
                tdata.customSwap = swapData;
        },
        action: function (tdata, $front, $back, index) {

        }
    },
    htmlSwap: {
        moduleName: 'html',
        data: { // public data for the swap module                
            frontContent: [],                       // a list of html to use for the front
            frontIsRandom: true,                    // should html be chosen at random or in order                
            frontIsInGrid: false,                   // only chooses one item for each iteration in flip-list                
            backContent: [],                        // a list of html to use for the back
            backIsRandom: true,                     // should html be chosen at random or in order                
            backIsInGrid: false                     // only chooses one item for each iteration in flip-list                
        },
        initData: function (tdata, $ele) {
            var swapData = { // private data for the swap module
                backBag: [],
                backIndex: 0,
                backStaticIndex: 0,
                backStaticRndm: -1,
                prevBackIndex: -1,
                frontBag: [],
                frontIndex: 0,
                frontStaticIndex: 0,
                frontStaticRndm: -1,
                prevFrontIndex: -1
            };
            if (!tdata.ignoreDataAttributes) {
                swapData.frontIsRandom = privMethods.getDataOrDefault($ele, "front-israndom", tdata.frontIsRandom);
                swapData.frontIsInGrid = privMethods.getDataOrDefault($ele, "front-isingrid", tdata.frontIsInGrid);
                swapData.backIsRandom = privMethods.getDataOrDefault($ele, "back-israndom", tdata.backIsRandom);
                swapData.backIsInGrid = privMethods.getDataOrDefault($ele, "back-isingrid", tdata.backIsInGrid);
            } else {
                swapData.frontIsRandom = tdata.frontIsRandom;
                swapData.frontIsInGrid = tdata.frontIsInGrid;
                swapData.backIsRandom = tdata.backIsRandom;
                swapData.backIsInGrid = tdata.backIsInGrid;
                        }
            swapData.doSwapFront = $.inArray('html', tdata.swapFront) > -1 && (tdata.frontContent instanceof Array) && tdata.frontContent.length > 0;
            swapData.doSwapBack = $.inArray('html', tdata.swapBack) > -1 && (tdata.backContent instanceof Array) && tdata.backContent.length > 0;
            if (typeof (tdata.htmlSwap) !== "undefined")
                tdata.htmlSwap = $.extend(swapData, tdata.htmlSwap);
            else
                tdata.htmlSwap = swapData;
            if (tdata.htmlSwap.doSwapFront) {
                tdata.htmlSwap.frontBag = this.prepBag(tdata.htmlSwap.frontBag, tdata.frontContent, tdata.htmlSwap.prevFrontIndex);
                tdata.htmlSwap.frontStaticRndm = tdata.htmlSwap.frontBag.pop();
            }
            if (tdata.htmlSwap.doSwapBack) {
                tdata.htmlSwap.backBag = this.prepBag(tdata.htmlSwap.backBag, tdata.backContent, tdata.htmlSwap.prevBackIndex);
                tdata.htmlSwap.backStaticRndm = tdata.htmlSwap.backBag.pop();
            }
        },
        prepBag: function (bag, content, prevIdx) {
            bag = bag || [];
            var bagCount = 0;
            for (var i = 0; i < content.length; i++) {
                //make sure there's not an immediate repeat
                if (i != prevIdx || bag.length === 1) {
                    bag[bagCount] = i;
                    bagCount++;
                }
            }
            return helperMethods.shuffleArray(bag);
        },
        getFrontSwapIndex: function (tdata) {
            var idx = 0;
            if (!tdata.htmlSwap.frontIsRandom) {
                idx = tdata.htmlSwap.frontIsInGrid ? tdata.htmlSwap.frontStaticIndex : tdata.htmlSwap.frontIndex;
            } else {
                if (tdata.htmlSwap.frontBag.length === 0) {
                    tdata.htmlSwap.frontBag = this.prepBag(tdata.htmlSwap.frontBag, tdata.frontContent, tdata.htmlSwap.prevFrontIndex);
                }
                if (tdata.htmlSwap.frontIsInGrid) {
                    idx = tdata.htmlSwap.frontStaticRndm;
                } else {
                    idx = tdata.htmlSwap.frontBag.pop();
                }
            }
            return idx;
        },
        getBackSwapIndex: function (tdata) {
            var idx = 0;
            if (!tdata.htmlSwap.backIsRandom) {
                idx = tdata.htmlSwap.backIsInGrid ? tdata.htmlSwap.backStaticIndex : tdata.htmlSwap.backIndex;
            } else {
                if (tdata.htmlSwap.backBag.length === 0) {
                    tdata.htmlSwap.backBag = this.prepBag(tdata.htmlSwap.backBag, tdata.backContent, tdata.htmlSwap.prevBackIndex);
                }
                if (tdata.htmlSwap.backIsInGrid) {
                    idx = tdata.htmlSwap.backStaticRndm;
                } else {
                    idx = tdata.htmlSwap.backBag.pop();
                }
            }
            return idx;
        },
        action: function (tdata, $front, $back, index) {
            if (!tdata.htmlSwap.doSwapFront && !tdata.htmlSwap.doSwapBack)
                return;
            var isList = tdata.mode === "flip-list";
            var swapIndex = 0;
            var isReversed = isList ? tdata.listData[Math.max(index, 0)].isReversed : tdata.isReversed;
            if (isList && index == -1) {
                // flip list completed
                if (!isReversed) {
                    if (tdata.htmlSwap.doSwapFront) {
                        // update the random value for grid mode
                        if (tdata.htmlSwap.frontBag.length === 0)
                            tdata.htmlSwap.frontBag = this.prepBag(tdata.htmlSwap.frontBag, tdata.frontContent, tdata.htmlSwap.frontStaticRndm);
                        tdata.htmlSwap.frontStaticRndm = tdata.htmlSwap.frontBag.pop();
                        // update the static index
                        tdata.htmlSwap.frontStaticIndex++;
                        if (tdata.htmlSwap.frontStaticIndex >= tdata.frontContent.length)
                            tdata.htmlSwap.frontStaticIndex = 0;
                    }
                } else {
                    if (tdata.htmlSwap.doSwapBack) {
                        // update the random value for grid mode
                        if (tdata.htmlSwap.backBag.length === 0)
                            tdata.htmlSwap.backBag = this.prepBag(tdata.htmlSwap.backBag, tdata.backContent, tdata.htmlSwap.backStaticRndm);
                        tdata.htmlSwap.backStaticRndm = tdata.htmlSwap.backBag.pop();
                        // update the static index
                        tdata.htmlSwap.backStaticIndex++;
                        if (tdata.htmlSwap.backStaticIndex >= tdata.backContent.length)
                            tdata.htmlSwap.backStaticIndex = 0;
                    }
                }
                return;
            }
            if (!isReversed) {
                if (!tdata.htmlSwap.doSwapFront)
                    return;
                swapIndex = this.getFrontSwapIndex(tdata);
                tdata.htmlSwap.prevFrontIndex = swapIndex;
                if (tdata.mode === "slide") {
                    if (!tdata.startNow)
                        $front.html(tdata.frontContent[swapIndex]);
                    else
                        $back.html(tdata.frontContent[swapIndex]);
                } else
                    $back.html(tdata.frontContent[swapIndex]);
                // increment the front index to get the next item from the list
                tdata.htmlSwap.frontIndex++;
                if (tdata.htmlSwap.frontIndex >= tdata.frontContent.length)
                    tdata.htmlSwap.frontIndex = 0;
                if (!isList) {
                    // increment the static index if we're not in list mode
                    tdata.htmlSwap.frontStaticIndex++;
                    if (tdata.htmlSwap.frontStaticIndex >= tdata.frontContent.length)
                        tdata.htmlSwap.frontStaticIndex = 0;
                } else {
                    // flip list
                }
            } else {
                if (!tdata.htmlSwap.doSwapBack)
                    return;
                swapIndex = this.getBackSwapIndex(tdata);
                tdata.htmlSwap.prevBackIndex = swapIndex;
                $back.html(tdata.backContent[tdata.htmlSwap.backIndex]);
                tdata.htmlSwap.backIndex++;
                if (tdata.htmlSwap.backIndex >= tdata.backContent.length)
                    tdata.htmlSwap.backIndex = 0;
                if (!isList) {
                    tdata.htmlSwap.backStaticIndex++;
                    if (tdata.htmlSwap.backStaticIndex >= tdata.backContent.length)
                        tdata.htmlSwap.backStaticIndex = 0;
                } else {
                    // flip list
                }
            }
        }
    },
    imageSwap: {
            moduleName: 'image',
        data: {
            preloadImages: false,
            imageCssSelector: '>img,>a>img',        // the selector used to choose a an image to apply a src or background to
            fadeSwap: false,                        // fade the image before swapping
            frontImages: [],                        // a list of images to use for the front
            frontIsRandom: true,                    // should images be chosen at random or in order
            frontIsBackgroundImage: false,          // set the src attribute or css background-image property
            frontIsInGrid: false,                   // only chooses one item for each iteration in flip-list
            backImages: null,                       // a list of images to use for the back
            backIsRandom: true,                     // should images be chosen at random or in order
            backIsBackgroundImage: false,           // set the src attribute or css background-image property
            backIsInGrid: false                     // only chooses one item for each iteration in flip-list                
        },
        initData: function (tdata, $ele) {
            var swapData = {
                backBag: [],
                backIndex: 0,
                backStaticIndex: 0,
                backStaticRndm: -1,
                frontBag: [],
                frontIndex: 0,
                frontStaticIndex: 0,
                frontStaticRndm: -1,
                prevBackIndex: -1,
                prevFrontIndex: -1
                }, useData = tdata.ignoreDataAttributes;
                if (useData) {
                        swapData.imageCssSelector = privMethods.getDataOrDefault($ele, "image-css", tdata.imageCssSelector);
                        swapData.fadeSwap = privMethods.getDataOrDefault($ele, "fadeswap", tdata.fadeSwap);
                        swapData.frontIsRandom = privMethods.getDataOrDefault($ele, "front-israndom", tdata.frontIsRandom);
                        swapData.frontIsInGrid = privMethods.getDataOrDefault($ele, "front-isingrid", tdata.frontIsInGrid);
                        swapData.frontIsBackgroundImage = privMethods.getDataOrDefault($ele, "front-isbg", tdata.frontIsBackgroundImage);
                        swapData.backIsRandom = privMethods.getDataOrDefault($ele, "back-israndom", tdata.backIsRandom);
                        swapData.backIsInGrid = privMethods.getDataOrDefault($ele, "back-isingrid", tdata.backIsInGrid);
                        swapData.backIsBackgroundImage = privMethods.getDataOrDefault($ele, "back-isbg", tdata.backIsBackgroundImage);
                        swapData.doSwapFront = $.inArray('image', tdata.swapFront) > -1 && (tdata.frontImages instanceof Array) && tdata.frontImages.length > 0;
                        swapData.doSwapBack = $.inArray('image', tdata.swapBack) > -1 && (tdata.backImages instanceof Array) && tdata.backImages.length > 0;
                        swapData.alwaysSwapFront = privMethods.getDataOrDefault($ele, "front-alwaysswap", tdata.alwaysSwapFront);
                        swapData.alwaysSwapBack = privMethods.getDataOrDefault($ele, "back-alwaysswap", tdata.alwaysSwapBack);
                } else {
                        swapData.imageCssSelector = tdata.imageCssSelector;
                        swapData.fadeSwap = tdata.fadeSwap;
                        swapData.frontIsRandom = tdata.frontIsRandom;
                        swapData.frontIsInGrid = tdata.frontIsInGrid;
                        swapData.frontIsBackgroundImage = tdata.frontIsBackgroundImage;
                        swapData.backIsRandom = tdata.backIsRandom;
                        swapData.backIsInGrid = tdata.backIsInGrid;
                        swapData.backIsBackgroundImage = tdata.backIsBackgroundImage;
                        swapData.doSwapFront = $.inArray('image', tdata.swapFront) > -1 && (tdata.frontImages instanceof Array) && tdata.frontImages.length > 0;
                        swapData.doSwapBack = $.inArray('image', tdata.swapBack) > -1 && (tdata.backImages instanceof Array) && tdata.backImages.length > 0;
                        swapData.alwaysSwapFront = tdata.alwaysSwapFront;
                        swapData.alwaysSwapBack = tdata.alwaysSwapBack;
                        }
            if (typeof (tdata.imgSwap) !== "undefined")
                tdata.imgSwap = $.extend(swapData, tdata.imgSwap);
            else
                tdata.imgSwap = swapData;
            if (tdata.imgSwap.doSwapFront) {
                tdata.imgSwap.frontBag = this.prepBag(tdata.imgSwap.frontBag, tdata.frontImages, tdata.imgSwap.prevFrontIndex);
                tdata.imgSwap.frontStaticRndm = tdata.imgSwap.frontBag.pop();
                if (tdata.preloadImages)
                    $(tdata.frontImages).metrojs.preloadImages(function () { });
            }
            if (tdata.imgSwap.doSwapBack) {
                tdata.imgSwap.backBag = this.prepBag(tdata.imgSwap.backBag, tdata.backImages, tdata.imgSwap.prevBackIndex);
                tdata.imgSwap.backStaticRndm = tdata.imgSwap.backBag.pop();
                if (tdata.preloadImages)
                    $(tdata.backImages).metrojs.preloadImages(function () { });
            }
        },
        prepBag: function (bag, content, prevIdx) {
            bag = bag || [];
            var bagCount = 0;
            for (var i = 0; i < content.length; i++) {
                //make sure there's not an immediate repeat
                if (i != prevIdx || content.length === 1) {
                    bag[bagCount] = i;
                    bagCount++;
                }
            }
            return helperMethods.shuffleArray(bag);
        },
        getFrontSwapIndex: function (tdata) {
            var idx = 0;
            if (!tdata.imgSwap.frontIsRandom) {
                idx = tdata.imgSwap.frontIsInGrid ? tdata.imgSwap.frontStaticIndex : tdata.imgSwap.frontIndex;
            } else {
                if (tdata.imgSwap.frontBag.length === 0) {
                    tdata.imgSwap.frontBag = this.prepBag(tdata.imgSwap.frontBag, tdata.frontImages, tdata.imgSwap.prevFrontIndex);
                }
                if (tdata.imgSwap.frontIsInGrid) {
                    idx = tdata.imgSwap.frontStaticRndm;
                } else {
                    idx = tdata.imgSwap.frontBag.pop();
                }
            }
            return idx;
        },
        getBackSwapIndex: function (tdata) {
            var idx = 0;
            if (!tdata.imgSwap.backIsRandom) {
                idx = tdata.imgSwap.backIsInGrid ? tdata.imgSwap.backStaticIndex : tdata.imgSwap.backIndex;                
            } else {
                if (tdata.imgSwap.backBag.length === 0) {
                    tdata.imgSwap.backBag = this.prepBag(tdata.imgSwap.backBag, tdata.backImages, tdata.imgSwap.prevBackIndex);
                }
                if (tdata.imgSwap.backIsInGrid) {
                    idx = tdata.imgSwap.backStaticRndm;                    
                } else {                
                    idx = tdata.imgSwap.backBag.pop();                    
                }
            }            
            return idx;
        },
        setImageProperties: function ($img, image, isBackground) {
            var css = {}, // css object to apply
                attr = {}; // attribute values to apply
            // get image source
            if (typeof (image.src) !== 'undefined') {
                if (!isBackground)
                    attr.src = image.src;
                else
                    css.backgroundImage = "url('" + image.src + "')";
            }
            // get alt text
            if (typeof (image.alt) !== 'undefined')
                attr.alt = image.alt;
            // set css
            if (typeof (image.css) === 'object')
                $img.css($.extend(css, image.css));
            else
                $img.css(css);
            // set attributes
            if (typeof (image.attr) === 'object')
                $img.attr($.extend(attr, image.attr));
            else
                $img.attr(attr);
        },
        action: function (tdata, $front, $back, index) {
                if (!tdata.imgSwap.doSwapFront && !tdata.imgSwap.doSwapBack)
                return;
            var isList = tdata.mode === "flip-list",
                isSlide = tdata.mode == "slide",
                swapIndex = 0,
                isReversed = isList ? tdata.listData[Math.max(index, 0)].isReversed : tdata.isReversed;
            if (isList && index == -1) {
                // flip list completed
                if (tdata.alwaysSwapFront || !isReversed) {
                    if (tdata.imgSwap.doSwapFront) {                        
                        // update the random value for grid mode
                        if (tdata.imgSwap.frontBag.length === 0)
                            tdata.imgSwap.frontBag = this.prepBag(tdata.imgSwap.frontBag, tdata.frontImages, tdata.imgSwap.frontStaticRndm);
                        tdata.imgSwap.frontStaticRndm = tdata.imgSwap.frontBag.pop();
                        // update the static index
                        tdata.imgSwap.frontStaticIndex++;
                        if (tdata.imgSwap.frontStaticIndex >= tdata.frontImages.length)
                            tdata.imgSwap.frontStaticIndex = 0;
                    }
                }
                if (tdata.alwaysSwapBack || isReversed) {                    
                    if (tdata.imgSwap.doSwapBack) {                        
                        // update the random value for grid mode
                        if (tdata.imgSwap.backBag.length === 0)
                            tdata.imgSwap.backBag = this.prepBag(tdata.imgSwap.backBag, tdata.backImages, tdata.imgSwap.backStaticRndm);
                        tdata.imgSwap.backStaticRndm = tdata.imgSwap.backBag.pop();                        
                        // update the static index
                        tdata.imgSwap.backStaticIndex++;
                        if (tdata.imgSwap.backStaticIndex >= tdata.backImages.length)
                            tdata.imgSwap.backStaticIndex = 0;
                    }
                }
                return;
            }
            var $face, // face being swapped
                $img, // image to apply values
                image,// image object to hold properties
                swap; // wrapper for setimageProperties for fade
            if (tdata.alwaysSwapFront || !isReversed) {
                if (!tdata.imgSwap.doSwapFront)
                    return;
                swapIndex = this.getFrontSwapIndex(tdata);
                tdata.imgSwap.prevFrontIndex = swapIndex;
                // slide mode has a static front and back face
                $face = (tdata.mode === "slide") ? $front : $back;
                $img = $face.find(tdata.imgSwap.imageCssSelector);
                image = typeof (tdata.frontImages[swapIndex]) === "object" ? tdata.frontImages[swapIndex] : { src: tdata.frontImages[swapIndex] };
                swap = function (callback) {
                        // set src, alt, css and attribute values
                        var isBg = tdata.imgSwap.frontIsBackgroundImage;
                        if (typeof(callback) == "function") {
                                if (isBg)
                                        window.setTimeout(callback, 100);
                                else
                                        $img[0].onload = callback;
                        }
                        defaultModules.imageSwap.setImageProperties($img, image, isBg);
                       
                };
                if (tdata.fadeSwap) {
                    $img.fadeOut(function () {
                        swap(function () {
                                $img.fadeIn();
                        });
                    });
                } else
                    swap();
                // increment indexes
                tdata.imgSwap.frontIndex++;
                if (tdata.imgSwap.frontIndex >= tdata.frontImages.length)
                    tdata.imgSwap.frontIndex = 0;
                if (!isList) {
                    tdata.imgSwap.frontStaticIndex++;
                    if (tdata.imgSwap.frontStaticIndex >= tdata.frontImages.length)
                        tdata.imgSwap.frontStaticIndex = 0;
                } else {

                }
            }
            if (tdata.alwaysSwapBack || isReversed) {
                if (!tdata.imgSwap.doSwapBack)
                    return;
                // get the new index
                swapIndex = this.getBackSwapIndex(tdata);
                tdata.imgSwap.prevBackIndex = swapIndex;
                // use the $face var for consistency
                $face = $back;
                $img = $face.find(tdata.imgSwap.imageCssSelector);
                image = typeof (tdata.backImages[swapIndex]) === "object" ? tdata.backImages[swapIndex] : { src: tdata.backImages[swapIndex] };
                swap = function () {
                    // set src, alt, css and attribute values
                    defaultModules.imageSwap.setImageProperties($img, image, tdata.imgSwap.backIsBackgroundImage);
                };
                if (tdata.fadeSwap) {
                    $img.fadeOut(function () {
                        swap(function () {
                                $img.fadeIn();
                        });
                    });
                } else
                    swap();
                // increment indexes
                tdata.imgSwap.backIndex++;
                if (tdata.imgSwap.backIndex >= tdata.backImages.length)
                    tdata.imgSwap.backIndex = 0;
                if (!isList) {
                    tdata.imgSwap.backStaticIndex++;
                    if (tdata.imgSwap.backStaticIndex >= tdata.backImages.length)
                        tdata.imgSwap.backStaticIndex = 0;
                } else {

                }
            }
        }
    }
};

// object to maintain timer state
$.fn.metrojs.TileTimer = function (interval, callback, repeatCount) {
    this.timerId = null;                                                        // the id of the current timeout
    this.interval = interval;                                                   // the amount of time to wait between each action call
    this.action = callback;                                                     // the method that is fired on each tick
    this.count = 0;                                                             // the number of times the action has been fired
    this.repeatCount = typeof (repeatCount) === "undefined" ? 0 : repeatCount;   // the number of times the action will be fired        
    // call the action method after a delay and call start | stop based on repeat count
    this.start = function (delay) {
        window.clearTimeout(this.timerId);
        var t = this;
        this.timerId = window.setTimeout(function () {
            t.tick.call(t, interval);
        }, delay);
    };

    this.tick = function (when) {
        this.action(this.count + 1);
        this.count++;
        // reset the loop count
        if (this.count >= MAX_LOOP_COUNT)
            this.count = 0;
        if (this.repeatCount > 0 || this.repeatCount == -1) {
            if (this.count != this.repeatCount) {
                this.start(when);
            } else
                this.stop();
        }
    }
    // clear the timer and reset the count
    this.stop = function () {
        this.timerId = window.clearTimeout(this.timerId);
        this.reset();
    };

    this.resume = function () {
        if (this.repeatCount > 0 || this.repeatCount == -1) {
            if (this.count != this.repeatCount) {
                this.start(interval);
            }
        }
    };

    // clear the timer but leave the count intact
    this.pause = function () {
        this.timerId = window.clearTimeout(this.timerId);
    };

    // reset count
    this.reset = function () {
        this.count = 0;
    };

    // reset count and timer
    this.restart = function (delay) {
        this.stop();
        this.start(delay);
    };
};
jQuery.fn.metrojs.theme = {
    loadDefaultTheme: function (stgs) {
        if (typeof (stgs) === "undefined" || stgs == null) {
            stgs = jQuery.fn.metrojs.theme.defaults;
        } else {
            var stg = jQuery.fn.metrojs.theme.defaults;
            jQuery.extend(stg, stgs);
            stgs = stg;
        }
        //get theme from local storage or set base theme
        var hasLocalStorage = typeof (window.localStorage) !== "undefined";
        var hasKeyAndValue = function (key) {
            return (typeof (window.localStorage[key]) !== "undefined" && window.localStorage[key] != null);
        };
        if (hasLocalStorage && (!hasKeyAndValue("Metro.JS.AccentColor") || !hasKeyAndValue("Metro.JS.BaseAccentColor"))) {
            //base theme
            window.localStorage["Metro.JS.AccentColor"] = stgs.accentColor;
            window.localStorage["Metro.JS.BaseAccentColor"] = stgs.baseTheme;
            jQuery(stgs.accentCssSelector).addClass(stgs.accentColor).data("accent", stgs.accentColor);
            jQuery(stgs.baseThemeCssSelector).addClass(stgs.baseTheme);
            if (typeof (stgs.loaded) === "function")
                stgs.loaded(stgs.baseTheme, stgs.accentColor);
            //preload light theme image
            if (typeof (stgs.preloadAltBaseTheme) !== "undefined" && stgs.preloadAltBaseTheme)
                jQuery([(stgs.baseTheme == 'dark') ? stgs.metroLightUrl : stgs.metroDarkUrl]).metrojs.preloadImages(function () { });
        } else {
            if (hasLocalStorage) {
                stgs.accentColor = window.localStorage["Metro.JS.AccentColor"];
                stgs.baseTheme = window.localStorage["Metro.JS.BaseAccentColor"];
                jQuery(stgs.accentCssSelector).addClass(stgs.accentColor).data("accent", stgs.accentColor);
                jQuery(stgs.baseThemeCssSelector).addClass(stgs.baseTheme);
                if (typeof (stgs.loaded) === "function")
                    stgs.loaded(stgs.baseTheme, stgs.accentColor);
            } else {
                jQuery(stgs.accentCssSelector).addClass(stgs.accentColor).data("accent", stgs.accentColor);
                jQuery(stgs.baseThemeCssSelector).addClass(stgs.baseTheme);
                if (typeof (stgs.loaded) === "function")
                    stgs.loaded(stgs.baseTheme, stgs.accentColor);
                //preload light theme image
                if (typeof (stgs.preloadAltBaseTheme) !== "undefined" && stgs.preloadAltBaseTheme)
                    jQuery([(stgs.baseTheme == 'dark') ? stgs.metroLightUrl : stgs.metroDarkUrl]).metrojs.preloadImages(function () { });
            }
        }        
    },
    applyTheme: function (tColor, aColor, stgs) {
        if (typeof (stgs) === "undefined" || stgs == null) {
            stgs = jQuery.fn.metrojs.theme.defaults;
        } else {
            var stg = jQuery.fn.metrojs.theme.defaults;
            stgs = jQuery.extend({}, stg, stgs);
        }

        if (typeof (tColor) !== "undefined" && tColor != null) {
            if (typeof (window.localStorage) !== "undefined") {
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
        if (typeof (aColor) !== "undefined" && aColor != null) {
            if (typeof (window.localStorage) !== "undefined") {
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
                if (themeset && typeof (stgs.accentPicked) === "function")
                    stgs.accentPicked(aColor);
            }
        }
    },
    appendAccentColors: function (stgs) {
        if (typeof (stgs) === "undefined" || stgs == null) {
            stgs = jQuery.fn.metrojs.theme.defaults;
        } else {
            var stg = jQuery.fn.metrojs.theme.defaults;
            stgs = jQuery.extend({}, stg, stgs);
        }
        var themeList = "";
        var themes = stgs.accentColors;
        var template = stgs.accentListTemplate;
        for (var i = 0; i < themes.length; i++) {
            themeList += template.replace(/\{0\}/g, themes[i]);
        }
        $(themeList).appendTo(stgs.accentListContainer);
    },
    appendBaseThemes: function (stgs) {
        if (typeof (stgs) === "undefined" || stgs == null) {
            stgs = jQuery.fn.metrojs.theme.defaults;
        } else {
            var stg = jQuery.fn.metrojs.theme.defaults;
            stgs = jQuery.extend({}, stg, stgs);
        }
        var themeList = "",
            themes = stgs.baseThemes,
            template = stgs.baseThemeListTemplate;
        for (var i = 0; i < themes.length; i++) {
            themeList += template.replace(/\{0\}/g, themes[i]);
        }
        $(themeList).appendTo(stgs.baseThemeListContainer);
    },
    // default options for theme
    defaults: {
        baseThemeCssSelector: 'body',                           // selector to place dark or light class after load or selection
        accentCssSelector: '.tiles',                            // selector to place accent color class after load or selection
        accentColor: 'blue',                                    // the default accent color. options are blue, brown, green, lime, magenta, mango, pink, purple, red, teal
        baseTheme: 'dark',                                      // the default theme color. options are dark, light
        accentColors: [
             'amber', 'blue', 'brown', 'cobalt', 'crimson', 'cyan',
             'magenta', 'lime', 'indigo', 'green', 'emerald',
             'mango', 'mauve', 'olive', 'orange', 'pink', 'red',
             'sienna', 'steel', 'teal', 'violet', 'yellow'
        ],
        baseThemes: [
            'light',
            'dark'
        ],
        accentListTemplate: "<li><a href='javascript:;' title='{0}' class='accent {0}'></a></li>", // template to generate accent options
        accentListContainer: "ul.theme-options,.theme-options>ul",                   // selector of container to append accents
        baseThemeListTemplate: "<li><a href='javascript:;' title='{0}' class='accent {0}'></a></li>", // template to generate accent options
        baseThemeListContainer: "ul.base-theme-options,.base-theme-options>ul"                    // selector of container to append accents
    }
};

jQuery.fn.applicationBar = function (options) {    
    /* Setup the public options for the applicationBar  */
    var stgs = typeof (jQuery.fn.metrojs.theme) !== "undefined" ? jQuery.fn.metrojs.theme.defaults : {};
    jQuery.extend(stgs, jQuery.fn.applicationBar.defaults, options);
    if (typeof (jQuery.fn.metrojs.theme) != "undefined") {
        var theme = jQuery.fn.metrojs.theme;
        if (stgs.shouldApplyTheme) {         
            theme.loadDefaultTheme(stgs);
        }
        var themeContainer = stgs.accentListContainer + " a";
        var themeContainerClick = function () {
            var accent = jQuery(this).attr("class").replace("accent", "").replace(" ", "");
            theme.applyTheme(null, accent, stgs);
            if (typeof (stgs.accentPicked) == "function")
                stgs.accentPicked(accent);
        };
        var baseContainer = stgs.baseThemeListContainer + " a";
        var baseContainerClick = function () {
            var accent = jQuery(this).attr("class").replace("accent", '').replace(' ', '');
            theme.applyTheme(accent, null, stgs);
            if (typeof (stgs.themePicked) == "function")
                stgs.themePicked(accent);
        };
        if (typeof ($.fn.on) === "function") {
            $(this).on("click.appBar", themeContainer, themeContainerClick);
            $(this).on("click.appBar", baseContainer, baseContainerClick);
        } else {
            $(themeContainer).live("click.appBar", themeContainerClick);
            $(baseContainer).live("click.appBar", baseContainerClick);
        }
    }
    //this should really only run once but we can support multiple application bars
    return $(this).each(function (idx, ele) {
    	var $this = $(ele),
            data = $.extend({}, stgs);
    	if(data.collapseHeight == "auto")
        	data.collapseHeight = $(this).height();

        //unfortunately we have to sniff out mobile browsers because of the inconsistent implementation of position:fixed
        //most desktop methods return false positives on a mobile
        //todo: find/come up with a better fixed position test
        if (navigator.userAgent.match(/(Android|webOS|iPhone|iPod|BlackBerry|PIE|IEMobile)/i)) {
            // IEMobile10 supports position:fixed. This should cover up to IE20 or at least until fixed positioning gets sorted            
            // let iOS 5+ pass as well, hopefully by iOS 9 fixed pos will be standard :/
            if (!navigator.userAgent.match(/(IEMobile\/1)/i) && !navigator.userAgent.match(/(iPhone OS [56789])/i)) {
                $this.css({ position: 'absolute', bottom: '0px' });
            }
        }
        data.slideOpen = function () {
            if (!$this.hasClass("expanded"))
                data.animateAppBar(false);
        };
        data.slideClosed = function () {
            if ($this.hasClass("expanded"))
                data.animateAppBar(true);
        };
        data.animateAppBar = function (isExpanded) {
            var hgt = isExpanded ? data.collapseHeight : data.expandHeight;
            if (isExpanded)
                $this.removeClass("expanded");
            else
                if (!$this.hasClass("expanded"))
                    $this.addClass("expanded");
            $this.stop().animate({ height: hgt }, { duration: data.duration });
        };
        $this.data("ApplicationBar", data)

        $this.find(stgs.handleSelector).click(function () {
            data.animateAppBar($this.hasClass("expanded"));
        });

        if (data.bindKeyboard == true) {
            jQuery(document.documentElement).keyup(function (event) {
                // handle cursor keys
                if (event.keyCode == 38) {
                    // expand
                    if (event.target && event.target.tagName.match(/INPUT|TEXTAREA|SELECT/i) == null) {
                        if (!$this.hasClass("expanded")) {
                            data.animateAppBar(false);
                        }
                    }
                    
                } else if (event.keyCode == 40) {
                    // collapse
                    if (event.target && event.target.tagName.match(/INPUT|TEXTAREA|SELECT/i) == null) {
                        if ($this.hasClass("expanded")) {
                            data.animateAppBar(true);
                        }
                    }
                }
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
    duration: 300,                                          // how fast should animation be performed, in milliseconds
    expandHeight: "320px",                                  // height the application bar to expand to when opened
    collapseHeight: "auto",                                 // height the application bar will collapse back to when closed
    bindKeyboard: true,                                     // should up and down keys on keyborad be bound to the application bar
    handleSelector: "a.etc",
    metroLightUrl: 'images/metroIcons_light.jpg',  // the url for the metro light icons (only needed if preload 'preloadAltBaseTheme' is true)
    metroDarkUrl: 'images/metroIcons.jpg',         // the url for the metro dark icons (only needed if preload 'preloadAltBaseTheme' is true)
    preloadAltBaseTheme: false                             // should the applicationBar icons be pre loaded for the alternate theme to enable fast theme switching    
};
/* Preload Images */
// Usage: jQuery(['img1.jpg', { src: 'img2.jpg' }]).metrojs.preloadImages(function(){ ... });
// Callback function gets called after all images are preloaded
$.fn.metrojs.preloadImages = function (callback) {
        var checklist = $(this).toArray();
        var $img = $("<img style='display:none;' />").appendTo("body");
        $(this).each(function () {
                var src = this;
                if (typeof(this) == "object")
                        src = this.src;
                $img.attr({ src: src }).load(function() {
                        for (var i = 0; i < checklist.length; i++) {
                                if (checklist[i] == element) {
                                        checklist.splice(i, 1);
                                }
                        }
                        if (checklist.length == 0) {
                                callback();
                        }
                });
               
        });
    $img.remove();
};
// object used for compatibility checks
$.fn.metrojs.MetroModernizr = function (stgs) {
    if(typeof(stgs) === "undefined") {
                stgs = { useHardwareAccel: true, useModernizr: typeof(window.Modernizr) !== "undefined" };
        }
    this.isOldJQuery =  /^1\.[0123]/.test($.fn.jquery),
    this.isOldAndroid = (function(){
        try{
            var ua = navigator.userAgent;        
            if( ua.indexOf("Android") >= 0 )
            {
                var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
                if (androidversion < 2.3)
                    return true;
            }
        }catch(err){ $.error(err); }
        return false;
    })();
    this.canTransform = false;
    this.canTransition = false;
    this.canTransform3d = false;
    this.canAnimate = false;
    this.canTouch = false;
    this.canFlip3d = stgs.useHardwareAccel;
    if (stgs.useHardwareAccel == true) {
        if (stgs.useModernizr == false) {
            //determine if the browser supports the neccessary accelerated features
            if (typeof (window.MetroModernizr) !== "undefined") {
                this.canTransform = window.MetroModernizr.canTransform;
                this.canTransition = window.MetroModernizr.canTransition;
                this.canTransform3d = window.MetroModernizr.canTransform3d;
                this.canAnimate = window.MetroModernizr.canAnimate;
                this.canTouch = window.MetroModernizr.canTouch;
            } else {
                window.MetroModernizr = {};
                /***** check for browser capabilities credit: modernizr-1.7 http://modernizr.com/ *****/
                var mod = 'metromodernizr';
                var docElement = document.documentElement;
                var docHead = document.head || document.getElementsByTagName('head')[0];
                var modElem = document.createElement(mod);
                var m_style = modElem.style;
                var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
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
                        ret = testMediaQuery(['@media (',prefixes.join('transform-3d),('),mod,')','{#metromodernizr{left:9px;position:absolute;height:3px;}}'].join(''), function(div){
                            return div.offsetHeight === 3 && div.offsetLeft === 9;
                        });
                    }
                    return ret;
                };
                var testMediaQuery = function (mq, predicate) {
                    var st = document.createElement('style'),
                        div = document.createElement('div'),
                        ret;
                    st.textContent = mq;
                    docHead.appendChild(st);
                    div.id = mod;
                    docElement.appendChild(div);
                    ret = predicate(div);
                    st.parentNode.removeChild(st);
                    div.parentNode.removeChild(div);
                    return !!ret;
                };
                var test_touch = function() {
                    return canTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch ||
                        (typeof(window.navigator.msMaxTouchPoints) !== "undefined" && window.navigator.msMaxTouchPoints > 0) ||
                        testMediaQuery(['@media (',prefixes.join('touch-enabled),('),mod,')','{#metromodernizr{top:9px;position:absolute}}'].join(''), function(div){
                            return div.offsetTop === 9;
                        });
                };
                this.canTransform = !!test_props(['transformProperty', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform']);
                this.canTransition = test_props_all('transitionProperty');
                this.canTransform3d = test_3d();
                this.canAnimate = test_props_all('animationName');
                this.canTouch = test_touch();
                window.MetroModernizr.canTransform = this.canTransform;
                window.MetroModernizr.canTransition = this.canTransition;
                window.MetroModernizr.canTransform3d = this.canTransform3d;
                window.MetroModernizr.canAnimate = this.canAnimate;
                window.MetroModernizr.canTouch = this.canTouch;
                docElement = null;
                docHead = null;
                modElem = null;
                m_style = null;
            }
        } else {
            this.canTransform = $("html").hasClass("csstransforms");
            this.canTransition = $("html").hasClass("csstransitions");
            this.canTransform3d = $("html").hasClass("csstransforms3d");
            this.canAnimate = $("html").hasClass("cssanimations");
            this.canTouch = $("html").hasClass("touch") || (typeof(window.navigator.msMaxTouchPoints) !== "undefined" && window.navigator.msMaxTouchPoints > 0);
        }
    }
    this.canFlip3d = this.canFlip3d && this.canAnimate && this.canTransform && this.canTransform3d;
};

})(jQuery);
