YUI.add('gallery-effects', function(Y) {

	/**
	 * The Effects module provides an easy to use API to perform
	 * animations on DOM elements as well as an extensible way to create
	 * custom effects.  It is based on and closely follows the
	 * Scriptaculous Effects library (http://wiki.github.com/madrobby/scriptaculous/).
	 *
	 * @module gallery-effects
	 */

	var L = Y.Lang,
		DOM = Y.DOM,
		GLOBAL = "global",
	
	Effects = {};
	
	/***
	 * Mirroring the Sciprtaculous EffectQueues object, this object manages
	 * the AsyncQueue instances that will we use to queue and execute effects.
	 * 
	 * @property Y.Effects.EffectQueues
	 * @type {Object}
	 * @static
	 */
	Effects.EffectQueues = {
		
		/***
		 * This property is the hash that contains all of the queues.
		 * 
		 * @property instances
		 * @type {Object}
		 */
		instances: {},
		
		/***
		 * Retrieves a particular queue by key.  If it doesn't exist, a new one is created.
		 * 
		 * @method get
		 * @param key {String} look up
		 * @return {Y.AsyncQueue} queue instances
		 */
		get: function (key) {
			if (!L.isString(key)) {
				return key;
			}
			
			if (!this.instances[key]) {
				this.instances[key] = new Y.AsyncQueue();
			}
			
			return this.instances[key];
		}
	};
	
	/***
	 * The primary, global event queue.
	 *  
	 * @property Y.Effects.GlobalQueue
	 * @type {Y.AsyncQueue}
	 * @static
	 */
	Effects.GlobalQueue = Effects.EffectQueues.get(GLOBAL);



	/*************************************************************
	 * 
	 * 			B A S I C   N O D E   E X T E N S I O N S
	 * 
	 *************************************************************/
	
	
	
	Y.mix(Y.DOM, {
		
		/***
		 * Display a node.
		 * 
		 * @method show
		 */
		show: function (node) {
			Y.DOM.setStyle(node, "display", "");
		},
		
		/***
		 * Hide a node.
		 * 
		 * @method show
		 */
		hide: function (node) {
			Y.DOM.setStyle(node, "display", "none");
		},
		
		/**
	     * Check is a node is being shown. Intentionally not called "visible"
	     * so as not to confuse it with the visibility property.
	     *
	     * @method displayed
	     * @return boolean
	     */
		displayed: function (node) {
			return Y.DOM.getStyle(node, "display") !== "none";
		},
		
		/**
	     * Toggle the display of an element.
	     *
	     * @method toggle
	     */
		toggle: function (node) {
			Y.DOM[Y.DOM.displayed(node) ? "hide" : "show"](node);
		},
		
		/**
	     * Get positioned offset.  This is useful for taking into account
	     * offset relative ancestor, relative positioned nodes.
	     *
	     * @method getPositionedOffset
	     * @return Array
	     */
		getPositionedOffset: function(node) {
			var valueT = 0, valueL = 0;
			
			do {
				valueT += node.offsetTop  || 0;
				valueL += node.offsetLeft || 0;
				node = node.offsetParent;

				if (node) {
					if (node.tagName === "BODY") {
						break;
					}
					var p = DOM.getStyle(node, "position");
					if (p !== "static") {
						break;
					}
				}
			} while (node);
			
			return [valueL, valueT];
		},
		
		/**
	     * Position an element absolutely, but maintain its current position with
	     * respect to the entire page.
	     *
	     * @method positionAbsolutely
	     */
		positionAbsolutely: function (node) {

		    if (DOM.getStyle(node, "position") === "absolute") {
				return;
			}
			
		    var offsets = DOM.getPositionedOffset(node);

		    DOM.setStyles(node, {
				position: "absolute",
				top: offsets[1] + "px",
				left: offsets[0] + "px",
				width: node.clientWidth + "px",
				height: node.clientHeight + "px"
			});
		},
		
		/**
	     * Returns an array of the dimensions of a particular element.  If the element
	     * is not currently in the DOM tree (because "display" is "none"), then
	     * it adjusts its styles to get the dimensions and then resets the element.
	     *
	     * @method toggle
	     * @return Array
	     */
		getDimensions: function (node) {
			var region;
			
			if (DOM.displayed(node)) {
				region = DOM.region(node);
				return [region.width, region.height];
			}
			
			var vis = DOM.getStyle(node, "visibility"),
				pos = DOM.getStyle(node, "position"),
				dis = DOM.getStyle(node, "display"),
				dim;
			
			DOM.setStyles(node, {
				visibility: "hidden",
				position: "absolute",
				display: "block"
			});
	
			region = DOM.region(node);
			dim = [region.width, region.height];
			
			DOM.setStyles(node, {
				visibility: vis,
				position: pos,
				display: dis
			});
			
			return dim;
		},
		
		/**
	     * Force a node to be positioned, which essentially means setting the position to
	     * be non-static.
		 *
	     * @method makePositioned
	     */
		makePositioned: function (node) {
			var pos = DOM.getStyle(node, "position");
			
			if (pos === "static" || !pos) {
				DOM.setStyle(node, "position", "relative");
			}
		},
		
		/**
	     * If a node has been previously forced to be positioned, this method will undo that.
		 *
	     * @method undoPositioned
	     */
		undoPositioned: function (node) {
			DOM.setStyles(node, {
				position: "",
				top: "",
				left: "",
				bottom: "",
				right: ""
			});
		},
		
		/**
	     * Make a node clippable by settings its overflow style to hidden and storing
	     * it's previous style on the element itself.
		 *
	     * @method _makeClipping
	     * @protected
	     */
		_makeClipping: function (node) {
			if (node._overflow) {
				return node;
			}
			
			node._overflow = DOM.getStyle(node, "overflow") || "auto";
			
			if (node._overflow !== "hidden") {
				DOM.setStyle(node, "overflow", "hidden");
			}
		},
	
		/**
	     * Undo the clipping of a node by resetting its overflow style which is expected
	     * to be stored on the element.
		 *
	     * @method _undoClipping
	     * @protected
	     */
		_undoClipping: function (node) {
			if (!node._overflow) {
				return;
			}
			
			DOM.setStyle(node, "overflow", node._overflow === "auto" ? "" : node._overflow);
			node._overflow = undefined;
		}
	});
	
	Y.Node.importMethod(Y.DOM, [
		/**
	     * Display a node.
	     *
	     * @method show
	     * @chainable
	     */
		"show",
		
		/**
	     * Hide a node.
	     *
	     * @method hide
	     * @chainable
	     */
		"hide",
		
		/**
	     * Check is a node is being shown. Intentionally not called "visible"
	     * so as not to confuse it with the visibility property.
	     *
	     * @method displayed
	     * @return boolean
	     */
		"displayed",
		
		/**
	     * Toggle the display of an element.
	     *
	     * @method toggle
	     * @chainable
	     */
		"toggle",
		
		/**
	     * Get positioned offset.  This is useful for taking into account
	     * offset relative ancestor, relative positioned nodes.
	     *
	     * @method getPositionedOffset
	     * @return Array
	     */
		"getPositionedOffset",
		
		/**
	     * Position an element absolutely, but maintain its current position with
	     * respect to the entire page.
	     *
	     * @method positionAbsolutely
	     * @chainable
	     */
		"positionAbsolutely",
		
		/**
	     * Returns an array of the dimensions of a particular element.  If the element
	     * is not currently in the DOM tree (because "display" is "none"), then
	     * it adjusts its styles to get the dimensions and then resets the element.
	     *
	     * @method toggle
	     * @return Array
	     */
		"getDimensions",
		
		/**
	     * Force a node to be positioned, which essentially means setting the position to
	     * be non-static.
		 *
	     * @method makePositioned
	     * @chainable
	     */
		"makePositioned",
		
		/**
	     * If a node has been previously forced to be positioned, then this method will undo that.
		 *
	     * @method undoPositioned
	     * @chainable
	     */
		"undoPositioned",
		
		/**
	     * Make a node clippable by settings its overflow style to hidden and storing
	     * it's previous style on the element itself.
		 *
	     * @method _makeClipping
	     * @protected
	     * @chainnable
	     */
		"_makeClipping",
		
		/**
	     * Undo the clipping of a node by resetting its overflow style which is expected
	     * to be stored on the element.
		 *
	     * @method _undoClipping
	     * @protected
	     * @chainable
	     */
		"_undoClipping"
	]);
	
	
	
	/*************************************************************
	 * 
	 * 					C O R E   E F F E C T S
	 * 
	 *************************************************************/
	
	
	
	/**
    * @for Effects.BaseEffect
    * @event queue
    * @description fires before an effect is added to the queue to be processed.
    * @param {Event} ev The queue event.
    * @type Event.Custom
    */
	var QUEUE = "queue",
	
	/**
    * @for Effects.BaseEffect
    * @event setup
    * @description fires when the effect is to be setup.
    * @param {Event} ev The setup event.
    * @type Event.Custom
    */
	SETUP = "setup",
	
	/**
    * @for Effects.BaseEffect
    * @event finish
    * @description fires once the effect is complete.
    * @param {Event} ev The finish event.
    * @type Event.Custom
    */
	FINISH = "finish";	
	
	/***
	 * The base class for the core effects.  The core effects define a single animation
	 * to be done, which is, by default, executed via one of the AsyncQueue instances
	 * in Y.Effects.EffectQueues.  This wrapper class also exposes methods to modify the
	 * node before and after the animation.
	 * 
	 * @class Y.Effects.BaseEffect
	 * @extends Y.Base
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.BaseEffect = function (config) {
		Effects.BaseEffect.superclass.constructor.apply(this, arguments);
	};
	
	Effects.BaseEffect.NAME = "baseEffect";
	
	Effects.BaseEffect.ATTRS = {
		
		/**
         * The scope of the effect.  This can be used to queue effects in different lists.
         * @attribute scope
         * @value "global"
         * @type String
         */
		scope: {
			value: GLOBAL,
			validator: L.isString
		},
		
		/**
         * Whether or not effects behind this effect should wait for it to complete.
         * If set to true, when this effect is started, the next effect will not automatically,
         * be processed.
         * 
         * @attribute wait
         * @value true
         * @type boolean
         */
		wait: {
			value: true,
			validator: L.isBoolean
		},
		
		/**
         * Whether or not this effect is being managed externally.  If so, we won't add it to a
         * queue to be processed and it's the responsibility of the creator to make sure the run
         * and finish method are called.
         * 
         * @attribute managed
         * @value false
         * @type boolean
         */
		managed: {
			value: false,
			validator: L.isBoolean
		},
		
		/**
         * The animation this effect will execute.
         * 
         * @attribute anim
         * @type {Y.Anim}
         */
		anim: {
			validator: function (v) {
				return v instanceof Y.Anim;
			}
		},
		
		/**
         * The node this effect will execute on.
         * 
         * @attribute node
         * @writeOnce
         * @type {Y.Node}
         */
		node: {
			writeOnce: true,
			validator: function (v) {
				return v instanceof Y.Node;
			}
		},
		
		/**
         * The original configuration passed in.  This is parsed and normalized
         * by core effects to create a configuration for the Y.Anim instance.
         * 
         * @attribute config
         * @type {Object}
         */
		config: {
			validator: L.isObject
		}
	};
	
	Y.extend(Effects.BaseEffect, Y.Base, {
		
		/**
         * Set the configuration and node properties appropriately.  Then publish
         * all events and subscribe any functions that were passed in as part of the
         * initial configuration.
         * 
         * Subclasses should also take care to add themselves to the queue when they're
         * done initializing themselves.
         * 
         * @method initializer
         * @param config {Object} has of configuration name/value pairs
         */
		initializer: function (config) {

			this.set("config", config);
			this.set("node", Y.one(config.node));
			
			this.publish(QUEUE, { defaultFn: this._queue });
			this.publish(SETUP, { defaultFn: this.setup });
			this.publish(FINISH, { defaultFn: this.finish });

			// Subscribe to any events that we know we should subscribe to.
			if (config.beforeStart) {
				this.on(QUEUE, config.beforeStart);
			}
			
			if (config.beforeSetup) {
				this.on(SETUP, config.beforeSetup);
			}
			
			if (config.afterSetup) {
				this.after(SETUP, config.afterSetup);
			}
			
			if (config.beforeFinish) {
				this.on(FINISH, config.beforeFinish);
			}
			
			if (config.afterFinish) {
				this.after(FINISH, config.afterFinish);
			}
		},
		
		/**
         * All work that is necessary to setup the Y.Anim instance should be done here and well
         * as any modifications of the element we're going to animate.
         *
         * 
         * @method setup
         */
		setup: function () {},
		
		/**
         * Add an effect to one of the effect queues by firing the queue event.
         * 
         * @method addToQueue
         */
		addToQueue: function () {
			if (!this.get("managed")) {
				this.fire(QUEUE);
			}
		},
		
		/**
         * Run the effect.
         * 
         * @method run
         */
		run: function () {

			this.fire(SETUP);
			
			var anim = this.get("anim");
			
			anim.on("end", function (e) { this.fire(FINISH, { animEnd: e }); }, this);
			anim.run();
		},
		
		/**
         * Executed once the animation is complete.  If this is a managed effect,
         * this will start the next effect.
         * 
         * @method finish
         * @final
         */
		finish: function () {
			
			this._finish();
			
			// If it's not a managed effect and the queue we were in isn't currently running,
			// then execute the next effect.
			if (!this.get("managed") && !this._getQueue().isRunning()) {
				this._getQueue().run();
			}
		},
		
		/***
		 * Queue the animation to be executed.
		 * 
		 * @method _queue
		 * @protected
		 */
		_queue: function () {
			var queue = this._getQueue();
				
			queue.add({
				fn: this.run,
				context: this,
				autoContinue: !this.get("wait")
			});
			
			if (!queue.isRunning()) {
				queue.run();
			}
		},
		
		/**
         * Get the queue associated with this effect.
         * 
         * @method _getQueue
         * @protected
         */
		_getQueue: function () {
			return Effects.EffectQueues.get(this.get("scope"));
		},
		
		/**
         * If there are any node modifications that need to happen after the animation,
         * they should take place here.
         * 
         * @method _finish
         * @protected
         */
		_finish: function () {}
	});
	
	/***
	 * This is a special subclass of Effects.BaseEffect because it executes other Effects.BaseEffect
	 * instances rather than an Anim instance.  This is nice because it allows you to queue
	 * multiple effects to be executed at the same time.
	 * 
	 * @class Y.Effects.Parallel
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.Parallel = function (config) {
		Effects.Parallel.superclass.constructor.apply(this, arguments);
	};
	
	Effects.Parallel.NAME = "parallel";
	
	Effects.Parallel.ATTRS = {
		
		/**
         * Effects to be executed.
         * 
         * @attribute effects
         * @value []
         * @type Array
         */
		effects: {
			value: [],
			validator: L.isArray
		}
	};
	
	Y.extend(Effects.Parallel, Effects.BaseEffect, {
		
		/**
         * Add this effect to the queue.
         * 
         * @method initializer
         * @param config {Object} has of configuration name/value pairs
         */
		initializer: function (config) {
			this.addToQueue();
		},
		
		/**
         * Execute all of the effects this Parallel instance knows about.
         * 
         * @method run
         */
		run: function () {

			var effects = this.get("effects"),
				config = this.get("config");

			// Do the setup stuff first.
			this.fire(SETUP);
			
			if (effects.length) {
				// For the last effect, when we setup the animation for the last effect,
				// we want to bind to the end event of that effect's animation to execute
				// the finish method.
				effects[effects.length - 1].after("animChange", function (event) {
					event.newVal.on("end", function () { this.fire(FINISH, { animEnd : null }); } , this);
				}, this);
				
				// For each animation, set the node it will run on and merge the configuration
				// object for that effect with the one we received for this effect and then
				// run that effect.
				Y.Array.each(effects, function (effect) {
					effect.set("config", Y.merge(effect.get("config"), config));
					
					effect.run();
				});
			} else {
				// If there are no effects, then we're done.
				this.fire(FINISH, { animEnd : null });
			}
		}
	});
	
	/***
	 * Effect to animate the opacity of a node.
	 * 
	 * @class Y.Effects.Opacity
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.Opacity = function (config) {
		Effects.Opacity.superclass.constructor.apply(this, arguments);
	};
	
	Effects.Opacity.NAME = "opacity";
	
	Y.extend(Effects.Opacity, Effects.BaseEffect, {
		
		/**
         * The starting opacity for this effect.
         * 
         * @property effects
         * @value 0.0
         * @type _startOpacity
         * @protected
         */
		_startOpacity: 0.0,
		
		/**
		 * 
         * @method initializer
         * @param config {Object} has of configuration name/value pairs
         */
		initializer: function (config) {
			// store the initial opacity of the node we are animating so we can reset it later.
			this._startOpacity = this.get("node").getStyle("opacity") || 0.0;
			
			this.addToQueue();
		},
		
		/**
		 * Parse and normalize configuration into the animation we want to perform.
		 * Also manipulate the node we are about to animate if necessary.
		 * 
         * @method setup
         */
		setup: function() {
			var config = this.get("config");
				
			config.from = {
				opacity: config.from !== undefined ? config.from : this._startOpacity
			};

			config.to = {
				opacity: config.to !== undefined ? config.to : 1.0
			};

			this.set("anim", new Y.Anim(config));
		}
	});
	
	/***
	 * This effect moves a node to a specific position on the page.
	 * 
	 * @class Y.Effects.Move
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.Move = function (config) {
		Effects.Move.superclass.constructor.apply(this, arguments);
	};
	
	Effects.Move.NAME = "move";
	
	Y.extend(Effects.Move, Effects.BaseEffect, {
		
		/**
		 * 
         * @method initializer
         * @param config {Object} has of configuration name/value pairs
         */
		initializer: function (config) {
			this.addToQueue();
		},
		
		/**
		 * Parse and normalize configuration into the animation we want to perform.
		 * Also manipulate the node we are about to animate if necessary.
		 * 
         * @method setup
         */
		setup: function () {
			var config = this.get("config"),
				node = this.get("node"),
				// Don't like this, but node.getStyle("top") will return "auto" which is annoying.
				domNode = Y.Node.getDOMNode(node);
				
			node.makePositioned();
			
			if (config.mode === "absolute") {
				config.to = { xy: [config.x, config.y] };
			} else {
				config.to = {
					left: ((config.x || 0) + parseFloat(domNode.style.left || "0")) + "px",
					top: ((config.y || 0) + parseFloat(domNode.style.top || "0")) + "px"
				};
			}

			this.set("anim", new Y.Anim(config));
		}
	});
	
	/***
	 * This effect scrolls a node to a specific position.
	 * 
	 * @class Y.Effects.Scroll
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.Scroll = function (config) {
		Effects.Scroll.superclass.constructor.apply(this, arguments);
	};
	
	Effects.Scroll.NAME = "scroll";
	
	Y.extend(Effects.Scroll, Effects.BaseEffect, {
		
		/**
		 * 
         * @method initializer
         * @param config {Object} has of configuration name/value pairs
         */
		initializer: function (config) {
			this.addToQueue();
		},
		
		/**
		 * Normalize the "to" and "from" properties for scrolling.
		 * 
         * @method setup
         */
		setup: function () {
			var config = this.get("config");
			
			config.to = { scroll: config.to };
			config.from = { scroll: config.from };

			this.set("anim", new Y.Anim(config));
		}
	});
	
	/***
	 * Effect for generic mutations. This is the closest to a wrapper for the Y.Anim object
	 * itself.
	 * 
	 * @class Y.Effects.Morph
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.Morph = function (config) {
		Effects.Morph.superclass.constructor.apply(this, arguments);
	};
	
	Effects.Morph.NAME = "morph";
	
	Y.extend(Effects.Morph, Effects.BaseEffect, {

		/**
		 * 
         * @method initializer
         * @param config {Object} has of configuration name/value pairs
         */
		initializer: function (config) {
			this.addToQueue();
		},
		
		/**
		 * Parse and normalize configuration into the animation we want to perform.
		 * Also manipulate the node we are about to animate if necessary.
		 * 
         * @method setup
         */
		setup: function () {
			this.set("anim", new Y.Anim(this.get("config")));
		}
	});
	
	/***
	 * Scale an object to a certain size with a number of configuration properties that
	 * change the way the scaling takes place.
	 * 
	 * @class Y.Effects.Scale
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.Scale = function (config) {
		Effects.Scale.superclass.constructor.apply(this, arguments);
	};
	
	Effects.Scale.NAME = "scale";
	
	Effects.Scale.ATTRS = {
		
		/**
         * Whether or not to scale along the x-axis.
         * 
         * @attribute scaleX
         * @value true
         * @type boolean
         */
		scaleX: {
			value: true,
			validator: L.isBoolean
		},
		
		/**
         * Whether or not to scale along the y-axis.
         * 
         * @attribute scaleY
         * @value true
         * @type boolean
         */
		scaleY: {
			value: true,
			validator: L.isBoolean
		},
		
		/**
         * Whether or not to scale the content of the node.
         * 
         * @attribute scaleContent
         * @value true
         * @type boolean
         */
		scaleContent: {
			value: true,
			validator: L.isBoolean
		},
		
		/**
         * Whether or not to scale the node from the center.  Otherwise
         * scaling takes place from the top left corner.
         * 
         * @attribute scaleFromCenter
         * @value false
         * @type boolean
         */
		scaleFromCenter: {
			value: false,
			validator: L.isBoolean
		},
		
		/**
         * How the scaling should take place. "box" will scale the visible area
         * of the node, "contents" will scale the entire node.  Finally, you
         * can control the height and width of scaling more precisely by passing an
         * object with "originalHeight" and "originalWidth."
         * 
         * @attribute scaleMode
         * @value "box"
         * @type boolean
         */
		scaleMode: {
			value: "box", // 'box' or 'contents' or { } with provided values
			validator: function (v) {
				return v === "box" || v === "contents" || L.isObject(v);
			}
		},
		
		/**
         * The percentage of the full size to scale from.
         * 
         * @attribute scaleFrom
         * @value 100.0
         * @type Number
         */
		scaleFrom: {
			value: 100.0,
			validator: L.isNumber
		},
		
		/**
         * The percentage of the full size to scale to.
         * 
         * @attribute scaleTo
         * @value 200.0
         * @type Number
         */
		scaleTo: {
			value: 200.0,
			validator: L.isNumber,
			setter: function (v) {
				return v;
			}
		},
		
		/**
         * Whether to restore the node once the scaling is complete.
         * This will reset the position, size and content.
         * 
         * @attribute restoreAfterFinish
         * @value false
         * @type Number
         */
		restoreAfterFinish: {
			value: false,
			validator: L.isBoolean
		}
	};
	
	Y.extend(Effects.Scale, Effects.BaseEffect, {

		/**
         * Style we will revert to if we are restoring.
         * 
         * @property _originalStyle
         * @type Object
         * @protected
         */
		_originalStyle: {},
		
		/**
		 * 
         * @method initializer
         * @param config {Object} has of configuration name/value pairs
         */
		initializer: function (config) {
			this.addToQueue();
		},

		/**
		 * Parse and normalize configuration into the animation we want to perform.
		 * Also manipulate the node we are about to animate if necessary.
		 * 
         * @method setup
         */
		setup: function () {
			var config = this.get("config"),
		    	node = this.get("node"),
				
				scaleX = this.get("scaleX"),
				scaleY = this.get("scaleY"),
				scaleContent = this.get("scaleContent"),
				scaleFromCenter = this.get("scaleFromCenter"),
				scaleMode = this.get("scaleMode"),
				scaleFrom = this.get("scaleFrom"),
				scaleTo = this.get("scaleTo"),
				
				elementPositioning = node.getStyle("position"),
				originalXY = node.getPositionedOffset(),
				fontSize = node.getStyle("fontSize") || "100%",
				fontSizeType,
				dims;
			
			// Save styles for later.
		    Y.Array.each(["top", "left", "width", "height", "fontSize"], Y.bind(function(k) {
				this._originalStyle[k] = node.getStyle(k);
		    }, this));
			
			// Determine the current font size and units.
			Y.Array.each(["em", "px", "%", "pt"], function(type) {
				if (fontSize.toString().indexOf(type) > 0) {
					fontSize = parseFloat(fontSize);
					fontSizeType = type;
				}
			});
			
			// Figure out which dimensions we're using.
			if (scaleMode === "box") {
				dims = [node.get("offsetHeight"), node.get("offsetWidth")];
			
			} else if (/^content/.test(scaleMode)) {
				dims = [node.get("scrollHeight"), node.get("scrollWidth")];
			
			} else {
				dims = [scaleMode.originalHeight, scaleMode.originalWidth];
			}
	
			// Build out the to and from objects that we're going to pass to the Y.Anim instance.
			var to = {}, from = {},
				toScaleFraction = scaleTo/100.0,
				fromScaleFraction = scaleFrom/100.0,
				fromWidth = dims[1] * fromScaleFraction,
				fromHeight = dims[0] * fromScaleFraction,
				toWidth = dims[1] * toScaleFraction,
				toHeight = dims[0] * toScaleFraction;
			
			if (scaleContent && fontSize) {
				from.fontSize = fontSize * fromScaleFraction + fontSizeType;
				to.fontSize = fontSize * toScaleFraction + fontSizeType;
			}
			
			if (scaleX) {
				from.width = fromWidth + "px";
				to.width = toWidth + "px";
			}
			
			if (scaleY) {
				from.height = fromHeight + "px";
				to.height = toHeight + "px";
			}
			
			if (scaleFromCenter) {
				var fromTop = (fromHeight - dims[0]) / 2,
					fromLeft = (fromWidth - dims[1]) / 2,
					toTop = (toHeight - dims[0]) / 2,
					toLeft = (toWidth - dims[1]) / 2;
			    
				if (elementPositioning === "absolute") {
					if (scaleY) {
						from.top = (originalXY[1] - fromTop) + "px";
						to.top = (originalXY[1] - toTop) + "px";
					}
					
					if (scaleX) {
						from.left = (originalXY[0] - fromLeft) + "px";
						to.left = (originalXY[0] - toLeft) + "px";
			    	}
				} else {
					if (scaleY) {
						from.top = -fromTop + "px";
						to.top = -toTop + "px";
					}
					
					if (scaleX) {
						from.left = -fromLeft + "px";
						to.left = -toLeft + "px";
					}
				}
			}
			
			config.to = to;
			config.from = from;
			
			this.set("anim", new Y.Anim(config));
		},
	
		/**
		 * Any work that needs to be done once the animation is complete, typically to
		 * reset or manipulate node properties.
		 * 
         * @method _finish
         * @protected
         */
		_finish: function () {
			if (this.get("restoreAfterFinish")) {
				this.get("node").setStyles(this._originalStyle);
			}
		}
	});
	
	/***
	 * Effect to highlight a node and then have the highlighting dissipate.
	 * 
	 * @class Y.Effects.Highlight
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.Highlight = function (config) {

		// If the node isn't being displayed, then don't bother.
		if (!Y.one(config.node).displayed()) {
			return;
		}
		
		Effects.Highlight.superclass.constructor.apply(this, arguments);
	};
	
	Effects.Highlight.NAME = "highlight";
	
	Effects.Highlight.ATTRS = {
		
		/**
         * The starting color.
         * 
         * @attribute startColor
         * @value "#ff9" (light yellow)
         * @type String
         */
		startColor: {
			value: "#ff9",
			validator: L.isString
		},
		
		/**
         * The ending color.
         * 
         * @attribute endColor
         * @value "#fff" (lwhite)
         * @type String
         */
		endColor: {
			value: "#fff",
			validator: L.isString
		},
		
		/**
         * The color to restore the element to after it's been animated.
         * By default, we try to get the current background color and set
         * it back to that.
         * 
         * @attribute restoreColor
         * @type String
         */
		restoreColor: {
			value: "",
			validator: L.isString
		}
	};
	
	Y.extend(Effects.Highlight, Effects.BaseEffect, {

		/**
         * Background image of the node on start.  This is reset after the animation
         * finishes.
         * 
         * @property _previousBackgroundImage
         * @value ""
         * @type String
         */
		_previousBackgroundImage: "",	

		/**
		 * 
         * @method initializer
         * @param config {Object} has of configuration name/value pairs
         */
		initializer: function (config) {
			this.addToQueue();
		},

		/**
		 * Parse and normalize configuration into the animation we want to perform.
		 * Also manipulate the node we are about to animate if necessary.
		 * 
         * @method setup
         */
		setup: function () {
			var config = Y.merge({
					iterations: 1,
					direction: "alternate"
				}, this.get("config")),
				node = this.get("node");
			
			config.from = { backgroundColor: this.get("startColor") };
			config.to = { backgroundColor: this.get("endColor") };

			if (!this.get("restoreColor")) {
				this.set("restoreColor", node.getStyle("backgroundColor"));
			}
			
			this._previousBackgroundImage = node.getStyle("backgroundImage");

			node.setStyle("backgroundImage", "none");
			
			this.set("anim", new Y.Anim(config));
		},
		
		/**
		 * Any work that needs to be done once the animation is complete, typically to
		 * reset or manipulate node properties.
		 * 
         * @method _finish
         * @protected
         */
		_finish: function () {
			this.get("node").setStyles({
				backgroundImage: this._previousBackgroundImage,
				backgroundColor: this.get("restoreColor")
			});
		}
	});
	
	
	
	/*************************************************************
	 * 
	 * 			  C O M B I N A T I O N   E F F E C T S
	 * 
	 *************************************************************/
	
	
	
	/***
	 * Effect that create a "puff" of smoke effect by scaling outwards and
	 * disappearing.
	 * 
	 * @method Y.Effects.Puff
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.Puff = function (config) {
		
		var node = Y.one(config.node),
		
		// store old styles so we can reset them once we're done.
		oldStyles = {
		    opacity: node.getStyle("opacity"),
		    position: node.getStyle("position"),
		    top: node.getStyle("top"),
		    left: node.getStyle("left"),
		    width: node.getStyle("width"),
		    height: node.getStyle("height")
		},
		
		effect = new Effects.Parallel(Y.merge({
			effects: [
				new Effects.Scale({ node: node, managed: true, scaleTo: 200, scaleFromCenter: true, scaleContent: true, restoreAfterFinish: true }),
				new Effects.Opacity({ node: node, managed: true, to: 0.0 })
			],
			duration: 1.0
		}, config));
		
		effect.on("setup", function () { this.get("node").positionAbsolutely(); });
		effect.after("finish", function () { this.get("node").hide().setStyles(oldStyles); });
		
		return effect;
	};
	
	/***
	 * 
	 * @class Y.Effects.Appear
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.Appear = function (config) {
		var node = Y.one(config.node),
			fromOpacity = !node.displayed() ? 0.0 : node.getStyle("opacity") || 0.0,

		effect = new Effects.Opacity(Y.merge({
			from: fromOpacity,
			to: 1.0
		}, config));
		
		effect.on("setup", function () { this.get("node").setStyle("opacity", fromOpacity).show(); });

		return effect;
	};
	
	/***
	 * 
	 * @class Y.Effects.Fade
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.Fade = function (config) {
		var node = Y.one(config.node),
			previousOpacity = node.getStyle("opacity"),
			toOpacity = config.to || 0.0,

		effect = new Effects.Opacity(Y.merge({
			from: previousOpacity || 1.0,
			to: toOpacity
		}, config));
		
		effect.after("finish", function () {
			if (toOpacity !== 0) {
				return;
			}
			
			this.get("node").hide().setStyle("opacity", previousOpacity);
		});
		
		return effect;
	};

	/***
	 * 
	 * @class Y.Effects.BlindUp
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.BlindUp = function (config) {
		var node = Y.one(config.node);
		
		node._makeClipping();
		
		var effect = new Effects.Scale(Y.merge({
			scaleTo: 0,
			scaleContent: false,
			scaleX: false,
			restoreAfterFinish: true
		}, config));
		
		effect.after("finish", function () {
			this.get("node").hide()._undoClipping();
		});
		
		return effect;
	};
	
	/***
	 * 
	 * @class Y.Effects.BlindDown
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.BlindDown = function (config) {
		var node = Y.one(config.node),
			hw = node.getDimensions(),

		effect = new Effects.Scale(Y.merge({
			scaleTo: 100,
			scaleContent: false,
			scaleX: false,
			scaleFrom: 0,
			scaleMode: {originalHeight: hw[1], originalWidth: hw[0]},
			restoreAfterFinish: true
		}, config));
		
		effect.after("setup", function() {
			var node = this.get("node");

			node._makeClipping().setStyle("height", "0px").show();
		});
		
		effect.after("finish", function() {
			this.get("node")._undoClipping();
		});
		
		return effect;
	};
	
	/***
	 * 
	 * @class Y.Effects.SwitchOff
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.SwitchOff = function(config){
		var oldOpacity, effect = new Effects.Appear(Y.merge({
			duration: 0.4,
			from: 0,
			easing: function (t, b, c, d) {
				var pos = ((-Math.cos(t/d*Math.PI)/4) + 0.75) + Math.random()/4;
				return c * (pos > 1 ? 1 : pos) + b;
			}
		}, config));
		
		effect.on("setup", function(){
			oldOpacity = this.get("node").getStyle("opacity");
		});
		
		effect.after("finish", function(){
			var scale = new Effects.Scale({
				node: this.get("node"),
				scaleTo: 1,
				duration: 0.3,
				scaleFromCenter: false,
				scaleX: false,
				scaleContent: false,
				restoreAfterFinish: true
			});
			
			scale.on("setup", function(){
				this.get("node").makePositioned()._makeClipping();
			});
			
			scale.after("finish", function(){
				this.get("node").hide()._undoClipping().undoPositioned().setStyle("opacity", oldOpacity);
			});
		});
		
		return effect;
	};

	/***
	 * 
	 * @class Y.Effects.DropOut
	 * @param config {Object} has of configuration name/value pairs
	 */
	Effects.DropOut = function(config) {
		var oldStyle,
		
		effect = new Effects.Parallel(Y.merge({
			effects: [
				new Effects.Move({ node: config.node, managed: true, x: 0, y: 100 }),
				new Effects.Opacity({ node: config.node, managed: true, to: 0.0 })
			],
			duration: 0.5
		}, config));
	
		effect.on("setup", function () {
			var node = this.get("node");
			
			oldStyle = {
			    top: node.getStyle("top"),
			    left: node.getStyle("left"),
			    opacity: node.getStyle("opacity")
			};
			
			this.get("node").makePositioned();
		});
		
		effect.after("finish", function () {
			this.get("node").hide().undoPositioned().setStyles(oldStyle);
		});

		return effect;
	};
	
	Effects.Squish = function(config) {
		
		var effect = new Effects.Scale(Y.merge({ scaleTo: 0, restoreAfterFinish: true }, config));
		
		effect.on("setup", function () {
	    	this.get("node")._makeClipping();
		});
		
		effect.after("finish", function () {
			this.get("node").hide()._undoClipping();
		});
		
		return effect;
	};
	
	Y.Effects = Effects;
	
	/*********************************
	 * ADD METHODS TO THE NODE CLASS
	 *********************************/
	
	var ExtObj = {},
		effects = "opacity move scroll scale morph highlight appear fade puff blindUp blindDown switchOff dropOut squish".split(" ");
	
	Y.Array.each(effects, function (effect) {
		ExtObj[effect] = function (node, config) {
			config = Y.merge({ node: Y.get(node) }, config || {});
			
			var created = new Y.Effects[effect.charAt(0).toUpperCase() + effect.substring(1)](config);
		};
	});
	
	Y.Node.importMethod(ExtObj, effects);


}, 'gallery-2010.05.21-18-16' ,{requires:['node','anim','async-queue']});
