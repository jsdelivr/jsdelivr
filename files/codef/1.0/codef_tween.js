/*
* Tween
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/**
* The TweenJS Javascript library provides a simple but powerful tweening interface. It allows you to chain tweens and
* actions together to create complex sequences. For example:<br/>
* Tween.get(target).wait(500).to({alpha:0,visible:false},1000).call(onComplete);<br/>
* This tween will wait 0.5s, tween the target's alpha property to 0 over 1s, set it's visible to false, then call the onComplete function.
* @module TweenJS
**/

// TODO: possibly add a END actionsMode (only runs actions that == position)?
// TODO: evaluate a way to decouple paused from tick registration.

// namespace:
this.createjs = this.createjs||{};

(function() {
/**
* Returns a new Tween instance. See Tween.get for param documentation.
* @class Tween
* @constructor
**/
var Tween = function(target, props) {
  this.initialize(target, props);
}
var p = Tween.prototype;

// static interface:
	/** 
	 * Constant defining the none actionsMode for use with setPosition.
	 * @property NONE
	 * @type Number
	 * @static
	 **/
	Tween.NONE = 0;
	
	/** 
	 * Constant defining the loop actionsMode for use with setPosition.
	 * @property LOOP
	 * @type Number
	 * @static
	 **/
	Tween.LOOP = 1;
	
	/** 
	 * Constant defining the reverse actionsMode for use with setPosition.
	 * @property REVERSE
	 * @type Number
	 * @static
	 **/
	Tween.REVERSE = 2;

	/**
	 * Constant returned by plugins to tell the tween not to use default assignment.
	 * @property IGNORE
	 * @type Object
	 * @static
	 */
	Tween.IGNORE = {};
	
	/** 
	 * @property _listeners
	 * @type Array[Tween]
	 * @static
	 * @protected 
	 **/
	Tween._tweens = [];
	
	/** 
	 * @property _plugins
	 * @type Object
	 * @static
	 * @protected 
	 **/
	Tween._plugins = {};

	/**
	 * Returns a new tween instance. This is functionally identical to using "new Tween(...)", but looks cleaner
	 * with the chained syntax of TweenJS.
	 * @method get
	 * @static
	 * @param {Object} target The target object that will have its properties tweened.
	 * @param {Object} props The configuration properties to apply to this tween instance (ex. {loop:true, paused:true}). All properties default to false. Supported props are:<UL>
	 *    <LI> loop: sets the loop property on this tween.</LI>
	 *    <LI> useTicks: uses ticks for all durations instead of milliseconds.</LI>
	 *    <LI> ignoreGlobalPause: sets the ignoreGlobalPause property on this tween.</LI>
	 *    <LI> override: if true, Tween.removeTweens(target) will be called to remove any other tweens with the same target.
	 *    <LI> paused: indicates whether to start the tween paused.</LI>
	 *    <LI> position: indicates the initial position for this tween.</LI>
	 *    <LI> onChanged: specifies an onChange handler for this tween.</LI>
	 * </UL>
	 * @return {Tween} A reference to the created tween. Additional chained tweens, method calls, or callbacks can be
	 *      applied to the returned tween instance.
	 **/
	Tween.get = function(target, props, pluginData) {
		return new Tween(target, props, pluginData);
	}
	
	/**
	 * Advances all tweens. This typically uses the Ticker class (available in the EaselJS library), but you can call it manually if you prefer to use
	 * your own "heartbeat" implementation.
	 * @method tick
	 * @static
	 * @param {Number} delta The change in time in milliseconds since the last tick. Required unless all tweens have useTicks set to true.
	 * @param {Boolean} paused Indicates whether a global pause is in effect. Tweens with ignoreGlobalPause will ignore this, but all others will pause if this is true.
	 **/
	Tween.tick = function(delta, paused) {
		var tweens = Tween._tweens.slice(); // to avoid race conditions.
		for (var i=tweens.length-1; i>=0; i--) {
			var tween = tweens[i];
			if ((paused && !tween.ignoreGlobalPause) || tween._paused) { continue; }
			tween.tick(tween._useTicks?1:delta);
		}
	}
	if (createjs.Ticker) { createjs.Ticker.addListener(Tween,false); }
	
	
	/** 
	 * Removes all existing tweens for a target. This is called automatically by new tweens if the "override" prop is true.
	 * @method removeTweens
	 * @static
	 * @param {Object} target The target object to remove existing tweens from.
	 **/
	Tween.removeTweens = function(target) {
		if (!target.tweenjs_count) { return; }
		var tweens = Tween._tweens;
		for (var i=tweens.length-1; i>=0; i--) {
			if (tweens[i]._target == target) {
				tweens[i]._paused = true;
				tweens.splice(i,1);
			}
		}
		target.tweenjs_count = 0;
	}
	
	/** 
	 * Indicates whether there are any active tweens on the target object (if specified) or in general.
	 * @method hasActiveTweens
	 * @static
	 * @param {Object} target Optional. If not specified, the return value will indicate if there are any active tweens on any target.
	 * @return {Boolean} A boolean indicating whether there are any active tweens.
	 **/
	Tween.hasActiveTweens = function(target) {
		if (target) { return target.tweenjs_count; }
		return Tween._tweens && Tween._tweens.length;
	}
	
	/** 
	 * Installs a plugin, which can modify how certain properties are handled when tweened.
	 * See the CSSPlugin for an example of how to write TweenJS plugins.
	 * @method installPlugin
	 * @static
	 * @param {Object} plugin
	 * @param {Array} properties
	 **/
	Tween.installPlugin = function(plugin, properties) {
		var priority = plugin.priority;
		if (priority == null) { plugin.priority = priority = 0; }
		for (var i=0,l=properties.length,p=Tween._plugins;i<l;i++) {
			var n = properties[i];
			if (!p[n]) { p[n] = [plugin]; }
			else {
				var arr = p[n];
				for (var j=0,jl=arr.length;j<jl;j++) {
					if (priority < arr[j].priority) { break; }
				}
				p[n].splice(j,0,plugin);
			}
		}
	}
	
	/** 
	 * Registers or unregisters a tween with the ticking system.
	 * @method _register
	 * @static
	 * @protected 
	 **/
	Tween._register = function(tween, value) {
		var target = tween._target;
		if (value) {
			// TODO: this approach might fail if a dev is using sealed objects in ES5
			if (target) { target.tweenjs_count = target.tweenjs_count ? target.tweenjs_count+1 : 1; }
			Tween._tweens.push(tween);
		} else {
			if (target) { target.tweenjs_count--; }
			var i = Tween._tweens.indexOf(tween);
			if (i != -1) { Tween._tweens.splice(i,1); }
		}
	}

// public properties:
	/**
	 * Causes this tween to continue playing when a global pause is active. For example, if TweenJS is using Ticker,
	 * then setting this to true (the default) will cause this tween to be paused when Ticker.setPaused(true) is called.
	 * See Tween.tick() for more info. Can be set via the props param.
	 * @property ignoreGlobalPause
	 * @type Boolean
	 * @default false
	 **/
	p.ignoreGlobalPause = false;
	
	/**
	 * If true, the tween will loop when it reaches the end. Can be set via the props param.
	 * @property loop
	 * @type Boolean
	 * @default false
	 **/
	p.loop = false;
	
	/**
	 * Read-only. Specifies the total duration of this tween in milliseconds (or ticks if useTicks is true).
	 * This value is automatically updated as you modify the tween. Changing it directly could result in unexpected
	 * behaviour.
	 * @property duration
	 * @type Number
	 * @default 0
	 **/
	p.duration = 0;
	
	/**
	 * Allows you to specify data that will be used by installed plugins. Each plugin uses this differently, but in general
	 * you specify data by setting it to a property of pluginData with the same name as the plugin class.<br/>
	 * Ex. myTween.pluginData.PluginClassName = data;<br/>
	 * <br/>
	 * Also, most plugins support a property to enable or disable them. This is typically the plugin class name followed by "_enabled".<br/>
	 * Ex. myTween.pluginData.PluginClassName_enabled = false;<br/>
	 * <br/>
	 * Some plugins also store instance data in this object, usually in a property named _PluginClassName.
	 * See the documentation for individual plugins for more details.
	 * @property pluginData
	 * @type Object
	 **/
	p.pluginData = null;
	
	/**
	 * Called whenever the tween's position changes with a single parameter referencing this tween instance.
	 * @property onChange
	 * @type Function
	 **/
	p.onChange = null;
	
	/**
	 * Read-only. The target of this tween. This is the object on which the tweened properties will be changed. Changing 
	 * this property after the tween is created will not have any effect.
	 * @property target
	 * @type Object
	 **/
	p.target = null;
	
	/**
	 * Read-only. The current normalized position of the tween. This will always be a value between 0 and duration.
	 * Changing this property directly will have no effect.
	 * @property position
	 * @type Object
	 **/
	p.position = null;

// private properties:
	
	/**
	 * @property _paused
	 * @type Boolean
	 * @protected
	 **/
	p._paused = false;
	
	/**
	 * @property _curQueueProps
	 * @type Object
	 * @protected
	 **/
	p._curQueueProps = null;
	
	/**
	 * @property _initQueueProps
	 * @type Object
	 * @protected
	 **/
	p._initQueueProps = null;
	
	/**
	 * @property _steps
	 * @type Array
	 * @protected
	 **/
	p._steps = null;
	
	/**
	 * @property _actions
	 * @type Array
	 * @protected
	 **/
	p._actions = null;
	
	/**
	 * Raw position.
	 * @property _prevPosition
	 * @type Number
	 * @protected
	 **/
	p._prevPosition = 0;

	/**
	 * The position within the current step.
	 * @property _stepPosition
	 * @type Number
	 * @protected
	 */
	p._stepPosition = 0;
	
	/**
	 * Normalized position.
	 * @property _prevPos
	 * @type Number
	 * @protected
	 **/
	p._prevPos = -1;
	
	/**
	 * @property _target
	 * @type Object
	 * @protected
	 **/
	p._target = null;
	
	/**
	 * @property _useTicks
	 * @type Boolean
	 * @protected
	 **/
	p._useTicks = false;
	
// constructor:
	/** 
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function(target, props, pluginData) {
		this.target = this._target = target;
		if (props) {
			this._useTicks = props.useTicks;
			this.ignoreGlobalPause = props.ignoreGlobalPause;
			this.loop = props.loop;
			this.onChange = props.onChange;
			if (props.override) { Tween.removeTweens(target); }
		}
		
		this.pluginData = pluginData || {};
		this._curQueueProps = {};
		this._initQueueProps = {};
		this._steps = [];
		this._actions = [];
		if (props&&props.paused) { this._paused=true; }
		else { Tween._register(this,true); }
		if (props&&props.position!=null) { this.setPosition(props.position, Tween.NONE); }
	}
	
// public methods:
	/** 
	 * Queues a wait (essentially an empty tween).
	 * @method wait
	 * @param {Number} duration The duration of the wait in milliseconds (or in ticks if useTicks is true).
	 * @return {Tween} This tween instance (for chaining calls).
	 **/
	p.wait = function(duration) {
		if (duration == null || duration <= 0) { return this; }
		var o = this._cloneProps(this._curQueueProps);
		return this._addStep({d:duration, p0:o, e:this._linearEase, p1:o});
	}

	/** 
	 * Queues a tween from the current values to the target properties. Set duration to 0 to jump to these value.
	 * Numeric properties will be tweened from their current value in the tween to the target value. Non-numeric
	 * properties will be set at the end of the specified duration.
	 * @method to
	 * @param {Object} props An object specifying property target values for this tween (Ex. {x:300} would tween the x property of the target to 300).
	 * @param {Number} duration Optional. The duration of the wait in milliseconds (or in ticks if useTicks is true). Defaults to 0.
	 * @param {Function} ease Optional. The easing function to use for this tween. Defaults to a linear ease.
	 * @return {Tween} This tween instance (for chaining calls).
	 **/
	p.to = function(props, duration, ease) {
		if (isNaN(duration) || duration < 0) { duration = 0; }
		return this._addStep({d:duration||0, p0:this._cloneProps(this._curQueueProps), e:ease, p1:this._cloneProps(this._appendQueueProps(props))});
	}
	
	/** 
	 * Queues an action to call the specified function. For example: myTween.wait(1000).call(myFunction); would call myFunction() after 1s.
	 * @method call
	 * @param {Function} callback The function to call.
	 * @param {Array} params Optional. The parameters to call the function with. If this is omitted, then the function will be
	 *      called with a single param pointing to this tween.
	 * @param {Object} scope Optional. The scope to call the function in. If omitted, it will be called in the target's scope.
	 * @return Tween This tween instance (for chaining calls).
	 **/
	p.call = function(callback, params, scope) {
		return this._addAction({f:callback, p:params ? params : [this], o:scope ? scope : this._target});
	}
	
	/** 
	 * Queues an action to set the specified props on the specified target. If target is null, it will use this tween's target. Ex. myTween.wait(1000).set({visible:false},foo);
	 * @method set
	 * @param {Object} props The properties to set (ex. {visible:false}).
	 * @param {Object} target Optional. The target to set the properties on. If omitted, they will be set on the tween's target.
	 * @return {Tween} This tween instance (for chaining calls).
	 **/
	p.set = function(props, target) {
		return this._addAction({f:this._set, o:this, p:[props, target ? target : this._target]});
	}
	
	/** 
	 * Queues an action to to play (unpause) the specified tween. This enables you to sequence multiple tweens. Ex. myTween.to({x:100},500).play(otherTween);
	 * @method play
	 * @param {Tween} tween The tween to play.
	 * @return {Tween} This tween instance (for chaining calls).
	 **/
	p.play = function(tween) {
		return this.call(tween.setPaused, [false], tween);
	}

	/** 
	 * Queues an action to to pause the specified tween.
	 * @method pause
	 * @param {Tween} tween The tween to play. If null, it pauses this tween.
	 * @return {Tween} This tween instance (for chaining calls)
	 **/
	p.pause = function(tween) {
		if (!tween) { tween = this; }
		return this.call(tween.setPaused, [true], tween);
	}
	
	/** 
	 * Advances the tween to a specified position.
	 * @method setPosition
	 * @param {Number} value The position to seek to in milliseconds (or ticks if useTicks is true).
	 * @param {Number} actionsMode Optional parameter specifying how actions are handled (ie. call, set, play, pause): Tween.NONE (0) - run no actions. Tween.LOOP (1) - if new position is less than old, then run all actions between old and duration, then all actions between 0 and new. Defaults to LOOP. Tween.REVERSE (2) - if new position is less than old, run all actions between them in reverse.
	 * @return {Boolean} Returns true if the tween is complete (ie. the full tween has run & loop is false).
	 **/
	p.setPosition = function(value, actionsMode) {
		if (value < 0) { value = 0; }
		if (actionsMode == null) { actionsMode = 1; }
		
		// normalize position:
		var t = value;
		var end = false;
		if (t >= this.duration) {
			if (this.loop) { t = t%this.duration; }
			else {
				t = this.duration;
				end = true;
			}
		}
		if (t == this._prevPos) { return end; }
		
		// handle tweens:
		if (this._target) {
			if (end) {
				// addresses problems with an ending zero length step.
				this._updateTargetProps(null,1);
			} else if (this._steps.length > 0) {
				// find our new tween index:
				for (var i=0, l=this._steps.length; i<l; i++) {
					if (this._steps[i].t > t) { break; }
				}
				var step = this._steps[i-1];
				this._updateTargetProps(step,(this._stepPosition = t-step.t)/step.d,t);
			}
		}
		
		// run actions:
		var prevPos = this._prevPos;
		this.position = this._prevPos = t; // set this in advance in case an action modifies position.
		this._prevPosition = value;
		if (actionsMode != 0 && this._actions.length > 0) {
			if (this._useTicks) {
				// only run the actions we landed on.
				this._runActions(t,t);
			} else if (actionsMode == 1 && t<prevPos) {
				if (prevPos != this.duration) { this._runActions(prevPos, this.duration); }
				this._runActions(0, t, true);
			} else {
				this._runActions(prevPos, t);
			}
		}

		if (end) { this.setPaused(true); }
		
		this.onChange&&this.onChange(this);
		return end;
	}

	/** 
	 * Advances this tween by the specified amount of time in milliseconds (or ticks if useTicks is true).
	 * This is normally called automatically by the Tween engine (via Tween.tick), but is exposed for advanced uses.
	 * @method tick
	 * @param {Number} delta The time to advance in milliseconds (or ticks if useTicks is true).
	 **/
	p.tick = function(delta) {
		if (this._paused) { return; }
		this.setPosition(this._prevPosition+delta);
	}

	/** 
	 * Pauses or plays this tween.
	 * @method setPaused
	 * @param {Boolean} value Indicates whether the tween should be paused (true) or played (false).
	 * @return {Tween} This tween instance (for chaining calls)
	 **/
	p.setPaused = function(value) {
		this._paused = !!value;
		Tween._register(this, !value);
		return this;
	}

	// tiny api (primarily for tool output):
	p.w = p.wait;
	p.t = p.to;
	p.c = p.call;
	p.s = p.set;

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Tween]";
	}
	
	/**
	 * @method clone
	 * @protected
	 **/
	p.clone = function() {
		throw("Tween can not be cloned.")
	}

