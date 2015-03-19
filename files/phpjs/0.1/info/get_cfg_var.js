function get_cfg_var (varname) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: The ini values must be set within an ini file
  // *     example 1: get_cfg_var('date.timezone');
  // *     returns 1: 'Asia/Hong_Kong'
  if (this.php_js && this.php_js.ini && this.php_js.ini[varname].global_value !== undefined) {
    if (this.php_js.ini[varname].global_value === null) {
      return '';
    }
    return this.php_js.ini[varname].global_value;
  }
  return '';
}
