YUI.add('gallery-datetime-utils', function (Y, NAME) {

"use strict";

/**
 * @module gallery-datetime-utils
 */

/**********************************************************************
 * Utility functions work working with dates and times.
 * 
 * @main gallery-datetime-utils
 * @class DateTimeUtils
 */

function pad2(n)
{
	var s = n.toString();
	if (s.length < 2)
	{
		s = '0' + s;
	}
	return s;
}

function validInteger(v)
{
	return /^\d+$/.test(v);
}

Y.DateTimeUtils =
{
	/**
	 * Position of the year in a string representation of a date: 1,2,3
	 *
	 * @property YEAR_POSITION
	 * @type {Number}
	 * @default 1
	 * @static
	 */
	YEAR_POSITION: 1,

	/**
	 * Position of the month in a string representation of a date: 1,2,3
	 *
	 * @property MONTH_POSITION
	 * @type {Number}
	 * @default 2
	 * @static
	 */
	MONTH_POSITION: 2,

	/**
	 * Position of the day in a string representation of a date: 1,2,3
	 *
	 * @property DAY_POSITION
	 * @type {Number}
	 * @default 3
	 * @static
	 */
	DAY_POSITION: 3,

	/**
	 * Delimiter of fields in a string representation of a date.
	 *
	 * @property DATE_FIELD_DELIMITER
	 * @type {String}
	 * @default "-"
	 * @static
	 */
	DATE_FIELD_DELIMITER: '-',

	/**
	 * Delimiter of fields in a string representation of a time.
	 *
	 * @property TIME_FIELD_DELIMITER
	 * @type {String}
	 * @default ":"
	 * @static
	 */
	TIME_FIELD_DELIMITER: ':',

	/**
	 * Antemeridian string.
	 *
	 * @property AM_STRING
	 * @type {String}
	 * @default "AM"
	 * @static
	 */
	AM_STRING: 'AM',

	/**
	 * Postmeridian string.
	 *
	 * @property PM_STRING
	 * @type {String}
	 * @default "PM"
	 * @static
	 */
	PM_STRING: 'PM',

	/**
	 * How hours should be displayed to the user by classes in the DateTime
	 * family: 12hr or 24hr.  (Internal values are always 24hr.)  This is
	 * global because your app should be consistent about how it displays
	 * times.
	 * 
	 * @property CLOCK_DISPLAY_TYPE
	 * @type {Number} 12 or 24
	 * @default 24
	 * @static
	 */
	CLOCK_DISPLAY_TYPE: 24,

	/**
	 * Normalizes the given object by converting date\_str into
	 * year,month,day, converting time\_str into hour,minute (or adding in
	 * hour,minute from default\_time), and adding date (instanceof Date).
	 * Individual fields take precedence over strings.
	 * 
	 * If input is a Date object, then the result contains a breakdown of
	 * the values.
	 * 
	 * @method normalize
	 * @static
	 * @param input {Date|Number|Object}
	 *	Can be specified either as instance of Date, a number specifying
	 *	milliseconds since midnight Jan 1, 1970, or as an object defining
	 *	date_str or year,month,day and (optional) either time_str or
	 *	hour,minute.
	 * @param default_time {Object} Default hour and minute to use if input only has date.
	 * @return {Object} normalized object defining date and time
	 */
	normalize: function(input, default_time)
	{
		if (input instanceof Date)
		{
			var result =
			{
				year:   input.getFullYear(),
				month:  input.getMonth()+1,
				day:    input.getDate(),
				hour:   input.getHours(),
				minute: input.getMinutes(),
				date:   input
			};
			return result;
		}
		else if (Y.Lang.isNumber(input))
		{
			return self.normalize(new Date(input));
		}

		var result = Y.clone(input);
		if (result.date_str)
		{
			if (Y.Lang.isUndefined(result.year) &&
				Y.Lang.isUndefined(result.month) &&
				Y.Lang.isUndefined(result.day))
			{
				Y.mix(result, self.parseDate(result.date_str));
			}
			delete result.date_str;
		}

		if (result.time_str)
		{
			if (Y.Lang.isUndefined(result.hour) &&
				Y.Lang.isUndefined(result.minute))
			{
				Y.mix(result, self.parseTime(result.time_str));
			}
			delete result.time_str;
		}
		else if (Y.Lang.isUndefined(result.hour))
		{
			result.hour   = default_time.hour;
			result.minute = default_time.minute;
		}

		// return values inside standard ranges
		return self.normalize(new Date(result.year, result.month-1, result.day, result.hour, result.minute));
	},

	/**
	 * Format the date portion of a Date object.
	 * 
	 * @method formatDate
	 * @static
	 * @param date {Mixed} string (returned as-is), Date, milliseconds, or object specifying day,month,year
	 * @return {String} formatted date, using positions and delimiters
	 */
	formatDate: function(date)
	{
		if (!date)
		{
			return '';
		}
		else if (Y.Lang.isString(date))
		{
			return date;
		}

		if (Y.Lang.isNumber(date))
		{
			date = new Date(date);
		}

		var a = [];
		if (date instanceof Date)
		{
			a[ self.YEAR_POSITION-1 ]  = date.getFullYear().toString();
			a[ self.MONTH_POSITION-1 ] = pad2(date.getMonth()+1);
			a[ self.DAY_POSITION-1 ]   = pad2(date.getDate());
		}
		else
		{
			a[ self.YEAR_POSITION-1 ]  = date.year.toString();
			a[ self.MONTH_POSITION-1 ] = pad2(date.month);
			a[ self.DAY_POSITION-1 ]   = pad2(date.day);
		}

		return a.join(self.DATE_FIELD_DELIMITER);
	},

	/**
	 * Inverse of formatDate().  Extracts year, month, and day from the
	 * string.  The values are normalized to fall inside the default
	 * ranges.
	 * 
	 * @method parseDate
	 * @static
	 * @param date {String} string from DateTimeUtils.formatDate()
	 * @return {Object} year,month,day, or null
	 */
	parseDate: function(date)
	{
		if (!date)
		{
			return null;
		}
		else if (!Y.Lang.isString(date))
		{
			return date;
		}

		try
		{
			var obj = self.parseDateString(date, self.DATE_FIELD_DELIMITER,
				self.YEAR_POSITION, self.MONTH_POSITION, self.DAY_POSITION);
		}
		catch (e)
		{
			// Try the standard format provided by <input type="date">.
			// If this fails, we let the exception propagate.

			obj = self.parseDateString(date, '-', 1, 2, 3);
		}

		var result =
		{
			year:  obj.year,
			month: obj.month,
			day:   obj.day
		}
		return result;
	},

	/**
	 * Utility for parsing a date string that is not formatted based on the
	 * Y.DateTime configuration.
	 * 
	 * @method parseDate
	 * @static
	 * @param date {String} string from DateTimeUtils.formatDate()
	 * @param delimiater {String} delimiter between the date fields
	 * @param year_pos {Number} position of the year in the string representation: 1,2,3
	 * @param month_pos {Number} position of the month in the string representation: 1,2,3
	 * @param day_pos {Number} position of the day in the string representation: 1,2,3
	 * @return {Object} normalized object defining date
	 */
	parseDateString: function(date, delimiter, year_pos, month_pos, day_pos)
	{
		var d = date.split(delimiter);
		if (d.length != 3 || !Y.every(d, validInteger))
		{
			throw Error('Unparseable date format: ' + date);
		}

		return self.normalize(
		{
			year:   parseInt(d[ year_pos-1 ], 10),
			month:  parseInt(d[ month_pos-1 ], 10),
			day:    parseInt(d[ day_pos-1 ], 10),
			hour:   0,
			minute: 0
		});
	},

	/**
	 * Format the time portion of a Date object.
	 * 
	 * @method formatTime
	 * @static
	 * @param time {Mixed} string (returned as-is), Date, milliseconds, or object specifying hour,minute
	 * @return {String} formatted date, using positions and delimiters
	 */
	formatTime: function(time)
	{
		if (!time)
		{
			return '';
		}
		else if (Y.Lang.isString(time))
		{
			return time;
		}

		if (Y.Lang.isNumber(time))
		{
			time = new Date(time);
		}

		if (time instanceof Date)
		{
			time =
			{
				hour:   time.getHours(),
				minute: time.getMinutes()
			};
		}

		if (self.CLOCK_DISPLAY_TYPE == 12)
		{
			var s = self.TIME_FIELD_DELIMITER + pad2(time.minute) + ' ';
			if (time.hour === 0)
			{
				return '12' + s + self.AM_STRING;
			}
			else if (time.hour === 12)
			{
				return '12' + s + self.PM_STRING;
			}
			else if (time.hour > 12)
			{
				return (time.hour - 12) + s + self.PM_STRING;
			}
			else
			{
				return time.hour + s + self.AM_STRING;
			}
		}
		else
		{
			return time.hour + self.TIME_FIELD_DELIMITER + pad2(time.minute);
		}
	},

	/**
	 * Inverse of formatTime().  Extracts hour and minute from the string.
	 * Throws an error if hour is outside [0,23] or minute is outside
	 * [0,59].
	 * 
	 * @method parseTime
	 * @static
	 * @param time {String} string from DateTimeUtils.formatTime()
	 * @return {Object} hour,minute, or null
	 */
	parseTime: function(
		/* string */	time)
	{
		if (!time)
		{
			return null;
		}
		else if (!Y.Lang.isString(time))
		{
			return time;
		}

		var offset = 0,
			am     = false,
			pm     = false;
		if (time.indexOf(self.AM_STRING) > 0)
		{
			am   = true;
			time = Y.Lang.trim(time.replace(self.AM_STRING, ''));
		}
		else if (time.indexOf(self.PM_STRING) > 0)
		{
			pm     = true;
			time   = Y.Lang.trim(time.replace(self.PM_STRING, ''));
			offset = 12;
		}

		var t = time.split(self.TIME_FIELD_DELIMITER);
		if (t.length == 1 && (am || pm))
		{
			t[1] = 0;
		}
		else if (t.length < 2 || 3 < t.length || !Y.every(t, validInteger))
		{
			throw Error('Unparseable time format: ' + time);
		}

		if (am && t[0] == '12')
		{
			t[0] = 0;
		}
		else if (pm && t[0] == '12')
		{
			offset = 0;
		}

		var result =
		{
			hour:   parseInt(t[0], 10) + offset,
			minute: parseInt(t[1], 10)
		};

		if (result.hour   < 0 || 23 < result.hour ||
			result.minute < 0 || 59 < result.minute)
		{
			throw Error('Invalid time values: ' + result.hour + self.TIME_FIELD_DELIMITER + pad2(result.minute));
		}

		return result;
	}
};

var self = Y.DateTimeUtils;	// shortcut


}, 'gallery-2013.10.24-18-05', {"requires": ["gallery-funcprog"]});
