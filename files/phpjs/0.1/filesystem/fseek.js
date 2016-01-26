function fseek (handle, offset, whence) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: var h = fopen('http://kevin.vanzonneveld.net/pj_test_supportfile_1.htm', 'r');
  // *     example 1: fseek(h, 100);
  // *     returns 1: 0

  var getFuncName = function (fn) {
    var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
    if (!name) {
      return '(Anonymous)';
    }
    return name[1];
  };
  if (!this.php_js || !this.php_js.resourceData || !this.php_js.resourceDataPointer || !handle || !handle.constructor || getFuncName(handle.constructor) !== 'PHPJS_Resource') {
    return -1;
  }

  switch (whence) {
  case undefined:
    // fall-through
  case 'SEEK_SET':
    this.php_js.resourceDataPointer[handle.id] = offset / 2 + 1;
    break;
  case 'SEEK_CUR':
    this.php_js.resourceDataPointer[handle.id] += offset / 2 + 1;
    break;
  case 'SEEK_END':
    this.php_js.resourceDataPointer[handle.id] = this.php_js.resourceData[handle.id].length + offset / 2 + 1;
    break;
  default:
    throw 'Unrecognized whence value for fseek()';
  }
  return 0;
}
