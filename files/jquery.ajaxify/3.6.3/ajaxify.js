(function ($) {
    var Log = function (options) {
        var d = [];
        var con = window.console;
        var settings = $.extend({
            verbosity: 0
        }, options);
        verbosity = settings["verbosity"];
        this.a = function ($this, m) {
            l < verbosity && con && con.log(m);
        };
    };
    $.log = function (m, options) {
        var r;
        var $this = "";
        $.log.o = $.log.o ? $.log.o : new Log(options);
        r = $.log.o.a($this, m);
        return r;
    };
})(jQuery);

function _addAll(PK) {
    var r = false;
    l++;
    $.log(l + " | _addAll | PK | " + showArgs(arguments));
    return l--, addAll.replace(/PK/g, PK);
    l--;
    return r;
};

(function ($) {
    var All = function () {
        var d = [];
        this.a = function ($this, t, fn) {
            var r = false;
            l++;
            $.log(l + " | all | $this, t, fn | " + showArgs(arguments));
            $this.each(function () {
                t = t.split("*").join("$(this)");
                t += ";";
                eval(t);
            });
            l--;
            return r;;
        };
    };
    $.fn.all = function (t, fn) {
        var r;
        var $this = $(this);
        $.fn.all.o = $.fn.all.o ? $.fn.all.o : new All();
        r = $.fn.all.o.a($this, t, fn);
        return $this;
    };
})(jQuery);

function _isHtml(x) {
    var d = [];
    var r = false;
    l++;
    $.log(l + " | _isHtml | x | " + showArgs(arguments));
    return l--, (d = x.getResponseHeader("Content-Type")), d && (d.indexOf("text/html") + 1 || d.indexOf("text/xml") + 1);
    l--;
    return r;
};

function _replD(h) {
    var r = false;
    l++;
    $.log(l + " | _replD | h | " + showArgs(arguments));
    return l--, String(h).replace(docType, "").replace(tagso, div12).replace(tagsc, "</div>");
    l--;
    return r;
};

function _parseHTML(h) {
    var r = false;
    l++;
    $.log(l + " | _parseHTML | h | " + showArgs(arguments));
    return l--, $.trim(_replD(h));
    l--;
    return r;
};

(function ($) {
    var Pages = function () {
        var d = [];
        this.a = function ($this, h) {
            var r = false;
            l++;
            $.log(l + " | pages | $this, h | " + showArgs(arguments));
            if (typeof h === "string") {
                for (var i = 0; i < d.length; i++)
                    if (d[i][0] == h) return l--, d[i][1]
            }
            if (typeof h === "object") {
                d.push(h)
            }

            ;
            l--;
            return r;;
        };
    };
    $.pages = function (h) {
        var r;
        var $this = "";
        $.pages.o = $.pages.o ? $.pages.o : new Pages();
        r = $.pages.o.a($this, h);
        return r;
    };
})(jQuery);

(function ($) {
    var Memory = function (options) {
        var d = [];
        var settings = $.extend({
            memoryoff: false
        }, options);
        memoryoff = settings["memoryoff"];
        this.a = function ($this, h) {
            var r = false;
            l++;
            $.log(l + " | memory | $this, h | " + showArgs(arguments));
            d = memoryoff;
            if (!h || d == true) return l--, null;
            if (d == false) return l--, h;
            if (d.indexOf(", ") + 1) {
                d = d.split(", ");
                for (var i = 0, r = h; i < d.length; i++)
                    if (h == d[i]) return l--, null;
            }
            return l--, h == d ? null : h;
            l--;
            return r;;
        };
    };
    $.memory = function (h, options) {
        var r;
        var $this = "";
        $.memory.o = $.memory.o ? $.memory.o : new Memory(options);
        r = $.memory.o.a($this, h);
        return r;
    };
})(jQuery);

