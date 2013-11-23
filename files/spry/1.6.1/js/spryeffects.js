// Spry.Effect.js - version 0.38 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry;

if (!Spry) Spry = {};

Spry.forwards = 1; // const
Spry.backwards = 2; // const

if (!Spry.Effect) Spry.Effect = {};

Spry.Effect.Transitions = {
	linearTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		return begin + (time / duration) * change;
	},
	sinusoidalTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		return begin + ((-Math.cos((time/duration)*Math.PI)/2) + 0.5) * change;
	},
	squareTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		return begin + Math.pow(time/duration, 2) * change;
	},
	squarerootTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		return begin + Math.sqrt(time/duration) * change;
	},
	fifthTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		return begin + Math.sqrt((-Math.cos((time/duration)*Math.PI)/2) + 0.5) * change;
	},
	circleTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		var pos = time/duration;
		return begin + Math.sqrt(1 - Math.pow((pos-1), 2))* change;
	},
	pulsateTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		return begin + (0.5 + Math.sin(17*time/duration)/2) * change;
	},
	growSpecificTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		var pos = time/duration;
		return begin + (5 * Math.pow(pos, 3) - 6.4 * Math.pow(pos, 2) + 2 * pos) * change;
	}
};
for (var trans in Spry.Effect.Transitions)
{
	Spry[trans] = Spry.Effect.Transitions[trans];
}
//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Registry
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Registry = function()
{
	this.effects = [];
};

Spry.Effect.Registry.prototype.getRegisteredEffect = function(element, options) 
{
	var a = {};
	a.element = Spry.Effect.getElement(element);
	a.options = options;

	for (var i=0; i<this.effects.length; i++)
		if (this.effectsAreTheSame(this.effects[i], a))
			return this.effects[i].effect;

	return false;
};

Spry.Effect.Registry.prototype.addEffect = function(effect, element, options)
{
	if (!this.getRegisteredEffect(element, options))
	{
		var len = this.effects.length;
		this.effects[len] = {};
		var eff = this.effects[len];
		eff.effect = effect;
		eff.element = Spry.Effect.getElement(element);
		eff.options = options;
	}
};

Spry.Effect.Registry.prototype.effectsAreTheSame = function(effectA, effectB)
{
	if (effectA.element != effectB.element)
		return false;

	var compare = Spry.Effect.Utils.optionsAreIdentical(effectA.options, effectB.options);
	// reset finish and setup functions
	if (compare)
	{
		if (typeof effectB.options.setup == 'function')
			effectA.options.setup = effectB.options.setup;

		if (typeof effectB.options.finish == 'function')
			effectA.options.finish = effectB.options.finish;
	}		

	return compare;
};

var SpryRegistry = new Spry.Effect.Registry;

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Utils
//
//////////////////////////////////////////////////////////////////////

if (!Spry.Effect.Utils) Spry.Effect.Utils = {};

Spry.Effect.Utils.showError = function(msg)
{
	alert('Spry.Effect ERR: ' + msg);
};
Spry.Effect.Utils.showInitError = function(effect){
	Spry.Effect.Utils.showError('The ' + effect + ' class can\'t be accessed as a static function anymore. '+ "\n" + 'Please read Spry Effects migration documentation.');
	return false;
};
Spry.Effect.Utils.Position = function()
{
	this.x = 0; // left
	this.y = 0; // top
	this.units = "px";
};

Spry.Effect.Utils.Rectangle = function()
{
	this.width = 0;
	this.height = 0;
	this.units = "px";
};

Spry.Effect.Utils.intToHex = function(integerNum) 
{
	var result = integerNum.toString(16);
	if (result.length == 1)
		result = "0" + result;
	return result;
};

Spry.Effect.Utils.hexToInt = function(hexStr)
{
	return parseInt(hexStr, 16);
};

Spry.Effect.Utils.rgb = function(redInt, greenInt, blueInt)
{
	var intToHex = Spry.Effect.Utils.intToHex;
	var redHex = intToHex(redInt);
	var greenHex = intToHex(greenInt);
	var blueHex = intToHex(blueInt);
	compositeColorHex = redHex.concat(greenHex, blueHex).toUpperCase();
	compositeColorHex = '#' + compositeColorHex;
	return compositeColorHex;
};

