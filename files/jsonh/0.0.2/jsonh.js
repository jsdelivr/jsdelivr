// both UPPER and lower, you choose
var JSONH, jsonh = JSONH = function (Array, JSON) {"use strict"; // if you want

    /**
     * Copyright (C) 2011 by Andrea Giammarchi, @WebReflection
     * 
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     * 
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     * 
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */

    // transforms [{a:"A"},{a:"B"}] to [1,"a","A","B"]
    function hpack(list) {
        for (var
            length = list.length,
            // defined properties (out of one object is enough)
            keys = Object_keys(length ? list[0] : {}),
            klength = keys.length,
            // static length stack of JS values
            result = Array(length * klength),
            i = 0,
            j = 0,
            ki, o;
            i < length; ++i
        ) {
            for (
                o = list[i], ki = 0;
                ki < klength;
                result[j++] = o[keys[ki++]]
            );
        }
        // keys.length, keys, result
        return concat.call([klength], keys, result);
    }

    // transforms [1,"a","A","B"] to [{a:"A"},{a:"B"}]
    function hunpack(hlist) {
        for (var
            length = hlist.length,
            klength = hlist[0],
            result = Array(((length - klength - 1) / klength) || 0),
            i = 1 + klength,
            j = 0,
            ki, o;
            i < length;
        ) {
            for (
                result[j++] = (o = {}), ki = 0;
                ki < klength;
                o[hlist[++ki]] = hlist[i++]
            );
        }
        return result;
    }

    // recursive: called via map per each item h(pack|unpack)ing each entry through the schema
    function iteratingWith(method) {
        return function iterate(item) {
            for (var
                path = this,
                current = item,
                i = 0, length = path.length,
                j, k, tmp;
                i < length; ++i
            ) {
                if (isArray(tmp = current[k = path[i]])) {
                    j = i + 1;
                    current[k] = j < length ?
                        map.call(tmp, method, path.slice(j)) :
                        method(tmp)
                    ;
                }
                current = current[k];
            }
            return item;
        };
    }

    // called per each schema (pack|unpack)ing each schema
    function packOrUnpack(method) {
        return function parse(o, schema) {
            for (var
                wasArray = isArray(o),
                result = concat.call(arr, o),
                path = concat.call(arr, schema),
                i = 0, length = path.length;
                i < length; ++i
            ) {
                result = map.call(result, method, path[i].split("."));
            }
            return wasArray ? result : result[0];
        };
    }

    // JSONH.pack
    function pack(list, schema) {
        return schema ? packSchema(list, schema) : hpack(list);
    }

    // JSONH unpack
    function unpack(hlist, schema) {
        return schema ? unpackSchema(hlist, schema) : hunpack(hlist);
    }

    // JSON.stringify after JSONH.pack
    function stringify(list, replacer, space, schema) {
        return JSON_stringify(pack(list, schema), replacer, space);
    }

    // JSONH.unpack after JSON.parse
    function parse(hlist, reviver, schema) {
        return unpack(JSON_parse(hlist, reviver), schema);
    }

    var
        // recycled for different operations
        arr = [],
        // trapped once reused forever
        concat = arr.concat,
        // addressed cross platform Object.keys shim
        Object_keys = Object.keys || function (o) {
            var keys = [], key;
            for (key in o) o.hasOwnProperty(key) && keys.push(key);
            return keys;
        },
        // addressed cross platform Array.isArray shim
        isArray = Array.isArray || (function (toString, arrayToString) {
            arrayToString = toString.call(arr);
            return function isArray(o) {
                return toString.call(o) == arrayToString;
            };
        }({}.toString)),
        // fast and partial Array#map shim
        map = arr.map || function (callback, context) {
            for (var
                self = this, i = self.length, result = Array(i);
                i--;
                result[i] = callback.call(context, self[i], i, self)
            );
            return result;
        },
        // schema related (pack|unpack)ing operations
        packSchema = packOrUnpack(iteratingWith(hpack)),
        unpackSchema = packOrUnpack(iteratingWith(hunpack)),
        // JSON object shortcuts
        JSON_stringify = JSON.stringify,
        JSON_parse = JSON.parse
    ;

    return {
        pack: pack,
        parse: parse,
        stringify: stringify,
        unpack: unpack
    };

}(Array, JSON);

// export for node.js
if(typeof module != 'undefined' && module.exports) {
	module.exports = jsonh;
}