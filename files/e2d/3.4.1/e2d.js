(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["e2d"] = factory();
	else
		root["e2d"] = factory();
})(this, function() {
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

	'use strict';

	var src = __webpack_require__(1),
	  path = __webpack_require__(11);

	module.exports = src.keys().reduce(function(index, key) {
	  index[path.basename(key, path.extname(key))] = src(key);
	  return index;
	}, {});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./Canvas.js": 2,
		"./Img.js": 10,
		"./Instruction.js": 13,
		"./Renderer.js": 3,
		"./addColorStop.js": 14,
		"./arc.js": 15,
		"./arcTo.js": 16,
		"./beginPath.js": 17,
		"./bezierCurveTo.js": 18,
		"./clearRect.js": 19,
		"./clip.js": 20,
		"./clipPath.js": 21,
		"./closePath.js": 22,
		"./createClass.js": 23,
		"./createImagePattern.js": 24,
		"./createLinearGradient.js": 4,
		"./createRadialGradient.js": 5,
		"./createRegularPolygon.js": 25,
		"./drawCanvas.js": 26,
		"./drawImage.js": 27,
		"./ellipse.js": 28,
		"./fill.js": 29,
		"./fillArc.js": 30,
		"./fillCanvas.js": 31,
		"./fillImage.js": 32,
		"./fillImagePattern.js": 33,
		"./fillRect.js": 34,
		"./fillStyle.js": 35,
		"./fillText.js": 36,
		"./globalAlpha.js": 37,
		"./globalCompositeOperation.js": 38,
		"./hitRect.js": 39,
		"./hitRegion.js": 40,
		"./imageSmoothingEnabled.js": 41,
		"./lineStyle.js": 42,
		"./lineTo.js": 43,
		"./measureText.js": 44,
		"./moveTo.js": 45,
		"./moveToLineTo.js": 46,
		"./path.js": 47,
		"./placeHolder.js": 48,
		"./quadraticCurveTo.js": 49,
		"./rect.js": 50,
		"./resetTransform.js": 51,
		"./rotate.js": 53,
		"./scale.js": 54,
		"./setTransform.js": 52,
		"./shadowStyle.js": 55,
		"./skewX.js": 56,
		"./skewY.js": 57,
		"./stroke.js": 58,
		"./strokeArc.js": 59,
		"./strokeRect.js": 60,
		"./strokeStyle.js": 61,
		"./strokeText.js": 62,
		"./text.js": 63,
		"./textStyle.js": 64,
		"./transform.js": 65,
		"./transformPoints.js": 8,
		"./translate.js": 66
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 1;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function Canvas(width, height) {

	  var Renderer = __webpack_require__(3);
	  this.renderer = new Renderer(width, height, window.document.createElement('div'));
	  this.fillPattern = null;
	  this.skipPatternCreation = false;

	  return Object.seal(this);
	}

	Canvas.prototype.render = function render(children) {
	  var result = [],
	      i;
	  for (i = 0; i < arguments.length; i++) {
	    result.push(arguments[i]);
	  }

	  this.renderer.render(result);
	  if (!this.skipPatternCreation) {
	    this.fillPattern = this.renderer.ctx.createPattern(this.renderer.canvas, 'no-repeat');
	  }
	  return this;
	};

	Canvas.prototype.style = function style() {
	  var defs = [];
	  for (var i = 0; i < arguments.length; i++) {
	    defs.push(arguments[i]);
	  }
	  this.renderer.style.apply(this.renderer, defs);
	  return this;
	};

	Canvas.prototype.toImage = function toImage(imageID) {
	  return this.renderer.toImage();
	};

	Canvas.prototype.resize = function resize(width, height) {
	  this.renderer.resize(+width, +height);
	  return this;
	};

	Object.defineProperty(Canvas.prototype, 'height', {
	  get: function() {
	    return this.renderer.canvas.width;
	  },
	  enumerable: true,
	  configurable: false
	});

	Object.defineProperty(Canvas.prototype, 'width', {
	  get: function() {
	    return this.renderer.canvas.width;
	  },
	  enumerable: true,
	  configurable: false
	});


	Canvas.create = function create(width, height, id) {
	  return new Canvas(width, height, id);
	};


	Object.seal(Canvas);
	Object.seal(Canvas.prototype);
	module.exports = Canvas;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var createLinearGradient = __webpack_require__(4),
	    createRadialGradient = __webpack_require__(5),
	    events = __webpack_require__(6),
	    keycode = __webpack_require__(7),
	    transformPoints = __webpack_require__(8),
	    pointInPolygon = __webpack_require__(9),
	    identity = [1, 0, 0, 1, 0, 0],
	    Img = __webpack_require__(10);

	function Renderer(width, height, parent, opts) {
	  events.EventEmitter.call(this);
	  opts = opts || {};

	  //virtual stack
	  this.transformStack = new Float64Array(
	    ((opts.transformStackCount || 500) + 1) * 6 //properties
	  );
	  this.transformStackIndex = 6;
	  this.transformStack.set(identity);

	  this.fillStyleStack = [];
	  this.strokeStyleStack = [];
	  this.lineStyleStack = [];
	  this.textStyleStack = [];
	  this.shadowStyleStack = [];
	  this.globalAlphaStack = [];
	  this.imageSmoothingEnabledStack = [];
	  this.globalCompositeOperationStack = [];

	  this.pi2 = Math.PI * 2;

	  this.isReady = false;
	  this.mouseData = {
	    x: 0,
	    y: 0,
	    state: 'up',
	    clicked: 0,
	    activeRegions: []
	  };
	  this.previousMouseData = {
	    x: 0,
	    y: 0,
	    state: 'up',
	    clicked: 0,
	    activeRegions: []
	  };

	  this.lastMouseEvent = null;
	  this.ranMouseEvent = false;
	  this.mouseRegions = [];
	  this.activeRegions = [];
	  this.styleQueue = [];

	  //user input here
	  this.keyData = {};

	  this.touchData = {
	    touches: [],
	    ids: []
	  };
	  this.lastTouchEvent = null;
	  this.ranTouchEvent = false;
	  this.touchRegions = [];

	  //set parent
	  if (parent && parent.nodeType === 1) {
	    this.parent = parent;
	  } else {
	    this.parent = window.document.createElement('div');
	    this.parent.style.margin = '0 auto';
	    this.parent.style.width = width + 'px';
	    this.parent.style.height = height + 'px';
	    window.document.body.appendChild(this.parent);
	  }

	  //set width and height automatically
	  if (!width || width <= 0) {
	    width = window.innerWidth;
	  }

	  if (!height || height <= 0) {
	    height = window.innerHeight;
	  }

	  this.canvas = window.document.createElement('canvas');

	  //focusable canvas bugfix
	  this.canvas.tabIndex = 1;

	  this.ctx = this.canvas.getContext('2d');

	  this.canvas.width = width;
	  this.canvas.height = height;
	  this.parent.appendChild(this.canvas);

	  //hook mouse, keyboard, and keyboard events right away
	  this.hookMouseEvents();
	  this.hookKeyboardEvents();
	  this.hookTouchEvents();

	  this.boundHookRenderFunction = this.hookRender.bind(this);
	  return Object.seal(this);
	}

	Renderer.prototype = Object.create(events.EventEmitter.prototype);

	Renderer.prototype.render = function render(args) {
	  var i,
	      len,
	      child,
	      props,
	      type,
	      cache,
	      matrix = [1, 0, 0, 1, 0, 0],
	      ctx = this.ctx,
	      children = [],
	      concat = children.concat;

	  //flush the virtual stack

	  this.fillStyleStack.splice(0, this.fillStyleStack.length);
	  this.strokeStyleStack.splice(0, this.strokeStyleStack.length);
	  this.lineStyleStack.splice(0, this.lineStyleStack.length);
	  this.textStyleStack.splice(0, this.textStyleStack.length);
	  this.shadowStyleStack.splice(0, this.shadowStyleStack.length);
	  this.globalCompositeOperationStack.splice(0, this.globalCompositeOperationStack.length);
	  this.globalAlphaStack.splice(0, this.globalAlphaStack.length);
	  this.imageSmoothingEnabledStack.splice(0, this.imageSmoothingEnabledStack.length);

	  for (i = 0, len = arguments.length; i < len; i++) {
	    children.push(arguments[i]);
	  }

	  //loop over every child
	  for (i = 0, len = children.length; i < len; i++) {
	    child = children[i];

	    //flattening algorithm
	    if (child && child.constructor === Array) {
	      children = concat.apply([], children);
	      child = children[i];
	      while (child && child.constructor === Array) {
	        children = concat.apply([], children);
	        child = children[i];
	      }
	      len = children.length;
	    }

	    //child must be truthy
	    if (!child) {
	      continue;
	    }

	    //set props and type object
	    props = child.props;
	    type = child.type;

	    if (type === 'transform') {
	      matrix[0] = this.transformStack[this.transformStackIndex - 6];
	      matrix[1] = this.transformStack[this.transformStackIndex - 5];
	      matrix[2] = this.transformStack[this.transformStackIndex - 4];
	      matrix[3] = this.transformStack[this.transformStackIndex - 3];
	      matrix[4] = this.transformStack[this.transformStackIndex - 2];
	      matrix[5] = this.transformStack[this.transformStackIndex - 1];


	      this.transformStackIndex += 6;
	      if (this.transformStackIndex > this.transformStack.length) {
	        this.increaseTransformStackSize();
	      }

	      this.transformStack[this.transformStackIndex - 6] = //d
	        matrix[0] * props[0] + matrix[2] * props[1];
	      this.transformStack[this.transformStackIndex - 5] = //b
	        matrix[1] * props[0] + matrix[3] * props[1];
	      this.transformStack[this.transformStackIndex - 4] = //c
	        matrix[0] * props[2] + matrix[2] * props[3];
	      this.transformStack[this.transformStackIndex - 3] = //d
	        matrix[1] * props[2] + matrix[3] * props[3];
	      this.transformStack[this.transformStackIndex - 2] = //e
	        matrix[0] * props[4] + matrix[2] * props[5] + matrix[4];
	      this.transformStack[this.transformStackIndex - 1] = //f
	        matrix[1] * props[4] + matrix[3] * props[5] + matrix[5];

	      ctx.setTransform(
	        this.transformStack[this.transformStackIndex - 6],
	        this.transformStack[this.transformStackIndex - 5],
	        this.transformStack[this.transformStackIndex - 4],
	        this.transformStack[this.transformStackIndex - 3],
	        this.transformStack[this.transformStackIndex - 2],
	        this.transformStack[this.transformStackIndex - 1]
	      );

	      continue;
	    }

	    if (type === 'setTransform') {
	      this.transformStackIndex += 6;
	      if (this.transformStackIndex > this.transformStack.length) {
	        this.increaseTransformStackSize();
	      }

	      this.transformStack[this.transformStackIndex - 6] = props[0];//a
	      this.transformStack[this.transformStackIndex - 5] = props[1];//b
	      this.transformStack[this.transformStackIndex - 4] = props[2];//c
	      this.transformStack[this.transformStackIndex - 3] = props[3];//d
	      this.transformStack[this.transformStackIndex - 2] = props[4];//e
	      this.transformStack[this.transformStackIndex - 1] = props[5];//f
	      ctx.setTransform(props[0], props[1], props[2], props[3], props[4], props[5]);
	      continue;
	    }

	    if (type === 'scale') {
	      matrix[0] = this.transformStack[this.transformStackIndex - 6];
	      matrix[1] = this.transformStack[this.transformStackIndex - 5];
	      matrix[2] = this.transformStack[this.transformStackIndex - 4];
	      matrix[3] = this.transformStack[this.transformStackIndex - 3];
	      matrix[4] = this.transformStack[this.transformStackIndex - 2];
	      matrix[5] = this.transformStack[this.transformStackIndex - 1];

	      this.transformStackIndex += 6;
	      if (this.transformStackIndex > this.transformStack.length) {
	        this.increaseTransformStackSize();
	      }

	      this.transformStack[this.transformStackIndex - 6] = matrix[0] * props.x; //a
	      this.transformStack[this.transformStackIndex - 5] = matrix[1] * props.x; //b
	      this.transformStack[this.transformStackIndex - 4] = matrix[2] * props.y; //c
	      this.transformStack[this.transformStackIndex - 3] = matrix[3] * props.y; //d
	      this.transformStack[this.transformStackIndex - 2] = matrix[4]; //e
	      this.transformStack[this.transformStackIndex - 1] = matrix[5]; //f

	      ctx.setTransform(
	        this.transformStack[this.transformStackIndex - 6],
	        this.transformStack[this.transformStackIndex - 5],
	        this.transformStack[this.transformStackIndex - 4],
	        this.transformStack[this.transformStackIndex - 3],
	        this.transformStack[this.transformStackIndex - 2],
	        this.transformStack[this.transformStackIndex - 1]
	      );

	      continue;
	    }

	    if (type === 'translate') {
	      matrix[0] = this.transformStack[this.transformStackIndex - 6];
	      matrix[1] = this.transformStack[this.transformStackIndex - 5];
	      matrix[2] = this.transformStack[this.transformStackIndex - 4];
	      matrix[3] = this.transformStack[this.transformStackIndex - 3];
	      matrix[4] = this.transformStack[this.transformStackIndex - 2];
	      matrix[5] = this.transformStack[this.transformStackIndex - 1];

	      this.transformStackIndex += 6;
	      if (this.transformStackIndex > this.transformStack.length) {
	        this.increaseTransformStackSize();
	      }

	      this.transformStack[this.transformStackIndex - 6] = matrix[0]; //a
	      this.transformStack[this.transformStackIndex - 5] = matrix[1]; //b
	      this.transformStack[this.transformStackIndex - 4] = matrix[2]; //c
	      this.transformStack[this.transformStackIndex - 3] = matrix[3]; //d
	      this.transformStack[this.transformStackIndex - 2] = matrix[4] + matrix[0] * props.x + matrix[2] * props.y; //e
	      this.transformStack[this.transformStackIndex - 1] = matrix[5] + matrix[1] * props.x + matrix[3] * props.y; //f

	      ctx.setTransform(
	        this.transformStack[this.transformStackIndex - 6],
	        this.transformStack[this.transformStackIndex - 5],
	        this.transformStack[this.transformStackIndex - 4],
	        this.transformStack[this.transformStackIndex - 3],
	        this.transformStack[this.transformStackIndex - 2],
	        this.transformStack[this.transformStackIndex - 1]
	      );

	      continue;
	    }

	    if (type === 'rotate') {
	      matrix[0] = this.transformStack[this.transformStackIndex - 6];
	      matrix[1] = this.transformStack[this.transformStackIndex - 5];
	      matrix[2] = this.transformStack[this.transformStackIndex - 4];
	      matrix[3] = this.transformStack[this.transformStackIndex - 3];
	      matrix[4] = this.transformStack[this.transformStackIndex - 2];
	      matrix[5] = this.transformStack[this.transformStackIndex - 1];

	      this.transformStackIndex += 6;
	      if (this.transformStackIndex > this.transformStack.length) {
	        this.increaseTransformStackSize();
	      }

	      this.transformStack[this.transformStackIndex - 6] =
	        matrix[0] * props.cos + matrix[2] * props.sin; //a
	      this.transformStack[this.transformStackIndex - 5] =
	        matrix[1] * props.cos + matrix[3] * props.sin; //b
	      this.transformStack[this.transformStackIndex - 4] =
	        matrix[0] * -props.sin + matrix[2] * props.cos; //c
	      this.transformStack[this.transformStackIndex - 3] =
	        matrix[1] * -props.sin + matrix[3] * props.cos; //d
	      this.transformStack[this.transformStackIndex - 2] = matrix[4]; //e
	      this.transformStack[this.transformStackIndex - 1] = matrix[5];//f

	      ctx.setTransform(
	        this.transformStack[this.transformStackIndex - 6],
	        this.transformStack[this.transformStackIndex - 5],
	        this.transformStack[this.transformStackIndex - 4],
	        this.transformStack[this.transformStackIndex - 3],
	        this.transformStack[this.transformStackIndex - 2],
	        this.transformStack[this.transformStackIndex - 1]
	      );

	      continue;
	    }

	    if (type === 'skewX') {
	      matrix[0] = this.transformStack[this.transformStackIndex - 6];
	      matrix[1] = this.transformStack[this.transformStackIndex - 5];
	      matrix[2] = this.transformStack[this.transformStackIndex - 4];
	      matrix[3] = this.transformStack[this.transformStackIndex - 3];
	      matrix[4] = this.transformStack[this.transformStackIndex - 2];
	      matrix[5] = this.transformStack[this.transformStackIndex - 1];


	      this.transformStackIndex += 6;
	      if (this.transformStackIndex > this.transformStack.length) {
	        this.increaseTransformStackSize();
	      }

	      this.transformStack[this.transformStackIndex - 6] = //d
	        matrix[0];
	      this.transformStack[this.transformStackIndex - 5] = //b
	        matrix[1];
	      this.transformStack[this.transformStackIndex - 4] = //c
	        matrix[0] * props.x + matrix[2];
	      this.transformStack[this.transformStackIndex - 3] = //d
	        matrix[1] * props.x + matrix[3];
	      this.transformStack[this.transformStackIndex - 2] = //e
	        matrix[4];
	      this.transformStack[this.transformStackIndex - 1] = //f
	        matrix[5];

	      ctx.setTransform(
	        this.transformStack[this.transformStackIndex - 6],
	        this.transformStack[this.transformStackIndex - 5],
	        this.transformStack[this.transformStackIndex - 4],
	        this.transformStack[this.transformStackIndex - 3],
	        this.transformStack[this.transformStackIndex - 2],
	        this.transformStack[this.transformStackIndex - 1]
	      );

	      continue;
	    }

	    if (type === 'skewY') {
	      matrix[0] = this.transformStack[this.transformStackIndex - 6];
	      matrix[1] = this.transformStack[this.transformStackIndex - 5];
	      matrix[2] = this.transformStack[this.transformStackIndex - 4];
	      matrix[3] = this.transformStack[this.transformStackIndex - 3];
	      matrix[4] = this.transformStack[this.transformStackIndex - 2];
	      matrix[5] = this.transformStack[this.transformStackIndex - 1];


	      this.transformStackIndex += 6;
	      if (this.transformStackIndex > this.transformStack.length) {
	        this.increaseTransformStackSize();
	      }

	      this.transformStack[this.transformStackIndex - 6] = //d
	        matrix[0] * 1 + matrix[2] * props.y;
	      this.transformStack[this.transformStackIndex - 5] = //b
	        matrix[1] * 1 + matrix[3] * props.y;
	      this.transformStack[this.transformStackIndex - 4] = //c
	        matrix[2];
	      this.transformStack[this.transformStackIndex - 3] = //d
	        matrix[3];
	      this.transformStack[this.transformStackIndex - 2] = //e
	        matrix[4];
	      this.transformStack[this.transformStackIndex - 1] = //f
	        matrix[5];

	      ctx.setTransform(
	        this.transformStack[this.transformStackIndex - 6],
	        this.transformStack[this.transformStackIndex - 5],
	        this.transformStack[this.transformStackIndex - 4],
	        this.transformStack[this.transformStackIndex - 3],
	        this.transformStack[this.transformStackIndex - 2],
	        this.transformStack[this.transformStackIndex - 1]
	      );

	      continue;
	    }

	    if (type === 'restore') {
	      this.transformStackIndex -= 6;
	      matrix[0] = this.transformStack[this.transformStackIndex - 6];
	      matrix[1] = this.transformStack[this.transformStackIndex - 5];
	      matrix[2] = this.transformStack[this.transformStackIndex - 4];
	      matrix[3] = this.transformStack[this.transformStackIndex - 3];
	      matrix[4] = this.transformStack[this.transformStackIndex - 2];
	      matrix[5] = this.transformStack[this.transformStackIndex - 1];

	      ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);

	      continue;
	    }

	    if (type === 'fillRect') {
	      ctx.fillRect(props.x, props.y, props.width, props.height);

	      continue;
	    }

	    if (type === 'strokeRect') {
	      ctx.strokeRect(props.x, props.y, props.width, props.height);

	      continue;
	    }

	    if (type === 'clearRect') {
	      ctx.clearRect(props.x, props.y, props.width, props.height);

	      continue;
	    }

	    if (type === 'rect') {
	      ctx.rect(props.x, props.y, props.width, props.height);

	      continue;
	    }

	    if (type === 'fillStyle') {
	      this.fillStyleStack.push(ctx.fillStyle);
	      ctx.fillStyle = props.value;

	      continue;
	    }

	    if (type === 'strokeStyle') {
	      this.strokeStyleStack.push(ctx.strokeStyle);
	      ctx.strokeStyle = props.value;

	      continue;
	    }

	    if (type === 'endFillStyle') {
	      ctx.fillStyle = this.fillStyleStack.pop();

	      continue;
	    }

	    if (type === 'endStrokeStyle') {
	      ctx.strokeStyle = this.strokeStyleStack.pop();

	      continue;
	    }
	    if (type === 'lineStyle') {
	      this.lineStyleStack.push({
	        lineWidth: ctx.lineWidth,
	        lineCap: ctx.lineCap,
	        lineJoin: ctx.lineJoin,
	        miterLimit: ctx.miterLimit,
	        lineDash: ctx.getLineDash(),
	        lineDashOffset: ctx.lineDashOffset
	      });

	      if (props.lineWidth !== null) {
	        ctx.lineWidth = props.lineWidth;
	      }
	      if (props.lineCap !== null) {
	        ctx.lineCap = props.lineCap;
	      }
	      if (props.lineJoin !== null) {
	        ctx.lineJoin = props.lineJoin;
	      }
	      if (props.miterLimit !== null) {
	        ctx.miterLimit = props.miterLimit;
	      }
	      if (props.lineDash.length > 0) {
	        ctx.setLineDash(props.lineDash);
	      }
	      if (props.lineDashOffset !== null) {
	        ctx.lineDashOffset = props.lineDashOffset;
	      }

	      continue;
	    }

	    if (type === 'endLineStyle') {
	      cache = this.lineStyleStack.pop();
	      ctx.lineWidth = cache.lineWidth;
	      ctx.lineCap = cache.lineCap;
	      ctx.lineJoin = cache.lineJoin;
	      ctx.miterLimit = cache.miterLimit;
	      ctx.setLineDash(cache.lineDash);
	      ctx.lineDashOffset = cache.lineDashOffset;

	      continue;
	    }

	    if (type === 'textStyle') {
	      this.textStyleStack.push({
	        font: ctx.font,
	        textAlign: ctx.textAlign,
	        textBaseline: ctx.textBaseline,
	        direction: ctx.direction
	      });
	      if (props.font !== null) {
	        ctx.font = props.font;
	      }
	      if (props.textAlign !== null) {
	        ctx.textAlign = props.textAlign;
	      }
	      if (props.textBaseline !== null) {
	        ctx.textBaseline = props.textBaseline;
	      }
	      if (props.lineJoin !== null) {
	        ctx.direction = props.direction;
	      }

	      continue;
	    }

	    if (type === 'endTextStyle') {
	      cache = this.textStyleStack.pop();
	      ctx.font = cache.font;
	      ctx.textAlign = cache.textAlign;
	      ctx.textBaseline = cache.textBaseline;
	      ctx.direction = cache.direction;

	      continue;
	    }

	    if (type === 'shadowStyle') {
	      this.shadowStyleStack.push({
	        shadowBlur: ctx.shadowBlur,
	        shadowColor: ctx.shadowColor,
	        shadowOffsetX: ctx.shadowOffsetX,
	        shadowOffsetY: ctx.shadowOffsetY
	      });
	      if (props.shadowBlur !== null) {
	        ctx.shadowBlur = props.shadowBlur;
	      }
	      if (props.shadowColor !== null) {
	        ctx.shadowColor = props.shadowColor;
	      }
	      if (props.shadowOffsetX !== null) {
	        ctx.shadowOffsetX = props.shadowOffsetX;
	      }
	      if (props.shadowOffsetY !== null) {
	        ctx.shadowOffsetY = props.shadowOffsetY;
	      }

	      continue;
	    }

	    if (type === 'endShadowStyle') {
	      cache = this.shadowStyleStack.pop();
	      ctx.shadowBlur = cache.shadowBlur;
	      ctx.shadowColor = cache.shadowColor;
	      ctx.shadowOffsetX = cache.shadowOffsetX;
	      ctx.shadowOffsetY = cache.shadowOffsetY;

	      continue;
	    }

	    if (type === 'strokeText') {
	      if (props.maxWidth) {
	        ctx.strokeText(props.text, props.x, props.y, props.maxWidth);
	        continue;
	      }
	      ctx.strokeText(props.text, props.x, props.y);
	      continue;
	    }

	    if (type === 'fillText') {
	      if (props.maxWidth) {
	        ctx.fillText(props.text, props.x, props.y, props.maxWidth);
	        continue;
	      }
	      ctx.fillText(props.text, props.x, props.y);
	      continue;
	    }

	    if (type === 'text') {
	      if (props.maxWidth !== 0) {
	        if (props.fill) {
	          ctx.fillText(props.text, props.x, props.y, props.maxWidth);
	        }
	        if (props.stroke) {
	          ctx.strokeText(props.text, props.x, props.y, props.maxWidth);
	        }

	        continue;
	      }
	      if (props.fill) {
	        ctx.fillText(props.text, props.x, props.y);
	      }
	      if (props.stroke) {
	        ctx.strokeText(props.text, props.x, props.y);
	      }

	      continue;
	    }



	    if (type === 'drawImage') {
	      if (!props.img) {
	        continue;
	      }
	      cache = props.img.imageElement || props.img || new Image();
	      ctx.drawImage(cache || new Image(), props.dx, props.dy);
	      continue;
	    }

	    if (type === 'drawImageSize') {
	      if (!props.img) {
	        continue;
	      }
	      cache = props.img.imageElement || props.img || new Image();
	      ctx.drawImage(cache, props.dx, props.dy, props.dWidth, props.dHeight);
	      continue;
	    }

	    if (type === 'drawImageSource') {
	      if (!props.img) {
	        continue;
	      }
	      cache = props.img.imageElement || props.img || new Image();
	      ctx.drawImage(cache, props.sx, props.sy, props.sWidth, props.sHeight, props.dx, props.dy, props.dWidth, props.dHeight);
	      continue;
	    }

	    if (type === 'fillImagePattern') {
	      if (!props.img) {
	        continue;
	      }
	      ctx.fillStyle = props.img.imagePatternRepeat;
	      ctx.translate(props.dx, props.dy);
	      ctx.fillRect(0, 0, props.dWidth, props.dHeight);
	      ctx.restore();

	      continue;
	    }

	    if (type === 'fillImage') {
	      if (!props.img) {
	        continue;
	      }
	      cache = props.img.imageElement;
	      ctx.save();
	      ctx.fillStyle = props.img.imagePattern;
	      ctx.translate(props.dx, props.dy);
	      ctx.fillRect(0, 0, cache.width, cache.height);
	      ctx.restore();

	      continue;
	    }

	    if (type === 'fillImageSize') {
	      if (!props.img) {
	        continue;
	      }
	      cache = props.img.imageElement;
	      ctx.save();
	      ctx.fillStyle = props.img.imagePattern;
	      ctx.translate(props.dx, props.dy);
	      ctx.scale(props.dWidth / cache.width, props.dHeight / cache.height);
	      ctx.fillRect(0, 0, cache.width, cache.height);
	      ctx.restore();

	      continue;
	    }

	    if (type === 'fillImageSource') {
	      if (!props.img) {
	        continue;
	      }
	      ctx.save();
	      ctx.fillStyle = props.img.imagePattern;
	      ctx.translate(props.dx, props.dy);
	      ctx.scale(props.dWidth / props.sWidth, props.dHeight / props.sHeight);
	      ctx.translate(-props.sx, -props.sy);
	      ctx.fillRect(props.sx, props.sy, props.sWidth, props.sHeight);
	      ctx.restore();

	      continue;
	    }


	    if (type === 'fillCanvas') {
	      if (!props.img) {
	        continue;
	      }
	      cache = props.img;
	      ctx.save();
	      ctx.fillStyle = cache.fillPattern;
	      ctx.translate(props.dx, props.dy);
	      ctx.fillRect(0, 0, cache.width, cache.height);
	      ctx.restore();

	      continue;
	    }

	    if (type === 'fillCanvasSize') {
	      if (!props.img) {
	        continue;
	      }
	      cache = props.img;
	      ctx.save();
	      ctx.fillStyle = cache.fillPattern;
	      ctx.translate(props.dx, props.dy);
	      ctx.scale(props.dWidth / cache.width, props.dHeight / cache.height);
	      ctx.fillRect(0, 0, cache.width, cache.height);
	      ctx.restore();

	      continue;
	    }

	    if (type === 'fillCanvasSource') {
	      if (!props.img) {
	        continue;
	      }
	      ctx.save();
	      ctx.fillStyle = props.img.fillPattern;
	      ctx.translate(props.dx, props.dy);
	      ctx.scale(props.dWidth / props.sWidth, props.dHeight / props.sHeight);
	      ctx.translate(-props.sx, -props.sy);
	      ctx.fillRect(props.sx, props.sy, props.sWidth, props.sHeight);
	      ctx.restore();

	      continue;
	    }

	    if (type === 'drawCanvas') {
	      if (!props.img) {
	        continue;
	      }
	      ctx.drawImage(props.img.renderer.canvas, props.dx, props.dy);
	      continue;
	    }

	    if (type === 'drawCanvasSize') {
	      if (!props.img) {
	        continue;
	      }
	      ctx.drawImage(props.img.renderer.canvas, props.dx, props.dy, props.dWidth, props.dHeight);

	      continue;
	    }

	    if (type === 'drawCanvasSource') {
	      if (!props.img) {
	        continue;
	      }
	      ctx.drawImage(props.img.renderer.canvas, props.sx, props.sy, props.sWidth, props.sHeight, props.dx, props.dy, props.dWidth, props.dHeight);

	      continue;
	    }

	    if (type === 'strokeArc') {
	      ctx.beginPath();
	      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle);
	      ctx.closePath();
	      ctx.stroke();

	      continue;
	    }

	    if (type === 'strokeArc-counterclockwise') {
	      ctx.beginPath();
	      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, true);
	      ctx.closePath();
	      ctx.stroke();

	      continue;
	    }


	    if (type === 'fillArc') {
	      ctx.beginPath();
	      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle);
	      ctx.closePath();
	      ctx.fill();

	      continue;
	    }

	    if (type === 'fillArc-counterclockwise') {
	      ctx.beginPath();
	      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, true);
	      ctx.closePath();
	      ctx.fill();

	      continue;
	    }

	    if (type === 'moveTo') {
	      ctx.moveTo(props.x, props.y);

	      continue;
	    }

	    if (type === 'lineTo') {
	      ctx.lineTo(props.x, props.y);

	      continue;
	    }

	    if (type === 'bezierCurveTo') {
	      ctx.bezierCurveTo(props.cp1x, props.cp1y, props.cp2x, props.cp2y, props.x, props.y);

	      continue;
	    }

	    if (type === 'quadraticCurveTo') {
	      ctx.quadraticCurveTo(props.cpx, props.cpy, props.x, props.y);

	      continue;
	    }

	    if (type === 'anticlockwise-arc') {
	      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, true);

	      continue;
	    }

	    if (type === 'arc') {
	      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle);
	      continue;
	    }

	    if (type === 'full-arc') {
	      ctx.arc(props.x, props.y, props.r, 0, this.pi2);

	      continue;
	    }

	    if (type === 'quick-arc') {
	      ctx.arc(0, 0, props.r, 0, this.pi2);

	      continue;
	    }

	    if (type === 'arcTo') {
	      ctx.arcTo(props.x1, props.y1, props.x2, props.y2, props.r);

	      continue;
	    }

	    if (type === 'anticlockwise-ellipse') {
	      this.save();
	      this.translate(props.x, props.y);
	      this.rotate(props.rotation);
	      this.scale(props.radiusX, props.radiusY);
	      this.arc(0, 0, 1, props.startAngle, props.endAngle, true);
	      this.restore();

	      continue;
	    }

	    if (type === 'ellipse') {
	      this.save();
	      this.translate(props.x, props.y);
	      this.rotate(props.rotation);
	      this.scale(props.radiusX, props.radiusY);
	      this.arc(0, 0, 1, props.startAngle, props.endAngle);
	      this.restore();

	      continue;
	    }

	    if (type === 'full-ellipse') {
	      this.save();
	      this.translate(props.x, props.y);
	      this.rotate(props.rotation);
	      this.scale(props.radiusX, props.radiusY);
	      this.arc(0, 0, 1, 0, this.pi2);
	      this.restore();

	      continue;
	    }

	    if (type === 'quick-ellipse') {
	      this.save();
	      this.translate(props.x, props.y);
	      this.scale(props.radiusX, props.radiusY);
	      this.arc(0, 0, 1, 0, this.pi2);
	      this.restore();

	      continue;
	    }

	    if (type === 'globalCompositeOperation') {
	      this.globalCompositeOperationStack.push(ctx.globalCompositeOperation);
	      ctx.globalCompositeOperation = props.value;

	      continue;
	    }

	    if (type === 'endGlobalCompositeOperation') {
	      ctx.globalCompositeOperation = this.globalCompositeOperationStack.pop();

	      continue;
	    }

	    if (type === 'fill') {
	      ctx.fill();

	      continue;
	    }

	    if (type === 'stroke') {
	      ctx.stroke();

	      continue;
	    }

	    if (type === 'beginClip') {
	      ctx.save();
	      ctx.beginPath();

	      continue;
	    }

	    if (type === 'clip') {
	      ctx.clip();

	      continue;
	    }

	    if (type === 'endClip') {
	      ctx.restore();

	      continue;
	    }

	    if (type === 'beginPath') {
	      ctx.beginPath();

	      continue;
	    }

	    if (type === 'closePath') {
	      ctx.closePath();

	      continue;
	    }

	    if (type === 'globalAlpha') {
	      this.globalAlphaStack.push(ctx.globalAlpha);
	      ctx.globalAlpha *= props.value;

	      continue;
	    }

	    if (type === 'endGlobalAlpha') {
	      ctx.globalAlpha = this.globalAlphaStack.pop();

	      continue;
	    }

	    if (type === 'hitRegion') {
	      matrix[0] = this.transformStack[this.transformStackIndex - 6];
	      matrix[1] = this.transformStack[this.transformStackIndex - 5];
	      matrix[2] = this.transformStack[this.transformStackIndex - 4];
	      matrix[3] = this.transformStack[this.transformStackIndex - 3];
	      matrix[4] = this.transformStack[this.transformStackIndex - 2];
	      matrix[5] = this.transformStack[this.transformStackIndex - 1];
	      cache = {
	        id: props.id,
	        points: transformPoints(props.points, matrix)
	      };
	      this.mouseRegions.push(cache);
	      this.touchRegions.push(cache);

	      continue;
	    }

	    if (type === 'imageSmoothingEnabled') {
	      this.imageSmoothingEnabledStack.push(ctx.imageSmoothingEnabled);
	      ctx.imageSmoothingEnabled = props.value;

	      continue;
	    }

	    if (type === 'endImageSmoothingEnabled') {
	      ctx.imageSmoothingEnabled = this.imageSmoothingEnabledStack.pop();
	      continue;
	    }
	  }

	  return this.applyStyles();
	};

	Renderer.create = function create(width, height, parent, worker) {
	  if (arguments.length > 2) {
	    return new Renderer(width, height, parent, worker);
	  }
	  if (arguments.length === 2) {
	    return new Renderer(width, height);
	  }
	  return new Renderer();
	};


	Renderer.prototype.resize = function(width, height) {
	  //only resize if the sizes are different, because it clears the canvas
	  if (this.canvas.width.toString() !== width.toString()) {
	    this.canvas.width = width;
	    if (this.parent !== document.body) {
	      this.parent.style.width = width + "px";
	    }
	  }
	  if (this.canvas.height.toString() !== height.toString()) {
	    this.canvas.height = height;
	    if (this.parent !== document.body) {
	      this.parent.style.height = height + "px";
	    }
	  }
	};

	Renderer.prototype.toImage = function toImage() {
	  var Img = __webpack_require__(10);
	  var img = new Img();
	  img.src = this.canvas.toDataURL('image/png');
	  return img;
	};


	Renderer.prototype.hookRender = function hookRender() {

	  //If the client has sent a 'ready' command and a tree exists
	  if (this.isReady) {
	    this.fireFrame();
	  }

	  return window.requestAnimationFrame(this.boundHookRenderFunction);
	};


	Renderer.prototype.cleanupMouseEvents = function cleanupMouseEvents() {
	  this.previousMouseData.x = this.mouseData.x;
	  this.previousMouseData.y = this.mouseData.y;
	  this.previousMouseData.state = this.mouseData.state;
	  this.previousMouseData.clicked = this.mouseData.clicked;
	  //copy the only active regions
	  this.previousMouseData.activeRegions =
	    this.mouseData.activeRegions.splice(0, this.mouseData.activeRegions.length);
	  this.mouseData.clicked = 0;
	  this.ranMouseEvent = false;
	};

	Renderer.prototype.cleanupTouchEvents = function cleanupTouchEvents() {
	  for(var i = 0; i < this.touchData.touches.length; i++) {
	    var touch = this.touchData.touches[i];
	    if (!touch.held) {
	      this.touchData.touches.splice(i, 1);
	      i -= 1;
	      continue;
	    }

	    touch.previousX = touch.x;
	    touch.previousY = touch.y;
	    touch.touched = false;
	    touch.activeRegions.splice(0, touch.activeRegions.length);
	  }
	};

	Renderer.prototype.hookMouseEvents = function hookMouseEvents() {
	  //whenever the mouse moves, report the position
	  window.document.addEventListener('mousemove', this.mouseMove.bind(this));

	  //only report mousedown on canvas
	  window.document.addEventListener('mousedown', this.mouseDown.bind(this));

	  //mouse up can happen anywhere
	  return window.document.addEventListener('mouseup', this.mouseUp.bind(this));
	};

	Renderer.prototype.hookTouchEvents = function hookTouchEvents() {
	  var listener = this.touchEvent.bind(this);
	  return ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(function(evt) {
	    return window.document.addEventListener(evt, listener);
	  });
	};

	Renderer.prototype.touchEvent = function touchEvent(evt) {
	  var rect = this.canvas.getBoundingClientRect(),
	      mousePoint = [0,0],
	      region,
	      i, j;

	  var type = evt.type,
	    touches = evt.changedTouches,
	    touchPoint,
	    touch;

	  for (i = 0; i < touches.length; i++) {
	    touch = touches.item(i);

	    if (type === 'touchstart') {
	      this.touchData.touches.push(touchPoint = {
	        x: 0,
	        y: 0,
	        activeRegions: [],
	        id: touch.identifier,
	        touched: true,
	        moved: false,
	        held: true
	      });
	    }

	    if (type === 'touchend' || type === 'touchcancel') {
	      for (j = 0; j < this.touchData.length; j++) {
	        touchPoint = this.touchData.touches[j];
	        if (touchPoint.id === touch.identifier) {
	          touchPoint.activeRegions.splice(0, touchPoint.activeRegions.length);
	          touchPoint.held = false;
	          break;
	        }
	      }
	    }

	    if (type === 'touchmove') {
	      for (j = 0; j < this.touchData.length; j++) {
	        touchPoint = this.touchData.touches[j];
	        if (touchPoint.id === touch.identifier) {
	          touchPoint.moved = true;
	          break;
	        }
	      }
	    }

	    mousePoint[0] = touchPoint.x = touch.clientX - rect.left;
	    mousePoint[1] = touchPoint.y = touch.clientY - rect.top;



	    for (j = 0; j < this.touchRegions.length; j++) {
	      region = this.touchRegions[j];
	      if (pointInPolygon(mousePoint, region.points)) {
	        touchPoint.activeRegions.push(region.id);
	      }
	    }

	  }

	  this.lastTouchEvent = evt;
	  this.ranTouchEvent = true;


	  evt.preventDefault();
	  this.emit('touch', this.touchData);
	  return false;
	};

	Renderer.prototype.mouseMove = function mouseMove(evt) {
	  //get bounding rectangle
	  var rect = this.canvas.getBoundingClientRect(),
	      mousePoint = [0,0],
	      region;
	  this.lastMouseEvent = evt;
	  this.ranMouseEvent = true;

	  mousePoint[0] = evt.clientX - rect.left;
	  mousePoint[1] = evt.clientY - rect.top;

	  for(var i = 0; i < this.mouseRegions.length; i++) {
	    region = this.mouseRegions[i];
	    if (pointInPolygon(mousePoint, region.points)) {
	      this.mouseData.activeRegions.push(region.id);
	      this.mouseRegions.splice(this.mouseRegions.indexOf(region), 1);
	      i -= 1;
	    }
	  }

	  this.mouseData.x = mousePoint[0];
	  this.mouseData.y = mousePoint[1];

	  this.emit('mouse', this.mouseData);
	  //default event stuff
	  evt.preventDefault();
	  return false;
	};

	Renderer.prototype.mouseDown = function mouseMove(evt) {
	  //set the mouseState down
	  if (evt.target === this.canvas) {
	    if (this.mouseData.state === 'up') {
	      this.mouseData.clicked += 1;
	    }
	    this.mouseData.state = 'down';
	    this.canvas.focus();
	    //defer to mouseMove
	    return this.mouseMove(evt);
	  }
	};

	Renderer.prototype.mouseUp = function mouseMove(evt) {
	  //set the mouse state
	  this.mouseData.state = 'up';
	  //defer to mouse move
	  return this.mouseMove(evt);
	};

	Renderer.prototype.hookKeyboardEvents = function hookKeyboardEvents() {

	  //every code in keycode.code needs to be on keyData
	  for (var name in keycode.code) {
	    if (keycode.code.hasOwnProperty(name)) {
	      this.keyData[name] = "up";
	    }
	  }

	  //keydown should only happen ON the canvas
	  this.canvas.addEventListener('keydown', this.keyDown.bind(this));

	  //but keyup should be captured everywhere
	  return window.document.addEventListener('keyup', this.keyUp.bind(this));
	};

	Renderer.prototype.keyChange = function keyChange(evt) {
	  this.emit('key', this.keyData);
	  evt.preventDefault();
	  return false;
	};

	Renderer.prototype.keyDown = function keyDown(evt) {
	  this.keyData[keycode(evt.keyCode)] = "down";
	  return this.keyChange(evt);
	};

	Renderer.prototype.keyUp = function keyUp(evt) {
	  this.keyData[keycode(evt.keyCode)] = "up";
	  return this.keyChange(evt);
	};

	Renderer.prototype.fireFrame = function() {
	  //fire the mouse event again if it wasn't run
	  if (this.lastMouseEvent && !this.ranMouseEvent) {
	    this.mouseMove(this.lastMouseEvent);
	  }

	  if (this.lastTouchEvent && !this.ranTouchEvent) {
	    this.touchEvent(this.lastMouseEvent);
	  }

	  this.mouseRegions.splice(0, this.mouseRegions.length);
	  this.touchRegions.splice(0, this.touchRegions.length);

	  this.emit('frame', {});
	  this.activeRegions.splice(0, this.activeRegions.length);

	  this.cleanupMouseEvents();
	  this.cleanupTouchEvents();
	  return this;
	};

	Renderer.prototype.style = function style() {
	  var children = [],
	      styles = [],
	      concat = children.concat,
	      len,
	      i,
	      child,
	      name;
	  for(i = 0, len = arguments.length; i < len; i++) {
	    children.push(arguments[i]);
	  }

	  for (i = 0, len = children.length; i < len; i++) {
	    child = children[i];
	    if (child && child.constructor === Array) {
	      children = concat.apply([], children);
	      child = children[i];
	      while(child && child.constructor === Array) {
	        children = concat.apply([], children);
	        child = children[i];
	      }
	      len = children.length;
	    }
	    if (child) {
	      styles.push(child);
	    }
	  }
	  for (i = 0; i < styles.length; i++) {
	    this.styleQueue.push(styles[i]);
	  }
	  return this;
	};

	Renderer.prototype.applyStyles = function applyStyles() {
	  var styleVal, value;
	  for(var i = 0; i < this.styleQueue.length; i++) {
	    styleVal = this.styleQueue[i];
	    for(var name in styleVal) {
	      if (styleVal.hasOwnProperty(name)) {
	        this.canvas.style[name] = styleVal[name];
	      }
	    }
	  }
	  this.styleQueue.splice(0, this.styleQueue.length);
	  return this;
	};

	Renderer.prototype.ready = function ready() {
	  this.isReady = true;
	  this.fireFrame();
	  return window.requestAnimationFrame(this.hookRender.bind(this));
	};

	Renderer.prototype.measureText = function measureText(font, text) {
	  var oldFont = this.ctx.font,
	      result;

	  this.ctx.font = font;
	  result = this.ctx.measureText(text);
	  this.ctx.font = oldFont;
	  return result;
	};

	Renderer.prototype.increaseTransformStackSize = function increaseTransformStackSize() {
	  var cache = this.transformStack;
	  this.transformStack = new Float64Array(this.transformStack.length + 600); //add 100 more
	  this.transformStack.set(cache);
	  return this;
	};

	Object.defineProperty(Renderer.prototype, 'height', {
	  get: function() {
	    return this.canvas.width;
	  },
	  enumerable: true,
	  configurable: false
	});
	Object.defineProperty(Renderer.prototype, 'width', {
	  get: function() {
	    return this.canvas.width;
	  },
	  enumerable: true,
	  configurable: false
	});
	Object.seal(Renderer);
	Object.seal(Renderer.prototype);
	module.exports = Renderer;


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	if (typeof window !== 'undefined') {
	  var ctx = window.document.createElement('canvas').getContext('2d');
	}
	var concat = [].concat;

	function createLinearGradient(x0, y0, x1, y1) {
	  var grd = ctx.createLinearGradient(x0, y0, x1, y1),
	    children = [];
	  for(var i = 0; i < arguments.length; i++) {
	    children.push(arguments[i]);
	  }
	  for(i = 0; i < children.length; i++) {
	    //parse and flatten the arguments
	    while (children[i] && children[i].constructor === Array) {
	      children = concat.apply([], children);
	    }
	    var colorStop = children[i];
	    if (colorStop && colorStop.type === 'addColorStop') {
	      grd.addColorStop(colorStop.props.offset, colorStop.props.color);
	    }
	  }

	  return grd;
	}


	module.exports = createLinearGradient;


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	if (typeof window !== 'undefined') {
	  var ctx = window.document.createElement('canvas').getContext('2d'),
	    concat = [].concat;
	}

	function createRadialGradient(x0, y0, r0, x1, y1, r1) {
	  var grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1),
	    children = [];
	  for(var i = 0; i < arguments.length; i++) {
	    children.push(arguments[i]);
	  }
	  for(i = 0; i < children.length; i++) {
	    //parse and flatten the arguments
	    while (children[i] && children[i].constructor === Array) {
	      children = concat.apply([], children);
	    }
	    var colorStop = children[i];
	    if (colorStop && colorStop.type === 'addColorStop') {
	      grd.addColorStop(colorStop.props.offset, colorStop.props.color);
	    }
	  }

	  return grd;
	}


	module.exports = createRadialGradient;


