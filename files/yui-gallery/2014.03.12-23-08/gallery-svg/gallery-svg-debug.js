YUI.add('gallery-svg', function(Y) {


/** =======================================================================
 *  Vincent Hardy
 *  License terms: see svg-wow.org
 *  CC0 http://creativecommons.org/publicdomain/zero/1.0/
 *  ======================================================================= */

// =============================================================================
// Utility class used to manage animation time offsets.
// =============================================================================

var OffsetManager = {
    /**
     * List of pending offsets
     */
    _pendingOffsets: [],

    /**
     * The most recent timer identifier (used for cancellation
     */
    _lastTimerId: -1,

    /**
     * Adds a new offset client.
     *
     * @param p_offset {Number} the offset after which callback should be called.
     * @param p_callback the callback to invoke after offset expires. Should
     *        be a function or an animation instance (i.e., an object with a
     *        'run' method).
     */
    addOffsetListener : function (p_offset, p_callback) {
        p_offset = p_offset !== undefined ? p_offset : 0;

        if (p_offset === undefined || p_offset <= 0) {
            // Invoke callback immediately.
            this._invokeCallback(p_callback);
        } else {
            var currentTime = (new Date()).getTime(),
                offset = {
                    callback: p_callback,
                    offset: p_offset,
                    requestedAt: currentTime,
                    remainingOffset: p_offset * 1000
                };

            this._updatePendingOffsets(currentTime);

            if (this._insertPendingOffset(offset) === 0) {
                // the new offset is at index 0, i.e., it is our most immediate
                // new timer. Cancel the current timer if one was set.
                // In all cases, start a new timeout.
                if (this._lastTimerId !== -1) {
                    clearTimeout(this._lastTimerId);
                }

                this._startTimer();
            }
        }
    },

    /**
     * Implementation helper.
     * Starts the timer on the most immediate callback. This assumes the
     * callbacks have been sorted in time order and that there is at least
     * one.
     */
    _startTimer : function () {
        this._lastTimerId = setTimeout(function () {
                        OffsetManager._onTimeout();
                    }, this._pendingOffsets[0].remainingOffset);
    },

    /**
     * setTimeout callback
     *
     */
    _onTimeout : function () {
        this._timerId = -1;

        var po = this._pendingOffsets, o,
            currentTime = (new Date()).getTime();
        this._updatePendingOffsets(currentTime);

        o = po[0];
        while (o !== undefined && o.remainingOffset <= 0) {
            po.splice(0, 1);
            this._invokeCallback(o.callback);
            o = po[0];
        }

        if (po.length > 0) {
            this._startTimer();
        }
    },

    /**
     * Implementation helper.
     *
     * Updates the remainingOffset on the _pendingOffsets elements.
     *
     * @param p_currentTime the current time when this call is made
     */
    _updatePendingOffsets : function (p_currentTime) {
        var po = this._pendingOffsets, o;
        var n = po.length;
        for (var i = 0; i < n; i++) {
            o = po[i];
            o.remainingOffset = o.offset * 1000 - (p_currentTime - o.requestedAt);
        }
    },

    /**
     * Implementation helper.
     *
     * Inserts a new timing offset in the array managed by the offset manager.
     *
     * @param p_offset the new offset object to insert.
     * @return the index at which the new offset object was inserted.
     */
    _insertPendingOffset : function (p_offset) {
        var po = this._pendingOffsets, o;
        var n = po.length;
        for (var i = 0; i < n; i++) {
            o = po[i];
            if (o.remainingOffset > p_offset.remainingOffset) {
                po.splice(i, 0, p_offset);
                break;
            }
         }

         if (i === n) {
             po.push(p_offset);
         }

         return i;
    },

    /**
     * Invokes the callback.
     *
     * @param p_callback may be a function or an animation instance.
     */
    _invokeCallback : function (p_callback) {
        if (typeof p_callback === "function") {
            p_callback.call();
        } else if (typeof p_callback === "object" &&
                   p_callback !== null &&
                   typeof p_callback.run === "function") {
            p_callback.run();
        }
    }

};

/**
 * Simple extension of the YUI animation classes to handle SVG transforms.
 *
 * The extension handles the "r", "sx", "sy", "tx" and "ty" pseudo attributes
 * by manipulating the transform of the target element using a template.
 *
 * @param config the configuration
 *
 * @see http://developer.yahoo.com/yui/docs/YAHOO.util.Anim.html
 */
Y.Animate = function (config) {
    Y.Animate.superclass.constructor.apply(this, arguments);
};

Y.Animate.NAME = "Y.Animate";

Y.Animate.ATTRS = {
    transformTemplate: {
        value: "rotate(#r) scale(#sx, #sy) translate(#tx, #ty)"
    }
};

/**
 * Work around usage of regexp in YUI to detect which properties should have a
 * default unit.
 *
 * Unfortunately, the default regexp matches stop-opacity with 'top'
 */
Y.Anim.RE_DEFAULT_UNIT = /^width|^height|^top|^right|^bottom|^left|^margin.*|^padding.*|^border.*$/i;

Y.extend(Y.Animate, Y.Anim, {
    /**
     * Initializer.
     * @see Y.Base
     */
    initializer : function () {
        var _endCallbacks = [],
            _beginCallbacks = [];

        this._endCallbacks = _endCallbacks;
        this._beginCallbacks = _beginCallbacks;

        this.on("end", function () {
            for (var i = 0; i < _endCallbacks.length; i++) {
                OffsetManager.addOffsetListener(_endCallbacks[i].offset,
                                                _endCallbacks[i].callback);
            }
        });

        this.on("start", function () {
            for (var i = 0; i < _beginCallbacks.length; i++) {
                OffsetManager.addOffsetListener(_beginCallbacks[i].offset,
                                                _beginCallbacks[i].callback);
            }
        });

        // Override the run/stop methods. Since it is initialized in the animate
        // class' constructor, we need to do an override in the derived class'
        // constructor as well.
        this._superRun = Y.Animate.superclass.run;
        this._superStop = Y.Animate.superclass.stop;
    },

    /**
     * Override the base class' _runAttrs to fix a bug in reverse mode.
     */
    _runAttrs: function(t, d, reverse) {
        var attr = this._runtimeAttr,
            customAttr = Y.Anim.behaviors,
            easing = attr.easing,
            lastFrame = d,
            attribute,
            setter,
            i;

        if (reverse) {
            t = d - t;
            lastFrame = 0;
        }

        for (i in attr) {
            if (attr[i].to) {
                attribute = attr[i];
                setter = (i in customAttr && 'set' in customAttr[i]) ?
                        customAttr[i].set : Y.Anim.DEFAULT_SETTER;

                if (t < d && t > 0) {
                    setter(this, i, attribute.from, attribute.to, t, d, easing, attribute.unit);
                } else {
                    setter(this, i, attribute.from, attribute.to, lastFrame, d, easing, attribute.unit);
                }
            }
        }
    },

    /**
     * Applies the initial animation value.
     */
    applyStartFrame: function() {
        this._checkRuntimeAttr();

        var d = this._runtimeAttr.duration,
            t = 0,
            attr = this._runtimeAttr,
            customAttr = Y.Anim.behaviors,
            easing = attr.easing,
            attribute,
            setter,
            i,
            reverse = this.get("reverse");

        if (reverse) {
            t = d;
        }

        for (i in attr) {
            if (attr[i].to) {
                attribute = attr[i];
                setter = (i in customAttr && 'set' in customAttr[i]) ?
                         customAttr[i].set : Y.Anim.DEFAULT_SETTER;

                setter(this, i, attribute.from, attribute.to, t, d, easing, attribute.unit);                 
            }
        }
    },

    /**
     * Implementation helper: checks that the runtime attributes have been
     * initialized. If not, initialize them now.
     */
    _checkRuntimeAttr : function () {
        if (this._runtimeAttr === undefined) {
            this._initAnimAttr();
        }
    },

    /**
     * Returns a handler that will run this animation instance when invoked.
     */
    getRunHandler : function () {
        var that = this;
        if (this._runHandler === undefined) {
            this._runHandler = function () {
                that.run();
            };
        }

        return this._runHandler;
    },
    
    /**
     * Returns the handler that will stop this animation instance when invoked
     */
    getStopHandler : function () {
        var that = this;
        if (this._stopHandler === undefined) {
            this._stopHandler = function () {
                that.stop();
            };
        }
        return this._stopHandler;
    },

    /**
     * Adds a function of animation to call or play when this animation ends
     *
     * @param p_animOrCallback an animation or function to trigger when this
     *        animation ends
     * @param p_oOffset {Number} optional time offset to add before calling the
     *        end callback.
     */
    onEnd : function (p_animOrCallback, p_oOffset) {
        this._endCallbacks.push({
            callback: p_animOrCallback,
            offset: p_oOffset
        });
    },

    /**
     * Adds a function of animation to call or play when this animation begins
     *
     * @param p_animOrCallback an animation or function to trigger when this
     *        animation begins
     * @param p_oOffset {Number} optional time offset to add before calling the
     *        begin callback.
     */
    onBegin : function (p_animOrCallback, p_oOffset) {
        this._beginCallbacks.push({
            callback: p_animOrCallback,
            offset: p_oOffset
        });
    },

    /**
     * Starts the animation with the requseted offset. The offset is optional,
     * and defaults to zero if unspecified.
     *
     * @param p_oOffset {Number} optional time offset, in seconds, before
     *        starting the animation.
     */
    run : function (p_offset) {
        if (p_offset === undefined || p_offset === 0) {
            this._superRun.call(this);
            this.applyStartFrame(); // Applies the initial animation frame.
        } else {
            OffsetManager.addOffsetListener(p_offset, this);
        }
    },
    
    /**
     * Stops the animation with the requested offset. The offset is optional and
     * defaults to zero if unspecified.
     *
     * @param p_oOffset {Number} optional time offset, in seconds, before ending
     *        the animation.
     */
    stop : function (p_offset) {
        if (p_offset === undefined || p_offset === 0) {
            this._superStop.call(this);
        } else {
            OffsetManager.addOffsetListener(p_offset, this.getStopHandler());
        }
    },
     

    /**
     * Adds a start condition for this animation.
     *
     * @param p_evtTarget the event target (DOM object) or animation.
     * @param p_evtType the event type. If the target is an animation instance,
     *        should be "begin" or "end".
     * @param p_oOffset an offset after which the animation should begin. In
     *        seconds.
     */
    beginOn : function (p_evtTarget, p_evtType, p_oOffset) {
        var that = this;

        if (p_evtTarget.run !== undefined) {
            if (p_evtType === "begin") {
                p_evtTarget.onBegin(this, p_oOffset);
            } else if (p_evtType === "end") {
                p_evtTarget.onEnd(this, p_oOffset);
            }
        } else {
            p_evtTarget.on(p_evtType, function () {
                that.run(p_oOffset);
            });
        }
    },

    /**
     * Adds an end condition for this animation.
     *
     * @param p_evtTarget the event target
     * @param p_evtType the event type. If the target is an animation instance,
     *        should be "begin" or "end".
     * @param p_oOffset an offset after which the animation should begin In
     *        seconds.
     */
    endOn : function (p_evtTarget, p_evtType, p_oOffset) {
        var that = this;
        if (p_evtTarget.run !== undefined) {
            if (p_evtType === "begin") {
                p_evtTarget.onBegin(function () {
                    that.stop(false);
                }, p_oOffset);
            } else if (p_evtType === "end") {
                p_evtTarget.onEnd(function() {
                    that.stop(false);
                }, p_oOffset);
            }
        } else {
            p_evtTarget.on(p_evtType, function () {
                OffsetManager.addOffsetListener(p_oOffset, function () {
                    that.stop(false);
                });
            });
        }
    }
});
Y.mix(Y.Node.DOM_EVENTS, {
    'loadstart': 1,
    'progress': 1,
    'suspend': 1,
    'abort': 1,
    'emptied': 1,
    'stalled': 1,
    'play': 1,
    'pause': 1,
    'loadedmetadata': 1,
    'loadeddata': 1,
    'waiting': 1,
    'playing': 1,
    'canplay': 1,
    'canplaythrough': 1,
    'seeking': 1,
    'seeked': 1,
    'timeupdate': 1,
    'ended': 1,
    'ratechange': 1,
    'durationchange': 1,
    'volumechange': 1
});
/** =======================================================================
 *  Vincent Hardy
 *  License terms: see svg-wow.org
 *  CC0 http://creativecommons.org/publicdomain/zero/1.0/
 *  ======================================================================= */

/**
 * Object with the names of the transform pseudo attributes.
 */
var PSEUDO_ATTRIBUTES_REGEXP = {
    tx: /#tx/g,
    ty: /#ty/g,
    sx: /#sx/g,
    sy: /#sy/g,
    r:  /#r/g
};

var PSEUDO_ATTRIBUTES_ARRAY = ["tx", "ty", "sx", "sy", "r"];
var N_PSEUDO_ATTRIBUTES = PSEUDO_ATTRIBUTES_ARRAY.length;

var colorBehavior = Y.Anim.behaviors.color;
var svgColors = Y.DOM.SVG_COLORS;

var svgColorBehavior = {
    set: function(anim, att, from, to, elapsed, duration, fn) {
        if (from in svgColors) {
            from = svgColors[from];
        }
        if (to in svgColors) {
            to = svgColors[to];
        }
        colorBehavior.set(anim, att, from, to, elapsed, duration, fn);
    },

    get: colorBehavior.get
};

Y.Anim.behaviors.transform = {
    set: function (anim, att, from, to, elapsed, duration, fun) {
        var txf = anim.get(att + "Template"), val, p,
            e = anim._node;

        if (txf) {
            for (p in to) {
                if (to.hasOwnProperty(p)) {
                    val = fun(elapsed, from[p], to[p] - from[p], duration);
                    txf = txf.replace(PSEUDO_ATTRIBUTES_REGEXP[p], val);
                    e[p] = val;
                }
            }
            
            e.setAttribute(att, txf);
        }
    },

    get: function (anim, att) {
        var result = {
            tx: 0,
            ty: 0,
            sx: 1,
            sy: 1,
            r: 0
        };
        var e = anim._node;
        for (var i = 0; i < N_PSEUDO_ATTRIBUTES; i++) {
            var a = PSEUDO_ATTRIBUTES_ARRAY[i];
            if (e[a] !== undefined) {
                result[a] = e[a];
            } else {
                e[a] = result[a];
            }
        }
        return result;
    }
};

Y.Anim.behaviors.stdDeviation = {
    set: function (anim, att, from, to, elapsed, duration, fun) {
        var val = [fun(elapsed, from[0], to[0] - from[0], duration),
                   fun(elapsed, from[1], to[1] - from[1], duration)];

        // NOTE: setStdDeviation is more efficient, so use it if available.
        // Firefox 3.6 and earlier doesn't have support for setStdDeviation,
        // so fallback to setAttribute.
        if (anim._node.setStdDeviation) {
            anim._node.setStdDeviation(val[0], val[1]);
        } else {
            anim._node.setAttribute(att, val[0] + " " + val[1]);
        }
    },

    get: function (anim, attr) {
        // NOTE: Got errors in {Firefox, Opera, Safari} about stdDeviationX 
        // not being defined in some cases, fallback to the default value [0,0].
        var result = [0, 0];
        if (anim._node.stdDeviationX !== null &&
            anim._node.stdDeviationY !== undefined) {
            result = [anim._node.stdDeviationX.baseVal,
                    anim._node.stdDeviationY.baseVal];
        }
        return result;
    }
};

var lengthBehavior = {
    set: function (anim, att, from, to, elapsed, duration, fun) {
        var val = fun(elapsed, Number(from), Number(to) - Number(from), duration);
        anim._node.set(att, val);
    },

    get: function (anim, attr) {
        return anim._node.get(attr);
    }
};

var pathCommands = {
    m: 'm',
    M: 'M',
    l: 'l',
    L: 'L',
    h: 'h',
    H: 'H',
    v: 'v',
    V: 'V',
    q: 'q',
    Q: 'Q',
    c: 'c',
    C: 'C',
    z: 'z',
    Z: 'Z',
    s: 's',
    S: 'S',
    t: 't',
    T: 'T',
    a: 'a',
    A: 'A'
};

function parsePath (d) {
    var n;

    if (typeof d === "string") {
        d = d.replace(/([^ ])([hHvVmMlLtTqQsScCaAzZ])/g, '$1 $2')
             .replace(/([hHvVmMlLtTqQsScCaAzZ])([^ ])/g, '$1 $2')
             .replace(/([^ ,])-/g, '$1,-')
             .replace(/[ ]{2,}/g, ' ')
             .replace(/[ ]+/g,',').split(',');
        n = d.length;
        for (var i = 0; i < n; i++) {
            if (pathCommands[d[i]] === undefined) {
                d[i] = Number(d[i]);
            }
        }
    }
    return d;
}

Y.Anim.behaviors.d = {
    set: function (anim, att, from, to, elapsed, duration, fun) {
        from = parsePath(from);
        to = parsePath(to);

        // As in the SVG specification, it is a requirement that the path
        // segment types match. So we only need to interpolate the coordinates.
        var n = to.length,
            c,
            v = [],
            nc,
            is,
            max;
            
        for (var i = 0; i < n;) {
            c = to[i]; // command
            v.push(c);
            nc = 0;
            is = i + 1;
            switch (c) {
                case 'h':
                case 'H':
                case 'v':
                case 'V':
                    i++;
                    do {
                        i++;
                        nc++;
                    } while (typeof to[i] === "number");
                    break;
                case 'm':
                case 'M':
                case 'l':
                case 'L':
                case 't':
                case 'T':
                    i++;
                    do {
                        i += 2;
                        nc += 2;
                   } while (typeof to[i] === "number");
                    break;
                case 'q':
                case 'Q':
                case 's':
                case 'S':
                    i++;
                    do {
                        i += 4;
                        nc += 4;
                   } while (typeof to[i] === "number");
                    break;
                case 'c':
                case 'C':
                    i++;
                    do {
                        i += 6;
                        nc += 6;
                   } while (typeof to[i] === "number");
                    break;
                case 'a':
                case 'A':
                    i++;
                    do {
                        i += 7;
                        nc += 7;
                   } while (typeof to[i] === "number");
                    break;
                // case 'z':
                // case 'Z':
                default:
                    // Includes 'z' and 'Z'
                    i += 1;
                    break;
            }
            max = is + nc;
            for (var j = is; j < max; j++) {
                v[j] = fun(elapsed, from[j], to[j] - from[j], duration);
                if (isNaN(v[j]) === true) {
                    Y.log('v[' + j + '] is NaN');
                }
            }
        }

        anim._node.setAttribute(att, v.join(' '));
    },

    get: function (anim, attr) {
        return parsePath(anim._node.getAttribute(attr));
    }
};

Y.Anim.behaviors.fill = svgColorBehavior;
Y.Anim.behaviors.stroke = svgColorBehavior;
Y.Anim.behaviors["stop-color"] = svgColorBehavior;
Y.Anim.behaviors["flood-color"] = svgColorBehavior;
Y.Anim.behaviors["lighting-color"] = svgColorBehavior;

Y.Anim.behaviors.dy = lengthBehavior;
Y.Anim.behaviors.y = lengthBehavior;
Y.Anim.behaviors.dx = lengthBehavior;
Y.Anim.behaviors.x = lengthBehavior;
Y.Anim.behaviors.rotate = lengthBehavior;
Y.Anim.behaviors.width = lengthBehavior;
Y.Anim.behaviors.height = lengthBehavior;
Y.Anim.behaviors.r = lengthBehavior;
Y.Anim.behaviors.rx = lengthBehavior;
Y.Anim.behaviors.ry = lengthBehavior;
Y.Anim.behaviors.cx = lengthBehavior;
Y.Anim.behaviors.cy = lengthBehavior;
Y.Anim.behaviors.x1 = lengthBehavior;
Y.Anim.behaviors.x2 = lengthBehavior;
Y.Anim.behaviors.y1 = lengthBehavior;
Y.Anim.behaviors.y2 = lengthBehavior;
Y.Anim.behaviors.offset = lengthBehavior;
/** =======================================================================
 *  Vincent Hardy
 *  License terms: see svg-wow.org
 *  CC0 http://creativecommons.org/publicdomain/zero/1.0/
 *  ======================================================================= */

/**
 * See http://www.w3.org/TR/SVG/types.html#ColorKeywords
 */
var svgColors = {
    aliceblue: "rgb(240, 248, 255)",
    antiquewhite: "rgb(250, 235, 215)",
    aqua: "rgb(0, 255, 255)",
    aquamarine: "rgb(127, 255, 212)",
    azure: "rgb(240, 255, 255)",
    beige: "rgb(245, 245, 220)",
    bisque: "rgb(255, 228, 196)",
    black: "rgb(0, 0, 0)",
    blanchedalmond: "rgb(255, 235, 205)",
    blue: "rgb(0, 0, 255)",
    blueviolet: "rgb(138, 43, 226)",
    brown: "rgb(165, 42, 42)",
    burlywood: "rgb(222, 184, 135)",
    cadetblue: "rgb(95, 158, 160)",
    chartreuse: "rgb(127, 255, 0)",
    chocolate: "rgb(210, 105, 30)",
    coral: "rgb(255, 127, 80)",
    cornflowerblue: "rgb(100, 149, 237)",
    cornsilk: "rgb(255, 248, 220)",
    crimson: "rgb(220, 20, 60)",
    cyan: "rgb(0, 255, 255)",
    darkblue: "rgb(0, 0, 139)",
    darkcyan: "rgb(0, 139, 139)",
    darkgoldenrod: "rgb(184, 134, 11)",
    darkgray: "rgb(169, 169, 169)",
    darkgreen: "rgb(0, 100, 0)",
    darkgrey: "rgb(169, 169, 169)",
    darkkhaki: "rgb(189, 183, 107)",
    darkmagenta: "rgb(139, 0, 139)",
    darkolivegreen: "rgb(85, 107, 47)",
    darkorange: "rgb(255, 140, 0)",
    darkorchid: "rgb(153, 50, 204)",
    darkred: "rgb(139, 0, 0)",
    darksalmon: "rgb(233, 150, 122)",
    darkseagreen: "rgb(143, 188, 143)",
    darkslateblue: "rgb(72, 61, 139)",
    darkslategray: "rgb(47, 79, 79)",
    darkslategrey: "rgb(47, 79, 79)",
    darkturquoise: "rgb(0, 206, 209)",
    darkviolet: "rgb(148, 0, 211)",
    deeppink: "rgb(255, 20, 147)",
    deepskyblue: "rgb(0, 191, 255)",
    dimgray: "rgb(105, 105, 105)",
    dimgrey: "rgb(105, 105, 105)",
    dodgerblue: "rgb(30, 144, 255)",
    firebrick: "rgb(178, 34, 34)",
    floralwhite: "rgb(255, 250, 240)",
    forestgreen: "rgb(34, 139, 34)",
    fuchsia: "rgb(255, 0, 255)",
    gainsboro: "rgb(220, 220, 220)",
    ghostwhite: "rgb(248, 248, 255)",
    gold: "rgb(255, 215, 0)",
    goldenrod: "rgb(218, 165, 32)",
    gray: "rgb(128, 128, 128)",
    grey: "rgb(128, 128, 128)",
    green: "rgb(0, 128, 0)",
    greenyellow: "rgb(173, 255, 47)",
    honeydew: "rgb(240, 255, 240)",
    hotpink: "rgb(255, 105, 180)",
    indianred: "rgb(205, 92, 92)",
    indigo: "rgb(75, 0, 130)",
    ivory: "rgb(255, 255, 240)",
    khaki: "rgb(240, 230, 140)",
    lavender: "rgb(230, 230, 250)",
    lavenderblush: "rgb(255, 240, 245)",
    lawngreen: "rgb(124, 252, 0)",
    lemonchiffon: "rgb(255, 250, 205)",
    lightblue: "rgb(173, 216, 230)",
    lightcoral: "rgb(240, 128, 128)",
    lightcyan: "rgb(224, 255, 255)",
    lightgoldenrodyellow: "rgb(250, 250, 210)",
    lightgray: "rgb(211, 211, 211)",
    lightgreen: "rgb(144, 238, 144)",
    lightgrey: "rgb(211, 211, 211)",

    lightpink: "rgb(255, 182, 193)",
    lightsalmon: "rgb(255, 160, 122)",
    lightseagreen: "rgb(32, 178, 170)",
    lightskyblue: "rgb(135, 206, 250)",
    lightslategray: "rgb(119, 136, 153)",
    lightslategrey: "rgb(119, 136, 153)",
    lightsteelblue: "rgb(176, 196, 222)",
    lightyellow: "rgb(255, 255, 224)",
    lime: "rgb(0, 255, 0)",
    limegreen: "rgb(50, 205, 50)",
    linen: "rgb(250, 240, 230)",
    magenta: "rgb(255, 0, 255)",
    maroon: "rgb(128, 0, 0)",
    mediumaquamarine: "rgb(102, 205, 170)",
    mediumblue: "rgb(0, 0, 205)",
    mediumorchid: "rgb(186, 85, 211)",
    mediumpurple: "rgb(147, 112, 219)",
    mediumseagreen: "rgb(60, 179, 113)",
    mediumslateblue: "rgb(123, 104, 238)",
    mediumspringgreen: "rgb(0, 250, 154)",
    mediumturquoise: "rgb(72, 209, 204)",
    mediumvioletred: "rgb(199, 21, 133)",
    midnightblue: "rgb(25, 25, 112)",
    mintcream: "rgb(245, 255, 250)",
    mistyrose: "rgb(255, 228, 225)",
    moccasin: "rgb(255, 228, 181)",
    navajowhite: "rgb(255, 222, 173)",
    navy: "rgb(0, 0, 128)",
    oldlace: "rgb(253, 245, 230)",
    olive: "rgb(128, 128, 0)",
    olivedrab: "rgb(107, 142, 35)",
    orange: "rgb(255, 165, 0)",
    orangered: "rgb(255, 69, 0)",
    orchid: "rgb(218, 112, 214)",
    palegoldenrod: "rgb(238, 232, 170)",
    palegreen: "rgb(152, 251, 152)",
    paleturquoise: "rgb(175, 238, 238)",
    palevioletred: "rgb(219, 112, 147)",
    papayawhip: "rgb(255, 239, 213)",
    peachpuff: "rgb(255, 218, 185)",
    peru: "rgb(205, 133, 63)",
    pink: "rgb(255, 192, 203)",
    plum: "rgb(221, 160, 221)",
    powderblue: "rgb(176, 224, 230)",
    purple: "rgb(128, 0, 128)",
    red: "rgb(255, 0, 0)",
    rosybrown: "rgb(188, 143, 143)",
    royalblue: "rgb(65, 105, 225)",
    saddlebrown: "rgb(139, 69, 19)",
    salmon: "rgb(250, 128, 114)",
    sandybrown: "rgb(244, 164, 96)",
    seagreen: "rgb(46, 139, 87)",
    seashell: "rgb(255, 245, 238)",
    sienna: "rgb(160, 82, 45)",
    silver: "rgb(192, 192, 192)",
    skyblue: "rgb(135, 206, 235)",
    slateblue: "rgb(106, 90, 205)",
    slategray: "rgb(112, 128, 144)",
    slategrey: "rgb(112, 128, 144)",
    snow: "rgb(255, 250, 250)",
    springgreen: "rgb(0, 255, 127)",
    steelblue: "rgb(70, 130, 180)",
    tan: "rgb(210, 180, 140)",
    teal: "rgb(0, 128, 128)",
    thistle: "rgb(216, 191, 216)",
    tomato: "rgb(255, 99, 71)",
    turquoise: "rgb(64, 224, 208)",
    violet: "rgb(238, 130, 238)",
    wheat: "rgb(245, 222, 179)",
    white: "rgb(255, 255, 255)",
    whitesmoke: "rgb(245, 245, 245)",
    yellow: "rgb(255, 255, 0)",
    yellowgreen: "rgb(154, 205, 50)"
};

var svgNumberPropertyHandler = {
    get: function(node, attr, pattern) {
        var val = 1, style = window.getComputedStyle(node, null),
            styleAttr, matches;

        if (style[attr] !== undefined) {
            val = Number(style[attr]);
        } else {
            // FF 3.6.x does not support SVG style properties correctly.
            // Resort to parsing the style attribute and the presentation
            // attribute.
            styleAttr = node.getAttribute("style");
            if (styleAttr !== null && styleAttr.length > 0) {
                matches = pattern.exec(styleAttr);
                if (matches === null || matches.length < 4) {
                    styleAttr = node.getAttribute(attr);
                } else {
                    styleAttr = matches[2];
                }

                if (styleAttr.length > 0) {
                    val = Number(styleAttr);
                }
            } else {
                styleAttr = node.getAttribute(attr);
                if (styleAttr !== null && styleAttr.length > 0) {
                    val = Number(styleAttr);
                }
            }
        }
        return val;
    },

    set: function(node, val, style, attr, pattern) {
        var styleAttr, matches;

        Y.log('setting ' + attr + " to " + val);
        if (style[attr] !== undefined) {
            style[attr] = val;
        } else {
            // Check if the property is set on the node's
            // style attribute. If so, then we replace the value in the
            // style attribute. Otherwise, we simply set the property
            // attribute.
            styleAttr = node.getAttribute("style");
            if (styleAttr !== null && styleAttr.length > 0 &&
                    (matches = pattern.exec(styleAttr)) !== null) {
                node.setAttribute("style",
                                  matches[1] + ";" + attr + ":" + val + ";" +
                                  matches[3]);
            } else {
                node.setAttribute(attr, val);
            }
        }
    }
};

var svgColorPropertyHandler = {
    get: function(node, attr, pattern) {
        var val = "#000", style = window.getComputedStyle(node, null),
            styleAttr, matches;

        if (style[attr] !== undefined) {
            val = style[attr];
        } else {
            // FF 3.6.x does not support SVG style properties correctly.
            // Resort to parsing the style attribute and the presentation
            // attribute.
            styleAttr = node.getAttribute("style");
            if (styleAttr !== null && styleAttr.length > 0) {
                matches = pattern.exec(styleAttr);
                if (matches === null || matches.length < 4) {
                    styleAttr = node.getAttribute(attr);
                } else {
                    styleAttr = matches[2];
                }

                if (styleAttr !== null && styleAttr.length > 0) {
                    val = styleAttr;
                }
            } else {
                styleAttr = node.getAttribute(attr);
                if (styleAttr !== null && styleAttr.length > 0) {
                    val = styleAttr;
                }
            }
        }

        if (svgColors[val] !== undefined) {
            val = svgColors[val];
        }

        return val;
    },

    set: function(node, val, style, attr, pattern) {
        var styleAttr, matches;

        if (style[attr] !== undefined) {
            style[attr] = val;
        } else {
            // Check if the property is set on the node's
            // style attribute. If so, then we replace the value in the
            // style attribute. Otherwise, we simply set the property's
            // attribute.
            styleAttr = node.getAttribute("style");
            if (styleAttr !== null && styleAttr.length > 0 &&
                    (matches = pattern.exec(styleAttr)) !== null) {
                node.setAttribute("style",
                                  matches[1] + ";" + attr + ":" + val + ";" +
                                  matches[3]);
            } else {
                node.setAttribute(attr, val);
            }
        }
    }
};

var svgStringPropertyHandler = {
    get: function(node, attr, pattern) {
        var val = "", style = window.getComputedStyle(node, null),
            styleAttr, matches;

        if (style[attr] !== undefined) {
            val = style[attr];
        } else {
            // FF 3.6.x does not support SVG style properties correctly.
            // Resort to parsing the style attribute and the presentation
            // attribute.
            styleAttr = node.getAttribute("style");
            if (styleAttr !== null && styleAttr.length > 0) {
                matches = pattern.exec(styleAttr);
                if (matches === null || matches.length < 4) {
                    styleAttr = node.getAttribute(attr);
                } else {
                    styleAttr = matches[2];
                }

                if (styleAttr !== null && styleAttr.length > 0) {
                    val = styleAttr;
                }
            } else {
                styleAttr = node.getAttribute(attr);
                if (styleAttr !== null && styleAttr.length > 0) {
                    val = styleAttr;
                }
            }
        }
        
        return val;
    },

    set: function(node, val, style, attr, pattern) {
        var styleAttr, matches;

        if (style[attr] !== undefined) {
            style[attr] = val;
        } else {
            // Check if the property is set on the node's
            // style attribute. If so, then we replace the value in the
            // style attribute. Otherwise, we simply set the property's
            // attribute.
            styleAttr = node.getAttribute("style");
            if (styleAttr !== null && styleAttr.length > 0 &&
                    (matches = pattern.exec(styleAttr)) !== null) {
                node.setAttribute("style",
                                  matches[1] + ";" + attr + ":" + val + ";" +
                                  matches[3]);
            } else {
                node.setAttribute(attr, val);
            }
        }
    }
};



var svgTypeHandlers = {
    color: svgColorPropertyHandler,
    number: svgNumberPropertyHandler,
    string: svgStringPropertyHandler
};

var svgProperties = {
    "fill": {
        pattern: /(.*)fill\s*[:]\s*([^;]*)(.*)/,
        type: "color"
    },
    "fill-opacity": {
        pattern: /(.*)fill-opacity\s*[:]\s*(\d*[.]{0,1}\d*)(.*)/,
        type: "number"
    },
    filter: {
        pattern: /(.*)filter\s*[:]\s*(\d*[.]{0,1}\d*)(.*)/,
        type: "string"
    },
    "stop-color": {
        pattern: /(.*)stop-color\s*[:]\s*([^;]*)(.*)/,
        type: "color"
    },
    "stop-opacity": {
        pattern: /(.*)stop-opacity\s*[:]\s*(\d*[.]{0,1}\d*)(.*)/,
        type: "number"
    },
    "stroke": {
        pattern: /(.*)stroke\s*[:]\s*([^;]*)(.*)/,
        type: "color"
    },
    "stroke-opacity": {
        pattern: /(.*)stroke-opacity\s*[:]\s*(\d*[.]{0,1}\d*)(.*)/,
        type: "number"
    },
    "stroke-width": {
        pattern: /(.*)stroke-width\s*[:]\s*(\d*[.]{0,1}\d*)(.*)/,
        type: "number"
    },
    "stroke-dashoffset": {
        pattern: /(.*)stroke-dashoffset\s*[:]\s*(\d*[.]{0,1}\d*)(.*)/,
        type: "number"
    },
    "stroke-dasharray": {
        pattern: /(.*)stroke-dasharray\s*[:]\s*(\d*[.]{0,1}\d*)(.*)/,
        type: "string"
    },
    "stroke-linejoin": {
        pattern: /(.*)stroke-linejoin\s*[:]\s*(\d*[.]{0,1}\d*)(.*)/,
        type: "string"
    },
    "stroke-linecap": {
        pattern: /(.*)stroke-linecap\s*[:]\s*(\d*[.]{0,1}\d*)(.*)/,
        type: "string"
    }
};

for (var p in svgProperties) {
    if (svgProperties.hasOwnProperty(p)) {
        var prop = svgProperties[p];
        Y.DOM.CUSTOM_STYLES[p] = (function (p, prop) {
            return {
                get: function (node) {
                    return svgTypeHandlers[prop.type].get(node, p, prop.pattern);
                },

                set: function (node, val, style) {
                    return svgTypeHandlers[prop.type]
                                  .set(node, val, style, p, prop.pattern);
                }
            };
        })(p, prop);
    }
}


var defaultGetComputedStyle = Y.Node.prototype.getComputedStyle;

Y.Node.prototype.getComputedStyle = function(att) {
    var val = '';
    if (Y.DOM.CUSTOM_STYLES[att] && Y.DOM.CUSTOM_STYLES[att].get) {
        val = Y.DOM.CUSTOM_STYLES[att].get(this._node);
    } else {
        val = defaultGetComputedStyle.call(this, att);
    }
    return val;
};

Y.DOM.SVG_COLORS = svgColors;
/** =======================================================================
 *  Vincent Hardy
 *  License terms: see svg-wow.org
 *  CC0 http://creativecommons.org/publicdomain/zero/1.0/
 *  ======================================================================= */

// Namespace constants
Y.svgNS = "http://www.w3.org/2000/svg";
Y.xlinkNS = "http://www.w3.org/1999/xlink";
Y.wowNS = "http://www.svgopen.org/2004/svgWow";
Y.xhtmlNS = "http://www.w3.org/1999/xhtml";

// Default namespace prefixes
var defaultNamespacePrefixes = {
    svg: Y.svgNS,
    xlink: Y.xlinkNS,
    sw: Y.wowNS,
    xhtml: Y.xhtmlNS
};

//
// Used tfor properties on which a default CSS unit (px) in enforced.
// See Y.DOM.setStyle
//
var FORCE_UNIT = {
    width: 'width',
    height: 'height',
    top: 'top',
    left: 'left',
    right: 'right',
    bottom: 'bottom',
    margin: 'margin',
    padding: 'padding'
};
    
var defaultSVG = document.createElementNS(Y.svgNS, 'svg'),
superHasClass = Y.DOM.hasClass,
hasClass, removeClass, addClass,
MATRIX_EXTENSIONS;

Y.mix(Y.DOM, {
    /**
         * Creates a new SVG Matrix instance. Note that it is not set on the
         * node this is called on.
         *
         * @param {SVGElement} element The DOM element.
         * @return an new <code>SVGMatrix</code> instance.
         */
    createMatrix : function (element) {
        var svg = element.ownerSVGElement, matrix;
        if (svg === null || svg === undefined) {
            svg = defaultSVG;
        }

        matrix = svg.createSVGMatrix();
        Y.mix(matrix, MATRIX_EXTENSIONS);
        return matrix;
    },

    /**
         * @param {SVGElement} element The DOM element.
         * @return the first child of type element.
         */
    firstElement : function (element) {
        var c = element.firstChild;
        var result = null;

        while (c !== null) {
            if (c.nodeType === Node.ELEMENT_NODE) {
                result = c;
                break;
            }
            c = c.nextSibling;
        }

        return result;
    },

    /**
         * @param {SVGElement} element The DOM element.
         * @return the next child of type element.
         */
    nextElement : function (element) {
        var s = element.nextSibling;
        var result = null;

        while (s !== null) {
            if (s.nodeType === Node.ELEMENT_NODE) {
                result = s;
                break;
            }
            s = s.nextSibling;
        }

        return result;
    },

    /**
         * @param {SVGElement} element The DOM element.
         * @return the previous child of type element.
         */
    prevElement : function (element) {
        var s = element.prevSibling;
        var result = null;

        while (s !== null) {
            if (s.nodeType === Node.ELEMENT_NODE) {
                result = s;
                break;
            }
            s = s.prevSibling;
        }

        return result;
    },

    /**
         * Removes all children from this node.
         * @param {SVGElement} element The DOM element.
         */
    removeAllChildren : function (element) {
        var c = element.firstChild;
        while (c !== null) {
            element.removeChild(c);
            c = element.firstChild;
        }
    },

    /**
         * Consolidate this node's transform and returns its base value matrix.
         *
         * @param {SVGElement} element The DOM element.
         * @return an <code>SVGMatrix</code> instance representing the node's
         *         current transform.
         */
    getMatrix : function (element) {
        var m, txf, svg;
        if (element.transform !== undefined) {
            txf = element.transform.baseVal.consolidate();
            if (txf === null) {
                svg = element.ownerSVGElement;
                m = svg.createSVGMatrix();
                txf = element.transform.baseVal.createSVGTransformFromMatrix(m);
                element.transform.baseVal.initialize(txf);
            } else {
                m = txf.matrix;
            }
        }
        return new Y.DOM.Matrix(m);
    },

    /**
         * Sets the node's transform base value to the desired matrix.
         *
         * @param {SVGElement} element The DOM element.
         * @param an <code>Y.DOM.Matrix</code> instance representing the transform
         *        new base value.
         */
    setMatrix : function (element, m) {
        var txf;
        if (element.transform !== undefined) {
            txf = element.transform.baseVal.createSVGTransformFromMatrix(m._m);
            element.transform.baseVal.initialize(txf);
        }
        return element;
    },

    /**
         * This method automatically loads and creates DOM nodes.
         *
         * The symtax for the object is as follows;
         * - the tag property gives the object's tag name
         * - the ns property gives the object's namespace. Optional, defaults to the
         *   SVG namespace.
         * - the children property is a set of sub-objects with the same syntax.
         *
         * @param element {SVGElement} the DOM element.
         * @param p_desc the object describing the element to create and initialize.
         * @param p_oInsertBefore Optional. the child before which the loaded content
         *        should be inserted
         * @return the element that was created.
         */
    loadContent : function (element, p_desc, p_oInsertBefore) {
        var content;

        if (typeof p_desc === "string") {
            content = document.createTextNode(p_desc);
        } else if (typeof p_desc === "object") {
            // Save the reserved values first.
            var tagOrig = p_desc.tag;
            var nsOrig = p_desc.ns;
            var childrenOrig = p_desc.children;

            // Now, process the element.
            var tag = p_desc.tag;

            if (tag === undefined) {
                throw new Error(
                    "the element description requires a 'tag' property");
            }

            var ns = Y.svgNS;

            if (p_desc.ns !== undefined) {
                ns = p_desc.ns;
            }

            content = document.createElementNS(ns, tag);

            if (content === null || content === undefined) {
                throw new Error("was not able to create an element with tag " +
                    tag + " in namespace " + ns);
            }


            var children = p_desc.children;

            delete p_desc.children;
            delete p_desc.tag;
            delete p_desc.ns;

            Y.DOM.setAttributes(content, p_desc);

            if (children !== undefined && children !== null) {
                var nChildren = children.length;
                if (typeof nChildren === "number") {
                    for (var i = 0; i < nChildren; i++) {
                        Y.DOM.loadContent(content, children[i]);
                    }
                }
            }

            // Restore
            p_desc.children = childrenOrig;
            p_desc.tag = tagOrig;
            p_desc.ns = nsOrig;
        } else {
            throw new Error("loadContent requires an object or string parameter");
        }

        if (element !== null && element !== undefined) {
            if (p_oInsertBefore === undefined) {
                p_oInsertBefore = null;
            }

            if (element.insertBefore !== undefined) {
                element.insertBefore(content, p_oInsertBefore);
            }
        }

        return content;
    },

    /**
         * The setAttributes method to be installed on all element classes.
         *
         * @param {SVGElement} element The DOM element.
         * @param attributes an object with the attributes to set on the object this
         *        method is called on.
         */
    setAttributes : function (element, attributes) {
        for (var p in attributes) {
            if (attributes.hasOwnProperty(p) === true) {
                element.setAttributeNS(
                    Y.DOM.getAttributeNamespace(element, p),
                    p,
                    attributes[p]);
            }
        }
    },

    /**
         * Implementation helper: get the namespace for the given
         * attribute on the given element.
         *
         * The method first extracts the namespace prefix from the attribute
         * name, looking for a semi color (e.g., 'xlink:href'). Then, if a
         * namespace prefix is found, the following namespace lookup happens.
         *
         * The method first looks up on the element. If no namespace is found,
         * then the document's root element is looked up. Then, the
         * <code>defaultNamespacePrefixes</code> map is used. If all fails,
         * null is returned.
         *
         * @param element the element to lookup.
         * @param attribute the attribute to lookup.
         * @return the namespace with <code>nsPrefix</code> on
         *         <code>element</code> or null if no namespace mapping to the
         *         prefix is found.
         */
    getAttributeNamespace : function (element, attribute) {
        var nsIndex = attribute.indexOf(":"),
        nsPrefix,
        ns = null;
                
        if (nsIndex !== -1) {
            nsPrefix = attribute.substring(0, nsIndex);
            ns = element.lookupNamespaceURI(nsPrefix);
            if (ns === null) {
                // No namespace declaration was found on the node.
                // This may be because the node is not in the tree
                // yet. The best thing which can be done here is to
                // check if we can find the namespace definition on the
                // document element.
                ns = document.documentElement.lookupNamespaceURI(nsPrefix);

                // If the namespace is still not found, check the
                // default list of known namespaces
                if (defaultNamespacePrefixes[nsPrefix] !== undefined) {
                    ns = defaultNamespacePrefixes[nsPrefix];
                }
            }
        }
        return ns;
    },

    /**
         * Get a number of attributes on this element and return them in an object.
         *
         * @param {SVGElement} element The DOM element.
         * @param attr1, ... attrN a variable length list of attributes to retrieve
         *        from this element.
         * @return an object whose properties are the requested attribute values
         */
    getAttributes : function (element) {
        var result = {};
        var attribute;

        for (var i = 0; i < arguments.length; i++) {
            attribute = arguments[i];
            result[attribute] =
            element.getAttributeNS(
                Y.DOM.getAttributeNamespace(element, attribute), attribute);
        }

        return result;
    },

    /**
         * Wraps the DOM call to getBBox
         *
         */
    getBBox : function (element) {
        return element.getBBox();
    },

    /**
         * Utility to get the bounds of an object in the nearest viewport space.
         * @param {SVGElement} element The DOM element.
         */
    getViewportBBox : function (element) {
        var bbox = element.getBBox();
        var vBbox = null;
        var viewport = element.nearestViewportElement;
        var ctm = element.getTransformToElement(viewport);
        if (bbox !== null) {
            // This is one of the short-comings of SVG: there is no way to get
            // the bbox in the desired coordinate space. So we have to transform
            // the bounds and compute the box from that, which leads to
            // boxes which might be larger than needed (e.g., where there are
            // rotations). However, for common cases, this is doing the job.
            var points = [
            {
                x: bbox.x,
                y: bbox.y
            },

            {
                x: bbox.x + bbox.width,
                y: bbox.y
            },

            {
                x: bbox.x,
                y: bbox.y + bbox.height
            },

            {
                x: bbox.x + bbox.width,
                y: bbox.y + bbox.height
            }
            ];

            var tPoints = [
            {}, {}, {}, {}
            ];

            for (var i = 0; i < 4; i++) {
                ctm.transformPoint(points[i], tPoints[i]);
            }

            var minX = tPoints[0].x;
            var minY = tPoints[0].y;
            var maxX = tPoints[0].x;
            var maxY = tPoints[0].y;

            for (i = 1; i < 4; i++) {
                if (tPoints[i].x < minX) {
                    minX = tPoints[i].x;
                } else if (tPoints[i].x > maxX) {
                    maxX = tPoints[i].x;
                }

                if (tPoints[i].y < minY) {
                    minY = tPoints[i].y;
                } else if (tPoints[i].y > maxY) {
                    maxY = tPoints[i].y;
                }
            }

            vBbox = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            };
        }
        return vBbox;
    },

    /**
         * Determines whether a DOM element has the given className.
         * @method hasClass
         * @param {HTMLElement} element The DOM element.
         * @param {String} className the class name to search for
         * @return {Boolean} Whether or not the element has the given class.
         */
    hasClass: function(node, className) {
        var result = false;
        if (!className || className.baseVal === undefined) {
            result = superHasClass(node, className);
        } else {
            var re = Y.DOM._getRegExp('(?:^|\\s+)' +
                className + '(?:\\s+|$)');
            result = re.test(node.className.baseVal);
        }
        return result;
    },

    /**
         * Adds a class name to a given DOM element.
         * @method addClass
         * @param {HTMLElement} element The DOM element.
         * @param {String} className the class name to add to the class attribute
         */
    addClass: function(node, className) {
        if (!hasClass(node, className)) { // skip if already present
            var val = Y.Lang.trim([node.className, className].join(' '));
            if (!node.className || node.className.baseVal === undefined) {
                node.className = val;
            } else {
                node.className.baseVal = val;
            }
        }
    },

    /**
         * Removes a class name from a given element.
         * @method removeClass
         * @param {HTMLElement} element The DOM element.
         * @param {String} className the class name to remove from the class attribute
         */
    removeClass: function(node, className) {
        if (className && hasClass(node, className)) {

            if (node.className.baseVal === undefined) {
                node.className = Y.Lang.trim(node.className.replace(Y.DOM._getRegExp('(?:^|\\s+)' +
                    className + '(?:\\s+|$)'), ' '));
            } else {
                node.className.baseVal = Y.Lang.trim(node.className.baseVal.replace(Y.DOM._getRegExp('(?:^|\\s+)' +
                    className + '(?:\\s+|$)'), ' '));
            }

            if (hasClass(node, className) ) { // in case of multiple adjacent
                removeClass(node, className);
            }
        }
    },

    // =========================================================================
    // IMPORTANT: Need to override the following two methods because they use
    // in-scope references to removeClass and addClass
    // =========================================================================
    
    /**
         * Replace a class with another class for a given element.
         * If no oldClassName is present, the newClassName is simply added.
         * @method replaceClass
         * @param {HTMLElement} element The DOM element
         * @param {String} oldClassName the class name to be replaced
         * @param {String} newClassName the class name that will be replacing the old class name
         */
    replaceClass: function(node, oldC, newC) {
        //Y.log('replaceClass replacing ' + oldC + ' with ' + newC, 'info', 'Node');
        removeClass(node, oldC); // remove first in case oldC === newC
        addClass(node, newC);
    },

    /**
         * If the className exists on the node it is removed, if it doesn't exist it is added.
         * @method toggleClass
         * @param {HTMLElement} element The DOM element
         * @param {String} className the class name to be toggled
         * @param {Boolean} addClass optional boolean to indicate whether class
         * should be added or removed regardless of current state
         */
    toggleClass: function(node, className, force) {
        var add = (force !== undefined) ? force :
        !(hasClass(node, className));

        if (add) {
            addClass(node, className);
        } else {
            removeClass(node, className);
        }
    },

    /**
         * Wraps the play method call
         */
    play: function (element) {
        element.play();
    } ,

    /**
         * Sets a style property for a given element. This overrides the default
         * to allow custom properties to define their default unit (which can
         * be none, i.e., an empty string).
         *
         * @method setStyle
         * @param {HTMLElement} An HTMLElement to apply the style to.
         * @param {String} att The style property to set.
         * @param {String|Number} val The value.
         */
    setStyle: function(node, att, val, style) {
        style = style || node.style;
        var CUSTOM_STYLES = Y.DOM.CUSTOM_STYLES;

        if (style) {
            if (val === null || val === '') { // normalize unsetting
                val = '';
            } else if (!isNaN(Number(val)) &&
                (att.toLowerCase() in FORCE_UNIT)) {
                val += Y.DOM.DEFAULT_UNIT;
            }

            if (att in CUSTOM_STYLES) {
                if (CUSTOM_STYLES[att].set) {
                    CUSTOM_STYLES[att].set(node, val, style);
                    return; // NOTE: return
                } else if (typeof CUSTOM_STYLES[att] === 'string') {
                    att = CUSTOM_STYLES[att];
                }
            }
            style[att] = val;
        }
    }
        
}, true);

hasClass = Y.DOM.hasClass;
removeClass = Y.DOM.removeClass;
addClass = Y.DOM.addClass;


    /**
     * Matrix class.
     *
     * SVG has support for a matrix class, but it has a main issues:
     * its methods do not mutate the matrix and there is no option to
     * have methods which would mutate it. Also, the class has no support for
     * transforming points.
     *
     * Since it is bad practice to modify the prototype of DOM classes directly
     * the SVGMatrix class here provides a wrapper which will intercept calls
     * to the platform's matrix implementation and provide additional utility
     * methods such as <code>transformPoint</code>.
     */

    /**
     * @param m the wrapped SVGMatrix instance
     */
    Y.DOM.Matrix = function (m) {
        if (m === undefined || m === null) {
            m = defaultSVG.createSVGMatrix();
        }
        this._m = m;
    };
    
    Y.DOM.Matrix.prototype.transformPoint = function (p_pt, p_oResult) {
        var result = p_oResult, m = this._m;
        if (p_oResult === undefined) {
            result = {};
        }

        result.x = m.a * p_pt.x + m.c * p_pt.y + m.e;
        result.y = m.b * p_pt.x + m.d * p_pt.y + m.f;

        return result;
    };

    /**
     * Sets the matrix to identity
     */
    Y.DOM.Matrix.prototype.toIdentity = function () {
        var m = this._m;
        m.a = 1;
        m.b = 0;
        m.c = 0;
        m.d = 1;
        m.e = 0;
        m.f = 0;
        return this;
    };

var matrixMethods = [
"multiply",
"inverse",
"translate",
"scale",
"scaleNonUniform",
"rotate",
"rotateFromVector",
"flipX",
"flipY",
"skewX",
"skewY"
];

function getMatrixWrapper (fName) {
    return function () {
        var r = this._m[fName].apply(this._m, arguments),
        m = this._m;
        // Now, copy the result into this matrix to mutate it
        m.a = r.a;
        m.b = r.b;
        m.c = r.c;
        m.d = r.d;
        m.e = r.e;
        m.f = r.f;

        return this;
    };
}

for (var i = 0; i < matrixMethods.length; i++) {
    var fName = matrixMethods[i];
        Y.DOM.Matrix.prototype[fName] = getMatrixWrapper(fName);
}

/**
     * Wrap a/b/c/d/e/f access a function access to get the values.
     */
Y.each(['a', 'b', 'c', 'd', 'e', 'f'], function (member) {
    Y.DOM.Matrix.prototype[member] = function () {
        return this._m[member];
    };

    Y.DOM.Matrix.prototype['set' + member.toUpperCase()] = function (val) {
        this._m[member] = Number(val);
    };
});
/** =======================================================================
 *  Vincent Hardy
 *  License terms: see svg-wow.org
 *  CC0 http://creativecommons.org/publicdomain/zero/1.0/
 *  ======================================================================= */

var UID = '_yuid',
    NODE_NAME = 'nodeName';

Y.Node.prototype.toString = function () {
    var str = '',
        errorMsg = this[UID] + ': not bound to a node',
        node = this._node,
        id = node.getAttribute('id'); // form.id may be a field name

    if (node) {
        str += node[NODE_NAME];
        if (id) {
            str += '#' + id;
        }

        if (node.className) {
            if (node.className.baseVal === undefined) {
                str += '.' + node.className.replace(' ', '.');
            } else if (node.className.baseVal !== "") {
                str += '.' + node.className.baseVal.replace(' ', '.');
            }
        }

        // TODO: add yuid?
        str += ' ' + this[UID];
    }
    return str || errorMsg;
};

// =============================================================================
// Override the default setting for SVG to use setAttribute instead of setting
// the property on the object.
// =============================================================================
Y.Node.DEFAULT_SETTER = function(name, val) {
    var node = this._stateProxy;

    if (name.indexOf('.') > -1) {
        name = name.split('.');
        // only allow when defined on node
        Y.Object.setValue(node, name, val);
    } else if (node[name] !== undefined) { // pass thru DOM properties
        if (name !== 'textContent' && node.setAttribute !== undefined) {
            node.setAttribute(name, val);
        } else {
            node[name] = val;
        }
    } else {
        node.setAttribute(name, val);
    }

    return val;
};

// =============================================================================
// See dom-svg
//
// We override the different class attribute manipulation method to account for
// the SVG baseVal and animVal on that attribute.
// =============================================================================
Y.Node.importMethod(Y.DOM, [
    'createMatrix',
    'firstElement',
    'nextElement',
    'prevElement',
    'removeAllChildren',
    'getMatrix',
    'setMatrix',
    'loadContent',
    'getAttributes',
    'setAttributes',
    'getBBox',
    'getViewportBBox',
    'addClass',
    'removeClass',
    'replaceClass',
    'toggleClass',
    'play',
    'setStyle'
]);


// =============================================================================
// Provide special handlers for SVG attributes to account for their
// animated nature, i.e., the presence of a baseVal and animVal on the
// attribute value. To work with YUI, the following returns the baseVal and
// sets the baseVal on get and set accesses.
// =============================================================================

var svgLengthAttributeHandler = {
    getGetter: function(attr) {
        return function () {
            var attrVal = this._node[attr], result = NaN;
            if (attrVal !== null && attrVal !== undefined) {
                if (typeof attrVal === "number") {
                    result = attrVal;
                } else if (attrVal.baseVal.getItem !== undefined) {
                    if (attrVal.baseVal.numberOfItems > 0) {
                        // x attribute on text, for example, is a list
                        // we use the first value.
                        result = attrVal.baseVal.getItem(0).value;
                    } else {
                        result = 0; // Default to zero
                    }
                } else {
                    result = attrVal.baseVal.value;
                }
            }
            return result;
        };
    },

    getSetter : function (attr) {
        return function(val) {
            if (typeof val === 'number') {
                var attrVal = this._node[attr];
                if (attrVal.baseVal !== undefined) {
                    if (attrVal.baseVal.getItem !== undefined) {
                        if (attrVal.baseVal.numberOfItems > 0) {
                            attrVal.baseVal.getItem(0).value = val;
                        } else {
                            this._node.setAttribute(attr, val);
                        }
                    } else {
                        attrVal.baseVal.value = val;
                    }
                } else {
                    this._node[attr] = val;
                }
            } else {
                this._node.setAttribute(attr, val);
            }
        };
    }
};

var svgNumberAttributeHandler = {
    getGetter: function(attr) {
        return function () {
            return this._node[attr].baseVal;
        };
    },

    getSetter : function (attr) {
        return function(val) {
            this._node[attr].baseVal = Number(val);
        };
    }
};

var svgAttributes = {
    x: svgLengthAttributeHandler,
    y: svgLengthAttributeHandler,
    x1: svgLengthAttributeHandler,
    y1: svgLengthAttributeHandler,
    x2: svgLengthAttributeHandler,
    y2: svgLengthAttributeHandler,
    width: svgLengthAttributeHandler,
    height: svgLengthAttributeHandler,
    dx: svgLengthAttributeHandler,
    dy: svgLengthAttributeHandler,
    rx: svgLengthAttributeHandler,
    ry: svgLengthAttributeHandler,
    r: svgLengthAttributeHandler,
    rotate: svgLengthAttributeHandler,
    offset: svgNumberAttributeHandler
};

for (var p in svgAttributes) {
    if (svgAttributes.hasOwnProperty(p) === true) {
        Y.Node.ATTRS[p] = {
            getter: svgAttributes[p].getGetter(p),
            setter: svgAttributes[p].getSetter(p)
        };
    }
}


}, 'gallery-2010.10.15-19-32' ,{requires:['node', 'event', 'dom', 'anim']});
