/**
 * E2D Engine v1.0.7
 * @author Jack Dalton <jack@jackdalton.org>
 * Copyright © 2015 Jack Dalton under the MIT license (https://opensource.org/licenses/MIT)
 **/

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var E2D = {
  VERSION: "1.0.7"
};

E2D.Scene = (function () {
  /**
  * @param {Object} options - Scene options
  * @param {boolean} options.logging - Whether or not to log things.
  * @param {int} options.idLength - Default ID length for objects.
  */
  function Scene(options) {
    options = options || {};
    this._options = {};
    this._options.logging = options.logging || true;
    this._options.idLength = options.idLength || 16;
    if (this._options.logging) {
      console.log("E2D v" + E2D.VERSION);
    }
    this._ids = {};
    this._objects = {};
    this._disabledObjects = {};
    this._custom = options.custom || {};
    this._extensions = {};
  }
  Scene.prototype.render = function () {
    var self = this;
    var queue = [];
    for (var i in self._objects) {
      queue.push(self._objects[i]);
    }
    queue.sort(function (a, b) {
      return a._layer - b._layer;
    });
    for (i = 0; i < queue.length; i++) {
      queue[i].render();
    }
  };
  Scene.prototype._updateExtensions = function () {
    var self = this;
    for (var i in self._extensions) {
      self._extensions[i].fn();
    }
  };
  return Scene;
})();

/**
* @constructor
* @param {number} x - Vector x coordinate
* @param {number} y - Vector y coordinate
* @returns {object} pos - Position ({x: x, y: y})
*/
E2D.Scene.prototype.Vector2 = (function () {
  var Vector2 = (function () {
    function Vector2(x, y) {
      _classCallCheck(this, Vector2);

      this.x = typeof x == "number" ? x : 0;
      this.y = typeof y == "number" ? y : 0;
    }

    _createClass(Vector2, [{
      key: "getPos",
      value: function getPos() {
        return this;
      }
    }, {
      key: "getX",
      value: function getX() {
        return this.x;
      }
    }, {
      key: "getY",
      value: function getY() {
        return this.y;
      }
    }, {
      key: "setPos",
      value: function setPos(pos) {
        this.x = typeof pos.x == "number" ? pos.x : this.x;
        this.y = typeof pos.y == "number" ? pos.y : this.y;
      }
    }, {
      key: "setX",
      value: function setX(x) {
        this.x = typeof x == "number" ? x : this.x;
      }
    }, {
      key: "setY",
      value: function setY(y) {
        this.y = typeof y == "number" ? y : this.y;
      }
    }, {
      key: "distanceTo",
      value: function distanceTo(pos) {
        return Math.sqrt(Math.pow(pos.x - this.x, 2) + Math.pow(pos.y - this.y, 2));
      }
    }, {
      key: "midpoint",
      value: function midpoint(pos) {
        return new Vector2((this.x + pos.x) / 2, (this.y + pos.y) / 2);
      }
    }, {
      key: "translate",
      value: function translate(to) {
        if (arguments.length == 2) {
          this.x += typeof arguments[0] == "number" ? arguments[0] : 0;
          this.y += typeof arguments[1] == "number" ? arguments[1] : 0;
        } else if (to instanceof Vector2) {
          this.x += to.x || 0;
          this.y += to.y || 0;
        }
        return { x: this.x, y: this.y };
      }
    }]);

    return Vector2;
  })();

  return Vector2;
})();

