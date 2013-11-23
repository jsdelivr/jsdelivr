function stream_context_get_options (stream_or_context) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: var opts = {http:{method:'GET', header: 'Accept-language: en\r\nCookie: foo=bar\r\n'}};
  // *     example 1: var context = stream_context_create(opts);
  // *     example 1: stream_context_get_options(context);
  // *     returns 1: {http:{ method:'GET', header: 'Accept-language: en\r\nCookie: foo=bar\r\n' }}
  return stream_or_context.stream_options;
}
