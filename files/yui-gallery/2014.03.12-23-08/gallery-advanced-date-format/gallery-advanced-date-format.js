YUI.add('gallery-advanced-date-format', function (Y, NAME) {

/*
 * Copyright 2012 Yahoo! Inc. All Rights Reserved. Based on code owned by VMWare, Inc.
 */

var MODULE_NAME = "gallery-advanced-date-format",
    Format, ShortNames, DateFormat, BuddhistDateFormat, YDateFormat, YRelativeTimeFormat, YDurationFormat;

Y.Date.__advancedFormat = true;

//
// Format class
//

/**
 * Base class for all formats. To format an object, instantiate the format of your choice and call the format method which
 * returns the formatted string.
 * For internal use only.
 * @class __BaseFormat
 * @namespace Date
 * @constructor
 * @private
 * @param {String} pattern
 * @param {Object} formats
 */
Y.Date.__BaseFormat = function(pattern, formats) {
    if ( !pattern && !formats ) {
        return;
    }

    Y.mix(this, {
        /**
         * Pattern to format/parse
         * @property _pattern
         * @type String
         */
        _pattern: pattern,
        /**
         * Segments in the pattern
         * @property _segments
         * @type Date.__BaseFormat.Segment
         */
        _segments: [],
        Formats: formats
    });
};

Format = Y.Date.__BaseFormat;

Y.mix(Format.prototype, {
    /**
     * Format object
     * @method format
     * @param object The object to be formatted
     * @return {String} Formatted result
     */
    format: function(object) {
        var s = [], i = 0;
    
        for (; i < this._segments.length; i++) {
            s.push(this._segments[i].format(object));
        }
        return s.join("");
    },

    
    /**
     * Parses the given string according to this format's pattern and returns
     * an object.
     * Note:
     * The default implementation of this method assumes that the sub-class
     * has implemented the _createParseObject method.
     * @method parse
     * @for Date.__BaseFormat
     * @param {String} s The string to be parsed
     * @param {Number} [pp=0] Parse position. String will only be read from here
     */
    parse: function(s, pp) {
        var object = this._createParseObject(),
            index = pp || 0,
            i = 0;
        for (; i < this._segments.length; i++) {
            index = this._segments[i].parse(object, s, index);
        }
        
        if (index < s.length) {
            Y.error("Parse Error: Input too long");
        }
        return object;
    },
    
    /**
     * Creates the object that is initialized by parsing. For internal use only.
     * Note:
     * This must be implemented by sub-classes.
     * @method _createParseObject
     * @private
     * //return {Object}
     */
    _createParseObject: function(/*s*/) {
        Y.error("Not implemented");
    }
});

//
// Segment class
//

/**
 * Segments in the pattern to be formatted
 * @class __BaseFormat.Segment
 * @for __BaseFormat
 * @namespace Date
 * @private
 * @constructor
 * @param {Format} format The format object that created this segment
 * @param {String} s String representing this segment
 */
Format.Segment = function(format, s) {
    if( !format && !s ) { return; }
    this._parent = format;
    this._s = s;
};

Y.mix(Format.Segment.prototype, {
    /**
     * Formats the object. Will be overridden in most subclasses.
     * @method format
     * //param o The object to format
     * @return {String} Formatted result
     */
    format: function(/*o*/) {
        return this._s;
    },

    /**
     * Parses the string at the given index, initializes the parse object
     * (as appropriate), and returns the new index within the string for
     * the next parsing step.
     *
     * Note:
     * This method must be implemented by sub-classes.
     *
     * @method parse
     * //param o     {Object} The parse object to be initialized.
     * //param s     {String} The input string to be parsed.
     * //param index {Number} The index within the string to start parsing.
     * //return The parsed result.
     */
    parse: function(/*o, s, index*/) {
        Y.error("Not implemented");
    },

    /**
     * Return the parent Format object
     * @method getFormat
     * @return {Date.__BaseFormat}
     */
    getFormat: function() {
        return this._parent;
    }
});

Y.mix(Format.Segment, {
    /**
     * Parse literal string that matches the pattern
     * @method _parseLiteral
     * @static
     * @private
     * @param {String} literal The pattern that literal should match
     * @param {String} s The literal to be parsed
     * @param {Number} index The position in s where literal is expected to start from
     * @return {Number} Last position read in s. This is used to continue parsing from the end of the literal.
     */
    _parseLiteral: function(literal, s, index) {
        if (s.length - index < literal.length) {
            Y.error("Parse Error: Input too short");
        }
        for (var i = 0; i < literal.length; i++) {
            if (literal.charAt(i) !== s.charAt(index + i)) {
                Y.error("Parse Error: Input does not match");
            }
        }
        return index + literal.length;
    },
    
    /**
     * Parses an integer at the offset of the given string and calls a
     * method on the specified object.
     *
     * @method _parseInt
     * @private
     *
     * @param o           {Object}   The target object.
     * @param f           {function|String} The method to call on the target object.
     *                               If this parameter is a string, then it is used
     *                               as the name of the property to set on the
     *                               target object.
     * @param adjust      {Number}   The numeric adjustment to make on the
     *                               value before calling the object method.
     * @param s           {String}   The string to parse.
     * @param index       {Number}   The index within the string to start parsing.
     * @param fixedlen    {Number}   If specified, specifies the required number
     *                               of digits to be parsed.
     * @param [radix=10]  {Number}   Specifies the radix of the parse string.
     * @return {Number}   The position where the parsed number was found
     */
    _parseInt: function(o, f, adjust, s, index, fixedlen, radix) {
        var len = fixedlen || s.length - index,
            head = index,
            i = 0,
            tail, value, target;
        for (; i < len; i++) {
            if (!s.charAt(index++).match(/\d/)) {
                index--;
                break;
            }
        }
        tail = index;
        if (head === tail) {
            Y.error("Error parsing number. Number not present");
        }
        if (fixedlen && tail - head !== fixedlen) {
            Y.error("Error parsing number. Number too short");
        }
        value = parseInt(s.substring(head, tail), radix || 10);
        if (f) {
            target = o || Y.config.win;
            if (typeof f === "function") {
                f.call(target, value + adjust);
            }
            else {
                target[f] = value + adjust;
            }
        }
        return tail;
    }
});

//
// Text segment class
//

/**
 * Text segment in the pattern.
 * @class __BaseFormat.TextSegment
 * @for __BaseFormat
 * @namespace Date
 * @extends Segment
 * @constructor
 * @param {Format} format The parent Format object
 * @param {String} s The pattern representing this segment
 */
Format.TextSegment = function(format, s) {
    if (!format && !s) { return; }
    Format.TextSegment.superclass.constructor.call(this, format, s);
};

Y.extend(Format.TextSegment, Format.Segment);

Y.mix(Format.TextSegment.prototype, {
    /**
     * String representation of the class
     * @method toString
     * @private
     * @return {String}
     */
    toString: function() {
        return "text: \""+this._s+'"';
    },

    /**
     * Parse an object according to the pattern
     * @method parse
     * @param o The parse object. Not used here. This is only used in more complex segment types
     * @param s {String} The string being parsed
     * @param index {Number} The index in s to start parsing from
     * @return {Number} Last position read in s. This is used to continue parsing from the end of the literal.
     */
    parse: function(o, s, index) {
        return Format.Segment._parseLiteral(this._s, s, index);
    }
}, true);
/*
 * Copyright 2012 Yahoo! Inc. All Rights Reserved. Based on code owned by VMWare, Inc.
 */

/**
 * This module provides absolute/relative date and time formatting, as well as duration formatting
 * Applications can choose date, time, and time zone components separately.
 * For dates, relative descriptions (English "yesterday", German "vorgestern", Japanese "後天") are also supported.
 *
 * This module uses a few modified parts of zimbra AjxFormat to handle dates and time.
 *
 * Absolute formats use the default calendar specified in CLDR for each locale.
 * Currently this means the Buddhist calendar for Thailand; the Gregorian calendar for all other countries.
 * However, you can specify other calendars using language subtags;
 * for example, for Thai the Gregorian calendar can be specified as th-TH-u-ca-gregory.
 *
 * Relative time formats only support times in the past. It can represent times like "1 hour 5 minutes ago"
 *
 * @module datatype-date-advanced-format
 * @requires datatype-date-timezone, datatype-date-format, datatype-number-advanced-format
 */

Format = Y.Date.__BaseFormat;

ShortNames = {
        "weekdayMonShort":"M",
        "weekdayTueShort":"T",
        "weekdayWedShort":"W",
        "weekdayThuShort":"T",
        "weekdayFriShort":"F",
        "weekdaySatShort":"S",
        "weekdaySunShort":"S",
        "monthJanShort":"J",
        "monthFebShort":"F",
        "monthMarShort":"M",
        "monthAprShort":"A",
        "monthMayShort":"M",
        "monthJunShort":"J",
        "monthJulShort":"J",
        "monthAugShort":"A",
        "monthSepShort":"S",
        "monthOctShort":"O",
        "monthNovShort":"N",
        "monthDecShort":"D"
};
    
//
// Date format class
//

/**
 * The DateFormat class formats Date objects according to a specified pattern.
 * The patterns are defined the same as the SimpleDateFormat class in the Java libraries.
 *
 * Note:
 * The date format differs from the Java patterns a few ways: the pattern
 * "EEEEE" (5 'E's) denotes a <em>short</em> weekday and the pattern "MMMMM"
 * (5 'M's) denotes a <em>short</em> month name. This matches the extended
 * pattern found in the Common Locale Data Repository (CLDR) found at:
 * http://www.unicode.org/cldr/.
 *
 * @class __zDateFormat
 * @extends Number.__BaseFormat
 * @namespace Date
 * @private
 * @constructor
 * @param pattern {String} The pattern to format date in
 * @param formats {Object} Locale specific data
 * @param timeZoneId {String} Timezone Id according to Olson tz database
 */
Y.Date.__zDateFormat = function(pattern, formats, timeZoneId) {
    DateFormat.superclass.constructor.call(this, pattern, formats);
    this.timeZone = new Y.Date.Timezone(timeZoneId);
        
    if (pattern === null) {
        return;
    }
    var head, tail, segment, i, c, count, field;
    for (i = 0; i < pattern.length; i++) {
        // literal
        c = pattern.charAt(i);
        if (c === "'") {
            head = i + 1;
            for (i++ ; i < pattern.length; i++) {
                c = pattern.charAt(i);
                if (c === "'") {
                    if (i + 1 < pattern.length && pattern.charAt(i + 1) === "'") {
                        pattern = pattern.substr(0, i) + pattern.substr(i + 1);
                    }
                    else {
                        break;
                    }
                }
            }
            if (i === pattern.length) {
		Y.error("unterminated string literal");
            }
            tail = i;
            segment = new Format.TextSegment(this, pattern.substring(head, tail));
            this._segments.push(segment);
            continue;
        }

        // non-meta chars
        head = i;
        while(i < pattern.length) {
            c = pattern.charAt(i);
            if (DateFormat._META_CHARS.indexOf(c) !== -1 || c === "'") {
                break;
            }
            i++;
        }
        tail = i;
        if (head !== tail) {
            segment = new Format.TextSegment(this, pattern.substring(head, tail));
            this._segments.push(segment);
            i--;
            continue;
        }
		
        // meta char
        head = i;
        while(++i < pattern.length) {
            if (pattern.charAt(i) !== c) {
                break;
            }
        }
        tail = i--;
        count = tail - head;
        field = pattern.substr(head, count);
        segment = null;
        switch (c) {
            case 'G':
                segment = new DateFormat.EraSegment(this, field);
                break;
            case 'y':
                segment = new DateFormat.YearSegment(this, field);
                break;
            case 'M':
                segment = new DateFormat.MonthSegment(this, field);
                break;
            case 'w':
            case 'W':
                segment = new DateFormat.WeekSegment(this, field);
                break;
            case 'D':
            case 'd':
                segment = new DateFormat.DaySegment(this, field);
                break;
            case 'F':
            case 'E':
                segment = new DateFormat.WeekdaySegment(this, field);
                break;
            case 'a':
                segment = new DateFormat.AmPmSegment(this, field);
                break;
            case 'H':
            case 'k':
            case 'K':
            case 'h':
                segment = new DateFormat.HourSegment(this, field);
                break;
            case 'm':
                segment = new DateFormat.MinuteSegment(this, field);
                break;
            case 's':
            case 'S':
                segment = new DateFormat.SecondSegment(this, field);
                break;
            case 'z':
            case 'Z':
                segment = new DateFormat.TimezoneSegment(this, field);
                break;
        }
        if (segment !== null) {
            segment._index = this._segments.length;
            this._segments.push(segment);
        }
    }
};

DateFormat = Y.Date.__zDateFormat;
Y.extend(DateFormat, Format);

// Constants

Y.mix(DateFormat, {
	SHORT: 0,
	MEDIUM: 1,
	LONG: 2,
	DEFAULT: 1,
	_META_CHARS: "GyMwWDdFEaHkKhmsSzZ"
});

/**
 * Format the date
 * @method format
 * @param object {Date} The date to be formatted
 * @param [relative=false] {Boolean} Whether relative dates should be used.
 * @return {String} Formatted result
 */
DateFormat.prototype.format = function(object, relative) {
    var useRelative = false,
        s = [],
        datePattern = false,
        i;

    if(relative !== null && relative !== "") {
        useRelative = true;
    }

    for (i = 0; i < this._segments.length; i++) {
        //Mark datePattern sections in case of relative dates
        if(this._segments[i].toString().indexOf("text: \"<datePattern>\"") === 0) {
            if(useRelative) {
                s.push(relative);
            }
            datePattern = true;
            continue;
        }
        if(this._segments[i].toString().indexOf("text: \"</datePattern>\"") === 0) {
            datePattern = false;
            continue;
        }
        if(!datePattern || !useRelative) {
            s.push(this._segments[i].format(object));
        }
    }
    return s.join("");
};

//
// Date segment class
//

/**
 * Date Segment in the pattern
 * @class DateSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends Number.__BaseFormat.Segment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object.
 * @param s {String} The pattern representing the segment
 */
DateFormat.DateSegment = function(format, s) {
    DateFormat.DateSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.DateSegment, Format.Segment);

//
// Date era segment class
//

/**
 * Era Segment in the pattern
 * @class EraSegment
 * @for Date.__DateFormat
 * @namespace Date.__DateFormat
 * @extends DateSegment
 * @private
 * @constructor
 * @param format {Date.__DateFormat} The parent Format object.
 * @param s {String} The pattern representing the segment
 */
DateFormat.EraSegment = function(format, s) {
    DateFormat.EraSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.EraSegment, DateFormat.DateSegment);

/**
 * Format date and get the era segment. Currently it only supports the current era, and will always return localized representation of AD
 * @method format
 * //param date {Date} The date to be formatted
 * @return {String} Formatted result
 */
DateFormat.EraSegment.prototype.format = function(/*date*/) {
    // NOTE: Only support current era at the moment...
    return this.getFormat().AD;
};

//
// Date year segment class
//

/**
 * Year Segment in the pattern
 * @class YearSegment
 * @namespace Date.__DateFormat
 * @for Date.__DateFormat
 * @extends DateSegment
 * @private
 * @constructor
 * @param format {Date.__DateFormat} The parent Format object.
 * @param s {String} The pattern representing the segment
 */
DateFormat.YearSegment = function(format, s) {
    DateFormat.YearSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.YearSegment, DateFormat.DateSegment);

Y.mix(DateFormat.YearSegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "dateYear: \""+this._s+'"';
    },

    /**
     * Format date and get the year segment.
     * @method format
     * @param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(date) {
        var year = String(date.getFullYear());
        return this._s.length !== 1 && this._s.length < 4 ? year.substr(year.length - 2) : Y.Date._zeroPad(year, this._s.length);
    }
}, true);

//
// Date month segment class
//

/**
 * Month Segment in the pattern
 * @class MonthSegment
 * @namepspace Date.__DateFormat
 * @for Date.__DateFormat
 * @extends DateSegment
 * @private
 * @constructor
 * @param format {Date.__DateFormat} The parent Format object.
 * @param s {String} The pattern representing the segment
 */
DateFormat.MonthSegment = function(format, s) {
    DateFormat.MonthSegment.superclass.constructor.call(this, format, s);
    this.initialize();
};
Y.extend(DateFormat.MonthSegment, DateFormat.DateSegment);

Y.mix(DateFormat.MonthSegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "dateMonth: \""+this._s+'"';
    },

    /**
     * Initialize with locale specific data.
     * @method initialize
     */
    initialize: function() {
        DateFormat.MonthSegment.MONTHS = {};
        DateFormat.MonthSegment.MONTHS[DateFormat.SHORT] = [
            ShortNames.monthJanShort,ShortNames.monthFebShort,ShortNames.monthMarShort,
            ShortNames.monthAprShort,ShortNames.monthMayShort,ShortNames.monthJunShort,
            ShortNames.monthJulShort,ShortNames.monthAugShort,ShortNames.monthSepShort,
            ShortNames.monthOctShort,ShortNames.monthNovShort,ShortNames.monthDecShort
        ];

        var Formats = this.getFormat().Formats;
        DateFormat.MonthSegment.MONTHS[DateFormat.MEDIUM] = [
            Formats.monthJanMedium, Formats.monthFebMedium, Formats.monthMarMedium,
            Formats.monthAprMedium, Formats.monthMayMedium, Formats.monthJunMedium,
            Formats.monthJulMedium, Formats.monthAugMedium, Formats.monthSepMedium,
            Formats.monthOctMedium, Formats.monthNovMedium, Formats.monthDecMedium
        ];
        DateFormat.MonthSegment.MONTHS[DateFormat.LONG] = [
            Formats.monthJanLong, Formats.monthFebLong, Formats.monthMarLong,
            Formats.monthAprLong, Formats.monthMayLong, Formats.monthJunLong,
            Formats.monthJulLong, Formats.monthAugLong, Formats.monthSepLong,
            Formats.monthOctLong, Formats.monthNovLong, Formats.monthDecLong
        ];
    },

    /**
     * Format date and get the month segment.
     * @method format
     * @param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(date) {
        var month = date.getMonth();
        switch (this._s.length) {
            case 1:
                return String(month + 1);
            case 2:
                return Y.Date._zeroPad(month + 1, 2);
            case 3:
                return DateFormat.MonthSegment.MONTHS[DateFormat.MEDIUM][month];
            case 5:
                return DateFormat.MonthSegment.MONTHS[DateFormat.SHORT][month];
        }
        return DateFormat.MonthSegment.MONTHS[DateFormat.LONG][month];
    }
}, true);

//
// Date week segment class
//

/**
 * Week Segment in the pattern
 * @class WeekSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends DateSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object. Here it would be of type DateFormat (which extends Format)
 * @param s {String} The pattern representing the segment
 */
DateFormat.WeekSegment = function(format, s) {
    DateFormat.WeekSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.WeekSegment, DateFormat.DateSegment);

/**
 * Format date and get the week segment.
 * @method format
 * @param date {Date} The date to be formatted
 * @return {String} Formatted result
 */
DateFormat.WeekSegment.prototype.format = function(date) {
    var year = date.getYear(),
        month = date.getMonth(),
        day = date.getDate(),
	ofYear = /w/.test(this._s),
        date2 = new Date(year, ofYear ? 0 : month, 1),
        week = 0;
    while (true) {
        week++;
        if (date2.getMonth() > month || (date2.getMonth() === month && date2.getDate() >= day)) {
            break;
        }
        date2.setDate(date2.getDate() + 7);
    }

    return Y.Date._zeroPad(week, this._s.length);
};

//
// Date day segment class
//

/**
 * Day Segment in the pattern
 * @class DaySegment
 * @namespace Date.__zDateFormat
 * @extends DateSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.DaySegment = function(format, s) {
    DateFormat.DaySegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.DaySegment, DateFormat.DateSegment);

/**
 * Format date and get the day segment.
 * @method format
 * @param date {Date} The date to be formatted
 * @return {String} Formatted result
 */
DateFormat.DaySegment.prototype.format = function(date) {
    var month = date.getMonth(),
        day = date.getDate(),
        year = date.getYear(),
        date2;

    if (/D/.test(this._s) && month > 0) {
        do {
            // set date to first day of month and then go back one day
            date2 = new Date(year, month, 1);
            date2.setDate(0);
			
            day += date2.getDate();
            month--;
        } while (month > 0);
    }
    return Y.Date._zeroPad(day, this._s.length);
};

//
// Date weekday segment class
//

/**
 * Weekday Segment in the pattern
 * @class WeekdaySegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends DateSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.WeekdaySegment = function(format, s) {
    DateFormat.WeekdaySegment.superclass.constructor.call(this, format, s);
    this.initialize();
};
Y.extend(DateFormat.WeekdaySegment, DateFormat.DateSegment);

Y.mix(DateFormat.WeekdaySegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "dateDay: \""+this._s+'"';
    },

    /**
     * Initialize with locale specific data.
     * @method initialize
     */
    initialize: function() {
        DateFormat.WeekdaySegment.WEEKDAYS = {};
        // NOTE: The short names aren't available in Java so we have to define them.
        DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.SHORT] = [
            ShortNames.weekdaySunShort,ShortNames.weekdayMonShort,ShortNames.weekdayTueShort,
            ShortNames.weekdayWedShort,ShortNames.weekdayThuShort,ShortNames.weekdayFriShort,
            ShortNames.weekdaySatShort
        ];

        var Formats = this.getFormat().Formats;
        DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.MEDIUM] = [
            Formats.weekdaySunMedium, Formats.weekdayMonMedium, Formats.weekdayTueMedium,
            Formats.weekdayWedMedium, Formats.weekdayThuMedium, Formats.weekdayFriMedium,
            Formats.weekdaySatMedium
        ];
        DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.LONG] = [
            Formats.weekdaySunLong, Formats.weekdayMonLong, Formats.weekdayTueLong,
            Formats.weekdayWedLong, Formats.weekdayThuLong, Formats.weekdayFriLong,
            Formats.weekdaySatLong
        ];
    },

    /**
     * Format date and get the weekday segment.
     * @method format
     * @param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(date) {
        var weekday = date.getDay(),
            style;
        if (/E/.test(this._s)) {
            switch (this._s.length) {
                case 4:
                    style = DateFormat.LONG;
                    break;
                case 5:
                    style = DateFormat.SHORT;
                    break;
                default:
                    style = DateFormat.MEDIUM;
            }
            return DateFormat.WeekdaySegment.WEEKDAYS[style][weekday];
        }
        return Y.Date._zeroPad(weekday, this._s.length);
    }
}, true);

//
// Time segment class
//

/**
 * Time Segment in the pattern
 * @class TimeSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends Number.__BaseFormat.Segment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.TimeSegment = function(format, s) {
    DateFormat.TimeSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.TimeSegment, Y.Date.__BaseFormat.Segment);

//
// Time hour segment class
//

/**
 * Hour Segment in the pattern
 * @class HourSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends TimeSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.HourSegment = function(format, s) {
    DateFormat.HourSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.HourSegment, DateFormat.TimeSegment);

Y.mix(DateFormat.HourSegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "timeHour: \""+this._s+'"';
    },

    /**
     * Format date and get the hour segment.
     * @method format
     * @param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(date) {
        var hours = date.getHours();
        if (hours > 12 && /[hK]/.test(this._s)) {
            hours -= 12;
        }
        else if (hours === 0 && /[h]/.test(this._s)) {
            hours = 12;
        }
        /***
            // NOTE: This is commented out to match the Java formatter output
            //       but from the comments for these meta-chars, it doesn't
            //       seem right.
            if (/[Hk]/.test(this._s)) {
                hours--;
            }
        /***/
        return Y.Date._zeroPad(hours, this._s.length);
    }
}, true);

