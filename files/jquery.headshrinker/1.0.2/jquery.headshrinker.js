/*! *******
 *
 * jQuery HeadShrinker v1.0.2
 * Copyright (C) 2013 Chris Wharton (chris@weare2ndfloor.com)
 * View the more at https://github.com/weare2ndfloor/HeadShrinker
 *
 ********* */
 
/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * THIS SOFTWARE AND DOCUMENTATION IS PROVIDED "AS IS," AND COPYRIGHT
 * HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY OR
 * FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE SOFTWARE
 * OR DOCUMENTATION WILL NOT INFRINGE ANY THIRD PARTY PATENTS,
 * COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.COPYRIGHT HOLDERS WILL NOT
 * BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL
 * DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENTATION.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://gnu.org/licenses/>.
 *
 */
(function ($) {
	"use strict";
    $.fn.headshrinker = function (options) {
        var defaults = {
            target: jQuery(this), // set target
            zindex: 99999, // set CSS z-index
            shrinkBy: 2, // shrink by this multiple
            fontSize: "", // add font size in here
            shrinkMenu: false, // convert menu to hamburger in all instances
            revealAlign: "right", // left or right hamburger menu
            revealTop: "12px", // adjust top positioning of hamburger menu
            shrinkMenuTop: "69px", // adjust top positioning of the flyout menu
            menuSwitch: 768, // aimed at the mobile experience, when menu is this width, convert to hamburger
            navTarget: 'nav', // this is the element WITHIN the cloned headshrinker bar
            mobileMenu: false // set to true if you want to remove the desktop menu and replace with headshrinker when in mobile view (menuSwitch)
        };
        var options = $.extend(defaults, options);
        
        return this.each(function () {
            var target = options.target;
            var zindex = options.zindex;
            var shrinkBy = options.shrinkBy;
            var fontSize = options.fontSize;
            var shrinkMenu = options.shrinkMenu;
            var revealAlign = options.revealAlign;
            var revealTop = options.revealTop;
            var shrinkMenuTop = options.shrinkMenuTop;
            var menuSwitch = options.menuSwitch;
            var navTarget = options.navTarget;
            var mobileMenu = options.mobileMenu;
            
            // non-options related variables
            var scrollTimeout = "";
            var $window = jQuery(window);
            
            function headShrinker() {
        
        		// add css class to body, in case CSS overrides need to happen
        		jQuery('body').addClass('headshrinker');
				
				var headShrink = jQuery(target).clone().css( "position" , "fixed" ).addClass('headshrunk'),
				timeout,
				headerHeight = jQuery('header').outerHeight(),
				windowWidth = window.innerWidth || document.documentElement.clientWidth;
				
				// use window load to grab sizes (this doesn't work on document.ready)
				$window.load(function() {
				
					// grab image size and divide it by option
					var imgWidth = jQuery( 'img' , headShrink).outerWidth()/shrinkBy;
					var imgHeight = jQuery( 'img' , headShrink).outerHeight()/shrinkBy;
					jQuery(' img' , headShrink).attr( "width" , imgWidth ).attr( "height" , imgHeight );

					// grab top/bottom margins & paddings and resize
					var paddingTopMain = jQuery(headShrink).css( 'padding-top').replace( 'px' , '' ).replace( 'em' , '' );
					var paddingBottomMain = jQuery(headShrink).css( 'padding-bottom').replace( 'px' , '' ).replace( 'em' , '' );
					jQuery(headShrink).css( 'padding-top' , paddingTopMain/shrinkBy );
					jQuery(headShrink).css( 'padding-bottom' , paddingBottomMain/shrinkBy );
					
					jQuery(' *' , headShrink).each(function (){
					
						var paddingTop = jQuery(this).css( 'padding-top').replace( 'px' , '' ).replace( 'em' , '' );
						var paddingBottom = jQuery(this).css( 'padding-bottom').replace( 'px' , '' ).replace( 'em' , '' );
						var marginTop = jQuery(this).css( 'margin-top').replace( 'px' , '' ).replace( 'em' , '' );
						var marginBottom = jQuery(this).css( 'margin-bottom').replace( 'px' , '' ).replace( 'em' , '' );
						jQuery(this).css( 'padding-top' , paddingTop/shrinkBy );
						jQuery(this).css( 'padding-bottom' , paddingBottom/shrinkBy );
						jQuery(this).css( 'margin-top' , marginTop/shrinkBy );
						jQuery(this).css( 'margin-top' , marginBottom/shrinkBy );
						
					});
				
				}); // end window load
				
				// set up the cloned header shrink and control show / hide
				headShrink
				.css('width', windowWidth)
				.prependTo('body');
				
				var shrinkHeight = headShrink.outerHeight();
				
				headShrink
				.css('top', -shrinkHeight)
				.css( 'z-index' , zindex );
				
				function showNav() {
					headShrink
					.css( 'display' , 'block' )
					.stop()
					.animate({
						top: 0
						}, 500);
				}
				
				function hideNav() {
					if(windowWidth >= menuSwitch) {
						if( headShrink.css('display') === 'none' ) {
							return false;
						} else {
							headShrink
								.stop()
								.animate({
								top: -shrinkHeight
								}, 300, function() {
								headShrink
								.css( 'display' , 'none' );
							});
						}
					}
				}
				
				// detect the scroll movement
				function scrollFinish() {
					clearTimeout( timeout );
					timeout = setTimeout( onScroll, 25 );
				}
				
				function onScroll() {
					var windowTop = $window.scrollTop();
					windowWidth = window.innerWidth || document.documentElement.clientWidth;
					
					headShrink.css('width', windowWidth);
				
					if( windowTop >= shrinkHeight - 25 ) {
						showNav();
					} else {
						hideNav();
					}
				}
				
				//shrink font size if set
				if ( fontSize ) {
				
					jQuery(' *' , headShrink).each(function (){
					
						jQuery(this).css( 'font-size' , fontSize );
					
					});
				
				}
				
				// deal with shrunken menu
				var shrinkMenuContents = jQuery(navTarget , headShrink).hide().html();
				
				function shrinkMenu() {
					
					// reset everything
					jQuery('.headshrinker-reveal' , headShrink).remove();
					jQuery('.headshrinker-menu' , headShrink).remove();
					jQuery(navTarget , headShrink).hide();
					
					if ( shrinkMenu === true || windowWidth <= menuSwitch ) {
					
						jQuery(headShrink).append('<a class="headshrinker-reveal hs-reveal-'+ revealAlign +'" href="#nav" style="top:'+ revealTop +'px !important">Show Menu</a><div class="headshrinker-menu" />');
						
						
						jQuery('.headshrinker-menu' , headShrink).css('top' , shrinkMenuTop).css('max-height',$window.height()).html(shrinkMenuContents).hide();
						
						// Expandable children
						jQuery('.headshrinker-menu ul ul' , headShrink).each(function() {
							
					        if(jQuery(this).children().length){
					        	jQuery(this).hide();
					            jQuery(this,'li:first').parent().append('<a class="headshrinker-expand" href="#">+</a>');                               
					        }
					        
					    });
						    
						jQuery('.headshrinker-expand').on("click",function(e){
							e.preventDefault();
						    if (jQuery(this).hasClass("headshrinker-clicked")) {
						    	jQuery(this).text('+');
						    	jQuery(this).prev('ul').slideUp(300, function(){});
						    } else {
						    	jQuery(this).text('-');
						    	jQuery(this).prev('ul').slideDown(300, function(){});
						    }   
						    	jQuery(this).toggleClass("headshrinker-clicked"); 
						});     
						
						// Set up expand/hide link
						jQuery('.headshrinker-reveal' , headShrink).html('<span /><span /><span />');
						
						jQuery('.headshrinker-reveal' , headShrink).on( "click" , function(e) {
						
							e.preventDefault();						
							jQuery(this).toggleClass('.headshrinker-on');
							jQuery('.headshrinker-menu' , headShrink).toggle();
							
						});
						
					} else {
						jQuery(navTarget , headShrink).show();
					}
					
					if ( mobileMenu === true && windowWidth <= menuSwitch ) {
						target.hide();
						showNav();
						jQuery('body')
						.animate({
							marginTop: shrinkMenuTop
							}, 500);
					} else {
						target.show();
						jQuery('body')
						.animate({
							marginTop: 0
							}, 100);
					}
					
				}
				shrinkMenu();
				
				// scroll & resize events
				$window.on('scroll', scrollFinish);
				$window.on('resize', scrollFinish);
				$window.on('resize', shrinkMenu);
	            
            }            
            
           // run main function on load
           headShrinker(); 
           
        });
    };
})(jQuery);