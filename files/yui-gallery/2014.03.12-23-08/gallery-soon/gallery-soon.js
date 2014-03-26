YUI.add('gallery-soon', function (Y, NAME) {

'use strict';
/*!
based on setImmediate.js. https://github.com/NobleJS/setImmediate
Copyright (c) 2011 Barnesandnoble.com, llc and Donavon West
https://github.com/NobleJS/setImmediate/blob/master/MIT-LICENSE.txt
*/

var soon = Y.soon,
    win = Y.config.win,
    queue = [];

if (soon._impl !== 'setTimeout') {
    return;
}

function makeThrow(e) {
    return function () {
        throw e;
    };
}

// Since most of the implementations are based on events of a certain object
// a queue is a way to avoid creating one new event emitter per callback
// This function flushes the queue and makes sure the way errors work in
// microtasks or ticks is maintained
function flush() {
    var _queue = queue, i = 0, length = _queue.length;
    queue = [];
    for (; i < length; i++) {
        // use try...catch to emulate the native behavior of a microtask not
        // interrupting the next one when throwing an error
        try {
            _queue[i]();
        } catch (e) {
            setTimeout(makeThrow(e), 0);
        }
    }
}


// Mutation events are guaranteed to be run in a new microtask, so a DOM node
// that is not added to the document can be used as a beacon for flushing soon's
// queue
if (typeof MutationObserver !== 'undefined') {
    (function () {
        var node = Y.config.doc.createElement('div'),
            observer = new MutationObserver(flush);

        observer.observe(node, {
            attributes: true
        });

        soon._asynchronizer = function (callback) {
            if (queue.push(callback) === 1) {
                node.setAttribute('foo', Y.guid());
            }
        };
        soon._impl = 'MutationObserver';
    }());

// MessageChannel is an unobtrusive asynchronous communication layer that can
// be used to communicate between frames. It can also be used to communicate
// safely between untrusted objects without them having to be on differente
// frames. This is chosen over the regular postMessage because it works in a
// similar way but it does not fire global message events
} else if (typeof MessageChannel !== 'undefined') {
    (function () {
        var channel = new MessageChannel(),
            // At least Safari 6 is having trouble firing message events the
            // first time after the page loads. This was found by asap.js.
            // See https://github.com/kriskowal/asap/blob/master/asap.js#L89-L90
            dispatch = function () {
                setTimeout(function () {
                    dispatch = function () {
                        channel.port2.postMessage(0);
                    };
                    flush();
                }, 0);
            };

        channel.port1.onmessage = flush;

        soon._asynchronizer = function (callback) {
            if (queue.push(callback) === 1) {
                dispatch();
            }
        };
        soon._impl = 'MessageChannel';
    }());

// Check for postMessage support but make sure we're not in a WebWorker.
} else if (('postMessage' in win) && !('importScripts' in win)) {
    (function () {
        var oldOnMessage = win.onmessage,
            postMessageIsAsynchronous = true,
            uid = Y.guid();

        win.onmessage = function () {
            postMessageIsAsynchronous = false;
        };

        win.postMessage('', '*');
        win.onmessage = oldOnMessage;

        function onMessage(e) {
            if (e.data === uid) {
                flush();
            }
        }

        if (postMessageIsAsynchronous) {
            if (win.addEventListener) {
                win.addEventListener('message', onMessage, false);
            } else {
                win.attachEvent('onmessage', onMessage);
            }

            soon._asynchronizer = function (callback) {
                if (queue.push(callback) === 1) {
                    win.postMessage(uid, '*');
                }
            };
            soon._impl = 'postMessage';
        }
    }());
}


}, '@VERSION@', {"requires": ["node-base", "timers"]});
