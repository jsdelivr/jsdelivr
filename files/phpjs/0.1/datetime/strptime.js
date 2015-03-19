function strptime (dateStr, format) {
  // http://kevin.vanzonneveld.net
  // +      original by: Brett Zamir (http://brett-zamir.me)
  // +      based on: strftime
  // -       depends on: setlocale
  // -       depends on: array_map
  // *        example 1: strptime('20091112222135', '%Y%m%d%H%M%S'); // Return value will depend on date and locale
  // *        returns 1: {tm_sec: 35, tm_min: 21, tm_hour: 22, tm_mday: 12, tm_mon: 10, tm_year: 109, tm_wday: 4, tm_yday: 315, unparsed: ''}
  // *        example 1: strptime('2009extra', '%Y');
  // *        returns 1: {tm_sec:0, tm_min:0, tm_hour:0, tm_mday:0, tm_mon:0, tm_year:109, tm_wday:3, tm_yday: -1, unparsed: 'extra'}

  // tm_isdst is in other docs; why not PHP?

  // Needs more thorough testing and examples

  var retObj = {
    tm_sec: 0,
    tm_min: 0,
    tm_hour: 0,
    tm_mday: 0,
    tm_mon: 0,
    tm_year: 0,
    tm_wday: 0,
    tm_yday: 0,
    unparsed: ''
  },
    that = this,
    amPmOffset = 0,
    prevHour = false,
    _date = function () {
      var o = retObj;
      // We set date to at least 1 to ensure year or month doesn't go backwards
      return _reset(new Date(Date.UTC(o.tm_year + 1900, o.tm_mon, o.tm_mday || 1, o.tm_hour, o.tm_min, o.tm_sec)), o.tm_mday);
    },
    _reset = function (dateObj, realMday) {
      // realMday is to allow for a value of 0 in return results (but without
      // messing up the Date() object)
      var o = retObj;
      var d = dateObj;
      o.tm_sec = d.getUTCSeconds();
      o.tm_min = d.getUTCMinutes();
      o.tm_hour = d.getUTCHours();
      o.tm_mday = realMday === 0 ? realMday : d.getUTCDate();
      o.tm_mon = d.getUTCMonth();
      o.tm_year = d.getUTCFullYear() - 1900;
      o.tm_wday = realMday === 0 ? (d.getUTCDay() > 0 ? d.getUTCDay() - 1 : 6) : d.getUTCDay();
      var jan1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      o.tm_yday = Math.ceil((d - jan1) / (1000 * 60 * 60 * 24));
    };

  // BEGIN STATIC
  var _NWS = /\S/,
    _WS = /\s/;

  var _aggregates = {
    c: 'locale',
    D: '%m/%d/%y',
    F: '%y-%m-%d',
    r: 'locale',
    R: '%H:%M',
    T: '%H:%M:%S',
    x: 'locale',
    X: 'locale'
  };

/* Fix: Locale alternatives are supported though not documented in PHP; see http://linux.die.net/man/3/strptime
Ec
EC
Ex
EX
Ey
EY
Od or Oe
OH
OI
Om
OM
OS
OU
Ow
OW
Oy
*/
  var _preg_quote = function (str) {
    return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g, '\\$1');
  };
  // END STATIC

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.setlocale('LC_ALL', 0); // ensure setup of localization variables takes place
  // END REDUNDANT

  var phpjs = this.php_js;
  var locale = phpjs.localeCategories.LC_TIME;
  var locales = phpjs.locales;
  var lc_time = locales[locale].LC_TIME;

  // First replace aggregates (run in a loop because an agg may be made up of other aggs)
  while (format.match(/%[cDFhnrRtTxX]/)) {
    format = format.replace(/%([cDFhnrRtTxX])/g, function (m0, m1) {
      var f = _aggregates[m1];
      return (f === 'locale' ? lc_time[m1] : f);
    });
  }

  var _addNext = function (j, regex, cb) {
    if (typeof regex === 'string') {
      regex = new RegExp('^' + regex, 'i');
    }
    var check = dateStr.slice(j);
    var match = regex.exec(check);
    // Even if the callback returns null after assigning to the return object, the object won't be saved anyways
    var testNull = match ? cb.apply(null, match) : null;
    if (testNull === null) {
      throw 'No match in string';
    }
    return j + match[0].length;
  };

  var _addLocalized = function (j, formatChar, category) {
    return _addNext(j, that.array_map(
    _preg_quote, lc_time[formatChar]).join('|'), // Could make each parenthesized instead and pass index to callback

    function (m) {
      var match = lc_time[formatChar].search(new RegExp('^' + _preg_quote(m) + '$', 'i'));
      if (match) {
        retObj[category] = match[0];
      }
    });
  };

  // BEGIN PROCESSING CHARACTERS
  for (var i = 0, j = 0; i < format.length; i++) {
    if (format.charAt(i) === '%') {
      var literalPos = ['%', 'n', 't'].indexOf(format.charAt(i + 1));
      if (literalPos !== -1) {
        if (['%', '\n', '\t'].indexOf(dateStr.charAt(j)) === literalPos) { // a matched literal
          ++i, ++j; // skip beyond
          continue;
        }
        // Format indicated a percent literal, but not actually present
        return false;
      }
      var formatChar = format.charAt(i + 1);
      try {
        switch (formatChar) {
        case 'a':
          // Fall-through // Sun-Sat
        case 'A':
          // Sunday-Saturday
          j = _addLocalized(j, formatChar, 'tm_wday'); // Changes nothing else
          break;
        case 'h':
          // Fall-through (alias of 'b');
        case 'b':
          // Jan-Dec
          j = _addLocalized(j, 'b', 'tm_mon');
          _date(); // Also changes wday, yday
          break;
        case 'B':
          // January-December
          j = _addLocalized(j, formatChar, 'tm_mon');
          _date(); // Also changes wday, yday
          break;
        case 'C':
          // 0+; century (19 for 20th)
          j = _addNext(j, /^\d?\d/, // PHP docs say two-digit, but accepts one-digit (two-digit max)

          function (d) {
            var year = (parseInt(d, 10) - 19) * 100;
            retObj.tm_year = year;
            _date();
            if (!retObj.tm_yday) {
              retObj.tm_yday = -1;
            }
            // Also changes wday; and sets yday to -1 (always?)
          });
          break;
        case 'd':
          // Fall-through  01-31 day
        case 'e':
          // 1-31 day
          j = _addNext(j, formatChar === 'd' ? /^(0[1-9]|[1-2]\d|3[0-1])/ : /^([1-2]\d|3[0-1]|[1-9])/, function (d) {
            var dayMonth = parseInt(d, 10);
            retObj.tm_mday = dayMonth;
            _date(); // Also changes w_day, y_day
          });
          break;
        case 'g':
          // No apparent effect; 2-digit year (see 'V')
          break;
        case 'G':
          // No apparent effect; 4-digit year (see 'V')'
          break;
        case 'H':
          // 00-23 hours
          j = _addNext(j, /^([0-1]\d|2[0-3])/, function (d) {
            var hour = parseInt(d, 10);
            retObj.tm_hour = hour;
            // Changes nothing else
          });
          break;
        case 'l':
          // Fall-through of lower-case 'L'; 1-12 hours
        case 'I':
          // 01-12 hours
          j = _addNext(j, formatChar === 'l' ? /^([1-9]|1[0-2])/ : /^(0[1-9]|1[0-2])/, function (d) {
            var hour = parseInt(d, 10) - 1 + amPmOffset;
            retObj.tm_hour = hour;
            prevHour = true; // Used for coordinating with am-pm
            // Changes nothing else, but affected by prior 'p/P'
          });
          break;
        case 'j':
          // 001-366 day of year
          j = _addNext(j, /^(00[1-9]|0[1-9]\d|[1-2]\d\d|3[0-6][0-6])/, function (d) {
            var dayYear = parseInt(d, 10) - 1;
            retObj.tm_yday = dayYear;
            // Changes nothing else (oddly, since if based on a given year, could calculate other fields)
          });
          break;
        case 'm':
          // 01-12 month
          j = _addNext(j, /^(0[1-9]|1[0-2])/, function (d) {
            var month = parseInt(d, 10) - 1;
            retObj.tm_mon = month;
            _date(); // Also sets wday and yday
          });
          break;
        case 'M':
          // 00-59 minutes
          j = _addNext(j, /^[0-5]\d/, function (d) {
            var minute = parseInt(d, 10);
            retObj.tm_min = minute;
            // Changes nothing else
          });
          break;
        case 'P':
          // Seems not to work; AM-PM
          return false; // Could make fall-through instead since supposed to be a synonym despite PHP docs
        case 'p':
          // am-pm
          j = _addNext(j, /^(am|pm)/i, function (d) {
            // No effect on 'H' since already 24 hours but
            //   works before or after setting of l/I hour
            amPmOffset = (/a/).test(d) ? 0 : 12;
            if (prevHour) {
              retObj.tm_hour += amPmOffset;
            }
          });
          break;
        case 's':
          // Unix timestamp (in seconds)
          j = _addNext(j, /^\d+/, function (d) {
            var timestamp = parseInt(d, 10);
            var date = new Date(Date.UTC(timestamp * 1000));
            _reset(date);
            // Affects all fields, but can't be negative (and initial + not allowed)
          });
          break;
        case 'S':
          // 00-59 seconds
          j = _addNext(j, /^[0-5]\d/, // strptime also accepts 60-61 for some reason

          function (d) {
            var second = parseInt(d, 10);
            retObj.tm_sec = second;
            // Changes nothing else
          });
          break;
        case 'u':
          // Fall-through; 1 (Monday)-7(Sunday)
        case 'w':
          // 0 (Sunday)-6(Saturday)
          j = _addNext(j, /^\d/, function (d) {
            retObj.tm_wday = d - (formatChar === 'u');
            // Changes nothing else apparently
          });
          break;
        case 'U':
          // Fall-through (week of year, from 1st Sunday)
        case 'V':
          // Fall-through (ISO-8601:1988 week number; from first 4-weekday week, starting with Monday)
        case 'W':
          // Apparently ignored (week of year, from 1st Monday)
          break;
        case 'y':
          // 69 (or higher) for 1969+, 68 (or lower) for 2068-
          j = _addNext(j, /^\d?\d/, // PHP docs say two-digit, but accepts one-digit (two-digit max)

          function (d) {
            d = parseInt(d, 10);
            var year = d >= 69 ? d : d + 100;
            retObj.tm_year = year;
            _date();
            if (!retObj.tm_yday) {
              retObj.tm_yday = -1;
            }
            // Also changes wday; and sets yday to -1 (always?)
          });
          break;
        case 'Y':
          // 2010 (4-digit year)
          j = _addNext(j, /^\d{1,4}/, // PHP docs say four-digit, but accepts one-digit (four-digit max)

          function (d) {
            var year = (parseInt(d, 10)) - 1900;
            retObj.tm_year = year;
            _date();
            if (!retObj.tm_yday) {
              retObj.tm_yday = -1;
            }
            // Also changes wday; and sets yday to -1 (always?)
          });
          break;
        case 'z':
          // Timezone; on my system, strftime gives -0800, but strptime seems not to alter hour setting
          break;
        case 'Z':
          // Timezone; on my system, strftime gives PST, but strptime treats text as unparsed
          break;
        default:
          throw 'Unrecognized formatting character in strptime()';
          break;
        }
      } catch (e) {
        if (e === 'No match in string') { // Allow us to exit
          return false; // There was supposed to be a matching format but there wasn't
        }
      }++i; // Calculate skipping beyond initial percent too
    } else if (format.charAt(i) !== dateStr.charAt(j)) {
      // If extra whitespace at beginning or end of either, or between formats, no problem
      // (just a problem when between % and format specifier)

      // If the string has white-space, it is ok to ignore
      if (dateStr.charAt(j).search(_WS) !== -1) {
        j++;
        i--; // Let the next iteration try again with the same format character
      } else if (format.charAt(i).search(_NWS) !== -1) { // Any extra formatting characters besides white-space causes
        // problems (do check after WS though, as may just be WS in string before next character)
        return false;
      } else { // Extra WS in format
        // Adjust strings when encounter non-matching whitespace, so they align in future checks above
        // Will check on next iteration (against same (non-WS) string character)
      }
    } else {
      j++;
    }
  }

  // POST-PROCESSING
  retObj.unparsed = dateStr.slice(j); // Will also get extra whitespace; empty string if none
  return retObj;
}
