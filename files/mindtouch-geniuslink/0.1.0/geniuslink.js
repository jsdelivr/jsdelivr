(function(global) {

  var defined = {};

  // indexOf polyfill for IE8
  var indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++)
      if (this[i] === item)
        return i;
    return -1;
  }

  function dedupe(deps) {
    var newDeps = [];
    for (var i = 0, l = deps.length; i < l; i++)
      if (indexOf.call(newDeps, deps[i]) == -1)
        newDeps.push(deps[i])
    return newDeps;
  }

  function register(name, deps, declare, execute) {
    if (typeof name != 'string')
      throw "System.register provided no module name";

    var entry;

    // dynamic
    if (typeof declare == 'boolean') {
      entry = {
        declarative: false,
        deps: deps,
        execute: execute,
        executingRequire: declare
      };
    }
    else {
      // ES6 declarative
      entry = {
        declarative: true,
        deps: deps,
        declare: declare
      };
    }

    entry.name = name;

    // we never overwrite an existing define
    if (!(name in defined))
      defined[name] = entry; 

    entry.deps = dedupe(entry.deps);

    // we have to normalize dependencies
    // (assume dependencies are normalized for now)
    // entry.normalizedDeps = entry.deps.map(normalize);
    entry.normalizedDeps = entry.deps;
  }

  function buildGroups(entry, groups) {
    groups[entry.groupIndex] = groups[entry.groupIndex] || [];

    if (indexOf.call(groups[entry.groupIndex], entry) != -1)
      return;

    groups[entry.groupIndex].push(entry);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];

      // not in the registry means already linked / ES6
      if (!depEntry || depEntry.evaluated)
        continue;

      // now we know the entry is in our unlinked linkage group
      var depGroupIndex = entry.groupIndex + (depEntry.declarative != entry.declarative);

      // the group index of an entry is always the maximum
      if (depEntry.groupIndex === undefined || depEntry.groupIndex < depGroupIndex) {

        // if already in a group, remove from the old group
        if (depEntry.groupIndex !== undefined) {
          groups[depEntry.groupIndex].splice(indexOf.call(groups[depEntry.groupIndex], depEntry), 1);

          // if the old group is empty, then we have a mixed depndency cycle
          if (groups[depEntry.groupIndex].length == 0)
            throw new TypeError("Mixed dependency cycle detected");
        }

        depEntry.groupIndex = depGroupIndex;
      }

      buildGroups(depEntry, groups);
    }
  }

  function link(name) {
    var startEntry = defined[name];

    startEntry.groupIndex = 0;

    var groups = [];

    buildGroups(startEntry, groups);

    var curGroupDeclarative = !!startEntry.declarative == groups.length % 2;
    for (var i = groups.length - 1; i >= 0; i--) {
      var group = groups[i];
      for (var j = 0; j < group.length; j++) {
        var entry = group[j];

        // link each group
        if (curGroupDeclarative)
          linkDeclarativeModule(entry);
        else
          linkDynamicModule(entry);
      }
      curGroupDeclarative = !curGroupDeclarative; 
    }
  }

  // module binding records
  var moduleRecords = {};
  function getOrCreateModuleRecord(name) {
    return moduleRecords[name] || (moduleRecords[name] = {
      name: name,
      dependencies: [],
      exports: {}, // start from an empty module and extend
      importers: []
    })
  }

  function linkDeclarativeModule(entry) {
    // only link if already not already started linking (stops at circular)
    if (entry.module)
      return;

    var module = entry.module = getOrCreateModuleRecord(entry.name);
    var exports = entry.module.exports;

    var declaration = entry.declare.call(global, function(name, value) {
      module.locked = true;
      exports[name] = value;

      for (var i = 0, l = module.importers.length; i < l; i++) {
        var importerModule = module.importers[i];
        if (!importerModule.locked) {
          var importerIndex = indexOf.call(importerModule.dependencies, module);
          importerModule.setters[importerIndex](exports);
        }
      }

      module.locked = false;
      return value;
    });

    module.setters = declaration.setters;
    module.execute = declaration.execute;

    if (!module.setters || !module.execute)
      throw new TypeError("Invalid System.register form for " + entry.name);

    // now link all the module dependencies
    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];
      var depModule = moduleRecords[depName];

      // work out how to set depExports based on scenarios...
      var depExports;

      if (depModule) {
        depExports = depModule.exports;
      }
      else if (depEntry && !depEntry.declarative) {
        if (depEntry.module.exports && depEntry.module.exports.__esModule)
          depExports = depEntry.module.exports;
        else
          depExports = { 'default': depEntry.module.exports, __useDefault: true };
      }
      // in the module registry
      else if (!depEntry) {
        depExports = load(depName);
      }
      // we have an entry -> link
      else {
        linkDeclarativeModule(depEntry);
        depModule = depEntry.module;
        depExports = depModule.exports;
      }

      // only declarative modules have dynamic bindings
      if (depModule && depModule.importers) {
        depModule.importers.push(module);
        module.dependencies.push(depModule);
      }
      else
        module.dependencies.push(null);

      // run the setter for this dependency
      if (module.setters[i])
        module.setters[i](depExports);
    }
  }

  // An analog to loader.get covering execution of all three layers (real declarative, simulated declarative, simulated dynamic)
  function getModule(name) {
    var exports;
    var entry = defined[name];

    if (!entry) {
      exports = load(name);
      if (!exports)
        throw new Error("Unable to load dependency " + name + ".");
    }

    else {
      if (entry.declarative)
        ensureEvaluated(name, []);

      else if (!entry.evaluated)
        linkDynamicModule(entry);

      exports = entry.module.exports;
    }

    if ((!entry || entry.declarative) && exports && exports.__useDefault)
      return exports['default'];

    return exports;
  }

  function linkDynamicModule(entry) {
    if (entry.module)
      return;

    var exports = {};

    var module = entry.module = { exports: exports, id: entry.name };

    // AMD requires execute the tree first
    if (!entry.executingRequire) {
      for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
        var depName = entry.normalizedDeps[i];
        var depEntry = defined[depName];
        if (depEntry)
          linkDynamicModule(depEntry);
      }
    }

    // now execute
    entry.evaluated = true;
    var output = entry.execute.call(global, function(name) {
      for (var i = 0, l = entry.deps.length; i < l; i++) {
        if (entry.deps[i] != name)
          continue;
        return getModule(entry.normalizedDeps[i]);
      }
      throw new TypeError('Module ' + name + ' not declared as a dependency.');
    }, exports, module);

    if (output)
      module.exports = output;
  }

  /*
   * Given a module, and the list of modules for this current branch,
   *  ensure that each of the dependencies of this module is evaluated
   *  (unless one is a circular dependency already in the list of seen
   *  modules, in which case we execute it)
   *
   * Then we evaluate the module itself depth-first left to right 
   * execution to match ES6 modules
   */
  function ensureEvaluated(moduleName, seen) {
    var entry = defined[moduleName];

    // if already seen, that means it's an already-evaluated non circular dependency
    if (!entry || entry.evaluated || !entry.declarative)
      return;

    // this only applies to declarative modules which late-execute

    seen.push(moduleName);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      if (indexOf.call(seen, depName) == -1) {
        if (!defined[depName])
          load(depName);
        else
          ensureEvaluated(depName, seen);
      }
    }

    if (entry.evaluated)
      return;

    entry.evaluated = true;
    entry.module.execute.call(global);
  }

  // magical execution function
  var modules = {};
  function load(name) {
    if (modules[name])
      return modules[name];

    var entry = defined[name];

    // first we check if this module has already been defined in the registry
    if (!entry)
      throw "Module " + name + " not present.";

    // recursively ensure that the module and all its 
    // dependencies are linked (with dependency group handling)
    link(name);

    // now handle dependency execution in correct order
    ensureEvaluated(name, []);

    // remove from the registry
    defined[name] = undefined;

    var module = entry.module.exports;

    if (!module || !entry.declarative && module.__esModule !== true)
      module = { 'default': module, __useDefault: true };

    // return the defined module object
    return modules[name] = module;
  };

  return function(mains, declare) {

    var System;
    var System = {
      register: register, 
      get: load, 
      set: function(name, module) {
        modules[name] = module; 
      },
      newModule: function(module) {
        return module;
      },
      global: global 
    };
    System.set('@empty', {});

    declare(System);

    for (var i = 0; i < mains.length; i++)
      load(mains[i]);
  }

})(typeof window != 'undefined' ? window : global)
/* (['mainModule'], function(System) {
  System.register(...);
}); */

(['index'], function(System) {

System.register("npm:core-js@0.9.18/library/modules/$.fw", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = function($) {
    $.FW = false;
    $.path = $.core;
    return $;
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:babel-runtime@5.8.34/helpers/class-call-check", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  exports["default"] = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.shared", ["npm:core-js@0.9.18/library/modules/$"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$"),
      SHARED = '__core-js_shared__',
      store = $.g[SHARED] || ($.g[SHARED] = {});
  module.exports = function(key) {
    return store[key] || (store[key] = {});
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.uid", ["npm:core-js@0.9.18/library/modules/$"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var sid = 0;
  function uid(key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++sid + Math.random()).toString(36));
  }
  uid.safe = require("npm:core-js@0.9.18/library/modules/$").g.Symbol || uid;
  module.exports = uid;
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.redef", ["npm:core-js@0.9.18/library/modules/$"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("npm:core-js@0.9.18/library/modules/$").hide;
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.string-at", ["npm:core-js@0.9.18/library/modules/$"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$");
  module.exports = function(TO_STRING) {
    return function(that, pos) {
      var s = String($.assertDefined(that)),
          i = $.toInteger(pos),
          l = s.length,
          a,
          b;
      if (i < 0 || i >= l)
        return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.assert", ["npm:core-js@0.9.18/library/modules/$"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$");
  function assert(condition, msg1, msg2) {
    if (!condition)
      throw TypeError(msg2 ? msg1 + msg2 : msg1);
  }
  assert.def = $.assertDefined;
  assert.fn = function(it) {
    if (!$.isFunction(it))
      throw TypeError(it + ' is not a function!');
    return it;
  };
  assert.obj = function(it) {
    if (!$.isObject(it))
      throw TypeError(it + ' is not an object!');
    return it;
  };
  assert.inst = function(it, Constructor, name) {
    if (!(it instanceof Constructor))
      throw TypeError(name + ": use the 'new' operator!");
    return it;
  };
  module.exports = assert;
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.def", ["npm:core-js@0.9.18/library/modules/$"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$"),
      global = $.g,
      core = $.core,
      isFunction = $.isFunction;
  function ctx(fn, that) {
    return function() {
      return fn.apply(that, arguments);
    };
  }
  $def.F = 1;
  $def.G = 2;
  $def.S = 4;
  $def.P = 8;
  $def.B = 16;
  $def.W = 32;
  function $def(type, name, source) {
    var key,
        own,
        out,
        exp,
        isGlobal = type & $def.G,
        isProto = type & $def.P,
        target = isGlobal ? global : type & $def.S ? global[name] : (global[name] || {}).prototype,
        exports = isGlobal ? core : core[name] || (core[name] = {});
    if (isGlobal)
      source = name;
    for (key in source) {
      own = !(type & $def.F) && target && key in target;
      if (own && key in exports)
        continue;
      out = own ? target[key] : source[key];
      if (isGlobal && !isFunction(target[key]))
        exp = source[key];
      else if (type & $def.B && own)
        exp = ctx(out, global);
      else if (type & $def.W && target[key] == out)
        !function(C) {
          exp = function(param) {
            return this instanceof C ? new C(param) : C(param);
          };
          exp.prototype = C.prototype;
        }(out);
      else
        exp = isProto && isFunction(out) ? ctx(Function.call, out) : out;
      exports[key] = exp;
      if (isProto)
        (exports.prototype || (exports.prototype = {}))[key] = out;
    }
  }
  module.exports = $def;
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.unscope", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = function() {};
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.ctx", ["npm:core-js@0.9.18/library/modules/$.assert"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var assertFunction = require("npm:core-js@0.9.18/library/modules/$.assert").fn;
  module.exports = function(fn, that, length) {
    assertFunction(fn);
    if (~length && that === undefined)
      return fn;
    switch (length) {
      case 1:
        return function(a) {
          return fn.call(that, a);
        };
      case 2:
        return function(a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function(a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function() {
      return fn.apply(that, arguments);
    };
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.iter-call", ["npm:core-js@0.9.18/library/modules/$.assert"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var assertObject = require("npm:core-js@0.9.18/library/modules/$.assert").obj;
  function close(iterator) {
    var ret = iterator['return'];
    if (ret !== undefined)
      assertObject(ret.call(iterator));
  }
  function call(iterator, fn, value, entries) {
    try {
      return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
    } catch (e) {
      close(iterator);
      throw e;
    }
  }
  call.close = close;
  module.exports = call;
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.set-proto", ["npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/$.assert", "npm:core-js@0.9.18/library/modules/$.ctx"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$"),
      assert = require("npm:core-js@0.9.18/library/modules/$.assert");
  function check(O, proto) {
    assert.obj(O);
    assert(proto === null || $.isObject(proto), proto, ": can't set as prototype!");
  }
  module.exports = {
    set: Object.setPrototypeOf || ('__proto__' in {} ? function(buggy, set) {
      try {
        set = require("npm:core-js@0.9.18/library/modules/$.ctx")(Function.call, $.getDesc(Object.prototype, '__proto__').set, 2);
        set({}, []);
      } catch (e) {
        buggy = true;
      }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy)
          O.__proto__ = proto;
        else
          set(O, proto);
        return O;
      };
    }() : undefined),
    check: check
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.same", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = Object.is || function is(x, y) {
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.species", ["npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/$.wks"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$"),
      SPECIES = require("npm:core-js@0.9.18/library/modules/$.wks")('species');
  module.exports = function(C) {
    if ($.DESC && !(SPECIES in C))
      $.setDesc(C, SPECIES, {
        configurable: true,
        get: $.that
      });
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.invoke", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = function(fn, args, that) {
    var un = that === undefined;
    switch (args.length) {
      case 0:
        return un ? fn() : fn.call(that);
      case 1:
        return un ? fn(args[0]) : fn.call(that, args[0]);
      case 2:
        return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
      case 3:
        return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
      case 4:
        return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
      case 5:
        return un ? fn(args[0], args[1], args[2], args[3], args[4]) : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
    }
    return fn.apply(that, args);
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.dom-create", ["npm:core-js@0.9.18/library/modules/$"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$"),
      document = $.g.document,
      isObject = $.isObject,
      is = isObject(document) && isObject(document.createElement);
  module.exports = function(it) {
    return is ? document.createElement(it) : {};
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:process@0.11.2/browser", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var process = module.exports = {};
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;
  function cleanUpNextTick() {
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
      return ;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while (len) {
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
    clearTimeout(timeout);
  }
  process.nextTick = function(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
      setTimeout(drainQueue, 0);
    }
  };
  function Item(fun, array) {
    this.fun = fun;
    this.array = array;
  }
  Item.prototype.run = function() {
    this.fun.apply(null, this.array);
  };
  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = '';
  process.versions = {};
  function noop() {}
  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;
  process.binding = function(name) {
    throw new Error('process.binding is not supported');
  };
  process.cwd = function() {
    return '/';
  };
  process.chdir = function(dir) {
    throw new Error('process.chdir is not supported');
  };
  process.umask = function() {
    return 0;
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.mix", ["npm:core-js@0.9.18/library/modules/$.redef"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $redef = require("npm:core-js@0.9.18/library/modules/$.redef");
  module.exports = function(target, src) {
    for (var key in src)
      $redef(target, key, src[key]);
    return target;
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.iter-detect", ["npm:core-js@0.9.18/library/modules/$.wks"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var SYMBOL_ITERATOR = require("npm:core-js@0.9.18/library/modules/$.wks")('iterator'),
      SAFE_CLOSING = false;
  try {
    var riter = [7][SYMBOL_ITERATOR]();
    riter['return'] = function() {
      SAFE_CLOSING = true;
    };
    Array.from(riter, function() {
      throw 2;
    });
  } catch (e) {}
  module.exports = function(exec) {
    if (!SAFE_CLOSING)
      return false;
    var safe = false;
    try {
      var arr = [7],
          iter = arr[SYMBOL_ITERATOR]();
      iter.next = function() {
        safe = true;
      };
      arr[SYMBOL_ITERATOR] = function() {
        return iter;
      };
      exec(arr);
    } catch (e) {}
    return safe;
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.get-names", ["npm:core-js@0.9.18/library/modules/$"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$"),
      toString = {}.toString,
      getNames = $.getNames;
  var windowNames = typeof window == 'object' && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
  function getWindowNames(it) {
    try {
      return getNames(it);
    } catch (e) {
      return windowNames.slice();
    }
  }
  module.exports.get = function getOwnPropertyNames(it) {
    if (windowNames && toString.call(it) == '[object Window]')
      return getWindowNames(it);
    return getNames($.toObject(it));
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:punycode@1.3.2/punycode", ["github:jspm/nodelibs-process@0.1.2"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "format cjs";
  (function(process) {
    ;
    (function(root) {
      var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
      var freeModule = typeof module == 'object' && module && !module.nodeType && module;
      var freeGlobal = typeof global == 'object' && global;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
        root = freeGlobal;
      }
      var punycode,
          maxInt = 2147483647,
          base = 36,
          tMin = 1,
          tMax = 26,
          skew = 38,
          damp = 700,
          initialBias = 72,
          initialN = 128,
          delimiter = '-',
          regexPunycode = /^xn--/,
          regexNonASCII = /[^\x20-\x7E]/,
          regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
          errors = {
            'overflow': 'Overflow: input needs wider integers to process',
            'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
            'invalid-input': 'Invalid input'
          },
          baseMinusTMin = base - tMin,
          floor = Math.floor,
          stringFromCharCode = String.fromCharCode,
          key;
      function error(type) {
        throw RangeError(errors[type]);
      }
      function map(array, fn) {
        var length = array.length;
        var result = [];
        while (length--) {
          result[length] = fn(array[length]);
        }
        return result;
      }
      function mapDomain(string, fn) {
        var parts = string.split('@');
        var result = '';
        if (parts.length > 1) {
          result = parts[0] + '@';
          string = parts[1];
        }
        string = string.replace(regexSeparators, '\x2E');
        var labels = string.split('.');
        var encoded = map(labels, fn).join('.');
        return result + encoded;
      }
      function ucs2decode(string) {
        var output = [],
            counter = 0,
            length = string.length,
            value,
            extra;
        while (counter < length) {
          value = string.charCodeAt(counter++);
          if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            extra = string.charCodeAt(counter++);
            if ((extra & 0xFC00) == 0xDC00) {
              output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            } else {
              output.push(value);
              counter--;
            }
          } else {
            output.push(value);
          }
        }
        return output;
      }
      function ucs2encode(array) {
        return map(array, function(value) {
          var output = '';
          if (value > 0xFFFF) {
            value -= 0x10000;
            output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
            value = 0xDC00 | value & 0x3FF;
          }
          output += stringFromCharCode(value);
          return output;
        }).join('');
      }
      function basicToDigit(codePoint) {
        if (codePoint - 48 < 10) {
          return codePoint - 22;
        }
        if (codePoint - 65 < 26) {
          return codePoint - 65;
        }
        if (codePoint - 97 < 26) {
          return codePoint - 97;
        }
        return base;
      }
      function digitToBasic(digit, flag) {
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
      }
      function adapt(delta, numPoints, firstTime) {
        var k = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);
        for (; delta > baseMinusTMin * tMax >> 1; k += base) {
          delta = floor(delta / baseMinusTMin);
        }
        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
      }
      function decode(input) {
        var output = [],
            inputLength = input.length,
            out,
            i = 0,
            n = initialN,
            bias = initialBias,
            basic,
            j,
            index,
            oldi,
            w,
            k,
            digit,
            t,
            baseMinusT;
        basic = input.lastIndexOf(delimiter);
        if (basic < 0) {
          basic = 0;
        }
        for (j = 0; j < basic; ++j) {
          if (input.charCodeAt(j) >= 0x80) {
            error('not-basic');
          }
          output.push(input.charCodeAt(j));
        }
        for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
          for (oldi = i, w = 1, k = base; ; k += base) {
            if (index >= inputLength) {
              error('invalid-input');
            }
            digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base || digit > floor((maxInt - i) / w)) {
              error('overflow');
            }
            i += digit * w;
            t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
            if (digit < t) {
              break;
            }
            baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
              error('overflow');
            }
            w *= baseMinusT;
          }
          out = output.length + 1;
          bias = adapt(i - oldi, out, oldi == 0);
          if (floor(i / out) > maxInt - n) {
            error('overflow');
          }
          n += floor(i / out);
          i %= out;
          output.splice(i++, 0, n);
        }
        return ucs2encode(output);
      }
      function encode(input) {
        var n,
            delta,
            handledCPCount,
            basicLength,
            bias,
            j,
            m,
            q,
            k,
            t,
            currentValue,
            output = [],
            inputLength,
            handledCPCountPlusOne,
            baseMinusT,
            qMinusT;
        input = ucs2decode(input);
        inputLength = input.length;
        n = initialN;
        delta = 0;
        bias = initialBias;
        for (j = 0; j < inputLength; ++j) {
          currentValue = input[j];
          if (currentValue < 0x80) {
            output.push(stringFromCharCode(currentValue));
          }
        }
        handledCPCount = basicLength = output.length;
        if (basicLength) {
          output.push(delimiter);
        }
        while (handledCPCount < inputLength) {
          for (m = maxInt, j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue >= n && currentValue < m) {
              m = currentValue;
            }
          }
          handledCPCountPlusOne = handledCPCount + 1;
          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error('overflow');
          }
          delta += (m - n) * handledCPCountPlusOne;
          n = m;
          for (j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue < n && ++delta > maxInt) {
              error('overflow');
            }
            if (currentValue == n) {
              for (q = delta, k = base; ; k += base) {
                t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
                if (q < t) {
                  break;
                }
                qMinusT = q - t;
                baseMinusT = base - t;
                output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
                q = floor(qMinusT / baseMinusT);
              }
              output.push(stringFromCharCode(digitToBasic(q, 0)));
              bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
              delta = 0;
              ++handledCPCount;
            }
          }
          ++delta;
          ++n;
        }
        return output.join('');
      }
      function toUnicode(input) {
        return mapDomain(input, function(string) {
          return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
        });
      }
      function toASCII(input) {
        return mapDomain(input, function(string) {
          return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
        });
      }
      punycode = {
        'version': '1.3.2',
        'ucs2': {
          'decode': ucs2decode,
          'encode': ucs2encode
        },
        'decode': decode,
        'encode': encode,
        'toASCII': toASCII,
        'toUnicode': toUnicode
      };
      if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        define('punycode', function() {
          return punycode;
        });
      } else if (freeExports && freeModule) {
        if (module.exports == freeExports) {
          freeModule.exports = punycode;
        } else {
          for (key in punycode) {
            punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
          }
        }
      } else {
        root.punycode = punycode;
      }
    }(this));
  })(require("github:jspm/nodelibs-process@0.1.2"));
  global.define = __define;
  return module.exports;
});

