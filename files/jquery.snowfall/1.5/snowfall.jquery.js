/*  Snowfall jquery plugin
	Version 1.5 Oct 5th 2011
	Added collecting snow! Uses the canvas element to collect snow. In order to initialize snow collection use the following
	
	$(document).snowfall({collection : 'element'});

    element = any valid jquery selector.

	The plugin then creates a canvas above every element that matches the selector, and collects the snow. If there are a varrying amount of elements the 
	flakes get assigned a random one on start they will collide.

	Version 1.4 Dec 8th 2010
	Fixed issues (I hope) with scroll bars flickering due to snow going over the edge of the screen. 
	Added round snowflakes via css, will not work for any version of IE. - Thanks to Luke Barker of http://www.infinite-eye.com/
	Added shadows as an option via css again will not work with IE. The idea behind shadows, is to show flakes on lighter colored web sites - Thanks Yutt
 
	Version 1.3.1 Nov 25th 2010
	Updated script that caused flakes not to show at all if plugin was initialized with no options, also added the fixes that Han Bongers suggested 
	
	Developed by Jason Brown for any bugs or questions email me at loktar69@hotmail
	info on the plugin is located on Somethinghitme.com
	
	values for snow options are
	
	flakeCount,
	flakeColor,
	flakeIndex,
	minSize,
	maxSize,
	minSpeed,
	maxSpeed,
	round, 		true or false, makes the snowflakes rounded if the browser supports it.
	shadow		true or false, gives the snowflakes a shadow if the browser supports it.
	
	Example Usage :
	$(document).snowfall({flakeCount : 100, maxSpeed : 10});
	
	-or-
	
	$('#element').snowfall({flakeCount : 800, maxSpeed : 5, maxSize : 5});
	
	-or with defaults-
	
	$(document).snowfall();
	
	- To clear -
	$('#element').snowfall('clear');
*/

