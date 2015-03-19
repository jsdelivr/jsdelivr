(function($){
    SlideDeckSkin['o-town'] = function(slidedeck){
        var ns = 'o-town';
        var deck = $(slidedeck).slidedeck();
        var verticalDeck = deck.vertical();
        var elems = {};
            // The SlideDeck DOM element itself
            elems.slidedeck = deck.deck;
            // The SlideDeck's frame
            elems.frame = elems.slidedeck.closest('.lens-' + ns);
            // The slides within the SlideDeck
            elems.horizontalSlides = deck.slides;
            // The vertical slides within the SlideDeck
            elems.verticalSlides = verticalDeck.slides;
            // This decks index indicator elements
            elems.indexIndicators = elems.frame.find('.slidedeck-index-indicator span.total');
            elems.indexIndicators.html( elems.verticalSlides.length );
            elems.currentindexIndicators = elems.frame.find('.slidedeck-index-indicator span.current');
            elems.verticalSlides.each(function(ind){
                $(elems.currentindexIndicators[ind]).html( ind + 1 );
            });
            
            // set vertical scroll option to the same as the parent deck
            if( deck.options.scroll ) {
                verticalDeck.options.scroll = true;
            }else{
                verticalDeck.options.scroll = false;
            }
        var isThumbnailNav = elems.frame.hasClass('sd2-nav-thumb');
            
        var navigation = {};
        navigation.paged = false;
        
        if( !isThumbnailNav ){
            // Only for IE - detect background image url and update style for DD element
            if( $.browser.msie ){
                if( $.browser.version <= 8.0 ){
                    elems.verticalSlides.each(function(ind){
                        if( $(elems.verticalSlides[ind]).css('background-image') != 'none' ){
                            var imgurl = $(elems.verticalSlides[ind]).css('background-image').match( /url\([\"\'](.*)[\"\']\)/ )[1];
                            $(elems.verticalSlides[ind]).css({
                                background: 'none'
                            });
                            elems.verticalSlides[ind].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgurl + "', sizingMethod='scale')";
                        };
                    });
                }
            }
        }
        
        navigation.updateSetNavigation = function(){
            navigation.deckSetNav.removeClass('disabled');
            if( !navigation.currentSetIndex ){
                navigation.deckSetNav.not('.next').addClass('disabled');
            }else if( ( navigation.currentSetIndex + 1 ) == navigation.sets ){
                navigation.deckSetNav.not('.prev').addClass('disabled');
            }
        };
        
        elems.slidedeck.find('.sd2-slide-title').removeClass('accent-color');
        elems.slidedeck.find('.sd2-slide-text a').addClass('accent-color');
        if( !elems.frame.hasClass('content-source-custom') ){
            elems.slidedeck.find('.sd2-node-caption .play-video-alternative').addClass('accent-color-background').removeClass('accent-color');
        }else{
            elems.slidedeck.find('.sd2-node-caption .play-video-alternative').addClass('accent-color');
        }
        
        elems.slidedeck.slidedeck().loaded(function(){
            // check for body classes or options set to add body classes to control navigation
            var isDotNav = elems.frame.hasClass('sd2-nav-dots');
            var isAutoPlay = deck.options.autoPlay;
            var isAutoPlaySnake = elems.frame.hasClass('sd2-autoplay-snake');
            var isAutoPlayHide = elems.frame.hasClass('sd2-autoplay-hide');
            
            // check to see if the autoPlay option is true and if pauseAutoPlay is false - adding class of autoPlay to deck frame
            if( isAutoPlay && !$(slidedeck).slidedeck().pauseAutoPlay ){
                elems.frame.addClass('auto-play');
            }
            // get the current vertical slide index
            navigation.currentVertSlideIndex = verticalDeck.current;
            // add class of 'active' to current vertical slide
            $(verticalDeck.slides[navigation.currentVertSlideIndex]).addClass('active');
            
            // get main deck navigation elements
            navigation.decknavigation = elems.frame.find('.deck-navigation.vertical');
            
            // build and output the vertical navigation elements - instead of using the default verticalSlideNav
            elems.frame.append('<div class="vertical-slide-nav-wrapper"><div class="vertical-slide-nav-elems-wrapper"></div></div>');
            navigation.verticalNavWrapper = elems.frame.find('div.vertical-slide-nav-wrapper');
            navigation.verticalNavElemsWrapper = elems.frame.find('div.vertical-slide-nav-elems-wrapper');
            if( !isThumbnailNav ){
                navigation.verticalNavWrapper.append('<span class="vertical-slide-nav-shadow">&nbsp;</span>');
            }
            
            for( var i=0; i < elems.verticalSlides.length; i++ ){
                var slideNumber = i + 1;
                navigation.verticalNavElemsWrapper.append('<span class="vertical-slide-nav"><a href="#'+ slideNumber +'">'+ slideNumber +'</a></span>');
            }
            
            // assign vars for verticalSlideNav elements
            navigation.verticalNavElems = navigation.verticalNavElemsWrapper.find('span.vertical-slide-nav');
            $(navigation.verticalNavElems[navigation.currentVertSlideIndex]).addClass('active');
            
            navigation.verticalNavLinks = navigation.verticalNavElemsWrapper.find('a');
            // getting height for li-background span element that is inserted into the DOM
            navigation.verticalNavItemHeight = navigation.verticalNavElems.outerHeight(true);
            
            if( !isThumbnailNav ){
                // loop through the verticalSlide count and for each slide, insert a span with class of vertical-slide-nav-background each verticalNavElement
                for( var i=0; i < elems.verticalSlides.length; i++ ){
                    var navBackgroundSpan = $('<span></span>').addClass('vertical-slide-nav-background').css({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: navigation.verticalNavItemHeight,
                        overflow: 'hidden',
                        zIndex: 5
                    }).appendTo( $(navigation.verticalNavElems[i]) );
                    // append 'inner' span to li-background for color and box-shadow inset - sized larger in height to hide bubbling of shadow
                    $('<span class="inner">&nbsp;</span>').css({
                        height: Math.round( navigation.verticalNavItemHeight * 2 ),
                        marginTop: Math.round( navigation.verticalNavItemHeight ) * -1
                    }).appendTo( navBackgroundSpan );
                }
            }
            
            // loop through each verticalSlide link and insert elements as needed - dependent on classes assigned to frame
            navigation.verticalNavLinks.each(function(ind){
                var navHTML;
                if( !isThumbnailNav ){
                    navHTML = ind + 1;
                }else{
                    navHTML = '<span class="slide-nav-inner">'+ (ind + 1) +'</span>';
                }
                // if nav-dots class on frame, insert dot-inner spans into nav links
                if( isDotNav ){
                    navHTML = '<span class="dot-inner">' + navHTML + '</span>';
                }
                $(this).html( navHTML );
                
                // if autoPlay is true and pauseAutoplay is false, insert auto-play-indicatory span(s) - if autoplay-snake class added to frame, use set of 4 spans
                if( isAutoPlay && !$(slidedeck).slidedeck().pauseAutoPlay ){
                    if( !isAutoPlayHide ){
                        var autoPlayIndicator = '<span class="auto-play-indicator accent-color-background">&nbsp;</span>';
                        if( isAutoPlaySnake){
                            autoPlayIndicator = '<span class="auto-play-indicator snake-1 accent-color-background">&nbsp;</span>';
                            autoPlayIndicator += '<span class="auto-play-indicator snake-2 accent-color-background">&nbsp;</span>';
                            autoPlayIndicator += '<span class="auto-play-indicator snake-3 accent-color-background">&nbsp;</span>';
                            autoPlayIndicator += '<span class="auto-play-indicator snake-4 accent-color-background">&nbsp;</span>';
                        }
                        $(this).append( autoPlayIndicator );
                    }
                }
            });
            if( isThumbnailNav ){
            	// Check to prevent JS crash:
            	/**
            	 * If the O-Town height is less than 110px, it causes a
            	 * JavaScript lockup on the page... 
            	 */
            	if( navigation.verticalNavElemsWrapper.height() < 110 ){
            		// Remove the vertical nav wrapper
            		elems.frame.find('.vertical-slide-nav-wrapper').hide();
            		elems.verticalSlides.each(function(){
            			// Set the slide background and slides to have a left position of 0.
            			$(this).find('.slide-content, .sd2-slide-background').css({left: 0});
            		});
            		return false;
            	}
            	
                navigation.verticalNavLinksInner = navigation.verticalNavLinks.find('span.slide-nav-inner');
                var thumbSrc = new Array();
                
                // Add CSS Background Image property to Thumbnail Nav
                elems.verticalSlides.each(function(ind){
                    var $verticalSlide = elems.verticalSlides.eq(ind);
                    thumbSrc[ind] = $verticalSlide.attr('data-thumbnail-src');
                    
                    var $backgroundImageElement = $verticalSlide.find('.sd2-slide-background');
                    var backgroundImage = $backgroundImageElement.css('background-image');

                    if( backgroundImage == undefined ){
                        navigation.verticalNavLinksInner.eq(ind).addClass('no-thumb');
                    } else {
                        // Only for IE - detect background image url and update style for DD element
                        if( $.browser.msie && ($.browser.version <= 8.0)  ){
                            if( backgroundImage != 'none' ){
                                var imgurl = backgroundImage.match( /url\([\"\'](.*)[\"\']\)/ )[1];
                                navigation.verticalNavLinksInner.eq(ind).css({
                                    background: 'none'
                                });
                                if( thumbSrc[ind] ){
                                    navigation.verticalNavLinksInner[ind].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + thumbSrc[ind] + "', sizingMethod='scale')";
                                }else{
                                    navigation.verticalNavLinksInner[ind].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgurl + "', sizingMethod='scale')";
                                }
                                $backgroundImageElement.css({
                                    background: 'none'
                                });
                                $backgroundImageElement[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgurl + "', sizingMethod='scale')";
                            };
                        } else {
                            if( thumbSrc[ind] ){
                                thumbSrc[ind] = thumbSrc[ind];
                            }else{
                                thumbSrc[ind] = backgroundImage;
                            }
                            if( thumbSrc[ind] != 'none' ){
                                navigation.verticalNavLinksInner.eq(ind).css({
                                    'background-image': 'url("' + thumbSrc[ind] + '")'
                                });
                            }
                        }
                    }
                });
            }
            
            // Calculate height and nav elements to see if pagination needs to be inserted and nav elements scaled to fit nav.
            // if the nav height is less than the elements total combined height check to see if the combined min height works
            if( navigation.verticalNavElemsWrapper.height() < (navigation.verticalNavItemHeight * navigation.verticalNavElems.length) ){
                navigation.paged = true;
                
                // Reduce positioning of Nav Wrapper
                if( isThumbnailNav ){
                    navigation.deckSetNavHeight = 52;
                    if( elems.frame.hasClass('sd2-small') ){
                        navigation.deckSetNavHeight = 31;
                    }
                }else{
                    navigation.deckSetNavHeight = 25;
                }
                navigation.verticalNavElemsWrapperTop = navigation.verticalNavElemsWrapper.position().top;
                navigation.verticalNavElemsWrapperWidth = navigation.verticalNavElemsWrapper.width();
                navigation.verticalNavElemsWrapper.css({
                    top: navigation.verticalNavElemsWrapperTop + navigation.deckSetNavHeight,
                    bottom: parseInt(navigation.verticalNavElemsWrapper.css('bottom').replace('px','')) + navigation.deckSetNavHeight
                });
                
                // Insert Buttons into Nav Wrapper for "sets" and update CSS
                elems.frame.append('<a href="#prev-set" class="deck-set-nav prev"><span class="inner">Prev</span></a><a href="#next-set" class="deck-set-nav next"><span class="inner">Next</span></a>');
                
                navigation.deckSetNav = elems.frame.find('a.deck-set-nav');
                
                if( isAutoPlay ){
                    navigation.verticalNavElemsWrapperTop = navigation.verticalNavElemsWrapperTop;
                }
                
                if( isThumbnailNav ){
                    navigation.deckSetNavOffset = 11;
                    if( elems.frame.hasClass('sd2-small') ){
                        navigation.deckSetNavOffset = 1;
                    }
                    $(navigation.deckSetNav[0]).css({
                        top: navigation.deckSetNavOffset
                    });
                    $(navigation.deckSetNav[1]).css({
                        bottom: navigation.deckSetNavOffset
                    });
                }else{
                    $(navigation.deckSetNav[0]).css({
                        top: navigation.verticalNavElemsWrapperTop,
                        paddingTop: navigation.deckSetNavHeight,
                        width: navigation.verticalNavElemsWrapperWidth
                    });
                    $(navigation.deckSetNav[1]).css({
                        bottom:0,
                        paddingTop: navigation.deckSetNavHeight,
                        width: navigation.verticalNavElemsWrapperWidth
                    });
                }
                
                // Reset heights of Nav Wrapper vars
                navigation.verticalNavElemsWrapperHeight = navigation.verticalNavElemsWrapper.height();
                navigation.navsPerSet = Math.floor( navigation.verticalNavElemsWrapperHeight / navigation.verticalNavItemHeight );
                navigation.sets = Math.ceil( navigation.verticalNavElems.length / navigation.navsPerSet );
                navigation.verticalNavElems.wrapAll('<div class="vertical-slide-nav-wrapper-inner"></div>');
                
                navigation.navWrapperInner = navigation.verticalNavElemsWrapper.find('.vertical-slide-nav-wrapper-inner');
                navigation.navWrapperInner.css({
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0
                });
                
                // set vars for use in loop to wrap nav element sets
                var setStartIndex = 0;
                var count = 1;
                var setWrapperHTML = '<div class="vertical-slide-nav-set"></div>'
                
                // for each vertical set, wrap nav elements
                for( var v = 0; v < navigation.sets; v++ ){
                    var navElementsToWrap = navigation.verticalNavElems.slice( setStartIndex, (navigation.navsPerSet * count) );
                    navElementsToWrap.wrapAll( setWrapperHTML );
                    setStartIndex = setStartIndex + navigation.navsPerSet;
                    count++;
                }
                navigation.currentSetIndex = 0;
                navigation.navSets = navigation.verticalNavElemsWrapper.find('.vertical-slide-nav-set');
                
                // get new height of the navigation.verticalNavElemsWrapper and center vertically
                var newHeight = navigation.verticalNavItemHeight * navigation.navsPerSet;
                navigation.verticalNavElemsWrapper.css({
                    height: newHeight,
                    top: '50%',
                    marginTop: ( newHeight / 2 ) * -1
                });
                
                navigation.activeNavParent = navigation.verticalNavElemsWrapper.find('.vertical-slide-nav.active').parent('div');
                // get current active nav element and set parent vertical-slide-nav-set class to 'active'
                navigation.activeNavParent.addClass('active');
                
                // bind click event to prev/next set buttons
                navigation.deckSetNav.bind('click', function(event){
                    event.preventDefault();
                    if( $(this).hasClass('next') ){
                        if( ( navigation.currentSetIndex + 1 ) != navigation.sets ){
                            navigation.currentSetIndex = navigation.currentSetIndex + 1;
                            navigation.navWrapperInner.animate({
                                top: $(navigation.navSets[navigation.currentSetIndex]).position().top * -1
                            }, 500);
                        }else{
                            return false;
                        }
                    }else if( $(this).hasClass('prev') ){
                        if( ( navigation.currentSetIndex ) != 0 ){
                            navigation.currentSetIndex = navigation.currentSetIndex - 1;
                            navigation.navWrapperInner.animate({
                                top: $(navigation.navSets[navigation.currentSetIndex]).position().top * -1
                            }, 500);
                        }else{
                            return false;
                        }
                    }
                    navigation.updateSetNavigation();
                });
                navigation.updateSetNavigation();
            }else{
                if( isThumbnailNav ){
                    // get new height of the navigation.verticalNavElemsWrapper and center vertically
                    var newHeight = navigation.verticalNavItemHeight * navigation.verticalNavElems.length;
                    navigation.verticalNavElemsWrapper.css({
                        height: newHeight,
                        top: '50%',
                        marginTop: ( newHeight / 2 ) * -1
                    });
                }
            }
            
            // function to control the animation of the vertical-slid-nav-indicator element
            var verticalSlideIndicatorUpdate = function(ind){
                navigation.verticalNavElems.removeClass('active');
                $(navigation.verticalNavElems[ind]).addClass('active');

                if( navigation.paged ) {
                    navigation.activeNavParent = navigation.verticalNavElemsWrapper.find('.vertical-slide-nav.active').parent('div');
                    if( !navigation.activeNavParent.hasClass('active') ){
                        navigation.navSets.removeClass('active');
                        navigation.activeNavParent.addClass('active');
                        navigation.currentSetIndex = navigation.navSets.index(navigation.activeNavParent);
                        
                        navigation.navWrapperInner.animate({
                            top: navigation.activeNavParent.position().top * -1
                        }, 500);
                    }
                    navigation.updateSetNavigation();
                }
            }
            
            var disableAutoPlayIndicator = function(){
                // hide auto-play-indicator elements
                navigation.verticalNavLinks.find('span.auto-play-indicator').hide();
                // set isAutoplay to false
                isAutoPlay = false;
                // pause Deck autoplay
                $(slidedeck).slidedeck().pauseAutoPlay = true;
            }
            
            navigation.decknavigation.bind('click', function(event){
                event.preventDefault();
                if( isAutoPlay && !$(slidedeck).slidedeck().pauseAutoPlay ){
                    disableAutoPlayIndicator();
                }
                var index;
                if( $(this).hasClass('prev') ) {
                    if( deck.vertical().current == 0 ){
                        index = -1;
                    }else{
                        index = deck.vertical().current - 1;
                    }
                } else {
                    if( deck.vertical().current == (deck.vertical().slides.length - 1) ){
                        index = -1;
                    }else{
                        index = deck.vertical().current + 1;
                    }
                }
                if( index != -1 ){
                    verticalSlideIndicatorUpdate(index);
                }
            });
            
            navigation.verticalNavLinks.bind('click', function(event){
                event.preventDefault();
                if( isAutoPlay && !$(slidedeck).slidedeck().pauseAutoPlay ){
                    disableAutoPlayIndicator();
                }
                var linkIndex = navigation.verticalNavLinks.index( $(this) );
                navigation.verticalNavLinks.parents('span.vertical-slide-nav').removeClass('active');
                $(this).parents('span.vertical-slide-nav').addClass('active');
                deck.pauseAutoPlay = true;
                deck.vertical().goTo( linkIndex + 1);
            });
            
            
            // animation function to control autoPlay indication
            var animateAutoPlayIndicator = function( ind ){
                if( !isAutoPlayHide ){
                    var navElem = $(navigation.verticalNavLinks[ind]);
                    var easing = 'linear';
                    if( isAutoPlaySnake ){
                        // split interval into 4ths 1/4 for each indicator element
                        var intervalMod = deck.options.autoPlayInterval / 4;
                        
                        var snake1 = navElem.find('span.snake-1');
                        var snake2 = navElem.find('span.snake-2');
                        var snake3 = navElem.find('span.snake-3');
                        var snake4 = navElem.find('span.snake-4');
                        
                        // chain animations for snake elements
                        snake1.animate({
                            width: '100%'
                        }, intervalMod, easing, function(){
                            snake2.animate({
                                height: '100%'
                            }, intervalMod, easing, function(){
                                snake3.animate({
                                    width: '100%'
                                }, intervalMod, easing, function(){
                                    snake4.animate({
                                        height: '100%'
                                    }, intervalMod, easing, function(){
                                        // once animation is completed, reset width and height to 0 for corresponding elements
                                        snake1.add(snake3).css('width', 0);
                                        snake2.add(snake4).css('height', 0); 
                                    });
                                });
                            });
                        });
                    }else{
                        // if normal autoPlay indicator
                        navElem.find('span.auto-play-indicator').animate({
                            width: '100%'
                        }, deck.options.autoPlayInterval, easing, function(){
                            $(this).css('width',0);
                        });
                    }
                }
            };
            
            // Get old before() of the Vertical SlideDeck if it exists, and then set new before() and append old one to it.
            var oldBefore = verticalDeck.options.before;
            verticalDeck.options.before = function(deck){
                if(typeof(oldBefore) == 'function')
                    oldBefore(deck);
                
                // if autoPlay is set to true and not paused, run the animateAutoPlayIndicator() function
                if( isAutoPlay && !$(slidedeck).slidedeck().pauseAutoPlay ){
                    // get next slide index
                    var nextVertSlideIndex = deck.current;
                    // of length is equal to next index - reset to 0
                    if( deck.slides.length == nextVertSlideIndex ){
                        nextVertSlideIndex = 0;
                    }
                    animateAutoPlayIndicator( nextVertSlideIndex );
                    verticalSlideIndicatorUpdate( nextVertSlideIndex );
                }
            };
            
            // Get old complete() of the Vertical SlideDeck if it exists, and then set new complete() and append old one to it.
            var oldComplete = verticalDeck.options.complete;
            verticalDeck.options.complete = function(deck){
                if(typeof(oldComplete) == 'function')
                    oldComplete(deck);
                    
                verticalSlideIndicatorUpdate( deck.current );
            };
            
            // on initial load, if autoPlay is true and not paused, run the animateAutoPlayIndicator() function passing the current vertical Slide index
            if( isAutoPlay && !$(slidedeck).slidedeck().pauseAutoPlay ){
                animateAutoPlayIndicator( navigation.currentVertSlideIndex );
            }
            
            // bind mousewheel event to Deck frame. If scrolled, pauseAutoPlay and hide auto-play-indicator elements
            var hasNotBeenScrolled = true;
            if(typeof($.event.special.mousewheel) != "undefined"){
                elems.frame.bind( 'mousewheel', function(event, mousewheeldelta){
                    if( verticalDeck.options.scroll ){
                        if( hasNotBeenScrolled ){
                            disableAutoPlayIndicator();                         
                            hasNotBeenScrolled = true;
                        }
                        if( mousewheeldelta == 1 ){
                            verticalSlideIndicatorUpdate(deck.vertical().current);
                        }else if( mousewheeldelta == -1 ){
                            verticalSlideIndicatorUpdate(deck.vertical().current);
                        }
                    }
                });
            };
            if( isAutoPlayHide ){
                navigation.verticalNavLinks.find('span.auto-play-indicator').hide();
            }
        });
    };
    
    $(document).ready(function(){
        $('.lens-o-town .slidedeck').each(function(){
            if(typeof($.data(this, 'lens-o-town')) == 'undefined' || $.data(this, 'lens-o-town') == null){
                $.data(this, 'lens-o-town', new SlideDeckSkin['o-town'](this));
            }
        });
    });
})(jQuery);