Spry.Effect.Utils.longColorVersion = function(color){
	if ( color.match(/^#[0-9a-f]{3}$/i) ){
		var tmp = color.split('');
		var color = '#';
		for (var i = 1; i < tmp.length; i++){
			color += tmp[i] + '' + tmp[i];	
		}
	}
	return color;
};

Spry.Effect.Utils.camelize = function(stringToCamelize)
{
	if (stringToCamelize.indexOf('-') == -1){
		return stringToCamelize;	
	}
	var oStringList = stringToCamelize.split('-');
	var isFirstEntry = true;
	var camelizedString = '';

	for(var i=0; i < oStringList.length; i++)
	{
		if(oStringList[i].length>0)
		{
			if(isFirstEntry)
			{
				camelizedString = oStringList[i];
				isFirstEntry = false;
			}
			else
			{
				var s = oStringList[i];
				camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
			}
		}
	}

	return camelizedString;
};

Spry.Effect.Utils.isPercentValue = function(value)
{
	var result = false;
	if (typeof value == 'string' && value.length > 0 && value.lastIndexOf("%") > 0)
		result = true;

	return result;
};

Spry.Effect.Utils.getPercentValue = function(value)
{
	var result = 0;
	try
	{
		result = Number(value.substring(0, value.lastIndexOf("%")));
	}
	catch (e) {Spry.Effect.Utils.showError('Spry.Effect.Utils.getPercentValue: ' + e);}
	return result;
};

Spry.Effect.Utils.getPixelValue = function(value)
{
	var result = 0;
	if (typeof value == 'number') return value;
	var unitIndex = value.lastIndexOf("px");
	if ( unitIndex == -1)
		unitIndex = value.length;
	try
	{
		result = parseInt(value.substring(0, unitIndex), 10);
	}
	catch (e){}
	return result;
};

Spry.Effect.Utils.getFirstChildElement = function(node)
{
	if (node)
	{
		var childCurr = node.firstChild;
		while (childCurr)
		{
			if (childCurr.nodeType == 1) // Node.ELEMENT_NODE
				return childCurr;

			childCurr = childCurr.nextSibling;
		}
	}

	return null;
};

Spry.Effect.Utils.fetchChildImages = function(startEltIn, targetImagesOut)
{
	if(!startEltIn  || startEltIn.nodeType != 1 || !targetImagesOut)
		return;

	if(startEltIn.hasChildNodes())
	{
		var childImages = startEltIn.getElementsByTagName('img');
		var imageCnt = childImages.length;
		for(var i=0; i<imageCnt; i++)
		{
			var imgCurr = childImages[i];
			var dimensionsCurr = Spry.Effect.getDimensions(imgCurr);
			targetImagesOut.push([imgCurr,dimensionsCurr.width,dimensionsCurr.height]);
		}
	}
};

Spry.Effect.Utils.optionsAreIdentical = function(optionsA, optionsB)
{
	if(optionsA == null && optionsB == null)
		return true;

	if(optionsA != null && optionsB != null)
	{
		var objectCountA = 0;
		var objectCountB = 0;

		for (var propA in optionsA) objectCountA++;
		for (var propB in optionsB) objectCountB++;

		if(objectCountA != objectCountB)
			return false;

		for (var prop in optionsA)
		{
			var typeA = typeof optionsA[prop];
			var typeB = typeof optionsB[prop];
			if ( typeA != typeB || (typeA != 'undefined' && optionsA[prop] != optionsB[prop]))
				return false;
		}

		return true;
	}

	return false;
};

Spry.Effect.Utils.DoEffect = function (effectName, element, options)
{
	if (!options)
		var options = {};

	options.name = effectName;
	var ef = SpryRegistry.getRegisteredEffect(element, options);
	if (!ef)
	{
		ef = new Spry.Effect[effectName](element, options);
		SpryRegistry.addEffect(ef, element, options);
	}
	ef.start();
	return true;
};
//////////////////////////////////////////////////////////////////////
//
//  The notification class
//
//////////////////////////////////////////////////////////////////////
if (!Spry.Utils) Spry.Utils = {};

Spry.Utils.Notifier = function()
{
	this.observers = [];
	this.suppressNotifications = 0;
};

Spry.Utils.Notifier.prototype.addObserver = function(observer)
{
	if (!observer)
		return;

	// Make sure the observer isn't already on the list.

	var len = this.observers.length;
	for (var i = 0; i < len; i++)
		if (this.observers[i] == observer) return;

	this.observers[len] = observer;
};

Spry.Utils.Notifier.prototype.removeObserver = function(observer)
{
	if (!observer)
		return;

	for (var i = 0; i < this.observers.length; i++)
	{
		if (this.observers[i] == observer)
		{
			this.observers.splice(i, 1);
			break;
		}
	}
};

Spry.Utils.Notifier.prototype.notifyObservers = function(methodName, data)
{
	if (!methodName)
		return;

	if (!this.suppressNotifications)
	{
		var len = this.observers.length;
		for (var i = 0; i < len; i++)
		{
			var obs = this.observers[i];
			if (obs)
			{
				if (typeof obs == "function")
					obs(methodName, this, data);
				else if (obs[methodName])
					obs[methodName](this, data);
			}
		}
	}
};

Spry.Utils.Notifier.prototype.enableNotifications = function()
{
	if (--this.suppressNotifications < 0)
	{
		this.suppressNotifications = 0;
		Spry.Effect.Utils.showError("Unbalanced enableNotifications() call!\n");
	}
};

Spry.Utils.Notifier.prototype.disableNotifications = function()
{
	++this.suppressNotifications;
};

//////////////////////////////////////////////////////////////////////
//
// DHTML manipulation
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.getElement = function(ele)
{
	var element = ele;
	if (typeof ele == "string")
		element = document.getElementById(ele);

	if (element == null) 
		Spry.Effect.Utils.showError('Element "' + ele + '" not found.');
	
	return element;
};

Spry.Effect.getStyleProp = function(element, prop)
{
	var value;
	var camelized = Spry.Effect.Utils.camelize(prop);
	try
	{
		if (element.style)
			value = element.style[camelized];

		if (!value)
		{
			if (document.defaultView && document.defaultView.getComputedStyle)
			{
				var css = document.defaultView.getComputedStyle(element, null);
				value = css ? css.getPropertyValue(prop) : null;
			}
			else if (element.currentStyle) 
			{
					value = element.currentStyle[camelized];
			}
		}
	}
	catch (e) {Spry.Effect.Utils.showError('Spry.Effect.getStyleProp: ' + e);}

	return value == 'auto' ? null : value;
};

Spry.Effect.setStyleProp = function(element, prop, value)
{
	try
	{
		element.style[Spry.Effect.Utils.camelize(prop)] = value;
	}
	catch (e) {Spry.Effect.Utils.showError('Spry.Effect.setStyleProp: ' + e);}
};

Spry.Effect.getStylePropRegardlessOfDisplayState = function(element, prop, displayElement)
{
	var refElement = displayElement ? displayElement : element;
	var displayOrig = Spry.Effect.getStyleProp(refElement, 'display');
	var visibilityOrig = Spry.Effect.getStyleProp(refElement, 'visibility');

	if(displayOrig == 'none')
	{
		Spry.Effect.setStyleProp(refElement, 'visibility', 'hidden');
		Spry.Effect.setStyleProp(refElement, 'display', 'block');

		if(window.opera) // opera needs focus to calculate the size for hidden elements
			refElement.focus();
	}

	var styleProp = Spry.Effect.getStyleProp(element, prop);

	if(displayOrig == 'none') // reset the original values
	{
		Spry.Effect.setStyleProp(refElement, 'display', 'none');
		Spry.Effect.setStyleProp(refElement, 'visibility', visibilityOrig);
	}
	return styleProp;
};

Spry.Effect.makePositioned = function(element)
{
	var pos = Spry.Effect.getStyleProp(element, 'position');
	if (!pos || pos == 'static')
	{
		element.style.position = 'relative';

		// Opera returns the offset relative to the positioning context, when an
		// element is position relative but top and left have not been defined
		if (window.opera)
		{
			element.style.top = 0;
			element.style.left = 0;
		}
	}
};

Spry.Effect.isInvisible = function(element)
{
	var propDisplay = Spry.Effect.getStyleProp(element, 'display');
	if (propDisplay && propDisplay.toLowerCase() == 'none')
		return true;

	var propVisible = Spry.Effect.getStyleProp(element, 'visibility');
	if (propVisible && propVisible.toLowerCase() == 'hidden')
		return true;

	return false;
};

Spry.Effect.enforceVisible = function(element)
{
	var propDisplay = Spry.Effect.getStyleProp(element, 'display');
	if (propDisplay && propDisplay.toLowerCase() == 'none')
		Spry.Effect.setStyleProp(element, 'display', 'block');

	var propVisible = Spry.Effect.getStyleProp(element, 'visibility');
	if (propVisible && propVisible.toLowerCase() == 'hidden')
		Spry.Effect.setStyleProp(element, 'visibility', 'visible');
};

Spry.Effect.makeClipping = function(element)
{
	var overflow = Spry.Effect.getStyleProp(element, 'overflow');
	if (!overflow || (overflow.toLowerCase() != 'hidden' && overflow.toLowerCase() != 'scroll'))
	{
		// IE 7 bug: set overflow property to hidden changes the element height to 0
		// -> therefore we save the height before changing the overflow property and set the old size back
		var heightCache = 0;
		var needsCache = /MSIE 7.0/.test(navigator.userAgent) && /Windows NT/.test(navigator.userAgent);
		if(needsCache)
			heightCache = Spry.Effect.getDimensionsRegardlessOfDisplayState(element).height;

		Spry.Effect.setStyleProp(element, 'overflow', 'hidden');

		if(needsCache)
			Spry.Effect.setStyleProp(element, 'height', heightCache+'px');
	}
};

Spry.Effect.cleanWhitespace = function(element) 
{
	var childCountInit = element.childNodes.length;
  for (var i = childCountInit - 1; i >= 0; i--) {
  	var node = element.childNodes[i];
		if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
			try
			{
				element.removeChild(node);
			}
			catch (e) {Spry.Effect.Utils.showError('Spry.Effect.cleanWhitespace: ' + e);}
	}
};

Spry.Effect.getComputedStyle = function(element)
{
	return /MSIE/.test(navigator.userAgent) ? element.currentStyle : document.defaultView.getComputedStyle(element, null);
};

Spry.Effect.getDimensions = function(element)
{
	var dimensions = new Spry.Effect.Utils.Rectangle;
	var computedStyle = null;

	if (element.style.width && /px/i.test(element.style.width))
		dimensions.width = parseInt(element.style.width, 10); // without padding
	else
	{
		computedStyle = Spry.Effect.getComputedStyle(element);
		var tryComputedStyle = computedStyle && computedStyle.width && /px/i.test(computedStyle.width);

		if (tryComputedStyle)
			dimensions.width = parseInt(computedStyle.width, 10); // without padding, includes css

		if (!tryComputedStyle || dimensions.width == 0) // otherwise we might run into problems on safari and opera (mac only)
			dimensions.width = element.offsetWidth;   // includes padding
	}

	if (element.style.height && /px/i.test(element.style.height))
		dimensions.height = parseInt(element.style.height, 10); // without padding
	else
	{
		if (!computedStyle)
			computedStyle = Spry.Effect.getComputedStyle(element);

		var tryComputedStyle = computedStyle && computedStyle.height && /px/i.test(computedStyle.height);

		if (tryComputedStyle)
			dimensions.height = parseInt(computedStyle.height, 10); // without padding, includes css

		if(!tryComputedStyle || dimensions.height == 0) // otherwise we might run into problems on safari and opera (mac only)
			dimensions.height = element.offsetHeight;   // includes padding
	}
	return dimensions;
};

Spry.Effect.getDimensionsRegardlessOfDisplayState = function(element, displayElement)
{
	// If the displayElement display property is set to 'none', we temporarily set its
	// visibility state to 'hidden' to be able to calculate the dimension.

	var refElement = displayElement ? displayElement : element;
	var displayOrig = Spry.Effect.getStyleProp(refElement, 'display');
	var visibilityOrig = Spry.Effect.getStyleProp(refElement, 'visibility');

	if(displayOrig == 'none')
	{
		Spry.Effect.setStyleProp(refElement, 'visibility', 'hidden');
		Spry.Effect.setStyleProp(refElement, 'display', 'block');

		if(window.opera) // opera needs focus to calculate the size for hidden elements
			refElement.focus();
	}

	var dimensions = Spry.Effect.getDimensions(element);

	if(displayOrig == 'none') // reset the original values
	{
		Spry.Effect.setStyleProp(refElement, 'display', 'none');
		Spry.Effect.setStyleProp(refElement, 'visibility', visibilityOrig);
	}
	return dimensions;
};

Spry.Effect.getOpacity = function(element)
{
  var o = Spry.Effect.getStyleProp(element, "opacity");
  if (typeof o == 'undefined' || o == null)
    o = 1.0;
  return o;
};

Spry.Effect.getBgColor = function(ele)
{
  return Spry.Effect.getStyleProp(ele, "background-color");
};

Spry.Effect.intPropStyle = function(e, prop){
		var i = parseInt(Spry.Effect.getStyleProp(e, prop), 10);
		if (isNaN(i))
			return 0;
		return i;
};

Spry.Effect.getPosition = function(element)
{
	var position = new Spry.Effect.Utils.Position;
	var computedStyle = null;

	if (element.style.left  && /px/i.test(element.style.left))
		position.x = parseInt(element.style.left, 10); // without padding
	else
	{
		computedStyle = Spry.Effect.getComputedStyle(element);
		var tryComputedStyle = computedStyle && computedStyle.left && /px/i.test(computedStyle.left);

		if (tryComputedStyle)
			position.x = parseInt(computedStyle.left, 10); // without padding, includes css

		if(!tryComputedStyle || position.x == 0) // otherwise we might run into problems on safari and opera (mac only)
			position.x = element.offsetLeft;   // includes padding
	}

	if (element.style.top && /px/i.test(element.style.top))
		position.y = parseInt(element.style.top, 10); // without padding
	else
	{
		if (!computedStyle)
			computedStyle = Spry.Effect.getComputedStyle(element);

    var tryComputedStyle = computedStyle && computedStyle.top && /px/i.test(computedStyle.top);

		if (tryComputedStyle)
			position.y = parseInt(computedStyle.top, 10); // without padding, includes css

		if(!tryComputedStyle || position.y == 0) // otherwise we might run into problems on safari and opera (mac only)
			position.y = element.offsetTop;   // includes padding
	}
	return position;
};

Spry.Effect.getOffsetPosition = Spry.Effect.getPosition; // deprecated

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Animator
// (base class)
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Animator = function(options)
{
	Spry.Utils.Notifier.call(this);
	
	this.name = 'Animator';
	this.element = null;
	this.startMilliseconds = 0;
	this.repeat = 'none';
	this.isRunning = false;
	this.timer = null;
	this.cancelRemaining = 0;

	if (!options)
		var options = {};

	if (options.toggle)
		this.direction = false;
	else
		this.direction = Spry.forwards;
	
	var self = this;
	if (options.setup != null)
		this.addObserver({onPreEffect: function(){try{self.options.setup(self.element, self);}catch(e){Spry.Effect.Utils.showError('Spry.Effect.Animator.prototype.start: setup callback: ' + e);}}});

	if (options.finish != null)
		this.addObserver({onPostEffect: function(){try{self.options.finish(self.element, self);}catch(e){Spry.Effect.Utils.showError('Spry.Effect.Animator.prototype.stop: finish callback: ' + e);}}});

	this.options = {
		duration: 1000,
		toggle: false,
		transition: Spry.linearTransition,
		interval: 16 // ca. 62 fps
	};

	this.setOptions(options);
	if (options.transition)
		this.setTransition(options.transition);

	if (options.fps)
		this.setFps(options.fps);
};
Spry.Effect.Animator.prototype = new Spry.Utils.Notifier();
Spry.Effect.Animator.prototype.constructor = Spry.Utils.Animator;

Spry.Effect.Animator.prototype.notStaticAnimator = true;

Spry.Effect.Animator.prototype.setOptions = function(options)
{
	if (!options)
		return;
	for (var prop in options)
		this.options[prop] = options[prop];
};
Spry.Effect.Animator.prototype.setTransition = function(transition){
	if (typeof transition == 'number' || transition == "1" || transition == "2")
		switch (parseInt(transition,10))
		{
			case 1: transition = Spry.linearTransition; break;
			case 2: transition = Spry.sinusoidalTransition; break;
			default: Spry.Effect.Utils.showError('unknown transition');
		}

	else if (typeof transition == 'string')
	{
		if (typeof window[transition] == 'function')
			transition = window[transition];
		else if (typeof Spry[transition] == 'function')
			transition = Spry[transition];
		else
			Spry.Effect.Utils.showError('unknown transition');
	}

	this.options.transition = transition;
	if (typeof this.effectsArray != 'undefined'){
		var l = this.effectsArray.length;
		for (var i = 0; i < l; i++)
				this.effectsArray[i].effect.setTransition(transition);
	}
};

Spry.Effect.Animator.prototype.setDuration = function(duration){
	this.options.duration = duration;
	if (typeof this.effectsArray != 'undefined')
	{
		var l = this.effectsArray.length;
		for (var i = 0; i < l; i++)
		{
			this.effectsArray[i].effect.setDuration(duration);
		}
	}
};

Spry.Effect.Animator.prototype.setFps = function(fps){
	this.options.interval = parseInt(1000 / fps, 10);
	this.options.fps = fps;
	if (typeof this.effectsArray != 'undefined')
	{
		var l = this.effectsArray.length;
		for (var i = 0; i < l; i++)
		{
			this.effectsArray[i].effect.setFps(fps);
		}
	}
};

Spry.Effect.Animator.prototype.start = function(withoutTimer)
{
	if (!this.element)
		return;

	if (arguments.length == 0)
		withoutTimer = false;

	if (this.isRunning)
		this.cancel();

	this.prepareStart();
	var currDate = new Date();
	this.startMilliseconds = currDate.getTime();

	if (this.element.id)
		this.element = document.getElementById(this.element.id);

	if (this.cancelRemaining != 0 && this.options.toggle)
	{
		if (this.cancelRemaining < 1 && typeof this.options.transition == 'function')
		{
			var startTime = 0;
			var stopTime = this.options.duration;
			var start = 0;
			var stop = 1;
			var emergency = 0;
			this.cancelRemaining = Math.round(this.cancelRemaining * 1000) / 1000;
			var found = false;
			var middle = 0;
			while (!found)
			{
				if (emergency++ > this.options.duration) break;
				var half = startTime + ((stopTime - startTime) / 2);
				middle = Math.round(this.options.transition(half, 1, -1, this.options.duration) * 1000) / 1000;
				if (middle == this.cancelRemaining)
				{
					this.startMilliseconds -= half;
					found = true;
				}
				if (middle < this.cancelRemaining)
				{
					stopTime = half;
					stop = middle;
				}
				else
				{
					startTime = half;
					start = middle;
				}
			}
		}
		this.cancelRemaining = 0;
	}
	this.notifyObservers('onPreEffect', this);

	if (withoutTimer == false)
	{
		var self = this;
		this.timer = setInterval(function() { self.drawEffect(); }, this.options.interval);
	}
	this.isRunning = true;
};
Spry.Effect.Animator.prototype.stopFlagReset = function()
{
	if (this.timer)
	{
		clearInterval(this.timer);
		this.timer = null;
	}
	this.startMilliseconds = 0;
};
Spry.Effect.Animator.prototype.stop = function()
{
	this.stopFlagReset();
	this.notifyObservers('onPostEffect', this);
	this.isRunning = false;
};

Spry.Effect.Animator.prototype.cancel = function()
{
	var elapsed = this.getElapsedMilliseconds();
	if (this.startMilliseconds > 0 && elapsed < this.options.duration)
		this.cancelRemaining = this.options.transition(elapsed, 0, 1, this.options.duration);

	this.stopFlagReset();
	this.notifyObservers('onCancel', this);
	this.isRunning = false;
};

Spry.Effect.Animator.prototype.drawEffect = function()
{
	var isRunning = true;

	this.notifyObservers('onStep', this);
	var timeElapsed = this.getElapsedMilliseconds();

	if (typeof this.options.transition != 'function'){
		Spry.Effect.Utils.showError('unknown transition');
		return;
	}
	this.animate();

	if (timeElapsed > this.options.duration)
	{
		isRunning = false;
		this.stop();
	}
	return isRunning;
};

Spry.Effect.Animator.prototype.getElapsedMilliseconds = function()
{
	if (this.startMilliseconds > 0)
	{
		var currDate = new Date();
		return (currDate.getTime() - this.startMilliseconds);
	}
	return 0;
};

Spry.Effect.Animator.prototype.doToggle = function()
{
	if (!this.direction)
	{
		this.direction = Spry.forwards;
		return;
	}
	if (this.options.toggle == true)
	{
		if (this.direction == Spry.forwards)
		{
			this.direction = Spry.backwards;
			this.notifyObservers('onToggle', this);
		} 
		else if (this.direction == Spry.backwards)
		{
			this.direction = Spry.forwards;
		}
	}
};

Spry.Effect.Animator.prototype.prepareStart = function()
{
		if (this.options && this.options.toggle)
			this.doToggle();
};

Spry.Effect.Animator.prototype.animate = function(){};
Spry.Effect.Animator.prototype.onStep = function(el)
{
	if (el != this)
		this.notifyObservers('onStep', this);
};
//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Move
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Move = function(element, fromPos, toPos, options)
{
	this.dynamicFromPos = false;
	if (arguments.length == 3)
	{
		options = toPos;
		toPos = fromPos;
		fromPos = Spry.Effect.getPosition(element);
		this.dynamicFromPos = true;
	}

	Spry.Effect.Animator.call(this, options);

	this.name = 'Move';
	this.element = Spry.Effect.getElement(element);
	if (!this.element)
		return;

	if (fromPos.units != toPos.units)
		Spry.Effect.Utils.showError('Spry.Effect.Move: Conflicting units (' + fromPos.units + ', ' + toPos.units + ')');

	this.units = fromPos.units;
	this.startX = Number(fromPos.x);
	this.stopX = Number(toPos.x);
	this.startY = Number(fromPos.y);
	this.stopY = Number(toPos.y);
};

Spry.Effect.Move.prototype = new Spry.Effect.Animator();
Spry.Effect.Move.prototype.constructor = Spry.Effect.Move;

Spry.Effect.Move.prototype.animate = function()
{
	var left = 0;
	var top = 0;
	var floor = Math.floor;
	var elapsed = this.getElapsedMilliseconds();
	if (this.direction == Spry.forwards)
	{
		left = floor(this.options.transition(elapsed, this.startX, this.stopX - this.startX, this.options.duration));
		top = floor(this.options.transition(elapsed, this.startY, this.stopY - this.startY, this.options.duration));
	}
	else if (this.direction == Spry.backwards)
	{
		left = floor(this.options.transition(elapsed, this.stopX, this.startX - this.stopX, this.options.duration));
		top = floor(this.options.transition(elapsed, this.stopY, this.startY - this.stopY, this.options.duration));
	}

	this.element.style.left = left + this.units;
	this.element.style.top = top + this.units;
};

Spry.Effect.Move.prototype.prepareStart = function()
{
	if (this.options && this.options.toggle)
		this.doToggle();

	if (this.dynamicFromPos == true)
	{
		var fromPos = Spry.Effect.getPosition(this.element);
		this.startX = fromPos.x;
		this.startY = fromPos.y;
		
		this.rangeMoveX = this.startX - this.stopX;
		this.rangeMoveY= this.startY - this.stopY;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Size
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Size = function(element, fromRect, toRect, options)
{
	this.dynamicFromRect = false;

	if (arguments.length == 3)
	{
		options = toRect;
		toRect = fromRect;
		fromRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
		this.dynamicFromRect = true;
	}

	Spry.Effect.Animator.call(this, options);

	this.name = 'Size';
	this.element = Spry.Effect.getElement(element);
	if (!this.element)
		return;

	element = this.element;

	if (fromRect.units != toRect.units)
	{
		Spry.Effect.Utils.showError('Spry.Effect.Size: Conflicting units (' + fromRect.units + ', ' + toRect.units + ')');
		return false;
	}

	this.units = fromRect.units;

	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	this.originalWidth = originalRect.width;
	this.originalHeight = originalRect.height;

	this.startWidth = fromRect.width;
	this.startHeight = fromRect.height;
	this.stopWidth = toRect.width;
	this.stopHeight = toRect.height;
	this.childImages = new Array();

	if (this.options.useCSSBox){
		Spry.Effect.makePositioned(this.element);
		var intProp = Spry.Effect.intPropStyle;
		this.startFromBorder_top = intProp(element, 'border-top-width');
		this.startFromBorder_bottom = intProp(element, 'border-bottom-width');
		this.startFromBorder_left = intProp(element, 'border-left-width');
		this.startFromBorder_right = intProp(element, 'border-right-width');
		this.startFromPadding_top = intProp(element, 'padding-top');
		this.startFromPadding_bottom = intProp(element, 'padding-bottom');
		this.startFromPadding_left = intProp(element, 'padding-left');
		this.startFromPadding_right = intProp(element, 'padding-right');
		this.startFromMargin_top = intProp(element, 'margin-top');
		this.startFromMargin_bottom = intProp(element, 'margin-bottom');
		this.startFromMargin_right = intProp(element, 'margin-right');
		this.startFromMargin_left = intProp(element, 'margin-left');
		this.startLeft = intProp(element, 'left');
		this.startTop = intProp(element, 'top');
	}

	if(this.options.scaleContent)
		Spry.Effect.Utils.fetchChildImages(element, this.childImages);

	this.fontFactor = 1.0;
	var fontSize = Spry.Effect.getStyleProp(this.element, 'font-size');
	if(fontSize && /em\s*$/.test(fontSize))
		this.fontFactor = parseFloat(fontSize);

	var isPercent = Spry.Effect.Utils.isPercentValue;

	if (isPercent(this.startWidth))
	{
		var startWidthPercent = Spry.Effect.Utils.getPercentValue(this.startWidth);
		this.startWidth = originalRect.width * (startWidthPercent / 100);
	}

	if (isPercent(this.startHeight))
	{
		var startHeightPercent = Spry.Effect.Utils.getPercentValue(this.startHeight);
		this.startHeight = originalRect.height * (startHeightPercent / 100);
	}

	if (isPercent(this.stopWidth))
	{
		var stopWidthPercent = Spry.Effect.Utils.getPercentValue(this.stopWidth);
		this.stopWidth = originalRect.width * (stopWidthPercent / 100);
	}

	if (isPercent(this.stopHeight))
	{
		var stopHeightPercent = Spry.Effect.Utils.getPercentValue(this.stopHeight);
		this.stopHeight = originalRect.height * (stopHeightPercent / 100);
	}

	this.enforceVisible = Spry.Effect.isInvisible(this.element);
};

Spry.Effect.Size.prototype = new Spry.Effect.Animator();
Spry.Effect.Size.prototype.constructor = Spry.Effect.Size;

Spry.Effect.Size.prototype.animate = function()
{
	var width = 0;
	var height = 0;
	var fontSize = 0;
	var direction = 0;
	var floor = Math.floor;
	var elapsed = this.getElapsedMilliseconds();

	if (this.direction == Spry.forwards) {
		width = floor(this.options.transition(elapsed, this.startWidth, this.stopWidth - this.startWidth, this.options.duration));
		height = floor(this.options.transition(elapsed, this.startHeight, this.stopHeight - this.startHeight, this.options.duration));
		direction = 1;
	} else if (this.direction == Spry.backwards) {
		width = floor(this.options.transition(elapsed, this.stopWidth, this.startWidth - this.stopWidth, this.options.duration));
		height = floor(this.options.transition(elapsed, this.stopHeight, this.startHeight - this.stopHeight, this.options.duration));
		direction = -1;
	}

	var propFactor = width/this.originalWidth;
	fontSize = this.fontFactor * propFactor;

	var elStyle = this.element.style;
	if (width < 0)
		width = 0;
	
	if (height < 0)
		height = 0;

	elStyle.width = width + this.units;
	elStyle.height = height + this.units;

	if (typeof this.options.useCSSBox != 'undefined' && this.options.useCSSBox == true)
	{
		var intProp = Spry.Effect.intPropStyle;
		var origTop = intProp(this.element, 'top');
		var origLeft = intProp(this.element, 'left');
		var origMarginTop = intProp(this.element, 'margin-top');
		var origMarginLeft = intProp(this.element, 'margin-left');

		var widthFactor = propFactor;
		var heightFactor = height / this.originalHeight;
		var border_top = floor(this.startFromBorder_top * heightFactor);
		var border_bottom = floor(this.startFromBorder_bottom * heightFactor);
		var border_left = floor(this.startFromBorder_left * widthFactor);
		var border_right = floor(this.startFromBorder_right * widthFactor);
		var padding_top = floor(this.startFromPadding_top * heightFactor);
		var padding_bottom = floor(this.startFromPadding_bottom * heightFactor);
		var padding_left = floor(this.startFromPadding_left * widthFactor);
		var padding_right = floor(this.startFromPadding_right * widthFactor);
		var margin_top = floor(this.startFromMargin_top * heightFactor);
		var margin_bottom = floor(this.startFromMargin_bottom * heightFactor);
		var margin_right = floor(this.startFromMargin_right * widthFactor);
		var margin_left = floor(this.startFromMargin_left * widthFactor);

		elStyle.borderTopWidth = border_top + this.units;
		elStyle.borderBottomWidth = border_bottom + this.units;
		elStyle.borderLeftWidth = border_left + this.units;
		elStyle.borderRightWidth = border_right + this.units;
		elStyle.paddingTop = padding_top + this.units;
		elStyle.paddingBottom = padding_bottom + this.units;
		elStyle.paddingLeft = padding_left + this.units;
		elStyle.paddingRight = padding_right + this.units;
		elStyle.marginTop  = margin_top + this.units;
		elStyle.marginBottom = margin_bottom + this.units;
		elStyle.marginLeft = margin_left + this.units;
		elStyle.marginRight = margin_right + this.units;

		// compensate the margin shrinking
		elStyle.left = floor(origLeft + origMarginLeft - margin_left) + this.units;
		elStyle.top = floor(origTop + origMarginTop - margin_top) + this.units;
	}

	if (this.options.scaleContent)
	{

		for(var i=0; i < this.childImages.length; i++)
		{
			this.childImages[i][0].style.width = propFactor * this.childImages[i][1] + this.units;
			this.childImages[i][0].style.height = propFactor * this.childImages[i][2] + this.units;
		}
		this.element.style.fontSize = fontSize + 'em';
	}

	if(this.enforceVisible)
	{
		Spry.Effect.enforceVisible(this.element);
		this.enforceVisible = false;
	}
};

Spry.Effect.Size.prototype.prepareStart = function()
{
	if (this.options && this.options.toggle)
		this.doToggle();	

	if (this.dynamicFromRect == true)
	{
		var fromRect = Spry.Effect.getDimensions(this.element);
		this.startWidth = fromRect.width;
		this.startHeight = fromRect.height;

		this.widthRange = this.startWidth - this.stopWidth;
		this.heightRange = this.startHeight - this.stopHeight;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Opacity
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Opacity = function(element, startOpacity, stopOpacity, options)
{
	this.dynamicStartOpacity = false;
	if (arguments.length == 3)
	{
		options = stopOpacity;
		stopOpacity = startOpacity;
		startOpacity = Spry.Effect.getOpacity(element);
		this.dynamicStartOpacity = true;
	}

	Spry.Effect.Animator.call(this, options);

	this.name = 'Opacity';
	this.element = Spry.Effect.getElement(element);
	if (!this.element)
		return;

 	// make this work on IE on elements without 'layout'
	if(/MSIE/.test(navigator.userAgent) && (!this.element.hasLayout))
		Spry.Effect.setStyleProp(this.element, 'zoom', '1');

	this.startOpacity = startOpacity;
	this.stopOpacity = stopOpacity;
	this.enforceVisible = Spry.Effect.isInvisible(this.element);
};

Spry.Effect.Opacity.prototype = new Spry.Effect.Animator();
Spry.Effect.Opacity.prototype.constructor = Spry.Effect.Opacity;

Spry.Effect.Opacity.prototype.animate = function()
{
	var opacity = 0;
	var elapsed = this.getElapsedMilliseconds();
	if (this.direction == Spry.forwards) 
		opacity = this.options.transition(elapsed, this.startOpacity, this.stopOpacity - this.startOpacity, this.options.duration);
	else if (this.direction == Spry.backwards) 
		opacity = this.options.transition(elapsed, this.stopOpacity, this.startOpacity - this.stopOpacity, this.options.duration);

	if (opacity < 0)
		opacity = 0;

	if(/MSIE/.test(navigator.userAgent))
	{
		var tmpval = Spry.Effect.getStyleProp(this.element,'filter');
		if (tmpval){
			tmpval = tmpval.replace(/alpha\(opacity=[0-9]{1,3}\)/g, '');
		}
		this.element.style.filter = tmpval + "alpha(opacity=" + Math.floor(opacity * 100) + ")";
	}
	else
		this.element.style.opacity = opacity;

	if(this.enforceVisible)
	{
		Spry.Effect.enforceVisible(this.element);
		this.enforceVisible = false;
	}
};

Spry.Effect.Opacity.prototype.prepareStart = function()
{
	if (this.options && this.options.toggle)
		this.doToggle();	

	if (this.dynamicStartOpacity == true)
	{
		this.startOpacity = Spry.Effect.getOpacity(this.element);
		this.opacityRange = this.startOpacity - this.stopOpacity;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Color
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Color = function(element, startColor, stopColor, options)
{
	this.dynamicStartColor = false;
	if (arguments.length == 3)
	{
		options = stopColor;
		stopColor = startColor;
		startColor = Spry.Effect.getBgColor(element);
		this.dynamicStartColor = true;
	}
	
	Spry.Effect.Animator.call(this, options);

	this.name = 'Color';
	this.element = Spry.Effect.getElement(element);
	if (!this.element)
		return;

	this.startColor = startColor;
	this.stopColor = stopColor;
	this.startRedColor = Spry.Effect.Utils.hexToInt(startColor.substr(1,2));
	this.startGreenColor = Spry.Effect.Utils.hexToInt(startColor.substr(3,2));
	this.startBlueColor = Spry.Effect.Utils.hexToInt(startColor.substr(5,2));
	this.stopRedColor = Spry.Effect.Utils.hexToInt(stopColor.substr(1,2));
	this.stopGreenColor = Spry.Effect.Utils.hexToInt(stopColor.substr(3,2));
	this.stopBlueColor = Spry.Effect.Utils.hexToInt(stopColor.substr(5,2));
};

Spry.Effect.Color.prototype = new Spry.Effect.Animator();
Spry.Effect.Color.prototype.constructor = Spry.Effect.Color;

Spry.Effect.Color.prototype.animate = function()
{
	var redColor = 0;
	var greenColor = 0;
	var blueColor = 0;
	var floor = Math.floor;
	var elapsed = this.getElapsedMilliseconds();

	if (this.direction == Spry.forwards)
	{
		redColor = floor(this.options.transition(elapsed, this.startRedColor, this.stopRedColor - this.startRedColor, this.options.duration));
		greenColor = floor(this.options.transition(elapsed, this.startGreenColor, this.stopGreenColor - this.startGreenColor, this.options.duration));
		blueColor = floor(this.options.transition(elapsed, this.startBlueColor, this.stopBlueColor - this.startBlueColor, this.options.duration));
	}
	else if (this.direction == Spry.backwards)
	{
		redColor = floor(this.options.transition(elapsed, this.stopRedColor, this.startRedColor - this.stopRedColor, this.options.duration));
		greenColor = floor(this.options.transition(elapsed, this.stopGreenColor, this.startGreenColor - this.stopGreenColor, this.options.duration));
		blueColor = floor(this.options.transition(elapsed, this.stopBlueColor, this.startBlueColor - this.stopBlueColor, this.options.duration));
	}

	this.element.style.backgroundColor = Spry.Effect.Utils.rgb(redColor, greenColor, blueColor);
};

Spry.Effect.Color.prototype.prepareStart = function() 
{
	if (this.options && this.options.toggle)
		this.doToggle();

	if (this.dynamicStartColor == true)
	{
		this.startColor = Spry.Effect.getBgColor(element);
		this.startRedColor = Spry.Effect.Utils.hexToInt(startColor.substr(1,2));
		this.startGreenColor = Spry.Effect.Utils.hexToInt(startColor.substr(3,2));
		this.startBlueColor = Spry.Effect.Utils.hexToInt(startColor.substr(5,2));
		this.redColorRange = this.startRedColor - this.stopRedColor;
		this.greenColorRange = this.startGreenColor - this.stopGreenColor;
		this.blueColorRange = this.startBlueColor - this.stopBlueColor;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Cluster
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Cluster = function(options)
{
	Spry.Effect.Animator.call(this, options);

	this.name = 'Cluster';
	this.effectsArray = new Array();
	this.currIdx = -1;
	var _ClusteredEffect = function(effect, kind)
	{
		this.effect = effect;
		this.kind = kind; // "parallel" or "queue"
		this.isRunning = false;
	};

	this.ClusteredEffect = _ClusteredEffect;
};

Spry.Effect.Cluster.prototype = new Spry.Effect.Animator();
Spry.Effect.Cluster.prototype.constructor = Spry.Effect.Cluster;

Spry.Effect.Cluster.prototype.setInterval = function(interval){
	var l = this.effectsArray.length;
	this.options.interval = interval;
	for (var i = 0; i < l; i++)
	{
		this.effectsArray[i].effect.setInterval(interval);
	}
};
Spry.Effect.Cluster.prototype.drawEffect = function()
{
	var isRunning = true;
	var allEffectsDidRun = false;
	var baseEffectIsStillRunning = false;
	var evalNextEffectsRunning = false;

	if ((this.currIdx == -1 && this.direction == Spry.forwards) || (this.currIdx == this.effectsArray.length && this.direction == Spry.backwards))
		this.initNextEffectsRunning();

	var start = this.direction == Spry.forwards ? 0 : this.effectsArray.length-1;
	var stop = this.direction == Spry.forwards ? this.effectsArray.length : -1;
	var step = this.direction == Spry.forwards ? 1 : -1;
	for (var i = start; i != stop; i+=step)
	{
		if (this.effectsArray[i].isRunning == true)
		{
			baseEffectIsStillRunning = this.effectsArray[i].effect.drawEffect();
			if (baseEffectIsStillRunning == false && i == this.currIdx)
			{
				this.effectsArray[i].isRunning = false;
				evalNextEffectsRunning = true;
			}
		}
	}

	if (evalNextEffectsRunning == true)
		allEffectsDidRun = this.initNextEffectsRunning();

	if (allEffectsDidRun == true) {
		this.stop();
		isRunning = false;
		for (var i = 0; i < this.effectsArray.length; i++)
			this.effectsArray[i].isRunning = false;

		this.currIdx = this.direction == Spry.forwards ? this.effectsArray.length: -1;
	}
	return isRunning;
};

Spry.Effect.Cluster.prototype.initNextEffectsRunning = function()
{
	var allEffectsDidRun = false;
	var step = this.direction == Spry.forwards ? 1 : -1;
	var stop = this.direction == Spry.forwards ? this.effectsArray.length : -1;
	this.currIdx+=step;
	if ( (this.currIdx > (this.effectsArray.length - 1) && this.direction == Spry.forwards) || (this.currIdx < 0 && this.direction == Spry.backwards))
		allEffectsDidRun = true;
	else
		for (var i = this.currIdx; i != stop; i+=step)
		{
			if ((i > this.currIdx && this.direction == Spry.forwards || i < this.currIdx && this.direction == Spry.backwards) && this.effectsArray[i].kind == "queue")
				break;
			this.effectsArray[i].effect.start(true);
			this.effectsArray[i].isRunning = true;
			this.currIdx = i;
		}

	return allEffectsDidRun;
};

Spry.Effect.Cluster.prototype.toggleCluster = function()
{
	if (!this.direction)
	{
		this.direction = Spry.forwards;
		return;
	}

	if (this.options.toggle == true)
	{
		if (this.direction == Spry.forwards)
		{
			this.direction = Spry.backwards;
			this.notifyObservers('onToggle', this);
			this.currIdx = this.effectsArray.length;
		}
		else if (this.direction == Spry.backwards)
		{
			this.direction = Spry.forwards;
			this.currIdx = -1;
		}
	}
	else
	{
		if (this.direction == Spry.forwards)
			this.currIdx = -1;
		else if (this.direction == Spry.backwards)
			this.currIdx = this.effectsArray.length;
	}
};

Spry.Effect.Cluster.prototype.doToggle = function()
{
	this.toggleCluster();

	// toggle all effects of the cluster, too
	for (var i = 0; i < this.effectsArray.length; i++)
	{
		if (this.effectsArray[i].effect.options && (this.effectsArray[i].effect.options.toggle != null))
			if (this.effectsArray[i].effect.options.toggle == true)
				this.effectsArray[i].effect.doToggle();
	}
};

Spry.Effect.Cluster.prototype.cancel = function()
{
	for (var i = 0; i < this.effectsArray.length; i++)
		if (this.effectsArray[i].effect.isRunning)
			this.effectsArray[i].effect.cancel();
	
	var elapsed = this.getElapsedMilliseconds();
	if (this.startMilliseconds > 0 && elapsed < this.options.duration)
		this.cancelRemaining = this.options.transition(elapsed, 0, 1, this.options.duration);
	this.stopFlagReset();
	this.notifyObservers('onCancel', this);
	this.isRunning = false;
};

Spry.Effect.Cluster.prototype.addNextEffect = function(effect)
{
	effect.addObserver(this);
	this.effectsArray[this.effectsArray.length] = new this.ClusteredEffect(effect, "queue");
	if (this.effectsArray.length == 1)
	{
		// with the first added effect we know the element
		// that the cluster is working on
		this.element = effect.element;
	}
};

Spry.Effect.Cluster.prototype.addParallelEffect = function(effect)
{
	if (this.effectsArray.length == 0 || this.effectsArray[this.effectsArray.length-1].kind != 'parallel')
		effect.addObserver(this);

	this.effectsArray[this.effectsArray.length] = new this.ClusteredEffect(effect, "parallel");
	if (this.effectsArray.length == 1)
	{
		// with the first added effect we know the element
		// that the cluster is working on
		this.element = effect.element;
	}
};

Spry.Effect.Cluster.prototype.prepareStart = function()
{
	this.toggleCluster();
};

//////////////////////////////////////////////////////////////////////
//
// Combination effects
// Custom effects can be build by combining basic effect bahaviour
// like Move, Size, Color, Opacity
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Fade = function (element, options) 
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Fade');

	Spry.Effect.Cluster.call(this, options);

	this.name = 'Fade';
	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	var durationInMilliseconds = 1000;
	var fromOpacity = 0.0;
	var toOpacity = 100.0;
	var doToggle = false;
	var transition = Spry.fifthTransition;
	var fps = 60;
	var originalOpacity = 0;
	if(/MSIE/.test(navigator.userAgent))
		originalOpacity = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(this.element, 'filter').replace(/alpha\(opacity=([0-9]{1,3})\)/g, '$1'), 10);
	else
		originalOpacity = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(this.element, 'opacity') * 100, 10);

	if (isNaN(originalOpacity))
		originalOpacity = 100;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null){
			if (Spry.Effect.Utils.isPercentValue(options.from))
				fromOpacity = Spry.Effect.Utils.getPercentValue(options.from) * originalOpacity / 100;
			else
				fromOpacity = options.from;
		}
		if (options.to != null)
		{	
			if (Spry.Effect.Utils.isPercentValue(options.to))
				toOpacity = Spry.Effect.Utils.getPercentValue(options.to) * originalOpacity / 100;
			else
				toOpacity = options.to;
		}
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) transition = options.transition;
		if (options.fps != null) fps = options.fps;
		else this.options.transition = transition;
	}

	fromOpacity = fromOpacity/ 100.0;
	toOpacity = toOpacity / 100.0;

	options = {duration: durationInMilliseconds, toggle: doToggle, transition: transition, from: fromOpacity, to: toOpacity, fps: fps};
	var fadeEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	this.addNextEffect(fadeEffect);
};

Spry.Effect.Fade.prototype = new Spry.Effect.Cluster();
Spry.Effect.Fade.prototype.constructor = Spry.Effect.Fade;

Spry.Effect.Blind = function (element, options)
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Blind'); 

	Spry.Effect.Cluster.call(this, options);

	this.name = 'Blind';
	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	var durationInMilliseconds = 1000;
	var doToggle = false;
	var kindOfTransition = Spry.circleTransition;
	var fps = 60;
	var doScaleContent = false;

	Spry.Effect.makeClipping(element);

	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	var fromHeightPx  = originalRect.height;
	var toHeightPx    = 0;
	var optionFrom = options ? options.from : originalRect.height;
	var optionTo   = options ? options.to : 0;
	var fullCSSBox = false;


	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null)
		{
			if (Spry.Effect.Utils.isPercentValue(options.from))
				fromHeightPx = Spry.Effect.Utils.getPercentValue(options.from) * originalRect.height / 100;
			else
				fromHeightPx = Spry.Effect.Utils.getPixelValue(options.from);
		}
		if (options.to != null)
		{
			if (Spry.Effect.Utils.isPercentValue(options.to))
				toHeightPx = Spry.Effect.Utils.getPercentValue(options.to) * originalRect.height / 100;
			else
				toHeightPx = Spry.Effect.Utils.getPixelValue(options.to);
		}
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.fps != null) fps = options.fps;
		if (options.useCSSBox != null) fullCSSBox = options.useCSSBox;
	}

	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = originalRect.width;
	fromRect.height = fromHeightPx;

	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = originalRect.width;
	toRect.height = toHeightPx;

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, scaleContent:doScaleContent, useCSSBox: fullCSSBox, from: optionFrom, to: optionTo, fps: fps};
	var blindEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	this.addNextEffect(blindEffect);
};

