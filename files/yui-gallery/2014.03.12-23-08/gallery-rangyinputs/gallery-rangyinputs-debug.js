YUI.add('gallery-rangyinputs', function (Y, NAME) {

/**
 * RangyInputs
 *
 * Node plugin for obtaining and manipulating selections within <textarea> and
 * <input type="text"> HTML elements.
 *
 * @module plugin-rangy-inputs
 * @class Plugin.RangyInputs
 * @constructor
 *
 **/

var RangyInputs;

/**
 *
 * @param {Object} config User config object
 */
RangyInputs = function(config) {
    this._node = config.host._node;
};

/**
 * @static
 * @param {Object} node
 * @param {Number} start start position
 * @param {Number} end end position
 */
function adjustOffsets(node, start, end) {
    if (start < 0) {
        start += node.value.length;
    }
    if (typeof end === "undefined") {
        end = start;
    }
    if (end < 0) {
        end += node.value.length;
    }
    return {
        start: start,
        end: end
    };
}


/**
 * @static
 * @param {Object} node
 * @param {Number} start start position
 * @param {Number} end end position
 */
function makeSelection(node, start, end) {
    return {
        start: start,
        end: end,
        length: end - start,
        text: node.value.slice(start, end)
    };

}

RangyInputs.NS = "rangy";

RangyInputs.prototype = {

    /**
      Returns an object representing the user selection within the text input
      or textarea element.

      The object returned has the following properties:

      * `start`: The character index of the start position of the selection
      * `end`: The character index of the end position of the selection
      * `length`: The number of characters selected
      * `text`: The selected text

     Note that in IE the textarea or text input must have the focus before
     calling this method.

     **/
    getSelection: function () {
        var node = this._node,
        start = node.selectionStart,
        end = node.selectionEnd;

        return makeSelection(node, start, end);
    },

    /**
     * Selects the text within the text input or textarea element between the
     * specified start and end character indices.
     *
     * @param {Number} startOffset
     * @param {Number} endOffset
     */
    setSelection: function (startOffset, endOffset) {
        var node = this._node,
        offsets = adjustOffsets(node, startOffset, endOffset);

        node.selectionStart = offsets.start;
        node.selectionEnd = offsets.end;

        return this;
    },

    /**
     * Collapses the selection to an insertion point (caret) either at the
     * start of the current selection if toStart is true or the end of the
     * current selection otherwise.
     *
     * @param {Boolean} toStart
     */
    collapseSelection: function (toStart) {
        var node = this._node;

        if (toStart) {
            node.selectionEnd = node.selectionStart;
        } else {
            node.selectionStart = node.selectionEnd;
        }

        return this;
    },

    /**
     * Deletes the text within the text input or textarea element between the
     * specified start and end character indices and optionally places the
     * caret at the position where the deleted text had been if moveSelection
     * is true.
     *
     * @param {Number} start
     * @param {number} end
     * @param {Boolean} [moveSelection]
     */
    deleteText: function (start, end, moveSelection) {
        var val,
        node = this._node;

        if (start !== end) {
            val = node.value;
            node.value = val.slice(0, start) + val.slice(end);
        }
        if (moveSelection) {
            this.setSelection(start, start);
        }

        return this;
    },

    /**
     * Deletes the currently selected text within the text input or textarea
     * element and places the caret at the position where the deleted text had
     * been.
     *
     */
    deleteSelectedText: function () {
        var sel = this.getSelection();

        this.deleteText(sel.start, sel.end, true);

        return this;
    },

    /**
     * Deletes the currently selected text within the text input or textarea
     * element, places the caret at the position where the deleted text had
     * been and returns the text that was deleted.
     */
    extractSelectedText: function () {
        var node = this._node,
        sel = this.getSelection(),
        val;

        if (sel.start !== sel.end) {
            val = node.value;
            node.value = val.slice(0, sel.start) + val.slice(sel.end);
        }
        this.setSelection(sel.start, sel.start);

        return sel.text;
    },


    /**
     * @private
     * @param {Number} startIndex
     * @param {String} text
     * @param {String} [selectionBehaviour]
     */
    _updateSelectionAfterInsert: function (startIndex, text, selectionBehaviour) {
        var endIndex = startIndex + text.length;

        selectionBehaviour = (typeof selectionBehaviour === "string") ? selectionBehaviour.toLowerCase() : "";

        switch (selectionBehaviour) {
            case "collapsetostart":
                this.setSelection(startIndex, startIndex);
            break;
            case "collapsetoend":
                this.setSelection(endIndex, endIndex);
            break;
            case "select":
                this.setSelection(startIndex, endIndex);
            break;
        }

    },

    /**
     * Inserts the specified text at the specified character position within
     * the text input or textarea element and optionally updates the selection
     * depending on the value of selectionBehaviour. Possible values are:
     *
     * * `select`: Selects the inserted text
     * * `collapseToStart`: Collapses the selection to a caret at the
     *    start of the inserted text
     * * `collapseToEnd`: Collapses the selection to a caret at the
     *    end of the inserted text
     *
     * If no value is supplied for selectionBehaviour, the
     * selection is not changed and left at the mercy of the
     * browser (placing the caret at the start is not uncommon when
     * the textarea's value is changed).
     *
     * @param {String} text
     * @param {Number} index
     * @param {String} [selectionBehaviour]
     */
    insertText: function (text, index, selectionBehaviour) {
        var node = this._node,
        val = node.value;

        node.value = val.slice(0, index) + text + val.slice(index);
        if (typeof selectionBehaviour === "boolean") {
            selectionBehaviour = selectionBehaviour ? "collapseToEnd" : "";
        }
        this._updateSelectionAfterInsert(index, text, selectionBehaviour);

        return this;
    },

    /**
     * Replaces the currently selected text in the text input or textarea
     * element with the specified text and optionally updates the selection
     * depending on the value of selectionBehaviour. Possible values are:
     *
     * * `select`: Selects the inserted text
     * * `collapseToStart`: Collapses the selection to a caret at the
     *    start of the inserted text
     * * `collapseToEnd`: Collapses the selection to a caret at the
     *    end of the inserted text
     *
     * If no value is supplied for selectionBehaviour, "collapseToEnd" is
     * assumed.
     *
     * @param {String} text
     * @param {Number} index
     * @param {String} [selectionBehaviour='collapseToEnd']
     */
    replaceSelectedText: function (text, selectionBehaviour) {
        var node = this._node,
        sel = this.getSelection(),
        val = node.value;

        node.value = val.slice(0, sel.start) + text + val.slice(sel.end);
        this._updateSelectionAfterInsert(sel.start, text, selectionBehaviour || "collapseToEnd");

        return this;
    },

    /**
     * Surrounds the currently selected text in the text input or textarea
     * element with the specified pieces of text and optionally updates the
     * selection depending on the value of selectionBehaviour. Possible values
     * are:
     * * `select`: Selects the inserted text
     * * `collapseToStart`: Collapses the selection to a caret at the
     *    start of the inserted text
     * * `collapseToEnd`: Collapses the selection to a caret at the
     *    end of the inserted text
     * @param {String} before
     * @param {String} after
     * @param {String} [selectionBehaviour='select']
     */
    surroundSelectedText: function (before, after, selectionBehaviour) {
        if (typeof after === "undefined") {
            after = before;
        }
        var node = this._node,
        sel = this.getSelection(),
        val = node.value,
        startIndex;

        node.value = val.slice(0, sel.start) + before + sel.text + after + val.slice(sel.end);
        startIndex = sel.start + before.length;
        this._updateSelectionAfterInsert(startIndex, sel.text, selectionBehaviour || "select");

        return this;
    }
};

function RangyInputsIE() {}

RangyInputsIE.prototype = {

    getSelection: function () {
        var node = this._node,
        start = 0,
        end = 0,
        normalizedValue,
        textInputRange,
        len,
        endRange,
        range = Y.config.doc.selection.createRange();

        if (range && range.parentElement() === node) {
            len = node.value.length;

            normalizedValue = node.value.replace(/\r\n/g, "\n");
            textInputRange = node.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());
            endRange = node.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;
                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }

        return makeSelection(node, start, end);
    },

    _offsetToRangeCharacterMove: function (offset) {
        var node = this._node;

        return offset - (node.value.slice(0, offset).split("\r\n").length - 1);
    },


    setSelection: function (startOffset, endOffset) {
        var node = this._node,
        offsets = adjustOffsets(node, startOffset, endOffset),
        range = node.createTextRange(),
        startCharMove = this._offsetToRangeCharacterMove(offsets.start);

        range.collapse(true);
        if (offsets.start === offsets.end) {
            range.move("character", startCharMove);
        } else {
            range.moveEnd("character", this._offsetToRangeCharacterMove(offsets.end));
            range.moveStart("character", startCharMove);
        }
        range.select();

        return this;
    },

    collapseSelection: function (toStart) {
        var range = Y.config.doc.selection.createRange();

        range.collapse(toStart);
        range.select();

        return this;
    }
};


if (Y.config.doc.selection && !Y.config.win.getSelection) {
    RangyInputs = Y.augment(RangyInputs, RangyInputsIE, true);
}

Y.namespace('Plugin').RangyInputs = RangyInputs;


}, 'gallery-2013.09.04-21-56', {"use": ["node-base", "node-pluginhost"], "requires": ["yui-base"]});
