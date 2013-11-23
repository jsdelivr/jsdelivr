function classkit_method_redefine (classname, methodname, args, code, flags) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: classkit_method_redefine('someClass', 'someMethod', 'a,b', 'return a+b');
  // *     returns 1: true

  // In JavaScript, this is identical to classkit_method_add

  var argmnts = [],
    func;

  switch (flags) {
  case 'CLASSKIT_ACC_PROTECTED':
    throw 'Protected not supported';
  case 'CLASSKIT_ACC_PRIVATE':
    throw 'Private not supported';
  case 'CLASSKIT_ACC_PUBLIC':
  default:
    break;
  }

  argmnts = args.split(/,\s*/);

  if (typeof classname === 'string') {
    classname = this.window[classname];
  }

  // Could use the following to add as a static method to the class
  //        func = Function.apply(null, argmnts.concat(code));
  //            classname[methodname] = func;
  func = Function.apply(null, argmnts.concat(code));
  classname.prototype[methodname] = func;
  return true;
}
