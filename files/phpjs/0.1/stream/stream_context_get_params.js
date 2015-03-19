function stream_context_get_params (stream_or_context) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: var params = {notification:function (notification_code, severity, message, message_code, bytes_transferred, bytes_max) {}};
  // *     example 1: var context = stream_context_create({}, params);
  // *     example 1: stream_context_get_params(context);
  // *     returns 1: {notification:function (notification_code, severity, message, message_code, bytes_transferred, bytes_max) {}, options:{}}
  return stream_or_context.stream_params;
}
