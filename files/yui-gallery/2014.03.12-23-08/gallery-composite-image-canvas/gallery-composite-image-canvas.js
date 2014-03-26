YUI.add('gallery-composite-image-canvas', function (Y, NAME) {

/**
@module gallery-composite-image-canvas
@author Steven Olmsted
*/
(function (Y) {
    'use strict';

    var _number_255 = 255,
        _string_height = 'height',
        _string_width = 'width',

        _Array = Y.Array,
        _Class = Y.namespace('Composite').Image,
        _Math = Math,

        _dataTypes = _Class.dataTypes,

        _dataType_f32 = _dataTypes.f32,
        _dataType_f64 = _dataTypes.f64,
        _dataType_s16 = _dataTypes.s16,
        _dataType_s32 = _dataTypes.s32,
        _dataType_s8 = _dataTypes.s8,
        _dataType_u16 = _dataTypes.u16,
        _dataType_u32 = _dataTypes.u32,
        _dataType_u8 = _dataTypes.u8,

        _prototype = _Class.prototype,

        _cached = Y.cached,
        _createNode = Y.Node.create,
        _each = _Array.each,
        _floor = Math.floor,
        _init = _Class.prototype._init,
        _max = _Math.max,
        _min = _Math.min,
        _one = Y.one,
        _round = _Math.round;

    _prototype._init = function () {
        var supportsCanvas,
            dataType,
            me = this;

        _init.apply(me, arguments);

        supportsCanvas = me.channels.length === 4 && me.dimensions.length === 2;

        if (supportsCanvas) {
            dataType = me._dataType;

            /**
            Returns a value in this image's data type converted from an unsigned
            8-bit integer.
            @method _convertFromU8
            @for Composite.Image
            @param {Number} value
            @param {String} [dataType] The dataType parameter is only used when
            this image's dataType is null.
            @protected
            @return {Number}
            */
            me._convertFromU8 = _Class._getConvertFromU8Method(dataType);

            /**
            Converts a value from this image's data type to an unsigned 8-bit
            integer.
            @method _convertToU8
            @param {Number} value
            @param {String} [dataType] The dataType parameter is only used when
            this image's dataType is null.
            @protected
            @return {Number}
            */
            me._convertToU8 = _Class._getConvertToU8Method(dataType);

            /**
            Copy the data from an ImageData object into this image.
            @method _fromImageData
            @chainable
            @param {ImageData} imageData
            @protected
            */
            me._fromImageData = _Class._getFromImageDataMethod(dataType);

            /**
            Copy the data from this image into the provided ImageData object.
            @method _toImageData
            @param {ImageData} imageData
            @protected
            @return {ImageData}
            */
            me._toImageData = _Class._getToImageDataMethod(dataType);
        }

        /**
        The Y.Composite.Image canvas interface is only supported when the image
        has exactly four channels and two dimensions.  This property reflects
        whether those conditions are met and will conveniently be left undefined
        when `gallery-composite-image-canvas` is not loaded.
        @property supportsCanvas
        @final
        @type Boolean
        */
        me.supportsCanvas = supportsCanvas;
    };

    /**
    Copy the data from a canvas into this image.  The canvas and image
    dimensions have to match or else this becomes a noop.
    @method fromCanvas
    @chainable
    @param {HTMLElement|Node|String} canvasNode
    */
    _prototype.fromCanvas = function (canvasNode) {
        var me = this,

            context,
            dimensions = me.dimensions;

        canvasNode = _one(canvasNode);
        context = canvasNode && _Class._getContext(canvasNode);

        return me.supportsCanvas && context && canvasNode.get(_string_height) === dimensions[1] && canvasNode.get(_string_width) === dimensions[0] ? me._fromImageData(_Class._getImageData(context)) : me;
    };

    /**
    Copy the data from this image into a canvas.  The canvas and image
    dimensions have to match or this may yield unexpected results.
    @method toCanvas
    @param {HTMLElement|Node|String} [canvasNode] If no canvas is provided,
    one will be created.
    @return {Node}
    */
    _prototype.toCanvas = function (canvasNode) {
        var context,
            dimensions = this.dimensions;

        canvasNode = _one(canvasNode) || _createNode('<canvas height="' + dimensions[1] + '" width="' + dimensions[0] + '"></canvas>');

        context = _Class._getContext(canvasNode);
        context.putImageData(this._toImageData(_Class._getImageData(context)), 0, 0);

        return canvasNode;
    };

    /**
    Create and return a new image with a copy of the data from a canvas.
    @method fromCanvas
    @param {HTMLElement|Node|String} canvasNode
    @return {Composite.Image}
    @static
    */
    _Class.fromCanvas = function (canvasNode) {
        canvasNode = _one(canvasNode);

        if (!canvasNode) {
            return null;
        }

        return new _Class({
            channels: [
                _dataType_u8,
                _dataType_u8,
                _dataType_u8,
                _dataType_u8
            ],
            data: _Class._getImageData(_Class._getContext(canvasNode)).data.buffer,
            dimensions: [
                canvasNode.get(_string_width),
                canvasNode.get(_string_height)
            ]
        });
    };

    /**
    Gets a context from a canvas node.
    @method _getContext
    @param {Node} canvasNode
    @protected
    @return {CanvasRenderingContext2D}
    @static
    */
    _Class._getContext = function (canvasNode) {
        return canvasNode.getDOMNode().getContext('2d');
    };

    /**
    Returns a convertFromU8 function that works with the given data type.
    @method _getConvertFromU8Method
    @param {String} dataType
    @protected
    @return {Function}
    @static
    */
    _Class._getConvertFromU8Method = _cached(function (dataType) {
        switch (dataType) {
            case _dataType_f32:
            case _dataType_f64:
                return function (value) {
                    return value / _number_255;
                };
            case _dataType_s16:
            case _dataType_s32:
            case _dataType_u16:
            case _dataType_u32:
            case _dataType_u8:
                return function (value) {
                    return value;
                };
            case _dataType_s8:
                return function (value) {
                    return _floor(value / 2);
                };
        }

        return function (value, dataType) {
            return dataType in _dataTypes ? _Class._getConvertFromU8Method(dataType)(value) : 0;
        };
    });

    /**
    Returns a convertToU8 function that works with the given data type.
    @method _getConvertToU8Method
    @param {String} dataType
    @protected
    @return {Function}
    @static
    */
    _Class._getConvertToU8Method = _cached(function (dataType) {
        switch (dataType) {
            case _dataType_f32:
            case _dataType_f64:
                return function (value) {
                    return _max(0, _min(_number_255, _round(value * _number_255)));
                };
            case _dataType_s16:
            case _dataType_s32:
                return function (value) {
                    return _max(0, _min(_number_255, value));
                };
            case _dataType_s8:
                return function (value) {
                    return _max(0, _round(value * _number_255 / 127));
                };
            case _dataType_u16:
            case _dataType_u32:
                return function (value) {
                    return _min(_number_255, value);
                };
            case _dataType_u8:
                return function (value) {
                    return value;
                };
        }

        return function (value, dataType) {
            return dataType in _dataTypes ? _Class._getConvertToU8Method(dataType)(value) : 0;
        };
    });

    /**
    Returns a fromImageData function that works with the given data type.
    @method _getFromImageDataMethod
    @param {String} dataType
    @protected
    @return {Function}
    @static
    */
    _Class._getFromImageDataMethod = _cached(function (dataType) {
        if (dataType) {
            if (dataType === _dataType_u8) {
                return function (imageData) {
                    this._data = imageData.data;
                    return this;
                };
            }

            return function (imageData) {
                var me = this,

                    dataView = me._dataView;

                _each(imageData.data, function (value, index) {
                    dataView[index] = me._convertFromU8(value);
                });

                return me;
            };
        }

        return function (imageData) {
            var data = imageData.data,
                me = this,

                channels = me.channels,

                channelCount = me.channels.length;

            return me.eachPixelIndex(function (pixelIndex) {
                _each(channels, function (channelDataType, channelIndex) {
                    me._setValue(pixelIndex, channelIndex, me._convertFromU8(data[pixelIndex * channelCount + channelIndex], channelDataType));
                });
            });
        };
    });

    /**
    Get image data from a context.
    @method _getImageData
    @param {CanvasRenderingContext2D} context
    @protected
    @return {ImageData}
    @static
    */
    _Class._getImageData = function (context) {
        var canvasElement = context.canvas;
        return context.getImageData(0, 0, canvasElement.width, canvasElement.height);
    };

    /**
    Returns a toImageData function that works with the given data type.
    @method _getToImageDataMethod
    @param {String} dataType
    @protected
    @return {Function}
    @static
    */
    _Class._getToImageDataMethod = _cached(function (dataType) {
        if (dataType) {
            if (dataType === _dataType_u8) {
                return function (imageData) {
                    imageData.data.set(this._dataView);
                    return imageData;
                };
            }

            return function (imageData) {
                var data = imageData.data,
                    me = this;

                _each(me._dataView, function (value, index) {
                    data[index] = me._convertToU8(value);
                });

                return imageData;
            };
        }

        return function (imageData) {
            var data = imageData.data,
                me = this,

                channels = me.channels,

                channelCount = me.channels.length;

            me.eachPixelIndex(function (pixelIndex) {
                _each(channels, function (channelDataType, channelIndex) {
                    data[pixelIndex * channelCount + channelIndex] = me._convertToU8(me._getValue(pixelIndex, channelIndex), channelDataType);
                });
            });

            return imageData;
        };
    });
}(Y));

}, 'gallery-2013.05.29-23-38', {"requires": ["gallery-composite-image", "node-base"]});