(function ($) {
    var Cache1 = function () {
        var d = [];
        this.a = function ($this, o, h) {
            var r = false;
            l++;
            $.log(l + " | cache1 | $this, o, h | " + showArgs(arguments));
            if (o === "?") {
                return l--, d
            }
            if (o === "+") {
                d = $.memory(h);
                d = d ? $.pages(d) : null
            }
            if (o === "!") {
                d = h
            }

            ;
            l--;
            return r;;
        };
    };
    $.cache1 = function (o, h) {
        var r;
        var $this = "";
        $.cache1.o = $.cache1.o ? $.cache1.o : new Cache1();
        r = $.cache1.o.a($this, o, h);
        return r;
    };
})(jQuery);

(function ($) {
    var LDivs = function () {
        var d = [];
        this.a = function ($this) {
            var r = false;
            l++;
            $.log(l + " | lDivs | $this | " + showArgs(arguments));
            $this.all("fn(*)", function (s) {
                s.html($.cache1("?").find("#" + s.attr("id")).html());
            });
            l--;
            return r;;
        };
    };
    $.fn.lDivs = function () {
        var r;
        var $this = $(this);
        $.fn.lDivs.o = $.fn.lDivs.o ? $.fn.lDivs.o : new LDivs();
        r = $.fn.lDivs.o.a($this);
        return $this;
    };
})(jQuery);

(function ($) {
    var LAjax = function () {
        var d = [];
        this.a = function ($this, hin, p, post) {
            var r = false;
            l++;
            $.log(l + " | lAjax | $this, hin, p, post | " + showArgs(arguments));
            var xhr = $.ajax({
                url: hin,
                type: post ? "POST" : "GET",
                data: post ? post.data : null,
                success: function (h) {
                    if (!h || !_isHtml(xhr)) {
                        location = hin;
                    }
                    $.cache1("!", $(_parseHTML(h)));
                    $.cache1("?").find(".ignore").remove();
                    $.pages([hin, $.cache1("?")]);
                    p && p();
                }
            });
            l--;
            return r;;
        };
    };
    $.lAjax = function (hin, p, post) {
        var r;
        var $this = "";
        $.lAjax.o = $.lAjax.o ? $.lAjax.o : new LAjax();
        r = $.lAjax.o.a($this, hin, p, post);
        return r;
    };
})(jQuery);

function _lPage(hin, p, post) {
    var r = false;
    l++;
    $.log(l + " | _lPage | hin, p, post | " + showArgs(arguments));
    if (hin.indexOf("#") + 1) hin = hin.split("#")[0];
    $.cache1("+", post ? null : hin);
    if (!$.cache1("?")) return l--, $.lAjax(hin, p, post);
    p && p();
    l--;
    return r;
};

(function ($) {
    var GetPage = function () {
        var d = [];
        this.a = function ($this, t, p, post) {
            var r = false;
            l++;
            $.log(l + " | getPage | $this, t, p, post | " + showArgs(arguments));
            if (!t) return l--, $.cache1("?");
            if (t.indexOf("/") != -1) return l--, _lPage(t, p, post);
            if (t == "+") _lPage(p);
            else {
                if (t.charAt(0) == "#") {
                    $.cache1("?").find(t).html(p);
                    t = "-";
                }
                if (t == "-") return l--, $this.lDivs();
                return l--, $.cache1("?").find(".ajy-" + t).detach();
            };
            l--;
            return r;;
        };
    };
    $.fn.getPage = function (t, p, post) {
        var r;
        var $this = $(this);
        $.fn.getPage.o = $.fn.getPage.o ? $.fn.getPage.o : new GetPage();
        r = $.fn.getPage.o.a($this, t, p, post);
        return r;
    };
})(jQuery);

function _insertScript($S, PK) {
    var r = false;
    l++;
    $.log(l + " | _insertScript | $S, PK | " + showArgs(arguments));
    $("head").append((PK == "href" ? linki : scri).replace("*", $S));
    l--;
    return r;
};

function _removeScript($S, PK) {
    var r = false;
    l++;
    $.log(l + " | _removeScript | $S, PK | " + showArgs(arguments));
    $((PK == "href" ? linkr : scrr).replace("!", $S)).remove();
    l--;
    return r;
};

