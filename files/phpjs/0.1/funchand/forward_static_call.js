function forward_static_call (cb, parameters) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: No real relevance to late static binding here; might also use call_user_func()
  // *     example 1: forward_static_call('isNaN', 'a');
  // *     returns 1: true

  var func;

  if (typeof cb === 'string') {
    if (typeof this[cb] === 'function') {
      func = this[cb];
    } else {
      func = (new Function(null, 'return ' + cb))();
    }
  }
  else if (Object.prototype.toString.call(cb) === '[object Array]') {
    func = eval(cb[0] + "['" + cb[1] + "']");
  }

  if (typeof func !== 'function') {
    throw new Error(func + ' is not a valid function');
  }

  return func.apply(null, Array.prototype.slice.call(arguments, 1));
}
