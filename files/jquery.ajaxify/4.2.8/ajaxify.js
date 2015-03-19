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
        $.log.o = $.log.o ? $.log.o : new Log(options);
        r = $.log.o.a(m);
        return r;
    };
})(jQuery);

function _addAll(PK) {
    return addAll.replace(/PK/g, PK)
};

(function ($) {
    var All = function () {
        this.a = function ($this, t, fn) {
            $this.each(function () {
                t = t.split("*").join("$(this)");
                t += ";";
                eval(t);
            });
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
    return (d = x.getResponseHeader("Content-Type")), d && (d.indexOf("text/html") + 1 || d.indexOf("text/xml") + 1)
};

function _replD(h) {
    return String(h).replace(docType, "").replace(tagso, div12).replace(tagsc, "</div>")
};

function _parseHTML(h) {
    return $.trim(_replD(h))
};

(function ($) {
    var Pages = function () {
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
        $.pages.o = $.pages.o ? $.pages.o : new Pages();
        r = $.pages.o.a(h);
        return r;
    };
})(jQuery);

(function ($) {
    var Memory = function (options) {
        var settings = $.extend({
            memoryoff: false
        }, options);
        var memoryoff = settings["memoryoff"];
        this.a = function (h) {
            d = memoryoff;
            if (!h || d == true) return null;
            if (d == false) return h;
            if (d.indexOf(", ") + 1) {
                d = d.split(", ");
                for (var i = 0, r = h; i < d.length; i++)
                    if (h == d[i]) return null;
            }
            return h == d ? null : h;
        };
    };
    $.memory = function (h, options) {
        var r;
        $.memory.o = $.memory.o ? $.memory.o : new Memory(options);
        r = $.memory.o.a(h);
        return r;
    };
})(jQuery);

(function ($) {
    var Cache1 = function () {
        this.a = function (o, h) {
            if (o === "?") {
                return d
            }
            if (o === "+") {
                d = $.memory(h);
                d = d ? $.pages(d) : null
            }
            if (o === "!") {
                d = h
            };
        };
    };
    $.cache1 = function (o, h) {
        var r;
        $.cache1.o = $.cache1.o ? $.cache1.o : new Cache1();
        r = $.cache1.o.a(o, h);
        return r;
    };
})(jQuery);

(function ($) {
    var LDivs = function () {
        this.a = function ($this) {
            $this.all("fn(*)", function (s) {
                if ($.cache1("?")) s.html($.cache1("?").find("#" + s.attr("id")).html());
            });
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
        this.a = function (hin, p, post) {
            var xhr = $.ajax({
                url: hin,
                type: post ? "POST" : "GET",
                data: post ? post.data : null,
                success: function (h) {
                    if (!h || !_isHtml(xhr)) {
                        location = hin;
                    }
                    $.cache1("!", $(_parseHTML(h)));
                    $.pages([hin, $.cache1("?")]);
                    p && p();
                }
            });
        };
    };
    $.lAjax = function (hin, p, post) {
        var r;
        $.lAjax.o = $.lAjax.o ? $.lAjax.o : new LAjax();
        r = $.lAjax.o.a(hin, p, post);
        return r;
    };
})(jQuery);

function _lPage(hin, p, post) {
    if (hin.indexOf("#") + 1) hin = hin.split("#")[0];
    $.cache1("+", post ? null : hin);
    if (!$.cache1("?")) return $.lAjax(hin, p, post);
    p && p();
};

(function ($) {
    var GetPage = function () {
        this.a = function ($this, t, p, p2) {
            if (!t) return $.cache1("?");
            if (t.indexOf("/") != -1) return _lPage(t, p, p2);
            if (t == "+") _lPage(p, p2);
            else {
                if (t.charAt(0) == "#") {
                    $.cache1("?").find(t).html(p);
                    t = "-";
                }
                if (t == "-") {
                    $this.lDivs();
                    return $.scripts(p);
                }
                return $.cache1("?").find(".ajy-" + t);
            };
        };
    };
    $.fn.getPage = function (t, p, p2) {
        var r;
        var $this = $(this);
        $.fn.getPage.o = $.fn.getPage.o ? $.fn.getPage.o : new GetPage();
        r = $.fn.getPage.o.a($this, t, p, p2);
        return r;
    };
})(jQuery);

function _insertScript($S, PK) {
    $("head").append((PK == "href" ? linki : scri).replace("*", $S))
};

function _removeScript($S, PK) {
    $((PK == "href" ? linkr : scrr).replace("!", $S)).remove()
};

function _findScript($S, $Scripts) {
    if ($S)
        for (var i = 0; i < $Scripts.length; i++)
            if ($Scripts[i][0] == $S) {
                $Scripts[i][1] = 1;
                return true;
            }
};

(function ($) {
    var AllScripts = function () {
        this.a = function ($this, PK, deltas) {
            if (!deltas) {
                $this.each(function () {
                    _insertScript($(this)[0], PK);
                });
                return true;
            };
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
        this.a = function ($this, PK) {
            $this.each(function () {
                if ($(this).attr("data-class") == "always") {
                    _insertScript($(this).attr(PK), PK);
                    $(this).remove();
                }
            });
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
    for (var i = 0; i < sN.length; i++)
        if (sN[i][1] == 0) _insertScript(sN[i][0], PK)
};

(function ($) {
    var NewArray = function () {
        this.a = function ($this, sN, sO, PK, pass) {
            $this.each(function () {
                sN.push([$(this).attr(PK), 0]);
                if (!pass) sO.push([$(this).attr(PK), 0]);
            });
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
    for (var i = 0; i < s.length; i++) {
        s[i][1] = 2;
        if (_findScript(s[i][0], sN)) s[i][1] = 1
    }
};

function _freeOld(s, PK) {
    for (var i = 0; i < s.length; i++)
        if (s[i][1] == 2 && s[i][0]) _removeScript(s[i][0], PK)
};

function _realNew(s, PK) {
    for (var i = 0; i < s.length; i++)
        if (s[i][1] == 0) _insertScript(s[i][0], PK)
};

(function ($) {
    var AddHrefs = function (options) {
        var $scriptsO = [],
            $scriptsN = [],
            pass = 0;
        var settings = $.extend({
            "deltas": true
        }, options);
        var deltas = settings["deltas"];
        this.a = function ($this, same) {
            if (!$this.allScripts("href", deltas)) {
                if (pass) $this.classAlways("href");
                if (same) return _sameScripts($scriptsN, "href");
                $scriptsN = [];
                $this.newArray($scriptsN, $scriptsO, "href", pass);
                if (pass++) {
                    _findCommon($scriptsO, $scriptsN);
                    _freeOld($scriptsO, "href");
                    _realNew($scriptsN, "href");
                    $scriptsO = $scriptsN.slice()
                }
            };
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
        var $scriptsO = [],
            $scriptsN = [],
            pass = 0;
        var settings = $.extend({
            "deltas": true
        }, options);
        var deltas = settings["deltas"];
        this.a = function ($this, same) {
            if (!$this.allScripts("src", deltas)) {
                if (pass) $this.classAlways("src");
                if (same) return _sameScripts($scriptsN, "src");
                $scriptsN = [];
                $this.newArray($scriptsN, $scriptsO, "src", pass);
                if (pass++) {
                    _findCommon($scriptsO, $scriptsN);
                    _freeOld($scriptsO, "src");
                    _realNew($scriptsN, "src");
                    $scriptsO = $scriptsN.slice()
                }
            };
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
    }
};

function _inline(txt, s) {
    var d = [];
    d = s["inlinehints"];
    if (d) {
        d = d.split(", ");
        for (var i = 0; i < d.length; i++)
            if (txt.indexOf(d[i]) + 1) return true;
    }
};

function _addtext(t) {
    try {
        $.globalEval(t);
    } catch (e) {
        alert(e);
    };
};

(function ($) {
    var Alltxts = function () {
        this.a = function ($this, s) {
            $this.each(function () {
                d = $(this).html();
                if (d.indexOf(").ajaxify(") == -1 && (s["inline"] || $(this).hasClass("ajaxy") || _inline(d, s))) {
                    _addtext(d)
                }
                r = true;
            });;
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
    $s.c.addHrefs(same, st);
    $s.s.addSrcs(same, st);
    $s.t.alltxts(st)
};

(function ($) {
    var Scripts = function (options) {
        var $scripts = $(),
            pass = 0;
        var settings = $.extend({
            "deltas": true
        }, options);
        var deltas = settings["deltas"];
        this.a = function (same) {
            if (same == 'i') return true;
            _detScripts(same, $scripts);
            if (pass++) _addScripts(same, $scripts, settings);
            else {
                $scripts.c.addHrefs(same, settings);
                $scripts.s.addSrcs(same, settings);
            };
        };
    };
    $.scripts = function (same, options) {
        var r;
        $.scripts.o = $.scripts.o ? $.scripts.o : new Scripts(options);
        r = $.scripts.o.a(same);
        return r;
    };
})(jQuery);

function _outjs(s) {
    if (s["outjs"]) $.log(jsout)
};

function _initScripts() {
    $.scripts(null)
};

(function ($) {
    var InitAjaxify = function () {
        this.a = function ($this, s) {
            d = window.history && window.history.pushState && window.history.replaceState;
            if (d && s["pluginon"]) {
                _outjs(s);
                $.scripts('i', s);
                $.memory(null, s);
                $this.getPage(location.href, _initScripts);
                return true
            };
        };
    };
    $.fn.initAjaxify = function (s) {
        var r;
        var $this = $(this);
        $.fn.initAjaxify.o = $.fn.initAjaxify.o ? $.fn.initAjaxify.o : new InitAjaxify();
        r = $.fn.initAjaxify.o.a($this, s);
        return r;
    };
})(jQuery);

(function ($) {
    var Ajaxify = function (options) {
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
        var selector = settings["selector"],
            requestKey = settings["requestKey"],
            requestDelay = settings["requestDelay"],
            verbosity = settings["verbosity"],
            deltas = settings["deltas"],
            inline = settings["inline"],
            memoryoff = settings["memoryoff"],
            cb = settings["cb"],
            pluginon = settings["pluginon"];
        this.a = function ($this) {
            $(function () {
                $.log("Entering ajaxify...", settings);
                if ($this.initAjaxify(settings)) {
                    $this.pronto(settings);
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
})(jQuery);﻿(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery); 

var l=0;
var docType = /<\!DOCTYPE[^>]*>/i;
var tagso = /<(html|head|body|title|meta|script|link)([\s\>])/gi;
var tagsc = /<\/(html|head|body|title|meta|script|link)\>/gi;
var div12 =  '<div class="ajy-$1"$2';
var linki = '<link rel="stylesheet" type="text/css" href="*" />', scri='<script type="text/javascript" src="*" />';
var linkr = 'link[href*="!"]', scrr = 'script[src*="!"]';

/*
* Pronto Plugin
* @author Ben Plum, Arvind Gupta
* @version 0.6.3
*
* Copyright © 2013 Ben Plum: mr@benplum.com, Arvind Gupta: arvgta@gmail.com
* Released under the MIT License
*/
 
if (jQuery) (function($) {

var $this, $window = $(window),
currentURL = '',
requestTimer = null,
post = null;

// Default Options
var options = {
    selector: "a",
    requestKey: "pronto",
    requestDelay: 0,
    forms: true,
    turbo: true,
    preview: false,
    scrollTop: false
};

// Private Methods

// Init
function _init(opts) { 
     $.extend(options, opts || {});
     options.$body = $("body");
     options.$container = $(options.container);

     // Capture current url & state
     currentURL = window.location.href;

     // Set initial state
     _saveState();

     // Bind state events
     $window.on("popstate", _onPop);

     if(options.turbo) $(options.selector).hoverIntent( _prefetch, drain);
     options.$body.on("click.pronto", options.selector, _click);
     ajaxify_forms();
}

function _isInDivs(l) { 
    var isInDiv = false;
	$this.each(function () { 
                try { if ($(l).parents("#" + $(this).attr("id")).length > 0) isInDiv = true; } catch(e) { alert(e); }
            });
     
    return isInDiv;
}

function _prefetch(e) { post = null;
     var link = e.currentTarget;
     if(window.location.protocol !== link.protocol || window.location.host !== link.host) return;
     
     var req2 = function(){  
         if(options.preview && !_isInDivs(link)) _click(e, true);
     };
    	 
	 $this.getPage('+', link.href, req2);
     
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

    if (n.length == 0) { $.log('Nothing found in function k() !');
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
if(!options.forms) return;

// capture submit
$('form').submit(function(q) { 

    var f = $(q.target);
    if (!f.is("form")) {
        f = f.filter("input[type=submit]").parents("form:first");
        if (f.length == 0) {
            return true
        }
    }
   
    var p = k(f);
    var q = "get", m = f.attr("method");
    if (m.length > 0 && m.toLowerCase() == "post") q = "post";
    
    var h, a = f.attr("action");
    if ( a != null && a.length > 0) h = a;
    else h = currentURL;
    
    if (q == "get") h = b(h, p);
    else { post = {};  post.data = p; }
    
    $.log('Action href : ' + h);
    $window.trigger("pronto.submit", h);
    _request(h);
     
     // prevent submitting again
     return false;
});
}

// Handle link clicks
function _click(e, mode) {
     var link = e.currentTarget; post = null;

     // Ignore everything but normal click
     if ( (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
     || (window.location.protocol !== link.protocol || window.location.host !== link.host)
     ) {
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

     var reqr = function(){ 	
         _render(url, 0, true, mode);
     };
     
     $this.getPage(url, reqr, post);
}

// Handle back/forward navigation
function _onPop(e) { 
     var data = e.originalEvent.state;

     // Check if data exists
     if (data !== null && data.url !== currentURL) {
         // Fire request event
         $window.trigger("pronto.request");  
         var req3 = function(){ 	
             _render(data.url, data.scroll, false);
         };

		 $this.getPage(data.url, req3);
     }
}

function _render(url, scrollTop, doPush, mode) {      
     if (requestTimer !== null) {
          clearTimeout(requestTimer);
          requestTimer = null;
     }
     
     requestTimer = setTimeout(function() {
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
          } : { url: currentURL}
        ), "state-"+currentURL, currentURL);
     } else {
     
     // Set state if moving back/forward
     _saveState();
     }
}
   
// Render HTML
function _doRender(url, scrollTop, doPush, mode) { 
     // Fire load event
     $window.trigger("pronto.load");

     // Trigger analytics page view
     _gaCaptureView(url);

     // Update current state
     _saveState();

     // Update title
     $('title').html($this.getPage('title').html());

     // Update DOM
     $this.getPage('-', post);
     ajaxify_forms();     
     
     // Scroll to hash if given
     if(url.indexOf('#') + 1 && !mode) { 
         $('html, body').animate({
            scrollTop: $( '#' + url.split('#')[1] ).offset().top
         }, 500);
     }

     _doPush(url, doPush);

     // Fire render event
     var event = jQuery.Event("pronto.render");
     event.same = post ? true : false;
     $window.trigger(event);

     //Set Scroll position
     if(options.scrollTop) $window.scrollTop(scrollTop);
}

// Save current state
function _saveState() {
     // Update state
     if(options.scrollTop) {
          history.replaceState({
          url: currentURL,
          scroll: $window.scrollTop()
     }, "state-"+currentURL, currentURL);
     } else {
          history.replaceState({
               url: currentURL
          }, "state-"+currentURL, currentURL);
     }
}

// Google Analytics support
function _gaCaptureView(url) {
     if (typeof _gaq === "undefined") _gaq = [];
     _gaq.push(['_trackPageview'], url);
}

// Define Plugin
$.fn.pronto = function(opts) {
     $this = $(this);
     _init(opts);
     return $this;
};
})(jQuery);
