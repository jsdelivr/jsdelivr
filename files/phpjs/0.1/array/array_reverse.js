function array_reverse (array, preserve_keys) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Karol Kowalski
  // *     example 1: array_reverse( [ 'php', '4.0', ['green', 'red'] ], true);
  // *     returns 1: { 2: ['green', 'red'], 1: 4, 0: 'php'}
  var isArray = Object.prototype.toString.call(array) === "[object Array]",
    tmp_arr = preserve_keys ? {} : [],
    key;

  if (isArray && !preserve_keys) {
    return array.slice(0).reverse();
  }

  if (preserve_keys) {
    var keys = [];
    for (key in array) {
      // if (array.hasOwnProperty(key)) {
      keys.push(key);
      // }
    }

    var i = keys.length;
    while (i--) {
      key = keys[i];
      // FIXME: don't rely on browsers keeping keys in insertion order
      // it's implementation specific
      // eg. the result will differ from expected in Google Chrome
      tmp_arr[key] = array[key];
    }
  } else {
    for (key in array) {
      // if (array.hasOwnProperty(key)) {
      tmp_arr.unshift(array[key]);
      // }
    }
  }

  return tmp_arr;
}
