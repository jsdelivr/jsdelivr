(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.VASTPlayer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/VASTPlayer');

},{"./lib/VASTPlayer":5}],2:[function(require,module,exports){
'use strict';

function proxy(event, source, target) {
    source.on(event, function emit(/*...args*/) {
        var args = [], length = arguments.length;
        while (length--) { args[length] = arguments[length]; }

        target.emit.apply(target, [event].concat(args));
    });
}

function init(source, target, events) {
    events.forEach(function(event) {
        if (target.listeners(event).length > 0) {
            proxy(event, source, target);
        }
    });

    target.on('newListener', function handleNewListener(type) {
        if (events.indexOf(type) > -1 && target.listeners(type).length < 1) {
            proxy(type, source, target);
        }
    });
}

function EventProxy(events) {
    this.events = events.slice();

    this.__private__ = {
        target: null,
        source: null
    };
}

EventProxy.prototype.from = function from(source) {
    this.__private__.source = source;

    if (this.__private__.target) {
        init(source, this.__private__.target, this.events);
    }

    return this;
};

EventProxy.prototype.to = function to(target) {
    this.__private__.target = target;

    if (this.__private__.source) {
        init(this.__private__.source, target, this.events);
    }

    return this;
};

module.exports = EventProxy;

},{}],3:[function(require,module,exports){
'use strict';

var VideoTracker = require('./VideoTracker');
var inherits = require('util').inherits;
var EVENTS = require('./enums/HTML_MEDIA_EVENTS');

function HTMLVideoTracker(video) {
    var self = this;

    VideoTracker.call(this, Math.floor(video.duration || 0)); // call super()

    this.video = video;

    [
        EVENTS.PLAYING,
        EVENTS.PAUSE,
        EVENTS.TIMEUPDATE
    ].forEach(function(event) {
        return video.addEventListener(event, function onevent() {
            return self.tick();
        }, false);
    });
}
inherits(HTMLVideoTracker, VideoTracker);

HTMLVideoTracker.prototype._getState = function _getState() {
    return {
        playing: !this.video.paused,
        currentTime: this.video.currentTime
    };
};

module.exports = HTMLVideoTracker;

},{"./VideoTracker":7,"./enums/HTML_MEDIA_EVENTS":8,"util":25}],4:[function(require,module,exports){
'use strict';

var EVENTS = require('./enums/VPAID_EVENTS');

function identity(value) {
    return value;
}

function fire(pixels, mapper) {
    (pixels || []).forEach(function(src) {
        new Image().src = mapper(src);
    });
}

function PixelReporter(pixels, mapper) {
    this.pixels = pixels.reduce(function(pixels, item) {
        (pixels[item.event] || (pixels[item.event] = [])).push(item.uri);
        return pixels;
    }, {});

    this.__private__ = {
        mapper: mapper || identity
    };
}

PixelReporter.prototype.track = function track(vpaid) {
    var pixels = this.pixels;
    var customMapper = this.__private__.mapper;
    var lastVolume = vpaid.adVolume;

    function fireType(type, mapper, predicate) {
        function pixelMapper(url) {
            return customMapper((mapper || identity)(url));
        }

        return function firePixels() {
            if (!predicate || predicate()) {
                fire(pixels[type], pixelMapper);
            }
        };
    }

    vpaid.on(EVENTS.AdSkipped, fireType('skip'));
    vpaid.on(EVENTS.AdStarted, fireType('creativeView'));
    vpaid.on(EVENTS.AdVolumeChange, fireType('unmute', null, function() {
        return lastVolume === 0 && vpaid.adVolume > 0;
    }));
    vpaid.on(EVENTS.AdVolumeChange, fireType('mute', null, function() {
        return lastVolume > 0 && vpaid.adVolume === 0;
    }));
    vpaid.on(EVENTS.AdImpression, fireType('impression'));
    vpaid.on(EVENTS.AdVideoStart, fireType('start'));
    vpaid.on(EVENTS.AdVideoFirstQuartile, fireType('firstQuartile'));
    vpaid.on(EVENTS.AdVideoMidpoint, fireType('midpoint'));
    vpaid.on(EVENTS.AdVideoThirdQuartile, fireType('thirdQuartile'));
    vpaid.on(EVENTS.AdVideoComplete, fireType('complete'));
    vpaid.on(EVENTS.AdClickThru, fireType('clickThrough'));
    vpaid.on(EVENTS.AdUserAcceptInvitation, fireType('acceptInvitationLinear'));
    vpaid.on(EVENTS.AdUserMinimize, fireType('collapse'));
    vpaid.on(EVENTS.AdUserClose, fireType('closeLinear'));
    vpaid.on(EVENTS.AdPaused, fireType('pause'));
    vpaid.on(EVENTS.AdPlaying, fireType('resume'));
    vpaid.on(EVENTS.AdError, fireType('error', function(pixel) {
        return pixel.replace(/\[ERRORCODE\]/g, 901);
    }));

    vpaid.on(EVENTS.AdVolumeChange, function updateLastVolume() {
        lastVolume = vpaid.adVolume;
    });
};

module.exports = PixelReporter;

},{"./enums/VPAID_EVENTS":10}],5:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var VAST = require('vastacular').VAST;
var JavaScriptVPAIDPlayer = require('./players/JavaScriptVPAID');
var FlashVPAIDPlayer = require('./players/FlashVPAID');
var HTMLVideoPlayer = require('./players/HTMLVideo');
var MIME = require('./enums/MIME');
var EVENTS = require('./enums/VPAID_EVENTS');
var EventProxy = require('./EventProxy');
var LiePromise = require('lie');
var PixelReporter = require('./PixelReporter');

function defaults(/*...objects*/) {
    var result = {};
    var length = arguments.length;
    var index, object;
    var prop, value;

    for (index = 0; index < length; index++) {
        object = arguments[index] || {};

        for (prop in object) {
            value = object[prop];

            if (result[prop] === undefined) {
                result[prop] = value;
            }

            if (typeof value === 'object') {
                result[prop] = defaults(result[prop], value);
            }
        }
    }

    return result;
}

function identity(value) {
    return value;
}

function getNotReadyError() {
    return new Error('VASTPlayer not ready.');
}

function proxy(method) {
    return function callMethod() {
        var self = this;
        var player = this.__private__.player;

        if (!this.ready) {
            return LiePromise.reject(getNotReadyError());
        }

        return player[method].apply(player, arguments).then(function() {
            return self;
        });
    };
}

function proxyProp(property) {
    return {
        get: function get() {
            if (!this.ready) { throw getNotReadyError(); }

            return this.__private__.player[property];
        },

        set: function set(value) {
            if (!this.ready) { throw getNotReadyError(); }

            return (this.__private__.player[property] = value);
        }
    };
}

function VASTPlayer(container, config) {
    var self = this;

    EventEmitter.call(this); // call super()

    this.__private__ = {
        container: container,
        config: defaults(config, {
            vast: {
                resolveWrappers: true,
                maxRedirects: 5
            },
            tracking: {
                mapper: identity
            }
        }),

        vast: null,
        ready: false,
        player: null
    };

    this.on(EVENTS.AdClickThru, function onAdClickThru(url, id, playerHandles) {
        var clickThrough = url || self.vast.get('ads[0].creatives[0].videoClicks.clickThrough');

        if (playerHandles && clickThrough) {
            window.open(clickThrough);
        }
    });
}
inherits(VASTPlayer, EventEmitter);
Object.defineProperties(VASTPlayer.prototype, {
    container: {
        get: function getContainer() {
            return this.__private__.container;
        }
    },

    config: {
        get: function getConfig() {
            return this.__private__.config;
        }
    },

    vast: {
        get: function getVast() {
            return this.__private__.vast;
        }
    },

    ready: {
        get: function getReady() {
            return this.__private__.ready;
        }
    },

    adRemainingTime: proxyProp('adRemainingTime'),
    adDuration: proxyProp('adDuration'),
    adVolume: proxyProp('adVolume')
});

VASTPlayer.prototype.load = function load(uri) {
    var self = this;
    var config = this.config.vast;

    return VAST.fetch(uri, config).then(function loadPlayer(vast) {
        var config = (function() {
            var jsVPAIDFiles = vast.filter('ads[0].creatives[0].mediaFiles', function(mediaFile) {
                return (
                    mediaFile.type === MIME.JAVASCRIPT ||
                    mediaFile.type === 'application/x-javascript'
                ) && mediaFile.apiFramework === 'VPAID';
            });
            var swfVPAIDFiles = vast.filter('ads[0].creatives[0].mediaFiles', function(mediaFile) {
                return mediaFile.type === MIME.FLASH && mediaFile.apiFramework === 'VPAID';
            });
            var files = vast.filter('ads[0].creatives[0].mediaFiles', function() { return true; });

            if (jsVPAIDFiles.length > 0) {
                return {
                    player: new JavaScriptVPAIDPlayer(self.container),
                    mediaFiles: jsVPAIDFiles
                };
            } else if (swfVPAIDFiles.length > 0) {
                return {
                    player: new FlashVPAIDPlayer(self.container, VASTPlayer.vpaidSWFLocation),
                    mediaFiles: swfVPAIDFiles
                };
            }

            return {
                player: new HTMLVideoPlayer(self.container),
                mediaFiles: files
            };
        }());
        var parameters = vast.get('ads[0].creatives[0].parameters');
        var pixels = [].concat(
            vast.map('ads[0].impressions', function(impression) {
                return { event: 'impression', uri: impression.uri };
            }),
            vast.map('ads[0].errors', function(uri) {
                return { event: 'error', uri: uri };
            }),
            vast.get('ads[0].creatives[0].trackingEvents'),
            vast.map('ads[0].creatives[0].videoClicks.clickTrackings', function(uri) {
                return { event: 'clickThrough', uri: uri };
            })
        );
        var player = config.player;
        var mediaFiles = config.mediaFiles;
        var proxy = new EventProxy(EVENTS);
        var reporter = new PixelReporter(pixels, self.config.tracking.mapper);

        proxy.from(player).to(self);

        self.__private__.vast = vast;
        self.__private__.player = player;

        return player.load(mediaFiles, parameters).then(function setupPixels() {
            reporter.track(player);
        });
    }).then(function setReady() {
        self.__private__.ready = true;
        self.emit('ready');

        return self;
    }).catch(function emitError(reason) {
        self.emit('error', reason);

        throw reason;
    });
};

