/**
 *  Slider Kit Timer, v.1.0 - 2011/09/23
 *  http://www.kyrielles.net/sliderkit
 *  
 *  Copyright (c) 2010-2012 Alan Frog
 *  Licensed under the GNU General Public License
 *  See <license.txt> or <http://www.gnu.org/licenses/>
 *  
 *  Requires : jQuery Slider Kit v1.8+
 * 
 */
(function( $ ) {

	SliderKit.prototype.Timer = (function( params ){
		var obj = this,
			settings = {
				fadeout:1
			},			
			csslib = {
				timer:obj.options.cssprefix + '-timer'
			};
		
		// Merge settings
		settings = $.extend( {}, settings, params );		

		// Timer
		if( obj.arePanels && obj.isPlaying != '' ){
			
			// Create the timer DOM object
			var timer = $( '.' + csslib.timer, obj.domObj );
			
			// Create the timer if doesn't exist
			if( timer.size() == 0 ){
				obj.panelsBag.append( '<div class="'+csslib.timer+'"></div>' );
				timer = $( '.' + csslib.timer, obj.domObj );
			}

			// Timer stop anim
			var timerStop = function(){
				timer.stop().css( 'opacity', 1 ).width( obj.domObjWidth ).hide();
			};			
			
			// Timer start anim
			var timerStart = function(){
				timerStop();
				
				if( obj.isPlaying != null ){
					timer.show().animate(
						{ opacity: settings.fadeout, width:0 }, obj.options.autospeed-100, function(){}
					);
				}
			};
			
			// FirstTime load
			timerStart();
			
			// Store the function into the panel callback list
			obj.panelAnteFns.push( timerStart );
			
		}
    });
	
})( jQuery );