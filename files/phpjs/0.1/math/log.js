function log (arg, base) {
  // http://kevin.vanzonneveld.net
  // +   original by: Onno Marsman
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: log(8723321.4, 7);
  // *     returns 1: 8.212871815082147
  return (typeof base === 'undefined') ?
    Math.log(arg) :
    Math.log(arg) / Math.log(base);
}
