function log1p (x) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Precision 'n' can be adjusted as desired
  // *     example 1: log1p(1e-15);
  // *     returns 1: 9.999999999999995e-16

  var ret = 0,
    n = 50; // degree of precision
  if (x <= -1) {
    return '-INF'; // JavaScript style would be to return Number.NEGATIVE_INFINITY
  }
  if (x < 0 || x > 1) {
    return Math.log(1 + x);
  }
  for (var i = 1; i < n; i++) {
    if ((i % 2) === 0) {
      ret -= Math.pow(x, i) / i;
    } else {
      ret += Math.pow(x, i) / i;
    }
  }
  return ret;
}
