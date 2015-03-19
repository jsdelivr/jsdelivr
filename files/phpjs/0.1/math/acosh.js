function acosh (arg) {
  // http://kevin.vanzonneveld.net
  // +   original by: Onno Marsman
  // *     example 1: acosh(8723321.4);
  // *     returns 1: 16.674657798418625
  return Math.log(arg + Math.sqrt(arg * arg - 1));
}
