function aggregate_info (obj) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: var A = function () {};
  // *     example 1: A.prop = 5;
  // *     example 1: A.prototype.someMethod = function () {};
  // *     example 1: var b = {};
  // *     example 1: aggregate(b, 'A');
  // *     example 1: aggregate_info(b);
  // *     returns 1: {'A':{methods:['someMethod'], properties:['prop']}}

  var idx = -1,
    p = '',
    infoObj = {},
    retObj = {},
    i = 0,
    name = '';
  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i;
      }
    }
    return -1;
  };

  if (!this.php_js || !this.php_js.aggregateRecords || !this.php_js.aggregateKeys || !this.php_js.aggregateClasses) {
    return false; // Is this what is returned?
  }

  if (!this.php_js.aggregateKeys.indexOf) {
    this.php_js.aggregateKeys.indexOf = indexOf;
  }
  idx = this.php_js.aggregateKeys.indexOf(obj);
  if (idx === -1) {
    return false;
  }

  for (i = 0; i < this.php_js.aggregateClasses[idx].length; i++) {
    name = this.php_js.aggregateClasses[idx][i];
    infoObj = {
      methods: [],
      properties: []
    };
    for (p in this.php_js.aggregateRecords[idx][i]) {
      if (typeof this.php_js.aggregateRecords[idx][i][p] === 'function') {
        infoObj.methods.push(p);
      } else {
        infoObj.properties.push(p);
      }
    }
    retObj[name] = infoObj;
  }

  return retObj;
}
