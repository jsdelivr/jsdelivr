YUI.add('gallery-node-transform2d', function(Y) {

/**
 * @module gallery-node-transform2d
 */
(function (Y) {
    'use strict';
    
    var _CSSMatrix2d = Y.CSSMatrix2d,
        _Node = Y.Node,
        
        _merge = Y.merge;
    
    Y.mix(_Node.prototype, {
        /**
         * Helper method to get the node's current 2d transfom matrix.
         * @method getMatrix
         * @for Node
         * @return {CSSMatrix2d}
         */
        getMatrix: function () {
            return new _CSSMatrix2d().setMatrixValue(this.getStyle('transform'));
        },
        /**
         * Transforms the node by the inverse of the nodes current 2d transform
         * matrix.
         * @method inverseTransform
         * @chainable
         * @param {Object} transitionConfig Optional.  If defined, and if the
         * transition module is available, a transition will be used to
         * transform the node.  This object is passed along to the transition
         * method.
         * @param {Function} callbackFunction Optional.  Whether or not
         * transition is used, the callback function, if defined, will get
         * called when the transform is complete.
         */
        inverseTransform: function (transitionConfig, callbackFunction) {
            var me = this;
                
            try {
                return me.transform(me.getMatrix().inverse(), transitionConfig, callbackFunction);
            } catch (exception) {
                if (callbackFunction) {
                    callbackFunction();
                }
                
                return me;
            }
        },
        /**
         * Transforms the node by multiplying the nodes current 2d transform
         * matrix with another matrix.
         * @method multiplyMatrix
         * @chainable
         * @param {CSSMatrix2d} matrix The matrix to multiply.
         * @param {Object} transitionConfig Optional.  If defined, and if the
         * transition module is available, a transition will be used to
         * transform the node.  This object is passed along to the transition
         * method.
         * @param {Function} callbackFunction Optional.  Whether or not
         * transition is used, the callback function, if defined, will get
         * called when the transform is complete.
         */
        multiplyMatrix: function (matrix, transitionConfig, callbackFunction) {
            return this.transform(this.getMatrix().multiply(matrix), transitionConfig, callbackFunction);
        },
        /**
         * Rotates the node clockwise.
         * @method rotate
         * @chainable
         * @param {Number} angle The angle specified in degrees.
         * @param {Object} transitionConfig Optional.  If defined, and if the
         * transition module is available, a transition will be used to
         * transform the node.  This object is passed along to the transition
         * method.
         * @param {Function} callbackFunction Optional.  Whether or not
         * transition is used, the callback function, if defined, will get
         * called when the transform is complete.
         */
        rotate: function (angle, transitionConfig, callbackFunction) {
            return this.transform(this.getMatrix().rotate(angle), transitionConfig, callbackFunction);
        },
        /**
         * Rotates the node clockwise.
         * @method rotateRad
         * @chainable
         * @param {Number} angle The angle specified in radians.
         * @param {Object} transitionConfig Optional.  If defined, and if the
         * transition module is available, a transition will be used to
         * transform the node.  This object is passed along to the transition
         * method.
         * @param {Function} callbackFunction Optional.  Whether or not
         * transition is used, the callback function, if defined, will get
         * called when the transform is complete.
         */
        rotateRad: function (angle, transitionConfig, callbackFunction) {
            return this.transform(this.getMatrix().rotateRad(angle), transitionConfig, callbackFunction);
        },
        /**
         * Scales the node horizontally and vertically.
         * @method scale
         * @chainable
         * @param {Number} scaleFactor The horizontal and vertical scale factor.
         * @param {Object} transitionConfig Optional.  If defined, and if the
         * transition module is available, a transition will be used to
         * transform the node.  This object is passed along to the transition
         * method.
         * @param {Function} callbackFunction Optional.  Whether or not
         * transition is used, the callback function, if defined, will get
         * called when the transform is complete.
         */
        scale: function (scaleFactor, transitionConfig, callbackFunction) {
            return this.transform(this.getMatrix().scale(scaleFactor), transitionConfig, callbackFunction);
        },
        /**
         * Scales the node horizontally and vertically.
         * @method scaleXY
         * @chainable
         * @param {Number} scaleFactorX The horizontal scale factor.
         * @param {Number} scaleFactorY The vertical scale factor.
         * @param {Object} transitionConfig Optional.  If defined, and if the
         * transition module is available, a transition will be used to
         * transform the node.  This object is passed along to the transition
         * method.
         * @param {Function} callbackFunction Optional.  Whether or not
         * transition is used, the callback function, if defined, will get
         * called when the transform is complete.
         */
        scaleXY: function (scaleFactorX, scaleFactorY, transitionConfig, callbackFunction) {
            return this.transform(this.getMatrix().scale(scaleFactorX, scaleFactorY), transitionConfig, callbackFunction);
        },
        /**
         * Skews the node horizontally.
         * @method skewX
         * @chainable
         * @param {Number} angle The horizontal skew angle specified in degrees.
         * @param {Object} transitionConfig Optional.  If defined, and if the
         * transition module is available, a transition will be used to
         * transform the node.  This object is passed along to the transition
         * method.
         * @param {Function} callbackFunction Optional.  Whether or not
         * transition is used, the callback function, if defined, will get
         * called when the transform is complete.
         */
        skewX: function (angle, transitionConfig, callbackFunction) {
            return this.transform(this.getMatrix().skewX(angle), transitionConfig, callbackFunction);
        },
        /**
         * Skews the node horizontally.
         * @method skewXRad
         * @chainable
         * @param {Number} angle The horizontal skew angle specified in radians.
         * @param {Object} transitionConfig Optional.  If defined, and if the
         * transition module is available, a transition will be used to
         * transform the node.  This object is passed along to the transition
         * method.
         * @param {Function} callbackFunction Optional.  Whether or not
         * transition is used, the callback function, if defined, will get
         * called when the transform is complete.
         */
        skewXRad: function (angle, transitionConfig, callbackFunction) {
            return this.transform(this.getMatrix().skewXRad(angle), transitionConfig, callbackFunction);
        },
        /**
         * Skews the node vertically.
         * @method skewY
         * @chainable
         * @param {Number} angle The vertical skew angle specified in degrees.
         * @param {Object} transitionConfig Optional.  If defined, and if the
         * transition module is available, a transition will be used to
         * transform the node.  This object is passed along to the transition
         * method.
         * @param {Function} callbackFunction Optional.  Whether or not
         * transition is used, the callback function, if defined, will get
         * called when the transform is complete.
         */
        skewY: function (angle, transitionConfig, callbackFunction) {
            return this.transform(this.getMatrix().skewY(angle), transitionConfig, callbackFunction);
        },
        /**
         * Skews the node vertically.
         * @method skewYRad
         * @chainable
         * @param {Number} angle The vertical skew angle specified in radians.
         * @param {Object} transitionConfig Optional.  If defined, and if the
         * transition module is available, a transition will be used to
         * transform the node.  This object is passed along to the transition
         * method.
         * @param {Function} callbackFunction Optional.  Whether or not
         * transition is used, the callback function, if defined, will get
         * called when the transform is complete.
         */
        skewYRad: function (angle, transitionConfig, callbackFunction) {
            return this.transform(this.getMatrix().skewYRad(angle), transitionConfig, callbackFunction);
        },
        /**
         * Transforms the node by the given matrix.
         * @method transform
         * @chainable
         * @param {CSSMatrix2d} matrix The 2d transform matrix.
         * @param {Object} transitionConfig Optional.  If defined, and if the
         * transition module is available, a transition will be used to
         * transform the node.  This object is passed along to the transition
         * method.
         * @param {Function} callbackFunction Optional.  Whether or not
         * transition is used, the callback function, if defined, will get
         * called when the transform is complete.
         */
        transform: function (matrix, transitionConfig, callbackFunction) {
            var me = this;
            
            matrix = matrix.toString();
            
            if (transitionConfig && me.transition) {
                return me.transition(_merge(transitionConfig, {
                    transform: matrix
                }), callbackFunction);
            }

            me.setStyle('transform', matrix);
            
            if (callbackFunction) {
                callbackFunction();
            }

            return me;
        },
        /**
         * Translates the node horizontally and vertically.
         * @method translate
         * @chainable
         * @param {Number} x The amount to translate horizontally.
         * @param {Number} y The amount to translate vertically.
         * @param {Object} transitionConfig Optional.  If defined, and if the
         * transition module is available, a transition will be used to
         * transform the node.  This object is passed along to the transition
         * method.
         * @param {Function} callbackFunction Optional.  Whether or not
         * transition is used, the callback function, if defined, will get
         * called when the transform is complete.
         */
        translate: function (x, y, transitionConfig, callbackFunction) {
            return this.transform(this.getMatrix().translate(x, y), transitionConfig, callbackFunction);
        }
    });
}(Y));


}, 'gallery-2012.05.02-20-10' ,{requires:['gallery-cssmatrix2d', 'node-style'], skinnable:false, optional:['transition']});
