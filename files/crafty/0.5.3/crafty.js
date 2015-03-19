/*!
* Crafty v0.5.3
* http://craftyjs.com
*
* Copyright 2010, Louis Stowasser
* Dual licensed under the MIT or GPL licenses.
*/


(function (window, initComponents, undefined) {
    /**@
    * #Crafty
    * @category Core
    * Select a set of or single entities by components or an entity's ID.
    *
    * Crafty uses syntax similar to jQuery by having a selector engine to select entities by their components.
    *
    * @example
    * ~~~
    *    Crafty("MyComponent")
    *    Crafty("Hello 2D Component")
    *    Crafty("Hello, 2D, Component")
    * ~~~
    * 
    * The first selector will return all entities that have the component `MyComponent`. The second will return all entities that have `Hello` and `2D` and `Component` whereas the last will return all entities that have at least one of those components (or).
    *
    * ~~~
    *   Crafty("*")
    * ~~~
    * Passing `*` will select all entities.
    *
    * ~~~
    *   Crafty(1)
    * ~~~
    * Passing an integer will select the entity with that `ID`.
    *
    * Finding out the `ID` of an entity can be done by returning the property `0`.
    * ~~~
    *    var ent = Crafty.e("2D");
    *    ent[0]; //ID
    * ~~~
    */
    var Crafty = function (selector) {
        return new Crafty.fn.init(selector);
    },

    GUID, FPS, frame, components, entities, handlers, onloads, tick, requestID,
	noSetter, loops, milliSecPerFrame, nextGameTick, slice, rlist, rspace,

	initState = function () {
    	GUID = 1; //GUID for entity IDs
    	FPS = 50;
    	frame = 1;

    	components = {}; //map of components and their functions
    	entities = {}; //map of entities and their data
        entityFactories = {}; //templates of entities
    	handlers = {}; //global event handlers
    	onloads = []; //temporary storage of onload handlers
    	tick;

    	/*
		* `window.requestAnimationFrame` or its variants is called for animation.
		* `.requestID` keeps a record of the return value previous `window.requestAnimationFrame` call.
		* This is an internal variable. Used to stop frame.
		*/
    	requestID;

    	noSetter;

    	loops = 0;
    	milliSecPerFrame = 1000 / FPS;
    	nextGameTick = (new Date).getTime();

    	slice = Array.prototype.slice;
    	rlist = /\s*,\s*/;
    	rspace = /\s+/;
    };

    initState();

    /**@
    * #Crafty Core
    * @category Core
    * @trigger NewEntityName - After setting new name for entity - String - entity name
    * @trigger NewComponent - when a new component is added to the entity - String - Component
    * @trigger RemoveComponent - when a component is removed from the entity - String - Component
    * @trigger Remove - when the entity is removed by calling .destroy()
    * 
    * Set of methods added to every single entity.
    */
    Crafty.fn = Crafty.prototype = {

        init: function (selector) {
            //select entities by component
            if (typeof selector === "string") {
                var elem = 0, //index elements
                e, //entity forEach
                current,
                and = false, //flags for multiple
                or = false,
                del,
                comps,
                score,
                i, l;

                if (selector === '*') {
                    for (e in entities) {
                        this[+e] = entities[e];
                        elem++;
                    }
                    this.length = elem;
                    return this;
                }

                //multiple components OR
                if (selector.indexOf(',') !== -1) {
                    or = true;
                    del = rlist;
                    //deal with multiple components AND
                } else if (selector.indexOf(' ') !== -1) {
                    and = true;
                    del = rspace;
                }

                //loop over entities
                for (e in entities) {
                    if (!entities.hasOwnProperty(e)) continue; //skip
                    current = entities[e];

                    if (and || or) { //multiple components
                        comps = selector.split(del);
                        i = 0;
                        l = comps.length;
                        score = 0;

                        for (; i < l; i++) //loop over components
                            if (current.__c[comps[i]]) score++; //if component exists add to score

                        //if anded comps and has all OR ored comps and at least 1
                        if (and && score === l || or && score > 0) this[elem++] = +e;

                    } else if (current.__c[selector]) this[elem++] = +e; //convert to int
                }

                //extend all common components
                if (elem > 0 && !and && !or) this.extend(components[selector]);
                if (comps && and) for (i = 0; i < l; i++) this.extend(components[comps[i]]);

                this.length = elem; //length is the last index (already incremented)
				
				// if there's only one entity, return the actual entity
				if (elem === 1) {
					return entities[this[elem-1]];
				}

            } else { //Select a specific entity

                if (!selector) { //nothin passed creates God entity
                    selector = 0;
                    if (!(selector in entities)) entities[selector] = this;
                }

                //if not exists, return undefined
                if (!(selector in entities)) {
                    this.length = 0;
                    return this;
                }

                this[0] = selector;
                this.length = 1;

                //update from the cache
                if (!this.__c) this.__c = {};

                //update to the cache if NULL
                if (!entities[selector]) entities[selector] = this;
                return entities[selector]; //return the cached selector
            }

            return this;
        },

        /**@
        * #.setName
        * @comp Crafty Core
        * @sign public this .setName(String name)
        * @param name - A human readable name for debugging purposes.
        *
        * @example
        * ~~~
        * this.setName("Player");
        * ~~~
        */
        setName: function (name) {
            var entityName = String(name);

            this._entityName = entityName;

            this.trigger("NewEntityName", entityName);
            return this;
        },

        /**@
        * #.addComponent
        * @comp Crafty Core
        * @sign public this .addComponent(String componentList)
        * @param componentList - A string of components to add separated by a comma `,`
        * @sign public this .addComponent(String Component1[, .., String ComponentN])
        * @param Component# - Component ID to add.
        * Adds a component to the selected entities or entity.
        *
        * Components are used to extend the functionality of entities.
        * This means it will copy properties and assign methods to
        * augment the functionality of the entity.
        *
        * There are multiple methods of adding components. Passing a
        * string with a list of component names or passing multiple
        * arguments with the component names.
        *
        * If the component has a function named `init` it will be called.
        *
        * @example
        * ~~~
        * this.addComponent("2D, Canvas");
        * this.addComponent("2D", "Canvas");
        * ~~~
        */
        addComponent: function (id) {
            var uninit = [], c = 0, ul, //array of components to init
            i = 0, l, comps;

            //add multiple arguments
            if (arguments.length > 1) {
                l = arguments.length;
                for (; i < l; i++) {
                    this.__c[arguments[i]] = true;
                    uninit.push(arguments[i]);
                }
                //split components if contains comma
            } else if (id.indexOf(',') !== -1) {
                comps = id.split(rlist);
                l = comps.length;
                for (; i < l; i++) {
                    this.__c[comps[i]] = true;
                    uninit.push(comps[i]);
                }
                //single component passed
            } else {
                this.__c[id] = true;
                uninit.push(id);
            }

            //extend the components
            ul = uninit.length;
            for (; c < ul; c++) {
                comp = components[uninit[c]];
                this.extend(comp);

                //if constructor, call it
                if (comp && "init" in comp) {
                    comp.init.call(this);
                }
            }

            this.trigger("NewComponent", ul);
            return this;
        },

        /**@
        * #.toggleComponent
        * @comp Crafty Core
        * @sign public this .toggleComponent(String ComponentList)
        * @param ComponentList - A string of components to add or remove separated by a comma `,`
        * @sign public this .toggleComponent(String Component1[, .., String componentN])
        * @param Component# - Component ID to add or remove.
        * Add or Remove Components from an entity.
        * 
        * @example
        * ~~~
        * var e = Crafty.e("2D,DOM,Test");
        * e.toggleComponent("Test,Test2"); //Remove Test, add Test2
        * e.toggleComponent("Test,Test2"); //Add Test, remove Test2
        * ~~~
        *
        * ~~~
        * var e = Crafty.e("2D,DOM,Test");
        * e.toggleComponent("Test","Test2"); //Remove Test, add Test2
        * e.toggleComponent("Test","Test2"); //Add Test, remove Test2
        * e.toggleComponent("Test");         //Remove Test
        * ~~~
        */
       toggleComponent:function(toggle){
            var i = 0, l, comps;
            if (arguments.length > 1) {
                l = arguments.length;
                        
                for (; i < l; i++) {
                    if(this.has(arguments[i])){ 
                        this.removeComponent(arguments[i]);
                    }else{
                        this.addComponent(arguments[i]);
                    }
                }
            //split components if contains comma
            } else if (toggle.indexOf(',') !== -1) {
                comps = toggle.split(rlist);
                l = comps.length;
                for (; i < l; i++) {
                    if(this.has(comps[i])){ 
                        this.removeComponent(comps[i]);
                    }else{
                        this.addComponent(comps[i]);
                    }
                }
                
            //single component passed
            } else {
                if(this.has(toggle)){ 
                    this.removeComponent(toggle);
                }else{
                    this.addComponent(toggle);
                }
            }

            return this;
        },

        /**@
        * #.requires
        * @comp Crafty Core
        * @sign public this .requires(String componentList)
        * @param componentList - List of components that must be added
        * 
        * Makes sure the entity has the components listed. If the entity does not
        * have the component, it will add it.
        * 
        * @see .addComponent
        */
        requires: function (list) {
            var comps = list.split(rlist),
            i = 0, l = comps.length,
            comp;

            //loop over the list of components and add if needed
            for (; i < l; ++i) {
                comp = comps[i];
                if (!this.has(comp)) this.addComponent(comp);
            }

            return this;
        },

        /**@
        * #.removeComponent
        * @comp Crafty Core
        * @sign public this .removeComponent(String Component[, soft])
        * @param component - Component to remove
        * @param soft - Whether to soft remove it (defaults to `true`)
        *
        * Removes a component from an entity. A soft remove (the default) will only
        * refrain `.has()` from returning true. Hard will remove all
        * associated properties and methods.
        *
        * @example
        * ~~~
        * var e = Crafty.e("2D,DOM,Test");
        * e.removeComponent("Test");        //Soft remove Test component
        * e.removeComponent("Test", false); //Hard remove Test component
        * ~~~
        */
        removeComponent: function (id, soft) {
            if (soft === false) {
                var props = components[id], prop;
                for (prop in props) {
                    delete this[prop];
                }
            }
            delete this.__c[id];

            this.trigger("RemoveComponent", id);
            return this;
        },

        /**@
        * #.has
        * @comp Crafty Core
        * @sign public Boolean .has(String component)
        * Returns `true` or `false` depending on if the
        * entity has the given component.
        *
        * For better performance, simply use the `.__c` object
        * which will be `true` if the entity has the component or
        * will not exist (or be `false`).
        */
        has: function (id) {
            return !!this.__c[id];
        },

        /**@
        * #.attr
        * @comp Crafty Core
        * @sign public this .attr(String property, * value)
        * @param property - Property of the entity to modify
        * @param value - Value to set the property to
        * @sign public this .attr(Object map)
        * @param map - Object where the key is the property to modify and the value as the property value
        * @trigger Change - when properties change - {key: value}
        * 
        * Use this method to set any property of the entity.
        * 
        * @example
        * ~~~
        * this.attr({key: "value", prop: 5});
        * this.key; //value
        * this.prop; //5
        *
        * this.attr("key", "newvalue");
        * this.key; //newvalue
        * ~~~
        */
        attr: function (key, value) {
            if (arguments.length === 1) {
                //if just the key, return the value
                if (typeof key === "string") {
                    return this[key];
                }

                //extend if object
                this.extend(key);
                this.trigger("Change", key); //trigger change event
                return this;
            }
            //if key value pair
            this[key] = value;

            var change = {};
            change[key] = value;
            this.trigger("Change", change); //trigger change event
            return this;
        },

        /**@
        * #.toArray
        * @comp Crafty Core
        * @sign public this .toArray(void)
        * 
        * This method will simply return the found entities as an array.
        */
        toArray: function () {
            return slice.call(this, 0);
        },

        /**@
        * #.timeout
        * @comp Crafty Core
        * @sign public this .timeout(Function callback, Number delay)
        * @param callback - Method to execute after given amount of milliseconds
        * @param delay - Amount of milliseconds to execute the method
        * 
        * The delay method will execute a function after a given amount of time in milliseconds.
        *
        * Essentially a wrapper for `setTimeout`.
        *
        * @example
        * Destroy itself after 100 milliseconds
        * ~~~
        * this.timeout(function() {
             this.destroy();
        * }, 100);
        * ~~~
        */
        timeout: function (callback, duration) {
            this.each(function () {
                var self = this;
                setTimeout(function () {
                    callback.call(self);
                }, duration);
            });
            return this;
        },

        /**@
        * #.bind
        * @comp Crafty Core
        * @sign public this .bind(String eventName, Function callback)
        * @param eventName - Name of the event to bind to
        * @param callback - Method to execute when the event is triggered
        * Attach the current entity (or entities) to listen for an event.
        *
        * Callback will be invoked when an event with the event name passed
        * is triggered. Depending on the event, some data may be passed
        * via an argument to the callback function.
        *
        * The first argument is the event name (can be anything) whilst the
        * second argument is the callback. If the event has data, the
        * callback should have an argument.
        *
        * Events are arbitrary and provide communication between components.
        * You can trigger or bind an event even if it doesn't exist yet.
        * 
        * @example
        * ~~~
        * this.attr("triggers", 0); //set a trigger count
        * this.bind("myevent", function() {
        *     this.triggers++; //whenever myevent is triggered, increment
        * });
        * this.bind("EnterFrame", function() {
        *     this.trigger("myevent"); //trigger myevent on every frame
        * });
        * ~~~
        * 
        * @see .trigger, .unbind
        */
        bind: function (event, callback) {
            //optimization for 1 entity
            if (this.length === 1) {
                if (!handlers[event]) handlers[event] = {};
                var h = handlers[event];

                if (!h[this[0]]) h[this[0]] = []; //init handler array for entity
                h[this[0]].push(callback); //add current callback
                return this;
            }

            this.each(function () {
                //init event collection
                if (!handlers[event]) handlers[event] = {};
                var h = handlers[event];

                if (!h[this[0]]) h[this[0]] = []; //init handler array for entity
                h[this[0]].push(callback); //add current callback
            });
            return this;
        },

        /**@
        * #.unbind
        * @comp Crafty Core
        * @sign public this .unbind(String eventName[, Function callback])
        * @param eventName - Name of the event to unbind
        * @param callback - Function to unbind
        * Removes binding with an event from current entity.
        *
        * Passing an event name will remove all events bound to
        * that event. Passing a reference to the callback will
        * unbind only that callback.
        * @see .bind, .trigger
        */
        unbind: function (event, callback) {
            this.each(function () {
                var hdl = handlers[event], i = 0, l, current;
                //if no events, cancel
                if (hdl && hdl[this[0]]) l = hdl[this[0]].length;
                else return this;

                //if no function, delete all
                if (!callback) {
                    delete hdl[this[0]];
                    return this;
                }
                //look for a match if the function is passed
                for (; i < l; i++) {
                    current = hdl[this[0]];
                    if (current[i] == callback) {
                        current.splice(i, 1);
                        i--;
                    }
                }
            });

            return this;
        },

        /**@
        * #.trigger
        * @comp Crafty Core
        * @sign public this .trigger(String eventName[, Object data])
        * @param eventName - Event to trigger
        * @param data - Arbitrary data that will be passed into every callback as an argument
        * Trigger an event with arbitrary data. Will invoke all callbacks with
        * the context (value of `this`) of the current entity object.
        *
        * *Note: This will only execute callbacks within the current entity, no other entity.*
        *
        * The first argument is the event name to trigger and the optional
        * second argument is the arbitrary event data. This can be absolutely anything.
        */
        trigger: function (event, data) {
            if (this.length === 1) {
                //find the handlers assigned to the event and entity
                if (handlers[event] && handlers[event][this[0]]) {
                    var callbacks = handlers[event][this[0]], i = 0, l = callbacks.length;
                    for (; i < l; i++) {
                        callbacks[i].call(this, data);
                    }
                }
                return this;
            }

            this.each(function () {
                //find the handlers assigned to the event and entity
                if (handlers[event] && handlers[event][this[0]]) {
                    var callbacks = handlers[event][this[0]], i = 0, l = callbacks.length;
                    for (; i < l; i++) {
                        callbacks[i].call(this, data);
                    }
                }
            });
            return this;
        },

        /**@
        * #.each
        * @sign public this .each(Function method)
        * @param method - Method to call on each iteration
        * Iterates over found entities, calling a function for every entity.
        *
        * The function will be called for every entity and will pass the index
        * in the iteration as an argument. The context (value of `this`) of the
        * function will be the current entity in the iteration.
        * 
        * @example
        * Destroy every second 2D entity
        * ~~~
        * Crafty("2D").each(function(i) {
        *     if(i % 2 === 0) {
        *         this.destroy();
        *     }
        * });
        * ~~~
        */
        each: function (func) {
            var i = 0, l = this.length;
            for (; i < l; i++) {
                //skip if not exists
                if (!entities[this[i]]) continue;
                func.call(entities[this[i]], i);
            }
            return this;
        },

        /**@
        * #.clone
        * @comp Crafty Core
        * @sign public Entity .clone(void)
        * @returns Cloned entity of the current entity
        * 
        * Method will create another entity with the exact same
        * properties, components and methods as the current entity.
        */
        clone: function () {
            var comps = this.__c,
            comp,
            prop,
            clone = Crafty.e();

            for (comp in comps) {
                clone.addComponent(comp);
            }
            for (prop in this) {
                if (prop != "0" && prop != "_global" && prop != "_changed" && typeof this[prop] != "function" && typeof this[prop] != "object") {
                    clone[prop] = this[prop];
                }
            }

            return clone;
        },

        /**@
        * #.setter
        * @comp Crafty Core
        * @sign public this .setter(String property, Function callback)
        * @param property - Property to watch for modification
        * @param callback - Method to execute if the property is modified
        * Will watch a property waiting for modification and will then invoke the
        * given callback when attempting to modify.
        *
        * *Note: Support in IE<9 is slightly different. The method will be executed
        * after the property has been set*
        */
        setter: function (prop, callback) {
            if (Crafty.support.setter) {
                this.__defineSetter__(prop, callback);
            } else if (Crafty.support.defineProperty) {
                Object.defineProperty(this, prop, {
                    set: callback,
                    configurable: true
                });
            } else {
                noSetter.push({
                    prop: prop,
                    obj: this,
                    fn: callback
                });
            }
            return this;
        },

        /**@
        * #.destroy
        * @comp Crafty Core
        * @sign public this .destroy(void)
        * Will remove all event listeners and delete all properties as well as removing from the stage
        */
        destroy: function () {
            //remove all event handlers, delete from entities
            this.each(function () {
                this.trigger("Remove");
                for (var e in handlers) {
                    this.unbind(e);
                }
                delete entities[this[0]];
            });
        }
    };

    //give the init instances the Crafty prototype
    Crafty.fn.init.prototype = Crafty.fn;

    /**
    * Extension method to extend the namespace and
    * selector instances
    */
    Crafty.extend = Crafty.fn.extend = function (obj) {
        var target = this, key;

        //don't bother with nulls
        if (!obj) return target;

        for (key in obj) {
            if (target === obj[key]) continue; //handle circular reference
            target[key] = obj[key];
        }

        return target;
    };

    /**@
    * #Crafty.extend
    * @category Core
    * Used to extend the Crafty namespace.
    */
    Crafty.extend({
        /**@
        * #Crafty.init
        * @category Core
        * @trigger EnterFrame - on each frame - { frame: Number }
        * @trigger Load - Just after the viewport is initialised. Before the EnterFrame loops is started
        * @sign public this Crafty.init([Number width, Number height])
        * @param width - Width of the stage
        * @param height - Height of the stage
        * 
        * Create a div with id `cr-stage`, if there is not already an HTMLElement with id `cr-stage` (by `Crafty.viewport.init`).
        *
        * Starts the `EnterFrame` interval. This will call the `EnterFrame` event for every frame.
        *
        * Can pass width and height values for the stage otherwise will default to window size (see `Crafty.DOM.window`).
        *
        * All `Load` events will be executed.
        *
        * Uses `requestAnimationFrame` to sync the drawing with the browser but will default to `setInterval` if the browser does not support it.
        * @see Crafty.stop,  Crafty.viewport
        */
        init: function (w, h) {
            Crafty.viewport.init(w, h);

            //call all arbitrary functions attached to onload
            this.trigger("Load");
            this.timer.init();

            return this;
        },

        /**@
        * #.getVersion
        * @comp Crafty Core
        * @sign public this .getVersion()
        * @returns Actually crafty version
        *
        * @example
        * ~~~
        * Crafty.getVersion(); //'0.5.2'
        * ~~~
        */
        getVersion: function () {
            return '0.5.3';
        },

        /**@
        * #Crafty.stop
        * @category Core
        * @trigger CraftyStop - when the game is stopped
        * @sign public this Crafty.stop([bool clearState])
		* @param clearState - if true the stage and all game state is cleared.
        *
        * Stops the EnterFrame interval and removes the stage element.
        *
        * To restart, use `Crafty.init()`.
        * @see Crafty.init
        */
        stop: function (clearState) {
        	this.timer.stop();
        	if (clearState) {
        		if (Crafty.stage && Crafty.stage.elem.parentNode) {
        			var newCrStage = document.createElement('div');
        			newCrStage.id = "cr-stage";
        			Crafty.stage.elem.parentNode.replaceChild(newCrStage, Crafty.stage.elem);
        		}
        		initState();
        		initComponents(Crafty, window, window.document);
        	}

            Crafty.trigger("CraftyStop");

        	return this;
        },

        /**@
        * #Crafty.pause
        * @category Core
        * @trigger Pause - when the game is paused
        * @trigger Unpause - when the game is unpaused
        * @sign public this Crafty.pause(void)
        * 
        * Pauses the game by stopping the EnterFrame event from firing. If the game is already paused it is unpaused.
        * You can pass a boolean parameter if you want to pause or unpause mo matter what the current state is.
        * Modern browsers pauses the game when the page is not visible to the user. If you want the Pause event
        * to be triggered when that happens you can enable autoPause in `Crafty.settings`.
        * 
        * @example
        * Have an entity pause the game when it is clicked.
        * ~~~
        * button.bind("click", function() {
        *     Crafty.pause();
        * });
        * ~~~
        */
        pause: function (toggle) {
            if (arguments.length == 1 ? toggle : !this._paused) {
                this.trigger('Pause');
                this._paused = true;
                setTimeout(function(){ Crafty.timer.stop(); }, 0);
                Crafty.keydown = {};
            } else {
                this.trigger('Unpause');
                this._paused = false;
                setTimeout(function(){ Crafty.timer.init(); }, 0);
            }
            return this;
        },

        /**@
         * #Crafty.isPaused
         * @category Core
         * @sign public this Crafty.isPaused()
         * 
         * Check whether the game is already paused or not.
         * 
         * @example
         * ~~~
         * Crafty.isPaused();
         * ~~~
         */
        isPaused: function () {
            return this._paused;
        },

        /**@
        * #Crafty.timer
        * @category Internal
        * Handles game ticks
        */
        timer: {
            prev: (+new Date),
            current: (+new Date),
            currentTime: +new Date(),
            frames:0,
            frameTime:0,
            init: function () {
                var onFrame = window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    null;

                if (onFrame) {
                    tick = function () {
                        Crafty.timer.step();
                        requestID = onFrame(tick);
                        //console.log(requestID + ', ' + frame)
                    }

                    tick();
                } else {
                    tick = setInterval(function () { Crafty.timer.step(); }, 1000 / FPS);
                }
            },

            stop: function () {
                Crafty.trigger("CraftyStopTimer");

                if (typeof tick === "number") clearInterval(tick);

                var onFrame = window.cancelRequestAnimationFrame ||
                    window.webkitCancelRequestAnimationFrame ||
                    window.mozCancelRequestAnimationFrame ||
                    window.oCancelRequestAnimationFrame ||
                    window.msCancelRequestAnimationFrame ||
                    null;

                if (onFrame) onFrame(requestID);
                tick = null;
            },

            /**@
            * #Crafty.timer.step
            * @comp Crafty.timer
            * @sign public void Crafty.timer.step()
            * Advances the game by triggering `EnterFrame` and calls `Crafty.DrawManager.draw` to update the stage.
            */
            step: function () {
                loops = 0;
                this.currentTime = +new Date();
                if (this.currentTime - nextGameTick > 60 * milliSecPerFrame) {
                    nextGameTick = this.currentTime - milliSecPerFrame;
                }
                while (this.currentTime > nextGameTick) {
                    Crafty.trigger("EnterFrame", { frame: frame++ });
                    nextGameTick += milliSecPerFrame;
                    loops++;
                }
                if (loops) {
                    Crafty.DrawManager.draw();
                }
               if(this.currentTime > this.frameTime){
                    Crafty.trigger("MessureFPS",{value:this.frame});
                    this.frame = 0;
                    this.frameTime = this.currentTime + 1000;
                }else{
                    this.frame++;
                }
            
            },
            /**@
            * #Crafty.timer.getFPS
            * @comp Crafty.timer
            * @sign public void Crafty.timer.getFPS()
            * Returns the target frames per second. This is not an actual frame rate.
            */
            getFPS: function () {
                return FPS;
            },

            /**@
            * #Crafty.timer.simulateFrames
            * @comp Crafty.timer
            * Advances the game state by a number of frames and draws the resulting stage at the end. Useful for tests and debugging.
            * @sign public this Crafty.timer.simulateFrames(Number frames)
            * @param frames - number of frames to simulate
            */
            simulateFrames: function (frames) {
                while (frames-- > 0) {
                    Crafty.trigger("EnterFrame", { frame: frame++ });
                }
                Crafty.DrawManager.draw();
            }

        },

        /**@
        * #Crafty.addEntityFactory
        * @category Core
        * @param name - Name of the entity factory.
        * @param callback - Function containing the entity creation procedure.
        * 
        * Registers an Entity Factory.  An Entity Factory allows for the repeatable creation of an Entity.
        *
        * @example
        * ~~~
        * Crafty.addEntityFactory('Projectile', function() {
        *   var entity = Crafty.e('2D, Canvas, Color, Physics, Collision')
        *   .color("red")
        *   .attr({
        *     w: 3,
        *     h: 3,
        *     x: this.x,
        *     y: this.y
        *   })
        *   .addComponent('Gravity').gravity("Floor");
        *   
        *   return entity;
        * });
        * ~~~
        * 
        * @see Crafty.e
        */
        addEntityFactory: function(name, callback) {
            this.entityFactories[name] = callback;
        },

        /**@
        * #Crafty.newFactoryEntity
        * @category Core
        * @param name - Name of the entity factory.
        * 
        * Creates a new entity based on a specific Entity Factory.
        *
        * @example
        * ~~~
        * Crafty.addEntityFactory('Projectile', function() {
        *   var entity = Crafty.e('2D, Canvas, Color, Physics, Collision')
        *   .color("red")
        *   .attr({
        *     w: 3,
        *     h: 3,
        *     x: this.x,
        *     y: this.y
        *   })
        *   .addComponent('Gravity').gravity("Floor");
        *   
        *   return entity;
        * });
        *
        * Crafty.newFactoryEntity('Projectile'); // This returns a new Projectile Entity.
        * ~~~
        * 
        * @see Crafty.e
        */
        newFactoryEntity: function(name) {
            return this.entityTemplates[name]();
        },

        /**@
        * #Crafty.e
        * @category Core
        * @trigger NewEntity - When the entity is created and all components are added - { id:Number }
        * @sign public Entity Crafty.e(String componentList)
        * @param componentList - List of components to assign to new entity
        * @sign public Entity Crafty.e(String component1[, .., String componentN])
        * @param component# - Component to add
        * 
        * Creates an entity. Any arguments will be applied in the same
        * way `.addComponent()` is applied as a quick way to add components.
        *
        * Any component added will augment the functionality of
        * the created entity by assigning the properties and methods from the component to the entity.
        * 
        * @example
        * ~~~
        * var myEntity = Crafty.e("2D, DOM, Color");
        * ~~~
        * 
        * @see Crafty.c
        */
        e: function () {
            var id = UID(), craft;

            entities[id] = null; //register the space
            entities[id] = craft = Crafty(id);

            if (arguments.length > 0) {
                craft.addComponent.apply(craft, arguments);
            }
            craft.setName('Entity #'+id); //set default entity human readable name
            craft.addComponent("obj"); //every entity automatically assumes obj

            Crafty.trigger("NewEntity", { id: id });

            return craft;
        },

        /**@
        * #Crafty.c
        * @category Core
        * @sign public void Crafty.c(String name, Object component)
        * @param name - Name of the component
        * @param component - Object with the components properties and methods
        * Creates a component where the first argument is the ID and the second
        * is the object that will be inherited by entities.
        *
        * There is a convention for writing components. 
        *
        * - Properties or methods that start with an underscore are considered private.
        * - A method called `init` will automatically be called as soon as the
        * component is added to an entity.
        * - A method with the same name as the component is considered to be a constructor
        * and is generally used when you need to pass configuration data to the component on a per entity basis.
        *
        * @example
        * ~~~
        * Crafty.c("Annoying", {
        *     _message: "HiHi",
        *     init: function() {
        *         this.bind("EnterFrame", function() { alert(this.message); });
        *     },
        *     annoying: function(message) { this.message = message; }
        * });
        *
        * Crafty.e("Annoying").annoying("I'm an orange...");
        * ~~~
        *
        * 
        * WARNING: 
        *
        * in the example above the field _message is local to the entity. That is, if you create many entities with the Annoying component they can all have different values for _message. That is because it is a simple value, and simple values are copied by value. If however the field had been an object or array, the value would have been shared by all entities with the component because complex types are copied by reference in javascript. This is probably not what you want and the following example demonstrates how to work around it:
        *
        * ~~~
        * Crafty.c("MyComponent", {
        *     _iAmShared: { a: 3, b: 4 },
        *     init: function() {
        *         this._iAmNotShared = { a: 3, b: 4 };
        *     },
        * });
        * ~~~
        *
        * @see Crafty.e
        */
        c: function (compName, component) {
            components[compName] = component;
        },

        /**@
        * #Crafty.trigger
        * @category Core, Events
        * @sign public void Crafty.trigger(String eventName, * data)
        * @param eventName - Name of the event to trigger
        * @param data - Arbitrary data to pass into the callback as an argument
        * 
        * This method will trigger every single callback attached to the event name. This means
        * every global event and every entity that has a callback.
        * 
        * @see Crafty.bind
        */
        trigger: function (event, data) {
            var hdl = handlers[event], h, i, l;
            //loop over every object bound
            for (h in hdl) {
                if (!hdl.hasOwnProperty(h)) continue;

                //loop over every handler within object
                for (i = 0, l = hdl[h].length; i < l; i++) {
                    if (hdl[h] && hdl[h][i]) {
                        //if an entity, call with that context
                        if (entities[h]) {
                            hdl[h][i].call(Crafty(+h), data);
                        } else { //else call with Crafty context
                            hdl[h][i].call(Crafty, data);
                        }
                    }
                }
            }
        },

        /**@
        * #Crafty.bind
        * @category Core, Events
        * @sign public Number bind(String eventName, Function callback)
        * @param eventName - Name of the event to bind to
        * @param callback - Method to execute upon event triggered
        * @returns ID of the current callback used to unbind
        * 
        * Binds to a global event. Method will be executed when `Crafty.trigger` is used
        * with the event name.
        * 
        * @see Crafty.trigger, Crafty.unbind
        */
        bind: function (event, callback) {
            if (!handlers[event]) handlers[event] = {};
            var hdl = handlers[event];

            if (!hdl.global) hdl.global = [];
            return hdl.global.push(callback) - 1;
        },

        /**@
        * #Crafty.unbind
        * @category Core, Events
        * @sign public Boolean Crafty.unbind(String eventName, Function callback)
        * @param eventName - Name of the event to unbind
        * @param callback - Function to unbind
        * @sign public Boolean Crafty.unbind(String eventName, Number callbackID)
        * @param callbackID - ID of the callback
        * @returns True or false depending on if a callback was unbound
        * Unbind any event from any entity or global event.
        */
        unbind: function (event, callback) {
            var hdl = handlers[event], h, i, l;

            //loop over every object bound
            for (h in hdl) {
                if (!hdl.hasOwnProperty(h)) continue;

                //if passed the ID
                if (typeof callback === "number") {
                    delete hdl[h][callback];
                    return true;
                }

                //loop over every handler within object
                for (i = 0, l = hdl[h].length; i < l; i++) {
                    if (hdl[h][i] === callback) {
                        delete hdl[h][i];
                        return true;
                    }
                }
            }

            return false;
        },

        /**@
        * #Crafty.frame
        * @category Core
        * @sign public Number Crafty.frame(void)
        * Returns the current frame number
        */
        frame: function () {
            return frame;
        },

        components: function () {
            return components;
        },

        isComp: function (comp) {
            return comp in components;
        },

        debug: function () {
            return entities;
        },

        /**@
        * #Crafty.settings
        * @category Core
        * Modify the inner workings of Crafty through the settings.
        */
        settings: (function () {
            var states = {},
            callbacks = {};

            return {
            /**@
            * #Crafty.settings.register
            * @comp Crafty.settings
            * @sign public void Crafty.settings.register(String settingName, Function callback)
            * @param settingName - Name of the setting
            * @param callback - Function to execute when use modifies setting
            * 
            * Use this to register custom settings. Callback will be executed when `Crafty.settings.modify` is used.
            * 
            * @see Crafty.settings.modify
            */
                register: function (setting, callback) {
                    callbacks[setting] = callback;
                },

            /**@
            * #Crafty.settings.modify
            * @comp Crafty.settings
            * @sign public void Crafty.settings.modify(String settingName, * value)
            * @param settingName - Name of the setting
            * @param value - Value to set the setting to
            * 
            * Modify settings through this method.
            * 
            * @see Crafty.settings.register, Crafty.settings.get
            */
                modify: function (setting, value) {
                    if (!callbacks[setting]) return;
                    callbacks[setting].call(states[setting], value);
                    states[setting] = value;
                },

            /**@
            * #Crafty.settings.get
            * @comp Crafty.settings
            * @sign public * Crafty.settings.get(String settingName)
            * @param settingName - Name of the setting
            * @returns Current value of the setting
            * 
            * Returns the current value of the setting.
            * 
            * @see Crafty.settings.register, Crafty.settings.get
            */
                get: function (setting) {
                    return states[setting];
                }
            };
        })(),

        clone: clone
    });

    /**
    * Return a unique ID
    */
    function UID() {
        var id = GUID++;
        //if GUID is not unique
        if (id in entities) {
            return UID(); //recurse until it is unique
        }
        return id;
    }

    /**@
    * #Crafty.clone
    * @category Core
    * @sign public Object .clone(Object obj)
    * @param obj - an object
    * 
    * Deep copy (a.k.a clone) of an object.
    */
    function clone(obj) {
        if (obj === null || typeof(obj) != 'object')
            return obj;

        var temp = obj.constructor(); // changed

        for (var key in obj)
            temp[key] = clone(obj[key]);
        return temp;
    }

    Crafty.bind("Load", function () {
        if (!Crafty.support.setter && Crafty.support.defineProperty) {
            noSetter = [];
            Crafty.bind("EnterFrame", function () {
                var i = 0, l = noSetter.length, current;
                for (; i < l; ++i) {
                    current = noSetter[i];
                    if (current.obj[current.prop] !== current.obj['_' + current.prop]) {
                        current.fn.call(current.obj, current.obj[current.prop]);
                    }
                }
            });
        }
    });

    initComponents(Crafty, window, window.document);

    //make Crafty global
    window.Crafty = Crafty;

    if (typeof define === 'function') {
        define('crafty', [], function() { return Crafty; });
    }
})(window,


//wrap around components
function(Crafty, window, document) {


/**
* Spatial HashMap for broad phase collision
*
* @author Louis Stowasser
*/
(function (parent) {


	/**@
	* #Crafty.HashMap.constructor
	* @comp Crafty.HashMap
	* @sign public void Crafty.HashMap([cellsize])
	* @param cellsize - the cell size. If omitted, `cellsize` is 64.
	* 
    * Set `cellsize`.
    * And create `this.map`.
	*/
	var cellsize,

	HashMap = function (cell) {
		cellsize = cell || 64;
		this.map = {};
	},

	SPACE = " ";

	HashMap.prototype = {
	/**@
	* #Crafty.map.insert
	* @comp Crafty.map
    * @sign public Object Crafty.map.insert(Object obj)
	* @param obj - An entity to be inserted.
	* 
    * `obj` is inserted in '.map' of the corresponding broad phase cells. An object of the following fields is returned.
    * ~~~
    * - the object that keep track of cells (keys)
    * - `obj`
    * - the HashMap object
    * ~~~
	*/
		insert: function (obj) {
			var keys = HashMap.key(obj),
			entry = new Entry(keys, obj, this),
			i = 0,
			j,
			hash;

			//insert into all x buckets
			for (i = keys.x1; i <= keys.x2; i++) {
				//insert into all y buckets
				for (j = keys.y1; j <= keys.y2; j++) {
					hash = i + SPACE + j;
					if (!this.map[hash]) this.map[hash] = [];
					this.map[hash].push(obj);
				}
			}

			return entry;
		},

	/**@
	* #Crafty.map.search
	* @comp Crafty.map
    * @sign public Object Crafty.map.search(Object rect[, Boolean filter])
	* @param rect - the rectangular region to search for entities.
	* @param filter - Default value is true. Otherwise, must be false.
	* 
    * - If `filter` is `false`, just search for all the entries in the give `rect` region by broad phase collision. Entity may be returned duplicated.
    * - If `filter` is `true`, filter the above results by checking that they actually overlap `rect`.
    * The easier usage is with `filter`=`true`. For performance reason, you may use `filter`=`false`, and filter the result yourself. See examples in drawing.js and collision.js
	*/
		search: function (rect, filter) {
			var keys = HashMap.key(rect),
			i, j,
			hash,
			results = [];

			if (filter === undefined) filter = true; //default filter to true

			//search in all x buckets
			for (i = keys.x1; i <= keys.x2; i++) {
				//insert into all y buckets
				for (j = keys.y1; j <= keys.y2; j++) {
					hash = i + SPACE + j;

					if (this.map[hash]) {
						results = results.concat(this.map[hash]);
					}
				}
			}

			if (filter) {
				var obj, id, finalresult = [], found = {};
				//add unique elements to lookup table with the entity ID as unique key
				for (i = 0, l = results.length; i < l; i++) {
					obj = results[i];
					if (!obj) continue; //skip if deleted
					id = obj[0]; //unique ID

					//check if not added to hash and that actually intersects
					if (!found[id] && obj.x < rect._x + rect._w && obj._x + obj._w > rect._x &&
								 obj.y < rect._y + rect._h && obj._h + obj._y > rect._y)
						found[id] = results[i];
				}

				//loop over lookup table and copy to final array
				for (obj in found) finalresult.push(found[obj]);

				return finalresult;
			} else {
				return results;
			}
		},

	/**@
	* #Crafty.map.remove
	* @comp Crafty.map
	* @sign public void Crafty.map.remove([Object keys, ]Object obj)
	* @param keys - key region. If omitted, it will be derived from obj by `Crafty.HashMap.key`.
	* @param obj - need more document.
	* 
	* Remove an entity in a broad phase map.
	* - The second form is only used in Crafty.HashMap to save time for computing keys again, where keys were computed previously from obj. End users should not call this form directly.
	*
	* @example 
	* ~~~
	* Crafty.map.remove(e);
	* ~~~
	*/
		remove: function (keys, obj) {
			var i = 0, j, hash;

			if (arguments.length == 1) {
				obj = keys;
				keys = HashMap.key(obj);
			}

			//search in all x buckets
			for (i = keys.x1; i <= keys.x2; i++) {
				//insert into all y buckets
				for (j = keys.y1; j <= keys.y2; j++) {
					hash = i + SPACE + j;

					if (this.map[hash]) {
						var cell = this.map[hash],
						m,
						n = cell.length;
						//loop over objs in cell and delete
						for (m = 0; m < n; m++)
							if (cell[m] && cell[m][0] === obj[0])
								cell.splice(m, 1);
					}
				}
			}
		},

	/**@
	* #Crafty.map.boundaries
	* @comp Crafty.map
	* @sign public Object Crafty.map.boundaries()
	* 
    * The return `Object` is of the following format.
    * ~~~
	* {
    *   min: {
    *     x: val_x,
    *     y: val_y
    *   },
    *   max: {
    *     x: val_x,
    *     y: val_y
    *   }
    * }
    * ~~~
	*/
		boundaries: function () {
			var k, ent,
			hash = {
				max: { x: -Infinity, y: -Infinity },
				min: { x: Infinity, y: Infinity }
			},
			coords = {
				max: { x: -Infinity, y: -Infinity },
				min: { x: Infinity, y: Infinity }
			};

      //Using broad phase hash to speed up the computation of boundaries.
			for (var h in this.map) {
				if (!this.map[h].length) continue;

        //broad phase coordinate
				var map_coord = h.split(SPACE),
					i=map_coord[0],
					j=map_coord[0];
				if (i >= hash.max.x) {
					hash.max.x = i;
					for (k in this.map[h]) {
						ent = this.map[h][k];
						//make sure that this is a Crafty entity
						if (typeof ent == 'object' && 'requires' in ent) {
							coords.max.x = Math.max(coords.max.x, ent.x + ent.w);
						}
					}
				}
				if (i <= hash.min.x) {
					hash.min.x = i;
					for (k in this.map[h]) {
						ent = this.map[h][k];
						if (typeof ent == 'object' && 'requires' in ent) {
							coords.min.x = Math.min(coords.min.x, ent.x);
						}
					}
				}
				if (j >= hash.max.y) {
					hash.max.y = j;
					for (k in this.map[h]) {
						ent = this.map[h][k];
						if (typeof ent == 'object' && 'requires' in ent) {
							coords.max.y = Math.max(coords.max.y, ent.y + ent.h);
						}
					}
				}
				if (j <= hash.min.y) {
					hash.min.y = j;
					for (k in this.map[h]) {
						ent = this.map[h][k];
						if (typeof ent == 'object' && 'requires' in ent) {
							coords.min.y = Math.min(coords.min.y, ent.y);
						}
					}
				}
			}

			return coords;
		}
	};

/**@
* #Crafty.HashMap
* @category 2D
* Broad-phase collision detection engine. See background information at 
*
* ~~~
* - [N Tutorial B - Broad-Phase Collision](http://www.metanetsoftware.com/technique/tutorialB.html)
* - [Broad-Phase Collision Detection with CUDA](http.developer.nvidia.com/GPUGems3/gpugems3_ch32.html)
* ~~~
* @see Crafty.map
*/

	/**@
	* #Crafty.HashMap.key
	* @comp Crafty.HashMap
	* @sign public Object Crafty.HashMap.key(Object obj)
	* @param obj - an Object that has .mbr() or _x, _y, _w and _h.
    * Get the rectangular region (in terms of the grid, with grid size `cellsize`), where the object may fall in. This region is determined by the object's bounding box.
    * The `cellsize` is 64 by default.
    * 
    * @see Crafty.HashMap.constructor
	*/
	HashMap.key = function (obj) {
		if (obj.hasOwnProperty('mbr')) {
			obj = obj.mbr();
		}
		var x1 = Math.floor(obj._x / cellsize),
		y1 = Math.floor(obj._y / cellsize),
		x2 = Math.floor((obj._w + obj._x) / cellsize),
		y2 = Math.floor((obj._h + obj._y) / cellsize);
		return { x1: x1, y1: y1, x2: x2, y2: y2 };
	};

	HashMap.hash = function (keys) {
		return keys.x1 + SPACE + keys.y1 + SPACE + keys.x2 + SPACE + keys.y2;
	};

	function Entry(keys, obj, map) {
		this.keys = keys;
		this.map = map;
		this.obj = obj;
	}

	Entry.prototype = {
		update: function (rect) {
			//check if buckets change
			if (HashMap.hash(HashMap.key(rect)) != HashMap.hash(this.keys)) {
				this.map.remove(this.keys, this.obj);
				var e = this.map.insert(this.obj);
				this.keys = e.keys;
			}
		}
	};

	parent.HashMap = HashMap;
})(Crafty);


/**@
* #Crafty.map
* @category 2D
* Functions related with querying entities.
* @see Crafty.HashMap
*/
Crafty.map = new Crafty.HashMap();
var M = Math,
	Mc = M.cos,
	Ms = M.sin,
	PI = M.PI,
	DEG_TO_RAD = PI / 180;


/**@
* #2D
* @category 2D
* Component for any entity that has a position on the stage.
* @trigger Move - when the entity has moved - { _x:Number, _y:Number, _w:Number, _h:Number } - Old position
* @trigger Change - when the entity has moved - { _x:Number, _y:Number, _w:Number, _h:Number } - Old position
* @trigger Rotate - when the entity is rotated - { cos:Number, sin:Number, deg:Number, rad:Number, o: {x:Number, y:Number}, matrix: {M11, M12, M21, M22} }
*/
Crafty.c("2D", {
/**@
	* #.x
	* @comp 2D
	* The `x` position on the stage. When modified, will automatically be redrawn.
	* Is actually a getter/setter so when using this value for calculations and not modifying it,
	* use the `._x` property.
	* @see ._attr
	*/
	_x: 0,
	/**@
	* #.y
	* @comp 2D
	* The `y` position on the stage. When modified, will automatically be redrawn.
	* Is actually a getter/setter so when using this value for calculations and not modifying it,
	* use the `._y` property.
	* @see ._attr
	*/
	_y: 0,
	/**@
	* #.w
	* @comp 2D
	* The width of the entity. When modified, will automatically be redrawn.
	* Is actually a getter/setter so when using this value for calculations and not modifying it,
	* use the `._w` property.
	*
	* Changing this value is not recommended as canvas has terrible resize quality and DOM will just clip the image.
	* @see ._attr
	*/
	_w: 0,
	/**@
	* #.h
	* @comp 2D
	* The height of the entity. When modified, will automatically be redrawn.
	* Is actually a getter/setter so when using this value for calculations and not modifying it,
	* use the `._h` property.
	*
	* Changing this value is not recommended as canvas has terrible resize quality and DOM will just clip the image.
	* @see ._attr
	*/
	_h: 0,
	/**@
	* #.z
	* @comp 2D
	* The `z` index on the stage. When modified, will automatically be redrawn.
	* Is actually a getter/setter so when using this value for calculations and not modifying it,
	* use the `._z` property.
	*
	* A higher `z` value will be closer to the front of the stage. A smaller `z` value will be closer to the back.
	* A global Z index is produced based on its `z` value as well as the GID (which entity was created first).
	* Therefore entities will naturally maintain order depending on when it was created if same z value.
	* @see ._attr
	*/
	_z: 0,
	/**@
	* #.rotation
	* @comp 2D
	* Set the rotation of your entity. Rotation takes degrees in a clockwise direction.
	* It is important to note there is no limit on the rotation value. Setting a rotation
	* mod 360 will give the same rotation without reaching huge numbers.
	* @see ._attr
	*/
	_rotation: 0,
	/**@
	* #.alpha
	* @comp 2D
	* Transparency of an entity. Must be a decimal value between 0.0 being fully transparent to 1.0 being fully opaque.
	*/
	_alpha: 1.0,
	/**@
	* #.visible
	* @comp 2D
	* If the entity is visible or not. Accepts a true or false value.
	* Can be used for optimization by setting an entities visibility to false when not needed to be drawn.
	*
	* The entity will still exist and can be collided with but just won't be drawn.
  * @see Crafty.DrawManager.draw, Crafty.DrawManager.drawAll
	*/
	_visible: true,

	/**@
	* #._globalZ
	* @comp 2D
	* When two entities overlap, the one with the larger `_globalZ` will be on top of the other.
	* @see Crafty.DrawManager.draw, Crafty.DrawManager.drawAll
	*/
	_globalZ: null,

	_origin: null,
	_mbr: null,
	_entry: null,
	_children: null,
	_parent: null,
	_changed: false,

	_defineGetterSetter_setter: function() {
		//create getters and setters using __defineSetter__ and __defineGetter__
		this.__defineSetter__('x', function (v) { this._attr('_x', v); });
		this.__defineSetter__('y', function (v) { this._attr('_y', v); });
		this.__defineSetter__('w', function (v) { this._attr('_w', v); });
		this.__defineSetter__('h', function (v) { this._attr('_h', v); });
		this.__defineSetter__('z', function (v) { this._attr('_z', v); });
		this.__defineSetter__('rotation', function (v) { this._attr('_rotation', v); });
		this.__defineSetter__('alpha', function (v) { this._attr('_alpha', v); });
		this.__defineSetter__('visible', function (v) { this._attr('_visible', v); });

		this.__defineGetter__('x', function () { return this._x; });
		this.__defineGetter__('y', function () { return this._y; });
		this.__defineGetter__('w', function () { return this._w; });
		this.__defineGetter__('h', function () { return this._h; });
		this.__defineGetter__('z', function () { return this._z; });
		this.__defineGetter__('rotation', function () { return this._rotation; });
		this.__defineGetter__('alpha', function () { return this._alpha; });
		this.__defineGetter__('visible', function () { return this._visible; });
		this.__defineGetter__('parent', function () { return this._parent; });
		this.__defineGetter__('numChildren', function () { return this._children.length; });
	},

	_defineGetterSetter_defineProperty: function() {
		Object.defineProperty(this, 'x', {
				set: function (v) { this._attr('_x', v); }
				, get: function () { return this._x; }
				, configurable: true
			});

		Object.defineProperty(this, 'y', {
				set: function (v) { this._attr('_y', v); }
				, get: function () { return this._y; }
				, configurable: true
			});

		Object.defineProperty(this, 'w', {
				set: function (v) { this._attr('_w', v); }
				, get: function () { return this._w; }
				, configurable: true
			});

		Object.defineProperty(this, 'h', {
				set: function (v) { this._attr('_h', v); }
				, get: function () { return this._h; }
				, configurable: true
			});

		Object.defineProperty(this, 'z', {
				set: function (v) { this._attr('_z', v); }
				, get: function () { return this._z; }
				, configurable: true
			});

		Object.defineProperty(this, 'rotation', {
			set: function (v) { this._attr('_rotation', v); }
			, get: function () { return this._rotation; }
			, configurable: true
		});

		Object.defineProperty(this, 'alpha', {
			set: function (v) { this._attr('_alpha', v); }
			, get: function () { return this._alpha; }
			, configurable: true
		});

		Object.defineProperty(this, 'visible', {
			set: function (v) { this._attr('_visible', v); }
			, get: function () { return this._visible; }
			, configurable: true
		});
	},

	_defineGetterSetter_fallback: function() {
		//set the public properties to the current private properties
		this.x = this._x;
		this.y = this._y;
		this.w = this._w;
		this.h = this._h;
		this.z = this._z;
		this.rotation = this._rotation;
		this.alpha = this._alpha;
		this.visible = this._visible;

		//on every frame check for a difference in any property
		this.bind("EnterFrame", function () {
			//if there are differences between the public and private properties
			if (this.x !== this._x || this.y !== this._y ||
				this.w !== this._w || this.h !== this._h ||
				this.z !== this._z || this.rotation !== this._rotation ||
				this.alpha !== this._alpha || this.visible !== this._visible) {

				//save the old positions
				var old = this.mbr() || this.pos();

				//if rotation has changed, use the private rotate method
				if (this.rotation !== this._rotation) {
					this._rotate(this.rotation);
				} else {
					//update the MBR
					var mbr = this._mbr, moved = false;
					// If the browser doesn't have getters or setters,
					// {x, y, w, h, z} and {_x, _y, _w, _h, _z} may be out of sync,
					// in which case t checks if they are different on tick and executes the Change event.
					if (mbr) { //check each value to see which has changed
						if (this.x !== this._x) { mbr._x -= this.x - this._x; moved = true; }
						else if (this.y !== this._y) { mbr._y -= this.y - this._y; moved = true; }
						else if (this.w !== this._w) { mbr._w -= this.w - this._w; moved = true; }
						else if (this.h !== this._h) { mbr._h -= this.h - this._h; moved = true; }
						else if (this.z !== this._z) { mbr._z -= this.z - this._z; moved = true; }
					}

					//if the moved flag is true, trigger a move
					if (moved) this.trigger("Move", old);
				}

				//set the public properties to the private properties
				this._x = this.x;
				this._y = this.y;
				this._w = this.w;
				this._h = this.h;
				this._z = this.z;
				this._rotation = this.rotation;
				this._alpha = this.alpha;
				this._visible = this.visible;

				//trigger the changes
				this.trigger("Change", old);
				//without this entities weren't added correctly to Crafty.map.map in IE8.
				//not entirely sure this is the best way to fix it though
				this.trigger("Move", old);
			}
		});
  },

	init: function() {
		this._globalZ = this[0];
		this._origin = { x: 0, y: 0 };
		this._children = [];

		if(Crafty.support.setter) {
      this._defineGetterSetter_setter();
		} else if (Crafty.support.defineProperty) {
			//IE9 supports Object.defineProperty
      this._defineGetterSetter_defineProperty();
		} else {
			/*
			If no setters and getters are supported (e.g. IE8) supports,
			check on every frame for a difference between this._(x|y|w|h|z...)
			and this.(x|y|w|h|z) and update accordingly.
			*/
      this._defineGetterSetter_fallback();
		}

		//insert self into the HashMap
		this._entry = Crafty.map.insert(this);

		//when object changes, update HashMap
		this.bind("Move", function (e) {
			var area = this._mbr || this;
			this._entry.update(area);
			this._cascade(e);
		});

		this.bind("Rotate", function (e) {
			var old = this._mbr || this;
			this._entry.update(old);
			this._cascade(e);
		});

		//when object is removed, remove from HashMap and destroy attached children
		this.bind("Remove", function () {
			if (this._children) {
				for (var i = 0; i < this._children.length; i++) {
					if (this._children[i].destroy) {
						this._children[i].destroy();
					}
				}
				this._children = [];
			}
			
			if (this._parent) {
				this._parent.detach(this);
			}

			Crafty.map.remove(this);

			this.detach();
		});
	},

	/**
	* Calculates the MBR when rotated with an origin point
	*/
	_rotate: function (v) {
		var theta = -1 * (v % 360), //angle always between 0 and 359
			rad = theta * DEG_TO_RAD,
			ct = Math.cos(rad), //cache the sin and cosine of theta
			st = Math.sin(rad),
			o = {
			x: this._origin.x + this._x,
			y: this._origin.y + this._y
		};

		//if the angle is 0 and is currently 0, skip
		if (!theta) {
			this._mbr = null;
			if (!this._rotation % 360) return;
		}

		var x0 = o.x + (this._x - o.x) * ct + (this._y - o.y) * st,
			y0 = o.y - (this._x - o.x) * st + (this._y - o.y) * ct,
			x1 = o.x + (this._x + this._w - o.x) * ct + (this._y - o.y) * st,
			y1 = o.y - (this._x + this._w - o.x) * st + (this._y - o.y) * ct,
			x2 = o.x + (this._x + this._w - o.x) * ct + (this._y + this._h - o.y) * st,
			y2 = o.y - (this._x + this._w - o.x) * st + (this._y + this._h - o.y) * ct,
			x3 = o.x + (this._x - o.x) * ct + (this._y + this._h - o.y) * st,
			y3 = o.y - (this._x - o.x) * st + (this._y + this._h - o.y) * ct,
			minx = Math.round(Math.min(x0, x1, x2, x3)),
			miny = Math.round(Math.min(y0, y1, y2, y3)),
			maxx = Math.round(Math.max(x0, x1, x2, x3)),
			maxy = Math.round(Math.max(y0, y1, y2, y3));

		this._mbr = { _x: minx, _y: miny, _w: maxx - minx, _h: maxy - miny };

		//trigger rotation event
		var difference = this._rotation - v,
			drad = difference * DEG_TO_RAD;

		this.trigger("Rotate", {
			cos: Math.cos(drad),
			sin: Math.sin(drad),
			deg: difference,
			rad: drad,
			o: { x: o.x, y: o.y },
			matrix: { M11: ct, M12: st, M21: -st, M22: ct }
		});
	},

	/**@
	* #.area
	* @comp 2D
	* @sign public Number .area(void)
	* Calculates the area of the entity
	*/
	area: function () {
		return this._w * this._h;
	},

	/**@
	* #.intersect
	* @comp 2D
	* @sign public Boolean .intersect(Number x, Number y, Number w, Number h)
	* @param x - X position of the rect
	* @param y - Y position of the rect
	* @param w - Width of the rect
	* @param h - Height of the rect
	* @sign public Boolean .intersect(Object rect)
	* @param rect - An object that must have the `x, y, w, h` values as properties
	* Determines if this entity intersects a rectangle.
	*/
	intersect: function (x, y, w, h) {
		var rect, obj = this._mbr || this;
		if (typeof x === "object") {
			rect = x;
		} else {
			rect = { x: x, y: y, w: w, h: h };
		}

		return obj._x < rect.x + rect.w && obj._x + obj._w > rect.x &&
			   obj._y < rect.y + rect.h && obj._h + obj._y > rect.y;
	},

	/**@
	* #.within
	* @comp 2D
	* @sign public Boolean .within(Number x, Number y, Number w, Number h)
	* @param x - X position of the rect
	* @param y - Y position of the rect
	* @param w - Width of the rect
	* @param h - Height of the rect
	* @sign public Boolean .within(Object rect)
	* @param rect - An object that must have the `x, y, w, h` values as properties
	* Determines if this current entity is within another rectangle.
	*/
	within: function (x, y, w, h) {
		var rect;
		if (typeof x === "object") {
			rect = x;
		} else {
			rect = { x: x, y: y, w: w, h: h };
		}

		return rect.x <= this.x && rect.x + rect.w >= this.x + this.w &&
				rect.y <= this.y && rect.y + rect.h >= this.y + this.h;
	},

	/**@
	* #.contains
	* @comp 2D
	* @sign public Boolean .contains(Number x, Number y, Number w, Number h)
	* @param x - X position of the rect
	* @param y - Y position of the rect
	* @param w - Width of the rect
	* @param h - Height of the rect
	* @sign public Boolean .contains(Object rect)
	* @param rect - An object that must have the `x, y, w, h` values as properties
	* Determines if the rectangle is within the current entity.
	*/
	contains: function (x, y, w, h) {
		var rect;
		if (typeof x === "object") {
			rect = x;
		} else {
			rect = { x: x, y: y, w: w, h: h };
		}

		return rect.x >= this.x && rect.x + rect.w <= this.x + this.w &&
				rect.y >= this.y && rect.y + rect.h <= this.y + this.h;
	},

	/**@
	* #.pos
	* @comp 2D
	* @sign public Object .pos(void)
	* Returns the x, y, w, h properties as a rect object
	* (a rect object is just an object with the keys _x, _y, _w, _h).
	*
	* The keys have an underscore prefix. This is due to the x, y, w, h
	* properties being merely setters and getters that wrap the properties with an underscore (_x, _y, _w, _h).
	*/
	pos: function () {
		return {
			_x: (this._x),
			_y: (this._y),
			_w: (this._w),
			_h: (this._h)
		};
	},

	/**@
	* #.mbr
	* @comp 2D
	* @sign public Object .mbr()
	* Returns the minimum bounding rectangle. If there is no rotation
	* on the entity it will return the rect.
	*/
	mbr: function () {
		if (!this._mbr) return this.pos();
		return {
			_x: (this._mbr._x),
			_y: (this._mbr._y),
			_w: (this._mbr._w),
			_h: (this._mbr._h)
		};
	},

	/**@
	* #.isAt
	* @comp 2D
	* @sign public Boolean .isAt(Number x, Number y)
	* @param x - X position of the point
	* @param y - Y position of the point
	* Determines whether a point is contained by the entity. Unlike other methods,
	* an object can't be passed. The arguments require the x and y value
	*/
	isAt: function (x, y) {
		if (this.mapArea) {
      		return this.mapArea.containsPoint(x, y);
		} else if (this.map) {
			return this.map.containsPoint(x, y);
		}
		return this.x <= x && this.x + this.w >= x &&
			   this.y <= y && this.y + this.h >= y;
	},

	/**@
	* #.move
	* @comp 2D
	* @sign public this .move(String dir, Number by)
	* @param dir - Direction to move (n,s,e,w,ne,nw,se,sw)
	* @param by - Amount to move in the specified direction
	* Quick method to move the entity in a direction (n, s, e, w, ne, nw, se, sw) by an amount of pixels.
	*/
	move: function (dir, by) {
		if (dir.charAt(0) === 'n') this.y -= by;
		if (dir.charAt(0) === 's') this.y += by;
		if (dir === 'e' || dir.charAt(1) === 'e') this.x += by;
		if (dir === 'w' || dir.charAt(1) === 'w') this.x -= by;

		return this;
	},

	/**@
	* #.shift
	* @comp 2D
	* @sign public this .shift(Number x, Number y, Number w, Number h)
	* @param x - Amount to move X
	* @param y - Amount to move Y
	* @param w - Amount to widen
	* @param h - Amount to increase height
	* Shift or move the entity by an amount. Use negative values
	* for an opposite direction.
	*/
	shift: function (x, y, w, h) {
		if (x) this.x += x;
		if (y) this.y += y;
		if (w) this.w += w;
		if (h) this.h += h;

		return this;
	},

	/**@
	* #._cascade
	* @comp 2D
    * @sign public void ._cascade(e)
	* @param e - Amount to move X
	* Shift move or rotate the entity by an amount. Use negative values
	* for an opposite direction.
	*/
	_cascade: function (e) {
		if (!e) return; //no change in position
		var i = 0, children = this._children, l = children.length, obj;
		//rotation
		if (e.cos) {
			for (; i < l; ++i) {
				obj = children[i];
				if ('rotate' in obj) obj.rotate(e);
			}
		} else {
			//use MBR or current
			var rect = this._mbr || this,
				dx = rect._x - e._x,
				dy = rect._y - e._y,
				dw = rect._w - e._w,
				dh = rect._h - e._h;

			for (; i < l; ++i) {
				obj = children[i];
				obj.shift(dx, dy, dw, dh);
			}
		}
	},

	/**@
	* #.attach
	* @comp 2D
	* @sign public this .attach(Entity obj[, .., Entity objN])
	* @param obj - Entity(s) to attach
	* Attaches an entities position and rotation to current entity. When the current entity moves,
	* the attached entity will move by the same amount. Attached entities stored in _children array,
	* the parent object is stored in _parent on the child entities.
	*
	* As many objects as wanted can be attached and a hierarchy of objects is possible by attaching.
	*/
	attach: function () {
		var i = 0, arg = arguments, l = arguments.length, obj;
		for (; i < l; ++i) {
			obj = arg[i];
			if (obj._parent) { obj._parent.detach(obj); }
			obj._parent = this;
			this._children.push(obj);
		}

		return this;
	},

	/**@
	* #.detach
	* @comp 2D
	* @sign public this .detach([Entity obj])
	* @param obj - The entity to detach. Left blank will remove all attached entities
	* Stop an entity from following the current entity. Passing no arguments will stop
	* every entity attached.
	*/
	detach: function (obj) {
		//if nothing passed, remove all attached objects
		if (!obj) {
			for (var i = 0; i < this._children.length; i++) {
				this._children[i]._parent = null;
			}
			this._children = [];
			return this;
		}

		//if obj passed, find the handler and unbind
		for (var i = 0; i < this._children.length; i++) {
			if (this._children[i] == obj) {
				this._children.splice(i, 1);
			}
		}
		obj._parent = null;

		return this;
	},

	/**@
	* #.origin
	* @comp 2D
	* @sign public this .origin(Number x, Number y)
	* @param x - Pixel value of origin offset on the X axis
	* @param y - Pixel value of origin offset on the Y axis
	* @sign public this .origin(String offset)
	* @param offset - Combination of center, top, bottom, middle, left and right
	* Set the origin point of an entity for it to rotate around.
	*
	* @example
	* ~~~
	* this.origin("top left")
	* this.origin("center")
	* this.origin("bottom right")
	* this.origin("middle right")
	* ~~~
	*
	* @see .rotation
	*/
	origin: function (x, y) {
		//text based origin
		if (typeof x === "string") {
			if (x === "centre" || x === "center" || x.indexOf(' ') === -1) {
				x = this._w / 2;
				y = this._h / 2;
			} else {
				var cmd = x.split(' ');
				if (cmd[0] === "top") y = 0;
				else if (cmd[0] === "bottom") y = this._h;
				else if (cmd[0] === "middle" || cmd[1] === "center" || cmd[1] === "centre") y = this._h / 2;

				if (cmd[1] === "center" || cmd[1] === "centre" || cmd[1] === "middle") x = this._w / 2;
				else if (cmd[1] === "left") x = 0;
				else if (cmd[1] === "right") x = this._w;
			}
		}

		this._origin.x = x;
		this._origin.y = y;

		return this;
	},

	/**@
	* #.flip
	* @comp 2D
	* @trigger Change - when the entity has flipped
	* @sign public this .flip(String dir)
	* @param dir - Flip direction
	*
	* Flip entity on passed direction
	*
	* @example
	* ~~~
	* this.flip("X")
	* ~~~
	*/
	flip: function (dir) {
		dir = dir || "X";
                if(!this["_flip" + dir]) {
                    this["_flip" + dir] = true;
                    this.trigger("Change");
                }
	},

        /**@
	* #.unflip
	* @comp 2D
	* @trigger Change - when the entity has unflipped
	* @sign public this .unflip(String dir)
	* @param dir - Unflip direction
	*
	* Unflip entity on passed direction (if it's flipped)
	*
	* @example
	* ~~~
	* this.unflip("X")
	* ~~~
	*/
	unflip: function (dir) {
		dir = dir || "X";
                if(this["_flip" + dir]) {
                    this["_flip" + dir] = false;
                    this.trigger("Change");
                }
	},

	/**
	* Method for rotation rather than through a setter
	*/
	rotate: function (e) {
		//assume event data origin
		this._origin.x = e.o.x - this._x;
		this._origin.y = e.o.y - this._y;

		//modify through the setter method
		this._attr('_rotation', e.theta);
	},

	/**@
	* #._attr
	* @comp 2D
	* Setter method for all 2D properties including
	* x, y, w, h, alpha, rotation and visible.
	*/
	_attr: function (name, value) {
		//keep a reference of the old positions
		var pos = this.pos(),
			old = this.mbr() || pos;

		//if rotation, use the rotate method
		if (name === '_rotation') {
			this._rotate(value);
			this.trigger("Rotate");
			//set the global Z and trigger reorder just in case
		} else if (name === '_z') {
			this._globalZ = parseInt(value + Crafty.zeroFill(this[0], 5), 10); //magic number 10e5 is the max num of entities
			this.trigger("reorder");
			//if the rect bounds change, update the MBR and trigger move
		} else if (name == '_x' || name === '_y' || name === '_w' || name === '_h') {
			var mbr = this._mbr;
			if (mbr) {
				mbr[name] -= this[name] - value;
			}
			this[name] = value;
			this.trigger("Move", old);
		}

		//everything will assume the value
		this[name] = value;

		//trigger a change
		this.trigger("Change", old);
	}
});

Crafty.c("Physics", {
	_gravity: 0.4,
	_friction: 0.2,
	_bounce: 0.5,

	gravity: function (gravity) {
		this._gravity = gravity;
	}
});

/**@
* #Gravity
* @category 2D
* Adds gravitational pull to the entity.
*/
Crafty.c("Gravity", {
	_gravityConst: 0.2,
	_gy: 0,
	_falling: true,
	_anti: null,

	init: function () {
		this.requires("2D");
	},

	/**@
	* #.gravity
	* @comp Gravity
	* @sign public this .gravity([comp])
	* @param comp - The name of a component that will stop this entity from falling
	*
	* Enable gravity for this entity no matter whether comp parameter is not specified,
	* If comp parameter is specified all entities with that component will stop this entity from falling.
	* For a player entity in a platform game this would be a component that is added to all entities
	* that the player should be able to walk on.
	*
	* @example
	* ~~~
	* Crafty.e("2D, DOM, Color, Gravity")
	*	 .color("red")
	*	 .attr({ w: 100, h: 100 })
	*	 .gravity("platform")
	* ~~~
	*/
	gravity: function (comp) {
		if (comp) this._anti = comp;

		this.bind("EnterFrame", this._enterFrame);

		return this;
	},

	/**@
	* #.gravityConst
	* @comp Gravity
	* @sign public this .gravityConst(g)
	* @param g - gravitational constant
	*
	* Set the gravitational constant to g. The default is .2. The greater g, the faster the object falls.
	*
	* @example
	* ~~~
	* Crafty.e("2D, DOM, Color, Gravity")
	*   .color("red")
	*   .attr({ w: 100, h: 100 })
	*   .gravity("platform")
	*   .gravityConst(2)
	* ~~~
	*/
	gravityConst: function(g) {
		this._gravityConst=g;
		return this;
	},

	_enterFrame: function () {
		if (this._falling) {
			//if falling, move the players Y
			this._gy += this._gravityConst;
			this.y += this._gy;
		} else {
			this._gy = 0; //reset change in y
		}

		var obj, hit = false, pos = this.pos(),
			q, i = 0, l;

		//Increase by 1 to make sure map.search() finds the floor
		pos._y++;

		//map.search wants _x and intersect wants x...
		pos.x = pos._x;
		pos.y = pos._y;
		pos.w = pos._w;
		pos.h = pos._h;

		q = Crafty.map.search(pos);
		l = q.length;

		for (; i < l; ++i) {
			obj = q[i];
			//check for an intersection directly below the player
			if (obj !== this && obj.has(this._anti) && obj.intersect(pos)) {
				hit = obj;
				break;
			}
		}

		if (hit) { //stop falling if found
			if (this._falling) this.stopFalling(hit);
		} else {
			this._falling = true; //keep falling otherwise
		}
	},

	stopFalling: function (e) {
		if (e) this.y = e._y - this._h; //move object

		//this._gy = -1 * this._bounce;
		this._falling = false;
		if (this._up) this._up = false;
		this.trigger("hit");
	},

	/**@
	* #.antigravity
	* @comp Gravity
	* @sign public this .antigravity()
	* Disable gravity for this component. It can be reenabled by calling .gravity()
	*/
	antigravity: function () {
		this.unbind("EnterFrame", this._enterFrame);
	}
});

/**@
* #Crafty.polygon
* @category 2D
*
* Polygon object used for hitboxes and click maps. Must pass an Array for each point as an
* argument where index 0 is the x position and index 1 is the y position.
*
* For example one point of a polygon will look like this: `[0,5]` where the `x` is `0` and the `y` is `5`.
*
* Can pass an array of the points or simply put each point as an argument.
*
* When creating a polygon for an entity, each point should be offset or relative from the entities `x` and `y`
* (don't include the absolute values as it will automatically calculate this).
*
*
* @example
* ~~~
* new Crafty.polygon([50,0],[100,100],[0,100]);
* new Crafty.polygon([[50,0],[100,100],[0,100]]);
* ~~~
*/
Crafty.polygon = function (poly) {
	if (arguments.length > 1) {
		poly = Array.prototype.slice.call(arguments, 0);
	}
	this.points = poly;
};

Crafty.polygon.prototype = {
	/**@
	* #.containsPoint
	* @comp Crafty.polygon
	* @sign public Boolean .containsPoint(Number x, Number y)
	* @param x - X position of the point
	* @param y - Y position of the point
	*
	* Method is used to determine if a given point is contained by the polygon.
	*
	* @example
	* ~~~
	* var poly = new Crafty.polygon([50,0],[100,100],[0,100]);
	* poly.containsPoint(50, 50); //TRUE
	* poly.containsPoint(0, 0); //FALSE
	* ~~~
	*/
	containsPoint: function (x, y) {
		var p = this.points, i, j, c = false;

		for (i = 0, j = p.length - 1; i < p.length; j = i++) {
			if (((p[i][1] > y) != (p[j][1] > y)) && (x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0])) {
				c = !c;
			}
		}

		return c;
	},

	/**@
	* #.shift
	* @comp Crafty.polygon
	* @sign public void .shift(Number x, Number y)
	* @param x - Amount to shift the `x` axis
	* @param y - Amount to shift the `y` axis
	*
	* Shifts every single point in the polygon by the specified amount.
	*
	* @example
	* ~~~
	* var poly = new Crafty.polygon([50,0],[100,100],[0,100]);
	* poly.shift(5,5);
	* //[[55,5], [105,5], [5,105]];
	* ~~~
	*/
	shift: function (x, y) {
		var i = 0, l = this.points.length, current;
		for (; i < l; i++) {
			current = this.points[i];
			current[0] += x;
			current[1] += y;
		}
	},

	rotate: function (e) {
		var i = 0, l = this.points.length,
			current, x, y;

		for (; i < l; i++) {
			current = this.points[i];

			x = e.o.x + (current[0] - e.o.x) * e.cos + (current[1] - e.o.y) * e.sin;
			y = e.o.y - (current[0] - e.o.x) * e.sin + (current[1] - e.o.y) * e.cos;

			current[0] = x;
			current[1] = y;
		}
	}
};

/**@
* #Crafty.circle
* @category 2D
* Circle object used for hitboxes and click maps. Must pass a `x`, a `y` and a `radius` value.
*
*@example
* ~~~
* var centerX = 5,
*     centerY = 10,
*     radius = 25;
*
* new Crafty.circle(centerX, centerY, radius);
* ~~~
*
* When creating a circle for an entity, each point should be offset or relative from the entities `x` and `y`
* (don't include the absolute values as it will automatically calculate this).
*/
Crafty.circle = function (x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    // Creates an octagon that approximate the circle for backward compatibility.
    this.points = [];
    var theta;

    for (var i = 0; i < 8; i++) {
        theta = i * Math.PI / 4;
        this.points[i] = [this.x + (Math.sin(theta) * radius), this.y + (Math.cos(theta) * radius)];
    }
};

Crafty.circle.prototype = {
    /**@
	* #.containsPoint
	* @comp Crafty.circle
	* @sign public Boolean .containsPoint(Number x, Number y)
	* @param x - X position of the point
	* @param y - Y position of the point
	*
	* Method is used to determine if a given point is contained by the circle.
	*
	* @example
	* ~~~
	* var circle = new Crafty.circle(0, 0, 10);
	* circle.containsPoint(0, 0); //TRUE
	* circle.containsPoint(50, 50); //FALSE
	* ~~~
	*/
	containsPoint: function (x, y) {
		var radius = this.radius,
		    sqrt = Math.sqrt,
		    deltaX = this.x - x,
		    deltaY = this.y - y;

		return (deltaX * deltaX + deltaY * deltaY) < (radius * radius);
	},

	/**@
	* #.shift
	* @comp Crafty.circle
	* @sign public void .shift(Number x, Number y)
	* @param x - Amount to shift the `x` axis
	* @param y - Amount to shift the `y` axis
	*
	* Shifts the circle by the specified amount.
	*
	* @example
	* ~~~
	* var poly = new Crafty.circle(0, 0, 10);
	* circle.shift(5,5);
	* //{x: 5, y: 5, radius: 10};
	* ~~~
	*/
	shift: function (x, y) {
		this.x += x;
		this.y += y;

		var i = 0, l = this.points.length, current;
		for (; i < l; i++) {
			current = this.points[i];
			current[0] += x;
			current[1] += y;
		}
	},

	rotate: function () {
		// We are a circle, we don't have to rotate :)
	}
};


Crafty.matrix = function (m) {
	this.mtx = m;
	this.width = m[0].length;
	this.height = m.length;
};

Crafty.matrix.prototype = {
	x: function (other) {
		if (this.width != other.height) {
			return;
		}

		var result = [];
		for (var i = 0; i < this.height; i++) {
			result[i] = [];
			for (var j = 0; j < other.width; j++) {
				var sum = 0;
				for (var k = 0; k < this.width; k++) {
					sum += this.mtx[i][k] * other.mtx[k][j];
				}
				result[i][j] = sum;
			}
		}
		return new Crafty.matrix(result);
	},


	e: function (row, col) {
		//test if out of bounds
		if (row < 1 || row > this.mtx.length || col < 1 || col > this.mtx[0].length) return null;
		return this.mtx[row - 1][col - 1];
	}
}


/**@
* #Collision
* @category 2D
* Component to detect collision between any two convex polygons.
*/
Crafty.c("Collision", {
    /**@
     * #.init
     * @comp Collision
     * Create a rectangle polygon based on the x, y, w, h dimensions.
     *
     * You must ensure that the x, y, w, h properties are set before the init function is called. If you have a Car component that sets these properties you should create your entity like this
     * ~~~
     * Crafty.e('2D, DOM, Car, Collision');
     * ~~~
     * And not like
     * ~~~
     * Crafty.e('2D, DOM, Collision, Car');
     * ~~~
     */
    init: function () {
        this.requires("2D");
        var area = this._mbr || this;

        poly = new Crafty.polygon([0, 0], [area._w, 0], [area._w, area._h], [0, area._h]);
        this.map = poly;
        this.attach(this.map);
        this.map.shift(area._x, area._y);
    },

    /**@
	* #.collision
	* @comp Collision
	* 
	* @sign public this .collision([Crafty.polygon polygon])
	* @param polygon - Crafty.polygon object that will act as the hit area
	* 
	* @sign public this .collision(Array point1, .., Array pointN)
	* @param point# - Array with an `x` and `y` position to generate a polygon
	* 
	* Constructor takes a polygon or array of points to use as the hit area.
	*
	* The hit area (polygon) must be a convex shape and not concave
	* for the collision detection to work.
    *
    * If no hit area is specified x, y, w, h properties of the entity will be used.
	* 
	* @example
	* ~~~
	* Crafty.e("2D, Collision").collision(
	*     new Crafty.polygon([50,0], [100,100], [0,100])
	* );
    * 
    * Crafty.e("2D, Collision").collision([50,0], [100,100], [0,100]);
	* ~~~
	* 
	* @see Crafty.polygon
	*/
    collision: function (poly) {
        var area = this._mbr || this;

        if (!poly) {
            poly = new Crafty.polygon([0, 0], [area._w, 0], [area._w, area._h], [0, area._h]);
        }

        if (arguments.length > 1) {
            //convert args to array to create polygon
            var args = Array.prototype.slice.call(arguments, 0);
            poly = new Crafty.polygon(args);
        }

        this.map = poly;
        this.attach(this.map);
        this.map.shift(area._x, area._y);

        return this;
    },

	/**@
	* #.hit
	* @comp Collision
	* @sign public Boolean/Array hit(String component)
	* @param component - Check collision with entities that has this component
	* @return `false` if no collision. If a collision is detected, returns an Array of objects that are colliding.
	* 
	* Takes an argument for a component to test collision for. If a collision is found, an array of
	* every object in collision along with the amount of overlap is passed.
	*
	* If no collision, will return false. The return collision data will be an Array of Objects with the
	* type of collision used, the object collided and if the type used was SAT (a polygon was used as the hitbox) then an amount of overlap.\
	* ~~~
	* [{
	*    obj: [entity],
	*    type "MBR" or "SAT",
	*    overlap: [number]
	* }]
	* ~~~
	* `MBR` is your standard axis aligned rectangle intersection (`.intersect` in the 2D component).
	* `SAT` is collision between any convex polygon.
	* 
	* @see .onHit, 2D
	*/
	hit: function (comp) {
		var area = this._mbr || this,
			results = Crafty.map.search(area, false),
			i = 0, l = results.length,
			dupes = {},
			id, obj, oarea, key,
			hasMap = ('map' in this && 'containsPoint' in this.map),
			finalresult = [];

		if (!l) {
			return false;
		}

		for (; i < l; ++i) {
			obj = results[i];
			oarea = obj._mbr || obj; //use the mbr

			if (!obj) continue;
			id = obj[0];

			//check if not added to hash and that actually intersects
			if (!dupes[id] && this[0] !== id && obj.__c[comp] &&
							 oarea._x < area._x + area._w && oarea._x + oarea._w > area._x &&
							 oarea._y < area._y + area._h && oarea._h + oarea._y > area._y)
				dupes[id] = obj;
		}

		for (key in dupes) {
			obj = dupes[key];

			if (hasMap && 'map' in obj) {
				var SAT = this._SAT(this.map, obj.map);
				SAT.obj = obj;
				SAT.type = "SAT";
				if (SAT) finalresult.push(SAT);
			} else {
				finalresult.push({ obj: obj, type: "MBR" });
			}
		}

		if (!finalresult.length) {
			return false;
		}

		return finalresult;
	},

	/**@
	* #.onHit
	* @comp Collision
	* @sign public this .onHit(String component, Function hit[, Function noHit])
	* @param component - Component to check collisions for
	* @param hit - Callback method to execute when collided with component
	* @param noHit - Callback method executed once as soon as collision stops
	* 
	* Creates an enterframe event calling .hit() each time and if collision detected will invoke the callback.
	* 
	* @see .hit
	*/
	onHit: function (comp, callback, callbackOff) {
		var justHit = false;
		this.bind("EnterFrame", function () {
			var hitdata = this.hit(comp);
			if (hitdata) {
				justHit = true;
				callback.call(this, hitdata);
			} else if (justHit) {
				if (typeof callbackOff == 'function') {
					callbackOff.call(this);
				}
				justHit = false;
			}
		});
		return this;
	},

	_SAT: function (poly1, poly2) {
		var points1 = poly1.points,
			points2 = poly2.points,
			i = 0, l = points1.length,
			j, k = points2.length,
			normal = { x: 0, y: 0 },
			length,
			min1, min2,
			max1, max2,
			interval,
			MTV = null,
			MTV2 = null,
			MN = null,
			dot,
			nextPoint,
			currentPoint;

		//loop through the edges of Polygon 1
		for (; i < l; i++) {
			nextPoint = points1[(i == l - 1 ? 0 : i + 1)];
			currentPoint = points1[i];

			//generate the normal for the current edge
			normal.x = -(nextPoint[1] - currentPoint[1]);
			normal.y = (nextPoint[0] - currentPoint[0]);

			//normalize the vector
			length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
			normal.x /= length;
			normal.y /= length;

			//default min max
			min1 = min2 = -1;
			max1 = max2 = -1;

			//project all vertices from poly1 onto axis
			for (j = 0; j < l; ++j) {
				dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
				if (dot > max1 || max1 === -1) max1 = dot;
				if (dot < min1 || min1 === -1) min1 = dot;
			}

			//project all vertices from poly2 onto axis
			for (j = 0; j < k; ++j) {
				dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
				if (dot > max2 || max2 === -1) max2 = dot;
				if (dot < min2 || min2 === -1) min2 = dot;
			}

			//calculate the minimum translation vector should be negative
			if (min1 < min2) {
				interval = min2 - max1;

				normal.x = -normal.x;
				normal.y = -normal.y;
			} else {
				interval = min1 - max2;
			}

			//exit early if positive
			if (interval >= 0) {
				return false;
			}

			if (MTV === null || interval > MTV) {
				MTV = interval;
				MN = { x: normal.x, y: normal.y };
			}
		}

		//loop through the edges of Polygon 2
		for (i = 0; i < k; i++) {
			nextPoint = points2[(i == k - 1 ? 0 : i + 1)];
			currentPoint = points2[i];

			//generate the normal for the current edge
			normal.x = -(nextPoint[1] - currentPoint[1]);
			normal.y = (nextPoint[0] - currentPoint[0]);

			//normalize the vector
			length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
			normal.x /= length;
			normal.y /= length;

			//default min max
			min1 = min2 = -1;
			max1 = max2 = -1;

			//project all vertices from poly1 onto axis
			for (j = 0; j < l; ++j) {
				dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
				if (dot > max1 || max1 === -1) max1 = dot;
				if (dot < min1 || min1 === -1) min1 = dot;
			}

			//project all vertices from poly2 onto axis
			for (j = 0; j < k; ++j) {
				dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
				if (dot > max2 || max2 === -1) max2 = dot;
				if (dot < min2 || min2 === -1) min2 = dot;
			}

			//calculate the minimum translation vector should be negative
			if (min1 < min2) {
				interval = min2 - max1;

				normal.x = -normal.x;
				normal.y = -normal.y;
			} else {
				interval = min1 - max2;


			}

			//exit early if positive
			if (interval >= 0) {
				return false;
			}

			if (MTV === null || interval > MTV) MTV = interval;
			if (interval > MTV2 || MTV2 === null) {
				MTV2 = interval;
				MN = { x: normal.x, y: normal.y };
			}
		}

		return { overlap: MTV2, normal: MN };
	}
});



/**@
* #.WiredHitBox
* @comp Collision
* 
* Components to display Crafty.polygon Array for debugging collision detection
* 
* @example
* This will display a wired square over your original Canvas screen
* ~~~
* Crafty.e("2D,DOM,Player,Collision,WiredHitBox").collision(new Crafty.polygon([0,0],[0,300],[300,300],[300,0]))
* ~~~
*/
Crafty.c("WiredHitBox", {

	init: function () {

		if (Crafty.support.canvas) {
			var c = document.getElementById('HitBox');
			if (!c) {
				c = document.createElement("canvas");
				c.id = 'HitBox';
				c.width = Crafty.viewport.width;
				c.height = Crafty.viewport.height;
				c.style.position = 'absolute';
				c.style.left = "0px";
				c.style.top = "0px";
				c.style.zIndex = '1000';
				Crafty.stage.elem.appendChild(c);
			}
			var ctx = c.getContext('2d');
			var drawed = 0, total = Crafty("WiredHitBox").length;
			this.requires("Collision").bind("EnterFrame", function () {
				if (drawed == total) {
					ctx.clearRect(0, 0, Crafty.viewport.width, Crafty.viewport.height);
					drawed = 0;
				}
				ctx.beginPath();
				for (var p in this.map.points) {
					ctx.lineTo(Crafty.viewport.x + this.map.points[p][0], Crafty.viewport.y + this.map.points[p][1]);
				}
				ctx.closePath();
				ctx.stroke();
				drawed++;

			});
		}

		return this;
	}
});
/**@
* #.SolidHitBox
* @comp Collision
* 
* Components to display Crafty.polygon Array for debugging collision detection
* 
* @example
* This will display a solid triangle over your original Canvas screen
* ~~~
* Crafty.e("2D,DOM,Player,Collision,SolidHitBox").collision(new Crafty.polygon([0,0],[0,300],[300,300]))
* ~~~
*/
Crafty.c("SolidHitBox", {
	init: function () {
		if (Crafty.support.canvas) {
			var c = document.getElementById('HitBox');
			if (!c) {
				c = document.createElement("canvas");
				c.id = 'HitBox';
				c.width = Crafty.viewport.width;
				c.height = Crafty.viewport.height;
				c.style.position = 'absolute';
				c.style.left = "0px";
				c.style.top = "0px";
				c.style.zIndex = '1000';
				Crafty.stage.elem.appendChild(c);
			}
			var ctx = c.getContext('2d');
			var drawed = 0, total = Crafty("SolidHitBox").length;
			this.requires("Collision").bind("EnterFrame", function () {
				if (drawed == total) {
					ctx.clearRect(0, 0, Crafty.viewport.width, Crafty.viewport.height);
					drawed = 0;
				}
				ctx.beginPath();
				for (var p in this.map.points) {
					ctx.lineTo(Crafty.viewport.x + this.map.points[p][0], Crafty.viewport.y + this.map.points[p][1]);
				}
				ctx.closePath();
				ctx.fill();
				drawed++;
			});
		}

		return this;
	}
});

/**@
* #DOM
* @category Graphics
* Draws entities as DOM nodes, specifically `<DIV>`s.
*/
Crafty.c("DOM", {
    /**@
	* #._element
	* @comp DOM
	* The DOM element used to represent the entity.
	*/
	_element: null,
	//holds current styles, so we can check if there are changes to be written to the DOM
	_cssStyles: null,

	init: function () {
		this._cssStyles = { visibility: '', left: '', top: '', width: '', height: '', zIndex: '', opacity: '', transformOrigin: '', transform: '' };
		this._element = document.createElement("div");
		Crafty.stage.inner.appendChild(this._element);
		this._element.style.position = "absolute";
		this._element.id = "ent" + this[0];

		this.bind("Change", function () {
			if (!this._changed) {
				this._changed = true;
				Crafty.DrawManager.add(this);
			}
		});

		function updateClass() {
			var i = 0, c = this.__c, str = "";
			for (i in c) {
				str += ' ' + i;
			}
			str = str.substr(1);
			this._element.className = str;
		}

		this.bind("NewComponent", updateClass).bind("RemoveComponent", updateClass);

		if (Crafty.support.prefix === "ms" && Crafty.support.version < 9) {
			this._filters = {};

			this.bind("Rotate", function (e) {
				var m = e.matrix,
					elem = this._element.style,
					M11 = m.M11.toFixed(8),
					M12 = m.M12.toFixed(8),
					M21 = m.M21.toFixed(8),
					M22 = m.M22.toFixed(8);

				this._filters.rotation = "progid:DXImageTransform.Microsoft.Matrix(M11=" + M11 + ", M12=" + M12 + ", M21=" + M21 + ", M22=" + M22 + ",sizingMethod='auto expand')";
			});
		}

		this.bind("Remove", this.undraw);
		this.bind("RemoveComponent", function (compName) {
			if (compName === "DOM")
				this.undraw();
		});
	},

	/**@
	* #.getDomId
	* @comp DOM
	* @sign public this .getId()
	* 
	* Get the Id of the DOM element used to represent the entity.
	*/
	getDomId: function() {
		return this._element.id;
	},

	/**@
	* #.DOM
	* @comp DOM
	* @trigger Draw - when the entity is ready to be drawn to the stage - { style:String, type:"DOM", co}
	* @sign public this .DOM(HTMLElement elem)
	* @param elem - HTML element that will replace the dynamically created one
	* 
	* Pass a DOM element to use rather than one created. Will set `._element` to this value. Removes the old element.
	*/
	DOM: function (elem) {
		if (elem && elem.nodeType) {
			this.undraw();
			this._element = elem;
			this._element.style.position = 'absolute';
		}
		return this;
	},

	/**@
	* #.draw
	* @comp DOM
	* @sign public this .draw(void)
	* 
	* Updates the CSS properties of the node to draw on the stage.
	*/
	draw: function () {
		var style = this._element.style,
			coord = this.__coord || [0, 0, 0, 0],
			co = { x: coord[0], y: coord[1] },
			prefix = Crafty.support.prefix,
			trans = [];

		if (this._cssStyles.visibility != this._visible) {
			this._cssStyles.visibility = this._visible;
			if (!this._visible) {
				style.visibility = "hidden";
			} else {
				style.visibility = "visible";
			}
		}

		//utilize CSS3 if supported
		if (Crafty.support.css3dtransform) {
			trans.push("translate3d(" + (~~this._x) + "px," + (~~this._y) + "px,0)");
		} else {
			if (this._cssStyles.left != this._x) {
				this._cssStyles.left = this._x;
				style.left = ~~(this._x) + "px";
			}
			if (this._cssStyles.top != this._y) {
				this._cssStyles.top = this._y;
				style.top = ~~(this._y) + "px";
			}
		}

		if (this._cssStyles.width != this._w) {
			this._cssStyles.width = this._w;
			style.width = ~~(this._w) + "px";
		}
		if (this._cssStyles.height != this._h) {
			this._cssStyles.height = this._h;
			style.height = ~~(this._h) + "px";
		}
		if (this._cssStyles.zIndex != this._z) {
			this._cssStyles.zIndex = this._z;
			style.zIndex = this._z;
		}

		if (this._cssStyles.opacity != this._alpha) {
			this._cssStyles.opacity = this._alpha;
			style.opacity = this._alpha;
			style[prefix + "Opacity"] = this._alpha;
		}

		//if not version 9 of IE
		if (prefix === "ms" && Crafty.support.version < 9) {
			//for IE version 8, use ImageTransform filter
			if (Crafty.support.version === 8) {
				this._filters.alpha = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (this._alpha * 100) + ")"; // first!
				//all other versions use filter
			} else {
				this._filters.alpha = "alpha(opacity=" + (this._alpha * 100) + ")";
			}
		}

		if (this._mbr) {
			var origin = this._origin.x + "px " + this._origin.y + "px";
			style.transformOrigin = origin;
			style[prefix + "TransformOrigin"] = origin;
			if (Crafty.support.css3dtransform) trans.push("rotateZ(" + this._rotation + "deg)");
			else trans.push("rotate(" + this._rotation + "deg)");
		}

		if (this._flipX) {
			trans.push("scaleX(-1)");
			if (prefix === "ms" && Crafty.support.version < 9) {
				this._filters.flipX = "fliph";
			}
		}

		if (this._flipY) {
			trans.push("scaleY(-1)");
			if (prefix === "ms" && Crafty.support.version < 9) {
				this._filters.flipY = "flipv";
			}
		}

		//apply the filters if IE
		if (prefix === "ms" && Crafty.support.version < 9) {
			this.applyFilters();
		}

		if (this._cssStyles.transform != trans.join(" ")) {
			this._cssStyles.transform = trans.join(" ");
			style.transform = this._cssStyles.transform;
			style[prefix + "Transform"] = this._cssStyles.transform;
		}

		this.trigger("Draw", { style: style, type: "DOM", co: co });

		return this;
	},

	applyFilters: function () {
		this._element.style.filter = "";
		var str = "";

		for (var filter in this._filters) {
			if (!this._filters.hasOwnProperty(filter)) continue;
			str += this._filters[filter] + " ";
		}

		this._element.style.filter = str;
	},

	/**@
	* #.undraw
	* @comp DOM
	* @sign public this .undraw(void)
	* 
	* Removes the element from the stage.
	*/
	undraw: function () {
		if (this._element) {
			Crafty.stage.inner.removeChild(this._element);
		}
		return this;
	},

	/**@
	* #.css
	* @comp DOM
	* @sign public * css(String property, String value)
	* @param property - CSS property to modify
	* @param value - Value to give the CSS property
	* @sign public * css(Object map)
	* @param map - Object where the key is the CSS property and the value is CSS value
	* 
	* Apply CSS styles to the element.
	*
	* Can pass an object where the key is the style property and the value is style value.
	*
	* For setting one style, simply pass the style as the first argument and the value as the second.
	*
	* The notation can be CSS or JS (e.g. `text-align` or `textAlign`).
	*
	* To return a value, pass the property.
	* 
	* @example
	* ~~~
	* this.css({'text-align', 'center', font: 'Arial'});
	* this.css("textAlign", "center");
	* this.css("text-align"); //returns center
	* ~~~
	*/
	css: function (obj, value) {
		var key,
			elem = this._element,
			val,
			style = elem.style;

		//if an object passed
		if (typeof obj === "object") {
			for (key in obj) {
				if (!obj.hasOwnProperty(key)) continue;
				val = obj[key];
				if (typeof val === "number") val += 'px';

				style[Crafty.DOM.camelize(key)] = val;
			}
		} else {
			//if a value is passed, set the property
			if (value) {
				if (typeof value === "number") value += 'px';
				style[Crafty.DOM.camelize(obj)] = value;
			} else { //otherwise return the computed property
				return Crafty.DOM.getStyle(elem, obj);
			}
		}

		this.trigger("Change");

		return this;
	}
});

/**
* Fix IE6 background flickering
*/
try {
	document.execCommand("BackgroundImageCache", false, true);
} catch (e) { }

Crafty.extend({
    /**@
	* #Crafty.DOM
	* @category Graphics
	* 
	* Collection of utilities for using the DOM.
	*/
	DOM: {
	/**@
		* #Crafty.DOM.window
		* @comp Crafty.DOM
		* 
		* Object with `width` and `height` values representing the width
		* and height of the `window`.
		*/
		window: {
			init: function () {
				this.width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth);
				this.height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);
			},

			width: 0,
			height: 0
		},

		/**@
		* #Crafty.DOM.inner
		* @comp Crafty.DOM
		* @sign public Object Crafty.DOM.inner(HTMLElement obj)
		* @param obj - HTML element to calculate the position
		* @returns Object with `x` key being the `x` position, `y` being the `y` position
		* 
		* Find a DOM elements position including
		* padding and border.
		*/
		inner: function (obj) {
			var rect = obj.getBoundingClientRect(),
				x = rect.left + (window.pageXOffset ? window.pageXOffset : document.body.scrollLeft),
				y = rect.top + (window.pageYOffset ? window.pageYOffset : document.body.scrollTop),

			//border left
				borderX = parseInt(this.getStyle(obj, 'border-left-width') || 0, 10) || parseInt(this.getStyle(obj, 'borderLeftWidth') || 0, 10) || 0,
				borderY = parseInt(this.getStyle(obj, 'border-top-width') || 0, 10) || parseInt(this.getStyle(obj, 'borderTopWidth') || 0, 10) || 0;

			x += borderX;
			y += borderY;

			return { x: x, y: y };
		},

		/**@
		* #Crafty.DOM.getStyle
		* @comp Crafty.DOM
		* @sign public Object Crafty.DOM.getStyle(HTMLElement obj, String property)
		* @param obj - HTML element to find the style
		* @param property - Style to return
		* 
		* Determine the value of a style on an HTML element. Notation can be
		* in either CSS or JS.
		*/
		getStyle: function (obj, prop) {
			var result;
			if (obj.currentStyle)
				result = obj.currentStyle[this.camelize(prop)];
			else if (window.getComputedStyle)
				result = document.defaultView.getComputedStyle(obj, null).getPropertyValue(this.csselize(prop));
			return result;
		},

		/**
		* Used in the Zepto framework
		*
		* Converts CSS notation to JS notation
		*/
		camelize: function (str) {
			return str.replace(/-+(.)?/g, function (match, chr){ return chr ? chr.toUpperCase() : '' });
		},

		/**
		* Converts JS notation to CSS notation
		*/
		csselize: function (str) {
			return str.replace(/[A-Z]/g, function (chr){ return chr ? '-' + chr.toLowerCase() : '' });
		},

		/**@
		* #Crafty.DOM.translate
		* @comp Crafty.DOM
		* @sign public Object Crafty.DOM.translate(Number x, Number y)
		* @param x - x position to translate
		* @param y - y position to translate
		* @return Object with x and y as keys and translated values
		*
		* Method will translate x and y positions to positions on the
		* stage. Useful for mouse events with `e.clientX` and `e.clientY`.
		*/
		translate: function (x, y) {
			return {
				x: (x - Crafty.stage.x + document.body.scrollLeft + document.documentElement.scrollLeft - Crafty.viewport._x)/Crafty.viewport._zoom,
				y: (y - Crafty.stage.y + document.body.scrollTop + document.documentElement.scrollTop - Crafty.viewport._y)/Crafty.viewport._zoom
			}
		}
	}
});


  /**@
    * #FPS
    * @category Core
    * @trigger MessureFPS - each second
    * Component to last X FPS Messurements
    * @example
    * 
    * Crafty.e("2D,DOM,FPS,Text").attr({maxValues:10}).bind("MessureFPS",function(fps){
    *   this.text("FPS"+fps.value); //Display Current FPS
    *   console.log(this.values); // Display last x Values
    * })
    */
  Crafty.c("FPS",{
         values:[],
         maxValues:60,
        init:function(){
            this.bind("MessureFPS",function(fps){
                if(this.values.length > this.maxValues) this.values.splice(0,1);
                this.values.push(fps.value);
             });
        }
    });