function _findScript($S, $Scripts) {
    var r = false;
    l++;
    $.log(l + " | _findScript | $S, $Scripts | " + showArgs(arguments));
    if ($S)
        for (var i = 0; i < $Scripts.length; i++)
            if ($Scripts[i][0] == $S) {
                $Scripts[i][1] = 1;
                return l--, true;
            };
    l--;
    return r;
};

(function ($) {
    var AllScripts = function () {
        var d = [];
        this.a = function ($this, PK, deltas) {
            var r = false;
            l++;
            $.log(l + " | allScripts | $this, PK, deltas | " + showArgs(arguments));
            if (!deltas) {
                $this.each(function () {
                    _insertScript($(this)[0], PK);
                });
                return l--, true;
            };
            l--;
            return r;;
        };
    };
    $.fn.allScripts = function (PK, deltas) {
        var r;
        var $this = $(this);
        $.fn.allScripts.o = $.fn.allScripts.o ? $.fn.allScripts.o : new AllScripts();
        r = $.fn.allScripts.o.a($this, PK, deltas);
        return r;
    };
})(jQuery);

(function ($) {
    var ClassAlways = function () {
        var d = [];
        this.a = function ($this, PK) {
            var r = false;
            l++;
            $.log(l + " | classAlways | $this, PK | " + showArgs(arguments));
            $this.each(function () {
                if ($(this).attr("data-class") == "always") {
                    _insertScript($(this).attr(PK), PK);
                    $(this).remove();
                }
            });
            l--;
            return r;;
        };
    };
    $.fn.classAlways = function (PK) {
        var r;
        var $this = $(this);
        $.fn.classAlways.o = $.fn.classAlways.o ? $.fn.classAlways.o : new ClassAlways();
        r = $.fn.classAlways.o.a($this, PK);
        return $this;
    };
})(jQuery);

function _sameScripts(sN, PK) {
    var r = false;
    l++;
    $.log(l + " | _sameScripts | sN, PK | " + showArgs(arguments));
    for (var i = 0; i < sN.length; i++)
        if (sN[i][1] == 0) _insertScript(sN[i][0], PK);
    l--;
    return r;
};

(function ($) {
    var NewArray = function () {
        var d = [];
        this.a = function ($this, sN, sO, PK, pass) {
            var r = false;
            l++;
            $.log(l + " | newArray | $this, sN, sO, PK, pass | " + showArgs(arguments));
            $this.each(function () {
                sN.push([$(this).attr(PK), 0]);
                if (!pass) sO.push([$(this).attr(PK), 0]);
            });
            l--;
            return r;;
        };
    };
    $.fn.newArray = function (sN, sO, PK, pass) {
        var r;
        var $this = $(this);
        $.fn.newArray.o = $.fn.newArray.o ? $.fn.newArray.o : new NewArray();
        r = $.fn.newArray.o.a($this, sN, sO, PK, pass);
        return $this;
    };
})(jQuery);

function _findCommon(s, sN) {
    var r = false;
    l++;
    $.log(l + " | _findCommon | s, sN | " + showArgs(arguments));
    for (var i = 0; i < s.length; i++) {
        s[i][1] = 2;
        if (_findScript(s[i][0], sN)) s[i][1] = 1
    };
    l--;
    return r;
};

function _freeOld(s, PK) {
    var r = false;
    l++;
    $.log(l + " | _freeOld | s, PK | " + showArgs(arguments));
    for (var i = 0; i < s.length; i++)
        if (s[i][1] == 2 && s[i][0]) _removeScript(s[i][0], PK);
    l--;
    return r;
};

function _realNew(s, PK) {
    var r = false;
    l++;
    $.log(l + " | _realNew | s, PK | " + showArgs(arguments));
    for (var i = 0; i < s.length; i++)
        if (s[i][1] == 0) _insertScript(s[i][0], PK);
    l--;
    return r;
};

