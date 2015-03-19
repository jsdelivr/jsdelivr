function i18n_loc_set_default (name) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Renamed in PHP6 from locale_set_default(). Not listed yet at php.net
  // %          note 2: List of locales at http://demo.icu-project.org/icu-bin/locexp (use for implementing other locales here)
  // %          note 3: To be usable with sort() if it is passed the SORT_LOCALE_STRING sorting flag: http://php.net/manual/en/function.sort.php
  // *     example 1: i18n_loc_set_default('pt_PT');
  // *     returns 1: true

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  // END REDUNDANT

  this.php_js.i18nLocales = {
    en_US_POSIX: {
      sorting: function (str1, str2) { // Fix: This one taken from strcmp, but need for other locales; we don't use localeCompare since its locale is not settable
        return (str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1);
      }
    }
  };

  this.php_js.i18nLocale = name;
  return true;
}