System.register("npm:querystring@0.2.0/decode", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  'use strict';
  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  module.exports = function(qs, sep, eq, options) {
    sep = sep || '&';
    eq = eq || '=';
    var obj = {};
    if (typeof qs !== 'string' || qs.length === 0) {
      return obj;
    }
    var regexp = /\+/g;
    qs = qs.split(sep);
    var maxKeys = 1000;
    if (options && typeof options.maxKeys === 'number') {
      maxKeys = options.maxKeys;
    }
    var len = qs.length;
    if (maxKeys > 0 && len > maxKeys) {
      len = maxKeys;
    }
    for (var i = 0; i < len; ++i) {
      var x = qs[i].replace(regexp, '%20'),
          idx = x.indexOf(eq),
          kstr,
          vstr,
          k,
          v;
      if (idx >= 0) {
        kstr = x.substr(0, idx);
        vstr = x.substr(idx + 1);
      } else {
        kstr = x;
        vstr = '';
      }
      k = decodeURIComponent(kstr);
      v = decodeURIComponent(vstr);
      if (!hasOwnProperty(obj, k)) {
        obj[k] = v;
      } else if (Array.isArray(obj[k])) {
        obj[k].push(v);
      } else {
        obj[k] = [obj[k], v];
      }
    }
    return obj;
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:querystring@0.2.0/encode", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var stringifyPrimitive = function(v) {
    switch (typeof v) {
      case 'string':
        return v;
      case 'boolean':
        return v ? 'true' : 'false';
      case 'number':
        return isFinite(v) ? v : '';
      default:
        return '';
    }
  };
  module.exports = function(obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';
    if (obj === null) {
      obj = undefined;
    }
    if (typeof obj === 'object') {
      return Object.keys(obj).map(function(k) {
        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
        if (Array.isArray(obj[k])) {
          return obj[k].map(function(v) {
            return ks + encodeURIComponent(stringifyPrimitive(v));
          }).join(sep);
        } else {
          return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
        }
      }).join(sep);
    }
    if (!name)
      return '';
    return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/fn/object/get-own-property-descriptor", ["npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/es6.object.statics-accept-primitives"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$");
  require("npm:core-js@0.9.18/library/modules/es6.object.statics-accept-primitives");
  module.exports = function getOwnPropertyDescriptor(it, key) {
    return $.getDesc(it, key);
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/fn/object/create", ["npm:core-js@0.9.18/library/modules/$"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$");
  module.exports = function create(P, D) {
    return $.create(P, D);
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/es6.object.set-prototype-of", ["npm:core-js@0.9.18/library/modules/$.def", "npm:core-js@0.9.18/library/modules/$.set-proto"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $def = require("npm:core-js@0.9.18/library/modules/$.def");
  $def($def.S, 'Object', {setPrototypeOf: require("npm:core-js@0.9.18/library/modules/$.set-proto").set});
  global.define = __define;
  return module.exports;
});

