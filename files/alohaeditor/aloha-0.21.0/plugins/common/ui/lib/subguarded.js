define([
	'aloha/core',
	'jquery',
	'PubSub'
], function (
	Aloha,
	jQuery,
	PubSub
) {
	

	/**
	 * The last uid that was was used to uniquely identify a function.
	 * NB: Make sure to increment this counter before assigning it to a new
	 *     function.
	 *
	 * @type {numder}
	 * @private
	 */
	var alohaUid = 0;

	/**
	 * A spares array, where arguments lists are indexed against the alohaUid of
	 * the guarded dispatch function with which they were registered with.
	 *
	 * @type {object.<number, array>}
	 * @private
	 */
	var registeredArguments = {};

	/**
	 * A spares array of guarded dispatch functions indexed against their
	 * alohaUid.  Each entry in this array will correspond with an entry in the
	 * `registeredArguments' map which is exists on the same index.
	 *
	 * @type {object.<number, array>}
	 * @private
	 */
	var registeredGuards = {};

	/**
	 * For a given function, will derive its unique identifing number.  Be
	 * aware that although this is a "getter" function, it will mutate the
	 * given function, and the closure variable `alohaUid' if the given
	 * function has not had a unique id set to it.
	 *
	 * @param {function} func Function whose uid is to be retreived.
	 * @return {number} The alohaUid property that has been assigned to the
	 *                  given function.
	 */
	function getUid(func) {
		if (!func.alohaUid) {
			func.alohaUid = ++alohaUid;
		}
		return func.alohaUid;
	}

	/**
	 * Retrieves a list of all guard functions that are registered for the
	 * given event.
	 *
	 * @param {string} event The name of the event whose guard functions are to
	 *                       be to retreive.
	 * @return {array.<function>} A list of guarded dispatch functions that
	 *                            were registered to handle the given event.
	 */
	function getRegisteredGuards(event) {
		return registeredGuards[event] || [];
	}

	/**
	 * Retrieves a list of argument lists that were registerd with the given
	 * guard function.
	 *
	 * @paran {function} guard A function that is to filter and dispatch.
	 * @return {array.<*>} A list of arguments list.
	 */
	function getArguments(guard) {
		return registeredArguments[guard.alohaUid] || [];
	}

	/**
	 * Registers the given arguments list against the provided guard function.
	 *
	 * @paran {function} guard A function that is to filter and dispatch a
	 *                         variable number of callbacks.
	 * @return {array.<*>} The list of all registed arguments lists that
	 *                     correspond with the given guard.
	 */
	function registerArguments(guard, args) {
		if (!registeredArguments[guard.alohaUid]) {
			registeredArguments[guard.alohaUid] = [];
		}
		registeredArguments[guard.alohaUid].push(args);
		return registeredArguments[guard.alohaUid];
	}

	/**
	 * Registers the given guard function to the given event.
	 *
	 * @paran {string} event The event on which to invoke the guard.
	 * @paran {function} guard A function that is to filter and dispatch a
	 *                         variable number of callbacks.
	 * @return {array.<*>} The list of all registed guard functions that
	 *                     correspond with the given guard.
	 */
	function registerGuard(event, guard) {
		if (!registeredGuards[event]) {
			registeredGuards[event] = [];
		}
		registeredGuards[event].push(guard);
		return registeredGuards[event];
	}

	/**
	 * Process a guard functions that have been registered on the given event
	 * when the event is triggered.
	 *
	 * @param {Event} event Name of the event.
	 * @param ... any other arguments passed on to the guard function
	 */
	function trigger(event) {
		var guards = getRegisteredGuards(event);
		var i;
		for (i = 0; i < guards.length; i++) {
			guards[i].apply(null, [getArguments(guards[i])].concat(arguments));
		}
	}

	/**
	 * Provides a mechanism to register event handlers that are filtered and
	 * dispatched through a guard function.
	 *
	 * All arguments following the guard parameter will be passed to the guard
	 * function in a list containing a tuple of arguments.  It is expected that
	 * one of the arguments will be a callback function that will be call if
	 * the other arguments pass the condition implemented in the guarded
	 * dispatch function.
	 *
	 * USAGE:
	 *    sub(event, dispatch [, ... ])
	 *
	 * @param {string} event
	 * @param {function(array.<array.<*...>>)} guard A function that will be
	 *                                               invoked when the specified
	 *                                               event is fired.  This
	 *                                               function will receive a
	 *                                               array consisting of
	 *                                               arguments tuples, followed
	 *                                               by the the arguments that
	 *                                               are received from the
	 *                                               event.
	 * @param {*...} args A variable number of arguments which will be passed
	 *                    as a list in a list to the dispatch function.
	 */
	function sub() {
		var args = Array.prototype.slice.call(arguments);
		var events = args.shift();
		if (typeof events === 'string') {
			events = [events];
		}
		var guard = args.shift();
		getUid(guard);
		registerArguments(guard, args);
		var i;
		var event;
		var bindHandler = function ($event, range, nativeEvent) {
			trigger(event, $event, range, nativeEvent);
		};
		var pubsubHandler = function () {
			trigger(event);
		};
		for (i = 0; i < events.length; i++) {
			event = events[i];
			registerGuard(event, guard);
			Aloha.bind(event, bindHandler);
			PubSub.sub(event, pubsubHandler);
		}
	}

	return sub;

});
