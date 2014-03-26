YUI.add('gallery-tabby', function(Y) {

    Y.Tabby = function(selector) {
        if (selector === '') {
            Y.error('No Selector Given');
        }
        this._selector = selector;
        this.charCode = String.fromCharCode(9);
        this._handles = [];
    };

    Y.Tabby.prototype = {
        _textareas: null,
        _selector: null,
        _handles: null,
        charCode: null,
        activate: function() {
            this._textareas = Y.all(this._selector);
            if (this._textareas) {
                this._textareas.each(function(v) {
                    this._handles.push(v.on('keydown', Y.bind(this._handleKeyDown, this)));
                }, this);
            }
        },
        deactivate: function() {
            Y.each(this._handles, function(v) {
                v.detach();
            });
        },
        _handleKeyDown: function(e) {
            var key = e.keyCode, tar = e.target, st = tar.get('scrollTop'),
                value = tar.get('value'), range,
                selStart = tar.get('selectionStart'), selEnd = tar.get('selectionEnd');

            if (key == 9) {
                e.halt();
                if (Y.UA.ie) {
                    range = document.selection.createRange();
                    //Only insert a tab when nothing is selected.
                    if (range.text === '') {
                        range.text = this.charCode; 
					    range.collapse(false);
					    range.select();
                    }
                } else {
                    //Only insert a tab when nothing is selected.
                    if (selStart == selEnd) {
                        value = value.substring(0, selStart) + this.charCode + value.substring(selStart);
                        e.target.set('value', value);
                    }
                }
                e.target.set('scrollTop', st);
            }
        }
    };


}, 'gallery-2009.10.27' ,{requires:['node', 'event']});
