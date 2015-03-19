function get_class_vars (name) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: function Myclass(){privMethod = function (){};}
  // *     example 1: Myclass.classMethod = function () {}
  // *     example 1: Myclass.prototype.myfunc1 = function () {return(true);};
  // *     example 1: Myclass.prototype.myfunc2 = function () {return(true);}
  // *     example 1: get_class_vars('MyClass')
  // *     returns 1: {}

  var constructor, retArr = {},
    prop = '';

  if (typeof name === 'function') {
    constructor = name;
  } else if (typeof name === 'string') {
    constructor = this.window[name];
  }

  for (prop in constructor) {
    if (typeof constructor[prop] !== 'function' && prop !== 'prototype') {
      retArr[prop] = constructor[prop];
    }
  }
  // Comment out this block to behave as "class" is usually defined in JavaScript convention
  if (constructor.prototype) {
    for (prop in constructor.prototype) {
      if (typeof constructor.prototype[prop] !== 'function') {
        retArr[prop] = constructor.prototype[prop];
      }
    }
  }

  return retArr;
}
