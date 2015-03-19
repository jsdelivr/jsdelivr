function classkit_method_rename (classname, methodname, newname) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: classkit_method_rename('someClass', 'someMethod', 'newMethod');
  // *     returns 1: true

  if (typeof classname === 'string') {
    classname = this.window[classname];
  }

/*
  var method = classname[methodname]; // Static
  classname[newname] = method;
  delete classname[methodname];
  */

  var method = classname.prototype[methodname];
  classname.prototype[newname] = method;
  delete classname.prototype[methodname];

  return true;
}