VASTPlayer.prototype.startAd = proxy('startAd');

VASTPlayer.prototype.stopAd = proxy('stopAd');

VASTPlayer.prototype.pauseAd = proxy('pauseAd');

VASTPlayer.prototype.resumeAd = proxy('resumeAd');

VASTPlayer.vpaidSWFLocation = 'https://cdn.jsdelivr.net' +
    '/vast-player/0.2.9/vast-player--vpaid.swf';

module.exports = VASTPlayer;

},{"./EventProxy":2,"./PixelReporter":4,"./enums/MIME":9,"./enums/VPAID_EVENTS":10,"./players/FlashVPAID":12,"./players/HTMLVideo":13,"./players/JavaScriptVPAID":14,"events":18,"lie":26,"util":25,"vastacular":30}],6:[function(require,module,exports){
'use strict';

function VPAIDVersion(versionString) {
    var parts = versionString.split('.').map(parseFloat);

    this.string = versionString;

    this.major = parts[0];
    this.minor = parts[1];
    this.patch = parts[2];

    Object.freeze(this);
}

VPAIDVersion.prototype.toString = function toString() {
    return this.string;
};

module.exports = VPAIDVersion;

},{}],7:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var EVENTS = require('./enums/VPAID_EVENTS');

function fire(event, tracker) {
    if (tracker.fired[event]) { return; }

    tracker.emit(event);
    tracker.fired[event] = true;
}

function VideoTracker(duration) {
    EventEmitter.apply(this, arguments); // call super()

    this.duration = duration;
    this.seconds = Array.apply([], new Array(duration)).map(function() { return false; });

    this.fired = [
        EVENTS.AdVideoStart,
        EVENTS.AdVideoFirstQuartile,
        EVENTS.AdVideoMidpoint,
        EVENTS.AdVideoThirdQuartile,
        EVENTS.AdVideoComplete
    ].reduce(function(fired, event) {
        fired[event] = false;
        return fired;
    }, {});
}
inherits(VideoTracker, EventEmitter);

VideoTracker.prototype.tick = function tick() {
    var seconds = this.seconds;
    var state = this._getState();
    var index = Math.round(state.currentTime) - 1;
    var quartileIndices = [1, 2, 3, 4].map(function(quartile) {
        return Math.floor(this.duration / 4  * quartile);
    }, this);

    function quartileViewed(quartile) {
        var end = quartileIndices[quartile - 1];

        return seconds.slice(0, end).every(function(second) {
            return second === true;
        });
    }

    if (state.playing) {
        fire(EVENTS.AdVideoStart, this);

        if (index > -1) {
            this.seconds[index] = true;
        }
    }

    if (quartileViewed(1)) {
        fire(EVENTS.AdVideoFirstQuartile, this);
    }

    if (quartileViewed(2)) {
        fire(EVENTS.AdVideoMidpoint, this);
    }

    if (quartileViewed(3)) {
        fire(EVENTS.AdVideoThirdQuartile, this);
    }

    if (quartileViewed(4)) {
        fire(EVENTS.AdVideoComplete, this);
    }
};

module.exports = VideoTracker;

},{"./enums/VPAID_EVENTS":10,"events":18,"util":25}],8:[function(require,module,exports){
'use strict';

var HTML_MEDIA_EVENTS = [
    'abort',
    'canplay',
    'canplaythrough',
    'durationchange',
    'emptied',
    'encrypted',
    'ended',
    'error',
    'interruptbegin',
    'interruptend',
    'loadeddata',
    'loadedmetadata',
    'loadstart',
    'mozaudioavailable',
    'pause',
    'play',
    'playing',
    'progress',
    'ratechange',
    'seeked',
    'seeking',
    'stalled',
    'suspend',
    'timeupdate',
    'volumechange',
    'waiting'
];

HTML_MEDIA_EVENTS.forEach(function(event) {
    this[event.toUpperCase()] = event;
}, HTML_MEDIA_EVENTS);

Object.freeze(HTML_MEDIA_EVENTS);

module.exports = HTML_MEDIA_EVENTS;

},{}],9:[function(require,module,exports){
var MIME = {
    JAVASCRIPT: 'application/javascript',
    FLASH: 'application/x-shockwave-flash'
};

Object.freeze(MIME);

module.exports = MIME;

},{}],10:[function(require,module,exports){
'use strict';

var VPAID_EVENTS = [
    'AdLoaded',
    'AdStarted',
    'AdStopped',
    'AdSkipped',
    'AdSkippableStateChange',
    'AdSizeChange',
    'AdLinearChange',
    'AdDurationChange',
    'AdExpandedChange',
    'AdRemainingTimeChange',
    'AdVolumeChange',
    'AdImpression',
    'AdVideoStart',
    'AdVideoFirstQuartile',
    'AdVideoMidpoint',
    'AdVideoThirdQuartile',
    'AdVideoComplete',
    'AdClickThru',
    'AdInteraction',
    'AdUserAcceptInvitation',
    'AdUserMinimize',
    'AdUserClose',
    'AdPaused',
    'AdPlaying',
    'AdLog',
    'AdError'
];

VPAID_EVENTS.forEach(function(event) {
    VPAID_EVENTS[event] = event;
});

Object.freeze(VPAID_EVENTS);

module.exports = VPAID_EVENTS;

},{}],11:[function(require,module,exports){
'use strict';

var win = require('./window');
var video = document.createElement('video');
var MIME = require('./enums/MIME');

exports.isDesktop = !/Android|Silk|Mobile|PlayBook/.test(win.navigator.userAgent);

exports.canPlay = function canPlay(type) {
    var mimeTypes = win.navigator.mimeTypes;
    var ActiveXObject = win.ActiveXObject;

    switch (type) {
    case MIME.FLASH:
        try {
            return new ActiveXObject('ShockwaveFlash.ShockwaveFlash') ? 2 : 0;
        } catch (e) {
            return !!(mimeTypes && mimeTypes[MIME.FLASH]) ? 2 : 0;
        }
        return 0;
    case MIME.JAVASCRIPT:
    case 'application/x-javascript':
        return 2;
    default:
        if (video.canPlayType) {
            switch (video.canPlayType(type)) {
            case 'probably':
                return 2;
            case 'maybe':
                return 1;
            default:
                return 0;
            }
        }
    }

    return 0;
};

Object.freeze(exports);

},{"./enums/MIME":9,"./window":17}],12:[function(require,module,exports){
'use strict';

var VPAID = require('./VPAID');
var inherits = require('util').inherits;
var LiePromise = require('lie');
var uuid = require('../uuid');
var querystring = require('querystring');
var EVENTS = require('../enums/VPAID_EVENTS');
var VPAIDVersion = require('../VPAIDVersion');

function FlashVPAID(container, swfURI) {
    VPAID.apply(this, arguments); // call super()

    this.swfURI = swfURI;
    this.object = null;
}
inherits(FlashVPAID, VPAID);

FlashVPAID.prototype.load = function load(mediaFiles, parameters) {
    var self = this;
    var uri = mediaFiles[0].uri;
    var bitrate = mediaFiles[0].bitrate;

    return new LiePromise(function loadCreative(resolve, reject) {
        var vpaid = document.createElement('object');
        var eventFnName = 'vast_player__' + uuid(20);
        var flashvars = querystring.stringify({
            vpaidURI: uri,
            eventCallback: eventFnName
        });

        function cleanup(reason) {
            self.container.removeChild(vpaid);
            self.api = null;
            self.object = null;
            delete window[eventFnName];

            if (reason) {
                reject(reason);
            }
        }

        vpaid.type = 'application/x-shockwave-flash';
        vpaid.data = self.swfURI + '?' + flashvars;
        vpaid.style.display = 'block';
        vpaid.style.width = '100%';
        vpaid.style.height = '100%';
        vpaid.style.border = 'none';
        vpaid.style.opacity = '0';
        vpaid.innerHTML = [
            '<param name="movie" value="' + self.swfURI + '">',
            '<param name="flashvars" value="' + flashvars + '">',
            '<param name="quality" value="high">',
            '<param name="play" value="false">',
            '<param name="loop" value="false">',
            '<param name="wmode" value="opaque">',
            '<param name="scale" value="noscale">',
            '<param name="salign" value="lt">',
            '<param name="allowScriptAccess" value="always">'
        ].join('\n');

        self.object = vpaid;

        window[eventFnName] = function handleVPAIDEvent(event) {
            switch (event.type) {
            case EVENTS.AdClickThru:
                return self.emit(event.type, event.url, event.Id, event.playerHandles);
            case EVENTS.AdInteraction:
            case EVENTS.AdLog:
                return self.emit(event.type, event.Id);
            case EVENTS.AdError:
                return self.emit(event.type, event.message);
            default:
                return self.emit(event.type);
            }
        };

        self.once('VPAIDInterfaceReady', function initAd() {
            var position = vpaid.getBoundingClientRect();
            var version = self.vpaidVersion = new VPAIDVersion(vpaid.handshakeVersion('2.0'));

            if (version.major > 2) {
                return reject(new Error('VPAID version ' + version + ' is not supported.'));
            }

            self.on('VPAIDInterfaceResize', function resizeAd() {
                var position = vpaid.getBoundingClientRect();

                self.resizeAd(position.width, position.height, 'normal');
            });

            vpaid.initAd(position.width, position.height, 'normal', bitrate, parameters, null);
        });

        self.once(EVENTS.AdLoaded, function handleAdLoaded() {
            self.api = vpaid;
            vpaid.style.opacity = '1';

            resolve(self);
        });

        self.once(EVENTS.AdError, function handleAdError(reason) {
            cleanup(new Error(reason));
        });

        self.once(EVENTS.AdStopped, cleanup);

        self.container.appendChild(vpaid);
    });
};

module.exports = FlashVPAID;

},{"../VPAIDVersion":6,"../enums/VPAID_EVENTS":10,"../uuid":16,"./VPAID":15,"lie":26,"querystring":23,"util":25}],13:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var LiePromise = require('lie');
var canPlay = require('../environment').canPlay;
var sortBy = require('sort-by');
var VPAID_EVENTS = require('../enums/VPAID_EVENTS');
var HTML_MEDIA_EVENTS = require('../enums/HTML_MEDIA_EVENTS');
var HTMLVideoTracker = require('../HTMLVideoTracker');
var EventProxy = require('../EventProxy');