Spry.Effect.Blind.prototype = new Spry.Effect.Cluster();
Spry.Effect.Blind.prototype.constructor = Spry.Effect.Blind;

Spry.Effect.Highlight = function (element, options) 
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Highlight'); 

	Spry.Effect.Cluster.call(this, options);

	this.name = 'Highlight';
	var durationInMilliseconds = 1000;
	var toColor = "#ffffff";
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;
	var fps = 60;
	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	var fromColor = Spry.Effect.getBgColor(element);
	if (fromColor == "transparent") fromColor = "#ffff99";

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null) fromColor = options.from;
		if (options.to != null) toColor = options.to;
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.fps != null) fps = options.fps;
	}

	if ( fromColor.indexOf('rgb') != -1 )
		var fromColor = Spry.Effect.Utils.rgb(parseInt(fromColor.substring(fromColor.indexOf('(')+1, fromColor.indexOf(',')),10), parseInt(fromColor.substring(fromColor.indexOf(',')+1, fromColor.lastIndexOf(',')),10), parseInt(fromColor.substring(fromColor.lastIndexOf(',')+1, fromColor.indexOf(')')),10));

	if ( toColor.indexOf('rgb') != -1 )
		var toColor = Spry.Effect.Utils.rgb(parseInt(toColor.substring(toColor.indexOf('(')+1, toColor.indexOf(',')),10), parseInt(toColor.substring(toColor.indexOf(',')+1, toColor.lastIndexOf(',')),10), parseInt(toColor.substring(toColor.lastIndexOf(',')+1, toColor.indexOf(')')),10));

	var fromColor = Spry.Effect.Utils.longColorVersion(fromColor);
	var toColor = Spry.Effect.Utils.longColorVersion(toColor);

	this.restoreBackgroundImage = Spry.Effect.getStyleProp(element, 'background-image');

	options = {duration: durationInMilliseconds, toggle: doToggle, transition: kindOfTransition, fps: fps};
	var highlightEffect = new Spry.Effect.Color(element, fromColor, toColor, options);
	this.addNextEffect(highlightEffect);

	this.addObserver({
		onPreEffect:
		function(effect){
			Spry.Effect.setStyleProp(effect.element, 'background-image', 'none');
		},
		onPostEffect:
		function(effect){
			Spry.Effect.setStyleProp(effect.element, 'background-image', effect.restoreBackgroundImage);

			if (effect.direction == Spry.forwards && effect.options.restoreColor)
				Spry.Effect.setStyleProp(element, 'background-color', effect.options.restoreColor);		
		}
	});
};

