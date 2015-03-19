/**
 *  Slider Kit Delay Captions, v.1.1 - 2012/01/10
 *  http://www.kyrielles.net/sliderkit
 *  
 *  Copyright (c) 2010-2012 Alan Frog
 *  Licensed under the GNU General Public License
 *  See <license.txt> or <http://www.gnu.org/licenses/>
 *  
 *  Requires: jQuery Slider Kit v1.7.1+
 *  note: 'hold' options is depreciated since jQuery Slider Kit v1.9
 * 
 */
(function( $ ) {

	SliderKit.prototype.DelayCaptions = function( settings ) {		
		var obj = this,
			defaults = {
				delay:400,
				position:'bottom',
				transition:'sliding',
				duration:300,
				easing:'',
				hold:false
			},
			csslib = {
				textbox:obj.options.cssprefix + '-panel-textbox'
			},
			params = '',
			cssPos = 0,
			cssOp = '',
			txtboxSize = 0,
			animDelay = 0,
			animDuration = 0,
			animParam = '';		
		
		var init = function(){
			var txtboxes = $( '.' + csslib.textbox, obj.domObj );
			
			// Check if there is any textbox in the slider
			if( txtboxes.size() == 0 ){
				obj._errorReport('DelayCaptions #01', obj.options.debug, 0);
				return false;
			}

			// Merge settings
			params = $.extend( {}, defaults, settings );
			
			// Textbox Size
			var txtboxWidth = txtboxes.width();
			txtboxSize = (params.position == 'top' || params.position == 'bottom') ? txtboxes.height() : params.position == 'left' ? txtboxWidth : params.position == 'right' ? obj.domObjWidth : 0;		
			if( txtboxSize == 0 ){
				obj._errorReport( 'DelayCaptions #02', obj.options.debug, 0 );
				return false;
			}
			// Default textbox position
			else{
				txtboxes.css( {top:'', bottom:'0', left:'', right:''} );
			}
			
			// Anim delay must be equal or higher than panelfxspeed
			animDelay = params.delay < obj.options.panelfxspeed ? obj.options.panelfxspeed : params.delay; // && obj.options.fastchange
			
			// Auto speed must be equal or higher than total anim duration
			animDuration = obj.options.panelfxspeed + animDelay + params.duration;
			if( obj.options.autospeed < animDuration ){
				obj.options.autospeed = animDuration;
				obj._errorReport( 'DelayCaptions #03', obj.options.debug, 0 );
			}
			obj.animating = false;

			switch ( params.transition ) {
				case 'sliding' :
					cssOp = params.position == 'right' ? '' : '-';
					cssPos = params.position == 'right' ? 'left' : params.position;		
					switch ( params.position ) {
						case 'top': animParam = {top: '+=' + txtboxSize}; break;
						case 'bottom': animParam = {bottom: '+=' + txtboxSize}; break;
						case 'left': animParam = {left: '+=' + txtboxSize}; break;
						case 'right': animParam = {left: '-=' + txtboxWidth}; break;
					}
				break;
				case 'fading' :
					animParam = { 'opacity':1 };
				break;
			}
		};
		
		// Reset textbox timer
		var clearAnim = function(){
			if( obj.txtBoxTimer != null ){
				clearTimeout( obj.txtBoxTimer );
			}
		};

		// Before panel animation
		var textboxPos = function(){
		
			// Stop previous timeout/anim
			clearAnim();
			
			// Select current textbox
			var currTxtBox = $( '.' + csslib.textbox, obj.currPanel );
			
			// Apply the animation only if a textbox exists in the current panel
			if( currTxtBox.size() > 0 ){
				switch ( params.transition ) {
					case 'fading' :
						currTxtBox.css( 'opacity', '0' );
						//currTxtBox.hide();
					break;
					case 'sliding' :			
						currTxtBox.css( cssPos, cssOp + txtboxSize + 'px' );
					break;
				}
			}
		};
		// Store the function into the callback list
		obj.panelAnteFns.push( textboxPos );
		
		// After panel animation function	
		var textboxAnim = function( currTxtBox ){
		
			// Prevents script to switch while textbox is animating
			obj.textboxRunning = true;
		
			// Run animation
			currTxtBox.animate(
				animParam, 
				params.duration, 
				params.easing, 
				function(){
					obj.animating = false;
					obj.textboxRunning = false;
				}
			);
		};
		
		// After panel animation callback
		var textboxShow = function(){
			
			// Stop previous timeout/anim
			clearAnim();
			
			// Select current textbox
			var currTxtBox = $( '.' + csslib.textbox, obj.currPanel );

			// Apply the animation only if a textbox exists in the current panel
			if( currTxtBox.size() > 0 ){
			
				// Prevents '_change()' function to trigger during textbox animation
				if( !obj.options.fastchange ) {
					obj.animating = true;
				}

				// Delay the animation
				if( !obj.textboxRunning ){
					obj.txtBoxTimer = setTimeout( function(){ textboxAnim( currTxtBox ) }, animDelay );
				}
			}
		};
		// Store the function into the callback list
		obj.panelPostFns.push( textboxShow );
		
		// Launch
		init();
    };
})( jQuery );