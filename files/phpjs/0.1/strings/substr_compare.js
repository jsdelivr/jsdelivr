function substr_compare (main_str, str, offset, length, case_insensitivity) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   derived from: strcasecmp, strcmp
  // *     example 1: substr_compare("abcde", "bc", 1, 2);
  // *     returns 1: 0
  if (!offset && offset !== 0) {
    throw 'Missing offset for substr_compare()';
  }

  if (offset < 0) {
    offset = main_str.length + offset;
  }

  if (length && length > (main_str.length - offset)) {
    return false;
  }
  length = length || main_str.length - offset;

  main_str = main_str.substr(offset, length);
  str = str.substr(0, length); // Should only compare up to the desired length
  if (case_insensitivity) { // Works as strcasecmp
    main_str = (main_str + '').toLowerCase();
    str = (str + '').toLowerCase();
    if (main_str == str) {
      return 0;
    }
    return (main_str > str) ? 1 : -1;
  }
  // Works as strcmp
  return ((main_str == str) ? 0 : ((main_str > str) ? 1 : -1));
}
