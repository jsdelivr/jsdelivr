function runkit_function_remove (funcname) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Function can only remove from the global context
  // *     example 1: function add (a, b, c) {return a+b+c;}
  // *     example 1: runkit_function_remove('add');
  // *     returns 1: true
  if (this.window[funcname] === undefined) { // Requires existing function?
    return false;
  }

  try {
    this.window[funcname] = undefined;
  } catch (e) {
    return false;
  }
  return true;
}
