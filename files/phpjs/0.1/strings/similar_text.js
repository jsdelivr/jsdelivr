function similar_text (first, second, percent) {
  // http://kevin.vanzonneveld.net
  // +   original by: Rafał Kukawski (http://blog.kukawski.pl)
  // +   bugfixed by: Chris McMacken
  // +   added percent parameter by: Markus Padourek (taken from http://www.kevinhq.com/2012/06/php-similartext-function-in-javascript_16.html)
  // *     example 1: similar_text('Hello World!', 'Hello phpjs!');
  // *     returns 1: 7
  // *     example 2: similar_text('Hello World!', null);
  // *     returns 2: 0
  // *     example 3: similar_text('Hello World!', null, 1);
  // *     returns 3: 58.33
  // *   bugfixed by: Jarkko Rantavuori based on findings in stackoverflow (http://stackoverflow.com/questions/14136349/how-does-similar-text-work)
  if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
    return 0;
  }

  first += '';
  second += '';

  var pos1 = 0,
    pos2 = 0,
    max = 0,
    firstLength = first.length,
    secondLength = second.length,
    p, q, l, sum;

  max = 0;

  for (p = 0; p < firstLength; p++) {
    for (q = 0; q < secondLength; q++) {
      for (l = 0;
      (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++);
      if (l > max) {
        max = l;
        pos1 = p;
        pos2 = q;
      }
    }
  }

  sum = max;

  if (sum) {
    if (pos1 && pos2) {
      sum += this.similar_text(first.substr(0, pos1), second.substr(0, pos2));
    }

    if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
      sum += this.similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max, secondLength - pos2 - max));
    }
  }

  if (!percent) {
    return sum;
  } else {
    return (sum * 200) / (firstLength + secondLength);
  }
}
