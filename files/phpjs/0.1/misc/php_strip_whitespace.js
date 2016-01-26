function php_strip_whitespace (file) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: This function uses XmlHttpRequest and cannot retrieve resource from different domain.
  // %        note 1: Synchronous so may lock up browser, mainly here for study purposes.
  // %        note 1: To avoid browser blocking issues's consider using jQuery's: $('#divId').load('http://url') instead.
  // -    depends on: file_get_contents
  // *     example 1: php_strip_whitespace('http://kevin.vanzonneveld.net/pj_test_supportfile_1.htm');
  // *     returns 1: '123'
  try {
    var str = this.file_get_contents(file);
  } catch (e) {
    return '';
  }
  // Strip comments (both styles), reduce non-newline whitespace to one, reduce multiple
  // newlines (preceded by any whitespace) to a newline, remove WS at beginning of line,
  // and at end of line
  return str.replace(/\/\/.*?\n/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/[ \f\r\t\v\u00A0\u2028\u2029]+/g, ' ').replace(/\s*\n+/g, '\n').replace(/^\s+/gm, '').replace(/\s*$/gm, '');
}