// private methods:
	/**
	 * @method _updateTargetProps
	 * @protected
	 **/
	p._updateTargetProps = function(step, ratio, position) {
		var p0,p1,v,v0,v1,arr;
		if (!step && ratio == 1) {
			p0 = p1 = this._curQueueProps;
		} else {
			// apply ease to ratio.
			if (step.e) { ratio = step.e(ratio,0,1,1); }
			p0 = step.p0;
			p1 = step.p1;
		}

		for (n in this._initQueueProps) {
			if ((v0 = p0[n]) == null) { p0[n] = v0 = this._initQueueProps[n]; }
			if ((v1 = p1[n]) == null) { p1[n] = v1 = v0; }
			if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof(v0) != "number")) {
				// no interpolation - either at start, end, values don't change, or the value is non-numeric.
				v = ratio == 1 ? v1 : v0;
			} else {
				v = v0+(v1-v0)*ratio;
			}
			
			var ignore = false;
			if (arr = Tween._plugins[n]) {
				for (var i=0,l=arr.length;i<l;i++) {
					var v2 = arr[i].tween(this, n, v, p0, p1, ratio, position, !step);
					if (v2 == Tween.IGNORE) { ignore = true; }
					else { v = v2; }
				}
			}
			if (!ignore) { this._target[n] = v; }
			
		}
		
	}
	
	/**
	 * @method _runActions
	 * @protected
	 **/
	p._runActions = function(startPos, endPos, includeStart) {
		var sPos = startPos;
		var ePos = endPos;
		var i = -1;
		var j = this._actions.length;
		var k = 1;
		if (startPos > endPos) {
			// running backwards, flip everything:
			sPos = endPos;
			ePos = startPos;
			i = j;
			j = k = -1;
		}
		while ((i+=k) != j) {
			var action = this._actions[i];
			var pos = action.t;
			if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos) ) {
				action.f.apply(action.o, action.p);
			}
		}
	}

	/**
	 * @method _appendQueueProps
	 * @protected
	 **/
	p._appendQueueProps = function(o) {
		var arr,value,v2;
		for (var n in o) {
			if (this._initQueueProps[n] == null) {
				value = this._target[n];
				
				// init plugins:
				if (arr = Tween._plugins[n]) {
					for (var i=0,l=arr.length;i<l;i++) {
						v2 = arr[i].init(this, n, value);
						if (v2 != Tween.IGNORE) { value = v2; }
					}
				}
				this._initQueueProps[n] = value;
			}
			this._curQueueProps[n] = o[n];
		}
		return this._curQueueProps;
	}

	/**
	 * @method _cloneProps
	 * @protected
	 **/
	p._cloneProps = function(props) {
		var o = {};
		for (var n in props) {
			o[n] = props[n];
		}
		return o;
	}

	/**
	 * @method _addStep
	 * @protected
	 **/
	p._addStep = function(o) {
		if (o.d > 0) {
			this._steps.push(o);
			o.t = this.duration;
			this.duration += o.d;
		}
		return this;
	}
	
	/**
	 * @method _addAction
	 * @protected
	 **/
	p._addAction = function(o) {
		o.t = this.duration;
		this._actions.push(o);
		return this;
	}

	/**
	 * @method _set
	 * @protected
	 **/
	p._set = function(props,o) {
		for (var n in props) {
			o[n] = props[n];
		}
	}
	
