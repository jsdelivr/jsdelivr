function set_include_path (new_include_path) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Should influence require(), include(), fopen(), file(), readfile() and file_get_contents()
  // %          note 1: Paths could conceivably allow multiple paths (separated by semicolon and allowing ".", etc.), by
  // %          note 1: checking first for valid HTTP header at targeted address
  // *     example 1: set_include_path('/php_js');
  // *     returns 1: '/old_incl_path'

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.ini = this.php_js.ini || {};
  // END REDUNDANT
  var old_path = this.php_js.ini.include_path && this.php_js.ini.include_path.local_value;
  if (!old_path) {
    this.php_js.ini.include_path = {
      global_value: new_include_path,
      local_value: new_include_path
    };
  } else {
    this.php_js.ini.include_path.global_value = new_include_path;
    this.php_js.ini.include_path.local_value = new_include_path;
  }
  return old_path;
}
