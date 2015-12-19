function dirname (path) {
  // http://kevin.vanzonneveld.net
  // +   original by: Ozh
  // +   improved by: XoraX (http://www.xorax.info)
  // *     example 1: dirname('/etc/passwd');
  // *     returns 1: '/etc'
  // *     example 2: dirname('c:/Temp/x');
  // *     returns 2: 'c:/Temp'
  // *     example 3: dirname('/dir/test/');
  // *     returns 3: '/dir'
  return path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');
}
