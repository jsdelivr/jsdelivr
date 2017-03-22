/*! Highlight JS Loader v5.3 | MIT Licensed (C) 2015 Ali.Dbg | http://goo.gl/IRlJuI */
;(function(doc, replace, innerHTML, addEventListener, getElementsByTagName) {
    "use strict";
    doc.head.appendChild(doc.createElement("style"))[innerHTML] = 
        ".hljs,.hljs span{vertical-align:top;top:0;left:0;border:0 none;line-height:1.3;word-wrap:normal;position:relative;float:none;direction:ltr;font-family:Consolas,Menlo,Liberation Mono}"+
        ".hljs {border-radius:.2em;max-height:40em;margin:.5em auto;white-space:pre;overflow:auto}"+
        ".hljs .hjln{text-align:right;float:left;margin:0 1em 0 -1em;border-right:.1em solid;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}"+
        ".hljs .hjln span{padding:0 .5em 0 1em;display:block}";
    doc[addEventListener]("DOMContentLoaded", function() {
        var code = doc[getElementsByTagName]("code");
        for (var i = 0; i < code.length; i++) {
            var cod = code[i];
            if ("object" == typeof hljs && cod.className.indexOf("hljs") == -1 && cod.className.indexOf("nohighlight") == -1) {
                cod[addEventListener]("click", function() {
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
                cod[innerHTML] = '<span class="hjln"></span>' + cod[innerHTML];
                for (var a = 1; a <= cod[innerHTML].split(/\n/).length; a++)(cod[getElementsByTagName]("span")[0])[innerHTML] += "<span>"+a+"</span>";
            }
        }
        if (typeof jQuery != "undefined" && jQuery.fn.niceScroll) jQuery(".hljs").niceScroll()
    })
})(document, "replace", "innerHTML", "addEventListener", "getElementsByTagName");
