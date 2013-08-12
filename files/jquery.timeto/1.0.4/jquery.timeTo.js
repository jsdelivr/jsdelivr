/**
 * TimeTo jQuery plug-in
 * Show countdown timer or realtime clock
 *
 * @author Alexey Teterin <altmoc@gmail.com>
 * @version 1.0.3
 * @license MIT http://opensource.org/licenses/MIT
 * @date 2013-05-07
 */

(function($){
	var methods = {
        start: function(sec){
			if(sec) init.call(this, sec);
			var me = this,
			    intervalId = setTimeout(function(){ tick.call(me); }, 1000);

            // save start time
			this.data('ttStartTime', (new Date()).getTime());
			this.data('intervalId', intervalId);
		},

		stop: function(){
			var data = this.data();

			if(data.intervalId){
				clearTimeout(data.intervalId);
				this.data('intervalId', null);
			}
			return data;
		},
		
        reset: function(sec){
			var data = methods.stop.call(this);

			this.find('div').css({ backgroundPosition: 'left center' });

			if(typeof sec === "undefined") sec = data.value;
			init.call(this, sec);
		}

	};
	
	var dictionary = {
		en:{days:"days", hours:"hours", min:"minutes", sec:"seconds"},
		ru:{days:"дней", hours:"часов", min:"минут", sec:"секунд"},
		ua:{days:"днiв", hours:"годин", min:"хвилин", sec:"секунд"},
		de:{days:"Tag", hours:"Uhr", min:"Minuten", sec:"Secunden"},
		fr:{days:"jours", hours:"heures", min:"minutes", sec:"secondes"},
		sp:{days:"días", hours:"reloj", min:"minutos", sec:"segundos"},
		it:{days:"giorni", hours:"ore", min:"minuti", sec:"secondi"}
	};
	
	if(typeof $.support.transition === 'undefined'){
		$.support.transition = (function(){
			var thisBody = document.body || document.documentElement,
				thisStyle = thisBody.style,
				support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;

			return support;
		})();
	}
	
	$.fn.timeTo = function(){
		var defaults = {
                callback: null,          // callback function for exec when timer out
                captionSize: 0,          // font-size by pixels for captions, if 0 then calculate automaticaly
                countdown: true,         // is countdown or real clock
                countdownAlertLimit: 10, // limit in seconds when display red background
                displayCaptions: false,  // display captions under digit groups
                displayDays: false,      // display day timer
                fontFamily: "Verdana, sans-serif",
                fontSize: 28,            // font-size of a digit by pixels
                lang: 'en',              // language of caption
                seconds: 0,              // timer's countdown value in seconds
                start: true,             // true to start timer immediately
                theme: "white",          // 'white' or 'black' theme fo timer's view
                
                vals: [0, 0, 0, 0, 0, 0, 0, 0, 0],	// private, current value of each digit
                limits: [9, 9, 9, 2, 9, 5, 9, 5, 9],// private, max value of each digit
                iSec: 8,		    // private, index of second digit
                iHour: 4,		    // private, index of hour digit
                tickTimeout: 1000,  // timeout betweet each timer tick in miliseconds
                intervalId:null	    // private
            },
            method, options = {};

		for(var i = 0, arg; arg = arguments[i]; ++i){
			if(i == 0 && typeof arg === "string"){
				method = arg;
			}else{
				if(typeof arg == "object"){
                    if(typeof arg.getTime === 'function'){
                        options.timeTo = arg;
                    }else {
					    options = $.extend(options, arg);
                    }
				}else{
					if(typeof arg == "function"){
						options.callback = arg;
					}else{
						var v = parseInt(arg);
						if(!isNaN(v)){
							options.seconds = v;
						}
					}
				}
			}
		}
        // set time for countdown to
		if(options.timeTo){
			var time,
				now = (new Date()).getTime();

			if(options.timeTo.getTime){ // set time as date object
				time = options.timeTo.getTime();
			}else if(typeof options.timeTo === 'number'){  // set time as integer in milisec
				time = options.timeTo;
			}
            if(options.timeTo > now){
                options.seconds = Math.floor((time - now) / 1000);
            }
		}else if(options.time || !options.seconds){
            var time = options.time;

            if(!time) time = new Date();

            if(typeof time === 'object' && time.getTime){
                options.seconds = time.getHours()*3600 + time.getMinutes()*60 + time.getSeconds();
                options.countdown = false;
            }else if(typeof time === 'string'){
                var tt = time.split(':'),
                    sec = 0, m = 1, t;

                while(t = tt.pop()){
                    sec += t*m;
                    m *= 60;
                }
                options.seconds = sec;
                options.countdown = false;
            }
        }
        if(options.countdown !== false && options.seconds > 86400) options.displayDays = true;

		
		return this.each(function(){
			var $this = $(this),
                data = $this.data();

			if(!data.vals){ // new clock
				data = $.extend(defaults, options);
                data.height = Math.round(data.fontSize*100/93);
                data.width = Math.round(data.fontSize*.8 + data.height*.13);
				$this
                    .addClass('timeTo')
                    .addClass('timeTo-'+ data.theme)
                    .css({
                        fontFamily: data.fontFamily,
                        fontSize: data.fontSize +'px'
                    });

				var left = Math.round(data.height / 10),
                    ulhtml = '<ul style="left:'+ left +'px; top:-'+ data.height +'px"><li>0</li><li>0</li></ul></div>',
                    style = ' style="width:'+ data.width +'px; height:'+ data.height +'px;"',
                    dhtml1 = '<div class="first"'+ style +'>'+ ulhtml,
                    dhtml2 = '<div'+ style +'>'+ ulhtml,
                    dot2 = '<span>:</span>',
                    maxWidth = Math.round(data.width*2 + 3),
                    captionSize = data.captionSize || Math.round(data.fontSize*.43);
                    thtml = (data.displayCaptions ?
						'<figure style="max-width:'+ maxWidth +'px">$1<figcaption style="font-size:'+ captionSize +'px">'+ dictionary[data.lang].hours +'</figcaption></figure>'+ dot2 +
						'<figure style="max-width:'+ maxWidth +'px">$1<figcaption style="font-size:'+ captionSize +'px">'+ dictionary[data.lang].min +'</figcaption></figure>'+ dot2 +
						'<figure style="max-width:'+ maxWidth +'px">$1<figcaption style="font-size:'+ captionSize +'px">'+ dictionary[data.lang].sec +'</figcaption></figure>'
						: '$1'+ dot2 +'$1'+ dot2 +'$1'
					).replace(/\$1/g, dhtml1 + dhtml2);

				if(data.displayDays){
                    var marginRight = data.fontSize*.4;
					thtml = (data.displayCaptions ?
						'<figure style="width:'+ Math.round(data.width*3 + marginRight) +'px">$1<figcaption style="font-size:'+ captionSize +'px; padding-right:'+ Math.round(marginRight) +'px">'+ dictionary[data.lang].days +'</figcaption></figure>'
						: '$1').replace(
							/\$1/, dhtml1 + dhtml2 + (data.displayCaptions ? dhtml2 : dhtml2.replace('">', ' margin-right:'+ Math.round(marginRight) +'px">'))
						) + thtml;
				}
				$this.html(thtml);
			}else{ // exists clock
                if(data.intervalId){
                    clearInterval(data.intervalId);
                    data.intervalId = null;
                }
				$.extend(data, options);
			}
			
			var $digits = $this.find('div');

			if($digits.length < data.vals.length){
				var dif = data.vals.length - $digits.length,
                    vals = data.vals, limits = data.limits;

				data.vals = [];
				data.limits = [];
				for(var i = 0; i < $digits.length; i++){
					data.vals[i] = vals[dif + i];
					data.limits[i] = limits[dif + i];
				}
				data.iSec = data.vals.length - 1;
				data.iHour = data.vals.length - 5;
			}
            data.sec = data.seconds;
			$this.data(data);
			
			if(method && methods[method]){
				methods[ method ].call($this, data.seconds);
			}else if(data.start){
				methods.start.call($this, data.seconds);
			}else {
				methods.init.call($this, data.seconds);
			}
		});
	};

    function init(sec){
        var data = this.data(),
            $digits = this.find('ul');

        if (!data.vals || $digits.length == 0) return;

        if(!sec) sec = data.seconds;

        var isInterval = false;
        if (data.intervalId) {
            isInterval = true;
            clearTimeout(data.intervalId);
        }

        var days = Math.floor(sec / 86400),
            rest = days * 86400,
            h = Math.floor((sec - rest) / 3600);

        rest += h * 3600;

        var m = Math.floor((sec - rest) / 60);
        
        rest += m * 60;
        
        var s = sec - rest,
            str = (days < 100 ? '0' + (days < 10 ? '0' : '') : '') + days + (h < 10 ? '0' : '') + h + (m < 10 ? '0' : '') + m + (s < 10 ? '0' : '') + s;

        for (var i = data.vals.length - 1, j = str.length - 1, v; i >= 0; i--, j--) {
            v = parseInt(str.substr(j, 1));
            data.vals[i] = v;
            $digits.eq(i).children().html(v);
        }
        if (isInterval) {
            var me = this;
            data.ttStartTime = Date.now();
            data.intervalId = setTimeout(function(){ tick.call(me); }, 1000);
            this.data('intervalId', data.intervalId);
        }
    }
		
    /**
     * Switch specified digit by digit index
     * @param digit integer - digit index
     */
    function tick(digit) {
        var $digits = this.find('ul'),
            data = this.data();

        if (!data.vals || $digits.length == 0){
            if(data.intervalId){
                clearTimeout(data.intervalId);
                this.data('intervalId', null);
            }
            if(data.callback) data.callback();

            return;
        }
        if (digit == undefined) {
            digit = data.iSec;
        }

        var n = data.vals[digit],
            $ul = $digits.eq(digit),
            $li = $ul.children(),
            step = data.countdown ? -1 : 1;

        $li.eq(1).html(n);
        n += step;

        if(digit == data.iSec){
            var tickTimeout = data.tickTimeout,
                timeDiff = (new Date()).getTime() - data.ttStartTime;

            data.sec += step;

            tickTimeout += Math.abs(data.seconds - data.sec) * tickTimeout - timeDiff;

            data.intervalId = setTimeout(function(){ tick.call(me); }, tickTimeout);
        }
        
        if(n < 0 || n > data.limits[digit]) {
            if(n < 0) n = data.limits[digit];
            else n = 0;
            if(digit > 0){
                tick.call(this, digit-1);
            }
        }
        //$ul.removeClass('transition');
        //$ul.css({top:"-" + data.height + "px"});
        $li.eq(0).html(n);
        
        var me = this;
		
		if($.support.transition){
			$ul.addClass('transition');
			$ul.css({top:0});

			setTimeout(function(){
				$ul.removeClass('transition');
				$li.eq(1).html(n);
				$ul.css({top:"-"+ data.height +"px"});

				if(step > 0 || digit != data.iSec) return;

				if(data.sec == data.countdownAlertLimit){
					$digits.parent().addClass('timeTo-alert');
				}
				if(data.sec === 0){
					$digits.parent().removeClass('timeTo-alert');

					if(data.intervalId){
						clearTimeout(data.intervalId);
						me.data('intervalId', null);
					}

					if(typeof data.callback === 'function') data.callback();
				}
			}, 410);
		}else{
			$ul.stop().animate({top:0}, 400, digit != data.iSec ? null : function(){
				$li.eq(1).html(n);
				$ul.css({top:"-"+ data.height +"px"});
				if(step > 0 || digit != data.iSec) return;

				if(data.sec == data.countdownAlertLimit){
					$digits.parent().addClass('timeTo-alert');
				}else if(data.sec == 0){
					$digits.parent().removeClass('timeTo-alert');

					if(data.intervalId){
						clearTimeout(data.intervalId);
						me.data('intervalId', null);
					}

					if(typeof data.callback === 'function') data.callback();
				}
			});
		}
        data.vals[digit] = n;
        //this.data('vals', data.vals);
    }
})(jQuery);
