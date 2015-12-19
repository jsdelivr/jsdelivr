function create_function (args, code) {
  // http://kevin.vanzonneveld.net
  // +   original by: Johnny Mast (http://www.phpvrouwen.nl)
  // +   reimplemented by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: f = create_function('a, b', "return (a + b);");
  // *     example 1: f(1, 2);
  // *     returns 1: 3
  try {
    return Function.apply(null, args.split(',').concat(code));
  } catch (e) {
    return false;
  }
}
