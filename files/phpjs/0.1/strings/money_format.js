function money_format (format, number) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   input by: daniel airton wermann (http://wermann.com.br)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: setlocale
  // %          note 1: This depends on setlocale having the appropriate locale (these examples use 'en_US')
  // *     example 1: money_format('%i', 1234.56);
  // *     returns 1: 'USD 1,234.56'
  // *     example 2: money_format('%14#8.2n', 1234.5678);
  // *     returns 2: ' $     1,234.57'
  // *     example 3: money_format('%14#8.2n', -1234.5678);
  // *     returns 3: '-$     1,234.57'
  // *     example 4: money_format('%(14#8.2n', 1234.5678);
  // *     returns 4: ' $     1,234.57 '
  // *     example 5: money_format('%(14#8.2n', -1234.5678);
  // *     returns 5: '($     1,234.57)'
  // *     example 6: money_format('%=014#8.2n', 1234.5678);
  // *     returns 6: ' $000001,234.57'
  // *     example 7: money_format('%=014#8.2n', -1234.5678);
  // *     returns 7: '-$000001,234.57'
  // *     example 8: money_format('%=*14#8.2n', 1234.5678);
  // *     returns 8: ' $*****1,234.57'
  // *     example 9: money_format('%=*14#8.2n', -1234.5678);
  // *     returns 9: '-$*****1,234.57'
  // *     example 10: money_format('%=*^14#8.2n', 1234.5678);
  // *     returns 10: '  $****1234.57'
  // *     example 11: money_format('%=*^14#8.2n', -1234.5678);
  // *     returns 11: ' -$****1234.57'
  // *     example 12: money_format('%=*!14#8.2n', 1234.5678);
  // *     returns 12: ' *****1,234.57'
  // *     example 13: money_format('%=*!14#8.2n', -1234.5678);
  // *     returns 13: '-*****1,234.57'
  // *     example 14: money_format('%i', 3590);
  // *     returns 14: ' USD 3,590.00'

  // Per PHP behavior, there seems to be no extra padding for sign when there is a positive number, though my
  // understanding of the description is that there should be padding; need to revisit examples

  // Helpful info at http://ftp.gnu.org/pub/pub/old-gnu/Manuals/glibc-2.2.3/html_chapter/libc_7.html and http://publib.boulder.ibm.com/infocenter/zos/v1r10/index.jsp?topic=/com.ibm.zos.r10.bpxbd00/strfmp.htm

  if (typeof number !== 'number') {
    return null;
  }
  var regex = /%((=.|[+^(!-])*?)(\d*?)(#(\d+))?(\.(\d+))?([in%])/g; // 1: flags, 3: width, 5: left, 7: right, 8: conversion

  this.setlocale('LC_ALL', 0); // Ensure the locale data we need is set up
  var monetary = this.php_js.locales[this.php_js.localeCategories['LC_MONETARY']]['LC_MONETARY'];

  var doReplace = function (n0, flags, n2, width, n4, left, n6, right, conversion) {
    var value = '',
      repl = '';
    if (conversion === '%') { // Percent does not seem to be allowed with intervening content
      return '%';
    }
    var fill = flags && (/=./).test(flags) ? flags.match(/=(.)/)[1] : ' '; // flag: =f (numeric fill)
    var showCurrSymbol = !flags || flags.indexOf('!') === -1; // flag: ! (suppress currency symbol)
    width = parseInt(width, 10) || 0; // field width: w (minimum field width)

    var neg = number < 0;
    number = number + ''; // Convert to string
    number = neg ? number.slice(1) : number; // We don't want negative symbol represented here yet

    var decpos = number.indexOf('.');
    var integer = decpos !== -1 ? number.slice(0, decpos) : number; // Get integer portion
    var fraction = decpos !== -1 ? number.slice(decpos + 1) : ''; // Get decimal portion

    var _str_splice = function (integerStr, idx, thous_sep) {
      var integerArr = integerStr.split('');
      integerArr.splice(idx, 0, thous_sep);
      return integerArr.join('');
    };

    var init_lgth = integer.length;
    left = parseInt(left, 10);
    var filler = init_lgth < left;
    if (filler) {
      var fillnum = left - init_lgth;
      integer = new Array(fillnum + 1).join(fill) + integer;
    }
    if (flags.indexOf('^') === -1) { // flag: ^ (disable grouping characters (of locale))
      // use grouping characters
      var thous_sep = monetary.mon_thousands_sep; // ','
      var mon_grouping = monetary.mon_grouping; // [3] (every 3 digits in U.S.A. locale)

      if (mon_grouping[0] < integer.length) {
        for (var i = 0, idx = integer.length; i < mon_grouping.length; i++) {
          idx -= mon_grouping[i]; // e.g., 3
          if (idx <= 0) {
            break;
          }
          if (filler && idx < fillnum) {
            thous_sep = fill;
          }
          integer = _str_splice(integer, idx, thous_sep);
        }
      }
      if (mon_grouping[i - 1] > 0) { // Repeating last grouping (may only be one) until highest portion of integer reached
        while (idx > mon_grouping[i - 1]) {
          idx -= mon_grouping[i - 1];
          if (filler && idx < fillnum) {
            thous_sep = fill;
          }
          integer = _str_splice(integer, idx, thous_sep);
        }
      }
    }

    // left, right
    if (right === '0') { // No decimal or fractional digits
      value = integer;
    } else {
      var dec_pt = monetary.mon_decimal_point; // '.'
      if (right === '' || right === undefined) {
        right = conversion === 'i' ? monetary.int_frac_digits : monetary.frac_digits;
      }
      right = parseInt(right, 10);

      if (right === 0) { // Only remove fractional portion if explicitly set to zero digits
        fraction = '';
        dec_pt = '';
      } else if (right < fraction.length) {
        fraction = Math.round(parseFloat(fraction.slice(0, right) + '.' + fraction.substr(right, 1))) + '';
        if (right > fraction.length) {
          fraction = new Array(right - fraction.length + 1).join('0') + fraction; // prepend with 0's
        }
      } else if (right > fraction.length) {
        fraction += new Array(right - fraction.length + 1).join('0'); // pad with 0's
      }
      value = integer + dec_pt + fraction;
    }

    var symbol = '';
    if (showCurrSymbol) {
      symbol = conversion === 'i' ? monetary.int_curr_symbol : monetary.currency_symbol; // 'i' vs. 'n' ('USD' vs. '$')
    }
    var sign_posn = neg ? monetary.n_sign_posn : monetary.p_sign_posn;

    // 0: no space between curr. symbol and value
    // 1: space sep. them unless symb. and sign are adjacent then space sep. them from value
    // 2: space sep. sign and value unless symb. and sign are adjacent then space separates
    var sep_by_space = neg ? monetary.n_sep_by_space : monetary.p_sep_by_space;

    // p_cs_precedes, n_cs_precedes // positive currency symbol follows value = 0; precedes value = 1
    var cs_precedes = neg ? monetary.n_cs_precedes : monetary.p_cs_precedes;

    // Assemble symbol/value/sign and possible space as appropriate
    if (flags.indexOf('(') !== -1) { // flag: parenth. for negative
      // Fix: unclear on whether and how sep_by_space, sign_posn, or cs_precedes have
      // an impact here (as they do below), but assuming for now behaves as sign_posn 0 as
      // far as localized sep_by_space and sign_posn behavior
      repl = (cs_precedes ? symbol + (sep_by_space === 1 ? ' ' : '') : '') + value + (!cs_precedes ? (sep_by_space === 1 ? ' ' : '') + symbol : '');
      if (neg) {
        repl = '(' + repl + ')';
      } else {
        repl = ' ' + repl + ' ';
      }
    } else { // '+' is default
      var pos_sign = monetary.positive_sign; // ''
      var neg_sign = monetary.negative_sign; // '-'
      var sign = neg ? (neg_sign) : (pos_sign);
      var otherSign = neg ? (pos_sign) : (neg_sign);
      var signPadding = '';
      if (sign_posn) { // has a sign
        signPadding = new Array(otherSign.length - sign.length + 1).join(' ');
      }

      var valueAndCS = '';
      switch (sign_posn) {
        // 0: parentheses surround value and curr. symbol;
        // 1: sign precedes them;
        // 2: sign follows them;
        // 3: sign immed. precedes curr. symbol; (but may be space between)
        // 4: sign immed. succeeds curr. symbol; (but may be space between)
      case 0:
        valueAndCS = cs_precedes ? symbol + (sep_by_space === 1 ? ' ' : '') + value : value + (sep_by_space === 1 ? ' ' : '') + symbol;
        repl = '(' + valueAndCS + ')';
        break;
      case 1:
        valueAndCS = cs_precedes ? symbol + (sep_by_space === 1 ? ' ' : '') + value : value + (sep_by_space === 1 ? ' ' : '') + symbol;
        repl = signPadding + sign + (sep_by_space === 2 ? ' ' : '') + valueAndCS;
        break;
      case 2:
        valueAndCS = cs_precedes ? symbol + (sep_by_space === 1 ? ' ' : '') + value : value + (sep_by_space === 1 ? ' ' : '') + symbol;
        repl = valueAndCS + (sep_by_space === 2 ? ' ' : '') + sign + signPadding;
        break;
      case 3:
        repl = cs_precedes ? signPadding + sign + (sep_by_space === 2 ? ' ' : '') + symbol + (sep_by_space === 1 ? ' ' : '') + value : value + (sep_by_space === 1 ? ' ' : '') + sign + signPadding + (sep_by_space === 2 ? ' ' : '') + symbol;
        break;
      case 4:
        repl = cs_precedes ? symbol + (sep_by_space === 2 ? ' ' : '') + signPadding + sign + (sep_by_space === 1 ? ' ' : '') + value : value + (sep_by_space === 1 ? ' ' : '') + symbol + (sep_by_space === 2 ? ' ' : '') + sign + signPadding;
        break;
      }
    }

    var padding = width - repl.length;
    if (padding > 0) {
      padding = new Array(padding + 1).join(' ');
      // Fix: How does p_sep_by_space affect the count if there is a space? Included in count presumably?
      if (flags.indexOf('-') !== -1) { // left-justified (pad to right)
        repl += padding;
      } else { // right-justified (pad to left)
        repl = padding + repl;
      }
    }
    return repl;
  };

  return format.replace(regex, doReplace);
}
