function array_flip (trans) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      improved by: Pier Paolo Ramon (http://www.mastersoup.com/)
  // +      improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: array_flip( {a: 1, b: 1, c: 2} );
  // *     returns 1: {1: 'b', 2: 'c'}
  // *     example 2: ini_set('phpjs.return_phpjs_arrays', 'on');
  // *     example 2: array_flip(array({a: 0}, {b: 1}, {c: 2}))[1];
  // *     returns 2: 'b'

  var key, tmp_ar = {};

  if (trans && typeof trans=== 'object' && trans.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
    return trans.flip();
  }

  for (key in trans) {
    if (!trans.hasOwnProperty(key)) {continue;}
    tmp_ar[trans[key]] = key;
  }

  return tmp_ar;
}
