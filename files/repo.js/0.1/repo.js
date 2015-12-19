/*!
 * @mekwall's .vangogh() for Syntax Highlighting
 *
 * All code is open source and dual licensed under GPL and MIT.
 * Check the individual licenses for more information.
 * https://github.com/mekwall/jquery-vangogh/blob/master/GPL-LICENSE.txt
 * https://github.com/mekwall/jquery-vangogh/blob/master/MIT-LICENSE.txt
 */
(function($,a,b){var c=1,d=!1,e=!1,f={get:function(b){var c=a.location.hash;if(c.length>0){var d=c.match(new RegExp(b+":{([a-zA-Z0-9,-]*)}"));if(d)return d[1].split(",")}return[]},set:function(b,c){var d=a.location.hash,e,f=b+":{"+c.join(",")+"}",g=d.indexOf(b+":{");if(c.length===0)return this.remove(b);g!==-1?e=d.replace(new RegExp("("+b+":{[a-zA-Z0-9,-]*})"),f):e=d.length>0?d+","+f:f,a.location.hash=e},remove:function(b){a.location.hash=a.location.hash.replace(new RegExp("([,]?"+b+":{[a-zA-Z0-9,-]*}[,]?)"),"")}},g={numberRange:/^([0-9]+)-([0-9]+)$/,pageNumber:/-([0-9]+)$/,multilineBegin:/<span class="([\w-_][^"]+)">(?:.[^<]*(?!<\/span>)|)$/ig,multilineEnd:/(<span class="([\w-_][^"]+)">)?(?:.[^<]*)?(<\/span>)/ig};$.fn.vanGogh=function(h){function n(){if(d||e)setTimeout(n,100);else{k++;if(k>=10)return;if(h.source&&!l){e=!0,$.ajax({url:h.source,crossDomain:!0,dataType:"text",success:function(a){l=a},error:function(a,b){l="ERROR: "+b},complete:function(){e=!1,n()}});return}b=b||a.hljs;if(!b){d=!0,$.getScript(h.autoload,function(){d=!1,n()});return}j.filter("pre,code").each(function(){function r(b,c,e){var h=!1,i=a.find(".vg-line");c&&(a.find(".vg-highlight").removeClass("vg-highlight"),f.remove(d),k=[]),b=$.type(b)==="array"?b:[b],$.each(b,function(b,c){if(k.indexOf(c)<=-1){!isNaN(parseFloat(c,10))&&isFinite(c)&&(c=parseInt(c,10));if($.type(c)==="string"){var e=g.numberRange.exec(c);if(e){var f=e[1],h=e[2],j="";for(var b=f;b<=h;b++)j+=",#"+d+"-"+b,k.push(b);i.filter(j.substring(1)).addClass("vg-highlight")}else a.find(".vg-line:contains("+c+")").each(function(){var a=$(this).addClass("vg-highlight");a.html(a.html().replace(c,'<span class="vg-highlight">'+c+"</span>"))}),k.push(c)}else{var l=d+"-"+this,m=i.filter("#"+l);m.length&&(m.addClass("vg-highlight"),k.push(c))}}}),!e&&f.set(d,k)}var a=$(this).addClass("vg-container").attr("id",this.id||"vg-"+c++),d=this.id,e=a.find("code"),i=!1,j=!1,k=[];e.length||(e=a,i=!0),h.source&&l&&e.text(l);var n=e.text();b.highlightBlock(e[0],h.tab);var o=e.html().split("\n"),p="",q="";if(!i){var s={},t=0;$.each(o,function(a,b){var c=a+h.firstLine,e=d+"-"+c,f=b;h.numbers&&(p+='<a class="vg-number" rel="#'+e+'">'+c+"</a>");if(s[t]){var i=g.multilineEnd.exec(b);i&&!i[1]?(f='<span class="'+s[t]+'">'+f,delete s[t],t--):f='<span class="'+s[t]+'">'+f+"</span>"}var j=g.multilineBegin.exec(b);j&&(t++,s[t]=j[1]),q+='<div class="vg-line" id="'+e+'">'+f+"</div>"}),q='<code class="vg-code">'+q+"</code>",h.numbers&&(q='<div class="vg-gutter">'+p+"</div>"+q),a.html(q),e=a.find("code"),a.find(".vg-number").click(function(b){var c=$(this),e=c.attr("rel"),h=a.find(e);if(h.hasClass("vg-highlight")){h.removeClass("vg-highlight"),k.splice(k.indexOf(c.text()),1),f.set(d,k),j=!1;return!1}var i=j;j=parseInt(g.pageNumber.exec(e)[1],10),b.shiftKey&&j?r(i<j?i+"-"+j:j+"-"+i,!0):r(j,b.ctrlKey?!1:!0);return!1});var u=a.find(".vg-gutter"),v=u.outerWidth(),w=0,x=!1;h.animateGutter&&a.scroll(function(a){if(this.scrollLeft!==w)if(this.scrollLeft>v){if(this.scrollLeft<w)w=this.scrollLeft,u.hide();else if(this.scrollLeft!==w){if(x)return;var b=this;w=this.scrollLeft,x=setTimeout(function(){x=!1;var a=b.scrollLeft;e.css("marginLeft",v),u.css({"float":"none",position:"absolute",left:a-v}).show().stop().animate({left:a})},500)}}else w=this.scrollLeft,clearTimeout(x),x=!1,u.css({"float":"",position:"",left:""}).show()})}else i&&a.addClass("vg-code");e.dblclick(function(){m(e[0]);return!1});if(h.maxLines>0){var y=a.find(".vg-line").height(),z=parseInt(e.css("paddingTop")),A=y*(h.maxLines+1)+z;a.css({minHeight:y+z,maxHeight:A})}h.highlight&&r(h.highlight,!0,!0);var B=f.get(d);B.length&&r(B,!1,!0)})}}function m(b){var c=a,d=a.document;if(d.body.createTextRange){var e=d.body.createTextRange();e.moveToElementText(b),e.select()}else if(d.createRange){var f=c.getSelection(),e=d.createRange();e.selectNodeContents(b),f.removeAllRanges(),f.addRange(e)}}var i={language:"auto",firstLine:1,maxLines:0,numbers:!0,highlight:null,animateGutter:!0,autoload:"http://softwaremaniacs.org/media/soft/highlight/highlight.pack.js",tab:"    "};h=$.extend({},i,h);var j=this,k=0,l;n();return j}})(jQuery,this,typeof this.hljs!="undefined"?this.hljs:!1);

