/**

 * timing.jquery.js
 * 
 * JavaScript functions for waiting / repeating / stopping jQuery actions.
 * 
 * This code is published under the MIT License (MIT).
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * For examples, reference, and other information see
 * http://creativecouple.github.com/jquery-timing/
 * 
 * @author CreativeCouple
 * @author Peter Liske
 * @copyright (c) 2011 by CreativeCouple
 * @see http://creativecouple.github.com/jquery-timing/
 */

(function(jQuery, window){
	/**
	 * object to store statically invoked threads
	 */
	var THREAD_GROUPS = {},
	
	/**
	 * unique timing identifier for different purposes
	 */
	tuid = 1,

	/**
	 * remember original core function $.each()
	 */
	originalEach = jQuery.fn.each,

	/**
	 * remember original core function $.on() (or $.bind())
	 */
	originalOn = jQuery.fn.on || jQuery.fn.bind,
	
	/**
	 * remember original core function $.off() (or $.unbind())
	 */
	originalOff = jQuery.fn.off || jQuery.fn.unbind,
	
	/**
	 * .until() and .all() have special meanings
	 */
	loopEndMethods = {};
	
	function sameOrNextJQuery(before, after) {
		after = jQuery(after);
		after.prevObject = before;
		var i = before.length;
		if (i !== after.length) {
			return after;
		}
		while (i--) {
			if (before[i] !== after[i]) {
				return after;
			}
		}
		return before;
	}
	
	function loopCounts(loops) {
		var ret = [], i = loops.length;
		while (i--) {
			ret[i] = loops[i]._count;
		}
		return ret;
	}
	
	/**
	 * Initialize a new timed invocation chain.
	 * 
	 * @author CreativeCouple
	 * @author Peter Liske
	 * 
	 * @param context initial context
	 * @param methodStack linked list of methods that has been or will be filled by someone else 
	 * @param ongoingLoops optional arguments for callback parameters
	 * @param onStepCallback function to call on each step
	 * @returns the timed invocation chain method
	 */
	function createTimedInvocationChain(context, methodStack, ongoingLoops, onStepCallback) {
		ongoingLoops = ongoingLoops || [];
		var executionState = {
				_context: context,
				_method: methodStack
		},
		preventRecursion = false,
		method, otherExecutionState, deferred;
		
		function hookupToProxy(state, mockup){
			state._canContinue = false;
			function fire(){
				state._next = sameOrNextJQuery(state._context, state._next);
				state._canContinue = true;
				timedInvocationChain();
			}
			return typeof mockup.promise == "function" ? mockup.promise().then(fire) : mockup.then(fire, true);
		}
		
		/**
		 * Invoke all the methods currently in the timed invocation chain.
		 * 
		 * @author CreativeCouple
		 * @author Peter Liske
		 */
		function timedInvocationChain(deferredReturnValue) {
			while (!preventRecursion) try {
				// keep recursive calls away
				preventRecursion = !preventRecursion;
				// save current context state
				if (typeof onStepCallback == "function") {
					onStepCallback(jQuery.makeArray(executionState._next || executionState._context));
				}
				// leave the chain when waiting for a trigger
				if (executionState._canContinue == false) {
					break;
				}
				// check end of chain
				if (!executionState._method._name) {
					if (deferred && (!ongoingLoops.length || ongoingLoops[0]._allowPromise)) {
						// resolve any waiting promise 
						if (executionState._context && typeof executionState._context.promise == "function") {
							executionState._context.promise().then(deferred.resolve);
						} else {
							deferred.resolveWith(executionState._context);
						}
						deferred = null;
					}
					if (!ongoingLoops.length) {
						/*
						 * We've reached the end of our TIC
						 * and there is nothing left to wait for.
						 * So we can safely return the original jQuery object
						 * hence enabling instant invocation.
						 */
						return executionState._context; 
					}
					/*
					 * Now we have ongoing loops but reached the chain's end.
					 */
					otherExecutionState = ongoingLoops[0]._openEndAction && ongoingLoops[0]._openEndAction(timedInvocationChain, executionState, ongoingLoops);
					if (!otherExecutionState) {
						// if innermost loop can't help us, just leave the chain
						break;
					}
					executionState = otherExecutionState;
					continue;
				}
				// check if user tries to use a non-existing function call
				method = executionState._context && executionState._context[executionState._method._name] || loopEndMethods[executionState._method._name];
				if (!method) {					
					throw 'no such method "'+executionState._method._name+'" on object ('+executionState._context+')';
				}
				// check whether we came here triggered or not
				if (method.timing && !executionState._canContinue) {
					// prevent automatic re-trigger in case of loops
					executionState._canContinue = false;
					// handle timing method
					executionState = method.timing(timedInvocationChain, executionState, ongoingLoops, onStepCallback) || executionState;
				} else {
					if (!method.timing && !executionState._canContinue) {
						// prevent automatic re-trigger in case of loops
						executionState._next = executionState._context[executionState._method._name].apply(executionState._context, executionState._method._arguments);
						if (ongoingLoops.length && executionState._next && executionState._next instanceof PredictingProxy) {
							hookupToProxy(executionState, executionState._next);
							continue;
						}
					}
					// go to next step
					otherExecutionState = {
							_context: executionState._next,
							_method: executionState._method._next
					};
					// prevent automatic re-trigger in case of loops
					executionState._canContinue = false;
					// invoke callback method with given arguments
					if (typeof executionState._callback == "function") {
						executionState._callback.apply(executionState._context, loopCounts(ongoingLoops));
					}
					executionState = otherExecutionState;
				}
			} catch(e) {
				/*
				 * We had a runtime exception.
				 * In plain JavaScript live the chain would break now.
				 * So we do, too.
				 */
				preventRecursion = !preventRecursion;
				throw e;
			} finally {
				preventRecursion = !preventRecursion;				
			}
			return deferredReturnValue;
		};
		if (jQuery.Deferred) {
			// add .promise() method to tic
			timedInvocationChain.promise = function(type, target){
				var ret = (deferred = deferred || jQuery.Deferred()).promise(target);
				timedInvocationChain();
				return ret;
			};
		}
		return timedInvocationChain;
	}
	
	/**
	 * Create a placeholder object to collect chained method calls.
	 * 
	 * @author CreativeCouple
	 * @author Peter Liske
	 *
	 * @param context initial context
	 * @param methodStack a linked list that this placeholder will fill with call parameters 
	 * @return the placeholder object
	 */
	function PredictingProxy(context, methodStack, onStepCallback) {
		this['.methods'] = methodStack;
		this['.callback'] = onStepCallback;
		this.length = 0;
		Array.prototype.push.apply(this, jQuery.makeArray(this._ = context._ = context));
		
		for (var key in context) {
			if (!(key in PredictingProxy.prototype) && typeof context[key] == "function") {
				this[key] = extendMockupPrototype(key);
			}
		}
	}
	
	// enabling jQuery.when(tic);
	if (jQuery.Deferred) {
		PredictingProxy.prototype.promise = function(type, target) {
			if (typeof type == "object") {
				target = type;
				type = null;
			}
			return (this['.callback'] && typeof this['.callback'].promise == "function") ? this['.callback'].promise(type, target) : jQuery.Deferred().resolveWith(this).promise(target);
		};
	}
	
	/**
	 * Create and return a new placeholder function on the prototype of PredictingProxy. 
	 */
	function extendMockupPrototype(name){
		return PredictingProxy.prototype[name] = function(){
			this['.methods']._name = name;
			this['.methods']._arguments = arguments;
			this['.methods'] = this['.methods']._next = {};
			return this['.callback'] ? this['.callback'](this, name, arguments) : this;
		};
	}
	
	
	/**
	 * Create replacement methods for .bind(), .on(), .one(), .live(), and .delegate()
	 * that support chaining instead of giving a callback function.
	 */
	jQuery.each(['bind','on','one','live','delegate'], function(index, name){
		if (jQuery.fn[name]) {
			var original = jQuery.fn[name];
			jQuery.fn[name] = function(){
				var i, methodStack, placeholder, timedInvocationChain, deferred, context = this;
				for(i=0; i<arguments.length; i++) {
					if (typeof arguments[i] == "function" || (arguments[i] && typeof arguments[i] == "object") || arguments[i] === false) {
						if (arguments[i] !== jQuery) {
							// fix for jQuery 1.6 .one() + .unbind()
							if (typeof arguments[i] == "function" && jQuery.guid) {
								arguments[i].guid = arguments[i].guid || jQuery.guid++;
							}
							return original.apply(context, arguments);
						}
						break;
					}
				}
				Array.prototype.splice.call(arguments, i, 1, function(){
					timedInvocationChain = createTimedInvocationChain(context.$(this), methodStack, [{
							_count: jQuery.extend(Array.prototype.shift.apply(arguments), arguments),
							_allowPromise: true
						}], function(elements){
						placeholder.length = 0;
						Array.prototype.push.apply(placeholder, elements);
					});
					if (deferred) {
						timedInvocationChain.promise().then(deferred.resolve);
						deferred = null;
					}
					return timedInvocationChain();
				});
				function fire(){
					return timedInvocationChain ? timedInvocationChain(placeholder) : placeholder;
				}
				if (jQuery.Deferred) {					
					fire.promise = function(type, target){
						if (typeof type == "object") {
							target = type;
							type = null;
						}
						return (timedInvocationChain && !type) ? timedInvocationChain.promise(type, target) : (deferred = deferred || jQuery.Deferred()).promise(target);
					};
				}
				return placeholder = new PredictingProxy(original.apply(context, arguments), methodStack = {}, fire);
			};
		}
	});
	
	/**
	 * Create replacement method for .animate() and .load()
	 * that support chaining if $ is given as callback function.
	 */
	jQuery.each(['animate','load'], function(index, name){
		if (jQuery.fn[name]) {
			var original = jQuery.fn[name];
			jQuery.fn[name] = function(){
				while (arguments.length && arguments[arguments.length-1] == null) {
					Array.prototype.pop.apply(arguments);
				}
				if (this.length && arguments.length > 1 && arguments[arguments.length-1] === jQuery) {
					var event = '_timing'+tuid++;
					arguments[arguments.length-1] = function(){
						jQuery(this).trigger(event);
					};
					return this.each().one(event).all(original.apply(this, arguments));
				}
				return original.apply(this, arguments);
			};
		}
	});
		
	/**
	 * Define new methods .wait(), .repeat(), .join(), .then()
	 * which will always start a new TIC if invoked outside of a TIC.  
	 */
	jQuery.each(['wait','repeat','join','then'], function(index, name){
		jQuery.fn[name] = function(){
			var methodStack = {},
			placeholder = new PredictingProxy(this, methodStack, createTimedInvocationChain(this, methodStack, [], function(elements){
					placeholder.length = 0;
					Array.prototype.push.apply(placeholder, elements);
				}));
			return placeholder[name].apply(placeholder, arguments);
		};
	});
	
	/**
	 * Define to wait for joining all animation queues.
	 * 
	 * @param timedInvocationChain
	 * @param executionState
	 */
	jQuery.fn.join.timing = function(timedInvocationChain, executionState) {
		var queueName,
		promising,
		waitingElements = executionState._context.length;
		
		if (typeof executionState._method._arguments[0] == "string") {
			queueName = executionState._method._arguments[0];
			if (typeof executionState._method._arguments[1] == "function") {
				executionState._callback = executionState._method._arguments[1];
			} else {
				promising = executionState._method._arguments[1];
				executionState._callback = executionState._method._arguments[2];
			}
		} else {
			if (typeof executionState._method._arguments[0] == "function") {
				executionState._callback = executionState._method._arguments[0];
			} else {
				promising = executionState._method._arguments[0];
				executionState._callback = executionState._method._arguments[1];
			}
		}
		
		executionState._next = executionState._context;
		executionState._canContinue = !waitingElements;

		// wait for each element to reach the current end of its queue
		if (promising) {
			executionState._context.promise(queueName == null ? 'fx' : queueName).then(function(){
				executionState._canContinue = true;
				timedInvocationChain();
			});
		} else {
			executionState._context.queue(queueName == null ? 'fx' : queueName, function(next){
				executionState._canContinue = !--waitingElements;
				timedInvocationChain();
				next();
			});
		}
	};

	/**
	 * Define to simply run callback method for .then()
	 * 
	 * @param timedInvocationChain
	 * @param executionState
	 */
	jQuery.fn.then.timing = function(timedInvocationChain, executionState){
		executionState._callback = executionState._method._arguments[0];
		executionState._next = executionState._context;
		executionState._canContinue = true;
		if (executionState._method._arguments[1]) {
			Array.prototype.shift.apply(executionState._method._arguments);
		}
	};
	
	/**
	 * Define timeout or binding to wait for.
	 * 
	 * @param timedInvocationChain
	 * @param executionState
	 */
	jQuery.fn.wait.timing = function(timedInvocationChain, executionState, ongoingLoops) {
		var trigger, event, timeout, context = executionState._context;
		
		trigger = executionState._method._arguments[0];
		executionState._callback = executionState._method._arguments[1];

		function triggerAction() {
			originalOff.call(event ? originalOff.call(context, event, triggerAction) : context, 'unwait', unwaitAction);
			executionState._canContinue = true;
			executionState._next = sameOrNextJQuery(executionState._context, executionState._next);
			timedInvocationChain();
		}
		
		function unwaitAction(evt, skipWait){
			originalOff.call(event ? originalOff.call(jQuery(this), event, triggerAction) : jQuery(this), 'unwait', unwaitAction);
			context = context.not(this);
			if (!skipWait) {
				executionState._next = executionState._next.not(this);
			}
			if (!context.length) {
				executionState._canContinue = executionState._next.length;
				executionState._next = sameOrNextJQuery(executionState._context, executionState._next);
				window.clearTimeout(timeout);
				executionState = { _context: context };
			}
			// just update the snapshot info
			timedInvocationChain();
		}

		originalOn.call(context, 'unwait', unwaitAction);
		executionState._next = context;

		if (trigger == null || trigger == jQuery) {
			trigger = context;
		}	
		if (typeof trigger == "function") {
			trigger = trigger.apply(context, loopCounts(ongoingLoops));
		}
		if (typeof trigger == "string") {

			originalOn.call(context, event = trigger, triggerAction);

		} else if (trigger && typeof trigger.promise == "function") {
			
			trigger.promise().then(triggerAction);
			
		} else if (trigger && typeof trigger.then == "function") {
			
			trigger.then(triggerAction, true);
			
		} else {

			timeout = window.setTimeout(triggerAction, Math.max(0,trigger));

		}
	};

	/**
	 * Define to simply run callback method for .then()
	 * 
	 * @param timedInvocationChain
	 * @param executionState
	 */
	jQuery.fn.each = function(callback){
		if (!callback || callback === jQuery) {
			var methodStack = {},
			placeholder = new PredictingProxy(this, methodStack, createTimedInvocationChain(this, methodStack, [], function(elements){
					placeholder.length = 0;
					Array.prototype.push.apply(placeholder, elements);
				}));
			return placeholder.each(callback);
		}
		return originalEach.apply(this, arguments);
	};
	
	/**
	 * Define interval or binding to repeat.
	 * 
	 * @param timedInvocationChain
	 * @param executionState
	 */
	jQuery.fn.each.timing = function(timedInvocationChain, executionState, ongoingLoops, onStepCallback) {
		if (executionState._method._arguments[0] && executionState._method._arguments[0] !== jQuery) {
			executionState._canContinue = true;
			executionState._next = originalEach.apply(executionState._context, executionState._method._arguments);
			return;
		}
		
		var size = Math.max(executionState._context.length, 1),
		finished = 0,
		key, methodToGoOn, openLoopTimeout,
		innerTICs = [],
		innerElements = [],
		proxyPlaceholder = jQuery.extend({}, executionState._context),
		stepByStep = executionState._method._arguments[0] === jQuery;

		if (stepByStep) {
			window.setTimeout(function(){
				openLoopTimeout = true;
				timedInvocationChain();
			},0);
		}
		
		function spreadAction(){
			if (stepByStep) {
				if (finished < size) {
					(innerTICs[finished])();
				}
			} else {
				for (var i=0; i<size; i++) {
					(innerTICs[i])();
				}
			}
			return proxyPlaceholder;
		}
		
		for (key in PredictingProxy.prototype) {
			proxyPlaceholder[key] = spreadAction;
		}
		proxyPlaceholder.length = size;
		for(key=0; key<size; key++) (function(index){
			var innerLoops = ongoingLoops.slice(),
			context = executionState._context.eq(index);
			innerElements[index] = context.get();
			innerLoops.unshift({
				_count: index,
				_allAction: function(state){
					finished++;
					if (finished == size) {
						methodToGoOn = state._method._next;
					}
					timedInvocationChain();
				},
				_fixOpenLoop: loopEndMethods.all,
				_openEndAction: function(tic, state){
					if (openLoopTimeout) {
						finished++;
						if (finished == size) {
							methodToGoOn = state._method;
						}
						timedInvocationChain();
					}
				}
			});
			innerTICs[index] = createTimedInvocationChain(context, executionState._method._next, innerLoops, function(elements){
				innerElements[index] = elements;
				proxyPlaceholder.length = 0;
				for (var i=0; i<size; i++) {
					Array.prototype.push.apply(proxyPlaceholder, innerElements[i]);
				}
				if (onStepCallback)
					onStepCallback(jQuery.makeArray(proxyPlaceholder));
			});
		})(key);

		executionState._next = proxyPlaceholder;
		executionState._canContinue = true;
		executionState._openEndAction = function(tic, state){			
			if (finished == size) {
				ongoingLoops.shift();
				return {
					_context: sameOrNextJQuery(executionState._context, proxyPlaceholder),
					_method: methodToGoOn
				};
			}
			var finishedBefore = finished;
			spreadAction();
			if (finished != finishedBefore) {
				return state;
			}
		};
		executionState._count = size;
		
		ongoingLoops.unshift(executionState);
	};

	loopEndMethods.all = function(executionState){
		jQuery.extend(executionState._method, {
			_next: jQuery.extend({}, executionState._method),
			_name: 'all',
			_arguments: []
		});
		executionState._canContinue = null;
	};
	loopEndMethods.all.timing = function(timedInvocationChain, executionState, ongoingLoops) {
		if (!ongoingLoops.length || !ongoingLoops[0]._fixOpenLoop) {
			throw '.all() method must be used after .each() only';
		}
		if (!ongoingLoops[0]._allAction) {
			ongoingLoops[0]._fixOpenLoop(executionState);
			return;
		}
		
		ongoingLoops[0]._allAction(executionState);
	};
	
	/**
	 * Define interval or binding to repeat.
	 * 
	 * @param timedInvocationChain
	 * @param executionState
	 */
	jQuery.fn.repeat.timing = function(timedInvocationChain, executionState, ongoingLoops) {
		var trigger,
		firstRunNow,
		openLoopTimeout,
		event,
		interval;

		if (typeof executionState._method._arguments[0] == "function") {
			executionState._callback = executionState._method._arguments[0];
		} else if (typeof executionState._method._arguments[1] == "function") {
			trigger = executionState._method._arguments[0];
			executionState._callback = executionState._method._arguments[1];
		} else {
			trigger = executionState._method._arguments[0];
			firstRunNow = executionState._method._arguments[1];
			executionState._callback = executionState._method._arguments[2];
		}
		
		function triggerAction() {
			executionState._next = executionState._next || executionState._context;
			executionState._canContinue = true;
			timedInvocationChain();
		}
		
		function unrepeatAction(){
			originalOff.call(event ? originalOff.call(jQuery(this), event, triggerAction) : jQuery(this), 'unrepeat', unrepeatAction);
			var context = executionState._context.not(this);
			executionState._next = (executionState._next == executionState._context) ? context : executionState._next;
			executionState._context = context;
			executionState._canContinue = executionState._context.length && executionState._canContinue;
			trigger = executionState._context.length && trigger;
			window.clearInterval(!executionState._context.length && interval);
			// just update the snapshot info
			timedInvocationChain();
		}
		
		executionState._openEndAction = function(tic, state){
			if (executionState._canContinue || openLoopTimeout) {
				executionState._count++;
				executionState._next = executionState._next || executionState._context;
				executionState._canContinue = executionState._canContinue || (trigger && state._context && state._context.length);
				return executionState;
			}
		};

		if (trigger == null) {
			
			firstRunNow = trigger = true;
			window.setTimeout(function(){
				openLoopTimeout = true;
				timedInvocationChain();
			},0);
			
		} else {
			if (typeof trigger == "string") {
				originalOn.call(executionState._context, event = trigger, triggerAction);
			} else {
				interval = window.setInterval(triggerAction, Math.max(0, trigger));				
			}
			trigger = false;
		}

		originalOn.call(executionState._context, 'unrepeat', unrepeatAction);
		
		executionState._next = executionState._context;
		executionState._count = 0;
		executionState._untilAction = function(end){
			if (end) {
				unrepeatAction.apply(executionState._context);
			}
			if (trigger) {
				triggerAction();
			}
		};
		executionState._fixOpenLoop = loopEndMethods.until;

		if (firstRunNow) {
			triggerAction();
		}
		
		ongoingLoops.unshift(executionState);
	};

	/**
	 * Defined to evaluate condition when calling .until()
	 */
	loopEndMethods.until = function(executionState){
		jQuery.extend(executionState._method, {
			_next: jQuery.extend({}, executionState._method),
			_name: 'until',
			_arguments: []
		});
		executionState._canContinue = null;
	};
	loopEndMethods.until.timing = function(timedInvocationChain, executionState, ongoingLoops) {
		if (!ongoingLoops.length || !ongoingLoops[0]._fixOpenLoop) {
			throw '.until() method must be used after .repeat() only';
		}
		if (!ongoingLoops[0]._untilAction) {
			ongoingLoops[0]._fixOpenLoop(executionState);
			return;
		}

		var condition = executionState._method._arguments[0],
		loopContext = executionState._method._arguments[1];
		if (condition === jQuery) {
			condition = null;
			loopContext = executionState._method._arguments.length <= 1 || loopContext;
		}
		if (typeof condition == "function") {
			condition = condition.apply(executionState._context, loopCounts(ongoingLoops));
		}
		if (condition == null) {
			condition = !executionState._context.size();
		}
		if (typeof condition == "object") {
			condition = condition.toString();
		}
		if (typeof condition == "number") {
			condition = ongoingLoops[0]._count >= condition-1;
		}
		if (condition) {
			executionState._canContinue = true;
			executionState._next = executionState._context;
			ongoingLoops.shift()._untilAction(condition);
		} else {
			if (loopContext) {
				ongoingLoops[0]._next = executionState._context;
			}
			executionState = ongoingLoops[0];
			executionState._count++;
			executionState._untilAction(condition);
			return executionState;
		}
	};
	
	// support .until() and .all()
	new PredictingProxy(loopEndMethods);
	
	/**
	 * Define unwait and unrepeat methods.
	 */
	jQuery.each(['unwait','unrepeat'], function(index, name){
		jQuery.fn[name] = function(){
			return this.trigger(name, arguments);
		};
	});
	
	/**
	 * define all static timing methods:
	 *  $.wait, $.repeat ,$.join, $.then, $.unwait, $.unrepeat
	 */
	jQuery.each(['wait','repeat','join','then','unwait','unrepeat'], function(index, name){
		jQuery[name] = function(){
			var group = typeof arguments[0] == "string" ? Array.prototype.shift.apply(arguments) : '';
			return jQuery.fn[name].apply(THREAD_GROUPS[group] = (THREAD_GROUPS[group] || jQuery('<div>').text(group)), arguments);
		};
	});

	/**
	 * X defines deferred variables that can be used in timed invocation chains 
	 * 
	 * @author CreativeCouple
	 * @author Peter Liske
	 */
	function X(compute, Var, calculation){
		if (typeof compute == "string") {
			calculation = new Function('x','return ['+compute+'\n,x]');
			compute = function(x, result){
				result = calculation(x);
				callbackVariable.x = result[1];
				return result[0];
			};
		}
		var hasRelatedVariable = typeof Var == "function",
		hasComputation = typeof compute == "function",
		
		callbackVariable = function(value) {
			if (arguments.length == 1) {
				callbackVariable.x = value;
				if (hasRelatedVariable) {
					Var(value);
				}
			} else {
				return evaluate();
			}
		};
		function evaluate(value){
			value = hasRelatedVariable ? Var() : callbackVariable.x;
			return hasComputation ? compute(value) : value;				
		}
		
		callbackVariable.x = 0;
		callbackVariable._ = { toString: callbackVariable.$ = callbackVariable.toString = evaluate.toString = evaluate };
		callbackVariable.mod = function(val){
			return X(function(x){
				return x % val;
			}, callbackVariable);
		};
		callbackVariable.add = function(val){
			return X(function(x){
				return x + val;
			}, callbackVariable);
		};
		callbackVariable.neg = function(){
			return X('-x', callbackVariable);
		};
		// $$ only for backward compatibility
		callbackVariable.$$ = callbackVariable.X = function(compute){
			return X(compute, callbackVariable);
		};
		jQuery.each('abcdefghij', function(index, character){
			callbackVariable[index] = callbackVariable[character] = function(){
				callbackVariable(arguments[index]);
			};
		});
		
		return callbackVariable;
	};
	
	// $$ only for backward compatibility
	window.$$ = jQuery.$$ = jQuery.X = X;
	
	/**
	 * Define chained version of $().
	 * This allows to use .end() to come back to previous jQuery selection.
	 */
	jQuery.fn.$ = function(){
		var ret = jQuery.apply(window, arguments);
		ret.prevObject = this;
		return ret;
	};
	
})(jQuery, window);