/***/ },
/* 6 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	// Source: http://jsfiddle.net/vWx8V/
	// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes

	/**
	 * Conenience method returns corresponding value for given keyName or keyCode.
	 *
	 * @param {Mixed} keyCode {Number} or keyName {String}
	 * @return {Mixed}
	 * @api public
	 */

	exports = module.exports = function(searchInput) {
	  // Keyboard Events
	  if (searchInput && 'object' === typeof searchInput) {
	    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
	    if (hasKeyCode) searchInput = hasKeyCode
	  }

	  // Numbers
	  if ('number' === typeof searchInput) return names[searchInput]

	  // Everything else (cast to string)
	  var search = String(searchInput)

	  // check codes
	  var foundNamedKey = codes[search.toLowerCase()]
	  if (foundNamedKey) return foundNamedKey

	  // check aliases
	  var foundNamedKey = aliases[search.toLowerCase()]
	  if (foundNamedKey) return foundNamedKey

	  // weird character?
	  if (search.length === 1) return search.charCodeAt(0)

	  return undefined
	}

	/**
	 * Get by name
	 *
	 *   exports.code['enter'] // => 13
	 */

	var codes = exports.code = exports.codes = {
	  'backspace': 8,
	  'tab': 9,
	  'enter': 13,
	  'shift': 16,
	  'ctrl': 17,
	  'alt': 18,
	  'pause/break': 19,
	  'caps lock': 20,
	  'esc': 27,
	  'space': 32,
	  'page up': 33,
	  'page down': 34,
	  'end': 35,
	  'home': 36,
	  'left': 37,
	  'up': 38,
	  'right': 39,
	  'down': 40,
	  'insert': 45,
	  'delete': 46,
	  'command': 91,
	  'left command': 91,
	  'right command': 93,
	  'numpad *': 106,
	  'numpad +': 107,
	  'numpad -': 109,
	  'numpad .': 110,
	  'numpad /': 111,
	  'num lock': 144,
	  'scroll lock': 145,
	  'my computer': 182,
	  'my calculator': 183,
	  ';': 186,
	  '=': 187,
	  ',': 188,
	  '-': 189,
	  '.': 190,
	  '/': 191,
	  '`': 192,
	  '[': 219,
	  '\\': 220,
	  ']': 221,
	  "'": 222
	}

	// Helper aliases

	var aliases = exports.aliases = {
	  'windows': 91,
	  '⇧': 16,
	  '⌥': 18,
	  '⌃': 17,
	  '⌘': 91,
	  'ctl': 17,
	  'control': 17,
	  'option': 18,
	  'pause': 19,
	  'break': 19,
	  'caps': 20,
	  'return': 13,
	  'escape': 27,
	  'spc': 32,
	  'pgup': 33,
	  'pgdn': 34,
	  'ins': 45,
	  'del': 46,
	  'cmd': 91
	}


	/*!
	 * Programatically add the following
	 */

	// lower case chars
	for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

	// numbers
	for (var i = 48; i < 58; i++) codes[i - 48] = i

	// function keys
	for (i = 1; i < 13; i++) codes['f'+i] = i + 111

	// numpad keys
	for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96

	/**
	 * Get by code
	 *
	 *   exports.name[13] // => 'Enter'
	 */

	var names = exports.names = exports.title = {} // title for backward compat

	// Create reverse mapping
	for (i in codes) names[codes[i]] = i

	// Add aliases
	for (var alias in aliases) {
	  codes[alias] = aliases[alias]
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	function transformPoints(points, matrix) {
	  var result = [],
	      len = points.length,
	      point;

	  for(var i = 0; i < len; i++) {
	    point = points[i];
	    result.push([
	      matrix[0] * point[0] + matrix[2] * point[1] + matrix[4],
	      matrix[1] * point[0] + matrix[3] * point[1] + matrix[5]
	    ]);
	  }
	  return result;
	}

	module.exports = transformPoints;


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function (point, vs) {
	    // ray-casting algorithm based on
	    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	    
	    var x = point[0], y = point[1];
	    
	    var inside = false;
	    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
	        var xi = vs[i][0], yi = vs[i][1];
	        var xj = vs[j][0], yj = vs[j][1];
	        
	        var intersect = ((yi > y) != (yj > y))
	            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
	        if (intersect) inside = !inside;
	    }
	    
	    return inside;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var path = __webpack_require__(11),
	    events = __webpack_require__(6);

	function Img() {
	  events.EventEmitter.call(this);
	  this.imageElement = null;
	  this.imagePattern = null;
	  this.imagePatternRepeat = null;

	  return Object.seal(this);
	}

	Img.prototype = Object.create(events.EventEmitter.prototype);

	Object.defineProperty(Img.prototype, 'src', {
	  set: function(val) {

	    var element = new Image();
	    this.imageElement = element;
	    element.src = val;

	    if (element.complete) { //firefox compatibility code
	      setTimeout(this.imageLoad.bind(this), 0);
	    } else {
	      element.onload = this.imageLoad.bind(this);
	    }
	  },
	  get: function() {
	    return this.imageElement.src;
	  }
	});

	Img.prototype.imageLoad = function imageLoad() {

	  var ctx = window.document.createElement('canvas').getContext('2d');
	  this.imagePattern = ctx.createPattern(this.imageElement, 'no-repeat');
	  this.imagePatternRepeat = ctx.createPattern(this.imageElement, 'repeat');

	  return this.emit('load', this);
	};

	Object.defineProperty(Img.prototype, 'width', {
	  enumerable: true,
	  get: function() {
	    return this.imageElement.width;
	  },
	  set: function(value) {
	    this.imageElement.width = value;
	  }
	});

	Object.defineProperty(Img.prototype, 'height', {
	  enumerable: true,
	  get: function() {
	    return this.imageElement.height;
	  },
	  set: function(value) {
	    this.imageElement.height = value;
	  }
	});

	Object.seal(Img);
	Object.seal(Img.prototype);

	module.exports = Img;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 12 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	function Instruction(type, props) {
	  this.type = type;
	  this.props = props;
	  return Object.seal(this);
	}

	Object.seal(Instruction);
	Object.seal(Instruction.prototype);

	module.exports = Instruction;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function addColorStop(offset, color) {
	  return new Instruction('addColorStop', { offset: offset, color: color });
	}

	module.exports = addColorStop;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function arc(x, y, r, startAngle, endAngle, anticlockwise) {
	  if (arguments.length > 5) {
	    return new Instruction(anticlockwise ? 'anticlockwise-arc' : 'arc', { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
	  }
	  if (arguments.length === 5) {
	    return new Instruction('arc', { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
	  }
	  if (arguments.length >= 3) {
	    return new Instruction('full-arc', { x: x, y: y, r: r});
	  }
	  if (arguments.length >= 1) {
	    return new Instruction('quick-arc', { r: x });
	  }

	  return new Instruction('quick-arc', { r: 1 });
	}

	module.exports = arc;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function arcTo(x1, y1, x2, y2, r) {
	  return new Instruction('arcTo', { x1: x1, y1: y1, x2: x2, y2: y2, r: r });
	}

	module.exports = arcTo;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	//jshint node: true
	'use strict';
	var Instruction = __webpack_require__(13);

	function beginPath() {
	  return new Instruction('beginPath');
	}
	module.exports = beginPath;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
	  return new Instruction('bezierCurveTo', {
	    cp1x: cp1x,
	    cp1y: cp1y,
	    cp2x: cp2x,
	    cp2y: cp2y,
	    x: x,
	    y: y
	  });
	}

	module.exports = bezierCurveTo;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function clearRect(x, y, width, height) {
	  if (arguments.length > 2) {
	    return new Instruction('clearRect', { x: x, y: y, width: width, height: height });
	  } else {
	    return new Instruction('clearRect', { x: 0, y: 0, width: x, height: y });
	  }
	}

	module.exports = clearRect;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function clip(path, children) {
	  var result = [new Instruction('beginClip'), path, new Instruction('clip')];

	  for(var i = 1; i < arguments.length; i++) {
	    result.push(arguments[i]);
	  }

	  result.push(new Instruction('endClip'));
	  return result;
	}

	module.exports = clip;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function clipPath() {
	  return new Instruction('clipPath');
	}
	module.exports = clipPath;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function closePath() {
	  return new Instruction('closePath');
	}
	module.exports = closePath;


/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	var concat = [].concat;

	function createClass() {
	  var args = [], i;

	  //copy the arguments to an array
	  for(i = 0; i < arguments.length; i++) {
	    args.push(arguments[i]);
	  }

	  for(i = 0; i < args.length; i++) {
	    //parse and flatten the arguments
	    while (args[i] && args[i].constructor === Array) {
	      args = concat.apply([], args);
	    }
	    if (args[i] && args[i].type === 'placeholder') {
	       // i is set to the placeholder index now
	      break;
	    }
	  }
	  return (function() {
	    //store these variables at the top of the heap internally
	    var start = args, end = start.splice(i + 1, args.length);

	    //remove the placeholder
	    start.pop();

	    //return a function that wraps the arguments in the class instructions
	    return function createdClass() {
	      var children = [], i;
	      for(i = 0; i < arguments.length; i++) {
	        children.push(arguments[i]);
	      }
	      return [
	        start, children, end
	      ];
	    };
	  }());
	}

	module.exports = createClass;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	if (typeof window !== 'undefined') {
	  var ctx = document.createElement('canvas').getContext('2d'),
	    Img = __webpack_require__(10);
	}

	function createImagePattern(img, type) {
	  if (img) {
	    return ctx.createImagePattern(
	      //if the type is Img, use the imageElement property
	      img.constructor === Img ? img.imageElement : img,
	      type //'repeat', 'repeat-x', 'repeat-y', 'no-repeat'
	    );
	  }
	  return null;
	}

	module.exports = createImagePattern;


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	function createRegularPolygon(radius, position, sides) {
	  radius = +radius || 1;
	  position[0] = +position[0] || 0;
	  position[1] = +position[1] || 0;
	  sides = +sides || 3;
	  var polygon = [];
	  for(var i = 0; i < sides; i++) {
	    polygon.push([
	      position[0] + radius * Math.cos(Math.PI * 2 * i / sides),
	      position[1] + radius * Math.sin(Math.PI * 2 * i / sides)
	    ]);
	  }
	  return polygon;
	}

	module.exports = createRegularPolygon;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Instruction = __webpack_require__(13);

	function drawCanvas(canvas, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
	  if (arguments.length === 9) {
	    return new Instruction('drawCanvasSource', {
	      img: canvas,
	      sx: sx,
	      sy: sy,
	      sWidth: sWidth,
	      sHeight: sHeight,
	      dx: dx,
	      dy: dy,
	      dWidth: dWidth,
	      dHeight: dHeight
	    });
	  }

	  if (arguments.length >= 5) {
	    return new Instruction('drawCanvasSize', {
	      img: canvas,
	      dx: sx,
	      dy: sy,
	      dWidth: sWidth,
	      dHeight: sHeight
	    });
	  }

	  if (arguments.length >= 3) {
	    return new Instruction('drawCanvas', {
	      img: canvas,
	      dx: sx,
	      dy: sy
	    });
	  }

	  return new Instruction('drawCanvas', {
	    img: canvas,
	    dx: 0,
	    dy: 0
	  });
	}

	module.exports = drawCanvas;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
	  if (arguments.length === 9) {
	    return new Instruction('drawImageSource', {
	      img: img,
	      sx: sx,
	      sy: sy,
	      sWidth: sWidth,
	      sHeight: sHeight,
	      dx: dx,
	      dy: dy,
	      dWidth: dWidth,
	      dHeight: dHeight
	    });
	  }

	  if (arguments.length >= 5) {
	    return new Instruction('drawImageSize', {
	      img: img,
	      dx: sx,
	      dy: sy,
	      dWidth: sWidth,
	      dHeight: sHeight
	    });
	  }

	  if (arguments.length >= 3) {
	    return new Instruction('drawImage', {
	      img: img,
	      dx: sx,
	      dy: sy
	    });
	  }

	  return new Instruction('drawImage', {
	    img: img,
	    dx: 0,
	    dy: 0
	  });
	}

	module.exports = drawImage;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Instruction = __webpack_require__(13);

	function ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
	  if (arguments.length > 7) {
	    return new Instruction(anticlockwise ? 'anticlockwise-ellipse' : 'ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY, startAngle: startAngle, endAngle: endAngle });
	  }

	  if (arguments.length === 7) {
	    return new Instruction('ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY, rotation: rotation, startAngle: startAngle, endAngle: endAngle });
	  }
	  if (arguments.length >= 5) {
	    return new Instruction('full-ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY, rotation: rotation });
	  }
	  if (arguments.length === 4) {
	    return new Instruction('quick-ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY });
	  }
	  return new Instruction('quick-ellipse', { x: 0, y: 0, radiusX: x, radiusY: y });
	}

	module.exports = ellipse;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Instruction = __webpack_require__(13);

	function fill() {
	  return new Instruction('fill');
	}

	module.exports = fill;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Instruction = __webpack_require__(13),
	    pi2 = Math.PI * 2;

	function fillArc(x, y, r, startAngle, endAngle, counterclockwise) {
	  if (arguments.length >= 6 && counterclockwise) {
	    return new Instruction("fillArc-counterclockwise", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });

	  }
	  if (arguments.length > 3) {
	    return new Instruction("fillArc", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
	  }
	  if (arguments.length > 1){
	    return new Instruction("fillArc", { x: x, y: y, r: r, startAngle: 0, endAngle: pi2 });
	  }
	  return new Instruction("fillArc",  { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2 });
	}

	module.exports = fillArc;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Instruction = __webpack_require__(13);

	function fillImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
	  if (arguments.length === 9) {
	    return new Instruction('fillCanvasSource', {
	      img: img,
	      sx: sx,
	      sy: sy,
	      sWidth: sWidth,
	      sHeight: sHeight,
	      dx: dx,
	      dy: dy,
	      dWidth: dWidth,
	      dHeight: dHeight
	    });
	  }

	  if (arguments.length >= 5) {
	    return new Instruction('fillCanvasSize', {
	      img: img,
	      dx: sx,
	      dy: sy,
	      dWidth: sWidth,
	      dHeight: sHeight
	    });
	  }

	  if (arguments.length >= 3) {
	    return new Instruction('fillCanvas', {
	      img: img,
	      dx: sx,
	      dy: sy
	    });
	  }

	  return new Instruction('fillCanvas', {
	    img: img,
	    dx: 0,
	    dy: 0
	  });
	}

	module.exports = fillImage;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Instruction = __webpack_require__(13);

	function fillImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
	  if (arguments.length === 9) {
	    return new Instruction('fillImageSource', {
	      img: img,
	      sx: sx,
	      sy: sy,
	      sWidth: sWidth,
	      sHeight: sHeight,
	      dx: dx,
	      dy: dy,
	      dWidth: dWidth,
	      dHeight: dHeight
	    });
	  }

	  if (arguments.length >= 5) {
	    return new Instruction('fillImageSize', {
	      img: img,
	      dx: sx,
	      dy: sy,
	      dWidth: sWidth,
	      dHeight: sHeight
	    });
	  }

	  if (arguments.length >= 3) {
	    return new Instruction('fillImage', {
	      img: img,
	      dx: sx,
	      dy: sy
	    });
	  }

	  return new Instruction('fillImage', {
	    img: img,
	    dx: 0,
	    dy: 0
	  });
	}

	module.exports = fillImage;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function fillImagePattern(img, dx, dy, dWidth, dHeight) {
	  if (arguments.length >= 5) {
	    return new Instruction('fillImagePattern', {
	      img: img,
	      dx: dx,
	      dy: dy,
	      dWidth: dWidth,
	      dHeight: dHeight
	    });
	  }

	  if (arguments.length >= 3) {
	    return new Instruction('fillImagePattern', {
	      img: img,
	      dx: 0,
	      dy: 0,
	      dWidth: dx,
	      dHeight: dy
	    });
	  }

	  return new Instruction('fillImagePattern', {
	    img: img,
	    dx: 0,
	    dy: 0,
	    dWidth: 0,
	    dHeight: 0
	  });
	}

	module.exports = fillImagePattern;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function fillRect(x, y, width, height) {
	  if (arguments.length >= 4) {
	    return new Instruction("fillRect", { x: x, y: y, width: width, height: height });
	  } else {
	    return new Instruction("fillRect", { x: 0, y: 0, width: x, height: y });
	  }
	}

	module.exports = fillRect;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function fillStyle(value, children) {
	  var result = [new Instruction('fillStyle', { value: value })];

	  for(var i = 1; i < arguments.length; i++) {
	    result.push(arguments[i]);
	  }
	  result.push(new Instruction('endFillStyle'));
	  return result;
	}

	module.exports = fillStyle;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	module.exports = function fillText(text, x, y, maxWidth) {
	  if (arguments.length < 4) {
	    maxWidth = null;
	  }
	  if (arguments.length < 3) {
	    x = 0;
	    y = 0;
	  }
	  return new Instruction('fillText', {
	    text: text,
	    x: x,
	    y: y,
	    maxWidth: maxWidth
	  });
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function globalAlpha(alpha, children) {
	  var result = [new Instruction('globalAlpha', { value: alpha })];
	  for(var i = 1; i < arguments.length; i++) {
	    result.push(arguments[i]);
	  }
	  result.push(new Instruction('endGlobalAlpha'));
	  return result;
	}

	module.exports = globalAlpha;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function globalCompositeOperation(operationType, children) {
	  var result = [new Instruction('globalCompositeOperation', { value: operationType })];
	  if (arguments.length === 0) {
	    return [];
	  }

	  for (var i = 1; i < arguments.length; i++) {
	    result.push(arguments[i]);
	  }
	  result.push(new Instruction('endGlobalCompositeOperation'));
	  return result;
	}

	module.exports = globalCompositeOperation;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13),
	    hitRegion = __webpack_require__(40);

	function hitRect(id, x, y, width, height) {
	  if (arguments.length <= 3) {
	    width = x;
	    height = y;
	    x = 0;
	    y = 0;
	  }

	  var points = [
	    [x, y],
	    [x, y + height],
	    [x + width, y + height],
	    [x + width, y]
	  ];

	  return hitRegion(id, points);
	}

	module.exports = hitRect;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function hitRegion(id, points) {
	  return new Instruction('hitRegion', {
	    id: id,
	    points: points
	  });
	}

	module.exports = hitRegion;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	module.exports = function imageSmoothingEnabled(val, children) {
	  children = [];
	  for(var i = 1; i < arguments.length; i++) {
	    children.push(arguments[i]);
	  }
	  return [new Instruction('imageSmoothingEnabled', { value: Boolean(val) })].concat(children).concat(new Instruction('endImageSmoothingEnabled'));
	};


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function lineStyle(value, children) {

	  value = value || {};
	  var result = {
	    lineWidth: null,
	    lineCap: null,
	    lineJoin: null,
	    miterLimit: null,
	    lineDash: [],
	    lineDashOffset: null
	  };

	  if (typeof value.lineWidth !== 'undefined') {
	    result.lineWidth = value.lineWidth;
	  }
	  if (typeof value.lineCap !== 'undefined') {
	    result.lineCap = value.lineCap;
	  }
	  if (typeof value.lineJoin !== 'undefined') {
	    result.lineJoin = value.lineJoin;
	  }
	  if (typeof value.miterLimit !== 'undefined') {
	    result.miterLimit = value.miterLimit;
	  }
	  if (typeof value.lineDash !== 'undefined') {
	    result.lineDash = value.lineDash;
	  }
	  if (typeof value.lineDashOffset !== 'undefined') {
	    result.lineDashOffset = value.lineDashOffset;
	  }
	  var tree = [new Instruction('lineStyle', result)];
	  for(var i = 1; i < arguments.length; i++) {
	    tree.push(arguments[i]);
	  }
	  tree.push(new Instruction('endLineStyle'));
	  return tree;
	}

	module.exports = lineStyle;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function lineTo(x, y) {
	  if (arguments.length === 0) {
	    return new Instruction('lineTo', { x: 0, y: 0});
	  }
	  return new Instruction('lineTo', { x: x, y: y });
	}

	module.exports = lineTo;


/***/ },
/* 44 */
/***/ function(module, exports) {

	'use strict';
	if (typeof window !== 'undefined') {
	  var ctx = document.createElement('canvas').getContext('2d');
	}

	function measureText(text, font) {
	  ctx.font = font;
	  return ctx.measureText(text);
	}

	module.exports = measureText;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function moveTo(x, y) {
	  if (arguments.length === 0) {
	    return new Instruction('moveTo', { x: 0, y: 0});
	  }
	  return new Instruction('moveTo', { x: x, y: y });
	}

	module.exports = moveTo;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var moveTo = __webpack_require__(45), lineTo = __webpack_require__(43);

	function moveToLineTo(point, index) {
	  return index === 0 ? moveTo(point[0], point[1]) : lineTo(point[0], point[1]);
	}

	module.exports = moveToLineTo;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var beginPath = __webpack_require__(17),
	    closePath = __webpack_require__(22);

	function path(children) {
	  var result = [beginPath()];
	  for(var i = 0; i < arguments.length; i++) {
	    result.push(arguments[i]);
	  }
	  result.push(closePath());
	  return result;
	}

	module.exports = path;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	module.exports = function placeHolder() {
	  return new Instruction('placeholder');
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function quadraticCurveTo(cpx, cpy, x, y) {
	  return new Instruction('quadraticCurveTo', {
	    cpx: cpx,
	    cpy: cpy,
	    x: x,
	    y: y
	  });
	}

	module.exports = quadraticCurveTo;


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function rect(x, y, width, height) {
	  if (arguments.length > 2) {
	    return new Instruction("rect", { x: x, y: y, width: width, height: height });
	  } else {
	    return new Instruction("rect", { x: 0, y: 0, width: x, height: y });
	  }
	}

	module.exports = rect;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var setTransform = __webpack_require__(52);

	module.exports = function resetTransform() {
	  var args = [];
	  for(var i = 0; i < arguments.length; i++) {
	    args.push(arguments[i]);
	  }
	  return setTransform([1, 0, 0, 1, 0, 0], args);
	};


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	module.exports = function(matrix, children) {

	  var result = [new Instruction('setTransform', [
	    matrix[0],
	    matrix[1],
	    matrix[2],
	    matrix[3],
	    matrix[4],
	    matrix[5]
	  ])];
	  for(var i = 1; i < arguments.length; i++) {
	    result.push(arguments[i]);
	  }
	  result.push(new Instruction('restore'));
	  return result;
	};


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function rotate(r, children) {
	  r = +r;
	  var result = [new Instruction('rotate', { cos: Math.cos(r), sin: Math.sin(r) })];
	  for(var i = 1; i < arguments.length; i++) {
	    result.push(arguments[i]);
	  }
	  result.push(new Instruction('restore'));
	  return result;
	}

	module.exports = rotate;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function scale(x, y, children) {
	  var i = 2;
	  if (typeof y !== 'number') {
	    y = x;
	    i = 1;
	  }
	  children = children || [];

	  var result = [new Instruction('scale', { x: x, y: y })],
	      child;
	  for (; i < arguments.length; i++) {
	    result.push(arguments[i]);
	  }
	  result.push(new Instruction('restore'));
	  return result;
	}

	module.exports = scale;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function shadowStyle(value, children) {
	  value = value || {};
	  var result = {
	    shadowBlur: null,
	    shadowColor: null,
	    shadowOffsetX: null,
	    shadowOffsetY: null
	  };

	  if (typeof value.shadowBlur !== 'undefined') {
	    result.shadowBlur = value.shadowBlur;
	  }
	  if (typeof value.shadowColor !== 'undefined') {
	    result.shadowColor = value.shadowColor;
	  }
	  if (typeof value.shadowOffsetX !== 'undefined') {
	    result.shadowOffsetX = value.shadowOffsetX;
	  }
	  if (typeof value.direction !== 'undefined') {
	    result.shadowOffsetY = value.shadowOffsetY;
	  }

	  var tree = [new Instruction('shadowStyle', value)];
	  for (var i = 1; i < arguments.length; i++) {
	    tree.push(arguments[i]);
	  }
	  tree.push(new Instruction('endShadowStyle'));

	  return tree;
	}

	module.exports = shadowStyle;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function skewX(x, children){
	  var result = [new Instruction('skewX', { x: Math.tan(x) })];
	  for (var i = 1; i < arguments.length; i++){
	      result.push(arguments[i]);
	  }
	  result.push(new Instruction('restore'));
	  return result;
	}

	module.exports = skewX;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function skewY(y, children){
	  var result = [new Instruction('skewY', { y: Math.tan(y) })];
	  for (var i = 1; i < arguments.length; i++){
	      result.push(arguments[i]);
	  }
	  result.push(new Instruction('restore'));
	  return result;
	}

	module.exports = skewY;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function stroke() {
	  return new Instruction('stroke');
	}

	module.exports = stroke;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13),
	    pi2 = Math.PI * 2;

	function strokeArc(x, y, r, startAngle, endAngle, counterclockwise) {
	  if (arguments.length >= 6 && counterclockwise) {
	    return new Instruction("strokeArc-counterclockwise", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
	  }
	  if (arguments.length > 3) {
	    return new Instruction("strokeArc", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
	  }
	  if (arguments.length > 1){
	    return new Instruction("strokeArc", { x: x, y: y, r: r, startAngle: 0, endAngle: pi2 });
	  }
	  return new Instruction("strokeArc",  { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2 });
	}

	module.exports = strokeArc;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function strokeRect(x, y, width, height) {
	  if (arguments.length > 2) {
	    return new Instruction('strokeRect', { x: x, y: y, width: width, height: height });
	  } else {
	    return new Instruction('strokeRect', { x: 0, y: 0, width: x, height: y });
	  }
	}

	module.exports = strokeRect;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Instruction = __webpack_require__(13);

	function fillStyle(value, children) {
	  var result = [new Instruction('strokeStyle', { value: value })];
	  for(var i = 1; i < arguments.length; i++) {
	    result.push(arguments[i]);
	  }
	  result.push(new Instruction('endStrokeStyle'));
	  return result;
	}

	module.exports = fillStyle;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function strokeText(text, x, y, maxWidth) {
	  if (arguments.length < 4) {
	    maxWidth = null;
	  }
	  if (arguments.length < 3) {
	    x = 0;
	    y = 0;
	  }
	  return new Instruction('strokeText', {
	    text: text,
	    x: x,
	    y: y,
	    maxWidth: maxWidth
	  });
	}

	module.exports = strokeText;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function text(str, x, y, fill, stroke, maxWidth) {
	  if (arguments.length === 6) {
	    return new Instruction('text', {
	      x: x,
	      y: y,
	      fill: fill,
	      stroke: stroke,
	      text: str,
	      maxWidth: maxWidth
	    });
	  }
	  if (arguments.length === 5) {
	    return new Instruction('text', {
	      x: x,
	      y: y,
	      fill: fill,
	      stroke: stroke,
	      text: str,
	      maxWidth: 0
	    });
	  }

	  if (arguments.length === 4) {
	    return new Instruction('text', {
	      x: x,
	      y: y,
	      fill: fill,
	      stroke: false,
	      text: str,
	      maxWidth: 0
	    });
	  }

	  if (arguments.length === 3) {
	    return new Instruction('text', {
	      x: x,
	      y: y,
	      fill: true,
	      stroke: false,
	      text: str,
	      maxWidth: 0
	    });
	  }

	  return new Instruction('text', {
	    x: 0,
	    y: 0,
	    fill: true,
	    stroke: false,
	    text: str,
	    maxWidth: 0
	  });
	}

	module.exports = text;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function textStyle(value, children) {
	  value = value || {};
	  var result = {
	    font: null,
	    textAlign: null,
	    textBaseline: null,
	    direction: null
	  };

	  if (typeof value.font !== 'undefined') {
	    result.font = value.font;
	  }
	  if (typeof value.textAlign !== 'undefined') {
	    result.textAlign = value.textAlign;
	  }
	  if (typeof value.textBaseline !== 'undefined') {
	    result.textBaseline = value.textBaseline;
	  }
	  if (typeof value.direction !== 'undefined') {
	    result.direction = value.direction;
	  }
	  var tree = [new Instruction('textStyle', value)];
	  for(var i = 1; i < arguments.length; i++) {
	    tree.push(arguments[i]);
	  }
	  tree.push(new Instruction('endTextStyle'));
	  return tree;
	}

	module.exports = textStyle;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function transform(values, children) {
	  var transformResult = [
	    new Instruction('transform',[
	      values[0],
	      values[1],
	      values[2],
	      values[3],
	      values[4],
	      values[5]
	    ])
	  ];
	  for(var i = 1; i < arguments.length; i++) {
	    transformResult.push(arguments[i]);
	  }
	  transformResult.push(new Instruction('restore'));

	  return transformResult;
	}


	module.exports = transform;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Instruction = __webpack_require__(13);

	function translate(x, y, children) {
	  var result = [new Instruction('translate', { x: x, y: y })];

	  for (var i = 2; i < arguments.length; i++) {
	    result.push(arguments[i]);
	  }

	  result.push(new Instruction('restore'));
	  return result;
	}

	module.exports = translate;


/***/ }
/******/ ])
});
;