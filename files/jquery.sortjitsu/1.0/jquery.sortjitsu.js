/**
 * sortjitsu - jQuery plugin to sort page elements based on url search parameters
 * @version v1.0.0
 * @link https://github.com/Fullscreen/sortjitsu#readme
 * @license MIT
 */

(function (factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
      // AMD
      define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
      factory(require('jquery'));
  } else {
      // Browser globals
      factory(jQuery);
  }
}(function ($) {
  var Sortjitsu; // declare function to assign to $.fn.sortjitsu

  /**
   * Extract search queries from url
   * @return {Array} list of strings of search queries
   */
  function searchQueries () {
    var encodedSearchParams,
        decodedSearchParams,
        filteredSearchParams,
        i;

    // URL parameters for sortjitsu are encoded. Split the search query
    // parameters on `&` to split out the parts of the search query
    encodedSearchParams = window.location.search.replace('?', '').split('&');

    // Decode each part of the search query
    decodedSearchParams = encodedSearchParams.map(function (encodedParam) {
      return decodeURIComponent(encodedParam);
    });

    // filter out key value pairs that are not intended for sortjitsu
    filteredSearchParams = decodedSearchParams.filter(function (param) {
      return param.slice(0, 4) === 'sort';
    });

    return filteredSearchParams || [];
  }

  /**
   * Extract parameters from search queries list
   * @return {Object} Search keys with values
   */
  function parameters () {
    var results = {};

    $.each(searchQueries(), function (_index, query) {
      var splitQuery = query.split('=');

      if (splitQuery.length === 2) {
        results[splitQuery[0]] = splitQuery[1];
      }
    });

    return results;
  }

  /**
   * Build the jQuery selector for elements that do not match search query
   * @param  {Object} params   - search query parameters from `parameters()`
   * @param  {Object} settings - plugin settings
   * @return {String} jQuery selector
   */
  function extractSortKeyword (params, settings) {
    var sortKeyword,
        isReverse = false,
        key;

    for (key in params) {
      if (params.hasOwnProperty(key) && params[key]) {
        sortKeyword = params[key];
        break;
      }
    }

    // if the sort is reversed, trim the `-` character off of the sort keyword
    if (/^\-/.test(sortKeyword)) {
      isReverse = true;
      sortKeyword = sortKeyword.slice(1, sortKeyword.length);
    }

    return {
      sortKeyword: sortKeyword,
      isReverse: isReverse
    };
  }

  /**
   * Sort elements in the dom based on the sortKeyword
   * @param  {String} sortKeyword - denotes the keyword to be used in the jQuery selector
   * @param  {Boolean} isReverse  - determine sort direction
   * @param  {Object} settings    - plugin setting
   * @return {Array} array of jQuery objects of elements hidden
   */
  function sortElements (sortKeyword, isReverse, settings) {
    var queryString = '[data-' + sortKeyword + ']',
        isNumeric = true,
        sortFunc,
        $sortedList;

    function alphaSort (a, b) {
      var sA = String($(a).find(queryString).data(sortKeyword)),
          sB = String($(b).find(queryString).data(sortKeyword));

      return sA.localeCompare(sB);
    }

    function numSort (a, b) {
      var nA = Number($(a).find(queryString).data(sortKeyword)),
          nB = Number($(b).find(queryString).data(sortKeyword));

      return nA - nB;
    }

    // determine if the data attributes are numeric or alphanumeric
    $.each($(settings.DATA_SORTABLE), function (i, el) {
      isNumeric = isNumeric && $.isNumeric($(el).find(queryString).data(sortKeyword));
    });

    sortFunc = isNumeric ? numSort : alphaSort;

    $sortedList = $(settings.DATA_SORTABLE).sort(sortFunc);

    if (isReverse) {
      $sortedList = $sortedList.get().reverse();
    }

    return $sortedList;
  }

  /**
   * sortjitsue plugin definition
   * @param  {Object} options - options to be passed into the jQuery plugin
   */
  Sortjitsu = function (options) {
    var defaults = $.fn.sortjitsu.defaults,
        settings = $.extend({}, defaults, options);

    function init() {
      var params = parameters(),
          sortKeywordObj = extractSortKeyword(params, settings);

      // do not attempt to sort if there is not a sort key value pair in the url
      if (!sortKeywordObj.sortKeyword) {
        return;
      }

      $('.sortjitsu-wrapper').html(sortElements(sortKeywordObj.sortKeyword, sortKeywordObj.isReverse, settings));
    }

    init();
  };

  Sortjitsu.defaults = {
    /**
     * jQuery selector for all sortable elements
     * @type {String}
     */
    DATA_SORTABLE: '[data-sortable]'
  };

  $.fn.sortjitsu = Sortjitsu;
}));
