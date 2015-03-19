/*! see LICENCE for Simplified BSD Licence */
/*jslint browser:true, indent:2*/
/*global define, require*/ // Require.JS

/*global Promise*/ // ES6 native Promise

define(function () {
  'use strict';

  var isPromise;

  isPromise = function (obj) {
    if (!obj || typeof obj !== 'object') {
      return false;
    }
    if (window.Promise && obj instanceof Promise) {
      return true;
    }
    return typeof obj.then === 'function';
  };

  return {
    /**
     * @param {String} name This is the name of the desired resource module.
     * @param {Function} req Provides a "require" to load other modules.
     * @param {Function} load Pass the module's result to this function.
     * @param {Object} config Provides the optimizer's configuration.
     */
    load: function (name, req, load) { // , config
      // TODO: check config.isBuild\
      // TODO: call load.fromText() if necessary to eval JavaScript text
      req([name], function (result) {
        var onReject, onResolve, complete;
        onReject = function () {
          load.error.apply(null, arguments);
        };
        onResolve = function () {
          load.apply(null, arguments);
        };
        if (isPromise(result)) {
          // If the promise supports "done" (not all do), we want to use that to
          // terminate the promise chain and expose any exceptions.
          complete = result.done || result.then;

          if (typeof result.fail === 'function') {
            complete.call(result, onResolve);
            result.fail(onReject);
          } else {
            // native Promises don't have `fail` (thanks @nfeldman)
            complete.call(result, onResolve, onReject);
          }

        } else {
          load(result);
        }
      });
    }/*,
    write: function () {
      // TODO: what needs to be done for write() ??
    }, */
/*        pluginBuilder: function () {
      // TODO: what needs to be done for pluginBuilder() ??
    } */
    /*
     * Note: we explicitly do NOT implement normalize(), as the simpler
     * default implementation is sufficient for current use cases.
     */
  };
});
