function xdiff_string_patch (originalStr, patch, flags, error) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Steven Levithan (stevenlevithan.com)
  // %        note 1: The XDIFF_PATCH_IGNORESPACE flag and the error argument are not currently supported
  // %        note 2: This has not been widely tested
  // *     example 1: xdiff_string_patch('', '@@ -0,0 +1,1 @@\n+Hello world!');
  // *     returns 1: 'Hello world!'

  // First two functions were adapted from Steven Levithan, also under an MIT license
  // Adapted from XRegExp 1.5.0
  // (c) 2007-2010 Steven Levithan
  // MIT License
  // <http://xregexp.com>
  var getNativeFlags = function (regex) {
    return (regex.global ? "g" : "") + (regex.ignoreCase ? "i" : "") + (regex.multiline ? "m" : "") + (regex.extended ? "x" : "") + // Proposed for ES4; included in AS3
    (regex.sticky ? "y" : "");
  },
    cbSplit = function (str, s /* separator */ ) {
      // If separator `s` is not a regex, use the native `split`
      if (!(s instanceof RegExp)) { // Had problems to get it to work here using prototype test
        return String.prototype.split.apply(str, arguments);
      }
      str = str + '';
      var output = [],
        lastLastIndex = 0,
        match, lastLength, limit = Infinity;

      // This is required if not `s.global`, and it avoids needing to set `s.lastIndex` to zero
      // and restore it to its original value when we're done using the regex
      var x = s._xregexp;
      s = new RegExp(s.source, getNativeFlags(s) + 'g'); // Brett paring down
      if (x) {
        s._xregexp = {
          source: x.source,
          captureNames: x.captureNames ? x.captureNames.slice(0) : null
        };
      }

      while ((match = s.exec(str))) { // Run the altered `exec` (required for `lastIndex` fix, etc.)
        if (s.lastIndex > lastLastIndex) {
          output.push(str.slice(lastLastIndex, match.index));

          if (match.length > 1 && match.index < str.length) {
            Array.prototype.push.apply(output, match.slice(1));
          }

          lastLength = match[0].length;
          lastLastIndex = s.lastIndex;

          if (output.length >= limit) break;
        }

        if (s.lastIndex === match.index) {
          s.lastIndex++;
        }
      }

      if (lastLastIndex === str.length) {
        if (!s.test("") || lastLength) {
          output.push("");
        }
      } else {
        output.push(str.slice(lastLastIndex));
      }

      return output.length > limit ? output.slice(0, limit) : output;
    },
    i = 0,
    ll = 0,
    ranges = [],
    lastLinePos = 0,
    firstChar = '',
    rangeExp = /^@@\s+-(\d+),(\d+)\s+\+(\d+),(\d+)\s+@@$/,
    lineBreaks = /\r?\n/,
    lines = cbSplit(patch.replace(/(\r?\n)+$/, ''), lineBreaks),
    origLines = cbSplit(originalStr, lineBreaks),
    newStrArr = [],
    linePos = 0,
    errors = '',
    // Both string & integer (constant) input is allowed
    optTemp = 0,
    OPTS = { // Unsure of actual PHP values, so better to rely on string
      'XDIFF_PATCH_NORMAL': 1,
      'XDIFF_PATCH_REVERSE': 2,
      'XDIFF_PATCH_IGNORESPACE': 4
    };

  // Input defaulting & sanitation
  if (typeof originalStr !== 'string' || !patch) {
    return false;
  }
  if (!flags) {
    flags = 'XDIFF_PATCH_NORMAL';
  }

  if (typeof flags !== 'number') { // Allow for a single string or an array of string flags
    flags = [].concat(flags);
    for (i = 0; i < flags.length; i++) {
      // Resolve string input to bitwise e.g. 'XDIFF_PATCH_NORMAL' becomes 1
      if (OPTS[flags[i]]) {
        optTemp = optTemp | OPTS[flags[i]];
      }
    }
    flags = optTemp;
  }

  if (flags & OPTS.XDIFF_PATCH_NORMAL) {
    for (i = 0, ll = lines.length; i < ll; i++) {
      ranges = lines[i].match(rangeExp);
      if (ranges) {
        lastLinePos = linePos;
        linePos = ranges[1] - 1;
        while (lastLinePos < linePos) {
          newStrArr[newStrArr.length] = origLines[lastLinePos++];
        }
        while (lines[++i] && (rangeExp.exec(lines[i])) == null) {
          firstChar = lines[i].charAt(0);
          switch (firstChar) {
          case '-':
            ++linePos; // Skip including that line
            break;
          case '+':
            newStrArr[newStrArr.length] = lines[i].slice(1);
            break;
          case ' ':
            newStrArr[newStrArr.length] = origLines[linePos++];
            break;
          default:
            throw 'Unrecognized initial character in unidiff line'; // Reconcile with returning errrors arg?
          }
        }
        if (lines[i]) {
          i--;
        }
      }
    }
	while (linePos < origLines.length) {
	  newStrArr[newStrArr.length] = origLines[linePos++];
	}
  } else if (flags & OPTS.XDIFF_PATCH_REVERSE) { // Only differs from above by a few lines
    for (i = 0, ll = lines.length; i < ll; i++) {
      ranges = lines[i].match(rangeExp);
      if (ranges) {
        lastLinePos = linePos;
        linePos = ranges[3] - 1;
        while (lastLinePos < linePos) {
          newStrArr[newStrArr.length] = origLines[lastLinePos++];
        }
        while (lines[++i] && (rangeExp.exec(lines[i])) == null) {
          firstChar = lines[i].charAt(0);
          switch (firstChar) {
          case '-':
            newStrArr[newStrArr.length] = lines[i].slice(1);
            break;
          case '+':
            ++linePos; // Skip including that line
            break;
          case ' ':
            newStrArr[newStrArr.length] = origLines[linePos++];
            break;
          default:
            throw 'Unrecognized initial character in unidiff line'; // Reconcile with returning errrors arg?
          }
        }
        if (lines[i]) {
          i--;
        }
      }
    }
	while (linePos < origLines.length) {
	  newStrArr[newStrArr.length] = origLines[linePos++];
	}
  }
  if (typeof error === 'string') {
    this.window[error] = errors;
  }
  return newStrArr.join('\n');
}
