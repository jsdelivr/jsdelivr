function fgetss (handle, length, allowable_tags) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: strip_tags
  // *     example 1: fopen('http://kevin.vanzonneveld.net/pj_test_supportfile_1.htm', 'r');
  // *     example 1: fgetss(handle, 4096, 'a');
  // *     returns 1: ''

  var start = 0,
    fullline = '';

  if (!this.php_js || !this.php_js.resourceData || !this.php_js.resourceDataPointer || length !== undefined && !length) {
    return false;
  }

  start = this.php_js.resourceDataPointer[handle.id];

  if (start === undefined || !this.php_js.resourceData[handle.id][start]) {
    return false; // Resource was already closed or already reached the end of the file
  }

  fullline = this.php_js.resourceData[handle.id].slice(start, this.php_js.resourceData[handle.id].indexOf('\n', start) + 1);
  if (fullline === '') {
    fullline = this.php_js.resourceData[handle.id].slice(start); // Get to rest of the file
  }

  length = (length === undefined || fullline.length < length) ? fullline.length : Math.floor(length / 2) || 1; // two bytes per character (or surrogate), but ensure at least one

  this.php_js.resourceDataPointer[handle.id] += length - 1;
  return this.strip_tags(this.php_js.resourceData[handle.id].substr(start, length), allowable_tags);
}
