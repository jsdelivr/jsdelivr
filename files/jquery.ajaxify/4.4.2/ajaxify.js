(function ($) {
    var Log = function (options) {
        var con = window.console;
        var settings = $.extend({
            verbosity: 0
        }, options);
        var verbosity = settings["verbosity"];
        this.a = function (m) {
            l < verbosity && con && con.log(m);
        };
    };
    $.log = function (m, options) {
        var r;
        if (!$.log.o) $.log.o = new Log(options);
        r = $.log.o.a(m);
        return r;
    };
})(jQuery);

(function ($) {
    var Cache = function () {
        var d = false;
        this.a = function (o) {
            if (!o) return d;
            if (typeof o == 'string') return d = $.pages($.memory(o));
            if (typeof o == 'object') d = o;
        };
    };
    $.cache = function (o) {
        var r;
        if (!$.cache.o) $.cache.o = new Cache();
        r = $.cache.o.a(o);
        return r;
    };
})(jQuery);

(function ($) {
    var Memory = function (options) {
        var d = false;
        var settings = $.extend({
            memoryoff: false
        }, options);
        var memoryoff = settings["memoryoff"];
        this.a = function (h) {
            d = memoryoff;
            if (!h || d == true) return false;
            if (d == false) return h;
            if (d.iO(", ")) {
                d = d.split(", ");
                r = h;
                for (var i = 0; i < d.length; i++)
                    if (h == d[i]) return false;
            }
            return h == d ? false : h;
        };
    };
    $.memory = function (h, options) {
        var r;
        if (!$.memory.o) $.memory.o = new Memory(options);
        r = $.memory.o.a(h);
        return r;
    };
})(jQuery);

(function ($) {
    var Pages = function () {
        var d = [];
        this.a = function (h) {
            if (typeof h === "string") {
                for (var i = 0; i < d.length; i++)
                    if (d[i][0] == h) return d[i][1]
            }
            if (typeof h === "object") {
                d.push(h)
            };
        };
    };
    $.pages = function (h) {
        var r;
        if (!$.pages.o) $.pages.o = new Pages();
        r = $.pages.o.a(h);
        return r;
    };
})(jQuery);

(function ($) {
    var GetPage = function () {
        this.a = function (t, p, p2) {
            if (!t) return $.cache();
            if (t.iO("/")) return _lPage(t, p, p2);
            if (t == "+") return _lPage(p, p2, false, true);
            if (t == "-") return _lSel(p, p2);
            return $.cache().find(".ajy-" + t);
        };
        var _lSel = function (p, $t) {
            pass++;
            _lDivs($t);
            $.scripts(p);
            $.scripts("a");
            return $.scripts("c")
        };
        var _lPage = function (hin, p, post, pre) {
            if (hin.iO("#")) hin = hin.split("#")[0];
            if (post || !$.cache(hin)) return _lAjax(hin, p, post, pre);
            p && p();
        };
        var _lDivs = function ($t) {
            if ($.cache()) _all($t, "fn(*)", function (s) {
                s.html($.cache().find("#" + s.attr("id")).html());
            })
        };
        var _all = function ($t, t, fn) {
            $t.each(function () {
                t = t.split("*").join("$(this)");
                t += ";";
                eval(t);
            })
        };
        var _lAjax = function (hin, p, post, pre) {
            var xhr = $.ajax({
                url: hin,
                type: post ? "POST" : "GET",
                data: post ? post.data : null,
                success: function (h) {
                    if (!h || !_isHtml(xhr)) {
                        if (!pre) location = hin;
                    }
                    $.cache($(_parseHTML(h)));
                    $.pages([hin, $.cache()]);
                    p && p();
                }
            })
        };
        var _isHtml = function (x) {
            var d;
            return (d = x.getResponseHeader("Content-Type")), d && (d.iO("text/html") || d.iO("text/xml"))
        };
        var _parseHTML = function (h) {
            return $.trim(_replD(h))
        };
        var _replD = function (h) {
            return String(h).replace(docType, "").replace(tagso, div12).replace(tagsc, "</div>")
        };
    };
    $.getPage = function (t, p, p2) {
        var r;
        if (!$.getPage.o) $.getPage.o = new GetPage();
        r = $.getPage.o.a(t, p, p2);
        return r;
    };
})(jQuery);

