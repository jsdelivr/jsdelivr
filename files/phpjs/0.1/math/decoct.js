function decoct (number) {
  // http://kevin.vanzonneveld.net
  // +   original by: Enrique Gonzalez
  // +   bugfixed by: Onno Marsman
  // +   improved by: http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
  // +   input by: pilus
  // *     example 1: decoct(15);
  // *     returns 1: '17'
  // *     example 2: decoct(264);
  // *     returns 2: '410'
  if (number < 0) {
    number = 0xFFFFFFFF + number + 1;
  }
  return parseInt(number, 10).toString(8);
}
