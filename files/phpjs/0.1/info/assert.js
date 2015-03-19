function assert (assertion) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Do not pass untrusted user input to assert() in string form (you can test it beforehand though)
  // %          note 2: Does not provide perfect arguments to the assertion callback, as far as file location or line number
  // *     example 1: assert('false === true');
  // *     returns 1: false

  var result = false,
    callback, retVal, err = undefined;

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.ini = this.php_js.ini || {};
  this.php_js.assert_values = this.php_js.assert_values || {};
  // END REDUNDANT

  var getOption = function (value) {
    if (this.php_js.assert_values[value]) {
      return this.php_js.assert_values[value];
    }
    if (this.php_js.ini[value]) {
      return this.php_js.ini[value].local_value;
    }
    switch (value) {
    case 'assert.active':
      return 1;
    case 'assert.warning':
      // Don't need this now
      //return 1;
      throw 'We have not yet implemented warnings in JavaScript (assert())';
    case 'assert.bail':
      return 0;
    case 'assert.quiet_eval':
      return 0;
    case 'assert.callback':
      return null;
    default:
      throw 'There was some problem';
    }
  };

  if (!getOption('assert.active')) {
    return false; // is this correct? should callbacks still execute? Should still bail if on?
  }

  try { // Less overhead to use string when assertion checking is off, allows message of exact code to callback
    result = typeof assertion === 'string' ? eval(assertion) : assertion;
  } catch (e) {
    if (!getOption('assert.quiet_eval')) {
      throw e;
    }
    err = e;
    result = false;
  }
  retVal = result !== false; // return false if false, otherwise, return true
  if (retVal === false) {
    if (getOption('assert.bail')) { // Todo: Will the function bail before a callback or after?
      throw 'Assertion bailed'; // No way to bail without throwing an exception (and there are no "warnings" in JavaScript for us to throw)
    }
    callback = getOption('assert.callback');
    if (typeof callback === 'string') {
      callback = this.window[callback];
    }
    // Not perfect for file location (might also use __FILE__()) or line number
    callback(this.window.location.href, err && err.lineNumber, (typeof assertion === 'string' ? assertion : '')); // From the docs, what does this mean?: "the third argument will contain the expression that failed (if any - literal values such as 1 or "two" will not be passed via this argument)"
  }
  return retVal;
}
