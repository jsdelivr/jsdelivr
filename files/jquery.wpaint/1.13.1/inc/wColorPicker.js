/******************************************
 * Websanova.com
 *
 * Resources for web entrepreneurs
 *
 * @author          Websanova
 * @copyright       Copyright (c) 2012 Websanova.
 * @license         This wChar jQuery plug-in is dual licensed under the MIT and GPL licenses.
 * @link            http://www.websanova.com
 * @github			http://github.com/websanova/wColorPicker
 * @version         Version 1.3.2
 *
 ******************************************/
(function($)
{	
	$.fn.wColorPicker = function(option, settings)
	{
		if(typeof option === 'object')
		{
			settings = option;
		}
		else if(typeof option === 'string')
		{
			var values = [];

			var elements = this.each(function()
			{
				var data = $(this).data('_wColorPicker');

				if(data)
				{
					if($.fn.wColorPicker.defaultSettings[option] !== undefined)
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

		settings = $.extend({}, $.fn.wColorPicker.defaultSettings, settings || {});
		
		return this.each(function()
		{
			var elem = $(this);	
			var $settings = jQuery.extend(true, {}, settings);
			
			var cp = new ColorPicker($settings, elem);

			cp.generate();

			cp.appendToElement(elem);			
		
			cp.colorSelect(cp, $settings.initColor);

			elem.data('_wColorPicker', cp);
		});
	};

	$.fn.wColorPicker.defaultSettings = {
		theme			: 'black', 		// colors - black, white, cream, red, green, blue, yellow, orange, plum
		opacity			: 0.8,			// opacity level
		initColor		: '#FF0000',	// initial colour to set palette to
		onMouseover		: null,			// function to run when palette color is moused over
		onMouseout		: null,			// function to run when palette color is moused out
		onSelect		: null,			// function to run when palette color is selected
		mode			: 'flat',		// flat mode inserts the palette to container, other modes insert button into container - hover, click
		buttonSize		: 20,			// size of button if mode is ohter than flat
		effect			: 'slide',		// none/slide/fade
		showSpeed		: 500,			// time to run the effects on show
		hideSpeed		: 500			// time to run the effects on hide
	};

	/**
	 * ColorPicker class definition
	 */
	function ColorPicker(settings, elem)
	{ 
		this.colorPicker = null;
		this.settings = settings;
		this.$elem = elem;
		this.currentColor = settings.initColor;
		
		this.height = null;					// init this, need to get height/width proper while element is still showing
		this.width = null;
		this.slideTopToBottom = null;		// used to assist with sliding in proper direction
		
		this.customTarget = null;			
		this.buttonColor = null;
		this.paletteHolder = null;
		
		return this;
	}
	
	ColorPicker.prototype =
	{
		generate: function ()
		{
			if(this.colorPicker) return this.colorPicker;

			var $this = this;

			var clearFloats = {clear: 'both', height: 0, lineHeight: 0, fontSize: 0}; 

			//custom colors
			this.customTarget = $('<div class="_wColorPicker_customTarget"></div>');
			this.customInput =
			$('<input type="text" class="_wColorPicker_customInput" value=""/>').keyup(function(e)
			{
				var code = (e.keyCode ? e.keyCode : e.which);
				
				var hex = $this.validHex($(this).val());
				
				$(this).val(hex)
				
				//auto set color in target if it's valid hex code
				if(hex.length == 7) $this.customTarget.css('backgroundColor', hex);
				
				if(code == 13)//set color if user hits enter while on input
				{
					$this.colorSelect($this, $(this).val());
					if($this.buttonColor) $this.hidePalette($this)
				}
			})
			.click(function(e){e.stopPropagation();});
			
			//setup custom area
			var custom = 
			$('<div class="_wColorPicker_custom"></div>')
			.append(this.appendColors($('<div class="_wColorPicker_noColor">'), [''], 1))
			.append(this.customTarget)
			.append(this.customInput)
			//clear floats
			.append($('<div></div>').css(clearFloats))

			//grays/simple palette
			var simpleColors = ['000000', '333333', '666666', '999999', 'CCCCCC', 'FFFFFF', 'FF0000', '00FF00', '0000FF', 'FFFF00', '00FFFF', 'FF00FF'];
			var simplePalette = this.appendColors($('<div class="_wColorPicker_palette_simple"></div>'), simpleColors, 1);
			
			//colors palette
			var mixedColors = [
				'000000', '003300', '006600', '009900', '00CC00', '00FF00', '330000', '333300', '336600', '339900', '33CC00', '33FF00', '660000', '663300', '666600', '669900', '66CC00', '66FF00',
				'000033', '003333', '006633', '009933', '00CC33', '00FF33', '330033', '333333', '336633', '339933', '33CC33', '33FF33', '660033', '663333', '666633', '669933', '66CC33', '66FF33',
				'000066', '003366', '006666', '009966', '00CC66', '00FF66', '330066', '333366', '336666', '339966', '33CC66', '33FF66', '660066', '663366', '666666', '669966', '66CC66', '66FF66',
				'000099', '003399', '006699', '009999', '00CC99', '00FF99', '330099', '333399', '336699', '339999', '33CC99', '33FF99', '660099', '663399', '666699', '669999', '66CC99', '66FF99',
				'0000CC', '0033CC', '0066CC', '0099CC', '00CCCC', '00FFCC', '3300CC', '3333CC', '3366CC', '3399CC', '33CCCC', '33FFCC', '6600CC', '6633CC', '6666CC', '6699CC', '66CCCC', '66FFCC',
				'0000FF', '0033FF', '0066FF', '0099FF', '00CCFF', '00FFFF', '3300FF', '3333FF', '3366FF', '3399FF', '33CCFF', '33FFFF', '6600FF', '6633FF', '6666FF', '6699FF', '66CCFF', '66FFFF',
				'990000', '993300', '996600', '999900', '99CC00', '99FF00', 'CC0000', 'CC3300', 'CC6600', 'CC9900', 'CCCC00', 'CCFF00', 'FF0000', 'FF3300', 'FF6600', 'FF9900', 'FFCC00', 'FFFF00',
				'990033', '993333', '996633', '999933', '99CC33', '99FF33', 'CC0033', 'CC3333', 'CC6633', 'CC9933', 'CCCC33', 'CCFF33', 'FF0033', 'FF3333', 'FF6633', 'FF9933', 'FFCC33', 'FFFF33',
				'990066', '993366', '996666', '999966', '99CC66', '99FF66', 'CC0066', 'CC3366', 'CC6666', 'CC9966', 'CCCC66', 'CCFF66', 'FF0066', 'FF3366', 'FF6666', 'FF9966', 'FFCC66', 'FFFF66',
				'990099', '993399', '996699', '999999', '99CC99', '99FF99', 'CC0099', 'CC3399', 'CC6699', 'CC9999', 'CCCC99', 'CCFF99', 'FF0099', 'FF3399', 'FF6699', 'FF9999', 'FFCC99', 'FFFF99',
				'9900CC', '9933CC', '9966CC', '9999CC', '99CCCC', '99FFCC', 'CC00CC', 'CC33CC', 'CC66CC', 'CC99CC', 'CCCCCC', 'CCFFCC', 'FF00CC', 'FF33CC', 'FF66CC', 'FF99CC', 'FFCCCC', 'FFFFCC',
				'9900FF', '9933FF', '9966FF', '9999FF', '99CCFF', '99FFFF', 'CC00FF', 'CC33FF', 'CC66FF', 'CC99FF', 'CCCCFF', 'CCFFFF', 'FF00FF', 'FF33FF', 'FF66FF', 'FF99FF', 'FFCCFF', 'FFFFFF',
			];
			var mixedPalette = this.appendColors($('<div class="_wColorPicker_palette_mixed"></div>'), mixedColors, 18);
			
			//palette container
			var bg = $('<div class="_wColorPicker_bg"></div>').css({opacity: this.settings.opacity});
			var content =
			$('<div class="_wColorPicker_content"></div>')			
			.append(custom)
			.append(simplePalette)
			.append(mixedPalette)
			.append($('<div></div>').css(clearFloats));
			
			//put it all together
			this.colorPicker =
			$('<div class="_wColorPicker_holder"></div>')
			.click(function(e){e.stopPropagation();})
			.append(
				$('<div class="_wColorPicker_outer"></div>')
				.append(
					$('<div class="_wColorPicker_inner"></div>')
					.append( bg )
					.append( content )
				)
			)
			.addClass('_wColorPicker_' + this.settings.theme)
			
			return this.colorPicker;
		},
		
		appendColors: function($palette, colors, lineCount)
		{
			var counter = 1;
			var $this = this;
			
			for(index in colors)
			{
				$palette.append(
					$('<div id="_wColorPicker_color_' + counter + '" class="_wColorPicker_color _wColorPicker_color_' + counter + '"></div>').css('backgroundColor', '#' + colors[index])
					.click(function(){$this.colorSelect($this, $(this).css('backgroundColor'));})
					.mouseout(function(e){$this.colorHoverOff($this, $(this));})
					.mouseover(function(){$this.colorHoverOn($this, $(this));})
				);
				
				if(counter == lineCount)
				{
					$palette.append($('<div></div>').css({clear:'both', height:0, fontSize:0, lineHeight:0, marginTop:-1}))
					counter = 0;
				}
				
				counter++;
			}
			
			return $palette;
		},
		
		colorSelect: function($this, color)
		{
			color = $this.toHex(color);;
			
			$this.customTarget.css('backgroundColor', color);
			$this.currentColor = color;
			$this.customInput.val(color);
			
			if($this.settings.onSelect) $this.settings.onSelect.apply(this, [color]);
			
			if($this.buttonColor)
			{
				$this.buttonColor.css('backgroundColor', color);
				$this.hidePalette($this);
			} 
		},
		
		colorHoverOn: function($this, $element)
		{
			$element.parent().children('active').removeClass('active');
			$element.addClass('active').next().addClass('activeLeft');
			$element.nextAll('.' + $element.attr('id') + ':first').addClass('activeTop');
			
			var color = $this.toHex($element.css('backgroundColor'));
			
			$this.customTarget.css('backgroundColor', color);
			$this.customInput.val(color);
			
			if($this.settings.onMouseover) $this.settings.onMouseover.apply(this, [color]);
		},
		
		colorHoverOff: function($this, $element)
		{
			$element.removeClass('active').next().removeClass('activeLeft')
			$element.nextAll('.' + $element.attr('id') + ':first').removeClass('activeTop')
			
			$this.customTarget.css('backgroundColor', $this.currentColor);
			$this.customInput.val($this.currentColor);
			
			if($this.settings.onMouseout) $this.settings.onMouseout.apply(this, [$this.currentColor]);
		},
		
		appendToElement: function($element)
		{
			var $this = this;
			
			if($this.settings.mode == 'flat') $element.append($this.colorPicker);
			else
			{
				//setup button
				$this.paletteHolder = $('<div class="_wColorPicker_paletteHolder"></div>').css({position: 'absolute', overflow: 'hidden', width: 1000}).append($this.colorPicker);
				
				$this.buttonColor = $('<div class="_wColorPicker_buttonColor"></div>').css({width: $this.settings.buttonSize, height: $this.settings.buttonSize});
				
				var buttonHolder =
				$('<div class="_wColorPicker_buttonHolder"></div>')
				.css({position: 'relative'})
				.append($('<div class="_wColorPicker_buttonBorder"></div>').append($this.buttonColor))
				.append($this.paletteHolder);

				$element.append(buttonHolder);
				
				$this.width = $this.colorPicker.outerWidth(true);
				$this.height = $this.colorPicker.outerHeight(true);
				$this.paletteHolder.css({width: $this.width, height: $this.height}).hide();
				
				if($this.settings.effect == 'fade') $this.paletteHolder.css({opacity: 0});
				
				//setup events
				if($this.settings.mode == 'hover')
				{
					buttonHolder.hover(
						function(e){$this.showPalette(e, $this);},
						function(e){$this.hidePalette($this);}
					)
				}
				else if($this.settings.mode == 'click')
				{
					$(document).click(function(){if($this.paletteHolder.hasClass('active'))$this.hidePalette($this);});
					
					buttonHolder
					.click(function(e)
					{
						e.stopPropagation();
						$this.paletteHolder.hasClass('active') ? $this.hidePalette($this) : $this.showPalette(e, $this);
					});
				}
				
				$this.colorSelect($this, $this.settings.initColor);
			}
		},
		
		showPalette: function(e, $this)
		{
			var offset = $this.paletteHolder.parent().offset();
			
			//init some vars
			var left = 0;
			var top = $this.paletteHolder.parent().outerHeight(true);
			$this.slideTopToBottom = top;
			
			if(offset.left - $(window).scrollLeft() + $this.width > $(window).width()) left = -1 * ($this.width - $this.paletteHolder.parent().outerWidth(true));
			if(offset.top - $(window).scrollTop() + $this.height > $(window).height())
			{
				$this.slideTopToBottom = 0;
				top = -1 * ($this.height);
			}
			
			$this.paletteHolder.css({left: left, top: top});
			
			$this.paletteHolder.addClass('active')
			
			if($this.settings.effect == 'slide')
			{
				$this.paletteHolder.stop(true, false).css({height: 0, top: ($this.slideTopToBottom == 0 ? 0 : top)}).show().animate({height: $this.height, top: top}, $this.settings.showSpeed);
			}
			else if($this.settings.effect == 'fade')
			{
				$this.paletteHolder.stop(true, false).show().animate({opacity: 1}, $this.settings.showSpeed);
			}
			else
			{
				$this.paletteHolder.show();
			}
		},
		
		hidePalette: function($this)
		{
			//need this to avoid the double hide when you click on colour (once on click, once on mouse out) - this way it's only triggered once
			if($this.paletteHolder.hasClass('active'))
			{
				$this.paletteHolder.removeClass('active');
				
				if($this.settings.effect == 'slide')
				{
					$this.paletteHolder.stop(true, false).animate({height: 0, top: ($this.slideTopToBottom == 0 ? 0 : $this.slideTopToBottom)}, $this.settings.hideSpeed, function(){$this.paletteHolder.hide()});
				}
				else if($this.settings.effect == 'fade')
				{
					$this.paletteHolder.stop(true, false).animate({opacity: 0}, $this.settings.hideSpeed, function(){$this.paletteHolder.hide()});
				}
				else
				{
					$this.paletteHolder.hide();
				}
			}
		},
		
		toHex: function(color)
		{
			if(color.substring(0,4) === 'rgba')
			{
				hex = 'transparent';
			}
			else if(color.substring(0,3) === 'rgb')
			{
				var rgb = color.substring(4, color.length - 1).replace(/\s/g, '').split(',');
				
				for(i in rgb)
				{
					rgb[i] = parseInt(rgb[i]).toString(16);
					if(rgb[i] == '0') rgb[i] = '00';
				}
				
				var hex = '#' + rgb.join('').toUpperCase();
			}
			else
			{
				hex = color;
			}

			return  hex;
		},
		
		validHex: function(hex)
		{			
			return '#' + hex.replace(/[^0-9a-f]/ig, '').substring(0,6).toUpperCase();
		}
	}

})(jQuery);

