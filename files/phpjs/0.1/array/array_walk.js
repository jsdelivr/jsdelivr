function array_walk (array, funcname, userdata) {
  // http://kevin.vanzonneveld.net
  // +   original by: Johnny Mast (http://www.phpvrouwen.nl)
  // +   bugfixed by: David
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // %   note 1: Using ini_set('phpjs.no-eval', true) will only work with
  // %   note 1:  user-defined string functions, not built-in functions like void()
  // *     example 1: array_walk ({'a':'b'}, 'void', 'userdata');
  // *     returns 1: true
  // *     example 2: array_walk ('a', 'void', 'userdata');
  // *     returns 2: false
  // *     example 3: array_walk ([3, 4], function () {}, 'userdata');
  // *     returns 3: true
  // *     example 4: array_walk ({40: 'My age', 50: 'My IQ'}, [window, 'prompt']);
  // *     returns 4: true
  // *     example 5: ini_set('phpjs.return_phpjs_arrays', 'on');
  // *     example 5: var arr = array({40: 'My age'}, {50: 'My IQ'});
  // *     example 5: array_walk(arr, [window, 'prompt']);
  // *     returns 5: [object Object]
  var key, value, ini;

  if (!array || typeof array !== 'object') {
    return false;
  }
  if (typeof array === 'object' && array.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
    if (arguments.length > 2) {
      return array.walk(funcname, userdata);
    }
    else {
      return array.walk(funcname);
    }
  }

  try {
    if (typeof funcname === 'function') {
      for (key in array) {
        if (arguments.length > 2) {
          funcname(array[key], key, userdata);
        }
        else {
          funcname(array[key], key);
        }
      }
    }
    else if (typeof funcname === 'string') {
      this.php_js = this.php_js || {};
      this.php_js.ini = this.php_js.ini || {};
      ini = this.php_js.ini['phpjs.no-eval'];
      if (ini && (
        parseInt(ini.local_value, 10) !== 0 && (!ini.local_value.toLowerCase || ini.local_value.toLowerCase() !== 'off')
      )) {
        if (arguments.length > 2) {
          for (key in array) {
            this.window[funcname](array[key], key, userdata);
          }
        }
        else {
          for (key in array) {
            this.window[funcname](array[key], key);
          }
        }
      }
      else {
        if (arguments.length > 2) {
          for (key in array) {
            eval(funcname + '(array[key], key, userdata)');
          }
        }
        else {
          for (key in array) {
            eval(funcname + '(array[key], key)');
          }
        }
      }
    }
    else if (funcname && typeof funcname === 'object' && funcname.length === 2) {
      var obj = funcname[0], func = funcname[1];
      if (arguments.length > 2) {
        for (key in array) {
          obj[func](array[key], key, userdata);
        }
      }
      else {
        for (key in array) {
          obj[func](array[key], key);
        }
      }
    }
    else {
      return false;
    }
  }
  catch (e) {
    return false;
  }

  return true;
}
