function defined (constant_name) {
  // http://kevin.vanzonneveld.net
  // +   original by: Waldo Malqui Silva
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +    revised by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Because this function can (albeit only temporarily) overwrite a global variable,
  // %          note 1: it is not thread-safe (normally not a concern for JavaScript, but would be if used
  // %          note 1: in a threaded environment, e.g., DOM worker threads)
  // *     example 1: defined('IMAGINARY_CONSTANT1');
  // *     returns 1: false
  var tmp = this.window[constant_name];

  this.window[constant_name] = this.window[constant_name] ? 'changed' + this.window[constant_name].toString() : 'changed';
  var returnval = this.window[constant_name] === tmp;
  if (!returnval) { // Reset
    this.window[constant_name] = tmp;
  }

  return returnval;
}
