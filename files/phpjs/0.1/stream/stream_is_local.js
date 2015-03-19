function stream_is_local (stream_or_url) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: stream_is_local('/etc');
  // *     returns 1: true

  if (typeof stream_or_url === 'string') {
    return ((/^(https?|ftps?|ssl|tls):/).test(stream_or_url)) ? false : true; // Need a better check than this
  }
  return stream_or_url.is_local ? true : false;
}
