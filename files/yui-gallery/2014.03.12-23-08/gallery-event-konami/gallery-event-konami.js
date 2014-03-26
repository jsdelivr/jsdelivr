YUI.add('gallery-event-konami', function(Y) {

/**
 * Based on the Konami code (http://en.wikipedia.org/wiki/Konami_Code).
 * Subscribers to this event should do something special.  The event will be
 * fired only once for each subscriber.  With great power comes great
 * responsibility, after all.
 *
 * @module event-konami
 *
 * @class YUI~event-konami
 */

var config = {
    _keys: [ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65 ],

    on: function (node, sub, notifier, filter) {
        var method = (filter) ? 'delegate' : 'on',
            progressKey = '-yui3-konami-progress(' + Y.guid() + ')',
            keys = this._keys;

        sub.handle = node[method]("keydown", function (e) {
            var progress = this.getData(progressKey) || 0;

            if (e.keyCode === keys[progress]) {
                if (++progress === 10) {
                    this.clearData(progressKey);
                    notifier.fire(e);
                    node.detach('konami');
                }
            } else {
                progress = 0;
            }

            this.setData(progressKey, progress);

        }, (filter || node));
    },

    detach: function (node, sub) {
        sub.handle.detach();
    }
};
config.delegate = config.on;
config.detachDelegate = config.detach;

/**
 * Provides a subscribable event named &quot;konami&quot;.
 *
 * @event konami
 * @param type {String} 'konami'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param o {Object} optional context object
 * @param args 0..n additional arguments that should be provided 
 * to the listener.
 * @return {Event.Handle} the detach handle
 */
Y.Event.define('konami', config);


}, 'gallery-2011.06.22-20-13' ,{requires:['event-synthetic']});
