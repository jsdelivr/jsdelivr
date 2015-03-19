function strnatcmp (f_string1, f_string2, f_version) {
  // http://kevin.vanzonneveld.net
  // +   original by: Martijn Wieringa
  // + namespaced by: Michael White (http://getsprink.com)
  // +    tweaked by: Jack
  // +   bugfixed by: Onno Marsman
  // -    depends on: strcmp
  // %          note: Added f_version argument against code guidelines, because it's so neat
  // *     example 1: strnatcmp('Price 12.9', 'Price 12.15');
  // *     returns 1: 1
  // *     example 2: strnatcmp('Price 12.09', 'Price 12.15');
  // *     returns 2: -1
  // *     example 3: strnatcmp('Price 12.90', 'Price 12.15');
  // *     returns 3: 1
  // *     example 4: strnatcmp('Version 12.9', 'Version 12.15', true);
  // *     returns 4: -6
  // *     example 5: strnatcmp('Version 12.15', 'Version 12.9', true);
  // *     returns 5: 6
  var i = 0;

  if (f_version == undefined) {
    f_version = false;
  }

  var __strnatcmp_split = function (f_string) {
    var result = [];
    var buffer = '';
    var chr = '';
    var i = 0,
      f_stringl = 0;

    var text = true;

    f_stringl = f_string.length;
    for (i = 0; i < f_stringl; i++) {
      chr = f_string.substring(i, i + 1);
      if (chr.match(/\d/)) {
        if (text) {
          if (buffer.length > 0) {
            result[result.length] = buffer;
            buffer = '';
          }

          text = false;
        }
        buffer += chr;
      } else if ((text == false) && (chr === '.') && (i < (f_string.length - 1)) && (f_string.substring(i + 1, i + 2).match(/\d/))) {
        result[result.length] = buffer;
        buffer = '';
      } else {
        if (text == false) {
          if (buffer.length > 0) {
            result[result.length] = parseInt(buffer, 10);
            buffer = '';
          }
          text = true;
        }
        buffer += chr;
      }
    }

    if (buffer.length > 0) {
      if (text) {
        result[result.length] = buffer;
      } else {
        result[result.length] = parseInt(buffer, 10);
      }
    }

    return result;
  };

  var array1 = __strnatcmp_split(f_string1 + '');
  var array2 = __strnatcmp_split(f_string2 + '');

  var len = array1.length;
  var text = true;

  var result = -1;
  var r = 0;

  if (len > array2.length) {
    len = array2.length;
    result = 1;
  }

  for (i = 0; i < len; i++) {
    if (isNaN(array1[i])) {
      if (isNaN(array2[i])) {
        text = true;

        if ((r = this.strcmp(array1[i], array2[i])) != 0) {
          return r;
        }
      } else if (text) {
        return 1;
      } else {
        return -1;
      }
    } else if (isNaN(array2[i])) {
      if (text) {
        return -1;
      } else {
        return 1;
      }
    } else {
      if (text || f_version) {
        if ((r = (array1[i] - array2[i])) != 0) {
          return r;
        }
      } else {
        if ((r = this.strcmp(array1[i].toString(), array2[i].toString())) != 0) {
          return r;
        }
      }

      text = false;
    }
  }

  return result;
}
