(function() {
  var Walrus;

  Walrus = (typeof exports !== "undefined" && exports !== null ? require('./walrus') : this).Walrus;

  /**
   * *:strftime*
   * Formats a date into the string given by `format`. Accepts any value
   * that can be passed to `new Date( )`.
   *
   * Parameters:
   *  format - The format string, according to these tokens, taken directly
   *           from `man 3 strftime` (with some omissions):
   *
   *           %A    is replaced by national representation of the full weekday name.
   *
   *           %a    is replaced by national representation of the abbreviated weekday name.
   *
   *           %B    is replaced by national representation of the full month name.
   *
   *           %b    is replaced by national representation of the abbreviated month name.
   *
   *           %D    is equivalent to ``%m/%d/%y''.
   *
   *           %d    is replaced by the day of the month as a decimal number (01-31).
   *
   *           %e    is replaced by the day of month as a decimal number (1-31); single digits are
   *                 preceded by a blank.
   *
   *           %F    is equivalent to ``%Y-%m-%d''.
   *
   *           %H    is replaced by the hour (24-hour clock) as a decimal number (00-23).
   *
   *           %I    is replaced by the hour (12-hour clock) as a decimal number (01-12).
   *
   *           %k    is replaced by the hour (24-hour clock) as a decimal number (0-23); single dig-
   *                 its are preceded by a blank.
   *
   *           %l    is replaced by the hour (12-hour clock) as a decimal number (1-12); single dig-
   *                 its are preceded by a blank.
   *
   *           %M    is replaced by the minute as a decimal number (00-59).
   *
   *           %m    is replaced by the month as a decimal number (01-12).
   *
   *           %n    is replaced by a newline.
   *
   *           %p    is replaced by national representation of either "ante meridiem" or "post meri-
   *                 diem" as appropriate.
   *
   *           %R    is equivalent to ``%H:%M''.
   *
   *           %r    is equivalent to ``%I:%M:%S %p''.
   *
   *           %S    is replaced by the second as a decimal number (00-60).
   *
   *           %T    is equivalent to ``%H:%M:%S''.
   *
   *           %t    is replaced by a tab.
   *
   *           %U    is replaced by the week number of the year (Sunday as the first day of the
   *                 week) as a decimal number (00-53).
   *
   *           %u    is replaced by the weekday (Monday as the first day of the week) as a decimal
   *                 number (1-7).
   *
   *           %v    is equivalent to ``%e-%b-%Y''.
   *
   *           %w    is replaced by the weekday (Sunday as the first day of the week) as a decimal
   *
   *           %X    is replaced by national representation of the time.
   *
   *           %x    is replaced by national representation of the date.
   *
   *           %Y    is replaced by the year with century as a decimal number.
   *
   *           %y    is replaced by the year without century as a decimal number (00-99).
   *
   *           %Z    is replaced by the time zone name.
  */

  Walrus.addFilter('strftime', function(dateish, format) {
    var date, pad,
      _this = this;
    date = new Date(dateish);
    pad = function(value, to, padding) {
      if (to == null) to = 2;
      if (padding == null) padding = '0';
      if (("" + value).length < to) {
        return pad("" + padding + value, to, padding);
      } else {
        return value;
      }
    };
    return format.replace(/%(.)/g, function(input) {
      switch (input) {
        case '%a':
          return Walrus.i18n.t('dates.abbr_daynames')[date.getDay()];
        case '%A':
          return Walrus.i18n.t('dates.full_daynames')[date.getDay()];
        case '%b':
          return Walrus.i18n.t('dates.abbr_monthnames')[date.getMonth()];
        case '%B':
          return Walrus.i18n.t('dates.full_monthnames')[date.getMonth()];
        case '%D':
          return _this.strftime(date, '%m/%d/%y');
        case '%d':
          return pad(date.getDate());
        case '%e':
          return date.getDate();
        case '%F':
          return _this.strftime(date, '%Y-%m-%d');
        case '%H':
          return pad(date.getHours());
        case '%I':
          if (date.getHours() > 12) {
            return pad(date.getHours() - 12);
          } else {
            return pad(date.getHours());
          }
          break;
        case '%k':
          return date.getHours();
        case '%l':
          if (date.getHours() > 12) {
            return date.getHours() - 12;
          } else {
            return date.getHours();
          }
          break;
        case '%M':
          return pad(date.getMinutes());
        case '%m':
          return pad(date.getMonth() + 1);
        case '%n':
          return "\n";
        case '%p':
          if (date.getHours() > 12) {
            return Walrus.i18n.t('dates.pm');
          } else {
            return Walrus.i18n.t('dates.am');
          }
          break;
        case '%R':
          return _this.strftime(date, '%H:%M');
        case '%r':
          return _this.strftime(date, '%I:%M:%S %p');
        case '%S':
          return pad(date.getSeconds());
        case '%T':
          return _this.strftime(date, '%H:%M:%S');
        case '%t':
          return "\t";
        case '%u':
          return date.getDay() || 7;
        case '%v':
          return _this.strftime(date, '%e-%b-%Y');
        case '%w':
          return date.getDay();
        case '%X':
          return date.toTimeString();
        case '%x':
          return date.toDateString();
        case '%Y':
          return date.getFullYear();
        case '%y':
          return date.getFullYear().toString().slice(-2);
        case '%Z':
          return date.toString().match(/\((\w+)\)/)[1] || '';
      }
    });
  });

  /**
   * returns whether or not the given year is a leap year
  */

  Walrus.Utils.isLeapYear = function(year) {
    return new Date(year, 1, 29).getDate() === 29;
  };

  /**
   * returns the number of leap years between the two given years
  */

  Walrus.Utils.leapYearsBetween = function(from, to) {
    var count, year;
    if (from > to) return 0;
    count = 0;
    for (year = from; from <= to ? year <= to : year >= to; from <= to ? year++ : year--) {
      if (this.isLeapYear(year)) count++;
    }
    return count;
  };

  /**
   * returns the distance between two times in words
  */

  Walrus.Utils.distanceOfTimeInWords = function(ftime, ttime, includeSeconds) {
    var d, diff, distanceInMinutes, distanceInSeconds, distanceInYears, fdate, fyear, leapYears, minuteOffsetForLeapYear, minutesWithOffset, remainder, t, tdate, tyear;
    if (ttime == null) ttime = 0;
    if (includeSeconds == null) includeSeconds = false;
    t = function(keypath, count) {
      var amount;
      if (count == null) count = 1;
      amount = count === 1 ? 'one' : 'other';
      return Walrus.i18n.t("dates.distance_in_words." + keypath + "." + amount, {
        count: count
      });
    };
    fdate = new Date(ftime);
    tdate = new Date(ttime);
    diff = (tdate - fdate) / 1000;
    distanceInMinutes = Math.round(Math.abs(diff) / 60);
    distanceInSeconds = Math.round(Math.abs(diff));
    d = function(divisor) {
      if (divisor == null) divisor = 1;
      return Math.round(distanceInMinutes / divisor);
    };
    switch (false) {
      case !((0 <= distanceInMinutes && distanceInMinutes <= 1)):
        if (!includeSeconds) {
          if (distanceInMinutes === 0) {
            return t('less_than_x_minutes');
          } else {
            return t('x_minutes');
          }
        } else {
          switch (false) {
            case !((0 <= distanceInSeconds && distanceInSeconds <= 4)):
              return t('less_than_x_seconds', 5);
            case !((5 <= distanceInSeconds && distanceInSeconds <= 9)):
              return t('less_than_x_seconds', 10);
            case !((10 <= distanceInSeconds && distanceInSeconds <= 19)):
              return t('less_than_x_seconds', 20);
            case !((20 <= distanceInSeconds && distanceInSeconds <= 39)):
              return t('half_a_minute');
            case !((40 <= distanceInSeconds && distanceInSeconds <= 59)):
              return t('less_than_x_minutes');
            default:
              return "1 minute";
          }
        }
        break;
      case !((2 <= distanceInMinutes && distanceInMinutes <= 44)):
        return t('x_minutes', d());
      case !((45 <= distanceInMinutes && distanceInMinutes <= 89)):
        return t('about_x_hours');
      case !((90 <= distanceInMinutes && distanceInMinutes <= 1439)):
        return t('about_x_hours', d(60));
      case !((1440 <= distanceInMinutes && distanceInMinutes <= 2519)):
        return t('x_days');
      case !((2520 <= distanceInMinutes && distanceInMinutes <= 43199)):
        return t('x_days', d(1440));
      case !((43200 <= distanceInMinutes && distanceInMinutes <= 86399)):
        return t('about_x_months');
      case !((86400 <= distanceInMinutes && distanceInMinutes <= 525599)):
        return t('x_months', d(43200));
      default:
        fyear = fdate.getFullYear();
        if (fdate.getMonth() >= 2) fyear += 1;
        tyear = tdate.getFullYear();
        if (tdate.getMonth() < 2) tyear -= 1;
        leapYears = Walrus.Utils.leapYearsBetween(fyear, tyear);
        minuteOffsetForLeapYear = leapYears * 1440;
        minutesWithOffset = distanceInMinutes - minuteOffsetForLeapYear;
        remainder = minutesWithOffset % 525600;
        distanceInYears = Math.floor(minutesWithOffset / 525600);
        if (remainder < 131400) {
          return t('about_x_years', distanceInYears);
        } else if (remainder < 394200) {
          return t('over_x_years', distanceInYears);
        } else {
          return t('almost_x_years', distanceInYears + 1);
        }
    }
  };

  /**
   * *:time_ago_in_words*
   * Returns a human-readable relative time phrase from the given date.
   *
   * Parameters:
   *  includeSeconds - (Optional) whether or not to include results for less than one minute
   *
   * Usage:
   *
   *  {{ created_at | :time_ago_in_words( true ) }} // => "less than a minute"
  */

  Walrus.addFilter('time_ago_in_words', function(dateish, includeSeconds) {
    return Walrus.Utils.distanceOfTimeInWords(dateish, new Date(), includeSeconds);
  });

}).call(this);
