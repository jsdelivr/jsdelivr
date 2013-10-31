function bindec (binary_string) {
  // http://kevin.vanzonneveld.net
  // +   original by: Philippe Baumann
  // *     example 1: bindec('110011');
  // *     returns 1: 51
  // *     example 2: bindec('000110011');
  // *     returns 2: 51
  // *     example 3: bindec('111');
  // *     returns 3: 7
  binary_string = (binary_string + '').replace(/[^01]/gi, '');
  return parseInt(binary_string, 2);
}
