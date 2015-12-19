function array_pop (inputArr) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +   input by: Theriault
  // %        note 1: While IE (and other browsers) support iterating an object's
  // %        note 1: own properties in order, if one attempts to add back properties
  // %        note 1: in IE, they may end up in their former position due to their position
  // %        note 1: being retained. So use of this function with "associative arrays"
  // %        note 1: (objects) may lead to unexpected behavior in an IE environment if
  // %        note 1: you add back properties with the same keys that you removed
  // *     example 1: array_pop([0,1,2]);
  // *     returns 1: 2
  // *     example 2: data = {firstName: 'Kevin', surName: 'van Zonneveld'};
  // *     example 2: lastElem = array_pop(data);
  // *     returns 2: 'van Zonneveld'
  // *     results 2: data == {firstName: 'Kevin'}
  var key = '',
    lastKey = '';

  if (inputArr.hasOwnProperty('length')) {
    // Indexed
    if (!inputArr.length) {
      // Done popping, are we?
      return null;
    }
    return inputArr.pop();
  } else {
    // Associative
    for (key in inputArr) {
      if (inputArr.hasOwnProperty(key)) {
        lastKey = key;
      }
    }
    if (lastKey) {
      var tmp = inputArr[lastKey];
      delete(inputArr[lastKey]);
      return tmp;
    } else {
      return null;
    }
  }
}
