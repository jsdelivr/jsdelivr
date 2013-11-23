function include (filename) {
  // http://kevin.vanzonneveld.net
  // +   original by: mdsjack (http://www.mdsjack.bo.it)
  // +   improved by: Legaev Andrey
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Michael White (http://getsprink.com)
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      bugfixed by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: Force Javascript execution to pause until the file is loaded. Usually causes failure if the file never loads. ( Use sparingly! )
  // %        note 2: The included file does not come available until a second script block, so typically use this in the header.
  // %        note 3: Uses global: php_js to keep track of included files
  // *     example 1: include('http://www.phpjs.org/js/phpjs/_supporters/pj_test_supportfile_2.js');
  // *     returns 1: 1
  var d = this.window.document;
  var isXML = d.documentElement.nodeName !== 'HTML' || !d.write; // Latter is for silly comprehensiveness
  var js = d.createElementNS && isXML ? d.createElementNS('http://www.w3.org/1999/xhtml', 'script') : d.createElement('script');
  js.setAttribute('type', 'text/javascript');
  js.setAttribute('src', filename);
  js.setAttribute('defer', 'defer');
  d.getElementsByTagNameNS && isXML ? (d.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'head')[0] ? d.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'head')[0].appendChild(js) : d.documentElement.insertBefore(js, d.documentElement.firstChild) // in case of XUL
  ) : d.getElementsByTagName('head')[0].appendChild(js);
  // save include state for reference by include_once
  var cur_file = {};
  cur_file[this.window.location.href] = 1;

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  // END REDUNDANT
  if (!this.php_js.includes) {
    this.php_js.includes = cur_file;
  }
  if (!this.php_js.includes[filename]) {
    this.php_js.includes[filename] = 1;
  } else {
    this.php_js.includes[filename]++;
  }

  return this.php_js.includes[filename];
}
