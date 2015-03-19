/*global jQuery */
/*!
 * Kerning.js
 * Version: 0.2
 * Copyright 2011 Joshua Gross
 * MIT license
 *
 * Usage:
 *  Include this file anywhere in your HTML
 *    <script src="kerning.js"></script>
 *
 *  Then, add any of the attributes following to your CSS, under any
 *  selectors you want modified:
 *    -letter-kern, -letter-size, -letter-weight, -letter-color, -letter-transform
 *    -word-kern, -word-size, -word-weight, -word-color, -word-transform
 *
 *  To use pairings (e.g., modify 'a' if 'ab' is paired):
 *    -letter-pairs('xy': [value], …)
 *    -word-pairs('cat mouse': [value], …)
 *
 *  To use multiple transforms, you need to use transform "groups":
 *    -transform-group([transform] [transform] …)
 *
 *  Sometimes you need to want to use a different size or weight, depending on what
 *  font has loaded:
 *    font-size: [default size];
 *    font-size: if-font('font name': [size], 'font name': [size], …);
 *  (The first line is a fallback should Kerning.js not load. This is recommended.)
 *
 *  That's it! Attributes will be applied automagically.
 *
 * Examples:
 *  Alter first 3 letters:
 *    -letter-size: 100px 20px 30px;
 *
 *  Modify letter pairs:
 *    -letter-kern: -letter-pairs('ab': 1px,
 *                                'bc': 300px,
 *                                's ': 100px);
 *
 *  Transform the first two letters:
 *    -letter-transform: -transform-group(rotate3d(0,0,1,10deg) translate3d(0,10px,0))
 *                       -transform-group(translate3d(0,-10px,0) rotate3d(0,0,1,-10deg));
 *
 *  Modify word pairs:
 *    -word-size: -word-pairs('this is': 10em);
 *
 *  Modify the first 3 words:
 *    -word-size: 10em 0.1em 0.2em;
 *
 *  Using repeat rules:
 *    -letter-color: -letter-repeat(even: #f0f0f0, odd: #cccccc);
 *    -letter-color: -letter-repeat(2n+1: #f0f0f0);
 *
 *  Using conditionals:
 *    -letter-kern: if-font('Helvetica Neue': 0 1px 1px, 'Helvetica': 0 -1px 0);
 *
 *  Using conditionals on existing properties for weight or size:
 *    font-size: 9.5em;
 *    font-size: if-font('Helvetica Neue': 10em, 'Helvetica': 9em);
 */
