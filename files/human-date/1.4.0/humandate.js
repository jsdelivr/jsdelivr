(function () {
  var humandate = {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    toUTC: function toUTC(input) {
      var date = input ? new Date(input) : new Date();
      date = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );
      return date;
    },
    monthName: function monthName(index) {
      var monthNumber, date;
      if (typeof index === 'number') {
        monthNumber = index;
      } else {
        date = new Date(index);
        monthNumber = date.getMonth() + 1;
      }
      return humandate.months[monthNumber - 1];
    },
    relativeTime: function relativeTime(input, options) {
      var seconds, time, suffix, then, date, now, isPast, showNext;
      var output = [];
      if (typeof input === 'number') {
        seconds = input;
      } else {
        date = new Date(input);
        then = date.getTime();
        now = new Date().getTime();
        seconds = (now - then) / 1000 * -1;
      }
      if (!options) {
        options = {};
      }
      if (!options.futureSuffix) {
        options.futureSuffix = 'from now';
      }
      if (!options.pastSuffix) {
        options.pastSuffix = 'ago';
      }
      if (!options.presentText) {
        options.presentText = 'now';
      }
      if (!options.returnObject) {
        options.returnObject = false;
      }
      isPast = seconds < 0 ? true : false;
      seconds = Math.abs(seconds);
      time = {
        seconds: Math.floor(seconds % 31536000 % 86400 % 3600 % 60),
        minutes: Math.floor(seconds % 31536000 % 86400 % 3600 / 60),
        hours: Math.floor(seconds % 31536000 % 86400 / 3600),
        days: Math.floor(seconds % 31536000 / 86400),
        years: Math.floor(seconds / 31536000),
        past: isPast
      };
      if (options.returnObject) {
        return time;
      }
      if(seconds === 0) {
        return options.presentText;
      }
      suffix = time.past ? options.pastSuffix : options.futureSuffix;
      showNext = true;
      function append(amount, string) {
        if (showNext) {
          showNext = options.allUnits;
          output.push(amount + ' ' + string + (amount > 1 ? 's' : ''));
        }
      }
      if (time.years) {
        append(time.years, 'year');
      }
      if (time.days) {
        append(time.days, 'day');
      }
      if (time.hours) {
        append(time.hours, 'hour');
      }
      if (time.minutes) {
        append(time.minutes, 'minute');
      }
      if (time.seconds) {
        append(time.seconds, 'second');
      }
      return output.join(', ') + ' ' + suffix;
    },
    prettyPrint: function prettyPrint(input, options) {
      var date, hdate, day, humanDate, year, month, tstr, hours, minutes, ampm;

      if (!input) {
        input = new Date();
      } else if (typeof input === 'number') {
        input = new Date().setSeconds(input);
      }

      if (!options) {
        options = {};
      }

      if (!options.showTime) {
        options.showTime = false;
      }

      date = new Date(input);
      day = date.getDate();

      if (day > 3 && day < 21) {
        humanDate = day + 'th';
      } else if (day % 10 === 1) {
        humanDate = day + 'st';
      } else if (day % 10 === 2) {
        humanDate = day + 'nd';
      } else if (day % 10 === 3) {
        humanDate = day + 'rd';
      } else {
        humanDate = day + 'th';
      }

      year = date.getFullYear();
      month = this.monthName(date.getMonth() + 1);
      hdate = month + ' ' + humanDate + ', ' + year;

      hours = date.getHours();
      minutes = date.getMinutes();
      ampm = hours >= 12 ? 'pm' : 'am';
      hours = (hours % 12) ? hours % 12 : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      tstr = hours + ':' + minutes + ' ' + ampm;
      return options.showTime ? hdate + " at " + tstr : hdate;
    }
  };

  /* istanbul ignore next: code loaders */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = humandate;
  } else if (typeof define === 'function' && define.amd) {
    return define([], function () {
      return humandate;
    });
  } else {
    this.humandate = humandate;
  }
}());