/**@
* #HTML
* @category Graphics
* Component allow for insertion of arbitrary HTML into an entity
*/
Crafty.c("HTML", {
	inner: '',

	init: function () {
		this.requires('2D, DOM');
	},

	/**@
	* #.replace
	* @comp HTML
	* @sign public this .replace(String html)
	* @param html - arbitrary html
	* 
	* This method will replace the content of this entity with the supplied html
	*
	* @example
	* Create a link
	* ~~~
	* Crafty.e("HTML")
	*    .attr({x:20, y:20, w:100, h:100})
    *    .replace("<a href='http://www.craftyjs.com'>Crafty.js</a>");
	* ~~~
	*/
	replace: function (new_html) {
		this.inner = new_html;
		this._element.innerHTML = new_html;
		return this;
	},

	/**@
	* #.append
	* @comp HTML
	* @sign public this .append(String html)
	* @param html - arbitrary html
	* 
	* This method will add the supplied html in the end of the entity
	*
	* @example
	* Create a link
	* ~~~
	* Crafty.e("HTML")
	*    .attr({x:20, y:20, w:100, h:100})
    *    .append("<a href='http://www.craftyjs.com'>Crafty.js</a>");
	* ~~~
	*/
	append: function (new_html) {
		this.inner += new_html;
		this._element.innerHTML += new_html;
		return this;
	},

	/**@
	* #.prepend
	* @comp HTML
	* @sign public this .prepend(String html)
	* @param html - arbitrary html
	* 
	* This method will add the supplied html in the beginning of the entity
	*
	* @example
	* Create a link
	* ~~~
	* Crafty.e("HTML")
	*    .attr({x:20, y:20, w:100, h:100})
    *    .prepend("<a href='http://www.craftyjs.com'>Crafty.js</a>");
	* ~~~
	*/
	prepend: function (new_html) {
		this.inner = new_html + this.inner;
		this._element.innerHTML = new_html + this.inner;
		return this;
	}
});