System.register("github:moment/moment@2.10.6/moment", [], false, function(__require, __exports, __module) {
  System.get("@@global-helpers").prepareGlobal(__module.id, []);
  (function() {
    "format global";
    (function(global, factory) {
      typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.moment = factory();
    }(this, function() {
      'use strict';
      var hookCallback;
      function utils_hooks__hooks() {
        return hookCallback.apply(null, arguments);
      }
      function setHookCallback(callback) {
        hookCallback = callback;
      }
      function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
      }
      function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
      }
      function map(arr, fn) {
        var res = [],
            i;
        for (i = 0; i < arr.length; ++i) {
          res.push(fn(arr[i], i));
        }
        return res;
      }
      function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
      }
      function extend(a, b) {
        for (var i in b) {
          if (hasOwnProp(b, i)) {
            a[i] = b[i];
          }
        }
        if (hasOwnProp(b, 'toString')) {
          a.toString = b.toString;
        }
        if (hasOwnProp(b, 'valueOf')) {
          a.valueOf = b.valueOf;
        }
        return a;
      }
      function create_utc__createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
      }
      function defaultParsingFlags() {
        return {
          empty: false,
          unusedTokens: [],
          unusedInput: [],
          overflow: -2,
          charsLeftOver: 0,
          nullInput: false,
          invalidMonth: null,
          invalidFormat: false,
          userInvalidated: false,
          iso: false
        };
      }
      function getParsingFlags(m) {
        if (m._pf == null) {
          m._pf = defaultParsingFlags();
        }
        return m._pf;
      }
      function valid__isValid(m) {
        if (m._isValid == null) {
          var flags = getParsingFlags(m);
          m._isValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidMonth && !flags.invalidWeekday && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated;
          if (m._strict) {
            m._isValid = m._isValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === undefined;
          }
        }
        return m._isValid;
      }
      function valid__createInvalid(flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
          extend(getParsingFlags(m), flags);
        } else {
          getParsingFlags(m).userInvalidated = true;
        }
        return m;
      }
      var momentProperties = utils_hooks__hooks.momentProperties = [];
      function copyConfig(to, from) {
        var i,
            prop,
            val;
        if (typeof from._isAMomentObject !== 'undefined') {
          to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
          to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
          to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
          to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
          to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
          to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
          to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
          to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
          to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
          to._locale = from._locale;
        }
        if (momentProperties.length > 0) {
          for (i in momentProperties) {
            prop = momentProperties[i];
            val = from[prop];
            if (typeof val !== 'undefined') {
              to[prop] = val;
            }
          }
        }
        return to;
      }
      var updateInProgress = false;
      function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (updateInProgress === false) {
          updateInProgress = true;
          utils_hooks__hooks.updateOffset(this);
          updateInProgress = false;
        }
      }
      function isMoment(obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
      }
      function absFloor(number) {
        if (number < 0) {
          return Math.ceil(number);
        } else {
          return Math.floor(number);
        }
      }
      function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;
        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
          value = absFloor(coercedNumber);
        }
        return value;
      }
      function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
          if ((dontConvert && array1[i] !== array2[i]) || (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
            diffs++;
          }
        }
        return diffs + lengthDiff;
      }
      function Locale() {}
      var locales = {};
      var globalLocale;
      function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
      }
      function chooseLocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;
        while (i < names.length) {
          split = normalizeLocale(names[i]).split('-');
          j = split.length;
          next = normalizeLocale(names[i + 1]);
          next = next ? next.split('-') : null;
          while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
              return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
              break;
            }
            j--;
          }
          i++;
        }
        return null;
      }
      function loadLocale(name) {
        var oldLocale = null;
        if (!locales[name] && typeof module !== 'undefined' && module && module.exports) {
          try {
            oldLocale = globalLocale._abbr;
            require('./locale/' + name);
            locale_locales__getSetGlobalLocale(oldLocale);
          } catch (e) {}
        }
        return locales[name];
      }
      function locale_locales__getSetGlobalLocale(key, values) {
        var data;
        if (key) {
          if (typeof values === 'undefined') {
            data = locale_locales__getLocale(key);
          } else {
            data = defineLocale(key, values);
          }
          if (data) {
            globalLocale = data;
          }
        }
        return globalLocale._abbr;
      }
      function defineLocale(name, values) {
        if (values !== null) {
          values.abbr = name;
          locales[name] = locales[name] || new Locale();
          locales[name].set(values);
          locale_locales__getSetGlobalLocale(name);
          return locales[name];
        } else {
          delete locales[name];
          return null;
        }
      }
      function locale_locales__getLocale(key) {
        var locale;
        if (key && key._locale && key._locale._abbr) {
          key = key._locale._abbr;
        }
        if (!key) {
          return globalLocale;
        }
        if (!isArray(key)) {
          locale = loadLocale(key);
          if (locale) {
            return locale;
          }
          key = [key];
        }
        return chooseLocale(key);
      }
      var aliases = {};
      function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
      }
      function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
      }
      function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;
        for (prop in inputObject) {
          if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
              normalizedInput[normalizedProp] = inputObject[prop];
            }
          }
        }
        return normalizedInput;
      }
      function makeGetSet(unit, keepTime) {
        return function(value) {
          if (value != null) {
            get_set__set(this, unit, value);
            utils_hooks__hooks.updateOffset(this, keepTime);
            return this;
          } else {
            return get_set__get(this, unit);
          }
        };
      }
      function get_set__get(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
      }
      function get_set__set(mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
      }
      function getSet(units, value) {
        var unit;
        if (typeof units === 'object') {
          for (unit in units) {
            this.set(unit, units[unit]);
          }
        } else {
          units = normalizeUnits(units);
          if (typeof this[units] === 'function') {
            return this[units](value);
          }
        }
        return this;
      }
      function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
      }
      var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
      var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;
      var formatFunctions = {};
      var formatTokenFunctions = {};
      function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
          func = function() {
            return this[callback]();
          };
        }
        if (token) {
          formatTokenFunctions[token] = func;
        }
        if (padded) {
          formatTokenFunctions[padded[0]] = function() {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
          };
        }
        if (ordinal) {
          formatTokenFunctions[ordinal] = function() {
            return this.localeData().ordinal(func.apply(this, arguments), token);
          };
        }
      }
      function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
          return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
      }
      function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i,
            length;
        for (i = 0, length = array.length; i < length; i++) {
          if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
          } else {
            array[i] = removeFormattingTokens(array[i]);
          }
        }
        return function(mom) {
          var output = '';
          for (i = 0; i < length; i++) {
            output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
          }
          return output;
        };
      }
      function formatMoment(m, format) {
        if (!m.isValid()) {
          return m.localeData().invalidDate();
        }
        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);
        return formatFunctions[format](m);
      }
      function expandFormat(format, locale) {
        var i = 5;
        function replaceLongDateFormatTokens(input) {
          return locale.longDateFormat(input) || input;
        }
        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
          format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
          localFormattingTokens.lastIndex = 0;
          i -= 1;
        }
        return format;
      }
      var match1 = /\d/;
      var match2 = /\d\d/;
      var match3 = /\d{3}/;
      var match4 = /\d{4}/;
      var match6 = /[+-]?\d{6}/;
      var match1to2 = /\d\d?/;
      var match1to3 = /\d{1,3}/;
      var match1to4 = /\d{1,4}/;
      var match1to6 = /[+-]?\d{1,6}/;
      var matchUnsigned = /\d+/;
      var matchSigned = /[+-]?\d+/;
      var matchOffset = /Z|[+-]\d\d:?\d\d/gi;
      var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/;
      var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
      var regexes = {};
      function isFunction(sth) {
        return typeof sth === 'function' && Object.prototype.toString.call(sth) === '[object Function]';
      }
      function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function(isStrict) {
          return (isStrict && strictRegex) ? strictRegex : regex;
        };
      }
      function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
          return new RegExp(unescapeFormat(token));
        }
        return regexes[token](config._strict, config._locale);
      }
      function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(matched, p1, p2, p3, p4) {
          return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      }
      var tokens = {};
      function addParseToken(token, callback) {
        var i,
            func = callback;
        if (typeof token === 'string') {
          token = [token];
        }
        if (typeof callback === 'number') {
          func = function(input, array) {
            array[callback] = toInt(input);
          };
        }
        for (i = 0; i < token.length; i++) {
          tokens[token[i]] = func;
        }
      }
      function addWeekParseToken(token, callback) {
        addParseToken(token, function(input, array, config, token) {
          config._w = config._w || {};
          callback(input, config._w, config, token);
        });
      }
      function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
          tokens[token](input, config._a, config, token);
        }
      }
      var YEAR = 0;
      var MONTH = 1;
      var DATE = 2;
      var HOUR = 3;
      var MINUTE = 4;
      var SECOND = 5;
      var MILLISECOND = 6;
      function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      }
      addFormatToken('M', ['MM', 2], 'Mo', function() {
        return this.month() + 1;
      });
      addFormatToken('MMM', 0, 0, function(format) {
        return this.localeData().monthsShort(this, format);
      });
      addFormatToken('MMMM', 0, 0, function(format) {
        return this.localeData().months(this, format);
      });
      addUnitAlias('month', 'M');
      addRegexToken('M', match1to2);
      addRegexToken('MM', match1to2, match2);
      addRegexToken('MMM', matchWord);
      addRegexToken('MMMM', matchWord);
      addParseToken(['M', 'MM'], function(input, array) {
        array[MONTH] = toInt(input) - 1;
      });
      addParseToken(['MMM', 'MMMM'], function(input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        if (month != null) {
          array[MONTH] = month;
        } else {
          getParsingFlags(config).invalidMonth = input;
        }
      });
      var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
      function localeMonths(m) {
        return this._months[m.month()];
      }
      var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
      function localeMonthsShort(m) {
        return this._monthsShort[m.month()];
      }
      function localeMonthsParse(monthName, format, strict) {
        var i,
            mom,
            regex;
        if (!this._monthsParse) {
          this._monthsParse = [];
          this._longMonthsParse = [];
          this._shortMonthsParse = [];
        }
        for (i = 0; i < 12; i++) {
          mom = create_utc__createUTC([2000, i]);
          if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
          }
          if (!strict && !this._monthsParse[i]) {
            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
          }
          if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
            return i;
          } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
            return i;
          } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
          }
        }
      }
      function setMonth(mom, value) {
        var dayOfMonth;
        if (typeof value === 'string') {
          value = mom.localeData().monthsParse(value);
          if (typeof value !== 'number') {
            return mom;
          }
        }
        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
      }
      function getSetMonth(value) {
        if (value != null) {
          setMonth(this, value);
          utils_hooks__hooks.updateOffset(this, true);
          return this;
        } else {
          return get_set__get(this, 'Month');
        }
      }
      function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
      }
      function checkOverflow(m) {
        var overflow;
        var a = m._a;
        if (a && getParsingFlags(m).overflow === -2) {
          overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;
          if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
          }
          getParsingFlags(m).overflow = overflow;
        }
        return m;
      }
      function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
          console.warn('Deprecation warning: ' + msg);
        }
      }
      function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function() {
          if (firstTime) {
            warn(msg + '\n' + (new Error()).stack);
            firstTime = false;
          }
          return fn.apply(this, arguments);
        }, fn);
      }
      var deprecations = {};
      function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
          warn(msg);
          deprecations[name] = true;
        }
      }
      utils_hooks__hooks.suppressDeprecationWarnings = false;
      var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
      var isoDates = [['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/], ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/], ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/], ['GGGG-[W]WW', /\d{4}-W\d{2}/], ['YYYY-DDD', /\d{4}-\d{3}/]];
      var isoTimes = [['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/], ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/], ['HH:mm', /(T| )\d\d:\d\d/], ['HH', /(T| )\d\d/]];
      var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;
      function configFromISO(config) {
        var i,
            l,
            string = config._i,
            match = from_string__isoRegex.exec(string);
        if (match) {
          getParsingFlags(config).iso = true;
          for (i = 0, l = isoDates.length; i < l; i++) {
            if (isoDates[i][1].exec(string)) {
              config._f = isoDates[i][0];
              break;
            }
          }
          for (i = 0, l = isoTimes.length; i < l; i++) {
            if (isoTimes[i][1].exec(string)) {
              config._f += (match[6] || ' ') + isoTimes[i][0];
              break;
            }
          }
          if (string.match(matchOffset)) {
            config._f += 'Z';
          }
          configFromStringAndFormat(config);
        } else {
          config._isValid = false;
        }
      }
      function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
          config._d = new Date(+matched[1]);
          return ;
        }
        configFromISO(config);
        if (config._isValid === false) {
          delete config._isValid;
          utils_hooks__hooks.createFromInputFallback(config);
        }
      }
      utils_hooks__hooks.createFromInputFallback = deprecate('moment construction falls back to js Date. This is ' + 'discouraged and will be removed in upcoming major ' + 'release. Please refer to ' + 'https://github.com/moment/moment/issues/1407 for more info.', function(config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
      });
      function createDate(y, m, d, h, M, s, ms) {
        var date = new Date(y, m, d, h, M, s, ms);
        if (y < 1970) {
          date.setFullYear(y);
        }
        return date;
      }
      function createUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
          date.setUTCFullYear(y);
        }
        return date;
      }
      addFormatToken(0, ['YY', 2], 0, function() {
        return this.year() % 100;
      });
      addFormatToken(0, ['YYYY', 4], 0, 'year');
      addFormatToken(0, ['YYYYY', 5], 0, 'year');
      addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');
      addUnitAlias('year', 'y');
      addRegexToken('Y', matchSigned);
      addRegexToken('YY', match1to2, match2);
      addRegexToken('YYYY', match1to4, match4);
      addRegexToken('YYYYY', match1to6, match6);
      addRegexToken('YYYYYY', match1to6, match6);
      addParseToken(['YYYYY', 'YYYYYY'], YEAR);
      addParseToken('YYYY', function(input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
      });
      addParseToken('YY', function(input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
      });
      function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
      }
      function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      }
      utils_hooks__hooks.parseTwoDigitYear = function(input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
      };
      var getSetYear = makeGetSet('FullYear', false);
      function getIsLeapYear() {
        return isLeapYear(this.year());
      }
      addFormatToken('w', ['ww', 2], 'wo', 'week');
      addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');
      addUnitAlias('week', 'w');
      addUnitAlias('isoWeek', 'W');
      addRegexToken('w', match1to2);
      addRegexToken('ww', match1to2, match2);
      addRegexToken('W', match1to2);
      addRegexToken('WW', match1to2, match2);
      addWeekParseToken(['w', 'ww', 'W', 'WW'], function(input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
      });
      function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;
        if (daysToDayOfWeek > end) {
          daysToDayOfWeek -= 7;
        }
        if (daysToDayOfWeek < end - 7) {
          daysToDayOfWeek += 7;
        }
        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
          week: Math.ceil(adjustedMoment.dayOfYear() / 7),
          year: adjustedMoment.year()
        };
      }
      function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
      }
      var defaultLocaleWeek = {
        dow: 0,
        doy: 6
      };
      function localeFirstDayOfWeek() {
        return this._week.dow;
      }
      function localeFirstDayOfYear() {
        return this._week.doy;
      }
      function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
      }
      function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
      }
      addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');
      addUnitAlias('dayOfYear', 'DDD');
      addRegexToken('DDD', match1to3);
      addRegexToken('DDDD', match3);
      addParseToken(['DDD', 'DDDD'], function(input, array, config) {
        config._dayOfYear = toInt(input);
      });
      function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear,
            janX = createUTCDate(year, 0, 1 + week1Jan),
            d = janX.getUTCDay(),
            dayOfYear;
        if (d < firstDayOfWeek) {
          d += 7;
        }
        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;
        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;
        return {
          year: dayOfYear > 0 ? year : year - 1,
          dayOfYear: dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
        };
      }
      function getSetDayOfYear(input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
      }
      function defaults(a, b, c) {
        if (a != null) {
          return a;
        }
        if (b != null) {
          return b;
        }
        return c;
      }
      function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
          return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
      }
      function configFromArray(config) {
        var i,
            date,
            input = [],
            currentDate,
            yearToUse;
        if (config._d) {
          return ;
        }
        currentDate = currentDateArray(config);
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
          dayOfYearFromWeekInfo(config);
        }
        if (config._dayOfYear) {
          yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);
          if (config._dayOfYear > daysInYear(yearToUse)) {
            getParsingFlags(config)._overflowDayOfYear = true;
          }
          date = createUTCDate(yearToUse, 0, config._dayOfYear);
          config._a[MONTH] = date.getUTCMonth();
          config._a[DATE] = date.getUTCDate();
        }
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
          config._a[i] = input[i] = currentDate[i];
        }
        for (; i < 7; i++) {
          config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }
        if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
          config._nextDay = true;
          config._a[HOUR] = 0;
        }
        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        if (config._tzm != null) {
          config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }
        if (config._nextDay) {
          config._a[HOUR] = 24;
        }
      }
      function dayOfYearFromWeekInfo(config) {
        var w,
            weekYear,
            week,
            weekday,
            dow,
            doy,
            temp;
        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
          dow = 1;
          doy = 4;
          weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
          week = defaults(w.W, 1);
          weekday = defaults(w.E, 1);
        } else {
          dow = config._locale._week.dow;
          doy = config._locale._week.doy;
          weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
          week = defaults(w.w, 1);
          if (w.d != null) {
            weekday = w.d;
            if (weekday < dow) {
              ++week;
            }
          } else if (w.e != null) {
            weekday = w.e + dow;
          } else {
            weekday = dow;
          }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
      }
      utils_hooks__hooks.ISO_8601 = function() {};
      function configFromStringAndFormat(config) {
        if (config._f === utils_hooks__hooks.ISO_8601) {
          configFromISO(config);
          return ;
        }
        config._a = [];
        getParsingFlags(config).empty = true;
        var string = '' + config._i,
            i,
            parsedInput,
            tokens,
            token,
            skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;
        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];
        for (i = 0; i < tokens.length; i++) {
          token = tokens[i];
          parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
          if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
              getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
          }
          if (formatTokenFunctions[token]) {
            if (parsedInput) {
              getParsingFlags(config).empty = false;
            } else {
              getParsingFlags(config).unusedTokens.push(token);
            }
            addTimeToArrayFromToken(token, parsedInput, config);
          } else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token);
          }
        }
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
          getParsingFlags(config).unusedInput.push(string);
        }
        if (getParsingFlags(config).bigHour === true && config._a[HOUR] <= 12 && config._a[HOUR] > 0) {
          getParsingFlags(config).bigHour = undefined;
        }
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);
        configFromArray(config);
        checkOverflow(config);
      }
      function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;
        if (meridiem == null) {
          return hour;
        }
        if (locale.meridiemHour != null) {
          return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
          isPm = locale.isPM(meridiem);
          if (isPm && hour < 12) {
            hour += 12;
          }
          if (!isPm && hour === 12) {
            hour = 0;
          }
          return hour;
        } else {
          return hour;
        }
      }
      function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,
            scoreToBeat,
            i,
            currentScore;
        if (config._f.length === 0) {
          getParsingFlags(config).invalidFormat = true;
          config._d = new Date(NaN);
          return ;
        }
        for (i = 0; i < config._f.length; i++) {
          currentScore = 0;
          tempConfig = copyConfig({}, config);
          if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
          }
          tempConfig._f = config._f[i];
          configFromStringAndFormat(tempConfig);
          if (!valid__isValid(tempConfig)) {
            continue;
          }
          currentScore += getParsingFlags(tempConfig).charsLeftOver;
          currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;
          getParsingFlags(tempConfig).score = currentScore;
          if (scoreToBeat == null || currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
          }
        }
        extend(config, bestMoment || tempConfig);
      }
      function configFromObject(config) {
        if (config._d) {
          return ;
        }
        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];
        configFromArray(config);
      }
      function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
          res.add(1, 'd');
          res._nextDay = undefined;
        }
        return res;
      }
      function prepareConfig(config) {
        var input = config._i,
            format = config._f;
        config._locale = config._locale || locale_locales__getLocale(config._l);
        if (input === null || (format === undefined && input === '')) {
          return valid__createInvalid({nullInput: true});
        }
        if (typeof input === 'string') {
          config._i = input = config._locale.preparse(input);
        }
        if (isMoment(input)) {
          return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
          configFromStringAndArray(config);
        } else if (format) {
          configFromStringAndFormat(config);
        } else if (isDate(input)) {
          config._d = input;
        } else {
          configFromInput(config);
        }
        return config;
      }
      function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
          config._d = new Date();
        } else if (isDate(input)) {
          config._d = new Date(+input);
        } else if (typeof input === 'string') {
          configFromString(config);
        } else if (isArray(input)) {
          config._a = map(input.slice(0), function(obj) {
            return parseInt(obj, 10);
          });
          configFromArray(config);
        } else if (typeof(input) === 'object') {
          configFromObject(config);
        } else if (typeof(input) === 'number') {
          config._d = new Date(input);
        } else {
          utils_hooks__hooks.createFromInputFallback(config);
        }
      }
      function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};
        if (typeof(locale) === 'boolean') {
          strict = locale;
          locale = undefined;
        }
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        return createFromConfig(c);
      }
      function local__createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
      }
      var prototypeMin = deprecate('moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548', function() {
        var other = local__createLocal.apply(null, arguments);
        return other < this ? this : other;
      });
      var prototypeMax = deprecate('moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548', function() {
        var other = local__createLocal.apply(null, arguments);
        return other > this ? this : other;
      });
      function pickBy(fn, moments) {
        var res,
            i;
        if (moments.length === 1 && isArray(moments[0])) {
          moments = moments[0];
        }
        if (!moments.length) {
          return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
          if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
          }
        }
        return res;
      }
      function min() {
        var args = [].slice.call(arguments, 0);
        return pickBy('isBefore', args);
      }
      function max() {
        var args = [].slice.call(arguments, 0);
        return pickBy('isAfter', args);
      }
      function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;
        this._milliseconds = +milliseconds + seconds * 1e3 + minutes * 6e4 + hours * 36e5;
        this._days = +days + weeks * 7;
        this._months = +months + quarters * 3 + years * 12;
        this._data = {};
        this._locale = locale_locales__getLocale();
        this._bubble();
      }
      function isDuration(obj) {
        return obj instanceof Duration;
      }
      function offset(token, separator) {
        addFormatToken(token, 0, 0, function() {
          var offset = this.utcOffset();
          var sign = '+';
          if (offset < 0) {
            offset = -offset;
            sign = '-';
          }
          return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
      }
      offset('Z', ':');
      offset('ZZ', '');
      addRegexToken('Z', matchOffset);
      addRegexToken('ZZ', matchOffset);
      addParseToken(['Z', 'ZZ'], function(input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
      });
      var chunkOffset = /([\+\-]|\d\d)/gi;
      function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk = matches[matches.length - 1] || [];
        var parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);
        return parts[0] === '+' ? minutes : -minutes;
      }
      function cloneWithOffset(input, model) {
        var res,
            diff;
        if (model._isUTC) {
          res = model.clone();
          diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
          res._d.setTime(+res._d + diff);
          utils_hooks__hooks.updateOffset(res, false);
          return res;
        } else {
          return local__createLocal(input).local();
        }
      }
      function getDateOffset(m) {
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
      }
      utils_hooks__hooks.updateOffset = function() {};
      function getSetOffset(input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
          if (typeof input === 'string') {
            input = offsetFromString(input);
          }
          if (Math.abs(input) < 16) {
            input = input * 60;
          }
          if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
          }
          this._offset = input;
          this._isUTC = true;
          if (localAdjust != null) {
            this.add(localAdjust, 'm');
          }
          if (offset !== input) {
            if (!keepLocalTime || this._changeInProgress) {
              add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
            } else if (!this._changeInProgress) {
              this._changeInProgress = true;
              utils_hooks__hooks.updateOffset(this, true);
              this._changeInProgress = null;
            }
          }
          return this;
        } else {
          return this._isUTC ? offset : getDateOffset(this);
        }
      }
      function getSetZone(input, keepLocalTime) {
        if (input != null) {
          if (typeof input !== 'string') {
            input = -input;
          }
          this.utcOffset(input, keepLocalTime);
          return this;
        } else {
          return -this.utcOffset();
        }
      }
      function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
      }
      function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
          this.utcOffset(0, keepLocalTime);
          this._isUTC = false;
          if (keepLocalTime) {
            this.subtract(getDateOffset(this), 'm');
          }
        }
        return this;
      }
      function setOffsetToParsedOffset() {
        if (this._tzm) {
          this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
          this.utcOffset(offsetFromString(this._i));
        }
        return this;
      }
      function hasAlignedHourOffset(input) {
        input = input ? local__createLocal(input).utcOffset() : 0;
        return (this.utcOffset() - input) % 60 === 0;
      }
      function isDaylightSavingTime() {
        return (this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset());
      }
      function isDaylightSavingTimeShifted() {
        if (typeof this._isDSTShifted !== 'undefined') {
          return this._isDSTShifted;
        }
        var c = {};
        copyConfig(c, this);
        c = prepareConfig(c);
        if (c._a) {
          var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
          this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
          this._isDSTShifted = false;
        }
        return this._isDSTShifted;
      }
      function isLocal() {
        return !this._isUTC;
      }
      function isUtcOffset() {
        return this._isUTC;
      }
      function isUtc() {
        return this._isUTC && this._offset === 0;
      }
      var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;
      var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;
      function create__createDuration(input, key) {
        var duration = input,
            match = null,
            sign,
            ret,
            diffRes;
        if (isDuration(input)) {
          duration = {
            ms: input._milliseconds,
            d: input._days,
            M: input._months
          };
        } else if (typeof input === 'number') {
          duration = {};
          if (key) {
            duration[key] = input;
          } else {
            duration.milliseconds = input;
          }
        } else if (!!(match = aspNetRegex.exec(input))) {
          sign = (match[1] === '-') ? -1 : 1;
          duration = {
            y: 0,
            d: toInt(match[DATE]) * sign,
            h: toInt(match[HOUR]) * sign,
            m: toInt(match[MINUTE]) * sign,
            s: toInt(match[SECOND]) * sign,
            ms: toInt(match[MILLISECOND]) * sign
          };
        } else if (!!(match = create__isoRegex.exec(input))) {
          sign = (match[1] === '-') ? -1 : 1;
          duration = {
            y: parseIso(match[2], sign),
            M: parseIso(match[3], sign),
            d: parseIso(match[4], sign),
            h: parseIso(match[5], sign),
            m: parseIso(match[6], sign),
            s: parseIso(match[7], sign),
            w: parseIso(match[8], sign)
          };
        } else if (duration == null) {
          duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
          diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));
          duration = {};
          duration.ms = diffRes.milliseconds;
          duration.M = diffRes.months;
        }
        ret = new Duration(duration);
        if (isDuration(input) && hasOwnProp(input, '_locale')) {
          ret._locale = input._locale;
        }
        return ret;
      }
      create__createDuration.fn = Duration.prototype;
      function parseIso(inp, sign) {
        var res = inp && parseFloat(inp.replace(',', '.'));
        return (isNaN(res) ? 0 : res) * sign;
      }
      function positiveMomentsDifference(base, other) {
        var res = {
          milliseconds: 0,
          months: 0
        };
        res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
          --res.months;
        }
        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));
        return res;
      }
      function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
          res = positiveMomentsDifference(base, other);
        } else {
          res = positiveMomentsDifference(other, base);
          res.milliseconds = -res.milliseconds;
          res.months = -res.months;
        }
        return res;
      }
      function createAdder(direction, name) {
        return function(val, period) {
          var dur,
              tmp;
          if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
            tmp = val;
            val = period;
            period = tmp;
          }
          val = typeof val === 'string' ? +val : val;
          dur = create__createDuration(val, period);
          add_subtract__addSubtract(this, dur, direction);
          return this;
        };
      }
      function add_subtract__addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;
        if (milliseconds) {
          mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
          get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
          setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
          utils_hooks__hooks.updateOffset(mom, days || months);
        }
      }
      var add_subtract__add = createAdder(1, 'add');
      var add_subtract__subtract = createAdder(-1, 'subtract');
      function moment_calendar__calendar(time, formats) {
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
      }
      function clone() {
        return new Moment(this);
      }
      function isAfter(input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
          input = isMoment(input) ? input : local__createLocal(input);
          return +this > +input;
        } else {
          inputMs = isMoment(input) ? +input : +local__createLocal(input);
          return inputMs < +this.clone().startOf(units);
        }
      }
      function isBefore(input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
          input = isMoment(input) ? input : local__createLocal(input);
          return +this < +input;
        } else {
          inputMs = isMoment(input) ? +input : +local__createLocal(input);
          return +this.clone().endOf(units) < inputMs;
        }
      }
      function isBetween(from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
      }
      function isSame(input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
          input = isMoment(input) ? input : local__createLocal(input);
          return +this === +input;
        } else {
          inputMs = +local__createLocal(input);
          return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
      }
      function diff(input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta,
            output;
        units = normalizeUnits(units);
        if (units === 'year' || units === 'month' || units === 'quarter') {
          output = monthDiff(this, that);
          if (units === 'quarter') {
            output = output / 3;
          } else if (units === 'year') {
            output = output / 12;
          }
        } else {
          delta = this - that;
          output = units === 'second' ? delta / 1e3 : units === 'minute' ? delta / 6e4 : units === 'hour' ? delta / 36e5 : units === 'day' ? (delta - zoneDelta) / 864e5 : units === 'week' ? (delta - zoneDelta) / 6048e5 : delta;
        }
        return asFloat ? output : absFloor(output);
      }
      function monthDiff(a, b) {
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2,
            adjust;
        if (b - anchor < 0) {
          anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
          adjust = (b - anchor) / (anchor - anchor2);
        } else {
          anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
          adjust = (b - anchor) / (anchor2 - anchor);
        }
        return -(wholeMonthDiff + adjust);
      }
      utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
      function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
      }
      function moment_format__toISOString() {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
          if ('function' === typeof Date.prototype.toISOString) {
            return this.toDate().toISOString();
          } else {
            return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
          }
        } else {
          return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
      }
      function format(inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
      }
      function from(time, withoutSuffix) {
        if (!this.isValid()) {
          return this.localeData().invalidDate();
        }
        return create__createDuration({
          to: this,
          from: time
        }).locale(this.locale()).humanize(!withoutSuffix);
      }
      function fromNow(withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
      }
      function to(time, withoutSuffix) {
        if (!this.isValid()) {
          return this.localeData().invalidDate();
        }
        return create__createDuration({
          from: this,
          to: time
        }).locale(this.locale()).humanize(!withoutSuffix);
      }
      function toNow(withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
      }
      function locale(key) {
        var newLocaleData;
        if (key === undefined) {
          return this._locale._abbr;
        } else {
          newLocaleData = locale_locales__getLocale(key);
          if (newLocaleData != null) {
            this._locale = newLocaleData;
          }
          return this;
        }
      }
      var lang = deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.', function(key) {
        if (key === undefined) {
          return this.localeData();
        } else {
          return this.locale(key);
        }
      });
      function localeData() {
        return this._locale;
      }
      function startOf(units) {
        units = normalizeUnits(units);
        switch (units) {
          case 'year':
            this.month(0);
          case 'quarter':
          case 'month':
            this.date(1);
          case 'week':
          case 'isoWeek':
          case 'day':
            this.hours(0);
          case 'hour':
            this.minutes(0);
          case 'minute':
            this.seconds(0);
          case 'second':
            this.milliseconds(0);
        }
        if (units === 'week') {
          this.weekday(0);
        }
        if (units === 'isoWeek') {
          this.isoWeekday(1);
        }
        if (units === 'quarter') {
          this.month(Math.floor(this.month() / 3) * 3);
        }
        return this;
      }
      function endOf(units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
          return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
      }
      function to_type__valueOf() {
        return +this._d - ((this._offset || 0) * 60000);
      }
      function unix() {
        return Math.floor(+this / 1000);
      }
      function toDate() {
        return this._offset ? new Date(+this) : this._d;
      }
      function toArray() {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
      }
      function toObject() {
        var m = this;
        return {
          years: m.year(),
          months: m.month(),
          date: m.date(),
          hours: m.hours(),
          minutes: m.minutes(),
          seconds: m.seconds(),
          milliseconds: m.milliseconds()
        };
      }
      function moment_valid__isValid() {
        return valid__isValid(this);
      }
      function parsingFlags() {
        return extend({}, getParsingFlags(this));
      }
      function invalidAt() {
        return getParsingFlags(this).overflow;
      }
      addFormatToken(0, ['gg', 2], 0, function() {
        return this.weekYear() % 100;
      });
      addFormatToken(0, ['GG', 2], 0, function() {
        return this.isoWeekYear() % 100;
      });
      function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
      }
      addWeekYearFormatToken('gggg', 'weekYear');
      addWeekYearFormatToken('ggggg', 'weekYear');
      addWeekYearFormatToken('GGGG', 'isoWeekYear');
      addWeekYearFormatToken('GGGGG', 'isoWeekYear');
      addUnitAlias('weekYear', 'gg');
      addUnitAlias('isoWeekYear', 'GG');
      addRegexToken('G', matchSigned);
      addRegexToken('g', matchSigned);
      addRegexToken('GG', match1to2, match2);
      addRegexToken('gg', match1to2, match2);
      addRegexToken('GGGG', match1to4, match4);
      addRegexToken('gggg', match1to4, match4);
      addRegexToken('GGGGG', match1to6, match6);
      addRegexToken('ggggg', match1to6, match6);
      addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function(input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
      });
      addWeekParseToken(['gg', 'GG'], function(input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
      });
      function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
      }
      function getSetWeekYear(input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
      }
      function getSetISOWeekYear(input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
      }
      function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
      }
      function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
      }
      addFormatToken('Q', 0, 0, 'quarter');
      addUnitAlias('quarter', 'Q');
      addRegexToken('Q', match1);
      addParseToken('Q', function(input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
      });
      function getSetQuarter(input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
      }
      addFormatToken('D', ['DD', 2], 'Do', 'date');
      addUnitAlias('date', 'D');
      addRegexToken('D', match1to2);
      addRegexToken('DD', match1to2, match2);
      addRegexToken('Do', function(isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
      });
      addParseToken(['D', 'DD'], DATE);
      addParseToken('Do', function(input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
      });
      var getSetDayOfMonth = makeGetSet('Date', true);
      addFormatToken('d', 0, 'do', 'day');
      addFormatToken('dd', 0, 0, function(format) {
        return this.localeData().weekdaysMin(this, format);
      });
      addFormatToken('ddd', 0, 0, function(format) {
        return this.localeData().weekdaysShort(this, format);
      });
      addFormatToken('dddd', 0, 0, function(format) {
        return this.localeData().weekdays(this, format);
      });
      addFormatToken('e', 0, 0, 'weekday');
      addFormatToken('E', 0, 0, 'isoWeekday');
      addUnitAlias('day', 'd');
      addUnitAlias('weekday', 'e');
      addUnitAlias('isoWeekday', 'E');
      addRegexToken('d', match1to2);
      addRegexToken('e', match1to2);
      addRegexToken('E', match1to2);
      addRegexToken('dd', matchWord);
      addRegexToken('ddd', matchWord);
      addRegexToken('dddd', matchWord);
      addWeekParseToken(['dd', 'ddd', 'dddd'], function(input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        if (weekday != null) {
          week.d = weekday;
        } else {
          getParsingFlags(config).invalidWeekday = input;
        }
      });
      addWeekParseToken(['d', 'e', 'E'], function(input, week, config, token) {
        week[token] = toInt(input);
      });
      function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
          return input;
        }
        if (!isNaN(input)) {
          return parseInt(input, 10);
        }
        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
          return input;
        }
        return null;
      }
      var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
      function localeWeekdays(m) {
        return this._weekdays[m.day()];
      }
      var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
      function localeWeekdaysShort(m) {
        return this._weekdaysShort[m.day()];
      }
      var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
      function localeWeekdaysMin(m) {
        return this._weekdaysMin[m.day()];
      }
      function localeWeekdaysParse(weekdayName) {
        var i,
            mom,
            regex;
        this._weekdaysParse = this._weekdaysParse || [];
        for (i = 0; i < 7; i++) {
          if (!this._weekdaysParse[i]) {
            mom = local__createLocal([2000, 1]).day(i);
            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
          }
          if (this._weekdaysParse[i].test(weekdayName)) {
            return i;
          }
        }
      }
      function getSetDayOfWeek(input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
          input = parseWeekday(input, this.localeData());
          return this.add(input - day, 'd');
        } else {
          return day;
        }
      }
      function getSetLocaleDayOfWeek(input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
      }
      function getSetISODayOfWeek(input) {
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
      }
      addFormatToken('H', ['HH', 2], 0, 'hour');
      addFormatToken('h', ['hh', 2], 0, function() {
        return this.hours() % 12 || 12;
      });
      function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function() {
          return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
      }
      meridiem('a', true);
      meridiem('A', false);
      addUnitAlias('hour', 'h');
      function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
      }
      addRegexToken('a', matchMeridiem);
      addRegexToken('A', matchMeridiem);
      addRegexToken('H', match1to2);
      addRegexToken('h', match1to2);
      addRegexToken('HH', match1to2, match2);
      addRegexToken('hh', match1to2, match2);
      addParseToken(['H', 'HH'], HOUR);
      addParseToken(['a', 'A'], function(input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
      });
      addParseToken(['h', 'hh'], function(input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
      });
      function localeIsPM(input) {
        return ((input + '').toLowerCase().charAt(0) === 'p');
      }
      var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
      function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
          return isLower ? 'pm' : 'PM';
        } else {
          return isLower ? 'am' : 'AM';
        }
      }
      var getSetHour = makeGetSet('Hours', true);
      addFormatToken('m', ['mm', 2], 0, 'minute');
      addUnitAlias('minute', 'm');
      addRegexToken('m', match1to2);
      addRegexToken('mm', match1to2, match2);
      addParseToken(['m', 'mm'], MINUTE);
      var getSetMinute = makeGetSet('Minutes', false);
      addFormatToken('s', ['ss', 2], 0, 'second');
      addUnitAlias('second', 's');
      addRegexToken('s', match1to2);
      addRegexToken('ss', match1to2, match2);
      addParseToken(['s', 'ss'], SECOND);
      var getSetSecond = makeGetSet('Seconds', false);
      addFormatToken('S', 0, 0, function() {
        return ~~(this.millisecond() / 100);
      });
      addFormatToken(0, ['SS', 2], 0, function() {
        return ~~(this.millisecond() / 10);
      });
      addFormatToken(0, ['SSS', 3], 0, 'millisecond');
      addFormatToken(0, ['SSSS', 4], 0, function() {
        return this.millisecond() * 10;
      });
      addFormatToken(0, ['SSSSS', 5], 0, function() {
        return this.millisecond() * 100;
      });
      addFormatToken(0, ['SSSSSS', 6], 0, function() {
        return this.millisecond() * 1000;
      });
      addFormatToken(0, ['SSSSSSS', 7], 0, function() {
        return this.millisecond() * 10000;
      });
      addFormatToken(0, ['SSSSSSSS', 8], 0, function() {
        return this.millisecond() * 100000;
      });
      addFormatToken(0, ['SSSSSSSSS', 9], 0, function() {
        return this.millisecond() * 1000000;
      });
      addUnitAlias('millisecond', 'ms');
      addRegexToken('S', match1to3, match1);
      addRegexToken('SS', match1to3, match2);
      addRegexToken('SSS', match1to3, match3);
      var token;
      for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
      }
      function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
      }
      for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
      }
      var getSetMillisecond = makeGetSet('Milliseconds', false);
      addFormatToken('z', 0, 0, 'zoneAbbr');
      addFormatToken('zz', 0, 0, 'zoneName');
      function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
      }
      function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
      }
      var momentPrototype__proto = Moment.prototype;
      momentPrototype__proto.add = add_subtract__add;
      momentPrototype__proto.calendar = moment_calendar__calendar;
      momentPrototype__proto.clone = clone;
      momentPrototype__proto.diff = diff;
      momentPrototype__proto.endOf = endOf;
      momentPrototype__proto.format = format;
      momentPrototype__proto.from = from;
      momentPrototype__proto.fromNow = fromNow;
      momentPrototype__proto.to = to;
      momentPrototype__proto.toNow = toNow;
      momentPrototype__proto.get = getSet;
      momentPrototype__proto.invalidAt = invalidAt;
      momentPrototype__proto.isAfter = isAfter;
      momentPrototype__proto.isBefore = isBefore;
      momentPrototype__proto.isBetween = isBetween;
      momentPrototype__proto.isSame = isSame;
      momentPrototype__proto.isValid = moment_valid__isValid;
      momentPrototype__proto.lang = lang;
      momentPrototype__proto.locale = locale;
      momentPrototype__proto.localeData = localeData;
      momentPrototype__proto.max = prototypeMax;
      momentPrototype__proto.min = prototypeMin;
      momentPrototype__proto.parsingFlags = parsingFlags;
      momentPrototype__proto.set = getSet;
      momentPrototype__proto.startOf = startOf;
      momentPrototype__proto.subtract = add_subtract__subtract;
      momentPrototype__proto.toArray = toArray;
      momentPrototype__proto.toObject = toObject;
      momentPrototype__proto.toDate = toDate;
      momentPrototype__proto.toISOString = moment_format__toISOString;
      momentPrototype__proto.toJSON = moment_format__toISOString;
      momentPrototype__proto.toString = toString;
      momentPrototype__proto.unix = unix;
      momentPrototype__proto.valueOf = to_type__valueOf;
      momentPrototype__proto.year = getSetYear;
      momentPrototype__proto.isLeapYear = getIsLeapYear;
      momentPrototype__proto.weekYear = getSetWeekYear;
      momentPrototype__proto.isoWeekYear = getSetISOWeekYear;
      momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;
      momentPrototype__proto.month = getSetMonth;
      momentPrototype__proto.daysInMonth = getDaysInMonth;
      momentPrototype__proto.week = momentPrototype__proto.weeks = getSetWeek;
      momentPrototype__proto.isoWeek = momentPrototype__proto.isoWeeks = getSetISOWeek;
      momentPrototype__proto.weeksInYear = getWeeksInYear;
      momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;
      momentPrototype__proto.date = getSetDayOfMonth;
      momentPrototype__proto.day = momentPrototype__proto.days = getSetDayOfWeek;
      momentPrototype__proto.weekday = getSetLocaleDayOfWeek;
      momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
      momentPrototype__proto.dayOfYear = getSetDayOfYear;
      momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;
      momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;
      momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;
      momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;
      momentPrototype__proto.utcOffset = getSetOffset;
      momentPrototype__proto.utc = setOffsetToUTC;
      momentPrototype__proto.local = setOffsetToLocal;
      momentPrototype__proto.parseZone = setOffsetToParsedOffset;
      momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
      momentPrototype__proto.isDST = isDaylightSavingTime;
      momentPrototype__proto.isDSTShifted = isDaylightSavingTimeShifted;
      momentPrototype__proto.isLocal = isLocal;
      momentPrototype__proto.isUtcOffset = isUtcOffset;
      momentPrototype__proto.isUtc = isUtc;
      momentPrototype__proto.isUTC = isUtc;
      momentPrototype__proto.zoneAbbr = getZoneAbbr;
      momentPrototype__proto.zoneName = getZoneName;
      momentPrototype__proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
      momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
      momentPrototype__proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
      momentPrototype__proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);
      var momentPrototype = momentPrototype__proto;
      function moment__createUnix(input) {
        return local__createLocal(input * 1000);
      }
      function moment__createInZone() {
        return local__createLocal.apply(null, arguments).parseZone();
      }
      var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L'
      };
      function locale_calendar__calendar(key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
      }
      var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A'
      };
      function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];
        if (format || !formatUpper) {
          return format;
        }
        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function(val) {
          return val.slice(1);
        });
        return this._longDateFormat[key];
      }
      var defaultInvalidDate = 'Invalid date';
      function invalidDate() {
        return this._invalidDate;
      }
      var defaultOrdinal = '%d';
      var defaultOrdinalParse = /\d{1,2}/;
      function ordinal(number) {
        return this._ordinal.replace('%d', number);
      }
      function preParsePostFormat(string) {
        return string;
      }
      var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
      };
      function relative__relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
      }
      function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
      }
      function locale_set__set(config) {
        var prop,
            i;
        for (i in config) {
          prop = config[i];
          if (typeof prop === 'function') {
            this[i] = prop;
          } else {
            this['_' + i] = prop;
          }
        }
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
      }
      var prototype__proto = Locale.prototype;
      prototype__proto._calendar = defaultCalendar;
      prototype__proto.calendar = locale_calendar__calendar;
      prototype__proto._longDateFormat = defaultLongDateFormat;
      prototype__proto.longDateFormat = longDateFormat;
      prototype__proto._invalidDate = defaultInvalidDate;
      prototype__proto.invalidDate = invalidDate;
      prototype__proto._ordinal = defaultOrdinal;
      prototype__proto.ordinal = ordinal;
      prototype__proto._ordinalParse = defaultOrdinalParse;
      prototype__proto.preparse = preParsePostFormat;
      prototype__proto.postformat = preParsePostFormat;
      prototype__proto._relativeTime = defaultRelativeTime;
      prototype__proto.relativeTime = relative__relativeTime;
      prototype__proto.pastFuture = pastFuture;
      prototype__proto.set = locale_set__set;
      prototype__proto.months = localeMonths;
      prototype__proto._months = defaultLocaleMonths;
      prototype__proto.monthsShort = localeMonthsShort;
      prototype__proto._monthsShort = defaultLocaleMonthsShort;
      prototype__proto.monthsParse = localeMonthsParse;
      prototype__proto.week = localeWeek;
      prototype__proto._week = defaultLocaleWeek;
      prototype__proto.firstDayOfYear = localeFirstDayOfYear;
      prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;
      prototype__proto.weekdays = localeWeekdays;
      prototype__proto._weekdays = defaultLocaleWeekdays;
      prototype__proto.weekdaysMin = localeWeekdaysMin;
      prototype__proto._weekdaysMin = defaultLocaleWeekdaysMin;
      prototype__proto.weekdaysShort = localeWeekdaysShort;
      prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
      prototype__proto.weekdaysParse = localeWeekdaysParse;
      prototype__proto.isPM = localeIsPM;
      prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
      prototype__proto.meridiem = localeMeridiem;
      function lists__get(format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
      }
      function list(format, index, field, count, setter) {
        if (typeof format === 'number') {
          index = format;
          format = undefined;
        }
        format = format || '';
        if (index != null) {
          return lists__get(format, index, field, setter);
        }
        var i;
        var out = [];
        for (i = 0; i < count; i++) {
          out[i] = lists__get(format, i, field, setter);
        }
        return out;
      }
      function lists__listMonths(format, index) {
        return list(format, index, 'months', 12, 'month');
      }
      function lists__listMonthsShort(format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
      }
      function lists__listWeekdays(format, index) {
        return list(format, index, 'weekdays', 7, 'day');
      }
      function lists__listWeekdaysShort(format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
      }
      function lists__listWeekdaysMin(format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
      }
      locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(number) {
          var b = number % 10,
              output = (toInt(number % 100 / 10) === 1) ? 'th' : (b === 1) ? 'st' : (b === 2) ? 'nd' : (b === 3) ? 'rd' : 'th';
          return number + output;
        }
      });
      utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
      utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);
      var mathAbs = Math.abs;
      function duration_abs__abs() {
        var data = this._data;
        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);
        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);
        return this;
      }
      function duration_add_subtract__addSubtract(duration, input, value, direction) {
        var other = create__createDuration(input, value);
        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;
        return duration._bubble();
      }
      function duration_add_subtract__add(input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
      }
      function duration_add_subtract__subtract(input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
      }
      function absCeil(number) {
        if (number < 0) {
          return Math.floor(number);
        } else {
          return Math.ceil(number);
        }
      }
      function bubble() {
        var milliseconds = this._milliseconds;
        var days = this._days;
        var months = this._months;
        var data = this._data;
        var seconds,
            minutes,
            hours,
            years,
            monthsFromDays;
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) || (milliseconds <= 0 && days <= 0 && months <= 0))) {
          milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
          days = 0;
          months = 0;
        }
        data.milliseconds = milliseconds % 1000;
        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;
        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;
        hours = absFloor(minutes / 60);
        data.hours = hours % 24;
        days += absFloor(hours / 24);
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));
        years = absFloor(months / 12);
        months %= 12;
        data.days = days;
        data.months = months;
        data.years = years;
        return this;
      }
      function daysToMonths(days) {
        return days * 4800 / 146097;
      }
      function monthsToDays(months) {
        return months * 146097 / 4800;
      }
      function as(units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;
        units = normalizeUnits(units);
        if (units === 'month' || units === 'year') {
          days = this._days + milliseconds / 864e5;
          months = this._months + daysToMonths(days);
          return units === 'month' ? months : months / 12;
        } else {
          days = this._days + Math.round(monthsToDays(this._months));
          switch (units) {
            case 'week':
              return days / 7 + milliseconds / 6048e5;
            case 'day':
              return days + milliseconds / 864e5;
            case 'hour':
              return days * 24 + milliseconds / 36e5;
            case 'minute':
              return days * 1440 + milliseconds / 6e4;
            case 'second':
              return days * 86400 + milliseconds / 1000;
            case 'millisecond':
              return Math.floor(days * 864e5) + milliseconds;
            default:
              throw new Error('Unknown unit ' + units);
          }
        }
      }
      function duration_as__valueOf() {
        return (this._milliseconds + this._days * 864e5 + (this._months % 12) * 2592e6 + toInt(this._months / 12) * 31536e6);
      }
      function makeAs(alias) {
        return function() {
          return this.as(alias);
        };
      }
      var asMilliseconds = makeAs('ms');
      var asSeconds = makeAs('s');
      var asMinutes = makeAs('m');
      var asHours = makeAs('h');
      var asDays = makeAs('d');
      var asWeeks = makeAs('w');
      var asMonths = makeAs('M');
      var asYears = makeAs('y');
      function duration_get__get(units) {
        units = normalizeUnits(units);
        return this[units + 's']();
      }
      function makeGetter(name) {
        return function() {
          return this._data[name];
        };
      }
      var milliseconds = makeGetter('milliseconds');
      var seconds = makeGetter('seconds');
      var minutes = makeGetter('minutes');
      var hours = makeGetter('hours');
      var days = makeGetter('days');
      var months = makeGetter('months');
      var years = makeGetter('years');
      function weeks() {
        return absFloor(this.days() / 7);
      }
      var round = Math.round;
      var thresholds = {
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        M: 11
      };
      function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
      }
      function duration_humanize__relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds = round(duration.as('s'));
        var minutes = round(duration.as('m'));
        var hours = round(duration.as('h'));
        var days = round(duration.as('d'));
        var months = round(duration.as('M'));
        var years = round(duration.as('y'));
        var a = seconds < thresholds.s && ['s', seconds] || minutes === 1 && ['m'] || minutes < thresholds.m && ['mm', minutes] || hours === 1 && ['h'] || hours < thresholds.h && ['hh', hours] || days === 1 && ['d'] || days < thresholds.d && ['dd', days] || months === 1 && ['M'] || months < thresholds.M && ['MM', months] || years === 1 && ['y'] || ['yy', years];
        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
      }
      function duration_humanize__getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
          return false;
        }
        if (limit === undefined) {
          return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
      }
      function humanize(withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);
        if (withSuffix) {
          output = locale.pastFuture(+this, output);
        }
        return locale.postformat(output);
      }
      var iso_string__abs = Math.abs;
      function iso_string__toISOString() {
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days = iso_string__abs(this._days);
        var months = iso_string__abs(this._months);
        var minutes,
            hours,
            years;
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;
        years = absFloor(months / 12);
        months %= 12;
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();
        if (!total) {
          return 'P0D';
        }
        return (total < 0 ? '-' : '') + 'P' + (Y ? Y + 'Y' : '') + (M ? M + 'M' : '') + (D ? D + 'D' : '') + ((h || m || s) ? 'T' : '') + (h ? h + 'H' : '') + (m ? m + 'M' : '') + (s ? s + 'S' : '');
      }
      var duration_prototype__proto = Duration.prototype;
      duration_prototype__proto.abs = duration_abs__abs;
      duration_prototype__proto.add = duration_add_subtract__add;
      duration_prototype__proto.subtract = duration_add_subtract__subtract;
      duration_prototype__proto.as = as;
      duration_prototype__proto.asMilliseconds = asMilliseconds;
      duration_prototype__proto.asSeconds = asSeconds;
      duration_prototype__proto.asMinutes = asMinutes;
      duration_prototype__proto.asHours = asHours;
      duration_prototype__proto.asDays = asDays;
      duration_prototype__proto.asWeeks = asWeeks;
      duration_prototype__proto.asMonths = asMonths;
      duration_prototype__proto.asYears = asYears;
      duration_prototype__proto.valueOf = duration_as__valueOf;
      duration_prototype__proto._bubble = bubble;
      duration_prototype__proto.get = duration_get__get;
      duration_prototype__proto.milliseconds = milliseconds;
      duration_prototype__proto.seconds = seconds;
      duration_prototype__proto.minutes = minutes;
      duration_prototype__proto.hours = hours;
      duration_prototype__proto.days = days;
      duration_prototype__proto.weeks = weeks;
      duration_prototype__proto.months = months;
      duration_prototype__proto.years = years;
      duration_prototype__proto.humanize = humanize;
      duration_prototype__proto.toISOString = iso_string__toISOString;
      duration_prototype__proto.toString = iso_string__toISOString;
      duration_prototype__proto.toJSON = iso_string__toISOString;
      duration_prototype__proto.locale = locale;
      duration_prototype__proto.localeData = localeData;
      duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
      duration_prototype__proto.lang = lang;
      addFormatToken('X', 0, 0, 'unix');
      addFormatToken('x', 0, 0, 'valueOf');
      addRegexToken('x', matchSigned);
      addRegexToken('X', matchTimestamp);
      addParseToken('X', function(input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
      });
      addParseToken('x', function(input, array, config) {
        config._d = new Date(toInt(input));
      });
      utils_hooks__hooks.version = '2.10.6';
      setHookCallback(local__createLocal);
      utils_hooks__hooks.fn = momentPrototype;
      utils_hooks__hooks.min = min;
      utils_hooks__hooks.max = max;
      utils_hooks__hooks.utc = create_utc__createUTC;
      utils_hooks__hooks.unix = moment__createUnix;
      utils_hooks__hooks.months = lists__listMonths;
      utils_hooks__hooks.isDate = isDate;
      utils_hooks__hooks.locale = locale_locales__getSetGlobalLocale;
      utils_hooks__hooks.invalid = valid__createInvalid;
      utils_hooks__hooks.duration = create__createDuration;
      utils_hooks__hooks.isMoment = isMoment;
      utils_hooks__hooks.weekdays = lists__listWeekdays;
      utils_hooks__hooks.parseZone = moment__createInZone;
      utils_hooks__hooks.localeData = locale_locales__getLocale;
      utils_hooks__hooks.isDuration = isDuration;
      utils_hooks__hooks.monthsShort = lists__listMonthsShort;
      utils_hooks__hooks.weekdaysMin = lists__listWeekdaysMin;
      utils_hooks__hooks.defineLocale = defineLocale;
      utils_hooks__hooks.weekdaysShort = lists__listWeekdaysShort;
      utils_hooks__hooks.normalizeUnits = normalizeUnits;
      utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
      var _moment = utils_hooks__hooks;
      return _moment;
    }));
  }).call(System.global);
  return System.get("@@global-helpers").retrieveGlobal(__module.id, false);
});

