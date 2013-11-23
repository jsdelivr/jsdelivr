/******************************************
 * Websanova.com
 *
 * Resources for web entrepreneurs
 *
 * @author          Websanova
 * @copyright       Copyright (c) 2012 Websanova.
 * @license         This wPaint jQuery plug-in is dual licensed under the MIT and GPL licenses.
 * @link            http://www.websanova.com
 * @github			http://github.com/websanova/wPaint
 * @version         Version 1.13.1
 *
 ******************************************/
(function($)
{
	$.fn.wPaint = function(option, settings)
	{
		if(typeof option === 'object')
		{
			settings = option;
		}
		else if(typeof option == 'string')
		{
			var values = [];

			var elements = this.each(function()
			{
				var data = $(this).data('_wPaint');

				if(data)
				{
					if(option == 'clear') { data.clearAll(); }
					else if(option == 'image' && settings === undefined) { values.push(data.getImage()); }
					else if(option == 'image' && settings !== undefined) { data.setImage(settings, true); }
					else if(option == 'imageBg' && settings !== undefined) { data.setBgImage(settings); }
					else if($.fn.wPaint.defaultSettings[option] !== undefined)
					{
						if(settings !== undefined) { data.settings[option] = settings; }
						else { values.push(data.settings[option]); }
					}
				}
			});

			if(values.length === 1) { return values[0]; }
			if(values.length > 0) { return values; }
			else { return elements; }
		}

		//clean up some variables
		settings = $.extend({}, $.fn.wPaint.defaultSettings, settings || {});
		settings.lineWidthMin = parseInt(settings.lineWidthMin);
		settings.lineWidthMax = parseInt(settings.lineWidthMax);
		settings.lineWidth = parseInt(settings.lineWidth);
		settings.fontSizeMin = parseInt(settings.fontSizeMin);
		settings.fontSizeMax = parseInt(settings.fontSizeMax);
		settings.fontSize = parseInt(settings.fontSize);
		
		return this.each(function()
		{			
			var $elem = $(this);
			var _settings = jQuery.extend(true, {}, settings);
			
			//test for HTML5 canvas
			var test = document.createElement('canvas');
			if(!test.getContext)
			{
				$elem.html("Browser does not support HTML5 canvas, please upgrade to a more modern browser.");
				return false;	
			}
			
			if($elem.data('_wPaint')) return false;

			var canvas = new Canvas(_settings, $elem);
			canvas.mainMenu = new MainMenu(canvas);
			canvas.textMenu = new TextMenu(canvas);
			
			if(_settings.imageBg) $elem.append(canvas.generateBg($elem.width(), $elem.height(), _settings.imageBg));
			$elem.append(canvas.generate($elem.width(), $elem.height()));
			$elem.append(canvas.generateTemp());
			$elem.append(canvas.generateTextInput());

			$elem
			.append(canvas.mainMenu.generate(canvas, canvas.textMenu))
			.append(canvas.textMenu.generate(canvas, canvas.mainMenu));

			//init the snap on the text menu
			canvas.mainMenu.moveTextMenu(canvas.mainMenu, canvas.textMenu);

			//init mode
			canvas.mainMenu.set_mode(canvas.mainMenu, canvas, _settings.mode);

			//pull from css so that it is dynamic
			var buttonSize = $("._wPaint_icon").outerHeight(true) - (parseInt($("._wPaint_icon").css('paddingTop').split('px')[0]) + parseInt($("._wPaint_icon").css('paddingBottom').split('px')[0]));

			canvas.mainMenu.menu.find("._wPaint_fillColorPicker").wColorPicker({
				mode: "click",
				initColor: _settings.fillStyle,
				buttonSize: buttonSize,
				showSpeed: 300,
				hideSpeed: 300,
				onSelect: function(color){
					canvas.settings.fillStyle = color;
					canvas.textInput.css({color: color});
				}
			});
			
			canvas.mainMenu.menu.find("._wPaint_strokeColorPicker").wColorPicker({
				mode: "click",
				initColor: _settings.strokeStyle,
				buttonSize: buttonSize,
				showSpeed: 300,
				hideSpeed: 300,
				onSelect: function(color){
					canvas.settings.strokeStyle = color;
				}
			});
			
			//must set width after append to get proper dimensions
			canvas.mainMenu.setWidth(canvas, canvas.mainMenu.menu);
			canvas.mainMenu.setWidth(canvas, canvas.textMenu.menu);

			if(_settings.image)
			{
				canvas.setImage(_settings.image, true);
			}
			else
			{
				canvas.addUndo();
			}

			$elem.data('_wPaint', canvas);
		});
	}

	var shapes = ['Rectangle', 'Ellipse', 'Line', 'Text'];

	$.fn.wPaint.defaultSettings = {
		mode				 : 'Pencil',			// drawing mode - Rectangle, Ellipse, Line, Pencil, Eraser
		lineWidthMin		 : '0', 				// line width min for select drop down
		lineWidthMax		 : '10',				// line widh max for select drop down
		lineWidth			 : '2', 				// starting line width
		fillStyle			 : '#FFFFFF',			// starting fill style
		strokeStyle			 : '#FFFF00',			// start stroke style
		fontSizeMin			 : '8',					// min font size in px
		fontSizeMax			 : '20',				// max font size in px
		fontSize			 : '12',				// current font size for text input
		fontFamilyOptions	 : ['Arial', 'Courier', 'Times', 'Trebuchet', 'Verdana'], // available font families
		fontFamily			 : 'Arial',				// active font family for text input
		fontTypeBold		 : false,				// text input bold enable/disable
		fontTypeItalic		 : false,				// text input italic enable/disable
		fontTypeUnderline	 : false,				// text input italic enable/disable
		image				 : null,				// preload image - base64 encoded data
		imageBg				 : null,				// preload image bg, cannot be altered but saved with image
		drawDown			 : null,				// function to call when start a draw
		drawMove			 : null,				// function to call during a draw
		drawUp				 : null,				// function to call at end of draw
		menu 				 : ['undo', 'redo', 'clear','rectangle','ellipse','line','pencil','text','eraser','fillColor','lineWidth','strokeColor'], // menu items - appear in order they are set
		menuOrientation		 : 'horizontal',		// orinetation of menu (horizontal, vertical)
		menuOffsetX			 : 5,					// offset for menu (left)
		menuOffsetY			 : 5,					// offset for menu (top)
        menuTitles           : {                    // icon titles, replace any of the values to customize
                                    'undo': 'undo',
                                    'redo': 'redo',
                                    'clear': 'clear',
                                    'rectangle': 'rectangle',
                                    'ellipse': 'ellipse',
                                    'line': 'line',
                                    'pencil': 'pencil',
                                    'text': 'text',
                                    'eraser': 'eraser',
                                    'fillColor': 'fill color',
                                    'lineWidth': 'line width',
                                    'strokeColor': 'stroke color',
                                    'bold': 'bold',
                                    'italic': 'italic',
                                    'underline': 'underline',
                                    'fontSize': 'font size',
                                    'fontFamily': 'font family'
                                },
		disableMobileDefaults: false            	// disable default touchmove events for mobile (will prevent flipping between tabs and scrolling)
	};

	/**
	 * Canvas class definition
	 */
	function Canvas(settings, elem)
	{
		this.settings = settings;
		this.$elem = elem;
		this.mainMenu = null;
		this.textMenu = null;
		
		this.undoArray = [];
		this.undoCurrent = -1;
		this.undoMax = 10;

		this.draw = false;

		this.canvas = null;
		this.ctx = null;

		this.canvasTemp = null;
		this.ctxTemp = null;
		
		this.canvasBg = null;
		this.ctxBg = null;

		this.canvasTempLeftOriginal = null;
		this.canvasTempTopOriginal = null;
		
		this.canvasTempLeftNew = null;
		this.canvasTempTopNew = null;
		
		this.textInput = null;
		
		return this;
	}
	
	Canvas.prototype = 
	{	
		/*******************************************************************************
		 * Generate canvases and events
		 *******************************************************************************/
		generate: function(width, height)
		{	
			this.canvas = document.createElement('canvas');
			this.ctx = this.canvas.getContext('2d');
			
			//create local reference
			var _self = this;
			
			$(this.canvas)
			.attr('width', width + 'px')
			.attr('height', height + 'px')
			.css({position: 'absolute', left: 0, top: 0})
			.mousedown(function(e)
			{
				e.preventDefault();
				e.stopPropagation();
				_self.draw = true;
				_self.callFunc(e, _self, 'Down');
			});
			
			$(document)
			.mousemove(function(e)
			{
				if(_self.draw) _self.callFunc(e, _self, 'Move');
			})
			.mouseup(function(e)
			{
				//make sure we are in draw mode otherwise this will fire on any mouse up.
				if(_self.draw)
				{
					_self.draw = false;
					_self.callFunc(e, _self, 'Up');
				}
			});
			
			this.bindMobile();

			return $(this.canvas);
		},

		bindMobile: function()
		{
			$(this.canvas).bind('touchstart touchmove touchend touchcancel', function ()
			{
				var touches = event.changedTouches, first = touches[0], type = ""; 

				switch (event.type)
				{
					case "touchstart": type = "mousedown"; break; 
					case "touchmove": type = "mousemove"; break; 
					case "touchend": type = "mouseup"; break; 
					default: return;
				}

				var simulatedEvent = document.createEvent("MouseEvent"); 

				simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0/*left*/, null);
				first.target.dispatchEvent(simulatedEvent);
				event.preventDefault();
			});

			//eliminate browser defaults for
			if(this.settings.disableMobileDefaults) $(document).bind('touchmove', function(e) { e.preventDefault(); });
		},
		
		generateTemp: function()
		{
			this.canvasTemp = document.createElement('canvas');
			this.ctxTemp = this.canvasTemp.getContext('2d');
			
			$(this.canvasTemp).css({position: 'absolute'}).hide();
			
			return $(this.canvasTemp);
		},

		generateBg: function(width, height, data)
		{
			var _self = this;
			
			if(!this.canvasBg)
			{
				this.canvasBg = document.createElement('canvas');
				this.ctxBg = this.canvasBg.getContext('2d');

				$(this.canvasBg).attr('id', 'mofo').css({position: 'absolute', left: 0, top: 0}).attr('width', width).attr('height', height);
			}
				
			this.setBgImage(data);

			return $(this.canvasBg);
		},
		
		generateTextInput: function()
		{
			var _self = this;
			
			_self.textCalc = $('<div></div>').css({display:'none', fontSize:this.settings.fontSize, lineHeight:this.settings.fontSize+'px', fontFamily:this.settings.fontFamily});
			
			_self.textInput = 
			$('<textarea class="_wPaint_textInput" spellcheck="false"></textarea>')
			.css({display:'none', position:'absolute', color:this.settings.fillStyle, fontSize:this.settings.fontSize, lineHeight:this.settings.fontSize+'px', fontFamily:this.settings.fontFamily})

			if(_self.settings.fontTypeBold) { _self.textInput.css('fontWeight', 'bold'); _self.textCalc.css('fontWeight', 'bold'); }
			if(_self.settings.fontTypeItalic) { _self.textInput.css('fontStyle', 'italic'); _self.textCalc.css('fontStyle', 'italic'); }
			if(_self.settings.fontTypeUnderline) { _self.textInput.css('textDecoration', 'underline'); _self.textCalc.css('textDecoration', 'underline'); }
			
			$('body').append(_self.textCalc);
			
			return _self.textInput;
		},
		
		callFunc: function(e, _self, event)
		{
			$e = jQuery.extend(true, {}, e);
			
			var canvas_offset = $(_self.canvas).offset();
			
			$e.pageX = Math.floor($e.pageX - canvas_offset.left);
			$e.pageY = Math.floor($e.pageY - canvas_offset.top);
			
			var mode = $.inArray(_self.settings.mode, shapes) > -1 ? 'Shape' : _self.settings.mode;
			var func = _self['draw' + mode + '' + event];	
			
			if(func) func($e, _self);

			if(_self.settings['draw' + event]) _self.settings['draw' + event].apply(_self, [e, mode]);

			if(_self.settings.mode !== 'Text' && event === 'Up') { this.addUndo(); }
		},
		
		/*******************************************************************************
		 * draw any shape
		 *******************************************************************************/
		drawShapeDown: function(e, _self)
		{
			if(_self.settings.mode == 'Text')
			{
				//draw current text before resizing next text box
				if(_self.textInput.val() != '') _self.drawTextUp(e, _self);
				
				_self.textInput.css({left: e.pageX-1, top: e.pageY-1, width:0, height:0});
			}

			$(_self.canvasTemp)
			.css({left: e.pageX, top: e.pageY})
			.attr('width', 0)
			.attr('height', 0)
			.show();

			_self.canvasTempLeftOriginal = e.pageX;
			_self.canvasTempTopOriginal = e.pageY;
			
			var func = _self['draw' + _self.settings.mode + 'Down'];
			
			if(func) func(e, _self);
		},
		
		drawShapeMove: function(e, _self)
		{
			var xo = _self.canvasTempLeftOriginal;
			var yo = _self.canvasTempTopOriginal;
			
			var half_line_width = _self.settings.lineWidth / 2;
			
			var left = (e.pageX < xo ? e.pageX : xo) - (_self.settings.mode == 'Line' ? Math.floor(half_line_width) : 0);
			var top = (e.pageY < yo ? e.pageY : yo) - (_self.settings.mode == 'Line' ? Math.floor(half_line_width) : 0);
			var width = Math.abs(e.pageX - xo) + (_self.settings.mode == 'Line' ? _self.settings.lineWidth : 0);
			var height = Math.abs(e.pageY - yo) + (_self.settings.mode == 'Line' ? _self.settings.lineWidth : 0);

			$(_self.canvasTemp)
			.css({left: left, top: top})
			.attr('width', width)
			.attr('height', height)
			
			if(_self.settings.mode == 'Text') _self.textInput.css({left: left-1, top: top-1, width:width, height:height});
			
			_self.canvasTempLeftNew = left;
			_self.canvasTempTopNew = top;
			
			var func = _self['draw' + _self.settings.mode + 'Move'];
			
			if(func)
			{
			    var factor = _self.settings.mode == 'Line' ? 1 : 2;
			    
				e.x = half_line_width*factor;
				e.y = half_line_width*factor;
				e.w = width - _self.settings.lineWidth*factor;
				e.h = height - _self.settings.lineWidth*factor;
				
				_self.ctxTemp.fillStyle = _self.settings.fillStyle;
				_self.ctxTemp.strokeStyle = _self.settings.strokeStyle;
				_self.ctxTemp.lineWidth = _self.settings.lineWidth*factor;
				
				func(e, _self);
			}
		},
		
		drawShapeUp: function(e, _self)
		{
			if(_self.settings.mode != 'Text')
			{
				_self.ctx.drawImage(_self.canvasTemp ,_self.canvasTempLeftNew, _self.canvasTempTopNew);
				
				$(_self.canvasTemp).hide();
				
				var func = _self['draw' + _self.settings.mode + 'Up'];
				if(func) func(e, _self);
			}
		},
		
		/*******************************************************************************
		 * draw rectangle
		 *******************************************************************************/		
		drawRectangleMove: function(e, _self)
		{
			_self.ctxTemp.beginPath();
			_self.ctxTemp.rect(e.x, e.y, e.w, e.h)
			_self.ctxTemp.closePath();
			_self.ctxTemp.stroke();
			_self.ctxTemp.fill();
		},
		
		/*******************************************************************************
		 * draw ellipse
		 *******************************************************************************/
		drawEllipseMove: function(e, _self)
		{
			var kappa = .5522848;
			var ox = (e.w / 2) * kappa; 	// control point offset horizontal
			var  oy = (e.h / 2) * kappa; 	// control point offset vertical
			var  xe = e.x + e.w;           	// x-end
			var ye = e.y + e.h;           	// y-end
			var xm = e.x + e.w / 2;       	// x-middle
			var ym = e.y + e.h / 2;       	// y-middle
		
			_self.ctxTemp.beginPath();
			_self.ctxTemp.moveTo(e.x, ym);
			_self.ctxTemp.bezierCurveTo(e.x, ym - oy, xm - ox, e.y, xm, e.y);
			_self.ctxTemp.bezierCurveTo(xm + ox, e.y, xe, ym - oy, xe, ym);
			_self.ctxTemp.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			_self.ctxTemp.bezierCurveTo(xm - ox, ye, e.x, ym + oy, e.x, ym);
			_self.ctxTemp.closePath();
			if(_self.settings.lineWidth > 0)_self.ctxTemp.stroke();
			_self.ctxTemp.fill();
		},
		
		/*******************************************************************************
		 * draw line
		 *******************************************************************************/	
		drawLineMove: function(e, _self)
		{				
			var xo = _self.canvasTempLeftOriginal;
			var yo = _self.canvasTempTopOriginal;
			
			if(e.pageX < xo) { e.x = e.x + e.w; e.w = e.w * -1}
			if(e.pageY < yo) { e.y = e.y + e.h; e.h = e.h * -1}
			
			_self.ctxTemp.lineJoin = "round";
			_self.ctxTemp.beginPath();
			_self.ctxTemp.moveTo(e.x, e.y);
			_self.ctxTemp.lineTo(e.x + e.w, e.y + e.h);
			_self.ctxTemp.closePath();
			_self.ctxTemp.stroke();
		},
		
		/*******************************************************************************
		 * draw pencil
		 *******************************************************************************/
		drawPencilDown: function(e, _self)
		{
			_self.ctx.lineJoin = "round";
			_self.ctx.lineCap = "round";
			_self.ctx.strokeStyle = _self.settings.strokeStyle;
			_self.ctx.fillStyle = _self.settings.strokeStyle;
			_self.ctx.lineWidth = _self.settings.lineWidth;
			
			//draw single dot in case of a click without a move
			_self.ctx.beginPath();
			_self.ctx.arc(e.pageX, e.pageY, _self.settings.lineWidth/2, 0, Math.PI*2, true);
			_self.ctx.closePath();
			_self.ctx.fill();
			
			//start the path for a drag
			_self.ctx.beginPath();
			_self.ctx.moveTo(e.pageX, e.pageY);
		},
		
		drawPencilMove: function(e, _self)
		{
			_self.ctx.lineTo(e.pageX, e.pageY);
			_self.ctx.stroke();
		},
		
		drawPencilUp: function(e, _self)
		{
			_self.ctx.closePath();
		},

		/*******************************************************************************
		 * draw text
		 *******************************************************************************/
		
		drawTextDown: function(e, _self)
		{
			_self.textInput.val('').show().focus();
		},
		
		drawTextUp: function(e, _self)
		{
			if(e) { this.addUndo(); }

			var fontString = '';
			if(_self.settings.fontTypeItalic) fontString += 'italic ';
			//if(_self.settings.fontTypeUnderline) fontString += 'underline ';
			if(_self.settings.fontTypeBold) fontString += 'bold ';
			
			fontString += _self.settings.fontSize + 'px ' + _self.settings.fontFamily;
			
			//setup lines
			var lines = _self.textInput.val().split('\n');
			var linesNew = [];
			var textInputWidth = _self.textInput.width() - 2;
			
			var width = 0;
			var lastj = 0;
			
			for(var i=0, ii=lines.length; i<ii; i++)
			{
				_self.textCalc.html('');
				lastj = 0;
				
				for(var j=0, jj=lines[0].length; j<jj; j++)
				{
					width = _self.textCalc.append(lines[i][j]).width();
					
					if(width > textInputWidth)
					{
						linesNew.push(lines[i].substring(lastj,j));
						lastj = j;
						_self.textCalc.html(lines[i][j]);
					}
				}
				
				if(lastj != j) linesNew.push(lines[i].substring(lastj,j));
			}
			
			lines = _self.textInput.val(linesNew.join('\n')).val().split('\n');
			
			var offset = _self.textInput.position();
			var left = offset.left;
			var top = offset.top;
			var underlineOffset = 0;
			
			for(var i=0, ii=lines.length; i<ii; i++)
			{
				_self.ctx.fillStyle = _self.settings.fillStyle;
				
				_self.ctx.textBaseline = 'top';
				_self.ctx.font = fontString;
				_self.ctx.fillText(lines[i], left, top);
				
				top += _self.settings.fontSize;
				
				if(lines[i] != '' && _self.settings.fontTypeUnderline)
				{
					width = _self.textCalc.html(lines[i]).width();
					
					//manually set pixels for underline since to avoid antialiasing 1px issue, and lack of support for underline in canvas
					var imgData = _self.ctx.getImageData(0, top+underlineOffset, width, 1);
					
					for (j=0; j<imgData.width*imgData.height*4; j+=4)
					{
						imgData.data[j] = parseInt(_self.settings.fillStyle.substring(1,3), 16);
						imgData.data[j+1] = parseInt(_self.settings.fillStyle.substring(3,5), 16);
						imgData.data[j+2] = parseInt(_self.settings.fillStyle.substring(5,7), 16);
						imgData.data[j+3] = 255;
					}
					
					_self.ctx.putImageData(imgData, left, top+underlineOffset);
				}
			}
		},
		
		/*******************************************************************************
		 * eraser
		 *******************************************************************************/
		drawEraserDown: function(e, _self)
		{
			_self.ctx.save();
			_self.ctx.globalCompositeOperation = 'destination-out';
			_self.drawPencilDown(e, _self);
		},
		
		drawEraserMove: function(e, _self)
		{
		    _self.drawPencilMove(e, _self);
		},
		
		drawEraserUp: function(e, _self)
		{
			_self.drawPencilUp(e, _self);
			_self.ctx.restore();
		},

		/*******************************************************************************
		 * save / load data
		 *******************************************************************************/
		getImage: function()
		{
			this.canvasSave = document.createElement('canvas');
			this.ctxSave = this.canvasSave.getContext('2d');

			$(this.canvasSave).css({display:'none', position: 'absolute', left: 0, top: 0}).attr('width', $(this.canvas).attr('width')).attr('height', $(this.canvas).attr('height'));

			//if a bg image is set, it will automatically save with the image
			if(this.canvasBg) this.ctxSave.drawImage(this.canvasBg, 0, 0);

			this.ctxSave.drawImage(this.canvas, 0, 0);

			return this.canvasSave.toDataURL();
		},
		
		setImage: function(data, addUndo)
		{
			var _self = this;
			
			var myImage = new Image();
			myImage.src = data.toString();

			_self.ctx.clearRect(0, 0, _self.canvas.width, _self.canvas.height);
			
			$(myImage).load(function(){
				_self.ctx.drawImage(myImage, 0, 0);
				if(addUndo) { _self.addUndo(); }
			});
		},

		setBgImage: function(data, addUndo)
		{
			var _self = this;

			var myImage = new Image();
			myImage.src = data.toString();

			_self.ctxBg.clearRect(0, 0, _self.canvasBg.width, _self.canvasBg.height);
			
			$(myImage).load(function()
			{
				_self.ctxBg.drawImage(myImage, 0, 0);
			});
		},

		/*******************************************************************************
		 * undo / redo
		 *******************************************************************************/

		 addUndo: function()
		 {
		 	//if it's not at the end of the array we need to repalce the current array position
		 	if(this.undoCurrent < this.undoArray.length-1)
		 	{
				this.undoArray[++this.undoCurrent] = this.getImage();
		 	}
		 	else // owtherwise we push normally here
		 	{
		 		this.undoArray.push(this.getImage());

		 		//if we're at the end of the array we need to slice off the front - in increment required
		 		if(this.undoArray.length > this.undoMax){ this.undoArray = this.undoArray.slice(1, this.undoArray.length); }
		 		//if we're NOT at the end of the array, we just increment
		 		else{ this.undoCurrent++; }
		 	}

		 	//for undo's then a new draw we want to remove everything afterwards - in most cases nothing will happen here
		 	while(this.undoCurrent != this.undoArray.length-1) { this.undoArray.pop(); }

		 	this.undoToggleIcons();
		 },

		 setUndoImage: function()
		 {
		 	this.setImage(this.undoArray[this.undoCurrent]);
		 },

		 undoNext: function()
		 {
		 	if(this.undoArray[this.undoCurrent+1]) { this.undoCurrent++; this.setUndoImage(); }

		 	this.undoToggleIcons();
		 },

		 undoPrev: function()
		 {
		 	if(this.undoArray[this.undoCurrent-1]) { this.undoCurrent--; this.setUndoImage(); }

		 	this.undoToggleIcons();
		 },

		 undoToggleIcons: function()
		 {
		 	var iconUndo = this.mainMenu.menu.find("._wPaint_undo");
			var iconRedo = this.mainMenu.menu.find("._wPaint_redo");

			if(this.undoCurrent > 0 && this.undoArray.length > 1)
			{
				 if(!iconUndo.hasClass('uactive')) { iconUndo.addClass('uactive'); }
			}
			else { iconUndo.removeClass('uactive'); }

			if(this.undoCurrent < this.undoArray.length-1)
			{
				if(!iconRedo.hasClass('uactive')) { iconRedo.addClass('uactive'); }
			}
			else { iconRedo.removeClass('uactive'); }
		 },

		/*******************************************************************************
		 * Functions
		 *******************************************************************************/
		clearAll: function()
		{	
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			this.addUndo();
		}
	}
	
	/**
	 * Main Menu
	 */
	function MainMenu(canvas)
	{
		this.menu = null;
		
		return this;
	}
	
	MainMenu.prototype = 
	{
		generate: function(canvas, textMenu)
		{
			var $canvas = canvas;
			this.textMenu = textMenu;
			var _self = this;
			
			//setup the line width select
			var options = '';
			for(var i=$canvas.settings.lineWidthMin; i<=$canvas.settings.lineWidthMax; i++) options += '<option value="' + i + '" ' + ($canvas.settings.lineWidth == i ? 'selected="selected"' : '') + '>' + i + '</option>';
			
			var lineWidth = $('<div class="_wPaint_lineWidth _wPaint_dropDown" title="' + $canvas.settings.menuTitles.lineWidth + '"></div>').append(
				$('<select>' + options + '</select>')
				.change(function(e){ $canvas.settings.lineWidth = parseInt($(this).val()); })
			)
			
			//content
			var menuContent = $('<div class="_wPaint_options"></div>');
			
			$.each($canvas.settings.menu, function(i, item)
			{
				switch(item)
				{
					case 'undo': menuContent.append($('<div class="_wPaint_icon _wPaint_undo" title="' + $canvas.settings.menuTitles.undo + '"></div>').click(function(){ $canvas.undoPrev(); })); break;
                    case 'redo': menuContent.append($('<div class="_wPaint_icon _wPaint_redo" title="' + $canvas.settings.menuTitles.redo + '"></div>').click(function(){ $canvas.undoNext(); })); break;
					case 'clear': menuContent.append($('<div class="_wPaint_icon _wPaint_clear" title="' + $canvas.settings.menuTitles.clear + '"></div>').click(function(){ $canvas.clearAll(); })); break;
					case 'rectangle': menuContent.append($('<div class="_wPaint_icon _wPaint_rectangle" title="' + $canvas.settings.menuTitles.rectangle + '"></div>').click(function(){ _self.set_mode(_self, $canvas, 'Rectangle'); })); break;
					case 'ellipse': menuContent.append($('<div class="_wPaint_icon _wPaint_ellipse" title="' + $canvas.settings.menuTitles.ellipse + '"></div>').click(function(){ _self.set_mode(_self, $canvas, 'Ellipse'); })); break;
					case 'line': menuContent.append($('<div class="_wPaint_icon _wPaint_line" title="' + $canvas.settings.menuTitles.line + '"></div>').click(function(){ _self.set_mode(_self, $canvas, 'Line'); })); break;
					case 'pencil': menuContent.append($('<div class="_wPaint_icon _wPaint_pencil" title="' + $canvas.settings.menuTitles.pencil + '"></div>').click(function(){ _self.set_mode(_self, $canvas, 'Pencil'); })); break;
					case 'text': menuContent.append($('<div class="_wPaint_icon _wPaint_text" title="' + $canvas.settings.menuTitles.text + '"></div>').click(function(){ _self.set_mode(_self, $canvas, 'Text'); })); break;
					case 'eraser': menuContent.append($('<div class="_wPaint_icon _wPaint_eraser" title="' + $canvas.settings.menuTitles.eraser + '"></div>').click(function(e){ _self.set_mode(_self, $canvas, 'Eraser'); })); break;
					case 'fillColor': menuContent.append($('<div class="_wPaint_fillColorPicker _wPaint_colorPicker" title="' + $canvas.settings.menuTitles.fillColor + '"></div>')); break;
					case 'lineWidth': menuContent.append(lineWidth); break;
					case 'strokeColor': menuContent.append($('<div class="_wPaint_strokeColorPicker _wPaint_colorPicker" title="' + $canvas.settings.menuTitles.strokeColor + 'r"></div>')); break;
				}
			});

			//handle
			var menuHandle = $('<div class="_wPaint_handle"></div>')
			
			//get position of canvas
			//var offset = $($canvas.canvas).offset();
			
			//menu
			return this.menu = 
			$('<div class="_wPaint_menu _wPaint_menu_' + $canvas.settings.menuOrientation + '"></div>')
			.css({position: 'absolute', left: $canvas.settings.menuOffsetX, top: $canvas.settings.menuOffsetY})
			.draggable({
				handle: menuHandle, 
				drag: function(){_self.moveTextMenu(_self, _self.textMenu)}, 
				stop: function(){_self.moveTextMenu(_self, _self.textMenu)}
			})
			.append(menuHandle)
			.append(menuContent);
		},
		
		moveTextMenu: function(mainMenu, textMenu)
		{
			if(textMenu.docked)
			{
				textMenu.menu.css({left: parseInt(mainMenu.menu.css('left')) + textMenu.dockOffsetLeft, top: parseInt(mainMenu.menu.css('top')) + textMenu.dockOffsetTop});
			}
		},
		
		set_mode: function(_self, $canvas, mode)
		{
			$canvas.settings.mode = mode;
			
			if(mode == 'Text')
			{
				_self.textMenu.menu.show();
				_self.setWidth($canvas, _self.textMenu.menu);
			}
			else
			{
				$canvas.drawTextUp(null, $canvas);
				_self.textMenu.menu.hide();
				$canvas.textInput.hide();
			}
			
			_self.menu.find("._wPaint_icon").removeClass('active');
			_self.menu.find("._wPaint_" + mode.toLowerCase()).addClass('active');
		},

		setWidth: function(canvas, menu)
		{
			var options = menu.find('._wPaint_options');

			if(canvas.settings.menuOrientation === 'vertical')
			{
				// set proper width
				var width = menu.find('._wPaint_options > div:first').outerWidth(true);
				width += (options.outerWidth(true) - options.width());

				//set proper height
			}
			else
			{
				var width = menu.find('._wPaint_handle').outerWidth(true);
				width += menu.outerWidth(true) - menu.width();
				
				menu.find('._wPaint_options').children().each(function()
				{
					width += $(this).outerWidth(true);
				});
			}


			menu.width(width);
		}
	}
	
	/**
	 * Text Helper
	 */
	function TextMenu(canvas)
	{
		this.menu = null;
		
		this.docked = true;
		
		this.dockOffsetLeft = canvas.settings.menuOrientation === 'vertical' ? 36 : 0;
		this.dockOffsetTop = canvas.settings.menuOrientation === 'vertical' ? 0 : 36;
		
		return this;
	}
	
	TextMenu.prototype = 
	{
		generate: function(canvas, mainMenu)
		{
			var $canvas = canvas;
			var _self = this;
			
			//setup font sizes
			var options = '';
			for(var i=$canvas.settings.fontSizeMin; i<=$canvas.settings.fontSizeMax; i++) options += '<option value="' + i + '" ' + ($canvas.settings.fontSize == i ? 'selected="selected"' : '') + '>' + i + '</option>';
			
			var fontSize = $('<div class="_wPaint_fontSize _wPaint_dropDown" title="' + $canvas.settings.menuTitles.fontSize + '"></div>').append(
				$('<select>' + options + '</select>')
				.change(function(e){ 
					var fontSize = parseInt($(this).val());
					$canvas.settings.fontSize = fontSize;
					$canvas.textInput.css({fontSize:fontSize, lineHeight:fontSize+'px'});
					$canvas.textCalc.css({fontSize:fontSize, lineHeight:fontSize+'px'});
				})
			)
			
			//setup font family
			var options = '';
			for(var i=0, ii=$canvas.settings.fontFamilyOptions.length; i<ii; i++) options += '<option value="' + $canvas.settings.fontFamilyOptions[i] + '" ' + ($canvas.settings.fontFamily == $canvas.settings.fontFamilyOptions[i] ? 'selected="selected"' : '') + '>' + $canvas.settings.fontFamilyOptions[i] + '</option>';
			
			var fontFamily = $('<div class="_wPaint_fontFamily _wPaint_dropDown" title="' + $canvas.settings.menuTitles.fontFamily + '"><div class="_wPaint_dropDown_cover"></div></div>').append(
				$('<select>' + options + '</select>')
				.change(function(e){ 
					var fontFamily = $(this).val();
					$canvas.settings.fontFamily = fontFamily;
					$canvas.textInput.css({fontFamily: fontFamily});
					$canvas.textCalc.css({fontFamily: fontFamily});
				})
			)
			
			//content
			var menuContent = 
			$('<div class="_wPaint_options"></div>')
			.append($('<div class="_wPaint_icon _wPaint_bold ' + ($canvas.settings.fontTypeBold ? 'active' : '') + '" title="' + $canvas.settings.menuTitles.bold + '"></div>').click(function(){ _self.setType(_self, $canvas, 'Bold'); }))
			.append($('<div class="_wPaint_icon _wPaint_italic ' + ($canvas.settings.fontTypeItalic ? 'active' : '') + '" title="' + $canvas.settings.menuTitles.italic + '"></div>').click(function(){ _self.setType(_self, $canvas, 'Italic'); }))
			.append($('<div class="_wPaint_icon _wPaint_underline ' + ($canvas.settings.fontTypeUnderline ? 'active' : '') + '" title="' + $canvas.settings.menuTitles.underline + '"></div>').click(function(){ _self.setType(_self, $canvas, 'Underline'); }))
			.append(fontSize)
			.append(fontFamily);
			
			//handle
			var menuHandle = $('<div class="_wPaint_handle"></div>')
			
			//get position of canvas
			var offset = $($canvas.canvas).offset();
			
			//menu
			return this.menu = 
			$('<div class="_wPaint_menu _wPaint_menu_' + $canvas.settings.menuOrientation + '""></div>')
			.css({display: 'none', position: 'absolute'})
			.draggable({
				snap: '._wPaint_menu', 
				handle: menuHandle,
				stop: function(){
					$.each($(this).data('draggable').snapElements, function(index, element){
						_self.dockOffsetLeft = _self.menu.offset().left - mainMenu.menu.offset().left;
						_self.dockOffsetTop = _self.menu.offset().top - mainMenu.menu.offset().top;
						_self.docked = element.snapping;
					}); 
				}
			})
			.append(menuHandle)
			.append(menuContent);
		},
		
		setType: function(_self, $canvas, mode)
		{
			var element = _self.menu.find("._wPaint_" + mode.toLowerCase());
			var isActive = element.hasClass('active')
			
			$canvas.settings['fontType' + mode] = !isActive;
			
			isActive ? element.removeClass('active') : element.addClass('active');
			
			fontTypeBold = $canvas.settings.fontTypeBold ? 'bold' : 'normal';
			fontTypeItalic = $canvas.settings.fontTypeItalic ? 'italic' : 'normal';
			fontTypeUnderline = $canvas.settings.fontTypeUnderline ? 'underline' : 'none';
			
			$canvas.textInput.css({fontWeight: fontTypeBold}); $canvas.textCalc.css({fontWeight: fontTypeBold});
			$canvas.textInput.css({fontStyle: fontTypeItalic}); $canvas.textCalc.css({fontStyle: fontTypeItalic});
			$canvas.textInput.css({textDecoration: fontTypeUnderline}); $canvas.textCalc.css({textDecoration: fontTypeUnderline});
		}
	}
})(jQuery);