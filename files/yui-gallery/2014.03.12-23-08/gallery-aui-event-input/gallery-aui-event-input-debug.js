YUI.add('gallery-aui-event-input', function(A) {

/**
 * An object that encapsulates text changed events for textareas and input
 * element of type text and password. This event only occurs when the element
 * is focused.
 *
 * @module aui-event
 * @submodule aui-event-input
 *
 * @class AUI~event~input
 */

var	L = A.Lang,
	isFunction = L.isFunction,

	ACTIVE_ELEMENT = 'activeElement',
	OWNER_DOCUMENT = 'ownerDocument',

	UA = A.UA;

var evt = {
	/**
	 * This event fires when the value of the element changes, either as a result of
	 * a keystroke, or from an input event.
	 *
	 * @event input
	 * @param type {String} 'input'
	 * @param fn {Function} the callback function
	 * @param el {String|Node|etc} the element to bind (typically document)
	 * @param o {Object} optional context object
	 * @param args 0..n additional arguments that should be provided
	 * to the listener.
	 * @return {Event.Handle} the detach handle
	 */
	on: function(type, fn, el) {
		// priorize input event that supports copy & paste
		var etype = 'input';

		// WebKit before version 531 (3.0.182.2) did not support input events for textareas.
		// http://dev.chromium.org/developers/webkit-version-table
		// All Chrome versions supports input event
		// TODO: use UA.chrome when YUI 3 detects it
		if (!/chrome/i.test(UA.agent) && UA.webkit && UA.version.major <= 2) {
			etype = 'keypress';
		}
		else if (UA.ie) {
			// IE doesn't support input event, simulate it with propertychange
			etype = 'propertychange';
		}

		var handler = function(event) {
			var instance = this;
			var input = event.target;
			var originalEvent = event._event;

			// only trigger checkLength() on IE when propertychange happens on the value attribute
			if (event.type == 'propertychange') {
				if (originalEvent && (originalEvent.propertyName != 'value')) {
					return false; // NOTE: return
				}
			}

			var focused = (input.get(OWNER_DOCUMENT).get(ACTIVE_ELEMENT) == input);

			if (focused && isFunction(fn)) {
				fn.apply(instance, arguments);
			}
		};

		return A.Event.attach(etype, handler, el);
	}
};

A.Env.evt.plugins.input = evt;

if (A.Node) {
	/**
	 * A.Node.DOM_EVENTS.input event.
	 *
	 * @property A.Node.DOM_EVENTS.input
	 * @type Event.Handle
	 * @static
	 */
	A.Node.DOM_EVENTS.input = evt;
}

/**
 * @method void();
 */


}, 'gallery-2010.08.18-17-12' ,{requires:['gallery-aui-base']});