/**@
 * #Storage
 * @category Utilities
 * Utility to allow data to be saved to a permanent storage solution: IndexedDB, WebSql, localstorage or cookies
 */
    /**@
	 * #.open
	 * @comp Storage
	 * @sign .open(String gameName)
	 * @param gameName - a machine readable string to uniquely identify your game
	 * 
	 * Opens a connection to the database. If the best they have is localstorage or lower, it does nothing
	 *
	 * @example
	 * Open a database
	 * ~~~
	 * Crafty.storage.open('MyGame');
	 * ~~~
	 */

    /**@
	 * #.save
	 * @comp Storage
	 * @sign .save(String key, String type, Mixed data)
	 * @param key - A unique key for identifying this piece of data
	 * @param type - 'save' or 'cache'
	 * @param data - Some kind of data.
	 * 
	 * Saves a piece of data to the database. Can be anything, although entities are preferred.
	 * For all storage methods but IndexedDB, the data will be serialized as a string
	 * During serialization, an entity's SaveData event will be triggered.
	 * Components should implement a SaveData handler and attach the necessary information to the passed object
	 *
	 * @example
	 * Saves an entity to the database
	 * ~~~
	 * var ent = Crafty.e("2D, DOM")
	 *                     .attr({x: 20, y: 20, w: 100, h:100});
	 * Crafty.storage.open('MyGame');
	 * Crafty.storage.save('MyEntity', 'save', ent);
	 * ~~~
	 */

    /**@
	 * #.load
	 * @comp Storage
	 * @sign .load(String key, String type)
	 * @param key - A unique key to search for
	 * @param type - 'save' or 'cache'
	 * @param callback - Do things with the data you get back
	 * 
	 * Loads a piece of data from the database.
	 * Entities will be reconstructed from the serialized string

	 * @example
	 * Loads an entity from the database
	 * ~~~
	 * Crafty.storage.open('MyGame');
	 * Crafty.storage.load('MyEntity', 'save', function (data) { // do things });
	 * ~~~
	 */

    /**@
	 * #.getAllKeys
	 * @comp Storage
	 * @sign .getAllKeys(String type)
	 * @param type - 'save' or 'cache'
	 * Gets all the keys for a given type

	 * @example
	 * Gets all the save games saved
	 * ~~~
	 * Crafty.storage.open('MyGame');
	 * var saves = Crafty.storage.getAllKeys('save');
	 * ~~~
	 */

    /**@
	 * #.external
	 * @comp Storage
	 * @sign .external(String url)
	 * @param url - URL to an external to save games too
	 * 
	 * Enables and sets the url for saving games to an external server
	 * 
	 * @example
	 * Save an entity to an external server
	 * ~~~
	 * Crafty.storage.external('http://somewhere.com/server.php');
	 * Crafty.storage.open('MyGame');
	 * var ent = Crafty.e('2D, DOM')
	 *                     .attr({x: 20, y: 20, w: 100, h:100});
	 * Crafty.storage.save('save01', 'save', ent);
	 * ~~~
	 */

    /**@
	 * #SaveData event
	 * @comp Storage
	 * @param data - An object containing all of the data to be serialized
	 * @param prepare - The function to prepare an entity for serialization
	 * 
	 * Any data a component wants to save when it's serialized should be added to this object.
	 * Straight attribute should be set in data.attr.
	 * Anything that requires a special handler should be set in a unique property.
	 *
	 * @example
	 * Saves the innerHTML of an entity
	 * ~~~
	 * Crafty.e("2D DOM").bind("SaveData", function (data, prepare) {
	 *     data.attr.x = this.x;
	 *     data.attr.y = this.y;
	 *     data.dom = this.element.innerHTML;
	 * });
	 * ~~~
	 */

    /**@
	 * #LoadData event
	 * @param data - An object containing all the data that been saved
	 * @param process - The function to turn a string into an entity
	 * 
	 * Handlers for processing any data that needs more than straight assignment
	 *
	 * Note that data stored in the .attr object is automatically added to the entity.
	 * It does not need to be handled here
	 *
	 * @example
	 * ~~~
	 * Sets the innerHTML from a saved entity
	 * Crafty.e("2D DOM").bind("LoadData", function (data, process) {
	 *     this.element.innerHTML = data.dom;
	 * });
	 * ~~~
	 */

Crafty.storage = (function () {
	var db = null, url, gameName, timestamps = {}, 
		transactionType = { READ: "readonly", READ_WRITE: "readwrite" };

	/*
	 * Processes a retrieved object.
	 * Creates an entity if it is one
	 */
	function process(obj) {
		if (obj.c) {
			var d = Crafty.e(obj.c)
						.attr(obj.attr)
						.trigger('LoadData', obj, process);
			return d;
		}
		else if (typeof obj == 'object') {
			for (var prop in obj) {
				obj[prop] = process(obj[prop]);
			}
		}
		return obj;
	}

	function unserialize(str) {
		if (typeof str != 'string') return null;
		var data = (JSON ? JSON.parse(str) : eval('(' + str + ')'));
		return process(data);
	}

	/* recursive function
	 * searches for entities in an object and processes them for serialization
	 */
	function prep(obj) {
		if (obj.__c) {
			// object is entity
			var data = { c: [], attr: {} };
			obj.trigger("SaveData", data, prep);
			for (var i in obj.__c) {
				data.c.push(i);
			}
			data.c = data.c.join(', ');
			obj = data;
		}
		else if (typeof obj == 'object') {
			// recurse and look for entities
			for (var prop in obj) {
				obj[prop] = prep(obj[prop]);
			}
		}
		return obj;
	}

	function serialize(e) {
		if (JSON) {
			var data = prep(e);
			return JSON.stringify(data);
		}
		else {
			alert("Crafty does not support saving on your browser. Please upgrade to a newer browser.");
			return false;
		}
	}

	// for saving a game to a central server
	function external(setUrl) {
		url = setUrl;
	}

	function openExternal() {
		if (1 && typeof url == "undefined") return;
		// get the timestamps for external saves and compare them to local
		// if the external is newer, load it

		var xml = new XMLHttpRequest();
		xhr.open("POST", url);
		xhr.onreadystatechange = function (evt) {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var data = eval("(" + xhr.responseText + ")");
					for (var i in data) {
						if (Crafty.storage.check(data[i].key, data[i].timestamp)) {
							loadExternal(data[i].key);
						}
					}
				}
			}
		}
		xhr.send("mode=timestamps&game=" + gameName);
	}

	function saveExternal(key, data, ts) {
		if (1 && typeof url == "undefined") return;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url);
		xhr.send("mode=save&key=" + key + "&data=" + encodeURIComponent(data) + "&ts=" + ts + "&game=" + gameName);
	}

	function loadExternal(key) {
		if (1 && typeof url == "undefined") return;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url);
		xhr.onreadystatechange = function (evt) {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var data = eval("(" + xhr.responseText + ")");
					Crafty.storage.save(key, 'save', data);
				}
			}
		}
		xhr.send("mode=load&key=" + key + "&game=" + gameName);
	}

	/**
	 * get timestamp
	 */
	function ts() {
		var d = new Date();
		return d.getTime();
	}

	// everyone names their object different. Fix that nonsense.
	if (typeof indexedDB != 'object') {
		window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
		
		/* Numeric constants for transaction type are deprecated
		 * Ensure that the script will work consistenly for recent and legacy browser versions
		 */
		if (typeof IDBTransaction == 'object') {
			transactionType.READ = IDBTransaction.READ || IDBTransaction.readonly || transactionType.READ;
			transactionType.READ_WRITE = IDBTransaction.READ_WRITE || IDBTransaction.readwrite || transactionType.READ_WRITE;
		}
	}

	if (typeof indexedDB == 'object') {

		return {
			open: function (gameName_n) {
				gameName = gameName_n;
				var stores = [];

				if (arguments.length == 1) {
					stores.push('save');
					stores.push('cache');
				}
				else {
					stores = arguments;
					stores.shift();
					stores.push('save');
					stores.push('cache');
				}
				if (db == null) {
					var request = indexedDB.open(gameName);
					request.onsuccess = function (e) {
						db = e.target.result;
						createStores();
						getTimestamps();
						openExternal();
					};
				}
				else {
					createStores();
					getTimestamps();
					openExternal();
				}

				// get all the timestamps for existing keys
				function getTimestamps() {
					try {
						var trans = db.transaction(['save'], transactionType.READ),
						store = trans.objectStore('save'),
						request = store.getAll();
						request.onsuccess = function (e) {
							var i = 0, a = event.target.result, l = a.length;
							for (; i < l; i++) {
								timestamps[a[i].key] = a[i].timestamp;
							}
						};
					}
					catch (e) {
					}
				}

				function createStores() {
					var request = db.setVersion("1.0");
					request.onsuccess = function (e) {
						for (var i = 0; i < stores.length; i++) {
							var st = stores[i];
							if (db.objectStoreNames.contains(st)) continue;
							db.createObjectStore(st, { keyPath: "key" });
						}
					};
				}
			},

			save: function (key, type, data) {
				if (db == null) {
					setTimeout(function () { Crafty.storage.save(key, type, data); }, 1);
					return;
				}

				var str = serialize(data), t = ts();
				if (type == 'save')	saveExternal(key, str, t);
				try {
					var trans = db.transaction([type], transactionType.READ_WRITE),
					store = trans.objectStore(type),
					request = store.put({
						"data": str,
						"timestamp": t,
						"key": key
					});
				}
				catch (e) {
					console.error(e);
				}
			},

			load: function (key, type, callback) {
				if (db == null) {
					setTimeout(function () { Crafty.storage.load(key, type, callback); }, 1);
					return;
				}
				try {
					var trans = db.transaction([type], transactionType.READ),
					store = trans.objectStore(type),
					request = store.get(key);
					request.onsuccess = function (e) {
						callback(unserialize(e.target.result.data));
					};
				}
				catch (e) {
					console.error(e);
				}
			},

			getAllKeys: function (type, callback) {
				if (db == null) {
					setTimeout(function () { Crafty.storage.getAllkeys(type, callback); }, 1);
				}
				try {
					var trans = db.transaction([type], transactionType.READ),
					store = trans.objectStore(type),
					request = store.getCursor(),
					res = [];
					request.onsuccess = function (e) {
						var cursor = e.target.result;
						if (cursor) {
							res.push(cursor.key);
							// 'continue' is a reserved word, so .continue() causes IE8 to completely bark with "SCRIPT1010: Expected identifier".
							cursor['continue']();
						}
						else {
							callback(res);
						}
					};
				}
				catch (e) {
					console.error(e);
				}
			},

			check: function (key, timestamp) {
				return (timestamps[key] > timestamp);
			},

			external: external
		};
	}
	else if (typeof openDatabase == 'function') {
		return {
			open: function (gameName_n) {
				gameName = gameName_n;
				if (arguments.length == 1) {
					db = {
						save: openDatabase(gameName_n + '_save', '1.0', 'Saves games for ' + gameName_n, 5 * 1024 * 1024),
						cache: openDatabase(gameName_n + '_cache', '1.0', 'Cache for ' + gameName_n, 5 * 1024 * 1024)
					}
				}
				else {
					// allows for any other types that can be thought of
					var args = arguments, i = 0;
					args.shift();
					for (; i < args.length; i++) {
						if (typeof db[args[i]] == 'undefined')
							db[args[i]] = openDatabase(gameName + '_' + args[i], '1.0', type, 5 * 1024 * 1024);
					}
				}

				db['save'].transaction(function (tx) {
					tx.executeSql('SELECT key, timestamp FROM data', [], function (tx, res) {
						var i = 0, a = res.rows, l = a.length;
						for (; i < l; i++) {
							timestamps[a.item(i).key] = a.item(i).timestamp;
						}
					});
				});
			},

			save: function (key, type, data) {
				if (typeof db[type] == 'undefined' && gameName != '') {
					this.open(gameName, type);
				}

				var str = serialize(data), t = ts();
				if (type == 'save')	saveExternal(key, str, t);
				db[type].transaction(function (tx) {
					tx.executeSql('CREATE TABLE IF NOT EXISTS data (key unique, text, timestamp)');
					tx.executeSql('SELECT * FROM data WHERE key = ?', [key], function (tx, results) {
						if (results.rows.length) {
							tx.executeSql('UPDATE data SET text = ?, timestamp = ? WHERE key = ?', [str, t, key]);
						}
						else {
							tx.executeSql('INSERT INTO data VALUES (?, ?, ?)', [key, str, t]);
						}
					});
				});
			},

			load: function (key, type, callback) {
				if (db[type] == null) {
					setTimeout(function () { Crafty.storage.load(key, type, callback); }, 1);
					return;
				}
				db[type].transaction(function (tx) {
					tx.executeSql('SELECT text FROM data WHERE key = ?', [key], function (tx, results) {
						if (results.rows.length) {
							res = unserialize(results.rows.item(0).text);
							callback(res);
						}
					});
				});
			},

			getAllKeys: function (type, callback) {
				if (db[type] == null) {
					setTimeout(function () { Crafty.storage.getAllKeys(type, callback); }, 1);
					return;
				}
				db[type].transaction(function (tx) {
					tx.executeSql('SELECT key FROM data', [], function (tx, results) {
						callback(results.rows);
					});
				});
			},

			check: function (key, timestamp) {
				return (timestamps[key] > timestamp);
			},

			external: external
		};
	}
	else if (typeof window.localStorage == 'object') {
		return {
			open: function (gameName_n) {
				gameName = gameName_n;
			},

			save: function (key, type, data) {
				var k = gameName + '.' + type + '.' + key,
					str = serialize(data),
					t = ts();
				if (type == 'save')	saveExternal(key, str, t);
				window.localStorage[k] = str;
				if (type == 'save')
					window.localStorage[k + '.ts'] = t;
			},

			load: function (key, type, callback) {
				var k = gameName + '.' + type + '.' + key,
					str = window.localStorage[k];

				callback(unserialize(str));
			},

			getAllKeys: function (type, callback) {
				var res = {}, output = [], header = gameName + '.' + type;
				for (var i in window.localStorage) {
					if (i.indexOf(header) != -1) {
						var key = i.replace(header, '').replace('.ts', '');
						res[key] = true;
					}
				}
				for (i in res) {
					output.push(i);
				}
				callback(output);
			},

			check: function (key, timestamp) {
				var ts = window.localStorage[gameName + '.save.' + key + '.ts'];

				return (parseInt(timestamp) > parseInt(ts));
			},

			external: external
		};
	}
	else {
		// default fallback to cookies
		return {
			open: function (gameName_n) {
				gameName = gameName_n;
			},

			save: function (key, type, data) {
				// cookies are very limited in space. we can only keep saves there
				if (type != 'save') return;
				var str = serialize(data), t = ts();
				if (type == 'save')	saveExternal(key, str, t);
				document.cookie = gameName + '_' + key + '=' + str + '; ' + gameName + '_' + key + '_ts=' + t + '; expires=Thur, 31 Dec 2099 23:59:59 UTC; path=/';
			},

			load: function (key, type, callback) {
				if (type != 'save') return;
				var reg = new RegExp(gameName + '_' + key + '=[^;]*'),
					result = reg.exec(document.cookie),
					data = unserialize(result[0].replace(gameName + '_' + key + '=', ''));

				callback(data);
			},

			getAllKeys: function (type, callback) {
				if (type != 'save') return;
				var reg = new RegExp(gameName + '_[^_=]', 'g'),
					matches = reg.exec(document.cookie),
					i = 0, l = matches.length, res = {}, output = [];
				for (; i < l; i++) {
					var key = matches[i].replace(gameName + '_', '');
					res[key] = true;
				}
				for (i in res) {
					output.push(i);
				}
				callback(output);
			},

			check: function (key, timestamp) {
				var header = gameName + '_' + key + '_ts',
					reg = new RegExp(header + '=[^;]'),
					result = reg.exec(document.cookie),
					ts = result[0].replace(header + '=', '');

				return (parseInt(timestamp) > parseInt(ts));
			},

			external: external
		};
	}
	/* template
	return {
		open: function (gameName) {
		},
		save: function (key, type, data) {
		},
		load: function (key, type, callback) {
		},
	}*/
})();

