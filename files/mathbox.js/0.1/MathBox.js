/**
 * MicroEvent - to make any js object an event emitter (server or browser)
 * 
 * - pure javascript - server compatible, browser compatible
 * - dont rely on the browser doms
 * - super simple - you get it immediatly, no mistery, no magic involved
 *
 * - create a MicroEventDebug with goodies to debug
 *   - make it safer to use
*/

var MicroEvent	= function(){}
MicroEvent.prototype	= {
	bind	: function(event, fct){
		this._events = this._events || {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
	},
	unbind	: function(event, fct){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	},
	trigger	: function(event /* , args... */){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		for(var i = 0; i < this._events[event].length; i++){
			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
		}
	}
};

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 *
 * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} the object which will support MicroEvent
*/
MicroEvent.mixin	= function(destObject){
	var props	= ['bind', 'unbind', 'trigger'];
	for(var i = 0; i < props.length; i ++){
		destObject.prototype[props[i]]	= MicroEvent.prototype[props[i]];
	}
}

// export in common js
if( typeof module !== "undefined" && ('exports' in module)){
	module.exports	= MicroEvent
}/*
Copyright (c) 2008 Stefan Lange-Hegermann

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
function microAjax(B,A){this.bindFunction=function(E,D){return function(){return E.apply(D,[D])}};this.stateChange=function(D){if(this.request.readyState==4){this.callbackFunction(this.request.responseText)}};this.getRequest=function(){if(window.ActiveXObject){return new ActiveXObject("Microsoft.XMLHTTP")}else{if(window.XMLHttpRequest){return new XMLHttpRequest()}}return false};this.postBody=(arguments[2]||"");this.callbackFunction=A;this.url=B;this.request=this.getRequest();if(this.request){var C=this.request;C.onreadystatechange=this.bindFunction(this.stateChange,this);if(this.postBody!==""){C.open("POST",B,true);C.setRequestHeader("X-Requested-With","XMLHttpRequest");C.setRequestHeader("Content-type","application/x-www-form-urlencoded");C.setRequestHeader("Connection","close")}else{C.open("GET",B,true)}C.send(this.postBody)}};/**
 * ThreeBox.js. More flexible tQuery boilerplate.
 */

// Math!
var π = Math.PI,
    τ = π * 2;

// Check dependencies.
(function (deps) {
  for (var i in deps) {
    if (!window[i]) throw "Error: ThreeBox requires " + deps[i];
  }
})({
  'THREE': 'Three.js',
  'tQuery': 'tQuery.js (bundle)'//,
});

// Namespace.
window.ThreeBox = {};

// Shortcut static call.
window.threeBox = function (element, options) {
  // Omit element (use body)
  if (element && !(element instanceof Node)) {
    options = element;
    element = null;
  }

  return tQuery.createWorld(options).threeBox(element, options);
};

// Make microevent methods chainable.
MicroEvent.prototype.on   = function () { MicroEvent.prototype.bind.apply(this, arguments);    return this; }
MicroEvent.prototype.emit = function () { MicroEvent.prototype.trigger.apply(this, arguments); return this; }
MicroEvent.mixin	= function(destObject){
	var props	= ['bind', 'unbind', 'trigger', 'on', 'emit'];
	for(var i = 0; i < props.length; i ++){
		destObject.prototype[props[i]]	= MicroEvent.prototype[props[i]];
	}
}

// Make world microevents nicer.
tQuery.World.prototype.on = tQuery.World.prototype.addEventListener;
tQuery.World.prototype.emit = tQuery.World.prototype.dispatchEvent;
/**
 * World.threeBox() – Create a renderer inside a DOM element.
 *
 * Based on tQuery boilerplate.
 */
tQuery.World.registerInstance('threeBox', function (element, options) {

  // Shorthand, omit element.
  if (element && !(element instanceof Node)) {
    options = element;
    element = null;
  }

  // Use body by default
  element = element || document.body;

  // Place renderer in element.
  var domElement  = element;

  if (element == document.body) {
    // Remove margins/padding on body.
    domElement.style.margin   = 0;
    domElement.style.padding  = 0;
    domElement.style.overflow = 'hidden';
  }
  else {
    // Ensure container acts as a reference frame for children.
    var style = getComputedStyle(element);
    if (element.position == 'static') {
      element.position = 'relative';
    }
  }

  // Insert into DOM.
  this.appendTo(domElement);

  // Set up ThreeBox
  this.addThreeBox(element, options || {});

  // Chained API
  return this;
});

/**
 * World.addThreeBox – Set up threebox.
 */
tQuery.World.registerInstance('addThreeBox', function (element, options) {
  // Sanity check
  console.assert(this.hasThreeBox() !== true);

  // Handle parameters  
  options  = tQuery.extend(options, {
    cameraControls: false,
    cursor:         true,
    controlClass:   ThreeBox.OrbitControls,
    elementResize:  true,
    fullscreen:     true,
    screenshot:     true,
    stats:          true,
    scale:          1//,
  });

  // Make tRenderer.domElement style "display: block" - by default it is inline-block
  // - so it is affected by line-height and create a white line at the bottom
  this.tRenderer().domElement.style.display = "block"

  // Create the context
  var ctx  = {};
  tQuery.data(this, '_threeBoxContext', ctx);

  // Get some variables
  var tCamera  = this.tCamera();
  var tRenderer  = this.tRenderer();

  // Add Stats.js.
  if (options.stats) {
    ctx.stats  = new Stats();
    ctx.stats.domElement.style.position = 'absolute';
    ctx.stats.domElement.style.left     = '10px';
    ctx.stats.domElement.style.top      = '10px';
    element && element.appendChild(ctx.stats.domElement);
    ctx.loopStats  = function () {
      ctx.stats.update();
    };
    this.loop().hook(ctx.loopStats);
  }

  // Create camera controls.
  if (options.cameraControls) {
    var loop = this.loop(), render = this.render.bind(this);

    ctx.cameraControls = new options.controlClass(tCamera, element, options);
    if (ctx.cameraControls.on) {
      ctx.cameraControls.on('change', function () {
        // If not looping, ensure view is updated on interaction.
        if (!loop._timerId) {
          render();
        }
      });
    }
    this.setCameraControls(ctx.cameraControls);
  }

  // Track element / window resizes.
  if (options.elementResize) {
    ctx.elementResize = ThreeBox.ElementResize.bind(tRenderer, tCamera, element, options)
                        .on('resize', function (width, height) {
                          // Update tQuery world dimensions.
                          this._opts.renderW = width;
                          this._opts.renderH = height;

                          // Forward resize events to world.
                          this.emit('resize', width, height);
                        }.bind(this));
  }

  // Contextual mouse cursor
  if (options.cursor !== null) {
    ctx.cursor = ThreeBox.Cursor.bind(element, options);
  }

  // Allow 'p' to make screenshot.
  if (THREEx && THREEx.Screenshot && options.screenshot) {
    ctx.screenshot = THREEx.Screenshot.bindKey(tRenderer);
  }

  // Allow 'f' to go fullscreen where this feature is supported.
  if (THREEx && THREEx.FullScreen && options.fullscreen && THREEx.FullScreen.available()) {
    ctx.fullscreen = THREEx.FullScreen.bindKey();
  }

  // Bind 'destroy' event on tQuery.world.
  ctx._$onDestroy = this.bind('destroy', function () {
    if (this.hasThreeBox() === false) return;
    this.removeThreeBox();
  });

  // Chained API
  return this;
});

tQuery.World.registerInstance('hasThreeBox', function () {
  // Get threeBox context.
  var ctx  = tQuery.data(this, "_threeBoxContext")
  return ctx === undefined ? false : true;
});

tQuery.World.registerInstance('removeThreeBox', function () {
  // Get threeBox context.
  var ctx  = tQuery.data(this, '_threeBoxContext');
  if (ctx === undefined) return this;

  // Remove the context from the world.
  tQuery.removeData(this, '_threeBoxContext');

  // Unbind 'destroy' for tQuery.World
  this.unbind('destroy', this._$onDestroy);

  // remove stats.js
  if (ctx.stats) {
    document.body.removeChild(ctx.stats.domElement);
    this.loop().unhook(ctx.loopStats);
  }

  // Remove camera controls.
  ctx.cameraControls && this.removeCameraControls()
                     && ctx.cameraControls.stop();

  // Stop elementResize.
  ctx.elementResize  && ctx.elementResize.unbind();

  // Stop cursor tracking.
  ctx.cursor         && ctx.cursor.unbind();

  // Unbind screenshot
  ctx.screenshot     && ctx.screenshot.unbind();

  // Unbind fullscreen
  ctx.fullscreen     && ctx.fullscreen.unbind();
});
/**
 * Update renderer and camera when the element is resized
 * 
 * @param {Object} renderer The renderer to update
 * @param {Object} camera The camera to update
 * @param {Object} element The DOM element to size to
 *
 * Based on THREEx.WindowResize.
 */
ThreeBox.ElementResize = function (renderer, camera, domElement, options) {
  this.scale = options.scale || 1;
  this.orbit = options.orbit;

  var callback = this.callback = function () {
    var width = Math.floor(domElement.offsetWidth),
        height = Math.floor(domElement.offsetHeight);

    // Size renderer appropriately.
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.width = width + "px";
    renderer.domElement.style.height = height + "px";

    // Scale
    var ws = Math.floor(width/this.scale),
        hs = Math.floor(height/this.scale);

    // Notify the renderer of the size change.
    renderer.setSize(ws, hs);

    // Update the camera aspect and ortho extents
    camera.aspect = width / height;
    if (camera instanceof THREE.OrthographicCamera) {
      camera.top = this.orbit / 2;
      camera.bottom = -camera.top;
      camera.left = -camera.top * camera.aspect;
      camera.right = -camera.bottom * camera.aspect;
    }
    camera.updateProjectionMatrix();

    // Notify of change.
    this.emit('resize', ws, hs);
  }.bind(this);

  // Bind the resize event on the window and element.
  window.addEventListener('resize', callback, false);
  domElement.addEventListener('resize', callback, false);

  // Update size immediately.
  setTimeout(callback, 0);
}

ThreeBox.ElementResize.bind  = function (renderer, camera, element, options) {
  return new ThreeBox.ElementResize(renderer, camera, element, options);
}

/**
 * Change resize scale.
 */
ThreeBox.ElementResize.prototype.scale = function (scale) {
  this.scale = scale;
}

/**
 * Stop watching window resize
 */
ThreeBox.ElementResize.prototype.unbind = function () {
  window.removeEventListener('resize', callback);
  domElement.removeEventListener('resize', callback);
}

MicroEvent.mixin(ThreeBox.ElementResize);/**
 * Click-and-drag mouse controls with Euler angles, yaw and pitch.
 */
ThreeBox.OrbitControls = function (camera, domElement, options) {
  this.element = domElement;
  this.camera = camera;

  this.options = tQuery.extend(options, {
    phi: τ/4,
    theta: 0.3,
    orbit: 2,
    lookAt: [0, 0, 0],
    speed: 2//,
  });

  this.init();
  this.start();
  this.update();
};

ThreeBox.OrbitControls.prototype = {

  init: function () {
    this.width = this.element && this.element.offsetWidth,
    this.height = this.element && this.element.offsetHeight;
    this.phi = this.options.phi;
    this.theta = this.options.theta;
    this.orbit = this.options.orbit;
    this.speed = this.options.speed;

    this.lookAt = new THREE.Vector3();
    this.lookAt.set.apply(this.lookAt, this.options.lookAt || []);
  },

  start: function () {
    var that = this;

    this._mouseDown = function (event) {
      that.width = that.element && that.element.offsetWidth,
      that.height = that.element && that.element.offsetHeight;

      that.drag = true;
      that.lastHover = that.origin = { x: event.pageX, y: event.pageY };

      event.preventDefault();
    };

    this._mouseUp = function () {
      that.drag = false;
    };

    this._mouseMove = function (event) {
      if (that.drag) {
        var relative = { x: event.pageX - that.origin.x, y: event.pageY - that.origin.y },
            delta = { x: event.pageX - that.lastHover.x, y: event.pageY - that.lastHover.y };
        that.lastHover = { x: event.pageX, y: event.pageY };
        that.moved(that.origin, relative, delta);
      }
    };

    if (this.element) {
      this.element.addEventListener('mousedown', this._mouseDown, false);
      document.addEventListener('mouseup', this._mouseUp, false);
      document.addEventListener('mousemove', this._mouseMove, false);
    }
  },

  stop: function () {
    if (this.element) {
      this.element.removeEventListener('mousedown', this._mouseDown);
      document.removeEventListener('mouseup', this._mouseUp);
      document.removeEventListener('mousemove', this._mouseMove);
    }
  },

  moved: function (origin, relative, delta) {
    this.phi = this.phi + delta.x * this.speed / this.width;
    this.theta = Math.min(π/2, Math.max(-π/2, this.theta + delta.y * this.speed / this.height));

    this.emit('change');
  },

  update: function () {
    this.camera.position.x = Math.cos(this.phi) * Math.cos(this.theta) * this.orbit;
    this.camera.position.y = Math.sin(this.theta) * this.orbit;
    this.camera.position.z = Math.sin(this.phi) * Math.cos(this.theta) * this.orbit;

    this.camera.position.addSelf(this.lookAt);
    this.camera.lookAt(this.lookAt);
  }//,

};

ThreeBox.OrbitControls.bind  = function (camera, domElement, options) {
  return new ThreeBox.OrbitControls(camera, domElement, options);
}

MicroEvent.mixin(ThreeBox.OrbitControls);
/**
 * Set cursor shape and auto-hide with timer.
 * 
 * @param {Object} element DOM element to track mouse movement on.
 * @param {Object} options Options for ThreeBox.
 */
ThreeBox.Cursor = function (element, options) {
  // Use move cursor if controls are active.
  var cursor = options.cameraControls ? 'move' : 'default';

  // Timer state
  var timer = null, ignore = false, delay = 2000;

  // Cursor auto-hiding
  function moved() {
    ignore || show();
    clearTimeout(timer);
    ignore = false;

    timer = setTimeout(function () {
      ignore = true;
      hide();
    }, delay);
  }

  function show() { element.style.cursor = cursor; }
  function hide() { element.style.cursor = 'none'; }

  // Update cursor on mouse move
  if (!options.cursor) {
    element.addEventListener('mousemove', moved);
    hide();
  }
  else {
    show();
  }

  // Return .unbind() the function to stop watching window resize.
  return {
    /**
     * Stop watching window resize
     */
    unbind: function () {
      element.removeEventListener('mousemove', moved);
    }
  };
}

