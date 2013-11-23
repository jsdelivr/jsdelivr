function aggregation_info (obj) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: aggregate_info
  // *     example 1: var A = function () {};
  // *     example 1: A.prop = 5;
  // *     example 1: A.prototype.someMethod = function () {};
  // *     example 1: var b = {};
  // *     example 1: aggregate(b, 'A');
  // *     example 1: aggregation_info(b);
  // *     returns 1: {'A':{methods:['someMethod'], properties:['prop']}}

  return this.aggregate_info(obj);
}
