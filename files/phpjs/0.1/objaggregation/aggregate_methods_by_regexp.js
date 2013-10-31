function aggregate_methods_by_regexp (obj, class_name, regexp, exclude) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: We can't copy privileged methods, as those require instantiation (with potential side-effects when called)
  // %          note 1: We've chosen not to assign to or create a prototype object on the destination object even if the original object had the methods on its prototype
  // *     example 1: var A = function () {};
  // *     example 1: A.prototype.method = function () {};
  // *     example 1: var b = {};
  // *     example 1: aggregate_methods_by_regexp(b, 'A', /^meth/, false);
  // *     returns 1: undefined

  var p = '',
    test = false,
    record = {},
    pos = -1,
    indexOf = function (value) {
      for (var i = 0, length = this.length; i < length; i++) {
        if (this[i] === value) {
          return i;
        }
      }
      return -1;
    };

  if (typeof regexp === 'string') { // If passing the regular expression as a string, note that this behavior may change in the future as we seek to implement PHP-style regexp (e.g., delimiteres and modifier flags within the string)
    regexp = eval(regexp);
  }

  if (typeof class_name === 'string') { // PHP behavior
    class_name = this.window[class_name];
  }

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.aggregateKeys = this.php_js.aggregateKeys || [];
  this.php_js.aggregateRecords = this.php_js.aggregateRecords || []; // Needed to allow deaggregate() and aggregate_info()
  this.php_js.aggregateClasses = this.php_js.aggregateClasses || [];
  var getFuncName = function (fn) {
    var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
    if (!name) {
      return '(Anonymous)';
    }
    return name[1];
  };
  // END REDUNDANT
  this.php_js.aggregateClasses.push(getFuncName(class_name));

  for (p in class_name) {
    test = exclude ? p.search(regexp) === -1 : p.search(regexp) !== -1;
    if (!(p in obj) && typeof class_name[p] === 'function' && p[0] !== '_' && test) { // Static (non-private) class methods
      obj[p] = class_name[p];
      record[p] = class_name[p];
    }
  }
  for (p in class_name.prototype) {
    test = exclude ? p.search(regexp) === -1 : p.search(regexp) !== -1;
    if (!(p in obj) && typeof class_name.prototype[p] === 'function' && p[0] !== '_' && test) { // Prototype (non-private) instance methods
      obj[p] = class_name.prototype[p];
      record[p] = class_name.prototype[p];
    }
  }
  if (!this.php_js.aggregateKeys.indexOf) {
    this.php_js.aggregateKeys.indexOf = indexOf;
  }
  pos = this.php_js.aggregateKeys.indexOf(obj);
  if (pos !== -1) {
    this.php_js.aggregateRecords[pos].push(record);
    this.php_js.aggregateClasses[pos].push(getFuncName(class_name));
  } else {
    this.php_js.aggregateKeys.push(obj);
    this.php_js.aggregateRecords.push([record]);
    this.php_js.aggregateClasses[0] = [];
    this.php_js.aggregateClasses[0].push(getFuncName(class_name));
  }
}
