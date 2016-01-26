function restore_include_path () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: restore_include_path();
  // *     returns 1: undefined

  if (this.php_js && this.php_js.ini && this.php_js.ini.include_path) {
    this.php_js.ini.include_path.local_value = this.php_js.ini.include_path.global_value;
  }
}
