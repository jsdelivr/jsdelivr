function function_exists (func_name) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Steve Clay
  // +   improved by: Legaev Andrey
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: function_exists('isFinite');
  // *     returns 1: true

  if (typeof func_name === 'string') {
    func_name = this.window[func_name];
  }
  return typeof func_name === 'function';
}
