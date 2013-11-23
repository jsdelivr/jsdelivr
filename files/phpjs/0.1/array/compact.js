function compact () {
  // http://kevin.vanzonneveld.net
  // +   original by: Waldo Malqui Silva
  // +    tweaked by: Jack
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // *     example 1: var1 = 'Kevin'; var2 = 'van'; var3 = 'Zonneveld';
  // *     example 1: compact('var1', 'var2', 'var3');
  // *     returns 1: {'var1': 'Kevin', 'var2': 'van', 'var3': 'Zonneveld'}
  var matrix = {},
    that = this;

  var process = function (value) {
    var i = 0,
      l = value.length,
      key_value = '';
    for (i = 0; i < l; i++) {
      key_value = value[i];
      if (Object.prototype.toString.call(key_value) === '[object Array]') {
        process(key_value);
      } else {
        if (typeof that.window[key_value] !== 'undefined') {
          matrix[key_value] = that.window[key_value];
        }
      }
    }
    return true;
  };

  process(arguments);
  return matrix;
}
