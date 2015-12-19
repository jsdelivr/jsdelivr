function sscanf (str, format) {
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: Since JS does not support scalar reference variables, any additional arguments to the function will
  // %        note 1: only be allowable here as strings referring to a global variable (which will then be set to the value
  // %        note 1: found in 'str' corresponding to the appropriate conversion specification in 'format'
  // %        note 2: I am unclear on how WS is to be handled here because documentation seems to me to contradict PHP behavior
  // *     example 1: sscanf('SN/2350001', 'SN/%d');
  // *     returns 1: [2350001]
  // *     example 2: var myVar; // Will be set by function
  // *     example 2: sscanf('SN/2350001', 'SN/%d', 'myVar');
  // *     returns 2: 1
  // *     example 3: sscanf("10--20", "%2$d--%1$d"); // Must escape '$' in PHP, but not JS
  // *     returns 3: [20, 10]

  // SETUP
  var retArr = [],
    num = 0,
    _NWS = /\S/,
    args = arguments,
    that = this,
    digit;

  var _setExtraConversionSpecs = function (offset) {
    // Since a mismatched character sets us off track from future legitimate finds, we just scan
    // to the end for any other conversion specifications (besides a percent literal), setting them to null
    // sscanf seems to disallow all conversion specification components (of sprintf) except for type specifiers
    //var matches = format.match(/%[+-]?([ 0]|'.)?-?\d*(\.\d+)?[bcdeufFosxX]/g); // Do not allow % in last char. class
    var matches = format.slice(offset).match(/%[cdeEufgosxX]/g); // Do not allow % in last char. class;
    // b, F,G give errors in PHP, but 'g', though also disallowed, doesn't
    if (matches) {
      var lgth = matches.length;
      while (lgth--) {
        retArr.push(null);
      }
    }
    return _finish();
  };

  var _finish = function () {
    if (args.length === 2) {
      return retArr;
    }
    for (var i = 0; i < retArr.length; ++i) {
      that.window[args[i + 2]] = retArr[i];
    }
    return i;
  };

  var _addNext = function (j, regex, cb) {
    if (assign) {
      var remaining = str.slice(j);
      var check = width ? remaining.substr(0, width) : remaining;
      var match = regex.exec(check);
      var testNull = retArr[digit !== undefined ? digit : retArr.length] = match ? (cb ? cb.apply(null, match) : match[0]) : null;
      if (testNull === null) {
        throw 'No match in string';
      }
      return j + match[0].length;
    }
    return j;
  };

  if (arguments.length < 2) {
    throw 'Not enough arguments passed to sscanf';
  }

  // PROCESS
  for (var i = 0, j = 0; i < format.length; i++) {

    var width = 0,
      assign = true;

    if (format.charAt(i) === '%') {
      if (format.charAt(i + 1) === '%') {
        if (str.charAt(j) === '%') { // a matched percent literal
          ++i, ++j; // skip beyond duplicated percent
          continue;
        }
        // Format indicated a percent literal, but not actually present
        return _setExtraConversionSpecs(i + 2);
      }

      // CHARACTER FOLLOWING PERCENT IS NOT A PERCENT

      var prePattern = new RegExp('^(?:(\\d+)\\$)?(\\*)?(\\d*)([hlL]?)', 'g'); // We need 'g' set to get lastIndex

      var preConvs = prePattern.exec(format.slice(i + 1));

      var tmpDigit = digit;
      if (tmpDigit && preConvs[1] === undefined) {
        throw 'All groups in sscanf() must be expressed as numeric if any have already been used';
      }
      digit = preConvs[1] ? parseInt(preConvs[1], 10) - 1 : undefined;

      assign = !preConvs[2];
      width = parseInt(preConvs[3], 10);
      var sizeCode = preConvs[4];
      i += prePattern.lastIndex;

      // Fix: Does PHP do anything with these? Seems not to matter
      if (sizeCode) { // This would need to be processed later
        switch (sizeCode) {
        case 'h':
          // Treats subsequent as short int (for d,i,n) or unsigned short int (for o,u,x)
        case 'l':
          // Treats subsequent as long int (for d,i,n), or unsigned long int (for o,u,x);
          //    or as double (for e,f,g) instead of float or wchar_t instead of char
        case 'L':
          // Treats subsequent as long double (for e,f,g)
          break;
        default:
          throw 'Unexpected size specifier in sscanf()!';
          break;
        }
      }
      // PROCESS CHARACTER
      try {
        switch (format.charAt(i + 1)) {
          // For detailed explanations, see http://web.archive.org/web/20031128125047/http://www.uwm.edu/cgi-bin/IMT/wwwman?topic=scanf%283%29&msection=
          // Also http://www.mathworks.com/access/helpdesk/help/techdoc/ref/sscanf.html
          // p, S, C arguments in C function not available
          // DOCUMENTED UNDER SSCANF
        case 'F':
          // Not supported in PHP sscanf; the argument is treated as a float, and
          //  presented as a floating-point number (non-locale aware)
          // sscanf doesn't support locales, so no need for two (see %f)
          break;
        case 'g':
          // Not supported in PHP sscanf; shorter of %e and %f
          // Irrelevant to input conversion
          break;
        case 'G':
          // Not supported in PHP sscanf; shorter of %E and %f
          // Irrelevant to input conversion
          break;
        case 'b':
          // Not supported in PHP sscanf; the argument is treated as an integer, and presented as a binary number
          // Not supported - couldn't distinguish from other integers
          break;
        case 'i':
          // Integer with base detection (Equivalent of 'd', but base 0 instead of 10)
          j = _addNext(j, /([+-])?(?:(?:0x([\da-fA-F]+))|(?:0([0-7]+))|(\d+))/, function (num, sign, hex, oct, dec) {
            return hex ? parseInt(num, 16) : oct ? parseInt(num, 8) : parseInt(num, 10);
          });
          break;
        case 'n':
          // Number of characters processed so far
          retArr[digit !== undefined ? digit : retArr.length - 1] = j;
          break;
          // DOCUMENTED UNDER SPRINTF
        case 'c':
          // Get character; suppresses skipping over whitespace! (but shouldn't be whitespace in format anyways, so no difference here)
          // Non-greedy match
          j = _addNext(j, new RegExp('.{1,' + (width || 1) + '}'));
          break;
        case 'D':
          // sscanf documented decimal number; equivalent of 'd';
        case 'd':
          // Optionally signed decimal integer
          j = _addNext(j, /([+-])?(?:0*)(\d+)/, function (num, sign, dec) {
            // Ignores initial zeroes, unlike %i and parseInt()
            var decInt = parseInt((sign || '') + dec, 10);
            if (decInt < 0) { // PHP also won't allow less than -2147483648
              return decInt < -2147483648 ? -2147483648 : decInt; // integer overflow with negative
            } else { // PHP also won't allow greater than -2147483647
              return decInt < 2147483647 ? decInt : 2147483647;
            }
          });
          break;
        case 'f':
          // Although sscanf doesn't support locales, this is used instead of '%F'; seems to be same as %e
        case 'E':
          // These don't discriminate here as both allow exponential float of either case
        case 'e':
          j = _addNext(j, /([+-])?(?:0*)(\d*\.?\d*(?:[eE]?\d+)?)/, function (num, sign, dec) {
            if (dec === '.') {
              return null;
            }
            return parseFloat((sign || '') + dec); // Ignores initial zeroes, unlike %i and parseFloat()
          });
          break;
        case 'u':
          // unsigned decimal integer
          // We won't deal with integer overflows due to signs
          j = _addNext(j, /([+-])?(?:0*)(\d+)/, function (num, sign, dec) {
            // Ignores initial zeroes, unlike %i and parseInt()
            var decInt = parseInt(dec, 10);
            if (sign === '-') { // PHP also won't allow greater than 4294967295
              return 4294967296 - decInt; // integer overflow with negative
            } else {
              return decInt < 4294967295 ? decInt : 4294967295;
            }
          });
          break;
        case 'o':
          // Octal integer // Fix: add overflows as above?
          j = _addNext(j, /([+-])?(?:0([0-7]+))/, function (num, sign, oct) {
            return parseInt(num, 8);
          });
          break;
        case 's':
          // Greedy match
          j = _addNext(j, /\S+/);
          break;
        case 'X':
          // Same as 'x'?
        case 'x':
          // Fix: add overflows as above?
          // Initial 0x not necessary here
          j = _addNext(j, /([+-])?(?:(?:0x)?([\da-fA-F]+))/, function (num, sign, hex) {
            return parseInt(num, 16);
          });
          break;
        case '':
          // If no character left in expression
          throw 'Missing character after percent mark in sscanf() format argument';
        default:
          throw 'Unrecognized character after percent mark in sscanf() format argument';
        }
      } catch (e) {
        if (e === 'No match in string') { // Allow us to exit
          return _setExtraConversionSpecs(i + 2);
        }
      }++i; // Calculate skipping beyond initial percent too
    } else if (format.charAt(i) !== str.charAt(j)) {
      // Fix: Double-check i whitespace ignored in string and/or formats
      _NWS.lastIndex = 0;
      if ((_NWS).test(str.charAt(j)) || str.charAt(j) === '') { // Whitespace doesn't need to be an exact match)
        return _setExtraConversionSpecs(i + 1);
      } else {
        // Adjust strings when encounter non-matching whitespace, so they align in future checks above
        str = str.slice(0, j) + str.slice(j + 1); // Ok to replace with j++;?
        i--;
      }
    } else {
      j++;
    }
  }

  // POST-PROCESSING
  return _finish();
}
