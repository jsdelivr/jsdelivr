function ini_get_all (extension, details) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: The ini values must be set by ini_set or manually within an ini file
  // %        note 1: Store each ini with PHP name and with the values global_value, local_value, and access; be sure to set the same value at the beginning for global and local value
  // %        note 1: If you define an ini file, which sets this.php_js.ini values (window.php_js.ini if you are using the non-namespaced version), be sure to also set php_js.ini_loaded_file
  // %        note 1: equal to its path, for the sake of php_ini_loaded_file() and also set php_js.ini_scanned_files (a comma-separated string of a set of paths, all in the
  // %        note 1: same directory) for the sake of php_ini_scanned_files().
  // *     example 1: ini_get_all('date', false);
  // *     returns 1: {'date.default_latitude':"31.7667", 'date.default_longitude':"35.2333", 'date.sunrise_zenith':"90.583333", 'date.sunset_zenith':"90.583333", date.timezone:""}

  var key = '',
    ini = {},
    noDetails = {},
    extPattern;
  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.ini = this.php_js.ini || {};
  // END REDUNDANT

  if (extension) {
    extPattern = new RegExp('^' + extension + '\\.');
    for (key in this.php_js.ini) {
      extPattern.lastIndex = 0;
      if (extPattern.test(key)) {
        ini[key] = this.php_js.ini[key];
      }
    }
  } else {
    for (key in this.php_js.ini) {
      ini[key] = this.php_js.ini[key];
    }
  }

  if (details !== false) { // default is true
    return ini; // {global_value: '', local_value: '', access: ''};
  }

  for (key in ini) {
    noDetails[key] = ini[key].local_value;
  }
  return noDetails;
}
