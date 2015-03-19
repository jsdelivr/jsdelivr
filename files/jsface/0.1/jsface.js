/*
 * JSFace Object Oriented Programming Library
 * https://github.com/tnhu/jsface
 *
 * Copyright (c) 2009-2012 Tan Nhu
 * Licensed under MIT license (https://github.com/tnhu/jsface/blob/master/LICENSE.txt)
 */
(function(context, OBJECT, NUMBER, LENGTH, toString, version, undefined, oldClass, jsface) {
  "use strict";

  /**
   * Check an object is a map or not. A map is something like { key1: value1, key2: value2 }.
   * @param obj object to be checked
   * @return true if object is a map
   */
  function isMap(obj) { return (obj && typeof obj === OBJECT && !(typeof obj.length === NUMBER && !(obj.propertyIsEnumerable(LENGTH)))); }

  /**
   * Check an object is an array or not. An array is something like [].
   * @param obj object to be checked
   * @return true if object is an array
   */
  function isArray(obj) { return (obj && typeof obj === OBJECT && typeof obj.length === NUMBER && !(obj.propertyIsEnumerable(LENGTH))); }

  /**
   * Check an object is a function or not.
   * @param obj object to be checked
   * @return true if object is an function
   */
  function isFunction(obj) { return (obj && typeof obj === "function"); }

  /**
   * Check an object is a string not.
   * @param obj object to be checked
   * @return true if object is a string
   */
  function isString(obj) { return toString.apply(obj) === "[object String]"; }

  /**
   * Check an object is a class (not an instance of a class, which is a map) or not.
   * @param obj object to be checked
   * @return true if object is a class
   */
  function isClass(obj) { return isFunction(obj) && (obj.prototype && obj === obj.prototype.constructor); }

  /**
   * Util for extend() to copy a map of { key:value } to an object
   * @param key key
   * @param value value
   * @param ignoredKeys ignored keys
   * @param object object
   * @param iClass true if object is a class
   * @param oPrototype object prototype
   */
  function copier(key, value, ignoredKeys, object, iClass, oPrototype) {
    if ( !ignoredKeys || !ignoredKeys.hasOwnProperty(key)) {
      object[key] = value;
      if (iClass) { oPrototype[key] = value; }                       // class? copy to prototype as well
    }
  }

  /**
   * Extend object from subject, ignore properties in ignoredKeys
   * @param object the child
   * @param subject the parent
   * @param ignoredKeys (optional) keys should not be copied to child
   */
  function extend(object, subject, ignoredKeys) {
    if (isArray(subject)) {
      for (var len = subject.length; --len >= 0;) { extend(object, subject[len], ignoredKeys); }
    } else {
      ignoredKeys = ignoredKeys || { constructor: 1, $super: 1, prototype: 1, $superb: 1 };

      var iClass     = isClass(object),
          isSubClass = isClass(subject),
          oPrototype = object.prototype, supez, key, proto;

      // copy static properties and prototype.* to object
      if (isMap(subject)) { for (key in subject) copier(key, subject[key], ignoredKeys, object, iClass, oPrototype); }

      if (isSubClass) {
        proto = subject.prototype;
        for (key in proto) { copier(key, proto[key], ignoredKeys, object, iClass, oPrototype); }
      }

      // prototype properties
      if (iClass && isSubClass) { extend(oPrototype, subject.prototype, ignoredKeys); }
    }
  }

  /**
   * Create a class.
   * @param parent parent class(es)
   * @param api class api
   * @return class
   */
  function Class(parent, api) {
    if ( !api) parent = (api = parent, 0);                                     // !api means there's no parent

    var clazz, constructor, singleton, statics, key, bindTo, len, i = 0, p,
        ignoredKeys = { constructor: 1, $singleton: 1, $statics: 1, prototype: 1, $super: 1, $superp: 1, main: 1, toString: 0 },
        overload    = Class.overload,
        plugins     = Class.plugins;

    api         = (typeof api === "function" ? api() : api) || {};             // execute api if it's a function
    constructor = api.hasOwnProperty("constructor") ? api.constructor : 0;     // hasOwnProperty is a must, constructor is special
    singleton   = api.$singleton;
    statics     = api.$statics;

    // add plugins' keys into ignoredKeys
    for (key in plugins) { ignoredKeys[key] = 1; }

    // construct constructor
    clazz  = singleton ? {} : (constructor ? (overload ? overload("constructor", constructor) : constructor) : function(){});

    // determine bindTo: where api should be bound
    bindTo = singleton ? clazz : clazz.prototype;

    // make sure parent is always an array
    parent = !parent || isArray(parent) ? parent : [ parent ];

    // do inherit
    len = parent && parent.length;
    while (i < len) {
      p = parent[i++];
      for (key in p) {
        if ( !ignoredKeys[key]) {
          bindTo[key] = p[key];
          if ( !singleton) { clazz[key] = p[key]; }
        }
      }
      for (key in p.prototype) { if ( !ignoredKeys[key]) { bindTo[key] = p.prototype[key]; } }
    }

    // copy properties from api to bindTo
    for (key in api) { if ( !ignoredKeys[key]) bindTo[key] = api[key]; }

    // copy static properties from statics to both clazz and bindTo
    for (key in statics) { clazz[key] = bindTo[key] = statics[key]; }

    // if class is not a singleton, add $super and $superp
    if ( !singleton) {
      p = parent && parent[0] || parent;
      clazz.$super  = p;
      clazz.$superp = p && p.prototype ? p.prototype : p;
    }

    for (key in plugins) { plugins[key](clazz, parent, api); }                 // pass control to plugins
    if (isFunction(api.main)) { api.main.call(clazz, clazz); }                 // execute main()
    return clazz;
  }

  /* Class plugins repository */
  Class.plugins = {};

  /* Initialization */
  jsface = {
    version   : version,
    Class     : Class,
    extend    : extend,
    isMap     : isMap,
    isArray   : isArray,
    isFunction: isFunction,
    isString  : isString,
    isClass   : isClass
  };

  if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
    module.exports = jsface;
  } else {
    oldClass          = context.Class;                                         // save current Class namespace
    context.Class     = Class;                                                 // bind Class and jsface to global scope
    context.jsface    = jsface;
    jsface.noConflict = function() { context.Class = oldClass; }               // no conflict
  }
})(this, "object", "number", "length", Object.prototype.toString, "2.1.1");
