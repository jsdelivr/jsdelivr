/*!
 * jQuery QueryBuilder
 * French translation by Damien "Mistic" Sorel
 */

jQuery.fn.queryBuilder.defaults.set({ lang: {
  "add_rule": "Ajouter une règle",
  "add_group": "Ajouter un groupe",
  "delete_rule": "Supprimer",
  "delete_group": "Supprimer",

  "condition_and": "ET",
  "condition_or": "OU",

  "filter_select_placeholder": "------",

  "operators": {
    "equal": "égal",
    "not_equal": "non égal",
    "in": "dans",
    "not_in": "pas dans",
    "less": "inférieur",
    "less_or_equal": "inférieur ou égal",
    "greater": "supérieur",
    "greater_or_equal": "supérieur ou égal",
    "between": "entre",
    "begins_with": "commence par",
    "not_begins_with": "ne commence pas par",
    "contains": "contient",
    "not_contains": "ne contient pas",
    "ends_with": "finit par",
    "not_ends_with": "ne finit pas par",
    "is_empty": "est vide",
    "is_not_empty": "n'est pas vide",
    "is_null": "est nul",
    "is_not_null": "n'est pas nul"
  },
  
  "errors": {
    "no_filter": "Aucun filtre sélectionné",
    "empty_group": "Le groupe est vide",
    "radio_empty": "Pas de valeur selectionnée",
    "checkbox_empty": "Pas de valeur selectionnée",
    "select_empty": "Pas de valeur selectionnée",
    "string_empty": "Valeur vide",
    "string_exceed_min_length": "Doit contenir au moins {0} caractères",
    "string_exceed_max_length": "Ne doit pas contenir plus de {0} caractères",
    "string_invalid_format": "Format invalide ({0})",
    "number_nan": "N'est pas un nombre",
    "number_not_integer": "N'est pas un entier",
    "number_not_double": "N'est pas un nombre réel",
    "number_exceed_min": "Doit être plus grand que {0}",
    "number_exceed_max": "Doit être plus petit que {0}",
    "number_wrong_step": "Doit être un multiple de {0}",
    "datetime_invalid": "Fomat de date invalide ({0})",
    "datetime_exceed_min": "Doit être après {0}",
    "datetime_exceed_max": "Doit être avant {0}"
  }
}});