(function ($) {
    var AddHrefs = function (options) {
        var d = [];
        var $scriptsO = [],
            $scriptsN = [],
            pass = 0;
        var settings = $.extend({
            "deltas": true
        }, options);
        deltas = settings["deltas"];
        this.a = function ($this, same) {
            var r = false;
            l++;
            $.log(l + " | addHrefs  | $this, same | " + showArgs(arguments));
            if (!$this.allScripts("href", deltas)) {
                if (pass) $this.classAlways("href");
                if (same) return l--, _sameScripts($scriptsN, "href");
                $scriptsN = [];
                $this.newArray($scriptsN, $scriptsO, "href", pass);
                if (pass++) {
                    _findCommon($scriptsO, $scriptsN);
                    _freeOld($scriptsO, "href");
                    _realNew($scriptsN, "href");
                    $scriptsO = $scriptsN.slice()
                }
            };
            l--;
            return r;;
        };
    };
    $.fn.addHrefs = function (same, options) {
        var r;
        var $this = $(this);
        $.fn.addHrefs.o = $.fn.addHrefs.o ? $.fn.addHrefs.o : new AddHrefs(options);
        r = $.fn.addHrefs.o.a($this, same);
        return r;
    };
})(jQuery);

(function ($) {
    var AddSrcs = function (options) {
        var d = [];
        var $scriptsO = [],
            $scriptsN = [],
            pass = 0;
        var settings = $.extend({
            "deltas": true
        }, options);
        deltas = settings["deltas"];
        this.a = function ($this, same) {
            var r = false;
            l++;
            $.log(l + " | addSrcs  | $this, same | " + showArgs(arguments));
            if (!$this.allScripts("src", deltas)) {
                if (pass) $this.classAlways("src");
                if (same) return l--, _sameScripts($scriptsN, "src");
                $scriptsN = [];
                $this.newArray($scriptsN, $scriptsO, "src", pass);
                if (pass++) {
                    _findCommon($scriptsO, $scriptsN);
                    _freeOld($scriptsO, "src");
                    _realNew($scriptsN, "src");
                    $scriptsO = $scriptsN.slice()
                }
            };
            l--;
            return r;;
        };
    };
    $.fn.addSrcs = function (same, options) {
        var r;
        var $this = $(this);
        $.fn.addSrcs.o = $.fn.addSrcs.o ? $.fn.addSrcs.o : new AddSrcs(options);
        r = $.fn.addSrcs.o.a($this, same);
        return r;
    };
})(jQuery);

function _detScripts(same, $s) {
    var r = false;
    l++;
    $.log(l + " | _detScripts | same, $s | " + showArgs(arguments));
    if (!same) {
        var links = $().getPage("link"),
            jss = $().getPage("script");
        $s.c = links.filter(function () {
            return $(this).attr("rel").indexOf("stylesheet") != -1;
        });
        $s.s = jss.filter(function () {
            return $(this).attr("src");
        });
        $s.t = jss.filter(function () {
            return !($(this).attr("src"));
        });
    };
    l--;
    return r;
};

function _inline(txt, s) {
    var d = [];
    var r = false;
    l++;
    $.log(l + " | _inline | txt, s | " + showArgs(arguments));
    d = s["inlinehints"];
    if (d) {
        d = d.split(", ");
        for (var i = 0; i < d.length; i++)
            if (txt.indexOf(d[i]) + 1) return l--, true;
    };
    l--;
    return r;
};

function _addtext(t) {
    var r = false;
    l++;
    $.log(l + " | _addtext | t | " + showArgs(arguments));
    try {
        $.globalEval(t);
    } catch (e) {
        alert(e);
    };
    l--;
    return r;
};

(function ($) {
    var Alltxts = function () {
        var d = [];
        this.a = function ($this, s) {
            var r = false;
            l++;
            $.log(l + " | alltxts | $this, s | " + showArgs(arguments));
            $this.each(function () {
                d = $(this).html();
                if (d.indexOf(").ajaxify(") == -1 && (s["inline"] || $(this).hasClass("ajaxy") || _inline(d, s))) {
                    _addtext(d)
                }
                r = true;
            });
            l--;
            return r;;
        };
    };
    $.fn.alltxts = function (s) {
        var r;
        var $this = $(this);
        $.fn.alltxts.o = $.fn.alltxts.o ? $.fn.alltxts.o : new Alltxts();
        r = $.fn.alltxts.o.a($this, s);
        return r;
    };
})(jQuery);

