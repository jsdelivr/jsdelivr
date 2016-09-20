/**
 * filterjitsu - jQuery plugin to filter page elements based on url search parameters
 * @version v2.0.0
 * @link https://github.com/Fullscreen/filterjitsu#readme
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
  var Filterjitsu; // declare function to assign to $.fn.filterjitsu

  /**
   * Extract search queries from url
   * @return {Array} list of strings of search queries
   */
  function searchQueries () {
    var encodedSearchParams,
        decodedSearchParams,
        filteredSearchParams;

    // URL parameters for filterjitsu are encoded. Split the search query
    // parameters on `&` to split out the parts of the search query
    encodedSearchParams = window.location.search.replace('?', '').split('&');

    // Decode each part of the search query
    decodedSearchParams = encodedSearchParams.map(function (encodedParam) {
      return decodeURIComponent(encodedParam);
    });

    // filter out key value pairs that are not intended for filterjitsu
    filteredSearchParams = decodedSearchParams.filter(function (param) {
      return param.slice(0, 6) === 'filter';
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
  function buildQueryString (params, settings) {
    var selectorsArr = [],
        str = '',
        key;

    for (key in params) {
      if (params.hasOwnProperty(key) && params[key]) {
        selectorsArr.push(settings.DATA_FILTERABLE + '[data-' + key + '][data-' + key + '!="' + params[key] + '"]');
      }
    }

    str = selectorsArr.join(', ');

    return str === settings.DATA_FILTERABLE ? '' : str;
  }

  /**
   * Hide rows that do not match the desired data field
   * @param  {Object} queryString - jQuery selector
   * @param  {Object} settings    - plugin setting
   * @return {Array} array of jQuery objects of elements hidden
   */
  function hideUnmatchedRows (queryString, settings) {
    // filter the elements that match the `'[data-filterable][data-' + key + '!=' + params[key] + ']'`
    // selector and hide the resulting elements
    return $(settings.DATA_FILTERABLE)
      .filter(queryString)
      .hide();
  }

  /**
   * Update the count of visible rows
   * @param  {Object} settings - plugin settings
   * @return {Array} array of jQuery objects that match the `[data-count]`` selector
   */
  function updateCount (settings) {
    var count = $(settings.DATA_FILTERABLE + ':visible').length,
        countString = $('[data-count]').data('count'),
        itemText = (count === 1) ? countString : countString + 's';

    return $(settings.DATA_COUNT).text(count + ' ' + itemText);
  }

  /**
   * Build bootstrap style alert with category type string
   * @param  {String} categoryTypesStr - comma separated list of search query string keys
   * @param  {String} pathname         - url path to clear search query string
   * @param  {Object} settings         - plugin setting
   * @return {String} valid bootrap html for an alert
   */
  function buildHtmlAlert(categoryTypesStr, pathname, settings) {
    var alertString = $('[data-alert]').data('alert');

    return (
      '<div id="info" class="alert alert-info text-center col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">' +
      '  You are viewing only ' + categoryTypesStr + ' ' + alertString + 's.' +
      '  <a href="' + pathname + '">View all ' + alertString + 's.</a>' +
      '</div>'
    );
  }

  /**
   * Replace or append an alert to the view
   * @param  {Object} params   - search query parameters from `parameters()`
   * @param  {Object} settings - plugin settings
   */
  function replaceOrAppendAlert (params, settings) {
    var i,
        html,
        param,
        paramsKey,
        paramsKeys = Object.keys(params),
        categoryTypes = [];

    // build array of category types based on the params
    for (i = 0; i < paramsKeys.length; i++) {
      paramsKey = paramsKeys[i];
      param = params[paramsKey];
      if (param !== undefined) {
        categoryTypes.push(param);
      }
    }

    // only display the html alert if there are categories in the categoryTypes array
    // only replace the html if the info element exists in the dom
    if (categoryTypes.length > 0 && $(settings.DATA_ALERT).length > 0) {
      html = buildHtmlAlert(categoryTypes.join(', '), window.location.pathname, settings);
      $(settings.DATA_ALERT).html(html);
    }
  }

  /**
   * filterjitsue plugin definition
   * @param  {Object} options - options to be passed into the jQuery plugin
   */
  Filterjitsu = function (options) {
    var defaults = $.fn.filterjitsu.defaults,
        settings = $.extend({}, defaults, options);

    function init() {
      var params = parameters(),
          queryString = buildQueryString(params, settings);

      hideUnmatchedRows(queryString, settings);
      updateCount(settings);
      replaceOrAppendAlert(params, settings);
    }

    init();
  };

  Filterjitsu.defaults = {
    /**
     * jQuery selector for all filterable elements
     * @type {String}
     */
    DATA_FILTERABLE: '[data-filterable]',
    /**
     * jQuery selector for field to show count
     * @type {String}
     */
    DATA_COUNT: '[data-count]',
    /**
     * jQuery selector for info
     * @type {String}
     */
    DATA_ALERT: '[data-alert]'
  };

  $.fn.filterjitsu = Filterjitsu;
}));
