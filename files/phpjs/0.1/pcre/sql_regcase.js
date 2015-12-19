function sql_regcase (str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: setlocale
  // *     example 1: sql_regcase('Foo - bar.');
  // *     returns 1: '[Ff][Oo][Oo] - [Bb][Aa][Rr].'
  this.setlocale('LC_ALL', 0);
  var i = 0,
    upper = '',
    lower = '',
    pos = 0,
    retStr = '';

  upper = this.php_js.locales[this.php_js.localeCategories.LC_CTYPE].LC_CTYPE.upper;
  lower = this.php_js.locales[this.php_js.localeCategories.LC_CTYPE].LC_CTYPE.lower;

  for (i = 0; i < str.length; i++) {
    if (((pos = upper.indexOf(str.charAt(i))) !== -1) || ((pos = lower.indexOf(str.charAt(i))) !== -1)) {
      retStr += '[' + upper.charAt(pos) + lower.charAt(pos) + ']';
    } else {
      retStr += str.charAt(i);
    }
  }
  return retStr;
}
