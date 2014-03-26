YUI.add('gallery-event-selection', function(Y) {

/*
 * Cross browser/device text selection events.
 *  - selection: Fired when text has been selected.
 *  - selectionchange: Fired when text has been selected or deselected.
 *
 * Fired events have the following properties:
 *  - selection: Selected text.
 *  - pageX/pageY: Best guess on where selection ends.
 *
 * Limitations:
 *  - There are a few edge cases where selection events don't work well. Namely,
 *    when selecting text that crosses the boundary of a bounded node or selecting
 *    text with only keyboard selection.
 *
 * Notes:
 *  - Polling for selection changes is necessary because iOS doesn't tell us
 *    when the selection region has been updated and desktop browsers can use
 *    keyboard selection.
 *  - iOS requires a slight delay when getting selected text.
 *
 * event-gesture bugs:
 *  - Can't listen to multiple gesturemove events on the same node.
 *  - gesturemoveend doesn't fire without gesturemovestart.
 */
    "use strict";
    /*global Y:true */
    /*jslint regexp: true*/
    var DELAY = Y.UA.ios ? 400 : 0,
        POLL = 300;

    function getSelection() {
        var s = '';
        if (Y.config.win.getSelection) {
            s = Y.config.win.getSelection().toString();
        } else if (Y.config.doc.selection) {
            s = Y.config.doc.selection.createRange().text;
        }
        return s;
    }

    Y.Event.define('selection', {
        on: function (node, sub, notifier, filter) {
            var method = filter ? 'delegate' : 'on';
            sub._notifier = notifier;
            sub._handle = new Y.EventHandle([
                node[method]('gesturemovestart', function (e) {}, filter), // event-gesture bug
                // Checking asynchronously since previously selected text can be reported as selected.
                node[method]('gesturemoveend', Y.bind(function (e) {
                    sub._x = e.pageX;
                    sub._y = e.pageY;
                    Y.later(DELAY, this, this._checkSelection, sub);
                }, this), filter)
            ]);
        },

        delegate: function () {
            this.on.apply(this, arguments);
        },

        detach: function (node, sub, notifier) {
            sub._handle.detach();
        },

        detachDelegate: function () {
            this.detach.apply(this, arguments);
        },

        _checkSelection: function (sub) {
            var selection = getSelection();
            if (selection !== '') {
                sub._notifier.fire({selection: selection, pageX: sub._x, pageY: sub._y});
            }
        }
    });

    Y.Event.define('selectionchange', {
        _poll: null, // Keep one poll since there can only ever be one text selection.

        on: function (node, sub, notifier, filter) {
            var method = filter ? 'delegate' : 'on';
            sub._selection = ''; // Save last selection
            sub._notifier = notifier;
            sub._handle = new Y.EventHandle([
                Y.on('gesturemovestart', Y.bind(function (e) {
                    this._unpoll();
                    if (sub._selection) {
                        Y.later(0, this, this._checkSelectionChange, sub);
                    }
                }, this)),
                node[method]('gesturemovestart', function (e) {}, filter), // event-gesture bug
                // Checking asynchronously since previously selected text can be reported as selected.
                node[method]('gesturemoveend', Y.bind(function (e) {
                    sub._x = e.pageX;
                    sub._y = e.pageY;
                    Y.later(DELAY, this, this._checkSelection, sub);
                }, this), filter)
            ]);
        },

        delegate: function () {
            this.on.apply(this, arguments);
        },

        detach: function (node, sub, notifier) {
            this._unpoll();
            sub._handle.detach();
        },

        detachDelegate: function () {
            this.detach.apply(this, arguments);
        },

        _checkSelection: function (sub) {
            this._unpoll();
            this._checkSelectionChange(sub);
            this._poll = Y.later(POLL, this, this._checkSelectionChange, sub, true);
        },

        _checkSelectionChange: function (sub) {
            var selection = getSelection();
            if (selection !== sub._selection) {
                sub._selection = selection;
                sub._notifier.fire({selection: sub._selection, pageX: sub._x, pageY: sub._y});
            }
        },

        _unpoll: function () {
            if (this._poll) {
                this._poll.cancel();
                this._poll = null;
            }
        }
    });


}, 'gallery-2012.10.03-20-02' ,{requires:['event-move'], skinnable:false});
