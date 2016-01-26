function array_shift (inputArr) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Martijn Wieringa
  // %        note 1: Currently does not handle objects
  // *     example 1: array_shift(['Kevin', 'van', 'Zonneveld']);
  // *     returns 1: 'Kevin'
  var props = false,
    shift = undefined,
    pr = '',
    allDigits = /^\d$/,
    int_ct = -1,
    _checkToUpIndices = function (arr, ct, key) {
      // Deal with situation, e.g., if encounter index 4 and try to set it to 0, but 0 exists later in loop (need to
      // increment all subsequent (skipping current key, since we need its value below) until find unused)
      if (arr[ct] !== undefined) {
        var tmp = ct;
        ct += 1;
        if (ct === key) {
          ct += 1;
        }
        ct = _checkToUpIndices(arr, ct, key);
        arr[ct] = arr[tmp];
        delete arr[tmp];
      }
      return ct;
    };


  if (inputArr.length === 0) {
    return null;
  }
  if (inputArr.length > 0) {
    return inputArr.shift();
  }

/*
  UNFINISHED FOR HANDLING OBJECTS
  for (pr in inputArr) {
    if (inputArr.hasOwnProperty(pr)) {
      props = true;
      shift = inputArr[pr];
      delete inputArr[pr];
      break;
    }
  }
  for (pr in inputArr) {
    if (inputArr.hasOwnProperty(pr)) {
      if (pr.search(allDigits) !== -1) {
        int_ct += 1;
        if (parseInt(pr, 10) === int_ct) { // Key is already numbered ok, so don't need to change key for value
          continue;
        }
        _checkToUpIndices(inputArr, int_ct, pr);
        arr[int_ct] = arr[pr];
        delete arr[pr];
      }
    }
  }
  if (!props) {
    return null;
  }
  return shift;
  */
}