createjs.Tween = Tween;
}());

/*
* Ease
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

// namespace:
this.createjs = this.createjs||{};

(function() {

// constructor:
/**
 * The Ease class provides a collection of easing functions for use with TweenJS.
 * It does not use the standard 4 param easing signature. Instead it uses a single param
 * which indicates the current linear ratio (0 to 1) of the tween.<br/>
 * <br/>
 * Most methods on Ease can be passed directly as easing functions:<br/>
 * Tween.get(target).to({x:100}, 500, Ease.linear);<br/>
 * <br/>
 * However, methods beginning with "get" will return an easing function based on parameter values:<br/>
 * Tween.get(target).to({y:200}, 500, Ease.getPowIn(2.2));<br/>
 * <br/>
 * Equations derived from work by Robert Penner.
 * @class Ease
 * @static
 **/
var Ease = function() {
	throw "Ease cannot be instantiated.";
}

// public static methods:
	/** 
	 * @method linear
	 * @static
	 **/
	Ease.linear = function(t) { return t; }
	
	/** 
	 * Identical to linear.
	 * @method none
	 * @static
	 **/
	Ease.none = Ease.linear;
	
	/** 
	 * Mimics the simple -100 to 100 easing in Flash Pro.
	 * @method get
	 * @param amount A value from -1 (ease in) to 1 (ease out) indicating the strength and direction of the ease.
	 * @static
	 **/
	Ease.get = function(amount) {
		if (amount < -1) { amount = -1; }
		if (amount > 1) { amount = 1; }
		return function(t) {
			if (amount==0) { return t; }
			if (amount<0) { return t*(t*-amount+1+amount); }
			return t*((2-t)*amount+(1-amount));
		}
	}
	
	/** 
	 * Configurable exponential ease.
	 * @method getPowIn
	 * @param pow The exponent to use (ex. 3 would return a cubic ease).
	 * @static
	 **/
	Ease.getPowIn = function(pow) {
		return function(t) {
			return Math.pow(t,pow);
		}
	}
	
	
	/** 
	 * Configurable exponential ease.
	 * @method getPowOut
	 * @param pow The exponent to use (ex. 3 would return a cubic ease).
	 * @static
	 **/
	Ease.getPowOut = function(pow) {
		return function(t) {
			return 1-Math.pow(1-t,pow);
		}
	}
	
	
	/** 
	 * Configurable exponential ease.
	 * @method getPowInOut
	 * @param pow The exponent to use (ex. 3 would return a cubic ease).
	 * @static
	 **/
	Ease.getPowInOut = function(pow) {
		return function(t) {
			if ((t*=2)<1) return 0.5*Math.pow(t,pow);
			return 1-0.5*Math.abs(Math.pow(2-t,pow));
		}
	}
	
	
	/** 
	 * @method quadIn
	 * @static
	 **/
	Ease.quadIn = Ease.getPowIn(2);
	/** 
	 * @method quadOut
	 * @static
	 **/
	Ease.quadOut = Ease.getPowOut(2);
	/** 
	 * @method quadInOut
	 * @static
	 **/
	Ease.quadInOut = Ease.getPowInOut(2);
	
	
	/** 
	 * @method cubicIn
	 * @static
	 **/
	Ease.cubicIn = Ease.getPowIn(3);
	/** 
	 * @method cubicOut
	 * @static
	 **/
	Ease.cubicOut = Ease.getPowOut(3);
	/** 
	 * @method cubicInOut
	 * @static
	 **/
	Ease.cubicInOut = Ease.getPowInOut(3);
	
	
	/** 
	 * @method quartIn
	 * @static
	 **/
	Ease.quartIn = Ease.getPowIn(4);
	/** 
	 * @method quartOut
	 * @static
	 **/
	Ease.quartOut = Ease.getPowOut(4);
	/** 
	 * @method quartInOut
	 * @static
	 **/
	Ease.quartInOut = Ease.getPowInOut(4);
	
	
	/** 
	 * @method quintIn
	 * @static
	 **/
	Ease.quintIn = Ease.getPowIn(5);
	/** 
	 * @method quintOut
	 * @static
	 **/
	Ease.quintOut = Ease.getPowOut(5);
	/** 
	 * @method quintInOut
	 * @static
	 **/
	Ease.quintInOut = Ease.getPowInOut(5);
	
	
	/** 
	 * @method sineIn
	 * @static
	 **/
	Ease.sineIn = function(t) {
		return 1-Math.cos(t*Math.PI/2);
	}
	
	/** 
	 * @method sineOut
	 * @static
	 **/
	Ease.sineOut = function(t) {
		return Math.sin(t*Math.PI/2);
	}
	
	/** 
	 * @method sineInOut
	 * @static
	 **/
	Ease.sineInOut = function(t) {
		return -0.5*(Math.cos(Math.PI*t) - 1)
	}
	
	
	/** 
	 * Configurable "back in" ease.
	 * @method getBackIn
	 * @param amount The strength of the ease.
	 * @static
	 **/
	Ease.getBackIn = function(amount) {
		return function(t) {
			return t*t*((amount+1)*t-amount);
		}
	}
	/** 
	 * @method backIn
	 * @static
	 **/
	Ease.backIn = Ease.getBackIn(1.7);
	
	/** 
	 * Configurable "back out" ease.
	 * @method getBackOut
	 * @param amount The strength of the ease.
	 * @static
	 **/
	Ease.getBackOut = function(amount) {
		return function(t) {
			return (--t*t*((amount+1)*t + amount) + 1);
		}
	}
	/** 
	 * @method backOut
	 * @static
	 **/
	Ease.backOut = Ease.getBackOut(1.7);
	
	/** 
	 * Configurable "back in out" ease.
	 * @method getBackInOut
	 * @param amount The strength of the ease.
	 * @static
	 **/
	Ease.getBackInOut = function(amount) {
		amount*=1.525;
		return function(t) {
			if ((t*=2)<1) return 0.5*(t*t*((amount+1)*t-amount));
			return 0.5*((t-=2)*t*((amount+1)*t+amount)+2);
		}
	}
	/** 
	 * @method backInOut
	 * @static
	 **/
	Ease.backInOut = Ease.getBackInOut(1.7);
	
	
	/** 
	 * @method circIn
	 * @static
	 **/
	Ease.circIn = function(t) {
		return -(Math.sqrt(1-t*t)- 1);
	}
	
	/** 
	 * @method circOut
	 * @static
	 **/
	Ease.circOut = function(t) {
		return Math.sqrt(1-(--t)*t);
	}
	
	/** 
	 * @method circInOut
	 * @static
	 **/
	Ease.circInOut = function(t) {
		if ((t*=2) < 1) return -0.5*(Math.sqrt(1-t*t)-1);
		return 0.5*(Math.sqrt(1-(t-=2)*t)+1);
	}
	
	/** 
	 * @method bounceIn
	 * @static
	 **/
	Ease.bounceIn = function(t) {
		return 1-Ease.bounceOut(1-t);
	}
	
	/** 
	 * @method bounceOut
	 * @static
	 **/
	Ease.bounceOut = function(t) {
		if (t < 1/2.75) {
			return (7.5625*t*t);
		} else if (t < 2/2.75) {
			return (7.5625*(t-=1.5/2.75)*t+0.75);
		} else if (t < 2.5/2.75) {
			return (7.5625*(t-=2.25/2.75)*t+0.9375);
		} else {
			return (7.5625*(t-=2.625/2.75)*t +0.984375);
		}
	}
	
	/** 
	 * @method bounceInOut
	 * @static
	 **/
	Ease.bounceInOut = function(t) {
		if (t<0.5) return Ease.bounceIn (t*2) * .5;
		return Ease.bounceOut(t*2-1)*0.5+0.5;
	}
	
	
	/** 
	 * Configurable elastic ease.
	 * @method getElasticIn
	 * @param amplitude
	 * @param period
	 * @static
	 **/
	Ease.getElasticIn = function(amplitude,period) {
		var pi2 = Math.PI*2;
		return function(t) {
			if (t==0 || t==1) return t;
			var s = period/pi2*Math.asin(1/amplitude);
			return -(amplitude*Math.pow(2,10*(t-=1))*Math.sin((t-s)*pi2/period));
		}
	}
	/** 
	 * @method elasticIn
	 * @static
	 **/
	Ease.elasticIn = Ease.getElasticIn(1,0.3);
	
	/** 
	 * Configurable elastic ease.
	 * @method getElasticOut
	 * @param amplitude
	 * @param period
	 * @static
	 **/
	Ease.getElasticOut = function(amplitude,period) {
		var pi2 = Math.PI*2;
		return function(t) {
			if (t==0 || t==1) return t;
			var s = period/pi2 * Math.asin(1/amplitude);
			return (amplitude*Math.pow(2,-10*t)*Math.sin((t-s)*pi2/period )+1);
		}
	}
	/** 
	 * @method elasticOut
	 * @static
	 **/
	Ease.elasticOut = Ease.getElasticOut(1,0.3);
	
	/** 
	 * Configurable elastic ease.
	 * @method getElasticInOut
	 * @param amplitude
	 * @param period
	 * @static
	 **/
	Ease.getElasticInOut = function(amplitude,period) {
		var pi2 = Math.PI*2;
		return function(t) {
			var s = period/pi2 * Math.asin(1/amplitude);
			if ((t*=2)<1) return -0.5*(amplitude*Math.pow(2,10*(t-=1))*Math.sin( (t-s)*pi2/period ));
			return amplitude*Math.pow(2,-10*(t-=1))*Math.sin((t-s)*pi2/period)*0.5+1;
		}
	}
	/** 
	 * @method elasticInOut
	 * @static
	 **/
	Ease.elasticInOut = Ease.getElasticInOut(1,0.3*1.5);
	
