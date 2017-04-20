"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
 * Copyright (c) Art <a.molcanovas@gmail.com>
 * Licensed under MIT: https://github.com/Alorel/node-ms-util/blob/master/LICENSE
 */

var defaultLangpack = {
    ms: "ms",
    sec: "sec",
    min: "min",
    hour: "hr",
    day: "d"
};
var defaultCfg = {
    lang: defaultLangpack,
    pad: true,
    forceMS: false
};

var second = 1000;
var minute = second * 60;
var hour = minute * 60;
var day = hour * 24;

var pad = function pad(input) {
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

    input = input.toString();

    if (input.length < length) {
        var _out = [input];
        for (var i = 0; i < length - input.length; i++) {
            _out.unshift(0);
        }
        return _out.join("");
    }

    return input;
};

var doPad = function doPad(input) {
    input.millis = pad(input.millis, 3);
    var _arr = ['hours', 'minutes', 'seconds'];
    for (var _i = 0; _i < _arr.length; _i++) {
        var k = _arr[_i];
        input[k] = pad(input[k]);
    }
    return input;
};

/**
 * Parse the given millis and return the number of days, hours, minutes seconds and ms they translate to.
 * @param {Number} ms Input millis
 * @returns {{days: Number, hours: Number, minutes: Number, seconds: Number, millis: Number, input: Number}}
 */
var parse = function parse(ms) {
    var days = Math.floor(ms / day);
    var hours = Math.floor(ms % day / hour);
    var minutes = Math.floor(ms % day % hour / minute);
    var seconds = Math.floor(ms % day % hour % minute / second);
    var millis = ms % 1000;

    return { days: days, hours: hours, minutes: minutes, seconds: seconds, millis: millis, input: ms };
};

/**
 * Parse the given millis to a word string, e.g. 3660000 ms would become 01hr 01min 00sec by default.
 * @param {Number} ms Input millis
 * @param {Object} [cfg] Configuration. Available keys:
 * <ul>
 *     <li><b>pad</b>: whether to pad the output numbers with zeroes (default: true)</li>
 *     <li><b>forceMS</b>: whether to display milliseconds even if ms >= 1000 (default: false)</li>
 *     <li>
 *         <b>lang</b>: language pack override. The default is
 *         <pre>
 *         {<br/>
 *              ms: "ms",<br/>
 *              sec: "sec",<br/>
 *              min: "min",<br/>
 *              hour: "hr",<br/>
 *              day: "d"<br/>
 *          }
 *             </pre>
 *     </li>
 * </ul>
 * @returns {string}
 */
var toWords = function toWords(ms, cfg) {
    cfg = _extends({}, defaultCfg, cfg || {});
    var parsed = parse(ms);
    if (cfg.pad) {
        parsed = doPad(parsed);
    }

    var ret = [];

    if (ms >= second && cfg.forceMS || ms < second) {
        ret.push("" + parsed.millis + cfg.lang.ms);
    }
    if (ms >= second) {
        ret.unshift("" + parsed.seconds + cfg.lang.sec);
    }
    if (ms >= minute) {
        ret.unshift("" + parsed.minutes + cfg.lang.min);
    }
    if (ms >= hour) {
        ret.unshift("" + parsed.hours + cfg.lang.hour);
    }
    if (ms >= day) {
        ret.unshift("" + parsed.days + cfg.lang.day);
    }

    return ret.join(" ");
};

/**
 * Parse the given millis to a colon-separated string, e.g. 3660000 ms would become 01:01:00 by default
 * @param {Number} ms Input millis
 * @param {Object} [cfg] Configuration. Available keys:
 * <ul>
 *     <li><b>pad</b>: whether to pad the output numbers with zeroes (default: true)</li>
 *     <li><b>forceMS</b>: whether to display milliseconds even if ms >= 1000 (default: false)</li>
 * </ul>
 * @returns {string}
 */
var colonSeparated = function colonSeparated(ms, cfg) {
    cfg = _extends({}, defaultCfg, cfg || {});
    var parsed = parse(ms);
    if (cfg.pad) {
        parsed = doPad(parsed);
    }

    var ret = [];

    if (ms >= second && cfg.forceMS || ms < second) {
        ret.push(parsed.millis);
    }
    if (ms >= second) {
        ret.unshift(parsed.seconds);
    }
    if (ms >= minute) {
        ret.unshift(parsed.minutes);
    }
    if (ms >= hour) {
        ret.unshift(parsed.hours);
    }
    if (ms >= day) {
        ret.unshift(parsed.days);
    }

    return ret.join(":");
};

var out = { parse: parse, toWords: toWords, colonSeparated: colonSeparated };
var undef = "undefined";

if ((typeof module === "undefined" ? "undefined" : _typeof(module)) !== undef) {
    module.exports = out;
}
if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== undef) {
    window.parseMs = out;
}