//
// Time minute segment class
//

/**
 * Minute Segment in the pattern
 * @class MinuteSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends TimeSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.MinuteSegment = function(format, s) {
    DateFormat.MinuteSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.MinuteSegment, DateFormat.TimeSegment);

Y.mix(DateFormat.MinuteSegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "timeMinute: \""+this._s+'"';
    },

    /**
     * Format date and get the minute segment.
     * @method format
     * @param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(date) {
        var minutes = date.getMinutes();
        return Y.Date._zeroPad(minutes, this._s.length);
    }
}, true);

//
// Time second segment class
//

/**
 * Second Segment in the pattern
 * @class SecondSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends TimeSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.SecondSegment = function(format, s) {
    DateFormat.SecondSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.SecondSegment, DateFormat.TimeSegment);

/**
 * Format date and get the second segment.
 * @method format
 * @param date {Date} The date to be formatted
 * @return {String} Formatted result
 */
DateFormat.SecondSegment.prototype.format = function(date) {
    var minutes = /s/.test(this._s) ? date.getSeconds() : date.getMilliseconds();
    return Y.Date._zeroPad(minutes, this._s.length);
};

//
// Time am/pm segment class
//

/**
 * AM/PM Segment in the pattern
 * @class AmPmSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends TimeSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object. Here it would be of type DateFormat (which extends Format)
 * @param s {String} The pattern representing the segment
 */
