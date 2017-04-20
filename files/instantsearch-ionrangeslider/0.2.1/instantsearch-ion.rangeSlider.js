/*!
 * instantsearch-ion.rangeSlider 0.2.1
 * https://github.com/algolia/instantsearch-ion.rangeSlider
 * Copyright 2016 Algolia, Inc. and other contributors; Licensed MIT
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

	function uniq(a) {
	  return a.reduce(function(p, c) {
	    if (p.indexOf(c) < 0) {
	      p.push(c);
	    }
	    return p;
	  }, []);
	}

	function slider(options) {
	  if (!options.attributeName || !options.container) {
	    throw new Error('ion.rangeSlider: usage: ionRangeSlider({container, attributeName, ionRangeSliderOptions})');
	  }
	  var $container = $(options.container);
	  if ($container.length === 0) {
	    throw new Error('ion.rangeSlider: cannot select \'' + options.container + '\'');
	  }
	  if (!$.fn.ionRangeSlider) {
	    throw new Error('The ion.rangeSlider jQuery plugin is missing. Did you include ion.rangeSlider.min.js?');
	  }

	  var lowerBoundAttributeName = options.attributeName.lowerBound || options.attributeName;
	  var upperBoundAttributeName = options.attributeName.upperBound || options.attributeName;
	  var ionRangeSliderOptions = options.ionRangeSliderOptions || {};

	  var needFacet = typeof options.min === 'undefined' || typeof options.max === 'undefined';
	  var ionRangeSlider;

	  return {
	    getConfiguration: function() {
	      return needFacet ? {
	        disjunctiveFacets: uniq([lowerBoundAttributeName, upperBoundAttributeName])
	      } : {};
	    },

	    init: function(args) {
	      var helper = args.helper;

	      if (typeof options.min !== 'undefined') {
	        helper.addNumericRefinement(lowerBoundAttributeName, '>=', options.min);
	      }
	      if (typeof options.max !== 'undefined') {
	        helper.addNumericRefinement(upperBoundAttributeName, '<=', options.max);
	      }
	    },

	    render: function(args) {
	      var helper = args.helper;

	      var from = helper.state.getNumericRefinement(lowerBoundAttributeName, '>=');
	      from = from && from[0];

	      var to = helper.state.getNumericRefinement(upperBoundAttributeName, '<=');
	      to = to && to[0];

	      var min;
	      var max;
	      if (needFacet) {
	        var lowerFacetStats = args.results.getFacetStats(lowerBoundAttributeName);
	        var upperFacetStats = args.results.getFacetStats(upperBoundAttributeName);
	        min = lowerFacetStats ? lowerFacetStats.min : 0;
	        max = upperFacetStats ? upperFacetStats.max : 0;
	      } else {
	        min = options.min;
	        max = options.max;
	      }
	      from = from || min;
	      to = to || max;

	      var sliderOptions = {
	        type: 'double',
	        grid: true,
	        min: min,
	        max: max,
	        from: from,
	        to: to,
	        onFinish: function(data) {
	          if (data.from !== from) {
	            helper.removeNumericRefinement(lowerBoundAttributeName, '>=');
	            helper.addNumericRefinement(lowerBoundAttributeName, '>=', data.from);
	            helper.search();
	          }
	          if (data.to !== to) {
	            helper.removeNumericRefinement(upperBoundAttributeName, '<=');
	            helper.addNumericRefinement(upperBoundAttributeName, '<=', data.to);
	            helper.search();
	          }
	        }
	      };

	      sliderOptions = $.extend({}, sliderOptions, ionRangeSliderOptions);
	      $container.show();
	      if (ionRangeSlider) {
	        ionRangeSlider.update(sliderOptions);
	      } else {
	        $container.ionRangeSlider(sliderOptions);
	        ionRangeSlider = $container.data('ionRangeSlider');
	      }
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