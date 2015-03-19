function octdec (oct_string) {
  // http://kevin.vanzonneveld.net
  // +   original by: Philippe Baumann
  // *     example 1: octdec('77');
  // *     returns 1: 63
  oct_string = (oct_string + '').replace(/[^0-7]/gi, '');
  return parseInt(oct_string, 8);
}
