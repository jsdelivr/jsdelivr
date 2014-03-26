YUI.add('gallery-apa', function (Y, NAME) {

/**
This is an arbitrary precision arithmetic module.  It uses plain String values
to represent numbers.  This module is brand new and incomplete.  While there are
a large number of unit tests, I would recommend performing more testing before
trusting this module with your important calculations.  Please report any
arithmetic inaccuracies in an issue on GitHub:
https://github.com/solmsted/yui3-gallery-2/issues
@module gallery-apa
@author Steven Olmsted
*/
(function (Y) {
    'use strict';

    var _Array = Array,
        _Math = Math,

        _abs = _Math.abs,
        _floor = _Math.floor,
        _min = _Math.min,

        /**
        @class Apa
        @constructor
        @param {Object} [config]
            @param {String} [config.alphabet='0123456789']
            @param {String} [config.minusSign='-']
            @param {String} [config.radixPoint='.']
        */
        _Class = function () {
            this._init.apply(this, arguments);
        };

    _Class.prototype = {
        /**
        @method absoluteValue
        @param {String} value
        @return {String}
        */
        absoluteValue: function (value) {
            return this._absoluteValue(this.normalize(value));
        },
        /**
        @method add
        @param {String} a
        @param {String} b
        @return {String}
        */
        add: function (a, b) {
            return this._add(this.normalize(a), this.normalize(b));
        },
        /**
        @method isEqualTo
        @param {String} a
        @param {String} b
        @return {Boolean}
        */
        isEqualTo: function (a, b) {
            return this.normalize(a) === this.normalize(b);
        },
        /**
        @method isGreaterThan
        @param {String} a
        @param {String} b
        @return {Boolean}
        */
        isGreaterThan: function (a, b) {
            return this._isGreaterThan(this.normalize(a), this.normalize(b));
        },
        /**
        @method isGreaterThanOrEqualTo
        @param {String} a
        @param {String} b
        @return {Boolean}
        */
        isGreaterThanOrEqualTo: function (a, b) {
            return this._isGreaterThanOrEqualTo(this.normalize(a), this.normalize(b));
        },
        /**
        @method isLessThan
        @param {String} a
        @param {String} b
        @return {Boolean}
        */
        isLessThan: function (a, b) {
            return this._isLessThan(this.normalize(a), this.normalize(b));
        },
        /**
        @method isLessThanOrEqualTo
        @param {String} a
        @param {String} b
        @return {Boolean}
        */
        isLessThanOrEqualTo: function (a, b) {
            return this._isLessThanOrEqualTo(this.normalize(a), this.normalize(b));
        },
        /**
        @method isNegative
        @param {String} value
        @return {Boolean}
        */
        isNegative: function (value) {
            return this._isNegative(this.normalize(value));
        },
        /**
        @method isPositive
        @param {String} value
        @return {Boolean}
        */
        isPositive: function (value) {
            return this._isPositive(this.normalize(value));
        },
        /**
        @method multiply
        @param {String} a
        @param {String} b
        @return {String}
        */
        multiply: function (a, b) {
            return this._multiply(this.normalize(a), this.normalize(b));
        },
        /**
        @method normalize
        @param {String} value
        @return {String}
        */
        normalize: function (value) {
            var me = this,

                i,
                length,
                minusSign = me._minusSign,
                part,
                radixPoint = me._radixPoint,
                radixPointIndex,
                result = '',
                zero = me._alphabet.charAt(0);

            if (value.charAt(0) === minusSign) {
                result += minusSign;
                value = value.substr(1);
            }

            radixPointIndex = value.indexOf(radixPoint);

            if (radixPointIndex < 0) {
                radixPointIndex = value.length;
            }

            part = value.substr(0, radixPointIndex);

            if (part) {
                for (i = 0, length = part.length; i < length; i += 1) {
                    if (part.charAt(i) !== zero) {
                        break;
                    }
                }

                result += i ? (i < length ? part.substr(i) : zero) : part;
            } else {
                result += zero;
            }

            part = value.substr(radixPointIndex + 1);

            if (part) {
                for (i = part.length - 1; i >= 0; i -= 1) {
                    if (part.charAt(i) !== zero) {
                        break;
                    }
                }

                part = part.substr(0, i + 1);

                if (part) {
                    result += radixPoint + part;
                } else if (result === minusSign + zero) {
                    return zero;
                }
            } else if (result === minusSign + zero) {
                return zero;
            }

            return result;
        },
        /**
        @method subtract
        @param {String} a
        @param {String} b
        @return {String}
        */
        subtract: function (a, b) {
            return this._subtract(this.normalize(a), this.normalize(b));
        },
        /**
        @method _absoluteValue
        @param {String} value
        @protected
        @return {String}
        */
        _absoluteValue: function (value) {
            return this._isNegative(value) ? value.substr(1) : value;
        },
        /**
        @method _add
        @param {String} a
        @param {String} b
        @protected
        @return {String}
        */
        _add: function (a, b) {
            var me = this,

                aIsNegative = me._isNegative(a),
                aRadixPointIndex,
                bIsNegative = me._isNegative(b),
                bRadixPointIndex,
                fractionalSum,
                integerSum,
                length,
                minusSign = me._minusSign,
                radixPoint = me._radixPoint,
                zero = me._alphabet.charAt(0);

            if (aIsNegative) {
                a = a.substr(1);

                if (bIsNegative) {
                    return minusSign + me._add(a, b.substr(1));
                }

                return me._subtract(b, a);
            }

            if (bIsNegative) {
                return me._subtract(a, b.substr(1));
            }

            aRadixPointIndex = a.indexOf(radixPoint);

            if (aRadixPointIndex < 0) {
                aRadixPointIndex = a.length;
            }

            bRadixPointIndex = b.indexOf(radixPoint);

            if (bRadixPointIndex < 0) {
                bRadixPointIndex = b.length;
            }

            integerSum = me._addWholeNumbers(a.substr(0, aRadixPointIndex), b.substr(0, bRadixPointIndex));

            a = a.substr(aRadixPointIndex + 1) || zero;
            b = b.substr(bRadixPointIndex + 1) || zero;

            length = a.length - b.length;

            if (length < 0) {
                a += _Array(-length + 1).join(zero);
            } else if (length > 0) {
                b += _Array(length + 1).join(zero);
            }

            fractionalSum = me._addWholeNumbers(a, b);

            if (fractionalSum.length - a.length) {
                integerSum = me._addWholeNumbers(integerSum, fractionalSum.charAt(0));
                fractionalSum = fractionalSum.substr(1);
            }

            return me.normalize(integerSum + radixPoint + fractionalSum);
        },
        /**
        @method _addWholeNumbers
        @param {String} a
        @param {String} b
        @protected
        @return {String}
        */
        _addWholeNumbers: function (a, b) {
            var me = this,

                additionTable = me._additionTable,
                alphabet = me._alphabet,
                carry = '',
                digitSum,
                i,
                length = a.length - b.length,
                result = '',
                zero = alphabet.charAt(0);

            if (length < 0) {
                a = _Array(-length + 1).join(zero) + a;
            } else if (length > 0) {
                b = _Array(length + 1).join(zero) + b;
            }

            for (i = a.length - 1; i >= 0; i -= 1) {
                digitSum = additionTable[a.charAt(i) + b.charAt(i)];

                if (carry) {
                    digitSum = me._addWholeNumbers(carry, digitSum);
                    carry = '';
                }

                if (digitSum.length > 1) {
                    carry = digitSum.charAt(0);
                    result = digitSum.charAt(1) + result;
                } else {
                    result = digitSum.charAt(0) + result;
                }
            }

            return carry + result;
        },
        /**
        @method _init
        @param {Object} config
        @protected
        */
        _init: function (config) {
            config = config || {};

            var a,
                ab,
                additionTable = {},
                aIndex,
                alphabet = config.alphabet || '0123456789',
                alphabetLength = alphabet.length,
                b,
                bIndex,
                greaterThanTable = {},
                i,
                index,
                lessThanTable = {},
                me = this,
                minusSign = config.minusSign || '-',
                multiplicationTable = {},
                product,
                subtractionTable = {},
                zero = alphabet.charAt(0);

            /**
            @property _additionTable
            @protected
            @type Object
            */
            me._additionTable = additionTable;

            /**
            @property _alphabet
            @protected
            @type String
            */
            me._alphabet = alphabet;

            /**
            @property _greaterThanTable
            @protected
            @type Object
            */
            me._greaterThanTable = greaterThanTable;

            /**
            @property _lessThanTable
            @protected
            @type Object
            */
            me._lessThanTable = lessThanTable;

            /**
            @property _minusSign
            @protected
            @type String
            */
            me._minusSign = minusSign;

            /**
            @property _multiplicationTable
            @protected
            @type Object
            */
            me._multiplicationTable = multiplicationTable;

            /**
            @property _radixPoint
            @protected
            @type String
            */
            me._radixPoint = config.radixPoint || '.';

            /**
            @property _subtractionTable
            @protected
            @type Object
            */
            me._subtractionTable = subtractionTable;

            for (aIndex = 0; aIndex < alphabetLength; aIndex += 1) {
                a = alphabet.charAt(aIndex);

                for (bIndex = 0; bIndex < alphabetLength; bIndex += 1) {
                    b = alphabet.charAt(bIndex);
                    ab = a + b;

                    index = aIndex + bIndex;
                    additionTable[ab] = (index >= alphabetLength ? alphabet.charAt(_floor(index / alphabetLength)) : '') + alphabet.charAt(index % alphabetLength);

                    greaterThanTable[ab] = aIndex > bIndex;

                    lessThanTable[ab] = aIndex < bIndex;

                    index = aIndex - bIndex;
                    subtractionTable[ab] = (index < 0 ? minusSign : '') + alphabet.charAt((alphabetLength + index) % alphabetLength);
                }
            }

            for (aIndex = 0; aIndex < alphabetLength; aIndex += 1) {
                a = alphabet.charAt(aIndex);

                for (bIndex = 0; bIndex < alphabetLength; bIndex += 1) {
                    b = alphabet.charAt(bIndex);

                    for (i = 0, product = zero; i < b; i += 1) {
                        product = me._addWholeNumbers(product, a);
                    }
                    multiplicationTable[a + b] = product;
                }
            }
        },
        /**
        @method _isGreaterThan
        @param {String} a
        @param {String} b
        @protected
        @return {Boolean}
        */
        _isGreaterThan: function (a, b) {
            var me = this,

                aCharacter,
                aIsNegative = me._isNegative(a),
                aPart,
                aRadixPointIndex,
                bCharacter,
                bIsNegative = me._isNegative(b),
                bPart,
                bRadixPointIndex,
                greaterThanTable = me._greaterThanTable,
                i,
                invert = false,
                length,
                radixPoint = me._radixPoint,
                zero = me._alphabet.charAt(0);

            if (aIsNegative) {
                if (bIsNegative) {
                    a = a.substr(1);
                    b = b.substr(1);

                    invert = true;
                } else {
                    return false;
                }
            } else if (bIsNegative) {
                return true;
            }

            aRadixPointIndex = a.indexOf(radixPoint);

            if (aRadixPointIndex < 0) {
                aRadixPointIndex = a.length;
            }

            bRadixPointIndex = b.indexOf(radixPoint);

            if (bRadixPointIndex < 0) {
                bRadixPointIndex = b.length;
            }

            aPart = a.substr(0, aRadixPointIndex);
            bPart = b.substr(0, bRadixPointIndex);

            length = aPart.length - bPart.length;

            if (length > 0) {
                return !invert;
            }

            if (length < 0) {
                return invert;
            }

            for (i = 0, length = aPart.length; i < length; i += 1) {
                aCharacter = aPart.charAt(i);
                bCharacter = bPart.charAt(i);

                if (aCharacter !== bCharacter) {
                    return greaterThanTable[aCharacter + bCharacter] ? !invert : invert;
                }
            }

            aPart = a.substr(aRadixPointIndex + 1) || zero;
            bPart = b.substr(bRadixPointIndex + 1) || zero;

            for (i = 0, length = _min(aPart.length, bPart.length); i < length; i += 1) {
                aCharacter = aPart.charAt(i);
                bCharacter = bPart.charAt(i);

                if (aCharacter !== bCharacter) {
                    return greaterThanTable[aCharacter + bCharacter] ? !invert : invert;
                }
            }

            length = aPart.length - bPart.length;

            if (length > 0) {
                return !invert;
            }

            if (length < 0) {
                return invert;
            }

            return false;
        },
        /**
        @method _isGreaterThanOrEqualTo
        @param {String} a
        @param {String} b
        @protected
        @return {Boolean}
        */
        _isGreaterThanOrEqualTo: function (a, b) {
            return a === b || this._isGreaterThan(a, b);
        },
        /**
        @method _isLessThan
        @param {String} a
        @param {String} b
        @protected
        @return {Boolean}
        */
        _isLessThan: function (a, b) {
            var me = this,

                aCharacter,
                aIsNegative = me._isNegative(a),
                aPart,
                aRadixPointIndex,
                bCharacter,
                bIsNegative = me._isNegative(b),
                bPart,
                bRadixPointIndex,
                i,
                invert = false,
                length,
                lessThanTable = me._lessThanTable,
                radixPoint = me._radixPoint,
                zero = me._alphabet.charAt(0);

            if (aIsNegative) {
                if (bIsNegative) {
                    a = a.substr(1);
                    b = b.substr(1);

                    invert = true;
                } else {
                    return true;
                }
            } else if (bIsNegative) {
                return false;
            }

            aRadixPointIndex = a.indexOf(radixPoint);

            if (aRadixPointIndex < 0) {
                aRadixPointIndex = a.length;
            }

            bRadixPointIndex = b.indexOf(radixPoint);

            if (bRadixPointIndex < 0) {
                bRadixPointIndex = b.length;
            }

            aPart = a.substr(0, aRadixPointIndex);
            bPart = b.substr(0, bRadixPointIndex);

            length = aPart.length - bPart.length;

            if (length > 0) {
                return invert;
            }

            if (length < 0) {
                return !invert;
            }

            for (i = 0, length = aPart.length; i < length; i += 1) {
                aCharacter = aPart.charAt(i);
                bCharacter = bPart.charAt(i);

                if (aCharacter !== bCharacter) {
                    return lessThanTable[aCharacter + bCharacter] ? !invert : invert;
                }
            }

            aPart = a.substr(aRadixPointIndex + 1) || zero;
            bPart = b.substr(bRadixPointIndex + 1) || zero;

            for (i = 0, length = _min(aPart.length, bPart.length); i < length; i += 1) {
                aCharacter = aPart.charAt(i);
                bCharacter = bPart.charAt(i);

                if (aCharacter !== bCharacter) {
                    return lessThanTable[aCharacter + bCharacter] ? !invert : invert;
                }
            }

            length = aPart.length - bPart.length;

            if (length > 0) {
                return invert;
            }

            if (length < 0) {
                return !invert;
            }

            return false;
        },
        /**
        @method _isLessThanOrEqualTo
        @param {String} a
        @param {String} b
        @protected
        @return {Boolean}
        */
        _isLessThanOrEqualTo: function (a, b) {
            return a === b || this._isLessThan(a, b);
        },
        /**
        @method _isNegative
        @param {String} value
        @protected
        @return {Boolean}
        */
        _isNegative: function (value) {
            return value.charAt(0) === this._minusSign;
        },
        /**
        @method _isPositive
        @param {String} value
        @protected
        @return {Boolean}
        */
        _isPositive: function (value) {
            return value !== this._alphabet.charAt(0) && value.charAt(0) !== this._minusSign;
        },
        /**
        @method _multiply
        @param {String} a
        @param {String} b
        @protected
        @return {String}
        */
        _multiply: function (a, b) {
            var me = this,

                aIsNegative = me._isNegative(a),
                bIsNegative = me._isNegative(b),
                minusSign = me._minusSign,
                product,
                productFractionalLength = 0,
                radixPoint = me._radixPoint,
                radixPointIndex,
                zero = me._alphabet.charAt(0);

            if (a === zero || b === zero) {
                return zero;
            }

            if (aIsNegative) {
                a = a.substr(1);

                if (bIsNegative) {
                    b = b.substr(1);
                } else {
                    return minusSign + me._multiply(a, b);
                }
            } else if (bIsNegative) {
                return minusSign + me._multiply(a, b.substr(1));
            }

            radixPointIndex = a.indexOf(radixPoint);

            if (radixPointIndex > -1) {
                a = a.substr(0, radixPointIndex) + a.substr(radixPointIndex + 1);
                productFractionalLength += a.length - radixPointIndex;
                a = me.normalize(a);
            }

            radixPointIndex = b.indexOf(radixPoint);

            if (radixPointIndex > -1) {
                b = b.substr(0, radixPointIndex) + b.substr(radixPointIndex + 1);
                productFractionalLength += b.length - radixPointIndex;
                b = me.normalize(b);
            }

            product = me._multiplyWholeNumbers(a, b);

            if (productFractionalLength) {
                radixPointIndex = product.length - productFractionalLength;
                product = radixPointIndex < 0 ? radixPoint + _Array(_abs(radixPointIndex) + 1).join(zero) + product : product.substr(0, radixPointIndex) + radixPoint + product.substr(radixPointIndex);
            }

            return me.normalize(product);
        },
        /**
        @method _multiplyWholeNumbers
        @param {String} a
        @param {String} b
        @protected
        @return {String}
        */
        _multiplyWholeNumbers: function (a, b) {
            var me = this,

                aIndex,
                aLength = a.length,
                bIndex,
                carry,
                digitProduct,
                multiplicationTable = me._multiplicationTable,
                product,
                result,
                zero = me._alphabet.charAt(0),
                zeros = 0;

            for (bIndex = b.length - 1; bIndex >= 0; bIndex -= 1, zeros += 1) {
                for (aIndex = aLength - 1, carry = '', product = _Array(zeros + 1).join(zero); aIndex >= 0; aIndex -= 1) {
                    digitProduct = multiplicationTable[a.charAt(aIndex) + b.charAt(bIndex)];

                    if (carry) {
                        digitProduct = me._addWholeNumbers(digitProduct, carry);
                        carry = '';
                    }

                    if (digitProduct.length === 2) {
                        carry = digitProduct.charAt(0);
                        product = digitProduct.charAt(1) + product;
                    } else {
                        product = digitProduct + product;
                    }
                }

                product = carry + product;
                result = result ? me._addWholeNumbers(result, product) : product;
            }

            return result;
        },
        /**
        @method _subtract
        @param {String} a
        @param {String} b
        @protected
        @return {String}
        */
        _subtract: function (a, b) {
            var me = this,

                aIsNegative = me._isNegative(a),
                alphabet = me._alphabet,
                aPart,
                aRadixPointIndex,
                bIsNegative = me._isNegative(b),
                bPart,
                bRadixPointIndex,
                fractionalDifference,
                integerDifference,
                integerDifferenceSign,
                length,
                minusSign = me._minusSign,
                one = alphabet.charAt(1),
                radixPoint = me._radixPoint,
                resultSign = '',
                zero = alphabet.charAt(0);

            if (a === zero) {
                return bIsNegative ? b.substr(1) : (b === zero ? zero : me._minusSign + b);
            }

            if (aIsNegative) {
                a = a.substr(1);

                if (bIsNegative) {
                    return me._subtract(b.substr(1), a);
                }

                return me._minusSign + me._add(a, b);
            }

            if (bIsNegative) {
                return me._add(a, b.substr(1));
            }

            aRadixPointIndex = a.indexOf(radixPoint);

            if (aRadixPointIndex < 0) {
                aRadixPointIndex = a.length;
            }

            bRadixPointIndex = b.indexOf(radixPoint);

            if (bRadixPointIndex < 0) {
                bRadixPointIndex = b.length;
            }

            aPart = a.substr(0, aRadixPointIndex);
            bPart = b.substr(0, bRadixPointIndex);

            if (aPart === bPart) {
                integerDifference = zero;
            } else if (me._isLessThan(aPart, bPart)) {
                integerDifference = me._subtractWholeNumbers(bPart, aPart);
                integerDifferenceSign = -1;
                resultSign = minusSign;
            } else {
                integerDifference = me._subtractWholeNumbers(aPart, bPart);
                integerDifferenceSign = 1;
            }

            aPart = a.substr(aRadixPointIndex + 1) || zero;
            bPart = b.substr(bRadixPointIndex + 1) || zero;

            length = aPart.length - bPart.length;

            if (length < 0) {
                aPart += _Array(-length + 1).join(zero);
            } else if (length > 0) {
                bPart += _Array(length + 1).join(zero);
            }

            if (aPart === bPart) {
                fractionalDifference = zero;
            } else if (me._isLessThan(aPart, bPart)) {
                if (integerDifferenceSign === 1) {
                    fractionalDifference = me._subtractWholeNumbers(one + aPart, bPart).substr(1);
                    integerDifference = me._subtractWholeNumbers(integerDifference, one);
                } else {
                    fractionalDifference = me._subtractWholeNumbers(bPart, aPart);
                    resultSign = minusSign;
                }
            } else {
                if (integerDifferenceSign === -1) {
                    fractionalDifference = me._subtractWholeNumbers(one + bPart, aPart).substr(1);
                    integerDifference = me._subtractWholeNumbers(integerDifference, one);
                } else {
                    fractionalDifference = me._subtractWholeNumbers(aPart, bPart);
                }
            }

            return me.normalize(resultSign + integerDifference + radixPoint + fractionalDifference);
        },
        /**
        @method _subtractWholeNumbers
        @param {String} a
        @param {String} b
        @protected
        @returns {String}
        */
        _subtractWholeNumbers: function (a, b) {
            var me = this,

                aCharacter,
                bCharacter,
                alphabet = me._alphabet,
                borrowed,
                digitDifference,
                i,
                length = a.length - b.length,
                result = '',
                subtractionTable = me._subtractionTable,
                one = alphabet.charAt(1),
                zero = alphabet.charAt(0);

            if (length > 0) {
                b = _Array(length + 1).join(zero) + b;
            }

            for (i = a.length - 1; i >= 0; i -= 1) {
                aCharacter = a.charAt(i);
                bCharacter = b.charAt(i);

                if (borrowed) {
                    aCharacter = subtractionTable[aCharacter + one];

                    if (aCharacter.length > 1) {
                        aCharacter = aCharacter.substr(1);
                    } else {
                        borrowed = false;
                    }
                }

                digitDifference = subtractionTable[aCharacter + bCharacter];

                if (i > 0 && digitDifference.length > 1) {
                    borrowed = true;
                    digitDifference = digitDifference.substr(1);
                }

                result = digitDifference + result;
            }

            return result;
        }
    };

    Y.Apa = _Class;
}(Y));

}, 'gallery-2013.05.29-23-38');