(function ($) {
    var Ajaxify = function (options) {
        var settings = $.extend({
            cb: 0,
            pluginon: true,
            fn: $.getPage
        }, options);
        var cb = settings["cb"],
            pluginon = settings["pluginon"],
            fn = settings["fn"];
        this.a = function ($this) {
            $(function () {
                $.log("Entering ajaxify...", settings);
                if (_init(settings)) {
                    $this.pronto(settings);
                    $.getPage(location.href, $.scripts);
                }
            });
        };
        var _init = function (s) {
            if (!api || !s.pluginon) return false;
            _outjs(s);
            $.scripts("i", s);
            $.memory(0, s);
            return true
        };
        var _outjs = function (s) {
            if (s.outjs) $.log(jsout)
        };
    };
    $.fn.ajaxify = function (options) {
        var r;
        var $this = $(this);
        if (!$.fn.ajaxify.o) $.fn.ajaxify.o = new Ajaxify(options);
        r = $.fn.ajaxify.o.a($this);
        return $this;
    };
})(jQuery);

(function ($) {
    var Scripts = function (options) {
        var $s = $();
        var settings = $.extend({
            canonical: true,
            inline: true,
            inlinehints: false
        }, options);
        var canonical = settings["canonical"],
            inline = settings["inline"],
            inlinehints = settings["inlinehints"];
        this.a = function (same) {
            if (same == "i") return true;
            if (same == "a") return _alltxts($s.t);
            if (same == "c") {
                if (canonical && $s.can) return $s.can.attr("href");
                else return false;
            };
            if (!same) $.detScripts($s);
            _addScripts(same, $s, settings);;
        };
        var _alltxts = function ($s) {
            $s.each(function () {
                var d = $(this).html();
                if (!d.iO(").ajaxify(") && (inline || $(this).hasClass("ajaxy") || _inline(d, s))) _addtext(d);
                r = true;
            });
        };
        var _addtext = function (t) {
            try {
                $.globalEval(t);
            } catch (e) {
                alert(e);
            };
        };
        var _inline = function (txt, s) {
            var d = inlinehints;
            if (d) {
                d = d.split(", ");
                for (var i = 0; i < d.length; i++)
                    if (txt.iO(d[i])) return true;
            }
        };
        var _addScripts = function (same, $s, st) {
            $s.c.addAll(same, "href", st);
            $s.s.addAll(same, "src", st)
        };
    };
    $.scripts = function (same, options) {
        var r;
        if (!$.scripts.o) $.scripts.o = new Scripts(options);
        r = $.scripts.o.a(same);
        return r;
    };
})(jQuery);

(function ($) {
    var DetScripts = function () {
        var head, body, lk, j;
        this.a = function ($s) {
            head = $.getPage("head");
            body = $.getPage("body");
            lk = head.find(".ajy-link");
            j = $.getPage("script");
            $s.c = _rel(lk, "stylesheet");
            $s.can = _rel(lk, "canonical");
            $s.s = j.filter(function () {
                return $(this).attr("src");
            });
            $s.t = j.filter(function () {
                return !($(this).attr("src"));
            });
        };
        var _rel = function (lk, v) {
            return $(lk).filter(function () {
                return $(this).attr("rel").iO(v);
            })
        };
    };
    $.detScripts = function ($s) {
        var r;
        if (!$.detScripts.o) $.detScripts.o = new DetScripts();
        r = $.detScripts.o.a($s);
        return r;
    };
})(jQuery);

