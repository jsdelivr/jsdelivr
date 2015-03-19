/**
* Image Preloader 1.1 // 2011.01.31
* <http://idered.pl/news/jquery/preloader/>
* 
* @author    Idered <IderedPL@gmail.com>
*/
$.fn.preloader = function(options) {
	var defaults = {
		onDone : function() {
		},
		onEachLoad : function(img) {
		},
		onLoadError : function(img) {
		},
		fadeIn : 500,
		delay : 100,
		interval : 200,
		parentWrap : 'a',
		loader : 'img/loader.gif'
	},
	options = $.extend(defaults, options),
	images = $(this).find('img'),
	loaderCss = {
		background : 'url(' + options.loader + ') 50% 50% no-repeat',
		display : 'inline-block'
	},
	delayTime = 0
	loadError = false;
	
	images.css({
			visibility : 'visible',
			opacity : 0
		}).each(function() {
			if($(this).parent(options.parentWrap).length) 
				$(this).parent(options.parentWrap).css(loaderCss);
			else 
				$(this).wrap('<a class="unwrap"/>').parent().css(loaderCss);
		});
	
	var timer = setInterval(function() {
			init();
		}, options.interval);
	
	init = function() {
		images = images.filter(function() {
		
				this.onerror = function() {
					loadError = true;
				};				
				
				if(loadError == 1) {
				
					$(this).css({ visibility : 'visible',	opacity : 1 });
					
					if($(this).parent().hasClass('unwrap')) 
						$(this).unwrap();
					else 
						$(this).parent().attr('style', '');
						
					options.onLoadError($(this));
					
					return null;					
				} else if(this.complete && this.naturalWidth !== 0) {				
				
					delayTime = delayTime + options.delay;
					$(this).css({ visibility : 'visible' })
						.delay(delayTime).animate({ opacity : 1 }, options.fadeIn, function() {
						
							if($(this).parent().hasClass('unwrap')) 
								$(this).unwrap();
							else 
								$(this).parent().attr('style', '');
								
							options.onEachLoad($(this));
						});
				} else
					return this;
			}
		);
		
		if(images.length == 0) {
			clearInterval(timer);
			options.onDone();
		}		
	};
}
 