createjs.Ease = Ease;
}());

/*
* Timeline
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

// namespace:
this.createjs = this.createjs||{};

(function() {


/**
 * The Timeline class synchronizes multiple tweens and allows them to be controlled as a group.
 * @class Timeline
 * @param tweens An array of Tweens to add to this timeline. See addTween for more info.
 * @param labels An object defining labels for using gotoAndPlay/Stop. See setLabels for details.
 * @param props The configuration properties to apply to this tween instance (ex. {loop:true}). All properties default to false. Supported props are:<UL>
 *    <LI> loop: sets the loop property on this tween.</LI>
 *    <LI> useTicks: uses ticks for all durations instead of milliseconds.</LI>
 *    <LI> ignoreGlobalPause: sets the ignoreGlobalPause property on this tween.</LI>
 *    <LI> paused: indicates whether to start the tween paused.</LI>
 *    <LI> position: indicates the initial position for this timeline.</LI>
 *    <LI> onChanged: specifies an onChange handler for this timeline.</LI>
 * </UL>
 * @constructor
 **/
var Timeline = function(tweens, labels, props) {
  this.initialize(tweens, labels, props);
}
var p = Timeline.prototype;

// public properties:
	
	/**
	 * Causes this timeline to continue playing when a global pause is active.
	 * @property ignoreGlobalPause
	 * @type Boolean
	 **/
	p.ignoreGlobalPause = false;
	
	/**
	 * Read-only property specifying the total duration of this timeline in milliseconds (or ticks if useTicks is true).
	 * This value is usually automatically updated as you modify the timeline. See updateDuration for more information.
	 * @property duration
	 * @type Number
	 **/
	p.duration = 0;
	
	/**
	 * If true, the timeline will loop when it reaches the end. Can be set via the props param.
	 * @property loop
	 * @type Boolean
	 **/
	p.loop = false;
	
	/**
	 * Called, with a single parameter referencing this timeline instance, whenever the timeline's position changes.
	 * @property onChange
	 * @type Function
	 **/
	p.onChange = null;
	
	/**
	 * Read-only. The current normalized position of the timeline. This will always be a value between 0 and duration.
	 * Changing this property directly will have no effect.
	 * @property position
	 * @type Object
	 **/
	p.position = null;