System.register("npm:core-js@0.9.18/library/modules/$", ["npm:core-js@0.9.18/library/modules/$.fw"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var global = typeof self != 'undefined' ? self : Function('return this')(),
      core = {},
      defineProperty = Object.defineProperty,
      hasOwnProperty = {}.hasOwnProperty,
      ceil = Math.ceil,
      floor = Math.floor,
      max = Math.max,
      min = Math.min;
  var DESC = !!function() {
    try {
      return defineProperty({}, 'a', {get: function() {
          return 2;
        }}).a == 2;
    } catch (e) {}
  }();
  var hide = createDefiner(1);
  function toInteger(it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  }
  function desc(bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  }
  function simpleSet(object, key, value) {
    object[key] = value;
    return object;
  }
  function createDefiner(bitmap) {
    return DESC ? function(object, key, value) {
      return $.setDesc(object, key, desc(bitmap, value));
    } : simpleSet;
  }
  function isObject(it) {
    return it !== null && (typeof it == 'object' || typeof it == 'function');
  }
  function isFunction(it) {
    return typeof it == 'function';
  }
  function assertDefined(it) {
    if (it == undefined)
      throw TypeError("Can't call method on  " + it);
    return it;
  }
  var $ = module.exports = require("npm:core-js@0.9.18/library/modules/$.fw")({
    g: global,
    core: core,
    html: global.document && document.documentElement,
    isObject: isObject,
    isFunction: isFunction,
    that: function() {
      return this;
    },
    toInteger: toInteger,
    toLength: function(it) {
      return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0;
    },
    toIndex: function(index, length) {
      index = toInteger(index);
      return index < 0 ? max(index + length, 0) : min(index, length);
    },
    has: function(it, key) {
      return hasOwnProperty.call(it, key);
    },
    create: Object.create,
    getProto: Object.getPrototypeOf,
    DESC: DESC,
    desc: desc,
    getDesc: Object.getOwnPropertyDescriptor,
    setDesc: defineProperty,
    setDescs: Object.defineProperties,
    getKeys: Object.keys,
    getNames: Object.getOwnPropertyNames,
    getSymbols: Object.getOwnPropertySymbols,
    assertDefined: assertDefined,
    ES5Object: Object,
    toObject: function(it) {
      return $.ES5Object(assertDefined(it));
    },
    hide: hide,
    def: createDefiner(0),
    set: global.Symbol ? simpleSet : hide,
    each: [].forEach
  });
  if (typeof __e != 'undefined')
    __e = core;
  if (typeof __g != 'undefined')
    __g = global;
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.wks", ["npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/$.shared", "npm:core-js@0.9.18/library/modules/$.uid"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var global = require("npm:core-js@0.9.18/library/modules/$").g,
      store = require("npm:core-js@0.9.18/library/modules/$.shared")('wks');
  module.exports = function(name) {
    return store[name] || (store[name] = global.Symbol && global.Symbol[name] || require("npm:core-js@0.9.18/library/modules/$.uid").safe('Symbol.' + name));
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.iter", ["npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/$.cof", "npm:core-js@0.9.18/library/modules/$.assert", "npm:core-js@0.9.18/library/modules/$.wks", "npm:core-js@0.9.18/library/modules/$.shared"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("npm:core-js@0.9.18/library/modules/$"),
      cof = require("npm:core-js@0.9.18/library/modules/$.cof"),
      classof = cof.classof,
      assert = require("npm:core-js@0.9.18/library/modules/$.assert"),
      assertObject = assert.obj,
      SYMBOL_ITERATOR = require("npm:core-js@0.9.18/library/modules/$.wks")('iterator'),
      FF_ITERATOR = '@@iterator',
      Iterators = require("npm:core-js@0.9.18/library/modules/$.shared")('iterators'),
      IteratorPrototype = {};
  setIterator(IteratorPrototype, $.that);
  function setIterator(O, value) {
    $.hide(O, SYMBOL_ITERATOR, value);
    if (FF_ITERATOR in [])
      $.hide(O, FF_ITERATOR, value);
  }
  module.exports = {
    BUGGY: 'keys' in [] && !('next' in [].keys()),
    Iterators: Iterators,
    step: function(done, value) {
      return {
        value: value,
        done: !!done
      };
    },
    is: function(it) {
      var O = Object(it),
          Symbol = $.g.Symbol;
      return (Symbol && Symbol.iterator || FF_ITERATOR) in O || SYMBOL_ITERATOR in O || $.has(Iterators, classof(O));
    },
    get: function(it) {
      var Symbol = $.g.Symbol,
          getIter;
      if (it != undefined) {
        getIter = it[Symbol && Symbol.iterator || FF_ITERATOR] || it[SYMBOL_ITERATOR] || Iterators[classof(it)];
      }
      assert($.isFunction(getIter), it, ' is not iterable!');
      return assertObject(getIter.call(it));
    },
    set: setIterator,
    create: function(Constructor, NAME, next, proto) {
      Constructor.prototype = $.create(proto || IteratorPrototype, {next: $.desc(1, next)});
      cof.set(Constructor, NAME + ' Iterator');
    }
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.iter-define", ["npm:core-js@0.9.18/library/modules/$.def", "npm:core-js@0.9.18/library/modules/$.redef", "npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/$.cof", "npm:core-js@0.9.18/library/modules/$.iter", "npm:core-js@0.9.18/library/modules/$.wks"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $def = require("npm:core-js@0.9.18/library/modules/$.def"),
      $redef = require("npm:core-js@0.9.18/library/modules/$.redef"),
      $ = require("npm:core-js@0.9.18/library/modules/$"),
      cof = require("npm:core-js@0.9.18/library/modules/$.cof"),
      $iter = require("npm:core-js@0.9.18/library/modules/$.iter"),
      SYMBOL_ITERATOR = require("npm:core-js@0.9.18/library/modules/$.wks")('iterator'),
      FF_ITERATOR = '@@iterator',
      KEYS = 'keys',
      VALUES = 'values',
      Iterators = $iter.Iterators;
  module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE) {
    $iter.create(Constructor, NAME, next);
    function createMethod(kind) {
      function $$(that) {
        return new Constructor(that, kind);
      }
      switch (kind) {
        case KEYS:
          return function keys() {
            return $$(this);
          };
        case VALUES:
          return function values() {
            return $$(this);
          };
      }
      return function entries() {
        return $$(this);
      };
    }
    var TAG = NAME + ' Iterator',
        proto = Base.prototype,
        _native = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
        _default = _native || createMethod(DEFAULT),
        methods,
        key;
    if (_native) {
      var IteratorPrototype = $.getProto(_default.call(new Base));
      cof.set(IteratorPrototype, TAG, true);
      if ($.FW && $.has(proto, FF_ITERATOR))
        $iter.set(IteratorPrototype, $.that);
    }
    if ($.FW || FORCE)
      $iter.set(proto, _default);
    Iterators[NAME] = _default;
    Iterators[TAG] = $.that;
    if (DEFAULT) {
      methods = {
        keys: IS_SET ? _default : createMethod(KEYS),
        values: DEFAULT == VALUES ? _default : createMethod(VALUES),
        entries: DEFAULT != VALUES ? _default : createMethod('entries')
      };
      if (FORCE)
        for (key in methods) {
          if (!(key in proto))
            $redef(proto, key, methods[key]);
        }
      else
        $def($def.P + $def.F * $iter.BUGGY, NAME, methods);
    }
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/es6.array.iterator", ["npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/$.unscope", "npm:core-js@0.9.18/library/modules/$.uid", "npm:core-js@0.9.18/library/modules/$.iter", "npm:core-js@0.9.18/library/modules/$.iter-define"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$"),
      setUnscope = require("npm:core-js@0.9.18/library/modules/$.unscope"),
      ITER = require("npm:core-js@0.9.18/library/modules/$.uid").safe('iter'),
      $iter = require("npm:core-js@0.9.18/library/modules/$.iter"),
      step = $iter.step,
      Iterators = $iter.Iterators;
  require("npm:core-js@0.9.18/library/modules/$.iter-define")(Array, 'Array', function(iterated, kind) {
    $.set(this, ITER, {
      o: $.toObject(iterated),
      i: 0,
      k: kind
    });
  }, function() {
    var iter = this[ITER],
        O = iter.o,
        kind = iter.k,
        index = iter.i++;
    if (!O || index >= O.length) {
      iter.o = undefined;
      return step(1);
    }
    if (kind == 'keys')
      return step(0, index);
    if (kind == 'values')
      return step(0, O[index]);
    return step(0, [index, O[index]]);
  }, 'values');
  Iterators.Arguments = Iterators.Array;
  setUnscope('keys');
  setUnscope('values');
  setUnscope('entries');
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.for-of", ["npm:core-js@0.9.18/library/modules/$.ctx", "npm:core-js@0.9.18/library/modules/$.iter", "npm:core-js@0.9.18/library/modules/$.iter-call"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var ctx = require("npm:core-js@0.9.18/library/modules/$.ctx"),
      get = require("npm:core-js@0.9.18/library/modules/$.iter").get,
      call = require("npm:core-js@0.9.18/library/modules/$.iter-call");
  module.exports = function(iterable, entries, fn, that) {
    var iterator = get(iterable),
        f = ctx(fn, that, entries ? 2 : 1),
        step;
    while (!(step = iterator.next()).done) {
      if (call(iterator, f, step.value, entries) === false) {
        return call.close(iterator);
      }
    }
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:process@0.11.2", ["npm:process@0.11.2/browser"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("npm:process@0.11.2/browser");
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/es6.object.statics-accept-primitives", ["npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/$.def", "npm:core-js@0.9.18/library/modules/$.get-names"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$"),
      $def = require("npm:core-js@0.9.18/library/modules/$.def"),
      isObject = $.isObject,
      toObject = $.toObject;
  $.each.call(('freeze,seal,preventExtensions,isFrozen,isSealed,isExtensible,' + 'getOwnPropertyDescriptor,getPrototypeOf,keys,getOwnPropertyNames').split(','), function(KEY, ID) {
    var fn = ($.core.Object || {})[KEY] || Object[KEY],
        forced = 0,
        method = {};
    method[KEY] = ID == 0 ? function freeze(it) {
      return isObject(it) ? fn(it) : it;
    } : ID == 1 ? function seal(it) {
      return isObject(it) ? fn(it) : it;
    } : ID == 2 ? function preventExtensions(it) {
      return isObject(it) ? fn(it) : it;
    } : ID == 3 ? function isFrozen(it) {
      return isObject(it) ? fn(it) : true;
    } : ID == 4 ? function isSealed(it) {
      return isObject(it) ? fn(it) : true;
    } : ID == 5 ? function isExtensible(it) {
      return isObject(it) ? fn(it) : false;
    } : ID == 6 ? function getOwnPropertyDescriptor(it, key) {
      return fn(toObject(it), key);
    } : ID == 7 ? function getPrototypeOf(it) {
      return fn(Object($.assertDefined(it)));
    } : ID == 8 ? function keys(it) {
      return fn(toObject(it));
    } : require("npm:core-js@0.9.18/library/modules/$.get-names").get;
    try {
      fn('z');
    } catch (e) {
      forced = 1;
    }
    $def($def.S + $def.F * forced, 'Object', method);
  });
  global.define = __define;
  return module.exports;
});

System.register("npm:punycode@1.3.2", ["npm:punycode@1.3.2/punycode"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("npm:punycode@1.3.2/punycode");
  global.define = __define;
  return module.exports;
});

System.register("npm:querystring@0.2.0/index", ["npm:querystring@0.2.0/decode", "npm:querystring@0.2.0/encode"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  'use strict';
  exports.decode = exports.parse = require("npm:querystring@0.2.0/decode");
  exports.encode = exports.stringify = require("npm:querystring@0.2.0/encode");
  global.define = __define;
  return module.exports;
});

System.register("npm:babel-runtime@5.8.34/core-js/object/get-own-property-descriptor", ["npm:core-js@0.9.18/library/fn/object/get-own-property-descriptor"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": require("npm:core-js@0.9.18/library/fn/object/get-own-property-descriptor"),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:babel-runtime@5.8.34/core-js/object/create", ["npm:core-js@0.9.18/library/fn/object/create"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": require("npm:core-js@0.9.18/library/fn/object/create"),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/fn/object/set-prototype-of", ["npm:core-js@0.9.18/library/modules/es6.object.set-prototype-of", "npm:core-js@0.9.18/library/modules/$"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  require("npm:core-js@0.9.18/library/modules/es6.object.set-prototype-of");
  module.exports = require("npm:core-js@0.9.18/library/modules/$").core.Object.setPrototypeOf;
  global.define = __define;
  return module.exports;
});

System.register("github:moment/moment@2.10.6", ["github:moment/moment@2.10.6/moment"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:moment/moment@2.10.6/moment");
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/fn/object/define-property", ["npm:core-js@0.9.18/library/modules/$"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$");
  module.exports = function defineProperty(it, key, desc) {
    return $.setDesc(it, key, desc);
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.cof", ["npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/$.wks"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var $ = require("npm:core-js@0.9.18/library/modules/$"),
      TAG = require("npm:core-js@0.9.18/library/modules/$.wks")('toStringTag'),
      toString = {}.toString;
  function cof(it) {
    return toString.call(it).slice(8, -1);
  }
  cof.classof = function(it) {
    var O,
        T;
    return it == undefined ? it === undefined ? 'Undefined' : 'Null' : typeof(T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);
  };
  cof.set = function(it, tag, stat) {
    if (it && !$.has(it = stat ? it : it.prototype, TAG))
      $.hide(it, TAG, tag);
  };
  module.exports = cof;
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/es6.string.iterator", ["npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/$.string-at", "npm:core-js@0.9.18/library/modules/$.uid", "npm:core-js@0.9.18/library/modules/$.iter", "npm:core-js@0.9.18/library/modules/$.iter-define"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var set = require("npm:core-js@0.9.18/library/modules/$").set,
      $at = require("npm:core-js@0.9.18/library/modules/$.string-at")(true),
      ITER = require("npm:core-js@0.9.18/library/modules/$.uid").safe('iter'),
      $iter = require("npm:core-js@0.9.18/library/modules/$.iter"),
      step = $iter.step;
  require("npm:core-js@0.9.18/library/modules/$.iter-define")(String, 'String', function(iterated) {
    set(this, ITER, {
      o: String(iterated),
      i: 0
    });
  }, function() {
    var iter = this[ITER],
        O = iter.o,
        index = iter.i,
        point;
    if (index >= O.length)
      return step(1);
    point = $at(O, index);
    iter.i += point.length;
    return step(0, point);
  });
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/web.dom.iterable", ["npm:core-js@0.9.18/library/modules/es6.array.iterator", "npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/$.iter", "npm:core-js@0.9.18/library/modules/$.wks"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  require("npm:core-js@0.9.18/library/modules/es6.array.iterator");
  var $ = require("npm:core-js@0.9.18/library/modules/$"),
      Iterators = require("npm:core-js@0.9.18/library/modules/$.iter").Iterators,
      ITERATOR = require("npm:core-js@0.9.18/library/modules/$.wks")('iterator'),
      ArrayValues = Iterators.Array,
      NL = $.g.NodeList,
      HTC = $.g.HTMLCollection,
      NLProto = NL && NL.prototype,
      HTCProto = HTC && HTC.prototype;
  if ($.FW) {
    if (NL && !(ITERATOR in NLProto))
      $.hide(NLProto, ITERATOR, ArrayValues);
    if (HTC && !(ITERATOR in HTCProto))
      $.hide(HTCProto, ITERATOR, ArrayValues);
  }
  Iterators.NodeList = Iterators.HTMLCollection = ArrayValues;
  global.define = __define;
  return module.exports;
});

System.register("github:jspm/nodelibs-process@0.1.2/index", ["npm:process@0.11.2"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = System._nodeRequire ? process : require("npm:process@0.11.2");
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/fn/object/keys", ["npm:core-js@0.9.18/library/modules/es6.object.statics-accept-primitives", "npm:core-js@0.9.18/library/modules/$"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  require("npm:core-js@0.9.18/library/modules/es6.object.statics-accept-primitives");
  module.exports = require("npm:core-js@0.9.18/library/modules/$").core.Object.keys;
  global.define = __define;
  return module.exports;
});

System.register("npm:querystring@0.2.0", ["npm:querystring@0.2.0/index"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("npm:querystring@0.2.0/index");
  global.define = __define;
  return module.exports;
});

System.register("npm:babel-runtime@5.8.34/helpers/get", ["npm:babel-runtime@5.8.34/core-js/object/get-own-property-descriptor"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var _Object$getOwnPropertyDescriptor = require("npm:babel-runtime@5.8.34/core-js/object/get-own-property-descriptor")["default"];
  exports["default"] = function get(_x, _x2, _x3) {
    var _again = true;
    _function: while (_again) {
      var object = _x,
          property = _x2,
          receiver = _x3;
      _again = false;
      if (object === null)
        object = Function.prototype;
      var desc = _Object$getOwnPropertyDescriptor(object, property);
      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);
        if (parent === null) {
          return undefined;
        } else {
          _x = parent;
          _x2 = property;
          _x3 = receiver;
          _again = true;
          desc = parent = undefined;
          continue _function;
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
    }
  };
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

System.register("npm:babel-runtime@5.8.34/core-js/object/set-prototype-of", ["npm:core-js@0.9.18/library/fn/object/set-prototype-of"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": require("npm:core-js@0.9.18/library/fn/object/set-prototype-of"),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:babel-runtime@5.8.34/core-js/object/define-property", ["npm:core-js@0.9.18/library/fn/object/define-property"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": require("npm:core-js@0.9.18/library/fn/object/define-property"),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/es6.object.to-string", ["npm:core-js@0.9.18/library/modules/$.cof", "npm:core-js@0.9.18/library/modules/$.wks", "npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/$.redef"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var cof = require("npm:core-js@0.9.18/library/modules/$.cof"),
      tmp = {};
  tmp[require("npm:core-js@0.9.18/library/modules/$.wks")('toStringTag')] = 'z';
  if (require("npm:core-js@0.9.18/library/modules/$").FW && cof(tmp) != 'z') {
    require("npm:core-js@0.9.18/library/modules/$.redef")(Object.prototype, 'toString', function toString() {
      return '[object ' + cof.classof(this) + ']';
    }, true);
  }
  global.define = __define;
  return module.exports;
});

System.register("github:jspm/nodelibs-process@0.1.2", ["github:jspm/nodelibs-process@0.1.2/index"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:jspm/nodelibs-process@0.1.2/index");
  global.define = __define;
  return module.exports;
});

System.register("npm:babel-runtime@5.8.34/core-js/object/keys", ["npm:core-js@0.9.18/library/fn/object/keys"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": require("npm:core-js@0.9.18/library/fn/object/keys"),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

System.register("npm:url@0.10.3/url", ["npm:punycode@1.3.2", "npm:querystring@0.2.0"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var punycode = require("npm:punycode@1.3.2");
  exports.parse = urlParse;
  exports.resolve = urlResolve;
  exports.resolveObject = urlResolveObject;
  exports.format = urlFormat;
  exports.Url = Url;
  function Url() {
    this.protocol = null;
    this.slashes = null;
    this.auth = null;
    this.host = null;
    this.port = null;
    this.hostname = null;
    this.hash = null;
    this.search = null;
    this.query = null;
    this.pathname = null;
    this.path = null;
    this.href = null;
  }
  var protocolPattern = /^([a-z0-9.+-]+:)/i,
      portPattern = /:[0-9]*$/,
      delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
      unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
      autoEscape = ['\''].concat(unwise),
      nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
      hostEndingChars = ['/', '?', '#'],
      hostnameMaxLen = 255,
      hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
      hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
      unsafeProtocol = {
        'javascript': true,
        'javascript:': true
      },
      hostlessProtocol = {
        'javascript': true,
        'javascript:': true
      },
      slashedProtocol = {
        'http': true,
        'https': true,
        'ftp': true,
        'gopher': true,
        'file': true,
        'http:': true,
        'https:': true,
        'ftp:': true,
        'gopher:': true,
        'file:': true
      },
      querystring = require("npm:querystring@0.2.0");
  function urlParse(url, parseQueryString, slashesDenoteHost) {
    if (url && isObject(url) && url instanceof Url)
      return url;
    var u = new Url;
    u.parse(url, parseQueryString, slashesDenoteHost);
    return u;
  }
  Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
    if (!isString(url)) {
      throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
    }
    var rest = url;
    rest = rest.trim();
    var proto = protocolPattern.exec(rest);
    if (proto) {
      proto = proto[0];
      var lowerProto = proto.toLowerCase();
      this.protocol = lowerProto;
      rest = rest.substr(proto.length);
    }
    if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
      var slashes = rest.substr(0, 2) === '//';
      if (slashes && !(proto && hostlessProtocol[proto])) {
        rest = rest.substr(2);
        this.slashes = true;
      }
    }
    if (!hostlessProtocol[proto] && (slashes || (proto && !slashedProtocol[proto]))) {
      var hostEnd = -1;
      for (var i = 0; i < hostEndingChars.length; i++) {
        var hec = rest.indexOf(hostEndingChars[i]);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
          hostEnd = hec;
      }
      var auth,
          atSign;
      if (hostEnd === -1) {
        atSign = rest.lastIndexOf('@');
      } else {
        atSign = rest.lastIndexOf('@', hostEnd);
      }
      if (atSign !== -1) {
        auth = rest.slice(0, atSign);
        rest = rest.slice(atSign + 1);
        this.auth = decodeURIComponent(auth);
      }
      hostEnd = -1;
      for (var i = 0; i < nonHostChars.length; i++) {
        var hec = rest.indexOf(nonHostChars[i]);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
          hostEnd = hec;
      }
      if (hostEnd === -1)
        hostEnd = rest.length;
      this.host = rest.slice(0, hostEnd);
      rest = rest.slice(hostEnd);
      this.parseHost();
      this.hostname = this.hostname || '';
      var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';
      if (!ipv6Hostname) {
        var hostparts = this.hostname.split(/\./);
        for (var i = 0,
            l = hostparts.length; i < l; i++) {
          var part = hostparts[i];
          if (!part)
            continue;
          if (!part.match(hostnamePartPattern)) {
            var newpart = '';
            for (var j = 0,
                k = part.length; j < k; j++) {
              if (part.charCodeAt(j) > 127) {
                newpart += 'x';
              } else {
                newpart += part[j];
              }
            }
            if (!newpart.match(hostnamePartPattern)) {
              var validParts = hostparts.slice(0, i);
              var notHost = hostparts.slice(i + 1);
              var bit = part.match(hostnamePartStart);
              if (bit) {
                validParts.push(bit[1]);
                notHost.unshift(bit[2]);
              }
              if (notHost.length) {
                rest = '/' + notHost.join('.') + rest;
              }
              this.hostname = validParts.join('.');
              break;
            }
          }
        }
      }
      if (this.hostname.length > hostnameMaxLen) {
        this.hostname = '';
      } else {
        this.hostname = this.hostname.toLowerCase();
      }
      if (!ipv6Hostname) {
        var domainArray = this.hostname.split('.');
        var newOut = [];
        for (var i = 0; i < domainArray.length; ++i) {
          var s = domainArray[i];
          newOut.push(s.match(/[^A-Za-z0-9_-]/) ? 'xn--' + punycode.encode(s) : s);
        }
        this.hostname = newOut.join('.');
      }
      var p = this.port ? ':' + this.port : '';
      var h = this.hostname || '';
      this.host = h + p;
      this.href += this.host;
      if (ipv6Hostname) {
        this.hostname = this.hostname.substr(1, this.hostname.length - 2);
        if (rest[0] !== '/') {
          rest = '/' + rest;
        }
      }
    }
    if (!unsafeProtocol[lowerProto]) {
      for (var i = 0,
          l = autoEscape.length; i < l; i++) {
        var ae = autoEscape[i];
        var esc = encodeURIComponent(ae);
        if (esc === ae) {
          esc = escape(ae);
        }
        rest = rest.split(ae).join(esc);
      }
    }
    var hash = rest.indexOf('#');
    if (hash !== -1) {
      this.hash = rest.substr(hash);
      rest = rest.slice(0, hash);
    }
    var qm = rest.indexOf('?');
    if (qm !== -1) {
      this.search = rest.substr(qm);
      this.query = rest.substr(qm + 1);
      if (parseQueryString) {
        this.query = querystring.parse(this.query);
      }
      rest = rest.slice(0, qm);
    } else if (parseQueryString) {
      this.search = '';
      this.query = {};
    }
    if (rest)
      this.pathname = rest;
    if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
      this.pathname = '/';
    }
    if (this.pathname || this.search) {
      var p = this.pathname || '';
      var s = this.search || '';
      this.path = p + s;
    }
    this.href = this.format();
    return this;
  };
  function urlFormat(obj) {
    if (isString(obj))
      obj = urlParse(obj);
    if (!(obj instanceof Url))
      return Url.prototype.format.call(obj);
    return obj.format();
  }
  Url.prototype.format = function() {
    var auth = this.auth || '';
    if (auth) {
      auth = encodeURIComponent(auth);
      auth = auth.replace(/%3A/i, ':');
      auth += '@';
    }
    var protocol = this.protocol || '',
        pathname = this.pathname || '',
        hash = this.hash || '',
        host = false,
        query = '';
    if (this.host) {
      host = auth + this.host;
    } else if (this.hostname) {
      host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
      if (this.port) {
        host += ':' + this.port;
      }
    }
    if (this.query && isObject(this.query) && Object.keys(this.query).length) {
      query = querystring.stringify(this.query);
    }
    var search = this.search || (query && ('?' + query)) || '';
    if (protocol && protocol.substr(-1) !== ':')
      protocol += ':';
    if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
      host = '//' + (host || '');
      if (pathname && pathname.charAt(0) !== '/')
        pathname = '/' + pathname;
    } else if (!host) {
      host = '';
    }
    if (hash && hash.charAt(0) !== '#')
      hash = '#' + hash;
    if (search && search.charAt(0) !== '?')
      search = '?' + search;
    pathname = pathname.replace(/[?#]/g, function(match) {
      return encodeURIComponent(match);
    });
    search = search.replace('#', '%23');
    return protocol + host + pathname + search + hash;
  };
  function urlResolve(source, relative) {
    return urlParse(source, false, true).resolve(relative);
  }
  Url.prototype.resolve = function(relative) {
    return this.resolveObject(urlParse(relative, false, true)).format();
  };
  function urlResolveObject(source, relative) {
    if (!source)
      return relative;
    return urlParse(source, false, true).resolveObject(relative);
  }
  Url.prototype.resolveObject = function(relative) {
    if (isString(relative)) {
      var rel = new Url();
      rel.parse(relative, false, true);
      relative = rel;
    }
    var result = new Url();
    Object.keys(this).forEach(function(k) {
      result[k] = this[k];
    }, this);
    result.hash = relative.hash;
    if (relative.href === '') {
      result.href = result.format();
      return result;
    }
    if (relative.slashes && !relative.protocol) {
      Object.keys(relative).forEach(function(k) {
        if (k !== 'protocol')
          result[k] = relative[k];
      });
      if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
        result.path = result.pathname = '/';
      }
      result.href = result.format();
      return result;
    }
    if (relative.protocol && relative.protocol !== result.protocol) {
      if (!slashedProtocol[relative.protocol]) {
        Object.keys(relative).forEach(function(k) {
          result[k] = relative[k];
        });
        result.href = result.format();
        return result;
      }
      result.protocol = relative.protocol;
      if (!relative.host && !hostlessProtocol[relative.protocol]) {
        var relPath = (relative.pathname || '').split('/');
        while (relPath.length && !(relative.host = relPath.shift()))
          ;
        if (!relative.host)
          relative.host = '';
        if (!relative.hostname)
          relative.hostname = '';
        if (relPath[0] !== '')
          relPath.unshift('');
        if (relPath.length < 2)
          relPath.unshift('');
        result.pathname = relPath.join('/');
      } else {
        result.pathname = relative.pathname;
      }
      result.search = relative.search;
      result.query = relative.query;
      result.host = relative.host || '';
      result.auth = relative.auth;
      result.hostname = relative.hostname || relative.host;
      result.port = relative.port;
      if (result.pathname || result.search) {
        var p = result.pathname || '';
        var s = result.search || '';
        result.path = p + s;
      }
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    }
    var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
        isRelAbs = (relative.host || relative.pathname && relative.pathname.charAt(0) === '/'),
        mustEndAbs = (isRelAbs || isSourceAbs || (result.host && relative.pathname)),
        removeAllDots = mustEndAbs,
        srcPath = result.pathname && result.pathname.split('/') || [],
        relPath = relative.pathname && relative.pathname.split('/') || [],
        psychotic = result.protocol && !slashedProtocol[result.protocol];
    if (psychotic) {
      result.hostname = '';
      result.port = null;
      if (result.host) {
        if (srcPath[0] === '')
          srcPath[0] = result.host;
        else
          srcPath.unshift(result.host);
      }
      result.host = '';
      if (relative.protocol) {
        relative.hostname = null;
        relative.port = null;
        if (relative.host) {
          if (relPath[0] === '')
            relPath[0] = relative.host;
          else
            relPath.unshift(relative.host);
        }
        relative.host = null;
      }
      mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
    }
    if (isRelAbs) {
      result.host = (relative.host || relative.host === '') ? relative.host : result.host;
      result.hostname = (relative.hostname || relative.hostname === '') ? relative.hostname : result.hostname;
      result.search = relative.search;
      result.query = relative.query;
      srcPath = relPath;
    } else if (relPath.length) {
      if (!srcPath)
        srcPath = [];
      srcPath.pop();
      srcPath = srcPath.concat(relPath);
      result.search = relative.search;
      result.query = relative.query;
    } else if (!isNullOrUndefined(relative.search)) {
      if (psychotic) {
        result.hostname = result.host = srcPath.shift();
        var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }
      result.search = relative.search;
      result.query = relative.query;
      if (!isNull(result.pathname) || !isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
      }
      result.href = result.format();
      return result;
    }
    if (!srcPath.length) {
      result.pathname = null;
      if (result.search) {
        result.path = '/' + result.search;
      } else {
        result.path = null;
      }
      result.href = result.format();
      return result;
    }
    var last = srcPath.slice(-1)[0];
    var hasTrailingSlash = ((result.host || relative.host) && (last === '.' || last === '..') || last === '');
    var up = 0;
    for (var i = srcPath.length; i >= 0; i--) {
      last = srcPath[i];
      if (last == '.') {
        srcPath.splice(i, 1);
      } else if (last === '..') {
        srcPath.splice(i, 1);
        up++;
      } else if (up) {
        srcPath.splice(i, 1);
        up--;
      }
    }
    if (!mustEndAbs && !removeAllDots) {
      for (; up--; up) {
        srcPath.unshift('..');
      }
    }
    if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
      srcPath.unshift('');
    }
    if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
      srcPath.push('');
    }
    var isAbsolute = srcPath[0] === '' || (srcPath[0] && srcPath[0].charAt(0) === '/');
    if (psychotic) {
      result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
      var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    mustEndAbs = mustEndAbs || (result.host && srcPath.length);
    if (mustEndAbs && !isAbsolute) {
      srcPath.unshift('');
    }
    if (!srcPath.length) {
      result.pathname = null;
      result.path = null;
    } else {
      result.pathname = srcPath.join('/');
    }
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }
    result.auth = relative.auth || result.auth;
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  };
  Url.prototype.parseHost = function() {
    var host = this.host;
    var port = portPattern.exec(host);
    if (port) {
      port = port[0];
      if (port !== ':') {
        this.port = port.substr(1);
      }
      host = host.substr(0, host.length - port.length);
    }
    if (host)
      this.hostname = host;
  };
  function isString(arg) {
    return typeof arg === "string";
  }
  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }
  function isNull(arg) {
    return arg === null;
  }
  function isNullOrUndefined(arg) {
    return arg == null;
  }
  global.define = __define;
  return module.exports;
});

System.register("npm:babel-runtime@5.8.34/helpers/inherits", ["npm:babel-runtime@5.8.34/core-js/object/create", "npm:babel-runtime@5.8.34/core-js/object/set-prototype-of"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var _Object$create = require("npm:babel-runtime@5.8.34/core-js/object/create")["default"];
  var _Object$setPrototypeOf = require("npm:babel-runtime@5.8.34/core-js/object/set-prototype-of")["default"];
  exports["default"] = function(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = _Object$create(superClass && superClass.prototype, {constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }});
    if (superClass)
      _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

System.register("npm:babel-runtime@5.8.34/helpers/create-class", ["npm:babel-runtime@5.8.34/core-js/object/define-property"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var _Object$defineProperty = require("npm:babel-runtime@5.8.34/core-js/object/define-property")["default"];
  exports["default"] = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        _Object$defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/$.task", ["npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/$.ctx", "npm:core-js@0.9.18/library/modules/$.cof", "npm:core-js@0.9.18/library/modules/$.invoke", "npm:core-js@0.9.18/library/modules/$.dom-create", "github:jspm/nodelibs-process@0.1.2"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  (function(process) {
    'use strict';
    var $ = require("npm:core-js@0.9.18/library/modules/$"),
        ctx = require("npm:core-js@0.9.18/library/modules/$.ctx"),
        cof = require("npm:core-js@0.9.18/library/modules/$.cof"),
        invoke = require("npm:core-js@0.9.18/library/modules/$.invoke"),
        cel = require("npm:core-js@0.9.18/library/modules/$.dom-create"),
        global = $.g,
        isFunction = $.isFunction,
        html = $.html,
        process = global.process,
        setTask = global.setImmediate,
        clearTask = global.clearImmediate,
        MessageChannel = global.MessageChannel,
        counter = 0,
        queue = {},
        ONREADYSTATECHANGE = 'onreadystatechange',
        defer,
        channel,
        port;
    function run() {
      var id = +this;
      if ($.has(queue, id)) {
        var fn = queue[id];
        delete queue[id];
        fn();
      }
    }
    function listner(event) {
      run.call(event.data);
    }
    if (!isFunction(setTask) || !isFunction(clearTask)) {
      setTask = function(fn) {
        var args = [],
            i = 1;
        while (arguments.length > i)
          args.push(arguments[i++]);
        queue[++counter] = function() {
          invoke(isFunction(fn) ? fn : Function(fn), args);
        };
        defer(counter);
        return counter;
      };
      clearTask = function(id) {
        delete queue[id];
      };
      if (cof(process) == 'process') {
        defer = function(id) {
          process.nextTick(ctx(run, id, 1));
        };
      } else if (global.addEventListener && isFunction(global.postMessage) && !global.importScripts) {
        defer = function(id) {
          global.postMessage(id, '*');
        };
        global.addEventListener('message', listner, false);
      } else if (isFunction(MessageChannel)) {
        channel = new MessageChannel;
        port = channel.port2;
        channel.port1.onmessage = listner;
        defer = ctx(port.postMessage, port, 1);
      } else if (ONREADYSTATECHANGE in cel('script')) {
        defer = function(id) {
          html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function() {
            html.removeChild(this);
            run.call(id);
          };
        };
      } else {
        defer = function(id) {
          setTimeout(ctx(run, id, 1), 0);
        };
      }
    }
    module.exports = {
      set: setTask,
      clear: clearTask
    };
  })(require("github:jspm/nodelibs-process@0.1.2"));
  global.define = __define;
  return module.exports;
});

System.register("npm:url@0.10.3", ["npm:url@0.10.3/url"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("npm:url@0.10.3/url");
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/modules/es6.promise", ["npm:core-js@0.9.18/library/modules/$", "npm:core-js@0.9.18/library/modules/$.ctx", "npm:core-js@0.9.18/library/modules/$.cof", "npm:core-js@0.9.18/library/modules/$.def", "npm:core-js@0.9.18/library/modules/$.assert", "npm:core-js@0.9.18/library/modules/$.for-of", "npm:core-js@0.9.18/library/modules/$.set-proto", "npm:core-js@0.9.18/library/modules/$.same", "npm:core-js@0.9.18/library/modules/$.species", "npm:core-js@0.9.18/library/modules/$.wks", "npm:core-js@0.9.18/library/modules/$.uid", "npm:core-js@0.9.18/library/modules/$.task", "npm:core-js@0.9.18/library/modules/$.mix", "npm:core-js@0.9.18/library/modules/$.iter-detect", "github:jspm/nodelibs-process@0.1.2"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  (function(process) {
    'use strict';
    var $ = require("npm:core-js@0.9.18/library/modules/$"),
        ctx = require("npm:core-js@0.9.18/library/modules/$.ctx"),
        cof = require("npm:core-js@0.9.18/library/modules/$.cof"),
        $def = require("npm:core-js@0.9.18/library/modules/$.def"),
        assert = require("npm:core-js@0.9.18/library/modules/$.assert"),
        forOf = require("npm:core-js@0.9.18/library/modules/$.for-of"),
        setProto = require("npm:core-js@0.9.18/library/modules/$.set-proto").set,
        same = require("npm:core-js@0.9.18/library/modules/$.same"),
        species = require("npm:core-js@0.9.18/library/modules/$.species"),
        SPECIES = require("npm:core-js@0.9.18/library/modules/$.wks")('species'),
        RECORD = require("npm:core-js@0.9.18/library/modules/$.uid").safe('record'),
        PROMISE = 'Promise',
        global = $.g,
        process = global.process,
        isNode = cof(process) == 'process',
        asap = process && process.nextTick || require("npm:core-js@0.9.18/library/modules/$.task").set,
        P = global[PROMISE],
        isFunction = $.isFunction,
        isObject = $.isObject,
        assertFunction = assert.fn,
        assertObject = assert.obj,
        Wrapper;
    function testResolve(sub) {
      var test = new P(function() {});
      if (sub)
        test.constructor = Object;
      return P.resolve(test) === test;
    }
    var useNative = function() {
      var works = false;
      function P2(x) {
        var self = new P(x);
        setProto(self, P2.prototype);
        return self;
      }
      try {
        works = isFunction(P) && isFunction(P.resolve) && testResolve();
        setProto(P2, P);
        P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
        if (!(P2.resolve(5).then(function() {}) instanceof P2)) {
          works = false;
        }
        if (works && $.DESC) {
          var thenableThenGotten = false;
          P.resolve($.setDesc({}, 'then', {get: function() {
              thenableThenGotten = true;
            }}));
          works = thenableThenGotten;
        }
      } catch (e) {
        works = false;
      }
      return works;
    }();
    function isPromise(it) {
      return isObject(it) && (useNative ? cof.classof(it) == 'Promise' : RECORD in it);
    }
    function sameConstructor(a, b) {
      if (!$.FW && a === P && b === Wrapper)
        return true;
      return same(a, b);
    }
    function getConstructor(C) {
      var S = assertObject(C)[SPECIES];
      return S != undefined ? S : C;
    }
    function isThenable(it) {
      var then;
      if (isObject(it))
        then = it.then;
      return isFunction(then) ? then : false;
    }
    function notify(record) {
      var chain = record.c;
      if (chain.length)
        asap.call(global, function() {
          var value = record.v,
              ok = record.s == 1,
              i = 0;
          function run(react) {
            var cb = ok ? react.ok : react.fail,
                ret,
                then;
            try {
              if (cb) {
                if (!ok)
                  record.h = true;
                ret = cb === true ? value : cb(value);
                if (ret === react.P) {
                  react.rej(TypeError('Promise-chain cycle'));
                } else if (then = isThenable(ret)) {
                  then.call(ret, react.res, react.rej);
                } else
                  react.res(ret);
              } else
                react.rej(value);
            } catch (err) {
              react.rej(err);
            }
          }
          while (chain.length > i)
            run(chain[i++]);
          chain.length = 0;
        });
    }
    function isUnhandled(promise) {
      var record = promise[RECORD],
          chain = record.a || record.c,
          i = 0,
          react;
      if (record.h)
        return false;
      while (chain.length > i) {
        react = chain[i++];
        if (react.fail || !isUnhandled(react.P))
          return false;
      }
      return true;
    }
    function $reject(value) {
      var record = this,
          promise;
      if (record.d)
        return ;
      record.d = true;
      record = record.r || record;
      record.v = value;
      record.s = 2;
      record.a = record.c.slice();
      setTimeout(function() {
        asap.call(global, function() {
          if (isUnhandled(promise = record.p)) {
            if (isNode) {
              process.emit('unhandledRejection', value, promise);
            } else if (global.console && console.error) {
              console.error('Unhandled promise rejection', value);
            }
          }
          record.a = undefined;
        });
      }, 1);
      notify(record);
    }
    function $resolve(value) {
      var record = this,
          then;
      if (record.d)
        return ;
      record.d = true;
      record = record.r || record;
      try {
        if (then = isThenable(value)) {
          asap.call(global, function() {
            var wrapper = {
              r: record,
              d: false
            };
            try {
              then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
            } catch (e) {
              $reject.call(wrapper, e);
            }
          });
        } else {
          record.v = value;
          record.s = 1;
          notify(record);
        }
      } catch (e) {
        $reject.call({
          r: record,
          d: false
        }, e);
      }
    }
    if (!useNative) {
      P = function Promise(executor) {
        assertFunction(executor);
        var record = {
          p: assert.inst(this, P, PROMISE),
          c: [],
          a: undefined,
          s: 0,
          d: false,
          v: undefined,
          h: false
        };
        $.hide(this, RECORD, record);
        try {
          executor(ctx($resolve, record, 1), ctx($reject, record, 1));
        } catch (err) {
          $reject.call(record, err);
        }
      };
      require("npm:core-js@0.9.18/library/modules/$.mix")(P.prototype, {
        then: function then(onFulfilled, onRejected) {
          var S = assertObject(assertObject(this).constructor)[SPECIES];
          var react = {
            ok: isFunction(onFulfilled) ? onFulfilled : true,
            fail: isFunction(onRejected) ? onRejected : false
          };
          var promise = react.P = new (S != undefined ? S : P)(function(res, rej) {
            react.res = assertFunction(res);
            react.rej = assertFunction(rej);
          });
          var record = this[RECORD];
          record.c.push(react);
          if (record.a)
            record.a.push(react);
          if (record.s)
            notify(record);
          return promise;
        },
        'catch': function(onRejected) {
          return this.then(undefined, onRejected);
        }
      });
    }
    $def($def.G + $def.W + $def.F * !useNative, {Promise: P});
    cof.set(P, PROMISE);
    species(P);
    species(Wrapper = $.core[PROMISE]);
    $def($def.S + $def.F * !useNative, PROMISE, {reject: function reject(r) {
        return new (getConstructor(this))(function(res, rej) {
          rej(r);
        });
      }});
    $def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {resolve: function resolve(x) {
        return isPromise(x) && sameConstructor(x.constructor, this) ? x : new this(function(res) {
          res(x);
        });
      }});
    $def($def.S + $def.F * !(useNative && require("npm:core-js@0.9.18/library/modules/$.iter-detect")(function(iter) {
      P.all(iter)['catch'](function() {});
    })), PROMISE, {
      all: function all(iterable) {
        var C = getConstructor(this),
            values = [];
        return new C(function(res, rej) {
          forOf(iterable, false, values.push, values);
          var remaining = values.length,
              results = Array(remaining);
          if (remaining)
            $.each.call(values, function(promise, index) {
              C.resolve(promise).then(function(value) {
                results[index] = value;
                --remaining || res(results);
              }, rej);
            });
          else
            res(results);
        });
      },
      race: function race(iterable) {
        var C = getConstructor(this);
        return new C(function(res, rej) {
          forOf(iterable, false, function(promise) {
            C.resolve(promise).then(res, rej);
          });
        });
      }
    });
  })(require("github:jspm/nodelibs-process@0.1.2"));
  global.define = __define;
  return module.exports;
});

