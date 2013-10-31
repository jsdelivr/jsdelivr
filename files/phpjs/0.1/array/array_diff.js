function array_diff (arr1) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Sanjoy Roy
  // +    revised by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: array_diff(['Kevin', 'van', 'Zonneveld'], ['van', 'Zonneveld']);
  // *     returns 1: {0:'Kevin'}
  var retArr = {},
    argl = arguments.length,
    k1 = '',
    i = 1,
    k = '',
    arr = {};

  arr1keys: for (k1 in arr1) {
    for (i = 1; i < argl; i++) {
      arr = arguments[i];
      for (k in arr) {
        if (arr[k] === arr1[k1]) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys;
        }
      }
      retArr[k1] = arr1[k1];
    }
  }

  return retArr;
}
