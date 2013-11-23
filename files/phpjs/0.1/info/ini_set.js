function ini_set (varname, newvalue) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: This will not set a global_value or access level for the ini item
  // *     example 1: ini_set('date.timezone', 'America/Chicago');
  // *     returns 1: 'Asia/Hong_Kong'

  var oldval = '',
    that = this;
  this.php_js = this.php_js || {};
  this.php_js.ini = this.php_js.ini || {};
  this.php_js.ini[varname] = this.php_js.ini[varname] || {};
  oldval = this.php_js.ini[varname].local_value;

  var _setArr = function (oldval) { // Although these are set individually, they are all accumulated
    if (typeof oldval === 'undefined') {
      that.php_js.ini[varname].local_value = [];
    }
    that.php_js.ini[varname].local_value.push(newvalue);
  };

  switch (varname) {
  case 'extension':
    if (typeof this.dl === 'function') {
      this.dl(newvalue); // This function is only experimental in php.js
    }
    _setArr(oldval, newvalue);
    break;
  default:
    this.php_js.ini[varname].local_value = newvalue;
    break;
  }
  return oldval;
}