Spry.Effect.Highlight.prototype = new Spry.Effect.Cluster();
Spry.Effect.Highlight.prototype.constructor = Spry.Effect.Highlight;

Spry.Effect.Slide = function (element, options) 
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Slide'); 

	Spry.Effect.Cluster.call(this, options);

	this.name = 'Slide';
	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	var durationInMilliseconds = 1000;
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;
	var fps = 60;
	var slideHorizontally = false;
	var firstChildElt = Spry.Effect.Utils.getFirstChildElement(element);
	var direction = -1;

	// IE 7 does not clip static positioned elements -> make element position relative
	if(/MSIE 7.0/.test(navigator.userAgent) && /Windows NT/.test(navigator.userAgent))
		Spry.Effect.makePositioned(element);

	Spry.Effect.makeClipping(element);

	// for IE 6 on win: check if position is static or fixed -> not supported and would cause trouble
	if(/MSIE 6.0/.test(navigator.userAgent) && /Windows NT/.test(navigator.userAgent))
	{
		var pos = Spry.Effect.getStyleProp(element, 'position');
		if(pos && (pos == 'static' || pos == 'fixed'))
		{
			Spry.Effect.setStyleProp(element, 'position', 'relative');
			Spry.Effect.setStyleProp(element, 'top', '');
			Spry.Effect.setStyleProp(element, 'left', '');
		}
	}

	if(firstChildElt)
	{
		Spry.Effect.makePositioned(firstChildElt);
		Spry.Effect.makeClipping(firstChildElt);
  
		var childRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(firstChildElt, element);
		Spry.Effect.setStyleProp(firstChildElt, 'width', childRect.width + 'px');
	}

	var fromDim = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);

	var initDim = new Spry.Effect.Utils.Rectangle();
	var toDim = new Spry.Effect.Utils.Rectangle();
	initDim.width = toDim.width = fromDim.width;
	initDim.height = toDim.height = fromDim.height;

	if (!this.options.to){
		if (!options)
			options = {};

		options.to = '0%';
	}

	if (options && options.horizontal !== null && options.horizontal === true)
		slideHorizontally = true;

	if (options.duration != null) durationInMilliseconds = options.duration;

	if (options.from != null)
	{
		if(slideHorizontally)
		{
				if (Spry.Effect.Utils.isPercentValue(options.from))
					fromDim.width = initDim.width * Spry.Effect.Utils.getPercentValue(options.from) / 100;
				else
					fromDim.width = Spry.Effect.Utils.getPixelValue(options.from);
		}
		else
		{
				if (Spry.Effect.Utils.isPercentValue(options.from))
					fromDim.height = initDim.height * Spry.Effect.Utils.getPercentValue(options.from) / 100;
				else
					fromDim.height = Spry.Effect.Utils.getPixelValue(options.from);
		}
	}

	if (options.to != null)
	{
			if(slideHorizontally)
			{
				if (Spry.Effect.Utils.isPercentValue(options.to))
					toDim.width = initDim.width * Spry.Effect.Utils.getPercentValue(options.to) / 100;
				else
					toDim.width = Spry.Effect.Utils.getPixelValue(options.to);
			}
			else
			{
				if (Spry.Effect.Utils.isPercentValue(options.to))
					toDim.height = initDim.height * Spry.Effect.Utils.getPercentValue(options.to) / 100;
				else
					toDim.height = Spry.Effect.Utils.getPixelValue(options.to);
		}
	}
	if (options.toggle != null) doToggle = options.toggle;
	if (options.transition != null) kindOfTransition = options.transition;
	if (options.fps != null) fps = options.fps;

	options = {duration: durationInMilliseconds, transition: kindOfTransition, scaleContent: false, toggle:doToggle, fps: fps};
	var size = new Spry.Effect.Size(element, fromDim, toDim, options);
	this.addParallelEffect(size);

	if ( (fromDim.width < toDim.width && slideHorizontally) || (fromDim.height < toDim.height && !slideHorizontally))
		direction = 1;
	
	var fromPos = new Spry.Effect.Utils.Position();
	var toPos = new Spry.Effect.Utils.Position();
	toPos.x = fromPos.x = Spry.Effect.intPropStyle(firstChildElt, 'left');
	toPos.y = fromPos.y = Spry.Effect.intPropStyle(firstChildElt, 'top');
	toPos.units = fromPos.units;

	if (slideHorizontally)
		toPos.x = parseInt(fromPos.x + direction * (fromDim.width - toDim.width), 10);
	else
		toPos.y = parseInt(fromPos.y + direction * (fromDim.height - toDim.height), 10);

	if (direction == 1){
		var tmp = fromPos;
		var fromPos = toPos;
		var toPos = tmp;
	}

	options = {duration: durationInMilliseconds, transition: kindOfTransition, toggle:doToggle, from: fromPos, to: toPos, fps: fps};
	var move = new Spry.Effect.Move(firstChildElt, fromPos, toPos, options);
	this.addParallelEffect(move);
};

