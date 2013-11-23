function gettimeofday (return_float) {
  // http://kevin.vanzonneveld.net
  // + original by: Brett Zamir (http://brett-zamir.me)
  // +      derived from: Josh Fraser (http://onlineaspect.com/2007/06/08/auto-detect-a-time-zone-with-javascript/)
  // +         parts by: Breaking Par Consulting Inc (http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256CFB006C45F7)
  // +  revised by: Theriault
  // *   example 1: gettimeofday();
  // *   returns 1: {sec: 12, usec: 153000, minuteswest: -480, dsttime: 0}
  // *   example 1: gettimeofday(true);
  // *   returns 1: 1238748978.49
  var t = new Date(),
    y = 0;

  if (return_float) {
    return t.getTime() / 1000;
  }

  y = t.getFullYear(); // Store current year.
  return {
    sec: t.getUTCSeconds(),
    usec: t.getUTCMilliseconds() * 1000,
    minuteswest: t.getTimezoneOffset(),
    // Compare Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC to see if DST is observed.
    dsttime: 0 + (((new Date(y, 0)) - Date.UTC(y, 0)) !== ((new Date(y, 6)) - Date.UTC(y, 6)))
  };
}
