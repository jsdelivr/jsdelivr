/*! instantsearch-googlemaps 1.2.2 | © Algolia | github.com/instantsearch/instantsearch-googlemaps */(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("ReactDOM"), require("instantsearch"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "ReactDOM", "instantsearch"], factory);
	else if(typeof exports === 'object')
		exports["instantsearchGoogleMaps"] = factory(require("React"), require("ReactDOM"), require("instantsearch"));
	else
		root["instantsearchGoogleMaps"] = factory(root["React"], root["ReactDOM"], root["instantsearch"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_65__) {
return /******/ (function(modules) { // webpackBootstrap
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

	/* global google */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _srcGoogleMapsJs = __webpack_require__(3);

	var _srcGoogleMapsJs2 = _interopRequireDefault(_srcGoogleMapsJs);

	var _lodashFunctionDebounce = __webpack_require__(58);

	var _lodashFunctionDebounce2 = _interopRequireDefault(_lodashFunctionDebounce);

	var _instantsearchJs = __webpack_require__(65);

	var _instantsearchJs2 = _interopRequireDefault(_instantsearchJs);

	/**
	 * algolia/instantsearch.js widget to display your Algolia geo hits on a map using Google Maps APIs
	 * @param  {DOMElement} options.container Where to insert the map in the document. This is required.
	 * @param  {function} [options.prepareMarkerData] Function Called for every hit,
	 * this is the moment where you can select the label and title
	 * for the marker. This function should return an object in the form of `{label, title}`.
	 *
	 * Example:
	 *
	 * ```js
	 * function prepareMarkerData(hit, index, hits) {
	 *   return {
	 *     label: hit.name,
	 *     title: hit.description
	 *   }
	 * }
	 * ```
	 *
	 * The `label` first letter will be displayed on the marker on the map.
	 *
	 * The `title` will be displayed when hovering the marker.
	 *
	 * By default we use the current hit index in the results as the label and the hit `ObjectID` for the title.
	 * when hovering the marker
	 * @param {boolean} [options.refineOnMapInteraction=false] Should we refine the search
	 * on map interaction, default to false
	 * @return {Object}
	 */
	function googleMaps(_ref) {
	  var container = _ref.container;
	  var _ref$refineOnMapInteraction = _ref.refineOnMapInteraction;
	  var refineOnMapInteraction = _ref$refineOnMapInteraction === undefined ? false : _ref$refineOnMapInteraction;
	  var _ref$prepareMarkerData = _ref.prepareMarkerData;
	  var prepareMarkerData = _ref$prepareMarkerData === undefined ? function (hit, index) {
	    return {
	      label: '' + index,
	      title: hit.objectID
	    };
	  } : _ref$prepareMarkerData;

	  var widget = {
	    _refine: function _refine(_ref2, userRefine) {
	      var helper = _ref2.helper;

	      var p1 = userRefine.bounds.getNorthEast();
	      var p2 = userRefine.bounds.getSouthWest();
	      var box = [p1.lat(), p1.lng(), p2.lat(), p2.lng()];
	      this._lastUserRefine = userRefine;

	      helper.setQueryParameter('insideBoundingBox', box.join(',')).search().setQueryParameter('insideBoundingBox', undefined);
	    },

	    render: function render(_ref3) {
	      var _this = this;

	      var results = _ref3.results;
	      var helper = _ref3.helper;

	      var zoom = undefined;
	      var center = undefined;

	      var markers = results.hits.map(function (hit, index) {
	        return _extends({
	          position: new google.maps.LatLng(hit._geoloc),
	          id: hit.objectID
	        }, prepareMarkerData(hit, index, results.hits));
	      });

	      if (markers.length === 0) {
	        zoom = 1;
	        center = new google.maps.LatLng({
	          lat: 48.797885,
	          lng: 2.337034
	        });
	      } else if (this._lastUserRefine) {
	        zoom = this._lastUserRefine.zoom;
	        center = this._lastUserRefine.center;
	        this._lastUserRefine = false;
	      } else {
	        (function () {
	          var bounds = new google.maps.LatLngBounds();
	          markers.forEach(function (marker) {
	            return bounds.extend(marker.position);
	          });
	          zoom = _this._getBestZoomLevel(bounds, container.getBoundingClientRect());
	          center = bounds.getCenter();
	        })();
	      }

	      _reactDom2['default'].render(_react2['default'].createElement(_srcGoogleMapsJs2['default'], {
	        center: center,
	        markers: markers,
	        refine: this._refine.bind(this, { helper: helper }),
	        refineOnMapInteraction: refineOnMapInteraction,
	        zoom: zoom
	      }), container);
	    },

	    // http://stackoverflow.com/a/13274361/147079
	    // We cannot use map.fitBounds because we are in a React world
	    // where you should not (and it does not works) try to modify
	    // the rendering once rendered
	    // You need to recompute the right props
	    // It's actually a lot easier than the previous implementation
	    // that was using a LOT of state
	    _getBestZoomLevel: function _getBestZoomLevel(bounds, mapDim) {
	      var WORLD_DIM = { height: 256, width: 256 };
	      var ZOOM_MAX = 21;

	      function latRad(lat) {
	        var sin = Math.sin(lat * Math.PI / 180);
	        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
	        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
	      }

	      function zoom(mapPx, worldPx, fraction) {
	        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
	      }

	      var ne = bounds.getNorthEast();
	      var sw = bounds.getSouthWest();

	      var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

	      var lngDiff = ne.lng() - sw.lng();
	      var lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

	      var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
	      var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

	      return Math.min(latZoom, lngZoom, ZOOM_MAX);
	    }
	  };

	  // no need to do too much map rendering:
	  //  - it can take a lot of time to display a map with all the tiles
	  //  - most of the time the first letters are not worth a map
	  //  - a constantly moving map is annoying
	  widget.render = (0, _lodashFunctionDebounce2['default'])(widget.render, 500);

	  return widget;
	}

	_instantsearchJs2['default'].widgets.googleMaps = googleMaps;

	exports['default'] = googleMaps;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* global google */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactGoogleMaps = __webpack_require__(4);

	var _reactGoogleMapsLibAddonsMarkerClusterer = __webpack_require__(54);

	var _reactGoogleMapsLibAddonsMarkerClusterer2 = _interopRequireDefault(_reactGoogleMapsLibAddonsMarkerClusterer);

	var _lodashFunctionDebounce = __webpack_require__(58);

	var _lodashFunctionDebounce2 = _interopRequireDefault(_lodashFunctionDebounce);

	var GoogleMaps = (function (_React$Component) {
	  _inherits(GoogleMaps, _React$Component);

	  function GoogleMaps(props) {
	    _classCallCheck(this, GoogleMaps);

	    _get(Object.getPrototypeOf(GoogleMaps.prototype), 'constructor', this).call(this, props);
	    this._userRefine = (0, _lodashFunctionDebounce2['default'])(this._userRefine, 200);
	  }

	  _createClass(GoogleMaps, [{
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps) {
	      var _this = this;

	      return nextProps.zoom !== this.props.zoom || // user has changed zoom
	      nextProps.markers.length !== this.props.markers.length || // different results number
	      nextProps.markers.some(function (marker, markerIndex) {
	        return (// same number of results, but different markers?
	          _this.props.markers[markerIndex] === undefined || marker.id !== _this.props.markers[markerIndex].id
	        );
	      });
	    }
	  }, {
	    key: '_shouldRefineOnMapInteraction',
	    value: function _shouldRefineOnMapInteraction(fn) {
	      if (this.props.refineOnMapInteraction === true) {
	        return fn;
	      }

	      return function noop() {};
	    }
	  }, {
	    key: '_userRefine',
	    value: function _userRefine() {
	      if (this.props.refineOnMapInteraction) {
	        this.props.refine({
	          bounds: this._map.getBounds(),
	          center: this._map.getCenter(),
	          zoom: this._map.getZoom()
	        });
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      return _react2['default'].createElement(_reactGoogleMaps.GoogleMapLoader, {
	        containerElement: _react2['default'].createElement('div', { style: { height: '100%' } }),
	        googleMapElement: _react2['default'].createElement(
	          _reactGoogleMaps.GoogleMap,
	          _extends({
	            onDragend: this._userRefine.bind(this),
	            onZoomChanged: this._userRefine.bind(this),
	            ref: function (map) {
	              return _this2._map = map;
	            }
	          }, this.props),
	          _react2['default'].createElement(
	            _reactGoogleMapsLibAddonsMarkerClusterer2['default'],
	            {
	              averageCenter: true,
	              enableRetinaIcons: true,
	              gridSize: 30
	            },
	            this.props.markers.map(function (marker) {
	              return _react2['default'].createElement(_reactGoogleMaps.Marker, _extends({ key: marker.id }, marker));
	            })
	          )
	        )
	      });
	    }
	  }]);

	  return GoogleMaps;
	})(_react2['default'].Component);

	GoogleMaps.propTypes = {
	  center: _react2['default'].PropTypes.object, // google.maps.LatLng,
	  markers: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.shape({
	    id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.string]),
	    label: _react2['default'].PropTypes.string,
	    position: _react2['default'].PropTypes.object, // google.maps.LatLng
	    title: _react2['default'].PropTypes.string
	  })).isRequired,
	  refine: _react2['default'].PropTypes.func.isRequired,
	  refineOnMapInteraction: _react2['default'].PropTypes.bool,
	  zoom: _react2['default'].PropTypes.number
	};

	exports['default'] = GoogleMaps;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _interopRequire(obj) { return obj && obj.__esModule ? obj["default"] : obj; }

	var _GoogleMapLoader = __webpack_require__(5);

	exports.GoogleMapLoader = _interopRequire(_GoogleMapLoader);

	var _GoogleMap = __webpack_require__(21);

	exports.GoogleMap = _interopRequire(_GoogleMap);

	var _Circle = __webpack_require__(22);

	exports.Circle = _interopRequire(_Circle);

	var _DirectionsRenderer = __webpack_require__(26);

	exports.DirectionsRenderer = _interopRequire(_DirectionsRenderer);

	var _DrawingManager = __webpack_require__(29);

	exports.DrawingManager = _interopRequire(_DrawingManager);

	var _InfoWindow = __webpack_require__(32);

	exports.InfoWindow = _interopRequire(_InfoWindow);

	var _Marker = __webpack_require__(36);

	exports.Marker = _interopRequire(_Marker);

	var _OverlayView = __webpack_require__(39);

	exports.OverlayView = _interopRequire(_OverlayView);

	var _Polygon = __webpack_require__(42);

	exports.Polygon = _interopRequire(_Polygon);

	var _Polyline = __webpack_require__(45);

	exports.Polyline = _interopRequire(_Polyline);

	var _Rectangle = __webpack_require__(48);

	exports.Rectangle = _interopRequire(_Rectangle);

	var _SearchBox = __webpack_require__(51);

	exports.SearchBox = _interopRequire(_SearchBox);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactPropTypesElementOfType = __webpack_require__(6);

	var _reactPropTypesElementOfType2 = _interopRequireDefault(_reactPropTypesElementOfType);

	var _creatorsGoogleMapHolder = __webpack_require__(12);

	var _creatorsGoogleMapHolder2 = _interopRequireDefault(_creatorsGoogleMapHolder);

	var USE_NEW_BEHAVIOR_TAG_NAME = "__new_behavior__"; /* CIRCULAR_DEPENDENCY */

	var GoogleMapLoader = (function (_Component) {
	  _inherits(GoogleMapLoader, _Component);

	  function GoogleMapLoader() {
	    _classCallCheck(this, GoogleMapLoader);

	    _get(Object.getPrototypeOf(GoogleMapLoader.prototype), "constructor", this).apply(this, arguments);

	    this.state = {
	      map: null
	    };
	  }

	  _createClass(GoogleMapLoader, [{
	    key: "mountGoogleMap",
	    value: function mountGoogleMap(domEl) {
	      if (this.state.map) {
	        return;
	      }
	      var _props$googleMapElement$props = this.props.googleMapElement.props;
	      var children = _props$googleMapElement$props.children;

	      var mapProps = _objectWithoutProperties(_props$googleMapElement$props, ["children"]);

	      //
	      // Create google.maps.Map instance so that dom is initialized before
	      // React's children creators.
	      //
	      var map = _creatorsGoogleMapHolder2["default"]._createMap(domEl, mapProps);
	      this.setState({ map: map });
	    }
	  }, {
	    key: "renderChild",
	    value: function renderChild() {
	      if (this.state.map) {
	        // Notice: implementation details
	        //
	        // In this state, the DOM of google.maps.Map is already initialized in
	        // my innerHTML. Adding extra React components will not clean it
	        // in current version*. It will use prepend to add DOM of
	        // GoogleMapHolder and become a sibling of the DOM of google.maps.Map
	        // Not sure this is subject to change
	        //
	        // *current version: 0.13.3, 0.14.2
	        //
	        return _react2["default"].cloneElement(this.props.googleMapElement, {
	          map: this.state.map,
	          //------------ Deprecated ------------
	          containerTagName: USE_NEW_BEHAVIOR_TAG_NAME
	        });
	      }
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return _react2["default"].cloneElement(this.props.containerElement, {
	        ref: this.mountGoogleMap.bind(this)
	      }, this.renderChild());
	    }
	  }], [{
	    key: "propTypes",
	    value: {
	      containerElement: _react.PropTypes.node.isRequired,
	      googleMapElement: _react.PropTypes.element.isRequired },
	    enumerable: true
	  }, {
	    key: "defaultProps",
	    /* CIRCULAR_DEPENDENCY. Uncomment when 5.0.0 comes: propTypesElementOfType(GoogleMap).isRequired, */
	    value: {
	      containerElement: _react2["default"].createElement("div", null)
	    },
	    enumerable: true
	  }]);

	  return GoogleMapLoader;
	})(_react.Component);

	exports["default"] = GoogleMapLoader;
	module.exports = exports["default"];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = createComponentTypeChecker;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _reactLibReactElement = __webpack_require__(7);

	var _reactLibReactElement2 = _interopRequireDefault(_reactLibReactElement);

	var _reactLibReactPropTypeLocationNames = __webpack_require__(11);

	var _reactLibReactPropTypeLocationNames2 = _interopRequireDefault(_reactLibReactPropTypeLocationNames);

	var ANONYMOUS = "<<anonymous>>";

	/* Check if the given element is created by specific Component. i.e.,
	 * `element = React.createElement(Component, {})`
	 *
	 * @author: @cassiozen
	 * @origin: https://github.com/facebook/react/pull/4716
	 */

	function createComponentTypeChecker(expectedComponent) {
	  function validate(isRequired, props, propName, componentName, location) {
	    var propFullName = arguments.length <= 5 || arguments[5] === undefined ? propName : arguments[5];
	    return (function () {
	      var locationName = _reactLibReactPropTypeLocationNames2["default"][location];
	      if (null == props[propName]) {
	        if (isRequired) {
	          return new Error("Required " + locationName + " `" + propFullName + "` was not specified in " + ("`" + componentName + "`."));
	        } else {
	          return null;
	        }
	      }

	      var actualComponent = props[propName].type;
	      if (!_reactLibReactElement2["default"].isValidElement(props[propName]) || actualComponent !== expectedComponent) {
	        var expectedComponentName = getComponentName(expectedComponent);
	        var actualComponentName = getComponentName(actualComponent);

	        var extraMessage = getExtraMessage(expectedComponent, actualComponent);

	        return new Error("Invalid " + locationName + " `" + propFullName + "` of element type " + ("`" + actualComponentName + "` supplied to `" + componentName + "`, expected ") + ("element type `" + expectedComponentName + "`." + extraMessage));
	      }
	      return null;
	    })();
	  }

	  var validator = validate.bind(null, false);
	  validator.isRequired = validate.bind(null, true);
	  return validator;
	}

	// Returns class name of the object, if any.
	function getComponentName(componentClass) {
	  return componentClass && componentClass.name || ANONYMOUS;
	}

	function getExtraMessage(expectedComponent, actualComponent) {
	  if (expectedComponent.prototype.isPrototypeOf(actualComponent.prototype)) {
	    return " " + ("Notice that component inheritance is discouraged in React. " + "See discussions here: " + "https://github.com/facebook/react/pull/4716#issuecomment-135145263");
	  }
	  return "";
	}
	module.exports = exports["default"];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactElement
	 */

	'use strict';

	var ReactCurrentOwner = __webpack_require__(8);

	var assign = __webpack_require__(9);
	var canDefineProperty = __webpack_require__(10);

	// The Symbol used to tag the ReactElement type. If there is no native Symbol
	// nor polyfill, then a plain number is used for performance.
	var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

	var RESERVED_PROPS = {
	  key: true,
	  ref: true,
	  __self: true,
	  __source: true
	};

	/**
	 * Base constructor for all React elements. This is only used to make this
	 * work with a dynamic instanceof check. Nothing should live on this prototype.
	 *
	 * @param {*} type
	 * @param {*} key
	 * @param {string|object} ref
	 * @param {*} self A *temporary* helper to detect places where `this` is
	 * different from the `owner` when React.createElement is called, so that we
	 * can warn. We want to get rid of owner and replace string `ref`s with arrow
	 * functions, and as long as `this` and owner are the same, there will be no
	 * change in behavior.
	 * @param {*} source An annotation object (added by a transpiler or otherwise)
	 * indicating filename, line number, and/or other information.
	 * @param {*} owner
	 * @param {*} props
	 * @internal
	 */
	var ReactElement = function (type, key, ref, self, source, owner, props) {
	  var element = {
	    // This tag allow us to uniquely identify this as a React Element
	    $$typeof: REACT_ELEMENT_TYPE,

	    // Built-in properties that belong on the element
	    type: type,
	    key: key,
	    ref: ref,
	    props: props,

	    // Record the component responsible for creating this element.
	    _owner: owner
	  };

	  if (false) {
	    // The validation flag is currently mutative. We put it on
	    // an external backing store so that we can freeze the whole object.
	    // This can be replaced with a WeakMap once they are implemented in
	    // commonly used development environments.
	    element._store = {};

	    // To make comparing ReactElements easier for testing purposes, we make
	    // the validation flag non-enumerable (where possible, which should
	    // include every environment we run tests in), so the test framework
	    // ignores it.
	    if (canDefineProperty) {
	      Object.defineProperty(element._store, 'validated', {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: false
	      });
	      // self and source are DEV only properties.
	      Object.defineProperty(element, '_self', {
	        configurable: false,
	        enumerable: false,
	        writable: false,
	        value: self
	      });
	      // Two elements created in two different places should be considered
	      // equal for testing purposes and therefore we hide it from enumeration.
	      Object.defineProperty(element, '_source', {
	        configurable: false,
	        enumerable: false,
	        writable: false,
	        value: source
	      });
	    } else {
	      element._store.validated = false;
	      element._self = self;
	      element._source = source;
	    }
	    Object.freeze(element.props);
	    Object.freeze(element);
	  }

	  return element;
	};

	ReactElement.createElement = function (type, config, children) {
	  var propName;

	  // Reserved names are extracted
	  var props = {};

	  var key = null;
	  var ref = null;
	  var self = null;
	  var source = null;

	  if (config != null) {
	    ref = config.ref === undefined ? null : config.ref;
	    key = config.key === undefined ? null : '' + config.key;
	    self = config.__self === undefined ? null : config.__self;
	    source = config.__source === undefined ? null : config.__source;
	    // Remaining properties are added to a new props object
	    for (propName in config) {
	      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
	        props[propName] = config[propName];
	      }
	    }
	  }

	  // Children can be more than one argument, and those are transferred onto
	  // the newly allocated props object.
	  var childrenLength = arguments.length - 2;
	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    var childArray = Array(childrenLength);
	    for (var i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 2];
	    }
	    props.children = childArray;
	  }

	  // Resolve default props
	  if (type && type.defaultProps) {
	    var defaultProps = type.defaultProps;
	    for (propName in defaultProps) {
	      if (typeof props[propName] === 'undefined') {
	        props[propName] = defaultProps[propName];
	      }
	    }
	  }

	  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
	};

	ReactElement.createFactory = function (type) {
	  var factory = ReactElement.createElement.bind(null, type);
	  // Expose the type on the factory and the prototype so that it can be
	  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
	  // This should not be named `constructor` since this may not be the function
	  // that created the element, and it may not even be a constructor.
	  // Legacy hook TODO: Warn if this is accessed
	  factory.type = type;
	  return factory;
	};

	ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
	  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

	  return newElement;
	};

	ReactElement.cloneAndReplaceProps = function (oldElement, newProps) {
	  var newElement = ReactElement(oldElement.type, oldElement.key, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, newProps);

	  if (false) {
	    // If the key on the original is valid, then the clone is valid
	    newElement._store.validated = oldElement._store.validated;
	  }

	  return newElement;
	};

	ReactElement.cloneElement = function (element, config, children) {
	  var propName;

	  // Original props are copied
	  var props = assign({}, element.props);

	  // Reserved names are extracted
	  var key = element.key;
	  var ref = element.ref;
	  // Self is preserved since the owner is preserved.
	  var self = element._self;
	  // Source is preserved since cloneElement is unlikely to be targeted by a
	  // transpiler, and the original source is probably a better indicator of the
	  // true owner.
	  var source = element._source;

	  // Owner will be preserved, unless ref is overridden
	  var owner = element._owner;

	  if (config != null) {
	    if (config.ref !== undefined) {
	      // Silently steal the ref from the parent.
	      ref = config.ref;
	      owner = ReactCurrentOwner.current;
	    }
	    if (config.key !== undefined) {
	      key = '' + config.key;
	    }
	    // Remaining properties override existing props
	    for (propName in config) {
	      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
	        props[propName] = config[propName];
	      }
	    }
	  }

	  // Children can be more than one argument, and those are transferred onto
	  // the newly allocated props object.
	  var childrenLength = arguments.length - 2;
	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    var childArray = Array(childrenLength);
	    for (var i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 2];
	    }
	    props.children = childArray;
	  }

	  return ReactElement(element.type, key, ref, self, source, owner, props);
	};

	/**
	 * @param {?object} object
	 * @return {boolean} True if `object` is a valid component.
	 * @final
	 */
	ReactElement.isValidElement = function (object) {
	  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	};

	module.exports = ReactElement;

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactCurrentOwner
	 */

	'use strict';

	/**
	 * Keeps track of the current owner.
	 *
	 * The current owner is the component who should own any components that are
	 * currently being constructed.
	 */
	var ReactCurrentOwner = {

	  /**
	   * @internal
	   * @type {ReactComponent}
	   */
	  current: null

	};

	module.exports = ReactCurrentOwner;

