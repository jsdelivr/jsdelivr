function stream_context_set_option (stream_or_context, optionsOrWrapper, option, value) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: var opts = {http:{ method:'GET', header: 'Accept-language: en\r\nCookie: foo=bar\r\n' } };
  // *     example 1: var context = stream_context_create(opts);
  // *     example 1: stream_context_set_option(context, opts);
  // *     returns 1: true
  if (option) {
    if (!stream_or_context.stream_options[optionsOrWrapper]) { // Don't overwrite all?
      stream_or_context.stream_options[optionsOrWrapper] = {};
    }
    stream_or_context.stream_options[optionsOrWrapper][option] = value;
  } else {
    stream_or_context.stream_options = optionsOrWrapper;
  }
  return true;
}
