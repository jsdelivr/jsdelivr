YUI.add('gallery-composite-image-pixel', function (Y, NAME) {

/**
@module gallery-composite-image-pixel
@author Steven Olmsted
*/
(function (Y) {
    'use strict';

    var _Image = Y.Composite.Image,
        _YArray = Y.Array,

        _imagePrototype = _Image.prototype,

        _cached = Y.cached,
        _defineProperties = Object.defineProperties,
        _isArray = Y.Lang.isArray,

        /**
        This is an experimental array-like interface for interacting with image
        pixels.  A pixel's channel values can be accessed by channel id in the
        same way normal array items are accessed.
        @class Image.Pixel
        @constructor
        @namespace Composite
        @param {Composite.Image} image The image that contains the pixel.
        @param {Number} pixelIndex The pixel's unique index within the image.
        */
        _Class = function (image, pixelIndex) {
            var channelCount = image.channels.length,
                channelIndex = 0,
                properties = {
                    /**
                    The image to which this pixel belongs.
                    @property image
                    @final
                    @type Composite.Image
                    */
                    image: {
                        value: image
                    },
                    /**
                    The number of channels this pixel contains.
                    @property length
                    @final
                    @type Number
                    */
                    length: {
                        value: channelCount
                    },
                    /**
                    The pixel index for this pixel within the image.
                    @property pixelIndex
                    @final
                    @type Number
                    */
                    pixelIndex: {
                        value: pixelIndex
                    }
                };

            for (; channelIndex < channelCount; channelIndex += 1) {
                properties[channelIndex] = {
                    enumerable: true,
                    get: _Class._getChannelGetter(channelIndex),
                    set: _Class._getChannelSetter(channelIndex)
                };
            }

            _defineProperties(this, properties);
        };

    _Class.prototype = {
        /**
        @method toJSON
        @return {[Number]}
        */
        toJSON: function () {
            return _YArray(this);
        },
        /**
        @method toString
        @return {String}
        */
        toString: function () {
            return 'pixel[' + this.toJSON() + ']';
        }
    };

    /**
    @method _getChannelGetter
    @param {Number} channelIndex The specific channel index to get.
    @protected
    @return {Function}
    @static
    */
    _Class._getChannelGetter = _cached(function (channelIndex) {
        return function () {
            return this.image.getValue(this.pixelIndex, channelIndex);
        };
    });

    /**
    @method _getChannelSetter
    @param {Number} channelIndex The specific channel index to set.
    @protected
    @return {Function}
    @static
    */
    _Class._getChannelSetter = _cached(function (channelIndex) {
        return function (value) {
            this.image.setValue(this.pixelIndex, channelIndex, value);
        };
    });

    _Image.Pixel = _Class;

    /**
    Returns an experimental array-like interface for accessing a pixel's data.
    The Pixel objects are cached, so each time getPixel is called for the same
    pixel, the same object will be returned.  Note that the creation of Pixel
    objects is much less efficient than just using the getValue and setValue
    methods.
    @method getPixel
    @for Image
    @param {Number|[Number]} pixelIndexOrLocation This may be either the pixel's
    unique index within the image or an array of dimension indicies.  The length
    of this array must match the number of dimensions in the image.
    @return {Composite.Image.Pixel}
    */
    _imagePrototype.getPixel = function (pixelIndexOrLocation) {
        var me = this,
            pixelCache = me._pixelCache;

        if (_isArray(pixelIndexOrLocation)) {
            pixelIndexOrLocation = me.getPixelIndex(pixelIndexOrLocation);
        }

        if (!pixelCache) {
            pixelCache = {};
            /**
            This pixel cache object will be created on-demand the first time an
            image's getPixel method is called.
            @property _pixelCache
            @protected
            @type Object
            */
            me._pixelCache = pixelCache;
        }

        return pixelCache[pixelIndexOrLocation] || me._getPixel(pixelIndexOrLocation);
    };

    /**
    Creates, caches, and returns a Pixel object.  This method assumes that the
    pixel cache exists and writes to it, but it does not check the cache before
    creating a new object.
    @method _getPixel
    @param {Number} pixelIndex The pixel's unique index within the image.
    @protected
    @return {Composite.Image.Pixel}
    */
    _imagePrototype._getPixel = function (pixelIndex) {
        var pixel = new _Class(this, pixelIndex);
        this._pixelCache[pixelIndex] = pixel;
        return pixel;
    };
}(Y));

}, 'gallery-2013.05.02-22-59', {"requires": ["gallery-composite-image"]});
