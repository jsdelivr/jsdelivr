function feof (handle) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: var handle = fopen('http://kevin.vanzonneveld.net/pj_test_supportfile_1.htm', 'r');
  // *     example 1: fread(handle, 1);
  // *     example 1: feof(handle);
  // *     returns 1: false

  if (!handle || !this.php_js || !this.php_js.resourceData || !this.php_js.resourceDataPointer) {
    return true;
  }

  return !this.php_js.resourceData[handle.id][this.php_js.resourceDataPointer[handle.id]];

}
