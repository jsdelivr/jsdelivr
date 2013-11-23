function ob_flush () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: ob_flush();
  // *     returns 1: undefined

  var PHP_OUTPUT_HANDLER_START = 1,
    PHP_OUTPUT_HANDLER_CONT = 2;
  this.php_js = this.php_js || {};
  var phpjs = this.php_js,
    obs = phpjs.obs;

  if (!obs || !obs.length) {
    return;
  }
  var flags = 0,
    ob = obs[obs.length - 1],
    buffer = ob.buffer;
  if (ob.callback) {
    if (!ob.status) {
      flags |= PHP_OUTPUT_HANDLER_START;
    }
    flags |= PHP_OUTPUT_HANDLER_CONT;
    ob.status = 1;
    buffer = ob.callback(buffer, flags);
  }
  if (obs.length > 1) {
    obs[obs.length - 2].buffer += buffer;
  } else {
    var flushing = this.php_js.flushing;
    this.php_js.flushing = true;
    this.echo(buffer);
    this.php_js.flushing = flushing;
  }
  ob.buffer = '';
}
