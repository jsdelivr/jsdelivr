function strtr (str, from, to) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +      input by: uestla
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Alan C
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Taras Bogach
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +      input by: jpfle
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // -   depends on: krsort
  // -   depends on: ini_set
  // *     example 1: $trans = {'hello' : 'hi', 'hi' : 'hello'};
  // *     example 1: strtr('hi all, I said hello', $trans)
  // *     returns 1: 'hello all, I said hi'
  // *     example 2: strtr('äaabaåccasdeöoo', 'äåö','aao');
  // *     returns 2: 'aaabaaccasdeooo'
  // *     example 3: strtr('ääääääää', 'ä', 'a');
  // *     returns 3: 'aaaaaaaa'
  // *     example 4: strtr('http', 'pthxyz','xyzpth');
  // *     returns 4: 'zyyx'
  // *     example 5: strtr('zyyx', 'pthxyz','xyzpth');
  // *     returns 5: 'http'
  // *     example 6: strtr('aa', {'a':1,'aa':2});
  // *     returns 6: '2'
  var fr = '',
    i = 0,
    j = 0,
    lenStr = 0,
    lenFrom = 0,
    tmpStrictForIn = false,
    fromTypeStr = '',
    toTypeStr = '',
    istr = '';
  var tmpFrom = [];
  var tmpTo = [];
  var ret = '';
  var match = false;

  // Received replace_pairs?
  // Convert to normal from->to chars
  if (typeof from === 'object') {
    tmpStrictForIn = this.ini_set('phpjs.strictForIn', false); // Not thread-safe; temporarily set to true
    from = this.krsort(from);
    this.ini_set('phpjs.strictForIn', tmpStrictForIn);

    for (fr in from) {
      if (from.hasOwnProperty(fr)) {
        tmpFrom.push(fr);
        tmpTo.push(from[fr]);
      }
    }

    from = tmpFrom;
    to = tmpTo;
  }

  // Walk through subject and replace chars when needed
  lenStr = str.length;
  lenFrom = from.length;
  fromTypeStr = typeof from === 'string';
  toTypeStr = typeof to === 'string';

  for (i = 0; i < lenStr; i++) {
    match = false;
    if (fromTypeStr) {
      istr = str.charAt(i);
      for (j = 0; j < lenFrom; j++) {
        if (istr == from.charAt(j)) {
          match = true;
          break;
        }
      }
    } else {
      for (j = 0; j < lenFrom; j++) {
        if (str.substr(i, from[j].length) == from[j]) {
          match = true;
          // Fast forward
          i = (i + from[j].length) - 1;
          break;
        }
      }
    }
    if (match) {
      ret += toTypeStr ? to.charAt(j) : to[j];
    } else {
      ret += str.charAt(i);
    }
  }

  return ret;
}
