(function($){
	SlideDeckLens['reporter'] = function(slidedeck){
	    var self = this;
		var slidedeck = $(slidedeck);
		var slidedeckFrame = slidedeck.closest('.slidedeck-frame');
		var images = slidedeckFrame.find('img.slide-image');
		var deck = slidedeck.slidedeck();
		var deckElement = slidedeck;
		var navDeckElement = false;
		var navDeck = false;
		var mouseIsHoveringOverNav = false;
	    
	    // Get the accent color
	    var accentColor = slidedeckFrame.find('.accent-color').css('color');
		
		// For the button nav
		var maxButtonsPerPage = 0;
		var numberOfPages = 1;
		
		// After loaded callback
        deck.loaded(function( thedeck ){
            /**
             * Hide the slide content when a video play button is clicked.
             */
            deckElement.find('.cover .play').click(function(event){
                $(this).parents('dd').addClass('show-video-wrapper');
                $(this).parents('dd').addClass('hide-slide-content');
            });
            
	        /**
	         * For this lens, the structure necessary deviates a bit too much.
	         * When the viewer clicks the "Play Video" link, we'll trigger a click
	         * on the generic play button in the template. 
	         */
	        $('.slide-type-video .play-video, .slide-type-video .play-video-alternative').bind( "click", function( event ){
	            event.preventDefault();
	            var parentSlide = $(this).parents('dd');
	            var playButton = parentSlide.find('.video-wrapper .cover .play-video-button');
	            playButton.trigger('click');
	        } );
            
            // Move the dot nav
            if(!slidedeckFrame.hasClass('content-source-custom')){
                if(slidedeckFrame.find('dd.slide').eq(deck.current-1).hasClass('no-image')){
    				slidedeckFrame.find('.dot-nav').css('margin-left', -(slidedeckFrame.find('.dot-nav').outerWidth() / 2)).addClass('no-image');
        		}
            }
        });
        
        /**
         * Loops through all the images and tries to correct them 
         * for out of bounds width or height.
         */
		this.widthOrHeight = function(){
			images.one('load', function(event) {
				var image = $(event.target);
				var width = image.width();
				var outerWidth = image.outerWidth();
				var height = image.height();
				var outerHeight = image.outerHeight();
				var containerWidth = image.parents('div.image').width();
				var containerHeight = image.parents('div.image').height();
				var imageRatio = width / height;
				var containerRatio = containerWidth / containerHeight;
				
				// If the image is taller than it's container...
				if( outerHeight > containerHeight ) {
					image.css({
						width: 'auto',
						height: containerHeight
					});
				}
				
			}).each(function() {
			  if(this.complete) $(this).load();
			});
		}
       
		this.dotNavigation = function(){
			if( slidedeckFrame.hasClass('sd2-nav-dots') ) {			
				var maxDots = 20;
				if( slidedeckFrame.hasClass('sd2-small') ) {
					maxDots = 10;
				}
			
				var slideCount = slidedeck.find('dd.slide').length;
				var navHtml = '<ul class="dot-nav"></ul>';
				$(navHtml).appendTo(slidedeckFrame);
				var dotNav = slidedeckFrame.find('.dot-nav');
				for( i = 0; i < Math.min( slideCount, maxDots ); i++ ) {
					$('<li></li>').appendTo(dotNav);
				}
				var navDots = dotNav.find('li');
				dotNav.css( 'width', Math.min( slideCount, maxDots ) * ( navDots.outerWidth() + 10 ) - 10 )
				dotNav.css( 'margin-left', -( dotNav.outerWidth() / 2) );
				navDots.eq( deck.current-1 ).addClass('accent-color-background');
				// ADD CLICK FUNCTIONS
				navDots.bind('click', function(){
					var $self = $(this);
					deck.goTo(($self).index()+1);
					navDots.removeClass('accent-color-background');
					$self.addClass('accent-color-background');
				});
			}
		}
		
		this.syncButtonNavigation = function(){
			if( navDeck ){
				if( !mouseIsHoveringOverNav ){
					var slideIsOnPage = Math.ceil( deck.current / maxButtonsPerPage );
					navDeck.goTo( slideIsOnPage );
				}
			}
		}
		
		this.positionPlayButtons = function(){
			slidedeckFrame.find('.image .play-video-alternative').each(function(){
				var playButton = $(this);
				playButton.css({
					'margin-top': '-' + Math.round( parseInt( playButton.css('padding-top') ) / 2 ) + 'px',
					'margin-left': '-' + Math.round( playButton.width() / 2 ) + 'px'
				});
				
                // Append the icon-shape element and use it as the Raphael paper.
                playButton.append('<span class="play-icon"></span>');
                var iconWrapper = playButton.find('.play-icon');
                var width = iconWrapper.width();
                var height = iconWrapper.height();
                var paper = Raphael( iconWrapper[0], width, height );
				var circle = paper.circle( Math.round( width/2 ) , Math.round( height/2 ), Math.round( width * 0.48 ) );
                var circleOpacity = {
                	normal: 0.8,
                	hover: 1.0
                };
                
                // Draw the triangle
                // Top point
		        var path = "M" + ( width * 0.35 ) + "," + ( height * 0.25 );
		        // Right point
		        path += "L" + ( width * 0.75 ) + "," + ( height / 2 );
		        // Lower point
		        path += "L" + ( width * 0.35 ) + "," + ( height * 0.75 );
		        path += "z";
                var triangle = paper.path( path );
                
                // Fill and stroke for these elements
                triangle.attr({
                  stroke: 'none',
                  fill: 'rgba(0,0,0,1)'
                });
                circle.attr({
                  stroke: 'none',
                  fill: 'rgba(255,255,255,' + circleOpacity.normal + ')'
                });
                
                // Bind the mouse events for opacity changes
                playButton.bind('mouseenter', function(event){
	                circle.attr({
	                  fill: 'rgba(255,255,255,' + circleOpacity.hover + ')'
	                });
                });
                playButton.bind('mouseleave', function(event){
	                circle.attr({
	                  fill: 'rgba(255,255,255,' + circleOpacity.normal + ')'
	                });
                });
                
			});
		}
		
		this.buttonNavigation = function(){
			if( slidedeckFrame.hasClass('sd2-nav-titles') || slidedeckFrame.hasClass('sd2-nav-dates') ) {			
				var slideCount = slidedeck.find('dd.slide').length;
				var buttons = slidedeck.find('dd.slide .nav-button');
				var navHtml = '<div class="button-nav"></div>';
				var appendedNav = $(navHtml).appendTo(slidedeckFrame);
				var navOuterWidth = parseInt( appendedNav.outerWidth() );
				// Percentage for each nav arrow
				var navArrowWith = 3.5;
				// Remaining percentage for nav buttons
				var availableForButtons = 100 - (navArrowWith * 2);
				
				if( slidedeckFrame.hasClass('sd2-nav-dates') ){
					// Divide the width of the container by the factor to get a max count ( for dates )
					maxButtonsPerPage = Math.ceil( navOuterWidth / 140 );
				}else{
					// Divide the width of the container by the factor to get a max count ( for titles )
					maxButtonsPerPage = Math.ceil( navOuterWidth / 160 );
				}
				
				numberOfPages = Math.ceil( slideCount / maxButtonsPerPage );
				
				// Special case for small decks.
				if( slidedeckFrame.hasClass('sd2-small') ){
					maxButtonsPerPage = Math.ceil( navOuterWidth / 100 );
				}
				
				if( maxButtonsPerPage >= slideCount ){
					navArrowWith = false;
					availableForButtons = 100;
				}
				
				// Create the button nav
				var buttonNav = slidedeckFrame.find('.button-nav');
				
				// Append the previous nav
				if( navArrowWith )
					buttonNav.append('<a class="nav-arrow prev" href="#prev-page" style="width:' + navArrowWith + '%;"></a>');
				
				// Create the pages
				var indexCount = 0;
				buttonNav.append('<dl class="nav-slidedeck" style="width:' + availableForButtons + '%;"></dl>');
				navDeckElement = slidedeckFrame.find('dl.nav-slidedeck');
				for( p = 1; p <= numberOfPages; p++ ){
					
					navDeckElement.append( '<dd class="page"></dd>' );
					var thisPage = slidedeckFrame.find('dl.nav-slidedeck dd:eq(' + ( p - 1 ) + ')');
					
					for( i = indexCount; i < Math.min( slideCount, maxButtonsPerPage ) * p; i++ ) {
						var button = buttons[indexCount];
						$(button).find('.sd2-nav-title').append('<span class="icon-caret"></span>');
						
						if( button ){
							$( buttons[indexCount] ).appendTo(thisPage);
						}else{
							$( '<span class="spacer"></span>' ).appendTo(thisPage);
						}
						indexCount++;
					}
				}
				
				navDeck = slidedeckFrame.find('dl.nav-slidedeck').slidedeck({
					keys: false,
					scroll: false,
					cycle: slidedeck.slidedeck().options.cycle
				});
				
				// Append the next nav
				if( navArrowWith )
					buttonNav.append('<a class="nav-arrow next" href="#next-page" style="width:' + navArrowWith + '%;"></a>');
				
				// Handle the accent color backgrounds for the nav buttons.
				if( slidedeckFrame.hasClass('sd2-nav-dates') ){
	    	    	var theClass = 'background';
	    	    	if( slidedeckFrame.hasClass('sd2-transparent-background') ){
	    	    		theClass = 'accent-color-background';
	    	    	}
					
					buttons.eq( deck.current-1 ).find('span').addClass( theClass );
				}else{
					buttons.eq( deck.current-1 ).addClass('active');
				}
				
				buttons.bind('click', function(){
					var $self = $(this);
					deck.goTo(($self).index('.nav-button')+1);

					if( slidedeckFrame.hasClass('sd2-nav-dates') ){
						buttons.find('span').removeClass('active');
					}else{
						buttons.removeClass('active');
					}

					if( slidedeckFrame.hasClass('sd2-nav-dates') ){
						$self.find('span').addClass('active');
					}else{
						$self.addClass('active');
					}
				});
				
				// Size the buttons appropriately.
				buttons.css({
					width: ( 100 / ( Math.min( slideCount, maxButtonsPerPage ) ) ) + '%'
				});
				navDeckElement.find('span.spacer').css({
					width: ( 100 / ( Math.min( slideCount, maxButtonsPerPage ) ) ) + '%'
				});
				
				/**
				 * Add a class to see when the mouse is in the slide area
				 * 
				 * The basic idea is that if the user's mouse is in the button nav
				 * area then we can reasonably assume they are about to click either the
				 * prev/next page button or a button. In this case, we skip auto scrolling.
				 */
				slidedeckFrame.find('.button-nav').bind('mouseenter mouseleave', function(event){
					if( event.type == 'mouseenter' ){
						mouseIsHoveringOverNav = true;
					}else{
						mouseIsHoveringOverNav = false;
					}
				});
				
				// Append the SVG Arrows to the nav arrows
				slidedeckFrame.find('.button-nav .nav-arrow').each(function(){
					var button = $(this);
					
                    // Append the icon-shape element and use it as the Raphael paper.
                    button.append('<span class="icon-shape-prev-next"></span>');
                    var iconWrapper = button.find('.icon-shape-prev-next');
                    var width = iconWrapper.width();
                    var height = iconWrapper.height();
                    var strokeWidth = 2;
                    var opacity = {
                    	normal: 0.75,
                    	hover: 1
                    };
                    var arrowColor = '#ffffff';
                    var paper = Raphael( iconWrapper[0], width, height );
                    
                    // Draw the icon
                    // Move to the top center (minus thickness)
			        var path = "M0,0";
			        // Draw thickness
			        path += "L" + strokeWidth + ",0";
			        // draw a diagonal to the center right
			        path += "L" + ( width - strokeWidth ) + "," + ( height / 2 );
			        // draw to the bottom left
			        path += "L" + strokeWidth  + "," + height;
			        // minus the stroke width
			        path += "L" + 0 + "," + height;
			        // draw a diagonal to the center right (minus thickness)
			        path += "L" + ( width - strokeWidth * 2 ) + "," + ( height / 2 );
			        // Close the path
			        path += "z";

                    var pointerShape = paper.path( path );
                    
                    // Flip the arrow if it's the prev arrow
                    if( this.hash == '#prev-page' ){
	                    pointerShape.transform("s-1,1");
                    }
                    
                    if( slidedeckFrame.hasClass('sd2-light') )
                    	arrowColor = '#333333';
                    
                    pointerShape.attr({
                      'stroke': 'none',
                      'fill': arrowColor
                    });
                    
	                // Define the data property to adjust the color.
	                iconWrapper.data('prev-next-arrows', pointerShape);
                    
				});
				
				// Bind click events to the prev/next arrows
				slidedeckFrame.find('.button-nav .nav-arrow').bind('click', function(event){
					event.preventDefault();
					switch( this.hash ){
						case '#prev-page':
							navDeck.prev();
						break;
						case '#next-page':
							navDeck.next();
						break;
					}
				});
				
				self.syncButtonNavigation();
			}
		}
		
		/**
		 * Prevents a click on the a tag of the video thumb from opening the 
		 * video in a new window.
		 */
		this.hijackClickOnVideoThumb = function(){
		    slidedeckFrame.find('.slide-type-video a.sd2-image-link').click(function(event){
		        event.preventDefault();
		    });
		}
		
		// Get the old complete option
		var oldComplete = deck.options.complete;
		
    	deck.setOption('complete', function(){
	        // If the old complete option was a function, run it
		    if(typeof(oldComplete) == 'function') {
	            oldComplete(deck);
            }
    	});
    	
    	var oldBefore = deck.options.before;
    	deck.setOption('before', function(deck){
    	    if(typeof(oldBefore) == 'function')
    	       oldBefore(deck);
    	    
    	    // Bind the callbacks to the dot nav
    	    if( slidedeckFrame.hasClass('sd2-nav-dots') ){
	            var navDots = slidedeckFrame.find('.dot-nav').find('li');
	            navDots.removeClass('accent-color-background');
	        	navDots.eq(deck.current-1).addClass('accent-color-background');
    	    }
    	    
            var navButtons = slidedeckFrame.find('.button-nav').find('.nav-button');
    	    // Bind the callbacks to the nav buttons (dates)
    	    if( slidedeckFrame.hasClass('sd2-nav-dates') ){
    	    	var theClass = 'background';
    	    	if( slidedeckFrame.hasClass('sd2-transparent-background') ){
    	    		theClass = 'accent-color-background';
    	    	}
    	    	
	            navButtons.find('span').removeClass( theClass );
	        	navButtons.eq(deck.current-1).find('span').addClass( theClass );
    	    }
    	    // Bind the callbacks to the nav buttons (titles)
    	    if( slidedeckFrame.hasClass('sd2-nav-titles') ){
	            navButtons.removeClass('active');
	        	navButtons.eq(deck.current-1).addClass('active');
    	    }
    	    
    	    self.syncButtonNavigation();
    	});
    	
		this.hijackClickOnVideoThumb();		
		this.positionPlayButtons();		
       	this.dotNavigation();
       	this.buttonNavigation();
       	this.widthOrHeight();
		return true;
	};
    
    $(document).ready(function(){
        $('.lens-reporter .slidedeck').each(function(){
            if(typeof($.data(this, 'lens-reporter')) == 'undefined'){
                $.data(this, 'lens-reporter', new SlideDeckLens['reporter'](this));
            }
        });
    });
    
})(jQuery);