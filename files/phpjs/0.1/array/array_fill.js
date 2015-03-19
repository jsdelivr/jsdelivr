function array_fill (start_index, num, mixed_val) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Waldo Malqui Silva
  // *     example 1: array_fill(5, 6, 'banana');
  // *     returns 1: { 5: 'banana', 6: 'banana', 7: 'banana', 8: 'banana', 9: 'banana', 10: 'banana' }
  var key, tmp_arr = {};

  if (!isNaN(start_index) && !isNaN(num)) {
    for (key = 0; key < num; key++) {
      tmp_arr[(key + start_index)] = mixed_val;
    }
  }

  return tmp_arr;
}
