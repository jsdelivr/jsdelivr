function error_get_last () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: error_get_last();
  // *     returns 1: null
  // *     example 2: error_get_last();
  // *     returns 2: {type: 256, message: 'My user error', file: 'C:\WWW\index.php', line: 2}

  return this.php_js && this.php_js.last_error ? this.php_js.last_error : null; // Only set if error triggered within at() or trigger_error()
}