/**@
* #Crafty.support
* @category Misc, Core
* Determines feature support for what Crafty can do.
*/

(function testSupport() {
    var support = Crafty.support = {},
        ua = navigator.userAgent.toLowerCase(),
        match = /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(o)pera(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
                /(ms)ie ([\w.]+)/.exec(ua) ||
                /(moz)illa(?:.*? rv:([\w.]+))?/.exec(ua) || [],
        mobile = /iPad|iPod|iPhone|Android|webOS|IEMobile/i.exec(ua);

    /**@
    * #Crafty.mobile
    * @comp Crafty.device
    * 
    * Determines if Crafty is running on mobile device.
    * 
    * If Crafty.mobile is equal true Crafty does some things under hood:
    * ~~~
    * - set viewport on max device width and height
    * - set Crafty.stage.fullscreen on true
    * - hide window scrollbars
    * ~~~
    * 
    * @see Crafty.viewport
    */
    if (mobile) Crafty.mobile = mobile[0];

    /**@
    * #Crafty.support.setter
    * @comp Crafty.support
    * Is `__defineSetter__` supported?
    */
    support.setter = ('__defineSetter__' in this && '__defineGetter__' in this);

    /**@
    * #Crafty.support.defineProperty
    * @comp Crafty.support
    * Is `Object.defineProperty` supported?
    */
    support.defineProperty = (function () {
        if (!'defineProperty' in Object) return false;
        try { Object.defineProperty({}, 'x', {}); }
        catch (e) { return false };
        return true;
    })();

    /**@
    * #Crafty.support.audio
    * @comp Crafty.support
    * Is HTML5 `Audio` supported?
    */
    support.audio = ('Audio' in window);

    /**@
    * #Crafty.support.prefix
    * @comp Crafty.support
    * Returns the browser specific prefix (`Moz`, `O`, `ms`, `webkit`).
    */
    support.prefix = (match[1] || match[0]);

    //browser specific quirks
    if (support.prefix === "moz") support.prefix = "Moz";
    if (support.prefix === "o") support.prefix = "O";

    if (match[2]) {
        /**@
        * #Crafty.support.versionName
        * @comp Crafty.support
        * Version of the browser
        */
        support.versionName = match[2];

        /**@
        * #Crafty.support.version
        * @comp Crafty.support
        * Version number of the browser as an Integer (first number)
        */
        support.version = +(match[2].split("."))[0];
    }

    /**@
    * #Crafty.support.canvas
    * @comp Crafty.support
    * Is the `canvas` element supported?
    */
    support.canvas = ('getContext' in document.createElement("canvas"));

    /**@
    * #Crafty.support.webgl
    * @comp Crafty.support
    * Is WebGL supported on the canvas element?
    */
    if (support.canvas) {
        var gl;
        try {
            gl = document.createElement("canvas").getContext("experimental-webgl");
            gl.viewportWidth = support.canvas.width;
            gl.viewportHeight = support.canvas.height;
        }
        catch (e) { }
        support.webgl = !!gl;
    }
    else {
        support.webgl = false;
    }

    /**@
    * #Crafty.support.css3dtransform
    * @comp Crafty.support
    * Is css3Dtransform supported by browser.
    */
    support.css3dtransform = (typeof document.createElement("div").style["Perspective"] !== "undefined")
                            || (typeof document.createElement("div").style[support.prefix + "Perspective"] !== "undefined");

    /**@
    * #Crafty.support.deviceorientation
    * @comp Crafty.support
    * Is deviceorientation event supported by browser.
    */
    support.deviceorientation = (typeof window.DeviceOrientationEvent !== "undefined") || (typeof window.OrientationEvent !== "undefined");

    /**@
    * #Crafty.support.devicemotion
    * @comp Crafty.support
    * Is devicemotion event supported by browser.
    */
    support.devicemotion = (typeof window.DeviceMotionEvent !== "undefined");

})();
Crafty.extend({

    zeroFill: function (number, width) {
        width -= number.toString().length;
        if (width > 0)
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        return number.toString();
    },

    /**@
    * #Crafty.sprite
    * @category Graphics
    * @sign public this Crafty.sprite([Number tile], String url, Object map[, Number paddingX[, Number paddingY]])
    * @param tile - Tile size of the sprite map, defaults to 1
    * @param url - URL of the sprite image
    * @param map - Object where the key is what becomes a new component and the value points to a position on the sprite map
    * @param paddingX - Horizontal space in between tiles. Defaults to 0.
    * @param paddingY - Vertical space in between tiles. Defaults to paddingX.
    * Generates components based on positions in a sprite image to be applied to entities.
    *
    * Accepts a tile size, URL and map for the name of the sprite and it's position.
    *
    * The position must be an array containing the position of the sprite where index `0`
    * is the `x` position, `1` is the `y` position and optionally `2` is the width and `3`
    * is the height. If the sprite map has padding, pass the values for the `x` padding
    * or `y` padding. If they are the same, just add one value.
    *
    * If the sprite image has no consistent tile size, `1` or no argument need be
    * passed for tile size.
    *
    * Entities that add the generated components are also given a component called `Sprite`.
    * 
    * @see Sprite
    */
    sprite: function (tile, tileh, url, map, paddingX, paddingY) {
        var spriteName, temp, x, y, w, h, img;

        //if no tile value, default to 1
        if (typeof tile === "string") {
            paddingY = paddingX;
            paddingX = map;
            map = tileh;
            url = tile;
            tile = 1;
            tileh = 1;
        }

        if (typeof tileh == "string") {
            paddingY = paddingX;
            paddingX = map;
            map = url;
            url = tileh;
            tileh = tile;
        }

        //if no paddingY, use paddingX
        if (!paddingY && paddingX) paddingY = paddingX;
        paddingX = parseInt(paddingX || 0, 10); //just incase
        paddingY = parseInt(paddingY || 0, 10);

        img = Crafty.asset(url);
        if (!img) {
            img = new Image();
            img.src = url;
            Crafty.asset(url, img);
            img.onload = function () {
                //all components with this img are now ready
                for (spriteName in map) {
                    Crafty(spriteName).each(function () {
                        this.ready = true;
                        this.trigger("Change");
                    });
                }
            };
        }

        for (spriteName in map) {
            if (!map.hasOwnProperty(spriteName)) continue;

            temp = map[spriteName];
            x = temp[0] * (tile + paddingX);
            y = temp[1] * (tileh + paddingY);
            w = temp[2] * tile || tile;
            h = temp[3] * tileh || tileh;

            //generates sprite components for each tile in the map
            Crafty.c(spriteName, {
                ready: false,
                __coord: [x, y, w, h],

                init: function () {
                    this.requires("Sprite");
                    this.__trim = [0, 0, 0, 0];
                    this.__image = url;
                    this.__coord = [this.__coord[0], this.__coord[1], this.__coord[2], this.__coord[3]];
                    this.__tile = tile;
                    this.__tileh = tileh;
                    this.__padding = [paddingX, paddingY];
                    this.img = img;

                    //draw now
                    if (this.img.complete && this.img.width > 0) {
                        this.ready = true;
                        this.trigger("Change");
                    }

                    //set the width and height to the sprite size
                    this.w = this.__coord[2];
                    this.h = this.__coord[3];
                }
            });
        }

        return this;
    },

    _events: {},

    /**@
    * #Crafty.addEvent
    * @category Events, Misc
    * @sign public this Crafty.addEvent(Object ctx, HTMLElement obj, String event, Function callback)
    * @param ctx - Context of the callback or the value of `this`
    * @param obj - Element to add the DOM event to
    * @param event - Event name to bind to
    * @param callback - Method to execute when triggered
    * 
    * Adds DOM level 3 events to elements. The arguments it accepts are the call
    * context (the value of `this`), the DOM element to attach the event to,
    * the event name (without `on` (`click` rather than `onclick`)) and
    * finally the callback method.
    *
    * If no element is passed, the default element will be `window.document`.
    *
    * Callbacks are passed with event data.
    * 
    * @see Crafty.removeEvent
    */
    addEvent: function (ctx, obj, type, callback) {
        if (arguments.length === 3) {
            callback = type;
            type = obj;
            obj = window.document;
        }

        //save anonymous function to be able to remove
        var afn = function (e) { 
                var e = e || window.event; 

                if (typeof callback === 'function') {
                    callback.call(ctx, e);
                }
            },
            id = ctx[0] || "";

        if (!this._events[id + obj + type + callback]) this._events[id + obj + type + callback] = afn;
        else return;

        if (obj.attachEvent) { //IE
            obj.attachEvent('on' + type, afn);
        } else { //Everyone else
            obj.addEventListener(type, afn, false);
        }
    },

    /**@
    * #Crafty.removeEvent
    * @category Events, Misc
    * @sign public this Crafty.removeEvent(Object ctx, HTMLElement obj, String event, Function callback)
    * @param ctx - Context of the callback or the value of `this`
    * @param obj - Element the event is on
    * @param event - Name of the event
    * @param callback - Method executed when triggered
    * 
    * Removes events attached by `Crafty.addEvent()`. All parameters must
    * be the same that were used to attach the event including a reference
    * to the callback method.
    * 
    * @see Crafty.addEvent
    */
    removeEvent: function (ctx, obj, type, callback) {
        if (arguments.length === 3) {
            callback = type;
            type = obj;
            obj = window.document;
        }

        //retrieve anonymous function
        var id = ctx[0] || "",
            afn = this._events[id + obj + type + callback];

        if (afn) {
            if (obj.detachEvent) {
                obj.detachEvent('on' + type, afn);
            } else obj.removeEventListener(type, afn, false);
            delete this._events[id + obj + type + callback];
        }
    },

    /**@
    * #Crafty.background
    * @category Graphics, Stage
    * @sign public void Crafty.background(String value)
    * @param style - Modify the background with a color or image
    * 
    * This method is essentially a shortcut for adding a background
    * style to the stage element.
    */
    background: function (style) {
        Crafty.stage.elem.style.background = style;
    },

    /**@
    * #Crafty.viewport
    * @category Stage
    * 
    * Viewport is essentially a 2D camera looking at the stage. Can be moved which
    * in turn will react just like a camera moving in that direction.
    */
    viewport: {
    /**@
        * #Crafty.viewport.clampToEntities
        * @comp Crafty.viewport
        * 
        * Decides if the viewport functions should clamp to game entities.
        * When set to `true` functions such as Crafty.viewport.mouselook() will not allow you to move the
        * viewport over areas of the game that has no entities.
        * For development it can be useful to set this to false.
        */
        clampToEntities: true,
        width: 0,
        height: 0,
        /**@
        * #Crafty.viewport.x
        * @comp Crafty.viewport
        * 
        * Will move the stage and therefore every visible entity along the `x`
        * axis in the opposite direction.
        *
        * When this value is set, it will shift the entire stage. This means that entity
        * positions are not exactly where they are on screen. To get the exact position,
        * simply add `Crafty.viewport.x` onto the entities `x` position.
        */
        _x: 0,
        /**@
        * #Crafty.viewport.y
        * @comp Crafty.viewport
        * 
        * Will move the stage and therefore every visible entity along the `y`
        * axis in the opposite direction.
        *
        * When this value is set, it will shift the entire stage. This means that entity
        * positions are not exactly where they are on screen. To get the exact position,
        * simply add `Crafty.viewport.y` onto the entities `y` position.
        */
        _y: 0,
		
		/**@
         * #Crafty.viewport.bounds
         * @comp Crafty.viewport
         *
		 * A rectangle which defines the bounds of the viewport. If this 
		 * variable is null, Crafty uses the bounding box of all the items
		 * on the stage.
         */
        bounds:null,

        /**@
         * #Crafty.viewport.scroll
         * @comp Crafty.viewport
         * @sign Crafty.viewport.scroll(String axis, Number v)
         * @param axis - 'x' or 'y'
         * @param v - The new absolute position on the axis
         *
         * Will move the viewport to the position given on the specified axis
         * 
         * @example 
         * Will move the camera 500 pixels right of its initial position, in effect
         * shifting everything in the viewport 500 pixels to the left.
         * 
         * ~~~
         * Crafty.viewport.scroll('_x', 500);
         * ~~~
         */
        scroll: function (axis, v) {
            v = Math.floor(v);
            var change = v - this[axis], //change in direction
                context = Crafty.canvas.context,
                style = Crafty.stage.inner.style,
                canvas;

            //update viewport and DOM scroll
            this[axis] = v;
			if (context) {
				if (axis == '_x') {
					context.translate(change, 0);
				} else {
					context.translate(0, change);
				}
				Crafty.DrawManager.drawAll();
			}
            style[axis == '_x' ? "left" : "top"] = v + "px";
        },

        rect: function () {
            return { _x: -this._x, _y: -this._y, _w: this.width, _h: this.height };
        },

        /**@
         * #Crafty.viewport.pan
         * @comp Crafty.viewport
         * @sign public void Crafty.viewport.pan(String axis, Number v, Number time)
         * @param String axis - 'x' or 'y'. The axis to move the camera on
         * @param Number v - the distance to move the camera by
         * @param Number time - The duration in frames for the entire camera movement
         *
         * Pans the camera a given number of pixels over a given number of frames
         */
        pan: (function () {
            var tweens = {}, i, bound = false;

            function enterFrame(e) {
                var l = 0;
                for (i in tweens) {
                    var prop = tweens[i];
                    if (prop.remTime > 0) {
                        prop.current += prop.diff;
                        prop.remTime--;
                        Crafty.viewport[i] = Math.floor(prop.current);
                        l++;
                    }
                    else {
                        delete tweens[i];
                    }
                }
                if (l) Crafty.viewport._clamp();
            }

            return function (axis, v, time) {
                Crafty.viewport.follow();
                if (axis == 'reset') {
                    for (i in tweens) {
                        tweens[i].remTime = 0;
                    }
                    return;
                }
                if (time == 0) time = 1;
                tweens[axis] = {
                    diff: -v / time,
                    current: Crafty.viewport[axis],
                    remTime: time
                };
                if (!bound) {
                    Crafty.bind("EnterFrame", enterFrame);
                    bound = true;
                }
            }
        })(),

        /**@
         * #Crafty.viewport.follow
         * @comp Crafty.viewport
         * @sign public void Crafty.viewport.follow(Object target, Number offsetx, Number offsety)
         * @param Object target - An entity with the 2D component
         * @param Number offsetx - Follow target should be offsetx pixels away from center
         * @param Number offsety - Positive puts target to the right of center
         *
         * Follows a given entity with the 2D component. If following target will take a portion of
         * the viewport out of bounds of the world, following will stop until the target moves away.
         * 
         * @example
         * ~~~
         * var ent = Crafty.e('2D, DOM').attr({w: 100, h: 100:});
         * Crafty.viewport.follow(ent, 0, 0);
         * ~~~
         */
        follow: (function () {
            var oldTarget, offx, offy;

            function change() {
                Crafty.viewport.scroll('_x', -(this.x + (this.w / 2) - (Crafty.viewport.width / 2) - offx));
                Crafty.viewport.scroll('_y', -(this.y + (this.h / 2) - (Crafty.viewport.height / 2) - offy));
                Crafty.viewport._clamp();
            }

            return function (target, offsetx, offsety) {
                if (oldTarget)
                    oldTarget.unbind('Change', change);
                if (!target || !target.has('2D'))
                    return;
                Crafty.viewport.pan('reset');

                oldTarget = target;
                offx = (typeof offsetx != 'undefined') ? offsetx : 0;
                offy = (typeof offsety != 'undefined') ? offsety : 0;

                target.bind('Change', change);
                change.call(target);
            }
        })(),

        /**@
         * #Crafty.viewport.centerOn
         * @comp Crafty.viewport
         * @sign public void Crafty.viewport.centerOn(Object target, Number time)
         * @param Object target - An entity with the 2D component
         * @param Number time - The number of frames to perform the centering over
         *
         * Centers the viewport on the given entity
         */
        centerOn: function (targ, time) {
            var x = targ.x,
                    y = targ.y,
                    mid_x = targ.w / 2,
                    mid_y = targ.h / 2,
                    cent_x = Crafty.viewport.width / 2,
                    cent_y = Crafty.viewport.height / 2,
                    new_x = x + mid_x - cent_x,
                    new_y = y + mid_y - cent_y;

            Crafty.viewport.pan('reset');
            Crafty.viewport.pan('x', new_x, time);
            Crafty.viewport.pan('y', new_y, time);
        },
        /**@
        * #Crafty.viewport._zoom
        * @comp Crafty.viewport
        * 
        * This value keeps an amount of viewport zoom, required for calculating mouse position at entity
        */
        _zoom : 1,

        /**@
         * #Crafty.viewport.zoom
         * @comp Crafty.viewport
         * @sign public void Crafty.viewport.zoom(Number amt, Number cent_x, Number cent_y, Number time)
         * @param Number amt - amount to zoom in on the target by (eg. 2, 4, 0.5)
         * @param Number cent_x - the center to zoom on
         * @param Number cent_y - the center to zoom on
         * @param Number time - the duration in frames of the entire zoom operation
         *
         * Zooms the camera in on a given point. amt > 1 will bring the camera closer to the subject
         * amt < 1 will bring it farther away. amt = 0 will do nothing.
         * Zooming is multiplicative. To reset the zoom amount, pass 0.
         */
        zoom: (function () {
            var zoom = 1,
                zoom_tick = 0,
                dur = 0,
                prop = Crafty.support.prefix + "Transform",
                bound = false,
                act = {},
                prct = {};
            // what's going on:
            // 1. Get the original point as a percentage of the stage
            // 2. Scale the stage
            // 3. Get the new size of the stage
            // 4. Get the absolute position of our point using previous percentage
            // 4. Offset inner by that much

            function enterFrame() {
                if (dur > 0) {
					if (isFinite(Crafty.viewport._zoom)) zoom = Crafty.viewport._zoom;
                    var old = {
                        width: act.width * zoom,
                        height: act.height * zoom
                    };
                    zoom += zoom_tick;
                    Crafty.viewport._zoom = zoom;
                    var new_s = {
                        width: act.width * zoom,
                        height: act.height * zoom
                    },
                    diff = {
                        width: new_s.width - old.width,
                        height: new_s.height - old.height
                    };
                    Crafty.stage.inner.style[prop] = 'scale(' + zoom + ',' + zoom + ')';
                    if (Crafty.canvas._canvas) {
						var czoom = zoom / (zoom - zoom_tick);
						Crafty.canvas.context.scale(czoom, czoom);
                        Crafty.DrawManager.drawAll();
                    }
                    Crafty.viewport.x -= diff.width * prct.width;
                    Crafty.viewport.y -= diff.height * prct.height;
                    dur--;
                }
            }

            return function (amt, cent_x, cent_y, time) {
                var bounds = this.bounds || Crafty.map.boundaries(),
                    final_zoom = amt ? zoom * amt : 1;
				if (!amt) {	// we're resetting to defaults
					zoom = 1;
					this._zoom = 1;
				}

                act.width = bounds.max.x - bounds.min.x;
                act.height = bounds.max.y - bounds.min.y;

                prct.width = cent_x / act.width;
                prct.height = cent_y / act.height;

                if (time == 0) time = 1;
                zoom_tick = (final_zoom - zoom) / time;
                dur = time;

                Crafty.viewport.pan('reset');
                if (!bound) {
                    Crafty.bind('EnterFrame', enterFrame);
                    bound = true;
                }
            }
        })(),
        /**@
         * #Crafty.viewport.scale
         * @comp Crafty.viewport
         * @sign public void Crafty.viewport.scale(Number amt)
         * @param Number amt - amount to zoom/scale in on the element on the viewport by (eg. 2, 4, 0.5)
         *
         * Zooms/scale the camera. amt > 1 increase all entities on stage 
         * amt < 1 will reduce all entities on stage. amt = 0 will reset the zoom/scale.
         * Zooming/scaling is multiplicative. To reset the zoom/scale amount, pass 0.
         *
         * @example
         * ~~~
         * Crafty.viewport.scale(2); //to see effect add some entities on stage.
         * ~~~
         */
        scale: (function () {
            var prop = Crafty.support.prefix + "Transform",
                act = {};
            return function (amt) {
                var bounds = this.bounds || Crafty.map.boundaries(),
                    final_zoom = amt ? this._zoom * amt : 1,
					czoom = final_zoom / this._zoom;

                this._zoom = final_zoom;
                act.width = bounds.max.x - bounds.min.x;
                act.height = bounds.max.y - bounds.min.y;
                var new_s = {
                    width: act.width * final_zoom,
                    height: act.height * final_zoom
                }
                Crafty.viewport.pan('reset');
                Crafty.stage.inner.style['transform'] = 
				Crafty.stage.inner.style[prop] = 'scale(' + this._zoom + ',' + this._zoom + ')';

                if (Crafty.canvas._canvas) {
                    Crafty.canvas.context.scale(czoom, czoom);
                    Crafty.DrawManager.drawAll();
                }
                //Crafty.viewport.width = new_s.width;
                //Crafty.viewport.height = new_s.height;
            }
        })(),
        /**@
         * #Crafty.viewport.mouselook
         * @comp Crafty.viewport
         * @sign public void Crafty.viewport.mouselook(Boolean active)
         * @param Boolean active - Activate or deactivate mouselook
         *
         * Toggle mouselook on the current viewport.
         * Simply call this function and the user will be able to
         * drag the viewport around.
         */
        mouselook: (function () {
            var active = false,
                dragging = false,
                lastMouse = {}
            old = {};


            return function (op, arg) {
                if (typeof op == 'boolean') {
                    active = op;
                    if (active) {
                        Crafty.mouseObjs++;
                    }
                    else {
                        Crafty.mouseObjs = Math.max(0, Crafty.mouseObjs - 1);
                    }
                    return;
                }
                if (!active) return;
                switch (op) {
                    case 'move':
                    case 'drag':
                        if (!dragging) return;
                        diff = {
                            x: arg.clientX - lastMouse.x,
                            y: arg.clientY - lastMouse.y
                        };

                        Crafty.viewport.x += diff.x;
                        Crafty.viewport.y += diff.y;
                        Crafty.viewport._clamp(); 
                    case 'start':
                        lastMouse.x = arg.clientX;
                        lastMouse.y = arg.clientY;
                        dragging = true;
                        break;
                    case 'stop':
                        dragging = false;
                        break;
                }
            };
        })(),
        _clamp: function () {
            // clamps the viewport to the viewable area
            // under no circumstances should the viewport see something outside the boundary of the 'world'
            if (!this.clampToEntities) return;
            var bound = this.bounds || Crafty.map.boundaries();
			bound.max.x *= this._zoom;
			bound.min.x *= this._zoom;
			bound.max.y *= this._zoom;
			bound.min.y *= this._zoom;
            if (bound.max.x - bound.min.x > Crafty.viewport.width) {
                bound.max.x -= Crafty.viewport.width;

                if (Crafty.viewport.x < -bound.max.x) {
                    Crafty.viewport.x = -bound.max.x;
                }
                else if (Crafty.viewport.x > -bound.min.x) {
                    Crafty.viewport.x = -bound.min.x;
                }
            }
            else {
                Crafty.viewport.x = -1 * (bound.min.x + (bound.max.x - bound.min.x) / 2 - Crafty.viewport.width / 2);
            }
            if (bound.max.y - bound.min.y > Crafty.viewport.height) {
                bound.max.y -= Crafty.viewport.height;

                if (Crafty.viewport.y < -bound.max.y) {
                    Crafty.viewport.y = -bound.max.y;
                }
                else if (Crafty.viewport.y > -bound.min.y) {
                    Crafty.viewport.y = -bound.min.y;
                }
            }
            else {
                Crafty.viewport.y = -1 * (bound.min.y + (bound.max.y - bound.min.y) / 2 - Crafty.viewport.height / 2);
            }
        },

        /**@
         * #Crafty.viewport.init
         * @comp Crafty.viewport
         * @sign public void Crafty.viewport.init([Number width, Number height])
         * @param width - Width of the viewport
         * @param height - Height of the viewport
         *
         * Initialize the viewport. If the arguments 'width' or 'height' are missing, or Crafty.mobile is true, use Crafty.DOM.window.width and Crafty.DOM.window.height (full screen model).
         * Create a div with id `cr-stage`, if there is not already an HTMLElement with id `cr-stage` (by `Crafty.viewport.init`).
         *
         * @see Crafty.device, Crafty.DOM, Crafty.stage
         */
        init: function (w, h) {
            Crafty.DOM.window.init();

            //fullscreen if mobile or not specified
            this.width = (!w || Crafty.mobile) ? Crafty.DOM.window.width : w;
            this.height = (!h || Crafty.mobile) ? Crafty.DOM.window.height : h;

            //check if stage exists
            var crstage = document.getElementById("cr-stage");

            /**@
             * #Crafty.stage
             * @category Core
             * The stage where all the DOM entities will be placed.
             */

            /**@
             * #Crafty.stage.elem
             * @comp Crafty.stage
             * The `#cr-stage` div element.
             */

            /**@
             * #Crafty.stage.inner
             * @comp Crafty.stage
             * `Crafty.stage.inner` is a div inside the `#cr-stage` div that holds all DOM entities.
             * If you use canvas, a `canvas` element is created at the same level in the dom
             * as the the `Crafty.stage.inner` div. So the hierarchy in the DOM is
             * 
             * `Crafty.stage.elem`
             * <!-- not sure how to do indentation in the document-->
             *
             *     - `Crafty.stage.inner` (a div HTMLElement)
             *
             *     - `Crafty.canvas._canvas` (a canvas HTMLElement) 
             */

            //create stage div to contain everything
            Crafty.stage = {
                x: 0,
                y: 0,
                fullscreen: false,
                elem: (crstage ? crstage : document.createElement("div")),
                inner: document.createElement("div")
            };

            //fullscreen, stop scrollbars
            if ((!w && !h) || Crafty.mobile) {
                document.body.style.overflow = "hidden";
                Crafty.stage.fullscreen = true;
            }

            Crafty.addEvent(this, window, "resize", Crafty.viewport.reload);

            Crafty.addEvent(this, window, "blur", function () {
                if (Crafty.settings.get("autoPause")) {
                    if(!Crafty._paused) Crafty.pause();
                }
            });
            Crafty.addEvent(this, window, "focus", function () {
                if (Crafty._paused && Crafty.settings.get("autoPause")) {
                    Crafty.pause();
                }
            });

            //make the stage unselectable
            Crafty.settings.register("stageSelectable", function (v) {
                Crafty.stage.elem.onselectstart = v ? function () { return true; } : function () { return false; };
            });
            Crafty.settings.modify("stageSelectable", false);

            //make the stage have no context menu
            Crafty.settings.register("stageContextMenu", function (v) {
                Crafty.stage.elem.oncontextmenu = v ? function () { return true; } : function () { return false; };
            });
            Crafty.settings.modify("stageContextMenu", false);

            Crafty.settings.register("autoPause", function (){ });
            Crafty.settings.modify("autoPause", false);

            //add to the body and give it an ID if not exists
            if (!crstage) {
                document.body.appendChild(Crafty.stage.elem);
                Crafty.stage.elem.id = "cr-stage";
            }

            var elem = Crafty.stage.elem.style,
                offset;

            Crafty.stage.elem.appendChild(Crafty.stage.inner);
            Crafty.stage.inner.style.position = "absolute";
            Crafty.stage.inner.style.zIndex = "1";

            //css style
            elem.width = this.width + "px";
            elem.height = this.height + "px";
            elem.overflow = "hidden";

            if (Crafty.mobile) {
                elem.position = "absolute";
                elem.left = "0px";
                elem.top = "0px";

                // remove default gray highlighting after touch
                if (typeof elem.webkitTapHighlightColor != undefined) {
                    elem.webkitTapHighlightColor = "rgba(0,0,0,0)";
                }

                var meta = document.createElement("meta"),
                    head = document.getElementsByTagName("HEAD")[0];

                //stop mobile zooming and scrolling
                meta.setAttribute("name", "viewport");
                meta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no");
                head.appendChild(meta);

                //hide the address bar
                meta = document.createElement("meta");
                meta.setAttribute("name", "apple-mobile-web-app-capable");
                meta.setAttribute("content", "yes");
                head.appendChild(meta);
                setTimeout(function () { window.scrollTo(0, 1); }, 0);

                Crafty.addEvent(this, window, "touchmove", function (e) {
                    e.preventDefault();
                });

                Crafty.stage.x = 0;
                Crafty.stage.y = 0;

            } else {
                elem.position = "relative";
                //find out the offset position of the stage
                offset = Crafty.DOM.inner(Crafty.stage.elem);
                Crafty.stage.x = offset.x;
                Crafty.stage.y = offset.y;
            }

            if (Crafty.support.setter) {
                //define getters and setters to scroll the viewport
                this.__defineSetter__('x', function (v) { this.scroll('_x', v); });
                this.__defineSetter__('y', function (v) { this.scroll('_y', v); });
                this.__defineGetter__('x', function () { return this._x; });
                this.__defineGetter__('y', function () { return this._y; });
                //IE9
            } else if (Crafty.support.defineProperty) {
                Object.defineProperty(this, 'x', { set: function (v) { this.scroll('_x', v); }, get: function () { return this._x; } });
                Object.defineProperty(this, 'y', { set: function (v) { this.scroll('_y', v); }, get: function () { return this._y; } });
            } else {
                //create empty entity waiting for enterframe
                this.x = this._x;
                this.y = this._y;
                Crafty.e("viewport");
            }
        },

        /**@
         * #Crafty.viewport.reload
         * @comp Crafty.stage
         * 
         * @sign public Crafty.viewport.reload()
         * 
         * Recalculate and reload stage width, height and position.
         * Useful when browser return wrong results on init (like safari on Ipad2).
         * 
         */
        reload : function () {
            Crafty.DOM.window.init();
            var w = Crafty.DOM.window.width,
                h = Crafty.DOM.window.height,
                offset;


            if (Crafty.stage.fullscreen) {
                this.width = w;
                this.height = h;
                Crafty.stage.elem.style.width = w + "px";
                Crafty.stage.elem.style.height = h + "px";

                if (Crafty.canvas._canvas) {
                    Crafty.canvas._canvas.width = w;
                    Crafty.canvas._canvas.height = h;
                    Crafty.DrawManager.drawAll();
                }
            }

            offset = Crafty.DOM.inner(Crafty.stage.elem);
            Crafty.stage.x = offset.x;
            Crafty.stage.y = offset.y;
        },
		
		/**@
		 * #Crafty.viewport.reset
		 * @comp Crafty.stage
		 *
		 * @sign public Crafty.viewport.reset()
		 *
		 * Resets the viewport to starting values
		 * Called when scene() is run.
		 */
		reset: function () {
			Crafty.viewport.pan('reset');
			Crafty.viewport.follow();
			Crafty.viewport.mouselook('stop');
			Crafty.viewport.scale();
		}
    },

    /**@
    * #Crafty.keys
    * @category Input
    * Object of key names and the corresponding key code.
    * 
    * ~~~
    * BACKSPACE: 8,
    * TAB: 9,
    * ENTER: 13,
    * PAUSE: 19,
    * CAPS: 20,
    * ESC: 27,
    * SPACE: 32,
    * PAGE_UP: 33,
    * PAGE_DOWN: 34,
    * END: 35,
    * HOME: 36,
    * LEFT_ARROW: 37,
    * UP_ARROW: 38,
    * RIGHT_ARROW: 39,
    * DOWN_ARROW: 40,
    * INSERT: 45,
    * DELETE: 46,
    * 0: 48,
    * 1: 49,
    * 2: 50,
    * 3: 51,
    * 4: 52,
    * 5: 53,
    * 6: 54,
    * 7: 55,
    * 8: 56,
    * 9: 57,
    * A: 65,
    * B: 66,
    * C: 67,
    * D: 68,
    * E: 69,
    * F: 70,
    * G: 71,
    * H: 72,
    * I: 73,
    * J: 74,
    * K: 75,
    * L: 76,
    * M: 77,
    * N: 78,
    * O: 79,
    * P: 80,
    * Q: 81,
    * R: 82,
    * S: 83,
    * T: 84,
    * U: 85,
    * V: 86,
    * W: 87,
    * X: 88,
    * Y: 89,
    * Z: 90,
    * NUMPAD_0: 96,
    * NUMPAD_1: 97,
    * NUMPAD_2: 98,
    * NUMPAD_3: 99,
    * NUMPAD_4: 100,
    * NUMPAD_5: 101,
    * NUMPAD_6: 102,
    * NUMPAD_7: 103,
    * NUMPAD_8: 104,
    * NUMPAD_9: 105,
    * MULTIPLY: 106,
    * ADD: 107,
    * SUBSTRACT: 109,
    * DECIMAL: 110,
    * DIVIDE: 111,
    * F1: 112,
    * F2: 113,
    * F3: 114,
    * F4: 115,
    * F5: 116,
    * F6: 117,
    * F7: 118,
    * F8: 119,
    * F9: 120,
    * F10: 121,
    * F11: 122,
    * F12: 123,
    * SHIFT: 16,
    * CTRL: 17,
    * ALT: 18,
    * PLUS: 187,
    * COMMA: 188,
    * MINUS: 189,
    * PERIOD: 190,
    * PULT_UP: 29460,
    * PULT_DOWN: 29461,
    * PULT_LEFT: 4,
    * PULT_RIGHT': 5
    * ~~~
    */
    keys: {
        'BACKSPACE': 8,
        'TAB': 9,
        'ENTER': 13,
        'PAUSE': 19,
        'CAPS': 20,
        'ESC': 27,
        'SPACE': 32,
        'PAGE_UP': 33,
        'PAGE_DOWN': 34,
        'END': 35,
        'HOME': 36,
        'LEFT_ARROW': 37,
        'UP_ARROW': 38,
        'RIGHT_ARROW': 39,
        'DOWN_ARROW': 40,
        'INSERT': 45,
        'DELETE': 46,
        '0': 48,
        '1': 49,
        '2': 50,
        '3': 51,
        '4': 52,
        '5': 53,
        '6': 54,
        '7': 55,
        '8': 56,
        '9': 57,
        'A': 65,
        'B': 66,
        'C': 67,
        'D': 68,
        'E': 69,
        'F': 70,
        'G': 71,
        'H': 72,
        'I': 73,
        'J': 74,
        'K': 75,
        'L': 76,
        'M': 77,
        'N': 78,
        'O': 79,
        'P': 80,
        'Q': 81,
        'R': 82,
        'S': 83,
        'T': 84,
        'U': 85,
        'V': 86,
        'W': 87,
        'X': 88,
        'Y': 89,
        'Z': 90,
        'NUMPAD_0': 96,
        'NUMPAD_1': 97,
        'NUMPAD_2': 98,
        'NUMPAD_3': 99,
        'NUMPAD_4': 100,
        'NUMPAD_5': 101,
        'NUMPAD_6': 102,
        'NUMPAD_7': 103,
        'NUMPAD_8': 104,
        'NUMPAD_9': 105,
        'MULTIPLY': 106,
        'ADD': 107,
        'SUBSTRACT': 109,
        'DECIMAL': 110,
        'DIVIDE': 111,
        'F1': 112,
        'F2': 113,
        'F3': 114,
        'F4': 115,
        'F5': 116,
        'F6': 117,
        'F7': 118,
        'F8': 119,
        'F9': 120,
        'F10': 121,
        'F11': 122,
        'F12': 123,
        'SHIFT': 16,
        'CTRL': 17,
        'ALT': 18,
        'PLUS': 187,
        'COMMA': 188,
        'MINUS': 189,
        'PERIOD': 190,
        'PULT_UP': 29460,
        'PULT_DOWN': 29461,
        'PULT_LEFT': 4,
        'PULT_RIGHT': 5

    },

    /**@
    * #Crafty.mouseButtons
    * @category Input
    * Object of mouseButton names and the corresponding button ID.
    * In all mouseEvents we add the e.mouseButton property with a value normalized to match e.button of modern webkit
    * 
    * ~~~
    * LEFT: 0,
    * MIDDLE: 1,
    * RIGHT: 2
    * ~~~
    */
    mouseButtons: {
        LEFT: 0,
        MIDDLE: 1,
        RIGHT: 2
    }
});



/**
* Entity fixes the lack of setter support
*/
Crafty.c("viewport", {
    init: function () {
        this.bind("EnterFrame", function () {
            if (Crafty.viewport._x !== Crafty.viewport.x) {
                Crafty.viewport.scroll('_x', Crafty.viewport.x);
            }

            if (Crafty.viewport._y !== Crafty.viewport.y) {
                Crafty.viewport.scroll('_y', Crafty.viewport.y);
            }
        });
    }
});


Crafty.extend({
    /**@
    * #Crafty.device
    * @category Misc
    */
    device : {
        _deviceOrientationCallback : false,
        _deviceMotionCallback : false,

        /**
        * The HTML5 DeviceOrientation event returns three pieces of data:
        *  * alpha the direction the device is facing according to the compass
        *  * beta the angle in degrees the device is tilted front-to-back
        *  * gamma the angle in degrees the device is tilted left-to-right.
        *  * The angles values increase as you tilt the device to the right or towards you.
        *
        * Since Firefox uses the MozOrientationEvent which returns similar data but
        * using different parameters and a different measurement system, we want to
        * normalize that before we pass it to our _deviceOrientationCallback function.
        *
        * @param eventData HTML5 DeviceOrientation event
        */
        _normalizeDeviceOrientation : function(eventData) {
            var data;
            if (window.DeviceOrientationEvent) {
                data = {
                    // gamma is the left-to-right tilt in degrees, where right is positive
                    'tiltLR'    :    eventData.gamma,
                    // beta is the front-to-back tilt in degrees, where front is positive
                    'tiltFB'    :     eventData.beta,
                    // alpha is the compass direction the device is facing in degrees
                    'dir'         :     eventData.alpha,
                    // deviceorientation does not provide this data
                    'motUD'     :     null
                }
            } else if (window.OrientationEvent) {
                data = {
                    // x is the left-to-right tilt from -1 to +1, so we need to convert to degrees
                    'tiltLR'    :    eventData.x * 90,
                    // y is the front-to-back tilt from -1 to +1, so we need to convert to degrees
                    // We also need to invert the value so tilting the device towards us (forward)
                    // results in a positive value.
                    'tiltFB'    :     eventData.y * -90,
                    // MozOrientation does not provide this data
                    'dir'         :     null,
                    // z is the vertical acceleration of the device
                    'motUD'     :     eventData.z
                }
            }

            Crafty.device._deviceOrientationCallback(data);
        },

        /**
        * @param eventData HTML5 DeviceMotion event
        */
        _normalizeDeviceMotion : function(eventData) {
            var acceleration    = eventData.accelerationIncludingGravity,
                facingUp        = (acceleration.z > 0) ? +1 : -1;

            var data = {
                // Grab the acceleration including gravity from the results
                'acceleration' : acceleration,
                'rawAcceleration' : "["+  Math.round(acceleration.x) +", "+Math.round(acceleration.y) + ", " + Math.round(acceleration.z) + "]",
                // Z is the acceleration in the Z axis, and if the device is facing up or down
                'facingUp' : facingUp,
                // Convert the value from acceleration to degrees acceleration.x|y is the
                // acceleration according to gravity, we'll assume we're on Earth and divide
                // by 9.81 (earth gravity) to get a percentage value, and then multiply that
                // by 90 to convert to degrees.
                'tiltLR' : Math.round(((acceleration.x) / 9.81) * -90),
                'tiltFB' : Math.round(((acceleration.y + 9.81) / 9.81) * 90 * facingUp)
            };

            Crafty.device._deviceMotionCallback(data);
        },

        /**@
        * #Crafty.device.deviceOrientation
        * @comp Crafty.device
        * @sign public Crafty.device.deviceOrientation(Function callback)
        * @param callback - Callback method executed once as soon as device orientation is change
        *
        * Do something with normalized device orientation data:
        * ~~~
        * {
        *   'tiltLR'    :   'gamma the angle in degrees the device is tilted left-to-right.',
        *   'tiltFB'    :   'beta the angle in degrees the device is tilted front-to-back',
        *   'dir'       :   'alpha the direction the device is facing according to the compass',
        *   'motUD'     :   'The angles values increase as you tilt the device to the right or towards you.'
        * }
        * ~~~
        *
        * @example
        * ~~~
        * // Get DeviceOrientation event normalized data.
        * Crafty.device.deviceOrientation(function(data){
        *     console.log('data.tiltLR : '+Math.round(data.tiltLR)+', data.tiltFB : '+Math.round(data.tiltFB)+', data.dir : '+Math.round(data.dir)+', data.motUD : '+data.motUD+'');
        * });
        * ~~~
        *
        * See browser support at http://caniuse.com/#search=device orientation.
        */
        deviceOrientation : function(func) {
            this._deviceOrientationCallback = func;
            if (Crafty.support.deviceorientation) {
                if (window.DeviceOrientationEvent) {
                    // Listen for the deviceorientation event and handle DeviceOrientationEvent object
                    Crafty.addEvent(this, window, 'deviceorientation', this._normalizeDeviceOrientation);
                } else if (window.OrientationEvent) {
                    // Listen for the MozOrientation event and handle OrientationData object
                    Crafty.addEvent(this, window, 'MozOrientation', this._normalizeDeviceOrientation)
                }
            }
        },

        /**@
        * #Crafty.device.deviceMotion
        * @comp Crafty.device
        * @sign public Crafty.device.deviceMotion(Function callback)
        * @param callback - Callback method executed once as soon as device motion is change
        *
        * Do something with normalized device motion data:
        * ~~~
        * {
        *     'acceleration' : ' Grab the acceleration including gravity from the results',
        *     'rawAcceleration' : 'Display the raw acceleration data',
        *     'facingUp' : 'Z is the acceleration in the Z axis, and if the device is facing up or down',
        *     'tiltLR' : 'Convert the value from acceleration to degrees. acceleration.x is the acceleration according to gravity, we'll assume we're on Earth and divide by 9.81 (earth gravity) to get a percentage value, and then multiply that by 90 to convert to degrees.',
        *     'tiltFB' : 'Convert the value from acceleration to degrees.'
        * }
        * ~~~
        *
        * @example
        * ~~~
        * // Get DeviceMotion event normalized data.
        * Crafty.device.deviceMotion(function(data){
        *     console.log('data.moAccel : '+data.rawAcceleration+', data.moCalcTiltLR : '+Math.round(data.tiltLR)+', data.moCalcTiltFB : '+Math.round(data.tiltFB)+'');
        * });
        * ~~~
        *
        * See browser support at http://caniuse.com/#search=motion.
        */
        deviceMotion : function(func) {
            this._deviceMotionCallback = func;
            if (Crafty.support.devicemotion) {
                if (window.DeviceMotionEvent) {
                    // Listen for the devicemotion event and handle DeviceMotionEvent object
                    Crafty.addEvent(this, window, 'devicemotion', this._normalizeDeviceMotion);
                }
            }
        }
    }
});


/**@
* #Sprite
* @category Graphics
* @trigger Change - when the sprites change
* Component for using tiles in a sprite map.
*/
Crafty.c("Sprite", {
	__image: '',
	/*
	* #.__tile
	* @comp Sprite
	*
	* Horizontal sprite tile size.
	*/
	__tile: 0,
	/*
	* #.__tileh
	* @comp Sprite
	*
	* Vertical sprite tile size.
	*/
	__tileh: 0,
	__padding: null,
	__trim: null,
	img: null,
	//ready is changed to true in Crafty.sprite
	ready: false,

	init: function () {
		this.__trim = [0, 0, 0, 0];

		var draw = function (e) {
			var co = e.co,
				pos = e.pos,
				context = e.ctx;

			if (e.type === "canvas") {
				//draw the image on the canvas element
				context.drawImage(this.img, //image element
								 co.x, //x position on sprite
								 co.y, //y position on sprite
								 co.w, //width on sprite
								 co.h, //height on sprite
								 pos._x, //x position on canvas
								 pos._y, //y position on canvas
								 pos._w, //width on canvas
								 pos._h //height on canvas
				);
			} else if (e.type === "DOM") {
				this._element.style.background = "url('" + this.__image + "') no-repeat -" + co.x + "px -" + co.y + "px";
			}
		};

		this.bind("Draw", draw).bind("RemoveComponent", function (id) {
			if (id === "Sprite") this.unbind("Draw", draw);
		});
	},

	/**@
	* #.sprite
	* @comp Sprite
	* @sign public this .sprite(Number x, Number y, Number w, Number h)
	* @param x - X cell position
	* @param y - Y cell position
	* @param w - Width in cells
	* @param h - Height in cells
	* 
	* Uses a new location on the sprite map as its sprite.
	*
	* Values should be in tiles or cells (not pixels).
	*
	* @example
	* ~~~
	* Crafty.e("2D, DOM, Sprite")
	* 	.sprite(0, 0, 2, 2);
	* ~~~
	*/

	/**@
	* #.__coord
	* @comp Sprite
	*
	* The coordinate of the slide within the sprite in the format of [x, y, w, h].
	*/
	sprite: function (x, y, w, h) {
		this.__coord = [x * this.__tile + this.__padding[0] + this.__trim[0],
						y * this.__tileh + this.__padding[1] + this.__trim[1],
						this.__trim[2] || w * this.__tile || this.__tile,
						this.__trim[3] || h * this.__tileh || this.__tileh];

		this.trigger("Change");
		return this;
	},

	/**@
	* #.crop
	* @comp Sprite
	* @sign public this .crop(Number x, Number y, Number w, Number h)
	* @param x - Offset x position
	* @param y - Offset y position
	* @param w - New width
	* @param h - New height
	* 
	* If the entity needs to be smaller than the tile size, use this method to crop it.
	*
	* The values should be in pixels rather than tiles.
	*
	* @example
	* ~~~
	* Crafty.e("2D, DOM, Sprite")
	* 	.crop(40, 40, 22, 23);
	* ~~~
	*/
	crop: function (x, y, w, h) {
		var old = this._mbr || this.pos();
		this.__trim = [];
		this.__trim[0] = x;
		this.__trim[1] = y;
		this.__trim[2] = w;
		this.__trim[3] = h;

		this.__coord[0] += x;
		this.__coord[1] += y;
		this.__coord[2] = w;
		this.__coord[3] = h;
		this._w = w;
		this._h = h;

		this.trigger("Change", old);
		return this;
	}
});


/**@
* #Canvas
* @category Graphics
* @trigger Draw - when the entity is ready to be drawn to the stage - {type: "canvas", pos, co, ctx}
* @trigger NoCanvas - if the browser does not support canvas
* 
* When this component is added to an entity it will be drawn to the global canvas element. The canvas element (and hence all Canvas entities) is always rendered below any DOM entities. 
* 
* Crafty.canvas.init() will be automatically called if it is not called already to initialize the canvas element.
*
* Create a canvas entity like this
* ~~~
* var myEntity = Crafty.e("2D, Canvas, Color").color("green")
*                                             .attr({x: 13, y: 37, w: 42, h: 42});
*~~~
*/
Crafty.c("Canvas", {

	init: function () {
		if (!Crafty.canvas.context) {
			Crafty.canvas.init();
		}

		//increment the amount of canvas objs
		Crafty.DrawManager.total2D++;

		this.bind("Change", function (e) {
			//if within screen, add to list
			if (this._changed === false) {
				this._changed = Crafty.DrawManager.add(e || this, this);
			} else {
				if (e) this._changed = Crafty.DrawManager.add(e, this);
			}
		});

		this.bind("Remove", function () {
			Crafty.DrawManager.total2D--;
			Crafty.DrawManager.add(this, this);
		});
	},

	/**@
	* #.draw
	* @comp Canvas
	* @sign public this .draw([[Context ctx, ]Number x, Number y, Number w, Number h])
	* @param ctx - Canvas 2D context if drawing on another canvas is required
	* @param x - X offset for drawing a segment
	* @param y - Y offset for drawing a segment
	* @param w - Width of the segment to draw
	* @param h - Height of the segment to draw
	* 
	* Method to draw the entity on the canvas element. Can pass rect values for redrawing a segment of the entity.
	*/
	draw: function (ctx, x, y, w, h) {
		if (!this.ready) return;
		if (arguments.length === 4) {
			h = w;
			w = y;
			y = x;
			x = ctx;
			ctx = Crafty.canvas.context;
		}

		var pos = { //inlined pos() function, for speed
			_x: (this._x + (x || 0)),
			_y: (this._y + (y || 0)),
			_w: (w || this._w),
			_h: (h || this._h)
		},
			context = ctx || Crafty.canvas.context,
			coord = this.__coord || [0, 0, 0, 0],
			co = {
			x: coord[0] + (x || 0),
			y: coord[1] + (y || 0),
			w: w || coord[2],
			h: h || coord[3]
		};

		if (this._mbr) {
			context.save();

			context.translate(this._origin.x + this._x, this._origin.y + this._y);
			pos._x = -this._origin.x;
			pos._y = -this._origin.y;

			context.rotate((this._rotation % 360) * (Math.PI / 180));
		}
		
		if(this._flipX || this._flipY) {
			context.save();
			context.scale((this._flipX ? -1 : 1), (this._flipY ? -1 : 1));
			if(this._flipX) {
				pos._x = -(pos._x + pos._w)
			}
			if(this._flipY) {
				pos._y = -(pos._y + pos._h)
			}
		}
		
		//draw with alpha
		if (this._alpha < 1.0) {
			var globalpha = context.globalAlpha;
			context.globalAlpha = this._alpha;
		}

		this.trigger("Draw", { type: "canvas", pos: pos, co: co, ctx: context });

		if (this._mbr || (this._flipX || this._flipY)) {
			context.restore();
		}
		if (globalpha) {
			context.globalAlpha = globalpha;
		}
		return this;
	}
});

/**@
* #Crafty.canvas
* @category Graphics
* 
* Collection of methods to draw on canvas.
*/
Crafty.extend({
	canvas: {
	/**@
		* #Crafty.canvas.context
		* @comp Crafty.canvas
		* 
		* This will return the 2D context of the main canvas element.
		* The value returned from `Crafty.canvas._canvas.getContext('2d')`.
		*/
		context: null,
		/**@
		* #Crafty.canvas._canvas
		* @comp Crafty.canvas
		* 
		* Main Canvas element
		*/

		/**@
		* #Crafty.canvas.init
		* @comp Crafty.canvas
		* @sign public void Crafty.canvas.init(void)
        * @trigger NoCanvas - triggered if `Crafty.support.canvas` is false
        * 
		* Creates a `canvas` element inside `Crafty.stage.elem`. Must be called
		* before any entities with the Canvas component can be drawn.
		*
		* This method will automatically be called if no `Crafty.canvas.context` is
		* found.
		*/
		init: function () {
			//check if canvas is supported
			if (!Crafty.support.canvas) {
				Crafty.trigger("NoCanvas");
				Crafty.stop();
				return;
			}

			//create 3 empty canvas elements
			var c;
			c = document.createElement("canvas");
			c.width = Crafty.viewport.width;
			c.height = Crafty.viewport.height;
			c.style.position = 'absolute';
			c.style.left = "0px";
			c.style.top = "0px";

			Crafty.stage.elem.appendChild(c);
			Crafty.canvas.context = c.getContext('2d');
			Crafty.canvas._canvas = c;
		}
	}
});


Crafty.extend({
	over: null, //object mouseover, waiting for out
	mouseObjs: 0,
	mousePos: {},
	lastEvent: null,
	keydown: {},
	selected: false,

	/**@
	* #Crafty.keydown
	* @category Input
	* Remembering what keys (referred by Unicode) are down.
	* 
	* @example
	* ~~~
	* Crafty.c("Keyboard", {
	*   isDown: function (key) {
	*     if (typeof key === "string") {
	*       key = Crafty.keys[key];
	*     }
	*     return !!Crafty.keydown[key];
	*   }
	* });
	* ~~~
	* @see Keyboard, Crafty.keys
	*/

	detectBlur: function (e) {
		var selected = ((e.clientX > Crafty.stage.x && e.clientX < Crafty.stage.x + Crafty.viewport.width) &&
                    (e.clientY > Crafty.stage.y && e.clientY < Crafty.stage.y + Crafty.viewport.height));

		if (!Crafty.selected && selected)
			Crafty.trigger("CraftyFocus");
		if (Crafty.selected && !selected)
			Crafty.trigger("CraftyBlur");

		Crafty.selected = selected;
	},

	mouseDispatch: function (e) {
		
		if (!Crafty.mouseObjs) return;
		Crafty.lastEvent = e;

		var maxz = -1,
			closest,
			q,
			i = 0, l,
			pos = Crafty.DOM.translate(e.clientX, e.clientY),
			x, y,
			dupes = {},
			tar = e.target ? e.target : e.srcElement,
			type = e.type;

		//Normalize button according to http://unixpapa.com/js/mouse.html
		if (e.which == null) {
			e.mouseButton = (e.button < 2) ? Crafty.mouseButtons.LEFT : ((e.button == 4) ? Crafty.mouseButtons.MIDDLE : Crafty.mouseButtons.RIGHT);
		} else {
			e.mouseButton = (e.which < 2) ? Crafty.mouseButtons.LEFT : ((e.which == 2) ? Crafty.mouseButtons.MIDDLE : Crafty.mouseButtons.RIGHT);
		}

		e.realX = x = Crafty.mousePos.x = pos.x;
		e.realY = y = Crafty.mousePos.y = pos.y;

		//if it's a DOM element with Mouse component we are done
		if (tar.nodeName != "CANVAS") {
			while (typeof (tar.id) != 'string' && tar.id.indexOf('ent') == -1) {
				tar = tar.parentNode;
			}
			ent = Crafty(parseInt(tar.id.replace('ent', '')))
			if (ent.has('Mouse') && ent.isAt(x, y))
				closest = ent;
		}
		//else we search for an entity with Mouse component
		if (!closest) {
			q = Crafty.map.search({ _x: x, _y: y, _w: 1, _h: 1 }, false);

			for (l = q.length; i < l; ++i) {
				if (!q[i].__c.Mouse || !q[i]._visible) continue;

				var current = q[i],
					flag = false;

				//weed out duplicates
				if (dupes[current[0]]) continue;
				else dupes[current[0]] = true;

				if (current.mapArea) {
					if (current.mapArea.containsPoint(x, y)) {
						flag = true;
					}
				} else if (current.isAt(x, y)) flag = true;

				if (flag && (current._z >= maxz || maxz === -1)) {
					//if the Z is the same, select the closest GUID
					if (current._z === maxz && current[0] < closest[0]) {
						continue;
					}
					maxz = current._z;
					closest = current;
				}
			}
		}

		//found closest object to mouse
		if (closest) {
			//click must mousedown and out on tile
			if (type === "mousedown") {
				closest.trigger("MouseDown", e);
            } else if (type === "mouseup") {
				closest.trigger("MouseUp", e);
			} else if (type == "dblclick") {
				closest.trigger("DoubleClick", e);
			} else if (type == "click") {
				closest.trigger("Click", e);
			}else if (type === "mousemove") {
				closest.trigger("MouseMove", e);
				if (this.over !== closest) { //if new mousemove, it is over
					if (this.over) {
						this.over.trigger("MouseOut", e); //if over wasn't null, send mouseout
						this.over = null;
					}
					this.over = closest;
					closest.trigger("MouseOver", e);
				}
			} else closest.trigger(type, e); //trigger whatever it is
		} else {
			if (type === "mousemove" && this.over) {
				this.over.trigger("MouseOut", e);
				this.over = null;
			}
			if (type === "mousedown") {
				Crafty.viewport.mouselook('start', e);
			}
			else if (type === "mousemove") {
				Crafty.viewport.mouselook('drag', e);
			}
			else if (type == "mouseup") {
				Crafty.viewport.mouselook('stop');
			}
		}

		if (type === "mousemove") {
			this.lastEvent = e;
		}

	},


    /**@
    * #Crafty.touchDispatch
    * @category Input
    * 
    * TouchEvents have a different structure then MouseEvents.
    * The relevant data lives in e.changedTouches[0].
    * To normalize TouchEvents we catch em and dispatch a mock MouseEvent instead.
    * 
    * @see Crafty.mouseDispatch
    */

    touchDispatch: function(e) {
        var type,
            lastEvent = Crafty.lastEvent;

        if (e.type === "touchstart") type = "mousedown";
        else if (e.type === "touchmove") type = "mousemove";
        else if (e.type === "touchend") type = "mouseup";
        else if (e.type === "touchcancel") type = "mouseup";
        else if (e.type === "touchleave") type = "mouseup";
        
        if(e.touches && e.touches.length) {
            first = e.touches[0];
        } else if(e.changedTouches && e.changedTouches.length) {
            first = e.changedTouches[0];
        }

        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
            first.screenX, 
            first.screenY,
            first.clientX, 
            first.clientY, 
            false, false, false, false, 0, e.relatedTarget
        );

        first.target.dispatchEvent(simulatedEvent);

        // trigger click when it should be triggered
        if (lastEvent != null && lastEvent.type == 'mousedown' && type == 'mouseup') {
            type = 'click';

            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1,
                first.screenX, 
                first.screenY,
                first.clientX, 
                first.clientY, 
                false, false, false, false, 0, e.relatedTarget
            );
            first.target.dispatchEvent(simulatedEvent);
        }

        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    },


	/**@
	* #KeyboardEvent
	* @category Input
    * Keyboard Event triggered by Crafty Core
	* @trigger KeyDown - is triggered for each entity when the DOM 'keydown' event is triggered.
	* @trigger KeyUp - is triggered for each entity when the DOM 'keyup' event is triggered.
	* 
	* @example
	* ~~~
    * Crafty.e("2D, DOM, Color")
    *   .attr({x: 100, y: 100, w: 50, h: 50})
    *   .color("red")
    *   .bind('KeyDown', function(e) {
    *     if(e.key == Crafty.keys['LEFT_ARROW']) {
    *       this.x=this.x-1;
    *     } else if (e.key == Crafty.keys['RIGHT_ARROW']) {
    *     this.x=this.x+1;
    *     } else if (e.key == Crafty.keys['UP_ARROW']) {
    *     this.y=this.y-1;
    *     } else if (e.key == Crafty.keys['DOWN_ARROW']) {
    *     this.y=this.y+1;
    *     }
    *   });
	* ~~~
	* 
	* @see Crafty.keys
	*/

	/**@
	* #Crafty.eventObject
	* @category Input
	* 
	* Event Object used in Crafty for cross browser compatibility
	*/

	/**@
	* #.key
	* @comp Crafty.eventObject
	* 
	* Unicode of the key pressed
	*/
	keyboardDispatch: function (e) {
		e.key = e.keyCode || e.which;
		if (e.type === "keydown") {
			if (Crafty.keydown[e.key] !== true) {
				Crafty.keydown[e.key] = true;
				Crafty.trigger("KeyDown", e);
			}
		} else if (e.type === "keyup") {
			delete Crafty.keydown[e.key];
			Crafty.trigger("KeyUp", e);
		}

		//prevent default actions for all keys except backspace and F1-F12.
		//Among others this prevent the arrow keys from scrolling the parent page
		//of an iframe hosting the game
		if(Crafty.selected && !(e.key == 8 || e.key >= 112 && e.key <= 135)) {
			if(e.stopPropagation) e.stopPropagation();
            else e.cancelBubble = true;

			if(e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			return false;
		}
	}
});

