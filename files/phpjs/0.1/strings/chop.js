function chop (str, charlist) {
  // http://kevin.vanzonneveld.net
  // +   original by: Paulo Freitas
  // -    depends on: rtrim
  // *     example 1: rtrim('    Kevin van Zonneveld    ');
  // *     returns 1: '    Kevin van Zonneveld'
  return this.rtrim(str, charlist);
}
