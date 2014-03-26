YUI.add('gallery-ac-typeahead', function(Y) {

var HOST            = 'host',
    INPUT_NODE      = 'inputNode',
    VALUE           = 'value',
    QUERY_DELIMITER = 'queryDelimiter';

Y.ACTypeAhead = Y.Base.create('ac-typeahead', Y.Plugin.Base, [], {
    _setTypeAheadValue : function (value) {
        if (!this._userInput) {
            return;
        }

        var host = this.get(HOST),
            inputNode = host.get(INPUT_NODE),
            inputValue = inputNode.get(VALUE);
        this._taNode.set('disabled', false);
        this._taNode.set(VALUE, value);
        this._taNode.set('disabled', true);

        // Convert the case in the input to match the result
        if (value.length > 0) {
            inputNode.set(VALUE, value.substr(0,inputValue.length));
        }
    },

    _afterResults : function (e) {
        var res = e.results[0],
            host = this.get(HOST),
            taVal =  '';

        if (e.query.length > 0 && res) {
            if (host.multiQueryDelim) {
                taVal = host.multiQueryDelim.getCompletedStr(
                    host.get(VALUE),
                    res.text,
                    host.get(QUERY_DELIMITER)
                ) || res.text;
            } else {
                taVal = res.text;
            }
        }

        this._setTypeAheadValue(taVal);
    },

    _afterActiveItemChange : function (e) {
        var host = this.get(HOST),
            txt;
        if (e.newVal) {
            txt = e.newVal.getData('result').text;
            if (host.multiQueryDelim) {
                txt = host.multiQueryDelim.getCompletedStr(
                    host.get(VALUE),
                    txt,
                    host.get(QUERY_DELIMITER)
                );
            }
        }
        if (txt) {
            this._setTypeAheadValue(txt);
        }
    },

    _afterVisChange : function (e) {
        if (!e.newVal) {
            this._setTypeAheadValue('');
        }
        this._userInput = false;
    },

    _afterTabKeyDown : function (e) {
        if (!this._userInput || !this._taNode.get(VALUE)) {
            return;
        }
        
        var host = this.get(HOST),
            listNode, listItems, selected;

        if (host.get('visible')) {
            listNode = host.get('listNode');
            listItems = listNode.all('li.yui3-aclist-item');
            selected = host.get('activeItem') || listItems.item(0);

            if (selected) {         
                host.selectItem(selected);
            }
        
            e.preventDefault();
        }

        host.hide();
    },

    _afterKeydown : function (e) {
        this._userInput = true;
    },

    _initTypeAheadNode : function () {
        this._taNode = Y.Node.create('<input disabled />');
        this._taContainer = Y.Node.create('<div></div>');

        var inputNode = this.get(HOST).get(INPUT_NODE);

        inputNode.get('parentNode').insert(this._taContainer, inputNode);
        this._taContainer.append(this._taNode);

        this._tabKeyDownHandle = Y.after('key', this._afterTabKeyDown, inputNode, 'down:9,13', this);
        this._keyDownHandle = inputNode.after('keydown', this._afterKeydown, this);

        this._taContainer.setStyles({
            position: 'absolute',
            zIndex: 1,
            opacity : 0.75
        });

        inputNode.setStyles({
            position: 'relative',
            zIndex: 2,
            backgroundColor: 'transparent'
        });
    },

    initializer : function () {
        this._initTypeAheadNode();
        this._userInput = false;

        this.doAfter('results', this._afterResults);
        this.doAfter('visibleChange', this._afterVisChange);
        this.doAfter('activeItemChange', this._afterActiveItemChange);
    },

    destructor : function () {
        this._taContainer.remove();
        this.get(HOST).get(INPUT_NODE).setStyles({
            position: '',
            zIndex: '',
            backgroundColor: ''

        });
        this._keyDownHandle.detach();
        this._tabKeyDownHandle.detach();
    }
}, {
    NS : 'typeahead'
});


}, 'gallery-2011.02.02-21-07' ,{requires:['autocomplete-base', 'plugin', 'base-build']});