function on(video, event, handler) {
    return video.addEventListener(event, handler, false);
}

function off(video, event, handler) {
    return video.removeEventListener(event, handler, false);
}

function once(video, event, handler) {
    return on(video, event, function onevent() {
        off(video, event, onevent);
        return handler.apply(this, arguments);
    });
}

function method(implementation, promiseify) {
    function getError() {
        return new Error('The <video> has not been loaded.');
    }

    return function callImplementation(/*...args*/) {
        if (!this.video) {
            if (promiseify) { return LiePromise.reject(getError()); } else { throw getError(); }
        }

        return implementation.apply(this, arguments);
    };
}

function pickMediaFile(mediaFiles, dimensions) {
    var width = dimensions.width;
    var items = mediaFiles.map(function(mediaFile) {
        return {
            mediaFile: mediaFile,
            playability: canPlay(mediaFile.type)
        };
    }).filter(function(config) {
        return config.playability > 0;
    }).sort(sortBy('-playability', '-mediaFile.bitrate'));
    var distances = items.map(function(item) {
        return Math.abs(width - item.mediaFile.width);
    });
    var item = items[distances.indexOf(Math.min.apply(Math, distances))];

    return (!item || item.playability < 1) ? null : item.mediaFile;
}

function HTMLVideo(container) {
    this.container = container;
    this.video = null;

    this.__private__ = {
        hasPlayed: false
    };
}
inherits(HTMLVideo, EventEmitter);
Object.defineProperties(HTMLVideo.prototype, {
    adRemainingTime: { get: method(function getAdRemainingTime() {
        return this.video.duration - this.video.currentTime;
    }) },
    adDuration: { get: method(function getAdDuration() { return this.video.duration; }) },
    adVolume: {
        get: method(function getAdVolume() { return this.video.volume; }),
        set: method(function setAdVolume(volume) { this.video.volume = volume; })
    }
});

HTMLVideo.prototype.load = function load(mediaFiles) {
    var self = this;

    return new LiePromise(function loadCreative(resolve, reject) {
        var video = document.createElement('video');
        var mediaFile = pickMediaFile(mediaFiles, self.container.getBoundingClientRect());

        if (!mediaFile) {
            return reject(new Error('There are no playable <MediaFile>s.'));
        }

        video.setAttribute('webkit-playsinline', true);
        video.src = mediaFile.uri;
        video.preload = 'auto';

        video.style.display = 'block';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';

        once(video, HTML_MEDIA_EVENTS.LOADEDMETADATA, function onloadedmetadata() {
            var tracker = new HTMLVideoTracker(video);
            var proxy = new EventProxy(VPAID_EVENTS);

            proxy.from(tracker).to(self);

            self.video = video;
            resolve(self);

            self.emit(VPAID_EVENTS.AdLoaded);

            on(video, HTML_MEDIA_EVENTS.DURATIONCHANGE, function ondurationchange() {
                self.emit(VPAID_EVENTS.AdDurationChange);
            });
            on(video, HTML_MEDIA_EVENTS.VOLUMECHANGE, function onvolumechange() {
                self.emit(VPAID_EVENTS.AdVolumeChange);
            });
        });

        once(video, HTML_MEDIA_EVENTS.ERROR, function onerror() {
            var error = video.error;

            self.emit(VPAID_EVENTS.AdError, error.message);
            reject(error);
        });

        once(video, HTML_MEDIA_EVENTS.PLAYING, function onplaying() {
            self.__private__.hasPlayed = true;
            self.emit(VPAID_EVENTS.AdImpression);
        });

        once(video, HTML_MEDIA_EVENTS.ENDED, function onended() {
            self.stopAd();
        });

        on(video, 'click', function onclick() {
            self.emit(VPAID_EVENTS.AdClickThru, null, null, true);
        });

        self.container.appendChild(video);
    });
};

HTMLVideo.prototype.startAd = method(function startAd() {
    var self = this;
    var video = this.video;

    if (this.__private__.hasPlayed) {
        return LiePromise.reject(new Error('The ad has already been started.'));
    }

    return new LiePromise(function callPlay(resolve) {
        once(video, HTML_MEDIA_EVENTS.PLAYING, function onplaying() {
            resolve(self);
            self.emit(VPAID_EVENTS.AdStarted);
        });

        return video.play();
    });
}, true);

HTMLVideo.prototype.stopAd = method(function stopAd() {
    this.container.removeChild(this.video);
    this.emit(VPAID_EVENTS.AdStopped);

    return LiePromise.resolve(this);
}, true);

HTMLVideo.prototype.pauseAd = method(function pauseAd() {
    var self = this;
    var video = this.video;

    if (this.video.paused) {
        return LiePromise.resolve(this);
    }

    return new LiePromise(function callPause(resolve) {
        once(video, HTML_MEDIA_EVENTS.PAUSE, function onpause() {
            resolve(self);
            self.emit(VPAID_EVENTS.AdPaused);
        });

        return video.pause();
    });
}, true);

HTMLVideo.prototype.resumeAd = method(function resumeAd() {
    var self = this;
    var video = this.video;

    if (!this.__private__.hasPlayed) {
        return LiePromise.reject(new Error('The ad has not been started yet.'));
    }

    if (!this.video.paused) {
        return LiePromise.resolve(this);
    }

    return new LiePromise(function callPlay(resolve) {
        once(video, HTML_MEDIA_EVENTS.PLAY, function onplay() {
            resolve(self);
            self.emit(VPAID_EVENTS.AdPlaying);
        });

        return video.play();
    });
}, true);

