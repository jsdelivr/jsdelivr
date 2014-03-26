YUI.add('gallery-composite-image-pixels', function (Y, NAME) {

/**
@module gallery-composite-image-pixels
@author Steven Olmsted
*/
(function (Y) {
    'use strict';

    var _Image = Y.Composite.Image,
        _YArray = Y.Array,

        _imagePrototype = _Image.prototype,

        _defineProperties = Object.defineProperties,

        /**
        This is an experimental array-like interface for interacting with image
        pixels.  An image's pixels can be accessed by pixel index or pixel
        location array in the same way normal array items are accessed.  Note
        that constructing this object is an expensive operation.
        @class Image.Pixels
        @constructor
        @namespace Composite
        @param {Composite.Image} image The image that contains the pixels.
        */
        _Class = function (image) {
            var properties = {
                    /**
                    The image to which these pixels belong.
                    @property image
                    @final
                    @type Composite.Image
                    */
                    image: {
                        value: image
                    },
                    /**
                    The number of pixels this image contains.
                    @property length
                    @final
                    @type Number
                    */
                    length: {
                        value: image.pixelCount
                    }
                };

            image.eachPixelLocation(function (pixelLocation, pixelIndex) {
                var getter = _Class._getPixelGetter(pixelIndex);

                properties[pixelIndex] = {
                    enumerable: true,
                    get: getter
                };

                properties[pixelLocation] = {
                    get: getter
                };
            });

            _defineProperties(this, properties);
        };

    _Class.prototype = {
        /**
        @method toJSON
        @return {[Composite.Image.Pixel]}
        */
        toJSON: function () {
            return _YArray(this);
        },
        /**
        @method toString
        @return {String}
        */
        toString: function () {
            return 'image-pixels[' + this.image + ']';
        }
    };

    /**
    @method _getPixelGetter
    @param {Number} pixelIndex The pixel's unique index within the image.
    @protected
    @return {Function}
    @static
    */
    _Class._getPixelGetter = Y.cached(function (pixelIndex) {
        return function () {
            return this.image.getPixel(pixelIndex);
        };
    });

    _Image.Pixels = _Class;

    /**
    An experimental array-like interface for interacting with the image's
    pixels.  Note that constructing this object is an expensive operation.  It
    will be created lazily the first time it is accessed.
    @property pixels
    @for Image
    @final
    @type Composite.Image.Pixels
    */
    Object.defineProperty(_imagePrototype, 'pixels', {
        enumerable: true,
        get: function () {
            return this._pixels || this._getPixels();
        }
    });

    /**
    Creates and returns a Pixels object for this image.
    @method _getPixels
    @protected
    @return Composite.Image.Pixels
    */
    _imagePrototype._getPixels = function () {
        var pixels = new _Class(this);
        /**
        @property _pixels
        @protected
        @type Composite.Image.Pixels
        */
        this._pixels = pixels;
        return pixels;
    };
}(Y));

}, 'gallery-2013.05.02-22-59', {"requires": ["gallery-composite-image-pixel"]});
