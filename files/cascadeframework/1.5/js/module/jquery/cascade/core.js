/*!
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 *               CASCADE FRAMEWORK 1.0
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 *
 * Copyright 2013, John Slegers
 * Released under the MIT license
 * http://jslegers.github.com/cascadeframework/license.html
 *
 *
 * This means you can use Cascade Framework for any project,
 * whether commercial or not.
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 * 
 * Cascade Framework also contains the following goodies,
 * which all have the same or similar 'permissive licenses :
 *
 *
 * Includes polyfills by Joshua Bell
 * http://www.calormen.com/polyfill/
 * Released in public domain
 *
 *
 * Includes Google ExplorerCanvas
 * https://code.google.com/p/explorercanvas/
 * Released under the Apache 2.0 license
 *
 *
 * Includes Google Prettify
 * https://code.google.com/p/google-code-prettify/
 * Released under the Apache 2.0 license
 *
 *
 * Includes Yepnope
 * http://yepnopejs.com/
 * Released under the WTFPL license
 *
 *
 * Includes Modernizr
 * http://modernizr.com/
 * Released under the MIT license
 *
 *
 * Includes lodash
 * http://lodash.com/
 * Released under the MIT license
 *
 *
 * Includes jQuery
 * http://jquery.com/
 * Released under the MIT license
 *
 *
 * Includes jQuery Easing plugin
 * http://gsgd.co.uk/sandbox/jquery/easing/
 * Released under the BSD license
 *
 *
 * Includes jQuery Flot plugin
 * http://www.flotcharts.org/
 * Released under the MIT license
 *
 *
 * Includes the Font Awesome webfont
 * http://fortawesome.github.com/Font-Awesome/
 * Released under the SIL Open Font License
 *
 *
 *
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 * Cascade Framework was inspired by many articles and projects
 * 
 * Especially these authors are worth mentioning :
 *             
 *             Nicolle Sullivan
 *             Jonathan Snook
 *             Chris Coyier
 *             Eric Meyer
 *             Nicolas Gallagher
 *             Paul Irish
 *             Mark Otto
 *             Jacob Thornton
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * Date: 2013-03-15
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
*/

(function( $, window, document ){
    var methods = {
        run : function( options ) { 
            Cascade.run( options );
        },
        collapse : function( options ) {
            var options = $.extend( {
                animate       : false
            }, options);
            
            var parent = $(this);
            if(options.animate =='up' || options.animate === true){
                var colsection = parent.children('.collapse-section');
                colsection.animate({
                    height: 'toggle'
                }, 150, "easeInCubic");
                colsection.promise().done(function () {
                    parent.addClass('collapsed');
                });
            } else {
                parent.addClass('collapsed');
            }
            return parent;
        },
        uncollapse : function( options ) {
            var options = $.extend( {
                animate       : false
            }, options);
            
            var parent = $(this);
            if(options.animate =='up' || options.animate === true){
                var colsection = parent.children('.collapse-section');
                parent.removeClass('collapsed');
                colsection.hide().animate({
                    height: 'toggle'
                }, 150, "easeInCubic");
            } else {
                parent.removeClass('collapsed');
            }
            return parent;
        }
    };

    $.fn.cascade = function( method ) {
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.run.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.Cascade' );
        }    
    };
})( jQuery, window, document );