module.exports = HTMLVideo;

},{"../EventProxy":2,"../HTMLVideoTracker":3,"../enums/HTML_MEDIA_EVENTS":8,"../enums/VPAID_EVENTS":10,"../environment":11,"events":18,"lie":26,"sort-by":28,"util":25}],14:[function(require,module,exports){
'use strict';

var inherits = require('util').inherits;
var VPAID = require('./VPAID');
var LiePromise = require('lie');
var EVENTS = require('../enums/VPAID_EVENTS');
var isDesktop = require('../environment').isDesktop;
var VPAIDVersion = require('../VPAIDVersion');

function JavaScriptVPAID() {
    VPAID.apply(this, arguments); // call super()

    this.frame = null;
}
inherits(JavaScriptVPAID, VPAID);

JavaScriptVPAID.prototype.load = function load(mediaFiles, parameters) {
    var self = this;
    var uri = mediaFiles[0].uri;
    var bitrate = mediaFiles[0].bitrate;

    return new LiePromise(function loadCreative(resolve, reject) {
        var iframe = document.createElement('iframe');
        var script = document.createElement('script');
        var video = document.createElement('video');

        function cleanup(reason) {
            self.container.removeChild(iframe);
            self.frame = null;
            self.api = null;

            if (reason) {
                reject(reason);
            }
        }

        iframe.src = 'about:blank';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.display = 'block';
        iframe.style.opacity = '0';
        iframe.style.border = 'none';

        video.setAttribute('webkit-playsinline', 'true');
        video.style.display = 'block';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';

        self.container.appendChild(iframe);
        // Opening the iframe document for writing causes it to inherit its parent's location
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.close();

        iframe.contentWindow.document.body.style.margin = '0';
        self.frame = iframe;

        script.src = uri;
        script.onload = function onload() {
            var vpaid = iframe.contentWindow.getVPAIDAd();
            var position = iframe.getBoundingClientRect();
            var slot = iframe.contentWindow.document.body;
            var version = self.vpaidVersion = new VPAIDVersion(vpaid.handshakeVersion('2.0'));

            function resizeAd() {
                var position = iframe.getBoundingClientRect();

                self.resizeAd(position.width, position.height, 'normal');
            }

            if (version.major > 2) {
                return reject(new Error('VPAID version ' + version + ' is not supported.'));
            }

            iframe.contentWindow.addEventListener('resize', resizeAd, false);

            EVENTS.forEach(function subscribe(event) {
                return vpaid.subscribe(function handle(/*...args*/) {
                    var args = new Array(arguments.length);
                    var length = arguments.length;
                    while (length--) { args[length] = arguments[length]; }

                    return self.emit.apply(self, [event].concat(args));
                }, event);
            });

            self.once(EVENTS.AdLoaded, function onAdLoaded() {
                iframe.style.opacity = '1';
                self.api = vpaid;
                resolve(self);
            });

            self.once(EVENTS.AdError, function onAdError(reason) {
                cleanup(new Error(reason));
            });

            self.once(EVENTS.AdStopped, cleanup);

            vpaid.initAd(
                position.width,
                position.height,
                'normal',
                bitrate,
                { AdParameters: parameters },
                { slot: slot, videoSlot: video, videoSlotCanAutoPlay: isDesktop }
            );
        };
        script.onerror = function onerror() {
            cleanup(new Error('Failed to load MediaFile [' + uri + '].'));
        };

        iframe.contentWindow.document.body.appendChild(video);
        iframe.contentWindow.document.head.appendChild(script);
    });
};

module.exports = JavaScriptVPAID;

},{"../VPAIDVersion":6,"../enums/VPAID_EVENTS":10,"../environment":11,"./VPAID":15,"lie":26,"util":25}],15:[function(require,module,exports){
'use strict';

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var LiePromise = require('lie');
var EVENTS = require('../enums/VPAID_EVENTS');

function proxy(method, event) {
    return function callMethod(/*..args*/) {
        var args = arguments;
        var api = this.api;
        var self = this;

        function getError() {
            return new Error('Ad has not been loaded.');
        }

        function call() {
            return api[method].apply(api, args);
        }

        if (!event) {
            if (!api) {
                throw getError();
            }

            return call();
        }

        return new LiePromise(function(resolve, reject) {
            if (!api) {
                return reject(getError());
            }

            self.once(event, function done() {
                resolve(self);
            });

            return call();
        });
    };
}

function VPAID(container) {
    this.container = container;
    this.api = null;
    this.vpaidVersion = null;
}
inherits(VPAID, EventEmitter);
Object.defineProperties(VPAID.prototype, {
    adLinear: { get: proxy('getAdLinear') },
    adWidth: { get: proxy('getAdWidth') },
    adHeight: { get: proxy('getAdHeight') },
    adExpanded: { get: proxy('getAdExpanded') },
    adSkippableState: { get: proxy('getAdSkippableState') },
    adRemainingTime: { get: proxy('getAdRemainingTime') },
    adDuration: { get: proxy('getAdDuration') },
    adVolume: { get: proxy('getAdVolume'), set: proxy('setAdVolume') },
    adCompanions: { get: proxy('getAdCompanions') },
    adIcons: { get: proxy('getAdIcons') }
});

VPAID.prototype.load = function load() {
    throw new Error('VPAID subclass must implement load() method.');
};

VPAID.prototype.resizeAd = proxy('resizeAd', EVENTS.AdSizeChange);

VPAID.prototype.startAd = proxy('startAd', EVENTS.AdStarted);

VPAID.prototype.stopAd = proxy('stopAd', EVENTS.AdStopped);

VPAID.prototype.pauseAd = proxy('pauseAd', EVENTS.AdPaused);

VPAID.prototype.resumeAd = proxy('resumeAd', EVENTS.AdPlaying);

VPAID.prototype.expandAd = proxy('expandAd', EVENTS.AdExpandedChange);

VPAID.prototype.collapseAd = proxy('collapseAd', EVENTS.AdExpandedChange);

VPAID.prototype.skipAd = proxy('skipAd', EVENTS.AdSkipped);

module.exports = VPAID;

},{"../enums/VPAID_EVENTS":10,"events":18,"lie":26,"util":25}],16:[function(require,module,exports){
'use strict';

var POSSIBILITIES = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var POSSIBILITIES_LENGTH = POSSIBILITIES.length;

module.exports = function uuid(length) {
    var result = '';

    while (length--) {
        result += POSSIBILITIES.charAt(Math.floor(Math.random() * POSSIBILITIES_LENGTH));
    }

    return result;
};

},{}],17:[function(require,module,exports){
module.exports = window;

},{}],18:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],19:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],20:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],21:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],22:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],23:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":21,"./encode":22}],24:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],25:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":24,"_process":20,"inherits":19}],26:[function(require,module,exports){
'use strict';
var immediate = require('immediate');

/* istanbul ignore next */
function INTERNAL() {}

var handlers = {};

var REJECTED = ['REJECTED'];
var FULFILLED = ['FULFILLED'];
var PENDING = ['PENDING'];

module.exports = exports = Promise;

function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.queue = [];
  this.outcome = void 0;
  if (resolver !== INTERNAL) {
    safelyResolveThenable(this, resolver);
  }
}

Promise.prototype["catch"] = function (onRejected) {
  return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
    typeof onRejected !== 'function' && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.outcome);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }
  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}
QueueItem.prototype.callFulfilled = function (value) {
  handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};

function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (e) {
      return handlers.reject(promise, e);
    }
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      handlers.resolve(promise, returnValue);
    }
  });
}

handlers.resolve = function (self, value) {
  var result = tryCatch(getThen, value);
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.outcome = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;
};
handlers.reject = function (self, error) {
  self.state = REJECTED;
  self.outcome = error;
  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;
};

function getThen(obj) {
  // Make sure we only access the accessor once as required by the spec
  var then = obj && obj.then;
  if (obj && typeof obj === 'object' && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}

function safelyResolveThenable(self, thenable) {
  // Either fulfill, reject or reject with error
  var called = false;
  function onError(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.reject(self, value);
  }

  function onSuccess(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.resolve(self, value);
  }

  function tryToUnwrap() {
    thenable(onSuccess, onError);
  }

  var result = tryCatch(tryToUnwrap);
  if (result.status === 'error') {
    onError(result.value);
  }
}

function tryCatch(func, value) {
  var out = {};
  try {
    out.value = func(value);
    out.status = 'success';
  } catch (e) {
    out.status = 'error';
    out.value = e;
  }
  return out;
}

exports.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return handlers.resolve(new this(INTERNAL), value);
}

exports.reject = reject;
function reject(reason) {
  var promise = new this(INTERNAL);
  return handlers.reject(promise, reason);
}

exports.all = all;
function all(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }
  }
}

