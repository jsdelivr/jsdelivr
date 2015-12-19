function runkit_method_remove (classname, methodname) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: runkit_method_remove('someClass', 'someMethod');
  // *     returns 1: true
  if (typeof classname === 'string') {
    classname = this.window[classname];
  }
  if (getFuncName(classname) !== 'PHP_JS' || // By default, don't allow overriding of PHP functions
  (this.php_js && this.php_js.ini && this.php_js.ini['runkit.internal_override'] && (this.php_js.ini['runkit.internal_override'].local_value === true || this.php_js.ini['runkit.internal_override'].local_value === 1 || this.php_js.ini['runkit.internal_override'].local_value === '1' || this.php_js.ini['runkit.internal_override'].local_value === 'true'))) {
    delete classname.prototype[methodname]; // Delete any on prototype
    return true;
  }
  // delete classname[methodname]; // Delete any as static class method
  return false;
}
