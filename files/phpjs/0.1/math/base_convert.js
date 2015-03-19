function base_convert (number, frombase, tobase) {
  // http://kevin.vanzonneveld.net
  // +   original by: Philippe Baumann
  // +   improved by: Rafał Kukawski (http://blog.kukawski.pl)
  // *     example 1: base_convert('A37334', 16, 2);
  // *     returns 1: '101000110111001100110100'
  return parseInt(number + '', frombase | 0).toString(tobase | 0);
}
