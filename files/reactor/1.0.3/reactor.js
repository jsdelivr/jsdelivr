/*!
 * Reactor
 * https://github.com/Sinova/Reactor
 *
 * Copyright 2015 Samuel Hodge
 * Released under the GPL license
 * http://www.gnu.org/copyleft/gpl.html
 */
(function(context) {
	'use strict';

	// Export Reactor
	if(typeof module !== 'undefined' && module.exports) {
		module.exports = Reactor;
	}
	else if(typeof define === 'function' && define.amd) {
		define([], function() {
			return Reactor;
		});
	}
	else {
		context.Reactor = Reactor;
	}

	// The ID of the top-level function currently running
	var top_function = 0;

	// Top-level functions
	var all_functions = [];

	// A map of all functions to be called on the next reaction
	var pending_functions = {};

	// Reaction timeout ID
	var pending_reaction = 0;

	/**
	 * Constructor: Creates a reactive variable
	 * #param {*} default_value The default value
	 * -----
	 * Function: Calls a function with an optional context
	 * @param {Function} fn      The function to call
	 * @param {Object}   context The context of the function ("this")
	 */
	function Reactor(fn, context) {
		// Called as a constructor
		if(this instanceof Reactor) {
			this._val = fn;
			this._fns = {};
		}
		// Called as a function
		else {
			fn = fn.bind(context);

			if(top_function) {
				fn();
			}
			else {
				top_function = all_functions.push(fn);

				fn();

				top_function = 0;
			}
		}
	}

	/**
	 * Registers the current top-level function as dependent on this variable
	 */
	Reactor.prototype.depend = function depend() {
		if(top_function) {
			this._fns[top_function] = true;
		}
	}

	/**
	 * Queues a re-run of all dependent functions
	 */
	Reactor.prototype.act = function act() {
		for(var id in this._fns) {
			pending_functions[id] = true;
		}

		if(!pending_reaction) {
			pending_reaction = setTimeout(reaction, 0);
		}
	};

	/**
	 * Gets the value
	 * changes.
	 * @return {*} The current value
	 */
	Reactor.prototype.get = function get() {
		this.depend();
		return this._val;
	};

	/**
	 * Sets the value
	 * @param {*} value The new value
	 */
	Reactor.prototype.set = function set(value) {
		if(this._val !== value) {
			this._val = value;
			this.act();
		}
	};

	/**
	 * Runs all pending functions triggered by reactive variables
	 */
	function reaction() {
		var functions = pending_functions;

		pending_functions = {};
		pending_reaction  = 0;

		for(var id in functions) {
			top_function = id - 1;
			all_functions[top_function]();
		}

		top_function = 0;
	}
}(this));
