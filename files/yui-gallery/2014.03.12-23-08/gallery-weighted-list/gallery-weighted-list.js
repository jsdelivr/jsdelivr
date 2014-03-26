YUI.add('gallery-weighted-list', function (Y, NAME) {

/**
@module gallery-weighted-list
@author Steven Olmsted
*/
(function (Y) {
    'use strict';

    var _Array = Y.Array,
        _Lang = Y.Lang,
        _Math = Math,

        _each = _Array.each,
        _floor = _Math.floor,
        _isArray = _Lang.isArray,
        _isFunction = _Lang.isFunction,
        _iterate = _Array.iterate,
        _map = _Array.map,
        _random = _Math.random,
        _reduce = _Array.reduce,
        _some = _Array.some,

        /**
        @class WeightedList
        @constructor
        @param {Number|String|[Number|String]} [seedValues=Y.Lang.now()]* Any
        number of seed values can be passed as individual arguments or an array
        of seed values can be passed as a single argument.  If left undefined,
        Y.Lang.now() is used as a seed.  Seed values are only effective if
        gallery-alea is present.
        */
        _Class = function (args) {
            /**
            @property _array
            @protected
            @type Array
            */
            this._array = [];

            /**
            This instance's random number generator.
            @method _random
            @protected
            @return {Number}
            */
            this._random = Y.Alea ? new Y.Alea(_isArray(args) ? args : _Array(arguments)).random : _random;
        };

    _Class.prototype = {
        /**
        Add a value to the weighted list.
        @method add
        @param value
        @param {Number} [weight=1]
        @return {Number} The index of the item that was added.
        */
        add: function (value, weight) {
            var me = this,

                array = me._array;

            if (!weight && weight !== 0) {
                weight = 1;
            }

            array.push({
                value: value,
                weight: weight
            });

            delete me._sum;
            delete me._totals;

            return array.length - 1;
        },
        /**
        Dedupes a weighted list of string values, returning a new weighted
        list that is guaranteed to contain only one copy of a given string
        value.  This method differs from the unique method in that it's
        optimized for use only with string values, whereas unique may be used
        with other types (but is slower).  Using dedupe with non-string
        values may result in unexpected behavior.
        @method dedupe
        @param {String} [mode='sum']  If the original weighted list contains
        duplicate values with different weights, the mode specifies how those
        weights get transferred to the new weighted list.  mode may be one of
        the following values:

        * 'first' - Use the first weight that is found.  Ignore all others.
        * 'sum' - Use the sum of all weights that are found.  This is the
          default mode.

        @return {WeightedList}
        */
        dedupe: function (mode) {
            var array = this._array,
                i = 0,
                index,
                item,
                itemValue,
                length = array.length,
                object = {},
                other = new _Class();

            if (!mode) {
                mode = 'sum';
            }

            for (; i < length; i += 1) {
                item = array[i];
                itemValue = item.value;

                if (!object.hasOwnProperty(itemValue)) {
                    object[itemValue] = other.add(itemValue, item.weight);
                } else if (mode === 'sum') {
                    index = object[itemValue];
                    other.updateWeight(index, other.weight(index) + item.weight);
                }
            }

            return other;
        },
        /**
        Executes the supplied function for each value in the weighted list.
        @method each
        @chainable
        @param {Function} fn The function to execute for each value in the
        weighted list.  The first argument passed to this function will be the
        value.  The second argument passed to this function will be the value's
        index.  The third argument passed to this function will be the value's
        weight.
        @param [context] The context the function is called with.
        */
        each: function (fn, context) {
            _each(this._array, function (item, index) {
                fn.call(context, item.value, index, item.weight);
            });

            return this;
        },
        /**
        Executes the supplied function for each value in the weighted list.
        Iteration stops if the supplied function does not return a truthy value.
        @method every
        @param {Function} fn The function to execute for each value in the
        weighted list.  The first argument passed to this function will be the
        value.  The second argument passed to this function will be the value's
        index.  The third argument passed to this function will be the value's
        weight.
        @param [context] The context the function is called with.
        @return {Boolean} true if every value in the weighted list returns true
        from the supplied function, false otherwise.
        */
        every: function (fn, context) {
            return !_some(this._array, function (item, index) {
                return !fn.call(context, item.value, index, item.weight);
            });
        },
        /**
        Executes the supplied function for each value in the weighted list.
        Returns a new weighted list containing the values for which the supplied
        function returned a truthy value.  The values in the new weighted list
        will retain the same weights they had in the original weighted list.
        @method filter
        @param {Function} fn The function to execute for each value in the
        weighted list.  The first argument passed to this function will be the
        value.  The second argument passed to this function will be the value's
        index.  The third argument passed to this function will be the value's
        weight.
        @param [context] The context the function is called with.
        @return {WeightedList}
        */
        filter: function (fn, context) {
            var other = new _Class();

            _each(this._array, function (item, index) {
                var itemValue = item.value,
                    itemWeight = item.weight;

                if (fn.call(context, itemValue, index, itemWeight)) {
                    other.add(itemValue, itemWeight);
                }
            });

            return other;
        },
        /**
        Executes the supplied function for each value in the weighted list,
        searching for the first value that matches the supplied function.
        @method find
        @param {Function} fn The function to execute for each value in the
        weighted list.  The first argument passed to this function will be the
        value.  The second argument passed to this function will be the value's
        index.  The third argument passed to this function will be the value's
        weight.  Iteration is stopped as soon as this function returns true.
        @param [context] The context the function is called with.
        @return The found value is returned or null is returned if no value was
        found.
        */
        find: function (fn, context) {
            var found = null;

            _some(this._array, function (item, index) {
                var itemValue = item.value;

                if (fn.call(context, itemValue, index, item.weight)) {
                    found = itemValue;
                    return true;
                }
            });

            return found;
        },
        /**
        Iterates over a weighted list, returning a new weighted list with all
        the values that match the supplied regular expression.  The values in
        the new weighted list will retain the same weights they had in the
        original weighted list.
        @method grep
        @param {RegExp} pattern Regular expression to test against each item.
        @return {WeightedList}
        */
        grep: function (pattern) {
            var other = new _Class();

            _each(this._array, function (item) {
                var itemValue = item.value;

                if (pattern.test(itemValue)) {
                    other.add(itemValue, item.weight);
                }
            });

            return other;
        },
        /**
        Returns the index of the first value in the weighted list that is equal
        (using a strict equality check) to the specified value, or -1 if the
        value isn't found.
        @method indexOf
        @param value
        @param {Number} [from=0]  The index at which to begin the search.
        @return {Number}
        */
        indexOf: function (value, from) {
            var me = this,

                array = me._array,
                found = -1;

            from = from || 0;

            if (from < 0) {
                from += array.length;
            }

            _some(array, function (item, index) {
                if (index < from) {
                    return false;
                }

                if (me.itemsAreEqual(item.value, value)) {
                    found = index;
                    return true;
                }
            });

            return found;
        },
        /**
        Executes a named method on each value in a weighted list of objects.
        Values in the weighted list that do not have a method by that name will
        be skipped.
        @method invoke
        @param {String} methodName
        @return {WeightedList} A new weighted list is returned containing the
        return values from each method or null if the method does not exist.
        The values in the new weighted list will retain the same weights they
        had in the original weighted list.
        */
        invoke: function (methodName) {
            var args = _Array(arguments, 1, true),
                other = new _Class();

            _each(this._array, function (item) {
                var itemValue = item.value,
                    method = itemValue && itemValue[methodName];

                other.add(_isFunction(method) ? method.apply(itemValue, args) : null, item.weight);
            });

            return other;
        },
        /**
        Returns true if the weighted list is empty.
        @method isEmpty
        @return {Boolean}
        */
        isEmpty: function () {
            return !this._array.length;
        },
        /**
        Gets an item by index from the weighted list if an index is supplied.
        If an index is not supplied, an item is selected by weighted random
        distribution.
        @method item
        @param {Number} [index]
        @return {Object}  The item is returned or null is returned if the given
        index does not exist.  A returned item will be an object with the
        following properties:

        * index - This item's index.
        * value - This item's value.
        * weight - This item's weight.
        */
        item: function (index) {
            if (!index && index !== 0) {
                index = this._randomIndex();
            }

            var item = this._array[index];
            return item ? {
                index: index,
                value: item.value,
                weight: item.weight
            } : null;
        },
        /**
        Default comparator for values stored in this weighted list.  Used by the
        indexOf, lastIndexOf, and remove methods.
        @method itemsAreEqual
        @param a
        @param b
        @return {Boolean}
         */
        itemsAreEqual: function (a, b) {
            return a === b;
        },
        /**
        Returns the index of the last value in the weighted list that is equal
        (using a strict equality check) to the specified value, or -1 if the
        value isn't found.
        @method lastIndexOf
        @param value
        @param {Number} [from=size()-1] The index at which to begin the search.
        Defaults to the last index in the weighted list.
        @return {Number}
        */
        lastIndexOf: function (value, from) {
            var me = this,

                array = me._array,
                arrayLength = array.length,
                found = -1;

            if (!from && from !== 0) {
                from = arrayLength - 1;
            }

            if (from < 0) {
                from += array.length;
            }

            _iterate(array, -1, function (item, index) {
                if (index > from) {
                    return false;
                }

                if (me.itemsAreEqual(item.value, value)) {
                    found = index;
                    return true;
                }
            });

            return found;
        },
        /**
        Executes the supplied function for each value in the weighted list and
        returns a new weighted list containing all the values returned by the
        supplied function.  The values in the new weighted list will retain the
        same weights they had in the original weighted list.
        @method map
        @param {Function} fn The function to execute for each value in the
        weighted list.  The first argument passed to this function will be the
        value.  The second argument passed to this function will be the value's
        index.  The third argument passed to this function will be the value's
        weight.
        @param [context] The context the function is called with.
        @return {WeightedList}
        */
        map: function (fn, context) {
            var other = new _Class();

            _each(this._array, function (item, index) {
                var itemWeight = item.weight;

                other.add(fn.call(context, item.value, index, itemWeight), item.weight);
            });

            return other;
        },
        /**
        Partitions a weighted list into two new weighted lists, one with the
        values for which the supplied function returns true, and one with the
        values for which the function returns false.  The values in the new
        weighted lists will retain the same weights they had in the original
        weighted list.
        @method partition
        @param {Function} fn The function to execute for each value in the
        weighted list.  The first argument passed to this function will be the
        value.  The second argument passed to this function will be the value's
        index.  The third argument passed to this function will be the value's
        weight.
        @param [context] The context the function is called with.
        @return {Object} An object with two properties: matches and rejects.
        Each is a weighted list containing the items that were selected or
        rejected by the test function.
        */
        partition: function (fn, context) {
            var matches = new _Class(),
                rejects = new _Class();

            _each(this._array, function (item, index) {
                var itemValue = item.value,
                    itemWeight = item.weight;

                (fn.call(context, itemValue, index, itemWeight) ? matches : rejects).add(itemValue, itemWeight);
            });

            return {
                matches: matches,
                rejects: rejects
            };
        },
        /**
        Executes the supplied function for each value in the weighted list,
        "folding" the weighted list into a single value.
        @method reduce
        @param initialValue
        @param {Function} fn The function to execute for each value in the
        weighted list.  The first argument passed to this function will be the
        value returned from the previous iteration or the initial value if this
        is the first iteration.  The second argument passed to this function
        will be the current value in the weighted list.  The third argument
        passed to this function will be the current value's index.  The fourth
        argument passed to this function will be the current value's weight.
        @param [context] The context the function is called with.
        @return Final result from iteratively applying the given function to
        each value in the weighted list.
        */
        reduce: function (initialValue, fn, context) {
            return _reduce(this._array, initialValue, function (value, item, index) {
                return fn.call(context, value, item.value, index, item.weight);
            });
        },
        /**
        The inverse of the filter method.  Executes the supplied function for
        each value in the weighted list.  Returns a new weighted list containing
        the values for which the supplied function returned false.  The values
        in the new weighted list will retain the same weights they had in the
        original weighted list.
        @method reject
        @param {Function} fn The function to execute for each value in the
        weighted list.  The first argument passed to this function will be the
        value.  The second argument passed to this function will be the value's
        index.  The third argument passed to this function will be the value's
        weight.
        @param [context] The context the function is called with.
        @return {WeightedList}
        */
        reject: function (fn, context) {
            var other = new _Class();

            _each(this._array, function (item, index) {
                var itemValue = item.value,
                    itemWeight = item.weight;

                if (!fn.call(context, itemValue, index, itemWeight)) {
                    other.add(itemValue, itemWeight);
                }
            });

            return other;
        },
        /**
        Removes the first or all occurrences of a value from the weighted list.
        This may cause remaining values to be reindexed.
        @method remove
        @param value
        @param {Boolean} [all=false] If true, removes all occurances.
        @return {Number} The number of items that were removed.
        */
        remove: function (value, all) {
            var me = this,

                array = me._array,
                count = 0,
                i = array.length - 1;

            for (; i >= 0; i -= 1) {
                if (me.itemsAreEqual(value, me.value(i))) {
                    array.splice(i, 1);
                    count += 1;

                    if (!all) {
                        break;
                    }
                }
            }

            if (count) {
                delete me._sum;
                delete me._totals;
            }

            return count;
        },
        /**
        Removes a value from the weighted list by index.  This may cause
        remaining values to be reindexed.
        @method removeIndex
        @chainable
        @param {Number} index
        */
        removeIndex: function (index) {
            var me = this;

            me._array.splice(index, 1);
            delete me._sum;
            delete me._totals;

            return me;
        },
        /**
        Returns the number of values in the weighted list.
        @method size
        @return {Number}
        */
        size: function () {
            return this._array.length;
        },
        /**
        Executes the supplied function for each value in the weighted list.
        Returning a truthy value from the function will stop the processing of
        remaining values.
        @method some
        @param {Function} fn The function to execute for each value in the
        weighted list.  The first argument passed to this function will be the
        value.  The second argument passed to this function will be the value's
        index.  The third argument passed to this function will be the value's
        weight.
        @param [context] The context the function is called with.
        @return {Boolean} true if the function returns a truthy value on any of
        the values in the weighted list; false otherwise.
        */
        some: function (fn, context) {
            return _some(this._array, function (item, index) {
                return fn.call(context, item.value, index, item.weight);
            });
        },
        /**
        Change the value and weight of an item that is already in the weighted
        list.
        @method update
        @chainable
        @param {Number} index
        @param value
        @param {Number} weight
        */
        update: function (index, value, weight) {
            var me = this;

            if (!weight && weight !== 0) {
                weight = 1;
            }

            me._array[index] = {
                value: value,
                weight: weight
            };

            delete me._sum;
            delete me._totals;

            return me;
        },
        /**
        Change the value of an item that is already in the weighted list.
        @method updateValue
        @chainable
        @param {Number} index
        @param value
        */
        updateValue: function (index, value) {
            return this.update(index, value, this.weight(index));
        },
        /**
        Change the weight of an item that is already in the weighted list.
        @method updateWeight
        @chainable
        @param {Number} index
        @param {Number} weight
        */
        updateWeight: function (index, weight) {
            return this.update(index, this.value(index), weight);
        },
        /**
        Returns a copy of the weighted list with duplicate values removed.
        @method unique
        @param {String} [mode='sum'] If the original weighted list contains
        duplicate values with different weights, the mode specifies how those
        weights get transferred to the new weighted list.  mode may be one of
        the following values:

        * 'first' - Use the first weight that is found.  Ignore all others.
        * 'sum' - Use the sum of all weights that are found.  This is the
          default mode.

        @return {WeightedList}
        */
        unique: function (mode) {
            if (!mode) {
                mode = 'sum';
            }

            var other = new _Class();

            _each(this._array, function (item) {
                var itemValue = item.value;

                if (!_some(other._array, function (otherItem, index) {
                    if (otherItem.value === itemValue) {
                        if (mode === 'sum') {
                            other.updateWeight(index, otherItem.weight + item.weight);
                        }

                        return true;
                    }
                })) {
                    other.add(itemValue, item.weight);
                }
            });

            return other;
        },
        /**
        Provides an array of values.
        @method toArray
        @return {Array}
        */
        toArray: function () {
            return _map(this._array, function (item) {
                return item.value;
            });
        },
        /**
        Provides an array of values for JSON.stringify.
        @method toJSON
        @return {Array}
        */
        toJSON: function () {
            return this.toArray();
        },
        /**
        @method toString
        @return {String}
        */
        toString: function () {
            return this.toArray().toString();
        },
        /**
        Gets a value by index from the weighted list if an index is supplied.
        If an index is not supplied, a value is selected by weighted random
        distribution.
        @method value
        @param {Number} [index]
        @return The value is returned or null is returned if the given index
        does not exist.
        */
        value: function (index) {
            if (!index && index !== 0) {
                index = this._randomIndex();
            }

            var item = this._array[index];
            return item ? item.value : null;
        },
        /**
        Gets a value's weight by index from the weighted list if an index is
        supplied.  If an index is not supplied, a value is selected by weighted
        random distribution.
        @method weight
        @param {Number} [index]
        @return {Number} The weight is returned or null is returned if the
        given index does not exist.
        */
        weight: function (index) {
            if (!index && index !== 0) {
                index = this._randomIndex();
            }

            var item = this._array[index];
            return item ? item.weight : null;
        },
        /**
        Returns an index by weighted random distribution.
        @method _randomIndex
        @protected
        @return {Number}
        */
        _randomIndex: function () {
            var maximumIndex,
                me = this,
                middleIndex,
                minimumIndex = 0,
                random,
                sum = me._sum,
                total,
                totals = me._totals;

            if (!sum || !totals) {
                me._update();

                sum = me._sum;
                totals = me._totals;

                if (!sum || !totals || !totals.length) {
                    return null;
                }
            }

            maximumIndex = totals.length - 1;
            random = _floor(me._random() * sum);

            while (maximumIndex >= minimumIndex) {
                middleIndex = (maximumIndex + minimumIndex) / 2;

                if (middleIndex < 0) {
                    middleIndex = 0;
                } else {
                    middleIndex = _floor(middleIndex);
                }

                total = totals[middleIndex];

                if (random === total) {
                    middleIndex += 1;
                    break;
                } else if (random < total) {
                    if (middleIndex && random > totals[middleIndex - 1]) {
                        break;
                    }

                    maximumIndex = middleIndex - 1;
                } else if (random > total) {
                    minimumIndex = middleIndex + 1;
                }
            }

            return middleIndex;
        },
        /**
        Updates chached data for achieving weighted random distribution.
        @method _update
        @chainable
        @protected
        */
        _update: function () {
            var me = this,
                sum = 0,
                totals = [];

            _each(me._array, function (item) {
                sum += item.weight;
                totals.push(sum);
            });

            /**
            The cached sum of all of the weights in the weighted list.
            @property _sum
            @protected
            @type Number
            */
            me._sum = sum;

            /**
            A cached array containing a weight sum for each item in the
            weighted list up to the given index.
            @property _totals
            @protected
            @type [Number]
            */
            me._totals = totals;

            return me;
        }
    };

    Y.WeightedList = _Class;
}(Y));

}, 'gallery-2013.05.02-22-59', {"optional": ["gallery-alea"], "requires": ["array-extras", "gallery-array-iterate"]});
