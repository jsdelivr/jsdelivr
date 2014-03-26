YUI.add('gallery-message-format', function (Y, NAME) {

var MODULE_NAME = "gallery-message-format",
    PluralRules, inRange,
    Formatter, StringFormatter, DateFormatter, TimeFormatter, NumberFormatter,SelectFormatter,
    PluralFormatter, ChoiceFormatter, MsgListFormatter, formatters;

/**
 * Formatter base class
 * @class MsgBaseFormatter
 * @namespace Intl
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.MsgBaseFormatter = function(values) {
    this.values = values;
};

Formatter = Y.Intl.MsgBaseFormatter;

Y.mix(Formatter.prototype, {
    /**
     * Get value of key
     * @method getValue
     * @param key {String|Number} Key/index of value in the object/array 'values'
     * @return Value from the data in 'values'
     */
    getValue: function(key) {
        if(Y.Lang.isArray(this.values)) {
            key = parseInt(key, 10);
        }
        return this.values[key];
    },

    /**
     * Get value of params.key
     * The value found will be set to params.value
     * @method getParams
     * @param params {Object} Object containing key as in { key: "KEY" }
     * @return {Boolean} True if value found, False otherwise
     */
    getParams: function(params) {
        if(!params || !params.key) {
            return false;
        }

        var value = this.getValue(params.key);
	
        if(value !== undefined) {
            params.value = value;
            return true;
        }

        return false;
    },

    /**
     * Format string. Will be overridden in descendants
     * @method format
     */
    format: function(/*str, config*/) {
        Y.error('Not implemented');	//Must override in descendants
    }
});

//For date and time formatters
Y.mix(Formatter, {
    /**
     * Create an instance of the formatter
     * @method createInstance
     * @static
     * //param values {Array|Object} The data to be processed and inserted.
     */
    createInstance: function(/*values*/) {
        //return new Formatter(values);
        Y.error('Not implemented');	//Must override in descendants
    },

    /**
     * Get current timezone. Used for time format
     * @method getCurrentTimeZone
     * @return {Y.Date.Timezone}
     */
    getCurrentTimeZone: function() {
        if(Y.Date === undefined || Y.Date.Timezone === undefined) { return "GMT"; }
        var systemTZoneOffset = (new Date()).getTimezoneOffset()*-60;
        return Y.Date.Timezone.getTimezoneIdForOffset(systemTZoneOffset);
    }
});
/**
 * String formatter
 * @class StringFormatter
 * @namespace Intl
 * @extends MsgBaseFormatter
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.StringFormatter = function(values) {
    StringFormatter.superclass.constructor.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*}";
};

StringFormatter = Y.Intl.StringFormatter;
Y.extend(StringFormatter, Formatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
StringFormatter.createInstance = function(values) {
    return new StringFormatter(values);
};

Y.mix(StringFormatter.prototype, {
    /**
     * Get parameters from regex match
     * @method getParams
     * @param params {Object} Object to receive value. Function will store key and value in this variable
     * @param matches {Array} Result of regex match over pattern string.
     * @return {Boolean} True if value found, False otherwise
     */
    getParams: function(params, matches) {
        if(matches && matches[1]) {
            params.key = matches[1];
            if(Formatter.prototype.getParams.call(this, params)) {
                return true;
            }
        }
	
        return false;
    },

    /**
     * Format all instances in str that can be handled by StringFormatter
     * @method format
     * @param str {String} Input string/pattern
     * @return {String} Formatted result
     */
    format: function(str) {
        var regex = new RegExp(this.regex, "gm"),
            matches = null,
            params;
        while((matches = regex.exec(str))) {
            params = {};

            if(this.getParams(params, matches)) {
                //Got a match
                str = str.replace(matches[0], params.value);
            }

        }

        return str;
    }
}, true);/**
 * Date formatter
 * @class DateFormatter
 * @extends MsgBaseFormatter
 * @namespace Intl
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.DateFormatter = function(values) {
    DateFormatter.superclass.constructor.call(this, values);
    this.styles = {
        "short":  [ 512 /*Y.Date.DATE_FORMATS.YMD_SHORT*/, 0, 0 ],
        "medium": [ 256 /*Y.Date.DATE_FORMATS.YMD_ABBREVIATED*/,0, 0 ],
        "long":   [ 128 /*Y.Date.DATE_FORMATS.YMD_LONG*/, 0, 0 ],
        "full":   [ 1 /*Y.Date.DATE_FORMATS.WYMD_LONG*/, 0, 0 ]
    };
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*date\\s*(,\\s*(\\w+)\\s*)?}";
};

