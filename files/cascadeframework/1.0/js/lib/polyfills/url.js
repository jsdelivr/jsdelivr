// URL Polyfill
// Draft specification: http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html

// Notes:
// - Primarily useful for parsing URLs and modifying query parameters
// - The |username| and |password| attribute are not supported

// Browser variations not normalized:
// - Firefox (6-9) does not support |origin| attribute
// - Opera (~11) does not support |origin| attribute
// - IE (8+/-?) does not support |origin| attribute
// - IE (8+/-?) does not include leading '/' in |pathname| attribute
// - IE (8+/-?) includes default port in |host| attribute

(function () {
  "use strict";

  // Detect for ES5 getter/setter support
  var ES5_GET_SET = (Object.defineProperties && (function () {
    var o = {}; Object.defineProperties(o, {p: {'get': function () { return true; }}}); return o.p; }()));

  // Implementation of 2.2 Collect URL Parameters
  function collectParameters(string) {
    var result = [], parameters;
    parameters = string.split('&');
    parameters.forEach(
      function (parameter) {
        if (!parameter.length) {
          return;
        }
        var index = parameter.indexOf('=');
        if (index === -1) {
          result.push([decodeURIComponent(parameter), null]);
        } else {
          result.push([decodeURIComponent(parameter.substring(0, index)),
                       decodeURIComponent(parameter.substring(index + 1))]);
        }
      }
    );
    return result;
  }

  // Implementation of 2.3 URL Parameter Serialization
  function serializeParameters(parameters) {
    var result = [];
    parameters.forEach(
      function (parameter) {
        var s = encodeURIComponent(parameter[0]);
        if (parameter[1] !== null) {
          s += '=';
          s += encodeURIComponent(parameter[1]);
        }
        result.push(s);
      }
    );
    return result.join('&');
  }

  // Strip empty query/hash
  function tidy(anchor) {
    var href = anchor.href.replace(/#$|\?$|\?(?=#)/g, '');
    if (anchor.href !== href) {
      anchor.href = href;
    }
  }

  // Sync extension properties if getters/setters not supported
  function update(anchor) {
    tidy(anchor);

    anchor.parameterNames = collectParameters(anchor.search.substring(1)).map(
      function (parameter) {
        return parameter[0];
      }
    );

    anchor.filename = anchor.pathname.replace(/^[\u0000-\uffff]*\//, '');
  }

  // Methods added to URL instances
  var prototype = {
    getParameter: function getParameter(name) {
      var values = this.getParameterAll(name);
      if (!values.length) {
        return '';
      }
      return values[values.length - 1];
    },

    getParameterAll: function getParameterAll(name) {
      name = String(name);
      var parameters = collectParameters(this.search.substring(1)), result = [];
      parameters.forEach(
        function (parameter) {
          if (parameter[0] === name) {
            result.push(parameter[1]);
          }
        }
      );
      return result;
    },

    appendParameter: function appendParameter(name, values) {
      name = String(name);
      var parameters = collectParameters(this.search.substring(1));
      if (Array.isArray(values)) {
        values.forEach(
          function (value) {
            parameters.push([name, value]);
          }
        );
      } else {
        parameters.push([name, values]);
      }
      this.search = serializeParameters(parameters);
    },

    clearParameter: function clearParameter(name) {
      name = String(name);
      var parameters = collectParameters(this.search.substring(1));
      parameters = parameters.filter(
        function (parameter) {
          return (parameter[0] !== name);
        }
      );
      this.search = serializeParameters(parameters);
    }
  };

  // NOTE: Firefox has a global URL object defined, overridden here
  if (typeof window.URL !== 'function') {
    window.URL = function URL(url, baseURL) {

      var doc, base, anchor;
      if (baseURL) {
        // Use another document/base tag/anchor for relative URL resolution, if possible
        if (document.implementation && document.implementation.createHTMLDocument) {
          doc = document.implementation.createHTMLDocument("");
        } else if (document.implementation && document.implementation.createDocument) {
          doc = document.implementation.createElement('http://www.w3.org/1999/xhtml', 'html', null);
          doc.documentElement.appendChild(doc.createElement('head'));
          doc.documentElement.appendChild(doc.createElement('body'));
        } else if (window.ActiveXObject) {
          doc = new ActiveXObject("htmlfile");
          doc.write("<head></head><body></body>");
          doc.close();
        }

        if (!doc) {
          throw new Error("baseURL not supported");
        }

        base = doc.createElement("base");
        base.href = baseURL;
        doc.getElementsByTagName("head")[0].appendChild(base);
        anchor = doc.createElement("a");
        anchor.href = url;
        url = anchor.href;
      }

      // Use an actual HTMLAnchorElement instance since the semantics
      // are pretty close.
      anchor = document.createElement('a');
      anchor.href = url || "";

      if (ES5_GET_SET) {
        // Use ES5 getters/setters to provide full API if supported, wrapping anchor
        // functionality

        // Allow calling as function or constructor
        if (!(this instanceof URL)) { return new URL(url); }

        Object.defineProperties(this, {
          protocol: {
            get: function () { return anchor.protocol; },
            set: function (v) { anchor.protocol = v; }
          },
          host: {
            get: function () { return anchor.host; },
            set: function (v) { anchor.host = v; }
          },
          hostname: {
            get: function () { return anchor.hostname; },
            set: function (v) { anchor.hostname = v; }
          },
          port: {
            get: function () { return anchor.port; },
            set: function (v) { anchor.port = v; }
          },
          pathname: {
            get: function () { return anchor.pathname; },
            set: function (v) { anchor.pathname = v; }
          },
          search: {
            get: function () { return anchor.search; },
            set: function (v) { anchor.search = v; tidy(anchor); }
          },
          hash: {
            get: function () { return anchor.hash; },
            set: function (v) { anchor.hash = v; tidy(anchor); }
          },
          filename: {
            get: function () { return this.pathname.replace(/^[\u0000-\uffff]*\//, ''); }
          },
          origin: {
            get: function () { return anchor.origin; } // TODO: Shim if undefined
          },
          parameterNames: {
            get: function () {
              return collectParameters(this.search.substring(1)).map(
                function (parameter) {
                  return parameter[0];
                });
            }
          },
          href: {
            get: function () { return anchor.href; },
            set: function (v) { anchor.href = v; tidy(anchor); }
          }
        });

        return this;

      } else {
        // If no ES5 getter/setter support, return the anchor tag itself, augmented with additional properties

        // Initial sync of extension attributes
        update(anchor);

        // Keep extension attributes synced on change, if possible
        if (anchor.addEventListener) {
          anchor.addEventListener(
            'DOMAttrModified',
            function(e) {
              if (e.attrName === 'href') {
                update(e.target);
              }
            },
            false);
        } else if (anchor.attachEvent) {
          anchor.attachEvent(
            'onpropertychange',
            function(e) {
              if (e.propertyName === 'href') {
                update(anchor);
              }
            });
          // Must be member of document to observe changes
          anchor.style.display = 'none';
          document.appendChild(anchor);
        }

        // Add URL API methods
        anchor.getParameter = prototype.getParameter;
        anchor.getParameterAll = prototype.getParameterAll;
        anchor.appendParameter = function appendParameter(name, value) { prototype.appendParameter.call(anchor, name, value); update(anchor); };
        anchor.clearParameter = function clearParameter(name) { prototype.clearParameter.call(anchor, name); update(anchor); };

        return anchor;
      }
    };

    if (ES5_GET_SET) {
      URL.prototype = prototype;
    }
  }

} ());
