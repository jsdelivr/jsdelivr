/**
 * E2D Engine v1.0.4
 * @author Jack Dalton <jack@jackdalton.org>
 * Copyright © 2015 Jack Dalton under the MIT license (https://opensource.org/licenses/MIT)
 **/

var E2D = {
  VERSION: "1.0.4"
};

E2D.Scene = (function() {
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
    }
    Scene.prototype.render = function() {
      var self = this;
      var queue = [];
      for (var i in self._objects) {
        queue.push(self._objects[i]);
      }
      queue.sort(function(a, b) {
        return a._layer - b._layer;
      });
      for (i = 0; i < queue.length; i++) {
        queue[i].render();
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
E2D.Scene.prototype.Vector2 = (function() {
  function Vector2(x, y) {
    this.x = typeof x == "number" ? x : 0;
    this.y = typeof y == "number" ? y : 0;
  }
  Vector2.prototype.getPos = function() {
    return this;
  };
  Vector2.prototype.getX = function() {
    return this.x;
  };
  Vector2.prototype.getY = function() {
    return this.y;
  };
  Vector2.prototype.setPos = function(pos) {
    this.x = typeof pos.x == "number" ? pos.x : this.x;
    this.y = typeof pos.y == "number" ? pos.y : this.y;
  };
  Vector2.prototype.setX = function(x) {
    this.x = typeof x == "number" ? x : this.x;
  };
  Vector2.prototype.setY = function(y) {
    this.y = typeof y == "number" ? y : this.y;
  };
  Vector2.prototype.distanceTo = function(pos) {
    return Math.sqrt(Math.pow(pos.x - this.x, 2) + Math.pow(pos.y - this.y, 2));
  };
  Vector2.prototype.midpoint = function(pos) {
    return new Vector2((this.x + pos.x) / 2, (this.y + pos.y) / 2);
  };
  Vector2.prototype.translate = function(to) {
    if (arguments.length == 2) {
      this.x += typeof arguments[0] == "number" ? arguments[0] : 0;
      this.y += typeof arguments[1] == "number" ? arguments[1] : 0;
    } else if (to instanceof Vector2) {
      this.x += to.x || 0;
      this.y += to.y || 0;
    }
    return {x: this.x, y: this.y};
  };

  return Vector2;
})();

/**
* @param {int} length - Length of ID to generate; default is 16 characters.
* @returns {string} id - Random ID to be used with anything.
*/
E2D.Scene.prototype.generateId = function(length) {
  var self = this;
  length = length || self._options.idLength;
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ$_", id = "";
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
E2D.Scene.prototype.addObject = function(options) {
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
    pos: options.pos,
  };
  if (typeof options.custom != "undefined") {
    obj.custom = options.custom;
  }
  if (typeof options.renderer == "function") {
    obj._renderer = options.renderer;
    obj.render = function() {
      obj._renderer(obj, arguments);
    };
    obj._layer = options.layer || 0;
  }
  self._objects[obj.id] = obj;
  return obj;
};

/**
* @param {string} id - ID of object to destroy.
* @returns {boolean} status - Whether the object was deleted.
*/
E2D.Scene.prototype.destroyObject = function(id) {
  var self = this;
  if (typeof self._objects[id] == "undefined") {
    if (self._options.logging) console.warn(id + " either doesn't exist, or hasn't been added to the scene. Object was not destroyed (@destroyObject)");
    return false;
  }
  delete self._objects[id];
  return true;
};

/**
* @param {string} id - ID of object to enable
* @returns {boolean} success - Whether or not the object was enabled.
*/
E2D.Scene.prototype.enableObject = function(id) {
  var self = this;
  if (typeof self._disabledObjects[id] == "undefined") {
    if (self._options.logging) console.warn(id + " either doesn't exist, hasn't been disabled, or hasn't been added to the scene. Object was not enabled (@enableObject");
    return false;
  }
  self._objects[id] = self._disabledObjects[id];
  delete self._disabledObjects[id];
  return true;
};

/**
* @param {string} id - ID of object to disable
* @returns {boolean} success - Whether or not the object was disabled.
*/
E2D.Scene.prototype.disableObject = function(id) {
  var self = this;
  if (typeof self._objects[id] == "undefined") {
    if (self._options.logging) console.warn(id + " either doesn't exist, or hasn't been added to the scene. Object was not disabled (@disableObject");
    return false;
  }
  self._disabledObjects[id] = self._objects[id];
  self.destroyObject(id);
  return true;
};

typeof module !== "undefined" ? module.exports = E2D : window.E2D = E2D;