DateFormatter = Y.Intl.DateFormatter;
Y.extend(DateFormatter, Formatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
DateFormatter.createInstance = function(values) {
    return new DateFormatter(values);
};

Y.mix(DateFormatter.prototype, {
    /**
     * Get parameters from regex match
     * @method getParams
     * @param params {Object} Object to receive value. Function will store the values key, value, style in this variable
     * @param matches {Array} Result of regex match over pattern string.
     * @return {Boolean} True if value found, False otherwise
     */
    getParams: function(params, matches) {
        if(matches) {
            if(matches[1]) {
                params.key = matches[1];
            }
            if(matches[3]) {
                params.style = matches[3];
            }
        }

        if(!params.style) {
            params.style = "medium";
        }			//If no style, default to medium

        if(!this.styles[params.style]) {
            return false;
        }	//Invalid style

        if(params.key && Formatter.prototype.getParams.call(this, params)) {
            return true;
        }

        return false;
    },

    /**
     * Format all instances in str that can be handled by DateFormatter
     * @method format
     * @param str {String} Input string/pattern
     * @param [config] {Object} Optional configuration parameters. Used to pass timezone for time formatting
     * @return {String} Formatted result
     */
    format: function(str, config) {
        if(Y.Date === undefined || !Y.Date.__advancedFormat ) { return str; }
        var regex = new RegExp(this.regex, "gm"),
            matches = null,
            params, style, result;
        while((matches = regex.exec(str))) {
            params = {};

            if(this.getParams(params, matches)) {
                //Got a match
                style = this.styles[params.style];
                result = Y.Date.format(new Date(params.value), {
                    timezone: config.timezone || Formatter.getCurrentTimeZone(),
                    dateFormat: style[0],
                    timeFormat: style[1],
                    timezoneFormat: style[2]
                });
                str = str.replace(matches[0], result);
            }

        }

        return str;
    }
}, true);
/**
 * Time formatter
 * @class TimeFormatter
 * @extends DateFormatter
 * @namespace Intl
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.TimeFormatter = function(values) {
    TimeFormatter.superclass.constructor.call(this, values);
    this.styles = {
        "short": [ 0, 2 /*Y.Date.TIME_FORMATS.HM_SHORT*/, 0 ],
        "medium": [ 0, 1 /*Y.Date.TIME_FORMATS.HM_ABBREVIATED*/, 0 ],
        "long": [ 0, 1 /*Y.Date.TIME_FORMATS.HM_ABBREVIATED*/, 2 /*Y.Date.TIMEZONE_FORMATS.Z_SHORT*/ ],
        "full": [ 0, 1 /*Y.Date.TIME_FORMATS.HM_ABBREVIATED*/, 1 /*Y.Date.TIMEZONE_FORMATS.Z_ABBREVIATED*/ ]
    };
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*time\\s*(,\\s*(\\w+)\\s*)?}";
};

TimeFormatter = Y.Intl.TimeFormatter;
Y.extend(TimeFormatter, DateFormatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
TimeFormatter.createInstance = function(values) {
    return new TimeFormatter(values);
};
/**
 * Number formatter
 * @class NumberFormatter
 * @extends MsgBaseFormatter
 * @namespace Intl
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.NumberFormatter = function(values) {
    NumberFormatter.superclass.constructor.call(this, values);
    this.styles = {
        "integer": 4 /*Y.Number.STYLES.NUMBER_STYLE*/,
        "percent": 8 /*Y.Number.STYLES.PERCENT_STYLE*/,
        "currency": 1 /*Y.Number.STYLES.CURRENCY_STYLE*/
    };
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*number\\s*(,\\s*(\\w+)\\s*)?}";
};

