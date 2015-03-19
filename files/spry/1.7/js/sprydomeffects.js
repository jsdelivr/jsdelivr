// SpryDOMEffects.js - version 0.6 - Spry Pre-Release 1.7
//
// Copyright (c) 2007. Adobe Systems Incorporated.
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

(function() { // BeginSpryComponent
	
if (typeof Spry == "undefined" || !Spry.Utils || !Spry.$$)
{
	alert("SpryDOMEffects.js requires SpryDOMUtils.js");
	return;
}

if (!Spry.Effect) Spry.Effect = {};

Spry.Effect.Animator = function(opts)
{
	Spry.Effect.Animator.Notifier.call(this);

	this.animatorID = Spry.Effect.Animator.nextID++;
	this.dropFrames = true;
	this.fps = 60; // frames per-second
	this.duration = 500; // msecs
	this.timer = 0;
	this.startTime = 0; // Used only when dropFrames is true.
	this.currentFrame = 0;
	this.easeFunc = Spry.Effect.Animator.defaultEaseFunc;
	this.stopped = false;

	Spry.Effect.Animator.copyProps(this, opts);

	this.interval = 1000 / this.fps;
	this.numFrames = (this.duration / 1000) * this.fps;

	if (this.onComplete)
	{
		var self = this;
		this.addObserver({ onAnimationComplete: function(){ self.onComplete(); } });
	}
};

Spry.Effect.Animator.nextID = 1;

Spry.Effect.Animator.copyProps = function(dst, src)
{
	if (src)
	{
		for (prop in src)
			dst[prop] = src[prop];
	}
	return dst;
};

Spry.Effect.Animator.getElement = function(element)
{
	if (arguments.length > 1)
	{
		for (var i = 0, elements = [], length = arguments.length; i < length; i++)
			elements.push(Spry.Effect.Animator.getElement(arguments[i]));
		return elements;
	}
	if (typeof element == 'string')
		element = document.getElementById(element);
	return element;
};

Spry.Effect.Animator.defaultEaseFunc = function(time, begin, finish, duration) { time /= duration; return begin + ((2 - time) * time * finish); };

Spry.Effect.Animator.Notifier = function()
{
	this.observers = [];
	this.suppressNotifications = 0;
};

Spry.Effect.Animator.Notifier.prototype.addObserver = function(observer)
{
	if (!observer)
		return;

	// Make sure the observer isn't already on the list.

	var len = this.observers.length;
	for (var i = 0; i < len; i++)
	{
		if (this.observers[i] == observer)
			return;
	}
	this.observers[len] = observer;
};

Spry.Effect.Animator.Notifier.prototype.removeObserver = function(observer)
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

Spry.Effect.Animator.Notifier.prototype.notifyObservers = function(methodName, data)
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

Spry.Effect.Animator.Notifier.prototype.enableNotifications = function()
{
	if (--this.suppressNotifications < 0)
	{
		this.suppressNotifications = 0;
		Spry.Debug.reportError("Unbalanced enableNotifications() call!\n");
	}
};

Spry.Effect.Animator.Notifier.prototype.disableNotifications = function()
{
	++this.suppressNotifications;
};

Spry.Effect.Animator.prototype = new Spry.Effect.Animator.Notifier;
Spry.Effect.Animator.prototype.constructor = Spry.Effect.Animator;

Spry.Effect.Animator.prototype.start = function()
{
	this.stopped = false;
	this.currentFrame = 0;
	this.startTime = (new Date()).getTime();

	this.notifyObservers("onAnimationStart");

	var self = this;
	this.timer = setTimeout(function(){ self.onStepAnimation(); }, this.interval);
};

Spry.Effect.Animator.prototype.stop = function()
{
	if (this.timer)
		clearTimeout(this.timer);
	this.timer = 0;
	this.stopped = true;

	this.notifyObservers("onAnimationStopped");
};

Spry.Effect.Animator.prototype.onStepAnimation = function()
{
	var obj = {};

	if (this.dropFrames)
	{
		obj.duration = this.duration;
		obj.elapsed = ((new Date).getTime()) - this.startTime;
		if (obj.elapsed > obj.duration)
			obj.elapsed = obj.duration;
	}
	else
	{
		obj.duration = this.numFrames;
		obj.elapsed = ++this.currentFrame;
	}

	obj.easingConst = this.easeFunc(obj.elapsed, 0, 1, obj.duration)

	this.notifyObservers("onPreDraw", obj);
	this.draw(obj.elapsed, obj.duration, obj.easingConst);
	this.notifyObservers("onPostDraw", obj);

	if (!this.stopped)
	{
		if (obj.elapsed < obj.duration)
		{
			var self = this;
			this.timer = setTimeout(function(){ self.onStepAnimation(); }, this.interval);
		}
		else
		{
			this.stop();
			this.notifyObservers("onAnimationComplete");
		}
	}
};

Spry.Effect.Animator.prototype.draw = function(elapsed, duration, easingConst)
{
	// The default draw method does nothing. It is assumed that
	// derived classes will provide their own implementation of this
	// method.

	debug.log("elapsed: " + elapsed + " -- duration: " + duration + " -- easingConst: " + easingConst);
};


///////////////////////////////////////////////////////////////////////////////

Spry.Effect.CSSAnimator = function(elements, styleStr, opts)
{
	this.animationSets = [];

	Spry.Effect.Animator.call(this, opts);

	this.add(elements, styleStr);
};

Spry.Effect.CSSAnimator.prototype = new Spry.Effect.Animator();
Spry.Effect.CSSAnimator.prototype.constructor = Spry.Effect.CSSAnimator;

Spry.Effect.CSSAnimator.prototype.add = function(elements, styleStr)
{
	// The first argument for the CSSAnimator can be
	// the id of an element, an element node, or an array of
	// elements and/or ids.

	elements = Spry.$$(elements);

	if (elements.length < 1)
		return;

	var animSet = { elements: elements, cssProps: []};

	this.animationSets.push(animSet);

	// Convert the styleStr into an object.

	var toObj = Spry.Utils.styleStringToObject(styleStr);
	for (var p in toObj)
	{
		var obj = new Object;
		var v = toObj[p];
		obj.value = new Number(v.replace(/[^-\d\.]+/g, ""));
		obj.units = v.replace(/[-\d+\.]/g, "");
		toObj[p] = obj;
	}

	for (var i = 0; i < elements.length; i++)
	{
		var obj = animSet.cssProps[i] = new Object;
		for (var p in toObj)
		{
			var pFuncs = Spry.Effect.CSSAnimator.stylePropFuncs[p];
			if (!pFuncs)
				pFuncs = Spry.Effect.CSSAnimator.stylePropFuncs["default"];

			obj[p] = new Object;
			obj[p].from = new Number(pFuncs.get(elements[i], p).replace(/[^-\d\.]+/g, ""));
			obj[p].to = toObj[p].value;
			obj[p].distance = obj[p].to - obj[p].from;
			obj[p].units = toObj[p].units;
		}
	}
};

Spry.Effect.CSSAnimator.prototype.start = function()
{
	for (var s = 0; s < this.animationSets.length; s++)
	{
		var animSet = this.animationSets[s];
		var elements = animSet.elements;
		var cssProps = animSet.cssProps;

		for (var i = 0; i < elements.length; i++)
		{
			var ele = elements[i];
	
			var eleProps = ele.spryCSSAnimatorProps;
			if (!eleProps)
				eleProps = ele.spryCSSAnimatorProps = new Object;
	
			var obj = cssProps[i];
			for (var p in obj)
				eleProps[p] = this.animatorID;
		}
	}

	return Spry.Effect.Animator.prototype.start.call(this);
};

Spry.Effect.CSSAnimator.prototype.stop = function()
{
	for (var s = 0; s < this.animationSets.length; s++)
	{
		var animSet = this.animationSets[s];
		var elements = animSet.elements;
		var cssProps = animSet.cssProps;

		for (var i = 0; i < elements.length; i++)
		{
			var ele = elements[i];
			var obj = cssProps[i];
	
			var eleProps = ele.spryCSSAnimatorProps;
			for (var p in obj)
			{
				if (eleProps[p] == this.animatorID)
					delete eleProps[p];
			}
		}
	}

	return Spry.Effect.Animator.prototype.stop.call(this);
};

Spry.Effect.CSSAnimator.prototype.draw = function(elapsed, duration, easingConst)
{
	for (var s = 0; s < this.animationSets.length; s++)
	{
		var animSet = this.animationSets[s];
		var elements = animSet.elements;
		var cssProps = animSet.cssProps;

		for (var i = 0; i < elements.length; i++)
		{
			var ele = elements[i];
			var eleProps = ele.spryCSSAnimatorProps;
			var obj = cssProps[i];
			for (var p in obj)
			{
				if (eleProps[p] == this.animatorID)
				{
					var pFuncs = Spry.Effect.CSSAnimator.stylePropFuncs[p];
					if (!pFuncs)
						pFuncs = Spry.Effect.CSSAnimator.stylePropFuncs["default"];
	
					if (elapsed > duration)
						pFuncs.set(ele, p, obj[p].to + obj[p].units);
					else
						pFuncs.set(ele, p, obj[p].from + (obj[p].distance * easingConst) + obj[p].units);
				}
			}
		}
	}
};

Spry.Effect.CSSAnimator.stylePropFuncs = {};

Spry.Effect.CSSAnimator.stylePropFuncs["default"] = {
	get: function(ele, prop)
	{
		return ele.style[prop];
	},

	set: function(ele, prop, val)
	{
		ele.style[prop] = val;
	}
};

Spry.Effect.CSSAnimator.stylePropFuncs["opacity"] = {
	get: function(ele, prop)
	{
		var val = 1;
		
		if (ele.style.opacity)
			val = ele.style.opacity;
		else if (ele.style.filter)
		{
			var strVal = ele.style.filter.replace(/.*alpha\(opacity=(\d+)\).*/, "$1");
			if (strVal)
				val = parseInt(strVal) / 100;
		}
		return val + "";
	},

	set: function(ele, prop, val)
	{
		ele.style.opacity = "" + val;
		ele.style.filter = "alpha(opacity=" + (val * 100) + ")";
	}
};

///////////////////////////////////////////////////////////////////////////////

Spry.$$.Results.defaultEaseFunc = function(time, begin, finish, duration) { time /= duration; return begin + ((2 - time) * time * finish); };

Spry.$$.Results.animatePropertyTo = function(propName, to, options)
{
	var opts = { interval: 10, duration: 1000, onComplete: null, transition: Spry.$$.Results.defaultEaseFunc };
	Spry.Effect.Animator.copyProps(opts, options);

	var objs = [];
	for (var i = 0; i < this.length; i++)
	{
		var obj = objs[i] = new Object;
		obj.ele = this[i];
		obj.from = obj.ele[propName];
		obj.distance = to - obj.from;
	}

	var startTime = (new Date).getTime();

	var animateFunc = function()
	{
		var elapsedTime = ((new Date).getTime()) - startTime;

		if (elapsedTime > opts.duration)
		{
			for (var i = 0; i < objs.length; i++)
				objs[i].ele[propName] = to;
			if (opts.onComplete)
				opts.onComplete();
		}
		else
		{
			for (var i = 0; i < objs.length; i++)
			{
				var obj = objs[i];
				obj.ele[propName] = opts.transition(elapsedTime, obj.from, obj.distance, opts.duration);
			}
			setTimeout(animateFunc, opts.interval);
		}
	};

	setTimeout(animateFunc, opts.interval);
	return this;
};

Spry.$$.Results.animateStyleTo = function(styleStr, options)
{
	var a = new Spry.Effect.CSSAnimator(this, styleStr, options);
	a.start();
	return this;
};

})(); // EndSpryComponent