Spry.Effect.Slide.prototype = new Spry.Effect.Cluster();
Spry.Effect.Slide.prototype.constructor = Spry.Effect.Slide;

Spry.Effect.Grow = function (element, options) 
{
	if (!element)
		return;
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Grow');

	Spry.Effect.Cluster.call(this, options);

	this.name = 'Grow';
	var durationInMilliseconds = 1000;
	var doToggle = false;
	var doScaleContent = true;
	var calcHeight = false;
	var growFromCenter = true;
	var fullCSSBox = false;
	var kindOfTransition = Spry.squareTransition;
	var fps = 60;
	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;

	Spry.Effect.makeClipping(element);

	var dimRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	var originalWidth = dimRect.width;
	var originalHeight = dimRect.height;
	var propFactor = (originalWidth == 0) ? 1 :originalHeight/originalWidth;

	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = 0;
	fromRect.height = 0;

	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = originalWidth;
	toRect.height = originalHeight;

	var optionFrom = options ? options.from : dimRect.width;
	var optionTo   = options ? options.to : 0;
	var pixelValue = Spry.Effect.Utils.getPixelValue;

	if (options)
	{
		if (options.growCenter != null) growFromCenter = options.growCenter;
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.useCSSBox != null) fullCSSBox = options.useCSSBox;
		if (options.scaleContent != null) doScaleContent = options.scaleContent;
		if (options.from != null) 
		{
			if (Spry.Effect.Utils.isPercentValue(options.from))
			{
				fromRect.width = originalWidth * (Spry.Effect.Utils.getPercentValue(options.from) / 100);
				fromRect.height = originalHeight * (Spry.Effect.Utils.getPercentValue(options.from) / 100);
			}
			else
			{
				if(calcHeight)
				{
					fromRect.height = pixelValue(options.from);
					fromRect.width  = pixelValue(options.from) / propFactor;
				}
				else
				{
					fromRect.width = pixelValue(options.from);
					fromRect.height = propFactor * pixelValue(options.from);
				}
			}
		}
		if (options.to != null)
		{
			if (Spry.Effect.Utils.isPercentValue(options.to))
			{
				toRect.width = originalWidth * (Spry.Effect.Utils.getPercentValue(options.to) / 100);
				toRect.height = originalHeight * (Spry.Effect.Utils.getPercentValue(options.to) / 100);
			}
			else
			{
				if(calcHeight)
				{
					toRect.height = pixelValue(options.to);
					toRect.width  = pixelValue(options.to) / propFactor;
				}
				else
				{
					toRect.width = pixelValue(options.to);
					toRect.height = propFactor * pixelValue(options.to);
				}
			}
		}
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.fps != null) fps = options.fps;
	}

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, scaleContent:doScaleContent, useCSSBox: fullCSSBox, fps: fps};
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	this.addParallelEffect(sizeEffect);

	if(growFromCenter)
	{
		Spry.Effect.makePositioned(element);

		var startOffsetPosition = new Spry.Effect.Utils.Position();
		startOffsetPosition.x = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(element, "left"), 10);
		startOffsetPosition.y = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(element, "top"), 10);	
		if (!startOffsetPosition.x) startOffsetPosition.x = 0;
		if (!startOffsetPosition.y) startOffsetPosition.y = 0;

		options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, from: optionFrom, to: optionTo, fps: fps};
		var fromPos = new Spry.Effect.Utils.Position;
		fromPos.x = startOffsetPosition.x + (originalWidth - fromRect.width) / 2.0;
		fromPos.y = startOffsetPosition.y + (originalHeight - fromRect.height) / 2.0;

		var toPos = new Spry.Effect.Utils.Position;
		toPos.x = startOffsetPosition.x + (originalWidth - toRect.width) / 2.0;
		toPos.y = startOffsetPosition.y + (originalHeight - toRect.height) / 2.0;

		var moveEffect = new Spry.Effect.Move(element, fromPos, toPos, options);
		this.addParallelEffect(moveEffect);
	}
};

