/**
* jQuery creaseFont plugin
* Version 1.0.4
* Increase or Decrase the Fontsize of a whole Website or only some containers
* Remember: 100% = 1em = 16px
* Remember2: my english could be better
* 
* You can call a function after the font is in or decreased:
* after:function( obj ) { }
* the obj contains the following:
*     obj.currSize    ->  the current fontsize, int or float
*     obj.currUnit    ->  the current unit, string
*     obj.currContent ->  the current content, which is in or decreased, string
*     obj.currTask    ->  the current action which has been called, (increaseFont|defaultFont|decreaseFont), string
*     obj.currLvl     ->  the current lvl, an empty string or (max|default|min),
*                         max = maximun zoomlvl arrived
*                         default = default zoom lvl
*                         min = minimum zoom lvl arrived
* 
* Copyright (c) 2011 Nico Renken (blog.mxtracks.de)
* Licensed under Creativ Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0):
* http://creativecommons.org/licenses/by-sa/3.0/
*
*/
(function ($) {
    "use strict";
    $.creaseFont = function (options) {

        var settings = {
                content               :           'body', // container of the content which should be in/decrased, body is all / string
                defaultSize           :           100, // Stock Fontsize in % / integer or float 
                maxSize               :           160, // Maximum Fontsize in % / integer or float 
                minSize               :           60, // Minimum Fontsize in % / integer or float 
                stepSize              :           10, // steps / integer or float 
                unit                  :           '%', // stock unit is % / string
                bFontLarge            :           '#fontLarge', // ID from the increase button / string
                bFontDefault          :           '#fontDefault', // ID from stock button / string
                bFontSmall            :           '#fontSmall', // ID from decrease button / string
                animate               :           true, // Use Animation? / bool
                animateSpeed          :           500, // Animation Speed (milisec)/ int
                cookieName            :           'creaseFont', // Name of the Cookie / string
                cookiePath            :           '/', // Path of the Cookie, / is the whole domain / string
                cookieLifetime        :           60 // Cookie lifetime in days integer
            
            },
            opt = $.extend(true, settings, options),
            currentSize = opt.defaultSize,
            currLvl = '',
            version = '1.0.4',
            newsize;
        
        $(opt.bFontLarge).click(function () {
            increaseFont();
            return false;
        });
    
        $(opt.bFontDefault).click(function () {
            defaultFont();
            return false;
        });
    
        $(opt.bFontSmall).click(function () {
            decreaseFont();
            return false;
        });
    
        if (mycookie(opt.cookieName)) {
            newsize = mycookie(opt.cookieName);
            currentSize = parseInt(newsize, 10);
            var animateState = opt.animate;
            opt.animate = false;
            sizeIT(opt.content, currentSize);
            opt.animate = animateState;
        }
    
        function increaseFont() {
            currentSize = currentSize + opt.stepSize;
            if (currentSize >= opt.maxSize) {
                currentSize = opt.maxSize;
                currLvl = 'max';
            } else {
                currLvl = '';
            }
            sizeIT(opt.content, currentSize);
            mycookie(opt.cookieName, currentSize, {
                path: opt.cookiePath,
                expires: opt.cookieLifetime
            });
            var objects = {
                currSize : currentSize,
                currUnit : opt.unit,
                currContent : opt.content,
                currTask : 'increaseFont',
                currLvl : currLvl
            };
            if ($.isFunction(opt.after)) {
                if (opt.animate) {
                    setTimeout(function(){
                          opt.after(objects);
                    },opt.animateSpeed + 100);
                }else {
                    opt.after(objects);
                }
            }
        }
    
        function defaultFont() {
            currentSize = opt.defaultSize;
            currLvl = 'default';
            sizeIT(opt.content, currentSize);
            mycookie(opt.cookieName, currentSize, {
                path: opt.cookiePath,
                expires: -100
            });
            var objects = {
                currSize : currentSize,
                currUnit : opt.unit,
                currContent : opt.content,
                currTask : 'defaultFont',
                currLvl : currLvl
            };
            if ($.isFunction(opt.after)) {
                if (opt.animate) {
                    setTimeout(function(){
                          opt.after(objects);
                    },opt.animateSpeed + 100);
                }else {
                    opt.after(objects);
                }
            }
        }
    
        function decreaseFont() {
            currentSize = currentSize - opt.stepSize;
            if (currentSize <= opt.minSize) {
                currentSize = opt.minSize;
                currLvl = 'min';
            } else {
                currLvl = '';
            }
            sizeIT(opt.content, currentSize);
            mycookie(opt.cookieName, currentSize, {
                path: opt.cookiePath,
                expires: opt.cookieLifetime
            });
            var objects = {
                currSize : currentSize,
                currUnit : opt.unit,
                currContent : opt.content,
                currTask : 'decreaseFont',
                currLvl : currLvl
            };
            if ($.isFunction(opt.after)) {
                if (opt.animate) {
                    setTimeout(function(){
                          opt.after(objects);
                    },opt.animateSpeed + 100);
                }else {
                    opt.after(objects);
                }
            }
        }
    
        function sizeIT(cn, sz) {
            if (typeof (cn) === 'object' && (cn instanceof Array)) {
                $.each(cn, function (index, value) {
                    if (opt.animate) {
                        $(value).animate({
                            'font-size' : sz  + opt.unit
                        }, opt.animateSpeed);
                    } else {
                        $(value).css('font-size', sz + opt.unit);
                    }
                });
            } else {
                if (opt.animate) {
                    $(cn).animate({
                        'font-size' : sz  + opt.unit
                    }, opt.animateSpeed);
                } else {
                    $(cn).css('font-size', sz + opt.unit);
                }
            }
        }
    
        //unused for now...
        function getPercentSize(where) {
            return parseInt($(where).css('font-size').substr(0, $(where).css('font-size').length - 2) * 6.25, 10);
        }
        /* Cookie  
        * used code from jQuery Cookie plugin by Klaus Hartl (stilbuero.de)
        */
        function mycookie(key, value, cookieOptions) {
          // key and at least value given, set cookie...
            if (arguments.length > 1 && String(value) !== "[object Object]") {
                var cOptions = $.extend({}, cookieOptions);
    
                if (value === null || value === undefined) {
                    cOptions.expires = -1000;
                }
    
                if (typeof cOptions.expires === 'number') {
                    var days = cOptions.expires, t = cOptions.expires = new Date();
                    t.setDate(t.getDate() + days);
                }
    
                value = String(value);
    
                return (document.cookie = [
                    encodeURIComponent(key), '=',
                    cOptions.raw ? value : encodeURIComponent(value),
                    cOptions.expires ? '; expires=' + cOptions.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                    cOptions.path ? '; path=' + cOptions.path : '',
                    cOptions.domain ? '; domain=' + cOptions.domain : '',
                    cOptions.secure ? '; secure' : ''
                ].join(''));
            }
            // key and possibly options given, get cookie...
            var cOptions = value || {};
            var result, decode = cOptions.raw ? function (s) {
                return s;
            } : decodeURIComponent;
            return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
        };
    // Cookie    
    };
})(jQuery);