function _addScripts(same, $s, st) {
    var r = false;
    l++;
    $.log(l + " | _addScripts | same, $s, st | " + showArgs(arguments));
    $s.c.addHrefs(same, st);
    $s.s.addSrcs(same, st);
    $s.t.alltxts(st);
    l--;
    return r;
};

(function ($) {
    var Scripts = function (options) {
        var d = [];
        var $scripts = $(),
            pass = 0;
        var settings = $.extend({
            "deltas": true
        }, options);
        deltas = settings["deltas"];
        this.a = function ($this, same) {
            var r = false;
            l++;
            $.log(l + " | scripts | $this, same | " + showArgs(arguments));
            _detScripts(same, $scripts);
            if (pass++) _addScripts(same, $scripts, settings);
            else {
                $scripts.c.addHrefs(same, settings);
                $scripts.s.addSrcs(same, settings);
            };
            l--;
            return r;;
        };
    };
    $.scripts = function (same, options) {
        var r;
        var $this = "";
        $.scripts.o = $.scripts.o ? $.scripts.o : new Scripts(options);
        r = $.scripts.o.a($this, same);
        return r;
    };
})(jQuery);

(function ($) {
    var CPage = function (options) {
        var d = [];
        var settings = $.extend({
            cb: null
        }, options);
        cb = settings["cb"];
        this.a = function ($this, o) {
            var r = false;
            l++;
            $.log(l + " | cPage | $this, o | " + showArgs(arguments));
            if (typeof o === "undefined") {
                $.scripts(null, settings);
                if (cb) cb()
            }
            if (typeof o === "boolean") {
                $.scripts(o, settings)
            }
            if (typeof o === "string") {}

            ;
            l--;
            return r;;
        };
    };
    $.cPage = function (o, options) {
        var r;
        var $this = "";
        $.cPage.o = $.cPage.o ? $.cPage.o : new CPage(options);
        r = $.cPage.o.a($this, o);
        return r;
    };
})(jQuery);

function _initPage(e) {
    var r = false;
    l++;
    $.log(l + " | _initPage | e | " + showArgs(arguments));
    $.cPage(e && e.same);
    l--;
    return r;
};

function _outjs(s) {
    if (s["outjs"]) $.log(jsout)
};

function _initAjaxify(s) {
    var d = [];
    var r = false;
    l++;
    $.log(l + " | _initAjaxify | s | " + showArgs(arguments));
    d = window.history && window.history.pushState && window.history.replaceState;
    if (d && s["pluginon"]) {
        _outjs(s);
        $.memory(null, s);
        $.cPage("", s);
        return l--, true
    };
    l--;
    return r;
};

