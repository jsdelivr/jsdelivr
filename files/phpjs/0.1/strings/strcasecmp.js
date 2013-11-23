function strcasecmp (f_string1, f_string2) {
  // http://kevin.vanzonneveld.net
  // +     original by: Martijn Wieringa
  // +     bugfixed by: Onno Marsman
  // *         example 1: strcasecmp('Hello', 'hello');
  // *         returns 1: 0
  var string1 = (f_string1 + '').toLowerCase();
  var string2 = (f_string2 + '').toLowerCase();

  if (string1 > string2) {
    return 1;
  } else if (string1 == string2) {
    return 0;
  }

  return -1;
}