//initialize the input events onload
Crafty.bind("Load", function () {
	Crafty.addEvent(this, "keydown", Crafty.keyboardDispatch);
	Crafty.addEvent(this, "keyup", Crafty.keyboardDispatch);

	Crafty.addEvent(this, Crafty.stage.elem, "mousedown", Crafty.mouseDispatch);
	Crafty.addEvent(this, Crafty.stage.elem, "mouseup", Crafty.mouseDispatch);
	Crafty.addEvent(this, document.body, "mouseup", Crafty.detectBlur);
	Crafty.addEvent(this, Crafty.stage.elem, "mousemove", Crafty.mouseDispatch);
	Crafty.addEvent(this, Crafty.stage.elem, "click", Crafty.mouseDispatch);
	Crafty.addEvent(this, Crafty.stage.elem, "dblclick", Crafty.mouseDispatch);

	Crafty.addEvent(this, Crafty.stage.elem, "touchstart", Crafty.touchDispatch);
	Crafty.addEvent(this, Crafty.stage.elem, "touchmove", Crafty.touchDispatch);
	Crafty.addEvent(this, Crafty.stage.elem, "touchend", Crafty.touchDispatch);
    Crafty.addEvent(this, Crafty.stage.elem, "touchcancel", Crafty.touchDispatch);
    Crafty.addEvent(this, Crafty.stage.elem, "touchleave", Crafty.touchDispatch);
   });

Crafty.bind("CraftyStop", function () {
	Crafty.removeEvent(this, "keydown", Crafty.keyboardDispatch);
	Crafty.removeEvent(this, "keyup", Crafty.keyboardDispatch);

	if (Crafty.stage) {
		Crafty.removeEvent(this, Crafty.stage.elem, "mousedown", Crafty.mouseDispatch);
		Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", Crafty.mouseDispatch);
		Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", Crafty.mouseDispatch);
		Crafty.removeEvent(this, Crafty.stage.elem, "click", Crafty.mouseDispatch);
		Crafty.removeEvent(this, Crafty.stage.elem, "dblclick", Crafty.mouseDispatch);

		Crafty.removeEvent(this, Crafty.stage.elem, "touchstart", Crafty.touchDispatch);
		Crafty.removeEvent(this, Crafty.stage.elem, "touchmove", Crafty.touchDispatch);
		Crafty.removeEvent(this, Crafty.stage.elem, "touchend", Crafty.touchDispatch);
		Crafty.removeEvent(this, Crafty.stage.elem, "touchcancel", Crafty.touchDispatch);
		Crafty.removeEvent(this, Crafty.stage.elem, "touchleave", Crafty.touchDispatch);
	}

	Crafty.removeEvent(this, document.body, "mouseup", Crafty.detectBlur);
});

/**@
* #Mouse
* @category Input
* Provides the entity with mouse related events
* @trigger MouseOver - when the mouse enters the entity - MouseEvent
* @trigger MouseOut - when the mouse leaves the entity - MouseEvent
* @trigger MouseDown - when the mouse button is pressed on the entity - MouseEvent
* @trigger MouseUp - when the mouse button is released on the entity - MouseEvent
* @trigger Click - when the user clicks the entity. [See documentation](http://www.quirksmode.org/dom/events/click.html) - MouseEvent
* @trigger DoubleClick - when the user double clicks the entity - MouseEvent
* @trigger MouseMove - when the mouse is over the entity and moves - MouseEvent
* Crafty adds the mouseButton property to MouseEvents that match one of
*
* ~~~
* - Crafty.mouseButtons.LEFT
* - Crafty.mouseButtons.RIGHT
* - Crafty.mouseButtons.MIDDLE
* ~~~
* 
* @example
* ~~~
* myEntity.bind('Click', function() {
*      console.log("Clicked!!");
* })
*
* myEntity.bind('MouseUp', function(e) {
*    if( e.mouseButton == Crafty.mouseButtons.RIGHT )
*        console.log("Clicked right button");
* })
* ~~~
*/
Crafty.c("Mouse", {
	init: function () {
		Crafty.mouseObjs++;
		this.bind("Remove", function () {
			Crafty.mouseObjs--;
		});
	},

	/**@
	* #.areaMap
	* @comp Mouse
	* @sign public this .areaMap(Crafty.polygon polygon)
	* @param polygon - Instance of Crafty.polygon used to check if the mouse coordinates are inside this region
	* @sign public this .areaMap(Array point1, .., Array pointN)
	* @param point# - Array with an `x` and `y` position to generate a polygon
	* 
	* Assign a polygon to the entity so that mouse events will only be triggered if
	* the coordinates are inside the given polygon.
	* 
	* @example
	* ~~~
	* Crafty.e("2D, DOM, Color, Mouse")
	*     .color("red")
	*     .attr({ w: 100, h: 100 })
	*     .bind('MouseOver', function() {console.log("over")})
	*     .areaMap([0,0], [50,0], [50,50], [0,50])
	* ~~~
	* 
	* @see Crafty.polygon
	*/
	areaMap: function (poly) {
		//create polygon
		if (arguments.length > 1) {
			//convert args to array to create polygon
			var args = Array.prototype.slice.call(arguments, 0);
			poly = new Crafty.polygon(args);
		}

		poly.shift(this._x, this._y);
		//this.map = poly;
		this.mapArea = poly;

		this.attach(this.mapArea);
		return this;
	}
});

/**@
* #Draggable
* @category Input
* Enable drag and drop of the entity.
* @trigger Dragging - is triggered each frame the entity is being dragged - MouseEvent
* @trigger StartDrag - is triggered when dragging begins - MouseEvent
* @trigger StopDrag - is triggered when dragging ends - MouseEvent
*/
Crafty.c("Draggable", {
  _origMouseDOMPos: null,
	_oldX: null,
	_oldY: null,
	_dragging: false,
	_dir:null,

	_ondrag: null,
	_ondown: null,
	_onup: null,

	//Note: the code is note tested with zoom, etc., that may distort the direction between the viewport and the coordinate on the canvas.
	init: function () {
		this.requires("Mouse");
		
		this._ondrag = function (e) {
			var pos = Crafty.DOM.translate(e.clientX, e.clientY);

			// ignore invalid 0 0 position - strange problem on ipad
			if (pos.x == 0 || pos.y == 0) {
			    return false;
			}
	    
			if(this._dir) {
			    var len = (pos.x - this._origMouseDOMPos.x) * this._dir.x + (pos.y - this._origMouseDOMPos.y) * this._dir.y;
			    this.x = this._oldX + len * this._dir.x;
			    this.y = this._oldY + len * this._dir.y;
			} else {
			    this.x = this._oldX + (pos.x - this._origMouseDOMPos.x);
			    this.y = this._oldY + (pos.y - this._origMouseDOMPos.y);
			}
	    
			this.trigger("Dragging", e);
		};

		this._ondown = function (e) {
			if (e.mouseButton !== Crafty.mouseButtons.LEFT) return;
			this._startDrag(e);
		};

		this._onup = function upper(e) {
			if (this._dragging == true) {
			    Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", this._ondrag);
			    Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", this._onup);
			    this._dragging = false;
			    this.trigger("StopDrag", e);
			}
		};

		this.enableDrag();
	},

	/**@
	* #.dragDirection
	* @comp Draggable
	* @sign public this .dragDirection()
    * Remove any previously specified direction.
    *
	* @sign public this .dragDirection(vector)
    * @param vector - Of the form of {x: valx, y: valy}, the vector (valx, valy) denotes the move direction.
    * 
	* @sign public this .dragDirection(degree)
    * @param degree - A number, the degree (clockwise) of the move direction with respect to the x axis. 
	* Specify the dragging direction.
	* 
	* @example
	* ~~~
	* this.dragDirection()
	* this.dragDirection({x:1, y:0}) //Horizontal
	* this.dragDirection({x:0, y:1}) //Vertical
    * // Note: because of the orientation of x and y axis,
    * // this is 45 degree clockwise with respect to the x axis.
	* this.dragDirection({x:1, y:1}) //45 degree.
	* this.dragDirection(60) //60 degree.
	* ~~~
	*/
	dragDirection: function(dir) {
		if (typeof dir === 'undefined') {
			this._dir=null;
		} else if (("" + parseInt(dir)) == dir) { //dir is a number
      this._dir={
        x: Math.cos(dir/180*Math.PI)
        , y: Math.sin(dir/180*Math.PI)
      };
    }
    else {
      var r=Math.sqrt(dir.x * dir.x + dir.y * dir.y)
			this._dir={
        x: dir.x/r
        , y: dir.y/r
      };
		}
	},
	
	
	/**@
	* #._startDrag
	* @comp Draggable
	* Internal method for starting a drag of an entity either programatically or via Mouse click
	*
	* @param e - a mouse event
	*/
	_startDrag: function(e){
		this._origMouseDOMPos = Crafty.DOM.translate(e.clientX, e.clientY);
		this._oldX = this._x;
		this._oldY = this._y;
		this._dragging = true;

		Crafty.addEvent(this, Crafty.stage.elem, "mousemove", this._ondrag);
		Crafty.addEvent(this, Crafty.stage.elem, "mouseup", this._onup);
		this.trigger("StartDrag", e);
	},
	
	/**@
	* #.stopDrag
	* @comp Draggable
	* @sign public this .stopDrag(void)
	* @trigger StopDrag - Called right after the mouse listeners are removed
	* 
	* Stop the entity from dragging. Essentially reproducing the drop.
	* 
	* @see .startDrag
	*/
	stopDrag: function () {
		Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", this._ondrag);
		Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", this._onup);

		this._dragging = false;
		this.trigger("StopDrag");
		return this;
	},

	/**@
	* #.startDrag
	* @comp Draggable
	* @sign public this .startDrag(void)
	* 
	* Make the entity follow the mouse positions.
	* 
	* @see .stopDrag
	*/
	startDrag: function () {
		if (!this._dragging) {
			//Use the last known position of the mouse
			this._startDrag(Crafty.lastEvent);
		}
		return this;
	},

	/**@
	* #.enableDrag
	* @comp Draggable
	* @sign public this .enableDrag(void)
	* 
	* Rebind the mouse events. Use if `.disableDrag` has been called.
	* 
	* @see .disableDrag
	*/
	enableDrag: function () {
		this.bind("MouseDown", this._ondown);

		Crafty.addEvent(this, Crafty.stage.elem, "mouseup", this._onup);
		return this;
	},

	/**@
	* #.disableDrag
	* @comp Draggable
	* @sign public this .disableDrag(void)
	* 
	* Stops entity from being draggable. Reenable with `.enableDrag()`.
	* 
	* @see .enableDrag
	*/
	disableDrag: function () {
		this.unbind("MouseDown", this._ondown);
		this.stopDrag();
		return this;
	}
});

/**@
* #Keyboard
* @category Input
* Give entities keyboard events (`keydown` and `keyup`).
*/
Crafty.c("Keyboard", {
/**@
	* #.isDown
	* @comp Keyboard
	* @sign public Boolean isDown(String keyName)
	* @param keyName - Name of the key to check. See `Crafty.keys`.
	* @sign public Boolean isDown(Number keyCode)
	* @param keyCode - Key code in `Crafty.keys`.
	* 
	* Determine if a certain key is currently down.
	* 
	* @example
	* ~~~
	* entity.requires('Keyboard').bind('KeyDown', function () { if (this.isDown('SPACE')) jump(); });
	* ~~~
	* 
	* @see Crafty.keys
	*/
	isDown: function (key) {
		if (typeof key === "string") {
			key = Crafty.keys[key];
		}
		return !!Crafty.keydown[key];
	}
});

