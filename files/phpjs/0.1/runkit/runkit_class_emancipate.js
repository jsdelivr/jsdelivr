function runkit_class_emancipate (classname) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Function can only obtain classes from the global context
  // %          note 2: We have to delete all items on the prototype
  // *     example 1: function A () {}
  // *     example 1: A.prototype.methodA = function () {};
  // *     example 1: function B () {}
  // *     example 1: runkit_class_adopt('B', 'A');
  // *     example 1: runkit_class_emancipate('B');
  // *     returns 1: true

  if (typeof this.window[classname] !== 'function') {
    return false;
  }

  for (var p in this.window[classname].prototype) {
    delete this.window[classname].prototype[p];
  }
  return true;
}
