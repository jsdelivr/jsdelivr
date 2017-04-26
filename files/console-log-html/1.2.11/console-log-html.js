/**
 * Redirects console output to an &lt;ul&gt; element
 * @namespace
 */
var ConsoleLogHTML = (function (original, methods, console, Object, TYPE_UNDEFINED, TYPE_BOOLEAN, INSTANCE_OBJECT_OBJECT) {
    'use strict';
    for (var i = 0; i < methods.length; i++) {
        if (TYPE_UNDEFINED !== typeof console[methods[i]]) {
            original[methods[i]] = console[methods[i]];
        }
    }

    var originalKeys = Object.keys(original),
        originalClear = TYPE_UNDEFINED !== typeof console.clear ? console.clear : false,
        jQueryIsUp = typeof jQuery !== TYPE_UNDEFINED ? jQuery : false,
        extend = function () {
            var out = {},
                i = 0,
                j, keys;

            for (; i < arguments.length; i++) {
                keys = Object.keys(arguments[i]);
                for (j = 0; j < keys.length; j++) {
                    out[keys[j]] = arguments[i][keys[j]];
                }
            }

            return out;
        },
        register = function (method, target, options, includeTimestamp, logToConsole) {
            console[method] = function (msg, onlyConsole) {
                var finalMsg, li;

                if (typeof onlyConsole !== TYPE_BOOLEAN) {
                    onlyConsole = false;
                }
                if (!onlyConsole) {
                    finalMsg = msg.toString();
                    if (finalMsg === INSTANCE_OBJECT_OBJECT) {
                        try {
                            finalMsg = JSON.stringify(msg);
                        } catch (e) {

                        }
                    }
                    finalMsg = (includeTimestamp ? "[" + (new Date()).toLocaleTimeString() + "] " : "") + finalMsg;
                    li = document.createElement("li");
                    li.setAttribute("data-level", method);
                    li.innerText = finalMsg;
                    if (options[method]) {
                        li.setAttribute("class", options[method]);
                    }
                    target.insertBefore(li, target.firstChild);
                }

                if (logToConsole) {
                    original[method].apply(console, [msg]);
                }
            };
        };

    return {
        /**
         * Default CSS classes
         * @type Object
         * @memberof ConsoleLogHTML
         * @prop {?string} error=text-danger The default CSS class for error messages
         * @prop {?string} warn=text-warning The default CSS class for warning messages
         * @prop {?string} info=text-success The default CSS class for info messages
         * @prop {?string} debug=text-info The default CSS class for debug messages
         * @prop {?string} log=null The default CSS class for log messages
         */
        DEFAULTS: {
            error: "text-danger",
            warn: "text-warning",
            info: "text-success",
            debug: "text-info",
            log: ""
        },
        /**
         * Disconnect our console overrides, reverting to the original state
         * @memberof ConsoleLogHTML
         */
        disconnect: function () {
            for (var i = 0; i < originalKeys.length; i++) {
                console[originalKeys[i]] = original[originalKeys[i]];
            }
            if (false !== originalClear) {
                console.clear = originalClear;
            }
        },
        /**
         * Overwrite the original console.* methods and start outputting to screen
         * @memberof ConsoleLogHTML
         * @param {$|jQuery|HTMLUListElement} target The target &lt;ul&gt; element to output to. Can can either be a
         * jQuery or vanilla JS HTMLUListElement.
         * @param {Object} [options=ConsoleLogHTML.DEFAULTS] CSS class options. See {@link ConsoleLogHTML.DEFAULTS} for
         * default values.
         * @param {boolean} [includeTimestamp=true] Whether to include the log message timestamp in HTML
         * @param {boolean} [logToConsole=true] Whether to continue logging to the console as well as HTML.
         * @throws {Error} If target is not an &lt;ul&gt; element
         */
        connect: function (target, options, includeTimestamp, logToConsole) {
            if (jQueryIsUp && target instanceof jQueryIsUp) {
                target = target[0];
            }
            if (typeof logToConsole !== TYPE_BOOLEAN) {
                logToConsole = true;
            }
            if (typeof includeTimestamp !== TYPE_BOOLEAN) {
                includeTimestamp = true;
            }
            if (!(target instanceof HTMLUListElement)) {
                throw new Error("The target must be a HTML <ul> element");
            } else {
                options = extend(ConsoleLogHTML.DEFAULTS, options || {});
                for (var i = 0; i < originalKeys.length; i++) {
                    register(originalKeys[i], target, options, includeTimestamp, logToConsole);
                }

                if (false !== originalClear) {
                    console.clear = function () {
                        target.innerText = "";
                        originalClear.apply(console);
                    };
                }
            }
        }
    };
})({}, ["log", "debug", "info", "warn", "error"], console, Object, "undefined", "boolean", '[object Object]');

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = ConsoleLogHTML;
}