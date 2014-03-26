YUI.add('gallery-beforeunload', function(Y) {

/**
 * DOM0 beforeunload event listener support.
 * @module gallery-beforeunload
 */

var INTERNAL_EVENT_NAME = 'gallery-dom0beforeunload',
    supplantedHandler = window.onbeforeunload;

window.onbeforeunload = function(ev) {
    var e = ev || window.event;
    if (supplantedHandler) {
        supplantedHandler(e);
    }
    var facade = new Y.DOMEventFacade(e), retVal;
    Y.fire(INTERNAL_EVENT_NAME, facade);
    retVal = facade.returnValue;
    if (retVal) {
        e.returnValue = retVal;
        return retVal;
    }
};

/**
 * <p>
 * The beforeunload event is not standard, yet it is useful enough that
 * most browsers support it to some degree.  But they are not consistent
 * about how it operates.  This module supplants any existing DOM0
 * onbeforelistener because DOM2 style listeners won't work across
 * the A grade at this time.
 * </p>
 *
 * <p>
 * You can attempt to prevent the user from leaving the page by calling
 * preventDefault on the event object.  The user will be presented with
 * a dialog to see whether or not they want to allow this.  You can provide
 * a message to preventDefault, and this will override the default message
 * in the dialog if it is provided.
 * </p>
 *
 *  <code>
 *  Y.on('beforeunload', function(e) {
 *  &nbws;&nbws;e.returnValue = "Please don't go.";
 *  });
 *  </code>
 *
 * @event beforeunload
 * @for YUI
 * @param type {string} 'beforeunload'
 * @param fn {function} the callback function to execute.
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 * These arguments will be added after the event object.
 */
Y.Env.evt.plugins.beforeunload = {
    on: function(type, fn) {
        var a = Y.Array(arguments, 0, true);
        a[0] = INTERNAL_EVENT_NAME;
        return Y.on.apply(Y, a);
    }
};


}, 'gallery-2012.03.28-20-16' ,{requires:['event-base']});