(function($){
    /*!
     * jQuery based CSS parser
     * documentation: http://youngisrael-stl.org/wordpress/2009/01/16/jquery-css-parser/
     * Version: 1.3
     * Copyright (c) 2011 Daniel Wachsstock
     * MIT license
     */
    (function() {
        // utility function, since we want to allow $('style') and $(document), so we need to look for elements in the jQuery object ($.fn.filter) and elements that are children of the jQuery object ($.fn.find)
        $.fn.findandfilter = function(selector) {
            var ret = this.filter(selector).add(this.find(selector));
            ret.prevObject = ret.prevObject.prevObject; // maintain the filter/end chain correctly (the filter and the find both push onto the chain).
            return ret;
        };

        $.fn.parsecss = function(callback, parseAttributes) {
            var parse = function(str) { $.parsecss(str, callback) }; // bind the callback
            this.findandfilter('style')
                .each(function(){
                    parse(this.innerHTML);
                })
                .end()
                .findandfilter('link[type="text/css"],link[rel="stylesheet"]')
                .each(function(){
                    // only get the stylesheet if it's not disabled, it won't trigger cross-site security (doesn't start with anything like http:) and it uses the appropriate media)
                    if(!this.disabled && !(/^\w+:/.test($(this).attr('href'))) && $.parsecss.mediumApplies(this.media))
                        $.get(this.href, parse);
                })
                .end();

            if(parseAttributes) {
                $.get(location.pathname+location.search, 'text', function(HTMLtext) {
                    styleAttributes(HTMLtext, callback);
                });
            }

            return this;
        };

        $.parsecss = function(str, callback) {
            var ret = {};
            str = munge(str).replace(/@(([^;`]|`[^b]|`b[^%])*(`b%)?);?/g, function(s, rule) {
                // @rules end with ; or a block, with the semicolon not being part of the rule but the closing brace (represented by `b%) is
                processAtRule($.trim(rule), callback);
                return '';
            });

            $.each(str.split('`b%'), function(i, css) { // split on the end of a block
                css = css.split('%b`'); // css[0] is the selector; css[1] is the index in munged for the cssText
                if (css.length < 2) return; // invalid css
                css[0] = restore(css[0]);
                ret[css[0]] = $.extend(ret[css[0]] || {}, parsedeclarations(css[1]));
            });
            callback(ret);
        };
        // explanation of the above: munge(str) strips comments and encodes strings and brace-delimited blocks, so that
        // %b` corresponds to { and `b% corresponds to }
        // munge(str) replaces blocks with %b`1`b% (for example)
        //
        // str.split('`b%') splits the text by '}' (which ends every CSS statement)
        // Each so the each(munge(str... function(i,css)
        // is called with css being empty (the string after the last delimiter), an @rule, or a css statement of the form
        // selector %b`n where n is a number (the block was turned into %b`n`b% by munge). Splitting on %b` gives the selector and the
        // number corresponding to the declaration block. parsedeclarations will do restore('%b`'+n+'`b%') to get it back.

        // if anyone ever implements http://www.w3.org/TR/cssom-view/#the-media-interface, we're ready
        $.parsecss.mediumApplies = (window.media && window.media.query) || function(str) {
            if(!str) return true; // if no descriptor, everything applies
            if(str in media) return media[str];
            var style = $('<style media="'+str+'">body {position: relative; z-index: 1;}</style>').appendTo('head');
            return media[str] = [$('body').css('z-index')==1, style.remove()][0]; // the [x,y][0] is a silly hack to evaluate two expressions and return the first
        };

        $.parsecss.isValidSelector = function(str) {
            var s = $('<style>'+str+'{}</style>').appendTo('head')[0];
            // s.styleSheet is IE; it accepts illegal selectors but converts them to UNKNOWN. Standards-based (s.shee.cssRules) just reject the rule
            return [s.styleSheet ? !/UNKNOWN/i.test(s.styleSheet.cssText) : !!s.sheet.cssRules.length, $(s).remove()][0]; // the [x,y][0] is a silly hack to evaluate two expressions and return the first
        };

        $.parsecss.parseArguments = function(str) {
            if(!str) return [];
            var ret = [], mungedArguments = munge(str, true).split(/\s+/); // can't use $.map because it flattens arrays !
            for (var i = 0; i < mungedArguments.length; ++i) {
                var a = restore(mungedArguments[i]);
                try {
                    ret.push(eval('('+a+')'));
                } catch(err) {
                    ret.push(a);
                }
            }
            return ret;
        };

        // expose the styleAttributes function
        $.parsecss.styleAttributes = styleAttributes;

        // caches
        var media = {}; // media description strings
        var munged = {}; // strings that were removed by the parser so they don't mess up searching for specific characters

        // private functions

        function parsedeclarations(index) { // take a string from the munged array and parse it into an object of property: value pairs
            var str = munged[index].replace(/^{|}$/g, ''); // find the string and remove the surrounding braces
            str = munge(str); // make sure any internal braces or strings are escaped
            var parsed = {};
            $.each(str.split(';'), function (i, decl) {
                decl = decl.split(':');
                if(decl.length < 2) return;
                parsed[restore(decl[0])] = restore(decl.slice(1).join(':'));
            });
            return parsed;
        }

        // replace strings and brace-surrounded blocks with %s`number`s% and %b`number`b%. By successively taking out the innermost
        // blocks, we ensure that we're matching braces. No way to do this with just regular expressions. Obviously, this assumes no one
        // would use %s` in the real world.
        // Turns out this is similar to the method that Dean Edwards used for his CSS parser in IE7.js (http://code.google.com/p/ie7-js/)
        var REbraces = /{[^{}]*}/;
        var REfull = /\[[^\[\]]*\]|{[^{}]*}|\([^()]*\)|function(\s+\w+)?(\s*%b`\d+`b%){2}/; // match pairs of parentheses, brackets, and braces and function definitions.
        var REatcomment = /\/\*@((?:[^\*]|\*[^\/])*)\*\//g; // comments of the form /*@ text */ have text parsed
        // we have to combine the comments and the strings because comments can contain string delimiters and strings can contain comment delimiters
        // var REcomment = /\/\*(?:[^\*]|\*[^\/])*\*\/|<!--|-->/g; // other comments are stripped. (this is a simplification of real SGML comments (see http://htmlhelp.com/reference/wilbur/misc/comment.html) , but it's what real browsers use)
        // var REstring = /\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*'/g; //  match escaped characters and strings
        var REcomment_string = /(?:\/\*(?:[^\*]|\*[^\/])*\*\/)|(\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*')/g;
        var REmunged = /%\w`(\d+)`\w%/;
        var uid = 0; // unique id number
        function munge(str, full) {
            str = str
                    .replace(REatcomment,'$1') // strip /*@ comments but leave the text (to let invalid CSS through)
                    .replace(REcomment_string, function (s, string) { // strip strings and escaped characters, leaving munged markers, and strip comments
                        if (!string) return '';
                        var replacement = '%s`'+(++uid)+'`s%';
                        munged[uid] = string.replace(/^\\/,''); // strip the backslash now
                        return replacement;
                    });
            // need a loop here rather than .replace since we need to replace nested braces
            var RE = full ? REfull : REbraces;
            while(match = RE.exec(str)) {
                replacement = '%b`'+(++uid)+'`b%';
                munged[uid] = match[0];
                str = str.replace(RE, replacement);
            }
            return str;
        }

        function restore(str) {
            if(str === undefined) return str;
            while(match = REmunged.exec(str)) {
                str = str.replace(REmunged, munged[match[1]]);
            }
            return $.trim(str);
        }

        function processAtRule (rule, callback) {
            var split = rule.split(/\s+/); // split on whitespace
            var type = split.shift(); // first word
            if(type=='media') {
                var css = restore(split.pop()).slice(1, -1); // last word is the rule; need to strip the outermost braces
                if($.parsecss.mediumApplies(split.join(' '))) {
                    $.parsecss(css, callback);
                }
            } else if (type=='import') {
                var url = restore(split.shift());
                if($.parsecss.mediumApplies(split.join(' '))) {
                    url = url.replace(/^url\(|\)$/gi, '').replace(/^["']|["']$/g, ''); // remove the url('...') wrapper
                    $.get(url, function(str) { $.parsecss(str, callback) });
                }
            }
        }

        // override show and hide. $.data(el, 'showDefault') is a function that is to be used for show if no arguments are passed in (if there are arguments, they override the stored function)
        // Many of the effects call the native show/hide() with no arguments, resulting in an infinite loop.
        var _show = {show: $.fn.show, hide: $.fn.hide}; // save the originals
        $.each(['show', 'hide'], function() {
            var which = this, show = _show[which], plugin = which+'Default';
            $.fn[which] = function(){
                if(arguments.length > 0) return show.apply(this, arguments);
                return this.each(function() {
                    var fn = $.data(this, plugin), $this = $(this);
                    if(fn) {
                        $.removeData(this, plugin); // prevent the infinite loop
                        fn.call($this);
                        $this.queue(function() { $this.data(plugin, fn).dequeue() }); // put the function back at the end of the animation
                    } else {
                        show.call($this);
                    }
                });
            };
            $.fn[plugin] = function() {
                var args = $.makeArray(arguments), name = args[0];
                if($.fn[name]) { // a plugin
                    args.shift();
                    var fn = $.fn[name];
                } else if($.effects && $.effects[name]) { // a jQuery UI effect. They require an options object as the second argument
                    if(typeof args[1] != 'object') args.splice(1, 0, {});
                    fn = _show[which];
                } else { // regular show/hide
                    fn = _show[which];
                }
                return this.data(plugin, function() { fn.apply(this,args) });
            };
        });

        // experimental: find unrecognized style attributes in elements by reloading the code as text
        var RESGMLcomment = /<!--([^-]|-[^-])*-->/g; // as above, a simplification of real comments. Don't put -- in your HTML comments!
        var REnotATag = /(>)[^<]*/g;
        var REtag = /<(\w+)([^>]*)>/g;

        function styleAttributes(HTMLtext, callback) {
            var ret = '', style, tags = {}; //  keep track of tags so we can identify elements unambiguously
            HTMLtext = HTMLtext.replace(RESGMLcomment, '').replace(REnotATag, '$1');
            munge(HTMLtext).replace(REtag, function(s, tag, attrs) {
                tag = tag.toLowerCase();
                if(tags[tag]) ++tags[tag]; else tags[tag] = 1;
                if(style = /\bstyle\s*=\s*(%s`\d+`s%)/i.exec(attrs)) { // style attributes must be of the form style = "a: bc" ; they must be in quotes. After munging, they are marked with numbers. Grab that number
                    var id = /\bid\s*=\s*(\S+)/i.exec(attrs); // find the id if there is one.
                    if (id) id = '#'+restore(id[1]).replace(/^['"]|['"]$/g,''); else id = tag + ':eq(' + (tags[tag]-1) + ')';
                    ret += [id, '{', restore(style[1]).replace(/^['"]|['"]$/g,''),'}'].join('');
                }
            });
            $.parsecss(ret, callback);
        }
    })();


   /*
    * Lettering.JS 0.6.1
    *
    * Copyright 2010, Dave Rupert http://daverupert.com
    * Released under the WTFPL license
    * http://sam.zoy.org/wtfpl/
    *
    * Thanks to Paul Irish - http://paulirish.com - for the feedback.
    *
    * Date: Mon Sep 20 17:14:00 2010 -0600
    */
    (function() {
        function injector(t, splitter, klass, after) {
            var a = t.text().split(splitter), inject = '';
            if (a.length) {
                $(a).each(function(i, item) {
                    inject += '<span class="'+klass+(i+1)+'">'+item+'</span>'+after;
                });
                t.empty().append(inject);
            }
        }

        var methods = {
            init: function() {
                return this.each(function() {
                    injector($(this), '', 'char', '');
                });
            },

            words: function() {
                return this.each(function() {
                    injector($(this), ' ', 'word', ' ');
                });
            },

            lines: function() {
                return this.each(function() {
                    var r = "eefec303079ad17405c889e092e105b0";
                    // Because it's hard to split a <br/> tag consistently across browsers,
                    // (*ahem* IE *ahem*), we replaces all <br/> instances with an md5 hash
                    // (of the word "split").  If you're trying to use this plugin on that
                    // md5 hash string, it will fail because you're being ridiculous.
                    injector($(this).children("br").replaceWith(r).end(), r, 'line', '');
                });
            }
        };

        $.fn.lettering = function(method) {
            // Method calling logic
            if (method && methods[method]) {
                return methods[method].apply(this, [].slice.call( arguments, 1 ));
            } else if (method === 'letters' || !method) {
                return methods.init.apply(this, [].slice.call( arguments, 0 )); // always pass an array
            }
            $.error('Method ' +  method + ' does not exist on jQuery.lettering');
            return this;
        };
    })();


    /*
     *  Adapted from Font UnStack 0.1
     *
     *  Developed by Phil Oye
     *  Copyright (c) 2009 Phil Oye, http://philoye.com/
     *
     *  Licensed under the MIT license:
     *  http://www.opensource.org/licenses/mit-license.php
     *
     */
    var unstack = (function() {
        var fontunstack = {
            init: function(elem){
                var stack = $(elem).css('font-family').match(/[^'",;\s][^'",;]*/g) || [];
                return this.analyzeStack(stack, elem);
            },

            analyzeStack: function(stack, elems) {
                var generics = ["monospace", "sans-serif", "serif", "cursive", "fantasy"];
                var baseline = generics[0];
                var num_fonts = stack.length;
                var last_resort = stack[num_fonts - 1];

                // If author hasn't included a generic (tsk, tsk), let's add one
                if($.inArray(last_resort, generics)) {
                    stack.push(baseline);
                    num_fonts++;
                }

                // If the generic is the same as our baseline, let's use another.
                if(last_resort == baseline) {
                    baseline = generics[1];
                };

                // At this point we're sure there is a generic fallback font, so we'll only iterate though the non-generics.
                for(var i=0; i < num_fonts - 1; i++) {
                    font = stack[i];
                    if(fontunstack.testFont(font, baseline)) {
                        return font;
                    }
                }
            },

            testFont: function(requested_font, baseline_font) {
                var span = $('<span id="font_tester" style="font-family:' + baseline_font + '; font-size:144px;position:absolute;left:-10000px;top:-10000px;visibility:hidden;">mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmml</span>');
                $("body").prepend(span);

                var baseline_width = span.width();
                span.css("font-family", requested_font + "," + baseline_font );
                var requested_width = span.width();
                span.remove();

                // If the dimensions change, the font is installed
                return (requested_width != baseline_width);
            }
        };

        return function(element) {
            return fontunstack.init(element);
        };
    })();


    /*
     * Kerning.js
     */
    window.Kerning = new (function() {
        /* Test for browsers & OSes. Ugly, but type rendering differs between
         * browsers and operating systems. We need CSS flags to allow for that.
         */
        var self = this
          , nav = navigator.platform
          , browserPrefix = [
              'webkitTransform' in document.documentElement.style && 'webkit'
			, navigator.userAgent.indexOf("MSIE") > -1 && 'ms'
            , "MozTransform" in document.documentElement.style && 'moz'
            , window.opera && 'o'
            ].reduce(function(pv, cv) { return pv + (cv || ''); })
          , osPrefix = [
              nav.match(/Mac/) && 'mac'
            , nav.match(/Win/) && 'win'
            , nav.match(/Linux/) && 'linux'
            ].reduce(function(pv, cv) { return pv + (cv || ''); });

        var methods = {
            // Match -[letter|word]-pairs(…) values
            _pairs: function(type, elements, pairString) {
                // checks for the existence of the letter pair property, i.e.: -letter-pairs(…)
                var usingPairs = pairString.match(/^-(letter|word)-pairs\(([\s\S]+)\)$/i);
                if(!usingPairs || usingPairs[1] !== type) return false;

                var els = type === 'word'
                            ? elements.children('span') // for -word-pairs
                            : elements.find('span > span') // for -letter-pairs

                    // we parse the string slightly differently if a transform is used
                  , isTransform = pairString.match(/translate|rotate|skew|perspective/i)

                    // matches and splits the pairing rules
                  , pairs = $.trim(usingPairs[2].replace(/,\s+?'/g, ",'").replace(/:\s+?(\d)/g, ':$1')).split(isTransform ? '),' : ',')
                  
                  , pairInfo, pairKeys, pairDown
                  , pairElements = [];
                if(!pairs) return;

                $.each(pairs, function(index, pair) {
                    pairInfo = pair.split(':');
                    // match the content inside the pair (stripping the leading and tailing quotes)
                    // pairs may not be in quotes, or may have quotes inside quotes (i.e., 'a"'), so we
                    // prefer to do this with a regex.
                    pairInfo[0] = pairInfo[0].replace(/^['"](.+)['"]$/g, '$1');

                    if(type === 'word')
                        pairKeys = pairInfo[0].split(' ');
                    else
                        pairKeys = pairInfo[0];

                    pairDown = function(index) {
                        var char1 = $(this).text().match(new RegExp(pairKeys[0])),
                            nextWord, char2;
                        if(pairKeys[1] !== ' ') {
                            char2 = ($(this).next().html() || '').match(new RegExp(pairKeys[1]));
                        } else {
                            nextWord = type == 'word'
                                            ? $(this).next('[class^="word"]')
                                            // if one of the pairKeys is just a space and we're doing letter pairs,
                                            // we, instead, need to check for the existence of the next word,
                                            // since spaces aren't wrapped
                                            : $(this).parent().next('[class^="word"]');
                            char2 = (!$(this).next().length && nextWord.length);
                        }
                        return char1 && char2;
                    };

                    pairElements.push([pairInfo[1], els.filter(pairDown)]);
                });

                return pairElements;
            },

            // Match -[letter|word]-repeats(…) values
            _repeats: function(type, elements, repeatString) {
                var usingRepeats = repeatString.match(/^-(letter|word)-repeats\(([\s\S]+)\)$/i);
                if(!usingRepeats || usingRepeats[1] !== type) return false;

                var els = type === 'word'
                            ? elements.children('span')
                            : elements.find('span > span'),
                    isTransform = repeatString.match(/translate|rotate|skew|perspective/i),
                    repeats = $.trim(usingRepeats[2].replace(/,\s+?'/g, ",'").replace(/:\s+?(\d)/g, ':$1')).split(isTransform ? '),' : ','),
                    repeatInfo, repeatKeys, repeatDown,
                    repeatElements = [];
                if(!repeats) return;

                $.each(repeats, function(index, repeat) {
                    repeatInfo = repeat.split(':');
                    if(isTransform && repeatInfo[1].substring(repeatInfo[1].length - 1) !== ')')
                        repeatInfo[1] += ')';
                    repeatElements.push([$.trim(repeatInfo[1]), els.filter(':nth-child(' + $.trim(repeatInfo[0]) + ')')]);
                });

                return repeatElements;
            },

            // Match [-[letter|word]-]if-font(…) values (-[letter|word]- is optional)
            _conditional: function(type, elements, rule) {
                var usingConditional = rule.match(/^(?:-(letter|word)-)?if-font\(([\s\S]+)\)$/i);
                if(!usingConditional) return;

                var els = type === 'all'
                            ? elements
                            : type === 'word'
                                ? elements.children('span')
                                : elements.find('span > span'),
                    isTransform = rule.match(/translate|rotate|skew|perspective/i),
                    fonts = usingConditional[2].replace(/\n/g, '').match(/['"][^'"]+['"]:\s*.+?(\)|(?=\w),\s['"]|$)/g),
                    fontInfo, fontElements = {}, elementSet = [];
                if(!fonts) return;

                elements.each(function(i, el) {
                    var fontInUse = unstack(el).replace(/^['"](.+)['"]$/g, '$1');
                    if(!fontElements[fontInUse])
                        fontElements[fontInUse] = [el];
                    else
                        fontElements[fontInUse].push(el);
                });

                $.each(fonts, function(index, font) {
                    fontInfo = font.match(/['"]([^'"]+)['"]:\s*(.+)$/);
                    if(!fontInfo) return true;
                    fontInfo = fontInfo.splice(1);
                    if(fontInfo[0] in fontElements)
                        elementSet.push([$.trim(fontInfo[1]), $(fontElements[fontInfo[0]])]);
                });

                return elementSet;
            },

            // Parse and apply a CSS property
            _applyAttribute: function(type, elements, attribute, values) {
                var conditional = methods._conditional(type, elements, values);
                if(!conditional || !conditional.length)
                    conditional = [[values, elements]];

                $.each(conditional, function(a, ve) {
                    var vals = ve[0], els = ve[1];
                    var custom = methods._pairs(type, els, vals)
                              || methods._repeats(type, els, vals);
                    if(custom) {
                        $.each(custom, function(index, valEl) {
                            if(typeof attribute !== 'string') {
                                var attrs = {};
                                $.each(attribute, function(a, attr) { attrs[attr] = valEl[0]; });
                                valEl[1].css(attrs);
                            } else {
                                valEl[1].css(attribute, valEl[0]);
                            }
                        });
                    } else {
                        var indexValues, keys, transformGroups;
                        // check for transform groups, as we need to parse these slightly differently
                        if(transformGroups = vals.match(/-transform-group\(([\s\S]+?\([^)]+\))*?\)/g)) {
                            indexValues = $.map(transformGroups, function(val, i) {
                                return val.replace(/-transform-group\(([\s\S]+)\)$/, '$1');
                            });
                        } else {
                            indexValues = vals.replace(/[\n\s]+/g, ' ').split(' ');
                        }

                        els.each(function(i, el) {
                            keys = type === 'all'
                                        ? $(el) // match the entire word (only used for certain use cases)
                                        : type === 'word'
                                                ? $(el).children('span')
                                                : $(el).find('span > span'); // letters are spans inside words
                            $.each(indexValues, function(index, value) {
                                if(typeof attribute !== 'string') {
                                    var attrs = {};
                                    $.each(attribute, function(a, attr) { attrs[attr] = value; });
                                    keys.eq(index).css(attrs);
                                } else {
                                    keys.eq(index).css(attribute, value);
                                }
                            });
                        });
                    }
                });
            },

            kern: function(type, elements, kerning) {
                methods._applyAttribute(type, elements, 'margin-right', kerning);
            },

            size: function(type, elements, sizes) {
                methods._applyAttribute(type, elements, 'font-size', sizes);
            },

            weight: function(type, elements, weights) {
                methods._applyAttribute(type, elements, 'font-weight', weights);
            },

            color: function(type, elements, colors) {
                methods._applyAttribute(type, elements, 'color', colors);
            },

            backgroundcolor: function(type, elements, colors) {
                methods._applyAttribute(type, elements, 'background-color', colors);
            },

            transform: function(type, elements, transforms) {
                var attributes = [
                    '-webkit-transform'
                  , '-moz-transform'
                  , '-ms-transform'
                  , '-o-transform'
                  , 'transform'
                ];
                methods._applyAttribute(type, elements, attributes, transforms);
            }
        };

        /**
         * Scan the parsed CSS for properties we want, break them down and style them.
         */
        this._parse = function(css, ignoreParsed) {
            if(!self._parsedCSS) self._parsedCSS = css; // cache the parsed CSS

            for(var selector in css) {
                for(var property in css[selector]) {
                    var match,
                        elements,
                        value = css[selector][property];

                    // Kerning.js prefixed selectors
                    if(match = property.match(new RegExp('^(-' + browserPrefix + '|-' + osPrefix +')?-(letter|word)-(kern|transform|size|color|backgroundcolor|weight)', 'i'))) {
                        var specificity = match[2].toLowerCase(),
                            action = match[3].toLowerCase();

                        elements = $(selector);
                        if(ignoreParsed)
                            elements = elements.not('.kerningjs');

                        elements
                            .not('.kerningjs')
                            .addClass('kerningjs').css('visibility', 'inherit')
                            .lettering('words').children('span').css('display', 'inline-block') // break down into words
                            .lettering().children('span').css('display', 'inline-block'); // break down into letters

                        if(methods[action])
                            methods[action].call(this, specificity, elements, value);

                    // existing selectors with Kerning.js-custom values
                    } else if((match = property.match(/font-(size|weight)/i)) && value.match(/if-font/i)) {
                        var action = match[1].toLowerCase();
                        elements = $(selector);
                        if(ignoreParsed)
                            elements = elements.not('.kerningjs');
                        
                        elements
                            .not('.kerningjs')
                            .addClass('kerningjs').css('visibility', 'inherit');

                        if(methods[action])
                            methods[action].call(this, 'all', elements, value);
                    }
                }
            }
        };

        /**
         * Automatically re-run the script when a DOM node is inserted. This *could potentially*
         * hurt the performance of your page, so I strongly recommend benchmarking what affect
         * this will have on your site.
         */
        this.live = function() {
            // Technically, this event is "depricated," but there isn't exactly a whole
            // boatload of alternatives. Or any alternatives. At all. Not one.
            $(document).bind('DOMNodeInserted', function(evt) {
                if(evt.target) self.refresh(true);
            });
        };

        /**
         * Re-runs the parser to apply styles; to only apply to new elements, set newElementsOnly to true.
         */
        this.refresh = function(newElementsOnly) {
            if(self._parsedCSS)
                self._parse(self._parsedCSS, newElementsOnly);
        };

        // Run the parser on DOM load
        $(function() {
            $(document).parsecss(self._parse, true);
        });
    })();
})(jQuery);