/*!
 * Repo.js
 * @author Darcy Clarke
 *
 * Copyright (c) 2012 Darcy Clarke
 * Dual licensed under the MIT and GPL licenses.
 * http://darcyclarke.me/
 */
 (function($){

    // Github repo
    $.fn.repo = function( options ){

        // Context and Base64 methods
        var _this       = this,
            keyStr64    = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789+/" + "=",
            encode64    = function(a){a=escape(a);var b="";var c,d,e="";var f,g,h,i="";var j=0;do{c=a.charCodeAt(j++);d=a.charCodeAt(j++);e=a.charCodeAt(j++);f=c>>2;g=(c&3)<<4|d>>4;h=(d&15)<<2|e>>6;i=e&63;if(isNaN(d)){h=i=64}else if(isNaN(e)){i=64}b=b+keyStr64.charAt(f)+keyStr64.charAt(g)+keyStr64.charAt(h)+keyStr64.charAt(i);c=d=e="";f=g=h=i=""}while(j<a.length);return b},
            decode64    = function(a){var b="";var c,d,e="";var f,g,h,i="";var j=0;var k=/[^A-Za-z0-9\+\/\=]/g;if(k.exec(a)){}a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{f=keyStr64.indexOf(a.charAt(j++));g=keyStr64.indexOf(a.charAt(j++));h=keyStr64.indexOf(a.charAt(j++));i=keyStr64.indexOf(a.charAt(j++));c=f<<2|g>>4;d=(g&15)<<4|h>>2;e=(h&3)<<6|i;b=b+String.fromCharCode(c);if(h!=64){b=b+String.fromCharCode(d)}if(i!=64){b=b+String.fromCharCode(e)}c=d=e="";f=g=h=i=""}while(j<a.length);return unescape(b)},
            transition  = function(el, direction, init){
                var opposite    = (direction === 'left') ? '' : 'left';

                if(init){
                    el.addClass('active');
                    _this.container.css({'height' : calculateHeight(el) + 'px'});
                } else {
                    _this.container
                        .find('.page.active')
                        .css('position','absolute')
                        .addClass(direction)
                        .removeClass('active')
                        .end()
                        .css({'height' : calculateHeight(el) + 'px'});
                    el.addClass('active')
                        .removeClass(opposite)
                        .delay(250)
                        .queue(function(){
                            $(this).css('position','relative').dequeue();
                        });
                }
            },

            calculateHeight = function(el){
                // This calculates the height of the bounding box for the repo display.
                // clientHeight is element containing fetched results, plus the h1 tag, plus
                // the div repo margin has of 15 pixels.
                return (el[0].clientHeight + _this.container.find('h1').outerHeight(true) + 15);
            },

            getMimeTypeByExtension = function(extension){
                var mimeTypes = {
                    // images
                    'png': 'image/png',
                    'gif': 'image/gif',
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'ico': 'image/x-icon'
                };
                return mimeTypes[extension] ? mimeTypes[extension] : 'text/plain';
            };

        // Settings
        _this.settings = $.extend({
                user    : '',
                name    : '',
                branch  : 'master',
                css     : '@font-face{font-family:"Octicons Regular";src:url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.eot?639c50d4");src:url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.eot?639c50d4#iefix") format("embedded-opentype"),url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.woff?0605b255") format("woff"),url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.ttf?f82fcba7") format("truetype"),url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.svg?1f7afa21#newFontRegular") format("svg");font-weight:normal;font-style:normal}@font-face{font-family:"repo-icons";src:url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.eot");src:url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.eot#iefix") format("embedded-opentype"),url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.woff") format("woff"),url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.ttf") format("truetype"),url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.svg") format("svg");font-weight:normal;font-style:normal}.repo,.repo *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box}.repo ul *{display:block;font-family:sans-serif;font-size:13px;line-height:18px}.repo{width:100%;margin:0 0 15px 0;position:relative;padding-bottom:1px;color:#555;overflow:hidden;height:300px;-webkit-transition:height .25s;-moz-transition:height .25s;-o-transition:height .25s;-ms-transition:height .25s;transition:height .25s}.repo .page{background:#f8f8f8;border:4px solid rgba(0,0,0,0.08);border-radius:3px;-ms-filter:"alpha(opacity=0)";filter:alpha(opacity=0);opacity:0;left:100%;width:98%;position:absolute;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;-ms-transition:all .25s;transition:all .25s}.repo .page.active{left:1%!important;-ms-filter:"alpha(opacity=100)";filter:alpha(opacity=100);opacity:1;display:block}.repo .page.left{left:-100%}.repo .loader{position:absolute;display:block;width:100%;height:300px;top:0;left:0;background:url(data:image/gif;base64,R0lGODlhQABAALMIAOzu7PT29Ozq7PTy9Pz6/Pz+/OTm5OTi5P///wAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBN0RGOTZFMEJFNDAxMUUxOThFRUU2MTc0Q0I1MERFRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBN0RGOTZFMUJFNDAxMUUxOThFRUU2MTc0Q0I1MERFRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkE3REY5NkRFQkU0MDExRTE5OEVFRTYxNzRDQjUwREVEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkE3REY5NkRGQkU0MDExRTE5OEVFRTYxNzRDQjUwREVEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp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) no-repeat center 50%}.repo.loaded .loader{display:none}.repo h1{padding:0 0 0 10px;font-family:sans-serif;font-size:20px;line-height:26px;color:#000;font-weight:normal}.repo h1 a:nth-of-type(1),.repo h1 a.active{font-weight:bold}.repo h1 a.active,.repo h1 a.active:active,.repo h1 a.active:visited,.repo h1 a.active:hover{color:#000}.repo h1 a,.repo h1 a:active,.repo h1 a:visited,.repo h1 a:hover{color:#4183c4;text-decoration:none}.repo h1 a:after{content:"/";color:#999;padding:0 5px;font-weight:normal}.repo h1 a:last-child:after{content:""}.repo .page,.repo ul{zoom:1}.repo .page:before,.repo .page:after,.repo ul:before,.repo ul:after{content:"";display:table}.repo .page:after,.repo ul:after{clear:both}.repo ul{border:1px solid rgba(0,0,0,0.25);margin:0;padding:0}.repo li{width:100%;margin:0;padding:0;float:left;border-bottom:1px solid #ccc;position:relative;white-space:nowrap}.repo li.titles{background:-webkit-linear-gradient(#fafafa,#eaeaea);background:-moz-linear-gradient(#fafafa,#eaeaea);background:-o-linear-gradient(#fafafa,#eaeaea);background:-ms-linear-gradient(#fafafa,#eaeaea);background:linear-gradient(#fafafa,#eaeaea);font-weight:bold;padding:10px 10px 8px 36px;text-shadow:0 1px 0 #fff}.repo li:before{content:"t";font-family:"repo-icons";position:absolute;top:10px;left:10px;font-size:18px;-webkit-font-smoothing:antialiased}.repo li.dir:before{content:"f ";color:#80a6cd}.repo li.titles:before,.repo li.back:before{content:""}.repo li:last-child{border:0;padding-bottom:none;margin:0}.repo li a,.repo li a:visited,.repo li a:active{color:#4183c4;width:100%;padding:10px 10px 8px 36px;display:block;text-decoration:none}.repo li a:hover{text-decoration:underline}.repo li span{display:inline-block}.repo li span:nth-of-type(1){width:30%}.repo li span:nth-of-type(2){width:20%}.repo li span:nth-of-type(3){width:40%}.repo .vg-container{position:relative;overflow:auto;white-space:pre!important;word-wrap:normal!important}.repo .vg-container,.repo .vg-code{border:0;margin:0;overflow:auto}.repo .vg-code .vg-line,.repo .vg-gutter .vg-number{display:block;height:1.5em;line-height:1.5em!important}.repo .vg-gutter{float:left;min-width:20px;width:auto;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.repo .vg-number{cursor:pointer}.repo .vg-container{font-family:"Bitstream Vera Sans Mono","Courier New",monospace;font-size:13px;border:1px solid #ddd}.repo .vg-gutter{background-color:#ececec;border-right:1px solid #ddd;text-align:right;color:#aaa;padding:1em .5em;margin-right:.5em}.repo .vg-code *::-moz-selection,.repo .vg-code *::-webkit-selection,.repo .vg-code *::selection,.repo .vg-line.vg-highlight{background-color:#ffc}.repo .vg-line span.vg-highlight{color:blue;font-weight:bold;text-decoration:underline}.repo .vg-container .vg-code{display:block;padding:1em .5em;background:#fff}.repo .vg-code{color:#000;background:#f8f8ff;border:0;padding:.4em}.repo .vg-code .comment,.repo .vg-code .template_comment,.repo .vg-code .diff .header,.repo .vg-code .javadoc{color:#998;font-style:italic}.repo .vg-code .keyword,.repo .vg-code .css .rule .keyword,.repo .vg-code .winutils,.repo .vg-code .javascript .title,.repo .vg-code .lisp .title,.repo .vg-code .subst{color:#000;font-weight:bold}.vg-code .number,.vg-code .hexcolor{color:#40a070}.vg-code .string,.repo .vg-code .tag .value,.repo .vg-code .phpdoc,.repo .vg-code .tex .formula{color:#d14}.repo .vg-code .title,.repo .vg-code .id{color:#900;font-weight:bold}.repo .vg-code .javascript .title,.repo .vg-code .lisp .title,.repo .vg-code .subst{font-weight:normal}.repo .vg-code .class .title,.repo .vg-code .haskell .label,.repo .vg-code .tex .command{color:#458;font-weight:bold}.repo .vg-code .tag,.repo .vg-code .tag .title,.repo .vg-code .rules .property,.repo .vg-code .django .tag .keyword{color:#000080;font-weight:normal}.repo .vg-code .attribute,.repo .vg-code .variable,.repo .vg-code .instancevar,.repo .vg-code .lisp .body{color:#008080}.repo .vg-code .regexp{color:#009926}.repo .vg-code .class{color:#458;font-weight:bold}.repo .vg-code .symbol,.repo .vg-code .ruby .symbol .string,.repo .vg-code .ruby .symbol .keyword,.repo .vg-code .ruby .symbol .keymethods,.repo .vg-code .lisp .keyword,.repo .vg-code .tex .special,.repo .vg-code .input_number{color:#990073}.repo .vg-code .builtin,.repo .vg-code .built_in,.repo .vg-code .lisp .title{color:#0086b3}.repo .vg-code .codeprocessor,.repo .vg-code .pi,.repo .vg-code .doctype,.repo .vg-code .shebang,.repo .vg-code .cdata{color:#999;font-weight:bold}.repo .vg-code .deletion{background:#fdd}.repo .vg-code .addition{background:#dfd}.repo .vg-code .diff .change{background:#0086b3}.repo .vg-code .chunk{color:#aaa}.repo .vg-code .tex .formula{-ms-filter:"alpha(opacity=50)";filter:alpha(opacity=50);opacity:.5}'
            }, options);

        // Extension Hashes
        _this.extensions = {
            as          : 'actionscript',
            coffee      : 'coffeescript',
            css         : 'css',
            html        : 'html',
            js          : 'javascript',
            md          : 'markdown',
            php         : 'php',
            py          : 'python',
            rb          : 'ruby'
        };

        // Repo
        _this.repo = {
            name        : 'default',
            folders     : [],
            files       : []
        };

        // Namespace - strip out characters that would have to be escaped to be used in selectors
        _this.namespace = _this.settings.name.toLowerCase().replace(/[^a-z0-9_-]/g, '');

        // Check if this namespace is already in use
        var usedNamespaces = $('[data-id^='+ _this.namespace +']');
        if(usedNamespaces.length){
            _this.namespace += String(usedNamespaces.length);
        }

        // Insert CSS
        if(typeof _this.settings.css != 'undefined' && _this.settings.css !== '' && $('#repojs_css').length <= 0)
            $('body').prepend($('<style id="repojs_css">').html(_this.settings.css));

        // Query Github Tree API
        $.ajax({
            url: 'https://api.github.com/repos/' + _this.settings.user + '/' + _this.settings.name + '/git/trees/' + _this.settings.branch + '?recursive=1',
            type: 'GET',
            data: {},
            dataType: 'jsonp',
            success: function(response){

                var treeLength = response.data.tree.length;
                $.each(response.data.tree, function(i){

                    // Setup if last element
                    if(!--treeLength){
                        _this.container.addClass('loaded');
                        // Add 10ms timeout here as some browsers require a bit of time before calculating height.
                        setTimeout( function(){
                            transition(_this.container.find('.page').first(), 'left', true);
                        }, 10 );
                    }

                    // Return if data is not a file
                    if(this.type != 'blob')
                        return;

                    // Setup defaults
                    var first       = _this.container.find('.page').first()
                        ctx         = _this.repo,
                        output      = first,
                        path        = this.path,
                        arr         = path.split('/'),
                        file        = arr[(arr.length - 1)],
                        id          = '';

                    // Remove file from array
                    arr = arr.slice(0,-1);
                    id = _this.namespace;

                    // Loop through folders
                    $.each(arr, function(i){

                        var name    = String(this),
                            index   = 0,
                            exists  = false;

                        id = id + '_split_' + name.replace('.','_dot_');

                        // Loop through folders and check names
                        $.each(ctx.folders, function(i){
                            if(this.name == name){
                                index = i;
                                exists = true;
                            }
                        });

                        // Create folder if it doesn't exist
                        if(!exists){

                            // Append folder to DOM
                            if(output !== first){
                                output.find('ul li.back').after($('<li class="dir"><a href="#" data-id="' + id + '">' + name +'</a></li>'));
                            } else {
                                output.find('ul li').first().after($('<li class="dir"><a href="#" data-id="' + id + '">' + name +'</a></li>'));
                            }

                            // Add folder to repo object
                            ctx.folders.push({
                                name        : name,
                                folders     : [],
                                files       : [],
                                element     : $('<div class="page" id="' + id + '"><ul><li class="titles"><span>name</span></li><li class="back"><a href="#">..</a></li></ul></page>').appendTo(_this.container)[0]
                            });
                            index = ctx.folders.length-1;

                        }

                        // Change context & output to the proper folder
                        output = $(ctx.folders[index].element);
                        ctx = ctx.folders[index];

                    });

                    // Append file to DOM
                    output.find('ul').append($('<li class="file"><a href="#" data-path="' + path + '" data-id="' + id + '">' + file +'</a></li>'));

                    // Add file to the repo object
                    ctx.files.push(file);

                });

                // Bind to page links
                _this.container.on('click', 'a', function(e){

                    e.preventDefault();

                    var link        = $(this),
                        parent      = link.parents('li'),
                        page        = link.parents('.page'),
                        repo        = link.parents('.repo'),
                        el          = $('#' + link.data('id'));

                    // Is link a file
                    if(parent.hasClass('file')){

                        el = $('#' + link.data('id'));

                        if(el.legnth > 0){
                            el.addClass('active');
                        } else {
                            $.ajax({
                                url: 'https://api.github.com/repos/' + _this.settings.user + '/' + _this.settings.name + '/contents/' + link.data('path') + '?ref=' + _this.settings.branch,
                                type: 'GET',
                                data: {},
                                dataType: 'jsonp',
                                success: function(response){
                                    var fileContainer = $('<div class="file page" id="' + link.data('id') + '"></div>'),
                                        extension = response.data.name.split('.').pop().toLowerCase(),
                                        mimeType = getMimeTypeByExtension(extension);

                                    if('image' === mimeType.split('/').shift()){
                                        el = fileContainer.append($('<div class="image"><span class="border-wrap"><img src="" /></span></div>')).appendTo(repo);
                                        el.find('img')
                                            .attr('src', 'data:' + mimeType + ';base64,' + response.data.content)
                                            .attr('alt', response.data.name);
                                    }
                                    else {
                                        el = fileContainer.append($('<pre><code></code></pre>')).appendTo(repo);
                                        if(typeof _this.extensions[extension] != 'undefined')
                                            el.find('code').addClass(_this.extensions[extension]);
                                        el.find('code').html(String(decode64(response.data.content)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
                                        el.find('pre').vanGogh();
                                    }

                                    transition(el, 'left');
                                },
                                error: function(response){
                                    if(console && console.log)
                                        console.log('Request Error:', e);
                                }
                            });
                        }

                    // Is link a folder
                    } else if(parent.hasClass('dir')) {

                        _this.container
                            .find('h1')
                            .find('.active')
                            .removeClass('active')
                            .end()
                            .append('<a href="#" data-id="' + link.data('id') + '" class="active">' + link.text() + '</a>');
                        transition(el, 'left');

                    // Is link a back link
                    } else if(parent.hasClass('back')){

                        _this.container.find('h1 a').last().remove();
                        el = page[0].id.split('_split_').slice(0,-1).join('_split_');
                        el = (el == _this.namespace) ? _this.container.find('.page').first() : $('#' + el);
                        transition(el, 'right');

                    // Is nav link
                    } else {
                        el = el.length ? el : _this.container.find('.page').eq(link.index());

                        if(link[0] !== _this.container.find('h1 a')[0])
                            link.addClass('active');
                        _this.container.find('h1 a').slice((link.index()+1),_this.container.find('h1 a').length).remove();
                        transition(el, 'right');
                    }
                });
            },
            error : function(response){
                if(console && console.log)
                    console.log('Request Error:', response);
            }
        });

        // Setup repo container
        return this.each(function(){
            _this.container = $('<div class="repo"><h1><a href="#" data-id="' + _this.namespace + '_split_default">' + _this.settings.name + '</a></h1><div class="loader"></div><div class="page" id="' + _this.namespace + '_split_default"><ul><li class="titles"><span>name</span></li></ul></div></div>').appendTo($(this));
        });
    };

})(jQuery);

