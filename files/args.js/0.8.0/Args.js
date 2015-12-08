/**
The MIT License (MIT)

Copyright (c) 2013-2014, OMG Life Ltd

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

var Args = (function() {

  "use strict";

  var _extractSchemeEl = function(rawSchemeEl) {
    var schemeEl = {};
    schemeEl.defValue = undefined;
    schemeEl.typeValue = undefined;
    for (var name in rawSchemeEl) {
      if (!rawSchemeEl.hasOwnProperty(name)) continue;
        if (name === "_default") {
          schemeEl.defValue = rawSchemeEl[name];
        } else if (name === "_type") {
          schemeEl.typeValue = rawSchemeEl[name];
        } else {
          schemeEl.sname = name;
        }
    }
    schemeEl.sarg = rawSchemeEl[schemeEl.sname];
    return schemeEl;
  };

  var _typeMatches = function(arg, sarg, typeValue) {
    if ((sarg & Args.STRING) !== 0 && typeof arg === "string") {
      return true;
    }
    if ((sarg & Args.FUNCTION) !== 0 && typeof arg === "function") {
      return true;
    }
    if ((sarg & Args.INT) !== 0 && (typeof arg === "number" && Math.floor(arg) === arg)) {
      return true;
    }
    if ((sarg & Args.FLOAT) !== 0 && typeof arg === "number") {
      return true;
    }
    if ((sarg & Args.ARRAY) !== 0 && (arg instanceof Array)) {
      return true;
    }
    if ((sarg & Args.OBJECT) !== 0 && (
      typeof arg === "object" &&
      (typeValue === undefined || (arg instanceof typeValue))
    )) {
      return true;
    }
    if ((sarg & Args.ARRAY_BUFFER) !== 0 && arg.toString().match(/ArrayBuffer/)) {
      return true;
    }
    if ((sarg & Args.DATE) !== 0 && arg instanceof Date) {
      return true;
    }
    if ((sarg & Args.BOOL) !== 0 && typeof arg === "boolean") {
      return true;
    }
    if ((sarg & Args.DOM_EL) !== 0 &&
      (
        (arg instanceof HTMLElement) ||
        (window.$ !== undefined && arg instanceof window.$)
      )
    ) {
      return true;
    }
    return false;
  };

  var _isTypeSpecified = function(sarg) {
    return (sarg & (Args.STRING | Args.FUNCTION | Args.INT | Args.FLOAT | Args.OBJECT | Args.ARRAY_BUFFER | Args.DATE | Args.BOOL | Args.DOM_EL | Args.ARRAY)) != 0;
  };

  var _getTypeString = function(sarg, typeValue) {
    if ((sarg & Args.STRING) !== 0 ) {
      return "String";
    }
    if ((sarg & Args.FUNCTION) !== 0 ) {
      return "Function";
    }
    if ((sarg & Args.INT) !== 0 ) {
      return "Int";
    }
    if ((sarg & Args.FLOAT) !== 0 ) {
      return "Float";
    }
    if ((sarg & Args.ARRAY) !== 0 ) {
      return "Array";
    }
    if ((sarg & Args.OBJECT) !== 0) {
      if (typeValue !== undefined) {
        return "Object (" + typeValue.toString() + ")";
      } else {
        return "Object";
      }
    }
    if ((sarg & Args.ARRAY_BUFFER) !== 0 ) {
      return "Arry Buffer";
    }
    if ((sarg & Args.DATE) !== 0 ) {
      return "Date";
    }
    if ((sarg & Args.BOOL) !== 0 ) {
      return "Bool";
    }
    if ((sarg & Args.DOM_EL) !== 0 ) {
      return "DOM Element";
    }
    return "unknown";
  };

  var _checkNamedArgs = function(namedArgs, scheme, returns) {
    var foundOne = false;
    for (var s = 0  ; s < scheme.length ; s++) {
      foundOne &= (function(schemeEl) {
        var argFound = false;
        for (var name in namedArgs) {
          var namedArg = namedArgs[name];
          if (name === schemeEl.sname) {
            if (_typeMatches(namedArg, schemeEl.sarg, schemeEl.type)) {
              returns[name] = namedArg;
              argFound = true;
              break;
            }
          }
        }
        return argFound;
      })(_extractSchemeEl(scheme[s]));
    }
    return foundOne;
  };

  var Args = function(scheme, args) {
    if (scheme === undefined) throw new Error("The scheme has not been passed.");
    if (args === undefined) throw new Error("The arguments have not been passed.");

    var returns = {};
    var err = undefined;

    var a, s;

    for (a = 0, s = 0; a < args.length, s < scheme.length ; s++) {
      a = (function(a,s) {

        var arg = args[a];

        // argument group
        if (scheme[s] instanceof Array) {
          if (arg === null || arg === undefined) {
            err = "Argument " + a + " is null or undefined but it must be not null.";
            return a;
          } else {
            var group = scheme[s];
            var retName = undefined;
            for (var g = 0 ; g < group.length ; g++) {
              var schemeEl = _extractSchemeEl(group[g]);
              if (_typeMatches(arg, schemeEl.sarg, schemeEl.typeValue)) {
                retName = schemeEl.sname;
              }
            }
            if (retName === undefined) {
              err = "Argument " + a + " should be one of: ";
              for (var g = 0 ; g < group.length ; g++) {
                var schemeEl = _extractSchemeEl(group[g]);
                err += _getTypeString(schemeEl.sarg, schemeEl.typeValue) + ", ";
              }
              err += "but it was type " + (typeof arg) + " with value " + arg + ".";
              return a;
            } else {
              returns[retName] = arg;
              return a+1;
            }
          }
        } else {
          var schemeEl = _extractSchemeEl(scheme[s]);

          // manadatory arg
          if ((schemeEl.sarg & Args.NotNull) !== 0) {
            if (arg === null || arg === undefined) {
              err = "Argument " + a + " ("+schemeEl.sname+") is null or undefined but it must be not null.";
              return a;
            }
            else if (!_typeMatches(arg, schemeEl.sarg, schemeEl.typeValue)) {
              if (_isTypeSpecified(schemeEl.sarg)) {
                err = "Argument " + a + " ("+schemeEl.sname+") should be type "+_getTypeString(schemeEl.sarg, schemeEl.typeValue)+", but it was type " + (typeof arg) + " with value " + arg + ".";
              } else {
                err = "Argument " + a + " ("+schemeEl.sname+") has no valid type specified.";
              }
              return a;
            } else {
              returns[schemeEl.sname] = arg;
              return a+1;
            }
          }

          // optional arg
          else if ((schemeEl.sarg & Args.Optional) !== 0) {
            // check if this arg matches the next schema slot
            if ( arg === null || arg === undefined) {
              if (schemeEl.defValue !== undefined)  {
                returns[schemeEl.sname] = schemeEl.defValue;
              } else {
                returns[schemeEl.sname] = arg;
              }
              return a+1; // if the arg is null or undefined it will fill a slot, but may be replace by the default value
            } else if (_typeMatches(arg, schemeEl.sarg, schemeEl.typeValue)) {
              returns[schemeEl.sname] = arg;
              return a+1;
            } else if (schemeEl.defValue !== undefined)  {
              returns[schemeEl.sname] = schemeEl.defValue;
              return a;
            }
          }
        }

        return a;
      })(a,s);
      if (err) {
        break;
      }
    }

    // check named args for optional args, named args are last
    var namedArgsToCheck = (a < args.length && (typeof args[a]) === "object");
    if (namedArgsToCheck) {
      var namedArgs = args[a];
      var foundNamedArg = _checkNamedArgs(namedArgs, scheme, returns);
    }

    if (err && (!namedArgsToCheck || !foundNamedArg)) {
      throw new Error(err);
    }

    return returns;
  };

  Args.STRING       = 0x1;
  Args.FUNCTION     = 0x1 << 1;
  Args.INT          = 0x1 << 2;
  Args.FLOAT        = 0x1 << 3;
  Args.ARRAY_BUFFER = 0x1 << 4;
  Args.OBJECT       = 0x1 << 5;
  Args.DATE         = 0x1 << 6;
  Args.BOOL         = 0x1 << 7;
  Args.DOM_EL       = 0x1 << 8;
  Args.ARRAY        = 0x1 << 9;


  Args.Optional     = 0x1 << 10;
  Args.NotNull      =
  Args.Required     = 0x1 << 11;

  return Args;
})();


try {
  module.exports = Args;
} catch (e) {}