window.Cascade = (function( window, document ) {
    Cascade = {};
    
    Cascade.zindex = function ( condition ) {
        if(condition === true || typeof condition === 'undefined'){
            var zIndexNumber = 10000;
            var position;
            $('.cell, .menu li, .absolute').each(function () {
                if($(this).hasClass('absolute')){
                    position = 'absolute';
                } else {
                    position = 'relative';
                }
                $(this).css({
                    'zIndex' : zIndexNumber,
                    'position' : position
                });
                zIndexNumber -= 10;
            });
        }
        return Cascade;
    }
    
    Cascade.closable = function ( selector ) {
        $(selector).addClass('closable');
        $(document).on({
            click: function (event){
                event.preventDefault();
                var parent = $(this);
                while (parent && !parent.hasClass('closable')){
                    parent = parent.parent();
                }
                if(parent) parent.toggleClass("closed");
            }
        }, selector + ' .close-trigger');
        return Cascade;
    }
    
    Cascade.collapsible = function ( selector ) {
        return Cascade.behavior(selector, {
            name : 'collapsible',
            active : 'collapsed',
            act : 'collapse',
            undo : 'uncollapse',
            trigger : 'collapse-trigger'
        });
    }
    
    Cascade.behavior = function ( selector, behavior ) {
        $(selector).addClass(behavior.name);

        $(document).on({
            click: function (event){
                event.preventDefault();
                var parent = $(this);
                while (parent && !parent.hasClass(behavior.name)){
                    parent = parent.parent();
                }
                if(parent) {
                    if(parent.hasClass(behavior.active)){
                        parent.cascade(behavior.undo, {
                            animate:true
                        });
                    } else {
                        parent.cascade(behavior.act, {
                            animate:true
                        });
                    }
                }
            }
        }, selector + ' .' + behavior.trigger);
        return Cascade;
    }
    
    Cascade.collapse = function ( selector, options ) {
        $(selector).cascade('collapse', options);
        return Cascade;
    }
    
    Cascade.uncollapse = function ( selector, options ) {
        $(selector).cascade('uncollapse', options);
        return Cascade;
    }
    
    Cascade.events = function ( selector, label, options ) {
        var options = $.extend( {
            hover               : true,
            active              : true,
            focus               : true
        }, options);
        
        if(options.hover){
            $(document).on({
                mouseover: function (){
                    $(this).addClass("hovered-"+label);
                },
                mouseout: function (){
                    $(this).removeClass("hovered-"+label);
                }
            }, selector);
        }
        if(options.active){
            $(document).on({
                mousedown: function () {
                    $(this).addClass("active-"+label);
                },
                mouseup: function () {
                    $(this).removeClass("active-"+label);
                }
            }, selector);
        }
        if(options.focus){
            $(document).on({
                focusin: function () {
                    $(this).addClass("focused-"+label);
                },
                focusout: function () {
                    $(this).removeClass("focused-"+label);
                }
            }, selector);
        }
        return Cascade;
    }
    
    Cascade.table = function ( selector, options ) {
        if(options.zebra){
            $(selector).addClass('zebra');
            $(selector + ' tbody tr:nth-child(odd)').addClass('odd');
        }
        if(options.verzebra){
            $(selector).addClass('ver-zebra');
            $(selector + ' td:nth-child(odd), ' + selector + ' th:nth-child(odd)').addClass('odd');
        }
        if(options.rowevents){
            Cascade.events('tr', 'row');
        }
        if(options.cellevents){
            Cascade.events('th, td', 'cell');
        }
        return Cascade;
    }

    Cascade.formhelpers = function ( ) {
        $("input").addClass(
            function (index) {
                var type = $(this).attr('type');
                switch(type) {
                    case 'reset':
                    case 'submit':
                        type = "button " + type;
                }
                return type;
            });
        $('button').addClass('button');
        
        return Cascade;
    }
    
    Cascade.listhelpers = function ( selector ) {
        $(document)
        .on({
            mouseover: function (){
                $(this).addClass("hovered-item");
                $(this).children().addClass('child-of-hovered-item');
            },
            mouseout: function (){
                $(this).removeClass("hovered-item");
                $(this).children().removeClass('child-of-hovered-item');
            },
            mousedown: function () {
                $(this).addClass("active-item");
            },
            mouseup: function () {
                $(this).removeClass("active-item");
            }
        }, selector);
        return Cascade;
    }
    
    Cascade.buttonhelpers = function ( selector ) {
        $(document)
        .on({
            mouseover: function (){
                $(this).addClass("hovered-button");
            },
            mouseout: function (){
                $(this).removeClass("hovered-button");
            },
            mousedown: function () {
                $(this).addClass("active-button");
            },
            mouseup: function () {
                $(this).removeClass("active-button");
            }
        }, selector);
        return Cascade;
    }

    Cascade.textfieldhelpers = function ( selector ) {
        $(document)
        .on({
            focusin: function () {
                $(this).addClass("focused-input");
            },
            focusout: function () {
                $(this).removeClass("focused-input");
            }
        }, selector);
        return Cascade;
    }

    Cascade.tabs = function ( selector ) {
        $(document)
        .on({
            click: function (e) {
                var $parent = $(this).parent();
                $parent.parent().children().removeClass("active");
                $parent.addClass("active");
                return false;
            }
        }, selector);
        return Cascade;
    }

    Cascade.tabblocks = function ( selector, options ) {
        $(document)
        .on({
            click: function () {
                var $tabblock = $(this).closest(options.container);
                $tabblock.find(options.content).children().addClass("hidden-tab");
                $($(this).context.hash).removeClass("hidden-tab");
                $tabblock.find('.tabs li').not('.tab-content .tabs li').removeClass("active");
                return false;
            }
        }, selector);
        return Cascade;
    }
    
    Cascade.prettify = function() {
        window.prettyPrint && prettyPrint();
    }
    
    defaults = {
        textfieldhelpers        : {
            general         : 'input[type=text]'
        },
        buttonhelpers        : {
            general         : 'button, .button'
        },
        listhelpers        : {
            general         : 'li'
        },
        closables        : {
            general         : '.closable'
        },
        collapsibles        : {
            general         : '.collapsible'
        },
        tabs        : {
            general         : '.tabs a'
        },
        tabblocks        : {
            tabblock        : ['.tab-block .tabs a', {
                container:'.tab-block',
                content:'.tab-content:first'
            }], 
            tabblock2d      : ['.tab-block-2d .tabs a', {
                container:'.tab-block-2d',
                content:'.tab-content:first'
            }]
        },
        tables              : {
            general         : ['table', {
                rowevents:true,
                cellevents:true
            }],
            zebra           : ['.zebra', {
                zebra:true
            }],
            verzebra        : ['.ver-zebra', {
                verzebra:true
            }]
        }
    }
    
    Cascade.run = function ( options ) {
        var options = $.extend(defaults, options);
        Cascade.prettify();
        Cascade.formhelpers();
        Cascade.zindex(Detector.browser.msie && Detector.browser.version < 8);
        for(var i in options.textfieldhelpers){
            Cascade.textfieldhelpers(options.textfieldhelpers[i]);
        }
        for(var i in options.buttonhelpers){
            Cascade.buttonhelpers(options.buttonhelpers[i]);
        }
        for(var i in options.listhelpers){
            Cascade.listhelpers(options.listhelpers[i]);
        }
        for(var i in options.closables){
            Cascade.closable(options.closables[i]);
        }
        for(var i in options.collapsibles){
            Cascade.collapsible(options.collapsibles[i]);
        }
        for(var i in options.tabblocks){
            Cascade.tabblocks(options.tabblocks[i][0], options.tabblocks[i][1]);
        }
        for(var i in options.tabs){
            Cascade.tabs(options.tabs[i]);
        }
        for(var i in options.tables){
            Cascade.table(options.tables[i][0], options.tables[i][1]);
        }
        
        return Cascade;
    };
    
    return Cascade;
})(this, this.document);

$(document).ready(function () {
    $(document).cascade();
});