/***
 * 
 * jbgallery 3.0 BETA 
 * 
 * $Date: 2011-05-16 20:53:56 +0200 (lun, 16 mag 2011) $
 * $Revision: 54 $
 * $Author: massimiliano.balestrieri $
 * $HeadURL: https://jbgallery.googlecode.com/svn/trunk/jbgallery-3.0.js $
 * $Id: jbgallery-3.0.js 54 2011-05-16 18:53:56Z massimiliano.balestrieri $
 * 
 * CHANGELOG:
 * - 21/12/2010 : "image fix" refactory + bugfix window resize style centered
 * - 20/12/2010 : removed javascript-screen css hack. ie9 don't support change of link[media] attr.
 * @requires jQuery v1.4.4
 * 
 * Copyright (c) 2010 Massimiliano Balestrieri
 * Examples and docs at: http://maxb.net/blog/
 * Licensed GPL licenses:
 * http://www.gnu.org/licenses/gpl.html
 * 
 * Thanks to Carlo Denaro, Simone Parato, Aaron Hutten, Alain Bourgeoa, Steffen Wenzel, Alfredo
 * Inspired by http://www.ringvemedia.com/introduction
 */

//jQuery.noConflict();

;(function($){

jBGallery = {};

jBGallery.Settings = function(){
	return {
      //option   : default value     //see docs/demo for usage - PLEASE FIX MY ENGLISH IF YOU CAN & SEND ME  :)
		style    : "centered",       //"centered"|"zoom"|"original" - image style
		menu     : "slider",         //false|"numbers"|"simple"|"slider" - menu type
		shortcuts: [37, 39],         //[prev,next] - keyboard code shortcuts
		slideshow: false,            //true|false - autostart slideshow
		fade     : true,             //true|false - disable all fade effects
		popup    : false,            //true|false - modal box & traditional popup hack to display multiple gallery (3.0 : fullscreen:false)
		randomize: 0,                //0|1|2 - randomize first image (1) or randomize "slideshow" (2) - blackout: http://www.grayhats.org
		caption  : true,             //true|false - show/disable internal caption system
		autohide : false,            //true|false - auto hide menu & caption
		clickable: false,            //true|false - "image click & go"
		current  : 1,                //number     - set initial photo (modal "hack" - see demo. don't use "hash". jbgallery use "location.hash" only in popup mode)
		webkit   : (navigator.userAgent.toLowerCase().search(/webkit/) != -1),  //boolean - used for specific browser hack. if you want, you can force disable this flag & try to find crossbrowser solution
		ie6      : (/MSIE 6/i.test(navigator.userAgent)), //boolean - IDEM
		ie7      : (/MSIE 7/i.test(navigator.userAgent)), //boolean - IDEM
		labels   : {                 //labels of internal menu
			play : "play",
			next : "next",
			prev : "prev",
			stop : "stop",
			close: "close",
			info : "info"
		},
		timers   : {                 //timers 
			fade    : 400,           //fade duration
			interval: 7000,          //slideshow interval
			autohide: 7000           //autohide timeout
		},
		delays: {                    //delays (timers) to improve usability and reduce events
			mousemove: 200,          //used by autohide. cancel autohide timeout every XXXms. 
			resize   : 500,          //used by ie6 to reduce events handled by window.resize
			mouseover: 800           //used by tooltip. show tooltip only if the mouse STAY over thumb for XXXms
		},
		close    : function(){},     //callback handled by menu's button close. see demo. example : close : function(){window.close()}
		before   : function(){},     //callback handled BEFORE image gallery loaded
		after    : function(ev){},   //callback(ev) handled AFTER image gallery loaded. receive the native load event.
		load     : function(ev){},   //callback(ev) handled AFTER native image load event. receive the native load event.
		ready    : function(el){},   //callback(el) handled AFTER jbgallery render. receive the HTML element.
		//WHAT'S NEW - 3.0
		fullscreen: true,            //true|false : the most important feature of jbgallery 3.0. now jbgallery can "stay in a box" and have multiple istance in one page.
		push      : function(o){},   //callback handled by push public method (JBGALLERY API). receive the object/string/array of objects/array of strings passed from external. useful for external menu system
		unshift   : function(o){},   //callback handled by unshift public method (JBGALLERY API). receive the object/string/array of objects/array of strings passed from external.
		shift     : function(){},    //callback handled by shift public method 
		pop       : function(){},    //callback handled by pop public method 
		empty     : function(){}     //callback handled by empty public method 
	}	
};

jBGallery.Init = function(options, data){
    function _init(el){
		if($(el).data("jbgallery"))
            return;
        
		var _options = new jBGallery.Options(options, el);
        
		var _data = new jBGallery.Data(el, options);
        //TEMP? if (_data.length == 0) return;

        $(el).data("jbgallery", new jBGallery.Core(el, _data, _options));
		return $(el).data("jbgallery");   
	}
	if(typeof options == "string"){
        if($(this).data("jbgallery"))
            return $(this).eq(0).data("jbgallery")[options](data);    
    }else if(typeof data == "boolean"){//return api. break chinability
        return _init($(this).get(0));
    }else{
        return this.each(function(nr){
            _init(this);     
        });
    }    
};



jBGallery.Data = function(el, data, options){
    
	var _items = [];
    function _add(o, method){
		if ($.isArray(o)){
            $.each(o, function(i,v){
				o[i] = _extend(v);
				_items[method](o[i]);
            });
        } else {
            o = _extend(o);
			_items[method](o);
        }
		return o;
    }
	function _extend(o){
		var _o;
		if (typeof o == "string") {
		    _o = _extend({href : o});
		} else {
            _o = $.extend({
	            href : '', 
	            title: '', 
	            caption : '',
	            caption_css : '', 
	            thumb : '', 
	            rel : ''
	        },o);
		}
		
		if(_o.thumb.length == 0 || !_o.thumb)
		    _o.thumb = _o.href;
		return _o;
	}
    function _init(){
		_items = $.map($(el).find("ul > li"), function(li, i){
	        var _a = $("a", li).get(0);
	        return _add({
	            href        : _a.href, 
	            title       : _a.title, 
	            rel         : _a.rel,
	            caption     : $("div.caption", li).html(),
	            caption_css : $("div.caption", li).clone().removeClass("caption").attr("class"), 
	            thumb : $("img", li).attr("src") 
	        },'push');
        
        });
	}
	_init();
	
    return {
		get : function(i){
			if(_items[i])
			    return _items[i];
			else
			    return _extend('');//mock object - provo ad inizializzare l'engine anche senza elementi
		},
		items : function(){
			return _items;
		},
		push : function(o){
			return _add(o, 'push');
		},
		unshift : function(o){
			return _add(o, 'unshift');
		},
		shift : function(){
			_items.shift();
		},
		pop : function(){
			_items.pop();
		},
		empty : function(){
			_items = [];
		},
		length : function(){
			return _items.length;
		}
	} 
};

jBGallery.Core = function(el, data, options){

	var that = el;
	
	//PRIVATE METHODS
	function _unload(){
		
		//$("#jbgallery-css").attr("media","javascript-screen");
	    $("html, body").removeClass("jbg").removeClass("ie6");
	    
	    _engine.target.unbind();
	    _engine.target.remove();
	    
        $(that).removeData("jbgallery");
		
		$(that).unbind();
	    $(".jbg-wrap",that).remove();
	    
		//elements - loading, menu, slider, caption
	    var _elements = ".jbgs-thumb, .jbgs, .jbgs-opacity, .jbgs-top, .jbgs-top-opacity, .jbg-loading, .jbg-caption, .jbg-menu-opacity, .jbg-menu";//, #jbg-caption-opacity
	    $(_elements, el).unbind().find("a").unbind();
	    $(_elements, el).remove();
	
	    $(document)
	    .unbind('keydown.jbgallery')
	    .unbind("mousemove.jbgallery")
	    .unbind("click.jbgallery");
	
	    $(window)
	    .unbind('resize.jbgallery');
	}
	
	//MAIN
	new jBGallery.Interface(that, data, options);
    
	var _engine = new jBGallery.Engine(that, data, options);
	var _keys = new jBGallery.Keys(_engine, options.shortcuts);
	_engine.register(_keys);
	
	new jBGallery.OnLoadImage(el, _engine, options);
    
	var _caption = options.caption ? new jBGallery.Caption(that, data, _engine, options) : {};
	
	if (options.menu) {
	    var _menu;
		if (options.menu == 'slider') {
	        _menu = new jBGallery.MenuSlider(that, data, _engine, _caption, options);
	    } else {
	        _menu = new jBGallery.MenuSimple(that, data, _engine, _caption, options);
	    }
		_engine.register(_menu); 
	}

	//events
	$(that).bind("destroy", _unload);
	$(window).bind("unload", _unload);
	
	$(that).fadeIn(options.timers.fade, function(){
	    options.ready(that);//menuslider - preload images... 
	});
	
    // PUCLIC API:
	return {
	    current: _engine.current,
	    play   : _engine.play,
	    stop   : _engine.stop,
	    go     : _engine.go,
	    right  : _engine.right,
	    left   : _engine.left,
	    destroy: _unload,
		//3.0
		length : data.length,
        push   : _engine.push,
        shift  : _engine.shift,
        pop    : _engine.pop,
        unshift: _engine.unshift,
        empty  : _engine.empty
	};
};

jBGallery.Loading = function(){
    document.getElementsByTagName('html')[0].className = "loading";    
};

jBGallery.Options = function(options, el){
    //OPTIONS
    var _metadata = {};
    
    if($.metadata)
        _metadata = $(el).metadata();
    
	var _settings = new jBGallery.Settings();
	
	var _options = $.extend(true, _settings,_metadata,options);
    
    if(_options.current !== 1)
	   _options.randomize = 0;
	
	//15/12/2010 
	//- traditional popup use location.hash
	//- "modal" lightbox use the href.hash of handler (see demo)
	if(_options.popup && _options.current === 1){
	   var _hash = parseInt(location.hash.replace("#",""),10);
	   if(_hash)
	       _options.current = _hash;
	} 
	_options.current--;
	if(_options.current < 0)
	   _options.current = 0;

    //fade    
    if(!_options.fade)
        _options.timers.fade = 0;    
    
    //position absolute più sicuro (...ma bug su opera)
    if(_options.popup && _options.style == 'centered')
        _options.style = 'centered modal';
        
    return _options;    
};



jBGallery.EventTimer = function(el, arr, ms, callback, cancel, debug){
    $.each(arr, function(i,v){
        var _timer = null;
        $(el).bind(v, function(ev) {
            if (_timer) {
                clearTimeout(_timer);
            }
            _timer = setTimeout(function(){
                callback(ev);
            }, ms);
        });
        if(cancel){
            $(el).bind(cancel, function(ev) {
                if(_timer)clearTimeout(_timer);
            });
        }
    });
};

jBGallery.AutoToggle = function(menu, options, effects){

    function _on(){
        _set_interval();
        _toggle_menu(effects[0])
    }
    function _off(){
        _toggle_menu(effects[1]);
    }
    function _toggle_menu(method){
        $(menu).each(function(){
            if($(this).css("visibility") !== "hidden")
                $(this)[method](options.timers.fade);
        });
    }
    function _set_interval(){
        if(_interval){
            clearInterval(_interval);
            _interval = false;
        }
        _interval = setInterval(_off, options.timers.autohide);
    }
    var _interval = false;
    var _timer = false;
    if(!effects)
        effects = ["slideDown","slideUp"];

    $(document)
    .bind("click.jbgallery", _on)
    .bind("mousemove.jbgallery", function(){
        if(_timer){
            clearTimeout(_timer);
            _timer = false;
        }
        _timer = setTimeout(_on, options.delays.mousemove);
    });
    _set_interval();
    
};
jBGallery.Randomizer = function(current, length){
	// RANDOM LOAD - blackout: http://www.grayhats.org
	// 2011/05/16 fixed bug - thanks to http://grethegrundahl.dk/
    current = Math.ceil((length-1)*Math.random());
    if(current >= length)// || current == 0)
        current = 0;
    return current;
};
jBGallery.Interface = function(el, data, options){
	
	if(options.randomize > 0)
	   options.current = jBGallery.Randomizer(options.current, data.length());
	
	var _css = options.style;
	if (options.webkit)
	    _css = '';
		
	var _image = '<img style="visibility:hidden" class="' + _css + ' jbgallery-target" alt="' + data.get(options.current).title + '" src="' + data.get(options.current).href + '" />';
    var _html = '<div class="jbg-wrap ' + options.style + '"><table cellpadding="0" cellspacing="0"><tr><td>' + _image + '</td></tr></table></div>';
    var _caption = '<div class="jbg-caption" style="display:none"></div>';
    var _loading = '<div class="jbg-loading"><span class="jbg-loading"></span></div>';
	
	//hide
    $(el).hide().find("ul").hide();
    
    //$("#jbgallery-css").attr("media","screen");
	
	if (options.fullscreen) {
		$("html, body").addClass("jbg-body");
	} else {
		$(el).addClass("jbox");
	}
	
    if(options.ie6)
        $("html").addClass("ie6");

    
	
    $(el)
    .prepend(_html)
    .prepend(_caption)
	.prepend(_loading);//jbox mod
    
    //first
    var _img = new Image();
    _img.onload = function(){
		$('.jbgallery-target',el).hide().css("visibility", "").fadeIn(options.timers.fade);
    };
	_img.src = data.get(options.current).href;

};

jBGallery.Engine = function(el, data, options){

    //PRIVATE VARS
    var _current = options.current ? options.current + 1 : 1;//start 1 not 0
    var _slideshow = options.slideshow;//onLoadImage comanda
    var _interval = options.timers.interval;
    var _timer = false;
	var _observers = [];
	var _refresh = false;
	//var _timestamp = 0;
    //var _timergo = 1;
    
    var _target  = $('.jbgallery-target',el);
    var _loading = $(".jbg-loading", el);
                
    //PRIVATE METHODS
    function _preload(){
        _loading.css("opacity",0.5).show();
    }
    function _load(nr){
        options.before();
        
        _preload();
        _current = nr;
        
        //IE7
        var _i = data.get(_current - 1);
		var _pl = new Image();
        _pl.onload = function(){
			_target.fadeOut(options.timers.fade, function(){
				//http://code.google.com/p/chromium/issues/detail?id=7731
                if(this.src == _i.href)
				    _i.href += '#' + new Date().getTime();
                $(this).hide().attr({//.hide()
                    "src" : _i.href , 
                    "alt" : _i.title
                });
            });
			
        };
		_pl.src = _i.href;
        
    }
    function _go(nr, ev){

		if(nr > data.length() || (nr === _current && !_refresh))
            return;
        if (_slideshow) {
            if(ev){
                _load(nr);
            }else{
                //clearTimeout(_timer); //BUG SLIDESHOW : 18/12/2010 
                _load(nr);//no event -> next, prev
            }
        } else {
            _load(nr);
        }
		_refresh = false;
    }
    function _right(ev){
		if(options.randomize == 2)
            _current = jBGallery.Randomizer(_current, data.length());

        if(_current < data.length()){
            var _goto = _current + 1;
        }else{
            var _goto = 1;
        }
        _go(_goto, ev);
    }
    function _left(){
        if(options.randomize == 2)
            _current = jBGallery.Randomizer(_current, data.length());

        if(_current > 1){
            var _goto = _current - 1;
        }else{
            var _goto = data.length();
        }
        _go(_goto);
    }
    function _play(){
        if(_slideshow)
            return;

        _slideshow = true;
        
        _right(_interval);//???
    }
    function _stop(){
        _slideshow = false;
        clearTimeout(_timer);
    }
    function _timeout(ev){
		clearTimeout(_timer); //BUG SLIDESHOW : 18/12/2010
        _timer = setTimeout(function(){
            _right(ev);
        }, _interval);
    }
	function _add(m, o){
        var _o = data[m](o);
        //se ho svuotato e aggiungo un elemento aggiorno il target
		if(data.length() == 1)
		  _go(1);
        
		_notify(m, _o);
        options[m](_o);
	}
	function _push(o){
		//after empty
		_add('push', o);
	}
	function  _unshift(o){
        if(data.length() > 1)
            _current++;
        _add('unshift',o);
    }
	function  _pop(){
		data.pop();
		if (_current > data.length() && data.length() > 0) {
			_refresh = true;
			_go(data.length());
		}
		
        _notify('pop');
        options.pop();
        
		if (data.length() == 0)
            _empty();
	}
    function  _shift(){
        data.shift();
		if (_current == 1 && data.length() > 0) {
			_refresh = true;
			_go(1);
		} else {
			_current--;
		}
        _notify('shift');
        options.shift();

        if (data.length() == 0)
            _empty();
    }
    function  _empty(){
		_refresh = true;
		data.empty();
		_notify('empty');
        options.empty();
    }

	function _register(o){
		_observers.push(o);
	}
	function _notify(what, o){
		$.each(_observers, function(i,v){
			_observers[i].notify(what, o);
		});
	}
    //MAIN    
    
    //API
    return {
        current      : function(){
            return _current;
        },
        slideshow    : function(){
            return _slideshow;
        },
        length       : function(){
		    return data.length();
	    },
        play         : _play,
        stop         : _stop,
        go           : _go,
        right        : _right,
        left         : _left,
        target       : _target,
        loading      : _loading,
        timeout      : _timeout,
		//3.0
		register     : _register,
		push         : _push,
		shift        : _shift,
        pop          : _pop,
        unshift      : _unshift,
        empty        : _empty

    };
};

jBGallery.OnLoadImage = function(el, engine, options){

    //PRIVATE METHODS
    function _onload(ev){
		engine.loading.hide();
        engine.target.hide().css("visibility","").fadeIn(options.timers.fade);//opera 11 fadeOut/visibility:hidden
    }
    function _tofix(){
	    return options.ie6 || 
		       options.webkit || 
			   options.style !== "zoom"; 
	}
    //MAIN
	if (_tofix()) {
		new jBGallery.Fix(el, engine.target, options);
	}
	//events
    if (options.clickable) {
        engine.target
        .click(function(){
            engine.right();
            return false;
        })
        .css({
            cursor : "pointer"
        });
    }

    engine.target
    .one("load", function(){
        $('html').removeClass("loading");
    })
    .bind("load",function(ev){
		_onload(ev);
        options.load(ev);
        options.after(ev);
        
        if(engine.slideshow()){
            engine.timeout(ev);
        }
    });    
    
};



jBGallery.Fix = function(el, target, options){
    
	//PRIVATE METHODS:
	function _get_dimensions(img){
        var _cnt = options.fullscreen ? 'body' : el;
        var _bw = $(_cnt).width();
        var _bh = $(_cnt).height();
        var _pm = _bw / _bh;
        var _p = img.width / img.height;
        var _ret = {bw : _bw, bh : _bh, pm : _pm, p : _p, h : img.height, w : img.width};
        _img = null;
		return _ret;
    }
	
	function _fix(){
		var _img = target.get(0);
		var _f = options.style == 'zoom' ? _fix_zoom : _fit_to_box;
		if (options.ie6 || options.ie7) {
            setTimeout(function(){
                _f(_img)
            }, 10);
        } else {
            _f(_img);
        }
    }
	
	function _fit_to_box(img){
	    $(img).width("auto").height("auto");
		var _dim = _get_dimensions(img), _force;
        if (options.style == 'original' && _dim.bw >= _dim.w && _dim.bh >= _dim.h)
            return false;
		if(_dim.bw < _dim.bh){//portrait
            var _ih = _dim.h * _dim.bw / _dim.w;
            if(_force = _ih > _dim.bh){
                var _iw = _dim.w * _dim.bh / _dim.h;
				_width(_iw, _dim, _force);//original 200x2000
            }else{
                _width(_dim.bw, _dim);
            }
        }else{//landscape
            var _iw = _dim.w * _dim.bh / _dim.h;
			if(_force = _iw > _dim.bw){
                var _ih = _dim.h * _dim.bw / _dim.w;
				_heigth(_ih, _dim, _force);//original 2000x200
            }else{
                _heigth(_dim.bh, _dim);
            }
        } 
	}
	
	function _fix_zoom(img){
        $(img).width("auto").height("auto");
        var _dim = _get_dimensions(img);
        if (_dim.bh > _dim.bw) {//portrait
            var _iw = _dim.w * _dim.bh / _dim.h;
            if(_iw < _dim.bw){
                var _ih = _dim.h * _dim.bw / _dim.w;
                _heigth(_ih, _dim, true);//original 2000x200
            }else{
                _heigth(_dim.bh, _dim, true);
            }
        } else {//landscape
            var _ih = _dim.h * _dim.bw / _dim.w;
            if(_ih < _dim.bh){
                var _iw = _dim.w * _dim.bh / _dim.h;
                _width(_iw, _dim, true);
            }else{
                _width(_dim.bw, _dim, true);
            }
        }
    }
    
	function _heigth(nh, dim, force){
		if(force || options.style == 'centered' || dim.bh < dim.h)
            target.height(nh);
	}
	
	function _width(nw, dim, force){
		if(force || options.style == 'centered' || dim.bw < dim.w)
		    target.width(nw);
	}
	
    //MAIN
    //events
    
    
    if (options.fullscreen)//event only in fullscreen
	    jBGallery.EventTimer(window, ["resize.jbgallery"], options.delays.resize, _fix);
		
    target.bind('load', function(ev){
	   _fix();
	});
    
};

jBGallery.Keys = function(engine, shortcuts){
	var _init = false;
    function _onkeydown(e){
        var _keycode = e.which || e.keyCode;
        switch(_keycode){
            case shortcuts[0]:
                engine.left();
                return false;
            break;
            case shortcuts[1]:
                engine.right();
               return false;
            break;
            case 37:
            case 38:
            case 39:
            case 40:
                return false;
            break;
        }
    }
    function _bind(){
		
	   if (!_init && engine.length() > 1) {
       	   $(document).bind("keydown.jbgallery", _onkeydown);
		   _init = true;
	   }	
	}
	//MAIN
	_bind();
	
	//API
	return {
		notify : function(){
		   _bind();	
		}
	}
};

jBGallery.Caption = function(el, data, engine, options){
    var _length = 0;
	var _init = false;
    function _wrap_caption(){
        var _current = engine.current();
        var _html = '', _rel = '';
		var _i = data.get(_current - 1);
		var _rel = _i.title;
        if(_i.rel.length > 0)
		    _rel = '<a href="' + _i.rel + '" target="_blank">' + _i.title + '</a>'; 
        if(_i.title.length > 0)
            _html += '<h3>' + _rel + '</h3>';
        if(_i.caption)
            _html += '<div>' + _i.caption + '</div>';
			
		_caption.removeAttr("class").addClass(_i.caption_css).addClass('jbg-caption');
        return _html + '';
    }
    function _toggle(){
		if(_length > 0)
            _caption.toggle();
    }
	function _build(){
		var _html = _wrap_caption();
        _length = _html.length;
        _caption.html(_html);

        if(_length == 0)
            _caption.hide();
	}
    var _caption = $('.jbg-caption',el);
	
	_build();
	
	if(_length > 0)//first
	   _caption.fadeIn(options.timers.fade);

    if(options.autohide){
        jBGallery.AutoToggle(_caption, options);
    }
	
    engine.target.bind("load", function(){
        _build();
    });

    
    return {
        toggle : _toggle
    };
};

jBGallery.MenuSimple = function(el, data, engine, caption, options){
    
    var that = el;
    var _init = false;
	var _menu, _containers;
	var _h_play = _button('jbg-play', options.labels.play, play).toggle(!options.slideshow);
	var _h_stop = _button('jbg-stop', options.labels.stop, stop).toggle(options.slideshow);
	var _length = engine.length();
	//var _cnt = el; // options.fullscreen ? 'body' : el;//jbox
    
    //PRIVATE METHODS
    function _update_classes(ev){
        var _nr = engine.current();
		_menu.find("a.selected").removeClass("selected");
        _menu.find("a:eq("+ _nr +")").addClass("visited").addClass("selected");
    }
    function _button(css, label, callback){
        var _el = $('<a href="#" class="'+css+'">'+label+'</a>').click(function(){
            callback();
            return false;
        });
        return $("<li></li>").append(_el);
    }
    function _numbers(){
        var _html = '';
        for(var _x = 1; _x <= engine.length(); _x++)
            _html += '<li class="jbg-n"><a href="#">'+_x+'</a></li>';
        return _html;
    }
    function _delegation(ev){
        var _el = ev.target || ev.srcElement;
        if(_el.tagName.toString().toLowerCase() === 'a'){
            var _num = parseInt($(_el).text());
            engine.go(_num);
        }
        return false;
    }
	function play(){
		engine.play();
		_h_play.hide();
		_h_stop.show();
	}
	function stop(){
		engine.stop();
		_h_play.show();
        _h_stop.hide();
	}
	function _render(){
		if(!_init && engine.length() > 0){
			
			$('<div class="jbg-menu-opacity" /><ul class="jbg-menu" />').hide().appendTo(el);
		    _menu = $('.jbg-menu', el);
            _containers = $('.jbg-menu-opacity , .jbg-menu', el);
                
		    //NUMBERS
		    if(options.menu == 'numbers'){
		        _menu
                .append(_numbers())
		        .click(_delegation)
		        .find("a:eq(" + (engine.current() -1 )+ ")").addClass("selected").addClass("visited");
		    }
		    
		    _menu
		    .append(_button('jbg-next', options.labels.next, engine.right))
		    .prepend(_button('jbg-prev', options.labels.prev, engine.left));
		    //.appendTo(el);
		    
			
		    //SIMPLE
            //if(options.menu == 'simple'){
            _menu
            .append(_h_play)
            .append(_h_stop);
            //}
            
			if (options.caption) {
		        _menu
		        .append(_button('jbg-info', options.labels.info, function(){
		            caption.toggle();
		            return false;
		        }));
		    }
		    
		    if(options.popup){
		        _menu
		        .append(_button('jbg-close', options.labels.close, function(){
		            $(that).trigger("destroy");
		            options.close();
		            return false;//15/12/2010
		        }));
		    }
		    
		    if(options.menu == 'numbers')
		        engine.target.bind("load", _update_classes);
		    
		    if(options.autohide)
		        jBGallery.AutoToggle($(_containers), options);
		
		    $(_containers).fadeIn(options.timers.fade);
		    
			_init = true;
		}
	}
    //
	function _empty(){
		if (options.menu == 'numbers') 
            $('.jbg-n', _menu).remove();
        $(_containers).fadeOut(options.timers.fade);
        _length = engine.length();
    }
	function _add_number(html){
		$('.jbg-next', _menu).parent().before(html);
	}
    function _add(o){
        if(!_init)
            _render();
          
        if ($.isArray(o)) {
			var _h = '';
			var _s = engine.length() - o.length;
            $.each(o, function(i, v){
                _h += '<li class="jbg-n"><a href="#">'+ (_s + i + 1) +'</a></li>';
            });
			_add_number(_h)
        }else{
            _add_number('<li class="jbg-n"><a href="#">'+ engine.length() +'</a></li>')
        }
        
		_update_classes();
		
        _length = engine.length();
    }
    function _remove(selector){
		$('li.jbg-n:last', _menu).remove();
    }
	_render();
	
	return {
		notify : function(m,o){
			if(data.length() > 0 && !$(_containers).eq(0).is(":visible")){
                $(_containers).fadeIn(options.timers.fade);
            }
			if (options.menu == 'numbers') {
				switch (m) {
					case 'push':
					case 'unshift':
						_add(o);
					   break;
                    case 'pop':
					case 'shift':
						_remove();
						break;
						
				}
			}
			if (m == 'empty'){
				_empty();
			}
		}
	}
};


jBGallery.MenuSlider = function(el, data, engine, caption, options){
    
    var that = el;
    var _cnt = el;//options.fullscreen ? 'body' : el;//jbox
    
	//TEMP: bug. el width simetimes in chrome = 0
	if(options.fullscreen) 
        var _bw = $('body').width() - 130;
	else
	    var _bw = $(_cnt).width() - 130;
    
    var _w = (_bw) - (_bw % 60);
	var _sep = '<span>&nbsp;|&nbsp;</span>';
    var _popup = '<a href="#" class="jbgs-h-close">'+options.labels.close+'</a>';//TEST
    var _info = '<a href="#" class="jbgs-h-info">'+options.labels.info+'</a>';
    var _tpl_top = '<div class="jbgs-top"><div class="jbgs-top-center"><a href="#" class="jbgs-h jbgs-h-prev">&nbsp;</a><a href="#" class="jbgs-h jbgs-h-next">&nbsp;</a></div><div class="jbgs-top-right"></div></div>';//<div id="jbgs-top-opacity"></div>
    var _tpl_slider = '<div class="jbgs-opacity"></div><div class="jbgs"><div class="jbgs-wrapper"><div class="jbgs-left"><a href="#" class="jbgs-h-play jbgs-h">&nbsp;</a><a href="#" class="jbgs-h-pause jbgs-h">&nbsp;</a><a href="#" class="jbgs-h-left jbgs-h">&nbsp;</a></div><div class="jbgs-viewer" style="width:'+_w+'px"></div><div class="jbgs-right"><a href="#" class="jbgs-h-right jbgs-h">&nbsp;</a></div></div></div>';
    var _top, _menu,_menutop,_viewer,_an,_play,_pause,_a,_autohide;
    var _init = false;
    var _length = engine.length();
    //PRIVATE METHODS
    
    function _click_and_lock(el , func){
        $(el).click(function(){
            var _el = this;
            if($(_el).is(".lock"))
                return;
            $(_el).addClass("lock");
            func(function(){
                $(_el).removeClass("lock")
            });
            return false;//15/12/2010
        });
    }
    function _get_optimal_position(nr){
        nr = nr - 1;
        nr = _get_first_of_last(nr);
        var _left = -(nr * 60) <= 0 ? -(nr * 60) : 0;
        
        return _left;
    }
    function _get_first_of_last(nr){
        var _tot = engine.length;
        var _v = _get_visible();
        return _tot - _v < nr ? _tot - _v : nr;         
    }
    function _focus(nr){
        $('a',_an)
        .find(".focus").removeClass("focus").css("opacity",'0.7').end()
        .eq((nr - 1)).find("img").addClass("focus").css("opacity",'1')
        .parent().addClass("focus").css("opacity",'1');
    }
    function _get_class_thumb(t){
        return t.height >= t.width ? "jbgs-thumb-portrait" : "jbgs-thumb-landscape";
    }
    function _get_optimal_left(t){
        if(t.height >= t.width){
            return 25;
        }else{
            var _v = t.width*100/t.height;
            return (_v - 60)/2;
        }
    }
    function _left(left, callback){
        _an.animate({"left" : left}, function(){
            if(callback) callback();
        });
    }
    function _move_left(callback){
        var _l = _get_left();
        var _v = _get_visible();
        //_l = (_l + 60) > 0 ?  0 : (_l + 60);
        _l = (_l + (60 * _v)) > 0 ?  0 : (_l + (60 * _v));
        _left(_l, callback);
    }
    function _move_right(callback){
        var _l = _get_left();
        var _tot = engine.length();
        var _back = _get_back(_l);
        var _v = _get_visible();
        var _max = (_tot - _v) * 60;
		if(_tot < _v || _v + _back >= _tot)
            return callback();//unlock!
        _l = ((_back + _v) + _v) > _tot ?  -(_max) : (_l - (60 *_v));//todo
        _left(_l, callback);
    }
    function _is_visible(nr){
        var _l = _get_left();
        var _back = _get_back(_l);
        var _v = _get_visible();
        
        var _first = _get_first_visible(_back, _v);
        var _last = _get_last_visible(_back, _v);

        return (nr >= _first && nr <= _last);
    }
    function _get_last_visible(back, v){
        return back + v;
    }
    function _get_first_visible(back, v){
        return back + 1;
    }
    function _get_left(){
        return parseInt(_an.css("left"),10);
    }
    function _get_visible(){
        var _bw = $(_cnt).width() - 130;
        var _w = (_bw) - (_bw % 60);
        return _w / 60;
    }
    function _get_back(left){
        return Math.abs(left)/ 60;// - 60 (right)
    }
    function _mouseout(ev){
        $('a',_an).css("margin-top", "");
        $('.jbgs-thumb').fadeOut(options.timers.fade, function(){
            $(this).remove();
        });
    }
    function _delegation(ev){
        var _el = ev.target || ev.srcElement;
        if(_el.tagName.toString().toLowerCase() === 'img'){
            $(_el).parent().parent().css("margin-top", "3px");//21/06 + .parent()
            var _index = $(_a).index($(_el).parent().parent());//21/06 + .parent()
            var _thumb = $(_el).get(0);
            var _img = new Image();
            _img.src = _thumb.src;
                
            var _id = 'jbgs-thumb-'+_index;
            var _l = $(_thumb).parents("li:eq(0)").offset().left - $(el).offset().left;//19/12/2010
            var _class = _get_class_thumb(_img);
            var _m = _l - _get_optimal_left(_img);
            if($("#"+_id).length == 0){
                var _btn = options.ie6 || options.ie7 ? '' : '<div class="jbgs-thumb-btn"><div class="jbgs-thumb-tip" /></div>';
                var _html = '<div style="left:'+_m+'px" class="jbgs-thumb" id="'+_id+'"><img src="'+_thumb.src+'" alt="" class="'+_class+'" />'+_btn+'</div>';
                $(_html).hide().appendTo(_cnt).fadeIn(options.timers.fade);    
            }
        }
    }
    function _resize(){
        var _bw = $(_cnt).width() - 130;
        var _w = (_bw) - (_bw % 60);
        _viewer.width(_w);
    }
    //RC2 - 21/06/2010 - TODO config width/height
    function _get_thumb_position(t){
        return t.height >= t.width ? {top : -((t.height*51/t.width)-51)/2} : {left : -((t.width*51/t.height)-51)/2 }; 
    }
    function _set_thumb_class(t){
        $(t).addClass(_get_class_thumb(t)).css(_get_thumb_position(t));
    }
    function _thumb_oncomplete(img){
        $(img).wrap('<div />');
        if (img.complete) {
            _set_thumb_class(img);
        }else{
            $(img).one("load", function(){
                _set_thumb_class(img); 
            });
        }
    }
	function _add_thumb(o, jmethod){
		var _t = $('<li><a title="' + o.title + '" href="' + o.href + '"><img src="' + o.thumb + '" alt="" /></a></li>')
        [jmethod](_menu);
        var _img = $('img', _t).css("opacity",0.7).get(0);
		_thumb_oncomplete(_img);
	}
    //3.0
	function _empty(){
		_an.empty();
		_autohide.hide(options.timers.fade);
		_length = engine.length();
	}
    function _add(o, jmethod, fromrender){
		if(!fromrender && !_init)
		    _render();
		  
		if ($.isArray(o)) {
			$.each(o, function(i, v){
				_add_thumb(v, jmethod)
			});
		}else{
			_add_thumb(o, jmethod)
		}
		//_autohide.hide();
		if(_length == 0 && !fromrender){
			_autohide.fadeIn(options.timers.fade);
		}
		_length = engine.length();
    }
    function _remove(selector){
		$('li'+selector, _menu).remove();
	}
    function _render(){
        if(!_init && engine.length() > 0){
            
			
            $(_cnt)
            .append(_tpl_top + _tpl_slider).addClass("jbgs-cnt");
            
            
            _menutop = $('.jbgs-top-right', el);
            _viewer = $('.jbgs-viewer', el);
            _menu = $('<div class="jbgs-inner"></div>').appendTo(_viewer);//???
			
            _an = $('.jbgs-inner', el);
            _play = $('.jbgs-h-play', el);
            _pause = $('.jbgs-h-pause', el);
            _a = $('a',_an);
            _autohide = $('.jbgs-opacity, .jbgs, .jbgs-top' ,el);
            
			_add(data.items(),'appendTo',true);
            
            $('.jbgs-opacity, .jbgs-h').css("opacity",0.8);
            
            if(engine.slideshow())
                _play.hide();
            else    
                _pause.hide();
                
            //events
            if (options.caption) {
                $(_info)
                .click(function(){
                    caption.toggle();
                    return false;
                })
                .appendTo(_menutop);
            }
            if (options.popup) {
                if($('a',_menutop).length > 0){
                    $(_sep).appendTo(_menutop);
                }
                $(_popup)
                .click(function(){
                    $(that).trigger("destroy");
                    options.close();
                    return false;//15/12/2010
                })
                .appendTo(_menutop);
            }
            _click_and_lock('.jbgs-h-left', _move_left);
            _click_and_lock('.jbgs-h-right', _move_right);
        
            _play.click(function(){
                $(this).hide();
                _pause.show();
                engine.play();
				return false;//20/12/2010
            });    
            _pause.click(function(){
                $(this).hide();
                _play.show();
                engine.stop();
                return false;//20/12/2010
            });
            $('.jbgs-h-prev',el).click(function(){
                engine.left();
                return false;//20/12/2010				
            });
            $('.jbgs-h-next',el).click(function(){
                engine.right();
                return false;//20/12/2010				
            });
            
            
            //$(_an).click(function(ev){
			//	var _el = ev.target || ev.srcElement;
			//	if (_el.tagName.toString().toLowerCase() === 'img') {
			$('a', _an).live("click", function(){
				var _i = $('a', _an).index(this) + 1;
				engine.go(_i);
				return false;
            });
        
            jBGallery.EventTimer(_an, ['mouseover'], options.delays.mouseover, _delegation, 'mouseout');//, true
            _an.bind("mouseout", _mouseout);//commenta per testare tooltip
                    
            engine.target.bind("load", function(){
                var _current = engine.current();
                if(!_is_visible(_current)){
                    var _position = _get_optimal_position(_current);
                    _left(_position);
                }
                _focus(_current);
            });
            
            jBGallery.EventTimer(window, ['resize.jbgallery'], options.delays.resize, _resize);
            
            if(options.autohide){
                jBGallery.AutoToggle(_autohide, options);
                jBGallery.AutoToggle(".jbgs-thumb", options, ["fadeIn","fadeOut"]);
            }
            
            _init = true;
        }
    }
    //MAIN
    _render();
    
    return {
        notify : function(m,o){
			switch(m){
				case 'empty':
				    _empty();
				break;
				case 'push':
				    _add(o,'appendTo');
                break;
                case 'unshift':
				    _add(o, 'prependTo');
                break;
                case 'shift':
                    _remove(':first');
                break;
                case 'pop':
                    _remove(':last');
                break;
                
			}
        }
    }
};

jBGallery.Adapters = {};

$.fn.jbgallery = jBGallery.Init;

})(jQuery);
