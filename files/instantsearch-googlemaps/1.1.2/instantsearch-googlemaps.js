/*! instantsearch-googlemaps 1.1.2 | © Algolia | github.com/instantsearch/instantsearch-googlemaps */(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("ReactDOM"), require("instantsearch"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "ReactDOM", "instantsearch"], factory);
	else if(typeof exports === 'object')
		exports["instantsearchGoogleMaps"] = factory(require("React"), require("ReactDOM"), require("instantsearch"));
	else
		root["instantsearchGoogleMaps"] = factory(root["React"], root["ReactDOM"], root["instantsearch"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_53__) {
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

	var _lodashFunctionDebounce = __webpack_require__(46);

	var _lodashFunctionDebounce2 = _interopRequireDefault(_lodashFunctionDebounce);

	var _instantsearchJs = __webpack_require__(53);

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
	 * @param {boolean} [options.refineOnMapInteraction=false] Should we refine the search on map interaction, default to false
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
	    _refine: function _refine(_ref2, bounds) {
	      var helper = _ref2.helper;

	      if (!bounds) {
	        return;
	      }

	      var p1 = bounds.getNorthEast();
	      var p2 = bounds.getSouthWest();
	      var box = [p1.lat(), p1.lng(), p2.lat(), p2.lng()];

	      helper.setQueryParameter('insideBoundingBox', box.join(',')).search().setQueryParameter('insideBoundingBox', undefined);
	    },

	    render: function render(_ref3) {
	      var results = _ref3.results;
	      var helper = _ref3.helper;

	      var markers = results.hits.map(function (hit, index) {
	        return _extends({
	          position: new google.maps.LatLng(hit._geoloc),
	          id: hit.objectID
	        }, prepareMarkerData(hit, index, results.hits));
	      });

	      _reactDom2['default'].render(_react2['default'].createElement(_srcGoogleMapsJs2['default'], {
	        markers: markers,
	        refine: this._refine.bind(this, { helper: helper }),
	        refineOnMapInteraction: refineOnMapInteraction
	      }), container);
	    }
	  };

	  // no need to do too much map rendering, it can take a lot of time
	  // to display a map with all the tiles and a constantly mooving map is
	  // not UX friendly
	  widget.render = (0, _lodashFunctionDebounce2['default'])(widget.render, 200, { leading: true });

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

	var _lodashFunctionDebounce = __webpack_require__(46);

	var _lodashFunctionDebounce2 = _interopRequireDefault(_lodashFunctionDebounce);

	var GoogleMaps = (function (_React$Component) {
	  _inherits(GoogleMaps, _React$Component);

	  function GoogleMaps(props) {
	    _classCallCheck(this, GoogleMaps);

	    _get(Object.getPrototypeOf(GoogleMaps.prototype), 'constructor', this).call(this, props);
	    this.state = { userAction: true, userRefine: false, ignoreUpdate: false };
	    this._handleZoomChanged = (0, _lodashFunctionDebounce2['default'])(this._shouldRefineOnMapInteraction(this._handleZoomChanged), 200);
	    this._handleDragEnd = (0, _lodashFunctionDebounce2['default'])(this._shouldRefineOnMapInteraction(this._handleDragEnd), 200);

	    var debouncedHandleResize = (0, _lodashFunctionDebounce2['default'])(this._handleResize.bind(this), 200);
	    window.addEventListener('resize', debouncedHandleResize);
	    window.addEventListener('load', debouncedHandleResize);
	  }

	  _createClass(GoogleMaps, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      // without setTimeout, the GoogleMap component will try to access state.map
	      // which fail at componentDidMount
	      setTimeout(this._fitMapToMarkers.bind(this, this.props.markers), 0);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (this.state.ignoreUpdate === true) {
	        this.setState({ ignoreUpdate: false });
	        return;
	      }

	      if (this.state.userRefine === true) {
	        this.setState({ userRefine: false });
	        return;
	      }

	      this._fitMapToMarkers(nextProps.markers);
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      var _this = this;

	      return nextState.ignoreUpdate === false && nextProps.markers.some(function (marker, markerIndex) {
	        return _this.props.markers[markerIndex] === undefined || marker.id !== _this.props.markers[markerIndex].id;
	      });
	    }
	  }, {
	    key: '_handleResize',
	    value: function _handleResize() {
	      this._fitMapToMarkers(this.props.markers);
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
	    key: '_handleDragEnd',
	    value: function _handleDragEnd() {
	      this.setState({ userRefine: true });
	      this.props.refine(this._map.getBounds());
	    }
	  }, {
	    key: '_handleZoomChanged',
	    value: function _handleZoomChanged() {
	      if (this.state.userAction === false) {
	        this.setState({ userAction: true });
	        return;
	      }

	      // there's a previous userRefine, ignore it on next componentWillReceiveProps
	      if (this.state.userRefine === true) {
	        this.setState({ ignoreUpdate: true });
	      } else {
	        this.setState({ userRefine: true });
	      }

	      this.props.refine(this._map.getBounds());
	    }
	  }, {
	    key: '_fitMapToMarkers',
	    value: function _fitMapToMarkers(markers) {
	      var bounds = new google.maps.LatLngBounds();
	      markers.forEach(function (_ref) {
	        var position = _ref.position;
	        return bounds.extend(position);
	      });

	      this.setState({ userAction: false }, function () {
	        this._map.fitBounds(bounds);
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      return _react2['default'].createElement(
	        _reactGoogleMaps.GoogleMap,
	        {
	          containerProps: { style: { height: '100%' } },
	          onDragend: this._handleDragEnd.bind(this),
	          onZoomChanged: this._handleZoomChanged.bind(this),
	          ref: function (map) {
	            return _this2._map = map;
	          }
	        },
	        this.props.markers.map(function (marker) {
	          return _react2['default'].createElement(_reactGoogleMaps.Marker, _extends({ key: marker.id }, marker));
	        })
	      );
	    }
	  }]);

	  return GoogleMaps;
	})(_react2['default'].Component);

	GoogleMaps.propTypes = {
	  markers: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.shape({
	    id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.string]),
	    label: _react2['default'].PropTypes.string,
	    position: _react2['default'].PropTypes.object,
	    title: _react2['default'].PropTypes.string
	  })).isRequired,
	  refine: _react2['default'].PropTypes.func.isRequired,
	  refineOnMapInteraction: _react2['default'].PropTypes.bool
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

	var _GoogleMap = __webpack_require__(5);

	exports.GoogleMap = _interopRequire(_GoogleMap);

	var _Circle = __webpack_require__(14);

	exports.Circle = _interopRequire(_Circle);

	var _DirectionsRenderer = __webpack_require__(18);

	exports.DirectionsRenderer = _interopRequire(_DirectionsRenderer);

	var _DrawingManager = __webpack_require__(21);

	exports.DrawingManager = _interopRequire(_DrawingManager);

	var _InfoWindow = __webpack_require__(24);

	exports.InfoWindow = _interopRequire(_InfoWindow);

	var _Marker = __webpack_require__(28);

	exports.Marker = _interopRequire(_Marker);

	var _OverlayView = __webpack_require__(31);

	exports.OverlayView = _interopRequire(_OverlayView);

	var _Polygon = __webpack_require__(34);

	exports.Polygon = _interopRequire(_Polygon);

	var _Polyline = __webpack_require__(37);

	exports.Polyline = _interopRequire(_Polyline);

	var _Rectangle = __webpack_require__(40);

	exports.Rectangle = _interopRequire(_Rectangle);

	var _SearchBox = __webpack_require__(43);

	exports.SearchBox = _interopRequire(_SearchBox);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _creatorsGoogleMapHolder = __webpack_require__(6);

	var _creatorsGoogleMapHolder2 = _interopRequireDefault(_creatorsGoogleMapHolder);

	var GoogleMap = (function (_Component) {
	  _inherits(GoogleMap, _Component);

	  function GoogleMap() {
	    _classCallCheck(this, GoogleMap);

	    _get(Object.getPrototypeOf(GoogleMap.prototype), "constructor", this).apply(this, arguments);

	    this.state = {};
	  }

	  _createClass(GoogleMap, [{
	    key: "getBounds",

	    // Public APIs
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
	    //
	    // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; }).filter(function(it){ return it.match(/^get/) && !it.match(/Map$/); })
	    value: function getBounds() {
	      return this.state.map.getBounds();
	    }
	  }, {
	    key: "getCenter",
	    value: function getCenter() {
	      return this.state.map.getCenter();
	    }
	  }, {
	    key: "getDiv",
	    value: function getDiv() {
	      return this.state.map.getDiv();
	    }
	  }, {
	    key: "getHeading",
	    value: function getHeading() {
	      return this.state.map.getHeading();
	    }
	  }, {
	    key: "getMapTypeId",
	    value: function getMapTypeId() {
	      return this.state.map.getMapTypeId();
	    }
	  }, {
	    key: "getProjection",
	    value: function getProjection() {
	      return this.state.map.getProjection();
	    }
	  }, {
	    key: "getStreetView",
	    value: function getStreetView() {
	      return this.state.map.getStreetView();
	    }
	  }, {
	    key: "getTilt",
	    value: function getTilt() {
	      return this.state.map.getTilt();
	    }
	  }, {
	    key: "getZoom",
	    value: function getZoom() {
	      return this.state.map.getZoom();
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
	      return this.state.map.fitBounds(bounds);
	    }
	  }, {
	    key: "panBy",
	    value: function panBy(x, y) {
	      return this.state.map.panBy(x, y);
	    }
	  }, {
	    key: "panTo",
	    value: function panTo(latLng) {
	      return this.state.map.panTo(latLng);
	    }
	  }, {
	    key: "panToBounds",
	    value: function panToBounds(latLngBounds) {
	      return this.state.map.panToBounds(latLngBounds);
	    }

	    // END - Public APIs - Use this carefully
	    //
	    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map

	  }, {
	    key: "componentDidMount",
	    value: function componentDidMount() {
	      var domEl = (0, _reactDom.findDOMNode)(this);
	      var _props = this.props;
	      var containerTagName = _props.containerTagName;
	      var containerProps = _props.containerProps;
	      var children = _props.children;

	      var mapProps = _objectWithoutProperties(_props, ["containerTagName", "containerProps", "children"]);

	      // TODO: support asynchronous load of google.maps API at this level.
	      //
	      // Create google.maps.Map instance so that dom is initialized before
	      // React's children creators.
	      //
	      var map = _creatorsGoogleMapHolder2["default"]._createMap(domEl, mapProps);
	      this.setState({ map: map });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _props2 = this.props;
	      var containerTagName = _props2.containerTagName;
	      var containerProps = _props2.containerProps;
	      var children = _props2.children;

	      var mapProps = _objectWithoutProperties(_props2, ["containerTagName", "containerProps", "children"]);

	      var child = this.state.map ?
	      // Notice: implementation details
	      //
	      // In this state, the DOM of google.maps.Map is already initialized in
	      // my innerHTML. Adding extra React components will not clean it
	      // in current (0.13.3) version. It will use prepend to add DOM of
	      // GoogleMapHolder and become a sibling of the DOM of google.maps.Map
	      // Not sure this is subject to change
	      //
	      _react2["default"].createElement(
	        _creatorsGoogleMapHolder2["default"],
	        _extends({ map: this.state.map }, mapProps),
	        children
	      ) : undefined;

	      return _react2["default"].createElement(containerTagName, containerProps, child);
	    }
	  }], [{
	    key: "propTypes",
	    value: _extends({
	      containerTagName: _react.PropTypes.string.isRequired,
	      containerProps: _react.PropTypes.object.isRequired
	    }, _creatorsGoogleMapHolder.mapDefaultPropTypes, _creatorsGoogleMapHolder.mapControlledPropTypes, _creatorsGoogleMapHolder.mapEventPropTypes),
	    enumerable: true
	  }, {
	    key: "defaultProps",
	    value: {
	      containerTagName: "div",
	      containerProps: {}
	    },
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsGoogleMapEventList = __webpack_require__(7);

	var _eventListsGoogleMapEventList2 = _interopRequireDefault(_eventListsGoogleMapEventList);

	var _utilsEventHandlerCreator = __webpack_require__(8);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(9);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(11);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(13);

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
/* 7 */
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
/* 8 */
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = defaultPropsCreator;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _addDefaultPrefix = __webpack_require__(10);

	var _addDefaultPrefix2 = _interopRequireDefault(_addDefaultPrefix);

	function defaultPropsCreator(propTypes) {
	  return Object.keys(propTypes).reduce(function (acc, name) {
	    acc[(0, _addDefaultPrefix2["default"])(name)] = propTypes[name];
	    return acc;
	  }, {});
	}

	module.exports = exports["default"];

/***/ },
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports["default"] = composeOptions;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _controlledOrDefault = __webpack_require__(12);

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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = controlledOrDefault;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _addDefaultPrefix = __webpack_require__(10);

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
/* 13 */
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(15);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsCircleCreator = __webpack_require__(16);

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
/* 15 */
/***/ function(module, exports) {

	var canUseDOM = !!(
	  typeof window !== 'undefined' &&
	  window.document &&
	  window.document.createElement
	);

	module.exports = canUseDOM;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsCircleEventList = __webpack_require__(17);

	var _eventListsCircleEventList2 = _interopRequireDefault(_eventListsCircleEventList);

	var _utilsEventHandlerCreator = __webpack_require__(8);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(9);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(11);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(13);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(6);

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
/* 17 */
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(15);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsDirectionsRendererCreator = __webpack_require__(19);

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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsDirectionsRendererEventList = __webpack_require__(20);

	var _eventListsDirectionsRendererEventList2 = _interopRequireDefault(_eventListsDirectionsRendererEventList);

	var _utilsEventHandlerCreator = __webpack_require__(8);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(9);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(11);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(13);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(6);

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
/* 20 */
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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(15);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsDrawingManagerCreator = __webpack_require__(22);

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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsDrawingManagerEventList = __webpack_require__(23);

	var _eventListsDrawingManagerEventList2 = _interopRequireDefault(_eventListsDrawingManagerEventList);

	var _utilsEventHandlerCreator = __webpack_require__(8);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(9);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(11);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(13);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(6);

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
/* 23 */
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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(15);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsInfoWindowCreator = __webpack_require__(25);

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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsInfoWindowEventList = __webpack_require__(26);

	var _eventListsInfoWindowEventList2 = _interopRequireDefault(_eventListsInfoWindowEventList);

	var _utilsEventHandlerCreator = __webpack_require__(8);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(9);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(11);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsSetContentForOptionalReactElement = __webpack_require__(27);

	var _utilsSetContentForOptionalReactElement2 = _interopRequireDefault(_utilsSetContentForOptionalReactElement);

	var _utilsComponentLifecycleDecorator = __webpack_require__(13);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(6);

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
/* 26 */
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
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = setContentForOptionalReactElement;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function renderElement(contentElement, prevContent) {
	  if ("[object HTMLDivElement]" !== Object.prototype.toString.call(prevContent)) {
	    prevContent = document.createElement("div");
	  }

	  // FIXME: React@0.14
	  _react2["default"].render(contentElement, prevContent);
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(15);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsMarkerCreator = __webpack_require__(29);

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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsMarkerEventList = __webpack_require__(30);

	var _eventListsMarkerEventList2 = _interopRequireDefault(_eventListsMarkerEventList);

	var _utilsEventHandlerCreator = __webpack_require__(8);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(9);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(11);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(13);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(6);

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

	      // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Marker
	      var marker = new google.maps.Marker((0, _utilsComposeOptions2["default"])(markerProps, markerControlledPropTypes));

	      marker.setMap(mapHolderRef.getMap());

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
/* 30 */
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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(15);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsOverlayViewCreator = __webpack_require__(32);

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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _invariant = __webpack_require__(33);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _utilsDefaultPropsCreator = __webpack_require__(9);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(11);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _GoogleMapHolder = __webpack_require__(6);

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
	      this.getOverlayView()._redraw(this.props.mapPaneName !== prevProps);
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
	        _react2["default"].unmountComponentAtNode(this._containerElement);
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
	        // FIXME: React@0.14
	        _react2["default"].render(_react.Children.only(this.get("children")), this._containerElement);
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
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
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
	        'Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(15);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsPolygonCreator = __webpack_require__(35);

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
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsPolygonEventList = __webpack_require__(36);

	var _eventListsPolygonEventList2 = _interopRequireDefault(_eventListsPolygonEventList);

	var _utilsEventHandlerCreator = __webpack_require__(8);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(9);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(11);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(13);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(6);

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
/* 36 */
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
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(15);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsPolylineCreator = __webpack_require__(38);

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
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsPolylineEventList = __webpack_require__(39);

	var _eventListsPolylineEventList2 = _interopRequireDefault(_eventListsPolylineEventList);

	var _utilsEventHandlerCreator = __webpack_require__(8);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(9);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(11);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(13);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(6);

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
/* 39 */
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
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(15);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsRectangleCreator = __webpack_require__(41);

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
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsRectangleEventList = __webpack_require__(42);

	var _eventListsRectangleEventList2 = _interopRequireDefault(_eventListsRectangleEventList);

	var _utilsEventHandlerCreator = __webpack_require__(8);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(9);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(11);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(13);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(6);

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
/* 42 */
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
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _canUseDom = __webpack_require__(15);

	var _canUseDom2 = _interopRequireDefault(_canUseDom);

	var _creatorsSearchBoxCreator = __webpack_require__(44);

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

	      var searchBoxProps = _objectWithoutProperties(_props, ["mapHolderRef", "classes", "style"]);

	      // Cannot create input via component - Google Maps will mess with React's internal state by detaching/attaching.
	      // Allow developers to style the "hidden element" via inputClasses.
	      var domEl = document.createElement("input");
	      domEl.className = classes;
	      domEl.type = "text";

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
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _eventListsSearchBoxEventList = __webpack_require__(45);

	var _eventListsSearchBoxEventList2 = _interopRequireDefault(_eventListsSearchBoxEventList);

	var _utilsEventHandlerCreator = __webpack_require__(8);

	var _utilsEventHandlerCreator2 = _interopRequireDefault(_utilsEventHandlerCreator);

	var _utilsDefaultPropsCreator = __webpack_require__(9);

	var _utilsDefaultPropsCreator2 = _interopRequireDefault(_utilsDefaultPropsCreator);

	var _utilsComposeOptions = __webpack_require__(11);

	var _utilsComposeOptions2 = _interopRequireDefault(_utilsComposeOptions);

	var _utilsComponentLifecycleDecorator = __webpack_require__(13);

	var _utilsComponentLifecycleDecorator2 = _interopRequireDefault(_utilsComponentLifecycleDecorator);

	var _GoogleMapHolder = __webpack_require__(6);

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
/* 45 */
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
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(47),
	    now = __webpack_require__(48);

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
/* 47 */
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
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(49);

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
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(50);

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
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(51),
	    isObjectLike = __webpack_require__(52);

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
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(47);

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
/* 52 */
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
/* 53 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_53__;

/***/ }
/******/ ])
});
;