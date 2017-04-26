(function() {
/*globals: define, require */
/*
 * css-parser.js
 *
 * Distributed under terms of the MIT license.
 */



define("css-parser", [], function() {
    'use strict';
    var extractCss = function(text) {
        var start = text.indexOf("<style>");
        var end = text.indexOf("</style>");

        if( start === -1 ) {
            return false;
        } else {
            return text.substring(start + 7, end);
        }
    };

    var appendCSSStyle = function(css) {
        if(css === false) {
            return;
        } else {
            var style = document.createElement("style");
            var head = document.head || document.getElementsByTagName('head')[0];

            style.type = "text/css";
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
        }
    };
    
    return {
        extractCss: extractCss,
        appendCSSStyle: appendCSSStyle,

        parse: function(text) {
            var css = extractCss(text);
            appendCSSStyle(css);
        }
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */

/*
 * template-parser.js
 *
 * Distributed under terms of the MIT license.
 */


define("template-parser", [], function(){
  'use strict';
  
    var extractTemplate = function(text) {
       var start = text.indexOf("<template>");
       var end   = text.indexOf("</template>");
       return text.substring(start + 10, end)
         .replace(/([^\\])'/g, "$1\\'")
         .replace(/[\n\r]+/g, "")
         .replace(/ {2,20}/g, " ");
    };


    return {
        extractTemplate: extractTemplate
    };
    
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */

/*
 * script-parser.js
 * Copyright (C) 2017 Edgard Leal
 *
 * Distributed under terms of the MIT license.
 */
define("script-parser", [], function() {
  'use strict';
  return {
      findCloseTag: function(text, start) {
          var i = start;
          while(i < text.length && text[i++] !== ">"){}
          return i;
      },
      extractScript: function(text) {
          var start = text.indexOf("<script");
          var sizeOfStartTag = this.findCloseTag(text, start);
          var end = text.indexOf("</script>");
          return text.substring(sizeOfStartTag, end);
      }
  };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */

/*
 * vue.js
 *
 * Distributed under terms of the MIT license.
 */
var dependencies = ["css-parser", "template-parser", "script-parser"];



define("plugin", ["css-parser", "template-parser", "script-parser"], function(cssParser, templateParser, scriptParser) {
    return {
        load: function (name, req, onload, config) {
            var url, extension; 

            // if file name has an extension, don't add .vue
            if(/.*(\.vue)|(\.html?)/.test(name)) {
                extension = "";
            } else {
                extension = ".vue";
            }

            url = req.toUrl(name + extension);

            var sourceHeader = config.isBuild?"" : "//# sourceURL=" + location.origin + url + "\n";
            var functionTemplate = ["(function(template){", "})("];

            var parse = function(text) {
               var template = templateParser.extractTemplate(text);
               var source = scriptParser.extractScript(text);
               if(!config.isBuild) {
                   cssParser.parse(text);
               }

               return sourceHeader +
                  functionTemplate[0] +
                  source +
                  functionTemplate[1] +
                  "'" + template + "');";
            };

            var loadRemote;

            if(config.isBuild) {
                loadRemote = function(url, callback) {
                    var fs = require("fs");
                    var text = fs.readFileSync(url).toString();
                    callback(parse(text));
                };

            } else {
                loadRemote = function(path, callback) {
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                        if (this.readyState === 4 && (this.status === 200 || this.status === 304)) {
                            callback(parse(xhttp.responseText));
                        }
                    };
                    xhttp.open("GET", path, true);
                    xhttp.send();
                };
            }

            req([], function() {
                loadRemote(url, function(text){
                    onload.fromText(text);
                });
            });
        }
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */

/*global define */

var dependencies = ["plugin"];



define('require-vuejs',["plugin"], function(vue){
    return vue;
});
/*vim: set ts=4 ex=4 tabshift=4 expandtab :*/

/**
 * vue.js
 * Copyright (C) 2017  
 *
 * Distributed under terms of the MIT license.
 */
define('vue',["plugin"], function(vue) {
    'use strict';
    return vue;
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */

})();
