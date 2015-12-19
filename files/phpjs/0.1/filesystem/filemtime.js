function filemtime (file) {
  // +   original by: Ole Vrijenhoek (http://www.nervous.nl/)
  // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: get_headers
  // %        note 1:  Looks for Last-Modified in response header.
  // *     example 1: filemtime('http://www.un.org');
  // *     returns 1: 1241532483

  var headers = {};
  headers = this.get_headers(file, 1);
  return (headers && headers['Last-Modified'] && Date.parse(headers['Last-Modified']) / 1000) || false;
}
