YUI.add('gallery-event-transition', function(Y) {

/**
 * CSS3 Transition Synthetic Event
 *
 * Defines normalized CSS3 transition events for the various browser
 * environments. Currently, the only supported event is `transitionend` due
 * to the current state of browser support. Delegation is not currently
 * supported for this event.
 *
 * Example usage:
 *
 * HTML:
 *
 * <div id="myelement">Hi!</div>
 *
 * CSS:
 *
 * #myelement {
 *     background-color: #000;
 *     color: #FFF;
 *     height: 100px;
 *     width: 100px;
 *     -webkit-transition: all 0.3s ease-out;
 *     -moz-transition: all 0.3s ease-out;
 *     -ms-transition: all 0.3s ease-out;
 *     -o-transition: all 0.3s ease-out;
 *     transition: all 0.3s ease-out;
 * }
 *
 * #myelement.wow {
 *     background-color: #FFF;
 *     color: #000;
 * }
 *
 * JS:
 *
 * Y.one('#myelement').on('transitionend', function (e) {
 *     console.log("transition end!");
 * });
 *
 * Y.one('#myelement').addClass('wow');
 *
 */

var EVT_NAMES = {
    ie: 'MSTransitionEnd',
    opera: 'oTransitionEnd',
    gecko: 'transitionend',
    webkit: 'webkitTransitionEnd'
};

Y.Event.define('transitionend', {
    // don't worry about which version of the UA since the event won't
    // fire for those unsupported versions and managing version support
    // here is kinda dumb.
    on: function (node, sub, notifier) {
        var evtName;

        if (Y.UA.ie) {
            evtName = EVT_NAMES.ie;
        } else if (Y.UA.opera) {
            evtName = EVT_NAMES.opera;
        } else if (Y.UA.gecko) {
            evtName = EVT_NAMES.gecko;
        } else if (Y.UA.webkit) {
            evtName = EVT_NAMES.webkit;
        }

        sub._handle = Y.Event.attach(evtName, function (e) {
            notifier.fire(e);
        });
    },

    detatch: function (node, sub, notifier) {
        sub._handle.detach();
    }
});


}, 'gallery-2011.12.14-21-12' ,{requires:['event-synthetic']});
