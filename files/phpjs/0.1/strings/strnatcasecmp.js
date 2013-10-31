function strnatcasecmp (str1, str2) {
  // http://kevin.vanzonneveld.net
  // +      original by: Martin Pool
  // + reimplemented by: Pierre-Luc Paour
  // + reimplemented by: Kristof Coomans (SCK-CEN (Belgian Nucleair Research Centre))
  // + reimplemented by: Brett Zamir (http://brett-zamir.me)
  // +      bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +         input by: Devan Penner-Woelk
  // +      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // *        example 1: strnatcasecmp(10, 1);
  // *        returns 1: 1
  // *        example 1: strnatcasecmp('1', '10');
  // *        returns 1: -1
  var a = (str1 + '').toLowerCase();
  var b = (str2 + '').toLowerCase();

  var isWhitespaceChar = function (a) {
    return a.charCodeAt(0) <= 32;
  };

  var isDigitChar = function (a) {
    var charCode = a.charCodeAt(0);
    return (charCode >= 48 && charCode <= 57);
  };

  var compareRight = function (a, b) {
    var bias = 0;
    var ia = 0;
    var ib = 0;

    var ca;
    var cb;

    // The longest run of digits wins.  That aside, the greatest
    // value wins, but we can't know that it will until we've scanned
    // both numbers to know that they have the same magnitude, so we
    // remember it in BIAS.
    for (var cnt = 0; true; ia++, ib++) {
      ca = a.charAt(ia);
      cb = b.charAt(ib);

      if (!isDigitChar(ca) && !isDigitChar(cb)) {
        return bias;
      } else if (!isDigitChar(ca)) {
        return -1;
      } else if (!isDigitChar(cb)) {
        return 1;
      } else if (ca < cb) {
        if (bias === 0) {
          bias = -1;
        }
      } else if (ca > cb) {
        if (bias === 0) {
          bias = 1;
        }
      } else if (ca === '0' && cb === '0') {
        return bias;
      }
    }
  };

  var ia = 0,
    ib = 0;
  var nza = 0,
    nzb = 0;
  var ca, cb;
  var result;

  while (true) {
    // only count the number of zeroes leading the last number compared
    nza = nzb = 0;

    ca = a.charAt(ia);
    cb = b.charAt(ib);

    // skip over leading spaces or zeros
    while (isWhitespaceChar(ca) || ca === '0') {
      if (ca === '0') {
        nza++;
      } else {
        // only count consecutive zeroes
        nza = 0;
      }

      ca = a.charAt(++ia);
    }

    while (isWhitespaceChar(cb) || cb === '0') {
      if (cb === '0') {
        nzb++;
      } else {
        // only count consecutive zeroes
        nzb = 0;
      }

      cb = b.charAt(++ib);
    }

    // process run of digits
    if (isDigitChar(ca) && isDigitChar(cb)) {
      if ((result = compareRight(a.substring(ia), b.substring(ib))) !== 0) {
        return result;
      }
    }

    if (ca === '0' && cb === '0') {
      // The strings compare the same.  Perhaps the caller
      // will want to call strcmp to break the tie.
      return nza - nzb;
    }

    if (ca < cb) {
      return -1;
    } else if (ca > cb) {
      return +1;
    }

    // prevent possible infinite loop
    if (ia >= a.length && ib >= b.length) return 0;

    ++ia;
    ++ib;
  }
}
