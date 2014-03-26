YUI.add('gallery-l-system', function(Y) {

/**
 * @module gallery-l-system
 */
(function (Y, moduleName) {
    'use strict';

    var _null = null,
        _string_iterations = 'iterations',
        _string_pattern = 'pattern',
        _string_rules = 'rules',
        _string_value = 'value',
        _true = true,
        
        _Array = Y.Array,
        _Base = Y.Base,
        _Lang = Y.Lang,
        _RegExp = RegExp,

        _isArray = _Lang.isArray,
        _isFunction = _Lang.isFunction,
        _isObject = _Lang.isObject,
        _keys = Y.Object.keys,
        _map = _Array.map,
        _some = _Array.some;

    /**
     * @class LSystem
     * @constructor
     * @extends Base
     * @param {Object} config Configuration Object.
     */
    Y.LSystem = _Base.create(moduleName, _Base, [], {
        initializer: function () {
            var me = this;

            me.on([
                'axiomChange',
                'rulesChange'
            ], me.restart, me);

            me.restart();
        },
        /**
         * Iterates the l-system's value.
         * @method iterate
         * @chainable
         * @param {Number} [iterations] Optional.  The number of iterations to
         * perform.  Defaults to 1.  The l-system can only iterate forward so
         * negative values aren't accepted.
         */
        iterate: function (iterations) {
            var i = iterations && iterations >= 1 ? iterations : 1,
                me = this,
                pattern = me.get(_string_pattern),
                rules = me.get(_string_rules),
                value = me.get(_string_value),

                replaceFunction = function (match, index, value) {
                    var replace = me._resolveMatch(rules[match], index, value, match);

                    if (replace === _null) {
                        return match;
                    }

                    return replace;
                };

            while (i > 0) {
                i -= 1;
                value = value.replace(pattern, replaceFunction);
            }

            return me._set(_string_iterations, me.get(_string_iterations) + iterations)._set(_string_value, value);
        },
        /**
         * This method restarts the l-system and resets its value.
         * @method restart
         * @chainable
         */
        restart: function () {
            var me = this;

            return me._set(_string_iterations, 0)._set(_string_pattern, new _RegExp(_map(_keys(me.get(_string_rules)), function (key) {
                if ('\\^$*+?.()|{}[]'.indexOf(key) !== -1) {
                    return '\\' + key;
                }

                return key;
            }).join('|'), 'g'))._set(_string_value, me.get('axiom'));
        },
        /**
         * @method _resolveMatch
         * @param {Array|Object|String|WeightedList} ruleValue
         * @param {Number} index
         * @param {String} value
         * @param {String} match
         * @protected
         * @return {String} Returns null if the rule doesn't apply.
         */
        _resolveMatch: function (ruleValue, index, value, match) {
            var WeightedList = Y.WeightedList,

                last,
                me = this,
                temp;

            if (_isArray(ruleValue)) {
                _some(ruleValue, function (ruleValue) {
                    temp = me._resolveMatch(ruleValue, index, value, match);

                    if (temp !== _null) {
                        return _true;
                    }
                });

                return temp;
            }

            if (_isObject(ruleValue)) {
                if (WeightedList && ruleValue instanceof WeightedList) {
                    return me._resolveMatch(ruleValue.value(), index, value, match);
                }

                temp = ruleValue.fn;

                if (_isFunction(temp)) {
                    return temp.call(ruleValue.ctx, match, index, value);
                }

                temp = ruleValue.first;

                if (temp && index || temp === false && !index) {
                    return _null;
                }

                last = value.length - 1;
                temp = ruleValue.last;

                if (temp && index !== last || temp === false && index ===  last) {
                    return _null;
                }

                temp = ruleValue.next;

                if (temp) {
                    if (WeightedList && temp instanceof WeightedList) {
                        temp = temp.value();
                    }

                    if (value.substr(index + 1, temp.length) !== temp) {
                        return _null;
                    }
                }

                temp = ruleValue.notNext;

                if (temp) {
                    if (WeightedList && temp instanceof WeightedList) {
                        temp = temp.value();
                    }

                    if (value.substr(index + 1, temp.length) === temp) {
                        return _null;
                    }
                }

                temp = ruleValue.notPrev;

                if (temp) {
                    if (!index) {
                        return _null;
                    }

                    if (WeightedList && temp instanceof WeightedList) {
                        temp = temp.value();
                    }

                    if (value.substr(index - temp.length, temp.length) === temp) {
                        return _null;
                    }
                }

                temp = ruleValue.prev;

                if (temp) {
                    if (!index) {
                        return _null;
                    }

                    if (WeightedList && temp instanceof WeightedList) {
                        temp = temp.value();
                    }

                    if (value.substr(index - temp.length, temp.length) !== temp) {
                        return _null;
                    }
                }

                return me._resolveMatch(ruleValue.value, index, value, match);
            }

            return ruleValue;
        }
    }, {
        ATTRS: {
            /**
             * The axiom is the initial value of the l-system.  Note: If the
             * axiom is changed after the l-system has been iterated, the
             * l-system will be restarted.
             * @attribute axiom
             * @default ''
             * @type String
             */
            axiom: {
                value: ''
            },
            /**
             * The number of iterations the l-system has been set to.  This
             * attribute is read only; use the iterate method to iterate the
             * l-system.
             * @attribute iterations
             * @default 0
             * @readonly
             * @type Number
             */
            iterations: {
                readOnly: _true,
                value: 0
            },
            /**
             * The regular expression that is used to help apply the rules
             * during iteration.
             * @attribute pattern
             * @protected
             * @readonly
             * @type RegExp
             */
            pattern: {
                readOnly: _true,
                value: _null
            },
            /**
             * The l-system's rules.  Note: If the rules are changed after the
             * l-system has been iterated, the l-system will be restarted.  If
             * you read this object and manipulate it directly, you must call
             * the restart method before iterating the l-system again otherwise
             * it will yield unknown results.
             *
             * The rules are key/value pairs.  The rules object's keys should be
             * single characters.  In the simplest case, the rules object's
             * values are strings.  For  example, with this rules object
             * {a: 'abc'}, every time the character 'a' is found in the
             * l-system's value, it will be replaced with the string 'abc'.
             *
             * The rules object's values may also be objects for more control
             * over when the rule is applied.  For example, with this rules
             * object {a: {prev: 'ccc', value: 'abc'}}, every time the character
             * 'a' is found in the l-system's value and the previous characters
             * in the l-system's value are 'ccc', the 'a' will be replaced with
             * the string 'abc'.  In the simplest case, the value property is a
             * string but it may be any value that can be one of the rule
             * object's values.  Here is a list of the properties that affect
             * when this rule is applied:
             * <dl>
             *     <dt>
             *         first
             *     </dt>
             *     <dd>
             *         If the first property is defined and is a truthy value,
             *         the rule will only be applied if the matched character is
             *         the first character in the l-system's value.  If the
             *         first property is set to false, the rule will only be
             *         applied if the matched character is not the first
             *         character in the l-system's value.
             *     </dd>
             *     <dt>
             *         last
             *     </dt>
             *     <dd>
             *         If the last property is defined and is a truthy value,
             *         the rule will only be applied if the matched character is
             *         the last character in the l-system's value.  If the last
             *         property is set to false, the rule will only be applied
             *         if the matched character is not the last character in the
             *         l-system's value.
             *     </dd>
             *     <dt>
             *         next
             *     </dt>
             *     <dd>
             *         If the next property is defined, it should be a string of
             *         one or more characters.  The rule will only be applied if
             *         the matched character is followed by this string of
             *         characters exactly.
             *
             *         The next property may also be a weighted list of strings
             *         of one or more characters.  In this case, the value will
             *         be selected from the weighted list at random.
             *     </dd>
             *     <dt>
             *         notNext
             *     </dt>
             *     <dd>
             *         If the notNext property is defined, it should be a string
             *         of one or more characters.  The rule will only be applied
             *         if the matched character is not followed by this string
             *         of characters exactly.
             *
             *         The notNext property may also be a weighted list of
             *         strings of one or more characters.  In this case, the
             *         value will be selected from the weighted list at random.
             *     </dd>
             *     <dt>
             *         notPrev
             *     </dt>
             *     <dd>
             *         If the notPrev property is defined, it should be a string
             *         of one or more characters.  The rule will only be applied
             *         if the matched character is not preceded by this string
             *         of characters exactly.
             *
             *         The notPrev property may also be a weighted list of
             *         strings of one or more characters.  In this case, the
             *         value will be selected from the weighted list at random.
             *     </dd>
             *     <dt>
             *         prev
             *     </dt>
             *     <dd>
             *         If the prev property is defined, it should be a string of
             *         one or more characters.  The rule will only be applied if
             *         the matched character is preceded by this string of
             *         characters exactly.
             *
             *         The prev property may also be a weighted list of strings
             *         of one or more characters.  In this case, the value will
             *         be selected from the weighted list at random.
             *     </dd>
             * </dl>
             *
             * For even further control, the rules object's values may be
             * objects with a fn property.  The fn property should be a function
             * that accepts three arguments:
             * <dl>
             *     <dt>
             *         match
             *     </dt>
             *     <dd>
             *         String.  The single character that was matched.
             *     </dd>
             *     <dt>
             *         index
             *     </dt>
             *     <dd>
             *         Number.  The index of the matched character within the
             *         l-system's value.
             *     </dd>
             *     <dt>
             *         value
             *     </dt>
             *     <dd>
             *         String.  The l-system's current value.
             *     </dd>
             * </dl>
             * The function should return a string or null.  The rule will only
             * be applied if the function does not return null.  The object may
             * also have a ctx property which will be used as the execution
             * context for the function.
             *
             * Multiple rules may be given for a single character by providing
             * an array as a rules object's value.  The array may contain any
             * value that is acceptable as a rules object's value.  The array
             * items will be processed in order; the first rule that applies
             * will be used.  Because of this, the array items should usually be
             * one of the ojects described above.  The array may contain string
             * items, but since string rules are always applied, there should
             * only ever be one string item in the array and it should be the
             * last item in the array.
             *
             * A rules object's value may also be a weighted list of any of the
             * other values described above.  In this case, the values will be
             * selected from the weighted list at random.
             * @attribute rules
             * @default {}
             * @type Object
             */
            rules: {
                value: {}
            },
            /**
             * The current value of the l-system.
             * @attribute value
             * @default ''
             * @readonly
             * @type String
             */
            value: {
                readOnly: _true,
                value: ''
            }
        }
    });
}(Y, arguments[1]));


}, 'gallery-2012.07.18-13-22' ,{requires:['array-extras', 'base'], skinnable:false, optional:['gallery-weighted-list']});
