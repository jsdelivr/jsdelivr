// Utility for creating objects in older browsers
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {}
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {
	var Slider = {
		//initialize
		init: function( options, elem ) {
			var self = this;

			//remove no JavaScript warning
			$("body").removeClass("coda-slider-no-js");

			//add preloader class (backwards compatible)
			$('.coda-slider').prepend('<p class="loading">Loading...<br /><img src="./img/ajax-loader.gif" width="220" height="19" alt="loading..." /></p>');

			// Cache the element
			self.elem = elem;
			self.$elem = $( elem );

			// Cache the ID and class. This allows for multiple instances with any ID name supplied
			self.sliderId = '#' + ( self.$elem ).attr('id');
			
			// Set the options
			self.options = $.extend( {}, $.fn.codaSlider.options, options );
			
			// Cache the ID and class. This allows for multiple instances with any ID name supplied
			self.sliderId = '#' + ( self.$elem ).attr('id');
			
			// Build the tabs and navigation
			self.build();

			// Start auto slider
			if (self.options.autoSlide) {self.autoSlide();}

			self.events();

			// Test the preloader (image doesn't load)
			//alert("Testing preloader");

			// Kill the preloader
			$("p.loading").remove();

		},
		build: function() {
			var self = this;

			// Wrap the entire slider (backwards compatible)
			if ( $(self.sliderId).parent().attr('class') != 'coda-slider-wrapper' ) {$(self.sliderId).wrap('<div id="' + ( self.$elem ).attr('id') + '-wrapper" class="coda-slider-wrapper"></div>'); }
			
			// Add the .panel class to the individual panels (backwards compatable)
			self.panelClass = self.sliderId + ' .' + $(self.sliderId + " > div").addClass('panel').attr('class');
			
			// Wrap all panels in a div, and wrap inner content in a div (backwards compatible)
			$(self.panelClass).wrapAll('<div class="panel-container"></div>');
			if ( $(self.panelClass).children().attr('class') != 'panel-wrapper' ) { $(self.panelClass).wrapInner('<div class="panel-wrapper"></div>'); }
			self.panelContainer = ($(self.panelClass).parent());

			// Store current tab
			self.currentTab = self.options.firstPanelToLoad - 1;

			// Apply starting height to the container
			if (self.options.autoHeight) { $(self.sliderId).css('height', $($(self.panelContainer).children()[self.currentTab]).height() + $(self.sliderId + '-wrapper .coda-nav-right').height());	}

			// Build navigation tabs
			if (self.options.dynamicTabs) { self.addNavigation(); }

			// Build navigation arrows
			if (self.options.dynamicArrows) { self.addArrows(); }

			// Create a container width to allow for a smooth float right.
			self.totalSliderWidth = $(self.sliderId).outerWidth(true) + $($(self.sliderId).parent()).children('[class^=coda-nav-left]').outerWidth(true) + $($(self.sliderId).parent()).children('[class^=coda-nav-right]').outerWidth(true);
			$($(self.sliderId).parent()).css('width', self.totalSliderWidth);

			// Align navigation tabs
			if (self.options.dynamicTabs) { self.alignNavigation(); }

			// Clone panels if continuous is enabled
			if (self.options.continuous) {
				$(self.panelContainer).prepend($(self.panelContainer).children().last().clone());
				$(self.panelContainer).append($(self.panelContainer).children().eq(1).clone());
			}

			// Allow the slider to be clicked
			self.clickable = true;

			// Count the number of panels and get the combined width
			self.panelCount = $(self.panelClass).length;
			self.panelWidth = $(self.panelClass).outerWidth();
			self.totalWidth = self.panelCount * self.panelWidth;
			
			// Variable for the % sign if needed (responsive), otherwise px
			self.pSign = 'px';

			self.slideWidth = $(self.sliderId).width();

			// Puts the margin at the starting point with no animation. Made for both continuous and firstPanelToLoad features.
			// ~~(self.options.continuous) will equal 1 if true, otherwise 0
			$(self.panelContainer).css('margin-left', ( -self.slideWidth * ~~(self.options.continuous)) + (-self.slideWidth * self.currentTab) );

			// Configure the current tab
			self.setCurrent(self.currentTab);

			// Apply the width to the panel container
			$(self.sliderId + ' .panel-container').css('width', self.totalWidth);

		},

		addNavigation: function(){
			var self = this;
			// The id is assigned here to allow for the responsive setting
			var dynamicTabs = '<div class="coda-nav"><ul></ul></div>';

			// Add basic frame
			if (self.options.dynamicTabsPosition === 'bottom') { $(self.sliderId).after(dynamicTabs); }
			else{ $(self.sliderId).before(dynamicTabs); }

			// Add labels
			$.each(
				(self.$elem).find(self.options.panelTitleSelector), function(n) {
					$($(self.sliderId).parent()).find('.coda-nav ul').append('<li class="tab' + (n+1) + '"><a href="#' + (n+1) + '" title="' + $(this).text() + '">' + $(this).text() + '</a></li>');
				}
			);
		},

		alignNavigation: function() {
			var self = this;
			self.totalNavWidth = 0;
			var arrow = '';

			if (self.options.dynamicArrowsGraphical) {arrow = '-arrow';}

			// Set the alignment
			if (self.options.dynamicTabsAlign != 'center') {
				$($(self.sliderId).parent()).find('.coda-nav ul').css(
					'margin-' + self.options.dynamicTabsAlign,
					// Finds the width of the aarows and the margin
						$($(self.sliderId).parent()).find(
							'.coda-nav-' +
							self.options.dynamicTabsAlign +
							arrow
						).outerWidth(true) + parseInt($(self.sliderId).css('margin-'+ self.options.dynamicTabsAlign), 10)
				);
				$($(self.sliderId).parent()).find('.coda-nav ul').css('float', self.options.dynamicTabsAlign); // couldn't combine this .css() with the previous??
			}
			else {
				// Get total width of the navigation tabs and center it
				$($(self.sliderId).parent()).find('.coda-nav li a').each(function(){self.totalNavWidth += $(this).outerWidth(true); });
				if ($.browser.msie) { self.totalNavWidth = self.totalNavWidth + (5);} // Simple IE fix
				$($(self.sliderId).parent()).find('.coda-nav ul').css('width', self.totalNavWidth + 1);
			}
		},

		addArrows: function(){
			var self = this;
			$(self.sliderId).parent().addClass("arrows");
			if(self.options.dynamicArrowsGraphical){
				$(self.sliderId).before('<div class="coda-nav-left-arrow" data-dir="prev" title="Slide left"><a href="#"></a></div>');
				$(self.sliderId).after('<div class="coda-nav-right-arrow" data-dir="next" title="Slide right"><a href="#"></a></div>');
			}
			else{
				$(self.sliderId).before('<div class="coda-nav-left" data-dir="prev" title="Slide left"><a href="#">' + self.options.dynamicArrowLeftText + '</a></div>');
				$(self.sliderId).after('<div class="coda-nav-right" data-dir="next" title="Slide right"><a href="#">' + self.options.dynamicArrowRightText + '</a></div>');
			}
		},

		events: function(){
			var self = this;
			// CLick arrows
			$($(self.sliderId).parent()).find('[class^=coda-nav-]').on('click', function(e){
				// These prevent clicking when in continuous mode, which would break it otherwise.
				if (!self.clickable && self.options.continuous) {return false;}
				self.setCurrent($(this).attr('class').split('-')[2]);
				if (self.options.continuous) {self.clickable = false;}
				return false;
			});
			// Click tabs
			$($(self.sliderId).parent()).find('[class^=coda-nav] li').on('click', function(e){
				if (!self.clickable && self.options.continuous) {return false;}
				self.setCurrent(parseInt( $(this).attr('class').split('tab')[1], 10) - 1 );
				if (self.options.continuous) {self.clickable = false;}
				return false;
			});
			// Click cross links
			$('[data-ref*=' + (self.sliderId).split('#')[1] + ']').on('click', function(e){
				if (!self.clickable && self.options.continuous) {return false;}
				// Stop and Play controls
				if (self.options.autoSlideControls) {
					if ($(this).attr('name') === 'stop') {
						$(this).html(self.options.autoSlideStartText).attr('name', 'start');
						clearTimeout(self.autoslideTimeout);
						return false;
					}
					if ($(this).attr('name') === 'start') {
						$(this).html(self.options.autoSlideStopText).attr('name', 'stop');
						self.setCurrent(self.currentTab + 1);
						self.autoSlide();
						return false;
					}
				}
				self.setCurrent( parseInt( $(this).attr('href').split('#')[1] -1, 10 ) );
				if (self.options.continuous) {self.clickable = false;}
				if (self.options.autoSlideStopWhenClicked) { clearTimeout(self.autoslideTimeout); }
				return false;
			});
			// Click to stop autoslider
			$($(self.sliderId).parent()).find('*').on('click', function(e){
				// AutoSlide controls.
				if (self.options.autoSlideControls && autoSlideStopWhenClicked) {
					$('body').find('[data-ref*=' + (self.sliderId).split('#')[1] + '][name=stop]').html(self.options.autoSlideStartText);
					clearTimeout(self.autoslideTimeout);
				}
				if (!self.clickable && self.options.continuous) {
					if (self.options.autoSlideStopWhenClicked) { clearTimeout(self.autoslideTimeout); }
					return false;
				}
				if (self.options.autoSlide) {
					// Clear the timeout
					if (self.options.autoSlideStopWhenClicked) { clearTimeout(self.autoslideTimeout); }
					else {
						self.autoSlide(clearTimeout(self.autoslideTimeout));
						self.clickable = true;
					}
				}
				// Stops from speedy clicking for continuous sliding.
				if (self.options.continuous) {clearTimeout(self.continuousTimeout);}
			});
		},

		setCurrent: function( direction ){
			var self = this;
			if (self.clickable) {
			
				if (typeof direction == 'number') {	self.currentTab = direction;	}
				else {
					// "left" = -1; "right" = 1;
					self.currentTab += ( ~~( direction === 'right' ) || -1 );
					// If not continuous, slide back at the last or first panel
					if (!self.options.continuous){
						self.currentTab = (self.currentTab < 0) ? this.panelCount - 1 : (self.currentTab % this.panelCount);
					}
				}
				// This is so the height will match the current panel, ignoring the clones.
				// It also adjusts the count for the "currrent" class that's applied
				if (self.options.continuous) {
					self.panelHeightCount = self.currentTab + 1;
					if (self.currentTab === self.panelCount - 2){self.setTab = 0;}
					else if (self.currentTab === -1) {self.setTab = self.panelCount - 3;}
					else {self.setTab = self.currentTab;}
				}
				else{
					self.panelHeightCount = self.currentTab;
					self.setTab = self.currentTab;
				}
				// Add and remove current class.
				$($(self.sliderId).parent()).find('.tab' + (self.setTab + 1) + ' a:first')
				.addClass('current')
				.parent().siblings().children().removeClass('current');
			
				this.transition();
			}
		},
		
		transition: function(){
			var self = this;
			// Adjust the height
			if (self.options.autoHeight) {
				$(self.panelContainer).parent().animate({
					'height': $($(self.panelContainer).children()[self.panelHeightCount]).height()
				}, {
					easing: self.options.autoHeightEaseFunction,
					duration: self.options.autoHeightEaseDuration,
					queue: false
					});
			}
			
			// Adjust the margin for continuous sliding
			if (self.options.continuous) {self.marginLeft = -(self.currentTab * self.slideWidth ) - self.slideWidth;}
			// Otherwise adjust as normal
			else {self.marginLeft = -(self.currentTab * self.slideWidth ); }
			// Animate the slider
			(self.panelContainer).animate({
				'margin-left': self.marginLeft + self.pSign
			}, {
				easing: self.options.slideEaseFunction,
				duration: self.options.slideEaseDuration,
				queue: false,
				complete: self.continuousSlide(self.options.slideEaseDuration + 50)
			});
		},

		autoSlide: function(){
			var self = this;
			// Can't set the autoslide slower than the easing ;-)
			if (self.options.autoSlideInterval < self.options.slideEaseDuration) {
				self.options.autoSlideInterval = (self.options.slideEaseDuration > self.options.autoHeightEaseDuration) ? self.options.slideEaseDuration : self.options.autoHeightEaseDuration;
			}
			if (self.options.continuous) {self.clickable = false;}
			self.autoslideTimeout = setTimeout(function() {
				// Slide left or right
				self.setCurrent( self.options.autoSliderDirection );
				self.autoSlide();

			}, self.options.autoSlideInterval);
		},

		continuousSlide: function (delay){
			var self = this;

			if (self.options.continuous) {
				self.continuousTimeout = setTimeout(function() {

					// If on the last panel (the clone of panel 1), set the margin to the original.
					if (self.currentTab === self.panelCount - 2){
						$(self.panelContainer).css('margin-left', -self.slideWidth + self.pSign);
						self.currentTab = 0;
					}
					// If on the first panel the clone of the last panel), set the margin to the original.
					else if (self.currentTab === -1){
						$(self.panelContainer).css('margin-left', -( ((self.slideWidth * self.panelCount) - (self.slideWidth * 2))) + self.pSign );
						self.currentTab = (self.panelCount - 3);
					}
					self.clickable = true;
				}, delay);
			}
			else{self.clickable = true;}
		}
	};
	
	$.fn.codaSlider = function( options ) {
		return this.each(function() {
			
			var slider = Object.create( Slider );
			slider.init( options, this );

		});
	};
	
	$.fn.codaSlider.options = {
		autoHeight: true,
		autoHeightEaseDuration: 1500,
		autoHeightEaseFunction: "easeInOutExpo",
		autoSlide: false,
		autoSliderDirection: 'right',
		autoSlideInterval: 7000,
		autoSlideControls: false,
		autoSlideStartText: 'Start',
		autoSlideStopText: 'Stop',
		autoSlideStopWhenClicked: true,
		continuous: true,
		crossLinking: true, // No longer used
		dynamicArrows: true,
		dynamicArrowsGraphical: false,
		dynamicArrowLeftText: "&#171; left",
		dynamicArrowRightText: "right &#187;",
		dynamicTabs: true,
		dynamicTabsAlign: "center",
		dynamicTabsPosition: "top",
		externalTriggerSelector: "a.xtrig", //shouldnt need any more
		firstPanelToLoad: 1,
		panelTitleSelector: "h2.title",
		slideEaseDuration: 1500,
		slideEaseFunction: "easeInOutExpo"
	};

})( jQuery, window, document );