Spry.Effect.Grow.prototype = new Spry.Effect.Cluster();
Spry.Effect.Grow.prototype.constructor = Spry.Effect.Grow;

Spry.Effect.Shake = function (element, options) 
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Shake'); 

	Spry.Effect.Cluster.call(this, options);

	// toggle is not supported
	this.options.direction = false;
	if (this.options.toggle)
		this.options.toggle = false;

	this.name = 'Shake';

	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	var durationInMilliseconds = 100;
	var kindOfTransition = Spry.linearTransition;
	var fps = 60;
	var steps = 4;

	if (options)
	{
		if (options.duration != null) steps = Math.ceil(this.options.duration / durationInMilliseconds) - 1;
		if (options.fps != null) fps = options.fps;
		if (options.transition != null) kindOfTransition = options.transition;
	}

	Spry.Effect.makePositioned(element);
	
	var startOffsetPosition = new Spry.Effect.Utils.Position();
	startOffsetPosition.x = parseInt(Spry.Effect.getStyleProp(element, "left"), 10);
	startOffsetPosition.y = parseInt(Spry.Effect.getStyleProp(element, "top"), 10);
	if (!startOffsetPosition.x) startOffsetPosition.x = 0;
	if (!startOffsetPosition.y) startOffsetPosition.y = 0;

	var centerPos = new Spry.Effect.Utils.Position;
	centerPos.x = startOffsetPosition.x;
	centerPos.y = startOffsetPosition.y;

	var rightPos = new Spry.Effect.Utils.Position;
	rightPos.x = startOffsetPosition.x + 20;
	rightPos.y = startOffsetPosition.y + 0;

	var leftPos = new Spry.Effect.Utils.Position;
	leftPos.x = startOffsetPosition.x + -20;
	leftPos.y = startOffsetPosition.y + 0;

	options = {duration:Math.ceil(durationInMilliseconds / 2), toggle:false, fps: fps, transition: kindOfTransition};
	var effect = new Spry.Effect.Move(element, centerPos, rightPos, options);
	this.addNextEffect(effect);

	options = {duration:durationInMilliseconds, toggle:false, fps:fps, transition: kindOfTransition};
	var effectToRight = new Spry.Effect.Move(element, rightPos, leftPos, options);
	var effectToLeft = new Spry.Effect.Move(element, leftPos, rightPos, options);

	for (var i=0; i < steps; i++)
	{
		if (i % 2 == 0)
			this.addNextEffect(effectToRight);
		else
			this.addNextEffect(effectToLeft);
	}
	var pos = (steps % 2 == 0) ? rightPos: leftPos;

	options = {duration:Math.ceil(durationInMilliseconds / 2), toggle:false, fps: fps, transition: kindOfTransition};
	var effect = new Spry.Effect.Move(element, pos, centerPos, options);
	this.addNextEffect(effect);
};
Spry.Effect.Shake.prototype = new Spry.Effect.Cluster();
Spry.Effect.Shake.prototype.constructor = Spry.Effect.Shake;
Spry.Effect.Shake.prototype.doToggle = function(){};

