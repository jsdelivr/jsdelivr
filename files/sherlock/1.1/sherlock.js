/*!
 * Sherlock
 * Copyright (c) 2013 Tabule, Inc.
 * Version 1.1
 */

var Sherlock = (function() {

	var patterns = {
		rangeSplitters: /(\bto\b|\-|\b(?:un)?till?\b|\bthrough|and\b)/g,

		// oct, october
		months: "\\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\b",
		// 3, 31, 31st, fifth
		days: "\\b(?:(?:(?:on )?the )(?=\\d\\d?(?:st|nd|rd|th)))?([1-2]\\d|3[0-1]|0?[1-9])(?:st|nd|rd|th)?(?:,|\\b)",

		// 5/12, 5.12
		shortForm: /\b(0?[1-9]|1[0-2])(?:\/|\.)([1-2]\d|3[0-1]|0?[1-9])(?:(?:\/|\.)(?:20)?1\d)?\b/,

		// tue, tues, tuesday
		weekdays: /(next (?:week (?:on )?)?)?\b(sun|mon|tue(?:s)?|wed(?:nes)?|thurs|fri|sat(?:ur)?)(?:day)?\b/,
		relativeDateStr: "(next (?:week|month)|tom(?:orrow)?|tod(?:ay)?|day after tom(?:orrow)?)",
		inRelativeDateStr: "(\\d{1,2}|a) (day|week|month)s?",

		inRelativeTime: /\b(\d{1,2}|a|an) (hour|min(?:ute)?)s?\b/,
		midtime: /(?:@ ?)?\b(?:at )?(noon|midnight)\b/,
		// 0700, 1900, 23:50
		militaryTime: /\b(?:([0-2]\d):?([0-5]\d))(?! ?[ap]\.?m?\.?)\b/,
		// 5, 12pm, 5:00, 5:00pm, at 5pm, @3a
		explicitTime: /(?:@ ?)?\b(?:at |from )?(1[0-2]|[1-9])(?::([0-5]\d))? ?([ap]\.?m?\.?)?(?:o'clock)?\b/,

		fillerWords: / (from|is|at|on|for|in|(?:un)?till?)\b/
	},

	nowDate = null,

	getNow = function() {
		if (nowDate)
			return new Date(nowDate.getTime());
		else
			return new Date();
	},

	parser = function(str, time, startTime) {
		var ret = {},
			dateMatch = false,
			timeMatch = false,
			strNummed = helpers.strToNum(str);

		// parse date
		if (dateMatch = matchDate(strNummed, time, startTime))
			str = str.replace(new RegExp(helpers.numToStr(dateMatch)), '');

		// parse time
		if (timeMatch = matchTime(strNummed, time, startTime))
			str = str.replace(new RegExp(helpers.numToStr(timeMatch)), '');

		ret.eventTitle = str.split(patterns.fillerWords)[0].trim();

		// if time data not given, then this is an all day event
		ret.isAllDay = !!(dateMatch && !timeMatch);

		// check if date was parsed
		ret.isValidDate = !!(dateMatch || timeMatch || str.match(/\bnow\b/));

		return ret;
	},

	matchTime = function(str, time, startTime) {
		var match;
		if (match = str.match(patterns.inRelativeTime)) {
			// if we matched 'a' or 'an', set the number to 1
			if (isNaN(match[1]))
				match[1] = 1;

			switch(match[2]) {
				case "hour":
					time.setHours(time.getHours() + parseInt(match[1]));
					return match[0];
				case "min":
					time.setMinutes(time.getMinutes() + parseInt(match[1]));
					return match[0];
				case "minute":
					time.setMinutes(time.getMinutes() + parseInt(match[1]));
					return match[0];
				default:
					return false;
			}
		} else if (match = str.match(patterns.midtime)) {
			switch(match[1]) {
				case "noon":
					time.setHours(12, 0, 0);
					return match[0];
				case "midnight":
					time.setHours(0, 0, 0);
					return match[0];
				default:
					return false;
			}
		} else if (match = str.match(patterns.militaryTime)) {
			time.setHours(match[1], match[2], 0);
			return match[0];
		} else if (match = str.match(new RegExp(patterns.explicitTime.source, "g"))) {
			// if multiple matches found, pick the best one
			match = match.sort(function (a, b) { return b.length - a.length; })[0];
			if (match.length <= 2 && str.trim().length > 2)
				return false;
			match = match.match(patterns.explicitTime);

			var hour = parseInt(match[1])
			,	min = match[2] || 0
			,	meridian = match[3];

			if (meridian) {
				// meridian is included, adjust hours accordingly
				if (meridian.indexOf('p') === 0 && hour != 12)
					hour += 12;
				else if (meridian.indexOf('a') === 0 && hour == 12)
					hour = 0;
			} else if (hour < 12 && (hour < 7 || hour < time.getHours()))
				// meridian is not included, adjust any ambiguous times
				// if you type 3, it will default to 3pm
				// if you type 11 at 5am, it will default to am,
				// but if you type it at 2pm, it will default to pm
				hour += 12;

			time.setHours(hour, min, 0);
			return match[0];
		} else
			return false;
	},

	matchDate = function(str, time, startTime) {
		var match;
		if (match = str.match(patterns.monthDay)) {
			time.setMonth(helpers.changeMonth(match[1]), match[2]);
			return match[0];
		} else if (match = str.match(patterns.dayMonth)) {
			time.setMonth(helpers.changeMonth(match[2]), match[1]);
			return match[0];
		} else if (match = str.match(patterns.weekdays)) {
			switch (match[2].substr(0, 3)) {
				case "sun":
					helpers.changeDay(time, 0, match[1]);
					return match[0];
				case "mon":
					helpers.changeDay(time, 1, match[1]);
					return match[0];
				case "tue":
					helpers.changeDay(time, 2, match[1]);
					return match[0];
				case "wed":
					helpers.changeDay(time, 3, match[1]);
					return match[0];
				case "thu":
					helpers.changeDay(time, 4, match[1]);
					return match[0];
				case "fri":
					helpers.changeDay(time, 5, match[1]);
					return match[0];
				case "sat":
					helpers.changeDay(time, 6, match[1]);
					return match[0];
				default:
					return false;
			}
		} else if (match = str.match(patterns.inRelativeDateFromRelativeDate)) {
			if (helpers.relativeDateMatcher(match[3], time) && helpers.inRelativeDateMatcher(match[1], match[2], time))
				return match[0];
			else
				return false;
		} else if (match = str.match(patterns.relativeDate)) {
			if (helpers.relativeDateMatcher(match[1], time))
				return match[0];
			else
				return false;
		} else if (match = str.match(patterns.inRelativeDate)) {
			if (helpers.inRelativeDateMatcher(match[1], match[2], time))
				return match[0];
			else
				return false;
		} else if (match = str.match(patterns.shortForm)) {
			time.setMonth(match[1] - 1, match[2]);
			return match[0];
		} else if (match = str.match(new RegExp(patterns.days, "g"))) {
			// if multiple matches found, pick the best one
			match = match.sort(function (a, b) { return b.length - a.length; })[0];
			// check if the possible date match meets our reasonable assumptions...
				// if the match doesn't start with 'on',
			if ((match.indexOf('on') !== 0 &&
				// and if the match doesn't start with 'the' and end with a comma,
				!(match.indexOf('the') === 0 && match.indexOf(',', match.length - 1) !== -1) &&
				// and if the match isn't at the end of the overall input, then drop it.
				str.indexOf(match, str.length - match.length - 1) === -1) ||
			// But if one of those is true, make sure it passes these other checks too...
				// if this is an end date and the start date isn't an all day value,
				(!(startTime && startTime.isAllDay) && 
				// and if this match is too short to mean something,
				match.length <= 2))
				// then drop it.
				return false;
			match = match.match(patterns.daysOnly);
			
			var month = time.getMonth(),
				day = match[1];

			// if this date is in the past, move it to next month
			if (day < time.getDate())
				month++;

			time.setMonth(month, day);
			return match[0];
		} else
			return false;
	},

	// Make some intelligent assumptions of what was meant, even when given incomplete information
	makeAdjustments = function(start, end, isAllDay) {
		var now = getNow();
		if (end) { // 
			if (start > end && end > now && helpers.isSameDay(start, end) && helpers.isSameDay(start, now))
				// we are dealing with a time range that is today with start > end (ie. 9pm - 5am), move start to yesterday.
				start.setDate(start.getDate() - 1);

			else if (end < now) {
				if (helpers.isSameDay(end, now)) {
					// all-day events can be in the past when dealing with today, 
					// since they are set to midnight which must be in the past today
					if (!isAllDay) {
						if (start < end && helpers.isSameDay(start, now))
							// the start date is also today, move it tomorrow as well
							start.setDate(start.getDate() + 1);

						// the end time has already passed today, go to tomorrow
						end.setDate(end.getDate() + 1);
					}
				} else {
					if (start < end)
						// move start date forward a year if it is before the end date (March 2 - March 5),
						// but not if it is after (Dec 11 - Jan 23)
						start.setFullYear(start.getFullYear() + 1);
					// this date has passed, go to next year
					end.setFullYear(end.getFullYear() + 1);
				}
			}

		} else if (start) { // hallelujah, we aren't dealing with a date range
			if (start < now) {
				if (helpers.isSameDay(start, now)) {
					// all-day events can be in the past when dealing with today, 
					// since they are set to midnight which must be in the past today
					if (!isAllDay)
						// the time has already passed today, go to tomorrow
						start.setDate(start.getDate() + 1);
				} else
					// this date has passed, go to next year
					start.setFullYear(start.getFullYear() + 1);
			}
		}
	},

	helpers = {
		relativeDateMatcher: function(match, time) {
			var now = getNow();
			switch(match) {
				case "next week":
					time.setMonth(now.getMonth(), now.getDate() + 7);
					return true;
				case "next month":
					time.setMonth(time.getMonth() + 1);
					return true;
				case "tom":
					time.setMonth(now.getMonth(), now.getDate() + 1);
					return true;
				case "tomorrow":
					time.setMonth(now.getMonth(), now.getDate() + 1);
					return true;
				case "day after tomorrow":
					time.setMonth(now.getMonth(), now.getDate() + 2);
					return true;
				case "day after tom":
					time.setMonth(now.getMonth(), now.getDate() + 2);
					return true;
				case "today":
					time.setMonth(now.getMonth(), now.getDate());
					return true;
				case "tod":
					time.setMonth(now.getMonth(), now.getDate());
					return true;
				default:
					return false;
			}
		},

		inRelativeDateMatcher: function(num, scale, time) {
			// if we matched 'a' or 'an', set the number to 1
			if (isNaN(num))
				num = 1;
			else
				num = parseInt(num);

			switch(scale) {
				case "day":
					time.setDate(time.getDate() + num);
					return true;
				case "week":
					time.setDate(time.getDate() + num*7);
					return true;
				case "month":
					time.setMonth(time.getMonth() + num);
					return true;
				default:
					return false;
			}
		},

		// convert month string to number
		changeMonth: function(month) {
			return this.monthToInt[month.substr(0, 3)];
		},

		// find the nearest future date that is on the given weekday
		changeDay: function(time, newDay, hasNext) {
			var diff = 7 - time.getDay() + newDay;
			if (diff > 7 && !hasNext)
				diff -= 7;
			time.setDate(time.getDate() + diff);
		},

		escapeRegExp: function(str) {
		  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		},

		isSameDay: function(date1, date2) {
			return date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate() && date1.getFullYear() === date2.getFullYear();
		},

		monthToInt: {"jan": 0, "feb": 1, "mar": 2, "apr": 3, "may": 4, "jun": 5, "jul": 6, "aug": 7, "sep": 8, "oct": 9, "nov": 10, "dec": 11},

		// mapping of words to numbers
		wordsToInt: {
			'one'		: 1,
			'first'		: 1,
			'two'		: 2,
			'second'	: 2,
			'three'		: 3,
			'third'		: 3,
			'four'		: 4,
			'fourth'	: 4,
			'five'		: 5,
			'fifth'		: 5,
			'six'		: 6,
			'sixth'		: 6,
			'seven'		: 7,
			'seventh'	: 7,
			'eight'		: 8,
			'eighth'	: 8,
			'nine'		: 9,
			'ninth'		: 9,
			'ten'		: 10,
			'tenth'		: 10
		},

		// mapping of number to words
		intToWords: [
			'one|first',
			'two|second',
			'three|third',
			'four|fourth',
			'five|fifth',
			'six|sixth',
			'seven|seventh',
			'eight|eighth',
			'nine|ninth',
			'ten|tenth'
		],

		// converts all the words in a string into numbers, such as four -> 4
		strToNum: function(str) {
			return str.replace(patterns.digit, function(val) {
				var out = helpers.wordsToInt[val];
				if (val.indexOf('th', val.length - 2) !== -1)
					out += 'th';
				else if (val.indexOf('st', val.length - 2) !== -1)
					out += 'st';
				else if (val.indexOf('nd', val.length - 2) !== -1)
					out += 'nd';
				else if (val.indexOf('rd', val.length - 2) !== -1)
					out += 'rd';
				return out;
			});
		},

		// converts all the numbers in a string into regex for number|word, such as 4 -> 4|four
		numToStr: function(str) {
			return str.replace(/((?:[1-9]|10)(?:st|nd|rd|th)?)/g, function(val) {
				return '(?:' + val + '|' + helpers.intToWords[parseInt(val) - 1] + ')';
			});
		}
	};

	// may 5, may 5th
	patterns.monthDay = new RegExp(patterns.months + " "  + patterns.days);
	// 5th may, 5 may
	patterns.dayMonth = new RegExp(patterns.days + "(?: (?:day )?of)? " + patterns.months);
	// 5, 5th
	patterns.daysOnly = new RegExp(patterns.days);
	patterns.digit = new RegExp("\\b(" + helpers.intToWords.join("|") + ")\\b", "g");
	// today, tomorrow, day after tomorrow
	patterns.relativeDate = new RegExp("\\b" + patterns.relativeDateStr + "\\b");
	// in 2 weeks
	patterns.inRelativeDate = new RegExp("\\b" + patterns.inRelativeDateStr + "\\b");
	// 2 weeks from tomorrow
	patterns.inRelativeDateFromRelativeDate = new RegExp("\\b" + patterns.inRelativeDateStr + " from " + patterns.relativeDateStr + "\\b");

	return {
		// parses a string and returns an object defining the basic event 
		// with properties: eventTitle, startDate, endDate, isAllDay
		// plus anything Watson adds on...
		parse: function(str) {
			// check for null input
			if (str === null) str = '';

			var date = getNow(),
				// Check if Watson is around. If not, pretend like he is to keep Sherlock company.
				result = (typeof Watson !== 'undefined') ? Watson.preprocess(str) : [str, {}],
				str = result[0],
				ret = result[1],
				// token the string to start and stop times
				tokens = str.toLowerCase().split(patterns.rangeSplitters);
			
			patterns.rangeSplitters.lastIndex = 0;

			// normalize all dates to 0 milliseconds
			date.setMilliseconds(0);

			while (!ret.startDate) {
				// parse the start date
				if ((result = parser(tokens[0], date, null)) !== null) {
					if (result.isAllDay)
						// set to midnight
						date.setHours(0, 0, 0);

					ret.isAllDay = result.isAllDay;
					ret.eventTitle = result.eventTitle;
					ret.startDate = result.isValidDate ? date : null;
				}

				// if no time
				if (!ret.startDate && tokens.length >= 3) {
					// join the next 2 tokens to the current one
					var tokensTmp = [tokens[0] + tokens[1] + tokens[2]];
					for (var k = 3; k < tokens.length; k++) {
						tokensTmp.push(tokens[k]);
					}
					tokens = tokensTmp;
				} else
					break;
			}

			// parse the 2nd half of the date range, if it exists
			while (!ret.endDate) {
				if (tokens.length > 1) {
					date = new Date(date.getTime());
					// parse the end date
					if ((result = parser(tokens[2], date, ret)) !== null) {
						if (ret.isAllDay)
							// set to midnight
							date.setHours(0, 0, 0);

						if (result.eventTitle.length > ret.eventTitle.length)
							ret.eventTitle = result.eventTitle;

						ret.endDate = result.isValidDate ? date : null;
					}
				}

				if (!ret.endDate) {
					if (tokens.length >= 4) {
						// join the next 2 tokens to the current one
						var tokensTmp = [tokens[0], tokens[1], tokens[2] + tokens[3] + tokens[4]];
						for (var k = 5; k < tokens.length; k++) {
							tokensTmp.push(tokens[k]);
						}
						tokens = tokensTmp;
					} else {
						ret.endDate = null;
						break;
					}
				}
			}

			makeAdjustments(ret.startDate, ret.endDate, ret.isAllDay);

			// get capitalized version of title
			if (ret.eventTitle) {
				ret.eventTitle = ret.eventTitle.replace(/(?:^| )(?:\.|!|,|;)+/g, '');
				var match = str.match(new RegExp(helpers.escapeRegExp(ret.eventTitle), "i"));
				if (match) {
					ret.eventTitle = match[0].replace(/ +/g, ' ').trim(); // replace multiple spaces
					if (ret.eventTitle == '')
						ret.eventTitle = null;
				}
			} else
				ret.eventTitle = null;

			if (typeof Watson !== 'undefined')
				Watson.postprocess(ret);

			return ret;
		},

		// Sets what time Sherlock thinks it is right now, regardless of the actual system time.
		// Useful for debugging different times. Pass a Date object to set 'now' to a time of your choosing.
		// Don't pass in anything to reset 'now' to the real time.
		_setNow: function(newDate) {
			nowDate = newDate;
		}
	};
})();
