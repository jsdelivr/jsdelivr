function strcoll (str1, str2) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: setlocale
  // *     example 1: strcoll('a', 'b');
  // *     returns 1: -1
  this.setlocale('LC_ALL', 0); // ensure setup of localization variables takes place
  var cmp = this.php_js.locales[this.php_js.localeCategories.LC_COLLATE].LC_COLLATE;
  // return str1.localeCompare(str2); // We don't use this as it doesn't allow us to control it via setlocale()
  return cmp(str1, str2);
}
