(function($){
    SlideDeckLens['tool-kit'] = function(slidedeck){
    	
    	var self = this;
        var ns = 'tool-kit';
        var deck = $(slidedeck).slidedeck();
        
        var verticalDeck = deck.vertical();
        var elems = {};
            elems.slidedeck = deck.deck;
            elems.frame = elems.slidedeck.closest('.lens-' + ns);
            elems.slides = deck.slides;
            elems.deckWrapper = elems.frame.find('.sd-wrapper');
            elems.horizNav = elems.frame.find('.deck-navigation.horizontal');
            elems.horizNavPrev = elems.frame.find('.deck-navigation.horizontal.prev');
            elems.horizNavNext = elems.frame.find('.deck-navigation.horizontal.next');
            
            elems.vertNav = elems.frame.find('.deck-navigation.vertical');
            elems.vertNavPrev = elems.frame.find('.deck-navigation.vertical.prev');
            elems.vertNavNext = elems.frame.find('.deck-navigation.vertical.next');
        
        elems.slidedeck.find('.sd2-slide-text a').addClass('accent-color');

        deck.loaded(function( deck ){
            
            /**
             * Test the deck to see if it has vertical slides.
             */
            var isVertical = false;
            if( elems.frame.find('.slidesVertical').length ){
                isVertical = true;
            }
            
            /**
             * If the deck is vertical, then get the vertical slides instead.
             */
            if( isVertical ){
                elems.slides = deck.vertical().slides;
                
                /**
                 * Set vertical scroll option to the same as the parent deck.
                 */
                if( deck.options.scroll ) {
                    verticalDeck.options.scroll = true;
                }else{
                    verticalDeck.options.scroll = false;
                }
            }
            
        	var overlay = function(){
        		if(elems.frame.hasClass('sd2-frame')){
    	    		jQuery('<div class="sd-lens-shadow-top"></div><div class="sd-lens-shadow-left"></div><div class="sd-lens-shadow-corner"></div>').appendTo(elems.slidedeck);
    			}
        	}
        	
        	var deckNavigation = function(){
        	    var self = this;
        	    
        		if(!elems.frame.hasClass('sd2-nav-none')){
        			deckCount = elems.slides.length;
        			jQuery('<div class="sd-nav-wrapper"></div>').appendTo(elems.deckWrapper);
        			elems.navWrapper = elems.frame.find('.sd-nav-wrapper');
        			jQuery('<dl class="sd-nav-deck"></dl>').appendTo(elems.navWrapper);
    			    elems.navDeck = elems.navWrapper.find('.sd-nav-deck');
    			    
    			    /**
    			     * Append a vertical dl to the first slide if it's vertical and uses thumbnails.
    			     */
        			if( isVertical && elems.frame.hasClass('sd2-nav-thumb') ){
        			    jQuery('<dd><dl class="slidesVertical"></dl></dd>').appendTo(elems.navDeck);
        			    elems.verticalSlides = elems.navDeck.find('.slidesVertical');
        			}
        			
    	    		if(elems.frame.hasClass('sd2-nav-dots')){
    	    			// run dot code
    					var i = 1;
    					while(i <= deckCount && i <= 10){
    						jQuery('<dd class="sd-nav-dot"></dd>').appendTo(elems.navDeck);
    						i++;
    					}
    					elems.navDots = elems.navDeck.find('.sd-nav-dot');
    					elems.navDots.click(function(){
						    $(elems.slidedeck).slidedeck().options.autoPlay = false;
						    deck.options.pauseAutoPlay = true;
						    
    						var $self = jQuery(this);
    						var classToAdd = 'active';
    						if( elems.frame.hasClass('sd2-nav-hanging') ) {
    		        			classToAdd = 'accent-color-background';
    		        		}
    						elems.navDots.removeClass('accent-color-background active');
    						$self.addClass(classToAdd);
    						
    						/**
    						 * If the deck is vertical, then we'll go to the 
    						 * vertical slide instead.
    						 */
    						if( isVertical ){
    						    verticalDeck.goTo( $self.index() + 1 );
    						}else{
        						deck.goTo( $self.index() + 1 );
    						}
    					});
    					
    					
    					if( isVertical ){
        					dotSpacing = parseInt(elems.navDots.outerHeight()+10);
        					elems.navDots.first().css('margin-top', 0);
        					var verticalDotNavHeight = (dotSpacing*elems.navDots.length);
        					elems.navDeck.css({
        					    'height': verticalDotNavHeight,
        					});
    					    
                            elems.navWrapper.css({
                                'height': verticalDotNavHeight,
        					    'margin-top': Math.round(verticalDotNavHeight/2) * -1,
                            });
    					}else{
        					/**
        					 * Center the horizontal nav dots if this is a
        					 * horizontal deck.
        					 */
        					dotSpacing = parseInt(elems.navDots.outerWidth()+10);
        					elems.navDeck.css('width', (dotSpacing*elems.navDots.length)-parseInt(elems.navDots.last().css('margin-left'),10));
    					}
    					
    					
    					if( ( !elems.frame.hasClass('sd2-nav-bar') && !elems.frame.hasClass('sd2-nav-hanging') ) ){
    						/**
    						 * Only run this positioning code if the deck is horizontal
    						 */
    						if( !isVertical ){
        						var spacingVar = parseInt(elems.frame.css('padding-left'), 10)+20;
        						if(elems.frame.hasClass('sd2-nav-pos-top')){
        							var topVar = spacingVar;
        							var bottomVar = 'auto';
        						}else{
        							var topVar = 'auto';
        							var bottomVar = spacingVar
        						}
        						
        						var marginLeftVar = -(elems.navWrapper.width()/2);
        						if( elems.frame.hasClass('sd2-nav-dots') && elems.frame.hasClass('sd2-nav-pos-top') && !elems.frame.hasClass('sd2-nav-default') ){
        							marginLeftVar = 0;
        						}
        						
        						/**
        						 * If the dot nav is outside the slide area and on top, increase the dot distance.
        						 */
        						if( elems.frame.hasClass('sd2-nav-dots') && elems.frame.hasClass('sd2-nav-pos-top') && elems.frame.hasClass('sd2-nav-hanging') ){
        						    topVar = topVar/2;
        						}
        						
    						
        						elems.navWrapper.css({
        							'margin-left': marginLeftVar,
        							'top': topVar,
        							'bottom': bottomVar
        						});
    						}
    					};
    					
    					
    					if(elems.frame.hasClass('sd2-nav-default') && !elems.frame.hasClass('sd2-title-pos-top') && !elems.frame.hasClass('sd2-hide-title') && !elems.frame.hasClass('sd2-title-pos-bottom') && elems.frame.hasClass('sd2-nav-dots') && !elems.frame.hasClass('sd2-small') ){
                            if( isVertical ){
                                /**
                                 * Vertical positioning code
                                 */
                                if(elems.frame.hasClass('sd2-nav-default') && elems.frame.hasClass('sd2-nav-dots') && !elems.frame.hasClass('sd2-small') ){
                                    elems.navWrapper.css({
                                        'margin-top': marginLeftVar + marLeftAdjustment
                                    });
                                }
        					}else{
        					    /**
        					     * Horizontal positioning code
        					     */
        						var titleWidth = elems.frame.find('.sd-node-title-box').outerWidth();
        						if(elems.frame.hasClass('sd2-title-pos-right')){
        							var marLeftAdjustment = -(titleWidth / 2);
        						}else if(elems.frame.hasClass('sd2-title-pos-left')){
        							var marLeftAdjustment = titleWidth / 2;
        						}
        						elems.navWrapper.css({
        							'margin-left': marginLeftVar + marLeftAdjustment
        						});
        					}
    					}
    					
    					var classToAdd = 'active';
    					if( elems.frame.hasClass('sd2-nav-hanging') ) {
    	        			classToAdd = 'accent-color-background';
    	        		}
    					$('.sd-nav-dot').eq( deck.current - 1 ).addClass( classToAdd );
    					
    					// Set the initial dot position
    					if(isVertical){
        					verticalDotsIndicatorUpdate( deck.options.startVertical - 1 );
    					}
    					
    	    		} /* End of dots nav */
    	    		
    	    		
    	    		if(elems.frame.hasClass('sd2-nav-hanging')){
    	    			elems.navWrapper.appendTo(elems.frame);
    	    		}
    	    		if(elems.frame.hasClass('sd2-nav-thumb')){
    	    		    var navArrowWidth = 73;
                        // The Nav arrows are wider than the nav buttons... when in their own bar
                        if( elems.frame.hasClass('sd2-nav-arrow-style-2') && elems.frame.hasClass('sd2-nav-bar') )
                            navArrowWidth = 85;
                            
    	    		    
                        if( isVertical ){
                            // Small arrows for the default nav arrow style
                            if( elems.frame.hasClass('sd2-small') ){
                                navArrowWidth = 55;
                            }
                            
                            // Small nav arrows for the nav arrow style 2
                            if( elems.frame.hasClass('sd2-nav-arrow-style-2') && elems.frame.hasClass('sd2-nav-bar') && elems.frame.hasClass('sd2-small') ){
                                navArrowWidth = 58;
                            }
                            
                            elems.navWrapper.css({
                                'padding-top': navArrowWidth,
                                'padding-bottom': navArrowWidth
                            });
                            
                            elems.navWrapper.css('height', ( elems.slidedeck.outerHeight() - ( navArrowWidth * 2 ) ) );
                            elems.navDeck.css('height', ( elems.slidedeck.outerHeight() - ( navArrowWidth * 2 ) ) );
                            elems.navWrapper.css({
                                'margin-top': Math.round( elems.navWrapper.outerHeight() * -0.5 ),
                                'top': '50%'
                            });
                        }else{
                            elems.navWrapper.css({
                                'padding-left': navArrowWidth,
                                'padding-right': navArrowWidth
                            });
                            
                            elems.navWrapper.css('width', ( elems.slidedeck.outerWidth() - ( navArrowWidth * 2 ) ) );
                            elems.navDeck.css('width', ( elems.slidedeck.outerWidth() - ( navArrowWidth * 2 ) ) );
                            elems.navWrapper.css({
                                'margin-left': Math.round( elems.navWrapper.outerWidth() * -0.5 ),
                                'left': '50%'
                            });
                        }
                        
                        
    					//run thumbnail code
    					elems.navDeck.addClass('thumb');
    					
    					var i = 1;
    					
    					while(i <= deckCount){
    					    
    					    if( isVertical ){
    					        jQuery('<span class="sd-thumb sd2-custom-title-font"><span class="number">'+i+'</span><span class="inner-image"></span></span>').appendTo(elems.verticalSlides);
    					    }else{
						        jQuery('<span class="sd-thumb sd2-custom-title-font"><span class="number">'+i+'</span><span class="inner-image"></span></span>').appendTo(elems.navDeck);
    					    }
    					    
                            // Only for IE - detect background image url and update style for DD element
                            if( $.browser.msie && $.browser.version <= 8.0 ){
                                elems.frame.find('span.sd-thumb .inner-image').eq(i-1)[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + elems.slides.eq(i-1).attr('data-thumbnail-src') + "', sizingMethod='scale')";
                            }else{
        						elems.frame.find('span.sd-thumb .inner-image').eq(i-1).css('background-image', 'url('+elems.slides.eq(i-1).attr('data-thumbnail-src')+')' )
                            }
    						i++;
    					}
    					
    					
    					// let's dynamically figure out how many thumbnails will fit in our nav
    					singleThumb = elems.frame.find('.sd-thumb');
    					if( isVertical ){
                            thumbHeight = singleThumb.height(),
                            thumbSpacing = parseInt( singleThumb.last().css('margin-bottom') ),
                            fullThumb = thumbHeight + thumbSpacing,
                            thumbsPerSlide = Math.floor( ( ( elems.frame.find('.sd-nav-wrapper').height() + thumbSpacing ) / fullThumb ) );
    					    var thumbs = elems.verticalSlides.children('.sd-thumb');
    					}else{
        					thumbWidth = parseInt(singleThumb.css('width'), 10),
        					thumbSpacing = parseInt(singleThumb.last().css('margin-left'), 10),
        					fullThumb = thumbWidth + thumbSpacing,
        					thumbsPerSlide = Math.floor( ( ( elems.frame.find('.sd-nav-wrapper').width() + thumbSpacing ) / fullThumb ) );
        					var thumbs = elems.navDeck.children('.sd-thumb');
    					}
    					
    					thumbs.remove();
    					
    					var i = 0;
    					while( i < deckCount ){
    						if(i == 0 || i % thumbsPerSlide == 0){
    						    if( isVertical ){
    						        jQuery('<dd class="thumb-slide"></dd>').appendTo(elems.verticalSlides);
    						    }else{
        							jQuery('<dd class="thumb-slide"></dd>').appendTo(elems.navDeck);
    						    }
    						};
    						jQuery(thumbs[i]).appendTo(elems.navDeck.find('.thumb-slide').last());
    						i++	
    					}
    					
    					// let's center up these thumbs
    					if( isVertical ){
    					    elems.verticalSlides.children('dd').wrapInner('<div class="nav-centered"></div>');
    					    elems.navDeck.find('.nav-centered').each(function(){
    					        var halfOfThumbMargin = Math.round( parseInt( $(this).find('.sd-thumb').last().css('margin-bottom') ) / 2 );
                                $(this).css({
                                    'margin-top': ( $(this).outerHeight() * -0.5 ) + halfOfThumbMargin,
                                    'margin-left': $(this).outerWidth() * -0.5
                                });
                            });
    					    
    					}else{
        					elems.navDeck.children('dd').wrapInner('<div class="nav-centered"></div>');
        					elems.navDeck.find('.nav-centered').each(function(){
        						var $self = $(this);
        						var thumbsCount = $self.find('.sd-thumb').length,
        							navCentered = (fullThumb * thumbsCount) - parseInt( $self.find('.sd-thumb').last().css('margin-left') );
        						
            					$self.css('width', navCentered);
        					});
    					}
    					
    					elems.navDeck.show();

                        // TODO: Make this not cause the deck to be too high and fail.    					
       					// if( isVertical ){
                               // var thumbMargin = parseInt( elems.navDeck.find('.sd-thumb:last').css('margin-bottom') );
                               // elems.navWrapper.css('height', ( elems.slidedeck.outerHeight() - ( navArrowWidth * 2 ) + thumbMargin ) );
                               // elems.navDeck.css('height', ( elems.slidedeck.outerHeight() - ( navArrowWidth * 2 ) + thumbMargin ) );
       					// }
    					
    					//initialize thumbnail slidedeck
    					var cycleOption = false;
    					if( deck.options.cycle )
    					   cycleOption = true;
    					   
    					var navOptions = {
                            hideSpines: true,
                            cycle: cycleOption,
                            keys: false,
                            scroll: false
                        };
    					elems.navSlideDeck = elems.navDeck.slidedeck( navOptions );
    					elems.navSlideDeck.vertical( navOptions );
    					
    					// add click events to thumbnails
    					elems.thumbs = elems.navDeck.find('.sd-thumb');
    					elems.navDeck.delegate('.sd-thumb', 'click', function(event){
    						event.preventDefault();
    						var $this = $.data(this, '$this'),
                                thumbIndex = $.data(this, 'thumbIndex');
    
                            this.style.backgroundColor = "";
    
                            elems.thumbs.removeClass('active accent-color-background');
    						$this.addClass('active accent-color-background');
    						
                            /**
                             * If the deck is vertical, then we'll go to the 
                             * vertical slide instead.
                             */
                            if( isVertical ){
                                $(elems.slidedeck).slidedeck().options.autoPlay = false;
                                deck.options.pauseAutoPlay = true;
                                verticalDeck.goTo(thumbIndex + 1);
                            }else{
        						deck.goTo(thumbIndex + 1);
                            }
    					}).delegate('.sd-thumb', 'mouseenter', function(event){
                            var $this = $.data(this, '$this'),
                                thumbIndex = $.data(this, 'thumbIndex');
                            
                            if(!$this){
                                $this = $(this);
                                $.data(this, '$this', $this);
                            }
                            
                            if(!thumbIndex){
                                thumbIndex = elems.thumbs.index($this);
                                $.data(this, 'thumbIndex', thumbIndex);
                            }
                            
                            var accentColor = $this.css('background-color');
                            var rgb = Raphael.getRGB(accentColor);
                            var hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b);
                                hsl.l = Math.min(100, (120 * hsl.l))/100;
                            var hoverColor = Raphael.hsl(hsl.h, hsl.s, hsl.l);
                            
                            $this.css('background-color', hoverColor);
    					}).delegate('.sd-thumb', 'mouseleave', function(event){
                            this.style.backgroundColor = "";
    					});
    					
    					/**
    					 * Add arrows to the navigation if they are needed.
    					 * For vertical navigation, we need to count the length of the
    					 * .slidesVertical dd elements.
    					 */
    					elems.navSlides = elems.navDeck.find('dd');
                        if( isVertical )
                            elems.navSlides = elems.navDeck.find('.slidesVertical dd');
    					
    					if(elems.navSlides.length > 1){
    						jQuery('<a class="deck-navigation-arrows prev" href="#prev" target="_blank"><span>Prev</span></a><a class="deck-navigation-arrows next" href="#next" target="_blank"><span>Next</span></a>').appendTo(elems.navWrapper);
    						elems.navArrows = elems.navWrapper.find('.deck-navigation-arrows');
    						elems.navArrows.click(function(event){
    							event.preventDefault();
    							
    							// Prevent automatic pagination if user starts interacting (will be reset on next pagination request)
    						    $.data(elems.navDeck[0], 'pauseAutoPaginate', true);
    						    
    							switch(this.href.split('#')[1]){
    								case 'next':
    									elems.navSlideDeck.next();
    								break;
    								case 'prev':
								        elems.navSlideDeck.prev();
    								break;
    							}
    						})
    					}
    					
    					//set the current slide's thumbnail to active and move to the appropriate nav slide
    					elems.frame.find('.sd-nav-deck .sd-thumb').eq(deck.current-1).addClass('active accent-color-background');
    					if( isVertical ){
    					    // Set the start slide and fire the thumbnail updater. (zero indexed)
                            thumbIndicatorUpdate( deck.options.startVertical - 1 );
    					}else{
                            elems.navSlideDeck.goTo(elems.navDeck.find('.chrome-thumb.active').parents('dd').index()+1);
    					}
    				}
        		}
        	}
        	
        	var setOptions = function(){
        	    var self = this;
        	    
        	    if( isVertical )
        	        deck = verticalDeck;
        	    
                // Get the old complete and before options
                var oldBefore = deck.options.before;

                if( isVertical && elems.frame.hasClass('sd2-nav-thumb') )
                    elems.navSlideDeck = elems.navSlideDeck.vertical();
        	    
        		deck.options.before = function( deck ){
        		    if(typeof(oldBefore) == 'function')
                        oldBefore(deck);
                        
    	        	if(elems.frame.hasClass('sd2-nav-dots')){
                        /**
                         * Case for the dot navigation
                         */
                        
                        // Which CSS classes are we working with?
    	        		var classToRemove = 'active';
    	        		if( elems.frame.hasClass('sd2-nav-hanging') ) {
    	        			classToRemove = 'accent-color-background';
    	        		}
    		        	elems.navDots.removeClass(classToRemove);
    					elems.navDots.eq( deck.current-1 ).addClass(classToRemove);
    					
    					// Update the dots
    					if( isVertical ){
    					    verticalDotsIndicatorUpdate( deck.current );
    					}else{
                            verticalDotsIndicatorUpdate( deck.current - 1 );
    					}
                        
    				}else if(elems.frame.hasClass('sd2-nav-thumb')){
                        /**
                         * Case for the thumbnail navigation
                         */
                        
                        // Update the thumbnails
                        thumbIndicatorUpdate( deck.current );
    					
    					if(!$.data(elems.navDeck[0], 'pauseAutoPaginate')){
        					elems.navSlideDeck.goTo(elems.navDeck.find('.sd-thumb.active').parents('dd').index()+1);
    					}
    					$.data(elems.navDeck[0], 'pauseAutoPaginate', false);
    					
    				}
    	    	}
    	    	
    	    	if( isVertical ){
                    // Get old complete() of the Vertical SlideDeck if it exists, and then set new complete() and append old one to it.
                    var oldComplete = verticalDeck.options.complete;
                    verticalDeck.options.complete = function(deck){
                        if(typeof(oldComplete) == 'function')
                            oldComplete(deck);
                        
                        
                        if(elems.frame.hasClass('sd2-nav-dots')){
                        }else if(elems.frame.hasClass('sd2-nav-thumb')){
                            
                        }
                    };
    	    	}
    	    	
        	};
        	
            // function to control the animation of the vertical-slid-nav-indicator element
            var verticalDotsIndicatorUpdate = function(ind){
                if( elems.navDots ){
                    var classToAdd = 'active';
                    if( elems.frame.hasClass('sd2-nav-hanging') ) {
                        classToAdd = 'accent-color-background';
                    }
                    elems.navDots.removeClass('accent-color-background active');
                    $(elems.navDots[ind]).addClass(classToAdd);
                }
            }
            
            var thumbIndicatorUpdate = function(ind){
                if( elems.thumbs ){
                    /**
                     * If the deck is a horizontal deck, let's go ahead
                     * and decrement the index value.
                     */
                    if( !isVertical )
                       ind--; 
                    
                    var classToToggle = 'accent-color-background active';
                    elems.thumbs.removeClass( classToToggle );
                    $( elems.thumbs[ind] ).addClass( classToToggle );
                }
            }
            
            var bindScrollEventForDotUpdate = function(){
                if(typeof($.event.special.mousewheel) != "undefined"){
                    elems.frame.bind( 'mousewheel', function(event, mousewheeldelta){
                        if( verticalDeck.options ){
                            if( verticalDeck.options.scroll ){
                                if( mousewheeldelta == 1 ){
                                    verticalDotsIndicatorUpdate(verticalDeck.current);
                                }else if( mousewheeldelta == -1 ){
                                    verticalDotsIndicatorUpdate(verticalDeck.current);
                                }
                            }
                        }
                    });
                };
            }
        	
            var bindScrollEventForThumbUpdate = function(){
                if(typeof($.event.special.mousewheel) != "undefined"){
                    elems.frame.bind( 'mousewheel', function(event, mousewheeldelta){
                        if( verticalDeck.options ){
                            if( verticalDeck.options.scroll ){
                                if( mousewheeldelta == 1 ){
                                    thumbIndicatorUpdate(verticalDeck.current);
                                }else if( mousewheeldelta == -1 ){
                                    thumbIndicatorUpdate(verticalDeck.current);
                                }
                            }
                        }
                    });
                };
            }
        	
        	var deckAdjustments = function(){
        		if(elems.frame.hasClass('sd2-nav-hanging')){
        			//elems.hangingWrapper.css('width', elems.slidedeck.width()+2);
        		}
        		if(elems.frame.hasClass('sd2-frame') && elems.frame.hasClass('sd2-nav-pos-top') && elems.frame.hasClass('sd2-nav-bar')){
        			elems.frame.css('padding-bottom', parseInt(elems.frame.css('padding-left'), 10));
        		}
        		if(elems.frame.hasClass('sd2-nav-pos-top') && elems.frame.hasClass('sd2-frame') && elems.frame.hasClass('sd2-nav-hanging')){
        			elems.navWrapper.appendTo(elems.frame);
        		}
        		if(elems.frame.hasClass('sd2-nav-thumb') && elems.frame.hasClass('sd2-nav-arrow-style-2')){
                    if( isVertical ){
                        var buttonHeight = elems.navWrapper.outerWidth()
                        elems.navWrapper.find('.deck-navigation-arrows').css('height', buttonHeight);
                    }else{
            			var buttonWidth = elems.navWrapper.outerHeight()
            			elems.navWrapper.find('.deck-navigation-arrows').css('width', buttonWidth);
                    }
        		}
        		
        		
        		
                var horizOffset;
                var vertOffset = 0;
                if( elems.frame.hasClass('sd2-small') ){
                    horizOffset = 3;
                }else if( elems.frame.hasClass('sd2-medium') ){
                    horizOffset = 10;
                }else if( elems.frame.hasClass('sd2-large') ){
                    horizOffset = 10;
                }
                
                if( elems.frame.hasClass('sd2-frame') ){
                    vertOffset = 5;
                }
                
                /**
                 * Adjust left/right position for the nav arrows if
                 * the frame is used. (not hairline)
                 */
                if( elems.frame.hasClass('sd2-frame') ){
                    elems.horizNavPrev.css('left', parseInt( elems.horizNavPrev.css('left') ) + horizOffset );
                    elems.horizNavNext.css('right', parseInt( elems.horizNavNext.css('right') ) + horizOffset );
                }
                
                /**
                 * Adjust the top margin of the nav arrows if the
                 * hanging or bar nav is used.
                 */
                if( !elems.frame.hasClass('sd2-no-nav') ){
                    if( elems.frame.hasClass('sd2-nav-pos-top') ){
                        
                        if( elems.frame.is('.sd2-nav-bar') ){
                            elems.horizNav.css('marginTop', ( parseInt( elems.horizNav.css('marginTop') ) + Math.round( elems.frame.find('.sd-nav-wrapper').outerHeight() / 2 ) - vertOffset ) );
                        }
                        
                    }else{
                        if( !elems.frame.hasClass('sd2-frame') || elems.frame.hasClass('sd2-nav-bar') ){
                            if( elems.frame.is('.sd2-nav-bar, .sd2-nav-hanging') ){
                                elems.horizNav.css('marginTop', parseInt( elems.horizNav.css('marginTop') ) - Math.round( elems.frame.find('.sd-nav-wrapper').outerHeight() / 2 ) + vertOffset );
                            }
                        }
                    }
                }
        	}
        	
            deckNavigation();
            overlay();
            setOptions();
            deckAdjustments();
            bindScrollEventForDotUpdate();
            bindScrollEventForThumbUpdate();
        	
        });
    };
    
    $(document).ready(function(){
        $('.lens-tool-kit .slidedeck').each(function(){
            if(typeof($.data(this, 'lens-tool-kit')) == 'undefined' || $.data(this, 'lens-tool-kit') == null){
                $.data(this, 'lens-tool-kit', new SlideDeckLens['tool-kit'](this));
            }
        });
    });
})(jQuery);