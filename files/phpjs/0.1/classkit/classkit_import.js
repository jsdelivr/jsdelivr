function classkit_import (file) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: file_get_contents
  // %        note 1: does not return an associative array as in PHP
  // %        note 2: Implement instead with include?
  // %        note 3: CLASSKIT_AGGREGATE_OVERRIDE is mentioned as a flag at http://www.php.net/manual/en/runkit.constants.php but not in classkit docs
  // *     example 1: classkit_import('http://example.com/somefile.js');
  // *     returns 1: undefined

  eval(this.file_get_contents(file));
}