DateFormat.AmPmSegment = function(format, s) {
    DateFormat.AmPmSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.AmPmSegment, DateFormat.TimeSegment);

Y.mix(DateFormat.AmPmSegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "timeAmPm: \""+this._s+'"';
    },

    /**
     * Format date and get the AM/PM segment.
     * @method format
     * @param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(date) {
        var hours = date.getHours();
        return hours < 12 ? this.getFormat().Formats.periodAm : this.getFormat().Formats.periodPm;
    }
}, true);

//
// Time timezone segment class
//

/**
 * TimeZone Segment in the pattern
 * @class TimezoneSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends TimeSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.TimezoneSegment = function(format, s) {
    DateFormat.TimezoneSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.TimezoneSegment, DateFormat.TimeSegment);

Y.mix(DateFormat.TimezoneSegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "timeTimezone: \""+this._s+'"';
    },

    /**
     * Format date and get the timezone segment.
     * @method format
     * //param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(/*date*/) {
        var timeZone = this.getFormat().timeZone;
        if (/Z/.test(this._s)) {
            return timeZone.getShortName();
        }
        return this._s.length < 4 ? timeZone.getMediumName() : timeZone.getLongName();
    }
}, true);
    
//
// Non-Gregorian Calendars
//

/*
 * Buddhist Calendar. This is normally used only for Thai locales (th).
 * @class __BuddhistDateFormat
 * @namespace Date
 * @extends __zDateFormat
 * @constructor
 * @private
 * @param pattern {String} The pattern to format date in
 * @param formats {Object} Locale specific data
 * @param timeZoneId {String} Timezone Id according to Olson tz database
 */
