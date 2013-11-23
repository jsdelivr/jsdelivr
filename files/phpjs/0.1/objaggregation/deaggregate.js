function deaggregate (obj, class_name) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: var A = function () {};
  // *     example 1: A.prop = 5;
  // *     example 1: A.prototype.someMethod = function () {};
  // *     example 1: var b = {};
  // *     example 1: aggregate(b, 'A');
  // *     example 1: deaggregate(b, 'A');
  // *     returns 1: undefined

  var p = '',
    idx = -1,
    pos = -1,
    i = 0,
    indexOf = function (value) {
      for (var i = 0, length = this.length; i < length; i++) {
        if (this[i] === value) {
          return i;
        }
      }
      return -1;
    },
    getFuncName = function (fn) {
      var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
      if (!name) {
        return '(Anonymous)';
      }
      return name[1];
    };

  if (!this.php_js || !this.php_js.aggregateRecords || !this.php_js.aggregateKeys || !this.php_js.aggregateClasses) {
    return;
  }

  if (!this.php_js.aggregateKeys.indexOf) {
    this.php_js.aggregateKeys.indexOf = indexOf;
  }
  idx = this.php_js.aggregateKeys.indexOf(obj);
  if (idx === -1) {
    return;
  }

  if (class_name) {
    if (typeof class_name === 'string') { // PHP behavior
      class_name = this.window[class_name];
    }
    if (!this.php_js.aggregateClasses[idx].indexOf) {
      this.php_js.aggregateClasses[idx].indexOf = indexOf;
    }
    pos = this.php_js.aggregateClasses[idx].indexOf(getFuncName(class_name));
    if (pos !== -1) {
      for (p in this.php_js.aggregateRecords[idx][pos]) {
        delete obj[p];
      }
      this.php_js.aggregateClasses[idx].splice(pos, 1);
      this.php_js.aggregateRecords[idx].splice(pos, 1);
    }
  } else {
    for (i = 0; i < this.php_js.aggregateClasses[idx].length; i++) {
      for (p in this.php_js.aggregateRecords[idx][i]) {
        delete obj[p];
      }
    }
    this.php_js.aggregateClasses.splice(idx, 1);
    this.php_js.aggregateRecords.splice(idx, 1);
  }
}
