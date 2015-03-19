function fgetc (handle) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: fopen('http://kevin.vanzonneveld.net/pj_test_supportfile_1.htm', 'r');
  // *     example 1: fgetc(handle);
  // *     returns 1: '1'

  if (!this.php_js || !this.php_js.resourceData || !this.php_js.resourceDataPointer) {
    return false;
  }

  var start = this.php_js.resourceDataPointer[handle.id];

  if (start === undefined || !this.php_js.resourceData[handle.id][start]) {
    return false; // Resource was already closed or already reached the end of the file
  }

  var length = 1; // 2 byte-character (or surrogate)
  this.php_js.resourceDataPointer[handle.id] += length;
  var chr = this.php_js.resourceData[handle.id].substr(start, length);

  // If don't want to treat surrogate pairs as single characters, can delete from here until the last line (return chr;)
  var nextChr = this.php_js.resourceData[handle.id].substr(start + 1, 1);
  var prevChr = start === 0 ? false : this.php_js.resourceData[handle.id].substr(start - 1, 1);
  var code = chr.charCodeAt(0);
  if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
    if (!nextChr) {
      throw 'High surrogate without following low surrogate (fgetc)';
    }
    var next = nextChr.charCodeAt(0);
    if (0xDC00 > next || next > 0xDFFF) {
      throw 'High surrogate without following low surrogate (fgetc)';
    }
    this.php_js.resourceDataPointer[handle.id] += length; // Need to increment counter again since grabbing next item
    return chr + nextChr;
  } else if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
    if (prevChr === false) {
      throw 'Low surrogate without preceding high surrogate (fgetc)';
    }
    var prev = prevChr.charCodeAt(0);
    if (0xD800 > prev || prev > 0xDBFF) { //(could change last hex to 0xDB7F to treat high private surrogates as single characters)
      throw 'Low surrogate without preceding high surrogate (fgetc)';
    }
    return prevChr + chr; // Probably shouldn't have reached here, at least if traversing by fgetc()
  }

  return chr;
}
