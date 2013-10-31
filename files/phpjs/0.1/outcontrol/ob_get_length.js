function ob_get_length () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: ob_get_length();
  // *     returns 1: 155

  this.php_js = this.php_js || {};
  var phpjs = this.php_js,
    ini = phpjs.ini,
    obs = phpjs.obs;

  if (!obs || !obs.length) {
    return (ini && ini['output_buffering'] && (typeof ini['output_buffering'].local_value !== 'string' || ini['output_buffering'].local_value.toLowerCase() !== 'off')) ? 0 : false; // If output was already buffered, it would be available in obs
  }
  // Fix: WIll probably need to change depending on Unicode semantics
  return obs[obs.length - 1].buffer.length; // Retrieve length of most recently added buffer contents
}
