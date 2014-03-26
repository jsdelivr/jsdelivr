YUI.add('gallery-aui-delayed-task', function(A) {

/**
 * The DelayedTask Utility - Executes the supplied function in the context of
 * the supplied object 'when' milliseconds later
 *
 * @module aui-delayed-task
 */

/**
 * A base class for DelayedTask, providing:
 * <ul>
 *    <li>Executes the supplied function in the context of the supplied object 'when' milliseconds later</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var delayed = new A.DelayedTask({
 *	 function() {
 *     // This callback will be executed when the <code>DelayedTask</code> be invoked
 *	 },
 *	 scope
 *  });
 *
 * 	// executes after 1000ms the callback
 *  delayed.delay(1000);
 * </code></pre>
 *
 * Check the list of <a href="DelayedTask.html#configattributes">Configuration Attributes</a> available for
 * DelayedTask.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class DelayedTask
 * @param {function} fn Callback
 * @param {Object} scope Context object. Optional.
 * @param args 0..n additional arguments that should be provided to the listener.
 * @constructor
 */
var DelayedTask = function(fn, scope, args) {
	var instance = this;

	/**
	 * Stores the passed <code>args</code> attribute.
	 *
	 * @property _args
	 * @type Object
	 * @protected
	 */
	instance._args = args;

	/**
	 * Stores the passed <code>delay</code> attribute.
	 *
	 * @property _delay
	 * @default 0
	 * @type Number
	 * @protected
	 */
	instance._delay = 0;

	/**
	 * Stores the passed <code>fn</code> attribute.
	 *
	 * @property _fn
	 * @type function
	 * @protected
	 */
	instance._fn = fn;

	/**
	 * Stores the timer <code>id</code> given from the <code>setInterval</code>.
	 *
	 * @property _id
	 * @default null
	 * @type Number
	 * @protected
	 */
	instance._id = null;

	/**
	 * Stores the passed <code>scope</code> attribute.
	 *
	 * @property _scope
	 * @default instance
	 * @type Object
	 * @protected
	 */
	instance._scope = scope || instance;

	/**
	 * Stores the current timestamp given from
     * <a href="DelayedTask.html#method__getTime">_getTime</a>.
	 *
	 * @property _time
	 * @default 0
	 * @type Number
	 * @protected
	 */
	instance._time = 0;

	instance._base = function() {
		var now = instance._getTime();

		if (now - instance._time >= instance._delay) {
			clearInterval(instance._id);

			instance._id = null;

			instance._fn.apply(instance._scope, instance._args || []);
		}
	};
};

DelayedTask.prototype = {
	/**
	 * <p>This function is responsible to execute the user callback, passed in
     * the <code>constructor</code> after <code>delay</code> milliseconds.</p>
	 *
	 * Example:
	 *
	 * <pre><code>// executes after 1000ms the callback
	 * delayed.delay(1000);</code></pre>
	 *
	 * @method delay
	 * @param {Number} delay Delay in milliseconds.
	 * @param {function} newFn Callback.
	 * @param {Object} newScope Context object. Optional.
	 * @param newArgs 0..n additional arguments that should be provided to the listener.
	 */
	delay: function(delay, newFn, newScope, newArgs) {
		var instance = this;

		if (instance._id && instance._delay != delay) {
			instance.cancel();
		}

		instance._delay = delay || instance._delay;
		instance._time = instance._getTime();

		instance._fn = newFn || instance._fn;
		instance._scope = newScope || instance._scope;
		instance._args = newArgs || instance._args;

		if (!A.Lang.isArray(instance._args)) {
			instance._args = [instance._args];
		}

		if (!instance._id) {
			if (instance._delay > 0) {
				instance._id = setInterval(instance._base, instance._delay);
			}
			else {
				instance._base();
			}
		}
	},

	/**
	 * Cancel the delayed task in case it's running (i.e., clearInterval from
     * the current running <a href="DelayedTask.html#property__id">_id</a>).
	 *
	 * @method cancel
	 */
	cancel: function() {
		var instance = this;

		if (instance._id) {
			clearInterval(instance._id);

			instance._id = null;
		}
	},

	/**
	 * Get the current timestamp (i.e., now).
	 *
	 * @method _getTime
	 * @protected
	 * @return {Number} Current timestamp
	 */
	_getTime: function() {
		var instance = this;

		return (+new Date());
	}
};

A.DelayedTask = DelayedTask;


}, 'gallery-2010.08.18-17-12' ,{skinnable:false});
