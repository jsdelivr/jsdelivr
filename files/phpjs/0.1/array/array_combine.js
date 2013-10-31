function array_combine (keys, values) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: array_combine([0,1,2], ['kevin','van','zonneveld']);
  // *     returns 1: {0: 'kevin', 1: 'van', 2: 'zonneveld'}
  var new_array = {},
    keycount = keys && keys.length,
    i = 0;

  // input sanitation
  if (typeof keys !== 'object' || typeof values !== 'object' || // Only accept arrays or array-like objects
  typeof keycount !== 'number' || typeof values.length !== 'number' || !keycount) { // Require arrays to have a count
    return false;
  }

  // number of elements does not match
  if (keycount != values.length) {
    return false;
  }

  for (i = 0; i < keycount; i++) {
    new_array[keys[i]] = values[i];
  }

  return new_array;
}
