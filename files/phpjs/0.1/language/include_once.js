function include_once (filename) {
  // http://kevin.vanzonneveld.net
  // +   original by: Legaev Andrey
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Michael White (http://getsprink.com)
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: include
  // %        note 1: Uses global: php_js to keep track of included files (though private static variable in namespaced version)
  // *     example 1: include_once('http://www.phpjs.org/js/phpjs/_supporters/pj_test_supportfile_2.js');
  // *     returns 1: true
  var cur_file = {};
  cur_file[this.window.location.href] = 1;

  // BEGIN STATIC
  try { // We can't try to access on window, since it might not exist in some environments, and if we use "this.window"
    //    we risk adding another copy if different window objects are associated with the namespaced object
    php_js_shared; // Will be private static variable in namespaced version or global in non-namespaced
    //   version since we wish to share this across all instances
  } catch (e) {
    php_js_shared = {};
  }
  // END STATIC
  if (!php_js_shared.includes) {
    php_js_shared.includes = cur_file;
  }
  if (!php_js_shared.includes[filename]) {
    if (this.include(filename)) {
      return true;
    }
  } else {
    return true;
  }
  return false;
}
