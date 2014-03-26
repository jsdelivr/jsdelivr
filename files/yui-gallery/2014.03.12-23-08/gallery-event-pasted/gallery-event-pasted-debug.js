YUI.add('gallery-event-pasted', function(Y) {

/**
 * simple event support test
 * TODO: this is useful and should be abstracted
 * @param eventName {String} name of event to test for (with or without 'on' prefix)
 * @param node {Y.Node|HTMLElement} optional node to test event support for
 * @return {Boolean}
 */
function eventSupported(eventName, node) {
    var tag = node && Y.one(node).get('tagName') || 'div',
        tmp = document.createElement(tag),
        evt = (eventName.indexOf('on') === 0 ? eventName : 'on' + eventName),
        ret = (evt in tmp);
    if (!ret) {
        tmp.setAttribute(evt, '');
        ret = Y.Lang.isFunction(tmp[evt]);
    }
    if (ret && !Y.Node.DOM_EVENTS[evt.substr(2)]) {
        Y.Node.DOM_EVENTS[evt.substr(2)] = 1;
    }
    Y.log(evt + (ret ? '' : ' NOT') + ' supported on ' + tag, 'info');
    return ret;
}

/**
 * pasted event -- fires after paste
 * event object will contain prevVal and newVal properties to see what changed
 * with the paste operation
 *
 * NOTE: would be a lot easier if Opera supported onpaste, but it doesn't, and
 * thus much hackage is needed.
 *
 * Various ways to paste:
 * - keyboard:    (CTRL|CMD) + v
 * - menu:        Edit -> Paste
 * - contextmenu: Paste
 *
 * Usage:
 * YUI().use('gallery-event-pasted', function(Y) {
 *     var onPasted = function(evt) {
 *         alert('pasted!\n\nwas: "' + evt.prevVal + '"\n\nnow: "' + evt.newVal + '"');
 *     };
 *
 *     // fire when any text is pasted into textfield
 *     Y.one('#mytextarea').on('pasted', onPasted);
 *
 *     // fire only if pasted text changed field's value
 *     Y.one('#mytextarea2').on('pasted', onPasted, null, true);
 * });
 *
 * Known Issues:
 * - Opera supported only on text input fields and textareas as the oninput
 *   event isn't fired on other, contenteditable, elements.
 */
Y.Event.define('pasted', {
    on: function(node, sub, pastedEvent) {
        var ON_CHANGE_ONLY = sub.args && sub.args[0],
            VALUE = node.test('input[type=text],input[type=password],textarea') ? 'value' : 'text',
            GUID = Y.guid(),
            fireEvent = function(prevVal, newVal) {
                if (!ON_CHANGE_ONLY || prevVal !== newVal) {
                    Y.log('pasted!\n\nwas:"'+prevVal+'"\n\nnow:"'+newVal+'"', 'info');
                    pastedEvent.fire({prevVal:prevVal, newVal:newVal});
                }
            },
            prevVal, newVal, STATE, BUFFER, recordState;
        if (eventSupported('paste', node)) {
            node.on(GUID+'|paste', function(evt) {
                prevVal = this.get(VALUE);
                Y.later(0, null, function() {
                    newVal = evt.target.get(VALUE);
                    fireEvent(prevVal, newVal);
                });
            });
        } else if (eventSupported('input', node)) {
            // This mess is needed for Opera which doesn't support the
            // onpaste event but does support oninput. It works by tracking
            // the state of the node on various events (keypress/select)
            // and comparing it to the state when the input event is fired.
            // If it has been more than a few ms since the state was last
            // recorded and the change wasn't simply a removal of the
            // selected text, then it must be a paste.
            BUFFER = 50;
            recordState = function(evt) {
                // Win/Opera fires keypress event on key combo,
                // Mac/Opera does not, for consistency return early
                if (evt.type === 'keypress' && evt.ctrlKey) {
                    return;
                }
                STATE = {
                    sel: this.get('selectionEnd') - this.get('selectionStart'),
                    val: this.get(VALUE),
                    mtime: +(new Date())
                };
            };
            node.on(GUID+'|keypress', recordState);
            node.on(GUID+'|select', recordState);
            node.on(GUID+'|input', function(evt) {
                prevVal = STATE ? STATE.val : '';
                newVal = this.get(VALUE);
                if (STATE && newVal.length === (prevVal.length - STATE.sel)) {
                    // cut or delete, do nothing
                } else if (!STATE || (+(new Date()) - STATE.mtime) > BUFFER) {
                    fireEvent(prevVal, newVal);
                }
                recordState.call(this, evt);
            });
            sub._state = STATE;
        } else {
            Y.log('Unsupported browser. Requires support for onpaste or oninput, found neither.', 'error');
        }
        sub._evtGroup = GUID;
    },
    detach: function(node, sub, pastedEvent) {
        node.detachAll(sub._evtGroup+'|*');
    }
});


}, 'gallery-2010.08.11-20-39' ,{requires:['event-synthetic']});
