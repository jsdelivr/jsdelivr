/*! BigScreen
 * v2.0.4 - 2014-05-06
 * https://github.com/bdougherty/BigScreen
 * Copyright 2014 Brad Dougherty; Apache 2.0 License
 */
(function(window, document, iframe) {
    "use strict";
    var keyboardAllowed = typeof Element !== "undefined" && "ALLOW_KEYBOARD_INPUT" in Element;
    var iOS7 = /i(Pad|Phone|Pod)/.test(navigator.userAgent) && parseInt(navigator.userAgent.replace(/^.*OS (\d+)_(\d+).*$/, "$1.$2"), 10) >= 7;
    var fn = function() {
        var testElement = document.createElement("video");
        var browserProperties = {
            request: [ "requestFullscreen", "webkitRequestFullscreen", "webkitRequestFullScreen", "mozRequestFullScreen", "msRequestFullscreen" ],
            exit: [ "exitFullscreen", "webkitCancelFullScreen", "webkitExitFullscreen", "mozCancelFullScreen", "msExitFullscreen" ],
            enabled: [ "fullscreenEnabled", "webkitFullscreenEnabled", "mozFullScreenEnabled", "msFullscreenEnabled" ],
            element: [ "fullscreenElement", "webkitFullscreenElement", "webkitCurrentFullScreenElement", "mozFullScreenElement", "msFullscreenElement" ],
            change: [ "fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange" ],
            error: [ "fullscreenerror", "webkitfullscreenerror", "mozfullscreenerror", "MSFullscreenError" ]
        };
        var properties = {};
        for (var prop in browserProperties) {
            for (var i = 0, length = browserProperties[prop].length; i < length; i++) {
                if (browserProperties[prop][i] in testElement || browserProperties[prop][i] in document || "on" + browserProperties[prop][i].toLowerCase() in document) {
                    properties[prop] = browserProperties[prop][i];
                    break;
                }
            }
        }
        return properties;
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
    var chromeAndroid = false;
    if (navigator.userAgent.indexOf("Android") > -1 && navigator.userAgent.indexOf("Chrome") > -1) {
        chromeAndroid = parseInt(navigator.userAgent.replace(/^.*Chrome\/(\d+).*$/, "$1"), 10) || true;
    }
    function videoEnterFullscreen(element) {
        var videoElement = _getVideo(element);
        if (videoElement && videoElement.webkitEnterFullscreen) {
            try {
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
        if (actualElement.tagName === "VIDEO") {
            lastVideoElement = actualElement;
        }
        if (elements.length === 1) {
            bigscreen.onenter(bigscreen.element);
        }
        lastElement.enter.call(lastElement.element, actualElement || lastElement.element);
        lastElement.hasEntered = true;
    };
    var callOnExit = function() {
        if (lastVideoElement && !hasControls && !iOS7) {
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
            element = element || document.body;
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
            if (chromeAndroid !== false && chromeAndroid < 32) {
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
            element = element || document.body;
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
                    if (chromeAndroid !== false && chromeAndroid < 32) {
                        return false;
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
    document.addEventListener("webkitbeginfullscreen", function onBeginFullscreen(event) {
        elements.push({
            element: event.srcElement,
            enter: emptyFunction,
            exit: emptyFunction,
            error: emptyFunction
        });
        bigscreen.onchange(event.srcElement);
        callOnEnter(event.srcElement);
    }, true);
    document.addEventListener("webkitendfullscreen", function onEndFullscreen(event) {
        bigscreen.onchange(event.srcElement);
        callOnExit(event.srcElement);
    }, true);
    if (fn.error) {
        document.addEventListener(fn.error, function onFullscreenError(event) {
            callOnError("not_allowed");
        }, false);
    }
    window["BigScreen"] = bigscreen;
})(window, document, self !== top);