// private properties:
	
	/**
	 * @property _paused
	 * @type Boolean
	 * @protected
	 **/
	p._paused = false;
	
	/**
	 * @property _tweens
	 * @type Array[Tween]
	 * @protected
	 **/
	p._tweens = null;
	
	/**
	 * @property _labels
	 * @type Array[String]
	 * @protected
	 **/
	p._labels = null;
	
	/**
	 * @property _prevPosition
	 * @type Number
	 * @protected
	 **/
	p._prevPosition = 0;
	
	/**
	 * @property _prevPos
	 * @type Number
	 * @protected
	 **/
	p._prevPos = -1;
	
	/**
	 * @property _useTicks
	 * @type Boolean
	 * @protected
	 **/
	p._useTicks = false;
	
// constructor:
	/** 
	* Initialization method.
	* @method initialize
	* @protected
	**/
	p.initialize = function(tweens, labels, props) {
		this._tweens = [];
		if (props) {
			this._useTicks = props.useTicks;
			this.loop = props.loop;
			this.ignoreGlobalPause = props.ignoreGlobalPause;
			this.onChange = props.onChange;
		}
		if (tweens) { this.addTween.apply(this, tweens); }
		this.setLabels(labels);
		if (props&&props.paused) { this._paused=true; }
		else { createjs.Tween._register(this,true); }
		if (props&&props.position!=null) { this.setPosition(props.position, createjs.Tween.NONE); }
	}
	
