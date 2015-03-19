function i18n_loc_get_default () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Renamed in PHP6 from locale_get_default(). Not listed yet at php.net
  // %          note 2: List of locales at http://demo.icu-project.org/icu-bin/locexp
  // %          note 3: To be usable with sort() if it is passed the SORT_LOCALE_STRING sorting flag: http://php.net/manual/en/function.sort.php
  // -    depends on: i18n_loc_set_default
  // *     example 1: i18n_loc_get_default();
  // *     returns 1: 'en_US_POSIX'

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  // END REDUNDANT
  return this.php_js.i18nLocale || (i18n_loc_set_default('en_US_POSIX'), 'en_US_POSIX'); // Ensure defaults are set up
}