NumberFormatter = Y.Intl.NumberFormatter;
Y.extend(NumberFormatter, Formatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
NumberFormatter.createInstance = function(values) {
    return new NumberFormatter(values);
};

Y.mix(NumberFormatter.prototype, {
    /**
     * Get parameters from regex match
     * @method getParams
     * @param params {Object} Object to receive value. Function will store the values key, value, style in this variable
     * @param matches {Array} Result of regex match over pattern string.
     * @return {Boolean} True if value found, False otherwise
     */
    getParams: function(params, matches) {
        if(matches) {
            if(matches[1]) {
                params.key = matches[1];
            }
            if(matches[3]) {
                params.style = matches[3];
            }
        }

        if(!params.style) {
            params.style = "integer";	//If no style, default to medium
            params.showDecimal = true;	//Show decimal parts too
        }

        if(!this.styles[params.style]) {	//Invalid style
            return false;
        }

        if(params.key && Formatter.prototype.getParams.call(this, params)) {
            return true;
        }

        return false;
    },

    /**
     * Format all instances in str that can be handled by NumberFormatter
     * @method format
     * @param str {String} Input string/pattern
     * @return {String} Formatted result
     */
    format: function(str) {
        if(Y.Number === undefined || !Y.Number.__advancedFormat) { return str; }
        var regex = new RegExp(this.regex, "gm"),
            matches = null,
            params, config;
        while((matches = regex.exec(str))) {
            params = {};

            if(this.getParams(params, matches)) {
                //Got a match
                config = {
                    style: this.styles[params.style]
                };
                if(params.style === "integer" && !params.showDecimal) {
                    config.parseIntegerOnly = true;
                }
                str = str.replace(matches[0], Y.Number.format(params.value, config));
            }
        }

        return str;
    }
}, true);
/**
 * Select formatter. Select ouput based on value of key
 * @class SelectFormatter
 * @extends MsgBaseFormatter
 * @namespace Intl
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.SelectFormatter = function(values) {
    SelectFormatter.superclass.constructor.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*select\\s*,\\s*";
};

SelectFormatter = Y.Intl.SelectFormatter;
Y.extend(SelectFormatter, Formatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
SelectFormatter.createInstance = function(values) {
    return new SelectFormatter(values);
};

Y.mix(SelectFormatter.prototype, {
    /**
     * Get parameters from regex match
     * @method getParams
     * @param params {Object} Object to receive value. Function will store key and value in this variable
     * @param matches {Array} Result of regex match over pattern string.
     * @return {Boolean} True if value found, False otherwise
     */
    getParams: function(params, matches) {
        if(matches) {
            if(matches[1]) {
                params.key = matches[1];
            }
        }

        if(params.key && Formatter.prototype.getParams.call(this, params)) {
            return true;
        }

        return false;
    },

    /**
     * Parse choices in pattern and get options array.
     * @method parseOptions
     * @param str {String} Pattern string
     * @param start {Number} Position in str to start parsing from
     * @return {Object} Object in the form:
             {
               options: [
                     { key: KEY1, value: VALUE1 },
                     { key: KEY2, value: VALUE2 },
                     ... ],
               next: i  //Index of next character in str that can be parsed
             }
     */
    parseOptions: function(str, start) {
        var options = {},
            key = "", value = "", current = "",
            i, ch;
        for(i=start; i<str.length; i++) {
            ch = str.charAt(i);
            if (ch === '\\') {
                current += ch + str.charAt(i+1);
                i++;
            } else if (ch === '}') {
                if(current === "") {
                    i++;
                    break;
                }
                value = current;
                options[key.trim()] = value;
                current = key = value = "";
            } else if (ch === '{') {
                key = current;
                current = "";
            } else {
                current += ch;
            }
        }

        if(current !== "") {
            return null;
        }

        return {
            options: options,
            next: i
        };
    },

    /**
     * Select output depending on params.value from options
     * @method select
     * @param options {Array} Array of key,value pairs
     * @param params {Object} Object containing value
     * @return {String} selected result
     */
    select: function(options, params) {
        for ( var key in options ) {
            if( key === "other" ) {
                continue;	//Will use this only if everything else fails
            }

            if( key === params.value ) {
                return options[key];
            }
        }

        return options.other;
    },

    /**
     * Format all instances in str that can be handled by SelectFormatter
     * @method format
     * @param str {String} Input string/pattern
     * @return {String} Formatted result
     */
    format: function(str) {
        var regex = new RegExp(this.regex, "gm"),
            matches = null,
            params, options, result, start;
        while((matches = regex.exec(str))) {
            params = {};

            if(this.getParams(params, matches)) {
                //Got a match
                options = this.parseOptions(str, regex.lastIndex);
                if(!options) {
                    continue;
                }

                regex.lastIndex = options.next;
                options = options.options;

                result = this.select(options, params);
                if(result) {
                    start = str.indexOf(matches[0]);
                    str = str.slice(0, start) + result + str.slice(regex.lastIndex);
                }
            }
        }

        return str;
    }
}, true);/**
 * PluralRules is used to determine the plural form in MessageFormat
 * @class PluralRules
 * @namespace Intl
 * @static
 */
