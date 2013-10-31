function end (arr) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Legaev Andrey
  // +    revised by: J A R
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   restored by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +    revised by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: Uses global: php_js to store the array pointer
  // *     example 1: end({0: 'Kevin', 1: 'van', 2: 'Zonneveld'});
  // *     returns 1: 'Zonneveld'
  // *     example 2: end(['Kevin', 'van', 'Zonneveld']);
  // *     returns 2: 'Zonneveld'
  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.pointers = this.php_js.pointers || [];
  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i;
      }
    }
    return -1;
  };
  // END REDUNDANT
  var pointers = this.php_js.pointers;
  if (!pointers.indexOf) {
    pointers.indexOf = indexOf;
  }
  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0);
  }
  var arrpos = pointers.indexOf(arr);
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    var ct = 0;
    for (var k in arr) {
      ct++;
      var val = arr[k];
    }
    if (ct === 0) {
      return false; // Empty
    }
    pointers[arrpos + 1] = ct - 1;
    return val;
  }
  if (arr.length === 0) {
    return false;
  }
  pointers[arrpos + 1] = arr.length - 1;
  return arr[pointers[arrpos + 1]];
}
