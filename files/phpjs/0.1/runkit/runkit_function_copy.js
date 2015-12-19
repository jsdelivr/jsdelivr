function runkit_function_copy (funcname, targetname) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Function can only be copied to and from the global context
  // *     example 1: function plus (a, b) { return (a + b); }
  // *     example 1: runkit_function_copy('plus', 'add');
  // *     returns 1: true
  if (typeof this.window[funcname] !== 'function' || this.window[targetname] !== undefined) { //  (presumably disallow overwriting existing variables)
    return false;
  }
  this.window[targetname] = this.window[funcname];
  return true;
}
