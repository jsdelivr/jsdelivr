/*!
* snakle.js 1.0.0 - Snake loader animation around the viewport borders.
* Copyright (c) 2016 maoosi <hello@sylvainsimao.fr> - https://github.com/maoosi/snakle.js
* License: MIT
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Snakle = factory());
}(this, (function () { 'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var knot = (function () {
  var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var events = {};

  function on(name, handler) {
    events[name] = events[name] || [];
    events[name].push(handler);
    return this;
  }

  function once(name, handler) {
    handler._once = true;
    on(name, handler);
    return this;
  }

  function off(name) {
    var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    handler ? events[name].splice(events[name].indexOf(handler), 1) : delete events[name];

    return this;
  }

  function emit(name) {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    // cache the events, to avoid consequences of mutation
    var cache = events[name] && events[name].slice();

    // only fire handlers if they exist
    cache && cache.forEach(function (handler) {
      // remove handlers added with 'once'
      handler._once && off(name, handler);

      // set 'this' context, pass args to handlers
      handler.apply(_this, args);
    });

    return this;
  }

  return _extends({}, object, {

    on: on,
    once: once,
    off: off,
    emit: emit
  });
});

var Snakle = function () {
    function Snakle(selector) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, Snakle);

        // instance constructor
        this.options = {
            thickness: options.thickness || 22,
            color: options.color || 'red',
            length: options.length || 10,
            speed: options.speed || 15
        };

        this.selector = typeof selector === 'string' ? document.querySelector(selector) : selector;

        this.emitter = knot();

        this.initiated = false;

        return this;
    }

    createClass(Snakle, [{
        key: '_globalVars',
        value: function _globalVars() {
            // global vars
            this.canvas = false;
            this.ctx = false;
            this.snake = [];
            this.parentWidth = this.selector.clientWidth;
            this.parentHeight = this.selector.clientHeight;
            this.direction = 'right';
            this.directionQueue = this.direction;
            this.anim = false;
            this.starter = false;
        }
    }, {
        key: '_throttle',
        value: function _throttle(callback, delay) {
            var _this = this,
                _arguments = arguments;

            // throttle function
            var last = void 0;
            var timer = void 0;
            return function () {
                var context = _this;
                var now = +new Date();
                var args = _arguments;
                if (last && now < last + delay) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        last = now;
                        callback.apply(context, args);
                    }, delay);
                } else {
                    last = now;
                    callback.apply(context, args);
                }
            };
        }
    }, {
        key: '_blendRGBColors',
        value: function _blendRGBColors(c0, c1, p) {
            // blend RGB colors
            var f = c0.split(',');
            var t = c1.split(',');
            var R = parseInt(f[0].slice(4));
            var G = parseInt(f[1]);
            var B = parseInt(f[2]);

            return 'rgb(' + (Math.round((parseInt(t[0].slice(4)) - R) * p) + R) + ',' + (Math.round((parseInt(t[1]) - G) * p) + G) + ',' + (Math.round((parseInt(t[2]) - B) * p) + B) + ')';
        }
    }, {
        key: '_blendHexColors',
        value: function _blendHexColors(c0, c1, p) {
            // blend Hex colors
            var f = parseInt(c0.slice(1), 16);
            var t = parseInt(c1.slice(1), 16);
            var R1 = f >> 16;
            var G1 = f >> 8 & 0x00FF;
            var B1 = f & 0x0000FF;
            var R2 = t >> 16;
            var G2 = t >> 8 & 0x00FF;
            var B2 = t & 0x0000FF;

            return '#' + (0x1000000 + (Math.round((R2 - R1) * p) + R1) * 0x10000 + (Math.round((G2 - G1) * p) + G1) * 0x100 + (Math.round((B2 - B1) * p) + B1)).toString(16).slice(1);
        }
    }, {
        key: '_blendColors',
        value: function _blendColors(color1, color2, percent) {
            // universal blend colors
            if (color1.length > 7) return this._blendRGBColors(color1, color2, percent);else return this._blendHexColors(color1, color2, percent);
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            var _this2 = this;

            // create events listeners
            this.resize = this._throttle(function (event) {
                _this2._resize();
            }, 250);

            window.addEventListener('resize', this.resize, false);
        }
    }, {
        key: '_unbindEvents',
        value: function _unbindEvents() {
            // remove events listeners
            window.removeEventListener('resize', this.resize, false);
        }
    }, {
        key: '_resize',
        value: function _resize() {
            // viewport resize triggered
            this.parentWidth = this.selector.clientWidth;
            this.parentHeight = this.selector.clientHeight;
            this.canvas.setAttribute('width', this.parentWidth);
            this.canvas.setAttribute('height', this.parentHeight);
            this.ctx = this.canvas.getContext('2d');
            this._drawSnake();

            this.emitter.emit('resize');
        }
    }, {
        key: '_createCanvas',
        value: function _createCanvas() {
            // create html5 canvas
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute('width', this.parentWidth);
            this.canvas.setAttribute('height', this.parentHeight);
            this.canvas.setAttribute('style', 'position:absolute;left:0;top:0;z-index:1;');
            this.selector.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }
    }, {
        key: '_createSnake',
        value: function _createSnake() {
            // create snake
            for (var i = this.options.length - 1; i > -1; i--) {
                var extra = i - this.canvas.width / this.options.thickness;
                var iX = extra > 0 ? this.canvas.width - this.options.thickness : i * this.options.thickness;
                var iY = extra > 0 ? extra * this.options.thickness : 0;

                this.snake.push({ x: iX, y: iY });
            }
        }
    }, {
        key: '_drawSnake',
        value: function _drawSnake() {
            // draw snake on canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (var i = 0; i < this.options.length; i++) {
                var x = this.snake[i].x;
                var y = this.snake[i].y;

                // Fix positioning issues on X
                if (x > this.canvas.width - this.options.thickness) {
                    x = this.canvas.width - this.options.thickness;
                } else if (x <= 0) {
                    x = 0;
                }

                // Fix positioning issues on Y
                if (y > this.canvas.height - this.options.thickness) {
                    y = this.canvas.height - this.options.thickness;
                } else if (y <= 0) {
                    y = 0;
                }

                // Snake color
                if (this.options.color.constructor === Array && this.options.color.length > 1) {
                    var blend = i * 100 / this.options.length / 100;
                    this.ctx.fillStyle = this._blendColors(this.options.color[0], this.options.color[1], blend);
                } else {
                    var color = this.options.color.constructor === Array ? this.options.color[0] : this.options.color;
                    this.ctx.fillStyle = color;
                }

                this.ctx.fillRect(x, y, this.options.thickness, this.options.thickness);
            }

            this.emitter.emit('draw');
        }
    }, {
        key: '_moveSnake',
        value: function _moveSnake() {
            // changing the snake's movement
            var x = this.snake[0].x;
            var y = this.snake[0].y;
            this.direction = this.directionQueue;

            if (this.direction === 'right') {
                x += this.options.thickness;
            } else if (this.direction === 'left') {
                x -= this.options.thickness;
            } else if (this.direction === 'up') {
                y -= this.options.thickness;
            } else if (this.direction === 'down') {
                y += this.options.thickness;
            }

            var tail = this.snake.pop();
            tail.x = x;
            tail.y = y;
            this.snake.unshift(tail);
        }
    }, {
        key: '_animStep',
        value: function _animStep(timestamp) {
            // snake animation frame
            if (!this.starter) this.starter = timestamp;

            if (timestamp - this.starter >= this.options.speed) {
                var head = this.snake[0];

                if (head.y >= this.canvas.height - this.options.thickness && this.directionQueue != 'left' && this.direction != 'left') {
                    // bottom wall collision
                    this.directionQueue = 'left';
                } else if (head.x <= 0 && this.directionQueue != 'up' && this.direction != 'up') {
                    // left wall collision
                    this.directionQueue = 'up';
                } else if (head.y <= 0 && this.directionQueue != 'right' && this.direction != 'right') {
                    // top wall collision
                    this.directionQueue = 'right';
                } else if (head.x >= this.canvas.width - this.options.thickness && this.directionQueue != 'down' && this.direction != 'down') {
                    // right wall collision
                    this.directionQueue = 'down';
                }

                this._drawSnake();
                this._moveSnake();

                this.starter = false;
            }

            this._playAnimation();
        }
    }, {
        key: '_playAnimation',
        value: function _playAnimation() {
            var _this3 = this;

            // start snake animation
            this.anim = window.requestAnimationFrame(function (timestamp) {
                _this3._animStep(timestamp);
            });
        }
    }, {
        key: '_pauseAnimation',
        value: function _pauseAnimation() {
            // pause snake animation
            if (this.anim) {
                window.cancelAnimationFrame(this.anim);
                this.anim = false;
                this.starter = false;
            }
        }
    }, {
        key: 'init',
        value: function init() {
            // init vars, canvas, and snake
            if (!this.initiated) {
                this._globalVars();
                this._createCanvas();
                this._createSnake();
                this._drawSnake();
                this._bindEvents();

                this.initiated = true;
                this.emitter.emit('init');
            }

            return this;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            // destroy snake & instance
            if (this.initiated) {
                this.stop();
                this._unbindEvents();
                this.canvas.parentNode.removeChild(this.canvas);
                this.canvas = false;
                this.ctx = false;
                this.snake = [];

                this.initiated = false;
                this.emitter.emit('destroy');

                this.emitter.off('init');
                this.emitter.off('destroy');
                this.emitter.off('reset');
                this.emitter.off('play');
                this.emitter.off('pause');
                this.emitter.off('stop');
                this.emitter.off('resize');
                this.emitter.off('draw');
            }

            return this;
        }
    }, {
        key: 'reset',
        value: function reset() {
            // reset snake position
            if (this.initiated) {
                this.snake = [];
                this._createSnake();
                this._drawSnake();

                this.emitter.emit('reset');
            }

            return this;
        }
    }, {
        key: 'play',
        value: function play() {
            // play animation
            this._playAnimation();

            this.emitter.emit('play');

            return this;
        }
    }, {
        key: 'pause',
        value: function pause() {
            // stop animation
            this._pauseAnimation();

            this.emitter.emit('pause');

            return this;
        }
    }, {
        key: 'stop',
        value: function stop() {
            // stop animation
            this.pause();
            this.reset();

            this.emitter.emit('stop');

            return this;
        }
    }, {
        key: 'on',
        value: function on() {
            var _emitter;

            return (_emitter = this.emitter).on.apply(_emitter, arguments);
        }
    }, {
        key: 'off',
        value: function off() {
            var _emitter2;

            return (_emitter2 = this.emitter).off.apply(_emitter2, arguments);
        }
    }, {
        key: 'once',
        value: function once() {
            var _emitter3;

            return (_emitter3 = this.emitter).once.apply(_emitter3, arguments);
        }
    }]);
    return Snakle;
}();

return Snakle;

})));