(function ($) {
    var Ajaxify = function (options) {
        var d = [];
        var settings = $.extend({
            selector: "a:not(.no-ajaxy)",
            requestKey: "pronto",
            requestDelay: 0,
            verbosity: 0,
            deltas: true,
            inline: false,
            memoryoff: false,
            cb: null,
            pluginon: true
        }, options);
        selector = settings["selector"];
        requestKey = settings["requestKey"];
        requestDelay = settings["requestDelay"];
        verbosity = settings["verbosity"];
        deltas = settings["deltas"];
        inline = settings["inline"];
        memoryoff = settings["memoryoff"];
        cb = settings["cb"];
        pluginon = settings["pluginon"];
        this.a = function ($this) {
            $(function () {
                $.log("Entering ajaxify...", settings);
                if (_initAjaxify(settings)) {
                    $this.pronto(settings);
                    $(window).on("pronto.render", _initPage);
                    $().getPage(location.href, $.cPage);
                }
            });
        };
    };
    $.fn.ajaxify = function (options) {
        var r;
        var $this = $(this);
        $.fn.ajaxify.o = $.fn.ajaxify.o ? $.fn.ajaxify.o : new Ajaxify(options);
        r = $.fn.ajaxify.o.a($this);
        return $this;
    };
})(jQuery);﻿
(function (e) {
    e.fn.hoverIntent = function (t, n, r) {
        var i = {
            interval: 100,
            sensitivity: 7,
            timeout: 0
        };
        if (typeof t === "object") {
            i = e.extend(i, t)
        } else if (e.isFunction(n)) {
            i = e.extend(i, {
                over: t,
                out: n,
                selector: r
            })
        } else {
            i = e.extend(i, {
                over: t,
                out: t,
                selector: n
            })
        }
        var s, o, u, a;
        var f = function (e) {
            s = e.pageX;
            o = e.pageY
        };
        var l = function (t, n) {
            n.hoverIntent_t = clearTimeout(n.hoverIntent_t);
            if (Math.abs(u - s) + Math.abs(a - o) < i.sensitivity) {
                e(n).off("mousemove.hoverIntent", f);
                n.hoverIntent_s = 1;
                return i.over.apply(n, [t])
            } else {
                u = s;
                a = o;
                n.hoverIntent_t = setTimeout(function () {
                    l(t, n)
                }, i.interval)
            }
        };
        var c = function (e, t) {
            t.hoverIntent_t = clearTimeout(t.hoverIntent_t);
            t.hoverIntent_s = 0;
            return i.out.apply(t, [e])
        };
        var h = function (t) {
            var n = jQuery.extend({}, t);
            var r = this;
            if (r.hoverIntent_t) {
                r.hoverIntent_t = clearTimeout(r.hoverIntent_t)
            }
            if (t.type == "mouseenter") {
                u = n.pageX;
                a = n.pageY;
                e(r).on("mousemove.hoverIntent", f);
                if (r.hoverIntent_s != 1) {
                    r.hoverIntent_t = setTimeout(function () {
                        l(n, r)
                    }, i.interval)
                }
            } else {
                e(r).off("mousemove.hoverIntent", f);
                if (r.hoverIntent_s == 1) {
                    r.hoverIntent_t = setTimeout(function () {
                        c(n, r)
                    }, i.timeout)
                }
            }
        };
        return this.on({
            "mouseenter.hoverIntent": h,
            "mouseleave.hoverIntent": h
        }, i.selector)
    }
})(jQuery);

function showArgs(a) {
    s = '';
    for (var i = 0; i < a.length; i++) s += (a[i] != undefined && typeof a[i] != 'function' && typeof a[i] != 'object' && (typeof a[i] != 'string' || a[i].length <= 100) ? a[i] : (typeof a[i] == 'string' ? a[i].substr(0, 100) : typeof a[i])) + ' | ';
    return s
}

var l = 0;
var docType = /<\!DOCTYPE[^>]*>/i;
var tagso = /<(html|head|body|title|meta|script|link)([\s\>])/gi;
var tagsc = /<\/(html|head|body|title|meta|script|link)\>/gi;
var div12 = '<div class="ajy-$1"$2';
var linki = '<link rel="stylesheet" type="text/css" href="*" />',
    scri = '<script type="text/javascript" src="*" />';
var linkr = 'link[href*="!"]',
    scrr = 'script[src*="!"]';

