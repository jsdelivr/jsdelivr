function hexdec (hex_string) {
  // http://kevin.vanzonneveld.net
  // +   original by: Philippe Baumann
  // *     example 1: hexdec('that');
  // *     returns 1: 10
  // *     example 2: hexdec('a0');
  // *     returns 2: 160
  hex_string = (hex_string + '').replace(/[^a-f0-9]/gi, '');
  return parseInt(hex_string, 16);
}
