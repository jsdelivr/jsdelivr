/*
  mustache.js — Logic-less templates in JavaScript

  See http://mustache.github.com/ for more info.
*/

var Mustache = function() {
  var Renderer = function() {};

  Renderer.prototype = {
    otag: "{{",
    ctag: "}}",
    pragmas: {},
    buffer: [],
    pragmas_implemented: {
      "IMPLICIT-ITERATOR": true
    },
    context: {},

    render: function(template, context, partials, in_recursion) {
      // reset buffer & set context
      if(!in_recursion) {
        this.context = context;
        this.buffer = []; // TODO: make this non-lazy
      }

      // fail fast
      if(!this.includes("", template)) {
        if(in_recursion) {
          return template;
        } else {
          this.send(template);
          return;
        }
      }

      template = this.render_pragmas(template);
      var html = this.render_section(template, context, partials);
      if(in_recursion) {
        return this.render_tags(html, context, partials, in_recursion);
      }

      this.render_tags(html, context, partials, in_recursion);
    },

    /*
      Sends parsed lines
    */
    send: function(line) {
      if(line !== "") {
        this.buffer.push(line);
      }
    },

    /*
      Looks for %PRAGMAS
    */
    render_pragmas: function(template) {
      // no pragmas
      if(!this.includes("%", template)) {
        return template;
      }

      var that = this;
      var regex = new RegExp(this.otag + "%([\\w-]+) ?([\\w]+=[\\w]+)?" +
            this.ctag, "g");
      return template.replace(regex, function(match, pragma, options) {
        if(!that.pragmas_implemented[pragma]) {
          throw({message: 
            "This implementation of mustache doesn't understand the '" +
            pragma + "' pragma"});
        }
        that.pragmas[pragma] = {};
        if(options) {
          var opts = options.split("=");
          that.pragmas[pragma][opts[0]] = opts[1];
        }
        return "";
        // ignore unknown pragmas silently
      });
    },

    /*
      Tries to find a partial in the curent scope and render it
    */
    render_partial: function(name, context, partials) {
      name = this.trim(name);
      if(!partials || partials[name] === undefined) {
        throw({message: "unknown_partial '" + name + "'"});
      }
      if(typeof(context[name]) != "object") {
        return this.render(partials[name], context, partials, true);
      }
      return this.render(partials[name], context[name], partials, true);
    },

    /*
      Renders inverted (^) and normal (#) sections
    */
    render_section: function(template, context, partials) {
      if(!this.includes("#", template) && !this.includes("^", template)) {
        return template;
      }

      var that = this;
      // CSW - Added "+?" so it finds the tighest bound, not the widest
      var regex = new RegExp(this.otag + "(\\^|\\#)\\s*(.+)\\s*" + this.ctag +
              "\n*([\\s\\S]+?)" + this.otag + "\\/\\s*\\2\\s*" + this.ctag +
              "\\s*", "mg");

      // for each {{#foo}}{{/foo}} section do...
      return template.replace(regex, function(match, type, name, content) {
        var value = that.find(name, context);
        if(type == "^") { // inverted section
          if(!value || that.is_array(value) && value.length === 0) {
            // false or empty list, render it
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        } else if(type == "#") { // normal section
          if(that.is_array(value)) { // Enumerable, Let's loop!
            return that.map(value, function(row) {
              return that.render(content, that.create_context(row),
                partials, true);
            }).join("");
          } else if(that.is_object(value)) { // Object, Use it as subcontext!
            return that.render(content, that.create_context(value),
              partials, true);
          } else if(typeof value === "function") {
            // higher order section
            return value.call(context, content, function(text) {
              return that.render(text, context, partials, true);
            });
          } else if(value) { // boolean section
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        }
      });
    },

    /*
      Replace {{foo}} and friends with values from our view
    */
    render_tags: function(template, context, partials, in_recursion) {
      // tit for tat
      var that = this;

      var new_regex = function() {
        return new RegExp(that.otag + "(=|!|>|\\{|%|\\$)?([^\\/#\\^]+?)\\1?" +
          that.ctag + "+", "g");
      };

      var regex = new_regex();
      var tag_replace_callback = function(match, operator, name) {
        switch(operator) {
        case "!": // ignore comments
          return "";
        case "=": // set new delimiters, rebuild the replace regexp
          that.set_delimiters(name);
          regex = new_regex();
          return "";
        case ">": // render partial
          return that.render_partial(name, context, partials);
        case "{": // the triple mustache is unescaped
          return that.find(name, context);
        case "$":
          return encodeURIComponent(that.find(name, context));
        default: // escape the value
          return that.escape(that.find(name, context));
        }
      };
      var lines = template.split("\n");
      for(var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(regex, tag_replace_callback, this);
        if(!in_recursion) {
          this.send(lines[i]);
        }
      }

      if(in_recursion) {
        return lines.join("\n");
      }
    },

    set_delimiters: function(delimiters) {
      var dels = delimiters.split(" ");
      this.otag = this.escape_regex(dels[0]);
      this.ctag = this.escape_regex(dels[1]);
    },

    escape_regex: function(text) {
      // thank you Simon Willison
      if(!arguments.callee.sRE) {
        var specials = [
          '/', '.', '*', '+', '?', '|',
          '(', ')', '[', ']', '{', '}', '\\'
        ];
        arguments.callee.sRE = new RegExp(
          '(\\' + specials.join('|\\') + ')', 'g'
        );
      }
      return text.replace(arguments.callee.sRE, '\\$1');
    },

    /*
      find `name` in current `context`. That is find me a value
      from the view object
    */
    find: function(name, context) {
      name = this.trim(name);

      // Checks whether a value is thruthy or false or 0
      function is_kinda_truthy(bool) {
        return bool === false || bool === 0 || bool;
      }

      var value;
      if(is_kinda_truthy(context[name])) {
        value = context[name];
      } else if(is_kinda_truthy(this.context[name])) {
        value = this.context[name];
      }

      if(typeof value === "function") {
        return value.apply(context);
      }
      if(value !== undefined) {
        return value;
      }
      // silently ignore unkown variables
      return "";
    },

    // Utility methods

    /* includes tag */
    includes: function(needle, haystack) {
      return haystack.indexOf(this.otag + needle) != -1;
    },

    /*
      Does away with nasty characters
    */
    escape: function(s) {
      s = String(s === null ? "" : s);
      return s.replace(/&(?!\w+;)|["'<>\\]/g, function(s) {
        switch(s) {
        case "&": return "&amp;";
        case "\\": return "\\\\";
        case '"': return '&quot;';
        case "'": return '&#39;';
        case "<": return "&lt;";
        case ">": return "&gt;";
        default: return s;
        }
      });
    },

    // by @langalex, support for arrays of strings
    create_context: function(_context) {
      if(this.is_object(_context)) {
        return _context;
      } else {
        var iterator = ".";
        if(this.pragmas["IMPLICIT-ITERATOR"]) {
          iterator = this.pragmas["IMPLICIT-ITERATOR"].iterator;
        }
        var ctx = {};
        ctx[iterator] = _context;
        return ctx;
      }
    },

    is_object: function(a) {
      return a && typeof a == "object";
    },

    is_array: function(a) {
      return Object.prototype.toString.call(a) === '[object Array]';
    },

    /*
      Gets rid of leading and trailing whitespace
    */
    trim: function(s) {
      return s.replace(/^\s*|\s*$/g, "");
    },

    /*
      Why, why, why? Because IE. Cry, cry cry.
    */
    map: function(array, fn) {
      if (typeof array.map == "function") {
        return array.map(fn);
      } else {
        var r = [];
        var l = array.length;
        for(var i = 0; i < l; i++) {
          r.push(fn(array[i]));
        }
        return r;
      }
    }
  };

  return({
    name: "mustache.js",
    version: "0.3.1-dev",

    /*
      Turns a template and view into HTML
    */
    to_html: function(template, view, partials, send_fun) {
      var renderer = new Renderer();
      if(send_fun) {
        renderer.send = send_fun;
      }
      renderer.render(template, view, partials);
      if(!send_fun) {
        return renderer.buffer.join("\n");
      }
    }
  });
}();
// Input 0
window.CLOSURE_NO_DEPS = true;

// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Bootstrap for the Google JS Library (Closure).
 *
 * In uncompiled mode base.js will write out Closure's deps file, unless the
 * global <code>CLOSURE_NO_DEPS</code> is set to true.  This allows projects to
 * include their own deps file(s) from different locations.
 *
 */


/**
 * @define {boolean} Overridden to true by the compiler when --closure_pass
 *     or --mark_as_compiled is specified.
 */
var COMPILED = true;


/**
 * Base namespace for the Closure library.  Checks to see goog is
 * already defined in the current scope before assigning to prevent
 * clobbering if base.js is loaded more than once.
 *
 * @const
 */
var goog = goog || {}; // Identifies this file as the Closure base.


/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
goog.global = this;


/**
 * @define {boolean} DEBUG is provided as a convenience so that debugging code
 * that should not be included in a production js_binary can be easily stripped
 * by specifying --define goog.DEBUG=false to the JSCompiler. For example, most
 * toString() methods should be declared inside an "if (goog.DEBUG)" conditional
 * because they are generally used for debugging purposes and it is difficult
 * for the JSCompiler to statically determine whether they are used.
 */
goog.DEBUG = true;


/**
 * @define {string} LOCALE defines the locale being used for compilation. It is
 * used to select locale specific data to be compiled in js binary. BUILD rule
 * can specify this value by "--define goog.LOCALE=<locale_name>" as JSCompiler
 * option.
 *
 * Take into account that the locale code format is important. You should use
 * the canonical Unicode format with hyphen as a delimiter. Language must be
 * lowercase, Language Script - Capitalized, Region - UPPERCASE.
 * There are few examples: pt-BR, en, en-US, sr-Latin-BO, zh-Hans-CN.
 *
 * See more info about locale codes here:
 * http://www.unicode.org/reports/tr35/#Unicode_Language_and_Locale_Identifiers
 *
 * For language codes you should use values defined by ISO 693-1. See it here
 * http://www.w3.org/WAI/ER/IG/ert/iso639.htm. There is only one exception from
 * this rule: the Hebrew language. For legacy reasons the old code (iw) should
 * be used instead of the new code (he), see http://wiki/Main/IIISynonyms.
 */
goog.LOCALE = 'en';  // default to en


/**
 * Creates object stubs for a namespace.  The presence of one or more
 * goog.provide() calls indicate that the file defines the given
 * objects/namespaces.  Build tools also scan for provide/require statements
 * to discern dependencies, build dependency files (see deps.js), etc.
 * @see goog.require
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 */
goog.provide = function(name) {
  if (!COMPILED) {
    // Ensure that the same namespace isn't provided twice. This is intended
    // to teach new developers that 'goog.provide' is effectively a variable
    // declaration. And when JSCompiler transforms goog.provide into a real
    // variable declaration, the compiled JS should work the same as the raw
    // JS--even when the raw JS uses goog.provide incorrectly.
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];

    var namespace = name;
    while ((namespace = namespace.substring(0, namespace.lastIndexOf('.')))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }

  goog.exportPath_(name);
};


/**
 * Marks that the current file should only be used for testing, and never for
 * live code in production.
 * @param {string=} opt_message Optional message to add to the error that's
 *     raised when used in production code.
 */
goog.setTestOnly = function(opt_message) {
  if (COMPILED && !goog.DEBUG) {
    opt_message = opt_message || '';
    throw Error('Importing test-only code into non-debug environment' +
                opt_message ? ': ' + opt_message : '.');
  }
};


if (!COMPILED) {

  /**
   * Check if the given name has been goog.provided. This will return false for
   * names that are available only as implicit namespaces.
   * @param {string} name name of the object to look for.
   * @return {boolean} Whether the name has been provided.
   * @private
   */
  goog.isProvided_ = function(name) {
    return !goog.implicitNamespaces_[name] && !!goog.getObjectByName(name);
  };

  /**
   * Namespaces implicitly defined by goog.provide. For example,
   * goog.provide('goog.events.Event') implicitly declares
   * that 'goog' and 'goog.events' must be namespaces.
   *
   * @type {Object}
   * @private
   */
  goog.implicitNamespaces_ = {};
}


/**
 * Builds an object structure for the provided namespace path,
 * ensuring that names that already exist are not overwritten. For
 * example:
 * "a.b.c" -> a = {};a.b={};a.b.c={};
 * Used by goog.provide and goog.exportSymbol.
 * @param {string} name name of the object that this file defines.
 * @param {*=} opt_object the object to expose at the end of the path.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is |goog.global|.
 * @private
 */
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.');
  var cur = opt_objectToExportTo || goog.global;

  // Internet Explorer exhibits strange behavior when throwing errors from
  // methods externed in this manner.  See the testExportSymbolExceptions in
  // base_test.html for an example.
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript('var ' + parts[0]);
  }

  // Certain browsers cannot parse code in the form for((a in b); c;);
  // This pattern is produced by the JSCompiler when it collapses the
  // statement above into the conditional loop below. To prevent this from
  // happening, use a for-loop and reserve the init logic as below.

  // Parentheses added to eliminate strict JS warning in Firefox.
  for (var part; parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      // last part and we have an object; use it
      cur[part] = opt_object;
    } else if (cur[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};


/**
 * Returns an object based on its fully qualified external name.  If you are
 * using a compilation pass that renames property names beware that using this
 * function will not find renamed properties.
 *
 * @param {string} name The fully qualified name.
 * @param {Object=} opt_obj The object within which to look; default is
 *     |goog.global|.
 * @return {Object} The object or, if not found, null.
 */
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split('.');
  var cur = opt_obj || goog.global;
  for (var part; part = parts.shift(); ) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};


/**
 * Globalizes a whole namespace, such as goog or goog.lang.
 *
 * @param {Object} obj The namespace to globalize.
 * @param {Object=} opt_global The object to add the properties to.
 * @deprecated Properties may be explicitly exported to the global scope, but
 *     this should no longer be done in bulk.
 */
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};


/**
 * Adds a dependency from a file to the files it requires.
 * @param {string} relPath The path to the js file.
 * @param {Array} provides An array of strings with the names of the objects
 *                         this file provides.
 * @param {Array} requires An array of strings with the names of the objects
 *                         this file requires.
 */
goog.addDependency = function(relPath, provides, requires) {
  if (!COMPILED) {
    var provide, require;
    var path = relPath.replace(/\\/g, '/');
    var deps = goog.dependencies_;
    for (var i = 0; provide = provides[i]; i++) {
      deps.nameToPath[provide] = path;
      if (!(path in deps.pathToNames)) {
        deps.pathToNames[path] = {};
      }
      deps.pathToNames[path][provide] = true;
    }
    for (var j = 0; require = requires[j]; j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};




// NOTE(user): The debug DOM loader was included in base.js as an orignal
// way to do "debug-mode" development.  The dependency system can sometimes
// be confusing, as can the debug DOM loader's asyncronous nature.
//
// With the DOM loader, a call to goog.require() is not blocking -- the
// script will not load until some point after the current script.  If a
// namespace is needed at runtime, it needs to be defined in a previous
// script, or loaded via require() with its registered dependencies.
// User-defined namespaces may need their own deps file.  See http://go/js_deps,
// http://go/genjsdeps, or, externally, DepsWriter.
// http://code.google.com/closure/library/docs/depswriter.html
//
// Because of legacy clients, the DOM loader can't be easily removed from
// base.js.  Work is being done to make it disableable or replaceable for
// different environments (DOM-less JavaScript interpreters like Rhino or V8,
// for example). See bootstrap/ for more information.


/**
 * @define {boolean} Whether to enable the debug loader.
 *
 * If enabled, a call to goog.require() will attempt to load the namespace by
 * appending a script tag to the DOM (if the namespace has been registered).
 *
 * If disabled, goog.require() will simply assert that the namespace has been
 * provided (and depend on the fact that some outside tool correctly ordered
 * the script).
 */
goog.ENABLE_DEBUG_LOADER = true;


/**
 * Implements a system for the dynamic resolution of dependencies
 * that works in parallel with the BUILD system. Note that all calls
 * to goog.require will be stripped by the JSCompiler when the
 * --closure_pass option is used.
 * @see goog.provide
 * @param {string} name Namespace to include (as was given in goog.provide())
 *     in the form "goog.package.part".
 */
goog.require = function(name) {

  // if the object already exists we do not need do do anything
  // TODO(user): If we start to support require based on file name this has
  //            to change
  // TODO(user): If we allow goog.foo.* this has to change
  // TODO(user): If we implement dynamic load after page load we should probably
  //            not remove this code for the compiled output
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      return;
    }

    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return;
      }
    }

    var errorMessage = 'goog.require could not find: ' + name;
    if (goog.global.console) {
      goog.global.console['error'](errorMessage);
    }


      throw Error(errorMessage);

  }
};


/**
 * Path for included scripts
 * @type {string}
 */
goog.basePath = '';


/**
 * A hook for overriding the base path.
 * @type {string|undefined}
 */
goog.global.CLOSURE_BASE_PATH;


/**
 * Whether to write out Closure's deps file. By default,
 * the deps are written.
 * @type {boolean|undefined}
 */
goog.global.CLOSURE_NO_DEPS;


/**
 * A function to import a single script. This is meant to be overridden when
 * Closure is being run in non-HTML contexts, such as web workers. It's defined
 * in the global scope so that it can be set before base.js is loaded, which
 * allows deps.js to be imported properly.
 *
 * The function is passed the script source, which is a relative URI. It should
 * return true if the script was imported, false otherwise.
 */
goog.global.CLOSURE_IMPORT_SCRIPT;


/**
 * Null function used for default values of callbacks, etc.
 * @return {void} Nothing.
 */
goog.nullFunction = function() {};


/**
 * The identity function. Returns its first argument.
 *
 * @param {...*} var_args The arguments of the function.
 * @return {*} The first argument.
 * @deprecated Use goog.functions.identity instead.
 */
goog.identityFunction = function(var_args) {
  return arguments[0];
};


/**
 * When defining a class Foo with an abstract method bar(), you can do:
 *
 * Foo.prototype.bar = goog.abstractMethod
 *
 * Now if a subclass of Foo fails to override bar(), an error
 * will be thrown when bar() is invoked.
 *
 * Note: This does not take the name of the function to override as
 * an argument because that would make it more difficult to obfuscate
 * our JavaScript code.
 *
 * @type {!Function}
 * @throws {Error} when invoked to indicate the method should be
 *   overridden.
 */
goog.abstractMethod = function() {
  throw Error('unimplemented abstract method');
};


/**
 * Adds a {@code getInstance} static method that always return the same instance
 * object.
 * @param {!Function} ctor The constructor for the class to add the static
 *     method to.
 */
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    return ctor.instance_ || (ctor.instance_ = new ctor());
  };
};


if (!COMPILED && goog.ENABLE_DEBUG_LOADER) {
  /**
   * Object used to keep track of urls that have already been added. This
   * record allows the prevention of circular dependencies.
   * @type {Object}
   * @private
   */
  goog.included_ = {};


  /**
   * This object is used to keep track of dependencies and other data that is
   * used for loading scripts
   * @private
   * @type {Object}
   */
  goog.dependencies_ = {
    pathToNames: {}, // 1 to many
    nameToPath: {}, // 1 to 1
    requires: {}, // 1 to many
    // used when resolving dependencies to prevent us from
    // visiting the file twice
    visited: {},
    written: {} // used to keep track of script files we have written
  };


  /**
   * Tries to detect whether is in the context of an HTML document.
   * @return {boolean} True if it looks like HTML document.
   * @private
   */
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != 'undefined' &&
           'write' in doc;  // XULDocument misses write.
  };


  /**
   * Tries to detect the base path of the base.js script that bootstraps Closure
   * @private
   */
  goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else if (!goog.inHtmlDocument_()) {
      return;
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName('script');
    // Search backwards since the current script is in almost all cases the one
    // that has base.js.
    for (var i = scripts.length - 1; i >= 0; --i) {
      var src = scripts[i].src;
      var qmark = src.lastIndexOf('?');
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == 'base.js') {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };


  /**
   * Imports a script if, and only if, that script hasn't already been imported.
   * (Must be called at execution time)
   * @param {string} src Script source.
   * @private
   */
  goog.importScript_ = function(src) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT ||
        goog.writeScriptTag_;
    if (!goog.dependencies_.written[src] && importScript(src)) {
      goog.dependencies_.written[src] = true;
    }
  };


  /**
   * The default implementation of the import function. Writes a script tag to
   * import the script.
   *
   * @param {string} src The script source.
   * @return {boolean} True if the script was imported, false otherwise.
   * @private
   */
  goog.writeScriptTag_ = function(src) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      doc.write(
          '<script type="text/javascript" src="' + src + '"></' + 'script>');
      return true;
    } else {
      return false;
    }
  };


  /**
   * Resolves dependencies based on the dependencies added using addDependency
   * and calls importScript_ in the correct order.
   * @private
   */
  goog.writeScripts_ = function() {
    // the scripts we need to write this time
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;

    function visitNode(path) {
      if (path in deps.written) {
        return;
      }

      // we have already visited this one. We can get here if we have cyclic
      // dependencies
      if (path in deps.visited) {
        if (!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path);
        }
        return;
      }

      deps.visited[path] = true;

      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          // If the required name is defined, we assume that it was already
          // bootstrapped by other means.
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error('Undefined nameToPath for ' + requireName);
            }
          }
        }
      }

      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }

    for (var path in goog.included_) {
      if (!deps.written[path]) {
        visitNode(path);
      }
    }

    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i]) {
        goog.importScript_(goog.basePath + scripts[i]);
      } else {
        throw Error('Undefined script input');
      }
    }
  };


  /**
   * Looks at the dependency rules and tries to determine the script file that
   * fulfills a particular rule.
   * @param {string} rule In the form goog.namespace.Class or project.script.
   * @return {?string} Url corresponding to the rule, or null.
   * @private
   */
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };

  goog.findBasePath_();

  // Allow projects to manage the deps files themselves.
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + 'deps.js');
  }
}



//==============================================================================
// Language Enhancements
//==============================================================================


/**
 * This is a "fixed" version of the typeof operator.  It differs from the typeof
 * operator in such a way that null returns 'null' and arrays return 'array'.
 * @param {*} value The value to get the type of.
 * @return {string} The name of the type.
 */
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == 'object') {
    if (value) {
      // Check these first, so we can avoid calling Object.prototype.toString if
      // possible.
      //
      // IE improperly marshals tyepof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) {
        return 'array';
      } else if (value instanceof Object) {
        return s;
      }

      // HACK: In order to use an Object prototype method on the arbitrary
      //   value, the compiler requires the value be cast to type Object,
      //   even though the ECMA spec explicitly allows it.
      var className = Object.prototype.toString.call(
          /** @type {Object} */ (value));
      // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.
      if (className == '[object Window]') {
        return 'object';
      }

      // We cannot always use constructor == Array or instanceof Array because
      // different frames have different Array objects. In IE6, if the iframe
      // where the array was created is destroyed, the array loses its
      // prototype. Then dereferencing val.splice here throws an exception, so
      // we can't use goog.isFunction. Calling typeof directly returns 'unknown'
      // so that will work. In this case, this function will return false and
      // most array functions will still work because the array is still
      // array-like (supports length and []) even though it has lost its
      // prototype.
      // Mark Miller noticed that Object.prototype.toString
      // allows access to the unforgeable [[Class]] property.
      //  15.2.4.2 Object.prototype.toString ( )
      //  When the toString method is called, the following steps are taken:
      //      1. Get the [[Class]] property of this object.
      //      2. Compute a string value by concatenating the three strings
      //         "[object ", Result(1), and "]".
      //      3. Return Result(2).
      // and this behavior survives the destruction of the execution context.
      if ((className == '[object Array]' ||
           // In IE all non value types are wrapped as objects across window
           // boundaries (not iframe though) so we have to do object detection
           // for this edge case
           typeof value.length == 'number' &&
           typeof value.splice != 'undefined' &&
           typeof value.propertyIsEnumerable != 'undefined' &&
           !value.propertyIsEnumerable('splice')

          )) {
        return 'array';
      }
      // HACK: There is still an array case that fails.
      //     function ArrayImpostor() {}
      //     ArrayImpostor.prototype = [];
      //     var impostor = new ArrayImpostor;
      // this can be fixed by getting rid of the fast path
      // (value instanceof Array) and solely relying on
      // (value && Object.prototype.toString.vall(value) === '[object Array]')
      // but that would require many more function calls and is not warranted
      // unless closure code is receiving objects from untrusted sources.

      // IE in cross-window calls does not correctly marshal the function type
      // (it appears just as an object) so we cannot use just typeof val ==
      // 'function'. However, if the object has a call property, it is a
      // function.
      if ((className == '[object Function]' ||
          typeof value.call != 'undefined' &&
          typeof value.propertyIsEnumerable != 'undefined' &&
          !value.propertyIsEnumerable('call'))) {
        return 'function';
      }


    } else {
      return 'null';
    }

  } else if (s == 'function' && typeof value.call == 'undefined') {
    // In Safari typeof nodeList returns 'function', and on Firefox
    // typeof behaves similarly for HTML{Applet,Embed,Object}Elements
    // and RegExps.  We would like to return object for those and we can
    // detect an invalid function by making sure that the function
    // object has a call method.
    return 'object';
  }
  return s;
};


/**
 * Safe way to test whether a property is enumarable.  It allows testing
 * for enumerable on objects where 'propertyIsEnumerable' is overridden or
 * does not exist (like DOM nodes in IE). Does not use browser native
 * Object.propertyIsEnumerable.
 * @param {Object} object The object to test if the property is enumerable.
 * @param {string} propName The property name to check for.
 * @return {boolean} True if the property is enumarable.
 * @private
 */
goog.propertyIsEnumerableCustom_ = function(object, propName) {
  // KJS in Safari 2 is not ECMAScript compatible and lacks crucial methods
  // such as propertyIsEnumerable.  We therefore use a workaround.
  // Does anyone know a more efficient work around?
  if (propName in object) {
    for (var key in object) {
      if (key == propName &&
          Object.prototype.hasOwnProperty.call(object, propName)) {
        return true;
      }
    }
  }
  return false;
};


/**
 * Safe way to test whether a property is enumarable.  It allows testing
 * for enumerable on objects where 'propertyIsEnumerable' is overridden or
 * does not exist (like DOM nodes in IE).
 * @param {Object} object The object to test if the property is enumerable.
 * @param {string} propName The property name to check for.
 * @return {boolean} True if the property is enumarable.
 * @private
 */
goog.propertyIsEnumerable_ = function(object, propName) {
  // In IE if object is from another window, cannot use propertyIsEnumerable
  // from this window's Object. Will raise a 'JScript object expected' error.
  if (object instanceof Object) {
    return Object.prototype.propertyIsEnumerable.call(object, propName);
  } else {
    return goog.propertyIsEnumerableCustom_(object, propName);
  }
};


/**
 * Returns true if the specified value is not |undefined|.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.  Additionally, this function assumes that the global
 * undefined variable has not been redefined.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
goog.isDef = function(val) {
  return val !== undefined;
};


/**
 * Returns true if the specified value is |null|
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is null.
 */
goog.isNull = function(val) {
  return val === null;
};


/**
 * Returns true if the specified value is defined and not null
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */
goog.isDefAndNotNull = function(val) {
  // Note that undefined == null.
  return val != null;
};


/**
 * Returns true if the specified value is an array
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArray = function(val) {
  return goog.typeOf(val) == 'array';
};


/**
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == 'array' || type == 'object' && typeof val.length == 'number';
};


/**
 * Returns true if the object looks like a Date. To qualify as Date-like
 * the value needs to be an object and have a getFullYear() function.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == 'function';
};


/**
 * Returns true if the specified value is a string
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a string.
 */
goog.isString = function(val) {
  return typeof val == 'string';
};


/**
 * Returns true if the specified value is a boolean
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
goog.isBoolean = function(val) {
  return typeof val == 'boolean';
};


/**
 * Returns true if the specified value is a number
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
goog.isNumber = function(val) {
  return typeof val == 'number';
};


/**
 * Returns true if the specified value is a function
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
goog.isFunction = function(val) {
  return goog.typeOf(val) == 'function';
};


/**
 * Returns true if the specified value is an object.  This includes arrays
 * and functions.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
goog.isObject = function(val) {
  var type = goog.typeOf(val);
  return type == 'object' || type == 'array' || type == 'function';
};


/**
 * Gets a unique ID for an object. This mutates the object so that further
 * calls with the same object as a parameter returns the same value. The unique
 * ID is guaranteed to be unique across the current session amongst objects that
 * are passed into {@code getUid}. There is no guarantee that the ID is unique
 * or consistent across sessions. It is unsafe to generate unique ID for
 * function prototypes.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
goog.getUid = function(obj) {
  // TODO(user): Make the type stricter, do not accept null.

  // In Opera window.hasOwnProperty exists but always returns false so we avoid
  // using it. As a consequence the unique ID generated for BaseClass.prototype
  // and SubClass.prototype will be the same.
  return obj[goog.UID_PROPERTY_] ||
      (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};


/**
 * Removes the unique ID from an object. This is useful if the object was
 * previously mutated using {@code goog.getUid} in which case the mutation is
 * undone.
 * @param {Object} obj The object to remove the unique ID field from.
 */
goog.removeUid = function(obj) {
  // TODO(user): Make the type stricter, do not accept null.

  // DOM nodes in IE are not instance of Object and throws exception
  // for delete. Instead we try to use removeAttribute
  if ('removeAttribute' in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  /** @preserveTry */
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};


/**
 * Name for unique ID property. Initialized in a way to help avoid collisions
 * with other closure javascript on the same page.
 * @type {string}
 * @private
 */
goog.UID_PROPERTY_ = 'closure_uid_' +
    Math.floor(Math.random() * 2147483648).toString(36);


/**
 * Counter for UID.
 * @type {number}
 * @private
 */
goog.uidCounter_ = 0;


/**
 * Adds a hash code field to an object. The hash code is unique for the
 * given object.
 * @param {Object} obj The object to get the hash code for.
 * @return {number} The hash code for the object.
 * @deprecated Use goog.getUid instead.
 */
goog.getHashCode = goog.getUid;


/**
 * Removes the hash code field from an object.
 * @param {Object} obj The object to remove the field from.
 * @deprecated Use goog.removeUid instead.
 */
goog.removeHashCode = goog.removeUid;


/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>goog.cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>goog.cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated goog.cloneObject is unsafe. Prefer the goog.object methods.
 */
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == 'object' || type == 'array') {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == 'array' ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }

  return obj;
};


/**
 * Forward declaration for the clone method. This is necessary until the
 * compiler can better support duck-typing constructs as used in
 * goog.cloneObject.
 *
 * TODO(user): Remove once the JSCompiler can infer that the check for
 * proto.clone is safe in goog.cloneObject.
 *
 * @type {Function}
 */
Object.prototype.clone;


/**
 * A native implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 * @suppress {deprecated} The compiler thinks that Function.prototype.bind
 *     is deprecated because some people have declared a pure-JS version.
 *     Only the pure-JS version is truly deprecated.
 */
goog.bindNative_ = function(fn, selfObj, var_args) {
  return /** @type {!Function} */ (fn.call.apply(fn.bind, arguments));
};


/**
 * A pure-JS implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 */
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error();
  }

  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      // Prepend the bound arguments to the current arguments.
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };

  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};


/**
 * Partially applies this function to a particular 'this object' and zero or
 * more arguments. The result is a new function with some arguments of the first
 * function pre-filled and the value of |this| 'pre-specified'.<br><br>
 *
 * Remaining arguments specified at call-time are appended to the pre-
 * specified ones.<br><br>
 *
 * Also see: {@link #partial}.<br><br>
 *
 * Usage:
 * <pre>var barMethBound = bind(myFunction, myObj, 'arg1', 'arg2');
 * barMethBound('arg3', 'arg4');</pre>
 *
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @suppress {deprecated} See above.
 */
goog.bind = function(fn, selfObj, var_args) {
  // TODO(nicksantos): narrow the type signature.
  if (Function.prototype.bind &&
      // NOTE(nicksantos): Somebody pulled base.js into the default
      // Chrome extension environment. This means that for Chrome extensions,
      // they get the implementation of Function.prototype.bind that
      // calls goog.bind instead of the native one. Even worse, we don't want
      // to introduce a circular dependency between goog.bind and
      // Function.prototype.bind, so we have to hack this to make sure it
      // works correctly.
      Function.prototype.bind.toString().indexOf('native code') != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};


/**
 * Like bind(), except that a 'this object' is not required. Useful when the
 * target function is already bound.
 *
 * Usage:
 * var g = partial(f, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param {Function} fn A function to partially apply.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to fn.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 */
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    // Prepend the bound arguments to the current arguments.
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs);
  };
};


/**
 * Copies all the members of a source object to a target object. This method
 * does not work on all browsers for all objects that contain keys such as
 * toString or hasOwnProperty. Use goog.object.extend for this purpose.
 * @param {Object} target Target.
 * @param {Object} source Source.
 */
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }

  // For IE7 or lower, the for-in-loop does not contain any properties that are
  // not enumerable on the prototype object (for example, isPrototypeOf from
  // Object.prototype) but also it will not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
};


/**
 * @return {number} An integer value representing the number of milliseconds
 *     between midnight, January 1, 1970 and the current time.
 */
goog.now = Date.now || (function() {
  // Unary plus operator converts its operand to a number which in the case of
  // a date is done by calling getTime().
  return +new Date();
});


/**
 * Evals javascript in the global scope.  In IE this uses execScript, other
 * browsers use goog.global.eval. If goog.global.eval does not evaluate in the
 * global scope (for example, in Safari), appends a script tag instead.
 * Throws an exception if neither execScript or eval is defined.
 * @param {string} script JavaScript string.
 */
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, 'JavaScript');
  } else if (goog.global.eval) {
    // Test to see if eval works
    if (goog.evalWorksForGlobals_ == null) {
      goog.global.eval('var _et_ = 1;');
      if (typeof goog.global['_et_'] != 'undefined') {
        delete goog.global['_et_'];
        goog.evalWorksForGlobals_ = true;
      } else {
        goog.evalWorksForGlobals_ = false;
      }
    }

    if (goog.evalWorksForGlobals_) {
      goog.global.eval(script);
    } else {
      var doc = goog.global.document;
      var scriptElt = doc.createElement('script');
      scriptElt.type = 'text/javascript';
      scriptElt.defer = false;
      // Note(user): can't use .innerHTML since "t('<test>')" will fail and
      // .text doesn't work in Safari 2.  Therefore we append a text node.
      scriptElt.appendChild(doc.createTextNode(script));
      doc.body.appendChild(scriptElt);
      doc.body.removeChild(scriptElt);
    }
  } else {
    throw Error('goog.globalEval not available');
  }
};


/**
 * Indicates whether or not we can call 'eval' directly to eval code in the
 * global scope. Set to a Boolean by the first call to goog.globalEval (which
 * empirically tests whether eval works for globals). @see goog.globalEval
 * @type {?boolean}
 * @private
 */
goog.evalWorksForGlobals_ = null;


/**
 * Optional map of CSS class names to obfuscated names used with
 * goog.getCssName().
 * @type {Object|undefined}
 * @private
 * @see goog.setCssNameMapping
 */
goog.cssNameMapping_;


/**
 * Optional obfuscation style for CSS class names. Should be set to either
 * 'BY_WHOLE' or 'BY_PART' if defined.
 * @type {string|undefined}
 * @private
 * @see goog.setCssNameMapping
 */
goog.cssNameMappingStyle_;


/**
 * Handles strings that are intended to be used as CSS class names.
 *
 * This function works in tandem with @see goog.setCssNameMapping.
 *
 * Without any mapping set, the arguments are simple joined with a
 * hyphen and passed through unaltered.
 *
 * When there is a mapping, there are two possible styles in which
 * these mappings are used. In the BY_PART style, each part (i.e. in
 * between hyphens) of the passed in css name is rewritten according
 * to the map. In the BY_WHOLE style, the full css name is looked up in
 * the map directly. If a rewrite is not specified by the map, the
 * compiler will output a warning.
 *
 * When the mapping is passed to the compiler, it will replace calls
 * to goog.getCssName with the strings from the mapping, e.g.
 *     var x = goog.getCssName('foo');
 *     var y = goog.getCssName(this.baseClass, 'active');
 *  becomes:
 *     var x= 'foo';
 *     var y = this.baseClass + '-active';
 *
 * If one argument is passed it will be processed, if two are passed
 * only the modifier will be processed, as it is assumed the first
 * argument was generated as a result of calling goog.getCssName.
 *
 * @param {string} className The class name.
 * @param {string=} opt_modifier A modifier to be appended to the class name.
 * @return {string} The class name or the concatenation of the class name and
 *     the modifier.
 */
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };

  var renameByParts = function(cssName) {
    // Remap all the parts individually.
    var parts = cssName.split('-');
    var mapped = [];
    for (var i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join('-');
  };

  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == 'BY_WHOLE' ?
        getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }

  if (opt_modifier) {
    return className + '-' + rename(opt_modifier);
  } else {
    return rename(className);
  }
};


/**
 * Sets the map to check when returning a value from goog.getCssName(). Example:
 * <pre>
 * goog.setCssNameMapping({
 *   "goog": "a",
 *   "disabled": "b",
 * });
 *
 * var x = goog.getCssName('goog');
 * // The following evaluates to: "a a-b".
 * goog.getCssName('goog') + ' ' + goog.getCssName(x, 'disabled')
 * </pre>
 * When declared as a map of string literals to string literals, the JSCompiler
 * will replace all calls to goog.getCssName() using the supplied map if the
 * --closure_pass flag is set.
 *
 * @param {!Object} mapping A map of strings to strings where keys are possible
 *     arguments to goog.getCssName() and values are the corresponding values
 *     that should be returned.
 * @param {string=} opt_style The style of css name mapping. There are two valid
 *     options: 'BY_PART', and 'BY_WHOLE'.
 * @see goog.getCssName for a description.
 */
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};


/**
 * Abstract implementation of goog.getMsg for use with localized messages.
 * @param {string} str Translatable string, places holders in the form {$foo}.
 * @param {Object=} opt_values Map of place holder name to value.
 * @return {string} message with placeholders filled.
 */
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {};
  for (var key in values) {
    var value = ('' + values[key]).replace(/\$/g, '$$$$');
    str = str.replace(new RegExp('\\{\\$' + key + '\\}', 'gi'), value);
  }
  return str;
};


/**
 * Exposes an unobfuscated global namespace path for the given object.
 * Note that fields of the exported object *will* be obfuscated,
 * unless they are exported in turn via this function or
 * goog.exportProperty
 *
 * <p>Also handy for making public items that are defined in anonymous
 * closures.
 *
 * ex. goog.exportSymbol('Foo', Foo);
 *
 * ex. goog.exportSymbol('public.path.Foo.staticFunction',
 *                       Foo.staticFunction);
 *     public.path.Foo.staticFunction();
 *
 * ex. goog.exportSymbol('public.path.Foo.prototype.myMethod',
 *                       Foo.prototype.myMethod);
 *     new public.path.Foo().myMethod();
 *
 * @param {string} publicPath Unobfuscated name to export.
 * @param {*} object Object the name should point to.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is |goog.global|.
 */
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};


/**
 * Exports a property unobfuscated into the object's namespace.
 * ex. goog.exportProperty(Foo, 'staticFunction', Foo.staticFunction);
 * ex. goog.exportProperty(Foo.prototype, 'myMethod', Foo.prototype.myMethod);
 * @param {Object} object Object whose static property is being exported.
 * @param {string} publicName Unobfuscated name to export.
 * @param {*} symbol Object the name should point to.
 */
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { }
 *
 * function ChildClass(a, b, c) {
 *   goog.base(this, a, b);
 * }
 * goog.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // works
 * </pre>
 *
 * In addition, a superclass' implementation of a method can be invoked
 * as follows:
 *
 * <pre>
 * ChildClass.prototype.foo = function(a) {
 *   ChildClass.superClass_.foo.call(this, a);
 *   // other code
 * };
 * </pre>
 *
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
goog.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
};


/**
 * Call up to the superclass.
 *
 * If this is called from a constructor, then this calls the superclass
 * contructor with arguments 1-N.
 *
 * If this is called from a prototype method, then you must pass
 * the name of the method as the second argument to this function. If
 * you do not, you will get a runtime error. This calls the superclass'
 * method with arguments 2-N.
 *
 * This function only works if you use goog.inherits to express
 * inheritance relationships between your classes.
 *
 * This function is a compiler primitive. At compile-time, the
 * compiler will do macro expansion to remove a lot of
 * the extra overhead that this function introduces. The compiler
 * will also enforce a lot of the assumptions that this function
 * makes, and treat it as a compiler error if you break them.
 *
 * @param {!Object} me Should always be "this".
 * @param {*=} opt_methodName The method name if calling a super method.
 * @param {...*} var_args The rest of the arguments.
 * @return {*} The return value of the superclass method.
 */
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (caller.superClass_) {
    // This is a constructor. Call the superclass constructor.
    return caller.superClass_.constructor.apply(
        me, Array.prototype.slice.call(arguments, 1));
  }

  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for (var ctor = me.constructor;
       ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return ctor.prototype[opt_methodName].apply(me, args);
    }
  }

  // If we did not find the caller in the prototype chain,
  // then one of two things happened:
  // 1) The caller is an instance method.
  // 2) This method was not called by the right caller.
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error(
        'goog.base called from a method of one name ' +
        'to a method of a different name');
  }
};


/**
 * Allow for aliasing within scope functions.  This function exists for
 * uncompiled code - in compiled code the calls will be inlined and the
 * aliases applied.  In uncompiled code the function is simply run since the
 * aliases as written are valid JavaScript.
 * @param {function()} fn Function to call.  This function can contain aliases
 *     to namespaces (e.g. "var dom = goog.dom") or classes
 *    (e.g. "var Timer = goog.Timer").
 */
goog.scope = function(fn) {
  fn.call(goog.global);
};



// Input 1
/**
 * @fileoverview Helper functions for manipulating arrays.
 */

goog.provide('treesaver.array');

goog.scope(function() {
  var array = treesaver.array;

  if (!'isArray' in Array) {
    /**
     * Test Array-ness.
     *
     * @param {*} arr
     * @return {boolean}
     * NOTE: Suppress warnings about duplication from built-in externs.
     * @suppress {duplicate}
     */
    Array.isArray = function(arr) {
      return Object.prototype.toString.apply(/** @type {Object} */(arr)) ===
        '[object Array]';
    };
  }

  /**
   * Convert array-like things to an array
   *
   * @param {*} obj
   * @return {!Array}
   */
  array.toArray = function(obj) {
    return Array.prototype.slice.call(/** @type {Object} */(obj), 0);
  };

  /**
   * Remove an index from an array
   * By John Resig (MIT Licensed)
   *
   * @param {!Array} arr
   * @param {!number} from
   * @param {number=} to
   */
  array.remove = function(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    return arr.push.apply(arr, rest);
  };
});

// Input 2
/**
 * @fileoverview Definition of constants.
 */

goog.provide('treesaver.constants');

/**
 * The version number of the code used to build a production
 * bundle.
 *
 * @define {string}
 */
treesaver.VERSION = 'dev';

goog.exportSymbol('treesaver.VERSION', treesaver.VERSION);

/**
 * @const
 * @type {number}
 */
treesaver.LOAD_TIMEOUT = 5000; // 5 seconds

/**
 * Whether Internet Explorer should be supported
 *
 * @define {boolean}
 */
var SUPPORT_IE = true;

/**
 * How long until the UI is deemed idle
 *
 * @define {number}
 */
var UI_IDLE_INTERVAL = 5000; // 5 seconds

/**
 * How long to wait before kicking off repagination when resizing
 *
 * @define {number}
 */
var PAGINATE_DEBOUNCE_TIME = 200; // .2 seconds

/**
 * How many pixels of movement before it's considered a swipe
 *
 * @define {number}
 */
var SWIPE_THRESHOLD = 30;

/**
 * How much time can elapse before the swipe is ignored
 *
 * @define {number}
 */
var SWIPE_TIME_LIMIT = 2000; // 2 seconds

/**
 * Length of page animations
 *
 * @define {number}
 */
var MAX_ANIMATION_DURATION = 200; // .2 seconds

/**
 * How often to check for resizes and orientations
 *
 * @define {number}
 */
var CHECK_STATE_INTERVAL = 100; // .1 seconds

/**
 * How long to wait between mouse wheel events
 * Magic mouse can generate a ridiculous number of events
 *
 * @define {number}
 */
var MOUSE_WHEEL_INTERVAL = 400; // .4 seconds

/**
 * Is the application being hosted within the iOS wrapper?
 *
 * @define {boolean}
 */
var WITHIN_IOS_WRAPPER = false;

// Input 3
/**
 * @fileoverview Capability testing and tracking library.
 *
 */

goog.provide('treesaver.capabilities');

goog.require('treesaver.array'); // array.some
goog.require('treesaver.constants');
// Avoid circular dependency
// goog.require('treesaver.network');

goog.scope(function() {
  var capabilities = treesaver.capabilities,
      constants = treesaver.constants;

  /**
   * Cached value of browser user agent
   *
   * @const
   * @private
   * @type {string}
   */
  capabilities.ua_ = window.navigator.userAgent.toLowerCase();

  /**
   * Cached value of browser platform
   *
   * @const
   * @private
   * @type {string}
   */
  capabilities.platform_ =
    // Android 1.6 doesn't have a value for navigator.platform
    window.navigator.platform ?
    window.navigator.platform.toLowerCase() :
    /android/.test(capabilities.ua_) ? 'android' : 'unknown';

  /**
   * Does the current browser meet the Treesaver requirements
   *
   * @const
   * @type {boolean}
   */
  capabilities.SUPPORTS_TREESAVER = (
    // Can't be in quirks mode (box model issues)
    document.compatMode !== 'BackCompat' &&
    // Need W3C AJAX (excludes IE6)
    'XMLHttpRequest' in window &&
    // W3C event model (excludes IE8 and below)
    'addEventListener' in document &&
    // Runtime styles (needed for measuring)
    'getComputedStyle' in window &&
    // querySelectorAll
    'querySelectorAll' in document &&
    // Local storage
    'localStorage' in window &&
    // JSON
    'JSON' in window
  );

  /**
   * Are we running within a native app?
   *
   * @const
   * @type {boolean}
   */
  capabilities.IS_NATIVE_APP = WITHIN_IOS_WRAPPER ||
    !!window.TS_WITHIN_NATIVE_IOS_APP;

  /**
   * Is the browser running on a mobile device?
   *
   * @const
   * @type {boolean}
   */
  capabilities.IS_MOBILE = capabilities.IS_NATIVE_APP ||
    capabilities.BROWSER_OS === 'android' ||
    /mobile/.test(capabilities.ua_);

  /**
   * Does the device have a small screen?
   *
   * @const
   * @type {boolean}
   */
  capabilities.IS_SMALL_SCREEN =
    window.screen.width <= 600;

  /**
   * Name of the current browser. Possible values:
   *   - msie
   *   - chrome
   *   - safari
   *   - webkit
   *   - mozilla
   *   - opera
   *   - unknown
   *
   * @const
   * @type {string}
   */
  capabilities.BROWSER_NAME = (function() {
    if (capabilities.IS_NATIVE_APP) {
      return 'safari';
    }

    // TODO: This code is all terrible
    // Luckily it runs only once
    if (/webkit/.test(capabilities.ua_)) {
      if (/chrome|safari/.test(capabilities.ua_)) {
        return (/(chrome|safari)/).exec(capabilities.ua_)[0];
      }
      else {
        return 'webkit';
      }
    }
    else if (/opera/.test(capabilities.ua_)) {
      return 'opera';
    }
    else if (/msie/.test(capabilities.ua_)) {
      return 'msie';
    }
    else if (!/compatible/.test(capabilities.ua_) &&
      /mozilla/.test(capabilities.ua_)) {
      return 'mozilla';
    }
    else {
      return 'unknown';
    }
  }());

  /**
   * Which OS is the browser running on, possible values:
   *   - win
   *   - mac
   *   - linux
   *   - iphone
   *   - ipad
   *   - ipod
   *   - android
   *   - unknown
   *
   * @const
   * @type {string}
   */
  capabilities.BROWSER_OS =
    (/(android|ipad|iphone|ipod|win|mac|linux)/.
    exec(capabilities.platform_) || ['unknown'])[0];

  /**
   * Browser engine prefix for non-standard CSS properties
   *
   * @const
   * @type {string}
   */
  capabilities.cssPrefix = (function() {
    switch (capabilities.BROWSER_NAME) {
    case 'chrome':
    case 'safari':
    case 'webkit':
      return '-webkit-';
    case 'mozilla':
      return '-moz-';
    case 'msie':
      return '-ms-';
    case 'opera':
      return '-o-';
    default:
      return '';
    }
  }());

  /**
   * Browser engine prefix for non-standard CSS properties
   *
   * @const
   * @type {string}
   */
  capabilities.domCSSPrefix = (function() {
    switch (capabilities.BROWSER_NAME) {
    case 'chrome':
    case 'safari':
    case 'webkit':
      return 'Webkit';
    case 'mozilla':
      return 'Moz';
    case 'msie':
      return 'ms';
    case 'opera':
      return 'O';
    default:
      return '';
    }
  }());

  /**
   * Helper function for testing CSS properties
   *
   * @private
   * @param {!string} propName
   * @param {boolean=} testPrefix
   * @param {boolean=} skipPrimary
   * @return {boolean}
   */
  capabilities.cssPropertySupported_ = function(propName, testPrefix, skipPrimary) {
    var styleObj = document.documentElement.style,
        prefixed = testPrefix && capabilities.domCSSPrefix ?
          (capabilities.domCSSPrefix + propName[0].toUpperCase() + propName.substr(1)) :
          false;

    return (!skipPrimary && typeof styleObj[propName] !== 'undefined') ||
          (!!prefixed && typeof styleObj[prefixed] !== 'undefined');
  };

  /**
   * Helper function for testing support of a CSS @media query
   * Hat tip to Modernizr for this code
   *
   * @private
   * @param {!string} queryName
   * @param {boolean=} testPrefix
   * @return {boolean}
   */
  capabilities.mediaQuerySupported_ = function(queryName, testPrefix) {
    var st = document.createElement('style'),
        div = document.createElement('div'),
        div_id = 'ts-test',
        mq = '@media (' + queryName + ')',
        result;

    if (testPrefix) {
      mq += ',(' + capabilities.cssPrefix + queryName + ')';
    }

    st.textContent = mq + '{#' + div_id + ' {height:3px}}';
    div.setAttribute('id', div_id);
    document.documentElement.appendChild(st);
    document.documentElement.appendChild(div);

    // Confirm the style was applied
    result = div.offsetHeight === 3;

    document.documentElement.removeChild(st);
    document.documentElement.removeChild(div);

    return result;
  };

  /**
   * Whether the browser exposes orientation information
   *
   * @const
   * @type {boolean}
   */
  capabilities.SUPPORTS_ORIENTATION = capabilities.IS_NATIVE_APP ||
    'orientation' in window;

  /**
   * Whether the browser supports touch events
   *
   * @const
   * @type {boolean}
   */
  capabilities.SUPPORTS_TOUCH = capabilities.IS_NATIVE_APP ||
    'createTouch' in document ||
    // Android doesn't expose createTouch, use quick hack
    /android/.test(capabilities.ua_);

  /**
   * Does the browser have flash support?
   *
   * @const
   * @type {boolean}
   */
  capabilities.SUPPORTS_FLASH = !capabilities.IS_NATIVE_APP && (function() {
    if (!!window.navigator.plugins && window.navigator.plugins.length) {
      // Non-IE browsers are pretty simple
      return !!window.navigator.plugins['Shockwave Flash'];
    }
    else if (SUPPORT_IE && 'ActiveXObject' in window) {
      try {
        // Throws exception if not in registry
        return !!(new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash.7'));
      }
      catch (e) {
        // Instantiation failed
        return false;
      }
    }

    return false;
  }());

  /**
   * Does the browser support custom fonts via @font-face
   *
   * Note that this detection is fast, but imperfect. Gives a false positive
   * for a few fringe browsers.
   *
   * @const
   * @type {boolean}
   */
  capabilities.SUPPORTS_FONTFACE = (function() {
    // Quick and easy test that works in FF2+, Safari, IE9+, and Opera
    // Note: This gives a false positive for older versions of Chrome,
    // (version 3 and earlier). Market share is too low to care
    return 'CSSFontFaceRule' in window;
  }());

  /**
   * Whether the browser supports <canvas>
   *
   * @const
   * @type {boolean}
   */
  capabilities.SUPPORTS_CANVAS =
    'getContext' in document.createElement('canvas');

  /**
   * SVG detection based on Modernizr (http://www.modernizr.com)
   * Copyright (c) 2009-2011, Faruk Ates and Paul Irish
   * Dual-licensed under the BSD or MIT licenses.
   */
  if ('createElementNS' in document) {
    /**
     * Whether the browser supports SVG
     *
     * @const
     * @type {boolean}
     */
    capabilities.SUPPORTS_SVG =
      // Don't bother with SVG in IE7/8
      'createElementNS' in document &&
      'createSVGRect' in document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    /**
     * Whether the browser supports SMIL
     *
     * @const
     * @type {boolean}
     */
    capabilities.SUPPORTS_SMIL = capabilities.SUPPORTS_SVG &&
      /SVG/.test(document.createElementNS('http://www.w3.org/2000/svg', 'animate').toString());

    /**
     * Whether the browser supports SVG clip paths
     *
     * @const
     * @type {boolean}
     */
    capabilities.SUPPORTS_SVGCLIPPATHS = capabilities.SUPPORTS_SVG &&
      /SVG/.test(document.createElementNS('http://www.w3.org/2000/svg', 'clipPath').toString());
  }

  capabilities.SUPPORTS_INLINESVG = (function() {
    var div = document.createElement('div');
    div.innerHTML = '<svg/>';
    return (div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
  }());

  /**
   * Whether the browser can play <video>
   *
   * @const
   * @type {boolean}
   */
  capabilities.SUPPORTS_VIDEO =
    'canPlayType' in document.createElement('video');

  /**
   * Whether the browser supports localStorage
   *
   * @const
   * @type {boolean}
   */
  capabilities.SUPPORTS_LOCALSTORAGE = 'localStorage' in window;

  /**
   * Whether the browser supports offline web applications
   *
   * @const
   * @type {boolean}
   */
  capabilities.SUPPORTS_APPLICATIONCACHE =
    !capabilities.IS_NATIVE_APP && 'applicationCache' in window;

  /**
   * Whether the page was loaded from the home screen
   *
   * @const
   * @type {boolean}
   */
  capabilities.IS_FULLSCREEN = capabilities.IS_NATIVE_APP ||
    window.navigator.standalone;

  /**
   * Whether the browser supports CSS transforms
   *
   * @const
   * @type {boolean}
   */
  capabilities.SUPPORTS_CSSTRANSFORMS = capabilities.IS_NATIVE_APP ||
    capabilities.cssPropertySupported_('transformProperty') ||
    // Browsers used WebkitTransform instead of WebkitTransformProperty
    capabilities.cssPropertySupported_('transform', true, true);

  /**
   * Whether the browser supports CSS 3d transforms
   *
   * @const
   * @type {boolean}
   */
  capabilities.SUPPORTS_CSSTRANSFORMS3D = capabilities.IS_NATIVE_APP ||
    (function() {
      var result = capabilities.cssPropertySupported_('perspectiveProperty') ||
        capabilities.cssPropertySupported_('perspective', true, true);

      // Chrome gives false positives for webkitPerspective
      // Hat tip to modernizr
      if (result && 'WebkitPerspective' in document.documentElement.style &&
        capabilities.BROWSER_NAME !== 'safari') {
        // Confirm support via media query test
        result = capabilities.mediaQuerySupported_('perspective', true);
      }

      return result;
    }());

  /**
   * Whether the browser supports CSS transitions
   *
   * @const
   * @type {boolean}
   */
  capabilities.SUPPORTS_CSSTRANSITIONS = capabilities.IS_NATIVE_APP ||
    capabilities.cssPropertySupported_('transitionProperty', true);

  /**
   * Whether the browser supports sub-pixel rendering
   *
   * @const
   * @type {boolean}
   */
  capabilities.SUPPORTS_SUBPIXELS = (function() {
    var d = document.createElement('div'),
        result;

    d.style['visibility'] = 'hidden';
    d.style['fontSize'] = '13px';
    d.style['height'] = '1.5em';

    document.documentElement.appendChild(d);
    result = (d.getBoundingClientRect().height % 1);
    document.documentElement.removeChild(d);

    return result;
  }());

  /**
   * Current browser capabilities
   *
   * @private
   * @type {Array.<string>}
   */
  capabilities.caps_;

  /**
   * Mutable browser capabilities, such as online/offline, that may change
   * after a page is loaded
   *
   * @private
   * @type {Array.<string>}
   */
  capabilities.mutableCaps_;

  /**
   * Return 'no-' if false
   *
   * @private
   * @param {!boolean} val
   * @return {!string} 'no-' if val is false, '' otherwise.
   */
  capabilities.doPrefix_ = function(val) {
    return val ? '' : 'no-';
  };

  /**
   * Test the browser's capabilities and populate the cached caps_ array
   *
   * @private
   */
  capabilities.update_ = function() {
    // Ugh, closure style makes this really gross, store function
    // for some reprieve
    var p = capabilities.doPrefix_;

    if (!capabilities.caps_) {
      // First run through, populate the static capabilities that never change
      capabilities.caps_ = [];
      capabilities.caps_.push(
        // Use the same class names as modernizr when applicable
        'js',
        p(capabilities.SUPPORTS_CANVAS) + 'canvas',
        p(capabilities.SUPPORTS_LOCALSTORAGE) + 'localstorage',
        p(capabilities.SUPPORTS_VIDEO) + 'video',
        p(capabilities.SUPPORTS_APPLICATIONCACHE) + 'applicationcache',
        p(capabilities.SUPPORTS_FONTFACE) + 'fontface',
        p(capabilities.SUPPORTS_TOUCH) + 'touch',
        p(capabilities.SUPPORTS_CSSTRANSFORMS) + 'csstransforms',
        p(capabilities.SUPPORTS_CSSTRANSFORMS3D) + 'csstransforms3d',
        p(capabilities.SUPPORTS_CSSTRANSITIONS) + 'csstransitions',
        p(capabilities.SUPPORTS_SVG) + 'svg',
        p(capabilities.SUPPORTS_INLINESVG) + 'inlinesvg',
        p(capabilities.SUPPORTS_SMIL) + 'smil',
        p(capabilities.SUPPORTS_SVGCLIPPATHS) + 'svgclippaths',
        // Not in modernizr
        p(capabilities.SUPPORTS_TREESAVER) + 'treesaver',
        p(capabilities.SUPPORTS_FLASH) + 'flash',
        p(capabilities.SUPPORTS_ORIENTATION) + 'orientation',
        p(capabilities.IS_FULLSCREEN) + 'fullscreen',
        p(capabilities.IS_MOBILE) + 'mobile',
        p(capabilities.IS_SMALL_SCREEN) + 'smallscreen',
        p(treesaver.network.loadedFromCache()) + 'cached',
        p(capabilities.IS_NATIVE_APP) + 'nativeapp',
        p(capabilities.SUPPORTS_SUBPIXELS) + 'subpixels',
        // Browser/platform info
        'browser-' + capabilities.BROWSER_NAME,
        'os-' + capabilities.BROWSER_OS
      );
    }

    // Always update mutable info
    capabilities.mutableCaps_ = [
      // Online/offline
      p(!treesaver.network.isOnline()) + 'offline'
    ];

    if (capabilities.SUPPORTS_ORIENTATION) {
      // Orientation
      capabilities.mutableCaps_.push(
        'orientation-' + (window['orientation'] ? 'horizontal' : 'vertical')
      );
    }
  };

  /**
   * Have the stable capability flags been added to the <html> element?
   *
   * @private
   * @type {boolean}
   */
  capabilities.capsFlagged_ = false;

  /**
   * Update the classes on the <html> element based on current capabilities
   */
  capabilities.updateClasses = function() {
    // Refresh stored capabilities
    capabilities.update_();

    var className = document.documentElement.className;

    if (!capabilities.capsFlagged_) {
      capabilities.capsFlagged_ = true;

      if (className) {
        // First time through, remove no-js and no-treesaver flags, if present
        className = className.replace(/no-js|no-treesaver/g, '');
      }
      else {
        // Class was blank, give an initial value
        className = '';
      }

      // Add the non-mutable capabilities on the body
      className += ' ' + capabilities.caps_.join(' ');
    }

    // Now, remove values of mutable capabilities
    // TODO: As we get more of these, need a simpler way to filter out the old values
    // Make sure to reset the lastIndex for non-sticky search
    capabilities.mutableCapabilityRegex_.lastIndex = 0;
    className = className.replace(capabilities.mutableCapabilityRegex_, '');

    className += ' ' + capabilities.mutableCaps_.join(' ');

    // Now set the classes (and normalize whitespace)
    document.documentElement.className = className.split(/\s+/).join(' ');
  };

  /**
   * Reset the classes on the documentElement to a non-treesaver
   */
  capabilities.resetClasses = function() {
    document.documentElement.className = 'js no-treesaver';
  };

  /**
   * Array with all the mutable capability names
   *
   * @private
   * @type {!Array.<string>}
   */
  capabilities.mutableCapabilityList_ = [
    'offline',
    'orientation-vertical',
    'orientation-horizontal'
  ];

  /**
   * Regex for removing mutable capabilities from a string
   *
   * @private
   * @type {!RegExp}
   */
  capabilities.mutableCapabilityRegex_ = (function() {
    var terms = capabilities.mutableCapabilityList_.map(function(term) {
      return '((no-)?' + term + ')';
    });

    return new RegExp(terms.join('|'), 'g');
  }());

  /**
   * Check if a set of requirements are met by the current browser state
   *
   * @param {!Array.<string>} required Required capabilities.
   * @param {boolean=} useMutable Whether mutable capabilities should be
   *                                checked as well.
   * @return {boolean} True if requirements are met.
   */
  capabilities.check = function checkCapabilities(required, useMutable) {
    if (!required.length) {
      return true;
    }

    // Requirements are in the form of 'flash', 'offline', or 'no-orientation'
    return required.every(function(req) {
      var isNegation = req.substr(0, 3) === 'no-',
          rootReq = isNegation ? req.substr(3) : req,
          allCaps = capabilities.caps_.concat(
            useMutable ? capabilities.mutableCaps_ : []
          );

      if (isNegation) {
        // If it's negation, make sure the capability isn't in the capability list
        return allCaps.indexOf(rootReq) === -1;
      }
      else {
        if (allCaps.indexOf(rootReq) !== -1) {
          // Have the capability, all good
          return true;
        }

        // Requirement may be a mutable property, need to check
        if (!useMutable &&
            capabilities.mutableCapabilityList_.indexOf(rootReq) !== -1) {
            // Requirement isn't met, but is mutable, let it pass for now
            return true;
        }

        return false;
      }
    });
  };
});

// Input 4
/**
 * @fileoverview Logging functions for use while debugging.
 */

goog.provide('treesaver.debug');

goog.require('treesaver.capabilities');

goog.scope(function() {
  var debug = treesaver.debug;

  /**
   * Original load time of debug code
   *
   * @const
   * @type {number}
   */
  debug.startupTime_ = goog.now();

  /**
   * Creates a timestamp for a log entry
   *
   * @return {!string}
   */
  debug.timestamp_ = function() {
    return '[' + (goog.now() - debug.startupTime_).toFixed(3) / 1000 + 's] ';
  };

  /**
   * Log a message
   * @param {!string} msg
   */
  debug.info = function(msg) {
    if (goog.DEBUG && window.console) {
      msg = debug.timestamp_() + msg;

      if ('info' in window.console) {
        window.console['info'](msg);
      }
      else {
        window.console.log(msg);
      }
    }
  };

  /**
   * Log a message
   * @param {!string} msg
   */
  debug.log = function(msg) {
    if (goog.DEBUG && window.console) {
      msg = debug.timestamp_() + msg;

      if ('debug' in window.console) {
        window.console['debug'](msg);
      }
      else {
        window.console.log(msg);
      }
    }
  };

  /**
   * Log a message
   * @param {!string} msg
   */
  debug.warn = function(msg) {
    if (goog.DEBUG && window.console) {
      msg = debug.timestamp_() + msg;

      if ('warn' in window.console) {
        window.console['warn'](msg);
      }
      else {
        window.console.log(msg);
      }
    }
  };

  /**
   * Log a message
   * @param {!string} msg
   */
  debug.error = function(msg) {
    if (goog.DEBUG && window.console) {
      msg = debug.timestamp_() + msg;

      if ('error' in window.console) {
        window.console['error'](msg);
      }
      else {
        window.console.log(msg);
      }
    }
  };

  /**
   * Assert helper
   * @param {boolean} assertion
   * @param {?string} msg
   */
  debug.assert = function(assertion, msg) {
    if (goog.DEBUG && window.console) {
      if ('assert' in window.console) {
        window.console['assert'](assertion, msg);
      }
      else if (!assertion) {
        debug.error('Assertion failed: ' + msg);
      }
    }
  };

  debug.info('Running in DEBUG mode');
});

// Input 5
/**
 * @fileoverview Basic task scheduling.
 *
 */

goog.provide('treesaver.scheduler');

goog.require('treesaver.array');
goog.require('treesaver.debug');

goog.scope(function() {
  var scheduler = treesaver.scheduler,
      debug = treesaver.debug,
      array = treesaver.array;

  /**
   * Milliseconds between checks for task execution
   *
   * @const
   * @type {number}
   */
  scheduler.TASK_INTERVAL = 17; // ~60 fps

  /**
   * Array of all tasks
   *
   * @private
   * @type {!Array}
   */
  scheduler.tasks_ = [];

  /**
   * Map of named tasks
   *
   * @private
   * @type {Object}
   */
  scheduler.namedTasks_ = {};

  /**
   * If set, suspends all tasks except the ones named in this array
   *
   * @private
   * @type {Array.<string>}
   */
  scheduler.taskWhitelist_ = null;

  /**
   * ID of the scheduler tick task
   *
   * @private
   */
  scheduler.tickID_ = -1;

  /**
   * ID of the pausing task
   *
   * @private
   */
  scheduler.pauseTimeoutId_ = -1;

  /**
   * Based on Paul Irish's requestAnimationFrame
   *
   * @private
   */
  scheduler.requestAnimationFrameFunction_ = function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback, element) {
        return window.setTimeout(callback, scheduler.TASK_INTERVAL);
      }
  }();

  /**
   * @private
   */
  scheduler.requestAnimationFrame_ = function(f, el) {
    return scheduler.requestAnimationFrameFunction_.call(window, f, el);
  };

  /**
   * @private
   */
  scheduler.cancelAnimationFrameFunction_ = function() {
    return window.cancelAnimationFrame ||
      window.webkitCancelRequestAnimationFrame ||
      window.mozCancelRequestAnimationFrame ||
      window.oCancelRequestAnimationFrame ||
      window.msCancelRequestAnimationFrame ||
      window.clearTimeout;
  }();

  /**
   * @private
   */
  scheduler.cancelAnimationFrame_ = function(id) {
    return scheduler.cancelAnimationFrameFunction_.call(window, id);
  };

  /**
   * Master callback for task execution
   * @private
   */
  scheduler.tick_ = function() {
    var now = goog.now();

    scheduler.tasks_.forEach(function(task, i) {
      // If the tick function is no longer on interval, prevent all task
      // execution
      if (scheduler.tickID_ === -1) {
        return;
      }

      // Was the task removed? If so, skip execution
      if (task.removed) {
        return;
      }

      // Is the whitelist active?
      if (scheduler.taskWhitelist_) {
        if (!task.name ||
          scheduler.taskWhitelist_.indexOf(task.name) === -1) {
          // Task is not on whitelist, go to next
          return;
        }
      }

      // Is it time to run the task yet?
      if ((now - task.last) <= task.interval) {
        return;
      }

      task.last = now;
      task.times -= 1;

      if (task.times <= 0) {
        // Immediate functions stay on the queue one extra time, meaning
        // they only get removed when their times count is -1
        if (!task.immediate || task.times < 0) {
          // Remove from registries
          array.remove(treesaver.scheduler.tasks_, i);
          delete scheduler.namedTasks_[task.name];

          // Exit early in order to make sure we don't execute an extra time
          if (task.immediate) {
            return;
          }
        }
      }

      if (goog.DEBUG) {
        try {
          task.fun.apply(task.obj, task.args);
        }
        catch (ex) {
          debug.error('Task ' + (task.name || 'untitled') + ' threw: ' + ex);
        }
      }
      else {
        task.fun.apply(task.obj, task.args);
      }
    });

    // Clear out previous id
    scheduler.tickID_ = -1;

    // Don't do anything if no tasks waiting
    if (scheduler.tasks_.length) {
      scheduler.start_();
    }
  };

  /**
   * Helper function for adding tasks to the execution queue
   *
   * @private
   * @param {!function()} fun
   * @param {!number}     interval
   * @param {number=}     times
   * @param {Array=}      args
   * @param {boolean=}    immediate
   * @param {string=}     name
   * @param {Object=}     obj
   */
  scheduler.addTask_ = function(fun, interval, times, args, immediate, name, obj) {
    if (goog.DEBUG) {
      if (!'apply' in fun) {
        debug.error('Function without apply() not added to the scheduler');
        return;
      }
    }

    var now = goog.now(),
        task = name ? scheduler.namedTasks_[name] : null;

    // Re-use previous task if it exists
    if (name && name in scheduler.namedTasks_) {
      task = scheduler.namedTasks_[name];
    }
    else {
      // Create a new task object
      task = {
        fun: fun,
        name: name,
        obj: obj,
        last: immediate ? -Infinity : now
      };

      // Store
      scheduler.tasks_.push(task);
      if (name) {
        scheduler.namedTasks_[name] = task;
      }
    }

    task.args = args || [];
    task.times = times;
    task.interval = interval;
    task.immediate = immediate;
    task.removed = false;

    // Restart the tick callback if it's not active
    scheduler.start_();
  };

  /**
   * Run a function once after a delay
   *
   * @param {!function()} fun
   * @param {!number}     delay
   * @param {Array=}      args
   * @param {string=}     name
   * @param {Object=}     obj
   */
  scheduler.delay = function(fun, delay, args, name, obj) {
    scheduler.addTask_(fun, delay, 1, args, false, name, obj);
  };

  /**
   * Run a function on a repeating interval
   * @param {!function()} fun
   * @param {!number}     interval
   * @param {number=}     times
   * @param {Array=}      args
   * @param {string=}     name
   * @param {Object=}     obj
   */
  scheduler.repeat = function(fun, interval, times, args, name, obj) {
    scheduler.addTask_(fun, interval, times, args, false, name, obj);
  };

  /**
   * Add a function to the execution queue
   * @param {!function()} fun
   * @param {Array=}      args
   * @param {string=}     name
   * @param {Object=}     obj
   */
  scheduler.queue = function(fun, args, name, obj) {
    scheduler.addTask_(fun, 0, 1, args, false, name, obj);
  };

  /**
   * Debounce a function call, coalescing frequent function calls into one
   *
   * @param {!function()} fun
   * @param {!number}     interval
   * @param {Array=}      args
   * @param {boolean=}    immediate
   * @param {string=}     name
   * @param {Object=}     obj
   */
  scheduler.debounce =
    function(fun, interval, args, immediate, name, obj) {
    // Check if the task already exists
    var task = scheduler.namedTasks_[name];

    if (task) {
      // Update timestamp to further delay execution
      task.last = goog.now();
    }
    else {
      scheduler.addTask_(fun, interval, 1, args, immediate, name, obj);
    }
  };

  /**
   * Limit the frequency of calls to the a given task
   *
   * @param {!function()} fun
   * @param {!number}     interval
   * @param {Array=}      args
   * @param {string=}     name
   * @param {Object=}     obj
   */
  scheduler.limit = function(fun, interval, args, name, obj) {
    // Check if the task already exists
    var task = scheduler.namedTasks_[name];

    // Ignore if already in the queue
    if (!task) {
      scheduler.addTask_(fun, interval, 1, args, true, name, obj);
    }
  };

  /**
   * Pause all tasks except those named in the whitelist
   *
   * @param {Array.<string>} whitelist Names of tasks that can still execute.
   * @param {number=} timeout Timeout before auto-resume.
   */
  scheduler.pause = function(whitelist, timeout) {
    scheduler.taskWhitelist_ = whitelist;

    // Clear previous if there
    if (scheduler.pauseTimeoutId_ !== -1) {
      window.clearTimeout(scheduler.pauseTimeoutId_);
    }

    if (timeout) {
      scheduler.pauseTimeoutId_ = setTimeout(scheduler.resume, timeout);
    }
  };

  /**
   * Resume task execution
   */
  scheduler.resume = function() {
    scheduler.taskWhitelist_ = null;
    if (scheduler.pauseTimeoutId_ !== -1) {
      window.clearTimeout(scheduler.pauseTimeoutId_);
      scheduler.pauseTimeoutId_ = -1;
    }
  };

  /**
   * Remove a task from the execution queue
   * @param {!string} name Task name.
   */
  scheduler.clear = function(name) {
    delete scheduler.namedTasks_[name];

    scheduler.tasks_.forEach(function(task, i) {
      if (task.name === name) {
        array.remove(treesaver.scheduler.tasks_, i);
        // Mark task as inactive, in case there are any references left
        task.removed = true;
      }
    });
  };

  /**
   * Start function processing again
   * @private
   */
  scheduler.start_ = function() {
    if (scheduler.tickID_ === -1) {
      scheduler.tickID_ = treesaver.scheduler.requestAnimationFrame_(
        scheduler.tick_,
        document.body
      );
    }
  };

  /**
   * Stop all functions from being executed, and clear out the queue
   */
  scheduler.stopAll = function() {
    // Stop task
    if (scheduler.tickID_) {
      scheduler.cancelAnimationFrame_(treesaver.scheduler.tickID_);
    }

    // Clear out any timeout
    scheduler.resume();

    // Clear data stores
    scheduler.tickID_ = -1;
    scheduler.tasks_ = [];
    scheduler.namedTasks_ = {};
  };
});

// Input 6
/**
 * @fileoverview DOM helper functions.
 */

goog.provide('treesaver.dom');

goog.require('treesaver.array');
goog.require('treesaver.scheduler');

goog.scope(function() {
  var dom = treesaver.dom,
      array = treesaver.array,
      scheduler = treesaver.scheduler;

  // Mozilla doesn't support element.contains()
  if ('Node' in window && Node.prototype && !('contains' in Node.prototype)) {
    // Fix from PPK
    // http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html
    Node.prototype.contains = function(arg) {
      return !!(this.compareDocumentPosition(arg) & 16);
    };
  }

  // Check for classList support, which makes things much simpler
  if ('classList' in document.documentElement) {
    /**
     * Add a CSS class to an element
     *
     * @param {!Element} el
     * @param {!string} className
     */
    dom.addClass = function(el, className) {
      className.split(/\s+/).forEach(function(name) {
        el.classList.add(name);
      });
    };

    /**
     * Remove a CSS class to an element
     *
     * @param {!Element} el
     * @param {!string} className
     */
    dom.removeClass = function(el, className) {
      return el.classList.remove(className);
    };

    /**
     * Check if an element has the given class
     * Hat Tip: Dean Edwards http://dean.edwards.name/IE7/caveats/
     *
     * @param {!Element|!HTMLDocument} el
     * @param {!string} className
     * @return {boolean} True if the element has that class.
     */
    dom.hasClass = function(el, className) {
      return el.classList.contains(className);
    };

    /**
     * @param {!Element} el
     * @return {!Array.<string>} Array of all the element's classes.
     */
    dom.classes = function(el) {
      return array.toArray(el.classList);
    };
  }
  else {
    // Patch for browsers that don't support classList: IE, Safari pre 5.1,
    // Opera pre 11.5, Mobile Safari, and Android pre 3.0
    //
    // All functions here courtesy Dean Edwards:
    // http://dean.edwards.name/IE7/caveats/
    dom.addClass = function(el, className) {
      if (el.className) {
        if (!treesaver.dom.hasClass(el, className)) {
          el.className += ' ' + className;
        }
      }
      else {
        el.className = className;
      }
    };

    dom.removeClass = function(el, className) {
      var regexp = new RegExp('(^|\\s)' + className + '(\\s|$)');
      el.className = el.className.replace(regexp, '$2');
    };

    dom.hasClass = function(el, className) {
      var regexp = new RegExp('(^|\\s)' + className + '(\\s|$)');
      return !!(el.className && regexp.test(el.className));
    };

    dom.classes = function(el) {
      if (!el.className) {
        return [];
      }

      return el.className.split(/\s+/);
    };
  }

  /**
   * Use querySelectorAll on an element tree
   *
   * @param {!string} queryString
   * @param {HTMLDocument|Element=} root Element root (optional).
   * @return {!Array.<Element>} Array of matching elements.
   */
  dom.querySelectorAll = function(queryString, root) {
    if (!root) {
      root = document;
    }

    return array.toArray(root.querySelectorAll(queryString));
  };

  /**
   * Whether the element has the given attribute. Proxy because IE doesn't
   * have the native method
   *
   * @param {!Element} el
   * @param {!string}  propName
   * @return {boolean}
   */
  dom.hasAttr = function(el, propName) {
    return el.hasAttribute(propName);
  };

  /**
   * The namespace prefix for custom elements
   *
   * @const
   * @type {string}
   */
  dom.customAttributePrefix = 'data-ts-';

  /**
   * Whether the element has a custom Treesaver-namespaced attribute
   *
   * @param {!Element} el
   * @param {!string} propName Unescaped.
   * @return {boolean}
   */
  dom.hasCustomAttr = function(el, propName) {
    return dom.hasAttr(el, dom.customAttributePrefix + propName);
  };

  /**
   * Whether the element has a custom Treesaver-namespaced attribute
   *
   * @param {!Element} el
   * @param {!string} propName Unescaped.
   * @return {string}
   */
  dom.getCustomAttr = function(el, propName) {
    return el.getAttribute(dom.customAttributePrefix + propName);
  };

  /**
   * Remove all children from an Element
   *
   * @param {!Element} el
   */
  dom.clearChildren = function(el) {
    // TODO: Blank innerHTML instead?
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  };

  /**
   * InnerText wrapper for browsers that don't have it
   *
   * @param {!Node} node
   * @return {!string} The text content of the node.
   */
  dom.innerText = function(node) {
    return node.textContent;
  };

  /**
   * OuterHTML wrapper for browsers that don't have it
   *
   * @param {!Element} el
   * @return {!string} The outer HTML of the element.
   */
  dom.outerHTML = function(el) {
    // IE, WebKit, and Opera all have outerHTML
    if ('outerHTML' in el) {
      return el.outerHTML;
    }

    // Damn you, Firefox!
    var clone = el.cloneNode(true),
        html;

    // Temporarily place the clone into an empty element
    // and extract its innerHTML
    dom.dummyDiv_.appendChild(clone);
    html = dom.dummyDiv_.innerHTML;
    dom.dummyDiv_.removeChild(clone);

    return html;
  };

  /**
   * Make an element from HTML
   *
   * @param {!string} html
   * @return {?Element}
   */
  dom.createElementFromHTML = function(html) {
    dom.dummyDiv_.innerHTML = html;
    // Only ever return the first child
    var node = dom.dummyDiv_.firstChild;
    dom.clearChildren(dom.dummyDiv_);

    // Make sure it's an actual Element
    if (!node || node.nodeType !== 1) {
      return null;
    }

    return /** @type {!Element} */ (node);
  };

  /**
   * Make a Node from HTML.
   *
   * @param {!string} html The string to parse.
   * @return {?Node} Returns the parsed representation of the
   * html as a DOM node.
   */
  dom.createDocumentFragmentFromHTML = function(html) {
    var node;

    dom.dummyDiv_.innerHTML = html;

    if (dom.dummyDiv_.childNodes.length === 1) {
      node = dom.dummyDiv_.firstChild;
    }
    else {
      node = document.createDocumentFragment();
      while (dom.dummyDiv_.firstChild) {
        node.appendChild(dom.dummyDiv_.firstChild);
      }
    }
    dom.clearChildren(dom.dummyDiv_);

    // Make sure it's an actual Node
    if (!node || !(node.nodeType === 1 || node.nodeType === 11)) {
      return null;
    }

    return /** @type {!Node} */ (node);
  };

  /**
   * Find the first ancestor of the given tagName for an element
   *
   * @param {!Node} el
   * @param {!string} tagName
   * @return {?Node}
   */
  dom.getAncestor = function(el, tagName) {
    var parent = el,
        tag = tagName.toUpperCase();

    while ((parent = parent.parentNode) !== null && parent.nodeType === 1) {
      if (parent.nodeName === tag) {
        return parent;
      }
    }
    return null;
  };


  /**
   * Temporary storage for <img> DOM elements before disposal
   *
   * @private
   * @type {Array.<Element>}
   */
  dom.imgCache_ = [];

  /**
   * Helper for disposing of images in order to avoid memory leaks in iOS
   *
   * @param {!Element} img
   */
  dom.disposeImg = function(img) {
    dom.imgCache_.push(img);

    // Clear out <img> src before unload due to iOS hw-accel bugs
    // Set source to empty gif
    img.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=');

    // Pause to let collection happen
    scheduler.limit(treesaver.dom.clearImgCache_, 3000, [], 'clearImgCache');
  };

  /**
   * Delayed task to lose reference to images
   *
   * @private
   */
  dom.clearImgCache_ = function() {
    // Lose all references
    dom.imgCache_ = [];
  };

  /**
   * Temporary element used for DOM operations
   *
   * @private
   * @type {!Element}
   */
  dom.dummyDiv_ = document.createElement('div');
  // Prevent all layout on the element
  dom.dummyDiv_.style.display = 'none';
});

// Input 7
/**
 * @fileoverview Event helper functions.
 */

goog.provide('treesaver.events');

goog.require('treesaver.debug');

goog.scope(function() {
  var events = treesaver.events,
      debug = treesaver.debug;

  /**
   * Create an event and fire it
   *
   * @param {!*} obj
   * @param {!string} type
   * @param {Object=} data
   */
  events.fireEvent = function(obj, type, data) {
    var e = document.createEvent('UIEvents'),
        cur,
        val;

    // TODO: Test cancelling
    e.initEvent(type, false, true);
    // Copy provided data into event object
    if (data) {
      for (cur in data) {
        e[cur] = data[cur];
      }
    }

    return obj.dispatchEvent(e);
  };

  /**
   * Add an event listener to an element
   *
   * @param {!*} obj
   * @param {!string} type
   * @param {!function()|!Object} fn
   */
  events.addListener = function(obj, type, fn) {
    // Help out while debugging, but don't pay the performance hit
    // for a try/catch in production
    if (goog.DEBUG) {
      try {
        obj.addEventListener(type, fn, false);
      }
      catch (ex) {
        debug.error('Could not add ' + type + ' listener to: ' + obj);
        debug.error('Exception ' + ex);
      }
    }
    else {
      obj.addEventListener(type, fn, false);
    }
  };

  /**
   * Remove an event listener from an element
   *
   * @param {!*} obj
   * @param {!string} type
   * @param {!function()|!Object} fn
   */
  events.removeListener = function(obj, type, fn) {
    // Help out with debugging, but only in debug
    if (goog.DEBUG) {
      try {
        obj.removeEventListener(type, fn, false);
      }
      catch (ex) {
        debug.error('Could not remove ' + type + ' listener from: ' + obj);
        debug.error('Exception ' + ex);
      }
    }
    else {
      obj.removeEventListener(type, fn, false);
    }
  };
});

// Expose event helper functions via externs
goog.exportSymbol('treesaver.addListener', treesaver.events.addListener);
goog.exportSymbol('treesaver.removeListener', treesaver.events.removeListener);

// Input 8
/**
 * @fileoverview Google WebFont Loader adapter/implementation for treesaver.fonts.
 */

goog.provide('treesaver.fonts.googleadapter');

goog.require('treesaver.debug');

goog.scope(function() {
  var googleadapter = treesaver.fonts.googleadapter,
      debug = treesaver.debug;

  /**
   * @private
   * @const
   * @type {number}
   */
   googleadapter.DEFAULT_TIMEOUT = 4000;

  googleadapter.load = function(config, callback) {
    googleadapter.callback_ = callback;
    googleadapter.fontState_ = {};
    googleadapter.done_ = false;

    googleadapter.timeout_ = setTimeout(googleadapter.abort_, googleadapter.DEFAULT_TIMEOUT);

    (function() {
      var wf = document.createElement('script');
      wf.src = '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      wf.onload = function() {
        var WebFont = window['WebFont'];
        WebFont.load(googleadapter.createConfig_(config));
      };
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
    })();
  };

  googleadapter.createConfig_ = function(config) {
    var newConfig = Object.clone(googleadapter.internal_);
    var i;

    for (i = 0; i < googleadapter.validOptions.length; i++) {
      if (config.hasOwnProperty(googleadapter.validOptions[i])) {
        newConfig[googleadapter.validOptions[i]] = config[googleadapter.validOptions[i]];
      }
    }
    return newConfig;
  };

  googleadapter.validOptions = [
    'ascender',
    'custom',
    'google',
    'monotype',
    'typekit'
  ];

  googleadapter.complete_ = function(payload) {
    clearTimeout(googleadapter.timeout_);
    if (!googleadapter.done_) {
      googleadapter.done_ = true;
      googleadapter.callback_(payload);
    }
  };

  googleadapter.abort_ = function() {
    debug.info('googleadapter.abort');
    googleadapter.complete_(googleadapter.fontState_);
  };

  googleadapter.internal_ = {
    "active": function() {
      debug.info('googleadapter.active');
      googleadapter.complete_(googleadapter.fontState_);
    },
    "fontactive": function(family) {
      debug.info('WebFont.fontactive ' + family);
      googleadapter.fontState_[family] = 'active';
    },
    "fontinactive": function(family) {
      debug.info('WebFont.fontinactive ' + family);
      googleadapter.fontState_[family] = 'inactive';
    },
    "fontloading": function(family) {
      debug.info('WebFont.fontloading ' + family);
      googleadapter.fontState_[family] = 'loading';
    },
    "inactive": function() {
      debug.info('WebFont.inactive');
      googleadapter.complete_(googleadapter.fontState_);
    },
    "loading": function() {
      debug.info('WebFont.loading');
    }
  };
});

// Input 9
/**
 * @fileoverview Extract fonts defined in an external HTML file.
 */

goog.provide('treesaver.fonts');

goog.require('treesaver.fonts.googleadapter');
goog.require('treesaver.debug');
goog.require('treesaver.dom');
goog.require('treesaver.events');

goog.scope(function() {
  var fonts = treesaver.fonts,
      debug = treesaver.debug,
      dom = treesaver.dom,
      events = treesaver.events,
      googleadapter = treesaver.fonts.googleadapter;

  /**
   * Loads custom fonts for the current document
   *
   * @param {!function()} callback
   */
   fonts.load = function(callback) {
    if (!window['treesaverFonts']) {
      debug.info("No treesaverFonts specified; nothing to do here.");
      callback();
      return;
    }

    if (fonts.loadStatus_) {
      if (fonts.loadStatus_ ===
          fonts.LoadStatus.LOADED) {
        // Already loaded, callback immediately
        callback();
      }
      else {
        // Not loaded yet, add callback to list
        fonts.callbacks_.push(callback);
      }

      return;
    }

    fonts.loadStatus_ = fonts.LoadStatus.LOADING;
    // Not loaded yet, add callback to list
    fonts.callbacks_ = [callback];
    // do the stuff
    events.addListener(document, treesaver.customevents.LOADERSHOWN, fonts.load_);
  };

  fonts.load_ = function() {
    googleadapter.load(window['treesaverFonts'], function(result) {
      var classes = [], className, family;
      for (family in result) {
        if (result.hasOwnProperty(family)) {
          className = 'ts-' + fonts.slugify(family) + (result[family] == 'active' ? '-active' : '-inactive');
          classes.push(className);
        }
      }
      dom.addClass(document.documentElement, classes.join(' '));
      fonts.loadComplete_();
    });
  };

  fonts.slugify = function(name) {
    return name.toLowerCase().replace(/[^a-z]+/g, '-');
  };

  /**
   * Called when custom fonts loading is finished
   */
  fonts.loadComplete_ = function() {
    fonts.loadStatus_ = fonts.LoadStatus.LOADED;

    // Clone callback array
    var callbacks = fonts.callbacks_.slice(0);

    // Clear out old callbacks
    fonts.callbacks_ = [];

    // Do callbacks
    callbacks.forEach(function(callback) {
      callback();
    });
  };

  fonts.unload = function() {
    debug.info('fonts.unload');
    fonts.loadStatus_ = fonts.LoadStatus.NOT_LOADED;
    fonts.callbacks_ = [];
  };

  /**
   * Load status enum
   * @enum {number}
   */
  fonts.LoadStatus = {
    LOADED: 2,
    LOADING: 1,
    NOT_LOADED: 0
  };

  /**
   * Load status of fonts
   *
   * @private
   * @type {fonts.LoadStatus}
   */
  fonts.loadStatus_;

  /**
   * Callbacks
   *
   * @private
   * @type {Array.<function()>}
   */
  fonts.callbacks_;
});

// Input 10
/**
 * @fileoverview Simple wrapper for localStorage.
 */

goog.provide('treesaver.storage');

goog.require('treesaver.debug');

goog.scope(function() {
  var storage = treesaver.storage,
      debug = treesaver.debug,
      localStore = window.localStorage,
      sessionStore = window.sessionStorage;

  /**
   * @param {!string} key
   * @param {!*} value
   * @param {boolean=} persist
   */
  storage.set = function set(key, value, persist) {
    var store = persist ? localStore : sessionStore;

    // iPad throws QUOTA_EXCEEDED_ERR frequently here, even though we're not
    // using that much storage
    // Clear the storage first in order to avoid this error
    store.removeItem(key);

    try {
      store.setItem(key, treesaver.json.stringify(value));
    }
    catch (ex) {
      // Still happened, not much we can do about it
      // TODO: Do something about it? :)
    }
  };

  /**
   * @param {!string} key
   * @return {*} Previously stored value, if any.
   */
  storage.get = function(key) {
    // Session take precedence over local
    var val = sessionStore.getItem(key) || localStore.getItem(key);

    if (val) {
      return treesaver.json.parse( /** @type {string} */ (val));
    }
    else {
      return null;
    }
  };

  /**
   * @param {!string} key
   */
  storage.clear = function(key) {
    sessionStore.removeItem(key);
    localStore.removeItem(key);
  };

  /**
   * Returns a list of keys currently used in storage
   *
   * @param {string=} prefix
   * @return {!Array.<string>}
   */
  storage.getKeys_ = function(prefix) {
    var all_keys = [],
        i, len, key,
        prefix_len;

    prefix = prefix || '';
    prefix_len = prefix.length;

    for (i = 0, len = localStore.length; i < len; i += 1) {
      key = localStore.key(i);
      if (key && (!prefix || prefix === key.substr(0, prefix_len))) {
        all_keys.push(localStore.key(i));
      }
    }

    for (i = 0, len = sessionStore.length; i < len; i += 1) {
      key = sessionStore.key(i);
      if (all_keys.indexOf(key) === -1 &&
          (!prefix || prefix === key.substr(0, prefix_len))) {
        all_keys.push(key);
      }
    }

    return all_keys;
  };

  /**
   * Cleans up space in storage
   * @param {string=} prefix
   * @param {!Array.<string>=} whitelist
   */
  storage.clean = function(prefix, whitelist) {
    if (!whitelist) {
      localStore.clear();
      sessionStore.clear();
    }
    else {
      storage.getKeys_(prefix).forEach(function(key) {
        if (!whitelist || whitelist.indexOf(key) === -1) {
          storage.clear(key);
        }
      });
    }
  };
});

// Input 11
/**
 * @fileoverview Proxy for HTML5 window history functions for browsers that
 * do not support it.
 */

goog.provide('treesaver.history');

goog.require('treesaver.capabilities');
goog.require('treesaver.debug');
goog.require('treesaver.events');
goog.require('treesaver.scheduler');
goog.require('treesaver.storage');

goog.scope(function() {
  var history = treesaver.history,
      debug = treesaver.debug,
      events = treesaver.events,
      scheduler = treesaver.scheduler,
      storage = treesaver.storage;

  /**
   * @type {Object.<string, string>}
   */
  history.events = {
    POPSTATE: 'popstate'
  };

  // Don't do anything when in an app wrapper
  if (WITHIN_IOS_WRAPPER) {
    /**
     * Dummy function
     *
     * @param {!Object} data
     * @param {!string} title
     * @param {!string} url
     */
    history.pushState = function(data, title, url) {
    };

    /**
     * Dummy function
     *
     * @param {!Object} data
     * @param {!string} title
     * @param {!string} url
     */
    history.replaceState = function(data, title, url) {
    };
  }
  else {
    /**
     * Hash prefix used to mark a hash generated by this library
     *
     * @const
     * @type {string}
     */
    history.DELIMITER = '-';

    /**
     * Does the browser have a native implementation of the history functions
     * @const
     * @private
     * @type {boolean}
     */
    history.NATIVE_SUPPORT = 'pushState' in window.history;

    /**
     * Return the value of the current document hash, minus any leading '#'
     * @private
     * @return {string} The normalized hash value.
     */
    history.getNormalizedHash_ = function() {
      // IE7 does funky things with the location.hash property when the URL contains a
      // query string. Firefox 3.5 has quirks around escaping hash values ( hat tip: blixt
      // https://github.com/blixt/js-hash/ )
      //
      // Therefore, use location.href instead of location.hash, as blixt did (MIT license)
      var index = document.location.href.indexOf('#');
      return index === -1 ? '' : document.location.href.substr(index + 1);
    };

    // Even if the client has a native implementation of the API, we have to check
    // the hash on load just in case the visitor followed a link generated by a
    // browser that does not have native support
    if (document.location.hash) {
      history.current_hash = history.getNormalizedHash_();

      // Our hashes always start with the delimiter and have at least another
      // character there
      if (history.current_hash[0] === history.DELIMITER &&
          history.current_hash.length >= 2) {
        // Redirect, stripping the intial delimiter
        // Use location.replace instead of setting document.location to avoid
        // breaking the back button
        document.location.replace(history.current_hash.substr(1));
      }
    }

    // Forward to native
    history.pushState = function(data, title, url) {
      window.history['pushState'](data, title, url);
    };

    // Forward to native
    history.replaceState = function(data, title, url) {
      window.history['replaceState'](data, title, url);
    };

    // History helper functions only needed for browsers that don't
    // have native support
    if (!history.NATIVE_SUPPORT) {
      debug.info('Using non-native history implementation');

      // Override functions for browsers with non-native support
      history.pushState = function(data, title, url) {
        history._changeState(data, title, url, false);
      };
      history.replaceState = function(data, title, url) {
        history._changeState(data, title, url, true);
      };

      /**
       * Create a hash for a given URL
       *
       * @private
       * @param {!string} url
       * @return {string} String that can be safely used as hash.
       */
      history.createHash_ = function(url) {
        // Always add delimiter and escape the URL
        return history.DELIMITER + window.escape(url);
      };

      /**
       * Set the browser hash. Necessary in order to override behavior when
       * using IFrame for IE7
       *
       * @private
       * @param {!string} hash
       */
      history.setLocationHash_ = function(hash) {
        document.location.hash = '#' + hash;
      };

      /**
       * Set the browser hash without adding a history entry
       *
       * @private
       * @param {!string} hash
       */
      history.replaceLocationHash_ = function(hash) {
        document.location.replace('#' + hash);
      };

      /**
       * Storage prefix for history items
       *
       * @const
       * @private
       * @type {string}
       */
      history.STORAGE_PREFIX = 'history:';

      /**
       * Create key name for storing history data
       *
       * @private
       * @param {!string} key
       * @return {string} String that can be safely used as storage key.
       */
      history.createStorageKey_ = function(key) {
        return history.STORAGE_PREFIX + key;
      };

      /**
       * @private
       * @param {?Object} data
       * @param {?string} title
       * @param {!string} url
       * @param {boolean} replace
       */
      history._changeState = function _changeState(data, title, url, replace) {
        var hash_url = history.createHash_(url);

        // Store data using url
        storage.set(
          history.createStorageKey_(hash_url),
          { state: data, title: title }
        );

        // If we're using the same URL as the current page, don't double up
        if (url === document.location.pathname) {
          hash_url = '';
        }

        // HTML5 implementation only calls popstate as a result of a user action,
        // store the hash so we don't trigger a false event
        history.hash_ = hash_url;

        // Use the URL as a hash
        if (replace) {
          history.replaceLocationHash_(hash_url);
        }
        else {
          history.setLocationHash_(hash_url);
        }
      };

      /**
       * Receive the hashChanged event (native or manual) and fire the onpopstate
       * event
       * @private
       */
      history.hashChange_ = function hashChange_() {
        var new_hash = history.getNormalizedHash_(),
            data;

        // False alarm, ignore
        if (new_hash === history.hash_) {
          return;
        }

        history.hash_ = new_hash;
        data = history.hash_ ?
          storage.get(history.createStorageKey_(new_hash)) :
          {};

        debug.info('New hash: ' + history.hash_);

        // Now, fire onpopstate with the state object
        // NOTE: popstate fires on window, not document
        events.fireEvent(window, history.events.POPSTATE,
          { 'state': data ? data.state : null });
      };

      // Setup handler to receive events
      window['onhashchange'] = history.hashChange_;
    }
  }
});

// Input 12
/**
 * @fileoverview Retrieve files via XMLHttpRequest.
 */

goog.provide('treesaver.network');

goog.require('treesaver.capabilities');
goog.require('treesaver.debug');
goog.require('treesaver.events');
goog.require('treesaver.scheduler');

goog.scope(function() {
  var network = treesaver.network,
      capabilities = treesaver.capabilities,
      debug = treesaver.debug,
      events = treesaver.events,
      scheduler = treesaver.scheduler;

  /**
   * @private
   * @const
   * @type {number}
   */
  network.DEFAULT_TIMEOUT = 10000; // 10 seconds

  /**
   * Network events fired
   * @const
   * @type {Object.<string, string>}
   */
  network.events = {
    ONLINE: 'treesaver.online',
    OFFLINE: 'treesaver.offline'
  };

  /**
   * Browser events watched
   * @private
   * @const
   * @type {Array.<string>}
   */
  network.watchedEvents_ = [
    'offline',
    'online'
  ];

  /**
   * Cache events watched (on document, not window)
   * @private
   * @const
   * @type {Array.<string>}
   */
  network.watchedCacheEvents_ = [
    'uncached',
    'idle',
    'checking',
    'downloading',
    'updateready',
    'obsolete'
  ];

  /**
   * Whether the network library is loaded
   * @private
   * @type {boolean}
   */
  network.isLoaded_ = false;

  /**
   * Initialize the network module, hook up event handlers, etc
   */
  network.load = function() {
    if (!network.isLoaded_) {
      network.isLoaded_ = true;

      // Hook up event handlers
      network.watchedEvents_.forEach(function(evt) {
        events.addListener(document, evt, network);
      });

      if (capabilities.SUPPORTS_APPLICATIONCACHE &&
          // FF3.5 gets nasty if you try to add event handlers to an uncached page
          // (specifically, it won't let you add event handlers to the cache obj)
          network.loadedFromCache_) {
        network.watchedCacheEvents_.forEach(function(evt) {
          events.addListener(window.applicationCache, evt, network);
        });
      }
    }
  };

  /**
   * Unload handlers and cleanup
   */
  network.unload = function() {
    if (network.isLoaded_) {
      network.isLoaded_ = false;

      // Unhook event handlers
      network.watchedEvents_.forEach(function(evt) {
        events.removeListener(window, evt, network);
      });
      // Unhook cache handlers only if they were set (avoid FF3.5 bug from above)
      if (capabilities.SUPPORTS_APPLICATIONCACHE &&
          network.loadedFromCache_) {
        network.watchedCacheEvents_.forEach(function(evt) {
          events.removeListener(window.applicationCache, evt, network);
        });
      }

      // TODO: Cancel outstanding requests
    }
  };

  /**
   * Internal storage for online status, since it can be set manually
   *
   * @private
   * @type {boolean}
   */
  network.onlineStatus_ = 'onLine' in window.navigator ?
    // TODO: What's a good fallback option here? IE8, and recent FF/WebKit support
    // navigator.onLine, so perhaps we just don't worry about this too much
    window.navigator.onLine : true;

  /**
   * @return {boolean} True if browser has an internet connection.
   */
  network.isOnline = function() {
    return network.onlineStatus_;
  };

  /**
   * Sets the online status
   *
   * @param {boolean} onLine True if should behave as if online.
   */
  network.setOnlineStatus = function(onLine) {
    network.onlineStatus_ = onLine;

    // TODO: Refactor this and create an event handler in capabilities, some
    // `capabilitiesChanged` event perhaps?
    capabilities.updateClasses();

    // Fire Treesaver event
    events.fireEvent(window,
      onLine ? network.events.ONLINE : network.events.OFFLINE);
  };

  /**
   * @private
   * @type {boolean}
   */
  network.loadedFromCache_ =
    capabilities.SUPPORTS_APPLICATIONCACHE &&
    // 0 = UNCACHED, anything else means page was cached on load
    !!window.applicationCache.status;

  /**
   * @return {boolean} True if the browser cache was active during boot.
   */
  network.loadedFromCache = function() {
    return network.loadedFromCache_;
  };

  /**
   * Handle events
   * @param {Event} e
   */
  network['handleEvent'] = function(e) {
    debug.info('Network event recieved: ' + e);

    switch (e.type) {
    case 'online':
      debug.info('Application online');

      network.setOnlineStatus(true);

      return;

    case 'offline':
      debug.info('Application offline');

      network.setOnlineStatus(false);

      return;

    case 'updateready':
      debug.info('Updating application cache');

      // New version of cached element is ready, hot swap
      window.applicationCache.swapCache();

      // TODO: Force reload of app in order to get new JS and content?

      return;

    case 'error':
      debug.warn('Application Cache Error: ' + e);

      // TODO: ???
      return;
    }
  };

  /**
   * @private
   * @const
   * @type {!RegExp}
   */
  network.protocolRegex_ = /^https?:\/\//i;

  /**
   * @param {!string} rel_path
   * @return {!string} An absolute URL.
   */
  network.absoluteURL = function(rel_path) {
    // Shortcut anything that starts with slash
    if (rel_path && rel_path[0] === '/' || network.protocolRegex_.test(rel_path)) {
      return rel_path;
    }

    var a = document.createElement('a'),
        div,
        url;

    a.href = rel_path;
    url = a.href;

    return url;
  };

  /**
   * @param {!string} url
   * @param {?function()} callback
   * @param {number=} timeout
   */
  network.get = function get(url, callback, timeout) {
    debug.info('XHR request to: ' + url);

    var request = {
      xhr: new XMLHttpRequest(),
      url: url,
      callback: callback
    };

    scheduler.delay(
      function() {
        network.requestTimeout_(request);
      },
      timeout || network.DEFAULT_TIMEOUT,
      [],
      network.makeRequestId_(request)
    );

    // Setup timeout
    request.xhr.onreadystatechange = network.createHandler_(request);

    try {
      // IE will throw if you try X-domain
      request.xhr.open('GET', request.url, true);
      request.xhr.send(null);
    }
    catch (e) {
      debug.warn('XHR Request exception: ' + e);

      network.requestError_(request);
    }
  };

  /**
   * @private
   */
  network.makeRequestId_ = function(request) {
    // TODO: Make unique across repeated requests?
    return 'fetch:' + request.url;
  };

  /**
   * @private
   */
  network.createHandler_ = function createHandler_(request) {
    return function() {
      if (request.xhr.readyState === 4) {
        // Requests from local file system give 0 status
        // This happens in IOS wrapper, as well as packaged Chrome web store
        if (request.xhr.status === 0 ||
            (request.xhr.status === 200 || request.xhr.status === 304)) {
          debug.info('XHR response from: ' + request.url);
          request.callback(request.xhr.responseText, request.url);
          network.cleanupRequest_(request);
        }
        else {
          debug.warn('XHR request failed for: ' + request.url);

          network.requestError_(request);
        }
      }
    };
  };

  /**
   * @private
   */
  network.cleanupRequest_ = function cleanupRequest_(request) {
    // Remove timeout
    scheduler.clear(network.makeRequestId_(request));
    // Clear reference
    request.xhr.onreadystatechange = null;
  };

  /**
   * @private
   */
  network.requestError_ = function requestError_(request) {
    // Failed for some reason; TODO: Error handling / event?
    request.callback(null, request.url);
    network.cleanupRequest_(request);
  };

  /**
   * @private
   */
  network.requestTimeout_ = function requestTimeout_(request) {
    request.xhr.abort();
    network.requestError_(request);
  };

  if (WITHIN_IOS_WRAPPER) {
    goog.exportSymbol('treesaver.setOnlineStatus', network.setOnlineStatus);
  }
});

// Input 13
/**
 * @fileoverview Extract resources defined in an external HTML file.
 */

goog.provide('treesaver.resources');

goog.require('treesaver.array');
goog.require('treesaver.constants');
goog.require('treesaver.debug');
goog.require('treesaver.dom');
goog.require('treesaver.network');

goog.scope(function() {
  var resources = treesaver.resources,
      array = treesaver.array,
      debug = treesaver.debug,
      dom = treesaver.dom,
      network = treesaver.network;
  /**
   * Loads resource file for the current document, as specified through
   * <link rel="resources" /> in the <head>
   *
   * @param {!function()} callback
   */
  resources.load = function(callback) {
    var url = resources.getResourcesLinkUrl_();

    if (!url) {
      debug.error('No link to resources found');

      // Technically, we're done loading
      callback();

      return;
    }

    // Are we in the loading process?
    if (resources.loadStatus_) {
      if (resources.loadStatus_ ===
          resources.LoadStatus.LOADED) {
        // Already loaded, callback immediately
        callback();
      }
      else {
        // Not loaded yet, add callback to list
        resources.callbacks_.push(callback);
      }

      return;
    }

    debug.info('Loading resources from: ' + url);

    // Set loading flag
    resources.loadStatus_ = resources.LoadStatus.LOADING;
    // Create callback array
    resources.callbacks_ = [callback];

    network.get(url, resources.processResourceFile);
  };

  /**
   * @type {RegExp}
   */
  resources.bodyRegExp = /<body>\s*([\s\S]+?)\s*<\/body>/i;

  /**
   * Find and return any text within a <title>
   * @param {?string} html
   * @return {?string}
   */
  resources.extractBody = function(html) {
    var res = resources.bodyRegExp.exec(html);
    if (res && res[1]) {
      return res[1];
    }
    return null;
  };

  /**
   *
   * @param {string} html
   */
  resources.processResourceFile = function(html) {
    // Create the main container
    resources.container_ = document.createElement('div');

    if (html) {
      var body = resources.extractBody(html);
      if (body) {
        var div = document.createElement('div');
        // Prevent any layout
        div.style.display = 'none';

        // Parse the HTML
        div.innerHTML = body;

        // Grab all the direct <div> children and place them into the container
        array.toArray(div.childNodes).forEach(function(child) {
          if (/^div$/i.test(child.nodeName)) {
            resources.container_.appendChild(child);
          }
        });

        dom.clearChildren(div);
      }
      else {
        debug.error('Body not found in resource file');
      }
    }
    else {
      debug.error('Could not load resource file');
    }

    resources.loadComplete_();
  };

  /**
   * Called when the resource file has finished processing
   */
  resources.loadComplete_ = function() {
    resources.loadStatus_ = resources.LoadStatus.LOADED;

    // Clone callback array
    var callbacks = resources.callbacks_.slice(0);

    // Clear out old callbacks
    resources.callbacks_ = [];

    // Do callbacks
    callbacks.forEach(function(callback) {
      callback();
    });
  };

  /**
   * Return resources based on class name
   *
   * @param {!string} className
   * @return {!Array.<Element>} Array of matching resource elements.
   */
  resources.findByClassName = function(className) {
    // TODO: Restrict only to top-level children?
    return resources.container_ ? dom.querySelectorAll('.' + className, resources.container_) : [];
  };

  /**
   * Clear all data structures
   */
  resources.unload = function() {
    resources.container_ = null;
    resources.loadStatus_ = resources.LoadStatus.NOT_LOADED;
    resources.callbacks_ = [];
  };

  /**
   * Find the resource URL specified in the <head> in the first <link>
   * element with rel=resources
   *
   * @private
   * @return {?string} The url, if one was found.
   */
  resources.getResourcesLinkUrl_ = function() {
    var links = document.querySelectorAll('link[rel~=resources]');

    if (links.length) {
      return links[0].getAttribute('href');
    }

    return null;
  };

  /**
   * Load status enum
   * @enum {number}
   */
  resources.LoadStatus = {
    LOADED: 2,
    LOADING: 1,
    NOT_LOADED: 0
  };

  /**
   * Load status of resources
   *
   * @private
   * @type {resources.LoadStatus}
   */
  resources.loadStatus_;

  /**
   * Callbacks
   *
   * @private
   * @type {Array.<function()>}
   */
  resources.callbacks_;

  /**
   * DOM container for all resource elements
   *
   * @private
   * @type {Element}
   */
  resources.container_;
});

// Input 14
/**
 * @fileoverview Create a stylesheet with the built-in styles required by Treesaver.
 */

goog.provide('treesaver.styles');

goog.require('treesaver.debug');
goog.require('treesaver.dom');

goog.scope(function() {
  var styles = treesaver.styles,
      debug = treesaver.debug,
      dom = treesaver.dom;

  /**
   * @param {!string} selector
   * @param {!string} text
   */
  styles.insertRule = function(selector, text) {
    styles.stylesheet_.insertRule(selector + '{' + text + '}', 0);
  }

  styles.stylesheet_ = document.createElement('style');
  styles.stylesheet_.setAttribute('type', 'text/css');

  if (dom.querySelectorAll('head').length) {
    dom.querySelectorAll('head')[0].appendChild(treesaver.styles.stylesheet_);
    styles.stylesheet_ = document.styleSheets[document.styleSheets.length - 1];

    // Offscreen
    styles.insertRule('.offscreen',
      'position:absolute;top:-200%;right:-200%;visibility:hidden;');
    // Grids are centered in the viewer
    styles.insertRule('.viewer .grid', 'top:50%;left:50%;margin:0');
  }
  else {
    debug.error('No head to put default stylesheet into');
  }
});

// Input 15
/**
 * @fileoverview CSS helper functions.
 */

goog.provide('treesaver.css');

/**
 * Return the computedStyle object, which varies based on
 * browsers
 * @param {?Element} el
 * @return {Object}
 */
treesaver.css.getStyleObject = function(el) {
  return document.defaultView.getComputedStyle(el, null);
};

// Input 16
/**
 * @fileoverview Helpers for measuring elements.
 */

goog.provide('treesaver.dimensions');

goog.require('treesaver.capabilities');
goog.require('treesaver.css');
goog.require('treesaver.debug');

goog.scope(function() {
  var dimensions = treesaver.dimensions,
      capabilities = treesaver.capabilities,
      css = treesaver.css,
      debug = treesaver.debug;

  /**
   * Alias for Size type
   *
   * @typedef {{ w: number, h: number }}
   */
  dimensions.Size;

  /**
   * Alias for SizeRange type
   *
   * @typedef {{ w: number, h: number, maxW: number, maxH: number }}
   */
  dimensions.SizeRange;

  /**
   * Regex to determine whether a value is a pixel value.
   * @private
   */
  dimensions.pixel = /^-?\d+(:?\.\d+)?(?:px)?$/i;


  /**
   * Regex to determine whether a value contains a number.
   * @private
   */
  dimensions.number = /^-?\d(:?\.\d+)?/;

  /**
   * Round fractional widths to 1/round_to.
   * @private
   */
  dimensions.round_to = 1000;

  /**
   * Whether the given size fits within the bounds set by the range
   *
   * @param {treesaver.dimensions.SizeRange|treesaver.dimensions.Metrics} range
   * @param {treesaver.dimensions.Size} size
   * @return {boolean} True if both dimensions are within the min and max.
   */
  dimensions.inSizeRange = function(range, size) {
    if (!range) {
      return false;
    }

    // Use minW/minH for Metrics, w/h for a range
    // TODO: Make this consistent
    var w = (range.minW || range.minW === 0) ? range.minW : range.w,
        h = (range.minH || range.minH === 0) ? range.minH : range.h;

    return size.w >= w && size.h >= h &&
      size.w <= range.maxW && size.h <= range.maxH;
  };

  /**
   *
   * @param {treesaver.dimensions.SizeRange} range
   * @param {treesaver.dimensions.Metrics} metrics
   * @param {boolean} outer
   * @return {treesaver.dimensions.SizeRange}
   */
  dimensions.mergeSizeRange = function(range, metrics, outer) {
    var a = range || {},
        b = metrics || {};

    var bpHeight = outer ? b.bpHeight || (b.outerH ? b.outerH - b.h : 0) : 0,
        bpWidth = outer ? b.bpWidth || (b.outerW ? b.outerW - b.w : 0) : 0;

    return {
      w: Math.max(a.w || 0, (b.w + bpWidth) || 0),
      h: Math.max(a.h || 0, (b.h + bpHeight) || 0),
      maxW: Math.min(a.maxW || Infinity, b.maxW + bpWidth || Infinity),
      maxH: Math.min(a.maxH || Infinity, b.maxH + bpHeight || Infinity)
    };
  };

  /**
   * Convert a string value to pixels
   *
   * @param {!Element} el
   * @param {?string} val
   * @return {?number} Value in pixels.
   */
  dimensions.toPixels = function(el, val) {
    if (val && dimensions.pixel.test(val)) {
      return parseFloat(val) || 0;
    }
    return null;
  };

  /**
   * Return the width and height element in a simple object
   *
   * @param {Element} el
   * @return {!dimensions.Size}
   */
  dimensions.getSize = function(el) {
    return {
      w: dimensions.getOffsetWidth(el),
      h: dimensions.getOffsetHeight(el)
    };
  };

  /**
   * Return the offsetHeight of the element.
   *
   * @param {?Element} el
   * @return {!number} Value in pixels.
   */
  dimensions.getOffsetHeight = function(el) {
    return el && el.offsetHeight || 0;
  };

  /**
   * Return the offsetWidth of the element.
   *
   * @param {?Element} el
   * @return {!number} Value in pixels.
   */
  dimensions.getOffsetWidth = function(el) {
    return el && (Math.round(el.getBoundingClientRect()['width'] * dimensions.round_to) / dimensions.round_to) || 0;
  };

  /**
   * Return the offsetTop of the element.
   *
   * @param {?Element} el
   * @return {!number} Value in pixels.
   */
  dimensions.getOffsetTop = function(el) {
    return el && el.offsetTop || 0;
  }

  /**
   * Helper for setting a CSS value in pixels
   *
   * @param {!Element} el
   * @param {!string} propName
   * @param {!number} val
   * @return {!number} The value supplied.
   */
  dimensions.setCssPx = function(el, propName, val) {
    el.style[propName] = val + 'px';

    return val;
  };

  /**
    * Helper for setting the transform property on an element
    *
    * @param {!Element} el
    * @param {!string} val
    */
  dimensions.setTransformProperty_ = function(el, val) {
    // TODO: Detect once
    if ('transformProperty' in el.style) {
      el.style['transformProperty'] = val;
    }
    else {
      el.style[capabilities.domCSSPrefix + 'Transform'] = val;
    }
  };

  /**
   * Clear out any offset
   *
   * @param {!Element} el
   */
  dimensions.clearOffset = function(el) {
    dimensions.setTransformProperty_(el, 'none');
  };

  /**
   * Helper for setting the offset on an element, using CSS transforms if
   * supported, absolute positioning if not
   *
   * @param {!Element} el
   * @param {!number} x
   * @param {!number} y
   */
  dimensions.setOffset = function(el, x, y) {
    dimensions.setTransformProperty_(el,
      'translate(' + x + 'px,' + y + 'px)');
  };

  // Use hw-accelerated 3D transforms if present
  if (capabilities.SUPPORTS_CSSTRANSFORMS3D) {
    dimensions.setOffset = function(el, x, y) {
      dimensions.setTransformProperty_(el,
        'translate3d(' + x + 'px,' + y + 'px,0)');
    };
  }

  /**
   * Helper for setting the x-offset on an element
   *
   * @param {!Element} el
   * @param {!number} x
   */
  dimensions.setOffsetX = function(el, x) {
    dimensions.setOffset(el, x, 0);
  };

  /**
   * Round up to the nearest multiple of the base number
   *
   * @param {!number} number
   * @param {!number} base
   * @return {number} A multiple of the base number.
   */
  dimensions.roundUp = function(number, base) {
    return Math.ceil(number) + base - Math.ceil(number % base);
  };

  /**
   * The style dimensions of an element including margin, border, and
   * padding as well as line height
   *
   * @constructor
   * @param {!Element=} el
   */
  dimensions.Metrics = function(el) {
    if (!el) {
      return;
    }

    var style = css.getStyleObject(el),
        oldPosition = el.style.position,
        oldStyleAttribute = el.getAttribute('style'),
        tmp;

    this.display = style.display;
    this.position = style.position;

    // Webkit gives incorrect right margins for non-absolutely
    // positioned elements
    //if (this.position !== 'absolute') {
      //el.style.position = 'absolute';
    //}
    // Disable this for now, as it can give incorrect formatting
    // for elements in the flow
    // Also: Getting computed style is kinda silly if we change the
    // styling -- may affect the measurements anyway

    // Margin
    this.marginTop = dimensions.toPixels(el, style.marginTop) || 0;
    this.marginBottom = dimensions.toPixels(el, style.marginBottom) || 0;
    this.marginLeft = dimensions.toPixels(el, style.marginLeft) || 0;
    this.marginRight = dimensions.toPixels(el, style.marginRight) || 0;
    // Summed totals
    this.marginHeight = this.marginTop + this.marginBottom;
    this.marginWidth = this.marginLeft + this.marginRight;

    // Border
    this.borderTop = dimensions.toPixels(el, style.borderTopWidth);
    this.borderBottom = dimensions.toPixels(el, style.borderBottomWidth);
    this.borderLeft = dimensions.toPixels(el, style.borderLeftWidth);
    this.borderRight = dimensions.toPixels(el, style.borderRightWidth);

    // Padding
    this.paddingTop = dimensions.toPixels(el, style.paddingTop);
    this.paddingBottom = dimensions.toPixels(el, style.paddingBottom);
    this.paddingLeft = dimensions.toPixels(el, style.paddingLeft);
    this.paddingRight = dimensions.toPixels(el, style.paddingRight);

    // Summed totals for border & padding
    this.bpTop = this.borderTop + this.paddingTop;
    this.bpBottom = this.borderBottom + this.paddingBottom;
    this.bpHeight = this.bpTop + this.bpBottom;
    this.bpLeft = this.borderLeft + this.paddingLeft;
    this.bpRight = this.borderRight + this.paddingRight;
    this.bpWidth = this.bpLeft + this.bpRight;

    // Outer Width & Height
    this.outerW = dimensions.getOffsetWidth(el);
    this.outerH = dimensions.getOffsetHeight(el);

    // Inner Width & Height
    this.w = this.outerW - this.bpWidth;
    this.h = this.outerH - this.bpHeight;

    // Min & Max : Width & Height
    this.minW = dimensions.toPixels(el, style.minWidth) || 0;
    this.minH = dimensions.toPixels(el, style.minHeight) || 0;

    // Opera returns -1 for a max-width or max-height that is not set.
    tmp = dimensions.toPixels(el, style.maxWidth);
    this.maxW = (!tmp || tmp === -1) ? Infinity : tmp;

    tmp = dimensions.toPixels(el, style.maxHeight);
    this.maxH = (!tmp || tmp === -1) ? Infinity : tmp;

    // Line height
    this.lineHeight = dimensions.toPixels(el, style.lineHeight) || null;

    // Restore the original position property on style
    //if (this.position !== 'absolute') {
      //el.style.position = oldPosition;
      //if (!el.getAttribute('style')) {
        //el.removeAttribute('style');
      //}
    //}
  };

  /**
   * Make a copy of the object
   *
   * @return {!dimensions.Metrics}
   */
  dimensions.Metrics.prototype.clone = function() {
    var copy = new dimensions.Metrics(),
        key;

    for (key in this) {
      if (copy[key] !== this[key]) {
        copy[key] = this[key];
      }
    }

    return copy;
  };

  // TODO: MergeSizeRange

  if (goog.DEBUG) {
    dimensions.Metrics.prototype.toString = function() {
      return '[Metrics: ' + this.w + 'x' + this.h + ']';
    };
  }
});

// Input 17
goog.provide('treesaver.layout.ContentPosition');

/**
 * Helper class for indicating a relative position within a
 * stream of content
 *
 * @constructor
 * @param {number} block Index of the current block.
 * @param {number} figure Index of the current figure.
 * @param {number} overhang Overhang.
 */
treesaver.layout.ContentPosition = function(block, figure, overhang) {
  this.block = block;
  this.figure = figure;
  this.overhang = overhang;
};

goog.scope(function() {
  var ContentPosition = treesaver.layout.ContentPosition;

  /**
   * @type {number}
   */
  ContentPosition.prototype.block;

  /**
   * @type {number}
   */
  ContentPosition.prototype.figure;

  /**
   * @type {number}
   */
  ContentPosition.prototype.overhang;

  /**
   * Position at the end of content
   *
   * @const
   * @type {!treesaver.layout.ContentPosition}
   */
  ContentPosition.END =
    new ContentPosition(Infinity, Infinity, Infinity);

  /**
   * Is the current content position at the beginning?
   *
   * @return {boolean} True if at beginning of content.
   */
  ContentPosition.prototype.atBeginning = function() {
    return !this.block && !this.figure && !this.overhang;
  };

  /**
   * Sort function for ContentPositions
   *
   * @param {!treesaver.layout.ContentPosition} a
   * @param {!treesaver.layout.ContentPosition} b
   * @return {number} Negative if b is greater, 0 if equal, positive if be is lesser.
   */
  ContentPosition.sort = function(a, b) {
    if (a.block !== b.block) {
      return b.block - a.block;
    }
    else if (a.overhang !== b.overhang) {
      // Less overhang = further along
      return a.overhang - b.overhang;
    }

    return b.figure - a.figure;
  };

  /**
   * @param {!treesaver.layout.ContentPosition} other
   * @return {boolean} True if the other breakRecord is ahead of this one.
   */
  ContentPosition.prototype.lessOrEqual = function(other) {
    return ContentPosition.sort(this, other) >= 0;
  };

  /**
   * @param {!treesaver.layout.ContentPosition} other
   * @return {boolean} True if the other breakRecord is behind this one.
   */
  ContentPosition.prototype.greater = function(other) {
    return ContentPosition.sort(this, other) < 0;
  };

  /**
   * Clone the ContentPosition
   * TODO: Was DEBUG only?
   *
   * @return {!treesaver.layout.ContentPosition}
   */
  ContentPosition.prototype.clone = function() {
    return new this.constructor(this.block, this.figure, this.overhang);
  };
});

// Input 18
/**
 * @fileoverview BreakRecord class.
 */

goog.provide('treesaver.layout.BreakRecord');

goog.require('treesaver.array');
goog.require('treesaver.layout.ContentPosition');

/**
 * BreakRecord class
 * @constructor
 */
treesaver.layout.BreakRecord = function() {
  this.index = 0;
  this.figureIndex = 0;
  this.overhang = 0;
  this.delayed = [];
  this.failed = [];
  this.pageNumber = 0;
};

goog.scope(function() {
  var BreakRecord = treesaver.layout.BreakRecord,
      ContentPosition = treesaver.layout.ContentPosition,
      array = treesaver.array;

  /**
   * @type {number}
   */
  BreakRecord.prototype.index;

  /**
   * @type {number}
   */
  BreakRecord.prototype.figureIndex;

  /**
   * @type {number}
   */
  BreakRecord.prototype.overhang;

  /**
   * @type {boolean}
   */
  BreakRecord.prototype.finished;

  /**
   * @type {Array.<number>}
   */
  BreakRecord.prototype.delayed;

  /**
   * @type {Array.<number>}
   */
  BreakRecord.prototype.failed;

  /**
   * @type {number}
   */
  BreakRecord.prototype.pageNumber;

  /**
   * Create a new copy, and return
   *
   * @return {!treesaver.layout.BreakRecord} A deep clone of the original breakRecord.
   */
  BreakRecord.prototype.clone = function() {
    var clone = new this.constructor();
    clone.index = this.index;
    clone.figureIndex = this.figureIndex;
    clone.overhang = this.overhang;
    clone.finished = this.finished;
    clone.delayed = this.delayed.slice(0);
    clone.failed = this.failed.slice(0);
    clone.pageNumber = this.pageNumber;

    return clone;
  };

  /**
   * Check for effective equality
   *
   * @param {treesaver.layout.BreakRecord} other Object to check for equality.
   * @return {boolean} True if the breakRecord is equivalent.
   */
  BreakRecord.prototype.equals = function(other) {
    return !!other &&
        other.index === this.index &&
        other.figureIndex === this.figureIndex &&
        other.overhang === this.overhang &&
        // TODO: Better detection?
        // For now this works, since it's not possible to advance
        // pagination and have these be true
        other.delayed.length === this.delayed.length;
  };

  /**
   * Return a new object which can be used as a marker for
   * the position in the content
   *
   * @return {!treesaver.layout.ContentPosition}
   */
  BreakRecord.prototype.getPosition = function() {
    return new ContentPosition(this.index, this.figureIndex, this.overhang);
  };

  /**
   * Is the break record at the beginning of content?
   *
   * @return {boolean} True if this breakRecord is at the start
   *                   of content.
   */
  BreakRecord.prototype.atStart = function() {
    return !this.index && !this.figureIndex && !this.overhang;
  };

  /**
   * Is the break record at the end of the content?
   *
   * @param {!treesaver.layout.Content} content The content for this breakRecord.
   * @return {boolean} True if there is no more content left to show.
   */
  BreakRecord.prototype.atEnd = function(content) {
    if (this.overhang) {
      // Overhang means we're not finished, no matter what
      return false;
    }

    var i = this.index,
		len = content.blocks.length,
		nextNonChild,
		figure, delayed, block;

    // Check if there are any blocks left to layout, not including
    // fallbacks for optional (or used) figures
    while (i < len) {
      block = content.blocks[i];
      nextNonChild = block.getNextNonChildBlock();

      if (!block.isFallback) {
        // We have a non-fallback block left, which means we are not done
        return false;
      }

      if (!this.figureUsed(block.figure.figureIndex) && !block.figure.optional) {
        // Have the unused fallback of a required figure, we are not done
        return false;
      }

	  i = nextNonChild ? nextNonChild.index : len;
    }

    // No blocks left, check figures

    // If we've used all the figures, then we're done
    if (!this.delayed.length &&
        this.figureIndex === content.figures.length) {
      return true;
    }

    // We have some figures left, gotta figure out if any of them are
    // required
    delayed = this.delayed.slice(0);

    // First, check the delayed figures
    while (delayed.length) {
      figure = content.figures[delayed.pop()];
      // A required figure means we're not done yet
      if (!figure.optional) {
        return false;
      }
    }

    // Now check the remaining figures
    for (i = this.figureIndex, len = content.figures.length; i < len; i += 1) {
      figure = content.figures[i];
      // A required figure means we're not done yet
      if (!figure.optional) {
        return false;
      }
    }

    // If we made it this far, then we are done!
    return true;
  };

  /**
   * Update the breakRecord after using a figure. Make sure to update
   * delayed array, etc
   *
   * @param {!number} figureIndex The index of the figure just used.
   */
  BreakRecord.prototype.useFigure = function(figureIndex) {
    var delayedIndex;

    if (figureIndex < 0) {
      treesaver.debug.error('Negative number passed to useFigure');
    }

    // If the index used it less than our current marker, then it
    // was probably delayed (no guarantee though)
    if (figureIndex < this.figureIndex) {
      if ((delayedIndex = this.delayed.indexOf(figureIndex)) !== -1) {
        // Remove from delayed
        array.remove(this.delayed, delayedIndex);
      }
      else if ((delayedIndex = this.failed.indexOf(figureIndex)) !== -1) {
        // Was a failure, remove
        array.remove(this.failed, delayedIndex);
      }
      else {
        // Do nothing
      }
    }
    else {
      // Otherwise, we need to move up our high-water mark of figureIndex,
      // adding any skipped indicies to the delayed array
      if (figureIndex > this.figureIndex) {
        for (; this.figureIndex < figureIndex; this.figureIndex += 1) {
          this.delayed.push(this.figureIndex);
        }
      }

      // Now that delayed array is updated, we can advance
      this.figureIndex = figureIndex + 1;
    }
  };

  /**
   * Update the break record in order to delay a figure
   *
   * @param {!number} figureIndex
   */
  BreakRecord.prototype.delayFigure = function(figureIndex) {
    if (this.delayed.indexOf(figureIndex) === -1) {
      // Pretend the figure was used
      this.useFigure(figureIndex);

      // But move it into the delayed array
      this.delayed.push(figureIndex);
    }
  };

  /**
   * Check if the given figure index has been used
   *
   * @param {!number} figureIndex
   * @return {boolean} True if the figure index has been used.
   */
  BreakRecord.prototype.figureUsed = function(figureIndex) {
    if (this.figureIndex <= figureIndex) {
      return false;
    }

    if (this.delayed.indexOf(figureIndex) !== -1) {
      return false;
    }

    if (this.failed.indexOf(figureIndex) !== -1) {
      return false;
    }

    return true;
  };

  /**
   * Update the breakRecord after trying to use a figure, but failing.
   *
   * @param {!number} figureIndex The index of the figure just used.
   */
  BreakRecord.prototype.failedFigure = function(figureIndex) {
    // Pretend like we used the figure
    this.useFigure(figureIndex);

    // Now move the figure to the failed array
    this.failed.push(figureIndex);
  };

  if (goog.DEBUG) {
    BreakRecord.prototype.toString = function() {
      return '[BreakRecord ' + this.index + '/' + this.figureIndex + ']';
    };
  }
});

// Input 19
/**
 * @fileoverview HTML and other information about a figure's content payload.
 */

goog.provide('treesaver.layout.FigureSize');

goog.require('treesaver.dom');

/**
 * HTML and other information about a figure content payload
 * @param {string} html Content payload.
 * @param {number|string} minW
 * @param {number|string} minH
 * @param {?Array.<string>} requirements
 * @constructor
 */
treesaver.layout.FigureSize = function(html, minW, minH, requirements) {
  this.html = html;

  // TODO: Use outerHTML from the node eventually in order to sanitize bad
  // HTML?

  // Provide a rough measure the element so we know if we can fit within
  // containers
  this.minW = parseInt(minW || 0, 10);
  this.minH = parseInt(minH || 0, 10);

  // TODO: Only store mutable capabilities
  this.requirements = requirements;
};

goog.scope(function() {
  var FigureSize = treesaver.layout.FigureSize,
      dom = treesaver.dom;

  /**
   * The full HTML content for this payload.
   *
   * @type {string}
   */
  FigureSize.prototype.html;

  /**
   * @type {number}
   */
  FigureSize.prototype.minW;

  /**
   * @type {number}
   */
  FigureSize.prototype.minH;

  /**
   * List of required capabilities for this Chrome
   *
   * @type {?Array.<string>}
   */
  FigureSize.prototype.requirements;

  /**
   * @return {boolean} True if the figureSize meets current browser capabilities.
   */
  FigureSize.prototype.meetsRequirements = function() {
    if (!this.requirements) {
      return true;
    }

    return treesaver.capabilities.check(this.requirements, true);
  };

  /**
   * Apply the figure size to the element
   * @param {!Element} container
   * @param {string=} name
   */
  FigureSize.prototype.applySize = function(container, name) {
    if (name) {
      dom.addClass(container, name);
    }

    container.innerHTML = this.html;

    // Find any cloaked images
    dom.querySelectorAll('img[data-src], iframe[data-src], video[data-src], source[data-src], audio[data-src]', container).forEach(function(e) {
      e.setAttribute('src', e.getAttribute('data-src'));
    });
  };

  /**
   * Back out an applied figure size after a failure
   * @param {!Element} container
   */
  FigureSize.prototype.revertSize = function(container, name) {
    // Remove class
    dom.removeClass(container, name);
    // Remove content
    dom.clearChildren(container);
  };

  if (goog.DEBUG) {
    // Expose for testing
    FigureSize.prototype.toString = function() {
      return '[FigureSize: ' + this.index + '/' + this.html + ']';
    };
  }
});

// Input 20
/**
 * @fileoverview String helper functions.
 */

goog.provide('treesaver.string');

// Add string.trim() if it's not there, which happens in Safari pre-5 and
// IE pre 9
if (!'trim' in String.prototype) {
  String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  };
}

// Input 21
goog.provide('treesaver.layout.Figure');

goog.require('treesaver.array');
goog.require('treesaver.capabilities');
goog.require('treesaver.dom');
// Block requires Figure, so avoid a circular dependency
//goog.require('treesaver.layout.Block');
goog.require('treesaver.layout.FigureSize');
goog.require('treesaver.string'); // String.trim

goog.scope(function() {
  var array = treesaver.array,
      capabilities = treesaver.capabilities,
      dom = treesaver.dom,
      FigureSize = treesaver.layout.FigureSize;

  /**
   * A figure element
   * @param {!Element} el HTML element.
   * @param {!number} baseLineHeight The normal line height used across
   *                                 the article content (in pixels).
   * @param {?Object} indices Current block and figure index.
   * @constructor
   */
  treesaver.layout.Figure = function(el, baseLineHeight, indices) {
    this.anchorIndex = indices.index;
    this.figureIndex = indices.figureIndex;
    indices.figureIndex += 1;
    this.fallback = null;
    this.sizes = {};

    this.optional = !dom.hasClass(el, 'required');
    this.zoomable = dom.hasClass(el, 'zoomable');
    this.scrollable = dom.hasClass(el, 'scroll');

    // Go through and process our sizes
    array.toArray(el.childNodes).forEach(function(childNode) {
      if (childNode.nodeType !== 1) {
        // TODO: What if content is just a ext node? (take parent?)
        if (childNode.data && childNode.data.trim()) {
          treesaver.debug.info('textNode ignored in figure: ' + childNode.data);
        }

        return;
      }

      this.processElement(childNode);
    }, this);

    // Now check for a fallback, and process separately
    if (this.sizes['fallback']) {
      // TODO: Support multiple fallbacks?
      // TODO: Requirements on fallback?
      this.processFallback(this.sizes['fallback'][0].html, el, baseLineHeight, indices);

      // Remove the fallback from figure sizes
      delete this.sizes['fallback'];
    }
  };
});

goog.scope(function() {
  var Figure = treesaver.layout.Figure,
      array = treesaver.array,
      capabilities = treesaver.capabilities,
      dom = treesaver.dom,
      FigureSize = treesaver.layout.FigureSize;

  /**
   * @type {number}
   */
  Figure.prototype.anchorIndex;

  /**
   * @type {number}
   */
  Figure.prototype.figureIndex;

  /**
   * @type {?treesaver.layout.Block}
   */
  Figure.prototype.fallback;

  /**
   * @type {Object.<string, Array.<treesaver.layout.FigureSize>>}
   */
  Figure.prototype.sizes;

  /**
   * Does this figure need to be displayed? If not, then it may be omitted
   * when there is not enough space.
   * @type {boolean}
   */
  Figure.prototype.optional;

  /**
   * Does the figure support zooming/lightboxing?
   * @type {boolean}
   */
  Figure.prototype.zoomable;

  /**
   * Does the figure support scrolling?
   * @type {boolean}
   */
  Figure.prototype.scrollable;

  /**
   * @param {!string} html
   * @param {!Node} node HTML node.
   * @param {!number} baseLineHeight The normal line height used across
   *                                 the article content (in pixels).
   * @param {!Object} indices Current block and figure index.
   */
  Figure.prototype.processFallback = function processFallback(html,
      node, baseLineHeight, indices) {
    // Create the child node
    var parent = node.parentNode,
        fallbackContainer = document.createElement('div'),
        /** @type {!Node} */
        fallbackNode;

    fallbackContainer.innerHTML = html;
    // Is there only one element in our payload?
    if (fallbackContainer.childNodes.length === 1) {
      // Great, just use that one
      fallbackNode = /** @type {!Node} */ fallbackContainer.firstChild;
    }
    else {
      // Use the wrapper as the fallback node
      fallbackNode = fallbackContainer;
    }

    // Cast for compiler
    fallbackNode = /** @type {!Element} */ (fallbackNode);

    // Insert into the tree, to get proper styling
    parent.insertBefore(fallbackNode, node);

    // Add flags into DOM for zooming
    if (this.zoomable) {
      dom.addClass(fallbackNode, 'zoomable');
      fallbackNode.setAttribute('data-figureindex', this.figureIndex);
      if (capabilities.IS_NATIVE_APP || treesaver.capabilities.SUPPORTS_TOUCH) {
        // Need dummy handler in order to get bubbled events
        fallbackNode.setAttribute('onclick', 'void(0)');
      }
    }

    // Figures are skipped during sanitization, so must do it manually here
    treesaver.layout.Block.sanitizeNode(fallbackNode, baseLineHeight);

    // Construct
    this.fallback = new treesaver.layout.Block(fallbackNode, baseLineHeight, indices, true);
    this.fallback.figure = this;
    if (this.fallback.blocks) {
      // Set the figure on any child blocks
      this.fallback.blocks.forEach(function(block) {
        block.figure = this;
        block.withinFallback = true;
      }, this);
    }

    // Remove the node
    parent.removeChild(fallbackNode);

    // Done
  };

  /**
   * Retrieve a qualifying figureSize for the given size name
   *
   * @param {!string} size
   * @return {?treesaver.layout.FigureSize} Null if not found.
   */
  Figure.prototype.getSize = function(size) {
    var i, len;

    if (this.sizes[size]) {
      for (i = 0, len = this.sizes[size].length; i < len; i += 1) {
        if (this.sizes[size][i].meetsRequirements()) {
          return this.sizes[size][i];
        }
      }
    }

    // None found
    return null;
  };

  /**
   * Retrieve the largest figureSize that fits within the allotted space
   *
   * @param {!treesaver.dimensions.Size} maxSize
   * @param {boolean=} isLightbox True if display is for a lightbox.
   * @return {?{name: string, figureSize: treesaver.layout.FigureSize}} Null if none fit
   */
  Figure.prototype.getLargestSize = function(maxSize, isLightbox) {
    var maxArea = -Infinity,
        availArea = maxSize.w * maxSize.h,
        closest,
        closestArea = Infinity,
        max,
        current,
        sizes = this.sizes;

    if (isLightbox && this.sizes['lightbox']) {
      // Only look at lightbox figures
      sizes = { 'lightbox': this.sizes['lightbox'] };
    }

    for (current in sizes) {
      this.sizes[current].forEach(function(figureSize) {
        if (!figureSize.meetsRequirements()) {
          // Not eligible
          return;
        }

        var area = figureSize.minW * figureSize.minH;

        if ((figureSize.minW && figureSize.minW > maxSize.w) ||
            (figureSize.minH && figureSize.minH > maxSize.h)) {
          // Too big
          if (!max && this.scrollable) {
            // If nothing fits yet, find something at least near
            if (area <= closestArea) {
              closestArea = area;
              closest = {
                name: current,
                figureSize: figureSize
              };
            }
          }

          return;
        }

        // TODO: How to estimate dimensions when no info is provided?
        //
        // Use this current size only if it's bigger than the one we
        // found before (based on area)
        if (area >= maxArea) {
          maxArea = area;
          max = {
            name: current,
            figureSize: figureSize
          };
        }
      }, this);
    }

    return max || closest;
  };

  /**
   * @param {!Array.<string>} sizes
   * @param {!string} html
   * @param {number} minW
   * @param {number} minH
   * @param {?Array.<string>} requirements
   */
  Figure.prototype.saveSizes = function saveSizes(sizes, html, minW, minH, requirements) {
    // First, create the FigureSize
    var figureSize = new FigureSize(html, minW, minH, requirements);

    sizes.forEach(function(size) {
      if (this.sizes[size]) {
        this.sizes[size].push(figureSize);
      }
      else {
        this.sizes[size] = [figureSize];
      }
    }, this);
  };

  /**
   * @param {!Element} el
   */
  Figure.prototype.processElement = function processElement(el) {
    var sizes = el.getAttribute('data-sizes'),
        // Use native width & height if available, otherwise use custom data- properties
        minW = parseInt(el.getAttribute(dom.hasAttr(el, 'width') ? 'width' : 'data-minwidth'), 10),
        minH = parseInt(el.getAttribute(dom.hasAttr(el, 'height') ? 'height' : 'data-minheight'), 10),
        requirements = dom.hasAttr(el, 'data-requires') ?
          el.getAttribute('data-requires').split(' ') : null,
        html;

    if (requirements) {
      if (!capabilities.check(requirements)) {
        // Does not meet requirements, skip
        return;
      }
    }

    // Remove class=hidden or hidden attribute in case used for display cloaking
    el.removeAttribute('hidden');
    dom.removeClass(el, 'hidden');

    // TODO: Remove properties we don't need to store (data-*)

    // Set up any scrollable elements
    treesaver.ui.Scrollable.initDomTree(el);

    // Grab HTML
    html = dom.outerHTML(el);

    if (!sizes) {
      sizes = ['fallback'];
    }
    else {
      sizes = sizes.split(' ');
    }

    this.saveSizes(sizes, html, minW, minH, requirements);
  };

  /**
   * @param {!Element} el
   * @return {boolean} True if the element is a figure.
   */
  Figure.isFigure = function(el) {
    var nodeName = el.nodeName.toLowerCase();
    return el.nodeType === 1 && nodeName === 'figure';
  };

  if (goog.DEBUG) {
    // Expose for testing
    Figure.prototype.toString = function() {
      return '[Figure: ' + this.index + '/' + this.figureIndex + ']';
    };
  }
});

// Input 22
/**
 * @fileoverview A block element.
 */

goog.provide('treesaver.layout.Block');

goog.require('treesaver.array');
goog.require('treesaver.debug');
goog.require('treesaver.dimensions');
goog.require('treesaver.dom');
goog.require('treesaver.layout.Figure');

goog.scope(function() {
  var array = treesaver.array,
      debug = treesaver.debug,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom,
      Figure = treesaver.layout.Figure;

  /**
   * A block element. Includes paragraphs, images, lists, etc.
   * @param {!Node} node HTML node.
   * @param {!number} baseLineHeight The normal line height used across
   *                                 the article content (in pixels).
   * @param {!Object} indices Current block and figure index.
   * @param {?boolean} isFallback Whether child figures should be ignored.
   * @constructor
   */
  treesaver.layout.Block = function(node, baseLineHeight, indices, isFallback) {
    var isReplacedElement = treesaver.layout.Block.isReplacedElement(node),
        hasFigures,
        figureSizes,
        html_zero = '',
        children,
        clone;

    if (goog.DEBUG) {
      if (!indices) {
        debug.warn('Autogen indices. Will not work in production!');
        indices = {
          index: 0,
          figureIndex: 0
        };
      }
    }

    // Is this an HTML element?
    // TODO: Remove this check?
    if (node.nodeType !== 1) {
      debug.error('Non-element sent into Block constructor: ' + node);

      // Ignore whitespace, comments, etc
      this.ignore = true;
      return;
    }

    node = /** @type {!Element} */ (node);

    // Quick check in case the element is display none and should be ignored
    if (!dimensions.getOffsetHeight(node)) {
      // TODO: Check display: none / visibility: collapse
      // This is a very defensive move, since a display: none item that
      // is made visible when in a specific column or grid can really mess up a
      // layout
      debug.warn('Zero-height block ignored');

      this.ignore = true;
      return;
    }

    this.index = indices.index;
    indices.index += 1;

    this.hasBlockChildren = !isReplacedElement &&
      treesaver.layout.Block.hasBlockChildren(node);

    ///////////////
    // Hierarchy
    ///////////////

    this.blocks = [];
    this.figures = [];

    /** @type {?boolean} */
    hasFigures = false;
    if (this.hasBlockChildren && !dom.hasClass(node, 'keeptogether')) {
      // Extract child blocks and figures
      treesaver.layout.Block.
        processChildren(this, node, baseLineHeight, indices, isFallback);

      // TODO: Collapse if there is only one child element

      hasFigures = !!this.figures.length;

      // An item only has block children if it actually has block children
      this.hasBlockChildren = !!this.blocks.length;
    }
    else {
      // TODO: What if there are figures within a keeptogether?
      // Or a paragraph, for that matter
    }

    this.breakable = this.breakable || !isReplacedElement;
    this.keepwithnext = dom.hasClass(node, 'keepwithnext');
    this.columnBreak = dom.hasClass(node, 'columnbreak');
    this.keeptogether = this.keeptogether || !this.breakable ||
                        dom.hasClass(node, 'keeptogether');

    /////////////
    // Metrics
    /////////////

    this.metrics = new dimensions.Metrics(node);

    // Correct line height in case there's a funky non-pixel value
    if (!this.metrics.lineHeight) {
      this.metrics.lineHeight = baseLineHeight;
    }

    // Check if the entire element is a single line, if so then we need to
    // mark keeptogether
    if (!this.keeptogether) {
      this.keeptogether = ((this.metrics.bpHeight + this.metrics.lineHeight) ===
        this.metrics.outerH);
    }

    /**
     * Distance from the top edge of the border to the first line of content
     * @type {number}
     */
    this.firstLine = this.keeptogether ?
      // Unbreakable items have to take the entire content (including bp)
      this.metrics.outerH :
      // No children is just BP plus line height
      !this.hasBlockChildren ? this.metrics.bpTop + this.metrics.lineHeight :
      // With children, but no fallback children it's the border, padding,
      // and first line of first child (unless there is a bpTop, in which
      // case we must add the top margin of the first child)
      !this.containsFallback ?
          this.metrics.bpTop + this.blocks[0].firstLine +
          (this.metrics.bpTop ? this.blocks[0].metrics.marginTop : 0) :
      // When there's a fallback child, it get's tricky, since we don't know
      // whether or not we'll include the fallback element ... for now, just
      // do the same thing we do in our previous case
      // TODO: Fix this
      this.metrics.bpTop + this.blocks[0].firstLine;

    // Litter the element with debug info
    if (goog.DEBUG) {
      node.setAttribute('data-index', this.index);
      node.setAttribute('data-outerHeight', this.metrics.outerH);
      node.setAttribute('data-marginTop', this.metrics.marginTop);
      node.setAttribute('data-marginBottom', this.metrics.marginBottom);
      node.setAttribute('data-firstLine', this.firstLine);
    }

    ////////////
    // HTML
    ////////////

    this.html = dom.outerHTML(node);
    this.openTag = this.hasBlockChildren ?
      this.html.substr(0, this.html.indexOf('>') + 1) : null;
    this.closeTag = this.hasBlockChildren ?
      this.html.slice(this.html.lastIndexOf('<')) : null;

    // If there are figures in this element (or any child),
    // they must not be included in the html
    if (hasFigures) {
      this.html = /** @type {!string} */ (this.openTag);
      this.blocks.forEach(function(block) {
        this.html += block.html;
      }, this);
      this.html += this.closeTag;
    }

    if (this.hasBlockChildren) {
      // We filter out figures and other
      // When breaking a parent element across columns or pages, need to have
      // zero-margin/border/padding versions in order to nest correctly

      // Use a clone so we don't mess up all the HTML up the tree
      clone = /** @type {!Element} */ (node.cloneNode(true));

      if (this.metrics.marginTop) {
        dimensions.setCssPx(clone, 'marginTop', 0);
      }
      if (this.metrics.borderTop) {
        dimensions.setCssPx(clone, 'borderTopWidth', 0);
      }
      if (this.metrics.paddingTop) {
        dimensions.setCssPx(clone, 'paddingTop', 0);
      }
      html_zero = dom.outerHTML(clone);
    }

    this.openTag_zero = this.hasBlockChildren ?
      html_zero.substr(0, html_zero.indexOf('>') + 1) : null;
  };
});

// Use another scope block in order to have a reference to the new Block class
goog.scope(function() {
  var array = treesaver.array,
      Block = treesaver.layout.Block,
      debug = treesaver.debug,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom,
      Figure = treesaver.layout.Figure;

  /**
   * Index of this block within the article
   * @type {!number}
   */
  Block.prototype.index;

  /**
   * @type {boolean}
   */
  Block.prototype.hasBlockChildren;

  /**
   * @type {boolean}
   */
  Block.prototype.isFallback;

  /**
   * @type {boolean}
   */
  Block.prototype.withinFallback;

  /**
   * @type {boolean}
   */
  Block.prototype.containsFallback;

  /**
   * @type {?treesaver.layout.Figure}
   */
  Block.prototype.figure;

  /**
   * Blocks contained within this block
   * @type {?Array.<treesaver.layout.Block>}
   */
  Block.prototype.blocks;

  /**
   * Figures contained within this block
   * @type {?Array.<treesaver.layout.Block>}
   */
  Block.prototype.figures;

  /**
   * Next Sibling
   * @type {?treesaver.layout.Block}
   */
  Block.prototype.nextSibling;

  /**
   * Parent block
   * @type {?treesaver.layout.Block}
   */
  Block.prototype.parent;

  /**
   * Can this block be broken into multiple pieces (across cols/pages)
   * @type {boolean}
   */
  Block.prototype.breakable;

  /**
   * Make sure this block and the next block are in the same column
   * @type {boolean}
   */
  Block.prototype.keepwithnext;

  /**
   * Begin a new column before adding this block
   * @type {boolean}
   */
  Block.prototype.columnBreak;

  /**
   * Should this block remain unbroken, if possible
   * @type {boolean}
   */
  Block.prototype.keeptogether;

  /**
   * @type {!treesaver.dimensions.Metrics}
   */
  Block.prototype.metrics;

  /**
   * Distance from the top edge of the border to the first line of content
   * @type {number}
   */
  Block.prototype.firstLine;

  /**
   * HTML for entire element (content and children)
   * @type {!string}
   */
  Block.prototype.html;

  /**
   * HTML for opening tag
   * @type {?string}
   */
  Block.prototype.openTag;

  /**
   * HTML for closing tag
   * @type {?string}
   */
  Block.prototype.closeTag;

  /**
   * HTML for opening tag when in progress
   * @type {?string}
   */
  Block.prototype.openTag_zero;

  /**
   * Find the next block, never going to children
   *
   * @return {?treesaver.layout.Block} The next block in content that is not
   *                                   contained within this block.
   */
  Block.prototype.getNextNonChildBlock = function() {
    if (this.nextSibling) {
      return this.nextSibling;
    }
    else if (this.parent) {
      return this.parent.getNextNonChildBlock();
    }
    else {
      return null;
    }
  };

  /**
   * Note, this function is re-used by Content
   *
   * @param {!treesaver.layout.Block|treesaver.layout.Content} owner
   * @param {!Element} node
   * @param {!number} baseLineHeight
   * @param {!Object} indices Current block and figure index.
   * @param {?boolean=} isFallback Whether child figures should be ignored.
   */
  Block.processChildren =
    function(owner, node, baseLineHeight, indices, isFallback) {
    var prev,
        isBlock = owner instanceof Block,
        // Is checking 'start' enough here?
        isList = node.nodeName.toLowerCase() === 'ol' && 'start' in node,
        listIndex = isList ? node.start : null;

    // This fix is specifically for Firefox which returns -1 when the
    // `start` or `value` attribute is not set.
    if (listIndex === -1) {
      listIndex = 1;
    }

    array.toArray(node.childNodes).forEach(function(childNode) {
      var child;

      if (isList && childNode.nodeName.toLowerCase() === 'li') {
        // Zero value is ignored (i.e. you can't have item 0)
        if (childNode.value && childNode.value !== -1) {
          listIndex = childNode.value;
        }

        childNode.setAttribute('value', listIndex);
        listIndex += 1;
      }

      if (Figure.isFigure(childNode)) {
        // Want to prevent figures nested within fallbacks (gets confusing)
        if (isFallback) {
          debug.warn('Child figure ignored');

          return; // Next
        }

        child = new Figure(childNode, baseLineHeight, indices);
        owner.figures.push(child);
        if ((child = child.fallback)) {
          child.isFallback = true;
          if (isBlock) {
            owner.containsFallback = true;
          }
        }
      }
      else {
        child = new Block(childNode, baseLineHeight, indices, !!isFallback);
        if (isBlock && !owner.containsFallback) {
          owner.containsFallback = child.containsFallback;
        }
      }

      if (child && !child.ignore) {
        owner.blocks = owner.blocks.concat(child, child.blocks || []);
        // TODO: Clear out children references and convert to indices?

        if (child.figures.length) {
          owner.figures = owner.figures.concat(child.figures);
          // No need to keep them in memory?
          delete child.figures;
        }

        // Keep track of hierarchy
        // But only if owner is a block (i.e. not Figure or Content)
        child.parent = isBlock ?
          (/** @type {!treesaver.layout.Block} */ (owner)) : null;

        if (prev) {
          prev.nextSibling = child;
        }
        prev = child;
      }
    });
  };

  /**
   * @param {?boolean} useZero Whether the open tags should be the
   *                          zero-margin versions.
   * @return {string}
   */
  Block.prototype.openAllTags = function(useZero) {
    var cur = this.parent,
        tags = [];

    while (cur) {
      // Insert in reverse order
      tags.unshift(useZero ? cur.openTag_zero : cur.openTag);
      cur = cur.parent;
    }

    return tags.join('');
  };

  /**
   * @return {string}
   */
  Block.prototype.closeAllTags = function() {
    var cur = this.parent,
        tags = [];

    while (cur) {
      tags.push(cur.closeTag);
      cur = cur.parent;
    }

    return tags.join('');
  };

  /**
   * @return {number}
   */
  Block.prototype.totalBpBottom = function() {
    var cur = this,
        total = cur.metrics.bpBottom;

    while ((cur = cur.parent)) {
      total += cur.metrics.bpBottom;
    }

    return total;
  };

  /**
   * Tries to detect whether this element has children that are blocks,
   * and should therefore be treated more like a <div> (or whatever)
   *
   * Assumptions:
   *   - See definitions for inline_containers and block_containers
   *   - If the element is not in either of those, then we test manually
   *
   * @param {!Element} node
   * @return {boolean} True if the node has children that are blocks.
   */
  Block.hasBlockChildren = function(node) {
    // Assume paragraph nodes are never block parents
    if (Block.isInlineContainer(node)) {
      return false;
    }

    // Assume lists are containers
    if (Block.isBlockContainer(node)) {
      return true;
    }

    // Go through and test the hard way
    var i, len, child,
        childStyle, child_seen = false;

    for (i = 0, len = node.childNodes.length; i < len; i += 1) {
      child = node.childNodes[i];

      // Text node -- check if it's whitespace only
      if (child.nodeType === 3 && /[^\s]/.test(child.data)) {
        // Found non-whitespace text node, bow out now
        return false;
      }
      else if (child.nodeType === 1) {
        // If we see a container, then we are definitely a container ourselves
        if (Block.isInlineContainer(child) || Block.isBlockContainer(child)) {
          return true;
        }

        child_seen = true;
        childStyle = treesaver.css.getStyleObject(child);
        if (/inline/.test(childStyle.display)) {
          // Found an inline text node, bow out
          return false;
        }
        else if (/block/.test(childStyle.display)) {
          // Found a block, means we're a block too
          return true;
        }
      }

      // Ignore non-text, non-element nodes
    }

    // If we've made it this far, it means there are no inline or non-whitespace
    // text nodes, but there could also just be no nodes ... check and make sure
    return child_seen;
  };

  /**
   * TODO: Textarea, fieldset, and other forms?
   * TODO: Remove table
   * @type {Array.<string>}
   */
  Block.replaced_elements = ['img', 'video', 'object', 'embed',
    'iframe', 'audio', 'canvas', 'svg', 'table'];

  /**
   * @param {!Node} el
   * @return {boolean} True if the element is a replaced element.
   */
  Block.isReplacedElement = function(el) {
    var nodeName = el.nodeName.toLowerCase();
    return el.nodeType === 1 &&
          Block.replaced_elements.indexOf(nodeName) !== -1;
  };

  /**
   * @type {Array.<string>}
   */
  Block.inline_containers = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  /**
   * @param {!Element} el
   * @return {boolean} True if the element is a replaced element.
   */
  Block.isInlineContainer = function(el) {
    var nodeName = el.nodeName.toLowerCase();
    return el.nodeType === 1 &&
          Block.inline_containers.indexOf(nodeName) !== -1;
  };

  /**
   * @type {Array.<string>}
   */
  Block.block_containers = ['div', 'article', 'ul', 'ol', 'figure', 'aside'];

  /**
   * @param {!Element} el
   * @return {boolean} True if the element is a replaced element.
   */
  Block.isBlockContainer = function(el) {
    var nodeName = el.nodeName.toLowerCase();
    return el.nodeType === 1 &&
          Block.block_containers.indexOf(nodeName) !== -1;
  };

  /**
   * Make sure this HTML node adheres to our strict standards
   *
   * @param {!Element} node
   * @param {!number} baseLineHeight
   * @return {Element} The same node passed in (for chaining).
   */
  Block.sanitizeNode = function(node, baseLineHeight) {
    // Should never get text & comment nodes
    if (node.nodeType !== 1) {
      debug.error('Text node sent to sanitize: ' + node);
      return node;
    }

    var i, childNode;

    // Remove IDs, since we can end up with more than one copy of an element
    // in the tree (across column splits, etc)
    node.removeAttribute('id');

    // Assumption is that the Figure can take care of it's own metrics
    if (Figure.isFigure(node)) {
      // TODO: Is there anything that might need to be fixed here?
      //   - Default sizes
      //   - Hybrid?
      return node;
    }

    // Strip out all non-element nodes (textnodes, comments) from block nodes
    if (Block.hasBlockChildren(node) && !dom.hasClass(node, 'keeptogether')) {
      for (i = node.childNodes.length - 1; i >= 0; i -= 1) {
        childNode = node.childNodes[i];
        if (childNode.nodeType !== 1) {
          node.removeChild(childNode);
        }
        else {
          // Sanitize child nodes
          Block.sanitizeNode(childNode, baseLineHeight);
        }
      }
    }
    else {
      // No block nodes, nothing to do?
    }

    // Make sure all our metrics line up with our vertical grid
    if (!window.TS_NO_AUTOMETRICS) {
      Block.normalizeMetrics_(node, baseLineHeight);
    }

    return node;
  };

  /**
   * Normalize the margin, border, and padding to line up with the base
   * line height grid
   *
   * @private
   * @param {!Element} node
   * @param {!number} baseLineHeight
   */
  Block.normalizeMetrics_ = function(node, baseLineHeight) {
    if (!baseLineHeight) {
      debug.error('No line height provided to normalizeMetrics_');
    }

    var metrics = new dimensions.Metrics(node);

    // Enforce margins that are multiples of base line height
    if (metrics.marginTop % baseLineHeight) {
      dimensions.setCssPx(node, 'marginTop',
        dimensions.roundUp(metrics.marginTop, baseLineHeight));
    }
    if (metrics.marginBottom % baseLineHeight) {
      dimensions.setCssPx(node, 'marginBottom',
        dimensions.roundUp(metrics.marginBottom, baseLineHeight));
    }

    // Special handling for unbreakable elements
    if (Block.isReplacedElement(node) || dom.hasClass(node, 'keeptogether')) {
      // TODO: What if there are figures within a keeptogether?
      // Currently, ignore anything in a keeptogether (figures, children, etc)

      // Can't modify the metrics within a replaced element, so just
      // make sure that the outerHeight & margins work out OK
      if (metrics.outerH % baseLineHeight) {
        dimensions.setCssPx(node, 'paddingBottom', metrics.paddingBottom +
            baseLineHeight - metrics.outerH % baseLineHeight);
      }

      // Done
      return node;
    }

    // Enforce a line height that is a multiple of the base line height
    if (!metrics.lineHeight) {
      metrics.lineHeight = baseLineHeight;
      dimensions.setCssPx(node, 'lineHeight', baseLineHeight);
    }
    else if (metrics.lineHeight % baseLineHeight) {
      dimensions.setCssPx(node, 'lineHeight',
        dimensions.roundUp(metrics.lineHeight, baseLineHeight));
    }

    // Make sure border & padding match up
    if (metrics.bpTop % baseLineHeight) {
      dimensions.setCssPx(node, 'paddingTop',
        dimensions.roundUp(metrics.bpTop, baseLineHeight) -
        metrics.borderTop);
    }
    if (metrics.bpBottom % baseLineHeight) {
      metrics.paddingBottom = dimensions.setCssPx(node, 'paddingBottom',
        dimensions.roundUp(metrics.bpBottom, baseLineHeight) -
        metrics.borderBottom);
    }

    // (Potentially) changed padding and line-height, so update outerH
    metrics.outerH = dimensions.getOffsetHeight(node);

    // Sanity check to make sure something out of our control isn't
    // happening
    if (metrics.outerH % baseLineHeight) {
      // Shit, looks like even with the normalization, we're still out of
      // sync. Use padding bottom to fix it up
      debug.info('Forcing padding due to mismatch: ' + node);

      metrics.paddingBottom += baseLineHeight - metrics.outerH % baseLineHeight;

      // Now re-set the paddingBottom
      dimensions.setCssPx(node, 'paddingBottom', metrics.paddingBottom);
    }

    return node;
  };

  if (goog.DEBUG) {
    Block.prototype.toString = function() {
      return '[Block: ' + this.metrics.outerH + '/' +
        this.metrics.lineHeight + ']';
    };
  }
});

// Input 23
/**
 * @fileoverview The Content class.
 */

goog.provide('treesaver.layout.Content');

goog.require('treesaver.css');
goog.require('treesaver.debug');
goog.require('treesaver.dimensions');
goog.require('treesaver.dom');
goog.require('treesaver.layout.Block');

goog.scope(function() {
  var css = treesaver.css,
      debug = treesaver.debug,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom,
      Block = treesaver.layout.Block;

  /**
   * A chunk of content
   *
   * @constructor
   * @param {!Element} el HTML node which contains all content.
   * @param {!treesaver.ui.Document} doc The parent document that owns this content chunk.
   */
  treesaver.layout.Content = function(el, doc) {
    var indices = {
      index: 0,
      figureIndex: 0
    };

    // TODO: More intelligent back-up value
    this.lineHeight =
      Math.ceil(dimensions.toPixels(el, css.getStyleObject(el).lineHeight) || 1);

    this.colWidth = dimensions.getOffsetWidth(el);

    // In order to properly measure the dimensions of all the content,
    // we need to hide all figures to prevent them from being laid out
    // This causes no harm, since the actual <figure> element is always
    // stripped out of the content
    // TODO: Even without doing harm, this is a silly hack and it'd be
    // better to find a good way to deal with this situation.
    dom.querySelectorAll('figure', el).forEach(function(figure) {
      figure.style.display = 'none';
    });

    // Before we go through and construct our data objects, it really
    // pays off to sanitize all the content, correcting for invalid
    // line height, margins, etc, etc
    // Note that this modifies the tree in place
    Block.sanitizeNode(el, this.lineHeight);

    this.figures = [];
    this.blocks = [];

    this.doc = doc;

    // Now we're ready to create our objects, re-use the processChildren
    // function because it does exactly what we need
    Block.processChildren(this, el, this.lineHeight, indices);
  };

  /**
   * Base line height used throughout the article
   *
   * @type {number}
   */
  treesaver.layout.Content.prototype.lineHeight;

  /**
   * The column width at which this content was measured
   *
   * @type {number}
   */
  treesaver.layout.Content.prototype.colWidth;

  /**
   * @type {Array.<treesaver.layout.Figure>}
   */
  treesaver.layout.Content.prototype.figures;

  /**
   * @type {Array.<treesaver.layout.Block>}
   */
  treesaver.layout.Content.prototype.blocks;

  /**
   * @type {!treesaver.ui.Document}
   */
  treesaver.layout.Content.prototype.doc;

  if (goog.DEBUG) {
    treesaver.layout.Content.prototype.toString = function() {
      return '[Content]';
    };
  }
});

// Input 24
/**
 * @fileoverview Column data structure.
 */

goog.provide('treesaver.layout.Column');

goog.require('treesaver.dimensions');
goog.require('treesaver.dom');

goog.scope(function() {
  var dimensions = treesaver.dimensions,
      dom = treesaver.dom;

  /**
   * A column within a grid
   *
   * @constructor
   * @param {!Element} el         HTML element.
   * @param {number}   gridHeight The height of the grid that contains this column.
   */
  treesaver.layout.Column = function(el, gridHeight) {
    var d = new dimensions.Metrics(el);

    this.flexible = !dom.hasClass(el, 'fixed');

    this.minH = d.minH;

    // Need to clear the minHeight, if there is one, in order to get an accurate
    // delta reading
    if (this.minH) {
      dimensions.setCssPx(el, 'minHeight', 0);
    }

    this.h = d.outerH;
    this.w = d.outerW;

    this.delta = Math.max(0, gridHeight - this.h);
  };
});

goog.scope(function() {
  var Column = treesaver.layout.Column;

  /**
   * @type {boolean}
   */
  Column.prototype.flexible;

  /**
   * @type {number}
   */
  Column.prototype.minH;

  /**
   * @type {number}
   */
  Column.prototype.h;

  /**
   * @type {number}
   */
  Column.prototype.delta;

  /**
   * @param {number} gridHeight
   * @return {!treesaver.layout.Column} Returns self for chaining support.
   */
  Column.prototype.stretch = function(gridHeight) {
    if (!this.flexible) {
      return this;
    }

    this.h = Math.max(0, gridHeight - this.delta);

    return this;
  };

  if (goog.DEBUG) {
    Column.prototype.toString = function() {
      return '[Column ' + this.h + '/' + this.delta + ']';
    };
  }
});

// Input 25
/**
 * @fileoverview Container data structure.
 */

goog.provide('treesaver.layout.Container');

goog.require('treesaver.dimensions');
goog.require('treesaver.dom');

goog.scope(function() {
  var dimensions = treesaver.dimensions,
      dom = treesaver.dom;

  /**
   * A column within a grid
   *
   * @constructor
   * @param {!Element} el         HTML element.
   * @param {number}   gridHeight The height of the grid that contains this container.
   */
  treesaver.layout.Container = function(el, gridHeight) {
    var d = new treesaver.dimensions.Metrics(el);

    this.flexible = !treesaver.dom.hasClass(el, 'fixed');

    this.minH = d.minH;

    // Need to clear the minHeight, if there is one, in order to get an accurate
    // delta reading
    if (this.minH) {
      treesaver.dimensions.setCssPx(el, 'minHeight', 0);
    }

    this.h = d.outerH;

    this.delta = Math.max(0, gridHeight - this.h);

    var sizesProperty = el.getAttribute('data-sizes');

    /**
     * @type {!Array.<string>}
     */
    this.sizes = sizesProperty ? sizesProperty.split(' ') : [];
  };
});

goog.scope(function() {
  var Container = treesaver.layout.Container,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom;

  /**
   * @type {boolean}
   */
  Container.prototype.flexible;

  /**
   * @type {number}
   */
  Container.prototype.minH;

  /**
   * @type {number}
   */
  Container.prototype.h;

  /**
   * @type {number}
   */
  Container.prototype.delta;

  /**
   * @type {!Array.<string>}
   */
  Container.prototype.sizes;

  /**
   * @param {number} gridHeight
   * @return {!treesaver.layout.Container} Returns self for chaining support.
   */
  Container.prototype.stretch = function(gridHeight) {
    if (!this.flexible) {
      return this;
    }

    this.h = Math.max(0, gridHeight - this.delta);

    return this;
  };

  if (goog.DEBUG) {
    Container.prototype.toString = function() {
      return '[Container ' + this.h + '/' + this.delta + ']';
    };
  }
});

// Input 26
/**
 * @fileoverview A skeleton of page, later filled with content.
 */

goog.provide('treesaver.layout.Grid');

goog.require('treesaver.capabilities');
goog.require('treesaver.debug');
goog.require('treesaver.dom');
goog.require('treesaver.dimensions');
goog.require('treesaver.layout.Column');
goog.require('treesaver.layout.Container');

goog.scope(function() {
  var debug = treesaver.debug,
      dom = treesaver.dom,
      dimensions = treesaver.dimensions,
      Column = treesaver.layout.Column,
      Container = treesaver.layout.Container;

  /**
   * Grid class
   * @constructor
   * @param {!Element} node HTML root for grid.
   */
  treesaver.layout.Grid = function(node) {
    if (goog.DEBUG) {
      if (!node || !dom.hasClass(node, 'grid')) {
        debug.error('Non grid passed to initGrid');
      }
    }

    // Insert into tree for measuring
    document.body.appendChild(node);

    // TODO: Only store mutable capabilities
    this.requirements = dom.hasAttr(node, 'data-requires') ?
      node.getAttribute('data-requires').split(' ') : null;

    this.classes = dom.classes(node).map(function(c) {
      // Force lowercase
      return c.toLowerCase();
    });

    this.flexible = !dom.hasClass(node, 'fixed');

    // Calculate all page scoring flags
    this.findScoringFlags();

    // Sizing
    // Flex grids get stretched later
    this.stretchedSize = this.size = new dimensions.Metrics(node);
    if (!this.flexible) {
      this.size.minH = this.size.h;
      this.size.minW = this.size.w;
    }
    else {
      // Use width instead of minWidth
      this.size.minW = Math.max(this.size.minW || 0, this.size.w);
    }
    // Line height needs to be set for stretch sizing ...
    // TODO: What's a reasonable back-up value here?
    this.lineHeight = Math.ceil(this.size.lineHeight || 1);

    this.textHeight = 0;
    this.maxColHeight = 0;
    this.colWidth = 0;

    this.cols = [];
    dom.querySelectorAll('.column', node).forEach(function(colNode) {
      var cur = new Column(colNode, this.size.h);
      this.cols.push(cur);

      // Calculate total height
      this.textHeight += cur.h;
      this.maxColHeight = Math.max(this.maxColHeight, cur.h);

      // Confirm column width
      if (!this.colWidth) {
        this.colWidth = cur.w;
      }
      else if (this.colWidth !== cur.w) {
        debug.error('Inconsistent column widths in grid');

        this.error = true;
      }
    }, this);

    this.containers = [];
    dom.querySelectorAll('.container', node).forEach(function(containerNode) {
      var cur = new Container(containerNode, this.size.h);
      this.containers.push(cur);
    }, this);

    // Save out the HTML after processing Columns and Containers, in order to maintain
    // any sanitization that may have occurred.
    this.html = dom.outerHTML(node);

    this.bonus = dom.hasCustomAttr(node, 'bonus') ?
      parseInt(dom.getCustomAttr(node, 'bonus'), 10) : 0;

    // Remove the child
    document.body.removeChild(node);
  };
});

goog.scope(function() {
  var Grid = treesaver.layout.Grid,
      capabilities = treesaver.capabilities,
      debug = treesaver.debug,
      dimensions = treesaver.dimensions;

  /**
   * List of required capabilities for this Grid
   *
   * @type {?Array.<string>}
   */
  Grid.prototype.requirements;

  /**
   * @type {Array.<string>}
   */
  Grid.prototype.classes;

  /**
   * @type {boolean}
   */
  Grid.prototype.flexible;

  /**
   * @type {Object.<string, boolean>}
   */
  Grid.prototype.scoringFlags;

  /**
   * @type {?Object.<number, boolean>}
   */
  Grid.prototype.pageNumberFlags;

  /**
   * @type {?Object.<number, boolean>}
   */
  Grid.prototype.pageNumberNegationFlags;

  /**
   * @type {!treesaver.dimensions.Metrics}
   */
  Grid.prototype.stretchedSize;

  /**
   * @type {!treesaver.dimensions.Metrics}
   */
  Grid.prototype.size;

  /**
   * @type {number}
   */
  Grid.prototype.lineHeight;

  /**
   * @type {number}
   */
  Grid.prototype.textHeight;

  /**
   * @type {number}
   */
  Grid.prototype.maxColHeight;

  /**
   * Width of columns used in this Grid
   * @type {number}
   */
  Grid.prototype.colWidth;

  /**
   * @type {boolean}
   */
  Grid.prototype.error;

  /**
   * @type {Array.<treesaver.layout.Column>}
   */
  Grid.prototype.cols;

  /**
   * @type {Array.<treesaver.layout.Container>}
   */
  Grid.prototype.containers;

  /**
   * @type {number}
   */
  Grid.prototype.bonus;

  /**
   * @type {string}
   */
  Grid.prototype.html;

  Grid.knownFlags = {
    'onlypage': true,
    'odd': true,
    'even': true,
    'sizetocontainer': true
  };

  Grid.pageFlagRegex = /^(no-)?page-(\d+)$/;

  /**
   * Parse the class array and find any scoring flags
   */
  Grid.prototype.findScoringFlags = function() {
    var pageNumberFlagFound = false,
        match, index;

    this.scoringFlags = {};
    this.pageNumberFlags = {};
    this.pageNumberNegationFlags = {};

    this.classes.forEach(function(className) {
      if (className in Grid.knownFlags) {
        this.scoringFlags[className] = true;
      }
      else if ((match = Grid.pageFlagRegex.exec(className))) {
        index = parseInt(match[2], 10);

        if (!isNaN(index)) {
          if (className.substr(0, 3) === 'no-') {
            this.pageNumberNegationFlags[index] = true;
          }
          else {
            pageNumberFlagFound = true;
            this.pageNumberFlags[index] = true;
          }
        }
      }
    }, this);

    if (!pageNumberFlagFound) {
      this.pageNumberFlags = null;
    }
  };

  /**
   * Stretch the height of a grid
   * @param {number} totalHeight The maximum possible height (including margin,
   *                             border, and padding) of the grid.
   */
  Grid.prototype.stretch = function(totalHeight) {
    if (!this.flexible) {
      return this;
    }

    var i, len, cur,
        contentHeight = totalHeight -
          (this.size.marginHeight + this.size.bpHeight),
        finalHeight = Math.min(this.size.maxH,
            Math.max(contentHeight, this.size.minH)),
        delta = finalHeight - this.size.minH || 0;

    // Our height is always min plus a multiple of lineheight
    finalHeight -= delta % this.lineHeight;

    this.maxColHeight = 0;

    this.textHeight = 0;
    // Stretch columns and compute new heights
    this.cols.forEach(function(col) {
      this.textHeight += col.stretch(finalHeight).h;
      this.maxColHeight = Math.max(this.maxColHeight, col.h);
    }, this);

    // Stretch containers
    this.containers.forEach(function(container) {
      container.stretch(finalHeight);
    }, this);

    this.stretchedSize = this.size.clone();
    this.stretchedSize.h = finalHeight;
    this.stretchedSize.outerH = finalHeight + this.size.bpHeight;

    // Max
    if (!this.scoringFlags['sizetocontainer']) {
      this.stretchedSize.maxH =
        Math.min(this.size.maxH, finalHeight + this.lineHeight * 3);
    }
    else {
      this.stretchedSize.maxH = this.size.maxH;
    }

    return this;
  };

  /**
   * Comparison function for sorting grids
   * @param {!treesaver.layout.Grid} a
   * @param {!treesaver.layout.Grid} b
   */
  Grid.sort = function(a, b) {
    // Sort by column and container count, descending
    // Note: Grids should be stretched beforehand
    return (b.size.w + 20 * b.containers.length) -
      (a.size.w + 20 * a.containers.length);
  };

  /**
   * Compute the score for this grid given the current state
   * of pagination
   * @param {!treesaver.layout.Content} content
   * @param {!treesaver.layout.BreakRecord} breakRecord
   */
  Grid.prototype.score = function(content, breakRecord) {
    var score = 0,
        humanPageNum = breakRecord.pageNumber + 1;

    // Bonus for higher column count
    score += this.cols.length * Grid.SCORING.COLUMN;
    // Penalize for incompatible line heights
    if (this.lineHeight !== content.lineHeight) {
      score -= Grid.SCORING.DIFFERENT_LINEHEIGHT;
    }

    if (this.colWidth && this.colWidth !== content.colWidth) {
      score -= Grid.SCORING.DIFFERENT_COLWIDTH;
    }

    // Page flags
    if (this.scoringFlags['onlypage']) {
      // TODO: Use different values for penalties and bonuses
      score += breakRecord.pageNumber ? -Grid.SCORING.NON_ONLY_PAGE :
        Grid.SCORING.ONLY_PAGE;
    }

    // Check general page number flag
    if (this.pageNumberFlags) {
      if (this.pageNumberFlags[humanPageNum]) {
        score += Grid.SCORING.PAGE_NUMBER;
      }
      else {
        score -= Grid.SCORING.NON_PAGE_NUMBER;
      }
    }

    // Check negations
    if (this.pageNumberNegationFlags[humanPageNum]) {
      score -= Grid.SCORING.NON_PAGE_NUMBER;
    }

    if (humanPageNum % 2) {
      score += this.scoringFlags['odd'] ? Grid.SCORING.ODD_PAGE :
        this.scoringFlags['even'] ? -Grid.SCORING.NON_EVEN_ODD : 0;
    }
    else {
      score += this.scoringFlags['even'] ? Grid.SCORING.EVEN_PAGE :
        this.scoringFlags['odd'] ? -Grid.SCORING.NON_EVEN_ODD : 0;
    }

    if (this.bonus && score >= 0) {
      score += this.bonus;
    }

    return score;
  };

  /**
   * Typedef for compiler
   * TODO: Make a real typedef
   *
   * @typedef {{figureIndex, figureSize, flexible}}
   */
  Grid.ContainerMap;

  /**
   * @param {!treesaver.layout.Content} content
   * @param {!treesaver.layout.BreakRecord} br
   * @return {!Array.<treesaver.layout.Grid.ContainerMap>}
   */
  Grid.prototype.mapContainers = function(content, br) {
    var i, len, container,
        k, size,
        figureIndex, currentIndex,
        figure, figureSize, figures,
        delayed, usingDelayed,
        map = [];

    // Loop through each container and see if we have a figure that fits
    container_loop:
    for (i = 0, len = this.containers.length; i < len; i += 1) {
      container = this.containers[i];
      map[i] = null;
      figureIndex = br.figureIndex;
      // Duplicate the delayed array
      delayed = br.delayed.slice(0);

      figure_loop:
      while (delayed.length || figureIndex < content.figures.length) {
        // Go through delayed/skipped figures first
        if ((usingDelayed = !!delayed.length)) {
          // Take the oldest figure first
          currentIndex = delayed.shift();
        }
        else {
          currentIndex = figureIndex;
        }
        figure = content.figures[currentIndex];

        // Start at the end of the size list in order to find
        // the highest possible match
        size_loop:
        for (k = container.sizes.length - 1; k >= 0; k -= 1) {
          size = container.sizes[k];

          // TODO: Watch for previous failures at this size

          figureSize = figure.getSize(size);

          if (figureSize) {
            // Make sure the height fits for flexible containers
            // Fixed containers should know better than to specify
            // a size that doesn't fit
            if (container.flexible && figureSize.minH &&
                figureSize.minH > container.h) {
              // This size won't work, go to the next
              continue size_loop;
            }

            // Container fits, store mapping
            map[i] = {
              figureIndex: currentIndex,
              figureSize: figureSize,
              size: size,
              // Also used for scoring
              flexible: container.flexible
            };

            // Mark the figure as used
            br.useFigure(currentIndex);

            // This container is filled, move on to the next container
            break figure_loop;
          }
        } // size_loop

        // Required figures must occur in-order
        if (!figure.optional) {
          // Can't move on to the next figure since it might cause
          // incorrect order
          // TODO: See if this figure could fit in other containers
          // Or perhaps flip order around to look at figures first, then
          // containers
          break;
        }

        // Try the next figure
        if (!usingDelayed) {
          figureIndex += 1;
        }
      } // figure_loop
    } // container_loop

    return map;
  };

  /**
   * @param {!string} themeName
   * @return {boolean} True if the grid is compatible with the given theme
   */
  Grid.prototype.hasTheme = function(themeName) {
    return this.classes.indexOf(themeName) !== -1;
  };

  /**
   * Eliminate a grid if it does not meet the current browser capabilities
   *
   * @return {boolean} False if the grid does not qualify
   */
  Grid.prototype.capabilityFilter = function() {
    if (!this.requirements) {
      return true;
    }

    return capabilities.check(this.requirements, true);
  };

  /**
   * Eliminate a grid if it does not fit within the specified size
   *
   * @param {!treesaver.dimensions.Size} size
   * @return {boolean} False if the grid does not qualify
   */
  Grid.prototype.sizeFilter = function(size) {
    var innerSize = {
      w: size.w - this.size.bpWidth, // Don't use margin for width
      h: size.h - this.size.bpHeight - this.size.marginHeight
    };

    return dimensions.inSizeRange(this.size, innerSize);
  };

  Grid.SCORING = {
    FINISH_TEXT: 250,
    FINISH_ALL: 2000,
    FIXED_CONTAINER: 5000,
    COLUMN: 50,
    EMPTINESS_PENALTY: 2000,
    EMPTY_CONTAINER_PENALTY: 5000,
    DIFFERENT_LINEHEIGHT: 2000,
    DIFFERENT_COLWIDTH: Infinity,
    CONTAINER_BONUS: 2000,
    CONTAINER_AREA_BONUS: 5,
    BLOCK_DELAY_PENALTY: 100,
    REQUIRED_BLOCK_BONUS: 4000,
    PAGE_NUMBER: 3000,
    ONLY_PAGE: 4000,
    ODD_PAGE: 2000,
    EVEN_PAGE: 2000,
    NON_EVEN_ODD: Infinity,
    NON_ONLY_PAGE: Infinity,
    NON_PAGE_NUMBER: Infinity
  };

  /**
    * Find the best grid for given content
    * @param {!treesaver.layout.Content} content
    * @param {!Array.<treesaver.layout.Grid>} grids
    * @param {!treesaver.layout.BreakRecord} breakRecord
    * @return {?{grid: !treesaver.layout.Grid, containers: !Array.<treesaver.layout.Grid.ContainerMap>}}
    */
  Grid.best = function(content, grids, breakRecord) {
    if (goog.DEBUG) {
      if (!content) {
        debug.error('No content passed to grid.best');
      }
      else if (!grids.length) {
        debug.error('No grids passed to grid.best');
      }
      else if (!breakRecord) {
        debug.error('No breakRecord passed to grid.best');
      }
    }

    var best = null,
        highScore = -Infinity,
        percentEmpty,
        containerMap,
        // Content block loop
        blockCount = content.blocks.length,
        block, blockHeightEstimate, figure,
        // Grid loop
        i, len, cur, br, score, height, remaining_height,
        // Container loop
        j, jlen, container, mapped_container, filledContainerCount, blockAdded;

    // Loop through each grid
    grid_loop:
    for (i = 0, len = grids.length; i < len; i += 1) {
      cur = grids[i];
      filledContainerCount = 0;
      blockAdded = false;
      br = breakRecord.clone();
      height = br.overhang;
      remaining_height = cur.textHeight - height;
      if (height && cur.textHeight) {
        // Overhang counts as a block
        blockAdded = true;
      }

      // Calculate score quickly based on easy information
      score = cur.score(content, br);

      // Create container map
      containerMap = cur.mapContainers(content, br);

      // Calculate container score
      container_loop:
      for (j = 0, jlen = containerMap.length; j < jlen; j += 1) {
        container = cur.containers[j];
        mapped_container = containerMap[j];

        if (mapped_container) {
          figure = content.figures[mapped_container.figureIndex];

          score += Grid.SCORING.CONTAINER_BONUS +
            (mapped_container.figureSize.minH) *
            Grid.SCORING.CONTAINER_AREA_BONUS;

          if (!figure.optional) {
            score += Grid.SCORING.REQUIRED_BLOCK_BONUS;
          }

          // Bonus for a fixed container
          if (!container.flexible) {
            score += Grid.SCORING.FIXED_CONTAINER;
          }

          filledContainerCount += 1;
        }
        else if (!container.flexible) {
          score -= Grid.SCORING.EMPTY_CONTAINER_PENALTY;
        }
      }

      // Loop through blocks to figure out text fitting
      block_loop:
      while (cur.textHeight &&
            br.index < blockCount && height <= cur.textHeight) {
        block = content.blocks[br.index];
        // Just an estimate
        blockHeightEstimate = block.metrics.outerH + block.metrics.marginTop;

        if (block.keeptogether &&
            (blockHeightEstimate > cur.maxColHeight ||
            blockHeightEstimate > remaining_height)) {
          // Can't add block, leave loop
          break block_loop;
        }

        if (blockHeightEstimate > remaining_height) {
          // Can't add the block, leave loop
          if (block.keeptogether) {
            break block_loop;
          }

          // Go to first child
          if (block.children) {
            br.index += 1;
            continue block_loop;
          }

          // Put part of the block in
          height += blockHeightEstimate;
          // TODO: Track overhang?
        }

        // Block fits, stuff it in
        height += blockHeightEstimate;
        score += blockHeightEstimate;
        remaining_height -= blockHeightEstimate;

        blockAdded = true;
        // Go to the next sibling (or pop out if there is none)
        br.index = block.nextSibling ? block.nextSibling.index : br.index + 1;
      } // block_loop

      // Check for forward progress
      if (!blockAdded) {
        if (!filledContainerCount) {
          // Avoid completely empty grids (will cause loops?)
          score = -Infinity;
        }
        else {
          // The current/next block
          block = content.blocks[br.index];

          // Is this block part of a fallback for a required figure?
          if (block && block.figure && !block.figure.optional) {
            // If so, check if we've already started displaying the fallback for this figure
            if (br.overhang || block.withinFallback) {
              debug.warn('No forward progress on required figure fallback');
              // Must make forward progress on open required figure, penalize severely
              score = -Infinity;
            }
          }
        }
      }
      else if (remaining_height > 0) {
        // Penalize for emptiness, based on percentage
        percentEmpty = remaining_height / cur.textHeight;

        // Filled containers make it hard to estimate how full the page really
        // is, so give a 20% bonus per container
        percentEmpty -= filledContainerCount * .2;

        if (percentEmpty > .5) {
          debug.info('Grid penalized for emptiness percentage: ' + percentEmpty * 100);
          score -= remaining_height;
          score -= percentEmpty * percentEmpty *
            Grid.SCORING.EMPTINESS_PENALTY;
        }
      }

      if (score > highScore) {
        highScore = score;
        best = {
          grid: cur,
          containers: containerMap
        };
      }
    } // grid_loop

    return best;
  };

  if (goog.DEBUG) {
    Grid.prototype.toString = function() {
      return "[Grid " + this.classes + "]";
    };
  }
});

// Input 27
goog.provide('treesaver.template');
goog.require('treesaver.dom');

goog.scope(function() {
  var dom = treesaver.dom;

  /**
   * @param {!Element} container
   * @param {!string} template
   * @param {!Object} view
   * @param {Object=} partials
   * @param {function(!string)=} send_fun
   */
  treesaver.template.expand = function (container, template, view, partials, send_fun) {
    container.innerHTML = Mustache.to_html(template, view, partials, send_fun);

    dom.querySelectorAll('img[data-src], iframe[data-src], video[data-src]', container).forEach(function(e) {
      e.setAttribute('src', e.getAttribute('data-src'));
    });
    dom.querySelectorAll('a[data-href]', container).forEach(function(e) {
      e.setAttribute('href', e.getAttribute('data-href'));
    });
  };
});

// Input 28
/**
 * @fileoverview Helper functions for scrolling elements.
 */

goog.provide('treesaver.ui.Scrollable');

goog.require('treesaver.capabilities');
goog.require('treesaver.dom');

goog.scope(function() {
  var Scrollable = treesaver.ui.Scrollable,
      capabilities = treesaver.capabilities,
      dom = treesaver.dom;

  /**
   * Can this scroller scroll horizontally?
   * @param {!Element} el
   * @return {boolean}
   */
  Scrollable.canScrollHorizontally = function(el) {
    return el.scrollWidth !== el.clientWidth;
  };

  /**
   * Set the scroll offset
   *
   * @param {!Element} el
   * @param {number} x
   * @param {number} y
   * @return {boolean} true if scrolling happened.
   */
  Scrollable.setOffset = function(el, x, y) {
    var left = el.scrollLeft,
        top = el.scrollTop;

    el.scrollLeft += x;
    el.scrollTop += y;

    // Check if values changed
    return el.scrollLeft !== left || el.scrollTop !== top;
  };

  /**
   * Initialize the DOM for a scrollable element, creating the necessary
   * structures for later scrolling
   *
   * @param {!Element} el
   */
  Scrollable.initDom = function(el) {
    if (WITHIN_IOS_WRAPPER || capabilities.SUPPORTS_TOUCH) {
      // Need dummy handler in order to get bubbled events
      el.setAttribute('onclick', 'void(0)');
    }

    // TODO: Ensure that overflow is set correctly?
  };

  /**
   * Look for scrollable elements within a DOM tree and initialize
   *
   * @param {!Element} root
   */
  Scrollable.initDomTree = function(root) {
    var els = dom.querySelectorAll('.scroll', root);

    // Root element can be scrollable as well
    if (dom.hasClass(root, 'scroll')) {
      els.unshift(root);
    }

    // Initialize all
    els.forEach(Scrollable.initDom);
  };
});

// Input 29
goog.provide('treesaver.layout.Page');

goog.require('treesaver.capabilities');
goog.require('treesaver.debug');
goog.require('treesaver.dimensions');
goog.require('treesaver.dom');
goog.require('treesaver.template');
goog.require('treesaver.layout.Grid');
goog.require('treesaver.ui.Scrollable');

goog.scope(function() {
  var capabilities = treesaver.capabilities,
      debug = treesaver.debug,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom,
      Grid = treesaver.layout.Grid;

  /**
   * Page class
   * @constructor
   * @param {!treesaver.layout.Content} content
   * @param {!Array.<treesaver.layout.Grid>} grids
   * @param {!treesaver.layout.BreakRecord} br The current breakRecord.
   *  @param {!Array.<string>} extra_classes Extra classes to apply.
   */
  treesaver.layout.Page = function(content, grids, br, extra_classes) {
    var best = Grid.best(content, grids, br),
        host = document.createElement('div'),
        originalBr = br.clone(),
        containerFilled = false;

    if (!best || !best.grid) {
      // Might have leftover figures that just won't fit
      br.finished = br.atEnd(content) ||
      br.figureIndex === content.figures.length;

      if (br.finished) {
        debug.info('Finished article in face of error.');
        this.ignore = true;
      }
      else {
        debug.error('No best grid found: ' + arguments);
        this.error = true;
      }

      return;
    }

    // Store state
    this.size = best.grid.stretchedSize.clone();
    this.begin = br.getPosition();

    // Create our host for measuring and producing HTML
    dom.addClass(host, 'offscreen');
    // TODO: Only add to body if needed?
    // TODO: Perhaps not, since IE has innerHTML issues when disconnected
    document.body.appendChild(host);
    host.innerHTML = best.grid.html;
    host.firstChild.className += ' ' + extra_classes.join(' ');
    this.node = /** @type {!Element} */ (host.firstChild);

    // Manually set dimensions on the page
    dimensions.setCssPx(this.node, 'width', this.size.w);
    dimensions.setCssPx(this.node, 'height', this.size.h);

    dom.querySelectorAll(
      '[' + dom.customAttributePrefix + 'template=document]',
      this.node
    ).forEach(function(el) {
      treesaver.template.expand(el, el.innerHTML, content.doc.meta);
    });

    // Containers
    dom.querySelectorAll('.container', this.node).forEach(function(containerNode, i) {
      var mapping = best.containers[i],
          figure, figureIndex, success;

      if (mapping) {
        figureIndex = mapping.figureIndex;
        figure = /** @type {!treesaver.layout.Figure} */ (content.figures[figureIndex]);
        success = treesaver.layout.Page.fillContainer(containerNode, figure, mapping,
          content.lineHeight);

        // Account for the figure we used
        if (success) {
          br.useFigure(figureIndex);
          containerFilled = true;

          // Need to store some extra data when supporting zoom
          if (figure.zoomable) {
            dom.addClass(containerNode, 'zoomable');
            containerNode.setAttribute('data-figureindex', figureIndex);
            if (capabilities.IS_NATIVE_APP || capabilities.SUPPORTS_TOUCH) {
              // Need dummy handler in order to get bubbled events
              containerNode.setAttribute('onclick', 'void(0)');
            }
          }

          // Size to the container
          if (i === 0 && best.grid.scoringFlags['sizetocontainer']) {
            this.size.h = dimensions.getOffsetHeight(containerNode) +
              best.grid.containers[0].delta;
            this.size.outerH = this.size.h + this.size.bpHeight;
            dimensions.setCssPx(/** @type {!Element} */ (this.node), 'height', this.size.h);
          }
        }
        else {
          debug.info('Container failure, figureIndex: ' + figureIndex);

          // TODO: Note more info about failure? E.g. target size and actual size, etc
          if (!figure.optional && figure.fallback) {
            // Required figures with fallbacks must be preserved, delay instead of
            // failing
            // TODO: How to make sure we don't continually re-try the delayed figure?
            br.delayFigure(figure.figureIndex);
          }
          else {
            // Don't mark the figure as failed if the container was reduced in size
            if (!dom.hasClass(containerNode, 'flexed')) {
              br.failedFigure(figureIndex);
            }
          }

          // Remove node for easier styling
          containerNode.parentNode.removeChild(containerNode);
        }
      }
      else {
        // No node, remove
        containerNode.parentNode.removeChild(containerNode);
      }
    }, this);

    // Columns
    dom.querySelectorAll('.column', this.node).forEach(function(colNode, i) {
      var col = best.grid.cols[i];
      treesaver.layout.Page.fillColumn(content, br, colNode,
        best.grid.maxColHeight, col.minH);
    });

    // Check if there was forward progress made
    if (originalBr.equals(br)) {
      debug.error('No progress made in pagination: ' + arguments + best);
      this.error = true;
    }
    else if (!containerFilled && best.grid.scoringFlags['sizetocontainer']) {
      debug.warn('sizetocontainer not filled, page ignored');
      // Couldn't fill the container, ignore this page
      this.ignore = true;
    }
    else {
      // Centers the page vertically & horizontally with less work for us
      dimensions.setCssPx(this.node, 'marginTop', -this.size.outerH / 2);
      dimensions.setCssPx(this.node, 'marginLeft', -this.size.outerW / 2);

      // Are we finished?
      br.finished = best.grid.scoringFlags['onlypage'] || br.atEnd(content);

      // Add last page flag if complete
      if (br.finished) {
        dom.addClass(this.node, 'last-page');
      }

      this.html = host.innerHTML;
      this.end = br.getPosition();

      // Increment page number
      br.pageNumber += 1;
    }

    // Cleanup
    this.deactivate();
    document.body.removeChild(host);
  };
});

goog.scope(function() {
  var Page = treesaver.layout.Page,
      debug = treesaver.debug,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom,
      Scrollable = treesaver.ui.Scrollable;

  /**
   * @type {boolean}
   */
  Page.prototype.ignore;

  /**
   * @type {!treesaver.dimensions.Metrics}
   */
  Page.prototype.size;

  /**
   * @type {!treesaver.layout.ContentPosition}
   */
  Page.prototype.begin;

  /**
   * @type {?Element}
   */
  Page.prototype.node;

  /**
   * @type {string}
   */
  Page.prototype.html;

  /**
   * @type {!treesaver.layout.ContentPosition}
   */
  Page.prototype.end;

  /**
   * @type {boolean}
   */
  Page.prototype.active;

  /**
   * @param {!Element} container
   * @param {!treesaver.layout.Figure} figure
   * @param {!treesaver.layout.Grid.ContainerMap} map
   * @param {?number} lineHeight
   * @return {boolean} True if the figure fit within the container.
   */
  Page.fillContainer = function(container, figure, map,
      lineHeight) {
    var size, figureSize,
        containerHeight, sibling,
        metrics,
        maxContainerHeight,
        anchoredTop = true;

    size = map.size;
    figureSize = map.figureSize;

    if (goog.DEBUG) {
      if (!size) {
        debug.error('Empty size!');
      }

      if (!figureSize) {
        debug.error('Empty figureSize!');
      }
    }

    maxContainerHeight = dimensions.getOffsetHeight(container);

    // Do any content switching that needs to happen
    figureSize.applySize(container, size);

    // If the container is fixed, then we are done no matter what
    if (!map.flexible) {
      return true;
    }

    // Adjust flexible containers

    // Unhinge from a side before measuring
    if (dom.hasClass(container, 'bottom')) {
      anchoredTop = false;
      container.style.top = 'auto';
    }
    else {
      container.style.bottom = 'auto';
    }

    // TODO: Query only needed properties
    metrics = new dimensions.Metrics(container);
    containerHeight = metrics.outerH;

    // Did not fit :(
    // TODO: Use something better than parent height
    if (containerHeight > maxContainerHeight) {
      // Make an exception for scrollable figures
      if (figure.scrollable) {
        // Occupy the entire space, and let the excess scroll
        containerHeight = maxContainerHeight;

        // Fix the height (prevents overflow in case of mis-measuring)
        dimensions.setCssPx(container, 'height', containerHeight - metrics.bpHeight);
      }
      else {
        // Not scrollable, can't be displayed
        debug.info('Container failure: ' + containerHeight + ':' + maxContainerHeight);

        if (goog.DEBUG) {
          container.setAttribute('data-containerHeight', containerHeight);
          container.setAttribute('data-maxHeight', maxContainerHeight);
          container.setAttribute('data-attemptedSize', size);
        }

        // Revert after failure
        figureSize.revertSize(container, size);

        // TODO: Return style.bottom & style.top to originals?

        return false;
      }
    }
    else {
      // Round to nearest for column adjustment to maintain grid
      if (lineHeight && containerHeight % lineHeight) {
        containerHeight = dimensions.roundUp(containerHeight, lineHeight);
      }
    }

    if (figure.scrollable) {
      // Make the container scroll
      dom.addClass(container, 'scroll');
      Scrollable.initDom(container);
    }

    // Go through this containers siblings, adjusting their sizes
    sibling = container;
    while ((sibling = sibling.nextSibling)) {
      if (sibling.nodeType !== 1) {
        // Ignore non-elements
        continue;
      }

      // Cast for compiler
      sibling = /** @type {!Element} */ (sibling);

      // Don't touch fixed items
      if (dom.hasClass(sibling, 'fixed')) {
        continue;
      }

      if (dom.hasClass(sibling, 'column') ||
          dom.hasClass(sibling, 'container') ||
          dom.hasClass(sibling, 'group')) {
        // Add a flag for debugging / later detection
        dom.addClass(sibling, 'flexed');

        // Make sure we don't go negative
        if (dimensions.getOffsetHeight(sibling) <= containerHeight) {
          debug.info('Sibling shrunk to zero height: ' + sibling);
          // TODO: Remove from tree?
          dimensions.setCssPx(sibling, 'height', 0);
        }
        else {
          // Since items are always absolutely positioned, we can
          // adjust the position of the column directly based on it's
          // offsets
          if (anchoredTop) {
            dimensions.setCssPx(sibling, 'top',
              dimensions.getOffsetTop(sibling) + containerHeight);
          }
          else {
            // Compute the current 'bottom' value by using the parent's offsetHeight
            dimensions.setCssPx(sibling, 'bottom',
              dimensions.getOffsetHeight(sibling.offsetParent) -
              (dimensions.getOffsetTop(sibling) + dimensions.getOffsetHeight(sibling)) + containerHeight);
          }
        }
      }
    }

    return true;
  };

  /**
   * @param {!treesaver.layout.Content} content
   * @param {!treesaver.layout.BreakRecord} br
   * @param {!Element} node
   * @param {number} maxColHeight
   * @param {number} minH Minimum height of the column.
   */
  Page.fillColumn = function(content, br, node, maxColHeight, minH) {
    var colHeight = dimensions.getOffsetHeight(node),
        height = 0,
        remainingHeight,
        firstBlock,
        isFirstBlock = true,
        initMarginTop = 0,
        marginAndFirstLine = 0,
        marginTop = 0,
        marginBottom = 0,
        blockStrings = [],
        blockCount = content.blocks.length,
        block = content.blocks[br.index],
        nextSibling,
        nextNonChild,
        nextNotUsed,
        parent, closeTags = [],
        effectiveBlockHeight,
        finishColumn = false,
        // Dumb heuristic for indicating whether this is a "short" column
        // TODO: Any special logic with flexed columns?
        shortColumn = (maxColHeight / colHeight) > 1.5;

    // Is there any content left?
    if (!block) {
      // TODO: Remove column element altogether?
      return;
    }

    // TODO: Is this right?
    // Make sure colHeight is on our verticl grid
    if (colHeight % content.lineHeight) {
      colHeight -= colHeight % content.lineHeight;
    }

    // Can we fit any content within this column?
    if (!colHeight || colHeight < minH) {
      debug.info('Column below minHeight: ' + block + ':' + colHeight);

      // No height, we are done here
      // TODO: Remove column element altogether?
      return;
    }

    // Open HTML from tag stack
    if (block.parent) {
      blockStrings.push(block.openAllTags(true));
    }

    // Calculate the margin we'll use in the first block of this column
    // If there's an overhang, we use a negative margin to deduct the part
    // of the block that was shown in the previous column (or page)
    // If there's no overhang, then we use zero margin due to collapsing rules
    initMarginTop = br.overhang ? block.metrics.outerH - br.overhang : 0;

    // This is by far the most complex portion of the code here, so be very
    // careful when altering it.
    //
    // The concept is very simple, we place as many blocks as we can fit into
    // this column, then exit.
    //
    // However, things get complex, because there are many scenarios in which
    // a block may or may not fit
    block_loop:
    while (br.index < blockCount && height < colHeight) {
      block = content.blocks[br.index];
      nextSibling = block.nextSibling;
      nextNonChild = nextSibling || block.getNextNonChildBlock();
      nextNotUsed = nextSibling && Page.nextNotUsedBlock(content, br, nextSibling, blockCount);

      // First, we must check if this block is a figure's fallback content.
      // If so, then we must see if the figure has been used
      // Note: A fallback block could have overhang from previous column,
      // so must check for that as well
      if (block.isFallback && br.figureUsed(block.figure.figureIndex) &&
          !(isFirstBlock && br.overhang)) {
        // The figure has been used, so we can't use this block at all
        //
        // If the block was the last element in it's nesting level, then we need
        // to close the parent block
        // TODO: Back it out completely
        if (block.parent && !block.nextSibling) {
          // TODO: Close out tags by looping up parents
          debug.error('Must close out parent tags on unused fallback!');
        }

        // Go to the next block, skipping any children of this block
        br.index = nextNonChild ? nextNonChild.index : blockCount;
        // Move on to the next block
        continue block_loop;
      }


      parent = block.parent;
      remainingHeight = colHeight - height;

      // Calculate some of the metrics we'll be using for this block. These vary
      // depending on where we are in the column and content.
      //
      // Check for an existing marginTop, which is a sign that we already opened
      // a tag
      if (isFirstBlock && !marginTop) {
        // The first block will need to account for any overhang, and
        // never has any top margin due to collapsing rules (all calculated
        // outside the block_loop)
        marginTop = -initMarginTop;
        // If we're overflowed, then we're already mid-way through the content
        // and the "first line" is really the "next line" -- which we know via
        // lineHeight. Otherwise, use the pre-computed firstLine property
        marginAndFirstLine = br.overflow ?
          block.metrics.lineHeight : block.firstLine;
      }
      else {
        // Collapse with previous margin
        marginTop = Math.max(marginTop, block.metrics.marginTop);
        marginAndFirstLine = marginTop + block.firstLine;
      }

      // Collapse the bottom margin with our next sibling, if there is one
      // TODO: What if this is the last child of a block?
      marginBottom = Math.max(block.metrics.marginBottom,
          nextNotUsed ? nextNotUsed.metrics.marginTop : 0);

      // The amount of space our block will take up in this column if inserted
      // Height plus whatever our margin ended up being
      //
      // TODO: What if this contains a fallback? We don't actually know how
      // tall it will be :(
      effectiveBlockHeight = block.metrics.outerH + marginTop;

      // Do a quick check and see if we can fit the first line of content in the
      // current block, if we can't (and shouldn't), then we'll exit the loop
      // early
      finishColumn = remainingHeight < marginAndFirstLine;

      // We may be able to fit the first line of the current block, but now we
      // need to check for a keepwithnext with next restriction.
      //
      // Note that keepwithnext is ignored if there is no next sibling, or if the
      // block was already broken (has overhang) -- or if this is the isFirstBlock
      // in a non-short column
      if (!finishColumn && block.keepwithnext && nextNotUsed &&
          !(br.overhang || (isFirstBlock && !shortColumn))) {
        // Keepwithnext means that we must attempt to keep this block in the same
        // column/page as it's next sibling. However, the current block can still
        // break into the next column in order to do so
        //
        // Scenarios:
        //   1) Current and next block's first line fit (all good!)
        //   2) Current only fits partially, which means that it'll likely share
        //      the next column with it's sibling, thus fufilling the requirement
        //   3) Current fits completely, but the first line of the next block 
        //      doesnt -- need to delay current (but only if this isn't a virgin
        //      column) [which we check for later]
        //
        // We are testing solely for scenario 3 here, since we're trying to figure
        // out if we need to end the column early
        finishColumn = (remainingHeight >= effectiveBlockHeight) &&
          (remainingHeight <
            (effectiveBlockHeight + marginBottom + nextNotUsed.firstLine));

        if (finishColumn) {
          debug.info('Leaving column due to keepwithnext');
        }
      }

      if (finishColumn) {
        // We know that we can't cleanly fit the current block into the column
        // We have no guarantee that the block would fit in the next column,
        // so only break the current column if it's not brand new or happens to be
        // abnormally short (likely due to stretching from a figure)
        //
        // TODO: What if the next column is even shorter? Not very easy to tell
        // since the next column could be on the next page, etc.
        finishColumn = !isFirstBlock || shortColumn;

        if (finishColumn) {
          if (shortColumn) {
            debug.info('Leaving column empty due to being short');
          }
          else if (!isFirstBlock) {
            debug.info('Ending column early due to non-fit');
          }
        }
        else {
          debug.info('Staying in virgin column despite non-fit');
        }
      }

      if (finishColumn) {
        // One final special case is due to fallback elements, which are a real
        // pain in the ass, since we don't know if we can account for them or not
        //
        // Instead of trying to do any fancy logic, we just punt on the entire
        // issue and take the slow route, skipping any early termination of the
        // column when we have a fallback
        finishColumn = !block.containsFallback;
      }

      if (block.columnBreak && !isFirstBlock) {
        // If it's marked as column break, obey the command
        // No matter what, this includes fallbacks
        // TODO: Any issues with this?
        finishColumn = true;
      }

      if (finishColumn) {
        // We cannot fit the current block into the column, need to exit early
        //
        // Check and see if we need to close out any open element tags.
        if (parent) {
          // Now there's at least one unclosed tag sitting on the stack
          //
          // We need to go up the parent chain and either:
          //   1) Close the tag if there are other elements at that nesting level
          //   2) Remove the tag completely so we don't have an empty tag
          //
          // Due to firstLine detection, #2 should be somewhat rare, but it can
          // happen in cases where firstLine is more complicated (keepwithnext,
          // or with fallbacks)
          //
          // We know that an element is the first child of it's parent if their
          // indices are off by one.
          while (parent && parent.index === block.index - 1) {
            debug.info('Backing out opened tag: ' + parent.openTag);

            // The current tag level has no children, let's remove the string from
            // our stack, and adjust the break record
            blockStrings.pop();
            // TODO: Is there any risk with backing up into the br like this?
            br.index = parent.index;
            // TODO: Is there any reason we should try to update the height here?

            // Check if the parent block was a fallback
            if (parent.isFallback) { // TODO: Remove bool and check parent.fig?
              // We had previously marked the corresponding figure as used, we
              // un-use it by just adding it to the delayed blocks
              //
              // TODO: What if it was failed? We'll be placing it in the
              // wrong array
              br.delayFigure(parent.figure.figureIndex);
            }

            // Move up one level
            block = parent;
            parent = block.parent;
          }

          // If we exited the loop with an active parent, that means we still have
          // some open tags on the stack, close them out now
          if (parent) {
            blockStrings.push(block.closeAllTags());
          }
        }

        // Finish the loop and bust out of this podunk column
        break block_loop;
      }

      // We've made it this far, which means we're definitely going to insert
      // some content into the current column.

      // If we're going to use a fallback, mark the figure as used now so we don't
      // get duplicate content displayed to the user
      if (block.isFallback) {
        br.useFigure(block.figure.figureIndex);
      }

      // Scenarios:
      //   1) Contains a fallback, meaning we don't know it's true height
      //      Must open tag and recurse no matter what
      //   2) Has child blocks, but won't fit completely: Open tag and continue
      //   3) Current block fits completely: Insert and continue
      //   4) Doesn't fit, no children: Insert and overflow
      //
      // Tackle 1 & 2 first, which involve opening up the current parent element
      if (block.containsFallback ||
          (block.blocks.length && remainingHeight < effectiveBlockHeight)) {
        // Should never have an overhang when opening a parent
        if (br.overhang) {
          debug.error('Overhang present when opening a parent block');
        }

        // Note: we are accumulating top margin, so we only add the margin in
        // when we finally insert a block, or when the margin collapsing is broken
        // by Border & Padding
        if (block.metrics.bpTop) {
          // Add the accumulated top margin, and then reset the margin since we're
          // using it up
          height += isFirstBlock ? 0 : marginTop;
          marginTop = 0;

          // Now include the BP itself
          height += block.metrics.bpTop;

          // Note that we shouldn't manually set the isFirstBlock flag here,
          // since we might get stuck as the system keeps on trying to make
          // space by breaking into a new column
        }
        else {
          // No BP = Margin keeps on collapsing
          //
          // Since this is an open tag, it means we don't worry about marginBottom
        }

        // Open the tag
        // Note: There is no need to use the _zero version here, because
        // initMarginTop takes care of the top margin setting. Also, we don't
        // want to zero out BP here
        blockStrings.push(block.openTag);

        // Move to the first child (which is always the next index)
        br.index += 1;

        // Start our loop again
        continue block_loop;
      }

      // Now we're left with:
      //   1) Insert & continue
      //   2) Insert & overflow

      // No matter what, we're inserting the block at this point
      height += effectiveBlockHeight;
      blockStrings.push(block.html);
      // Reset our flags
      isFirstBlock = false;
      firstBlock = firstBlock || block;
      br.overhang = 0;

      // Now check whether the content fits completely, with potential space
      // for the next block (let ties be processed a different fashion, since
      // we'll close out the column that way)
      if (colHeight > height + marginBottom) {
        // The full content portion of this block fits, which means we can
        // advance the breakRecord to the next block
        br.index = nextNonChild ? nextNonChild.index : blockCount;

        // Things get a little more complex now due to nesting and margin
        // collapsing.
        //
        // We need to do the following:
        //   - Close any parent elements that have been finished
        //   - Add any bottom margin / BP
        //   - Properly track margin collapsing

        if (!nextSibling && parent) {
          closeTags = [];
          do {
            // We are the final sibling in a parent container, so let's close
            // out that tag
            closeTags.push(parent.closeTag);
            // Need to figure out margin collapsing.
            // Bottom margin continues to accumulate as long as the parent doesn't
            // have a bpBottom
            if (parent.metrics.bpBottom) {
              // Collapsing is broken so add the accumulated bottom margin and BP
              height += marginBottom + parent.metrics.bpBottom;
              // Start a new margin accumulation
              marginBottom = parent.metrics.marginBottom;
            }
            else {
              // Margin collapsing not broken, accumulate
              marginBottom = Math.max(marginBottom, parent.metrics.marginBottom);
            }
          } while (!parent.nextSibling && ((parent = parent.parent)));

          // Check and see if we're now going to overflow due to excess BP
          if (colHeight > height + marginBottom) {
            // Still have more room to fit content in this column, do our partial
            // closing of tags
            blockStrings.push(closeTags.join(''));
          }
          else {
            // Close out remaining tags.
            if (parent) {
              blockStrings.push(block.closeAllTags());
            }

            // We don't want to try to calculate overhang, since all the overhang
            // is due to closing BP and bottom margins, so just set the colHeight
            // manually to bypass (clipping any excess)
            height = colHeight;

            // Get out off the loop
            break block_loop;
          }
        }

        // Propagate bottom margin (gets collapsed w/ top margin in next loop)
        marginTop = marginBottom;

        // Loop again
        continue block_loop;
      }

      // The content does not fit, we are done with this column and going to
      // overflow. Clean up before we leave

      // Close out any open parent tags
      if (parent) {
        blockStrings.push(block.closeAllTags());
      }

      // We make a special case for unbreakable elements (replaced elements like
      // img, canvas, etc). We don't want to even try to split this across a
      // column or page, so we just shove it in and let it clip
      if (!block.breakable) {
        // Just make the height the full height of the column, since this
        // will bypass any overflow calculation (and realistically look
        // the best by keeping to vertical grid). The excess clips
        height = colHeight;

        // Advance the breakRecord, so we don't repeat the block
        br.index = nextNonChild ? nextNonChild.index : blockCount;

        debug.warn('Unbreakable element shoved into column');
      }
      else {
        // Make sure we don't process as if we have overhang, because
        // we don't (probably got here by having a large margin that
        // extends past the end of the column)
        if (height <= colHeight) {
          br.index = nextNonChild ? nextNonChild.index : blockCount;

          // Make sure we don't try to do overhang
          height = colHeight;
        }

        if (block.keeptogether) {
          debug.warn('keeptogether element shoved into column');
        }

        // Do not advance the break record, since we need to stay on this
        // block for overflow into the next column
      }

      // We are finished with this loop. Calculate overflow on the outside
      break block_loop;
    } // block_loop

    // Do overhang calculation
    colHeight = Page.computeOverhang(br, block, colHeight, height);

    // In DEBUG, sprinkle the dom with hints
    if (goog.DEBUG) {
      node.setAttribute('data-overhang', br.overhang);
      node.setAttribute('data-contentHeight', height);
      if (firstBlock) {
        node.setAttribute('data-firstBlock', firstBlock.index);
      }
      if (block) {
        node.setAttribute('data-lastBlock', block.index);
      }
    }

    // Do a tight fix on the column height
    dimensions.setCssPx(node, 'height', colHeight);

    // Join string array and insert into column node
    node.innerHTML = blockStrings.join("");

    // Apply overhang to the first block
    if (firstBlock && node.firstChild) {
      node.firstChild.style.marginTop = -initMarginTop + 'px';

      if (firstBlock.parent && !initMarginTop) {
        // Check if we need to zero-out margins on the children
        parent = firstBlock.parent;
        while (parent) {
          if (parent.metrics.bpTop) {
            // Has bpTop, so margins don't collapse
            firstBlock = parent;
          }
          parent = parent.parent;
        }

        // TODO: Really think about this code, it's weird

        // Have to traverse in
        if (parent !== firstBlock) {
          parent = firstBlock.parent;
          block = node.firstChild;

          while (parent) {
            block = block.firstChild;
            parent = parent.parent;
            if (block) {
              block.style.marginTop = 0;
            }
            else {
              debug.error('No block on bad code');
            }
          }
        }
      }
      else if (firstBlock.blocks.length && !initMarginTop) {
        block = node.firstChild;
        while (firstBlock) {
          if (firstBlock.blocks.length && block.firstChild) {
            firstBlock = firstBlock.blocks[0];
            block = block.firstChild;
            block.style.marginTop = 0;
          }
          else {
            firstBlock = null;
          }
        }
      }
    }
    else {
      debug.warn('Clearing column contents since no block was added');

      // Clear out column contents, since no block was added
      dom.clearChildren(node);
    }
  };

  /**
   * @param {!treesaver.layout.Content} content
   * @param {!treesaver.layout.BreakRecord} br
   * @param {!treesaver.layout.Block} nextBlock
   * @param {number} blockCount
   */
  Page.nextNotUsedBlock = function(content, br, nextBlock, blockCount) {
    var index,
        block;
    for (index = nextBlock.index; index < blockCount; index++) {
      block = content.blocks[index];
      if (!block.isFallback || !br.figureUsed(block.figure.figureIndex)) {
        return block;
      }
    }
    return null;
  };

  /**
   * Compute overhang
   * @param {!treesaver.layout.BreakRecord} br The lastBlock inserted into the column
   * @param {!treesaver.layout.Block} lastBlock The lastBlock inserted into the column
   * @param {number} colHeight
   * @param {number} height
   * @return {number} The final column height required for this
   */
  Page.computeOverhang = function(br, lastBlock, colHeight, height) {
    var contentOnlyOverhang,
        excess;

    if (colHeight >= height || !lastBlock) {
      br.overhang = 0;
      return colHeight;
    }

    // Some sanity checks
    if (!lastBlock.breakable) {
      // Should never get to this point
      debug.error('Overhang on unbreakable element');
    }
    if (lastBlock.blocks.length) {
      // Should never get to this point
      debug.error('Overhang on element with children');
    }

    // We have some content peaking out from the bottom of the
    // column. Our job now is to find where we can clip this content
    // without creating any visual artifacts
    br.overhang = height - colHeight;

    // Calculate the portion of the block's content that is sticking
    // outside of the column
    contentOnlyOverhang = br.overhang - lastBlock.metrics.bpBottom;

    // What if no actual content is sticking out and it's all border & padding?
    if (contentOnlyOverhang <= 0) {
      br.overhang = 0;
      // Advance to the next block, since there's no content overhanging
      br.index = lastBlock.index + 1;
      // Note: Don't blindly increment br.index, since you'll never know
      // if it was accidently incremented or via loop triggering
    }
    else {
      // Calculate where the line boundaries occur, and figure out if
      // it's in sync with the clip point.
      // Then check to make sure that's a multiple of line height
      excess = (lastBlock.metrics.h - contentOnlyOverhang) %
              lastBlock.metrics.lineHeight;

      // NOTE: Excess can be larger than the entire block in cases
      // where there is a large top border/padding, make sure to Max w/ 0
      if (excess) {
        // Excess is currently the fraction of a line that is sticking
        // out of the column, not fitting completely

        // The portion of the block in the column is out of sync
        // reduce the column height in order to clip the partial line
        colHeight -= excess;

        // Adjust the overhang as well so we flow correctly in the next col
        br.overhang += excess;
      }
    }

    return colHeight;
  };

  /**
   * Initialize page as necessary before displaying
   * @return {Element}
   */
  Page.prototype.activate = function() {
    // Run only once
    if (this.active) {
      return this.node;
    }

    // Re-hydrate the HTML
    this.node = dom.createElementFromHTML(this.html);

    // Flag
    this.active = true;

    return this.node;
  };

  /**
   * Deactivate page
   */
  Page.prototype.deactivate = function() {
    this.active = false;

    // Remove hw-accelerated transition properties
    dimensions.clearOffset(/** @type {!Element} */ (this.node));

    // Dispose images properly to avoid memory leaks
    dom.querySelectorAll('img', this.node).
      forEach(dom.disposeImg);

    // Lose page reference
    this.node = null;
  };

  /**
   * Clone this page.
   * @return {!treesaver.layout.Page} A clone of this page
   */
  Page.prototype.clone = function() {
    var p = Object.clone(this);
    // We override the properties that are different by creating a clone
    // and setting those properties explicitly.
    p.node = /** @type {!Element} */ (this.node && this.node.cloneNode(true) || null);
    p.active = this.active;
    return /** @type {!treesaver.layout.Page} */ (p);
  };

  if (goog.DEBUG) {
    Page.prototype.toString = function() {
      return "[Page]";
    };
  }
});

// Input 30
/**
 * @fileoverview Article class.
 */

goog.provide('treesaver.ui.Article');

goog.require('treesaver.array');
goog.require('treesaver.debug');
goog.require('treesaver.dimensions');
goog.require('treesaver.dom');
goog.require('treesaver.events');
goog.require('treesaver.layout.BreakRecord');
goog.require('treesaver.layout.Content');
goog.require('treesaver.layout.ContentPosition');
goog.require('treesaver.layout.Grid');
goog.require('treesaver.layout.Page');
goog.require('treesaver.scheduler');

goog.scope(function() {
  /**
   * A chunk of content
   *
   * @constructor
   * @param {!Array.<treesaver.layout.Grid>} grids
   * @param {?Element} node
   */
  treesaver.ui.Article = function(grids, node, doc) {
    this.pages = [];
    this.eligible_grids = [];
    this.grids = grids;
    this.doc = doc;

    // Automatically process the HTML, if any was given to us
    if (node) {
      this.processHTML(node);
    }
  };
});

goog.scope(function() {
  var Article = treesaver.ui.Article,
      array = treesaver.array,
      debug = treesaver.debug,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom,
      events = treesaver.events,
      scheduler = treesaver.scheduler,
      BreakRecord = treesaver.layout.BreakRecord,
      Content = treesaver.layout.Content,
      ContentPosition = treesaver.layout.ContentPosition,
      Grid = treesaver.layout.Grid,
      Page = treesaver.layout.Page;

  /**
   * @type {?string}
   */
  Article.prototype.theme;

  /**
   * @type {treesaver.layout.Content} The content of this article
   */
  Article.prototype.content;

  /**
   * @type {treesaver.layout.BreakRecord}
   */
  Article.prototype.br;

  /**
   * @type {number}
   */
  Article.prototype.pageCount;

  /**
   * @type {Array.<treesaver.layout.Page>}
   */
  Article.prototype.pages;

  /**
   * @type {boolean}
   */
  Article.prototype.paginationClean;

  /**
   * @type {boolean}
   */
  Article.prototype.paginationComplete;

  /**
   * @type {boolean}
   */
  Article.prototype.loaded;

  /**
   * @type {boolean}
   */
  Article.prototype.loading;

  /**
   * @type {boolean}
   */
  Article.prototype.loadFailed;

  /**
   * @type {boolean}
   */
  Article.prototype.error;

  /**
   * @type {?{ w: number, h: number }} size
   */
  Article.prototype.maxPageSize;

  /**
   * Constraint ...
   * @type {?treesaver.dimensions.SizeRange}
   */
  Article.prototype.constraint;

  /**
   * @type {!Array.<treesaver.layout.Grid>}
   */
  Article.prototype.eligible_grids;

  /**
   * @type {Array.<treesaver.layout.Grid>}
   */
  Article.prototype.grids;

  /**
   * Reference to the parent document.
   * @type {!treesaver.ui.Document}
   */
  Article.prototype.doc;

  /**
   * Names of events fired by this class
   * @type {Object.<string, string>}
   */
  Article.events = {
    PAGINATIONERROR: 'treesaver.paginationerror',
    PAGINATIONPROGRESS: 'treesaver.paginationprogress'
  };

  /**
   * @param {?Element} article_node  The article node containing the content for this article.
   */
  Article.prototype.processHTML = function(article_node) {
    if (article_node.nodeName !== 'ARTICLE') {
      debug.error('Could not find article content: ' + article_node.innerHTML);

      this.error = true;

      return false;
    }

    // Content is here, so we're loaded
    this.loaded = true;

    // Container used for manipulation and finding things
    var fake_grid = document.createElement('div'),
        fake_column = document.createElement('div');

    // Set up a temporary container for layout
    fake_grid.style.display = 'none';
    dom.addClass(fake_grid, 'offscreen grid');
    dom.addClass(fake_column, 'column');

    // Remove any ID so CSS styles don't affect the elements within
    article_node.removeAttribute('id');

    // Clear the container so node can be the only thing in it
    dom.clearChildren(fake_grid);

    // Set up theme flag, if it exists
    // TODO: Remove compatibility data-grids parameter
    this.theme = article_node.getAttribute('data-theme') ||
      article_node.getAttribute('data-grids') || null;
    if (this.theme) {
      dom.addClass(fake_grid, this.theme);
      dom.addClass(fake_column, this.theme);

      // New theme means grids need to be filtered again
      this.setGrids(this.grids);
    }
    this.extra_classes = dom.classes(article_node);

    // Move the content from the article to the column
    while (article_node.firstChild) {
      fake_column.appendChild(article_node.firstChild);
    }
    fake_grid.appendChild(fake_column);

    // Re-enable visibility, so the browser can measure layout
    fake_column.style.display = 'block';
    fake_grid.style.display = 'block';
    // Container needs to be in tree for measuring
    document.body.appendChild(fake_grid);

    // Construct
    this.content = new Content(fake_column, this.doc);

    // Clean up the DOM
    document.body.removeChild(fake_grid);
    fake_grid.removeChild(fake_column);
    dom.clearChildren(fake_column);

    // Reset pagination state
    this.resetPagination();

    return true;
  };

  /**
   * Set the grids which can be used by this article
   * Grids that don't meet theme requirements are ignored
   *
   * @param {Array.<treesaver.layout.Grid>} all_grids
   */
  Article.prototype.setGrids = function(all_grids) {
    // Filter out any grids that don't match our article classes
    if (this.theme) {
      this.grids = all_grids.filter(function(grid) {
        return grid.hasTheme(this.theme);
      }, this);
    }
    else {
      // Shallow clone the array
      this.grids = all_grids.slice(0);
    }
  };

  /**
   * Stretch the grids into appropriate heights, and filter out any grids
   * which do not fit. Return the stretched subset of grids in an array
   * @param {{ w: number, h: number }} size
   */
  Article.prototype.stretchGrids = function(size) {
    this.eligible_grids = this.grids.filter(function(grid) {
      return grid.capabilityFilter() && grid.sizeFilter(size);
    }).map(function(grid) {
      // Now stretch to the space
      return grid.stretch(size.h);
    });

    // Are there any grids?
    if (!this.eligible_grids.length) {
      debug.error('No eligible grids at ' + size.w + 'x' + size.h);
    }

    // Sort by highest text height (helps with shortcutting in scoring)
    this.eligible_grids.sort(Grid.sort);
  };

  /**
   * Set the maximum size pages in this article are allowed to be
   * @param {{ w: number, h: number }} size
   * @return {boolean} True if a re-layout will be required at this size.
   */
  Article.prototype.setMaxPageSize = function(size) {
    if (!this.maxPageSize ||
        this.maxPageSize.w !== size.w || this.maxPageSize.h !== size.h) {
      this.maxPageSize = size;

      // Check if all the pages of our content will fit at this size
      this.paginationClean =
        dimensions.inSizeRange(/** @type {!treesaver.dimensions.SizeRange} */ (this.constraint), size);
    }

    return !this.paginationClean;
  };

  /**
   * Reset all pagination data and stored pages.
   */
  Article.prototype.resetPagination = function() {
    // Stop all pagination related tasks
    scheduler.clear('paginate');

    // Clear out the old pages
    this.pages = [];
    this.pageCount = 0;

    // Filter and stretch grids to the current size
    if (this.maxPageSize) {
      this.stretchGrids(this.maxPageSize);
    }

    // Our old break record is now useless
    this.br = new BreakRecord();

    // As is the constraint
    this.constraint = null;

    // Pagination is clean (even if there are no pages right now)
    this.paginationClean = true;
    this.paginationComplete = false;
  };

  /**
   * Paginate the article asynchronously
   * @param {boolean} bg Paginate remainder of article in background.
   * @param {number} index Paginate synchronously until this index.
   * @param {?treesaver.layout.ContentPosition|number} pos Paginate synchronously until this position.
   * @private
   */
  Article.prototype.paginate = function(bg, index, pos) {
    if (goog.DEBUG) {
      if (!this.content) {
        debug.error('Tried to paginate missing content');
        return;
      }

      if (!this.maxPageSize) {
        debug.error('Tried to paginate without a page size');
        return;
      }

      if (this.paginationComplete) {
        debug.info('Needless call to paginate');
        return;
      }
    }

    // Stop any previous pagination
    // (TODO: What if this conflicts with other articles?)
    scheduler.clear('paginate');

    var page;
    index = index || 0;

    while (!this.br.finished) {
      page = new Page(
        /** @type {!treesaver.layout.Content } */ (this.content),
        this.eligible_grids,
        /** @type {!treesaver.layout.BreakRecord} */ (this.br),
        this.extra_classes
      );

      // Pagination can fail to produce a useful page
      if (page.ignore) {
        if (this.br.finished) {
          debug.info('Page ignored during pagination and article terminated');
        }
        else {
          debug.info('Page ignored during pagination');
        }

        if (this.br.finished) {
          break;
        }

        // Ignore this page and try again
        continue;
      }
      else if (page.error) {
        if (this.br.finished) {
          // Meh, I guess we're done
          break;
        }
        // Something went wrong
        this.error = true;

        // Fire pagination error for logging
        events.fireEvent(
          document,
          Article.events.PAGINATIONERROR,
          { article: this }
        );

        // Put the error page in the collection

        // For now, just set finished so people can move on with their lives
        // TODO: Force re-layout?
        this.br.finished = true;

        break;
      }

      // Page is OK, add it to our collection
      this.pages.push(page);
      this.pageCount += 1;
      // Clear the error flags
      this.error = false;

      // Update page constraint
      this.constraint =
        dimensions.mergeSizeRange(/** @type {!treesaver.dimensions.SizeRange} */ (this.constraint), page.size, true);

      if (index && this.pageCount <= index ||
          pos && ((pos === ContentPosition.END) || !pos.lessOrEqual(page.end))) {
        // Not done yet, gotta keep on going
        continue;
      }
      // Check if we can background the rest
      else if (!this.br.finished) {
        if (bg) {
          // Fire progress event, but only when async
          // TODO: Is this the right thing here?
          events.fireEvent(
            document,
            Article.events.PAGINATIONPROGRESS,
            { article: this }
          );

          // Delay rest of pagination to make sure UI thread doesn't hang
          this.paginateAsync(array.toArray(arguments));
        }

        // Break out of loop early
        return;
      }
    }

    // All done, fire completed event
    this.paginationComplete = true;
    events.fireEvent(
      document,
      Article.events.PAGINATIONPROGRESS,
      { article: this, completed: true }
    );
  };

  /**
   * Start asynchronous pagination
   * @param {Array} args Arguments array to pass to the paginate function.
   */
  Article.prototype.paginateAsync = function(args) {
    scheduler.delay(Article.prototype.paginate,
        PAGINATE_DEBOUNCE_TIME, args, 'paginate', this);
  };

  /**
   * Return a width appropriate for use in the chrome for pageWidth
   * elements
   * @return {number}
   */
  Article.prototype.getPageWidth = function() {
    if (this.constraint) {
      return this.constraint.w;
    }

    return 0;
  };

  /**
   * Return an array of pages corresponding to the pages requested.
   *
   * Pages that have been paginated and are ready are returned immediately
   * If pages are not ready, null is returned in their place
   * If the pages requested are outside the total number of pages in the
   * article, a shorter array is returned (i.e. if the first 5 pages are
   * requested, but the article only has 3 pages, then an array with 3 items
   * will be returned)
   *
   * @param {number} start  If negative, counts from end of document.
   * @param {number} count  Number of pages requested.
   * @return {Array.<treesaver.layout.Page>}
   */
  Article.prototype.getPages = function(start, count) {
    if (goog.DEBUG) {
      // Do we have our content yet?
      if (!this.loaded) {
        if (!this.loading) {
          debug.error('Tried to getPages on non-loaded article');
        }

        // Return dead pages, fire event when they are ready
        return new Array(count);
      }
    }

    // If the pages are invalid, then we're out of luck in terms of re-use
    if (!this.paginationClean) {
      // Scrap what we had before
      this.resetPagination();
    }

    var pages = [],
        max_requested = start >= 0 ? (start + count - 1) : Infinity,
        i, new_max;

    // Whatever pages we have are valid, but see if we need to get more
    if (!this.paginationComplete && max_requested > this.pages.length - 1) {
      // We are missing pages, so queue up a task to paginate the remaining
      // ones asynchronously. Client should then listen to pagination events
      // to know when to re-query for pages again
      this.paginateAsync([true, max_requested]);
    }

    if (!this.paginationComplete) {
      // No way of knowing how many total pages there will be, pad array
      // with empties
      pages.length = count;

      if (start < 0) {
        // Can't return anything sensible since we need to start at end,
        // so exit early
        return pages;
      }
    }
    else {
      // Make sure we're not trying to get more pages than we have
      count = Math.min(count, this.pageCount -
          (start >= 0 ? start : start - 1));
    }

    // Loop varies if counting backwards
    if (start < 0) {
      for (i = -start; i <= count; i += 1) {
        pages[i + start] = this.pages[this.pageCount - i];
      }
    }
    else {
      for (i = start; i < start + count; i += 1) {
        pages[i - start] = this.pages[i];
      }
    }

    return pages;
  };

  /**
   * Find the index of the page that contains the given position
   * will do asynchronous pagination in order to find out
   *
   * @param {?treesaver.layout.ContentPosition} position
   * @return {number} Index of the page with that position, -1 if it is
   *                  currently unknown because the content hasn't paginated
   *                  that far yet.
   */
  Article.prototype.getPageIndex = function(position) {
    if (!this.content) {
      // Haven't loaded yet
      return -1;
    }

    var i, len, cur;

    // Special case for first page
    if (!position || position.atBeginning()) {
      return 0;
    }

    // If the pages are invalid, then we're out of luck
    if (!this.paginationClean) {
      // Scrap what we had before
      this.resetPagination();
    }

    // We might need to paginate more
    if (!this.paginationComplete) {
      if (position === ContentPosition.END || !this.pageCount ||
          !position.lessOrEqual(this.pages[this.pageCount - 1].end)) {
        // Need to paginate up to that position
        // TODO: Postpone this
        this.paginateAsync([true, null, position]);
        return -1;
      }
    }

    // Special case for the last page request
    if (position === ContentPosition.END) {
      // If we've paginated, give the last page, otherwise we don't know
      return this.paginationComplete ? this.pageCount - 1 : -1;
    }

    // Go through each page to find where we can stop
    for (i = 0, len = this.pageCount; i < len; i += 1) {
      if (this.pages[i].end.greater(position)) {
        return i;
      }
    }

    // If pagination is complete, then we can give out the last page since
    // that's where the content certainly occurs at this point
    // However, if pagination isn't complete, then return -1 to indicate that
    // we don't know where the position occurs
    return this.paginationComplete ? this.pageCount - 1 : -1;
  };

  if (goog.DEBUG) {
    Article.prototype.toString = function() {
      return '[treesaver.ui.Article]';
    };
  }
});

// Input 31
goog.provide('treesaver.ui.ArticlePosition');

/**
 * Representation of the position of an article within a document.
 * @constructor
 * @param {!number} index The index of the article, or fallback in case anchor is specified.
 * @param {string=} anchor Identifier by which an article can be referenced. If not used, or not found, index is used.
 */
treesaver.ui.ArticlePosition = function(index, anchor) {
  this.index = index;
  this.anchor = anchor;
};

goog.scope(function() {
  var ArticlePosition = treesaver.ui.ArticlePosition;

  /** @type {number} */
  ArticlePosition.prototype.index;

  /** @type {string|undefined} */
  ArticlePosition.prototype.anchor;

  /**
   * Position at the end of a document
   *
   * @const
   * @type {!treesaver.ui.ArticlePosition}
   */
  ArticlePosition.END = new ArticlePosition(Infinity);

  /**
   * Position at the beginning of a document
   *
   * @const
   * @type {!treesaver.ui.ArticlePosition}
   */
  ArticlePosition.BEGINNING = new ArticlePosition(0);

  /**
   * Returns true if the position is at the beginning of a document.
   * @return {!boolean}
   */
  ArticlePosition.prototype.atBeginning = function() {
    return this.index === 0;
  };

  /**
   * Returns true if the position is at the end of a document.
   * @return {!boolean}
   */
  ArticlePosition.prototype.atEnding = function() {
    return this.index === Infinity;
  };

  /**
   * Returns true if this instance represents an anchor.
   * @return {!boolean}
   */
  ArticlePosition.prototype.isAnchor = function() {
    return !!this.anchor;
  };

  /**
   * Compares two article positions. Only compares the article indices, not their anchors.
   * @return {!boolean}
   */
  ArticlePosition.prototype.equals = function(other) {
    return this.index === other.index;
  };
});

// Input 32
goog.provide('treesaver.ui.TreeNode');

/**
 * TreeNode to represent a node in the (hierarchical) index. Every document inherits
 * from TreeNode, as well as the index itself.
 * @constructor
 */
treesaver.ui.TreeNode = function() {
  this.contents = [];
  this.parent = null;
};

goog.scope(function() {
  var TreeNode = treesaver.ui.TreeNode;

  /**
   * Appends a child to this node.
   * @param {!treesaver.ui.TreeNode} child
   * @return {!treesaver.ui.TreeNode} The added child.
   */
  TreeNode.prototype.appendChild = function(child) {
    child.parent = this;
    this.contents.push(child);
    return child;
  };

  /**
   * Replaces a child of this node with another.
   * @param {!treesaver.ui.TreeNode} newChild
   * @param {!treesaver.ui.TreeNode} oldChild
   * @return {treesaver.ui.TreeNode} The old child, or null.
   */
  TreeNode.prototype.replaceChild = function(newChild, oldChild) {
    var index = this.contents.indexOf(oldChild);
    if (index !== -1) {
      newChild.parent = oldChild.parent;
      oldChild.parent = null;
      return this.contents.splice(index, 1, newChild)[0];
    }
    return null;
  };

  /**
   * Insert a new child node before the reference node.
   * @param {!treesaver.ui.TreeNode} newChild
   * @param {!treesaver.ui.TreeNode} reference
   * @return {!treesaver.ui.TreeNode} The new child.
   */
  TreeNode.prototype.insertBefore = function(newChild, reference) {
    var index = this.contents.indexOf(reference);
    newChild.parent = this;
    if (index === 0) {
      this.contents.unshift(newChild);
    } else if (index > 1) {
      this.contents.splice(index, 0, newChild);
    }
    return newChild;
  };

  /**
   * Insert a new child node after the reference node.
   * @param {!treesaver.ui.TreeNode} newChild
   * @param {!treesaver.ui.TreeNode} reference
   * @return {!treesaver.ui.TreeNode} The new child.
   */
  TreeNode.prototype.insertAfter = function(newChild, reference) {
    var index = this.contents.indexOf(reference);
    newChild.parent = this;
    if (index === this.contents.length) {
      this.contents.push(newChild);
    } else if (index !== -1) {
      this.contents.splice(index + 1, 0, newChild);
    }
    return newChild;
  };

  /**
   * Removes a child node.
   * @param {!treesaver.ui.TreeNode} child
   * @return {treesaver.ui.TreeNode} The removed node or null if the node was not found.
   */
  TreeNode.prototype.removeChild = function(child) {
    var index = this.contents.indexOf(child),
        node = null;
    if (index !== -1) {
      node = this.contents.splice(index, 1)[0];
      node.parent = null;
    }
    return node;
  };
});

// Input 33
goog.provide('treesaver.object');

if (!Object.keys) {
  /**
   * Returns the keys in an object.
   *
   * @param {!Object} o
   * @return {Array.<string>}
   * NOTE: Suppress warnings about duplication from built-in externs.
   * @suppress {duplicate}
   */
  Object.keys = function(o) {
    var result = [];
    for (var name in o) {
      if (o.hasOwnProperty(name)) {
        result.push(name);
      }
    }
    return result;
  };
}

/**
 * Test whether or not a value is an object.
 *
 * @param {!Object} value The object to test.
 * @return {boolean} True if the value is an object, false otherwise.
 */
treesaver.object.isObject = function(value) {
  return Object.prototype.toString.apply(value) === '[object Object]';
};

/**
 * Clone an object by creating a new object and
 * setting its prototype to the original object.
 *
 * @param {!Object} o The object to be cloned.
 * @return {!Object} A clone of the given object.
 */
Object.clone = function(o) {
  /** @constructor */
  function Clone() {}
  Clone.prototype = o;
  return new Clone();
};

// Input 34
goog.provide('treesaver.uri');

goog.scope(function() {
  var uri = treesaver.uri;

  // URI parser, based on parseUri by Steven Levithan <stevenlevithan.com> (MIT License)
  uri._parserRegex = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;
  uri._keys = ['source', 'scheme', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'];

  uri.parse = function(str) {
      var i = uri._keys.length,
          m = uri._parserRegex.exec(str),
          result = {};

      while (i--) {
          result[uri._keys[i]] = m[i] || null;
      }
      return result;
  };

  uri.stringify = function(o) {
      var result = '';

      if (o['scheme']) {
          result += o['scheme'] + ':';
      }

      if (o['source'] && /^(?:[^:\/?#]+:)?\/\//.test(o['source'])) {
          result += '//';
      }

      if (o['authority']) {
          if (o['userInfo']) {
              result += o['user'] || '';
              if (o['userInfo'].indexOf(':') !== -1) {
                  result += ':';
              }
              result += o['password'] || '';
              result += '@';
          }
          result += o['host'] || '';

          if (o['port'] !== null) {
              result += ':' + o['port'];
          }
      }

      if (o['relative']) {
          if (o['path']) {
              result += o['directory'] || '';
              result += o['file'] || '';
          }

          if (o['query']) {
              result += '?' + o['query'];
          }

          if (o['anchor']) {
              result += '#' + o['anchor'];
          }
      }
      return result;
  };

  uri.isIndex = function(str) {
    var url = uri.parse(str);

    if (url.file) {
      return (/^(index|default)\.(html?|php|asp|aspx)$/i.test(url.file) || (treesaver.ui.ArticleManager.index && treesaver.ui.ArticleManager.index.get('DirectoryIndex', 'index.html') === url.file));
    }
    else {
      return false;
    }
  };

  uri.stripHash = function(str) {
    var tmp = uri.parse(str);
    tmp.anchor = null;
    return uri.stringify(tmp);
  };

  uri.stripFile = function(str) {
    var tmp = uri.parse(str);
    tmp.file = null;
    return uri.stringify(tmp);
  };
});

// Input 35
goog.provide('treesaver.ui.Document');

goog.require('treesaver.capabilities');
goog.require('treesaver.debug');
goog.require('treesaver.dom');
goog.require('treesaver.events');
goog.require('treesaver.dom');
goog.require('treesaver.storage');
goog.require('treesaver.ui.Article');
// Avoid circular ref
// goog.require('treesaver.ui.ArticleManager');
goog.require('treesaver.ui.TreeNode');
goog.require('treesaver.object');
goog.require('treesaver.uri');

/**
 * Class representing "documents" which are usually HTML pages that contain one or
 * more (top level) articles.
 * @constructor
 * @extends {treesaver.ui.TreeNode}
 * @param {!string} url The url of this document.
 * @param {?Object=} meta Meta-data for this document such as title, author, etc.
 */
treesaver.ui.Document = function(url, meta) {
  if (!url) {
    treesaver.debug.error('Document must have an URL');
    return;
  }

  this.url = url;
  this.path = treesaver.uri.parse(url)['relative'];
  this.meta = meta || {};

  this.articles = [];
  this.articleMap = {};
  this.anchorMap = [];
  this.contents = [];
};

goog.scope(function() {
  var Document = treesaver.ui.Document,
      capabilities = treesaver.capabilities,
      debug = treesaver.debug,
      dom = treesaver.dom,
      events = treesaver.events,
      storage = treesaver.storage,
      Article = treesaver.ui.Article,
      TreeNode = treesaver.ui.TreeNode,
      uri = treesaver.uri;

  /**
   * @type {!string}
   */
  Document.prototype.url;

  /**
   * @type {!string}
   */
  Document.prototype.path;

  /**
   * @type {!Object}
   */
  Document.prototype.meta;

  /**
   * @type {Array.<treesaver.ui.Article>}
   */
  Document.prototype.articles;

  /**
   * Maps identifiers to articles
   * @type {!Object}
   */
  Document.prototype.articleMap;

  /**
   * Maps article positions to anchors
   * @type {Array.<!string>}
   */
  Document.prototype.anchorMap;

  /**
   * @type {boolean}
   */
  Document.prototype.loaded;

  /**
   * @type {boolean}
   */
  Document.prototype.loading;

  /**
   * @type {boolean}
   */
  Document.prototype.loadFailed;

  /**
   * @type {boolean}
   */
  Document.prototype.error;

  /**
   * @type {!Array.<treesaver.ui.Document>}
   */
  Document.prototype.contents;

  /**
   * A list of all (mutable) capability requirements for this document.
   *
   * @type {?Array.<string>}
   */
  Document.prototype.requirements;

  /**
   * @type {?string}
   */
  Document.prototype.title;

  Document.CACHE_STORAGE_PREFIX = 'cache:';

  Document.events = {
    LOADFAILED: 'treesaver.loadfailed',
    LOADED: 'treesaver.loaded'
  };

  Document.titleRegExp = /<title>\s*(.+?)\s*<\/title>/i;

  Document.prototype = new TreeNode();

  /**
   * Parse the content of a document, creating articles where necessary.
   *
   * @param {!string} text The HTML text of a document.
   * @return {Array.<!treesaver.ui.Article>} A list of Article instances that were extracted from the text.
   */
  Document.prototype.parse = function(text) {
    var node = document.createElement('div'),
        articles = [];

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return [];
    }

    node.innerHTML = text;

    // Copy all meta tags with a name and content into the meta-data
    // object. The values specified in the <meta> tag take precendence
    // over values in the index file.
    dom.querySelectorAll('meta[name]', node).forEach(function (meta) {
      var name = meta.getAttribute('name'),
          content = meta.getAttribute('content');

      if (name && content) {
        this.meta[name] = content;
      }
    }, this);

    // We have the body of the document at 'requestUrl` in a node now,
    // and we try and find all top level articles.
    articles = dom.querySelectorAll('article', node).filter(function(article) {
      return dom.getAncestor(article, 'article') === null;
    });

    // We don't have any articles so we'll just copy the entire body and call it an article
    if (articles.length === 0) {
      articles.push(document.createElement('article'));
      articles[0].innerHTML = node.innerHTML;
    }

    // Next we try to find a unique URL for each article
    return articles.map(function(articleNode, index) {
      // If the article has an identifier use it. Otherwise we automatically
      // generate an identifier based on the article's position in the document:
      // `_<position>`, but not for the first article (which can always be
      // referenced by the requestUrl.)
      var identifier = articleNode.getAttribute('id') || (index === 0 ? null : ('_' + index)),
          // FIXME: get rid of the global reference to ArticleManager
          article = new Article(treesaver.ui.ArticleManager.grids_, articleNode, this);

      if (identifier) {
        this.articleMap[identifier] = index;
        this.anchorMap[index] = identifier;
      }

      return article;
    }, this);
  };

  /**
   * Tests for document equality. This usually comes down to comparing their URLs. There is a
   * special exception for when the document is a directory index file.
   *
   * @param {treesaver.ui.Document|string} o A document to compare against, or a url.
   * @return {boolean} True if this document equals `o`.
   */
  Document.prototype.equals = function(o) {
    var url = o;

    if (!url) {
      return false;
    }

    if (typeof o !== 'string' && o.url) {
      url = o.url;
    }

    if (uri.isIndex(url) && uri.isIndex(this.url)) {
      return url === this.url;
    }
    else if (uri.isIndex(url)) {
      return uri.stripFile(url) === this.url;
    }
    else if (uri.isIndex(this.url)) {
      return url === uri.stripFile(this.url);
    }
    else {
      return url === this.url;
    }
  };

  /**
   * Returns true if this document meets the (mutable) capabilities
   * @return {!boolean}
   */
  Document.prototype.capabilityFilter = function() {
    if (!this.requirements) {
      return true;
    }
    else {
      return capabilities.check(this.requirements, true);
    }
  };

  /**
   * Returns the article at the given index.
   * @param {!number} index
   * @return {?treesaver.ui.Article}
   */
  Document.prototype.getArticle = function(index) {
    return this.articles[index] || null;
  };

  /**
   * Manually set the articles for this Document.
   * @param {Array.<treesaver.ui.Article>} articles
   */
  Document.prototype.setArticles = function(articles) {
    this.articles = articles;
  };

  /**
   * Retrieve the meta data for this Document.
   * @return {!Object}
   */
  Document.prototype.getMeta = function() {
    return this.meta;
  };

  /**
   * Return the canonical URL for this Document.
   * @return {!string}
   */
  Document.prototype.getUrl = function() {
    return this.url;
  };

  /**
   * Set the canonical URL for this Document.
   * @param {!string} url
   */
  Document.prototype.setUrl = function(url) {
    this.url = url;
  };

  /**
   * Returns the number of articles in this Document. Does not include any child documents.
   * @return {!number}
   */
  Document.prototype.getNumberOfArticles = function() {
    return this.articles.length;
  };

  /**
   * Returns the anchor at the given article index.
   * @param {!number} index
   * @return {?string} The anchor or null if the article does not exist or does not have an anchor.
   */
  Document.prototype.getArticleAnchor = function(index) {
    return this.anchorMap[index] || null;
  };

  /**
   * Returns the article index for the given anchor.
   * @param {!string} anchor
   * @return {!number} The index for the given anchor, or zero (the first article, which is a sensible fallback when the anchor is not found.).
   */
  Document.prototype.getArticleIndex = function(anchor) {
    return this.articleMap[anchor] || 0;
  };

  /**
   * Extract the document title from a string of HTML text.
   * @private
   * @param {!string} text
   * @return {?string}
   */
  Document.prototype.extractTitle = function(text) {
    var res = Document.titleRegExp.exec(text);

    if (res && res[1]) {
      return res[1];
    }
    return null;
  };

  /**
   * Load this document by an XHR, if it hasn't already been loaded.
   */
  Document.prototype.load = function() {
    var that = this,
        cached_text = null;

    // Don't load twice
    if (this.loading) {
      return;
    }

    this.loading = true;

    if (!capabilities.IS_NATIVE_APP) {
      cached_text = /** @type {?string} */ (storage.get(Document.CACHE_STORAGE_PREFIX + this.url));

      if (cached_text) {
        debug.log('Document.load: Processing cached HTML content for document: ' + this.url);
        this.articles = this.parse(cached_text);
        this.title = this.extractTitle(cached_text);
        this.loaded = true;

        treesaver.events.fireEvent(document, Document.events.LOADED, {
          'document': this
        });
      }
    }

    debug.info('Document.load: Downloading document: ' + this.url);

    treesaver.network.get(this.url, function(text) {
      that.loading = false;

      if (!text) {
        if (capabilities.IS_NATIVE_APP || !cached_text) {
          debug.info('Document.load: Load failed, no content: ' + that.url);
          that.loadFailed = true;
          that.loaded = false;

          treesaver.events.fireEvent(document, Document.events.LOADFAILED, {
            'document': that
          });
          return;
        }
        else {
          // Stick with cached content
          debug.log('Document.load: Using cached content for document: ' + that.url);
        }
      }
      else if (capabilities.IS_NATIVE_APP || cached_text !== text) {
        if (!capabilities.IS_NATIVE_APP) {
          debug.log('Document.load: Fetched content newer than cache for document: ' + that.url);

          // Save the HTML in the cache
          storage.set(Document.CACHE_STORAGE_PREFIX + that.url, text, true);
        }

        debug.log('Document.load: Processing HTML content for document: ' + that.url);
        that.articles = that.parse(text);
        that.title = that.extractTitle(text);
        that.loaded = true;

        treesaver.events.fireEvent(document, Document.events.LOADED, {
          'document': that
        });
      }
      else {
        debug.log('Document.load: Fetched document content same as cached');
      }
    });
  };

  goog.exportSymbol('treesaver.Document', Document);
  goog.exportSymbol('treesaver.Document.prototype.setArticles', Document.prototype.setArticles);
  goog.exportSymbol('treesaver.Document.prototype.getNumberOfArticles', Document.prototype.getNumberOfArticles);
  goog.exportSymbol('treesaver.Document.prototype.getArticle', Document.prototype.getArticle);
  goog.exportSymbol('treesaver.Document.prototype.parse', Document.prototype.parse);
  goog.exportSymbol('treesaver.Document.prototype.getUrl', Document.prototype.getUrl);
  goog.exportSymbol('treesaver.Document.prototype.setUrl', Document.prototype.setUrl);
  goog.exportSymbol('treesaver.Document.prototype.getMeta', Document.prototype.getMeta);
});

// Input 36
/**
 * @fileoverview JSON wrapper methods for older browsers.
 */

goog.provide('treesaver.json');

goog.require('treesaver.debug');

goog.scope(function() {
  var json = treesaver.json,
      debug = treesaver.debug,
      nativeJSON = window.JSON;

  /**
   * Parse JSON and return the object
   *
   * @param {!string} str
   * @return {*}
   */
  json.parse = function(str) {
    return nativeJSON.parse(str);
  };

  /**
   * Convert a value into JSON
   *
   * @param {*} val
   * @return {!string}
   */
  json.stringify = function(val) {
    return nativeJSON.stringify(val);
  };
});

// Input 37
goog.provide('treesaver.ui.Index');

goog.require('treesaver.capabilities');
goog.require('treesaver.debug');
goog.require('treesaver.events');
goog.require('treesaver.json');
goog.require('treesaver.network');
goog.require('treesaver.object');
goog.require('treesaver.storage');
goog.require('treesaver.ui.Document');
goog.require('treesaver.ui.TreeNode');
goog.require('treesaver.uri');

/**
 * Class representing the index file (i.e. the table of contents for documents.)
 * @constructor
 * @extends {treesaver.ui.TreeNode}
 * @param {?string} url The url the index was loaded from.
 */
treesaver.ui.Index = function(url) {
  this.url = url;
  this.settings = {};
  this.meta = {};
};

goog.scope(function() {
  var Index = treesaver.ui.Index,
      Document = treesaver.ui.Document,
      TreeNode = treesaver.ui.TreeNode,
      capabilities = treesaver.capabilities,
      debug = treesaver.debug,
      uri = treesaver.uri,
      events = treesaver.events,
      network = treesaver.network,
      storage = treesaver.storage,
      json = treesaver.json;

  Index.prototype = new TreeNode();

  /**
   * @type {?string}
   */
  Index.prototype.url;

  /**
   * @type {!Array.<treesaver.ui.Document>}
   */
  Index.prototype.contents;

  /**
   * @type {!Object}
   */
  Index.prototype.settings;

  /**
   * @type {!Object}
   */
  Index.prototype.meta;

  /**
   * @type {boolean}
   */
  Index.prototype.loaded;

  /**
   * @type {boolean}
   */
  Index.prototype.loading;

  /**
   * @type {!Object}
   */
  Index.prototype.documentMap;

  /**
   * @type {!Object}
   */
  Index.prototype.documentPositions;

  /**
   * Linear list of documents. This is used as a cache. You can invalidate and repopulate the cache by calling update().
   * @type {!Array.<treesaver.ui.Document>}
   */
  Index.prototype.documents = [];

  // Do we ever use a different cache prefix? If not, perhaps we should
  // pull this up.
  Index.CACHE_STORAGE_PREFIX = 'cache:';

  Index.events = {
    LOADFAILED: 'treesaver.index.loadfailed',
    LOADED: 'treesaver.index.loaded',
    UPDATED: 'treesaver.index.updated'
  };

  /**
   * Parses an index entry and returns a new Document instance.
   * @private
   * @param {!Object} entry
   * @return {?treesaver.ui.Document}
   */
  Index.prototype.parseEntry = function(entry) {
    var url = null,
        contents = null,
        meta = {},
        requirements = null,
        doc = null;

    if (typeof entry === 'string') {
      url = entry;
    }
    else {
      url = entry['url'];
      contents = entry['contents'];

      // Copy all fields into a new object
      Object.keys(entry).forEach(function(key) {
        meta[key] = entry[key];
      });

      if (entry['requires']) {
        if (typeof entry['requires'] === 'string') {
          requirements = entry['requires'].split(/\s|,\s/g);
        }
        else if (Array.isArray(entry['requires'])) {
          // Make sure our `requires` entries are actually strings
          requirements = entry['requires'].map(function(value) {
            return value.toString();
          });
        }

        requirements = requirements.filter(function(value) {
          return value.trim() !== '';
        });
      }
    }

    if (!url) {
      debug.warn('Ignored document index entry without URL');
      return null;
    }

    // Resolve this URL, and strip the hash if necessary
    url = uri.stripHash(network.absoluteURL(url));

    // Create a new document
    doc = new Document(url, meta);

    // Depth first traversal of any contents, and add them
    if (contents && Array.isArray(contents)) {
      contents.forEach(function(child) {
        doc.appendChild(this.parseEntry(child));
      }, this);
    }

    if (requirements) {
      doc.requirements = requirements;
    }

    return doc;
  };

  /**
   * Updates the document cache and repopulates it. This
   * should be called after manually modifying the index.
   */
  Index.prototype.update = function() {
    var index = 0;

    this.documents = [];
    this.documentMap = {};
    this.documentPositions = {};

    this.walk(this.contents, function(doc) {
      if (this.documentMap[doc.url]) {
        this.documentMap[doc.url].push(doc);
      }
      else {
        this.documentMap[doc.url] = [doc];
      }
      this.documents.push(doc);

      if (this.documentPositions[doc.url]) {
        this.documentPositions[doc.url].push(index);
      }
      else {
        this.documentPositions[doc.url] = [index];
      }
      index += 1;
    }, this);

    events.fireEvent(document, Index.events.UPDATED, {
      'index': this
    });
  };

  /**
   * Depth first walk through the index.
   *
   * @private
   * @param {Array.<treesaver.ui.TreeNode>} contents
   * @param {!function(!treesaver.ui.TreeNode)} fn Callback to call for each node. Return false to exit the traversal early.
   * @param {Object=} scope Scope bound to the callback.
   */
  Index.prototype.walk = function(contents, fn, scope) {
    return contents.every(function(entry) {
      return fn.call(scope, entry) !== false && this.walk(entry.contents, fn, scope);
    }, this);
  };

  /**
   * Return the document at `index`.
   * @param {!number} index
   * @return {?treesaver.ui.Document}
   */
  Index.prototype.getDocumentByIndex = function(index) {
    return this.documents[index];
  };

  /**
   * Returns the total number of documents in this index.
   * @return {!number}
   */
  Index.prototype.getNumberOfDocuments = function() {
    return this.documents.length;
  };

  /**
   * Returns the document index of the given document (the position in a depth first traversal of the document hierarchy.)
   * @param {!treesaver.ui.Document} doc
   * @return {!number}
   */
  Index.prototype.getDocumentIndex = function(doc) {
    var result = -1,
        i = 0;

    this.walk(this.contents, function(d) {
      if (d.equals(doc)) {
        result = i;
      }
      i += 1;
    }, this);

    return result;
  };

  /**
   * Returns all documents matching the given URL in the live index, or the linear
   * ordering of documents as extracted from a depth first traversal of the document
   * hierarchy when no URL is given.
   *
   * @param {?string} url
   * @return {Array.<treesaver.ui.Document>}
   */
  Index.prototype.getDocuments = function(url) {
    var result = [];

    if (!url) {
      return this.documents;
    }
    else {
      this.walk(this.contents, function(doc) {
        if (doc.equals(url)) {
          result.push(doc);
        }
      }, this);
      return result;
    }
  };

  /**
   * Parses a string or array as the document index.
   * @private
   * @param {!string|!Object} index
   */
  Index.prototype.parse = function(index) {
    var result = {
          contents: [],
          settings: {},
          meta: {}
        };

    if (!index) {
      return result;
    }

    if (typeof index === 'string') {
      try {
        index = /** @type {!Array} */ (json.parse(index));
      } catch (e) {
        debug.warn('Tried to parse index file, but failed: ' + e);
        return result;
      }
    }

    if (!treesaver.object.isObject(/** @type {!Object} */ (index))) {
      debug.warn('Document index should be an object.');
      return result;
    }

    if (!index['contents'] || !Array.isArray(index['contents'])) {
      debug.warn('Document index does not contain a valid "contents" array.');
      return result;
    }

    result.contents = index['contents'].map(function(entry) {
      return this.parseEntry(entry);
    }, this);

    result.contents = result.contents.filter(function(entry) {
      return entry !== null;
    });

    result.contents = result.contents.map(function(entry) {
      return this.appendChild(entry);
    }, this);

    if (index['settings']) {
      result.settings = {};
      Object.keys(index.settings).forEach(function(key) {
        result.settings[key] = index.settings[key];
      });
    }

    Object.keys(index).forEach(function(key) {
      if (key !== 'settings') {
        result.meta[key] = index[key];
      }
    });

    return result;
  };

  /**
   * Set a publication wide configuration property.
   *
   * @param {!string} key
   * @param {!*} value
   */
  Index.prototype.set = function(key, value) {
    return this.settings[key] = value;
  };

  /**
   * Retrieve a publication wide configuration property.
   *
   * @param {!string} key
   * @param {*=} defaultValue
   * @return {?*}
   */
  Index.prototype.get = function(key, defaultValue) {
    if (this.settings.hasOwnProperty(key)) {
      return this.settings[key];
    }
    else {
      return defaultValue;
    }
  };

  /**
   * Returns the meta-data for this publication.
   *
   * @return {!Object}
   */
  Index.prototype.getMeta = function() {
    return this.meta;
  };

  /**
   * Load the index file through XHR if it hasn't already been loaded.
   */
  Index.prototype.load = function() {
    var that = this,
        cached_text = null,
        index = null;

    // TODO: Maybe generalize caching. There seems to be a pattern here.

    // Only load once
    if (this.loading) {
      return;
    }

    // Don't try loading if we do not have a proper URL
    if (!this.url) {
      events.fireEvent(document, Index.events.LOADFAILED, {
        'index': this
      });
      return;
    }

    this.loading = true;

    if (!capabilities.IS_NATIVE_APP) {
      cached_text = /** @type {?string} */ (storage.get(Index.CACHE_STORAGE_PREFIX + this.url));

      if (cached_text) {
        debug.log('Index.load: Processing cached content for index: ' + this.url);
        index = this.parse(cached_text);

        this.contents = index.contents;
        this.meta = index.meta;
        this.settings = index.settings;
        this.loaded = true;

        events.fireEvent(document, Index.events.LOADED, {
          'index': this
        });

        this.update();
      }
    }

    debug.info('Index.load: Downloading index: ' + this.url);

    network.get(this.url, function(text) {
      that.loading = false;

      if (!text) {
        if (treesaver.capabilities.IS_NATIVE_APP || !cached_text) {
          debug.info('Index.load: Load failed, no index found at: ' + that.url);
          that.loadFailed = true;
          that.loaded = false;

          events.fireEvent(document, Index.events.LOADFAILED, {
            'index': that
          });
          return;
        }
        else {
          // Stick with cached content
          debug.log('Index.load: Using cached content for index: ' + that.url);
        }
      }
      else if (capabilities.IS_NATIVE_APP || cached_text !== text) {
        if (!capabilities.IS_NATIVE_APP) {
          debug.log('Index.load: Fetched content newer than cache for index: ' + that.url);

          // Save the HTML in the cache
          storage.set(Index.CACHE_STORAGE_PREFIX + that.url, text, true);
        }

        debug.log('Index.load: Processing content for index: ' + that.url);
        index = that.parse(text);
        that.contents = index.contents;
        that.meta = index.meta;
        that.settings = index.settings;
        that.loaded = true;

        events.fireEvent(document, Index.events.LOADED, {
          'index': that
        });

        that.update();
      }
      else {
        debug.log('Index.load: Fetched index same as cached');
      }
    });
  };

  goog.exportSymbol('treesaver.Index', Index);
  goog.exportSymbol('treesaver.Index.prototype.get', Index.prototype.get);
  goog.exportSymbol('treesaver.Index.prototype.set', Index.prototype.set);
  goog.exportSymbol('treesaver.Index.prototype.update', Index.prototype.update);
  goog.exportSymbol('treesaver.Index.prototype.getDocuments', Index.prototype.getDocuments);
  goog.exportSymbol('treesaver.Index.prototype.getNumberOfDocuments', Index.prototype.getNumberOfDocuments);
  goog.exportSymbol('treesaver.Index.prototype.getMeta', Index.prototype.getMeta);
});

// Input 38
/**
 * @fileoverview Article manager class.
 */

goog.provide('treesaver.ui.ArticleManager');

goog.require('treesaver.capabilities');
goog.require('treesaver.debug');
goog.require('treesaver.dimensions');
goog.require('treesaver.dom');
goog.require('treesaver.events');
goog.require('treesaver.network');
goog.require('treesaver.resources');
goog.require('treesaver.ui.Article');
goog.require('treesaver.ui.ArticlePosition');
goog.require('treesaver.ui.Document');
goog.require('treesaver.ui.Index');
goog.require('treesaver.uri');

goog.scope(function() {
  var ArticleManager = treesaver.ui.ArticleManager,
      capabilities = treesaver.capabilities,
      debug = treesaver.debug,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom,
      events = treesaver.events,
      network = treesaver.network,
      resources = treesaver.resources,
      Article = treesaver.ui.Article,
      ArticlePosition = treesaver.ui.ArticlePosition,
      Document = treesaver.ui.Document,
      Index = treesaver.ui.Index;

  /**
   * Initialize all content
   * @param {?string} initialHTML
   */
  ArticleManager.load = function(initialHTML) {
    // Initialize state
    ArticleManager.currentPageIndex = -1;
    ArticleManager.currentDocumentIndex = -1;
    ArticleManager.currentArticlePosition = ArticlePosition.BEGINNING;
    // Initial values are meaningless, just annotate here
    /** @type {treesaver.ui.Document} */
    ArticleManager.currentDocument;
    /** @type {treesaver.ui.Article} */
    ArticleManager.currentArticle;
    /** @type {treesaver.layout.ContentPosition} */
    ArticleManager.currentPosition;
    /** @type {number} */
    ArticleManager.currentPageWidth;

    /**
     * TODO: Mark this as private once again when reference from document.js is removed
     */
    ArticleManager.grids_ = ArticleManager.getGrids_();

    if (!ArticleManager.grids_) {
      debug.error('No grids');

      return false;
    }

    // TODO: Store hash, so we can use it to jump directly to an article
    ArticleManager.initialDocument = new Document(treesaver.uri.stripHash(document.location.href), {});

    if (initialHTML) {
      ArticleManager.initialDocument.articles = ArticleManager.initialDocument.parse(initialHTML);
      ArticleManager.initialDocument.title = document.title;
      ArticleManager.initialDocument.loaded = true;
    }

    // Set up event listener for the index
    events.addListener(document, Index.events.LOADED, ArticleManager.onIndexLoad);

    // Create an index instance. Note that getIndexUrl() may fail, causing the LOADFAILED handler to be called.
    ArticleManager.index = new Index(ArticleManager.getIndexUrl());

    // Append the initial document, so that we have at least something in case loading the index takes a long time or fails.
    ArticleManager.index.appendChild(ArticleManager.initialDocument);
    ArticleManager.index.update();
    ArticleManager.index.load();

    // Set the initial document to active
    ArticleManager.setCurrentDocument(ArticleManager.initialDocument, ArticlePosition.BEGINNING, null, null, true);

    // Set up the loading & error pages
    ArticleManager.initLoadingPage();
    ArticleManager.initErrorPage();

    // Set up event handlers
    ArticleManager.watchedEvents.forEach(function(evt) {
      events.addListener(document, evt, ArticleManager.handleEvent);
    });

    // popstate is on window, not document
    events.addListener(window, treesaver.history.events.POPSTATE, ArticleManager.handleEvent);

    return true;
  };

  /**
   * Clear references and disconnect events
   */
  ArticleManager.unload = function() {
    // Clear out state
    ArticleManager.currentDocument = null;
    ArticleManager.currentArticle = null;
    ArticleManager.currentPosition = null;
    ArticleManager.currentPageIndex = -1;
    ArticleManager.currentDocumentIndex = -1;
    ArticleManager.currentArticlePosition = null;
    // Invalid clearing for type. TODO: Decide if this is even worth clearing on unload
    //ArticleManager.currentPageWidth = null;

    ArticleManager.loadingPageHTML = null;
    ArticleManager.loadingPageSize = null;

    events.removeListener(document, Index.events.LOADED, ArticleManager.onIndexLoad);

    // Unhook events
    ArticleManager.watchedEvents.forEach(function(evt) {
      events.removeListener(document, evt, ArticleManager.handleEvent);
    });

    events.removeListener(window, treesaver.history.events.POPSTATE, ArticleManager.handleEvent);
  };

  ArticleManager.onIndexLoad = function(e) {
    var index = e.index,
        docs = index.getDocuments(ArticleManager.initialDocument.url),
        doc = null,
        initialDocumentMeta = dom.querySelectorAll('meta[name]');

    // Note that this may get called twice, once from the cache and once from the XHR response
    if (docs.length) {
      // Update the new index with the articles from the initial document, which we have already loaded.
      docs.forEach(function(doc) {
        ArticleManager.initialDocument.meta = doc.meta;
        ArticleManager.initialDocument.contents = doc.contents;
        ArticleManager.initialDocument.requirements = doc.requirements;

        // Copy over the meta data inside the initial document
        initialDocumentMeta.forEach(function (meta) {
          var name = meta.getAttribute('name'),
              content = meta.getAttribute('content');

          if (name && content) {
            doc.meta[name] = content;
          }
        });

        doc.parent.replaceChild(ArticleManager.initialDocument, doc);
      });

      ArticleManager.currentDocumentIndex = index.getDocumentIndex(ArticleManager.initialDocument);

      document.title = ArticleManager.initialDocument.meta['title'] || ArticleManager.initialDocument.title;
    }
    else {
      // Whoops, what happens here? We loaded a document, it has an index, but
      // the index does not contain a reference to the document that referenced it.
      // Emit an error for now.
      debug.error('onIndexLoad: found index, but the article that refers to the index is not present.');
    }
  };

  /**
   * Return an array of Grid objects, using the elements in the resources
   *
   * @private
   * @return {Array.<treesaver.layout.Grid>}
   */
  ArticleManager.getGrids_ = function() {
    var grids = [];

    resources.findByClassName('grid').forEach(function(node) {
      var requires = node.getAttribute('data-requires'),
          grid;
      // Make sure the grid meets our requirements
      if (!requires || capabilities.check(requires.split(' '))) {
        // Initialize each grid and store
        grid = new treesaver.layout.Grid(node);
        if (!grid.error) {
          grids.push(grid);
        }
      }
    });

    return grids;
  };

  /**
   * Initialize the loading page
   */
  ArticleManager.initLoadingPage = function() {
    var el = resources.findByClassName('loading')[0];

    // Craft a dummy page if none is there
    if (!el) {
      el = document.createElement('div');
    }

    // Needed for correct positioning in chrome
    document.body.appendChild(el);
    el.style.top = '50%';
    el.style.left = '50%';
    dimensions.setCssPx(el, 'margin-top', -treesaver.dimensions.getOffsetHeight(el) / 2);
    dimensions.setCssPx(el, 'margin-left', -treesaver.dimensions.getOffsetWidth(el) / 2);
    document.body.removeChild(el);

    ArticleManager.loadingPageHTML = dom.outerHTML(el);
    el = /** @type {!Element} */ (el.cloneNode(true));
    document.body.appendChild(el);
    ArticleManager.loadingPageSize = new dimensions.Metrics(el);
    document.body.removeChild(el);
  };

  /**
   * Initialize the error page
   */
  ArticleManager.initErrorPage = function() {
    var el = resources.findByClassName('error')[0];

    // Craft a dummy page if none is there
    if (!el) {
      el = document.createElement('div');
    }

    // Needed for correct positioning in chrome
    document.body.appendChild(el);
    el.style.top = '50%';
    el.style.left = '50%';
    dimensions.setCssPx(el, 'margin-top', -treesaver.dimensions.getOffsetHeight(el) / 2);
    dimensions.setCssPx(el, 'margin-left', -treesaver.dimensions.getOffsetWidth(el) / 2);
    document.body.removeChild(el);

    ArticleManager.errorPageHTML = dom.outerHTML(el);
    el = /** @type {!Element} */ (el.cloneNode(true));
    document.body.appendChild(el);
    ArticleManager.errorPageSize = new dimensions.Metrics(el);
    document.body.removeChild(el);
  };

  /**
   * @type {Object.<string, string>}
   */
  ArticleManager.events = {
    ARTICLECHANGED: 'treesaver.articlechanged',
    DOCUMENTCHANGED: 'treesaver.documentchanged',
    PAGESCHANGED: 'treesaver.pageschanged'
  };

  /**
   * @private
   * @type {Array.<string>}
   */
  ArticleManager.watchedEvents = [
    Document.events.LOADED,
    Document.events.LOADFAILED,
    Article.events.PAGINATIONPROGRESS
  ];

  /**
   * @param {!Object|!Event} e
   */
  ArticleManager.handleEvent = function(e) {
    if (e.type === Article.events.PAGINATIONPROGRESS) {
      // We have new pages to display
      // TODO
      // Fire event
      events.fireEvent(document, ArticleManager.events.PAGESCHANGED);
      return;
    }

    if (e.type === Document.events.LOADED) {
      document.title = ArticleManager.currentDocument.meta['title'] || ArticleManager.currentDocument.title;
      // TODO
      // If it's the current article, kick off pagination?
      // If it's the next, kick it off too?
      // Where does size come from?
      events.fireEvent(document, ArticleManager.events.PAGESCHANGED);
      return;
    }

    if (e.type === Document.events.LOADFAILED &&
        e.document === ArticleManager.currentDocument) {
      if (capabilities.IS_NATIVE_APP) {
        // Article did not load, for now just ignore
      }
      else {
        // The current article failed to load, redirect to it
        ArticleManager.redirectToDocument(ArticleManager.currentDocument);

        return;
      }
    }

    if (e.type === treesaver.history.events.POPSTATE) {
      ArticleManager.onPopState(/** @type {!Event} */ (e));
      return;
    }
  };

  /**
   * @param {!Event} e  Event with e.state for state storage.
   */
  ArticleManager.onPopState = function(e) {
    var index = -1,
        position = null,
        doc;

    debug.info('onPopState event received: ' +
        (e['state'] ? e['state'].url : 'No URL'));

    if (e['state']) {
      index = e['state'].index;
      doc = (index || index === 0) ?
        ArticleManager.index.getDocumentByIndex(index) : null;

      if (doc) {
        position = e['state'].position;

        ArticleManager.setCurrentDocument(
          doc,
          ArticlePosition.BEGINNING,
          position ? new treesaver.layout.ContentPosition(position.block, position.figure, position.overhang) : null,
          index,
          true
        );
      }
      else {
        ArticleManager.goToDocumentByURL(e['state'].url);
      }
    }
    else {
      // Assume initial article
      index = ArticleManager.index.getDocumentIndex(ArticleManager.initialDocument);

      ArticleManager.setCurrentDocument(
        ArticleManager.initialDocument,
        ArticlePosition.BEGINNING,
        null,
        index
      );
    }
  };

  /**
   * Returns the URL of the index file if available in the initial page.
   * @private
   * @return {?string}
   */
  ArticleManager.getIndexUrl = function() {
    var link = dom.querySelectorAll('link[rel~=index]')[0];

    if (!link) {
      return null;
    }
    return network.absoluteURL(link.href);
  };

  /**
   * Can the user go to the previous page?
   *
   * @return {boolean}
   */
  ArticleManager.canGoToPreviousPage = function() {
    // Do we know what page we are on?
    if (ArticleManager.currentPageIndex !== -1) {
      // Page 2 and above can always go one back
      if (ArticleManager.currentPageIndex >= 1) {
        return true;
      }
      else {
        // If on the first page, depends on whether there's another article
        return ArticleManager.canGoToPreviousArticle();
      }
    }
    else {
      // Don't know the page number, so can only go back a page if we're
      // on the first page
      return !ArticleManager.currentPosition &&
              ArticleManager.canGoToPreviousArticle();
    }
  };

  /**
   * Returns true if it is possible to go to a previous article.
   * @return {!boolean}
   */
  ArticleManager.canGoToPreviousArticle = function() {
    return ArticleManager.currentArticlePosition.index > 0 || ArticleManager.canGoToPreviousDocument();
  };

  /**
   * Is there a previous document to go to?
   *
   * @return {!boolean}
   */
  ArticleManager.canGoToPreviousDocument = function() {
    var i = ArticleManager.currentDocumentIndex - 1;

    for (; i >= 0; i -= 1) {
      if (ArticleManager.index.getDocumentByIndex(i).capabilityFilter()) {
        return true;
      }
    }
    return false;
  };

  /**
   * Go to the beginning of previous document in the flow
   * @param {boolean=} end Go to the end of the document.
   * @param {boolean=} fetch Only return the document, don't move.
   * @return {treesaver.ui.Document} null if there is no next document.
   */
  ArticleManager.previousDocument = function(end, fetch) {
    if (!ArticleManager.canGoToPreviousDocument()) {
      return null;
    }

    var index = ArticleManager.currentDocumentIndex - 1,
        doc = null,
        articlePosition = null;

    for (; index >= 0; index -= 1) {
      doc = /** @type {!treesaver.ui.Document} */ (ArticleManager.index.getDocumentByIndex(index));
      if (doc.capabilityFilter()) {
        break;
      }
    }

    if (doc) {
      if (doc.loaded) {
        articlePosition = new ArticlePosition(doc.getNumberOfArticles() - 1);
      }
      else {
        articlePosition = ArticlePosition.END;
      }

      return fetch ? doc : ArticleManager.setCurrentDocument(doc, articlePosition, end ? treesaver.layout.ContentPosition.END : null, index);
    }
    else {
      return null;
    }
  };

  /**
   * Go to or fetch the previous article or document.
   * @param {boolean=} end Whether to go to the end of the previous article or document.
   * @param {boolean=} fetch Whether to go to the previous article (or document) or fetch it without navigating to it.
   */
  ArticleManager.previousArticle = function(end, fetch) {
    if (!ArticleManager.canGoToPreviousArticle()) {
      return null;
    }

    if (ArticleManager.currentArticlePosition.index > 0) {
      var articlePosition = new ArticlePosition(ArticleManager.currentArticlePosition.index - 1),
          index = ArticleManager.currentDocumentIndex,
          doc = /** @type {!treesaver.ui.Document} */ (ArticleManager.currentDocument);

      return fetch ? doc : ArticleManager.setCurrentDocument(doc, articlePosition, end ? treesaver.layout.ContentPosition.END : null, index);
    }
    else {
      return ArticleManager.previousDocument(end, fetch);
    }
  };

  /**
   * Go to the previous page in the current article. If we are at
   * the first page of the article, go to the last page of the previous
   * article
   * @return {boolean} False if there is no previous page or article.
   */
  ArticleManager.previousPage = function() {
    if (goog.DEBUG) {
      if (!ArticleManager.currentDocument) {
        debug.error('Tried to go to previous article without an article');
        return false;
      }
    }

    // TODO: Try to re-use logic from canGoToPreviousPage
    if (ArticleManager.currentPageIndex === -1) {
      if (!ArticleManager.currentPosition) {
        if (ArticleManager.previousArticle(true)) {
          return true;
        }
      }

      // We have no idea what page we're on, so we can't go back a page
      // TODO: Is there something sane to do here?
      return false;
    }

    var new_index = ArticleManager.currentPageIndex - 1;

    if (new_index < 0) {
      // Go to the previous article, if it exists
      if (ArticleManager.previousArticle(true)) {
        return true;
      }

      // It doesn't exist, so just stay on the first page
      // No change in state, can return now
      return false;
    }

    ArticleManager.currentPageIndex = new_index;

    // Clear the internal position since we're on a new page
    ArticleManager.currentPosition = null;

    // Fire the change event
    events.fireEvent(document, ArticleManager.events.PAGESCHANGED);

    return true;
  };

  /**
   * Can the user go to the next page?
   *
   * @return {boolean}
   */
  ArticleManager.canGoToNextPage = function() {
    // Do we know what page we are on?
    if (ArticleManager.currentPageIndex !== -1) {
      // Do we know there are more pages left?
      if (ArticleManager.currentPageIndex <
          ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index].pageCount - 1) {
        return true;
      }
      else {
        return ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index].paginationComplete && ArticleManager.canGoToNextArticle();
      }
    }
    else {
      // Perhaps we're on the last page of the article?
      if (ArticleManager.currentPosition === treesaver.layout.ContentPosition.END) {
        return ArticleManager.canGoToNextArticle();
      }
      else {
        // We have no idea what page we are on, so we don't know if we can advance
        return false;
      }
    }
  };

  /**
   * Is there a next article to go to?
   *
   * @return {boolean}
   */
  ArticleManager.canGoToNextArticle = function() {
    return (ArticleManager.currentArticlePosition.index < ArticleManager.currentDocument.getNumberOfArticles() - 1) ||
              ArticleManager.canGoToNextDocument();
  };

  /**
   * Is there a next document to go to?
   * @return {boolean}
   */
  ArticleManager.canGoToNextDocument = function() {
    var i = ArticleManager.currentDocumentIndex + 1,
        len = ArticleManager.index.getNumberOfDocuments();

    for (; i < len; i += 1) {
      if (ArticleManager.index.getDocumentByIndex(i).capabilityFilter()) {
        return true;
      }
    }
    return false;
  };

  /**
   * Go to the beginning of next document in the flow
   * @param {boolean=} fetch Only return the document, don't move.
   * @return {treesaver.ui.Document} The next document.
   */
  ArticleManager.nextDocument = function(fetch) {
    if (!ArticleManager.canGoToNextDocument()) {
      return null;
    }

    var index = ArticleManager.currentDocumentIndex + 1,
        doc = null,
        len = ArticleManager.index.getNumberOfDocuments();

    for (; index < len; index += 1) {
      doc = /** @type {!treesaver.ui.Document} */ (ArticleManager.index.getDocumentByIndex(index));
      if (doc.capabilityFilter()) {
        break;
      }
    }

    if (doc) {
      return fetch ? doc : ArticleManager.setCurrentDocument(doc, ArticlePosition.BEGINNING, null, index);
    }
    else {
      return null;
    }
  };

  /**
   * Go to or fetch the next article or document.
   * @param {boolean=} fetch Whether to go to the next article (or document) or fetch it without navigating to it.
   */
  ArticleManager.nextArticle = function(fetch) {
    if (!ArticleManager.canGoToNextArticle()) {
      return null;
    }

    if (ArticleManager.currentArticlePosition.index < ArticleManager.currentDocument.getNumberOfArticles() - 1) {
      var articlePosition = new ArticlePosition(ArticleManager.currentArticlePosition.index + 1),
          index = ArticleManager.currentDocumentIndex,
          doc = /** @type {!treesaver.ui.Document} */ (ArticleManager.currentDocument);

      return fetch ? doc : ArticleManager.setCurrentDocument(doc, articlePosition, null, index);
    }
    else {
      return ArticleManager.nextDocument(fetch);
    }
  };

  /**
   * Go to the next page in the current article. If we are at
   * the last page of the article, go to the first page of the next
   * article
   * @return {boolean} False if there is no previous page or article.
   */
  ArticleManager.nextPage = function() {
    if (goog.DEBUG) {
      if (!ArticleManager.currentDocument) {
        debug.error('Tried to go to next page without an document');
        return false;
      }
    }

    if (ArticleManager.currentPageIndex === -1) {
      if (ArticleManager.currentPosition === treesaver.layout.ContentPosition.END) {
        return ArticleManager.nextArticle();
      }

      // We have no idea what page we're on, so we can't go to the next page
      // TODO: Is there something sane to do here?
      return false;
    }

    var new_index = ArticleManager.currentPageIndex + 1;

    if (new_index >= ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index].pageCount) {
      if (ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index].paginationComplete) {
        // Go to the next article or document, if it exists
        return ArticleManager.nextArticle();
      }

      // We know there will be a next page, but we don't know
      // anything else yet so stay put
      // No change in state, can return now
      return false;
    }

    // Go to our new index
    ArticleManager.currentPageIndex = new_index;

    // Clear the internal position since we're on a new page
    ArticleManager.currentPosition = null;

    // Fire the change event
    events.fireEvent(document, ArticleManager.events.PAGESCHANGED);

    return true;
  };

  /**
   * Go to the article with the given URL, if it exists. Return false if
   * it does not exist
   *
   * @param {!string} url
   * @param {treesaver.layout.ContentPosition=} pos
   * @return {boolean} True if successful.
   */
  ArticleManager.goToDocumentByURL = function(url, pos) {
    var articleAnchor = treesaver.uri.parse(url)['anchor'],
        docs = ArticleManager.index.getDocuments(treesaver.uri.stripHash(url)),
        doc,
        index = -1,
        articlePosition = null;

    if (docs.length !== 0) {
      // Go to the first matching document
      doc = /** @type {!treesaver.ui.Document} */ (docs[0]);

      index = ArticleManager.index.getDocumentIndex(doc);

      // If the document is loaded and we have an anchor, we can just look up the desired article index
      if (doc.loaded && articleAnchor) {
        articlePosition = new ArticlePosition(doc.getArticleIndex(articleAnchor));
      }
      else {
        articlePosition = new ArticlePosition(0, articleAnchor);
      }

      if (index !== -1) {
        return ArticleManager.setCurrentDocument(doc, articlePosition, null, index);
      }
    }
    return false;
  };

  /**
   * Retrieve an array of pages around the current reading position
   *
   * @param {!treesaver.dimensions.Size} maxSize Maximum allowed size of a page.
   * @param {number}                     buffer  Number of pages on each side of
   *                                             page to retrieve.
   * @return {Array.<?treesaver.layout.Page>} Array of pages, some may be null.
   */
  ArticleManager.getPages = function(maxSize, buffer) {
    if (ArticleManager.currentArticlePosition.atEnding() && ArticleManager.currentDocument.loaded) {
      ArticleManager.currentArticlePosition = new ArticlePosition(ArticleManager.currentDocument.articles.length - 1);
    }
    else if (ArticleManager.currentArticlePosition.isAnchor() && ArticleManager.currentDocument.loaded) {
      // This will return 0 (meaning the first article) if the anchor is not found.
      ArticleManager.currentArticlePosition = new ArticlePosition(ArticleManager.currentDocument.getArticleIndex(/** @type {string} */(ArticleManager.currentArticlePosition.anchor)));
    }

    // Set the page size
    if (ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index] &&
        ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index].setMaxPageSize(maxSize)) {
        // Re-layout is required, meaning our pageIndex is worthless
        ArticleManager.currentPageIndex = -1;
        // As is the page width
        ArticleManager.currentPageWidth = 0;
    }

    // First, let's implement a single page
    var pages = [],
        nextDocument,
        prevDocument,
        startIndex,
        pageCount = 2 * buffer + 1,
        missingPageCount,
        i, j, len;

    // What is the base page?
    if (ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index] && ArticleManager.currentPageIndex === -1) {
      // Look up by position
      ArticleManager.currentPageIndex = ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index].
        getPageIndex(ArticleManager.currentPosition);

      if (ArticleManager.currentPageIndex === -1) {
        // If we _still_ don't know the page index, well we need to return blanks
        pages.length = pageCount;
        // One loading page will suffice
        pages[buffer] = ArticleManager._createLoadingPage();
        // All done here
        return pages;
      }
    }

    // First page to be requested in current article
    startIndex = ArticleManager.currentPageIndex - buffer;

    if (startIndex < 0) {
      prevDocument = ArticleManager.previousArticle(false, true);

      if (prevDocument && prevDocument.loaded && prevDocument === ArticleManager.currentDocument) {
        prevDocument.articles[ArticleManager.currentArticlePosition.index - 1].setMaxPageSize(maxSize);
        pages = prevDocument.articles[ArticleManager.currentArticlePosition.index - 1].getPages(startIndex, -startIndex);
      }
      else if (prevDocument && prevDocument.loaded && prevDocument.articles[prevDocument.articles.length - 1].paginationComplete) {
        pages = prevDocument.articles[prevDocument.articles.length - 1].getPages(startIndex, -startIndex);
      }
      else {
        // Previous article isn't there or isn't ready
        for (i = 0, len = -startIndex; i < len; i += 1) {
          // Don't show loading page, looks weird in the UI and we're not loading
          pages[i] = null;
        }
      }

      missingPageCount = pageCount + startIndex;
      startIndex = 0;
    }
    else {
      missingPageCount = pageCount;
    }

    // Fetch the other pages
    if (ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index]) {
      pages = pages.concat(ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index].
          getPages(startIndex, missingPageCount));
    }

    missingPageCount = pageCount - pages.length;

    // Do we need to get pages from the next document or article?
    if (missingPageCount) {
      nextDocument = ArticleManager.nextArticle(true);

      // The next article could either be in this document (a document with more than one article), or in the next document
      if (nextDocument && nextDocument === ArticleManager.currentDocument) {
        nextDocument.articles[ArticleManager.currentArticlePosition.index + 1].setMaxPageSize(maxSize);
        pages = pages.concat(nextDocument.articles[ArticleManager.currentArticlePosition.index + 1].getPages(0, missingPageCount));
      }
      else if (nextDocument) {
        if (!nextDocument.loaded) {
          nextDocument.load();
          pages.length = pageCount;
        }
        else {
          nextDocument.articles[0].setMaxPageSize(maxSize);
          pages = pages.concat(nextDocument.articles[0].getPages(0, missingPageCount));
        }
      }
      else {
        // No next article = leave blank
      }
    }

    // Use pages.length, not page count to avoid placing a loading page when
    // there isn't a next article
    for (i = buffer, len = pages.length; i < len; i += 1) {
      if (!pages[i]) {
        if (!ArticleManager.currentDocument.error) {
          pages[i] = ArticleManager._createLoadingPage();
        }
        else {
          pages[i] = ArticleManager._createErrorPage();
        }
      }
    }

    // Set our position if we don't have one
    if (!ArticleManager.currentPosition ||
        ArticleManager.currentPosition === treesaver.layout.ContentPosition.END) {
      // Loading/error pages don't have markers
      if (pages[buffer] && pages[buffer].begin) {
        ArticleManager.currentPosition = pages[buffer].begin;
      }
    }

    if (ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index] && !ArticleManager.currentPageWidth) {
      // Set only if it's a real page
      ArticleManager.currentPageWidth =
        ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index].getPageWidth();
    }

    // Clone any duplicates so we always have unique nodes
    for (i = 0; i < pages.length; i += 1) {
      for (j = i + 1; j < pages.length; j += 1) {
        if (pages[i] && pages[i] === pages[j]) {
          pages[j] = pages[i].clone();
        }
      }
    }

    return pages;
  };

  /**
   * Return the URL to the current article
   * @return {string}
   */
  ArticleManager.getCurrentUrl = function() {
    return ArticleManager.currentDocument.url;
  };

  /**
   * Returns the current document
   * @return {treesaver.ui.Document}
   */
  ArticleManager.getCurrentDocument = function() {
    return ArticleManager.currentDocument;
  };

  /**
   * Get the page number (1-based) of the current page
   * @return {number}
   */
  ArticleManager.getCurrentPageNumber = function() {
    return (ArticleManager.currentPageIndex + 1) || 1;
  };

  /**
   * Get the number of pages in the current article
   * @return {number}
   */
  ArticleManager.getCurrentPageCount = function() {
    if (!ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index] ||
        ArticleManager.currentArticlePosition === ArticlePosition.END) {
      return 1;
    }
    else {
      return ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index].pageCount || 1;
    }
  };

  /**
   * Return the document number (1-based) of the current document.
   * @return {number}
   */
  ArticleManager.getCurrentDocumentNumber = function() {
    return (ArticleManager.currentDocumentIndex + 1) || 1;
  };

  /**
   * Return the number of documents in the index.
   * @return {number}
   */
  ArticleManager.getDocumentCount = function() {
    return ArticleManager.index.getNumberOfDocuments();
  };

  /**
   * Get the number of pages in the current article
   * @return {number}
   */
  ArticleManager.getCurrentPageWidth = function() {
    return ArticleManager.currentPageWidth;
  };

  /**
   * Get the figure that corresponds to the given element in the current
   * article
   *
   * @param {!Element} el
   * @return {?treesaver.layout.Figure}
   */
  ArticleManager.getFigure = function(el) {
    var figureIndex = parseInt(el.getAttribute('data-figureindex'), 10);

    if (isNaN(figureIndex)) {
      return null;
    }

    // TODO: Refactor this
    return ArticleManager.currentDocument.articles[ArticleManager.currentArticlePosition.index].content.figures[figureIndex];
  };

  /**
   * Redirects the browser to the URL for the given document
   * @private
   * @param {!treesaver.ui.Document} doc
   */
  ArticleManager.redirectToDocument = function(doc) {
    if (network.isOnline()) {
      document.location = doc.url;
    }
    else {
      debug.error('Tried to redirect to a document while offline');
    }
  };

  /**
   * @param {!treesaver.ui.Document} doc The document to set as current. Will be loaded if necessary.
   * @param {!treesaver.ui.ArticlePosition} articlePosition The article position within the document. Can be used to set the last article of a document as current, or jump to a specific article within a document.
   * @param {?treesaver.layout.ContentPosition} pos The position within an article.
   * @param {?number} index The index at which the document should be placed.
   * @param {boolean=} noHistory Whether to modify the history or not.
   */
  ArticleManager.setCurrentDocument = function(doc, articlePosition, pos, index, noHistory) {
    var articleAnchor = null,
        url = null,
        path = null,
        article;

    if (!doc) {
      return false;
    }

    articleAnchor = doc.getArticleAnchor(articlePosition && articlePosition.index || 0) || articlePosition.isAnchor() && articlePosition.anchor;
    url = doc.url + (articleAnchor ? '#' + articleAnchor : '');
    path = doc.path + (articleAnchor ? '#' + articleAnchor : '');

    if (doc.equals(ArticleManager.currentDocument) &&
        index !== ArticleManager.currentDocumentIndex &&
        !ArticleManager.currentArticlePosition.equals(articlePosition)) {
      // Same document, but different article
      article = ArticleManager.currentDocument.getArticle(articlePosition.index);

      // Update the article position & article
      ArticleManager.currentArticle = article;
      ArticleManager.currentArticlePosition = articlePosition;

      ArticleManager._setPosition(pos);
      ArticleManager.currentPageIndex = -1;

      // Update the browser URL, but only if we are supposed to
      if (!noHistory) {
        treesaver.history.pushState({
          index: index,
          url: url,
          position: pos
        }, doc.meta['title'], path);
      }
      else {
        treesaver.history.replaceState({
          index: index,
          url: url,
          position: pos
        }, doc.meta['title'], path);
      }

      // Fire the ARTICLECHANGED event
      events.fireEvent(document, ArticleManager.events.PAGESCHANGED);
      events.fireEvent(document, ArticleManager.events.ARTICLECHANGED, {
        'article': article
      });
      return true;
    }

    document.title = doc.meta['title'] || doc.title;

    ArticleManager.currentDocument = doc;
    ArticleManager._setPosition(pos);
    // Changing document/article always changes the current page index
    ArticleManager.currentPageIndex = -1;
    ArticleManager.currentArticlePosition = articlePosition;
    ArticleManager.currentArticle = ArticleManager.currentDocument.getArticle(articlePosition && articlePosition.index || 0);

    if (!doc.loaded) {
      doc.load();
    }
    else if (doc.error) {
      if (capabilities.IS_NATIVE_APP) {
        // Article did not load correctly, can happen due to long wait on 3G
        // or even being offline
        // for now, ignore
      }
      else {
        ArticleManager.redirectToDocument(doc);
      }
    }

    if (index || index === 0) {
      ArticleManager.currentDocumentIndex = index;
    }
    else {
      ArticleManager.currentDocumentIndex = ArticleManager.index.getDocumentIndex(doc);
    }

    // Update the browser URL, but only if we are supposed to
    if (!noHistory) {
      treesaver.history.pushState({
        index: index,
        url: url,
        position: pos
      }, doc.meta['title'] || '', path);
    }
    else {
      treesaver.history.replaceState({
        index: index,
        url: url,
        position: pos
      }, doc.meta['title'] || '', path);
    }

    // Fire events
    events.fireEvent(document, ArticleManager.events.PAGESCHANGED);
    events.fireEvent(document, ArticleManager.events.DOCUMENTCHANGED, {
      'document': doc,
      'url': url,
      'path': path
    });
    events.fireEvent(document, ArticleManager.events.ARTICLECHANGED, {
      'article': ArticleManager.currentArticle
    });

    return true;
  };

  /**
   * @private
   * @param {treesaver.layout.ContentPosition} position
   */
  ArticleManager._setPosition = function(position) {
    if (ArticleManager.currentPosition === position) {
      // Ignore spurious
      return;
    }

    ArticleManager.currentPosition = position;
    // TODO: Automatically query?
    ArticleManager.currentPageIndex = -1;
  };

  /**
   * Generate a loading page
   * @private
   * @return {treesaver.layout.Page}
   */
  ArticleManager._createLoadingPage = function() {
    // Constuct a mock loading page
    // TODO: Make this size reasonably
    return /** @type {treesaver.layout.Page} */ ({
      activate: treesaver.layout.Page.prototype.activate,
      deactivate: treesaver.layout.Page.prototype.deactivate,
      html: ArticleManager.loadingPageHTML,
      size: ArticleManager.loadingPageSize
    });
  };

  /**
   * Generate an error page
   * @private
   * @return {treesaver.layout.Page}
   */
  ArticleManager._createErrorPage = function() {
    // Constuct a mock loading page
    // TODO: Make this size reasonably
    return /** @type {treesaver.layout.Page} */ ({
      activate: treesaver.layout.Page.prototype.activate,
      deactivate: treesaver.layout.Page.prototype.deactivate,
      html: ArticleManager.errorPageHTML,
      size: ArticleManager.errorPageSize
    });
  };

  // Expose functions
  goog.exportSymbol('treesaver.canGoToNextPage', ArticleManager.canGoToNextPage);
  goog.exportSymbol('treesaver.canGoToPreviousPage', ArticleManager.canGoToPreviousPage);
  goog.exportSymbol('treesaver.canGoToNextDocument', ArticleManager.canGoToNextDocument);
  goog.exportSymbol('treesaver.canGoToPreviousDocument', ArticleManager.canGoToPreviousDocument);
  goog.exportSymbol('treesaver.getCurrentUrl', ArticleManager.getCurrentUrl);
  goog.exportSymbol('treesaver.getCurrentPageNumber', ArticleManager.getCurrentPageNumber);
  goog.exportSymbol('treesaver.getCurrentPageCount', ArticleManager.getCurrentPageCount);
  goog.exportSymbol('treesaver.getCurrentDocumentNumber', ArticleManager.getCurrentDocumentNumber);
  goog.exportSymbol('treesaver.getCurrentDocument', ArticleManager.getCurrentDocument);
  goog.exportSymbol('treesaver.getDocumentCount', ArticleManager.getDocumentCount);
  goog.exportSymbol('treesaver.goToDocumentByURL', ArticleManager.goToDocumentByURL);
});

// Input 39
/**
 * @fileoverview The chrome class.
 */

goog.provide('treesaver.ui.Chrome');

goog.require('treesaver.array');
goog.require('treesaver.capabilities');
goog.require('treesaver.debug');
goog.require('treesaver.dimensions');
goog.require('treesaver.dom');
goog.require('treesaver.events');
goog.require('treesaver.network');
goog.require('treesaver.scheduler');
goog.require('treesaver.template');
goog.require('treesaver.ui.ArticleManager');
goog.require('treesaver.ui.Document');
goog.require('treesaver.ui.Index');
goog.require('treesaver.ui.Scrollable');

goog.scope(function() {
  var debug = treesaver.debug,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom,
      Scrollable = treesaver.ui.Scrollable;

  /**
   * Chrome
   * @param {!Element} node HTML node.
   * @constructor
   */
  treesaver.ui.Chrome = function(node) {
    // DEBUG-only validation checks
    if (goog.DEBUG) {
      if (!dom.querySelectorAll('.viewer', node).length) {
        debug.error('Chrome does not have a viewer');
      }

      if (node.parentNode.childNodes.length !== 1) {
        debug.error('Chrome is not only child in container');
      }
    }

    // TODO: Only store mutable capabilities
    this.requirements = dom.hasAttr(node, 'data-requires') ?
      node.getAttribute('data-requires').split(' ') : null;

    // Create DOM infrastructure for scrolling elements
    Scrollable.initDomTree(node);

    // Save out the HTML now that the DOM is prepped
    this.html = node.parentNode.innerHTML;

    // Measure the chrome
    this.size = new dimensions.Metrics(node);

    // Clean up metrics object
    delete this.size.w;
    delete this.size.h;
  };
});

goog.scope(function() {
  var Chrome = treesaver.ui.Chrome,
      Document = treesaver.ui.Document,
      array = treesaver.array,
      capabilities = treesaver.capabilities,
      debug = treesaver.debug,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom,
      events = treesaver.events,
      network = treesaver.network,
      scheduler = treesaver.scheduler,
      ArticleManager = treesaver.ui.ArticleManager,
      Index = treesaver.ui.Index,
      Scrollable = treesaver.ui.Scrollable;

  /**
   * List of required capabilities for this Chrome
   *
   * @type {?Array.<string>}
   */
  Chrome.prototype.requirements;

  /**
   * @type {?Element}
   */
  Chrome.prototype.node;

  /**
   * @type {string}
   */
  Chrome.prototype.html;

  /**
   * The measurements of the chrome
   * @type {!treesaver.dimensions.Metrics}
   */
  Chrome.prototype.size;

  /**
   * The area available to pages (i.e. the size of the viewer)
   * @type {?treesaver.dimensions.Size}
   */
  Chrome.prototype.pageArea;

  /**
   * @type {number}
   */
  Chrome.prototype.pageOffset;

  /**
   * @type {number|undefined}
   */
  Chrome.prototype.pageShift_;

  /**
   * @type {boolean}
   */
  Chrome.prototype.active;

  /**
   * Cached reference to viewer DOM
   * @type {?Element}
   */
  Chrome.prototype.viewer;

  /**
   * Cached reference to page width DOM
   * @type {?Array.<Element>}
   */
  Chrome.prototype.pageWidth;

  /**
   * @type {?Array.<treesaver.layout.Page>}
   */
  Chrome.prototype.pages;

  /**
   * Whether the UI is current in active state
   * @type {boolean}
   */
  Chrome.prototype.uiActive;

  /**
   * Cached references to the menu TOC
   * @type {?Array.<Element>}
   */
  Chrome.prototype.menus;

  /**
   * @type {boolean}
   */
  Chrome.prototype.lightBoxActive;

  /**
   * @type {?treesaver.ui.LightBox}
   */
  Chrome.prototype.lightBox;

  /**
   * @type {?Array.<Element>}
   */
  Chrome.prototype.sidebars;

  /**
   * Cached reference to the next page DOM
   * @type {?Array.<Element>}
   */
  Chrome.prototype.nextPage;

  /**
   * Cached reference to the next article DOM
   * @type {?Array.<Element>}
   */
  Chrome.prototype.nextArticle;

  /**
   * Cached reference to the previous page DOM
   * @type {?Array.<Element>}
   */
  Chrome.prototype.prevPage;

  /**
   * Cached reference to the previous article DOM
   * @type {?Array.<Element>}
   */
  Chrome.prototype.prevArticle;

  /**
   * Cached references to the position templates elements
   * @type {?Array.<Element>}
   */
  Chrome.prototype.positionElements;

  /**
   * Cached reference to the original position templates
   * @type {?Array.<string>}
   */
  Chrome.prototype.positionTemplates;

  /**
   * Cached references to the index templates elements
   * @type {?Array.<Element>}
   */
  Chrome.prototype.indexElements;

  /**
   * Cached reference to the original index templates
   * @type {?Array.<string>}
   */
  Chrome.prototype.indexTemplates;

  /**
   * Cached references to the current-document template elements
   * @type {?Array.<Element>}
   */
  Chrome.prototype.currentDocumentElements;

  /**
   * Cached reference to the original current-document templates
   * @type {?Array.<string>}
   */
  Chrome.prototype.currentDocumentTemplates;

  /**
   * Cached references to the publication template elements
   * @type {?Array.<Element>}
   */
  Chrome.prototype.publicationElements;

  /**
   * Cached reference to the original publication templates
   * @type {?Array.<string>}
   */
  Chrome.prototype.publicationTemplates;

  /**
   * @return {!Element} The activated node.
   */
  Chrome.prototype.activate = function() {
    if (!this.active) {
      this.active = true;

      this.node = dom.createElementFromHTML(this.html);
      // Store references to the portions of the UI we must update
      this.viewer = dom.querySelectorAll('.viewer', this.node)[0];
      this.pageWidth = dom.querySelectorAll('.pagewidth', this.node);
      this.nextPage = dom.querySelectorAll('.next', this.node);
      this.nextArticle = dom.querySelectorAll('.nextArticle', this.node);
      this.prevPage = dom.querySelectorAll('.prev', this.node);
      this.prevArticle = dom.querySelectorAll('.prevArticle', this.node);

      this.positionElements = [];
      this.positionTemplates = [];
      this.indexElements = [];
      this.indexTemplates = [];
      this.currentDocumentElements = [];
      this.currentDocumentTemplates = [];
      this.publicationElements = [];
      this.publicationTemplates = [];

      dom.querySelectorAll('[' + dom.customAttributePrefix + 'template]', this.node).forEach(function(el) {
        var template_name = dom.getCustomAttr(el, 'template'),
            elementArray, templateArray, newEl;

        switch (template_name) {
        case 'position':
          elementArray = this.positionElements;
          templateArray = this.positionTemplates;
          break;
        case 'index':
          elementArray = this.indexElements;
          templateArray = this.indexTemplates;
          break;
        case 'currentdocument':
          elementArray = this.currentDocumentElements;
          templateArray = this.currentDocumentTemplates;
          break;
        case 'publication':
          elementArray = this.publicationElements;
          templateArray = this.publicationTemplates;
          break;
        default: // Unknown template
          return;
        }

        // Add
        templateArray.push(el.innerHTML);

        if (el.nodeName.toLowerCase() === 'script') {
          newEl = document.createElement('div');
          el.parentNode.replaceChild(newEl, el);
          el = newEl;
        }
        elementArray.push(el);
      }, this);

      this.menus = dom.querySelectorAll('.menu', this.node);
      this.sidebars = dom.querySelectorAll('.sidebar', this.node);

      this.pages = [];

      // Setup event handlers
      Chrome.watchedEvents.forEach(function(evt) {
        events.addListener(document, evt, this);
      }, this);

      // Always start off active
      this.uiActive = false; // Set to false to force event firing
      this.setUiActive_();
    }

    return /** @type {!Element} */ (this.node);
  };

  /**
   * Deactivate the chrome
   */
  Chrome.prototype.deactivate = function() {
    if (!this.active) {
      return;
    }

    this.stopDelayedFunctions();
    this.active = false;

    // Remove event handlers
    Chrome.watchedEvents.forEach(function(evt) {
      events.removeListener(document, evt, this);
    }, this);

    // Make sure to drop references
    this.node = null;
    this.viewer = null;
    this.pageWidth = null;
    this.menus = null;
    this.sidebars = null;
    this.nextPage = null;
    this.nextArticle = null;
    this.prevPage = null;
    this.prevArticle = null;
    this.positionElements = null;
    this.positionTemplates = null;
    this.indexElements = null;
    this.indexTemplates = null;
    this.currentDocumentElements = null;
    this.currentDocumentTemplates = null;
    this.publicationElements = null;
    this.publicationTemplates = null;

    // Deactivate pages
    this.pages.forEach(function(page) {
      if (page) {
        page.deactivate();
      }
    });
    this.pages = null;
    this.pageArea = null;

    // Clear out tasks
    scheduler.clear('idletimer');
    scheduler.clear('updateTOC');
    this.stopDelayedFunctions();
  };

  /**
   * Stop any delayed functions
   * @private
   */
  Chrome.prototype.stopDelayedFunctions = function() {
    scheduler.clear('selectPages');
    scheduler.clear('animatePages');
  };

  /**
   * Events fired by Chrome objects
   *
   * @const
   * @type {!Object.<string, string>}
   */
  Chrome.events = {
    ACTIVE: 'treesaver.active',
    IDLE: 'treesaver.idle',
    SIDEBARACTIVE: 'treesaver.sidebaractive',
    SIDEBARINACTIVE: 'treesaver.sidebarinactive'
  };

  /**
   * @type {Array.<string>}
   */
  Chrome.watchedEvents = [
    Index.events.UPDATED,
    ArticleManager.events.PAGESCHANGED,
    ArticleManager.events.DOCUMENTCHANGED,
    'keydown',
    'click',
    'mousewheel',
    'DOMMouseScroll'
  ];

  // Add touch events only if the browser supports touch
  if (capabilities.SUPPORTS_TOUCH) {
    // Note that we hook up all the event handlers immediately,
    // instead of waiting to do so during touchstart. This is
    // because removing the touch handlers causes Android 2.1
    // to stop sending all touch events
    Chrome.watchedEvents.push('touchstart', 'touchmove', 'touchend', 'touchcancel');
  }
  else {
    // Used for activity detection
    Chrome.watchedEvents.push('mouseover');
    // TODO: Move mousewheel in here as well?
  }

  /**
   * Event dispatcher for all events
   * @param {Event} e
   */
  Chrome.prototype['handleEvent'] = function(e) {
    switch (e.type) {
    // Both these events mean that the pages we are displaying
    // (or trying to display) may have changed. Make sure to
    // fetch them again
    // Article changed and TOC changed will affect nav indicators
    case ArticleManager.events.PAGESCHANGED:
      return this.selectPagesDelayed();

    case Index.events.UPDATED:
      this.updateTOCDelayed();
      return this.selectPagesDelayed();

    case ArticleManager.events.DOCUMENTCHANGED:
      this.updateTOCActive();
      this.updatePosition();
      return;

    case 'mouseover':
      return this.mouseOver(e);

    case 'touchstart':
      return this.touchStart(e);

    case 'touchmove':
      return this.touchMove(e);

    case 'touchend':
      return this.touchEnd(e);

    case 'touchcancel':
      return this.touchCancel(e);

    case 'keydown':
      return this.keyDown(e);

    case 'click':
      return this.click(e);

    case 'mousewheel':
    case 'DOMMouseScroll':
      return this.mouseWheel(e);
    }
  };

  /**
   * Whether one of the control/shift/alt/etc keys were pressed at the time
   * of the event
   *
   * @private
   * @param {!Event} e
   * @return {boolean} True if at least one of those keys was pressed.
   */
  Chrome.specialKeyPressed_ = function(e) {
    return e.ctrlKey || e.shiftKey || e.altKey || e.metaKey;
  };

  /**
   * Handle keyboard events
   * @param {!Event} e
   */
  Chrome.prototype.keyDown = function(e) {
    // Lightbox active? Hide it
    if (this.lightBoxActive) {
      this.hideLightBox();

      // Stop default actions and return early
      e.preventDefault();
      return;
    }

    // Ignore within forms
    if (/input|select|textarea/i.test(e.target.tagName)) {
      return;
    }

    // Don't override keyboard commands
    if (!Chrome.specialKeyPressed_(e)) {
      switch (e.keyCode) {
      case 34: // PageUp
      case 39: // Right && down
      case 40:
      case 74: // j
      case 32: // Space
        this.nextPage_();
        break;

      case 33: // PageDown
      case 37: // Left & up
      case 38:
      case 75: // k
        this.previousPage_();
        break;

      case 72: // h
        ArticleManager.previousArticle();
        break;

      case 76: // l
        ArticleManager.nextArticle();
        break;

      default: // Let the event through if not handled
        return;
      }

      // Handled key always causes UI idle
      this.setUiIdle_();

      // Key handled, don't want any default actions
      e.preventDefault();
    }
  };

  /**
   * Handle click event
   * @param {!Event} e
   */
  Chrome.prototype.click = function(e) {
    // Ignore if done with a modifier key (could be opening in new tab, etc)
    if (Chrome.specialKeyPressed_(e)) {
      return true;
    }

    // Ignore if it's not a left-click
    if ('which' in e && e.which !== 1 || e.button) {
      debug.info('Click ignored due to non-left click');

      return;
    }

    var el = Chrome.findTarget_(e.target),
        ancestor,
        url,
        withinCurrentPage = false,
        handled = false,
        withinSidebar = false,
        withinMenu = false,
        target = null,
        nearestSidebar = null;

    // Lightbox active? Hide it
    if (this.lightBoxActive) {
      // Check if click was within lighbox
      // TODO: FIXME
      if (this.lightBox.node.contains(el)) {
        if (el.nodeName === 'A') {
          ancestor = el;
        }
        else {
          ancestor = dom.getAncestor(el, 'A');
        }

        // Was it a link?
        if (ancestor && ancestor.href) {
          url = network.absoluteURL(ancestor.href);
          // Try to go to the article
          if (!ArticleManager.goToDocumentByURL(url)) {
            // The URL is not an article, let the navigation happen normally
            return;
          }
        }
      }

      // Close the lightbox no matter what
      this.hideLightBox();
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    // If there are any menus active and the event target
    // is contained within one, we deactive it and set
    // withinMenu to true.
    this.menus.forEach(function(menu) {
      if (this.isMenuActive(menu)) {
        withinMenu = menu.contains(el);
        this.menuInactive(menu);
      }
    }, this);

    withinSidebar = this.sidebars.some(function(sidebar) {
      return sidebar.contains(el);
    });

    if (!withinSidebar) {
      this.sidebars.forEach(function(sidebar) {
        this.sidebarInactive(sidebar);
      }, this);
    } else {
      if ((nearestSidebar = this.getNearestSidebar(el))) {
        if (dom.hasClass(nearestSidebar, 'sidebar') && dom.hasClass(nearestSidebar, 'close-on-click')) {
          this.sidebars.forEach(function(sidebar) {
            this.sidebarInactive(sidebar);
          }, this);
        }
      }
    }

    // Compiler cast
    el = /** @type {!Element} */ (el);

    // Check if the target is within one of the visible pages
    // TODO: Once we have variable numbers of pages, this code will
    // need to change
    if (this.pages[0] && this.pages[0].node.contains(el)) {
      this.previousPage_();

      handled = true;
    }
    else if (this.pages[2] && this.pages[2].node.contains(el)) {
      this.nextPage_();

      handled = true;
    }
    else {
      withinCurrentPage = this.pages[1] && this.pages[1].node.contains(el);

      // Go up the tree and see if there's anything we want to process
      while (!handled && el && el !== treesaver.tsContainer) {
        if (!withinCurrentPage) {
          if (dom.hasClass(el, 'prev')) {
            this.previousPage_();

            handled = true;
          }
          else if (dom.hasClass(el, 'next')) {
            this.nextPage_();

            handled = true;
          }
          else if (dom.hasClass(el, 'prevArticle')) {
            ArticleManager.previousArticle();

            handled = true;
          }
          else if (dom.hasClass(el, 'nextArticle')) {
            ArticleManager.nextArticle();

            handled = true;
          }
          else if (dom.hasClass(el, 'menu')) {
            if (!withinMenu) {
              this.menuActive(el);
            }
            handled = true;
          }
          else if (dom.hasClass(el, 'sidebar') ||
                  dom.hasClass(el, 'open-sidebar') ||
                  dom.hasClass(el, 'toggle-sidebar') ||
                  dom.hasClass(el, 'close-sidebar')) {

            if ((nearestSidebar = this.getNearestSidebar(el))) {
              if (dom.hasClass(el, 'sidebar') || dom.hasClass(el, 'open-sidebar')) {
                this.sidebarActive(nearestSidebar);
              }
              else if (dom.hasClass(el, 'toggle-sidebar')) {
                this.sidebarToggle(nearestSidebar);
              }
              else {
                this.sidebarInactive(nearestSidebar);
              }

              handled = true;
            }
          }
        }
        else if (dom.hasClass(el, 'zoomable')) {
          // Counts as handling the event only if showing is successful
          handled = this.showLightBox(el);
        }

        // Check links last since they may be used as UI commands as well
        // Links can occur in-page or in the chrome
        if (!handled && el.href) {
          target = el.getAttribute('target');
          url = network.absoluteURL(el.href);

          if (target === '_blank') {
            return;
          }
          // Lightbox-flagged elements are skipped as processing goes up the chain
          // if a zoomable is found on the way up the tree, it will be handled. If
          // not, the link is navigated as-is
          else if (target === 'ts-lightbox') {
            // Skip this element and process the parent zoomable
            el = /** @type {!Element} */ (el.parentNode);
            continue;
          }
          else if (ArticleManager.goToDocumentByURL(url)) {
            handled = true;
          }
          // Target is not blank a lightbox and it is not in the index.
          else if (target === 'ts-treesaver') {
            // Force processing the document as a Treesaver document by
            // adding it to the index.
            ArticleManager.index.appendChild(new Document(url));
            ArticleManager.index.update();
            if (ArticleManager.goToDocumentByURL(url)) {
              handled = true;
            }
          }
        }
        el = /** @type {!Element} */ (el.parentNode);
      }
    }

    if (handled) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  /**
   * The last time a mousewheel event was received
   *
   * @private
   * @type {number}
   */
  Chrome.prototype.lastMouseWheel_;

  /**
   * Handle the mousewheel event
   * @param {!Event} e
   */
  Chrome.prototype.mouseWheel = function(e) {
    if (Chrome.specialKeyPressed_(e)) {
      // Ignore if special key is down (user could be zooming)
      return true;
    }

    var target = Chrome.findTarget_(e.target);

    // Is the mousewheel within a scrolling element? If so, ignore
    if (this.isWithinScroller_(target)) {
      return true;
    }

    // Lightbox active? Hide it
    if (this.lightBoxActive) {
      this.hideLightBox();
      e.preventDefault();
      return;
    }

    var now = goog.now();

    if (this.lastMouseWheel_ &&
        (now - this.lastMouseWheel_ < MOUSE_WHEEL_INTERVAL)) {
      // Ignore if too frequent (magic mouse)
      return;
    }

    this.lastMouseWheel_ = now;

    // Firefox handles this differently than others
    // http://adomas.org/javascript-mouse-wheel/
    var delta = e.wheelDelta ? e.wheelDelta : e.detail ? -e.detail : 0,
        withinViewer = this.viewer.contains(Chrome.findTarget_(e.target));

    if (!delta || !withinViewer) {
      return;
    }

    // Handle the event
    e.preventDefault();
    e.stopPropagation();

    if (delta > 0) {
      this.previousPage_();
    }
    else {
      this.nextPage_();
    }

    // Mousewheel always deactivates UI
    this.setUiIdle_();
  };

  /**
   * Sanitize the event target, which can be a textNode in Safari
   *
   * @private
   * @param {?EventTarget} node
   * @return {!Element}
   */
  Chrome.findTarget_ = function(node) {
    if (!node) {
      node = treesaver.tsContainer;
    }
    else if (node.nodeType !== 1 && node.parentNode) {
      // Safari Bug that gives you textNode on events
      node = node.parentNode || treesaver.tsContainer;
    }

    // Cast for compiler
    return /** @type {!Element} */ (node);
  };

  /**
   * @private
   * @type {Object}
   */
  Chrome.prototype.touchData_;

  /**
   * Handle the touchstart event
   * @param {!Event} e
   */
  Chrome.prototype.touchStart = function(e) {
    var target = Chrome.findTarget_(e.target),
        scroller = this.isWithinScroller_(target),
        withinViewer, node, id,
        x, y, now;

    if (!treesaver.tsContainer.contains(Chrome.findTarget_(e.target))) {
      return;
    }

    // Do all the handling ourselves
    e.stopPropagation();
    e.preventDefault();

    // Lightbox active? Hide it only if it can't scroll
    if (this.lightBoxActive && !scroller) {
      this.hideLightBox();
      return;
    }

    // Ignore scrollers in prev/next page
    if (scroller) {
      node = scroller;
      while (node) {
        id = node.id;

        if (id === 'prevPage' || id === 'nextPage') {
          scroller = node = null;
          break;
        }

        node = node.parentNode;
      }
    }

    withinViewer = this.viewer.contains(target);

    x = e.touches[0].pageX;
    y = e.touches[0].pageY;
    now = goog.now();

    this.touchData_ = {
      startX: x,
      startY: y,
      startTime: now,
      lastX: x,
      lastY: y,
      lastTime: now,
      deltaX: 0,
      deltaY: 0,
      deltaTime: 0,
      totalX: 0,
      totalY: 0,
      totalTime: 0,
      touchCount: e.touches.length,
      withinViewer: withinViewer,
      originalOffset: this.pageOffset,
      scroller: scroller,
      canScrollHorizontally: scroller && Scrollable.canScrollHorizontally(scroller)
    };

    if (this.touchData_.touchCount === 2) {
      this.touchData_.startX2 = e.touches[1].pageX;
    }

    // Pause other work for better swipe performance
    scheduler.pause(['resumeTasks']);
  };

  /**
   * Handle the touchmove event
   * @param {!Event} e
   */
  Chrome.prototype.touchMove = function(e) {
    var touchData = this.touchData_,
        now, x, y;

    if (!touchData) {
      // No touch info, nothing to do
      return;
    }

    // Do all the handling ourselves
    e.stopPropagation();
    e.preventDefault();

    now = goog.now();
    x = e.touches[0].pageX;
    y = e.touches[0].pageY;

    touchData.deltaTime = touchData.lastMove - now;
    touchData.deltaX = x - touchData.lastX;
    touchData.deltaY = y - touchData.lastY;
    touchData.lastMove = now;
    touchData.lastX = e.touches[0].pageX;
    touchData.lastY = e.touches[0].pageY;
    touchData.totalTime += touchData.deltaTime;
    touchData.totalX += touchData.deltaX;
    touchData.totalY += touchData.deltaY;
    touchData.touchCount = Math.min(e.touches.length, touchData.touchCount);
    touchData.swipe =
      // One-finger only
      touchData.touchCount === 1 &&
      // Finger has to move far enough
      Math.abs(touchData.totalX) >= SWIPE_THRESHOLD &&
      // But not too vertical
      Math.abs(touchData.totalX) * 2 > Math.abs(touchData.totalY);

    if (touchData.scroller && (touchData.didScroll ||
        (touchData.canScrollHorizontally || !touchData.swipe))) {
      touchData.didScroll = touchData.didScroll || touchData.canScrollHorizontally ||
        Math.abs(touchData.totalY) >= SWIPE_THRESHOLD;
      Scrollable.setOffset(touchData.scroller, -touchData.deltaX, -touchData.deltaY);

      if (!touchData.withinViewer) {
        // Scrolling outside viewer means active, in case of long scroll
        this.setUiActive_();
      }
    }
    else if (touchData.touchCount === 2) {
      // Track second finger changes
      touchData.totalX2 = e.touches[1].pageX - touchData.startX2;
    }
    else {
      this.pageOffset = touchData.originalOffset + touchData.totalX;
      this._updatePagePositions(true);
    }
  };

  /**
   * Handle the touchend event
   * @param {!Event} e
   */
  Chrome.prototype.touchEnd = function(e) {
    // Hold onto a reference before clearing
    var touchData = this.touchData_,
        // Flag to track whether we need to reset positons, etc
        actionTaken = false,
        target = Chrome.findTarget_(e.target),
        // Lightbox is an honorary viewer
        withinViewer = this.lightBoxActive || this.viewer.contains(target);

    // Clear out touch data
    this.touchCancel(e);

    if (!touchData) {
      // No touch info, nothing to do
      return;
    }

    // Do all the handling ourselves
    e.stopPropagation();
    e.preventDefault();

    if (touchData.didScroll) {
      if (withinViewer) {
        // Scrolling in viewer means idle
        this.setUiIdle_();
      }
      else {
        // Scrolling within the chrome should keep UI active
        this.setUiActive_();
      }
    }
    else if (touchData.touchCount === 1) {
      // No move means we create a click
      if (!touchData.lastMove) {
        // TODO: Currently this code is OK since the IE browsers don't support
        // touch. However, perhaps Windows Phone 7 will and needs a fix with
        // IE7? Need to integrate this into treesaver.events
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, e.view, 1,
            e.changedTouches[0].screenX, e.changedTouches[0].screenY,
            e.changedTouches[0].clientX, e.changedTouches[0].clientY,
            e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);

        if (target.dispatchEvent(evt) && withinViewer) {
          // Event went unhandled, toggle active state
          this.toggleUiActive_();
        }
        else if (withinViewer) {
          // Handled event within viewer = idle
          this.setUiIdle_();
        }
        else {
          // Otherwise, active
          this.setUiActive_();
        }

        // Counts as handling
        actionTaken = true;
      }
      // Check for a swipe
      else if (touchData.swipe) {
        if (touchData.totalX > 0) {
          actionTaken = this.previousPage_();
        }
        else {
          actionTaken = this.nextPage_();
        }

        if (!actionTaken) {
          // Failed page turn = Show UI
          this.setUiActive_();
        }
        else {
          // Successful page turn = Hide UI
          this.setUiIdle_();
        }
      }
      else {
        // No swipe and no tap, do nothing
      }
    }
    else if (touchData.touchCount === 2) {
      // Two finger swipe in the same direction is next/previous article
      if (Math.abs(touchData.totalX2) >= SWIPE_THRESHOLD) {
        if (touchData.totalX < 0 && touchData.totalX2 < 0) {
          actionTaken = ArticleManager.nextArticle();
        }
        else if (touchData.totalX > 0 && touchData.totalX2 > 0) {
          actionTaken = ArticleManager.previousArticle();
        }

        if (!actionTaken) {
          // Failed article change = Show UI
          this.setUiActive_();
        }
        else {
          // Success = Hide UI
          this.setUiIdle_();
        }
      }
    }

    // Reset page position, if applicable
    if (!actionTaken) {
      this.animationStart = goog.now();
      this.pageOffset = 0;
      this._updatePagePositions();
    }
  };

  /**
   * Handle the touchcancel event
   * @param {!Event} e
   */
  Chrome.prototype.touchCancel = function(e) {
    // Let the tasks begin again (in a bit)
    scheduler.queue(scheduler.resume, [], 'resumeTasks');

    this.touchData_ = null;
  };

  /**
   * Desktop-only handler to make sure we don't hide UI when the user is trying
   * to use it
   * @param {!Event} e
   */
  Chrome.prototype.mouseOver = function(e) {
    // Don't do anything on touch devices
    if (!e.touches) {
      // Need to make sure UI is visible if a user is trying to click on it
      this.setUiActive_();
    }
  };

  /**
   * Checks if the element is within one of our scrollable elements
   * @private
   * @param {!Element} el
   * @return {?Element}
   */
  Chrome.prototype.isWithinScroller_ = function(el) {
    var node = el;

    while (node && node != document.documentElement) {
      if (dom.hasClass(node, 'scroll')) {
          return node;
      }
      node = /** @type {?Element} */ (node.parentNode);
    }

    return null;
  };

  /**
   * Go to the previous page
   *
   * @private
   */
  Chrome.prototype.previousPage_ = function() {
    if (ArticleManager.canGoToPreviousPage()) {
      // Adjust the offset immediately for animation
      this.layoutPages(-1);

      // Change the page in the article manager in a bit
      scheduler.delay(ArticleManager.previousPage, 50, [], 'prevPage');

      return true;
    }
  };

  /**
   * Go to the next page
   *
   * @private
   */
  Chrome.prototype.nextPage_ = function() {
    if (ArticleManager.canGoToNextPage()) {
      // Adjust the offset immediately for animation
      this.layoutPages(1);

      // Change the page in the article manager in a bit
      scheduler.delay(ArticleManager.nextPage, 50, [], 'nextPage');

      return true;
    }
  };

  /**
   * Show hidden UI controls
   * @private
   */
  Chrome.prototype.setUiActive_ = function() {
    // Don't fire events needlessly
    if (!this.uiActive) {
      this.uiActive = true;
      dom.addClass(/** @type {!Element} */ (this.node), 'active');

      events.fireEvent(document, Chrome.events.ACTIVE);
    }

    // Fire the idle event on a timer using debouncing, which delays
    // the function when receiving multiple calls
    scheduler.debounce(
      this.setUiIdle_,
      UI_IDLE_INTERVAL,
      null,
      false,
      'idletimer',
      this
    );
  };

  /**
   * Hide UI controls
   * @private
   */
  Chrome.prototype.setUiIdle_ = function() {
    // Don't fire events unless needed
    if (this.uiActive) {
      this.uiActive = false;
      dom.removeClass(/** @type {!Element} */ (this.node), 'active');

      events.fireEvent(document, Chrome.events.IDLE);
    }

    // Clear anything that might debounce
    scheduler.clear('idletimer');
  };

  /**
   * Toggle Active state
   * @private
   */
  Chrome.prototype.toggleUiActive_ = function() {
    if (!this.uiActive) {
      this.setUiActive_();
    }
    else {
      this.setUiIdle_();
    }
  };

  /**
   * Show menu
   */
  Chrome.prototype.menuActive = function(menu) {
    dom.addClass(/** @type {!Element} */ (menu), 'menu-active');
  };

  /**
   * Hide menu
   */
  Chrome.prototype.menuInactive = function(menu) {
    dom.removeClass(/** @type {!Element} */ (menu), 'menu-active');
  };

  /**
   * Returns the current state of the menu.
   */
  Chrome.prototype.isMenuActive = function(menu) {
    return dom.hasClass(/** @type {!Element} */ (menu), 'menu-active');
  };

  /**
   * Show sidebar
   */
  Chrome.prototype.sidebarActive = function(sidebar) {
    events.fireEvent(document, Chrome.events.SIDEBARACTIVE, {
      sidebar: sidebar
    });
    dom.addClass(/** @type {!Element} */ (sidebar), 'sidebar-active');
  };

  /**
   * Hide sidebar
   */
  Chrome.prototype.sidebarInactive = function(sidebar) {
    if (this.isSidebarActive(sidebar)) {
      events.fireEvent(document, Chrome.events.SIDEBARINACTIVE, {
        sidebar: sidebar
      });
    }
    dom.removeClass(/** @type {!Element} */ (sidebar), 'sidebar-active');
  };

  /**
   * Toggle sidebar state
   */
  Chrome.prototype.sidebarToggle = function(sidebar) {
    if (this.isSidebarActive(sidebar)) {
      this.sidebarInactive(sidebar);
    }
    else {
      this.sidebarActive(sidebar);
    }
  };

  /**
   * Determines whether or not the sidebar is active.
   *
   * @return {boolean} true if the sidebar is active, false otherwise.
   */
  Chrome.prototype.isSidebarActive = function(sidebar) {
    return dom.hasClass(/** @type {!Element} */ (sidebar), 'sidebar-active');
  };

  /**
   * Returns the nearest ancestor sidebar to the given element.
   * @return {?Element} The nearest ancestor sidebar or null.
   */
  Chrome.prototype.getNearestSidebar = function(el) {
    var parent = el;

    if (dom.hasClass(parent, 'sidebar')) {
      return parent;
    }

    while ((parent = parent.parentNode) !== null && parent.nodeType === 1) {
      if (dom.hasClass(parent, 'sidebar')) {
        return parent;
      }
    }
    return null;
  };

  /**
   * Show lightbox
   *
   * @private
   * @param {!Element} el
   * @return {boolean} True if content can be shown.
   */
  Chrome.prototype.showLightBox = function(el) {
    var figure = ArticleManager.getFigure(el);

    if (!figure) {
      return false;
    }

    // Hide toolbars, etc when showing lightbox
    this.setUiIdle_();

    if (!this.lightBoxActive) {
      this.lightBox = treesaver.ui.StateManager.getLightBox();
      if (!this.lightBox) {
        // No lightbox, nothing to show
        return false;
      }

      this.lightBoxActive = true;
      this.lightBox.activate();
      // Lightbox is a sibling of the chrome root
      this.node.parentNode.appendChild(this.lightBox.node);
    }

    // Closure compiler cast
    this.lightBox.node = /** @type {!Element} */ (this.lightBox.node);

    // Cover entire chrome with the lightbox
    dimensions.setCssPx(this.lightBox.node, 'width', dimensions.getOffsetWidth(this.node));
    dimensions.setCssPx(this.lightBox.node, 'height', dimensions.getOffsetHeight(this.node));

    if (!this.lightBox.showFigure(figure)) {
      // Showing failed
      this.hideLightBox();
      return false;
    }

    // Successfully showed the figure
    return true;
  };

  /**
   * Dismiss lightbox
   *
   * @private
   */
  Chrome.prototype.hideLightBox = function() {
    if (this.lightBoxActive) {
      this.lightBoxActive = false;
      this.node.parentNode.removeChild(this.lightBox.node);
      this.lightBox.deactivate();
      this.lightBox = null;
    }
  };

  /**
   * @return {boolean} True if the Chrome meets current browser capabilities.
   */
  Chrome.prototype.meetsRequirements = function() {
    if (!this.requirements) {
      return true;
    }

    return capabilities.check(this.requirements, true);
  };

  /**
   * @param {treesaver.dimensions.Size} availSize
   * @return {boolean} True if fits.
   */
  Chrome.prototype.fits = function(availSize) {
    return dimensions.inSizeRange(this.size, availSize);
  };

  /**
   * @private
   */
  Chrome.prototype.calculatePageArea = function() {
    if (goog.DEBUG) {
      if (!this.viewer) {
        debug.error('No viewer in chrome');
      }
    }

    this.pageArea = {
      w: dimensions.getOffsetWidth(this.viewer),
      h: dimensions.getOffsetHeight(this.viewer)
    };
  };

  /**
   * Sets the size of the chrome
   * @param {treesaver.dimensions.Size} availSize
   */
  Chrome.prototype.setSize = function(availSize) {
    dimensions.setCssPx(/** @type {!Element} */ (this.node), 'width', availSize.w);
    dimensions.setCssPx(/** @type {!Element} */ (this.node), 'height', availSize.h);

    // Clear out previous value
    this.pageArea = null;

    // Update to our new page area
    this.calculatePageArea();

    if (ArticleManager.currentDocument) {
      // Re-query for pages later
      this.selectPagesDelayed();
      this.updateTOCDelayed();
    }
  };

  /**
   * Update the TOC's 'current' class.
   *
   * @private
   */
  Chrome.prototype.updateTOCActive = function() {
    var currentUrl = ArticleManager.getCurrentUrl();

    this.indexElements.forEach(function(el) {
      var anchors = dom.querySelectorAll('a[href]', el).filter(function(a) {
            // The anchors in the TOC may be relative URLs so we need to create absolute
            // ones when comparing to the currentUrl, which is always absolute.
            return network.absoluteURL(a.href) === currentUrl;
          }),
          children = [];

      if (anchors.length) {
        children = array.toArray(el.children);

        children.forEach(function(c) {
          var containsUrl = anchors.some(function(a) {
              return c.contains(a);
              });

          if (containsUrl) {
            dom.addClass(c, 'current');
          }
          else {
            dom.removeClass(c, 'current');
          }
        });
      }
    });
  };

  Chrome.prototype.updatePosition = function() {
    this.positionElements.forEach(function(el, i) {
      var template = this.positionTemplates[i];

      treesaver.template.expand(el, template, {
        'pagenumber': ArticleManager.getCurrentPageNumber(),
        'pagecount': ArticleManager.getCurrentPageCount(),
        'url': ArticleManager.getCurrentUrl(),
        'documentnumber': ArticleManager.getCurrentDocumentNumber(),
        'documentcount': ArticleManager.getDocumentCount()
      });
    }, this);
  };

  Chrome.prototype.updatePublication = function() {
    this.publicationElements.forEach(function(el, i) {
      var template = this.publicationTemplates[i];

      treesaver.template.expand(el, template, ArticleManager.index.meta);
    }, this);
  };

  Chrome.prototype.updateCurrentDocument = function() {
    this.currentDocumentElements.forEach(function(el, i) {
      var template = this.currentDocumentTemplates[i];

      treesaver.template.expand(el, template, ArticleManager.getCurrentDocument().meta);
    }, this);
  };

  /**
   * Update the width of elements bound to the page width
   * @private
   */
  Chrome.prototype.updatePageWidth = function(width) {
    if (width) {
      this.pageWidth.forEach(function(el) {
        dimensions.setCssPx(el, 'width', width);
      }, this);
    }
  };

  /**
   * Set the element state to enabled or disabled. If the element
   * is a button its disabled attribute will be set to true. Otherwise
   * the element will receive a class="disabled".
   *
   * @private
   * @param {!Element} el The element to set the state for.
   * @param {!boolean} enable True to enable the element, false to disable it.
   */
  Chrome.prototype.setElementState = function(el, enable) {
    if (el.nodeName === 'BUTTON') {
      el.disabled = !enable;
    }
    else {
      if (enable) {
        dom.removeClass(el, 'disabled');
      }
      else {
        dom.addClass(el, 'disabled');
      }
    }
  };

  /**
   * Update the state of the next page elements.
   * @private
   */
  Chrome.prototype.updateNextPageState = function() {
    if (this.nextPage) {
      var canGoToNextPage = ArticleManager.canGoToNextPage();

      this.nextPage.forEach(function(el) {
        this.setElementState(el, canGoToNextPage);
      }, this);
    }
  };

  /**
   * Update the state of the next article elements.
   * @private
   */
  Chrome.prototype.updateNextArticleState = function() {
    if (this.nextArticle) {
      var canGoToNextArticle = ArticleManager.canGoToNextArticle();

      this.nextArticle.forEach(function(el) {
        this.setElementState(el, canGoToNextArticle);
      }, this);
    }
  };

  /**
   * Update the state of the previous page elements.
   * @private
   */
  Chrome.prototype.updatePreviousPageState = function() {
    if (this.prevPage) {
      var canGoToPreviousPage = ArticleManager.canGoToPreviousPage();

      this.prevPage.forEach(function(el) {
        this.setElementState(el, canGoToPreviousPage);
      }, this);
    }
  };

  /**
   * Update the state of the previous article elements.
   * @private
   */
  Chrome.prototype.updatePreviousArticleState = function() {
    if (this.prevArticle) {
      var canGoToPreviousArticle = ArticleManager.canGoToPreviousArticle();

      this.prevArticle.forEach(function(el) {
        this.setElementState(el, canGoToPreviousArticle);
      }, this);
    }
  };

  /**
   * Run selectPages on a delay
   * @private
   */
  Chrome.prototype.selectPagesDelayed = function() {
    scheduler.queue(this.selectPages, [], 'selectPages', this);
  };

  /**
   * Run updateTOC on a delay
   * @private
   */
  Chrome.prototype.updateTOCDelayed = function() {
    scheduler.queue(this.updateTOC, [], 'updateTOC', this);
  };

  /**
   * Manages the page objects needed in order to display content,
   * including DOM insertion
   * @private
   */
  Chrome.prototype.selectPages = function() {
    this.stopDelayedFunctions();

    // Populate the pages
    this.populatePages();

    // Call layout even if pages didn't change since viewport size
    // can affect page positioning
    this.layoutPages();

    // Update our field display in the chrome (page count/index changes)
    this.updatePosition();
    this.updateCurrentDocument();
    this.updatePublication();
    this.updatePageWidth(ArticleManager.getCurrentPageWidth());

    // Update the previous/next buttons depending on the current state
    this.updateNextPageState();
    this.updateNextArticleState();
    this.updatePreviousPageState();
    this.updatePreviousArticleState();
  };

  /**
   * Manages the TOC.
   * @private
   */
  Chrome.prototype.updateTOC = function() {
    // Stop any running TOC updates
    scheduler.clear('updateTOC');

    var toc = {
      'contents': ArticleManager.index.contents.map(function(child) {
        return child.meta;
      })
    };

    this.indexElements.forEach(function(el, i) {
      var template = this.indexTemplates[i];

      treesaver.template.expand(el, template, toc);
    }, this);

    this.updateTOCActive();
  };

  /**
   * Populates the pages array for layout
   *
   * @private
   */
  Chrome.prototype.populatePages = function() {
    var old_pages = this.pages;

    // TODO: Master page width?
    this.pages = ArticleManager.getPages(/** @type {!treesaver.dimensions.Size} */ (this.pageArea), 1);

    old_pages.forEach(function(page) {
      // Only deactivate pages we're not about to use again
      if (page) {
        var node = page.node;
        if (this.pages.indexOf(page) === -1) {
          // Deactivate before disconnecting from DOM tree
          page.deactivate();

          if (node && node.parentNode === this.viewer) {
            this.viewer.removeChild(node);
          }
        }
      }
    }, this);

    this.pages.forEach(function(page, i) {
      if (page) {
        var node = page.node || page.activate();

        // Is it in the viewer already?
        if (!node.parentNode) {
          // Insert into the tree, but make sure we display in the correct order
          this.viewer.appendChild(node);
        }

        node.setAttribute('id',
          i === 0 ? 'previousPage' : i === 1 ? 'currentPage' : 'nextPage');
      }
    }, this);
  };

  /**
   * Positions the current visible pages
   * @param {number=} pageShift
   */
  Chrome.prototype.layoutPages = function(pageShift) {
    // For now, hard coded to show up to three pages, in the prev/current/next
    // configuration
    //
    // Note, that a page may be null, and won't have a corresponding DOM entry
    // (later, it might have a loading/placeholder page)
    var prevPage = this.pages[0],
        currentPage = this.pages[1],
        nextPage = this.pages[2],
        leftMargin, rightMargin,
        halfPageWidth = currentPage.size.outerW / 2,
        oldOffset = this.pageOffset;

    // Ignore redundant updates
    if (this.pageShift_ && pageShift === this.pageShift_) {
      return;
    }

    this.pageShift_ = pageShift;

    // Register the positions of each page
    // The main page is dead centered via CSS absolute positioning, so no work
    // needs to be done
    this.pagePositions = [0, 0, 0];

    if (prevPage) {
      leftMargin = Math.max(currentPage.size.marginLeft, prevPage.size.marginRight);
      // Positioned to the left of the main page
      this.pagePositions[0] = -(halfPageWidth + leftMargin + prevPage.size.outerW / 2);
    }

    if (nextPage) {
      rightMargin = Math.max(currentPage.size.marginRight, nextPage.size.marginLeft);
      // Positioned to the right of the main page
      this.pagePositions[2] = halfPageWidth + rightMargin + nextPage.size.outerW / 2;
    }

    // TODO: Be much smarter about this
    if (pageShift) {
      if (pageShift > 0) {
        currentPage.node.setAttribute('id', 'nextPage');

        // Shift everything to the left, making the next page the center
        if (nextPage) {
          pageShift = -this.pagePositions[2];
          nextPage.node.setAttribute('id', 'currentPage');
        }
        else {
          // We don't know how large the next page will be, so guess it's the same
          // as the current page
          pageShift = -(currentPage.size.outerW + currentPage.size.marginRight);
        }
      }
      else {
        currentPage.node.setAttribute('id', 'previousPage');

        // Shift everything to the right, making the previous page the center
        if (prevPage) {
          pageShift = -this.pagePositions[0];
          prevPage.node.setAttribute('id', 'currentPage');
        }
        else {
          // Don't know how large previous page will be, guess same as current
          pageShift = currentPage.size.outerW + currentPage.size.marginLeft;
        }
      }

      this.pagePositions = this.pagePositions.map(function(value) {
        return value + pageShift;
      });

      this.animationStart = goog.now();
      // Account for any existing offset, and keep page in same position when
      // animation starts
      this.pageOffset -= pageShift;
    }
    else {
      // Can't let pageOffset be undefined, will throw errors in IE
      this.pageOffset = this.pageOffset || 0;
    }

    this._updatePagePositions();
  };

  /**
   * Run updatePagePositions on a delay
   * @private
   */
  Chrome.prototype._updatePagePositionsDelayed = function() {
    scheduler.queue(this._updatePagePositions, [], 'animatePages', this);
  };

  /**
   * @private
   * @param {boolean=} preventAnimation
   */
  Chrome.prototype._updatePagePositions = function(preventAnimation) {
    var t;

    if (!preventAnimation && this.pageOffset) {
      if (MAX_ANIMATION_DURATION && this.animationStart) {
        // Pause tasks to keep animation smooth
        scheduler.pause(['animatePages', 'resumeTasks']);

        // Percent of time left in animation
        t = 1 - (goog.now() - this.animationStart) / MAX_ANIMATION_DURATION;
        // Clamp into 0,1
        t = Math.max(0, Math.min(1, t));

        // Ease and round
        this.pageOffset = Math.round(this.pageOffset * t);

        if (!this.pageOffset) {
          this.pageOffset = 0;
          // Re-enable other tasks, soon
          scheduler.queue(scheduler.resume, [], 'resumeTasks');
        }
        else {
          // Queue up another call in a bit
          this._updatePagePositionsDelayed();
        }
      }
      else {
        // No animation means no offset to animate
        this.pageOffset = 0;
      }
    }
    else {
      // Stop any animations that might be queued
      scheduler.clear('animatePages');
    }

    // Update position
    this.pages.forEach(function(page, i) {
      if (page && page.node) {
        dimensions.setOffsetX(page.node, this.pagePositions[i] + this.pageOffset);
      }
    }, this);
  };

  /**
   * Find the first chrome that meets the current requirements
   *
   * @param {Array.<treesaver.ui.Chrome>} chromes
   * @param {treesaver.dimensions.Size} availSize
   * @return {?treesaver.ui.Chrome} A suitable Chrome, if one was found.
   */
  Chrome.select = function(chromes, availSize) {
    // Cycle through chromes
    var i, len, current, chrome = null;

    for (i = 0, len = chromes.length; i < len; i += 1) {
      current = chromes[i];
      if (current.meetsRequirements() && current.fits(availSize)) {
        chrome = current;
        break;
      }
    }

    if (!chrome) {
      debug.error('No Chrome Fits!');
    }

    return chrome;
  };

  if (goog.DEBUG) {
    // Expose for testing
    Chrome.prototype.toString = function() {
      return '[Chrome: ]';
    };
  }
});


// Input 40
/**
 * @fileoverview The lightbox class.
 */

goog.provide('treesaver.ui.LightBox');

goog.require('treesaver.capabilities');
goog.require('treesaver.debug');
goog.require('treesaver.dimensions');
goog.require('treesaver.dom');
goog.require('treesaver.ui.Scrollable');

goog.scope(function() {
  var debug = treesaver.debug,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom;

  /**
   * LightBox
   *
   * @param {!Element} node HTML node.
   * @constructor
   */
  treesaver.ui.LightBox = function(node) {
    var containerNode = dom.querySelectorAll('.container', node)[0];

    // DEBUG-only validation
    if (goog.DEBUG) {
      if (!containerNode) {
        debug.error('No container within lightbox!');
      }
    }

    // TODO: Only store mutable capabilities
    this.requirements = dom.hasAttr(node, 'data-requires') ?
      node.getAttribute('data-requires').split(' ') : null;

    this.html = node.parentNode.innerHTML;

    this.size = new dimensions.Metrics(node);

    // Clean up metrics object
    delete this.size.w;
    delete this.size.h;
  };
});

goog.scope(function() {
  var LightBox = treesaver.ui.LightBox,
      capabilities = treesaver.capabilities,
      debug = treesaver.debug,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom,
      Scrollable = treesaver.ui.Scrollable;

  /**
   * List of required capabilities for this LightBox
   *
   * @type {?Array.<string>}
   */
  LightBox.prototype.requirements;

  /**
   * @type {string}
   */
  LightBox.prototype.html;

  /**
   * The measurements of the chrome
   * @type {!treesaver.dimensions.Metrics}
   */
  LightBox.prototype.size;

  /**
   * @type {boolean}
   */
  LightBox.prototype.active;

  /**
   * @type {?Element}
   */
  LightBox.prototype.node;

  /**
   * @type {?Element}
   */
  LightBox.prototype.container;

  /**
   * @return {!Element} The activated node.
   */
  LightBox.prototype.activate = function() {
    if (!this.active) {
      this.active = true;

      this.node = dom.createElementFromHTML(this.html);
      this.container = dom.querySelectorAll('.container', this.node)[0];
    }

    return /** @type {!Element} */ (this.node);
  };

  /**
   * Deactivate the lightbox
   */
  LightBox.prototype.deactivate = function() {
    if (!this.active) {
      return;
    }

    this.active = false;

    // Make sure to drop references
    this.node = null;
  };

  /**
   * The maximum available space within the lightbox right now
   *
   * @return {!treesaver.dimensions.Size}
   */
  LightBox.prototype.getMaxSize = function() {
    if (goog.DEBUG) {
      if (!this.node || !this.container) {
        debug.error('No active container for lightbox');
      }
    }

    // Compiler cast
    this.container = /** @type {!Element} */ (this.container);

    // TODO: Query only needed properties
    var metrics = new dimensions.Metrics(this.container);

    return {
      w: metrics.w,
      h: metrics.h
    };
  };


  /**
   * @param {!treesaver.layout.Figure} figure
   */
  LightBox.prototype.showFigure = function(figure) {
    var containerSize = this.getMaxSize(),
        largest = figure.getLargestSize(containerSize, true),
        screenW = dimensions.getOffsetWidth(this.container.offsetParent),
        screenH = dimensions.getOffsetHeight(this.container.offsetParent),
        scrollNode,
        contentW, contentH, metrics;

    // TODO: Provide name for sizing via CSS?

    // Closure compiler cast
    this.container = /** @type {!Element} */ (this.container);

    if (this.active && largest) {
      largest.figureSize.applySize(this.container, largest.name);
      this.container.style.bottom = 'auto';
      this.container.style.right = 'auto';

      // What's the size of the content?
      // TODO: Refactor to query only needed properties
      metrics = new dimensions.Metrics(this.container);
      contentW = metrics.w;
      contentH = metrics.h;

      // Clamp in case of scrolling
      if (figure.scrollable) {
        contentW = Math.min(containerSize.w, contentW);
        contentH = Math.min(containerSize.h, contentH);
        dimensions.setCssPx(this.container, 'width', contentW);
        dimensions.setCssPx(this.container, 'height', contentH);
        dom.addClass(this.container, 'scroll');
        Scrollable.initDom(this.container);
      }

      // Center the container on the screen (use offsetWidth to include border/padding)
      dimensions.setCssPx(this.container, 'left', (screenW - contentW - metrics.bpWidth) / 2);
      dimensions.setCssPx(this.container, 'top', (screenH - contentH - metrics.bpHeight) / 2);
      return true;
    }
    else {
      return false;
    }
  };

  /**
   * @param {treesaver.dimensions.Size} availSize
   * @return {boolean} True if fits.
   */
  LightBox.prototype.fits = function(availSize) {
    return dimensions.inSizeRange(this.size, availSize);
  };

  /**
   * @return {boolean} True if the LightBox meets current browser capabilities.
   */
  LightBox.prototype.meetsRequirements = function() {
    if (!this.requirements) {
      return true;
    }

    return capabilities.check(this.requirements, true);
  };

  /**
   * Find the first lightbox that meets the current requirements
   *
   * @param {Array.<treesaver.ui.LightBox>} lightboxes
   * @param {treesaver.dimensions.Size} availSize
   * @return {?treesaver.ui.LightBox} A suitable LightBox, if one was found.
   */
  LightBox.select = function(lightboxes, availSize) {
    // Cycle through lightboxes
    var i, len, current, lightbox = null;

    for (i = 0, len = lightboxes.length; i < len; i += 1) {
      current = lightboxes[i];
      if (current.meetsRequirements() && current.fits(availSize)) {
        lightbox = current;
        break;
      }
    }

    if (!lightbox) {
      debug.error('No LightBox Fits!');
    }

    return lightbox;
  };
});

// Input 41
/**
 * @fileoverview Responsible for managing the application state. Should really be called ChromeManager.
 */

goog.provide('treesaver.ui.StateManager');

goog.require('treesaver.capabilities');
goog.require('treesaver.constants');
goog.require('treesaver.debug');
goog.require('treesaver.dimensions');
goog.require('treesaver.dom');
goog.require('treesaver.events');
goog.require('treesaver.resources');
goog.require('treesaver.scheduler');
goog.require('treesaver.ui.Chrome');
goog.require('treesaver.ui.LightBox');

goog.scope(function() {
  var StateManager = treesaver.ui.StateManager,
      capabilities = treesaver.capabilities,
      debug = treesaver.debug,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom,
      events = treesaver.events,
      resources = treesaver.resources,
      scheduler = treesaver.scheduler,
      Chrome = treesaver.ui.Chrome,
      LightBox = treesaver.ui.LightBox;

  /**
   * Current state
   */
  StateManager.state_;

  /**
   * Storage for all the chromes
   *
   * @type {Array.<treesaver.ui.Chrome>}
   */
  StateManager.chromes_;

  /**
   * Initialize the state manager
   *
   * @return {boolean}
   */
  StateManager.load = function() {
    // Setup state
    StateManager.state_ = {
      orientation: 0,
      size: { w: 0, h: 0 }
    };

    // Clean the body
    dom.clearChildren(/** @type {!Element} */ (treesaver.tsContainer));

    // Install container for chrome used to measure screen space, etc
    StateManager.state_.chromeContainer = StateManager.getChromeContainer_();

    // Get or install the viewport
    StateManager.state_.viewport = StateManager.getViewport_();

    // Get the chromes and lightboxes
    StateManager.chromes_ = StateManager.getChromes_();
    StateManager.lightboxes_ = StateManager.getLightBoxes_();

    // Can't do anything without mah chrome
    if (!StateManager.chromes_.length) {
      debug.error('No chromes');

      return false;
    }

    // Find and install the first chrome by calling checkState manually (this will also set up the size)
    StateManager.checkState();

    // Setup checkstate timer
    scheduler.repeat(StateManager.checkState, CHECK_STATE_INTERVAL, Infinity, [], 'checkState');

    if (capabilities.SUPPORTS_ORIENTATION &&
        !treesaver.inContainedMode &&
        !capabilities.IS_FULLSCREEN) {
      events.addListener(window, 'orientationchange',
        StateManager.onOrientationChange);

      // Hide the address bar on iPhone
      scheduler.delay(window.scrollTo, 100, [0, 0]);
    }

    return true;
  };

  StateManager.unload = function() {
    // Remove handler
    if (capabilities.SUPPORTS_ORIENTATION && !treesaver.inContainedMode) {
      events.removeListener(window, 'orientationchange', StateManager.onOrientationChange);
    }

    // Deactive any active chrome
    if (StateManager.state_.chrome) {
      StateManager.state_.chrome.deactivate();
    }

    // Lose references
    StateManager.state_ = null;
    StateManager.chromes_ = null;
    StateManager.lightboxes_ = null;
  };

  /**
   * @type {Object.<string, string>}
   */
  StateManager.events = {
    CHROMECHANGED: 'treesaver.chromechanged'
  };

  /**
   * @private
   * @return {!Element}
   */
  StateManager.getChromeContainer_ = function() {
    if (treesaver.inContainedMode) {
      return treesaver.tsContainer;
    }
    else {
      var container = document.createElement('div');
      container.setAttribute('id', 'chromeContainer');
      treesaver.tsContainer.appendChild(container);
      return container;
    }
  };

  /**
   * @private
   * @return {!Element}
   */
  StateManager.getViewport_ = function() {
    var viewport = dom.querySelectorAll('meta[name=viewport]')[0];

    if (!viewport) {
      // Create a viewport if one doesn't exist
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      dom.querySelectorAll('head')[0].appendChild(viewport);
    }

    return viewport;
  };

  /**
   * @private
   * @return {!Array.<treesaver.ui.Chrome>}
   */
  StateManager.getChromes_ = function() {
    var chromes = [];

    resources.findByClassName('chrome').forEach(function(node) {
      var chrome,
          requires = node.getAttribute('data-requires');

      if (requires && !capabilities.check(requires.split(' '))) {
        // Doesn't meet our requirements, skip
        return;
      }

      StateManager.state_.chromeContainer.appendChild(node);

      chrome = new Chrome(node);
      chromes.push(chrome);

      StateManager.state_.chromeContainer.removeChild(node);
    });

    return chromes;
  };

  /**
   * @private
   * @return {!Array.<treesaver.ui.LightBox>}
   */
  StateManager.getLightBoxes_ = function() {
    var lightboxes = [];

    resources.findByClassName('lightbox').forEach(function(node) {
      var lightbox,
          requires = node.getAttribute('data-requires');

      if (requires && !capabilities.check(requires.split(' '))) {
        // Doesn't meet our requirements, skip
        return;
      }

      StateManager.state_.chromeContainer.appendChild(node);

      lightbox = new LightBox(node);
      lightboxes.push(lightbox);

      StateManager.state_.chromeContainer.removeChild(node);
    });

    return lightboxes;
  };

  /**
   * Detect any changes in orientation, and update the viewport accordingly
   */
  StateManager.onOrientationChange = function() {
    if (StateManager.state_.orientation === window['orientation']) {
      // Nothing to do (false alarm?)
      return;
    }

    // TODO: Fire event?
    //
    // TODO: Refactor this manual update
    capabilities.updateClasses();

    StateManager.state_.orientation = window['orientation'];

    if (StateManager.state_.orientation % 180) {
      // Rotated (landscape)
      StateManager.state_.viewport.setAttribute('content',
        'width=device-height, height=device-width');
    }
    else {
      // Normal
      StateManager.state_.viewport.setAttribute('content',
        'width=device-width, height=device-height');
    }

    // Hide the address bar on iOS & others
    if (capabilities.SUPPORTS_ORIENTATION &&
        !treesaver.inContainedMode &&
        !capabilities.IS_FULLSCREEN) {
      window.scrollTo(0, 0);
    }

    // TODO: Update classes for styling?

    // TODO: Access widths to force layout?
  };

  /**
   * Gets the size currently visible within the browser
   *
   * @private
   * @return {{ w: number, h: number }}
   */
  StateManager.getAvailableSize_ = function() {
    if (capabilities.IS_NATIVE_APP || !treesaver.inContainedMode) {
      if (window.pageYOffset || window.pageXOffset) {
        window.scrollTo(0, 0);
      }

      return {
        w: window.innerWidth,
        h: window.innerHeight
      };
    }
    else {
      return dimensions.getSize(treesaver.tsContainer);
    }
  };

  /**
   * Get a lightbox for display
   *
   * @return {?treesaver.ui.LightBox}
   */
  StateManager.getLightBox = function() {
    var availSize = StateManager.getAvailableSize_();

    return LightBox.select(StateManager.lightboxes_, availSize);
  };

  /**
   * Tick function
   */
  StateManager.checkState = function() {
    var availSize = StateManager.getAvailableSize_(),
        newChrome;

    // Check if we're at a new size
    if (availSize.h !== StateManager.state_.size.h || availSize.w !== StateManager.state_.size.w) {
      StateManager.state_.size = availSize;

      // Check if chrome still fits
      if (!StateManager.state_.chrome ||
          !StateManager.state_.chrome.meetsRequirements() ||
          !StateManager.state_.chrome.fits(availSize)) {
        // Chrome doesn't fit, need to install a new one
        newChrome = Chrome.select(StateManager.chromes_, availSize);

        if (!newChrome) {
          // TODO: Fire chrome failed event
          // TODO: Show error page (no chrome)
          return;
        }

        // Remove existing chrome
        dom.clearChildren(StateManager.state_.chromeContainer);
        // Deactivate previous
        if (StateManager.state_.chrome) {
          StateManager.state_.chrome.deactivate();
        }

        // Activate and store
        StateManager.state_.chromeContainer.appendChild(newChrome.activate());
        StateManager.state_.chrome = newChrome;

        // Fire chrome change event
        events.fireEvent(
          document, StateManager.events.CHROMECHANGED, {
            'node': newChrome.node
          }
        );
      }

      // Chrome handles page re-layout, if necessary
      StateManager.state_.chrome.setSize(availSize);
    }
  };

  // Expose special functions for use by the native app wrappers
  if (capabilities.IS_NATIVE_APP) {
    // UI is shown/hidden based on the active and idle events fired by the
    // currently visible chrome.
    //
    // Since the next/prev, etc controls are contained within external UI,
    // need to expose functions that both go to next/prev and fire active
    //
    // Create a wrapper function that calls active on the current chrome
    // before calling the actual function
    treesaver.activeFunctionWrapper = function(f) {
      return (function() {
        // Manually call the chrome's function, if it exists
        if (StateManager.state_.chrome) {
          StateManager.state_.chrome.setUiActive_();
        }

        // Call original function
        f();
      });
    };

    goog.exportSymbol('treesaver.nextPage',
      treesaver.activeFunctionWrapper(treesaver.ui.ArticleManager.nextPage));
    goog.exportSymbol('treesaver.previousPage',
      treesaver.activeFunctionWrapper(treesaver.ui.ArticleManager.previousPage));
    goog.exportSymbol('treesaver.nextArticle',
      treesaver.activeFunctionWrapper(treesaver.ui.ArticleManager.nextArticle));
    goog.exportSymbol('treesaver.previousArticle',
      treesaver.activeFunctionWrapper(treesaver.ui.ArticleManager.previousArticle));
  }
});

// Input 42
/**
 * @fileoverview Initializes the framework, loading required files and
 * resources.
 */

/**
 * @preserve Copyright 2011 Filipe Fortes ( www.fortes.com ).
 * Version: 0.1.
 *
 * Licensed under MIT and GPLv2.
 */

goog.provide('treesaver');

goog.require('treesaver.capabilities');
goog.require('treesaver.constants');
goog.require('treesaver.debug');
goog.require('treesaver.dom');
goog.require('treesaver.events');
goog.require('treesaver.fonts');
goog.require('treesaver.history');
goog.require('treesaver.resources');
goog.require('treesaver.scheduler');
goog.require('treesaver.styles');
goog.require('treesaver.ui.Article');
goog.require('treesaver.ui.ArticleManager');
goog.require('treesaver.ui.Chrome');
goog.require('treesaver.ui.StateManager');

goog.scope(function() {
  var debug = treesaver.debug,
      dom = treesaver.dom,
      events = treesaver.events,
      fonts = treesaver.fonts,
      capabilities = treesaver.capabilities,
      ArticleManager = treesaver.ui.ArticleManager,
      StateManager = treesaver.ui.StateManager;


  /**
   * Treesaver events fired
   * @const
   * @type {Object.<string, string>}
   */
  treesaver.customevents = {
    LOADERSHOWN: 'treesaver.loader_shown'
  };

  /**
   * Load scripts and required resources
   */
  treesaver.boot = function() {
    debug.info('Begin Treesaver booting');

    if (!goog.DEBUG || !window.TS_NO_AUTOLOAD) {
      // Hide content to avoid ugly flashes
      document.documentElement.style.display = 'none';
    }

    // Initialize the network module
    treesaver.network.load();

    // Set capability flags
    capabilities.updateClasses();

    // Load resources
    treesaver.resources.load(function() {
      treesaver.resourcesLoaded_ = true;
      treesaver.bootProgress_();
    });

    fonts.load(function() {
      treesaver.fontsLoaded_ = true;
      treesaver.bootProgress_();
    });


    // Watch for dom ready
    if (/complete|loaded/.test(document.readyState)) {
      // DOM is already ready, call directly
      treesaver.domReady();
    }
    else {
      events.addListener(document, 'DOMContentLoaded', treesaver.domReady);
    }

    if (!WITHIN_IOS_WRAPPER && (!goog.DEBUG || !window.TS_NO_AUTOLOAD)) {
      // Fallback in case things never load
      treesaver.scheduler.delay(
        treesaver.unboot,
        treesaver.LOAD_TIMEOUT,
        [],
        'unboot'
      );
    }
  };

  /**
   * Recover from errors and return the page to the original state
   */
  treesaver.unboot = function() {
    debug.info('Treesaver unbooting');

    // Restore HTML
    if (!WITHIN_IOS_WRAPPER && treesaver.inContainedMode) {
      treesaver.tsContainer.innerHTML = treesaver.originalContainerHtml;
    }
    else if (treesaver.originalHtml) {
      treesaver.tsContainer.innerHTML = treesaver.originalHtml;
    }

    // First, do standard cleanup
    treesaver.cleanup_();

    // Stop all scheduled tasks
    treesaver.scheduler.stopAll();

    // Clean up libraries
    treesaver.resources.unload();
    treesaver.network.unload();
    treesaver.fonts.unload();

    // Setup classes
    capabilities.resetClasses();

    // Show content again
    document.documentElement.style.display = 'block';
  };

  /**
   * Clean up boot-related timers and handlers
   * @private
   */
  treesaver.cleanup_ = function() {
    // Clear out the unboot timeout
    treesaver.scheduler.clear('unboot');

    // Remove DOM ready handler
    events.removeListener(document, 'DOMContentLoaded', treesaver.domReady);

    // Kill loading flags
    delete treesaver.resourcesLoaded_;
    delete treesaver.domReady_;
  };

  /**
   * Receive DOM ready event
   *
   * @param {Event=} e Event object.
   */
  treesaver.domReady = function(e) {
    treesaver.domReady_ = true;

    if (!WITHIN_IOS_WRAPPER) {
      treesaver.tsContainer = document.getElementById('ts_container');
    }

    if (!WITHIN_IOS_WRAPPER && treesaver.tsContainer) {
      // Is the treesaver display area contained within a portion of the page?
      treesaver.inContainedMode = true;
      treesaver.originalContainerHtml = treesaver.tsContainer.innerHTML;
    }
    else {
      treesaver.inContainedMode = false;
      treesaver.tsContainer = document.body;
    }

    if (!goog.DEBUG || !window.TS_NO_AUTOLOAD) {
      treesaver.originalHtml = document.body.innerHTML;

      // Remove main content
      dom.clearChildren(/** @type {!Element} */(treesaver.tsContainer));

      // Place a loading message
      treesaver.tsContainer.innerHTML =
        '<div id="loading">Loading ' + document.title + '...</div>';
      // Re-enable content display
      document.documentElement.style.display = 'block';

      events.fireEvent(document, treesaver.customevents.LOADERSHOWN);
    }

    // Update state
    treesaver.bootProgress_();
  };

  /**
   *
   * @private
   */
  treesaver.bootProgress_ = function() {
    if (!treesaver.resourcesLoaded_ || !treesaver.fontsLoaded_) {
      // Can't show loading screen until resources are loaded
      return;
    }

    if (!treesaver.domReady_) {
      debug.info('Load progress: DOM not ready yet');

      // Can't do anything if the DOM isn't ready
      return;
    }
    else {
      // TODO: Happens once in a while, need to track down
      if (!document.body) {
        debug.error('document.body not available after DOM ready');

        return;
      }
    }

    debug.info('Treesaver boot complete');

    // Clean up handlers and timers
    treesaver.cleanup_();

    if (!goog.DEBUG || !window.TS_NO_AUTOLOAD) {
      // Start loading the core (UI, layout, etc)

      // Start the real proces
      treesaver.load();
    }
  };

  /**
   * Load the UI
   */
  treesaver.load = function() {
    debug.info('Load begin');

    // Make sure we clean up when leaving the page
    events.addListener(window, 'unload', treesaver.unload);

    // Root element for listening to UI events
    treesaver.ui.eventRoot = treesaver.inContainedMode ?
      treesaver.tsContainer : window;

    // Kick off boot process, but back up if any single item fails
    if (StateManager.load() &&
        // Grids
        ArticleManager.load(treesaver.originalHtml)) {
    }
    else {
      debug.error('Load failed');

      treesaver.unload();
    }
  };

  /**
   * Unload the UI and cleanup
   */
  treesaver.unload = function() {
    debug.info('Unloading');

    events.removeListener(window, 'unload', treesaver.unload);

    ArticleManager.unload();
    StateManager.unload();

    treesaver.unboot();
  };

  // Start the process
  if (capabilities.SUPPORTS_TREESAVER) {
    treesaver.boot();
  }
  else {
    debug.warn('Treesaver not supported');
  }
});