ThreeBox.Cursor.bind  = function (element, options) {
  return ThreeBox.Cursor(element, options);
}
// Quick'n'dirty loader for additional .html content
ThreeBox.preload = function (files, callback) {
  // Only callback passed.
  if (files instanceof Function) {
    callback = files;
    files = [];
  }

  // Allow single file.
  files = typeof files == 'string' ? [files] : files;

  // Completion counter
  var remaining = files.length;
  var accumulate = {};
  var ping = function (data) {
    // Collect objects
    _.extend(accumulate, data || {});

    // Call callback if done.
    if (--remaining == 0) {
      callback(accumulate);
    };
  }

  // Prepare extensions
  var l = ThreeBox.preload;
  var regexps = {},
      exts = {
        'html': l.html,
        'jpg': l.image,
        'png': l.image,
        'gif': l.image,
        'mp3': l.audio,
      };
  _.each(exts, function (handler, ext) {
    regexps[ext] = new RegExp('\\.' + ext + '$');
  });

  // Load individual file
  _.each(files, function (file) {
    // Use appropriate handler based on extension
    _.each(exts, function (handler, ext) {
      if (file.match(regexps[ext])) {
        var path = file.split(/\//g);
        var name = path.pop().replace(/\.[A-Za-z0-9]+$/, '');

        handler(file, name, ping);
      }
    });
  });
};

ThreeBox.preload.html = function (file, name, callback) {
  new microAjax(file, function (res) {
    var match;

    // Insert javascript directly
    if (match = res.match(/^<script[^>]*type=['"]text\/javascript['"][^>]*>([\s\S]+?)<\/script>$/m)) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = match[1];
      document.body.appendChild(script);
    }
    // Insert HTML via div
    else {
      var div = document.createElement('div');
      div.innerHTML = res;
      document.body.appendChild(div);
    }

    console.log('Loaded HTML ', file);
    callback();
  });
};

ThreeBox.preload.image = function (file, name, callback) {
  THREE.ImageUtils.loadTexture(file, null, function (texture) {
    var ret = {};
    ret[name] = texture;

    console.log('Loaded texture ', file);
    callback(ret);
  });
};

ThreeBox.preload.audio = function (file, name, callback) {
  // Load binary file via AJAX
  var request = new XMLHttpRequest();
  request.open("GET", file, true);
  request.responseType = "arraybuffer";

  request.onload = function () {
    var ret = {};
    ret[name] = request.response;

    console.log('Loaded audio ', file);
    callback(ret);
  };

  request.send();
}
// Check dependencies.
;(function (deps) {
  for (var i in deps) {
    if (!window[i]) throw "Error: ThreeRTT requires " + deps[i];
  }
})({
  'THREE': 'Three.js'//,
});

// Namespace
window.ThreeRTT = window.ThreeRTT || {};

// Fetch shader from <script> tag by id
// or pass through string if not exists.
ThreeRTT.getShader = function (id) {
  var elem = document.getElementById(id);
  return elem && elem.innerText || id;
};

// Simple loop helper
_.loop = function (n, callback) {
  for (var i = 0; i < n; ++i) callback(i);
};

// Fetch shader from <script> tag by id
ThreeRTT.getShader = function (id) {
  var elem = document.getElementById(id);
  return elem && (elem.innerText || elem.textContent) || id;
};
// Check for a power of two.
ThreeRTT.isPowerOfTwo = function (value) {
	return (value & (value - 1)) === 0;
};

// Convert World/Stage into RenderTarget if necessary.
ThreeRTT.toTarget = function (rtt) {
  // Stage object
  if (ThreeRTT.Stage && (rtt instanceof ThreeRTT.Stage)) return rtt.target;
  // tQuery world
  if (ThreeRTT.World && (rtt instanceof ThreeRTT.World)) return rtt.target();
  // RenderTarget or texture
  return rtt;
}

// Convert World/Stage/RenderTarget into texture uniform.
ThreeRTT.toTexture = function (rtt, i) {
  // Convert World/Stage
  rtt = ThreeRTT.toTarget(rtt);
  // Convert virtual RenderTarget object to uniform
  if (ThreeRTT.RenderTarget && (rtt instanceof ThreeRTT.RenderTarget)) return rtt.read();
  return rtt;
}

// Make microevent methods chainable.
MicroEvent.prototype.on   = function () { MicroEvent.prototype.bind.apply(this, arguments);    return this; }
MicroEvent.prototype.emit = function () { MicroEvent.prototype.trigger.apply(this, arguments); return this; }
MicroEvent.mixin	= function(destObject){
	var props	= ['bind', 'unbind', 'trigger', 'on', 'emit'];
	for(var i = 0; i < props.length; i ++){
		destObject.prototype[props[i]]	= MicroEvent.prototype[props[i]];
	}
}
/**
 * Render-to-texture stage. Contains scene/camera/target + optional full screen quad.
 */
ThreeRTT.Stage = function (renderer, options) {
  options = _.extend({
    history:  0,
    camera:   {},
    scene:    null,
  }, options);

  // Prefill aspect ratio.
  options.camera.aspect = options.camera.aspect || (options.width / options.height);

  // Create internal scene and default camera.
  this.scene = options.scene || new THREE.Scene();
  this.camera = ThreeRTT.Camera(options.camera);
	this.scene.add(this.camera);

  // Create virtual render target, passthrough options.
  this.target = new ThreeRTT.RenderTarget(renderer, options);

  // Prepare data structures.
  this.reset();

  // Set size and aspect
  this.size(options.width, options.height);
}

ThreeRTT.Stage.prototype = {

  options: function () {
    return this.target.options;
  },

  reset: function () {
    if (this.renderables) {
      _.each(this.renderables, function (surface) {
        this.scene.remove(surface);
      }.bind(this));
    }

    this.passes   = [];
    this.renderables = [];
  },

  // Add object render pass
  paint: function (object, empty) {

    // Create root to hold all objects for this pass
    var root = new THREE.Object3D();
    root.frustumCulled = false;
    root.visible = true;

    // Create a surface to render the last frame
    if (!empty) {
      var material = new ThreeRTT.FragmentMaterial(this, 'generic-fragment-texture');
      var surface = this._surface(material);
      root.add(surface);
    }

    // Add object
    root.add(object);

    // Add root to scene and insert into pass list
    this.scene.add(root);
    this.passes.push(1);
    this.renderables.push(root);
  },

  // Add iteration pass
  iterate: function (n, material) {

    // Create a surface to render the pass with
    var surface = this._surface(material);
    surface.visible = false;

    // Add surface to scene and insert into pass list
    this.scene.add(surface);
    this.passes.push(n);
    this.renderables.push(surface);

    return this;
  },

  // Add regular fragment pass
  fragment: function (material) {
    this.iterate(1, material);

    return this;
  },

  // Resize render-to-texture
  size: function (width, height) {
    width = Math.floor(width);
    height = Math.floor(height);
    this.camera.aspect = width / height;
    this.target.size(width, height);
    return this;
  },

  // Get texture for render-to-texture output delayed by n frames.
  read: function (n) {
    return this.target.read(n);
  },

  // Return uniform for reading from this render target
  uniform: function () {
    return this.target.uniform();
  },

  // Render virtual render target.
  render: function () {
	  this.target.clear();

    function toggle(object, value) {
      object.visible = value;
      _.each(object.children, function (object) { toggle(object, value); });
    }

    _.each(this.passes, function (n, i) {
      toggle(this.renderables[i], true);
      _.loop(n, function (i) {
        this.target.render(this.scene, this.camera);
      }.bind(this));
      toggle(this.renderables[i], false);
    }.bind(this));

    return this;
  },

  // Clear virtual render target.
  clear: function () {
    this.target.clear();
    return this;
  },

  // Cleanup resources.
  destroy: function () {
    this.target.deallocate();

    this.scene = null;
    this.camera = null;
    this.target = null;
  },

  // Generate full screen surface with default properties.
  _surface: function (material) {
    var surface = new THREE.Mesh(new ThreeRTT.ScreenGeometry(), {});
    surface.frustumCulled = false;
    surface.material = material;
    surface.renderDepth = Infinity;

    return surface;
  },

}
/**
 * Compose render-to-textures into a scene by adding a full screen quad
 * that uses the textures as inputs.
 */
ThreeRTT.Compose = function (rtts, fragmentShader, textures, uniforms) {
  THREE.Object3D.call(this);

  // Create full screen quad.
  var material = new ThreeRTT.FragmentMaterial(rtts, fragmentShader, textures, uniforms);
  var geometry = new ThreeRTT.ScreenGeometry();
  var mesh = this.mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;

  this.add(mesh);
}

ThreeRTT.Compose.prototype = new THREE.Object3D();
// Handy Camera factory
ThreeRTT.Camera = function (options) {
  // Camera passthrough
  if (options.constructor instanceof THREE.Camera) return options;

  // Defaults
  options = _.extend({
    aspect: 1,
    far: 10000,
    fov: 85,
    near: .01,
    ortho: false,
    scale: 1//,
  }, options);

  if (options.ortho) {
    // Note: aspect ratio is applied after.
    var s = options.scale, a = options.aspect;
    return new THREE.OrthographicCamera(
                      -s * a,
                       s * a,
                      -s,
                       s,
                       options.near,
                       options.far);
  }
  else {
    return new THREE.PerspectiveCamera(
                       options.fov,
                       options.aspect,
                       options.near,
                       options.far);
  }
};
/**
 * Virtual render target for complex render-to-texture usage.
 *
 * Contains multiple buffers for rendering from/to itself transparently
 * and/or remembering multiple frames of history.
 * 
 * Set options.history to the number of frames of history needed (default 0).
 *
 * Render a frame:
 * .render(scene, camera)
 *
 * Clear the frame:
 * .clear(color, depth, stencil)
 *
 * Retrieve a virtual render target/texture to read from past frames:
 * .read()/.read(0), .read(-1), .read(-2), ..
 *
 * Set dimensions:
 * .size(width, height)
 *
 * Retrieve render target for manually rendering into:
 * .write()
 *
 * Advanced cyclic buffer manually:
 * .advance()
 */
ThreeRTT.RenderTarget = function (renderer, options) {
  this.options = options = _.extend({
    width:         256,
    height:        256,
    texture:       {},
    clear:         { color: false, depth: false, stencil: false },
    clearColor:    0xFFFFFF,
    clearAlpha:    1,
    history:       0,
    scene:         null,
    camera:        null,
    autoAdvance:   true//,
  }, options);
  this.renderer = renderer;

  // Make sure mip-mapping is disabled for non-power-of-two targets.
  if (!ThreeRTT.isPowerOfTwo(options.width) ||
      !ThreeRTT.isPowerOfTwo(options.height)) {
    if (!options.texture.minFilter) {
      options.texture.minFilter = THREE.LinearFilter;
    }
  }

  // Number of buffers = history + read/write
  this.history(this.options.history, true);

  // Set size and allocate render targets.
  this.size(options.width, options.height);

  // Clear buffer
  this.clear();
},

ThreeRTT.RenderTarget.prototype = {

  // Retrieve virtual target for reading from, n frames back.
  read: function (n) {
    // Clamp history to available buffers minus write buffer.
    n = Math.max(0, Math.min(this.options.history, Math.abs(n || 0)));
    return this.virtuals[n];
  },

  // Retrieve real render target for writing/rendering to.
  write: function () {
    return this.targets[this.index];
  },

  // Retrieve / change history count
  history: function (history, ignore) {
    if (history !== undefined) {
      this._history = history;
      this.buffers = history + 2;

      // Refresh/allocate targets.
      ignore || this.allocate();
    }
    return this._history;
  },

  // Retrieve / change size
  size: function (width, height) {
    if (width && height) {
      // Round floats to ints to help with half/quarter derived sizes.
      this.width = width = Math.floor(width);
      this.height = height = Math.floor(height);

      // Refresh/allocate targets.
      this.allocate();
    }

    return { width: this.width, height: this.height };
  },

  // Reallocate all targets.
  deallocate: function () {
    this.deallocateTargets();
  },

  // Reallocate all targets.
  allocate: function () {
    this.deallocateTargets();
    this.allocateTargets();
    this.allocateVirtuals();
  },

  // (Re)allocate render targets
  deallocateTargets: function () {
    // Deallocate real targets that were used in rendering.
    _.each(this.targets || [], function (target) {
      this.renderer.deallocateRenderTarget(target);
    }.bind(this));
  },

  // (Re)allocate render targets
  allocateTargets: function () {
    var options = this.options;
              n = this.buffers;

    // Allocate/Refresh real render targets
    var targets = this.targets = [];
    _.loop(n, function (i) {

      targets.push(new THREE.WebGLRenderTarget(
        this.width,
        this.height,
        options.texture
      ));
      targets[i].__index = i;
    }.bind(this));
  },

  // Prepare virtual render targets for reading/writing.
  allocateVirtuals: function () {
    var original = this.targets[0],
        virtuals  = this.virtuals || [];
        n = Math.max(1, this.buffers - 1);
        // One buffer reserved for writing at any given time,
        // unless there is no history.

    // Keep virtual targets around if possible.
    if (n > virtuals.length) {
      _.loop(n - virtuals.length, function () {
        virtuals.push(original.clone());
      }.bind(this));
    }
    else {
      virtuals = virtuals.slice(0, n);
    }

    // Set sizes of virtual render targets.
    _.each(virtuals, function (target, i) {
      target.width = this.width;
      target.height = this.height;
      target.__index = i;
    }.bind(this));

    this.virtuals = virtuals;

    // Reset index and re-init targets.
    this.index = -1;
    this.advance();
  },

  // Advance through buffers.
  advance: function () {
    var options  = this.options,
        targets  = this.targets,
        virtuals = this.virtuals,
        index    = this.index,
        n        = this.buffers,
        v        = virtuals.length;

    // Advance cyclic index.
    this.index = index = (index + 1) % n;

    // Point virtual render targets to last rendered frame(s) in order.
    _.loop(v, function (i) {
      var dst = virtuals[i],
          src = targets[(v - i + index) % n];

      dst.__webglTexture      = src.__webglTexture;
      dst.__webglFramebuffer  = src.__webglFramebuffer;
      dst.__webglRenderbuffer = src.__webglRenderbuffer;
      dst.__index             = src.__index;
    });

  },

  // Clear render target.
  clear: function () {
    var options = this.options,
        clear   = options.clear,
        renderer = this.renderer;

    // Read old clearing state
    var color = renderer.getClearColor().clone();
    var alpha = renderer.getClearAlpha();

    // Apple new clearing color
    renderer.setClearColorHex(options.clearColor, options.clearAlpha);
    renderer.clearTarget(this.write(), clear.color, clear.stencil, clear.depth);

    // Reset state
    renderer.setClearColor(color, alpha);
  },

  // Render to render target using given renderer.
  render: function (scene, camera) {
    // Make sure materials are given a chance to update their uniforms.
    this.emit('render', scene, camera);

    // Disable autoclear.
    var autoClear = this.renderer.autoClear;
    this.renderer.autoClear = false;

    // Clear manually (with correct flags).
    this.clear();

    // Render scene.
    this.renderer.render(scene, camera, this.write());

    // Restore autoclear to previous state.
    this.renderer.autoClear = autoClear;

    // Advance render buffers so newly rendered frame is at .read(0).
    this.options.autoAdvance && this.advance();
  },

  // Return uniform for reading from this renderTarget.
  uniform: function (i) {
    var n = this.history();
    if (n) {
      // Expose frame history as array of textures.
      var textures = [];
      _.loop(n + 1, function (j) {
        textures.push(this.read(-j));
      }.bind(this));
      return {
        type: 'tv',
        value: textures,
        count: n + 1//,
      };
    }
    else {
      // No history, expose a single read texture.
      return {
        type: 't',
        value: i,
        texture: this.read(),
        count: 1//,
      };
    }
  }//,

};

// Microeventable
MicroEvent.mixin(ThreeRTT.RenderTarget);
/**
 * Geometry for drawing a full screen quad for raytracing / render-to-texture purposes.
 */
ThreeRTT.ScreenGeometry = function () {
  return new THREE.PlaneGeometry(2, 2, 1, 1);
};
/**
 * Helper for making ShaderMaterials that read from textures and write out processed fragments.
 */
ThreeRTT.ShaderMaterial = function (renderTargets, vertexShader, fragmentShader, textures, uniforms) {

  // Autoname texture uniforms as texture1, texture2, ...
  function textureName(j) {
    return 'texture' + (j + 1);
  }

  // Allow for array of textures.
  if (textures instanceof Array) {
    var object = {};
    _.each(textures, function (texture, j) {
      object[textureName(i)] = texture;
    });
    textures = object;
  }
  // Allow passing single texture/object
  else if (textures instanceof THREE.Texture
        || textures instanceof ThreeRTT.World
        || textures instanceof THREE.WebGLRenderTarget) {
    textures = { texture1: textures };
  }

  // Accept one or more render targets as input for reading.
  if (!(renderTargets instanceof Array)) {
    renderTargets = [renderTargets];
  }

  // Accept World/Stage/RenderTarget classes
  renderTargets = _.map(renderTargets, function (target) {
    return ThreeRTT.toTarget(target);
  });

  // Add sample step uniform.
  uniforms = _.extend(uniforms || {}, {
    sampleStep: {
      type: 'v2',
      value: new THREE.Vector2()//,
    }//,
  });

  // Make uniforms for input textures.
  _.each(textures, function (texture, key) {
    uniforms[key] = {
      type: 't',
      value: ThreeRTT.toTexture(texture)//,
    };
  });

  // Use render targets as input textures unless overridden.
  _.each(renderTargets, function (target, j) {
    // Create texture1, texture2, ... uniforms.
    var key = textureName(j);
    if (target.read && !uniforms[key]) {
      uniforms[key] = {
        type: 't',
        value: target.read()//,
      };
    }
  });

  // Alias 'texture1' to 'texture'.
  if (uniforms.texture1 && !uniforms.texture) {
    uniforms.texture = uniforms.texture1;
  }

  // Update sampleStep uniform on render of source.
  var callback;
  renderTargets[0].on('render', callback = function () {
    var texture = renderTargets[0].options.texture;
    var wrapS = texture.wrapS;
    var wrapT = texture.wrapT;

    var offset = {
      1000: 0, // repeat
      1001: 1, // clamp
      1002: 0, // mirrored
    };

    var value = uniforms.sampleStep.value;

    value.x = 1 / (renderTargets[0].width - (offset[wrapS]||0));
    value.y = 1 / (renderTargets[0].height - (offset[wrapT]||0));
  });

  // Lookup shaders and build material
  var material = new THREE.ShaderMaterial({
    uniforms:       uniforms,
    vertexShader:   ThreeRTT.getShader(vertexShader || 'generic-vertex'),
    fragmentShader: ThreeRTT.getShader(fragmentShader || 'generic-fragment-texture')//,
  });

  return material;
};
/**
 * Helper for making ShaderMaterials that read from textures and write out processed fragments.
 */
ThreeRTT.FragmentMaterial = function (renderTargets, fragmentShader, textures, uniforms) {

  var material = new ThreeRTT.ShaderMaterial(
                  renderTargets, 'generic-vertex-screen', fragmentShader, textures, uniforms);

  // Disable depth buffer for RTT fragment operations by default.
  material.side = THREE.DoubleSide;
  material.depthTest = false;
  material.depthWrite = false;
  material.transparent = true;
  material.blending = THREE.NoBlending;

  return material;
};
/**
 * Specialized ShaderMaterial for downsampling a texture by a factor of 2 with anti-aliasing.
 */
ThreeRTT.DownsampleMaterial = function (renderTargetFrom, renderTargetTo) {
  var uniforms = {};

  // Accept both Stage and RenderTarget classes
  renderTargetFrom = ThreeRTT.toTarget(renderTargetFrom);
  renderTargetTo = ThreeRTT.toTarget(renderTargetTo);

  // Add uniforms.
  uniforms = _.extend(uniforms, {
    sampleAlignment: {
      type: 'v2',
      value: new THREE.Vector2()//,
    },
    texture: {
      type: 't',
      value: renderTargetFrom.read()//,
    }//,
  });

  // Update uniforms on render.
  renderTargetTo.on('render', function () {
    var from = renderTargetFrom,
        to = renderTargetTo;

    // Correction for odd downsample.
    var dx = (to.width * 2) / from.width,
        dy = (to.height * 2) / from.height;

    var value = uniforms.sampleAlignment.value;
    value.x = dx;
    value.y = dy;
  });

  // Lookup shaders and build material
  var material = new THREE.ShaderMaterial({
    uniforms:       uniforms,
    vertexShader:   ThreeRTT.getShader('rtt-vertex-downsample'),
    fragmentShader: ThreeRTT.getShader('generic-fragment-texture')//,
  });

  // Disable depth buffer for RTT operations by default.
  material.side = THREE.DoubleSide;
  material.depthTest = false;
  material.depthWrite = false;
  material.transparent = true;
  material.blending = THREE.NoBlending;

  return material;
};/**
 * Helper for making ShaderMaterials that raytrace in camera space per pixel.
 */
ThreeRTT.RaytraceMaterial = function (renderTarget, fragmentShader, textures, uniforms) {

  // Autoname texture uniforms as texture1, texture2, ...
  function textureName(j) {
    return 'texture' + (j + 1);
  }

  // Allow for array of textures.
  if (textures instanceof Array) {
    var object = {};
    _.each(textures, function (texture, j) {
      // Autoname texture uniforms as texture1, texture2, ...
      var key = textureName(j);
      object[key] = texture;
    });
  }
  // Allow passing single texture/object
  else if (textures instanceof THREE.Texture
        || textures instanceof ThreeRTT.World
        || textures instanceof THREE.WebGLRenderTarget) {
    textures = { texture1: textures };
  }

  // Accept both Stage and RenderTarget classes
  renderTarget = ThreeRTT.toTarget(renderTarget);

  // Add camera uniforms.
  uniforms = _.extend(uniforms || {}, {
    cameraViewport: {
      type: 'v2',
      value: new THREE.Vector2()//,
    },
    cameraWorld: {
      type: 'm4',
      value: new THREE.Matrix4()//,
    }//,
  });

  // Make uniforms for input textures.
  var i = 0;
  _.each(textures || [], function (texture, key) {
    uniforms[key] = {
      type: 't',
      value: i++,
      texture: ThreeRTT.toTexture(texture)//,
    };
  });

  // Update camera uniforms on render.
  renderTarget.on('render', function (scene, camera) {
    camera.updateMatrixWorld();
    if (camera.fov) {
      var tan = Math.tan(camera.fov * π / 360);
      uniforms.cameraViewport.value.set(tan * camera.aspect, tan);
    }
    if (camera.matrixWorld) {
      uniforms.cameraWorld.value = camera.matrixWorld;
    }
  });

  // Lookup shaders and build material
  return new THREE.ShaderMaterial({
    uniforms:       uniforms,
    vertexShader:   ThreeRTT.getShader('generic-vertex-screen'),
    fragmentShader: ThreeRTT.getShader(fragmentShader)//,
  });
};/**
 * Debug/testing helper that displays the given rendertargets in a grid
 */
ThreeRTT.Display = function (targets, gx, gy) {
  if (!(targets instanceof Array)) {
    targets = [targets];
  }

  this.gx = gx || targets.length;
  this.gy = gy || 1;
  this.targets = targets;
  this.n = targets.length;

  THREE.Object3D.call(this);
  this.make();
}

ThreeRTT.Display.prototype = _.extend(new THREE.Object3D(), {

  make: function () {
    var n = this.n,
        gx = this.gx,
        gy = this.gy,
        targets = this.targets;

    var igx = (gx - 1) / 2,
        igy = (gy - 1) / 2;

    var geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    var i = 0;
    for (var y = 0; i < n && y < gy; ++y) {
      for (var x = 0; i < n && x < gx; ++x, ++i) {
        var material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          map: ThreeRTT.toTexture(targets[i]),
          fog: false
        });
        material.side = THREE.DoubleSide;

        var mesh = new THREE.Mesh(geometry, material);
        mesh.renderDepth = 10000 + Math.random();
        this.add(mesh);

        if (gx > 1) mesh.position.x = -igx + x;
        if (gy > 1) mesh.position.y =  igy - y;
      }
    }
  }

});/**
 * Handle a world for rendering to texture (tQuery).
 *
 * @param world (object) World to sync rendering to.
 */
ThreeRTT.World  = function (world, options) {
  // Handle parameters.
  options = options || {};
  options = _.extend({
    autoRendering: true,
    autoSize:      !(options.width && options.height), // Default to autosize if no size specified
    order:         ++ThreeRTT.World.sequence,
    scale:         1//,
  }, options);

  // Inherit size from world
  options.width  = (!options.autoSize && options.width)
                   || ((world._opts && world._opts.renderW || 256) / options.scale);
  options.height = (!options.autoSize && options.height)
                   || ((world._opts && world._opts.renderH || 256) / options.scale);

  // Bind to world resize event for ThreeBox.js auto-resize.
  world.on('resize', function (width, height) {
    if (!options.autoSize) return;

    width /= options.scale;
    height /= options.scale;

    // Resize render target
    this.size(width, height);
  }.bind(this));

  // Remember creation state.
  this._options = options;
  this._world   = world;
  this._autoRendering  = options.autoRendering;

  // Copy renderer.
  this._renderer = world.tRenderer();

  // Create an RTT stage, pass-thru options.
  this._stage = new ThreeRTT.Stage(this._renderer, options);

  // Expose scene and camera
  this._scene  = this._stage.scene;
  this._camera = this._stage.camera;

  // Add to RTT queue at specified order.
  this.queue = ThreeRTT.RenderQueue.bind(world);
  if (options.autoRendering) this.queue.add(this);

  // Update sizing state
  this.size(options.width, options.height, true);
};

// All non-ordered passes go last, in order of addition.
ThreeRTT.World.sequence = 100000;

ThreeRTT.World.prototype = _.extend(new THREE.Object3D(), tQuery.World.prototype, {

  // Return the stage object.
  stage: function () {
    return this._stage;
  },

  // Return the virtual render target object.
  target: function () {
    return this._stage.target;
  },

  // Change the autosize behavior.
  autoSize: function (autoSize) {
    if (autoSize !== undefined) {
      this._options.autoSize = autoSize;
    }
    return this._options.autoSize;
  },

  // Adjust in response to size changes
  adjust: function (ignore) {
    var scale = this._options.scale;
    var width = this._options.width,
        height = this._options.height;

    if (this._options.autoSize) {
      // Resize immediately based off parent scale.
      var opts = this._world._opts;
      width = opts.renderW,
      height = opts.renderH;
    }

    width /= scale;
    height /= scale;

    // Compatibility with tQuery world
    this._opts = {
      renderW: width ,
      renderH: height//,
    };

    // Ignore on init.
    ignore || this._stage.size(width, height)
  },

  // Change the autoscale factor
  scale: function (scale) {
    if (scale) {
      this._options.scale = scale;
      this.adjust();
      return this;
    }

    return this._options.scale;
  },

  // Resize the RTT texture.
  size: function (width, height, ignore) {
    if (width && height) {
      this._options.width = width;
      this._options.height = height;

      // Ignore on init.
      this.adjust(ignore);
      return this;
    }

    return { width: this._options.width, height: this._options.height };
  },

  // Get stage options
  options: function () {
    return this._stage.options();
  },

  // Reset all passes
  reset: function () {
    this._stage.reset();
    return this;
  },

  // Add a painting rendering pass
  paint: function (object, empty) {
    this._stage.paint(object, empty);
    return this;
  },

  // Add an iterated rendering pass
  iterate: function (n, fragmentShader, textures, uniforms) {
    var material = fragmentShader instanceof THREE.Material
                 ? fragmentShader
                 : tQuery.createFragmentMaterial(
                    this, fragmentShader, textures, uniforms);

    this._stage.iterate(n, material);
    return this;
  },

  // Add a fragment rendering pass
  fragment: function (fragmentShader, textures, uniforms) {
    var material = fragmentShader instanceof THREE.Material
                 ? fragmentShader
                 : tQuery.createFragmentMaterial(
                    this, fragmentShader, textures, uniforms);

    this._stage.fragment(material);
    return this;
  },

  // Add a raytrace rendering pass
  raytrace: function (fragmentShader, textures, uniforms) {
    var material = fragmentShader instanceof THREE.Material
                 ? fragmentShader
                 : tQuery.createRaytraceMaterial(
                    this, fragmentShader, textures, uniforms);

    this._stage.fragment(material);
    return this;
  },

  // Add a downsample rendering pass
  downsample: function (worldFrom) {
    // Force this world to right size now if not autosizing
    if (!worldFrom.autoSize()) {
      var size = worldFrom.size();
      this._options.width = size.width;
      this._options.height = size.height;
    }

    // Force this world to right scale (will autosize)
    var scale = worldFrom.scale();
    this.scale(scale * 2);

    var material = tQuery.createDownsampleMaterial(worldFrom, this);
    this._stage.fragment(material);

    return this;
  },

  // Return the virtual texture for reading from this RTT stage.
  read: function (n) {
    return this._stage.read(n);
  },

  // Return uniform for reading from this render target
  uniform: function () {
    return this._stage.uniform();
  },

  // Render this world.
  render: function () {
    // Render to write target.
    this._stage.render();

    return this;
  },

  // Destroy/unlink this world.
  destroy: function () {
    // Remove stage.
    this._stage.destroy();
    this._stage = null;

  	// Remove self from rendering queue.
    this.queue.remove(this);

  	// Microevent.js notification
  	this.trigger('destroy');

    return this;
  }
});

// Make it pluginable.
tQuery.pluginsInstanceOn(ThreeRTT.World);

// Make it eventable.
tQuery.MicroeventMixin(ThreeRTT.World.prototype)
/**
 * Priority queue for render-to-texture stages (tQuery).
 *
 * Attach a weighted queue to the given world, rendered before the world itself.
 */
ThreeRTT.RenderQueue = function (world) {
  this.world = world;
  this.queue = [];
  this.callback = null;

  this.renderer = world.tRenderer();
};

ThreeRTT.RenderQueue.prototype = {
  // Add render stage to queue
  add: function (stage) {
    this.queue.push(stage);
    this.sort();
    this.init();
  },

  // Remove render stage from queue.
  remove: function (stage) {
    this.queue.splice(this.queue.indexOf(stage), 1);
    this.cleanup();
  },

  // Ensure we are hooked into the world's rendering pipeline.
  init: function () {
    var queue = this.queue,
        world = this.world;

    if (queue.length && !this.callback) {
      world.loop().hookPreRender(this.callback = function () {
        _.each(queue, function (stage) {
          stage.render();
        });
      });
    }
  },

  // Unhook from world if no longer needed.
  cleanup: function () {
    var queue = this.queue,
        world = this.world;

    if (!queue.length && this.callback) {
      world.loop().unhookPreRender(this.callback);
      this.callback = null;
    }
  },

  // Sort queue by given order.
  sort: function () {
    this.queue.sort(function (a, b) {
      return a.order - b.order;
    });
  }
};

/**
 * Helper to return the single RenderQueue associated with a world.
 */
ThreeRTT.RenderQueue.bind = function (world) {
  var key = '__rttRenderQueue';

  // Singleton attached to world.
  if (world[key]) {
    return world[key];
  }
  return (world[key] = new ThreeRTT.RenderQueue(world));
}
/**
 * Create a render-to-texture world for this world.
 */
tQuery.World.registerInstance('rtt', function (options) {
  return tQuery.createRTT(this, options);
});

/**
 * Add a surface showing a render-to-texture surface to this world.
 */
tQuery.World.registerInstance('compose', function (rtts, fragmentShader, textures, uniforms) {
  var compose = tQuery.createComposeRTT(rtts, fragmentShader, textures, uniforms);
  this.add(compose);
  return compose;
});

/**
 * Add a surface showing a render-to-texture surface to this world.
 */
tQuery.World.registerInstance('display', function (targets, gx, gy) {
  var display = tQuery.createDisplayRTT(targets, gx, gy);
  this.add(display);
  return display;
});

/**
 * Create a render-to-texture world (static).
 */
tQuery.registerStatic('createRTT', function (world, options) {
  // Create new RTT world.
  return new ThreeRTT.World(world, options);
});

/**
 * Composite a render-to-texture image full screen
 */
tQuery.registerStatic('createComposeRTT', function (rtts, fragmentShader, textures, uniforms) {
  return new ThreeRTT.Compose(rtts, fragmentShader, textures, uniforms);
});

/**
 * Create a display surface showing one or more textures in a grid.
 */
tQuery.registerStatic('createDisplayRTT', function (targets, gx, gy) {
  return new ThreeRTT.Display(targets, gx, gy);
});

/**
 * Create a ShaderMaterial.
 */
tQuery.registerStatic('createShaderMaterial', function (worlds, vertexShader, fragmentShader, textures, uniforms) {
  return new ThreeRTT.FragmentMaterial(worlds, vertexShader, fragmentShader, textures, uniforms);
});

/**
 * Create a FragmentMaterial.
 */
tQuery.registerStatic('createFragmentMaterial', function (worlds, fragmentShader, textures, uniforms) {
  return new ThreeRTT.FragmentMaterial(worlds, fragmentShader, textures, uniforms);
});

/**
 * Create a RaytraceMaterial.
 */
tQuery.registerStatic('createRaytraceMaterial', function (world, fragmentShader, textures, uniforms) {
  return new ThreeRTT.RaytraceMaterial(world, fragmentShader, textures, uniforms);
});

/**
 * Create a DownsampleMaterial.
 */
tQuery.registerStatic('createDownsampleMaterial', function (worldFrom, worldTo) {
  return new ThreeRTT.DownsampleMaterial(worldFrom, worldTo);
});
/**
 * ShaderGraph.js. Assemble GLSL shaders on the fly.
 */

// Check dependencies.
;(function (deps) {
  for (var i in deps) {
    if (!window[i]) throw "Error: ShaderGraph requires " + deps[i];
  }
})({
  'THREE': 'Three.js'//,
});

// Namespace.
window.ShaderGraph = {};

// Fetch shader from <script> tag by id
ShaderGraph.getShader = function (id) {
  var elem = document.getElementById(id);
  return elem && (elem.innerText || elem.textContent) || id;
};(function ($) {

/**
 * Building block for effects, wraps a shader node, guides compilation.
 */
$.Block = function (node) {
  node = node || new $.Node();
  this.node(node);

  this.children = [];
  this.parent = null;
  this.properties = {};
  this.index = ++$.Block.index;

  this.refresh();
};

$.Block.index = 0;

$.Block.prototype = {

  node: function (node) {
    if (node !== undefined) {
      this._node = node;
      return this;
    }
    return this._node;
  },

  refresh: function () {
    this._node.owner(this);
    this._node.outlets(this.outlets());
  },

  fetch: function (program, phase, outlet, priority) {
    // add outlet code to program
  }//,

};

/**
 * Building block for a GLSL shader
 */
$.Block.Snippet = function (code) {
  this.snippet = new $.Snippet(code);

  $.Block.call(this);
};

$.Block.Snippet.prototype = _.extend({}, $.Block.prototype, {

  insert: function (program, phase, priority) {
    // Compile code into program.
    $.Block.Snippet.compileCall(program, phase, this.node(), this.snippet, priority);
  },

  fetch: function (program, phase, outlet, priority) {
    // Ensure code is included in program.
    if (!program.include(this, phase)) {
      this.insert(program, phase, priority);
    }
    // Use this outlet's ID as intermediate variable name.
    return outlet.id();
  },

  outlets: function () {
    return $.Block.Snippet.makeOutlets(this.snippet);
  }//,

});

/**
 * Building block for a renderable material
 */
$.Block.Material = function (vertex, fragment) {
  this.vertex = new $.Snippet(vertex);
  this.fragment = new $.Snippet(fragment);

  $.Block.call(this);
};

$.Block.Material.prototype = _.extend({}, $.Block.prototype, {

  compile: function () {
    if (this.node().outputs.length > 0) throw "Can't compile material with outputs";

    var node = this.node();
    var program = new $.Program();

    this.insert(program, 'vertex', 0);
    this.insert(program, 'fragment', 0);

    program.compile();

    return program;
  },

  insert: function (program, phase, priority) {
    $.Block.Snippet.compileCall(program, phase, this.node(), this[phase], priority);
  },

  fetch: function (program, phase, outlet, priority) {
    // Ensure code is included only once in program.
    if (!program.include(this, phase)) {
      this.insert(program, phase, priority);
    }

    // Ensure vertex shader is added to program even if vertex outputs are not used.
    if (phase == 'fragment') {
      if (!program.include(this, 'vertex')) {
        this.insert(program, 'vertex', 0);
      }
    }

    // Use this outlet's ID as intermediate variable name.
    return outlet.id();
  },

  outlets: function () {
    var vertex   = $.Block.Snippet.makeOutlets(this.vertex);
    var fragment = $.Block.Snippet.makeOutlets(this.fragment);

    return _.union(vertex, fragment);
  }//,

});

/**
 * Make outlets based on a given signature.
 */
$.Block.Snippet.makeOutlets = function (snippet) {
  var outlets = [];

  // Since snippets are cached, cache outlets too.
  if (snippet.outlets) {
    return snippet.outlets;
  }

  var args = snippet.arguments();

  _.each(args.parameters, function (arg) {
    arg.meta = { required: true };
    arg.hint = arg.name.replace(/(In|Out)$/, '');
    arg.category = 'parameter';
    outlets.push(arg);
  });

  _.each(args.uniforms, function (arg) {
    arg.meta = { };
    arg.hint = arg.name.replace(/(In|Out)$/, '');
    arg.category = 'uniform';
    arg.inout = $.IN;
    outlets.push(arg);
  });

  snippet.outlets = outlets;

  return outlets;
}

/**
 * Compile a GLSL snippet call by tracing inputs across the graph.
 */
$.Block.Snippet.compileCall = function (program, phase, node, snippet, priority) {
  var signature = snippet.arguments();
  var args = [];

  // Assign intermediate variables.
  _.each(signature.parameters, function (arg) {
    var outlet = node.get(arg.name);
    if (arg.inout == $.IN) {
      if (outlet.input) {
        var owner = outlet.input.node.owner();

        var variable = owner.fetch(program, phase, outlet.input, priority + 1);
        program.variable(phase, variable, arg);
        args.push(variable);
      }
      else {
        console.log('Outlet', arg, outlet);
        throw ["Missing connection on outlet for " + arg.name];
      }
    }
    else if (arg.inout == $.OUT) {
      var variable = outlet.id();
      program.variable(phase, variable, arg);
      args.push(variable);
    }
  });

  // Add uniforms
  var replaced = [];
  _.each(signature.uniforms, function (arg) {
    var outlet = node.get(arg.name);

    // Replace uniform with argument
    if (outlet.input) {
      var owner = outlet.input.node.owner();

      var variable = owner.fetch(program, phase, outlet.input, priority + 1);
      program.variable(phase, variable, arg);
      args.push(variable);
      replaced.push(arg.name);
    }
    // Pass through uniform
    else {
      program.external('uniform', arg);
    }
  });

  // Add attributes
  _.each(signature.attributes, function (arg) {
    program.external('attribute', arg);
  });

  // Add varyings
  _.each(signature.varyings, function (arg) {
    program.external('varying', arg);
  });

  // Compile snippet and add to program.
  var name = ['', 'sg', phase, snippet.name, node.owner().index ].join('_');
  var code = snippet.compile(name, replaced, true);
  program.add(phase, name, args, code, priority);
};


})(ShaderGraph);(function ($) {

/**
 * Helps build graphs of blocks/nodes with chainable API.
 */
$.Factory = function () {
  this.end();
};

$.Factory.prototype = {

  snippet: function (code, op) {
    op = op || 'append';

    var block = new $.Block.Snippet(ShaderGraph.getShader(code));
    this[op](block.node());

    return this;
  },

  material: function (vertex, fragment, op) {
    op = op || 'append';

    var block = new $.Block.Material(ShaderGraph.getShader(vertex), ShaderGraph.getShader(fragment));
    this[op](block.node());

    return this;
  },

  snippetBefore: function (code) {
    this.snippet(code, 'prepend');
    return this;
  },


  materialBefore: function (vertex, fragment) {
    this.material(code, 'prepend');
    return this;
  },

  append: function (node) {
    if (!node.graph) this.graph.add(node);

    var context = this.stack[0];

    _.each(context.end, function (end) {
      end.connect(node);
    });
    if (!context.start.length) {
      context.start = [node];
    }
    context.end = [node];

    return this;
  },

  prepend: function (node) {
    if (!node.graph) this.graph.add(node);

    var context = this.stack[0];

    _.each(context.start, function (start) {
      node.connect(start);
    });
    if (!context.end.length) {
      context.end = [node];
    }
    context.start = [node];

    return this;
  },

  group: function () {
    // Inner var holds working state, outer var holds accumulated state.
    this.stack.unshift({ start: [], end: [] });
    this.stack.unshift({ start: [], end: [] });

    return this;
  },

  next: function () {
    var sub = this.stack.shift();
    var main = this.stack[0];

    main.start = main.start.concat(sub.start);
    main.end   = main.end.concat(sub.end);

    this.stack.unshift({ start: [], end: [] });

    return this;
  },

  combine: function () {
    if (this.stack.length <= 2) throw "Popping factory stack too far.";

    this.next();
    this.stack.shift();

    var sub = this.stack.shift(),
        main = this.stack[0];

    _.each(sub.start, function (to) {
      _.each(main.end, function (from) {
        from.connect(to, true);
      });
    });
    main.end = sub.end;

    return this;
  },

  end: function () {
    var graph = this.graph;

    this.graph = new $.Graph();
    this.stack = [];
    this.group();

    // Add compile shortcut.
    if (graph) {
      graph.compile = function () {
        return graph.tail().owner().compile();
      };
    }

    return graph;
  }//,
};


})(ShaderGraph);
(function ($) {

/**
 * Model of a shader program as it's being built.
 *
 * Is passed around and accumulates data, after which .compile() is called to finalize.
 */
$.Program = function () {
  this.calls = { vertex: {}, fragment: {} };
  this.variables = { vertex: {}, fragment: {} };
  this.externals = {};

  this.compiled = false;
  this.attributes = {};
  this.uniforms = {};
  this.vertexShader = '';
  this.fragmentShader = '';

  this.includes = { vertex: [], fragment: [] };
}

// TODO Add support for array types.
$.Program.types = {
  'f':  'float',
  'v2': 'vec2',
  'v3': 'vec3',
  'v4': 'vec4',
  'm3': 'mat3',
  'm4': 'mat4',
  't':  'sampler2D'//,
};

$.Program.prototype = {

  include: function (object, phase) {
    if (this.includes[phase].indexOf(object) >= 0) {
      return true;
    }
    this.includes[phase].push(object);
    return false;
  },

  external: function (category, arg) {
    arg = _.extend({ category: category }, arg);
    this.externals[arg.name] = arg;
  },

  variable: function (phase, name, arg) {
    arg = _.extend({}, arg, { name: name });
    this.variables[phase][name] = arg;
  },

  add: function (phase, name, args, code, priority) {
    var call = this.calls[phase][name];
    if (call) {
      call.priority = Math.min(call.priority, priority);
    }
    else {
      this.calls[phase][name] = { name: name, args: args, code: code, priority: priority };
    }
  },

  compile: function () {
    // Prepare uniform/attribute definitions for Three.js
    _.each(this.externals, function (e) {
      if (e.category == 'uniform') {
        this.uniforms[e.name] = {
          type: e.type,
          value: e.value//,
        };
      }
      if (e.category == 'attribute') {
        this.attributes[e.name] = {
          type: e.type,
          value: []//,
        };
      }
    }.bind(this));

    // Prepare vertex and fragment bodies.
    _.each([ 'vertex', 'fragment' ], function (phase) {

      // Build combined header without redundant definitions.
      var header = [];
      _.each(this.externals, function (e) {
        // Exclude vertex attributes from fragment shader.
        if (e.category == 'attribute' && phase == 'fragment') return;

        // Add definition
        header.push([e.category, e.signature, ';'].join(' '));
      }.bind(this));
      header = header.join("\n");

      var sorted = _.toArray(this.calls[phase]);
      var library = [ header ];

      // Start main function.
      var main = [ 'void main() {'];

      // Add variable definitions.
      _.each(this.variables[phase], function (variable) {
        main.push([ $.Program.types[variable.type], variable.name, ';' ].join(' '));
      });

      // Add calls.
      sorted.sort(function (a, b) {
        return b.priority - a.priority;
      });
      _.each(sorted, function (call) {
        library.push(call.code);
        main.push([ call.name, '(', call.args.join(','), ');' ].join(''))
      });
      main.push('}');

      // Build shader body
      this[phase + 'Shader'] = [ library.join("\n"), main.join("\n") ].join("\n");
    }.bind(this));

    this.compiled = true;
  },

  material: function () {
    if (!this.compiled) throw "Fetching material from uncompiled program.";
    return new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertex,
      fragmentShader: this.fragment//,
    });
  }//,

};

})(ShaderGraph);(function ($) {

/**
 * Parse a snippet of GLSL code so it can be composed into a shader.
 *
 * Must contain a single function with in/out parameters, returning void.
 */
$.Snippet = function (code) {

  // Only need to parse each snippet once.
  if ($.Snippet.cache[code]) {
    return $.Snippet.cache[code];
  }
  else {
    $.Snippet.cache[code] = this;
  }

  this.code = code;

  this.attributes = [];
  this.uniforms   = [];
  this.varyings   = [];
  this.parameters = [];
  this.signature  = '';
  this.body       = '';

  this.parseCode(code);
}

$.Snippet.cache = {};

$.Snippet.types = {
  'float':       'f',
  'vec2':        'v2',
  'vec3':        'v3',
  'vec4':        'v4',
  'mat3':        'm3',
  'mat4':        'm4',
  'sampler2D':   't',
  'samplerCube': 't'//,
};

$.Snippet.defaults = {
  'float':       0,
  'vec2':        new THREE.Vector3(),
  'vec3':        new THREE.Vector3(),
  'vec4':        new THREE.Vector4(),
  'mat4':        new THREE.Matrix4(),
  'sampler2D':   0,
  'samplerCube': 0//,
};

$.Snippet.prototype = {

  compile: function (name, replaced, bodyOnly) {
    // Build updated function signature.
    var signature = this.signature.slice();
    var header = [];
    replaced = replaced || [];

    // Prepare uniforms
    _.each(this.uniforms, function (item) {
      if (replaced.indexOf(item.name) >= 0) {
        signature.push(item.signature);
      }
      else if (!bodyOnly) {
        header.push(['uniform', item.signature].join(' '));
      }
    });

    // Prepare attributes
    !bodyOnly && _.each(this.attributes, function (item) {
      header.push(['attribute', item.signature].join(' '));
    });

    // Prepare varyings
    !bodyOnly && _.each(this.varyings, function (item) {
      header.push(['varying', item.signature].join(' '));
    });

    // Insert new signature into body
    var body = this.body.replace(/\s*void\s+([A-Za-z0-9]+)\s*\([^\)]*\)/g, ['void', name + '(', signature.join(', '), ')'].join(' '));

    // Assemble code
    header.push(body);
    return header.join(';\n')
  },

  arguments: function () {
    return {
      uniforms: this.uniforms,
      varyings: this.varyings,
      attributes: this.attributes,
      parameters: this.parameters//,
    };
  },

  type: function (type, array) {
    type = ($.Snippet.types[type] || 'f') + (array ? 'v' : '');
    type = type == 'fv' ? 'fv1' : type;
    return type;
  },

  parseAttribute: function (match) {
    var signature = match[1],
        type = match[2],
        name = match[3],
        array = match[4];

    this.attributes.push({
      name: name,
      type: this.type(type, array),
      signature: signature//,
    });
  },

  parseUniform: function (match) {
    var signature = match[1],
        type = match[2],
        name = match[3],
        array = match[4];

    this.uniforms.push({
      name: name,
      type: this.type(type, array),
      value: $.Snippet.defaults[type] || 0,
      signature: signature//,
    });
  },

  parseVarying: function (match) {
    var signature = match[1],
        type = match[2],
        name = match[3],
        array = match[4];

    this.varyings.push({
      name: name,
      type: this.type(type, array),
      signature: signature//,
    });
  },

  parseSignature: function (match) {
    this.name = match[1];

    // Ignore empty signature
    var signature = match[2].replace(/^\s*$/g, '');
    if (signature.length == 0) {
      this.signature = [];
      return;
    }

    // Parse out arguments.
    var arguments = this.signature = signature.split(',');
    _.each(arguments, function (definition) {
      var match = /((?:(in|out|inout)\s+)?([A-Za-z0-9]+)\s+([A-Za-z0-9_]+)\s*(?:\[([^\]]+)\])?)(?:$|(?=;))/.exec(definition);

      var signature = match[1],
          inout = match[2],
          type = match[3],
          name = match[4],
          array = match[5];

      var inouts = {
        'in': $.IN,
        'out': $.OUT,
        'inout': $.INOUT//,
      };

      this.parameters.push({
        inout: inouts[inout || 'in'],
        name: name,
        type: this.type(type, array),
        signature: signature//,
      });
    }.bind(this));
  },

  parseCode: function (code) {
    function findAll(re, string) {
      if (!re.global) throw "Can't findAll non-global regexp";
      var match, all = [];
      while (match = re.exec(string)) {
        all.push(match);
      };
      return all;
    }

    // Remove all comments and normalize newlines
    code = code.replace(/\r\n?/g, '\n').replace(/\/\/[^\n]*\n/g, ' ').replace(/\/\*(.|\n)*?\*\//g, ' ');

    // Find all attributes/uniforms/varying + function signature
    var attributes = findAll(/(?:^|;)\s*attribute\s+(([A-Za-z0-9]+)\s+([A-Za-z0-9_]+)\s*(?:\[([^\]]+)\])?)(?:$|(?=;))/g, code);
    var uniforms = findAll(/(?:^|;)\s*uniform\s+(([A-Za-z0-9]+)\s+([A-Za-z0-9_]+)\s*(?:\[([^\]]+)\])?)(?:$|(?=;))/g, code);
    var varyings = findAll(/(?:^|;)\s*varying\s+(([A-Za-z0-9]+)\s+([[A-Za-z0-9_]+)\s*(?:\[([^\]]+)\])?)(?:$|(?=;))/g, code);
    var signature = findAll(/(?:^|;)\s*void\s+([A-Za-z0-9]+)\s*\(([^\)]*)\)\s*{/g, code);

    if (!signature[0]) throw "Could not parse shader snippet. Must contain a void-returning function with in/outs: " + code;

    // Process uniforms/varyings and remove from source.
    var matches = {
      parseAttribute: attributes,
      parseUniform:   uniforms,
      parseVarying:   varyings//,
    };
    var body = code;
    _.each(matches, function (set, key) {
      _.each(set, function (item) {
        this[key](item);
        body = body.replace(item[0], '');
      }.bind(this));
    }.bind(this));
    body = body.replace(/^\s*;/, '');

    // Process function signature.
    this.parseSignature(signature[0]);
    this.body = body;
  }//,

};

})(ShaderGraph);
(function ($) {

/**
 * Graph of shader nodes.
 */
$.Graph = function (nodes, parent) {
  this.parent = parent || null;
  this.nodes = [];
  nodes && this.add(nodes);
};

$.Graph.prototype = {

  iterate: function (callback) {
    _.each(this.nodes, function (node) {
      callback(node, node._owner);
    });
  },

  exposed: function () {
    var exposed = [];
    this.iterate(function (node) {
      _.each(node.outlets(), function (outlet) {
        if (outlet.exposed) {
          exposed.push(outlet);
        }
      });
    });
    return exposed;
  },

  inputs: function () {
    var inputs = [];
    this.iterate(function (node) {
      _.each(node.inputs, function (outlet) {
        if (outlet.input == null) {
          inputs.push(outlet);
        }
      });
    });
    return inputs;
  },

  outputs: function () {
    var outputs = [];
    this.iterate(function (node) {
      _.each(node.outputs, function (outlet) {
        if (outlet.output.length == 0) {
          outputs.push(outlet);
        }
      });
    });
    return outputs;
  },

  tail: function () {
    return this.nodes[this.nodes.length - 1];
  },

  add: function (node) {

    // Array syntax.
    if (node.constructor == Array) return _.each(node, function (node) { this.add(node); }.bind(this));

    // Sanity check.
    if (node.graph) throw "Adding node to two graphs at once";

    // Link node to graph.
    node.link(this);

    // Add node to list
    this.nodes.push(node);
  },

  remove: function (node, ignore) {
    // Array syntax.
    var that = this;
    if (node.constructor == Array) return _.each(node, function (node) { that.remove(node); });

    // Sanity check.
    if (node.graph != this) throw "Removing node from wrong graph.";

    // Disconnect all outlets
    ignore || node.disconnect();

    // Remove node from list.
    this.nodes.splice(this.nodes.indexOf(node), 1);
  }//,
};

$.IN = 0;
$.OUT = 1;
$.INOUT = 2;

})(ShaderGraph);
(function ($) {

/**
 * Node in shader graph.
 */
$.Node = function (owner, outlets) {
  this.graph = null;
  this.inputs = [];
  this.outputs = [];
  this._outlets = {};

  this.owner(owner);
  this.outlets(outlets);
};

$.Node.prototype = {

  // Set/get object represented by the node.
  owner: function (owner) {
    if (owner !== undefined) {
      // Setter
      this._owner = owner;

      // Chain
      return this;
    }
    // Getter
    return this._owner;
  },

  // Notify: become part of the given graph
  link: function (graph) {
    this.graph = graph;
  },

  // Retrieve input
  getIn: function (name) {
    return this.get(name, $.IN);
  },

  // Retrieve output
  getOut: function (name) {
    return this.get(name, $.OUT);
  },

  // Find outlet by name.
  get: function (name, inout) {
    if (inout === undefined) {
      return this.get(name, $.IN) || this.get(name, $.OUT);
    }
    return this._outlets[[name, inout].join('-')];
  },

  // Return hash key for outlet
  key: function (outlet) {
    return [outlet.name, outlet.inout].join('-');
  },

  // Set new outlet definition
  outlets: function (outlets) {
    if (outlets !== undefined) {
      // Return new/old outlet matching hash key
      function hash(outlet) {
        // Match by name, direction and type.
        return [outlet.name, outlet.inout, outlet.type].join('-');
      };

      // Build hash of new outlets
      var keys = {};
      _.each(outlets, function (outlet) {
        keys[hash(outlet)] = true;
      }.bind(this));

      // Remove missing outlets
      _.each(this._outlets, function (outlet) {
        if (!keys[hash(outlet)]) this.remove(outlet);
      }.bind(this));

      // Insert new outlets.
      _.each(outlets, function (outlet) {
        // Find match by type/name/direction
        var existing = this.get(outlet.name, outlet.inout);
        if (!existing) {
          // Spawn new outlet
          outlet = new $.Outlet(outlet);
          this.add(outlet);
        }
        else {
          // Update existing outlets in place to retain connections.
          existing.morph(outlet);
        }
      }.bind(this));

      // Chain
      return this;
    }
    return this._outlets;
  },

  // Add outlet object to node.
  add: function (outlet) {
    var key = this.key(outlet);
        outlets = this._outlets,
        _in = this.inputs,
        _out = this.outputs;

    // Sanity checks.
    if (outlet.node) throw "Adding outlet to two nodes at once.";
    if (outlets[key]) throw "Adding two identical outlets to same node.";

    // Link back outlet.
    outlet.link(this);

    // Add to name list and inout list.
    outlets[key] = outlet;
    (outlet.inout == $.IN ? _in : _out).push(outlet);

    // Chain
    return this;
  },

  // Remove outlet object from node.
  remove: function (outlet) {
    var outlets = this._outlets,
        key = this.key(outlet),
        inout = outlet.inout,
        set = outlet.inout == $.IN ? this.inputs : this.outputs;

    // Sanity checks
    if (outlet.node != this) throw "Removing outlet from wrong node.";

    // Disconnect outlet.
    outlet.disconnect();

    // Unlink outlet.
    outlet.link(null);

    // Remove from name list and inout list.
    delete outlets[key];
    set.splice(set.indexOf(outlet), 1);

    // Chain
    return this;
  },

  // Connect to the target node by matching up inputs and outputs.
  connect: function (node, empty, force) {
    var outlets = {},
        hints = {},
        counters;

    // Keep track of how often a particular type has been encountered.
    function track(match) {
      return counters[match] = (counters[match] || 0) + 1;
    }
    function reset() {
      counters = {};
    }

    // Build hash keys of target outlets.
    reset();
    _.each(node.inputs, function (outlet) {
      // Only autoconnect if not already connected.
      if (!force && outlet.input) {
        return;
      }

      // Match outlets by type/name hint, then type/position key.
      var type = outlet.type,
          hint = [type, outlet.hint].join('-');

      if (!hints[hint]) hints[hint] = outlet;
      outlets[type] = outlets[type] || [];
      outlets[type].push(outlet);
    });

    // Build hash keys of source outlets.
    reset();
    _.each(this.outputs, function (outlet) {
      // Ignore this outlet if only matching empties.
      if (empty && outlet.output.length) return;

      // Match outlets by type and name.
      var type = outlet.type,
          hint = [type, outlet.hint].join('-');

      // Connect if found.
      if (hints[hint]) {
        hints[hint].connect(outlet);

        delete hints[hint];
        outlets[type].splice(outlets[type].indexOf(outlet), 1);
        return;
      }

      // Match outlets by type and order.
      // Link up corresponding outlets.
      if (outlets[type] && outlets[type].length) {
        outlets[type].shift().connect(outlet);
      }
    });

    // Chain
    return this;
  },

  // Disconnect entire node
  disconnect: function (node) {
    _.each(this.inputs, function (outlet) {
      outlet.disconnect();
    });

    _.each(this.outputs, function (outlet) {
      outlet.disconnect();
    });

    // Chain
    return this;
  }//,

};

})(ShaderGraph);
(function ($) {
$.Outlets = 0;

$.Outlet = function (inout, name, hint, type, category, exposed, meta) {

  // Object constructor syntax
  if (typeof inout == 'object') {
    var object = inout;
    return new $.Outlet(object.inout, object.name, object.hint, object.type, object.category, object.exposed);
  }

  this.node     = null;
  this.inout    = inout;
  this.name     = name;
  this.hint     = hint || name;
  this.type     = type;
  this.category = category;
  this.exposed  = !!exposed;
  this.meta     = meta || {};
  this.index    = ++$.Outlets;
  this.key      = null;

  this.input = null;
  this.output = [];
};

$.Outlet.prototype = {
  // Unique ID for this outlet.
  id: function () {
    return ['', 'sg', this.name, this.index].join('_');
  },

  // Set exposed flag
  expose: function (exposed) {
    this.exposed = exposed;
  },

  // Change into given outlet without touching connections.
  morph: function (outlet) {
    this.inout    = outlet.inout;
    this.name     = outlet.name;
    this.type     = outlet.type;
    this.category = outlet.category;
    this.exposed  = outlet.exposed;
    this.meta     = outlet.meta || {};
  },

  // Connect to given outlet.
  connect: function (outlet) {
    // Connect input from the other side.
    if (this.inout == $.IN && outlet.inout == $.OUT) {
      return outlet.connect(this);
    }

    // Disallow bad combinations.
    if (this.inout != $.OUT || outlet.inout != $.IN) {
      console.log(this, outlet)
      throw "Can't connect out/out or in/in outlets.";
    }

    // Check for existing connection.
    if (outlet.input == this) return;

    // Disconnect existing connections.
    outlet.disconnect();

    // Add new connection.
    outlet.input = this;
    this.output.push(outlet);
  },

  // Disconnect given outlet (or all).
  disconnect: function (outlet) {
    if (this.inout == $.IN) {
      // Disconnect input from the other side.
      if (this.input) {
        this.input.disconnect(this);
      }
    }
    else {
      if (outlet) {
        // Remove one outgoing connection.
        var index = this.output.indexOf(outlet);
        if (index >= 0) {
          this.output.splice(index, 1);
          outlet.input = null
        }
      }
      else {
        // Remove all outgoing connections.
        _.each(this.output, function (outlet) {
          outlet.input = null
        });
        this.output = [];
      }
    }
  },

  // Link to given node.
  link: function (node) {
    this.node = node;
  }//,
};

})(ShaderGraph);/**
 * MathBox.js. Math plotting tool for three.js / webgl.
 */

