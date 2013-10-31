function inet_pton (a) {
  // http://kevin.vanzonneveld.net
  // +   original by: Theriault
  // *     example 1: inet_pton('::');
  // *     returns 1: '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0' (binary)
  // *     example 2: inet_pton('127.0.0.1');
  // *     returns 2: '\x7F\x00\x00\x01' (binary)
  var r, m, x, i, j, f = String.fromCharCode;
  m = a.match(/^(?:\d{1,3}(?:\.|$)){4}/); // IPv4
  if (m) {
    m = m[0].split('.');
    m = f(m[0]) + f(m[1]) + f(m[2]) + f(m[3]);
    // Return if 4 bytes, otherwise false.
    return m.length === 4 ? m : false;
  }
  r = /^((?:[\da-f]{1,4}(?::|)){0,8})(::)?((?:[\da-f]{1,4}(?::|)){0,8})$/;
  m = a.match(r); // IPv6
  if (m) {
    // Translate each hexadecimal value.
    for (j = 1; j < 4; j++) {
      // Indice 2 is :: and if no length, continue.
      if (j === 2 || m[j].length === 0) {
        continue;
      }
      m[j] = m[j].split(':');
      for (i = 0; i < m[j].length; i++) {
        m[j][i] = parseInt(m[j][i], 16);
        // Would be NaN if it was blank, return false.
        if (isNaN(m[j][i])) {
          return false; // Invalid IP.
        }
        m[j][i] = f(m[j][i] >> 8) + f(m[j][i] & 0xFF);
      }
      m[j] = m[j].join('');
    }
    x = m[1].length + m[3].length;
    if (x === 16) {
      return m[1] + m[3];
    } else if (x < 16 && m[2].length > 0) {
      return m[1] + (new Array(16 - x + 1)).join('\x00') + m[3];
    }
  }
  return false; // Invalid IP.
}
