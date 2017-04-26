/*!
 * instantsearch-ion.rangeSlider 0.1.0
 * https://github.com/algolia/instantsearch-ion.rangeSlider
 * Copyright 2015 Algolia, Inc. and other contributors; Licensed MIT
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(2);
	var instantsearch = __webpack_require__(3);

	function slider(options) {
	  if (!options.facetName || !options.container) {
	    throw new Error('ion.rangeSlider: usage: ionRangeSlider({container, facetName})');
	  }
	  var $container = $(options.container);
	  if ($container.length === 0) {
	    throw new Error('ion.rangeSlider: cannot select \'' + options.container + '\'');
	  }
	  if (!$.fn.ionRangeSlider) {
	    throw new Error('The ion.rangeSlider jQuery plugin is missing. Did you include ion.rangeSlider.min.js?');
	  }
	  var facetName = options.facetName;

	  return {
	    getConfiguration: function() {
	      return {
	        disjunctiveFacets: [facetName]
	      };
	    },

	    render: function(args) {
	      var helper = args.helper;
	      var stats = args.results.getFacetStats(facetName);

	      var from = helper.state.getNumericRefinement(facetName, '>=');
	      from = from && from[0] || stats.min;

	      var to = helper.state.getNumericRefinement(facetName, '<=');
	      to = to && to[0] || stats.max;

	      var sliderOptions = {
	        type: 'double',
	        grid: true,
	        min: stats.min,
	        max: stats.max,
	        from: from,
	        to: to,
	        onFinish: function(data) {
	          if (data.from !== from) {
	            helper.removeNumericRefinement(facetName, '>=');
	            helper.addNumericRefinement(facetName, '>=', data.from);
	            helper.search();
	          }
	          if (data.to !== to) {
	            helper.removeNumericRefinement(facetName, '<=');
	            helper.addNumericRefinement(facetName, '<=', data.to);
	            helper.search();
	          }
	        }
	      };
	      $container.ionRangeSlider(sliderOptions);
	    }
	  };
	}

	module.exports = instantsearch.widgets.ionRangeSlider = slider;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = instantsearch;

/***/ }
/******/ ]);