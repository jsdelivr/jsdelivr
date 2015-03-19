/**
 *  Slider Kit imageFx, v.1.0 - 2012/01/10
 *  http://www.kyrielles.net/sliderkit
 *  
 *  Copyright (c) 2010-2012 Alan Frog
 *  Licensed under the GNU General Public License
 *  See <license.txt> or <http://www.gnu.org/licenses/>
 *  
 *  Requires : jQuery Slider Kit v1.9+
 * 
 *	-----------------------------------------
 *	Slider Kit imageFx add-on was built from jqFancyTransitions jQuery plugin by Ivan Lazarevic.
 *
 *	jqFancyTransitions - jQuery plugin
 *	Examples and documentation at: http://www.workshop.rs/projects/jqfancytransitions
 *	
 *	Dual licensed under the MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *	http://www.gnu.org/licenses/gpl.html
 */
(function( $ ) {

	SliderKit.prototype.imageFx = function(){
		var obj = this,
			csslib = {
				strip:obj.options.cssprefix + '-strip',
				imageFxAnchor:obj.options.cssprefix + '-imagefx-anchor',
				textbox:obj.options.cssprefix + '-panel-textbox'
			},
			defaults = {
				fxType: 'curtain', // curtain, zipper, wave, fountain, random
				fxDelay: 60, // delay between strips in ms
				strips: 10, // number of strips
				stripOrientation: 'default', // default, reverse
				stripPosition: 'default', // default, reverse, alternate (only for 'zipper' effect)
				stripDirection: 'default', // default, reverse, random, auto (only for 'curtain' effect)
				fxDuration: 500 // fading duration in ms
			},
			fxTypes = new Array( 'default', 'curtain', 'zipper', 'wave', 'fountain' );							
		
		// Random function
		var fisherYates = function( arr1, arr2 ){
			var i = arr1.length;
			if( i == 0 ){
				return false;
			}
			while( i-- ){
				var j = Math.floor( Math.random() * ( i + 1 ) );
				var tempi = arr1[i];
				var tempj = arr1[j];
				arr1[i] = tempj;
				arr1[j] = tempi;
				arr2[i] = tempj;
				arr2[j] = tempi;
			}
		};
		
		// Switch panel function
		var setCurrPanel = function(){
			obj.panels.removeClass( obj.cssNames.panelActive ).hide();
			obj.currPanel.addClass( obj.cssNames.panelActive ).show().find( 'img' ).hide();
			if( !obj.options.delaycaptions ){
				$( '.' + csslib.textbox, obj.currPanel ).hide().fadeIn();
			}
		};
		
		// Transition engine
		var runFx = function( params, currImgUrl, prevImgUrl, scrollWay ){
			
			var orderArr = new Array(),
				widthArr = new Array(),
				odd = 1,
				incArr = 0,
				animParams = null,
				stripPos1Val = 0,
				stripPos1Attr = '',
				stripPos2Attr = '',
				stripPosAttrR = '',
				stripSize1Attr = '',
				stripSize1Val = 0,
				stripSize2Attr = '',
				stripSize2Val = 0,
				refSize = params.stripOrientation == 'reverse' ? obj.domObjHeight : obj.domObjWidth,
				stripSize = parseInt( refSize / params.strips ),
				$strip = null,
				$strips = $( '.' + csslib.strip, obj.panelsBag ),
				gap = refSize%params.strips;
			
			// Fx default settings
			switch( params.fxType ){
				case 'zipper':
					params.stripPosition = 'alternate'; 
					params.stripDirection = null;
				break;
				case 'wave':
					//
				break;
				case 'curtain':
					params.stripPosition = null; 
				break;
				case 'fountain':
					if( params.stripDirection != 'random' && params.stripDirection != 'default' ){
						params.stripDirection = 'default';
					}
				break;
			}
			
			// Fx orientation (horizontal or vertical)
			if( params.stripOrientation == 'reverse' ){
				stripPos1Attr = 'top';
				stripPos2Attr = 'left';
				stripPosAttrR = 'right';
				stripSize1Attr = 'height';
				stripSize2Attr = 'width';
				stripSize2Val = obj.domObjWidth;
				// 'animate' function settings
				animParams = { width:obj.domObjWidth, opacity:1 };
			}
			else{
				params.stripOrientation = 'default';
				stripPos1Attr = 'left';
				stripPos2Attr = 'top';
				stripPosAttrR = 'bottom';
				stripSize1Attr = 'width';
				stripSize2Attr = 'height';
				stripSize2Val = obj.domObjHeight;
				animParams = { height:obj.domObjHeight, opacity:1 };
			}
			
			// Strips positioning
			for( j=1; j < params.strips+1; j++ ){
				$strip = $strips.eq( j-1 );
				if( gap > 0 ){
					stripSize1Val = stripSize + 1;
					gap--;
				} 
				else{
					stripSize1Val = stripSize;
				}
				
				// Height/Width
				$strip.css( stripPos1Attr, stripPos1Val + 'px' )
				.css( stripPos2Attr, '0' )
				.css( stripSize1Attr, stripSize1Val + 'px' )
				.css( stripSize2Attr, stripSize2Val + 'px' );
				
				// Background image
				$strip.css( 'background-position', params.stripOrientation == 'default' ? -stripPos1Val + 'px 0' : '0 ' + -stripPos1Val + 'px' );
				
				// Increment
				stripPos1Val += stripSize1Val;
				
				// Position
				if ( params.stripPosition == 'reverse' || (j%2 == 0 && params.stripPosition == 'alternate') ){
					$strip.css( stripPosAttrR, '0' );
					$strip.css( stripPos2Attr, 'auto' );
				}
				
				// 'Fountain' strip order
				if( params.fxType == 'fountain' ){
					orderArr[j-1] = parseInt( params.strips/2 ) - ( parseInt(j/2)*odd );
					orderArr[ params.strips-1 ] = params.strips; // fix for odd number of bars
					odd *= -1;
				} 
				// Linear strips
				else {
					orderArr[j-1] = j;
				}
				
				// Saving strip size
				widthArr[ j-1 ] = stripSize1Val;
			}
			
			// Random direction
			if( params.stripDirection == 'random' ){
				fisherYates( orderArr, widthArr );
			}			
			// Reverse direction
			else if( ( params.stripDirection == 'reverse' && orderArr[0] == 1 ) || params.stripPosition == 'alternate' ){
				orderArr.reverse();
				widthArr.reverse();
			}
			// Auto direction
			else if( params.stripDirection == 'auto' && ( (scrollWay == '+=' && orderArr[0] == 1) || (scrollWay == '-=' && orderArr[0] == params.strips) ) ){
				orderArr.reverse();
				widthArr.reverse();
			}
			
			// Set the main container background image
			obj.panelsBag.css( 'background', 'transparent url("'+ prevImgUrl +'") no-repeat 0 0' );
			
			// Prepare the strips before animation
			$strips.css( params.fxType == 'curtain' ? stripSize1Attr : stripSize2Attr, '0' );
					
			// Launch transition animation
			incArr = -1;
			var stripFiring = setInterval(
				function(){
					incArr++;

					// Depending of strips number, extra strip width (gap) is distributed to all strips, so each one gets a different width value ( => widthArr[incArr] )
					// For now, only 'curtain' effect needs this width value.
					if( params.fxType == 'curtain' ){
						animParams = params.stripOrientation == 'default' ? { width:widthArr[incArr], opacity:1 } : { height:widthArr[incArr], opacity:1 };
					}

					if( incArr == params.strips ){
						clearInterval( stripFiring );
					}
			
					$strips.eq( orderArr[incArr]-1 ).css({
						opacity: 0,
						'z-index':3,
						'background-image': 'url('+ currImgUrl +')'
					})
					.stop().animate( animParams, params.fxDuration );
			
				}, params.fxDelay
			);
		};

		// Methods
		obj.imageFx.init = function(){
		
			// Check images. Script stops if test fails.
			if( obj.panelsBag.children( 'img' ).size == 0 ){
				obj._errorReport( 'ImageFx #01', obj.options.debug, 1 );
			}
			
			// Prevents user from switching images during the transition
			obj.options.fastchange = false;
			
			// Settings
			var	params = $.extend( {}, defaults, obj.options.imagefx );

			if( params.strips < 1 || params.strips == undefined || isNaN(params.strips) ){
				params.strips = defaults.strips;
			}
			if( params.fxDelay < 0 || params.fxDelay == undefined || isNaN(params.fxDelay) ){
				params.fxDelay = defaults.fxDelay;
			}
			
			// panelfxspeed is equal to imagefx duration
			obj.options.panelfxspeed = params.fxDelay * params.strips;
			
			// auto delay must be equal or higher than panelfxspeed			
			if( obj.options.auto && obj.options.autospeed < obj.options.panelfxspeed ){
				obj.options.autospeed = obj.options.panelfxspeed;
			}
		
			// Strip container
			obj._wrapPanels();
			obj.panelsBag.css({
				'background': 'transparent url("'+ $( 'img', obj.currPanel ).attr( 'src' ) +'") no-repeat 0 0',
				'position' : 'relative',
				height : obj.domObjHeight,
				width : obj.domObjWidth
			});

			// txtboxes
			$( '.' + csslib.textbox, obj.domObj ).css( 'z-index', '4' );
			
			// Add strips to the DOM
			if( $( '.' + csslib.strip, obj.domObj ).size() < 1 ){
				var newStrip = '';
				for( j=1; j < params.strips+1; j++ ){
					newStrip += '<div class="'+ csslib.strip + '" style="float:left;position:absolute;z-index:3"></div>';
				}
				obj.panelsBag.append( newStrip );
			}
			
			// Anchor
			obj.panelsBag.prepend( '<a href="#" class="' + csslib.imageFxAnchor +'" style="position:absolute;top:0;left:0;display:none;z-index:6;width:100%;height:100%;"></a>' );
		};
		
		obj.imageFx.remove = function(){
			var $strips = $( '.' + csslib.strip, obj.domObj );
			if( $strips.size() > 0 ){
				$strips.remove();
				obj.panelsBag.css( 'background-image', 'none' );
				$( 'img', obj.panels ).show();
			}
		};
		
		// Adding the fancy transition to the main transitions array
		obj._panelTransitions.fancy = function( scrollWay, firstTime, complete ){
			
			// Prevents the '_change' function from switching images during the transition
			obj.animating = true;

			// Previous panel textbox
			var prevTxtBox = $( '.' + csslib.textbox, obj.prevPanelStill );

			// Hidding previous panel textbox gently
			if( prevTxtBox.size() > 0 ){
				prevTxtBox.animate(
					{ 'opacity':0 },
					500,
					function(){
						// Hide active panel, show current
						setCurrPanel();
						
						// Textbox opacity rewind
						prevTxtBox.css({ 'opacity':1 });
					}
				);
			}					
			else{
				// Hide active panel, show current
				setCurrPanel();
			}
	
			// Merge params
			var	params = $.extend( {}, defaults, obj.options.imagefx );

			// Determines fx type
			if( params.fxType != 'random' && fxTypes.indexOf( params.fxType ) < 0 ){
				obj._errorReport( 'ImageFx #02', obj.options.debug, 0 );
				params.fxType = 'curtain';
			}
			else{
				switch( params.fxType ){
					case 'random' :
						params.fxType = fxTypes[ Math.floor( Math.random() * ( fxTypes.length ) ) ];
					break;
					case 'default' :
						params.fxType = defaults.fxType;
					break;
				}
			}

			// Get URL
			var anchor = $( '.' + csslib.imageFxAnchor, obj.panelsBag ),
				currAnchor = $( 'a:first-child', obj.currPanel );

			if( currAnchor.attr( 'href' ) != undefined ){
				anchor.attr({ 
					'href':currAnchor.attr( 'href' ), 
					'title':currAnchor.attr( 'title' ), 
					'target':currAnchor.attr( 'target' )
				}).show();
			}
			else{
				anchor.hide();
			}
			
			// Set background images
			var prevImgUrl = $( 'img', obj.prevPanelStill ).attr( 'src' );
			var currImgUrl = $( 'img', obj.currPanel ).attr( 'src' );
			
			// Run fx (only if both current and previous images exist in the DOM)
			if( prevImgUrl == undefined || currImgUrl == undefined ){
				obj._errorReport( 'ImageFx #03', obj.options.debug, 0 );
			}
			else{
				runFx( params, currImgUrl, prevImgUrl, scrollWay );
				
				// Callback
				var checkCallback = setInterval(
					function(){ 
						if( $( ':animated', obj.panelsBag ).size() == 0 ){
							clearInterval( checkCallback );
							complete();
							if( !obj.options.delaycaptions && !obj.options.fastchange ){
								setTimeout( function(){obj.animating = false;}, 50 );
							}
						}
					}, 100 
				);
			}
		};
		
		// Launch if requested
		if( obj.options.panelfx == 'fancy' ){
			obj.imageFx.init();
		}
	};	
})( jQuery );