function phpversion () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: We are using this to get the JavaScript version (since this is JavaScript and we can't get the PHP version anyways)
  // %        note 2: The return value will depend on your client's JavaScript version
  // %        note 3: Uses global: php_js to store environment info
  // *     example 1: phpversion();
  // *     returns 1: '1.8'

  var xhtml = true,
    s = {},
    firstScript = {},
    d = this.window.document,
    c = 'createElement',
    cn = 'createElementNS',
    xn = 'http://www.w3.org/1999/xhtml',
    g = 'getElementsByTagName',
    gn = 'getElementsByTagNameNS';

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  // END REDUNDANT

  var getVersion = function (app) {
    var att = '',
      minVers = 0,
      versionString = '',
      temp_jsversion = undefined;
    if (this.php_js.jsversion !== undefined) {
      return this.php_js.jsversion;
    }
    while (this.php_js.jsversion === temp_jsversion && minVers < 10) {
      temp_jsversion = '1.' + minVers;
      if (gn) {
        firstScript = d[gn](xn, 'script')[0];
      }
      if (!firstScript) {
        firstScript = d[g]('script')[0];
        xhtml = false;
      }
      if (d[cn] && xhtml) {
        s = d[cn](xn, 'script');
      } else {
        s = d[c]('script');
      }

      if (app) { // Check with standard attribute (but not cross-browser standardized value?) as per Mozilla
        att = 'type';
        versionString = 'application/javascript;version=1.';
      } else {
        att = 'language'; // non-standard
        versionString = 'JavaScript1.';
      }

      s.setAttribute(att, versionString + minVers);
      s.appendChild(d.createTextNode("this.php_js.jsversion=" + "'1." + minVers + "'"));
      firstScript.parentNode.insertBefore(s, firstScript);
      s.parentNode.removeChild(s);
      minVers++;
    }
    return this.php_js.jsversion;
  };
  getVersion(true);
  getVersion(false);

  return this.php_js.jsversion;
}
