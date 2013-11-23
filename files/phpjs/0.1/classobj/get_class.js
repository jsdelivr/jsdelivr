function get_class (obj) {
  // http://kevin.vanzonneveld.net
  // +   original by: Ates Goral (http://magnetiq.com)
  // +   improved by: David James
  // +   improved by: David Neilsen
  // *     example 1: get_class(new (function MyClass() {}));
  // *     returns 1: "MyClass"
  // *     example 2: get_class({});
  // *     returns 2: "Object"
  // *     example 3: get_class([]);
  // *     returns 3: false
  // *     example 4: get_class(42);
  // *     returns 4: false
  // *     example 5: get_class(window);
  // *     returns 5: false
  // *     example 6: get_class(function MyFunction() {});
  // *     returns 6: false
  if (obj && typeof obj === 'object' &&
      Object.prototype.toString.call(obj) !== '[object Array]' &&
      obj.constructor && obj !== this.window) {
    var arr = obj.constructor.toString().match(/function\s*(\w+)/);

    if (arr && arr.length === 2) {
      return arr[1];
    }
  }

  return false;
}
