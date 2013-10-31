function getenv (varname) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: We are not using $_ENV as in PHP, you could define
  // %        note 1: "$_ENV = this.php_js.ENV;" and get/set accordingly
  // %        note 2: Returns e.g. 'en-US' when set global this.php_js.ENV is set
  // %        note 3: Uses global: php_js to store environment info
  // *     example 1: getenv('LC_ALL');
  // *     returns 1: false
  if (!this.php_js || !this.php_js.ENV || !this.php_js.ENV[varname]) {
    return false;
  }

  return this.php_js.ENV[varname];
}
