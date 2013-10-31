function natsort (inputArr) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Theriault
  // %        note 1: This function deviates from PHP in returning a copy of the array instead
  // %        note 1: of acting by reference and returning true; this was necessary because
  // %        note 1: IE does not allow deleting and re-adding of properties without caching
  // %        note 1: of property position; you can set the ini of "phpjs.strictForIn" to true to
  // %        note 1: get the PHP behavior, but use this only if you are in an environment
  // %        note 1: such as Firefox extensions where for-in iteration order is fixed and true
  // %        note 1: property deletion is supported. Note that we intend to implement the PHP
  // %        note 1: behavior by default if IE ever does allow it; only gives shallow copy since
  // %        note 1: is by reference in PHP anyways
  // -    depends on: strnatcmp
  // *     example 1: $array1 = {a:"img12.png", b:"img10.png", c:"img2.png", d:"img1.png"};
  // *     example 1: $array1 = natsort($array1);
  // *     returns 1: {d: 'img1.png', c: 'img2.png', b: 'img10.png', a: 'img12.png'}
  var valArr = [],
    k, i, ret, that = this,
    strictForIn = false,
    populateArr = {};

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.ini = this.php_js.ini || {};
  // END REDUNDANT
  strictForIn = this.php_js.ini['phpjs.strictForIn'] && this.php_js.ini['phpjs.strictForIn'].local_value && this.php_js.ini['phpjs.strictForIn'].local_value !== 'off';
  populateArr = strictForIn ? inputArr : populateArr;

  // Get key and value arrays
  for (k in inputArr) {
    if (inputArr.hasOwnProperty(k)) {
      valArr.push([k, inputArr[k]]);
      if (strictForIn) {
        delete inputArr[k];
      }
    }
  }
  valArr.sort(function (a, b) {
    return that.strnatcmp(a[1], b[1]);
  });

  // Repopulate the old array
  for (i = 0; i < valArr.length; i++) {
    populateArr[valArr[i][0]] = valArr[i][1];
  }

  return strictForIn || populateArr;
}