(function($){
	$.snowfall = function(element, options){
		var	defaults = {
				flakeCount : 35,
				flakeColor : '#ffffff',
				flakeIndex: 999999,
				minSize : 1,
				maxSize : 2,
				minSpeed : 1,
				maxSpeed : 5,
				round : false,
				shadow : false,
				collection : false,
				collectionHeight : 40
			},
			options = $.extend(defaults, options),
			random = function random(min, max){
				return Math.round(min + Math.random()*(max-min)); 
			};
			
			$(element).data("snowfall", this);			
			
			// Snow flake object
			function Flake(_x, _y, _size, _speed, _id)
			{
				// Flake properties
				this.id = _id; 
				this.x  = _x;
				this.y  = _y;
				this.size = _size;
				this.speed = _speed;
				this.step = 0;
				this.stepSize = random(1,10) / 100;
				
				if(options.collection){
					this.target = canvasCollection[random(0,canvasCollection.length-1)];
				}
				
				var flakeMarkup = $(document.createElement("div")).attr({'class': 'snowfall-flakes', 'id' : 'flake-' + this.id}).css({'width' : this.size, 'height' : this.size, 'background' : options.flakeColor, 'position' : 'absolute', 'top' : this.y, 'left' : this.x, 'fontSize' : 0, 'zIndex' : options.flakeIndex});
				
				if($(element).get(0).tagName === $(document).get(0).tagName){
					$('body').append(flakeMarkup);
					element = $('body');
				}else{
					$(element).append(flakeMarkup);
				}
				
				this.element = document.getElementById('flake-' + this.id);
				
				// Update function, used to update the snow flakes, and checks current snowflake against bounds
				this.update = function(){
					this.y += this.speed;
					
					if(this.y > (elHeight) - (this.size  + 6)){
						this.reset();
					}
					
					this.element.style.top = this.y + 'px';
					this.element.style.left = this.x + 'px';
					
					this.step += this.stepSize;
					this.x += Math.cos(this.step);
					
					// Pileup check
					if(options.collection){
						if(this.x > this.target.x && this.x < this.target.width + this.target.x && this.y > this.target.y && this.y < this.target.height + this.target.y){
							var ctx = this.target.element.getContext("2d"),
								curX = this.x - this.target.x,
								curY = this.y - this.target.y,
								colData = this.target.colData;
								
								if(colData[parseInt(curX)][parseInt(curY+this.speed+this.size)] !== undefined || curY+this.speed+this.size > this.target.height){
									if(curY+this.speed+this.size > this.target.height){
										while(curY+this.speed+this.size > this.target.height && this.speed > 0){
											this.speed *= .5;
										}

										ctx.fillStyle = "#fff";
										
										if(colData[parseInt(curX)][parseInt(curY+this.speed+this.size)] == undefined){
											colData[parseInt(curX)][parseInt(curY+this.speed+this.size)] = 1;
											ctx.fillRect(curX, (curY)+this.speed+this.size, this.size, this.size);
										}else{
											colData[parseInt(curX)][parseInt(curY+this.speed)] = 1;
											ctx.fillRect(curX, curY+this.speed, this.size, this.size);
										}
										this.reset();
									}else{
										// flow to the sides
										this.speed = 1;
										this.stepSize = 0;
									
										if(parseInt(curX)+1 < this.target.width && colData[parseInt(curX)+1][parseInt(curY)+1] == undefined ){
											// go left
											this.x++;
										}else if(parseInt(curX)-1 > 0 && colData[parseInt(curX)-1][parseInt(curY)+1] == undefined ){
											// go right
											this.x--;
										}else{
											//stop
											ctx.fillStyle = "#fff";
											ctx.fillRect(curX, curY, this.size, this.size);
											colData[parseInt(curX)][parseInt(curY)] = 1;
											this.reset();
										}
									}
								}
						}
					}
					
					if(this.x > (elWidth) - widthOffset || this.x < widthOffset){
						this.reset();
					}
				}
				
				// Resets the snowflake once it reaches one of the bounds set
				this.reset = function(){
					this.y = 0;
					this.x = random(widthOffset, elWidth - widthOffset);
					this.stepSize = random(1,10) / 100;
					this.size = random((options.minSize * 100), (options.maxSize * 100)) / 100;
					this.speed = random(options.minSpeed, options.maxSpeed);
				}
			}
		
			// Private vars
			var flakes = [],
				flakeId = 0,
				i = 0,
				elHeight = $(element).height(),
				elWidth = $(element).width(),
				widthOffset = 0,
				snowTimeout = 0;
		
			// Collection Piece ******************************
			if(options.collection !== false){
				var testElem = document.createElement('canvas');
				if(!!(testElem.getContext && testElem.getContext('2d'))){
					var canvasCollection = [],
						elements = $(options.collection),
						collectionHeight = options.collectionHeight;
					
					for(var i =0; i < elements.length; i++){
							var bounds = elements[i].getBoundingClientRect(),
								canvas = document.createElement('canvas'),
								collisionData = [];

							if(bounds.top-collectionHeight > 0){									
								document.body.appendChild(canvas);
								canvas.style.position = 'absolute';
								canvas.height = collectionHeight;
								canvas.width = bounds.width;
								canvas.style.left = bounds.left;
								canvas.style.top = bounds.top-collectionHeight;
								
								for(var w = 0; w < bounds.width/options.minSize; w+=options.minSize){
									collisionData[w] = [];
								}
								
								canvasCollection.push({element :canvas, x : bounds.left, y : bounds.top-collectionHeight, width : bounds.width, height: collectionHeight, colData : collisionData});
							}
					}
				}else{
					// Canvas element isnt supported
					options.collection = false;
				}
			}
			// ************************************************
			
			// This will reduce the horizontal scroll bar from displaying, when the effect is applied to the whole page
			if($(element).get(0).tagName === $(document).get(0).tagName){
				widthOffset = 25;
			}
			
			// Bind the window resize event so we can get the innerHeight again
			$(window).bind("resize", function(){  
				elHeight = $(element).height();
				elWidth = $(element).width();
			}); 
			

			// initialize the flakes
			for(i = 0; i < options.flakeCount; i+=1){
				flakeId = flakes.length;
				flakes.push(new Flake(random(widthOffset,elWidth - widthOffset), random(0, elHeight), random((options.minSize * 100), (options.maxSize * 100)) / 100, random(options.minSpeed, options.maxSpeed), flakeId));
			}

			// This adds the style to make the snowflakes round via border radius property 
			if(options.round){
				$('.snowfall-flakes').css({'-moz-border-radius' : options.maxSize, '-webkit-border-radius' : options.maxSize, 'border-radius' : options.maxSize});
			}
			
			// This adds shadows just below the snowflake so they pop a bit on lighter colored web pages
			if(options.shadow){
				$('.snowfall-flakes').css({'-moz-box-shadow' : '1px 1px 1px #555', '-webkit-box-shadow' : '1px 1px 1px #555', 'box-shadow' : '1px 1px 1px #555'});
			}
		
			// this controls flow of the updating snow
			function snow(){
				for( i = 0; i < flakes.length; i += 1){
					flakes[i].update();
				}
				
				snowTimeout = setTimeout(function(){snow()}, 30);
			}
			
			snow();
		
		// Public Methods
		
		// clears the snowflakes
		this.clear = function(){
						$(element).children('.snowfall-flakes').remove();
						flakes = [];
						clearTimeout(snowTimeout);
					};
	};
	
	// Initialize the options and the plugin
	$.fn.snowfall = function(options){
		if(typeof(options) == "object" || options == undefined){		
				 return this.each(function(i){
					(new $.snowfall(this, options)); 
				});	
		}else if (typeof(options) == "string") {
			return this.each(function(i){
				var snow = $(this).data('snowfall');
				if(snow){
					snow.clear();
				}
			});
		}
	};
})(jQuery);