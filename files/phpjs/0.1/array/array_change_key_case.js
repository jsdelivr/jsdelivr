function array_change_key_case (array, cs) {
  // http://kevin.vanzonneveld.net
  // +   original by: Ates Goral (http://magnetiq.com)
  // +   improved by: marrtins
  // +      improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: array_change_key_case(42);
  // *     returns 1: false
  // *     example 2: array_change_key_case([ 3, 5 ]);
  // *     returns 2: {0: 3, 1: 5}
  // *     example 3: array_change_key_case({ FuBaR: 42 });
  // *     returns 3: {"fubar": 42}
  // *     example 4: array_change_key_case({ FuBaR: 42 }, 'CASE_LOWER');
  // *     returns 4: {"fubar": 42}
  // *     example 5: array_change_key_case({ FuBaR: 42 }, 'CASE_UPPER');
  // *     returns 5: {"FUBAR": 42}
  // *     example 6: array_change_key_case({ FuBaR: 42 }, 2);
  // *     returns 6: {"FUBAR": 42}
  // *     example 7: ini_set('phpjs.return_phpjs_arrays', 'on');
  // *     example 7: var arr = array({a: 0}, {B: 1}, {c: 2});
  // *     example 7: var newArr = array_change_key_case(arr);
  // *     example 7: newArr.b
  // *     example 7: 1

  var case_fn, key, tmp_ar = {};

  if (Object.prototype.toString.call(array) === '[object Array]') {
    return array;
  }
  if (array && typeof array === 'object' && array.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
    return array.change_key_case(cs);
  }
  if (array && typeof array === 'object' ) {
    case_fn = (!cs || cs === 'CASE_LOWER') ? 'toLowerCase' : 'toUpperCase';
    for (key in array) {
      tmp_ar[key[case_fn]()] = array[key];
    }
    return tmp_ar;
  }
  return false;
}
