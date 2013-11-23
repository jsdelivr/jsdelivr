function assert_options (what, value) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: assert_options('ASSERT_CALLBACK');
  // *     returns 1: null

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.ini = this.php_js.ini || {};
  this.php_js.assert_values = this.php_js.assert_values || {};
  // END REDUNDANT

  var ini, dflt;
  switch (what) {
  case 'ASSERT_ACTIVE':
    ini = 'assert.active';
    dflt = 1;
    break;
  case 'ASSERT_WARNING':
    ini = 'assert.warning';
    dflt = 1;
    throw 'We have not yet implemented warnings for us to throw in JavaScript (assert_options())';
  case 'ASSERT_BAIL':
    ini = 'assert.bail';
    dflt = 0;
    break;
  case 'ASSERT_QUIET_EVAL':
    ini = 'assert.quiet_eval';
    dflt = 0;
    break;
  case 'ASSERT_CALLBACK':
    ini = 'assert.callback';
    dflt = null;
    break;
  default:
    throw 'Improper type for assert_options()';
  }
  // I presume this is to be the most recent value, instead of the default value
  var originalValue = this.php_js.assert_values[ini] || (this.php_js.ini[ini] && this.php_js.ini[ini].local_value) || dflt;

  if (value) {
    this.php_js.assert_values[ini] = value; // We use 'ini' instead of 'what' as key to be more convenient for assert() to test for current value
  }
  return originalValue;
}