/**@
* #Multiway
* @category Input
* Used to bind keys to directions and have the entity move accordingly
* @trigger NewDirection - triggered when direction changes - { x:Number, y:Number } - New direction
* @trigger Moved - triggered on movement on either x or y axis. If the entity has moved on both axes for diagonal movement the event is triggered twice - { x:Number, y:Number } - Old position
*/
Crafty.c("Multiway", {
	_speed: 3,

  _keydown: function (e) {
		if (this._keys[e.key]) {
			this._movement.x = Math.round((this._movement.x + this._keys[e.key].x) * 1000) / 1000;
			this._movement.y = Math.round((this._movement.y + this._keys[e.key].y) * 1000) / 1000;
			this.trigger('NewDirection', this._movement);
		}
	},

  _keyup: function (e) {
		if (this._keys[e.key]) {
			this._movement.x = Math.round((this._movement.x - this._keys[e.key].x) * 1000) / 1000;
			this._movement.y = Math.round((this._movement.y - this._keys[e.key].y) * 1000) / 1000;
			this.trigger('NewDirection', this._movement);
		}
	},

  _enterframe: function () {
		if (this.disableControls) return;

		if (this._movement.x !== 0) {
			this.x += this._movement.x;
			this.trigger('Moved', { x: this.x - this._movement.x, y: this.y });
		}
		if (this._movement.y !== 0) {
			this.y += this._movement.y;
			this.trigger('Moved', { x: this.x, y: this.y - this._movement.y });
		}
	},

	/**@
	* #.multiway
	* @comp Multiway
	* @sign public this .multiway([Number speed,] Object keyBindings )
	* @param speed - Amount of pixels to move the entity whilst a key is down
	* @param keyBindings - What keys should make the entity go in which direction. Direction is specified in degrees
	* Constructor to initialize the speed and keyBindings. Component will listen to key events and move the entity appropriately.
	*
	* When direction changes a NewDirection event is triggered with an object detailing the new direction: {x: x_movement, y: y_movement}
	* When entity has moved on either x- or y-axis a Moved event is triggered with an object specifying the old position {x: old_x, y: old_y}
	* 
	* @example
	* ~~~
	* this.multiway(3, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
	* this.multiway({x:3,y:1.5}, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
	* this.multiway({W: -90, S: 90, D: 0, A: 180});
	* ~~~
	*/
	multiway: function (speed, keys) {
		this._keyDirection = {};
		this._keys = {};
		this._movement = { x: 0, y: 0 };
		this._speed = { x: 3, y: 3 };

		if (keys) {
			if (speed.x && speed.y) {
				this._speed.x = speed.x;
				this._speed.y = speed.y;
			} else {
				this._speed.x = speed;
				this._speed.y = speed;
			}
		} else {
			keys = speed;
		}

		this._keyDirection = keys;
		this.speed(this._speed);

		this.disableControl();
		this.enableControl();

		//Apply movement if key is down when created
		for (var k in keys) {
			if (Crafty.keydown[Crafty.keys[k]]) {
				this.trigger("KeyDown", { key: Crafty.keys[k] });
			}
		}

		return this;
	},

	/**@
	* #.enableControl
	* @comp Multiway
	* @sign public this .enableControl()
	* 
	* Enable the component to listen to key events.
	*
	* @example
	* ~~~
    * this.enableControl();
	* ~~~
	*/
  enableControl: function() {
		this.bind("KeyDown", this._keydown)
		.bind("KeyUp", this._keyup)
		.bind("EnterFrame", this._enterframe);
		return this;
  },

	/**@
	* #.disableControl
	* @comp Multiway
	* @sign public this .disableControl()
	* 
	* Disable the component to listen to key events.
	*
	* @example
	* ~~~
    * this.disableControl();
	* ~~~
	*/

  disableControl: function() {
		this.unbind("KeyDown", this._keydown)
		.unbind("KeyUp", this._keyup)
		.unbind("EnterFrame", this._enterframe);
		return this;
  },

	speed: function (speed) {
		for (var k in this._keyDirection) {
			var keyCode = Crafty.keys[k] || k;
			this._keys[keyCode] = {
				x: Math.round(Math.cos(this._keyDirection[k] * (Math.PI / 180)) * 1000 * speed.x) / 1000,
				y: Math.round(Math.sin(this._keyDirection[k] * (Math.PI / 180)) * 1000 * speed.y) / 1000
			};
		}
		return this;
	}
});

/**@
* #Fourway
* @category Input
* Move an entity in four directions by using the
* arrow keys or `W`, `A`, `S`, `D`.
*/
Crafty.c("Fourway", {

	init: function () {
		this.requires("Multiway");
	},

	/**@
	* #.fourway
	* @comp Fourway
	* @sign public this .fourway(Number speed)
	* @param speed - Amount of pixels to move the entity whilst a key is down
	* Constructor to initialize the speed. Component will listen for key events and move the entity appropriately.
	* This includes `Up Arrow`, `Right Arrow`, `Down Arrow`, `Left Arrow` as well as `W`, `A`, `S`, `D`.
	*
	* When direction changes a NewDirection event is triggered with an object detailing the new direction: {x: x_movement, y: y_movement}
	* When entity has moved on either x- or y-axis a Moved event is triggered with an object specifying the old position {x: old_x, y: old_y}
	*
	* The key presses will move the entity in that direction by the speed passed in the argument.
	* 
	* @see Multiway
	*/
	fourway: function (speed) {
		this.multiway(speed, {
			UP_ARROW: -90,
			DOWN_ARROW: 90,
			RIGHT_ARROW: 0,
			LEFT_ARROW: 180,
			W: -90,
			S: 90,
			D: 0,
			A: 180,
			Z: -90,
			Q: 180
		});

		return this;
	}
});

/**@
* #Twoway
* @category Input
* Move an entity left or right using the arrow keys or `D` and `A` and jump using up arrow or `W`.
*
* When direction changes a NewDirection event is triggered with an object detailing the new direction: {x: x_movement, y: y_movement}. This is consistent with Fourway and Multiway components.
* When entity has moved on x-axis a Moved event is triggered with an object specifying the old position {x: old_x, y: old_y}
*/
Crafty.c("Twoway", {
	_speed: 3,
	_up: false,

	init: function () {
		this.requires("Fourway, Keyboard");
	},

	/**@
	* #.twoway
	* @comp Twoway
	* @sign public this .twoway(Number speed[, Number jumpSpeed])
	* @param speed - Amount of pixels to move left or right
	* @param jumpSpeed - How high the entity should jump
	* 
	* Constructor to initialize the speed and power of jump. Component will
	* listen for key events and move the entity appropriately. This includes
	* ~~~
	* `Up Arrow`, `Right Arrow`, `Left Arrow` as well as W, A, D. Used with the
	* `gravity` component to simulate jumping.
	* ~~~
	* 
	* The key presses will move the entity in that direction by the speed passed in
	* the argument. Pressing the `Up Arrow` or `W` will cause the entity to jump.
	* 
	* @see Gravity, Fourway
	*/
	twoway: function (speed, jump) {

		this.multiway(speed, {
			RIGHT_ARROW: 0,
			LEFT_ARROW: 180,
			D: 0,
			A: 180,
			Q: 180
		});

		if (speed) this._speed = speed;
		jump = jump || this._speed * 2;

		this.bind("EnterFrame", function () {
			if (this.disableControls) return;
			if (this._up) {
				this.y -= jump;
				this._falling = true;
			}
		}).bind("KeyDown", function () {
			if (this.isDown("UP_ARROW") || this.isDown("W") || this.isDown("Z")) this._up = true;
		});

		return this;
	}
});


Crafty.c("Animation", {
	_reel: null,

	init: function () {
		this._reel = {};
	},

	addAnimation: function (label, skeleton) {
		var key,
			lastKey = 0,
			i = 0, j,
			frame,
			prev,
			prop,
			diff = {},
			p,
			temp,
			frames = [];

		//loop over every frame
		for (key in skeleton) {

			frame = skeleton[key];
			prev = skeleton[lastKey] || this;
			diff = {};

			//find the difference
			for (prop in frame) {
				if (typeof frame[prop] !== "number") {
					diff[prop] = frame[prop];
					continue;
				}

				diff[prop] = (frame[prop] - prev[prop]) / (key - lastKey);
			}

			for (i = +lastKey + 1, j = 1; i <= +key; ++i, ++j) {
				temp = {};
				for (p in diff) {
					if (typeof diff[p] === "number") {
						temp[p] = prev[p] + diff[p] * j;
					} else {
						temp[p] = diff[p];
					}
				}

				frames[i] = temp;
			}
			lastKey = key;
		}

		this._reel[label] = frames;

		return this;
	},

	playAnimation: function (label) {
		var reel = this._reel[label],
			i = 0,
			l = reel.length,
			prop;

		this.bind("EnterFrame", function e() {
			for (prop in reel[i]) {
				this[prop] = reel[i][prop];
			}
			i++;

			if (i > l) {
				this.trigger("AnimationEnd");
				this.unbind("EnterFrame", e);
			}
		});
	}
});

/**@
* #SpriteAnimation
* @category Animation
* @trigger AnimationEnd - When the animation finishes - { reel }
* @trigger Change - On each frame
*
* Used to animate sprites by changing the sprites in the sprite map.
*
*/
Crafty.c("SpriteAnimation", {
/**@
	* #._reels
	* @comp SpriteAnimation
	*
	* A map consists of arrays that contains the coordinates of each frame within the sprite, e.g.,
    * `{"walk_left":[[96,48],[112,48],[128,48]]}`
	*/
	_reels: null,
	_frame: null,

	/**@
	* #._currentReelId
	* @comp SpriteAnimation
	*
	* The current playing reel (one element of `this._reels`). It is `null` if no reel is playing.
	*/
	_currentReelId: null,

	init: function () {
		this._reels = {};
	},

	/**@
	* #.animate
	* @comp SpriteAnimation
	* @sign public this .animate(String reelId, Number fromX, Number y, Number toX)
	* @param reelId - ID of the animation reel being created
	* @param fromX - Starting `x` position (in the unit of sprite horizontal size) on the sprite map
	* @param y - `y` position on the sprite map (in the unit of sprite vertical size). Remains constant through the animation.
	* @param toX - End `x` position on the sprite map (in the unit of sprite horizontal size)
	* @sign public this .animate(String reelId, Array frames)
	* @param reelId - ID of the animation reel being created
	* @param frames - Array of arrays containing the `x` and `y` values: [[x1,y1],[x2,y2],...]
	* @sign public this .animate(String reelId, Number duration[, Number repeatCount])
	* @param reelId - ID of the animation reel to play
	* @param duration - Play the animation within a duration (in frames)
	* @param repeatCount - number of times to repeat the animation. Use -1 for infinitely
	*
	* Method to setup animation reels or play pre-made reels. Animation works by changing the sprites over
	* a duration. Only works for sprites built with the Crafty.sprite methods. See the Tween component for animation of 2D properties.
	*
	* To setup an animation reel, pass the name of the reel (used to identify the reel and play it later), and either an
	* array of absolute sprite positions or the start x on the sprite map, the y on the sprite map and then the end x on the sprite map.
	*
	* To play a reel, pass the name of the reel and the duration it should play for (in frames). If you need
	* to repeat the animation, simply pass in the amount of times the animation should repeat. To repeat
	* forever, pass in `-1`.
	*
	* @example
	* ~~~
	* Crafty.sprite(16, "images/sprite.png", {
	*     PlayerSprite: [0,0]
	* });
	*
	* Crafty.e("2D, DOM, SpriteAnimation, PlayerSprite")
	*     .animate('PlayerRunning', 0, 0, 3) //setup animation
	*     .animate('PlayerRunning', 15, -1) // start animation
	*
	* Crafty.e("2D, DOM, SpriteAnimation, PlayerSprite")
	*     .animate('PlayerRunning', 0, 3, 0) //setup animation
	*     .animate('PlayerRunning', 15, -1) // start animation
	* ~~~
	*
	* @see crafty.sprite
	*/
	animate: function (reelId, fromx, y, tox) {
		var reel, i, tile, tileh, duration, pos;

		//play a reel
		//.animate('PlayerRunning', 15, -1) // start animation
		if (arguments.length < 4 && typeof fromx === "number") {
			duration = fromx;

			//make sure not currently animating
			this._currentReelId = reelId;

			currentReel = this._reels[reelId];

			this._frame = {
				currentReel: currentReel,
				numberOfFramesBetweenSlides: Math.ceil(duration / currentReel.length),
				currentSlideNumber: 0,
				frameNumberBetweenSlides: 0,
				repeat: 0
			};
			if (arguments.length === 3 && typeof y === "number") {
				//User provided repetition count
				if (y === -1) this._frame.repeatInfinitly = true;
				else this._frame.repeat = y;
			}

			pos = this._frame.currentReel[0];
			this.__coord[0] = pos[0];
			this.__coord[1] = pos[1];

			this.bind("EnterFrame", this.updateSprite);
			return this;
		}
		// .animate('PlayerRunning', 0, 0, 3) //setup animation
		if (typeof fromx === "number") {
			// Defind in Sprite component.
			tile = this.__tile + parseInt(this.__padding[0] || 0, 10);
			tileh = this.__tileh + parseInt(this.__padding[1] || 0, 10);

			reel = [];
			i = fromx;
			if (tox > fromx) {
				for (; i <= tox; i++) {
					reel.push([i * tile, y * tileh]);
				}
			} else {
				for (; i >= tox; i--) {
					reel.push([i * tile, y * tileh]);
				}
			}

			this._reels[reelId] = reel;
		} else if (typeof fromx === "object") {
			// @sign public this .animate(reelId, [[x1,y1],[x2,y2],...])
			i = 0;
			reel = [];
			tox = fromx.length - 1;
			tile = this.__tile + parseInt(this.__padding[0] || 0, 10);
			tileh = this.__tileh + parseInt(this.__padding[1] || 0, 10);

			for (; i <= tox; i++) {
				pos = fromx[i];
				reel.push([pos[0] * tile, pos[1] * tileh]);
			}

			this._reels[reelId] = reel;
		}

		return this;
	},

	/**@
	* #.updateSprite
	* @comp SpriteAnimation
	* @sign private void .updateSprite()
	*
	* This is called at every `EnterFrame` event when `.animate()` enables animation. It update the SpriteAnimation component when the slide in the sprite should be updated.
	*
	* @example
	* ~~~
	* this.bind("EnterFrame", this.updateSprite);
	* ~~~
	*
	* @see crafty.sprite
	*/
	updateSprite: function () {
		var data = this._frame;
		if (!data) {
			return;
		}

		if (this._frame.frameNumberBetweenSlides++ === data.numberOfFramesBetweenSlides) {
			var pos = data.currentReel[data.currentSlideNumber++];

			this.__coord[0] = pos[0];
			this.__coord[1] = pos[1];
			this._frame.frameNumberBetweenSlides = 0;
		}


		if (data.currentSlideNumber === data.currentReel.length) {
			
			if (this._frame.repeatInfinitly === true || this._frame.repeat > 0) {
				if (this._frame.repeat) this._frame.repeat--;
				this._frame.frameNumberBetweenSlides = 0;
				this._frame.currentSlideNumber = 0;
			} else {
				if (this._frame.frameNumberBetweenSlides === data.numberOfFramesBetweenSlides) {
				    this.trigger("AnimationEnd", { reel: data.currentReel });
				    this.stop();
				    return;
                }
			}

		}

		this.trigger("Change");
	},

	/**@
	* #.stop
	* @comp SpriteAnimation
	* @sign public this .stop(void)
	*
	* Stop any animation currently playing.
	*/
	stop: function () {
		this.unbind("EnterFrame", this.updateSprite);
		this.unbind("AnimationEnd");
		this._currentReelId = null;
		this._frame = null;

		return this;
	},

	/**@
	* #.reset
	* @comp SpriteAnimation
	* @sign public this .reset(void)
	*
	* Method will reset the entities sprite to its original.
	*/
	reset: function () {
		if (!this._frame) return this;

		var co = this._frame.currentReel[0];
		this.__coord[0] = co[0];
		this.__coord[1] = co[1];
		this.stop();

		return this;
	},

	/**@
	* #.isPlaying
	* @comp SpriteAnimation
	* @sign public Boolean .isPlaying([String reelId])
	* @param reelId - Determine if the animation reel with this reelId is playing.
	*
	* Determines if an animation is currently playing. If a reel is passed, it will determine
	* if the passed reel is playing.
	*
	* @example
	* ~~~
	* myEntity.isPlaying() //is any animation playing
	* myEntity.isPlaying('PlayerRunning') //is the PlayerRunning animation playing
	* ~~~
	*/
	isPlaying: function (reelId) {
		if (!reelId) return !!this._currentReelId;
		return this._currentReelId === reelId;
	}
});

/**@
* #Tween
* @category Animation
* @trigger TweenEnd - when a tween finishes - String - property
*
* Component to animate the change in 2D properties over time.
*/
Crafty.c("Tween", {
	_step: null,
	_numProps: 0,

	/**@
	* #.tween
	* @comp Tween
	* @sign public this .tween(Object properties, Number duration)
	* @param properties - Object of 2D properties and what they should animate to
	* @param duration - Duration to animate the properties over (in frames)
	*
	* This method will animate a 2D entities properties over the specified duration.
	* These include `x`, `y`, `w`, `h`, `alpha` and `rotation`.
	*
	* The object passed should have the properties as keys and the value should be the resulting
	* values of the properties.
	*
	* @example
	* Move an object to 100,100 and fade out in 200 frames.
	* ~~~
	* Crafty.e("2D, Tween")
	*    .attr({alpha: 1.0, x: 0, y: 0})
	*    .tween({alpha: 0.0, x: 100, y: 100}, 200)
	* ~~~
	*/
	tween: function (props, duration) {
		this.each(function () {
			if (this._step == null) {
				this._step = {};
				this.bind('EnterFrame', tweenEnterFrame);
				this.bind('RemoveComponent', function (c) {
					if (c == 'Tween') {
						this.unbind('EnterFrame', tweenEnterFrame);
					}
				});
			}

			for (var prop in props) {
				this._step[prop] = { prop: props[prop], val: (props[prop] - this[prop]) / duration, rem: duration };
				this._numProps++;
			}
		});
		return this;
	}
});

function tweenEnterFrame(e) {
	if (this._numProps <= 0) return;

	var prop, k;
	for (k in this._step) {
		prop = this._step[k];
		this[k] += prop.val;
		if (--prop.rem == 0) {
			// decimal numbers rounding fix
			this[k] = prop.prop;
			this.trigger("TweenEnd", k);
			// make sure the duration wasn't changed in TweenEnd
			if (this._step[k].rem <= 0) {
				delete this._step[k];
			}
			this._numProps--;
		}
	}

	if (this.has('Mouse')) {
		var over = Crafty.over,
			mouse = Crafty.mousePos;
		if (over && over[0] == this[0] && !this.isAt(mouse.x, mouse.y)) {
			this.trigger('MouseOut', Crafty.lastEvent);
			Crafty.over = null;
		}
		else if ((!over || over[0] != this[0]) && this.isAt(mouse.x, mouse.y)) {
			Crafty.over = this;
			this.trigger('MouseOver', Crafty.lastEvent);
		}
	}
}



/**@
* #Color
* @category Graphics
* Draw a solid color for the entity
*/
Crafty.c("Color", {
	_color: "",
	ready: true,

	init: function () {
		this.bind("Draw", function (e) {
			if (e.type === "DOM") {
				e.style.background = this._color;
				e.style.lineHeight = 0;
			} else if (e.type === "canvas") {
				if (this._color) e.ctx.fillStyle = this._color;
				e.ctx.fillRect(e.pos._x, e.pos._y, e.pos._w, e.pos._h);
			}
		});
	},

	/**@
	* #.color
	* @comp Color
	* @trigger Change - when the color changes
	* @sign public this .color(String color)
	* @sign public String .color()
	* @param color - Color of the rectangle
	* Will create a rectangle of solid color for the entity, or return the color if no argument is given.
	*
	* The argument must be a color readable depending on which browser you
	* choose to support. IE 8 and below doesn't support the rgb() syntax.
	* 
	* @example
	* ~~~
	* Crafty.e("2D, DOM, Color")
	*    .color("#969696");
	* ~~~
	*/
	color: function (color) {
		if (!color) return this._color;
		this._color = color;
		this.trigger("Change");
		return this;
	}
});

/**@
* #Tint
* @category Graphics
* Similar to Color by adding an overlay of semi-transparent color.
*
* *Note: Currently only works for Canvas*
*/
Crafty.c("Tint", {
	_color: null,
	_strength: 1.0,

	init: function () {
		var draw = function d(e) {
			var context = e.ctx || Crafty.canvas.context;

			context.fillStyle = this._color || "rgb(0,0,0)";
			context.fillRect(e.pos._x, e.pos._y, e.pos._w, e.pos._h);
		};

		this.bind("Draw", draw).bind("RemoveComponent", function (id) {
			if (id === "Tint") this.unbind("Draw", draw);
		});
	},

	/**@
	* #.tint
	* @comp Tint
	* @trigger Change - when the tint is applied
	* @sign public this .tint(String color, Number strength)
	* @param color - The color in hexadecimal
	* @param strength - Level of opacity
	* 
	* Modify the color and level opacity to give a tint on the entity.
	* 
	* @example
	* ~~~
	* Crafty.e("2D, Canvas, Tint")
	*    .tint("#969696", 0.3);
	* ~~~
	*/
	tint: function (color, strength) {
		this._strength = strength;
		this._color = Crafty.toRGB(color, this._strength);

		this.trigger("Change");
		return this;
	}
});

/**@
* #Image
* @category Graphics
* Draw an image with or without repeating (tiling).
*/
Crafty.c("Image", {
	_repeat: "repeat",
	ready: false,

	init: function () {
		var draw = function (e) {
			if (e.type === "canvas") {
				//skip if no image
				if (!this.ready || !this._pattern) return;

				var context = e.ctx;
				
				context.fillStyle = this._pattern;
				
				context.save();
				context.translate(e.pos._x, e.pos._y);
				context.fillRect(0, 0, this._w, this._h);
				context.restore();
			} else if (e.type === "DOM") {
				if (this.__image)
					e.style.background = "url(" + this.__image + ") " + this._repeat;
			}
		};

		this.bind("Draw", draw).bind("RemoveComponent", function (id) {
			if (id === "Image") this.unbind("Draw", draw);
		});
	},

	/**@
	* #.image
	* @comp Image
	* @trigger Change - when the image is loaded
	* @sign public this .image(String url[, String repeat])
	* @param url - URL of the image
	* @param repeat - If the image should be repeated to fill the entity.
	* 
	* Draw specified image. Repeat follows CSS syntax (`"no-repeat", "repeat", "repeat-x", "repeat-y"`);
	*
	* *Note: Default repeat is `no-repeat` which is different to standard DOM (which is `repeat`)*
	*
	* If the width and height are `0` and repeat is set to `no-repeat` the width and
	* height will automatically assume that of the image. This is an
	* easy way to create an image without needing sprites.
	* 
	* @example
	* Will default to no-repeat. Entity width and height will be set to the images width and height
	* ~~~
	* var ent = Crafty.e("2D, DOM, Image").image("myimage.png");
	* ~~~
	* Create a repeating background.
	* ~~~
	* var bg = Crafty.e("2D, DOM, Image")
	*              .attr({w: Crafty.viewport.width, h: Crafty.viewport.height})
	*              .image("bg.png", "repeat");
	* ~~~
	* 
	* @see Crafty.sprite
	*/
	image: function (url, repeat) {
		this.__image = url;
		this._repeat = repeat || "no-repeat";

		this.img = Crafty.asset(url);
		if (!this.img) {
			this.img = new Image();
			Crafty.asset(url, this.img);
			this.img.src = url;
			var self = this;

			this.img.onload = function () {
				if (self.has("Canvas")) self._pattern = Crafty.canvas.context.createPattern(self.img, self._repeat);
				self.ready = true;

				if (self._repeat === "no-repeat") {
					self.w = self.img.width;
					self.h = self.img.height;
				}

				self.trigger("Change");
			};

			return this;
		} else {
			this.ready = true;
			if (this.has("Canvas")) this._pattern = Crafty.canvas.context.createPattern(this.img, this._repeat);
			if (this._repeat === "no-repeat") {
				this.w = this.img.width;
				this.h = this.img.height;
			}
		}


		this.trigger("Change");

		return this;
	}
});

Crafty.extend({
	_scenes: [],
	_current: null,

	/**@
	* #Crafty.scene
	* @category Scenes, Stage
	* @trigger SceneChange - when a scene is played - { oldScene:String, newScene:String }
	* @sign public void Crafty.scene(String sceneName, Function init[, Function uninit])
	* @param sceneName - Name of the scene to add
	* @param init - Function to execute when scene is played
	* @param uninit - Function to execute before next scene is played, after entities with `2D` are destroyed
	* @sign public void Crafty.scene(String sceneName)
	* @param sceneName - Name of scene to play
	* 
	* Method to create scenes on the stage. Pass an ID and function to register a scene.
	*
	* To play a scene, just pass the ID. When a scene is played, all
	* entities with the `2D` component on the stage are destroyed.
	*
	* If you want some entities to persist over scenes (as in not be destroyed)
	* simply add the component `Persist`.
	*
	* @example
	* ~~~
	* Crafty.scene("loading", function() {});
	*
	* Crafty.scene("loading", function() {}, function() {});
	*
	* Crafty.scene("loading");
	* ~~~
	*/
	scene: function (name, intro, outro) {
		//play scene
		if (arguments.length === 1) {
			Crafty.viewport.reset();
			Crafty("2D").each(function () {
				if (!this.has("Persist")) this.destroy();
			});
			// uninitialize previous scene
			if (this._current !== null && 'uninitialize' in this._scenes[this._current]) {
				this._scenes[this._current].uninitialize.call(this);
			}
			// initialize next scene
			this._scenes[name].initialize.call(this);
			var oldScene = this._current;
			this._current = name;
			Crafty.trigger("SceneChange", { oldScene: oldScene, newScene: name });
			return;
		}
		//add scene
		this._scenes[name] = {}
		this._scenes[name].initialize = intro
		if (typeof outro !== 'undefined') {
			this._scenes[name].uninitialize = outro;
		}
		return;
	},

	/**@
	* #Crafty.toRGB
	* @category Graphics
	* @sign public String Crafty.scene(String hex[, Number alpha])
	* @param hex - a 6 character hex number string representing RGB color
	* @param alpha - The alpha value.
	* 
	* Get a rgb string or rgba string (if `alpha` presents).
	* 
	* @example
	* ~~~
	* Crafty.toRGB("ffffff"); // rgb(255,255,255)
	* Crafty.toRGB("#ffffff"); // rgb(255,255,255)
	* Crafty.toRGB("ffffff", .5); // rgba(255,255,255,0.5)
	* ~~~
	* 
	* @see Text.textColor
	*/
	toRGB: function (hex, alpha) {
		var hex = (hex.charAt(0) === '#') ? hex.substr(1) : hex,
			c = [], result;

		c[0] = parseInt(hex.substr(0, 2), 16);
		c[1] = parseInt(hex.substr(2, 2), 16);
		c[2] = parseInt(hex.substr(4, 2), 16);

		result = alpha === undefined ? 'rgb(' + c.join(',') + ')' : 'rgba(' + c.join(',') + ',' + alpha + ')';

		return result;
	}
});

/**@
* #Crafty.DrawManager
* @category Graphics
* @sign Crafty.DrawManager
* 
* An internal object manage objects to be drawn and implement
* the best method of drawing in both DOM and canvas
*/
Crafty.DrawManager = (function () {
	/** array of dirty rects on screen */
	var dirty_rects = [],
	/** array of DOMs needed updating */
		dom = [];

	return {
		/**@
		* #Crafty.DrawManager.total2D
		* @comp Crafty.DrawManager
		* 
		* Total number of the entities that have the `2D` component.
		*/
		total2D: Crafty("2D").length,

		/**@
		* #Crafty.DrawManager.onScreen
		* @comp Crafty.DrawManager
		* @sign public Crafty.DrawManager.onScreen(Object rect)
		* @param rect - A rectangle with field {_x: x_val, _y: y_val, _w: w_val, _h: h_val}
		* 
		* Test if a rectangle is completely in viewport
		*/
		onScreen: function (rect) {
			return Crafty.viewport._x + rect._x + rect._w > 0 && Crafty.viewport._y + rect._y + rect._h > 0 &&
				   Crafty.viewport._x + rect._x < Crafty.viewport.width && Crafty.viewport._y + rect._y < Crafty.viewport.height;
		},

		/**@
		* #Crafty.DrawManager.merge
		* @comp Crafty.DrawManager
		* @sign public Object Crafty.DrawManager.merge(Object set)
		* @param set - an array of rectangular regions
		* 
		* Merged into non overlapping rectangular region
		* Its an optimization for the redraw regions.
		*/
		merge: function (set) {
			do {
				var newset = [], didMerge = false, i = 0,
					l = set.length, current, next, merger;

				while (i < l) {
					current = set[i];
					next = set[i + 1];

					if (i < l - 1 && current._x < next._x + next._w && current._x + current._w > next._x &&
									current._y < next._y + next._h && current._h + current._y > next._y) {

						merger = {
							_x: ~~Math.min(current._x, next._x),
							_y: ~~Math.min(current._y, next._y),
							_w: Math.max(current._x, next._x) + Math.max(current._w, next._w),
							_h: Math.max(current._y, next._y) + Math.max(current._h, next._h)
						};
						merger._w = merger._w - merger._x;
						merger._h = merger._h - merger._y;
						merger._w = (merger._w == ~~merger._w) ? merger._w : merger._w + 1 | 0;
						merger._h = (merger._h == ~~merger._h) ? merger._h : merger._h + 1 | 0;

						newset.push(merger);

						i++;
						didMerge = true;
					} else newset.push(current);
					i++;
				}

				set = newset.length ? Crafty.clone(newset) : set;

				if (didMerge) i = 0;
			} while (didMerge);

			return set;
		},

		/**@
		* #Crafty.DrawManager.add
		* @comp Crafty.DrawManager
		* @sign public Crafty.DrawManager.add(old, current)
		* @param old - Undocumented
		* @param current - Undocumented
		* 
		* Calculate the bounding rect of dirty data and add to the register of dirty rectangles
		*/
		add: function add(old, current) {
			if (!current) {
				dom.push(old);
				return;
			}

			var rect,
				before = old._mbr || old,
				after = current._mbr || current;

			if (old === current) {
				rect = old.mbr() || old.pos();
			} else {
				rect = {
					_x: ~~Math.min(before._x, after._x),
					_y: ~~Math.min(before._y, after._y),
					_w: Math.max(before._w, after._w) + Math.max(before._x, after._x),
					_h: Math.max(before._h, after._h) + Math.max(before._y, after._y)
				};

				rect._w = (rect._w - rect._x);
				rect._h = (rect._h - rect._y);
			}

			if (rect._w === 0 || rect._h === 0 || !this.onScreen(rect)) {
				return false;
			}

			//floor/ceil
			rect._x = ~~rect._x;
			rect._y = ~~rect._y;
			rect._w = (rect._w === ~~rect._w) ? rect._w : rect._w + 1 | 0;
			rect._h = (rect._h === ~~rect._h) ? rect._h : rect._h + 1 | 0;

			//add to dirty_rects, check for merging
			dirty_rects.push(rect);

			//if it got merged
			return true;
		},

		/**@
		* #Crafty.DrawManager.debug
		* @comp Crafty.DrawManager
		* @sign public Crafty.DrawManager.debug()
		*/
		debug: function () {
			console.log(dirty_rects, dom);
		},

		/**@
		* #Crafty.DrawManager.draw
		* @comp Crafty.DrawManager
		* @sign public Crafty.DrawManager.draw([Object rect])
        * @param rect - a rectangular region {_x: x_val, _y: y_val, _w: w_val, _h: h_val}
        * ~~~
		* - If rect is omitted, redraw within the viewport
		* - If rect is provided, redraw within the rect
		* ~~~
		*/
		drawAll: function (rect) {
			var rect = rect || Crafty.viewport.rect(),
				q = Crafty.map.search(rect),
				i = 0,
				l = q.length,
				ctx = Crafty.canvas.context,
				current;

			ctx.clearRect(rect._x, rect._y, rect._w, rect._h);

			//sort the objects by the global Z
			q.sort(function (a, b) { return a._globalZ - b._globalZ; });
			for (; i < l; i++) {
				current = q[i];
				if (current._visible && current.__c.Canvas) {
					current.draw();
					current._changed = false;
				}
			}
		},

		/**@
		* #Crafty.DrawManager.boundingRect
		* @comp Crafty.DrawManager
		* @sign public Crafty.DrawManager.boundingRect(set)
		* @param set - Undocumented
		* ~~~
		* - Calculate the common bounding rect of multiple canvas entities.
		* - Returns coords
		* ~~~
		*/
		boundingRect: function (set) {
			if (!set || !set.length) return;
			var newset = [], i = 1,
			l = set.length, current, master = set[0], tmp;
			master = [master._x, master._y, master._x + master._w, master._y + master._h];
			while (i < l) {
				current = set[i];
				tmp = [current._x, current._y, current._x + current._w, current._y + current._h];
				if (tmp[0] < master[0]) master[0] = tmp[0];
				if (tmp[1] < master[1]) master[1] = tmp[1];
				if (tmp[2] > master[2]) master[2] = tmp[2];
				if (tmp[3] > master[3]) master[3] = tmp[3];
				i++;
			}
			tmp = master;
			master = { _x: tmp[0], _y: tmp[1], _w: tmp[2] - tmp[0], _h: tmp[3] - tmp[1] };

			return master;
		},

		/**@
		* #Crafty.DrawManager.draw
		* @comp Crafty.DrawManager
		* @sign public Crafty.DrawManager.draw()
		* ~~~
		* - If the number of rects is over 60% of the total number of objects
		*	do the naive method redrawing `Crafty.DrawManager.drawAll`
		* - Otherwise, clear the dirty regions, and redraw entities overlapping the dirty regions.
		* ~~~
		* 
        * @see Canvas.draw, DOM.draw
		*/
		draw: function draw() {
			//if nothing in dirty_rects, stop
			if (!dirty_rects.length && !dom.length) return;

			var i = 0, l = dirty_rects.length, k = dom.length, rect, q,
				j, len, dupes, obj, ent, objs = [], ctx = Crafty.canvas.context;

			//loop over all DOM elements needing updating
			for (; i < k; ++i) {
				dom[i].draw()._changed = false;
			}
			//reset DOM array
            dom.length = 0;
			//again, stop if nothing in dirty_rects
			if (!l) { return; }

			//if the amount of rects is over 60% of the total objects
			//do the naive method redrawing
			if (l / this.total2D > 0.6) {
				this.drawAll();
				dirty_rects.length = 0;
				return;
			}

			dirty_rects = this.merge(dirty_rects);
			for (i = 0; i < l; ++i) { //loop over every dirty rect
				rect = dirty_rects[i];
				if (!rect) continue;
				q = Crafty.map.search(rect, false); //search for ents under dirty rect

				dupes = {};

				//loop over found objects removing dupes and adding to obj array
				for (j = 0, len = q.length; j < len; ++j) {
					obj = q[j];

					if (dupes[obj[0]] || !obj._visible || !obj.__c.Canvas)
						continue;
					dupes[obj[0]] = true;

					objs.push({ obj: obj, rect: rect });
				}

				//clear the rect from the main canvas
				ctx.clearRect(rect._x, rect._y, rect._w, rect._h);

			}

			//sort the objects by the global Z
			objs.sort(function (a, b) { return a.obj._globalZ - b.obj._globalZ; });
			if (!objs.length){ return; }

			//loop over the objects
			for (i = 0, l = objs.length; i < l; ++i) {
				obj = objs[i];
				rect = obj.rect;
				ent = obj.obj;

				var area = ent._mbr || ent,
					x = (rect._x - area._x <= 0) ? 0 : ~~(rect._x - area._x),
					y = (rect._y - area._y < 0) ? 0 : ~~(rect._y - area._y),
					w = ~~Math.min(area._w - x, rect._w - (area._x - rect._x), rect._w, area._w),
					h = ~~Math.min(area._h - y, rect._h - (area._y - rect._y), rect._h, area._h);

				//no point drawing with no width or height
				if (h === 0 || w === 0) continue;

				ctx.save();
				ctx.beginPath();
				ctx.moveTo(rect._x, rect._y);
				ctx.lineTo(rect._x + rect._w, rect._y);
				ctx.lineTo(rect._x + rect._w, rect._h + rect._y);
				ctx.lineTo(rect._x, rect._h + rect._y);
				ctx.lineTo(rect._x, rect._y);

				ctx.clip();

				ent.draw();
				ctx.closePath();
				ctx.restore();

				//allow entity to re-dirty_rects
				ent._changed = false;
			}

			//empty dirty_rects
			dirty_rects.length = 0;
			//all merged IDs are now invalid
			merged = {};
		}
	};
})();


