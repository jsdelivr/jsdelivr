/*! Highlight JS Loader v6.3 | MIT Licensed (C) 2015 Ali.Dbg | http://goo.gl/IRlJuI */
;(function(doc, replace, innerHTML) {
    "use strict";
    doc.head.appendChild(doc.createElement("style"))[innerHTML] = 
        ".hljs,.hljs *{border:0 none;direction:ltr;float:none;font-size:small;font-family:Consolas,Menlo,Liberation Mono;left:0;line-height:1.45;margin:0;outline:none;position:relative;top:0;vertical-align:top;word-wrap:normal}"+
        ".hljs{border-radius:.2em;margin:.5em auto;max-height:40em;white-space:pre}.hljs *{padding:0;display:inline}"+
        ".hjln{border-right:.1em solid;counter-reset:l;cursor:default;float:left;margin:0 1em 0 -1em;text-align:right;-moz-user-select:none;-webkit-user-select:none}"+
        ".hjln span{counter-increment:l;display:block;padding:0 .5em 0 1em}.hjln span:before{content:counter(l)}"+
        "pre{padding:0;margin:0;border:0;background:initial}";
    doc.addEventListener("DOMContentLoaded", function() {
        var code = doc.getElementsByTagName("code");
        for (var i = 0; i < code.length; i++) {
            var cod = code[i];
            if (cod.className.search(/(hljs|nohighlight)/) == -1) {
                cod.addEventListener("click", function() {
                    if (confirm("Select All?")) {
                        var r = doc.createRange(),
                            s = window.getSelection();
                        s.removeAllRanges();
                        r.setStart(this, 1);
                        r.setEnd(this, this.childNodes.length);
                        s.addRange(r)
                    }
                });
                cod[innerHTML] = cod[innerHTML][replace](/<br[^>]*>$/mgi, "")[replace](/</g, "&lt;")[replace](/>/g, "&gt;")[replace](/"/g, "&quot;");
                hljs.highlightBlock(cod);
                var lines = new Array(cod[innerHTML].split(/\n/).length + 1).join('<span></span>');
                cod[innerHTML] = '<span class="hjln">' + lines + '</span>' + cod[innerHTML];
            }
        }
        if (typeof jQuery != "undefined" && jQuery.fn.niceScroll) jQuery(".hljs").niceScroll()
    })
})(document, "replace", "innerHTML");
