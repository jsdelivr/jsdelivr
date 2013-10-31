function array_intersect (arr1) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: These only output associative arrays (would need to be
  // %        note 1: all numeric and counting from zero to be numeric)
  // *     example 1: $array1 = {'a' : 'green', 0:'red', 1: 'blue'};
  // *     example 1: $array2 = {'b' : 'green', 0:'yellow', 1:'red'};
  // *     example 1: $array3 = ['green', 'red'];
  // *     example 1: $result = array_intersect($array1, $array2, $array3);
  // *     returns 1: {0: 'red', a: 'green'}
  var retArr = {},
    argl = arguments.length,
    arglm1 = argl - 1,
    k1 = '',
    arr = {},
    i = 0,
    k = '';

  arr1keys: for (k1 in arr1) {
    arrs: for (i = 1; i < argl; i++) {
      arr = arguments[i];
      for (k in arr) {
        if (arr[k] === arr1[k1]) {
          if (i === arglm1) {
            retArr[k1] = arr1[k1];
          }
          // If the innermost loop always leads at least once to an equal value, continue the loop until done
          continue arrs;
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys;
    }
  }

  return retArr;
}