Crafty.extend({
/**@
* #Crafty.isometric
* @category 2D
* Place entities in a 45deg isometric fashion.
*/
    isometric: {
        _tile: {
            width: 0,
            height: 0
        },
        _elements:{},
        _pos: {
            x:0,
            y:0
        },
        _z: 0,
        /**@
        * #Crafty.isometric.size
        * @comp Crafty.isometric
        * @sign public this Crafty.isometric.size(Number tileSize)
        * @param tileSize - The size of the tiles to place.
        * 
        * Method used to initialize the size of the isometric placement.
        * Recommended to use a size values in the power of `2` (128, 64 or 32).
        * This makes it easy to calculate positions and implement zooming.
        * 
        * @example
        * ~~~
        * var iso = Crafty.isometric.size(128);
        * ~~~
        * 
        * @see Crafty.isometric.place
        */
        size: function (width, height) {
            this._tile.width = width;
            this._tile.height = height > 0 ? height : width/2; //Setup width/2 if height isn't set
            return this;
        },
        /**@
        * #Crafty.isometric.place
        * @comp Crafty.isometric
        * @sign public this Crafty.isometric.place(Number x, Number y, Number z, Entity tile)
        * @param x - The `x` position to place the tile
        * @param y - The `y` position to place the tile
        * @param z - The `z` position or height to place the tile
        * @param tile - The entity that should be position in the isometric fashion
        * 
        * Use this method to place an entity in an isometric grid.
        * 
        * @example
        * ~~~
        * var iso = Crafty.isometric.size(128);
        * iso.place(2, 1, 0, Crafty.e('2D, DOM, Color').color('red').attr({w:128, h:128}));
        * ~~~
        * 
        * @see Crafty.isometric.size
        */
        place: function (x, y, z, obj) {
            var pos = this.pos2px(x,y);
            pos.top -= z * (this._tile.width / 2);
            obj.attr({
                x: pos.left + Crafty.viewport._x, 
                y: pos.top + Crafty.viewport._y
            }).z += z;
            return this;
        },
        /**@
         * #Crafty.isometric.pos2px
         * @comp Crafty.isometric
         * @sign public this Crafty.isometric.pos2px(Number x,Number y)
         * @param x 
         * @param y
         * @return Object {left Number,top Number}
         * 
         * This method calculate the X and Y Coordinates to Pixel Positions
         * 
         * @example
         * ~~~
         * var iso = Crafty.isometric.size(128,96);
         * var position = iso.pos2px(100,100); //Object { left=12800, top=4800}
         * ~~~
         */
        pos2px:function(x,y){
            return {
                left:x * this._tile.width + (y & 1) * (this._tile.width / 2),
                top:y * this._tile.height / 2 
            }
        },
         /**@
         * #Crafty.isometric.px2pos
         * @comp Crafty.isometric
         * @sign public this Crafty.isometric.px2pos(Number left,Number top)
         * @param top 
         * @param left
         * @return Object {x Number,y Number}
         * 
         * This method calculate pixel top,left positions to x,y coordinates
         * 
         * @example
         * ~~~
         * var iso = Crafty.isometric.size(128,96);
         * var px = iso.pos2px(12800,4800);
         * console.log(px); //Object { x=-100, y=-100}
         * ~~~
         */
        px2pos:function(left,top){
            return {
                x:Math.ceil(-left / this._tile.width - (top & 1)*0.5),
                y:-top / this._tile.height * 2
            }; 
        },
        /**@
         * #Crafty.isometric.centerAt
         * @comp Crafty.isometric
         * @sign public this Crafty.isometric.centerAt(Number x,Number y)
         * @param top 
         * @param left
         * 
         * This method center the Viewport at x/y location or gives the current centerpoint of the viewport
         * 
         * @example
         * ~~~
         * var iso = Crafty.isometric.size(128,96).centerAt(10,10); //Viewport is now moved
         * //After moving the viewport by another event you can get the new center point
         * console.log(iso.centerAt());
         * ~~~
         */
        centerAt:function(x,y){   
            if(typeof x == "number" && typeof y == "number"){
                var center = this.pos2px(x,y);
                Crafty.viewport._x = -center.left+Crafty.viewport.width/2-this._tile.width/2;
                Crafty.viewport._y = -center.top+Crafty.viewport.height/2-this._tile.height/2;
                return this;
            }else{
                return {
                    top:-Crafty.viewport._y+Crafty.viewport.height/2-this._tile.height/2,
                    left:-Crafty.viewport._x+Crafty.viewport.width/2-this._tile.width/2
                } 
            }
        },
        /**@
         * #Crafty.isometric.area
         * @comp Crafty.isometric
         * @sign public this Crafty.isometric.area()
         * @return Object {x:{start Number,end Number},y:{start Number,end Number}}
         * 
         * This method get the Area surrounding by the centerpoint depends on viewport height and width
         * 
         * @example
         * ~~~
         * var iso = Crafty.isometric.size(128,96).centerAt(10,10); //Viewport is now moved
         * var area = iso.area(); //get the area
         * for(var y = area.y.start;y <= area.y.end;y++){
         *   for(var x = area.x.start ;x <= area.x.end;x++){
         *       iso.place(x,y,0,Crafty.e("2D,DOM,gras")); //Display tiles in the Screen
         *   }
         * }  
         * ~~~
         */
        area:function(){
            //Get the center Point in the viewport
            var center = this.centerAt();
            var start = this.px2pos(-center.left+Crafty.viewport.width/2,-center.top+Crafty.viewport.height/2);
            var end = this.px2pos(-center.left-Crafty.viewport.width/2,-center.top-Crafty.viewport.height/2);
            return {
                x:{
                    start : start.x,
                    end : end.x
                },
                y:{
                    start : start.y,
                    end : end.y
                }
            };
        } 
    }
});


/**@
* #Particles
* @category Graphics
* Based on Parcycle by Mr. Speaker, licensed under the MIT, Ported by Leo Koppelkamm
* **This is canvas only & won't do anything if the browser doesn't support it!**
* To see how this works take a look in https://github.com/craftyjs/Crafty/blob/master/src/particles.js
*/
Crafty.c("Particles", {
	init: function () {
		//We need to clone it
		this._Particles = Crafty.clone(this._Particles);
	},

	/**@
    * #.particles
    * @comp Particles
    * @sign public this .particles(Object options)
    * @param options - Map of options that specify the behavior and look of the particles.
    *
    * @example
    * ~~~
	* var options = {
	*	maxParticles: 150,
	*	size: 18,
	*	sizeRandom: 4,
	*	speed: 1,
	*	speedRandom: 1.2,
	*	// Lifespan in frames
	*	lifeSpan: 29,
	*	lifeSpanRandom: 7,
	*	// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
	*	angle: 65,
	*	angleRandom: 34,
	*	startColour: [255, 131, 0, 1],
	*	startColourRandom: [48, 50, 45, 0],
	*	endColour: [245, 35, 0, 0],
	*	endColourRandom: [60, 60, 60, 0],
	*	// Only applies when fastMode is off, specifies how sharp the gradients are drawn
	*	sharpness: 20,
	*	sharpnessRandom: 10,
	*	// Random spread from origin
	*	spread: 10,
	*	// How many frames should this last
	*	duration: -1,
	*	// Will draw squares instead of circle gradients
	*	fastMode: false,
	*	gravity: { x: 0, y: 0.1 },
	*	// sensible values are 0-3
	*	jitter: 0
	* }
	*
	* Crafty.e("2D,Canvas,Particles").particles(options);
    * ~~~
    */
	particles: function (options) {

		if (!Crafty.support.canvas || Crafty.deactivateParticles) return this;

		//If we drew on the main canvas, we'd have to redraw
		//potentially huge sections of the screen every frame
		//So we create a separate canvas, where we only have to redraw
		//the changed particles.
		var c, ctx, relativeX, relativeY, bounding;

		c = document.createElement("canvas");
		c.width = Crafty.viewport.width;
		c.height = Crafty.viewport.height;
		c.style.position = 'absolute';

		Crafty.stage.elem.appendChild(c);

		ctx = c.getContext('2d');

		this._Particles.init(options);

		// Clean up the DOM when this component is removed
		this.bind('Remove', function () {
			Crafty.stage.elem.removeChild(c);
		}).bind("RemoveComponent", function (id) {
			if (id === "particles")
				Crafty.stage.elem.removeChild(c);
		});;

		relativeX = this.x + Crafty.viewport.x;
		relativeY = this.y + Crafty.viewport.y;
		this._Particles.position = this._Particles.vectorHelpers.create(relativeX, relativeY);

		var oldViewport = { x: Crafty.viewport.x, y: Crafty.viewport.y };

		this.bind('EnterFrame', function () {
			relativeX = this.x + Crafty.viewport.x;
			relativeY = this.y + Crafty.viewport.y;
			this._Particles.viewportDelta = { x: Crafty.viewport.x - oldViewport.x, y: Crafty.viewport.y - oldViewport.y };

			oldViewport = { x: Crafty.viewport.x, y: Crafty.viewport.y };

			this._Particles.position = this._Particles.vectorHelpers.create(relativeX, relativeY);

			//Selective clearing
			if (typeof Crafty.DrawManager.boundingRect == 'function') {
				bounding = Crafty.DrawManager.boundingRect(this._Particles.register);
				if (bounding) ctx.clearRect(bounding._x, bounding._y, bounding._w, bounding._h);
			} else {
				ctx.clearRect(0, 0, Crafty.viewport.width, Crafty.viewport.height);
			}

			//This updates all particle colors & positions
			this._Particles.update();

			//This renders the updated particles
			this._Particles.render(ctx);
		});
		return this;
	},
	_Particles: {
		presets: {
			maxParticles: 150,
			size: 18,
			sizeRandom: 4,
			speed: 1,
			speedRandom: 1.2,
			// Lifespan in frames
			lifeSpan: 29,
			lifeSpanRandom: 7,
			// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
			angle: 65,
			angleRandom: 34,
			startColour: [255, 131, 0, 1],
			startColourRandom: [48, 50, 45, 0],
			endColour: [245, 35, 0, 0],
			endColourRandom: [60, 60, 60, 0],
			// Only applies when fastMode is off, specifies how sharp the gradients are drawn
			sharpness: 20,
			sharpnessRandom: 10,
			// Random spread from origin
			spread: 10,
			// How many frames should this last
			duration: -1,
			// Will draw squares instead of circle gradients
			fastMode: false,
			gravity: { x: 0, y: 0.1 },
			// sensible values are 0-3
			jitter: 0,

			//Don't modify the following
			particles: [],
			active: true,
			particleCount: 0,
			elapsedFrames: 0,
			emissionRate: 0,
			emitCounter: 0,
			particleIndex: 0
		},


		init: function (options) {
			this.position = this.vectorHelpers.create(0, 0);
			if (typeof options == 'undefined') var options = {};

			//Create current config by merging given options and presets.
			for (key in this.presets) {
				if (typeof options[key] != 'undefined') this[key] = options[key];
				else this[key] = this.presets[key];
			}

			this.emissionRate = this.maxParticles / this.lifeSpan;
			this.positionRandom = this.vectorHelpers.create(this.spread, this.spread);
		},

		addParticle: function () {
			if (this.particleCount == this.maxParticles) {
				return false;
			}

			// Take the next particle out of the particle pool we have created and initialize it
			var particle = new this.particle(this.vectorHelpers);
			this.initParticle(particle);
			this.particles[this.particleCount] = particle;
			// Increment the particle count
			this.particleCount++;

			return true;
		},
		RANDM1TO1: function () {
			return Math.random() * 2 - 1;
		},
		initParticle: function (particle) {
			particle.position.x = this.position.x + this.positionRandom.x * this.RANDM1TO1();
			particle.position.y = this.position.y + this.positionRandom.y * this.RANDM1TO1();

			var newAngle = (this.angle + this.angleRandom * this.RANDM1TO1()) * (Math.PI / 180); // convert to radians
			var vector = this.vectorHelpers.create(Math.sin(newAngle), -Math.cos(newAngle)); // Could move to lookup for speed
			var vectorSpeed = this.speed + this.speedRandom * this.RANDM1TO1();
			particle.direction = this.vectorHelpers.multiply(vector, vectorSpeed);

			particle.size = this.size + this.sizeRandom * this.RANDM1TO1();
			particle.size = particle.size < 0 ? 0 : ~~particle.size;
			particle.timeToLive = this.lifeSpan + this.lifeSpanRandom * this.RANDM1TO1();

			particle.sharpness = this.sharpness + this.sharpnessRandom * this.RANDM1TO1();
			particle.sharpness = particle.sharpness > 100 ? 100 : particle.sharpness < 0 ? 0 : particle.sharpness;
			// internal circle gradient size - affects the sharpness of the radial gradient
			particle.sizeSmall = ~~((particle.size / 200) * particle.sharpness); //(size/2/100)
			var start = [
				this.startColour[0] + this.startColourRandom[0] * this.RANDM1TO1(),
				this.startColour[1] + this.startColourRandom[1] * this.RANDM1TO1(),
				this.startColour[2] + this.startColourRandom[2] * this.RANDM1TO1(),
				this.startColour[3] + this.startColourRandom[3] * this.RANDM1TO1()
				];

			var end = [
				this.endColour[0] + this.endColourRandom[0] * this.RANDM1TO1(),
				this.endColour[1] + this.endColourRandom[1] * this.RANDM1TO1(),
				this.endColour[2] + this.endColourRandom[2] * this.RANDM1TO1(),
				this.endColour[3] + this.endColourRandom[3] * this.RANDM1TO1()
				];

			particle.colour = start;
			particle.deltaColour[0] = (end[0] - start[0]) / particle.timeToLive;
			particle.deltaColour[1] = (end[1] - start[1]) / particle.timeToLive;
			particle.deltaColour[2] = (end[2] - start[2]) / particle.timeToLive;
			particle.deltaColour[3] = (end[3] - start[3]) / particle.timeToLive;
		},
		update: function () {
			if (this.active && this.emissionRate > 0) {
				var rate = 1 / this.emissionRate;
				this.emitCounter++;
				while (this.particleCount < this.maxParticles && this.emitCounter > rate) {
					this.addParticle();
					this.emitCounter -= rate;
				}
				this.elapsedFrames++;
				if (this.duration != -1 && this.duration < this.elapsedFrames) {
					this.stop();
				}
			}

			this.particleIndex = 0;
			this.register = [];
			var draw;
			while (this.particleIndex < this.particleCount) {

				var currentParticle = this.particles[this.particleIndex];

				// If the current particle is alive then update it
				if (currentParticle.timeToLive > 0) {

					// Calculate the new direction based on gravity
					currentParticle.direction = this.vectorHelpers.add(currentParticle.direction, this.gravity);
					currentParticle.position = this.vectorHelpers.add(currentParticle.position, currentParticle.direction);
					currentParticle.position = this.vectorHelpers.add(currentParticle.position, this.viewportDelta);
					if (this.jitter) {
						currentParticle.position.x += this.jitter * this.RANDM1TO1();
						currentParticle.position.y += this.jitter * this.RANDM1TO1();
					}
					currentParticle.timeToLive--;

					// Update colours
					var r = currentParticle.colour[0] += currentParticle.deltaColour[0];
					var g = currentParticle.colour[1] += currentParticle.deltaColour[1];
					var b = currentParticle.colour[2] += currentParticle.deltaColour[2];
					var a = currentParticle.colour[3] += currentParticle.deltaColour[3];

					// Calculate the rgba string to draw.
					draw = [];
					draw.push("rgba(" + (r > 255 ? 255 : r < 0 ? 0 : ~~r));
					draw.push(g > 255 ? 255 : g < 0 ? 0 : ~~g);
					draw.push(b > 255 ? 255 : b < 0 ? 0 : ~~b);
					draw.push((a > 1 ? 1 : a < 0 ? 0 : a.toFixed(2)) + ")");
					currentParticle.drawColour = draw.join(",");

					if (!this.fastMode) {
						draw[3] = "0)";
						currentParticle.drawColourEnd = draw.join(",");
					}

					this.particleIndex++;
				} else {
					// Replace particle with the last active
					if (this.particleIndex != this.particleCount - 1) {
						this.particles[this.particleIndex] = this.particles[this.particleCount - 1];
					}
					this.particleCount--;
				}
				var rect = {};
				rect._x = ~~currentParticle.position.x;
				rect._y = ~~currentParticle.position.y;
				rect._w = currentParticle.size;
				rect._h = currentParticle.size;

				this.register.push(rect);
			}
		},

		stop: function () {
			this.active = false;
			this.elapsedFrames = 0;
			this.emitCounter = 0;
		},

		render: function (context) {

			for (var i = 0, j = this.particleCount; i < j; i++) {
				var particle = this.particles[i];
				var size = particle.size;
				var halfSize = size >> 1;

				if (particle.position.x + size < 0
					|| particle.position.y + size < 0
					|| particle.position.x - size > Crafty.viewport.width
					|| particle.position.y - size > Crafty.viewport.height) {
					//Particle is outside
					continue;
				}
				var x = ~~particle.position.x;
				var y = ~~particle.position.y;

				if (this.fastMode) {
					context.fillStyle = particle.drawColour;
				} else {
					var radgrad = context.createRadialGradient(x + halfSize, y + halfSize, particle.sizeSmall, x + halfSize, y + halfSize, halfSize);
					radgrad.addColorStop(0, particle.drawColour);
					//0.9 to avoid visible boxing
					radgrad.addColorStop(0.9, particle.drawColourEnd);
					context.fillStyle = radgrad;
				}
				context.fillRect(x, y, size, size);
			}
		},
		particle: function (vectorHelpers) {
			this.position = vectorHelpers.create(0, 0);
			this.direction = vectorHelpers.create(0, 0);
			this.size = 0;
			this.sizeSmall = 0;
			this.timeToLive = 0;
			this.colour = [];
			this.drawColour = "";
			this.deltaColour = [];
			this.sharpness = 0;
		},
		vectorHelpers: {
			create: function (x, y) {
				return {
					"x": x,
					"y": y
				};
			},
			multiply: function (vector, scaleFactor) {
				vector.x *= scaleFactor;
				vector.y *= scaleFactor;
				return vector;
			},
			add: function (vector1, vector2) {
				vector1.x += vector2.x;
				vector1.y += vector2.y;
				return vector1;
			}
		}
	}
});

Crafty.extend({
	/**@
	 * #Crafty.audio
	 * @category Audio
	 *
	 * Add sound files and play them. Chooses best format for browser support.
	 * Due to the nature of HTML5 audio, three types of audio files will be
	 * required for cross-browser capabilities. These formats are MP3, Ogg and WAV.
	 * When sound was not muted on before pause, sound will be unmuted after unpause.
	 * When sound is muted Crafty.pause() does not have any effect on sound.
	 */
	audio : {
		sounds : {},
		supported : {},
		codecs : {// Chart from jPlayer
			ogg : 'audio/ogg; codecs="vorbis"', //OGG
			wav : 'audio/wav; codecs="1"', // PCM
			webma : 'audio/webm; codecs="vorbis"', // WEBM
			mp3 : 'audio/mpeg; codecs="mp3"', //MP3
			m4a : 'audio/mp4; codecs="mp4a.40.2"'// AAC / MP4
		},
		volume : 1, //Global Volume
		muted : false,
		paused : false,
		/**
		 * Function to setup supported formats
		 **/
		canPlay : function() {
			var audio = this.audioElement(), canplay;
			for (var i in this.codecs) {
				canplay = audio.canPlayType(this.codecs[i]);
				if (canplay !== "" && canplay !== "no") {
					this.supported[i] = true;
				} else {
					this.supported[i] = false;
				}
			}

		},
		/**
		 * Function to get an Audio Element
		 **/
		audioElement : function() {
			//IE does not support Audio Object
			return typeof Audio !== 'undefined' ? new Audio("") : document.createElement('audio');
		},
		/**@
		 * #Crafty.audio.add
		 * @comp Crafty.audio
		 * @sign public this Crafty.audio.add(String id, String url)
		 * @param id - A string to refer to sounds
		 * @param url - A string pointing to the sound file
		 * @sign public this Crafty.audio.add(String id, Array urls)
		 * @param urls - Array of urls pointing to different format of the same sound, selecting the first that is playable
		 * @sign public this Crafty.audio.add(Object map)
		 * @param map - key-value pairs where the key is the `id` and the value is either a `url` or `urls`
		 *
		 * Loads a sound to be played. Due to the nature of HTML5 audio,
		 * three types of audio files will be required for cross-browser capabilities.
		 * These formats are MP3, Ogg and WAV.
		 *
		 * Passing an array of URLs will determine which format the browser can play and select it over any other.
		 *
		 * Accepts an object where the key is the audio name and
		 * either a URL or an Array of URLs (to determine which type to use).
		 *
		 * The ID you use will be how you refer to that sound when using `Crafty.audio.play`.
		 *
		 * @example
		 * ~~~
		 * //adding audio from an object
		 * Crafty.audio.add({
		 * shoot: ["sounds/shoot.wav",
		 * "sounds/shoot.mp3",
		 * "sounds/shoot.ogg"],
		 *
		 * coin: "sounds/coin.mp3"
		 * });
		 *
		 * //adding a single sound
		 * Crafty.audio.add("walk", [
		 * "sounds/walk.mp3",
		 * "sounds/walk.ogg",
		 * "sounds/walk.wav"
		 * ]);
		 *
		 * //only one format
		 * Crafty.audio.add("jump", "sounds/jump.mp3");
		 * ~~~
		 */
		add : function(id, url) {
			Crafty.support.audio = !!this.audioElement().canPlayType;
			//Setup audio support
			if (!Crafty.support.audio)
				return;

			this.canPlay();
			//Setup supported Extensions

			var audio, ext, path;
			if (arguments.length === 1 && typeof id === "object") {
				for (var i in id) {
					for (var src in id[i]) {
						audio = this.audioElement();
						audio.id = i;
						audio.preload = "auto";
						audio.volume = Crafty.audio.volume;
						path = id[i][src];
						ext = path.substr(path.lastIndexOf('.') + 1).toLowerCase();
						if (this.supported[ext]) {
							audio.src = path;
							Crafty.asset(path, audio);
							this.sounds[i] = {
								obj : audio,
								played : 0,
								volume : Crafty.audio.volume
							}
						}

					}
				}
			}
			if ( typeof id === "string") {
				audio = this.audioElement();
				audio.id = id;
				audio.preload = "auto";
				audio.volume = Crafty.audio.volume;

				if ( typeof url === "string") {
					ext = url.substr(url.lastIndexOf('.') + 1).toLowerCase();
					if (this.supported[ext]) {
						audio.src = url;
						Crafty.asset(url, audio);
						this.sounds[id] = {
							obj : audio,
							played : 0,
							volume : Crafty.audio.volume
						}

					}

				}

				if ( typeof url === "object") {
					for (src in url) {
						audio = this.audioElement();
						audio.id = id;
						audio.preload = "auto";
						audio.volume = Crafty.audio.volume;
						path = url[src];
						ext = path.substr(path.lastIndexOf('.') + 1).toLowerCase();
						if (this.supported[ext]) {
							audio.src = path;
							Crafty.asset(path, audio);
							this.sounds[id] = {
								obj : audio,
								played : 0,
								volume : Crafty.audio.volume
							}
						}

					}
				}

			}

		},
		/**@
		 * #Crafty.audio.play
		 * @comp Crafty.audio
		 * @sign public this Crafty.audio.play(String id)
		 * @sign public this Crafty.audio.play(String id, Number repeatCount)
		 * @sign public this Crafty.audio.play(String id, Number repeatCount,Number volume)
		 * @param id - A string to refer to sounds
		 * @param repeatCount - Repeat count for the file, where -1 stands for repeat forever.
		 * @param volume - volume can be a number between 0.0 and 1.0
		 *
		 * Will play a sound previously added by using the ID that was used in `Crafty.audio.add`.
		 * Has a default maximum of 5 channels so that the same sound can play simultaneously unless all of the channels are playing.

		 * *Note that the implementation of HTML5 Audio is buggy at best.*
		 *
		 * @example
		 * ~~~
		 * Crafty.audio.play("walk");
		 *
		 * //play and repeat forever
		 * Crafty.audio.play("backgroundMusic", -1);
		 * Crafty.audio.play("explosion",1,0.5); //play sound once with volume of 50%
		 * ~~~
		 */
		play : function(id, repeat, volume) {
			if (repeat == 0 || !Crafty.support.audio || !this.sounds[id])
				return;
			var s = this.sounds[id];
			s.volume = s.obj.volume = volume || Crafty.audio.volume;
			if (s.obj.currentTime)
				s.obj.currentTime = 0;
			if (this.muted)
				s.obj.volume = 0;
			s.obj.play();
			s.played++;
			s.obj.addEventListener("ended", function() {
				if (s.played < repeat || repeat == -1) {
					if (this.currentTime)
						this.currentTime = 0;
					this.play();
					s.played++;
				}
			}, true);
		},
		/**@
		 * #Crafty.audio.stop
		 * @sign public this Crafty.audio.stop([Number ID])
		 *
		 * Stops any playing sound. if id is not set, stop all sounds which are playing
		 *
		 * @example
		 * ~~~
		 * //all sounds stopped playing now
		 * Crafty.audio.stop();
		 *
		 * ~~~
		 */
		stop : function(id) {
			if (!Crafty.support.audio)
				return;
			var s;
			if (!id) {
				for (var i in this.sounds) {
					s = this.sounds[i];
					if (!s.obj.paused)
						s.obj.pause();
				}
			}
			if (!this.sounds[id])
				return;
			s = this.sounds[id];
			if (!s.obj.paused)
				s.obj.pause();
		},
		/**
		 * #Crafty.audio._mute
		 * @sign public this Crafty.audio._mute([Boolean mute])
		 *
		 * Mute or unmute every Audio instance that is playing.
		 */
		_mute : function(mute) {
			if (!Crafty.support.audio)
				return;
			var s;
			for (var i in this.sounds) {
				s = this.sounds[i];
				s.obj.volume = mute ? 0 : s.volume;
			}
			this.muted = mute;
		},
		/**@
		 * #Crafty.audio.toggleMute
		 * @sign public this Crafty.audio.toggleMute()
		 *
		 * Mute or unmute every Audio instance that is playing. Toggles between
		 * pausing or playing depending on the state.
		 *
		 * @example
		 * ~~~
		 * //toggle mute and unmute depending on current state
		 * Crafty.audio.toggleMute();
		 * ~~~
		 */
		toggleMute : function() {
			if (!this.muted) {
				this._mute(true);
			} else {
				this._mute(false);
			}

		},
		/**@
		 * #Crafty.audio.mute
		 * @sign public this Crafty.audio.mute()
		 *
		 * Mute every Audio instance that is playing.
		 *
		 * @example
		 * ~~~
		 * Crafty.audio.mute();
		 * ~~~
		 */
		mute : function() {
			this._mute(true);
		},
		/**@
		 * #Crafty.audio.unmute
		 * @sign public this Crafty.audio.unmute()
		 *
		 * Unmute every Audio instance that is playing.
		 *
		 * @example
		 * ~~~
		 * Crafty.audio.unmute();
		 * ~~~
		 */
		unmute : function() {
			this._mute(false);
		},

		/**@
		 * #Crafty.audio.pause
		 * @sign public this Crafty.audio.pause(string ID)
		 *
		 * Pause the Audio instance specified by id param.
		 *
		 * @example
		 * ~~~
		 * Crafty.audio.pause('music');
		 * ~~~
		 *
		 * @param {string} id The id of the audio object to pause
		 */
		pause : function(id) {
			if (!Crafty.support.audio || !id || !this.sounds[id])
				return;
			var s = this.sounds[id];
			if (!s.obj.paused)
				s.obj.pause();
		},

		/**@
		 * #Crafty.audio.unpause
		 * @sign public this Crafty.audio.unpause(string ID)
		 *
		 * Resume playing the Audio instance specified by id param.
		 *
		 * @example
		 * ~~~
		 * Crafty.audio.unpause('music');
		 * ~~~
		 *
		 * @param {string} id The id of the audio object to unpause
		 */
		unpause : function(id) {
			if (!Crafty.support.audio || !id || !this.sounds[id])
				return;
			var s = this.sounds[id];
			if (s.obj.paused)
				s.obj.play();
		},

		/**@
		 * #Crafty.audio.togglePause
		 * @sign public this Crafty.audio.togglePause(string ID)
		 *
		 * Toggle the pause status of the Audio instance specified by id param.
		 *
		 * @example
		 * ~~~
		 * Crafty.audio.togglePause('music');
		 * ~~~
		 *
		 * @param {string} id The id of the audio object to pause/unpause
		 */
		togglePause : function(id) {
			if (!Crafty.support.audio || !id || !this.sounds[id])
				return;
			var s = this.sounds[id];
			if (s.obj.paused) {
				s.obj.play();
			} else {
				s.obj.pause();
			}
		}
	}
});


/**@
* #Text
* @category Graphics
* @trigger Change - when the text is changed
* @requires Canvas or DOM
* Component to draw text inside the body of an entity.
*/
Crafty.c("Text", {
	_text: "",
	_textFont: {
		"type": "",
		"weight": "",
		"size": "",
		"family": ""
	},
	ready: true,

	init: function () {
		this.requires("2D");

		this.bind("Draw", function (e) {
			var font = this._textFont["type"] + ' ' + this._textFont["weight"] + ' ' +
				this._textFont["size"] + ' ' + this._textFont["family"];

			if (e.type === "DOM") {
				var el = this._element,
					style = el.style;

				style.color = this._textColor;
				style.font = font;
				el.innerHTML = this._text;
			} else if (e.type === "canvas") {
				var context = e.ctx,
                    metrics = null;

				context.save();

				context.fillStyle = this._textColor || "rgb(0,0,0)";
				context.font = font;

				context.translate(this.x, this.y + this.h);
				context.fillText(this._text, 0, 0);

				metrics = context.measureText(this._text);
				this._w = metrics.width;

				context.restore();
			}
		});
	},

	/**@
    * #.text
    * @comp Text
    * @sign public this .text(String text)
    * @sign public this .text(Function textgenerator)
    * @param text - String of text that will be inserted into the DOM or Canvas element.
    * 
    * This method will update the text inside the entity.
    * If you use DOM, to modify the font, use the `.css` method inherited from the DOM component.
    *
    * If you need to reference attributes on the entity itself you can pass a function instead of a string.
    * 
    * @example
    * ~~~
    * Crafty.e("2D, DOM, Text").attr({ x: 100, y: 100 }).text("Look at me!!");
    *
    * Crafty.e("2D, DOM, Text").attr({ x: 100, y: 100 })
    *     .text(function () { return "My position is " + this._x });
    *
    * Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 }).text("Look at me!!");
    *
    * Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 })
    *     .text(function () { return "My position is " + this._x });
    * ~~~
    */
	text: function (text) {
		if (!(typeof text !== "undefined" && text !== null)) return this._text;
		if (typeof(text) == "function")
			this._text = text.call(this);
		else
			this._text = text;
		this.trigger("Change");
		return this;
	},

	/**@
    * #.textColor
    * @comp Text
    * @sign public this .textColor(String color, Number strength)
    * @param color - The color in hexadecimal
    * @param strength - Level of opacity
    *
    * Modify the text color and level of opacity.
    * 
    * @example
    * ~~~
    * Crafty.e("2D, DOM, Text").attr({ x: 100, y: 100 }).text("Look at me!!")
    *   .textColor('#FF0000');
    *
    * Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 }).text('Look at me!!')
    *   .textColor('#FF0000', 0.6);
    * ~~~
    * @see Crafty.toRGB
    */
	textColor: function (color, strength) {
		this._strength = strength;
		this._textColor = Crafty.toRGB(color, this._strength);
		this.trigger("Change");
		return this;
	},

	/**@
    * #.textFont
    * @comp Text
    * @triggers Change
    * @sign public this .textFont(String key, * value)
    * @param key - Property of the entity to modify
    * @param value - Value to set the property to
    *
    * @sign public this .textFont(Object map)
    * @param map - Object where the key is the property to modify and the value as the property value
    *
    * Use this method to set font property of the text entity.
    * 
    * @example
    * ~~~
    * Crafty.e("2D, DOM, Text").textFont({ type: 'italic', family: 'Arial' });
    * Crafty.e("2D, Canvas, Text").textFont({ size: '20px', weight: 'bold' });
    *
    * Crafty.e("2D, Canvas, Text").textFont("type", "italic");
    * Crafty.e("2D, Canvas, Text").textFont("type"); // italic
    * ~~~
    */
	textFont: function (key, value) {
		if (arguments.length === 1) {
			//if just the key, return the value
			if (typeof key === "string") {
				return this._textFont[key];
			}

			if (typeof key === "object") {
				for (propertyKey in key) {
					this._textFont[propertyKey] = key[propertyKey];
				}
			}
		} else {
			this._textFont[key] = value;
		}

		this.trigger("Change");
		return this;
	}
});


