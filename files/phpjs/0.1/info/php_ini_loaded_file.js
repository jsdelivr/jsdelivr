function php_ini_loaded_file () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: This string representing the path of the main ini file must be manually set by the script to this.php_js.ini_loaded_file
  // *     example 1: php_ini_loaded_file();
  // *     returns 1: 'myini.js'
  if (!this.php_js || !this.php_js.ini_loaded_file) {
    return false;
  }
  return this.php_js.ini_loaded_file;
}