if (jQuery)(function ($) {

    var $this, $window = $(window),
        currentURL = '',
        requestTimer = null,
        post = null;

    var options = {
        selector: "a",
        requestKey: "pronto",
        requestDelay: 0,
        forms: true,
        turbo: true,
        scrollTop: false
    };

    function _init(opts) {
        $.extend(options, opts || {});
        options.$body = $("body");
        options.$container = $(options.container);
        currentURL = window.location.href;

        _saveState();

        $window.on("popstate", _onPop);

        if (options.turbo) $(options.selector).hoverIntent(_prefetch);
        options.$body.on("click.pronto", options.selector, _click);
        ajaxify_forms();
    }

    function _prefetch(e) {
        var link = e.currentTarget;
        if (window.location.protocol !== link.protocol || window.location.host !== link.host) return;
        $().getPage('+', link.href);
    }

    function b(m, n) {
        if (m.indexOf("?") > 0) {
            m = m.substring(0, m.indexOf("?"))
        }

        return m + "?" + n
    }

    function k(m) {
        var o = m.serialize();
        var n;
        n = $("input[name][type=submit]", m);

        if (n.length == 0) {
            $.log('Nothing found in function k() !');
            return o
        }

        var p = n.attr("name") + "=" + n.val();
        if (o.length > 0) {
            o += "&" + p
        } else {
            o = p
        }

        return o
    }

    function ajaxify_forms(s) {
        if (!options.forms) return;

        $('form').submit(function (q) {

            var f = $(q.target);
            if (!f.is("form")) {
                f = f.filter("input[type=submit]").parents("form:first");
                if (f.length == 0) {
                    return true
                }
            }

            var p = k(f);
            var q = "get",
                m = f.attr("method");
            if (m.length > 0 && m.toLowerCase() == "post") q = "post";

            var h, a = f.attr("action");
            if (a != null && a.length > 0) h = a;
            else h = currentURL;

            if (q == "get") h = b(h, p);
            else {
                post = {};
                post.data = p;
            }

            $.log('Action href : ' + h);
            $window.trigger("pronto.submit", h);
            _request(h);

            return false;
        });
    }


    function _click(e) {
        var link = e.currentTarget;
        post = null;

        if ((e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) || (window.location.protocol !== link.protocol || window.location.host !== link.host)) {
            return;
        }

        if (link.hash && link.href.replace(link.hash, '') === window.location.href.replace(location.hash, '') || link.href === window.location.href + '#') {
            _saveState();
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (currentURL == link.href) {
            _saveState();
        } else {
            _request(link.href);
        }
    }

    function _request(url) {
        $window.trigger("pronto.request");

        var req2 = function () {
            _render(url, 0, true);
        };

        $().getPage(url, req2, post);
    }

    function _onPop(e) {
        var data = e.originalEvent.state;

        if (data !== null && data.url !== currentURL) {
            $window.trigger("pronto.request");
            var req3 = function () {
                _render(data.url, data.scroll, false);
            };

            $().getPage(data.url, req3);
        }
    }

    function _render(url, scrollTop, doPush) {
        if (requestTimer !== null) {
            clearTimeout(requestTimer);
            requestTimer = null;
        }

        requestTimer = setTimeout(function () {
            _doRender(url, scrollTop, doPush)
        }, options.requestDelay);
    }

    function _doPush(url, doPush) {
        currentURL = url;

        if (doPush) {
            history.pushState(
                (options.scrollTop ? {
                    url: currentURL,
                    scroll: 0
                } : {
                    url: currentURL
                }), "state-" + currentURL, currentURL);
        } else {

            _saveState();
        }
    }


    function _doRender(url, scrollTop, doPush) {
        $window.trigger("pronto.load");

        _gaCaptureView(url);

        _saveState();

        $('title').html($().getPage('title').html());

        $this.getPage('-');
        ajaxify_forms();

        if (url.indexOf('#') + 1) {
            $('html, body').animate({
                scrollTop: $('#' + url.split('#')[1]).offset().top
            }, 500);
        }

        _doPush(url, doPush);

        var event = jQuery.Event("pronto.render");
        event.same = post ? true : false;
        $window.trigger(event);

        if (options.scrollTop) $window.scrollTop(scrollTop);
    }


    function _saveState() {
        if (options.scrollTop) {
            history.replaceState({
                url: currentURL,
                scroll: $window.scrollTop()
            }, "state-" + currentURL, currentURL);
        } else {
            history.replaceState({
                url: currentURL
            }, "state-" + currentURL, currentURL);
        }
    }

    function _gaCaptureView(url) {
        if (typeof _gaq === "undefined") _gaq = [];
        _gaq.push(['_trackPageview'], url);
    }

    $.fn.pronto = function (opts) {
        $this = $(this);
        _init(opts);
        return $this;
    };
})(jQuery);