Spry.Effect.Squish = function (element, options) 
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Squish');

	if (!options)
		options = {};
	if (!options.to)
		options.to = '0%';
	if (!options.from)
		options.from = '100%';

	options.growCenter = false;
	Spry.Effect.Grow.call(this, element, options);
	this.name = 'Squish';
};
Spry.Effect.Squish.prototype = new Spry.Effect.Grow();
Spry.Effect.Squish.prototype.constructor = Spry.Effect.Squish;

Spry.Effect.Pulsate = function (element, options) 
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Pulsate');

	Spry.Effect.Cluster.call(this, options);

	// toggle is not supported
	this.options.direction = false;
	if (this.options.toggle)
		this.options.toggle = false;

	var element = Spry.Effect.getElement(element);
	var originalOpacity = 0;
	this.element = element;
	if (!this.element)
		return;

	this.name = 'Pulsate';
	var durationInMilliseconds = 100;
	var fromOpacity = 100.0;
	var toOpacity = 0.0;
	var doToggle = false;
	var kindOfTransition = Spry.linearTransition;
	var fps = 60;
	if(/MSIE/.test(navigator.userAgent))
		originalOpacity = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(this.element, 'filter').replace(/alpha\(opacity=([0-9]{1,3})\)/g, '$1'), 10);
	else
		originalOpacity = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(this.element, 'opacity') * 100, 10);

	if (isNaN(originalOpacity)){
		originalOpacity = 100;
	}

	if (options)
	{
		if (options.from != null){
			if (Spry.Effect.Utils.isPercentValue(options.from))
				fromOpacity = Spry.Effect.Utils.getPercentValue(options.from) * originalOpacity / 100;
			else
				fromOpacity = options.from;
		}
		if (options.to != null)
		{	
			if (Spry.Effect.Utils.isPercentValue(options.to))
				toOpacity = Spry.Effect.Utils.getPercentValue(options.to) * originalOpacity / 100;
			else
				toOpacity = options.to;
		}
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.fps != null) fps = options.fps;
	}

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, fps:fps};
	fromOpacity = fromOpacity / 100.0;
	toOpacity = toOpacity / 100.0;

	var fadeEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	var appearEffect = new Spry.Effect.Opacity(element, toOpacity, fromOpacity, options);
	var steps = parseInt(this.options.duration / 200, 10);
	for (var i=0; i < steps; i++){ 
		this.addNextEffect(fadeEffect);
		this.addNextEffect(appearEffect);
	}
};
Spry.Effect.Pulsate.prototype = new Spry.Effect.Cluster();
Spry.Effect.Pulsate.prototype.constructor = Spry.Effect.Pulsate;
Spry.Effect.Pulsate.prototype.doToggle = function(){};

