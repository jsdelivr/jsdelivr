function ob_end_flush () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: ob_end_flush();
  // *     returns 1: true

  var PHP_OUTPUT_HANDLER_START = 1,
    PHP_OUTPUT_HANDLER_END = 4;

  this.php_js = this.php_js || {};
  var obs = this.php_js.obs;

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
  if (obs.length) {
    ob = obs[obs.length - 1];
    ob.buffer += buffer;
  } else {
    this.echo(buffer);
  }

  return true;
}
