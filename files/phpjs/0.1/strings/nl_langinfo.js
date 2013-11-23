function nl_langinfo (item) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: setlocale
  // *     example 1: nl_langinfo('DAY_1');
  // *     returns 1: 'Sunday'
  this.setlocale('LC_ALL', 0); // Ensure locale data is available
  var loc = this.php_js.locales[this.php_js.localeCategories.LC_TIME];
  if (item.indexOf('ABDAY_') === 0) {
    return loc.LC_TIME.a[parseInt(item.replace(/^ABDAY_/, ''), 10) - 1];
  } else if (item.indexOf('DAY_') === 0) {
    return loc.LC_TIME.A[parseInt(item.replace(/^DAY_/, ''), 10) - 1];
  } else if (item.indexOf('ABMON_') === 0) {
    return loc.LC_TIME.b[parseInt(item.replace(/^ABMON_/, ''), 10) - 1];
  } else if (item.indexOf('MON_') === 0) {
    return loc.LC_TIME.B[parseInt(item.replace(/^MON_/, ''), 10) - 1];
  } else {
    switch (item) {
      // More LC_TIME
    case 'AM_STR':
      return loc.LC_TIME.p[0];
    case 'PM_STR':
      return loc.LC_TIME.p[1];
    case 'D_T_FMT':
      return loc.LC_TIME.c;
    case 'D_FMT':
      return loc.LC_TIME.x;
    case 'T_FMT':
      return loc.LC_TIME.X;
    case 'T_FMT_AMPM':
      return loc.LC_TIME.r;
    case 'ERA':
      // all fall-throughs
    case 'ERA_YEAR':
    case 'ERA_D_T_FMT':
    case 'ERA_D_FMT':
    case 'ERA_T_FMT':
      return loc.LC_TIME[item];
    }
    loc = this.php_js.locales[this.php_js.localeCategories.LC_MONETARY];
    if (item === 'CRNCYSTR') {
      item = 'CURRENCY_SYMBOL'; // alias
    }
    switch (item) {
    case 'INT_CURR_SYMBOL':
      // all fall-throughs
    case 'CURRENCY_SYMBOL':
    case 'MON_DECIMAL_POINT':
    case 'MON_THOUSANDS_SEP':
    case 'POSITIVE_SIGN':
    case 'NEGATIVE_SIGN':
    case 'INT_FRAC_DIGITS':
    case 'FRAC_DIGITS':
    case 'P_CS_PRECEDES':
    case 'P_SEP_BY_SPACE':
    case 'N_CS_PRECEDES':
    case 'N_SEP_BY_SPACE':
    case 'P_SIGN_POSN':
    case 'N_SIGN_POSN':
      return loc.LC_MONETARY[item.toLowerCase()];
    case 'MON_GROUPING':
      // Same as above, or return something different since this returns an array?
      return loc.LC_MONETARY[item.toLowerCase()];
    }
    loc = this.php_js.locales[this.php_js.localeCategories.LC_NUMERIC];
    switch (item) {
    case 'RADIXCHAR':
      // Fall-through
    case 'DECIMAL_POINT':
      return loc.LC_NUMERIC[item.toLowerCase()];
    case 'THOUSEP':
      // Fall-through
    case 'THOUSANDS_SEP':
      return loc.LC_NUMERIC[item.toLowerCase()];
    case 'GROUPING':
      // Same as above, or return something different since this returns an array?
      return loc.LC_NUMERIC[item.toLowerCase()];
    }
    loc = this.php_js.locales[this.php_js.localeCategories.LC_MESSAGES];
    switch (item) {
    case 'YESEXPR':
      // all fall-throughs
    case 'NOEXPR':
    case 'YESSTR':
    case 'NOSTR':
      return loc.LC_MESSAGES[item];
    }
    loc = this.php_js.locales[this.php_js.localeCategories.LC_CTYPE];
    if (item === 'CODESET') {
      return loc.LC_CTYPE[item];
    }
    return false;
  }
}
