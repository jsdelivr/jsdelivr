function putenv (setting) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: We are not using $_ENV as in PHP, you could define
  // %        note 1: "$_ENV = this.php_js.ENV;" and get/set accordingly
  // %        note 2: Uses global: php_js to store environment info
  // *     example 1: putenv('LC_ALL=en-US');
  // *     results 1: true
  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.ENV = this.php_js.ENV || {};
  // END REDUNDANT
  var pos = setting.indexOf('=');
  this.php_js.ENV[setting.slice(0, pos)] = setting.slice(pos + 1);
  return true;
}