Spry.Effect.Puff = function (element, options)
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Puff'); 

	Spry.Effect.Cluster.call(this, options);

	var element = Spry.Effect.getElement(element);
	this.element = element;	
	if (!this.element)
		return;
	this.name = 'Puff';
	var doToggle = false;
	var doScaleContent = false;
	var durationInMilliseconds = 1000;
	var kindOfTransition = Spry.fifthTransition;
	var fps = 60;

	Spry.Effect.makePositioned(element); // for move

	if (options){
		if (options.toggle != null) doToggle = options.toggle;
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.fps != null) fps = options.fps;
	}
	var originalRect = Spry.Effect.getDimensions(element);
	var startWidth = originalRect.width;
	var startHeight = originalRect.height;

	options = {duration:durationInMilliseconds, toggle:doToggle, transition: kindOfTransition, fps: fps};

	var fromOpacity = 1.0;
	var toOpacity = 0.0;
	var opacityEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	this.addParallelEffect(opacityEffect);

	var fromPos = Spry.Effect.getPosition(element);

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startWidth / 2.0 * -1.0;
	toPos.y = startHeight / 2.0 * -1.0;

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, from: fromPos, to: toPos, fps: fps};
	var moveEffect = new Spry.Effect.Move(element, fromPos, toPos, options);
	this.addParallelEffect(moveEffect);

	var self = this;
	this.addObserver({
		onPreEffect:function(){if (self.direction == Spry.backwards){self.element.style.display = 'block';}},
		onPostEffect: function(){if (self.direction == Spry.forwards){self.element.style.display = 'none';}}
	});
};
Spry.Effect.Puff.prototype = new Spry.Effect.Cluster;
Spry.Effect.Puff.prototype.constructor = Spry.Effect.Puff;

Spry.Effect.DropOut = function (element, options)
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('DropOut');

	Spry.Effect.Cluster.call(this, options);

	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	var durationInMilliseconds = 1000;
	var fps = 60;
	var kindOfTransition = Spry.fifthTransition;
	var direction = Spry.forwards;
	var doToggle = false;
	this.name = 'DropOut';

	Spry.Effect.makePositioned(element);

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.toggle != null) doToggle = options.toggle;
		if (options.fps != null) fps = options.fps;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.dropIn != null) direction = -1;
	}

	var startOffsetPosition = new Spry.Effect.Utils.Position();
	startOffsetPosition.x = parseInt(Spry.Effect.getStyleProp(element, "left"), 10);
	startOffsetPosition.y = parseInt(Spry.Effect.getStyleProp(element, "top"), 10);	
	if (!startOffsetPosition.x) startOffsetPosition.x = 0;
	if (!startOffsetPosition.y) startOffsetPosition.y = 0;

	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + 0;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + 0;
	toPos.y = startOffsetPosition.y + (direction * 160);

	options = {from:fromPos, to:toPos, duration:durationInMilliseconds, toggle:doToggle, transition: kindOfTransition, fps: fps};
	var moveEffect = new Spry.Effect.Move(element, options.from, options.to, options);
	this.addParallelEffect(moveEffect);

	var fromOpacity = 1.0;
	var toOpacity = 0.0;
	options = {duration:durationInMilliseconds, toggle:doToggle, transition: kindOfTransition, fps: fps};
	var opacityEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	this.addParallelEffect(opacityEffect);

	var self = this;
	this.addObserver({
		onPreEffect:function(){self.element.style.display = 'block';},
		onPostEffect: function(){if (self.direction == Spry.forwards){self.element.style.display = 'none';}}
	});

};
Spry.Effect.DropOut.prototype = new Spry.Effect.Cluster();
Spry.Effect.DropOut.prototype.constructor = Spry.Effect.DropOut;

Spry.Effect.Fold = function (element, options)
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Fold');

	Spry.Effect.Cluster.call(this, options);

	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	this.name = 'Fold';
	var durationInMilliseconds = 1000;
	var doToggle = false;
	var doScaleContent = true;
	var fullCSSBox = false;
	var kindOfTransition = Spry.fifthTransition;
	var fps = fps;
	
	Spry.Effect.makeClipping(element);

	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	var startWidth = originalRect.width;
	var startHeight = originalRect.height;

	var stopWidth = startWidth;
	var stopHeight = startHeight / 5;

	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = startWidth;
	fromRect.height = startHeight;

	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = stopWidth;
	toRect.height = stopHeight;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = Math.ceil(options.duration/2);
		if (options.toggle != null) doToggle = options.toggle;
		if (options.useCSSBox != null) fullCSSBox = options.useCSSBox; 
		if (options.fps != null) fps = options.fps;
		if (options.transition != null) kindOfTransition = options.transition;
	}

	options = {duration:durationInMilliseconds, toggle:doToggle, scaleContent:doScaleContent, useCSSBox: fullCSSBox, transition: kindOfTransition, fps: fps};
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	this.addNextEffect(sizeEffect);

	fromRect.width = toRect.width;
	fromRect.height = toRect.height;
	toRect.width = '0%';
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	this.addNextEffect(sizeEffect);
};

Spry.Effect.Fold.prototype = new Spry.Effect.Cluster();
Spry.Effect.Fold.prototype.constructor = Spry.Effect.Fold;

//////////////////////////////////////////////////////////////
// 																													//
// The names of some of the static effect functions 		 		//
// changed in Spry 1.5. These wrappers will insure that we 	//
// remain compatible with previous versions of Spry.				//
// 																													//
//////////////////////////////////////////////////////////////

Spry.Effect.DoFade = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Fade', element, options);
};

Spry.Effect.DoBlind = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Blind', element, options);
};

Spry.Effect.DoHighlight = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Highlight', element, options);
};

Spry.Effect.DoSlide = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Slide', element, options);
};

Spry.Effect.DoGrow = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Grow', element, options);
};

Spry.Effect.DoShake = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Shake', element, options);
};

Spry.Effect.DoSquish = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Squish', element, options);
};

Spry.Effect.DoPulsate = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Pulsate', element, options);
};

Spry.Effect.DoPuff = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Puff', element, options);
};

Spry.Effect.DoDropOut = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('DropOut', element, options);
};

Spry.Effect.DoFold = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Fold', element, options);
};
