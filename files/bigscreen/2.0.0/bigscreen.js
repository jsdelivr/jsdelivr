/*! BigScreen
 * v2.0.0 - 2013-01-21
 * https://github.com/bdougherty/BigScreen
 * Copyright 2013 Brad Dougherty; Apache 2.0 License
 */
(function(window, document, iframe) {
    "use strict";
    var keyboardAllowed = typeof Element !== "undefined" && "ALLOW_KEYBOARD_INPUT" in Element;
    var fn = function() {
        var map = [ {
            request: "requestFullscreen",
            exit: "exitFullscreen",
            enabled: "fullscreenEnabled",
            element: "fullscreenElement",
            change: "fullscreenchange",
            error: "fullscreenerror"
        }, {
            request: "webkitRequestFullscreen",
            exit: "webkitExitFullscreen",
            enabled: "webkitFullscreenEnabled",
            element: "webkitFullscreenElement",
            change: "webkitfullscreenchange",
            error: "webkitfullscreenerror"
        }, {
            request: "webkitRequestFullScreen",
            exit: "webkitCancelFullScreen",
            element: "webkitCurrentFullScreenElement",
            change: "webkitfullscreenchange",
            error: "webkitfullscreenerror"
        }, {
            request: "mozRequestFullScreen",
            exit: "mozCancelFullScreen",
            enabled: "mozFullScreenEnabled",
            element: "mozFullScreenElement",
            change: "mozfullscreenchange",
            error: "mozfullscreenerror"
        } ];
        var fullscreen = false;
        var testElement = document.createElement("video");
        for (var i = 0; i < map.length; i++) {
            if (map[i].request in testElement) {
                fullscreen = map[i];
                for (var item in fullscreen) {
                    if (item !== "change" && item !== "error" && !(fullscreen[item] in document) && !(fullscreen[item] in testElement)) {
                        delete fullscreen[item];
                    }
                }
                break;
            }
        }
        testElement = null;
        return fullscreen;
    }();
    function _getVideo(element) {
        var videoElement = null;
        if (element.tagName === "VIDEO") {
            videoElement = element;
        } else {
            var videos = element.getElementsByTagName("video");
            if (videos[0]) {
                videoElement = videos[0];
            }
        }
        return videoElement;
    }
    var lastVideoElement = null;
    var hasControls = null;
    var emptyFunction = function() {};
    var elements = [];
    function videoEnterFullscreen(element) {
        var videoElement = _getVideo(element);
        if (videoElement && videoElement.webkitEnterFullscreen) {
            try {
                videoElement.addEventListener("webkitbeginfullscreen", function onBeginFullscreen(event) {
                    videoElement.removeEventListener("webkitbeginfullscreen", onBeginFullscreen, false);
                    bigscreen.onchange(videoElement);
                    callOnEnter(videoElement);
                }, false);
                videoElement.addEventListener("webkitendfullscreen", function onEndFullscreen(event) {
                    videoElement.removeEventListener("webkitendfullscreen", onEndFullscreen, false);
                    bigscreen.onchange();
                    callOnExit();
                }, false);
                if (videoElement.readyState < videoElement.HAVE_METADATA) {
                    videoElement.addEventListener("loadedmetadata", function onMetadataLoaded() {
                        videoElement.removeEventListener("loadedmetadata", onMetadataLoaded, false);
                        videoElement.webkitEnterFullscreen();
                        hasControls = !!videoElement.getAttribute("controls");
                    }, false);
                    videoElement.load();
                } else {
                    videoElement.webkitEnterFullscreen();
                    hasControls = !!videoElement.getAttribute("controls");
                }
                lastVideoElement = videoElement;
            } catch (err) {
                return callOnError("not_supported", element);
            }
            return true;
        }
        return callOnError(fn.request === undefined ? "not_supported" : "not_enabled", element);
    }
    function resizeExitHack() {
        if (!bigscreen.element) {
            callOnExit();
            removeWindowResizeHack();
        }
    }
    function addWindowResizeHack() {
        if (iframe && fn.change === "webkitfullscreenchange") {
            window.addEventListener("resize", resizeExitHack, false);
        }
    }
    function removeWindowResizeHack() {
        if (iframe && fn.change === "webkitfullscreenchange") {
            window.removeEventListener("resize", resizeExitHack, false);
        }
    }
    var callOnEnter = function(actualElement) {
        var lastElement = elements[elements.length - 1];
        if ((actualElement === lastElement.element || actualElement === lastVideoElement) && lastElement.hasEntered) {
            return;
        }
        if (elements.length === 1) {
            bigscreen.onenter(bigscreen.element);
        }
        lastElement.enter.call(lastElement.element, actualElement || lastElement.element);
        lastElement.hasEntered = true;
    };
    var callOnExit = function() {
        if (lastVideoElement && !hasControls) {
            lastVideoElement.setAttribute("controls", "controls");
            lastVideoElement.removeAttribute("controls");
        }
        lastVideoElement = null;
        hasControls = null;
        var element = elements.pop();
        if (element) {
            element.exit.call(element.element);
            if (!bigscreen.element) {
                elements.forEach(function(element) {
                    element.exit.call(element.element);
                });
                elements = [];
                bigscreen.onexit();
            }
        }
    };
    var callOnError = function(reason, element) {
        if (elements.length > 0) {
            var obj = elements.pop();
            element = element || obj.element;
            obj.error.call(element, reason);
            bigscreen.onerror(element, reason);
        }
    };
    var bigscreen = {
        request: function(element, enterCallback, exitCallback, errorCallback) {
            element = element || document.documentElement;
            elements.push({
                element: element,
                enter: enterCallback || emptyFunction,
                exit: exitCallback || emptyFunction,
                error: errorCallback || emptyFunction
            });
            if (fn.request === undefined) {
                return videoEnterFullscreen(element);
            }
            if (iframe && document[fn.enabled] === false) {
                return videoEnterFullscreen(element);
            }
            if (iframe && fn.enabled === undefined) {
                fn.enabled = "webkitFullscreenEnabled";
                element[fn.request]();
                setTimeout(function() {
                    if (!document[fn.element]) {
                        document[fn.enabled] = false;
                        videoEnterFullscreen(element);
                    } else {
                        document[fn.enabled] = true;
                    }
                }, 250);
                return;
            }
            try {
                if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {
                    element[fn.request]();
                } else {
                    element[fn.request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
                }
                setTimeout(function() {
                    if (!document[fn.element]) {
                        callOnError(iframe ? "not_enabled" : "not_allowed", element);
                    }
                }, 100);
            } catch (err) {
                callOnError("not_enabled", element);
            }
        },
        exit: function() {
            removeWindowResizeHack();
            document[fn.exit]();
        },
        toggle: function(element, enterCallback, exitCallback, errorCallback) {
            if (bigscreen.element) {
                bigscreen.exit();
            } else {
                bigscreen.request(element, enterCallback, exitCallback, errorCallback);
            }
        },
        videoEnabled: function(element) {
            if (bigscreen.enabled) {
                return true;
            }
            element = element || document.documentElement;
            var video = _getVideo(element);
            if (!video || video.webkitSupportsFullscreen === undefined) {
                return false;
            }
            return video.readyState < video.HAVE_METADATA ? "maybe" : video.webkitSupportsFullscreen;
        },
        onenter: emptyFunction,
        onexit: emptyFunction,
        onchange: emptyFunction,
        onerror: emptyFunction
    };
    try {
        Object.defineProperties(bigscreen, {
            element: {
                enumerable: true,
                get: function() {
                    if (lastVideoElement && lastVideoElement.webkitDisplayingFullscreen) {
                        return lastVideoElement;
                    }
                    return document[fn.element] || null;
                }
            },
            enabled: {
                enumerable: true,
                get: function() {
                    if (fn.exit === "webkitCancelFullScreen" && !iframe) {
                        return true;
                    }
                    return document[fn.enabled] || false;
                }
            }
        });
    } catch (err) {
        bigscreen.element = null;
        bigscreen.enabled = false;
    }
    if (fn.change) {
        document.addEventListener(fn.change, function onFullscreenChange(event) {
            bigscreen.onchange(bigscreen.element);
            if (bigscreen.element) {
                var previousElement = elements[elements.length - 2];
                if (previousElement && previousElement.element === bigscreen.element) {
                    callOnExit();
                } else {
                    callOnEnter(bigscreen.element);
                    addWindowResizeHack();
                }
            } else {
                callOnExit();
            }
        }, false);
    }
    if (fn.error) {
        document.addEventListener(fn.error, function onFullscreenError(event) {
            callOnError("not_allowed");
        }, false);
    }
    window["BigScreen"] = bigscreen;
})(window, document, self !== top);