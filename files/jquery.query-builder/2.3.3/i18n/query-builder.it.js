/*!
 * jQuery QueryBuilder 2.3.3
 * Locale: Italian (it)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

(function(root, factory) {
    if (typeof define == 'function' && define.amd) {
        define(['jquery', 'query-builder'], factory);
    }
    else {
        factory(root.jQuery);
    }
}(this, function($) {
"use strict";

var QueryBuilder = $.fn.queryBuilder;

QueryBuilder.regional['it'] = {
  "__locale": "Italian (it)",
  "add_rule": "Aggiungi regola",
  "add_group": "Aggiungi gruppo",
  "delete_rule": "Elimina",
  "delete_group": "Elimina",
  "conditions": {
    "AND": "E",
    "OR": "O"
  },
  "operators": {
    "equal": "uguale",
    "not_equal": "non uguale",
    "in": "in",
    "not_in": "non in",
    "less": "minore",
    "less_or_equal": "minore o uguale",
    "greater": "maggiore",
    "greater_or_equal": "maggiore o uguale",
    "begins_with": "inizia con",
    "not_begins_with": "non inizia con",
    "contains": "contiene",
    "not_contains": "non contiene",
    "ends_with": "finisce con",
    "not_ends_with": "non finisce con",
    "is_empty": "è vuoto",
    "is_not_empty": "non è vuoto",
    "is_null": "è nullo",
    "is_not_null": "non è nullo"
  }
};

QueryBuilder.defaults({ lang_code: 'it' });
}));