/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Object.assign
	 */

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign

	'use strict';

	function assign(target, sources) {
	  if (target == null) {
	    throw new TypeError('Object.assign target cannot be null or undefined');
	  }

	  var to = Object(target);
	  var hasOwnProperty = Object.prototype.hasOwnProperty;

	  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
	    var nextSource = arguments[nextIndex];
	    if (nextSource == null) {
	      continue;
	    }

	    var from = Object(nextSource);

	    // We don't currently support accessors nor proxies. Therefore this
	    // copy cannot throw. If we ever supported this then we must handle
	    // exceptions and side-effects. We don't support symbols so they won't
	    // be transferred.

	    for (var key in from) {
	      if (hasOwnProperty.call(from, key)) {
	        to[key] = from[key];
	      }
	    }
	  }

	  return to;
	}

	module.exports = assign;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule canDefineProperty
	 */

	'use strict';

	var canDefineProperty = false;
	if (false) {
	  try {
	    Object.defineProperty({}, 'x', { get: function () {} });
	    canDefineProperty = true;
	  } catch (x) {
	    // IE will fail on defineProperty
	  }
	}

	module.exports = canDefineProperty;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactPropTypeLocationNames
	 */

	'use strict';

	var ReactPropTypeLocationNames = {};

	if (false) {
	  ReactPropTypeLocationNames = {
	    prop: 'prop',
	    context: 'context',
	    childContext: 'child context'
	  };
	}

	module.exports = ReactPropTypeLocationNames;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _warning = __webpack_require__(13);

	var _warning2 = _interopRequireDefault(_warning);

	var _eventListsGoogleMapEventList = __webpack_require__(14);

	var _eventListsGoogleMapEventList2 = _interopRequireDefault(_eventListsGoogleMapEventList);

	var _utilsEventHandlerCreator = __webpack_require__(15);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(16);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(18);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(20);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var mapControlledPropTypes = {
	  // NOTICE!!!!!!
	  //
	  // Only expose those with getters & setters in the table as controlled props.
	  //
	  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
	  //
	  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
	  center: _react.PropTypes.object,
	  heading: _react.PropTypes.number,
	  mapTypeId: _react.PropTypes.any,
	  options: _react.PropTypes.object,
	  streetView: _react.PropTypes.any,
	  tilt: _react.PropTypes.number,
	  zoom: _react.PropTypes.number
	};

	exports.mapControlledPropTypes = mapControlledPropTypes;
	var mapDefaultPropTypes = (0, _utilsDefaultPropsCreator2["default"])(mapControlledPropTypes);

	exports.mapDefaultPropTypes = mapDefaultPropTypes;
	var mapUpdaters = {
	  center: function center(_center, component) {
	    component.getMap().setCenter(_center);
	  },
	  heading: function heading(_heading, component) {
	    component.getMap().setHeading(_heading);
	  },
	  mapTypeId: function mapTypeId(_mapTypeId, component) {
	    component.getMap().setMapTypeId(_mapTypeId);
	  },
	  options: function options(_options, component) {
	    component.getMap().setOptions(_options);
	  },
	  streetView: function streetView(_streetView, component) {
	    component.getMap().setStreetView(_streetView);
	  },
	  tilt: function tilt(_tilt, component) {
	    component.getMap().setTilt(_tilt);
	  },
	  zoom: function zoom(_zoom, component) {
	    component.getMap().setZoom(_zoom);
	  }
	};

	var _eventHandlerCreator = (0, _utilsEventHandlerCreator2["default"])(_eventListsGoogleMapEventList2["default"]);

	var eventPropTypes = _eventHandlerCreator.eventPropTypes;
	var registerEvents = _eventHandlerCreator.registerEvents;
	var mapEventPropTypes = eventPropTypes;

	exports.mapEventPropTypes = mapEventPropTypes;

	var GoogleMapHolder = (function (_Component) {
	  _inherits(GoogleMapHolder, _Component);

	  function GoogleMapHolder() {
	    _classCallCheck(this, _GoogleMapHolder);

	    _get(Object.getPrototypeOf(_GoogleMapHolder.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(GoogleMapHolder, [{
	    key: "getMap",
	    value: function getMap() {
	      return this.props.map;
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _this = this;

	      return _react2["default"].createElement(
	        "div",
	        null,
	        _react.Children.map(this.props.children, function (childElement) {
	          if (_react2["default"].isValidElement(childElement)) {
	            return _react2["default"].cloneElement(childElement, {
	              mapHolderRef: _this
	            });
	          } else {
	            return childElement;
	          }
	        })
	      );
	    }
	  }], [{
	    key: "_createMap",
	    value: function _createMap(domEl, mapProps) {
	      (0, _warning2["default"])("undefined" !== typeof google, "Make sure you've put a <script> tag in your <head> element to load Google Maps JavaScript API v3.\n If you're looking for built-in support to load it for you, use the \"async/ScriptjsLoader\" instead.\n See https://github.com/tomchentw/react-google-maps/pull/168");
	      // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
	      return new google.maps.Map(domEl, (0, _utilsComposeOptions2["default"])(mapProps, mapControlledPropTypes));
	    }
	  }, {
	    key: "propTypes",
	    value: {
	      map: _react.PropTypes.object.isRequired
	    },
	    enumerable: true
	  }]);

	  var _GoogleMapHolder = GoogleMapHolder;
	  GoogleMapHolder = (0, _utilsComponentLifecycleDecorator2["default"])({
	    registerEvents: registerEvents,
	    instanceMethodName: "getMap",
	    updaters: mapUpdaters
	  })(GoogleMapHolder) || GoogleMapHolder;
	  return GoogleMapHolder;
	})(_react.Component);

	exports["default"] = GoogleMapHolder;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = function() {};

	if (false) {
	  warning = function(condition, format, args) {
	    var len = arguments.length;
	    args = new Array(len > 2 ? len - 2 : 0);
	    for (var key = 2; key < len; key++) {
	      args[key - 2] = arguments[key];
	    }
	    if (format === undefined) {
	      throw new Error(
	        '`warning(condition, format, ...args)` requires a warning ' +
	        'message argument'
	      );
	    }

	    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
	      throw new Error(
	        'The warning format should be able to uniquely identify this ' +
	        'warning. Please, use a more descriptive format than: ' + format
	      );
	    }

	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' +
	        format.replace(/%s/g, function() {
	          return args[argIndex++];
	        });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch(x) {}
	    }
	  };
	}

	module.exports = warning;


/***/ },
/* 14 */
/***/ function(module, exports) {

	// https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
	// [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = ["bounds_changed", "center_changed", "click", "dblclick", "drag", "dragend", "dragstart", "heading_changed", "idle", "maptypeid_changed", "mousemove", "mouseout", "mouseover", "projection_changed", "resize", "rightclick", "tilesloaded", "tilt_changed", "zoom_changed"];
	module.exports = exports["default"];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = eventHandlerCreator;

	var _react = __webpack_require__(1);

	function groupToUpperCase(match, group) {
	  return group.toUpperCase();
	}

	function toOnEventName(rawName) {
	  return "on" + rawName.replace(/^(.)/, groupToUpperCase).replace(/_(.)/g, groupToUpperCase);
	}

	function eventHandlerCreator(rawNameList) {
	  var eventPropTypes = {};
	  var onEventNameByRawName = {};

	  rawNameList.forEach(function (rawName) {
	    var onEventName = toOnEventName(rawName);
	    eventPropTypes[onEventName] = _react.PropTypes.func;
	    onEventNameByRawName[rawName] = onEventName;
	  });

	  function registerEvents(event, props, googleMapInstance) {
	    var registered = rawNameList.reduce(function (acc, rawName) {
	      var onEventName = onEventNameByRawName[rawName];

	      if (Object.prototype.hasOwnProperty.call(props, onEventName)) {
	        acc.push(event.addListener(googleMapInstance, rawName, props[onEventName]));
	      }
	      return acc;
	    }, []);

	    return registered.forEach.bind(registered, event.removeListener, event);
	  }

	  return {
	    eventPropTypes: eventPropTypes,
	    registerEvents: registerEvents
	  };
	}

	module.exports = exports["default"];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = defaultPropsCreator;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _addDefaultPrefix = __webpack_require__(17);

	var _addDefaultPrefix2 = _interopRequireDefault(_addDefaultPrefix);

	function defaultPropsCreator(propTypes) {
	  return Object.keys(propTypes).reduce(function (acc, name) {
	    acc[(0, _addDefaultPrefix2["default"])(name)] = propTypes[name];
	    return acc;
	  }, {});
	}

	module.exports = exports["default"];

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = addDefaultPrefix;

	function addDefaultPrefix(name) {
	  return "default" + (name[0].toUpperCase() + name.slice(1));
	}

	module.exports = exports["default"];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports["default"] = composeOptions;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _controlledOrDefault = __webpack_require__(19);

	var _controlledOrDefault2 = _interopRequireDefault(_controlledOrDefault);

	function composeOptions(props, controlledPropTypes) {
	  var optionNameList = Object.keys(controlledPropTypes);
	  var getter = (0, _controlledOrDefault2["default"])(props);

	  // props from arguments may contain unknow props.
	  // We only interested those in optionNameList
	  return optionNameList.reduce(function (acc, optionName) {
	    if ("options" !== optionName) {
	      var value = getter(optionName);
	      if ("undefined" !== typeof value) {
	        acc[optionName] = value;
	      }
	    }
	    return acc;
	  }, _extends({}, getter("options")));
	}

	module.exports = exports["default"];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = controlledOrDefault;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _addDefaultPrefix = __webpack_require__(17);

	var _addDefaultPrefix2 = _interopRequireDefault(_addDefaultPrefix);

	function controlledOrDefault(props) {
	  return function (name) {
	    if (Object.prototype.hasOwnProperty.call(props, name)) {
	      return props[name];
	    } else {
	      return props[(0, _addDefaultPrefix2["default"])(name)];
	    }
	  };
	}

	module.exports = exports["default"];

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = componentLifecycleDecorator;

	function componentLifecycleDecorator(_ref) {
	  var registerEvents = _ref.registerEvents;
	  var instanceMethodName = _ref.instanceMethodName;
	  var updaters = _ref.updaters;

	  // This modify the Component.prototype directly
	  return function (Component) {
	    function register() {
	      this._unregisterEvents = registerEvents(google.maps.event, this.props, this[instanceMethodName]());
	    }

	    function unregister() {
	      this._unregisterEvents();
	      this._unregisterEvents = null;
	    }

	    function noop() {}

	    // Stash component's own lifecycle methods to be invoked later
	    var componentDidMount = Component.prototype.hasOwnProperty("componentDidMount") ? Component.prototype.componentDidMount : noop;
	    var componentDidUpdate = Component.prototype.hasOwnProperty("componentDidUpdate") ? Component.prototype.componentDidUpdate : noop;
	    var componentWillUnmount = Component.prototype.hasOwnProperty("componentWillUnmount") ? Component.prototype.componentWillUnmount : noop;

	    Object.defineProperty(Component.prototype, "componentDidMount", {
	      enumerable: false,
	      configurable: true,
	      writable: true,
	      value: function value() {
	        // Hook into client's implementation, if it has any
	        componentDidMount.call(this);

	        register.call(this);
	      }
	    });

	    Object.defineProperty(Component.prototype, "componentDidUpdate", {
	      enumerable: false,
	      configurable: true,
	      writable: true,
	      value: function value(prevProps) {
	        unregister.call(this);

	        for (var _name in updaters) {
	          if (Object.prototype.hasOwnProperty.call(this.props, _name)) {
	            updaters[_name](this.props[_name], this);
	          }
	        }

	        // Hook into client's implementation, if it has any
	        componentDidUpdate.call(this, prevProps);

	        register.call(this);
	      }
	    });

	    Object.defineProperty(Component.prototype, "componentWillUnmount", {
	      enumerable: false,
	      configurable: true,
	      writable: true,
	      value: function value() {
	        // Hook into client's implementation, if it has any
	        componentWillUnmount.call(this);

	        unregister.call(this);
	        var instance = this[instanceMethodName]();
	        if ("setMap" in instance) {
	          instance.setMap(null);
	        }
	      }
	    });

	    return Component;
	  };
	}

	module.exports = exports["default"];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _warning = __webpack_require__(13);

	var _warning2 = _interopRequireDefault(_warning);

	var _creatorsGoogleMapHolder = __webpack_require__(12);

	var _creatorsGoogleMapHolder2 = _interopRequireDefault(_creatorsGoogleMapHolder);

	var _GoogleMapLoader = __webpack_require__(5);

	var _GoogleMapLoader2 = _interopRequireDefault(_GoogleMapLoader);

	var USE_NEW_BEHAVIOR_TAG_NAME = "__new_behavior__";

	var GoogleMap = (function (_Component) {
	  _inherits(GoogleMap, _Component);

	  function GoogleMap() {
	    _classCallCheck(this, GoogleMap);

	    _get(Object.getPrototypeOf(GoogleMap.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(GoogleMap, [{
	    key: "getBounds",

	    // Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
	    //
	    // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^get/) && !it.match(/Map$/); })
	    value: function getBounds() {
	      return (this.props.map || this.refs.delegate).getBounds();
	    }
	  }, {
	    key: "getCenter",
	    value: function getCenter() {
	      return (this.props.map || this.refs.delegate).getCenter();
	    }
	  }, {
	    key: "getDiv",
	    value: function getDiv() {
	      return (this.props.map || this.refs.delegate).getDiv();
	    }
	  }, {
	    key: "getHeading",
	    value: function getHeading() {
	      return (this.props.map || this.refs.delegate).getHeading();
	    }
	  }, {
	    key: "getMapTypeId",
	    value: function getMapTypeId() {
	      return (this.props.map || this.refs.delegate).getMapTypeId();
	    }
	  }, {
	    key: "getProjection",
	    value: function getProjection() {
	      return (this.props.map || this.refs.delegate).getProjection();
	    }
	  }, {
	    key: "getStreetView",
	    value: function getStreetView() {
	      return (this.props.map || this.refs.delegate).getStreetView();
	    }
	  }, {
	    key: "getTilt",
	    value: function getTilt() {
	      return (this.props.map || this.refs.delegate).getTilt();
	    }
	  }, {
	    key: "getZoom",
	    value: function getZoom() {
	      return (this.props.map || this.refs.delegate).getZoom();
	    }

	    // END - Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
	    //
	    // Public APIs - Use this carefully
	    // See discussion in https://github.com/tomchentw/react-google-maps/issues/62
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
	    //
	    // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return !it.match(/^get/) && !it.match(/^set/) && !it.match(/Map$/); })
	  }, {
	    key: "fitBounds",
	    value: function fitBounds(bounds) {
	      return (this.props.map || this.refs.delegate).fitBounds(bounds);
	    }
	  }, {
	    key: "panBy",
	    value: function panBy(x, y) {
	      return (this.props.map || this.refs.delegate).panBy(x, y);
	    }
	  }, {
	    key: "panTo",
	    value: function panTo(latLng) {
	      return (this.props.map || this.refs.delegate).panTo(latLng);
	    }
	  }, {
	    key: "panToBounds",
	    value: function panToBounds(latLngBounds) {
	      return (this.props.map || this.refs.delegate).panToBounds(latLngBounds);
	    }

	    // END - Public APIs - Use this carefully
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map

	  }, {
	    key: "componentWillMount",
	    value: function componentWillMount() {
	      var containerTagName = this.props.containerTagName;

	      var isUsingNewBehavior = USE_NEW_BEHAVIOR_TAG_NAME === containerTagName;

	      (0, _warning2["default"])(isUsingNewBehavior, "\"GoogleMap\" with containerTagName is deprecated now and will be removed in next major release (5.0.0). \nUse \"GoogleMapLoader\" instead. See https://github.com/tomchentw/react-google-maps/pull/157 for more details.");
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _props = this.props;
	      var containerTagName = _props.containerTagName;
	      var _props$containerProps = _props.containerProps;
	      var containerProps = _props$containerProps === undefined ? {} : _props$containerProps;
	      var children = _props.children;

	      var mapProps = _objectWithoutProperties(_props, ["containerTagName", "containerProps", "children"]);

	      var isUsingNewBehavior = USE_NEW_BEHAVIOR_TAG_NAME === containerTagName;

	      if (isUsingNewBehavior) {
	        return _react2["default"].createElement(
	          _creatorsGoogleMapHolder2["default"],
	          mapProps,
	          children
	        );
	      } else {
	        //------------ Deprecated ------------
	        var realContainerTagName = null == containerTagName ? "div" : containerTagName;

	        return _react2["default"].createElement(_GoogleMapLoader2["default"], {
	          ref: "loader",
	          containerElement: _react2["default"].createElement(realContainerTagName, containerProps),
	          googleMapElement: _react2["default"].createElement(
	            GoogleMap,
	            _extends({ ref: "delegate", containerTagName: USE_NEW_BEHAVIOR_TAG_NAME }, mapProps),
	            children
	          )
	        });
	      }
	    }
	  }], [{
	    key: "propTypes",
	    value: _extends({
	      containerTagName: _react.PropTypes.string,
	      containerProps: _react.PropTypes.object,
	      map: _react.PropTypes.object
	    }, _creatorsGoogleMapHolder.mapDefaultPropTypes, _creatorsGoogleMapHolder.mapControlledPropTypes, _creatorsGoogleMapHolder.mapEventPropTypes),
	    enumerable: true
	  }]);

	  return GoogleMap;
	})(_react.Component);

	exports["default"] = GoogleMap;
	module.exports = exports["default"];
	// Uncontrolled default[props] - used only in componentDidMount

	// Controlled [props] - used in componentDidMount/componentDidUpdate

	// Event [onEventName]

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(23);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsCircleCreator = __webpack_require__(24);

	var _creatorsCircleCreator2 = _interopRequireDefault(_creatorsCircleCreator);

	var Circle = (function (_Component) {
	  _inherits(Circle, _Component);

	  function Circle() {
	    _classCallCheck(this, Circle);

	    _get(Object.getPrototypeOf(Circle.prototype), "constructor", this).apply(this, arguments);

	    this.state = {};
	  }

	  _createClass(Circle, [{
	    key: "getBounds",

	    // Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Circle
	    //
	    // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^get/) && !it.match(/^getMap/); })
	    value: function getBounds() {
	      return this.state.circle.getBounds();
	    }
	  }, {
	    key: "getCenter",
	    value: function getCenter() {
	      return this.state.circle.getCenter();
	    }
	  }, {
	    key: "getDraggable",
	    value: function getDraggable() {
	      return this.state.circle.getDraggable();
	    }
	  }, {
	    key: "getEditable",
	    value: function getEditable() {
	      return this.state.circle.getEditable();
	    }
	  }, {
	    key: "getMap",
	    value: function getMap() {
	      return this.state.circle.getMap();
	    }
	  }, {
	    key: "getRadius",
	    value: function getRadius() {
	      return this.state.circle.getRadius();
	    }
	  }, {
	    key: "getVisible",
	    value: function getVisible() {
	      return this.state.circle.getVisible();
	    }

	    // END - Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Circle

	  }, {
	    key: "componentWillMount",
	    value: function componentWillMount() {
	      if (!_canUseDom2["default"]) {
	        return;
	      }
	      var circle = _creatorsCircleCreator2["default"]._createCircle(this.props);

	      this.setState({ circle: circle });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      if (this.state.circle) {
	        return _react2["default"].createElement(
	          _creatorsCircleCreator2["default"],
	          _extends({ circle: this.state.circle }, this.props),
	          this.props.children
	        );
	      } else {
	        return _react2["default"].createElement("noscript", null);
	      }
	    }
	  }], [{
	    key: "propTypes",
	    value: _extends({}, _creatorsCircleCreator.circleDefaultPropTypes, _creatorsCircleCreator.circleControlledPropTypes, _creatorsCircleCreator.circleEventPropTypes),
	    enumerable: true
	  }]);

	  return Circle;
	})(_react.Component);

	exports["default"] = Circle;
	module.exports = exports["default"];

	// Uncontrolled default[props] - used only in componentDidMount

	// Controlled [props] - used in componentDidMount/componentDidUpdate

	// Event [onEventName]

/***/ },
/* 23 */
/***/ function(module, exports) {

	var canUseDOM = !!(
	  typeof window !== 'undefined' &&
	  window.document &&
	  window.document.createElement
	);

	module.exports = canUseDOM;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsCircleEventList = __webpack_require__(25);

	var _eventListsCircleEventList2 = _interopRequireDefault(_eventListsCircleEventList);

	var _utilsEventHandlerCreator = __webpack_require__(15);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(16);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(18);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(20);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(12);

	var _GoogleMapHolder2 = _interopRequireDefault(_GoogleMapHolder);

	var circleControlledPropTypes = {
	  // NOTICE!!!!!!
	  //
	  // Only expose those with getters & setters in the table as controlled props.
	  //
	  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
	  //
	  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Circle
	  center: _react.PropTypes.any,
	  draggable: _react.PropTypes.bool,
	  editable: _react.PropTypes.bool,
	  options: _react.PropTypes.object,
	  radius: _react.PropTypes.number,
	  visible: _react.PropTypes.bool
	};

	exports.circleControlledPropTypes = circleControlledPropTypes;
	var circleDefaultPropTypes = (0, _utilsDefaultPropsCreator2["default"])(circleControlledPropTypes);

	exports.circleDefaultPropTypes = circleDefaultPropTypes;
	var circleUpdaters = {
	  center: function center(_center, component) {
	    component.getCircle().setCenter(_center);
	  },
	  draggable: function draggable(_draggable, component) {
	    component.getCircle().setDraggable(_draggable);
	  },
	  editable: function editable(_editable, component) {
	    component.getCircle().setEditable(_editable);
	  },
	  options: function options(_options, component) {
	    component.getCircle().setOptions(_options);
	  },
	  radius: function radius(_radius, component) {
	    component.getCircle().setRadius(_radius);
	  },
	  visible: function visible(_visible, component) {
	    component.getCircle().setVisible(_visible);
	  }
	};

	var _eventHandlerCreator = (0, _utilsEventHandlerCreator2["default"])(_eventListsCircleEventList2["default"]);

	var eventPropTypes = _eventHandlerCreator.eventPropTypes;
	var registerEvents = _eventHandlerCreator.registerEvents;
	var circleEventPropTypes = eventPropTypes;

	exports.circleEventPropTypes = circleEventPropTypes;

	var CircleCreator = (function (_Component) {
	  _inherits(CircleCreator, _Component);

	  function CircleCreator() {
	    _classCallCheck(this, _CircleCreator);

	    _get(Object.getPrototypeOf(_CircleCreator.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(CircleCreator, [{
	    key: "getCircle",
	    value: function getCircle() {
	      return this.props.circle;
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return _react2["default"].createElement("noscript", null);
	    }
	  }], [{
	    key: "_createCircle",
	    value: function _createCircle(circleProps) {
	      var mapHolderRef = circleProps.mapHolderRef;

	      // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Circle
	      var circle = new google.maps.Circle((0, _utilsComposeOptions2["default"])(circleProps, circleControlledPropTypes));

	      circle.setMap(mapHolderRef.getMap());

	      return circle;
	    }
	  }, {
	    key: "propTypes",
	    value: {
	      mapHolderRef: _react.PropTypes.instanceOf(_GoogleMapHolder2["default"]).isRequired,
	      circle: _react.PropTypes.object.isRequired
	    },
	    enumerable: true
	  }]);

	  var _CircleCreator = CircleCreator;
	  CircleCreator = (0, _utilsComponentLifecycleDecorator2["default"])({
	    registerEvents: registerEvents,
	    instanceMethodName: "getCircle",
	    updaters: circleUpdaters
	  })(CircleCreator) || CircleCreator;
	  return CircleCreator;
	})(_react.Component);

	exports["default"] = CircleCreator;

/***/ },
/* 25 */
/***/ function(module, exports) {

	// https://developers.google.com/maps/documentation/javascript/3.exp/reference#Circle
	// [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = ["center_changed", "click", "dblclick", "drag", "dragend", "dragstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "radius_changed", "rightclick"];
	module.exports = exports["default"];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(23);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsDirectionsRendererCreator = __webpack_require__(27);

	var _creatorsDirectionsRendererCreator2 = _interopRequireDefault(_creatorsDirectionsRendererCreator);

	/*
	 * Original author: @alexishevia
	 * Original PR: https://github.com/tomchentw/react-google-maps/pull/22
	 */

	var DirectionsRenderer = (function (_Component) {
	  _inherits(DirectionsRenderer, _Component);

	  function DirectionsRenderer() {
	    _classCallCheck(this, DirectionsRenderer);

	    _get(Object.getPrototypeOf(DirectionsRenderer.prototype), "constructor", this).apply(this, arguments);

	    this.state = {};
	  }

	  _createClass(DirectionsRenderer, [{
	    key: "getDirections",

	    // Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#DirectionsRenderer
	    //
	    // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^get/) && !it.match(/^getMap/); })
	    value: function getDirections() {
	      return this.state.directionsRenderer.getDirections();
	    }
	  }, {
	    key: "getPanel",
	    value: function getPanel() {
	      return this.state.directionsRenderer.getPanel();
	    }
	  }, {
	    key: "getRouteIndex",
	    value: function getRouteIndex() {
	      return this.state.directionsRenderer.getRouteIndex();
	    }

	    // END - Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#DirectionsRenderer

	  }, {
	    key: "componentWillMount",
	    value: function componentWillMount() {
	      if (!_canUseDom2["default"]) {
	        return;
	      }
	      var directionsRenderer = _creatorsDirectionsRendererCreator2["default"]._createDirectionsRenderer(this.props);

	      this.setState({ directionsRenderer: directionsRenderer });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      if (this.state.directionsRenderer) {
	        return _react2["default"].createElement(
	          _creatorsDirectionsRendererCreator2["default"],
	          _extends({ directionsRenderer: this.state.directionsRenderer }, this.props),
	          this.props.children
	        );
	      } else {
	        return _react2["default"].createElement("noscript", null);
	      }
	    }
	  }], [{
	    key: "propTypes",
	    value: _extends({}, _creatorsDirectionsRendererCreator.directionsRendererDefaultPropTypes, _creatorsDirectionsRendererCreator.directionsRendererControlledPropTypes, _creatorsDirectionsRendererCreator.directionsRendererEventPropTypes),
	    enumerable: true
	  }]);

	  return DirectionsRenderer;
	})(_react.Component);

	exports["default"] = DirectionsRenderer;
	module.exports = exports["default"];

	// Uncontrolled default[props] - used only in componentDidMount

	// Controlled [props] - used in componentDidMount/componentDidUpdate

	// Event [onEventName]

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsDirectionsRendererEventList = __webpack_require__(28);

	var _eventListsDirectionsRendererEventList2 = _interopRequireDefault(_eventListsDirectionsRendererEventList);

	var _utilsEventHandlerCreator = __webpack_require__(15);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(16);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(18);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(20);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(12);

	var _GoogleMapHolder2 = _interopRequireDefault(_GoogleMapHolder);

	var directionsRendererControlledPropTypes = {
	  // NOTICE!!!!!!
	  //
	  // Only expose those with getters & setters in the table as controlled props.
	  //
	  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
	  //
	  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#DirectionsRenderer
	  directions: _react.PropTypes.any,
	  options: _react.PropTypes.object,
	  panel: _react.PropTypes.object,
	  routeIndex: _react.PropTypes.number
	};

	exports.directionsRendererControlledPropTypes = directionsRendererControlledPropTypes;
	var directionsRendererDefaultPropTypes = (0, _utilsDefaultPropsCreator2["default"])(directionsRendererControlledPropTypes);

	exports.directionsRendererDefaultPropTypes = directionsRendererDefaultPropTypes;
	var directionsRendererUpdaters = {
	  directions: function directions(_directions, component) {
	    component.getDirectionsRenderer().setDirections(_directions);
	  },
	  options: function options(_options, component) {
	    component.getDirectionsRenderer().setOptions(_options);
	  },
	  panel: function panel(_panel, component) {
	    component.getDirectionsRenderer().setPanel(_panel);
	  },
	  routeIndex: function routeIndex(_routeIndex, component) {
	    component.getDirectionsRenderer().setRouteIndex(_routeIndex);
	  }
	};

	var _eventHandlerCreator = (0, _utilsEventHandlerCreator2["default"])(_eventListsDirectionsRendererEventList2["default"]);

	var eventPropTypes = _eventHandlerCreator.eventPropTypes;
	var registerEvents = _eventHandlerCreator.registerEvents;
	var directionsRendererEventPropTypes = eventPropTypes;

	exports.directionsRendererEventPropTypes = directionsRendererEventPropTypes;

	var DirectionsRendererCreator = (function (_Component) {
	  _inherits(DirectionsRendererCreator, _Component);

	  function DirectionsRendererCreator() {
	    _classCallCheck(this, _DirectionsRendererCreator);

	    _get(Object.getPrototypeOf(_DirectionsRendererCreator.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(DirectionsRendererCreator, [{
	    key: "getDirectionsRenderer",
	    value: function getDirectionsRenderer() {
	      return this.props.directionsRenderer;
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var children = this.props.children;

	      if (0 < _react.Children.count(children)) {
	        // TODO: take a look at DirectionsRendererOptions#infoWindow and DirectionsRendererOptions#markerOptions ?
	        return _react2["default"].createElement(
	          "div",
	          null,
	          children
	        );
	      } else {
	        return _react2["default"].createElement("noscript", null);
	      }
	    }
	  }], [{
	    key: "_createDirectionsRenderer",
	    value: function _createDirectionsRenderer(directionsRendererProps) {
	      var mapHolderRef = directionsRendererProps.mapHolderRef;

	      // https://developers.google.com/maps/documentation/javascript/3.exp/reference#DirectionsRenderer
	      var directionsRenderer = new google.maps.DirectionsRenderer((0, _utilsComposeOptions2["default"])(directionsRendererProps, directionsRendererControlledPropTypes));

	      directionsRenderer.setMap(mapHolderRef.getMap());

	      return directionsRenderer;
	    }
	  }, {
	    key: "propTypes",
	    value: {
	      mapHolderRef: _react.PropTypes.instanceOf(_GoogleMapHolder2["default"]).isRequired,
	      directionsRenderer: _react.PropTypes.object.isRequired
	    },
	    enumerable: true
	  }]);

	  var _DirectionsRendererCreator = DirectionsRendererCreator;
	  DirectionsRendererCreator = (0, _utilsComponentLifecycleDecorator2["default"])({
	    registerEvents: registerEvents,
	    instanceMethodName: "getDirectionsRenderer",
	    updaters: directionsRendererUpdaters
	  })(DirectionsRendererCreator) || DirectionsRendererCreator;
	  return DirectionsRendererCreator;
	})(_react.Component);

	exports["default"] = DirectionsRendererCreator;

/***/ },
/* 28 */
/***/ function(module, exports) {

	// https://developers.google.com/maps/documentation/javascript/3.exp/reference#DirectionsRenderer
	// [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = ["directions_changed"];
	module.exports = exports["default"];

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(23);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsDrawingManagerCreator = __webpack_require__(30);

	var _creatorsDrawingManagerCreator2 = _interopRequireDefault(_creatorsDrawingManagerCreator);

	/*
	 * Original author: @idolize
	 * Original PR: https://github.com/tomchentw/react-google-maps/pull/46
	 */

	var DrawingManager = (function (_Component) {
	  _inherits(DrawingManager, _Component);

	  function DrawingManager() {
	    _classCallCheck(this, DrawingManager);

	    _get(Object.getPrototypeOf(DrawingManager.prototype), "constructor", this).apply(this, arguments);

	    this.state = {};
	  }

	  _createClass(DrawingManager, [{
	    key: "getDrawingMode",

	    // Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#DrawingManager
	    //
	    // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^get/) && !it.match(/^getMap/); })
	    value: function getDrawingMode() {
	      return this.state.drawingManager.getDrawingMode();
	    }

	    // END - Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#DrawingManager

	  }, {
	    key: "componentWillMount",
	    value: function componentWillMount() {
	      if (!_canUseDom2["default"]) {
	        return;
	      }
	      var drawingManager = _creatorsDrawingManagerCreator2["default"]._createDrawingManager(this.props);

	      this.setState({ drawingManager: drawingManager });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      if (this.state.drawingManager) {
	        return _react2["default"].createElement(
	          _creatorsDrawingManagerCreator2["default"],
	          _extends({ drawingManager: this.state.drawingManager }, this.props),
	          this.props.children
	        );
	      } else {
	        return _react2["default"].createElement("noscript", null);
	      }
	    }
	  }], [{
	    key: "propTypes",
	    value: _extends({}, _creatorsDrawingManagerCreator.drawingManagerDefaultPropTypes, _creatorsDrawingManagerCreator.drawingManagerControlledPropTypes, _creatorsDrawingManagerCreator.drawingManagerEventPropTypes),
	    enumerable: true
	  }]);

	  return DrawingManager;
	})(_react.Component);

	exports["default"] = DrawingManager;
	module.exports = exports["default"];

	// Uncontrolled default[props] - used only in componentDidMount

	// Controlled [props] - used in componentDidMount/componentDidUpdate

	// Event [onEventName]

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsDrawingManagerEventList = __webpack_require__(31);

	var _eventListsDrawingManagerEventList2 = _interopRequireDefault(_eventListsDrawingManagerEventList);

	var _utilsEventHandlerCreator = __webpack_require__(15);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(16);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(18);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(20);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(12);

	var _GoogleMapHolder2 = _interopRequireDefault(_GoogleMapHolder);

	var drawingManagerControlledPropTypes = {
	  // NOTICE!!!!!!
	  //
	  // Only expose those with getters & setters in the table as controlled props.
	  //
	  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
	  //
	  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#DrawingManager
	  drawingMode: _react.PropTypes.any,
	  options: _react.PropTypes.object
	};

	exports.drawingManagerControlledPropTypes = drawingManagerControlledPropTypes;
	var drawingManagerDefaultPropTypes = (0, _utilsDefaultPropsCreator2["default"])(drawingManagerControlledPropTypes);

	exports.drawingManagerDefaultPropTypes = drawingManagerDefaultPropTypes;
	var drawingManagerUpdaters = {
	  drawingMode: function drawingMode(_drawingMode, component) {
	    component.getDrawingManager().setDrawingMode(_drawingMode);
	  },
	  options: function options(_options, component) {
	    component.getDrawingManager().setOptions(_options);
	  }
	};

	var _eventHandlerCreator = (0, _utilsEventHandlerCreator2["default"])(_eventListsDrawingManagerEventList2["default"]);

	var eventPropTypes = _eventHandlerCreator.eventPropTypes;
	var registerEvents = _eventHandlerCreator.registerEvents;
	var drawingManagerEventPropTypes = eventPropTypes;

	exports.drawingManagerEventPropTypes = drawingManagerEventPropTypes;

	var DrawingManagerCreator = (function (_Component) {
	  _inherits(DrawingManagerCreator, _Component);

	  function DrawingManagerCreator() {
	    _classCallCheck(this, _DrawingManagerCreator);

	    _get(Object.getPrototypeOf(_DrawingManagerCreator.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(DrawingManagerCreator, [{
	    key: "getDrawingManager",
	    value: function getDrawingManager() {
	      return this.props.drawingManager;
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return _react2["default"].createElement("noscript", null);
	    }
	  }], [{
	    key: "_createDrawingManager",
	    value: function _createDrawingManager(drawingManagerProps) {
	      var mapHolderRef = drawingManagerProps.mapHolderRef;

	      // https://developers.google.com/maps/documentation/javascript/3.exp/reference#DrawingManager
	      var drawingManager = new google.maps.drawing.DrawingManager((0, _utilsComposeOptions2["default"])(drawingManagerProps, drawingManagerControlledPropTypes));

	      drawingManager.setMap(mapHolderRef.getMap());

	      return drawingManager;
	    }
	  }, {
	    key: "propTypes",
	    value: {
	      mapHolderRef: _react.PropTypes.instanceOf(_GoogleMapHolder2["default"]).isRequired,
	      drawingManager: _react.PropTypes.object.isRequired
	    },
	    enumerable: true
	  }]);

	  var _DrawingManagerCreator = DrawingManagerCreator;
	  DrawingManagerCreator = (0, _utilsComponentLifecycleDecorator2["default"])({
	    registerEvents: registerEvents,
	    instanceMethodName: "getDrawingManager",
	    updaters: drawingManagerUpdaters
	  })(DrawingManagerCreator) || DrawingManagerCreator;
	  return DrawingManagerCreator;
	})(_react.Component);

	exports["default"] = DrawingManagerCreator;

/***/ },
/* 31 */
/***/ function(module, exports) {

	// https://developers.google.com/maps/documentation/javascript/3.exp/reference#DrawingManager
	// [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = ["circlecomplete", "markercomplete", "overlaycomplete", "polygoncomplete", "polylinecomplete", "rectanglecomplete"];
	module.exports = exports["default"];

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(23);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsInfoWindowCreator = __webpack_require__(33);

	var _creatorsInfoWindowCreator2 = _interopRequireDefault(_creatorsInfoWindowCreator);

	var InfoWindow = (function (_Component) {
	  _inherits(InfoWindow, _Component);

	  function InfoWindow() {
	    _classCallCheck(this, InfoWindow);

	    _get(Object.getPrototypeOf(InfoWindow.prototype), "constructor", this).apply(this, arguments);

	    this.state = {};
	  }

	  _createClass(InfoWindow, [{
	    key: "getContent",

	    // Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindow
	    //
	    // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^get/) && !it.match(/^getMap/); })
	    value: function getContent() {/* TODO: children */}
	  }, {
	    key: "getPosition",
	    value: function getPosition() {
	      return this.state.infoWindow.getPosition();
	    }
	  }, {
	    key: "getZIndex",
	    value: function getZIndex() {
	      return this.state.infoWindow.getZIndex();
	    }

	    // END - Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindow

	  }, {
	    key: "componentWillMount",
	    value: function componentWillMount() {
	      if (!_canUseDom2["default"]) {
	        return;
	      }
	      var infoWindow = _creatorsInfoWindowCreator2["default"]._createInfoWindow(this.props);

	      this.setState({ infoWindow: infoWindow });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      if (this.state.infoWindow) {
	        return _react2["default"].createElement(
	          _creatorsInfoWindowCreator2["default"],
	          _extends({ infoWindow: this.state.infoWindow }, this.props),
	          this.props.children
	        );
	      } else {
	        return _react2["default"].createElement("noscript", null);
	      }
	    }
	  }], [{
	    key: "propTypes",
	    value: _extends({}, _creatorsInfoWindowCreator.infoWindowDefaultPropTypes, _creatorsInfoWindowCreator.infoWindowControlledPropTypes, _creatorsInfoWindowCreator.infoWindowEventPropTypes),
	    enumerable: true
	  }]);

	  return InfoWindow;
	})(_react.Component);

	exports["default"] = InfoWindow;
	module.exports = exports["default"];

	// Uncontrolled default[props] - used only in componentDidMount

	// Controlled [props] - used in componentDidMount/componentDidUpdate

	// Event [onEventName]

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsInfoWindowEventList = __webpack_require__(34);

	var _eventListsInfoWindowEventList2 = _interopRequireDefault(_eventListsInfoWindowEventList);

	var _utilsEventHandlerCreator = __webpack_require__(15);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(16);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(18);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsSetContentForOptionalReactElement = __webpack_require__(35);

	var _utilsSetContentForOptionalReactElement2 = _interopRequireDefault(_utilsSetContentForOptionalReactElement);

	var _utilsComponentLifecycleDecorator = __webpack_require__(20);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(12);

	var _GoogleMapHolder2 = _interopRequireDefault(_GoogleMapHolder);

	var infoWindowControlledPropTypes = {
	  // NOTICE!!!!!!
	  //
	  // Only expose those with getters & setters in the table as controlled props.
	  //
	  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
	  //
	  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindow
	  content: _react.PropTypes.any,
	  options: _react.PropTypes.object,
	  position: _react.PropTypes.any,
	  zIndex: _react.PropTypes.number
	};

	exports.infoWindowControlledPropTypes = infoWindowControlledPropTypes;
	var infoWindowDefaultPropTypes = (0, _utilsDefaultPropsCreator2["default"])(infoWindowControlledPropTypes);

	exports.infoWindowDefaultPropTypes = infoWindowDefaultPropTypes;
	var infoWindowUpdaters = {
	  children: function children(_children, component) {
	    (0, _utilsSetContentForOptionalReactElement2["default"])(_children, component.getInfoWindow());
	  },
	  content: function content(_content, component) {
	    component.getInfoWindow().setContent(_content);
	  },
	  options: function options(_options, component) {
	    component.getInfoWindow().setOptions(_options);
	  },
	  position: function position(_position, component) {
	    component.getInfoWindow().setPosition(_position);
	  },
	  zIndex: function zIndex(_zIndex, component) {
	    component.getInfoWindow().setZIndex(_zIndex);
	  }
	};

	var _eventHandlerCreator = (0, _utilsEventHandlerCreator2["default"])(_eventListsInfoWindowEventList2["default"]);

	var eventPropTypes = _eventHandlerCreator.eventPropTypes;
	var registerEvents = _eventHandlerCreator.registerEvents;
	var infoWindowEventPropTypes = eventPropTypes;

	exports.infoWindowEventPropTypes = infoWindowEventPropTypes;

	var InfoWindowCreator = (function (_Component) {
	  _inherits(InfoWindowCreator, _Component);

	  function InfoWindowCreator() {
	    _classCallCheck(this, _InfoWindowCreator);

	    _get(Object.getPrototypeOf(_InfoWindowCreator.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(InfoWindowCreator, [{
	    key: "getInfoWindow",
	    value: function getInfoWindow() {
	      return this.props.infoWindow;
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return _react2["default"].createElement("noscript", null);
	    }
	  }], [{
	    key: "_createInfoWindow",
	    value: function _createInfoWindow(infoWindowProps) {
	      var mapHolderRef = infoWindowProps.mapHolderRef;
	      var anchorHolderRef = infoWindowProps.anchorHolderRef;

	      // https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindow
	      var infoWindow = new google.maps.InfoWindow((0, _utilsComposeOptions2["default"])(infoWindowProps, infoWindowControlledPropTypes));

	      if (infoWindowProps.children) {
	        (0, _utilsSetContentForOptionalReactElement2["default"])(infoWindowProps.children, infoWindow);
	      }

	      if (anchorHolderRef) {
	        infoWindow.open(mapHolderRef.getMap(), anchorHolderRef.getAnchor());
	      } else {
	        infoWindow.setMap(mapHolderRef.getMap());
	      }

	      return infoWindow;
	    }
	  }, {
	    key: "propTypes",
	    value: {
	      mapHolderRef: _react.PropTypes.instanceOf(_GoogleMapHolder2["default"]).isRequired,
	      infoWindow: _react.PropTypes.object.isRequired,
	      anchorHolderRef: _react.PropTypes.object
	    },
	    enumerable: true
	  }]);

	  var _InfoWindowCreator = InfoWindowCreator;
	  InfoWindowCreator = (0, _utilsComponentLifecycleDecorator2["default"])({
	    registerEvents: registerEvents,
	    instanceMethodName: "getInfoWindow",
	    updaters: infoWindowUpdaters
	  })(InfoWindowCreator) || InfoWindowCreator;
	  return InfoWindowCreator;
	})(_react.Component);

	exports["default"] = InfoWindowCreator;

/***/ },
/* 34 */
/***/ function(module, exports) {

	// https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindow
	// [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = ["closeclick", "content_changed", "domready", "position_changed", "zindex_changed"];
	module.exports = exports["default"];

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = setContentForOptionalReactElement;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	function renderElement(contentElement, prevContent) {
	  if ("[object HTMLDivElement]" !== Object.prototype.toString.call(prevContent)) {
	    prevContent = document.createElement("div");
	  }

	  (0, _reactDom.render)(contentElement, prevContent);
	  return prevContent;
	}

	function setContentForOptionalReactElement(contentOptionalReactElement, infoWindowLikeInstance) {
	  if (_react2["default"].isValidElement(contentOptionalReactElement)) {
	    var contentElement = _react.Children.only(contentOptionalReactElement);
	    var prevContent = infoWindowLikeInstance.getContent();

	    var domEl = renderElement(contentOptionalReactElement, prevContent);
	    infoWindowLikeInstance.setContent(domEl);
	  } else {
	    infoWindowLikeInstance.setContent(contentOptionalReactElement);
	  }
	}

	module.exports = exports["default"];

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(23);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsMarkerCreator = __webpack_require__(37);

	var _creatorsMarkerCreator2 = _interopRequireDefault(_creatorsMarkerCreator);

	var Marker = (function (_Component) {
	  _inherits(Marker, _Component);

	  function Marker() {
	    _classCallCheck(this, Marker);

	    _get(Object.getPrototypeOf(Marker.prototype), "constructor", this).apply(this, arguments);

	    this.state = {};
	  }

	  _createClass(Marker, [{
	    key: "getAnimation",

	    // Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Marker
	    //
	    // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^get/) && !it.match(/Map$/); })
	    value: function getAnimation() {
	      return this.state.marker.getAnimation();
	    }
	  }, {
	    key: "getAttribution",
	    value: function getAttribution() {
	      return this.state.marker.getAttribution();
	    }
	  }, {
	    key: "getClickable",
	    value: function getClickable() {
	      return this.state.marker.getClickable();
	    }
	  }, {
	    key: "getCursor",
	    value: function getCursor() {
	      return this.state.marker.getCursor();
	    }
	  }, {
	    key: "getDraggable",
	    value: function getDraggable() {
	      return this.state.marker.getDraggable();
	    }
	  }, {
	    key: "getIcon",
	    value: function getIcon() {
	      return this.state.marker.getIcon();
	    }
	  }, {
	    key: "getLabel",
	    value: function getLabel() {
	      return this.state.marker.getLabel();
	    }
	  }, {
	    key: "getOpacity",
	    value: function getOpacity() {
	      return this.state.marker.getOpacity();
	    }
	  }, {
	    key: "getPlace",
	    value: function getPlace() {
	      return this.state.marker.getPlace();
	    }
	  }, {
	    key: "getPosition",
	    value: function getPosition() {
	      return this.state.marker.getPosition();
	    }
	  }, {
	    key: "getShape",
	    value: function getShape() {
	      return this.state.marker.getShape();
	    }
	  }, {
	    key: "getTitle",
	    value: function getTitle() {
	      return this.state.marker.getTitle();
	    }
	  }, {
	    key: "getVisible",
	    value: function getVisible() {
	      return this.state.marker.getVisible();
	    }
	  }, {
	    key: "getZIndex",
	    value: function getZIndex() {
	      return this.state.marker.getZIndex();
	    }

	    // END - Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Marker

	  }, {
	    key: "componentWillMount",
	    value: function componentWillMount() {
	      if (!_canUseDom2["default"]) {
	        return;
	      }
	      var marker = _creatorsMarkerCreator2["default"]._createMarker(this.props);

	      this.setState({ marker: marker });
	    }
	  }, {
	    key: "componentWillUnmount",
	    value: function componentWillUnmount() {
	      if (!_canUseDom2["default"]) {
	        return;
	      }

	      var anchorHolderRef = this.props.anchorHolderRef;
	      var marker = this.state.marker;

	      if (anchorHolderRef) {
	        if ("MarkerClusterer" === anchorHolderRef.getAnchorType()) {
	          anchorHolderRef.getAnchor().removeMarker(marker);
	        }
	      }
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      if (this.state.marker) {
	        return _react2["default"].createElement(
	          _creatorsMarkerCreator2["default"],
	          _extends({ marker: this.state.marker }, this.props),
	          this.props.children
	        );
	      } else {
	        return _react2["default"].createElement("noscript", null);
	      }
	    }
	  }], [{
	    key: "propTypes",
	    value: _extends({}, _creatorsMarkerCreator.markerDefaultPropTypes, _creatorsMarkerCreator.markerControlledPropTypes, _creatorsMarkerCreator.markerEventPropTypes),
	    enumerable: true
	  }]);

	  return Marker;
	})(_react.Component);

	exports["default"] = Marker;
	module.exports = exports["default"];

	// Uncontrolled default[props] - used only in componentDidMount

	// Controlled [props] - used in componentDidMount/componentDidUpdate

	// Event [onEventName]

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsMarkerEventList = __webpack_require__(38);

	var _eventListsMarkerEventList2 = _interopRequireDefault(_eventListsMarkerEventList);

	var _utilsEventHandlerCreator = __webpack_require__(15);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(16);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(18);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(20);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(12);

	var _GoogleMapHolder2 = _interopRequireDefault(_GoogleMapHolder);

	var markerControlledPropTypes = {
	  // NOTICE!!!!!!
	  //
	  // Only expose those with getters & setters in the table as controlled props.
	  //
	  // [].map.call($0.querySelectorAll("tr>td>code", function(it){ return it.textContent; }).filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
	  //
	  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Marker
	  animation: _react.PropTypes.any,
	  attribution: _react.PropTypes.any,
	  clickable: _react.PropTypes.bool,
	  cursor: _react.PropTypes.string,
	  draggable: _react.PropTypes.bool,
	  icon: _react.PropTypes.any,
	  label: _react.PropTypes.any,
	  opacity: _react.PropTypes.number,
	  options: _react.PropTypes.object,
	  place: _react.PropTypes.any,
	  position: _react.PropTypes.any,
	  shape: _react.PropTypes.any,
	  title: _react.PropTypes.string,
	  visible: _react.PropTypes.bool,
	  zIndex: _react.PropTypes.number
	};

	exports.markerControlledPropTypes = markerControlledPropTypes;
	var markerDefaultPropTypes = (0, _utilsDefaultPropsCreator2["default"])(markerControlledPropTypes);

	exports.markerDefaultPropTypes = markerDefaultPropTypes;
	var markerUpdaters = {
	  animation: function animation(_animation, component) {
	    component.getMarker().setAnimation(_animation);
	  },
	  attribution: function attribution(_attribution, component) {
	    component.getMarker().setAttribution(_attribution);
	  },
	  clickable: function clickable(_clickable, component) {
	    component.getMarker().setClickable(_clickable);
	  },
	  cursor: function cursor(_cursor, component) {
	    component.getMarker().setCursor(_cursor);
	  },
	  draggable: function draggable(_draggable, component) {
	    component.getMarker().setDraggable(_draggable);
	  },
	  icon: function icon(_icon, component) {
	    component.getMarker().setIcon(_icon);
	  },
	  label: function label(_label, component) {
	    component.getMarker().setLabel(_label);
	  },
	  opacity: function opacity(_opacity, component) {
	    component.getMarker().setOpacity(_opacity);
	  },
	  options: function options(_options, component) {
	    component.getMarker().setOptions(_options);
	  },
	  place: function place(_place, component) {
	    component.getMarker().setPlace(_place);
	  },
	  position: function position(_position, component) {
	    component.getMarker().setPosition(_position);
	  },
	  shape: function shape(_shape, component) {
	    component.getMarker().setShape(_shape);
	  },
	  title: function title(_title, component) {
	    component.getMarker().setTitle(_title);
	  },
	  visible: function visible(_visible, component) {
	    component.getMarker().setVisible(_visible);
	  },
	  zIndex: function zIndex(_zIndex, component) {
	    component.getMarker().setZIndex(_zIndex);
	  }
	};

	var _eventHandlerCreator = (0, _utilsEventHandlerCreator2["default"])(_eventListsMarkerEventList2["default"]);

	var eventPropTypes = _eventHandlerCreator.eventPropTypes;
	var registerEvents = _eventHandlerCreator.registerEvents;
	var markerEventPropTypes = eventPropTypes;

	exports.markerEventPropTypes = markerEventPropTypes;

	var MarkerCreator = (function (_Component) {
	  _inherits(MarkerCreator, _Component);

	  function MarkerCreator() {
	    _classCallCheck(this, _MarkerCreator);

	    _get(Object.getPrototypeOf(_MarkerCreator.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(MarkerCreator, [{
	    key: "getMarker",
	    value: function getMarker() {
	      return this.props.marker;
	    }

	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindowOptions
	    // In the core API, the only anchor is the Marker class.
	  }, {
	    key: "getAnchor",
	    value: function getAnchor() {
	      return this.props.marker;
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _this = this;

	      var _props = this.props;
	      var mapHolderRef = _props.mapHolderRef;
	      var children = _props.children;

	      if (0 < _react.Children.count(children)) {
	        return _react2["default"].createElement(
	          "div",
	          null,
	          _react.Children.map(children, function (childElement) {
	            return childElement && _react2["default"].cloneElement(childElement, {
	              mapHolderRef: mapHolderRef,
	              anchorHolderRef: _this
	            });
	          })
	        );
	      } else {
	        return _react2["default"].createElement("noscript", null);
	      }
	    }
	  }], [{
	    key: "_createMarker",
	    value: function _createMarker(markerProps) {
	      var mapHolderRef = markerProps.mapHolderRef;
	      var anchorHolderRef = markerProps.anchorHolderRef;

	      // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Marker
	      var marker = new google.maps.Marker((0, _utilsComposeOptions2["default"])(markerProps, markerControlledPropTypes));

	      if (anchorHolderRef) {
	        if ("MarkerClusterer" === anchorHolderRef.getAnchorType()) {
	          anchorHolderRef.getAnchor().addMarker(marker);
	        }
	      } else {
	        marker.setMap(mapHolderRef.getMap());
	      }

	      return marker;
	    }
	  }, {
	    key: "propTypes",
	    value: {
	      mapHolderRef: _react.PropTypes.instanceOf(_GoogleMapHolder2["default"]).isRequired,
	      marker: _react.PropTypes.object.isRequired
	    },
	    enumerable: true
	  }]);

	  var _MarkerCreator = MarkerCreator;
	  MarkerCreator = (0, _utilsComponentLifecycleDecorator2["default"])({
	    registerEvents: registerEvents,
	    instanceMethodName: "getMarker",
	    updaters: markerUpdaters
	  })(MarkerCreator) || MarkerCreator;
	  return MarkerCreator;
	})(_react.Component);

	exports["default"] = MarkerCreator;

/***/ },
/* 38 */
/***/ function(module, exports) {

	// https://developers.google.com/maps/documentation/javascript/3.exp/reference#Marker
	// [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = ["animation_changed", "click", "clickable_changed", "cursor_changed", "dblclick", "drag", "dragend", "draggable_changed", "dragstart", "flat_changed", "icon_changed", "mousedown", "mouseout", "mouseover", "mouseup", "position_changed", "rightclick", "shape_changed", "title_changed", "visible_changed", "zindex_changed"];
	module.exports = exports["default"];

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(23);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsOverlayViewCreator = __webpack_require__(40);

	var _creatorsOverlayViewCreator2 = _interopRequireDefault(_creatorsOverlayViewCreator);

	/*
	 * Original author: @petebrowne
	 * Original PR: https://github.com/tomchentw/react-google-maps/pull/63
	 */

	var OverlayView = (function (_Component) {
	  _inherits(OverlayView, _Component);

	  function OverlayView() {
	    _classCallCheck(this, OverlayView);

	    _get(Object.getPrototypeOf(OverlayView.prototype), "constructor", this).apply(this, arguments);

	    this.state = {};
	  }

	  _createClass(OverlayView, [{
	    key: "getPanes",

	    // Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#OverlayView
	    //
	    // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^get/) && !it.match(/^getMap/); })
	    value: function getPanes() {
	      return this.state.overlayView.getPanes();
	    }
	  }, {
	    key: "getProjection",
	    value: function getProjection() {
	      return this.state.overlayView.getProjection();
	    }

	    // END - Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#OverlayView

	  }, {
	    key: "componentWillMount",
	    value: function componentWillMount() {
	      if (!_canUseDom2["default"]) {
	        return;
	      }
	      var overlayView = _creatorsOverlayViewCreator2["default"]._createOverlayView(this.props);

	      this.setState({ overlayView: overlayView });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      if (this.state.overlayView) {
	        return _react2["default"].createElement(
	          _creatorsOverlayViewCreator2["default"],
	          _extends({ overlayView: this.state.overlayView }, this.props),
	          this.props.children
	        );
	      } else {
	        return _react2["default"].createElement("noscript", null);
	      }
	    }
	  }], [{
	    key: "FLOAT_PANE",
	    value: "floatPane",
	    enumerable: true
	  }, {
	    key: "MAP_PANE",
	    value: "mapPane",
	    enumerable: true
	  }, {
	    key: "MARKER_LAYER",
	    value: "markerLayer",
	    enumerable: true
	  }, {
	    key: "OVERLAY_LAYER",
	    value: "overlayLayer",
	    enumerable: true
	  }, {
	    key: "OVERLAY_MOUSE_TARGET",
	    value: "overlayMouseTarget",
	    enumerable: true
	  }, {
	    key: "propTypes",
	    value: _extends({}, _creatorsOverlayViewCreator.overlayViewDefaultPropTypes, _creatorsOverlayViewCreator.overlayViewControlledPropTypes),
	    enumerable: true
	  }, {
	    key: "defaultProps",
	    value: {
	      mapPaneName: OverlayView.OVERLAY_LAYER
	    },
	    enumerable: true
	  }]);

	  return OverlayView;
	})(_react.Component);

	exports["default"] = OverlayView;
	module.exports = exports["default"];

	// Uncontrolled default[props] - used only in componentDidMount

	// Controlled [props] - used in componentDidMount/componentDidUpdate

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _invariant = __webpack_require__(41);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _utilsDefaultPropsCreator = __webpack_require__(16);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(18);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _GoogleMapHolder = __webpack_require__(12);

	var _GoogleMapHolder2 = _interopRequireDefault(_GoogleMapHolder);

	var overlayViewControlledPropTypes = {
	  // CustomProps
	  mapPaneName: _react.PropTypes.string,
	  getPixelPositionOffset: _react.PropTypes.func,
	  position: _react.PropTypes.object,
	  children: _react.PropTypes.node
	};

	exports.overlayViewControlledPropTypes = overlayViewControlledPropTypes;
	// NOTICE!!!!!!
	//
	// Only expose those with getters & setters in the table as controlled props.
	//
	// [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
	//
	// https://developers.google.com/maps/documentation/javascript/3.exp/reference
	var overlayViewDefaultPropTypes = (0, _utilsDefaultPropsCreator2["default"])(overlayViewControlledPropTypes);

	exports.overlayViewDefaultPropTypes = overlayViewDefaultPropTypes;

	var OverlayViewCreator = (function (_Component) {
	  _inherits(OverlayViewCreator, _Component);

	  function OverlayViewCreator() {
	    _classCallCheck(this, OverlayViewCreator);

	    _get(Object.getPrototypeOf(OverlayViewCreator.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(OverlayViewCreator, [{
	    key: "getOverlayView",
	    value: function getOverlayView() {
	      return this.props.overlayView;
	    }
	  }, {
	    key: "componentDidMount",
	    value: function componentDidMount() {
	      this.getOverlayView().setMap(this.props.mapHolderRef.getMap());
	    }
	  }, {
	    key: "componentDidUpdate",
	    value: function componentDidUpdate(prevProps) {
	      this.getOverlayView().setValues(this.props);
	      this.getOverlayView()._redraw(this.props.mapPaneName !== prevProps.mapPaneName);
	    }
	  }, {
	    key: "componentWillUnmount",
	    value: function componentWillUnmount() {
	      this.getOverlayView().setMap(null);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return _react2["default"].createElement("noscript", null);
	    }
	  }], [{
	    key: "_createOverlayView",
	    value: function _createOverlayView(overlayViewProps) {
	      var mapHolderRef = overlayViewProps.mapHolderRef;

	      // https://developers.google.com/maps/documentation/javascript/3.exp/reference#OverlayView
	      var overlayView = new google.maps.OverlayView();
	      overlayView.setValues((0, _utilsComposeOptions2["default"])(overlayViewProps, overlayViewControlledPropTypes));

	      overlayView.onAdd = function () {
	        this._containerElement = document.createElement("div");
	        this._containerElement.style.position = "absolute";
	      };

	      overlayView.draw = function () {
	        this._renderContent();
	        this._mountContainerToPane();
	        this._positionContainerElement();
	      };

	      overlayView.onRemove = function () {
	        (0, _reactDom.unmountComponentAtNode)(this._containerElement);
	        this._unmountContainerFromPane();
	        this._containerElement = null;
	      };

	      overlayView._redraw = function (mapPaneNameChanged) {
	        this._renderContent();
	        if (mapPaneNameChanged) {
	          this._unmountContainerFromPane();
	          this._mountContainerToPane();
	        }
	        this._positionContainerElement();
	      };

	      overlayView._renderContent = function () {
	        (0, _reactDom.render)(_react.Children.only(this.get("children")), this._containerElement);
	      };

	      overlayView._mountContainerToPane = function () {
	        var mapPaneName = this.get("mapPaneName");
	        (0, _invariant2["default"])(!!mapPaneName, "OverlayView requires a mapPaneName/defaultMapPaneName in your props instead of %s", mapPaneName);

	        this.getPanes()[mapPaneName].appendChild(this._containerElement);
	      };

	      overlayView._unmountContainerFromPane = function () {
	        this._containerElement.parentNode.removeChild(this._containerElement);
	      };

	      overlayView._positionContainerElement = function () {
	        var left = undefined,
	            top = undefined;
	        var position = this._getPixelPosition();
	        if (position) {
	          var x = position.x;
	          var y = position.y;

	          var offset = this._getOffset();
	          if (offset) {
	            x += offset.x;
	            y += offset.y;
	          }
	          left = x + "px";
	          top = y + "px";
	        }
	        this._containerElement.style.left = left;
	        this._containerElement.style.top = top;
	      };

	      overlayView._getPixelPosition = function () {
	        var projection = this.getProjection();
	        var position = this.get("position");
	        (0, _invariant2["default"])(!!position, "OverlayView requires a position/defaultPosition in your props instead of %s", position);

	        if (projection && position) {
	          if (!(position instanceof google.maps.LatLng)) {
	            position = new google.maps.LatLng(position.lat, position.lng);
	          }
	          return projection.fromLatLngToDivPixel(position);
	        }
	      };

	      overlayView._getOffset = function () {
	        // Allows the component to control the visual position of the OverlayView
	        // relative to the LatLng pixel position.
	        var getPixelPositionOffset = this.get("getPixelPositionOffset");
	        if (getPixelPositionOffset) {
	          return getPixelPositionOffset(this._containerElement.offsetWidth, this._containerElement.offsetHeight);
	        }
	      };

	      return overlayView;
	    }
	  }, {
	    key: "propTypes",
	    value: {
	      mapHolderRef: _react.PropTypes.instanceOf(_GoogleMapHolder2["default"]).isRequired,
	      overlayView: _react.PropTypes.object.isRequired
	    },
	    enumerable: true
	  }]);

	  return OverlayViewCreator;
	})(_react.Component);

	exports["default"] = OverlayViewCreator;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (false) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(23);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsPolygonCreator = __webpack_require__(43);

	var _creatorsPolygonCreator2 = _interopRequireDefault(_creatorsPolygonCreator);

	var Polygon = (function (_Component) {
	  _inherits(Polygon, _Component);

	  function Polygon() {
	    _classCallCheck(this, Polygon);

	    _get(Object.getPrototypeOf(Polygon.prototype), "constructor", this).apply(this, arguments);

	    this.state = {};
	  }

	  _createClass(Polygon, [{
	    key: "getDraggable",

	    // Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polygon
	    //
	    // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^get/) && !it.match(/^getMap/); })
	    value: function getDraggable() {
	      return this.state.polygon.getDraggable();
	    }
	  }, {
	    key: "getEditable",
	    value: function getEditable() {
	      return this.state.polygon.getEditable();
	    }
	  }, {
	    key: "getPath",
	    value: function getPath() {
	      return this.state.polygon.getPath();
	    }
	  }, {
	    key: "getPaths",
	    value: function getPaths() {
	      return this.state.polygon.getPaths();
	    }
	  }, {
	    key: "getVisible",
	    value: function getVisible() {
	      return this.state.polygon.getVisible();
	    }

	    // END - Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polygon

	  }, {
	    key: "componentWillMount",
	    value: function componentWillMount() {
	      if (!_canUseDom2["default"]) {
	        return;
	      }
	      var polygon = _creatorsPolygonCreator2["default"]._createPolygon(this.props);

	      this.setState({ polygon: polygon });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      if (this.state.polygon) {
	        return _react2["default"].createElement(
	          _creatorsPolygonCreator2["default"],
	          _extends({ polygon: this.state.polygon }, this.props),
	          this.props.children
	        );
	      } else {
	        return _react2["default"].createElement("noscript", null);
	      }
	    }
	  }], [{
	    key: "propTypes",
	    value: _extends({}, _creatorsPolygonCreator.polygonDefaultPropTypes, _creatorsPolygonCreator.polygonControlledPropTypes, _creatorsPolygonCreator.polygonEventPropTypes),
	    enumerable: true
	  }]);

	  return Polygon;
	})(_react.Component);

	exports["default"] = Polygon;
	module.exports = exports["default"];

	// Uncontrolled default[props] - used only in componentDidMount

	// Controlled [props] - used in componentDidMount/componentDidUpdate

	// Event [onEventName]

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsPolygonEventList = __webpack_require__(44);

	var _eventListsPolygonEventList2 = _interopRequireDefault(_eventListsPolygonEventList);

	var _utilsEventHandlerCreator = __webpack_require__(15);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(16);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(18);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(20);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(12);

	var _GoogleMapHolder2 = _interopRequireDefault(_GoogleMapHolder);

	var polygonControlledPropTypes = {
	  // NOTICE!!!!!!
	  //
	  // Only expose those with getters & setters in the table as controlled props.
	  //
	  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
	  //
	  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polygon
	  draggable: _react.PropTypes.bool,
	  editable: _react.PropTypes.bool,
	  options: _react.PropTypes.object,
	  path: _react.PropTypes.any,
	  paths: _react.PropTypes.any,
	  visible: _react.PropTypes.bool
	};

	exports.polygonControlledPropTypes = polygonControlledPropTypes;
	var polygonDefaultPropTypes = (0, _utilsDefaultPropsCreator2["default"])(polygonControlledPropTypes);

	exports.polygonDefaultPropTypes = polygonDefaultPropTypes;
	var polygonUpdaters = {
	  draggable: function draggable(_draggable, component) {
	    component.getPolygon().setDraggable(_draggable);
	  },
	  editable: function editable(_editable, component) {
	    component.getPolygon().setEditable(_editable);
	  },
	  options: function options(_options, component) {
	    component.getPolygon().setOptions(_options);
	  },
	  path: function path(_path, component) {
	    component.getPolygon().setPath(_path);
	  },
	  paths: function paths(_paths, component) {
	    component.getPolygon().setPaths(_paths);
	  },
	  visible: function visible(_visible, component) {
	    component.getPolygon().setVisible(_visible);
	  }
	};

	var _eventHandlerCreator = (0, _utilsEventHandlerCreator2["default"])(_eventListsPolygonEventList2["default"]);

	var eventPropTypes = _eventHandlerCreator.eventPropTypes;
	var registerEvents = _eventHandlerCreator.registerEvents;
	var polygonEventPropTypes = eventPropTypes;

	exports.polygonEventPropTypes = polygonEventPropTypes;

	var PolygonCreator = (function (_Component) {
	  _inherits(PolygonCreator, _Component);

	  function PolygonCreator() {
	    _classCallCheck(this, _PolygonCreator);

	    _get(Object.getPrototypeOf(_PolygonCreator.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(PolygonCreator, [{
	    key: "getPolygon",
	    value: function getPolygon() {
	      return this.props.polygon;
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return _react2["default"].createElement("noscript", null);
	    }
	  }], [{
	    key: "_createPolygon",
	    value: function _createPolygon(polygonProps) {
	      var mapHolderRef = polygonProps.mapHolderRef;

	      // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polygon
	      var polygon = new google.maps.Polygon((0, _utilsComposeOptions2["default"])(polygonProps, polygonControlledPropTypes));

	      polygon.setMap(mapHolderRef.getMap());

	      return polygon;
	    }
	  }, {
	    key: "propTypes",
	    value: {
	      mapHolderRef: _react.PropTypes.instanceOf(_GoogleMapHolder2["default"]).isRequired,
	      polygon: _react.PropTypes.object.isRequired
	    },
	    enumerable: true
	  }]);

	  var _PolygonCreator = PolygonCreator;
	  PolygonCreator = (0, _utilsComponentLifecycleDecorator2["default"])({
	    registerEvents: registerEvents,
	    instanceMethodName: "getPolygon",
	    updaters: polygonUpdaters
	  })(PolygonCreator) || PolygonCreator;
	  return PolygonCreator;
	})(_react.Component);

	exports["default"] = PolygonCreator;

/***/ },
/* 44 */
/***/ function(module, exports) {

	// https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polygon
	// [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = ["click", "dblclick", "drag", "dragend", "dragstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"];
	module.exports = exports["default"];

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(23);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsPolylineCreator = __webpack_require__(46);

	var _creatorsPolylineCreator2 = _interopRequireDefault(_creatorsPolylineCreator);

	var Polyline = (function (_Component) {
	  _inherits(Polyline, _Component);

	  function Polyline() {
	    _classCallCheck(this, Polyline);

	    _get(Object.getPrototypeOf(Polyline.prototype), "constructor", this).apply(this, arguments);

	    this.state = {};
	  }

	  _createClass(Polyline, [{
	    key: "getDraggable",

	    // Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polyline
	    //
	    // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^get/) && !it.match(/^getMap/); })
	    value: function getDraggable() {
	      return this.state.polyline.getDraggable();
	    }
	  }, {
	    key: "getEditable",
	    value: function getEditable() {
	      return this.state.polyline.getEditable();
	    }
	  }, {
	    key: "getPath",
	    value: function getPath() {
	      return this.state.polyline.getPath();
	    }
	  }, {
	    key: "getVisible",
	    value: function getVisible() {
	      return this.state.polyline.getVisible();
	    }

	    // END - Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polyline

	  }, {
	    key: "componentWillMount",
	    value: function componentWillMount() {
	      if (!_canUseDom2["default"]) {
	        return;
	      }
	      var polyline = _creatorsPolylineCreator2["default"]._createPolyline(this.props);

	      this.setState({ polyline: polyline });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      if (this.state.polyline) {
	        return _react2["default"].createElement(
	          _creatorsPolylineCreator2["default"],
	          _extends({ polyline: this.state.polyline }, this.props),
	          this.props.children
	        );
	      } else {
	        return _react2["default"].createElement("noscript", null);
	      }
	    }
	  }], [{
	    key: "propTypes",
	    value: _extends({}, _creatorsPolylineCreator.polylineDefaultPropTypes, _creatorsPolylineCreator.polylineControlledPropTypes, _creatorsPolylineCreator.polylineEventPropTypes),
	    enumerable: true
	  }]);

	  return Polyline;
	})(_react.Component);

	exports["default"] = Polyline;
	module.exports = exports["default"];

	// Uncontrolled default[props] - used only in componentDidMount

	// Controlled [props] - used in componentDidMount/componentDidUpdate

	// Event [onEventName]

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsPolylineEventList = __webpack_require__(47);

	var _eventListsPolylineEventList2 = _interopRequireDefault(_eventListsPolylineEventList);

	var _utilsEventHandlerCreator = __webpack_require__(15);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(16);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(18);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(20);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(12);

	var _GoogleMapHolder2 = _interopRequireDefault(_GoogleMapHolder);

	var polylineControlledPropTypes = {
	  // NOTICE!!!!!!
	  //
	  // Only expose those with getters & setters in the table as controlled props.
	  //
	  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
	  //
	  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polyline
	  draggable: _react.PropTypes.bool,
	  editable: _react.PropTypes.bool,
	  options: _react.PropTypes.object,
	  path: _react.PropTypes.any,
	  visible: _react.PropTypes.bool
	};

	exports.polylineControlledPropTypes = polylineControlledPropTypes;
	var polylineDefaultPropTypes = (0, _utilsDefaultPropsCreator2["default"])(polylineControlledPropTypes);

	exports.polylineDefaultPropTypes = polylineDefaultPropTypes;
	var polylineUpdaters = {
	  draggable: function draggable(_draggable, component) {
	    component.getPolyline().setDraggable(_draggable);
	  },
	  editable: function editable(_editable, component) {
	    component.getPolyline().setEditable(_editable);
	  },
	  options: function options(_options, component) {
	    component.getPolyline().setOptions(_options);
	  },
	  path: function path(_path, component) {
	    component.getPolyline().setPath(_path);
	  },
	  visible: function visible(_visible, component) {
	    component.getPolyline().setVisible(_visible);
	  }
	};

	var _eventHandlerCreator = (0, _utilsEventHandlerCreator2["default"])(_eventListsPolylineEventList2["default"]);

	var eventPropTypes = _eventHandlerCreator.eventPropTypes;
	var registerEvents = _eventHandlerCreator.registerEvents;
	var polylineEventPropTypes = eventPropTypes;

	exports.polylineEventPropTypes = polylineEventPropTypes;

	var PolylineCreator = (function (_Component) {
	  _inherits(PolylineCreator, _Component);

	  function PolylineCreator() {
	    _classCallCheck(this, _PolylineCreator);

	    _get(Object.getPrototypeOf(_PolylineCreator.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(PolylineCreator, [{
	    key: "getPolyline",
	    value: function getPolyline() {
	      return this.props.polyline;
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return _react2["default"].createElement("noscript", null);
	    }
	  }], [{
	    key: "_createPolyline",
	    value: function _createPolyline(polylineProps) {
	      var mapHolderRef = polylineProps.mapHolderRef;

	      // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polyline
	      var polyline = new google.maps.Polyline((0, _utilsComposeOptions2["default"])(polylineProps, polylineControlledPropTypes));

	      polyline.setMap(mapHolderRef.getMap());

	      return polyline;
	    }
	  }, {
	    key: "propTypes",
	    value: {
	      mapHolderRef: _react.PropTypes.instanceOf(_GoogleMapHolder2["default"]).isRequired,
	      polyline: _react.PropTypes.object.isRequired
	    },
	    enumerable: true
	  }]);

	  var _PolylineCreator = PolylineCreator;
	  PolylineCreator = (0, _utilsComponentLifecycleDecorator2["default"])({
	    registerEvents: registerEvents,
	    instanceMethodName: "getPolyline",
	    updaters: polylineUpdaters
	  })(PolylineCreator) || PolylineCreator;
	  return PolylineCreator;
	})(_react.Component);

	exports["default"] = PolylineCreator;

/***/ },
/* 47 */
/***/ function(module, exports) {

	// https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polyline
	// [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = ["click", "dblclick", "drag", "dragend", "dragstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"];
	module.exports = exports["default"];

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(23);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsRectangleCreator = __webpack_require__(49);

	var _creatorsRectangleCreator2 = _interopRequireDefault(_creatorsRectangleCreator);

	/*
	 * Original author: @alistairjcbrown
	 * Original PR: https://github.com/tomchentw/react-google-maps/pull/80
	 */

	var Rectangle = (function (_Component) {
	  _inherits(Rectangle, _Component);

	  function Rectangle() {
	    _classCallCheck(this, Rectangle);

	    _get(Object.getPrototypeOf(Rectangle.prototype), "constructor", this).apply(this, arguments);

	    this.state = {};
	  }

	  _createClass(Rectangle, [{
	    key: "getBounds",

	    // Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Rectangle
	    //
	    // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^get/) && !it.match(/^getMap/); })
	    value: function getBounds() {
	      return this.state.rectangle.getBounds();
	    }
	  }, {
	    key: "getDraggable",
	    value: function getDraggable() {
	      return this.state.rectangle.getDraggable();
	    }
	  }, {
	    key: "getEditable",
	    value: function getEditable() {
	      return this.state.rectangle.getEditable();
	    }
	  }, {
	    key: "getVisible",
	    value: function getVisible() {
	      return this.state.rectangle.getVisible();
	    }

	    // END - Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Rectangle

	  }, {
	    key: "componentWillMount",
	    value: function componentWillMount() {
	      if (!_canUseDom2["default"]) {
	        return;
	      }
	      var rectangle = _creatorsRectangleCreator2["default"]._createRectangle(this.props);

	      this.setState({ rectangle: rectangle });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      if (this.state.rectangle) {
	        return _react2["default"].createElement(
	          _creatorsRectangleCreator2["default"],
	          _extends({ rectangle: this.state.rectangle }, this.props),
	          this.props.children
	        );
	      } else {
	        return _react2["default"].createElement("noscript", null);
	      }
	    }
	  }], [{
	    key: "propTypes",
	    value: _extends({}, _creatorsRectangleCreator.rectangleDefaultPropTypes, _creatorsRectangleCreator.rectangleControlledPropTypes, _creatorsRectangleCreator.rectangleEventPropTypes),
	    enumerable: true
	  }]);

	  return Rectangle;
	})(_react.Component);

	exports["default"] = Rectangle;
	module.exports = exports["default"];

	// Uncontrolled default[props] - used only in componentDidMount

	// Controlled [props] - used in componentDidMount/componentDidUpdate

	// Event [onEventName]

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsRectangleEventList = __webpack_require__(50);

	var _eventListsRectangleEventList2 = _interopRequireDefault(_eventListsRectangleEventList);

	var _utilsEventHandlerCreator = __webpack_require__(15);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(16);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(18);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(20);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(12);

	var _GoogleMapHolder2 = _interopRequireDefault(_GoogleMapHolder);

	var rectangleControlledPropTypes = {
	  // NOTICE!!!!!!
	  //
	  // Only expose those with getters & setters in the table as controlled props.
	  //
	  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
	  //
	  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Rectangle
	  bounds: _react.PropTypes.any,
	  draggable: _react.PropTypes.bool,
	  editable: _react.PropTypes.bool,
	  options: _react.PropTypes.object,
	  visible: _react.PropTypes.bool
	};

	exports.rectangleControlledPropTypes = rectangleControlledPropTypes;
	var rectangleDefaultPropTypes = (0, _utilsDefaultPropsCreator2["default"])(rectangleControlledPropTypes);

	exports.rectangleDefaultPropTypes = rectangleDefaultPropTypes;
	var rectangleUpdaters = {
	  bounds: function bounds(_bounds, component) {
	    component.getRectangle().setBounds(_bounds);
	  },
	  draggable: function draggable(_draggable, component) {
	    component.getRectangle().setDraggable(_draggable);
	  },
	  editable: function editable(_editable, component) {
	    component.getRectangle().setEditable(_editable);
	  },
	  options: function options(_options, component) {
	    component.getRectangle().setOptions(_options);
	  },
	  visible: function visible(_visible, component) {
	    component.getRectangle().setVisible(_visible);
	  }
	};

	var _eventHandlerCreator = (0, _utilsEventHandlerCreator2["default"])(_eventListsRectangleEventList2["default"]);

	var eventPropTypes = _eventHandlerCreator.eventPropTypes;
	var registerEvents = _eventHandlerCreator.registerEvents;
	var rectangleEventPropTypes = eventPropTypes;

	exports.rectangleEventPropTypes = rectangleEventPropTypes;

	var RectangleCreator = (function (_Component) {
	  _inherits(RectangleCreator, _Component);

	  function RectangleCreator() {
	    _classCallCheck(this, _RectangleCreator);

	    _get(Object.getPrototypeOf(_RectangleCreator.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(RectangleCreator, [{
	    key: "getRectangle",
	    value: function getRectangle() {
	      return this.props.rectangle;
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return _react2["default"].createElement("noscript", null);
	    }
	  }], [{
	    key: "_createRectangle",
	    value: function _createRectangle(rectangleProps) {
	      var mapHolderRef = rectangleProps.mapHolderRef;

	      // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Rectangle
	      var rectangle = new google.maps.Rectangle((0, _utilsComposeOptions2["default"])(rectangleProps, rectangleControlledPropTypes));

	      rectangle.setMap(mapHolderRef.getMap());

	      return rectangle;
	    }
	  }, {
	    key: "propTypes",
	    value: {
	      mapHolderRef: _react.PropTypes.instanceOf(_GoogleMapHolder2["default"]).isRequired,
	      rectangle: _react.PropTypes.object.isRequired
	    },
	    enumerable: true
	  }]);

	  var _RectangleCreator = RectangleCreator;
	  RectangleCreator = (0, _utilsComponentLifecycleDecorator2["default"])({
	    registerEvents: registerEvents,
	    instanceMethodName: "getRectangle",
	    updaters: rectangleUpdaters
	  })(RectangleCreator) || RectangleCreator;
	  return RectangleCreator;
	})(_react.Component);

	exports["default"] = RectangleCreator;

/***/ },
/* 50 */
/***/ function(module, exports) {

	// https://developers.google.com/maps/documentation/javascript/3.exp/reference#Rectangle
	// [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = ["bounds_changed", "click", "dblclick", "drag", "dragend", "dragstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"];
	module.exports = exports["default"];

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(23);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsSearchBoxCreator = __webpack_require__(52);

	var _creatorsSearchBoxCreator2 = _interopRequireDefault(_creatorsSearchBoxCreator);

	/*
	 * Original author: @eyebraus
	 * Original PR: https://github.com/tomchentw/react-google-maps/pull/110 
	 */

	var SearchBox = (function (_Component) {
	  _inherits(SearchBox, _Component);

	  function SearchBox() {
	    _classCallCheck(this, SearchBox);

	    _get(Object.getPrototypeOf(SearchBox.prototype), "constructor", this).apply(this, arguments);

	    this.state = {};
	  }

	  _createClass(SearchBox, [{
	    key: "getBounds",

	    // Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#SearchBox
	    //
	    // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^get/) && !it.match(/Map$/); })
	    value: function getBounds() {
	      return this.state.searchBox.getBounds();
	    }
	  }, {
	    key: "getPlaces",
	    value: function getPlaces() {
	      return this.state.searchBox.getPlaces();
	    }

	    // END - Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#SearchBox

	  }, {
	    key: "componentWillMount",
	    value: function componentWillMount() {
	      if (!_canUseDom2["default"]) {
	        return;
	      }
	      var _props = this.props;
	      var mapHolderRef = _props.mapHolderRef;
	      var classes = _props.classes;
	      var style = _props.style;
	      var placeholder = _props.placeholder;

	      var searchBoxProps = _objectWithoutProperties(_props, ["mapHolderRef", "classes", "style", "placeholder"]);

	      // Cannot create input via component - Google Maps will mess with React's internal state by detaching/attaching.
	      // Allow developers to style the "hidden element" via inputClasses.
	      var domEl = document.createElement("input");
	      domEl.className = classes;
	      domEl.type = "text";
	      domEl.placeholder = placeholder;

	      for (var propKey in style) {
	        if (style.hasOwnProperty(propKey)) {
	          domEl.style[propKey] = style[propKey];
	        }
	      }

	      var searchBox = _creatorsSearchBoxCreator2["default"]._createSearchBox(domEl, searchBoxProps);

	      this.setState({
	        inputElement: domEl,
	        searchBox: searchBox
	      });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _props2 = this.props;
	      var mapHolderRef = _props2.mapHolderRef;
	      var controlPosition = _props2.controlPosition;

	      return this.state.searchBox ? _react2["default"].createElement(
	        _creatorsSearchBoxCreator2["default"],
	        _extends({ controlPosition: controlPosition, inputElement: this.state.inputElement, mapHolderRef: mapHolderRef, searchBox: this.state.searchBox }, this.props),
	        this.props.children
	      ) : _react2["default"].createElement("noscript", null);
	    }
	  }], [{
	    key: "propTypes",
	    value: _extends({}, _creatorsSearchBoxCreator.searchBoxDefaultPropTypes, _creatorsSearchBoxCreator.searchBoxControlledPropTypes, _creatorsSearchBoxCreator.searchBoxEventPropTypes),
	    enumerable: true
	  }]);

	  return SearchBox;
	})(_react.Component);

	exports["default"] = SearchBox;
	module.exports = exports["default"];

	// Uncontrolled default[props] - used only in componentDidMount

	// Controlled [props] - used in componentDidMount/componentDidUpdate

	// Event [onEventName]

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsSearchBoxEventList = __webpack_require__(53);

	var _eventListsSearchBoxEventList2 = _interopRequireDefault(_eventListsSearchBoxEventList);

	var _utilsEventHandlerCreator = __webpack_require__(15);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(16);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(18);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(20);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(12);

	var _GoogleMapHolder2 = _interopRequireDefault(_GoogleMapHolder);

	var searchBoxControlledPropTypes = {
	  // NOTICE!!!!!!
	  //
	  // Only expose those with getters & setters in the table as controlled props.
	  //
	  bounds: _react.PropTypes.any
	};

	exports.searchBoxControlledPropTypes = searchBoxControlledPropTypes;
	var searchBoxDefaultPropTypes = (0, _utilsDefaultPropsCreator2["default"])(searchBoxControlledPropTypes);

	exports.searchBoxDefaultPropTypes = searchBoxDefaultPropTypes;
	var searchBoxUpdaters = {
	  bounds: function bounds(_bounds, component) {
	    component.getSearchBox().setBounds(_bounds);
	  }
	};

	var _eventHandlerCreator = (0, _utilsEventHandlerCreator2["default"])(_eventListsSearchBoxEventList2["default"]);

	var eventPropTypes = _eventHandlerCreator.eventPropTypes;
	var registerEvents = _eventHandlerCreator.registerEvents;
	var searchBoxEventPropTypes = eventPropTypes;

	exports.searchBoxEventPropTypes = searchBoxEventPropTypes;

	var SearchBoxCreator = (function (_Component) {
	  _inherits(SearchBoxCreator, _Component);

	  function SearchBoxCreator() {
	    _classCallCheck(this, _SearchBoxCreator);

	    _get(Object.getPrototypeOf(_SearchBoxCreator.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(SearchBoxCreator, [{
	    key: "componentDidMount",
	    value: function componentDidMount() {
	      this._mountComponentToMap(this.props.controlPosition);
	    }
	  }, {
	    key: "componentDidUpdate",
	    value: function componentDidUpdate(prevProps) {
	      if (this.props.controlPosition !== prevProps.controlPosition) {
	        this._unmountComponentFromMap(prevProps.controlPosition);
	        this._mountComponentToMap(this.props.controlPosition);
	      }
	    }
	  }, {
	    key: "componentWillUnmount",
	    value: function componentWillUnmount() {
	      this._unmountComponentFromMap(this.props.controlPosition);
	    }
	  }, {
	    key: "_mountComponentToMap",
	    value: function _mountComponentToMap(controlPosition) {
	      var _props = this.props;
	      var mapHolderRef = _props.mapHolderRef;
	      var inputElement = _props.inputElement;

	      mapHolderRef.getMap().controls[controlPosition].push(inputElement);
	    }
	  }, {
	    key: "_unmountComponentFromMap",
	    value: function _unmountComponentFromMap(controlPosition) {
	      var _props2 = this.props;
	      var mapHolderRef = _props2.mapHolderRef;
	      var inputElement = _props2.inputElement;

	      var index = mapHolderRef.getMap().controls[controlPosition].getArray().indexOf(inputElement);
	      mapHolderRef.getMap().controls[controlPosition].removeAt(index);
	    }
	  }, {
	    key: "getSearchBox",
	    value: function getSearchBox() {
	      return this.props.searchBox;
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return _react2["default"].createElement("noscript", null);
	    }
	  }], [{
	    key: "_createSearchBox",
	    value: function _createSearchBox(inputElement, searchBoxProps) {
	      var searchBox = new google.maps.places.SearchBox(inputElement, (0, _utilsComposeOptions2["default"])(searchBoxProps, searchBoxControlledPropTypes));

	      return searchBox;
	    }
	  }, {
	    key: "propTypes",
	    value: {
	      mapHolderRef: _react.PropTypes.instanceOf(_GoogleMapHolder2["default"]).isRequired,
	      searchBox: _react.PropTypes.object.isRequired
	    },
	    enumerable: true
	  }]);

	  var _SearchBoxCreator = SearchBoxCreator;
	  SearchBoxCreator = (0, _utilsComponentLifecycleDecorator2["default"])({
	    registerEvents: registerEvents,
	    instanceMethodName: "getSearchBox",
	    updaters: searchBoxUpdaters
	  })(SearchBoxCreator) || SearchBoxCreator;
	  return SearchBoxCreator;
	})(_react.Component);

	exports["default"] = SearchBoxCreator;

/***/ },
/* 53 */
/***/ function(module, exports) {

	// https://developers.google.com/maps/documentation/javascript/3.exp/reference#SearchBox
	// [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = ["places_changed"];
	module.exports = exports["default"];

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(23);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _addonsCreatorsMarkerClustererCreator = __webpack_require__(55);

	var _addonsCreatorsMarkerClustererCreator2 = _interopRequireDefault(_addonsCreatorsMarkerClustererCreator);

	var MarkerClusterer = (function (_Component) {
	  _inherits(MarkerClusterer, _Component);

	  function MarkerClusterer() {
	    _classCallCheck(this, MarkerClusterer);

	    _get(Object.getPrototypeOf(MarkerClusterer.prototype), 'constructor', this).apply(this, arguments);

	    this.state = {};
	  }

	  _createClass(MarkerClusterer, [{
	    key: 'getAvaerageCenter',

	    // Public APIs
	    // http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html#events
	    value: function getAvaerageCenter() {
	      return this.state.markerClusterer.getAvaerageCenter();
	    }
	  }, {
	    key: 'getBatchSizeIE',
	    value: function getBatchSizeIE() {
	      return this.state.markerClusterer.getBatchSizeIE();
	    }
	  }, {
	    key: 'getCalculator',
	    value: function getCalculator() {
	      return this.state.markerClusterer.getCalculator();
	    }
	  }, {
	    key: 'getClusterClass',
	    value: function getClusterClass() {
	      return this.state.markerClusterer.getClusterClass();
	    }
	  }, {
	    key: 'getClusters',
	    value: function getClusters() {
	      return this.state.markerClusterer.getClusters();
	    }
	  }, {
	    key: 'getEnableRetinaIcons',
	    value: function getEnableRetinaIcons() {
	      return this.state.markerClusterer.getEnableRetinaIcons();
	    }
	  }, {
	    key: 'getGridSize',
	    value: function getGridSize() {
	      return this.state.markerClusterer.getGridSize();
	    }
	  }, {
	    key: 'getIgnoreHidden',
	    value: function getIgnoreHidden() {
	      return this.state.markerClusterer.getIgnoreHidden();
	    }
	  }, {
	    key: 'getImageExtension',
	    value: function getImageExtension() {
	      return this.state.markerClusterer.getImageExtension();
	    }
	  }, {
	    key: 'getImagePath',
	    value: function getImagePath() {
	      return this.state.markerClusterer.getImagePath();
	    }
	  }, {
	    key: 'getImageSize',
	    value: function getImageSize() {
	      return this.state.markerClusterer.getImageSize();
	    }
	  }, {
	    key: 'getMarkers',
	    value: function getMarkers() {
	      return this.state.markerClusterer.getMarkers();
	    }
	  }, {
	    key: 'getMaxZoom',
	    value: function getMaxZoom() {
	      return this.state.markerClusterer.getMaxZoom();
	    }
	  }, {
	    key: 'getMinimumClusterSize',
	    value: function getMinimumClusterSize() {
	      return this.state.markerClusterer.getMinimumClusterSize();
	    }
	  }, {
	    key: 'getStyles',
	    value: function getStyles() {
	      return this.state.markerClusterer.getStyles();
	    }
	  }, {
	    key: 'getTitle',
	    value: function getTitle() {
	      return this.state.markerClusterer.getTitle();
	    }
	  }, {
	    key: 'getTotalClusters',
	    value: function getTotalClusters() {
	      return this.state.markerClusterer.getTotalClusters();
	    }
	  }, {
	    key: 'getZoomOnClick',
	    value: function getZoomOnClick() {
	      return this.state.markerClusterer.getZoomOnClick();
	    }

	    // Public APIs - Use this carefully
	  }, {
	    key: 'addMarker',
	    value: function addMarker(marker) {
	      var nodraw = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	      return this.state.markerClusterer.addMarker(marker, nodraw);
	    }
	  }, {
	    key: 'addMarkers',
	    value: function addMarkers(markers) {
	      var nodraw = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	      return this.state.markerClusterer.addMarkers(markers, nodraw);
	    }
	  }, {
	    key: 'removeMarker',
	    value: function removeMarker(marker) {
	      var nodraw = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	      return this.state.markerClusterer.removeMarker(marker, nodraw);
	    }
	  }, {
	    key: 'removeMarkers',
	    value: function removeMarkers(markers) {
	      var nodraw = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	      return this.state.markerClusterer.removeMarkers(markers, nodraw);
	    }
	  }, {
	    key: 'clearMarkers',
	    value: function clearMarkers() {
	      return this.state.markerClusterer.clearMarkers();
	    }
	  }, {
	    key: 'fitMapToMarkers',
	    value: function fitMapToMarkers() {
	      return this.state.markerClusterer.fitMapToMarkers();
	    }
	  }, {
	    key: 'repaint',
	    value: function repaint() {
	      return this.state.markerClusterer.repaint();
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      if (!_canUseDom2['default']) {
	        return;
	      }

	      var _props = this.props;
	      var mapHolderRef = _props.mapHolderRef;

	      var markerClustererProps = _objectWithoutProperties(_props, ['mapHolderRef']);

	      var markerClusterer = _addonsCreatorsMarkerClustererCreator2['default']._createMarkerClusterer(mapHolderRef, markerClustererProps);

	      this.setState({ markerClusterer: markerClusterer });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (this.state.markerClusterer) {
	        return _react2['default'].createElement(
	          _addonsCreatorsMarkerClustererCreator2['default'],
	          _extends({ markerClusterer: this.state.markerClusterer }, this.props),
	          this.props.children
	        );
	      } else {
	        return _react2['default'].createElement('noscript', null);
	      }
	    }
	  }], [{
	    key: 'propTypes',
	    value: _extends({}, _addonsCreatorsMarkerClustererCreator.markerClusterDefaultPropTypes, _addonsCreatorsMarkerClustererCreator.markerClusterControlledPropTypes, _addonsCreatorsMarkerClustererCreator.markerClusterEventPropTypes),
	    enumerable: true
	  }]);

	  return MarkerClusterer;
	})(_react.Component);

	exports['default'] = MarkerClusterer;
	module.exports = exports['default'];

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _invariant = __webpack_require__(41);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _addonsEventListsMarkerClustererEventList = __webpack_require__(56);

	var _addonsEventListsMarkerClustererEventList2 = _interopRequireDefault(_addonsEventListsMarkerClustererEventList);

	var _utilsEventHandlerCreator = __webpack_require__(15);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(16);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(18);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(20);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _creatorsGoogleMapHolder = __webpack_require__(12);

	var _creatorsGoogleMapHolder2 = _interopRequireDefault(_creatorsGoogleMapHolder);

	var markerClustererControlledPropTypes = {
	  // http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html
	  averageCenter: _react.PropTypes.bool,
	  batchSizeIE: _react.PropTypes.number,
	  calculator: _react.PropTypes.func,
	  clusterClass: _react.PropTypes.string,
	  enableRetinaIcons: _react.PropTypes.bool,
	  gridSize: _react.PropTypes.number,
	  ignoreHidden: _react.PropTypes.bool,
	  imageExtension: _react.PropTypes.string,
	  imagePath: _react.PropTypes.string,
	  imageSizes: _react.PropTypes.array,
	  maxZoom: _react.PropTypes.number,
	  minimumClusterSize: _react.PropTypes.number,
	  styles: _react.PropTypes.array,
	  title: _react.PropTypes.string,
	  zoomOnClick: _react.PropTypes.bool
	};

	exports.markerClustererControlledPropTypes = markerClustererControlledPropTypes;
	var markerClustererDefaultPropTypes = (0, _utilsDefaultPropsCreator2['default'])(markerClustererControlledPropTypes);

	exports.markerClustererDefaultPropTypes = markerClustererDefaultPropTypes;
	var markerClustererUpdaters = {
	  averageCenter: function averageCenter(_averageCenter, component) {
	    component.getMarkerClusterer().setAverageCenter(_averageCenter);
	  },

	  batchSizeIE: function batchSizeIE(_batchSizeIE, component) {
	    component.getMarkerClusterer().setBatchSizeIE(_batchSizeIE);
	  },

	  calculator: function calculator(_calculator, component) {
	    component.getMarkerClusterer().setCalculator(_calculator);
	  },

	  enableRetinaIcons: function enableRetinaIcons(_enableRetinaIcons, component) {
	    component.getMarkerClusterer().setEnableRetinaIcons(_enableRetinaIcons);
	  },

	  gridSize: function gridSize(_gridSize, component) {
	    component.getMarkerClusterer().setGridSize(_gridSize);
	  },

	  ignoreHidden: function ignoreHidden(_ignoreHidden, component) {
	    component.getMarkerClusterer().setIgnoreHidden(_ignoreHidden);
	  },

	  imageExtension: function imageExtension(_imageExtension, component) {
	    component.getMarkerClusterer().setImageExtension(_imageExtension);
	  },

	  imagePath: function imagePath(_imagePath, component) {
	    component.getMarkerClusterer().setImagePath(_imagePath);
	  },

	  imageSizes: function imageSizes(_imageSizes, component) {
	    component.getMarkerClusterer().setImageSizes(_imageSizes);
	  },

	  maxZoom: function maxZoom(_maxZoom, component) {
	    component.getMarkerClusterer().setMaxZoom(_maxZoom);
	  },

	  minimumClusterSize: function minimumClusterSize(_minimumClusterSize, component) {
	    component.getMarkerClusterer().setMinimumClusterSize(_minimumClusterSize);
	  },

	  styles: function styles(_styles, component) {
	    component.getMarkerClusterer().setStyles(_styles);
	  },

	  title: function title(_title, component) {
	    component.getMarkerClusterer().setTitle(_title);
	  },

	  zoomOnClick: function zoomOnClick(_zoomOnClick, component) {
	    component.getMarkerClusterer().setZoomOnClick(_zoomOnClick);
	  }
	};

	var _eventHandlerCreator = (0, _utilsEventHandlerCreator2['default'])(_addonsEventListsMarkerClustererEventList2['default']);

	var eventPropTypes = _eventHandlerCreator.eventPropTypes;
	var registerEvents = _eventHandlerCreator.registerEvents;
	var markerClustererEventPropTypes = eventPropTypes;

	exports.markerClustererEventPropTypes = markerClustererEventPropTypes;

	var MarkerClustererCreator = (function (_Component) {
	  _inherits(MarkerClustererCreator, _Component);

	  function MarkerClustererCreator() {
	    _classCallCheck(this, _MarkerClustererCreator);

	    _get(Object.getPrototypeOf(_MarkerClustererCreator.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(MarkerClustererCreator, [{
	    key: 'getMarkerClusterer',
	    value: function getMarkerClusterer() {
	      return this.props.markerClusterer;
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps) {
	      this.props.markerClusterer.repaint();
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.props.markerClusterer.setMap(null);
	    }
	  }, {
	    key: 'getAnchor',
	    value: function getAnchor() {
	      return this.props.markerClusterer;
	    }
	  }, {
	    key: 'getAnchorType',
	    value: function getAnchorType() {
	      return 'MarkerClusterer';
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this = this;

	      var _props = this.props;
	      var mapHolderRef = _props.mapHolderRef;
	      var children = _props.children;

	      if (0 < _react.Children.count(children)) {
	        return _react2['default'].createElement(
	          'div',
	          null,
	          _react.Children.map(children, function (childElement) {
	            if (_react2['default'].isValidElement(childElement)) {
	              return _react2['default'].cloneElement(childElement, {
	                mapHolderRef: mapHolderRef,
	                anchorHolderRef: _this
	              });
	            } else {
	              return childElement;
	            }
	          })
	        );
	      } else {
	        return _react2['default'].createElement('noscript', null);
	      }
	    }
	  }], [{
	    key: '_createMarkerClusterer',
	    value: function _createMarkerClusterer(mapHolderRef, markerClustererProps) {
	      var GoogleMarkerClusterer = __webpack_require__(57);

	      // http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html#events
	      var markerClusterer = new GoogleMarkerClusterer(mapHolderRef.getMap(), [], (0, _utilsComposeOptions2['default'])(markerClustererProps, markerClustererControlledPropTypes));

	      return markerClusterer;
	    }
	  }, {
	    key: 'PropTypes',
	    value: {
	      mapHolderRef: _react.PropTypes.instanceOf(_creatorsGoogleMapHolder2['default']).isRequired,
	      markerClusterer: _react.PropTypes.object.isRequired
	    },
	    enumerable: true
	  }]);

	  var _MarkerClustererCreator = MarkerClustererCreator;
	  MarkerClustererCreator = (0, _utilsComponentLifecycleDecorator2['default'])({
	    registerEvents: registerEvents,
	    instanceMethodName: 'getMarkerClusterer',
	    updaters: markerClustererUpdaters
	  })(MarkerClustererCreator) || MarkerClustererCreator;
	  return MarkerClustererCreator;
	})(_react.Component);

	exports['default'] = MarkerClustererCreator;

/***/ },
/* 56 */
/***/ function(module, exports) {

	// http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = ["click", "clusteringbegin", "clusteringend", "mouseout", "mouseover"];
	module.exports = exports["default"];

/***/ },
/* 57 */
/***/ function(module, exports) {

	/**
	 * @name MarkerClustererPlus for Google Maps V3
	 * @version 2.1.2 [May 28, 2014]
	 * @author Gary Little
	 * @fileoverview
	 * The library creates and manages per-zoom-level clusters for large amounts of markers.
	 * <p>
	 * This is an enhanced V3 implementation of the
	 * <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
	 * >V2 MarkerClusterer</a> by Xiaoxi Wu. It is based on the
	 * <a href="http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclusterer/"
	 * >V3 MarkerClusterer</a> port by Luke Mahe. MarkerClustererPlus was created by Gary Little.
	 * <p>
	 * v2.0 release: MarkerClustererPlus v2.0 is backward compatible with MarkerClusterer v1.0. It
	 *  adds support for the <code>ignoreHidden</code>, <code>title</code>, <code>batchSizeIE</code>,
	 *  and <code>calculator</code> properties as well as support for four more events. It also allows
	 *  greater control over the styling of the text that appears on the cluster marker. The
	 *  documentation has been significantly improved and the overall code has been simplified and
	 *  polished. Very large numbers of markers can now be managed without causing Javascript timeout
	 *  errors on Internet Explorer. Note that the name of the <code>clusterclick</code> event has been
	 *  deprecated. The new name is <code>click</code>, so please change your application code now.
	 */

	/**
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */


	/**
	 * @name ClusterIconStyle
	 * @class This class represents the object for values in the <code>styles</code> array passed
	 *  to the {@link MarkerClusterer} constructor. The element in this array that is used to
	 *  style the cluster icon is determined by calling the <code>calculator</code> function.
	 *
	 * @property {string} url The URL of the cluster icon image file. Required.
	 * @property {number} height The display height (in pixels) of the cluster icon. Required.
	 * @property {number} width The display width (in pixels) of the cluster icon. Required.
	 * @property {Array} [anchorText] The position (in pixels) from the center of the cluster icon to
	 *  where the text label is to be centered and drawn. The format is <code>[yoffset, xoffset]</code>
	 *  where <code>yoffset</code> increases as you go down from center and <code>xoffset</code>
	 *  increases to the right of center. The default is <code>[0, 0]</code>.
	 * @property {Array} [anchorIcon] The anchor position (in pixels) of the cluster icon. This is the
	 *  spot on the cluster icon that is to be aligned with the cluster position. The format is
	 *  <code>[yoffset, xoffset]</code> where <code>yoffset</code> increases as you go down and
	 *  <code>xoffset</code> increases to the right of the top-left corner of the icon. The default
	 *  anchor position is the center of the cluster icon.
	 * @property {string} [textColor="black"] The color of the label text shown on the
	 *  cluster icon.
	 * @property {number} [textSize=11] The size (in pixels) of the label text shown on the
	 *  cluster icon.
	 * @property {string} [textDecoration="none"] The value of the CSS <code>text-decoration</code>
	 *  property for the label text shown on the cluster icon.
	 * @property {string} [fontWeight="bold"] The value of the CSS <code>font-weight</code>
	 *  property for the label text shown on the cluster icon.
	 * @property {string} [fontStyle="normal"] The value of the CSS <code>font-style</code>
	 *  property for the label text shown on the cluster icon.
	 * @property {string} [fontFamily="Arial,sans-serif"] The value of the CSS <code>font-family</code>
	 *  property for the label text shown on the cluster icon.
	 * @property {string} [backgroundPosition="0 0"] The position of the cluster icon image
	 *  within the image defined by <code>url</code>. The format is <code>"xpos ypos"</code>
	 *  (the same format as for the CSS <code>background-position</code> property). You must set
	 *  this property appropriately when the image defined by <code>url</code> represents a sprite
	 *  containing multiple images. Note that the position <i>must</i> be specified in px units.
	 */
	/**
	 * @name ClusterIconInfo
	 * @class This class is an object containing general information about a cluster icon. This is
	 *  the object that a <code>calculator</code> function returns.
	 *
	 * @property {string} text The text of the label to be shown on the cluster icon.
	 * @property {number} index The index plus 1 of the element in the <code>styles</code>
	 *  array to be used to style the cluster icon.
	 * @property {string} title The tooltip to display when the mouse moves over the cluster icon.
	 *  If this value is <code>undefined</code> or <code>""</code>, <code>title</code> is set to the
	 *  value of the <code>title</code> property passed to the MarkerClusterer.
	 */
	/**
	 * A cluster icon.
	 *
	 * @constructor
	 * @extends google.maps.OverlayView
	 * @param {Cluster} cluster The cluster with which the icon is to be associated.
	 * @param {Array} [styles] An array of {@link ClusterIconStyle} defining the cluster icons
	 *  to use for various cluster sizes.
	 * @private
	 */
	function ClusterIcon(cluster, styles) {
	  cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);

	  this.cluster_ = cluster;
	  this.className_ = cluster.getMarkerClusterer().getClusterClass();
	  this.styles_ = styles;
	  this.center_ = null;
	  this.div_ = null;
	  this.sums_ = null;
	  this.visible_ = false;

	  this.setMap(cluster.getMap()); // Note: this causes onAdd to be called
	}


	/**
	 * Adds the icon to the DOM.
	 */
	ClusterIcon.prototype.onAdd = function () {
	  var cClusterIcon = this;
	  var cMouseDownInCluster;
	  var cDraggingMapByCluster;

	  this.div_ = document.createElement("div");
	  this.div_.className = this.className_;
	  if (this.visible_) {
	    this.show();
	  }

	  this.getPanes().overlayMouseTarget.appendChild(this.div_);

	  // Fix for Issue 157
	  this.boundsChangedListener_ = google.maps.event.addListener(this.getMap(), "bounds_changed", function () {
	    cDraggingMapByCluster = cMouseDownInCluster;
	  });

	  google.maps.event.addDomListener(this.div_, "mousedown", function () {
	    cMouseDownInCluster = true;
	    cDraggingMapByCluster = false;
	  });

	  google.maps.event.addDomListener(this.div_, "click", function (e) {
	    cMouseDownInCluster = false;
	    if (!cDraggingMapByCluster) {
	      var theBounds;
	      var mz;
	      var mc = cClusterIcon.cluster_.getMarkerClusterer();
	      /**
	       * This event is fired when a cluster marker is clicked.
	       * @name MarkerClusterer#click
	       * @param {Cluster} c The cluster that was clicked.
	       * @event
	       */
	      google.maps.event.trigger(mc, "click", cClusterIcon.cluster_);
	      google.maps.event.trigger(mc, "clusterclick", cClusterIcon.cluster_); // deprecated name

	      // The default click handler follows. Disable it by setting
	      // the zoomOnClick property to false.
	      if (mc.getZoomOnClick()) {
	        // Zoom into the cluster.
	        mz = mc.getMaxZoom();
	        theBounds = cClusterIcon.cluster_.getBounds();
	        mc.getMap().fitBounds(theBounds);
	        // There is a fix for Issue 170 here:
	        setTimeout(function () {
	          mc.getMap().fitBounds(theBounds);
	          // Don't zoom beyond the max zoom level
	          if (mz !== null && (mc.getMap().getZoom() > mz)) {
	            mc.getMap().setZoom(mz + 1);
	          }
	        }, 100);
	      }

	      // Prevent event propagation to the map:
	      e.cancelBubble = true;
	      if (e.stopPropagation) {
	        e.stopPropagation();
	      }
	    }
	  });

	  google.maps.event.addDomListener(this.div_, "mouseover", function () {
	    var mc = cClusterIcon.cluster_.getMarkerClusterer();
	    /**
	     * This event is fired when the mouse moves over a cluster marker.
	     * @name MarkerClusterer#mouseover
	     * @param {Cluster} c The cluster that the mouse moved over.
	     * @event
	     */
	    google.maps.event.trigger(mc, "mouseover", cClusterIcon.cluster_);
	  });

	  google.maps.event.addDomListener(this.div_, "mouseout", function () {
	    var mc = cClusterIcon.cluster_.getMarkerClusterer();
	    /**
	     * This event is fired when the mouse moves out of a cluster marker.
	     * @name MarkerClusterer#mouseout
	     * @param {Cluster} c The cluster that the mouse moved out of.
	     * @event
	     */
	    google.maps.event.trigger(mc, "mouseout", cClusterIcon.cluster_);
	  });
	};


	/**
	 * Removes the icon from the DOM.
	 */
	ClusterIcon.prototype.onRemove = function () {
	  if (this.div_ && this.div_.parentNode) {
	    this.hide();
	    google.maps.event.removeListener(this.boundsChangedListener_);
	    google.maps.event.clearInstanceListeners(this.div_);
	    this.div_.parentNode.removeChild(this.div_);
	    this.div_ = null;
	  }
	};


	/**
	 * Draws the icon.
	 */
	ClusterIcon.prototype.draw = function () {
	  if (this.visible_) {
	    var pos = this.getPosFromLatLng_(this.center_);
	    this.div_.style.top = pos.y + "px";
	    this.div_.style.left = pos.x + "px";
	  }
	};


	/**
	 * Hides the icon.
	 */
	ClusterIcon.prototype.hide = function () {
	  if (this.div_) {
	    this.div_.style.display = "none";
	  }
	  this.visible_ = false;
	};


	/**
	 * Positions and shows the icon.
	 */
	ClusterIcon.prototype.show = function () {
	  if (this.div_) {
	    var img = "";
	    // NOTE: values must be specified in px units
	    var bp = this.backgroundPosition_.split(" ");
	    var spriteH = parseInt(bp[0].replace(/^\s+|\s+$/g, ""), 10);
	    var spriteV = parseInt(bp[1].replace(/^\s+|\s+$/g, ""), 10);
	    var pos = this.getPosFromLatLng_(this.center_);
	    this.div_.style.cssText = this.createCss(pos);
	    img = "<img src='" + this.url_ + "' style='position: absolute; top: " + spriteV + "px; left: " + spriteH + "px; ";
	    if (!this.cluster_.getMarkerClusterer().enableRetinaIcons_) {
	      img += "clip: rect(" + (-1 * spriteV) + "px, " + ((-1 * spriteH) + this.width_) + "px, " +
	          ((-1 * spriteV) + this.height_) + "px, " + (-1 * spriteH) + "px);";
	    }
	    img += "'>";
	    this.div_.innerHTML = img + "<div style='" +
	        "position: absolute;" +
	        "top: " + this.anchorText_[0] + "px;" +
	        "left: " + this.anchorText_[1] + "px;" +
	        "color: " + this.textColor_ + ";" +
	        "font-size: " + this.textSize_ + "px;" +
	        "font-family: " + this.fontFamily_ + ";" +
	        "font-weight: " + this.fontWeight_ + ";" +
	        "font-style: " + this.fontStyle_ + ";" +
	        "text-decoration: " + this.textDecoration_ + ";" +
	        "text-align: center;" +
	        "width: " + this.width_ + "px;" +
	        "line-height:" + this.height_ + "px;" +
	        "'>" + this.sums_.text + "</div>";
	    if (typeof this.sums_.title === "undefined" || this.sums_.title === "") {
	      this.div_.title = this.cluster_.getMarkerClusterer().getTitle();
	    } else {
	      this.div_.title = this.sums_.title;
	    }
	    this.div_.style.display = "";
	  }
	  this.visible_ = true;
	};


	/**
	 * Sets the icon styles to the appropriate element in the styles array.
	 *
	 * @param {ClusterIconInfo} sums The icon label text and styles index.
	 */
	ClusterIcon.prototype.useStyle = function (sums) {
	  this.sums_ = sums;
	  var index = Math.max(0, sums.index - 1);
	  index = Math.min(this.styles_.length - 1, index);
	  var style = this.styles_[index];
	  this.url_ = style.url;
	  this.height_ = style.height;
	  this.width_ = style.width;
	  this.anchorText_ = style.anchorText || [0, 0];
	  this.anchorIcon_ = style.anchorIcon || [parseInt(this.height_ / 2, 10), parseInt(this.width_ / 2, 10)];
	  this.textColor_ = style.textColor || "black";
	  this.textSize_ = style.textSize || 11;
	  this.textDecoration_ = style.textDecoration || "none";
	  this.fontWeight_ = style.fontWeight || "bold";
	  this.fontStyle_ = style.fontStyle || "normal";
	  this.fontFamily_ = style.fontFamily || "Arial,sans-serif";
	  this.backgroundPosition_ = style.backgroundPosition || "0 0";
	};


	/**
	 * Sets the position at which to center the icon.
	 *
	 * @param {google.maps.LatLng} center The latlng to set as the center.
	 */
	ClusterIcon.prototype.setCenter = function (center) {
	  this.center_ = center;
	};


	/**
	 * Creates the cssText style parameter based on the position of the icon.
	 *
	 * @param {google.maps.Point} pos The position of the icon.
	 * @return {string} The CSS style text.
	 */
	ClusterIcon.prototype.createCss = function (pos) {
	  var style = [];
	  style.push("cursor: pointer;");
	  style.push("position: absolute; top: " + pos.y + "px; left: " + pos.x + "px;");
	  style.push("width: " + this.width_ + "px; height: " + this.height_ + "px;");
	  return style.join("");
	};


	/**
	 * Returns the position at which to place the DIV depending on the latlng.
	 *
	 * @param {google.maps.LatLng} latlng The position in latlng.
	 * @return {google.maps.Point} The position in pixels.
	 */
	ClusterIcon.prototype.getPosFromLatLng_ = function (latlng) {
	  var pos = this.getProjection().fromLatLngToDivPixel(latlng);
	  pos.x -= this.anchorIcon_[1];
	  pos.y -= this.anchorIcon_[0];
	  pos.x = parseInt(pos.x, 10);
	  pos.y = parseInt(pos.y, 10);
	  return pos;
	};


	/**
	 * Creates a single cluster that manages a group of proximate markers.
	 *  Used internally, do not call this constructor directly.
	 * @constructor
	 * @param {MarkerClusterer} mc The <code>MarkerClusterer</code> object with which this
	 *  cluster is associated.
	 */
	function Cluster(mc) {
	  this.markerClusterer_ = mc;
	  this.map_ = mc.getMap();
	  this.gridSize_ = mc.getGridSize();
	  this.minClusterSize_ = mc.getMinimumClusterSize();
	  this.averageCenter_ = mc.getAverageCenter();
	  this.markers_ = [];
	  this.center_ = null;
	  this.bounds_ = null;
	  this.clusterIcon_ = new ClusterIcon(this, mc.getStyles());
	}


	/**
	 * Returns the number of markers managed by the cluster. You can call this from
	 * a <code>click</code>, <code>mouseover</code>, or <code>mouseout</code> event handler
	 * for the <code>MarkerClusterer</code> object.
	 *
	 * @return {number} The number of markers in the cluster.
	 */
	Cluster.prototype.getSize = function () {
	  return this.markers_.length;
	};


	/**
	 * Returns the array of markers managed by the cluster. You can call this from
	 * a <code>click</code>, <code>mouseover</code>, or <code>mouseout</code> event handler
	 * for the <code>MarkerClusterer</code> object.
	 *
	 * @return {Array} The array of markers in the cluster.
	 */
	Cluster.prototype.getMarkers = function () {
	  return this.markers_;
	};


	/**
	 * Returns the center of the cluster. You can call this from
	 * a <code>click</code>, <code>mouseover</code>, or <code>mouseout</code> event handler
	 * for the <code>MarkerClusterer</code> object.
	 *
	 * @return {google.maps.LatLng} The center of the cluster.
	 */
	Cluster.prototype.getCenter = function () {
	  return this.center_;
	};


	/**
	 * Returns the map with which the cluster is associated.
	 *
	 * @return {google.maps.Map} The map.
	 * @ignore
	 */
	Cluster.prototype.getMap = function () {
	  return this.map_;
	};


	/**
	 * Returns the <code>MarkerClusterer</code> object with which the cluster is associated.
	 *
	 * @return {MarkerClusterer} The associated marker clusterer.
	 * @ignore
	 */
	Cluster.prototype.getMarkerClusterer = function () {
	  return this.markerClusterer_;
	};


	/**
	 * Returns the bounds of the cluster.
	 *
	 * @return {google.maps.LatLngBounds} the cluster bounds.
	 * @ignore
	 */
	Cluster.prototype.getBounds = function () {
	  var i;
	  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
	  var markers = this.getMarkers();
	  for (i = 0; i < markers.length; i++) {
	    bounds.extend(markers[i].getPosition());
	  }
	  return bounds;
	};


	/**
	 * Removes the cluster from the map.
	 *
	 * @ignore
	 */
	Cluster.prototype.remove = function () {
	  this.clusterIcon_.setMap(null);
	  this.markers_ = [];
	  delete this.markers_;
	};


	/**
	 * Adds a marker to the cluster.
	 *
	 * @param {google.maps.Marker} marker The marker to be added.
	 * @return {boolean} True if the marker was added.
	 * @ignore
	 */
	Cluster.prototype.addMarker = function (marker) {
	  var i;
	  var mCount;
	  var mz;

	  if (this.isMarkerAlreadyAdded_(marker)) {
	    return false;
	  }

	  if (!this.center_) {
	    this.center_ = marker.getPosition();
	    this.calculateBounds_();
	  } else {
	    if (this.averageCenter_) {
	      var l = this.markers_.length + 1;
	      var lat = (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;
	      var lng = (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;
	      this.center_ = new google.maps.LatLng(lat, lng);
	      this.calculateBounds_();
	    }
	  }

	  marker.isAdded = true;
	  this.markers_.push(marker);

	  mCount = this.markers_.length;
	  mz = this.markerClusterer_.getMaxZoom();
	  if (mz !== null && this.map_.getZoom() > mz) {
	    // Zoomed in past max zoom, so show the marker.
	    if (marker.getMap() !== this.map_) {
	      marker.setMap(this.map_);
	    }
	  } else if (mCount < this.minClusterSize_) {
	    // Min cluster size not reached so show the marker.
	    if (marker.getMap() !== this.map_) {
	      marker.setMap(this.map_);
	    }
	  } else if (mCount === this.minClusterSize_) {
	    // Hide the markers that were showing.
	    for (i = 0; i < mCount; i++) {
	      this.markers_[i].setMap(null);
	    }
	  } else {
	    marker.setMap(null);
	  }

	  this.updateIcon_();
	  return true;
	};


	/**
	 * Determines if a marker lies within the cluster's bounds.
	 *
	 * @param {google.maps.Marker} marker The marker to check.
	 * @return {boolean} True if the marker lies in the bounds.
	 * @ignore
	 */
	Cluster.prototype.isMarkerInClusterBounds = function (marker) {
	  return this.bounds_.contains(marker.getPosition());
	};


	/**
	 * Calculates the extended bounds of the cluster with the grid.
	 */
	Cluster.prototype.calculateBounds_ = function () {
	  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
	  this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
	};


	/**
	 * Updates the cluster icon.
	 */
	Cluster.prototype.updateIcon_ = function () {
	  var mCount = this.markers_.length;
	  var mz = this.markerClusterer_.getMaxZoom();

	  if (mz !== null && this.map_.getZoom() > mz) {
	    this.clusterIcon_.hide();
	    return;
	  }

	  if (mCount < this.minClusterSize_) {
	    // Min cluster size not yet reached.
	    this.clusterIcon_.hide();
	    return;
	  }

	  var numStyles = this.markerClusterer_.getStyles().length;
	  var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
	  this.clusterIcon_.setCenter(this.center_);
	  this.clusterIcon_.useStyle(sums);
	  this.clusterIcon_.show();
	};


	/**
	 * Determines if a marker has already been added to the cluster.
	 *
	 * @param {google.maps.Marker} marker The marker to check.
	 * @return {boolean} True if the marker has already been added.
	 */
	Cluster.prototype.isMarkerAlreadyAdded_ = function (marker) {
	  var i;
	  if (this.markers_.indexOf) {
	    return this.markers_.indexOf(marker) !== -1;
	  } else {
	    for (i = 0; i < this.markers_.length; i++) {
	      if (marker === this.markers_[i]) {
	        return true;
	      }
	    }
	  }
	  return false;
	};


	/**
	 * @name MarkerClustererOptions
	 * @class This class represents the optional parameter passed to
	 *  the {@link MarkerClusterer} constructor.
	 * @property {number} [gridSize=60] The grid size of a cluster in pixels. The grid is a square.
	 * @property {number} [maxZoom=null] The maximum zoom level at which clustering is enabled or
	 *  <code>null</code> if clustering is to be enabled at all zoom levels.
	 * @property {boolean} [zoomOnClick=true] Whether to zoom the map when a cluster marker is
	 *  clicked. You may want to set this to <code>false</code> if you have installed a handler
	 *  for the <code>click</code> event and it deals with zooming on its own.
	 * @property {boolean} [averageCenter=false] Whether the position of a cluster marker should be
	 *  the average position of all markers in the cluster. If set to <code>false</code>, the
	 *  cluster marker is positioned at the location of the first marker added to the cluster.
	 * @property {number} [minimumClusterSize=2] The minimum number of markers needed in a cluster
	 *  before the markers are hidden and a cluster marker appears.
	 * @property {boolean} [ignoreHidden=false] Whether to ignore hidden markers in clusters. You
	 *  may want to set this to <code>true</code> to ensure that hidden markers are not included
	 *  in the marker count that appears on a cluster marker (this count is the value of the
	 *  <code>text</code> property of the result returned by the default <code>calculator</code>).
	 *  If set to <code>true</code> and you change the visibility of a marker being clustered, be
	 *  sure to also call <code>MarkerClusterer.repaint()</code>.
	 * @property {string} [title=""] The tooltip to display when the mouse moves over a cluster
	 *  marker. (Alternatively, you can use a custom <code>calculator</code> function to specify a
	 *  different tooltip for each cluster marker.)
	 * @property {function} [calculator=MarkerClusterer.CALCULATOR] The function used to determine
	 *  the text to be displayed on a cluster marker and the index indicating which style to use
	 *  for the cluster marker. The input parameters for the function are (1) the array of markers
	 *  represented by a cluster marker and (2) the number of cluster icon styles. It returns a
	 *  {@link ClusterIconInfo} object. The default <code>calculator</code> returns a
	 *  <code>text</code> property which is the number of markers in the cluster and an
	 *  <code>index</code> property which is one higher than the lowest integer such that
	 *  <code>10^i</code> exceeds the number of markers in the cluster, or the size of the styles
	 *  array, whichever is less. The <code>styles</code> array element used has an index of
	 *  <code>index</code> minus 1. For example, the default <code>calculator</code> returns a
	 *  <code>text</code> value of <code>"125"</code> and an <code>index</code> of <code>3</code>
	 *  for a cluster icon representing 125 markers so the element used in the <code>styles</code>
	 *  array is <code>2</code>. A <code>calculator</code> may also return a <code>title</code>
	 *  property that contains the text of the tooltip to be used for the cluster marker. If
	 *   <code>title</code> is not defined, the tooltip is set to the value of the <code>title</code>
	 *   property for the MarkerClusterer.
	 * @property {string} [clusterClass="cluster"] The name of the CSS class defining general styles
	 *  for the cluster markers. Use this class to define CSS styles that are not set up by the code
	 *  that processes the <code>styles</code> array.
	 * @property {Array} [styles] An array of {@link ClusterIconStyle} elements defining the styles
	 *  of the cluster markers to be used. The element to be used to style a given cluster marker
	 *  is determined by the function defined by the <code>calculator</code> property.
	 *  The default is an array of {@link ClusterIconStyle} elements whose properties are derived
	 *  from the values for <code>imagePath</code>, <code>imageExtension</code>, and
	 *  <code>imageSizes</code>.
	 * @property {boolean} [enableRetinaIcons=false] Whether to allow the use of cluster icons that
	 * have sizes that are some multiple (typically double) of their actual display size. Icons such
	 * as these look better when viewed on high-resolution monitors such as Apple's Retina displays.
	 * Note: if this property is <code>true</code>, sprites cannot be used as cluster icons.
	 * @property {number} [batchSize=MarkerClusterer.BATCH_SIZE] Set this property to the
	 *  number of markers to be processed in a single batch when using a browser other than
	 *  Internet Explorer (for Internet Explorer, use the batchSizeIE property instead).
	 * @property {number} [batchSizeIE=MarkerClusterer.BATCH_SIZE_IE] When Internet Explorer is
	 *  being used, markers are processed in several batches with a small delay inserted between
	 *  each batch in an attempt to avoid Javascript timeout errors. Set this property to the
	 *  number of markers to be processed in a single batch; select as high a number as you can
	 *  without causing a timeout error in the browser. This number might need to be as low as 100
	 *  if 15,000 markers are being managed, for example.
	 * @property {string} [imagePath=MarkerClusterer.IMAGE_PATH]
	 *  The full URL of the root name of the group of image files to use for cluster icons.
	 *  The complete file name is of the form <code>imagePath</code>n.<code>imageExtension</code>
	 *  where n is the image file number (1, 2, etc.).
	 * @property {string} [imageExtension=MarkerClusterer.IMAGE_EXTENSION]
	 *  The extension name for the cluster icon image files (e.g., <code>"png"</code> or
	 *  <code>"jpg"</code>).
	 * @property {Array} [imageSizes=MarkerClusterer.IMAGE_SIZES]
	 *  An array of numbers containing the widths of the group of
	 *  <code>imagePath</code>n.<code>imageExtension</code> image files.
	 *  (The images are assumed to be square.)
	 */
	/**
	 * Creates a MarkerClusterer object with the options specified in {@link MarkerClustererOptions}.
	 * @constructor
	 * @extends google.maps.OverlayView
	 * @param {google.maps.Map} map The Google map to attach to.
	 * @param {Array.<google.maps.Marker>} [opt_markers] The markers to be added to the cluster.
	 * @param {MarkerClustererOptions} [opt_options] The optional parameters.
	 */
	function MarkerClusterer(map, opt_markers, opt_options) {
	  // MarkerClusterer implements google.maps.OverlayView interface. We use the
	  // extend function to extend MarkerClusterer with google.maps.OverlayView
	  // because it might not always be available when the code is defined so we
	  // look for it at the last possible moment. If it doesn't exist now then
	  // there is no point going ahead :)
	  this.extend(MarkerClusterer, google.maps.OverlayView);

	  opt_markers = opt_markers || [];
	  opt_options = opt_options || {};

	  this.markers_ = [];
	  this.clusters_ = [];
	  this.listeners_ = [];
	  this.activeMap_ = null;
	  this.ready_ = false;

	  this.gridSize_ = opt_options.gridSize || 60;
	  this.minClusterSize_ = opt_options.minimumClusterSize || 2;
	  this.maxZoom_ = opt_options.maxZoom || null;
	  this.styles_ = opt_options.styles || [];
	  this.title_ = opt_options.title || "";
	  this.zoomOnClick_ = true;
	  if (opt_options.zoomOnClick !== undefined) {
	    this.zoomOnClick_ = opt_options.zoomOnClick;
	  }
	  this.averageCenter_ = false;
	  if (opt_options.averageCenter !== undefined) {
	    this.averageCenter_ = opt_options.averageCenter;
	  }
	  this.ignoreHidden_ = false;
	  if (opt_options.ignoreHidden !== undefined) {
	    this.ignoreHidden_ = opt_options.ignoreHidden;
	  }
	  this.enableRetinaIcons_ = false;
	  if (opt_options.enableRetinaIcons !== undefined) {
	    this.enableRetinaIcons_ = opt_options.enableRetinaIcons;
	  }
	  this.imagePath_ = opt_options.imagePath || MarkerClusterer.IMAGE_PATH;
	  this.imageExtension_ = opt_options.imageExtension || MarkerClusterer.IMAGE_EXTENSION;
	  this.imageSizes_ = opt_options.imageSizes || MarkerClusterer.IMAGE_SIZES;
	  this.calculator_ = opt_options.calculator || MarkerClusterer.CALCULATOR;
	  this.batchSize_ = opt_options.batchSize || MarkerClusterer.BATCH_SIZE;
	  this.batchSizeIE_ = opt_options.batchSizeIE || MarkerClusterer.BATCH_SIZE_IE;
	  this.clusterClass_ = opt_options.clusterClass || "cluster";

	  if (navigator.userAgent.toLowerCase().indexOf("msie") !== -1) {
	    // Try to avoid IE timeout when processing a huge number of markers:
	    this.batchSize_ = this.batchSizeIE_;
	  }

	  this.setupStyles_();

	  this.addMarkers(opt_markers, true);
	  this.setMap(map); // Note: this causes onAdd to be called
	}


	/**
	 * Implementation of the onAdd interface method.
	 * @ignore
	 */
	MarkerClusterer.prototype.onAdd = function () {
	  var cMarkerClusterer = this;

	  this.activeMap_ = this.getMap();
	  this.ready_ = true;

	  this.repaint();

	  // Add the map event listeners
	  this.listeners_ = [
	    google.maps.event.addListener(this.getMap(), "zoom_changed", function () {
	      cMarkerClusterer.resetViewport_(false);
	      // Workaround for this Google bug: when map is at level 0 and "-" of
	      // zoom slider is clicked, a "zoom_changed" event is fired even though
	      // the map doesn't zoom out any further. In this situation, no "idle"
	      // event is triggered so the cluster markers that have been removed
	      // do not get redrawn. Same goes for a zoom in at maxZoom.
	      if (this.getZoom() === (this.get("minZoom") || 0) || this.getZoom() === this.get("maxZoom")) {
	        google.maps.event.trigger(this, "idle");
	      }
	    }),
	    google.maps.event.addListener(this.getMap(), "idle", function () {
	      cMarkerClusterer.redraw_();
	    })
	  ];
	};


	/**
	 * Implementation of the onRemove interface method.
	 * Removes map event listeners and all cluster icons from the DOM.
	 * All managed markers are also put back on the map.
	 * @ignore
	 */
	MarkerClusterer.prototype.onRemove = function () {
	  var i;

	  // Put all the managed markers back on the map:
	  for (i = 0; i < this.markers_.length; i++) {
	    if (this.markers_[i].getMap() !== this.activeMap_) {
	      this.markers_[i].setMap(this.activeMap_);
	    }
	  }

	  // Remove all clusters:
	  for (i = 0; i < this.clusters_.length; i++) {
	    this.clusters_[i].remove();
	  }
	  this.clusters_ = [];

	  // Remove map event listeners:
	  for (i = 0; i < this.listeners_.length; i++) {
	    google.maps.event.removeListener(this.listeners_[i]);
	  }
	  this.listeners_ = [];

	  this.activeMap_ = null;
	  this.ready_ = false;
	};


	/**
	 * Implementation of the draw interface method.
	 * @ignore
	 */
	MarkerClusterer.prototype.draw = function () {};


	/**
	 * Sets up the styles object.
	 */
	MarkerClusterer.prototype.setupStyles_ = function () {
	  var i, size;
	  if (this.styles_.length > 0) {
	    return;
	  }

	  for (i = 0; i < this.imageSizes_.length; i++) {
	    size = this.imageSizes_[i];
	    this.styles_.push({
	      url: this.imagePath_ + (i + 1) + "." + this.imageExtension_,
	      height: size,
	      width: size
	    });
	  }
	};


	/**
	 *  Fits the map to the bounds of the markers managed by the clusterer.
	 */
	MarkerClusterer.prototype.fitMapToMarkers = function () {
	  var i;
	  var markers = this.getMarkers();
	  var bounds = new google.maps.LatLngBounds();
	  for (i = 0; i < markers.length; i++) {
	    bounds.extend(markers[i].getPosition());
	  }

	  this.getMap().fitBounds(bounds);
	};


	/**
	 * Returns the value of the <code>gridSize</code> property.
	 *
	 * @return {number} The grid size.
	 */
	MarkerClusterer.prototype.getGridSize = function () {
	  return this.gridSize_;
	};


	/**
	 * Sets the value of the <code>gridSize</code> property.
	 *
	 * @param {number} gridSize The grid size.
	 */
	MarkerClusterer.prototype.setGridSize = function (gridSize) {
	  this.gridSize_ = gridSize;
	};


	/**
	 * Returns the value of the <code>minimumClusterSize</code> property.
	 *
	 * @return {number} The minimum cluster size.
	 */
	MarkerClusterer.prototype.getMinimumClusterSize = function () {
	  return this.minClusterSize_;
	};

	/**
	 * Sets the value of the <code>minimumClusterSize</code> property.
	 *
	 * @param {number} minimumClusterSize The minimum cluster size.
	 */
	MarkerClusterer.prototype.setMinimumClusterSize = function (minimumClusterSize) {
	  this.minClusterSize_ = minimumClusterSize;
	};


	/**
	 *  Returns the value of the <code>maxZoom</code> property.
	 *
	 *  @return {number} The maximum zoom level.
	 */
	MarkerClusterer.prototype.getMaxZoom = function () {
	  return this.maxZoom_;
	};


	/**
	 *  Sets the value of the <code>maxZoom</code> property.
	 *
	 *  @param {number} maxZoom The maximum zoom level.
	 */
	MarkerClusterer.prototype.setMaxZoom = function (maxZoom) {
	  this.maxZoom_ = maxZoom;
	};


	/**
	 *  Returns the value of the <code>styles</code> property.
	 *
	 *  @return {Array} The array of styles defining the cluster markers to be used.
	 */
	MarkerClusterer.prototype.getStyles = function () {
	  return this.styles_;
	};


	/**
	 *  Sets the value of the <code>styles</code> property.
	 *
	 *  @param {Array.<ClusterIconStyle>} styles The array of styles to use.
	 */
	MarkerClusterer.prototype.setStyles = function (styles) {
	  this.styles_ = styles;
	};


	/**
	 * Returns the value of the <code>title</code> property.
	 *
	 * @return {string} The content of the title text.
	 */
	MarkerClusterer.prototype.getTitle = function () {
	  return this.title_;
	};


	/**
	 *  Sets the value of the <code>title</code> property.
	 *
	 *  @param {string} title The value of the title property.
	 */
	MarkerClusterer.prototype.setTitle = function (title) {
	  this.title_ = title;
	};


	/**
	 * Returns the value of the <code>zoomOnClick</code> property.
	 *
	 * @return {boolean} True if zoomOnClick property is set.
	 */
	MarkerClusterer.prototype.getZoomOnClick = function () {
	  return this.zoomOnClick_;
	};


	/**
	 *  Sets the value of the <code>zoomOnClick</code> property.
	 *
	 *  @param {boolean} zoomOnClick The value of the zoomOnClick property.
	 */
	MarkerClusterer.prototype.setZoomOnClick = function (zoomOnClick) {
	  this.zoomOnClick_ = zoomOnClick;
	};


	/**
	 * Returns the value of the <code>averageCenter</code> property.
	 *
	 * @return {boolean} True if averageCenter property is set.
	 */
	MarkerClusterer.prototype.getAverageCenter = function () {
	  return this.averageCenter_;
	};


	/**
	 *  Sets the value of the <code>averageCenter</code> property.
	 *
	 *  @param {boolean} averageCenter The value of the averageCenter property.
	 */
	MarkerClusterer.prototype.setAverageCenter = function (averageCenter) {
	  this.averageCenter_ = averageCenter;
	};


	/**
	 * Returns the value of the <code>ignoreHidden</code> property.
	 *
	 * @return {boolean} True if ignoreHidden property is set.
	 */
	MarkerClusterer.prototype.getIgnoreHidden = function () {
	  return this.ignoreHidden_;
	};


	/**
	 *  Sets the value of the <code>ignoreHidden</code> property.
	 *
	 *  @param {boolean} ignoreHidden The value of the ignoreHidden property.
	 */
	MarkerClusterer.prototype.setIgnoreHidden = function (ignoreHidden) {
	  this.ignoreHidden_ = ignoreHidden;
	};


	/**
	 * Returns the value of the <code>enableRetinaIcons</code> property.
	 *
	 * @return {boolean} True if enableRetinaIcons property is set.
	 */
	MarkerClusterer.prototype.getEnableRetinaIcons = function () {
	  return this.enableRetinaIcons_;
	};


	/**
	 *  Sets the value of the <code>enableRetinaIcons</code> property.
	 *
	 *  @param {boolean} enableRetinaIcons The value of the enableRetinaIcons property.
	 */
	MarkerClusterer.prototype.setEnableRetinaIcons = function (enableRetinaIcons) {
	  this.enableRetinaIcons_ = enableRetinaIcons;
	};


	/**
	 * Returns the value of the <code>imageExtension</code> property.
	 *
	 * @return {string} The value of the imageExtension property.
	 */
	MarkerClusterer.prototype.getImageExtension = function () {
	  return this.imageExtension_;
	};


	/**
	 *  Sets the value of the <code>imageExtension</code> property.
	 *
	 *  @param {string} imageExtension The value of the imageExtension property.
	 */
	MarkerClusterer.prototype.setImageExtension = function (imageExtension) {
	  this.imageExtension_ = imageExtension;
	};


	/**
	 * Returns the value of the <code>imagePath</code> property.
	 *
	 * @return {string} The value of the imagePath property.
	 */
	MarkerClusterer.prototype.getImagePath = function () {
	  return this.imagePath_;
	};


	/**
	 *  Sets the value of the <code>imagePath</code> property.
	 *
	 *  @param {string} imagePath The value of the imagePath property.
	 */
	MarkerClusterer.prototype.setImagePath = function (imagePath) {
	  this.imagePath_ = imagePath;
	};


	/**
	 * Returns the value of the <code>imageSizes</code> property.
	 *
	 * @return {Array} The value of the imageSizes property.
	 */
	MarkerClusterer.prototype.getImageSizes = function () {
	  return this.imageSizes_;
	};


	/**
	 *  Sets the value of the <code>imageSizes</code> property.
	 *
	 *  @param {Array} imageSizes The value of the imageSizes property.
	 */
	MarkerClusterer.prototype.setImageSizes = function (imageSizes) {
	  this.imageSizes_ = imageSizes;
	};


	/**
	 * Returns the value of the <code>calculator</code> property.
	 *
	 * @return {function} the value of the calculator property.
	 */
	MarkerClusterer.prototype.getCalculator = function () {
	  return this.calculator_;
	};


	/**
	 * Sets the value of the <code>calculator</code> property.
	 *
	 * @param {function(Array.<google.maps.Marker>, number)} calculator The value
	 *  of the calculator property.
	 */
	MarkerClusterer.prototype.setCalculator = function (calculator) {
	  this.calculator_ = calculator;
	};


	/**
	 * Returns the value of the <code>batchSizeIE</code> property.
	 *
	 * @return {number} the value of the batchSizeIE property.
	 */
	MarkerClusterer.prototype.getBatchSizeIE = function () {
	  return this.batchSizeIE_;
	};


	/**
	 * Sets the value of the <code>batchSizeIE</code> property.
	 *
	 *  @param {number} batchSizeIE The value of the batchSizeIE property.
	 */
	MarkerClusterer.prototype.setBatchSizeIE = function (batchSizeIE) {
	  this.batchSizeIE_ = batchSizeIE;
	};


	/**
	 * Returns the value of the <code>clusterClass</code> property.
	 *
	 * @return {string} the value of the clusterClass property.
	 */
	MarkerClusterer.prototype.getClusterClass = function () {
	  return this.clusterClass_;
	};


	/**
	 * Sets the value of the <code>clusterClass</code> property.
	 *
	 *  @param {string} clusterClass The value of the clusterClass property.
	 */
	MarkerClusterer.prototype.setClusterClass = function (clusterClass) {
	  this.clusterClass_ = clusterClass;
	};


	/**
	 *  Returns the array of markers managed by the clusterer.
	 *
	 *  @return {Array} The array of markers managed by the clusterer.
	 */
	MarkerClusterer.prototype.getMarkers = function () {
	  return this.markers_;
	};


	/**
	 *  Returns the number of markers managed by the clusterer.
	 *
	 *  @return {number} The number of markers.
	 */
	MarkerClusterer.prototype.getTotalMarkers = function () {
	  return this.markers_.length;
	};


	/**
	 * Returns the current array of clusters formed by the clusterer.
	 *
	 * @return {Array} The array of clusters formed by the clusterer.
	 */
	MarkerClusterer.prototype.getClusters = function () {
	  return this.clusters_;
	};


	/**
	 * Returns the number of clusters formed by the clusterer.
	 *
	 * @return {number} The number of clusters formed by the clusterer.
	 */
	MarkerClusterer.prototype.getTotalClusters = function () {
	  return this.clusters_.length;
	};


	/**
	 * Adds a marker to the clusterer. The clusters are redrawn unless
	 *  <code>opt_nodraw</code> is set to <code>true</code>.
	 *
	 * @param {google.maps.Marker} marker The marker to add.
	 * @param {boolean} [opt_nodraw] Set to <code>true</code> to prevent redrawing.
	 */
	MarkerClusterer.prototype.addMarker = function (marker, opt_nodraw) {
	  this.pushMarkerTo_(marker);
	  if (!opt_nodraw) {
	    this.redraw_();
	  }
	};


	/**
	 * Adds an array of markers to the clusterer. The clusters are redrawn unless
	 *  <code>opt_nodraw</code> is set to <code>true</code>.
	 *
	 * @param {Array.<google.maps.Marker>} markers The markers to add.
	 * @param {boolean} [opt_nodraw] Set to <code>true</code> to prevent redrawing.
	 */
	MarkerClusterer.prototype.addMarkers = function (markers, opt_nodraw) {
	  var key;
	  for (key in markers) {
	    if (markers.hasOwnProperty(key)) {
	      this.pushMarkerTo_(markers[key]);
	    }
	  }  
	  if (!opt_nodraw) {
	    this.redraw_();
	  }
	};


	/**
	 * Pushes a marker to the clusterer.
	 *
	 * @param {google.maps.Marker} marker The marker to add.
	 */
	MarkerClusterer.prototype.pushMarkerTo_ = function (marker) {
	  // If the marker is draggable add a listener so we can update the clusters on the dragend:
	  if (marker.getDraggable()) {
	    var cMarkerClusterer = this;
	    google.maps.event.addListener(marker, "dragend", function () {
	      if (cMarkerClusterer.ready_) {
	        this.isAdded = false;
	        cMarkerClusterer.repaint();
	      }
	    });
	  }
	  marker.isAdded = false;
	  this.markers_.push(marker);
	};


	/**
	 * Removes a marker from the cluster.  The clusters are redrawn unless
	 *  <code>opt_nodraw</code> is set to <code>true</code>. Returns <code>true</code> if the
	 *  marker was removed from the clusterer.
	 *
	 * @param {google.maps.Marker} marker The marker to remove.
	 * @param {boolean} [opt_nodraw] Set to <code>true</code> to prevent redrawing.
	 * @return {boolean} True if the marker was removed from the clusterer.
	 */
	MarkerClusterer.prototype.removeMarker = function (marker, opt_nodraw) {
	  var removed = this.removeMarker_(marker);

	  if (!opt_nodraw && removed) {
	    this.repaint();
	  }

	  return removed;
	};


	/**
	 * Removes an array of markers from the cluster. The clusters are redrawn unless
	 *  <code>opt_nodraw</code> is set to <code>true</code>. Returns <code>true</code> if markers
	 *  were removed from the clusterer.
	 *
	 * @param {Array.<google.maps.Marker>} markers The markers to remove.
	 * @param {boolean} [opt_nodraw] Set to <code>true</code> to prevent redrawing.
	 * @return {boolean} True if markers were removed from the clusterer.
	 */
	MarkerClusterer.prototype.removeMarkers = function (markers, opt_nodraw) {
	  var i, r;
	  var removed = false;

	  for (i = 0; i < markers.length; i++) {
	    r = this.removeMarker_(markers[i]);
	    removed = removed || r;
	  }

	  if (!opt_nodraw && removed) {
	    this.repaint();
	  }

	  return removed;
	};


	/**
	 * Removes a marker and returns true if removed, false if not.
	 *
	 * @param {google.maps.Marker} marker The marker to remove
	 * @return {boolean} Whether the marker was removed or not
	 */
	MarkerClusterer.prototype.removeMarker_ = function (marker) {
	  var i;
	  var index = -1;
	  if (this.markers_.indexOf) {
	    index = this.markers_.indexOf(marker);
	  } else {
	    for (i = 0; i < this.markers_.length; i++) {
	      if (marker === this.markers_[i]) {
	        index = i;
	        break;
	      }
	    }
	  }

	  if (index === -1) {
	    // Marker is not in our list of markers, so do nothing:
	    return false;
	  }

	  marker.setMap(null);
	  this.markers_.splice(index, 1); // Remove the marker from the list of managed markers
	  return true;
	};


	/**
	 * Removes all clusters and markers from the map and also removes all markers
	 *  managed by the clusterer.
	 */
	MarkerClusterer.prototype.clearMarkers = function () {
	  this.resetViewport_(true);
	  this.markers_ = [];
	};


	/**
	 * Recalculates and redraws all the marker clusters from scratch.
	 *  Call this after changing any properties.
	 */
	MarkerClusterer.prototype.repaint = function () {
	  var oldClusters = this.clusters_.slice();
	  this.clusters_ = [];
	  this.resetViewport_(false);
	  this.redraw_();

	  // Remove the old clusters.
	  // Do it in a timeout to prevent blinking effect.
	  setTimeout(function () {
	    var i;
	    for (i = 0; i < oldClusters.length; i++) {
	      oldClusters[i].remove();
	    }
	  }, 0);
	};


	/**
	 * Returns the current bounds extended by the grid size.
	 *
	 * @param {google.maps.LatLngBounds} bounds The bounds to extend.
	 * @return {google.maps.LatLngBounds} The extended bounds.
	 * @ignore
	 */
	MarkerClusterer.prototype.getExtendedBounds = function (bounds) {
	  var projection = this.getProjection();

	  // Turn the bounds into latlng.
	  var tr = new google.maps.LatLng(bounds.getNorthEast().lat(),
	      bounds.getNorthEast().lng());
	  var bl = new google.maps.LatLng(bounds.getSouthWest().lat(),
	      bounds.getSouthWest().lng());

	  // Convert the points to pixels and the extend out by the grid size.
	  var trPix = projection.fromLatLngToDivPixel(tr);
	  trPix.x += this.gridSize_;
	  trPix.y -= this.gridSize_;

	  var blPix = projection.fromLatLngToDivPixel(bl);
	  blPix.x -= this.gridSize_;
	  blPix.y += this.gridSize_;

	  // Convert the pixel points back to LatLng
	  var ne = projection.fromDivPixelToLatLng(trPix);
	  var sw = projection.fromDivPixelToLatLng(blPix);

	  // Extend the bounds to contain the new bounds.
	  bounds.extend(ne);
	  bounds.extend(sw);

	  return bounds;
	};


	/**
	 * Redraws all the clusters.
	 */
	MarkerClusterer.prototype.redraw_ = function () {
	  this.createClusters_(0);
	};


	/**
	 * Removes all clusters from the map. The markers are also removed from the map
	 *  if <code>opt_hide</code> is set to <code>true</code>.
	 *
	 * @param {boolean} [opt_hide] Set to <code>true</code> to also remove the markers
	 *  from the map.
	 */
	MarkerClusterer.prototype.resetViewport_ = function (opt_hide) {
	  var i, marker;
	  // Remove all the clusters
	  for (i = 0; i < this.clusters_.length; i++) {
	    this.clusters_[i].remove();
	  }
	  this.clusters_ = [];

	  // Reset the markers to not be added and to be removed from the map.
	  for (i = 0; i < this.markers_.length; i++) {
	    marker = this.markers_[i];
	    marker.isAdded = false;
	    if (opt_hide) {
	      marker.setMap(null);
	    }
	  }
	};


	/**
	 * Calculates the distance between two latlng locations in km.
	 *
	 * @param {google.maps.LatLng} p1 The first lat lng point.
	 * @param {google.maps.LatLng} p2 The second lat lng point.
	 * @return {number} The distance between the two points in km.
	 * @see http://www.movable-type.co.uk/scripts/latlong.html
	*/
	MarkerClusterer.prototype.distanceBetweenPoints_ = function (p1, p2) {
	  var R = 6371; // Radius of the Earth in km
	  var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
	  var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
	  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	    Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
	    Math.sin(dLon / 2) * Math.sin(dLon / 2);
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	  var d = R * c;
	  return d;
	};


	/**
	 * Determines if a marker is contained in a bounds.
	 *
	 * @param {google.maps.Marker} marker The marker to check.
	 * @param {google.maps.LatLngBounds} bounds The bounds to check against.
	 * @return {boolean} True if the marker is in the bounds.
	 */
	MarkerClusterer.prototype.isMarkerInBounds_ = function (marker, bounds) {
	  return bounds.contains(marker.getPosition());
	};


	/**
	 * Adds a marker to a cluster, or creates a new cluster.
	 *
	 * @param {google.maps.Marker} marker The marker to add.
	 */
	MarkerClusterer.prototype.addToClosestCluster_ = function (marker) {
	  var i, d, cluster, center;
	  var distance = 40000; // Some large number
	  var clusterToAddTo = null;
	  for (i = 0; i < this.clusters_.length; i++) {
	    cluster = this.clusters_[i];
	    center = cluster.getCenter();
	    if (center) {
	      d = this.distanceBetweenPoints_(center, marker.getPosition());
	      if (d < distance) {
	        distance = d;
	        clusterToAddTo = cluster;
	      }
	    }
	  }

	  if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
	    clusterToAddTo.addMarker(marker);
	  } else {
	    cluster = new Cluster(this);
	    cluster.addMarker(marker);
	    this.clusters_.push(cluster);
	  }
	};


	/**
	 * Creates the clusters. This is done in batches to avoid timeout errors
	 *  in some browsers when there is a huge number of markers.
	 *
	 * @param {number} iFirst The index of the first marker in the batch of
	 *  markers to be added to clusters.
	 */
	MarkerClusterer.prototype.createClusters_ = function (iFirst) {
	  var i, marker;
	  var mapBounds;
	  var cMarkerClusterer = this;
	  if (!this.ready_) {
	    return;
	  }

	  // Cancel previous batch processing if we're working on the first batch:
	  if (iFirst === 0) {
	    /**
	     * This event is fired when the <code>MarkerClusterer</code> begins
	     *  clustering markers.
	     * @name MarkerClusterer#clusteringbegin
	     * @param {MarkerClusterer} mc The MarkerClusterer whose markers are being clustered.
	     * @event
	     */
	    google.maps.event.trigger(this, "clusteringbegin", this);

	    if (typeof this.timerRefStatic !== "undefined") {
	      clearTimeout(this.timerRefStatic);
	      delete this.timerRefStatic;
	    }
	  }

	  // Get our current map view bounds.
	  // Create a new bounds object so we don't affect the map.
	  //
	  // See Comments 9 & 11 on Issue 3651 relating to this workaround for a Google Maps bug:
	  if (this.getMap().getZoom() > 3) {
	    mapBounds = new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(),
	      this.getMap().getBounds().getNorthEast());
	  } else {
	    mapBounds = new google.maps.LatLngBounds(new google.maps.LatLng(85.02070771743472, -178.48388434375), new google.maps.LatLng(-85.08136444384544, 178.00048865625));
	  }
	  var bounds = this.getExtendedBounds(mapBounds);

	  var iLast = Math.min(iFirst + this.batchSize_, this.markers_.length);

	  for (i = iFirst; i < iLast; i++) {
	    marker = this.markers_[i];
	    if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
	      if (!this.ignoreHidden_ || (this.ignoreHidden_ && marker.getVisible())) {
	        this.addToClosestCluster_(marker);
	      }
	    }
	  }

	  if (iLast < this.markers_.length) {
	    this.timerRefStatic = setTimeout(function () {
	      cMarkerClusterer.createClusters_(iLast);
	    }, 0);
	  } else {
	    delete this.timerRefStatic;

	    /**
	     * This event is fired when the <code>MarkerClusterer</code> stops
	     *  clustering markers.
	     * @name MarkerClusterer#clusteringend
	     * @param {MarkerClusterer} mc The MarkerClusterer whose markers are being clustered.
	     * @event
	     */
	    google.maps.event.trigger(this, "clusteringend", this);
	  }
	};


	/**
	 * Extends an object's prototype by another's.
	 *
	 * @param {Object} obj1 The object to be extended.
	 * @param {Object} obj2 The object to extend with.
	 * @return {Object} The new extended object.
	 * @ignore
	 */
	MarkerClusterer.prototype.extend = function (obj1, obj2) {
	  return (function (object) {
	    var property;
	    for (property in object.prototype) {
	      this.prototype[property] = object.prototype[property];
	    }
	    return this;
	  }).apply(obj1, [obj2]);
	};


	/**
	 * The default function for determining the label text and style
	 * for a cluster icon.
	 *
	 * @param {Array.<google.maps.Marker>} markers The array of markers represented by the cluster.
	 * @param {number} numStyles The number of marker styles available.
	 * @return {ClusterIconInfo} The information resource for the cluster.
	 * @constant
	 * @ignore
	 */
	MarkerClusterer.CALCULATOR = function (markers, numStyles) {
	  var index = 0;
	  var title = "";
	  var count = markers.length.toString();

	  var dv = count;
	  while (dv !== 0) {
	    dv = parseInt(dv / 10, 10);
	    index++;
	  }

	  index = Math.min(index, numStyles);
	  return {
	    text: count,
	    index: index,
	    title: title
	  };
	};


	/**
	 * The number of markers to process in one batch.
	 *
	 * @type {number}
	 * @constant
	 */
	MarkerClusterer.BATCH_SIZE = 2000;


	/**
	 * The number of markers to process in one batch (IE only).
	 *
	 * @type {number}
	 * @constant
	 */
	MarkerClusterer.BATCH_SIZE_IE = 500;


	/**
	 * The default root name for the marker cluster images.
	 *
	 * @type {string}
	 * @constant
	 */
	MarkerClusterer.IMAGE_PATH = "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/images/m";


	/**
	 * The default extension name for the marker cluster images.
	 *
	 * @type {string}
	 * @constant
	 */
	MarkerClusterer.IMAGE_EXTENSION = "png";


	/**
	 * The default array of sizes for the marker cluster images.
	 *
	 * @type {Array.<number>}
	 * @constant
	 */
	MarkerClusterer.IMAGE_SIZES = [53, 56, 66, 78, 90];

	module.exports = MarkerClusterer


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(59),
	    now = __webpack_require__(60);

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed invocations. Provide an options object to indicate that `func`
	 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
	 * Subsequent calls to the debounced function return the result of the last
	 * `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	 * on the trailing edge of the timeout only if the the debounced function is
	 * invoked more than once during the `wait` timeout.
	 *
	 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options] The options object.
	 * @param {boolean} [options.leading=false] Specify invoking on the leading
	 *  edge of the timeout.
	 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
	 *  delayed before it's invoked.
	 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	 *  edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // avoid costly calculations while the window size is in flux
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
	 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // ensure `batchLog` is invoked once after 1 second of debounced calls
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', _.debounce(batchLog, 250, {
	 *   'maxWait': 1000
	 * }));
	 *
	 * // cancel a debounced call
	 * var todoChanges = _.debounce(batchLog, 1000);
	 * Object.observe(models.todo, todoChanges);
	 *
	 * Object.observe(models, function(changes) {
	 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
	 *     todoChanges.cancel();
	 *   }
	 * }, ['delete']);
	 *
	 * // ...at some point `models.todo` is changed
	 * models.todo.completed = true;
	 *
	 * // ...before 1 second has passed `models.todo` is deleted
	 * // which cancels the debounced `todoChanges` call
	 * delete models.todo;
	 */
	function debounce(func, wait, options) {
	  var args,
	      maxTimeoutId,
	      result,
	      stamp,
	      thisArg,
	      timeoutId,
	      trailingCall,
	      lastCalled = 0,
	      maxWait = false,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = wait < 0 ? 0 : (+wait || 0);
	  if (options === true) {
	    var leading = true;
	    trailing = false;
	  } else if (isObject(options)) {
	    leading = !!options.leading;
	    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  function cancel() {
	    if (timeoutId) {
	      clearTimeout(timeoutId);
	    }
	    if (maxTimeoutId) {
	      clearTimeout(maxTimeoutId);
	    }
	    lastCalled = 0;
	    maxTimeoutId = timeoutId = trailingCall = undefined;
	  }

	  function complete(isCalled, id) {
	    if (id) {
	      clearTimeout(id);
	    }
	    maxTimeoutId = timeoutId = trailingCall = undefined;
	    if (isCalled) {
	      lastCalled = now();
	      result = func.apply(thisArg, args);
	      if (!timeoutId && !maxTimeoutId) {
	        args = thisArg = undefined;
	      }
	    }
	  }

	  function delayed() {
	    var remaining = wait - (now() - stamp);
	    if (remaining <= 0 || remaining > wait) {
	      complete(trailingCall, maxTimeoutId);
	    } else {
	      timeoutId = setTimeout(delayed, remaining);
	    }
	  }

	  function maxDelayed() {
	    complete(trailing, timeoutId);
	  }

	  function debounced() {
	    args = arguments;
	    stamp = now();
	    thisArg = this;
	    trailingCall = trailing && (timeoutId || !leading);

	    if (maxWait === false) {
	      var leadingCall = leading && !timeoutId;
	    } else {
	      if (!maxTimeoutId && !leading) {
	        lastCalled = stamp;
	      }
	      var remaining = maxWait - (stamp - lastCalled),
	          isCalled = remaining <= 0 || remaining > maxWait;

	      if (isCalled) {
	        if (maxTimeoutId) {
	          maxTimeoutId = clearTimeout(maxTimeoutId);
	        }
	        lastCalled = stamp;
	        result = func.apply(thisArg, args);
	      }
	      else if (!maxTimeoutId) {
	        maxTimeoutId = setTimeout(maxDelayed, remaining);
	      }
	    }
	    if (isCalled && timeoutId) {
	      timeoutId = clearTimeout(timeoutId);
	    }
	    else if (!timeoutId && wait !== maxWait) {
	      timeoutId = setTimeout(delayed, wait);
	    }
	    if (leadingCall) {
	      isCalled = true;
	      result = func.apply(thisArg, args);
	    }
	    if (isCalled && !timeoutId && !maxTimeoutId) {
	      args = thisArg = undefined;
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  return debounced;
	}

	module.exports = debounce;


/***/ },
/* 59 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(61);

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeNow = getNative(Date, 'now');

	/**
	 * Gets the number of milliseconds that have elapsed since the Unix epoch
	 * (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @category Date
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => logs the number of milliseconds it took for the deferred function to be invoked
	 */
	var now = nativeNow || function() {
	  return new Date().getTime();
	};

	module.exports = now;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(62);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	module.exports = getNative;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(63),
	    isObjectLike = __webpack_require__(64);

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = isNative;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(59);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 which returns 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	module.exports = isFunction;


/***/ },
/* 64 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_65__;

/***/ }
/******/ ])
});
;