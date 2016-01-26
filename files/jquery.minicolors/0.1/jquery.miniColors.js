/*
 * jQuery miniColors: A small color selector
 *
 * Copyright 2012 Cory LaViska for A Beautiful Site, LLC. (http://www.abeautifulsite.net/)
 *
 * Dual licensed under the MIT or GPL Version 2 licenses
 *
*/
if(jQuery) (function($) {
	
	$.extend($.fn, {
		
		miniColors: function(o, data) {
			
			function create(input, o, data) {
				
				// Determine initial color (defaults to white)
				var hex = input.val() ? '#' + cleanHex(expandHex(input.val())) : '#ffffff',
					rgb = hex2rgb(hex),
					opacity = false,
					alpha,
					trigger;
				
				// Handle opacity
				if( input.attr('data-opacity') !== undefined || o.opacity === true ) {
					opacity = true;
					alpha = input.attr('data-opacity');
					if( alpha === '' ) {
						alpha = 1;
					} else {
						alpha = parseFloat(alpha).toFixed(2);
					}
					if( alpha > 1 ) alpha = 1;
					if( alpha < 0 ) alpha = 0;
					input.attr('data-opacity', alpha);
				}
				
				// Create trigger
				trigger = $('<a class="miniColors-trigger" style="background-color: ' + hex + '" href="#"></a>')
					.insertAfter(input)
					.wrap('<span class="miniColors-triggerWrap"></span>')
					.css('backgroundColor', 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + alpha + ')');
				
				// Set input data and update attributes
				input
					.addClass('miniColors')
					.data('original-maxlength', input.attr('maxlength') || null)
					.data('original-autocomplete', input.attr('autocomplete') || null)
					.data('letterCase', o.letterCase === 'uppercase' ? 'uppercase' : 'lowercase')
					.data('opacity', opacity)
					.data('alpha', alpha)
					.data('trigger', trigger)
					.data('hex', hex)
					.data('change', o.change ? o.change : null)
					.data('close', o.close ? o.close : null)
					.data('open', o.open ? o.open : null)
					.attr('maxlength', 7)
					.attr('autocomplete', 'off')
					.val(convertCase('#' + cleanHex(hex), o.letterCase));
				
				// Handle options
				if( o.readonly || input.prop('readonly') ) input.prop('readonly', true);
				if( o.disabled || input.prop('disabled') ) disable(input);
				
				// Show selector when trigger is clicked
				trigger.on('click.miniColors', function(event) {
					event.preventDefault();
					if( input.val() === '' ) input.val('#');
					show(input);
				});
				
				// Show selector when input receives focus
				input.on('focus.miniColors', function(event) {
					if( input.val() === '' ) input.val('#');
					show(input);
				});
				
				// Hide on blur
				input.on('blur.miniColors', function(event) {
					var hex = input.data('hex');
					input.val( convertCase(hex, input.data('letterCase')) );
				});
				
				// Hide when tabbing out of the input
				input.on('keydown.miniColors', function(event) {
					switch( event.keyCode ) {
						case 9:
							hide(input);
							break;
						case 27:
							hide(input);
							input.blur();
							break;
					}
				});
				
				// Update when color is typed in
				input.on('keyup.miniColors', function(event) {
					setColorFromInput(input);
				});
				
				// Handle pasting
				input.on('paste.miniColors', function(event) {
					// Short pause to wait for paste to complete
					setTimeout( function() {
						setColorFromInput(input);
					}, 5);
				});
				
			}
			
			function destroy(input) {
				//
				// Destroys an active instance of the miniColors selector
				//
				hide();
				input = $(input);
				
				// Restore to original state
				input.data('trigger').parent().remove();
				input
					.attr('autocomplete', input.data('original-autocomplete'))
					.attr('maxlength', input.data('original-maxlength'))
					.removeData()
					.removeClass('miniColors')
					.off('.miniColors');
				$(document).off('.miniColors');
			}
			
			function enable(input) {
				//
				// Enables the input control and the selector
				//
				input
					.prop('disabled', false)
					.data('trigger').parent().removeClass('disabled');
			}
			
			function disable(input) {
				//
				// Disables the input control and the selector
				//
				hide(input);
				input
					.prop('disabled', true)
					.data('trigger').parent().addClass('disabled');
			}
			
			function show(input) {
				
				var hex,
					colorPosition,
					huePosition,
					opacityPosition,
					hidden,
					top,
					left,
					trigger,
					triggerWidth,
					triggerHeight,
					selector = $('<div class="miniColors-selector"></div>'),
					selectorWidth,
					selectorHeight,
					windowHeight,
					windowWidth,
					scrollTop,
					scrollLeft;
				
				if( input.prop('disabled') || !input.is('.miniColors') ) return false;
				
				// Hide all other instances 
				hide();				
                
				// Generate the selector
				selector
					.append('<div class="miniColors-hues"><div class="miniColors-huePicker"></div></div>')
					.append('<div class="miniColors-colors" style="background-color: #FFF;"><div class="miniColors-colorPicker"><div class="miniColors-colorPicker-inner"></div></div>')
					.css('display', 'none')
					.addClass( input.attr('class') );
				
				// Opacity
				if( input.data('opacity') ) {
					selector
						.addClass('opacity')
						.prepend('<div class="miniColors-opacity"><div class="miniColors-opacityPicker"></div></div>');
				}
				
				// Set background for colors
				hex = input.data('hex');
				selector
					.find('.miniColors-colors').css('backgroundColor', hex).end()
					.find('.miniColors-opacity').css('backgroundColor', hex).end();
				
				// Set colorPicker position
				colorPosition = input.data('colorPosition');
				if( !colorPosition ) colorPosition = getColorPositionFromHex(hex);
				selector.find('.miniColors-colorPicker')
					.css('top', colorPosition.y + 'px')
					.css('left', colorPosition.x + 'px');
				
				// Set huePicker position
				huePosition = input.data('huePosition');
				if( !huePosition ) huePosition = getHuePositionFromHex(hex);
				selector.find('.miniColors-huePicker').css('top', huePosition + 'px');
				
				// Set opacity position
				opacityPosition = input.data('opacityPosition');
				if( !opacityPosition ) opacityPosition = getOpacityPositionFromAlpha(input.attr('data-opacity'));
				selector.find('.miniColors-opacityPicker').css('top', opacityPosition + 'px');
				
				// Set input data
				input
					.data('selector', selector)
					.data('huePicker', selector.find('.miniColors-huePicker'))
					.data('opacityPicker', selector.find('.miniColors-opacityPicker'))
					.data('colorPicker', selector.find('.miniColors-colorPicker'))
					.data('mousebutton', 0);
				
				$('BODY').append(selector);
				
				// Position the selector
				trigger = input.data('trigger');
				hidden = !input.is(':visible');
				top = hidden ? trigger.offset().top + trigger.outerHeight() : input.offset().top + input.outerHeight();
				left = hidden ? trigger.offset().left : input.offset().left;
				selectorWidth = selector.outerWidth();
				selectorHeight = selector.outerHeight();
				triggerWidth = trigger.outerWidth();
				triggerHeight = trigger.outerHeight();
				windowHeight = $(window).height();
				windowWidth = $(window).width();
				scrollTop = $(window).scrollTop();
				scrollLeft = $(window).scrollLeft();
				
				// Adjust based on viewport
				if( (top + selectorHeight) > windowHeight + scrollTop ) top = top - selectorHeight - triggerHeight;
				if( (left + selectorWidth) > windowWidth + scrollLeft ) left = left - selectorWidth + triggerWidth;
				
				// Set position and show
				selector.css({
					top: top,
					left: left
				}).fadeIn(100);
				
				// Prevent text selection in IE
				selector.on('selectstart', function() { return false; });
				
				// Hide on resize (IE7/8 trigger this when any element is resized...)
				if( !$.browser.msie || ($.browser.msie && $.browser.version >= 9) ) {
					$(window).on('resize.miniColors', function(event) {
						hide(input);
					});
				}
				
				$(document)
					.on('mousedown.miniColors touchstart.miniColors', function(event) {
						
						var testSubject = $(event.target).parents().andSelf();
						
						input.data('mousebutton', 1);
						
						if( testSubject.hasClass('miniColors-colors') ) {
							event.preventDefault();
							input.data('moving', 'colors');
							moveColor(input, event);
						}
						
						if( testSubject.hasClass('miniColors-hues') ) {
							event.preventDefault();
							input.data('moving', 'hues');
							moveHue(input, event);
						}
						
						if( testSubject.hasClass('miniColors-opacity') ) {
							event.preventDefault();
							input.data('moving', 'opacity');
							moveOpacity(input, event);
						}
						
						if( testSubject.hasClass('miniColors-selector') ) {
							event.preventDefault();
							return;
						}
						
						if( testSubject.hasClass('miniColors') ) return;
						
						hide(input);
					})
					.on('mouseup.miniColors touchend.miniColors', function(event) {
					    event.preventDefault();
						input.data('mousebutton', 0).removeData('moving');
					})
					.on('mousemove.miniColors touchmove.miniColors', function(event) {
						event.preventDefault();
						if( input.data('mousebutton') === 1 ) {
							if( input.data('moving') === 'colors' ) moveColor(input, event);
							if( input.data('moving') === 'hues' ) moveHue(input, event);
							if( input.data('moving') === 'opacity' ) moveOpacity(input, event);
						}
					});
				
				// Fire open callback
				if( input.data('open') ) fireCallback(input, 'open');
				
			}
			
			function hide(input) {
				
				//
				// Hides one or more miniColors selectors
				//
				
				// Hide all other instances if input isn't specified
				if( !input ) input = $('.miniColors');
				
				input.each( function() {
					
					var selector = $(this).data('selector');
					
					$(this).removeData('selector');
					$(selector).fadeOut(100, function() {
						// Fire close callback
						if( input.data('close') ) fireCallback(input, 'close');
						$(this).remove();
					});
					
				});
				
				$(document).off('.miniColors');
				
			}
			
			function fireCallback(input, callback) {
				
				var hex = input.data('hex'),
					rgb = hex2rgb(hex);
				
				// Always return RGBA
				$.extend(rgb, { a: input.data('opacity') ? parseFloat(input.attr('data-opacity')) : 1 });
				
				if( input.data(callback) ) input.data(callback).call(input.get(0), convertCase(hex, o.letterCase), rgb);
				
			}
			
			function moveColor(input, event) {

				var s, b, hex, hsb,
					colorPicker = input.data('colorPicker'),
					position = {
						x: event.pageX,
						y: event.pageY
					};
				
				colorPicker.hide();
				
				// Touch support
				if( event.originalEvent.changedTouches ) {
					position.x = event.originalEvent.changedTouches[0].pageX;
					position.y = event.originalEvent.changedTouches[0].pageY;
				}
				position.x = position.x - input.data('selector').find('.miniColors-colors').offset().left - 6;
				position.y = position.y - input.data('selector').find('.miniColors-colors').offset().top - 6;
				if( position.x <= -5 ) position.x = -5;
				if( position.x >= 144 ) position.x = 144;
				if( position.y <= -5 ) position.y = -5;
				if( position.y >= 144 ) position.y = 144;
				
				input.data('colorPosition', position);
				colorPicker.css('left', position.x).css('top', position.y).show();
				
				// Calculate saturation
				s = Math.round((position.x + 5) * 0.67);
				if( s < 0 ) s = 0;
				if( s > 100 ) s = 100;
				
				// Calculate brightness
				b = 100 - Math.round((position.y + 5) * 0.67);
				if( b < 0 ) b = 0;
				if( b > 100 ) b = 100;
				
				// Update HSB values
				hex = input.data('hex');
				hsb = hex2hsb(hex);
				hsb.s = s;
				hsb.b = b;
				hex = hsb2hex(hsb);
				
				// Set color
				setColor(input, hex, true);
			}
			
			function moveHue(input, event) {
				
				var h, hex, hsb,
					huePicker = input.data('huePicker'),
					position = event.pageY;
				
				huePicker.hide();
				
				// Touch support
				if( event.originalEvent.changedTouches ) {
					position = event.originalEvent.changedTouches[0].pageY;
				}
				
				position = position - input.data('selector').find('.miniColors-colors').offset().top - 1;
				if( position <= -1 ) position = -1;
				if( position >= 149 ) position = 149;
				input.data('huePosition', position);
				huePicker.css('top', position).show();
				
				// Calculate hue
				h = Math.round((150 - position - 1) * 2.4);
				if( h < 0 ) h = 0;
				if( h > 360 ) h = 360;
				
				// Update HSB values
				hex = input.data('hex');
				hsb = hex2hsb(hex);
				hsb.h = h;
				hex = hsb2hex(hsb);
				
				// Set color
				setColor(input, hex, true);
				
			}
			
			function moveOpacity(input, event) {
				
				var alpha,
					opacityPicker = input.data('opacityPicker'),
					position = event.pageY;
				
				opacityPicker.hide();
				
				// Touch support
				if( event.originalEvent.changedTouches ) {
					position = event.originalEvent.changedTouches[0].pageY;
				}
				
				position = position - input.data('selector').find('.miniColors-colors').offset().top - 1;
				if( position <= -1 ) position = -1;
				if( position >= 149 ) position = 149;
				input.data('opacityPosition', position);
				opacityPicker.css('top', position).show();
				
				// Calculate opacity
				alpha = parseFloat((150 - position - 1) / 150).toFixed(2);
				if( alpha < 0 ) alpha = 0;
				if( alpha > 1 ) alpha = 1;
				
				// Update opacity
				input
					.data('alpha', alpha)
					.attr('data-opacity', alpha);
				
				// Set color
				setColor(input, input.data('hex'), true);
				
			}
			
			function setColor(input, hex, updateInput) {
				
				var selector = $(input.data('selector')),
					rgb = hex2rgb(hex),
					hsb = hex2hsb(hex);
				
				hex = cleanHex(expandHex(hex));
				if( !hex ) return;
				hex = '#' + hex;
				
				if( updateInput ) input.val( convertCase(hex, input.data('letterCase')) );
				
				input.data('hex', '#' + cleanHex(expandHex(hex)));
				selector
					.find('.miniColors-colors').css('backgroundColor', '#' + hsb2hex({ h: hsb.h, s: 100, b: 100 })).end()
					.find('.miniColors-opacity').css('backgroundColor', hex).end();
				
				// Set background color (also fallback for non RGBA browsers)
				input.data('trigger').css('backgroundColor', hex);
				
				// Set background color + opacity
				if( input.data('opacity') ) {
					input.data('trigger').css('backgroundColor', 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + input.attr('data-opacity') + ')');
				}
				
				// Fire change callback
				if( input.data('change') ) {
					if( (hex + ',' + input.attr('data-opacity')) === input.data('lastChange') ) return;
					fireCallback(input, 'change');
					input.data('lastChange', hex + ',' + input.attr('data-opacity'));
				}
				
			}
			
			function setColorFromInput(input) {
				
				var hex,
					colorPosition,
					colorPicker,
					huePosition,
					huePicker,
					opacityPosition,
					opacityPicker;
				
				// Get hex value
				hex = cleanHex(input.val());
				if( !hex ) return false;
				hex = '#' + hex;
				
				input.val(hex);
				
				// Set colorPicker position
				colorPosition = getColorPositionFromHex(hex);
				colorPicker = $(input.data('colorPicker'));
				colorPicker.css('top', colorPosition.y + 'px').css('left', colorPosition.x + 'px');
				input.data('colorPosition', colorPosition);
				
				// Set huePosition position
				huePosition = getHuePositionFromHex(hex);
				huePicker = $(input.data('huePicker'));
				huePicker.css('top', huePosition + 'px');
				input.data('huePosition', huePosition);
				
				// Set opacity position
				opacityPosition = getOpacityPositionFromAlpha(input.attr('data-opacity'));
				opacityPicker = $(input.data('opacityPicker'));
				opacityPicker.css('top', opacityPosition + 'px');
				input.data('opacityPosition', opacityPosition);
				setColor(input, hex);
				
				return true;
				
			}
			
			function convertCase(string, letterCase) {
				if( letterCase === 'uppercase' ) {
					return string.toUpperCase();
				} else {
					return string.toLowerCase();
				}
			}
			
			function getColorPositionFromHex(hex) {
				var hsb = hex2hsb(hex),
					x = Math.ceil(hsb.s / 0.67);
				if( x < 0 ) x = 0;
				if( x > 150 ) x = 150;
				var y = 150 - Math.ceil(hsb.b / 0.67);
				if( y < 0 ) y = 0;
				if( y > 150 ) y = 150;
				return { x: x - 5, y: y - 5 };
			}
			
			function getHuePositionFromHex(hex) {
				var hsb = hex2hsb(hex),
					y = 150 - (hsb.h / 2.4);
				if( y < 0 ) h = 0;
				if( y > 150 ) h = 150;				
				return y;
			}
			
			function getOpacityPositionFromAlpha(alpha) {
				var y = 150 * alpha;
				if( y < 0 ) y = 0;
				if( y > 150 ) y = 150;
				return 150 - y;
			}
			
			function cleanHex(hex) {
				if( hex ) return hex.replace(/[^A-F0-9]/ig, '');
			}
			
			function expandHex(hex) {
				hex = cleanHex(hex);
				if( !hex ) return null;
				if( hex.length === 3 ) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
				return hex.length === 6 ? hex : null;
			}			
			
			function hsb2rgb(hsb) {
				var rgb = {};
				var h = Math.round(hsb.h);
				var s = Math.round(hsb.s*255/100);
				var v = Math.round(hsb.b*255/100);
				if(s === 0) {
					rgb.r = rgb.g = rgb.b = v;
				} else {
					var t1 = v;
					var t2 = (255 - s) * v / 255;
					var t3 = (t1 - t2) * (h % 60) / 60;
					if( h === 360 ) h = 0;
					if( h < 60 ) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3; }
					else if( h < 120 ) {rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3; }
					else if( h < 180 ) {rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3; }
					else if( h < 240 ) {rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3; }
					else if( h < 300 ) {rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3; }
					else if( h < 360 ) {rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3; }
					else { rgb.r = 0; rgb.g = 0; rgb.b = 0; }
				}
				return {
					r: Math.round(rgb.r),
					g: Math.round(rgb.g),
					b: Math.round(rgb.b)
				};
			}
			
			function rgb2hex(rgb) {
				var hex = [
					rgb.r.toString(16),
					rgb.g.toString(16),
					rgb.b.toString(16)
				];
				$.each(hex, function(nr, val) {
					if (val.length === 1) hex[nr] = '0' + val;
				});
				return hex.join('');
			}
			
			function hex2rgb(hex) {
				hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
				
				return {
					r: hex >> 16,
					g: (hex & 0x00FF00) >> 8,
					b: (hex & 0x0000FF)
				};
			}
			
			function rgb2hsb(rgb) {
				var hsb = { h: 0, s: 0, b: 0 };
				var min = Math.min(rgb.r, rgb.g, rgb.b);
				var max = Math.max(rgb.r, rgb.g, rgb.b);
				var delta = max - min;
				hsb.b = max;
				hsb.s = max !== 0 ? 255 * delta / max : 0;
				if( hsb.s !== 0 ) {
					if( rgb.r === max ) {
						hsb.h = (rgb.g - rgb.b) / delta;
					} else if( rgb.g === max ) {
						hsb.h = 2 + (rgb.b - rgb.r) / delta;
					} else {
						hsb.h = 4 + (rgb.r - rgb.g) / delta;
					}
				} else {
					hsb.h = -1;
				}
				hsb.h *= 60;
				if( hsb.h < 0 ) {
					hsb.h += 360;
				}
				hsb.s *= 100/255;
				hsb.b *= 100/255;
				return hsb;
			}
			
			function hex2hsb(hex) {
				var hsb = rgb2hsb(hex2rgb(hex));
				// Zero out hue marker for black, white, and grays (saturation === 0)
				if( hsb.s === 0 ) hsb.h = 360;
				return hsb;
			}
			
			function hsb2hex(hsb) {
				return rgb2hex(hsb2rgb(hsb));
			}

			
			// Handle calls to $([selector]).miniColors()
			switch(o) {
				
				case 'hide':
					hide( $(this) );
					return $(this);
				
				case 'show':
					show( $(this) );
					return $(this);
				
				case 'readonly':
					
					$(this).each( function() {
						if( !$(this).hasClass('miniColors') ) return;
						$(this).prop('readonly', data);
					});
					
					return $(this);
				
				case 'disabled':
					
					$(this).each( function() {
						if( !$(this).hasClass('miniColors') ) return;
						if( data ) {
							disable($(this));
						} else {
							enable($(this));
						}
					});
										
					return $(this);
			
				case 'value':
					
					// Getter
					if( data === undefined ) {
						if( !$(this).hasClass('miniColors') ) return;
						var input = $(this),
							hex = expandHex(input.val());
						return hex ? '#' + convertCase(cleanHex(hex), input.data('letterCase')) : null;
					}
					
					// Setter
					$(this).each( function() {
						if( !$(this).hasClass('miniColors') ) return;
						$(this).val(data);
						setColorFromInput($(this));
					});
					
					return $(this);
				
				case 'opacity':
					
					// Getter
					if( data === undefined ) {
						if( !$(this).hasClass('miniColors') ) return;
						if( $(this).data('opacity') ) {
							return parseFloat($(this).attr('data-opacity'));
						} else {
							return 1;
						}
					}
					
					// Setter
					$(this).each( function() {
						if( !$(this).hasClass('miniColors') ) return;
						if( data < 0 ) data = 0;
						if( data > 1 ) data = 1;
						$(this).attr('data-opacity', data).data('alpha', data);
						setColorFromInput($(this));
					});
					
					return $(this);
					
				case 'destroy':
					
					$(this).each( function() {
						if( !$(this).hasClass('miniColors') ) return;
						destroy($(this));
					});
										
					return $(this);
				
				default:
					
					if( !o ) o = {};
					
					$(this).each( function() {
						
						// Must be called on an input element
						if( $(this)[0].tagName.toLowerCase() !== 'input' ) return;
						
						// If a trigger is present, the control was already created
						if( $(this).data('trigger') ) return;
						
						// Create the control
						create($(this), o, data);
						
					});
					
					return $(this);
					
			}
			
		}
			
	});
	
})(jQuery);