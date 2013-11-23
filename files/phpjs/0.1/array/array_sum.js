function array_sum (array) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Nate
  // +   bugfixed by: Gilbert
  // +   improved by: David Pilia (http://www.beteck.it/)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: array_sum([4, 9, 182.6]);
  // *     returns 1: 195.6
  // *     example 2: total = []; index = 0.1; for (y=0; y < 12; y++){total[y] = y + index;}
  // *     example 2: array_sum(total);
  // *     returns 2: 67.2
  var key, sum = 0;

  if (array && typeof array === 'object' && array.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
    return array.sum.apply(array, Array.prototype.slice.call(arguments, 0));
  }

  // input sanitation
  if (typeof array !== 'object') {
    return null;
  }

  for (key in array) {
    if (!isNaN(parseFloat(array[key]))) {
      sum += parseFloat(array[key]);
    }
  }

  return sum;
}
