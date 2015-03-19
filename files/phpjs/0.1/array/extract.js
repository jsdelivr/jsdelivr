function extract (arr, type, prefix) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: Only works by extracting into global context (whether called in the global scope or
  // %        note 1: within a function); also, the EXTR_REFS flag I believe can't be made to work
  // *     example 1: size = 'large';
  // *     example 1: var_array = {'color' : 'blue', 'size' : 'medium', 'shape' : 'sphere'};
  // *     example 1: extract(var_array, 'EXTR_PREFIX_SAME', 'wddx');
  // *     example 1: color+'-'+size+'-'+shape+'-'+wddx_size;
  // *     returns 1: 'blue-large-sphere-medium'
  if (Object.prototype.toString.call(arr) === '[object Array]' &&
    (type !== 'EXTR_PREFIX_ALL' && type !== 'EXTR_PREFIX_INVALID')) {
    return 0;
  }
  var targetObj = this.window;
  if (this.php_js && this.php_js.ini && this.php_js.ini['phpjs.extractTargetObj'] && this.php_js.ini['phpjs.extractTargetObj'].local_value) { // Allow designated object to be used instead of window
    targetObj = this.php_js.ini['phpjs.extractTargetObj'].local_value;
  }
  var chng = 0;

  for (var i in arr) {
    var validIdent = /^[_a-zA-Z$][\w|$]*$/; // TODO: Refine regexp to allow JS 1.5+ Unicode identifiers
    var prefixed = prefix + '_' + i;
    try {
      switch (type) {
      case 'EXTR_PREFIX_SAME' || 2:
        if (targetObj[i] !== undefined) {
          if (prefixed.match(validIdent) !== null) {
            targetObj[prefixed] = arr[i];
            ++chng;
          }
        } else {
          targetObj[i] = arr[i];
          ++chng;
        }
        break;
      case 'EXTR_SKIP' || 1:
        if (targetObj[i] === undefined) {
          targetObj[i] = arr[i];
          ++chng;
        }
        break;
      case 'EXTR_PREFIX_ALL' || 3:
        if (prefixed.match(validIdent) !== null) {
          targetObj[prefixed] = arr[i];
          ++chng;
        }
        break;
      case 'EXTR_PREFIX_INVALID' || 4:
        if (i.match(validIdent) !== null) {
          if (prefixed.match(validIdent) !== null) {
            targetObj[prefixed] = arr[i];
            ++chng;
          }
        } else {
          targetObj[i] = arr[i];
          ++chng;
        }
        break;
      case 'EXTR_IF_EXISTS' || 6:
        if (targetObj[i] !== undefined) {
          targetObj[i] = arr[i];
          ++chng;
        }
        break;
      case 'EXTR_PREFIX_IF_EXISTS' || 5:
        if (targetObj[i] !== undefined && prefixed.match(validIdent) !== null) {
          targetObj[prefixed] = arr[i];
          ++chng;
        }
        break;
      case 'EXTR_REFS' || 256:
        throw 'The EXTR_REFS type will not work in JavaScript';
      case 'EXTR_OVERWRITE' || 0:
        // Fall-through
      default:
        targetObj[i] = arr[i];
        ++chng;
        break;
      }
    } catch (e) { // Just won't increment for problem assignments
    }
  }
  return chng;
}
