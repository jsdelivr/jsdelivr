function runkit_function_rename (funcname, newname) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Function can only be copied to and from the global context
  // *     example 1: function plus (a, b) { return (a + b); }
  // *     example 1: runkit_function_rename('plus', 'add');
  // *     returns 1: true
  if (typeof this.window[newname] !== 'function' || this.window[funcname] !== undefined) { //  (presumably disallow overwriting existing variables)
    return false;
  }
  this.window[newname] = this.window[funcname];
  this.window[funcname] = undefined;
  return true;
}
