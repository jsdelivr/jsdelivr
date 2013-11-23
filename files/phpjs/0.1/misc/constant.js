function constant (name) {
  // http://kevin.vanzonneveld.net
  // +   original by: Paulo Freitas
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: constant('IMAGINARY_CONSTANT1');
  // *     returns 1: null
  var clssPos = 0,
    clssCnst = null;
  if ((clssPos = name.indexOf('::')) !== -1) {
    clssCnst = name.slice(clssPos + 2);
    name = name.slice(0, clssPos);
  }

  if (this.window[name] === undefined) {
    return null;
  }
  if (clssCnst) {
    return this.window[name][clssCnst];
  }
  return this.window[name];
}
