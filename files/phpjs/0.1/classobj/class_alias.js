function class_alias (clss, alias, autoload) {
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: This function is not documented and only available in PHP source
  // *     example 1: function someFunc () {}
  // *     example 1: class_alias('someFunc', 'olFunc');
  // *     returns 1: true

  var getFuncName = function (fn) {
    var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
    if (!name) {
      return '(Anonymous)';
    }
    return name[1];
  };
  if (autoload && typeof this.window.__autoload === 'function') {
    this.window.__autoload(clss);
  }
  if (typeof clss === 'string') {
    clss = this.window[clss];
  }
  if (typeof clss === 'undefined') {
    throw "Class '" + getFuncName(clss) + "' not found";
    return false; // Return false until replace throw with error triggering
  }
  if (typeof clss !== 'function') {
    throw 'First argument of class_alias() must be a name of user defined class';
    return false;
  }
  if (typeof this.window[alias] === 'function') {
    throw 'Cannot redeclare class ' + alias;
    return false;
  }

  this.window[alias] = clss;
  return true;
}
