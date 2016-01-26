(function() {
  var anima = window.anima = {};
  anima.js = function() {
    return new World(true);
  };
  anima.css = function() {
    return new World();
  };
  !function() {
    var vendors = [ "webkit", "Moz", "O", "ms" ], i = 0;
    while (!window.requestAnimationFrame && i < vendors.length) {
      var vendor = vendors[i++].toLowerCase();
      window.requestAnimationFrame = window[vendor + "RequestAnimationFrame"];
      window.cancelAnimationFrame = window[vendor + "CancelAnimationFrame"] || window[vendor + "CancelRequestAnimationFrame"];
    }
    vendor || (vendor = vendors[0]);
    window.vendor = vendor ? "-" + vendor + "-" : "";
    window.transformProperty = getProperty("transform");
    window.animationProperty = getProperty("animation");
    window.transitionProperty = getProperty("transition");
    function getProperty(property) {
      var style = document.createElement("div").style, Property = property[0].toUpperCase() + property.slice(1);
      if (typeof style.transform === "undefined") {
        return vendors.filter(function(vendor) {
          return typeof style[vendor + Property] !== "undefined";
        })[0] + Property;
      } else {
        return property;
      }
    }
  }();
  var easings = function() {
    var fn = {
      quad: function(p) {
        return Math.pow(p, 2);
      },
      cubic: function(p) {
        return Math.pow(p, 3);
      },
      quart: function(p) {
        return Math.pow(p, 4);
      },
      quint: function(p) {
        return Math.pow(p, 5);
      },
      expo: function(p) {
        return Math.pow(p, 6);
      },
      sine: function(p) {
        return 1 - Math.cos(p * Math.PI / 2);
      },
      circ: function(p) {
        return 1 - Math.sqrt(1 - p * p);
      },
      back: function(p) {
        return p * p * (3 * p - 2);
      }
    };
    var easings = {
      linear: function(p) {
        return p;
      }
    };
    Object.keys(fn).forEach(function(name) {
      var ease = fn[name];
      easings["ease-in-" + name] = ease;
      easings["ease-out-" + name] = function(p) {
        return 1 - ease(1 - p);
      };
      easings["ease-in-out-" + name] = function(p) {
        return p < .5 ? ease(p * 2) / 2 : 1 - ease(p * -2 + 2) / 2;
      };
    });
    easings.css = {
      linear: "cubic-bezier(0.000, 0.000, 1.000, 1.000)",
      "ease-in-quad": "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
      "ease-in-cubic": "cubic-bezier(0.550, 0.055, 0.675, 0.190)",
      "ease-in-quart": "cubic-bezier(0.895, 0.030, 0.685, 0.220)",
      "ease-in-quint": "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
      "ease-in-sine": "cubic-bezier(0.470, 0.000, 0.745, 0.715)",
      "ease-in-expo": "cubic-bezier(0.950, 0.050, 0.795, 0.035)",
      "ease-in-circ": "cubic-bezier(0.600, 0.040, 0.980, 0.335)",
      "ease-in-back": "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
      "ease-out-quad": "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
      "ease-out-cubic": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
      "ease-out-quart": "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
      "ease-out-quint": "cubic-bezier(0.230, 1.000, 0.320, 1.000)",
      "ease-out-sine": "cubic-bezier(0.390, 0.575, 0.565, 1.000)",
      "ease-out-expo": "cubic-bezier(0.190, 1.000, 0.220, 1.000)",
      "ease-out-circ": "cubic-bezier(0.075, 0.820, 0.165, 1.000)",
      "ease-out-back": "cubic-bezier(0.175, 0.885, 0.320, 1.275)",
      "ease-in-out-quad": "cubic-bezier(0.455, 0.030, 0.515, 0.955)",
      "ease-in-out-cubic": "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
      "ease-in-out-quart": "cubic-bezier(0.770, 0.000, 0.175, 1.000)",
      "ease-in-out-quint": "cubic-bezier(0.860, 0.000, 0.070, 1.000)",
      "ease-in-out-sine": "cubic-bezier(0.445, 0.050, 0.550, 0.950)",
      "ease-in-out-expo": "cubic-bezier(1.000, 0.000, 0.000, 1.000)",
      "ease-in-out-circ": "cubic-bezier(0.785, 0.135, 0.150, 0.860)",
      "ease-in-out-back": "cubic-bezier(0.680, -0.550, 0.265, 1.550)"
    };
    return easings;
  }();
  function CSS(item, animations) {
    this.stylesheet = document.styleSheets[0];
    this.item = item;
    this.animations = animations;
    this.total = this.animations.map(function(a) {
      return a.delay + a.duration;
    }).reduce(function(a, b) {
      return a + b;
    });
    this.style();
  }
  CSS.prototype.pause = function pause() {
    this.item.dom.style[animationProperty + "PlayState"] = "paused";
    return this;
  };
  CSS.prototype.resume = function resume() {
    this.item.dom.style[animationProperty + "PlayState"] = "running";
    return this;
  };
  CSS.prototype.stop = function stop() {
    var style = getComputedStyle(this.item.dom), transform = style[vendor + "transform"], opacity = style.opacity;
    this.item.dom.style[animationProperty] = "";
    this.item.dom.style[transitionProperty] = "";
    this.item.dom.style[transformProperty] = transform;
    this.item.dom.style.opacity = opacity;
    this.item.state = Matrix.extract(Matrix.parse(transform));
    this.item.state.opacity = opacity;
    return this;
  };
  CSS.prototype.handle = function handle(event) {
    var vendor = window.vendor.replace(/\-/g, ""), onEnd = function end() {
      this.stop();
      this.item.dom.removeEventListener(vendor + event, onEnd, false);
    }.bind(this);
    this.item.dom.addEventListener(vendor + event, onEnd, false);
  };
  CSS.prototype.style = function style() {
    var animation = "a" + (Date.now() + Math.floor(Math.random() * 100));
    if (this.item.animations[0] instanceof Animation && this.item.animations.length == 1) {
      var a = this.item.animations[0];
      a.init();
      this.item.dom.style[transitionProperty] = "all " + a.duration + "ms " + easings.css[a.easeName] + " " + a.delay + "ms";
      a.transform(1);
      this.handle("TransitionEnd");
      a.item.style();
    } else {
      this.stylesheet.insertRule(this.keyframes(animation), 0);
      this.handle("AnimationEnd");
      this.item.dom.style[animationProperty] = animation + " " + this.total + "ms" + (this.item.infinite ? " infinite " : " ") + "forwards";
    }
    this.item.animations = [];
  };
  CSS.prototype.percent = function percent(time) {
    return (time * 100 / this.total).toFixed(3);
  };
  CSS.prototype.keyframes = function keyframes(name) {
    var time = 0, rule = [ "@" + vendor + "keyframes " + name + "{" ];
    for (var i = 0; i < this.animations.length; i++) {
      var a = this.animations[i], aNext = this.animations[i + 1];
      a.init();
      if (a instanceof Animation) {
        i === 0 && rule.push("0% {", vendor + "animation-timing-function:" + easings.css[a.easeName] + ";", "}");
        a.delay && rule.push(this.percent(time += a.delay) + "% {", vendor + "transform:" + a.item.matrix() + ";", "opacity:" + a.item.opacity() + ";", "}");
        a.transform(1);
        rule.push(this.percent(time += a.duration) + "% {", vendor + "transform:" + a.item.matrix() + ";", "opacity:" + a.item.opacity() + ";", aNext && aNext.easeName && vendor + "animation-timing-function:" + easings.css[aNext.easeName] + ";", "}");
      } else {
        var frames = [];
        a.animations.forEach(function(a) {
          a.delay && frames.indexOf(a.delay) === -1 && frames.push(a.delay);
          a.duration && frames.indexOf(a.delay + a.duration) === -1 && frames.push(a.delay + a.duration);
        });
        for (var k = 0; k < frames.length; ++k) {
          var frame = frames[k];
          for (var j = 0; j < a.animations.length; ++j) {
            var pa = a.animations[j];
            if (pa.delay >= frame || pa.delay + pa.duration < frame) continue;
            pa.transform(pa.ease((frame - pa.delay) / pa.duration));
          }
          rule.push(this.percent(time += frame) + "% {", vendor + "transform:" + a.item.matrix() + ";", "opacity:" + a.item.opacity() + ";", "}");
        }
      }
    }
    rule.push("}");
    return rule.join("");
  };
  function EventEmitter() {
    this.handlers = {};
  }
  EventEmitter.prototype.on = function(event, handler) {
    (this.handlers[event] = this.handlers[event] || []).push(handler);
    return this;
  };
  EventEmitter.prototype.off = function(event, handler) {
    var handlers = this.handlers[event];
    if (handler) {
      handlers.splice(handlers.indexOf(handler), 1);
    } else {
      this.handlers[event] = [];
    }
    return this;
  };
  EventEmitter.prototype.emit = function(event) {
    var args = Array.prototype.slice.call(arguments, 1), handlers = this.handlers[event];
    if (handlers) {
      for (var i = 0; i < handlers.length; ++i) {
        handlers[i].apply(this, args);
      }
    }
    return this;
  };
  function Animation(item, transform, duration, ease, delay) {
    EventEmitter.call(this);
    this.item = item;
    this.translate = transform.translate && transform.translate.map(parseFloat);
    this.rotate = transform.rotate && transform.rotate.map(parseFloat);
    this.scale = transform.scale;
    this.opacity = transform.opacity;
    this.start = null;
    this.diff = null;
    this.duration = parseInt(duration || transform.duration, 10) || 500;
    this.delay = parseInt(delay || transform.delay, 10) || 0;
    this.ease = easings[ease] || easings[transform.ease] || easings.linear;
    this.easeName = ease || "linear";
  }
  Animation.prototype = new EventEmitter();
  Animation.prototype.constructor = Animation;
  Animation.prototype.init = function init(tick, force) {
    if (this.start !== null && !force) return;
    this.start = tick;
    var state = this.item.state;
    this.initial = {
      translate: state.translate.slice(),
      rotate: state.rotate.slice(),
      scale: state.scale.slice(),
      opacity: state.opacity
    };
    this.emit("start");
  };
  Animation.prototype.animate = function animate() {
    return this.item.animate.apply(this.item, arguments);
  };
  Animation.prototype.css = function css() {
    return this.item.css();
  };
  Animation.prototype.infinite = function infinite() {
    this.item.infinite = true;
    return this;
  };
  Animation.prototype.run = function run(tick) {
    if (tick - this.start < this.delay) return;
    var percent = (tick - this.delay - this.start) / this.duration;
    if (percent < 0) percent = 0;
    percent = this.ease(percent);
    this.transform(percent);
  };
  Animation.prototype.pause = function pause() {
    this.diff = Date.now() - this.start;
  };
  Animation.prototype.resume = function resume() {
    this.start = Date.now() - this.diff;
  };
  Animation.prototype.set = function set(type, percent) {
    var state = this.item.state, initial = this.initial;
    if (this[type] && this[type].length) {
      if (this[type][0]) {
        state[type][0] = initial[type][0] + this[type][0] * percent;
      }
      if (this[type][1]) {
        state[type][1] = initial[type][1] + this[type][1] * percent;
      }
      if (this[type][2]) {
        state[type][2] = initial[type][2] + this[type][2] * percent;
      }
    } else if (this[type]) {
      state[type] = initial[type] + (this[type] - initial[type]) * percent;
    }
  };
  Animation.prototype.transform = function transform(percent) {
    this.set("translate", percent);
    this.set("rotate", percent);
    this.set("scale", percent);
    this.set("opacity", percent);
  };
  Animation.prototype.end = function end(abort) {
    !abort && this.transform(1);
    this.start = null;
    this.emit("end");
  };
  function Parallel(item, animations, duration, ease, delay) {
    EventEmitter.call(this);
    this.item = item;
    this.animations = animations.map(function(a) {
      return new Animation(item, a.transform || {
        translate: a.translate,
        rotate: a.rotate,
        scale: a.scale
      }, a.duration || duration, a.ease || ease, a.delay || delay);
    });
    this.start = null;
    this.delay = 0;
    this.easeName = ease || "linear";
    this.duration = Math.max.apply(null, this.animations.map(function(a) {
      return a.duration + a.delay;
    }));
  }
  Parallel.prototype = new EventEmitter();
  Parallel.prototype.constructor = Parallel;
  Parallel.prototype.init = function init(tick) {
    if (this.start !== null) return;
    this.start = tick;
    for (var i = 0; i < this.animations.length; ++i) {
      this.animations[i].init(tick);
    }
    this.emit("start");
  };
  Parallel.prototype.animate = function animate() {
    return this.item.animate.apply(this.item, arguments);
  };
  Parallel.prototype.css = function css() {
    return this.item.css();
  };
  Parallel.prototype.infinite = function infinite() {
    this.item.infinite = true;
    return this;
  };
  Parallel.prototype.run = function run(tick) {
    for (var i = 0; i < this.animations.length; ++i) {
      var a = this.animations[i];
      if (a.start + a.delay + a.duration <= tick) {
        this.animations.splice(i--, 1);
        a.end();
        continue;
      }
      a.run(tick);
    }
  };
  Parallel.prototype.pause = function pause() {
    for (var i = 0; i < this.animations.length; ++i) {
      this.animations[i].pause();
    }
  };
  Parallel.prototype.resume = function resume() {
    for (var i = 0; i < this.animations.length; ++i) {
      this.animations[i].resume();
    }
  };
  Parallel.prototype.end = function end(abort) {
    for (var i = 0; i < this.animations.length; ++i) {
      this.animations[i].end(abort);
    }
    this.emit("end");
  };
  function World(start) {
    this.items = [];
    this._frame = null;
    start && this.init();
  }
  World.prototype.init = function init() {
    var self = this;
    function update(tick) {
      self.update(tick);
      self._frame = requestAnimationFrame(update);
    }
    this._frame = requestAnimationFrame(update);
  };
  World.prototype.add = function add(node) {
    var item = new Item(node);
    this.items.push(item);
    return item;
  };
  World.prototype.cancel = function cancel() {
    this._frame && cancelAnimationFrame(this._frame);
  };
  World.prototype.stop = function stop() {
    this.cancel();
    for (var i = 0; i < this.items.length; ++i) {
      this.items[i].stop();
    }
  };
  World.prototype.pause = function pause() {
    this.cancel();
    for (var i = 0; i < this.items.length; ++i) {
      this.items[i].pause();
    }
  };
  World.prototype.resume = function resume() {
    for (var i = 0; i < this.items.length; ++i) {
      this.items[i].resume();
    }
    this.init();
  };
  World.prototype.update = function update(tick) {
    for (var i = 0; i < this.items.length; ++i) {
      this.items[i].update(tick);
    }
  };
  World.prototype.on = function on(event, handler) {
    window.addEventListener(event, handler, true);
  };
  var radians = Math.PI / 180;
  var Matrix = {
    id: function id() {
      return [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
    },
    multiply: function multiply(a, b) {
      var c = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ];
      c[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8];
      c[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9];
      c[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10];
      c[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8];
      c[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9];
      c[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10];
      c[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8];
      c[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9];
      c[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10];
      c[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + b[12];
      c[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + b[13];
      c[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + b[14];
      return 2 >= arguments.length ? c : multiply.apply(null, [ c ].concat(Array.prototype.slice.call(arguments, 2)));
    },
    translate: function translate(tx, ty, tz) {
      if (!(tx || ty || tz)) return Matrix.id();
      tx || (tx = 0);
      ty || (ty = 0);
      tz || (tz = 0);
      return [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1 ];
    },
    translateX: function translateX(t) {
      return this.translate(t, 0, 0);
    },
    translateY: function translateY(t) {
      return this.translate(0, t, 0);
    },
    translateZ: function translateZ(t) {
      return this.translate(0, 0, t);
    },
    scale: function scale(sx, sy, sz) {
      if (!(sx || sy || sz)) return Matrix.id();
      sx || (sx = 1);
      sy || (sy = 1);
      sz || (sz = 1);
      return [ sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1 ];
    },
    scaleX: function scaleX(s) {
      return this.scale(s, 0, 0);
    },
    scaleY: function scaleY(s) {
      return this.scale(0, s, 0);
    },
    scaleZ: function scaleZ(s) {
      return this.scale(0, 0, s);
    },
    rotate: function rotate(ax, ay, az) {
      if (!(ax || ay || az)) return Matrix.id();
      ax || (ax = 0);
      ay || (ay = 0);
      az || (az = 0);
      ax *= radians;
      ay *= radians;
      az *= radians;
      var sx = Math.sin(ax), cx = Math.cos(ax), sy = Math.sin(ay), cy = Math.cos(ay), sz = Math.sin(az), cz = Math.cos(az);
      return [ cy * cz, cx * sz + sx * sy * cz, sx * sz - cx * sy * cz, 0, -cy * sz, cx * cz - sx * sy * sz, sx * cz + cx * sy * sz, 0, sy, -sx * cy, cx * cy, 0, 0, 0, 0, 1 ];
    },
    rotateX: function rotateX(a) {
      a *= radians;
      var s = Math.sin(a), c = Math.cos(a);
      return [ 1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1 ];
    },
    rotateY: function rotateY(a) {
      a *= radians;
      var s = Math.sin(a), c = Math.cos(a);
      return [ c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1 ];
    },
    rotateZ: function rotateZ(a) {
      a *= radians;
      var s = Math.sin(a), c = Math.cos(a);
      return [ c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
    },
    rotate3d: function rotate3d(x, y, z, a) {
      a *= radians;
      var s = Math.sin(a), c = Math.cos(a), len = Math.sqrt(x * x + y * y + z * z);
      if (len === 0) {
        x = 0;
        y = 0;
        z = 1;
      } else if (len !== 1) {
        x /= len;
        y /= len;
        z /= len;
      }
      var xx = x * x, yy = y * y, zz = z * z, _c = 1 - c;
      return [ xx + (1 - xx) * c, x * y * _c + z * s, x * z * _c - y * s, 0, x * y * _c - z * s, yy + (1 - yy) * c, y * z * _c + x * s, 0, x * z * _c + y * s, y * z * _c - x * s, zz + (1 - zz) * c, 0, 0, 0, 0, 1 ];
    },
    skew: function skew(ax, ay) {
      ax *= radians;
      ay *= radians;
      return [ 1, Math.tan(ay), 0, 0, Math.tan(ax), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
    },
    skewX: function skewX(a) {
      return this.skew(a, 0);
    },
    skewY: function skewY(a) {
      return this.skew(0, a);
    },
    perspective: function perspective(p) {
      p = -1 / p;
      return [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, p, 0, 0, 0, 1 ];
    },
    parse: function parse(s) {
      var m = s.match(/\((.+)\)/)[1].split(/,\s?/);
      if (m.length === 6) {
        m.splice(2, 0, "0", "0");
        m.splice(6, 0, "0", "0");
        m.splice(8, 0, "0", "0", "1", "0");
        m.push("0", "1");
      }
      return m;
    },
    extract: function extract(m) {
      var sX = Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]), sY = Math.sqrt(m[4] * m[4] + m[5] * m[5] + m[6] * m[6]), sZ = Math.sqrt(m[8] * m[8] + m[9] * m[9] + m[10] * m[10]);
      var rX = Math.atan2(-m[9] / sZ, m[10] / sZ) / radians, rY = Math.asin(m[8] / sZ) / radians, rZ = Math.atan2(-m[4] / sY, m[0] / sX) / radians;
      if (m[4] === 1 || m[4] === -1) {
        rX = 0;
        rY = m[4] * -Math.PI / 2;
        rZ = m[4] * Math.atan2(m[6] / sY, m[5] / sY) / radians;
      }
      var tX = m[12] / sX, tY = m[13] / sX, tZ = m[14] / sX;
      return {
        translate: [ tX, tY, tZ ],
        rotate: [ rX, rY, rZ ],
        scale: [ sX, sY, sZ ]
      };
    },
    toString: function toString(m) {
      for (var i = 0; i < m.length; ++i) if (Math.abs(m[i]) < 1e-6) m[i] = 0;
      return "matrix3d(" + m.join() + ")";
    },
    toTestString: function toTestString(m) {
      function clamp(n) {
        return n.toFixed(6);
      }
      function isAffine(m) {
        return m[2] === 0 && m[3] === 0 && m[6] === 0 && m[7] === 0 && m[8] === 0 && m[9] === 0 && m[10] === 1 && m[11] === 0 && m[14] === 0 && m[15] === 1;
      }
      function filterAffine(_, i) {
        return [ 0, 1, 4, 5, 12, 13 ].indexOf(i) !== -1;
      }
      if (isAffine(m)) {
        return "matrix(" + m.filter(filterAffine).map(clamp).join(", ") + ")";
      }
      return "matrix3d(" + m.map(clamp).join(", ") + ")";
    }
  };
  function Item(node) {
    EventEmitter.call(this);
    this.dom = node;
    this.animations = [];
    this.init();
  }
  Item.prototype = new EventEmitter();
  Item.prototype.constructor = Item;
  Item.prototype.init = function init() {
    this.infinite = false;
    this.running = true;
    this.state = {
      translate: [ 0, 0, 0 ],
      rotate: [ 0, 0, 0 ],
      scale: [ 1, 1, 1 ],
      opacity: 1
    };
  };
  Item.prototype.update = function update(tick) {
    this.animation(tick);
    this.style();
  };
  Item.prototype.pause = function pause() {
    if (!this.running) return;
    this.animations.length && this.animations[0].pause();
    this.running = false;
  };
  Item.prototype.resume = function resume() {
    if (this.running) return;
    this.animations.length && this.animations[0].resume();
    this.running = true;
  };
  Item.prototype.style = function style() {
    this.dom.style[transformProperty] = this.matrix();
    this.dom.style.opacity = this.opacity();
  };
  Item.prototype.matrix = function matrix() {
    var state = this.state;
    return Matrix.toString(Matrix.multiply(Matrix.scale.apply(null, state.scale), Matrix.rotate.apply(null, state.rotate), Matrix.translate.apply(null, state.translate)));
  };
  Item.prototype.opacity = function opacity() {
    return this.state.opacity;
  };
  Item.prototype.add = function add(type, a) {
    this.state[type][0] += a[0];
    this.state[type][1] += a[1];
    this.state[type][2] += a[2];
    return this;
  };
  Item.prototype.set = function set(type, a) {
    this.state[type] = a;
    return this;
  };
  Item.prototype.translate = function translate(t) {
    return this.add("translate", t);
  };
  Item.prototype.rotate = function rotate(r) {
    return this.add("rotate", r);
  };
  Item.prototype.scale = function scale(s) {
    return this.add("scale", s);
  };
  Item.prototype.clear = function clear() {
    this.state.translate = [ 0, 0, 0 ];
    this.state.rotate = [ 0, 0, 0 ];
    this.state.scale = [ 1, 1, 1 ];
    this.state.opacity = 1;
  };
  Item.prototype.animate = function animate(transform, duration, ease, delay) {
    var ctor = Array.isArray(transform) ? Parallel : Animation, animation = new ctor(this, transform, duration, ease, delay);
    this.animations.push(animation);
    return animation;
  };
  Item.prototype.animation = function animation(tick) {
    if (!this.running || this.animations.length === 0) return;
    while (this.animations.length !== 0) {
      var first = this.animations[0];
      first.init(tick);
      if (first.start + first.delay + first.duration <= tick) {
        this.infinite && this.animations.push(first);
        this.animations.shift();
        first.end();
        continue;
      }
      first.run(tick);
      break;
    }
  };
  Item.prototype.finish = function finish(abort) {
    if (this.animations.length === 0) return this;
    for (var i = 0; i < this.animations.length; ++i) {
      var a = this.animations[i];
      a.end(abort);
    }
    this.animations = [];
    this.infinite = false;
    return this;
  };
  Item.prototype.stop = function stop() {
    return this.finish(true);
  };
  Item.prototype.css = function css() {
    return new CSS(this, this.animations);
  };
})();