Y.Date.__BuddhistDateFormat = function(pattern, formats, timeZoneId) {
    BuddhistDateFormat.superclass.constructor.call(this, pattern, formats, timeZoneId);
        
    //Iterate through _segments, and replace the ones that are different for Buddhist Calendar
    var segments = this._segments, i;
    for(i=0; i<segments.length; i++) {
        if(segments[i] instanceof DateFormat.YearSegment) {
            segments[i] = new BuddhistDateFormat.YearSegment(segments[i]);
        } else if (segments[i] instanceof DateFormat.EraSegment) {
            segments[i] = new BuddhistDateFormat.EraSegment(segments[i]);
        }
    }
};

BuddhistDateFormat = Y.Date.__BuddhistDateFormat;
Y.extend(BuddhistDateFormat, DateFormat);
    
/**
 * YearSegment class for Buddhist Calender
 * @class YearSegment
 * @namespace Date.__BuddhistDateFormat
 * @extends Date.__zDateFormat.YearSegment
 * @private
 * @constructor
 * @param segment {Date.__zDateFormat.YearSegment}
 */
BuddhistDateFormat.YearSegment = function(segment) {
    BuddhistDateFormat.YearSegment.superclass.constructor.call(this, segment._parent, segment._s);
};

Y.extend(BuddhistDateFormat.YearSegment, DateFormat.YearSegment);

/**
 * Format date and get the year segment.
 * @method format
 * @param date {Date} The date to be formatted
 * @return {String} Formatted result
 */
BuddhistDateFormat.YearSegment.prototype.format = function(date) {
    var year = date.getFullYear();
    year = String(year + 543);      //Buddhist Calendar epoch is in 543 BC
    return this._s.length !== 1 && this._s.length < 4 ? year.substr(year.length - 2) : Y.Date._zeroPad(year, this._s.length);
};
    
/**
 * EraSegment class for Buddhist Calender
 * @class EraSegment
 * @for Date.__BuddhistDateFormat
 * @namespace Date.__BuddhistDateFormat
 * @extends Date.__zDateFormat.EraSegment
 * @private
 * @constructor
 * @param segment {Date.__zDateFormat.EraSegment}
 */
BuddhistDateFormat.EraSegment = function(segment) {
    BuddhistDateFormat.EraSegment.superclass.constructor.call(this, segment._parent, segment._s);
};

Y.extend(BuddhistDateFormat.EraSegment, DateFormat.EraSegment);

/**
 * Format date and get the era segment.
 * @method format
 * //param date {Date} The date to be formatted
 * @return {String} Formatted result
 */
BuddhistDateFormat.EraSegment.prototype.format = function(/*date*/) {
    return "BE";    //Only Buddhist Era supported for now
};

/**
 * Wrapper around the zimbra-based DateFormat for use in YUI. API designed to be similar to ICU
 * @class __YDateFormat
 * namespace Date
 * @private
 * @constructor
 * @param {String} [timeZone] TZ database ID for the time zone that should be used.
 *                            If omitted, defaults to the system timezone
 * @param {Number} [dateFormat=0] Selector for the desired date format from Y.Date.DATE_FORMATS.
 * @param {Number} [timeFormat=0] Selector for the desired time format from Y.Date.TIME_FORMATS.
 * @param {Number} [timeZoneFormat=0] Selector for the desired time zone format from Y.Date.TIMEZONE_FORMATS.
 */
