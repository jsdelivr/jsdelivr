!function(e, n) {
    "object" == typeof exports && "object" == typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define([], n) : "object" == typeof exports ? exports.Synthes = n() : e.Synthes = n();
}(this, function() {
    return function(e) {
        function n(o) {
            if (t[o]) return t[o].exports;
            var r = t[o] = {
                exports: {},
                id: o,
                loaded: !1
            };
            return e[o].call(r.exports, r, r.exports, n), r.loaded = !0, r.exports;
        }
        var t = {};
        return n.m = e, n.c = t, n.p = "", n(0);
    }([ function(e, n, t) {
        "use strict";
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = t(1), i = o(r), d = function() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? null : arguments[0], n = arguments.length <= 1 || void 0 === arguments[1] ? null : arguments[1], t = {};
            t.template = e, t.sandbox = n && 1 == n.nodeType ? n : "string" == typeof n ? document.querySelectorAll(n)[0] : null, 
            t.node = e ? (0, i["default"])(e) : null, t.WRAPPER = document.createElement("wrapper"), 
            t.string = null, t.softDelete = !1, t.isRendered = !1, t.softDeleteDisplay = t.node ? 0 == t.node.style.display.length ? "block" : t.node.style.display : "block", 
            t.node && (t.WRAPPER.appendChild(t.node.cloneNode(!0)), t.string = t.WRAPPER.innerHTML);
            var o = {
                render: function() {
                    return t.sandbox && t.node && (t.softDelete ? (this.node.style.display = t.softDeleteDisplay, 
                    t.softDelete = !1) : t.sandbox.appendChild(t.node) && (t.isRendered = !0)), this;
                },
                bind: function(e) {
                    return t.sandbox = e && 1 == e.nodeType ? e : null, t.isRendered && this.render(), 
                    this;
                },
                remove: function() {
                    var e = !(arguments.length <= 0 || void 0 === arguments[0]) && arguments[0];
                    return e ? this.node && (this.node.style.display = "none", t.softDelete = !0) : (this.node.remove(), 
                    t.softDelete = !1), this;
                },
                node: null,
                string: null,
                template: t.template,
                isSynthes: !0
            };
            return Object.defineProperty(o, "template", {
                set: function(e) {
                    t.template = e;
                    var n = (0, i["default"])(t.template);
                    t.isRendered && (n && t.node.parentNode.insertBefore(n, t.node), t.node.remove(), 
                    t.isRendered = !1), t.node = n, n = null, t.WRAPPER.innerHTML = "", t.node ? (t.WRAPPER.appendChild(t.node.cloneNode(!0)), 
                    t.string = t.WRAPPER.innerHTML) : t.string = null;
                },
                get: function() {
                    return t.template;
                },
                configurable: !1
            }), Object.defineProperty(o, "sandbox", {
                set: function(e) {
                    t.sandbox = 1 == e.nodeType ? e : null, t.node.remove(), t.isRendered && this.render();
                },
                get: function() {
                    return t.sandbox;
                },
                configurable: !1
            }), Object.defineProperty(o, "node", {
                set: function() {},
                get: function() {
                    return t.node;
                },
                configurable: !1
            }), Object.defineProperty(o, "string", {
                set: function() {},
                get: function() {
                    return t.string;
                },
                configurable: !1
            }), Object.defineProperty(o, "isSynthes", {
                value: !0,
                writable: !1,
                configurable: !1
            }), o;
        };
        n["default"] = d, e.exports = n["default"];
    }, function(e, n, t) {
        "use strict";
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function r(e, n, t) {
            return n in e ? Object.defineProperty(e, n, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[n] = t, e;
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e;
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e;
        }, d = t(2), l = o(d), s = t(3), u = o(s), f = function() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? null : arguments[0];
            if ("object" != ("undefined" == typeof e ? "undefined" : i(e))) return null;
            var n = function t() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? null : arguments[0], n = function() {
                    var e = arguments.length <= 0 || void 0 === arguments[0] ? "span" : arguments[0];
                    return document.createElement(e);
                }, o = Object.keys(e)[0], i = (0, l["default"])(o), d = i.NODE, s = i.classlist, f = n(d);
                if ("string" == typeof e[o] || null == e[o]) return f.innerHTML = e[o] || "", (0, 
                u["default"])(f, s);
                if (e[o] instanceof Array) {
                    for (var a in e[o]) e[o][a].isSynthes && e[o][a].node ? f.appendChild(e[o][a].node) : f.appendChild(t(e[o][a]));
                    return (0, u["default"])(f, s);
                }
                if (e[o] instanceof Object) for (var c in e[o]) "content" != c && (e[o][c] instanceof Object || e[o][c] instanceof Array ? e[o][c].isSynthes && e[o][c].node ? f.appendChild(e[o][c].node) : f.appendChild(t(r({}, c, e[o][c]))) : "string" == typeof e[o][c] && ("$" == c[0] ? f.appendChild(t(r({}, c.slice(1), e[o][c]))) : f.setAttribute(c, e[o][c])));
                if (e[o].content) if (e[o].content instanceof Array) for (var p in e[o].content) e[o].content[p].isSynthes && e[o].content[p].node ? f.appendChild(e[o].content[p].node) : f.appendChild(t(e[o].content[p])); else {
                    if (e[o].content instanceof Object) {
                        if (e[o].content.isSynthes && e[o].content.node) f.appendChild(e[o].content.node); else {
                            var y = Object.keys(e[o].content)[0];
                            if (e[o].content[y] instanceof Object) for (var b in e[o].content) f.appendChild(t(r({}, b, e[o].content[b]))); else f.appendChild(t(e[o].content));
                        }
                        return (0, u["default"])(f, s);
                    }
                    "string" == typeof e[o].content && (f.innerHTML = e[o].content);
                }
                return (0, u["default"])(f, s);
            };
            return n(e);
        };
        n["default"] = f, e.exports = n["default"];
    }, function(e, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var t = function(e) {
            var n = e.split(".");
            return {
                NODE: n.shift(),
                classlist: n
            };
        };
        n["default"] = t, e.exports = n["default"];
    }, function(e, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var t = function(e, n) {
            return n.forEach(function(n) {
                e.classList.add(n);
            }), e;
        };
        n["default"] = t, e.exports = n["default"];
    } ]);
});