// public methods:
	/** 
	 * Adds one or more tweens (or timelines) to this timeline. The tweens will be paused (to remove them from the normal ticking system)
	 * and managed by this timeline. Adding a tween to multiple timelines will result in unexpected behaviour.
	 * @method addTween
	 * @param tween The tween(s) to add. Accepts multiple arguments.
	 * @return Tween The first tween that was passed in.
	 **/
	p.addTween = function(tween) {
		var l = arguments.length;
		if (l > 1) {
			for (var i=0; i<l; i++) { this.addTween(arguments[i]); }
			return arguments[0];
		} else if (l == 0) { return null; }
		this.removeTween(tween);
		this._tweens.push(tween);
		tween.setPaused(true);
		tween._paused = false;
		tween._useTicks = this._useTicks;
		if (tween.duration > this.duration) { this.duration = tween.duration; }
		if (this._prevPos >= 0) { tween.setPosition(this._prevPos, createjs.Tween.NONE); }
		return tween;
	}

	/** 
	 * Removes one or more tweens from this timeline.
	 * @method removeTween
	 * @param tween The tween(s) to remove. Accepts multiple arguments.
	 * @return Boolean Returns true if all of the tweens were successfully removed.
	 **/
	p.removeTween = function(tween) {
		var l = arguments.length;
		if (l > 1) {
			var good = true;
			for (var i=0; i<l; i++) { good = good && this.removeTween(arguments[i]); }
			return good;
		} else if (l == 0) { return false; }
		var index = this._tweens.indexOf(tween);
		if (index != -1) {
			this._tweens.splice(index,1);
			if (tween.duration >= this.duration) { this.updateDuration(); }
			return true;
		} else { return false; }
	}
	
	/** 
	 * Adds a label that can be used with gotoAndPlay/Stop.
	 * @method addLabel
	 * @param label The label name.
	 * @param position The position this label represents.
	 **/
	p.addLabel = function(label, position) {
		this._labels[label] = position;
	}

	/** 
	 * Defines labels for use with gotoAndPlay/Stop. Overwrites any previously set labels.
	 * @method addLabel
	 * @param o An object defining labels for using gotoAndPlay/Stop in the form {labelName:time} where time is in ms (or ticks if useTicks is true).
	 **/
	p.setLabels = function(o) {
		this._labels = o ?  o : {};
	}
	
	/** 
	 * Unpauses this timeline and jumps to the specified position or label.
	 * @method gotoAndPlay
	 * @param positionOrLabel The position in milliseconds (or ticks if useTicks is true) or label to jump to.
	 **/
	p.gotoAndPlay = function(positionOrLabel) {
		this.setPaused(false);
		this._goto(positionOrLabel);
	}
	
	/** 
	 * Pauses this timeline and jumps to the specified position or label.
	 * @method gotoAndStop
	 * @param positionOrLabel The position in milliseconds (or ticks if useTicks is true) or label to jump to.
	 **/
	p.gotoAndStop = function(positionOrLabel) {
		this.setPaused(true);
		this._goto(positionOrLabel);
	}
	
	/** 
	 * Advances the timeline to the specified position.
	 * @method setPosition
	 * @param value The position to seek to in milliseconds (or ticks if useTicks is true).
	 * @param actionsMode Optional parameter specifying how actions are handled. See Tween.setPosition for more details.
	 * @return Boolean Returns true if the timeline is complete (ie. the full timeline has run & loop is false).
	 **/
	p.setPosition = function(value, actionsMode) {
		if (value < 0) { value = 0; }
		var t = this.loop ? value%this.duration : value;
		var end = !this.loop && value >= this.duration;
		if (t == this._prevPos) { return end; }
		this._prevPosition = value;
		this.position = this._prevPos = t; // in case an action changes the current frame.
		for (var i=0, l=this._tweens.length; i<l; i++) {
			this._tweens[i].setPosition(t, actionsMode);
			if (t != this._prevPos) { return false; } // an action changed this timeline's position.
		}
		if (end) { this.setPaused(true); }
		this.onChange&&this.onChange(this);
		return end;
	}
	
	/** 
	 * Pauses or plays this timeline.
	 * @method setPaused
	 * @param value Indicates whether the tween should be paused (true) or played (false).
	 **/
	p.setPaused = function(value) {
		this._paused = !!value;
		createjs.Tween._register(this, !value);
	}
	
	/** 
	 * Recalculates the duration of the timeline.
	 * The duration is automatically updated when tweens are added or removed, but this method is useful 
	 * if you modify a tween after it was added to the timeline.
	 * @method updateDuration
	 **/
	p.updateDuration = function() {
		this.duration = 0;
		for (var i=0,l=this._tweens.length; i<l; i++) {
			tween = this._tweens[i];
			if (tween.duration > this.duration) { this.duration = tween.duration; }
		}
	}
	
	/** 
	 * Advances this timeline by the specified amount of time in milliseconds (or ticks if useTicks is true).
	 * This is normally called automatically by the Tween engine (via Tween.tick), but is exposed for advanced uses.
	 * @method tick
	 * @param delta The time to advance in milliseconds (or ticks if useTicks is true).
	 **/
	p.tick = function(delta) {
		this.setPosition(this._prevPosition+delta);
	}
	 
	/** 
	 * If a numeric position is passed, it is returned unchanged. If a string is passed, the position of the
	 * corresponding frame label will be returned, or null if a matching label is not defined.
	 * @method resolve
	 * @param positionOrLabel A numeric position value or label string.
	 **/
	p.resolve = function(positionOrLabel) {
		var pos = parseFloat(positionOrLabel);
		if (isNaN(pos)) { pos = this._labels[positionOrLabel]; }
		return pos;
	}

	/**
	* Returns a string representation of this object.
	* @method toString
	* @return {String} a string representation of the instance.
	**/
	p.toString = function() {
		return "[Timeline]";
	}
	
	/**
	 * @method clone
	 * @protected
	 **/
	p.clone = function() {
		throw("Timeline can not be cloned.")
	}
	
// private methods:
	/**
	 * @method _goto
	 * @protected
	 **/
	p._goto = function(positionOrLabel) {
		var pos = this.resolve(positionOrLabel);
		if (pos != null) { this.setPosition(pos); }
	}
	
createjs.Timeline = Timeline;
}());