Y.Date.__YDateFormat = function(timeZone, dateFormat, timeFormat, timeZoneFormat) {
        
    if(timeZone === undefined || timeZone === null) {
        timeZone = Y.Date.Timezone.getTimezoneIdForOffset( new Date().getTimezoneOffset() * -60 );
    }

    this._Formats = Y.Intl.get(MODULE_NAME);
        
    //If not valid time zone
    if(!Y.Date.Timezone.isValidTimezoneId(timeZone)) {
	Y.error("Could not find timezone: " + timeZone);
    }

    this._timeZone = timeZone;
    this._timeZoneInstance = new Y.Date.Timezone(this._timeZone);

    this._dateFormat = dateFormat || 0;
    this._timeFormat = timeFormat || 0;
    this._timeZoneFormat = timeZoneFormat || 0;

    this._relative = false;
    this._pattern = this._generatePattern();

    var locale = Y.Intl.getLang(MODULE_NAME);
        
    if(locale.match(/^th/) && !locale.match(/u-ca-gregory/)) {
        //Use buddhist calendar
        this._dateFormatInstance = new BuddhistDateFormat(this._pattern, this._Formats, this._timeZone);
    } else {
        //Use gregorian calendar
        this._dateFormatInstance = new DateFormat(this._pattern, this._Formats, this._timeZone);
    }
};

YDateFormat = Y.Date.__YDateFormat;

Y.mix(Y.Date, {
    /**
     * Date Format Style values to use during format/parse
     * @property DATE_FORMATS
     * @type Object
     * @static
     * @final
     * @for Date
     */
    DATE_FORMATS: {
        NONE: 0,
        WYMD_LONG: 1,
        WYMD_ABBREVIATED: 4,
        WYMD_SHORT: 8,
        WMD_LONG: 16,
        WMD_ABBREVIATED: 32,
        WMD_SHORT: 64,
        YMD_LONG: 128,
        YMD_ABBREVIATED: 256,
        YMD_SHORT: 512,
        YM_LONG: 1024,
        MD_LONG: 2048,
        MD_ABBREVIATED: 4096,
        MD_SHORT: 8192,
        W_LONG: 16384,
        W_ABBREVIATED: 32768,
        M_LONG: 65536,
        M_ABBREVIATED: 131072,
        YMD_FULL: 262144,
        RELATIVE_DATE: 524288
    },

    /**
     * Time Format Style values to use during format/parse
     * @property TIME_FORMATS
     * @type Object
     * @static
     * @final
     * @for Date
     */
    TIME_FORMATS: {
        NONE: 0,
        HM_ABBREVIATED: 1,
        HM_SHORT: 2,
        H_ABBREVIATED: 4
    },

    /**
     * Timezone Format Style values to use during format/parse
     * @property TIMEZONE_FORMATS
     * @type Object
     * @static
     * @final
     * @for Date
     */
    TIMEZONE_FORMATS: {
        NONE: 0,
        Z_ABBREVIATED: 1,
        Z_SHORT: 2
    }
});

Y.mix(YDateFormat.prototype, {
    /**
     * Generate date pattern for selected format. For internal use only.
     * @method _generateDatePattern
     * @for Date.__YDateFormat
     * @private
     * @return {String} Date pattern
     */
    _generateDatePattern: function() {
        var format = this._dateFormat;
        if(format && Y.Lang.isString(format)) {
            format = Y.Date.DATE_FORMATS[format];
        }
    
        if(format === null) { return ""; }
        /*jshint bitwise: false*/
        if(format & Y.Date.DATE_FORMATS.RELATIVE_DATE) {
            this._relative = true;
            format = format ^ Y.Date.DATE_FORMATS.RELATIVE_DATE;
        }
        /*jshint bitwise: true*/
        switch(format) {
            //Use relative only for formats with day component
            case Y.Date.DATE_FORMATS.NONE:
                this._relative = false;
                return "";
            case Y.Date.DATE_FORMATS.WYMD_LONG:
                return this._Formats.WYMD_long;
            case Y.Date.DATE_FORMATS.WYMD_ABBREVIATED:
                return this._Formats.WYMD_abbreviated;
            case Y.Date.DATE_FORMATS.WYMD_SHORT:
                return this._Formats.WYMD_short;
            case Y.Date.DATE_FORMATS.WMD_LONG:
                return this._Formats.WMD_long;
            case Y.Date.DATE_FORMATS.WMD_ABBREVIATED:
                return this._Formats.WMD_abbreviated;
            case Y.Date.DATE_FORMATS.WMD_SHORT:
                return this._Formats.WMD_short;
            case Y.Date.DATE_FORMATS.YMD_LONG:
                return this._Formats.YMD_long;
            case Y.Date.DATE_FORMATS.YMD_ABBREVIATED:
                return this._Formats.YMD_abbreviated;
            case Y.Date.DATE_FORMATS.YMD_SHORT:
                return this._Formats.YMD_short;
            case Y.Date.DATE_FORMATS.YM_LONG:
                this._relative = false;
                return this._Formats.YM_long;
            case Y.Date.DATE_FORMATS.MD_LONG:
                return this._Formats.MD_long;
            case Y.Date.DATE_FORMATS.MD_ABBREVIATED:
                return this._Formats.MD_abbreviated;
            case Y.Date.DATE_FORMATS.MD_SHORT:
                return this._Formats.MD_short;
            case Y.Date.DATE_FORMATS.W_LONG:
                this._relative = false;
                return this._Formats.W_long;
            case Y.Date.DATE_FORMATS.W_ABBREVIATED:
                this._relative = false;
                return this._Formats.W_abbreviated;
            case Y.Date.DATE_FORMATS.M_LONG:
                this._relative = false;
                return this._Formats.M_long;
            case Y.Date.DATE_FORMATS.M_ABBREVIATED:
                this._relative = false;
                return this._Formats.M_abbreviated;
            case Y.Date.DATE_FORMATS.YMD_FULL:
                return this._Formats.YMD_full;
            default:
                Y.error("Date format given does not exist");	//Error no such pattern.
        }
    },
        
    /**
     * Generate time pattern for selected format. For internal use only
     * @method _generateTimePattern
     * @private
     * @return {String} Time pattern
     */
    _generateTimePattern: function() {
        var format = this._timeFormat;
        if(format && Y.Lang.isString(format)) {
            format = Y.Date.TIME_FORMATS[format];
        }
    
        if(format === null) { return ""; }
        switch(format) {
            case Y.Date.TIME_FORMATS.NONE:
                return "";
            case Y.Date.TIME_FORMATS.HM_ABBREVIATED:
                return this._Formats.HM_abbreviated;
            case Y.Date.TIME_FORMATS.HM_SHORT:
                return this._Formats.HM_short;
            case Y.Date.TIME_FORMATS.H_ABBREVIATED:
                return this._Formats.H_abbreviated;
            default:
                Y.error("Time format given does not exist");	//Error no such pattern.
        }
    },
    
    /**
     * Generate time-zone pattern for selected format. For internal use only.
     * @method _generateTimeZonePattern
     * @private
     * @return {String} Time-Zone pattern
     */
    _generateTimeZonePattern: function() {
        var format = this._timeZoneFormat;
        if(format && Y.Lang.isString(format)) {
            format = Y.Date.TIMEZONE_FORMATS[format];
        }
    
        if(format === null) { return ""; }
        switch(format) {
            case Y.Date.TIMEZONE_FORMATS.NONE:
                return "";
            case Y.Date.TIMEZONE_FORMATS.Z_ABBREVIATED:
                return "z";
            case Y.Date.TIMEZONE_FORMATS.Z_SHORT:
                return "Z";
            default:
                Y.error("Time Zone format given does not exist");	//Error no such pattern.
        }
    },
    
    /**
     * Generate pattern for selected date, time and time-zone formats. For internal use only
     * @method _generatePattern
     * @private
     * @return {String} Combined pattern for date, time and time-zone
     */
    _generatePattern: function() {
        var datePattern = this._generateDatePattern(),
            timePattern = this._generateTimePattern(),
            timeZonePattern = this._generateTimeZonePattern(),
            pattern = "";

        //Combine patterns. Mark date pattern part, to use with relative dates.
        if(datePattern !== "") {
            datePattern = "'<datePattern>'" + datePattern + "'</datePattern>'";
        }
        
        if(timePattern !== "" && timeZonePattern !== "") {
            pattern = this._Formats.DateTimeTimezoneCombination;
        } else if (timePattern !== "") {
            pattern = this._Formats.DateTimeCombination;
        } else if(timeZonePattern !== "") {
            pattern = this._Formats.DateTimezoneCombination;
        } else if(datePattern !== ""){
            //Just date
            pattern = "{1}";
        }
        
        pattern = pattern.replace("{0}", timePattern).replace("{1}", datePattern).replace("{2}", timeZonePattern);
        
        //Remove unnecessary whitespaces
        pattern = Y.Lang.trim(pattern.replace(/\s\s+/g, " "));

        return pattern;
    },

    /**
     * Formats a date
     * @method format
     * @param {Date} date The date to be formatted.
     * @return {String} The formatted string
     */
    format: function(date) {
        if(date === null || !Y.Lang.isDate(date)) {
            Y.error("format called without a date.");
        }
        
        var offset = this._timeZoneInstance.getRawOffset() * 1000,
            relativeDate = null,
            today = new Date(),
            tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000),
            yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + offset);

        if(this._relative) {
            if(date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()) {
                relativeDate = this._Formats.today;
            }

            if(date.getFullYear() === tomorrow.getFullYear() && date.getMonth() === tomorrow.getMonth() && date.getDate() === tomorrow.getDate()) {
                relativeDate = this._Formats.tomorrow;
            }

            if(date.getFullYear() === yesterday.getFullYear() && date.getMonth() === yesterday.getMonth() && date.getDate() === yesterday.getDate()) {
                relativeDate = this._Formats.yesterday;
            }
        }

        return this._dateFormatInstance.format(date, relativeDate);
    }
}, true);
/**
 * YRelativeTimeFormat class provides localized formatting of relative time values such as "3 minutes ago".
 * Relative time formats supported are defined by how many units they may include.
 * Relative time is only used for past events. The Relative time formats use appropriate singular/plural/paucal/etc. forms for all languages.
 * In order to keep relative time formats independent of time zones, relative day names such as today, yesterday, or tomorrow are not used.
 */

