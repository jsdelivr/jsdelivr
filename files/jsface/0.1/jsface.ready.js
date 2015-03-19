/*
 * JSFace Object Oriented Programming Library - Ready plugin
 * https://github.com/tnhu/jsface
 *
 * Copyright (c) 2009-2012 Tan Nhu
 * Licensed under MIT license (https://github.com/tnhu/jsface/blob/master/LICENSE.txt)
 */
(function(context) {
  "use strict";

  var jsface     = context.jsface || require("./jsface"),
      Class      = jsface.Class,
      isFunction = jsface.isFunction,
      readyFns   = [],
      readyCount = 0;

  Class.plugins.$ready = function(clazz, parent, api) {
    var r     = api.$ready,
        len   = parent ? parent.length : 0,
        count = len,
        pa, i, entry;

    while (len--) {
      for (i = 0; i < readyCount; i++) {
        entry = readyFns[i];
        pa    = parent[len];

        if (pa === entry[0]) {
          entry[1].call(pa, clazz, parent, api);
          count--;
        }

        if ( !count) { break; }
      }
    }

    // in an environment where there are a lot of class creating/removing (rarely)
    // this implementation might cause a leak (saving pointers to clazz and $ready)
    if (isFunction(r)) {
      r.call(clazz, clazz, parent, api);
      readyFns.push([ clazz,  r ]);
      readyCount++;
    }
  };
})(this);
