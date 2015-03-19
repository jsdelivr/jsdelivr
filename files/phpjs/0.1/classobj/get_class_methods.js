function get_class_methods (name) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: function Myclass () {this.privMethod = function (){}}
  // *     example 1: Myclass.classMethod = function () {}
  // *     example 1: Myclass.prototype.myfunc1 = function () {return(true);};
  // *     example 1: Myclass.prototype.myfunc2 = function () {return(true);}
  // *     example 1: get_class_methods('MyClass')
  // *     returns 1: {}
  var constructor, retArr = {},
    method = '';

  if (typeof name === 'function') {
    constructor = name;
  } else if (typeof name === 'string') {
    constructor = this.window[name];
  } else if (typeof name === 'object') {
    constructor = name;
    for (method in constructor.constructor) { // Get class methods of object's constructor
      if (typeof constructor.constructor[method] === 'function') {
        retArr[method] = constructor.constructor[method];
      }
    }
    // return retArr; // Uncomment to behave as "class" is usually defined in JavaScript convention (and see comment below)
  }
  for (method in constructor) {
    if (typeof constructor[method] === 'function') {
      retArr[method] = constructor[method];
    }
  }
  // Comment out this block to behave as "class" is usually defined in JavaScript convention (and see comment above)
  for (method in constructor.prototype) {
    if (typeof constructor.prototype[method] === 'function') {
      retArr[method] = constructor.prototype[method];
    }
  }

  return retArr;
}
