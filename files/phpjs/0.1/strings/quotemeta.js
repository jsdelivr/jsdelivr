function quotemeta (str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Paulo Freitas
  // *     example 1: quotemeta(". + * ? ^ ( $ )");
  // *     returns 1: '\. \+ \* \? \^ \( \$ \)'
  return (str + '').replace(/([\.\\\+\*\?\[\^\]\$\(\)])/g, '\\$1');
}
