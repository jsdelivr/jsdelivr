function method_exists (obj, method) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: function class_a() {this.meth1 = function () {return true;}};
  // *     example 1: var instance_a = new class_a();
  // *     example 1: method_exists(instance_a, 'meth1');
  // *     returns 1: true
  // *     example 2: function class_a() {this.meth1 = function () {return true;}};
  // *     example 2: var instance_a = new class_a();
  // *     example 2: method_exists(instance_a, 'meth2');
  // *     returns 2: false
  if (typeof obj === 'string') {
    return this.window[obj] && typeof this.window[obj][method] === 'function';
  }

  return typeof obj[method] === 'function';
}
