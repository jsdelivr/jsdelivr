function stream_context_set_default (options) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: stream_context_create
  // *     example 1: var opts = {http:{ method:'GET', header: 'Accept-language: en\r\nCookie: foo=bar\r\n' } };
  // *     example 1: var context = stream_context_set_default(opts);
  // *     example 1: get_resource_type(context);
  // *     returns 1: 'stream-context'
  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  // END REDUNDANT
  if (!this.php_js.default_streams_context) {
    this.php_js.default_streams_context = this.stream_context_create(options);
  }
  this.php_js.default_streams_context.stream_options = options;

  return this.php_js.default_streams_context;
}