Crafty.extend({
/**@
	* #Crafty.assets
	* @category Assets
	* An object containing every asset used in the current Crafty game.
	* The key is the URL and the value is the `Audio` or `Image` object.
	*
	* If loading an asset, check that it is in this object first to avoid loading twice.
	* 
	* @example
	* ~~~
	* var isLoaded = !!Crafty.assets["images/sprite.png"];
	* ~~~
	* @see Crafty.loader
	*/
	assets: {},

    /**@
    * #Crafty.asset
    * @category Assets
    * 
    * @trigger NewAsset - After setting new asset - Object - key and value of new added asset.
    * @sign public void Crafty.asset(String key, Object asset)
    * @param key - asset url.
    * @param asset - Audio` or `Image` object.
    * Add new asset to assets object.
    * 
    * @sign public void Crafty.asset(String key)
    * @param key - asset url.
    * Get asset from assets object.
    * 
    * @example
    * ~~~
    * Crafty.asset(key, value);
    * var asset = Crafty.asset(key); //object with key and value fields
    * ~~~
    * 
    * @see Crafty.assets
    */
    asset: function(key, value) {
        if (arguments.length === 1) {
            return Crafty.assets[key];
        }

        if (!Crafty.assets[key]) {
            Crafty.assets[key] = value;
            this.trigger("NewAsset", {key : key, value : value});
        }
    },
        /**@
	* #Crafty.image_whitelist
	* @category Assets
	* 
    * 
    * A list of file extensions that can be loaded as images by Crafty.load
    *
	* @example
	* ~~~
        * Crafty.image_whitelist.push("tif")
	* Crafty.load(["images/sprite.tif", "sounds/jump.mp3"],
	*     function() {
	*         //when loaded
	*         Crafty.scene("main"); //go to main scene
	*         Crafty.audio.play("jump.mp3"); //Play the audio file
	*     },
	*
	*     function(e) {
	*       //progress
	*     },
	*
	*     function(e) {
	*       //uh oh, error loading
	*     }
	* );
	* ~~~
	* 
	* @see Crafty.asset
        * @see Crafty.load
	*/
    image_whitelist: ["jpg", "jpeg", "gif", "png", "svg"],
	/**@
	* #Crafty.loader
	* @category Assets
	* @sign public void Crafty.load(Array assets, Function onLoad[, Function onProgress, Function onError])
	* @param assets - Array of assets to load (accepts sounds and images)
	* @param onLoad - Callback when the assets are loaded
	* @param onProgress - Callback when an asset is loaded. Contains information about assets loaded
	* @param onError - Callback when an asset fails to load
	* 
	* Preloader for all assets. Takes an array of URLs and
	* adds them to the `Crafty.assets` object.
	*
	* Files with suffixes in `image_whitelist` (case insensitive) will be loaded.
	*
	* If `Crafty.support.audio` is `true`, files with the following suffixes `mp3`, `wav`, `ogg` and `mp4` (case insensitive) can be loaded.
	*
	* The `onProgress` function will be passed on object with information about
	* the progress including how many assets loaded, total of all the assets to
	* load and a percentage of the progress.
    * ~~~
    * { loaded: j, total: total, percent: (j / total * 100) ,src:src})
	* ~~~
	*
	* `onError` will be passed with the asset that couldn't load.
    *
	* When `onError` is not provided, the onLoad is loaded even some assets are not successfully loaded. Otherwise, onLoad will be called no matter whether there are errors or not. 
	* 
	* @example
	* ~~~
	* Crafty.load(["images/sprite.png", "sounds/jump.mp3"],
	*     function() {
	*         //when loaded
	*         Crafty.scene("main"); //go to main scene
	*         Crafty.audio.play("jump.mp3"); //Play the audio file
	*     },
	*
	*     function(e) {
	*       //progress
	*     },
	*
	*     function(e) {
	*       //uh oh, error loading
	*     }
	* );
	* ~~~
	* 
	* @see Crafty.assets
        * @see Crafty.image_whitelist
	*/
    load: function (data, oncomplete, onprogress, onerror) {
            
        var i = 0, l = data.length, current, obj, total = l, j = 0, ext = "" ;
  
        //Progress function
        function pro(){
            var src = this.src;
           
            //Remove events cause audio trigger this event more than once(depends on browser)
            if (this.removeEventListener) {  
                this.removeEventListener('canplaythrough', pro, false);     
            }
           
            ++j;
            //if progress callback, give information of assets loaded, total and percent
            if (onprogress) 
                onprogress({
                    loaded: j, 
                    total: total, 
                    percent: (j / total * 100),
                    src:src
                });
				
            if(j === total && oncomplete) oncomplete();
        };
        //Error function
        function err(){
            var src = this.src;
            if (onerror) 
                onerror({
                    loaded: j, 
                    total: total, 
                    percent: (j / total * 100),
                    src:src
                });
           		
            j++;
            if(j === total && oncomplete) oncomplete();
        };
           
        for (; i < l; ++i) {       
            current = data[i];
            ext = current.substr(current.lastIndexOf('.') + 1, 3).toLowerCase();
           
            obj = Crafty.asset(current) || null;   
          
            if (Crafty.support.audio && Crafty.audio.supported[ext]) {   
                //Create new object if not exists
                if(!obj){
                    var name = current.substr(current.lastIndexOf('/') + 1).toLowerCase();
                    obj = Crafty.audio.audioElement();
                    obj.id = name;
                    obj.src = current;
                    obj.preload = "auto";
                    obj.volume = Crafty.audio.volume;
                    Crafty.asset(current, obj);
                    Crafty.audio.sounds[name] = {
                        obj:obj,
                        played:0
                    } 
                }
        
                //addEventListener is supported on IE9 , Audio as well
                if (obj.addEventListener) {  
                    obj.addEventListener('canplaythrough', pro, false);     
                }
                   
                 
            } else if (Crafty.image_whitelist.indexOf(ext) >= 0) { 
                if(!obj) {
                    obj = new Image();
                    Crafty.asset(current, obj);   
                }
                obj.onload=pro;
                obj.src = current; //setup src after onload function Opera/IE Bug
             
            } else {
                total--;
                continue; //skip if not applicable
            }
            obj.onerror = err;
        }
       
       
    },
	/**@
	* #Crafty.modules
	* @category Assets
	* @sign public void Crafty.modules([String repoLocation,] Object moduleMap[, Function onLoad])
	* @param modules - Map of name:version pairs for modules to load
	* @param onLoad - Callback when the modules are loaded
	* 
	* Browse the selection of community modules on http://craftycomponents.com
	* 
    * It is possible to create your own repository.
	*
	*
	* @example
	* ~~~
	* // Loading from default repository
	* Crafty.modules({ moveto: 'DEV' }, function () {
	*     //module is ready
	*     Crafty.e("MoveTo, 2D, DOM");
	* });
	*
	* // Loading from your own server
	* Crafty.modules({ 'http://mydomain.com/js/mystuff.js': 'DEV' }, function () {
	*     //module is ready
	*     Crafty.e("MoveTo, 2D, DOM");
	* });
	*
	* // Loading from alternative repository
	* Crafty.modules('http://cdn.crafty-modules.com', { moveto: 'DEV' }, function () {
	*     //module is ready
	*     Crafty.e("MoveTo, 2D, DOM");
	* });
	*
	* // Loading from the latest component website
	* Crafty.modules(
	*     'http://cdn.craftycomponents.com'
	*     , { MoveTo: 'release' }
	*     , function () {
	*     Crafty.e("2D, DOM, Color, MoveTo")
	*       .attr({x: 0, y: 0, w: 50, h: 50})
	*       .color("green");
	*     });
	* });
	* ~~~
	*
	*/
	modules: function (modulesRepository, moduleMap, oncomplete) {

		if (arguments.length === 2 && typeof modulesRepository === "object") {
			oncomplete = moduleMap;
			moduleMap = modulesRepository;
			modulesRepository = 'http://cdn.craftycomponents.com';
		}

		/*!
		  * $script.js Async loader & dependency manager
		  * https://github.com/ded/script.js
		  * (c) Dustin Diaz, Jacob Thornton 2011
		  * License: MIT
		  */
		var $script = (function () {
			var win = this, doc = document
			, head = doc.getElementsByTagName('head')[0]
			, validBase = /^https?:\/\//
			, old = win.$script, list = {}, ids = {}, delay = {}, scriptpath
			, scripts = {}, s = 'string', f = false
			, push = 'push', domContentLoaded = 'DOMContentLoaded', readyState = 'readyState'
			, addEventListener = 'addEventListener', onreadystatechange = 'onreadystatechange'

			function every(ar, fn, i) {
				for (i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
				return 1
			}
			function each(ar, fn) {
				every(ar, function (el) {
					return !fn(el)
				})
			}

			if (!doc[readyState] && doc[addEventListener]) {
				doc[addEventListener](domContentLoaded, function fn() {
					doc.removeEventListener(domContentLoaded, fn, f)
					doc[readyState] = 'complete'
				}, f)
				doc[readyState] = 'loading'
			}

			function $script(paths, idOrDone, optDone) {
				paths = paths[push] ? paths : [paths]
				var idOrDoneIsDone = idOrDone && idOrDone.call
				, done = idOrDoneIsDone ? idOrDone : optDone
				, id = idOrDoneIsDone ? paths.join('') : idOrDone
				, queue = paths.length
				function loopFn(item) {
					return item.call ? item() : list[item]
				}
				function callback() {
					if (!--queue) {
						list[id] = 1
						done && done()
						for (var dset in delay) {
							every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
						}
					}
				}
				setTimeout(function () {
					each(paths, function (path) {
						if (scripts[path]) {
							id && (ids[id] = 1)
							return scripts[path] == 2 && callback()
						}
						scripts[path] = 1
						id && (ids[id] = 1)
						create(!validBase.test(path) && scriptpath ? scriptpath + path + '.js' : path, callback)
					})
				}, 0)
				return $script
			}

			function create(path, fn) {
				var el = doc.createElement('script')
				, loaded = f
				el.onload = el.onerror = el[onreadystatechange] = function () {
					if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
					el.onload = el[onreadystatechange] = null
					loaded = 1
					scripts[path] = 2
					fn()
				}
				el.async = 1
				el.src = path
				head.insertBefore(el, head.firstChild)
			}

			$script.get = create

			$script.order = function (scripts, id, done) {
				(function callback(s) {
					s = scripts.shift()
					if (!scripts.length) $script(s, id, done)
					else $script(s, callback)
				}())
			}

			$script.path = function (p) {
				scriptpath = p
			}
			$script.ready = function (deps, ready, req) {
				deps = deps[push] ? deps : [deps]
				var missing = [];
				!each(deps, function (dep) {
					list[dep] || missing[push](dep);
				}) && every(deps, function (dep) { return list[dep] }) ?
				ready() : !function (key) {
					delay[key] = delay[key] || []
					delay[key][push](ready)
					req && req(missing)
				}(deps.join('|'))
				return $script
			}

			$script.noConflict = function () {
				win.$script = old;
				return this
			}

			return $script
		})();

		var modules = [];
		var validBase = /^(https?|file):\/\//;
		for (var i in moduleMap) {
			if (validBase.test(i))
				modules.push(i)
			else
				modules.push(modulesRepository + '/' + i.toLowerCase() + '-' + moduleMap[i].toLowerCase() + '.js');
		}

		$script(modules, function () {
			if (oncomplete) oncomplete();
		});
	}
});


/**@
* #Crafty.math
* @category 2D
* Static functions.
*/
Crafty.math = {
/**@
	 * #Crafty.math.abs
	 * @comp Crafty.math
     * @sign public this Crafty.math.abs(Number n)
     * @param n - Some value.
     * @return Absolute value.
     * 
	 * Returns the absolute value.
     */
	abs: function (x) {
		return x < 0 ? -x : x;
	},

	/**@
     * #Crafty.math.amountOf
	 * @comp Crafty.math
	 * @sign public Number Crafty.math.amountOf(Number checkValue, Number minValue, Number maxValue)
     * @param checkValue - Value that should checked with minimum and maximum.
     * @param minValue - Minimum value to check.
     * @param maxValue - Maximum value to check.
     * @return Amount of checkValue compared to minValue and maxValue.
     * 
	 * Returns the amount of how much a checkValue is more like minValue (=0)
     * or more like maxValue (=1)
     */
	amountOf: function (checkValue, minValue, maxValue) {
		if (minValue < maxValue)
			return (checkValue - minValue) / (maxValue - minValue);
		else
			return (checkValue - maxValue) / (minValue - maxValue);
	},


	/**@
     * #Crafty.math.clamp
	 * @comp Crafty.math
	 * @sign public Number Crafty.math.clamp(Number value, Number min, Number max)
     * @param value - A value.
     * @param max - Maximum that value can be.
     * @param min - Minimum that value can be.
     * @return The value between minimum and maximum.
     * 
	 * Restricts a value to be within a specified range.
     */
	clamp: function (value, min, max) {
		if (value > max)
			return max;
		else if (value < min)
			return min;
		else
			return value;
	},

	/**@
     * Converts angle from degree to radian.
	 * @comp Crafty.math
     * @param angleInDeg - The angle in degree.
     * @return The angle in radian.
     */
	degToRad: function (angleInDeg) {
		return angleInDeg * Math.PI / 180;
	},

	/**@
     * #Crafty.math.distance
	 * @comp Crafty.math
	 * @sign public Number Crafty.math.distance(Number x1, Number y1, Number x2, Number y2)
     * @param x1 - First x coordinate.
     * @param y1 - First y coordinate.
     * @param x2 - Second x coordinate.
     * @param y2 - Second y coordinate.
     * @return The distance between the two points.
     * 
	 * Distance between two points.
     */
	distance: function (x1, y1, x2, y2) {
		var squaredDistance = Crafty.math.squaredDistance(x1, y1, x2, y2);
		return Math.sqrt(parseFloat(squaredDistance));
	},

	/**@
     * #Crafty.math.lerp
	 * @comp Crafty.math
	 * @sign public Number Crafty.math.lerp(Number value1, Number value2, Number amount)
     * @param value1 - One value.
     * @param value2 - Another value.
     * @param amount - Amount of value2 to value1.
     * @return Linear interpolated value.
     * 
	 * Linear interpolation. Passing amount with a value of 0 will cause value1 to be returned,
     * a value of 1 will cause value2 to be returned.
     */
	lerp: function (value1, value2, amount) {
		return value1 + (value2 - value1) * amount;
	},

	/**@
     * #Crafty.math.negate
	 * @comp Crafty.math
	 * @sign public Number Crafty.math.negate(Number percent)
     * @param percent - If you pass 1 a -1 will be returned. If you pass 0 a 1 will be returned.
     * @return 1 or -1.
     * 
	 * Returnes "randomly" -1.
     */
	negate: function (percent) {
		if (Math.random() < percent)
			return -1;
		else
			return 1;
	},

	/**@
     * #Crafty.math.radToDeg
	 * @comp Crafty.math
	 * @sign public Number Crafty.math.radToDeg(Number angle)
     * @param angleInRad - The angle in radian.
     * @return The angle in degree.
     * 
	 * Converts angle from radian to degree.
     */
	radToDeg: function (angleInRad) {
		return angleInRad * 180 / Math.PI;
	},

	/**@
     * #Crafty.math.randomElementOfArray
	 * @comp Crafty.math
	 * @sign public Object Crafty.math.randomElementOfArray(Array array)
     * @param array - A specific array.
     * @return A random element of a specific array.
     * 
	 * Returns a random element of a specific array.
     */
	randomElementOfArray: function (array) {
		return array[Math.floor(array.length * Math.random())];
	},

	/**@
     * #Crafty.math.randomInt
	 * @comp Crafty.math
	 * @sign public Number Crafty.math.randomInt(Number start, Number end)
     * @param start - Smallest int value that can be returned.
     * @param end - Biggest int value that can be returned.
     * @return A random int.
     * 
	 * Returns a random int in within a specific range.
     */
	randomInt: function (start, end) {
		return start + Math.floor((1 + end - start) * Math.random());
	},

	/**@
     * #Crafty.math.randomNumber
	 * @comp Crafty.math
	 * @sign public Number Crafty.math.randomInt(Number start, Number end)
     * @param start - Smallest number value that can be returned.
     * @param end - Biggest number value that can be returned.
     * @return A random number.
     * 
	 * Returns a random number in within a specific range.
     */
	randomNumber: function (start, end) {
		return start + (end - start) * Math.random();
	},

	/**@
	 * #Crafty.math.squaredDistance
	 * @comp Crafty.math
	 * @sign public Number Crafty.math.squaredDistance(Number x1, Number y1, Number x2, Number y2)
     * @param x1 - First x coordinate.
     * @param y1 - First y coordinate.
     * @param x2 - Second x coordinate.
     * @param y2 - Second y coordinate.
     * @return The squared distance between the two points.
     * 
	 * Squared distance between two points.
     */
	squaredDistance: function (x1, y1, x2, y2) {
		return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
	},

	/**@
     * #Crafty.math.withinRange
	 * @comp Crafty.math
	 * @sign public Boolean Crafty.math.withinRange(Number value, Number min, Number max)
     * @param value - The specific value.
     * @param min - Minimum value.
     * @param max - Maximum value.
     * @return Returns true if value is within a specific range.
     * 
	 * Check if a value is within a specific range.
     */
	withinRange: function (value, min, max) {
		return (value >= min && value <= max);
	}
};

Crafty.math.Vector2D = (function () {
	/**@
	 * #Crafty.math.Vector2D
	 * @category 2D
	 * @class This is a general purpose 2D vector class
	 *
	 * Vector2D uses the following form:
	 * <x, y>
	 *
	 * @public
	 * @sign public {Vector2D} Vector2D();
	 * @sign public {Vector2D} Vector2D(Vector2D);
	 * @sign public {Vector2D} Vector2D(Number, Number);
	 * @param {Vector2D|Number=0} x
	 * @param {Number=0} y
	 */
	function Vector2D(x, y) {
		if (x instanceof Vector2D) {
			this.x = x.x;
			this.y = x.y;
		} else if (arguments.length === 2) {
			this.x = x;
			this.y = y;
		} else if (arguments.length > 0)
			throw "Unexpected number of arguments for Vector2D()";
	} // class Vector2D

	Vector2D.prototype.x = 0;
	Vector2D.prototype.y = 0;

	/**@
	 * #.add
	 * @comp Crafty.math.Vector2D
     *
	 * Adds the passed vector to this vector
	 *
	 * @public
	 * @sign public {Vector2D} add(Vector2D);
	 * @param {vector2D} vecRH
	 * @returns {Vector2D} this after adding
	 */
	Vector2D.prototype.add = function (vecRH) {
		this.x += vecRH.x;
		this.y += vecRH.y;
		return this;
	} // add

	/**@
	 * #.angleBetween
     * @comp Crafty.math.Vector2D
	 *
	 * Calculates the angle between the passed vector and this vector, using <0,0> as the point of reference.
	 * Angles returned have the range (−π, π].
	 *
	 * @public
	 * @sign public {Number} angleBetween(Vector2D);
	 * @param {Vector2D} vecRH
	 * @returns {Number} the angle between the two vectors in radians
	 */
	Vector2D.prototype.angleBetween = function (vecRH) {
		return Math.atan2(this.x * vecRH.y - this.y * vecRH.x, this.x * vecRH.x + this.y * vecRH.y);
	} // angleBetween

	/**@
	 * #.angleTo
     * @comp Crafty.math.Vector2D
	 *
	 * Calculates the angle to the passed vector from this vector, using this vector as the point of reference.
	 *
	 * @public
	 * @sign public {Number} angleTo(Vector2D);
	 * @param {Vector2D} vecRH
	 * @returns {Number} the angle to the passed vector in radians
	 */
	Vector2D.prototype.angleTo = function (vecRH) {
		return Math.atan2(vecRH.y - this.y, vecRH.x - this.x);
	};

	/**@
	 * #.clone
     * @comp Crafty.math.Vector2D
	 *
	 * Creates and exact, numeric copy of this vector
	 *
	 * @public
	 * @sign public {Vector2D} clone();
	 * @returns {Vector2D} the new vector
	 */
    Vector2D.prototype.clone = function() {
        return new Vector2D(this);
    }; // clone

	/**@
	 * #.distance
     * @comp Crafty.math.Vector2D
	 *
	 * Calculates the distance from this vector to the passed vector.
	 *
	 * @public
	 * @sign public {Number} distance(Vector2D);
	 * @param {Vector2D} vecRH
	 * @returns {Number} the distance between the two vectors
	 */
    Vector2D.prototype.distance = function(vecRH) {
        return Math.sqrt((vecRH.x - this.x) * (vecRH.x - this.x) + (vecRH.y - this.y) * (vecRH.y - this.y));
    }; // distance

	/**@
	 * #.distanceSq
     * @comp Crafty.math.Vector2D
	 *
	 * Calculates the squared distance from this vector to the passed vector.
	 * This function avoids calculating the square root, thus being slightly faster than .distance( ).
	 *
	 * @public
	 * @sign public {Number} distanceSq(Vector2D);
	 * @param {Vector2D} vecRH
	 * @returns {Number} the squared distance between the two vectors
	 * @see .distance
	 */
    Vector2D.prototype.distanceSq = function(vecRH) {
        return (vecRH.x - this.x) * (vecRH.x - this.x) + (vecRH.y - this.y) * (vecRH.y - this.y);
    }; // distanceSq

	/**@
	 * #.divide
     * @comp Crafty.math.Vector2D
	 *
	 * Divides this vector by the passed vector.
	 *
	 * @public
	 * @sign public {Vector2D} divide(Vector2D);
	 * @param {Vector2D} vecRH
	 * @returns {Vector2D} this vector after dividing
	 */
    Vector2D.prototype.divide = function(vecRH) {
        this.x /= vecRH.x;
        this.y /= vecRH.y;
        return this;
    }; // divide

	/**@
	 * #.dotProduct
     * @comp Crafty.math.Vector2D
	 *
	 * Calculates the dot product of this and the passed vectors
	 *
	 * @public
	 * @sign public {Number} dotProduct(Vector2D);
	 * @param {Vector2D} vecRH
	 * @returns {Number} the resultant dot product
	 */
    Vector2D.prototype.dotProduct = function(vecRH) {
        return this.x * vecRH.x + this.y * vecRH.y;
    }; // dotProduct

	/**@
	 * #.equals
     * @comp Crafty.math.Vector2D
	 *
	 * Determines if this vector is numerically equivalent to the passed vector.
	 *
	 * @public
	 * @sign public {Boolean} equals(Vector2D);
	 * @param {Vector2D} vecRH
	 * @returns {Boolean} true if the vectors are equivalent
	 */
    Vector2D.prototype.equals = function(vecRH) {
        return vecRH instanceof Vector2D &&
            this.x == vecRH.x && this.y == vecRH.y;
    }; // equals

	/**@
	 * #.getNormal
     * @comp Crafty.math.Vector2D
	 *
	 * Calculates a new right-handed normal vector for the line created by this and the passed vectors.
	 *
	 * @public
	 * @sign public {Vector2D} getNormal([Vector2D]);
	 * @param {Vector2D=<0,0>} [vecRH]
	 * @returns {Vector2D} the new normal vector
	 */
    Vector2D.prototype.getNormal = function(vecRH) {
        if (vecRH === undefined)
            return new Vector2D(-this.y, this.x); // assume vecRH is <0, 0>
        return new Vector2D(vecRH.y - this.y, this.x - vecRH.x).normalize();
    }; // getNormal

	/**@
	 * #.isZero
     * @comp Crafty.math.Vector2D
	 *
	 * Determines if this vector is equal to <0,0>
	 *
	 * @public
	 * @sign public {Boolean} isZero();
	 * @returns {Boolean} true if this vector is equal to <0,0>
	 */
    Vector2D.prototype.isZero = function() {
        return this.x === 0 && this.y === 0;
    }; // isZero

	/**@
	 * #.magnitude
     * @comp Crafty.math.Vector2D
	 *
	 * Calculates the magnitude of this vector.
	 * Note: Function objects in JavaScript already have a 'length' member, hence the use of magnitude instead.
	 *
	 * @public
	 * @sign public {Number} magnitude();
	 * @returns {Number} the magnitude of this vector
	 */
    Vector2D.prototype.magnitude = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }; // magnitude

	/**@
	 * #.magnitudeSq
     * @comp Crafty.math.Vector2D
	 *
	 * Calculates the square of the magnitude of this vector.
	 * This function avoids calculating the square root, thus being slightly faster than .magnitude( ).
	 *
	 * @public
	 * @sign public {Number} magnitudeSq();
	 * @returns {Number} the square of the magnitude of this vector
	 * @see .magnitude
	 */
    Vector2D.prototype.magnitudeSq = function() {
        return this.x * this.x + this.y * this.y;
    }; // magnitudeSq

	/**@
	 * #.multiply
     * @comp Crafty.math.Vector2D
	 *
	 * Multiplies this vector by the passed vector
	 *
	 * @public
	 * @sign public {Vector2D} multiply(Vector2D);
	 * @param {Vector2D} vecRH
	 * @returns {Vector2D} this vector after multiplying
	 */
    Vector2D.prototype.multiply = function(vecRH) {
        this.x *= vecRH.x;
        this.y *= vecRH.y;
        return this;
    }; // multiply

	/**@
	 * #.negate
     * @comp Crafty.math.Vector2D
	 *
	 * Negates this vector (ie. <-x,-y>)
	 *
	 * @public
	 * @sign public {Vector2D} negate();
	 * @returns {Vector2D} this vector after negation
	 */
    Vector2D.prototype.negate = function() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }; // negate

	/**@
	 * #.normalize
     * @comp Crafty.math.Vector2D
	 *
	 * Normalizes this vector (scales the vector so that its new magnitude is 1)
	 * For vectors where magnitude is 0, <1,0> is returned.
	 *
	 * @public
	 * @sign public {Vector2D} normalize();
	 * @returns {Vector2D} this vector after normalization
	 */
    Vector2D.prototype.normalize = function() {
        var lng = Math.sqrt(this.x * this.x + this.y * this.y);

        if (lng === 0) {
            // default due East
            this.x = 1;
            this.y = 0;
        } else {
            this.x /= lng;
            this.y /= lng;
        } // else

        return this;
    }; // normalize

	/**@
	 * #.scale
	 * @comp Crafty.math.Vector2D
     *
	 * Scales this vector by the passed amount(s)
	 * If scalarY is omitted, scalarX is used for both axes
	 *
	 * @public
	 * @sign public {Vector2D} scale(Number[, Number]);
	 * @param {Number} scalarX
	 * @param {Number} [scalarY]
	 * @returns {Vector2D} this after scaling
	 */
    Vector2D.prototype.scale = function(scalarX, scalarY) {
        if (scalarY === undefined)
            scalarY = scalarX;

        this.x *= scalarX;
        this.y *= scalarY;

        return this;
    }; // scale

	/**@
	 * #.scaleToMagnitude
	 * @comp Crafty.math.Vector2D
     *
	 * Scales this vector such that its new magnitude is equal to the passed value.
	 *
	 * @public
	 * @sign public {Vector2D} scaleToMagnitude(Number);
	 * @param {Number} mag
	 * @returns {Vector2D} this vector after scaling
	 */
    Vector2D.prototype.scaleToMagnitude = function(mag) {
        var k = mag / this.magnitude();
        this.x *= k;
        this.y *= k;
        return this;
    }; // scaleToMagnitude

	/**@
	 * #.setValues
	 * @comp Crafty.math.Vector2D
     *
	 * Sets the values of this vector using a passed vector or pair of numbers.
	 *
	 * @public
	 * @sign public {Vector2D} setValues(Vector2D);
	 * @sign public {Vector2D} setValues(Number, Number);
	 * @param {Number|Vector2D} x
	 * @param {Number} y
	 * @returns {Vector2D} this vector after setting of values
	 */
    Vector2D.prototype.setValues = function(x, y) {
        if (x instanceof Vector2D) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        } // else

        return this;
    }; // setValues

	/**@
	 * #.subtract
	 * @comp Crafty.math.Vector2D
     *
	 * Subtracts the passed vector from this vector.
	 *
	 * @public
	 * @sign public {Vector2D} subtract(Vector2D);
	 * @param {Vector2D} vecRH
	 * @returns {vector2D} this vector after subtracting
	 */
    Vector2D.prototype.subtract = function(vecRH) {
        this.x -= vecRH.x;
        this.y -= vecRH.y;
        return this;
    }; // subtract

	/**@
	 * #.toString
	 * @comp Crafty.math.Vector2D
     *
	 * Returns a string representation of this vector.
	 *
	 * @public
	 * @sign public {String} toString();
	 * @returns {String}
	 */
    Vector2D.prototype.toString = function() {
        return "Vector2D(" + this.x + ", " + this.y + ")";
    }; // toString

	/**@
	 * #.translate
	 * @comp Crafty.math.Vector2D
     *
	 * Translates (moves) this vector by the passed amounts.
	 * If dy is omitted, dx is used for both axes.
	 *
	 * @public
	 * @sign public {Vector2D} translate(Number[, Number]);
	 * @param {Number} dx
	 * @param {Number} [dy]
	 * @returns {Vector2D} this vector after translating
	 */
    Vector2D.prototype.translate = function(dx, dy) {
        if (dy === undefined)
            dy = dx;

        this.x += dx;
        this.y += dy;

        return this;
    }; // translate

	/**@
	 * #.tripleProduct
	 * @comp Crafty.math.Vector2D
     *
	 * Calculates the triple product of three vectors.
	 * triple vector product = b(a•c) - a(b•c)
	 *
	 * @public
	 * @static
	 * @sign public {Vector2D} tripleProduct(Vector2D, Vector2D, Vector2D);
	 * @param {Vector2D} a
	 * @param {Vector2D} b
	 * @param {Vector2D} c
	 * @return {Vector2D} the triple product as a new vector
	 */
	Vector2D.tripleProduct = function (a, b, c) {
		var ac = a.dotProduct(c);
		var bc = b.dotProduct(c);
		return new Crafty.math.Vector2D(b.x * ac - a.x * bc, b.y * ac - a.y * bc);
	};

	return Vector2D;
})();

Crafty.math.Matrix2D = (function () {
	/**@
	 * #Crafty.math.Matrix2D
	 * @category 2D
	 *
	 * @class This is a 2D Matrix2D class. It is 3x3 to allow for affine transformations in 2D space.
	 * The third row is always assumed to be [0, 0, 1].
	 *
	 * Matrix2D uses the following form, as per the whatwg.org specifications for canvas.transform():
	 * [a, c, e]
	 * [b, d, f]
	 * [0, 0, 1]
	 *
	 * @public
	 * @sign public {Matrix2D} new Matrix2D();
	 * @sign public {Matrix2D} new Matrix2D(Matrix2D);
	 * @sign public {Matrix2D} new Matrix2D(Number, Number, Number, Number, Number, Number);
	 * @param {Matrix2D|Number=1} a
	 * @param {Number=0} b
	 * @param {Number=0} c
	 * @param {Number=1} d
	 * @param {Number=0} e
	 * @param {Number=0} f
	 */
	Matrix2D = function (a, b, c, d, e, f) {
		if (a instanceof Matrix2D) {
			this.a = a.a;
			this.b = a.b;
			this.c = a.c;
			this.d = a.d;
			this.e = a.e;
			this.f = a.f;
		} else if (arguments.length === 6) {
			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
			this.e = e;
			this.f = f;
		} else if (arguments.length > 0)
			throw "Unexpected number of arguments for Matrix2D()";
	} // class Matrix2D

	Matrix2D.prototype.a = 1;
	Matrix2D.prototype.b = 0;
	Matrix2D.prototype.c = 0;
	Matrix2D.prototype.d = 1;
	Matrix2D.prototype.e = 0;
	Matrix2D.prototype.f = 0;

	/**@
	 * #.apply
     * @comp Crafty.math.Matrix2D
	 *
	 * Applies the matrix transformations to the passed object
	 *
	 * @public
	 * @sign public {Vector2D} apply(Vector2D);
	 * @param {Vector2D} vecRH - vector to be transformed
	 * @returns {Vector2D} the passed vector object after transforming
	 */
    Matrix2D.prototype.apply = function(vecRH) {
        // I'm not sure of the best way for this function to be implemented. Ideally
        // support for other objects (rectangles, polygons, etc) should be easily
        // addable in the future. Maybe a function (apply) is not the best way to do
        // this...?

        var tmpX = vecRH.x;
        vecRH.x = tmpX * this.a + vecRH.y * this.c + this.e;
        vecRH.y = tmpX * this.b + vecRH.y * this.d + this.f;
        // no need to homogenize since the third row is always [0, 0, 1]

        return vecRH;
    }; // apply

	/**@
	 * #.clone
     * @comp Crafty.math.Matrix2D
	 *
	 * Creates an exact, numeric copy of the current matrix
	 *
	 * @public
	 * @sign public {Matrix2D} clone();
	 * @returns {Matrix2D}
	 */
    Matrix2D.prototype.clone = function() {
        return new Matrix2D(this);
    }; // clone

	/**@
	 * #.combine
     * @comp Crafty.math.Matrix2D
	 *
	 * Multiplies this matrix with another, overriding the values of this matrix.
	 * The passed matrix is assumed to be on the right-hand side.
	 *
	 * @public
	 * @sign public {Matrix2D} combine(Matrix2D);
	 * @param {Matrix2D} mtrxRH
	 * @returns {Matrix2D} this matrix after combination
	 */
    Matrix2D.prototype.combine = function(mtrxRH) {
        var tmp = this.a;
        this.a = tmp * mtrxRH.a + this.b * mtrxRH.c;
        this.b = tmp * mtrxRH.b + this.b * mtrxRH.d;
        tmp = this.c;
        this.c = tmp * mtrxRH.a + this.d * mtrxRH.c;
        this.d = tmp * mtrxRH.b + this.d * mtrxRH.d;
        tmp = this.e;
        this.e = tmp * mtrxRH.a + this.f * mtrxRH.c + mtrxRH.e;
        this.f = tmp * mtrxRH.b + this.f * mtrxRH.d + mtrxRH.f;
        return this;
    }; // combine

	/**@
	 * #.equals
     * @comp Crafty.math.Matrix2D
	 *
	 * Checks for the numeric equality of this matrix versus another.
	 *
	 * @public
	 * @sign public {Boolean} equals(Matrix2D);
	 * @param {Matrix2D} mtrxRH
	 * @returns {Boolean} true if the two matrices are numerically equal
	 */
    Matrix2D.prototype.equals = function(mtrxRH) {
        return mtrxRH instanceof Matrix2D &&
            this.a == mtrxRH.a && this.b == mtrxRH.b && this.c == mtrxRH.c &&
            this.d == mtrxRH.d && this.e == mtrxRH.e && this.f == mtrxRH.f;
    }; // equals

	/**@
	 * #.determinant
     * @comp Crafty.math.Matrix2D
	 *
	 * Calculates the determinant of this matrix
	 *
	 * @public
	 * @sign public {Number} determinant();
	 * @returns {Number} det(this matrix)
	 */
    Matrix2D.prototype.determinant = function() {
        return this.a * this.d - this.b * this.c;
    }; // determinant

	/**@
	 * #.invert
     * @comp Crafty.math.Matrix2D
	 *
	 * Inverts this matrix if possible
	 *
	 * @public
	 * @sign public {Matrix2D} invert();
	 * @returns {Matrix2D} this inverted matrix or the original matrix on failure
	 * @see .isInvertible
	 */
    Matrix2D.prototype.invert = function() {
        var det = this.determinant();

        // matrix is invertible if its determinant is non-zero
        if (det !== 0) {
            var old = {
                a: this.a,
                b: this.b,
                c: this.c,
                d: this.d,
                e: this.e,
                f: this.f
            };
            this.a = old.d / det;
            this.b = -old.b / det;
            this.c = -old.c / det;
            this.d = old.a / det;
            this.e = (old.c * old.f - old.e * old.d) / det;
            this.f = (old.e * old.b - old.a * old.f) / det;
        } // if

        return this;
    }; // invert

	/**@
	 * #.isIdentity
     * @comp Crafty.math.Matrix2D
	 *
	 * Returns true if this matrix is the identity matrix
	 *
	 * @public
	 * @sign public {Boolean} isIdentity();
	 * @returns {Boolean}
	 */
    Matrix2D.prototype.isIdentity = function() {
        return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.e === 0 && this.f === 0;
    }; // isIdentity

	/**@
	 * #.isInvertible
     * @comp Crafty.math.Matrix2D
	 *
	 * Determines is this matrix is invertible.
	 *
	 * @public
	 * @sign public {Boolean} isInvertible();
	 * @returns {Boolean} true if this matrix is invertible
	 * @see .invert
	 */
    Matrix2D.prototype.isInvertible = function() {
        return this.determinant() !== 0;
    }; // isInvertible

	/**@
	 * #.preRotate
     * @comp Crafty.math.Matrix2D
	 *
	 * Applies a counter-clockwise pre-rotation to this matrix
	 *
	 * @public
	 * @sign public {Matrix2D} preRotate(Number);
	 * @param {number} rads - angle to rotate in radians
	 * @returns {Matrix2D} this matrix after pre-rotation
	 */
    Matrix2D.prototype.preRotate = function(rads) {
        var nCos = Math.cos(rads);
        var nSin = Math.sin(rads);

        var tmp = this.a;
        this.a = nCos * tmp - nSin * this.b;
        this.b = nSin * tmp + nCos * this.b;
        tmp = this.c;
        this.c = nCos * tmp - nSin * this.d;
        this.d = nSin * tmp + nCos * this.d;

        return this;
    }; // preRotate

	/**@
	 * #.preScale
     * @comp Crafty.math.Matrix2D
	 *
	 * Applies a pre-scaling to this matrix
	 *
	 * @public
	 * @sign public {Matrix2D} preScale(Number[, Number]);
	 * @param {Number} scalarX
	 * @param {Number} [scalarY] scalarX is used if scalarY is undefined
	 * @returns {Matrix2D} this after pre-scaling
	 */
    Matrix2D.prototype.preScale = function(scalarX, scalarY) {
        if (scalarY === undefined)
            scalarY = scalarX;

        this.a *= scalarX;
        this.b *= scalarY;
        this.c *= scalarX;
        this.d *= scalarY;

        return this;
    }; // preScale

	/**@
	 * #.preTranslate
     * @comp Crafty.math.Matrix2D
	 *
	 * Applies a pre-translation to this matrix
	 *
	 * @public
	 * @sign public {Matrix2D} preTranslate(Vector2D);
	 * @sign public {Matrix2D} preTranslate(Number, Number);
	 * @param {Number|Vector2D} dx
	 * @param {Number} dy
	 * @returns {Matrix2D} this matrix after pre-translation
	 */
    Matrix2D.prototype.preTranslate = function(dx, dy) {
        if (typeof dx === "number") {
            this.e += dx;
            this.f += dy;
        } else {
            this.e += dx.x;
            this.f += dx.y;
        } // else

        return this;
    }; // preTranslate

	/**@
	 * #.rotate
     * @comp Crafty.math.Matrix2D
	 *
	 * Applies a counter-clockwise post-rotation to this matrix
	 *
	 * @public
	 * @sign public {Matrix2D} rotate(Number);
	 * @param {Number} rads - angle to rotate in radians
	 * @returns {Matrix2D} this matrix after rotation
	 */
    Matrix2D.prototype.rotate = function(rads) {
        var nCos = Math.cos(rads);
        var nSin = Math.sin(rads);

        var tmp = this.a;
        this.a = nCos * tmp - nSin * this.b;
        this.b = nSin * tmp + nCos * this.b;
        tmp = this.c;
        this.c = nCos * tmp - nSin * this.d;
        this.d = nSin * tmp + nCos * this.d;
        tmp = this.e;
        this.e = nCos * tmp - nSin * this.f;
        this.f = nSin * tmp + nCos * this.f;

        return this;
    }; // rotate

	/**@
	 * #.scale
     * @comp Crafty.math.Matrix2D
	 *
	 * Applies a post-scaling to this matrix
	 *
	 * @public
	 * @sign public {Matrix2D} scale(Number[, Number]);
	 * @param {Number} scalarX
	 * @param {Number} [scalarY] scalarX is used if scalarY is undefined
	 * @returns {Matrix2D} this after post-scaling
	 */
    Matrix2D.prototype.scale = function(scalarX, scalarY) {
        if (scalarY === undefined)
            scalarY = scalarX;

        this.a *= scalarX;
        this.b *= scalarY;
        this.c *= scalarX;
        this.d *= scalarY;
        this.e *= scalarX;
        this.f *= scalarY;

        return this;
    }; // scale

	/**@
	 * #.setValues
     * @comp Crafty.math.Matrix2D
	 *
	 * Sets the values of this matrix
	 *
	 * @public
	 * @sign public {Matrix2D} setValues(Matrix2D);
	 * @sign public {Matrix2D} setValues(Number, Number, Number, Number, Number, Number);
	 * @param {Matrix2D|Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} e
	 * @param {Number} f
	 * @returns {Matrix2D} this matrix containing the new values
	 */
    Matrix2D.prototype.setValues = function(a, b, c, d, e, f) {
        if (a instanceof Matrix2D) {
            this.a = a.a;
            this.b = a.b;
            this.c = a.c;
            this.d = a.d;
            this.e = a.e;
            this.f = a.f;
        } else {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.e = e;
            this.f = f;
        } // else

        return this;
    }; // setValues

	/**@
	 * #.toString
     * @comp Crafty.math.Matrix2D
	 *
	 * Returns the string representation of this matrix.
	 *
	 * @public
	 * @sign public {String} toString();
	 * @returns {String}
	 */
    Matrix2D.prototype.toString = function() {
        return "Matrix2D([" + this.a + ", " + this.c + ", " + this.e +
            "] [" + this.b + ", " + this.d + ", " + this.f + "] [0, 0, 1])";
    }; // toString

	/**@
	 * #.translate
     * @comp Crafty.math.Matrix2D
	 *
	 * Applies a post-translation to this matrix
	 *
	 * @public
	 * @sign public {Matrix2D} translate(Vector2D);
	 * @sign public {Matrix2D} translate(Number, Number);
	 * @param {Number|Vector2D} dx
	 * @param {Number} dy
	 * @returns {Matrix2D} this matrix after post-translation
	 */
	Matrix2D.prototype.translate = function (dx, dy) {
		if (typeof dx === "number") {
			this.e += this.a * dx + this.c * dy;
			this.f += this.b * dx + this.d * dy;
		} else {
			this.e += this.a * dx.x + this.c * dx.y;
			this.f += this.b * dx.x + this.d * dx.y;
		} // else

		return this;
	} // translate

	return Matrix2D;
})();


/**@
* #Crafty Time
* @category Utilities
*/
Crafty.c("Delay", {
	init : function() {
		this._delays = [];
		this.bind("EnterFrame", function() {
			var now = new Date().getTime();
			for(var index in this._delays) {
				var item = this._delays[index];
				if(!item.triggered && item.start + item.delay + item.pause < now) {
					item.triggered=true;
					item.func.call(this);
				}
			}
		});
		this.bind("Pause", function() {
			var now = new Date().getTime();
			for(var index in this._delays) {
				this._delays[index].pauseBuffer = now;
			}
		});
		this.bind("Unpause", function() {
			var now = new Date().getTime();
			for(var index in this._delays) {
				var item = this._delays[index];
				item.pause += now-item.pauseBuffer;
			}
		});
	},
    /**@
	* #.delay
	* @comp Crafty Time
	* @sign public this.delay(Function callback, Number delay)
	* @param callback - Method to execute after given amount of milliseconds
	* @param delay - Amount of milliseconds to execute the method
	* 
	* The delay method will execute a function after a given amount of time in milliseconds.
	* 
	* It is not a wrapper for `setTimeout`.
	* 
	* If Crafty is paused, the delay is interrupted with the pause and then resume when unpaused
	*
	* If the entity is destroyed, the delay is also destroyed and will not have effect. 
	*
	* @example
	* ~~~
	* console.log("start");
	* this.delay(function() {
	     console.log("100ms later");
	* }, 100);
	* ~~~
	*/
	delay : function(func, delay) {
		return this._delays.push({
			start : new Date().getTime(),
			func : func,
			delay : delay,
			triggered : false,
			pauseBuffer: 0,
			pause: 0
		});
	}
});


});

