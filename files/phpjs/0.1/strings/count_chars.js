function count_chars (str, mode) {
  // http://kevin.vanzonneveld.net
  // +   original by: Ates Goral (http://magnetiq.com)
  // +    tweaked by: Jack
  // +   bugfixed by: Onno Marsman
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +    revised by: Theriault
  // *     example 1: count_chars("Hello World!", 3);
  // *     returns 1: "!HWdelor"
  // *     example 2: count_chars("Hello World!", 1);
  // *     returns 2: {32:1,33:1,72:1,87:1,100:1,101:1,108:3,111:2,114:1}
  var result = {},
    resultArr = [],
    i;

  str = ('' + str).split('').sort().join('').match(/(.)\1*/g);

  if ((mode & 1) == 0) {
    for (i = 0; i != 256; i++) {
      result[i] = 0;
    }
  }

  if (mode === 2 || mode === 4) {

    for (i = 0; i != str.length; i += 1) {
      delete result[str[i].charCodeAt(0)];
    }
    for (i in result) {
      result[i] = (mode === 4) ? String.fromCharCode(i) : 0;
    }

  } else if (mode === 3) {

    for (i = 0; i != str.length; i += 1) {
      result[i] = str[i].slice(0, 1);
    }

  } else {

    for (i = 0; i != str.length; i += 1) {
      result[str[i].charCodeAt(0)] = str[i].length;
    }

  }
  if (mode < 3) {
    return result;
  }

  for (i in result) {
    resultArr.push(result[i]);
  }
  return resultArr.join('');
}
