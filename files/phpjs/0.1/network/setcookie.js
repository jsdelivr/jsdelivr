function setcookie (name, value, expires, path, domain, secure) {
  // http://kevin.vanzonneveld.net
  // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   bugfixed by: Andreas
  // +   bugfixed by: Onno Marsman
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // -    depends on: setrawcookie
  // *     example 1: setcookie('author_name', 'Kevin van Zonneveld');
  // *     returns 1: true
  return this.setrawcookie(name, encodeURIComponent(value), expires, path, domain, secure);
}