// Math!
var π = Math.PI,
    τ = π * 2;

// Check dependencies.
(function (deps) {
  for (var i in deps) {
    if (!window[i]) throw "Error: MathBox requires " + deps[i];
  }
})({
  'THREE': 'Three.js',
  'tQuery': 'tQuery.js (bundle)',
  'ThreeBox': 'ThreeBox.js',
  'ThreeRTT': 'ThreeRTT.js'//,
});

// Namespace.
window.MathBox = {};

// Shortcut static call.
window.mathBox = function (element, options) {
  // Omit element (use body)
  if (element && !(element instanceof Node)) {
    options = element;
    element = null;
  }

  return tQuery.createWorld(options).mathBox(element, options);
};

// Fetch shader from <script> tag by id
MathBox.getShader = function (id) {
  var elem = document.getElementById(id);
  return elem && (elem.innerText || elem.textContent) || id;
};

Math.sign = function (x) {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
};
MathBox.Attributes = function () {
};

MathBox.Attributes.prototype = {

  get: function (key) {
    if (key === undefined) return this.__attributes || {};
    if (!this.__attributes) return undefined;
    return this.__attributes[key];
  },

  set: function (object, value) {
    if (!this.__attributes) this.__attributes = {};
    if (!this.__validators) this.__validators = {};

    var changed = {},
        validators = this.__validators,
        attributes = this.__attributes,
        that = this;

    var validate = function (key, value) {
      if (validators[key] === undefined) {
        var method = 'validate' + key.charAt(0).toUpperCase() + key.slice(1);
        validators[key] = that[method] || false;
      }
      if (validators[key]) return validators[key].call(this, value);
      return value;
    }.bind(this);

    function set(key, value) {
      try {
        value = validate(key, value);
        changed[key] = value;
        attributes[key] = value;
      }
      catch (e) { throw "Exception setting '" + key + "' to '" + value + "': " + e; }
    }

    if (object === undefined || object === null) {
      return;
    }
    else if (object.constructor == String) {
      set(object, value);
    }
    else {
      _.each(object, function (value, key) {
        set(key, value);
      });
    }

    this.emit('change', changed);
  }//,

};

