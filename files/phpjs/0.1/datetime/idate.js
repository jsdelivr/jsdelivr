function idate (format, timestamp) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Alex
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Theriault
  // +  derived from: date
  // +  derived from: gettimeofday
  // *     example 1: idate('y');
  // *     returns 1: 9
  if (format === undefined) {
    throw 'idate() expects at least 1 parameter, 0 given';
  }
  if (!format.length || format.length > 1) {
    throw 'idate format is one char';
  }

  // Fix: Need to allow date_default_timezone_set() (check for this.php_js.default_timezone and use)
  var date = ((typeof timestamp === 'undefined') ? new Date() : // Not provided
  (timestamp instanceof Date) ? new Date(timestamp) : // Javascript Date()
  new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
  ),
    a;

  switch (format) {
  case 'B':
    return Math.floor(((date.getUTCHours() * 36e2) + (date.getUTCMinutes() * 60) + date.getUTCSeconds() + 36e2) / 86.4) % 1e3;
  case 'd':
    return date.getDate();
  case 'h':
    return date.getHours() % 12 || 12;
  case 'H':
    return date.getHours();
  case 'i':
    return date.getMinutes();
  case 'I':
    // capital 'i'
    // Logic derived from getimeofday().
    // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
    // If they are not equal, then DST is observed.
    a = date.getFullYear();
    return 0 + (((new Date(a, 0)) - Date.UTC(a, 0)) !== ((new Date(a, 6)) - Date.UTC(a, 6)));
  case 'L':
    a = date.getFullYear();
    return (!(a & 3) && (a % 1e2 || !(a % 4e2))) ? 1 : 0;
  case 'm':
    return date.getMonth() + 1;
  case 's':
    return date.getSeconds();
  case 't':
    return (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
  case 'U':
    return Math.round(date.getTime() / 1000);
  case 'w':
    return date.getDay();
  case 'W':
    a = new Date(date.getFullYear(), date.getMonth(), date.getDate() - (date.getDay() || 7) + 3);
    return 1 + Math.round((a - (new Date(a.getFullYear(), 0, 4))) / 864e5 / 7);
  case 'y':
    return parseInt((date.getFullYear() + '').slice(2), 10); // This function returns an integer, unlike date()
  case 'Y':
    return date.getFullYear();
  case 'z':
    return Math.floor((date - new Date(date.getFullYear(), 0, 1)) / 864e5);
  case 'Z':
    return -date.getTimezoneOffset() * 60;
  default:
    throw 'Unrecognized date format token';
  }
}