exports.race = race;
function race(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        handlers.resolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}

},{"immediate":27}],27:[function(require,module,exports){
(function (global){
'use strict';
var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function () {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],28:[function(require,module,exports){
var objectPath = require('object-path');
var sortBy;
var sort;

/**
 * Return a comparator function
 * @param  {String} property The key to sort by
 * @return {Function}        Returns the comparator function
 */
sort = function sort(property) {
    var sortOrder = 1;
    var fn;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function fn(a,b) {
        var result;
        if (objectPath.get(a, property) < objectPath.get(b, property)) result = -1;
        if (objectPath.get(a, property) > objectPath.get(b, property)) result = 1;
        if (objectPath.get(a, property) === objectPath.get(b, property)) result = 0;
        return result * sortOrder;
    }
};

/**
 * Return a comparator function that sorts by multiple keys
 * @return {Function} Returns the comparator function
 */
sortBy = function sortBy() {
    var properties = arguments;
    var fn;

    return function fn(obj1, obj2) {
        var numberOfProperties = properties.length,
            result = 0,
            i = 0;

        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = sort(properties[i])(obj1, obj2);
            i++;
        }
        return result;
    };
};

/**
 * Expose `sortBy`
 * @type {Function}
 */
module.exports = sortBy;
},{"object-path":29}],29:[function(require,module,exports){
(function (root, factory){
  'use strict';

  /*istanbul ignore next:cant test*/
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.objectPath = factory();
  }
})(this, function(){
  'use strict';

  var
    toStr = Object.prototype.toString,
    _hasOwnProperty = Object.prototype.hasOwnProperty;

  function isEmpty(value){
    if (!value) {
      return true;
    }
    if (isArray(value) && value.length === 0) {
      return true;
    } else {
      for (var i in value) {
        if (_hasOwnProperty.call(value, i)) {
          return false;
        }
      }
      return true;
    }
  }

  function toString(type){
    return toStr.call(type);
  }

  function isNumber(value){
    return typeof value === 'number' || toString(value) === "[object Number]";
  }

  function isString(obj){
    return typeof obj === 'string' || toString(obj) === "[object String]";
  }

  function isObject(obj){
    return typeof obj === 'object' && toString(obj) === "[object Object]";
  }

  function isArray(obj){
    return typeof obj === 'object' && typeof obj.length === 'number' && toString(obj) === '[object Array]';
  }

  function isBoolean(obj){
    return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
  }

  function getKey(key){
    var intKey = parseInt(key);
    if (intKey.toString() === key) {
      return intKey;
    }
    return key;
  }

  function set(obj, path, value, doNotReplace){
    if (isNumber(path)) {
      path = [path];
    }
    if (isEmpty(path)) {
      return obj;
    }
    if (isString(path)) {
      return set(obj, path.split('.'), value, doNotReplace);
    }
    var currentPath = getKey(path[0]);

    if (path.length === 1) {
      var oldVal = obj[currentPath];
      if (oldVal === void 0 || !doNotReplace) {
        obj[currentPath] = value;
      }
      return oldVal;
    }

    if (obj[currentPath] === void 0) {
      if (isNumber(currentPath)) {
        obj[currentPath] = [];
      } else {
        obj[currentPath] = {};
      }
    }

    return set(obj[currentPath], path.slice(1), value, doNotReplace);
  }

  function del(obj, path) {
    if (isNumber(path)) {
      path = [path];
    }

    if (isEmpty(obj)) {
      return void 0;
    }

    if (isEmpty(path)) {
      return obj;
    }
    if(isString(path)) {
      return del(obj, path.split('.'));
    }

    var currentPath = getKey(path[0]);
    var oldVal = obj[currentPath];

    if(path.length === 1) {
      if (oldVal !== void 0) {
        if (isArray(obj)) {
          obj.splice(currentPath, 1);
        } else {
          delete obj[currentPath];
        }
      }
    } else {
      if (obj[currentPath] !== void 0) {
        return del(obj[currentPath], path.slice(1));
      }
    }

    return obj;
  }

  var objectPath = {};

  objectPath.ensureExists = function (obj, path, value){
    return set(obj, path, value, true);
  };

  objectPath.set = function (obj, path, value, doNotReplace){
    return set(obj, path, value, doNotReplace);
  };

  objectPath.insert = function (obj, path, value, at){
    var arr = objectPath.get(obj, path);
    at = ~~at;
    if (!isArray(arr)) {
      arr = [];
      objectPath.set(obj, path, arr);
    }
    arr.splice(at, 0, value);
  };

  objectPath.empty = function(obj, path) {
    if (isEmpty(path)) {
      return obj;
    }
    if (isEmpty(obj)) {
      return void 0;
    }

    var value, i;
    if (!(value = objectPath.get(obj, path))) {
      return obj;
    }

    if (isString(value)) {
      return objectPath.set(obj, path, '');
    } else if (isBoolean(value)) {
      return objectPath.set(obj, path, false);
    } else if (isNumber(value)) {
      return objectPath.set(obj, path, 0);
    } else if (isArray(value)) {
      value.length = 0;
    } else if (isObject(value)) {
      for (i in value) {
        if (_hasOwnProperty.call(value, i)) {
          delete value[i];
        }
      }
    } else {
      return objectPath.set(obj, path, null);
    }
  };

  objectPath.push = function (obj, path /*, values */){
    var arr = objectPath.get(obj, path);
    if (!isArray(arr)) {
      arr = [];
      objectPath.set(obj, path, arr);
    }

    arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
  };

  objectPath.coalesce = function (obj, paths, defaultValue) {
    var value;

    for (var i = 0, len = paths.length; i < len; i++) {
      if ((value = objectPath.get(obj, paths[i])) !== void 0) {
        return value;
      }
    }

    return defaultValue;
  };

  objectPath.get = function (obj, path, defaultValue){
    if (isNumber(path)) {
      path = [path];
    }
    if (isEmpty(path)) {
      return obj;
    }
    if (isEmpty(obj)) {
      return defaultValue;
    }
    if (isString(path)) {
      return objectPath.get(obj, path.split('.'), defaultValue);
    }

    var currentPath = getKey(path[0]);

    if (path.length === 1) {
      if (obj[currentPath] === void 0) {
        return defaultValue;
      }
      return obj[currentPath];
    }

    return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
  };

  objectPath.del = function(obj, path) {
    return del(obj, path);
  };

  return objectPath;
});
},{}],30:[function(require,module,exports){
exports.VAST = require('./lib/VAST');

},{"./lib/VAST":31}],31:[function(require,module,exports){
'use strict';

var LiePromise = require('lie');
var request = require('superagent');
var copy = require('./utils/copy');
var defaults = require('./utils/defaults');
var extend = require('./utils/extend');
var nodeifyPromise = require('./utils/nodeify_promise');
var push = Array.prototype.push;
var xmlFromVast = require('./xml_from_vast');

var adDefaults = {
    inline: inline,
    wrapper: wrapper
};

var inlineDefaults = {
    linear: linear,
    companions: companions,
    nonLinear: nonLinear
};

function noop() {}

function inline(ad) {
    defaults({
        description: null,
        survey: null
    }, ad);
}

function wrapper() {}

function linear(creative) {
    defaults({
        trackingEvents: [],
        parameters: null,
        videoClicks: null
    }, creative);

    (creative.mediaFiles || []).forEach(function(mediaFile) {
        defaults({
            id: null,
            bitrate: null,
            scalable: null,
            maintainAspectRatio: null,
            apiFramework: null
        }, mediaFile);
    });
}

function companions(creative) {
    creative.companions.forEach(function(companion) {
        defaults({
            expandedWidth: null,
            expandedHeight: null,
            apiFramework: null,
            trackingEvents: [],
            clickThrough: null,
            altText: null,
            parameters: null
        }, companion);
    });
}

function nonLinear(creative) {
    defaults({
        trackingEvents: []
    }, creative);

    creative.ads.forEach(function(ad) {
        defaults({
            id: null,
            expandedWidth: null,
            expandedHeight: null,
            scalable: null,
            maintainAspectRatio: null,
            minSuggestedDuration: null,
            apiFramework: null,
            clickThrough: null,
            parameters: null
        }, ad);
    });
}

function VAST(json) {
    copy(json, this, true);

    this.ads.forEach(function(ad) {
        defaults({
            system: { version: null },
            errors: []
        }, ad);

        ad.creatives.forEach(function(creative) {
            defaults({
                id: null,
                sequence: null,
                adID: null
            }, creative);

            inlineDefaults[creative.type](creative);
        });

        adDefaults[ad.type](ad);
    });

    this.__private__ = { wrappers: [], inlines: [] };
}

Object.defineProperties(VAST.prototype, {
    wrappers: {
        get: function getWrappers() {
            var wrappers = this.__private__.wrappers;

            wrappers.length = 0;
            push.apply(wrappers, this.filter('ads', function(ad) {
                return ad.type === 'wrapper';
            }));

            return wrappers;
        }
    },

    inlines: {
        get: function getInlines() {
            var inlines = this.__private__.inlines;

            inlines.length = 0;
            push.apply(inlines, this.filter('ads', function(ad) {
                return ad.type === 'inline';
            }));

            return inlines;
        }
    }
});

VAST.prototype.get = function get(prop) {
    var parts = (prop || '').match(/[^\[\]\.]+/g) || [];

    return parts.reduce(function(result, part) {
        return (result || undefined) && result[part];
    }, this);
};

VAST.prototype.set = function set(prop, value) {
    var parts = (function() {
        var regex = (/[^\[\]\.]+/g);
        var result = [];

        var match;
        while (match = regex.exec(prop)) {
            result.push({
                token: match[0],
                type: getType(match, match.index + match[0].length)
            });
        }

        return result;
    }());
    var last = parts.pop();
    var object = parts.reduce(function(object, part) {
        return object[part.token] || (object[part.token] = new part.type());
    }, this);

    function getType(match, index) {
        switch (match.input.charAt(index)) {
        case '.':
            return Object;
        case '[':
            return Array;
        case ']':
            return getType(match, index + 1);
        default:
            return null;
        }
    }

    if (!prop) { throw new Error('prop must be specified.'); }

    return (object[last.token] = value);
};

VAST.prototype.map = function map(prop, mapper) {
    var array = this.get(prop) || [];
    var length = array.length;
    var result = [];

    if (!(array instanceof Array)) { return result; }

    var index = 0;
    for (; index < length; index++) {
        result.push(mapper.call(this, array[index], index, array));
    }

    return result;
};

VAST.prototype.filter = function filter(prop, predicate) {
    var array = this.get(prop) || [];
    var length = array.length;
    var result = [];

    if (!(array instanceof Array)) { return result; }

    var index = 0;
    for (; index < length; index++) {
        if (predicate.call(this, array[index], index, array)) {
            result.push(array[index]);
        }
    }

    return result;
};

VAST.prototype.find = function find(prop, predicate) {
    var array = this.get(prop) || [];
    var length = array.length;

    if (!(array instanceof Array)) { return undefined; }

    var index = 0;
    for (; index < length; index++) {
        if (predicate.call(this, array[index], index, array)) {
            return array[index];
        }
    }

    return undefined;
};

VAST.prototype.toPOJO = function toPOJO() {
    var pojo = JSON.parse(JSON.stringify(this));
    delete pojo.__private__;

    return pojo;
};

VAST.prototype.copy = function copy() {
    return new this.constructor(this.toPOJO());
};

VAST.prototype.resolveWrappers = function resolveWrappers(/*maxRedirects, callback*/) {
    var maxRedirects = isNaN(arguments[0]) ? Infinity : arguments[0];
    var callback = typeof arguments[0] === 'function' ? arguments[0] : arguments[1];

    var VAST = this.constructor;
    var vast = this;

    function decorateWithWrapper(wrapper, ad) {
        var wrapperCreativesByType = byType(wrapper.creatives);

        function typeIs(type) {
            return function checkType(creative) { return creative.type === type; };
        }

        function byType(creatives) {
            return {
                linear: creatives.filter(typeIs('linear')),
                companions: creatives.filter(typeIs('companions')),
                nonLinear: creatives.filter(typeIs('nonLinear'))
            };
        }

        // Extend the ad with the impressions and errors from the wrapper
        defaults(wrapper.impressions, ad.impressions);
        defaults(wrapper.errors, ad.errors);

        // Extend the ad's creatives with the creatives in the wrapper
        ad.creatives.forEach(function(creative) {
            defaults(wrapperCreativesByType[creative.type].shift() || {}, creative);
        });

        // If the ad is also a wrapper, add any of the wrapper's unused creatives to the ad so that
        // the final inline ad can use all of the creatives from the wrapper.
        push.apply(ad.creatives, ad.type !== 'wrapper' ? [] : [
            'linear', 'companions', 'nonLinear'
        ].reduce(function(result, type) {
            return result.concat(wrapperCreativesByType[type]);
        }, []));

        return ad;
    }

    if (maxRedirects === 0) {
        return LiePromise.reject(new Error('Too many redirects were made.'));
    }

    return nodeifyPromise(LiePromise.all(this.map('wrappers', function requestVAST(wrapper) {
        return LiePromise.resolve(request.get(wrapper.vastAdTagURI))
            .then(function makeVAST(response) {
                return {
                    wrapper: wrapper,
                    response: VAST.pojoFromXML(response.text).ads
                };
            });
    })).then(function merge(configs) {
        var wrappers = configs.map(function(config) { return config.wrapper; });
        var responses = configs.map(function(config) { return config.response; });

        return new VAST(extend(vast.toPOJO(), {
            ads: vast.map('ads', function(ad) {
                var wrapperIndex = wrappers.indexOf(ad);
                var wrapper = wrappers[wrapperIndex];
                var response = responses[wrapperIndex];

                return response ? response.map(decorateWithWrapper.bind(null, wrapper)) : [ad];
            }).reduce(function(result, array) { return result.concat(array); })
        }));
    }).then(function recurse(result) {
        if (result.get('wrappers.length') > 0) {
            return result.resolveWrappers(maxRedirects - 1);
        }

        return result;
    }), callback);
};

VAST.prototype.toXML = function toXML() {
    var check = this.validate();

    if (!check.valid) {
        throw new Error('VAST is invalid: ' + check.reasons.join(', '));
    }

    return xmlFromVast(this);
};

VAST.prototype.validate = function validate() {
    var vast = this;
    var reasons = [];
    var adValidators = {
        inline: function validateInlineAd(getAdProp) {
            var creativeValidators = {
                linear: function validateLinearCreative(getCreativeProp) {
                    makeAssertions(getCreativeProp, {
                        exists: ['duration'],
                        atLeastOne: ['mediaFiles']
                    });
                },
                companions: function validateCompanionsCreative(getCreativeProp) {
                    vast.get(getCreativeProp('companions')).forEach(function(companion, index) {
                        function getCompanionProp(prop) {
                            return getCreativeProp('companions[' + index + '].' + prop);
                        }

                        makeAssertions(getCompanionProp, {
                            exists: [],
                            atLeastOne: ['resources']
                        });
                    });
                },
                nonLinear: function validateNonLinearCreative(getCreativeProp) {
                    vast.get(getCreativeProp('ads')).forEach(function(ad, index) {
                        function getAdProp(prop) {
                            return getCreativeProp('ads[' + index + '].' + prop);
                        }

                        makeAssertions(getAdProp, {
                            exists: [],
                            atLeastOne: ['resources']
                        });
                    });
                }
            };

            makeAssertions(getAdProp, {
                exists: ['title'],
                atLeastOne: ['creatives']
            });

            vast.get(getAdProp('creatives')).forEach(function(creative, index) {
                function getCreativeProp(prop) {
                    return getAdProp('creatives[' + index + '].' + prop);
                }

                makeAssertions(getCreativeProp, {
                    exists: ['type'],
                    atLeastOne: []
                });

                (creativeValidators[creative.type] || noop)(getCreativeProp);
            });
        },
        wrapper: function validateWrapperAd(getAdProp) {
            makeAssertions(getAdProp, {
                exists: ['vastAdTagURI'],
                atLeastOne:[]
            });
        }
    };

    function assert(truthy, reason) {
        if (!truthy) { reasons.push(reason); }
    }

    function assertExists(prop) {
        assert(vast.get(prop), prop + ' is required');
    }

    function assertAtLeastOneValue(prop) {
        assert(vast.get(prop + '.length') > 0, prop + ' must contain at least one value');
    }

    function makeAssertions(getter, types) {
        types.exists.map(getter).forEach(assertExists);
        types.atLeastOne.map(getter).forEach(assertAtLeastOneValue);
    }

    makeAssertions(function(prop) { return prop; }, {
        exists: [],
        atLeastOne: ['ads']
    });

    this.get('ads').forEach(function(ad, index) {
        function getAdProp(prop) {
            return 'ads[' + index + '].' + prop;
        }

        makeAssertions(getAdProp, {
            exists: ['type', 'system.name'],
            atLeastOne: ['impressions']
        });

        (adValidators[ad.type] || noop)(getAdProp);
    });

    return { valid: reasons.length === 0, reasons: reasons.length === 0 ? null : reasons };
};

VAST.pojoFromXML = require('./pojo_from_xml');

VAST.fetch = function fetch(uri/*, options, callback*/) {
    var options = typeof arguments[1] === 'object' ? arguments[1] || {} : {};
    var callback = typeof arguments[2] === 'function' ? arguments[2] : arguments[1];

    var VAST = this;

    return nodeifyPromise(LiePromise.resolve(request.get(uri).set(options.headers || {}))
        .then(function makeVAST(response) {
            var vast = new VAST(VAST.pojoFromXML(response.text));

            return options.resolveWrappers ? vast.resolveWrappers(options.maxRedirects) : vast;
        }), callback);
};

module.exports = VAST;

},{"./pojo_from_xml":32,"./utils/copy":34,"./utils/defaults":35,"./utils/extend":36,"./utils/nodeify_promise":37,"./xml_from_vast":44,"lie":26,"superagent":45}],32:[function(require,module,exports){
'use strict';

var parseXML = require('./utils/parse_xml');
var timestampToSeconds = require('./utils/timestamp_to_seconds');
var stringToBoolean = require('./utils/string_to_boolean');
var extend = require('./utils/extend');
var trimObject = require('./utils/trim_object');
var numberify = require('./utils/numberify');

var creativeParsers = {
    linear: parseLinear,
    companions: parseCompanions,
    nonLinear: parseNonLinear
};

var adParsers = {
    inline: parseInline,
    wrapper: parseWrapper
};

function single(collection) {
    return collection[0] || { attributes: {} };
}

function parseResources(ad) {
    var resources = ad.find('StaticResource,IFrameResource,HTMLResource');

    return resources.map(function(resource) {
        return {
            type: resource.tag.replace(/Resource$/, '').toLowerCase(),
            creativeType: resource.attributes.creativeType,
            data: resource.value
        };
    });
}

function parseLinear(creative) {
    var duration = single(creative.find('Duration'));
    var events = creative.find('Tracking');
    var adParameters = single(creative.find('AdParameters'));
    var videoClicks = creative.find('VideoClicks')[0];
    var mediaFiles = creative.find('MediaFile');

    return {
        type: 'linear',
        duration: timestampToSeconds(duration.value) || undefined,
        trackingEvents: events.map(function(event) {
            return { event: event.attributes.event, uri: event.value };
        }),
        parameters: adParameters.value,
        videoClicks: videoClicks && (function() {
            var clickThrough = single(videoClicks.find('ClickThrough'));
            var trackings = videoClicks.find('ClickTracking');
            var customClicks = videoClicks.find('CustomClick');

            return {
                clickThrough: clickThrough.value,
                clickTrackings: trackings.map(function(tracking) {
                    return tracking.value;
                }),
                customClicks: customClicks.map(function(click) {
                    return { id: click.attributes.id, uri: click.value };
                })
            };
        }()),
        mediaFiles: mediaFiles.map(function(mediaFile) {
            var attrs = mediaFile.attributes;

            return {
                id: attrs.id,
                delivery: attrs.delivery,
                type: attrs.type,
                uri: mediaFile.value,
                bitrate: numberify(attrs.bitrate),
                width: numberify(attrs.width),
                height: numberify(attrs.height),
                scalable: stringToBoolean(attrs.scalable),
                maintainAspectRatio: stringToBoolean(attrs.maintainAspectRatio),
                apiFramework: attrs.apiFramework
            };
        })
    };
}

function parseCompanions(creative) {
    var companions = creative.find('Companion');

    return {
        type: 'companions',
        companions: companions.map(function(companion) {
            var events = companion.find('Tracking');
            var companionClickThrough = single(companion.find('CompanionClickThrough'));
            var altText = single(companion.find('AltText'));
            var adParameters = single(companion.find('AdParameters'));

            return {
                id: companion.attributes.id,
                width: numberify(companion.attributes.width),
                height: numberify(companion.attributes.height),
                expandedWidth: numberify(companion.attributes.expandedWidth),
                expandedHeight: numberify(companion.attributes.expandedHeight),
                apiFramework: companion.attributes.apiFramework,
                resources: parseResources(companion),
                trackingEvents: events.map(function(event) {
                    return { event: event.attributes.event, uri: event.value };
                }),
                clickThrough: companionClickThrough.value,
                altText: altText.value,
                parameters: adParameters.value
            };
        })
    };
}

function parseNonLinear(creative) {
    var ads = creative.find('NonLinear');
    var events = creative.find('Tracking');

    return {
        type: 'nonLinear',
        ads: ads.map(function(ad) {
            var nonLinearClickThrough = single(ad.find('NonLinearClickThrough'));
            var adParameters = single(ad.find('AdParameters'));

            return {
                id: ad.attributes.id,
                width: numberify(ad.attributes.width),
                height: numberify(ad.attributes.height),
                expandedWidth: numberify(ad.attributes.expandedWidth),
                expandedHeight: numberify(ad.attributes.expandedHeight),
                scalable: stringToBoolean(ad.attributes.scalable),
                maintainAspectRatio: stringToBoolean(ad.attributes.maintainAspectRatio),
                minSuggestedDuration: timestampToSeconds(ad.attributes.minSuggestedDuration) ||
                    undefined,
                apiFramework: ad.attributes.apiFramework,
                resources: parseResources(ad),
                clickThrough: nonLinearClickThrough.value,
                parameters: adParameters.value
            };
        }),
        trackingEvents: events.map(function(event) {
            return { event: event.attributes.event, uri: event.value };
        })
    };
}

function parseInline(ad) {
    var adTitle = single(ad.find('AdTitle'));
    var description = single(ad.find('Description'));
    var survey = single(ad.find('Survey'));

    return {
        type: 'inline',
        title: adTitle.value,
        description: description.value,
        survey: survey.value
    };
}

function parseWrapper(ad) {
    var vastAdTagURI = single(ad.find('VASTAdTagURI'));

    return {
        type: 'wrapper',
        vastAdTagURI: vastAdTagURI.value
    };
}

module.exports = function pojoFromXML(xml) {
    var $ = parseXML(xml);

    if (!$('VAST')[0]) {
        throw new Error('[' + xml + '] is not a valid VAST document.');
    }

    return trimObject({
        version: single($('VAST')).attributes.version,
        ads: $('Ad').map(function(ad) {
            var type = single(ad.find('Wrapper,InLine')).tag.toLowerCase();
            var adSystem = single(ad.find('AdSystem'));
            var errors = ad.find('Error');
            var impressions = ad.find('Impression');
            var creatives = ad.find('Creative');

            return extend({
                id: ad.attributes.id,
                system: {
                    name: adSystem.value,
                    version: adSystem.attributes.version
                },
                errors: errors.map(function(error) { return error.value; }),
                impressions: impressions.map(function(impression) {
                    return { uri: impression.value, id: impression.attributes.id };
                }),
                creatives: creatives.map(function(creative) {
                    var type = (function() {
                        var element = single(creative.find('Linear,CompanionAds,NonLinearAds'));

                        switch (element.tag) {
                        case 'Linear':
                            return 'linear';
                        case 'CompanionAds':
                            return 'companions';
                        case 'NonLinearAds':
                            return 'nonLinear';
                        }
                    }());

                    return extend({
                        id: creative.attributes.id,
                        sequence: numberify(creative.attributes.sequence),
                        adID: creative.attributes.AdID
                    }, creativeParsers[type](creative));
                })
            }, adParsers[type](ad));
        })
    }, true);
};

},{"./utils/extend":36,"./utils/numberify":38,"./utils/parse_xml":39,"./utils/string_to_boolean":41,"./utils/timestamp_to_seconds":42,"./utils/trim_object":43}],33:[function(require,module,exports){
'use strict';

function existy(value) {
    return value !== null && value !== undefined;
}

function escapeXML(string) {
    return string !== undefined ? String(string)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        : '';
}

function makeWhitespace(amount) {
    var result = '';

    while (amount--) {
        result += ' ';
    }

    return result;
}

function makeCDATA(text) {
    var parts = text !== undefined ? (function(text) {
        var result = [];
        var regex = (/]]>/g);

        var cursor = 0;
        var match, end;
        while (match = regex.exec(text)) {
            end = match.index + 2;

            result.push(match.input.substring(cursor, end));
            cursor = end;
        }
        result.push(text.substring(cursor, text.length));

        return result;
    }(String(text))) : [''];

    return parts.reduce(function(result, part) {
        return result + '<![CDATA[' + part + ']]>';
    }, '');
}

function nodeValue(node) {
    return node.cdata ? makeCDATA(node.value) : escapeXML(node.value);
}

function compileNode(node, indentation, trim) {
    var tag = node.tag;
    var attributes = node.attributes || {};
    var attributeNames = Object.keys(attributes);
    var children = node.children || [];
    var value = node.value;
    var hasChildren = children.length > 0;
    var hasAttributes = attributeNames.every(function(attribute) {
        return existy(attributes[attribute]);
    }) && attributeNames.length > 0;
    var hasValue = existy(value) || hasChildren || hasAttributes;

    var whitespace = makeWhitespace(indentation);
    var openingTag = '<' + tag + Object.keys(attributes).reduce(function(result, attribute) {
        if (trim && !existy(attributes[attribute])) { return result; }

        return result + ' ' + attribute + '="' + escapeXML(attributes[attribute]) + '"';
    }, '') + '>';
    var closingTag = '</' + tag + '>';

    if (trim && !hasValue && !node.required) {
        return [];
    }

    if (hasChildren) {
        return [
            whitespace + openingTag
        ].concat(node.children.reduce(function compileChild(result, child) {
            return result.concat(compileNode(child, indentation + 4, trim));
        }, []), [
            whitespace + closingTag
        ]);
    } else {
        return [
            whitespace + openingTag + nodeValue(node) + closingTag
        ];
    }
}

module.exports = function compileXML(data, trim) {
    return ['<?xml version="1.0" encoding="UTF-8"?>']
        .concat(compileNode(data, 0, trim))
        .join('\n');
};

},{}],34:[function(require,module,exports){
'use strict';

var push = Array.prototype.push;

function copyObject(object, target, deep) {
    return Object.keys(object).reduce(function(result, key) {
        result[key] = (deep ? copy(object[key], null, true) : object[key]);
        return result;
    }, target || {});
}

function copyArray(array, _target_, deep) {
    var target = _target_ || [];

    push.apply(target, deep ? array.map(function(item) { return copy(item, null, true); }) : array);

    return target;
}

function copy(object/*, target, deep*/) {
    var target = ((typeof arguments[1] === 'object') || null) && arguments[1];
    var deep = (typeof arguments[1] === 'boolean') ? arguments[1] : arguments[2];

    if (Object(object) !== object) { return object; }

    return (object instanceof Array) ?
        copyArray(object, target, deep) :
        copyObject(object, target, deep);
}

module.exports = copy;

},{}],35:[function(require,module,exports){
'use strict';

var push = Array.prototype.push;

function isObject(value) {
    return Object(value) === value;
}

function isArray(value) {
    return value instanceof Array;
}

module.exports = function defaults(config, target) {
    if ([config, target].every(isArray)) {
        push.apply(target, config.filter(function(item) {
            return target.indexOf(item) < 0;
        }));

        return target;
    }

    return Object.keys(config).reduce(function(target, key) {
        var values = [config[key], target[key]];

        if (values.every(isObject)) {
            defaults(config[key], target[key]);
        }

        if (!(key in target)) {
            target[key] = config[key];
        }

        return target;
    }, target);
};

},{}],36:[function(require,module,exports){
'use strict';

module.exports = function extend(/*...objects*/) {
    var objects = Array.prototype.slice.call(arguments);

    return objects.reduce(function(result, object) {
        return Object.keys(object || {}).reduce(function(result, key) {
            result[key] = object[key];
            return result;
        }, result);
    }, {});
};

},{}],37:[function(require,module,exports){
'use strict';

module.exports = function nodeifyPromise(promise, callback) {
    if (typeof callback !== 'function') { return promise; }

    promise.then(function callbackValue(value) {
        callback(null, value);
    }, function callbackReason(reason) {
        callback(reason);
    });

    return promise;
};

},{}],38:[function(require,module,exports){
'use strict';

module.exports = function numberify(value) {
    if (!(/string|number|boolean/).test(typeof value)) { return undefined; }

    return isNaN(value) ? undefined : Number(value);
};

},{}],39:[function(require,module,exports){
'use strict';

/* jshint browser:true, browserify:true, node:false */

var map = Array.prototype.map;
var filter = Array.prototype.filter;
var reduce = Array.prototype.reduce;

var parser = new DOMParser();

function convertNode(node) {
    var hasChildren = node.childElementCount > 0;

    return {
        tag: node.tagName,
        value: hasChildren ? null: node.textContent,
        attributes: reduce.call(node.attributes, function(result, attribute) {
            result[attribute.name] = attribute.value;
            return result;
        }, {}),

        find: function find(selector) {
            return convertNodes(node.querySelectorAll(selector));
        },
        children: function children() {
            return filter.call(node.childNodes, function isElement(node) {
                return node instanceof Element;
            }).map(convertNode);
        }
    };
}

function convertNodes(nodes) {
    return map.call(nodes, convertNode);
}

module.exports = function parseXML(xml) {
    var doc = parser.parseFromString(xml, 'application/xml');

    return function queryXML(selector) {
        return convertNodes(doc.querySelectorAll(selector));
    };
};

},{}],40:[function(require,module,exports){
'use strict';

function pad(number) {
    return ((number > 9) ? '' : '0') + number.toString();
}

module.exports = function secondsToTimestamp(seconds) {
    if (Number(seconds) !== seconds) { return null; }

    return [
        Math.floor(seconds / 60 / 60),
        Math.floor(seconds / 60 % 60),
        Math.floor(seconds % 60 % 60)
    ].map(pad).join(':');
};

},{}],41:[function(require,module,exports){
'use strict';

module.exports = function stringToBoolean(string) {
    switch ((string || '').toLowerCase()) {
    case 'true':
        return true;
    case 'false':
        return false;
    }
};

},{}],42:[function(require,module,exports){
'use strict';

module.exports = function timestampToSeconds(timestamp) {
    var parts = (timestamp || '').match(/^(\d\d):(\d\d):(\d\d)$/);

    return parts && parts.slice(1, 4).map(parseFloat).reduce(function(seconds, time, index) {
        var multiplier = Math.pow(60, Math.abs(index - 2));

        return seconds + (time * multiplier);
    }, 0);
};

},{}],43:[function(require,module,exports){
'use strict';

module.exports = function trimObject(object, deep) {
    if (Object(object) !== object) { return object; }

    return Object.keys(object).reduce(function(result, key) {
        if (deep && object[key] instanceof Array) {
            result[key] = object[key]
                .filter(function(value) { return value !== undefined; })
                .map(function(value) { return trimObject(value, true); });
        } else if (deep && object[key] instanceof Object) {
            result[key] = trimObject(object[key], true);
        } else if (object[key] !== undefined) {
            result[key] = object[key];
        }

        return result;
    }, {});
};

},{}],44:[function(require,module,exports){
'use strict';

var secondsToTimestamp = require('./utils/seconds_to_timestamp');
var compileXML = require('./utils/compile_xml');

var creativeCompilers = {
    linear: compileLinear,
    companions: compileCompanions,
    nonLinear: compileNonLinear
};

function createTrackingEvents(trackingEvents) {
    return {
        tag: 'TrackingEvents',
        children: trackingEvents.map(function(trackingEvent) {
            return {
                tag: 'Tracking',
                attributes: { event: trackingEvent.event },
                value: trackingEvent.uri,
                cdata: true
            };
        })
    };
}

function createResources(resources) {
    return resources.map(function(resource) {
        return {
            tag: (function(type) {
                switch (type) {
                case 'static':
                    return 'StaticResource';
                case 'iframe':
                    return 'IFrameResource';
                case 'html':
                    return 'HTMLResource';
                }
            }(resource.type)),
            attributes: { creativeType: resource.creativeType },
            value: resource.data,
            cdata: true
        };
    });
}

function createAdParameters(creative) {
    return {
        tag: 'AdParameters',
        value: creative.parameters
    };
}

function compileLinear(creative) {
    return {
        tag: 'Linear',
        children: [
            {
                tag: 'Duration',
                value: secondsToTimestamp(creative.duration)
            },
            createTrackingEvents(creative.trackingEvents),
            createAdParameters(creative)
        ].concat(creative.videoClicks ? [
            {
                tag: 'VideoClicks',
                children: [
                    {
                        tag: 'ClickThrough',
                        value: creative.videoClicks.clickThrough,
                        cdata: true
                    }
                ].concat(creative.videoClicks.clickTrackings.map(function(clickTracking) {
                    return {
                        tag: 'ClickTracking',
                        value: clickTracking,
                        cdata: true
                    };
                }), creative.videoClicks.customClicks.map(function(customClick) {
                    return {
                        tag: 'CustomClick',
                        attributes: { id: customClick.id },
                        value: customClick.uri,
                        cdata: true
                    };
                }))
            }
        ]: [], [
            {
                tag: 'MediaFiles',
                children: creative.mediaFiles.map(function(mediaFile) {
                    return {
                        tag: 'MediaFile',
                        attributes: {
                            id: mediaFile.id,
                            width: mediaFile.width,
                            height: mediaFile.height,
                            bitrate: mediaFile.bitrate,
                            type: mediaFile.type,
                            delivery: mediaFile.delivery,
                            scalable: mediaFile.scalable,
                            maintainAspectRatio: mediaFile.maintainAspectRatio,
                            apiFramework: mediaFile.apiFramework
                        },
                        value: mediaFile.uri,
                        cdata: true
                    };
                })
            }
        ])
    };
}

function compileCompanions(creative) {
    return {
        tag: 'CompanionAds',
        children: creative.companions.map(function(companion) {
            return {
                tag: 'Companion',
                attributes: {
                    id: companion.id,
                    width: companion.width,
                    height: companion.height,
                    expandedWidth: companion.expandedWidth,
                    expandedHeight: companion.expandedHeight,
                    apiFramework: companion.apiFramework
                },
                children: createResources(companion.resources).concat([
                    createTrackingEvents(companion.trackingEvents),
                    {
                        tag: 'CompanionClickThrough',
                        value: companion.clickThrough,
                        cdata: true
                    },
                    {
                        tag: 'AltText',
                        value: companion.altText
                    },
                    createAdParameters(companion)
                ])
            };
        })
    };
}

function compileNonLinear(creative) {
    return {
        tag: 'NonLinearAds',
        children: creative.ads.map(function(ad) {
            return {
                tag: 'NonLinear',
                attributes: {
                    id: ad.id,
                    width: ad.width,
                    height: ad.height,
                    expandedWidth: ad.expandedWidth,
                    expandedHeight: ad.expandedHeight,
                    scalable: ad.scalable,
                    maintainAspectRatio: ad.maintainAspectRatio,
                    minSuggestedDuration: secondsToTimestamp(ad.minSuggestedDuration),
                    apiFramework: ad.apiFramework
                },
                children: createResources(ad.resources).concat([
                    {
                        tag: 'NonLinearClickThrough',
                        value: ad.clickThrough,
                        cdata: true
                    },
                    createAdParameters(ad)
                ])
            };
        }).concat([
            createTrackingEvents(creative.trackingEvents)
        ])
    };
}


module.exports = function xmlFromVast(vast) {
    return compileXML({
        tag: 'VAST',
        attributes: { version: vast.get('version') },
        children: vast.map('ads', function(ad) {
            return {
                tag: 'Ad',
                attributes: { id: ad.id },
                children: [
                    {
                        tag: (function() {
                            switch (ad.type) {
                            case 'inline':
                                return 'InLine';
                            case 'wrapper':
                                return 'Wrapper';
                            }
                        }()),
                        children: [
                            {
                                tag: 'AdSystem',
                                attributes: { version: ad.system.version },
                                value: ad.system.name
                            },
                            {
                                tag: 'AdTitle',
                                value: ad.title
                            },
                            {
                                tag: 'Description',
                                value: ad.description
                            },
                            {
                                tag: 'Survey',
                                value: ad.survey,
                                cdata: true
                            },
                            {
                                tag: 'VASTAdTagURI',
                                value: ad.vastAdTagURI,
                                cdata: true
                            }
                        ].concat(ad.errors.map(function(error) {
                            return {
                                tag: 'Error',
                                value: error,
                                cdata: true
                            };
                        }), ad.impressions.map(function(impression) {
                            return {
                                tag: 'Impression',
                                value: impression.uri,
                                cdata: true,
                                attributes: { id: impression.id }
                            };
                        }), [
                            {
                                tag: 'Creatives',
                                children: ad.creatives.map(function(creative) {
                                    return {
                                        tag: 'Creative',
                                        attributes: {
                                            id: creative.id,
                                            sequence: creative.sequence,
                                            AdID: creative.adID
                                        },
                                        children: [(function(type) {
                                            return creativeCompilers[type](creative);
                                        }(creative.type))]
                                    };
                                }),
                                required: true
                            }
                        ])
                    }
                ]
            };
        })
    }, true);
};

},{"./utils/compile_xml":33,"./utils/seconds_to_timestamp":40}],45:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var reduce = require('reduce');

