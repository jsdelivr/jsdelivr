YUI.add('gallery-cssmatrix2d', function (Y, NAME) {

/**
@module gallery-cssmatrix2d
@author Steven Olmsted
*/
(function (Y) {
    'use strict';

    var _Math = Math,

        _degreesToRadians = _Math.PI / 180,

        _cos = _Math.cos,
        _isUndefined = Y.Lang.isUndefined,
        _sin = _Math.sin,
        _tan = _Math.tan,

        /**
        This represents the matrix used by 2d CSS transforms.  It helps perform
        all of the necessary matrix calculations.  This is sort of an
        implementation of the CSSMatrix object defined in this spec:
        http://www.w3.org/TR/css3-2d-transforms/#cssmatrix-interface
        The matrix defined in the spec is a 3x2 matrix.  I'm not exactly an
        expert at matrix math, but most of the operations required by the spec
        only work with square matrices.  The spec doesn't explain how a 3x2
        matrix is supposed to do these things.  In order to make the math work
        correctly, this object internally treats it as the 4x4 matrix defined in
        the 3d CSS transforms spec here:
        http://www.w3.org/TR/css3-3d-transforms/#cssmatrix-interface
        and it converts the 3x2 matrix into a 4x4 matrix by following the
        examples provided in this spec:
        http://www.w3.org/TR/2012/WD-css3-transforms-20120403/
        Other implementations of these specs, like the WebKitCSSMatrix object
        and others that have copied it, attempt to combine both the 2d and 3d
        versions of CSSMatrix into the same object.  This implementation only
        borrows ideas from the 3d version to make the math make sense, but only
        the 2d functionality is implemented.  Since only the 6 2d matrix items
        out of the total 16 3d matrix items are mutable, and the remaining 3d
        matrix items are known to be either 0 or 1, most of the complicated 4x4
        matrix math is factored down and reduced, becoming much more efficient.
        @class CSSMatrix2d
        @constructor
        */
        _Class = function () {};

    _Class.prototype = {
        /**
        The 1,1 position in the matrix.
        @property a
        @default 1
        @type Number
        */
        a: 1,
        /**
        The 2,1 position in the matrix.
        @property b
        @default 0
        @type Number
        */
        b: 0,
        /**
        The 1,2 position in the matrix.
        @property c
        @default 0
        @type Number
        */
        c: 0,
        /**
        The 2,2 position in the matrix.
        @property d
        @default 1
        @type Number
        */
        d: 1,
        /**
        The 1,4 position in the matrix.
        @property e
        @default 0
        @type Number
        */
        e: 0,
        /**
        The 2,4 position in the matrix.
        @property f
        @default 0
        @type Number
        */
        f: 0,
        /**
        Returns a new matrix, the inverse of this one.
        This matrix is not modified.
        This method will throw if the matrix can not be inverted.
        @method inverse
        @return {CSSMatrix2d} inverse
        */
        inverse: function () {
            var me = this,
                meA = me.a,
                meB = me.b,
                meC = me.c,
                meD = me.d,
                meE = me.e,
                meF = me.f,

                determinant = meA * meD - meB * meC,
                inverse = new _Class();

            if (!determinant) {
                throw new Error('Can not be inverted.');
            }

            inverse.a = meD / determinant;
            inverse.b = -meB / determinant;
            inverse.c = -meC / determinant;
            inverse.d = meA / determinant;
            inverse.e = (meC * meF - meD * meE) / determinant;
            inverse.f = (meB * meE - meA * meF) / determinant;

            return inverse;
        },
        /**
        Returns a new matrix, the product of this one multiplied by another one.
        Neither this matrix nor the other one is modified.
        @method multiply
        @param {CSSMatrix2d} other
        @return {CSSMatrix2d} product
        */
        multiply: function (other) {
            var me = this,
                meA = me.a,
                meB = me.b,
                meC = me.c,
                meD = me.d,
                otherA = other.a,
                otherB = other.b,
                otherC = other.c,
                otherD = other.d,
                otherE = other.e,
                otherF = other.f,
                product = new _Class();

            product.a = meA * otherA + meC * otherB;
            product.b = meB * otherA + meD * otherB;
            product.c = meA * otherC + meC * otherD;
            product.d = meB * otherC + meD * otherD;
            product.e = meA * otherE + meC * otherF + me.e;
            product.f = meB * otherE + meD * otherF + me.f;

            return product;
        },
        /**
        Returns a new matrix, rotated the given angle clockwise.
        This matrix is not modified.
        @method rotate
        @param {Number} angle The angle specified in degrees.
        @return {CSSMatrix2d} rotated
        */
        rotate: function (angle) {
            return this.rotateRad(angle * _degreesToRadians);
        },
        /**
        Returns a new matrix, rotated the given angle clockwise.
        This matrix is not modified.
        @method rotateRad
        @param {Number} angle The angle specified in radians.
        @return {CSSMatrix2d} rotated
        */
        rotateRad: function (angle) {
            var other = new _Class();

            other.a = _cos(angle);
            other.b = _sin(angle);
            other.c = -_sin(angle);
            other.d = _cos(angle);

            return this.multiply(other);
        },
        /**
        Returns a new matrix, scaled horizontally and vertically.
        This matrix is not modified.
        @method scale
        @param {Number} x The horizontal scale factor.
        @param {Number} y The vertical scale factor.  Optional.  If
        undefined, x will be used for both the horizontal and
        vertical scale factor.
        @return {CSSMatrix2d} scaled.
        */
        scale: function (x, y) {
            var other = new _Class();

            other.a = x;
            other.d = _isUndefined(y) ? x : y;

            return this.multiply(other);
        },
        /**
        Sets the matrix based on a matrix string provided by the DOM.  The
        string is expected to be like 'matrix(a, b, c, d, e, f)'.  This format
        isn't specifically checked for, so other similar strings might be
        accepted.  If 6 values can not be read from from the string, this method
        will do nothing.  Invalid values could result in NaN being assigned to
        matrix items.
        @method setMatrixValue
        @chainable
        @param {String} matrixValue
        */
        setMatrixValue: function (matrixValue) {
            var me = this;

            matrixValue = matrixValue.split(',');

            if (matrixValue.length < 6) {
                return me;
            }

            me.a = parseFloat(matrixValue[0].substr(matrixValue[0].lastIndexOf('(') + 1));
            me.b = parseFloat(matrixValue[1]);
            me.c = parseFloat(matrixValue[2]);
            me.d = parseFloat(matrixValue[3]);
            me.e = parseFloat(matrixValue[4]);
            me.f = parseFloat(matrixValue[5]);

            return me;
        },
        /**
        Returns a new matrix, skewed horizontally.
        This matrix is not modified.
        @method skewX
        @param {Number} angle The horizontal skew angle specified in
        degrees.
        @return {CSSMatrix2d} skewed.
        */
        skewX: function (angle) {
            return this.skewXRad(angle * _degreesToRadians);
        },
        /**
        Returns a new matrix, skewed horizontally.
        This matrix is not modified.
        @method skewXRad
        @param {Number} angle The horizontal skew angle specified in radians.
        @return {CSSMatrix2d} skewed.
        */
        skewXRad: function (angle) {
            var other = new _Class();

            other.c = _tan(angle);

            return this.multiply(other);
        },
        /**
        Returns a new matrix, skewed vertically.
        This matrix is not modified.
        @method skewY
        @param {Number} angle The vertical skew angle specified in degrees.
        @return {CSSMatrix2d} skewed.
        */
        skewY: function (angle) {
            return this.skewYRad(angle * _degreesToRadians);
        },
        /**
        Returns a new matrix, skewed vertically.
        This matrix is not modified.
        @method skewYRad
        @param {Number} angle The vertical skew angle specified in radians.
        @return {CSSMatrix2d} skewed.
        */
        skewYRad: function (angle) {
            var other = new _Class();

            other.b = _tan(angle);

            return this.multiply(other);
        },
        /**
        Returns a string 'matrix(a, b, c, d, e, f)' which can be used by the DOM
        for 2d CSS transforms.
        @method toString
        @return {String}
        */
        toString: function () {
            var me = this;

            return 'matrix(' + me.a + ', ' + me.b + ', ' + me.c + ', ' + me.d + ', ' + me.e + ', ' + me.f + ')';
        },
        /**
        Returns a new matrix, translated horizontally and vertically.
        This matrix is not modified.
        @method translate
        @param {Number} x The horizontal translation amount.
        @param {Number} y The vertical translation amount.
        @return {CSSMatrix2d} translated.
        */
        translate: function (x, y) {
            var other = new _Class();

            other.e = x;
            other.f = y;

            return this.multiply(other);
        }
    };

    Y.CSSMatrix2d = _Class;
}(Y));

}, 'gallery-2013.06.05-22-14', {"requires": ["yui"]});