/**
 * Class to handle relative time formatting
 * @class __YRelativeTimeFormat
 * @namespace Date
 * @private
 * @constructor
 * @param [style='ONE_UNIT_LONG'] {Number|String} Selector for the desired relative time format. Should be key/value from Y.Date.RELATIVE_TIME_FORMATS
 */
Y.Date.__YRelativeTimeFormat = function(style) {
    if(style === null) {
        style = Y.Date.RELATIVE_TIME_FORMATS.ONE_UNIT_LONG;
    } else if(Y.Lang.isString(style)) {
        style = Y.Date.RELATIVE_TIME_FORMATS[style];
    }
        
    this.patterns = Y.Intl.get(MODULE_NAME);
    this.style = style;
		
    switch(style) {
        case Y.Date.RELATIVE_TIME_FORMATS.ONE_OR_TWO_UNITS_ABBREVIATED:
            this.numUnits = 2;
            this.abbr = true;
            break;
        case Y.Date.RELATIVE_TIME_FORMATS.ONE_OR_TWO_UNITS_LONG:
            this.numUnits = 2;
            this.abbr = false;
            break;
        case Y.Date.RELATIVE_TIME_FORMATS.ONE_UNIT_ABBREVIATED:
            this.numUnits = 1;
            this.abbr = true;
            break;
        case Y.Date.RELATIVE_TIME_FORMATS.ONE_UNIT_LONG:
            this.numUnits = 1;
            this.abbr = false;
            break;
        default:
            Y.error("Unknown style: Use a style from Y.Date.RELATIVE_TIME_FORMATS");
    }
};

YRelativeTimeFormat = Y.Date.__YRelativeTimeFormat;

Y.mix(Y.Date, {
    /**
     * Returns the current date. Used to calculate relative time. Change this parameter if you require comparison with different time.
     * @property
     * @type Number|function
     * @static
     */
    currentDate: function() { return new Date(); },

    /**
     * Format Style values to use during format/parse
     * @property RELATIVE_TIME_FORMATS
     * @type Object
     * @static
     * @final
     * @for Date
     */
    RELATIVE_TIME_FORMATS: {
        ONE_OR_TWO_UNITS_ABBREVIATED: 0,
        ONE_OR_TWO_UNITS_LONG: 1,
        ONE_UNIT_ABBREVIATED: 2,
        ONE_UNIT_LONG: 4
    }
});
	
/**
 * Formats a time value.
 * @method format
 * @for Date.__YRelativeTimeFormat
 * @param {Number} timeValue The time value (seconds since Epoch) to be formatted.
 * @param {Number} [relativeTo=Current Time] The time value (seconds since Epoch) in relation to which timeValue should be formatted.
          It must be greater than or equal to timeValue
 * @return {String} The formatted string
 */
