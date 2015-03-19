function array_slice (arr, offst, lgth, preserve_keys) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: is_int
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // %          note: Relies on is_int because !isNaN accepts floats
  // *     example 1: array_slice(["a", "b", "c", "d", "e"], 2, -1);
  // *     returns 1: {0: 'c', 1: 'd'}
  // *     example 2: array_slice(["a", "b", "c", "d", "e"], 2, -1, true);
  // *     returns 2: {2: 'c', 3: 'd'}
/*
  if ('callee' in arr && 'length' in arr) {
    arr = Array.prototype.slice.call(arr);
  }
  */

  var key = '';

  if (Object.prototype.toString.call(arr) !== '[object Array]' ||
    (preserve_keys && offst !== 0)) { // Assoc. array as input or if required as output
    var lgt = 0,
      newAssoc = {};
    for (key in arr) {
      //if (key !== 'length') {
      lgt += 1;
      newAssoc[key] = arr[key];
      //}
    }
    arr = newAssoc;

    offst = (offst < 0) ? lgt + offst : offst;
    lgth = lgth === undefined ? lgt : (lgth < 0) ? lgt + lgth - offst : lgth;

    var assoc = {};
    var start = false,
      it = -1,
      arrlgth = 0,
      no_pk_idx = 0;
    for (key in arr) {
      ++it;
      if (arrlgth >= lgth) {
        break;
      }
      if (it == offst) {
        start = true;
      }
      if (!start) {
        continue;
      }++arrlgth;
      if (this.is_int(key) && !preserve_keys) {
        assoc[no_pk_idx++] = arr[key];
      } else {
        assoc[key] = arr[key];
      }
    }
    //assoc.length = arrlgth; // Make as array-like object (though length will not be dynamic)
    return assoc;
  }

  if (lgth === undefined) {
    return arr.slice(offst);
  } else if (lgth >= 0) {
    return arr.slice(offst, offst + lgth);
  } else {
    return arr.slice(offst, lgth);
  }
}
