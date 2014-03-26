YUI.add('gallery-any-base-converter', function (Y, NAME) {

/**
@module gallery-any-base-converter
@author Steven Olmsted
*/
(function (Y, moduleName) {
    'use strict';

    var _string__empty = '',
        _string__fullStop = '.',
        _string_alphabet = 'alphabet',
        _string_lookup = 'lookup',
        _string_minusSign = 'minusSign',
        _string_radixPoint = 'radixPoint',

        _Base = Y.Base,

        _each = Y.each,
        _floor = Math.floor,
        _pow = Math.pow,

        /**
        AnyBaseConverter is an object that will convert numbers to and from a
        positional notation with a custom alphabet and base.
        @class AnyBaseConverter
        @constructor
        @extends Base
        @param {Object} config Configuration Object.
        */
        _Class = _Base.create(moduleName, _Base, [], {
            /**
            Converts a string from a custom base and returns a number.
            @method from
            @param {String} any
            @return {Number} value
            */
            from: function (any) {
                var me = this,

                    anySplit = any.split(me.get(_string_radixPoint)),
                    base = me.get(_string_alphabet).length,
                    fractionalPart = anySplit[1],
                    integerPart = anySplit[0].split(_string__empty),
                    lookup = me.get(_string_lookup),
                    negative = false,
                    value = 0;

                if (integerPart[0] === me.get(_string_minusSign)) {
                    negative = true;
                    integerPart.shift();
                }

                _each(integerPart.reverse(), function (character, index) {
                    value += _pow(base, index) * lookup[character];
                });

                if (fractionalPart) {
                    value = parseFloat(_string__empty + value + _string__fullStop + _Class._reverse(_string__empty + me.from(fractionalPart)));
                }

                if (negative) {
                    value = -value;
                }

                return value;
            },
            /**
            Converts a number to a custom base and returns a string.
            @method to
            @param {Number} value
            @return {String} any
            */
            to: function (value) {
                var me = this,

                    alphabet = me.get(_string_alphabet),
                    base = alphabet.length,
                    fractionalPart,
                    integerPart,
                    any = _string__empty,
                    negative = false;

                value = +value;

                if (value < 0) {
                    negative = true;
                    value = -value;
                }

                integerPart = _floor(value);
                fractionalPart = String(value).split(_string__fullStop)[1];

                do {
                    any = alphabet.charAt(integerPart % base) + any;
                    integerPart = _floor(integerPart / base);
                } while (integerPart);

                if (fractionalPart) {
                    any += me.get(_string_radixPoint) + me.to(_Class._reverse(fractionalPart));
                }

                if (negative) {
                    any = me.get(_string_minusSign) + any;
                }

                return any;
            }
        }, {
            ATTRS: {
                /**
                The string of characters to use as single-digit numbers. The
                length of this string determines the base of the result. Each
                character should be unique within the string or else it will be
                impossible to correctly convert a string back into a number.
                Currently, non-BMP characters are not supported.
                @attribute alphabet
                @default '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~'
                @type String
                */
                alphabet: {
                    setter: function (value) {
                        var lookup = {},
                            i = 0,
                            length = value.length;

                        for (; i < length; i += 1) {
                            lookup[value.charAt(i)] = i;
                        }

                        this._set(_string_lookup, lookup);
                    },
                    value: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~'
                },
                /**
                Used as a reverse lookup for a character index in alphabet.
                @attribute lookup
                @protected
                @readOnly
                @type Object
                */
                lookup: {
                    readOnly: true,
                    value: null
                },
                /**
                A single character string to prepend to negative values. This
                character should not be in the alphabet.
                Currently, non-BMP characters are not supported.
                @attribute minusSign
                @default '-'
                @type String
                */
                minusSign: {
                    value: '-'
                },
                /**
                A single character string to insert between the integer and
                fractional parts of the number.  This character should not be in
                the alphabet.  Currently, non-BMP characters are not supported.
                @attribute radixPoint
                @default '.'
                @type String
                */
                radixPoint: {
                    value: _string__fullStop
                }
            },
            /**
            Reverse a string.
            @method _reverse
            @param {String} string
            @protected
            @return {String} reversedString
            @static
            */
            _reverse: function (string) {
                return string.split(_string__empty).reverse().join(_string__empty);
            }
        });

    Y.AnyBaseConverter = _Class;
}(Y, NAME));

}, 'gallery-2013.05.02-22-59', {"requires": ["base"]});