Y.Intl.PluralRules = {
    /**
     * Check if n is between start and end
     * @method _inRange
     * @static
     * @private
     * @param n {Number} Number to test
     * @param start {Number} Start of range
     * @param end {Number} End of range
     * @return {Boolean} true if n is between start and end, false otherwise
     */
    _inRange: function(n, start, end) {
        return n >= start && n <= end;
    },

    /**
     * Find matching plural form for the set of rules
     * @method _matchRule
     * @static
     * @private
     * @param rules {Object} Keys will be plural forms one,two,.. Values will be boolean
     * @return {String} Returns key that has value true
     */
    _matchRule: function(rules) {
        for(var key in rules) {
            if(rules[key]) { return key; }
        }
        return "other";
    },

    /**
     * Set of rules. Each locale will have a matching rule. The corresponding functions in each set
     * will take a number as parameter and return the relevant plural form.
     */
    rules: {
        set1: function(n) {
            var mod = n % 100;
            return PluralRules._matchRule({
                few:  inRange(mod, 3, 10),
                many: inRange(mod, 11, 99),
                one:  n === 1,
                two:  n === 2,
                zero: n === 0
            });
        },

        set2: function(n) {
            return PluralRules._matchRule({
               many: n !== 0 && n%10 === 0,
               one:  n === 1,
               two:  n === 2
            });
        },

        set3: function(n) {
            return PluralRules._matchRule({
               one: n === 1
            });
        },

        set4: function(n) {
            return PluralRules._matchRule({
                one: inRange(n, 0, 1)
            });
        },

        set5: function(n) {
            return PluralRules._matchRule({
                one: inRange(n, 0, 2) && n !== 2
            });
        },

        set6: function(n) {
            return PluralRules._matchRule({
                one:  n%10 === 1 && n%100 !== 11,
                zero: n === 0
            });
        },

        set7: function(n) {
            return PluralRules._matchRule({
                one: n === 1,
                two: n === 2
            });
        },

        set8: function(n) {
            return PluralRules._matchRule({
                few:  inRange(n, 3, 6),
                many: inRange(n, 7, 10),
                one:  n === 1,
                two:  n === 2
            });
        },

        set9: function(n) {
            return PluralRules._matchRule({
                few: n === 0 || (n !== 1 && inRange(n%100, 1, 19)),
                one: n === 1
            });
        },

        set10: function(n) {
            var mod10 = n%10, mod100 = n%100;
            return PluralRules._matchRule({
                few: inRange(mod10, 2, 9) && !inRange(mod100, 11, 19),
                one: mod10 === 1 && !inRange(mod100, 11, 19)
            });
        },

        set11: function(n) {
            var mod10 = n%10, mod100 = n%100;
            return PluralRules._matchRule({
                few:  inRange(mod10, 2, 4) && !inRange(mod100, 12, 14),
                many: mod10 === 0 || inRange(mod10, 5, 9) || inRange(mod100, 11, 14),
                one:  mod10 === 1 && mod100 !== 11
            });
        },

        set12: function(n) {
            return PluralRules._matchRule({
                few: inRange(n, 2, 4),
                one: n === 1
            });
        },

        set13: function(n) {
            var mod10 = n%10, mod100 = n%100;
            return PluralRules._matchRule({
                few:  inRange(mod10, 2, 4) && !inRange(mod100, 12, 14),
                many: n !== 1 && inRange(mod10, 0, 1) || inRange(mod10, 5, 9) || inRange(mod100, 12, 14),
                one:  n === 1
            });
        },

        set14: function(n) {
            var mod = n%100;
            return PluralRules._matchRule({
                few: inRange(mod, 3, 4),
                one: mod === 1,
                two: mod === 2
            });
        },

        set15: function(n) {
            var mod = n%100;
            return PluralRules._matchRule({
                few:  n === 0 || inRange(mod, 2, 10),
                many: inRange(mod, 11, 19),
                one:  n === 1
            });
        },

        set16: function(n) {
            return PluralRules._matchRule({
                one: n%10 === 1 && n !== 11
            });
        },

        set17: function(n) {
            return PluralRules._matchRule({
                few:  n === 3,
                many: n === 6,
                one:  n === 1,
                two:  n === 2,
                zero: n === 0
            });
        },

        set18: function(n) {
            return PluralRules._matchRule({
                one:  inRange(n, 0, 2) && n !== 0 && n !== 2,
                zero: n === 0
            });
        },

        set19: function(n) {
            return PluralRules._matchRule({
                few: inRange(n, 2, 10),
                one: inRange(n, 0, 1)
            });
        },

        set20: function(n) {
            var mod1 = n%10, mod2 = n%100, mod6 = n%1000000;
            return PluralRules._matchRule({
                few:  (inRange(mod1, 3, 4) || mod1 === 9) && !inRange(mod2, 10, 19) && !inRange(mod2, 70, 79) && !inRange(mod2, 90, 99),
                many: n !== 0 && mod6 === 0,
                one:  mod1 === 1 && mod2 !== 11 && mod2 !== 71 && mod2 !== 91,
                two:  mod1 === 2 && mod2 !== 12 && mod2 !== 72 && mod2 !== 92
            });
        },

        set21: function(n) {
            return PluralRules._matchRule({
                one:  n === 1,
                zero: n === 0
            });
        },

        set22: function(n) {
            return PluralRules._matchRule({
                one: inRange(n, 0, 1) || inRange(n, 11, 99)
            });
        },

        set23: function(n) {
            return PluralRules._matchRule({
                one: inRange(n%10, 1, 2) || n%20 === 0
            });
        },

        set24: function(n) {
            return PluralRules._matchRule({
                few: inRange(n, 3, 10) || inRange(n, 13, 19),
                one: n === 1 || n === 11,
                two: n === 2 || n === 12
            });
        },

        set25: function(n) {
            return PluralRules._matchRule({
                one: n === 1 || n === 5
            });
        },

        set26: function(n) {
            var mod10 = n%10, mod100 = n%100;
            return PluralRules._matchRule({
                one: (mod10 === 1 || mod10 === 2) && (mod100 !== 11 && mod100 !== 12)
            });
        },

        set27: function(n) {
            var mod10 = n%10, mod100 = n%100;
            return PluralRules._matchRule({
                few: mod10 === 3 && mod100 !== 13,
                one: mod10 === 1 && mod100 !== 11,
                two: mod10 === 2 && mod100 !== 12
            });
        },

        set28: function(n) {
            return PluralRules._matchRule({
                many: n === 11 || n === 8 || n === 80 || n === 800
            });
        },

        set29: function(n) {
            return PluralRules._matchRule({
                few: n === 4,
                one: n === 1 || n === 3,
                two: n === 2
            });
        },

        set30: function(n) {
            return PluralRules._matchRule({
                few: n === 4,
                one: n === 1,
                two: n === 2 || n === 3
            });
        },

        set31: function(n) {
            return PluralRules._matchRule({
                few:  n === 4,
                many: n === 6,
                one:  n === 1,
                two:  n === 2 || n === 3
            });
        },

        set32: function(n) {
            return PluralRules._matchRule({
                few:  n === 4,
                many: n === 6,
                one:  Y.Array.indexOf([1,5,7,8,9,10], n) > -1,
                two: n === 2 || n === 3
            });
        },

        set33: function(n) {
            return PluralRules._matchRule({
                few:  inRange(n, 2, 9),
                many: inRange(n, 10, 19) || inRange(n, 100, 199) || inRange(n, 1000, 1999),
                one:  n === 1
            });
        }
    }
};

