/*! Highlight JS Loader v3.0 | https://github.com/alidbg/highlight.js_loader */
(function(doc) {
    "use strict";
    doc.write("\n<style>.hljs,.hljs span{font-family:Consolas,Monaco,monospace;line-height:1.45;word-wrap:normal;position:relative;float:none;direction:ltr}.hljs{border-radius:.4em;max-height:40em;margin:.5em auto;white-space:pre;overflow:auto}.hljs .hjln{cursor:default;text-align:right;float:left;margin:0 1em .1em -1em;border-right:.1em solid;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}.hljs .hjln span{padding:0 .5em 0 1em;display:block}</style>");
    doc.addEventListener("DOMContentLoaded", function() {
        var code = doc.getElementsByTagName("code");
        for (var i = 0; i < code.length; i++) {
            var c = code[i];
            c.addEventListener("click", function() {
                if (confirm("Select All?")) {
                    var r = doc.createRange(),
                        s = window.getSelection();
                    s.removeAllRanges();
                    r.setStart(this, 1);
                    r.setEnd(this, this.childNodes.length);
                    s.addRange(r)
                }
            });
            c.innerHTML = c.innerHTML.replace(/<br[^>]*>$/mgi, "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
            hljs.highlightBlock(c);
            c.innerHTML = '<span class="hjln"></span>' + c.innerHTML;
            var g = c.innerHTML.split(/\n/).length;
            for (var a = 1; a <= g; a++)(c.getElementsByTagName("span")[0]).innerHTML += "<span>" + a + "</span>"
        }
        if (typeof jQuery != "undefined" && jQuery.fn.niceScroll) $("code").niceScroll()
    })
})(document);