YUI.add('gallery-array-iterate', function (Y, NAME) {

/**
Iterate through an array.
@module gallery-array-iterate
@author Steven Olmsted
 */
(function (Y) {
    'use strict';

    /**
    @method iterate
    @for Array
    @param {Array} array The array to iterate
    @param {Number} [startIndex] The first index to iterate. If left undefined,
    iteration will either start at the beginning of the array if incrementBy is
    positive or at the end of the array if incrementBy is negative.
    @param {Number} incrementBy The interval by which the array will be
    iterated.  Must be a non-zero integer.  Negative values cause the array to
    be iterated backwards.
    @param {Function} iterationFunction The function to call on each iteration.
    This function will receive three arguments: value, index, and array.  If
    this function returns a truthy value, iteration will be terminated.
    @param {Object} [contextObject] The context that will become this in the
    iterationFunction.
    @return {Boolean} Will return true if iteration was terminated early,
    otherwise it will return false.
    @static
    */
    var _iterate = function (array, startIndex, incrementBy, iterationFunction, contextObject) {
        var i = startIndex,
            length = array.length;
        
        if (Y.Lang.isFunction(incrementBy)) {
            return _iterate(array, startIndex < 0 ? length - 1 : 0, startIndex, incrementBy, iterationFunction);
        }

        for (; i >= 0 && i < length; i += incrementBy) {
            if (i in array && iterationFunction.call(contextObject, array[i], i, array)) {
                return true;
            }
        }

        return false;
    };

    Y.Array.iterate = _iterate;
}(Y));

}, 'gallery-2013.11.14-01-08');