YRelativeTimeFormat.prototype.format = function(timeValue, relativeTo) {
    if(relativeTo === null) {
        relativeTo = (new Date()).getTime()/1000;
        if(timeValue > relativeTo) {
            Y.error("timeValue must be in the past");
        }
    } else if(timeValue > relativeTo) {
        Y.error("relativeTo must be greater than or equal to timeValue");
    }

    var date = new Date((relativeTo - timeValue)*1000),
        result = [],
        numUnits = this.numUnits,
        value = date.getUTCFullYear() - 1970,	//Need zero-based index
        text, pattern, i;
        
    if(value > 0) {
        if(this.abbr) {
            text = value + " " + (value !== 1 ? this.patterns.years_abbr : this.patterns.year_abbr);
            result.push(text);
        } else {
            text = value + " " + (value !== 1 ? this.patterns.years : this.patterns.year);
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCMonth();
    if((numUnits > 0) && (numUnits < this.numUnits || value > 0)) {
        if(this.abbr) {
            text = value + " " + (value !== 1 ? this.patterns.months_abbr : this.patterns.month_abbr);
            result.push(text);
        } else {
            text = value + " " + (value !== 1 ? this.patterns.months : this.patterns.month);
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCDate()-1;			//Need zero-based index
    if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {
        if(this.abbr) {
            text = value + " " + (value !== 1 ? this.patterns.days_abbr : this.patterns.day_abbr);
            result.push(text);
        } else {
            text = value + " " + (value !== 1 ? this.patterns.days : this.patterns.day);
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCHours();
    if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {
        if(this.abbr) {
            text = value + " " + (value !== 1 ? this.patterns.hours_abbr : this.patterns.hour_abbr);
            result.push(text);
        } else {
            text = value + " " + (value !== 1 ? this.patterns.hours : this.patterns.hour);
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCMinutes();
    if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {
        if(this.abbr) {
            text = value + " " + (value !== 1 ? this.patterns.minutes_abbr : this.patterns.minute_abbr);
            result.push(text);
        } else {
            text = value + " " + (value !== 1 ? this.patterns.minutes : this.patterns.minute);
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCSeconds();
    if(result.length === 0 || (numUnits > 0 && (numUnits < this.numUnits || value > 0))) {
        if(this.abbr) {
            text = value + " " + (value !== 1 ? this.patterns.seconds_abbr : this.patterns.second_abbr);
            result.push(text);
        } else {
            text = value + " " + (value !== 1 ? this.patterns.seconds : this.patterns.second);
            result.push(text);
        }
        numUnits--;
    }

    pattern = (result.length === 1) ? this.patterns["RelativeTime/oneUnit"] : this.patterns["RelativeTime/twoUnits"];
        
    for(i=0; i<result.length; i++) {
        pattern = pattern.replace("{" + i + "}", result[i]);
    }
    for(i=result.length; i<this.numUnits; i++) {
        pattern = pattern.replace("{" + i + "}", "");
    }
    //Remove unnecessary whitespaces
    pattern = Y.Lang.trim(pattern.replace(/\s+/g, " "));
        
    return pattern;
};
/**
 * YDurationFormat class formats time in a language independent manner.
 * The duration formats use appropriate singular/plural/paucal/etc. forms for all languages.
 */

Y.mix(Y.Date, {
    /**
     * Strip decimal part of argument and return the integer part
     * @method _stripDecimals
     * @static
     * @private
     * @for Date
     * @param floatNum A real number
     * @return Integer part of floatNum
     */
    _stripDecimals: function (floatNum) {
        return floatNum > 0 ? Math.floor(floatNum): Math.ceil(floatNum);
    }
});

/**
 * YDurationFormat class formats time in a language independent manner.
 * @class __YDurationFormat
 * @namespace Date
 * @private
 * @constructor
 * @param style {Number|String} selector for the desired duration format. Can be key/value from Y.Date.DURATION_FORMATS
 */
Y.Date.__YDurationFormat = function(style) {
    if(style && Y.Lang.isString(style)) {
        style = Y.Date.DURATION_FORMATS[style];
    }
    this.style = style;
    this.patterns = Y.Intl.get(MODULE_NAME);
};

YDurationFormat = Y.Date.__YDurationFormat;

Y.mix(Y.Date, {
    /**
     * Format Style values to use during format/parse of Duration values
     * @property DURATION_FORMATS
     * @type Object
     * @static
     * @final
     * @for Date
     */
    DURATION_FORMATS: {
        HMS_LONG: 0,
        HMS_SHORT: 1
    }
});

Y.mix(YDurationFormat, {
    /**
     * Parse XMLDurationFormat (PnYnMnDTnHnMnS) and return an object with hours, minutes and seconds
     * Any absent values are set to -1, which will be ignored in HMS_long, and set to 0 in HMS_short
     * Year, Month and Day are ignored. Only Hours, Minutes and Seconds are used
     * @method _getDuration_XML
     * @static
     * @private
     * @for Date.__YDurationFormat
     * @param {String} xmlDuration XML Duration String.
     *      The lexical representation for duration is the [ISO 8601] extended format PnYnMnDTnHnMnS,
     *      where nY represents the number of years, nM the number of months, nD the number of days,
     *      'T' is the date/time separator,
     *      nH the number of hours, nM the number of minutes and nS the number of seconds.
     *      The number of seconds can include decimal digits to arbitrary precision.
     * @return {Object} Duration as an object with the parameters hours, minutes and seconds.
     */
    _getDuration_XML: function (xmlDuration) {
        var regex = new RegExp(/P(\d+Y)?(\d+M)?(\d+D)?T(\d+H)?(\d+M)?(\d+(\.\d+)?S)/),
            matches = xmlDuration.match(regex);
        
        if(matches === null) {
            Y.error("xmlDurationFormat should be in the format: 'PnYnMnDTnHnMnS'");
        }
        
        return {
            hours: parseInt(matches[4] || -1, 10),
            minutes: parseInt(matches[5] || -1, 10),
            seconds: parseFloat(matches[6] || -1, 10)
        };
    },
    
    /**
     * Get duration from time in seconds.
     * The value should be integer value in seconds, and should not be negative.
     * @method _getDuration_Seconds
     * @static
     * @private
     * @param {Number} timeValueInSeconds Duration in seconds
     * @return {Object} Duration as an object with the parameters hours, minutes and seconds.
     */
    _getDuration_Seconds: function (timeValueInSeconds) {
        var duration = {};
        if(timeValueInSeconds < 0) {
            Y.error("TimeValue cannot be negative");
        }
                
        duration.hours = Y.Date._stripDecimals(timeValueInSeconds / 3600);
                
        timeValueInSeconds %= 3600;
        duration.minutes = Y.Date._stripDecimals(timeValueInSeconds / 60);
                
        timeValueInSeconds %= 60;
        duration.seconds = timeValueInSeconds;
        
        return duration;
    }
});
    
/**
 * Formats the given value into a duration format string.
 * For XML duration format, the string should be in the pattern PnYnMnDTnHnMnS.
 * Please note that year, month and day fields are ignored in this version.
 * For future compatibility, please do not pass Year/Month/Day in the parameter.
 *
 * For hours, minutes, and seconds, any absent or negative parts are ignored in HMS_long format,
 * but are treated as 0 in HMS_short format style.
 *
 * @method
 * @private
 * @param oDuration {String|Number|Object} Duration as time in seconds (Integer),
          XML duration format (String), or an object with hours, minutes and seconds
 * @return {String} The formatted string
 */
YDurationFormat.prototype.format = function(oDuration) {
    if(Y.Lang.isNumber(oDuration)) {
        oDuration = YDurationFormat._getDuration_Seconds(oDuration);
    } else if(Y.Lang.isString(oDuration)) {
        oDuration = YDurationFormat._getDuration_XML(oDuration);
    }
    
    var defaultValue = this.style === Y.Date.DURATION_FORMATS.HMS_LONG ? -1: 0,
        result = {
            hours: "",
            minutes: "",
            seconds: ""
        },
        resultPattern = "",
        formatNumber = function(num) { return num; };

    if(oDuration.hours === undefined || oDuration.hours === null || oDuration.hours < 0) { oDuration.hours = defaultValue; }
    if(oDuration.minutes === undefined || oDuration.minutes === null || oDuration.minutes < 0) { oDuration.minutes = defaultValue; }
    if(oDuration.seconds === undefined || oDuration.seconds === null || oDuration.seconds < 0) { oDuration.seconds = defaultValue; }
   
    //Test minutes and seconds for invalid values
    if(oDuration.minutes > 59 || oDuration.seconds > 59) {
        Y.error("Minutes and Seconds should be less than 60");
    }

    //If number format available, use it, otherwise do not format number.
    if (Y.Number !== undefined && Y.Number.format !== undefined) {
        formatNumber = function(num) { return Y.Number.format(num); };
    }
    if(this.style === Y.Date.DURATION_FORMATS.HMS_LONG) {
        resultPattern = this.patterns.HMS_long;
        if(oDuration.hours >= 0) {
            result.hours = formatNumber(oDuration.hours) + " " + (oDuration.hours === 1 ? this.patterns.hour : this.patterns.hours);
        }

        if(oDuration.minutes >= 0) {
            result.minutes = oDuration.minutes + " " + (oDuration.minutes === 1 ? this.patterns.minute : this.patterns.minutes);
        }

        if(oDuration.seconds >= 0) {
            result.seconds = oDuration.seconds + " " + (oDuration.seconds === 1 ? this.patterns.second : this.patterns.seconds);
        }
    } else {                                            //HMS_SHORT
        resultPattern = this.patterns.HMS_short;
        result = {
             hours: formatNumber(oDuration.hours),
             minutes: Y.Date._zeroPad(oDuration.minutes, 2),
             seconds: Y.Date._zeroPad(oDuration.seconds, 2)
        };
    }
        
    resultPattern = resultPattern.replace("{0}", result.hours);
    resultPattern = resultPattern.replace("{1}", result.minutes);
    resultPattern = resultPattern.replace("{2}", result.seconds);
       
    //Remove unnecessary whitespaces
    resultPattern = Y.Lang.trim(resultPattern.replace(/\s\s+/g, " "));
       
    return resultPattern;
};

Y.Date.oldFormat = Y.Date.format;

Y.mix(Y.Date, {
    /**
     * Takes a native JavaScript Date and formats it as a string for display to user. Can be configured with the oConfig parameter.
     * For relative time format, dates are compared to current time. To compare to a different time, set the parameter Y.Date.currentDate
     * Configuration object can have 4 optional parameters:
     *     [dateFormat=0] {String|Number} Date format to use. Should be a key/value from Y.Date.DATE_FORMATS.
     *     [timeFormat=0] {String|Number} Time format to use. Should be a key/value from Y.Date.TIME_FORMATS.
     *     [timezoneFormat=0] {String|Number} Timezone format to use. Should be a key/value from Y.Date.TIMEZONE_FORMATS.
     *     [relativeTimeFormat=0] {String|Number} RelativeTime format to use. Should be a key/value from Y.Date.RELATIVE_TIME_FORMATS.
     *     [format] {HTML} Format string as pattern. This is passed to the Y.Date.format method from datatype-date-format module.
                           If this parameter is used, the other three will be ignored.
     * @for Date
     * @method format
     * @param oDate {Date} Date
     * @param [oConfig] {Object} Object literal of configuration values.
     * @return {String} string representation of the date
     * @example
            var date = new Date();
            Y.Date.format(date, { timeFormat: "HM_SHORT", timezoneFormat: "Z_SHORT" });
            Y.Date.format(date, { dateFormat: "YMD_FULL", timeFormat: "HM_SHORT", timezoneFormat: "Z_SHORT" });
            Y.Date.format(date, { dateFormat: "YMD_FULL" });
            Y.Date.format(date, { relativeTimeFormat: "ONE_OR_TWO_UNITS_LONG" });
            Y.Date.format(date, { format: "%Y-%m-%d"});
     */
    format: function(oDate, oConfig) {
        oConfig = oConfig || {};
        if(oConfig.format && Y.Lang.isString(oConfig.format)) {
            return Y.Date.oldFormat(oDate, oConfig);
        }
    
        if(!Y.Lang.isDate(oDate)) {
            return Y.Lang.isValue(oDate) ? oDate : "";
        }
                
        var formatter, relativeTo;
        if(oConfig.dateFormat || oConfig.timeFormat || oConfig.timezoneFormat) {
            formatter = new YDateFormat(oConfig.timezone, oConfig.dateFormat, oConfig.timeFormat, oConfig.timezoneFormat);
            return formatter.format(oDate);
        }
    
        relativeTo = (typeof Y.Date.currentDate === 'function' ?  Y.Date.currentDate() : Y.Date.currentDate);
        if(oConfig.relativeTimeFormat) {
            formatter = new YRelativeTimeFormat(oConfig.relativeTimeFormat, relativeTo);
            return formatter.format(oDate.getTime()/1000, Y.Date.currentDate.getTime()/1000);
        }

        Y.error("Unrecognized format options.");
    },

    /**
     * Returns a string representation of the duration
     * @method format
     * @param oDuration {String|Number|Object} Duration as time in seconds, xml duration format, or an object with hours, minutes and seconds
     * @param [oConfig] {Object} Configuration object. Used to pass style parameter to the method.
                        'style' can be a string (HMS_LONG/HMS_SHORT) or the numerical values in Y.Date.DURATION_FORMATS
     * @return {String} string representation of the duration
     * @example
                Y.Date.formatDuration(3601, { style: "HMS_LONG" });
                Y.Date.formatDuration("PT11H22M33S", { style: "HMS_SHORT" });
                Y.Date.formatDuration({ hours: 1, minutes: 40 }, { style: "HMS_SHORT" });
                Y.Date.formatDuration({ hours: 1, minutes: 40, seconds: 5 }, { style: "HMS_LONG" });
     */
    formatDuration: function(oDuration, oConfig) {
        oConfig = oConfig || {};
        return new YDurationFormat(oConfig.style).format(oDuration);
    }
}, true);


}, 'gallery-2013.04.10-22-48', {
    "lang": [
        "af",
        "am",
        "ar-DZ",
        "ar-JO",
        "ar",
        "ar-LB",
        "ar-MA",
        "ar-SY",
        "ar-TN",
        "as",
        "az-Cyrl",
        "az",
        "be",
        "bg",
        "bn-IN",
        "bn",
        "bo",
        "ca",
        "cs",
        "cy",
        "da",
        "de-AT",
        "de-BE",
        "de",
        "el",
        "en-AU",
        "en-BE",
        "en-BW",
        "en-CA",
        "en-GB",
        "en-HK",
        "en-IE",
        "en-IN",
        "en-JO",
        "en-MT",
        "en-MY",
        "en-NZ",
        "en-PH",
        "en-RH",
        "en-SG",
        "en-US",
        "en-US-POSIX",
        "en-ZA",
        "en-ZW",
        "eo",
        "es-AR",
        "es-CL",
        "es-CO",
        "es-EC",
        "es-GT",
        "es-HN",
        "es",
        "es-PA",
        "es-PE",
        "es-PR",
        "es-US",
        "et",
        "eu",
        "fa-AF",
        "fa",
        "fi",
        "fil",
        "fo",
        "fr-BE",
        "fr-CA",
        "fr-CH",
        "fr",
        "ga",
        "gl",
        "gsw",
        "gu",
        "gv",
        "ha",
        "haw",
        "he",
        "hi",
        "hr",
        "hu",
        "hy",
        "id",
        "ii",
        "in",
        "is",
        "it-CH",
        "it",
        "iw",
        "ja-JP-TRADITIONAL",
        "ja",
        "",
        "ka",
        "kk",
        "kl",
        "km",
        "kn",
        "ko",
        "kok",
        "kw",
        "lt",
        "lv",
        "mk",
        "ml",
        "mr",
        "ms-BN",
        "ms",
        "mt",
        "nb",
        "ne-IN",
        "ne",
        "nl-BE",
        "nl",
        "nn",
        "no",
        "no-NO-NY",
        "om",
        "or",
        "pa-Arab",
        "pa",
        "pa-PK",
        "pl",
        "ps",
        "pt",
        "pt-PT",
        "ro",
        "ru",
        "ru-UA",
        "sh",
        "si",
        "sk",
        "sl",
        "so",
        "sq",
        "sr-BA",
        "sr-Cyrl-BA",
        "sr",
        "sr-Latn",
        "sr-Latn-ME",
        "sr-ME",
        "sv-FI",
        "sv",
        "sw",
        "ta",
        "te",
        "th",
        "ti-ER",
        "ti",
        "tl",
        "tr",
        "uk",
        "ur-IN",
        "ur",
        "ur-PK",
        "uz",
        "uz-Latn",
        "vi",
        "zh-Hans-SG",
        "zh-Hant-HK",
        "zh-Hant",
        "zh-Hant-MO",
        "zh-HK",
        "zh",
        "zh-MO",
        "zh-SG",
        "zh-TW",
        "zu"
    ],
    "requires": [
        "gallery-advanced-date-timezone"
    ]
});
