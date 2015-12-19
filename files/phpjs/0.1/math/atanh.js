function atanh (arg) {
  // http://kevin.vanzonneveld.net
  // +   original by: Onno Marsman
  // *     example 1: atanh(0.3);
  // *     returns 1: 0.3095196042031118
  return 0.5 * Math.log((1 + arg) / (1 - arg));
}
