/**
 *  Slider Kit v1.9.2 - Sliding contents with jQuery
 *  http://www.kyrielles.net/sliderkit
 *  
 *  Copyright (c) 2010-2012 Alan Frog
 *  Licensed under the GNU General Public License
 *  See <license.txt> or <http://www.gnu.org/licenses/>
 *  
 *  Requires: jQuery v1.3+ <http://jquery.com/>
 *
 *  ---------------------------------
 *  This file is part of Slider Kit jQuery plugin.
 *  
 *  Slider Kit is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  Slider Kit is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  ---------------------------------
 */

(function($){

	SliderKit = function() {
		
		var self = this;
		
		this._init = function( element, options ) {		
			
			/*---------------------------------
			 *  Basic settings
			 *---------------------------------*/

			// Passed in options and default options are mixed
			this.options = $.extend({}, this._settings, options);
			
			// CSS class names
			this.cssNames = {
				selected: this.options.cssprefix+"-selected",			
				panel: this.options.cssprefix+"-panel",
				panels: this.options.cssprefix+"-panels",
				panelActive: this.options.cssprefix+"-panel-active",
				panelOld: this.options.cssprefix+"-panel-old",
				panelsWrapper: this.options.cssprefix+"-panels-wrapper",
				nav: this.options.cssprefix+"-nav",
				navClip: this.options.cssprefix+"-nav-clip",
				navBtn: this.options.cssprefix+"-nav-btn",
				navPrev: this.options.cssprefix+"-nav-prev",
				navNext: this.options.cssprefix+"-nav-next",
				btnDisable:this.options.cssprefix+"-btn-disable",
				btnPause: this.options.cssprefix+"-pause-btn",
				goPrev: this.options.cssprefix+"-go-prev",
				goNext: this.options.cssprefix+"-go-next",				
				playBtn: this.options.cssprefix+"-play-btn",
				goBtns: this.options.cssprefix+"-go-btn"
			};

			// Save the element reference
			this.domObj = $( element ); // The main container DOM element
			
			// Getting main elements (panels & nav)
			this.panels = $("."+this.cssNames.panel, this.domObj);
			this.allItems = this.panels.size();
			this.nav = $("."+this.cssNames.nav, this.domObj);
			this.navClip = $("."+this.cssNames.navClip, this.nav);
			
			// Check if there is any reason to go further
			this.arePanels = this.allItems > 0 ? 1 : 0;
			this.isNavClip = this.navClip.size() > 0 ? 1 : 0;
			
			if( !this.arePanels && !this.isNavClip ){
				this._errorReport( "Error #01", this.options.debug, 1 );
			}
			
			this.domObjHeight = this.domObj.height();
			this.domObjWidth = this.domObj.width();
			
			// Check if there is a height value (unless 'freeheight' setting is true)
			if( !this.domObjHeight && !this.options.freeheight ){
				this.domObjHeight = this.options.height;
				this.domObj.css ( 'height', this.domObjHeight );
				this._errorReport( "Error #02", this.options.debug, 0 );
			}
			// Or a width value
			if( !this.domObjWidth ){
				this.domObjWidth = this.options.width;
				this.domObj.css ( 'width', this.domObjWidth );
				this._errorReport( "Error #02", this.options.debug, 0 );
			}
			
			// By default, the widget should be hidden via CSS. Then shown only if javascript is available :
			this.domObj.css( 'display', 'block' );
	
			// Variables that will be needed all over the script			
			this.currId = 0;
			this.prevId = 0;
			this.newId = 0;
			this.currPanel = null;
			this.prevPanel = 0;
			this.prevPanelStill = 0;
			this.firstTime = 1;
			this.scrollActive = 0;
			this.isPlaying = null;
			this.changeOngoing = false;
			this.currLine = 1;
			this.animating = false;
			this.panelAnteFns = new Array;
			this.panelPostFns = new Array;
			this.navAnteFns = new Array;
			this.navPostFns = new Array;
			this.runningScope = this.nav;
			
			// Nav builder			
			if(this.isNavClip){
				this._buildNav();
			}
			
			// Controls builder
			this._buildControls();
			
			// Panels wrapper : this is only for internal code usage;
			// It allows a nice sliding effect in the panels container
			if( this.arePanels ){
				this.panelsBag = $("."+ this.cssNames.panels, this.domObj);
				if( this.options.panelfx == "sliding" ){
					this._wrapPanels();
				}
			}

			/*---------------------------------
			 *  Navigation settings
			 *---------------------------------*/
			
			// In carousel mode (no panels), mousewheel and autoscroll should move lines instead of thumbnails. This behaviour is also set for 'navpanelautoswitch' option.
			this.lineScrollDo = !this.arePanels ? 1 : 0;

			// Mousewheel navigation
			if(this.options.mousewheel){
				this.domObj.mousewheel(function(event, delta){
					delta > 0 ? self.stepBackward() : self.stepForward();
					return false;
				});
			}

			// Keyboard navigation (beta)
			if( this.options.keyboard ){
				this.domObj.keyup(function(event){
					// slide left
					if(event.keyCode == 37){
						self.stepBackward();
					}					
					// slide right
					else if (event.keyCode == 39){
						self.stepForward();
					}
				});
			}

			// One-click navigation
			if(this.options.panelclick && this.arePanels){			
				this.panelsBag.click(function(){
					self.stepForward();
					return false;
				});
			}

			// Sarting id
			this.startId = this.options.start >= this.allItems ? this.allItems-1 : this.options.start < 0 ? 0 : this.options.start;
			
			/*---------------------------------
			 *  Add-ons
			 *---------------------------------*/
			
			// Counter
			if( this.options.counter ){
				try{ this.Counter(); }
				catch( err ){
					this._errorReport(err, this.options.debug, 0);
				} 
			}
			
			// ImageFx
			if( this.imageFx ){
				try{ this.imageFx(); }
				catch( err ){
					this._errorReport(err, this.options.debug, 0);
				}
			}
			
			// DelayCaptions
			if( this.options.delaycaptions ){
				try{ this.DelayCaptions( this.options.delaycaptions ); }
				catch( err ){
					this._errorReport(err, this.options.debug, 0);
				}
			}
			
			// Slide for the first time
			this.changeWithId( this.startId, null );
					
			/*---------------------------------
			 *  Time options
			 *---------------------------------*/

			// Auto-scrolling starter
			if(this.options.auto){
				this.autoScrollStart();
			
				// Stops autoScrolling when mouse is over the slider content
				this._autoScrollHoverStop();		
			}
			 
			// Timer load
			if( this.options.timer ){
				try{ this.Timer( this.options.timer ); }
				catch( err ){
					this._errorReport(err, this.options.debug, 0);
				}
			}
			
			/*---------------------------------
			 *  Running scope
			 *---------------------------------*/
			if( this.arePanels && !this.options.fastchange ){
				this.runningScope = this.domObj.find( '.' + this.cssNames.panels, '.' + this.cssNames.nav );
			}
			
			// return this so we can chain/use the bridge with less code.
			return this;
		};
		
		this._settings = {
			cssprefix:"sliderkit",
			width:500,
			height:350,
			start:0,
			auto:true,
			autospeed:4000,
			autostill:false,
			mousewheel:false,
			keyboard:false,
			circular:false,
			shownavitems:5,
			navitemshover:false,
			navclipcenter:false,
			navcontinuous:false,
			navscrollatend:false,
			navpanelautoswitch:true,
			navfx:"sliding",
			navfxbefore:function(){},
			navfxafter:function(){},
			scroll:null,
			scrollspeed:600,
			scrolleasing:null,
			panelfx:"fading",
			panelfxspeed:700,
			panelfxeasing:null,
			panelfxfirst:"none",
			panelfxbefore:function(){},
			panelfxafter:function(){},
			panelbtnshover:false,
			panelclick:false,
			verticalnav:false,
			verticalslide:false,
			tabs:false,
			freeheight:false,
			fastchange:true,
			counter:false,
			delaycaptions:false,
			timer:false,
			imagefx:false,
			debug:false
		};
		
		this._errorReport = function( errorCode, debug, stop ){
			if(debug){
				alert("Slider Kit error!\nMessage = "+errorCode+" (see doc for details)\nElement id = "+this.domObj.attr("id")+"\nElement class = "+this.domObj.attr("class"));
			}
			if(stop){
				return false;
			}
		};
		
		this._autoScrollHoverStop = function(){
		
			// Stop auto-scrolling when mouse goes over the slider
			if( !this.isPlayBtn && !this.options.autostill ){
				this.domObj.hover(
					function(){
						if( self.isPlaying!=null ){
							self.autoScrollStop();
						}
					},
					function(){
						self.autoScrollStart();
					}
				);
			}
			
			// Restart auto-scrolling on mouse leave if 'autostill' is on
			if( this.options.autostill ){
				this.domObj.mouseleave(function(){
					if( self.isPlaying == null ){
						self.autoScrollStart();
					}
				});
			}
		};
		
		this._buildNav = function() {

			this.navUL = $("ul", this.navClip);
			this.navLI = $("li", this.navUL);
			this.navLINum = this.navLI.size();
			
			// Check if nav size is equal to panels size (only if there are panels)
			if(this.arePanels && (this.navLINum != this.allItems) && this.nav.size() == 1){
				this._errorReport("Error #03", this.options.debug, 1);
			}
			
			// If Slider Kit is used as a tabs menu, the nav scroll becomes useless (well, for now...)
			if(this.options.tabs){
				this.options.shownavitems = this.allItems;
			}

			// Else we start initializing the carousel
			else{
				// LI margins function: returns the <li> tag margins value in pixels
				function getLImargin(attr){
					attrVal = self.navLI.css(attr);
					if(attrVal!="auto" && attr!="" && attr!="0px"){
						return parseInt(attrVal);
					}
					else return 0;
				}

				// Nav elements size
				var navSize = this.options.verticalnav ? this.nav.height() : this.nav.width();
				var navLIWidth = this.navLI.outerWidth(true); // padding + margin + border
				var navLIHeight = this.navLI.outerHeight(true);
				var navLIextHMarg = getLImargin("margin-left") + getLImargin("margin-right");
				var navLIextVMarg = getLImargin("margin-top") + getLImargin("margin-bottom");

				// bugfix 2011 01 13
				this.allItems = this.navLINum;
				if( this.options.shownavitems > this.allItems ){
					this.options.shownavitems = this.navLINum;
				}
				
				this.navLIsize = this.options.verticalnav ? navLIHeight : navLIWidth;
				this.navULSize = this.navLIsize * this.navLINum;
				this.navClipSize = (this.options.shownavitems * this.navLIsize) - (this.options.verticalnav ? navLIextVMarg : navLIextHMarg);// Removes the item side margins to center the nav clip

				// CSS attributes for position/height values
				this.cssPosAttr = this.options.verticalnav ? "top" : "left";
				var cssSizeAttr = this.options.verticalnav ? "height" : "width";
				var cssSizeAttrr = this.options.verticalnav ? "width" : "height";

				// Setting height and width values(px) to Clip, UL & LI tags
				this.navLI.css({width:this.navLI.width(), height:this.navLI.height()});
				this.navUL.css(cssSizeAttr, this.navULSize+"px");
				this.navClip.css({width:this.options.verticalnav ? navLIWidth : this.navClipSize, height:this.options.verticalnav ? this.navClipSize : navLIHeight});

				// Center the navclip in the nav container
				if(this.options.navclipcenter){
					this.navClip.css(this.cssPosAttr,( navSize - this.navClipSize)/2 ).css("margin", "0");
				}

				// Check if linescroll is necessary
				// The nav scrolling is required only if the number of items is greater than the 'visible' param.
				if( this.allItems > this.options.shownavitems ){
					this.scrollActive = true;

					// Correcting a potentially 'this.options.scroll' wrong value
					if(this.options.scroll == null || this.options.scroll < 0 || this.options.scroll > this.allItems){
						this.options.scroll = this.options.shownavitems;
					}

				}
				
				// bugfix 2011 01 13
				// Nav Buttons
				this.navBtns = $( '.' +this.cssNames.navBtn, this.nav );
				if( this.navBtns.size() > 0 ){
					this._buildNavButtons();
				}
			}
			
			// Nav <li> links mouse event
			if(this.options.navitemshover && this.arePanels){
				this.navLI.mouseover(function(){
					self.changeWithId(getIndex(this, "li"), $(this));
				});
			}
			else if(this.arePanels || this.options.navscrollatend){
				this.navLI.click(function(){
					self.changeWithId(getIndex(this, "li"), $(this));
					return false;
				});
			}
			
			// Get an item index
			function getIndex(item, tag){
				return $(tag, $(item).parent()).index(item);
			}
			
		};
		
		this._buildNavButtons = function() {
			
			// bugfix 2011 01 13
			if( this.scrollActive ){
				this.scrollBtns = true;
				this.navBtnPrev = $("."+this.cssNames.navPrev, this.nav);
				this.navBtnNext = $("."+this.cssNames.navNext, this.nav);
				this.navBtns.removeClass( this.cssNames.btnDisable );

				// Nav Buttons click event
				this.navBtnPrev.click(function(){
					self.navPrev();
					return false;
				});
				this.navBtnNext.click(function(){
					self.navNext();
					return false;
				});

				// Nav Buttons mousedown/up events
				if(this.options.navcontinuous){
					this.navBtnPrev.mouseover(function(){
						self.navPrev(true);
					});
					this.navBtnNext.mouseover(function(){
						self.navNext(true);
					});
					this.navBtns.mouseout(function(){
						self.navStopContinuous();
					});
				}
				
				// Disable first button if not circular
				if( !this.options.circular ){
					this.navBtnPrev.addClass(this.cssNames.btnDisable);
				}
			}
			else{
				this.navBtns.addClass( this.cssNames.btnDisable );
			}
			
		};
		
		this._getNavPos = function() {
			this.navPos = this.options.verticalnav ? this.navUL.position().top : this.navUL.position().left;
			this.LIbefore = Math.ceil( Math.abs(this.navPos) / this.navLIsize );
			this.LIafter = Math.floor(( this.navULSize - Math.abs(this.navPos) - this.navClipSize) / this.navLIsize );
			if(this.LIafter < 0){
				this.LIafter = 0;
			}
		};

		this._buildControls = function() {
			
			this.playBtn = $("."+this.cssNames.playBtn, this.domObj);
			this.gBtns = $("."+this.cssNames.goBtns, this.domObj);

			this.isPlayBtn = this.playBtn.size() > 0 ? 1 : 0;
			this.goBtns = this.gBtns.size() > 0 ? 1 : 0;
			
			// Play button
			if( this.isPlayBtn ){
				
				// If autoscroll is active, the play button is set to 'pause' mode
				if( this.options.auto ){
					this.playBtn.addClass(this.cssNames.btnPause);
				}
				
				// Button mouse event
				this.playBtn.click(function(){
					if(self.playBtn.hasClass(self.cssNames.btnPause)){
						self.playBtnPause();
					}
					else{
						self.playBtnStart();
					}
					return false;
				});
			}

			// Go buttons (prev/next)
			if( this.goBtns ){
				this.goBtnPrev = $("."+this.cssNames.goPrev, this.domObj);
				this.goBtnNext = $("."+this.cssNames.goNext, this.domObj);
				
				// Show/hide buttons on panel mouseover
				if(this.options.panelbtnshover){
					this.gBtns.hide();
					$("."+this.cssNames.panels, this.domObj).hover(
						function(){
							self.gBtns.fadeIn();
						},
						function(){
							self.gBtns.fadeOut();
						}
					);
				}
				
				// Button click binding
				this.goBtnPrev.click(function(){
					self.stepBackward($(this));
					return false;
				});
				this.goBtnNext.click(function(){
					self.stepForward($(this));
					return false;
				});
			}
		};

		this._wrapPanels = function(){
			if( $( '.' + this.cssNames.panelsWrapper, this.domObj ).size() == 0 ){
				this.panels.wrapAll( '<div class="' + this.cssNames.panelsWrapper + '"></div>' );
				this.panelsWrapper = $( '.' + this.cssNames.panelsWrapper, this.panelsBag );
				this.panelsWrapper.css( 'position', 'relative' );
			}
		};
		
		this._change = function( eventSrc, scrollWay, goToId, lineScrolling, stopAuto ) {
			
			// If there is a play button + auto-scrolling running
			if( stopAuto && this.isPlaying!=null ){
				if( this.isPlayBtn ){
					this.playBtnPause();
				}
				if( this.options.autostill ){
					self.autoScrollStop();
				}
			}
			
			// Don't go further if the side is reached and carousel isn't circular
			// The slide is stopped if the button is disable
			if(eventSrc){
				if(eventSrc.hasClass(this.cssNames.btnDisable)){
					return false;
				}
			}
			
			// By default, user action is blocked when nav is being animated. This to prevent the function calculation to go mad when the user is switching the items too quickly.
			// This security applies on panels too. However it can be removed using the 'fastchange' option.
			var stopGoing = 0;			
			var running = $( ':animated', this.runningScope ).size() > 0 ? 1 : 0;

			if( !running && !this.animating ){
				this.prevId = this.currId;
				
				// Increment the current id, only if linescrolling isn't required
				if(goToId == null && !lineScrolling){
					this.currId = scrollWay == "-=" ? this.currId+1 : this.currId-1;
				}
				// Else if an id is given, we take it
				else if(goToId != null){
					goToId = parseInt(goToId);// make sure it's a number
					this.currId = goToId < 0 ? 0 : goToId > this.allItems-1 ? this.allItems-1 : goToId;// make sure it's in the nav range
					var checkIdRange = eventSrc ? eventSrc.parent().parent().hasClass(this.cssNames.navClip) ? false : true : true;
				}

				// If panel buttons exist, we activate them
				if(this.goBtns){
					this.gBtns.removeClass(this.cssNames.btnDisable);
				}

				// If the carousel isn't circular the controls must be hidden when sides are reached
				if(!this.options.circular){
					// Top/left side is reached
					if(this.currId == -1){
						this.currId = 0;
						stopGoing = 1;
					}
					if(this.currId == 0 && this.goBtns){
						this.goBtnPrev.addClass(this.cssNames.btnDisable);
					}

					// Bottom/right side is reached
					if(this.currId == this.allItems){
						this.currId = this.allItems-1;
						stopGoing = 1;
					}
					
					if(this.currId == this.allItems-1){
						if(this.options.auto){
							this.autoScrollStop();
						}
						if(this.goBtns){
							this.goBtnNext.addClass(this.cssNames.btnDisable);
						}
					}
				}
				// Otherwise if there is no scroll required, this.currId must be reset when sides are reached
				else if(!this.scrollActive){
					if(this.currId == this.allItems){
						this.currId = 0;
					}
					if(this.currId == -1){
						this.currId = this.allItems-1;
					}
				}

				// If the slide function isn't triggered from a nav LI event, we must check if the line must be scrolled or not
				if( this.scrollActive && !stopGoing ){
					this._setNavScroll( lineScrolling, scrollWay, checkIdRange );
				}
				
				// Highlight selected menu
				if( this.isNavClip ){
					this.selectThumbnail(this.currId);
				}
				
				// Switch to the next panel
				// Note: if 'navpanelautoswitch' option is false, the panels won't switch when line is scrolling
				if( ! (lineScrolling && !this.options.navpanelautoswitch) ){					
					if( this.arePanels ){
						this._animPanel( this.currId, scrollWay );
					}
				}

				// First time cancel
				if( this.firstTime ){
					this.firstTime = 0;
				}

			} // else > be patient, the line scroll is running !
		};
		
		this._setNavScroll = function( lineScrolling, scrollWay, checkIdRange ) {

			// Get the current nav position
			this._getNavPos();
			
			var triggerLineScroll = lineScrolling ? true : false;	
			var jumpToId = 0;

			// No line scrolling required yet: we are going to check the current item position to determine if line scrolling is needed or not.
			if( ! lineScrolling ){
				// Line scrolling will happen only if navclip sides are reached
				// Number of items from the clip sides:
				var idFromClipStart = Math.abs(this.currId+1 - this.LIbefore);
				var idToClipEnd = this.options.shownavitems - idFromClipStart +1;
				var currIdOnEdge = this.currId == 0 || this.currId == this.allItems-1 ? 1 : 0;

				// If 'navscrollatend' option is activated, the line will scroll when navclip edges are reached (except if currId is the first or last item of the nav)
				if( (this.options.navscrollatend && (idToClipEnd == 1 || idFromClipStart == 1)) && !this.firstTime && !currIdOnEdge ){
					jumpToId = this.options.scroll - 1;
					triggerLineScroll = true;
				}
				
				// Else the line will scroll when currId is out of the navclip range by -1 or +1
				if(idToClipEnd == 0 || idFromClipStart == 0){
					triggerLineScroll = true;
				}
				
				// A target id is specified (using 'changeWithId' method). No direction ('scrollWay = ""').
				// We check here the difference between target and previous Ids
				if( checkIdRange ){
					if( idToClipEnd < 0 ){
						idToClipEnd = 0;
					}
					scrollWay = this.prevId < this.currId ? '-=' : '+=';					
					var idDiff = Math.abs( this.prevId - this.currId );
					
					// The nav will scroll if the target id is different from the previous Id
					// The scroll value will then be equal to the 'jumpToId' var, overwriting the 'scroll' option value.
					if( (idDiff-1 > idToClipEnd && scrollWay == '-=') || (idDiff > idFromClipStart && scrollWay == '+=') ){
						jumpToId = idDiff;
						triggerLineScroll = true;
					}
				}
				
				// Dertermine scroll direction
				if(scrollWay == ""){
					if(this.prevId == this.currId && !currIdOnEdge){
						scrollWay = this.scrollWay == "-=" ? "+=" : "-=";
					}
					else{
						scrollWay = this.prevId < this.currId ? "-=" : "+=";
					}
				}
				this.scrollWay = scrollWay;
			}

			// If line scrolling is required
			if( triggerLineScroll ){
				
				// How many lines will scroll ? By default the answer is 'this.options.scroll' or 'jumpToId'. But we check if there are enough lines left.
				var scrollPower = jumpToId > 0 ? jumpToId : this.options.scroll;
				var LIremain = scrollWay == "-=" ? this.LIafter : this.LIbefore;
				var scrollto = LIremain < scrollPower ? LIremain : scrollPower;
				var scrollSize = scrollto * this.navLIsize;
				
				// Once the nav has scrolled, the <li> tag matching the currId value may not be visible in the nav clip. So we calculate here a new currId regarding to the nav position.
				this.newId = scrollWay == "-=" ? this.LIbefore+scrollto : this.LIbefore-scrollto+this.options.shownavitems-1;
				if( (scrollWay == "-=" && this.newId > this.currId) || (scrollWay == "+=" && this.newId < this.currId) ){
					this.currId = this.newId;
				}				

				// Circular option is active
				if(this.options.circular){
					// Previous
					if(this.LIbefore <= 0 && scrollWay == "+="){
						scrollWay = "-=";
						this.currId = this.allItems-1;
						scrollSize = ( this.LIafter/this.options.scroll )*( this.navLIsize*this.options.scroll );
					}
					// Next
					else if(this.LIafter == 0 && scrollWay == "-="){
						scrollWay = "+=";
						this.currId = 0;
						scrollSize = Math.abs(this.navPos);
					}
				}
				
				// Finally, the scroll animation
				this._animNav(scrollWay, scrollSize);
			}
		};
		
		this._animPanel = function( currId, scrollWay ) {
			// Current panel elem
			this.currPanel = this.panels.eq( currId );
			
			// Prev panel elem
			this.prevPanelStill = this.panels.eq( this.prevId );

			var panelComplete = function(){			
				if( $.isFunction(self.options.panelfxafter) ){
					self.options.panelfxafter();
				}			

				// Additional callbacks
				self._runCallBacks( self.panelPostFns );
			};
		
			// Slide panel (only if not already active)
			if( !this.currPanel.hasClass( this.cssNames.panelActive ) ){			
				
				// First panel display (no effect)
				if(this.firstTime){
					this.panelTransition = this.options.panelfxfirst;
					var FirstTime = 1;
				}
				
				// Else we check for the transition effect
				else{
					// No effect
					var freeheightfx = this.options.freeheight && this.options.panelfx == "fading" ? "tabsfading" : "none";
					this.panelTransition = this.options.freeheight ? freeheightfx : this.options.panelfx;
				}

				// Call the before function is it exists
				if( $.isFunction(self.options.panelfxbefore) ){
					self.options.panelfxbefore();
				}
				
				// Additional callbacks
				this._runCallBacks( this.panelAnteFns );
				
				// Call the transition function
				this._panelTransitions[ this.panelTransition ]( scrollWay, FirstTime, panelComplete );
			}
		};
				
		this._animNav = function( scrollWay, scrollSize ) {
			var navComplete = function(){
				// If the nav isn't circular, buttons are disabled when start or end is reached
				if(!self.options.circular && self.scrollBtns){
					self.navBtns.removeClass(self.cssNames.btnDisable);

					// Get the nav position
					self._getNavPos();
					
					// Start is reached
					if(self.LIbefore <= 0){
						self.navBtnPrev.addClass(self.cssNames.btnDisable);
					}
					// End is reached
					else if(self.LIafter <= 0){
						self.navBtnNext.addClass(self.cssNames.btnDisable);
					}
				}
				
				// Reload the animation if scrollcontinue option is true
				if(self.scrollcontinue){
					setTimeout(function(){ self.scrollcontinue == "-=" ? self.navPrev() : self.navNext() }, 0);
				}
				
				// Nav callback
				else if( $.isFunction(self.options.navfxafter) ){
					self.options.navfxafter();
				}
				
				// Additional callbacks
				self._runCallBacks( self.navPostFns );
			};

			// Call the before function is it exists
			if( $.isFunction(self.options.navfxbefore) ){
				self.options.navfxbefore();
			}
			
			// Additional callbacks
			self._runCallBacks( self.navAnteFns );

			// Call transition
			this._navTransitions[ this.options.navfx ](scrollWay, scrollSize, navComplete);
		};
		
		this._runCallBacks = function( fns ){
			$.each( fns, function(index, item) {
				if( $.isFunction( item ) ){
					item();
				}
			});
		};
		
		this._clearCallBacks = function( fns ){
			fns.length = 0;
		};
		
		this._panelTransitions = {
			
			none: function(scrollWay, FirstTime, complete) {
				self.panels.removeClass(self.cssNames.panelActive).hide();
				self.currPanel.addClass(self.cssNames.panelActive).show();
				complete();
			},

			sliding: function(scrollWay, FirstTime, complete) {
			
				// Slide direction
				if(scrollWay == ""){
					scrollWay = self.prevPanel < self.currId ? "-=" : "+=";
				}
				self.prevPanel = self.currId;
				
				// Position/Size values for CSS
				var cssPosValue = scrollWay == "-=" ? "+" : "-";
				var cssSlidePosAttr = self.options.verticalslide ? "top" : "left";
				var domObjSize = self.options.verticalnav ? self.domObjHeight : self.domObjWidth;
				var slideScrollValue = cssSlidePosAttr == "top" ? {top: scrollWay+domObjSize} : {left: scrollWay+domObjSize};

				// Panels selection
				self.oldPanel = $("."+self.cssNames.panelOld, self.domObj);
				self.activePanel = $("."+self.cssNames.panelActive, self.domObj);
				
				// Panels CSS properties
				self.panels.css(cssSlidePosAttr, "0");
				self.oldPanel.removeClass(self.cssNames.panelOld).hide();		
				self.activePanel.removeClass(self.cssNames.panelActive).addClass(self.cssNames.panelOld);
				self.currPanel.addClass(self.cssNames.panelActive).css(cssSlidePosAttr, cssPosValue+domObjSize + "px").show();
			
				// Wrapper animation
				self.panelsWrapper.stop(true, true).css(cssSlidePosAttr, "0").animate(
					slideScrollValue, 
					self.options.panelfxspeed, 
					self.options.panelfxeasing,
					function(){
						complete();
					}
				);
			},
			
			fading: function(scrollWay, FirstTime, complete) {	
				if(FirstTime){
					self.panels.hide();
				}
				else{
					self.currPanel.css("display","none");
				}
				
				$("."+self.cssNames.panelOld, self.domObj).removeClass(self.cssNames.panelOld);				
				$("."+self.cssNames.panelActive, self.domObj).stop(true, true).removeClass(self.cssNames.panelActive).addClass(self.cssNames.panelOld);
				
				self.currPanel.addClass(self.cssNames.panelActive)
				.animate(
					{"opacity":"show"},
					self.options.panelfxspeed, 
					self.options.panelfxeasing, 
					function(){
						complete();
					}
				);				
			},
			
			tabsfading: function(scrollWay, FirstTime, complete) {
				self.panels.removeClass(self.cssNames.panelActive).hide();
				self.currPanel.fadeIn(
					self.options.panelfxspeed, 
					function(){
						complete();
					}
				);
			}		
		};

		this._navTransitions = {
			
			none: function(scrollWay, scrollSize, complete) {
				var newScrollSize = scrollWay == "-=" ? self.navPos-scrollSize : self.navPos+scrollSize;
				self.navUL.css( self.cssPosAttr, newScrollSize +"px" );
				complete();
			},
			
			sliding: function(scrollWay, scrollSize, complete) {
				self.navUL.animate(
					self.cssPosAttr == "left" ? {left:scrollWay+scrollSize} : {top:scrollWay+scrollSize}
					, self.options.scrollspeed, self.options.scrolleasing
					, function(){
						complete();
					}
				);	
			}
		};
		
		this.playBtnPause = function() {
			this.playBtn.removeClass(this.cssNames.btnPause);
			this.autoScrollStop();
		};

		this.playBtnStart = function() {
			this.playBtn.addClass(self.cssNames.btnPause);
			this.autoScrollStart();
		};
		
		this.autoScrollStart = function() {
			var self = this;
			this.isPlaying = setInterval(function(){
				self._change(null, "-=", null, self.lineScrollDo, null);
			}, self.options.autospeed);
		};

		this.autoScrollStop = function() {
			clearTimeout(this.isPlaying);
			this.isPlaying = null;
		};
						
		this.changeWithId = function( id, eventSrc ) {
			this._change(eventSrc, "", id, 0, 1);
		};

		this.stepBackward = function(eventSrc) {
			this._change(eventSrc, "+=", null, self.lineScrollDo, 1);
		};

		this.stepForward = function(eventSrc) {
			this._change(eventSrc, "-=", null, self.lineScrollDo, 1);
		};
		
		this.navPrev = function(c) {
			if(c){self.scrollcontinue = "-=";}
			this._change(this.navBtnPrev, "+=", null, 1, 1);
		};
		
		this.navNext = function(c) {
			if(c){self.scrollcontinue = "+=";}
			this._change(this.navBtnNext, "-=", null, 1, 1);
		};
		
		this.navStopContinuous = function() {
			self.scrollcontinue = "";
		};

		this.selectThumbnail = function( currId ){
			$("."+this.cssNames.selected, this.navUL).removeClass(this.cssNames.selected);
			this.navLI.eq(currId).addClass(this.cssNames.selected);
		};
	};

	// Launch plugin
	$.fn.sliderkit = function( options ){

		return this.each(function(){
			
			 $( this ).data( "sliderkit", new SliderKit()._init( this, options ) );

		 });
	};
	
})(jQuery);