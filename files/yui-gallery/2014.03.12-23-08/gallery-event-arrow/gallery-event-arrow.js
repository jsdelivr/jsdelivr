YUI.add('gallery-event-arrow', function(Y) {

// TODO:
// keyup stops the repeated keypress, so fire repetition should be handled manually via setInterval to allow (mousedown)left, (md)up, (mu)left to continue to fire arrow.direction = 'n'
// However, if the native event is not propagated to through the synth, e.preventDefault() won't be available to stop scrolling.  Also, it raises the question of notifier.fire(???)
// Is it possible to synthesize keypress/keydown events that trigger scrolling?  If so, the keyup listener could enable the interval and the keydown listener could disable (allowing the native repeater to propagate)

//YUI.add('arrow', function (Y) {
Y.Event.define("arrow", {
    // Webkit and IE repeat keydown when you hold down arrow keys.
    // Opera links keypress to page scroll; others keydown.
    // Firefox prevents page scroll via preventDefault() on either
    // keydown or keypress.
    _event: (Y.UA.webkit || Y.UA.ie) ? 'keydown' : 'keypress',

    _keys: {
        37: true,
        38: true,
        39: true,
        40: true
    },

    _directions: {
        '37': 'w',
        '38': 'n',
        '39': 'e',
        '40': 's',
        '37,38': 'nw',
        '38,37': 'nw',
        '39,38': 'ne',
        '38,39': 'ne',
        '37,40': 'sw',
        '40,37': 'sw',
        '39,40': 'se',
        '40,39': 'se'
    },

    _keydown: function (e) {
        if (this._keys[e.keyCode]) {
            var node = e.currentTarget,
                input = node.getData('-yui3-arrow-dir');

            if (!input) {
                input = [];
                node.setData('-yui3-arrow-dir', input);
            }

            // Avoid repeats for browsers that fire multiple
            // keydowns when holding down an arrow key
            if (input[input.length - 1] !== e.keyCode) {
                input.push(e.keyCode);
            }
        }
    },

    _notify: function (e, notifier) {
        if (this._keys[e.keyCode]) {
            var node = e.currentTarget,
                input  = node.getData('-yui3-arrow-dir'),
                directions = this._directions,
                direction = [e.keyCode],
                i;

            for (i = input.length - 1; i >= 0; --i) {
                if ((e.keyCode - input[i]) % 2) {
                    direction.push(input[i]);
                    break;
                }
            }

            e.direction = directions[direction];

            notifier.fire(e);
        }
    },

    _keyup: function (e) {
        if (this._keys[e.keyCode]) {
            var node = e.currentTarget,
                input = node.getData('-yui3-arrow-dir'),
                i;

            if (input) {
                for (i = input.length - 1; i >= 0; --i) {
                    if (input[i] === e.keyCode) {
                        input.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },

    on: function (node, sub, notifier, filter) {
        var method = (filter) ? 'delegate' : 'on';

        sub._handle = new Y.EventHandle([
            node[method]('keydown', Y.rbind(this._keydown, this), filter),

            node[method](this._event, Y.rbind(this._notify, this, notifier), filter),
            
            node[method]('keyup', Y.rbind(this._keyup, this), filter)
        ]);
    },

    detach: function (node, sub, notifier) {
        sub._handle.detach();
    },

    delegate: function () {
        this.on.apply(this, arguments);
    },

    detachDelegate: function () {
        this.detach.apply(this, arguments);
    }
});
//}, '@VERSION', { requires: ['event-synthetic'] });


}, 'gallery-2011.01.18-21-05' ,{requires:['event-synthetic']});
