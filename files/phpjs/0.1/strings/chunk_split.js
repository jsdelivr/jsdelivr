function chunk_split (body, chunklen, end) {
  // http://kevin.vanzonneveld.net
  // +   original by: Paulo Freitas
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Theriault
  // *     example 1: chunk_split('Hello world!', 1, '*');
  // *     returns 1: 'H*e*l*l*o* *w*o*r*l*d*!*'
  // *     example 2: chunk_split('Hello world!', 10, '*');
  // *     returns 2: 'Hello worl*d!*'
  chunklen = parseInt(chunklen, 10) || 76;
  end = end || '\r\n';

  if (chunklen < 1) {
    return false;
  }

  return body.match(new RegExp(".{0," + chunklen + "}", "g")).join(end);

}