// Microeventable
MicroEvent.mixin(MathBox.Attributes);

MathBox.Attributes.mixin = function (klass) {
  _.each(['get', 'set', 'on', 'emit'], function (key) {
    klass.prototype[key] = MathBox.Attributes.prototype[key];
  })
};
/**
 * Attribute animator. Works on any object with the Attributes.js mixin.
 *
 * Requires manual synchronization by calling animator.update().
 */
MathBox.Animator = function () {
  this.active = [];
};

MathBox.Animator.now = 1;

MathBox.Animator.prototype = {

  /**
   * Return the final state of an object after all currently queued animations have run their course.
   */
  finalState: function (object) {
    var state = _.extend({}, object.get());
    if (object.__queue) {
      _.each(object.__queue, function (queue, key) {
        _.each(queue, function (op) {
          if (op.to) {
            state[key] = op.to;
          }
        });
      });
    }
    return state;
  },

  /**
   * Attach animator to an object.
   */
  attach: function (object) {
    if (object.__queue) return;
    if (!object.__attributes) throw "Cannot attach to object without attributes";

    var animator = this;

    // Override set method to abort running animations.
    var set = object.set;
    object.set = function (object, value, ignore) {

      if (!ignore) {
        var stop = object;

        // Argument parsing
        if (object === undefined || object === null) {
          return;
        }
        else if (object.constructor == String) {
          stop = {};
          stop[object] = value;
        }

        // Stop all animations on the given keys
        animator.stop(this, stop);
      }

      // Pass through to Attributes
      set.call(this, object, value);
    };

    // Prepare animation queue
    var queue = {};
    object.__queue = queue;
    object.__animations = 0;
  },

  /**
   * Hurry all animations on an object by speeding by a factor.
   */
  hurry: function (object, keys, factor) {
    factor = factor || 4;

    // Reduce
    _.each(keys || object.__queue, function (queue, key) {
      _.each(object.__queue[key], function (op) {
        op.hurry(factor);
      });
    }.bind(this));
  },

  /**
   * Stop all animations on an object.
   */
  stop: function (object, keys) {
    // Dequeue all animations, applying instantly.
    _.each(keys || object.__queue, function (queue, key) {
      while (object.__queue[key]) {
        this.dequeue(object, key, true);
      }
    }.bind(this));
  },

  /**
   * Animate a set of attributes on an object.
   */
  animate: function (object, attributes, options) {
    var defaults = {
      duration: 300//,
    };
    options = _.extend(defaults, options || {});

    this.attach(object);

    _.each(attributes, function (value, key) {
      // Init queue if necessary.
      var queue = object.__queue[key] = object.__queue[key] || [];

      // Queue delay
      if (options.delay) {
        var delay = new MathBox.Animator.Delay(object, key, options.delay);
        queue.push(delay);

        if (object.__animations++ == 0) {
          this.active.push(object);
        }
      }

      // Validate target value
      if (object.__validators[key]) {
        value = object.__validators[key].call(object, value);
      }

      // Queue new animation
      var animation = new MathBox.Animator.Animation(
                        object, key, value, options.duration, options.callback, options.ease);
      queue.push(animation);

      // Keep track of animating objects
      if (object.__animations++ == 0) {
        this.active.push(object);
      }
    }.bind(this));
  },

  /**
   * Remove current animation on an object attribute.
   */
  dequeue: function (object, key, apply) {

    // Check if key is animated
    var queue = object.__queue[key];
    if (!queue) return;

    // Remove from front of queue.
    var animation = queue.shift();
    if (queue.length == 0) delete object.__queue[key];

    // Apply animation instantly
    if (apply) {
      animation.skip();
    }

    // Keep track of animating objects
    if (--object.__animations == 0) {
      this.active.splice(this.active.indexOf(object), 1);
    }
  },

  /**
   * Update all currently running animations.
   */
  update: function (speed) {
    MathBox.Animator.now += speed; // Use synchronized clock

    var active = this.active.slice();
    _.each(active, function (object) {
      // Used to make queued animations match up at sub-frame times.
      var offset = 0;
      _.each(object.__queue, function update(queue, key) {
        // Write out animated attribute.
        var animation = queue[0];
        value = animation.apply(offset || 0);

        // Remove completed animations.
        if (animation.done()) {
          offset = animation.extra();
          this.dequeue(object, key);

          // Recurse into next animation.
          if (queue[0]) {
            update.call(this, queue, key);
          }
        }
      }.bind(this));
    }.bind(this));
  }//,
}

/**
 * Non-animation that just adds a delay.
 */
MathBox.Animator.Delay = function (object, key, duration) {
  this.object = object;
  this.key = key;
  this.duration = duration;
  this.start = 0;
  this.fraction = 0;
}

MathBox.Animator.Delay.prototype = {

  init: function (offset) {
    this.start = MathBox.Animator.now - (offset || 0);
  },

  apply: function (offset) {
    if (!this.start) this.init(offset);
    if (this.duration > 0) {
      this.fraction = Math.min(1, (MathBox.Animator.now - this.start) / this.duration);
    }
    else {
      this.fraction = 1;
    }
  },

  skip: function () {
    this.duration = 0;
  },

  hurry: function (factor) {
    this.duration -= (1 - this.fraction) * this.duration * (factor - 1);
  },

  extra: function () {
    return MathBox.Animator.now - this.start - this.duration;
  },

  done: function () {
    return this.fraction == 1;
  }//,
}

/**
 * Animation on a single attribute.
 */
MathBox.Animator.Animation = function (object, key, value, duration, callback, ease) {
  this.object = object;
  this.key = key;
  this.from = null;
  this.to = value;
  this.duration = duration;
  this.start = 0;
  this.fraction = 0;
  this.callback = callback;
  this.ease = ease;
};

MathBox.Animator.Animation.prototype = {

  init: function (offset) {
    this.start = MathBox.Animator.now - (offset || 0);
    if (this.from === null) this.from = this.object.get(this.key);
    if (this.from === undefined) {
      this.from = 0;
    }
  },

  apply: function (offset) {
    if (!this.start) this.init(offset);

    var object = this.object;
    var from = this.from;
    var to = this.to;
    var key = this.key;
    var ease = this.ease;

    // Calculate animation progress / fraction.
    var fraction;
    if (this.duration > 0) {
      fraction = Math.min(1, (MathBox.Animator.now - this.start) / (this.duration || 1));
    }
    else {
      fraction = 1;
    }
    this.fraction = fraction;

    // Simple easing support.
    var rolloff;
    switch (ease) {
      case 'in':
        rolloff = 1 - (1 - fraction) * (1 - fraction);
        break;
      case 'out':
        rolloff = fraction * fraction;
        break;
      case 'linear':
        rolloff = fraction;
        break;
      default:
        rolloff = .5-.5*Math.cos(fraction * π);
        break;
    }

    // Linear interpolation
    function lerp(from, to) {
      return from + (to - from) * rolloff;
    }

    // Interpolate between two arbitrary values/objects.
    function process(from, to) {

      // Handle default cases.
      if (to === undefined) {
        to = from;
      }
      if (from === undefined) {
        from = to;
      }
      if (to === from) {
        return from;
      }

      // Sanity type check.
      if (typeof from != typeof to) {
        console.log(object, key)
        throw "Data type mismatch between from/to values in animator. "+ key +': '+ from + ' ('+ from.constructor +')' + ", " + to + "("+ to.constructor +")";
      }

      // Type-specific behavior.
      var out;
      switch (typeof to) {
        default:
        case 'string':
          throw "Unimplemented value type in animator. ("+(typeof to)+")";

        case 'function':
          return function () {
            return process(from.apply(this, arguments), to.apply(this, arguments));
          };

        case 'boolean':
          return (fraction > .5) ? to : from;

        case 'number':
          return lerp(from, to);

        case 'object':
          if (!from) {
            return to;
          }
          if (!to) {
            return from;
          }
          if (to.constructor == Array) {
            out = [];
            _.loop(from.length, function (i) {
              out[i] = process(from[i], to[i]);
            })
            return out;
          }
          if (to.constructor == THREE.Matrix4) {
            out = new THREE.Matrix4()
            for (var i = 0; i < 16; ++i) {
              out.elements[i] = lerp(from.elements[i], to.elements[i]);
            }
            return out;
          }
          if (to.constructor == THREE.Vector3) {
            out = new THREE.Vector3()
            out.x = lerp(from.x, to.x);
            out.y = lerp(from.y, to.y);
            out.z = lerp(from.z, to.z);
            return out;
          }
          if (to.constructor == THREE.Color) {
            out = new THREE.Color()
            out.r = lerp(from.r, to.r);
            out.g = lerp(from.g, to.g);
            out.b = lerp(from.b, to.b);
            return out;
          }
          return (fraction > .5) ? to : from;
          //throw "Unimplemented value type in animator. "+(typeof to)+" ("+ to.constructor +")";
      }
    }

    var value = process(from, to);
    this.object.set(this.key, value, true);
  },

  hurry: function (factor) {
    this.duration -= (1 - this.fraction) * this.duration * (factor - 1);
  },

  skip: function () {
    this.duration = 0;
    this.fraction = 1;
    this.done();
  },

  extra: function () {
    return MathBox.Animator.now - this.start - this.duration;
  },

  done: function () {
    if (this.fraction == 1) {
      // Set final value.
      this.object.set(this.key, this.to, true);

      this.callback && this.callback();
      this.callback = null;
      return true;
    }
    return false;
  }//,
};

/**
 * Mathbox stage.
 *
 * Has a mathematical viewport, contains mathematical primitives, can be added to a three.js scene.
 */
MathBox.Stage = function (options, world, overlay) {
  this.options = options = options || {};

  this._world = world;

  // Prepare overlay
  this.overlay = overlay;
  world && world.on('resize', function (width, height) {
    this.overlay.size(width, height);
    this.width = width;
    this.height = height;
  }.bind(this));

  // Create array to hold primitives
  this.primitives = [];

  // Create material manager.
  this.materials = new MathBox.Materials(this);

  // Create attribute animator
  this.animator = new MathBox.Animator();
  this._transition = 0;
  this._speed = 1;

  // Create animateable camera controls.
  if (world) {
    this.cameraProxy = new MathBox.CameraProxy(world, this.options);
  }

  // Create viewport
  this.viewport({});

  // Create methods for available primitives.
  this.loadPrimitives();

  // Set options
  if (options.transition !== undefined) {
    this.transition(options.transition);
  }
  if (options.speed !== undefined) {
    this.speed(options.speed);
  }
};

// Inherit from Object3D to trick tQuery.
MathBox.Stage.prototype = new THREE.Object3D();

// Add attributes
MathBox.Attributes.mixin(MathBox.Stage);

// Make eventable
MicroEvent.mixin(MathBox.Stage);