(function ($) {
    var AddAll = function (options) {
        var $scriptsO, $scriptsN, $sCssO = [],
            $sCssN = [],
            $sO = [],
            $sN = [];
        var settings = $.extend({
            deltas: true
        }, options);
        var deltas = settings["deltas"];
        this.a = function ($this, same, PK) {
            if (PK == "href") {
                $scriptsO = $sCssO;
                $scriptsN = $sCssN;
            } else {
                $scriptsO = $sO;
                $scriptsN = $sN;
            } if (_allScripts($this, PK)) return true;
            if (pass) _classAlways($this, PK);
            if (same) return _sameScripts($scriptsN, PK);
            $scriptsN = [];
            _newArray($this, $scriptsN, $scriptsO, PK);
            if (pass) {
                _findCommon($scriptsO, $scriptsN);
                _freeOld($scriptsO, PK);
                _sameScripts($scriptsN, PK);
                $scriptsO = $scriptsN.slice();
            }
            if (PK == "href") {
                $sCssO = $scriptsO;
                $sCssN = $scriptsN;
            } else {
                $sO = $scriptsO;
                $sN = $scriptsN;
            };
        };
        var _allScripts = function ($t, PK) {
            if (deltas) return false;
            $t.each(function () {
                _iScript($(this)[0], PK);
            });
            return true;
        };
        var _classAlways = function ($t, PK) {
            $t.each(function () {
                if ($(this).attr("data-class") == "always") {
                    _iScript($(this).attr(PK), PK);
                    $(this).remove();
                }
            })
        };
        var _sameScripts = function (s, PK) {
            for (var i = 0; i < s.length; i++)
                if (s[i][1] == 0) _iScript(s[i][0], PK)
        };
        var _iScript = function ($S, PK) {
            $("head").append((PK == "href" ? linki : scri).replace("*", $S))
        };
        var _newArray = function ($t, sN, sO, PK) {
            var d;
            $t.each(function () {
                d = [$(this).attr(PK), 0];
                sN.push(d);
                if (!pass) sO.push(d);
            })
        };
        var _findCommon = function (s, sN) {
            for (var i = 0; i < s.length; i++) {
                s[i][1] = 2;
                if (_findScript(s[i][0], sN)) s[i][1] = 1;
            }
        };
        var _findScript = function ($S, s) {
            if ($S)
                for (var i = 0; i < s.length; i++)
                    if (s[i][0] == $S) {
                        s[i][1] = 1;
                        return true;
                    }
        };
        var _freeOld = function (s, PK) {
            for (var i = 0; i < s.length; i++)
                if (s[i][1] == 2 && s[i][0]) _removeScript(s[i][0], PK)
        };
        var _removeScript = function ($S, PK) {
            $((PK == "href" ? linkr : scrr).replace("!", $S)).remove()
        };
    };
    $.fn.addAll = function (same, PK, options) {
        var r;
        var $this = $(this);
        if (!$.fn.addAll.o) $.fn.addAll.o = new AddAll(options);
        r = $.fn.addAll.o.a($this, same, PK);
        return r;
    };
})(jQuery);﻿
String.prototype.iO = function (s) {
    return this.toString().indexOf(s) + 1;
};

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

var l = 0,
    pass = 0,
    api = window.history && window.history.pushState && window.history.replaceState;
var docType = /<\!DOCTYPE[^>]*>/i;
var tagso = /<(html|head|body|title|meta|script|link)([\s\>])/gi;
var tagsc = /<\/(html|head|body|title|meta|script|link)\>/gi;
var div12 = '<div class="ajy-$1"$2';
var linki = '<link rel="stylesheet" type="text/css" href="*" />',
    scri = '<script type="text/javascript" src="*" />';
var linkr = 'link[href*="!"]',
    scrr = 'script[src*="!"]';

/*
 * Pronto Plugin
 * @author Ben Plum, Arvind Gupta
 * @version 0.6.3
 *
 * Copyright Â© 2013 Ben Plum: mr@benplum.com, Arvind Gupta: arvgta@gmail.com
 * Released under the MIT License
 */

