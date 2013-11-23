function array_fill_keys (keys, value) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: keys = {'a': 'foo', 2: 5, 3: 10, 4: 'bar'}
  // *     example 1: array_fill_keys(keys, 'banana')
  // *     returns 1: {"foo": "banana", 5: "banana", 10: "banana", "bar": "banana"}
  var retObj = {},
    key = '';

  for (key in keys) {
    retObj[keys[key]] = value;
  }

  return retObj;
}
