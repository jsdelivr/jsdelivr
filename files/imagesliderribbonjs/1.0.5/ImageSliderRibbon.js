/**
 Author: Mahdi Jaberzadeh Ansari
 Email: mahdijaberzadehansari@yahoo.co.uk
 Library: ImageSliderRibbonJS
 Description: By using this library you can create image slider ribbons like Flash.
 Licence: MIT Licence
 Version 1.0.5
 Date: 26 Sep 2016
 call this method like this:
 ImageSliderRibbonJS('ImageSliderWraperDivId','SliderIconsClassName');
 */
// JavaScript Document
var ImageSliderRibbonJS = function(ImageSliderRibbonDivId, ElementsClass) {
	'use strict';
	var parentImageSliderRibbonDivDOM = document.getElementById(ImageSliderRibbonDivId);
	if (!parentImageSliderRibbonDivDOM)
		throw 'The Image Slider Bar Wrapper couldn\'t be found.';
	if (!window['ImageSliderRibbonJS_' + ImageSliderRibbonDivId])
		window['ImageSliderRibbonJS_' + ImageSliderRibbonDivId] = new MJZ_ImageSliderRibbon(parentImageSliderRibbonDivDOM, ElementsClass);

	function MJZ_ImageSliderRibbon(parentImageSliderRibbonDivDOM, ElementsClass) {
		'use strict';
		var _this = this;
		// function definition area
		this.setStyle = function(element, elementStyle) {
			if (typeof(element) == 'string')
				element = document.createElement(element);
			for (var key in elementStyle) {
				element.style[key] = elementStyle[key];
			}
			return element;
		};
		//
		this.zoomImage = function(imageObj, zoomPercent, zindex) {
			zoomPercent = parseInt(zoomPercent);
			imageObj.PreWidth = imageObj.offsetWidth;
			if (zoomPercent < 0 || zoomPercent > 100)
				return;
			_this.setStyle(imageObj, {
				height: zoomPercent + '%',
				top: ((100 - zoomPercent) / 2) + '%',
				zIndex: zindex
			});
			if (_this.items[0] != imageObj) {
				imageObj.Left = Math.ceil(imageObj.xPos - imageObj.offsetWidth / 2);
				_this.setStyle(imageObj, {
					left: imageObj.Left + 'px'
				});
			}
		};
		//
		this.transition = function(direction) //direction = -1 : Left to right; direction = 1 : Right to Left
		{
			if (direction == -1 && _this.items.length > 1) {
				if (_this.items[0].Left >= _this.StartPoint)
					return;
			} else if (direction == 1 && _this.items.length > 1) {
				if (_this.items[_this.items.length - 1].offsetLeft + _this.items[_this.items.length - 1].offsetWidth <= _this.EndPoint - 10)
					return;
			}
			for (var _i = 0; _i < _this.items.length; _i++) {
				_this.items[_i].Left = parseInt(_this.items[_i].offsetLeft);
				if (direction == 1) {
					_this.items[_i].Left--;
					_this.items[_i].xPos--;
				} else if (direction == -1) {
					_this.items[_i].Left++;
					_this.items[_i].xPos++;
				}
				_this.setStyle(_this.items[_i], {
					left: _this.items[_i].Left + 'px'
				});
			}
		};
		this.IntervalId = null;
		this.setStyle(parentImageSliderRibbonDivDOM, {
			position: 'relative',
			overflow: 'hidden',
			cursor: 'default'
		});
		// There is a transparent div at the left end of the ribbon that when mouse hover on that moves the images to right
		var leftButton = this.setStyle('div', {
			position: 'absolute',
			left: '0',
			top: '0',
			backgroundColor: 'transparent',
			width: '40px',
			height: '100%',
			zIndex: '101'
		});
		parentImageSliderRibbonDivDOM.appendChild(leftButton);
		leftButton.onmouseover = function() {
			clearInterval(_this.IntervalId);
			var __this = _this;
			_this.IntervalId = setInterval(function() {
				__this.transition(-1);
			}, 20);
		};
		leftButton.onmouseout = function() {
			clearInterval(_this.IntervalId);
		};
		// There is a transparent div at the right end of the ribbon that when mouse hover on that moves the images to left
		var reightButton = this.setStyle('div', {
			position: 'absolute',
			right: '0',
			top: '0',
			backgroundColor: 'transparent',
			width: '40px',
			height: '100%',
			zIndex: '101'
		});
		parentImageSliderRibbonDivDOM.appendChild(reightButton);
		reightButton.onmouseover = function() {
			clearInterval(_this.IntervalId);
			var __this = _this;
			_this.IntervalId = setInterval(function() {
				__this.transition(+1);
			}, 20);
		}
		reightButton.onmouseout = function() {
			clearInterval(_this.IntervalId);
		}
		this.StartPoint = 50;
		this.EndPoint = reightButton.offsetLeft;
		this.gap = 6;
		this.items = [];
		var ISRJS_Elements = parentImageSliderRibbonDivDOM.getElementsByTagName('*');
		for (var _i = 0; _i < ISRJS_Elements.length; _i++) {
			if (ISRJS_Elements[_i].className) {
				if (ISRJS_Elements[_i].className.match(ElementsClass)) {
					this.items.push(ISRJS_Elements[_i]);
					this.items[this.items.length - 1].Left = this.StartPoint;
					if (this.items.length > 1) {
						this.items[this.items.length - 1].Left = this.items[this.items.length - 2].Left + this.items[this.items.length - 2].offsetWidth + this.gap;
					}
					this.setStyle(ISRJS_Elements[_i], {
						height: '50%',
						position: 'absolute',
						zIndex: '99',
						top: '25%',
						left: this.items[this.items.length - 1].Left + 'px',
						visibility: 'visible'
					});
					this.items[this.items.length - 1].xPos = Math.ceil(this.items[this.items.length - 1].offsetLeft + this.items[this.items.length - 1].offsetWidth / 2);
					ISRJS_Elements[_i].onmouseover = function() {
						if (typeof this.STID == 'undefined')
							this.STID = new Array();
						for (var _j = 0; _j < this.STID.length; _j++)
							clearTimeout(this.STID[_j]);
						var __this = this;
						this.STID[0] = setTimeout(function() {
							_this.zoomImage(__this, 90, 100);
						}, 100);
						this.STID[1] = setTimeout(function() {
							_this.zoomImage(__this, 80, 100);
						}, 300);
						this.STID[2] = setTimeout(function() {
							_this.zoomImage(__this, 87.5, 100);
						}, 500);
						this.STID[3] = setTimeout(function() {
							_this.zoomImage(__this, 82.5, 100);
						}, 700);
						this.STID[4] = setTimeout(function() {
							_this.zoomImage(__this, 85, 100);
						}, 900);
					}
					ISRJS_Elements[_i].onmouseout = function() {
						if (typeof this.STID == 'undefined')
							this.STID = new Array();
						for (var _j = 0; _j < this.STID.length; _j++)
							clearTimeout(this.STID[_j]);
						var __this = this;
						this.STID[0] = setTimeout(function() {
							_this.zoomImage(__this, 45, 99);
						}, 100);
						this.STID[1] = setTimeout(function() {
							_this.zoomImage(__this, 55, 99);
						}, 300);
						this.STID[2] = setTimeout(function() {
							_this.zoomImage(__this, 47.5, 99);
						}, 500);
						this.STID[3] = setTimeout(function() {
							_this.zoomImage(__this, 52.5, 99);
						}, 700);
						this.STID[4] = setTimeout(function() {
							_this.zoomImage(__this, 50, 99);
						}, 900);
					}
				}
			}
		}
		// This function detects the direction of the pointer movment and based on that it move the pictures to left or right
		parentImageSliderRibbonDivDOM.onmousemove = function(event) {
			if (typeof _this.PreClientX == 'undefined')
				_this.PreClientX = event.clientX;
			if (event.clientX > _this.PreClientX)
				_this.transition(1);
			else if (event.clientX < _this.PreClientX)
				_this.transition(-1);
			_this.PreClientX = event.clientX;
		}
	}
};