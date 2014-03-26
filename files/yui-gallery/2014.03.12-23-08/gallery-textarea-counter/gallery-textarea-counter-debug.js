YUI.add('gallery-textarea-counter', function(Y) {



        var setNode = function(node) {
            return Y.one(node);
        },
        setUI = function(attr, num) {
            var n = this.get(attr);
            if (n) {
                n.set('innerHTML', num);
            }
        },
        TC = function(config) {
            config.node = config.host;
            TC.superclass.constructor.call(this, config);
        };
        
        TC.NAME = "gallery-textarea-counter";

        TC.NS = "counter";

        TC.ATTRS = {
            node: {
                setter: setNode
            },
            wordsNode: {
                setter: setNode
            },
            charsNode: {
                setter: setNode
            },
            rowsNode: {
                setter: setNode
            },
            colsNode: {
                setter: setNode
            },
            rowCount: {
                setter: function(num) {
                    setUI.call(this, 'rowsNode', num);
                    return num;
                }
            },
            colCount: {
                setter: function(num) {
                    setUI.call(this, 'colsNode', num);
                    return num;
                }
            },
            wordCount: {
                setter: function(num) {
                    setUI.call(this, 'wordsNode', num);
                    return num;
                }
            },
            charCount: {
                setter: function(num) {
                    setUI.call(this, 'charsNode', num);
                    return num;
                }
            }
        };

        Y.extend(TC, Y.Base, {
            _handles: null,
            initializer: function() {
                this._handles = [];
                var n = this.get('node'),
                    fn = Y.bind(this.count, this);
                this._handles.push(n.on('keyup', fn));
                this._handles.push(n.on('keypress', fn));
                this._handles.push(n.on('mouseup', fn));
                this._handles.push(n.on('focus', fn));
                
            },
            count: function() {
                var node = this.get('node'),
                    text = node.get('value'),
                    defWordCount = this.get('wordCount'),
                    defCharCount = this.get('charCount'),
                    defColCount = this.get('colCount'),
                    defRowCount = this.get('rowCount'),
                    wordCount = 0,
                    charCount = ((text.length) ? text.length : ((node.get('textLength')) ? node.get('textLength') : 0)),
                    start = node.get('selectionStart'),
                    end = node.get('selectionEnd'),
                    rows = 0, cols = 0, range, stored_range, rowList, rowCount, i, sc, ec, r = 0;

                if (charCount > 0) {
                    wordCount = text.match(/\b/g);
                    wordCount = ((wordCount) ? (wordCount.length / 2) : 0);
                }


                if (Y.UA.ie) {
                    if (document.selection) {
                        range = document.selection.createRange();
                        stored_range = range.duplicate();
                        stored_range.moveToElementText(node._node);
                        stored_range.setEndPoint('EndToEnd', range);
                        start = stored_range.text.length - range.text.length;
                        end = start + range.text.length;
                    }
                    
                }
                
                rowList = text.split(/\n/);
                rowCount = ((rowList) ? rowList.length : 1);

                for (i = 0; i < rowCount; i++) {
                    if (Y.UA.gecko) {
                        charCount++;
                    }
                    r += (rowList[i].length + 1);
                    sc = (r - rowList[i].length - 1);
                    ec = ((rowList[i].length + 1) + sc);
                    if ((start >= sc) && (start <= ec)) {
                        rows = (i + 1);
                        cols = ((start - sc) + 1);
                    }
                }

                if (Y.UA.gecko) {
                    charCount--;
                }
                if (start !== end) { //No Selection
                    rows = 0;
                    cols = 0;
                }
                
                if (defWordCount !== wordCount) {
                    this.set('wordCount', wordCount);
                }
                if (defCharCount !== charCount) {
                    this.set('charCount', charCount);
                }
                if (defRowCount !== rows) {
                    this.set('rowCount', rows);
                }
                if (defColCount !== cols) {
                    this.set('colCount', cols);
                }
            
            },
            destructor: function() {
                if (this._handles) {
                    Y.each(this._handles, function(v) {
                        v.detach();
                    });
                }
            }
        });
        Y.namespace('Plugin');
        Y.Plugin.Counter = TC;



}, 'gallery-2009.11.09-19' ,{requires:['node', 'event']});
