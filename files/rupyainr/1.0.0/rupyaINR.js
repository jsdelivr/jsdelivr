/**
* Copyright 2014 rupyaINR (http://rupyaINR.com)
* 
* @license - http://www.apache.org/licenses/LICENSE-2.0
* 
**/
var _wr_load = window.onload;
window.onload = function () {
    if (typeof (_wr_load) == "function") {
        _wr_load()
    }
    _wr_d = document;
    _wr_l(_wr_d);
    _wr_i(_wr_d.body);
    _wr_re(_wr_d.body)
};
_wr_l = function (f) {
    var d = f.createElement("link");
    d.type = "text/css";
    d.rel = "stylesheet";
    d.href = "//cdn.jsdelivr.net/rupyainr/1.0.0/rupyaINR.css";
    var e = f.getElementsByTagName("head")[0];
    e.appendChild(d)
};
_wr_i = function (g) {
    var c = g.childNodes;
    var f = c.length;
    for (var h = 0; h < f; h++) {
        if (c[h].nodeType == 3) {
            if (!c[h].nodeValue.match(/^[\s]*$/)) {
                r = c[h].nodeValue;
                r = r.replace(/\s(Rs|INR|Rs\.)\s/gi, " Rs. ");
                r = r.replace(/^(Rs|INR|Rs\.)\s/gi, " Rs. ");
                r = _we_reg(r, /\sRs\.[0-9]+\s/gi, /(Rs\.)/gi);
                r = _we_reg(r, /^Rs\.[0-9]+$/gi, /Rs\./gi);
                r = _we_reg(r, /^Rs\.[0-9,]+[0-9]$/gi, /Rs\./gi);
                r = _we_reg(r, /^Rs\.[0-9,]+[0-9]\s/gi, /Rs\./gi);
                r = _we_reg(r, /\sRs\.[0-9,]+[0-9]\s/gi, /Rs\./gi);
                r = _we_reg(r, /\sRs\.[0-9,]+[0-9]\./gi, /Rs\./gi);
                r = _we_reg(r, /^Rs\.[0-9,]+[0-9]\./gi, /Rs\./gi);
                r = _we_reg(r, /\sRs\.[0-9,]+[0-9]\//gi, /Rs\./gi);
                r = _we_reg(r, /^Rs\.[0-9,]+[0-9]\//gi, /Rs\./gi);
                r = _we_reg(r, /\sRs\.[0-9,]+[0-9]/gi, /Rs\./gi);
                c[h].nodeValue = r
            }
        } else {
            if (c[h].nodeName.toLowerCase() != "script") {
                _wr_i(c[h])
            }
        }
    }
};
_we_reg = function (f, a, b) {
    var c = new RegExp(a);
    var e = c.exec(f);
    while (e != null) {
        var d = String(e);
        d = d.replace(b, " Rs. ");
        f = f.replace(e, d);
        e = c.exec(f)
    }
    return f
};
_wr_re = function (k) {
    var c = 0;
    if (k.nodeType == 3) {
        var n = k.data.indexOf(" Rs. ");
        if (n >= 0) {
            var m = document.createElement("span");
            m.className = "rupyaINR";
            var e = k.splitText(n);
            var o = e.splitText(5);
            var p = e.cloneNode(true);
            m.appendChild(p);
            e.parentNode.replaceChild(m, e);
            c = 1
        }
    } else {
        if (k.nodeType == 1 && k.childNodes && !/(script|style)/i.test(k.tagName)) {
            for (var l = 0; l < k.childNodes.length; ++l) {
                l += _wr_re(k.childNodes[l])
            }
        }
    }
    return c
};
