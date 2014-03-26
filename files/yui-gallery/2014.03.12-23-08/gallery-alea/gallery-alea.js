YUI.add('gallery-alea', function (Y, NAME) {

/*!
based on Alea.js and Mash.js.
Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
Y.Alea is a better pseudorandom number generator than Math.random.

based on Alea.js and Mash.js.
Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>

<http://baagoe.org>

@module gallery-alea
@author Steven Olmsted
*/
(function (Y) {
    'use strict';
    /*jshint bitwise:false*/

    var _number_2_pow_32 = 4294967296, // 2^32
        _number_2_pow_negative_32 = 2.3283064365386963e-10, // 2^-32
        _string__space = ' ',

        _Array = Y.Array,

        _each = _Array.each,
        _isArray = Y.Lang.isArray,
        _now = Y.Lang.now,

        /**
        @class Alea
        @constructor
        @param {Number|String|[Number|String]} [seedValues=Y.Lang.now()]* Any
        number of seed values can be passed as individual arguments or an array
        of seed values can be passed as a single argument.  If left undefined,
        Y.Lang.now() is used as a seed.
        */
        _Class = function (args) {
            var c = 1,
                mash = _Class._mash(),
                s0 = mash(_string__space),
                s1 = mash(_string__space),
                s2 = mash(_string__space);

            args = _isArray(args) ? args : _Array(arguments);

            if (!args.length) {
                args.push(_now());
            }

            _each(args, function (arg) {
                s0 -= mash(arg);

                if (s0 < 0) {
                    s0 += 1;
                }

                s1 -= mash(arg);

                if (s1 < 0) {
                    s1 += 1;
                }

                s2 -= mash(arg);

                if (s2 < 0) {
                    s2 += 1;
                }
            });

            /**
            Generates a random number that is greater than or equal to zero and
            less than one.  The number will be a 32-bit fraction.
            @method random
            @return {Number}
            */
            this.random = function () {
                var t = 2091639 * s0 + c * _number_2_pow_negative_32;

                c = t | 0;
                s0 = s1;
                s1 = s2;
                s2 = t - c;

                return s2;
            };
        };

    _Class.prototype = {
        /**
        Generates a random number that is greater than or equal to zero and less
        than one.  The number will be a 53-bit fraction.
        @method fract53
        @return {Number}
        */
        fract53: function () {
            var random = this.random;
            return random() + (random() * 2097152 | 0) * 1.1102230246251565e-16; // 2^-53
        },
        /**
        Generates a random 32-bit unsigned integer.
        @method uint32
        @return {Number}
        */
        uint32: function () {
            return this.random() * _number_2_pow_32;
        }
    };

    /**
    This method returns a string hashing function which is initialized with an
    internal state.
    @method _mash
    @protected
    @return {Function} A string hashing function which accepts a single argument
    and returns a number.
    @static
    */
    _Class._mash = function () {
        var n = 4022871197;

        return function (data) {
            data = data.toString();

            var h,
                i = 0,
                length = data.length;

            for (; i < length; i += 1) {
                n += data.charCodeAt(i);
                h = 0.02519603282416938 * n;
                n = h >>> 0;
                h -= n;
                h *= n;
                n = h >>> 0;
                h -= n;
                n += h * _number_2_pow_32;
            }

            return (n >>> 0) * _number_2_pow_negative_32;
        };
    };

    Y.Alea = _Class;
}(Y));

}, 'gallery-2013.05.02-22-59');
