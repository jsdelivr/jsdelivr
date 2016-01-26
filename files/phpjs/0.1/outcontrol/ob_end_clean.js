function ob_end_clean () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: ob_end_clean();
  // *     returns 1: true

  var PHP_OUTPUT_HANDLER_START = 1,
    PHP_OUTPUT_HANDLER_END = 4;
  this.php_js = this.php_js || {};
  var phpjs = this.php_js,
    obs = phpjs.obs;

  if (!obs || !obs.length) {
    return false;
  }
  var flags = 0,
    ob = obs[obs.length - 1],
    buffer = ob.buffer;
  if (ob.callback) {
    if (!ob.status) {
      flags |= PHP_OUTPUT_HANDLER_START;
    }
    flags |= PHP_OUTPUT_HANDLER_END;
    ob.status = 2;
    buffer = ob.callback(buffer, flags);
  }
  obs.pop();
  return true;
}
