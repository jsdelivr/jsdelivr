function strrpos (haystack, needle, offset) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman
  // +   input by: saulius
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: strrpos('Kevin van Zonneveld', 'e');
  // *     returns 1: 16
  // *     example 2: strrpos('somepage.com', '.', false);
  // *     returns 2: 8
  // *     example 3: strrpos('baa', 'a', 3);
  // *     returns 3: false
  // *     example 4: strrpos('baa', 'a', 2);
  // *     returns 4: 2
  var i = -1;
  if (offset) {
    i = (haystack + '').slice(offset).lastIndexOf(needle); // strrpos' offset indicates starting point of range till end,
    // while lastIndexOf's optional 2nd argument indicates ending point of range from the beginning
    if (i !== -1) {
      i += offset;
    }
  } else {
    i = (haystack + '').lastIndexOf(needle);
  }
  return i >= 0 ? i : false;
}
