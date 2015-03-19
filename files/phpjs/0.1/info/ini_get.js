function ini_get (varname) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: The ini values must be set by ini_set or manually within an ini file
  // *     example 1: ini_get('date.timezone');
  // *     returns 1: 'Asia/Hong_Kong'
  if (this.php_js && this.php_js.ini && this.php_js.ini[varname] && this.php_js.ini[varname].local_value !== undefined) {
    if (this.php_js.ini[varname].local_value === null) {
      return '';
    }
    return this.php_js.ini[varname].local_value;
  }
  return '';
}
