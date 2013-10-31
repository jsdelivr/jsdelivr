function date_default_timezone_set (tz) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: timezone_abbreviations_list
  // %        note 1: Uses global: php_js to store the default timezone
  // *     example 1: date_default_timezone_set('unknown');
  // *     returns 1: 'unknown'
  var tal = {},
    abbr = '',
    i = 0;

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  // END REDUNDANT
  // PHP verifies that the timezone is valid and also sets this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST if so
  tal = this.timezone_abbreviations_list();
  for (abbr in tal) {
    for (i = 0; i < tal[abbr].length; i++) {
      if (tal[abbr][i].timezone_id === tz) {
        this.php_js.default_timezone = tz;
        return true;
      }
    }
  }
  return false;
}
