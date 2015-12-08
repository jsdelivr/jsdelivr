/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:33 GMT
 * Licensed MIT
 * Includes: can/route/pushstate
 * Download from: http://canjs.com
 */
(function(undefined) {

    // ## route/pushstate/pushstate.js
    var __m1 = (function(can) {
        "use strict";

        if (window.history && history.pushState) {
            can.route.bindings.pushstate = {

                root: "/",
                paramsMatcher: /^\?(?:[^=]+=[^&]*&)*[^=]+=[^&]*/,
                querySeparator: '?',
                bind: function() {
                    // intercept routable links
                    can.delegate.call(can.$(document.documentElement), 'a', 'click', anchorClickFix);

                    // popstate only fires on back/forward.
                    // To detect when someone calls push/replaceState, we need to wrap each method.
                    can.each(['pushState', 'replaceState'], function(method) {
                        originalMethods[method] = window.history[method];
                        window.history[method] = function(state, title, url) {
                            // avoid doubled history states (with pushState)
                            var absolute = url.indexOf("http") === 0;
                            var searchHash = window.location.search + window.location.hash;
                            if ((!absolute && url !== window.location.pathname + searchHash) || (absolute && url !== window.location.href + searchHash)) {
                                originalMethods[method].apply(window.history, arguments);
                                can.route.setState();
                            }
                        };
                    });

                    // Bind to popstate for back/forward
                    can.bind.call(window, 'popstate', can.route.setState);
                },
                unbind: function() {
                    can.undelegate.call(can.$(document.documentElement), 'click', 'a', anchorClickFix);

                    can.each(['pushState', 'replaceState'], function(method) {
                        window.history[method] = originalMethods[method];
                    });
                    can.unbind.call(window, 'popstate', can.route.setState);
                },
                matchingPartOfURL: function() {
                    var root = cleanRoot(),
                        loc = (location.pathname + location.search),
                        index = loc.indexOf(root);

                    return loc.substr(index + root.length);
                },
                setURL: function(path) {
                    // keep hash if not in path, but in 
                    if (includeHash && path.indexOf("#") === -1 && window.location.hash) {
                        path += window.location.hash;
                    }
                    window.history.pushState(null, null, can.route._call("root") + path);
                }
            };

            var anchorClickFix = function(e) {
                if (!(e.isDefaultPrevented ? e.isDefaultPrevented() : e.defaultPrevented === true)) {
                    // YUI calls back events triggered with this as a wrapped object
                    var node = this._node || this;
                    // Fix for ie showing blank host, but blank host means current host.
                    var linksHost = node.host || window.location.host;
                    // if link is within the same domain
                    if (window.location.host === linksHost) {
                        // if link is a descendant of `root`
                        var root = can.route._call("root");
                        if (node.pathname.indexOf(root) === 0) {
                            // remove `root` from url
                            var url = (node.pathname + node.search)
                                .substr(root.length);
                            var curParams = can.route.deparam(url);
                            // if a route matches
                            if (curParams.hasOwnProperty('route')) {
                                // make it possible to have a link with a hash
                                includeHash = true;
                                // update the data
                                window.history.pushState(null, null, node.href);
                                // test if you can preventDefault
                                // our tests can't call .click() b/c this
                                // freezes phantom
                                if (e.preventDefault) {
                                    e.preventDefault();
                                }
                            }
                        }
                    }
                }
            },
                cleanRoot = function() {
                    var domain = location.protocol + "//" + location.host,
                        root = can.route._call("root"),
                        index = root.indexOf(domain);
                    if (index === 0) {
                        return can.route.root.substr(domain.length);
                    }
                    return root;
                },
                // a collection of methods on history that we are overwriting
                originalMethods = {},
                // used to tell setURL to include the hash because 
                // we clicked on a link
                includeHash = false;

            can.route.defaultBinding = "pushstate";

        }

        return can;
    })(window.can, undefined);

})();