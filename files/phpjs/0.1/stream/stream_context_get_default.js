function stream_context_get_default (options) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: stream_context_create
  // %          note 1: Although for historical reasons in PHP, this function can be used with
  // %          note 1: its options argument to set the default, it is no doubt best to use
  // %          note 1: stream_context_set_default() to do so
  // *     example 1: var context = stream_context_get_default();
  // *     example 1: get_resource_type(context);
  // *     returns 1: 'stream-context'
  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  // END REDUNDANT
  if (!this.php_js.default_streams_context) {
    this.php_js.default_streams_context = this.stream_context_create(options);
  }
  if (options) {
    this.php_js.default_streams_context.stream_options = options;
  }

  return this.php_js.default_streams_context;
}