/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  root = this;
}

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pushEncodedKeyValuePair(pairs, key, obj[key]);
        }
      }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (Array.isArray(val)) {
    return val.forEach(function(v) {
      pushEncodedKeyValuePair(pairs, key, v);
    });
  }
  pairs.push(encodeURIComponent(key)
    + '=' + encodeURIComponent(val));
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text ? this.text : this.xhr.response)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }

  var type = status / 100 | 0;

  // status / class
  this.status = this.statusCode = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
      return self.callback(err);
    }

    self.emit('response', res);

    if (err) {
      return self.callback(err, res);
    }

    if (res.status >= 200 && res.status < 300) {
      return self.callback(err, res);
    }

    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
    new_err.original = err;
    new_err.response = res;
    new_err.status = res.status;

    self.callback(new_err, res);
  });
}

/**
 * Mixin `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Allow for extension
 */

Request.prototype.use = function(fn) {
  fn(this);
  return this;
}

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Force given parser
 *
 * Sets the body parser no matter type.
 *
 * @param {Function}
 * @api public
 */

Request.prototype.parse = function(fn){
  this._parser = fn;
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Write the field `name` and `val` for "multipart/form-data"
 * request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 * ```
 *
 * @param {String} name
 * @param {String|Blob|File} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.field = function(name, val){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(name, val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(field, file, filename || file.name);
  return this;
};

/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj || isHost(data)) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  this.clearTimeout();
  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (0 == status) {
      if (self.timedout) return self.timeoutError();
      if (self.aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(e){
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = 'download';
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    xhr.onprogress = handleProgress;
  }
  try {
    if (xhr.upload && this.hasListeners('progress')) {
      xhr.upload.onprogress = handleProgress;
    }
  } catch(e) {
    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
    // Reported here:
    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.timedout = true;
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var contentType = this.getHeader('Content-Type');
    var serialize = this._parser || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

/**
 * Faux promise support
 *
 * @param {Function} fulfill
 * @param {Function} reject
 * @return {Request}
 */

Request.prototype.then = function (fulfill, reject) {
  return this.end(function(err, res) {
    err ? reject(err) : fulfill(res);
  });
}

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

function del(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

},{"emitter":46,"reduce":47}],46:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],47:[function(require,module,exports){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
},{}]},{},[1])(1)
});