/**
* @param {int} length - Length of ID to generate; default is 16 characters.
* @returns {string} id - Random ID to be used with anything.
*/
E2D.Scene.prototype.generateId = function (length) {
  var self = this;
  length = length || self._options.idLength;
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ$_",
      id = "";
  for (var i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
};

/**
* @param {Object} options - The object's options.
* @param {Object} options.pos - The object's position.
* @param {int} options.pos.x - The object's X coordinate.
* @param {int} options.pos.y - The object's Y coordinate.
* @param {function} options.renderer - Function to be called on object.render. The object is passed as a parameter when called.
* @param {int} options.layer - Rendering priority/layer -- Lower layer is rendered first
*/
E2D.Scene.prototype.addObject = function (options) {
  var self = this;
  options.pos = options.pos || {};
  if (typeof options == "undefined") {
    options = {
      pos: new self.Vector2(0, 0)
    };
  } else {
    if (typeof options.pos.x != "number" || typeof options.pos.y != "number") {
      if (self._options.logging) console.warn("Invalid position supplied. Using (0, 0) (@addObject)");
    }
  }
  var obj = {};
  obj.id = options.id || self.generateId();
  obj.body = {
    pos: options.pos
  };
  if (typeof options.custom != "undefined") {
    obj.custom = options.custom;
  }
  if (typeof options.renderer == "function") {
    obj._renderer = options.renderer;
    obj.render = function () {
      obj._renderer(obj, arguments);
    };
    obj._layer = options.layer || 0;
  }
  self._objects[obj.id] = obj;
  self._updateExtensions();
  return obj;
};

/**
* @param {string} id - ID of object to destroy.
* @returns {boolean} status - Whether the object was deleted.
*/
E2D.Scene.prototype.destroyObject = function (id) {
  var self = this;
  if (typeof self._objects[id] == "undefined") {
    if (self._options.logging) console.warn(id + " either doesn't exist, or hasn't been added to the scene. Object was not destroyed (@destroyObject)");
    return false;
  }
  delete self._objects[id];
  self._updateExtensions();
  return true;
};

/**
* @param {string} id - ID of object to enable
* @returns {boolean} success - Whether or not the object was enabled.
*/
E2D.Scene.prototype.enableObject = function (id) {
  var self = this;
  if (typeof self._disabledObjects[id] == "undefined") {
    if (self._options.logging) console.warn(id + " either doesn't exist, hasn't been disabled, or hasn't been added to the scene. Object was not enabled (@enableObject)");
    return false;
  }
  self._objects[id] = self._disabledObjects[id];
  delete self._disabledObjects[id];
  self._updateExtensions();
  return true;
};

/**
* @param {string} id - ID of object to disable
* @returns {boolean} success - Whether or not the object was disabled.
*/
E2D.Scene.prototype.disableObject = function (id) {
  var self = this;
  if (typeof self._objects[id] == "undefined") {
    if (self._options.logging) console.warn(id + " either doesn't exist, or hasn't been added to the scene. Object was not disabled (@disableObject)");
    return false;
  }
  self._disabledObjects[id] = self._objects[id];
  self.destroyObject(id);
  self._updateExtensions();
  return true;
};

/**
 * Register an E2D extension.
 *
 * @param {Object} options - An object containing options for the new extension.
 * @param {string} options.title - Title of the new extension.
 * @param {string} options.id - ID of the new extension. Randomly generated if not included.
 * @param {function} options.fn - Function to be executed on scene runtime. The scene is passed as a parameter.
 * @returns {string} ext.id - ID of the registered extension.
 */
E2D.Scene.prototype.registerExtension = function (options) {
  var self = this;

  var Extension = function Extension(options) {
    _classCallCheck(this, Extension);

    options = options || {};
    this.title = options.title || "Untitled Extension " + self.generateId();
    this.id = options.id || "ext" + self.generateId();
    this._enabled = true;
    this.fn = function () {
      options.fn(self);
    };
    this._bak_fn = function () {
      options.fn(self);
    };
    this.disable = function () {
      this.fn = function () {};
      this._enabled = false;
    };
    this.enable = function () {
      this.fn = this._bak_fn;
      this._enabled = true;
    };
    if (typeof options.fn == "undefined") {
      if (self._options.logging) console.warn("No function provided with " + this.title + ", using an empty function (@registerExtension).");
      this.fn = function () {};
    }
  };

  var ext = new Extension(options);
  self._extensions[ext.id] = ext;
  self._updateExtensions();
  return ext.id;
};
typeof module !== "undefined" ? module.exports = E2D : window.E2D = E2D;