MathBox.Stage.prototype = _.extend(MathBox.Stage.prototype, {

  /** 
   * Rendering loop
   */

  // Update before render.
  update: function () {
    var viewport = this._viewport,
        camera = this._world.tCamera(),
        width = this.width,
        height = this.height,
        speed = this._speed;

    // Apply running animations.
    var now = +new Date();
    if (!this.last) {
      this.last = now - 1000/60;
    }
    this.animator.update(speed * (now - this.last));
    this.last = now;

    // Update viewport transform.
    viewport.update(this);

    // Loop over all primitives.
    _.each(this.primitives, function (primitive) {
      // Adjust to viewport
      primitive.adjust(viewport, camera, width, height, this);

      // Loop over renderables
      var renderables = primitive.renderables();
      _.each(renderables, function (renderable) {
        // Adjust visible renderables to viewport
        renderable.isVisible() && renderable.adjust(viewport, camera, width, height, this);
      }.bind(this));
    }.bind(this));

    // Update sprite overlay
    this.overlay && this.overlay.update(camera);
  },

  /**
   * Primitive insertion/removal
   */

  add: function (object, animate) {
    // Overload Object3D.add

    if (object instanceof THREE.Object3D) {
      if (object instanceof MathBox.Sprite) {
        // Add to 2D overlay
        return this.overlay.add(object);
      }
      else {
        // Add to three.js scene tree
        return THREE.Object3D.prototype.add.call(this, object);
      }
    }
    else {
      // Add to mathbox.
      this._add(object);

      // Apply insertion animation
      animate = this.animateOptions(animate);
      var opacity = object.style.get('opacity');
      if (animate && opacity > 0) {
        object.style.set('opacity', 0);

        this.animator.animate(
          object.style,
          { opacity: opacity },
          animate);
      }

      return this;
    }
  },

  remove: function (object, animate) {
    // Overload Object3D.remove

    if (object instanceof THREE.Object3D) {
      if (object instanceof MathBox.Sprite) {
        // Remove from 2D overlay
        return this.overlay.remove(object);
      }
      else {
        // Remove from three.js scene tree
        return THREE.Object3D.prototype.remove.call(this, object);
      }
    }
    else {

      // Allow for removal via selector
      if (typeof object == 'string') {
        return _.each(this.select(object), function (object) {
          this.remove(object, animate);
        }.bind(this));
      }

      // Remove from mathbox (callback).
      var remove = function () {
        this._remove(object);
      }.bind(this);

      // Apply removal animation
      animate = this.animateOptions(animate);
      var opacity = object.style.get('opacity');

      if (animate && opacity > 0) {
        // Schedule removal
        animate.callback = remove;
        this.animator.animate(
          object.style,
          { opacity: 0 },
          animate);

        // Mark as removed
        object.removed = true;
      }
      else {
        // Remove immediately
        remove();
      }

      return this;
    }
  },

  /**
   * Add primitive to stage, instantiate its renderables.
   */
  _add: function (primitive) {
    var materials = this.materials;

    if (this.primitives.indexOf(primitive) != -1) return;
    this.primitives.push(primitive);

    primitive.make();

    var renderables = primitive.renderables();

    _.each(renderables, function (renderable) {
      renderable.make(materials);
      renderable.object && this.add(renderable.object);
    }.bind(this));
  },

  /**
   * Remove primitive from stage, remove its renderables.
   */
  _remove: function (primitive) {
    if (this.primitives.indexOf(primitive) == -1) return;

    this.primitives.splice(this.primitives.indexOf(primitive), 1);

    var renderables = primitive.renderables();
    _.each(renderables, function (renderable) {
      renderable.object && this.remove(renderable.object);
      renderable.destroy();
    }.bind(this));

    primitive.destroy();

  },

  ///// Primitive manipulation //////////////

  /**
   * Select primitives by type or ID.
   */
  select: function (selector, includeDead) {
    var out = [];

    // Allow literal object / array of objects
    if (typeof selector == 'object') {
      if (selector.constructor == Array) return selector;
      return [selector];
    }

    // Parse single selector
    var select = function (selector) {
      var out = [];

      // Universal selector
      if (selector == '*') {
        out = this.primitives.slice();
        out.push(this.viewport());
        out.push(this.cameraProxy);
        return out;
      }

      // See if selector is numeric
      if (selector == +selector) {
        // match by sequence number
        _.each(this.primitives, function (primitive) {
          if ((includeDead || !primitive.removed) && primitive.get('sequence') == selector) {
            out.push(primitive);
          }
        });
        return out;
      }

      // Parse css-like selector: #id, type
      var match = selector.match(/^\s*#([a-zA-Z0-9_-]+)|([a-zA-Z0-9_-]+)?\s*$/);
      if (!match) return [];

      var type = match[2],
          id = match[1];

      if (id) {
        // match by ID
        _.each(this.primitives, function (primitive) {
          if ((includeDead || !primitive.removed) && primitive.get('id') == id) {
            out.push(primitive);
          }
        });
      }
      else {

        // Special singletons
        if (type == 'camera') {
          return this.cameraProxy && [this.cameraProxy] || [];
        }

        if (type == 'viewport') {
          return [this.viewport()];
        }

        // Declared primitive types
        if (type) {
          _.each(this.primitives, function (primitive) {
            if ((includeDead || !primitive.removed) && primitive.type() == type) {
              out.push(primitive);
            }
          });
        }
      }

      return out;
    }.bind(this);

    // Split joined selector into individual selectors and apply
    var out = [];
    selector = (''+selector).split(',');
    _.each(selector, function (selector) {
      out = out.concat(select(selector));
    });
    return out;
  },

  /**
   * Set properties on primitives.
   */
  set: function (selector, options) {
    options = this.extractStyle(options);
    _.each(this.select(selector), function (primitive) {
      primitive.set(options);
      if (options.style) {
        primitive.style.set(options.style);
      }
    });

    return this;
  },

  /**
   * Get (finalized) properties of a primitive.
   */
  get: function (selector) {
    var animator = this.animator;

    selector = this.select(selector);
    if (selector.length < 1) return {};
    var object = selector[0];

    var out = animator.finalState(object);
    if (object.style) {
      var style = animator.finalState(object.style);
      out.style = style;
    }

    return out;
  },

  ////////// Primitive animation ////////////////////////

  /**
   * Set default transition duration
   */
  transition: function (transition) {
    if (transition !== undefined) {
      this._transition = transition;
      return this;
    }
    return this._transition;
  },

  /**
   * Set speed multiplier
   */
  speed: function (speed) {
    if (speed !== undefined) {
      this._speed = speed;
      return this;
    }
    return this._speed;
  },

  /**
   * Resolve animation options
   */
  animateOptions: function (animate, force) {
    var auto = this._transition,
        speed = this._speed;

    if (animate === true) animate = {};
    if (auto || force || (animate && (animate.delay || animate.duration))) {
      animate = _.extend({ delay: 0, duration: auto || 300 }, animate || {});
    }
    if (animate && (animate.delay || animate.duration)) {
      return animate;
    }
  },

  /**
   * Animate primitives to give state.
   */
  animate: function (selector, options, animate) {
    var animator = this.animator;

    options = this.extractStyle(options);
    animate = this.animateOptions(animate, true);

    if (options.style) {
      _.each(this.select(selector), function (primitive) {
        animator.animate(primitive.style, options.style, animate);
      });
      options = _.extend({}, options);
      delete options.style;
    }

    _.each(this.select(selector), function (primitive) {
      animator.animate(primitive, options, animate);
    });

    return this;
  },

  /**
   * Clone primitives and animate to new properties.
   */
  clone: function (selector, options, animate) {
    _.each(this.select(selector), function (primitive) {
      var original = this.get(primitive);

      // Reset creation ID of clone
      delete original.sequence;

      // Sort options into animatable and non-animatable
      var newOptions = _.extend({}, options);
      var remove = [];
      _.each(options, function (value, key) {
        if (key == 'id' || typeof value == 'boolean' || value === null) {
          original[key] = options[key];
          remove.push(key);
        }
      });
      _.each(remove, function (key) { delete newOptions[key] });

      // Force ID change
      if (original.id == primitive.get('id')) {
        original.id = (original.id || '') + '-clone';
      }

      // Spawn clone and animate it to new properties
      var copy = this.spawn(primitive.type(), original, { duration: 0 });
      this.animate(copy, newOptions, animate);
    }.bind(this));

    return this;
  },

  /**
   * Hurry primitives currently being animated.
   */
  hurry: function (selector, keys, limit) {
    var animator = this.animator;

    _.each(this.select(selector, true), function (primitive) {
      animator.hurry(primitive, keys, limit);
      primitive.style && animator.hurry(primitive.style, keys, limit);
    });

    return this;
  },

  /**
   * Stop animations on primitives
   */
  halt: function (selector, keys) {
    var animator = this.animator;

    _.each(this.select(selector, true), function (primitive) {
      animator.stop(primitive, keys);
      primitive.style && animator.stop(primitive.style, keys);
    });

    return this;
  },

  /**
   * Change properties of viewport
   */
  viewport: function (viewport) {
    if (viewport !== undefined) {
      // If changing viewport type, renderables need to be re-instantiated
      // to regenerate shaders.
      if (!this._viewport || (viewport.type && viewport.type != this.options.viewport.type)) {
        // Weave in existing properties
        if (this._viewport) {
          viewport = _.extend({}, this._viewport.get(), viewport);
        }

        // Make viewport
        this._viewport = MathBox.Viewport.make(viewport);

        // Reinstantiate all primitives to renegerate shaders.
        var primitives = this.primitives.slice(),
            stage = this;
        _.each(primitives, function (primitive) {
          stage._remove(primitive);
          stage._add(primitive);
        });
      }
      else {
        // Set properties directly
        this._viewport.set(viewport);
      }
      this.options.viewport = this._viewport.get();
      return this;
    }

    return this._viewport;
  },

  // Set camera properties
  camera: function (options) {
    _.each(this.select('camera'), function (camera) {
      camera.set(options);
    });

    return this;
  },

  // tQuery passthrough
  start: function () {
    this._world && this._world.start();
    return this;
  },

  stop: function () {
    this._world && this._world.stop();
    return this;
  },

  world: function () {
    return this._world;
  },

  //////////// Primitive constructors ////////////////

  /**
   * Extract style properties from flattened options and put into style subkey for convenience.
   */
  extractStyle: function (options) {
    var styles = MathBox.Style.prototype.defaults();
    var out = null;
    _.each(options, function (value, key) {
      if (styles[key] !== undefined) {
        delete options[key];
        out = out || {};
        out[key] = value;
      }
    });
    if (out) {
      options.style = _.extend(options.style || {}, out);
    }
    return options;
  },

  /**
   * Spawn primitive by type
   */
  spawn: function (selector, options, animate) {
    if (MathBox.Primitive.types[selector]) {
      this[selector](options, animate);
      return this.primitives[this.primitives.length - 1];
    }

    return this;
  },

  /**
   * Load all declared primitives and make spawning methods for them
   */
  loadPrimitives: function () {
    _.each(MathBox.Primitive.types, function (klass, type) {
      this[type] = function (options, animate) {
        if (klass.validateArgs) {
          options = klass.validateArgs(options);
        }

        var object = new klass(this.extractStyle(options));
        this.add(object, animate);

        return this;
      }
    }.bind(this));
  },
});

/**
 * Material manager. Generates custom ShaderMaterials that perform
 * all the right transforms and stylings.
 *
 * Uses ShaderGraph to glue together basic snippets, which can be
 * overridden on a section by section basis.
 */
MathBox.Materials = function (stage) {
  this.stage = stage;
  this.cache = {};
}

MathBox.Materials.prototype = {

  /**
   * Get material hash
   */
  hash: function (options) {
    // Calculate material hash
    var keys = Object.keys(options);
    var hash = '';
    keys.sort();
    _.each(keys, function (key) {
      hash += key + '/';
      hash += options[key] + '/';
    });

    return hash;
  },

  /**
   * Clone cached material
   */
  clone: function (material) {
    var clone = new THREE.ShaderMaterial({
      vertexShader: material.vertexShader,
      fragmentShader: material.fragmentShader,
    });
    clone.attributes      = material.attributes ? {} : null;
    clone.uniforms        = {};
    clone.wireframe       = material.wireframe;
    clone.applyUniforms   = material.applyUniforms;
    clone.applyAttributes = material.applyAttributes;

    _.each(material.uniforms, function (uniform, key) {
      clone.uniforms[key] = {
        type: uniform.type,
        value: (uniform.value && uniform.value.clone) ? uniform.value.clone() : uniform.value,
      };
    });
    _.each(material.attributes, function (attributes, key) {
      clone.attributes[key] = {
        type: attributes.type,
        value: attributes.value,
      };
    });

    return clone;
  },

  /**
   * Return a generic material.
   */
  generic: function (options) {
    options = options || {};

    // Check for cached instance if not using custom shader
    if (!options.shaders || !Object.keys(options.shaders).length) {
      var hash = this.hash(options);
      if (this.cache[hash]) {
        return this.clone(this.cache[hash]);
      }
    }

    // Prepare new shadergraph factory.
    var factory = this.factory();
    var shaders = options.shaders || {};

    // Read out vertex position.
    if (shaders.position) {
      shaders.position(factory, this);
    }
    else {
      this.position(factory, options);

      // Apply viewport transform
      if (!options.absolute) {
        if (options.shaded && options.smooth) {
          // Viewport transform for position + DU/DV
          factory.group();
          this.viewport(factory);
          factory.next();
          this.viewport(factory);
          factory.next();
          this.viewport(factory);
          factory.combine();
        }
        else {
          // Viewport transform for position
          this.viewport(factory);
        }
      }
    }

    // Apply finalizing shaders.
    var material = this.finalize(factory, options);

    if (hash) {
      // Cache material
      this.cache[hash] = material;
    }
    return material;
  },

  /**
   * Insert the position snippet into a shadergraph factory.
   */
  position: function (factory, options) {
    options = options || {};

    // Default position snippet
    var position = (options.shaded && options.smooth) ? 'getPositionDUDV' : 'getPosition';

    // Fetch vertex position from three.js attributes
    factory
      .snippet(position);

    // Apply math transform
    if (!options.absolute) {
      if (options.shaded && options.smooth) {
        // Transform position + DU/DV offset positions
        factory
          .group()
            .snippet('mathTransform')
          .next()
            .snippet('mathTransform')
          .next()
            .snippet('mathTransform')
          .combine();
      }
      else {
        // Transform just position
        factory.snippet('mathTransform');
      }
    }

    return factory;
  },

  /**
   * New factory
   */
  factory: function () {
    return new ShaderGraph.Factory();
  },

  /**
   * Finalize a shadergraph by adding on final transforms and a material shader.
   */
  finalize: function (factory, options) {
    // Read out shaders
    options = options || {};
    var shaders = options.shaders || {};

    // Transform point to view.
    if (options.shaded) {
      if (options.smooth) {
        factory
          .snippet('projectToViewDUDV')
      }
      else {
        factory
          .snippet('projectToViewNormal')
      }
    }
    else {
      factory
        .snippet('projectToView')
    }

    if (shaders.material) {
      // Override material shader
      shaders.material(factory, this);
    }
    else {
      // Add default fragment shader
      var fragment = {
        points: 'fragmentSolidPoint',
        mesh: options.shaded
              ? 'fragmentShaded'
              : 'fragmentSolid',
      }[options.type] || 'fragmentSolid';

      factory.material('vertexOutput', fragment);
    }

    // Finish graph and compile program
    var graph = factory.end(),
        program = graph.compile();

    // Create Three.js material
    var material = new THREE.ShaderMaterial({
      uniforms: program.uniforms,
      attributes: program.attributes,
      vertexShader: program.vertexShader,
      fragmentShader: program.fragmentShader,
    });

    // Set necessary three.js flags
    if (options.wireframe) {
      material.wireframe = true;
    }

    // Add .apply methods to update uniforms/attribs.
    var apply = this.apply.bind(this);
    material.applyUniforms = function (options) {
      apply(this, options, 'uniforms');
    };
    material.applyAttributes = function (options) {
      apply(this, options, 'attributes');
    };

    return material;
  },

  /**
   * Apply uniforms/attributes to a material
   */
  apply: function (material, options, type) {

    var fields = material[type];
    _.each(options, function (value, key) {
      var field = fields[key];
      if (field) {
        if (value instanceof THREE.Color) {
          value.x = value.r;
          value.y = value.g;
          value.z = value.b;
        }
        field.value = value;
        field.needsUpdate = true;
      }
    });

    if (type == 'uniforms') {
      if (options.map !== undefined) {
        if (material.uniforms.texture) {
          material.uniforms.texture.value = options.map;
        }
      }
      if (options.lineWidth !== undefined) {
        material.wireframeLinewidth = material.linewidth = options.lineWidth;
      }
      if (options.opacity !== undefined) {
        material.transparent = options.opacity < 1;
      }
    }

  },

  /**
   * Add viewport transform to a shadergraph factory.
   */
  viewport: function (factory, absolute) {
    this.stage.viewport().shader(factory, absolute);
  },
};
/**
 * Helper to place equally spaced ticks in a range at sensible positions.
 *
 * @param min/max - Minimum and maximum of range
 * @param n - Desired number of ticks in range
 * @param unit - Base unit of scale (e.g. 1 or π).
 * @param scale - Division scale (e.g. 2 = binary division, or 10 = decimal division).
 * @param inclusive - Whether to add ticks at the edges
 * @param bias - Integer to bias divisions one or more levels up or down (to create nested scales)
 */
MathBox.Ticks = function (min, max, n, unit, scale, inclusive, bias) {
  // Desired
  n = n || 10;
  bias = bias || 0;

  // Calculate naive tick size.
  var span = max - min;
  var ideal = span / n;

  // Round to the floor'd power of 'scale'
  unit = unit || 1;
  scale = scale || 10;
  var ref = unit * (bias + Math.pow(scale, Math.floor(Math.log(ideal / unit) / Math.log(scale))));

  // Make derived steps at sensible factors.
  var factors = ((scale % 2) == 0) ? [scale / 2, 1, .5] : [1];
  var steps = _.map(factors, function (factor) { return ref * factor; });

  // Find step size closest to ideal.
  var step = _.reduce(steps, function (ref, step) {
    return Math.abs(step - ideal) < Math.abs(ref - ideal) ? step : ref;
  }, ref);

  // Renormalize min/max onto aligned steps.
  var edge = +!inclusive;
  min = (Math.ceil(min / step) + edge) * step;
  max = (Math.floor(max / step) - edge) * step;
  n = Math.ceil((max - min) / step) + 1;

  var ticks = [];
  _.loop(n, function (x) {
    ticks.push(min + x * step);
  });

  return ticks;
};

MathBox.TicksLog = function (min, max, n, base, inclusive, bias) {
  // TODO: Tick equally in log space
  // Convert fractional part into floor(log)*(1+fraction)
};/**
 * World.mathBox() – Create a mathbox-capable renderer inside a DOM element.
 */
tQuery.World.registerInstance('mathBox', function (element, options) {
  element = element || document.body;

  // Create threebox scene for WebGL
  this.threeBox(element, options);

  // Create overlay for labels / annotations
  var overlay = new MathBox.Overlay();
  element.appendChild(overlay.domElement);
  overlay.domElement.style.position = 'absolute';
  overlay.domElement.style.left = 0;
  overlay.domElement.style.top = 0;
  overlay.domElement.style.right = 0;
  overlay.domElement.style.bottom = 0;

  // Create mathbox stage
  var mathbox = new MathBox.Stage(options, this, overlay);
  var callback = function () {
    mathbox.update();
  };
  this.tScene().add(mathbox);

  // White background
	this._renderer.setClearColorHex( 0xFFFFFF, 1 );

  // Hook into rendering loop
  mathbox.unhook = function () {
    this.loop().unhookPreRender(callback)
  }
  this.loop().hookPreRender(callback);

  if (!options.cameraControls) {
    var camera = this.tCamera();

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = options.orbit;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  return mathbox;
});

/**
 * Script-based director.
 *
 * Applies operations to mathbox one by one by stepping forward.
 * Can step backwards by automatically applying inverse operations.
 */
MathBox.Director = function (stage, script) {
  this._stage = stage;
  this.script = script;
  this.rollback = {};
  this.clocks = {};

  this.step = 0;
  this.lastCommand = 0;
};

MathBox.Director.prototype = {

  /**
   * Get clock for slide
   */
  clock: function (step, reset) {
    if (step > this.step) {
      return 0;
    }
    if (reset || !this.clocks[step]) this.clocks[step] = +new Date();
    return (+new Date() - this.clocks[step]) * .001;
  },

  /**
   * Invert the given operation (which hasn't been applied yet).
   */
  invert: function (op) {
    var stage = this._stage;

    var inverse = [],
        targets;

    var verb = op[0],
        selector = op[1],
        options = op[2],
        animate = op[3],
        primitive;

    switch (verb) {
      case 'add':
        targets = [0];
        // Fall through
      case 'clone':
        targets = targets || stage.select(selector);
        _.each(targets, function (target, i) {
          inverse.push([
            'remove',
            options.sequence || (MathBox.Primitive.sequence + 1 + i),
          ]);
        })
        break;

      case 'remove':
        targets = stage.select(selector);
        _.each(targets, function (primitive) {
          inverse.push([
            'add',
            primitive.type(),
            stage.get(primitive),
          ]);
        })
        break;

      case 'animate':
      case 'set':
        targets = stage.select(selector);
        _.each(targets, function (primitive) {
          var duration = Math.min(300, (animate && (animate.duration !== undefined)) ? animate.duration : 300);
          inverse.push([
            verb,
            primitive.singleton || primitive.get('sequence'),
            stage.get(primitive),
            { duration: duration },
          ]);
        });
        break;
    }

    return inverse;
  },

  /**
   * Apply the given script step.
   */
  apply: function (step, rollback, instant) {
    var stage = this._stage;

    _.each(step, function (op) {
      var verb = op[0] || '',
          selector = op[1] || '',
          options = op[2] || {},
          animate = op[3] || {};

      if (verb == 'remove') animate = options;

      if (rollback) {
        var inverse = this.invert(op);
        var args = [0, 0].concat(inverse);
        Array.prototype.splice.apply(rollback, args);
      }

      if (instant) {
        if (animate) {
          animate = _.extend({}, animate);
          animate.delay = 0;
          animate.duration = animate.duration / 2;
        }
      }

      switch (verb) {
        case 'clone':
          stage.clone(selector, options, animate);
          break;

        case 'add':
          var primitive = stage.spawn(selector, options, animate);
          break;

        case 'remove':
          _.each(stage.select(selector), function (primitive) {
            stage.remove(primitive, animate);
          });
          break;

        case 'set':
          var targets = stage.select(selector);
          var array = options.constructor == Array;
          _.each(targets, function (target, i) {
            stage.set(target, array ? options[i] : options);
          });
          break;

        case 'animate':
          var targets = stage.select(selector);
          var array = options.constructor == Array;
          _.each(targets, function (target, i) {
            var opts = array ? options[i] : options;
            stage.animate(target, opts, animate);
          });
          break;
      }
    }.bind(this));

    return this;
  },

  /**
   * Insert new script step after current step and execute.
   */
  insert: function (script) {
    // Allow array of ops and single op
    if (script[0].constructor != Array) {
      script = [script];
    }

    // Insert step into the script and execute immediately.
    this.script.splice(this.step, 0, script);

    this.forward();

    return this;
  },

  /**
   * Is at the given step.
   */
  is: function (step) {
    if (!this.script.length) return false;

    while (step < 0) step += this.script.length + 1;
    while (step >= this.script.length + 1) step -= this.script.length + 1;

    return step == this.step
  },

  isFirst: function () {
    return this.is(0);
  },

  isLast: function () {
    return this.is(-1);
  },

  /**
   * Go to the given step in the script.
   */
  go: function (step, instant) {
    if (!this.script.length) return;

    while (step < 0) step += this.script.length + 1;
    while (step >= this.script.length + 1) step -= this.script.length + 1;

    while (step > this.step) { this.forward(instant); }
    while (step < this.step) { this.back(instant); }
  },

  /**
   * Helper to detect rapid skipping, so existing animations can be sped up.
   */
  skipping: function () {
    var t = +new Date(), skip = false;
    if (t - this.lastCommand < 500) {
      skip = true;
    }
    this.stage().hurry('*');
    this.lastCommand = t;
    return skip;
  },

  /**
   * Go one step forward.
   */
  forward: function (instant, delay) {
    if (this.step >= this.script.length) return;

    var step = this.script[this.step];
    var rollback = this.rollback[this.step] = [];
    this.step++;

    var apply = function () {
      this.apply(step, rollback, instant || this.skipping());

      this.clock(this.step, true);

      this.emit('go', this.step, 1);
    }.bind(this);

    if (delay) {
      setTimeout(apply, +delay);
    }
    else {
      apply();
    }

    return this;
  },

  /**
   * Go one step backward.
   */
  back: function (instant, delay) {
    if (this.step <= 0) return;

    this.step--;
    var step = this.script[this.step];
    var rollback = this.rollback[this.step];

    var apply = function () {
      this.apply(rollback, null, instant || this.skipping());
      delete this.rollback[this.step];

      this.emit('go', this.step, -1);
    }.bind(this);

    if (delay) {
      setTimeout(apply, +delay);
    }
    else {
      apply();
    }

    return this;
  },

  stage: function () {
    return this._stage;
  },

};

// Proxy methods to stage, retain own chainability.
_.each(MathBox.Stage.prototype, function (f, key) {
  if (!MathBox.Director.prototype[key]) {
    MathBox.Director.prototype[key] = function () {
      var ret = this.stage[f].apply(this.stage, arguments);
      if (ret === this.stage) return this;
      return ret;
    };
  }
});

MicroEvent.mixin(MathBox.Director);

/**
 * Object containing style attributes and their validators.
 */
MathBox.Style = function (options) {
  // Apply defaults
  var defaults = this.defaults();
  options = _.extend(defaults, options || {});
  this.set(options);
};

MathBox.Style.prototype = {

  defaults: function () {
    return {
      color: new THREE.Color(0x3080F0),
      opacity: 1,
      lineWidth: 2,
      pointSize: 5,

      mathScale: new THREE.Vector3(1, 1, 1),
      mathRotation: new THREE.Vector3(),
      mathPosition: new THREE.Vector3(),

      worldScale: new THREE.Vector3(1, 1, 1),
      worldRotation: new THREE.Vector3(),
      worldPosition: new THREE.Vector3(),
      zIndex: 0.0,

      map: null,
      mapColor: 0,
      mapOpacity: 0,
    };
  },

  validateColor: function (c) {
    if (c.constructor == Array) {
      c = c.concat([0, 0, 0]);
      var color = new THREE.Color();
      return color.setRGB.apply(color, c);
    }
    if (c.constructor == Number) {
      return new THREE.Color(c);
    }
    if (c.constructor != THREE.Color) {
      return this.get('color');
    }
    return c;
  },

  validateMathScale: function (v) {
    if (v.constructor == Array) {
      v = v.concat([1, 1, 1]);
      var vector = new THREE.Vector3();
      return vector.set.apply(vector, v);
    }
    if (v.constructor != THREE.Vector3) {
      return this.get('mathScale');
    }
    return v;
  },

  validateMathRotation: function (v) {
    if (v.constructor == Array) {
      v = v.concat([0, 0, 0]);
      var vector = new THREE.Vector3();
      return vector.set.apply(vector, v);
    }
    if (v.constructor != THREE.Vector3) {
      return this.get('mathRotation');
    }
    return v;
  },

  validateMathPosition: function (v) {
    if (v.constructor == Array) {
      v = v.concat([0, 0, 0]);
      var vector = new THREE.Vector3();
      return vector.set.apply(vector, v);
    }
    if (v.constructor != THREE.Vector3) {
      return this.get('mathPosition');
    }
    return v;
  },

  validateWorldScale: function (v) {
    if (v.constructor == Array) {
      v = v.concat([1, 1, 1]);
      var vector = new THREE.Vector3();
      return vector.set.apply(vector, v);
    }
    if (v.constructor != THREE.Vector3) {
      return this.get('worldScale');
    }
    return v;
  },

  validateWorldRotation: function (v) {
    if (v.constructor == Array) {
      v = v.concat([0, 0, 0]);
      var vector = new THREE.Vector3();
      return vector.set.apply(vector, v);
    }
    if (v.constructor != THREE.Vector3) {
      return this.get('worldRotation');
    }
    return v;
  },

  validateWorldPosition: function (v) {
    if (v.constructor == Array) {
      v = v.concat([0, 0, 0]);
      var vector = new THREE.Vector3();
      return vector.set.apply(vector, v);
    }
    if (v.constructor != THREE.Vector3) {
      return this.get('worldPosition');
    }
    return v;
  },

};

MathBox.Attributes.mixin(MathBox.Style);
/**
 * Wrapper around ThreeBox camera to allow attribute animations.
 */
MathBox.CameraProxy = function (world, options) {

  this.set({
    orbit: options.orbit || 3.5,
    phi: options.phi || τ/4,
    theta: options.theta || 0,
    lookAt: options.lookAt || [0, 0, 0],
  });

  this.singleton = 'camera';

  var controls = this.controls = world.getCameraControls()
                     || ThreeBox.OrbitControls.bind(world.tCamera(), null, this.get());

  this.on('change', function (changed) {
    _.each(changed, function (value, key) {
      if (key == 'lookAt') return;
      controls[key] = value;
    });

    if (changed.lookAt) {
      controls.lookAt.set.apply(controls.lookAt, changed.lookAt);
    }
    controls.update();
  });
  controls.update();
}

MathBox.Attributes.mixin(MathBox.CameraProxy);/**
 * MathBox Overlay
 *
 * Positions 2D labels on top of the scene and takes care of overlap.
 */
MathBox.Overlay = function () {
  var element = this.domElement = document.createElement('div');

  element.className = 'mathbox-overlay';

  this.sprites = [];
  this.v = new THREE.Vector3();
  this.q = new THREE.Vector3();
}

MathBox.Overlay.prototype = {

  size: function (width, height) {
    this.width = width;
    this.height = height;

    this.domElement.style.width = width +'px';
    this.domElement.style.height = height +'px';
  },

  add: function (object) {
    if (this.sprites.indexOf(object) != -1) return;
    this.sprites.push(object);

    if (!object.element.parentNode) {
      this.domElement.appendChild(object.element);
    }

    _.each(object.children, function (child) {
      this.add(child);
    }.bind(this))
  },

  remove: function (object) {
    var index;
    if ((index = this.sprites.indexOf(object)) == -1) return;
    this.sprites.splice(index, 1);

    if (object.element.parentNode) {
      object.element.parentNode.removeChild(object.element);
    }

    _.each(object.children, function (child) {
      this.remove(child);
    }.bind(this))
  },

  update: function (camera) {
		this.fov = 0.5 / Math.tan( camera.fov * Math.PI / 360 ) * this.height;

    // Iterate over individual objects for update
    _.each(this.sprites, function (sprite) {
      this._update(sprite, camera);
    }.bind(this));

    // Iterate over individual objects for measurement
    _.each(this.sprites, function (sprite) {
      this._measure(sprite, camera);
    }.bind(this));

    // Iterate over individual objects for measurement
    _.each(this.sprites, function (sprite) {
      this._vis(sprite, camera);
    }.bind(this));
  },

  _measure: function (object, camera) {
    // Measure sprites
    if (object.measure) {
      var element = object.element;
      object.width = element.offsetWidth;
      object.height = element.offsetHeight;
      object.measure = false;
    }
  },

  _vis: function (object, camera) {
    // If already hidden, ignore
    if (!object.render) return;
    if (!object.width && !object.height) return;

    // Check visibility for each sprite relative to other visibles
    var ox1 = object.left,
        oy1 = object.top,
        ox2 = object.width + ox1,
        oy2 = object.height + oy1;

    // Iterate only sprites after this one
    found = false;
    _.each(this.sprites, function (sprite) {
      if (sprite === object) {
        found = true;
        return;
      }
      if (!found) return;
      if (!sprite.render) return;

      var sx1 = sprite.left,
          sy1 = sprite.top,
          sx2 = sprite.width + sx1,
          sy2 = sprite.height + sy1;

      // Check for overlap in X or Y
      if (ox2 < sx1 || ox1 > sx2) return;
      if (oy2 < sy1 || oy1 > sy2) return;

      // Hide
      sprite.element.style.display = 'none';
      sprite.render = false;
    });
  },

  _update: function (object, camera) {
    var v = this.v,
        q = this.q,
        epsilon = 0.01;

    var render = object.render;

    // Check visibility
    var visible = object.visible, parent = object.parent;
    while (visible && parent) {
      visible = visible && parent.visible;
      parent = parent.parent;
    }
    object.render = visible && (object.opacity > 0);

    if (!object.render) {
      if (render || render === null) {
        object.element.style.display = 'none';
      }
      return;
    }
    else if (!render) {
      object.element.style.display = 'block';
    }

    // Transform into camera space
    v.copy(object.position);
    camera.matrixWorldInverse.multiplyVector3(v);

    // Project to 2D and convert to pixels
    var x = -(v.x / v.z) * this.fov + this.width  * .5;
    var y =  (v.y / v.z) * this.fov + this.height * .5;

    // Add spacer
    if (object.distance) {
      // Add tangent and project again
      q.copy(object.tangent).multiplyScalar(epsilon);
      q.addSelf(object.position);
      camera.matrixWorldInverse.multiplyVector3(q);

      // Find difference and scale it
      var sign = object.distance > 0 ? 1 : -1;
      q.subSelf(v);
      q.z = 0;
      q.normalize().multiplyScalar(object.distance);
      x += Math.abs(q.y) * sign;
      y += Math.abs(q.x) * sign;
    }

    // Round to avoid pixel fuzzyness
    x = Math.round(x);
    y = Math.round(y);

    // Set position
    if (object.left !== x) {
      object.left = x;
      object.element.style.left = x + 'px';
    }
    if (object.top !== y) {
      object.top = y;
      object.element.style.top  = y + 'px';
    }

    // Set opacity
    if (object.lastOpacity !== object.opacity) {
      object.element.style.opacity = object.opacity;
      object.lastOpacity = object.opacity;
    }

  },

};

MathBox.Sprite = function (element, tangent, distance) {
  this.element = element;
  this.tangent = tangent || new THREE.Vector3(1, 0, 0);
  this.distance = distance || 0;
  this.width = 0;
  this.height = 0;
  this.visible = true;
  this.measure = true;
  this.render = null;
  this.content = '';

  this.lastLeft = null;
  this.lastTop = null;
  this.lastOpacity = null;

  element.style.position = 'absolute';
  element.style.left = 0;
  element.style.top = 0;
  element.style.opacity = 0;

  THREE.Object3D.call(this);
}

MathBox.Sprite.prototype = _.extend(new THREE.Object3D(), {
  
});MathBox.Primitive = function (options) {
  // Allow inheritance constructor
  if (options === null) return;

  // Apply defaults and unpack styles
  var defaults = this.defaults();
  if (options) {
    options.style = _.extend(defaults.style, options.style || {});
    options = _.extend(defaults, options || {});
  }
  options = options || defaults;
  this.set(options);

  // Holds persistent object styles
  this.style = new MathBox.Style();
  this.style.set(this.get().style || {});

  // Pass through style changes
  this.on('change', function (changed) {
    if (changed.style !== undefined) {
      this.style.set(changed.style);
    }
  }.bind(this));

  // Unique primitive sequence number.
  this.set('sequence', options.sequence || ++MathBox.Primitive.sequence);

  // Auto-assign ID.
  this.set('id', options.id || this.sequence);

  // Call init method for subclass' benefit.
  this.init();
};

MathBox.Primitive.sequence = 0;

MathBox.Primitive.types = {};

MathBox.Primitive.prototype = {
  defaults: function () {
    return {};
  },

  type: function () {
    return 'primitive';
  },

  init: function () {
  },

  make: function () {
  },

  destroy: function () {
  },

  renderables: function () {
    return [];
  },

  adjust: function (viewport) {
  }//,

};

MathBox.Attributes.mixin(MathBox.Primitive);
MicroEvent.mixin(MathBox.Primitive);
/**
 * Generic curve, parametric or functional.
 */
MathBox.Curve = function (options) {
  // Allow inheritance constructor
  if (options === null) return;

  MathBox.Primitive.call(this, options);
};

MathBox.Curve.prototype = _.extend(new MathBox.Primitive(null), {

  defaults: function () {
    return {
      n: 64,
      domain: [0, 1],
      data: null,
      expression: function () { return 0; },
      live: true,
      points: false,
      line: true,
      style: {}//,
    };
  },

  type: function () {
    return 'curve';
  },

  renderables: function () {
    return [ this.line, this.points ];
  },

  adjust: function (viewport) {
    var options = this.get();
    this.line.show(options.line);
    this.points.show(options.points);

    var visible = (options.line || options.points) && this.style.get('opacity') > 0;
    visible && options.live && this.calculate();
  },

  make: function () {
    var that = this,
        options = this.get(),
        style = this.style,
        n = options.n;

    var vertices = this.vertices = [];

    // Allocate vertices.
    _.loop(n, function () {
      vertices.push(new THREE.Vector3());
    });

    // Instantiate renderables.
    var make = function (type) {
      return new MathBox.Renderable.Mesh(vertices, {
        type: type,
        dynamic: options.live,
      }, style);
    };

    this.line = make('line');
    this.points = make('points');

    this.calculate();
  },

  //////////

  calculate: function () {
    var vertices = this.vertices,
        options = this.get(),
        data = options.data,
        domain = options.domain,
        style = options.style,
        n = options.n;

    var x = domain[0],
        step = (domain[1] - x) / (n - 1);

    var p;
    _.loop(n, function (i) {
      if (data && (data[i] !== undefined)) {
        // Use data if available
        p = data[i];
      }
      else {
        // Use expression.
        p = options.expression.call(this, x, i);
      }

      // Allow both parametric (array) and functional (value) style.
      if (!(p instanceof Array)) p = [x, p, 0];
      p = p.concat([0, 0, 0]);

      // Update point
      vertices[i].set.apply(vertices[i], p);

      x += step;
    }.bind(this));

  }//,

});

MathBox.Primitive.types.curve = MathBox.Curve;
/**
 * Bezier curve of order 1-3.
 */
MathBox.Bezier = function (options) {
  MathBox.Curve.call(this, options);
};

MathBox.Bezier.prototype = _.extend(new MathBox.Curve(null), {

  defaults: function () {
    return {
      n: 64,
      domain: [0, 1],
      data: null,
      order: 3,
      expression: function () { return 0; },
      live: true,
      points: false,
      line: true,
      style: {}//,
    };
  },

  type: function () {
    return 'bezier';
  },

  //////////

  calculate: function () {
    var vertices = this.vertices,
        options = this.get(),
        domain = options.domain,
        data = options.data,
        style = options.style,
        order = options.order,
        n = options.n;

    // Verify order
    if (order < 1 || order > 3) throw "Bezier curve order must be 1, 2 or 3.";

    // Collect control points into uniform vec3 array.
    var points = [], p;
    _.loop(order + 1, function (i) {
      if (data && (data[i] !== undefined)) {
        // Use data if available
        p = data[i];
      }
      else {
        // Use expression.
        p = options.expression.call(this, i, i);
      }

      // Allow both parametric (array) and functional (value) style.
      if (!(p instanceof Array)) p = [x, p, 0];
      p = p.concat([0, 0, 0]);

      points.push(new THREE.Vector3(p[0], p[1], p[2]));
    }.bind(this));

    var uniforms = {
      bezierPoints: points,
    };

    // Write out vertices in interpolation domain.
    var x = domain[0],
        step = (domain[1] - x) / (n - 1);
    _.loop(n, function (i) {
      vertices[i].set(x, 0, 0);
      x += step;
    });

    // Apply custom position shader to renderables
    var opts = {
      uniforms: uniforms,
      shaders: {
        position: function (f, m) {
          f
            .snippet('bezier' + order)
            .snippet('mathTransform');
          m.viewport(f);
        },
      },
    };
    this.line.set(opts);
    this.points.set(opts);
  }//,

});

MathBox.Primitive.types.bezier = MathBox.Bezier;
/**
 * Axis with arrowhead and tick markers.
 */
MathBox.Axis = function (options) {
  // Allow inheritance constructor
  if (options === null) return;

  MathBox.Primitive.call(this, options);
};

MathBox.Axis.prototype = _.extend(new MathBox.Primitive(null), {

  defaults: function () {
    return {
      axis: 0,
      offset: [0, 0, 0],
      n: 2,
      arrow: true,
      line: true,
      labels: false,

      decimals: 2,
      distance: 15,
      ticks: 10,
      tickUnit: 1,
      tickScale: 10,
      size: .07,
      style: {
        lineWidth: 4,
        color: new THREE.Color(0x707070),
      },
      formatter: null,
      zero: true,
    };
  },

  renderables: function () {
    return [ this.line, this.ticks, this.arrow, this.labels ];
  },

  type: function () {
    return 'axis';
  },

  adjust: function (viewport, camera) {
    var options = this.get(),
        axis = options.axis,
        offset = options.offset,

        arrow = options.arrow,
        line = options.line,
        labels = options.labels,

        n = options.n,
        size = options.size,

        ticks = options.ticks,
        tickUnit = options.tickUnit,
        tickScale = options.tickScale,
        decimals = options.decimals,

        points = this.points,
        labelPoints = this.labelPoints,
        labelTangent = this.labelTangent,
        tickPoints = this.tickPoints,
        tickSigns = this.tickSigns;

    var p = [0, 0, 0],
        add = new THREE.Vector3(),
        four = new THREE.Vector4();

    // Prepare axis extents.
    var range = viewport.axis(axis),
        min = range[0],
        max = range[1],
        inv = (max - min) / (n - 1);

    // Prepare axis offset.
    add.set.apply(add, offset);

    // Place uniformly spaced points for axis.
    _.loop(n, function (x) {
      p[axis] = min + x * inv;

      points[x].set.apply(points[x], p);
      points[x].addSelf(add);
    });

    // Show/hide line
    this.line.show(line);

    // Show/hide arrow
    this.arrow.show(arrow);

    // Prepare scale divisions
    var scale = this.scale = MathBox.Ticks(min, max, ticks, tickUnit, tickScale, true);

    // Prepare tick marks range/scale.
    this.ticks.show(!!ticks);
    if (ticks) {
      var limit = Math.floor(tickPoints.length / 2);
      if (scale.length > limit) scale = scale.slice(0, limit);

      // Calculate epsilon vector for finding normal
      var e = [0, 0, 0], last;
      e[axis == 2 ? 0 : (1 - axis)] = (max - min) * .01;
      this.epsilon.set.apply(this.epsilon, e);

      // Place uniformly spaced pairs of points for ticks.
      var p = [0, 0, 0], mn = 100, mx = -100;
      _.each(scale, function (x, i) {
        p[axis] = x;

        // Tick points for ticks (2 each)
        var j = i*2;
        tickPoints[j].set.apply(tickPoints[j], p);
        tickPoints[j].addSelf(add);
        tickSigns[j] = 1;

        tickPoints[j+1].copy(tickPoints[j]);
        tickSigns[j+1] = -1;

        // Anchor points for label
        labelPoints[i].copy(tickPoints[j]);

        last = j + 1;
      });

      // Fill remaining vertices with last point
      var i = last + 1, n = tickPoints.length;
      while (i < n) {
        tickPoints[i].copy(tickPoints[last]);
        tickSigns[i] = tickSigns[last];
        i++;
      }
    }

    // Axis vector direction for labels
    p = [0, 0, 0];
    p[axis] = 1;
    labelTangent.set.apply(labelTangent, p);
    this.labels.show(!!labels);

    // Label formatting
    this.labels.set('decimals', decimals);
  },

  make: function () {
    var options = this.get(),
        axis = options.axis,
        n = options.n,
        size = options.size,
        ticks = options.ticks,
        distance = options.distance,
        formatter = options.formatter,
        style = this.style,
        points = this.points = [], // Points for drawing lines
        labelPoints = this.labelPoints = [], // Points for attaching labels
        labelTangent = this.labelTangent = new THREE.Vector3(), // Orientation for points and labels
        tickPoints = this.tickPoints = [], // Points for drawing ticks (doubled)
        tickSigns = this.tickSigns = [], // Alternating signs for tick shader
        epsilon = this.epsilon = new THREE.Vector3();

    // Prepare arrays of vertices.
    _.loop(n, function (x) {
      points.push(new THREE.Vector3());
    });
    _.loop(ticks * 4, function (i) {
      labelPoints.push(new THREE.Vector3());
    });
    _.loop(ticks * 8, function (i) {
      tickPoints.push(new THREE.Vector3());
      tickSigns.push(1);
    });

    // Prepare primitives
    var meshOptions = { dynamic: true, type: 'line' };
    var arrowOptions = { dynamic: true, size: size, offset: .5 };
    var tickOptions = { dynamic: true, size: size * .2 };
    var labelOptions = { dynamic: true, distance: distance };

    // Scale label callback
    var callback = function (i) {
      var x = this.scale[i];
      if (x == 0 && !options.zero) return '';
      return formatter ? formatter(x) : x;
    }.bind(this);

    // Line, arrowhead, tick marks and labels.
    this.line = new MathBox.Renderable.Mesh(points, meshOptions, style);
    this.arrow = new MathBox.Renderable.ArrowHead(points[n - 2], points[n - 1], arrowOptions, style);
    this.ticks = new MathBox.Renderable.Ticks(tickPoints, tickSigns, epsilon, tickOptions, style);
    this.labels = new MathBox.Renderable.Labels(labelPoints, labelTangent, callback, labelOptions, style);
  },

});

MathBox.Axis.validateArgs = function (options) {
  // Alternate syntax: (axis)
  if (typeof options == 'number') {
    options = { axis: options };
  }
  return options;
};

MathBox.Primitive.types.axis = MathBox.Axis;
/**
 * 2D grid of lines, based on tickmarks.
 */
MathBox.Grid = function (options) {
  // Allow inheritance constructor
  if (options === null) return;

  MathBox.Primitive.call(this, options);
};

MathBox.Grid.prototype = _.extend(new MathBox.Primitive(null), {

  defaults: function () {
    return {
      axis: [ 0, 1 ],
      offset: [0, 0, 0],
      show: [ true, true ],
      n: 2,
      ticks: [ 10, 10 ],
      tickUnit: [ 1, 1 ],
      tickScale: [ 10, 10 ],
      style: {
        lineWidth: 1,
        color: new THREE.Color(0xA0A0A0)//,
      }//,
    };
  },

  type: function () {
    return 'grid';
  },

  renderables: function () {
    return this.lines || [];
  },

  adjust: function (viewport) {

    var options = this.get(),
        axis = options.axis,
        ticks = options.ticks,
        tickUnit = options.tickUnit,
        tickScale = options.tickScale,
        n = options.n,
        show = options.show,
        offset = options.offset,
        points = this.points,
        count = this.count,
        limit = this.limit;

    var ranges = [];

    // Symmetrical grid division
    if (typeof n == 'number') {
      n = [n, n];
    }

    // Prepare axis extents.
    _.each(axis, function (axis, i) {
      var range = viewport.axis(axis);
      ranges.push({
        axis: axis,
        min: range[0],
        max: range[1],
        inv: (range[1] - range[0]) / (n[i] - 1),
        ticks: ticks[i],
        tickUnit: tickUnit[i],
        tickScale: tickScale[i],
      });
    });

    // Place uniformly spaced points for each direction.
    function generate(points, a, b, limit, n) {
      var p = offset.slice(), i = 0;

      // Get ticks in main direction
      var scale = MathBox.Ticks(a.min, a.max, a.ticks, a.tickUnit, a.tickScale, true);

      // Cap scale to available lines
      if (scale.length > limit) scale = scale.slice(0, limit);

      // Create line along each tick.
      _.each(scale, function (tick) {
        p[a.axis] = tick + offset[a.axis];
        p[b.axis] = b.min + offset[b.axis];

        // N equally spaced line segments
        _.loop(n - 1, function (x) {
          points[i].set.apply(points[i], p);
          i++;

          p[b.axis] += b.inv;
          points[i].set.apply(points[i], p);
          i++;
        });
      });

      var last = Math.max(0, i - 1),
          count = points.length;
      while (i < count) {
        points[i++].copy(points[last]);
      }
    };

    this.lines[0].show(show[0]);
    this.lines[1].show(show[1]);

    show[0] && generate(points[0], ranges[1], ranges[0], limit[0], n[0]);
    show[1] && generate(points[1], ranges[0], ranges[1], limit[1], n[1]);
  },

  make: function (materials) {
    var options = this.get(),
        axis = options.axis,
        ticks = options.ticks,
        n = options.n,
        points = this.points = [[], []],
        style = this.style;

    // Symmetrical grid division
    if (typeof n == 'number') {
      n = [n, n];
    }

    // Count number of vertices necessary
    var limit = this.limit = [0, 0];

    // Prepare arrays of vertices.
    _.each(ticks, function (tick, i) {
      i = 1 - i;
      limit[i] = tick * 4;
      _.loop(limit[i] * (n[i] - 1) * 2, function (x) {
        points[i].push(new THREE.Vector3());
      });
    });

    // Line, arrowhead and tick marks.
    this.lines = [];
    this.lines.push(new MathBox.Renderable.Mesh(points[0], { type: 'line', strip: false, dynamic: true }, style));
    this.lines.push(new MathBox.Renderable.Mesh(points[1], { type: 'line', strip: false, dynamic: true }, style));
  }//,

});

MathBox.Primitive.types.grid = MathBox.Grid;
/**
 * One or more vectors with given start and end points.
 */
MathBox.Vector = function (options) {
  // Allow inheritance constructor
  if (options === null) return;

  MathBox.Primitive.call(this, options);

  this.render = [];
  this.arrows = [];
  this.vertices = null;
  this.points = null;
  this.line = null;

  this.on('change', function (changed) {
    if (changed.size !== undefined) {
      _.each(this.arrows, function (arrow) {
        arrow.set('size', changed.size);
      });
    }
  });
};

MathBox.Vector.prototype = _.extend(new MathBox.Primitive(null), {

  defaults: function () {
    return {
      n: 1,
      data: null,
      arrow: true,
      expression: function () { return 0; },
      live: true,
      style: {},
      size: .07//,
    };
  },

  type: function () {
    return 'vector';
  },

  renderables: function () {
    return this.render;
  },

  adjust: function (viewport) {
    var options = this.get();

    // Vector foreshortening requires live to be always-on
    (options.arrow || options.live) && this.calculate(viewport);
    _.each(this.arrows, function (arrow) {
      arrow.show(options.arrow);
    });
  },

  make: function () {
    var that = this,
        options = this.get(),
        arrow = options.arrow,
        style = this.style,
        n = options.n;

    var vertices = this.vertices = [];
    var points = this.points = [];
    var render = this.render = [];
    var arrows = this.arrows = [];

    var lineOptions = { dynamic: options.live, type: 'line', strip: false };
    var arrowOptions = { size: options.size };

    // Allocate vertices for line segments.
    // Allocate arrowheads if arrows requested.
    var i = 0;
    _.loop(n, function () {
      vertices.push(new THREE.Vector3());
      vertices.push(new THREE.Vector3());
      points.push(new THREE.Vector3());
      points.push(new THREE.Vector3());

      if (arrow) { // arrows are expensive for now, only allocate if requested on creation
        var arrowhead = new MathBox.Renderable.ArrowHead(points[i++], points[i++], arrowOptions, style);
        render.push(arrowhead);
        arrows.push(arrowhead);
      }
    });

    this.line = new MathBox.Renderable.Mesh(vertices, lineOptions, style);
    render.push(this.line);

    this.calculate();
  },

  //////////

  calculate: function (viewport) {
    var vertices = this.vertices,
        arrows = this.arrows,
        points = this.points,
        options = this.get(),
        data = options.data,
        arrow = options.arrow,
        n = options.n,
        size = options.size,
        scale = this.style.get('mathScale');

    // Find necessary foreshortening factors so line does not stick out through the arrowhead.
    var last = new THREE.Vector3(),
        current = new THREE.Vector3();

    var j = 0, k = 0;
    _.loop(n * 2, function (i) {
      if (data && (data[i] !== undefined)) {
        // Use data if available
        p = data[i];
      }
      else {
        // Use expression.
        p = options.expression.call(this, k, j);
      }

      // Allow both parametric (array) and functional (value) style.
      if (!(p instanceof Array)) p = [i, p, 0];
      p = p.concat([0, 0, 0]);

      // Update point
      points[i].set.apply(points[i], p);

      // Shorten line segment to make room for arrow
      vertices[i].set.apply(vertices[i], p);
      if (viewport && arrow && (i % 2 == 1)) {
        // Find vector's world-space length
        current.copy(vertices[i]);
        last.copy(vertices[i-1]);
        viewport.to(current);
        viewport.to(last);
        current.subSelf(last).multiplySelf(scale);

        var l = current.length();

        var clipped = Math.min(1, l * .5 / size);
        clipped = (1 - (1 - clipped) * (1 - clipped)) * size;

        // Foreshorten line
        var f = l - clipped;
        current.normalize().multiplyScalar(f).divideSelf(scale).addSelf(last);

        // Transform back
        viewport.from(current);
        vertices[i].copy(current);

        // Set arrowhead size
        arrows[k].set({ size: clipped });
      }

      // Start/end + vector indices
      k = j ? k + 1 : k;
      j = (j+1)%2;

    }.bind(this));

  }//,

});

MathBox.Primitive.types.vector = MathBox.Vector;
/**
 * Generic surface, parametric or functional.
 */
MathBox.Surface = function (options) {
  // Allow inheritance constructor
  if (options === null) return;

  MathBox.Primitive.call(this, options);
};

MathBox.Surface.prototype = _.extend(new MathBox.Primitive(null), {

  defaults: function () {
    return {
      n: [ 64, 64 ],
      domain: [[0, 1], [0, 1]],
      data: null,
      expression: function () { return 0; },
      live: true,
      points: false,
      line: false,
      mesh: true,
      doubleSided: true,
      flipSided: false,
      shaded: true,
      style: {}//,
    };
  },

  type: function () {
    return 'surface';
  },

  renderables: function () {
    return [ this.mesh, this.line, this.points ];
  },

  adjust: function (viewport) {
    var options = this.get();

    this.mesh.show(options.mesh);
    this.line.show(options.line);
    this.points.show(options.points);

    var visible = (options.mesh || options.line || options.points) && this.style.get('opacity') > 0;
    visible && options.live && this.calculate();
  },

  make: function () {
    var that = this,
        options = this.get(),
        style = this.style,
        n = options.n;

    if (typeof n == 'number') {
      n = [n, n];
    }

    // Use PlaneGeometry to allocate vertices/uvs.
    var geometry = this.geometry = new THREE.PlaneGeometry(2, 2, n[0] - 1, n[1] - 1);
    this.vertices = geometry.vertices;

    // Instantiate renderable.
    this.mesh = new MathBox.Renderable.Mesh(geometry, {
      type: 'mesh',
      doubleSided: options.doubleSided,
      flipSided: options.flipSided,
      shaded: options.shaded,
      smooth: true,
      dynamic: options.live,
    }, style);
    this.line = new MathBox.Renderable.Mesh(geometry, {
      type: 'mesh',
      shaded: options.shaded,
      smooth: true,
      dynamic: options.live,
      wireframe: true
    }, style);
    this.points = new MathBox.Renderable.Mesh(geometry.vertices, {
      type: 'points',
      dynamic: options.live,
    }, style);

    // Prepare tangent arrays for shading
    if (options.shaded) {
      var tangents = this.tangents = [[], []];
      _.loop(n[0] * n[1], function () {
        tangents[0].push(new THREE.Vector3());
        tangents[1].push(new THREE.Vector3());
      });
    }

    this.calculate();
  },

  //////////

  calculate: function () {
    var vertices = this.vertices,
        tangents = this.tangents,
        options = this.get(),
        data = options.data,
        domain = options.domain,
        style = options.style,
        n = options.n,
        shaded = options.shaded,
        flipSided = options.flipSided;

    var iu = flipSided ? 1 : 0,
        iv = flipSided ? 0 : 1;

    if (typeof n == 'number') {
      n = [n, n];
    }

    var x = domain[0][0],
        y = domain[1][0],
        stepX = (domain[0][1] - x) / (n[0] - 1),
        stepY = (domain[1][1] - y) / (n[1] - 1);

    // Calculate positions of vertices
    var p, o = 0;
    _.loop(n[1], function (j) {
      x = domain[0][0];
      _.loop(n[0], function (i) {
        if (data && (data[j] !== undefined) && (data[j][i] !== undefined)) {
          // Use data if available
          p = data[j][i];
        }
        else {
          // Use expression.
          p = options.expression.call(this, x, y, i, j, o);
        }

        // Allow both parametric (array) and functional (value) style.
        if (!(p instanceof Array)) p = [x, p, y];
        p = p.concat([0, 0, 0]);

        // Update point
        vertices[o].set.apply(vertices[o], p);

        x += stepX;
        o++;
      }.bind(this));
      y += stepY;
    }.bind(this));

    // Calculate tangents for shading correctly after warping transforms
    if (options.shaded) {
      o = 0;
      y = domain[1][0];

      var stride = n[0],
          epsilon = 0.01;

      _.loop(n[1], function (j) {
        x = domain[0][0];

        var up = j ? j - 1 : 0,
            down = Math.min(n[1] - 1, j + 1);

        _.loop(n[0], function (i) {

          var left = i ? i - 1 : 0,
              right = Math.min(n[0] - 1, i + 1);

          // Central differences
          var v = vertices[i + j * stride];

          /* high quality */
          /*
          tangents[0][o].sub(vertices[right + j * stride], vertices[left + j * stride]).multiplyScalar(epsilon).addSelf(v);
          tangents[1][o].sub(vertices[i + down * stride], vertices[i + up * stride]).multiplyScalar(epsilon).addSelf(v);
          */

          /* low quality */
          if (right == i) {
            tangents[0][o].sub(v, vertices[left + j * stride]).addSelf(v);
          }
          else {
            tangents[0][o].copy(vertices[right + j * stride]);
          }

          if (down == j) {
            tangents[1][o].sub(v, vertices[i + up * stride]).addSelf(v);
          }
          else {
            tangents[1][o].copy(vertices[i + down * stride]);
          }

          x += stepX;
          o++;
        });
        y += stepY;
      });

      this.line.set('attributes', {
        positionDU: tangents[iu],
        positionDV: tangents[iv],
      });
      this.mesh.set('attributes', {
        positionDU: tangents[iu],
        positionDV: tangents[iv],
      });
    }

  }//,

});

MathBox.Primitive.types.surface = MathBox.Surface;
/**
 * Bezier surface of order 3.
 */
MathBox.BezierSurface = function (options) {
  this.matrixX = new THREE.Matrix4();
  this.matrixY = new THREE.Matrix4();
  this.matrixZ = new THREE.Matrix4();

  this.coefficients = new THREE.Matrix4(
    -1,  3, -3,  1,
     3, -6,  3,  0,
    -3,  3,  0,  0,
     1,  0,  0,  0//,
  );
  MathBox.Surface.call(this, options);
};

MathBox.BezierSurface.prototype = _.extend(new MathBox.Surface(null), {

  defaults: function () {
    return {
      n: [ 64, 64 ],
      domain: [[0, 1], [0, 1]],
      data: null,
      order: 3,
      expression: function () { return 0; },
      live: true,
      points: false,
      line: false,
      mesh: true,
      doubleSided: true,
      flipSided: false,
      shaded: true,
      style: {}//,
    };
  },

  type: function () {
    return 'bezierSurface';
  },

  //////////

  calculate: function () {
    var vertices = this.vertices,
        options = this.get(),
        domain = options.domain,
        data = options.data,
        style = options.style,
        order = options.order,
        shaded = options.shaded,
        n = options.n;

    if (typeof n == 'number') {
      n = [n, n];
    }

    // Verify order
    if (order != 3) throw "Bezier surface order must be 3.";

    // Collect control points into uniform vec3 array.
    var points = [], p;
    _.loop(order + 1, function (j) {
      _.loop(order + 1, function (i) {
        if (data && (data[j] !== undefined) && (data[j][i] !== undefined)) {
          // Use data if available
          p = data[j][i];
        }
        else {
          // Use expression.
          p = options.expression.call(this, i, j, i, j);
        }

        // Allow both parametric (array) and functional (value) style.
        if (!(p instanceof Array)) p = [i, p, j];
        p = p.concat([0, 0, 0]);

        points.push(p);
      }.bind(this));
    }.bind(this));

    // Collect control coordinates into X/Y/Z matrices.
    p = points;
    this.matrixX.set(
      p[0][0],  p[1][0],  p[2][0],  p[3][0],
      p[4][0],  p[5][0],  p[6][0],  p[7][0],
      p[8][0],  p[9][0],  p[10][0], p[11][0],
      p[12][0], p[13][0], p[14][0], p[15][0]//,
    );
    this.matrixY.set(
      p[0][1],  p[1][1],  p[2][1],  p[3][1],
      p[4][1],  p[5][1],  p[6][1],  p[7][1],
      p[8][1],  p[9][1],  p[10][1], p[11][1],
      p[12][1], p[13][1], p[14][1], p[15][1]//,
    );
    this.matrixZ.set(
      p[0][2],  p[1][2],  p[2][2],  p[3][2],
      p[4][2],  p[5][2],  p[6][2],  p[7][2],
      p[8][2],  p[9][2],  p[10][2], p[11][2],
      p[12][2], p[13][2], p[14][2], p[15][2]//,
    );

    // Apply bezier control weights for cubic polynomial
    var m0 = this.coefficients;
    this.matrixX.multiplySelf(m0).transpose().multiplySelf(m0);
    this.matrixY.multiplySelf(m0).transpose().multiplySelf(m0);
    this.matrixZ.multiplySelf(m0).transpose().multiplySelf(m0);

    var uniforms = {
      bezierSurfaceX: this.matrixX,
      bezierSurfaceY: this.matrixY,
      bezierSurfaceZ: this.matrixZ,
    };

    // Write out vertices in interpolation domain.
    var x = domain[0][0],
        y = domain[1][0],
        stepX = (domain[0][1] - x) / (n[0] - 1),
        stepY = (domain[1][1] - y) / (n[1] - 1);
    var o = 0;
    _.loop(n[1], function (j) {
      x = domain[0][0];
      _.loop(n[0], function (i) {
        vertices[o].set(x, y, 0);

        x += stepX;
        o++;
      }.bind(this));
      y += stepY;
    }.bind(this));

    // Apply custom position/fragment shader to renderable
    var opts = {
      uniforms: uniforms,
      shaders: {
        position: function (f, m) {
          if (shaded) {
            f.snippet('bezierSurface' + order)

            // Transform position + DU/DV
            f.group()
              f.snippet('mathTransform');
              m.viewport(f);
            f.next();
              f.snippet('mathTransform');
              m.viewport(f);
            f.next();
              f.snippet('mathTransform');
              m.viewport(f);
            f.combine();
          }
          else {
            // Transform just position
            f
              .snippet('bezierSurface' + order)
              .snippet('mathTransform');
            m.viewport(f);
          }
        },
      },
    };
    this.mesh.set(opts);
    this.line.set(opts);
    this.points.set(opts);

  }//,

});

MathBox.Primitive.types.bezierSurface = MathBox.BezierSurface;
/**
 * Platonic solid
 * (only cubes for now, need to figure clean way to build three.js extras in)
 */
MathBox.Platonic = function (options) {
  // Allow inheritance constructor
  if (options === null) return;

  MathBox.Primitive.call(this, options);
};

MathBox.Platonic.prototype = _.extend(new MathBox.Primitive(null), {

  defaults: function () {
    return {
      n: 1,
      type: 'cube',
      points: false,
      line: false,
      mesh: true,
      doubleSided: true,
      flipSided: false,
      shaded: true,
      style: {}//,
    };
  },

  type: function () {
    return 'platonic';
  },

  renderables: function () {
    return [ this.mesh, this.line, this.points ];
  },

  adjust: function (viewport) {
    var options = this.get();

    this.mesh.show(options.mesh);
    this.line.show(options.line);
    this.points.show(options.points);
  },

  make: function () {
    var that = this,
        options = this.get(),
        style = this.style,
        n = options.n,
        type = options.type;

    var geometry;
    switch (type) {
      case 'cube':
        geometry = new THREE.CubeGeometry(2, 2, 2, 1, 1, 1);
        break;
    }

    // Instantiate renderable.
    this.mesh = new MathBox.Renderable.Mesh(geometry, {
      type: 'mesh',
      doubleSided: options.doubleSided,
      flipSided: options.flipSided,
      shaded: options.shaded,
      smooth: false,
      dynamic: options.live,
    }, style);
    this.line = new MathBox.Renderable.Mesh(geometry, {
      type: 'mesh',
      shaded: options.shaded,
      smooth: false,
      dynamic: options.live,
      wireframe: true
    }, style);
    this.points = new MathBox.Renderable.Mesh(geometry.vertices, {
      type: 'points',
      dynamic: options.live,
    }, style);

  }//,

});

MathBox.Primitive.types.platonic = MathBox.Platonic;
MathBox.Renderable = function (options, style) {
  // Allow inheritance constructor
  if (options === null) return;

  // Unique renderable ID.
  this.id = ++MathBox.Renderable.id;

  // Apply defaults
  var defaults = this.defaults();
  if (options) {
    options = _.extend(defaults, options || {});
  }
  options = options || defaults;
  this.set(options);

  // Wrap a three.js renderable.
  this.object = null;
  this.material = null;
  this.geometry = null;
  this.visible = true;

  // Update on style/uniforms change
  this.style = style || new MathBox.Style();
  this.style.on('change', this.styleCallback = this.refreshStyle.bind(this));
  this.on('change', this.uniformsCallback = this.refreshOptions.bind(this));

  // Combined user-defined math-space transform
  this.mathTransform = new THREE.Matrix4();
};

MathBox.Renderable.id = 0;

MathBox.Renderable.prototype = {
  defaults: function () {
    return {};
  },

  make: function (materials) {
  },

  destroy: function () {
  },

  show: function (show) {
    var change = (show === undefined ? true : !!show);
    if (change != this.visible) {
      this.visible = change;
      this.refresh();
    }
  },

  isVisible: function () {
    return this.object && this.object.visible;
  },

  composeTransform: function (position, rotation, scale) {
		var mRotation = THREE.Matrix4.__m1;
		var mScale = THREE.Matrix4.__m2;

    mRotation.identity();
		mRotation.setRotationFromEuler(rotation, this.object.eulerOrder);

		mScale.makeScale(scale.x, scale.y, scale.z);

		this.mathTransform.multiply(mRotation, mScale);

    var te = this.mathTransform.elements;
		te[12] = position.x;
		te[13] = position.y;
		te[14] = position.z;
  },

  refreshStyle: function (changed) {
    var style = this.style.get();
    changed = changed || style;

    if (this.material) {
      this.material.applyUniforms(changed);
    }

    if (this.object) {
      // No point in culling if everything is dynamic / GLSL based
      this.object.frustumCulled = false;

      // Apply user-defined world transforms through three.js modelView matrix.
      if (changed.worldPosition) this.object.position = style.worldPosition;
      if (changed.worldRotation) this.object.rotation = style.worldRotation;
      if (changed.worldScale) this.object.scale = style.worldScale;

      // Prepare combined mathTransform matrix
      if (changed.mathPosition || changed.mathRotation || changed.mathScale) {
        this.composeTransform(style.mathPosition, style.mathRotation, style.mathScale);

        if (this.material) {
          this.material.applyUniforms({ mathTransform: this.mathTransform });
        }
      }

      // Set visibility
      if (changed.opacity !== undefined) {
        this.object.visible = this.visible && (style.opacity > 0);
      }

      // Set zIndex
      if ((changed.opacity !== undefined || changed.zIndex !== undefined) && this.material) {
        // Solid objects are drawn front to back
        // Transparent objects are drawn back to front
        // Always make sure positive zIndex makes it draw on top of everything else
        var sign = (style.opacity == 1) ? 1 : -1;
        this.object.renderDepth = style.zIndex * sign;
      }
    }
  },

  refreshOptions: function (changed) {
    var options = this.get();
    changed = changed || options;

    if (this.material) {
      options = this.get();

      if (changed.doubleSided !== undefined || changed.flipSided !== undefined) {
        // Set double sided / culling order.
        this.material.side = options.doubleSided ? THREE.DoubleSide :
                             THREE.FrontSide;
        options = { flipSided: (options.doubleSided && options.flipSided) ? -1 : 1 };
        this.material.applyUniforms(options);
      }

      // Apply custom uniforms
      options = this.get().uniforms;
      if (options) {
        this.material.applyUniforms(options);
      }

      // Apply custom attributes
      options = this.get().attributes;
      if (options) {
        this.material.applyAttributes(options);
      }
    }
  },

  refresh: function () {
    this.refreshStyle();
    this.refreshOptions();
  },

  adjust: function (viewport) {
    if (this.material) {
       this.material.applyUniforms(viewport.uniforms());
    }
  }//,

};

MathBox.Attributes.mixin(MathBox.Renderable);
/**
 * Generic renderable of vertices for points/lines/surfaces.
 */
MathBox.Renderable.Mesh = function (points, options, style) {
  this.points = points;

  MathBox.Renderable.call(this, options, style);
};

MathBox.Renderable.Mesh.prototype = _.extend(new MathBox.Renderable(null), {

  defaults: function () {
    return {
      type: 'points',
      doubleSided: true,
      dynamic: false,
      absolute: false,
      strip: true,
      shaders: {},
    };
  },

  make: function (materials) {
    var options = this.get(),
        type = options.type,
        strip = options.strip,
        shaders = options.shaders;

    // Decide on THREE renderable.
    var klass = {
      points: THREE.ParticleSystem,
      line: THREE.Line,
      mesh: THREE.Mesh//,
    }[type];
    if (!klass) throw "Invalid Mesh type '"+ type +"'";

    // Prepare material / shadergraph
    var material = this.material = materials.generic(options);

    // Prepare geometry
    var geometry, points = this.points;
    if (points instanceof Array) {
      // Default, vertices-only
      geometry = this.geometry = new THREE.Geometry();
      geometry.vertices = this.points;
    }
    else {
      // Pass through
      geometry = this.geometry = points;
    }
    geometry.dynamic = options.dynamic;

    // Prepare object3d
    var object;
    switch (type) {
      case 'line':
        object = new THREE.Line(geometry, material, strip ? THREE.LineStrip : THREE.LinePieces);
        break;
      default:
        object = new klass(geometry, material);
        break;
    }
    this.object = object;

    // Refresh material uniforms.
    this.refresh();
  },

  adjust: function (viewport) {
    if (this.get().dynamic) {
      this.geometry.verticesNeedUpdate = true;
    }
    MathBox.Renderable.prototype.adjust.call(this, viewport);
  }//,

});
/**
 * Arrowhead, constant screen-space size.
 */
MathBox.Renderable.ArrowHead = function (from, to, options, style) {
  this.from = from;
  this.to = to;

  MathBox.Renderable.call(this, options, style);
};

MathBox.Renderable.ArrowHead.geometry = new THREE.CylinderGeometry(.33, 0, 1, 16, 1);

MathBox.Renderable.ArrowHead.prototype = _.extend(new MathBox.Renderable(null), {

  defaults: function () {
    return {
      offset: 0,
      absolute: true,
      size: .1//,
    };
  },

  make: function (materials) {
    var options = this.get();

    // Make material.
    var material = this.material = materials.generic(options);

    this._from = new THREE.Vector3();
    this._to = new THREE.Vector3();

    this.diff = new THREE.Vector3();
    this.bi = new THREE.Vector3();
    this.normal = new THREE.Vector3(0, 0, 1);

    // Make cone mesh
    var geometry = this.geometry = MathBox.Renderable.ArrowHead.geometry;
    this.object = new THREE.Mesh(geometry, material);

    // Refresh material uniforms.
    this.refresh();
  },

  isVisible: function () {
    return this.visible && (this.style.get('opacity') > 0);
  },

  adjust: function (viewport) {
    var options = this.get();
    var offset = options.offset;

    // Calculate arrow in world space
    var from = this._from.copy(this.from);
    var to = this._to.copy(this.to);
    this.mathTransform.multiplyVector3(from);
    this.mathTransform.multiplyVector3(to);
    viewport.to(from);
    viewport.to(to);

    // Calculate axis of arrowhead.
    var diff = this.diff.sub(from, to);
    if (diff.length() < .001) {
      this.object.visible = false;
      return;
    }
    else {
      this.object.visible = this.visible;
    }

    diff = diff.normalize();

    // Prepare 'random' normal
    this.normal.x = this.diff.y + .1;
    this.normal.y = this.diff.z + .2;
    this.normal.z = this.diff.x + .3;
    this.normal.normalize();

    // Prepare binormal
    var bi = this.bi.cross(this.normal, this.diff);

    // Renormalize axes.
    var normal = this.normal.cross(this.bi, this.diff);

    // Prepare object matrix to place arrowhead
    var size = options.size;
    var matrix = new THREE.Matrix4(
      bi.x, diff.x, normal.x, to.x,
      bi.y, diff.y, normal.y, to.y,
      bi.z, diff.z, normal.z, to.z,
      0, 0, 0, 1//,
    )
    .scale(new THREE.Vector3(size, size, size));

    // Add arrowhead transform before object matrix
    this.object.updateMatrix();
    this.object.matrix.multiplySelf(matrix);

    // Move cone down so tip is at 0,0,0
    matrix.identity().setPosition({ x: 0, y: 0.5 - offset, z: 0 });
    this.object.matrix.multiplySelf(matrix);

    // Override object matrix
    this.object.matrixAutoUpdate = false;
    this.object.matrixWorldNeedsUpdate = true;

    MathBox.Renderable.prototype.adjust.call(this, viewport);
  },

});

/**
 * Tickmarks on an axis, constant screen space size.
 */
MathBox.Renderable.Ticks = function (points, signs, epsilon, options, style) {
  this.points = points;
  this.signs = signs;
  this.epsilon = epsilon;

  MathBox.Renderable.call(this, options, style);
};

MathBox.Renderable.Ticks.prototype = _.extend(new MathBox.Renderable(null), {

  defaults: function () {
    return {
      dynamic: false,
      absolute: false,
      size: .1//,
    };
  },

  make: function (materials) {
    var options = this.get(),
        points = this.points,
        signs = this.signs;

    // Prepare material with custom position shader
    var materialOptions = {
      type: 'line',
      shaders: {
        position: function (f, m) {
          // Add snippet to load vertex position.
          m.position(f, options);

          // Calculate position and position + epsilon
          f.snippet('tickVertexSplit');

          // Transform positions to viewport
          f.group();
            // Transform position
            m.viewport(f);
          f.next();
            // Transform position + epsilon
            m.viewport(f);
          f.combine();

          // Transform both vectors into tick vertex
          f.snippet('tickVertexJoin');
        },
      },
    };
    var material = this.material = materials.generic(materialOptions);

    // Prepare geometry
    var geometry = this.geometry = new THREE.Geometry();
    geometry.vertices = points;

    // Prepare object3d
    var object = new THREE.Line(geometry, material, THREE.LinePieces);
    this.object = object;

    // Refresh material uniforms.
    this.refresh();
  },

  adjust: function (viewport) {
    var options = this.get();
    this.material && this.material.applyAttributes({
      tickSign: this.signs,
    });
    this.material && this.material.applyUniforms({
      tickEpsilon: this.epsilon,
      tickSize: options.size//,
    });

    if (options.dynamic) {
      this.material.attributes.tickSign.needsUpdate = true;
      this.geometry.verticesNeedUpdate = true;
    }

    MathBox.Renderable.prototype.adjust.call(this, viewport);
  }//,

});
/**
 * Label, text labels anchored to points in 3D
 *
 * Note: uses CSS3D renderer classes, but positions overlays in 2D using the custom
 * overlay class. This avoids fuzzy text and undesirable scaling of text.
 */
MathBox.Renderable.Labels = function (points, tangent, callback, options, style) {
  this.points = points;
  this.tangent = tangent;
  this.callback = callback;

  this.sprites = [];

  MathBox.Renderable.call(this, options, style);
};

MathBox.Renderable.Labels.prototype = _.extend(new MathBox.Renderable(null), {

  defaults: function () {
    return {
      absolute: true,
      distance: 15,
      size: 1//,
    };
  },

  make: function (materials) {
    var options = this.get(),
        points = this.points,
        tangent = this.tangent,
        sprites = this.sprites,
        n = this.points.length;

    // Reusable vector for later.
    this._anchor = new THREE.Vector3();

    // Make parent object to hold all the label divs in one Object3D.
    var element = document.createElement('div');
    var object = this.object = new MathBox.Sprite(element);
    element.className = 'mathbox-labels';

    // Make sprites for all labels
    _.loop(n, function (i) {
      // Nested div to allow for relative positioning for centering
      var element = document.createElement('div');
      var inner = document.createElement('div');
      element.appendChild(inner);

      // Sprite object
      var sprite = new MathBox.Sprite(element, tangent);

      // Position at anchor point
      element.className = 'mathbox-label';
      inner.className = 'mathbox-wrap';
      inner.style.position = 'relative';
      inner.style.display = 'inline-block';
      inner.style.left = '-50%';
      inner.style.top = '-.5em';

      sprites.push(sprite);
      object.add(sprite);
    });

    // Refresh material uniforms.
    //this.refresh();
  },

  adjust: function (viewport, camera, width, height, stage) {
    var options = this.get(),
        points = this.points,
        sprites = this.sprites,
        callback = this.callback,
        anchor = this._anchor,
        distance = options.distance,
        decimals = options.decimals,
        style = this.style,
        opacity = style.get('opacity');

    var mathjax = window.MathJax && MathJax.Hub;

    var ilog10 = 1/Math.log(10);

    // Update labels
    _.each(sprites, function (sprite, i) {

      // Transform anchor point
      sprite.position.copy(points[i]);
      viewport.to(sprite.position);
      stage.matrix.multiplyVector3(sprite.position);
      sprite.distance = options.distance;

      // Set opacity
      sprite.opacity = opacity;

      // Set content
      var text = '';
      if (callback) {
        // Get text
        text = callback(i);
        if (text === undefined) text = '';

        // Try to cast to number and round to n decimals
        if (+text == text) {
          var x = +text;
          if (x != 0) {
            var s = x < 0 ? -1 : 1;
            x = Math.abs(x);
            var unit = Math.pow(10, (decimals - 1) - Math.floor(Math.log(x) * ilog10));
            x = s * Math.round(unit * x) / unit;
            text = x;
          }
        }

        if (!mathjax) {
          text = (''+text).replace(/^-/, '–');
        }
      }

      if (sprite.content !== text) {
        var inner = sprite.element.children[0];

        sprite.content = text;
        sprite.measure = true;

        if (mathjax) {
          inner.innerHTML = "\\(" + text + "\\)";
          MathJax.Hub.queue.Push(["Typeset", MathJax.Hub, inner]);
        }
        else {
          inner.innerHTML = text;
        }
      }
    });

    MathBox.Renderable.prototype.adjust.call(this, viewport);
  },


});

/**
 * Generic viewport base class
 */
MathBox.Viewport = function (options) {
  if (options === null) return;

  var defaults = this.defaults();
  options = _.extend(defaults, options || {});
  this.set(options);

  this.singleton = 'viewport';

  this._uniforms = {};
};

MathBox.Viewport.prototype = {

  defaults: function () {
    return {
      type: 'none',
      rotation: [0, 0, 0],
      position: [0, 0, 0],
    };
  },

  uniforms: function () {
    return this._uniforms;
  },

  axis: function (axis) {
    return [0, 1];
  },

  to: function (vector) {
  },

  from: function (vector) {
  },

  update: function (stage) {
    var options = this.get();
    _.each(['position', 'rotation'], function (key) {
      stage[key].set.apply(stage[key], options[key]);
    });
  },

  shader: function (factory) {
    factory.snippet('mathToWorld');
  },

  validateRotation: function (v) {
    if (v.constructor == Array) {
      v = v.concat([0, 0, 0]);
      return v.slice(0, 3);
    }
    return this.get('rotation');
  },

  validatePosition: function (v) {
    if (v.constructor == Array) {
      v = v.concat([0, 0, 0]);
      return v.slice(0, 3);
    }
    return this.get('position');
  },

};

MathBox.Attributes.mixin(MathBox.Viewport, "type");

MathBox.Viewport.types = {};

MathBox.Viewport.make = function (options) {
  var type = options.type;
  var klass = MathBox.Viewport.types[type]
           || MathBox.Viewport.types['cartesian']
           || MathBox.Viewport;
  return new klass(options);
};

MathBox.ViewportCartesian = function (options) {
  if (options === null) return;

  var _super = MathBox.Viewport;
  _super.call(this, options);
  this.super = _super.prototype;

  // Prepare transform matrices
  this.transform = new THREE.Matrix4();
  this.inverse = new THREE.Matrix4();

  // Prepare uniforms
  _.extend(this._uniforms, {
    viewportTransform: this.transform,
    viewportInverse: this.inverse//,
  });
};

MathBox.ViewportCartesian.prototype = _.extend(new MathBox.Viewport(null), {

  defaults: function () {
    return {
      type: 'cartesian',
      range: [[-1, 1], [-1, 1], [-1, 1]],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      position: [0, 0, 0],
    };
  },

  to: function (vector) {
    this.transform.multiplyVector3(vector);
  },

  from: function (vector) {
    this.inverse.multiplyVector3(vector);
  },

  axis: function (axis) {
    var range = this.get().range[axis],
        a = range[0],
        b = range[1],
        min = Math.min(a, b),
        max = Math.max(a, b);

    return [min, max];
  },

  update: function (stage) {
    var o = this.get(),
        r = o.range,
        s = o.scale;

    var x = r[0][0],
        y = r[1][0],
        z = r[2][0],
        dx = r[0][1] - x,
        dy = r[1][1] - y,
        dz = r[2][1] - z,
        sx = s[0],
        sy = s[1],
        sz = s[2];

    // Forward transform
    var transform = [
      2*sx/dx, 0, 0, -(2*x+dx)*sx/dx,
      0, 2*sy/dy, 0, -(2*y+dy)*sy/dy,
      0, 0, 2*sz/dz, -(2*z+dz)*sz/dz,
      0, 0, 0, 1,
    ];

    // Backward transform
    var inverse = [
      dx/(2*sx), 0, 0, (x+dx/2),
      0, dy/(2*sy), 0, (y+dy/2),
      0, 0, dz/(2*sz), (z+dz/2),
      0, 0, 0, 1,
    ];

    this.transform.set.apply(this.transform, transform);
    this.inverse.set.apply(this.inverse, inverse);

    MathBox.Viewport.prototype.update.call(this, stage);
  },

  // Attribute validators

  validateRange: function (range) {
    range = range || [];

    for (var j = 0; j < 3; ++j) {
      range[j] = range[j] || [];
      for (var i = 0; i < 2; ++i) {
        range[j][i] = range[j][i] !== undefined ? range[j][i] : (i*2-1);
      }
    }

    return range;
  },

  validateScale: function (scale) {
    scale = scale || [];

    for (var j = 0; j < 3; ++j) {
      scale[j] = scale[j] || 1;
    }

    return scale;
  }//,

});

MathBox.Attributes.mixin(MathBox.Viewport);

MathBox.Viewport.types.cartesian = MathBox.ViewportCartesian;
/**
 * Cartesian to polar viewport transform.
 *
 * To animate the transition, the origin of the polar coordinate grid (the focus) is moved
 * from infinity out to 0. In doing so, grid lines in the X direction bend smoothly from
 * straight lines (circles of infinite radius) into circular arcs, while grid lines in the Y
 * direction transition from being parallel (meeting at infinity) to crossing at the origin.
 *
 * The trickiest part is the correction for non-square aspect ratios. Because the scale in
 * the radial direction is entirely arbitrary, the 'circles' are actually ellipses in
 * math-space that are squished back into circles in world-space.
 */
MathBox.ViewportPolar = function (options) {
  var _super = MathBox.ViewportCartesian;
  _super.call(this, options);
  this.super = _super.prototype;

  // Prepare uniforms
  _.extend(this._uniforms, {
    polarAlpha:  0,
    polarAspect: 1,
    polarPower:  1,
    polarFold:   1,
    polarFocus:  1,
    polarHelix:  0,//,
  });
};

MathBox.ViewportPolar.prototype = _.extend(new MathBox.ViewportCartesian(null), {

  defaults: function () {
    return {
      type: 'polar',
      range: [[-1, 1], [-1, 1], [-1, 1]],
      polar: 1,
      fold:  1,
      power: 1,
      helix: 0,
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      position: [0, 0, 0],
    };
  },

  to: function (vector) {
    var aspect = this._uniforms.polarAspect,
        focus = this._uniforms.polarFocus,
        alpha = this._uniforms.polarAlpha,
        fold = this._uniforms.polarFold,
        power = this._uniforms.polarPower,
        helix = this._uniforms.polarHelix;

    // Polar power and fold
    vector.x *= fold;
    vector.y = Math.sign(vector.y) * Math.pow(Math.abs(vector.y), power);

    // Cartesian to polar
    if (alpha > 0.0001) {
      var radius = focus + vector.y * aspect,
          x = vector.x * alpha;

      // Separate folds of complex plane into helix
      vector.z += vector.x * helix * alpha;

      // Apply polar warp
      vector.x = Math.sin(x) * radius;
      vector.y = (Math.cos(x) * radius - focus) / aspect;
    }

    // Apply viewport
    this.transform.multiplyVector3(vector);
  },

  from: function (vector) {
    var aspect = this._uniforms.polarAspect,
        focus = this._uniforms.polarFocus,
        alpha = this._uniforms.polarAlpha,
        fold = this._uniforms.polarFold,
        power = this._uniforms.polarPower,
        helix = this._uniforms.polarHelix;

    // Apply inverse viewport
    this.inverse.multiplyVector3(vector);

    // Polar to cartesian
    if (alpha > 0.0001) {
      var x = vector.x,
          y = vector.y * aspect + focus;

      // Undo polar warp
      var radius = Math.sqrt(x*x + y*y);
          theta = Math.atan2(x, y);

      vector.x = theta / alpha;
      vector.y = (radius - focus) / aspect;

      // Merge separated folds of complex plane flat
      vector.z -= vector.x * helix * alpha;
    }

    // Inverse polar power and fold
    vector.x /= fold;
    vector.y = Math.sign(vector.y) * Math.pow(Math.abs(vector.y), 1 / power);
  },

  axis: function (axis) {
    var range = this.super.axis.call(this, axis);
        min = range[0],
        max = range[1],
        alpha = this._uniforms.polarAlpha,
        aspect = this._uniforms.polarAspect,
        focus = this._uniforms.polarFocus;

    // Correct Y extents during polar warp.
    if (axis == 1 && (alpha > 0)) {
      max = Math.max(Math.abs(max), Math.abs(min));
      min = Math.max(-focus / aspect + .001, min);
    }
    return [min, max];
  },

  update: function (stage) {
    var options = this.get(),
        r = options.range,
        s = options.scale,
        alpha = options.polar,
        fold = options.fold,
        power = options.power,
        helix = options.helix,
        aspect = 1;

    var x = r[0][0],
        y = r[1][0],
        z = r[2][0],
        dx = r[0][1] - x,
        dy = r[1][1] - y,
        dz = r[2][1] - z,
        sx = s[0],
        sy = s[1],
        sz = s[2];

    // Watch for negative scales.
    var idx = dx > 0 ? 1 : -1;

    // Adjust viewport range for polar transform.
    // As the viewport goes polar, the X-range is interpolated to the Y-range instead,
    // creating a perfectly circular viewport.
    var ady = Math.abs(dy);
    var fdx = dx+(ady*idx-dx)*alpha;
    var sdx = fdx/sx, sdy = dy/sy;
    aspect = Math.abs(sdx/sdy);

    // Forward transform
    var transform = [
      2*sx/fdx, 0, 0, -(2*x+dx)*sx/dx,
      0, 2*sy/dy, 0, -(2*y+dy)*sy/dy,
      0, 0, 2*sz/dz, -(2*z+dz)*sz/dz,
      0, 0, 0, 1,
    ];

    // Backward transform
    var inverse = [
      fdx/(2*sx), 0, 0, (x+dx/2),
      0, dy/(2*sy), 0, (y+dy/2),
      0, 0, dz/(2*sz), (z+dz/2),
      0, 0, 0, 1,
    ];

    // Update uniform values
    this.transform.set.apply(this.transform, transform);
    this.inverse.set.apply(this.inverse, inverse);

    this._uniforms.polarAlpha = alpha;
    this._uniforms.polarAspect = aspect;
    this._uniforms.polarFold = fold;
    this._uniforms.polarPower = power;
    this._uniforms.polarFocus = (alpha > 0) ? 1/alpha - 1 : 0;
    this._uniforms.polarHelix = helix;

    MathBox.Viewport.prototype.update.call(this, stage);
  },

  shader: function (factory) {
    factory
      .snippet('polarPower')
      .snippet('cartesianToPolar')
      .snippet('mathToWorld');
  },

  // Attribute validators

  validatePolar: function (polar) {
    return Math.max(0, Math.min(1, +polar || 0));
  }//,

});

MathBox.Attributes.mixin(MathBox.Viewport);

MathBox.Viewport.types.polar = MathBox.ViewportPolar;
/**
 * Cartesian to spherical viewport transform.
 *
 * To animate the transition, the origin of the spherical coordinate grid (the focus) is moved
 * from infinity out to 0. In doing so, grid lines in the X/Y direction bend smoothly from
 * straight lines (circles of infinite radius) into circular arcs, while grid lines in the Z
 * direction transition from being parallel (meeting at infinity) to crossing at the origin.
 *
 * Like the polar viewport, aspect ratio correction is paramount to making this look good.
 * In the X/Z plane, the transform matches the Polar viewport transform.
 * In the Y direction, additional aspect ratio corrections are required.
 */
MathBox.ViewportSphere = function (options) {
  var _super = MathBox.ViewportCartesian;
  _super.call(this, options);
  this.super = _super.prototype;

  // Prepare uniforms
  _.extend(this._uniforms, {
    sphereAlpha:  0,
    sphereAspectX: 1,
    sphereAspectY: 1,
    sphereYScale: 1,
    sphereFocus:  1//,
  });
};

MathBox.ViewportSphere.prototype = _.extend(new MathBox.ViewportCartesian(null), {

  defaults: function () {
    return {
      type: 'sphere',
      range: [[-1, 1], [-1, 1], [-1, 1]],
      sphere: 1,
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      position: [0, 0, 0],
    };
  },

  to: function (vector) {
    var aspectX = this._uniforms.sphereAspectX,
        aspectY = this._uniforms.sphereAspectY,
        yScale = this._uniforms.sphereYScale,
        focus = this._uniforms.sphereFocus,
        alpha = this._uniforms.sphereAlpha;

    // Cartesian to spherical coords
    if (alpha > 0.0001) {
      var radius = focus + vector.z * aspectX,
          x = vector.x * alpha,
          y = vector.y * alpha / aspectY * yScale;

      var c = Math.cos(y) * radius;
      vector.x = Math.sin(x) * c;
      vector.y = Math.sin(y) * radius * aspectY;
      vector.z = (Math.cos(x) * c - focus) / aspectX;
    }

    // Apply viewport
    this.transform.multiplyVector3(vector);
  },

  from: function (vector) {
    var aspectX = this._uniforms.sphereAspectX,
        aspectY = this._uniforms.sphereAspectY,
        yScale = this._uniforms.sphereYScale,
        focus = this._uniforms.sphereFocus,
        alpha = this._uniforms.sphereAlpha;

    // Apply inverse viewport
    this.inverse.multiplyVector3(vector);

    // Spherical coords to cartesian
    if (alpha > 0.0001) {
      var x = vector.x,
          y = vector.y / aspectY,
          z = vector.z * aspectX + focus;

      var radius = Math.sqrt(x*x + y*y + z*z);
          theta = Math.atan2(y, Math.sqrt(x*x + y*y)),
          phi = Math.atan2(x, z);

      vector.x = theta / alpha;
      vector.y = phi / alpha * aspectY / yScale;
      vector.z = (radius - focus) / aspectX;
    }
  },

  axis: function (axis) {
    var range = this.super.axis.call(this, axis);
        min = range[0],
        max = range[1],
        alpha = this._uniforms.sphereAlpha,
        beta = this._uniforms.sphereBeta,
        aspectX = this._uniforms.sphereAspectX,
        aspectY = this._uniforms.sphereAspectY,
        focus = this._uniforms.sphereFocus;

    // Correct Z extents during sphere warp.
    if (axis == 2 && (alpha > 0)) {
      max = Math.max(Math.abs(max), Math.abs(min));
      min = Math.max(-focus / aspectX, min);
    }
    return [min, max];
  },

  update: function (stage) {
    var options = this.get(),
        r = options.range,
        s = options.scale,
        alpha = options.sphere,
        fold = options.fold,
        power = options.power,
        aspect = 1;

    // Focal point
    var focus = (alpha > 0) ? 1/alpha - 1 : 0;

    // Viewport extents
    var x = r[0][0],
        y = r[1][0],
        z = r[2][0],
        dx = r[0][1] - x,
        dy = r[1][1] - y,
        dz = r[2][1] - z,
        sx = s[0],
        sy = s[1],
        sz = s[2];

    // Watch for negative scales.
    var idx = dx > 0 ? 1 : -1;
    var idy = dy > 0 ? 1 : -1;

    // Adjust viewport for sphere.
    // As the viewport goes spherical, the X/Y-ranges are interpolated to the Z-range,
    // creating a perfectly spherical viewport.
    var adz = Math.abs(dz);
    var fdx = dx+(adz*idx-dx)*alpha;
    var fdy = dy+(adz*idy-dy)*alpha;
    var sdx = fdx/sx,
        sdy = fdy/sy,
        sdz = dz/sz;
    aspectX = sdx/sdz, // First fix X aspect to match Z
    aspectY = sdy/sdz/aspectX, // Then fix Y aspect

    // Scale Y coordinates before transforming, but cap at aspectY/alpha to prevent from poking through the poles mid-transform.
    aspectZ = dy/dx*sx/sy*2, // Factor of 2 due to the fact that in the Y direction we only go 180º from pole to pole.
    // This makes more sense if you look at how the vertex shader is implemented.
     yScale = Math.min(aspectY / alpha, 1 + (aspectZ - 1) * alpha);

    // Forward transform
    var transform = [
      2*sx/fdx, 0, 0, -(2*x+dx)*sx/dx,
      0, 2*sy/fdy, 0, -(2*y+dy)*sy/dy,
      0, 0, 2*sz/dz, -(2*z+dz)*sz/dz,
      0, 0, 0, 1,
    ];

    // Backward transform
    var inverse = [
      fdx/(2*sx), 0, 0, (x+dx/2),
      0, fdy/(2*sy), 0, (y+dy/2),
      0, 0, dz/(2*sz), (z+dz/2),
      0, 0, 0, 1,
    ];

    // Update uniform values
    this.transform.set.apply(this.transform, transform);
    this.inverse.set.apply(this.inverse, inverse);

    this._uniforms.sphereAlpha = alpha;
    this._uniforms.sphereAspectX = aspectX;
    this._uniforms.sphereAspectY = aspectY;
    this._uniforms.sphereYScale = yScale;
    this._uniforms.sphereFocus = focus;

    MathBox.Viewport.prototype.update.call(this, stage);
  },

  shader: function (factory) {
    factory
      .snippet('cartesianToSphere')
      .snippet('mathToWorld');
  },

  // Attribute validators

  validateSphere: function (sphere) {
    return Math.max(0, Math.min(1, +sphere || 0));
  }//,

});

MathBox.Attributes.mixin(MathBox.Viewport);

MathBox.Viewport.types.sphere = MathBox.ViewportSphere;
