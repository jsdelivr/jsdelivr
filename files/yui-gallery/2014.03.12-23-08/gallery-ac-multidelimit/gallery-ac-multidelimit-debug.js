YUI.add('gallery-ac-multidelimit', function(Y) {

var HOST            = 'host',
    QUERY_DELIMITER = 'queryDelimiter',
    VALUE           = 'value',
    VALUE_CHANGE    = 'valueChange',
    PARSE_VALUE     = '_parseValue',
    UPDATE_VALUE    = '_updateValue',
    ON_INPUT_BLUR   = '_onInputBlur';

Y.ACMultiQueryDelim = Y.Base.create('ac-multidelim', Y.Plugin.Base, [], {
    _beforeParseValue : function (value) {
        return new Y.Do.Prevent();
    },

    _findLastDelimiter : function (str, delim) {
        if (!Y.Lang.isArray(delim)) {
            return delim;
        }

        var delimIndex = 0,
            useDelim;

        Y.Array.each(delim, function (d) {
            var index = str.lastIndexOf(d);
            if (index > delimIndex) {
                delimIndex = index;
                useDelim = d;
            }
        });

        return useDelim;
    },

    _newParseValue : function (value) {
        var delim = this.get(HOST).get(QUERY_DELIMITER);

        value = value || '';

        delim = this._findLastDelimiter(value, delim);

        if (Y.Lang.isString(delim)) {
            value = value.split(delim);
            value = value[value.length - 1];
        }

        return new Y.Do.AlterReturn('', Y.Lang.trimLeft(value));
    },

    _newUpdateValue : function (newVal) {
        var host = this.get(HOST),
            delim = host.get(QUERY_DELIMITER),
            insertDelim,
            len,
            prevVal;

        newVal = Y.Lang.trimLeft(newVal);

        if (delim) {
            if (Y.Lang.isString(delim)) {
                insertDelim = Y.Lang.trim(delim); // so we don't double up on spaces
                prevVal     = Y.Array.map(Y.Lang.trim(host.get(VALUE)).split(delim), Y.Lang.trim);
                len         = prevVal.length;

                if (len > 1) {
                    prevVal[len - 1] = newVal;
                    newVal = prevVal.join(insertDelim + ' ');
                }

                newVal = newVal + insertDelim + ' ';
            } else if (Y.Lang.isArray(delim)) {
                // For now if you have multiple delimiters, there is no need to
                // try and append one after completing
            }
        }

        host.set(VALUE, newVal);
        return new Y.Do.Prevent();
    },

    _newOnInputBlur : function (e) {
        var host = this.get(HOST),
            delim = host.get(QUERY_DELIMITER),
            testArr,
            delimPos,
            newVal,
            value;

        function trimDelim(str, d) {
            while ((str = Y.Lang.trimRight(str)) &&
                    (delimPos = str.length - d.length) &&
                    str.lastIndexOf(d) === delimPos) {

                str = str.substring(0, delimPos);
            }
            return str;
        }

        function checkForDelimiter (d, i) {
            var trimmed = trimDelim(newVal, Y.Lang.trimRight(d));
            if (trimmed == newVal) {
                testArr[i] = true;
            } else {
                testArr[i] = false;
            }
            newVal = trimmed;
        }

        // If a query delimiter is set and the input's value contains one or
        // more trailing delimiters, strip them.
        if (delim && !host.get('allowTrailingDelimiter')) {
            value = newVal = host._inputNode.get(VALUE);

            if (delim) {
                if (Y.Lang.isString(delim)) {
                    delim = Y.Lang.trimRight(delim);
                    newVal = trimDelim(newVal, delim);
                } else if (Y.Lang.isArray(delim)) {
                    // For an array of delimiters, we need to go through 
                    // all of them until none remain at the end
                    testArr = Y.Array.map(delim, function () {
                        return false;  
                    });

                    while (Y.Array.indexOf(testArr, false) > -1) {
                        Y.Array.each(delim, checkForDelimiter);
                    }
                }
            } else {
                // Delimiter is one or more space characters, so just trim the
                // value.
                newVal = Y.Lang.trimRight(newVal);
            }

            if (newVal !== value) {
                host.set(VALUE, newVal);
            }
        }
        return new Y.Do.Prevent();
    },

    _onValueChange : function (e) {
        if (!e.newVal || (e.src && e.src == 'ui')) {
            return;
        }
        var val = e.newVal,
            host = this.get(HOST),
            completed;
        
        completed = this.getCompletedStr(e.prevVal, val, host.get(QUERY_DELIMITER));
            
        if (completed) {
            e.newVal = completed;
        } else {
            e.newVal = val;
        }
    },
    
    getCompletedStr : function (fullStr, term, delim) {
        var lastDelim = this._findLastDelimiter(fullStr, delim),
            valueArr;

        if (lastDelim) {
            valueArr = fullStr.split(lastDelim);
            valueArr.pop();
            valueArr.push(term);
            return valueArr.join(lastDelim);
        }

    },

    initializer : function () {
        this.doBefore(PARSE_VALUE, this._beforeParseValue);
        this.doAfter(PARSE_VALUE, this._newParseValue);
        this.doBefore(UPDATE_VALUE, this._newUpdateValue);
        this.doBefore(ON_INPUT_BLUR, this._newOnInputBlur);
        this.doBefore(VALUE_CHANGE, this._onValueChange);
    }
}, {
    NS : 'multiQueryDelim'
});



}, 'gallery-2011.02.02-21-07' ,{requires:['autocomplete-list', 'plugin', 'base-build']});
