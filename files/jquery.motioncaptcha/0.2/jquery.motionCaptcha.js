/*!
 * jQuery MotionCAPTCHA v0.2
 * 
 * Proof of concept only for now, check the roadmap to see when it will be ready for wider use!
 * 
 * http://josscrowcroft.com/projects/motioncaptcha-jquery-plugin/
 * 
 * DEMO: http://josscrowcroft.com/demos/motioncaptcha/
 * CODE: https://github.com/josscrowcroft/MotionCAPTCHA
 * 
 * Copyright (c) 2011 Joss Crowcroft - joss[at]josscrowcroftcom | http://www.josscrowcroft.com
 * 
 * Incoporates other open source projects, attributed below.
 */
jQuery.fn.motionCaptcha || (function($) {
	
	/**
	 * Main plugin function definition
	 */
	$.fn.motionCaptcha = function(options) {
		
		/**
		 * Act on matched form element:
		 * This could be set up to iterate over multiple elements, but tbh would it ever be useful?
		 */
		return this.each(function() {
				
			// Build main options before element iteration:
			var opts = $.extend({}, $.fn.motionCaptcha.defaults, options);
			
			// Ensure option ID params are valid #selectors:
			opts.actionId = '#' + opts.actionId.replace(/\#/g, '');
			opts.canvasId = '#' + opts.canvasId.replace(/\#/g, '');
			opts.divId = '#' + opts.divId.replace(/\#/g, '');
			opts.submitId = ( opts.submitId ) ? '#' + opts.submitId.replace(/\#/g, '') : false;

			// Plugin setup:

			// Set up Harmony vars:
			var brush,
				locked = false;
				
			// Set up MotionCAPTCHA form and jQuery elements:
			var $body = $('body'),
				$form = $(this),
				$container = $(opts.divId),
				$canvas = $(opts.canvasId);
			
			// Set up MotionCAPTCHA canvas vars:
			var canvasWidth = $canvas.width(),
				canvasHeight = $canvas.height(),
				borderLeftWidth = 1 * $canvas.css('borderLeftWidth').replace('px', ''),
				borderTopWidth = 1 * $canvas.css('borderTopWidth').replace('px', '');			

			// Canvas setup:
			
			// Set the canvas DOM element's dimensions to match the display width/height (pretty important):
			$canvas[0].width = canvasWidth;
			$canvas[0].height = canvasHeight;
			
			// Get DOM reference to canvas context:
			var ctx = $canvas[0].getContext("2d");
			
			// Add canvasWidth and canvasHeight values to context, for Ribbon brush:
			ctx.canvasWidth = canvasWidth;
			ctx.canvasHeight = canvasHeight;
			
			// Set canvas context font and fillStyle:
			ctx.font = opts.canvasFont;
			ctx.fillStyle = opts.canvasTextColor;
			
			// Set random shape
			$canvas.addClass( opts.shapes[Math.floor(Math.random() * (opts.shapes.length) )] );
			
			// Set up Dollar Recognizer and drawing vars:
			var _isDown = false,
				_holdStill = false,
				_points = [], 
				_r = new DollarRecognizer();

			// Create the Harmony Ribbon brush:
			brush = new Ribbon(ctx);
			



			// Mousedown event
			// Start Harmony brushstroke and begin recording DR points:
			var touchStartEvent = function(event) {
				if ( locked )
					return false;
				
				// Prevent default action:
				event.preventDefault();
				
				// Get mouse position inside the canvas:
				var pos = getPos(event),
					x = pos[0],
					y = pos[1];
				
				// Internal drawing var	
				_isDown = true;
				
				// Prevent jumpy-touch bug on android, no effect on other platforms:
				_holdStill = true;
				
				// Disable text selection:
				$('body').addClass('mc-noselect');
				
				// Clear canvas:
				ctx.clearRect(0, 0, canvasWidth, canvasHeight);
				
				// Start brushstroke:
				brush.strokeStart(x, y);

				// Remove 'mc-invalid' and 'mc-valid' classes from canvas:
				$canvas.removeClass('mc-invalid mc-valid');
				
				// Add the first point to the points array:
				_points = [NewPoint(x, y)];

				return false;
			}; // mousedown/touchstart event

			// Mousemove event:
			var touchMoveEvent = function(event) {
				if ( _holdStill ) {
					return _holdStill = 0;
				}
				// If mouse is down and canvas not locked:
				if ( !locked && _isDown ) {
									
					// Prevent default action:
					event.preventDefault();

					// Get mouse position inside the canvas:
					var pos = getPos(event),
						x = pos[0],
						y = pos[1];
					
					// Append point to points array:
					_points[_points.length] = NewPoint(x, y);
					
					// Do brushstroke:
					brush.stroke(x, y);
				}
				return false;
			}; // mousemove/touchmove event
			
			
			// Mouseup event:
			var touchEndEvent = function(event) {
				// If mouse is down and canvas not locked:
				if ( !locked && _isDown ) {
					_isDown = false;
					
					// Allow text-selection again:
					$('body').removeClass('mc-noselect');
					
					// Dollar Recognizer result:
					if (_points.length >= 10) {
						var result = _r.Recognize(_points);
						// Check result:
						if ( $canvas.attr('class').match(result.Name) && result.Score > 0.7 ) {
							
							// Lock the canvas:
							locked = 1;
							
							// Destroy the Harmony brush (give it time to finish drawing)
							setTimeout( brush.destroy, 500 );
							
							// Add 'mc-valid' class to canvas:
							$canvas.addClass('mc-valid');
							
							// Write success message into canvas:
							ctx.fillText(opts.successMsg, 10, 24);
							
							// Call the onSuccess function to handle the rest of the business:
							// Pass in the form, the canvas, the canvas context:
							opts.onSuccess($form, $canvas, ctx);
							
						} else {
							
							// Add 'mc-invalid' class to canvas:
							$canvas.addClass('mc-invalid');
							
							// Write error message into canvas:
							ctx.fillText(opts.errorMsg, 10, 24);
							
							// Pass off to the error callback to finish up:
							opts.onError($form, $canvas, ctx);
						}
						
					} else { // fewer than 10 points were recorded:
						
						// Add 'mc-invalid' class to canvas:
						$canvas.addClass('mc-invalid');
						
						// Write error message into canvas:
						ctx.fillText(opts.errorMsg, 10, 24);

						// Pass off to the error callback to finish up:
						opts.onError($form, $canvas, ctx);
					}
				}
				return false;
			}; // mouseup/touchend event

			// Bind events to canvas:
			$canvas.bind({
				mousedown:  touchStartEvent,
				mousemove: touchMoveEvent,
				mouseup:  touchEndEvent,
			});

			// Mobile touch events:
			$canvas[0].addEventListener('touchstart', touchStartEvent, false);
			$canvas[0].addEventListener('touchmove', touchMoveEvent, false);
			$canvas[0].addEventListener('touchend', touchEndEvent, false);

			// Add active CSS class to form:
			$form.addClass(opts.cssClass.replace(/\./, ''))

		
			/**
			 * Get X/Y mouse position, relative to (/inside) the canvas
			 * 
			 * Handles cross-browser quirks rather nicely, I feel.
			 * 
			 * @todo For 1.0, if no way to obtain coordinates, don't activate MotionCAPTCHA.
			 */
			function getPos(event) {
				var x, y;
				
				// Check for mobile first to avoid android jumpy-touch bug (iOS / Android):
				if ( event.touches && event.touches.length > 0 ) {
					// iOS/android uses event.touches, relative to entire page:
					x = event.touches[0].pageX - $canvas.offset().left + borderLeftWidth;
					y = event.touches[0].pageY - $canvas.offset().top + borderTopWidth;
				} else if ( event.offsetX ) {
					// Chrome/Safari give the event offset relative to the target event:
					x = event.offsetX - borderLeftWidth;
					y = event.offsetY - borderTopWidth;
				} else {
					// Otherwise, subtract page click from canvas offset (Firefox uses this):
					x = event.pageX - $canvas.offset().left - borderLeftWidth;
					y = event.pageY - $canvas.offset().top - borderTopWidth;
				}
				return [x,y];
			}

		}); // this.each

	} // end main plugin function
	
	
	/**
	 * Exposed default plugin settings, which can be overridden in plugin call.
	 */
	$.fn.motionCaptcha.defaults = {
		actionId: '#mc-action',     // The ID of the input containing the form action
		divId: '#mc',               // If you use an ID other than '#mc' for the placeholder, pass it in here
		canvasId: '#mc-canvas',     // The ID of the MotionCAPTCHA canvas element
		submitId: false,            // If your form has multiple submit buttons, give the ID of the main one here
		cssClass: '.mc-active',     // This CSS class is applied to the form, when the plugin is active
	
		// An array of shape names that you want MotionCAPTCHA to use:
		shapes: ['triangle', 'x', 'rectangle', 'circle', 'check', 'caret', 'zigzag', 'arrow', 'leftbracket', 'rightbracket', 'v', 'delete', 'star', 'pigtail'],
		
		// Canvas vars:
		canvasFont: '15px "Lucida Grande"',
		canvasTextColor: '#111',
		
		// These messages are displayed inside the canvas after a user finishes drawing:
		errorMsg: 'Please try again.',
		successMsg: 'Captcha passed!',
		
		// This message is displayed if the user's browser doesn't support canvas:
		noCanvasMsg: "Your browser doesn't support <canvas> - try Chrome, FF4, Safari or IE9.",
		
		// This could be any HTML string (eg. '<label>Draw this shit yo:</label>'):
		label: '<p>Please draw the shape in the box to submit the form:</p>',
		
		// Callback function to execute when a user successfully draws the shape
		// Passed in the form, the canvas and the canvas context
		// Scope (this) is active plugin options object (opts)
		// NB: The default onSuccess callback function enables the submit button, and adds the form action attribute:
		onSuccess: function($form, $canvas, ctx) {
			var opts = this,
				$submit = opts.submitId ? $form.find(opts.submitId) : $form.find('input[type=submit]:disabled');
						
			// Set the form action:
			$form.attr( 'action', $(opts.actionId).val() );
			
			// Enable the submit button:
			$submit.prop('disabled', false);
			
			return;
		},
		
		// Callback function to execute when a user successfully draws the shape
		// Passed in the form, the canvas and the canvas context
		// Scope (this) is active plugin options object (opts)
		onError: function($form, $canvas, ctx) {
			var opts = this;
			return;
		}
	};
	




	/*!
	 * Harmony | mrdoob | Ribbon Brush class
	 * http://mrdoob.com/projects/harmony/
	 */
	
	function Ribbon( ctx ) {
		this.init( ctx );
	}
	
	Ribbon.prototype = {
		ctx: null,
		X: null, 
		Y: null,
		painters: null,
		interval: null,
		init: function( ctx ) {
			var scope = this,
				userAgent = navigator.userAgent.toLowerCase(),
				brushSize = ( userAgent.search("android") > -1 || userAgent.search("iphone") > -1 ) ? 2 : 1,
				strokeColor = [0, 0, 0];
			
			this.ctx = ctx;
			this.ctx.globalCompositeOperation = 'source-over';
			
			this.X = this.ctx.canvasWidth / 2;
			this.Y = this.ctx.canvasHeight / 2;
	
			this.painters = [];
			
			// Draw each of the lines:
			for ( var i = 0; i < 38; i++ ) {
				this.painters.push({
					dx: this.ctx.canvasWidth / 2, 
					dy: this.ctx.canvasHeight / 2, 
					ax: 0, 
					ay: 0, 
					div: 0.1, 
					ease: Math.random() * 0.18 + 0.60
				});
			}
			
			// Set the ticker:
			this.interval = setInterval( update, 1000/60 );
			
			function update() {
				var i;
				
				scope.ctx.lineWidth = brushSize;			
				scope.ctx.strokeStyle = "rgba(" + strokeColor[0] + ", " + strokeColor[1] + ", " + strokeColor[2] + ", " + 0.06 + ")";
				
				for ( i = 0; i < scope.painters.length; i++ ) {
					scope.ctx.beginPath();
					scope.ctx.moveTo(scope.painters[i].dx, scope.painters[i].dy);
					
					scope.painters[i].dx -= scope.painters[i].ax = (scope.painters[i].ax + (scope.painters[i].dx - scope.X) * scope.painters[i].div) * scope.painters[i].ease;
					scope.painters[i].dy -= scope.painters[i].ay = (scope.painters[i].ay + (scope.painters[i].dy - scope.Y) * scope.painters[i].div) * scope.painters[i].ease;
					scope.ctx.lineTo(scope.painters[i].dx, scope.painters[i].dy);
					scope.ctx.stroke();
				}
			}
		},
		destroy: function() {
			clearInterval(this.interval);
		},
		strokeStart: function( X, Y ) {
			this.X = X;
			this.Y = Y
	
			for (var i = 0; i < this.painters.length; i++) {
				this.painters[i].dx = X;
				this.painters[i].dy = Y;
			}
	
			this.shouldDraw = true;
		},
		stroke: function( X, Y ) {
			this.X = X;
			this.Y = Y;
		}
	};

	
	
	/*!
	 * The $1 Unistroke Recognizer
	 * http://depts.washington.edu/aimgroup/proj/dollar/
	 * 
	 * Jacob O. Wobbrock, Ph.D. | wobbrock@u.washington.edu
	 * Andrew D. Wilson, Ph.D. | awilson@microsoft.com
	 * Yang Li, Ph.D. | yangli@cs.washington.edu
	 * 
	 * Modified to include the Protractor gesture recognizing algorithm
	 * http://www.yangl.org/pdf/protractor-chi2010.pdf
	 * 
	 * Adapted and modified for purpose by Joss Crowcroft
	 * http://www.josscrowcroft.com
	 * 
	 * The original software is distributed under the "New BSD License" agreement
	 * 
	 * Copyright (c) 2007-2011, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li. All rights reserved.
	**/
	
	// Point class
	function Point(x, y) {
		this.X = x;
		this.Y = y;
	}
	
	// Wrapper for Point class (saves mega kb when compressing the template definitions):
	function NewPoint(x, y) {
		return new Point(x, y)
	}
	
	// Rectangle class
	function Rectangle(x, y, width, height) {
		this.X = x;
		this.Y = y;
		this.Width = width;
		this.Height = height;
	}
	
	// Template class: a unistroke template
	function Template(name, points) {
		this.Name = name;
		this.Points = Resample(points, NumPoints);
		var radians = IndicativeAngle(this.Points);
		this.Points = RotateBy(this.Points, -radians);
		this.Points = ScaleTo(this.Points, SquareSize);
		this.Points = TranslateTo(this.Points, Origin);
		this.Vector = Vectorize(this.Points); // for Protractor
	}
	
	// Result class
	function Result(name, score) {
		this.Name = name;
		this.Score = score;
	}
	
	// DollarRecognizer class constants
	var NumTemplates = 16,
		NumPoints = 64,
		SquareSize = 250.0,
		Origin = NewPoint(0,0);
	
	// DollarRecognizer class
	function DollarRecognizer() {
	
		// Predefined templates for each gesture type:
		this.Templates = [];
		
		this.Templates.push( new Template("triangle", [NewPoint(137,139),NewPoint(135,141),NewPoint(133,144),NewPoint(132,146),NewPoint(130,149),NewPoint(128,151),NewPoint(126,155),NewPoint(123,160),NewPoint(120,166),NewPoint(116,171),NewPoint(112,177),NewPoint(107,183),NewPoint(102,188),NewPoint(100,191),NewPoint(95,195),NewPoint(90,199),NewPoint(86,203),NewPoint(82,206),NewPoint(80,209),NewPoint(75,213),NewPoint(73,213),NewPoint(70,216),NewPoint(67,219),NewPoint(64,221),NewPoint(61,223),NewPoint(60,225),NewPoint(62,226),NewPoint(65,225),NewPoint(67,226),NewPoint(74,226),NewPoint(77,227),NewPoint(85,229),NewPoint(91,230),NewPoint(99,231),NewPoint(108,232),NewPoint(116,233),NewPoint(125,233),NewPoint(134,234),NewPoint(145,233),NewPoint(153,232),NewPoint(160,233),NewPoint(170,234),NewPoint(177,235),NewPoint(179,236),NewPoint(186,237),NewPoint(193,238),NewPoint(198,239),NewPoint(200,237),NewPoint(202,239),NewPoint(204,238),NewPoint(206,234),NewPoint(205,230),NewPoint(202,222),NewPoint(197,216),NewPoint(192,207),NewPoint(186,198),NewPoint(179,189),NewPoint(174,183),NewPoint(170,178),NewPoint(164,171),NewPoint(161,168),NewPoint(154,160),NewPoint(148,155),NewPoint(143,150),NewPoint(138,148),NewPoint(136,148)]) );
		
		this.Templates.push( new Template("x", [NewPoint(87,142),NewPoint(89,145),NewPoint(91,148),NewPoint(93,151),NewPoint(96,155),NewPoint(98,157),NewPoint(100,160),NewPoint(102,162),NewPoint(106,167),NewPoint(108,169),NewPoint(110,171),NewPoint(115,177),NewPoint(119,183),NewPoint(123,189),NewPoint(127,193),NewPoint(129,196),NewPoint(133,200),NewPoint(137,206),NewPoint(140,209),NewPoint(143,212),NewPoint(146,215),NewPoint(151,220),NewPoint(153,222),NewPoint(155,223),NewPoint(157,225),NewPoint(158,223),NewPoint(157,218),NewPoint(155,211),NewPoint(154,208),NewPoint(152,200),NewPoint(150,189),NewPoint(148,179),NewPoint(147,170),NewPoint(147,158),NewPoint(147,148),NewPoint(147,141),NewPoint(147,136),NewPoint(144,135),NewPoint(142,137),NewPoint(140,139),NewPoint(135,145),NewPoint(131,152),NewPoint(124,163),NewPoint(116,177),NewPoint(108,191),NewPoint(100,206),NewPoint(94,217),NewPoint(91,222),NewPoint(89,225),NewPoint(87,226),NewPoint(87,224)]) );
		
		this.Templates.push( new Template("rectangle", [NewPoint(78,149),NewPoint(78,153),NewPoint(78,157),NewPoint(78,160),NewPoint(79,162),NewPoint(79,164),NewPoint(79,167),NewPoint(79,169),NewPoint(79,173),NewPoint(79,178),NewPoint(79,183),NewPoint(80,189),NewPoint(80,193),NewPoint(80,198),NewPoint(80,202),NewPoint(81,208),NewPoint(81,210),NewPoint(81,216),NewPoint(82,222),NewPoint(82,224),NewPoint(82,227),NewPoint(83,229),NewPoint(83,231),NewPoint(85,230),NewPoint(88,232),NewPoint(90,233),NewPoint(92,232),NewPoint(94,233),NewPoint(99,232),NewPoint(102,233),NewPoint(106,233),NewPoint(109,234),NewPoint(117,235),NewPoint(123,236),NewPoint(126,236),NewPoint(135,237),NewPoint(142,238),NewPoint(145,238),NewPoint(152,238),NewPoint(154,239),NewPoint(165,238),NewPoint(174,237),NewPoint(179,236),NewPoint(186,235),NewPoint(191,235),NewPoint(195,233),NewPoint(197,233),NewPoint(200,233),NewPoint(201,235),NewPoint(201,233),NewPoint(199,231),NewPoint(198,226),NewPoint(198,220),NewPoint(196,207),NewPoint(195,195),NewPoint(195,181),NewPoint(195,173),NewPoint(195,163),NewPoint(194,155),NewPoint(192,145),NewPoint(192,143),NewPoint(192,138),NewPoint(191,135),NewPoint(191,133),NewPoint(191,130),NewPoint(190,128),NewPoint(188,129),NewPoint(186,129),NewPoint(181,132),NewPoint(173,131),NewPoint(162,131),NewPoint(151,132),NewPoint(149,132),NewPoint(138,132),NewPoint(136,132),NewPoint(122,131),NewPoint(120,131),NewPoint(109,130),NewPoint(107,130),NewPoint(90,132),NewPoint(81,133),NewPoint(76,133)]) );
		
		this.Templates.push( new Template("circle", [NewPoint(127,141),NewPoint(124,140),NewPoint(120,139),NewPoint(118,139),NewPoint(116,139),NewPoint(111,140),NewPoint(109,141),NewPoint(104,144),NewPoint(100,147),NewPoint(96,152),NewPoint(93,157),NewPoint(90,163),NewPoint(87,169),NewPoint(85,175),NewPoint(83,181),NewPoint(82,190),NewPoint(82,195),NewPoint(83,200),NewPoint(84,205),NewPoint(88,213),NewPoint(91,216),NewPoint(96,219),NewPoint(103,222),NewPoint(108,224),NewPoint(111,224),NewPoint(120,224),NewPoint(133,223),NewPoint(142,222),NewPoint(152,218),NewPoint(160,214),NewPoint(167,210),NewPoint(173,204),NewPoint(178,198),NewPoint(179,196),NewPoint(182,188),NewPoint(182,177),NewPoint(178,167),NewPoint(170,150),NewPoint(163,138),NewPoint(152,130),NewPoint(143,129),NewPoint(140,131),NewPoint(129,136),NewPoint(126,139)]) );
		
		this.Templates.push( new Template("check", [NewPoint(91,185),NewPoint(93,185),NewPoint(95,185),NewPoint(97,185),NewPoint(100,188),NewPoint(102,189),NewPoint(104,190),NewPoint(106,193),NewPoint(108,195),NewPoint(110,198),NewPoint(112,201),NewPoint(114,204),NewPoint(115,207),NewPoint(117,210),NewPoint(118,212),NewPoint(120,214),NewPoint(121,217),NewPoint(122,219),NewPoint(123,222),NewPoint(124,224),NewPoint(126,226),NewPoint(127,229),NewPoint(129,231),NewPoint(130,233),NewPoint(129,231),NewPoint(129,228),NewPoint(129,226),NewPoint(129,224),NewPoint(129,221),NewPoint(129,218),NewPoint(129,212),NewPoint(129,208),NewPoint(130,198),NewPoint(132,189),NewPoint(134,182),NewPoint(137,173),NewPoint(143,164),NewPoint(147,157),NewPoint(151,151),NewPoint(155,144),NewPoint(161,137),NewPoint(165,131),NewPoint(171,122),NewPoint(174,118),NewPoint(176,114),NewPoint(177,112),NewPoint(177,114),NewPoint(175,116),NewPoint(173,118)]) );
		
		this.Templates.push( new Template("caret", [NewPoint(79,245),NewPoint(79,242),NewPoint(79,239),NewPoint(80,237),NewPoint(80,234),NewPoint(81,232),NewPoint(82,230),NewPoint(84,224),NewPoint(86,220),NewPoint(86,218),NewPoint(87,216),NewPoint(88,213),NewPoint(90,207),NewPoint(91,202),NewPoint(92,200),NewPoint(93,194),NewPoint(94,192),NewPoint(96,189),NewPoint(97,186),NewPoint(100,179),NewPoint(102,173),NewPoint(105,165),NewPoint(107,160),NewPoint(109,158),NewPoint(112,151),NewPoint(115,144),NewPoint(117,139),NewPoint(119,136),NewPoint(119,134),NewPoint(120,132),NewPoint(121,129),NewPoint(122,127),NewPoint(124,125),NewPoint(126,124),NewPoint(129,125),NewPoint(131,127),NewPoint(132,130),NewPoint(136,139),NewPoint(141,154),NewPoint(145,166),NewPoint(151,182),NewPoint(156,193),NewPoint(157,196),NewPoint(161,209),NewPoint(162,211),NewPoint(167,223),NewPoint(169,229),NewPoint(170,231),NewPoint(173,237),NewPoint(176,242),NewPoint(177,244),NewPoint(179,250),NewPoint(181,255),NewPoint(182,257)]) );
		
		this.Templates.push( new Template("zigzag", [NewPoint(307,216),NewPoint(333,186),NewPoint(356,215),NewPoint(375,186),NewPoint(399,216),NewPoint(418,186)]) );
		
		this.Templates.push( new Template("arrow", [NewPoint(68,222),NewPoint(70,220),NewPoint(73,218),NewPoint(75,217),NewPoint(77,215),NewPoint(80,213),NewPoint(82,212),NewPoint(84,210),NewPoint(87,209),NewPoint(89,208),NewPoint(92,206),NewPoint(95,204),NewPoint(101,201),NewPoint(106,198),NewPoint(112,194),NewPoint(118,191),NewPoint(124,187),NewPoint(127,186),NewPoint(132,183),NewPoint(138,181),NewPoint(141,180),NewPoint(146,178),NewPoint(154,173),NewPoint(159,171),NewPoint(161,170),NewPoint(166,167),NewPoint(168,167),NewPoint(171,166),NewPoint(174,164),NewPoint(177,162),NewPoint(180,160),NewPoint(182,158),NewPoint(183,156),NewPoint(181,154),NewPoint(178,153),NewPoint(171,153),NewPoint(164,153),NewPoint(160,153),NewPoint(150,154),NewPoint(147,155),NewPoint(141,157),NewPoint(137,158),NewPoint(135,158),NewPoint(137,158),NewPoint(140,157),NewPoint(143,156),NewPoint(151,154),NewPoint(160,152),NewPoint(170,149),NewPoint(179,147),NewPoint(185,145),NewPoint(192,144),NewPoint(196,144),NewPoint(198,144),NewPoint(200,144),NewPoint(201,147),NewPoint(199,149),NewPoint(194,157),NewPoint(191,160),NewPoint(186,167),NewPoint(180,176),NewPoint(177,179),NewPoint(171,187),NewPoint(169,189),NewPoint(165,194),NewPoint(164,196)]) );
		
		this.Templates.push( new Template("leftbracket", [NewPoint(140,124),NewPoint(138,123),NewPoint(135,122),NewPoint(133,123),NewPoint(130,123),NewPoint(128,124),NewPoint(125,125),NewPoint(122,124),NewPoint(120,124),NewPoint(118,124),NewPoint(116,125),NewPoint(113,125),NewPoint(111,125),NewPoint(108,124),NewPoint(106,125),NewPoint(104,125),NewPoint(102,124),NewPoint(100,123),NewPoint(98,123),NewPoint(95,124),NewPoint(93,123),NewPoint(90,124),NewPoint(88,124),NewPoint(85,125),NewPoint(83,126),NewPoint(81,127),NewPoint(81,129),NewPoint(82,131),NewPoint(82,134),NewPoint(83,138),NewPoint(84,141),NewPoint(84,144),NewPoint(85,148),NewPoint(85,151),NewPoint(86,156),NewPoint(86,160),NewPoint(86,164),NewPoint(86,168),NewPoint(87,171),NewPoint(87,175),NewPoint(87,179),NewPoint(87,182),NewPoint(87,186),NewPoint(88,188),NewPoint(88,195),NewPoint(88,198),NewPoint(88,201),NewPoint(88,207),NewPoint(89,211),NewPoint(89,213),NewPoint(89,217),NewPoint(89,222),NewPoint(88,225),NewPoint(88,229),NewPoint(88,231),NewPoint(88,233),NewPoint(88,235),NewPoint(89,237),NewPoint(89,240),NewPoint(89,242),NewPoint(91,241),NewPoint(94,241),NewPoint(96,240),NewPoint(98,239),NewPoint(105,240),NewPoint(109,240),NewPoint(113,239),NewPoint(116,240),NewPoint(121,239),NewPoint(130,240),NewPoint(136,237),NewPoint(139,237),NewPoint(144,238),NewPoint(151,237),NewPoint(157,236),NewPoint(159,237)]) );
		
		this.Templates.push( new Template("rightbracket", [NewPoint(112,138),NewPoint(112,136),NewPoint(115,136),NewPoint(118,137),NewPoint(120,136),NewPoint(123,136),NewPoint(125,136),NewPoint(128,136),NewPoint(131,136),NewPoint(134,135),NewPoint(137,135),NewPoint(140,134),NewPoint(143,133),NewPoint(145,132),NewPoint(147,132),NewPoint(149,132),NewPoint(152,132),NewPoint(153,134),NewPoint(154,137),NewPoint(155,141),NewPoint(156,144),NewPoint(157,152),NewPoint(158,161),NewPoint(160,170),NewPoint(162,182),NewPoint(164,192),NewPoint(166,200),NewPoint(167,209),NewPoint(168,214),NewPoint(168,216),NewPoint(169,221),NewPoint(169,223),NewPoint(169,228),NewPoint(169,231),NewPoint(166,233),NewPoint(164,234),NewPoint(161,235),NewPoint(155,236),NewPoint(147,235),NewPoint(140,233),NewPoint(131,233),NewPoint(124,233),NewPoint(117,235),NewPoint(114,238),NewPoint(112,238)]) );
		
		this.Templates.push( new Template("v", [NewPoint(89,164),NewPoint(90,162),NewPoint(92,162),NewPoint(94,164),NewPoint(95,166),NewPoint(96,169),NewPoint(97,171),NewPoint(99,175),NewPoint(101,178),NewPoint(103,182),NewPoint(106,189),NewPoint(108,194),NewPoint(111,199),NewPoint(114,204),NewPoint(117,209),NewPoint(119,214),NewPoint(122,218),NewPoint(124,222),NewPoint(126,225),NewPoint(128,228),NewPoint(130,229),NewPoint(133,233),NewPoint(134,236),NewPoint(136,239),NewPoint(138,240),NewPoint(139,242),NewPoint(140,244),NewPoint(142,242),NewPoint(142,240),NewPoint(142,237),NewPoint(143,235),NewPoint(143,233),NewPoint(145,229),NewPoint(146,226),NewPoint(148,217),NewPoint(149,208),NewPoint(149,205),NewPoint(151,196),NewPoint(151,193),NewPoint(153,182),NewPoint(155,172),NewPoint(157,165),NewPoint(159,160),NewPoint(162,155),NewPoint(164,150),NewPoint(165,148),NewPoint(166,146)]) );
		
		this.Templates.push( new Template("delete", [NewPoint(123,129),NewPoint(123,131),NewPoint(124,133),NewPoint(125,136),NewPoint(127,140),NewPoint(129,142),NewPoint(133,148),NewPoint(137,154),NewPoint(143,158),NewPoint(145,161),NewPoint(148,164),NewPoint(153,170),NewPoint(158,176),NewPoint(160,178),NewPoint(164,183),NewPoint(168,188),NewPoint(171,191),NewPoint(175,196),NewPoint(178,200),NewPoint(180,202),NewPoint(181,205),NewPoint(184,208),NewPoint(186,210),NewPoint(187,213),NewPoint(188,215),NewPoint(186,212),NewPoint(183,211),NewPoint(177,208),NewPoint(169,206),NewPoint(162,205),NewPoint(154,207),NewPoint(145,209),NewPoint(137,210),NewPoint(129,214),NewPoint(122,217),NewPoint(118,218),NewPoint(111,221),NewPoint(109,222),NewPoint(110,219),NewPoint(112,217),NewPoint(118,209),NewPoint(120,207),NewPoint(128,196),NewPoint(135,187),NewPoint(138,183),NewPoint(148,167),NewPoint(157,153),NewPoint(163,145),NewPoint(165,142),NewPoint(172,133),NewPoint(177,127),NewPoint(179,127),NewPoint(180,125)]) );
		
		this.Templates.push( new Template("star", [NewPoint(75,250),NewPoint(75,247),NewPoint(77,244),NewPoint(78,242),NewPoint(79,239),NewPoint(80,237),NewPoint(82,234),NewPoint(82,232),NewPoint(84,229),NewPoint(85,225),NewPoint(87,222),NewPoint(88,219),NewPoint(89,216),NewPoint(91,212),NewPoint(92,208),NewPoint(94,204),NewPoint(95,201),NewPoint(96,196),NewPoint(97,194),NewPoint(98,191),NewPoint(100,185),NewPoint(102,178),NewPoint(104,173),NewPoint(104,171),NewPoint(105,164),NewPoint(106,158),NewPoint(107,156),NewPoint(107,152),NewPoint(108,145),NewPoint(109,141),NewPoint(110,139),NewPoint(112,133),NewPoint(113,131),NewPoint(116,127),NewPoint(117,125),NewPoint(119,122),NewPoint(121,121),NewPoint(123,120),NewPoint(125,122),NewPoint(125,125),NewPoint(127,130),NewPoint(128,133),NewPoint(131,143),NewPoint(136,153),NewPoint(140,163),NewPoint(144,172),NewPoint(145,175),NewPoint(151,189),NewPoint(156,201),NewPoint(161,213),NewPoint(166,225),NewPoint(169,233),NewPoint(171,236),NewPoint(174,243),NewPoint(177,247),NewPoint(178,249),NewPoint(179,251),NewPoint(180,253),NewPoint(180,255),NewPoint(179,257),NewPoint(177,257),NewPoint(174,255),NewPoint(169,250),NewPoint(164,247),NewPoint(160,245),NewPoint(149,238),NewPoint(138,230),NewPoint(127,221),NewPoint(124,220),NewPoint(112,212),NewPoint(110,210),NewPoint(96,201),NewPoint(84,195),NewPoint(74,190),NewPoint(64,182),NewPoint(55,175),NewPoint(51,172),NewPoint(49,170),NewPoint(51,169),NewPoint(56,169),NewPoint(66,169),NewPoint(78,168),NewPoint(92,166),NewPoint(107,164),NewPoint(123,161),NewPoint(140,162),NewPoint(156,162),NewPoint(171,160),NewPoint(173,160),NewPoint(186,160),NewPoint(195,160),NewPoint(198,161),NewPoint(203,163),NewPoint(208,163),NewPoint(206,164),NewPoint(200,167),NewPoint(187,172),NewPoint(174,179),NewPoint(172,181),NewPoint(153,192),NewPoint(137,201),NewPoint(123,211),NewPoint(112,220),NewPoint(99,229),NewPoint(90,237),NewPoint(80,244),NewPoint(73,250),NewPoint(69,254),NewPoint(69,252)]) );
		
		this.Templates.push( new Template("pigtail", [NewPoint(81,219),NewPoint(84,218),NewPoint(86,220),NewPoint(88,220),NewPoint(90,220),NewPoint(92,219),NewPoint(95,220),NewPoint(97,219),NewPoint(99,220),NewPoint(102,218),NewPoint(105,217),NewPoint(107,216),NewPoint(110,216),NewPoint(113,214),NewPoint(116,212),NewPoint(118,210),NewPoint(121,208),NewPoint(124,205),NewPoint(126,202),NewPoint(129,199),NewPoint(132,196),NewPoint(136,191),NewPoint(139,187),NewPoint(142,182),NewPoint(144,179),NewPoint(146,174),NewPoint(148,170),NewPoint(149,168),NewPoint(151,162),NewPoint(152,160),NewPoint(152,157),NewPoint(152,155),NewPoint(152,151),NewPoint(152,149),NewPoint(152,146),NewPoint(149,142),NewPoint(148,139),NewPoint(145,137),NewPoint(141,135),NewPoint(139,135),NewPoint(134,136),NewPoint(130,140),NewPoint(128,142),NewPoint(126,145),NewPoint(122,150),NewPoint(119,158),NewPoint(117,163),NewPoint(115,170),NewPoint(114,175),NewPoint(117,184),NewPoint(120,190),NewPoint(125,199),NewPoint(129,203),NewPoint(133,208),NewPoint(138,213),NewPoint(145,215),NewPoint(155,218),NewPoint(164,219),NewPoint(166,219),NewPoint(177,219),NewPoint(182,218),NewPoint(192,216),NewPoint(196,213),NewPoint(199,212),NewPoint(201,211)]) );
		

		// $1 Gesture Recognizer API (now using Protractor instead)
		this.Recognize = function(points) {
			var b = +Infinity,
				t = 0,
				radians,
				i,
				score,
				vector;
			
			points = Resample(points, NumPoints);
			radians = IndicativeAngle(points);
			points = RotateBy(points, -radians);
			vector = Vectorize(points); // for Protractor
			
			for (i = 0; i < this.Templates.length; i++) {
				var d = OptimalCosineDistance(this.Templates[i].Vector, vector);
				if (d < b) {
					b = d; // best (least) distance
					t = i; // unistroke template
				}
			}
			return new Result(this.Templates[t].Name, 1 / b);
		};
		
	}
	
	// Helper functions:
	function Resample(points, n) {
		var I = PathLength(points) / (n - 1), // interval length
			D = 0.0,
			newpoints = new Array(points[0]),
			i;
		for (i = 1; i < points.length; i++) {
			var d = Distance(points[i - 1], points[i]);
			if ((D + d) >= I) {
				var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X),
					qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y),
					q = NewPoint(qx, qy);
				newpoints[newpoints.length] = q; // append new point 'q'
				points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
				D = 0.0;
			}
			else D += d;
		}
		// somtimes we fall a rounding-error short of adding the last point, so add it if so
		if (newpoints.length == n - 1) {
			newpoints[newpoints.length] = NewPoint(points[points.length - 1].X, points[points.length - 1].Y);
		}
		return newpoints;
	}
	function IndicativeAngle(points) {
		var c = Centroid(points);
		return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
	}
	function RotateBy(points, radians) {
		var c = Centroid(points),
			cos = Math.cos(radians),
			sin = Math.sin(radians),
			newpoints = [],
			i;
		for (i = 0; i < points.length; i++) {
			var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X,
				qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
			newpoints[newpoints.length] = NewPoint(qx, qy);
		}
		return newpoints;
	}
	function ScaleTo(points, size) {
		var B = BoundingBox(points),
			newpoints = [],
			i;
		for (i = 0; i < points.length; i++) {
			var qx = points[i].X * (size / B.Width),
				qy = points[i].Y * (size / B.Height);
			newpoints[newpoints.length] = NewPoint(qx, qy);
		}
		return newpoints;
	}
	function TranslateTo(points, pt) {
		var c = Centroid(points),
			newpoints = [],
			i;
		for (i = 0; i < points.length; i++) {
			var qx = points[i].X + pt.X - c.X,
				qy = points[i].Y + pt.Y - c.Y;
			newpoints[newpoints.length] = NewPoint(qx, qy);
		}
		return newpoints;
	}
	function Vectorize(points) { // for Protractor
		var sum = 0.0,
			vector = [],
			i,
			magnitude;
		for ( i = 0; i < points.length; i++) {
			vector[vector.length] = points[i].X;
			vector[vector.length] = points[i].Y;
			sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
		}
		magnitude = Math.sqrt(sum);
		for ( i = 0; i < vector.length; i++ )
			vector[i] /= magnitude;
		return vector;
	}
	function OptimalCosineDistance(v1, v2) { // for Protractor
		var a = 0.0,
			b = 0.0,
			i,
			angle;
		for (i = 0; i < v1.length; i += 2) {
			a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
	                b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
		}
		angle = Math.atan(b / a);
		return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
	}
	function Centroid(points) {
		var x = 0.0, 
			y = 0.0,
			i;
		for (i = 0; i < points.length; i++) {
			x += points[i].X;
			y += points[i].Y;
		}
		x /= points.length;
		y /= points.length;
		return NewPoint(x, y);
	}
	function BoundingBox(points) {
		var minX = +Infinity, 
			maxX = -Infinity, 
			minY = +Infinity, 
			maxY = -Infinity,
			i;
		for (i = 0; i < points.length; i++) {
			if (points[i].X < minX)
				minX = points[i].X;
			if (points[i].X > maxX)
				maxX = points[i].X;
			if (points[i].Y < minY)
				minY = points[i].Y;
			if (points[i].Y > maxY)
				maxY = points[i].Y;
		}
		return new Rectangle(minX, minY, maxX - minX, maxY - minY);
	}
	function PathLength(points) {
		var d = 0.0,
			i;
		for (i = 1; i < points.length; i++) {
			d += Distance(points[i - 1], points[i]);
		}
		return d;
	}
	function Distance(p1, p2) {
		var dx = p2.X - p1.X,
			dy = p2.Y - p1.Y;
		return Math.sqrt(dx * dx + dy * dy);
	}

})(jQuery);