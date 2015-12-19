function localeconv () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: setlocale
  // *     example 1: localeconv();
  // *     returns 1: {decimal_point: '.', thousands_sep: ',', positive_sign: '', negative_sign: '-', int_frac_digits: 2, frac_digits: 2, p_cs_precedes: 1, p_sep_by_space: 0, n_cs_precedes: 1, n_sep_by_space: 0, p_sign_posn: 3, n_sign_posn: 0, grouping: 3, int_curr_symbol: 'USD', currency_symbol: '$', mon_decimal_point: '.', mon_thousands_sep: ',', mon_grouping: 3}
  var arr = {},
    prop = '';

  // BEGIN REDUNDANT
  this.setlocale('LC_ALL', 0); // ensure setup of localization variables takes place, if not already
  // END REDUNDANT
  // Make copies
  for (prop in this.php_js.locales[this.php_js.localeCategories.LC_NUMERIC].LC_NUMERIC) {
    arr[prop] = this.php_js.locales[this.php_js.localeCategories.LC_NUMERIC].LC_NUMERIC[prop];
  }
  for (prop in this.php_js.locales[this.php_js.localeCategories.LC_MONETARY].LC_MONETARY) {
    arr[prop] = this.php_js.locales[this.php_js.localeCategories.LC_MONETARY].LC_MONETARY[prop];
  }

  return arr;
}
