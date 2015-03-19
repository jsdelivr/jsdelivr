function array_map (callback) {
  // http://kevin.vanzonneveld.net
  // +   original by: Andrea Giammarchi (http://webreflection.blogspot.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   input by: thekid
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: If the callback is a string (or object, if an array is supplied), it can only work if the function name is in the global context
  // *     example 1: array_map( function (a){return (a * a * a)}, [1, 2, 3, 4, 5] );
  // *     returns 1: [ 1, 8, 27, 64, 125 ]
  var argc = arguments.length,
    argv = arguments,
    glbl = this.window,
    obj = null,
    cb = callback,
    j = argv[1].length,
    i = 0,
    k = 1,
    m = 0,
    tmp = [],
    tmp_ar = [];

  while (i < j) {
    while (k < argc) {
      tmp[m++] = argv[k++][i];
    }

    m = 0;
    k = 1;

    if (callback) {
      if (typeof callback === 'string') {
        cb = glbl[callback];
      }
      else if (typeof callback === 'object' && callback.length) {
        obj = typeof callback[0] === 'string' ? glbl[callback[0]] : callback[0];
        if (typeof obj === 'undefined') {
          throw 'Object not found: ' + callback[0];
        }
        cb = typeof callback[1] === 'string' ? obj[callback[1]] : callback[1];
      }
      tmp_ar[i++] = cb.apply(obj, tmp);
    } else {
      tmp_ar[i++] = tmp;
    }

    tmp = [];
  }

  return tmp_ar;
}
