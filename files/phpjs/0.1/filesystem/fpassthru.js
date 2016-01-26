function fpassthru (handle) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: fopen('http://kevin.vanzonneveld.net/pj_test_supportfile_1.htm', 'r');
  // *     example 1: fpassthru(handle);
  // *     returns 1: 3

  if (!this.php_js || !this.php_js.resourceData || !this.php_js.resourceDataPointer || !handle || !handle.id) {
    return false;
  }

  var chrs = this.php_js.resourceData[handle.id].slice(this.php_js.resourceDataPointer[handle.id]);
  this.echo(chrs);
  this.php_js.resourceDataPointer[handle.id] = this.php_js.resourceData[handle.id].length; // Place pointer at end
  return chrs;
}