PluralRules = Y.Intl.PluralRules;
inRange = PluralRules._inRange;
/**
 * Plural formatter. Select ouput based on whether value of key is singular/plural
 * @class PluralFormatter
 * @extends SelectFormatter
 * @namespace Intl
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.PluralFormatter = function(values) {
    PluralFormatter.superclass.constructor.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*plural\\s*,\\s*";
    
    var formats = Y.Intl.get(MODULE_NAME),
        ruleSet = formats.pluralRule;

    if(ruleSet) {
         this.rule = PluralRules.rules[ruleSet];
    }

    if(this.rule === undefined) {
         this.rule = function() { return "other"; };
    }
};

PluralFormatter = Y.Intl.PluralFormatter;
Y.extend(PluralFormatter, SelectFormatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
PluralFormatter.createInstance = function(values) {
    return new PluralFormatter(values);
};

/**
 * Select output depending on params.value from options
 * @method select
 * @param options {Object} Object containing results for singular/plural
 * @param params {Object} Object containing value
 * @return {String} selected result
 */
PluralFormatter.prototype.select = function(options, params) {
    var pluralForm = this.rule(params.value),
        result = options[pluralForm];

    if(result === undefined || result === null) {
        result = options.other;
    }

    result = result.replace("#", new NumberFormatter({VAL: params.value}).format("{VAL, number, integer}"));	//Use 'number' to format this part

    return result;
};
/**
 * Choice formatter. Select ouput based on numerical values
 * @class ChoiceFormatter
 * @extends SelectFormatter
 * @namespace Intl
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.ChoiceFormatter = function(values) {
    ChoiceFormatter.superclass.constructor.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*choice\\s*,\\s*(.+)}";
};

ChoiceFormatter = Y.Intl.ChoiceFormatter;
Y.extend(ChoiceFormatter, SelectFormatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
ChoiceFormatter.createInstance = function(values) {
    return new ChoiceFormatter(values);
};

Y.mix(ChoiceFormatter.prototype, {
    /**
     * Parse choices in pattern and get options array.
     * @method parseOptions
     * @param choicesStr {String} Choice string from pattern
     * @return {Array} Array of objects containing value(choice), result, and relation
     */
    parseOptions: function(choicesStr) {
        var options = [],
            choicesArray = choicesStr.split("|"),
            i, j, choice, relations, rel, mapping, ch;
        for (i=0; i<choicesArray.length; i++) {
            choice = choicesArray[i];
            relations = ['#', '<', '\u2264'];
            for (j=0; j<relations.length; j++) {
                rel = relations[j];
                if(choice.indexOf(rel) !== -1) {
                    mapping = choice.split(rel);
                    ch = {
                        value: parseInt(mapping[0], 10),
                        result: mapping[1],
                        relation: rel
                    };
                    options.push(ch);
                    break;
                }
            }
        }

        return options;
    },

    /**
     * Get parameters from regex match
     * @method getParams
     * @param params {Object} Object to receive value. Function will store the values key, value, choices in this variable
     * @param matches {Array} Result of regex match over pattern string.
     * @return {Boolean} True if value found, False otherwise
     */
    getParams: function(params, matches) {
        if(SelectFormatter.prototype.getParams.call(this, params, matches)) {
            if(matches[2]) {
                params.choices = this.parseOptions(matches[2]);
                return params.choices === [] ? false: true;
            }
        }

        return false;
    },

    /**
     * Select output depending on params.value from options in params.choices
     * @method select
     * @param params {Object} Object containing value and choices
     * @return {String} selected result
     */
    select: function(params) {
        var choice, value, result, relation, i;
        for (i=0; i<params.choices.length; i++) {
            choice = params.choices[i];
            value = choice.value, result = choice.result, relation = choice.relation;

            if( (relation === '#' && value === params.value) || (relation === '<' && value < params.value)
                || (relation === '\u2264' && value <= params.value)) {
                return result;
            }
        }

        return "";
    },

    /**
     * Format all instances in str that can be handled by ChoiceFormatter
     * @method format
     * @param str {String} Input string/pattern
     * @return {String} Formatted result
     */
    format: function(str) {
        var regex = new RegExp(this.regex, "gm"),
            matches = null,
            params, result;
        while((matches = regex.exec(str))) {
            params = {};

            if(this.getParams(params, matches)) {
                result = this.select(params);
                if(result) {
                    str = str.replace(matches[0], result);
                }
            }
        }

        return str;
    }
}, true);/**
 * List formatter
 * @class MsgListFormatter
 * @namespace Intl
 * @extends StringFormatter
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.MsgListFormatter = function(values) {
      MsgListFormatter.superclass.constructor.call(this, values);
      this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*list\\s*}";
};

MsgListFormatter = Y.Intl.MsgListFormatter;
Y.extend(MsgListFormatter, StringFormatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
MsgListFormatter.createInstance = function(values) {
     return new MsgListFormatter(values);
};

Y.mix(MsgListFormatter.prototype, {
     /**
      * Format all instances in str that can be handled by MsgListFormatter
      * @method format
      * @param str {String} Input string/pattern
      * @return {String} Formatted result
      */
     format: function(str) {
          if(Y.Intl === undefined || Y.Intl.ListFormatter === undefined || Y.Intl.ListFormatter.format === undefined) { return str; }
          var regex = new RegExp(this.regex, "gm"),
              matches = null,
              params;

          while((matches = regex.exec(str))) {
              params = {};

              if(this.getParams(params, matches)) {
                  //Got a match
                  str = str.replace(
                             matches[0],
                             Y.Intl.ListFormatter.format( params.value )
                  );
              }
          }

          return str;
     }
}, true);