System.register("github:jspm/nodelibs-url@0.1.0/index", ["npm:url@0.10.3"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = System._nodeRequire ? System._nodeRequire('url') : require("npm:url@0.10.3");
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/library/fn/promise", ["npm:core-js@0.9.18/library/modules/es6.object.to-string", "npm:core-js@0.9.18/library/modules/es6.string.iterator", "npm:core-js@0.9.18/library/modules/web.dom.iterable", "npm:core-js@0.9.18/library/modules/es6.promise", "npm:core-js@0.9.18/library/modules/$"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  require("npm:core-js@0.9.18/library/modules/es6.object.to-string");
  require("npm:core-js@0.9.18/library/modules/es6.string.iterator");
  require("npm:core-js@0.9.18/library/modules/web.dom.iterable");
  require("npm:core-js@0.9.18/library/modules/es6.promise");
  module.exports = require("npm:core-js@0.9.18/library/modules/$").core.Promise;
  global.define = __define;
  return module.exports;
});

System.register("github:jspm/nodelibs-url@0.1.0", ["github:jspm/nodelibs-url@0.1.0/index"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:jspm/nodelibs-url@0.1.0/index");
  global.define = __define;
  return module.exports;
});

System.register("npm:babel-runtime@5.8.34/core-js/promise", ["npm:core-js@0.9.18/library/fn/promise"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": require("npm:core-js@0.9.18/library/fn/promise"),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

System.register('github:MindTouch/martian@0.1.3/settings', [], function (_export) {
    /**
     * Martian - Core JavaScript API for MindTouch
     *
     * Copyright (c) 2015 MindTouch Inc.
     * www.mindtouch.com  oss@mindtouch.com
     *
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
    'use strict';

    var properties, settings;
    return {
        setters: [],
        execute: function () {
            properties = {
                host: ''
            };
            settings = {
                get: function get(propertyName) {
                    return properties[propertyName];
                },
                set: function set(propertyName, value) {
                    properties[propertyName] = value;
                },
                getSettings: function getSettings() {
                    return properties;
                }
            };

            _export('default', settings);
        }
    };
});
System.register('github:MindTouch/martian@0.1.3/lib/stringUtility', [], function (_export) {
    /**
     * Martian - Core JavaScript API for MindTouch
     *
     * Copyright (c) 2015 MindTouch Inc.
     * www.mindtouch.com  oss@mindtouch.com
     *
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
    'use strict';

    var stringUtility;
    return {
        setters: [],
        execute: function () {
            stringUtility = {
                isBlank: function isBlank() {
                    var str = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

                    return (/^\s*$/.test(this.makeString(str))
                    );
                },
                makeString: function makeString() {
                    var str = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

                    if (typeof str !== 'string') {
                        return String(str);
                    }
                    return str;
                },
                leftTrim: function leftTrim(str) {
                    var char = arguments.length <= 1 || arguments[1] === undefined ? '\s' : arguments[1];

                    str = this.makeString(str);
                    return str.replace(new RegExp('^' + char + '+'), '');
                },
                startsWith: function startsWith(str, starts) {
                    str = this.makeString(str);
                    return str.lastIndexOf(starts, 0) === 0;
                },
                stringLeft: function stringLeft(str, sep) {
                    str = this.makeString(str);
                    sep = this.makeString(str);
                    var pos = !sep ? 0 : str.indexOf(sep);
                    return pos ? str.slice(0, pos + sep.length) : str;
                },
                stringRight: function stringRight(str, sep) {
                    str = this.makeString(str);
                    sep = this.makeString(str);
                    var pos = !sep ? 0 : str.indexOf(sep);
                    return pos ? str.slice(pos + sep.length, str.length) : str;
                },
                words: function words(str, delimiter) {
                    str = this.makeString(str);
                    return str.split(delimiter || /\s+/);
                }
            };

            _export('default', stringUtility);
        }
    };
});
System.register("github:MindTouch/martian@0.1.3/errors/mtError", ["npm:babel-runtime@5.8.34/helpers/get", "npm:babel-runtime@5.8.34/helpers/inherits", "npm:babel-runtime@5.8.34/helpers/class-call-check"], function (_export) {
  var _get, _inherits, _classCallCheck, MTError;

  return {
    setters: [function (_npmBabelRuntime5834HelpersGet) {
      _get = _npmBabelRuntime5834HelpersGet["default"];
    }, function (_npmBabelRuntime5834HelpersInherits) {
      _inherits = _npmBabelRuntime5834HelpersInherits["default"];
    }, function (_npmBabelRuntime5834HelpersClassCallCheck) {
      _classCallCheck = _npmBabelRuntime5834HelpersClassCallCheck["default"];
    }],
    execute: function () {
      /**
       * Martian - Core JavaScript API for MindTouch
       *
       * Copyright (c) 2015 MindTouch Inc.
       * www.mindtouch.com  oss@mindtouch.com
       *
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
      "use strict";

      MTError = (function (_Error) {
        _inherits(MTError, _Error);

        /**
         * Placeholder class to contain the workaround for Babel not being able
         * to subclass built-in objects due to ES5 limitations.
         */

        function MTError(message) {
          _classCallCheck(this, MTError);

          _get(Object.getPrototypeOf(MTError.prototype), "constructor", this).call(this);
          this.message = message;
          this.stack = new Error().stack;
          this.name = this.constructor.name;
        }

        return MTError;
      })(Error);

      _export("default", MTError);
    }
  };
});
System.register('github:MindTouch/martian@0.1.3/models/pageRating.model', ['github:MindTouch/martian@0.1.3/models/modelHelper'], function (_export) {
    /**
     * Martian - Core JavaScript API for MindTouch
     *
     * Copyright (c) 2015 MindTouch Inc.
     * www.mindtouch.com  oss@mindtouch.com
     *
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
    'use strict';

    var modelHelper, pageRatingModel;
    return {
        setters: [function (_githubMindTouchMartian013ModelsModelHelper) {
            modelHelper = _githubMindTouchMartian013ModelsModelHelper['default'];
        }],
        execute: function () {
            pageRatingModel = {
                parse: function parse(data) {
                    var obj = modelHelper.fromJson(data);
                    var parsed = {
                        count: parseInt(obj['@count']),
                        date: modelHelper.getDate(obj['@date']),
                        seatedCount: parseInt(obj['@seated.count']),
                        unseatedCount: parseInt(obj['@unseated.count'])
                    };
                    if ('@score' in obj && obj['@score'] !== '') {
                        parsed.score = parseInt(obj['@score']);
                    }
                    if ('@seated.score' in obj && obj['@seated.score'] !== '') {
                        parsed.seatedScore = parseInt(obj['@seated.score']);
                    }
                    if ('@unseated.score' in obj && obj['@unseated.score'] !== '') {
                        parsed.unseatedScore = parseInt(obj['@unseated.score']);
                    }
                    if ('@score.trend' in obj) {
                        parsed.scoreTrend = parseInt(obj['@score.trend']);
                    }
                    if ('@seated.score.trend' in obj) {
                        parsed.seatedScoreTrend = parseInt(obj['@seated.score.trend']);
                    }
                    if ('@unseated.score.trend' in obj) {
                        parsed.unseatedScoreTrend = parseInt(obj['@unseated.score.trend']);
                    }
                    if ('user.ratedby' in obj) {
                        var ratedBy = obj['user.ratedby'];
                        parsed.userRatedBy = {
                            id: parseInt(ratedBy['@id']),
                            score: parseInt(ratedBy['@score']),
                            date: modelHelper.getDate(ratedBy['@date']),
                            href: ratedBy['@href'],
                            seated: modelHelper.getBool(ratedBy['@seated'])
                        };
                    }
                    return parsed;
                }
            };

            _export('default', pageRatingModel);
        }
    };
});
System.register('github:MindTouch/martian@0.1.3/models/search.model', ['github:MindTouch/martian@0.1.3/models/modelHelper'], function (_export) {
    /**
     * Martian - Core JavaScript API for MindTouch
     *
     * Copyright (c) 2015 MindTouch Inc.
     * www.mindtouch.com  oss@mindtouch.com
     *
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
    'use strict';

    var modelHelper, searchModel;
    return {
        setters: [function (_githubMindTouchMartian013ModelsModelHelper) {
            modelHelper = _githubMindTouchMartian013ModelsModelHelper['default'];
        }],
        execute: function () {
            searchModel = {
                parse: function parse(data) {
                    var obj = modelHelper.fromJson(data);
                    var search = {
                        ranking: obj['@ranking'],
                        queryId: obj['@queryid'],
                        queryCount: obj['@querycount'],
                        recommendationCount: obj['@count.recommendations'],
                        count: obj['@count'],
                        result: []
                    };
                    obj.result.forEach(function (result) {
                        search.result.push({
                            author: result.author,
                            content: result.content,
                            dateModified: modelHelper.getDate(result['date.modified']),
                            id: result.id,
                            mime: result.mime,
                            rank: result.rank,
                            title: result.title,
                            uri: result.uri,
                            uriTrack: result['uri.track'],
                            page: {
                                path: result.page.path,
                                rating: result.page.rating,
                                title: result.page.title,
                                uriUi: result.page['uri.ui']
                            }
                        });
                    });
                    return search;
                }
            };

            _export('default', searchModel);
        }
    };
});
System.register('github:MindTouch/martian@0.1.3/lib/utility', ['npm:babel-runtime@5.8.34/core-js/object/keys', 'github:MindTouch/martian@0.1.3/lib/stringUtility', 'github:MindTouch/martian@0.1.3/settings'], function (_export) {
    var _Object$keys, stringUtility, settings, utility;

    return {
        setters: [function (_npmBabelRuntime5834CoreJsObjectKeys) {
            _Object$keys = _npmBabelRuntime5834CoreJsObjectKeys['default'];
        }, function (_githubMindTouchMartian013LibStringUtility) {
            stringUtility = _githubMindTouchMartian013LibStringUtility['default'];
        }, function (_githubMindTouchMartian013Settings) {
            settings = _githubMindTouchMartian013Settings['default'];
        }],
        execute: function () {
            /**
             * Martian - Core JavaScript API for MindTouch
             *
             * Copyright (c) 2015 MindTouch Inc.
             * www.mindtouch.com  oss@mindtouch.com
             *
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
            'use strict';

            utility = {
                searchEscape: function searchEscape(query) {
                    var result = query.toString();
                    var charArr = ['\\', '+', '-', '&', '|', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':'];
                    charArr.forEach(function (c) {
                        var regex = new RegExp('\\' + c, 'g');
                        result = result.replace(regex, '\\' + c);
                    });
                    return result;
                },
                getPlugWithHost: function getPlugWithHost(plug) {
                    return plug.withHost(settings.get('host'));
                },
                getStringParams: function getStringParams(queryString) {
                    var retVal = {};
                    var params = stringUtility.words(stringUtility.stringRight(queryString, '?'), '&');
                    params.forEach(function (pair) {
                        var myPair = pair.split('=');
                        if (myPair[0]) {
                            retVal[decodeURIComponent(myPair[0])] = decodeURIComponent(myPair[1]);
                        }
                    });
                    return retVal;
                },
                buildQueryString: function buildQueryString(paramObject) {
                    var queryString = '';
                    _Object$keys(paramObject).forEach(function (key, index, arr) {
                        queryString += encodeURIComponent(key) + '=' + encodeURIComponent(paramObject[key]);
                        if (index < arr.length - 1) {
                            queryString += '&';
                        }
                    });
                    return queryString;
                }
            };

            _export('default', utility);
        }
    };
});
System.register('github:MindTouch/martian@0.1.3/models/page.model', ['github:MindTouch/martian@0.1.3/models/modelHelper', 'github:MindTouch/martian@0.1.3/models/pageRating.model'], function (_export) {
    /**
     * Martian - Core JavaScript API for MindTouch
     *
     * Copyright (c) 2015 MindTouch Inc.
     * www.mindtouch.com  oss@mindtouch.com
     *
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
    'use strict';

    var modelHelper, pageRatingModel, pageModel;
    return {
        setters: [function (_githubMindTouchMartian013ModelsModelHelper) {
            modelHelper = _githubMindTouchMartian013ModelsModelHelper['default'];
        }, function (_githubMindTouchMartian013ModelsPageRatingModel) {
            pageRatingModel = _githubMindTouchMartian013ModelsPageRatingModel['default'];
        }],
        execute: function () {
            pageModel = {
                parse: function parse(data) {
                    var obj = modelHelper.fromJson(data);
                    var parsed = {
                        id: parseInt(obj['@id']),
                        deleted: modelHelper.getBool(obj['@deleted']),
                        dateCreated: modelHelper.getDate(obj['date.created']),
                        language: obj.language,
                        namespace: obj.namespace,
                        path: modelHelper.getString(obj.path),
                        title: obj.title,
                        uriUi: obj['uri.ui']
                    };
                    modelHelper.addIfDefined(obj['@href'], 'href', parsed);
                    modelHelper.addIfDefined(obj['@revision'], 'revision', parsed);
                    modelHelper.addIfDefined(obj.article, 'article', parsed);
                    if ('page.parent' in obj) {
                        parsed.pageParent = pageModel._getParents(obj['page.parent'] || null);
                    }
                    if ('rating' in obj) {
                        parsed.rating = pageRatingModel.parse(obj.rating);
                    }

                    // Only parse subpages if the property exists, and it has a 'page'
                    //  sub-property.
                    if ('subpages' in obj && typeof obj.subpages !== 'string' && 'page' in obj.subpages) {
                        parsed.subpages = pageModel._getSubpages(obj.subpages);
                    }
                    return parsed;
                },
                _getParents: function _getParents(parent) {
                    if (parent === null) {
                        return null;
                    } else {
                        return pageModel.parse(parent);
                    }
                },
                _getSubpages: function _getSubpages(subpages) {
                    var pageDef = subpages.page;
                    var parsed = [];
                    pageDef = Array.isArray(pageDef) ? pageDef : [pageDef];
                    pageDef.forEach(function (sp) {
                        parsed.push(pageModel.parse(sp));
                    });
                    return parsed;
                }
            };

            _export('default', pageModel);
        }
    };
});
System.register('github:MindTouch/martian@0.1.3/site', ['npm:babel-runtime@5.8.34/helpers/create-class', 'npm:babel-runtime@5.8.34/helpers/class-call-check', 'npm:babel-runtime@5.8.34/core-js/promise', 'github:MindTouch/martian@0.1.3/settings', 'github:MindTouch/martian@0.1.3/lib/utility', 'github:MindTouch/martian@0.1.3/lib/stringUtility', 'github:MindTouch/martian@0.1.3/plug', 'github:MindTouch/martian@0.1.3/models/search.model'], function (_export) {
    var _createClass, _classCallCheck, _Promise, settings, utility, stringUtility, Plug, SearchModel, sitePlug, Site;

    function _buildSearchConstraints(params) {
        var constraints = [];
        params.namespace = 'main';
        constraints.push('+namespace:' + utility.searchEscape(params.namespace));
        if ('path' in params) {
            var path = params.path;
            if (stringUtility.startsWith(path, '/')) {
                path = stringUtility.leftTrim(path, '/');
            }
            if (!stringUtility.isBlank(path)) {
                constraints.push('+path.ancestor:' + utility.searchEscape(path));
            }
        }
        if ('tags' in params) {
            var tags = params.tags;
            if (typeof tags === 'string' && tags) {
                tags = tags.split(',');
            }
            tags.forEach(function (tag) {
                constraints.push('+tag:"' + utility.searchEscape(tag) + '"');
            });
        }
        return '+(' + constraints.join(' ') + ')';
    }
    return {
        setters: [function (_npmBabelRuntime5834HelpersCreateClass) {
            _createClass = _npmBabelRuntime5834HelpersCreateClass['default'];
        }, function (_npmBabelRuntime5834HelpersClassCallCheck) {
            _classCallCheck = _npmBabelRuntime5834HelpersClassCallCheck['default'];
        }, function (_npmBabelRuntime5834CoreJsPromise) {
            _Promise = _npmBabelRuntime5834CoreJsPromise['default'];
        }, function (_githubMindTouchMartian013Settings) {
            settings = _githubMindTouchMartian013Settings['default'];
        }, function (_githubMindTouchMartian013LibUtility) {
            utility = _githubMindTouchMartian013LibUtility['default'];
        }, function (_githubMindTouchMartian013LibStringUtility) {
            stringUtility = _githubMindTouchMartian013LibStringUtility['default'];
        }, function (_githubMindTouchMartian013Plug) {
            Plug = _githubMindTouchMartian013Plug['default'];
        }, function (_githubMindTouchMartian013ModelsSearchModel) {
            SearchModel = _githubMindTouchMartian013ModelsSearchModel['default'];
        }],
        execute: function () {
            /**
             * Martian - Core JavaScript API for MindTouch
             *
             * Copyright (c) 2015 MindTouch Inc.
             * www.mindtouch.com  oss@mindtouch.com
             *
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
            'use strict';

            sitePlug = new Plug().at('@api', 'deki', 'site');

            Site = (function () {
                function Site() {
                    _classCallCheck(this, Site);
                }

                _createClass(Site, null, [{
                    key: 'getResourceString',
                    value: function getResourceString(options) {
                        if (!('key' in options)) {
                            return _Promise.reject('No resource key was supplied');
                        }
                        var locPlug = sitePlug.withHost(settings.get('host')).at('localization', options.key);
                        if ('lang' in options) {
                            locPlug = locPlug.withParam('lang', options.lang);
                        }
                        return locPlug.get();
                    }
                }, {
                    key: 'search',
                    value: function search(_ref) {
                        var _ref$page = _ref.page;
                        var page = _ref$page === undefined ? 1 : _ref$page;
                        var _ref$limit = _ref.limit;
                        var limit = _ref$limit === undefined ? 10 : _ref$limit;
                        var _ref$tags = _ref.tags;
                        var tags = _ref$tags === undefined ? '' : _ref$tags;
                        var _ref$q = _ref.q;
                        var q = _ref$q === undefined ? '' : _ref$q;
                        var _ref$path = _ref.path;
                        var path = _ref$path === undefined ? '' : _ref$path;

                        var constraint = {};
                        if (path !== '') {
                            constraint.path = path;
                        }
                        if (tags !== '') {
                            constraint.tags = tags;
                        }
                        var searchParams = {
                            limit: limit,
                            page: page,
                            offset: parseInt(limit, 10) * (parseInt(page, 10) - 1),
                            sortBy: '-date,-rank',
                            q: q,
                            summarypath: encodeURI(path),
                            constraint: _buildSearchConstraints(constraint)
                        };
                        return sitePlug.withHost(settings.get('host')).at('query').withParams(searchParams).get().then(function (res) {
                            return SearchModel.parse(res);
                        });
                    }
                }]);

                return Site;
            })();

            _export('default', Site);
        }
    };
});
System.register('github:MindTouch/martian@0.1.3/uriHash', ['npm:babel-runtime@5.8.34/helpers/create-class', 'npm:babel-runtime@5.8.34/helpers/class-call-check', 'github:MindTouch/martian@0.1.3/lib/utility', 'github:MindTouch/martian@0.1.3/lib/stringUtility'], function (_export) {
    var _createClass, _classCallCheck, utility, stringUtility, UriHash;

    return {
        setters: [function (_npmBabelRuntime5834HelpersCreateClass) {
            _createClass = _npmBabelRuntime5834HelpersCreateClass['default'];
        }, function (_npmBabelRuntime5834HelpersClassCallCheck) {
            _classCallCheck = _npmBabelRuntime5834HelpersClassCallCheck['default'];
        }, function (_githubMindTouchMartian013LibUtility) {
            utility = _githubMindTouchMartian013LibUtility['default'];
        }, function (_githubMindTouchMartian013LibStringUtility) {
            stringUtility = _githubMindTouchMartian013LibStringUtility['default'];
        }],
        execute: function () {
            /**
             * Martian - Core JavaScript API for MindTouch
             *
             * Copyright (c) 2015 MindTouch Inc.
             * www.mindtouch.com  oss@mindtouch.com
             *
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
            'use strict';

            UriHash = (function () {
                function UriHash(hashStr) {
                    _classCallCheck(this, UriHash);

                    if (stringUtility.startsWith(hashStr, '#')) {
                        hashStr = hashStr.substr(1);
                    }
                    this._hashStr = hashStr || '';
                    this._params = utility.getStringParams(hashStr);
                }

                _createClass(UriHash, [{
                    key: 'getQueryParams',
                    value: function getQueryParams() {
                        return this._params;
                    }
                }, {
                    key: 'replaceParams',
                    value: function replaceParams(paramObject) {
                        return new UriHash(utility.buildQueryString(paramObject));
                    }
                }, {
                    key: 'withParam',
                    value: function withParam(key, val) {
                        var newParams = this._params;
                        newParams[key] = val;
                        return this.replaceParams(newParams);
                    }
                }, {
                    key: 'withoutParam',
                    value: function withoutParam(key) {
                        var newParams = this._params;
                        delete newParams[key];
                        return this.replaceParams(newParams);
                    }
                }, {
                    key: 'getParam',
                    value: function getParam(key) {
                        return this._params[key];
                    }
                }, {
                    key: 'toHashString',
                    value: function toHashString() {
                        return '#' + this._hashStr;
                    }
                }]);

                return UriHash;
            })();

            _export('default', UriHash);
        }
    };
});
System.register('github:MindTouch/martian@0.1.3/time', ['github:moment/moment@2.10.6'], function (_export) {
    /**
     * Martian - Core JavaScript API for MindTouch
     *
     * Copyright (c) 2015 MindTouch Inc.
     * www.mindtouch.com  oss@mindtouch.com
     *
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
    'use strict';

    var moment, time;
    return {
        setters: [function (_githubMomentMoment2106) {
            moment = _githubMomentMoment2106['default'];
        }],
        execute: function () {
            time = moment;

            moment.fn.defaults = {
                dateTimeFormat: 'HH:mm, D MMM YYYY',
                dateFormat: 'D MMM YYYY',
                timeFormat: 'HH:mm',
                apiFormat: 'YYYYMMDDHHmmss'
            };
            moment.fn.getDate = function () {
                return moment(this).format(this.defaults.dateFormat);
            };
            moment.fn.getAPIDateTime = function () {
                return moment(this).format(this.defaults.apiFormat);
            };
            moment.fn.getTime = function () {
                return moment(this).format(this.defaults.timeFormat);
            };
            moment.fn.getDateTime = function () {
                return moment(this).format(this.defaults.dateTimeFormat);
            };

            /**
             * Get a range of moment objects
             * @param {moment} end - end date (inclusive)
             * @param {number} stepSize - duration size (default: 1)
             * @param {number} stepUnit - duration unit that can be parsed by moment.duration (default: 'd')
             * @returns {Array} - range of moment objects
             */
            moment.fn.range = function (end, stepSize, stepUnit) {
                if (!moment.isMoment(this) || !moment.isMoment(end)) {
                    throw 'end must be a moment object';
                }
                stepUnit = stepUnit || 'd';
                stepSize = stepSize || 1;
                var arr = [];
                var curr = this.clone();
                while (!curr.isAfter(end)) {
                    arr.push(curr.clone());
                    curr.add(moment.duration(stepSize, stepUnit));
                }
                return arr;
            };

            _export('default', time);
        }
    };
});
System.register('search', ['github:MindTouch/martian@0.1.3/site'], function (_export) {
  /**
   * MindTouch GeniusLink SDK
   * Copyright (C) 2006-2015 MindTouch, Inc.
   * www.mindtouch.com  oss@mindtouch.com
   *
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
   * @param {String} q - keywords or advanced search syntax
   * @param {Object} options - {
   *  page: paginated {page}
   *  limit: limit search results to {limit} items per paginated page
   *  tags: constrain search results to items tagged with {tag}
   *  path: constraint search results to items located in the {path} page hierarchy
   * }
   * @returns {Object}
   */
  'use strict';

  var Site;
  return {
    setters: [function (_githubMindTouchMartian013Site) {
      Site = _githubMindTouchMartian013Site['default'];
    }],
    execute: function () {
      _export('default', function (q) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        if (!q || q === '') {
          throw new Error('Search requires keywords or advanced search syntax.');
        }
        options.q = q;
        return Site.search(options);
      });
    }
  };
});
System.register('github:MindTouch/martian@0.1.3/models/modelHelper', ['github:MindTouch/martian@0.1.3/time'], function (_export) {
    /**
     * Martian - Core JavaScript API for MindTouch
     *
     * Copyright (c) 2015 MindTouch Inc.
     * www.mindtouch.com  oss@mindtouch.com
     *
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
    'use strict';

    var Time, modelHelper;
    return {
        setters: [function (_githubMindTouchMartian013Time) {
            Time = _githubMindTouchMartian013Time['default'];
        }],
        execute: function () {
            modelHelper = {
                fromJson: function fromJson(data) {
                    if (typeof data === 'string') {
                        data = JSON.parse(data);
                    }
                    return data;
                },
                getString: function getString(field) {
                    return typeof field === 'string' ? field : field['#text'];
                },
                getBool: function getBool(field) {
                    return field === 'true';
                },
                getDate: function getDate(field) {
                    return new Time(new Date(field));
                },
                addIfDefined: function addIfDefined(field, name, obj) {
                    var parser = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

                    if (typeof field !== 'undefined') {
                        if (parser !== null) {
                            field = parser.parse.call(parser, field);
                        }
                        obj[name] = field;
                    }
                }
            };

            _export('default', modelHelper);
        }
    };
});
System.register('github:MindTouch/martian@0.1.3/errors/xhrError', ['npm:babel-runtime@5.8.34/helpers/get', 'npm:babel-runtime@5.8.34/helpers/inherits', 'npm:babel-runtime@5.8.34/helpers/class-call-check', 'github:MindTouch/martian@0.1.3/errors/mtError'], function (_export) {
    var _get, _inherits, _classCallCheck, MTError, XhrError;

    return {
        setters: [function (_npmBabelRuntime5834HelpersGet) {
            _get = _npmBabelRuntime5834HelpersGet['default'];
        }, function (_npmBabelRuntime5834HelpersInherits) {
            _inherits = _npmBabelRuntime5834HelpersInherits['default'];
        }, function (_npmBabelRuntime5834HelpersClassCallCheck) {
            _classCallCheck = _npmBabelRuntime5834HelpersClassCallCheck['default'];
        }, function (_githubMindTouchMartian013ErrorsMtError) {
            MTError = _githubMindTouchMartian013ErrorsMtError['default'];
        }],
        execute: function () {
            /**
             * Martian - Core JavaScript API for MindTouch
             *
             * Copyright (c) 2015 MindTouch Inc.
             * www.mindtouch.com  oss@mindtouch.com
             *
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
            'use strict';

            XhrError = (function (_MTError) {
                _inherits(XhrError, _MTError);

                function XhrError(xhr) {
                    _classCallCheck(this, XhrError);

                    var response = {};
                    if ('responseText' in xhr) {
                        try {
                            response = JSON.parse(xhr.responseText);
                        } catch (e) {
                            response.message = xhr.responseText;
                        }
                    }
                    var message = 'message' in response && response.message !== '' ? response.message : 'Status ' + xhr.status + ' from request';
                    _get(Object.getPrototypeOf(XhrError.prototype), 'constructor', this).call(this, message);
                    this.errorCode = xhr.status;
                }

                return XhrError;
            })(MTError);

            _export('default', XhrError);
        }
    };
});
System.register('github:MindTouch/martian@0.1.3/models/user.model', ['github:MindTouch/martian@0.1.3/models/modelHelper', 'github:MindTouch/martian@0.1.3/models/page.model'], function (_export) {
    /**
     * Martian - Core JavaScript API for MindTouch
     *
     * Copyright (c) 2015 MindTouch Inc.
     * www.mindtouch.com  oss@mindtouch.com
     *
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
    'use strict';

    var modelHelper, pageModel, userModel;
    return {
        setters: [function (_githubMindTouchMartian013ModelsModelHelper) {
            modelHelper = _githubMindTouchMartian013ModelsModelHelper['default'];
        }, function (_githubMindTouchMartian013ModelsPageModel) {
            pageModel = _githubMindTouchMartian013ModelsPageModel['default'];
        }],
        execute: function () {
            userModel = {
                parse: function parse(data) {
                    var obj = modelHelper.fromJson(data);
                    var parsed = {
                        id: parseInt(obj['@id']),
                        wikiId: obj['@wikiid'],
                        href: obj['@href'],
                        dateCreated: modelHelper.getDate(obj['date.created']),
                        dateLastLogin: modelHelper.getDate(obj['date.lastlogin']),
                        email: obj.email,
                        fullname: obj.fullname,
                        username: obj.username
                    };
                    if ('page.home' in obj) {
                        parsed.pageHome = pageModel.parse(obj['page.home']);
                    }
                    return parsed;
                }
            };

            _export('default', userModel);
        }
    };
});
System.register('github:MindTouch/martian@0.1.3/uri', ['npm:babel-runtime@5.8.34/helpers/create-class', 'npm:babel-runtime@5.8.34/helpers/class-call-check', 'npm:babel-runtime@5.8.34/core-js/object/keys', 'github:jspm/nodelibs-url@0.1.0', 'github:MindTouch/martian@0.1.3/uriHash', 'github:MindTouch/martian@0.1.3/lib/stringUtility'], function (_export) {
    var _createClass, _classCallCheck, _Object$keys, Url, UriHash, stringUtility, Uri;

    return {
        setters: [function (_npmBabelRuntime5834HelpersCreateClass) {
            _createClass = _npmBabelRuntime5834HelpersCreateClass['default'];
        }, function (_npmBabelRuntime5834HelpersClassCallCheck) {
            _classCallCheck = _npmBabelRuntime5834HelpersClassCallCheck['default'];
        }, function (_npmBabelRuntime5834CoreJsObjectKeys) {
            _Object$keys = _npmBabelRuntime5834CoreJsObjectKeys['default'];
        }, function (_githubJspmNodelibsUrl010) {
            Url = _githubJspmNodelibsUrl010['default'];
        }, function (_githubMindTouchMartian013UriHash) {
            UriHash = _githubMindTouchMartian013UriHash['default'];
        }, function (_githubMindTouchMartian013LibStringUtility) {
            stringUtility = _githubMindTouchMartian013LibStringUtility['default'];
        }],
        execute: function () {
            /**
             * Martian - Core JavaScript API for MindTouch
             *
             * Copyright (c) 2015 MindTouch Inc.
             * www.mindtouch.com  oss@mindtouch.com
             *
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
            'use strict';

            Uri = (function () {
                function Uri() {
                    var url = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

                    _classCallCheck(this, Uri);

                    this.parsedUrl = Url.parse(url, true);
                    this.parsedUrl.search = null;
                }

                _createClass(Uri, [{
                    key: 'path',
                    value: function path() {
                        return this.parsedUrl.pathname;
                    }
                }, {
                    key: 'getSegments',
                    value: function getSegments() {
                        var path = this.path();
                        if (stringUtility.startsWith(path, '/')) {
                            path = stringUtility.leftTrim(path, '/');
                        }
                        return path.split('/');
                    }
                }, {
                    key: 'query',
                    value: function query() {
                        return Url.parse(this.toString()).search || '';
                    }
                }, {
                    key: 'origin',
                    value: function origin() {
                        var u = this.parsedUrl;
                        return u.protocol + '//' + u.host;
                    }
                }, {
                    key: 'getUriHash',
                    value: function getUriHash() {
                        return new UriHash(this.parsedUrl.hash);
                    }
                }, {
                    key: 'getProtocol',
                    value: function getProtocol() {
                        return this.parsedUrl.protocol;
                    }
                }, {
                    key: 'getHostName',
                    value: function getHostName() {
                        return this.parsedUrl.hostname;
                    }
                }, {
                    key: 'addQueryParam',
                    value: function addQueryParam(key, value) {
                        return this.withParam(key, value);
                    }
                }, {
                    key: 'addQueryParams',
                    value: function addQueryParams(queryMap) {
                        return this.withParams(queryMap);
                    }
                }, {
                    key: 'removeQueryParam',
                    value: function removeQueryParam(key) {
                        if (key in this.parsedUrl.query) {
                            delete this.parsedUrl.query[key];
                        }
                        return this;
                    }
                }, {
                    key: 'getQueryParamValue',
                    value: function getQueryParamValue(param) {
                        var query = this.parsedUrl.query;
                        return param in query ? query[param] : null;
                    }
                }, {
                    key: 'withHost',
                    value: function withHost(host) {
                        if (!host || host === '') {
                            return this;
                        }
                        var hostUri = Url.parse(host);
                        this.parsedUrl.host = hostUri.host;
                        this.parsedUrl.hostname = hostUri.hostname;
                        this.parsedUrl.protocol = hostUri.protocol;
                        return this;
                    }
                }, {
                    key: 'withParam',
                    value: function withParam(key, value) {
                        this.parsedUrl.query[key] = value;
                        return this;
                    }
                }, {
                    key: 'withParams',
                    value: function withParams(queryMap) {
                        var _this = this;

                        _Object$keys(queryMap).forEach(function (key) {
                            _this.addQueryParam(key, queryMap[key]);
                        });
                        return this;
                    }
                }, {
                    key: 'addSegments',
                    value: function addSegments() {
                        var path = '';

                        for (var _len = arguments.length, segments = Array(_len), _key = 0; _key < _len; _key++) {
                            segments[_key] = arguments[_key];
                        }

                        segments.forEach(function (segment) {
                            if (Array.isArray(segment)) {
                                segment.forEach(function (arraySegment) {
                                    arraySegment = stringUtility.leftTrim(arraySegment, '/');
                                    path = path + '/' + arraySegment;
                                });
                            } else {
                                segment = stringUtility.leftTrim(segment, '/');
                                path = path + '/' + segment;
                            }
                        });
                        var pathName = this.parsedUrl.pathname || '';
                        this.parsedUrl.pathname = '' + pathName + path;
                        this.parsedUrl = Url.parse(this.parsedUrl);
                        return this;
                    }
                }, {
                    key: 'toString',
                    value: function toString() {
                        return Url.format(this.parsedUrl);
                    }
                }]);

                return Uri;
            })();

            _export('default', Uri);
        }
    };
});
System.register('github:MindTouch/martian@0.1.3/plug', ['npm:babel-runtime@5.8.34/helpers/create-class', 'npm:babel-runtime@5.8.34/helpers/class-call-check', 'npm:babel-runtime@5.8.34/core-js/promise', 'github:MindTouch/martian@0.1.3/settings', 'github:MindTouch/martian@0.1.3/uri', 'github:MindTouch/martian@0.1.3/errors/xhrError'], function (_export) {
    var _createClass, _classCallCheck, _Promise, settings, Uri, XhrError, Plug;

    function _handleHttpError(xhr) {
        return new _Promise(function (resolve, reject) {

            // Throw for all non-2xx status codes, except for 304
            if ((xhr.status < 200 || xhr.status >= 300) && xhr.status !== 304) {
                reject(new XhrError(xhr));
            } else {
                resolve(xhr);
            }
        });
    }
    function _getText(xhr) {
        return _Promise.resolve(xhr.responseText || '');
    }
    function _doRequest(params) {
        var _this = this;

        return new _Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            var requestParams = {
                _: Date.now(),
                origin: 'mt-web' // TODO: F1 req from settings module after 20150820
            };
            if (_this.parseJson) {
                requestParams['dream.out.format'] = 'json';
            }
            var url = _this.withParams(requestParams).getUrl();
            xhr.open(params.verb, url);
            xhr.setRequestHeader('X-Deki-Client', 'mindtouch-martian');
            for (var i in _this.headers) {
                if (_this.headers.hasOwnProperty(i)) {
                    xhr.setRequestHeader(i, _this.headers[i]);
                }
            }
            if ('mime' in params) {
                xhr.setRequestHeader('Content-Type', params.mime);
            }
            var protocol = _this.url.getProtocol();
            if (protocol === null) {
                protocol = window.location.protocol;
            }
            if (protocol === 'https:') {
                xhr.setRequestHeader('Front-End-Https', 'On'); // TODO: Necessary??
            }
            if (_this._timeout) {
                console.log('setting timeout to ' + _this._timeout);
                xhr.timeout = _this._timeout;
            }
            xhr.onload = function () {
                resolve(xhr);
            };
            xhr.onerror = function () {
                reject(xhr);
            };
            xhr.ontimeout = function () {
                reject(xhr);
            };
            if ('value' in params && params.value !== null) {
                xhr.send(params.value);
            } else {
                xhr.send();
            }
        });
    }
    return {
        setters: [function (_npmBabelRuntime5834HelpersCreateClass) {
            _createClass = _npmBabelRuntime5834HelpersCreateClass['default'];
        }, function (_npmBabelRuntime5834HelpersClassCallCheck) {
            _classCallCheck = _npmBabelRuntime5834HelpersClassCallCheck['default'];
        }, function (_npmBabelRuntime5834CoreJsPromise) {
            _Promise = _npmBabelRuntime5834CoreJsPromise['default'];
        }, function (_githubMindTouchMartian013Settings) {
            settings = _githubMindTouchMartian013Settings['default'];
        }, function (_githubMindTouchMartian013Uri) {
            Uri = _githubMindTouchMartian013Uri['default'];
        }, function (_githubMindTouchMartian013ErrorsXhrError) {
            XhrError = _githubMindTouchMartian013ErrorsXhrError['default'];
        }],
        execute: function () {
            /**
             * Martian - Core JavaScript API for MindTouch
             *
             * Copyright (c) 2015 MindTouch Inc.
             * www.mindtouch.com  oss@mindtouch.com
             *
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
            'use strict';

            Plug = (function () {
                function Plug() {
                    var url = arguments.length <= 0 || arguments[0] === undefined ? settings.get('host') : arguments[0];
                    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                    _classCallCheck(this, Plug);

                    // initailize the url for this instance
                    var _url = new Uri(url);
                    if ('constructionParams' in params) {
                        if ('segments' in params.constructionParams) {
                            _url.addSegments(params.constructionParams.segments);
                        }
                        if ('query' in params.constructionParams) {
                            _url.addQueryParams(params.constructionParams.query);
                        }
                        if ('excludeQuery' in params.constructionParams) {
                            _url.removeQueryParam(params.constructionParams.excludeQuery);
                        }
                        if ('timeout' in params.constructionParams) {
                            this._timeout = params.constructionParams.timeout;
                        }
                    } else {
                        params.constructionParams = {};
                    }
                    this.url = _url;
                    this.headers = params.headers || {};
                    this.parseJson = params.raw !== true;
                }

                _createClass(Plug, [{
                    key: 'getUrl',
                    value: function getUrl() {
                        return this.url.toString();
                    }
                }, {
                    key: 'getHeaders',
                    value: function getHeaders() {
                        return this.headers || {};
                    }
                }, {
                    key: 'at',
                    value: function at() {
                        for (var _len = arguments.length, segments = Array(_len), _key = 0; _key < _len; _key++) {
                            segments[_key] = arguments[_key];
                        }

                        var values = [];
                        segments.forEach(function (segment) {
                            values.push(segment.toString());
                        });
                        return new Plug(this.url.toString(), {
                            headers: this.headers,
                            constructionParams: { segments: segments }
                        });
                    }
                }, {
                    key: 'withParam',
                    value: function withParam(key, value) {
                        var params = {};
                        params[key] = value;
                        return new Plug(this.url.toString(), {
                            headers: this.headers,
                            constructionParams: { query: params }
                        });
                    }
                }, {
                    key: 'withParams',
                    value: function withParams(values) {
                        if (!values) {
                            values = {};
                        }
                        return new Plug(this.url.toString(), {
                            headers: this.headers,
                            constructionParams: { query: values }
                        });
                    }
                }, {
                    key: 'withoutParam',
                    value: function withoutParam(key) {
                        return new Plug(this.url.toString(), {
                            headers: this.headers,
                            constructionParams: { excludeQuery: key }
                        });
                    }
                }, {
                    key: '_copyHeaders',
                    value: function _copyHeaders() {
                        var newHeaders = {};
                        for (var i in this.headers) {
                            if (this.headers.hasOwnProperty(i)) {
                                newHeaders[i] = this.headers[i];
                            }
                        }
                        return newHeaders;
                    }
                }, {
                    key: 'withHeader',
                    value: function withHeader(key, value) {
                        var newHeaders = this._copyHeaders();
                        newHeaders[key] = value;
                        return new Plug(this.url.toString(), { headers: newHeaders });
                    }
                }, {
                    key: 'withHeaders',
                    value: function withHeaders(values) {
                        var newHeaders = this._copyHeaders();
                        for (var key in values) {
                            if (values.hasOwnProperty(key)) {
                                newHeaders[key] = values[key];
                            }
                        }
                        return new Plug(this.url.toString(), { headers: newHeaders });
                    }
                }, {
                    key: 'withoutHeader',
                    value: function withoutHeader(key) {
                        var newHeaders = this._copyHeaders();
                        delete newHeaders[key];
                        return new Plug(this.url.toString(), { headers: newHeaders });
                    }
                }, {
                    key: 'withHost',
                    value: function withHost(host) {
                        this.url.withHost(host);
                        return this;
                    }
                }, {
                    key: 'get',
                    value: function get() {
                        var verb = arguments.length <= 0 || arguments[0] === undefined ? 'GET' : arguments[0];

                        return this.getRaw(verb).then(_handleHttpError).then(_getText);
                    }
                }, {
                    key: 'getRaw',
                    value: function getRaw() {
                        var verb = arguments.length <= 0 || arguments[0] === undefined ? 'GET' : arguments[0];

                        return _doRequest.call(this, { verb: verb });
                    }
                }, {
                    key: 'post',
                    value: function post(value, mime) {
                        return this.postRaw(value, mime).then(_handleHttpError).then(_getText);
                    }
                }, {
                    key: 'postRaw',
                    value: function postRaw(value, mime) {
                        return _doRequest.call(this, { verb: 'POST', value: value, mime: mime });
                    }
                }, {
                    key: 'put',
                    value: function put(value, mime) {
                        return this.withHeader('X-HTTP-Method-Override', 'PUT').post(value, mime);
                    }
                }, {
                    key: 'putRaw',
                    value: function putRaw(value, mime) {
                        return this.withHeader('X-HTTP-Method-Override', 'PUT').postRaw(value, mime);
                    }
                }, {
                    key: 'head',
                    value: function head() {
                        return this.get('HEAD');
                    }
                }, {
                    key: 'headRaw',
                    value: function headRaw() {
                        return this.getRaw('HEAD');
                    }
                }, {
                    key: 'options',
                    value: function options() {
                        return this.get('OPTIONS');
                    }
                }, {
                    key: 'optionsRaw',
                    value: function optionsRaw() {
                        return this.getRaw('OPTIONS');
                    }
                }, {
                    key: 'del',
                    value: function del() {
                        return this.withHeader('X-HTTP-Method-Override', 'DELETE').post(null, null);
                    }
                }, {
                    key: 'delRaw',
                    value: function delRaw() {
                        return this.withHeader('X-HTTP-Method-Override', 'DELETE').postRaw(null, null);
                    }
                }, {
                    key: 'delete',
                    value: function _delete() {
                        return this.del();
                    }
                }]);

                return Plug;
            })();

            _export('default', Plug);
        }
    };
});
System.register('github:MindTouch/martian@0.1.3/user', ['npm:babel-runtime@5.8.34/helpers/create-class', 'npm:babel-runtime@5.8.34/helpers/class-call-check', 'github:MindTouch/martian@0.1.3/plug', 'github:MindTouch/martian@0.1.3/settings', 'github:MindTouch/martian@0.1.3/models/user.model'], function (_export) {
    var _createClass, _classCallCheck, Plug, settings, userModel, userPlug, User;

    return {
        setters: [function (_npmBabelRuntime5834HelpersCreateClass) {
            _createClass = _npmBabelRuntime5834HelpersCreateClass['default'];
        }, function (_npmBabelRuntime5834HelpersClassCallCheck) {
            _classCallCheck = _npmBabelRuntime5834HelpersClassCallCheck['default'];
        }, function (_githubMindTouchMartian013Plug) {
            Plug = _githubMindTouchMartian013Plug['default'];
        }, function (_githubMindTouchMartian013Settings) {
            settings = _githubMindTouchMartian013Settings['default'];
        }, function (_githubMindTouchMartian013ModelsUserModel) {
            userModel = _githubMindTouchMartian013ModelsUserModel['default'];
        }],
        execute: function () {
            /**
             * Martian - Core JavaScript API for MindTouch
             *
             * Copyright (c) 2015 MindTouch Inc.
             * www.mindtouch.com  oss@mindtouch.com
             *
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
            'use strict';

            userPlug = new Plug().at('@api', 'deki', 'users');

            User = (function () {
                function User() {
                    _classCallCheck(this, User);
                }

                _createClass(User, null, [{
                    key: 'getCurrentUser',
                    value: function getCurrentUser() {
                        return userPlug.withHost(settings.get('host')).at('current').get().then(userModel.parse);
                    }
                }]);

                return User;
            })();

            _export('default', User);
        }
    };
});
System.register('user', ['npm:babel-runtime@5.8.34/helpers/create-class', 'npm:babel-runtime@5.8.34/helpers/class-call-check', 'github:MindTouch/martian@0.1.3/user', 'github:MindTouch/martian@0.1.3/settings'], function (_export) {
  var _createClass, _classCallCheck, MartianUser, settings, User;

  return {
    setters: [function (_npmBabelRuntime5834HelpersCreateClass) {
      _createClass = _npmBabelRuntime5834HelpersCreateClass['default'];
    }, function (_npmBabelRuntime5834HelpersClassCallCheck) {
      _classCallCheck = _npmBabelRuntime5834HelpersClassCallCheck['default'];
    }, function (_githubMindTouchMartian013User) {
      MartianUser = _githubMindTouchMartian013User['default'];
    }, function (_githubMindTouchMartian013Settings) {
      settings = _githubMindTouchMartian013Settings['default'];
    }],
    execute: function () {
      /**
       * MindTouch GeniusLink SDK
       * Copyright (C) 2006-2015 MindTouch, Inc.
       * www.mindtouch.com  oss@mindtouch.com
       *
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
      'use strict';

      User = (function () {
        function User() {
          _classCallCheck(this, User);
        }

        _createClass(User, null, [{
          key: 'getCurrentUser',

          /**
           * The current MindTouch host user, or an anonymous user is unauthenticated
           *
           * @returns {Object}
           */
          value: function getCurrentUser() {
            return MartianUser.getCurrentUser();
          }

          /**
           * A url that allows an anonymous user to authenticate with the MindTouch host
           *
           * @returns {String}
           */
        }, {
          key: 'getLoginUrl',
          value: function getLoginUrl() {
            return settings.get('host') + '/@app/login/redirect';
          }
        }]);

        return User;
      })();

      _export('default', User);
    }
  };
});
System.register('geniuslink', ['user', 'search', 'github:MindTouch/martian@0.1.3/settings'], function (_export) {
    /**
     * MindTouch GeniusLink SDK
     * Copyright (C) 2006-2015 MindTouch, Inc.
     * www.mindtouch.com  oss@mindtouch.com
     *
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
    'use strict';

    var User, search, settings;
    return {
        setters: [function (_user) {
            User = _user['default'];
        }, function (_search) {
            search = _search['default'];
        }, function (_githubMindTouchMartian013Settings) {
            settings = _githubMindTouchMartian013Settings['default'];
        }],
        execute: function () {
            _export('default', {

                /**
                 * Initialize GeniusLink connection
                 *
                 * @param {String} host - MindTouch host (e.g. https://example.mindtouch.us)
                 */
                init: function init(host) {
                    if (!host) {
                        throw new Error('A MindTouch host (e.g. https://example.mindtouch.us) is required to initialize the GeniusLink connection.');
                    }
                    var protocolArr = host.match(/^http(s?):/);
                    var protocol = protocolArr && Array.isArray(protocolArr) ? protocolArr[0] : window.location.protocol;
                    if (!protocolArr) {
                        host = protocol + '//' + host;
                    }
                    if (protocol === 'https:' && window.location.protocol === 'http:') {
                        throw new Error('A secure HTTPS connection cannot be made from an insecure web page.');
                    }
                    settings.set('host', host);
                },
                search: search,
                user: User
            });
        }
    };
});
System.register('index', ['geniuslink'], function (_export) {
  /**
   * MindTouch GeniusLink SDK
   * Copyright (C) 2006-2015 MindTouch, Inc.
   * www.mindtouch.com  oss@mindtouch.com
   *
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
  'use strict';

  var GeniusLink;
  return {
    setters: [function (_geniuslink) {
      GeniusLink = _geniuslink['default'];
    }],
    execute: function () {
      window.GeniusLink = GeniusLink || {};
    }
  };
});
(function() {
  var loader = System;
  if (typeof indexOf == 'undefined')
    indexOf = Array.prototype.indexOf;

  function readGlobalProperty(p, value) {
    var pParts = p.split('.');
    while (pParts.length)
      value = value[pParts.shift()];
    return value;
  }

  var ignoredGlobalProps = ['sessionStorage', 'localStorage', 'clipboardData', 'frames', 'external'];

  var hasOwnProperty = loader.global.hasOwnProperty;

  function iterateGlobals(callback) {
    if (Object.keys)
      Object.keys(loader.global).forEach(callback);
    else
      for (var g in loader.global) {
        if (!hasOwnProperty.call(loader.global, g))
          continue;
        callback(g);
      }
  }

  function forEachGlobal(callback) {
    iterateGlobals(function(globalName) {
      if (indexOf.call(ignoredGlobalProps, globalName) != -1)
        return;
      try {
        var value = loader.global[globalName];
      }
      catch(e) {
        ignoredGlobalProps.push(globalName);
      }
      callback(globalName, value);
    });
  }

  var moduleGlobals = {};

  var globalSnapshot;

  loader.set('@@global-helpers', loader.newModule({
    prepareGlobal: function(moduleName, deps) {
      // first, we add all the dependency modules to the global
      for (var i = 0; i < deps.length; i++) {
        var moduleGlobal = moduleGlobals[deps[i]];
        if (moduleGlobal)
          for (var m in moduleGlobal)
            loader.global[m] = moduleGlobal[m];
      }

      // now store a complete copy of the global object
      // in order to detect changes
      globalSnapshot = {};
      
      forEachGlobal(function(name, value) {
        globalSnapshot[name] = value;
      });
    },
    retrieveGlobal: function(moduleName, exportName, init) {
      var singleGlobal;
      var multipleExports;
      var exports = {};

      // run init
      if (init)
        singleGlobal = init.call(loader.global);

      // check for global changes, creating the globalObject for the module
      // if many globals, then a module object for those is created
      // if one global, then that is the module directly
      else if (exportName) {
        var firstPart = exportName.split('.')[0];
        singleGlobal = readGlobalProperty(exportName, loader.global);
        exports[firstPart] = loader.global[firstPart];
      }

      else {
        forEachGlobal(function(name, value) {
          if (globalSnapshot[name] === value)
            return;
          if (typeof value === 'undefined')
            return;
          exports[name] = value;
          if (typeof singleGlobal !== 'undefined') {
            if (!multipleExports && singleGlobal !== value)
              multipleExports = true;
          }
          else {
            singleGlobal = value;
          }
        });
      }

      moduleGlobals[moduleName] = exports;

      return multipleExports ? exports : singleGlobal;
    }
  }));
})();
});
//# sourceMappingURL=geniuslink.js.map