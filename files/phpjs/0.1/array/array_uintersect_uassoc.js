function array_uintersect_uassoc (arr1) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  // *     example 1: $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
  // *     example 1: array_uintersect_uassoc($array1, $array2, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 == string2) return 0; return -1;}, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 == string2) return 0; return -1;});
  // *     returns 1: {a: 'green', b: 'brown'}
  var retArr = {},
    arglm1 = arguments.length - 1,
    arglm2 = arglm1 - 1,
    cb = arguments[arglm1],
    cb0 = arguments[arglm2],
    k1 = '',
    i = 1,
    k = '',
    arr = {};

  cb = (typeof cb === 'string') ? this.window[cb] : (Object.prototype.toString.call(cb) === '[object Array]') ? this.window[cb[0]][cb[1]] : cb;
  cb0 = (typeof cb0 === 'string') ? this.window[cb0] : (Object.prototype.toString.call(cb0) === '[object Array]') ? this.window[cb0[0]][cb0[1]] : cb0;

  arr1keys: for (k1 in arr1) {
    arrs: for (i = 1; i < arglm2; i++) {
      arr = arguments[i];
      for (k in arr) {
        if (cb0(arr[k], arr1[k1]) === 0 && cb(k, k1) === 0) {
          if (i === arguments.length - 3) {
            retArr[k1] = arr1[k1];
          }
          continue arrs; // If the innermost loop always leads at least once to an equal value, continue the loop until done
        }
      }
      continue arr1keys; // If it reaches here, it wasn't found in at least one array, so try next value
    }
  }

  return retArr;
}
