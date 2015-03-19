function ob_list_handlers () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: ob_list_handlers();
  // *     returns 1: ['default output handler', 'myOwnHandler']

  var i = 0,
    arr = [],
    name = '',
    cbname = '';
  var getFuncName = function (fn) {
    var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
    if (!name) {
      return '(Anonymous)';
    }
    return name[1];
  };

  this.php_js = this.php_js || {};
  var phpjs = this.php_js,
    ini = phpjs.ini;

  if (!phpjs.obs || !phpjs.obs.length) {
    if (ini && ini['output_buffering'] && (typeof ini['output_buffering'].local_value !== 'string' || ini['output_buffering'].local_value.toLowerCase() !== 'off')) {
      return ['default output handler']; // PHP doesn't return output_handler ini, even if it is set
    }
    return arr;
  }
  for (i = 0; i < phpjs.obs.length; i++) {
    cbname = getFuncName(phpjs.obs[i].callback);
    name = cbname === '' ? 'default output handler' : cbname === 'URLRewriter' ? 'URL-Rewriter' : cbname;
    arr.push(name);
  }
  return arr;
}
