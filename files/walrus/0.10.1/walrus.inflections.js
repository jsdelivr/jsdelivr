(function() {
  var Walrus, gsub, inflect, pluralize, plurals, singularize, singulars, uncountables,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Walrus = (typeof exports !== "undefined" && exports !== null ? require('./walrus') : this).Walrus;

  /**
   * Plenty of the methods in `walrus.inflections` are borrowed from or inspired by ActiveSupport:
   * https://github.com/rails/rails/tree/master/activesupport
   * JavaScript inflector implementation ported from underscore.inflection:
   * https://github.com/jeremyruppel/underscore.inflection
   * (Which was also inspired by and borrows from ActiveSupport)
  */

  plurals = [[/$/, 's'], [/s$/, 's'], [/(ax|test)is$/, '$1es'], [/(octop|vir)us$/, '$1i'], [/(octop|vir)i$/, '$1i'], [/(alias|status)$/, '$1es'], [/(bu)s$/, '$1ses'], [/(buffal|tomat)o$/, '$1oes'], [/([ti])um$/, '$1a'], [/([ti])a$/, '$1a'], [/sis$/, 'ses'], [/(?:([^f])fe|([lr])f)$/, '$1$2ves'], [/(hive)$/, '$1s'], [/([^aeiouy]|qu)y$/, '$1ies'], [/(x|ch|ss|sh)$/, '$1es'], [/(matr|vert|ind)(?:ix|ex)$/, '$1ices'], [/([m|l])ouse$/, '$1ice'], [/([m|l])ice$/, '$1ice'], [/^(ox)$/, '$1en'], [/^(oxen)$/, '$1'], [/(quiz)$/, '$1zes'], ['person', 'people'], ['man', 'men'], ['child', 'children'], ['sex', 'sexes'], ['move', 'moves'], ['cow', 'kine']].reverse();

  singulars = [[/s$/, ''], [/(n)ews$/, '$1ews'], [/([ti])a$/, '$1um'], [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/, '$1$2sis'], [/(^analy)ses$/, '$1sis'], [/([^f])ves$/, '$1fe'], [/(hive)s$/, '$1'], [/(tive)s$/, '$1'], [/([lr])ves$/, '$1f'], [/([^aeiouy]|qu)ies$/, '$1y'], [/(s)eries$/, '$1eries'], [/(m)ovies$/, '$1ovie'], [/(x|ch|ss|sh)es$/, '$1'], [/([m|l])ice$/, '$1ouse'], [/(bus)es$/, '$1'], [/(o)es$/, '$1'], [/(shoe)s$/, '$1'], [/(cris|ax|test)es$/, '$1is'], [/(octop|vir)i$/, '$1us'], [/(alias|status)es$/, '$1'], [/^(ox)en/, '$1'], [/(vert|ind)ices$/, '$1ex'], [/(matr)ices$/, '$1ix'], [/(quiz)zes$/, '$1'], [/(database)s$/, '$1'], ['cow', 'kine'], ['move', 'moves'], ['sex', 'sexes'], ['child', 'children'], ['man', 'men'], ['person', 'people']].reverse();

  uncountables = ['equipment', 'information', 'rice', 'money', 'species', 'series', 'fish', 'sheep', 'jeans'];

  gsub = function(word, rule, replacement) {
    var pattern;
    pattern = new RegExp(rule.source || rule, 'gi');
    if (pattern.test(word)) return word.replace(pattern, replacement);
  };

  inflect = function(word, rules) {
    var result, rule, sub, _i, _len;
    result = word;
    for (_i = 0, _len = rules.length; _i < _len; _i++) {
      rule = rules[_i];
      sub = gsub(word, rule[0], rule[1]);
      if (sub) result = sub;
      if (sub) break;
    }
    return result;
  };

  singularize = function(word) {
    if (__indexOf.call(uncountables, word) >= 0) return word;
    return inflect(word, singulars);
  };

  pluralize = function(word, count, includeCount) {
    var result;
    if (includeCount == null) includeCount = false;
    if (count != null) {
      result = count === 1 ? singularize(word) : pluralize(word);
      return result = includeCount ? "" + count + " " + result : result;
    } else {
      if (__indexOf.call(uncountables, word) >= 0) return word;
      return inflect(word, plurals);
    }
  };

  /**
   * *:pluralize*
   * Pluralizes the given word, optionally based on a _count_, and also optionally
   * including the count in the result.
   *
   * Parameters:
   *  word - the word to be pluralized
   *  count - Optional: count to base pluralization on
   *  includeCount - Optional: whether or not to include the count in the result
   *
   * Usage:
   *
   *  {{ "book" | :pluralize }} // => "books"
   *
   *  {{ "book" | :pluralize( 1 ) }} // => "book"
   *
   *  {{ "book" | :pluralize( 5, true ) }} // => "5 books"
  */

  Walrus.addFilter('pluralize', pluralize);

  /**
   * *:singularize*
   * Singularizes the given word. You're probably looking for `pluralize`.
   *
   * Parameters: none
   *
   * Usage:
   *
   *  {{ "books" | :singularize }} // => "book"
  */

  Walrus.addFilter('singularize', singularize);

  /**
   * *:ordinalize*
   * Turns a number into an ordinal string, like 1st, 2nd, 3rd, etc...
   *
   * Parameters: none
   *
   * Usage:
   *
   *  {{ 5 | :ordinalize }} // => "5th"
  */

  Walrus.addFilter('ordinalize', function(value) {
    var normal, _ref;
    normal = Math.abs(Math.round(value));
    if (_ref = normal % 100, __indexOf.call([11, 12, 13], _ref) >= 0) {
      return "" + value + "th";
    } else {
      switch (normal % 10) {
        case 1:
          return "" + value + "st";
        case 2:
          return "" + value + "nd";
        case 3:
          return "" + value + "rd";
        default:
          return "" + value + "th";
      }
    }
  });

}).call(this);
