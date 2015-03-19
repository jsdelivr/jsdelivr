function popen (filename, mode, use_include_path, context) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   input by: Paul Smith
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: file_get_contents
  // *     example 1: popen('http://kevin.vanzonneveld.net/pj_test_supportfile_1.htm', 'r');
  // *     returns 1: 'Resource id #1'

  var resource = {},
    i = 0,
    that = this;
  var getFuncName = function (fn) {
    var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
    if (!name) {
      return '(Anonymous)';
    }
    return name[1];
  };

  // BEGIN file inclusion: file_get_contents
  var file_get_contents = function (url) {
    var req = that.window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
    if (!req) {
      throw new Error('XMLHttpRequest not supported');
    }
    if (!(/^http/).test(url)) { // Allow references within or below the same directory (should fix to allow other relative references or root reference; could make dependent on parse_url())
      url = that.window.location.href + '/' + url;
    }
    req.open("GET", url, false);
    req.send(null);
    return req.responseText;
  };
  // END file inclusion

  if (use_include_path === 1 || use_include_path === '1' || use_include_path === true) {
    // Not implemented yet: Search for file in include path too
  }
  if (context) {
    // Not implemented yet, but could be useful to modify nature of HTTP request, etc.
  }

  for (i = 0; i < mode.length; i++) { // Have to deal with other flags if ever allow
    switch (mode.charAt(i)) {
    case 'r':
      if (!mode.charAt(i + 1) || mode.charAt(i + 1) !== '+') {
        break;
      }
    case 'w':
      // or 'w+'
    case 'a':
      // or 'a+'
    case 'x':
      // or 'x+'
      throw 'Writing is not implemented';
    case 'b':
    case 't':
      throw 'Windows-only modes are not supported';
    default:
      throw 'Unrecognized file mode passed to ' + getFuncName(arguments.caller) + '()';
    }
  }

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.resourceData = this.php_js.resourceData || {};
  this.php_js.resourceDataPointer = this.php_js.resourceDataPointer || {};
  this.php_js.resourceIdCounter = this.php_js.resourceIdCounter || 0;
  // END REDUNDANT

  // BEGIN STATIC

  function PHPJS_Resource(type, id, opener) { // Can reuse the following for other resources, just changing the instantiation
    // See http://php.net/manual/en/resource.php for types
    this.type = type;
    this.id = id;
    this.opener = opener;
  }
  PHPJS_Resource.prototype.toString = function () {
    return 'Resource id #' + this.id;
  };
  PHPJS_Resource.prototype.get_resource_type = function () {
    return this.type;
  };
  PHPJS_Resource.prototype.var_dump = function () {
    return 'resource(' + this.id + ') of type (' + this.type + ')';
  };
  // END STATIC

  this.php_js.resourceIdCounter++;

  this.php_js.resourceData[this.php_js.resourceIdCounter] = this.file_get_contents(filename);
  this.php_js.resourceDataPointer[this.php_js.resourceIdCounter] = 0;

  resource = new PHPJS_Resource('stream', this.php_js.resourceIdCounter, 'popen');
  resource.mode = mode; // Add file-specific attributes

  return resource; // may be 'file' instead of 'stream' type on some systems
}