if (jQuery)(function ($) {

    var $this, $window = $(window),
        currentURL = '',
        requestTimer = null,
        post = null;

    // Default Options
    var options = {
        selector: "a:not(.no-ajaxy)",
        requestKey: "pronto",
        requestDelay: 0,
        forms: true,
        turbo: true,
        previewoff: true,
        fn: false,
        scrollTop: false
    };

    // Private Methods

    // Init
    function _init(opts) {
        $.extend(options, opts || {});
        options.$body = $("body");

        // Capture current url & state
        currentURL = window.location.href;

        // Set initial state
        _saveState();

        // Bind state events
        $window.on("popstate", _onPop);

        if (options.turbo) $(options.selector).hoverIntent(_prefetch, drain);
        options.$body.on("click.pronto", options.selector, _click);
        ajaxify_forms();
    }

    function _isInDivs(l) {
        var isInDivs = false;
        $this.each(function () {
            try {
                if ($(l).parents("#" + $(this).attr("id")).length > 0) isInDivs = true;
            } catch (e) {
                alert(e);
            }
        });

        return isInDivs;
    }

    function _prefetch(e) {
        post = null;
        var link = e.currentTarget;
        if (window.location.protocol !== link.protocol || window.location.host !== link.host) return;
        if (currentURL == link.href) return;

        var req2 = function () {
            if (options.previewoff === true) return;
            if (!_isInDivs(link) && (options.previewoff === false || !$(link).closest(options.previewoff).length)) _click(e, true);
        };

        options.fn('+', link.href, req2);

    }

    function drain() {}

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
            return o;
        }

        var p = n.attr("name") + "=" + n.val();
        if (o.length > 0) {
            o += "&" + p
        } else {
            o = p
        }

        return o;
    }

    function ajaxify_forms(s) {
        if (!options.forms) return;

        // capture submit
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

            $.log('Form : ' + h);
            $window.trigger("pronto.submit", h);
            _request(h);

            // prevent submitting again
            return false;
        });
    }

    // Handle link clicks
    function _click(e, mode) {
        var link = e.currentTarget;
        post = null;

        // Ignore everything but normal click
        if ((e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) || (window.location.protocol !== link.protocol || window.location.host !== link.host)) {
            return;
        }

        // Update state on hash change
        if (link.hash && link.href.replace(link.hash, '') === window.location.href.replace(location.hash, '') || link.href === window.location.href + '#') {
            _saveState();
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (currentURL == link.href) {
            _saveState();
        } else {
            _request(link.href, mode);
        }
    }

    // Request new url
    function _request(url, mode) {
        // Fire request event
        $window.trigger("pronto.request");

        var reqr = function () {
            _render(url, 0, true, mode);
        };

        options.fn(url, reqr, post);
    }

    // Handle back/forward navigation
    function _onPop(e) {
        var data = e.originalEvent.state;

        // Check if data exists
        if (data !== null && data.url !== currentURL) {
            // Fire request event
            $window.trigger("pronto.request");
            var req3 = function () {
                _render(data.url, data.scroll, false);
            };

            options.fn(data.url, req3);
        }
    }

    function _render(url, scrollTop, doPush, mode) {
        if (requestTimer !== null) {
            clearTimeout(requestTimer);
            requestTimer = null;
        }

        requestTimer = setTimeout(function () {
            _doRender(url, scrollTop, doPush, mode)
        }, options.requestDelay);
    }

    function _doPush(url, doPush) {
        // Update current url
        currentURL = url;

        // Push new states to the stack on new url
        if (doPush) {
            history.pushState(
                (options.scrollTop ? {
                    url: currentURL,
                    scroll: 0
                } : {
                    url: currentURL
                }), "state-" + currentURL, currentURL);
        } else {

            // Set state if moving back/forward
            _saveState();
        }
    }

    // Render HTML
    function _doRender(url, scrollTop, doPush, mode) {
        var canURL;
        // Fire load event
        $window.trigger("pronto.load");

        // Trigger analytics page view
        _gaCaptureView(url);

        // Update current state
        _saveState();

        // Update title
        $('title').html(options.fn('title').html());

        // Update DOM
        canURL = options.fn('-', post, $this);
        if (canURL && canURL != url) url = canURL;
        ajaxify_forms();

        // Scroll to hash if given
        if (url.indexOf('#') + 1 && !mode) {
            $('html, body').animate({
                scrollTop: $('#' + url.split('#')[1]).offset().top
            }, 500);
        }

        _doPush(url, doPush);

        $window.trigger("pronto.render");

        //Set Scroll position
        if (options.scrollTop) $window.scrollTop(scrollTop);
    }

    // Save current state
    function _saveState() {
        // Update state
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

    // Google Analytics support
    function _gaCaptureView(url) {
        if (typeof window.ga !== 'undefined')
            window.ga('send', 'pageview', url);
    }

    // Define Plugin
    $.fn.pronto = function (opts) {
        $this = $(this);
        _init(opts);
        return $this;
    };
})(jQuery);
