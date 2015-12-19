/*

    I N S P E C T O R   F O R   P R O C E S S I N G . J S

    Part of the Processing.js project

    License       : MIT
    Web Site      : http://processingjs.org
    Github Repo.  : http://github.com/jeresig/processing-js
    Bug Tracking  : http://processing-js.lighthouseapp.com

*/
if (typeof ProcessingInspector === "undefined") {
  ProcessingInspector = (function() {
    var releaseFunctor = "__release__",
        monitorCount = "__monitor_count_",
    
    /**
     * To prevent magic strings, we 
     */
    getMonitoredAttrName = function(attr) {
      return "__monitored+"+attr+"__";
    },

    /**
     * Determine whether this object owns or inherits
     * the indicated attribute property. If it owns
     * it, its property descriptor with have a "value"
     * property that contains the actual value.
     */
    hasValueProperty = function(object, attr, forRelease) {
      if (forRelease) {
        attr = getMonitoredAttrName(attr);
      }
      var propDesc = Object.getOwnPropertyDescriptor(object, attr);
      if (!propDesc) {
        return false;
      }
      return "value" in Object.getOwnPropertyDescriptor(object, attr);
    },
    
    /**
     * Get the top-level object that actually holds
     * the attribute we're interested in.
     */
    getOwner = function(object, attr, forRelease) {
      if (!(attr in object)) {
        // shortcut: unsupported property
        return false;
      }
      if (hasValueProperty(object, attr, forRelease)) {
        // shortcut: property owned by this object
        return object;
      }
      if (object.$super) {
        // normal lookup: find owner and return
        while (!hasValueProperty(object, attr, forRelease)) { 
          object = object.$super;
        }
        return object;
      }
      // reasonably, we can't get here, but you never know.
      return false;
    },

    /**
     * Stop monitoring an object's property.
     */
    releaseFunction = function(attr) {
      // remove getter/setter again
      var monitoredAttr = getMonitoredAttrName(attr);
      delete(this[attr]);
      var props = {
        configurable: true,
        enumerable: true,
        writable: true,
        value: this[monitoredAttr] };
      Object.defineProperty(this, attr, props);
      delete(this[monitoredAttr]);
    };

    /**
     * We return an object with a monitor() and release() function.
     */
    return {
    
      /**
       * Start monitoring a specific property on a Pjs object for changes.
       *
       * @param object The object to monitor
       * @param attr the property to monitor changes for
       * @param callback a callback function with signature (obj,attr,val) that gets called on changes
       */
      monitor: function(object, attr, callback) {
        // can we even monitor this object's attribute?
        object = getOwner(object, attr, false);
        if (object === false) {
          return false;
        }

        // we can. 1) kill off property,
        var monitoredAttr = getMonitoredAttrName(attr);
        object[monitoredAttr] = object[attr];
        delete(object[attr]);

        // 2) Lift up this property using a closure,
        props = (function(attr, monitorAttr) {
           props = {
             get : function() { return this[monitoredAttr]; },
             set : function(v) {
                     if (v != this[monitoredAttr]) {
                       this[monitoredAttr] = v;
                       callback(object, attr, v);
                     }
                   },
             configurable : true,
             enumerable : true };
           return props;
         }(attr, monitoredAttr));
        Object.defineProperty(object, attr, props);

        // 3) (set and) increment the monitored value count,
        if (!hasValueProperty(object, monitorCount, false)) {
          object[monitorCount] = 0;
        }
        object[monitorCount]++;

        // 4) (re)bind the releasing function.
        object[releaseFunctor] = releaseFunction;
      },
      
      /**
       * We should be able to release monitored objects
       * at will, provided they can be released.
       *
       * @param object The object to monitor
       * @param attr the property to monitor changes for
       */
      release: function(object, attr) {
        // restore the property as "Writable value"
        object = getOwner(object, attr, true);
        if (object[releaseFunctor]) {
          object[releaseFunctor](attr);
          object[monitorCount]--;
        }
        // clean up if this was the last monitored property
        if (object[monitorCount] === 0) {
          delete(object[releaseFunctor]);
          delete(object[monitorCount]);
        }
      }
    };
  }());
}
else if (window && window.console && window.console.log) {
  window.console.log("ERROR: ProcessingInspector already exists.");
}