/**
 * MessageFormat enables the construction of localizable messages that combine static strings with information that only becomes available at runtime.
 * @module intl-format
 * @requires datatype-date-advanced-format, datatype-number-advanced-format, intl
 */

/**
 * Formatter classes. For each group found in the pattern, will try to parse with all of these formatters.
 * If a formatter fails to parse, the next one in the list try to do so.
 */
formatters = [ StringFormatter, DateFormatter, TimeFormatter, NumberFormatter, ChoiceFormatter, PluralFormatter, SelectFormatter, MsgListFormatter ];

Y.mix(Y.Intl, {

    /**
     * Format message that may contain date/time, numbers, etc. Choice, Select and Plural formatters are also available.
     * @method formatMessage
     * @static
     * @param pattern {String} string contains static text with embedded format elements that specify
              how to process and insert strings, numbers, and dates, as well as perform conditional processing.
     * @param values {Object|Array} The data to be processed and inserted.
     * @param [config] {Object} Optional configuration parameters
     * @return {String} Formatted result
     * @example
            //String formatting. Key is replaced by value
            Y.Intl.formatMessage("{EMPLOYEE} reports to {MANAGER}", {
                "EMPLOYEE": "Ashik",
                "MANAGER": "Dharmesh"
            });

            //3-parameter form: {KEY, type, style}. Style is optional. Type can be date/time/number. Style can be short/medium/long/full
            //For 'time', timezone can be specified as configuration param. If not specified, will default to system timezone
            Y.Intl.formatMessage("Today is {DATE, date, short}", { DATE: new Date() });
            Y.Intl.formatMessage("The time is {DATE, time, medium}", {DATE: new Date()}, {timezone: "Asia/Kolkata"});
            Y.Intl.formatMessage("There are {POPULATION_INDIA, number} million people in India.", {POPULATION_INDIA: 1241.492});

            //Select formatting. Selects output depending on value
            Y.Intl.formatMessage("{NAME} est {GENDER, select, female {allée} other {allé}} à {CITY}.", {
                "NAME": "Henri",
                "GENDER": "male",
                "CITY": "Paris"
            });

            //Plural formatting. Selects output depending on whether numerical value is singular/plural
            Y.Intl.formatMessage("{COMPANY_COUNT, plural, one {One company} other {# companies}} published new books.", {
                "COMPANY_COUNT": 1
            });

            //Choice formatting. Selects output depending on numerical value
            Y.Intl.formatMessage("There {FILE_COUNT, choice, 0#are no files|1#is one file|1<are {FILE_COUNT, number, integer} files} on disk.", {
                "FILE_COUNT": 1
            });
     */
    formatMessage: function(pattern, values, config) {
        config = config || {};
        var i, formatter;
        for(i=0; i<formatters.length; i++) {
            formatter = formatters[i].createInstance(values);
            pattern = formatter.format(pattern, config);
        }
        return pattern;
    }
});


}, 'gallery-2013.04.10-22-48', {
    "lang": [
        "am",
        "ar",
        "be",
        "cs",
        "cy",
        "fil",
        "fr",
        "ga",
        "gv",
        "he",
        "hi",
        "hr",
        "",
        "kw",
        "lt",
        "lv",
        "mk",
        "mt",
        "pl",
        "ro",
        "ru",
        "sh",
        "sk",
        "sl",
        "sr",
        "ti",
        "tl",
        "uk"
    ],
    "requires": [
        "intl"
    ]
});
